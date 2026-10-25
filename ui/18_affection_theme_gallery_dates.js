/* ===== 霓虹心事 · UI：好感度深度、主题壁纸、结局图鉴、约会 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.15 好感度深度 App =====
  function renderAffection(){
    const content = $('affection-content');
    if(!content) return;
    const list = engine.getAllAffectionDetail();
    const dims = STORY.affectionDimensions || {};
    let html = '';
    list.forEach(item => {
      const char = STORY.characters[item.charId];
      if(!char) return;
      const total = item.detail.closeness + item.detail.trust + item.detail.tension;
      const aff = engine.state.affection[item.charId] || 0;
      html += `<div class="aff-dim-card">
        <div class="aff-dim-header">
          <div class="aff-dim-avatar" style="background:${char.bg}">${avatarImg(char)}</div>
          <div class="aff-dim-info">
            <div class="aff-dim-name">${escapeHtml(char.name)}</div>
            <div class="aff-dim-total">综合好感 <strong>${aff}</strong> · 三轴合计 ${total}</div>
          </div>
        </div>`;
      ['closeness','trust','tension'].forEach(dimId => {
        const dim = dims[dimId] || {};
        const v = item.detail[dimId] || 0;
        const stage = item.stages[dimId] || {name:'-'};
        const pct = Math.min(100, (v/40)*100); // 40 为满格刻度
        html += `<div class="aff-dim-row">
          <div class="aff-dim-row-header">
            <div class="aff-dim-label">${dim.icon||''} ${escapeHtml(dim.name||dimId)}<span class="aff-dim-stage">${escapeHtml(stage.name||'-')}</span></div>
            <div class="aff-dim-value"><strong>${v}</strong></div>
          </div>
          <div class="aff-dim-bar"><div class="aff-dim-bar-fill ${dimId}" style="width:${pct}%"></div></div>
        </div>`;
      });
      html += `</div>`;
    });
    html += `<div class="watch-info" style="margin-top:6px;">
      💡 三轴说明：<br>
      · 🤝 亲密度：一起经历的事越多越亲密<br>
      · 🔐 信任度：他愿意对你敞开心扉的程度<br>
      · 💫 暧昧度：心跳加速的瞬间累积<br>
      新剧情选项会精细驱动三轴，旧选项按 50%/30%/20% 自动折算。
    </div>`;
    content.innerHTML = html;
  }

  // ===== v0.0.15 主题壁纸 App =====
  function renderThemes(){
    const content = $('themes-content');
    if(!content) return;
    const themes = STORY.themes || {};
    const iconThemes = STORY.iconThemes || {};
    const curTheme = engine.state.currentTheme || 'default';
    const curIcon = engine.state.currentIconTheme || 'default';
    let html = '<div class="themes-section-title">壁纸主题</div><div class="themes-grid">';
    Object.values(themes).forEach(t => {
      const unlocked = !!engine.state.unlockedThemes[t.id];
      const selected = t.id === curTheme;
      // v0.1.11: 预览与实际效果一致——壁纸图叠在渐变上层（与 applyThemeToBody 同规则）
      const bg = t.wallpaperImage
        ? `background:url('${t.wallpaperImage}') center/cover no-repeat, ${t.wallpaperVar || 'none'};`
        : (t.wallpaperVar ? `background:${t.wallpaperVar};` : '');
      html += `<div class="theme-card ${unlocked?'':'locked'} ${selected?'selected':''}" data-theme="${escapeHtml(t.id)}">
        <div class="theme-card-bg" style="${bg}"></div>
        <div class="theme-card-overlay">
          <div class="theme-card-name">${escapeHtml(t.name)}</div>
          <div class="theme-card-unlock">${unlocked ? '已解锁' : escapeHtml(t.unlockDesc||'未解锁')}</div>
        </div>
        ${selected ? '<div class="theme-card-check">✓</div>' : ''}
      </div>`;
    });
    html += '</div>';
    html += '<div class="themes-section-title">图标主题</div><div class="icon-theme-list">';
    Object.values(iconThemes).forEach(t => {
      const unlocked = !!engine.state.unlockedIconThemes[t.id];
      const selected = t.id === curIcon;
      html += `<div class="icon-theme-item ${unlocked?'':'locked'} ${selected?'selected':''}" data-icon-theme="${escapeHtml(t.id)}">
        <div class="icon-theme-preview">${selected?'✓':'🎨'}</div>
        <div class="icon-theme-info">
          <div class="icon-theme-name">${escapeHtml(t.name)}</div>
          <div class="icon-theme-unlock">${unlocked ? '已解锁' : escapeHtml(t.unlockDesc||'未解锁')}</div>
        </div>
      </div>`;
    });
    html += '</div>';
    html += `<div class="watch-info" style="margin-top:14px;">
      💡 主题通过剧情、任务、成就解锁。壁纸与图标独立切换，互不影响。<br>
      当前壁纸：<strong>${escapeHtml(themes[curTheme]?.name||'默认')}</strong> · 当前图标：<strong>${escapeHtml(iconThemes[curIcon]?.name||'默认')}</strong>
    </div>`;
    content.innerHTML = html;
  }
  function handleThemeClick(themeId){
    if(!engine.state.unlockedThemes[themeId]){
      toast('该主题尚未解锁');
      return;
    }
    const ok = engine.setTheme(themeId);
    if(ok){
      applyThemeToBody();
      toast('壁纸已切换');
      renderThemes();
    }
  }
  function handleIconThemeClick(themeId){
    if(!engine.state.unlockedIconThemes[themeId]){
      toast('该图标主题尚未解锁');
      return;
    }
    const ok = engine.setIconTheme(themeId);
    if(ok){
      toast('图标主题已切换');
      renderThemes();
    }
  }
  // 合成壁纸：氛围纹理(可选) + 主题图 + 主题渐变，写入 --wallpaper-1 与 --wallpaper-blend
  // v0.2.7 (M1.3): 氛围随 ambience 切换（雨天雾感/夜晚灯海/不安暗流），叠加在主题壁纸之上
  function composeWallpaper(){
    const t = engine.getCurrentTheme ? engine.getCurrentTheme() : null;
    const amb = engine.getCurrentAmbience ? engine.getCurrentAmbience() : null;
    const layers = [], blends = [];
    if(amb && amb.layerImage){
      layers.push(`url('${amb.layerImage}') center/cover no-repeat`);
      blends.push(amb.layerBlend || 'soft-light');
    }
    if(t && t.wallpaperImage){
      layers.push(`url('${t.wallpaperImage}') center/cover no-repeat`);
      blends.push('normal');
    }
    if(t && t.wallpaperVar){
      layers.push(t.wallpaperVar);
      blends.push('normal');
    }
    document.body.style.setProperty('--wallpaper-1', layers.length ? layers.join(', ') : 'none');
    document.body.style.setProperty('--wallpaper-blend', blends.length ? blends.join(', ') : 'normal');
  }
  // 把当前主题颜色变量写入 body，实现真实壁纸切换
  function applyThemeToBody(){
    const t = engine.getCurrentTheme ? engine.getCurrentTheme() : null;
    if(!t) return;
    if(t.bg) document.body.style.setProperty('--bg', t.bg);
    if(t.accent) document.body.style.setProperty('--accent', t.accent);
    composeWallpaper();  // v0.1.7: 图叠在渐变上层；v0.2.7: 再叠氛围纹理
    AudioSys.applyTheme(t.id);  // v0.1.7: 同步切换主题环境音
  }

  // ===== v0.0.15 结局图鉴 App =====
  // v0.5.10（F3）：未解锁结局的模糊线索（不剧透 flag 名）
  const DIRECTOR_HINTS = {
    shenyan_hidden: '在晚宴上守住自己，并留住一支画了五年的钢笔……',
    luci_hidden: '雨夜里追出去的人，会看到一封九年前的信……',
    jiangyu_hidden: '陪他唱完那首歌，歌词的线索藏在储物柜里……',
    shenyan_good: '正视他画的"她"，也正视自己的位置。',
    luci_good: '他收拾行李的那天，你的回答会改变一切。',
    jiangyu_good: '舞台上的最后一句，等一个人来接。',
    shenyan_bad: '被"展示"的时候，你沉默了。',
    luci_bad: '有些告别，一旦说出口就收不回。',
    jiangyu_bad: '空着的那个座位，等的人没有来。',
    solo_good: '谁的消息都不回的那个夜晚，你听见了自己。',
    solo_normal: '善意可以收下，边界也可以留下。',
    solo_bad: '把自己关在门里，窗也忘了开。',
    solo_hidden: '十件收藏，或一颗足够独立的心。',
    true_ending: '不依附任何路线，把霓城走完。',
  };
  function renderEndings(){
    const content = $('endings-content');
    if(!content) return;
    const all = engine.getEndingGallery();
    const tiers = [
      {id:'GOOD',   label:'Good Ending · 完美结局'},
      {id:'NORMAL', label:'Normal Ending · 普通结局'},
      {id:'BAD',    label:'Bad Ending · 遗憾结局'},
      {id:'HIDDEN', label:'Hidden Ending · 隐藏结局'}
    ];
    // 预测当前结局走向
    const curEndingId = engine.computeCurrentEnding ? engine.computeCurrentEnding() : null;
    const curEnding = curEndingId ? (STORY.endingGallery||{})[curEndingId] : null;
    let html = '';
    if(curEnding){
      html += `<div class="aff-dim-card" style="border-color:rgba(255,95,168,0.4);">
        <div class="aff-dim-name" style="margin-bottom:6px;">🔮 当前走向预测</div>
        <div class="ending-card-char">${escapeHtml(curEnding.charId ? (STORY.characters[curEnding.charId]?.name||curEnding.charId) : '独行线')}</div>
        <div class="ending-card-name">${escapeHtml(curEnding.name)}</div>
        <div class="ending-card-desc">${escapeHtml(curEnding.desc)}</div>
      </div>`;
    } else if(engine.state.route){
      html += `<div class="watch-info" style="margin-bottom:12px;">当前路线：<strong>${escapeHtml(STORY.characters[engine.state.route]?.name || engine.state.route)}</strong>，结局尚未达成。</div>`;
    } else {
      html += `<div class="watch-info" style="margin-bottom:12px;">尚未进入任何路线。完成剧情后这里会预测你的结局走向。</div>`;
    }
    tiers.forEach(tier => {
      const items = all.filter(e => e.tier === tier.id);
      if(items.length === 0) return;
      html += `<div class="endings-tier-title ${tier.id.toLowerCase()}">${escapeHtml(tier.label)} · ${items.filter(e=>e.seen).length}/${items.length}</div>`;
      html += '<div class="endings-grid">';
      items.forEach(e => {
        html += `<div class="ending-card ${e.seen?'seen':'unseen'}">
          <div class="ending-card-tier ${e.tier}">${e.tier}</div>
          <div class="ending-card-char">${escapeHtml(e.charName)}</div>
          <div class="ending-card-name">${e.seen ? escapeHtml(e.name) : '???'}</div>
          <div class="ending-card-desc">${e.seen ? escapeHtml(e.desc) : escapeHtml(DIRECTOR_HINTS[e.id] || '尚未解锁此结局，继续游戏以发现它。')}</div>
        </div>`;
      });
      html += '</div>';
    });
    content.innerHTML = html;
    updateEndingsBadge();
  }

  // ===== v0.0.15 约会 App =====
  function renderDates(){
    const content = $('dates-content');
    if(!content) return;
    const stats = engine.getDateStats();
    let html = '';
    stats.forEach(s => {
      const char = STORY.characters[s.charId];
      if(!char) return;
      const statusText = s.canDate ? (s.availableScenes.length > 0 ? '可约会' : '本周场景已体验完') : `冷却中 · 剩${s.remainingDays}天`;
      const statusClass = s.canDate && s.availableScenes.length > 0 ? 'available' : 'cooldown';
      html += `<div class="date-char-card">
        <div class="date-char-header">
          <div class="date-char-avatar" style="background:${char.bg}">${avatarImg(char)}</div>
          <div class="date-char-info">
            <div class="date-char-name">${escapeHtml(char.name)}</div>
            <div class="date-char-status ${statusClass}">${statusText}</div>
            <div class="date-char-progress">已体验 ${s.doneScenes}/${s.totalScenes}</div>
          </div>
        </div>
        <div class="date-scenes-list">`;
      const allScenes = (STORY.dateScenes && STORY.dateScenes[s.charId]) || [];
      allScenes.forEach(sc => {
        const isDone = !!engine.state.firedEvents[sc.id];
        const canPick = !isDone && s.canDate;
        const cls = isDone ? 'done' : (canPick ? '' : 'locked');
        const statusHtml = isDone
          ? '<span class="date-scene-status done">已体验</span>'
          : (canPick ? '<span class="date-scene-status available">可约会</span>' : '');
        html += `<div class="date-scene-item ${cls}" ${canPick?`data-date="${escapeHtml(sc.id)}"`:''}>
          <div class="date-scene-name">${escapeHtml(sc.name)}${statusHtml}</div>
          <div class="date-scene-desc">${escapeHtml(sc.desc)}</div>
        </div>`;
      });
      if(allScenes.length === 0){
        html += '<div class="date-scene-desc">暂无场景</div>';
      }
      html += `</div></div>`;
    });
    html += `<div class="watch-info" style="margin-top:6px;">
      💡 每位男主每周（游戏内7天）可约会1次。完成约会会提升三轴好感，部分场景会解锁独家照片。
    </div>`;
    content.innerHTML = html;
    updateDatesBadge();
  }

  // 约会模态：展示对话并允许完成
  let currentDateScene = null;
  function openDateScene(sceneId){
    let charId = null, scene = null;
    for(const cid in STORY.dateScenes || {}){
      const found = (STORY.dateScenes[cid]||[]).find(s=>s.id===sceneId);
      if(found){ charId = cid; scene = found; break; }
    }
    if(!scene || !charId) return;
    currentDateScene = {charId, sceneId, scene};
    const char = STORY.characters[charId];
    const content = $('date-scene-content');
    let html = `<div class="date-scene-title">${escapeHtml(scene.name)}</div>
      <div class="date-scene-bg-char" style="background:${char.bg}">${avatarImg(char)}</div>
      <div class="date-dialogue-list">`;
    (scene.dialogue||[]).forEach(d => {
      const who = d.who === 'me' ? 'me' : 'him';
      html += `<div class="date-dialogue-item ${who}">${escapeHtml(d.text||'')}</div>`;
    });
    html += `</div>
      <div class="date-scene-actions">
        <button class="date-scene-btn secondary" data-action="close-date">先离开</button>
        <button class="date-scene-btn" data-action="finish-date" data-finish-date="${escapeHtml(sceneId)}">完成约会</button>
      </div>`;
    content.innerHTML = html;
    showScreen('dateScene');
  }
  function closeDateScene(){
    // 玩家点"先离开"时取消约会，不消耗本周名额
    if(engine.cancelDate) engine.cancelDate();
    currentDateScene = null;
    showScreen('dates');
  }
  function handleDateClick(sceneId){
    if(!sceneId) return;
    const res = engine.startDate(sceneId);
    if(!res.ok){
      toast(res.reason || '无法发起约会');
      return;
    }
    openDateScene(sceneId);
  }
  function handleFinishDate(sceneId){
    const ok = engine.finishDate(sceneId);
    if(!ok){
      toast('约会结算失败');
      return;
    }
    const scene = currentDateScene && currentDateScene.scene;
    currentDateScene = null;
    toast(scene ? t('完成「{scene}」', {scene: scene.name}) : '约会完成');
    renderDates();
    showScreen('dates');
  }
