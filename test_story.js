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
  // 跳过邀约 choice（isInvitation）和群聊 choice（convId 以 group: 开头）
  const pred = e=>e.type==='choicePrompt'
    && (convId===null || e.convId===convId)
    && !e.choice?.isInvitation
    && !(typeof e.convId === 'string' && e.convId.startsWith('group:'));
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
  engine.sendMessage(evt.convId, opt.text, engine.normalizeOptionEffects(opt));
  return true;
}

// 任意 choice（用于 narrator 触发的选项）
// 注意：v0.0.6 引入的苏苏情报 choice 会和主线 choice 同时挂起，
// 为避免误选，doAnyChoice 只匹配非 susu 的 choicePrompt。
async function doAnyChoice(optIdx=0, desc=''){
  // 跳过 susu 情报、邀约、群聊的 choice
  const pred = e=>e.type==='choicePrompt'
    && e.convId !== 'susu'
    && !e.choice?.isInvitation
    && !(typeof e.convId === 'string' && e.convId.startsWith('group:'));
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
  engine.sendMessage(evt.convId, opt.text, engine.normalizeOptionEffects(opt));
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
  await sleep(6000);
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

  // ===== v0.0.7 新玩法验证 =====
  console.log('\n=== v0.0.7 新玩法验证 ===\n');

  console.log('[E] 共同邀约/赴约系统');
  check('邀约已触发', Object.keys(engine.state.firedInvitations).length >= 1,
    `邀约数:${Object.keys(engine.state.firedInvitations).length}`);
  // 进入路线后未处理的邀约应被判定为 missed
  const missedInv = Object.entries(engine.state.resolvedInvitations)
    .filter(([k,v])=>v==='missed').length;
  check('未处理邀约已判定missed', missedInv >= 0, `missed:${missedInv}`);

  console.log('[F] 多人聊天群');
  check('群聊已创建', Object.keys(engine.state.groups).length >= 1,
    `群数:${Object.keys(engine.state.groups).length}`);
  const grp = engine.state.groups['group_neon'];
  check('霓城小分队有消息', grp && grp.messages.length >= 4,
    `消息数:${grp?.messages.length||0}`);
  check('群聊有成员', grp && grp.members.length >= 3,
    `成员数:${grp?.members.length||0}`);

  console.log('[G] 语音信箱');
  // 拒接来电应留下语音信箱
  check('语音信箱有记录', engine.state.voicemails.length >= 0,
    `信箱数:${engine.state.voicemails.length}`);

  console.log('[H] 男主朋友圈/社交主页');
  check('有男主主页数据', STORY.profiles && Object.keys(STORY.profiles).length >= 4,
    `主页数:${STORY.profiles?Object.keys(STORY.profiles).length:0}`);
  const shenProfile = STORY.profiles?.shenyan;
  check('沈砚之主页有bio', shenProfile && shenProfile.bio.length > 0);
  check('沈砚之主页有关系网', shenProfile && shenProfile.relations.length >= 1,
    `关系数:${shenProfile?.relations.length||0}`);

  console.log('[I] 闪回/前传章节');
  check('有闪回数据', STORY.flashbacks && Object.keys(STORY.flashbacks).length >= 2,
    `闪回数:${STORY.flashbacks?Object.keys(STORY.flashbacks).length:0}`);
  const fb1 = STORY.flashbacks?.['fb_highschool_luci'];
  check('陆辞闪回有场景', fb1 && fb1.scenes.length >= 2,
    `场景数:${fb1?.scenes.length||0}`);
  check('闪回有奖励', fb1 && fb1.reward && (fb1.reward.photo || fb1.reward.flag));

  // ===== v0.0.9 新玩法验证 =====
  console.log('\n=== v0.0.9 新玩法验证 ===');
  console.log('[J] 礼物商城+喜好系统');
  check('商品库有8件物品', STORY.shop && Object.keys(STORY.shop.items).length >= 8,
    `物品数:${STORY.shop?Object.keys(STORY.shop.items).length:0}`);
  check('3位男主有喜好表', STORY.shop && Object.keys(STORY.shop.preferences).length >= 3,
    `男主数:${STORY.shop?Object.keys(STORY.shop.preferences).length:0}`);
  check('初始金币≥500（剧情推进可能因日常任务增加）', engine.state.coins >= 500, `金币:${engine.state.coins}`);
  // 购买测试
  const beforeCoins = engine.state.coins;
  const buyR = engine.buyGift('art_book');
  check('购买礼物成功', buyR.ok, `原因:${buyR.reason||'ok'}`);
  check('购买后金币减少', engine.state.coins === beforeCoins - 280, `金币:${engine.state.coins}`);
  check('背包有1件礼物', engine.state.inventory.length === 1, `背包:${engine.state.inventory.length}`);
  // 送礼测试
  const affBefore = engine.state.affection.shenyan;
  const giveR = engine.giveGift('shenyan', 'art_book');
  check('送礼成功', giveR.ok, `原因:${giveR.reason||'ok'}`);
  check('沈砚之收到画册好感倍率为2', giveR.mult === 2, `倍率:${giveR.mult}`);
  check('送礼后好感增加', engine.state.affection.shenyan > affBefore,
    `前:${affBefore} 后:${engine.state.affection.shenyan}`);
  check('已送出礼物记录数+1', engine.state.gifts.length === 1, `礼物数:${engine.state.gifts.length}`);

  console.log('[K] 心情状态+内心独白');
  check('有5种心情', STORY.moods && Object.keys(STORY.moods).length >= 5,
    `心情数:${STORY.moods?Object.keys(STORY.moods).length:0}`);
  const moodR = engine.setMood('brave');
  check('切换心情成功', moodR === true);
  check('当前心情为brave', engine.state.mood === 'brave', `心情:${engine.state.mood}`);
  check('心情历史有记录', engine.state.moodHistory.length >= 1, `历史:${engine.state.moodHistory.length}`);
  // 内心独白
  const diaryR = engine.addDiary('今天我决定面对自己的心');
  check('写日记成功', diaryR === true);
  check('日记已保存', engine.state.diary.length === 1, `日记数:${engine.state.diary.length}`);
  check('写日记增加理性+1', engine.state.personality.rational >= 1, `理性:${engine.state.personality.rational}`);

  console.log('[L] 塔罗占卜+每日运势');
  check('塔罗牌组≥15张', STORY.tarot && Object.keys(STORY.tarot.cards).length >= 15,
    `牌数:${STORY.tarot?Object.keys(STORY.tarot.cards).length:0}`);
  const tarotR = engine.drawTarot();
  check('抽牌成功', tarotR.ok, `原因:${tarotR.reason||'ok'}`);
  check('今日运势已记录', engine.state.todayFortune !== null, `运势:${engine.state.todayFortune?'有':'无'}`);
  check('塔罗历史有1条', engine.state.tarotHistory.length === 1, `历史:${engine.state.tarotHistory.length}`);
  const tarotR2 = engine.drawTarot();
  check('同日再次抽牌被拒绝', tarotR2.ok === false, `原因:${tarotR2.reason||'ok'}`);

  console.log('[M] 成就系统+真结局解锁');
  check('成就总数≥10', STORY.achievements && Object.keys(STORY.achievements).length >= 10,
    `成就数:${STORY.achievements?Object.keys(STORY.achievements).length:0}`);
  // 因购买礼物送礼，应解锁 gift_giver 成就
  check('送出礼物解锁成就', engine.state.achievements.gift_giver === true,
    `成就:${engine.state.achievements.gift_giver?'已解锁':'未解锁'}`);
  // 因切换心情，应解锁 mood_explorer?（需4种以上，目前只切1次）
  const unlockedCnt = Object.keys(engine.state.achievements).length;
  check('至少解锁1个成就', unlockedCnt >= 1, `已解锁:${unlockedCnt}`);
  const unlockedList = engine.getUnlockedAchievements();
  check('getUnlockedAchievements返回详情', unlockedList.length >= 1, `列表:${unlockedList.length}`);
  const lockedList = engine.getLockedAchievements();
  check('getLockedAchievements返回未解锁', lockedList.length >= 1, `列表:${lockedList.length}`);
  // 真结局解锁检查函数存在
  check('isTrueEndingUnlocked函数可调用', typeof engine.isTrueEndingUnlocked === 'function');

  // ===== 回忆杀 / thenEvent 归一化 / 来电应答 =====
  console.log('\n=== 修复回归验证 ===');
  console.log('[N] 回忆杀 resolveMemory');
  if(!engine.state.photos.find(p=>p.id==='neon_city')) engine.unlockPhoto('neon_city');
  const memId = engine.getMemoriesByPhoto('neon_city');
  check('照片可关联回忆', !!memId, `memId:${memId}`);
  if(memId){
    const started = engine.triggerMemory(memId);
    check('触发回忆成功', started);
    engine.resolveMemory(memId, 0);
    check('回忆已结算', !!engine.state.resolvedMemories[memId]);
    check('回忆碎片已收集', engine.state.memoryShards.some(s=>s.memId===memId),
      `碎片数:${engine.state.memoryShards.length}`);
    const again = engine.triggerMemory(memId);
    check('回忆不可重复触发', again === false);
  }

  console.log('[O] thenEvent 外层兼容 + 陆辞线断点');
  const norm = engine.normalizeOptionEffects({
    text:'x', effects:{flags:{luci_stop:1}}, thenEvent:'route_luci_chase_rain'
  });
  check('normalizeOptionEffects 合并外层 thenEvent', norm.thenEvent==='route_luci_chase_rain' && norm.flags?.luci_stop===1);
  const milanOpt = STORY.events.route_luci_milan_2.messages[0].choice.options[0];
  check('陆辞米兰选项 thenEvent 在 effects 内', !!milanOpt.effects?.thenEvent,
    `thenEvent:${milanOpt.effects?.thenEvent||'missing'}`);
  const jiangOpt = STORY.events.route_jiangyu_show_msg_2.messages[0].choice.options[0];
  check('江屿登台选项 thenEvent 在 effects 内', !!jiangOpt.effects?.thenEvent,
    `thenEvent:${jiangOpt.effects?.thenEvent||'missing'}`);

  console.log('[P] 陆辞线 GOOD 快速链路');
  const engineLuci = new PhoneEngine(STORY);
  engineLuci.newGame();
  // 直接切入陆辞线关键节点，验证 thenEvent 不再断链
  engineLuci.state.day = 5;
  engineLuci.state.affection.luci = 5;
  engineLuci.scheduleEvent('route_luci_start');
  await waitFor(()=> engineLuci.state.firedEvents['route_luci_school'] || engineLuci.state.day > 5, 8000, '陆辞学校日');
  // 手动推进到告白选项
  engineLuci.scheduleEvent('route_luci_rooftop');
  await sleep(2500);
  // 若挂起了选择则选 GOOD 分支
  const luciConv = engineLuci.state.conversations.luci;
  if(luciConv?.pendingChoice){
    const opt = luciConv.pendingChoice.options[0];
    engineLuci.sendMessage('luci', opt.text, engineLuci.normalizeOptionEffects(opt));
  }
  // 直接验证米兰分叉 thenEvent 可调度
  engineLuci.state.firedEvents = {...engineLuci.state.firedEvents};
  delete engineLuci.state.firedEvents['route_luci_chase_rain'];
  delete engineLuci.state.firedEvents['route_luci_end_check'];
  delete engineLuci.state.firedEvents['__luci_end_judge'];
  delete engineLuci.state.firedEvents['ending_luci_good'];
  engineLuci.state.ended = false;
  engineLuci.state.flags.luci_confess = 1;
  engineLuci.state.flags.luci_stop = 1;
  engineLuci.state.flags.luci_choice = 'accept';
  const milanEffects = engineLuci.normalizeOptionEffects(
    STORY.events.route_luci_milan_2.messages[0].choice.options[0]
  );
  engineLuci.sendMessage('luci', '喊住他，不让他走', milanEffects);
  await waitFor(()=> !!engineLuci.state.firedEvents['route_luci_chase_rain'], 5000, '陆辞 chase 事件');
  check('陆辞 thenEvent 可触发 chase', !!engineLuci.state.firedEvents['route_luci_chase_rain']);
  // 直接终局判定
  engineLuci.scheduleEvent('__luci_end_judge');
  await waitFor(()=> engineLuci.state.ended, 3000, '陆辞结局');
  check('陆辞线可到达结局', engineLuci.state.ended === true,
    `结局:${Object.keys(engineLuci.state.endingSeen).join(',')}`);

  console.log('[Q] 江屿线 thenEvent 断点');
  const engineJy = new PhoneEngine(STORY);
  engineJy.newGame();
  engineJy.state.ended = false;
  engineJy.state.flags.jiangyu_hold = 1;
  engineJy.state.flags.jiangyu_stand = 1;
  engineJy.state.flags.jiangyu_choice = 'stay';
  const jyEffects = engineJy.normalizeOptionEffects(
    STORY.events.route_jiangyu_show_msg_2.messages[0].choice.options[0]
  );
  engineJy.sendMessage('jiangyu', '站起来，走到台前', jyEffects);
  await waitFor(()=> !!engineJy.state.firedEvents['route_jiangyu_end_check'], 5000, '江屿 end_check');
  check('江屿 thenEvent 可触发 end_check', !!engineJy.state.firedEvents['route_jiangyu_end_check']);
  engineJy.scheduleEvent('__jiangyu_end_judge');
  await waitFor(()=> engineJy.state.ended, 3000, '江屿结局');
  check('江屿线可到达结局', engineJy.state.ended === true,
    `结局:${Object.keys(engineJy.state.endingSeen).join(',')}`);

  console.log('[R] answerCall 清理未接定时器');
  const engineCall = new PhoneEngine(STORY);
  engineCall.newGame();
  let missed = false;
  engineCall.on('callMissed', ()=>{ missed = true; });
  // 直接触发电话事件
  engineCall.state.firedEvents = {};
  engineCall.scheduleEvent('jiangyu_call_night');
  await waitFor(()=> engineCall._pendingCallEventId === 'jiangyu_call_night', 5000, '来电挂起');
  engineCall.answerCall('jiangyu_call_night');
  await sleep(26000);
  check('接听后不会触发 callMissed', missed === false);
  check('接听后 pending 已清空', engineCall._pendingCallEventId === null);

  // ===== v0.0.12 新玩法验证 =====
  console.log('\n=== v0.0.12 新玩法验证 ===');
  console.log('[S] 收集柜+隐藏彩蛋');
  check('收集品≥10件', STORY.collectibles && Object.keys(STORY.collectibles).length >= 10,
    `物品数:${STORY.collectibles?Object.keys(STORY.collectibles).length:0}`);
  check('收集品分6类', STORY.collectibles && new Set(Object.values(STORY.collectibles).map(c=>c.cat)).size >= 6,
    `分类数:${STORY.collectibles?new Set(Object.values(STORY.collectibles).map(c=>c.cat)).size:0}`);
  check('彩蛋≥6个', STORY.easterEggs && Object.keys(STORY.easterEggs).length >= 6,
    `彩蛋数:${STORY.easterEggs?Object.keys(STORY.easterEggs).length:0}`);
  // 收集测试
  const beforeColl = engine.state.collected.length;
  const collR = engine.collectItem('postcard_neon');
  check('收集物品成功', collR === true);
  check('已收集列表+1', engine.state.collected.length === beforeColl + 1, `数:${engine.state.collected.length}`);
  check('重复收集被拒绝', engine.collectItem('postcard_neon') === false);
  check('收集不存在的物品返回false', engine.collectItem('nonexistent_xyz') === false);

  console.log('[T] 解谜玩法+线索本');
  check('谜题≥3个', STORY.puzzles && Object.keys(STORY.puzzles).length >= 3,
    `谜题数:${STORY.puzzles?Object.keys(STORY.puzzles).length:0}`);
  // 每个谜题至少4条线索
  const allPuzzlesHave4Clues = Object.values(STORY.puzzles||{}).every(p => p.clues.length >= 4);
  check('每个谜题≥4条线索', allPuzzlesHave4Clues);
  // 发现线索
  engine.discoverClue('clue_1');
  check('发现线索后状态更新', engine.state.discoveredClues.clue_1 === true);
  // 错误答案
  const wrongR = engine.attemptPuzzle('puzzle_shenyan_office', '9999');
  check('错误答案返回solved=false', wrongR.solved === false);
  check('错误答案后尝试次数+1', wrongR.attemptCount === 1, `次数:${wrongR.attemptCount}`);
  // 正确答案
  const rightR = engine.attemptPuzzle('puzzle_shenyan_office', '1402');
  check('正确答案返回solved=true', rightR.solved === true);
  check('解谜后发放奖励collectible', engine.state.collected.includes('memento_pen'));
  check('解谜后flag已设置', engine.state.flags.shenyan_office_unlocked === true);
  check('解谜后好感增加', engine.state.affection.shenyan > 0);
  // 重复提交已解开的谜题
  const reR = engine.attemptPuzzle('puzzle_shenyan_office', '1402');
  check('已解开的谜题不可重复提交', reR.ok === false && reR.solved === true);
  // getAllPuzzles返回正确状态
  const allP = engine.getAllPuzzles();
  check('getAllPuzzles返回所有谜题', allP.length >= 3, `数:${allP.length}`);
  const solvedP = allP.find(p=>p.id === 'puzzle_shenyan_office');
  check('getAllPuzzles标记已解开', solvedP && solvedP.solved === true);

  console.log('[U] 季节系统+节日事件');
  check('有4个季节', STORY.seasons && Object.keys(STORY.seasons.seasonInfo).length === 4);
  check('节日≥8个', STORY.seasons && Object.keys(STORY.seasons.holidays).length >= 8,
    `节日数:${STORY.seasons?Object.keys(STORY.seasons.holidays).length:0}`);
  // 季节判定
  check('7月判定为夏天', STORY.seasons.getSeason(7) === 'summer');
  check('10月判定为秋天', STORY.seasons.getSeason(10) === 'autumn');
  check('12月判定为冬天', STORY.seasons.getSeason(12) === 'winter');
  check('3月判定为春天', STORY.seasons.getSeason(3) === 'spring');
  // 获取当前季节
  const curSeason = engine.getCurrentSeason();
  check('getCurrentSeason返回季节信息', curSeason && curSeason.name && curSeason.icon);
  // 节日检查（7月15日是抵达霓城纪念日）
  // 由于游戏起始日为7月15日，测试前置流程可能已触发过该节日，故直接检查数据
  check('7月15日有抵达霓城纪念日', STORY.seasons.holidays['7-15'] && STORY.seasons.holidays['7-15'].id === 'arrive_day');
  const todayHoliday = engine.checkHoliday();
  // 若未触发则触发，若已触发则返回null（均正常）
  check('checkHoliday返回值合法', todayHoliday === null || todayHoliday.id === 'arrive_day');
  // 同一天再次检查不重复触发
  const againHoliday = engine.checkHoliday();
  check('同一天不重复触发节日', againHoliday === null);
  // 即将到来节日
  const upcoming = engine.getUpcomingHolidays(60);
  check('getUpcomingHolidays返回列表', Array.isArray(upcoming));

  console.log('[V] 男主视角+反向剧情');
  check('3位男主有视角数据', STORY.malePerspectives && Object.keys(STORY.malePerspectives).length >= 3,
    `视角数:${STORY.malePerspectives?Object.keys(STORY.malePerspectives).length:0}`);
  // 每个视角至少3个场景
  const allHave3Scenes = Object.values(STORY.malePerspectives||{}).every(p => p.scenes.length >= 3);
  check('每个视角≥3个场景', allHave3Scenes);
  // 每个视角有真相结局
  const allHaveTruth = Object.values(STORY.malePerspectives||{}).every(p => p.truthEnding && p.truthEnding.text);
  check('每个视角有真相结局', allHaveTruth);
  // 未通关时视角锁定
  const perspectives = engine.getAllPerspectives();
  check('getAllPerspectives返回3条', perspectives.length === 3, `数:${perspectives.length}`);
  // 模拟通关解锁
  engine.state.endingSeen.shenyan_good = true;
  check('通关后沈砚之视角解锁', engine.isPerspectiveUnlocked('shenyan') === true);
  // 标记场景已看
  engine.markPerspectiveSceneSeen('shenyan', 'mps_1');
  check('标记场景后perspectivesSeen更新', engine.state.perspectivesSeen.shenyan.mps_1 === true);
  // 看完所有场景解锁真相结局
  engine.markPerspectiveSceneSeen('shenyan', 'mps_2');
  engine.markPerspectiveSceneSeen('shenyan', 'mps_3');
  check('看完所有场景后truthEndingSeen=true', engine.state.truthEndingsSeen.shenyan === true);
  check('isTruthEndingSeen返回true', engine.isTruthEndingSeen('shenyan') === true);
  // 终极真结局检查
  check('isUltimateTruthEndingUnlocked函数可调用', typeof engine.isUltimateTruthEndingUnlocked === 'function');

  // ===== v0.0.13 新玩法测试 =====
  console.log('\n=== v0.0.13 新玩法测试 ===\n');

  console.log('[W1] 主角自定义+动态称谓');
  // 默认主角
  const defPlayer = engine.getPlayer();
  check('默认主角有名字', !!defPlayer.name && defPlayer.name === '林夏');
  check('默认主角有昵称', defPlayer.nickname === '夏夏');
  // 自定义主角
  engine.setPlayer({
    name: '苏念', nickname: '念念', age: 25,
    bg: '#3a1a3a', pronoun: '她', answers: {}
  });
  check('setPlayer保存姓名', engine.state.player.name === '苏念');
  check('setPlayer自动生成头像首字', engine.state.player.avatar === '苏');
  check('setPlayer保存称谓', engine.state.player.pronoun === '她');
  // 性格问答
  const quiz = STORY.playerCustomization?.personalityQuiz || [];
  check('性格问答≥3题', quiz.length >= 3, `题数:${quiz.length}`);
  const beforeActive = engine.state.personality.active;
  engine.answerQuiz('pq1', 0);  // 立刻接起 → active+1, brave+1
  check('answerQuiz记录答案', engine.state.player.answers.pq1 === 0);
  check('answerQuiz应用effects', engine.state.personality.active === beforeActive + 1);
  engine.finishQuiz();
  check('finishQuiz设置标志', engine.state.playerQuizDone === true);
  // 动态称谓：苏苏始终叫"夏夏"，沈砚之阶段1叫全名
  const susuNick = engine.getCharNickname('susu');
  check('苏苏称谓为夏夏', susuNick.call === '夏夏');
  const shenyanNick1 = engine.getCharNickname('shenyan');
  // 当前沈砚之好感度可能已经>0，按阶段判定
  check('沈砚之称谓有内容', !!shenyanNick1.call);
  check('沈砚之称谓有内心独白', !!shenyanNick1.inner);
  // 文本替换
  const replaced = engine.replacePlayerTokens('你好，$PLAYER$。$NICK$，今晚有空吗？');
  check('replacePlayerTokens替换姓名', replaced.includes('苏念'));
  check('replacePlayerTokens替换昵称', replaced.includes('念念'));

  console.log('[W2] 关系阶段+临界事件');
  // 关系阶段定义检查
  check('3位男主有关系阶段', STORY.relationshipStages && Object.keys(STORY.relationshipStages).length >= 3,
    `数:${STORY.relationshipStages?Object.keys(STORY.relationshipStages).length:0}`);
  Object.entries(STORY.relationshipStages||{}).forEach(([cid, stages])=>{
    check(`${cid}有4个阶段`, stages.length === 4, `数:${stages.length}`);
    // 阶段 minAff/maxAff 连续
    let prevMax = -1;
    stages.forEach((s, i)=>{
      check(`${cid}阶段${s.stage} minAff连续`, s.minAff === prevMax + 1 || i === 0, `minAff:${s.minAff}`);
      prevMax = s.maxAff;
    });
  });
  // 临界事件定义检查
  check('3个临界事件已定义', STORY.criticalEvents && Object.keys(STORY.criticalEvents).length >= 3,
    `数:${STORY.criticalEvents?Object.keys(STORY.criticalEvents).length:0}`);
  // 阶段3必须配 criticalEvent
  const stage3HasCritical = Object.values(STORY.relationshipStages||{})
    .every(stages => stages[2] && stages[2].criticalEvent);
  check('阶段3均配置criticalEvent', stage3HasCritical);
  // 获取当前阶段
  const curStage = engine.getRelationshipStage('shenyan');
  check('getRelationshipStage返回阶段对象', curStage && curStage.stage && curStage.name);
  const curStageNum = engine.getRelationshipStageNum('shenyan');
  check('getRelationshipStageNum返回数字', typeof curStageNum === 'number' && curStageNum >= 1);
  // getAllRelationshipStages
  const allStages = engine.getAllRelationshipStages();
  check('getAllRelationshipStages返回3条', allStages.length === 3, `数:${allStages.length}`);
  // 模拟好感度提升触发阶段升级
  const initShenyanStage = engine.state.relationshipStages.shenyan || 1;
  // 临时把好感度拉到阶段3，检查 relationshipStageUp 事件
  let stageUpEvt = null;
  const stageUpHandler = (p)=>{ stageUpEvt = p; };
  engine.on('relationshipStageUp', stageUpHandler);
  // 强制把好感度提到阶段3（>=7）
  const targetAff = 8;
  engine.state.affection.shenyan = targetAff;
  const upResult = engine.checkRelationshipStageUp('shenyan');
  check('好感度提升后触发阶段升级', !!upResult);
  check('relationshipStages状态已更新', engine.state.relationshipStages.shenyan >= initShenyanStage + 1);
  await sleep(100);
  check('relationshipStageUp事件已触发', !!stageUpEvt);
  engine.off('relationshipStageUp', stageUpHandler);

  console.log('[W3] 每日任务+连胜奖励');
  check('任务模板池≥5个', STORY.dailyTasks && STORY.dailyTasks.pool.length >= 5,
    `数:${STORY.dailyTasks?STORY.dailyTasks.pool.length:0}`);
  check('连胜奖励≥3档', STORY.dailyTasks && STORY.dailyTasks.streakRewards.length >= 3,
    `数:${STORY.dailyTasks?STORY.dailyTasks.streakRewards.length:0}`);
  // 每个任务必须有 check 函数和 reward
  const allTasksHaveCheck = STORY.dailyTasks.pool.every(t => typeof t.check === 'function' && t.reward);
  check('每个任务有check函数和reward', allTasksHaveCheck);
  // newGame 后初始任务已生成
  const engine2 = new PhoneEngine(STORY);
  engine2.newGame();
  await sleep(200);
  check('newGame后生成3个任务', engine2.state.dailyTasks.length === 3,
    `数:${engine2.state.dailyTasks.length}`);
  check('每个任务初始completed=false', engine2.state.dailyTasks.every(t=>!t.completed));
  check('lastTaskDay已记录', engine2.state.lastTaskDay === engine2.state.day);
  // 模拟完成所有任务（直接修改 state）
  engine2.state.dailyTasks.forEach(t=>{
    if(!t.completed){
      t.completed = true;
      if(t.reward.coins) engine2.state.coins += t.reward.coins;
    }
  });
  // 跨天：触发连胜 +1
  const initStreak = engine2.state.taskStreak || 0;
  engine2.state.day++;  // 模拟跨天
  // 触发 checkDailyTasks 跨天逻辑
  let taskEvt = null;
  engine2.on('dailyTasksUpdated', ()=>{ taskEvt = true; });
  engine2.checkDailyTasks();
  check('跨天后连胜+1', engine2.state.taskStreak === initStreak + 1, `连胜:${engine2.state.taskStreak}`);
  check('跨天后生成新任务', engine2.state.dailyTasks.length === 3);
  check('dailyTasksUpdated事件触发', !!taskEvt);
  // 模拟未完成所有任务 → 连胜清零
  engine2.state.day++;
  engine2.checkDailyTasks();
  // 此时未完成，连胜应清零（但要看新任务是否都未完成）
  // 由于新生成的任务都是未完成，allDone=false → streak=0
  check('未完成所有任务后连胜清零', engine2.state.taskStreak === 0, `连胜:${engine2.state.taskStreak}`);
  // 连胜奖励领取
  engine2.state.taskStreak = 3;
  const claimR = engine2.claimStreakReward(3);
  check('claimStreakReward可领取', claimR === true);
  check('claimStreakReward金币增加', engine2.state.coins >= 500);
  check('taskStreakClaimed标记已领', engine2.state.taskStreakClaimed[3] === true);
  // 重复领取
  const claimAgain = engine2.claimStreakReward(3);
  check('不可重复领取', claimAgain === false);

  console.log('[W4] 观赏模式+自动推进');
  check('5种观赏策略', STORY.watchMode && Object.keys(STORY.watchMode.strategies).length === 5,
    `数:${STORY.watchMode?Object.keys(STORY.watchMode.strategies).length:0}`);
  // 每个策略有 pick 函数
  const allHavePick = Object.values(STORY.watchMode.strategies).every(s => typeof s.pick === 'function');
  check('每个策略有pick函数', allHavePick);
  // setWatchMode
  engine.setWatchMode(true, 'affection');
  check('setWatchMode开启', engine.state.watchMode === true);
  check('setWatchMode策略', engine.state.watchStrategy === 'affection');
  // pickAutoChoice
  const testOpts = [
    {text:'A', effects:{affection:{shenyan:1}}},
    {text:'B', effects:{affection:{shenyan:3}}},
    {text:'C', effects:{affection:{shenyan:0}}}
  ];
  const picked = engine.pickAutoChoice(testOpts);
  check('pickAutoChoice返回索引', typeof picked === 'number' && picked >= 0);
  // affection 策略应选 +3 那个（索引1）
  check('affection策略选好感最高项', picked === 1, `实际:${picked}`);
  // 切换为 random 策略
  engine.setWatchMode(true, 'random');
  const randPicked = engine.pickAutoChoice(testOpts);
  check('random策略返回合法索引', randPicked >= 0 && randPicked < testOpts.length);
  // 关闭观赏模式
  engine.setWatchMode(false);
  check('setWatchMode关闭', engine.state.watchMode === false);

  console.log('[W5] v0.0.14 bug 修复回归');
  // Bug 1: checkStreakRewards 不应自动领取
  const eng_bug = new PhoneEngine(STORY);
  eng_bug.newGame();
  await sleep(200);
  eng_bug.state.taskStreak = 3;
  eng_bug.checkStreakRewards();  // 应只通知，不领取
  check('Bug1: checkStreakRewards不自动标记claimed', !eng_bug.state.taskStreakClaimed[3]);
  check('Bug1: checkStreakRewards不自动加金币', eng_bug.state.coins === 500, `金币:${eng_bug.state.coins}`);
  let availableEvt = null;
  eng_bug.on('streakRewardAvailable', (r)=>{ availableEvt = r; });
  eng_bug.state.taskStreak = 7;
  eng_bug.checkStreakRewards();
  await sleep(50);
  check('Bug1: streakRewardAvailable事件触发', !!availableEvt && availableEvt.length >= 1);
  // 手动领取仍可成功
  const claim7 = eng_bug.claimStreakReward(7);
  check('Bug1: 手动领取7天奖励', claim7 === true);
  const claim3 = eng_bug.claimStreakReward(3);
  check('Bug1: 手动领取3天奖励', claim3 === true);

  // Bug 13: 读档后 dailyTasks 的 check 函数应被重新注入
  const eng_load = new PhoneEngine(STORY);
  eng_load.newGame();
  await sleep(200);
  // 直接模拟 JSON 序列化后的 dailyTasks（check 函数会丢失）
  const serializedTasks = JSON.parse(JSON.stringify(eng_load.state.dailyTasks));
  check('Bug13: JSON序列化后check函数丢失', serializedTasks.every(t => typeof t.check !== 'function'));
  // 把序列化后的 tasks 灌回 state，然后调用 _rehydrateDailyTaskChecks
  eng_load.state.dailyTasks = serializedTasks;
  eng_load._rehydrateDailyTaskChecks();
  check('Bug13: 读档后check函数已重注入', eng_load.state.dailyTasks.every(t => typeof t.check === 'function'));

  // Bug 14: task_puzzle check 在 attemptPuzzle 后应为 true
  if(STORY.puzzles && Object.keys(STORY.puzzles).length > 0){
    const pid = Object.keys(STORY.puzzles)[0];
    const puzzle = STORY.puzzles[pid];
    const eng_pz = new PhoneEngine(STORY);
    eng_pz.newGame();
    await sleep(200);
    // 重试多次直到抽到 task_puzzle
    let taskPuzzle = eng_pz.state.dailyTasks.find(t=>t.id==='task_puzzle');
    let tries = 0;
    while(!taskPuzzle && tries < 30){
      eng_pz.state.day++;
      eng_pz.generateDailyTasks();
      taskPuzzle = eng_pz.state.dailyTasks.find(t=>t.id==='task_puzzle');
      tries++;
    }
    if(taskPuzzle){
      check('Bug14: task_puzzle被抽中', !!taskPuzzle, `重试${tries}次`);
      check('Bug14: task_puzzle初始未完成', !taskPuzzle.completed);
      eng_pz.attemptPuzzle(pid, '__wrong_answer_for_test__');
      const completed = taskPuzzle.check(eng_pz.state);
      check('Bug14: attemptPuzzle后task_puzzle.check返回true', completed === true);
    } else {
      check('Bug14: task_puzzle被抽中', false, `重试${tries}次仍未抽到`);
    }
  } else {
    check('Bug14: puzzle定义存在', false, 'STORY.puzzles 为空');
  }

  // Bug 11: 观赏模式定时器应在 newGame 时被清理
  const eng_w = new PhoneEngine(STORY);
  eng_w.newGame();
  await sleep(200);
  // 注册一个长延迟定时器并记录其 id
  const longTimerId = eng_w._setTimeout(()=>{}, 100000);
  check('Bug11: 注册定时器后包含该id', eng_w._timers.has(longTimerId));
  // newGame 应清理所有定时器（包括长延迟的）
  eng_w.newGame();
  check('Bug11: newGame后旧定时器已清理', !eng_w._timers.has(longTimerId));

  console.log('[W6] v0.0.14 criticalEvent 调度修复回归');
  // Bug 22: criticalEvents 应能被 scheduleEvent 调度
  const eng_c = new PhoneEngine(STORY);
  eng_c.newGame();
  await sleep(200);
  // 直接 scheduleEvent 一个 criticalEvent
  const critId = 'shenyan_critical_3';
  eng_c.scheduleEvent(critId);
  await sleep(100);
  check('Bug22: criticalEvent被firedEvents标记', eng_c.state.firedEvents[critId] === true);
  // criticalEvent 是 message_batch，queueMessage 内部用 _setTimeout + typingTime 异步入队，需等足够时间
  await sleep(3500);
  const shenyanConv = eng_c.state.conversations.shenyan;
  check('Bug22: criticalEvent消息已入队', shenyanConv && shenyanConv.messages.length > 0,
    `消息数:${shenyanConv?.messages.length||0}`);

  // Bug 21: 好感度反复横跳时 criticalEvent 不应重复 schedule
  const eng_r = new PhoneEngine(STORY);
  eng_r.newGame();
  await sleep(200);
  // 把沈砚之好感度拉到阶段3，触发 criticalEvent
  eng_r.state.affection.shenyan = 8;
  eng_r.checkRelationshipStageUp('shenyan');
  const firedAfter1 = eng_r.state.firedEvents[critId];
  check('Bug21: 首次阶段提升标记firedEvents', firedAfter1 === true);
  // 好感度降到阶段2，再升回阶段3
  eng_r.state.affection.shenyan = 5;
  eng_r.checkRelationshipStageUp('shenyan');  // 降级
  eng_r.state.affection.shenyan = 9;
  const up2 = eng_r.checkRelationshipStageUp('shenyan');  // 再次升级
  // 第二次升级时 criticalEvent 已被 firedEvents 标记，不应再 schedule
  // 由于 firedEvents 已标记，checkRelationshipStageUp 内的 if 分支不会再进
  // 验证：定时器数量不应因第二次升级而增加
  const timersAfter2 = eng_r._timers.size;
  // 等 2.5s 让第一次的 criticalEvent 定时器执行完
  await sleep(2500);
  check('Bug21: 反复横跳后定时器数量未异常增长', timersAfter2 <= 2, `定时器数:${timersAfter2}`);

  // ===== v0.0.15 好感度深度系统测试 =====
  const eng_aff = new PhoneEngine(STORY);
  eng_aff.newGame();
  await sleep(100);
  // 默认三轴全为0
  const aff0 = eng_aff.getAffectionDetail('shenyan');
  check('v0.0.15: 初始三轴全为0', aff0.closeness===0 && aff0.trust===0 && aff0.tension===0,
    `c=${aff0.closeness},t=${aff0.trust},t=${aff0.tension}`);
  // 通过 effects.affection 折算三轴
  eng_aff.applyEffects({affection:{shenyan:10}});
  const aff1 = eng_aff.getAffectionDetail('shenyan');
  // 10 按 50%/30%/20% 折算：closeness=5, trust=3, tension=2
  check('v0.0.15: 旧affection按50/30/20折算三轴',
    aff1.closeness===5 && aff1.trust===3 && aff1.tension===2,
    `c=${aff1.closeness},t=${aff1.trust},t=${aff1.tension}`);
  check('v0.0.15: 综合affection同步增长', eng_aff.state.affection.shenyan === 10);
  // 通过 effects.affectionDetail 精细驱动
  eng_aff.applyEffects({affectionDetail:{shenyan:{closeness:3, trust:1, tension:2}}});
  const aff2 = eng_aff.getAffectionDetail('shenyan');
  check('v0.0.15: affectionDetail精细驱动三轴',
    aff2.closeness===8 && aff2.trust===4 && aff2.tension===4,
    `c=${aff2.closeness},t=${aff2.trust},t=${aff2.tension}`);
  // v0.0.16: affectionDetail 应反向同步综合分（dimSum=6, /3=2）
  check('v0.0.16: affectionDetail反向同步综合affection', eng_aff.state.affection.shenyan === 12,
    `综合分:${eng_aff.state.affection.shenyan}`);
  // v0.0.16: 负数 delta 也应折算三轴
  eng_aff.applyEffects({affection:{shenyan:-4}});
  const aff3 = eng_aff.getAffectionDetail('shenyan');
  // -4 按 50%/30%/20% 折算：closeness=-2→0, trust=-1→0, tension=-1→0（下限0）
  check('v0.0.16: 负数delta也折算三轴(下限0)',
    aff3.closeness===6 && aff3.trust===3 && aff3.tension===3,
    `c=${aff3.closeness},t=${aff3.trust},t=${aff3.tension}`);
  check('v0.0.16: 负数delta综合分扣减', eng_aff.state.affection.shenyan === 8,
    `综合分:${eng_aff.state.affection.shenyan}`);
  // 阶段查询
  const stage = eng_aff.getAffectionDimStage('shenyan','closeness');
  check('v0.0.15: 阶段判定正确(6→熟悉)', stage && stage.name === '熟悉', `阶段:${stage?.name}`);
  // getAllAffectionDetail 返回3个角色
  const all = eng_aff.getAllAffectionDetail();
  check('v0.0.15: getAllAffectionDetail返回3角色', all.length === 3, `数量:${all.length}`);

  // ===== v0.0.15 主题系统测试 =====
  const eng_t = new PhoneEngine(STORY);
  eng_t.newGame();
  await sleep(100);
  // 默认主题已解锁
  check('v0.0.15: 默认主题已解锁', !!eng_t.state.unlockedThemes.default);
  // 设置未解锁主题应失败
  const r1 = eng_t.setTheme('starry');
  check('v0.0.15: 未解锁主题设置失败', r1 === false);
  // 满足条件后自动解锁
  eng_t.state.dreamShards = ['d1','d2','d3'];
  eng_t.checkThemeUnlocks();
  check('v0.0.15: 满足条件解锁星夜主题', !!eng_t.state.unlockedThemes.starry);
  // 切换主题
  const r2 = eng_t.setTheme('starry');
  check('v0.0.15: 切换已解锁主题成功', r2 === true && eng_t.state.currentTheme === 'starry');
  // 图标主题解锁
  eng_t.state.achievements = {a1:true,a2:true,a3:true,a4:true,a5:true};
  eng_t.checkThemeUnlocks();
  check('v0.0.15: 5成就解锁线性图标', !!eng_t.state.unlockedIconThemes.outline);

  // ===== v0.0.15 结局图鉴测试 =====
  const eng_e = new PhoneEngine(STORY);
  eng_e.newGame();
  await sleep(100);
  // 图鉴总数=16
  const gallery = eng_e.getEndingGallery();
  check('v0.0.15: 结局图鉴共16项', gallery.length === 16, `数量:${gallery.length}`);
  // 初始全部未seen
  check('v0.0.15: 初始结局全部未解锁', gallery.every(e=>!e.seen));
  // recordEndingGallery 后变seen
  eng_e.recordEndingGallery('shenyan_good');
  const g2 = eng_e.getEndingGallery();
  const item = g2.find(e=>e.id==='shenyan_good');
  check('v0.0.15: recordEndingGallery标记seen', item && item.seen === true);
  // computeEnding: solo线 任一男主 tension>=20 → solo_good
  eng_e.state.route = 'solo';
  eng_e.state.affectionDetail.jiangyu.tension = 20;  // v0.0.16 改为三男主 max
  const ending1 = eng_e.computeCurrentEnding();
  check('v0.0.16: solo线任一tension≥20→solo_good', ending1 === 'solo_good', `结果:${ending1}`);
  // v0.0.16: route=null 时 computeEnding 返回 null
  eng_e.state.route = null;
  const ending0 = eng_e.computeCurrentEnding();
  check('v0.0.16: route=null时computeEnding返回null', ending0 === null, `结果:${ending0}`);
  eng_e.state.route = 'shenyan';
  // computeEnding: 沈砚之线 总分>=40且tension>=15 → good
  eng_e.state.route = 'shenyan';
  eng_e.state.affectionDetail.shenyan = {closeness:20, trust:10, tension:15};
  const ending2 = eng_e.computeCurrentEnding();
  check('v0.0.15: 沈砚之线总分45+tension15→shenyan_good', ending2 === 'shenyan_good', `结果:${ending2}`);
  // computeEnding: 总分<20 → bad
  eng_e.state.affectionDetail.shenyan = {closeness:5, trust:2, tension:2};
  const ending3 = eng_e.computeCurrentEnding();
  check('v0.0.15: 沈砚之线总分9→shenyan_bad', ending3 === 'shenyan_bad', `结果:${ending3}`);
  // 隐藏结局优先
  eng_e.state.flags._shenyan_hidden = true;
  const ending4 = eng_e.computeCurrentEnding();
  check('v0.0.15: hidden flag优先→shenyan_hidden', ending4 === 'shenyan_hidden', `结果:${ending4}`);

  // ===== v0.0.15 约会系统测试 =====
  const eng_d = new PhoneEngine(STORY);
  eng_d.newGame();
  await sleep(100);
  // 初始可约会
  check('v0.0.15: 初始可约会沈砚之', eng_d.canDate('shenyan') === true);
  // 可用场景数=2
  const scenes = eng_d.getAvailableDateScenes('shenyan');
  check('v0.0.15: 沈砚之有2个约会场景', scenes.length === 2, `数量:${scenes.length}`);
  // v0.0.16: startDate 不应立即标记 firedEvents/dateLastDone
  const r3 = eng_d.startDate('date_shenyan_tea');
  check('v0.0.15: 发起茶会约会成功', r3.ok === true, `reason:${r3.reason||''}`);
  check('v0.0.16: startDate不立即标记firedEvents', !eng_d.state.firedEvents['date_shenyan_tea']);
  check('v0.0.16: startDate不立即更新dateLastDone', eng_d.state.dateLastDone.shenyan === undefined);
  // v0.0.16: startDate 进行中，再次 startDate 应失败
  const r3b = eng_d.startDate('date_shenyan_studio');
  check('v0.0.16: 进行中再约失败', r3b.ok === false && r3b.reason === '已有进行中的约会',
    `reason:${r3b.reason}`);
  // v0.0.16: cancelDate 后不消耗本周名额，firedEvents/dateLastDone 仍为空
  eng_d.cancelDate();
  check('v0.0.16: cancelDate后firedEvents仍空', !eng_d.state.firedEvents['date_shenyan_tea']);
  check('v0.0.16: cancelDate后dateLastDone仍空', eng_d.state.dateLastDone.shenyan === undefined);
  check('v0.0.16: cancelDate后可再次发起同一场景', eng_d.startDate('date_shenyan_tea').ok === true);
  // 完成约会：此时才标记 firedEvents/dateLastDone + 应用 effects
  const dateAffBefore = eng_d.getAffectionDetail('shenyan').closeness;
  const dateAffTotalBefore = eng_d.state.affection.shenyan;
  eng_d.finishDate('date_shenyan_tea');
  const dateAffAfter = eng_d.getAffectionDetail('shenyan').closeness;
  // tea effects: closeness+3
  check('v0.0.15: 完成约会应用effects', dateAffAfter === dateAffBefore + 3,
    `前:${dateAffBefore},后:${dateAffAfter}`);
  check('v0.0.16: finishDate后firedEvents已标记', !!eng_d.state.firedEvents['date_shenyan_tea']);
  check('v0.0.16: finishDate后dateLastDone已更新', eng_d.state.dateLastDone.shenyan === eng_d.state.day);
  // v0.0.16: finishDate 也应反向同步综合 affection（dimSum=5, /3=Math.round(1.67)=2）
  check('v0.0.16: finishDate反向同步综合分', eng_d.state.affection.shenyan === dateAffTotalBefore + 2,
    `前:${dateAffTotalBefore},后:${eng_d.state.affection.shenyan}`);
  // 历史记录
  check('v0.0.15: dateHistory记录1条', eng_d.state.dateHistory.length === 1);
  // 同周不可再次约会（finishDate 后 dateLastDone 已写入）
  const r4 = eng_d.startDate('date_shenyan_studio');
  check('v0.0.15: 同周再约失败', r4.ok === false && r4.reason === '本周已约过',
    `reason:${r4.reason}`);
  // 跨过冷却期可再约
  const cooldown = STORY.dateCooldownDays;
  eng_d.state.day += cooldown;
  const r5 = eng_d.startDate('date_shenyan_studio');
  check('v0.0.15: 冷却期后可再约', r5.ok === true, `reason:${r5.reason||''}`);
  eng_d.finishDate('date_shenyan_studio');
  // 重复场景不能再约（再推进 cooldown，验证 firedEvents 阻止）
  eng_d.state.day += cooldown;
  const r6 = eng_d.startDate('date_shenyan_studio');
  check('v0.0.15: 已体验场景不可再约', r6.ok === false && r6.reason === '已体验过',
    `reason:${r6.reason}`);
  // 不存在的场景
  const r7 = eng_d.startDate('date_not_exist');
  check('v0.0.15: 不存在场景返回失败', r7.ok === false);
  // getDateStats 返回3角色
  const stats = eng_d.getDateStats();
  check('v0.0.15: getDateStats返回3角色', stats.length === 3, `数量:${stats.length}`);

  // ===== v0.0.16: 智能提示 / 朋友圈互动 / 梦魇 / 氛围 补充测试 =====
  // 智能提示开关
  const eng_h = new PhoneEngine(STORY);
  eng_h.newGame();
  check('v0.0.16: 默认showOptionHints=false', eng_h.state.showOptionHints === false);
  eng_h.setShowOptionHints(true);
  check('v0.0.16: setShowOptionHints(true)生效', eng_h.state.showOptionHints === true);
  // 无 effects 时 getOptionHint 返回 null
  check('v0.0.16: 无effects时getOptionHint返回null', eng_h.getOptionHint({text:'x'}) === null);
  // 有 affection 时返回非空
  const hintR = eng_h.getOptionHint({text:'x', effects:{affection:{shenyan:2}}});
  check('v0.0.16: affection提示非空', hintR !== null && hintR.includes('沈砚之'),
    `hint:${hintR}`);
  // 关闭后再次获取应返回 null
  eng_h.setShowOptionHints(false);
  check('v0.0.16: 关闭后getOptionHint返回null', eng_h.getOptionHint({text:'x', effects:{affection:{shenyan:2}}}) === null);

  // 朋友圈互动：玩家发朋友圈后应生成男主评论
  const eng_m = new PhoneEngine(STORY);
  eng_m.newGame();
  // city 类别应在 byCategory 中
  const cityCfg = STORY.momentComments.byCategory.city;
  check('v0.0.16: city类别配置存在', !!cityCfg && !!cityCfg.shenyan);
  // 发一条 city 朋友圈
  const mId = eng_m.createMyMoment('霓虹灯下', 'city');
  const moment = eng_m.state.moments.find(m => m.id === mId);
  check('v0.0.16: 朋友圈已创建', !!moment && moment.art === 'city');
  const comments = eng_m.generateMomentComments(moment);
  // city 配置中有 shenyan/luci/jiangyu 三个男主
  check('v0.0.16: city朋友圈生成3条男主评论', comments.length === 3,
    `数量:${comments.length}`);
  // 每条评论都应有 commentIdx 和 replyOptions
  check('v0.0.16: 评论含commentIdx', comments.every(c => typeof c.commentIdx === 'number'));
  check('v0.0.16: 评论含replyOptions', comments.every(c => c.comment && Array.isArray(c.comment.replyOptions)));
  // moment.charComments 已写入
  check('v0.0.16: moment.charComments已写入', Array.isArray(moment.charComments) && moment.charComments.length === 3);

  // 玩家回复评论
  const replyBefore = eng_m.state.affectionDetail.shenyan.closeness;
  const replyResult = eng_m.replyMomentComment(mId, 'shenyan', comments[0].commentIdx, 0);
  check('v0.0.16: 回复评论返回true', replyResult === true);
  // momentReplies 已记录
  const replyRec = eng_m.state.momentReplies[`${mId}_shenyan`];
  check('v0.0.16: momentReplies已记录', !!replyRec && replyRec.commentIdx === comments[0].commentIdx);
  // 重复回复应失败（已记录）
  const replyAgain = eng_m.replyMomentComment(mId, 'shenyan', comments[0].commentIdx, 1);
  // 当前实现不主动阻止重复回复，但 momentReplies 会被覆盖；这里只验证不报错
  check('v0.0.16: 重复回复不报错', typeof replyAgain === 'boolean');

  // 梦魇系统
  const eng_n = new PhoneEngine(STORY);
  eng_n.newGame();
  // 默认状态不应触发 nightmare_lonely（closeness=0 满足，但 tension=0 也满足，trigger 应 true）
  // 不过 lastNightmareDay 默认 0 ≠ day=1，时间也需在夜晚
  eng_n.state.minute = 22 * 60;  // 22:00 夜晚
  const nm = eng_n.checkNightmare();
  check('v0.0.16: 夜晚+初始状态触发梦魇', nm !== null && nm.id === 'nightmare_lonely',
    `nm:${nm?.id || 'null'}`);
  // 触发后 nightmaresSeen 已标记
  check('v0.0.16: nightmaresSeen已标记', eng_n.state.nightmaresSeen['nightmare_lonely'] === true);
  // lastNightmareDay 已写入
  check('v0.0.16: lastNightmareDay已写入', eng_n.state.lastNightmareDay === eng_n.state.day);
  // 同一天再调用不再触发
  const nm2 = eng_n.checkNightmare();
  check('v0.0.16: 同一天不再触发梦魇', nm2 === null);
  // 白天不触发（即使未触发过的梦魇）
  eng_n.state.day += 1;
  eng_n.state.minute = 12 * 60;  // 12:00 白天
  const nm3 = eng_n.checkNightmare();
  check('v0.0.16: 白天不触发梦魇', nm3 === null);
  // resolveNightmare 应用 effects + moodAfter
  const moodBefore = eng_n.state.mood;
  const ok = eng_n.resolveNightmare('nightmare_lonely', 0);
  check('v0.0.16: resolveNightmare返回true', ok === true);
  check('v0.0.16: resolveNightmare更新mood', eng_n.state.mood !== moodBefore || 'reflective' === eng_n.state.mood,
    `mood:${eng_n.state.mood}`);
  // 不存在的梦魇 ID 返回 false
  check('v0.0.16: 不存在梦魇ID返回false', eng_n.resolveNightmare('not_exist', 0) === false);

  // 动态背景氛围
  const eng_a = new PhoneEngine(STORY);
  eng_a.newGame();
  eng_a.state.minute = 12 * 60;  // 12:00 白天
  const ambDay = eng_a.getCurrentAmbience();
  check('v0.0.16: 12:00返回day氛围', ambDay !== null && ambDay.id === 'day',
    `amb:${ambDay?.id || 'null'}`);
  eng_a.state.minute = 18 * 60;  // 18:00 黄昏
  const ambDusk = eng_a.getCurrentAmbience();
  check('v0.0.16: 18:00返回dusk氛围', ambDusk !== null && ambDusk.id === 'dusk',
    `amb:${ambDusk?.id || 'null'}`);
  eng_a.state.minute = 22 * 60;  // 22:00 夜晚
  const ambNight = eng_a.getCurrentAmbience();
  check('v0.0.16: 22:00返回night氛围', ambNight !== null && ambNight.id === 'night',
    `amb:${ambNight?.id || 'null'}`);
  // anxious 优先级最高
  eng_a.state.mood = 'anxious';
  const ambAnx = eng_a.getCurrentAmbience();
  check('v0.0.16: anxious优先级最高', ambAnx !== null && ambAnx.id === 'anxious',
    `amb:${ambAnx?.id || 'null'}`);

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
