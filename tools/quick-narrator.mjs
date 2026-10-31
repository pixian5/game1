import { chromium } from '@playwright/test';
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
await page.evaluate(() => window.openConversation('susu'));
await page.waitForTimeout(300);
await page.evaluate(() => window.__neonTest.engine.scheduleEvent('week1_review'));
await page.waitForTimeout(1200);
const r = await page.evaluate(() => {
  const m = document.getElementById('narrator-choice-modal');
  const e = window.__neonTest.engine;
  return {
    active: document.querySelector('.screen.active')?.id,
    modalExists: !!m,
    modalVisible: !!(m && m.offsetParent !== null),
    modalParent: m?.parentElement?.id || null,
    pending: e.getPendingInteractions().map(i => i.type),
    name: m?.innerText?.slice(0, 60) || '',
  };
});
await page.screenshot({ path: '/workspace/neon-verify/narrator-repro.png' });
console.log(JSON.stringify({ ...r, errors }, null, 2));
await browser.close();