/* ===== 霓虹心事 · 应用入口 ===== */
(function(){
  const engine = new AVGEngine(STORY);
  const settings = engine.getSettings();

  // ===== DOM 引用 =====
  const $ = id => document.getElementById(id);
  const screens = {
    title:$('title-screen'), game:$('game-screen'), save:$('save-screen'),
    gallery:$('gallery-screen'), settings:$('settings-screen'), ending:$('ending-screen')
  };

  // ===== 屏幕切换 =====
  function showScreen(name){
    Object.values(screens).forEach(s=>s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  // ===== Toast =====
  let toastTimer = null;
  function toast(msg){
    const t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{ t.hidden = true; }, 1800);
  }

  // ===== 引擎事件 =====
  engine.on('sceneChange', ({scene, state})=>{
    // 切换背景
    const bgLayer = $('bg-layer');
    bgLayer.className = 'bg-layer bg-' + (scene.bg || 'black');
    $('status-chapter').textContent = state.chapter || '—';
    $('status-date').textContent = state.date || '—';
    // 清空立绘
    document.querySelectorAll('.sprite.slot').forEach(s=>{
      s.classList.remove('show');
      s.innerHTML = '';
    });
  });

  engine.on('step', ({step, state})=>{
    showChoiceLayer(false);
    const char = step.speaker ? STORY.characters[step.speaker] : null;
    const nameEl = $('speaker-name');
    const textEl = $('dialog-text');
    const hintEl = $('click-hint');

    if(step.type==='narration'){
      nameEl.textContent = '';
      nameEl.style.color = 'var(--ink-dim)';
    } else {
      nameEl.textContent = char?.name || '';
      nameEl.style.color = char?.color || 'var(--ink)';
    }

    // 立绘显示
    if(step.sprite){
      showSprite(step.sprite, step.mood||'neutral', 'center');
    } else if(step.speaker && STORY.characters[step.speaker]?.portrait){
      showSprite(step.speaker, step.mood||'neutral', 'center');
    }

    // 打字机
    hintEl.style.opacity = '0';
    typewriter(textEl, step.text, settings.textSpeed, ()=>{
      hintEl.style.opacity = '.7';
      isTyping = false;
    });
    isTyping = true;
    fullText = step.text;
  });

  engine.on('choice', ({step})=>{
    // 先把当前对话显示完整
    $('dialog-text').textContent = step.prompt || '';
    $('speaker-name').textContent = '';
    $('click-hint').style.opacity = '0';
    showChoiceLayer(true, step);
  });

  engine.on('ending', ({ending, state})=>{
    showEnding(ending, state);
  });

  // ===== 立绘 =====
  function showSprite(charId, mood, slot){
    const char = STORY.characters[charId];
    if(!char || !char.portrait) return;
    const slotEl = document.querySelector(`.sprite.slot[data-slot="${slot}"]`);
    // 简单的立绘切换：如果当前显示的不是这个角色，则更新
    const currentChar = slotEl.dataset.char;
    if(currentChar !== charId){
      slotEl.classList.remove('show');
      setTimeout(()=>{
        slotEl.innerHTML = `<div class="sprite-art">${char.portrait(mood)}</div>`;
        slotEl.dataset.char = charId;
        slotEl.dataset.mood = mood;
        // 强制重绘后显示
        requestAnimationFrame(()=> slotEl.classList.add('show'));
      }, 200);
    } else if(slotEl.dataset.mood !== mood){
      // 只换表情
      slotEl.querySelector('.sprite-art').innerHTML = char.portrait(mood);
      slotEl.dataset.mood = mood;
    }
  }

  // ===== 打字机 =====
  let isTyping = false;
  let fullText = '';
  let typeTimer = null;
  function typewriter(el, text, speed, done){
    clearTimeout(typeTimer);
    el.textContent = '';
    // speed: 0-100, 0=最慢, 100=最快(瞬显示)
    if(speed >= 95){
      el.textContent = text;
      done && done();
      return;
    }
    const delay = Math.max(8, 80 - speed * 0.75);
    let i = 0;
    function tick(){
      if(i >= text.length){
        el.textContent = text;
        done && done();
        return;
      }
      el.textContent = text.slice(0, i+1);
      i++;
      typeTimer = setTimeout(tick, delay);
    }
    tick();
  }
  function finishTyping(){
    if(isTyping){
      clearTimeout(typeTimer);
      $('dialog-text').textContent = fullText;
      $('click-hint').style.opacity = '.7';
      isTyping = false;
    }
  }

  // ===== 选项层 =====
  function showChoiceLayer(show, step){
    const layer = $('choice-layer');
    if(!show){ layer.hidden = true; return; }
    $('choice-prompt').textContent = step.prompt || '';
    const list = $('choice-list');
    list.innerHTML = '';
    step.options.forEach((opt, i)=>{
      const btn = document.createElement('button');
      btn.className = 'choice-item';
      btn.innerHTML = opt.text + (opt.hint?`<span class="hint">${opt.hint}</span>`:'');
      btn.onclick = (e)=>{
        e.stopPropagation();
        engine.choose(i);
      };
      list.appendChild(btn);
    });
    layer.hidden = false;
  }

  // ===== 结局画面 =====
  function showEnding(ending, state){
    const bgEl = $('ending-bg');
    bgEl.className = 'ending-bg bg-' + (ending.bg || 'black');
    $('ending-tag').textContent = ending.tag || 'END';
    $('ending-title').textContent = ending.title || '';
    $('ending-text').textContent = ending.text || '';
    // 保存结局记录
    localStorage.setItem('neon_endings', JSON.stringify(state.endingSeen));
    showScreen('ending');
  }

  // ===== 游戏交互 =====
  function handleAdvance(){
    if(screens.game.classList.contains('active') === false) return;
    if($('choice-layer').hidden === false) return; // 选项时不响应
    if($('quick-menu').hidden === false) return;
    if($('log-panel').hidden === false) return;
    if(isTyping){
      finishTyping();
    } else {
      engine.next();
    }
  }

  $('dialog-box').addEventListener('click', handleAdvance);
  $('stage').addEventListener('click', handleAdvance);

  // 键盘
  document.addEventListener('keydown', (e)=>{
    if(!screens.game.classList.contains('active')) return;
    if(e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight'){
      e.preventDefault();
      handleAdvance();
    } else if(e.code === 'Escape'){
      toggleQuickMenu(false);
      $('log-panel').hidden = true;
    } else if(e.code === 'KeyL'){
      toggleLog();
    }
  });

  // ===== 快捷菜单 =====
  function toggleQuickMenu(show){
    const m = $('quick-menu');
    m.hidden = show === false ? true : !m.hidden;
  }
  $('log-panel').addEventListener('click', (e)=>{
    if(e.target === $('log-panel')) $('log-panel').hidden = true;
  });

  // 回看
  function toggleLog(){
    const panel = $('log-panel');
    if(panel.hidden){
      const list = $('log-list');
      list.innerHTML = '';
      if(engine.history.length === 0){
        list.innerHTML = '<div style="color:var(--ink-mute);text-align:center;padding:40px;">暂无回看记录</div>';
      } else {
        engine.history.forEach(h=>{
          const item = document.createElement('div');
          item.className = 'log-item';
          item.innerHTML = (h.name?`<div class="name">${h.name}</div>`:'') + `<div class="text">${h.text}</div>`;
          list.appendChild(item);
        });
        list.scrollTop = list.scrollHeight;
      }
      panel.hidden = false;
    } else {
      panel.hidden = true;
    }
  }

  // ===== 自动播放 / 跳过 =====
  let autoTimer = null;
  let autoMode = false;
  let skipMode = false;
  function startAuto(){
    autoMode = true;
    const tick = ()=>{
      if(!autoMode) return;
      if(!screens.game.classList.contains('active')){ autoMode = false; return; }
      if(!$('choice-layer').hidden){ return; } // 选项时暂停
      if(isTyping){
        finishTyping();
      } else {
        engine.next();
      }
      autoTimer = setTimeout(tick, settings.autoInterval * 1000);
    };
    tick();
  }
  function stopAuto(){
    autoMode = false;
    clearTimeout(autoTimer);
  }
  function toggleAuto(){
    if(autoMode){ stopAuto(); toast('自动播放：关'); }
    else { startAuto(); toast('自动播放：开'); }
    document.querySelector('[data-action="auto"]').classList.toggle('active', autoMode);
  }
  function toggleSkip(){
    skipMode = !skipMode;
    document.querySelector('[data-action="skip"]').classList.toggle('active', skipMode);
    toast(skipMode?'跳过：开':'跳过：关');
    if(skipMode){
      const tick = ()=>{
        if(!skipMode) return;
        if(!screens.game.classList.contains('active')){ skipMode = false; return; }
        if(!$('choice-layer').hidden){ return; }
        if(isTyping){ finishTyping(); }
        else { engine.next(); }
        setTimeout(tick, 80);
      };
      tick();
    }
  }

  // ===== 存档界面 =====
  let saveMode = 'save'; // 'save' | 'load'
  function renderSaveList(){
    const list = $('save-list');
    list.innerHTML = '';
    const saves = engine.getAllSaves();
    for(let i=1; i<=12; i++){
      const slot = $('save-list').appendChild(document.createElement('div'));
      const data = saves[i];
      slot.className = 'save-slot' + (data?'':' empty');
      slot.innerHTML = `
        <div class="slot-no">存档 ${String(i).padStart(2,'0')}</div>
        ${data ? `
          <div class="slot-info">${data.label || '未命名'}</div>
          <div class="slot-meta">${new Date(data.time).toLocaleString('zh-CN')}</div>
          <div class="slot-actions">
            ${saveMode==='save' ? '<button data-act="save">覆盖</button>' : '<button data-act="load">读取</button>'}
            ${data ? '<button data-act="delete">删除</button>' : ''}
          </div>
        ` : (saveMode==='save' ? '<div class="slot-meta">空槽位</div><div class="slot-actions"><button data-act="save">新建存档</button></div>' : '<div class="slot-meta">空槽位</div>')}
      `;
      slot.querySelectorAll('button').forEach(btn=>{
        btn.onclick = (e)=>{
          e.stopPropagation();
          const act = btn.dataset.act;
          if(act==='save'){
            engine.state.sceneId = engine.state.sceneId || 'prologue_1';
            engine.save(i);
            toast('已保存到存档 ' + i);
            renderSaveList();
          } else if(act==='load'){
            if(engine.load(i)){
              showScreen('game');
              toast('已读取存档 ' + i);
            } else {
              toast('读取失败');
            }
          } else if(act==='delete'){
            engine.deleteSave(i);
            toast('已删除存档 ' + i);
            renderSaveList();
          }
        };
      });
    }
  }

  // ===== 设定集 =====
  function renderGallery(tab){
    const content = $('gallery-content');
    content.innerHTML = '';
    if(tab === 'characters'){
      Object.entries(STORY.characters).filter(([k])=>k!=='narrator').forEach(([id, c])=>{
        const card = document.createElement('div');
        card.className = 'char-card';
        const portraitSVG = c.portrait ? c.portrait('neutral') : '<svg viewBox="0 0 200 320"><rect width="200" height="320" fill="#1a1428"/><text x="100" y="170" text-anchor="middle" fill="#7d6e99" font-size="14">未设定</text></svg>';
        card.innerHTML = `
          <div class="char-portrait">${portraitSVG}</div>
          <div class="char-info">
            <h3 style="color:${c.color}">${c.name}</h3>
            <div class="meta">${c.age?c.age+'岁 · ':''}${id==='linxia'?'女主角':'可攻略男主'}</div>
            <div class="desc">${c.desc || ''}</div>
            ${c.tags ? `<div class="tags">${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>` : ''}
          </div>
        `;
        content.appendChild(card);
      });
    } else if(tab === 'world'){
      const entries = [
        {h:'霓城', p:'故事发生地。一座永不熄灯的滨海大都市，新旧城区交界处藏着无数故事。这里既是机会之地，也是孤独之城的代名词。'},
        {h:'砚美术馆', p:'由旧工厂改造的当代美术馆，沈砚之家族产业。以"光与影的几何"系列展览闻名业界。'},
        {h:'雾港酒吧', p:'巷子深处的隐秘酒吧，江屿经营。墙上挂着落灰的电吉他，是前"渡鸦乐队"的遗物。酒单上的"夏"特调，是镇店之作。'},
        {h:'《夏》', p:'江屿写过的最后一首歌。原本是写给早逝妹妹林夏的，后来却成了他无法完成的执念。'},
        {h:'渡鸦乐队', p:'三年前活跃于地下音乐圈的乐队。一场舞台事故后解散，鼓手罹难，主唱江屿从此退圈。'}
      ];
      entries.forEach(e=>{
        const div = document.createElement('div');
        div.className = 'world-entry';
        div.innerHTML = `<h4>${e.h}</h4><p>${e.p}</p>`;
        content.appendChild(div);
      });
    } else if(tab === 'endings'){
      const seen = JSON.parse(localStorage.getItem('neon_endings')||'{}');
      Object.entries(STORY.endings).forEach(([id, e])=>{
        const div = document.createElement('div');
        div.className = 'ending-entry' + (seen[id]?' unlocked':'');
        const title = seen[id] ? e.title : '？？？';
        const status = seen[id] ? '已解锁' : '未解锁';
        div.innerHTML = `<span class="e-title">${title}</span><span class="e-status">${status}</span>`;
        content.appendChild(div);
      });
    }
  }

  // ===== 设置 =====
  function initSettings(){
    $('text-speed').value = settings.textSpeed;
    $('text-speed-val').textContent = settings.textSpeed;
    $('auto-interval').value = settings.autoInterval;
    $('auto-interval-val').textContent = settings.autoInterval;
    $('sfx-toggle').checked = settings.sfx;
    $('skip-unread').checked = settings.skipUnread;

    $('text-speed').oninput = e=>{ settings.textSpeed = +e.target.value; $('text-speed-val').textContent = settings.textSpeed; };
    $('auto-interval').oninput = e=>{ settings.autoInterval = +e.target.value; $('auto-interval-val').textContent = settings.autoInterval; };
    $('sfx-toggle').onchange = e=>{ settings.sfx = e.target.checked; };
    $('skip-unread').onchange = e=>{ settings.skipUnread = e.target.checked; };
  }
  function persistSettings(){
    engine.saveSettings(settings);
    toast('设置已保存');
  }

  // ===== 全局事件委托 =====
  document.body.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-action]');
    if(!btn) return;
    const act = btn.dataset.action;
    switch(act){
      case 'new-game':
        engine.newGame();
        showScreen('game');
        break;
      case 'continue': {
        // 读取最近一次存档
        const saves = engine.getAllSaves();
        const latest = Object.entries(saves).sort((a,b)=> new Date(b[1].time) - new Date(a[1].time))[0];
        if(latest){
          engine.load(+latest[0]);
          showScreen('game');
          toast('已读取最近存档');
        } else {
          toast('没有可用的存档');
        }
        break;
      }
      case 'load':
        saveMode = 'load';
        $('save-title').textContent = '读取存档';
        renderSaveList();
        showScreen('save');
        break;
      case 'save':
        saveMode = 'save';
        $('save-title').textContent = '保存进度';
        renderSaveList();
        showScreen('save');
        break;
      case 'gallery':
        renderGallery('characters');
        showScreen('gallery');
        break;
      case 'settings':
        initSettings();
        showScreen('settings');
        break;
      case 'back-to-title':
        stopAuto();
        skipMode = false;
        toggleQuickMenu(false);
        $('log-panel').hidden = true;
        showScreen('title');
        break;
      case 'quick-menu':
        toggleQuickMenu();
        break;
      case 'close-menu':
        toggleQuickMenu(false);
        break;
      case 'auto':
        toggleAuto();
        break;
      case 'skip':
        toggleSkip();
        break;
      case 'log':
        toggleLog();
        toggleQuickMenu(false);
        break;
      case 'close-log':
        $('log-panel').hidden = true;
        break;
    }
  });

  // 设定集 tab
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.onclick = ()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.tab);
    };
  });

  // 设置离开时保存
  $('settings-screen').addEventListener('click', (e)=>{
    if(e.target.dataset.action === 'back-to-title'){
      persistSettings();
    }
  });

  // 存档界面返回时若是游戏中则回游戏
  // （由 back-to-title 统一处理回标题）

  initSettings();
  // 启动
  showScreen('title');
})();
