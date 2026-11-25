/* ===== 霓虹心事 · UI：壳：引擎实例、屏幕表、屏幕切换、Toast、通知、时间显示、锁屏 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

/* ===== 霓虹心事 · 手机模拟应用入口 ===== */
  const engine = new PhoneEngine(window.STORY);
  // v0.6.4：调试日志挂接（?debug=1 启用；默认零开销）
  if(typeof NeonDebug !== 'undefined') NeonDebug.attach(engine);  // v0.5.6（F2.1）：story 已 ESM 化，从 window 取
  const $ = id => document.getElementById(id);
  const screens = {
    lock:$('lock-screen'), home:$('home-screen'),
    messages:$('messages-app'), chat:$('chat-screen'),
    phone:$('phone-app'), incomingCall:$('incoming-call'),
    moments:$('moments-app'), postMoment:$('post-moment-screen'),
    album:$('album-app'), photoView:$('photo-view'),
    calendar:$('calendar-app'), music:$('music-app'),
    notes:$('notes-app'), profile:$('profile-app'),
    dream:$('dream-screen'), ending:$('ending-screen'),
    map:$('map-app'), encounter:$('encounter-screen'),
    groups:$('groups-app'), groupChat:$('group-chat-screen'),
    contacts:$('contacts-app'), charProfile:$('char-profile-screen'),
    flashback:$('flashback-screen'),
    shop:$('shop-app'), mood:$('mood-app'),
    tarot:$('tarot-app'), achievements:$('achievements-app'),
    collection:$('collection-app'), puzzles:$('puzzles-app'),
    puzzleDetail:$('puzzle-detail-screen'), calendar2:$('calendar2-app'),
    perspective:$('perspective-app'), pscene:$('perspective-scene-screen'),
    truthEnding:$('truth-ending-screen'),
    // v0.0.13 新玩法
    player:$('player-app'), playerEdit:$('player-edit-screen'),
    relations:$('relations-app'), tasks:$('tasks-app'),
    watch:$('watch-app'),
    // v0.0.15 新玩法
    affection:$('affection-app'), themes:$('themes-app'),
    endings:$('endings-app'), dates:$('dates-app'),
    dateScene:$('date-scene-screen'),
    // v0.0.16 新玩法
    dreams:$('dreams-app'), hints:$('hints-app'),
    nightmare:$('nightmare-screen'),
    // v0.1.0 存档
    saves:$('saves-app'), settings:$('settings-app')
  };
  let currentConvId = null;
  let currentGroupId = null;
  let timeoutTimer = null;
  // v0.8.1: 限时回复按会话管理，切换会话只重建视图、不重置截止时间
  const chatTimeouts = new Map();
  function clearChatTimeout(convId){
    const item = chatTimeouts.get(convId);
    if(item){ window.clearTimeout(item.handle); chatTimeouts.delete(convId); }
  }
  function clearAllChatTimeouts(){
    chatTimeouts.forEach(item=>window.clearTimeout(item.handle));
    chatTimeouts.clear();
    if(timeoutTimer){ window.clearTimeout(timeoutTimer); timeoutTimer = null; }
  }
  let selectedMomentArt = '';
  const uiTimers = new Set();

  function setUiTimeout(fn, delay){
    const id = window.setTimeout(()=>{
      uiTimers.delete(id);
      fn();
    }, delay);
    uiTimers.add(id);
    return id;
  }
  function resetTransientUi(){
    uiTimers.forEach(id=>window.clearTimeout(id));
    uiTimers.clear();
    clearAllChatTimeouts();
    currentConvId = null;
    currentGroupId = null;
    currentEncounter = null;
    currentNightmare = null;
    window._currentCall = null;
    if($('time-adv')) $('time-adv').hidden = true;
    document.getElementById('route-choice-modal')?.remove();
    document.getElementById('narrator-choice-modal')?.remove();
    // v0.7.3：清掉语音信箱详情抽屉（内部会停掉正在播放的留言）
    closeVmDetail();
  }

  // ===== 屏幕切换 =====
  function showScreen(name){
    // v0.7.3：离开当前屏幕即停播留言，避免声音与进度条残留在后台继续走
    stopVmPlayback();
    Object.values(screens).forEach(s=>{ if(s) s.classList.remove('active'); });
    if(screens[name]) screens[name].classList.add('active');
  }

  // ===== Toast =====
  let toastTimer = null;
  function toast(msg){
    const t = $('toast');
    // v0.3.6: i18n 文案集中层——按当前语言包翻译，未命中回退原文（中文为源）
    // v0.9.12：先按整条文字查；对不上（多半是带名字、数字的拼接文字）再按模板形状套用，都对不上保留原文
    let out = (typeof I18N !== 'undefined' && I18N.translate) ? I18N.translate(msg) : msg;
    if(out === msg && typeof I18N !== 'undefined' && typeof I18N.translateAuto === 'function'){
      const auto = I18N.translateAuto(msg);
      if(auto != null) out = auto;
    }
    t.textContent = out;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setUiTimeout(()=>{ t.hidden = true; }, 1500);
  }

  // ===== 共享工具 =====
  function escapeHtml(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function nl2brEscaped(s){
    return escapeHtml(s).replace(/\n/g, '<br>');
  }
  /* ===== v0.9.12：选项类文字的统一翻译出口 =====
   * 规则：凡是把数据里的文字渲染成选项按钮、提示语、内心话、碎片说明、标签、题目，
   * 一律经过这里，不要直接写 escapeHtml(opt.text)。
   * 之前 10 处界面各自直接渲染原文，结果字典里明明有译文，英文模式下选项却全是中文。
   * check_ui.js 会对这种写法报错。
   * 只影响显示：发给引擎、存进存档的仍然是中文原文（「中文快照 + 显示层翻译」的既有约定）。 */
  function optTranslate(s){
    return (typeof window.t === 'function' && s != null) ? window.t(s) : s;
  }
  // 选项文字（已翻译、未转义）；空值返回空字符串
  function optText(opt){ return opt && opt.text != null ? optTranslate(opt.text) : ''; }
  // 选项附带说明（已翻译、未转义）；没有则返回空字符串
  function optHint(opt){ return opt && opt.hint != null ? optTranslate(opt.hint) : ''; }
  // 任意数据文字：先翻译再转义。用于提示语、内心话、碎片说明、标签、题目等
  function tEsc(s){ return escapeHtml(s == null ? '' : optTranslate(s)); }
  // 同 tEsc，另外把换行转成 <br>（用于多行的说明文字）
  function tBr(s){ return tEsc(s).replace(/\n/g, '<br>'); }

  /* ===== v0.9.12：显示层兜底翻译 =====
   * 界面每次更新后，把界面上「能对上字典」的中文换成英文。两步：
   *   1. 整条文字与字典某个键完全相同 → 直接用（固定文字，如「关系网」「保存」）；
   *   2. 文字是拼接出来的（如「第13天的牌阵 · 逆位」「策略：好感优先」）→
   *      按字典里带占位符的模板比对形状后套用（见 i18n/index.js 的 translateAuto）。
   *
   * 为什么需要：界面模板里写死了大量固定中文，还有几十处带数字、名字的拼接，
   *   逐行包 window.t() 容易改错也难以穷尽。
   *   数据驱动的文字已经在渲染处显式翻译（见上面的 optText / tEsc / tBr），
   *   这里兜的是模板里的固定文字、拼接文字，以及以后新代码漏掉翻译的那一类。
   *   2026-11-24 首次实测：英文模式下 31 个应用里 20 个显示中文；点进详情页后还有几十种。
   *
   * 边界：
   *   - 只在英文模式下工作；
   *   - 只处理「整条文字」：要么与字典键完全相同，要么完全贴合某个模板，不做局部替换；
   *   - 不碰输入框、可编辑区域和标了 data-i18n-skip 的元素里的文字——玩家自己输入的内容不能被改
   *     （输入框的占位提示、无障碍标签属于界面文字，会翻译）；
   *   - 只改显示，不改数据：存档、发给引擎的仍是中文原文。
   * 新代码仍应显式写 window.t() / tEsc()，不要依赖这里的兜底。
   */
  const I18N_SKIP = 'input, textarea, [contenteditable], [data-i18n-skip]';
  const I18N_ATTRS = ['alt', 'title', 'placeholder', 'aria-label'];
  function i18nEnglish(){ return !!(window.I18N && window.I18N.getLang() && window.I18N.getLang() !== 'zh-CN'); }
  // 整条文字的译文；没有译文（或已是译文）返回 null
  function displayTranslate(raw){
    const key = raw.trim();
    if(!key || !/[\u4e00-\u9fff]/.test(key)) return null;
    const direct = window.t(key);
    if(direct !== key) return direct;
    const auto = (typeof window.tAuto === 'function') ? window.tAuto(key) : null;
    return auto != null && auto !== key ? auto : null;
  }
  function autoTranslateText(node){
    const raw = node.nodeValue;
    const parent = node.parentElement;
    if(!parent || parent.closest(I18N_SKIP)) return;
    const out = displayTranslate(raw);
    if(out == null) return;
    // 用函数替换：译文里若含 $ 不会被当成特殊符号；只替换去掉首尾空白后的那一段
    node.nodeValue = raw.replace(raw.trim(), () => out);
  }
  function autoTranslateAttrs(el){
    for(const name of I18N_ATTRS){
      const raw = el.getAttribute && el.getAttribute(name);
      if(!raw) continue;
      const out = displayTranslate(raw);
      if(out == null) continue;
      el.setAttribute(name, raw.replace(raw.trim(), () => out));
    }
  }
  // 月份标签：中文显示「7月」，英文显示缩写「Jul」（数字没法靠字典映射成月份名，所以在代码里分语言）
  const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function monthLabel(m){ return i18nEnglish() ? (MONTHS_EN[m - 1] || String(m)) : (m + '月'); }
  function autoTranslateTree(root){
    if(!root || typeof window.t !== 'function' || !i18nEnglish()) return;
    if(root.nodeType === 3){ autoTranslateText(root); return; }
    if(root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while((node = walker.nextNode())) autoTranslateText(node);
    // 图片替代文字、悬停提示、输入框占位提示、无障碍标签
    if(root.nodeType === 1 && root.matches && root.matches('[alt], [title], [placeholder], [aria-label]')) autoTranslateAttrs(root);
    if(root.querySelectorAll) root.querySelectorAll('[alt], [title], [placeholder], [aria-label]').forEach(autoTranslateAttrs);
  }
  (function startAutoTranslate(){
    // 观察整个页面而不只是手机容器：解锁横幅、礼物弹层、闲逛提示等都直接挂在 body 上
    const host = document.body;
    if(!host || typeof MutationObserver === 'undefined') return;
    new MutationObserver(records=>{
      for(const r of records){
        if(r.type === 'characterData'){ autoTranslateTree(r.target); continue; }
        if(r.type === 'attributes'){ if(i18nEnglish()) autoTranslateAttrs(r.target); continue; }
        for(const n of r.addedNodes) autoTranslateTree(n);
      }
    }).observe(host, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: I18N_ATTRS });
    // 浏览器标签页标题：字典里只有游戏名，版本号（每个版本都变）从 <meta name="version"> 里取
    function applyDocumentTitle(){
      const name = '霓虹心事 · 林夏的手机';
      const meta = document.querySelector('meta[name="version"]');
      const title = name + (meta && meta.content ? ' · ' + meta.content : '');
      const tr = window.t(name);
      document.title = tr && tr !== name ? title.replace(name, () => tr) : title;
    }
    // 切换语言后各界面会重新渲染；再整体兜一遍，覆盖没有重绘的部分
    window.addEventListener('i18nchange', ()=>{ applyDocumentTitle(); setTimeout(()=>autoTranslateTree(host), 0); });
    try { applyDocumentTitle(); } catch(_){}
    autoTranslateTree(host);
  })();
  function mergeOptionEffects(opt){
    return engine.normalizeOptionEffects ? engine.normalizeOptionEffects(opt) : {...(opt?.effects||{})};
  }

  // ===== 角色头像 =====
  function avatarImg(char){
    if(char && char.avatarImg){
      return `<img class="avatar-img" src="${char.avatarThumb || char.avatarImg}" alt="" loading="lazy" decoding="async" width="128" height="128">`;
    }
    return escapeHtml(char && char.avatar ? char.avatar : '?');
  }

  // ===== 通知 =====
  // v0.6.3：读档/新开局后的静默窗口——期间到达的消息只计未读，不弹通知。
  // 修复「打开就看到一堆弹窗」：恢复 pending 消息时玩家还没进入状态。
  let notifMuteUntil = 0;
  function muteNotifs(ms){ notifMuteUntil = Date.now() + ms; }

  function showNotif(from, text, onClick){
    const char = STORY.characters[from];
    if(!char) return;
    if(Date.now() < notifMuteUntil) return;   // 静默窗口内不打扰
    AudioSys.play('msg');  // v0.1.7: 消息提示音
    const stack = $('notif-stack');
    // v0.6.3：通知栈上限 3 条，避免一次性涌入叠成一堵墙
    while(stack.children.length >= 3) stack.firstElementChild?.remove();
    const n = document.createElement('div');
    n.className = 'notif';
    n.innerHTML = `
      <div class="n-icon" style="background:${char.bg}">${avatarImg(char)}</div>
      <div class="n-content">
        <div class="n-title">${escapeHtml(window.t(char.name))}</div>
        <div class="n-text">${escapeHtml((window.I18N && typeof window.I18N.translateAuto === 'function' && window.I18N.translateAuto(text)) || text)}</div>
      </div>
    `;
    n.onclick = ()=>{
      if(typeof onClick === 'function') onClick();
      else openConversation(from);
      n.remove();
    };
    stack.appendChild(n);
    setUiTimeout(()=> n.remove(), 5000);
  }

  // ===== 时间显示 =====
  function updateTimeDisplay(){
    const t = engine.getTime();
    const d = engine.getDateLabel();
    $('sb-time').textContent = t.time;
    $('lock-time').textContent = t.time;
    $('lock-date').textContent = window.localizeDateLabel(d.full);   // v0.7.8：中文快照显示层重拼（英文模式 7/15 Wed）
    $('widget-time').textContent = t.time;
    $('widget-date').textContent = window.t('{m}月{d}日', {m: d.month, d: d.date});   // v0.7.7：日期走 i18n 模板（英文模式显示 7/15）
  }

  // ===== 锁屏 =====
  // v0.9.1：锁屏期间 restorePendingUi 不恢复弹窗，解锁后需再调用一次
  function unlock(){
    if(restorePendingUi()) return;
    showScreen('home');
    restorePendingUi();
  }
  $('lock-screen').addEventListener('click', unlock);
  let lockSwipeStart = null;
  $('lock-screen').addEventListener('touchstart', e=>{
    lockSwipeStart = e.touches[0].clientY;
  });
  $('lock-screen').addEventListener('touchend', e=>{
    if(lockSwipeStart === null) return;
    const dy = e.changedTouches[0].clientY - lockSwipeStart;
    if(dy < -30) unlock();
    lockSwipeStart = null;
  });
