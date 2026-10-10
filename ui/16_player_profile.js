/* ===== 霓虹心事 · UI：主角档案 App =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.13 主角档案 App =====
  const PLAYER_COLORS = ['#5a2a4a','#2a2f5a','#2a5a3a','#5a3a1a','#3a1a3a','#1a3a4a','#4a1a2a','#3a3a3a'];
  let playerEditState = null;  // 临时编辑态
  function renderPlayer(){
    const content = $('player-content');
    const p = engine.getPlayer();
    let html = `<div class="player-hero">
      <div class="player-hero-avatar" style="background:${p.bg || '#5a2a4a'}">${escapeHtml(p.avatar || (p.name ? p.name[0] : '林'))}</div>
      <div class="player-hero-name">${escapeHtml(p.name || '林夏')}</div>
      <div class="player-hero-nick">昵称 · ${escapeHtml(p.nickname || '夏夏')}</div>
      <div class="player-hero-meta">
        <span>${p.age || 24} 岁</span>
        <span>称谓 · ${escapeHtml(p.pronoun || '她')}</span>
        ${engine.state.playerQuizDone ? '<span style="color:#4ade80">✓ 性格已画像</span>' : '<span style="color:var(--accent2)">性格问答待完成</span>'}
      </div>
    </div>`;
    // 性格问答回顾
    const quiz = STORY.playerCustomization?.personalityQuiz || [];
    if(quiz.length > 0){
      html += '<div class="player-section-title">性格画像回顾</div>';
      html += '<div class="player-quiz-list">';
      quiz.forEach(q=>{
        const ansIdx = p.answers?.[q.id];
        const opt = (ansIdx !== undefined) ? q.options[ansIdx] : null;
        html += `<div class="player-quiz-item">
          <div class="player-quiz-q">${escapeHtml(q.question)}</div>
          <div class="player-quiz-a">${opt ? ('→ ' + escapeHtml(opt.text) + (opt.label ? ` (${opt.label})` : '')) : '未作答'}</div>
        </div>`;
      });
      html += '</div>';
    }
    // 动态称谓表
    const chars = ['shenyan','luci','jiangyu','susu'];
    html += '<div class="player-section-title">男主对你的称谓</div>';
    html += '<div class="player-nick-table">';
    chars.forEach(cid=>{
      const char = STORY.characters[cid];
      if(!char) return;
      const nick = engine.getCharNickname(cid);
      const hasRelStage = !!(STORY.relationshipStages && STORY.relationshipStages[cid]);
      const stageNum = hasRelStage ? engine.getRelationshipStageNum(cid) : '—';
      html += `<div class="player-nick-row">
        <div class="player-nick-char" style="background:${char.bg}">${char.avatar}</div>
        <div class="player-nick-info">
          <div class="player-nick-call">${escapeHtml(nick.call)}</div>
          ${nick.inner ? `<div class="player-nick-inner">"${escapeHtml(nick.inner)}"</div>` : ''}
        </div>
        <div class="player-nick-stage">${hasRelStage ? ('阶段 ' + stageNum) : '闺蜜'}</div>
      </div>`;
    });
    html += '</div>';
    content.innerHTML = html;
  }

  function openPlayerEdit(){
    const p = engine.getPlayer();
    playerEditState = {
      name: p.name || '林夏',
      nickname: p.nickname || '夏夏',
      avatar: p.avatar || (p.name ? p.name[0] : '林'),
      bg: p.bg || '#5a2a4a',
      age: p.age || 24,
      pronoun: p.pronoun || '她',
      answers: {...(p.answers || {})}
    };
    renderPlayerEdit();
    showScreen('playerEdit');
  }

  function renderPlayerEdit(){
    const s = playerEditState;
    if(!s) return;
    const quiz = STORY.playerCustomization?.personalityQuiz || [];
    let html = `<div class="player-edit-title">编辑主角档案</div>
      <div class="player-edit-sub">自定义姓名、昵称和性格画像</div>`;
    // 基本信息
    html += `<div class="player-edit-field">
      <div class="player-edit-label">姓名</div>
      <input class="player-edit-input" id="pe-name" type="text" maxlength="6" value="${escapeHtml(s.name)}">
    </div>`;
    html += `<div class="player-edit-field">
      <div class="player-edit-label">昵称（闺蜜/男主称呼你的小名基础）</div>
      <input class="player-edit-input" id="pe-nick" type="text" maxlength="6" value="${escapeHtml(s.nickname)}">
    </div>`;
    html += `<div class="player-edit-field">
      <div class="player-edit-label">年龄</div>
      <input class="player-edit-input" id="pe-age" type="number" min="18" max="40" value="${s.age}">
    </div>`;
    // 头像底色
    html += `<div class="player-edit-field">
      <div class="player-edit-label">头像底色</div>
      <div class="player-edit-color-row" id="pe-colors">
        ${PLAYER_COLORS.map(c=>`<div class="player-edit-color-opt ${c===s.bg?'selected':''}" data-pe-color="${c}" style="background:${c}"></div>`).join('')}
      </div>
    </div>`;
    // 称谓
    html += `<div class="player-edit-field">
      <div class="player-edit-label">称谓</div>
      <div class="player-edit-pronoun-row" id="pe-pronouns">
        ${['她','他','TA'].map(pn=>`<div class="player-edit-pronoun-opt ${pn===s.pronoun?'selected':''}" data-pe-pronoun="${pn}">${pn}</div>`).join('')}
      </div>
    </div>`;
    // 性格问答
    html += '<div class="player-edit-label" style="margin-top:8px;">性格问答（影响初始画像）</div>';
    quiz.forEach(q=>{
      const sel = s.answers[q.id];
      html += `<div class="player-edit-question">
        <div class="player-edit-question-text">${escapeHtml(q.question)}</div>
        <div class="player-edit-options">`;
      q.options.forEach((opt, i)=>{
        html += `<div class="player-edit-opt ${i===sel?'selected':''}" data-pe-quiz="${q.id}" data-pe-idx="${i}">
          ${escapeHtml(opt.text)}
          ${opt.label ? `<span class="player-edit-opt-label">${escapeHtml(opt.label)}</span>` : ''}
        </div>`;
      });
      html += '</div></div>';
    });
    // 操作按钮
    html += `<div class="player-edit-actions">
      <button class="player-edit-btn secondary" data-action="cancel-player-edit">取消</button>
      <button class="player-edit-btn" data-action="save-player">保存</button>
    </div>`;
    $('player-edit-content').innerHTML = html;
  }

  function capturePlayerEditInputs(){
    if(!playerEditState) return;
    const name = $('pe-name');
    const nickname = $('pe-nick');
    const age = $('pe-age');
    if(name) playerEditState.name = name.value.slice(0, 6);
    if(nickname) playerEditState.nickname = nickname.value.slice(0, 6);
    if(age) playerEditState.age = Math.max(18, Math.min(40, parseInt(age.value) || 24));
  }

  function handlePlayerEditClick(target){
    // 颜色选择
    const colorOpt = target.closest('[data-pe-color]');
    if(colorOpt){
      capturePlayerEditInputs();
      playerEditState.bg = colorOpt.dataset.peColor;
      renderPlayerEdit();
      return true;
    }
    // 称谓选择
    const pronounOpt = target.closest('[data-pe-pronoun]');
    if(pronounOpt){
      capturePlayerEditInputs();
      playerEditState.pronoun = pronounOpt.dataset.pePronoun;
      renderPlayerEdit();
      return true;
    }
    // 性格问答选择
    const quizOpt = target.closest('[data-pe-quiz]');
    if(quizOpt){
      capturePlayerEditInputs();
      playerEditState.answers[quizOpt.dataset.peQuiz] = parseInt(quizOpt.dataset.peIdx);
      renderPlayerEdit();
      return true;
    }
    return false;
  }

  function savePlayer(){
    if(!playerEditState) return;
    capturePlayerEditInputs();
    const nameInput = $('pe-name');
    const nickInput = $('pe-nick');
    const ageInput = $('pe-age');
    const name = (nameInput?.value || '').trim() || '林夏';
    const nickname = (nickInput?.value || '').trim() || '夏夏';
    const age = Math.max(18, Math.min(40, parseInt(ageInput?.value) || 24));
    // 头像取姓名首字
    const avatar = name[0];
    const newAnswers = playerEditState.answers;
    const quiz = STORY.playerCustomization?.personalityQuiz || [];
    engine.updatePlayerProfile({
      name, nickname, avatar, age,
      bg: playerEditState.bg,
      pronoun: playerEditState.pronoun,
      answers: newAnswers
    });
    // 完成性问答题标志
    if(Object.keys(newAnswers).length >= quiz.length){
      engine.state.playerQuizDone = true;
      engine.emit('stateChange', engine.state);
    }
    playerEditState = null;
    toast('档案已保存');
    renderPlayer();
    showScreen('player');
  }

  // 监听主角变化刷新
  engine.on('playerChanged', ()=>{
    if(screens.player && screens.player.classList.contains('active')) renderPlayer();
  });
