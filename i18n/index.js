/* ===== 霓虹心事 · i18n 框架（v0.3.6 / 计划 B1-a）=====
 * 结构抽取第一步：提供语言包查询与回退，默认中文（zh-CN）。
 * 约定：以「中文原文」为 key；未命中当前语言包时回退返回原文（中文为源，不阻塞运行）。
 * 用法：I18N.translate('壁纸已切换') → 当前语言译文（无译文时返回原文）。
 *       I18N.setLang('en-US') 切换；语言包挂到 window.I18N_PACKS[lang]（见 i18n/zh-CN.js）。
 * 渐进路线：本版先覆盖 UI 固定文案（toast）；story/ 剧情文本较大，后续按需抽取。
 */
(function(){
  'use strict';
  const DEFAULT_LANG = 'zh-CN';
  let currentLang = DEFAULT_LANG;

  function packs(){
    return (typeof window !== 'undefined' && window.I18N_PACKS) || {};
  }
  function translate(text, vars){
    if(text == null) return text;
    const src = String(text);
    const pack = packs()[currentLang] || {};
    let out = Object.prototype.hasOwnProperty.call(pack, src) ? pack[src] : src;
    if(vars){
      out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    }
    return out;
  }
  function setLang(lang){
    currentLang = lang || DEFAULT_LANG;
    try {
      localStorage.setItem('neon_lang', currentLang);
      document.documentElement.lang = currentLang;   // v0.5.3（E4）：css 排版随语言
    } catch(_) {}
    // v0.7.8：静态 HTML 文本（data-i18n 标注）随语言切换刷新，先于 i18nchange 派发
    try { applyStaticI18n(); } catch(_) {}
    // v0.5.4（E4）：通知 UI 重渲染已显示的文本（消息体/选项/图鉴等出口读取时机不同）
    try { window.dispatchEvent(new CustomEvent('i18nchange', {detail: {lang: currentLang}})); } catch(_) {}
  }
  function getLang(){ return currentLang; }
  function availableLangs(){ return Object.keys(packs()); }

  /* ===== v0.7.8：静态 HTML 文本英文化 =====
   * 约定：index.html/privacy.html 中用户可见的静态文本元素标注
   *   data-i18n="中文原文"            → textContent 替换（元素不得含需保留的子元素）
   *   data-i18n-placeholder="原文"    → placeholder 属性替换
   *   data-i18n-title="原文"          → title 属性替换
   *   data-i18n-aria="原文"           → aria-label 属性替换
   * key 与 t() 同机制（中文原文精确匹配、miss 回退原文）；切换语言时由 setLang 调用。
   */
  function applyStaticI18n(root){
    root = root || (typeof document !== 'undefined' ? document : null);
    if(!root || !root.querySelectorAll) return;
    const apply = (sel, fn) => {
      const attr = sel.slice(1, -1);
      root.querySelectorAll(sel).forEach(el => {
        const key = el.getAttribute(attr);
        if(key) fn(el, key);
      });
    };
    apply('[data-i18n]', (el, key) => {
      // 防御：含子元素的元素不做 textContent 替换（会丢结构），此类场景应包一层纯文本 span
      if(el.children.length === 0) el.textContent = translate(key);
    });
    apply('[data-i18n-placeholder]', (el, key) => { el.placeholder = translate(key); });
    apply('[data-i18n-title]', (el, key) => { el.title = translate(key); });
    apply('[data-i18n-aria]', (el, key) => { el.setAttribute('aria-label', translate(key)); });
    // data-i18n-href="zh页|en页"：按语言切换链接目标（privacy 合规文本双页面方案，避免破坏正文结构）
    root.querySelectorAll('[data-i18n-href]').forEach(el => {
      const parts = el.getAttribute('data-i18n-href').split('|');
      if(parts.length === 2) el.href = currentLang === 'en-US' ? parts[1] : parts[0];
    });
  }

  /* ===== v0.7.8：日期标签显示层重拼（存档/快照兼容） =====
   * 备忘录/朋友圈/存档摘要里存的是中文 full 快照（如「7月15日 星期三」），
   * 动态组合无法枚举翻译——显示层解析字段后用模板重拼（同 v0.7.4「中文快照+显示层翻译」）。
   * weekday 以完整词（星期三）为变量值，预先过 t() 再插入模板。
   */
  function localizeDateLabel(full){
    if(!full || typeof full !== 'string') return full;
    const m = full.match(/^(\d{1,2})月(\d{1,2})日(?:\s*星期([一二三四五六日]))?$/);
    if(!m) return full;   // 非标准格式原样返回（如「第3天」）
    const wk = m[3] ? '星期' + m[3] : '';
    if(wk) return translate('{m}月{d}日 {w}', {m: m[1], d: m[2], w: translate(wk)});
    return translate('{m}月{d}日', {m: m[1], d: m[2]});
  }

  /* ===== v0.9.12：拼接文字的自动套用（仅用于显示层兜底） =====
   * 界面里很多文字是拼接出来的，例如「第13天的牌阵 · 逆位」「策略：好感优先」
   * 「沈砚之在等你回复：」——整条文字对不上字典，所以字典里有译文也显示不出来。
   * 2026-11-25 实测：英文模式下点进详情页后还有几十种这样的中文。
   *
   * 做法：把字典里带占位符的模板（如「第{n}天的牌阵 · {r}」）逐个比对「形状」，
   *   命中就套用该模板的译文；占位符处截到的内容若本身也在字典里（如策略名「好感优先」），再翻一次。
   *
   * 边界：
   *   - 只在非默认语言下工作（中文模式下任何文字都不改）；
   *   - 字面量部分不足 2 个字的模板不参与（如「{n}天」）——太短，玩家自己输入的话可能被误套；
   *   - 整条文字必须完全贴合某个模板，不做局部替换；
   *   - 占位符处截到的中文必须本身也查得到译文，否则放弃这次匹配——套错模板比不翻译更糟；
   *   - 空白按「显示效果」比对（首尾空白忽略、连续空白算一个空格），字典键与界面文字的换行、缩进差异不影响命中；
   *   - 找不到译文返回 null，由调用方保留原文。
   * 新代码仍应显式写 t('第{n}天的牌阵 · {r}', {n, r})，不要依赖这里的自动套用。
   */

  // 空白按「显示效果」比对：首尾空白去掉、连续空白（含换行与缩进）算一个空格。
  // 模板里的长段落常带换行和缩进，显示出来和单空格一样，但逐字相等的话对不上字典键。
  const displayKey = s => String(s).trim().replace(/\s+/g, ' ');

  // 按字典里的模板预先生成的比对规则
  function buildAutoMatchers(pack){
    const list = [];
    const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
    for(const [key, en] of Object.entries(pack)){
      if(typeof en !== 'string' || !key.includes('{')) continue;
      const src = displayKey(key);
      const names = [...src.matchAll(/\{([^{}]+)\}/g)].map(m => m[1].trim());
      const parts = src.split(/\{[^{}]+\}/);
      const literal = parts.join('');
      if([...literal].length < 2) continue;      // 字面量不足 2 个字的模板不参与自动套用
      // 占位符两侧的空白可有可无（代码里写 第${n}天，字典键是「第 {n} 天」）；其余空白按原样但允许数量不同
      let re = '^';
      parts.forEach((p, idx) => {
        const lead = /^\s*/.exec(p)[0].length, trail = /\s*$/.exec(p)[0].length;
        const core = p.slice(lead, p.length - trail);
        if(lead) re += '\\s*';
        re += escapeRegExp(core).replace(/\s+/g, '\\s*');
        if(trail) re += '\\s*';
        // 贪婪匹配：后面的定界文字取「最后一次出现」的位置，
        // 这样「正文\n（时间）」即使正文里也有括号，也能在正确的位置切开
        if(idx < names.length) re += '(.+)';
      });
      try { list.push({ en, names, re: new RegExp(re + '$'), literal }); } catch(_){ /* 键里有无法构成正则的内容，跳过 */ }
    }
    list.sort((a, b) => b.literal.length - a.literal.length);   // 字面量长的优先，更具体的模板先比对
    return list;
  }

  let autoStampPack = null, autoMatchers = [], autoCache = new Map(), looseIndex = new Map();
  function rebuildAutoState(pack){
    autoStampPack = pack;
    autoMatchers = buildAutoMatchers(pack);
    autoCache = new Map();
    looseIndex = new Map();
    // 只收录「与显示效果写法不同」的键（键里带换行或连续空白）；其余键第一步已按原文命中
    for(const [k, v] of Object.entries(pack)){
      const dk = displayKey(k);
      if(dk !== k && !looseIndex.has(dk)) looseIndex.set(dk, v);
    }
  }
  function translateAuto(text, depth){
    if(currentLang === DEFAULT_LANG || text == null) return null;
    const src = displayKey(text);
    if(!src || !/[\u4e00-\u9fff]/.test(src)) return null;
    const pack = packs()[currentLang] || {};
    if(Object.prototype.hasOwnProperty.call(pack, src)) return pack[src];
    if((depth || 0) >= 2) return null;      // 占位符里再套占位符，最多两层
    // 语言包对象换了（切换语言，或首次调用）才重建；正在使用的语言包不会在运行中追加
    if(autoStampPack !== pack) rebuildAutoState(pack);
    if(looseIndex.has(src)) return looseIndex.get(src);
    // 只缓存最外层的结果：嵌套调用受层数上限影响，结果可能与最外层不同
    if(!depth && autoCache.has(src)) return autoCache.get(src);
    let out = null;
    for(const tp of autoMatchers){
      const m = tp.re.exec(src);
      if(!m) continue;
      // 占位符处截到的内容若是中文，必须是字典里查得到的词（人名、道具名、策略名……）；
      // 查不到说明多半是套错了模板——把本该保留的文字当成了变量（「✦ 新收集：X」套成「✦ 彩蛋：X」）。
      // 套错比不翻更糟，所以放弃这次匹配，继续试下一个模板。
      let bad = false;
      const values = tp.names.map((name, i) => {
        const v = (m[i + 1] || '').trim();
        const tv = v ? translateAuto(v, (depth || 0) + 1) : null;
        if(tv == null && /[\u4e00-\u9fff]/.test(v)) bad = true;
        return tv != null ? tv : v;
      });
      if(bad) continue;
      out = tp.en;
      tp.names.forEach((name, i) => { out = out.split('{' + name + '}').join(values[i]); });
      break;
    }
    if(!depth){
      if(autoCache.size > 5000) autoCache = new Map();
      autoCache.set(src, out);
    }
    return out;
  }

  const I18N = { translate, translateAuto, setLang, getLang, availableLangs, applyStaticI18n, localizeDateLabel, DEFAULT_LANG };
  if(typeof window !== 'undefined'){ window.I18N = I18N; window.t = translate; window.tAuto = translateAuto; window.localizeDateLabel = localizeDateLabel; }
  else if(typeof globalThis !== 'undefined'){ globalThis.I18N = I18N; globalThis.t = translate; globalThis.tAuto = translateAuto; globalThis.localizeDateLabel = localizeDateLabel; }
})();