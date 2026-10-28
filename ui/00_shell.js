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
    if(timeoutTimer){ window.clearTimeout(timeoutTimer); timeoutTimer = null; }
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
    t.textContent = (typeof I18N !== 'undefined' && I18N.translate) ? I18N.translate(msg) : msg;
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
        <div class="n-title">${char.name}</div>
        <div class="n-text">${escapeHtml(text)}</div>
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
    $('lock-date').textContent = d.full;
    $('widget-time').textContent = t.time;
    $('widget-date').textContent = `${d.month}月${d.date}日`;
  }

  // ===== 锁屏 =====
  $('lock-screen').addEventListener('click', ()=>{
    if(!restorePendingUi()) showScreen('home');
  });
  let lockSwipeStart = null;
  $('lock-screen').addEventListener('touchstart', e=>{
    lockSwipeStart = e.touches[0].clientY;
  });
  $('lock-screen').addEventListener('touchend', e=>{
    if(lockSwipeStart === null) return;
    const dy = e.changedTouches[0].clientY - lockSwipeStart;
    if(dy < -30 && !restorePendingUi()) showScreen('home');
    lockSwipeStart = null;
  });
