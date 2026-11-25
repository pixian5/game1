/* ===== 英文模式中文残留扫描（v0.9.12）=====
 * 目的：实测「切到英文后，各个应用界面上还剩多少中文」。
 *
 * 为什么需要它：项目此前用「字典覆盖率」衡量双语，报的是 100%；
 * 但字典里有译文不等于界面会显示——很多界面直接把数据原文渲染出来，根本没调用翻译。
 * 2026-11-24 首次实测：31 个应用里 20 个有中文残留，去重后 280 种文字。
 *
 * 做法：补全游戏状态（否则渐进解锁会拦住大部分应用）→ 切到英文 →
 *       逐个打开应用 → 收集当前界面上可见的、含中文的文本 → 对照英文字典，分成
 *       「字典里已有译文、只是界面没用上」与「字典里没有译文」两类。
 *
 * 用法：node tools/i18n-leak-scan.mjs [--json <输出文件>] [--all]
 *   需要本地服务器在 4187 端口（先 node test_server.js；走总闸时由脚本代为启动）。
 *   --json  把完整结果写成 JSON（每条残留文字、所属应用、字典里有没有译文）
 *   --all   打印全部残留文字（默认每种只打印前几条）
 *   --selftest  对照自检：扫描前故意往页面里放两条中文（手机容器外、内各一条），结束时必须都被抓到，
 *             否则按「扫描异常」退出（退出码 2），不会报成零残留。挂进检查流程时建议始终带上
 *   --deep  深入模式：在每个应用里把各类可点控件各点前两个，收集点出来的界面上的中文
 *           （详情页、弹层、抽牌结果等）。确认框一律按「取消」处理；比默认模式慢很多，不放进总闸
 * 退出码：0 = 没有残留；1 = 有残留；2 = 扫描自身异常（没看到界面内容、页面报错、自检失败），结果不可信。
 */
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './browser.mjs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://127.0.0.1:4187';
const argv = process.argv.slice(2);
const arg = name => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
const SHOW_ALL = argv.includes('--all');

// 英文字典：按首页引用顺序加载译包
globalThis.window = globalThis;
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const packs = [...html.matchAll(/<script src="i18n\/(en-US\.js|story-en-translations(?:-\d+)?\.js)(?:\?[^"]*)?"><\/script>/g)].map(m => m[1]);
for(const file of packs) require(path.join(ROOT, 'i18n', file));
const PACK = (globalThis.window.I18N_PACKS && globalThis.window.I18N_PACKS['en-US']) || {};
const hasTr = s => Object.prototype.hasOwnProperty.call(PACK, s);

const browser = await launchBrowser({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
await page.goto(BASE + '/?debug=1', { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => window.__neonTest && window.__neonTest.engine);
await page.evaluate(() => { try { localStorage.clear(); } catch (_) {} });
await page.click('#lock-screen');
await page.waitForTimeout(400);

const DEEP = argv.includes('--deep');
// 对照自检：扫描前故意往页面里放两条中文，一条挂在手机容器外面（最容易被漏掉的位置）、一条放在手机里面。
// 结束时两条都必须出现在结果里，否则说明扫描本身失效，按「扫描异常」退出。
// （之前出现过扫描脚本自己有错、结果为空，却被当成「零残留」的情况，所以每次都要自证。）
const SELFTEST = argv.includes('--selftest') ? { outer: '【自检】手机外面故意放的中文', inner: '【自检】手机里面故意放的中文' } : null;
if(SELFTEST) await page.evaluate(texts => {
  const mk = (id, text) => { const el = document.createElement('div'); el.id = id; el.textContent = text; return el; };
  document.body.appendChild(mk('leak-selftest-outer', texts.outer));
  (document.getElementById('phone') || document.body).appendChild(mk('leak-selftest-inner', texts.inner));
}, SELFTEST);
const result = await page.evaluate(async ({ deep, selftest }) => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  // 等待函数必须真的等待：曾经把它写错成「不等待」，扫描在界面还没渲染完时就取文字，
  // 报出一堆假残留（数字看着都合理）。这里实测一次，不达标直接抛错，不让结果流出去
  { const t0 = Date.now(); await sleep(200); if(Date.now() - t0 < 150) throw new Error('等待函数没有真正等待，扫描结果不可信'); }
  const e = window.__neonTest.engine, S = window.STORY;
  // 深入模式会点到「删除存档」等会弹出确认框的按钮；无人值守时确认框会卡住整个页面，这里一律按「取消」处理
  window.confirm = () => false; window.alert = () => {}; window.prompt = () => null;
  // 补全状态：解锁全部应用，并塞入各类数据，让界面有内容可查
  e.state.day = 12; e.state.minute = 20 * 60;
  e.state.affection = { shenyan: 16, luci: 16, jiangyu: 16 };
  e.state.collected = Object.keys(S.collectibles || {}).slice(0, 12);
  e.state.photos = Object.keys(S.photos || {}).map(id => ({ id, ...S.photos[id], unlocked: true }));
  e.state.achievements = Object.fromEntries(Object.keys(S.achievements).slice(0, 8).map(k => [k, 1]));
  e.state.moments = Object.keys(S.moments || {}).slice(0, 4).map(id => ({ id, ...S.moments[id], likes: [], comments: [] }));
  e.state.flags = { ...(e.state.flags || {}), group_created_group_neon: true };
  e.state.endingSeen = { shenyan_normal: { day: 12 } };
  window.I18N.setLang('en-US');
  e.emit('stateChange', e.state);
  await sleep(500);
  const apps = [...document.querySelectorAll('[data-app]')].map(el => el.dataset.app);
  e.state.appsUnlocked = Object.fromEntries(apps.map(a => [a, true]));
  const perApp = {};
  const stat = { clicks: 0, texts: 0, errors: 0 };
  // 扫描期间页面抛出的异常也记下来：界面报错会让某个应用打不开，看上去就像「没有残留」
  window.addEventListener('error', () => { stat.errors++; });
  // 收集当前页面上可见的、含中文的整段文字。
  // 只取「自己不再有子元素」的可见节点，避免父容器把子节点的文字重复算一遍；
  // 范围是整个页面——解锁横幅、礼物弹层、闲逛提示等都直接挂在 body 上，不在手机容器里
  const collect = () => {
    const out = [];
    let visible = 0;
    for(const el of document.body.querySelectorAll('*')){
      if(el.closest('script, style, [data-i18n-skip], [id^="leak-selftest"]')) continue;
      if(el.childElementCount !== 0 || el.offsetParent === null) continue;
      const t = (el.textContent || '').trim();
      if(!t) continue;
      visible++;
      if(/[\u4e00-\u9fff]/.test(t)) out.push(t);
    }
    stat.texts = Math.max(stat.texts, visible);
    return out;
  };
  // 深入模式每点一下之前，把上一点出来的浮层清掉，免得它的文字算到后面的界面头上（自检放的两条保留）
  const clearOverlays = () => {
    for(const el of document.body.children){
      if(el.id === 'phone-frame' || el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || /^leak-selftest/.test(el.id)) continue;
      el.remove();
    }
  };
  for(const id of apps){
    window.openApp(id);
    await sleep(380);
    const scr = document.querySelector('.screen.active');
    if(!scr){ perApp[id] = null; continue; }
    const lines = collect();
    perApp[id] = { screen: scr.id, lines };
    if(!deep) continue;
    // 深入模式：把界面里可见的可点元素按「控件类型」各点前几个，收集点出来的界面上的中文。
    // 按类型去重（标签名 + 样式类名 + 有哪些 data- 属性），避免十几个同类条目把点击次数用光
    const CLICKABLE = 'button, [onclick], [data-action], [class*="-item"], [class*="-card"], [class*="-tab"], [class*="-opt"], [class*="-btn"], [class*="-chip"], [data-conv], [data-contact], [data-photo], [data-memory], [data-puzzle], [data-clue], [data-theme], [data-pscene], [data-date-scene], [data-watch-strategy], [data-holiday], [data-dream], [data-nightmare], [data-egg], [data-coll]';
    const kindOf = el => el.tagName + '|' + el.className + '|' + [...el.attributes].filter(a => a.name.startsWith('data-') && a.name !== 'data-i18n' && !a.name.startsWith('data-i18n-')).map(a => a.name).sort().join(',');
    const visibleClickables = () => [...document.querySelectorAll(CLICKABLE)].filter(c => c.offsetParent !== null && !c.disabled && !c.closest('[data-i18n-skip]'));
    const kinds = new Map();       // 类型 → 已点次数
    let clicked = 0;
    for(const el of visibleClickables()){
      if(clicked >= 24) break;
      const kind = kindOf(el);
      if((kinds.get(kind) || 0) >= 2) continue;       // 同一种控件最多点 2 个
      kinds.set(kind, (kinds.get(kind) || 0) + 1);
      try {
        // 重新打开应用后再找同一种控件的第一个（上一次点击可能已经改变了界面）
        clearOverlays();
        window.openApp(id);
        await sleep(120);
        const target = visibleClickables().find(c => kindOf(c) === kind);
        if(!target) continue;
        target.click();
        clicked++; stat.clicks++;
        await sleep(260);
        lines.push(...collect());
      } catch (_) {}
    }
    clearOverlays();
  }
  if(selftest){
    for(const [id, text] of Object.entries(selftest)){
      const el = document.getElementById('leak-selftest-' + id);
      perApp['selftest-' + id] = { screen: '(selftest)', lines: el && el.offsetParent !== null ? [el.textContent] : [] };
    }
  }
  return { perApp, stat };
}, { deep: DEEP, selftest: SELFTEST });
await browser.close();

const cjkCount = s => (s.match(/[\u4e00-\u9fff]/g) || []).length;
const strings = new Map();        // 文字 → { apps:Set, hasTr }
let appTotal = 0, appLeak = 0, lineTotal = 0, charTotal = 0;
for(const [app, info] of Object.entries(result.perApp)){
  if(!info || app.startsWith('selftest-')) continue;
  appTotal++;
  if(!info.lines.length) continue;
  appLeak++; lineTotal += info.lines.length;
  for(const text of info.lines){
    charTotal += cjkCount(text);
    if(!strings.has(text)) strings.set(text, { apps: new Set(), hasTr: hasTr(text) });
    strings.get(text).apps.add(app);
  }
}
const withTr = [...strings.values()].filter(s => s.hasTr).length;
const without = strings.size - withTr;
const SCAN = result.stat || { clicks: 0, texts: 0, errors: 0 };
const selftestCaught = !SELFTEST || ['outer', 'inner'].every(k => (result.perApp['selftest-' + k] || {}).lines && result.perApp['selftest-' + k].lines.length);

console.log(`英文模式中文残留：${appTotal} 个应用里 ${appLeak} 个有残留，共 ${lineTotal} 行、${charTotal} 个汉字`);
console.log(`去重后 ${strings.size} 种文字：字典里已有译文但界面没用上的 ${withTr} 种；字典里没有译文的 ${without} 种`);
console.log(`扫描范围：${appTotal} 个应用${DEEP ? `，共点击 ${SCAN.clicks} 次` : ''}；同一时刻最多看到 ${SCAN.texts} 条可见文字；页面异常 ${SCAN.errors} 次`
  + (SELFTEST ? `；对照自检${selftestCaught ? '通过' : '失败'}（故意放入的两条中文${selftestCaught ? '都被抓到' : '没有被全部抓到'}）` : ''));
for(const [app, info] of Object.entries(result.perApp)){
  if(!info || app.startsWith('selftest-') || !info.lines.length) continue;
  const uniq = [...new Set(info.lines)];
  const show = SHOW_ALL ? uniq : uniq.slice(0, 4);
  console.log(`  ${app.padEnd(12)} ${String(info.lines.length).padStart(3)} 行  ${uniq.length} 种  例：${show.join(' ｜ ').slice(0, SHOW_ALL ? 100000 : 150)}`);
}

const outFile = arg('--json');
if(outFile){
  fs.writeFileSync(outFile, JSON.stringify({
    apps: Object.fromEntries(Object.entries(result.perApp).map(([k, v]) => [k, v ? [...new Set(v.lines)] : null])),
    stat: SCAN,
    strings: [...strings.entries()].map(([text, s]) => ({ text, hasTr: s.hasTr, apps: [...s.apps] })).sort((a, b) => a.hasTr - b.hasTr || b.text.length - a.text.length)
  }, null, 1));
  console.log(`完整结果已写入 ${outFile}`);
}
// 没看到任何界面内容、页面有异常、或自检放入的中文没被抓到，都说明扫描本身有问题——
// 这时不能报成零残留，按「扫描异常」退出（退出码 2），与「有残留」（退出码 1）区分开
if(!appTotal || !SCAN.texts || SCAN.errors || !selftestCaught){
  console.log('\n✗ 扫描自身异常，本次结果不可信：'
    + [ !appTotal ? '没有打开任何应用' : '', !SCAN.texts ? '没有看到任何界面文字' : '', SCAN.errors ? `页面抛出异常 ${SCAN.errors} 次` : '', !selftestCaught ? '故意放入的中文没有被全部抓到' : '' ].filter(Boolean).join('；'));
  process.exit(2);
}
process.exit(strings.size ? 1 : 0);
