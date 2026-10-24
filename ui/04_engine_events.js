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
