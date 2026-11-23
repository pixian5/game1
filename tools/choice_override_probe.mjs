/* ===== 选择覆盖探测（v0.9.11）=====
 * 目的：验证「同一会话里后到的选择静默覆盖先到选择」在真实剧情推进中是否可达。
 *
 * 为什么需要这个工具：
 *   引擎投递带选择的消息时直接执行 conv.pendingChoice = msg.choice。
 *   如果该会话已经挂着一个没回复的选择，旧选择就被静默顶掉，
 *   它的 thenEvent 永远不会派发。之前的全流程脚本都是一看到选择就立刻作答，
 *   所以永远观察不到覆盖；真实玩家却常常先去干别的、过几个小时才回来回复。
 *
 * 驱动方式（贴近真实游玩，不要手动改写 state.day）：
 *   主线靠剧情里的 advance_day 事件自己推进日期。本工具只做真实玩家会做的事：
 *     - 真实时间每步前进 1 秒，让打字延迟、消息投递、thenEvent 派发自然发生
 *     - 全屏强制交互（路线选择 / 旁白选择 / 来电 / 偶遇 / 梦境 / 梦魇）出现就立即处理
 *     - 聊天选择按「玩家模型」延迟作答
 *     - 连续几秒没有任何新动静（= 玩家闲着）就出行一次，推进 30 分钟游戏时间
 *
 * 玩家模型：
 *   delayHours = 0  勤奋玩家：选择一出现立刻回复
 *   delayHours = N  分心玩家：选择挂起满 N 个游戏小时才回复
 *
 * 用法：node tools/choice_override_probe.mjs [--delays 0,2,6,12] [--routes shenyan,luci]
 * 退出码：出现任何「静默覆盖」，或任何一条路线没走到结局 → 1
 *        （已挂进测试门禁：npm run probe:choice，verify:offline 与 test:all 都会跑）
 *
 * 历史结论（v0.9.10 修复前）：分心玩家在江屿线会永久卡死——
 *   day9 23 时「他在崩溃的边缘」（主线）被「江屿邀请你听首唱」顶掉，
 *   route_jiangyu_relic → … → route_jiangyu_end_check → __jiangyu_end_judge 共 7 条不再触发。
 * v0.9.11 改成排队后：16 次运行 0 覆盖、全部通关。
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

globalThis.window = globalThis;
require(path.join(ROOT, 'tools/fake_clock.js'));
const clock = globalThis.FakeClock.create();
globalThis.Clock = clock.api;
globalThis.setTimeout = clock.setTimeout;
globalThis.clearTimeout = clock.clearTimeout;
// 邀约超时（120 秒）、来电未接（25 秒）等判定用的是 Date.now() 真实墙上时间。
// 整个模拟只跑零点几秒真实时间，不接管的话邀约在模拟里永远不会超时，与真实游玩不符。
// 这里让 Date.now() 跟随虚拟时钟；Date 构造器不动，不影响「现实日期」类的判断。
Date.now = clock.Date.now;

// 最小 localStorage 桩：引擎构造时会读写存档索引
const mem = new Map();
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k),
  clear: () => mem.clear(),
  key: i => [...mem.keys()][i] ?? null,
  get length(){ return mem.size; }
};

for (const f of ['engine_domains.js', 'interaction_queue.js', 'save_migrations.js', 'engine.js',
  'engine_social.js', 'engine_content.js', 'engine_progress.js', 'engine_save.js']) {
  require(path.join(ROOT, f));
}
const { STORY } = await import(path.join(ROOT, 'story/index.mjs'));

const ALL_ROUTES = ['shenyan', 'luci', 'jiangyu', 'solo'];
let MAX_DAY = 21;               // 超过这天还没结局就视为「卡住」；可用 --max-day=N 放宽（做长剧情实验时用）
const IDLE_SECONDS = 6;        // 连续多少秒没动静算玩家空闲
const MAX_STEPS = 80000;       // 防死循环

function arg(name, fallback){
  const hit = process.argv.find(a => a.startsWith(`--${name}=`));
  if(hit) return hit.slice(name.length + 3);
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith('--') ? process.argv[idx + 1] : fallback;
}

/* 给消息投递加探测：对比投递前后目标会话的 pendingChoice。
 * 「当前选择换了人」分两种情况，必须区别对待：
 *   - 旧选择仍在队列里（邀约给普通选择让位，v0.9.11 的设计行为）→ 没有丢，单独计数
 *   - 旧选择既不是当前选择、也不在队列里 → 静默丢失，这才是要拦截的缺陷
 */
function instrument(e, sink, stats){
  const orig = e._deliverPendingMessage.bind(e);
  e._deliverPendingMessage = (id) => {
    const item = e.state.pendingMessages.find(p => p.id === id);
    let target = null;
    let label = '';
    if(item && item.choice && !item.choice.auto){
      if(item.groupId){ target = e.state.groups[item.groupId]; label = 'group:' + item.groupId; }
      else if(item.from && item.from !== 'narrator'){ target = e.state.conversations[item.from]; label = item.from; }
    }
    const before = target ? target.pendingChoice : null;
    const result = orig(id);
    const after = target ? target.pendingChoice : null;
    if(target && before && after && before !== after){
      if(Array.isArray(target.choiceQueue) && target.choiceQueue.includes(before)){
        stats.requeues++;
        return result;
      }
      const thenOf = ch => [...new Set((ch.options || []).map(o => o && o.effects && o.effects.thenEvent).filter(Boolean))];
      sink.push({
        day: e.state.day,
        hour: e.getTime().hour,
        conv: label,
        lost: String(before.prompt || '').slice(0, 26),
        lostThen: thenOf(before),
        arrived: String(after.prompt || '').slice(0, 26)
      });
    }
    return result;
  };
}

/* 接听来电：复刻 ui/05_calls.js —— 走完脚本（含脚本内选择），结束后派发事件的 then */
function answerCallLikeUi(e, eventId){
  const evt = STORY.events[eventId];
  e.answerCall(eventId);
  if(evt && Array.isArray(evt.script)){
    let step = 0;
    let guard = 0;
    while(step < evt.script.length && guard++ < 60){
      const line = evt.script[step];
      if(line && line.who === 'choice' && Array.isArray(line.options)){
        const opt = line.options[e.pickAutoChoice(line.options)] || line.options[0];
        if(opt) e.applyEffects(e.normalizeOptionEffects(opt));
        step = (opt && typeof opt.then === 'number' && opt.then > 0) ? opt.then : step + 1;
      } else {
        step++;
      }
    }
  }
  if(evt && evt.then) e.scheduleEvent(evt.then);
}

/* 全屏强制交互：真实玩家必须处理后才能继续，一律立即处理 */
function resolveBlocking(e, route){
  for(let guard = 0; guard < 30; guard++){
    const list = e.state.pendingInteractions || [];
    if(!list.length) break;
    const it = list[0];
    if(it.type === 'route_choice'){
      if(!e.chooseRoute(route)) break;
      continue;
    }
    if(it.type === 'call'){ answerCallLikeUi(e, it.eventId); continue; }
    if(it.type === 'narrator_choice'){
      const options = (it.choice && it.choice.options) || [];
      const opt = options[e.pickAutoChoice(options)];
      if(!opt) break;
      e.sendMessage('narrator', opt.text, e.normalizeOptionEffects(opt));
      continue;
    }
    if(it.type === 'encounter'){
      const enc = e.getPendingEncounter();
      if(!enc){ e.cancelPendingInteraction('encounter'); continue; }
      e.resolveEncounter(enc, 0);
      continue;
    }
    break;
  }
  if(e.state.activeDream) e.resolveDream(e.state.activeDream, 0);
  if(e.state.activeNightmare) e.resolveNightmare(e.state.activeNightmare, 0);
}

/* 聊天选择：按玩家模型延迟作答 */
function answerChatChoices(e, since, delayHours){
  const nowMin = e.state.day * 1440 + e.state.minute;
  const targets = [
    ...Object.entries(e.state.conversations || {}),
    ...Object.entries(e.state.groups || {}).map(([id, g]) => ['group:' + id, g])
  ];
  for(const [id, c] of targets){
    const ch = c && c.pendingChoice;
    if(!ch){ since.delete(id); continue; }
    // 首次看到这个选择时记录游戏时间，作为「挂起起点」
    if(!since.has(id)) since.set(id, nowMin);
    if(nowMin - since.get(id) < delayHours * 60) continue;
    const options = ch.options || [];
    const opt = options[e.pickAutoChoice(options)];
    since.delete(id);
    if(!opt) continue;
    if(id.startsWith('group:')){
      e.sendGroupMessage(id.slice(6), opt.text, e.normalizeOptionEffects(opt));
      c.pendingChoice = null;
    } else {
      c.pendingChoice = null;
      e.sendMessage(id, opt.text, e.normalizeOptionEffects(opt));
    }
  }
}

/* 「有没有新动静」的指纹：事件触发数、会话消息总数、在途消息数、挂起交互数 */
function activitySignature(e){
  let msgs = 0;
  for(const c of Object.values(e.state.conversations || {})) msgs += (c && c.messages && c.messages.length) || 0;
  for(const g of Object.values(e.state.groups || {})) msgs += (g && g.messages && g.messages.length) || 0;
  return [Object.keys(e.state.firedEvents || {}).length, msgs,
    (e.state.pendingMessages || []).length, (e.state.pendingInteractions || []).length].join('/');
}

function run(route, delayHours){
  const e = new window.PhoneEngine(STORY);
  e.newGame();
  clock.flush();

  const overrides = [];
  const stats = {requeues: 0};
  instrument(e, overrides, stats);

  const since = new Map();
  let endingId = null;
  let endedAt = null;
  e.on('ending', (info) => { endingId = info && info.id; endedAt = {day: e.state.day, hour: e.getTime().hour}; });

  let lastSig = '';
  let idle = 0;
  let steps = 0;
  let travels = 0;
  while(!e.state.ended && e.state.day <= MAX_DAY && steps++ < MAX_STEPS){
    clock.advance(1000);                  // 真实时间前进 1 秒
    resolveBlocking(e, route);
    answerChatChoices(e, since, delayHours);
    clock.flush();

    const sig = activitySignature(e);
    if(sig !== lastSig){ lastSig = sig; idle = 0; continue; }
    if(++idle < IDLE_SECONDS) continue;
    idle = 0;
    e.advanceTime(30);                    // 玩家闲着没事 → 出行，游戏时间前进 30 分钟
    clock.flush();
    travels++;
  }
  clock.flush();
  return {
    route,
    delayHours,
    overrides,
    requeues: stats.requeues,      // 邀约给普通选择让位的次数（设计行为，不是缺陷）
    fired: new Set(Object.keys(e.state.firedEvents || {})),
    ended: !!e.state.ended,
    endingId,
    endedAt,
    reachedDay: e.state.day,
    travels,
    stoppedBy: e.state.ended ? '结局' : (e.state.day > MAX_DAY ? '超过 day' + MAX_DAY : '步数耗尽')
  };
}

const routes = String(arg('routes', ALL_ROUTES.join(','))).split(',').filter(r => ALL_ROUTES.includes(r));
const delays = String(arg('delays', '0,2,6,12')).split(',').map(Number).filter(n => Number.isFinite(n));
/* --max-day=N：放宽「超过第几天还没结局算卡住」的上限。给剧情加保底长度后故事本来就会变长，
 * 做这类实验时需要相应放宽，否则长故事会被误判成卡住。默认 21。 */
const maxDayArg = arg('max-day', '');
if(maxDayArg !== ''){
  const n = Number(maxDayArg);
  if(!Number.isFinite(n) || n < 1 || n > 60){ console.error('--max-day 需要是 1 到 60 之间的整数'); process.exit(2); }
  MAX_DAY = n;
}
/* --finale-gate=N：给路线结局链设「最早游戏日」，用来实测不同保底长度下的内容触达率。
 * 不传则保持剧情默认值（story/04_route_ending.js 里是 null，即不设门槛）。 */
const gateArg = arg('finale-gate', '');
if(gateArg !== ''){
  const gate = Number(gateArg);
  if(!Number.isFinite(gate) || gate < 1 || gate > MAX_DAY){ console.error('--finale-gate 需要是 1 到 ' + MAX_DAY + ' 之间的整数'); process.exit(2); }
  STORY.finaleGate = gate;
}
const results = [];
for(const r of routes) for(const d of delays) results.push(run(r, d));

/* --json：输出结构化结果（每次运行触发了哪些事件），供内容可达性分析等后续脚本使用 */
if(process.argv.includes('--json')){
  const summary = {
    ok: results.every(r => r.ended && r.overrides.length === 0),
    runs: results.map(r => ({route:r.route, delayHours:r.delayHours, ended:r.ended, endingId:r.endingId,
      endedAt:r.endedAt, reachedDay:r.reachedDay, fired:[...r.fired], overrides:r.overrides, requeues:r.requeues}))
  };
  console.log(JSON.stringify(summary));
  process.exit(summary.ok ? 0 : 1);
}

console.log('选择覆盖探测（delayHours = 选择挂起多少个游戏小时后才回复）');
console.log('路线       delay  静默丢失  邀约让位  是否通关  结局            结局日    已触发事件  停止原因');
for(const r of results){
  console.log(
    r.route.padEnd(10) +
    String(r.delayHours).padEnd(6) +
    String(r.overrides.length).padEnd(9) +
    String(r.requeues).padEnd(9) +
    (r.ended ? '是' : '否').padEnd(9) +
    String(r.endingId || '-').padEnd(16) +
    String(r.endedAt ? `day${r.endedAt.day}` : '-').padEnd(10) +
    String(r.fired.size).padEnd(12) +
    r.stoppedBy
  );
}

let total = 0;
for(const r of results){
  if(!r.overrides.length) continue;
  total += r.overrides.length;
  console.log(`\n--- ${r.route} / delay=${r.delayHours}：发生 ${r.overrides.length} 次静默丢失 ---`);
  for(const o of r.overrides){
    console.log(`  day${o.day} ${String(o.hour).padStart(2, '0')} 时  会话=${o.conv}`);
    console.log(`     丢失的选择: 「${o.lost}」  其后续事件=[${o.lostThen.join(', ')}]`);
    console.log(`     新到达: 「${o.arrived}」`);
  }
}

/* 对比：延迟作答导致「勤奋玩家能看到、分心玩家看不到」的事件。
 * 邀约的赴约/拒绝/错过三条分支本身就看回复快慢（邀约有 120 秒真实时限），
 * 属于设计内的节奏差异，不算丢失，这里排除掉以免误导。
 * 本节只作参考信息，不影响退出码（分支不同、好感不同都会造成正常差异）。
 */
console.log('\n=== 延迟作答后没再触发的事件（仅供参考，不计入门禁；已排除邀约结果分支）===');
let lostTotal = 0;
for(const r of routes){
  const base = results.find(x => x.route === r && x.delayHours === delays[0]);
  if(!base) continue;
  for(const x of results.filter(y => y.route === r && y !== base)){
    const lost = [...base.fired].filter(id => !x.fired.has(id) && !/^inv_.*_(accept|decline|miss)$/.test(id));
    if(!lost.length) continue;
    lostTotal += lost.length;
    console.log(`  ${r} / delay=${x.delayHours}: ${lost.length} 条 → ${lost.join(', ')}`);
  }
}
if(!lostTotal) console.log('  （无）');

/* 没走到结局的运行：等于玩家永远等不到结局，属于必须拦截的严重问题 */
const stuck = results.filter(r => !r.ended);
if(stuck.length){
  console.log('\n✗ 以下运行没有走到结局（玩家会一直卡住）：');
  for(const r of stuck) console.log(`  ${r.route} / delay=${r.delayHours}：停在 day${r.reachedDay}（${r.stoppedBy}）`);
}

const ok = total === 0 && stuck.length === 0;
console.log(`\n覆盖总计: ${total} 次；卡住的运行: ${stuck.length} 个；${ok ? '✓ 全部通过' : '✗ 未通过'}`);
process.exitCode = ok ? 0 : 1;
