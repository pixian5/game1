/* ===== 霓虹心事 · UI：来电 UI 与通话脚本 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 来电 =====
  function showIncomingCall({from, name, script, eventId}){
    AudioSys.play('ring');  // v0.1.7: 来电铃声
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
