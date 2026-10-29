/* ===== 霓虹心事 · UI：梦境、偶遇、回忆杀、苏苏情报、性格画像 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 梦境 =====
  function openDreamScreen(dreamId, dream){
    if(!dream) return;
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
  }
  engine.on('dreamStart', ({dreamId, dream})=>{
    openDreamScreen(dreamId, dream);
  });
  engine.on('dreamResolved', ({choice})=>{
    setUiTimeout(()=>{
      if(choice.shard) toast('✦ ' + t('获得记忆碎片：{shard}', {shard: choice.shard}));
    }, 500);
    // 碎片提示后回到主屏（若 timeAdvance 随后触发会自动覆盖）
    setUiTimeout(()=>{
      if(screens.dream.classList.contains('active')) showScreen('home');
    }, 1800);
  });

  // ===== 偶遇 =====
  engine.on('encounterTriggered', ({locId, enc})=>{
    showEncounter(enc);
  });
  engine.on('encounterEmpty', ()=>{
    toast('这里暂时没有新发现…');
  });

  // ===== 回忆杀 =====
  engine.on('memoryStart', ({memId, mem})=>{
    // 复用偶遇屏显示回忆
    showEncounter({
      id: memId,
      title: mem.title,
      desc: mem.desc,
      choice: { prompt:'', options: mem.options },
      isMemory: true,
      char: 'narrator'
    });
  });
  engine.on('memoryResolved', ({opt})=>{
    setUiTimeout(()=>{
      if(opt.shard) toast('✦ ' + t('获得回忆碎片：{shard}', {shard: opt.shard}));
    }, 300);
    setUiTimeout(()=>{
      if(screens.encounter.classList.contains('active')) showScreen('album');
    }, 1500);
  });

  // ===== 苏苏情报 =====
  engine.on('intelReceived', ({id, intel})=>{
    toast('📨 苏苏发来一条情报');
  });

  // ===== 性格画像 =====
  function renderProfile(){
    const content = $('profile-content');
    const profile = engine.getPersonalityProfile();
    const p = engine.state.personality;
    if(profile.shards === 0 && p.active + p.passive + p.emotional + p.rational === 0){
      const invHtml = renderInvitationsList();
      content.innerHTML = '<div class="profile-empty">梦境尚未开始<br>你的画像正在形成中…</div>' + (invHtml || '');
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
          <div class="profile-shard-title">✦ ${escapeHtml(s.shard || s.title)}</div>
          ${s.meaning ? `<div class="profile-shard-meaning">${escapeHtml(s.meaning)}</div>` : ''}
        </div>`;
      });
      html += '</div>';
    }
    // 回忆碎片
    if(profile.memoryShards && profile.memoryShards.length > 0){
      html += '<div class="profile-shards"><div class="profile-shards-title">回忆碎片</div>';
      profile.memoryShards.forEach(s=>{
        html += `<div class="profile-shard">
          <div class="profile-shard-title">✦ ${escapeHtml(s.shard || s.title)}</div>
          ${s.meaning ? `<div class="profile-shard-meaning">${escapeHtml(s.meaning)}</div>` : ''}
        </div>`;
      });
      html += '</div>';
    }
    // 邀约列表
    const invHtml = renderInvitationsList();
    if(invHtml) html += invHtml;
    content.innerHTML = html;
  }

  // 邀约列表渲染（嵌入性格画像App）
  function renderInvitationsList(){
    if(!STORY.invitations) return '';
    const entries = Object.entries(STORY.invitations);
    if(entries.length === 0) return '';
    let html = '<div class="profile-shards"><div class="profile-shards-title">邀约记录</div>';
    entries.forEach(([id, inv])=>{
      const char = STORY.characters[inv.from] || {name:'?'};
      const resolved = engine.state.resolvedInvitations[id];
      const pending = engine.state.invitations.find(p=>p.id===id && p.status==='pending');
      let status = '未触发', cls = 'inv-pending';
      if(resolved === 'accepted'){ status = '已赴约'; cls = 'inv-accepted'; }
      else if(resolved === 'declined'){ status = '已拒绝'; cls = 'inv-declined'; }
      else if(resolved === 'missed'){ status = '已错过'; cls = 'inv-missed'; }
      else if(pending){ status = '待回复 · ' + (inv.schedule || ''); cls = 'inv-active'; }
      else { status = '尚未达成'; cls = 'inv-locked'; }
      html += `<div class="profile-shard ${cls}">
        <div class="profile-shard-title">${escapeHtml(char.avatar)} ${escapeHtml(window.t(char.name))} · ${escapeHtml(inv.schedule||'邀约')}</div>
        <div class="profile-shard-meaning">${escapeHtml(inv.text)}</div>
        <div style="margin-top:4px;font-size:11px;color:var(--ink-mute)">状态：${escapeHtml(status)}</div>
      </div>`;
    });
    html += '</div>';
    return html;
  }
