/* ===== 剧情链路自动化测试 v2 ===== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sandbox = {
  window: {},
  localStorage: { getItem: ()=>null, setItem: ()=>{} },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  console: console,
  Date: Date,
  Math: Math,
  Object: Object,
  Array: Array,
  String: String,
  Number: Number,
  Boolean: Boolean,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

vm.runInContext(fs.readFileSync(path.join(__dirname, 'story.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8'), sandbox);

const { STORY, PhoneEngine } = sandbox.window;

const results = [];
function check(name, cond, detail=''){
  results.push({name, pass: !!cond, detail});
  console.log(`${cond?'✓':'✗'} ${name}${detail?' - '+detail:''}`);
}

const engine = new PhoneEngine(STORY);
const sleep = ms => new Promise(r=>setTimeout(r, ms));

// 事件日志（不清空）
const eventLog = [];
['messageReceived','choicePrompt','incomingCall','ending','routeChoiceReady','timeAdvance'].forEach(evt=>{
  engine.on(evt, (payload)=>{
    eventLog.push({type:evt, ...payload, ts:Date.now()});
  });
});

// 等待某事件（找到后从日志中移除，避免下次匹配到旧事件）
async function wait(predicate, timeout=10000, desc='event'){
  const start = Date.now();
  while(Date.now() - start < timeout){
    const idx = eventLog.findIndex(predicate);
    if(idx >= 0) return eventLog.splice(idx, 1)[0];
    await sleep(100);
  }
  console.log(`  [timeout] 等待 ${desc} 超时`);
  return null;
}

// 等待条件成立（轮询 state）
async function waitFor(fn, timeout=15000, desc='condition'){
  const start = Date.now();
  while(Date.now() - start < timeout){
    if(fn()) return true;
    await sleep(200);
  }
  console.log(`  [timeout] 等待 ${desc} 超时`);
  return false;
}

// 等待并触发选择
async function doChoice(convId, optIdx=0, desc=''){
  const pred = e=>e.type==='choicePrompt' && (convId===null || e.convId===convId);
  const evt = await wait(pred, 12000, desc||`选项(${convId})`);
  if(!evt) return false;
  const choice = evt.choice; // 直接用事件 payload 中的 choice
  if(!choice){
    console.log(`  [no choice in event] conv ${evt.convId}`);
    return false;
  }
  const opt = choice.options[optIdx];
  console.log(`  >> 选: ${opt.text}`);
  const conv = engine.state.conversations[evt.convId];
  if(conv) conv.pendingChoice = null;
  engine.sendMessage(evt.convId, opt.text, opt.effects);
  return true;
}

// 接听电话
async function doAnswerCall(){
  const evt = await wait(e=>e.type==='incomingCall', 12000, '来电');
  if(!evt) return false;
  console.log(`  >> 接听: ${evt.name}`);
  const callEventId = Object.entries(STORY.events).find(([id,e])=>e.type==='call' && e.from===evt.from)?.[0];
  const callDef = STORY.events[callEventId];
  // 模拟通话脚本中的 choice 选择
  for(const line of callDef.script){
    if(line.who === 'choice' && line.options[0]?.effects?.affection){
      Object.keys(line.options[0].effects.affection).forEach(k=>
        engine.state.affection[k] += line.options[0].effects.affection[k]);
    }
  }
  engine.addCallLog(evt.from, 'incoming', '03:24');
  if(callDef.then) engine.scheduleEvent(callDef.then);
  return true;
}

// 触发任意 choice（用于查找 narrator 触发的选项）
async function doAnyChoice(optIdx=0, desc=''){
  const evt = await wait(e=>e.type==='choicePrompt', 12000, desc||'任意选项');
  if(!evt) return false;
  const choice = evt.choice;
  if(!choice) return false;
  const opt = choice.options[optIdx];
  console.log(`  >> 选(${evt.convId}): ${opt.text}`);
  const conv = engine.state.conversations[evt.convId];
  if(conv) conv.pendingChoice = null;
  engine.sendMessage(evt.convId, opt.text, opt.effects);
  return true;
}

async function run(){
  console.log('\n=== 剧情链路测试 ===\n');

  console.log('[1] 初始化');
  engine.newGame();
  await sleep(8000); // 等苏苏3条消息发完
  check('苏苏有3条消息', engine.state.conversations.susu.messages.length === 3, `实际:${engine.state.conversations.susu.messages.length}`);

  console.log('[2] 玩家回复苏苏');
  const ok1 = await doChoice('susu', 0, '苏苏选项');
  check('回复苏苏成功', ok1);
  const day2 = await wait(e=>e.type==='timeAdvance' && e.text==='次日清晨', 5000, '次日清晨');
  check('次日清晨', !!day2);

  console.log('[3] 等待沈砚之消息');
  await waitFor(()=> engine.state.conversations.shenyan.messages.length >= 3, 15000, '沈砚之3条消息');
  check('沈砚之3条消息', engine.state.conversations.shenyan.messages.length === 3, `实际:${engine.state.conversations.shenyan.messages.length}`);

  console.log('[4] 等待陆辞重逢+选项');
  const ok2 = await doChoice('luci', 0, '陆辞重逢选项');
  check('回复陆辞成功', ok2);
  const bar = await wait(e=>e.type==='timeAdvance' && e.text==='下班后', 5000, '下班后');
  check('下班后', !!bar);

  console.log('[5] 等待酒吧+江屿+照片');
  await waitFor(()=> engine.state.conversations.luci.messages.length >= 6, 15000, '陆辞酒吧消息');
  check('陆辞酒吧消息(>=6)', engine.state.conversations.luci.messages.length >= 6, `实际:${engine.state.conversations.luci.messages.length}`);
  await waitFor(()=> engine.state.photos.find(p=>p.id==='neon_city'), 10000, '霓城夜景');
  check('霓城夜景解锁', !!engine.state.photos.find(p=>p.id==='neon_city'), `照片数:${engine.state.photos.length}`);

  console.log('[6] 等待江屿选项');
  const ok3 = await doChoice('jiangyu', 0, '江屿加好友');
  check('回复江屿成功', ok3);

  console.log('[7] 等待来电');
  const ok4 = await doAnswerCall();
  check('接听电话成功', ok4);
  await sleep(2000);
  check('音乐《夏》解锁', engine.state.music.unlocked.includes('xia'));

  console.log('[8] 等待第三天');
  const day3 = await wait(e=>e.type==='timeAdvance' && e.text==='第三天', 5000, '第三天');
  check('第三天', !!day3);

  console.log('[9] 沈砚之考验');
  const ok5 = await doChoice('shenyan', 0, '考验选项');
  check('考验选项', ok5);

  console.log('[10] 陆辞关心');
  const ok6 = await doChoice('luci', 0, '关心选项');
  check('关心选项', ok6);

  console.log('[11] 开幕式');
  const open = await wait(e=>e.type==='timeAdvance' && e.text==='开幕式当天', 5000, '开幕式当天');
  check('开幕式当天', !!open);
  const ok7 = await doAnyChoice(0, '开幕式选项');
  check('开幕式选项', ok7);

  console.log('[12] 天台');
  const night = await wait(e=>e.type==='timeAdvance' && e.text==='夜深了', 8000, '夜深了');
  check('夜深了', !!night);
  const ok8 = await doChoice('jiangyu', 0, '天台选项');
  check('天台选项', ok8);
  await waitFor(()=> engine.state.photos.find(p=>p.id==='rooftop_night'), 10000, '天台照片');
  check('天台照片解锁', !!engine.state.photos.find(p=>p.id==='rooftop_night'));

  console.log('[13] 路线选择');
  const routeNight = await wait(e=>e.type==='timeAdvance' && e.text==='一个无眠的夜晚', 8000, '无眠夜晚');
  check('无眠夜晚', !!routeNight);
  const routeReady = await wait(e=>e.type==='routeChoiceReady', 15000, '路线选择');
  check('路线选择出现', !!routeReady);

  console.log('[14] 进入沈砚之线');
  engine.chooseRoute('shenyan');
  await sleep(2000);
  check('进入沈砚之线', engine.state.route === 'shenyan');

  console.log('[15] 南方出差');
  const south = await wait(e=>e.type==='timeAdvance' && e.text==='南方出差', 8000, '南方出差');
  check('南方出差', !!south);
  const ok9 = await doAnyChoice(0, '晚宴选项');
  check('晚宴选项', ok9);

  console.log('[16] 雨夜');
  const rain = await wait(e=>e.type==='timeAdvance' && e.text==='雨夜回程', 8000, '雨夜回程');
  check('雨夜回程', !!rain);

  console.log('[17] 半个月后');
  const half = await wait(e=>e.type==='timeAdvance' && e.text==='半个月后', 10000, '半个月后');
  check('半个月后', !!half);

  console.log('[18] 觉醒/否认选项');
  const ok10 = await doAnyChoice(0, '觉醒选项');
  check('觉醒选项', ok10);

  console.log('[19] 最终抉择');
  const ok11 = await doAnyChoice(0, '最终抉择');
  check('最终抉择', ok11);

  console.log('[20] 结局');
  const ending = await wait(e=>e.type==='ending', 5000, '结局');
  check('结局触发', !!ending, ending?.tag || '');

  // 总结
  console.log('\n=== 总结 ===');
  const passed = results.filter(r=>r.pass).length;
  console.log(`通过: ${passed}/${results.length}`);
  if(passed < results.length){
    console.log('\n失败项:');
    results.filter(r=>!r.pass).forEach(r=>console.log(`  ✗ ${r.name}${r.detail?' - '+r.detail:''}`));
  }
  process.exit(passed === results.length ? 0 : 1);
}

run().catch(e=>{ console.error(e); process.exit(1); });
