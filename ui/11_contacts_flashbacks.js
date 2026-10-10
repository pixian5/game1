/* ===== 霓虹心事 · UI：通讯录/社交主页、闪回前传、邀约事件、未接提醒 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

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
    // v0.1.6: 闪回时间标签改为按数据读取（原先固定显示"五年前"，与九年/八年前内容矛盾）
    const flashbackLabel = $('flashback-label');
    if(flashbackLabel) flashbackLabel.textContent = fb.time || '闪回';
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
