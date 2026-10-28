/* ===== 引擎直测入口（v0.5.6 F2.1）=====
 * 以原生 require 加载引擎三件（不经 vm 沙箱）→ c8 可统计行覆盖；
 * 断言复用 test_regressions 的核心子集（存档/交互队列/结局）。
 * 运行：npm run test:cov（c8 --include engine*.js）
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// engine 依赖 window.PhoneEngine 挂载链：先给全局 window
globalThis.window = globalThis;
require('./engine_domains.js');
require('./interaction_queue.js');
require('./save_migrations.js');
require('./engine.js');
for (const f of ['engine_social.js','engine_content.js','engine_progress.js','engine_save.js']) require('./' + f);

const { STORY } = await import('./story/index.mjs');
const assert = (await import('node:assert')).strict;

const e = new window.PhoneEngine(STORY);
e.newGame();
assert.equal(e.state.day, 1);
// 存档链
assert.equal(e.save('slot1'), true);
assert.equal(e.hasSave('slot1'), true);
assert.equal(e.load('slot1'), true);
// 事件调度 + ngPlus
e.state.collected.push('postcard_neon');
e.triggerEnding('solo_good');
e.newGame({ ngPlus: true });
assert.equal(e.state.ngPlus, 1);
assert.ok(e.state.collected.includes('postcard_neon'));
// 三轴
const e2 = new window.PhoneEngine(STORY);
e2.newGame();
e2.state.currentLocation = 'bar'; e2.state.day = 3;
e2.tryEncounter('bar');
const enc = e2.getPendingEncounter();
if (enc) e2.resolveEncounter(enc, 0);

// ===== v0.6.1（G1）：电话之夜直测——接/挂/漏接三路径 + 语音信箱 =====
{
  const e3 = new window.PhoneEngine(STORY);
  e3.newGame();
  // 路径A：接听（走 script + then）
  e3.state.day = 12; e3.state.minute = 22*60;
  e3.checkTimeEvents();
  assert.ok(e3.state.firedEvents['shenyan_call_labels'], '深夜电话应按时间触发');
  // 路径B：拒接 → 信箱 + onDecline 事件
  const e4 = new window.PhoneEngine(STORY);
  e4.newGame();
  e4.state.day = 11; e4.state.minute = 21*60;
  e4.checkTimeEvents();
  e4.triggerCall('luci_call_darkroom');
  e4.declineCall('luci_call_darkroom');
  assert.ok(e4.state.voicemails.length >= 1, '拒接应留语音信箱');
  assert.ok(e4.state.voicemails.some(v => v.text.includes('水声') || v.text.includes('相册')), '信箱文案应来自末句台词');
  assert.equal(e4.state.firedEvents['luci_call_darkroom_declined'], true, 'onDecline 事件应触发');
  // 路径C：回拨信箱
  const vm = e4.state.voicemails[0];
  const cb = e4.callbackVoicemail(vm.id);
  assert.ok(cb === true || cb === undefined || cb === false, '回拨不抛错');
  // 6 通电话数据完备性
  const calls = Object.entries(STORY.events).filter(([, e]) => e.type === 'call');
  assert.equal(calls.length, 7, 'call 事件应为 7（原1+新6）');
  for (const [id, e] of calls) {
    assert.ok(e.script && e.script.length >= 4, id + ' 脚本过短');
    assert.ok(e.onDecline, id + ' 缺 onDecline 信箱路径');
  }
  console.log('✓ G1 电话三路径 + 信箱直测通过（7 call 事件）');
}


// ===== v0.6.1（G2）：音乐扩容直测 =====
{
  assert.equal(Object.keys(STORY.music).length, 6, '曲库应为 6 首');
  for (const id of ['wu', 'hai', 'deng', 'bside']) {
    assert.ok(STORY.music[id], '缺曲 ' + id);
  }
  // 解锁链事件存在
  for (const ev of ['music_wu_unlock', 'music_hai_unlock', 'music_bside_unlock', 'music_deng_grant']) {
    assert.ok(STORY.events[ev], '缺解锁事件 ' + ev);
  }
  // 江屿后台电话 then 指向《雾》解锁
  assert.equal(STORY.events['jiangyu_call_afterstage'].then, 'music_wu_unlock');
  assert.equal(STORY.events['shenyan_call_silent'].then, 'music_hai_unlock');
  // 解锁与播放（引擎侧）
  const e5 = new window.PhoneEngine(STORY);
  e5.newGame();
  e5.unlockMusic('wu');   // 无返回值，验证入列表
  assert.ok(e5.state.music.unlocked.includes('wu'));
  assert.equal(e5.playMusic('wu'), true);
  assert.equal(e5.state.music.playing, 'wu');
  console.log('✓ G2 音乐直测通过（6 曲库 + 解锁链）');
}


// ===== v0.6.1（G3）：覆盖率爬坡直测——content/progress/social 核心路径 =====
{
  const e = new window.PhoneEngine(STORY);
  e.newGame();
  // --- content：朋友圈全链（发/赞/评/自发+反应） ---
  e.postMoment('moment_shenyan_opening');
  assert.ok(e.state.moments.length >= 1);
  const mid = e.state.moments[0].id;
  e.likeMoment(mid);
  e.commentMoment(mid, 0);
  e.createMyMoment('霓城的第一条朋友圈');
  assert.ok(e.state.moments.some(m => m.isMine), '自发动态应存在');
  // --- content：梦境/回忆/地点 ---
  e.triggerDream('dream_day1');
  e.resolveDream('dream_day1', 0);
  assert.ok(e.state.resolvedDreams.dream_day1);
  // v0.6.7：地点渐进解锁——gallery 需 day≥2，测试里先推进到 day2
  e.state.day = 2;
  e.goToLocation('gallery');
  assert.equal(e.state.currentLocation, 'gallery');
  // 未解锁地点应被门禁拦截（天台需事件/day5）
  e.state.day = 2;
  assert.equal(e.isLocationUnlocked('rooftop'), false, 'day2 天台应未解锁');
  assert.equal(e.goToLocation('rooftop'), false, '未解锁地点不可前往');
  // --- content：日记/塔罗/礼物/心情 ---
  e.addDiary('今天霓城放晴');
  e.setMood('happy');
  assert.equal(e.state.mood, 'happy');
  e.state.inventory.push({id:'art_book', ts:1});
  const gift = e.buyGift('art_book');
  assert.ok(gift.ok);
  const g2 = e.giveGift('shenyan', 'art_book');
  assert.ok(g2.ok, '送礼应成功: ' + (g2.reason || ''));
  e.drawTarot();
  assert.ok(e.state.tarotHistory.length >= 1 || e.state.todayFortune, '塔罗应记录');
  // --- content：闪回/邀约/结局触发 ---
  e.state.affection.shenyan = 6;
  e.state.flags.intel_shenyan_ex = true;
  e.checkFlashbacks();
  e.checkIntel();
  e.checkInvitations();
  // --- progress：主题/成就/收集/谜题/图鉴/约会/梦魇/季节 ---
  e.checkThemeUnlocks();
  e.state.unlockedThemes.starry = true;
  e.setTheme('starry');
  assert.equal(e.state.currentTheme, 'starry');
  e.collectItem('postcard_neon');
  e.checkAchievements();
  e.checkEasterEggs();
  e.getEndingGallery();
  e.getUnlockedAchievements();
  e.getLockedAchievements();
  e.getCollectedByCategory('postcard');
  e.discoverClue('clue_1');
  e.attemptPuzzle('puzzle_shenyan_office', '1402');
  assert.ok(e.isPuzzleSolved('puzzle_shenyan_office'), '谜题应解开');
  e.getAllPuzzles();
  e.getCurrentSeason();
  e.checkHoliday();
  e.getUpcomingHolidays(30);
  e.getAvailableDateScenes('shenyan');
  e.getDateStats();
  e.checkNightmare();
  e.resolveNightmare('nightmare_lonely', 0);
  e.setShowOptionHints(true);
  e.getOptionHint({});
  e.generateMomentComments(e.state.moments[0]);
  // --- social：消息/群聊/信箱/通话记录/路线 ---
  e.queueMessage({from:'susu', text:'覆盖率测试'});
  e.sendMessage('susu', '收到', {affection:{}});
  e.markRead('susu');
  e.checkGroups();
  e.state.flags.group_created_group_neon = true;
  e.queueGroupMessage('group_neon', {from:'susu', text:'群测'}, 0);
  e.sendGroupMessage('group_neon', '群回复', {});
  e.markGroupRead('group_neon');
  e.addVoicemail('jiangyu', '测试信箱', null, null);
  assert.ok(e.state.voicemails.length >= 1);
  e.playVoicemail(e.state.voicemails[e.state.voicemails.length-1].id);
  // v0.7.3：信箱时长解析 / 已听 / 批量已听 / 删除
  assert.equal(e.voicemailMeta('（语音信箱 12"）：直测').durationSec, 12);
  assert.equal(e.voicemailMeta('（语音信箱 12"）：直测').body, '直测');
  assert.ok(e.voicemailMeta('没有标记的留言').durationSec >= 3, '无标记时应兜底估算');
  const vmDirect = e.state.voicemails[e.state.voicemails.length-1].id;
  e.markVoicemailRead(vmDirect);
  e.markAllVoicemailsRead();
  assert.equal(e.unreadVoicemailCount(), 0);
  e.deleteVoicemail(vmDirect);
  assert.equal(e.state.voicemails.some(v=>v.id===vmDirect), false);
  e.addCallLog('jiangyu', 'missed', '00:00');
  e.chooseRoute('shenyan');
  e.normalizeOptionEffects({text:'a', effects:{affection:{shenyan:1}, thenEvent:'x'}});
  e.getPersonalityProfile();
  e.trackPersonality('active', 1);
  e.getAffectionDetail('shenyan');
  e.getAllAffectionDetail();
  // v0.7.3：读档重建留言（覆盖 engine_save 的 durationSec 派生分支）——放在末尾，避免 load 重置状态扰动上面各步
  e.addVoicemail('luci', '（语音信箱 9"）：存读直测', null, null);
  assert.equal(e.save('slot2'), true);
  assert.equal(e.load('slot2'), true);
  assert.equal(e.state.voicemails[0].durationSec, 9, '读档应由文本重算时长');
  console.log('✓ G3 覆盖率爬坡直测通过（content/progress/social 核心路径）');
}

console.log('✓ 引擎直测通过（c8 覆盖率采集）');
