/* ===== 剧情链路自动化测试 v3 =====
 * 覆盖新玩法：朋友圈、梦境碎片、性格画像、限时回复、自由输入
 * 主线：序章 → 沈砚之线 GOOD END
 */
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

// ===== 事件日志 =====
const eventLog = [];
['messageReceived','choicePrompt','incomingCall','ending','routeChoiceReady',
 'timeAdvance','dreamStart','dreamResolved','momentPosted','momentUpdate',
 'photoUnlocked','musicUnlocked'].forEach(evt=>{
  engine.on(evt, (payload)=>{
    eventLog.push({type:evt, ...payload, ts:Date.now()});
  });
});

// 等待某事件（找到后从日志中移除）
async function wait(predicate, timeout=12000, desc='event'){
  const start = Date.now();
  while(Date.now() - start < timeout){
    const idx = eventLog.findIndex(predicate);
    if(idx >= 0) return eventLog.splice(idx, 1)[0];
    await sleep(80);
  }
  console.log(`  [timeout] 等待 ${desc} 超时`);
  return null;
}

async function waitFor(fn, timeout=15000, desc='condition'){
  const start = Date.now();
  while(Date.now() - start < timeout){
    if(fn()) return true;
    await sleep(150);
  }
  console.log(`  [timeout] 等待 ${desc} 超时`);
  return false;
}

// 等待并触发选择
async function doChoice(convId, optIdx=0, desc=''){
  const pred = e=>e.type==='choicePrompt' && (convId===null || e.convId===convId);
  const evt = await wait(pred, 12000, desc||`选项(${convId})`);
  if(!evt) return false;
  const choice = evt.choice;
  if(!choice){
    console.log(`  [no choice in event] conv ${evt.convId}`);
    return false;
  }
  const opt = choice.options[optIdx];
  if(!opt){
    console.log(`  [no opt ${optIdx}] options: ${choice.options.map(o=>o.text).join('|')}`);
    return false;
  }
  console.log(`  >> 选(${evt.convId}): ${opt.text}`);
  const conv = engine.state.conversations[evt.convId];
  if(conv) conv.pendingChoice = null;
  engine.sendMessage(evt.convId, opt.text, opt.effects);
  return true;
}

// 任意 choice（用于 narrator 触发的选项）
// 注意：v0.0.6 引入的苏苏情报 choice 会和主线 choice 同时挂起，
// 为避免误选，doAnyChoice 只匹配非 susu 的 choicePrompt。
async function doAnyChoice(optIdx=0, desc=''){
  const pred = e=>e.type==='choicePrompt' && e.convId !== 'susu';
  const evt = await wait(pred, 12000, desc||'任意选项');
  if(!evt) return false;
  const opt = evt.choice.options[optIdx];
  if(!opt){
    console.log(`  [no opt ${optIdx}] options: ${evt.choice.options.map(o=>o.text).join('|')}`);
    return false;
  }
  console.log(`  >> 选(${evt.convId}): ${opt.text}`);
  const conv = engine.state.conversations[evt.convId];
  if(conv) conv.pendingChoice = null;
  engine.sendMessage(evt.convId, opt.text, opt.effects);
  return true;
}

// 清空挂起的苏苏情报 choice（选第 optIdx 个），避免干扰主线 doAnyChoice
async function drainSusuIntel(optIdx=0){
  let drained = 0;
  for(;;){
    const idx = eventLog.findIndex(e=>e.type==='choicePrompt' && e.convId==='susu');
    if(idx < 0) break;
    const evt = eventLog.splice(idx, 1)[0];
    const opt = evt.choice.options[optIdx];
    if(opt){
      console.log(`  >> 清苏苏情报: ${opt.text}`);
      engine.state.conversations.susu.pendingChoice = null;
      engine.sendMessage('susu', opt.text, opt.effects);
      drained++;
    }
    await sleep(200);
  }
  return drained;
}

// ===== 梦境自动处理 =====
async function doDream(optIdx=0, desc=''){
  const evt = await wait(e=>e.type==='dreamStart', 10000, desc||'梦境');
  if(!evt) return false;
  const dreamId = evt.dreamId;
  const dream = evt.dream;
  if(!dreamId || !dream){
    console.log(`  [no dreamId]`);
    return false;
  }
  const opt = dream.options[optIdx];
  console.log(`  >> 梦: ${dream.title} → ${opt.text}`);
  engine.resolveDream(dreamId, optIdx);
  // 等 dreamResolved
  await wait(e=>e.type==='dreamResolved', 5000, '梦境完成');
  return true;
}

// ===== 来电接听 =====
async function doAnswerCall(){
  const evt = await wait(e=>e.type==='incomingCall', 12000, '来电');
  if(!evt) return false;
  console.log(`  >> 接听: ${evt.name}`);
  const callDef = STORY.events[evt.eventId];
  if(!callDef) return false;
  // 应用 script 中所有 choice 的第一个选项 effects
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

async function run(){
  console.log('\n=== 剧情链路测试 v3（含新玩法）===\n');

  // ===== 序章 =====
  console.log('[1] 序章：苏苏欢迎消息');
  engine.newGame();
  await waitFor(()=> engine.state.conversations.susu.messages.length >= 3, 12000, '苏苏3条消息');
  check('苏苏有3条消息', engine.state.conversations.susu.messages.length === 3,
    `实际:${engine.state.conversations.susu.messages.length}`);

  console.log('[2] 回复苏苏 → 触发梦境');
  const ok1 = await doChoice('susu', 0, '苏苏选项');
  check('回复苏苏成功', ok1);

  console.log('[3] 第一夜梦境');
  const okDream1 = await doDream(0, '第一夜梦境');
  check('第一夜梦境完成', okDream1);
  check('收集梦境碎片≥1', engine.state.dreamShards.length >= 1,
    `碎片:${engine.state.dreamShards.length}`);

  console.log('[4] 次日清晨');
  const day2 = await wait(e=>e.type==='timeAdvance' && e.text==='次日清晨', 8000, '次日清晨');
  check('次日清晨', !!day2);

  console.log('[5] 沈砚之3条消息');
  await waitFor(()=> engine.state.conversations.shenyan.messages.length >= 3, 12000, '沈砚之3条消息');
  check('沈砚之3条消息', engine.state.conversations.shenyan.messages.length === 3,
    `实际:${engine.state.conversations.shenyan.messages.length}`);

  console.log('[6] 沈砚之朋友圈发布');
  await waitFor(()=> engine.state.moments.find(m=>m.id==='moment_shenyan_opening'), 8000, '沈砚之朋友圈');
  check('沈砚之朋友圈已发布', !!engine.state.moments.find(m=>m.id==='moment_shenyan_opening'));

  console.log('[7] 陆辞重逢 + 选项');
  const ok2 = await doChoice('luci', 0, '陆辞重逢选项');
  check('回复陆辞成功', ok2);

  console.log('[8] 下班后 → 酒吧');
  const bar = await wait(e=>e.type==='timeAdvance' && e.text==='下班后', 8000, '下班后');
  check('下班后', !!bar);
  await waitFor(()=> engine.state.conversations.luci.messages.length >= 6, 12000, '陆辞酒吧消息');
  check('陆辞酒吧消息(>=6)', engine.state.conversations.luci.messages.length >= 6,
    `实际:${engine.state.conversations.luci.messages.length}`);

  console.log('[9] 霓城夜景 + 陆辞朋友圈');
  await waitFor(()=> engine.state.photos.find(p=>p.id==='neon_city'), 8000, '霓城夜景');
  check('霓城夜景解锁', !!engine.state.photos.find(p=>p.id==='neon_city'),
    `照片数:${engine.state.photos.length}`);
  await waitFor(()=> engine.state.moments.find(m=>m.id==='moment_luci_neon'), 8000, '陆辞朋友圈');
  check('陆辞朋友圈已发布', !!engine.state.moments.find(m=>m.id==='moment_luci_neon'));

  console.log('[10] 江屿登场 + 选项');
  const ok3 = await doChoice('jiangyu', 0, '江屿加好友');
  check('回复江屿成功', ok3);

  console.log('[11] 江屿来电');
  const ok4 = await doAnswerCall();
  check('接听电话成功', ok4);
  await waitFor(()=> engine.state.music.unlocked.includes('xia'), 6000, '《夏》解锁');
  check('音乐《夏》解锁', engine.state.music.unlocked.includes('xia'));

  console.log('[12] 江屿朋友圈 + 第二夜梦境');
  await waitFor(()=> engine.state.moments.find(m=>m.id==='moment_jiangyu_bar'), 8000, '江屿朋友圈');
  check('江屿朋友圈已发布', !!engine.state.moments.find(m=>m.id==='moment_jiangyu_bar'));
  const okDream2 = await doDream(0, '第二夜梦境');
  check('第二夜梦境完成', okDream2);
  check('收集梦境碎片≥2', engine.state.dreamShards.length >= 2,
    `碎片:${engine.state.dreamShards.length}`);

  console.log('[13] 第三天 + 沈砚之考验');
  const day3 = await wait(e=>e.type==='timeAdvance' && e.text==='第三天', 8000, '第三天');
  check('第三天', !!day3);
  const ok5 = await doChoice('shenyan', 0, '考验选项');
  check('考验选项', ok5);

  console.log('[14] 陆辞关心 + 第三夜梦境');
  const ok6 = await doChoice('luci', 0, '关心选项');
  check('关心选项', ok6);
  const okDream3 = await doDream(0, '第三夜梦境');
  check('第三夜梦境完成', okDream3);
  check('收集梦境碎片≥3', engine.state.dreamShards.length >= 3,
    `碎片:${engine.state.dreamShards.length}`);

  console.log('[15] 开幕式当天');
  const open = await wait(e=>e.type==='timeAdvance' && e.text==='开幕式当天', 8000, '开幕式当天');
  check('开幕式当天', !!open);
  await waitFor(()=> engine.state.moments.find(m=>m.id==='moment_shenyan_opening_day'), 8000, '开幕式朋友圈');
  check('开幕式朋友圈已发布', !!engine.state.moments.find(m=>m.id==='moment_shenyan_opening_day'));
  // 清掉可能挂起的苏苏情报 choice，避免干扰
  await drainSusuIntel(0);
  const ok7 = await doChoice('luci', 0, '开幕式选项');
  check('开幕式选项', ok7);

  console.log('[16] 天台');
  const night = await wait(e=>e.type==='timeAdvance' && e.text==='夜深了', 8000, '夜深了');
  check('夜深了', !!night);
  const ok8 = await doChoice('jiangyu', 0, '天台选项');
  check('天台选项', ok8);
  await waitFor(()=> engine.state.photos.find(p=>p.id==='rooftop_night'), 8000, '天台照片');
  check('天台照片解锁', !!engine.state.photos.find(p=>p.id==='rooftop_night'));

  console.log('[17] 路线选择');
  const routeNight = await wait(e=>e.type==='timeAdvance' && e.text==='一个无眠的夜晚', 8000, '无眠夜晚');
  check('无眠夜晚', !!routeNight);
  const routeReady = await wait(e=>e.type==='routeChoiceReady', 12000, '路线选择');
  check('路线选择出现', !!routeReady);

  console.log('[18] 进入沈砚之线');
  engine.chooseRoute('shenyan');
  await sleep(1500);
  check('进入沈砚之线', engine.state.route === 'shenyan');

  console.log('[19] 南方出差 + 晚宴选项');
  const south = await wait(e=>e.type==='timeAdvance' && e.text==='南方出差', 8000, '南方出差');
  check('南方出差', !!south);
  const ok9 = await doAnyChoice(0, '晚宴选项');
  check('晚宴选项', ok9);

  console.log('[20] 雨夜回程');
  const rain = await wait(e=>e.type==='timeAdvance' && e.text==='雨夜回程', 8000, '雨夜回程');
  check('雨夜回程', !!rain);

  console.log('[21] 半个月后 + 觉醒选项');
  const half = await wait(e=>e.type==='timeAdvance' && e.text==='半个月后', 8000, '半个月后');
  check('半个月后', !!half);
  const ok10 = await doChoice('luci', 0, '觉醒选项');
  check('觉醒选项', ok10);

  console.log('[22] 最终抉择');
  const ok11 = await doAnyChoice(0, '最终抉择');
  check('最终抉择', ok11);

  console.log('[23] 结局');
  const ending = await wait(e=>e.type==='ending', 6000, '结局');
  check('结局触发', !!ending, ending?.tag || '');

  // ===== 新玩法综合验证 =====
  console.log('\n=== 新玩法综合验证 ===\n');

  console.log('[A] 朋友圈互动测试');
  // 找到沈砚之开幕式朋友圈，点赞并评论
  const m1 = engine.state.moments.find(m=>m.id==='moment_shenyan_opening');
  if(m1){
    const beforeLikes = m1.likes.length;
    const liked = engine.likeMoment('moment_shenyan_opening');
    check('点赞朋友圈成功', liked);
    await waitFor(()=> m1.likes.length > beforeLikes, 4000, '点赞数+1');
    check('点赞数+1', m1.likes.length > beforeLikes);
    // 等待角色回复评论
    const beforeComments = m1.comments.length;
    await waitFor(()=> m1.comments.length > beforeComments, 5000, '角色回复');
    check('点赞后角色回复', m1.comments.length > beforeComments);
  } else {
    check('点赞朋友圈成功', false, '未找到动态');
  }

  // 评论互动
  const m2 = engine.state.moments.find(m=>m.id==='moment_luci_neon');
  if(m2){
    const beforeComments = m2.comments.length;
    const commented = engine.commentMoment('moment_luci_neon', 0);
    check('评论朋友圈成功', commented);
    await waitFor(()=> m2.comments.length > beforeComments, 5000, '评论数+1');
    check('评论后角色回复', m2.comments.length > beforeComments);
  } else {
    check('评论朋友圈成功', false, '未找到动态');
  }

  console.log('[B] 性格画像');
  const profile = engine.getPersonalityProfile();
  check('性格画像有3个维度', profile.traits.length === 3,
    `维度:${profile.traits.length}`);
  check('梦境碎片≥3', profile.shards >= 3, `碎片:${profile.shards}`);
  check('性格画像有非零分', profile.traits.some(t=>t.score > 0),
    `分数:${profile.traits.map(t=>t.score).join(',')}`);
  console.log(`  性格: ${profile.traits.map(t=>`${t.dim}=${t.value}(${t.score})`).join(' | ')}`);
  console.log(`  碎片: ${profile.shardDetails.map(s=>s.shard).join(', ')}`);

  console.log('[C] 玩家自发动动态');
  const myMomentId = engine.createMyMoment('测试：今天霓城下雨了', null);
  check('玩家发布动态成功', !!engine.state.moments.find(m=>m.id===myMomentId));
  // 等待角色可能来点赞
  await sleep(4000);
  const myMoment = engine.state.moments.find(m=>m.id===myMomentId);
  check('玩家动态有角色互动', myMoment && myMoment.likes.length > 0,
    `点赞数:${myMoment?.likes.length||0}`);

  console.log('[D] 全流程状态检查');
  check('游戏已结束', engine.state.ended === true);
  check('已记录结局', Object.keys(engine.state.endingSeen).length >= 1);
  check('好感度沈砚之>0', engine.state.affection.shenyan > 0,
    `沈:${engine.state.affection.shenyan}`);
  check('好感度陆辞>0', engine.state.affection.luci > 0,
    `陆:${engine.state.affection.luci}`);
  check('好感度江屿>0', engine.state.affection.jiangyu > 0,
    `江:${engine.state.affection.jiangyu}`);
  check('朋友圈动态≥4', engine.state.moments.length >= 4,
    `动态:${engine.state.moments.length}`);
  check('相册照片≥2', engine.state.photos.length >= 2,
    `照片:${engine.state.photos.length}`);
  check('通话记录≥1', engine.state.callLog.length >= 1,
    `通话:${engine.state.callLog.length}`);

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
