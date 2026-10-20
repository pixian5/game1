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

for(const line of notes) console.log(line);
if(failures.length){
  console.error('\n' + failures.join('\n'));
  console.error('\n前端语法/引用校验失败。');
  process.exit(1);
}
console.log('\n前端语法与引用完整性校验通过。');
