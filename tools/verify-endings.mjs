import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:4187';
const OUT = process.env.OUT || '/workspace/neon-verify/endings';
fs.mkdirSync(OUT, { recursive: true });

const CASES = [
  { id: 'shenyan_hidden', route: 'shenyan', flags: { shenyan_choice: 'confront' }, collected: ['memento_pen'], affection: {} },
  { id: 'shenyan_good', route: 'shenyan', flags: { shenyan_choice: 'confront', shenyan_resist: 1 }, collected: [], affection: {} },
  { id: 'shenyan_bad', route: 'shenyan', flags: { shenyan_choice: 'endure', shenyan_deny: 1 }, collected: [], affection: {} },
  { id: 'shenyan_normal', route: 'shenyan', flags: { shenyan_choice: 'confront' }, collected: [], affection: {} },
  { id: 'luci_hidden', route: 'luci', flags: { luci_choice: 'accept' }, collected: ['evidence_letter'], affection: {} },
  { id: 'luci_good', route: 'luci', flags: { luci_choice: 'accept', luci_confess: 1 }, collected: [], affection: {} },
  { id: 'luci_bad', route: 'luci', flags: { luci_choice: 'miss', luci_letgo: 1 }, collected: [], affection: {} },
  { id: 'luci_normal', route: 'luci', flags: { luci_choice: 'accept' }, collected: [], affection: {} },
  { id: 'jiangyu_hidden', route: 'jiangyu', flags: { jiangyu_choice: 'stay' }, collected: ['evidence_lyrics'], affection: {} },
  { id: 'jiangyu_good', route: 'jiangyu', flags: { jiangyu_choice: 'stay', jiangyu_hold: 1 }, collected: [], affection: {} },
  { id: 'jiangyu_bad', route: 'jiangyu', flags: { jiangyu_choice: 'leave', jiangyu_leave: 1 }, collected: [], affection: {} },
  { id: 'jiangyu_normal', route: 'jiangyu', flags: { jiangyu_choice: 'stay' }, collected: [], affection: {} },
  { id: 'solo_good', route: 'solo', flags: { solo_independent: 1 }, collected: [], affection: {} },
  { id: 'solo_normal', route: 'solo', flags: { solo_accept: 1 }, collected: [], affection: {} },
  { id: 'solo_bad', route: 'solo', flags: {}, collected: [], affection: {} },
  { id: 'solo_hidden', route: 'solo', flags: {}, collected: ['postcard_neon', 'stamp_first', 'ticket_gallery', 'ticket_bar', 'postcard_sea', 'memento_camera', 'postcard_school', 'recording_xia', 'evidence_photo', 'recording_msg'], affection: {}, achievements: {} },
  { id: 'true_ending', route: 'solo', flags: {}, collected: [], affection: {}, achievements: null },
];

const browser = await chromium.launch({
  executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux/chrome',
  headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
page.on('requestfailed', r => errors.push('requestfailed ' + r.url()));

const results = [];
for (const c of CASES) {
  await page.goto(BASE + '/?debug=1', { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => window.__neonTest && window.__neonTest.engine, null, { timeout: 20000 });
  await page.evaluate(() => { try { localStorage.clear(); } catch (_) {} });
  await page.click('#lock-screen');
  await page.waitForTimeout(300);

  const computed = await page.evaluate(c => {
    const e = window.__neonTest.engine;
    e.state.route = c.route;
    e.state.flags = { ...c.flags };
    e.state.collected = [...c.collected];
    e.state.affection = { shenyan: 0, luci: 0, jiangyu: 0, ...c.affection };
    if (c.achievements === null) {
      e.state.achievements = Object.fromEntries(Object.keys(window.STORY.achievements).slice(0, 9).map(k => [k, true]));
    } else {
      e.state.achievements = {};
    }
    e.state.ended = false;
    return window.STORY.computeEnding(e.state, c.route);
  }, c);

  await page.evaluate(id => window.__neonTest.engine.triggerEnding(id), c.id);
  await page.waitForFunction(() => document.querySelector('#ending-screen')?.classList.contains('active'), null, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(400);

  const ui = await page.evaluate(() => ({
    active: document.querySelector('.screen.active')?.id,
    title: document.getElementById('ending-title')?.textContent || '',
    text: document.getElementById('ending-text')?.textContent || '',
    tag: document.getElementById('ending-tag')?.textContent || '',
    cgSrc: document.getElementById('ending-cg')?.getAttribute('src') || '',
    cgLoaded: (() => { const i = document.getElementById('ending-cg'); return !!(i && i.complete && i.naturalWidth > 0); })(),
    ngBtn: !!document.getElementById('btn-ngplus'),
    seen: Object.keys(window.__neonTest.engine.state.endingSeen || {}),
  }));
  const file = path.join(OUT, c.id + '.png');
  await page.screenshot({ path: file });

  results.push({ id: c.id, computed, uiActive: ui.active, title: ui.title, tag: ui.tag, cgSrc: ui.cgSrc, cgLoaded: ui.cgLoaded, ngBtn: ui.ngBtn, seen: ui.seen, shot: file, pass: computed === c.id && ui.active === 'ending-screen' && !!ui.title });
  console.log(`${results.at(-1).pass ? 'PASS' : 'FAIL'} ${c.id} computed=${computed} title=${ui.title} cg=${ui.cgLoaded}`);
}

const summary = { total: results.length, passed: results.filter(r => r.pass).length, results, errors: [...new Set(errors)].slice(0, 30) };
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ total: summary.total, passed: summary.passed, errors: summary.errors, failed: results.filter(r => !r.pass).map(r => r.id) }, null, 2));
await browser.close();
process.exit(summary.passed === summary.total && summary.errors.length === 0 ? 0 : 2);