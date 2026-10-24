/* ===== 霓虹心事 · UI：礼物商城与心情状态 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.9 礼物商城 =====
  let shopCurrentTab = 'store';
  function renderShop(tab){
    shopCurrentTab = tab || shopCurrentTab;
    document.querySelectorAll('.shop-tab').forEach(t=>{
      t.classList.toggle('active', t.dataset.shopTab === shopCurrentTab);
    });
    $('shop-coins').textContent = '💰 ' + engine.state.coins;
    const content = $('shop-content');
    if(shopCurrentTab === 'store'){
      const items = Object.values(STORY.shop.items);
      content.innerHTML = items.map(item=>{
        const canAfford = engine.state.coins >= item.price;
        return `<div class="shop-item">
          <div class="shop-item-icon">${item.icon}</div>
          <div class="shop-item-info">
            <div class="shop-item-name">${escapeHtml(item.name)} <span style="font-size:10px;color:var(--ink-mute)">·${item.cat}</span></div>
            <div class="shop-item-desc">${escapeHtml(item.desc)}</div>
            <div class="shop-item-price">💰 ${item.price}</div>
          </div>
          <button class="shop-buy-btn" data-buy="${item.id}" ${canAfford?'':'disabled'}>${canAfford?'购买':'金币不足'}</button>
        </div>`;
      }).join('');
    } else if(shopCurrentTab === 'inventory'){
      const inv = engine.state.inventory;
      if(inv.length === 0){
        content.innerHTML = '<div class="shop-empty">背包空空如也<br>去商店买点礼物送给他吧</div>';
      } else {
        // 按物品id分组
        const grouped = {};
        inv.forEach(g=>{ grouped[g.id] = (grouped[g.id]||0) + 1; });
        content.innerHTML = Object.entries(grouped).map(([itemId, count])=>{
          const item = STORY.shop.items[itemId];
          if(!item) return '';
          return `<div class="shop-item">
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-info">
              <div class="shop-item-name">${escapeHtml(item.name)} ×${count}</div>
              <div class="shop-item-desc">${escapeHtml(item.desc)}</div>
            </div>
            <button class="shop-buy-btn" data-send-gift="${itemId}" style="background:var(--accent2)">送出</button>
          </div>`;
        }).join('');
      }
    } else if(shopCurrentTab === 'gifts'){
      const gifts = engine.state.gifts;
      if(gifts.length === 0){
        content.innerHTML = '<div class="shop-empty">还没送出过礼物</div>';
      } else {
        content.innerHTML = gifts.slice().reverse().map(g=>{
          const item = STORY.shop.items[g.itemId];
          const char = STORY.characters[g.to] || {};
          const multLabel = g.mult >= 2 ? '最爱 ⭐⭐' : (g.mult >= 1.5 ? '喜欢 ⭐' : (g.mult >= 1 ? '一般' : '不喜欢'));
          return `<div class="shop-item">
            <div class="shop-item-icon">${item?.icon || '🎁'}</div>
            <div class="shop-item-info">
              <div class="shop-item-name">${char.avatar||''} ${char.name||g.to} · ${escapeHtml(item?.name||'')}</div>
              <div class="shop-item-desc">第${g.day}天送出 · ${multLabel} · 好感 +${g.gain}</div>
            </div>
          </div>`;
        }).join('');
      }
    }
  }
  function handleBuyGift(itemId){
    const r = engine.buyGift(itemId);
    if(!r.ok){ toast(r.reason); return; }
    toast(t('已购买：{name}', {name: r.item.name}));
    renderShop(shopCurrentTab);
  }
  let giftSendItemId = null;
  let giftSendCharId = null;
  function openGiftSendModal(itemId){
    giftSendItemId = itemId;
    giftSendCharId = null;
    const item = STORY.shop.items[itemId];
    if(!item) return;
    const modal = document.createElement('div');
    modal.className = 'gift-send-modal';
    modal.id = 'gift-send-modal';
    modal.innerHTML = `<div class="gift-send-content">
      <div class="gift-send-title">把「${escapeHtml(item.name)}」送给谁？</div>
      <div class="gift-send-char">
        ${['shenyan','luci','jiangyu'].map(cid=>{
          const c = STORY.characters[cid];
          return `<button class="gift-send-char-btn" data-gift-char="${cid}" style="background:${c.bg}" title="${c.name}">${avatarImg(c)}</button>`;
        }).join('')}
      </div>
      <div class="gift-pref-hint" id="gift-pref-hint">点击头像查看他对此礼物的喜好</div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;">
        <button data-action="cancel-gift" style="padding:8px 20px;background:rgba(255,255,255,0.08);color:var(--ink);border:none;border-radius:10px;font-size:13px;cursor:pointer;">取消</button>
        <button data-action="confirm-gift" id="gift-confirm-btn" disabled style="padding:8px 20px;background:var(--accent);color:#fff;border:none;border-radius:10px;font-size:13px;cursor:pointer;opacity:0.4;">确认送出</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
    // 点击背景关闭
    modal.addEventListener('click', e=>{ if(e.target === modal) closeGiftSendModal(); });
  }
  function selectGiftChar(charId){
    giftSendCharId = charId;
    document.querySelectorAll('.gift-send-char-btn').forEach(b=>{
      b.classList.toggle('selected', b.dataset.giftChar === charId);
    });
    const prefs = STORY.shop.preferences[charId] || {};
    const mult = prefs[giftSendItemId];
    const hintEl = $('gift-pref-hint');
    const confirmBtn = $('gift-confirm-btn');
    if(!mult){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">一般（×1）</span>';
    } else if(mult >= 2){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">最爱（×2）⭐⭐</span>';
    } else if(mult >= 1.5){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">喜欢（×1.5）⭐</span>';
    } else if(mult >= 1){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">一般（×1）</span>';
    } else {
      hintEl.innerHTML = '他不太喜欢这类东西（×0.5）';
    }
    if(confirmBtn){ confirmBtn.disabled = false; confirmBtn.style.opacity = '1'; }
  }
  function handleConfirmGift(){
    if(!giftSendItemId || !giftSendCharId){ toast('请选择赠送对象'); return; }
    const r = engine.giveGift(giftSendCharId, giftSendItemId);
    closeGiftSendModal();
    if(!r.ok){ toast(r.reason); return; }
    const charName = STORY.characters[giftSendCharId]?.name || '';
    toast(t('已送出 · {char} 好感 +{gain}', {char: charName, gain: r.gain}));
    renderShop(shopCurrentTab);
  }
  function closeGiftSendModal(){
    const m = $('gift-send-modal');
    if(m) m.remove();
    giftSendItemId = null;
    giftSendCharId = null;
  }
  engine.on('giftGiven', ({to, itemId, mult, gain, reaction})=>{
    const char = STORY.characters[to];
    if(char) showNotif(to, `收到礼物 · 好感 +${gain}`);
  });

  // ===== v0.0.9 心情状态+内心独白 =====
  function renderMood(){
    const content = $('mood-content');
    const cur = STORY.moods[engine.state.mood] || STORY.moods.calm;
    let html = `<div class="mood-current">
      <div class="mood-current-icon">${cur.icon}</div>
      <div class="mood-current-label">${cur.label}</div>
      <div class="mood-current-hint">"${escapeHtml(cur.hint)}"</div>
    </div>`;
    html += '<div class="mood-section-title">切换心情</div>';
    html += '<div class="mood-grid">';
    Object.values(STORY.moods).forEach(m=>{
      html += `<div class="mood-opt ${m.id===engine.state.mood?'selected':''}" data-mood-opt="${m.id}">
        <div class="mood-opt-icon">${m.icon}</div>
        <div class="mood-opt-label">${m.label}</div>
      </div>`;
    });
    html += '</div>';
    // 内心独白
    html += '<div class="mood-diary-section">';
    html += '<div class="mood-section-title">内心独白</div>';
    html += `<textarea class="mood-diary-input" id="mood-diary-text" placeholder="今天发生了什么？把心里的话写下来…"></textarea>`;
    html += '<button class="mood-diary-submit" data-action="submit-diary">记下这一刻</button>';
    // 历史日记
    if(engine.state.diary.length > 0){
      html += '<div class="mood-diary-list">';
      engine.state.diary.slice().reverse().slice(0, 5).forEach(d=>{
        const m = STORY.moods[d.mood] || {icon:'·'};
        html += `<div class="mood-diary-item">
          <div class="mood-diary-item-text">${m.icon} ${escapeHtml(d.text)}</div>
          <div class="mood-diary-item-meta">第${d.day}天 ${d.time}</div>
        </div>`;
      });
      html += '</div>';
    }
    html += '</div>';
    content.innerHTML = html;
  }
  function handleDiarySubmit(){
    const field = $('mood-diary-text');
    if(!field) return;
    const text = field.value.trim();
    if(!text){ toast('先写点什么吧'); return; }
    engine.addDiary(text);
    toast('已记下');
    renderMood();
  }
  engine.on('moodChanged', ({mood, moodInfo})=>{
    toast(t('心情：{mood}', {mood: moodInfo.label}));
  });
