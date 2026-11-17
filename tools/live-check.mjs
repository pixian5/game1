import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE || 'https://xbzsb-neon-heart.static.hf.space/index.html';
const OUT = process.env.OUT || path.join(process.cwd(), 'qa-shots', 'live');
fs.mkdirSync(OUT, { recursive: true });

const browser = await launchBrowser({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
const errors = [];
const failed = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', e => errors.push('pageerror: ' + String(e).slice(0, 200)));
page.on('requestfailed', r => failed.push(r.url() + ' :: ' + (r.failure() && r.failure().errorText)));
page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });

const out = { base: BASE, steps: [] };
await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('#lock-screen', { visible: true, timeout: 30000 });
out.title = await page.title();
out.version = await page.evaluate(() => document.querySelector('meta[name="version"]')?.content || '');
out.scripts = await page.evaluate(() => [...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src')));
try { out.localVersion = fs.readFileSync(path.join(process.cwd(), 'VERSION'), 'utf8').trim(); } catch(_) {}
out.versionMatch = out.localVersion ? String(out.version).replace(/^v/, '') === out.localVersion : null;
await page.screenshot({ path: path.join(OUT, '01-lock.png') });
out.steps.push('lock-visible');

await page.click('#lock-screen');
await page.waitForSelector('#home-screen.active', { timeout: 15000 });
out.appCount = await page.evaluate(() => document.querySelectorAll('[data-app]').length);
await page.screenshot({ path: path.join(OUT, '02-home.png') });
out.steps.push('home-unlocked');

await page.click('[data-app="messages"]');
await page.waitForSelector('#messages-app.active', { timeout: 10000 });
out.convCount = await page.evaluate(() => document.querySelectorAll('.conv-item').length);
await page.screenshot({ path: path.join(OUT, '03-messages.png') });
out.steps.push('messages-open');

if (out.convCount > 0) {
  await page.click('.conv-item');
  await page.waitForSelector('#chat-screen.active', { timeout: 10000 });
  await page.waitForTimeout(800);
  out.chatName = await page.evaluate(() => document.getElementById('chat-name')?.textContent || '');
  out.bubbleCount = await page.evaluate(() => document.querySelectorAll('#chat-body .msg').length);
  await page.screenshot({ path: path.join(OUT, '04-chat.png') });
  out.steps.push('chat-open');
}

out.swControlled = await page.evaluate(() => !!(navigator.serviceWorker && navigator.serviceWorker.controller));
out.bundle = null;
const bundleSrc = (out.scripts || []).find(s => /bundle\.js/.test(s));
if (bundleSrc) {
  try {
    const res = await context.request.get(new URL(bundleSrc, BASE).href, { timeout: 60000 });
    if (res.ok()) {
      const buf = await res.body();
      const hash = crypto.createHash('sha256').update(buf).digest('hex');
      const localBundle = path.join(process.cwd(), 'dist', 'bundle.js');
      const localHash = fs.existsSync(localBundle) ? crypto.createHash('sha256').update(fs.readFileSync(localBundle)).digest('hex') : null;
      out.bundle = { url: new URL(bundleSrc, BASE).href, size: buf.length, hash: hash.slice(0, 16), localHash: localHash && localHash.slice(0, 16), match: localHash ? hash === localHash : null };
    }
  } catch (_) {}
}
out.errors = [...new Set(errors)].slice(0, 20);
out.failed = [...new Set(failed)].slice(0, 20);
fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();