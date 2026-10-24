/* ===== 前端语法与引用完整性校验 =====
 * 1) ui/*.js 合并编译：拆分后各文件共享全局词法作用域，合并编译可拦截语法错误与跨文件重复声明
 * 2) audio.js / pwa.js / sw.js 单独编译
 * 3) index.html 引用的本地资源必须真实存在
 * 4) sw.js PRECACHE 清单必须真实存在，且覆盖 index.html 的全部本地脚本（漏缓存 = 离线打不开）
 * 运行：node check_ui.js（已接入 npm run test:all 与 CI）
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const failures = [];
const notes = [];
const ok = msg => notes.push('✓ ' + msg);

function compile(label, code){
  try { new vm.Script(code, { filename: label }); ok(`${label} 编译通过`); }
  catch(e){ failures.push(`✗ ${label} 编译失败: ${e.message}`); }
}

// 1) ui/ 合并编译 + 单文件编译
const uiFiles = fs.readdirSync(path.join(root, 'ui')).filter(f => f.endsWith('.js')).sort();
compile('ui/*.js 合并', uiFiles.map(f => fs.readFileSync(path.join(root, 'ui', f), 'utf8')).join('\n'));
compile('audio.js', fs.readFileSync(path.join(root, 'audio.js'), 'utf8'));
compile('pwa.js', fs.readFileSync(path.join(root, 'pwa.js'), 'utf8'));
compile('types.js', fs.readFileSync(path.join(root, 'types.js'), 'utf8'));
compile('sw.js', fs.readFileSync(path.join(root, 'sw.js'), 'utf8'));

// 2) index.html 引用的本地资源存在性
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g)].map(m => m[1]);
const missing = refs.filter(f => !/^https?:/.test(f) && !fs.existsSync(path.join(root, f)));
if(missing.length) failures.push('✗ index.html 引用了不存在的文件: ' + missing.join(', '));
else ok(`index.html 引用 ${refs.length} 个本地资源全部存在`);

// 3) sw.js PRECACHE 清单存在性 + 覆盖 index.html 的本地脚本
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const precache = [...sw.matchAll(/\'\.\/([^']+)\'/g)].map(m => m[1]);
const precacheMissing = precache.filter(f => f && !fs.existsSync(path.join(root, f)));
if(precacheMissing.length) failures.push('✗ sw.js PRECACHE 引用了不存在的文件: ' + precacheMissing.join(', '));
else ok(`sw.js PRECACHE ${precache.length} 项全部存在`);

const htmlScripts = refs.filter(f => f.endsWith('.js'));
const notCached = htmlScripts.filter(f => !precache.includes(f));
if(notCached.length) failures.push('✗ index.html 的脚本未加入 sw.js 离线缓存: ' + notCached.join(', '));
else ok(`index.html 全部 ${htmlScripts.length} 个脚本已纳入离线缓存`);


// ---------- 5) 资源体积预算（v0.4.6 P1.2：CI 门禁，防资产与脚本无限膨胀） ----------
// 基线 v0.4.5 实测：assets 图片共约 2.5MB；阈值 = 基线 ×1.3 留余量
const BUDGET = { singleImage: 420*1024, singleJs: 160*1024, assetsTotal: 3.3*1024*1024 };
const imgExts = /\.(png|jpg|jpeg)$/i;
let assetsTotal = 0;
const walkBudget = dir => {
  for(const name of fs.readdirSync(dir)){
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if(st.isDirectory()) walkBudget(p);
    else if(imgExts.test(name)) assetsTotal += st.size;
  }
};
walkBudget(path.join(root, 'assets'));
const imgFiles = [];
const walkImgs = dir => {
  for(const name of fs.readdirSync(dir)){
    const p = path.join(dir, name);
    if(fs.statSync(p).isDirectory()) walkImgs(p);
    else if(imgExts.test(name)) imgFiles.push(p);
  }
};
walkImgs(path.join(root, 'assets'));
for(const p of imgFiles){
  const sz = fs.statSync(p).size;
  if(sz > BUDGET.singleImage) failures.push('✗ 图片超预算: ' + path.relative(root, p) + ' = ' + (sz/1024).toFixed(0) + 'KB > ' + (BUDGET.singleImage/1024).toFixed(0) + 'KB');
}
for(const f of fs.readdirSync(root)){
  if(!f.endsWith('.js') && !f.endsWith('.css')) continue;
  const sz = fs.statSync(path.join(root, f)).size;
  if(sz > BUDGET.singleJs) failures.push('✗ 脚本超预算: ' + f + ' = ' + (sz/1024).toFixed(0) + 'KB > ' + (BUDGET.singleJs/1024).toFixed(0) + 'KB');
}
if(assetsTotal > BUDGET.assetsTotal) failures.push('✗ 图片资产总量超预算: ' + (assetsTotal/1024/1024).toFixed(2) + 'MB > 3.3MB');
else notes.push('✓ 资源预算通过（图片共 ' + (assetsTotal/1024/1024).toFixed(2) + 'MB / 3.3MB，单图≤420KB，单脚本≤160KB）');

for(const line of notes) console.log(line);
if(failures.length){
  console.error('\n' + failures.join('\n'));
  console.error('\n前端语法/引用校验失败。');
  process.exit(1);
}
console.log('\n前端语法与引用完整性校验通过。');
