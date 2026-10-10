/* ===== 霓虹心事 · UI：塔罗占卜与成就系统 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.9 塔罗占卜 =====
  function renderTarot(){
    const content = $('tarot-content');
    const fortune = engine.state.todayFortune;
    let html = '';
    if(fortune){
      html += `<div class="tarot-today">
        <div class="tarot-card-display ${fortune.reversed?'reversed':''}">
          ${fortune.reversed ? '<div class="tarot-card-reversed-tag">逆位</div>' : ''}
          <div class="tarot-card-roman">${fortune.roman}</div>
          <div class="tarot-card-name">${escapeHtml(fortune.name)}</div>
        </div>
        <div class="tarot-text">${escapeHtml(fortune.text)}</div>
        <div class="tarot-hint">第${fortune.day}天的牌阵 · ${fortune.reversed?'逆位':'正位'}</div>
      </div>`;
      html += `<button class="tarot-draw-btn" disabled>今日已抽过</button>`;
    } else {
      html += `<div class="tarot-empty">
        <div class="tarot-empty-icon">🔮</div>
        <div>今日尚未抽牌</div>
        <div style="font-size:11px;margin-top:6px;">每日一抽，揭示霓城的运势</div>
      </div>`;
      html += `<button class="tarot-draw-btn" data-action="draw-tarot">抽取今日塔罗</button>`;
    }
    // 历史
    if(engine.state.tarotHistory.length > 0){
      html += '<div class="tarot-history">';
      html += '<div class="tarot-history-title">历史牌阵</div>';
      engine.state.tarotHistory.slice().reverse().slice(0, 6).forEach(h=>{
        const card = STORY.tarot.cards[h.cardId];
        if(!card) return;
        html += `<div class="tarot-history-item">
          <span class="tarot-history-card">${card.roman} ${card.name}</span>
          <span style="color:${h.reversed?'#ff5fa8':'#4ade80'}">${h.reversed?'逆':'正'}</span>
          <span style="margin-left:auto;color:var(--ink-mute)">第${h.day}天</span>
        </div>`;
      });
      html += '</div>';
    }
    content.innerHTML = html;
  }
  function handleDrawTarot(){
    const r = engine.drawTarot();
    if(!r.ok){ toast(r.reason || '抽牌失败'); return; }
    renderTarot();
  }

  // ===== v0.0.9 成就系统 =====
  function renderAchievements(){
    const content = $('achievements-content');
    const unlocked = engine.getUnlockedAchievements();
    const locked = engine.getLockedAchievements();
    const total = unlocked.length + locked.length;
    const pct = total > 0 ? (unlocked.length / total) * 100 : 0;
    const trueUnlocked = engine.isTrueEndingUnlocked();
    let html = `<div class="ach-progress">
      <div class="ach-progress-num">${unlocked.length} / ${total}</div>
      <div class="ach-progress-total">已解锁成就</div>
      <div class="ach-progress-bar"><div class="ach-progress-fill" style="width:${pct}%"></div></div>
      <div class="ach-true-ending-hint ${trueUnlocked?'unlocked':''}">${trueUnlocked?'✨ 真结局已解锁':'达成 60% 成就 + 选择独行路线 → 解锁真结局'}</div>
    </div>`;
    if(unlocked.length > 0){
      html += '<div class="ach-section-title">已解锁</div>';
      unlocked.forEach(a=>{
        html += `<div class="ach-item unlocked">
          <div class="ach-item-icon">${a.icon}</div>
          <div class="ach-item-info">
            <div class="ach-item-name">${escapeHtml(a.name)}</div>
            <div class="ach-item-desc">${escapeHtml(a.desc)}</div>
          </div>
        </div>`;
      });
    }
    if(locked.length > 0){
      html += '<div class="ach-section-title">未解锁</div>';
      locked.forEach(a=>{
        html += `<div class="ach-item locked">
          <div class="ach-item-icon">${a.icon}</div>
          <div class="ach-item-info">
            <div class="ach-item-name">${escapeHtml(a.name)}</div>
            <div class="ach-item-desc">${escapeHtml(a.desc)}</div>
          </div>
        </div>`;
      });
    }
    content.innerHTML = html;
  }
  // 成就解锁通知
  engine.on('achievementsUnlocked', (achs)=>{
    AudioSys.play('achieve');  // v0.1.7: 成就解锁音
    achs.forEach(a=>{
      const n = document.createElement('div');
      n.className = 'ach-notif';
      n.textContent = `🏆 成就解锁：${a.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 3000);
    });
    // 若成就页打开则刷新
    if(screens.achievements && screens.achievements.classList.contains('active')){
      renderAchievements();
    }
  });
