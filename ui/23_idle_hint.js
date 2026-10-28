/* ===== 霓虹心事 · UI：空窗期引导（v0.6.6 P0-1）=====
 * 问题：玩家回复完所有消息后游戏静默停摆——唯一推进时间的方式（出行）无任何提示，
 * 玩家不知道该做什么，误以为"没内容了"。
 * 方案：检测"无待办空窗"（消息全清 + 无待发 + 无挂起交互 + 非结局态）持续 ~8 秒后，
 * 弹出可点击的引导气泡（带 10 分钟冷却），点击直达出行页。
 */
  // ===== 空窗期引导 =====
  let idleHintEl = null;
  let idleHintTimer = null;
  let idleHintLastAt = 0;      // 上次展示时间（冷却 10 分钟）
  let idleWatchStart = null;   // 空窗开始时刻

  function dismissIdleHint(){
    if(idleHintEl){ idleHintEl.remove(); idleHintEl = null; }
  }

  function isIdleWindow(){
    const e = engine.state;
    if(e.ended) return false;
    const hasUnread = Object.values(e.conversations).some(c => c.unread > 0);
    const hasPendingChoice = Object.values(e.conversations).some(c => c.pendingChoice);
    const hasPendingMsgs = (e.pendingMessages || []).length > 0;
    const hasPendingQueue = engine.getPendingInteractions?.().length > 0;
    const hasActiveDream = !!e.activeDream || !!e.activeNightmare;
    return !hasUnread && !hasPendingChoice && !hasPendingMsgs && !hasPendingQueue && !hasActiveDream;
  }

  const IDLE_MESSAGES = [
    '消息都回完了。出门走走？霓城的街角，说不定有人等你 🚶',
    '现在的你很闲——去「出行」转转，时间会往前走 ✨',
    '手机安静下来了。出门一趟，也许会遇见谁 🌃',
  ];

  function showIdleHint(){
    if(idleHintEl || Date.now() - idleHintLastAt < 10 * 60 * 1000) return;
    idleHintLastAt = Date.now();
    dismissIdleHint();
    idleHintEl = document.createElement('div');
    idleHintEl.className = 'idle-hint';
    idleHintEl.setAttribute('role', 'button');
    idleHintEl.tabIndex = 0;
    idleHintEl.textContent = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
    idleHintEl.onclick = ()=>{
      dismissIdleHint();
      openApp('map');
    };
    idleHintEl.addEventListener('keydown', ev=>{ if(ev.key === 'Enter' || ev.key === ' ') idleHintEl.click(); });
    document.body.appendChild(idleHintEl);
    // 12 秒后自动消失
    setUiTimeout(dismissIdleHint, 12000);
  }

  // 每秒检查一次空窗状态；连续空窗 8 秒触发（避免通知间隙误触）
  function startIdleWatch(){
    if(idleHintTimer) return;
    idleHintTimer = setInterval(()=>{
      const screen = document.querySelector('.screen.active')?.id || '';
      // 只在主屏/锁屏之外的轻打扰：主屏展示，其他 App 内不打扰（玩家正在探索）
      if(isIdleWindow()){
        if(!idleWatchStart) idleWatchStart = Date.now();
        else if(Date.now() - idleWatchStart > 8000 && (screen === 'home-screen')){
          showIdleHint();
          idleWatchStart = null;
        }
      } else {
        idleWatchStart = null;
        dismissIdleHint();
      }
    }, 1000);
  }
  // 游戏加载完成后启动观察（锁屏/结局态自动被 isIdleWindow/屏检测排除）
  startIdleWatch();
