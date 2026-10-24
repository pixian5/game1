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
  }
  function getLang(){ return currentLang; }
  function availableLangs(){ return Object.keys(packs()); }

  const I18N = { translate, setLang, getLang, availableLangs, DEFAULT_LANG };
  if(typeof window !== 'undefined'){ window.I18N = I18N; window.t = translate; }
  else if(typeof globalThis !== 'undefined'){ globalThis.I18N = I18N; globalThis.t = translate; }
})();