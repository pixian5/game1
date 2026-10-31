import { chromium } from '@playwright/test';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:4187';
const browser = await chromium.launch({
  executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux/chrome',
  headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const context = await browser.newContext({ viewport: { width: 430, height: 932 } });
const page = await context.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(String(e)));

await page.goto(BASE + '/?debug=1', { waitUntil: 'load' });
await page.waitForFunction(() => window.__neonTest);
await page.click('#lock-screen');
await page.evaluate(() => { const e = window.__neonTest.engine; e.scheduleEvent('jiangyu_call_night'); });

let answered = false;
const timeline = [];
for (let i = 0; i < 120; i++) {
  const s = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    const active = document.querySelector('.screen.active')?.id;
    const accept = [...document.querySelectorAll('[data-call="accept"]')].find(b => b.offsetParent !== null);
    const opts = [...document.querySelectorAll('#call-script button')].filter(b => b.offsetParent !== null);
    return {
      active, hasAccept: !!accept, optCount: opts.length,
      call: window._currentCall ? { step: window._currentCall.step, scriptLen: window._currentCall.script.length } : null,
      fired: Object.keys(e.state.firedEvents).filter(k => k.includes('music') || k.includes('jiangyu_call') || k.includes('wet')),
      screen: active,
    };
  });
  if (i % 10 === 0) timeline.push(s);
  if (s.hasAccept && !answered) { await page.click('[data-call="accept"]'); answered = true; }
  else if (s.optCount > 0) await page.evaluate(() => { const b = [...document.querySelectorAll('#call-script button')].find(x => x.offsetParent !== null); if (b) b.click(); });
  if (s.fired.includes('music_xia_unlock')) break;
  await page.waitForTimeout(250);
}
const final = await page.evaluate(() => {
  const e = window.__neonTest.engine;
  return { active: document.querySelector('.screen.active')?.id, call: window._currentCall, fired: Object.keys(e.state.firedEvents).filter(k => k.includes('music') || k.includes('jiangyu_call')), day: e.state.day, screenText: document.querySelector('#call-label')?.textContent };
});
console.log(JSON.stringify({ answered, timeline, final, errors: [...new Set(errors)] }, null, 2));
fs.writeFileSync('/workspace/neon-verify/call-result.json', JSON.stringify({ answered, timeline, final, errors }, null, 2));
await browser.close();