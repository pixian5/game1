/* ===== 霓虹心事 · UI：语音信箱与多人聊天群 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

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
        <div class="vm-icon">${avatarImg(char)}</div>
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
