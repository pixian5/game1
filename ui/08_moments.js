/* ===== 霓虹心事 · UI：朋友圈 App =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 朋友圈 =====
  function renderMoments(){
    const list = $('moments-list');
    list.innerHTML = '';
    if(engine.state.moments.length === 0){
      list.innerHTML = '<div class="moments-empty">还没有动态<br>点击右上角 📷 发一条</div>';
      return;
    }
    engine.state.moments.forEach(m=>{
      const inter = engine.state.momentInteractions[m.id] || {};
      const item = document.createElement('div');
      item.className = 'moment-item';
      item.dataset.momentId = m.id;
      const safeMomentId = escapeHtml(m.id);
      // 点赞列表
      const likeNames = m.likes.map(l=>{
        if(l === 'me') return '我';
        const c = STORY.characters[l];
        return c ? c.name : l;
      }).join('、');
      // 评论列表
      const commentsHtml = m.comments.map(c=>{
        const char = STORY.characters[c.from];
        const name = c.from === 'me' ? '我' : (char ? char.name : c.from);
        return `<div class="moment-comment ${c.from==='me'?'me':''} ${c.isReply?'reply':''}">
          <span class="mc-name">${escapeHtml(name)}</span>${escapeHtml(c.text)}
        </div>`;
      }).join('');
      // 评论选项
      let commentOptsHtml = '';
      if(m.commentOptions && !inter.commented){
        commentOptsHtml = `<div class="moment-comment-options" id="opts-${safeMomentId}" hidden>
          ${m.commentOptions.map((opt,i)=>`<button class="moment-comment-opt" data-moment-comment-opt="${safeMomentId}" data-opt-idx="${i}">${escapeHtml(opt.text)}</button>`).join('')}
        </div>`;
      }
      // v0.0.16: 男主朋友圈互动评论 + 回复选项
      const charCommentsHtml = (m.charComments || []).map(cc => {
        const char = STORY.characters[cc.charId];
        const charName = char ? char.name : cc.charId;
        const replyKey = `${m.id}_${cc.charId}`;
        const sentReply = engine.state.momentReplies?.[replyKey];
        const comment = cc.comment;
        let replyOptsHtml = '';
        if(comment.replyOptions && !sentReply){
          replyOptsHtml = '<div class="moment-reply-options">';
          comment.replyOptions.forEach((rp, ri) => {
            replyOptsHtml += `<button class="moment-reply-opt" data-moment-reply="${safeMomentId}|${escapeHtml(cc.charId)}|${cc.commentIdx}|${ri}">${escapeHtml(rp.text)}</button>`;
          });
          replyOptsHtml += '</div>';
        } else if(sentReply){
          const sent = comment.replyOptions?.[sentReply.replyIdx];
          replyOptsHtml = `<div class="moment-reply-options"><span class="moment-reply-opt sent">已回复：${escapeHtml(sent?.text || '')}</span></div>`;
        }
        return `<div class="moment-char-comment">
          <span class="moment-char-comment-name">${escapeHtml(charName)}：</span>
          <span class="moment-char-comment-text">${escapeHtml(comment.text)}</span>
          ${replyOptsHtml}
        </div>`;
      }).join('');
      const charCommentsBlock = charCommentsHtml ? `<div class="moment-char-comments">${charCommentsHtml}</div>` : '';
      item.innerHTML = `
        <div class="moment-top">
          <div class="moment-avatar" style="background:${escapeHtml(m.bg)}">${avatarImg(m)}</div>
          <div class="moment-body">
            <div class="moment-name">${escapeHtml(m.name)}</div>
            <div class="moment-text">${nl2brEscaped(m.text)}</div>
            ${m.art ? `<div class="moment-art">${getMomentArt(m.art)}</div>` : ''}
            <div class="moment-meta">
              <span>${escapeHtml(m.dateLabel)} ${escapeHtml(m.time)}</span>
              <div class="moment-actions">
                <button class="moment-act-btn ${inter.liked?'liked':''}" data-moment-like="${safeMomentId}" ${inter.liked?'disabled':''}>
                  ${inter.liked?'♥':'♡'} ${m.likes.length}
                </button>
                ${m.commentOptions && !inter.commented ? `<button class="moment-act-btn" data-moment-comment="${safeMomentId}">💬 评论</button>` : ''}
              </div>
            </div>
            ${likeNames ? `<div class="moment-likes">♥ ${escapeHtml(likeNames)}</div>` : ''}
            ${commentsHtml ? `<div class="moment-comments">${commentsHtml}</div>` : ''}
            ${charCommentsBlock}
            ${commentOptsHtml}
          </div>
        </div>
      `;
      list.appendChild(item);
    });
    updateMomentsBadge();
  }
  function getMomentArt(type){
    // 复用相册的 SVG art
    const arts = {
      city:`<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#0a0712"/>
        <rect x="10" y="60" width="20" height="90" fill="#1a1f3a"/>
        <rect x="35" y="40" width="25" height="110" fill="#2a1f4a"/>
        <rect x="65" y="25" width="30" height="125" fill="#1a2f4a"/>
        <rect x="100" y="50" width="22" height="100" fill="#2a1f3a"/>
        <rect x="125" y="30" width="28" height="120" fill="#1a1f4a"/>
        <rect x="158" y="55" width="18" height="95" fill="#2a2f4a"/>
        <g fill="#ff5fa8"><rect x="15" y="70" width="2" height="2"/><rect x="22" y="80" width="2" height="2"/></g>
        <g fill="#7a5cff"><rect x="40" y="50" width="2" height="2"/><rect x="48" y="65" width="2" height="2"/></g>
        <g fill="#39d6ff"><rect x="70" y="35" width="2" height="2"/><rect x="80" y="50" width="2" height="2"/></g>
      </svg>`,
      gallery:`<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#1a0a2e"/>
        <rect x="20" y="20" width="160" height="100" fill="#2a1f3a" rx="2"/>
        <rect x="30" y="30" width="60" height="80" fill="#0a0712"/>
        <rect x="100" y="30" width="70" height="50" fill="#1a1420"/>
        <rect x="100" y="85" width="70" height="25" fill="#15101f"/>
        <g fill="#ff5fa8"><rect x="35" y="35" width="3" height="3"/><rect x="45" y="50" width="3" height="3"/></g>
        <g fill="#7a5cff"><rect x="105" y="35" width="3" height="3"/><rect x="115" y="50" width="3" height="3"/></g>
      </svg>`
    };
    return arts[type] || '';
  }
  function updateMomentsBadge(){
    // 朋友圈新动态（未互动的）
    const uninteracted = engine.state.moments.filter(m=>{
      if(m.isMine) return false;
      const inter = engine.state.momentInteractions[m.id] || {};
      return !inter.liked && !inter.commented;
    }).length;
    const badge = $('badge-moments');
    if(uninteracted > 0){
      badge.textContent = uninteracted;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }
  function toggleCommentOptions(momentId){
    const opts = document.getElementById('opts-' + momentId);
    if(opts) opts.hidden = !opts.hidden;
  }
  // 发朋友圈
  function openPostMoment(){
    $('post-moment-text').value = '';
    selectedMomentArt = '';
    document.querySelectorAll('.pm-art-opt').forEach(b=>b.classList.remove('selected'));
    showScreen('postMoment');
  }
  function selectMomentArt(btn){
    document.querySelectorAll('.pm-art-opt').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMomentArt = btn.dataset.momentArt;
  }
  function publishMoment(){
    const text = $('post-moment-text').value.trim();
    if(!text){ toast('写点什么吧'); return; }
    const id = engine.createMyMoment(text, selectedMomentArt || null);
    // v0.0.16: 触发男主朋友圈互动评论
    const moment = engine.state.moments.find(m => m.id === id);
    if(moment) engine.generateMomentComments(moment);
    toast('已发表');
    renderMoments();
    showScreen('moments');
  }
  // 朋友圈事件
  engine.on('momentPosted', (moment)=>{
    if(moment.author !== 'me'){
      showNotif(moment.author, '发了新动态：' + moment.text.slice(0,20) + '…');
    }
    updateMomentsBadge();
  });
  engine.on('momentUpdate', ()=>{
    if(screens.moments.classList.contains('active')) renderMoments();
  });
