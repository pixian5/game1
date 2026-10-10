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
        item.innerHTML = getPhotoArt(p.art);
      } else {
        item.innerHTML = '?';
      }
      grid.appendChild(item);
    });
    if(allPhotos.length === 0){
      grid.innerHTML = '<div style="color:var(--ink-mute);text-align:center;padding:40px;grid-column:1/-1;">暂无照片</div>';
    }
  }
  function escapeHtml(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function nl2brEscaped(s){
    return escapeHtml(s).replace(/\n/g, '<br>');
  }
  function mergeOptionEffects(opt){
    return engine.normalizeOptionEffects ? engine.normalizeOptionEffects(opt) : {...(opt?.effects||{})};
  }
  function viewPhoto(pid){
    const p = STORY.photos[pid];
    if(!p) return;
    const unlocked = engine.state.photos.find(x=>x.id===pid);
    if(!unlocked){ toast('照片未解锁'); return; }
    $('photo-bg').style.background = `linear-gradient(135deg, #1a0a2e, #0a0712)`;
    $('photo-art').innerHTML = getPhotoArt(p.art, true);
    // 检查是否有回忆可触发
    const memId = engine.getMemoriesByPhoto(pid);
    const hasMemory = memId && !engine.state.resolvedMemories[memId];
    const memBtn = hasMemory
      ? `<button class="photo-memory-btn" data-memory="${escapeHtml(pid)}">✦ 回味这段回忆</button>`
      : (memId ? '<div class="photo-memory-done">回忆已回味</div>' : '');
    $('photo-caption').innerHTML = `<strong>${escapeHtml(p.title)}</strong><br>${escapeHtml(p.caption).replace(/\n/g,'<br>')}${memBtn}`;
    showScreen('photoView');
  }
  function getPhotoArt(type){
    const arts = {
      city:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0a0712"/>
        <rect x="20" y="80" width="20" height="120" fill="#1a1f3a"/>
        <rect x="45" y="60" width="25" height="140" fill="#2a1f4a"/>
        <rect x="75" y="40" width="30" height="160" fill="#1a2f4a"/>
        <rect x="110" y="70" width="22" height="130" fill="#2a1f3a"/>
        <rect x="135" y="50" width="28" height="150" fill="#1a1f4a"/>
        <rect x="165" y="85" width="18" height="115" fill="#2a2f4a"/>
        <g fill="#ff5fa8"><rect x="25" y="90" width="3" height="3"/><rect x="32" y="100" width="3" height="3"/><rect x="27" y="110" width="3" height="3"/></g>
        <g fill="#7a5cff"><rect x="50" y="70" width="3" height="3"/><rect x="58" y="85" width="3" height="3"/><rect x="52" y="95" width="3" height="3"/></g>
        <g fill="#39d6ff"><rect x="80" y="50" width="3" height="3"/><rect x="90" y="65" width="3" height="3"/><rect x="85" y="80" width="3" height="3"/></g>
        <text x="100" y="195" text-anchor="middle" fill="#7d6e99" font-size="9" font-family="monospace">霓城 · 夜</text>
      </svg>`,
      rooftop:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1845"/><stop offset="1" stop-color="#0a0712"/></linearGradient></defs>
        <rect width="200" height="200" fill="url(#rsky)"/>
        <rect x="0" y="140" width="200" height="60" fill="#0a0712"/>
        <rect x="10" y="120" width="30" height="20" fill="#1a1f2a"/>
        <rect x="45" y="110" width="35" height="30" fill="#1f1a2a"/>
        <rect x="85" y="100" width="40" height="40" fill="#2a1f3a"/>
        <rect x="130" y="115" width="30" height="25" fill="#1a1f2a"/>
        <rect x="165" y="125" width="25" height="15" fill="#1f1a2a"/>
        <g fill="#fff"><circle cx="30" cy="30" r="1"/><circle cx="70" cy="20" r="1.5"/><circle cx="120" cy="35" r="1"/><circle cx="160" cy="25" r="1.5"/><circle cx="180" cy="45" r="1"/></g>
        <g fill="#ff5fa8"><rect x="20" y="125" width="2" height="2"/><rect x="55" y="118" width="2" height="2"/><rect x="95" y="110" width="2" height="2"/><rect x="140" y="122" width="2" height="2"/></g>
        <text x="100" y="195" text-anchor="middle" fill="#7d6e99" font-size="9" font-family="monospace">天台 · 灯海</text>
      </svg>`,
      album:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#1a1420"/>
        <rect x="20" y="20" width="160" height="160" fill="#2a2030" rx="4"/>
        <rect x="30" y="30" width="140" height="100" fill="#0a0712"/>
        <g fill="#4a3a5a"><rect x="40" y="45" width="20" height="15"/><rect x="65" y="45" width="20" height="15"/><rect x="90" y="45" width="20" height="15"/><rect x="115" y="45" width="20" height="15"/><rect x="140" y="45" width="20" height="15"/></g>
        <g fill="#5a4a6a"><rect x="40" y="65" width="20" height="15"/><rect x="65" y="65" width="20" height="15"/><rect x="90" y="65" width="20" height="15"/><rect x="115" y="65" width="20" height="15"/><rect x="140" y="65" width="20" height="15"/></g>
        <g fill="#3a2a4a"><rect x="40" y="85" width="20" height="15"/><rect x="65" y="85" width="20" height="15"/><rect x="90" y="85" width="20" height="15"/><rect x="115" y="85" width="20" height="15"/><rect x="140" y="85" width="20" height="15"/></g>
        <text x="100" y="155" text-anchor="middle" fill="#ff5fa8" font-size="11" font-family="serif">九年</text>
        <text x="100" y="172" text-anchor="middle" fill="#7d6e99" font-size="8" font-family="monospace">明天就告白</text>
      </svg>`,
      studio:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1838"/><stop offset="1" stop-color="#0a0712"/></linearGradient></defs>
        <rect width="200" height="200" fill="url(#sky)"/>
        <polygon points="60,40 140,40 160,80 40,80" fill="#2a2545" stroke="#3a3555" stroke-width="1"/>
        <rect x="40" y="80" width="120" height="100" fill="#1a1525"/>
        <rect x="70" y="92" width="60" height="50" fill="#0f0a18" stroke="#3a3050" stroke-width="1"/>
        <rect x="72" y="94" width="56" height="46" fill="#2a2540"/>
        <ellipse cx="100" cy="135" rx="14" ry="20" fill="#1a1530" opacity="0.8"/>
        <ellipse cx="100" cy="138" rx="10" ry="16" fill="#0a0712"/>
        <g fill="#7a5cff" opacity="0.6"><circle cx="78" cy="110" r="1"/><circle cx="122" cy="105" r="1"/><circle cx="85" cy="125" r="1"/></g>
        <rect x="50" y="150" width="100" height="3" fill="#2a2545"/>
        <g fill="#fff" opacity="0.7"><circle cx="70" cy="30" r="0.8"/><circle cx="130" cy="22" r="1"/><circle cx="100" cy="18" r="0.8"/></g>
        <text x="100" y="178" text-anchor="middle" fill="#7d6e99" font-size="9" font-family="monospace">私人画室 · 月光</text>
        <text x="100" y="192" text-anchor="middle" fill="#7a5cff" font-size="8" font-family="serif">三年的画</text>
      </svg>`,
      school:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a4a"/><stop offset="1" stop-color="#1a1525"/></linearGradient></defs>
        <rect width="200" height="200" fill="url(#ssky)"/>
        <rect x="0" y="140" width="200" height="60" fill="#2a2035"/>
        <polygon points="40,100 80,70 120,70 160,100 160,140 40,140" fill="#2a2540" stroke="#3a3555" stroke-width="1"/>
        <rect x="50" y="105" width="20" height="25" fill="#1a1830"/>
        <rect x="80" y="105" width="20" height="25" fill="#1a1830"/>
        <rect x="110" y="105" width="20" height="25" fill="#1a1830"/>
        <rect x="140" y="105" width="15" height="25" fill="#1a1830"/>
        <g fill="#fbbf24" opacity="0.6"><rect x="55" y="112" width="10" height="8"/><rect x="85" y="112" width="10" height="8"/><rect x="115" y="112" width="10" height="8"/></g>
        <rect x="0" y="155" width="200" height="3" fill="#3a2a4a"/>
        <circle cx="30" cy="160" r="8" fill="#3a4a2a"/>
        <circle cx="30" cy="158" r="6" fill="#4a5a3a"/>
        <rect x="155" y="148" width="6" height="20" fill="#3a2a2a"/>
        <circle cx="158" cy="148" r="5" fill="#7a5cff" opacity="0.7"/>
        <g fill="#fbbf24" opacity="0.4"><circle cx="50" cy="30" r="1"/><circle cx="100" cy="20" r="1.2"/><circle cx="150" cy="35" r="0.8"/></g>
        <text x="100" y="178" text-anchor="middle" fill="#7d6e99" font-size="9" font-family="monospace">旧学校 · 银杏</text>
        <text x="100" y="192" text-anchor="middle" fill="#4ade80" font-size="8" font-family="serif">九年又一百八十二天</text>
      </svg>`
    };
    return arts[type] || `<svg viewBox="0 0 200 200"><rect width="200" height="200" fill="#1a1420"/><text x="100" y="100" text-anchor="middle" fill="#7d6e99" font-size="14">？</text></svg>`;
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
        <div class="ce-time">${e.time}</div>
        <div class="ce-title">${e.title}</div>
        <div class="ce-loc">${e.loc}</div>
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
        <span class="mi-title">${m.title}</span>
        <span class="mi-dur">${m.duration}</span>
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
