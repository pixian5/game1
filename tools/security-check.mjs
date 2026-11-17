import path from 'node:path';
import fs from 'node:fs';
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:4187';
const OUT = path.join(process.cwd(), 'qa-shots', 'security');
fs.mkdirSync(OUT, { recursive: true });

const browser = await launchBrowser({ headless: true });
const context = await browser.newContext({ viewport: { width: 430, height: 932 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
page.on('dialog', d => d.dismiss().catch(() => {}));

await page.goto(BASE + '/?debug=1', { waitUntil: 'load' });
await page.waitForFunction(() => window.__neonTest);
await page.click('#lock-screen');
await page.waitForTimeout(400);

const PAYLOAD = '<img src=x onerror="window.__xss=1"><script>window.__xss2=1</script>';

const r1 = await page.evaluate(payload => {
  const e = window.__neonTest.engine;
  e.state.player = { ...(e.state.player || {}), name: payload };
  e.emit('stateChange', e.state);
  try { window.openApp('profile'); } catch (_) {}
  return {
    hasRawImg: !!document.querySelector('img[src="x"]'),
    textShown: (document.querySelector('.screen.active')?.innerText || '').includes('<img'),
  };
}, PAYLOAD);

const r2 = await page.evaluate(payload => {
  const e = window.__neonTest.engine;
  const c = e.state.conversations.susu;
  c.pendingChoice = { prompt: '测试', options: [{ text: 'A' }], freeInput: { placeholder: 'x', keywords: [], defaultEffect: {} } };
  window.openConversation('susu');
  const field = document.getElementById('chat-free-input-field');
  field.dataset.convId = 'susu';
  field.dataset.keywords = '[]';
  field.dataset.defaultEffect = '{}';
  field.value = payload;
  window.handleFreeSend(false);
  return { hasRawImg: !!document.querySelector('#chat-body img[src="x"]') };
}, PAYLOAD);

const r3 = await page.evaluate(() => {
  const e = window.__neonTest.engine;
  const bad = JSON.stringify({ app: 'neon-heart', save: { slot: 'auto', state: { day: 3, player: { name: '<img src=x onerror="window.__xss3=1">' }, conversations: { susu: { messages: [{ id: 'x', from: 'susu', text: '<img src=x onerror="window.__xss3=1">', ts: 1 }], unread: 0 } } } } });
  const res = e.importSave(bad, 'manual1');
  if (res && res.ok) e.load('manual1');
  return { imported: res && res.ok };
});

await page.waitForTimeout(600);
const xss = await page.evaluate(() => ({
  xss1: !!window.__xss, xss2: !!window.__xss2, xss3: !!window.__xss3,
  rawImg: document.querySelectorAll('img[src="x"]').length,
}));

const out = { payload: PAYLOAD, profile: r1, chat: r2, save: r3, xss, errors: [...new Set(errors)].slice(0, 10) };
out.pass = !xss.xss1 && !xss.xss2 && !xss.xss3 && xss.rawImg === 0 && out.errors.length === 0;
fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();