/* ===== v0.9.7 路线时序回归（L1 引擎直测，无浏览器）=====
 * 锁死 D1：选线夜在 23:00，day7 白天命中的路线事件曾被永久丢弃。
 * 数据事实：day4/5/6 的线内事件 id 虽带旧日期，trigger.day 已统一重排到 day7。
 * 运行：node test_route_timing.mjs
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const assert = (await import('node:assert')).strict;

globalThis.window = globalThis;
require('./tools/fake_clock.js');            // 虚拟时钟：1.5s 错峰零真实等待
const clock = globalThis.FakeClock.create();
globalThis.Clock = clock.api;
globalThis.setTimeout = clock.setTimeout;
globalThis.clearTimeout = clock.clearTimeout;

const mem = new Map();                        // 最小 localStorage
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k),
  clear: () => mem.clear(),
  key: i => [...mem.keys()][i] ?? null,
  get length(){ return mem.size; }
};

require('./engine_domains.js');
require('./interaction_queue.js');
require('./save_migrations.js');
require('./engine.js');
for (const f of ['engine_social.js','engine_content.js','engine_progress.js','engine_save.js']) require('./' + f);

const { STORY } = await import('./story/index.mjs');
const e = new window.PhoneEngine(STORY);

let pass = 0;
const failures = [];
function test(name, fn){
  try { fn(); pass++; console.log('  ok  ' + name); }
  catch(err){ failures.push({name, err}); console.log('FAIL  ' + name + ' :: ' + err.message); }
}

const idsOf = route => Object.keys(STORY.events).filter(k => (STORY.events[k].trigger || {}).route === route);
const upTo = (ids, day) => ids.filter(id => STORY.events[id].trigger.day <= day);
const SHEN = idsOf('shenyan'), LUCI = idsOf('luci'), SOLO = idsOf('solo');
const fired = ids => ids.filter(id => e.state.firedEvents[id]);

function boot(day, hour, route){
  e.newGame();
  clock.flush();                 // 先排空上一用例遗留定时器
  e.state.day = day;
  e.state.minute = hour * 60;
  e.state.route = route;
  e.state.ended = false;
  e.state.firedEvents = {};
  e.state.pendingRouteEvents = [];
  e.state.deferredEventIds = [];
  e._scheduledEvents.clear();
  clock.flush();
}

test('TC-INF-01/02 剧情入口加载 338 条且含 01b/01c', () => {
  assert.equal(Object.keys(STORY.events).length, 338);
  assert.ok(STORY.events.day5_solo_window, '缺 day5_solo_window（01b 未加载）');
  assert.ok(STORY.events.day7_shenyan_review, '缺 day7_shenyan_review（01c 未加载）');
});

test('TC-RT-01 未选线跨日补扫 day6–7 → 全部入队、零派发', () => {
  boot(7, 23, null);
  e._checkTimeEventsForRange(6, 0, 7, 23);
  const queued = e.state.pendingRouteEvents.map(x => x.id);
  for (const id of [...upTo(SHEN,7), ...upTo(LUCI,7), ...upTo(SOLO,7)]) assert.ok(queued.includes(id), '未入队 ' + id);
  assert.equal(fired([...SHEN, ...LUCI, ...SOLO]).length, 0, '未选线不应派发路线事件');
});

test('TC-RT-02 选沈线后 6/6 补发', () => {
  boot(7, 23, null);
  e._checkTimeEventsForRange(6, 0, 7, 23);
  assert.equal(e.chooseRoute('shenyan'), true);
  clock.advance(30000);
  assert.deepEqual(fired(SHEN).sort(), [...SHEN].sort(), '沈线未 6/6');
  assert.equal(e.state.pendingRouteEvents.length, 0, '队列应清空');
});

test('TC-RT-03 选陆线只补陆线（含 10:00/15:00 两条旧丢失项）', () => {
  boot(7, 23, null);
  e._checkTimeEventsForRange(6, 0, 7, 23);
  e.chooseRoute('luci');
  clock.advance(30000);
  assert.deepEqual(fired(upTo(LUCI,7)).sort(), [...upTo(LUCI,7)].sort(), '陆线 day7 未全补');
  assert.ok(!e.state.firedEvents.day9_luci_negative, '未来窗口被提前补发');
  assert.ok(e.state.firedEvents.day4_luci_street_photo);
  assert.ok(e.state.firedEvents.day5_luci_darkroom);
  assert.equal(fired(SHEN).length, 0, '串线到沈线');
});

test('TC-RT-04 选独行后补发 day5_solo_window（旧丢失项）', () => {
  boot(7, 23, null);
  e._checkTimeEventsForRange(5, 0, 7, 23);
  e.chooseRoute('solo');
  clock.advance(30000);
  assert.ok(e.state.firedEvents.day5_solo_window, '未补发 day5_solo_window');
});

test('TC-RT-05 已选线时扫描不入队', () => {
  boot(7, 23, 'shenyan');
  e._checkTimeEventsForRange(7, 0, 7, 23);
  assert.equal(e.state.pendingRouteEvents.length, 0);
});

test('TC-RT-06 二次 chooseRoute 返回 false 且不重复补发', () => {
  boot(7, 23, null);
  e._checkTimeEventsForRange(7, 0, 7, 23);
  e.chooseRoute('shenyan');
  clock.advance(30000);
  const before = fired(SHEN).length;
  assert.equal(e.chooseRoute('luci'), false);
  clock.advance(30000);
  assert.equal(fired(SHEN).length, before);
});

test('TC-RT-07 补发后重扫同区间不重复', () => {
  boot(7, 23, null);
  e._checkTimeEventsForRange(7, 0, 7, 23);
  e.chooseRoute('shenyan');
  clock.advance(30000);
  const before = fired(SHEN).length;
  e._checkTimeEventsForRange(7, 0, 7, 23);
  clock.advance(30000);
  assert.equal(fired(SHEN).length, before);
});

test('TC-RT-08 结局后 flush 不派发', () => {
  boot(7, 23, null);
  e._checkTimeEventsForRange(7, 0, 7, 23);
  e.state.ended = true;
  const n = e._flushPendingRouteEvents();
  clock.advance(30000);
  assert.equal(n, 0);
  assert.equal(fired([...SHEN, ...LUCI, ...SOLO]).length, 0);
});

test('TC-RT-09 08:00 扫描不提前挂起 09:00 之后的事件', () => {
  boot(7, 8, null);
  e._checkTimeEventsForRange(7, 0, 7, 8);
  assert.equal(e.state.pendingRouteEvents.length, 0, '未来窗口被提前挂起');
});

test('TC-RT-11 补发按 1.5s 错峰', () => {
  boot(7, 23, null);
  e._checkTimeEventsForRange(7, 0, 7, 23);
  e.chooseRoute('shenyan');
  clock.flush();                       // 执行 0ms 的首条
  const at0 = fired(SHEN).length;
  clock.advance(1000);
  const at1s = fired(SHEN).length;
  clock.advance(30000);
  const atAll = fired(SHEN).length;
  assert.equal(at0, 1, '首条应立刻派发');
  assert.equal(at1s, 1, '1s 内不应有第二条');
  assert.equal(atAll, SHEN.length);
});

test('TC-SAVE-01 v3 旧档迁移补 pendingRouteEvents=[]', () => {
  const out = window.SaveMigrations.migrate({v:3, state:{day:3, minute:100}});
  assert.deepEqual(out.state.pendingRouteEvents, []);
  assert.equal(out.v, 4);
});

test('TC-SAVE-02 v3 已选线旧档清空队列', () => {
  const out = window.SaveMigrations.migrate({v:3, state:{route:'luci'}});
  assert.deepEqual(out.state.pendingRouteEvents, []);
});

test('TC-SAVE-03 挂起队列随存档往返', () => {
  boot(7, 23, null);
  e._checkTimeEventsForRange(7, 0, 7, 23);
  const n = e.state.pendingRouteEvents.length;
  assert.ok(n > 0);
  assert.equal(e.save('slot1'), true, '存档失败');
  e.newGame();
  assert.equal(e.load('slot1'), true, '读档失败');
  assert.equal(e.state.pendingRouteEvents.length, n, '队列未随档恢复');
});

test('TC-SAVE-04 延后队列（deferredEventIds）随档往返', () => {
  boot(7, 23, 'shenyan');
  e.state.deferredEventIds = ['day7_shenyan_review', 'day5_solo_window'];
  assert.equal(e.save('slot2'), true, '存档失败');
  e.newGame();
  assert.equal(e.load('slot2'), true, '读档失败');
  assert.deepEqual(e.state.deferredEventIds.sort(), ['day5_solo_window', 'day7_shenyan_review']);
});

test('TC-SAVE-05 非法/未知事件 id 读档时被剔除', () => {
  const out = window.SaveMigrations.migrate({v:3, state:{}});
  out.state.deferredEventIds = ['__proto__', 'not_an_event', 'day7_shenyan_review'];
  e.newGame();
  e.state = e._sanitizeLoadedState(out.state);
  assert.deepEqual(e.state.deferredEventIds, ['day7_shenyan_review']);
});

// ---------- TC-GATE：D2-A′ 结局日期门槛（原型，默认关闭）----------
test('TC-GATE-01 默认（gate=null）行为不变：选线即排最终抉择', () => {
  assert.equal(STORY.finaleGate, null, '默认必须关闭');
  boot(6, 23, null);
  assert.equal(e.chooseRoute('shenyan'), true);
  clock.advance(60000);
  assert.equal(e.state.pendingFinale, null);
  const thenId = STORY.routeChoice.options.find(o => o.route === 'shenyan').thenEvent;
  assert.ok(thenId, '数据缺少 thenEvent');
  assert.ok(e.state.firedEvents[thenId], '最终抉择未按现状排程：' + thenId);
});

test('TC-GATE-02 gate=9：day6 选线不排，day9 才放行且只放一次', () => {
  STORY.finaleGate = 9;
  try {
    boot(6, 23, null);
    assert.equal(e.chooseRoute('shenyan'), true);
    clock.advance(60000);
    assert.equal(e.state.firedEvents[e.state.pendingFinale.eventId], undefined, '门槛前就派发了');
    assert.equal(e.state.pendingFinale.day, 9);
    assert.ok(e.state.pendingFinale.eventId);

    // 门槛未到：反复检查也不放行
    e.state.day = 8; e.state.minute = 23 * 60;
    const stillHeld = e.state.pendingFinale.eventId;
    e.checkTimeEvents(); clock.advance(60000);
    assert.equal(e.state.firedEvents[stillHeld], undefined);
    assert.ok(e.state.pendingFinale, '门槛未到不应放行');

    // 到 day9：放行一次
    const heldId = e.state.pendingFinale.eventId;
    e.state.day = 9; e.state.minute = 0;
    e.checkTimeEvents(); clock.advance(60000);
    assert.ok(e.state.firedEvents[heldId], '到日子未放行：' + heldId);
    assert.equal(e.state.pendingFinale, null, '放行后应清空');

    const routeFired = Object.keys(e.state.firedEvents).filter(id => (SHEN.includes(id))).length;
    e.checkTimeEvents(); clock.advance(60000);
    assert.equal(e.state.pendingFinale, null);
    assert.equal(Object.keys(e.state.firedEvents).filter(id => SHEN.includes(id)).length, routeFired, '重复放行');
  } finally { STORY.finaleGate = null; }
});

test('TC-GATE-03 被门槛拦下的最终抉择随存档往返', () => {
  STORY.finaleGate = 11;
  try {
    boot(6, 23, null);
    e.chooseRoute('luci');
    clock.advance(60000);
    const held = {...e.state.pendingFinale};
    assert.equal(held.day, 11);
    assert.ok(held.eventId, '门槛应挂住一个事件');
    assert.equal(e.save('slot3'), true);
    e.newGame();
    assert.equal(e.load('slot3'), true);
    assert.deepEqual(e.state.pendingFinale, held);
  } finally { STORY.finaleGate = null; }
});

console.log('\n' + pass + ' passed, ' + failures.length + ' failed');
if (failures.length){
  for (const f of failures) console.error('\n--- ' + f.name + '\n' + f.err.stack);
  process.exit(1);
}
