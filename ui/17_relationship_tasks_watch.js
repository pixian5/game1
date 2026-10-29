/* ===== 霓虹心事 · UI：关系阶段、每日任务、观赏模式 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.13 关系阶段 App =====
  function renderRelations(){
    const content = $('relations-content');
    const all = engine.getAllRelationshipStages();
    let html = '';
    all.forEach(r=>{
      const char = STORY.characters[r.charId];
      if(!char) return;
      const stages = STORY.relationshipStages?.[r.charId] || [];
      const curStageNum = r.stageNum;
      const aff = r.affection;
      const maxAff = stages[stages.length-1]?.maxAff || 99;
      const pct = Math.min(100, (aff / maxAff) * 100);
      html += `<div class="rel-card">
        <div class="rel-card-header">
          <div class="rel-card-avatar" style="background:${char.bg}">${avatarImg(char)}</div>
          <div class="rel-card-info">
            <div class="rel-card-name">${escapeHtml(window.t(char.name))}</div>
            <div class="rel-card-stage">阶段 ${curStageNum} · ${escapeHtml(r.stage.name)} · ${escapeHtml(r.stage.title)}</div>
            <div class="rel-card-aff">好感度 ${aff}</div>
          </div>
        </div>
        <div class="rel-card-bar">
          <div class="rel-card-bar-fill" style="width:${pct}%"></div>
          <div class="rel-card-bar-marks">
            ${stages.map(()=>'<div class="rel-card-bar-mark"></div>').join('')}
          </div>
        </div>
        <div class="rel-stages">`;
      stages.forEach(s=>{
        const isCurrent = s.stage === curStageNum;
        const isPassed = s.stage < curStageNum;
        const isLocked = s.stage > curStageNum;
        const cls = isCurrent ? 'current' : (isPassed ? 'passed' : 'locked');
        html += `<div class="rel-stage-item ${cls}">
          <div class="rel-stage-dot"></div>
          <div class="rel-stage-info">
            <div class="rel-stage-name">阶段 ${s.stage} · ${escapeHtml(s.name)}</div>
            <div class="rel-stage-title">${escapeHtml(s.title)}</div>
            <div class="rel-stage-desc">${escapeHtml(s.desc)}</div>
            ${isCurrent && s.unlockMsg ? `<div class="rel-stage-unlock">"${escapeHtml(s.unlockMsg)}"</div>` : ''}
            ${s.criticalEvent && !isLocked ? `<div class="rel-stage-unlock" style="color:#ffd566">★ 临界事件已配置</div>` : ''}
          </div>
        </div>`;
      });
      html += '</div></div>';
    });
    content.innerHTML = html;
  }

  // 关系阶段提升提示
  engine.on('relationshipStageUp', ({charId, stage, prevStage})=>{
    const char = STORY.characters[charId];
    if(!char) return;
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = window.t('★ {char} 关系阶段提升：{stage} · {title}', {char: window.t(char.name), stage: window.t(stage.name), title: window.t(stage.title)});
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 4000);
    if(stage.unlockMsg){
      toast(stage.unlockMsg);
    }
    if(screens.relations && screens.relations.classList.contains('active')){
      renderRelations();
    }
  });

  // ===== v0.0.13 每日任务 App =====
  function renderTasks(){
    // 顶部连胜
    $('tasks-streak').textContent = '🔥 ' + (engine.state.taskStreak || 0);
    const content = $('tasks-content');
    const tasks = engine.getDailyTasks();
    let html = `<div class="tasks-streak-banner">
      <div class="tasks-streak-num">${engine.state.taskStreak || 0}</div>
      <div class="tasks-streak-label">连续完成天数</div>
      <div class="tasks-streak-hint">${tasks.every(t=>t.completed) && tasks.length>0 ? '今日已全部完成 ✓' : `今日完成 ${tasks.filter(t=>t.completed).length}/${tasks.length}`}</div>
    </div>`;
    // 今日任务列表
    html += '<div class="tasks-section-title">今日任务</div>';
    if(tasks.length === 0){
      html += '<div style="font-size:12px;color:var(--ink-mute);padding:8px 0;">暂无任务</div>';
    } else {
      tasks.forEach(t=>{
        html += `<div class="task-item ${t.completed?'done':''}">
          <div class="task-check">${t.completed ? '✓' : ''}</div>
          <div class="task-info">
            <div class="task-name">${escapeHtml(t.name)}</div>
            <div class="task-desc">${escapeHtml(t.desc)}</div>
          </div>
          <div class="task-reward">+${t.reward?.coins || 0} 💰</div>
        </div>`;
      });
    }
    // 连胜奖励
    const rewards = STORY.dailyTasks?.streakRewards || [];
    if(rewards.length > 0){
      html += '<div class="tasks-section-title">连胜奖励</div>';
      html += '<div class="tasks-streak-rewards">';
      rewards.forEach(r=>{
        const claimed = engine.state.taskStreakClaimed[r.days];
        const unlocked = (engine.state.taskStreak || 0) >= r.days;
        const cls = claimed ? 'claimed' : (unlocked ? 'unlocked' : '');
        html += `<div class="streak-reward-item ${cls}">
          <div class="streak-reward-days">${r.days}天</div>
          <div class="streak-reward-info">
            <div class="streak-reward-name">${escapeHtml(r.name)}</div>
            <div class="streak-reward-desc">${escapeHtml(r.desc)} · 奖励 ${r.reward?.coins||0}💰${r.reward?.collectible?' +纪念品':''}</div>
          </div>
          ${claimed ? '<div class="streak-reward-claimed">已领取 ✓</div>' :
            (unlocked ? `<button class="streak-reward-claim" data-action="claim-streak" data-days="${r.days}">领取</button>` :
            `<div style="font-size:10px;color:var(--ink-mute)">还差 ${r.days - (engine.state.taskStreak||0)} 天</div>`)}
        </div>`;
      });
      html += '</div>';
    }
    content.innerHTML = html;
  }

  // 任务完成通知
  engine.on('dailyTaskCompleted', (tasks)=>{
    tasks.forEach(t=>{
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `✅ 任务完成：${t.name} +${t.reward?.coins||0}💰`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 3000);
    });
    if(screens.tasks && screens.tasks.classList.contains('active')){
      renderTasks();
    }
  });
  engine.on('streakRewardClaimed', (r)=>{
    toast(t('连胜奖励：{name} +{coins}💰', {name: r.name, coins: r.reward?.coins||0}));
    if(screens.tasks && screens.tasks.classList.contains('active')){
      renderTasks();
    }
  });
  engine.on('streakRewardAvailable', (rewards)=>{
    rewards.forEach(r=>{
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `🎁 连胜 ${r.days} 天达成！可领取：${r.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 4500);
    });
    if(screens.tasks && screens.tasks.classList.contains('active')){
      renderTasks();
    }
  });

  function claimStreakReward(days){
    const ok = engine.claimStreakReward(days);
    if(!ok) toast('暂不可领取');
    renderTasks();
  }

  // ===== v0.0.13 观赏模式 App =====
  function renderWatch(){
    const content = $('watch-content');
    const isOn = engine.state.watchMode;
    const curStrategy = engine.state.watchStrategy || 'balanced';
    const strategies = STORY.watchMode?.strategies || {};
    let html = `<div class="watch-status-card">
      <div class="watch-status-icon">${isOn ? '🎬' : '⏸'}</div>
      <div class="watch-status-title">${isOn ? '观赏模式 · 运行中' : '观赏模式 · 未开启'}</div>
      <div class="watch-status-sub">${isOn ? `策略：${escapeHtml(strategies[curStrategy]?.name || '平衡')}` : '开启后剧情将自动推进'}</div>
      <button class="watch-toggle-btn ${isOn?'off':''}" data-action="toggle-watch">${isOn ? '停止观赏' : '开启观赏模式'}</button>
    </div>`;
    // v0.5.10（F3）：导演视角——三周目起解锁的数值面板（剧情党考古用）
    if((engine.state.ngPlus || 0) >= 2){
      const aff = engine.state.affection, ad = engine.state.affectionDetail;
      const rows = ['shenyan','luci','jiangyu'].map(cid => {
        const c = STORY.characters[cid];
        const d = ad[cid] || {closeness:0, trust:0, tension:0};
        return `<div class="director-row"><span style="background:${c.bg}">${c.avatar}</span> ${escapeHtml(window.t(c.name))}
          好感 ${aff[cid]||0} · 密 ${d.closeness} / 信 ${d.trust} / 暧 ${d.tension}</div>`;
      }).join('');
      const flags = ['shenyan_resist','luci_confess','jiangyu_hold','solo_independent','group_dinner_hotpot','rain_event_done']
        .filter(f => engine.state.flags[f]).join('、') || '（关键 flag 未触发）';
      html += `<div class="watch-status-card" style="margin-top:12px">
        <div class="watch-status-icon">🎬</div>
        <div class="watch-status-title">导演视角 · 三周目</div>
        <div class="director-rows">${rows}</div>
        <div class="director-flags">关键走向：${flags}</div>
        <div class="watch-status-sub" style="font-size:11px">周目 ${engine.state.ngPlus + 1} · 结局达成 ${Object.keys(engine.state.endingSeen||{}).length}/17</div>
      </div>`;
    }
    html += '<div class="watch-section-title">选择自动策略</div>';
    html += '<div class="watch-strategy-list">';
    Object.values(strategies).forEach(s=>{
      html += `<div class="watch-strategy-item ${s.id===curStrategy?'selected':''}" data-watch-strategy="${s.id}">
        <div class="watch-strategy-icon">${WATCH_ICONS[s.id] || '🎯'}</div>
        <div class="watch-strategy-info">
          <div class="watch-strategy-name">${escapeHtml(s.name)}</div>
          <div class="watch-strategy-desc">${escapeHtml(s.desc)}</div>
        </div>
        ${s.id===curStrategy ? '<div class="watch-strategy-check">✓</div>' : ''}
      </div>`;
    });
    html += '</div>';
    html += `<div class="watch-info">
      💡 观赏模式下，遇到选项时引擎会按所选策略自动选择，剧情自动推进。适合反复体验不同路线与结局。<br>
      · 平衡：折中选择，体验完整剧情<br>
      · 好感优先：优先好感度+最高的选项<br>
      · 理性/感性：按性格偏好选择<br>
      · 随机：完全随机，可能触发不同结局
    </div>`;
    content.innerHTML = html;
  }
  const WATCH_ICONS = {balanced:'🎯', affection:'💖', rational:'🧠', emotional:'💫', random:'🎲'};

  function toggleWatchMode(){
    const newOn = !engine.state.watchMode;
    engine.setWatchMode(newOn);
    toast(newOn ? '观赏模式已开启' : '观赏模式已停止');
    renderWatch();
  }
  function setWatchStrategy(strategyId){
    engine.setWatchMode(engine.state.watchMode, strategyId);
    toast('策略已切换');
    renderWatch();
  }
