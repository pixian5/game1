/* ===== 启用推送前检查钩子 =====
 * 把钩子目录告诉 git，让 .githooks/pre-push 在每次 git push 之前自动执行。
 * 由 package.json 的 prepare 脚本在 npm install 时自动调用，所以新克隆只要装过依赖就已启用。
 * 手动启用：node tools/enable_hooks.mjs
 * 临时跳过某次检查：SKIP_GATE=1 git push ...
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (...args) => spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });

if(run('rev-parse', '--git-dir').status !== 0){
  console.log('[钩子] 当前目录不是 git 仓库，未设置推送前检查钩子');
  process.exit(0);
}
const result = run('config', 'core.hooksPath', '.githooks');
if(result.status !== 0){
  console.log('[钩子] 设置失败，推送前检查钩子未启用：' + String(result.stderr || '').trim());
  process.exit(0);
}
console.log('[钩子] 已启用推送前检查：每次 git push 之前自动执行离线档检查（跳过某次：SKIP_GATE=1）');
