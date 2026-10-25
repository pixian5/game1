/* ===== 测试共享工具：源码文件清单与沙箱加载 =====
 * story.js / engine.js / app.js 已按模块拆分（v0.1.7），Node 侧测试通过本清单按序加载。
 * 文件清单动态生成：story/ 与 engine_*.js 新增拆分文件后自动纳入，无需改测试。
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const dir = (d, re) => fs.readdirSync(path.join(ROOT, d)).filter(f => re.test(f)).sort().map(f => `${d}/${f}`);

// 浏览器 index.html 的加载顺序与此保持一致（ui/ 仅浏览器加载，Node 测试不需要）
const SOURCE_FILES = [
  ...dir('story', /\.js$/),
  'interaction_queue.js',
  'save_migrations.js',
  'engine.js',
  ...fs.readdirSync(ROOT).filter(f => /^engine_.+\.js$/.test(f)).sort(),
];

function runInSandbox(sandbox, files = SOURCE_FILES) {
  const vm = require('vm');
  vm.createContext(sandbox);
  for (const f of files) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
  }
  return sandbox;
}

// v0.5.6（F2.1）：story 侧提供 ESM 聚合入口（story/index.mjs）——
// 需要完整 STORY 的调用方可渐进迁移到 import；runInSandbox 保持引擎/队列的传统加载。
async function loadStoryESM(){
  const mod = await import(path.join(ROOT, 'story/index.mjs'));
  return mod.STORY;
}

module.exports = { SOURCE_FILES, runInSandbox, loadStoryESM };
