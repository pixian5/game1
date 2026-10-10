/* ===== 霓虹心事 · UI：收集柜与线索解谜 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.10 收集柜 =====
  let collectionCurrentCat = 'all';
  function renderCollection(cat){
    collectionCurrentCat = cat || collectionCurrentCat;
    document.querySelectorAll('.collection-tab').forEach(t=>{
      t.classList.toggle('active', t.dataset.collCat === collectionCurrentCat);
    });
    const allItems = Object.values(STORY.collectibles || {});
    const total = allItems.length;
    const collected = engine.state.collected.length;
    $('collection-count').textContent = `${collected}/${total}`;
    const content = $('collection-content');
    let items = allItems;
    if(collectionCurrentCat !== 'all') items = items.filter(i=>i.cat === collectionCurrentCat);
    content.innerHTML = items.map(item=>{
      const isCollected = engine.state.collected.includes(item.id);
      return `<div class="coll-card ${isCollected?'':'locked'}">
        <div class="coll-card-icon">${isCollected ? item.icon : '❓'}</div>
        <div class="coll-card-name">${isCollected ? escapeHtml(item.name) : '未收集'}</div>
        <div class="coll-card-desc">${isCollected ? escapeHtml(item.desc) : '等待霓城的某一个瞬间…'}</div>
        ${isCollected ? `<div class="coll-card-how">${escapeHtml(item.how)}</div>` : ''}
      </div>`;
    }).join('');
    // 隐藏彩蛋
    const eggsEl = $('collection-eggs');
    const allEggs = Object.values(STORY.easterEggs || {});
    eggsEl.innerHTML = allEggs.map(egg=>{
      const seen = engine.state.easterEggsSeen[egg.id];
      return `<div class="coll-egg ${seen?'':'locked'}">
        <div class="coll-egg-icon">${seen ? egg.icon : '🔒'}</div>
        <div class="coll-egg-info">
          <div class="coll-egg-name">${seen ? escapeHtml(egg.name) : '???'}</div>
          <div class="coll-egg-desc">${seen ? escapeHtml(egg.desc) : '尚未触发'}</div>
        </div>
      </div>`;
    }).join('');
  }
  engine.on('itemCollected', ({item, itemId})=>{
    AudioSys.play('achieve');  // v0.1.7: 收集提示音
    showNotif('susu', `✦ 新收集：${item.name}`);
    if(screens.collection && screens.collection.classList.contains('active')){
      renderCollection(collectionCurrentCat);
    }
  });
  engine.on('easterEggUnlocked', (eggs)=>{
    eggs.forEach(egg=>{
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `✦ 彩蛋：${egg.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 3000);
    });
  });

  // ===== v0.0.10 线索本/解谜 =====
  let currentPuzzleId = null;
  function renderPuzzles(){
    const content = $('puzzles-content');
    const puzzles = engine.getAllPuzzles();
    if(puzzles.length === 0){
      content.innerHTML = '<div class="shop-empty">暂无线索</div>';
      return;
    }
    content.innerHTML = puzzles.map(p=>{
      const statusCls = p.solved ? 'solved' : '';
      const statusText = p.solved ? '已解开' : (p.attemptCount > 0 ? `已尝试 ${p.attemptCount} 次` : '未尝试');
      const discoveredClues = p.clues.filter(c=>c.discovered).length;
      return `<div class="puzzle-card ${statusCls}" data-puzzle="${p.id}">
        <div class="puzzle-card-title">
          <span>${escapeHtml(p.title)}</span>
          <span class="puzzle-card-status ${p.solved?'solved':''}">${statusText}</span>
        </div>
        <div class="puzzle-card-desc">${escapeHtml(p.desc)}</div>
        <div class="puzzle-card-meta">线索 ${discoveredClues}/${p.clues.length} · 点击进入</div>
      </div>`;
    }).join('');
  }
  function openPuzzleDetail(puzzleId){
    currentPuzzleId = puzzleId;
    renderPuzzleDetail(puzzleId);
    showScreen('puzzleDetail');
  }
  function renderPuzzleDetail(puzzleId){
    const puzzle = STORY.puzzles?.[puzzleId];
    if(!puzzle) return;
    const progress = engine.state.puzzleProgress[puzzleId] || {};
    $('puzzle-detail-title').textContent = puzzle.title;
    const content = $('puzzle-detail-content');
    let html = `<div class="pd-desc">${escapeHtml(puzzle.desc)}</div>`;
    html += '<div class="pd-section-title">线索</div>';
    puzzle.clues.forEach(c=>{
      const discovered = engine.state.discoveredClues[c.id];
      html += `<div class="pd-clue">
        <div class="pd-clue-text">
          ${discovered ? escapeHtml(c.text) : '<span style="color:var(--ink-mute)">未发现线索 · 点击发现</span>'}
          ${discovered ? `<span class="pd-clue-digit">${c.digit}</span>` : ''}
        </div>
        ${!discovered ? `<button data-clue="${c.id}" style="margin-top:6px;padding:4px 10px;font-size:11px;background:rgba(255,255,255,0.05);color:var(--ink-mute);border:0.5px solid rgba(255,255,255,0.1);border-radius:6px;cursor:pointer;">翻开这条线索</button>` : ''}
      </div>`;
    });
    // 输入区
    if(progress.solved){
      html += `<div class="pd-result success">✓ ${escapeHtml(puzzle.onSuccess)}</div>`;
    } else {
      html += '<div class="pd-section-title" style="margin-top:18px;">输入答案</div>';
      html += `<div class="pd-input-row">
        <input type="text" class="pd-input" id="puzzle-answer-input" maxlength="4" placeholder="____" inputmode="numeric">
        <button class="pd-submit" data-action="submit-puzzle">提交</button>
      </div>`;
      html += `<div class="pd-hint">${escapeHtml(puzzle.hint)}</div>`;
      if(progress.attemptCount > 0){
        html += `<div class="pd-result fail">✗ ${escapeHtml(puzzle.onFail)}（已尝试 ${progress.attemptCount} 次）</div>`;
      }
    }
    content.innerHTML = html;
  }
  function handlePuzzleSubmit(){
    const input = $('puzzle-answer-input');
    if(!input || !currentPuzzleId) return;
    const answer = input.value.trim();
    if(!answer){ toast('请输入答案'); return; }
    const r = engine.attemptPuzzle(currentPuzzleId, answer);
    if(r.solved){
      toast('谜题已解开');
    } else {
      toast(r.message || '答案不对');
    }
    renderPuzzleDetail(currentPuzzleId);
  }
  engine.on('puzzleSolved', ({puzzleId, puzzle, reward})=>{
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = `🔍 谜题解开：${puzzle.title}`;
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 3000);
  });
