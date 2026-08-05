/* ===== 霓虹心事 · 手机模拟应用入口 ===== */
(function(){
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

  // ===== 全局点击委托 =====
  document.body.addEventListener('click', e=>{
    const appBtn = e.target.closest('[data-app]');
    if(appBtn){ openApp(appBtn.dataset.app); return; }
    const backBtn = e.target.closest('[data-back]');
    if(backBtn){ showScreen(backBtn.dataset.back); return; }
    const convBtn = e.target.closest('[data-conv]');
    if(convBtn){ openConversation(convBtn.dataset.conv); return; }
    const photoBtn = e.target.closest('[data-photo]');
    if(photoBtn){ viewPhoto(photoBtn.dataset.photo); return; }
    const musicBtn = e.target.closest('[data-music]');
    if(musicBtn){ engine.playMusic(musicBtn.dataset.music); return; }
    const restartBtn = e.target.closest('[data-action="restart"]');
    if(restartBtn){
      engine.newGame();
      afterLoadRefresh();
      showScreen('lock');
      return;
    }
    // v0.1.0 存档操作
    const continueBtn = e.target.closest('[data-action="continue-game"]');
    if(continueBtn){
      const ok = engine.continueGame();
      if(ok){
        const restored = afterLoadRefresh();
        toast('已继续游戏');
        if(!restored) showScreen('home');
      } else {
        toast('没有可继续的存档');
      }
      return;
    }
    const openSavesBtn = e.target.closest('[data-action="open-saves"]');
    if(openSavesBtn){ openApp('saves'); return; }
    const saveSlotBtn = e.target.closest('[data-save-action]');
    if(saveSlotBtn){
      handleSaveAction(saveSlotBtn.dataset.saveAction, saveSlotBtn.dataset.slot || '');
      return;
    }
    const callBtn = e.target.closest('[data-call]');
    if(callBtn){ handleCallAction(callBtn.dataset.call); return; }
    const routeBtn = e.target.closest('[data-route]');
    if(routeBtn){ handleRouteChoice(routeBtn.dataset.route); return; }
    // 朋友圈
    const postBtn = e.target.closest('[data-action="post-moment"]');
    if(postBtn){ openPostMoment(); return; }
    const publishBtn = e.target.closest('[data-action="publish-moment"]');
    if(publishBtn){ publishMoment(); return; }
    const artBtn = e.target.closest('[data-moment-art]');
    if(artBtn){ selectMomentArt(artBtn); return; }
    const likeBtn = e.target.closest('[data-moment-like]');
    if(likeBtn){ engine.likeMoment(likeBtn.dataset.momentLike); return; }
    const commentBtn = e.target.closest('[data-moment-comment]');
    if(commentBtn){ toggleCommentOptions(commentBtn.dataset.momentComment); return; }
    const commentOpt = e.target.closest('[data-moment-comment-opt]');
    if(commentOpt){ engine.commentMoment(commentOpt.dataset.momentCommentOpt, parseInt(commentOpt.dataset.optIdx)); return; }
    // 梦境
    const dreamOpt = e.target.closest('[data-dream-opt]');
    if(dreamOpt){ engine.resolveDream(dreamOpt.dataset.dreamOpt, parseInt(dreamOpt.dataset.optIdx)); return; }
    // 自由输入
    const freeSendBtn = e.target.closest('[data-action="free-send"]');
    if(freeSendBtn){ handleFreeSend(); return; }
    // 出行/地点
    const locBtn = e.target.closest('[data-loc]');
    if(locBtn){ goToLocation(locBtn.dataset.loc); return; }
    // 偶遇选项
    const encOpt = e.target.closest('[data-enc-opt]');
    if(encOpt){
      const idx = parseInt(encOpt.dataset.encOpt);
      if(currentEncounter){
        const isMemory = !!currentEncounter.isMemory;
        const resolved = isMemory
          ? engine.resolveMemory(currentEncounter.id, idx)
          : engine.resolveEncounter(currentEncounter, idx);
        if(resolved && !isMemory) setUiTimeout(()=> closeEncounter(), 200);
      }
      return;
    }
    // 关闭偶遇屏
    const closeEncBtn = e.target.closest('[data-action="close-encounter"]');
    if(closeEncBtn){ closeEncounter(); return; }
    // 回忆杀（相册触发）
    const memBtn = e.target.closest('[data-memory]');
    if(memBtn){
      const memId = engine.getMemoriesByPhoto(memBtn.dataset.memory);
      if(memId){
        const ok = engine.triggerMemory(memId);
        if(!ok) toast('这段回忆已经回味过了');
      }
      return;
    }
    // v0.0.9 新玩法
    const shopTab = e.target.closest('[data-shop-tab]');
    if(shopTab){ renderShop(shopTab.dataset.shopTab); return; }
    const buyBtn = e.target.closest('[data-buy]');
    if(buyBtn){ handleBuyGift(buyBtn.dataset.buy); return; }
    const sendGiftBtn = e.target.closest('[data-send-gift]');
    if(sendGiftBtn){ openGiftSendModal(sendGiftBtn.dataset.sendGift); return; }
    const giftCharBtn = e.target.closest('[data-gift-char]');
    if(giftCharBtn){ selectGiftChar(giftCharBtn.dataset.giftChar); return; }
    const giftConfirmBtn = e.target.closest('[data-action="confirm-gift"]');
    if(giftConfirmBtn){ handleConfirmGift(); return; }
    const giftCancelBtn = e.target.closest('[data-action="cancel-gift"]');
    if(giftCancelBtn){ closeGiftSendModal(); return; }
    const moodOpt = e.target.closest('[data-mood-opt]');
    if(moodOpt){ engine.setMood(moodOpt.dataset.moodOpt); renderMood(); return; }
    const diarySubmit = e.target.closest('[data-action="submit-diary"]');
    if(diarySubmit){ handleDiarySubmit(); return; }
    const tarotDraw = e.target.closest('[data-action="draw-tarot"]');
    if(tarotDraw){ handleDrawTarot(); return; }
    // v0.0.10 新玩法
    const collTab = e.target.closest('[data-coll-cat]');
    if(collTab){ renderCollection(collTab.dataset.collCat); return; }
    const puzzleCardBtn = e.target.closest('[data-puzzle]');
    if(puzzleCardBtn){ openPuzzleDetail(puzzleCardBtn.dataset.puzzle); return; }
    const puzzleSubmit = e.target.closest('[data-action="submit-puzzle"]');
    if(puzzleSubmit){ handlePuzzleSubmit(); return; }
    const clueDiscover = e.target.closest('[data-clue]');
    if(clueDiscover){ engine.discoverClue(clueDiscover.dataset.clue); renderPuzzleDetail(currentPuzzleId); return; }
    const perspSceneBtn = e.target.closest('[data-pscene]');
    if(perspSceneBtn){ openPerspectiveScene(perspSceneBtn.dataset.pscene); return; }
    const psceneOpt = e.target.closest('[data-pscene-opt]');
    if(psceneOpt){ handlePsceneOption(parseInt(psceneOpt.dataset.psceneOpt)); return; }
    const truthBtn = e.target.closest('[data-action="show-truth"]');
    if(truthBtn){ showTruthEnding(truthBtn.dataset.charId); return; }
    // v0.0.13 主角档案编辑
    const editPlayerBtn = e.target.closest('[data-action="edit-player"]');
    if(editPlayerBtn){ openPlayerEdit(); return; }
    const cancelEditBtn = e.target.closest('[data-action="cancel-player-edit"]');
    if(cancelEditBtn){ playerEditState = null; showScreen('player'); return; }
    const savePlayerBtn = e.target.closest('[data-action="save-player"]');
    if(savePlayerBtn){ savePlayer(); return; }
    if(handlePlayerEditClick(e.target)){ return; }
    // v0.0.13 每日任务连胜奖励
    const claimStreakBtn = e.target.closest('[data-action="claim-streak"]');
    if(claimStreakBtn){ claimStreakReward(parseInt(claimStreakBtn.dataset.days)); return; }
    // v0.0.13 观赏模式
    const watchToggleBtn = e.target.closest('[data-action="toggle-watch"]');
    if(watchToggleBtn){ toggleWatchMode(); return; }
    const watchStrategyBtn = e.target.closest('[data-watch-strategy]');
    if(watchStrategyBtn){ setWatchStrategy(watchStrategyBtn.dataset.watchStrategy); return; }
    // v0.0.15 主题/约会
    const themeBtn = e.target.closest('[data-theme]');
    if(themeBtn){ handleThemeClick(themeBtn.dataset.theme); return; }
    const iconThemeBtn = e.target.closest('[data-icon-theme]');
    if(iconThemeBtn){ handleIconThemeClick(iconThemeBtn.dataset.iconTheme); return; }
    const dateBtn = e.target.closest('[data-date]');
    if(dateBtn){ handleDateClick(dateBtn.dataset.date); return; }
    const closeDateBtn = e.target.closest('[data-action="close-date"]');
    if(closeDateBtn){ closeDateScene(); return; }
    const finishDateBtn = e.target.closest('[data-action="finish-date"]');
    if(finishDateBtn){ handleFinishDate(finishDateBtn.dataset.finishDate); return; }
    // v0.0.16 梦魇/提示
    const nightmareOptBtn = e.target.closest('[data-nightmare-opt]');
    if(nightmareOptBtn){ handleNightmareOpt(parseInt(nightmareOptBtn.dataset.nightmareOpt)); return; }
    const closeNightmareBtn = e.target.closest('[data-action="close-nightmare"]');
    if(closeNightmareBtn){ closeNightmareScreen(); return; }
    const toggleHintsBtn = e.target.closest('[data-action="toggle-hints"]');
    if(toggleHintsBtn){ toggleOptionHints(); return; }
    const momentReplyBtn = e.target.closest('[data-moment-reply]');
    if(momentReplyBtn){ handleMomentReply(momentReplyBtn.dataset.momentReply); return; }
  });

  function openApp(app){
    switch(app){
      case 'messages': renderConvList(); showScreen('messages'); break;
      case 'phone': renderCallLog(); renderVoicemails(); showScreen('phone'); break;
      case 'moments': renderMoments(); showScreen('moments'); break;
      case 'album': renderAlbum(); showScreen('album'); break;
      case 'calendar': renderCalendar(); showScreen('calendar'); break;
      case 'music': renderMusic(); showScreen('music'); break;
      case 'notes': renderNotes(); showScreen('notes'); break;
      case 'profile': renderProfile(); showScreen('profile'); break;
      case 'map': renderMap(); showScreen('map'); break;
      case 'groups': renderGroupList(); showScreen('groups'); break;
      case 'contacts': renderContacts(); showScreen('contacts'); break;
      case 'shop': renderShop('store'); showScreen('shop'); break;
      case 'mood': renderMood(); showScreen('mood'); break;
      case 'tarot': renderTarot(); showScreen('tarot'); break;
      case 'achievements': renderAchievements(); showScreen('achievements'); break;
      case 'collection': renderCollection('all'); showScreen('collection'); break;
      case 'puzzles': renderPuzzles(); showScreen('puzzles'); break;
      case 'calendar2': renderCalendar2(); showScreen('calendar2'); break;
      case 'perspective': renderPerspective(); showScreen('perspective'); break;
      // v0.0.13 新玩法
      case 'player': renderPlayer(); showScreen('player'); break;
      case 'relations': renderRelations(); showScreen('relations'); break;
      case 'tasks': renderTasks(); showScreen('tasks'); break;
      case 'watch': renderWatch(); showScreen('watch'); break;
      // v0.0.15 新玩法
      case 'affection': renderAffection(); showScreen('affection'); break;
      case 'themes': renderThemes(); showScreen('themes'); break;
      case 'endings': renderEndings(); showScreen('endings'); break;
      case 'dates': renderDates(); showScreen('dates'); break;
      // v0.0.16 新玩法
      case 'dreams': renderDreams(); showScreen('dreams'); break;
      case 'hints': renderHints(); showScreen('hints'); break;
    // v0.1.0 存档
      case 'saves': renderSaves(); showScreen('saves'); break;
    }
  }

  // ===== 出行/地图 =====
  function renderMap(){
    const cur = engine.state.currentLocation || 'home';
    const curLoc = STORY.locations[cur];
    $('map-current-name').textContent = curLoc ? (curLoc.icon + ' ' + curLoc.name) : '未知';
    $('map-current-hint').textContent = curLoc ? curLoc.hint : '';
    const list = $('map-list');
    list.innerHTML = '';
    Object.entries(STORY.locations).forEach(([id, loc])=>{
      const item = document.createElement('button');
      item.className = 'map-item' + (id===cur ? ' current' : '');
      item.dataset.loc = id;
      item.innerHTML = `
        <div class="map-item-icon">${loc.icon}</div>
        <div class="map-item-info">
          <div class="map-item-name">${loc.name}</div>
          <div class="map-item-hint">${loc.hint}</div>
        </div>
        ${id===cur ? '<div class="map-item-tag">当前</div>' : '<div class="map-item-go">前往</div>'}
      `;
      list.appendChild(item);
    });
  }
  function goToLocation(locId){
    if(locId === engine.state.currentLocation){
      // 已在当前地点，仍尝试触发偶遇
      const ok = engine.tryEncounter(locId);
      if(!ok) toast('这里暂时没有新发现…');
      return;
    }
    const hadEncounter = engine.goToLocation(locId);
    renderMap();
    if(!hadEncounter) toast('到了' + (STORY.locations[locId]?.name || '') + '，没什么特别的');
  }

  // ===== 偶遇/回忆剧情屏 =====
  let currentEncounter = null;
  function showEncounter(enc){
    currentEncounter = enc;
    $('encounter-title').textContent = enc.title;
    $('encounter-desc').textContent = enc.desc;
    const opts = $('encounter-options');
    opts.innerHTML = '';
    if(enc.choice){
      enc.choice.options.forEach((opt, i)=>{
        const btn = document.createElement('button');
        btn.className = 'dream-opt';
        btn.innerHTML = opt.text + (opt.hint?` <span style="color:var(--ink-mute);font-size:11px">(${opt.hint})</span>`:'');
        btn.dataset.encOpt = i;
        opts.appendChild(btn);
      });
    } else {
      // 无选择，加一个"继续"按钮
      const btn = document.createElement('button');
      btn.className = 'dream-opt';
      btn.textContent = '继续';
      btn.dataset.encOpt = '0';
      opts.appendChild(btn);
    }
    showScreen('encounter');
  }
  function closeEncounter(){
    if(currentEncounter && !currentEncounter.isMemory){
      engine.cancelPendingInteraction(currentEncounter);
    }
    currentEncounter = null;
    showScreen('map');
  }

  // ===== 消息列表 =====
  function renderConvList(){
    const list = $('conv-list');
    list.innerHTML = '';
    const convs = engine.state.conversations;
    const visibleConvs = Object.entries(convs).filter(([id,c])=> c.messages.length > 0 || id==='susu');
    visibleConvs.sort((a,b)=>{
      if(a[1].unread !== b[1].unread) return b[1].unread - a[1].unread;
      const aLast = a[1].messages[a[1].messages.length-1];
      const bLast = b[1].messages[b[1].messages.length-1];
      return (bLast?.ts||0) - (aLast?.ts||0);
    });
    visibleConvs.forEach(([id, conv])=>{
      const char = STORY.characters[id];
      if(!char) return;
      const last = conv.messages[conv.messages.length-1];
      const item = document.createElement('div');
      item.className = 'conv-item' + (conv.unread>0?' unread':'');
      item.dataset.conv = id;
      const preview = last ? (last.from==='me'?'你: ':'') + last.text : '暂无消息';
      item.innerHTML = `
        <div class="conv-avatar" style="background:${char.bg}">${char.avatar}</div>
        <div class="conv-info">
          <div class="conv-top">
            <span class="conv-name">${char.name}</span>
            <span class="conv-time">${last?.time || ''}</span>
          </div>
          <div class="conv-preview">${conv.typing?'<span style="color:var(--accent)">正在输入…</span>':preview}</div>
        </div>
        ${conv.unread>0?`<span class="conv-unread">${conv.unread}</span>`:''}
      `;
      list.appendChild(item);
    });
    updateBadges();
  }

  function updateBadges(){
    let totalMsg = 0;
    Object.values(engine.state.conversations).forEach(c=> totalMsg += c.unread);
    const badge = $('badge-messages');
    if(totalMsg > 0){
      badge.textContent = totalMsg;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
    // v0.0.15 结局图鉴/约会徽章
    updateEndingsBadge();
    updateDatesBadge();
    // v0.0.16 梦魇徽章
    updateDreamsBadge();
    // v0.1.0 存档徽章
    updateSavesBadge();
  }
  function updateDreamsBadge(){
    const b = $('badge-dreams');
    if(!b) return;
    if(!engine.state.nightmaresSeen) return;
    const seenCount = Object.keys(engine.state.nightmaresSeen).filter(k=>engine.state.nightmaresSeen[k]).length;
    if(seenCount > 0){
      b.textContent = seenCount;
      b.hidden = false;
    } else {
      b.hidden = true;
    }
    const counter = $('dreams-counter');
    const total = Object.keys(STORY.nightmares||{}).length;
    if(counter && total){
      counter.textContent = `${seenCount}/${total}`;
    }
  }
  function updateEndingsBadge(){
    const b = $('badge-endings');
    if(!b) return;
    const all = engine.getEndingGallery ? engine.getEndingGallery() : [];
    const seenCount = all.filter(e=>e.seen).length;
    if(seenCount > 0){
      b.textContent = seenCount;
      b.hidden = false;
    } else {
      b.hidden = true;
    }
    const counter = $('endings-counter');
    if(counter && all.length){
      counter.textContent = `${seenCount}/${all.length}`;
    }
  }
  function updateDatesBadge(){
    const b = $('badge-dates');
    if(!b) return;
    if(!engine.getDateStats) return;
    const stats = engine.getDateStats();
    const availableCount = stats.filter(s=>s.canDate && s.availableScenes.length > 0).length;
    if(availableCount > 0){
      b.textContent = availableCount;
      b.hidden = false;
    } else {
      b.hidden = true;
    }
  }

  // ===== 单个会话 =====
  function openConversation(convId){
    currentConvId = convId;
    const char = STORY.characters[convId];
    const conv = engine.state.conversations[convId];
    if(!char || !conv) return;
    $('chat-avatar').textContent = char.avatar;
    $('chat-avatar').style.background = char.bg;
    $('chat-name').textContent = char.name;
    $('chat-status').textContent = conv.typing ? '正在输入…' : '在线';
    renderChatBody(convId);
    engine.markRead(convId);
    updateBadges();
    // 关闭可能存在的旧选项栏
    $('chat-input-bar').hidden = true;
    showScreen('chat');
    // 如果有待处理选项，立即显示
    if(conv.pendingChoice){
      setUiTimeout(()=> showChatChoice(convId, conv.pendingChoice), 400);
    }
    setUiTimeout(()=>{
      const body = $('chat-body');
      body.scrollTop = body.scrollHeight;
    }, 50);
  }

  function renderChatBody(convId){
    const conv = engine.state.conversations[convId];
    const body = $('chat-body');
    body.innerHTML = '';
    conv.messages.forEach(m=> appendMessage(m));
    if(conv.typing){
      const t = document.createElement('div');
      t.className = 'typing-indicator';
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
    }
    body.scrollTop = body.scrollHeight;
  }

  function appendMessage(m){
    const body = $('chat-body');
    const div = document.createElement('div');
    if(m.from === 'me'){
      div.className = 'msg send';
      div.textContent = m.text;
    } else if(m.from === 'narrator'){
      div.className = 'msg sys';
      div.textContent = m.text;
    } else {
      div.className = 'msg recv' + (m.isFollowup ? ' is-followup' : '');
      div.textContent = m.text;
    }
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = m.time || '';
    div.appendChild(time);
    body.appendChild(div);
  }

  // ===== 引擎事件 =====
  engine.on('stateChange', ()=>{
    updateBadges();
    if(screens.messages.classList.contains('active')) renderConvList();
    updateMomentsBadge();
  });
  engine.on('timeChange', updateTimeDisplay);
  engine.on('conversationUpdate', ({id, conv})=>{
    updateBadges();
    if(screens.messages.classList.contains('active')) renderConvList();
    if(currentConvId === id && screens.chat.classList.contains('active')){
      renderChatBody(id);
      $('chat-status').textContent = conv.typing ? '正在输入…' : '在线';
    }
  });
  engine.on('messageReceived', ({from, text})=>{
    if(from === 'narrator'){
      // 旁白以 toast 展示
      toast(text);
      return;
    }
    showNotif(from, text);
  });

  // 选项触发：若玩家正在该会话则立即显示，否则 engine 已挂起 pendingChoice
  engine.on('choicePrompt', ({convId, choice, conv})=>{
    // v0.0.13 观赏模式：自动选择（用 engine._setTimeout 集中管理，读档/关闭时清理）
    if(engine.state.watchMode && choice.options && choice.options.length > 0 && !choice.isInvitation){
      const autoIdx = engine.pickAutoChoice(choice.options);
      const autoOpt = choice.options[autoIdx];
      const delay = STORY.watchMode?.autoAdvanceDelay || 1500;
      engine._setTimeout(()=>{
        // 二次校验：定时器触发时观赏模式仍开启才执行
        if(!engine.state.watchMode) return;
        if(conv){ conv.pendingChoice = null; }
        engine.sendMessage(convId, autoOpt.text, engine.normalizeOptionEffects(autoOpt));
        toast(`🎬 观赏自动选：${autoOpt.text}`);
      }, delay);
      return;
    }
    if(convId === 'narrator'){
      // 旁白决策：直接弹模态框
      showNarratorChoice(choice);
    } else if(currentConvId === convId && screens.chat.classList.contains('active')){
      showChatChoice(convId, choice);
    } else {
      // 给个提示通知
      showNotif(convId, choice.prompt);
    }
  });

  function showNarratorChoice(choice){
    let modal = document.getElementById('narrator-choice-modal');
    if(modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'narrator-choice-modal';
    modal.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:160;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:32px;animation:screenIn .4s ease;';
    modal.innerHTML = `
      <div style="font-family:var(--serif);font-size:15px;color:var(--ink-dim);margin-bottom:20px;text-align:center;line-height:1.9;letter-spacing:0.05em;max-width:300px;">
        ${escapeHtml(choice.prompt)}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
        ${choice.options.map((opt, i)=>`
          <button class="chat-opt" data-narrator-choice="${i}" style="padding:14px;">
            ${escapeHtml(opt.text)}
            ${opt.hint?`<span style="color:var(--ink-mute);font-size:11px;display:block;margin-top:4px;">${escapeHtml(opt.hint)}</span>`:''}
          </button>
        `).join('')}
      </div>
    `;
    screens.home.appendChild(modal);
    modal.querySelectorAll('[data-narrator-choice]').forEach(btn=>{
      btn.onclick = (e)=>{
        e.stopPropagation();
        const idx = parseInt(btn.dataset.narratorChoice);
        const opt = choice.options[idx];
        modal.remove();
        engine.sendMessage('narrator', opt.text, opt.effects);
      };
    });
  }

  function showChatChoice(convId, choice){
    const bar = $('chat-input-bar');
    $('chat-prompt').textContent = choice.prompt;
    const opts = $('chat-options');
    const timeoutBar = $('chat-timeout-bar');
    const freeInput = $('chat-free-input');
    opts.innerHTML = '';
    // 清除之前的计时器
    if(timeoutTimer){ clearTimeout(timeoutTimer); timeoutTimer = null; }
    timeoutBar.hidden = true;
    freeInput.hidden = true;

    // 自由输入模式
    if(choice.freeInput){
      opts.hidden = true;
      freeInput.hidden = false;
      const field = $('chat-free-input-field');
      field.value = '';
      field.placeholder = choice.freeInput.placeholder || '输入你想说的话…';
      field.focus();
      $('chat-free-input-field').dataset.convId = convId;
      $('chat-free-input-field').dataset.keywords = JSON.stringify(choice.freeInput.keywords || []);
      $('chat-free-input-field').dataset.defaultEffect = JSON.stringify(choice.freeInput.defaultEffect || {});
      // 限时
      if(choice.timeout){
        startTimeout(choice.timeout, ()=> handleFreeSend(true));
      }
      return;
    }

    // 普通选项模式
    opts.hidden = false;
    choice.options.forEach((opt)=>{
      const btn = document.createElement('button');
      btn.className = 'chat-opt';
      // v0.0.16: 当 showOptionHints 开启时，追加智能提示
      const smartHint = engine.getOptionHint(opt);
      const hintHtml = opt.hint ? ` <span style="color:var(--ink-mute);font-size:11px">(${escapeHtml(opt.hint)})</span>` : '';
      const smartHintHtml = smartHint ? ` <span class="chat-opt-smart-hint">💡 ${escapeHtml(smartHint)}</span>` : '';
      btn.innerHTML = escapeHtml(opt.text) + hintHtml + smartHintHtml;
      btn.onclick = (e)=>{
        e.stopPropagation();
        if(timeoutTimer){ clearTimeout(timeoutTimer); timeoutTimer = null; }
        const conv = engine.state.conversations[convId];
        if(conv) conv.pendingChoice = null;
        engine.sendMessage(convId, opt.text, mergeOptionEffects(opt));
        bar.hidden = true;
      };
      opts.appendChild(btn);
    });
    bar.hidden = false;

    // 限时回复
    if(choice.timeout){
      startTimeout(choice.timeout, ()=>{
        // 超时自动选择默认项（最后一个或标记为 default 的）
        const defaultIdx = choice.options.findIndex(o=>o.default) !== -1
          ? choice.options.findIndex(o=>o.default)
          : choice.options.length - 1;
        const opt = choice.options[defaultIdx];
        const conv = engine.state.conversations[convId];
        if(conv) conv.pendingChoice = null;
        engine.sendMessage(convId, opt.text, mergeOptionEffects(opt));
        bar.hidden = true;
        toast('（沉默）');
      });
    }
  }

  function startTimeout(seconds, onTimeout){
    const bar = $('chat-timeout-bar');
    const fill = $('chat-timeout-fill');
    const text = $('chat-timeout-text');
    bar.hidden = false;
    bar.classList.remove('urgent');
    const total = seconds * 1000;
    const start = Date.now();
    function tick(){
      const elapsed = Date.now() - start;
      const remain = Math.max(0, total - elapsed);
      const pct = (remain / total) * 100;
      fill.style.width = pct + '%';
      text.textContent = Math.ceil(remain / 1000) + 's';
      if(remain < seconds * 1000 * 0.3) bar.classList.add('urgent');
      if(remain <= 0){
        timeoutTimer = null;
        onTimeout();
        return;
      }
      timeoutTimer = setUiTimeout(tick, 100);
    }
    tick();
  }

  function safeJSON(str, fallback){
    try { return JSON.parse(str); } catch(e){ return fallback; }
  }
  function handleFreeSend(isTimeout){
    const field = $('chat-free-input-field');
    const text = field.value.trim();
    const convId = field.dataset.convId;
    if(!convId) return;
    const keywords = safeJSON(field.dataset.keywords || '[]', []);
    const defaultEffect = safeJSON(field.dataset.defaultEffect || '{}', {});
    const bar = $('chat-input-bar');
    if(timeoutTimer){ clearTimeout(timeoutTimer); timeoutTimer = null; }
    const conv = engine.state.conversations[convId];
    if(conv) conv.pendingChoice = null;
    // 关键词匹配
    let matched = null;
    if(text){
      for(const kw of keywords){
        if(kw.words && kw.words.some(w=> text.includes(w))){
          matched = kw;
          break;
        }
      }
    }
    const finalText = text || '……';
    const finalEffects = matched ? {...(matched.effects||{})} : {...defaultEffect};
    engine.sendMessage(convId, finalText, finalEffects);
    bar.hidden = true;
    if(matched && matched.reply){
      setUiTimeout(()=> toast(matched.reply), 1200);
    }
  }

  function showTimeAdvanceOverlay(text){
    $('time-adv-text').textContent = text || '时间流逝…';
    $('time-adv').hidden = false;
  }
  engine.on('timeAdvance', ({text})=>{
    showTimeAdvanceOverlay(text);
  });
  engine.on('timeAdvanceEnd', ()=>{
    $('time-adv').hidden = true;
    updateTimeDisplay();
  });

  // ===== 来电 =====
  function showIncomingCall({from, name, script, eventId}){
    const char = STORY.characters[from];
    $('call-name').textContent = name;
    $('call-bg').style.background = `radial-gradient(ellipse at center, ${char?.bg || '#2a2f5a'}, #000)`;
    $('call-label').textContent = '来电…';
    $('call-actions').hidden = false;
    $('call-timer').hidden = true;
    $('call-script').hidden = true;
    showScreen('incomingCall');
    window._currentCall = {from, name, script, eventId, step:0};
  }
  engine.on('incomingCall', (call)=>{
    showIncomingCall(call);
  });

  function handleCallAction(action){
    const call = window._currentCall;
    if(!call) return;
    if(action === 'accept'){
      engine.answerCall(call.eventId);
      $('call-actions').hidden = true;
      $('call-label').textContent = '通话中';
      $('call-timer').hidden = false;
      $('call-script').hidden = false;
      engine.addCallLog(call.from, 'incoming', '03:24');
      runCallScript(call);
    } else if(action === 'decline'){
      engine.declineCall(call.eventId);
      window._currentCall = null;
      showScreen('home');
      toast('已挂断');
    }
  }

  function runCallScript(call){
    const scriptEl = $('call-script');
    scriptEl.innerHTML = '';
    call.step = 0;
    function nextStep(){
      if(call.step >= call.script.length){
        // 通话结束：触发后续事件（通过 engine 的 afterEvent 链）
        $('call-label').textContent = '通话结束';
        const evt = engine.story.events[call.eventId];
        setUiTimeout(()=>{
          showScreen('home');
          window._currentCall = null;
          if(evt && evt.then) engine.scheduleEvent(evt.then);
        }, 1500);
        return;
      }
      const line = call.script[call.step];
      if(line.who === 'choice'){
        const choices = document.createElement('div');
        choices.className = 'choices';
        line.options.forEach((opt)=>{
          const btn = document.createElement('button');
          btn.textContent = opt.text;
          btn.onclick = (e)=>{
            e.stopPropagation();
            engine.applyEffects(mergeOptionEffects(opt));
            choices.remove();
            // 防御：then:0 视为"继续下一步"，避免无限循环
            call.step = (typeof opt.then === 'number' && opt.then > 0) ? opt.then : call.step + 1;
            nextStep();
          };
          choices.appendChild(btn);
        });
        scriptEl.appendChild(choices);
        scriptEl.scrollTop = scriptEl.scrollHeight;
      } else {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'line';
        const speaker = line.who === 'me' ? `<span class="you">你：</span>` : `<span class="speaker">${call.name}：</span>`;
        lineDiv.innerHTML = speaker + escapeHtml(line.text);
        scriptEl.appendChild(lineDiv);
        scriptEl.scrollTop = scriptEl.scrollHeight;
        call.step++;
        setUiTimeout(nextStep, 1100);
      }
    }
    nextStep();
  }

  // ===== 相册 =====
  function renderAlbum(){
    const grid = $('album-grid');
    grid.innerHTML = '';
    const allPhotos = Object.keys(STORY.photos);
    allPhotos.forEach(pid=>{
      const unlocked = engine.state.photos.find(p=>p.id===pid);
      const item = document.createElement('div');
      item.className = 'album-item' + (unlocked?'':' locked');
      item.dataset.photo = pid;
      if(unlocked){
        const p = STORY.photos[pid];
        item.innerHTML = getPhotoArt(p.art);
      } else {
        item.innerHTML = '?';
      }
      grid.appendChild(item);
    });
    if(allPhotos.length === 0){
      grid.innerHTML = '<div style="color:var(--ink-mute);text-align:center;padding:40px;grid-column:1/-1;">暂无照片</div>';
    }
  }
  function escapeHtml(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function nl2brEscaped(s){
    return escapeHtml(s).replace(/\n/g, '<br>');
  }
  function mergeOptionEffects(opt){
    return engine.normalizeOptionEffects ? engine.normalizeOptionEffects(opt) : {...(opt?.effects||{})};
  }
  function viewPhoto(pid){
    const p = STORY.photos[pid];
    if(!p) return;
    const unlocked = engine.state.photos.find(x=>x.id===pid);
    if(!unlocked){ toast('照片未解锁'); return; }
    $('photo-bg').style.background = `linear-gradient(135deg, #1a0a2e, #0a0712)`;
    $('photo-art').innerHTML = getPhotoArt(p.art, true);
    // 检查是否有回忆可触发
    const memId = engine.getMemoriesByPhoto(pid);
    const hasMemory = memId && !engine.state.resolvedMemories[memId];
    const memBtn = hasMemory
      ? `<button class="photo-memory-btn" data-memory="${escapeHtml(pid)}">✦ 回味这段回忆</button>`
      : (memId ? '<div class="photo-memory-done">回忆已回味</div>' : '');
    $('photo-caption').innerHTML = `<strong>${escapeHtml(p.title)}</strong><br>${escapeHtml(p.caption).replace(/\n/g,'<br>')}${memBtn}`;
    showScreen('photoView');
  }
  function getPhotoArt(type){
    const arts = {
      city:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0a0712"/>
        <rect x="20" y="80" width="20" height="120" fill="#1a1f3a"/>
        <rect x="45" y="60" width="25" height="140" fill="#2a1f4a"/>
        <rect x="75" y="40" width="30" height="160" fill="#1a2f4a"/>
        <rect x="110" y="70" width="22" height="130" fill="#2a1f3a"/>
        <rect x="135" y="50" width="28" height="150" fill="#1a1f4a"/>
        <rect x="165" y="85" width="18" height="115" fill="#2a2f4a"/>
        <g fill="#ff5fa8"><rect x="25" y="90" width="3" height="3"/><rect x="32" y="100" width="3" height="3"/><rect x="27" y="110" width="3" height="3"/></g>
        <g fill="#7a5cff"><rect x="50" y="70" width="3" height="3"/><rect x="58" y="85" width="3" height="3"/><rect x="52" y="95" width="3" height="3"/></g>
        <g fill="#39d6ff"><rect x="80" y="50" width="3" height="3"/><rect x="90" y="65" width="3" height="3"/><rect x="85" y="80" width="3" height="3"/></g>
        <text x="100" y="195" text-anchor="middle" fill="#7d6e99" font-size="9" font-family="monospace">霓城 · 夜</text>
      </svg>`,
      rooftop:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1845"/><stop offset="1" stop-color="#0a0712"/></linearGradient></defs>
        <rect width="200" height="200" fill="url(#rsky)"/>
        <rect x="0" y="140" width="200" height="60" fill="#0a0712"/>
        <rect x="10" y="120" width="30" height="20" fill="#1a1f2a"/>
        <rect x="45" y="110" width="35" height="30" fill="#1f1a2a"/>
        <rect x="85" y="100" width="40" height="40" fill="#2a1f3a"/>
        <rect x="130" y="115" width="30" height="25" fill="#1a1f2a"/>
        <rect x="165" y="125" width="25" height="15" fill="#1f1a2a"/>
        <g fill="#fff"><circle cx="30" cy="30" r="1"/><circle cx="70" cy="20" r="1.5"/><circle cx="120" cy="35" r="1"/><circle cx="160" cy="25" r="1.5"/><circle cx="180" cy="45" r="1"/></g>
        <g fill="#ff5fa8"><rect x="20" y="125" width="2" height="2"/><rect x="55" y="118" width="2" height="2"/><rect x="95" y="110" width="2" height="2"/><rect x="140" y="122" width="2" height="2"/></g>
        <text x="100" y="195" text-anchor="middle" fill="#7d6e99" font-size="9" font-family="monospace">天台 · 灯海</text>
      </svg>`,
      album:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#1a1420"/>
        <rect x="20" y="20" width="160" height="160" fill="#2a2030" rx="4"/>
        <rect x="30" y="30" width="140" height="100" fill="#0a0712"/>
        <g fill="#4a3a5a"><rect x="40" y="45" width="20" height="15"/><rect x="65" y="45" width="20" height="15"/><rect x="90" y="45" width="20" height="15"/><rect x="115" y="45" width="20" height="15"/><rect x="140" y="45" width="20" height="15"/></g>
        <g fill="#5a4a6a"><rect x="40" y="65" width="20" height="15"/><rect x="65" y="65" width="20" height="15"/><rect x="90" y="65" width="20" height="15"/><rect x="115" y="65" width="20" height="15"/><rect x="140" y="65" width="20" height="15"/></g>
        <g fill="#3a2a4a"><rect x="40" y="85" width="20" height="15"/><rect x="65" y="85" width="20" height="15"/><rect x="90" y="85" width="20" height="15"/><rect x="115" y="85" width="20" height="15"/><rect x="140" y="85" width="20" height="15"/></g>
        <text x="100" y="155" text-anchor="middle" fill="#ff5fa8" font-size="11" font-family="serif">九年</text>
        <text x="100" y="172" text-anchor="middle" fill="#7d6e99" font-size="8" font-family="monospace">明天就告白</text>
      </svg>`,
      studio:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1838"/><stop offset="1" stop-color="#0a0712"/></linearGradient></defs>
        <rect width="200" height="200" fill="url(#sky)"/>
        <polygon points="60,40 140,40 160,80 40,80" fill="#2a2545" stroke="#3a3555" stroke-width="1"/>
        <rect x="40" y="80" width="120" height="100" fill="#1a1525"/>
        <rect x="70" y="92" width="60" height="50" fill="#0f0a18" stroke="#3a3050" stroke-width="1"/>
        <rect x="72" y="94" width="56" height="46" fill="#2a2540"/>
        <ellipse cx="100" cy="135" rx="14" ry="20" fill="#1a1530" opacity="0.8"/>
        <ellipse cx="100" cy="138" rx="10" ry="16" fill="#0a0712"/>
        <g fill="#7a5cff" opacity="0.6"><circle cx="78" cy="110" r="1"/><circle cx="122" cy="105" r="1"/><circle cx="85" cy="125" r="1"/></g>
        <rect x="50" y="150" width="100" height="3" fill="#2a2545"/>
        <g fill="#fff" opacity="0.7"><circle cx="70" cy="30" r="0.8"/><circle cx="130" cy="22" r="1"/><circle cx="100" cy="18" r="0.8"/></g>
        <text x="100" y="178" text-anchor="middle" fill="#7d6e99" font-size="9" font-family="monospace">私人画室 · 月光</text>
        <text x="100" y="192" text-anchor="middle" fill="#7a5cff" font-size="8" font-family="serif">三年的画</text>
      </svg>`,
      school:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a4a"/><stop offset="1" stop-color="#1a1525"/></linearGradient></defs>
        <rect width="200" height="200" fill="url(#ssky)"/>
        <rect x="0" y="140" width="200" height="60" fill="#2a2035"/>
        <polygon points="40,100 80,70 120,70 160,100 160,140 40,140" fill="#2a2540" stroke="#3a3555" stroke-width="1"/>
        <rect x="50" y="105" width="20" height="25" fill="#1a1830"/>
        <rect x="80" y="105" width="20" height="25" fill="#1a1830"/>
        <rect x="110" y="105" width="20" height="25" fill="#1a1830"/>
        <rect x="140" y="105" width="15" height="25" fill="#1a1830"/>
        <g fill="#fbbf24" opacity="0.6"><rect x="55" y="112" width="10" height="8"/><rect x="85" y="112" width="10" height="8"/><rect x="115" y="112" width="10" height="8"/></g>
        <rect x="0" y="155" width="200" height="3" fill="#3a2a4a"/>
        <circle cx="30" cy="160" r="8" fill="#3a4a2a"/>
        <circle cx="30" cy="158" r="6" fill="#4a5a3a"/>
        <rect x="155" y="148" width="6" height="20" fill="#3a2a2a"/>
        <circle cx="158" cy="148" r="5" fill="#7a5cff" opacity="0.7"/>
        <g fill="#fbbf24" opacity="0.4"><circle cx="50" cy="30" r="1"/><circle cx="100" cy="20" r="1.2"/><circle cx="150" cy="35" r="0.8"/></g>
        <text x="100" y="178" text-anchor="middle" fill="#7d6e99" font-size="9" font-family="monospace">旧学校 · 银杏</text>
        <text x="100" y="192" text-anchor="middle" fill="#4ade80" font-size="8" font-family="serif">九年又一百八十二天</text>
      </svg>`
    };
    return arts[type] || `<svg viewBox="0 0 200 200"><rect width="200" height="200" fill="#1a1420"/><text x="100" y="100" text-anchor="middle" fill="#7d6e99" font-size="14">？</text></svg>`;
  }

  // ===== 日历 =====
  function renderCalendar(){
    const t = engine.getTime();
    const d = engine.getDateLabel();
    $('cal-current').innerHTML = `
      <div class="cc-day">${d.date}</div>
      <div class="cc-month">${d.month}月</div>
      <div class="cc-weekday">星期${d.weekday}</div>
    `;
    const events = $('cal-events');
    events.innerHTML = '';
    const defaultEvents = [
      {time:'09:00', title:'美术馆报到', loc:'砚美术馆', day:2},
      {time:'10:00', title:'开幕式筹备', loc:'美术馆会议室', day:3},
      {time:'19:00', title:'开幕式', loc:'砚美术馆展厅', day:5},
      {time:'22:00', title:'雾港酒吧', loc:'巷子深处', day:2}
    ];
    const visible = defaultEvents.filter(e=>e.day <= t.day);
    if(visible.length === 0){
      events.innerHTML = '<div style="color:var(--ink-mute);text-align:center;padding:40px;">今日暂无日程</div>';
      return;
    }
    visible.forEach(e=>{
      const div = document.createElement('div');
      div.className = 'cal-event' + (e.day < t.day ? ' past':'');
      div.innerHTML = `
        <div class="ce-time">${e.time}</div>
        <div class="ce-title">${e.title}</div>
        <div class="ce-loc">${e.loc}</div>
      `;
      events.appendChild(div);
    });
  }

  // ===== 音乐 =====
  function renderMusic(){
    const playlist = $('music-playlist');
    playlist.innerHTML = '';
    const unlocked = engine.state.music.unlocked;
    const playing = engine.state.music.playing;
    Object.entries(STORY.music).forEach(([id, m])=>{
      const isUnlocked = unlocked.includes(id);
      const isPlaying = playing === id;
      const item = document.createElement('div');
      item.className = 'music-item' + (isPlaying?' playing':'') + (isUnlocked?'':' locked');
      item.dataset.music = id;
      item.innerHTML = `
        <span class="mi-num">${isPlaying?'▶':(Object.keys(STORY.music).indexOf(id)+1)}</span>
        <span class="mi-title">${m.title}</span>
        <span class="mi-dur">${m.duration}</span>
      `;
      playlist.appendChild(item);
    });
    if(playing){
      const m = STORY.music[playing];
      $('np-title').textContent = m.title;
      $('np-artist').textContent = m.artist;
      $('np-art').classList.add('playing');
      $('np-art').textContent = '♪';
    } else {
      $('np-title').textContent = '未播放';
      $('np-artist').textContent = '—';
      $('np-art').classList.remove('playing');
    }
  }

  // ===== 备忘录 =====
  function renderNotes(){
    const list = $('notes-list');
    list.innerHTML = '';
    if(engine.state.notes.length === 0){
      const notes = [
        {title:'入职第一天', preview:'1. 9点前到美术馆\n2. 找人事办手续\n3. 沈砚之——主理人，据说难搞', time:'7月16日'}
      ];
      notes.forEach(n=>{
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `
          <div class="ni-title">${escapeHtml(n.title)}</div>
          <div class="ni-preview">${nl2brEscaped(n.preview)}</div>
          <div class="ni-date">${escapeHtml(n.time)}</div>
        `;
        list.appendChild(div);
      });
    } else {
      engine.state.notes.forEach(n=>{
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `
          <div class="ni-title">${escapeHtml(n.title)}</div>
          <div class="ni-preview">${nl2brEscaped(n.preview||'')}</div>
          <div class="ni-date">${escapeHtml(n.time)}</div>
        `;
        list.appendChild(div);
      });
    }
  }

  // ===== 通话记录 =====
  function renderCallLog(){
    const list = $('call-list');
    list.innerHTML = '';
    if(engine.state.callLog.length === 0){
      list.innerHTML = '<div style="color:var(--ink-mute);text-align:center;padding:40px;">暂无通话记录</div>';
      return;
    }
    engine.state.callLog.forEach(c=>{
      const char = STORY.characters[c.from];
      const div = document.createElement('div');
      div.className = 'call-item';
      const typeText = c.type==='incoming'?'已接来电':c.type==='missed'?'未接来电':'已拨出';
      div.innerHTML = `
        <div class="call-avatar" style="background:${char?.bg||'#2a2f5a'}">${char?.avatar||'?'}</div>
        <div class="call-info">
          <div class="call-name">${escapeHtml(c.name)}</div>
          <div class="call-meta">${escapeHtml(typeText)} · ${escapeHtml(c.duration)}</div>
        </div>
        <div class="call-type ${escapeHtml(c.type)}">${escapeHtml(c.time)}</div>
      `;
      list.appendChild(div);
    });
  }

  // ===== 结局 =====
  engine.on('ending', (ending)=>{
    $('ending-tag').textContent = ending.tag || 'END';
    $('ending-title').textContent = ending.title || '';
    $('ending-text').textContent = ending.text || '';
    $('ending-bg').style.background = 'linear-gradient(135deg, #1a0a2e, #0a0712)';
    showScreen('ending');
  });

  // ===== 路线选择 =====
  engine.on('routeChoiceReady', (routeChoice)=>{
    if(currentNightmare || engine.state.activeNightmare){
      return;
    }
    showRouteChoiceModal(routeChoice);
  });

  function showRouteChoiceModal(routeChoice){
    // 先回主屏
    showScreen('home');
    const home = $('home-screen');
    let modal = document.getElementById('route-choice-modal');
    if(modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'route-choice-modal';
    modal.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:160;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:32px;animation:screenIn .4s ease;';
    modal.innerHTML = `
      <div style="font-family:var(--serif);font-size:17px;color:var(--ink-dim);margin-bottom:24px;text-align:center;line-height:1.9;letter-spacing:0.05em;">
        ${escapeHtml(routeChoice.prompt)}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
        ${routeChoice.options.map((opt)=>`
          <button class="chat-opt" data-route="${opt.route}" style="padding:14px;">
            ${escapeHtml(opt.text)}
            <span style="color:var(--ink-mute);font-size:11px;display:block;margin-top:4px;">${escapeHtml(opt.hint)}</span>
          </button>
        `).join('')}
      </div>
    `;
    home.appendChild(modal);
  }

  function handleRouteChoice(route){
    const modal = document.getElementById('route-choice-modal');
    if(modal) modal.remove();
    const opt = STORY.routeChoice.options.find(o=>o.route===route);
    if(!opt) return;
    engine.chooseRoute(route);
    toast(`进入${STORY.characters[route]?.name || '真结局'}线`);
  }

  // ===== 朋友圈 =====
  function renderMoments(){
    const list = $('moments-list');
    list.innerHTML = '';
    if(engine.state.moments.length === 0){
      list.innerHTML = '<div class="moments-empty">还没有动态<br>点击右上角 📷 发一条</div>';
      return;
    }
    engine.state.moments.forEach(m=>{
      const inter = engine.state.momentInteractions[m.id] || {};
      const item = document.createElement('div');
      item.className = 'moment-item';
      item.dataset.momentId = m.id;
      const safeMomentId = escapeHtml(m.id);
      // 点赞列表
      const likeNames = m.likes.map(l=>{
        if(l === 'me') return '我';
        const c = STORY.characters[l];
        return c ? c.name : l;
      }).join('、');
      // 评论列表
      const commentsHtml = m.comments.map(c=>{
        const char = STORY.characters[c.from];
        const name = c.from === 'me' ? '我' : (char ? char.name : c.from);
        return `<div class="moment-comment ${c.from==='me'?'me':''} ${c.isReply?'reply':''}">
          <span class="mc-name">${escapeHtml(name)}</span>${escapeHtml(c.text)}
        </div>`;
      }).join('');
      // 评论选项
      let commentOptsHtml = '';
      if(m.commentOptions && !inter.commented){
        commentOptsHtml = `<div class="moment-comment-options" id="opts-${safeMomentId}" hidden>
          ${m.commentOptions.map((opt,i)=>`<button class="moment-comment-opt" data-moment-comment-opt="${safeMomentId}" data-opt-idx="${i}">${escapeHtml(opt.text)}</button>`).join('')}
        </div>`;
      }
      // v0.0.16: 男主朋友圈互动评论 + 回复选项
      const charCommentsHtml = (m.charComments || []).map(cc => {
        const char = STORY.characters[cc.charId];
        const charName = char ? char.name : cc.charId;
        const replyKey = `${m.id}_${cc.charId}`;
        const sentReply = engine.state.momentReplies?.[replyKey];
        const comment = cc.comment;
        let replyOptsHtml = '';
        if(comment.replyOptions && !sentReply){
          replyOptsHtml = '<div class="moment-reply-options">';
          comment.replyOptions.forEach((rp, ri) => {
            replyOptsHtml += `<button class="moment-reply-opt" data-moment-reply="${safeMomentId}|${escapeHtml(cc.charId)}|${cc.commentIdx}|${ri}">${escapeHtml(rp.text)}</button>`;
          });
          replyOptsHtml += '</div>';
        } else if(sentReply){
          const sent = comment.replyOptions?.[sentReply.replyIdx];
          replyOptsHtml = `<div class="moment-reply-options"><span class="moment-reply-opt sent">已回复：${escapeHtml(sent?.text || '')}</span></div>`;
        }
        return `<div class="moment-char-comment">
          <span class="moment-char-comment-name">${escapeHtml(charName)}：</span>
          <span class="moment-char-comment-text">${escapeHtml(comment.text)}</span>
          ${replyOptsHtml}
        </div>`;
      }).join('');
      const charCommentsBlock = charCommentsHtml ? `<div class="moment-char-comments">${charCommentsHtml}</div>` : '';
      item.innerHTML = `
        <div class="moment-top">
          <div class="moment-avatar" style="background:${escapeHtml(m.bg)}">${escapeHtml(m.avatar)}</div>
          <div class="moment-body">
            <div class="moment-name">${escapeHtml(m.name)}</div>
            <div class="moment-text">${nl2brEscaped(m.text)}</div>
            ${m.art ? `<div class="moment-art">${getMomentArt(m.art)}</div>` : ''}
            <div class="moment-meta">
              <span>${escapeHtml(m.dateLabel)} ${escapeHtml(m.time)}</span>
              <div class="moment-actions">
                <button class="moment-act-btn ${inter.liked?'liked':''}" data-moment-like="${safeMomentId}" ${inter.liked?'disabled':''}>
                  ${inter.liked?'♥':'♡'} ${m.likes.length}
                </button>
                ${m.commentOptions && !inter.commented ? `<button class="moment-act-btn" data-moment-comment="${safeMomentId}">💬 评论</button>` : ''}
              </div>
            </div>
            ${likeNames ? `<div class="moment-likes">♥ ${escapeHtml(likeNames)}</div>` : ''}
            ${commentsHtml ? `<div class="moment-comments">${commentsHtml}</div>` : ''}
            ${charCommentsBlock}
            ${commentOptsHtml}
          </div>
        </div>
      `;
      list.appendChild(item);
    });
    updateMomentsBadge();
  }
  function getMomentArt(type){
    // 复用相册的 SVG art
    const arts = {
      city:`<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#0a0712"/>
        <rect x="10" y="60" width="20" height="90" fill="#1a1f3a"/>
        <rect x="35" y="40" width="25" height="110" fill="#2a1f4a"/>
        <rect x="65" y="25" width="30" height="125" fill="#1a2f4a"/>
        <rect x="100" y="50" width="22" height="100" fill="#2a1f3a"/>
        <rect x="125" y="30" width="28" height="120" fill="#1a1f4a"/>
        <rect x="158" y="55" width="18" height="95" fill="#2a2f4a"/>
        <g fill="#ff5fa8"><rect x="15" y="70" width="2" height="2"/><rect x="22" y="80" width="2" height="2"/></g>
        <g fill="#7a5cff"><rect x="40" y="50" width="2" height="2"/><rect x="48" y="65" width="2" height="2"/></g>
        <g fill="#39d6ff"><rect x="70" y="35" width="2" height="2"/><rect x="80" y="50" width="2" height="2"/></g>
      </svg>`,
      gallery:`<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#1a0a2e"/>
        <rect x="20" y="20" width="160" height="100" fill="#2a1f3a" rx="2"/>
        <rect x="30" y="30" width="60" height="80" fill="#0a0712"/>
        <rect x="100" y="30" width="70" height="50" fill="#1a1420"/>
        <rect x="100" y="85" width="70" height="25" fill="#15101f"/>
        <g fill="#ff5fa8"><rect x="35" y="35" width="3" height="3"/><rect x="45" y="50" width="3" height="3"/></g>
        <g fill="#7a5cff"><rect x="105" y="35" width="3" height="3"/><rect x="115" y="50" width="3" height="3"/></g>
      </svg>`
    };
    return arts[type] || '';
  }
  function updateMomentsBadge(){
    // 朋友圈新动态（未互动的）
    const uninteracted = engine.state.moments.filter(m=>{
      if(m.isMine) return false;
      const inter = engine.state.momentInteractions[m.id] || {};
      return !inter.liked && !inter.commented;
    }).length;
    const badge = $('badge-moments');
    if(uninteracted > 0){
      badge.textContent = uninteracted;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }
  function toggleCommentOptions(momentId){
    const opts = document.getElementById('opts-' + momentId);
    if(opts) opts.hidden = !opts.hidden;
  }
  // 发朋友圈
  function openPostMoment(){
    $('post-moment-text').value = '';
    selectedMomentArt = '';
    document.querySelectorAll('.pm-art-opt').forEach(b=>b.classList.remove('selected'));
    showScreen('postMoment');
  }
  function selectMomentArt(btn){
    document.querySelectorAll('.pm-art-opt').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMomentArt = btn.dataset.momentArt;
  }
  function publishMoment(){
    const text = $('post-moment-text').value.trim();
    if(!text){ toast('写点什么吧'); return; }
    const id = engine.createMyMoment(text, selectedMomentArt || null);
    // v0.0.16: 触发男主朋友圈互动评论
    const moment = engine.state.moments.find(m => m.id === id);
    if(moment) engine.generateMomentComments(moment);
    toast('已发表');
    renderMoments();
    showScreen('moments');
  }
  // 朋友圈事件
  engine.on('momentPosted', (moment)=>{
    if(moment.author !== 'me'){
      showNotif(moment.author, '发了新动态：' + moment.text.slice(0,20) + '…');
    }
    updateMomentsBadge();
  });
  engine.on('momentUpdate', ()=>{
    if(screens.moments.classList.contains('active')) renderMoments();
  });

  // ===== 梦境 =====
  function openDreamScreen(dreamId, dream){
    if(!dream) return;
    $('dream-title').textContent = dream.title;
    $('dream-desc').textContent = dream.desc;
    const opts = $('dream-options');
    opts.innerHTML = '';
    dream.options.forEach((opt, i)=>{
      const btn = document.createElement('button');
      btn.className = 'dream-opt';
      btn.textContent = opt.text;
      btn.dataset.dreamOpt = dreamId;
      btn.dataset.optIdx = i;
      opts.appendChild(btn);
    });
    showScreen('dream');
  }
  engine.on('dreamStart', ({dreamId, dream})=>{
    openDreamScreen(dreamId, dream);
  });
  engine.on('dreamResolved', ({choice})=>{
    setUiTimeout(()=>{
      if(choice.shard) toast('✦ 获得记忆碎片：' + choice.shard);
    }, 500);
    // 碎片提示后回到主屏（若 timeAdvance 随后触发会自动覆盖）
    setUiTimeout(()=>{
      if(screens.dream.classList.contains('active')) showScreen('home');
    }, 1800);
  });

  // ===== 偶遇 =====
  engine.on('encounterTriggered', ({locId, enc})=>{
    showEncounter(enc);
  });
  engine.on('encounterEmpty', ()=>{
    toast('这里暂时没有新发现…');
  });

  // ===== 回忆杀 =====
  engine.on('memoryStart', ({memId, mem})=>{
    // 复用偶遇屏显示回忆
    showEncounter({
      id: memId,
      title: mem.title,
      desc: mem.desc,
      choice: { prompt:'', options: mem.options },
      isMemory: true,
      char: 'narrator'
    });
  });
  engine.on('memoryResolved', ({opt})=>{
    setUiTimeout(()=>{
      if(opt.shard) toast('✦ 获得回忆碎片：' + opt.shard);
    }, 300);
    setUiTimeout(()=>{
      if(screens.encounter.classList.contains('active')) showScreen('album');
    }, 1500);
  });

  // ===== 苏苏情报 =====
  engine.on('intelReceived', ({id, intel})=>{
    toast('📨 苏苏发来一条情报');
  });

  // ===== 性格画像 =====
  function renderProfile(){
    const content = $('profile-content');
    const profile = engine.getPersonalityProfile();
    const p = engine.state.personality;
    if(profile.shards === 0 && p.active + p.passive + p.emotional + p.rational === 0){
      const invHtml = renderInvitationsList();
      content.innerHTML = '<div class="profile-empty">梦境尚未开始<br>你的画像正在形成中…</div>' + (invHtml || '');
      return;
    }
    let html = '<div class="profile-hero"><div class="profile-hero-title">林夏</div><div class="profile-hero-sub">已收集 ' + profile.shards + ' 个记忆碎片</div></div>';
    // 三维画像
    const dims = [
      {label:'行动力', a:'active', b:'passive', aLabel:'主动', bLabel:'被动'},
      {label:'决策方式', a:'rational', b:'emotional', aLabel:'理性', bLabel:'感性'},
      {label:'依赖度', a:'independent', b:'dependent', aLabel:'独立', bLabel:'依赖'}
    ];
    dims.forEach(d=>{
      const aVal = p[d.a], bVal = p[d.b];
      const total = aVal + bVal;
      const aPct = total > 0 ? (aVal / total) * 100 : 50;
      const bPct = total > 0 ? (bVal / total) * 100 : 50;
      const value = aVal > bVal ? d.aLabel + '型' : (bVal > aVal ? d.bLabel + '型' : '平衡型');
      html += `<div class="profile-trait">
        <div class="profile-trait-dim">${d.label}</div>
        <div class="profile-trait-value">${value}</div>
        <div class="profile-trait-bar">
          <div class="profile-trait-fill ${d.a}" style="width:${aPct}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:11px;color:var(--ink-mute)">
          <span>${d.aLabel} ${aVal}</span><span>${d.bLabel} ${bVal}</span>
        </div>
      </div>`;
    });
    // 记忆碎片
    if(profile.shardDetails.length > 0){
      html += '<div class="profile-shards"><div class="profile-shards-title">记忆碎片</div>';
      profile.shardDetails.forEach(s=>{
        html += `<div class="profile-shard">
          <div class="profile-shard-title">✦ ${s.shard || s.title}</div>
          ${s.meaning ? `<div class="profile-shard-meaning">${s.meaning}</div>` : ''}
        </div>`;
      });
      html += '</div>';
    }
    // 回忆碎片
    if(profile.memoryShards && profile.memoryShards.length > 0){
      html += '<div class="profile-shards"><div class="profile-shards-title">回忆碎片</div>';
      profile.memoryShards.forEach(s=>{
        html += `<div class="profile-shard">
          <div class="profile-shard-title">✦ ${s.shard || s.title}</div>
          ${s.meaning ? `<div class="profile-shard-meaning">${s.meaning}</div>` : ''}
        </div>`;
      });
      html += '</div>';
    }
    // 邀约列表
    const invHtml = renderInvitationsList();
    if(invHtml) html += invHtml;
    content.innerHTML = html;
  }

  // 邀约列表渲染（嵌入性格画像App）
  function renderInvitationsList(){
    if(!STORY.invitations) return '';
    const entries = Object.entries(STORY.invitations);
    if(entries.length === 0) return '';
    let html = '<div class="profile-shards"><div class="profile-shards-title">邀约记录</div>';
    entries.forEach(([id, inv])=>{
      const char = STORY.characters[inv.from] || {name:'?'};
      const resolved = engine.state.resolvedInvitations[id];
      const pending = engine.state.invitations.find(p=>p.id===id && p.status==='pending');
      let status = '未触发', cls = 'inv-pending';
      if(resolved === 'accepted'){ status = '已赴约'; cls = 'inv-accepted'; }
      else if(resolved === 'declined'){ status = '已拒绝'; cls = 'inv-declined'; }
      else if(resolved === 'missed'){ status = '已错过'; cls = 'inv-missed'; }
      else if(pending){ status = '待回复 · ' + (inv.schedule || ''); cls = 'inv-active'; }
      else { status = '尚未达成'; cls = 'inv-locked'; }
      html += `<div class="profile-shard ${cls}">
        <div class="profile-shard-title">${char.avatar} ${char.name} · ${escapeHtml(inv.schedule||'邀约')}</div>
        <div class="profile-shard-meaning">${escapeHtml(inv.text)}</div>
        <div style="margin-top:4px;font-size:11px;color:var(--ink-mute)">状态：${status}</div>
      </div>`;
    });
    html += '</div>';
    return html;
  }

  // ===== 语音信箱 =====
  function renderVoicemails(){
    const list = $('voicemail-list');
    list.innerHTML = '';
    if(engine.state.voicemails.length === 0){
      list.innerHTML = '<div style="padding:40px 20px;text-align:center;color:var(--ink-mute);font-size:13px;">暂无语音信箱</div>';
      return;
    }
    engine.state.voicemails.forEach(vm=>{
      const char = STORY.characters[vm.from] || {name:'未知',avatar:'?',bg:'#3a3a5a'};
      const item = document.createElement('div');
      item.className = 'voicemail-item' + (vm.heard ? '' : ' unheard');
      item.innerHTML = `
        <div class="vm-icon">${char.avatar}</div>
        <div class="vm-info">
          <div class="vm-name">${char.name}</div>
          <div class="vm-text">${escapeHtml(vm.text)}</div>
          <div class="vm-meta">第${escapeHtml(vm.day)}天 ${escapeHtml(vm.time)}</div>
          <div class="vm-actions">
            <button class="vm-btn" data-vm-play="${vm.id}">▶ 播放</button>
            ${vm.callbackEvent ? `<button class="vm-btn callback" data-vm-callback="${vm.id}">回拨</button>` : ''}
          </div>
        </div>
      `;
      list.appendChild(item);
    });
  }

  // 电话 tabs 切换
  document.addEventListener('click', e=>{
    const tab = e.target.closest('[data-phone-tab]');
    if(tab){
      const tabName = tab.dataset.phoneTab;
      document.querySelectorAll('.phone-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('[data-phone-panel]').forEach(p=>{
        p.hidden = p.dataset.phonePanel !== tabName;
      });
      return;
    }
    const playBtn = e.target.closest('[data-vm-play]');
    if(playBtn){
      engine.playVoicemail(playBtn.dataset.vmPlay);
      toast('语音已播放');
      renderVoicemails();
      return;
    }
    const cbBtn = e.target.closest('[data-vm-callback]');
    if(cbBtn){
      engine.callbackVoicemail(cbBtn.dataset.vmCallback);
      toast('正在回拨…');
      renderVoicemails();
      return;
    }
  });

  // ===== 多人聊天群 =====
  function renderGroupList(){
    const list = $('group-list');
    list.innerHTML = '';
    const groups = engine.state.groups;
    const entries = Object.entries(groups);
    if(entries.length === 0){
      list.innerHTML = '<div style="padding:40px 20px;text-align:center;color:var(--ink-mute);font-size:13px;">还没有群聊</div>';
      return;
    }
    entries.forEach(([id, g])=>{
      const last = g.messages[g.messages.length-1];
      const item = document.createElement('div');
      item.className = 'conv-item' + (g.unread>0?' unread':'');
      item.dataset.group = id;
      const preview = last ? (STORY.characters[last.from]?.name || '') + ': ' + last.text : '暂无消息';
      item.innerHTML = `
        <div class="group-avatar">群</div>
        <div class="group-info">
          <div class="conv-top">
            <span class="conv-name">${g.name}</span>
            <span class="conv-time">${last?.time || ''}</span>
          </div>
          <div class="group-preview">${g.typing?'<span style="color:var(--accent)">正在输入…</span>':preview}</div>
        </div>
        ${g.unread>0?`<span class="conv-unread">${g.unread}</span>`:''}
      `;
      list.appendChild(item);
    });
    updateGroupBadge();
  }
  function updateGroupBadge(){
    let total = 0;
    Object.values(engine.state.groups).forEach(g=> total += g.unread);
    const badge = $('badge-groups');
    if(total > 0){ badge.textContent = total; badge.hidden = false; }
    else { badge.hidden = true; }
  }
  function openGroupChat(groupId){
    currentGroupId = groupId;
    const g = engine.state.groups[groupId];
    if(!g) return;
    $('group-chat-name').textContent = g.name;
    $('group-chat-members').textContent = g.members.length + ' 位成员';
    renderGroupChatBody(groupId);
    engine.markGroupRead(groupId);
    updateGroupBadge();
    $('group-chat-input-bar').hidden = true;
    showScreen('groupChat');
    if(g.pendingChoice){
      setUiTimeout(()=> showGroupChoice(groupId, g.pendingChoice), 400);
    }
    setUiTimeout(()=>{
      const body = $('group-chat-body');
      body.scrollTop = body.scrollHeight;
    }, 50);
  }
  function renderGroupChatBody(groupId){
    const g = engine.state.groups[groupId];
    const body = $('group-chat-body');
    body.innerHTML = '';
    g.messages.forEach(m=>{
      const div = document.createElement('div');
      if(m.from === 'me'){
        div.className = 'msg send';
        div.textContent = m.text;
      } else {
        div.className = 'msg recv';
        const char = STORY.characters[m.from];
        const tag = document.createElement('span');
        tag.className = 'speaker-tag ' + m.from;
        tag.textContent = char?.name || m.from;
        div.appendChild(tag);
        div.appendChild(document.createTextNode(m.text));
      }
      const time = document.createElement('span');
      time.className = 'time';
      time.textContent = m.time || '';
      div.appendChild(time);
      body.appendChild(div);
    });
    if(g.typing){
      const t = document.createElement('div');
      t.className = 'typing-indicator';
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
    }
    body.scrollTop = body.scrollHeight;
  }
  function showGroupChoice(groupId, choice){
    const bar = $('group-chat-input-bar');
    bar.hidden = false;
    $('group-chat-prompt').textContent = choice.prompt;
    const opts = $('group-chat-options');
    opts.innerHTML = '';
    choice.options.forEach((opt, i)=>{
      const btn = document.createElement('button');
      btn.className = 'chat-opt';
        btn.innerHTML = escapeHtml(opt.text) + (opt.hint?` <span style="color:var(--ink-mute);font-size:11px">(${escapeHtml(opt.hint)})</span>`:'');
      btn.dataset.groupOpt = i;
      opts.appendChild(btn);
    });
  }

  // 群聊事件绑定
  engine.on('groupCreated', ()=>{ updateGroupBadge(); });
  engine.on('groupUpdate', ({id, group})=>{
    updateGroupBadge();
    if(screens.groups.classList.contains('active')) renderGroupList();
    if(currentGroupId === id && screens.groupChat.classList.contains('active')){
      renderGroupChatBody(id);
      $('group-chat-members').textContent = group.members.length + ' 位成员';
    }
  });
  engine.on('groupMessageReceived', ({groupId, from})=>{
    const char = STORY.characters[from];
    const g = engine.state.groups[groupId];
    if(char && g) showNotif(from, `在「${g.name}」发了消息`, ()=> openGroupChat(groupId));
  });

  // 群聊点击委托
  document.body.addEventListener('click', e=>{
    const gBtn = e.target.closest('[data-group]');
    if(gBtn){ openGroupChat(gBtn.dataset.group); return; }
    const gOpt = e.target.closest('[data-group-opt]');
    if(gOpt && currentGroupId){
      const idx = parseInt(gOpt.dataset.groupOpt);
      const g = engine.state.groups[currentGroupId];
      if(g && g.pendingChoice){
        const opt = g.pendingChoice.options[idx];
        if(opt){
          engine.sendGroupMessage(currentGroupId, opt.text, mergeOptionEffects(opt));
          g.pendingChoice = null;
          $('group-chat-input-bar').hidden = true;
        }
      }
      return;
    }
    const contactBtn = e.target.closest('[data-contact]');
    if(contactBtn){ openCharProfile(contactBtn.dataset.contact); return; }
  });

  // ===== 通讯录/社交主页 =====
  function renderContacts(){
    const list = $('contacts-list');
    list.innerHTML = '';
    Object.entries(STORY.characters).forEach(([id, char])=>{
      if(id === 'linxia') return;
      const profile = STORY.profiles?.[id];
      const item = document.createElement('div');
      item.className = 'contact-item';
      item.dataset.contact = id;
      item.innerHTML = `
        <div class="contact-avatar" style="background:${char.bg}">${char.avatar}</div>
        <div class="contact-info">
          <div class="contact-name">${char.name}</div>
          <div class="contact-desc">${profile?.bio || char.desc || ''}</div>
        </div>
      `;
      list.appendChild(item);
    });
  }
  function openCharProfile(charId){
    const char = STORY.characters[charId];
    const profile = STORY.profiles?.[charId];
    if(!char || !profile) return;
    const body = $('char-profile-body');
    let html = `
      <div class="char-profile-header">
        <div class="char-profile-avatar" style="background:${char.bg}">${char.avatar}</div>
        <div class="char-profile-name">${char.name}</div>
        <div class="char-profile-bio">${profile.bio}</div>
        <div class="char-profile-tags">
          ${profile.tags.map(t=>`<span class="char-profile-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
    if(profile.relations && profile.relations.length > 0){
      html += `<div class="char-profile-section-title">关系网</div><div class="char-profile-relations">`;
      profile.relations.forEach(r=>{
        const relChar = STORY.characters[r.to];
        html += `
          <div class="char-profile-relation">
            <div class="char-profile-relation-name">${relChar?.name || r.to}</div>
            <div class="char-profile-relation-hint">${r.hint}</div>
          </div>
        `;
      });
      html += '</div>';
    }
    html += `<div class="char-profile-section-title">好感度</div>`;
    html += `<div class="char-profile-relation"><div class="char-profile-relation-hint">当前好感度：${engine.state.affection[charId] || 0}</div></div>`;
    body.innerHTML = html;
    showScreen('charProfile');
  }

  // ===== 闪回/前传章节 =====
  let currentFlashback = null;
  function showFlashback(fbId, fb){
    currentFlashback = {fbId, fb, choices:[]};
    $('flashback-title').textContent = fb.title;
    const scenesEl = $('flashback-scenes');
    scenesEl.innerHTML = '';
    fb.scenes.forEach((sc, i)=>{
      const div = document.createElement('div');
      div.className = 'flashback-scene';
      div.textContent = sc.text;
      scenesEl.appendChild(div);
    });
    // 最后一个场景有 choice
    const lastScene = fb.scenes[fb.scenes.length-1];
    const optsEl = $('flashback-options');
    optsEl.innerHTML = '';
    if(lastScene.choice){
      lastScene.choice.options.forEach((opt, i)=>{
        const btn = document.createElement('button');
        btn.className = 'dream-opt';
        btn.innerHTML = opt.text + (opt.shard?` <span style="color:#c8a84a;font-size:11px">✦ ${opt.shard}</span>`:'');
        btn.dataset.fbOpt = i;
        optsEl.appendChild(btn);
      });
    } else {
      const btn = document.createElement('button');
      btn.className = 'dream-opt';
      btn.textContent = '继续';
      btn.dataset.fbOpt = '0';
      optsEl.appendChild(btn);
    }
    showScreen('flashback');
  }
  engine.on('flashbackStart', ({fbId, fb})=>{
    showFlashback(fbId, fb);
  });
  document.body.addEventListener('click', e=>{
    const fbOpt = e.target.closest('[data-fb-opt]');
    if(fbOpt && currentFlashback){
      const optIdx = parseInt(fbOpt.dataset.fbOpt);
      const lastScene = currentFlashback.fb.scenes[currentFlashback.fb.scenes.length-1];
      const opt = lastScene.choice?.options?.[optIdx];
      currentFlashback.choices.push({sceneIdx: currentFlashback.fb.scenes.length-1, optIdx});
      engine.resolveFlashback(currentFlashback.fbId, currentFlashback.choices);
      toast(opt?.shard ? '收集碎片：' + opt.shard : '回忆结束');
      currentFlashback = null;
      setUiTimeout(()=> showScreen('home'), 1800);
      return;
    }
  });

  // ===== 邀约事件 =====
  engine.on('invitationReceived', ({id, inv})=>{
    const char = STORY.characters[inv.from];
    if(char) showNotif(inv.from, char.name + '发来邀约');
  });
  engine.on('invitationResolved', ({id, decision})=>{
    if(decision === 'accepted') toast('已赴约');
    else if(decision === 'declined') toast('已拒绝邀约');
    else if(decision === 'missed') toast('邀约已错过');
  });

  // ===== 通话未接提醒 =====
  engine.on('callMissed', (eventId)=>{
    if(window._currentCall?.eventId === eventId){
      window._currentCall = null;
      if(screens.incomingCall?.classList.contains('active')) showScreen('home');
    }
    toast('未接来电');
  });

  // ===== v0.0.9 礼物商城 =====
  let shopCurrentTab = 'store';
  function renderShop(tab){
    shopCurrentTab = tab || shopCurrentTab;
    document.querySelectorAll('.shop-tab').forEach(t=>{
      t.classList.toggle('active', t.dataset.shopTab === shopCurrentTab);
    });
    $('shop-coins').textContent = '💰 ' + engine.state.coins;
    const content = $('shop-content');
    if(shopCurrentTab === 'store'){
      const items = Object.values(STORY.shop.items);
      content.innerHTML = items.map(item=>{
        const canAfford = engine.state.coins >= item.price;
        return `<div class="shop-item">
          <div class="shop-item-icon">${item.icon}</div>
          <div class="shop-item-info">
            <div class="shop-item-name">${escapeHtml(item.name)} <span style="font-size:10px;color:var(--ink-mute)">·${item.cat}</span></div>
            <div class="shop-item-desc">${escapeHtml(item.desc)}</div>
            <div class="shop-item-price">💰 ${item.price}</div>
          </div>
          <button class="shop-buy-btn" data-buy="${item.id}" ${canAfford?'':'disabled'}>${canAfford?'购买':'金币不足'}</button>
        </div>`;
      }).join('');
    } else if(shopCurrentTab === 'inventory'){
      const inv = engine.state.inventory;
      if(inv.length === 0){
        content.innerHTML = '<div class="shop-empty">背包空空如也<br>去商店买点礼物送给他吧</div>';
      } else {
        // 按物品id分组
        const grouped = {};
        inv.forEach(g=>{ grouped[g.id] = (grouped[g.id]||0) + 1; });
        content.innerHTML = Object.entries(grouped).map(([itemId, count])=>{
          const item = STORY.shop.items[itemId];
          if(!item) return '';
          return `<div class="shop-item">
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-info">
              <div class="shop-item-name">${escapeHtml(item.name)} ×${count}</div>
              <div class="shop-item-desc">${escapeHtml(item.desc)}</div>
            </div>
            <button class="shop-buy-btn" data-send-gift="${itemId}" style="background:var(--accent2)">送出</button>
          </div>`;
        }).join('');
      }
    } else if(shopCurrentTab === 'gifts'){
      const gifts = engine.state.gifts;
      if(gifts.length === 0){
        content.innerHTML = '<div class="shop-empty">还没送出过礼物</div>';
      } else {
        content.innerHTML = gifts.slice().reverse().map(g=>{
          const item = STORY.shop.items[g.itemId];
          const char = STORY.characters[g.to] || {};
          const multLabel = g.mult >= 2 ? '最爱 ⭐⭐' : (g.mult >= 1.5 ? '喜欢 ⭐' : (g.mult >= 1 ? '一般' : '不喜欢'));
          return `<div class="shop-item">
            <div class="shop-item-icon">${item?.icon || '🎁'}</div>
            <div class="shop-item-info">
              <div class="shop-item-name">${char.avatar||''} ${char.name||g.to} · ${escapeHtml(item?.name||'')}</div>
              <div class="shop-item-desc">第${g.day}天送出 · ${multLabel} · 好感 +${g.gain}</div>
            </div>
          </div>`;
        }).join('');
      }
    }
  }
  function handleBuyGift(itemId){
    const r = engine.buyGift(itemId);
    if(!r.ok){ toast(r.reason); return; }
    toast('已购买：' + r.item.name);
    renderShop(shopCurrentTab);
  }
  let giftSendItemId = null;
  let giftSendCharId = null;
  function openGiftSendModal(itemId){
    giftSendItemId = itemId;
    giftSendCharId = null;
    const item = STORY.shop.items[itemId];
    if(!item) return;
    const modal = document.createElement('div');
    modal.className = 'gift-send-modal';
    modal.id = 'gift-send-modal';
    modal.innerHTML = `<div class="gift-send-content">
      <div class="gift-send-title">把「${escapeHtml(item.name)}」送给谁？</div>
      <div class="gift-send-char">
        ${['shenyan','luci','jiangyu'].map(cid=>{
          const c = STORY.characters[cid];
          return `<button class="gift-send-char-btn" data-gift-char="${cid}" style="background:${c.bg}" title="${c.name}">${c.avatar}</button>`;
        }).join('')}
      </div>
      <div class="gift-pref-hint" id="gift-pref-hint">点击头像查看他对此礼物的喜好</div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;">
        <button data-action="cancel-gift" style="padding:8px 20px;background:rgba(255,255,255,0.08);color:var(--ink);border:none;border-radius:10px;font-size:13px;cursor:pointer;">取消</button>
        <button data-action="confirm-gift" id="gift-confirm-btn" disabled style="padding:8px 20px;background:var(--accent);color:#fff;border:none;border-radius:10px;font-size:13px;cursor:pointer;opacity:0.4;">确认送出</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
    // 点击背景关闭
    modal.addEventListener('click', e=>{ if(e.target === modal) closeGiftSendModal(); });
  }
  function selectGiftChar(charId){
    giftSendCharId = charId;
    document.querySelectorAll('.gift-send-char-btn').forEach(b=>{
      b.classList.toggle('selected', b.dataset.giftChar === charId);
    });
    const prefs = STORY.shop.preferences[charId] || {};
    const mult = prefs[giftSendItemId];
    const hintEl = $('gift-pref-hint');
    const confirmBtn = $('gift-confirm-btn');
    if(!mult){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">一般（×1）</span>';
    } else if(mult >= 2){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">最爱（×2）⭐⭐</span>';
    } else if(mult >= 1.5){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">喜欢（×1.5）⭐</span>';
    } else if(mult >= 1){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">一般（×1）</span>';
    } else {
      hintEl.innerHTML = '他不太喜欢这类东西（×0.5）';
    }
    if(confirmBtn){ confirmBtn.disabled = false; confirmBtn.style.opacity = '1'; }
  }
  function handleConfirmGift(){
    if(!giftSendItemId || !giftSendCharId){ toast('请选择赠送对象'); return; }
    const r = engine.giveGift(giftSendCharId, giftSendItemId);
    closeGiftSendModal();
    if(!r.ok){ toast(r.reason); return; }
    const charName = STORY.characters[giftSendCharId]?.name || '';
    toast(`已送出 · ${charName} 好感 +${r.gain}`);
    renderShop(shopCurrentTab);
  }
  function closeGiftSendModal(){
    const m = $('gift-send-modal');
    if(m) m.remove();
    giftSendItemId = null;
    giftSendCharId = null;
  }
  engine.on('giftGiven', ({to, itemId, mult, gain, reaction})=>{
    const char = STORY.characters[to];
    if(char) showNotif(to, `收到礼物 · 好感 +${gain}`);
  });

  // ===== v0.0.9 心情状态+内心独白 =====
  function renderMood(){
    const content = $('mood-content');
    const cur = STORY.moods[engine.state.mood] || STORY.moods.calm;
    let html = `<div class="mood-current">
      <div class="mood-current-icon">${cur.icon}</div>
      <div class="mood-current-label">${cur.label}</div>
      <div class="mood-current-hint">"${escapeHtml(cur.hint)}"</div>
    </div>`;
    html += '<div class="mood-section-title">切换心情</div>';
    html += '<div class="mood-grid">';
    Object.values(STORY.moods).forEach(m=>{
      html += `<div class="mood-opt ${m.id===engine.state.mood?'selected':''}" data-mood-opt="${m.id}">
        <div class="mood-opt-icon">${m.icon}</div>
        <div class="mood-opt-label">${m.label}</div>
      </div>`;
    });
    html += '</div>';
    // 内心独白
    html += '<div class="mood-diary-section">';
    html += '<div class="mood-section-title">内心独白</div>';
    html += `<textarea class="mood-diary-input" id="mood-diary-text" placeholder="今天发生了什么？把心里的话写下来…"></textarea>`;
    html += '<button class="mood-diary-submit" data-action="submit-diary">记下这一刻</button>';
    // 历史日记
    if(engine.state.diary.length > 0){
      html += '<div class="mood-diary-list">';
      engine.state.diary.slice().reverse().slice(0, 5).forEach(d=>{
        const m = STORY.moods[d.mood] || {icon:'·'};
        html += `<div class="mood-diary-item">
          <div class="mood-diary-item-text">${m.icon} ${escapeHtml(d.text)}</div>
          <div class="mood-diary-item-meta">第${d.day}天 ${d.time}</div>
        </div>`;
      });
      html += '</div>';
    }
    html += '</div>';
    content.innerHTML = html;
  }
  function handleDiarySubmit(){
    const field = $('mood-diary-text');
    if(!field) return;
    const text = field.value.trim();
    if(!text){ toast('先写点什么吧'); return; }
    engine.addDiary(text);
    toast('已记下');
    renderMood();
  }
  engine.on('moodChanged', ({mood, moodInfo})=>{
    toast('心情：' + moodInfo.label);
  });

  // ===== v0.0.9 塔罗占卜 =====
  function renderTarot(){
    const content = $('tarot-content');
    const fortune = engine.state.todayFortune;
    let html = '';
    if(fortune){
      html += `<div class="tarot-today">
        <div class="tarot-card-display ${fortune.reversed?'reversed':''}">
          ${fortune.reversed ? '<div class="tarot-card-reversed-tag">逆位</div>' : ''}
          <div class="tarot-card-roman">${fortune.roman}</div>
          <div class="tarot-card-name">${escapeHtml(fortune.name)}</div>
        </div>
        <div class="tarot-text">${escapeHtml(fortune.text)}</div>
        <div class="tarot-hint">第${fortune.day}天的牌阵 · ${fortune.reversed?'逆位':'正位'}</div>
      </div>`;
      html += `<button class="tarot-draw-btn" disabled>今日已抽过</button>`;
    } else {
      html += `<div class="tarot-empty">
        <div class="tarot-empty-icon">🔮</div>
        <div>今日尚未抽牌</div>
        <div style="font-size:11px;margin-top:6px;">每日一抽，揭示霓城的运势</div>
      </div>`;
      html += `<button class="tarot-draw-btn" data-action="draw-tarot">抽取今日塔罗</button>`;
    }
    // 历史
    if(engine.state.tarotHistory.length > 0){
      html += '<div class="tarot-history">';
      html += '<div class="tarot-history-title">历史牌阵</div>';
      engine.state.tarotHistory.slice().reverse().slice(0, 6).forEach(h=>{
        const card = STORY.tarot.cards[h.cardId];
        if(!card) return;
        html += `<div class="tarot-history-item">
          <span class="tarot-history-card">${card.roman} ${card.name}</span>
          <span style="color:${h.reversed?'#ff5fa8':'#4ade80'}">${h.reversed?'逆':'正'}</span>
          <span style="margin-left:auto;color:var(--ink-mute)">第${h.day}天</span>
        </div>`;
      });
      html += '</div>';
    }
    content.innerHTML = html;
  }
  function handleDrawTarot(){
    const r = engine.drawTarot();
    if(!r.ok){ toast(r.reason || '抽牌失败'); return; }
    renderTarot();
  }

  // ===== v0.0.9 成就系统 =====
  function renderAchievements(){
    const content = $('achievements-content');
    const unlocked = engine.getUnlockedAchievements();
    const locked = engine.getLockedAchievements();
    const total = unlocked.length + locked.length;
    const pct = total > 0 ? (unlocked.length / total) * 100 : 0;
    const trueUnlocked = engine.isTrueEndingUnlocked();
    let html = `<div class="ach-progress">
      <div class="ach-progress-num">${unlocked.length} / ${total}</div>
      <div class="ach-progress-total">已解锁成就</div>
      <div class="ach-progress-bar"><div class="ach-progress-fill" style="width:${pct}%"></div></div>
      <div class="ach-true-ending-hint ${trueUnlocked?'unlocked':''}">${trueUnlocked?'✨ 真结局已解锁':'达成 60% 成就 + 选择独行路线 → 解锁真结局'}</div>
    </div>`;
    if(unlocked.length > 0){
      html += '<div class="ach-section-title">已解锁</div>';
      unlocked.forEach(a=>{
        html += `<div class="ach-item unlocked">
          <div class="ach-item-icon">${a.icon}</div>
          <div class="ach-item-info">
            <div class="ach-item-name">${escapeHtml(a.name)}</div>
            <div class="ach-item-desc">${escapeHtml(a.desc)}</div>
          </div>
        </div>`;
      });
    }
    if(locked.length > 0){
      html += '<div class="ach-section-title">未解锁</div>';
      locked.forEach(a=>{
        html += `<div class="ach-item locked">
          <div class="ach-item-icon">${a.icon}</div>
          <div class="ach-item-info">
            <div class="ach-item-name">${escapeHtml(a.name)}</div>
            <div class="ach-item-desc">${escapeHtml(a.desc)}</div>
          </div>
        </div>`;
      });
    }
    content.innerHTML = html;
  }
  // 成就解锁通知
  engine.on('achievementsUnlocked', (achs)=>{
    achs.forEach(a=>{
      const n = document.createElement('div');
      n.className = 'ach-notif';
      n.textContent = `🏆 成就解锁：${a.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 3000);
    });
    // 若成就页打开则刷新
    if(screens.achievements && screens.achievements.classList.contains('active')){
      renderAchievements();
    }
  });

  // ===== v0.0.10 收集柜 =====
  let collectionCurrentCat = 'all';
  function renderCollection(cat){
    collectionCurrentCat = cat || collectionCurrentCat;
    document.querySelectorAll('.collection-tab').forEach(t=>{
      t.classList.toggle('active', t.dataset.collCat === collectionCurrentCat);
    });
    const allItems = Object.values(STORY.collectibles || {});
    const total = allItems.length;
    const collected = engine.state.collected.length;
    $('collection-count').textContent = `${collected}/${total}`;
    const content = $('collection-content');
    let items = allItems;
    if(collectionCurrentCat !== 'all') items = items.filter(i=>i.cat === collectionCurrentCat);
    content.innerHTML = items.map(item=>{
      const isCollected = engine.state.collected.includes(item.id);
      return `<div class="coll-card ${isCollected?'':'locked'}">
        <div class="coll-card-icon">${isCollected ? item.icon : '❓'}</div>
        <div class="coll-card-name">${isCollected ? escapeHtml(item.name) : '未收集'}</div>
        <div class="coll-card-desc">${isCollected ? escapeHtml(item.desc) : '等待霓城的某一个瞬间…'}</div>
        ${isCollected ? `<div class="coll-card-how">${escapeHtml(item.how)}</div>` : ''}
      </div>`;
    }).join('');
    // 隐藏彩蛋
    const eggsEl = $('collection-eggs');
    const allEggs = Object.values(STORY.easterEggs || {});
    eggsEl.innerHTML = allEggs.map(egg=>{
      const seen = engine.state.easterEggsSeen[egg.id];
      return `<div class="coll-egg ${seen?'':'locked'}">
        <div class="coll-egg-icon">${seen ? egg.icon : '🔒'}</div>
        <div class="coll-egg-info">
          <div class="coll-egg-name">${seen ? escapeHtml(egg.name) : '???'}</div>
          <div class="coll-egg-desc">${seen ? escapeHtml(egg.desc) : '尚未触发'}</div>
        </div>
      </div>`;
    }).join('');
  }
  engine.on('itemCollected', ({item, itemId})=>{
    showNotif('susu', `✦ 新收集：${item.name}`);
    if(screens.collection && screens.collection.classList.contains('active')){
      renderCollection(collectionCurrentCat);
    }
  });
  engine.on('easterEggUnlocked', (eggs)=>{
    eggs.forEach(egg=>{
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `✦ 彩蛋：${egg.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 3000);
    });
  });

  // ===== v0.0.10 线索本/解谜 =====
  let currentPuzzleId = null;
  function renderPuzzles(){
    const content = $('puzzles-content');
    const puzzles = engine.getAllPuzzles();
    if(puzzles.length === 0){
      content.innerHTML = '<div class="shop-empty">暂无线索</div>';
      return;
    }
    content.innerHTML = puzzles.map(p=>{
      const statusCls = p.solved ? 'solved' : '';
      const statusText = p.solved ? '已解开' : (p.attemptCount > 0 ? `已尝试 ${p.attemptCount} 次` : '未尝试');
      const discoveredClues = p.clues.filter(c=>c.discovered).length;
      return `<div class="puzzle-card ${statusCls}" data-puzzle="${p.id}">
        <div class="puzzle-card-title">
          <span>${escapeHtml(p.title)}</span>
          <span class="puzzle-card-status ${p.solved?'solved':''}">${statusText}</span>
        </div>
        <div class="puzzle-card-desc">${escapeHtml(p.desc)}</div>
        <div class="puzzle-card-meta">线索 ${discoveredClues}/${p.clues.length} · 点击进入</div>
      </div>`;
    }).join('');
  }
  function openPuzzleDetail(puzzleId){
    currentPuzzleId = puzzleId;
    renderPuzzleDetail(puzzleId);
    showScreen('puzzleDetail');
  }
  function renderPuzzleDetail(puzzleId){
    const puzzle = STORY.puzzles?.[puzzleId];
    if(!puzzle) return;
    const progress = engine.state.puzzleProgress[puzzleId] || {};
    $('puzzle-detail-title').textContent = puzzle.title;
    const content = $('puzzle-detail-content');
    let html = `<div class="pd-desc">${escapeHtml(puzzle.desc)}</div>`;
    html += '<div class="pd-section-title">线索</div>';
    puzzle.clues.forEach(c=>{
      const discovered = engine.state.discoveredClues[c.id];
      html += `<div class="pd-clue">
        <div class="pd-clue-text">
          ${discovered ? escapeHtml(c.text) : '<span style="color:var(--ink-mute)">未发现线索 · 点击发现</span>'}
          ${discovered ? `<span class="pd-clue-digit">${c.digit}</span>` : ''}
        </div>
        ${!discovered ? `<button data-clue="${c.id}" style="margin-top:6px;padding:4px 10px;font-size:11px;background:rgba(255,255,255,0.05);color:var(--ink-mute);border:0.5px solid rgba(255,255,255,0.1);border-radius:6px;cursor:pointer;">翻开这条线索</button>` : ''}
      </div>`;
    });
    // 输入区
    if(progress.solved){
      html += `<div class="pd-result success">✓ ${escapeHtml(puzzle.onSuccess)}</div>`;
    } else {
      html += '<div class="pd-section-title" style="margin-top:18px;">输入答案</div>';
      html += `<div class="pd-input-row">
        <input type="text" class="pd-input" id="puzzle-answer-input" maxlength="4" placeholder="____" inputmode="numeric">
        <button class="pd-submit" data-action="submit-puzzle">提交</button>
      </div>`;
      html += `<div class="pd-hint">${escapeHtml(puzzle.hint)}</div>`;
      if(progress.attemptCount > 0){
        html += `<div class="pd-result fail">✗ ${escapeHtml(puzzle.onFail)}（已尝试 ${progress.attemptCount} 次）</div>`;
      }
    }
    content.innerHTML = html;
  }
  function handlePuzzleSubmit(){
    const input = $('puzzle-answer-input');
    if(!input || !currentPuzzleId) return;
    const answer = input.value.trim();
    if(!answer){ toast('请输入答案'); return; }
    const r = engine.attemptPuzzle(currentPuzzleId, answer);
    if(r.solved){
      toast('谜题已解开');
    } else {
      toast(r.message || '答案不对');
    }
    renderPuzzleDetail(currentPuzzleId);
  }
  engine.on('puzzleSolved', ({puzzleId, puzzle, reward})=>{
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = `🔍 谜题解开：${puzzle.title}`;
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 3000);
  });

  // ===== v0.0.10 节日App =====
  function renderCalendar2(){
    const content = $('calendar2-content');
    const season = engine.getCurrentSeason();
    const today = engine.getDateLabel();
    const todayHoliday = STORY.seasons?.holidays[`${today.month}-${today.date}`];
    let html = `<div class="cal2-season">
      <div class="cal2-season-icon">${season.icon}</div>
      <div class="cal2-season-name">${season.name} · ${today.month}月${today.date}日</div>
      <div class="cal2-season-desc">"${escapeHtml(season.desc)}"</div>
    </div>`;
    if(todayHoliday){
      html += `<div class="cal2-today-holiday">
        <div class="cal2-today-holiday-icon">${todayHoliday.icon}</div>
        <div class="cal2-today-holiday-name">${escapeHtml(todayHoliday.name)}</div>
        <div class="cal2-today-holiday-text">${escapeHtml(todayHoliday.text)}</div>
      </div>`;
    } else {
      html += '<div class="cal2-section-title">今日</div>';
      html += '<div style="font-size:12px;color:var(--ink-mute);padding:8px 0;">今天没有特别的日子。</div>';
    }
    // 即将到来的节日
    const upcoming = engine.getUpcomingHolidays(30);
    if(upcoming.length > 0){
      html += '<div class="cal2-section-title">即将到来</div>';
      upcoming.forEach(u=>{
        html += `<div class="cal2-upcoming-item">
          <div class="cal2-upcoming-icon">${u.holiday.icon}</div>
          <div class="cal2-upcoming-info">
            <div class="cal2-upcoming-name">${escapeHtml(u.holiday.name)}</div>
            <div class="cal2-upcoming-date">${u.date.month}月${u.date.date}日</div>
          </div>
          <div class="cal2-upcoming-in">${u.inDays}天后</div>
        </div>`;
      });
    }
    // 全部节日列表
    html += '<div class="cal2-section-title">霓城节日历</div>';
    Object.values(STORY.seasons?.holidays || {}).forEach(h=>{
      html += `<div class="cal2-upcoming-item">
        <div class="cal2-upcoming-icon">${h.icon}</div>
        <div class="cal2-upcoming-info">
          <div class="cal2-upcoming-name">${escapeHtml(h.name)}</div>
          <div class="cal2-upcoming-date">${escapeHtml(h.text)}</div>
        </div>
      </div>`;
    });
    content.innerHTML = html;
  }
  engine.on('holidayTriggered', ({holiday, date})=>{
    showNotif('susu', `今日节日：${holiday.name}`);
  });

  // ===== v0.0.10 男主视角+反向剧情 =====
  let currentPerspectiveCharId = null;
  let currentPsceneId = null;
  function renderPerspective(){
    const content = $('perspective-content');
    const perspectives = engine.getAllPerspectives();
    if(perspectives.length === 0){
      content.innerHTML = '<div class="shop-empty">暂无视角</div>';
      return;
    }
    content.innerHTML = perspectives.map(p=>{
      const char = STORY.characters[p.charId] || {};
      const lockedCls = p.unlocked ? '' : 'locked';
      const statusText = p.unlocked
        ? (p.truthEndingSeen ? '✓ 真相已揭示' : `${p.scenesSeen}/${p.totalScenes} 场景已看`)
        : '通关对应路线后解锁';
      let scenesHtml = '';
      if(p.unlocked){
        scenesHtml = '<div class="persp-card-scenes">';
        p.scenes.forEach(s=>{
          scenesHtml += `<div class="persp-scene-item ${s.seen?'seen':''}" data-pscene="${p.charId}:${s.id}">
            <span class="persp-scene-item-title">${escapeHtml(s.title)}</span>
            ${s.seen ? '<span class="persp-scene-item-check">✓</span>' : '<span style="font-size:10px;color:var(--ink-mute)">未看</span>'}
          </div>`;
        });
        scenesHtml += '</div>';
        // 真相结局按钮
        const allScenesSeen = p.scenesSeen === p.totalScenes;
        if(allScenesSeen){
          scenesHtml += `<button class="persp-truth-btn ${p.truthEndingSeen?'':'unlocked'}" data-action="show-truth" data-char-id="${p.charId}">
            ${p.truthEndingSeen ? '✓ 重看真相结局' : '✦ 揭示真相结局'}
          </button>`;
        }
      }
      return `<div class="persp-card ${lockedCls}">
        <div class="persp-card-header">
          <div class="persp-card-avatar" style="background:${char.bg||'#333'}">${char.avatar||'?'}</div>
          <div>
            <div class="persp-card-title">${escapeHtml(p.title)}</div>
            <div class="persp-card-status">${statusText}</div>
          </div>
        </div>
        ${scenesHtml}
      </div>`;
    }).join('');
  }
  function openPerspectiveScene(charSceneId){
    const [charId, sceneId] = charSceneId.split(':');
    currentPerspectiveCharId = charId;
    currentPsceneId = sceneId;
    const p = STORY.malePerspectives?.[charId];
    const scene = p?.scenes.find(s=>s.id === sceneId);
    if(!scene) return;
    $('pscene-title').textContent = p.title;
    const content = $('pscene-content');
    let html = `<div class="pscene-time">${escapeHtml(scene.time)}</div>`;
    html += `<div class="pscene-title">${escapeHtml(scene.title)}</div>`;
    html += `<div class="pscene-narration">${escapeHtml(scene.narration)}</div>`;
    html += `<div class="pscene-inner">${escapeHtml(scene.innerVoice)}</div>`;
    if(scene.choice){
      html += `<div class="pscene-choice-prompt">${escapeHtml(scene.choice.prompt)}</div>`;
      html += '<div class="pscene-options">';
      scene.choice.options.forEach((opt, i)=>{
        html += `<div class="pscene-opt" data-pscene-opt="${i}">
          ${escapeHtml(opt.text)}
          <span class="pscene-opt-inner">${escapeHtml(opt.inner)}</span>
        </div>`;
      });
      html += '</div>';
    }
    content.innerHTML = html;
    showScreen('pscene');
  }
  function handlePsceneOption(idx){
    const p = STORY.malePerspectives?.[currentPerspectiveCharId];
    const scene = p?.scenes.find(s=>s.id === currentPsceneId);
    if(!scene || !scene.choice) return;
    const opt = scene.choice.options[idx];
    if(!opt) return;
    // 标记场景已看
    engine.markPerspectiveSceneSeen(currentPerspectiveCharId, currentPsceneId);
    toast('心声：' + opt.inner);
    // 返回视角列表
    setUiTimeout(()=>{
      renderPerspective();
      showScreen('perspective');
    }, 1500);
  }
  function showTruthEnding(charId){
    const p = STORY.malePerspectives?.[charId];
    if(!p || !p.truthEnding) return;
    $('truth-title').textContent = p.truthEnding.title;
    $('truth-text').textContent = p.truthEnding.text;
    showScreen('truthEnding');
  }
  engine.on('truthEndingUnlocked', ({charId, perspective})=>{
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = `✦ 真相结局解锁：${perspective.title}`;
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 4000);
  });

  // ===== v0.0.13 主角档案 App =====
  const PLAYER_COLORS = ['#5a2a4a','#2a2f5a','#2a5a3a','#5a3a1a','#3a1a3a','#1a3a4a','#4a1a2a','#3a3a3a'];
  let playerEditState = null;  // 临时编辑态
  function renderPlayer(){
    const content = $('player-content');
    const p = engine.getPlayer();
    let html = `<div class="player-hero">
      <div class="player-hero-avatar" style="background:${p.bg || '#5a2a4a'}">${escapeHtml(p.avatar || (p.name ? p.name[0] : '林'))}</div>
      <div class="player-hero-name">${escapeHtml(p.name || '林夏')}</div>
      <div class="player-hero-nick">昵称 · ${escapeHtml(p.nickname || '夏夏')}</div>
      <div class="player-hero-meta">
        <span>${p.age || 24} 岁</span>
        <span>称谓 · ${escapeHtml(p.pronoun || '她')}</span>
        ${engine.state.playerQuizDone ? '<span style="color:#4ade80">✓ 性格已画像</span>' : '<span style="color:var(--accent2)">性格问答待完成</span>'}
      </div>
    </div>`;
    // 性格问答回顾
    const quiz = STORY.playerCustomization?.personalityQuiz || [];
    if(quiz.length > 0){
      html += '<div class="player-section-title">性格画像回顾</div>';
      html += '<div class="player-quiz-list">';
      quiz.forEach(q=>{
        const ansIdx = p.answers?.[q.id];
        const opt = (ansIdx !== undefined) ? q.options[ansIdx] : null;
        html += `<div class="player-quiz-item">
          <div class="player-quiz-q">${escapeHtml(q.question)}</div>
          <div class="player-quiz-a">${opt ? ('→ ' + escapeHtml(opt.text) + (opt.label ? ` (${opt.label})` : '')) : '未作答'}</div>
        </div>`;
      });
      html += '</div>';
    }
    // 动态称谓表
    const chars = ['shenyan','luci','jiangyu','susu'];
    html += '<div class="player-section-title">男主对你的称谓</div>';
    html += '<div class="player-nick-table">';
    chars.forEach(cid=>{
      const char = STORY.characters[cid];
      if(!char) return;
      const nick = engine.getCharNickname(cid);
      const hasRelStage = !!(STORY.relationshipStages && STORY.relationshipStages[cid]);
      const stageNum = hasRelStage ? engine.getRelationshipStageNum(cid) : '—';
      html += `<div class="player-nick-row">
        <div class="player-nick-char" style="background:${char.bg}">${char.avatar}</div>
        <div class="player-nick-info">
          <div class="player-nick-call">${escapeHtml(nick.call)}</div>
          ${nick.inner ? `<div class="player-nick-inner">"${escapeHtml(nick.inner)}"</div>` : ''}
        </div>
        <div class="player-nick-stage">${hasRelStage ? ('阶段 ' + stageNum) : '闺蜜'}</div>
      </div>`;
    });
    html += '</div>';
    content.innerHTML = html;
  }

  function openPlayerEdit(){
    const p = engine.getPlayer();
    playerEditState = {
      name: p.name || '林夏',
      nickname: p.nickname || '夏夏',
      avatar: p.avatar || (p.name ? p.name[0] : '林'),
      bg: p.bg || '#5a2a4a',
      age: p.age || 24,
      pronoun: p.pronoun || '她',
      answers: {...(p.answers || {})}
    };
    renderPlayerEdit();
    showScreen('playerEdit');
  }

  function renderPlayerEdit(){
    const s = playerEditState;
    if(!s) return;
    const quiz = STORY.playerCustomization?.personalityQuiz || [];
    let html = `<div class="player-edit-title">编辑主角档案</div>
      <div class="player-edit-sub">自定义姓名、昵称和性格画像</div>`;
    // 基本信息
    html += `<div class="player-edit-field">
      <div class="player-edit-label">姓名</div>
      <input class="player-edit-input" id="pe-name" type="text" maxlength="6" value="${escapeHtml(s.name)}">
    </div>`;
    html += `<div class="player-edit-field">
      <div class="player-edit-label">昵称（闺蜜/男主称呼你的小名基础）</div>
      <input class="player-edit-input" id="pe-nick" type="text" maxlength="6" value="${escapeHtml(s.nickname)}">
    </div>`;
    html += `<div class="player-edit-field">
      <div class="player-edit-label">年龄</div>
      <input class="player-edit-input" id="pe-age" type="number" min="18" max="40" value="${s.age}">
    </div>`;
    // 头像底色
    html += `<div class="player-edit-field">
      <div class="player-edit-label">头像底色</div>
      <div class="player-edit-color-row" id="pe-colors">
        ${PLAYER_COLORS.map(c=>`<div class="player-edit-color-opt ${c===s.bg?'selected':''}" data-pe-color="${c}" style="background:${c}"></div>`).join('')}
      </div>
    </div>`;
    // 称谓
    html += `<div class="player-edit-field">
      <div class="player-edit-label">称谓</div>
      <div class="player-edit-pronoun-row" id="pe-pronouns">
        ${['她','他','TA'].map(pn=>`<div class="player-edit-pronoun-opt ${pn===s.pronoun?'selected':''}" data-pe-pronoun="${pn}">${pn}</div>`).join('')}
      </div>
    </div>`;
    // 性格问答
    html += '<div class="player-edit-label" style="margin-top:8px;">性格问答（影响初始画像）</div>';
    quiz.forEach(q=>{
      const sel = s.answers[q.id];
      html += `<div class="player-edit-question">
        <div class="player-edit-question-text">${escapeHtml(q.question)}</div>
        <div class="player-edit-options">`;
      q.options.forEach((opt, i)=>{
        html += `<div class="player-edit-opt ${i===sel?'selected':''}" data-pe-quiz="${q.id}" data-pe-idx="${i}">
          ${escapeHtml(opt.text)}
          ${opt.label ? `<span class="player-edit-opt-label">${escapeHtml(opt.label)}</span>` : ''}
        </div>`;
      });
      html += '</div></div>';
    });
    // 操作按钮
    html += `<div class="player-edit-actions">
      <button class="player-edit-btn secondary" data-action="cancel-player-edit">取消</button>
      <button class="player-edit-btn" data-action="save-player">保存</button>
    </div>`;
    $('player-edit-content').innerHTML = html;
  }

  function capturePlayerEditInputs(){
    if(!playerEditState) return;
    const name = $('pe-name');
    const nickname = $('pe-nick');
    const age = $('pe-age');
    if(name) playerEditState.name = name.value.slice(0, 6);
    if(nickname) playerEditState.nickname = nickname.value.slice(0, 6);
    if(age) playerEditState.age = Math.max(18, Math.min(40, parseInt(age.value) || 24));
  }

  function handlePlayerEditClick(target){
    // 颜色选择
    const colorOpt = target.closest('[data-pe-color]');
    if(colorOpt){
      capturePlayerEditInputs();
      playerEditState.bg = colorOpt.dataset.peColor;
      renderPlayerEdit();
      return true;
    }
    // 称谓选择
    const pronounOpt = target.closest('[data-pe-pronoun]');
    if(pronounOpt){
      capturePlayerEditInputs();
      playerEditState.pronoun = pronounOpt.dataset.pePronoun;
      renderPlayerEdit();
      return true;
    }
    // 性格问答选择
    const quizOpt = target.closest('[data-pe-quiz]');
    if(quizOpt){
      capturePlayerEditInputs();
      playerEditState.answers[quizOpt.dataset.peQuiz] = parseInt(quizOpt.dataset.peIdx);
      renderPlayerEdit();
      return true;
    }
    return false;
  }

  function savePlayer(){
    if(!playerEditState) return;
    capturePlayerEditInputs();
    const nameInput = $('pe-name');
    const nickInput = $('pe-nick');
    const ageInput = $('pe-age');
    const name = (nameInput?.value || '').trim() || '林夏';
    const nickname = (nickInput?.value || '').trim() || '夏夏';
    const age = Math.max(18, Math.min(40, parseInt(ageInput?.value) || 24));
    // 头像取姓名首字
    const avatar = name[0];
    const newAnswers = playerEditState.answers;
    const quiz = STORY.playerCustomization?.personalityQuiz || [];
    engine.updatePlayerProfile({
      name, nickname, avatar, age,
      bg: playerEditState.bg,
      pronoun: playerEditState.pronoun,
      answers: newAnswers
    });
    // 完成性问答题标志
    if(Object.keys(newAnswers).length >= quiz.length){
      engine.state.playerQuizDone = true;
      engine.emit('stateChange', engine.state);
    }
    playerEditState = null;
    toast('档案已保存');
    renderPlayer();
    showScreen('player');
  }

  // 监听主角变化刷新
  engine.on('playerChanged', ()=>{
    if(screens.player && screens.player.classList.contains('active')) renderPlayer();
  });

  // ===== v0.0.13 关系阶段 App =====
  function renderRelations(){
    const content = $('relations-content');
    const all = engine.getAllRelationshipStages();
    let html = '';
    all.forEach(r=>{
      const char = STORY.characters[r.charId];
      if(!char) return;
      const stages = STORY.relationshipStages?.[r.charId] || [];
      const curStageNum = r.stageNum;
      const aff = r.affection;
      const maxAff = stages[stages.length-1]?.maxAff || 99;
      const pct = Math.min(100, (aff / maxAff) * 100);
      html += `<div class="rel-card">
        <div class="rel-card-header">
          <div class="rel-card-avatar" style="background:${char.bg}">${char.avatar}</div>
          <div class="rel-card-info">
            <div class="rel-card-name">${escapeHtml(char.name)}</div>
            <div class="rel-card-stage">阶段 ${curStageNum} · ${escapeHtml(r.stage.name)} · ${escapeHtml(r.stage.title)}</div>
            <div class="rel-card-aff">好感度 ${aff}</div>
          </div>
        </div>
        <div class="rel-card-bar">
          <div class="rel-card-bar-fill" style="width:${pct}%"></div>
          <div class="rel-card-bar-marks">
            ${stages.map(()=>'<div class="rel-card-bar-mark"></div>').join('')}
          </div>
        </div>
        <div class="rel-stages">`;
      stages.forEach(s=>{
        const isCurrent = s.stage === curStageNum;
        const isPassed = s.stage < curStageNum;
        const isLocked = s.stage > curStageNum;
        const cls = isCurrent ? 'current' : (isPassed ? 'passed' : 'locked');
        html += `<div class="rel-stage-item ${cls}">
          <div class="rel-stage-dot"></div>
          <div class="rel-stage-info">
            <div class="rel-stage-name">阶段 ${s.stage} · ${escapeHtml(s.name)}</div>
            <div class="rel-stage-title">${escapeHtml(s.title)}</div>
            <div class="rel-stage-desc">${escapeHtml(s.desc)}</div>
            ${isCurrent && s.unlockMsg ? `<div class="rel-stage-unlock">"${escapeHtml(s.unlockMsg)}"</div>` : ''}
            ${s.criticalEvent && !isLocked ? `<div class="rel-stage-unlock" style="color:#ffd566">★ 临界事件已配置</div>` : ''}
          </div>
        </div>`;
      });
      html += '</div></div>';
    });
    content.innerHTML = html;
  }

  // 关系阶段提升提示
  engine.on('relationshipStageUp', ({charId, stage, prevStage})=>{
    const char = STORY.characters[charId];
    if(!char) return;
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = `★ ${char.name} 关系阶段提升：${stage.name} · ${stage.title}`;
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 4000);
    if(stage.unlockMsg){
      toast(stage.unlockMsg);
    }
    if(screens.relations && screens.relations.classList.contains('active')){
      renderRelations();
    }
  });

  // ===== v0.0.13 每日任务 App =====
  function renderTasks(){
    // 顶部连胜
    $('tasks-streak').textContent = '🔥 ' + (engine.state.taskStreak || 0);
    const content = $('tasks-content');
    const tasks = engine.getDailyTasks();
    let html = `<div class="tasks-streak-banner">
      <div class="tasks-streak-num">${engine.state.taskStreak || 0}</div>
      <div class="tasks-streak-label">连续完成天数</div>
      <div class="tasks-streak-hint">${tasks.every(t=>t.completed) && tasks.length>0 ? '今日已全部完成 ✓' : `今日完成 ${tasks.filter(t=>t.completed).length}/${tasks.length}`}</div>
    </div>`;
    // 今日任务列表
    html += '<div class="tasks-section-title">今日任务</div>';
    if(tasks.length === 0){
      html += '<div style="font-size:12px;color:var(--ink-mute);padding:8px 0;">暂无任务</div>';
    } else {
      tasks.forEach(t=>{
        html += `<div class="task-item ${t.completed?'done':''}">
          <div class="task-check">${t.completed ? '✓' : ''}</div>
          <div class="task-info">
            <div class="task-name">${escapeHtml(t.name)}</div>
            <div class="task-desc">${escapeHtml(t.desc)}</div>
          </div>
          <div class="task-reward">+${t.reward?.coins || 0} 💰</div>
        </div>`;
      });
    }
    // 连胜奖励
    const rewards = STORY.dailyTasks?.streakRewards || [];
    if(rewards.length > 0){
      html += '<div class="tasks-section-title">连胜奖励</div>';
      html += '<div class="tasks-streak-rewards">';
      rewards.forEach(r=>{
        const claimed = engine.state.taskStreakClaimed[r.days];
        const unlocked = (engine.state.taskStreak || 0) >= r.days;
        const cls = claimed ? 'claimed' : (unlocked ? 'unlocked' : '');
        html += `<div class="streak-reward-item ${cls}">
          <div class="streak-reward-days">${r.days}天</div>
          <div class="streak-reward-info">
            <div class="streak-reward-name">${escapeHtml(r.name)}</div>
            <div class="streak-reward-desc">${escapeHtml(r.desc)} · 奖励 ${r.reward?.coins||0}💰${r.reward?.collectible?' +纪念品':''}</div>
          </div>
          ${claimed ? '<div class="streak-reward-claimed">已领取 ✓</div>' :
            (unlocked ? `<button class="streak-reward-claim" data-action="claim-streak" data-days="${r.days}">领取</button>` :
            `<div style="font-size:10px;color:var(--ink-mute)">还差 ${r.days - (engine.state.taskStreak||0)} 天</div>`)}
        </div>`;
      });
      html += '</div>';
    }
    content.innerHTML = html;
  }

  // 任务完成通知
  engine.on('dailyTaskCompleted', (tasks)=>{
    tasks.forEach(t=>{
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `✅ 任务完成：${t.name} +${t.reward?.coins||0}💰`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 3000);
    });
    if(screens.tasks && screens.tasks.classList.contains('active')){
      renderTasks();
    }
  });
  engine.on('streakRewardClaimed', (r)=>{
    toast(`连胜奖励：${r.name} +${r.reward?.coins||0}💰`);
    if(screens.tasks && screens.tasks.classList.contains('active')){
      renderTasks();
    }
  });
  engine.on('streakRewardAvailable', (rewards)=>{
    rewards.forEach(r=>{
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `🎁 连胜 ${r.days} 天达成！可领取：${r.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 4500);
    });
    if(screens.tasks && screens.tasks.classList.contains('active')){
      renderTasks();
    }
  });

  function claimStreakReward(days){
    const ok = engine.claimStreakReward(days);
    if(!ok) toast('暂不可领取');
    renderTasks();
  }

  // ===== v0.0.13 观赏模式 App =====
  function renderWatch(){
    const content = $('watch-content');
    const isOn = engine.state.watchMode;
    const curStrategy = engine.state.watchStrategy || 'balanced';
    const strategies = STORY.watchMode?.strategies || {};
    let html = `<div class="watch-status-card">
      <div class="watch-status-icon">${isOn ? '🎬' : '⏸'}</div>
      <div class="watch-status-title">${isOn ? '观赏模式 · 运行中' : '观赏模式 · 未开启'}</div>
      <div class="watch-status-sub">${isOn ? `策略：${escapeHtml(strategies[curStrategy]?.name || '平衡')}` : '开启后剧情将自动推进'}</div>
      <button class="watch-toggle-btn ${isOn?'off':''}" data-action="toggle-watch">${isOn ? '停止观赏' : '开启观赏模式'}</button>
    </div>`;
    html += '<div class="watch-section-title">选择自动策略</div>';
    html += '<div class="watch-strategy-list">';
    Object.values(strategies).forEach(s=>{
      html += `<div class="watch-strategy-item ${s.id===curStrategy?'selected':''}" data-watch-strategy="${s.id}">
        <div class="watch-strategy-icon">${WATCH_ICONS[s.id] || '🎯'}</div>
        <div class="watch-strategy-info">
          <div class="watch-strategy-name">${escapeHtml(s.name)}</div>
          <div class="watch-strategy-desc">${escapeHtml(s.desc)}</div>
        </div>
        ${s.id===curStrategy ? '<div class="watch-strategy-check">✓</div>' : ''}
      </div>`;
    });
    html += '</div>';
    html += `<div class="watch-info">
      💡 观赏模式下，遇到选项时引擎会按所选策略自动选择，剧情自动推进。适合反复体验不同路线与结局。<br>
      · 平衡：折中选择，体验完整剧情<br>
      · 好感优先：优先好感度+最高的选项<br>
      · 理性/感性：按性格偏好选择<br>
      · 随机：完全随机，可能触发不同结局
    </div>`;
    content.innerHTML = html;
  }
  const WATCH_ICONS = {balanced:'🎯', affection:'💖', rational:'🧠', emotional:'💫', random:'🎲'};

  function toggleWatchMode(){
    const newOn = !engine.state.watchMode;
    engine.setWatchMode(newOn);
    toast(newOn ? '观赏模式已开启' : '观赏模式已停止');
    renderWatch();
  }
  function setWatchStrategy(strategyId){
    engine.setWatchMode(engine.state.watchMode, strategyId);
    toast('策略已切换');
    renderWatch();
  }

  // ===== v0.0.15 好感度深度 App =====
  function renderAffection(){
    const content = $('affection-content');
    if(!content) return;
    const list = engine.getAllAffectionDetail();
    const dims = STORY.affectionDimensions || {};
    let html = '';
    list.forEach(item => {
      const char = STORY.characters[item.charId];
      if(!char) return;
      const total = item.detail.closeness + item.detail.trust + item.detail.tension;
      const aff = engine.state.affection[item.charId] || 0;
      html += `<div class="aff-dim-card">
        <div class="aff-dim-header">
          <div class="aff-dim-avatar" style="background:${char.bg}">${escapeHtml(char.avatar)}</div>
          <div class="aff-dim-info">
            <div class="aff-dim-name">${escapeHtml(char.name)}</div>
            <div class="aff-dim-total">综合好感 <strong>${aff}</strong> · 三轴合计 ${total}</div>
          </div>
        </div>`;
      ['closeness','trust','tension'].forEach(dimId => {
        const dim = dims[dimId] || {};
        const v = item.detail[dimId] || 0;
        const stage = item.stages[dimId] || {name:'-'};
        const pct = Math.min(100, (v/40)*100); // 40 为满格刻度
        html += `<div class="aff-dim-row">
          <div class="aff-dim-row-header">
            <div class="aff-dim-label">${dim.icon||''} ${escapeHtml(dim.name||dimId)}<span class="aff-dim-stage">${escapeHtml(stage.name||'-')}</span></div>
            <div class="aff-dim-value"><strong>${v}</strong></div>
          </div>
          <div class="aff-dim-bar"><div class="aff-dim-bar-fill ${dimId}" style="width:${pct}%"></div></div>
        </div>`;
      });
      html += `</div>`;
    });
    html += `<div class="watch-info" style="margin-top:6px;">
      💡 三轴说明：<br>
      · 🤝 亲密度：一起经历的事越多越亲密<br>
      · 🔐 信任度：他愿意对你敞开心扉的程度<br>
      · 💫 暧昧度：心跳加速的瞬间累积<br>
      新剧情选项会精细驱动三轴，旧选项按 50%/30%/20% 自动折算。
    </div>`;
    content.innerHTML = html;
  }

  // ===== v0.0.15 主题壁纸 App =====
  function renderThemes(){
    const content = $('themes-content');
    if(!content) return;
    const themes = STORY.themes || {};
    const iconThemes = STORY.iconThemes || {};
    const curTheme = engine.state.currentTheme || 'default';
    const curIcon = engine.state.currentIconTheme || 'default';
    let html = '<div class="themes-section-title">壁纸主题</div><div class="themes-grid">';
    Object.values(themes).forEach(t => {
      const unlocked = !!engine.state.unlockedThemes[t.id];
      const selected = t.id === curTheme;
      html += `<div class="theme-card ${unlocked?'':'locked'} ${selected?'selected':''}" data-theme="${escapeHtml(t.id)}">
        <div class="theme-card-bg ${escapeHtml(t.wallpaper||'gradient')}"></div>
        <div class="theme-card-overlay">
          <div class="theme-card-name">${escapeHtml(t.name)}</div>
          <div class="theme-card-unlock">${unlocked ? '已解锁' : escapeHtml(t.unlockDesc||'未解锁')}</div>
        </div>
        ${selected ? '<div class="theme-card-check">✓</div>' : ''}
      </div>`;
    });
    html += '</div>';
    html += '<div class="themes-section-title">图标主题</div><div class="icon-theme-list">';
    Object.values(iconThemes).forEach(t => {
      const unlocked = !!engine.state.unlockedIconThemes[t.id];
      const selected = t.id === curIcon;
      html += `<div class="icon-theme-item ${unlocked?'':'locked'} ${selected?'selected':''}" data-icon-theme="${escapeHtml(t.id)}">
        <div class="icon-theme-preview">${selected?'✓':'🎨'}</div>
        <div class="icon-theme-info">
          <div class="icon-theme-name">${escapeHtml(t.name)}</div>
          <div class="icon-theme-unlock">${unlocked ? '已解锁' : escapeHtml(t.unlockDesc||'未解锁')}</div>
        </div>
      </div>`;
    });
    html += '</div>';
    html += `<div class="watch-info" style="margin-top:14px;">
      💡 主题通过剧情、任务、成就解锁。壁纸与图标独立切换，互不影响。<br>
      当前壁纸：<strong>${escapeHtml(themes[curTheme]?.name||'默认')}</strong> · 当前图标：<strong>${escapeHtml(iconThemes[curIcon]?.name||'默认')}</strong>
    </div>`;
    content.innerHTML = html;
  }
  function handleThemeClick(themeId){
    if(!engine.state.unlockedThemes[themeId]){
      toast('该主题尚未解锁');
      return;
    }
    const ok = engine.setTheme(themeId);
    if(ok){
      applyThemeToBody();
      toast('壁纸已切换');
      renderThemes();
    }
  }
  function handleIconThemeClick(themeId){
    if(!engine.state.unlockedIconThemes[themeId]){
      toast('该图标主题尚未解锁');
      return;
    }
    const ok = engine.setIconTheme(themeId);
    if(ok){
      toast('图标主题已切换');
      renderThemes();
    }
  }
  // 把当前主题颜色变量写入 body，实现真实壁纸切换
  function applyThemeToBody(){
    const t = engine.getCurrentTheme ? engine.getCurrentTheme() : null;
    if(!t) return;
    if(t.bg) document.body.style.setProperty('--bg', t.bg);
    if(t.accent) document.body.style.setProperty('--accent', t.accent);
    // 关键：写入 --wallpaper-1，让锁屏/主屏/背景层真正切换壁纸
    if(t.wallpaperVar) document.body.style.setProperty('--wallpaper-1', t.wallpaperVar);
  }

  // ===== v0.0.15 结局图鉴 App =====
  function renderEndings(){
    const content = $('endings-content');
    if(!content) return;
    const all = engine.getEndingGallery();
    const tiers = [
      {id:'GOOD',   label:'Good Ending · 完美结局'},
      {id:'NORMAL', label:'Normal Ending · 普通结局'},
      {id:'BAD',    label:'Bad Ending · 遗憾结局'},
      {id:'HIDDEN', label:'Hidden Ending · 隐藏结局'}
    ];
    // 预测当前结局走向
    const curEndingId = engine.computeCurrentEnding ? engine.computeCurrentEnding() : null;
    const curEnding = curEndingId ? (STORY.endingGallery||{})[curEndingId] : null;
    let html = '';
    if(curEnding){
      html += `<div class="aff-dim-card" style="border-color:rgba(255,95,168,0.4);">
        <div class="aff-dim-name" style="margin-bottom:6px;">🔮 当前走向预测</div>
        <div class="ending-card-char">${escapeHtml(curEnding.charId ? (STORY.characters[curEnding.charId]?.name||curEnding.charId) : '独行线')}</div>
        <div class="ending-card-name">${escapeHtml(curEnding.name)}</div>
        <div class="ending-card-desc">${escapeHtml(curEnding.desc)}</div>
      </div>`;
    } else if(engine.state.route){
      html += `<div class="watch-info" style="margin-bottom:12px;">当前路线：<strong>${escapeHtml(STORY.characters[engine.state.route]?.name || engine.state.route)}</strong>，结局尚未达成。</div>`;
    } else {
      html += `<div class="watch-info" style="margin-bottom:12px;">尚未进入任何路线。完成剧情后这里会预测你的结局走向。</div>`;
    }
    tiers.forEach(tier => {
      const items = all.filter(e => e.tier === tier.id);
      if(items.length === 0) return;
      html += `<div class="endings-tier-title ${tier.id.toLowerCase()}">${escapeHtml(tier.label)} · ${items.filter(e=>e.seen).length}/${items.length}</div>`;
      html += '<div class="endings-grid">';
      items.forEach(e => {
        html += `<div class="ending-card ${e.seen?'seen':'unseen'}">
          <div class="ending-card-tier ${e.tier}">${e.tier}</div>
          <div class="ending-card-char">${escapeHtml(e.charName)}</div>
          <div class="ending-card-name">${e.seen ? escapeHtml(e.name) : '???'}</div>
          <div class="ending-card-desc">${e.seen ? escapeHtml(e.desc) : '尚未解锁此结局，继续游戏以发现它。'}</div>
        </div>`;
      });
      html += '</div>';
    });
    content.innerHTML = html;
    updateEndingsBadge();
  }

  // ===== v0.0.15 约会 App =====
  function renderDates(){
    const content = $('dates-content');
    if(!content) return;
    const stats = engine.getDateStats();
    let html = '';
    stats.forEach(s => {
      const char = STORY.characters[s.charId];
      if(!char) return;
      const statusText = s.canDate ? (s.availableScenes.length > 0 ? '可约会' : '本周场景已体验完') : `冷却中 · 剩${s.remainingDays}天`;
      const statusClass = s.canDate && s.availableScenes.length > 0 ? 'available' : 'cooldown';
      html += `<div class="date-char-card">
        <div class="date-char-header">
          <div class="date-char-avatar" style="background:${char.bg}">${escapeHtml(char.avatar)}</div>
          <div class="date-char-info">
            <div class="date-char-name">${escapeHtml(char.name)}</div>
            <div class="date-char-status ${statusClass}">${statusText}</div>
            <div class="date-char-progress">已体验 ${s.doneScenes}/${s.totalScenes}</div>
          </div>
        </div>
        <div class="date-scenes-list">`;
      const allScenes = (STORY.dateScenes && STORY.dateScenes[s.charId]) || [];
      allScenes.forEach(sc => {
        const isDone = !!engine.state.firedEvents[sc.id];
        const canPick = !isDone && s.canDate;
        const cls = isDone ? 'done' : (canPick ? '' : 'locked');
        const statusHtml = isDone
          ? '<span class="date-scene-status done">已体验</span>'
          : (canPick ? '<span class="date-scene-status available">可约会</span>' : '');
        html += `<div class="date-scene-item ${cls}" ${canPick?`data-date="${escapeHtml(sc.id)}"`:''}>
          <div class="date-scene-name">${escapeHtml(sc.name)}${statusHtml}</div>
          <div class="date-scene-desc">${escapeHtml(sc.desc)}</div>
        </div>`;
      });
      if(allScenes.length === 0){
        html += '<div class="date-scene-desc">暂无场景</div>';
      }
      html += `</div></div>`;
    });
    html += `<div class="watch-info" style="margin-top:6px;">
      💡 每位男主每周（游戏内7天）可约会1次。完成约会会提升三轴好感，部分场景会解锁独家照片。
    </div>`;
    content.innerHTML = html;
    updateDatesBadge();
  }

  // 约会模态：展示对话并允许完成
  let currentDateScene = null;
  function openDateScene(sceneId){
    let charId = null, scene = null;
    for(const cid in STORY.dateScenes || {}){
      const found = (STORY.dateScenes[cid]||[]).find(s=>s.id===sceneId);
      if(found){ charId = cid; scene = found; break; }
    }
    if(!scene || !charId) return;
    currentDateScene = {charId, sceneId, scene};
    const char = STORY.characters[charId];
    const content = $('date-scene-content');
    let html = `<div class="date-scene-title">${escapeHtml(scene.name)}</div>
      <div class="date-scene-bg-char" style="background:${char.bg}">${escapeHtml(char.avatar)}</div>
      <div class="date-dialogue-list">`;
    (scene.dialogue||[]).forEach(d => {
      const who = d.who === 'me' ? 'me' : 'him';
      html += `<div class="date-dialogue-item ${who}">${escapeHtml(d.text||'')}</div>`;
    });
    html += `</div>
      <div class="date-scene-actions">
        <button class="date-scene-btn secondary" data-action="close-date">先离开</button>
        <button class="date-scene-btn" data-action="finish-date" data-finish-date="${escapeHtml(sceneId)}">完成约会</button>
      </div>`;
    content.innerHTML = html;
    showScreen('dateScene');
  }
  function closeDateScene(){
    // 玩家点"先离开"时取消约会，不消耗本周名额
    if(engine.cancelDate) engine.cancelDate();
    currentDateScene = null;
    showScreen('dates');
  }
  function handleDateClick(sceneId){
    if(!sceneId) return;
    const res = engine.startDate(sceneId);
    if(!res.ok){
      toast(res.reason || '无法发起约会');
      return;
    }
    openDateScene(sceneId);
  }
  function handleFinishDate(sceneId){
    const ok = engine.finishDate(sceneId);
    if(!ok){
      toast('约会结算失败');
      return;
    }
    const scene = currentDateScene && currentDateScene.scene;
    currentDateScene = null;
    toast(scene ? `完成「${scene.name}」` : '约会完成');
    renderDates();
    showScreen('dates');
  }

  // ===== v0.0.15 引擎事件监听 =====
  engine.on('themesUnlocked', (items)=>{
    if(!items || items.length === 0) return;
    items.forEach(it => {
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `🎨 解锁${it.type==='theme'?'壁纸':'图标'}主题：${it.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 4500);
    });
    if(screens.themes && screens.themes.classList.contains('active')){
      renderThemes();
    }
  });
  engine.on('themeChanged', ()=>{
    applyThemeToBody();
  });
  engine.on('endingGalleryUpdated', ()=>{
    updateEndingsBadge();
    if(screens.endings && screens.endings.classList.contains('active')){
      renderEndings();
    }
  });
  engine.on('dateStarted', ({charId, scene})=>{
    // 用引擎事件触发模态（外部触发也支持）
    if(scene && !currentDateScene){
      openDateScene(scene.id);
    }
  });
  engine.on('dateFinished', ()=>{
    updateDatesBadge();
  });

  // ===== v0.0.16 梦魇 App =====
  function renderDreams(){
    const content = $('dreams-content');
    if(!content) return;
    const all = Object.values(STORY.nightmares || {});
    const seen = engine.state.nightmaresSeen || {};
    let html = `<div class="watch-info" style="margin-bottom:12px;">
      💡 当三轴好感过低或暧昧却不够信任时，夜晚会触发梦魇。梦魇影响次日心情与性格画像。<br>
      已触发 ${all.filter(n=>seen[n.id]).length}/${all.length} 个梦魇。
    </div>`;
    all.forEach(nm => {
      const isSeen = !!seen[nm.id];
      html += `<div class="dream-card ${isSeen?'seen':'unseen'}">
        <div class="dream-card-status">${isSeen?'已触发':'未触发'}</div>
        <div class="dream-card-icon">🌙</div>
        <div class="dream-card-name">${isSeen ? escapeHtml(nm.name) : '???'}</div>
        <div class="dream-card-desc">${isSeen ? escapeHtml(nm.desc) : '尚未触发此梦魇。'}</div>
      </div>`;
    });
    content.innerHTML = html;
    updateDreamsBadge();
  }

  // 梦魇触发模态
  let currentNightmare = null;
  function openNightmareScreen(nm){
    currentNightmare = nm;
    const content = $('nightmare-content');
    let html = `<div class="nightmare-title">🌙 ${escapeHtml(nm.name)}</div>`;
    html += '<div class="nightmare-dialogue">';
    (nm.dialogue||[]).forEach(d => {
      const who = d.who === 'me' ? 'me' : (d.who === 'narrator' ? 'narrator' : 'him');
      html += `<div class="nightmare-dialogue-item ${who}">${escapeHtml(d.text||'')}</div>`;
    });
    html += '</div>';
    if(nm.resolve){
      html += `<div class="nightmare-prompt">${escapeHtml(nm.resolve.prompt||'你的选择：')}</div>`;
      html += '<div class="nightmare-options">';
      nm.resolve.options.forEach((opt, idx) => {
        html += `<button class="nightmare-opt" data-nightmare-opt="${idx}">${escapeHtml(opt.text)}</button>`;
      });
      html += '</div>';
    } else {
      html += `<div class="nightmare-options">
        <button class="nightmare-opt" data-action="close-nightmare">醒来</button>
      </div>`;
    }
    content.innerHTML = html;
    showScreen('nightmare');
  }
  function closeNightmareScreen(){
    currentNightmare = null;
    if(!restorePendingUi()) showScreen('home');
  }
  function handleNightmareOpt(optIdx){
    if(!currentNightmare) return;
    const nm = currentNightmare;
    if(!engine.resolveNightmare(nm.id, optIdx)) return;
    toast('梦魇已解');
    currentNightmare = null;
    if(!restorePendingUi()) showScreen('home');
  }

  function restorePendingUi(){
    const activeNightmareId = engine.state.activeNightmare;
    if(activeNightmareId && STORY.nightmares?.[activeNightmareId]){
      openNightmareScreen(STORY.nightmares[activeNightmareId]);
      return true;
    }
    const activeDreamId = engine.state.activeDream;
    if(activeDreamId && STORY.dreams?.[activeDreamId]){
      openDreamScreen(activeDreamId, STORY.dreams[activeDreamId]);
      return true;
    }
    const pending = engine.getPendingInteractions?.()[0] || engine.state.pendingInteraction;
    if(pending?.type === 'call'){
      const evt = STORY.events?.[pending.eventId];
      const char = evt && STORY.characters?.[evt.from];
      if(evt?.type === 'call' && char){
        showIncomingCall({from:evt.from, name:char.name, script:evt.script, eventId:pending.eventId});
        return true;
      }
    }
    if(pending?.type === 'encounter'){
      const encounter = engine.getPendingEncounter?.();
      if(encounter){
        showEncounter(encounter);
        return true;
      }
    }
    if(pending?.type === 'narrator_choice' && pending.choice){
      showScreen('home');
      showNarratorChoice(pending.choice);
      return true;
    }
    if(pending?.type === 'route_choice' && !engine.state.route){
      showRouteChoiceModal(STORY.routeChoice);
      return true;
    }
    const advancing = engine.state.pendingTimeAdvances?.[0];
    if(advancing) showTimeAdvanceOverlay(STORY.events?.[advancing.eventId]?.text);
    return false;
  }

  // ===== v0.0.16 智能提示 App =====
  function renderHints(){
    const content = $('hints-content');
    if(!content) return;
    const isOn = !!engine.state.showOptionHints;
    let html = `<div class="hints-status-card">
      <div class="hints-status-icon">${isOn ? '💡' : '💤'}</div>
      <div class="hints-status-title">${isOn ? '智能提示 · 开启' : '智能提示 · 关闭'}</div>
      <div class="hints-status-sub">${isOn ? '选项下方会显示好感度/性格/剧情标记的影响预测' : '开启后，剧情选项会显示潜在影响提示'}</div>
      <button class="hints-toggle-btn ${isOn?'off':''}" data-action="toggle-hints">${isOn ? '关闭提示' : '开启提示'}</button>
    </div>`;
    html += `<div class="hints-example">
      <div class="hints-example-title">提示样式示例</div>
      <div class="hints-example-text">沈砚之 +2 · 沈砚之(亲密+1/信任+2) · 解锁 1 个剧情标记 · 性格+active/emotional</div>
    </div>`;
    html += `<div class="watch-info" style="margin-top:14px;">
      💡 适合二周目玩家或想提前规划路线的人。提示文案由选项的 effects 字段自动生成，不会泄露隐藏剧情。<br>
      · 数字提示：综合好感度增减<br>
      · 三轴提示：亲密度/信任度/暧昧度<br>
      · 标记提示：会影响哪些剧情分支<br>
      · 性格提示：会被记录的性格画像维度
    </div>`;
    content.innerHTML = html;
  }
  function toggleOptionHints(){
    engine.setShowOptionHints(!engine.state.showOptionHints);
    toast(engine.state.showOptionHints ? '智能提示已开启' : '智能提示已关闭');
    renderHints();
  }

  // ===== v0.0.16 男主朋友圈互动 UI =====
  // 在 renderMoments 时为每条朋友圈追加男主评论+回复选项
  // 这里给 engine.on('momentPosted') 添加触发评论生成的钩子
  // （renderMoments 内部直接读取 moment.comments 渲染）

  // ===== v0.0.16 引擎事件监听 =====
  engine.on('nightmareTriggered', (nm)=>{
    // 顶部通知
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = `🌙 梦魇触发：${nm.name}`;
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 4500);
    // 弹出梦魇模态
    openNightmareScreen(nm);
    updateDreamsBadge();
  });
  engine.on('nightmareResolved', ()=>{
    updateDreamsBadge();
  });
  engine.on('optionHintsToggled', ()=>{
    // 重新渲染聊天界面（如果正在显示）
    if(currentConvId && screens.chat.classList.contains('active')){
      const conv = engine.state.conversations[currentConvId];
      if(conv && conv.pendingChoice){
        showChatChoice(currentConvId, conv.pendingChoice);
      }
    }
  });
  engine.on('ambienceChange', (amb)=>{
    applyAmbienceToBody(amb);
  });
  engine.on('momentCommentsGenerated', ({momentId, comments})=>{
    // 把评论写到对应 moment 对象上（供 renderMoments 显示）
    const moment = engine.state.moments.find(m => m.id === momentId);
    if(moment){
      moment.charComments = comments;
    }
    if(screens.moments && screens.moments.classList.contains('active')){
      renderMoments();
    }
  });
  engine.on('momentReplySent', ({momentId, charId})=>{
    if(screens.moments && screens.moments.classList.contains('active')){
      renderMoments();
    }
    toast('已回复');
  });


  // ===== v0.1.0 存档 App =====
  function formatSaveTime(iso){
    if(!iso) return '—';
    try {
      const d = new Date(iso);
      if(Number.isNaN(d.getTime())) return '—';
      const pad = n => String(n).padStart(2,'0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch(_){
      return '—';
    }
  }
  function slotDisplayName(slot){
    if(slot === 'auto') return '自动存档';
    if(slot === 'slot1') return '手动槽位 1';
    if(slot === 'slot2') return '手动槽位 2';
    if(slot === 'slot3') return '手动槽位 3';
    return slot;
  }
  function updateSavesBadge(){
    const b = $('badge-saves');
    const counter = $('saves-counter');
    const slots = engine.listSaveSlots ? engine.listSaveSlots() : [];
    const used = slots.filter(s => !s.empty).length;
    if(b){
      if(used > 0){ b.textContent = used; b.hidden = false; }
      else b.hidden = true;
    }
    if(counter) counter.textContent = `${used}/${slots.length || 4}`;
  }
  function updateLockContinueBtn(){
    const btn = $('lock-continue-btn');
    if(!btn) return;
    const has = engine.hasAnySave ? engine.hasAnySave() : false;
    btn.hidden = !has;
  }
  function afterLoadRefresh(){
    resetTransientUi();
    updateTimeDisplay();
    updateBadges();
    updateSavesBadge();
    updateLockContinueBtn();
    applyThemeToBody();
    applyAmbienceToBody(engine.getCurrentAmbience ? engine.getCurrentAmbience() : null);
    // 关闭可能残留的覆盖层，再按存档中的进行中状态恢复。
    currentDateScene = null;
    if(screens.dateScene) screens.dateScene.classList.remove('active');
    if(screens.nightmare) screens.nightmare.classList.remove('active');
    return restorePendingUi();
  }
  function renderSaves(){
    const content = $('saves-content');
    if(!content || !engine.listSaveSlots) return;
    const slots = engine.listSaveSlots();
    let html = `<div class="saves-intro">自动存档会在关键进度变化时写入。手动槽位可长期保留；支持导出/导入 JSON。</div>`;
    slots.forEach(s => {
      const summary = s.summary || {};
      const title = slotDisplayName(s.slot);
      const tag = s.isAuto ? 'AUTO' : 'MANUAL';
      const meta = s.empty
        ? '空槽位 · 可写入当前进度'
        : `${escapeHtml(s.label || '')}<br>${escapeHtml(summary.playerName || '林夏')} · ${escapeHtml(summary.routeLabel || '未选线')}<br>${escapeHtml(formatSaveTime(s.time))}${s.note ? ' · ' + escapeHtml(s.note) : ''}`;
      html += `<div class="save-slot ${s.empty?'empty':''}">
        <div class="save-slot-top">
          <div class="save-slot-title">${escapeHtml(title)}</div>
          <div class="save-slot-tag">${tag}</div>
        </div>
        <div class="save-slot-meta">${meta}</div>
        <div class="save-slot-actions">
          <button class="save-btn primary" data-save-action="write" data-slot="${escapeHtml(s.slot)}">${s.empty?'写入':'覆盖写入'}</button>
          ${s.empty ? '' : `<button class="save-btn primary" data-save-action="load" data-slot="${escapeHtml(s.slot)}">读取</button>
          <button class="save-btn" data-save-action="export" data-slot="${escapeHtml(s.slot)}">导出</button>
          <button class="save-btn danger" data-save-action="delete" data-slot="${escapeHtml(s.slot)}">删除</button>`}
          <button class="save-btn" data-save-action="import" data-slot="${escapeHtml(s.slot)}">导入到此</button>
        </div>
      </div>`;
    });
    html += `<div class="saves-intro" style="margin-top:8px;">提示：删除仅影响本地浏览器存档，不会回滚剧情文件。</div>`;
    content.innerHTML = html;
    updateSavesBadge();
  }
  function downloadText(filename, text){
    const blob = new Blob([text], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setUiTimeout(()=> URL.revokeObjectURL(url), 1000);
  }
  function handleSaveAction(action, slot){
    if(!action) return;
    if(action === 'write'){
      const ok = engine.save(slot || 'slot1', {note: '手动存档'});
      toast(ok ? `已保存到 ${slotDisplayName(slot)}` : '保存失败');
      renderSaves();
      updateLockContinueBtn();
      return;
    }
    if(action === 'load'){
      const ok = engine.load(slot);
      if(ok){
        const restored = afterLoadRefresh();
        toast(`已读取 ${slotDisplayName(slot)}`);
        if(!restored) showScreen('home');
      } else toast('读取失败');
      return;
    }
    if(action === 'delete'){
      if(!confirm(`确认删除 ${slotDisplayName(slot)}？`)) return;
      const ok = engine.deleteSave(slot);
      toast(ok ? '已删除' : '删除失败');
      renderSaves();
      updateLockContinueBtn();
      return;
    }
    if(action === 'export'){
      const text = engine.exportSave(slot);
      if(!text){ toast('导出失败'); return; }
      downloadText(`neon-heart-${slot}.json`, text);
      toast('已导出');
      return;
    }
    if(action === 'import'){
      const input = $('save-import-input');
      if(!input){ toast('导入控件缺失'); return; }
      input.value = '';
      input.onchange = ()=>{
        const file = input.files && input.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = ()=>{
          const res = engine.importSave(String(reader.result || ''), slot || 'slot1');
          if(res && res.ok){
            toast(`已导入到 ${slotDisplayName(res.slot || slot)}`);
            renderSaves();
            updateLockContinueBtn();
          } else {
            toast('导入失败：' + (res?.reason || '未知错误'));
          }
        };
        reader.readAsText(file);
      };
      input.click();
    }
  }

  // 氛围层应用到 body
  function applyAmbienceToBody(amb){
    const overlay = amb?.wallpaperOverlay || 'transparent';
    document.body.style.setProperty('--ambience-overlay', overlay);
    // 应用到 #phone-frame::before
    const phoneFrame = document.getElementById('phone-frame');
    if(phoneFrame){
      phoneFrame.style.setProperty('--ambience-overlay', overlay);
    }
  }

  function handleMomentReply(replyData){
    // replyData 格式: `${momentId}|${charId}|${commentIdx}|${replyIdx}`
    const parts = replyData.split('|');
    if(parts.length !== 4) return;
    const [momentId, charId, commentIdx, replyIdx] = parts;
    engine.replyMomentComment(momentId, charId, parseInt(commentIdx), parseInt(replyIdx));
  }

  engine.on('gameSaved', ()=>{
    updateSavesBadge();
    updateLockContinueBtn();
    if(screens.saves && screens.saves.classList.contains('active')) renderSaves();
  });
  engine.on('gameLoaded', ()=>{
    afterLoadRefresh();
  });
  engine.on('gameDeleted', ()=>{
    updateSavesBadge();
    updateLockContinueBtn();
  });
  engine.on('gameImported', ()=>{
    updateSavesBadge();
    updateLockContinueBtn();
  });
  engine.on('saveFailed', ({error})=>{
    toast('存档失败：' + (error || '未知错误'));
  });

  // ===== 初始化 =====
  function init(){
    updateTimeDisplay();
    engine.startAutoSave();
    // 有存档则恢复进度，否则新开一局
    if(engine.hasAnySave()){
      const ok = engine.continueGame();
      if(!ok) engine.newGame();
    } else {
      engine.newGame();
    }
    afterLoadRefresh();
    // 启动后再强制写一次自动存档，保证下次能继续
    engine.autoSave(true);
    updateLockContinueBtn();
    showScreen('lock');
  }
  if(typeof window !== 'undefined' && (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')){
    window.__neonTest = {engine, restorePendingUi, showEncounter, closeEncounter};
  }
  init();
})();
