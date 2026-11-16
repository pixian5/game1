/* ===== 完整真实玩家游玩（v0.7.2）=====
 * 纯 UI 交互到结局。策略循环：
 *   1. 回复所有可见选择  2. 点通知  3. 出行多次推进时间  4. 巡览 App
 *   5. 检查结局屏  6. 无事发生则继续出行
 * 退出条件：结局屏出现 或 超时
 */
import pw from '/Users/x/code/game1/node_modules/@playwright/test/index.js';
const { chromium } = pw;

const BASE = process.env.TEST_BASE || 'http://127.0.0.1:4187';
const TIMEOUT_MIN = Number(process.argv[2] || 15);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 150)));
page.on('console', m => { if (m.type() === 'error' && !/favicon|net::|Failed|quota/.test(m.text())) errs.push('console: ' + m.text().slice(0, 120)); });

const log = [];
const note = m => { log.push(m); console.log(m); };
const shot = async n => { try { await page.screenshot({ path: `/tmp/play/g-${n}.png` }); } catch (_) {} };

// --- 纯 UI 操作函数 ---
const clickAllChoices = () => page.evaluate(() => {
  let n = 0;
  const sels = ['.chat-opt', '#narrator-choice-modal button:not([data-back])', '#dream-screen .dream-opt', '#encounter-screen .dream-opt', '#call-script button'];
  for (const sel of sels) {
    [...document.querySelectorAll(sel)].forEach(b => { if (b.offsetParent) { b.click(); n++; } });
  }
  return n;
});
const clickNotifications = () => page.evaluate(() => {
  const stack = document.getElementById('notif-stack');
  if (!stack) return 0;
  let n = 0;
  [...stack.children].forEach(c => { c.click(); n++; });
  return n;
});
const travel = () => page.evaluate(() => {
  try { openApp('map'); } catch(_) {}
  const items = [...document.querySelectorAll('#map-list .map-item:not(.locked):not(.current)')];
  if (items.length) { items[Math.floor(Math.random() * items.length)].click(); return items.length; }
  const home = document.querySelector('#map-list .map-item');
  if (home) { home.click(); return 1; }
  return 0;
});
const browse = () => page.evaluate(() => {
  const apps = ['messages', 'moments', 'profile', 'contacts', 'tarot', 'mood', 'calendar', 'shop', 'achievements', 'collection', 'hints'];
  const a = apps[Math.floor(Math.random() * apps.length)];
  try { openApp(a); } catch(_) {}
});
const goHome = () => page.evaluate(() => { try { showScreen('home'); } catch(_) {} });
const handleCall = (action) => page.evaluate((act) => {
  if (document.querySelector('.screen.active')?.id !== 'incoming-call') return false;
  const btn = document.querySelector(`[data-call="${act}"]`);
  if (btn && btn.offsetParent) { btn.click(); return true; }
  return false;
}, action);
const checkEnding = () => page.evaluate(() => {
  if (document.querySelector('.screen.active')?.id !== 'ending-screen') return null;
  return document.getElementById('ending-title')?.textContent || '(结局)';
});
// 去消息 App 并打开第一个会话
const goToMessages = () => page.evaluate(() => {
  try { openApp('messages'); } catch(_) {}
  const conv = document.querySelector('#conv-list .conv-item');
  if (conv) conv.click();
});

// ===== 开始 =====
console.log('════ 完整真实玩家游玩（纯 UI，最长 ' + TIMEOUT_MIN + ' 分钟）════');
await page.goto(BASE, { timeout: 30000 });
await page.waitForTimeout(3000);
await shot('g-start');
note('[启动] 锁屏出现');
await page.locator('#lock-screen').click();
await page.waitForTimeout(2500);
note('[主屏] 解锁');

// 等首波消息
await page.waitForTimeout(6000);
const notifCount = await clickNotifications();
note('[序章] 点击了 ' + notifCount + ' 条通知');
await goToMessages();
await page.waitForTimeout(1500);
const bubbles = await page.evaluate(() => document.querySelectorAll('#chat-body .msg').length);
note('[序章] 气泡数: ' + bubbles);
await shot('g-prologue');

// ===== 主循环 =====
const t0 = Date.now();
let cycle = 0;
let endingReached = null;
let totalChoices = 0;
let totalNotifs = 0;
let totalTravels = 0;
let lastNotifCount = 0;
let stallRounds = 0;
let phase = '序章';

while ((Date.now() - t0) < TIMEOUT_MIN * 60 * 1000) {
  cycle++;

  // 1. 处理来电
  if (await handleCall('accept')) {
    note(`[${cycle}] 📞 接听来电`);
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(1200);
      const done = await page.evaluate(() => document.querySelector('.screen.active')?.id !== 'incoming-call');
      if (done) break;
      await clickAllChoices();
    }
    continue;
  }
  if (await handleCall('decline')) { note(`[${cycle}] 📵 拒接`); continue; }

  // 2. 回复选择
  const choices = await clickAllChoices();
  if (choices > 0) {
    totalChoices += choices;
    note(`[${cycle}] ✓ ${choices} 个选择`);
    await page.waitForTimeout(1500);
    continue;
  }

  // 3. 点击通知
  const notifs = await clickNotifications();
  if (notifs > 0) {
    totalNotifs += notifs;
    note(`[${cycle}] 🔔 ${notifs} 条通知`);
    await page.waitForTimeout(1200);
    continue;
  }

  // 4. 出行推进时间（连续 3 次出行 = 1.5 小时）
  for (let t = 0; t < 3; t++) {
    await travel();
    await page.waitForTimeout(600);
  }
  totalTravels += 3;

  // 5. 巡览
  await browse();
  await page.waitForTimeout(800);

  // 6. 检查结局
  endingReached = await checkEnding();
  if (endingReached) {
    note(`🏁 [${cycle}] 🎉 到达结局: ${endingReached}`);
    await shot('g-ending');
    break;
  }

  // 7. 停滞检测（通知数不变 + 无选择 = 停滞）
  const curNotifs = await page.evaluate(() => document.getElementById('notif-stack')?.children.length || 0);
  const hasPendingChoice = await page.evaluate(() =>
    [...document.querySelectorAll('.chat-opt')].some(b => b.offsetParent)
  );
  if (hasPendingChoice) {
    // 还有选择没回完
    const c = await clickAllChoices();
    if (c > 0) { totalChoices += c; continue; }
  }

  // 停滞判断
  if (curNotifs === lastNotifCount && choices === 0) stallRounds++;
  else stallRounds = 0;
  lastNotifCount = curNotifs;

  if (stallRounds >= 5) {
    // 空窗期：连续出行 10 次快速推进半天
    note(`[${cycle}] ⏰ 空窗期（${stallRounds} 轮无新事件），快速推进...`);
    for (let t = 0; t < 10; t++) {
      await travel();
      await page.waitForTimeout(400);
      await clickAllChoices();
    }
    await page.waitForTimeout(2000);
    // 检查结局
    endingReached = await checkEnding();
    if (endingReached) { note(`🏁 到达结局!`); break; }
    stallRounds = 0;
  }

  // 周期截图
  if (cycle % 20 === 0) {
    const info = await page.evaluate(() => {
      const e = window.__neonTest?.engine;
      return e ? `day${e.state.day} ${String(Math.floor(e.state.minute/60)).padStart(2,'0')}:00 消息${Object.values(e.state.conversations).reduce((a,c)=>a+c.messages.length,0)}` : '';
    });
    note(`[${cycle}] 📸 ${info}`);
    await shot('g-cycle' + cycle);
  }

  await page.waitForTimeout(1200);
}

// 最终状态
await shot('g-final');
const finalEnding = await checkEnding();
if (finalEnding) endingReached = finalEnding;
const finalScreen = await page.evaluate(() => document.querySelector('.screen.active')?.id);
const gameState = await page.evaluate(() => {
  const e = window.__neonTest?.engine;
  return e ? {
    day: e.state.day,
    msgs: Object.values(e.state.conversations).reduce((a,c)=>a+c.messages.length,0),
    affection: JSON.stringify(e.state.affection),
    endings: Object.keys(e.state.endingSeen || {}),
    achievements: Object.keys(e.state.achievements || {}).length,
    collected: e.state.collected.length
  } : {};
});

console.log('\n════ 游玩汇总 ════');
console.log(`轮次: ${cycle} | 选择: ${totalChoices} | 通知: ${totalNotifs} | 出行: ${totalTravels}`);
console.log('到达结局: ' + (endingReached || '未到达'));
console.log('最终状态: ' + JSON.stringify(gameState));
console.log('屏幕集: ' + [...new Set(log.filter(l => l.includes('屏:')).map(l => l.match(/屏:(\S+)/)?.[1]))].join(', '));

const report = await page.evaluate(() => {
  const D = window.NeonDebug;
  return D ? { issues: D.issues().length, list: D.issues().slice(0, 30).map(i => `${i.at} [${i.level}] ${i.tag}: ${i.msg}`) } : { issues: 0, list: [] };
});
console.log('调试异常: ' + report.issues);
report.list.forEach(l => console.log('  ' + l));
console.log('浏览器错误: ' + errs.length);
errs.slice(0, 5).forEach(e => console.log('  • ' + e));

console.log('\n=== 结论 ===');
if (endingReached) console.log('✅ 完整游玩到结局: ' + endingReached);
else console.log('⏱ 超时退出（' + TIMEOUT_MIN + ' 分钟）| 最终屏: ' + finalScreen);

const fs = await import('node:fs');
const dump = await page.evaluate(() => window.NeonDebug?.dump() || '');
fs.writeFileSync('/tmp/neon-full-play.log', dump);

await browser.close();
process.exit(0);
