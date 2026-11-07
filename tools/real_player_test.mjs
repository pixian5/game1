/* ===== HF Space 真实玩家完整游玩模拟（v2，纯 DOM 信号）=====
 * 不读取引擎内部状态（HF 无测试钩子），只用 DOM 可见元素判断进度：
 * - 聊天气泡数量、选择按钮是否出现、通知、当前屏幕
 * 策略循环：点通知 → 进会话 → 答选项 → 出行推进 → 巡览 → 直到结局屏出现
 */
import path from 'node:path';
import fs from 'node:fs';
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE || 'https://xbzsb-neon-heart.static.hf.space/index.html';
const OUT_DIR = process.env.OUT || path.join(process.cwd(), 'qa-shots', 'real-player');
fs.mkdirSync(OUT_DIR, { recursive: true });
const TIMEOUT_MIN = Number(process.argv[2] || 10);
const browser = await launchBrowser({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 150)));

const log = [];
const note = (msg) => { log.push(msg); console.log('  ' + msg); };
const shot = async (name) => { try { await page.screenshot({ path: path.join(OUT_DIR, `rp2-${name}.png`) }); } catch (_) {} };

// --- 纯 DOM 信号 ---

// 聊天气泡数量（当前会话可见的）
const getBubbleCount = () => page.evaluate(() =>
  document.querySelectorAll('#chat-body .msg').length
);

// 是否有可点击的选择按钮（任何位置）
const hasVisibleChoice = () => page.evaluate(() => {
  const sel = '.chat-opt, #chat-options .chat-opt, #chat-body .choices button, #narrator-choice-modal button:not([data-back]), #dream-screen .dream-opt, #encounter-screen .dream-opt, #call-script button, .choices button';
  return [...document.querySelectorAll(sel)].some(b => b.offsetParent);
});

// 点击所有可见选择
const clickAllChoices = () => page.evaluate(() => {
  let n = 0;
  const sel = '#chat-body .choices button, .chat-choices button, #narrator-choice-modal button:not([data-back]), #dream-screen .dream-opt, #encounter-screen .dream-opt, #call-script button';
  [...document.querySelectorAll(sel)].forEach(b => { if (b.offsetParent) { b.click(); n++; } });
  return n;
});

// 当前激活屏幕
const getActiveScreen = () => page.evaluate(() =>
  document.querySelector('.screen.active')?.id?.replace('-screen', '').replace('-app', '') || '?'
);

// 通知条数
const getNotifCount = () => page.evaluate(() =>
  document.getElementById('notif-stack')?.children.length || 0
);

// 点击所有通知
const clickNotifications = () => page.evaluate(() => {
  const stack = document.getElementById('notif-stack');
  if (!stack) return 0;
  let n = 0;
  [...stack.children].forEach(c => { c.click(); n++; });
  return n;
});

// 点击来电按钮
const handleCall = (action) => page.evaluate((act) => {
  if (document.querySelector('.screen.active')?.id !== 'incoming-call') return false;
  const btn = document.querySelector(`[data-call="${act}"]`);
  if (btn && btn.offsetParent) { btn.click(); return true; }
  return false;
}, action);

// 出行
const travel = () => page.evaluate(() => {
  openApp('map');
  const items = [...document.querySelectorAll('#map-list .map-item:not(.locked):not(.current)')];
  if (items.length) { items[Math.floor(Math.random() * items.length)].click(); return items.length; }
  return 0;
});

// 去消息 App 并打开第一个有未读的会话
const goToMessages = () => page.evaluate(() => {
  openApp('messages');
  const conv = document.querySelector('#conv-list .conv-item');
  if (conv) { conv.click(); return true; }
  return false;
});

// 结局检测
const checkEnding = () => page.evaluate(() => {
  if (document.querySelector('.screen.active')?.id !== 'ending-screen') return null;
  return document.getElementById('ending-title')?.textContent || '(结局)';
});

// ===== 开始 =====
console.log('════ 真实玩家完整游玩 v2（纯 DOM 信号，最长 ' + TIMEOUT_MIN + ' 分钟）════');
await page.goto(BASE, { timeout: 30000 });
await page.waitForTimeout(3000);
await shot('v2-start');
note('[启动] 锁屏出现');
await page.locator('#lock-screen').click();
await page.waitForTimeout(2000);
note('[主屏] 解锁');

// 等首波消息
await page.waitForTimeout(5000);
await clickNotifications();
await page.waitForTimeout(1000);
await goToMessages();
await page.waitForTimeout(1000);
let bubbles = await getBubbleCount();
note('[序章] 气泡数: ' + bubbles);
await shot('v2-prologue');

// ===== 主循环 =====
const t0 = Date.now();
let cycle = 0;
let lastBubbles = 0;
let stallRounds = 0;
let endingReached = null;
let choicesClicked = 0;
let callsHandled = 0;
let notificationsClicked = 0;
let screensVisited = new Set();

while ((Date.now() - t0) < TIMEOUT_MIN * 60 * 1000) {
  cycle++;
  const screen = await getActiveScreen();
  screensVisited.add(screen);

  // 1. 来电优先处理
  if (await handleCall('accept')) {
    callsHandled++;
    note(`[${cycle}] 📞 接听来电`);
    // 通话脚本：逐个点选项直到结束
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(1200);
      if (await getActiveScreen() !== 'incoming-call') break;
      const n = await clickAllChoices();
      if (n) choicesClicked += n;
    }
    await page.waitForTimeout(1500);
    continue;
  }
  if (await handleCall('decline')) {
    callsHandled++;
    note(`[${cycle}] 📵 拒接来电`);
    await page.waitForTimeout(1000);
    continue;
  }

  // 2. 点击所有可见选择
  const clicked = await clickAllChoices();
  if (clicked) { choicesClicked += clicked; note(`[${cycle}] ✓ 点击 ${clicked} 个选择`); await page.waitForTimeout(1000); continue; }

  // 3. 点击通知
  const notifs = await getNotifCount();
  if (notifs > 0) {
    const n = await clickNotifications();
    notificationsClicked += n;
    if (n > 0) note(`[${cycle}] 🔔 点击 ${n} 条通知`);
    await page.waitForTimeout(1000);
    continue;
  }

  // 4. 去消息看看有没有新气泡/选项
  await goToMessages();
  await page.waitForTimeout(800);
  bubbles = await getBubbleCount();

  // 5. 如果有选择按钮（可能在聊天里刚出现），点掉
  const moreChoices = await clickAllChoices();
  if (moreChoices) { choicesClicked += moreChoices; note(`[${cycle}] ✓ 聊天内点击 ${moreChoices} 个选择`); await page.waitForTimeout(800); continue; }

  // 6. 出行推进时间（真实玩家会到处走）
  const spots = await travel();
  await page.waitForTimeout(1200);

  // 7. 巡览（触发渲染和可能的事件检查）
  await page.evaluate(() => { try { openApp('home'); } catch (_) {} });
  await page.waitForTimeout(400);

  // 停滞检测（基于 DOM 气泡数）
  if (bubbles === lastBubbles) stallRounds++; else stallRounds = 0;
  lastBubbles = bubbles;

  if (stallRounds >= 6) {
    // 检查结局
    endingReached = await checkEnding();
    if (endingReached) { note(`🏁 [${cycle}] 到达结局: ${endingReached}`); await shot('v2-ending'); break; }
    // 如果真的停滞了，做一轮激进推进（连续出行多次）
    note(`⚠ [${cycle}] 停滞 ${stallRounds} 轮（气泡${bubbles}），激进推进...`);
    for (let burst = 0; burst < 5; burst++) {
      await travel();
      await page.waitForTimeout(800);
      await clickAllChoices();
      await clickNotifications();
    }
    stallRounds = 0;
  }

  // 周期性截图
  if (cycle % 15 === 0) { await shot('v2-cycle' + cycle); note(`[${cycle}] 📸 截图（气泡${bubbles} 屏幕:${screen}）`); }
  await page.waitForTimeout(1200);
}

// 最终状态
await shot('v2-final');
const finalScreen = await getActiveScreen();
const finalBubbles = await getBubbleCount();
const finalEnding = await checkEnding();
if (finalEnding) { endingReached = finalEnding; note('🏁 最终检测到结局: ' + finalEnding); }

note(`[结束] ${cycle} 轮 / ${choicesClicked} 选择 / ${callsHandled} 电话 / ${notificationsClicked} 通知点击 / 气泡${finalBubbles}`);
note(`[屏幕集] ${[...screensVisited].join(', ')}`);

// 汇总
const report = await page.evaluate(() => {
  const D = window.NeonDebug;
  return D ? { issues: D.issues().length, list: D.issues().slice(0, 30).map(i => `${i.at} [${i.level}] ${i.tag}: ${i.msg}`) } : { issues: '未启用' };
});
console.log('\n════ 体验问题汇总 ════');
console.log('调试日志异常: ' + report.issues);
if (report.list) report.list.forEach(l => console.log('  ' + l));
console.log('浏览器错误: ' + errs.length);
errs.slice(0, 8).forEach(e => console.log('  • ' + e));

console.log('\n=== 结论 ===');
if (endingReached) console.log('✅ 完整游玩到结局: ' + endingReached);
else console.log('⏱ 超时（' + TIMEOUT_MIN + ' 分钟）| 最终屏幕: ' + finalScreen + ' | 气泡: ' + finalBubbles);

const dump = await page.evaluate(() => window.NeonDebug?.dump() || '');
fs.writeFileSync(path.join(OUT_DIR, 'neon-real-v2.log'), dump);

await browser.close();
process.exit(0);
