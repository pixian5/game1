const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const storage = new Map();
const sandbox = {
  window: {},
  localStorage: {
    getItem: key => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value)
  },
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  console,
  Date,
  Math,
  Object,
  Array,
  String,
  Number,
  Boolean
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for(const file of ['story.js', 'interaction_queue.js', 'save_migrations.js', 'engine.js']){
  vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), sandbox);
}
const {STORY, PhoneEngine, SaveMigrations} = sandbox.window;

function engine(){ return new PhoneEngine(STORY); }
function test(name, fn){
  fn();
  console.log(`✓ ${name}`);
}

test('导入存档会规范化类型、文本和时间', ()=>{
  const e = engine();
  const result = e.importSave(JSON.stringify({save:{
    slot:'slot1', time:'<img src=x onerror=alert(1)>', note:'<script>x</script>',
    state:{day:'invalid', dailyTasks:{bad:true}, moments:[{id:'x', text:'<img src=x>', author:'me'}]}
  }}), 'slot1');
  assert.equal(result.ok, true);
  assert.equal(e.load('slot1'), true);
  assert.equal(e.state.day, 1);
  assert.equal(Array.isArray(e.state.dailyTasks), true);
  assert.equal(e.state.moments[0].text, '<img src=x>');
  assert.equal(e._disableAutoSave, false);
  assert.match(e.listSaveSlots().find(s=>s.slot==='slot1').time, /^\d{4}-\d\d-\d\dT/);
});

test('结局状态立即持久化', ()=>{
  const e = engine();
  e.startAutoSave();
  assert.equal(e.triggerEnding('shenyan_good'), true);
  assert.equal(e.hasSave('auto'), true);
  assert.equal(e.getAllSaves().auto.state.ended, true);
  e.stopAutoSave();
});

test('临界事件延迟调度不会被 firedEvents 吞掉', ()=>{
  const e = engine();
  const queued = [];
  e._setTimeout = fn => { queued.push(fn); return queued.length; };
  e.state.affection.shenyan = 8;
  e.checkRelationshipStageUp('shenyan');
  assert.equal(e.state.firedEvents.shenyan_critical_3, undefined);
  queued.shift()();
  assert.equal(e.state.firedEvents.shenyan_critical_3, true);
  while(queued.length) queued.shift()();
  assert.ok(e.state.conversations.shenyan.messages.length > 0);
});

test('梦境、约会、朋友圈回复均为幂等操作', ()=>{
  const e = engine();
  assert.equal(e.triggerDream('dream_day1'), true);
  assert.equal(e.resolveDream('dream_day1', 0), true);
  assert.equal(e.resolveDream('dream_day1', 0), false);
  assert.equal(e.state.dreamShards.length, 1);

  assert.equal(e.startDate('date_shenyan_tea').ok, true);
  assert.equal(e.finishDate('date_shenyan_tea'), true);
  assert.equal(e.finishDate('date_shenyan_tea'), false);

  const id = e.createMyMoment('边界测试', 'city');
  const moment = e.state.moments.find(m=>m.id===id);
  const comments = e.generateMomentComments(moment);
  assert.equal(e.replyMomentComment(id, 'shenyan', comments[0].commentIdx, 0), true);
  assert.equal(e.replyMomentComment(id, 'shenyan', comments[0].commentIdx, 1), false);
});

test('梦魇在选择前保持待解决状态，选择后才结算', ()=>{
  const e = engine();
  e.state.minute = 22 * 60;
  const nightmare = e.checkNightmare();
  assert.equal(nightmare.id, 'nightmare_lonely');
  assert.equal(e.state.activeNightmare, 'nightmare_lonely');
  assert.equal(e.state.nightmaresSeen.nightmare_lonely, undefined);
  assert.equal(e.resolveNightmare('nightmare_lonely', 0), true);
  assert.equal(e.state.activeNightmare, null);
  assert.equal(e.state.nightmaresSeen.nightmare_lonely, true);
  assert.ok(STORY.moods[e.state.mood]);
});

test('每日任务只计入当前游戏日', ()=>{
  const e = engine();
  e.state.day = 2;
  e.state.lastTaskDay = 2;
  e.state.conversations.shenyan.messages.push({from:'me', day:1, text:'昨天'});
  e.state.moments.push({author:'me', day:1});
  e.state.locationVisits.push({locId:'home', day:1});
  const pool = Object.fromEntries(STORY.dailyTasks.pool.map(task=>[task.id, task]));
  assert.equal(pool.task_reply.check(e.state), false);
  assert.equal(pool.task_moment.check(e.state), false);
  assert.equal(pool.task_explore.check(e.state), false);
  e.sendMessage('shenyan', '今天');
  e.createMyMoment('今天的动态');
  e.state.locationVisits.push({locId:'home', day:2});
  assert.equal(pool.task_reply.check(e.state), true);
  assert.equal(pool.task_moment.check(e.state), true);
  assert.equal(pool.task_explore.check(e.state), true);
});

test('所有剧情收藏品都有可调用的获得路径', ()=>{
  const e = engine();
  ['intro_susu', 'moment_shenyan_opening_evt', 'bar_invitation', 'route_shenyan_south', 'route_luci_start', 'route_luci_school', 'route_jiangyu_start', 'route_jiangyu_show'].forEach(id=>e.scheduleEvent(id));
  ['postcard_neon','ticket_gallery','ticket_bar','postcard_sea','memento_camera','postcard_school','recording_xia','evidence_photo'].forEach(id=>assert.ok(e.state.collected.includes(id), id));
  e.chooseRoute('shenyan');
  assert.ok(e.state.collected.includes('stamp_route'));
  e.addVoicemail('shenyan', '留言', '', null);
  e.playVoicemail(e.state.voicemails[0].id);
  assert.ok(e.state.collected.includes('recording_msg'));
});

test('刷新后会恢复尚未送达的开场消息', ()=>{
  const e = engine();
  const queued = [];
  e._setTimeout = fn => { queued.push(fn); return queued.length; };
  e.newGame();
  assert.equal(e.state.conversations.susu.messages.length, 0);
  assert.ok(e.state.pendingMessages.length > 0);
  assert.equal(e.save('slot1'), true);

  const restored = engine();
  const resumed = [];
  restored._setTimeout = fn => { resumed.push(fn); return resumed.length; };
  assert.equal(restored.load('slot1'), true);
  assert.ok(restored.state.pendingMessages.length > 0);
  while(resumed.length) resumed.shift()();
  assert.equal(restored.state.conversations.susu.messages.length, 3);
});

test('存档保留会话选项与朋友圈互动配置', ()=>{
  const e = engine();
  e.state.conversations.susu.pendingChoice = {
    prompt:'继续？',
    options:[{text:'继续', hint:'推进剧情', effects:{flags:{resume_test:1}, thenEvent:'intro_susu'}}]
  };
  e.postMoment('moment_shenyan_opening');
  assert.equal(e.save('slot1'), true);
  const restored = engine();
  assert.equal(restored.load('slot1'), true);
  assert.equal(restored.state.conversations.susu.pendingChoice.options[0].text, '继续');
  assert.ok(restored.state.moments[0].commentOptions.length > 0);
  assert.equal(restored.commentMoment('moment_shenyan_opening', 0), true);
});

test('读档会恢复进行中的路线、旁白、偶遇与来电', ()=>{
  const routeEventId = Object.entries(STORY.events).find(([, evt])=>evt.type === 'route_choice')[0];
  const route = engine();
  route.scheduleEvent(routeEventId);
  assert.equal(route.state.pendingInteraction.type, 'route_choice');
  assert.equal(route.save('slot1'), true);
  const restoredRoute = engine();
  assert.equal(restoredRoute.load('slot1'), true);
  assert.equal(restoredRoute.state.pendingInteraction.type, 'route_choice');
  assert.equal(restoredRoute.chooseRoute('solo'), true);
  assert.equal(restoredRoute.state.pendingInteraction, null);

  const narrator = engine();
  narrator.state.pendingMessages.push({
    id:'message_narrator_choice', from:'narrator', text:'请选择', dueAt:Date.now(),
    choice:{prompt:'继续？', options:[{text:'继续', effects:{flags:{narrator_resume:true}}}]}, thenEvent:null, followup:null
  });
  narrator._deliverPendingMessage('message_narrator_choice');
  assert.equal(narrator.state.pendingInteraction.type, 'narrator_choice');
  assert.equal(narrator.save('slot1'), true);
  const restoredNarrator = engine();
  assert.equal(restoredNarrator.load('slot1'), true);
  assert.equal(restoredNarrator.state.pendingInteraction.choice.options[0].text, '继续');
  restoredNarrator.sendMessage('narrator', '继续', {});
  assert.equal(restoredNarrator.state.pendingInteraction, null);

  const encounter = engine();
  encounter.scheduleEvent('inv_shenyan_studio_scene');
  assert.equal(encounter.state.pendingInteraction.type, 'encounter');
  assert.equal(encounter.save('slot1'), true);
  const restoredEncounter = engine();
  assert.equal(restoredEncounter.load('slot1'), true);
  const savedEncounter = restoredEncounter.getPendingEncounter();
  assert.equal(savedEncounter.id, 'inv_shenyan_studio_scene');
  assert.equal(restoredEncounter.resolveEncounter(savedEncounter, 0), true);
  assert.equal(restoredEncounter.state.pendingInteraction, null);

  const call = engine();
  const callTimers = [];
  call._setTimeout = fn => { callTimers.push(fn); return callTimers.length; };
  call.triggerCall('jiangyu_call_night');
  assert.equal(call.state.pendingInteraction.type, 'call');
  assert.equal(call.save('slot1'), true);
  const restoredCall = engine();
  const resumedTimers = [];
  restoredCall._setTimeout = fn => { resumedTimers.push(fn); return resumedTimers.length; };
  assert.equal(restoredCall.load('slot1'), true);
  assert.equal(restoredCall.state.pendingInteraction.eventId, 'jiangyu_call_night');
  assert.equal(restoredCall._pendingCallEventId, 'jiangyu_call_night');
  assert.equal(resumedTimers.length, 1);
  restoredCall.answerCall('jiangyu_call_night');
  assert.equal(restoredCall.state.pendingInteraction, null);
});

test('读档会恢复梦境、追问、临界事件与时间推进', ()=>{
  const dream = engine();
  assert.equal(dream.triggerDream('dream_day1'), true);
  assert.equal(dream.save('slot1'), true);
  const restoredDream = engine();
  assert.equal(restoredDream.load('slot1'), true);
  assert.equal(restoredDream.state.activeDream, 'dream_day1');
  assert.equal(restoredDream.triggerDream('dream_day1'), false);

  const followup = engine();
  const followupTimers = [];
  followup._setTimeout = fn => { followupTimers.push(fn); return followupTimers.length; };
  followup.queueMessage({from:'shenyan', text:'在吗？', followup:{text:'算了。', delay:30, affection:{shenyan:-1}}});
  followupTimers[1]();
  assert.equal(followup.state.pendingFollowups.length, 1);
  assert.equal(followup.save('slot1'), true);
  const restoredFollowup = engine();
  const resumedFollowupTimers = [];
  restoredFollowup._setTimeout = fn => { resumedFollowupTimers.push(fn); return resumedFollowupTimers.length; };
  assert.equal(restoredFollowup.load('slot1'), true);
  assert.equal(restoredFollowup.state.pendingFollowups.length, 1);
  resumedFollowupTimers.shift()();
  assert.equal(restoredFollowup.state.conversations.shenyan.messages.at(-1).text, '算了。');

  const critical = engine();
  const criticalTimers = [];
  critical._setTimeout = fn => { criticalTimers.push(fn); return criticalTimers.length; };
  critical.state.affection.shenyan = 8;
  critical.checkRelationshipStageUp('shenyan');
  assert.equal(critical.state.pendingEventDispatches.some(item=>item.eventId === 'shenyan_critical_3'), true);
  assert.equal(critical.save('slot1'), true);
  const restoredCritical = engine();
  const resumedCriticalTimers = [];
  restoredCritical._setTimeout = fn => { resumedCriticalTimers.push(fn); return resumedCriticalTimers.length; };
  assert.equal(restoredCritical.load('slot1'), true);
  resumedCriticalTimers.shift()();
  assert.equal(restoredCritical.state.firedEvents.shenyan_critical_3, true);

  const timeAdvance = engine();
  const timeTimers = [];
  timeAdvance._setTimeout = fn => { timeTimers.push(fn); return timeTimers.length; };
  timeAdvance.scheduleEvent('day2_morning');
  assert.equal(timeAdvance.state.pendingTimeAdvances.length, 1);
  assert.equal(timeAdvance.save('slot1'), true);
  const restoredTime = engine();
  const resumedTimeTimers = [];
  restoredTime._setTimeout = fn => { resumedTimeTimers.push(fn); return resumedTimeTimers.length; };
  assert.equal(restoredTime.load('slot1'), true);
  assert.equal(restoredTime.state.pendingTimeAdvances.length, 1);
  resumedTimeTimers.shift()();
  assert.equal(restoredTime.state.day, 2);
});

test('v2 单例交互存档会迁移为 v3 队列', ()=>{
  const e = engine();
  const routeEventId = Object.entries(STORY.events).find(([, evt])=>evt.type === 'route_choice')[0];
  const legacy = {
    v: 2,
    slot: 'slot1',
    state: {
      route: null,
      pendingInteraction: {type:'route_choice', eventId:routeEventId},
      conversations: {susu:{messages:[]}}
    }
  };
  const migrated = SaveMigrations.migrate(legacy);
  assert.equal(migrated.v, 3);
  assert.equal(migrated.state.pendingInteractions.length, 1);
  assert.equal(migrated.state.pendingInteractions[0].eventId, routeEventId);
  assert.equal(e.importSave(legacy, 'slot1').ok, true);
  assert.equal(e.load('slot1'), true);
  assert.equal(e.getPendingInteractions()[0].type, 'route_choice');
});

test('多个来电可并发排队并逐个处理', ()=>{
  const e = engine();
  e.story.events.test_call_secondary = {...e.story.events.jiangyu_call_night, from:'shenyan'};
  e._setTimeout = () => 1;
  e.triggerCall('jiangyu_call_night', Date.now() + 60000);
  e.triggerCall('test_call_secondary', Date.now() + 60000);
  assert.equal(e.getPendingInteractions().filter(item=>item.type === 'call').length, 2);
  e.declineCall('jiangyu_call_night');
  assert.equal(e.getPendingInteractions().filter(item=>item.type === 'call').length, 1);
  assert.equal(e.getPendingInteractions()[0].eventId, 'test_call_secondary');
});

test('停止自动存档会注销状态监听器', ()=>{
  const e = engine();
  e.startAutoSave();
  assert.equal(e.listeners.stateChange.length, 1);
  e.stopAutoSave();
  assert.equal(e.listeners.stateChange.length, 0);
  e.startAutoSave();
  assert.equal(e.listeners.stateChange.length, 1);
  e.stopAutoSave();
});

test('继续游戏选择时间最新的存档', ()=>{
  const e = engine();
  e.state.day = 1;
  assert.equal(e.save('auto'), true);
  e.state.day = 9;
  assert.equal(e.save('slot1'), true);
  assert.equal(e.continueGame(), true);
  assert.equal(e.state.day, 9);
});

test('存储写入异常会显式失败', ()=>{
  const saved = sandbox.localStorage.setItem;
  sandbox.localStorage.setItem = () => { throw new Error('quota'); };
  const e = engine();
  assert.equal(e.save('slot1'), false);
  sandbox.localStorage.setItem = saved;
});

console.log('全部回归测试通过');
