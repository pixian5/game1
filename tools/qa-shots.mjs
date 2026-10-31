/* ===== 视觉走查截图巡检（v0.7.7）=====
 * 手机视口逐屏截图 + 异常检测（console 错误 / 水平溢出 / 破图 / HTTP 4xx-5xx），
 * 覆盖中文模式、英文模式（拼音角色名）、桌面视口，并对相册空态做专项 dump。
 * 运行：node tools/qa-shots.mjs（需本地 test_server 已启动于 4187）
 */
import { launchBrowser } from './browser.mjs';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:4187';
const OUT = process.env.OUT || '/workspace/neon-verify/shots';
fs.mkdirSync(OUT, { recursive: true });

// 手机视口探测清单：key → openApp 参数（null 表示不用 openApp）
const TOUR = [
  ['01-lock', null],
  ['02-home', null],
  ['03-messages', 'messages'],
  ['04-chat-susu', null],
  ['05-moments', 'moments'],
  ['06-map', 'map'],
  ['07-tarot', 'tarot'],
  ['08-shop', 'shop'],
  ['09-album', 'album'],
  ['10-endings', 'endings'],
  ['11-settings', 'settings'],
  ['12-player', 'player'],
  ['13-contacts', 'contacts'],
  ['14-themes', 'themes'],
  ['15-collection', 'collection'],
];
const EN_TOUR = [
  ['en-01-home', null],
  ['en-02-messages', 'messages'],
  ['en-03-chat-susu', null],
  ['en-04-contacts', 'contacts'],
  ['en-05-player', 'player'],
];

const browser = await launchBrowser();
const report = { zh: {}, en: {}, desktop: {}, albumDetail: null, errors: [] };

const attach = (page) => {
  page.on('console', m => { if (m.type() === 'error') report.errors.push('console: ' + m.text().slice(0, 160)); });
  page.on('pageerror', e => report.errors.push('pageerror: ' + String(e).slice(0, 160)));
  page.on('response', r => { if (r.status() >= 400) report.errors.push(`http ${r.status()}: ${r.url().slice(-80)}`); });
};

// 单屏体检：文本量 / 横向溢出 / 破图 / 按钮数
async function probe(page) {
  return page.evaluate(() => {
    const scr = document.querySelector('.screen.active');
    const scroller = scr ? [...scr.querySelectorAll('*')].find(el => el.scrollWidth > el.clientWidth + 2 && window.getComputedStyle(el).overflowX !== 'visible') : null;
    const imgs = scr ? [...scr.querySelectorAll('img')] : [];
    return {
      screen: scr?.id || '?',
      textLen: scr?.innerText?.trim().length || 0,
      overflowX: scroller ? `${scroller.tagName}.${scroller.className} ${scroller.scrollWidth}>${scroller.clientWidth}` : null,
      brokenImgs: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(-40)),
      imgTotal: imgs.length,
      btnCount: scr ? scr.querySelectorAll('button').length : 0,
      // 视口级横向溢出（页面整体能否左右滚）
      pageOverflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    };
  });
}

async function tour(page, list, bucket) {
  for (const [key, app] of list) {
    if (app) await page.evaluate(a => { try { window.openApp(a); } catch (_) {} }, app);
    if (key === '04-chat-susu' || key === 'en-03-chat-susu') {
      await page.evaluate(() => window.openConversation('susu'));
    }
    // v0.7.7：开局消息按队列逐条异步到达（首条约 1.5s），会话屏多等一会再截，避免截到空会话
    await page.waitForTimeout(key.includes('chat') ? 1800 : 320);
    const info = await probe(page);
    await page.screenshot({ path: path.join(OUT, key + '.png') });
    bucket[key] = { ...info, shot: path.join(OUT, key + '.png') };
    // v0.7.7：text<10 且无图片才算空（相册/收藏馆等图片网格天生少文字，旧口径误报）
    const emptyish = info.textLen < 10 && info.imgTotal === 0;
    console.log(`${emptyish ? 'WARN' : 'OK  '} ${key.padEnd(16)} ${info.screen.padEnd(16)} text=${String(info.textLen).padEnd(4)} imgs=${info.imgTotal} overflow=${!!info.overflowX}${info.overflowX ? ' ' + info.overflowX : ''} brokenImg=${info.brokenImgs.length}`);
  }
}

// ===== 中文模式（手机视口）=====
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
attach(page);
await page.goto(BASE + '/?debug=1', { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => window.__neonTest && window.__neonTest.engine);
await page.evaluate(() => { try { localStorage.clear(); } catch (_) {} });
await page.click('#lock-screen');
await page.waitForTimeout(400);
// 造一个"中后期"存档：解锁各类 App 门槛，让每个界面都有真实内容可看
await page.evaluate(() => {
  const e = window.__neonTest.engine;
  e.state.day = 12;
  e.state.minute = 20 * 60;
  e.state.affection = { shenyan: 16, luci: 16, jiangyu: 16 };
  e.state.collected = Object.keys(window.STORY.collectibles || {}).slice(0, 12);
  e.state.photos = Object.keys(window.STORY.photos || {}).map(id => ({ id, ...window.STORY.photos[id], unlocked: true }));
  e.state.achievements = Object.fromEntries(Object.keys(window.STORY.achievements).slice(0, 8).map(k => [k, 1]));
  e.state.moments = Object.keys(window.STORY.moments || {}).slice(0, 4).map(id => ({ id, ...window.STORY.moments[id], likes: [], comments: [] }));
  // 渐进解锁拦截 openApp（未解锁只 toast），巡览前补真实解锁条件（groups 需建群 flag、endings 需结局记录）
  e.state.flags = { ...(e.state.flags || {}), group_created_group_neon: true };
  e.state.endingSeen = { shenyan_normal: { day: 12 } };
  // 从主屏图标清单全解锁，保证每个 App 都能真实打开
  e.state.appsUnlocked = Object.fromEntries([...document.querySelectorAll('.app-icon')].map(el => [el.dataset.app, true]));
  e.emit('stateChange', e.state);
});
await tour(page, TOUR, report.zh);

// dock sticky 可见性（v0.7.7 修复验证：App 全解锁时 dock 应吸附在手机视口底部）
await page.evaluate(() => window.showScreen('home'));
await page.waitForTimeout(200);
report.dock = await page.evaluate(() => {
  const dock = document.querySelector('.home-dock');
  if (!dock) return { found: false };
  const r = dock.getBoundingClientRect();
  return { found: true, top: Math.round(r.top), bottom: Math.round(r.bottom), inViewport: r.bottom <= window.innerHeight + 1 && r.top >= 0 };
});
console.log('dock:', JSON.stringify(report.dock));

// 相册专项：空态/非空态的完整文本与 DOM 特征
report.albumDetail = await page.evaluate(() => {
  const app = document.getElementById('album-app');
  if (!app) return { found: false };
  const unlocked = window.__neonTest.engine.state.photos || [];
  return {
    found: true,
    text: app.innerText?.trim().slice(0, 300),
    textLen: app.innerText?.trim().length || 0,
    photoStateCount: unlocked.length,
    imgCount: app.querySelectorAll('img').length,
    emptyHint: /还没有解锁照片/.test(app.innerText || ''),
  };
});

// ===== 英文模式 =====
await page.evaluate(() => {
  const el = document.querySelector('input[name=set-lang][value=en-US]');
  if (el) el.click();
});
await page.waitForTimeout(350);
// 回主屏再走一遍（openApp 没有 home 分支，直接切屏）
await page.evaluate(() => window.showScreen('home'));
await page.waitForTimeout(200);
await tour(page, EN_TOUR, report.en);

// ===== 桌面视口 =====
const dctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const dpage = await dctx.newPage();
attach(dpage);
await dpage.goto(BASE + '/?debug=1', { waitUntil: 'load', timeout: 60000 });
await dpage.waitForFunction(() => window.__neonTest && window.__neonTest.engine);
await dpage.click('#lock-screen');
await dpage.waitForTimeout(400);
for (const [key, app] of [['desktop-01-home', null], ['desktop-02-messages', 'messages'], ['desktop-03-chat', null]]) {
  if (app) await dpage.evaluate(a => window.openApp(a), app);
  if (key === 'desktop-03-chat') await dpage.evaluate(() => window.openConversation('susu'));
  await dpage.waitForTimeout(key === 'desktop-03-chat' ? 1800 : 320);
  const info = await probe(dpage);
  await dpage.screenshot({ path: path.join(OUT, key + '.png') });
  report.desktop[key] = { ...info, shot: path.join(OUT, key + '.png') };
  console.log(`OK   ${key.padEnd(16)} ${info.screen.padEnd(16)} text=${String(info.textLen).padEnd(4)} overflow=${!!info.overflowX}${info.overflowX ? ' ' + info.overflowX : ''} brokenImg=${info.brokenImgs.length}`);
}

report.errorCount = report.errors.length;
report.uniqueErrors = [...new Set(report.errors)];
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(report, null, 2));
console.log('\n=== 汇总 ===');
console.log(JSON.stringify({
  errors: report.uniqueErrors,
  dock: report.dock,
  zhWarn: Object.entries(report.zh).filter(([, v]) => (v.textLen < 10 && v.imgTotal === 0) || v.overflowX || v.brokenImgs.length).map(([k]) => k),
  enWarn: Object.entries(report.en).filter(([, v]) => (v.textLen < 10 && v.imgTotal === 0) || v.overflowX || v.brokenImgs.length).map(([k]) => k),
  albumDetail: report.albumDetail,
}, null, 2));
await browser.close();
