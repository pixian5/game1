/* ===== 霓虹心事 · UI：出行地图与偶遇/回忆剧情屏 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 出行/地图 =====
  function renderMap(){
    const cur = engine.state.currentLocation || 'home';
    const curLoc = STORY.locations[cur];
    $('map-current-name').textContent = curLoc ? (curLoc.icon + ' ' + curLoc.name) : '未知';
    $('map-current-hint').textContent = curLoc ? curLoc.hint : '';
    const list = $('map-list');
    list.innerHTML = '';
    Object.entries(STORY.locations).forEach(([id, loc])=>{
      const item = document.createElement('button');
      item.className = 'map-item' + (id===cur ? ' current' : '');
      item.dataset.loc = id;
      item.innerHTML = `
        <div class="map-item-icon">${loc.icon}</div>
        <div class="map-item-info">
          <div class="map-item-name">${escapeHtml(loc.name)}</div>
          <div class="map-item-hint">${loc.hint}</div>
        </div>
        ${id===cur ? '<div class="map-item-tag">当前</div>' : '<div class="map-item-go">前往</div>'}
      `;
      list.appendChild(item);
    });
  }
  function goToLocation(locId){
    if(locId === engine.state.currentLocation){
      // 已在当前地点，仍尝试触发偶遇
      const ok = engine.tryEncounter(locId);
      if(!ok) toast('这里暂时没有新发现…');
      return;
    }
    const hadEncounter = engine.goToLocation(locId);
    renderMap();
    if(!hadEncounter) toast(t('到了{loc}，没什么特别的', {loc: STORY.locations[locId]?.name || ''}));
  }

  // ===== 偶遇/回忆剧情屏 =====
  let currentEncounter = null;
  function showEncounter(enc){
    currentEncounter = enc;
    const _t = window.t;  // v0.5.3（E4）
    $('encounter-title').textContent = _t(enc.title);
    $('encounter-desc').textContent = _t(enc.desc);
    const opts = $('encounter-options');
    opts.innerHTML = '';
    if(enc.choice){
      enc.choice.options.forEach((opt, i)=>{
        const btn = document.createElement('button');
        btn.className = 'dream-opt';
        btn.innerHTML = escapeHtml(window.t(opt.text)) + (opt.hint?` <span style="color:var(--ink-mute);font-size:11px">(${escapeHtml(window.t(opt.hint))})</span>`:'');
        btn.dataset.encOpt = i;
        opts.appendChild(btn);
      });
    } else {
      // 无选择，加一个"继续"按钮
      const btn = document.createElement('button');
      btn.className = 'dream-opt';
      btn.textContent = '继续';
      btn.dataset.encOpt = '0';
      opts.appendChild(btn);
    }
    showScreen('encounter');
  }
  function closeEncounter(){
    if(currentEncounter && !currentEncounter.isMemory){
      engine.cancelPendingInteraction(currentEncounter);
    }
    currentEncounter = null;
    showScreen('map');
  }
