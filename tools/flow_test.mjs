/* ===== 全流程自动跑测（v0.6.4）=====
 * 用 ?debug=1 打开游戏，自动走：新开局 → 各 App 巡览 → 消息回复 → 电话接/拒 → 塔罗/约会/商店
 * → 推进到结局 → 二周目，全程收集 NeonDebug 异常。
 * 运行：node tools/flow_test.mjs   （需本地 test_server 已启动于 4187）
 */
import pw from '/Users/x/code/game1/node_modules/@playwright/test/index.js';
const { chromium } = pw;

const BASE = process.env.FLOW_BASE || 'http://127.0.0.1:4187';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 420, height: 780 } });
const consoleErrors = [];
page.on('pageerror', e => consoleErrors.push('pageerror: ' + String(e).slice(0, 200)));

const steps = [];
const mark = async (name) => {
  const info = await page.evaluate(() => {
    const e = window.__neonTest?.engine;
    return {
      screen: document.querySelector('.screen.active')?.id || '?',
      day: e?.state.day, min: e?.state.minute,
      notifs: document.getElementById('notif-stack')?.children.length ?? -1,
      unread: e ? Object.values(e.state.conversations).reduce((a, c) => a + (c.unread || 0), 0) : -1,
      timers: e?._timers?.size ?? -1,
      pendingMsgs: e?.state.pendingMessages?.length ?? -1,
      issues: window.NeonDebug ? window.NeonDebug.issues().length : -1
    };
  });
  steps.push({ name, ...info });
  console.log(`  · ${name}: 屏=${info.screen} day${info.day} 未读${info.unread} 通知${info.notifs} 定时器${info.timers} 待发${info.pendingMsgs} 问题${info.issues}`);
};

// 进入游戏
await page.goto(BASE + '/?debug=1&verbose=0');
await page.waitForTimeout(1500);
console.log('\n=== 1. 启动 ===');
await mark('启动完成');
await page.locator('#lock-screen').click();
await page.waitForTimeout(1200);
await mark('解锁进入主屏');

// 2. 序章：让消息自然到达
console.log('\n=== 2. 序章消息 ===');
for (let i = 0; i < 4; i++) { await page.waitForTimeout(1500); await mark('等待序章 ' + (i + 1)); }

// 3. 回复苏苏（自动选第一项）
console.log('\n=== 3. 回复消息 ===');
await page.evaluate(() => openConversation('susu'));
await page.waitForTimeout(800);
await mark('打开苏苏会话');
const chose = await page.evaluate(() => {
  const e = window.__neonTest.engine;
  const conv = e.state.conversations.susu;
  if (conv.pendingChoice) {
    const opt = conv.pendingChoice.options[0];
    e.sendMessage('susu', opt.text, e.normalizeOptionEffects(opt));
    return opt.text;
  }
  return null;
});
console.log('  → 已回复:', chose);
await page.waitForTimeout(2500);
await mark('回复后');

// 4. 巡览全部 App（布局/渲染异常检测）
console.log('\n=== 4. App 巡览 ===');
const apps = ['messages', 'moments', 'album', 'calendar', 'music', 'notes', 'profile', 'map',
  'groups', 'contacts', 'shop', 'mood', 'tarot', 'achievements', 'collection', 'puzzles',
  'player', 'relations', 'tasks', 'watch', 'affection', 'themes', 'endings', 'dates',
  'dreams', 'hints', 'saves', 'settings'];
for (const app of apps) {
  await page.evaluate(a => { openApp(a); }, app);
  await page.waitForTimeout(220);
  const r = await page.evaluate(() => {
    const scr = document.querySelector('.screen.active');
    return { active: scr?.id, textLen: scr?.innerText?.length || 0 };
  });
  if (r.textLen < 10) console.log(`  ⚠ App「${app}」渲染内容过少（${r.textLen} 字）`);
}
await mark('App 巡览完成');

// 5. 塔罗抽牌（含实时反馈）
console.log('\n=== 5. 塔罗 / 商店 / 心情 ===');
await page.evaluate(() => { openApp('tarot'); });
await page.waitForTimeout(300);
const tarot = await page.evaluate(() => {
  const e = window.__neonTest.engine;
  let btn = [...document.querySelectorAll('button')].find(b => /抽|占卜/.test(b.textContent));
  if (btn) btn.click();
  return !!btn;
});
await page.waitForTimeout(1500);
await mark('塔罗抽牌(' + (tarot ? '已点击' : '未找到按钮') + ')');

// 6. 电话：接听 + 拒接各一次
console.log('\n=== 6. 电话路径 ===');
await page.evaluate(() => {
  const e = window.__neonTest.engine;
  e.triggerCall('shenyan_call_labels');
});
await page.waitForTimeout(1500);
await mark('来电弹出');
const answered = await page.evaluate(() => {
  const btn = document.querySelector('[data-call="accept"]');
  if (btn) { btn.click(); return true; }
  return false;
});
console.log('  → 点接听按钮:', answered);
await page.waitForTimeout(1500);
// 走完通话脚本（逐个点选项）
for (let i = 0; i < 12; i++) {
  const r = await page.evaluate(() => {
    const script = document.getElementById('call-script');
    const opt = script?.querySelector('button');
    if (opt) { opt.click(); return 'choice'; }
    const scr = document.querySelector('.screen.active')?.id;
    if (scr !== 'incoming-call') return 'left';
    return 'waiting';
  });
  await page.waitForTimeout(900);
  if (r === 'left') { console.log('  → 通话结束，已返回', await page.evaluate(() => document.querySelector('.screen.active')?.id)); break; }
}
await mark('接听完成');

await page.evaluate(() => {
  const e = window.__neonTest.engine;
  e.triggerCall('luci_call_darkroom');
});
await page.waitForTimeout(1200);
const declined = await page.evaluate(() => {
  const e = window.__neonTest.engine;
  if (e._pendingCallEventId) { e.declineCall(e._pendingCallEventId); return true; }
  return false;
});
console.log('  → 拒接:', declined, '| 信箱:', await page.evaluate(() => window.__neonTest.engine.state.voicemails.length));
await page.waitForTimeout(1200);
await mark('拒接完成');

// 7. 快速推进到结局（跳过等待，直接设 flag 并调度）
console.log('\n=== 7. 推进到结局 ===');
await page.evaluate(() => {
  const e = window.__neonTest.engine;
  e.state.day = 20; e.state.minute = 21 * 60;
  e.state.affection.shenyan = 16;
  e.state.flags.shenyan_choice = 'confront';
  e.state.flags.shenyan_resist = 1;
  e.state.collected.push('memento_pen');
  e.triggerEnding('shenyan_hidden');
});
await page.waitForTimeout(2000);
await mark('结局触发');
const ending = await page.evaluate(() => ({
  screen: document.querySelector('.screen.active')?.id,
  cg: document.getElementById('ending-cg')?.src?.split('/').pop(),
  ngBtn: !!document.getElementById('btn-ngplus')
}));
console.log('  → 结局屏:', JSON.stringify(ending));

// 8. 二周目
console.log('\n=== 8. 二周目 ===');
await page.evaluate(() => document.getElementById('btn-ngplus')?.click());
await page.waitForTimeout(2500);
await mark('二周目开局');
const ng = await page.evaluate(() => {
  const e = window.__neonTest.engine;
  return { ngPlus: e.state.ngPlus, day: e.state.day, collected: e.state.collected.length,
           ng2: Object.keys(e.state.firedEvents).filter(k => k.endsWith('_ng2')) };
});
console.log('  → 二周目:', JSON.stringify(ng));

// 9. 收集全部异常
console.log('\n=== 9. 日志汇总 ===');
const report = await page.evaluate(() => {
  const D = window.NeonDebug;
  if (!D) return { error: 'NeonDebug 未加载' };
  const issues = D.issues();
  return {
    total: D.entries().length,
    issues: issues.length,
    byLevel: issues.reduce((a, i) => { a[i.level] = (a[i.level] || 0) + 1; return a; }, {}),
    byTag: issues.reduce((a, i) => { a[i.tag] = (a[i.tag] || 0) + 1; return a; }, {}),
    list: issues.slice(0, 40).map(i => `${i.at} [${i.level}] ${i.tag}: ${i.msg}`),
    dump: D.dump()
  };
});

console.log('日志条目:', report.total, '| 异常/警告:', report.issues, '| 分布:', JSON.stringify(report.byLevel || {}), JSON.stringify(report.byTag || {}));
if (report.list?.length) {
  console.log('\n--- 异常明细 ---');
  report.list.forEach(l => console.log('  ' + l));
}
if (consoleErrors.length) {
  console.log('\n--- 浏览器未捕获错误 ---');
  consoleErrors.slice(0, 15).forEach(e => console.log('  ' + e));
}

// 保存完整日志
import('node:fs').then(fs => {
  fs.writeFileSync('/tmp/neon-flow.log', report.dump || '');
  console.log('\n完整日志已写入 /tmp/neon-flow.log');
});

console.log('\n=== 步骤耗时/状态表 ===');
steps.forEach(s => console.log(`${s.name.padEnd(16)} day${String(s.day).padEnd(3)} 未读${String(s.unread).padEnd(3)} 定时器${String(s.timers).padEnd(3)} 待发${String(s.pendingMsgs).padEnd(3)} 问题${s.issues}`));

await browser.close();
process.exit(report.issues > 0 || consoleErrors.length > 0 ? 2 : 0);
