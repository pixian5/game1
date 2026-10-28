/* ===== 霓虹心事 · UI：消息列表与单个会话渲染 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

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
        <div class="conv-avatar" style="background:${char.bg}">${avatarImg(char)}</div>
        <div class="conv-info">
          <div class="conv-top">
            <span class="conv-name">${char.name}</span>
            <span class="conv-time">${last?.time || ''}</span>
          </div>
          <div class="conv-preview">${conv.typing?'<span style="color:var(--accent)">正在输入…</span>':escapeHtml(preview)}</div>
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
    // v0.7.3 语音信箱徽章（未听条数）
    updateVmBadges();
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
    $('chat-avatar').innerHTML = avatarImg(char);
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
    const _t = window.t;  // v0.5.3（E4）：剧情文本英译出口
    if(m.from === 'me'){
      div.className = 'msg send';
      div.textContent = _t(m.text);
    } else if(m.from === 'narrator'){
      div.className = 'msg sys';
      div.textContent = _t(m.text);
    } else {
      div.className = 'msg recv' + (m.isFollowup ? ' is-followup' : '');
      div.textContent = _t(m.text);
    }
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = m.time || '';
    div.appendChild(time);
    body.appendChild(div);
  }
