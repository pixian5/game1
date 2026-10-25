#!/usr/bin/env node
/* ===== 霓虹心事 · 剧情文本抽取管线（v0.5.3 阶段 E4）=====
 * 扫描 story/ 数据中的用户可见文本（text/prompt/desc/onSuccess/onFail/title/caption 等），
 * 产出三类报告与骨架：
 *   1) i18n/story-en.js 增量骨架（key=中文原文，value 默认 ''，由翻译填充）
 *   2) 覆盖率统计（已翻译 / 待翻译 / 总量）——供 check:ui 门禁与人工校对排期
 * 已有译文不会被覆盖（合并保留）。
 * 用法：node tools/extract_story_strings.mjs
 */
'use strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const ROOT = path.dirname(path.dirname(__filename));

// 与渲染出口一致的取值键（用户可见文本）
const TEXT_KEYS = ['text', 'prompt', 'desc', 'onSuccess', 'onFail', 'title', 'caption', 'meaning', 'how'];
const SKIP_KEYS = new Set(['answer', 'hint']);   // hint 属提示逻辑文案，单独处理（不进剧情包）

// 用沙箱加载 STORY（同 test_helper 方式，保持与运行时一致）
const fs2 = await import('node:fs');
const vm = await import('node:vm');
const sandbox = { window: {}, console, Date, Math, JSON, Object, Array, String, Number, Boolean, Set, Map, setTimeout, clearTimeout, setInterval, clearInterval };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const storyDir = path.join(ROOT, 'story');
for (const f of fs2.readdirSync(storyDir).filter(f => f.endsWith('.js')).sort()) {
  vm.runInContext(fs2.readFileSync(path.join(storyDir, f), 'utf8'), sandbox, { filename: 'story/' + f });
}
const STORY = sandbox.window.STORY;

const strings = new Set();
function collect(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(collect); return; }
  for (const [k, v] of Object.entries(node)) {
    if (TEXT_KEYS.includes(k) && typeof v === 'string' && v.trim().length >= 2) strings.add(v);
    else if (typeof v === 'object') collect(v);
  }
}
collect(STORY.events);
collect(STORY.criticalEvents);
collect(STORY.endings);
collect(STORY.dreams);
collect(STORY.moments);
collect(STORY.photos);
collect(STORY.collectibles);
collect(STORY.puzzles);
collect(STORY.dateScenes);
collect(STORY.nightmares);
collect(STORY.flashbacks);
collect(STORY.invitations);
collect(STORY.intel);
collect(STORY.achievements);
collect(STORY.easterEggs);
collect(STORY.dateScenes);
// 选项文本（choice.options[].text 单独的键名）
(function collectOptions(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(collectOptions); return; }
  for (const [k, v] of Object.entries(node)) {
    if (k === 'choice' && v && typeof v === 'object') {
      if (typeof v.prompt === 'string') strings.add(v.prompt);
      (v.options || []).forEach(o => { if (typeof o.text === 'string' && o.text.trim()) strings.add(o.text); });
    }
    collectOptions(v);
  }
})(STORY.events);
(function collectOptions2(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(collectOptions2); return; }
  for (const [k, v] of Object.entries(node)) {
    if (k === 'choice' && v && typeof v === 'object') {
      if (typeof v.prompt === 'string') strings.add(v.prompt);
      (v.options || []).forEach(o => { if (typeof o.text === 'string' && o.text.trim()) strings.add(o.text); });
    }
    collectOptions2(v);
  }
})(STORY.criticalEvents);

// 读取现有 story-en 译文（合并保留）
const existing = {};
for (const f of ['i18n/story-en-translations.js', 'i18n/story-en-translations-2.js', 'i18n/story-en-translations-3.js', 'i18n/story-en-translations-4.js']) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  const sb2 = { window: {} };
  vm.createContext(sb2);
  try {
    vm.runInContext(fs2.readFileSync(p, 'utf8'), sb2);
    Object.assign(existing, (sb2.window.I18N_PACKS || {})['en-US'] || {});
  } catch(e) { console.error(f, '解析失败:', e.message); }
}

const total = strings.size;
const translated = [...strings].filter(s => (existing[s] || '').trim()).length;
const missing = [...strings].filter(s => !(existing[s] || '').trim()).sort();


console.log(`剧情文本总量: ${total}`);
console.log(`已翻译: ${translated}（${total ? Math.round(translated/total*100) : 0}%）`);
console.log(`待翻译: ${missing.length}`);
if (missing.length) console.log('待翻译样例:', missing.slice(0, 3).map(s => s.slice(0, 20)).join(' | '));
