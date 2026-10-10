/* ===== 霓虹心事 · UI：引擎事件监听、梦魇、智能提示、朋友圈互动 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

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
