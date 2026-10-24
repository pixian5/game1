/* ===== 霓虹心事 · UI：全局点击委托（按钮/选项/导航的统一事件分发） =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 全局点击委托 =====
  document.body.addEventListener('click', e=>{
    if(e.target.closest('button')) AudioSys.play('tap');  // v0.1.7: 按键点击音
    const appBtn = e.target.closest('[data-app]');
    if(appBtn){ openApp(appBtn.dataset.app); return; }
    const backBtn = e.target.closest('[data-back]');
    if(backBtn){ showScreen(backBtn.dataset.back); return; }
    const convBtn = e.target.closest('[data-conv]');
    if(convBtn){ openConversation(convBtn.dataset.conv); return; }
    const photoBtn = e.target.closest('[data-photo]');
    if(photoBtn){ viewPhoto(photoBtn.dataset.photo); return; }
    const musicBtn = e.target.closest('[data-music]');
    if(musicBtn){ engine.playMusic(musicBtn.dataset.music); AudioSys.playTrack(musicBtn.dataset.music); return; }  // v0.4.10（E2）：点播真实出声
    // v0.1.7: 音乐 App 内的音效/环境音开关
    if(e.target.closest('#ss-sound')){ toggleSoundSetting(); return; }
    if(e.target.closest('#ss-bgm')){ toggleBgmSetting(); return; }
    // v0.5.0（E3 周目）：二周目——携带收集/成就/图鉴重开
    const ngBtn = e.target.closest('#btn-ngplus');
    if(ngBtn){
      engine.newGame({ngPlus: true});
      afterLoadRefresh();
      toast('二周目开始——收集与图鉴已继承');
      showScreen('lock');
      return;
    }
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
      case 'settings': renderSettings(); showScreen('settings'); break;
    }
  }

  // ===== v0.4.0 (D1.1 无障碍): 键盘可玩基础 =====
  // 原生 <button> 自带 Enter/Space 触发 click；此处补：锁屏回车解锁、非按钮可点元素回车触发、Esc 返回。
  document.addEventListener('keydown', e=>{
    const tag = (e.target && e.target.tagName) || '';
    if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;  // 表单内不拦截
    if(e.key === 'Escape'){
      const active = document.querySelector('.screen.active');
      if(active && active.id !== 'home-screen' && active.id !== 'lock-screen'){
        const back = active.querySelector('[data-back]');
        if(back) back.click(); else showScreen('home');
        e.preventDefault();
      }
      return;
    }
    if(e.key === 'Enter' || e.key === ' '){
      const lock = document.getElementById('lock-screen');
      if(lock && lock.classList.contains('active')){ lock.click(); e.preventDefault(); return; }
      const el = document.activeElement;
      if(el && el !== document.body && !/^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(el.tagName)){
        el.click();
        e.preventDefault();
      }
    }
  });
