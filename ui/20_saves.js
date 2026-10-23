/* ===== 霓虹心事 · UI：存档 App =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.1.0 存档 App =====
  function formatSaveTime(iso){
    if(!iso) return '—';
    try {
      const d = new Date(iso);
      if(Number.isNaN(d.getTime())) return '—';
      const pad = n => String(n).padStart(2,'0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch(_){
      return '—';
    }
  }
  function slotDisplayName(slot){
    if(slot === 'auto') return '自动存档';
    if(slot === 'slot1') return '手动槽位 1';
    if(slot === 'slot2') return '手动槽位 2';
    if(slot === 'slot3') return '手动槽位 3';
    return slot;
  }
  function updateSavesBadge(){
    const b = $('badge-saves');
    const counter = $('saves-counter');
    const slots = engine.listSaveSlots ? engine.listSaveSlots() : [];
    const used = slots.filter(s => !s.empty).length;
    if(b){
      if(used > 0){ b.textContent = used; b.hidden = false; }
      else b.hidden = true;
    }
    if(counter) counter.textContent = `${used}/${slots.length || 4}`;
  }
  function updateLockContinueBtn(){
    const btn = $('lock-continue-btn');
    if(!btn) return;
    const has = engine.hasAnySave ? engine.hasAnySave() : false;
    btn.hidden = !has;
  }
  function afterLoadRefresh(){
    resetTransientUi();
    updateTimeDisplay();
    updateBadges();
    updateSavesBadge();
    updateLockContinueBtn();
    applyThemeToBody();
    applyAmbienceToBody(engine.getCurrentAmbience ? engine.getCurrentAmbience() : null);
    // 关闭可能残留的覆盖层，再按存档中的进行中状态恢复。
    currentDateScene = null;
    if(screens.dateScene) screens.dateScene.classList.remove('active');
    if(screens.nightmare) screens.nightmare.classList.remove('active');
    return restorePendingUi();
  }
  function renderSaves(){
    const content = $('saves-content');
    if(!content || !engine.listSaveSlots) return;
    const slots = engine.listSaveSlots();
    let html = `<div class="saves-intro">自动存档会在关键进度变化时写入。手动槽位可长期保留；支持导出/导入 JSON。</div>`;
    slots.forEach(s => {
      const summary = s.summary || {};
      const title = slotDisplayName(s.slot);
      const tag = s.isAuto ? 'AUTO' : 'MANUAL';
      const meta = s.empty
        ? '空槽位 · 可写入当前进度'
        : `${escapeHtml(s.label || '')}<br>${escapeHtml(summary.playerName || '林夏')} · ${escapeHtml(summary.routeLabel || '未选线')}<br>${escapeHtml(formatSaveTime(s.time))}${s.note ? ' · ' + escapeHtml(s.note) : ''}`;
      html += `<div class="save-slot ${s.empty?'empty':''}">
        <div class="save-slot-top">
          <div class="save-slot-title">${escapeHtml(title)}</div>
          <div class="save-slot-tag">${tag}</div>
        </div>
        <div class="save-slot-meta">${meta}</div>
        <div class="save-slot-actions">
          <button class="save-btn primary" data-save-action="write" data-slot="${escapeHtml(s.slot)}">${s.empty?'写入':'覆盖写入'}</button>
          ${s.empty ? '' : `<button class="save-btn primary" data-save-action="load" data-slot="${escapeHtml(s.slot)}">读取</button>
          <button class="save-btn" data-save-action="export" data-slot="${escapeHtml(s.slot)}">导出</button>
          <button class="save-btn danger" data-save-action="delete" data-slot="${escapeHtml(s.slot)}">删除</button>`}
          <button class="save-btn" data-save-action="import" data-slot="${escapeHtml(s.slot)}">导入到此</button>
        </div>
      </div>`;
    });
    html += `<div class="saves-intro" style="margin-top:8px;">提示：删除仅影响本地浏览器存档，不会回滚剧情文件。</div>`;
    content.innerHTML = html;
    updateSavesBadge();
  }
  function downloadText(filename, text){
    const blob = new Blob([text], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setUiTimeout(()=> URL.revokeObjectURL(url), 1000);
  }
  function handleSaveAction(action, slot){
    if(!action) return;
    if(action === 'write'){
      const ok = engine.save(slot || 'slot1', {note: '手动存档'});
      toast(ok ? `已保存到 ${slotDisplayName(slot)}` : '保存失败');
      renderSaves();
      updateLockContinueBtn();
      return;
    }
    if(action === 'load'){
      const ok = engine.load(slot);
      if(ok){
        const restored = afterLoadRefresh();
        toast(`已读取 ${slotDisplayName(slot)}`);
        if(!restored) showScreen('home');
      } else toast('读取失败');
      return;
    }
    if(action === 'delete'){
      if(!confirm(`确认删除 ${slotDisplayName(slot)}？`)) return;
      const ok = engine.deleteSave(slot);
      toast(ok ? '已删除' : '删除失败');
      renderSaves();
      updateLockContinueBtn();
      return;
    }
    if(action === 'export'){
      const text = engine.exportSave(slot);
      if(!text){ toast('导出失败'); return; }
      downloadText(`neon-heart-${slot}.json`, text);
      toast('已导出');
      return;
    }
    if(action === 'import'){
      const input = $('save-import-input');
      if(!input){ toast('导入控件缺失'); return; }
      input.value = '';
      input.onchange = ()=>{
        const file = input.files && input.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = ()=>{
          const res = engine.importSave(String(reader.result || ''), slot || 'slot1');
          if(res && res.ok){
            toast(`已导入到 ${slotDisplayName(res.slot || slot)}`);
            renderSaves();
            updateLockContinueBtn();
          } else {
            toast('导入失败：' + (res?.reason || '未知错误'));
          }
        };
        reader.readAsText(file);
      };
      input.click();
    }
  }

  // 氛围层应用到 body
  function applyAmbienceToBody(amb){
    const overlay = amb?.wallpaperOverlay || 'transparent';
    document.body.style.setProperty('--ambience-overlay', overlay);
    // 应用到 #phone-frame::before
    const phoneFrame = document.getElementById('phone-frame');
    if(phoneFrame){
      phoneFrame.style.setProperty('--ambience-overlay', overlay);
    }
    // v0.2.7 (M1.3): 同步把氛围纹理合成进壁纸层
    if(typeof composeWallpaper === 'function') composeWallpaper();
  }

  function handleMomentReply(replyData){
    // replyData 格式: `${momentId}|${charId}|${commentIdx}|${replyIdx}`
    const parts = replyData.split('|');
    if(parts.length !== 4) return;
    const [momentId, charId, commentIdx, replyIdx] = parts;
    engine.replyMomentComment(momentId, charId, parseInt(commentIdx), parseInt(replyIdx));
  }

  engine.on('gameSaved', ()=>{
    updateSavesBadge();
    updateLockContinueBtn();
    if(screens.saves && screens.saves.classList.contains('active')) renderSaves();
  });
  engine.on('gameLoaded', ()=>{
    afterLoadRefresh();
  });
  engine.on('gameDeleted', ()=>{
    updateSavesBadge();
    updateLockContinueBtn();
  });
  engine.on('gameImported', ()=>{
    updateSavesBadge();
    updateLockContinueBtn();
  });
  engine.on('saveFailed', ({error})=>{
    toast('存档失败：' + (error || '未知错误'));
  });
