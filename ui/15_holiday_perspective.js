/* ===== 霓虹心事 · UI：节日 App 与男主视角 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.10 节日App =====
  function renderCalendar2(){
    const content = $('calendar2-content');
    const season = engine.getCurrentSeason();
    const today = engine.getDateLabel();
    const todayHoliday = STORY.seasons?.holidays[`${today.month}-${today.date}`];
    let html = `<div class="cal2-season">
      <div class="cal2-season-icon">${season.icon}</div>
      <div class="cal2-season-name">${season.name} · ${today.month}月${today.date}日</div>
      <div class="cal2-season-desc">"${escapeHtml(season.desc)}"</div>
    </div>`;
    if(todayHoliday){
      html += `<div class="cal2-today-holiday">
        <div class="cal2-today-holiday-icon">${todayHoliday.icon}</div>
        <div class="cal2-today-holiday-name">${escapeHtml(todayHoliday.name)}</div>
        <div class="cal2-today-holiday-text">${escapeHtml(todayHoliday.text)}</div>
      </div>`;
    } else {
      html += '<div class="cal2-section-title">今日</div>';
      html += '<div style="font-size:12px;color:var(--ink-mute);padding:8px 0;">今天没有特别的日子。</div>';
    }
    // 即将到来的节日
    const upcoming = engine.getUpcomingHolidays(30);
    if(upcoming.length > 0){
      html += '<div class="cal2-section-title">即将到来</div>';
      upcoming.forEach(u=>{
        html += `<div class="cal2-upcoming-item">
          <div class="cal2-upcoming-icon">${u.holiday.icon}</div>
          <div class="cal2-upcoming-info">
            <div class="cal2-upcoming-name">${escapeHtml(u.holiday.name)}</div>
            <div class="cal2-upcoming-date">${u.date.month}月${u.date.date}日</div>
          </div>
          <div class="cal2-upcoming-in">${u.inDays}天后</div>
        </div>`;
      });
    }
    // 全部节日列表
    html += '<div class="cal2-section-title">霓城节日历</div>';
    Object.values(STORY.seasons?.holidays || {}).forEach(h=>{
      html += `<div class="cal2-upcoming-item">
        <div class="cal2-upcoming-icon">${h.icon}</div>
        <div class="cal2-upcoming-info">
          <div class="cal2-upcoming-name">${escapeHtml(h.name)}</div>
          <div class="cal2-upcoming-date">${escapeHtml(h.text)}</div>
        </div>
      </div>`;
    });
    content.innerHTML = html;
  }
  engine.on('holidayTriggered', ({holiday, date})=>{
    showNotif('susu', `今日节日：${holiday.name}`);
  });

  // ===== v0.0.10 男主视角+反向剧情 =====
  let currentPerspectiveCharId = null;
  let currentPsceneId = null;
  function renderPerspective(){
    const content = $('perspective-content');
    const perspectives = engine.getAllPerspectives();
    if(perspectives.length === 0){
      content.innerHTML = '<div class="shop-empty">暂无视角</div>';
      return;
    }
    content.innerHTML = perspectives.map(p=>{
      const char = STORY.characters[p.charId] || {};
      const lockedCls = p.unlocked ? '' : 'locked';
      const statusText = p.unlocked
        ? (p.truthEndingSeen ? '✓ 真相已揭示' : `${p.scenesSeen}/${p.totalScenes} 场景已看`)
        : '通关对应路线后解锁';
      let scenesHtml = '';
      if(p.unlocked){
        scenesHtml = '<div class="persp-card-scenes">';
        p.scenes.forEach(s=>{
          scenesHtml += `<div class="persp-scene-item ${s.seen?'seen':''}" data-pscene="${p.charId}:${s.id}">
            <span class="persp-scene-item-title">${escapeHtml(s.title)}</span>
            ${s.seen ? '<span class="persp-scene-item-check">✓</span>' : '<span style="font-size:10px;color:var(--ink-mute)">未看</span>'}
          </div>`;
        });
        scenesHtml += '</div>';
        // 真相结局按钮
        const allScenesSeen = p.scenesSeen === p.totalScenes;
        if(allScenesSeen){
          scenesHtml += `<button class="persp-truth-btn ${p.truthEndingSeen?'':'unlocked'}" data-action="show-truth" data-char-id="${p.charId}">
            ${p.truthEndingSeen ? '✓ 重看真相结局' : '✦ 揭示真相结局'}
          </button>`;
        }
      }
      return `<div class="persp-card ${lockedCls}">
        <div class="persp-card-header">
          <div class="persp-card-avatar" style="background:${char.bg||'#333'}">${avatarImg(char)}</div>
          <div>
            <div class="persp-card-title">${escapeHtml(p.title)}</div>
            <div class="persp-card-status">${statusText}</div>
          </div>
        </div>
        ${scenesHtml}
      </div>`;
    }).join('');
  }
  function openPerspectiveScene(charSceneId){
    const [charId, sceneId] = charSceneId.split(':');
    currentPerspectiveCharId = charId;
    currentPsceneId = sceneId;
    const p = STORY.malePerspectives?.[charId];
    const scene = p?.scenes.find(s=>s.id === sceneId);
    if(!scene) return;
    $('pscene-title').textContent = p.title;
    const content = $('pscene-content');
    let html = `<div class="pscene-time">${escapeHtml(scene.time)}</div>`;
    html += `<div class="pscene-title">${escapeHtml(scene.title)}</div>`;
    html += `<div class="pscene-narration">${escapeHtml(scene.narration)}</div>`;
    html += `<div class="pscene-inner">${escapeHtml(scene.innerVoice)}</div>`;
    if(scene.choice){
      html += `<div class="pscene-choice-prompt">${escapeHtml(scene.choice.prompt)}</div>`;
      html += '<div class="pscene-options">';
      scene.choice.options.forEach((opt, i)=>{
        html += `<div class="pscene-opt" data-pscene-opt="${i}">
          ${escapeHtml(opt.text)}
          <span class="pscene-opt-inner">${escapeHtml(opt.inner)}</span>
        </div>`;
      });
      html += '</div>';
    }
    content.innerHTML = html;
    showScreen('pscene');
  }
  function handlePsceneOption(idx){
    const p = STORY.malePerspectives?.[currentPerspectiveCharId];
    const scene = p?.scenes.find(s=>s.id === currentPsceneId);
    if(!scene || !scene.choice) return;
    const opt = scene.choice.options[idx];
    if(!opt) return;
    // 标记场景已看
    engine.markPerspectiveSceneSeen(currentPerspectiveCharId, currentPsceneId);
    toast(t('心声：{inner}', {inner: opt.inner}));
    // 返回视角列表
    setUiTimeout(()=>{
      renderPerspective();
      showScreen('perspective');
    }, 1500);
  }
  function showTruthEnding(charId){
    const p = STORY.malePerspectives?.[charId];
    if(!p || !p.truthEnding) return;
    $('truth-title').textContent = p.truthEnding.title;
    $('truth-text').textContent = p.truthEnding.text;
    showScreen('truthEnding');
  }
  engine.on('truthEndingUnlocked', ({charId, perspective})=>{
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = `✦ 真相结局解锁：${perspective.title}`;
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 4000);
  });
