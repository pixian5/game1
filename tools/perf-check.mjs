import path from 'node:path';
import fs from 'node:fs';
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:4188/';
const OUT = path.join(process.cwd(), 'qa-shots', 'perf');
fs.mkdirSync(OUT, { recursive: true });

const browser = await launchBrowser({ headless: true });

const measure = async (width, height, label) => {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 120)));
  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  const loadMs = Date.now() - t0;
  await page.waitForSelector('#lock-screen', { visible: true, timeout: 20000 });
  const nav = await page.evaluate(() => {
    const n = window.performance.getEntriesByType('navigation')[0] || {};
    const res = window.performance.getEntriesByType('resource');
    return {
      dcl: Math.round(n.domContentLoadedEventEnd || 0),
      load: Math.round(n.loadEventEnd || 0),
      resources: res.length,
      transferred: Math.round(res.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024),
      nodes: document.querySelectorAll('*').length,
      heapMB: window.performance.memory ? Math.round(window.performance.memory.usedJSHeapSize / 1048576) : null,
    };
  });
  await page.click('#lock-screen');
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    return de.scrollWidth > window.innerWidth + 2;
  });
  await page.screenshot({ path: path.join(OUT, label + '.png'), fullPage: false });
  await context.close();
  return { label, width, height, loadMs, ...nav, overflowX: overflow, errors };
};

const results = [];
for (const v of [[390, 844, '390x844'], [430, 932, '430x932'], [768, 1024, '768x1024'], [1440, 900, '1440x900']]) {
  results.push(await measure(v[0], v[1], v[2]));
}

const out = { base: BASE, results };
out.pass = results.every(r => !r.overflowX && r.errors.length === 0);
fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();