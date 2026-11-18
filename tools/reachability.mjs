import path from 'node:path';
import fs from 'node:fs';
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:4187';
const OUT = path.join(process.cwd(), 'qa-shots', 'reachability');
fs.mkdirSync(OUT, { recursive: true });

const NEW_IDS = [
  'day4_rain_walk', 'day5_susu_lunch', 'day6_city_after_rain',
  'day4_shenyan_gallery_note', 'day5_shenyan_afterhours', 'day6_shenyan_archive', 'day7_shenyan_review',
  'day9_shenyan_preview', 'day11_shenyan_critic',
  'day4_luci_street_photo', 'day5_luci_darkroom', 'day6_luci_print', 'day7_luci_walk',
  'day9_luci_negative', 'day11_luci_exhibit',
  'day4_jiangyu_rehearsal', 'day5_jiangyu_market', 'day6_jiangyu_close', 'day7_jiangyu_song',
  'day9_jiangyu_lyric', 'day11_jiangyu_stage',
  'day5_solo_window', 'day8_solo_market', 'day9_solo_call'
];

const browser = await launchBrowser({ headless: true });
const results = {};

for (const route of ['shenyan', 'luci', 'jiangyu', 'solo']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/?debug=1', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__neonTest);
  await page.click('#lock-screen');
  results[route] = await page.evaluate(async ({ route, ids }) => {
    const e = window.__neonTest.engine;
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    e.state.route = route;
    const seen = new Set();
    for (let day = 7; day <= 9; day++) {
      for (let hour = 6; hour <= 23; hour++) {
        e.state.day = day;
        e.state.minute = hour * 60;
        e.advanceTime(1);
        await sleep(700);
        Object.keys(e.state.firedEvents).forEach(k => { if (ids.includes(k)) seen.add(k); });
      }
    }
    return { fired: [...seen].sort() };
  }, { route, ids: NEW_IDS });
  await page.close();
}

const summary = {
  base: BASE,
  routes: results,
  reachable: Object.fromEntries(Object.entries(results).map(([r, v]) => [r, v.fired.length])),
};
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 1));
await browser.close();