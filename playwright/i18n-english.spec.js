const {test, expect} = require('@playwright/test');

/* ===== 双语显示层端到端（v0.9.12）=====
 * 背景：此前「双语 100%」只是字典覆盖率，实测英文模式下 31 个应用里 20 个显示中文。
 * 这两条用例在真实浏览器里逐个打开全部应用，直接看页面上有没有中文：
 *   - 英文模式：不应出现任何含中文的可见文字（范围是整个页面，包括挂在手机容器外的横幅、弹层）；
 *   - 中文模式：界面应当保持中文，且打开全部应用的过程不报错（显示层兜底在中文模式下必须原样不动）。
 * 在三个浏览器内核里各跑一遍（见 playwright.config.js）。
 * 更彻底的「点进详情页」扫描见 node tools/i18n-leak-scan.mjs --deep --selftest。
 */

// 补全游戏状态（否则渐进解锁会拦住大部分应用），切到指定语言，逐个打开应用并收集可见文字
async function scanApps(page, lang){
  const errors = [];
  page.on('pageerror', err => errors.push(String(err && err.message ? err.message : err)));
  await page.goto('/?debug=1');
  await page.waitForFunction(() => window.__neonTest && window.__neonTest.engine);
  await page.evaluate(() => { try { localStorage.clear(); } catch (_) {} });
  await page.click('#lock-screen');
  const result = await page.evaluate(async (lang) => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const e = window.__neonTest.engine, S = window.STORY;
    // 弹出式确认框一律按「取消」处理，避免卡住页面
    window.confirm = () => false; window.alert = () => {}; window.prompt = () => null;
    e.state.day = 12; e.state.minute = 20 * 60;
    e.state.affection = { shenyan: 16, luci: 16, jiangyu: 16 };
    e.state.collected = Object.keys(S.collectibles || {}).slice(0, 12);
    e.state.photos = Object.keys(S.photos || {}).map(id => ({ id, ...S.photos[id], unlocked: true }));
    e.state.achievements = Object.fromEntries(Object.keys(S.achievements).slice(0, 8).map(k => [k, 1]));
    e.state.moments = Object.keys(S.moments || {}).slice(0, 4).map(id => ({ id, ...S.moments[id], likes: [], comments: [] }));
    e.state.flags = { ...(e.state.flags || {}), group_created_group_neon: true };
    e.state.endingSeen = { shenyan_normal: { day: 12 } };
    window.I18N.setLang(lang);
    e.emit('stateChange', e.state);
    await sleep(500);
    const apps = [...document.querySelectorAll('[data-app]')].map(el => el.dataset.app);
    e.state.appsUnlocked = Object.fromEntries(apps.map(a => [a, true]));
    const perApp = {};
    let texts = 0;
    for(const id of apps){
      window.openApp(id);
      await sleep(250);
      const cjk = [];
      let visible = 0;
      // 只取「自己不再有子元素」的可见节点，范围是整个页面
      for(const el of document.body.querySelectorAll('*')){
        if(el.closest('script, style, [data-i18n-skip]')) continue;
        if(el.childElementCount !== 0 || el.offsetParent === null) continue;
        const text = (el.textContent || '').trim();
        if(!text) continue;
        visible++;
        if(/[\u4e00-\u9fff]/.test(text)) cjk.push(text);
      }
      texts += visible;
      perApp[id] = cjk;
    }
    return { perApp, texts };
  }, lang);
  return { ...result, errors };
}

test('英文模式下全部应用不显示中文（v0.9.12）', async ({page}) => {
  const { perApp, texts, errors } = await scanApps(page, 'en-US');
  expect(errors).toEqual([]);
  expect(Object.keys(perApp).length).toBeGreaterThan(25);   // 应用都打开了吗
  expect(texts).toBeGreaterThan(300);                       // 确认真的看到了界面内容，而不是空页面
  const leaks = Object.entries(perApp).filter(([, cjk]) => cjk.length).map(([app, cjk]) => `${app}: ${[...new Set(cjk)].slice(0, 3).join(' ｜ ')}`);
  expect(leaks, `英文模式下出现中文：\n${leaks.join('\n')}`).toEqual([]);
});

test('中文模式下界面保持中文且打开全部应用不报错（v0.9.12）', async ({page}) => {
  const { perApp, texts, errors } = await scanApps(page, 'zh-CN');
  expect(errors).toEqual([]);
  expect(texts).toBeGreaterThan(300);
  const withChinese = Object.values(perApp).filter(cjk => cjk.length > 0).length;
  expect(withChinese).toBeGreaterThan(20);                  // 绝大多数界面应当有中文
  // 抽测几个已知的中文标签确实还在（显示层兜底在中文模式下不能改写任何东西）
  const seen = new Set(Object.values(perApp).flat());
  for(const label of ['设置', '消息', '通讯录', '礼物商城']) expect(seen.has(label), `中文模式下应当能看到「${label}」`).toBe(true);
});
