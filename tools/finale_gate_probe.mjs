/* ===== v0.9.7 D2 供片曲线 + 结局门槛对比（Node 直跑）=====
 * 回答两个问题：
 *   1) 选线后每天还能自然触发多少事件？（供片曲线）
 *   2) 给结局链加日期门槛（STORY.finaleGate = 9/11/15），玩家在结局前能多拿到多少内容？
 * 用法：node tools/finale_gate_probe.mjs [--json]
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

globalThis.window = globalThis;
require('./../tools/fake_clock.js');
const clock = globalThis.FakeClock.create();
globalThis.Clock = clock.api;
globalThis.setTimeout = clock.setTimeout;
globalThis.clearTimeout = clock.clearTimeout;

const mem = new Map();
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k),
  clear: () => mem.clear(), key: i => [...mem.keys()][i] ?? null,
  get length(){ return mem.size; }
};

const base = './..';
require(base + '/engine_domains.js');
require(base + '/interaction_queue.js');
require(base + '/save_migrations.js');
require(base + '/engine.js');
for (const f of ['engine_social.js','engine_content.js','engine_progress.js','engine_save.js']) require(base + '/' + f);

const { STORY } = await import(base + '/story/index.mjs');

const ROUTES = ['shenyan','luci','jiangyu','solo'];
const GATES = [null, 9, 11, 15];
const LAST_DAY = 21;

function probe(route, gate){
  STORY.finaleGate = gate;
  const thenId = (STORY.routeChoice.options.find(o => o.route === route) || {}).thenEvent;
  const e = new window.PhoneEngine(STORY);
  e.newGame();
  clock.flush();
  e.state.day = 6; e.state.minute = 23 * 60;
  e.state.firedEvents = {};
  e.state.pendingRouteEvents = [];
  e.state.deferredEventIds = [];
  e.state.pendingFinale = null;
  e._scheduledEvents.clear();
  e.chooseRoute(route);
  clock.advance(60000);

  const byDay = {};
  let before = new Set(Object.keys(e.state.firedEvents));
  let releaseDay = null;
  let atRelease = null;
  for (let d = 7; d <= LAST_DAY; d++){
    for (let h = 0; h <= 23; h++){
      e.state.day = d; e.state.minute = h * 60;
      e.checkTimeEvents();
      clock.advance(60000);
      const now = Object.keys(e.state.firedEvents);
      const fresh = now.filter(id => !before.has(id));
      if (fresh.length){
        byDay[d] = (byDay[d] || 0) + fresh.length;
        before = new Set(now);
      }
      if (releaseDay === null && thenId && e.state.firedEvents[thenId]){
        releaseDay = d;
        atRelease = Object.keys(e.state.firedEvents).length;
      }
    }
  }
  STORY.finaleGate = null;
  const routeIds = Object.keys(STORY.events).filter(k => (STORY.events[k].trigger || {}).route === route);
  return {
    byDay,
    total: Object.keys(byDay).reduce((n, d) => n + byDay[d], 0),
    routeFired: routeIds.filter(id => e.state.firedEvents[id]).length,
    routeAll: routeIds.length,
    releaseDay: releaseDay === null ? '—' : releaseDay,
    atRelease: atRelease === null ? '—' : atRelease
  };
}

const out = {};
for (const g of GATES) for (const r of ROUTES) (out[String(g)] = out[String(g)] || {})[r] = probe(r, g);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(out, null, 1));
} else {
  console.log('供片曲线：不回答最终抉择时每天的自然触发量\n');
  const days = Array.from({length: LAST_DAY - 6}, (_, i) => i + 7);
  console.log('day    ' + ROUTES.map(r => r.padEnd(9)).join(''));
  for (const d of days){
    const cells = ROUTES.map(r => String(out['null'][r].byDay[d] || 0).padEnd(9));
    if (cells.every(c => c.trim() === '0')) continue;
    console.log(String(d).padEnd(7) + cells.join(''));
  }

  console.log('\n结局门槛对比（放行日 / 放行时已触发事件数 / 路线事件）\n');
  console.log('gate     ' + ROUTES.map(r => r.padEnd(22)).join(''));
  for (const g of GATES){
    const cells = ROUTES.map(r => {
      const o = out[String(g)][r];
      return `${o.releaseDay}/${o.atRelease} (${o.routeFired}/${o.routeAll})`.padEnd(22);
    });
    console.log(String(g === null ? 'null' : g).padEnd(9) + cells.join(''));
  }
  console.log('\n注：releaseDay 是最终抉择被排程（而不是玩家回答）的日子；atRelease 是那一刻已触发的事件总数。');
}
