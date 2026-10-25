#!/usr/bin/env node
/* ===== 霓虹心事 · 发布构建：52 脚本合并 + dist 产物 =====
 * 背景（v0.4.7 性能实测）：本地 load 186ms，但线上 52 个脚本串行跨网络往返 → load 18s。
 * 方案：部署时按 index.html 的脚本顺序合并为单个 bundle.js（等价性由 check:ui 合并编译长期保证），
 *       开发仍直接双击 index.html（零构建不变）；deploy.sh 改从 dist/ 部署。
 * 产物：dist/index.html（单 bundle 引用）、dist/bundle.js、dist/sw.js（预缓存清单换 bundle）、其余资产原样。
 * 用法：node tools/build_bundle.mjs   （CI 与 deploy.sh 调用）
 */
'use strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);

const ROOT = path.dirname(path.dirname(__filename));
const OUT = path.join(ROOT, 'dist');
const VERSION = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// 1) 解析 index.html：收集本地 <script src>，生成 bundle
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const scriptRe = /<script src="([^"]+?)\?v=[\d.]+"><\/script>/g;
const srcs = [];
let m;
while ((m = scriptRe.exec(html))) {
  if (m[1].startsWith('http')) continue;      // 外部脚本不动
  srcs.push(m[1]);
}
if (srcs.length < 10) throw new Error('script 清单异常：仅解析到 ' + srcs.length + ' 个');

const parts = [`/* neon-heart bundle v${VERSION} — 由 ${srcs.length} 个源文件按加载顺序合并（tools/build_bundle.mjs） */`];
for (const src of srcs) {
  let code = fs.readFileSync(path.join(ROOT, src), 'utf8');
  // v0.5.6（F2.1）：源文件已 ES Modules 化，bundle 为传统脚本——剥离 import/export 语句
  if (src.startsWith('story/')) {
    code = code
      .replace(/^import\s+\{[^}]*\}\s+from\s+'[^']*';\s*$/gm, '')
      .replace(/^export const STORY/m, 'const STORY');
  }
  parts.push(`/* ===== ${src} ===== */\n` + code.replace(/^\s*\/\* =+ .+? =+ \*\/\s*$/, '').trimStart());
}
const bundle = parts.join('\n\n') + '\n';
fs.writeFileSync(path.join(OUT, 'bundle.js'), bundle);

// 2) index.html：52 个标签 → 单 bundle 标签
const firstTag = `<script src="${srcs[0]}?v=${VERSION}"></script>`;
const lastTag = `<script src="${srcs[srcs.length - 1]}?v=${VERSION}"></script>`;
const i1 = html.indexOf(firstTag);
const i2 = html.indexOf(lastTag) + lastTag.length;
if (i1 < 0 || i2 <= i1) throw new Error('script 标签定位失败');
const distHtml = html.slice(0, i1)
  + `<script src="bundle.js?v=${VERSION}"></script>`
  + html.slice(i2);
fs.writeFileSync(path.join(OUT, 'index.html'), distHtml);

// 3) sw.js：预缓存 JS 清单换为 bundle + i18n（语言包单独保留，便于独立翻译）
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
// v0.4.3 起预缓存清单含按需缓存调整，行集与 index.html 不再一一对应——
// 稳妥做法：删除全部 .js 预缓存行，插入单 bundle 行（语言包也已并入 bundle）
const swLines = sw.split('\n').filter(l => !/^\s*'\.\/[^']+\.js',\s*$/.test(l));
const anchorLine = swLines.findIndex(l => l.includes("style.css"));
if (anchorLine < 0) throw new Error('sw.js 中未找到 style.css 锚点');
swLines.splice(anchorLine, 0, "  './bundle.js',");
const swDist = swLines.join('\n').replace(/neon-heart-v[\d.]+/, `neon-heart-v${VERSION}`);
if (!swDist.includes("./bundle.js") || swDist === sw) throw new Error('sw.js 预缓存清单替换失败');
fs.writeFileSync(path.join(OUT, 'sw.js'), swDist);

// 4) 其余静态资产原样复制
function cp(src, dest) {
  const s = path.join(ROOT, src);
  const d = path.join(OUT, dest || src);
  fs.mkdirSync(path.dirname(d), { recursive: true });
  if (fs.statSync(s).isDirectory()) {
    for (const n of fs.readdirSync(s)) cp(path.join(src, n), path.join(dest || src, n));
  } else fs.copyFileSync(s, d);
}
for (const f of ['style.css', 'manifest.json', 'privacy.html', 'robots.txt', 'sitemap.xml']) {
  if (fs.existsSync(path.join(ROOT, f))) cp(f);
}
for (const d of ['i18n', 'assets']) cp(d);

// 5) 产物报告
const size = p => (fs.statSync(path.join(OUT, p)).size / 1024).toFixed(0);
console.log(`✓ dist/bundle.js ${size('bundle.js')}KB（${srcs.length} 源文件合并）`);
console.log(`✓ dist/index.html（单脚本引用）`);
console.log(`✓ dist/sw.js（预缓存已对齐）`);
const total = (function walk(d){ let t=0; for(const n of fs.readdirSync(d)){ const p=path.join(d,n); if(fs.statSync(p).isDirectory()) t+=walk(p); else t+=fs.statSync(p).size; } return t; })(OUT);
console.log(`✓ dist 总体积 ${(total/1024/1024).toFixed(2)}MB`);
