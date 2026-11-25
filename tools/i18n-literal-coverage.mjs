/* ===== 界面代码中文字面量翻译覆盖检查（v0.9.12）=====
 * 背景：英文模式残留扫描（i18n-leak-scan.mjs）要「点得到」才能发现残留，详情页、弹层、
 *   提示浮层很容易漏；而残留的根源只有两类：
 *     1. 字典里根本没有这条文字（例如「关系网」「姓名」「保存」）；
 *     2. 文字是模板拼接出来的（例如 `第${day}天的牌阵 · ${r}`），字典里没有对应模板。
 *
 * 本工具直接扫源码，把「会显示到界面上的中文」全部找出来逐条对照英文字典：
 *   - ui/*.js、engine*.js 等界面层脚本里的字符串与模板拼接
 *       （模板里的 ${表达式} 归一成 {}，去比对「形状」；同一个文字节点被表达式切开也算一条）
 *   - 超文本标记上的 title / alt / placeholder / aria-label 属性值
 *   - index.html 里脚本之外的静态文字与上述属性
 *   - story/ 剧情数据里的全部中文字符串
 * 只要含中文却找不到对应译文（整条相等，或形状相同的模板），就列出来；有缺口则退出码为 1。
 *
 * 不算缺口的情况：
 *   - console.* 里的日志文字（不给玩家看）
 *   - 写在 tools/i18n-literal-allow.txt 里的条目（不是界面文字，例如只在中文模式下才拼接）
 *
 * 用法：node tools/i18n-literal-coverage.mjs [--list] [--source]
 *   --list    列出全部已覆盖条目（核对译文用）
 *   --source  列出每条缺口与疑似条目的全部来源位置
 * 不依赖浏览器、不依赖数据库。
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);

// ===== 英文字典：按首页引用顺序加载译包（与 i18n-choice-coverage.mjs 同一套做法）=====
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const referenced = ['en-US.js', ...[...html.matchAll(/<script src="i18n\/(story-en-translations(?:-\d+)?)\.js(?:\?[^"]*)?"><\/script>/g)].map(m => m[1] + '.js')];
globalThis.window = globalThis;
for(const file of referenced){
  try { require(path.join(ROOT, 'i18n', file)); }
  catch(_){ /* 文件不存在由 i18n-choice-coverage.mjs 负责报错 */ }
}
const PACK = (globalThis.window.I18N_PACKS && globalThis.window.I18N_PACKS['en-US']) || {};
// 空白按「显示效果」比对（与 i18n/index.js 的显示层兜底同一规则）：
// 首尾空白去掉、连续空白（含换行与缩进）算一个空格
const displayKey = s => String(s).trim().replace(/\s+/g, ' ');
const KEY_BY_DISPLAY = new Map();   // 显示效果写法 → 字典里的原始键
for(const key of Object.keys(PACK)){
  const dk = displayKey(key);
  if(!KEY_BY_DISPLAY.has(dk)) KEY_BY_DISPLAY.set(dk, key);
}
const findKey = s => KEY_BY_DISPLAY.get(displayKey(s));
const hasTr = s => findKey(s) !== undefined;

// 模板形状：占位符名字不同、占位符两侧空格不同，都算同一种形状
// （代码里写 `第${day}天`，字典里的键是「第 {day} 天」，界面上显示的都是同一个文字节点）
const shapeOf = s => displayKey(s).replace(/\{[^{}]*\}/g, '{}').replace(/\s*\{\}\s*/g, '{}');
const SHAPES = new Map();       // 形状 → 字典里的原始模板键
for(const key of Object.keys(PACK)){
  if(!key.includes('{')) continue;
  const sh = shapeOf(key);
  if(!SHAPES.has(sh)) SHAPES.set(sh, key);
}

const hasCJK = s => /[\u4e00-\u9fff]/.test(s);

// ===== 取出一段源码里的全部字符串字面量 =====
// 返回 [{ kind:'str'|'tpl', text, parts, line, callee }]
//   kind='str'  ：单双引号字符串，text 为解码后的内容
//   kind='tpl'  ：模板字符串，parts 为 ['文字', null(表达式占位), '文字', ...]
//   callee      ：这条字面量所在的最内层调用的函数名（判断是不是日志用）
function extractLiterals(src){
  const out = [];
  const stack = [];        // 花括号配对栈：{ parts } 表示这层花括号属于某个模板的表达式
  const calls = [];        // 调用栈：每遇一个左圆括号记下被调用的函数名
  let cur = null;          // 正在读取的字符串：{ kind, quote, chunk, parts, line, callee }
  let i = 0, line = 1;
  const flushChunk = () => {
    if(!cur || cur.kind !== 'tpl' || cur.chunk === '') return;
    cur.parts.push(cur.chunk); cur.chunk = '';
  };
  // 反斜杠转义解码（\n \t \\ \' \" \uXXXX）
  const decode = s => s.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S])/g, (_, e) => {
    if(e[0] === 'u' || e[0] === 'x') return String.fromCharCode(parseInt(e.slice(1), 16));
    return ({ n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', '0': '\0' })[e] ?? e;
  });
  // 当前位置前面的被调用函数名：foo( / foo.bar( / window.t(
  const calleeAt = pos => {
    const m = src.slice(Math.max(0, pos - 60), pos).match(/([A-Za-z_$][\w$.]*)\s*$/);
    return m ? m[1] : '';
  };
  // 判断当前位置的斜杠是不是正则表达式的开头（看前一个有效字符或关键字）
  const regexCanStart = pos => {
    const tail = src.slice(0, pos).match(/([\s\S]*\S)\s*$/);
    if(!tail) return true;
    const t = tail[1];
    if(/[([{,;=:!&|?+\-*%<>~^]/.test(t.slice(-1))) return true;
    if(/(?:^|[^\w$.])(return|typeof|case|in|of|instanceof|new|delete|void|do|else|yield|await)$/.test(t)) return true;
    return false;
  };
  while(i < src.length){
    const c = src[i];
    if(c === '\n'){ line++; if(cur && cur.kind === 'tpl') cur.chunk += c; i++; continue; }
    if(!cur){
      // ----- 代码 -----
      if(c === '/' && src[i + 1] === '/'){ while(i < src.length && src[i] !== '\n') i++; continue; }
      if(c === '/' && src[i + 1] === '*'){
        i += 2;
        while(i < src.length && !(src[i] === '*' && src[i + 1] === '/')){ if(src[i] === '\n') line++; i++; }
        i += 2; continue;
      }
      if(c === '"' || c === "'"){ cur = { kind: 'str', quote: c, chunk: '', line, callee: calls[calls.length - 1] || '' }; i++; continue; }
      if(c === '`'){ cur = { kind: 'tpl', parts: [], chunk: '', line, callee: calls[calls.length - 1] || '' }; i++; continue; }
      if(c === '/' && regexCanStart(i)){
        // 跳过正则表达式本体（不把里面的文字当成界面文字）
        i++; let inClass = false;
        for(; i < src.length; i++){
          const r = src[i];
          if(r === '\\'){ i++; continue; }
          if(r === '[') inClass = true; else if(r === ']') inClass = false;
          else if(r === '/' && !inClass){ i++; break; }
          else if(r === '\n') break;   // 判断失误：不是正则，按除号处理
        }
        continue;
      }
      if(c === '(') calls.push(calleeAt(i));
      else if(c === ')') calls.pop();
      else if(c === '{') stack.push({ brace: 1 });            // 普通代码块或对象，仅用于配对
      else if(c === '}'){
        const top = stack[stack.length - 1];
        if(top && top.brace !== undefined){
          top.brace--;
          if(top.brace === 0){
            stack.pop();
            // 这层花括号属于某个模板的表达式 → 表达式结束，回到外层模板
            const outer = stack[stack.length - 1];
            if(outer && outer.parts){
              // 最内层的占位对应该表达式：把 null 换成 { expr: 表达式原文 }（嵌套时只替换最后一个 null）
              const at = outer.parts.lastIndexOf(null);
              if(at >= 0) outer.parts[at] = { expr: src.slice(outer.exprStart, i) };
              cur = { kind: 'tpl', parts: outer.parts, chunk: '', line, callee: outer.callee };
              stack.pop();
            }
          }
        }
      }
      i++; continue;
    }
    if(cur.kind === 'str'){
      if(c === '\\'){ cur.chunk += decode(src.substr(i, 2)); i += 2; continue; }
      if(c === cur.quote){ out.push({ kind: 'str', text: decode(cur.chunk), line: cur.line, callee: cur.callee }); cur = null; i++; continue; }
      cur.chunk += c; i++; continue;
    }
    // ----- 模板字符串 -----
    if(c === '\\'){ cur.chunk += decode(src.substr(i, 2)); i += 2; continue; }
    if(c === '`'){
      flushChunk();
      out.push({ kind: 'tpl', parts: cur.parts, line: cur.line, callee: cur.callee });
      cur = null; i++; continue;
    }
    if(c === '$' && src[i + 1] === '{'){
      flushChunk();
      const exprStart = i + 2;                    // 记下表达式起点，闭合时把表达式原文记下来
      cur.parts.push(null);
      stack.push({ parts: cur.parts, callee: cur.callee, exprStart }, { brace: 1 });
      cur = null; i += 2; continue;
    }
    cur.chunk += c; i++;
  }
  return out;
}

// ===== 把一段带超文本标记的内容拆成「同一个文字节点里的连续片段」=====
// 返回 { runs:[{ text, isTpl }], attrs:[…] }
//   标记（<…>）是分隔；同一个文字节点里被 ${} 切开的几段文字合成一条，表达式位置记成 {}
//   标记本身可能也被 ${} 切开（例如 <button data-id="${id}">文字），所以标记状态要跨片段维持
const DISPLAY_ATTRS = /(?:^|\s)(?:title|alt|placeholder|aria-label)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
function splitRuns(parts){
  const runs = [], attrs = [];
  const items = [];          // t=文字、ws=空白分隔、tag=标记、x=表达式
  let tag = null;            // 非空表示正在读取一个标记
  const pushText = seg => {
    for(const m of seg.match(/[^\S]+|[^\s]+/g) || []) items.push({ t: m.trim() ? 't' : 'ws', s: m });
  };
  const pushTag = () => {
    if(tag === null) return;
    items.push({ t: 'tag' });
    for(const a of tag.matchAll(DISPLAY_ATTRS)){ const v = (a[1] ?? a[2] ?? '').trim(); if(v && hasCJK(v)) attrs.push(v); }
    tag = null;
  };
  // 表达式本身是「翻译一条固定文字」（如 window.t('新收集')）时，界面上显示的就是那条固定文字：
  // 按固定文字代入后再比对，比的是真实显示的形状，不会和别的模板混同
  // （否则「✦ ${t('新收集')}：${t(item.name)}」会被看成「✦ {}：{}」，与「✦ 彩蛋：{name}」形状相同）
  const LIT_CALL = /^\s*(?:(?:window|I18N)\.)?(?:t|translate|_t|optTranslate|tEsc|tBr|tt)\(\s*(['"])([^'"]*)\1\s*\)\s*$/;
  for(const p of parts){
    let piece = p;
    if(p !== null && typeof p === 'object'){
      const lit = LIT_CALL.exec(p.expr || '');
      if(lit) piece = lit[2];
      else {
        if(tag !== null) tag += '{}'; else items.push({ t: 'x' });
        continue;
      }
    }
    if(piece === null){ if(tag !== null) tag += '{}'; else items.push({ t: 'x' }); continue; }
    let from = 0;
    for(let k = 0; k < piece.length; k++){
      const ch = piece[k];
      if(tag !== null){
        if(ch === '>'){ tag += piece.slice(from, k + 1); pushTag(); from = k + 1; }
        continue;
      }
      if(ch === '<'){ pushText(piece.slice(from, k)); tag = piece.slice(k, k + 1); from = k + 1; }
    }
    const rest = piece.slice(from);
    if(tag !== null) tag += rest; else pushText(rest);
  }
  if(tag !== null) pushTag();     // 没闭合的标记（拼接的另一段在别处），按已结束处理

  let buf = [];
  const flush = () => {
    if(buf.length){
      let s = '';
      for(const it of buf) s += it.t === 't' ? it.s : (it.t === 'ws' ? ' ' : '{}');
      s = s.replace(/\s+/g, ' ').trim();
      if(s) runs.push({ text: s, isTpl: buf.some(it => it.t === 'x') });
    }
    buf = [];
  };
  for(const it of items){ if(it.t === 'tag'){ flush(); continue; } buf.push(it); }
  flush();
  return { runs, attrs };
}

// ===== 收集缺口 =====
const gaps = [];          // { where, text, isTpl }
const covered = [];       // 已覆盖的文字（去重）
const coveredSet = new Set();
const allowFile = path.join(ROOT, 'tools', 'i18n-literal-allow.txt');
const ALLOW = new Set(fs.existsSync(allowFile)
  ? fs.readFileSync(allowFile, 'utf8').split('\n').map(s => displayKey(s.replace(/\s+#.*$/, ''))).filter(s => s && !s.startsWith('#'))
  : []);

// 字面量（去掉占位符与空白）不足 2 个字的模板，显示层不会自动套用（见 i18n/index.js 的 translateAuto），
// 这类拼接必须在代码里显式调用翻译函数
const AUTO_MIN_LITERAL = 2;
// 这些函数接收整条文字或模板键，算「显式翻译」；toast 内部会自动套用拼接文字
const TRANSLATORS = new Set(['t', '_t', 'window.t', 'optTranslate', 'I18N.translate', 'toast']);
const needShortTpl = [];      // 字面量过短、又没有显式翻译的拼接文字
function check(where, text, isTpl, isLog, callee){
  const ok = isTpl ? SHAPES.has(shapeOf(text)) : hasTr(text);
  if(ok && isTpl && !TRANSLATORS.has(callee || '')){
    // 依赖显示层自动套用：模板字面量必须够长
    const key = SHAPES.get(shapeOf(text));
    if([...key.replace(/\{[^{}]*\}/g, '').replace(/\s+/g, '')].length < AUTO_MIN_LITERAL) needShortTpl.push({ where, text, key });
  }
  if(ok){
    const k = (isTpl ? 'T|' : 'S|') + text;
    if(!coveredSet.has(k)){
      coveredSet.add(k);
      covered.push({ text, isTpl, en: isTpl ? String(PACK[SHAPES.get(shapeOf(text))]) : String(PACK[findKey(text)]) });
    }
    return;
  }
  if(isLog || ALLOW.has(text)) return;
  gaps.push({ where, text, isTpl });
}

function scanCodeFile(file){
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  for(const lit of extractLiterals(src)){
    const isLog = /^console\b/.test(lit.callee || '');
    const { runs, attrs } = splitRuns(lit.kind === 'str' ? [lit.text] : lit.parts);
    for(const a of attrs) check(`${file}:${lit.line}`, a, false, isLog, lit.callee);
    for(const r of runs){
      if(!hasCJK(r.text)) continue;
      check(`${file}:${lit.line}`, r.text, r.isTpl, isLog, lit.callee);
    }
  }
}

// ===== 扫描范围 =====
const topJs = fs.readdirSync(ROOT).filter(f => f.endsWith('.js'));
const codeFiles = [
  ...fs.readdirSync(path.join(ROOT, 'ui')).filter(f => f.endsWith('.js')).sort().map(f => 'ui/' + f),
  ...topJs.filter(f => /^engine[\w]*\.js$/.test(f)).sort(),
  ...topJs.filter(f => /^(?:interaction_queue|save_migrations|audio|pwa)\.js$/.test(f)).sort(),
];
for(const f of codeFiles) scanCodeFile(f);

// index.html：<script> 之外的静态文字与显示属性
{
  // 脚本内容换成等长空白，行号保持不变
  const src = html.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/g, (_, a, body, z) => a + body.replace(/[^\n]/g, ' ') + z);
  // 页面标题里的版本号每个版本都变，字典只收游戏名（界面在显示时把版本号接在后面），所以比对时去掉版本号
  const markup = src.replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '))
    .replace(/<title>([^<]*?)\s*·\s*v[\d.]+\s*<\/title>/g, '<title>$1</title>');
  const { runs, attrs } = splitRuns([markup]);
  for(const r of runs){ if(hasCJK(r.text)) check('index.html', r.text, false, false); }
  for(const a of attrs) check('index.html', a, false, false);
}

// ===== 剧情数据：全部中文字符串 =====
const { STORY } = await import(path.join(ROOT, 'story/index.mjs'));
let dataTotal = 0, dataOk = 0;
(function walk(node, where){
  if(!node || typeof node !== 'object') return;
  if(Array.isArray(node)){ node.forEach(v => walk(v, where)); return; }
  for(const [k, v] of Object.entries(node)){
    if(typeof v === 'string'){
      if(!hasCJK(v)) continue;
      dataTotal++;
      if(ALLOW.has(v)) continue;
      if(hasTr(v)){ dataOk++; check('story', v, false, false); }
      else gaps.push({ where: `story/${where ? where + '.' : ''}${k}`, text: v, isTpl: false });
    } else if(v && typeof v === 'object') walk(v, where ? `${where}.${k}` : k);
  }
})(STORY, '');

// ===== 输出 =====
const codeGaps = gaps.filter(g => g.where !== 'story' && !g.where.startsWith('story/'));
const dataGaps = gaps.filter(g => g.where === 'story' || g.where.startsWith('story/'));
// 整条文字的缺口按文字合并（同一个词在几十处出现只列一次），保留第一处来源与出现次数
const merged = new Map();
for(const g of codeGaps.filter(g => !g.isTpl)){
  const prev = merged.get(g.text);
  if(prev) prev.count++; else merged.set(g.text, { ...g, count: 1 });
}
const plainGaps = [...merged.values()];
const tplGaps = codeGaps.filter(g => g.isTpl);
const SHOW = argv.includes('--source') ? 100000 : 80;
console.log('界面代码与剧情数据的中文字面量英文覆盖（只统计含中文的；重复文字只算一条）');
console.log(`  界面代码   ${codeFiles.length} 个文件 + index.html；已覆盖 ${covered.filter(c => !c.isTpl).length} 条整条文字、${covered.filter(c => c.isTpl).length} 种拼接形状`);
console.log(`  剧情数据   ${dataOk} / ${dataTotal}   ${dataTotal ? (dataOk / dataTotal * 100).toFixed(1) : '100'}%`);
if(ALLOW.size) console.log(`  例外清单   ${ALLOW.size} 条（tools/i18n-literal-allow.txt，经确认不是界面文字）`);

if(argv.includes('--list')){
  console.log('\n已覆盖条目：');
  for(const c of covered) console.log(`  ${c.isTpl ? '[拼接] ' : ''}${JSON.stringify(c.text)}  →  ${JSON.stringify(c.en)}`);
}
const printGaps = (title, list) => {
  if(!list.length) return;
  console.log(`\n✗ ${title} ${list.length} 条：`);
  for(const g of list.slice(0, SHOW)) console.log(`  ${JSON.stringify(g.text)}${g.count > 1 ? `  ×${g.count}` : ''}    （${g.where}）`);
  if(list.length > SHOW) console.log(`  ……其余 ${list.length - SHOW} 条加 --source 查看`);
};
printGaps('字典里没有的整条文字（界面代码）', plainGaps);
printGaps('字典里没有对应模板的拼接文字（界面代码）', tplGaps);
if(needShortTpl.length){
  const uniq = [...new Map(needShortTpl.map(x => [x.text, x])).values()];
  console.log(`\n✗ 字面量过短、显示层不会自动套用的拼接文字 ${uniq.length} 种（必须在代码里显式翻译）：`);
  for(const x of uniq) console.log(`  ${JSON.stringify(x.text)}    （${x.where}；对应模板 ${JSON.stringify(x.key)}）`);
}
printGaps('字典里没有的剧情数据文字', dataGaps);
if(gaps.length || needShortTpl.length){
  console.log('\n处理：把英文补进 i18n/en-US.js（界面文案）或 i18n/story-en-translations-*.js（剧情文案）；');
  console.log('      拼接文字在字典里写成带占位符的模板（例如 "第{n}天的牌阵 · {r}"），界面显示层会按形状自动套用；');
  console.log('      确实不是界面文字的，写进 tools/i18n-literal-allow.txt（每行一条，可带 # 注释）；');
  console.log('      字面量过短的拼接，在代码里改成显式调用，例如 window.t(\'{label} {n}\', {label, n})。');
  process.exit(1);
}
console.log('\n✓ 界面代码与剧情数据的中文字面量全部有英文');
