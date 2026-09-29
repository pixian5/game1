/* ===== 版本号一致性校验 =====
 * 版本唯一来源：根目录 VERSION 文件
 * 校验对象：package.json、package-lock.json、index.html（标题/meta/静态资源缓存参数）
 * 任何一处不一致都会失败退出，用于 CI 与本地提交前检查。
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const failures = [];
const notes = [];

function readText(file){
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function report(file, found, expected){
  if(found === expected) notes.push(`✓ ${file}: ${found}`);
  else failures.push(`✗ ${file}: 期望 ${expected}，实际 ${found}`);
}

const canonical = readText('VERSION').trim();
if(!/^\d+\.\d+\.\d+$/.test(canonical)){
  console.error(`✗ VERSION 内容不是合法版本号：${JSON.stringify(canonical)}`);
  process.exit(1);
}

// 1) package.json
const pkg = JSON.parse(readText('package.json'));
report('package.json', pkg.version, canonical);

// 2) package-lock.json（根版本 + packages[""] 版本都要一致）
const lock = JSON.parse(readText('package-lock.json'));
report('package-lock.json', lock.version, canonical);
if(lock.packages && lock.packages['']) report('package-lock.json packages[""]', lock.packages[''].version, canonical);

// 3) index.html：<title>、<meta name="version">、所有 ?v= 缓存参数
const html = readText('index.html');
const titleMatch = html.match(/<title>[^<]*·\s*v([\d.]+)\s*<\/title>/);
report('index.html <title>', titleMatch ? titleMatch[1] : '(未找到)', canonical);

const metaMatch = html.match(/<meta name="version" content="v([\d.]+)">/);
report('index.html <meta version>', metaMatch ? metaMatch[1] : '(未找到)', canonical);

const versioned = [...html.matchAll(/\?v=([\d.]+)/g)].map(m=>m[1]);
if(!versioned.length) failures.push('✗ index.html: 未找到任何 ?v= 静态资源缓存参数');
else {
  const bad = versioned.filter(v=>v !== canonical);
  if(bad.length) failures.push(`✗ index.html 静态资源参数: ${bad.length} 处不一致（如 ?v=${bad[0]}）`);
  else notes.push(`✓ index.html 静态资源参数: ${versioned.length} 处全部为 ${canonical}`);
}

for(const line of notes) console.log(line);
if(failures.length){
  for(const line of failures) console.error(line);
  console.error(`\n版本号校验失败：请以 VERSION=${canonical} 为准同步各处（参考 README「版本管理」）。`);
  process.exit(1);
}
console.log(`\n版本号一致性校验通过：${canonical}`);