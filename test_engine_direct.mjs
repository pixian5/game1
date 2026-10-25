/* ===== 引擎直测入口（v0.5.6 F2.1）=====
 * 以原生 require 加载引擎三件（不经 vm 沙箱）→ c8 可统计行覆盖；
 * 断言复用 test_regressions 的核心子集（存档/交互队列/结局）。
 * 运行：npm run test:cov（c8 --include engine*.js）
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// engine 依赖 window.PhoneEngine 挂载链：先给全局 window
globalThis.window = globalThis;
require('./interaction_queue.js');
require('./save_migrations.js');
require('./engine.js');
for (const f of ['engine_social.js','engine_content.js','engine_progress.js','engine_save.js']) require('./' + f);

const { STORY } = await import('./story/index.mjs');
const assert = (await import('node:assert')).strict;

const e = new window.PhoneEngine(STORY);
e.newGame();
assert.equal(e.state.day, 1);
// 存档链
assert.equal(e.save('slot1'), true);
assert.equal(e.hasSave('slot1'), true);
assert.equal(e.load('slot1'), true);
// 事件调度 + ngPlus
e.state.collected.push('postcard_neon');
e.triggerEnding('solo_good');
e.newGame({ ngPlus: true });
assert.equal(e.state.ngPlus, 1);
assert.ok(e.state.collected.includes('postcard_neon'));
// 三轴
const e2 = new window.PhoneEngine(STORY);
e2.newGame();
e2.state.currentLocation = 'bar'; e2.state.day = 3;
e2.tryEncounter('bar');
const enc = e2.getPendingEncounter();
if (enc) e2.resolveEncounter(enc, 0);
console.log('✓ 引擎直测通过（c8 覆盖率采集）');
