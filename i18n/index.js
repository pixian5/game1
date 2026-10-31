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

  const I18N = { translate, setLang, getLang, availableLangs, applyStaticI18n, localizeDateLabel, DEFAULT_LANG };
  if(typeof window !== 'undefined'){ window.I18N = I18N; window.t = translate; window.localizeDateLabel = localizeDateLabel; }
  else if(typeof globalThis !== 'undefined'){ globalThis.I18N = I18N; globalThis.t = translate; globalThis.localizeDateLabel = localizeDateLabel; }
})();