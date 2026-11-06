/* ===== 极简真实玩家模拟（v3）=====
 * 每 2 秒：找并点击一个可见 .chat-opt / 选项按钮 / 来电按钮。
 * 没有复杂逻辑，只有「看到就点」。
 */
import pw from '/Users/x/code/game1/node_modules/@playwright/test/index.js';
const { chromium } = pw;

const BASE = 'https://xbzsb-neon-heart.static.hf.space/index.html';
const DURATION_SEC = Number(process.argv[2] || 300);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 150)));
page.on('console', m => { if (m.type() === 'error' && !/favicon|net::|Failed|quota/.test(m.text())) errs.push(m.text().slice(0, 100)); });

const log = [];
const note = m => { log.push(m); console.log(m); };

await page.goto(BASE, { timeout: 30000 });
await page.waitForTimeout(3000);
await page.locator('#lock-screen').click();
await page.waitForTimeout(2000);
note('[启动] 已解锁');

const t0 = Date.now();
let clicks = 0, calls = 0, choices = 0, maxNotif = 0;
let cycle = 0;

while ((Date.now() - t0) < DURATION_SEC * 1000) {
  cycle++;
  // 1) 点击任何可见的选项按钮（聊天/旁白/梦境/偶遇/通话脚本）
  const clicked = await page.evaluate(() => {
    const sels = ['.chat-opt', '#narrator-choice-modal button:not([data-back])', '#dream-screen .dream-opt', '#encounter-screen .dream-opt', '#call-script button'];
    for (const sel of sels) {
      const btn = [...document.querySelectorAll(sel)].find(b => b.offsetParent);
      if (btn) { const t = btn.textContent.trim().slice(0, 25); btn.click(); return t; }
    }
    return null;
  });
  if (clicked) { clicks++; choices++; note(`  [${cycle}] ✓ 点击: ${clicked}`); }

  // 2) 处理来电
  const call = await page.evaluate(() => {
    if (document.querySelector('.screen.active')?.id !== 'incoming-call') return null;
    const btn = document.querySelector('[data-call="accept"]');
    if (btn && btn.offsetParent) { btn.click(); return '接听'; }
    return null;
  });
  if (call) { calls++; note(`  [${cycle}] 📞 ${call}`); }

  // 3) 点击通知
  const notif = await page.evaluate(() => {
    const c = document.querySelector('#notif-stack .notif');
    if (c) { const t = c.textContent.trim().slice(0, 30); c.click(); return t; }
    return null;
  });
  if (notif) { note(`  [${cycle}] 🔔 通知: ${notif}`); }

  // 4.5) 出行推进时间（地图选非当前地点，或回"家"）
  const traveled = await page.evaluate(() => {
    try {
      openApp('map');
      const items = [...document.querySelectorAll('#map-list .map-item:not(.locked):not(.current)')];
      if (items.length) { items[Math.floor(Math.random() * items.length)].click(); return items.length; }
      const home = document.querySelector('#map-list .map-item');
      if (home) { home.click(); return 1; }
    } catch(_) {}
    return 0;
  });
  if (traveled) {
    await page.waitForTimeout(800);
    // v0.7.2：出行后回聊天屏继续（否则卡在 map-app）
    await page.evaluate(() => { try { openApp('messages'); } catch(_) {} });
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      const conv = document.querySelector('#conv-list .conv-item');
      if (conv) conv.click();
    });
    await page.waitForTimeout(500);
  }

  // 5) 确保在聊天屏（如果在主屏且有未读）
  const scr = await page.evaluate(() => document.querySelector('.screen.active')?.id);
  if (scr === 'home-screen') {
    const hasUnread = await page.evaluate(() => {
      try { return Object.values(window.STORY ? {} : {}).length > 0; } catch(_) { return false; }
    });
    // 简单策略：去消息看看
    await page.evaluate(() => { try { openApp('messages'); } catch(_) {} });
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      const conv = document.querySelector('#conv-list .conv-item');
      if (conv) conv.click();
    });
    await page.waitForTimeout(500);
  }

  // 5) 状态采样
  if (cycle % 25 === 0) {
    const s = await page.evaluate(() => ({
      screen: document.querySelector('.screen.active')?.id,
      notifs: document.getElementById('notif-stack')?.children.length || 0,
      chatOpts: document.querySelectorAll('.chat-opt').length
    }));
    note(`  [${cycle}] 📊 屏:${s.screen} 通知:${s.notifs} 选项:${s.chatOpts}`);
  }

  await page.waitForTimeout(2000);
}

// 汇总
const finalVer = await page.evaluate(() => document.querySelector('meta[name=version]')?.content);
const finalScreen = await page.evaluate(() => document.querySelector('.screen.active')?.id);
console.log('\n=== 结果 ===');
console.log(`版本: ${finalVer} | 屏幕: ${finalScreen}`);
console.log(`总操作: 点击${clicks} 选择${choices} 电话${calls} | 轮次${cycle}`);
console.log(`页面错误: ${errs.length}`);
errs.slice(0, 5).forEach(e => console.log('  • ' + e));

const fs = await import('node:fs');
const dump = await page.evaluate(() => window.NeonDebug?.dump() || '');
fs.writeFileSync('/tmp/neon-v3.log', dump);

await browser.close();
process.exit(errs.length > 0 ? 2 : 0);
