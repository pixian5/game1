import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:4187';
const OUT = process.env.OUT || '/workspace/neon-verify/apps';
fs.mkdirSync(OUT, { recursive: true });

const APPS = ['messages', 'moments', 'album', 'calendar', 'music', 'notes', 'profile', 'map',
  'groups', 'contacts', 'shop', 'mood', 'tarot', 'achievements', 'collection', 'puzzles',
  'player', 'relations', 'tasks', 'watch', 'affection', 'themes', 'endings', 'dates',
  'dreams', 'hints', 'saves', 'settings'];

const browser = await chromium.launch({
  executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux/chrome',
  headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });

await page.goto(BASE + '/?debug=1', { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => window.__neonTest && window.__neonTest.engine);
await page.evaluate(() => { try { localStorage.clear(); } catch (_) {} });
await page.click('#lock-screen');
await page.waitForTimeout(400);
await page.evaluate(() => {
  const e = window.__neonTest.engine;
  e.state.day = 12;
  e.state.minute = 20 * 60;
  e.state.affection = { shenyan: 16, luci: 16, jiangyu: 16 };
  e.state.collected = Object.keys(window.STORY.collectibles || {}).slice(0, 12);
  e.state.photos = Object.keys(window.STORY.photos || {}).map(id => ({ id, ...window.STORY.photos[id], unlocked: true }));
  e.state.achievements = Object.fromEntries(Object.keys(window.STORY.achievements).slice(0, 8).map(k => [k, 1]));
  e.state.moments = Object.keys(window.STORY.moments || {}).slice(0, 4).map(id => ({ id, ...window.STORY.moments[id], likes: [], comments: [] }));
  e.emit('stateChange', e.state);
});

const results = [];
for (const app of APPS) {
  const before = Date.now();
  await page.evaluate(a => { try { window.openApp(a); } catch (_) {} }, app);
  await page.waitForTimeout(350);
  const info = await page.evaluate(() => {
    const scr = document.querySelector('.screen.active');
    const scroller = scr ? [...scr.querySelectorAll('*')].find(el => el.scrollWidth > el.clientWidth + 2 && window.getComputedStyle(el).overflowX !== 'visible') : null;
    return {
      active: scr?.id || '?',
      textLen: scr?.innerText?.trim().length || 0,
      overflowX: scroller ? { tag: scroller.tagName, cls: scroller.className, sw: scroller.scrollWidth, cw: scroller.clientWidth } : null,
      brokenImgs: scr ? [...scr.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0).length : 0,
      btnCount: scr ? scr.querySelectorAll('button').length : 0,
    };
  });
  const file = path.join(OUT, app + '.png');
  await page.screenshot({ path: file });
  results.push({ app, ms: Date.now() - before, ...info, shot: file, empty: info.textLen < 10 });
  console.log(`${info.textLen < 10 ? 'WARN' : 'OK  '} ${app.padEnd(12)} screen=${info.active} text=${info.textLen} overflow=${!!info.overflowX} brokenImg=${info.brokenImgs}`);
}

const summary = { total: results.length, empty: results.filter(r => r.empty).map(r => r.app), overflow: results.filter(r => r.overflowX), brokenImgs: results.filter(r => r.brokenImgs > 0), errors: [...new Set(errors)].slice(0, 30), results };
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ total: summary.total, empty: summary.empty, overflowCount: summary.overflow.length, errors: summary.errors }, null, 2));
await browser.close();