/* ===== 霓虹心事 · UI：语音信箱与多人聊天群 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 语音信箱（v0.7.3 深化：未听计数/筛选、详情抽屉、波形播放）=====
  // 通关一次后这里会攒下 6 条以上留言，成了常驻功能；此前只有「一行摘要 + 播放/回拨」，
  // 且整条 item 是点击死区（样式写了 cursor:pointer 却没绑事件）。本版重做。
  //
  // v0.7.3：剧情文本英译出口——此前留言正文直接 escapeHtml 输出，英文模式下显示中文原文。
  const VMT = (text, vars) => (typeof window.t === 'function')
    ? window.t(text, vars)
    : (vars ? String(text).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : text);

  let vmFilter = 'all';     // 列表筛选：'all' 全部 | 'unheard' 未听
  let vmOpenId = null;      // 详情抽屉当前展示的留言 id
  let vmPlay = null;        // 播放状态 {id, total, elapsed, paused, stopTick}；纯 UI 态，不入存档

  // 秒 → m:ss
  function fmtVmTime(sec){
    const s = Math.max(0, Math.round(sec));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  // 稳定伪随机波形：以留言 id 作种子，保证同一条每次打开高度一致，不会闪
  function vmWaveHeights(id, count){
    let h = 2166136261;
    const src = String(id);
    for(let i = 0; i < src.length; i++) h = ((h ^ src.charCodeAt(i)) * 16777619) >>> 0;
    const out = [];
    for(let i = 0; i < count; i++){
      h = (h * 1103515245 + 12345) >>> 0;
      out.push(28 + ((h >>> 16) % 73));   // 28%~100%
    }
    return out;
  }
  // 100ms 节拍定时器：返回停止函数。走 setUiTimeout 以便随 resetTransientUi 统一清理
  function setUiInterval(fn, ms){
    let stopped = false;
    const tick = ()=>{
      if(stopped) return;
      fn();
      if(!stopped) setUiTimeout(tick, ms);
    };
    setUiTimeout(tick, ms);
    return ()=>{ stopped = true; };
  }
  function vmById(vmId){
    return (engine.state.voicemails || []).find(v => v.id === vmId) || null;
  }
  // 留言的展示形态：时长以原文为准（数据源），正文按当前语言显示。
  // 注意顺序——剧情翻译包的 key 是「含前缀的完整原文」（如「（语音信箱 6"）：……霓城没雾。」），
  // 所以必须先整条翻译再剥前缀；反过来先剥前缀就永远查不到译文（v0.7.3 实测踩到）。
  function vmDisplay(vm){
    const src = engine.voicemailMeta(vm.text);
    const localized = engine.voicemailMeta(VMT(vm.text));
    return {durationSec: src.durationSec, body: localized.body || src.body};
  }
  function vmUnreadCount(){
    return (engine.state.voicemails || []).filter(vm => !vm.heard).length;
  }

  function renderVoicemails(){
    const list = $('voicemail-list');
    if(!list) return;
    list.innerHTML = '';
    const all = engine.state.voicemails || [];
    const unheard = all.filter(vm => !vm.heard);
    const shown = vmFilter === 'unheard' ? unheard : all;

    // index.html 里的中文只是首屏占位，这里按当前语言刷一遍，保证英文模式下新 UI 也是英文
    const vmTab = document.querySelector('[data-phone-tab="voicemail"]');
    if(vmTab){
      const dot = vmTab.querySelector('.tab-dot');
      vmTab.textContent = VMT('语音信箱');
      if(dot) vmTab.appendChild(dot);
    }
    document.querySelectorAll('[data-vm-filter]').forEach(b=>{
      b.textContent = VMT(b.dataset.vmFilter === 'all' ? '全部' : '未听');
    });
    const readAllBtn = $('vm-read-all');
    if(readAllBtn) readAllBtn.textContent = VMT('全部标为已听');

    const hint = $('vm-filter-hint');
    if(hint) hint.textContent = all.length === 0 ? '' : VMT('共 {n} 条 · 未听 {m}', {n: all.length, m: unheard.length});
    if(readAllBtn) readAllBtn.disabled = unheard.length === 0;

    if(shown.length === 0){
      const title = all.length === 0 ? '还没有留言' : '没有未听的留言';
      const sub = all.length === 0 ? '电话打来却没接的时候，对方会在这里留下几秒钟的话。' : '所有留言都听过了。';
      list.innerHTML = `<div class="vm-empty">${escapeHtml(VMT(title))}<span class="vm-empty-sub">${escapeHtml(VMT(sub))}</span></div>`;
      updateVmBadges();
      return;
    }
    shown.forEach(vm => list.appendChild(vmListItem(vm)));
    updateVmBadges();
  }

  function vmListItem(vm){
    const char = STORY.characters[vm.from] || {name:'未知', avatar:'?', bg:'#3a3a5a'};
    const meta = vmDisplay(vm);
    const isPlaying = !!(vmPlay && vmPlay.id === vm.id && !vmPlay.paused);
    const item = document.createElement('div');
    item.className = 'voicemail-item' + (vm.heard ? '' : ' unheard') + (isPlaying ? ' playing' : '');
    item.dataset.vmOpen = vm.id;   // v0.7.3：修复——此前整条无事件，只有两个小按钮可点
    item.innerHTML = `
      <div class="vm-icon">${avatarImg(char)}</div>
      <div class="vm-info">
        <div class="vm-top">
          <span class="vm-name">${escapeHtml(VMT(char.name))}</span>
          ${vm.heard ? '' : '<span class="vm-new-dot"></span>'}
          <span class="vm-dur">${escapeHtml(fmtVmTime(meta.durationSec))}</span>
        </div>
        <div class="vm-text">${escapeHtml(meta.body)}</div>
        <div class="vm-meta">${escapeHtml(VMT('第 {day} 天', {day: vm.day}))} ${escapeHtml(vm.time)}</div>
      </div>
      <button class="vm-play-btn" data-vm-toggle="${escapeHtml(vm.id)}" aria-label="${escapeHtml(VMT('播放留言'))}">${isPlaying ? '❙❙' : '▶'}</button>
    `;
    return item;
  }

  // App 徽标 + tab 红点：挂进 updateBadges 统一入口，读档/开局/收到新留言都能刷新
  function updateVmBadges(){
    const n = vmUnreadCount();
    const dot = $('phone-vm-dot');
    if(dot) dot.hidden = n === 0;
    const badge = $('badge-phone');
    if(!badge) return;
    if(n > 0){ badge.textContent = String(n); badge.hidden = false; }
    else { badge.hidden = true; }
  }

  // ===== 播放控制 =====
  function toggleVmPlay(vmId){
    if(vmPlay && vmPlay.id === vmId){
      if(vmPlay.paused) resumeVmPlayback();
      else pauseVmPlayback();
      return;
    }
    startVmPlayback(vmId);
  }
  function startVmPlayback(vmId){
    const vm = vmById(vmId);
    if(!vm) return;
    stopVmPlayback();
    const total = engine.voicemailMeta(vm.text).durationSec;
    // 起播即标记已听：与旧版一致（点过播放就算听过），并触发「留言录音」收集品
    engine.playVoicemail(vmId);
    AudioSys.play('vmStart');
    AudioSys.startVoicemail(vm.from);
    vmPlay = {id: vmId, total, elapsed: 0, paused: false, stopTick: null};
    vmPlay.stopTick = setUiInterval(vmTick, 100);
    renderVoicemails();                          // 未听 → 已听
    if(vmOpenId === vmId) openVmDetail(vmId);    // 详情内的按钮/已听态同步重绘
    updateVmPlayUi();
  }
  function pauseVmPlayback(){
    if(!vmPlay || vmPlay.paused) return;
    vmPlay.paused = true;
    AudioSys.stopVoicemail();
    updateVmPlayUi();
  }
  function resumeVmPlayback(){
    if(!vmPlay || !vmPlay.paused) return;
    const vm = vmById(vmPlay.id);
    vmPlay.paused = false;
    AudioSys.startVoicemail(vm ? vm.from : null);
    updateVmPlayUi();
  }
  function stopVmPlayback(){
    if(!vmPlay) return;
    if(vmPlay.stopTick) vmPlay.stopTick();
    vmPlay = null;
    AudioSys.stopVoicemail();
    updateVmPlayUi();
  }
  function finishVmPlayback(){
    if(!vmPlay) return;
    const id = vmPlay.id;
    stopVmPlayback();
    AudioSys.play('vmEnd');
    renderVoicemails();
    if(vmOpenId === id) openVmDetail(id);
  }
  function vmTick(){
    if(!vmPlay || vmPlay.paused) return;
    vmPlay.elapsed = Math.min(vmPlay.total, vmPlay.elapsed + 0.1);
    if(vmPlay.elapsed >= vmPlay.total){ finishVmPlayback(); return; }
    updateVmPlayUi();
  }
  // 拖动进度条跳转：保持当前播放/暂停态，暂停时拖动不自动续播
  function seekVmByEvent(e){
    if(!vmPlay) return;
    const bar = $('vm-progress');
    if(!bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    vmPlay.elapsed = vmPlay.total * ratio;
    updateVmPlayUi();
  }

  // 只更新 DOM 上的播放态（不整体重渲染，避免把正在播放的节点换掉）
  function updateVmPlayUi(){
    const playing = !!(vmPlay && !vmPlay.paused);
    const toggle = document.querySelector('.vm-play-toggle');
    if(toggle) toggle.textContent = playing ? '❙❙' : '▶';
    const elapsedEl = $('vm-elapsed');
    if(elapsedEl) elapsedEl.textContent = vmPlay ? fmtVmTime(vmPlay.elapsed) : '0:00';
    renderVmProgress();
    document.querySelectorAll('.voicemail-item').forEach(el=>{
      const isPlaying = !!(vmPlay && vmPlay.id === el.dataset.vmOpen && !vmPlay.paused);
      el.classList.toggle('playing', isPlaying);
      const btn = el.querySelector('.vm-play-btn');
      if(btn) btn.textContent = isPlaying ? '❙❙' : '▶';
    });
  }
  function renderVmProgress(){
    const fill = $('vm-progress-fill'), knob = $('vm-progress-knob');
    const ratio = (vmPlay && vmPlay.total > 0) ? Math.min(1, vmPlay.elapsed / vmPlay.total) : 0;
    if(fill) fill.style.width = (ratio * 100) + '%';
    if(knob) knob.style.left = (ratio * 100) + '%';
    const bars = document.querySelectorAll('#vm-wave .vm-wave-bar');
    const lit = Math.round(ratio * bars.length);
    const playing = !!(vmPlay && !vmPlay.paused);
    bars.forEach((b, i)=>{
      b.classList.toggle('played', i < lit);
      b.classList.toggle('head', playing && i === lit - 1);
    });
  }
  function buildVmWave(vmId){
    const wave = $('vm-wave');
    if(!wave) return;
    wave.innerHTML = '';
    vmWaveHeights(vmId, 34).forEach(h=>{
      const bar = document.createElement('span');
      bar.className = 'vm-wave-bar';
      bar.style.height = h + '%';
      wave.appendChild(bar);
    });
  }

  // ===== 详情抽屉 =====
  function openVmDetail(vmId){
    const vm = vmById(vmId);
    if(!vm) return;
    vmOpenId = vmId;
    const char = STORY.characters[vm.from] || {name:'未知', avatar:'?'};
    const meta = vmDisplay(vm);
    const overlay = $('vm-overlay');
    if(!overlay) return;
    overlay.innerHTML = `
      <div class="vm-sheet">
        <div class="vm-sheet-head">
          <div class="vm-sheet-avatar">${avatarImg(char)}</div>
          <div>
            <div class="vm-sheet-title">${escapeHtml(VMT(char.name))}</div>
            <div class="vm-sheet-sub">${escapeHtml(VMT('第 {day} 天', {day: vm.day}))} ${escapeHtml(vm.time)} · ${escapeHtml(fmtVmTime(meta.durationSec))}</div>
          </div>
          <button class="vm-sheet-close" data-vm-close aria-label="${escapeHtml(VMT('关闭'))}">×</button>
        </div>
        <div class="vm-player">
          <div class="vm-wave" id="vm-wave"></div>
          <div class="vm-progress" id="vm-progress" role="slider" aria-label="${escapeHtml(VMT('播放进度'))}">
            <div class="vm-progress-track"></div>
            <div class="vm-progress-fill" id="vm-progress-fill"></div>
            <div class="vm-progress-knob" id="vm-progress-knob"></div>
          </div>
          <div class="vm-player-row">
            <button class="vm-play-toggle" data-vm-toggle="${escapeHtml(vm.id)}" aria-label="${escapeHtml(VMT('播放留言'))}">▶</button>
            <span class="vm-time" id="vm-elapsed">0:00</span>
            <span class="vm-time total" id="vm-total">${escapeHtml(fmtVmTime(meta.durationSec))}</span>
          </div>
        </div>
        <div class="vm-body">${escapeHtml(meta.body)}</div>
        <div class="vm-sheet-actions">
          ${vm.callbackEvent ? `<button class="vm-sheet-btn primary" data-vm-callback="${escapeHtml(vm.id)}">${escapeHtml(VMT('回拨'))}</button>` : ''}
          <button class="vm-sheet-btn" data-vm-read="${escapeHtml(vm.id)}"${vm.heard ? ' disabled' : ''}>${escapeHtml(VMT(vm.heard ? '已听完' : '标记已听'))}</button>
          <button class="vm-sheet-btn danger" data-vm-del="${escapeHtml(vm.id)}">${escapeHtml(VMT('删除'))}</button>
        </div>
      </div>
    `;
    overlay.hidden = false;
    buildVmWave(vm.id);
    const progress = $('vm-progress');
    if(progress) progress.addEventListener('click', seekVmByEvent);
    updateVmPlayUi();
  }
  function closeVmDetail(){
    stopVmPlayback();      // 关抽屉即停，避免合上面板后声音还在走
    vmOpenId = null;
    const overlay = $('vm-overlay');
    if(!overlay) return;
    overlay.hidden = true;
    overlay.innerHTML = '';
  }
  // 删除走二次确认（留言不可恢复）：首次点击转为待确认，3.5s 无操作自动复原
  function confirmDeleteVm(vmId, btn){
    if(btn.dataset.vmPending === '1'){
      stopVmPlayback();
      engine.deleteVoicemail(vmId);
      closeVmDetail();
      renderVoicemails();
      toast('留言已删除');
      return;
    }
    btn.dataset.vmPending = '1';
    btn.classList.add('pending');
    btn.textContent = VMT('确认删除？');
    setUiTimeout(()=>{
      if(!btn.isConnected) return;
      delete btn.dataset.vmPending;
      btn.classList.remove('pending');
      btn.textContent = VMT('删除');
    }, 3500);
  }

  // 电话 tabs 切换
  document.addEventListener('click', e=>{
    const tab = e.target.closest('[data-phone-tab]');
    if(tab){
      stopVmPlayback();   // v0.7.3：切走语音信箱面板时停播
      const tabName = tab.dataset.phoneTab;
      document.querySelectorAll('.phone-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('[data-phone-panel]').forEach(p=>{
        p.hidden = p.dataset.phonePanel !== tabName;
      });
      return;
    }
    const filterBtn = e.target.closest('[data-vm-filter]');
    if(filterBtn){
      vmFilter = filterBtn.dataset.vmFilter;
      document.querySelectorAll('[data-vm-filter]').forEach(b=> b.classList.toggle('active', b === filterBtn));
      renderVoicemails();
      return;
    }
    if(e.target.closest('#vm-read-all')){
      const n = engine.markAllVoicemailsRead ? engine.markAllVoicemailsRead() : 0;
      renderVoicemails();
      toast(n > 0 ? VMT('已标记 {n} 条为听完', {n}) : VMT('没有未听的留言'));
      return;
    }
    if(e.target.closest('[data-vm-close]')){ closeVmDetail(); return; }
    const toggleBtn = e.target.closest('[data-vm-toggle]');
    if(toggleBtn){ toggleVmPlay(toggleBtn.dataset.vmToggle); return; }
    const readBtn = e.target.closest('[data-vm-read]');
    if(readBtn){
      engine.markVoicemailRead(readBtn.dataset.vmRead);
      renderVoicemails();
      if(vmOpenId) openVmDetail(vmOpenId);
      toast('已标记为听完');
      return;
    }
    const delBtn = e.target.closest('[data-vm-del]');
    if(delBtn){ confirmDeleteVm(delBtn.dataset.vmDel, delBtn); return; }
    const cbBtn = e.target.closest('[data-vm-callback]');
    if(cbBtn){
      stopVmPlayback();
      engine.callbackVoicemail(cbBtn.dataset.vmCallback);
      closeVmDetail();
      toast('正在回拨…');
      return;
    }
    const openBtn = e.target.closest('[data-vm-open]');
    if(openBtn){ openVmDetail(openBtn.dataset.vmOpen); return; }
    const overlay = e.target.closest('#vm-overlay');
    if(overlay){ closeVmDetail(); return; }
  });

  // 新留言到达 / 状态变化时刷新计数（玩家此时可能不在电话 App 内）
  engine.on('voicemailReceived', ()=>{ updateVmBadges(); });
  engine.on('voicemailUpdate', ()=>{ updateVmBadges(); });
  engine.on('voicemailDeleted', ()=>{ updateVmBadges(); });

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
      const preview = last ? VMT(STORY.characters[last.from]?.name || '') + ': ' + last.text : '暂无消息';
      item.innerHTML = `
        <div class="group-avatar">群</div>
        <div class="group-info">
          <div class="conv-top">
            <span class="conv-name">${escapeHtml(VMT(g.name))}</span>
            <span class="conv-time">${last?.time || ''}</span>
          </div>
          <div class="group-preview">${g.typing?'<span style="color:var(--accent)">正在输入…</span>':escapeHtml(preview)}</div>
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
    $('group-chat-name').textContent = VMT(g.name);
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
        tag.textContent = VMT(char?.name || m.from);
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
    if(char && g) showNotif(from, VMT('在「{group}」发了消息', {group: VMT(g.name)}), ()=> openGroupChat(groupId));
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
