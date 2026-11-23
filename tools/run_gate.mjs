/* ===== 总闸：把检查串成一条命令（v0.9.11 配套）=====
 * 背景：tools 下 27 个脚本只有 6 个被 npm 命令引用，云端流水线又已删除，
 *       很多有价值的检查（结局可达性、翻译缺口、安全、离线可用性）全靠人记得手动跑。
 *
 * 三档：
 *   hook  推送前钩子用。不依赖浏览器：verify:offline + lint          （约 1 分钟）
 *   gate  默认档。hook + 四项浏览器检查                              （约 1.5 分钟）
 *   full  完整档。gate + 账号端到端 + 三浏览器端到端                  （约 4 分钟）
 *
 * 用法：
 *   npm run gate            默认档
 *   npm run gate:full       完整档
 *   node tools/run_gate.mjs --hook --if-stamped   推送前钩子内部调用
 *
 * 通过标记：同一提交通过某一档后，结果记在 .gate-stamp（不入库）。
 *   之后对同一提交再跑同等或更低档位的检查会直接跳过——往多个远端连续推送时不会重复跑。
 *   工作区有未提交改动时不记标记（因为检查的其实是工作区，不是那个提交本身）。
 *
 * 退出码：0 全部通过；1 有检查未通过；2 无法确定要检查的提交。
 */
import { spawn, spawnSync } from 'node:child_process';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STAMP = path.join(ROOT, '.gate-stamp');
const PORT = 4187;
const argv = process.argv.slice(2);
const MODE = argv.includes('--full') ? 'full' : argv.includes('--hook') ? 'hook' : 'gate';
const IF_STAMPED = argv.includes('--if-stamped');
const RANK = { hook: 0, gate: 1, full: 2 };
const LABEL = { hook: '离线档', gate: '默认档', full: '完整档' };

function git(...args){
  return spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' }).stdout.trim();
}
function readStamp(){
  try { return JSON.parse(fs.readFileSync(STAMP, 'utf8')); } catch(_) { return null; }
}
function hasEslint(){
  return fs.existsSync(path.join(ROOT, 'node_modules', '.bin', 'eslint'));
}

const head = git('rev-parse', 'HEAD');
if(!head){
  console.error('✗ 不在 git 仓库里，无法确定要检查的提交');
  process.exit(2);
}
// 只看已跟踪文件有没有改动；未跟踪的新文件不参与判断（它们同样会被检查到，只是不据此拒绝记标记）
const dirty = git('status', '--porcelain', '--untracked-files=no') !== '';

if(IF_STAMPED){
  const stamp = readStamp();
  if(stamp && stamp.head === head && RANK[stamp.mode] >= RANK[MODE]){
    console.log(`[总闸] 提交 ${head.slice(0, 7)} 已通过「${LABEL[stamp.mode]}」检查（${stamp.at}），本次跳过`);
    process.exit(0);
  }
}

// 每一步：npm 命令名或直接跑 node 脚本。顺序即执行顺序，前面的快、定位准。
const steps = [];
const npm = (label, script) => steps.push({ label, cmd: 'npm', args: ['run', '--silent', script] });
const node = (label, file) => steps.push({ label, cmd: process.execPath, args: [file] });

npm('离线检查集（版本号 / 剧情数据 / 界面静态 / 回归 / 剧情链路 / 路线时序 / 路线矩阵 / 覆盖探测 / 账号接口）', 'verify:offline');
if(hasEslint()) npm('代码规范（eslint）', 'lint');
else console.log('[总闸] 未安装测试依赖（没有 node_modules），跳过代码规范检查');

if(MODE !== 'hook'){
  npm('结局可达性（17 个结局）', 'check:endings');
  npm('翻译缺口', 'check:i18n');
  npm('安全检查（存档注入 / 跨站脚本 / 恶意图片）', 'check:security');
  npm('离线可用性（PWA）', 'check:pwa');
}
if(MODE === 'full'){
  npm('账号与云存档端到端', 'test:account');
  npm('三浏览器端到端', 'test:browser');
}

/* 四项浏览器检查与端到端用例都需要本地服务器在 4187 端口；没开的话由这里代开，结束时关掉 */
function portOpen(){
  return new Promise(resolve => {
    const socket = net.connect(PORT, '127.0.0.1');
    const done = ok => { socket.destroy(); resolve(ok); };
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    socket.setTimeout(800, () => done(false));
  });
}
let server = null;
if(MODE !== 'hook' && !(await portOpen())){
  server = spawn(process.execPath, ['test_server.js'], { cwd: ROOT, stdio: 'ignore' });
  for(let i = 0; i < 40 && !(await portOpen()); i++) await new Promise(r => setTimeout(r, 400));
}

console.log(`[总闸] 提交 ${head.slice(0, 7)}，执行「${LABEL[MODE]}」共 ${steps.length} 步${dirty ? '（工作区有未提交改动，检查的是工作区当前内容）' : ''}`);
let failed = null;
for(const step of steps){
  const started = Date.now();
  const bin = step.cmd === 'npm' ? 'npm' : process.execPath;
  const result = spawnSync(bin, step.args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  if(result.status === 0){
    console.log(`  ✓ ${step.label}（${seconds} 秒）`);
    continue;
  }
  console.log(`  ✗ ${step.label}（${seconds} 秒，退出码 ${result.status}）`);
  failed = step;
  const output = String(result.stdout || '') + '\n' + String(result.stderr || '');
  const lines = output.split('\n').filter(line => !/ExperimentalWarning|trace-warnings/.test(line));
  console.log('  ---- 失败输出（最后 30 行）----');
  console.log(lines.slice(-30).map(line => '  | ' + line.slice(0, 200)).join('\n'));
  break;
}

if(server) server.kill();

if(failed){
  console.log(`\n[总闸] ✗ 未通过：${failed.label}`);
  process.exit(1);
}

if(dirty){
  console.log('\n[总闸] ✓ 全部通过。工作区有未提交改动，所以不记通过标记（提交之后才会记）。');
} else {
  fs.writeFileSync(STAMP, JSON.stringify({ head, mode: MODE, at: new Date().toISOString() }));
  console.log(`\n[总闸] ✓ 全部通过（${LABEL[MODE]}），已为提交 ${head.slice(0, 7)} 记录通过标记`);
}
