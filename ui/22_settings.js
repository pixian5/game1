/* ===== 霓虹心事 · UI：设置 App（v0.4.8 阶段 E1）=====
 * 语言（zh-CN/en-US）/ 音量三分级（master/music/sfx）/ 减弱动效 / 选项提示 / 观赏模式。
 * 持久化：neon_vol（audio.js）、neon_reduce_motion（本文件）、neon_lang（i18n 侧）。
 */
  // ===== 设置 App =====
  function renderSettings(){
    const body = $('settings-body');
    if(!body) return;
    const lang = (typeof I18N !== 'undefined' && I18N.getLang) ? I18N.getLang() : 'zh-CN';
    const vols = AudioSys.getVolumes();
    const reduce = localStorage.getItem('neon_reduce_motion') === '1';
    const hints = engine.state.showOptionHints !== false;
    const watch = !!engine.state.watchMode?.enabled;
    body.innerHTML = `
      <div class="set-group">
        <div class="set-title">语言 Language</div>
        <div class="set-row">
          <label><input type="radio" name="set-lang" value="zh-CN" ${lang==='zh-CN'?'checked':''}> 中文</label>
          <label><input type="radio" name="set-lang" value="en-US" ${lang==='en-US'?'checked':''}> English</label>
        </div>
        <div class="set-note">剧情文本将随语言逐步补全，未翻译处回退中文。</div>
      </div>
      <div class="set-group">
        <div class="set-title">声音</div>
        <div class="set-row set-slider"><span>总音量</span><input type="range" min="0" max="100" value="${Math.round(vols.master*100)}" data-vol="master"></div>
        <div class="set-row set-slider"><span>音乐</span><input type="range" min="0" max="100" value="${Math.round(vols.music*100)}" data-vol="music"></div>
        <div class="set-row set-slider"><span>音效</span><input type="range" min="0" max="100" value="${Math.round(vols.sfx*100)}" data-vol="sfx"></div>
        <div class="set-row">
          <label><input type="checkbox" id="set-sound" ${AudioSys.isEnabled()?'checked':''}> 提示音效</label>
          <label><input type="checkbox" id="set-bgm" ${AudioSys.isBgmEnabled()?'checked':''}> 环境音乐</label>
        </div>
      </div>
      <div class="set-group">
        <div class="set-title">画面与辅助</div>
        <div class="set-row">
          <label><input type="checkbox" id="set-reduce" ${reduce?'checked':''}> 减弱动效</label>
        </div>
        <div class="set-row">
          <label><input type="checkbox" id="set-hints" ${hints?'checked':''}> 选项提示</label>
          <label><input type="checkbox" id="set-watch" ${watch?'checked':''}> 观赏模式</label>
        </div>
      </div>
      <div class="set-note">设置即时生效并自动保存。</div>
    `;
    bindSettings();
  }

  function bindSettings(){
    const body = $('settings-body');
    // 语言
    body.querySelectorAll('input[name="set-lang"]').forEach(r => {
      r.addEventListener('change', () => {
        if(typeof I18N !== 'undefined' && I18N.setLang){
          I18N.setLang(r.value);
          try { localStorage.setItem('neon_lang', r.value); } catch(_) {}
          renderSettings();
        }
      });
    });
    // 音量滑杆
    body.querySelectorAll('input[data-vol]').forEach(sl => {
      sl.addEventListener('input', () => AudioSys.setVolume(sl.dataset.vol, sl.value / 100));
    });
    // 声音开关
    const snd = $('set-sound'), bgm = $('set-bgm');
    if(snd) snd.addEventListener('change', () => { AudioSys.setSound(snd.checked); });
    if(bgm) bgm.addEventListener('change', () => { AudioSys.setBgm(bgm.checked); });
    // 减弱动效
    const red = $('set-reduce');
    if(red) red.addEventListener('change', () => {
      document.body.classList.toggle('reduce-motion', red.checked);
      try { localStorage.setItem('neon_reduce_motion', red.checked ? '1' : '0'); } catch(_) {}
    });
    // 选项提示 / 观赏模式（复用引擎既有开关）
    const hints = $('set-hints');
    if(hints) hints.addEventListener('change', () => { engine.setShowOptionHints(hints.checked); });
    const watch = $('set-watch');
    if(watch) watch.addEventListener('change', () => { engine.setWatchMode(watch.checked); renderSettings(); });
  }

  // 启动时应用持久化的减弱动效与语言
  (function applyPersistedSettings(){
    try {
      if(localStorage.getItem('neon_reduce_motion') === '1') document.body.classList.add('reduce-motion');
      const lang = localStorage.getItem('neon_lang');
      if(lang && typeof I18N !== 'undefined' && I18N.setLang) I18N.setLang(lang);
    } catch(_) {}
  })();

  // v0.5.4（E4）：语言切换后重渲染当前可见文本（已渲染 DOM 不会自动重译）
  window.addEventListener('i18nchange', () => {
    try {
      if(screens.chat && screens.chat.classList.contains('active') && typeof currentConvId === 'string'){
        renderChatBody(currentConvId);
        const conv = engine.state.conversations[currentConvId];
        $('chat-status').textContent = conv && conv.typing ? t('正在输入…') : t('在线');
      }
      if(screens.messages && screens.messages.classList.contains('active')) renderConvList();
      if(screens.settings && screens.settings.classList.contains('active')) renderSettings();
    } catch(_) {}
  });
