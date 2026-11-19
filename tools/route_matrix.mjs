/* ===== v0.9.7 路线开机矩阵（Node 直跑，不需要浏览器）=====
 * 目的：验证「选线日不同 → 路线事件触发率不变」。
 * 旧实现下：day6 选线 6/6，day7 选线 4/6 / 2/3（白天事件被吞）。
 * 用法：node tools/route_matrix.mjs [--json]
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
const routeIds = r => Object.keys(STORY.events).filter(k => (STORY.events[k].trigger || {}).route === r);
const END_HOUR = { day: 9, hour: 23 };   // 观察到 day9 结束，足以覆盖结局前的全部路线事件

function run(route, selDay, selHour){
  const e = new window.PhoneEngine(STORY);
  e.newGame();
  clock.flush();
  e.state.day = selDay;
  e.state.minute = selHour * 60;
  e.state.firedEvents = {};
  e.state.pendingRouteEvents = [];
  e.state.deferredEventIds = [];
  e._scheduledEvents.clear();

  // 选线前：逐小时走（模拟真实推进，跨日补扫自然发生）
  for (let d = selDay; d <= END_HOUR.day; d++){
    const startH = d === selDay ? 0 : 0, endH = 23;
    for (let h = startH; h <= endH; h++){
      if (d === selDay && h > selHour) break;
      e.state.day = d; e.state.minute = h * 60;
      e.checkTimeEvents();
      clock.advance(60000);
    }
    if (d === selDay) { e.state.day = d; e.state.minute = selHour * 60; break; }
  }
  // 选线
  const ok = e.chooseRoute(route);
  clock.advance(60000);
  // 选线后：继续推进到 END_HOUR，让补发与正常调度都跑完
  for (let d = selDay; d <= END_HOUR.day; d++){
    for (let h = 0; h <= 23; h++){
      if (d === selDay && h < selHour) continue;
      e.state.day = d; e.state.minute = h * 60;
      e.checkTimeEvents();
      clock.advance(60000);
    }
  }
  clock.advance(60000);
  const ids = routeIds(route);
  const fired = ids.filter(id => e.state.firedEvents[id]);
  return { ok, fired: fired.length, total: ids.length, missing: ids.filter(id => !e.state.firedEvents[id]) };
}

// 第三档：突然跳到 day9（模拟“睡过头”式跨日推进），检验范围补扫与补发不会重复
function runJump(route){
  const e = new window.PhoneEngine(STORY);
  e.newGame();
  clock.flush();
  e.state.day = 6; e.state.minute = 23 * 60;
  e.state.firedEvents = {};
  e.state.pendingRouteEvents = [];
  e.state.deferredEventIds = [];
  e._scheduledEvents.clear();
  e._checkTimeEventsForRange(6, 0, 7, 23);          // 选线前先扫一遍 → 入队
  const ok = e.chooseRoute(route);
  clock.advance(60000);                              // 补发开始
  e._checkTimeEventsForRange(7, 0, 9, 23);           // 再模拟一次跨日大跳
  clock.advance(600000);
  const ids = routeIds(route);
  return { ok, fired: ids.filter(id => e.state.firedEvents[id]).length, total: ids.length,
           missing: ids.filter(id => !e.state.firedEvents[id]) };
}

const out = { selectionTimes: [], matrix: {} };
for (const [selDay, selHour] of [[6, 23], [7, 23]]){
  out.selectionTimes.push(`day${selDay} ${String(selHour).padStart(2,'0')}:00`);
  for (const r of ROUTES){
    out.matrix[`day${selDay}`] = out.matrix[`day${selDay}`] || {};
    out.matrix[`day${selDay}`][r] = run(r, selDay, selHour);
  }
}

out.matrix['jump'] = {};
for (const r of ROUTES) out.matrix['jump'][r] = runJump(r);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(out, null, 1));
} else {
  console.log('路线事件触发矩阵（total = 该线全部事件）');
  console.log('选线时点        ' + ROUTES.map(r => r.padEnd(10)).join(''));
  for (const [day, row] of Object.entries(out.matrix)){
    const label = day === 'jump' ? '跨日大跳→9 ' : `${day} 23:00     `;
    console.log(label + ROUTES.map(r => `${row[r].fired}/${row[r].total}`.padEnd(10)).join(''));
  }
  const bad = [];
  for (const [day, row] of Object.entries(out.matrix))
    for (const r of ROUTES) if (row[r].fired !== row[r].total) bad.push(`${day}/${r} 缺 ${row[r].missing.join(',')}`);
  console.log(bad.length ? '\n✗ ' + bad.join('\n✗ ') : `\n✓ ${Object.keys(out.matrix).length * ROUTES.length}/${Object.keys(out.matrix).length * ROUTES.length} 格全部 100%`);
  if (bad.length) process.exitCode = 1;
}
