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
    dream:$('dream-screen'), ending:$('ending-screen')
  };
  let currentConvId = null;
  let timeoutTimer = null;
  let selectedMomentArt = '';

  // ===== 屏幕切换 =====
  function showScreen(name){
    Object.values(screens).forEach(s=>s.classList.remove('active'));
    if(screens[name]) screens[name].classList.add('active');
  }

  // ===== Toast =====
  let toastTimer = null;
  function toast(msg){
    const t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{ t.hidden = true; }, 1500);
  }

  // ===== 通知 =====
  function showNotif(from, text){
    const char = STORY.characters[from];
    if(!char) return;
    const stack = $('notif-stack');
    const n = document.createElement('div');
    n.className = 'notif';
    n.innerHTML = `
      <div class="n-icon" style="background:${char.bg}">${char.avatar}</div>
      <div class="n-content">
        <div class="n-title">${char.name}</div>
        <div class="n-text">${text}</div>
      </div>
    `;
    n.onclick = ()=>{
      openConversation(from);
      n.remove();
    };
    stack.appendChild(n);
    setTimeout(()=> n.remove(), 5000);
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
    showScreen('home');
  });
  let lockSwipeStart = null;
  $('lock-screen').addEventListener('touchstart', e=>{
    lockSwipeStart = e.touches[0].clientY;
  });
  $('lock-screen').addEventListener('touchend', e=>{
    if(lockSwipeStart === null) return;
    const dy = e.changedTouches[0].clientY - lockSwipeStart;
    if(dy < -30) showScreen('home');
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
      showScreen('lock');
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
  });

  function openApp(app){
    switch(app){
      case 'messages': renderConvList(); showScreen('messages'); break;
      case 'phone': renderCallLog(); showScreen('phone'); break;
      case 'moments': renderMoments(); showScreen('moments'); break;
      case 'album': renderAlbum(); showScreen('album'); break;
      case 'calendar': renderCalendar(); showScreen('calendar'); break;
      case 'music': renderMusic(); showScreen('music'); break;
      case 'notes': renderNotes(); showScreen('notes'); break;
      case 'profile': renderProfile(); showScreen('profile'); break;
    }
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
      setTimeout(()=> showChatChoice(convId, conv.pendingChoice), 400);
    }
    setTimeout(()=>{
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
      div.className = 'msg recv';
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
        ${choice.prompt}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
        ${choice.options.map((opt, i)=>`
          <button class="chat-opt" data-narrator-choice="${i}" style="padding:14px;">
            ${opt.text}
            ${opt.hint?`<span style="color:var(--ink-mute);font-size:11px;display:block;margin-top:4px;">${opt.hint}</span>`:''}
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
      btn.innerHTML = opt.text + (opt.hint?` <span style="color:var(--ink-mute);font-size:11px">(${opt.hint})</span>`:'');
      btn.onclick = (e)=>{
        e.stopPropagation();
        if(timeoutTimer){ clearTimeout(timeoutTimer); timeoutTimer = null; }
        const conv = engine.state.conversations[convId];
        if(conv) conv.pendingChoice = null;
        engine.sendMessage(convId, opt.text, opt.effects);
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
        engine.sendMessage(convId, opt.text, opt.effects);
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
      timeoutTimer = setTimeout(tick, 100);
    }
    tick();
  }

  function handleFreeSend(isTimeout){
    const field = $('chat-free-input-field');
    const text = field.value.trim();
    const convId = field.dataset.convId;
    if(!convId) return;
    const keywords = JSON.parse(field.dataset.keywords || '[]');
    const defaultEffect = JSON.parse(field.dataset.defaultEffect || '{}');
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
      setTimeout(()=> toast(matched.reply), 1200);
    }
  }

  engine.on('timeAdvance', ({text})=>{
    $('time-adv-text').textContent = text || '时间流逝…';
    $('time-adv').hidden = false;
  });
  engine.on('timeAdvanceEnd', ()=>{
    $('time-adv').hidden = true;
    updateTimeDisplay();
  });

  // ===== 来电 =====
  engine.on('incomingCall', ({from, name, script, eventId})=>{
    const char = STORY.characters[from];
    $('call-name').textContent = name;
    $('call-bg').style.background = `radial-gradient(ellipse at center, ${char?.bg || '#2a2f5a'}, #000)`;
    $('call-label').textContent = '来电…';
    $('call-actions').hidden = false;
    $('call-timer').hidden = true;
    $('call-script').hidden = true;
    showScreen('incomingCall');
    window._currentCall = {from, name, script, eventId, step:0};
  });

  function handleCallAction(action){
    const call = window._currentCall;
    if(!call) return;
    if(action === 'accept'){
      $('call-actions').hidden = true;
      $('call-label').textContent = '通话中';
      $('call-timer').hidden = false;
      $('call-script').hidden = false;
      engine.addCallLog(call.from, 'incoming', '03:24');
      runCallScript(call);
    } else if(action === 'decline'){
      engine.declineCall(call.eventId);
      engine.addCallLog(call.from, 'missed', '—');
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
        setTimeout(()=>{
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
            if(opt.effects && opt.effects.affection){
              Object.keys(opt.effects.affection).forEach(k=> engine.state.affection[k] += opt.effects.affection[k]);
            }
            choices.remove();
            call.step = (opt.then !== undefined ? opt.then : call.step + 1);
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
        lineDiv.innerHTML = speaker + line.text;
        scriptEl.appendChild(lineDiv);
        scriptEl.scrollTop = scriptEl.scrollHeight;
        call.step++;
        setTimeout(nextStep, 1100);
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
  function viewPhoto(pid){
    const p = STORY.photos[pid];
    if(!p) return;
    const unlocked = engine.state.photos.find(x=>x.id===pid);
    if(!unlocked){ toast('照片未解锁'); return; }
    $('photo-bg').style.background = `linear-gradient(135deg, #1a0a2e, #0a0712)`;
    $('photo-art').innerHTML = getPhotoArt(p.art, true);
    $('photo-caption').innerHTML = `<strong>${p.title}</strong><br>${p.caption.replace(/\n/g,'<br>')}`;
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
          <div class="ni-title">${n.title}</div>
          <div class="ni-preview">${n.preview.replace(/\n/g,'<br>')}</div>
          <div class="ni-date">${n.time}</div>
        `;
        list.appendChild(div);
      });
    } else {
      engine.state.notes.forEach(n=>{
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `
          <div class="ni-title">${n.title}</div>
          <div class="ni-preview">${(n.preview||'').replace(/\n/g,'<br>')}</div>
          <div class="ni-date">${n.time}</div>
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
          <div class="call-name">${c.name}</div>
          <div class="call-meta">${typeText} · ${c.duration}</div>
        </div>
        <div class="call-type ${c.type}">${c.time}</div>
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
        ${routeChoice.prompt}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
        ${routeChoice.options.map((opt)=>`
          <button class="chat-opt" data-route="${opt.route}" style="padding:14px;">
            ${opt.text}
            <span style="color:var(--ink-mute);font-size:11px;display:block;margin-top:4px;">${opt.hint}</span>
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
          <span class="mc-name">${name}</span>${c.text}
        </div>`;
      }).join('');
      // 评论选项
      let commentOptsHtml = '';
      if(m.commentOptions && !inter.commented){
        commentOptsHtml = `<div class="moment-comment-options" id="opts-${m.id}" hidden>
          ${m.commentOptions.map((opt,i)=>`<button class="moment-comment-opt" data-moment-comment-opt="${m.id}" data-opt-idx="${i}">${opt.text}</button>`).join('')}
        </div>`;
      }
      item.innerHTML = `
        <div class="moment-top">
          <div class="moment-avatar" style="background:${m.bg}">${m.avatar}</div>
          <div class="moment-body">
            <div class="moment-name">${m.name}</div>
            <div class="moment-text">${m.text.replace(/\n/g,'<br>')}</div>
            ${m.art ? `<div class="moment-art">${getMomentArt(m.art)}</div>` : ''}
            <div class="moment-meta">
              <span>${m.dateLabel} ${m.time}</span>
              <div class="moment-actions">
                <button class="moment-act-btn ${inter.liked?'liked':''}" data-moment-like="${m.id}" ${inter.liked?'disabled':''}>
                  ${inter.liked?'♥':'♡'} ${m.likes.length}
                </button>
                ${m.commentOptions && !inter.commented ? `<button class="moment-act-btn" data-moment-comment="${m.id}">💬 评论</button>` : ''}
              </div>
            </div>
            ${likeNames ? `<div class="moment-likes">♥ ${likeNames}</div>` : ''}
            ${commentsHtml ? `<div class="moment-comments">${commentsHtml}</div>` : ''}
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
    engine.createMyMoment(text, selectedMomentArt || null);
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
  engine.on('stateChange', ()=>{
    updateMomentsBadge();
  });

  // ===== 梦境 =====
  engine.on('dreamStart', ({dreamId, dream})=>{
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
  });
  engine.on('dreamResolved', ({choice})=>{
    setTimeout(()=>{
      if(choice.shard) toast('✦ 获得记忆碎片：' + choice.shard);
    }, 500);
    // 碎片提示后回到主屏（若 timeAdvance 随后触发会自动覆盖）
    setTimeout(()=>{
      if(screens.dream.classList.contains('active')) showScreen('home');
    }, 1800);
  });

  // ===== 性格画像 =====
  function renderProfile(){
    const content = $('profile-content');
    const profile = engine.getPersonalityProfile();
    const p = engine.state.personality;
    if(profile.shards === 0 && p.active + p.passive + p.emotional + p.rational === 0){
      content.innerHTML = '<div class="profile-empty">梦境尚未开始<br>你的画像正在形成中…</div>';
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
    content.innerHTML = html;
  }

  // ===== 初始化 =====
  function init(){
    updateTimeDisplay();
    engine.newGame();
    showScreen('lock');
  }
  init();
})();
