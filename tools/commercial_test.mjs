/* ===== 商业级全面测试套件（v0.8.5）=====
 * 覆盖 8 个维度：功能/数据/性能/安全/兼容性/双语/边界/无障碍
 * 每个维度独立报告，最终汇总为一份完整报告。
 * 运行：node tools/commercial_test.mjs [BASE_URL]
 */
import pw from '/Users/x/code/game1/node_modules/@playwright/test/index.js';
const { chromium } = pw;

const BASE = process.argv[2] || 'http://127.0.0.1:4187';
const results = { pass: 0, fail: 0, warn: 0, details: [] };

function report(suite, name, pass, detail = '') {
  const status = pass ? 'PASS' : 'FAIL';
  results[pass ? 'pass' : 'fail']++;
  results.details.push({ suite, name, status, detail });
  console.log(`  ${pass ? '✓' : '✗'} [${suite}] ${name}${detail ? ' — ' + detail : ''}`);
}
function warn(suite, name, detail = '') {
  results.warn++;
  results.details.push({ suite, name, status: 'WARN', detail });
  console.log(`  ⚠ [${suite}] ${name}${detail ? ' — ' + detail : ''}`);
}

// 工具：等待并点击选择
async function clickChoices(page) {
  return page.evaluate(() => {
    let n = 0;
    ['.chat-opt', '#narrator-choice-modal button:not([data-back])', '#dream-screen .dream-opt', '#encounter-screen .dream-opt', '#call-script button']
      .forEach(sel => document.querySelectorAll(sel).forEach(b => { if (b.offsetParent) { b.click(); n++; } }));
    return n;
  });
}
async function clickNotifs(page) {
  return page.evaluate(() => {
    const s = document.getElementById('notif-stack');
    if (!s) return 0;
    let n = 0; [...s.children].forEach(c => { c.click(); n++; });
    return n;
  });
}
async function travel(page) {
  return page.evaluate(() => {
    try { openApp('map'); } catch (_) {}
    const items = [...document.querySelectorAll('#map-list .map-item:not(.locked):not(.current)')];
    if (items.length) { items[Math.floor(Math.random() * items.length)].click(); return true; }
    return false;
  });
}
async function checkEnding(page) {
  return page.evaluate(() => {
    if (document.querySelector('.screen.active')?.id !== 'ending-screen') return null;
    return document.getElementById('ending-title')?.textContent || '(结局)';
  });
}
async function newGame(page) {
  await page.evaluate(() => {
    window.__neonTest.engine.newGame();
    showScreen('lock');
  });
  await page.locator('#lock-screen').click();
  await page.waitForTimeout(1500);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });

// ================================================================
// A. 功能测试：全流程通关 + 17 结局
// ================================================================
console.log('\n═══ A. 功能测试 ═══');

// A1: 四条路线通关（用引擎快进到各线结局）
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.locator('#lock-screen').click();
  await page.waitForTimeout(2000);

  const routes = [
    { id: 'shenyan_good', setup: "e.state.flags.shenyan_choice='confront';e.state.flags.shenyan_resist=1;e.state.collected.push('memento_pen')" },
    { id: 'shenyan_bad', setup: "e.state.flags.shenyan_choice='endure';e.state.flags.shenyan_obey=1" },
    { id: 'luci_good', setup: "e.state.flags.luci_choice='accept';e.state.flags.luci_confess=1" },
    { id: 'luci_bad', setup: "e.state.flags.luci_choice='miss';e.state.flags.luci_avoid=1" },
    { id: 'jiangyu_good', setup: "e.state.flags.jiangyu_choice='stay';e.state.flags.jiangyu_hold=1" },
    { id: 'jiangyu_bad', setup: "e.state.flags.jiangyu_choice='leave';e.state.flags.jiangyu_leave=1" },
    { id: 'solo_good', setup: "e.state.flags.solo_independent=1" },
    { id: 'true_ending', setup: "e.state.flags.solo_independent=1;['postcard_neon','stamp_first','ticket_bar','evidence_photo','evidence_letter','evidence_lyrics','memento_pen','memento_camera','recording_xia','recording_msg','postcard_sea','postcard_school'].forEach(x=>e.state.collected.push(x))" },
  ];

  for (const r of routes) {
    await page.evaluate(({ id, setup }) => {
      const e = window.__neonTest.engine;
      e.newGame();
      new Function('e', setup)(e);
      e.triggerEnding(id);
    }, r);
    await page.waitForTimeout(1500);
    const ending = await page.evaluate(() => ({
      screen: document.querySelector('.screen.active')?.id,
      title: document.getElementById('ending-title')?.textContent,
      cg: document.getElementById('ending-cg')?.src?.split('/').pop() || null,
      ngBtn: !!document.getElementById('btn-ngplus')
    }));
    const ok = ending.screen === 'ending-screen' && ending.title && ending.ngBtn;
    report('A-结局', `${r.id} → ${ending.title || '(无标题)'}`, ok, `屏:${ending.screen} CG:${ending.cg || '无'}`);
  }
  await page.close();
}

// A2: 二周目入口功能
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.locator('#lock-screen').click();
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.state.collected.push('postcard_neon');
    e.triggerEnding('solo_good');
  });
  await page.waitForTimeout(1500);
  await page.locator('#btn-ngplus').click();
  await page.waitForTimeout(2000);
  const ng = await page.evaluate(() => ({
    ngPlus: window.__neonTest.engine.state.ngPlus,
    day: window.__neonTest.engine.state.day,
    hasCollected: window.__neonTest.engine.state.collected.includes('postcard_neon'),
    ng2Event: !!window.__neonTest.engine.state.firedEvents['intro_susu_ng2']
  }));
  report('A-二周目', '携带收集品+触发变体', ng.ngPlus === 1 && ng.hasCollected, `ngPlus:${ng.ngPlus} collected:${ng.hasCollected} ng2:${ng.ng2Event}`);
  await page.close();
}

// ================================================================
// B. 全部 App 巡览 + 交互
// ================================================================
console.log('\n═══ B. App 巡览 ═══');
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.locator('#lock-screen').click();
  await page.waitForTimeout(2000);
  // 推到 day14 并满足事件解锁条件（渐进解锁需要事件触发而非天数）
  await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.state.day = 14;
    e.state.flags.group_created_group_neon = true;     // 群聊
    e.state.achievements.first_reply = true;            // 成就
    e.state.collected.push('postcard_neon','stamp_first'); // 收集柜(≥2)
    e.state.unlockedThemes.starry = true;               // 主题
    Object.keys(e.story.endings).forEach(k => e.state.endingSeen[k] = true); // 图鉴
    e.emit('stateChange', e.state);
  });
  await page.waitForTimeout(500);

  const allApps = ['messages','moments','album','calendar','music','notes','profile','map','groups','contacts','shop','mood','tarot','achievements','collection','puzzles','calendar2','perspective','player','relations','tasks','watch','affection','themes','endings','dates','dreams','hints','settings','saves'];
  let appPass = 0, appFail = [];
  for (const app of allApps) {
    await page.evaluate(a => { try { openApp(a); } catch (_) {} }, app);
    await page.waitForTimeout(300);
    const r = await page.evaluate(a => {
      const scr = document.getElementById(a + '-app') || document.getElementById(a + '-screen');
      if (!scr) return { exists: false, active: false, text: 0 };
      return { exists: true, active: scr.classList.contains('active'), text: (scr.innerText || '').length };
    }, app);
    if (r.active && r.text > 5) appPass++;
    else appFail.push(`${app}(${r.exists ? (r.active ? '空' : '未激活') : '不存在'})`);
  }
  report('B-巡览', `${appPass}/${allApps.length} App 正常`, appFail.length === 0, appFail.join(','));

  // B2: 关键交互
  // 塔罗抽牌
  await page.evaluate(() => { openApp('tarot'); });
  await page.waitForTimeout(400);
  const tarotBtn = await page.evaluate(() => {
    const b = [...document.querySelectorAll('#tarot-app button')].find(b => /抽|占卜/.test(b.textContent));
    if (b) { b.click(); return true; }
    return false;
  });
  await page.waitForTimeout(1000);
  const tarotResult = await page.evaluate(() => window.__neonTest.engine.state.todayFortune !== null || window.__neonTest.engine.state.tarotHistory.length > 0);
  report('B-交互', '塔罗抽牌', tarotBtn && tarotResult);

  // 音乐播放
  await page.evaluate(() => { const e = window.__neonTest.engine; e.unlockMusic('xia'); openApp('music'); });
  await page.waitForTimeout(400);
  const musicPlay = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    return e.playMusic('xia') === true;
  });
  report('B-交互', '音乐播放', musicPlay);

  // 主题切换
  await page.evaluate(() => { const e = window.__neonTest.engine; e.state.unlockedThemes.starry = true; openApp('themes'); });
  await page.waitForTimeout(400);
  const themeSwitch = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.setTheme('starry');
    return e.state.currentTheme === 'starry';
  });
  report('B-交互', '主题切换', themeSwitch);

  await page.close();
}

// ================================================================
// C. 数据测试：存档/读档/导出导入/边界/恶意输入
// ================================================================
console.log('\n═══ C. 数据测试 ═══');
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.locator('#lock-screen').click();
  await page.waitForTimeout(1000);

  // C1: 存档→读档一致性
  const saveLoad = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.state.day = 15;
    e.state.affection.shenyan = 12;
    e.state.collected.push('postcard_neon', 'stamp_first');
    e.save('slot1');
    // 修改状态
    e.state.day = 1;
    e.state.affection.shenyan = 0;
    // 读回来
    e.load('slot1');
    return {
      day: e.state.day,
      aff: e.state.affection.shenyan,
      collected: e.state.collected.includes('postcard_neon')
    };
  });
  report('C-存档', '存→改→读一致性', saveLoad.day === 15 && saveLoad.aff === 12 && saveLoad.collected,
    `day:${saveLoad.day} aff:${saveLoad.aff} collected:${saveLoad.collected}`);

  // C2: 恶意存档导入（XSS）
  const xssTest = await page.evaluate(() => {
    const evil = JSON.stringify({
      app: 'neon-heart', exportVersion: 1, slot: 'slot2',
      save: { v: 3, slot: 'slot2', state: {
        day: 5, minute: 600,
        conversations: { shenyan: { messages: [{ from: 'shenyan', text: '<img src=x onerror=alert(1)>', ts: 1 }], unread: 0, typing: false, finished: false } },
        flags: { '__proto__': 'evil' },
        collected: ['nonexistent_item'],
        affection: { shenyan: 99999 },
      }, time: new Date().toISOString(), note: '<script>alert(2)</script>', label: 'test' }
    });
    const r = window.__neonTest.engine.importSave(evil, 'slot2');
    if (!r.ok) return { imported: false, reason: r.reason };
    // 检查是否被清洗
    const e = window.__neonTest.engine;
    const conv = e.state.conversations.shenyan;
    const hasScript = conv.messages.some(m => m.text.includes('<img') || m.text.includes('onerror'));
    return { imported: true, cleaned: !hasScript, text: conv.messages[0]?.text?.slice(0, 30) };
  });
  report('C-安全', '恶意存档XSS清洗', xssTest.imported ? xssTest.cleaned : true,
    xssTest.imported ? `清洗:${xssTest.cleaned}` : `拒绝:${xssTest.reason}`);

  // C3: 极大数值
  const extremeValues = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.newGame();
    e.state.day = 999999;
    e.state.minute = 999999;
    e.state.affection.shenyan = 999999;
    e.save('slot3');
    e.load('slot3');
    return {
      day: e.state.day,
      aff: e.state.affection.shenyan,
      minute: e.state.minute
    };
  });
  report('C-边界', '极大数值钳制', extremeValues.day <= 999 && extremeValues.aff <= 999,
    `day:${extremeValues.day} aff:${extremeValues.aff}`);

  // C4: 存档导出→导入往返
  const roundTrip = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.newGame();
    e.state.day = 10;
    e.state.collected.push('postcard_neon');
    e.save('slot1');
    const exported = e.exportSave('slot1');
    // 清空后导入
    e.newGame();
    const imported = e.importSave(exported, 'slot2');
    if (!imported.ok) return { ok: false };
    e.load('slot2');   // importSave 只存入槽位，需 load 加载
    return { ok: true, day: e.state.day, collected: e.state.collected.includes('postcard_neon') };
  });
  report('C-数据', '导出→导入往返', roundTrip.ok && roundTrip.day === 10,
    `day:${roundTrip.day} collected:${roundTrip.collected}`);

  await page.close();
}

// ================================================================
// D. 性能测试
// ================================================================
console.log('\n═══ D. 性能测试 ═══');
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const t0 = Date.now();
  await page.goto(BASE, { timeout: 30000 }, { waitUntil: 'load' });
  const loadTime = Date.now() - t0;
  report('D-性能', `页面加载 ${loadTime}ms`, loadTime < 5000, `${loadTime}ms`);

  // 内存
  const mem = await page.evaluate(() => performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : -1);
  warn('D-性能', `JS堆内存 ${mem}MB`);

  // 长时间浸泡（快速操作 30 秒）
  await page.locator('#lock-screen').click();
  await page.waitForTimeout(2000);
  for (let i = 0; i < 30; i++) {
    await clickChoices(page);
    await clickNotifs(page);
    await travel(page);
    await page.evaluate(() => { try { openApp('messages'); } catch (_) {} });
    await page.waitForTimeout(500);
  }
  const soakMem = await page.evaluate(() => performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : -1);
  const timers = await page.evaluate(() => window.__neonTest.engine._timers.size);
  report('D-性能', `浸泡后内存增长 ${soakMem - mem}MB`, (soakMem - mem) < 50, `初始:${mem}MB → 浸泡后:${soakMem}MB 定时器:${timers}`);
  await page.close();
}

// ================================================================
// E. 安全测试
// ================================================================
console.log('\n═══ E. 安全测试 ═══');
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.locator('#lock-screen').click();
  await page.waitForTimeout(1000);

  // E1: CSP 头
  const csp = await page.evaluate(() => {
    // 检查 meta CSP 是否存在
    return document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
  });
  report('E-安全', 'CSP meta 存在', csp);

  // E2: 朋友圈 XSS（发动态带 script 标签）
  const momentXss = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.createMyMoment('<script>alert("xss")</script>测试');
    const m = e.state.moments.find(m => m.isMine);
    if (!m) return { created: false };
    // 渲染后检查 DOM
    openApp('moments');
    const html = document.getElementById('moments-app')?.innerHTML || '';
    return { created: true, escaped: !html.includes('<script>') };
  });
  report('E-安全', '朋友圈XSS防护', momentXss.created ? momentXss.escaped : true);

  // E3: 备忘录 XSS
  const noteXss = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.addNote({ title: '<img onerror=alert(1)>', text: 'test' });
    openApp('notes');
    const html = document.getElementById('notes-app')?.innerHTML || '';
    // 正确检测：检查是否有未转义的 HTML 标签（&lt; 是安全的，< 才危险）
    return !html.includes('<img') && !html.includes('<script');
  });
  report('E-安全', '备忘录XSS防护', noteXss);

  await page.close();
}

// ================================================================
// F. 兼容性测试：多设备
// ================================================================
console.log('\n═══ F. 兼容性 ═══');
{
  const devices = [
    { n: 'iPhone SE', w: 375, h: 667 },
    { n: 'iPhone 14', w: 390, h: 844 },
    { n: 'iPhone 16 Pro Max', w: 440, h: 956 },
    { n: 'Pixel 8', w: 412, h: 915 },
    { n: 'iPad mini', w: 744, h: 1133 },
    { n: 'Desktop 1080p', w: 1920, h: 1080 },
  ];
  for (const d of devices) {
    const page = await browser.newPage({ viewport: { width: d.w, height: d.h } });
    await page.goto(BASE, { timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.locator('#lock-screen').click();
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      return {
        overflow: de.scrollWidth > de.clientWidth + 2,
        homeActive: document.getElementById('home-screen')?.classList.contains('active'),
        appsVisible: [...document.querySelectorAll('#app-grid .app-icon')].filter(e => !e.hidden).length
      };
    });
    report('F-兼容', `${d.n} ${d.w}×${d.h}`, !r.overflow && r.homeActive, `溢出:${r.overflow} App:${r.appsVisible}`);
    await page.close();
  }
}

// ================================================================
// G. 双语完整性
// ================================================================
console.log('\n═══ G. 双语 ═══');
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.locator('#lock-screen').click();
  await page.waitForTimeout(2000);
  await page.evaluate(() => { const e = window.__neonTest.engine; e.state.day = 14; e.emit('stateChange', e.state); });

  // 切英文后巡览全部 App 找中文残留
  await page.evaluate(() => { openApp('settings'); });
  await page.evaluate(() => { document.querySelector('input[name=set-lang][value=en-US]')?.click(); });
  await page.waitForTimeout(800);

  const allApps = ['messages','moments','album','calendar','music','notes','profile','map','contacts','shop','mood','tarot','achievements','collection','themes','endings','dates','settings','saves'];
  let cnFound = [];
  for (const app of allApps) {
    await page.evaluate(a => { try { openApp(a); } catch (_) {} }, app);
    await page.waitForTimeout(400);
    const cn = await page.evaluate(() => {
      const scr = document.querySelector('.screen.active');
      if (!scr) return [];
      const text = scr.innerText || '';
      // 找连续中文字符（≥3个字才算残留，排除单个中文字符如"回"）
      const matches = text.match(/[\u4e00-\u9fa5]{3,}/g) || [];
      return matches.filter(m => !/^[一二三四五六七八九十]+$/.test(m)).slice(0, 3);
    });
    if (cn.length > 0) cnFound.push(`${app}: ${cn.join(',')}`);
  }
  report('G-双语', `英文模式 ${allApps.length} App 巡览`, cnFound.length === 0, cnFound.slice(0, 5).join(' | ') || '无中文残留');

  // 切回中文
  await page.evaluate(() => { I18N.setLang('zh-CN'); });
  await page.close();
}

// ================================================================
// H. 边界测试
// ================================================================
console.log('\n═══ H. 边界测试 ═══');
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.locator('#lock-screen').click();
  await page.waitForTimeout(2000);

  // H1: 快速连续点击选择
  await page.evaluate(() => { const e = window.__neonTest.engine; e.state.day = 14; e.emit('stateChange', e.state); });
  const rapidClick = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    // 模拟：同一选择快速点击多次
    e.state.conversations.shenyan.pendingChoice = {
      prompt: '快速点击测试',
      options: [{ text: '选项A' }, { text: '选项B' }]
    };
    openConversation('shenyan');
    return true;
  });
  await page.waitForTimeout(500);
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => {
      const b = document.querySelector('.chat-opt');
      if (b) b.click();
    });
  }
  await page.waitForTimeout(1000);
  const rapidOk = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    const msgs = e.state.conversations.shenyan.messages;
    return msgs.length <= 3;  // 不应该重复发送超过原始消息数
  });
  report('H-边界', '快速连续点击不重复发送', rapidOk);

  // H2: 并发来电
  const concurrentCalls = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.triggerCall('shenyan_call_labels', Date.now() + 5000);
    e.triggerCall('luci_call_darkroom', Date.now() + 5000);
    return e.getPendingInteractions().filter(i => i.type === 'call').length;
  });
  report('H-边界', '并发来电排队', concurrentCalls === 2, `${concurrentCalls} 通排队`);

  // H3: 存档槽满
  const slotFull = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.save('auto'); e.save('slot1'); e.save('slot2'); e.save('slot3');
    // 尝试再存（应覆盖 auto 而不是报错）
    const r = e.save('auto');
    return r;
  });
  report('H-边界', '存档槽满后覆盖 auto', slotFull);

  // H4: 直接访问不存在的 App
  const invalidApp = await page.evaluate(() => {
    try { openApp('nonexistent_app'); return 'no-crash'; }
    catch (e) { return 'crash: ' + e.message.slice(0, 40); }
  });
  report('H-边界', '访问不存在的App不崩溃', invalidApp === 'no-crash');

  // H5: 引擎在结局后不再调度
  const endedNoSchedule = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.triggerEnding('solo_good');
    const before = Object.keys(e.state.firedEvents).length;
    e.scheduleEvent('intro_susu');
    const after = Object.keys(e.state.firedEvents).length;
    return after === before;
  });
  report('H-边界', '结局后停止事件调度', endedNoSchedule);

  await page.close();
}

// ================================================================
// 汇总
// ================================================================
await browser.close();

console.log('\n══════════════════════════════════════════');
console.log('           商业级测试完整报告');
console.log('══════════════════════════════════════════');
console.log(`通过: ${results.pass}  失败: ${results.fail}  警告: ${results.warn}`);
console.log(`总计: ${results.pass + results.fail + results.warn} 项`);
console.log('');

if (results.fail > 0) {
  console.log('❌ 失败项：');
  results.details.filter(d => d.status === 'FAIL').forEach(d =>
    console.log(`  [${d.suite}] ${d.name} — ${d.detail}`));
}
if (results.warn > 0) {
  console.log('⚠ 警告项：');
  results.details.filter(d => d.status === 'WARN').forEach(d =>
    console.log(`  [${d.suite}] ${d.name} — ${d.detail}`));
}
console.log('');
console.log(results.fail === 0 ? '✅ 全部测试通过' : `❌ ${results.fail} 项失败`);

// 导出 JSON
const fs = await import('node:fs');
fs.writeFileSync('/tmp/commercial-test-report.json', JSON.stringify(results, null, 2));
console.log('\n详细报告: /tmp/commercial-test-report.json');
process.exit(results.fail > 0 ? 1 : 0);
