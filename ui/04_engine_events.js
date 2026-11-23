  const _t = (typeof window.t === 'function') ? window.t : (x => x);  // v0.5.3（E4）
/* ===== 霓虹心事 · UI：引擎事件订阅（消息送达、状态刷新、限时回复等） =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

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
      $('chat-status').textContent = conv.typing ? window.t('正在输入…') : window.t('在线');
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
  // v0.6.6（P1-4）：首支剧情曲解锁 → 引导去音乐 App / 开环境音乐（只提醒一次）
  engine.on('musicUnlocked', (m)=>{
    if(!engine.state.flags.music_guide_shown && m && m.title){
      engine.state.flags.music_guide_shown = true;
      setUiTimeout(()=>{
        toast(`🎧 已解锁 ${m.title}——去「音乐」App 听，或在设置开启环境音乐`);
      }, 1200);
    }
  });

  engine.on('choicePrompt', ({convId, choice, conv})=>{
    // v0.0.13 观赏模式：自动选择（用 engine._setTimeout 集中管理，读档/关闭时清理）
    if(engine.state.watchMode && choice.options && choice.options.length > 0 && !choice.isInvitation){
      const autoIdx = engine.pickAutoChoice(choice.options);
      const autoOpt = choice.options[autoIdx];
      const delay = STORY.watchMode?.autoAdvanceDelay || 1500;
      engine._setTimeout(()=>{
        // 二次校验：定时器触发时观赏模式仍开启才执行
        if(!engine.state.watchMode) return;
        // v0.9.11：只清掉「当时亮出的那一个」。若期间它已被系统清理、队列里的下一个已亮出，
        // 这里不能把新的那个一并清掉（否则它的后续事件会丢）。
        if(conv && conv.pendingChoice && conv.pendingChoice !== choice) return;
        if(conv){ conv.pendingChoice = null; }
        engine.sendMessage(convId, autoOpt.text, engine.normalizeOptionEffects(autoOpt));
        toast('🎬 ' + t('观赏自动选：{opt}', {opt: autoOpt.text}));
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

  // v0.9.11：某个「正在亮出」的选择被系统清理（目前只有「邀约超时被错过」这一种情况）。
  // 玩家正停在这个会话、选项条上显示的就是它时，立即收起，
  // 避免玩家去点一个已经失效的邀约（更糟的是会误清掉刚亮出来的下一个选择）。
  engine.on('choicePurged', ({convIds}={})=>{
    if(!Array.isArray(convIds) || !convIds.includes(currentConvId)) return;
    const conv = engine.state.conversations[currentConvId];
    if(conv && conv.pendingChoice) return;       // 队列里的下一个已经亮出来，界面已刷新，不动
    clearChatTimeout(currentConvId);
    const bar = $('chat-input-bar');
    if(bar) bar.hidden = true;
    const opts = $('chat-options');
    if(opts) opts.innerHTML = '';
  });

  function showNarratorChoice(choice){
    if(!choice || !Array.isArray(choice.options) || choice.options.length === 0) return;
    let modal = document.getElementById('narrator-choice-modal');
    if(modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'narrator-choice-modal';
    modal.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:160;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:32px;animation:screenIn .4s ease;';
    modal.innerHTML = `
      <div style="font-family:var(--serif);font-size:15px;color:var(--ink-dim);margin-bottom:20px;text-align:center;line-height:1.9;letter-spacing:0.05em;max-width:300px;">
        ${escapeHtml(_t(choice.prompt))}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
        ${choice.options.map((opt, i)=>`
          <button class="chat-opt" data-narrator-choice="${i}" style="padding:14px;">
            ${escapeHtml(_t(opt.text))}
            ${opt.hint?`<span style="color:var(--ink-mute);font-size:11px;display:block;margin-top:4px;">${escapeHtml(_t(opt.hint))}</span>`:''}
          </button>
        `).join('')}
      </div>
    `;
    document.getElementById('phone').appendChild(modal);
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
    if(!choice || !Array.isArray(choice.options) || choice.options.length === 0){
      if(bar) bar.hidden = true;
      return;
    }
    if(bar) delete bar.dataset.answered;   // v0.8.6：新选择重置防重复标记
    $('chat-prompt').textContent = _t(choice.prompt);
    const opts = $('chat-options');
    const timeoutBar = $('chat-timeout-bar');
    const freeInput = $('chat-free-input');
    opts.innerHTML = '';
    // v0.8.1: 只清理当前会话的旧计时器；截止时间固定，切会话/重开只重建视图
    clearChatTimeout(convId);
    if(choice.timeout && !(choice.dueAt > 0)) choice.dueAt = Date.now() + choice.timeout * 1000;
    timeoutBar.hidden = true;
    freeInput.hidden = true;
    const expired = choice.timeout && choice.dueAt <= Date.now();

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
        if(expired){ setUiTimeout(()=> handleFreeSend(true), 0); return; }
        startTimeout(convId, choice.dueAt, choice.timeout * 1000, ()=> handleFreeSend(true));
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
      const hintHtml = opt.hint ? ` <span style="color:var(--ink-mute);font-size:11px">(${escapeHtml(_t(opt.hint))})</span>` : '';
      const smartHintHtml = smartHint ? ` <span class="chat-opt-smart-hint">💡 ${escapeHtml(smartHint)}</span>` : '';
      btn.innerHTML = escapeHtml(opt.text) + hintHtml + smartHintHtml;
      btn.onclick = (e)=>{
        e.stopPropagation();
        // v0.8.6：防重复——点击后立即禁用全部选项按钮并清空容器，
        // 防止快速连点导致同一选择被发送多次（商业级测试发现的真 bug）
        if(bar.dataset.answered === '1') return;
        bar.dataset.answered = '1';
        [...bar.querySelectorAll('.chat-opt')].forEach(b => b.disabled = true);
        clearChatTimeout(convId);
        const conv = engine.state.conversations[convId];
        // v0.9.11：只清掉「界面上显示的这一个」。如果它已被系统清理（如邀约超时）、
        // 队列里的下一个已经亮出，说明这次点击已经过期，直接忽略，
        // 否则会把刚亮出的下一个选择一并清掉（它的后续事件就丢了）。
        if(conv && conv.pendingChoice !== choice){
          // 过期点击：按当前真实状态重绘（有新选择就显示新的，没有就收起）
          if(conv.pendingChoice) showChatChoice(convId, conv.pendingChoice);
          else bar.hidden = true;
          return;
        }
        if(conv) conv.pendingChoice = null;
        engine.sendMessage(convId, opt.text, mergeOptionEffects(opt));
        bar.hidden = true;
        opts.innerHTML = '';
      };
      opts.appendChild(btn);
    });
    bar.hidden = false;

    // 限时回复
    if(choice.timeout){
      const applyDefault = ()=>{
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
      };
      if(expired){ setUiTimeout(applyDefault, 0); return; }
      startTimeout(convId, choice.dueAt, choice.timeout * 1000, applyDefault);
    }
  }

  function startTimeout(convId, dueAt, totalMs, onTimeout){
    const bar = $('chat-timeout-bar');
    const fill = $('chat-timeout-fill');
    const text = $('chat-timeout-text');
    bar.hidden = false;
    bar.classList.remove('urgent');
    clearChatTimeout(convId);
    const item = {handle:null, dueAt, totalMs, onTimeout};
    chatTimeouts.set(convId, item);
    function tick(){
      const remain = Math.max(0, dueAt - Date.now());
      const pct = Math.min(100, (remain / Math.max(1, totalMs)) * 100);
      fill.style.width = pct + '%';
      text.textContent = Math.ceil(remain / 1000) + 's';
      if(remain < totalMs * 0.3) bar.classList.add('urgent');
      if(remain <= 0){
        chatTimeouts.delete(convId);
        if(timeoutTimer){ clearTimeout(timeoutTimer); timeoutTimer = null; }
        onTimeout();
        return;
      }
      item.handle = setUiTimeout(tick, 100);
      timeoutTimer = item.handle;
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
    clearChatTimeout(convId);
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
