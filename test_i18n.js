/* ===== 双语翻译层测试（v0.9.12）=====
 * 覆盖三件事：
 *   1. 英文字典自身的完整性（译文非空、模板里的占位符名字与中文键一致、译包没有漏挂）；
 *   2. 显式翻译 window.t()：整条查找、带占位符的模板；
 *   3. 显示层自动套用 I18N.translateAuto()：拼接文字按形状套模板、过短模板不套、
 *      套错模板时放弃（宁可留中文）、空白按显示效果比对、中文模式下任何文字都不改。
 * 不依赖浏览器、不依赖数据库。
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 译包清单以首页为准，按引用顺序加载（与浏览器一致）
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const packs = [...html.matchAll(/<script src="i18n\/([\w.-]+\.js)(?:\?[^"]*)?"><\/script>/g)].map(m => m[1]);
assert.ok(packs.length > 1, '首页应当引用多个译包');

// 独立的沙箱：没有 document，只有 window 与 localStorage 的最小替身
const storage = new Map();
const sandbox = {
  console, Object, Array, String, Number, Boolean, JSON, Math, Map, Set, RegExp, Error,
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for(const file of packs) vm.runInContext(fs.readFileSync(path.join(__dirname, 'i18n', file), 'utf8'), sandbox, { filename: 'i18n/' + file });
const I18N = sandbox.window.I18N;
const EN = sandbox.window.I18N_PACKS['en-US'];
assert.ok(I18N && typeof I18N.translate === 'function', '翻译模块应当导出 I18N');
assert.ok(I18N && typeof I18N.translateAuto === 'function', 'v0.9.12 起应当导出 I18N.translateAuto');

function test(name, fn){
  fn();
  console.log(`✓ ${name}`);
}
const placeholders = s => [...s.matchAll(/\{([^{}]+)\}/g)].map(m => m[1].trim()).sort().join(',');

// ===== 1. 字典完整性 =====
test('v0.9.12: 首页引用的译包都存在，i18n 目录里没有漏挂的译包', ()=>{
  for(const file of packs) assert.ok(fs.existsSync(path.join(__dirname, 'i18n', file)), `首页引用了不存在的译包 ${file}`);
  const enPacks = fs.readdirSync(path.join(__dirname, 'i18n')).filter(f => f === 'en-US.js' || /^story-en-translations(-\d+)?\.js$/.test(f));
  const orphans = enPacks.filter(f => !packs.includes(f));
  assert.deepEqual(orphans, [], '这些译包在目录里但首页没有引用，不会生效：' + orphans.join(', '));
  // 离线缓存的预缓存清单也要有，否则装成应用后离线打不开英文
  const sw = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');
  for(const file of enPacks) assert.ok(sw.includes('i18n/' + file), `sw.js 预缓存清单缺少 i18n/${file}`);
});

test('v0.9.12: 英文字典每条译文都是非空字符串', ()=>{
  const bad = Object.entries(EN).filter(([, v]) => typeof v !== 'string' || !v.trim());
  assert.deepEqual(bad.map(([k]) => k), [], '译文为空或不是字符串');
});

test('v0.9.12: 英文模板译文里的占位符名字与中文键一致', ()=>{
  // 键用 {n}、译文写成 {m} 的话，界面上会原样显示「{m}」
  const bad = Object.entries(EN).filter(([k, v]) => typeof v === 'string' && placeholders(k) !== placeholders(v));
  assert.deepEqual(bad, [], '占位符不一致');
  assert.ok(Object.keys(EN).some(k => k.includes('{')), '字典里应当有带占位符的模板');
});

// ===== 2. 中文模式：任何文字都不改 =====
test('v0.9.12: 中文模式下整条翻译原样返回、自动套用不工作', ()=>{
  assert.equal(I18N.getLang(), 'zh-CN');
  assert.equal(I18N.translate('已解锁'), '已解锁');
  assert.equal(I18N.translate('第 {day} 天', { day: 3 }), '第 3 天');     // 中文包按模板代入
  for(const s of ['第13天', '策略：好感优先', '7月15日 星期三', '关系网']) assert.equal(I18N.translateAuto(s), null, `中文模式下不应改写「${s}」`);
});

// ===== 3. 英文模式 =====
I18N.setLang('en-US');

test('v0.9.12: 英文模式整条翻译与显式模板', ()=>{
  assert.equal(I18N.translate('已解锁'), 'Unlocked');
  assert.equal(I18N.translate('第 {day} 天', { day: 3 }), 'Day 3');
  assert.equal(I18N.translate('字典里没有的词'), '字典里没有的词', '没有译文时保留原文');
  assert.equal(I18N.translate(null), null);
});

test('v0.9.12: 拼接文字按模板形状自动套用', ()=>{
  const t = I18N.translateAuto;
  assert.equal(t('第13天'), 'Day 13', '代码里写 第${n}天，字典键是「第 {day} 天」');
  assert.equal(t('第 3 天'), 'Day 3');
  assert.equal(t('7月15日 星期三'), '7/15 Wed', '占位符里的星期名再翻一次');
  assert.equal(t('策略：好感优先'), 'Strategy: Affection First', '占位符里的策略名再翻一次');
  assert.equal(t('沈砚之在等你回复：'), 'Shen Yanzhi is waiting for your reply:', '占位符里的人名再翻一次');
  assert.equal(t('✦ 新收集：霓城夜景明信片'), '✦ New collectible: Neon Night Postcard');
  assert.equal(t('关系网'), 'Relationships', '整条文字与字典键相同的也能走这里');
  assert.equal(t('已送出 · 陆辞 好感 +3'), 'Sent to Lu Ci · Affection +3');
});

test('v0.9.12: 邀约消息（正文 + 换行 + 括号里的时间）整句翻译', ()=>{
  const out = I18N.translateAuto('周末有空吗？带你重走一遍我们以前的学校。往返四小时，赶得及吃晚饭。\n（周六 09:00）');
  assert.ok(out && out.startsWith('Free this weekend?'), `正文应已翻译：${out}`);
  assert.ok(out.endsWith('\n(Saturday 09:00)'), `括号里的时间应已翻译并保留换行：${out}`);
  assert.ok(!/[\u4e00-\u9fff]/.test(out), `不应残留中文：${out}`);
});

test('v0.9.12: 字面量过短的模板不自动套用，玩家自己输入的话不会被改', ()=>{
  const t = I18N.translateAuto;
  assert.equal(t('明天'), null, '「{n}天」字面量只有 1 个字，不参与自动套用');
  assert.equal(t('3天'), null);
  assert.equal(t('Alice'), null, '不含中文的文字一律不动');
  assert.equal(t(''), null);
  assert.equal(t(null), null);
});

test('v0.9.12: 套错模板时放弃匹配，宁可留中文也不输出错译', ()=>{
  const t = I18N.translateAuto;
  // 形状对得上「策略：{name}」，但占位符里的中文查不到译文 → 多半是套错了，放弃
  assert.equal(t('策略：查不到的词'), null);
  assert.equal(t('✦ 彩蛋：不是道具的名字'), null, '不应被套成「✦ Easter egg: …」');
  // 真正的道具名查得到，才会套用
  assert.equal(t('✦ 彩蛋：霓城夜景明信片'), '✦ Easter egg: Neon Night Postcard');
});

test('v0.9.12: 空白按显示效果比对（换行、缩进、连续空格）', ()=>{
  assert.equal(I18N.translateAuto('  第\n     13   天  '), 'Day 13');
  assert.equal(I18N.translateAuto('\n          好感 16 · 密 3 / 信 2 / 暧 1\n        '), null, '缺人名的半截文字不应被硬套');
  assert.equal(I18N.translateAuto('沈砚之\n          好感 16 · 密 3 / 信 2 / 暧 1'), 'Shen Yanzhi Affection 16 · Close 3 / Trust 2 / Tension 1');
});

test('v0.9.12: 日期标签本地化（存档与快照里的中文日期）', ()=>{
  assert.equal(I18N.localizeDateLabel('7月15日 星期三'), '7/15 Wed');
  assert.equal(I18N.localizeDateLabel('7月15日'), '7/15');
  assert.equal(I18N.localizeDateLabel('第3天'), '第3天', '非日期格式原样返回（由调用方决定是否翻译）');
});

test('v0.9.12: 切回中文后自动套用立即停止', ()=>{
  I18N.setLang('zh-CN');
  assert.equal(I18N.translateAuto('第13天'), null);
  assert.equal(I18N.translate('已解锁'), '已解锁');
  I18N.setLang('en-US');
  assert.equal(I18N.translateAuto('第13天'), 'Day 13', '再切回英文应恢复');
});

// 剧情数据与界面代码里的中文是否都有英文，由 tools/i18n-literal-coverage.mjs 与
// tools/i18n-choice-coverage.mjs 负责检查（都挂在 npm run verify:offline 里），这里不重复。
// 界面上实际还剩多少中文，由 tools/i18n-leak-scan.mjs 在浏览器里实测。

console.log(`全部双语翻译层测试通过（英文字典 ${Object.keys(EN).length} 条）`);
