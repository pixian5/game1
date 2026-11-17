import path from 'node:path';
import fs from 'node:fs';
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:4187/index.html';
const OUT = path.join(process.cwd(), 'qa-shots', 'pwa');
fs.mkdirSync(OUT, { recursive: true });

const browser = await launchBrowser({ headless: true });
const context = await browser.newContext({ viewport: { width: 430, height: 932 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 150)));

const out = { base: BASE };
await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('#lock-screen', { visible: true, timeout: 30000 });
out.firstLoad = true;

out.swReady = await page.evaluate(async () => {
  if (!navigator.serviceWorker) return false;
  const reg = await Promise.race([
    navigator.serviceWorker.ready.then(() => true),
    new Promise(r => setTimeout(() => r(false), 20000)),
  ]);
  return reg;
});

await page.reload({ waitUntil: 'domcontentloaded' });
out.controlledAfterReload = await page.evaluate(() => !!navigator.serviceWorker.controller);

await context.setOffline(true);
let offlineLoaded = false;
try {
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
  offlineLoaded = await page.locator('#lock-screen').isVisible({ timeout: 10000 }).catch(() => false);
} catch (_) {}
out.offlineReload = offlineLoaded;
await context.setOffline(false);

try { await page.screenshot({ path: path.join(OUT, 'offline.png') }); } catch (_) {}
await page.waitForTimeout(300);
out.errors = [...new Set(errors)].slice(0, 10);
out.pass = out.swReady && out.controlledAfterReload && out.offlineReload;
fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();