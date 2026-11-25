/* ===== 选项文字翻译覆盖检查（v0.9.12）=====
 * 背景：英文模式下选项按钮全是中文，而原有的「翻译缺口」检查报的是 0 条缺口——
 *   它只查字典里有没有某个键，不查「界面上会拿去渲染的每一条文字有没有英文」。
 *
 * 本工具直接扫剧情数据，把会渲染成选项的文字全部收集起来，逐条对照英文字典：
 *   - 选项对象（options / commentOptions 数组里带 text 的对象）：text、hint、inner、shard、label
 *   - 选择对象（带 prompt 与 options）：prompt
 *   - 问卷题目（带 question 与 options）：question
 * 只要含中文却没有英文，就列出来；有任何缺口则退出码为 1。
 *
 * 用法：node tools/i18n-choice-coverage.mjs [--list]
 *   --list  额外列出全部已覆盖的条目（核对译文用）
 * 不依赖浏览器、不依赖数据库。
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// 翻译包清单以首页为准：按 index.html 里的引用顺序加载，避免工具里再写死一份清单。
// 第 9 号译包就曾经「文件在目录里、首页没引用」，线上白白躺了好几天没人发现，所以这里一并核对。
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const referenced = ['en-US.js', ...[...html.matchAll(/<script src="i18n\/(story-en-translations(?:-\d+)?)\.js(?:\?[^"]*)?"><\/script>/g)].map(m => m[1] + '.js')];
const onDisk = fs.readdirSync(path.join(ROOT, 'i18n')).filter(f => f === 'en-US.js' || /^story-en-translations(-\d+)?\.js$/.test(f));
const orphans = onDisk.filter(f => !referenced.includes(f));
const missingFiles = referenced.filter(f => !onDisk.includes(f));

// 翻译包是普通的立即执行脚本，往 window.I18N_PACKS 上挂字典；这里给它们一个最小的 window
globalThis.window = globalThis;
for(const file of referenced){
  try { require(path.join(ROOT, 'i18n', file)); }
  catch(_){ /* 首页引用了但文件不存在，下面统一报错 */ }
}
if(orphans.length || missingFiles.length){
  if(missingFiles.length) console.log('✗ 首页引用了不存在的译包：' + missingFiles.join(', '));
  if(orphans.length) console.log('✗ i18n 目录里有译包但首页没有引用（不会生效，也不会进离线缓存）：' + orphans.join(', ')
    + '\n  处理：在 index.html 里补上 <script> 标签（放在上一包之后），并在 sw.js 的预缓存清单里加一行。');
  process.exit(1);
}
const PACK = (globalThis.window.I18N_PACKS && globalThis.window.I18N_PACKS['en-US']) || {};

const { STORY } = await import(path.join(ROOT, 'story/index.mjs'));

const hasCJK = s => /[\u4e00-\u9fff]/.test(s);
// 界面上直接写死、不经数据传入的几条文字，也一并核对
const UI_LITERALS = ['你的选择：', '未作答'];

const rows = [];        // { where, field, text, en }
function walk(node, where, depth){
  if(!node || typeof node !== 'object' || depth > 12) return;
  if(Array.isArray(node)){
    node.forEach((item, i) => walk(item, `${where}[${i}]`, depth + 1));
    return;
  }
  const options = node.options || node.commentOptions;
  if(typeof node.prompt === 'string' && Array.isArray(options)){
    rows.push({ where: `${where}.prompt`, field: 'prompt', text: node.prompt });
  }
  if(typeof node.question === 'string' && Array.isArray(options)){
    rows.push({ where: `${where}.question`, field: 'question', text: node.question });
  }
  for(const field of ['text', 'hint', 'inner', 'shard', 'label']){
    if(typeof node[field] === 'string' && ('text' in node) && /options\[\d+\]$/.test(where)){
      rows.push({ where: `${where}.${field}`, field, text: node[field] });
    }
  }
  for(const [key, value] of Object.entries(node)) walk(value, where ? `${where}.${key}` : key, depth + 1);
}
for(const [key, value] of Object.entries(STORY)) walk(value, key, 0);
for(const text of UI_LITERALS) rows.push({ where: '界面固定文字', field: '文字', text });

const seen = new Set();
const unique = rows.filter(r => { const k = r.field + '|' + r.text; if(seen.has(k)) return false; seen.add(k); return true; });
for(const r of unique) r.en = PACK[r.text];
const cjk = unique.filter(r => hasCJK(r.text));
const missing = cjk.filter(r => !r.en);
const byField = {};
for(const r of cjk){ const s = (byField[r.field] ||= { total: 0, ok: 0 }); s.total++; if(r.en) s.ok++; }

console.log('选项类文字的英文覆盖（只统计含中文的；重复文字只算一条）');
for(const [field, s] of Object.entries(byField).sort((a, b) => b[1].total - a[1].total)){
  console.log(`  ${{ text: '选项文字', hint: '选项附带说明', prompt: '选择提示语', inner: '内心话', shard: '碎片说明', label: '标签', question: '问卷题目', '文字': '界面固定文字' }[field] || field}   ${s.ok} / ${s.total}   ${s.total ? (s.ok / s.total * 100).toFixed(1) : '100'}%`);
}
const total = cjk.length, ok = total - missing.length;
console.log(`  合计   ${ok} / ${total}   ${total ? (ok / total * 100).toFixed(1) : '100'}%`);

if(process.argv.includes('--list')){
  console.log('\n已覆盖条目：');
  for(const r of cjk.filter(r => r.en)) console.log(`  ${r.text}  →  ${r.en}`);
}

if(missing.length){
  console.log(`\n✗ 缺少英文的选项类文字 ${missing.length} 条：`);
  for(const r of missing) console.log(`  [${r.field}] ${r.text}    （${r.where}）`);
  console.log('处理：把英文补进 i18n/en-US.js（界面文案）或 i18n/story-en-translations-*.js（剧情文案）。');
  process.exit(1);
}
console.log('\n✓ 选项类文字全部有英文');
