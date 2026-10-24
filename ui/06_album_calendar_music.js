/* ===== 霓虹心事 · UI：相册、日历、音乐 App =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 相册 =====
  function renderAlbum(){
    const grid = $('album-grid');
    grid.innerHTML = '';
    const allPhotos = Object.keys(STORY.photos);
    allPhotos.forEach(pid=>{
      const unlocked = engine.state.photos.find(p=>p.id===pid);
      const item = document.createElement('div');
      item.className = 'album-item' + (unlocked?'':' locked');
      item.dataset.photo = pid;
      if(unlocked){
        const p = STORY.photos[pid];
        item.innerHTML = `<img src="${photoSrc(p.art)}" alt="${escapeHtml(p.title)}" loading="lazy">`;
      } else {
        item.innerHTML = '?';
      }
      grid.appendChild(item);
    });
    if(allPhotos.length === 0){
      grid.innerHTML = '<div style="color:var(--ink-mute);text-align:center;padding:40px;grid-column:1/-1;">暂无照片</div>';
    }
  }
  function viewPhoto(pid){
    const p = STORY.photos[pid];
    if(!p) return;
    const unlocked = engine.state.photos.find(x=>x.id===pid);
    if(!unlocked){ toast('照片未解锁'); return; }
    $('photo-bg').style.background = `linear-gradient(135deg, #1a0a2e, #0a0712)`;
    $('photo-art').innerHTML = `<img src="${photoSrc(p.art)}" alt="${escapeHtml(p.title)}">`;
    // 检查是否有回忆可触发
    const memId = engine.getMemoriesByPhoto(pid);
    const hasMemory = memId && !engine.state.resolvedMemories[memId];
    const memBtn = hasMemory
      ? `<button class="photo-memory-btn" data-memory="${escapeHtml(pid)}">✦ 回味这段回忆</button>`
      : (memId ? '<div class="photo-memory-done">回忆已回味</div>' : '');
    $('photo-caption').innerHTML = `<strong>${escapeHtml(p.title)}</strong><br>${escapeHtml(p.caption).replace(/\n/g,'<br>')}${memBtn}`;
    showScreen('photoView');
  }
  function photoSrc(type){
    return `assets/photos/${type}.jpg`;
  }

  // ===== 日历 =====
  function renderCalendar(){
    const t = engine.getTime();
    const d = engine.getDateLabel();
    $('cal-current').innerHTML = `
      <div class="cc-day">${d.date}</div>
      <div class="cc-month">${d.month}月</div>
      <div class="cc-weekday">星期${d.weekday}</div>
    `;
    const events = $('cal-events');
    events.innerHTML = '';
    const defaultEvents = [
      {time:'09:00', title:'美术馆报到', loc:'砚美术馆', day:2},
      {time:'10:00', title:'开幕式筹备', loc:'美术馆会议室', day:3},
      {time:'19:00', title:'开幕式', loc:'砚美术馆展厅', day:5},
      {time:'22:00', title:'雾港酒吧', loc:'巷子深处', day:2}
    ];
    const visible = defaultEvents.filter(e=>e.day <= t.day);
    if(visible.length === 0){
      events.innerHTML = '<div style="color:var(--ink-mute);text-align:center;padding:40px;">今日暂无日程</div>';
      return;
    }
    visible.forEach(e=>{
      const div = document.createElement('div');
      div.className = 'cal-event' + (e.day < t.day ? ' past':'');
      div.innerHTML = `
        <div class="ce-time">${escapeHtml(e.time)}</div>
        <div class="ce-title">${escapeHtml(e.title)}</div>
        <div class="ce-loc">${escapeHtml(e.loc)}</div>
      `;
      events.appendChild(div);
    });
  }

  // ===== 音乐 =====
  // v0.1.7: 音效/环境音开关（设置持久化在 localStorage，由 audio.js 管理）
  function refreshSoundSettings(){
    const soundBtn = $('ss-sound'), bgmBtn = $('ss-bgm');
    if(soundBtn) soundBtn.textContent = AudioSys.isEnabled() ? '🔊 音效：开' : '🔇 音效：关';
    if(bgmBtn) bgmBtn.textContent = AudioSys.isBgmEnabled() ? '🎵 环境音：开' : '🎵 环境音：关';
  }
  function toggleSoundSetting(){
    AudioSys.setSound(!AudioSys.isEnabled());
    refreshSoundSettings();
  }
  function toggleBgmSetting(){
    AudioSys.setBgm(!AudioSys.isBgmEnabled());
    refreshSoundSettings();
  }
  function renderMusic(){
    const playlist = $('music-playlist');
    playlist.innerHTML = '';
    refreshSoundSettings();
    const unlocked = engine.state.music.unlocked;
    const playing = engine.state.music.playing;
    Object.entries(STORY.music).forEach(([id, m])=>{
      const isUnlocked = unlocked.includes(id);
      const isPlaying = playing === id;
      const item = document.createElement('div');
      item.className = 'music-item' + (isPlaying?' playing':'') + (isUnlocked?'':' locked');
      item.dataset.music = id;
      item.innerHTML = `
        <span class="mi-num">${isPlaying?'▶':(Object.keys(STORY.music).indexOf(id)+1)}</span>
        <span class="mi-title">${escapeHtml(m.title)}</span>
        <span class="mi-dur">${escapeHtml(m.duration)}</span>
      `;
      playlist.appendChild(item);
    });
    if(playing){
      const m = STORY.music[playing];
      $('np-title').textContent = m.title;
      $('np-artist').textContent = m.artist;
      $('np-art').classList.add('playing');
      $('np-art').textContent = '♪';
    } else {
      $('np-title').textContent = '未播放';
      $('np-artist').textContent = '—';
      $('np-art').classList.remove('playing');
    }
  }
