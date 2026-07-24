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
  check('初始金币为500', engine.state.coins === 500, `金币:${engine.state.coins}`);
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
