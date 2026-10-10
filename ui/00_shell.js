/* ===== 霓虹心事 · UI：壳：引擎实例、屏幕表、屏幕切换、Toast、通知、时间显示、锁屏 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

/* ===== 霓虹心事 · 手机模拟应用入口 ===== */
  const engine = new PhoneEngine(STORY);
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
    saves:$('saves-app')
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
  }

  // ===== 屏幕切换 =====
  function showScreen(name){
    Object.values(screens).forEach(s=>{ if(s) s.classList.remove('active'); });
    if(screens[name]) screens[name].classList.add('active');
  }

  // ===== Toast =====
  let toastTimer = null;
  function toast(msg){
    const t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setUiTimeout(()=>{ t.hidden = true; }, 1500);
  }

  // ===== 通知 =====
  function showNotif(from, text, onClick){
    const char = STORY.characters[from];
    if(!char) return;
    AudioSys.play('msg');  // v0.1.7: 消息提示音
    const stack = $('notif-stack');
    const n = document.createElement('div');
    n.className = 'notif';
    n.innerHTML = `
      <div class="n-icon" style="background:${char.bg}">${char.avatar}</div>
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
