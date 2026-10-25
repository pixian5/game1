/* ===== 浸泡测试（v0.6.4）=====
 * 开启调试日志，长时间自动推动游戏（连续回复/巡览 App/抽塔罗/推进时间），
 * 每 5s 采样健康指标，检测：定时器泄漏、内存增长、未读爆增、日志异常。
 * 运行：node tools/soak_test.mjs [秒数]
 */
import pw from '/Users/x/code/game1/node_modules/@playwright/test/index.js';
const { chromium } = pw;

const DURATION = Number(process.argv[2] || 90);
const BASE = process.env.FLOW_BASE || 'http://127.0.0.1:4187';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 420, height: 780 } });
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 160)));

await page.goto(BASE + '/?debug=1');
await page.waitForTimeout(1500);
await page.locator('#lock-screen').click();
await page.waitForTimeout(800);

const samples = [];
const t0 = Date.now();
let cycle = 0;

while (Date.now() - t0 < DURATION * 1000) {
  cycle++;
  // 一轮操作：回复所有挂起选项 + 抽塔罗 + 巡览 2 个 App + 推进 30 分钟
  await page.evaluate(() => {
    const e = window.__neonTest.engine;
    // 回复所有挂起 choice（最多 3 个）
    let guard = 0;
    for (const [cid, conv] of Object.entries(e.state.conversations)) {
      if (conv.pendingChoice && guard++ < 3) {
        const opt = conv.pendingChoice.options[0];
        conv.pendingChoice = null;
        try { e.sendMessage(cid, opt.text, e.normalizeOptionEffects(opt)); } catch (_) {}
      }
    }
    // 群聊 choice
    for (const g of Object.values(e.state.groups || {})) {
      if (g.pendingChoice) { g.pendingChoice = null; }
    }
    // 抽塔罗 + 推进时间
    try { e.drawTarot(); } catch (_) {}
    e.advanceTime(30);
  });
  await page.waitForTimeout(500);

  // 巡览交替 App
  const apps = ['messages', 'moments', 'collection', 'endings', 'affection', 'dates'];
  await page.evaluate(a => openApp(a), apps[cycle % apps.length]);
  await page.waitForTimeout(400);

  // 采样
  if (cycle % 3 === 0) {
    const s = await page.evaluate(() => {
      const e = window.__neonTest.engine;
      const D = window.NeonDebug;
      return {
        day: e.state.day, min: e.state.minute,
        timers: e._timers?.size ?? -1,
        pendingMsgs: e.state.pendingMessages?.length ?? -1,
        pendingEvents: e.state.pendingEventDispatches?.length ?? -1,
        msgs: Object.values(e.state.conversations).reduce((a, c) => a + c.messages.length, 0),
        unread: Object.values(e.state.conversations).reduce((a, c) => a + c.unread, 0),
        moments: e.state.moments?.length ?? 0,
        fired: Object.keys(e.state.firedEvents).length,
        issues: D ? D.issues().length : -1,
        errs: D ? D.issues().filter(i => i.level === 'error').length : -1,
        heap: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : -1
      };
    });
    samples.push({ t: Math.round((Date.now() - t0) / 1000), ...s });
    console.log(`+${String(samples.at(-1).t).padStart(3)}s day${String(s.day).padEnd(3)} 定时器${String(s.timers).padEnd(3)} 待发${String(s.pendingMsgs).padEnd(2)} 消息${String(s.msgs).padEnd(4)} 未读${String(s.unread).padEnd(3)} 动态${String(s.moments).padEnd(3)} 堆${s.heap}MB 问题${s.issues}(${s.errs}E)`);
  }
}

// 汇总
const first = samples[0], last = samples.at(-1);
const report = await page.evaluate(() => {
  const D = window.NeonDebug;
  const issues = D ? D.issues() : [];
  return {
    issues: issues.length,
    list: issues.slice(0, 30).map(i => `${i.at} [${i.level}] ${i.tag}: ${i.msg}`)
  };
});

console.log('\n=== 浸泡报告（' + DURATION + 's / ' + cycle + ' 轮）===');
console.log(`定时器: ${first.timers} → ${last.timers}`);
console.log(`待发消息: ${first.pendingMsgs} → ${last.pendingMsgs}`);
console.log(`消息总数: ${first.msgs} → ${last.msgs}`);
console.log(`未读: ${first.unread} → ${last.unread}`);
console.log(`JS 堆: ${first.heap}MB → ${last.heap}MB (Δ${last.heap - first.heap}MB)`);
console.log(`日志问题: ${report.issues}`);
if (report.list.length) {
  console.log('\n--- 问题明细 ---');
  report.list.forEach(l => console.log('  ' + l));
}
if (errs.length) {
  console.log('\n--- 浏览器未捕获错误 ---');
  errs.slice(0, 10).forEach(e => console.log('  ' + e));
}

const fs = await import('node:fs');
const dump = await page.evaluate(() => window.NeonDebug?.dump() || '');
fs.writeFileSync('/tmp/neon-soak.log', dump);

await browser.close();
process.exit(report.issues > 0 || errs.length > 0 ? 2 : 0);
