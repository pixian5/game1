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
for(const file of ['story.js', 'engine.js']){
  vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), sandbox);
}
const {STORY, PhoneEngine} = sandbox.window;

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

test('存储写入异常会显式失败', ()=>{
  const saved = sandbox.localStorage.setItem;
  sandbox.localStorage.setItem = () => { throw new Error('quota'); };
  const e = engine();
  assert.equal(e.save('slot1'), false);
  sandbox.localStorage.setItem = saved;
});

console.log('全部回归测试通过');
