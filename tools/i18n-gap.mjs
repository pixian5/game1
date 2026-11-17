import path from 'node:path';
import fs from 'node:fs';
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:4187';
const OUT = path.join(process.cwd(), 'qa-shots', 'i18n');
fs.mkdirSync(OUT, { recursive: true });

const browser = await launchBrowser({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(BASE + '/?debug=1', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForFunction(() => window.__neonTest && window.STORY && window.I18N_PACKS);

const gaps = await page.evaluate(() => {
  const pack = window.I18N_PACKS['en-US'] || {};
  const has = s => typeof s === 'string' && Object.prototype.hasOwnProperty.call(pack, s);
  const cn = s => typeof s === 'string' && /[\u4e00-\u9fa5]{2,}/.test(s);
  const out = [];
  const add = (group, field, value) => {
    if (cn(value) && !has(value)) out.push({ group, field, value });
  };
  const S = window.STORY;
  const walk = (group, obj, fields) => Object.entries(obj || {}).forEach(([id, it]) => fields.forEach(f => add(group, id + '.' + f, it && it[f])));
  walk('location', S.locations, ['name', 'hint']);
  walk('character', S.characters, ['desc', 'bio']);
  walk('shopItem', (S.shop && S.shop.items) || {}, ['name', 'desc', 'cat']);
  walk('invitation', S.invitations, ['text', 'schedule', 'title']);
  walk('note', S.notes, ['title', 'preview']);
  walk('mood', S.moods, ['label', 'hint', 'name']);
  walk('achievement', S.achievements, ['name', 'desc']);
  walk('collectible', S.collectibles, ['name', 'desc']);
  walk('theme', S.themes, ['name']);
  walk('tarot', S.tarot, ['name', 'meaning', 'desc']);
  walk('profile', S.profiles, ['bio']);
  Object.entries(S.profiles || {}).forEach(([id, p]) => {
    (p.tags || []).forEach((tg, i) => add('profileTag', id + '.tags.' + i, tg));
    (p.relations || []).forEach((r, i) => add('profileRelation', id + '.rel.' + i, r.hint));
  });
  Object.entries(S.dateScenes || {}).forEach(([cid, scenes]) => (scenes || []).forEach((sc, i) => {
    add('dateScene', cid + '.' + i + '.name', sc.name);
    add('dateScene', cid + '.' + i + '.desc', sc.desc);
  }));
  return out;
});

const out = { base: BASE, total: gaps.length, gaps };
fs.writeFileSync(path.join(OUT, 'gaps.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();