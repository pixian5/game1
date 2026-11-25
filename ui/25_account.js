/* ===== 霓虹心事 · 账号与云存档界面（设置 App 内嵌）=====
 * 设计原则：
 * 1) 账号是可选增强——服务不可用时游戏照常离线玩，只在设置里提示；
 * 2) 所有网络错误都落到「本地存档不受影响」的提示上，绝不阻断剧情；
 * 3) 云存档整包上传 4 个槽位，revision 冲突时给用户「云端覆盖本机 / 本机覆盖云端」两个明确选择；
 * 4) 文案全部走 t()，中英双语；敏感操作（恢复/注销）都要二次确认。
 */
(function(){
  'use strict';

  const rootMeta = document.querySelector('meta[name="neon-account-api"]');
  const API_PREFIX = rootMeta && rootMeta.content ? String(rootMeta.content).replace(/\/+$/, '') : '';
  const META_KEY = username => `neon_cloud_meta:${username}`;
  const AUTOSYNC_KEY = 'neon_account_autosync';

  const state = {
    root: null,
    ready: false,
    health: 'unknown',       // unknown | ok | down
    me: null,                // /api/auth/me 的 user
    session: null,
    cloud: null,             // 云端存档元信息 {revision, updatedAt, ...}
    localMeta: null,         // 本机记录的同步锚点 {revision, updatedAt, saveTime, syncedAt}
    sessions: [],
    view: 'login',           // login | register | recover | registered | account
    message: null,           // {type:'error'|'ok', text}
    recoveryCode: null,
    conflict: null,          // {serverRevision, serverUpdatedAt}
    confirmDownload: false,
    busy: false,
    autoSync: false,
    booted: 0,
    authRev: 0,             // 登录态变更计数：防止启动探测的迟到响应覆盖用户刚完成的登录/注册
    autoTimer: null,
    autoPaused: false
  };

  const ERR_TEXT = {
    invalid_username: '用户名需为 3-20 位字母、数字或下划线，且不能纯数字',
    invalid_nickname: '昵称最多 24 个字符',
    weak_password: '密码需 8-72 位，且同时包含字母和数字',
    username_taken: '这个用户名已被占用',
    invalid_credentials: '用户名或密码错误',
    locked_out: '失败次数过多，请 15 分钟后再试',
    rate_limited: '操作太频繁，请稍后再试',
    invalid_recovery: '用户名或找回码不正确',
    unauthenticated: '登录已过期，请重新登录',
    save_conflict: '云端存档已被其它设备更新',
    saves_too_large: '存档超过 1.5MB 上限，无法上传',
    invalid_saves: '存档格式异常，无法上传',
    save_corrupted: '云端存档损坏，请联系管理员',
    csrf_blocked: '请求被安全策略拦截，请刷新页面重试',
    json_required: '请求格式错误',
    internal_error: '服务器开小差了，请稍后再试',
    network: '账号服务连接失败，本地存档不受影响'
  };

  function apiBase(){
    if(location.protocol === 'file:') return null;
    return API_PREFIX;
  }

  function errText(code){
    return t(ERR_TEXT[code] || ERR_TEXT.network);
  }

  async function request(path, {method = 'GET', body = null, timeout = 15000} = {}){
    const base = apiBase();
    if(base == null) throw Object.assign(new Error('offline'), { code: 'network' });
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeout) : null;
    const headers = { 'Accept': 'application/json', 'X-Requested-With': 'neon-account' };
    if(body != null) headers['Content-Type'] = 'application/json';
    let res;
    try {
      res = await fetch(base + path, {
        method, headers, credentials: 'same-origin',
        body: body == null ? undefined : JSON.stringify(body),
        signal: ctrl ? ctrl.signal : undefined
      });
    } catch(e){
      throw Object.assign(new Error('network'), { code: 'network' });
    } finally {
      if(timer) clearTimeout(timer);
    }
    let data = null;
    try { data = await res.json(); } catch(_) {}
    if(!res.ok){
      const err = new Error((data && data.error && data.error.code) || `http_${res.status}`);
      err.code = (data && data.error && data.error.code) || `http_${res.status}`;
      err.status = res.status;
      err.data = data && data.error && data.error.data;
      throw err;
    }
    return data;
  }

  function fmtTime(iso){
    if(!iso) return '—';
    const d = new Date(iso);
    if(Number.isNaN(d.getTime())) return '—';
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function localSaveInfo(){
    try {
      const slots = engine.listSaveSlots ? engine.listSaveSlots() : [];
      const filled = slots.filter(s => !s.empty);
      const latest = filled.slice().sort((a, b) => String(b.time || '').localeCompare(String(a.time || '')))[0];
      return { count: filled.length, latestTime: latest ? latest.time : null };
    } catch(_){
      return { count: 0, latestTime: null };
    }
  }

  function loadLocalMeta(){
    const u = state.me && state.me.username;
    if(!u) return null;
    try {
      const raw = localStorage.getItem(META_KEY(u));
      return raw ? JSON.parse(raw) : null;
    } catch(_){ return null; }
  }

  function saveLocalMeta(meta){
    const u = state.me && state.me.username;
    if(!u) return;
    state.localMeta = meta;
    try { localStorage.setItem(META_KEY(u), JSON.stringify(meta)); } catch(_) {}
  }

  function autoSyncEnabled(){
    try { return localStorage.getItem(AUTOSYNC_KEY) === '1'; } catch(_){ return false; }
  }

  function setMessage(text, type = 'error'){
    state.message = text ? { type, text } : null;
    const box = state.root && state.root.querySelector('.acct-message');
    if(box){
      box.className = 'acct-message' + (text ? ` ${type}` : '');
      box.textContent = text || '';
      box.hidden = !text;
    }
    if(text && type === 'ok') toast(text);
  }

  function setBusy(busy){
    state.busy = busy;
    if(!state.root) return;
    state.root.querySelectorAll('button[data-acct-action], button[type="submit"]').forEach(btn => {
      btn.disabled = busy;
      if(busy && btn.tagName === 'BUTTON') btn.dataset.wasDisabled = '1';
    });
  }

  function userInitial(name){
    const s = String(name || '?').trim();
    return escapeHtml([...s][0] || '?');
  }

  function shortUa(ua){
    const s = String(ua || '');
    const browser = /Edg\//.test(s) ? 'Edge' : /Firefox\//.test(s) ? 'Firefox' : /Chrome\//.test(s) ? 'Chrome' : /Safari\//.test(s) ? 'Safari' : (s ? 'Browser' : '—');
    const os = /iPhone|iPad/.test(s) ? 'iOS' : /Android/.test(s) ? 'Android' : /Mac OS X/.test(s) ? 'macOS' : /Windows/.test(s) ? 'Windows' : /Linux/.test(s) ? 'Linux' : '';
    return os ? `${browser} · ${os}` : browser;
  }

  /* ---------- 渲染 ---------- */
  function render(){
    if(!state.root) return;
    const box = state.root;
    if(state.health === 'unknown'){
      box.innerHTML = `<div class="set-group acct-card"><div class="set-title">${t('账号与云存档')}</div>
        <div class="set-note">${t('正在连接账号服务…')}</div></div>`;
      return;
    }
    if(state.health === 'down'){
      box.innerHTML = `<div class="set-group acct-card">
        <div class="set-title">${t('账号与云存档')}</div>
        <div class="acct-note">${t('账号服务暂时不可用，本地存档不受影响；稍后会自动重试。')}</div>
        <div class="acct-actions"><button class="save-btn" data-acct-action="retry-health">${t('重新连接')}</button></div>
      </div>`;
      return;
    }
    // 注册成功先展示一次性找回码，即使此时已登录也要先让用户保存
    if((state.view === 'registered' && state.recoveryCode) || !state.me){
      box.innerHTML = renderGuest();
      return;
    }
    box.innerHTML = renderAccount();
  }

  function renderGuest(){
    if(state.view === 'registered' && state.recoveryCode){
      return `<div class="set-group acct-card">
        <div class="set-title">${t('账号与云存档')}</div>
        <div class="acct-note">${t('账号已创建。下面是你的找回码，只显示这一次，请抄写或截图保存。')}</div>
        <div class="acct-recovery-code" id="acct-recovery-code">${escapeHtml(state.recoveryCode)}</div>
        <div class="acct-actions">
          <button class="save-btn primary" data-acct-action="copy-recovery">${t('复制找回码')}</button>
          <button class="save-btn" data-acct-action="finish-register">${t('我已保存，进入账号')}</button>
        </div>
        <div class="acct-note">${t('忘记密码时，凭用户名 + 找回码即可重置；找回码也可在账号内重新生成。')}</div>
        <div class="acct-message" hidden></div>
      </div>`;
    }
    if(state.view === 'recover'){
      return `<div class="set-group acct-card">
        <div class="set-title">${t('账号与云存档')}</div>
        <form data-acct-form="recover" class="acct-form" autocomplete="off">
          <label>${t('用户名')}<input name="username" maxlength="20" required autocomplete="username"></label>
          <label>${t('找回码')}<input name="recoveryCode" maxlength="20" placeholder="XXXX-XXXX-XXXX" required></label>
          <label>${t('新密码')}<input name="newPassword" type="password" minlength="8" maxlength="72" required autocomplete="new-password"></label>
          <label>${t('确认新密码')}<input name="confirm" type="password" minlength="8" maxlength="72" required autocomplete="new-password"></label>
          <button class="save-btn primary" type="submit">${t('用找回码重置密码')}</button>
          <button class="acct-link" type="button" data-acct-action="back-login">${t('返回登录')}</button>
        </form>
        <div class="acct-note">${t('重置成功后所有设备会被退出，需要重新登录。')}</div>
        <div class="acct-message" hidden></div>
      </div>`;
    }
    const isRegister = state.view === 'register';
    return `<div class="set-group acct-card">
      <div class="set-title">${t('账号与云存档')}</div>
      <div class="acct-note">${t('登录后可在不同设备同步 4 个存档槽；不登录也能正常游玩，进度只保存在本机。')}</div>
      <div class="acct-tabs">
        <button type="button" class="acct-tab ${isRegister ? '' : 'active'}" data-acct-action="tab-login">${t('登录')}</button>
        <button type="button" class="acct-tab ${isRegister ? 'active' : ''}" data-acct-action="tab-register">${t('注册')}</button>
      </div>
      ${isRegister ? `
      <form data-acct-form="register" class="acct-form" autocomplete="off">
        <label>${t('用户名')}<input name="username" maxlength="20" required autocomplete="username" placeholder="${t('3-20 位字母、数字或下划线')}"></label>
        <label>${t('昵称（可选）')}<input name="nickname" maxlength="24" autocomplete="nickname"></label>
        <label>${t('密码')}<input name="password" type="password" minlength="8" maxlength="72" required autocomplete="new-password" placeholder="${t('至少 8 位，含字母和数字')}"></label>
        <label>${t('确认密码')}<input name="confirm" type="password" minlength="8" maxlength="72" required autocomplete="new-password"></label>
        <button class="save-btn primary" type="submit">${t('创建账号')}</button>
      </form>` : `
      <form data-acct-form="login" class="acct-form" autocomplete="off">
        <label>${t('用户名')}<input name="username" maxlength="20" required autocomplete="username"></label>
        <label>${t('密码')}<input name="password" type="password" maxlength="72" required autocomplete="current-password"></label>
        <button class="save-btn primary" type="submit">${t('登录')}</button>
      </form>`}
      <button class="acct-link" type="button" data-acct-action="tab-recover">${t('忘记密码？用找回码重置')}</button>
      <div class="acct-message" hidden></div>
    </div>`;
  }

  function renderAccount(){
    const u = state.me;
    const local = localSaveInfo();
    const localMeta = state.localMeta;
    const cloudRev = state.cloud && state.cloud.revision ? state.cloud.revision : 0;
    const cloudTime = state.cloud && state.cloud.updatedAt ? fmtTime(state.cloud.updatedAt) : t('尚无云端存档');
    const lastSync = localMeta && localMeta.syncedAt ? fmtTime(localMeta.syncedAt) : t('尚未同步');
    const conflict = state.conflict;
    const confirmDownload = state.confirmDownload;
    const canSync = apiBase() != null;
    return `<div class="set-group acct-card">
      <div class="acct-head">
        <div class="acct-avatar">${userInitial(u.nickname || u.username)}</div>
        <div class="acct-id">
          <div class="acct-name">${escapeHtml(u.nickname || u.username)}</div>
          <div class="acct-sub">@${escapeHtml(u.username)} · <span>${t('注册于')}</span> ${escapeHtml(fmtTime(u.createdAt))}</div>
        </div>
        <span class="acct-pill">${t('已登录')}</span>
      </div>

      <div class="acct-block">
        <div class="acct-block-title">${t('云存档')}</div>
        <div class="acct-kv"><span>${t('云端版本')}</span><b>${cloudRev ? `rev ${cloudRev}` : '—'}</b></div>
        <div class="acct-kv"><span>${t('云端更新时间')}</span><b>${escapeHtml(cloudTime)}</b></div>
        <div class="acct-kv"><span>${t('本机存档')}</span><b>${local.count ? `${local.count} / 4 · ${escapeHtml(fmtTime(local.latestTime))}` : t('还没有存档')}</b></div>
        <div class="acct-kv"><span>${t('上次同步')}</span><b>${escapeHtml(lastSync)}</b></div>

        ${conflict ? `<div class="acct-conflict">
          <div>${t('云端存档已被其它设备更新（rev {rev} · {time}）。请选择保留哪一份：') .replace('{rev}', String(conflict.serverRevision || '?')) .replace('{time}', escapeHtml(fmtTime(conflict.serverUpdatedAt)))}</div>
          <div class="acct-actions">
            <button class="save-btn danger" data-acct-action="download" ${state.busy ? 'disabled' : ''}>${t('用云端覆盖本机')}</button>
            <button class="save-btn" data-acct-action="upload-force" ${state.busy ? 'disabled' : ''}>${t('用本机覆盖云端')}</button>
            <button class="save-btn" data-acct-action="dismiss-conflict">${t('暂不处理')}</button>
          </div>
        </div>` : ''}

        ${confirmDownload ? `<div class="acct-confirm">
          <div>${t('云端存档将覆盖本机全部 4 个存档槽；当前未保存的进度会丢失。确定继续？')}</div>
          <div class="acct-actions">
            <button class="save-btn danger" data-acct-action="download-confirm" ${state.busy ? 'disabled' : ''}>${t('确认覆盖')}</button>
            <button class="save-btn" data-acct-action="download-cancel">${t('取消')}</button>
          </div>
        </div>` : ''}

        <div class="acct-actions">
          <button class="save-btn primary" data-acct-action="upload" ${state.busy || !canSync ? 'disabled' : ''}>${t('上传到云端')}</button>
          <button class="save-btn" data-acct-action="download" ${state.busy || !canSync ? 'disabled' : ''}>${t('从云端恢复')}</button>
          <button class="save-btn" data-acct-action="refresh-cloud" ${state.busy ? 'disabled' : ''}>${t('刷新云端状态')}</button>
        </div>
        <label class="acct-check"><input type="checkbox" data-acct-auto ${state.autoSync ? 'checked' : ''} ${!canSync ? 'disabled' : ''}> ${t('自动同步（存档变化后上传）')}</label>
        <div class="acct-note">${t('云存档按整包同步（自动 / 3 个手动槽）；同一账号最多保留 10 台登录设备。')}</div>
      </div>

      <div class="acct-block">
        <div class="acct-block-title">${t('昵称')}</div>
        <form data-acct-form="nickname" class="acct-form acct-inline">
          <input name="nickname" maxlength="24" value="${escapeHtml(u.nickname || '')}" aria-label="${t('昵称')}">
          <button class="save-btn" type="submit">${t('保存昵称')}</button>
        </form>
      </div>

      <div class="acct-block">
        <div class="acct-block-title">${t('密码与找回码')}</div>
        <form data-acct-form="password" class="acct-form">
          <label>${t('当前密码')}<input name="currentPassword" type="password" required autocomplete="current-password"></label>
          <label>${t('新密码')}<input name="newPassword" type="password" minlength="8" maxlength="72" required autocomplete="new-password"></label>
          <label>${t('确认新密码')}<input name="confirm" type="password" minlength="8" maxlength="72" required autocomplete="new-password"></label>
          <button class="save-btn" type="submit">${t('修改密码（其它设备将退出）')}</button>
        </form>
        <form data-acct-form="recovery" class="acct-form">
          <label>${t('输入密码以重新生成找回码')}<input name="password" type="password" required autocomplete="current-password"></label>
          <button class="save-btn" type="submit">${t('重新生成找回码')}</button>
        </form>
        ${state.recoveryCode ? `<div class="acct-recovery-code">${escapeHtml(state.recoveryCode)}</div>
          <div class="acct-note">${t('新找回码只显示这一次，请立即保存。')}</div>` : ''}
      </div>

      <div class="acct-block">
        <div class="acct-block-title">${t('登录设备')}</div>
        <div class="acct-sessions">
          ${state.sessions.length ? state.sessions.map(s => `<div class="acct-session">
            <div class="acct-session-main"><b>${escapeHtml(shortUa(s.userAgent))}</b>${s.current ? ` <span class="acct-pill small">${t('当前设备')}</span>` : ''}</div>
            <div class="acct-session-sub"><span>${t('最近活动')}</span> ${escapeHtml(fmtTime(s.lastSeenAt))} · <span>${t('登录于')}</span> ${escapeHtml(fmtTime(s.createdAt))}</div>
            ${s.current ? '' : `<button class="save-btn danger" data-acct-action="revoke-session" data-id="${escapeHtml(s.id)}">${t('退出该设备')}</button>`}
          </div>`).join('') : `<div class="acct-note">${t('暂无设备信息')}</div>`}
        </div>
        <div class="acct-actions">
          <button class="save-btn" data-acct-action="export-data">${t('导出我的账号数据')}</button>
          <button class="save-btn" data-acct-action="logout">${t('退出登录')}</button>
        </div>
      </div>

      <div class="acct-block acct-danger">
        <div class="acct-block-title">${t('注销账号')}</div>
        <div class="acct-note">${t('注销会永久删除账号、云存档和登录设备，无法恢复。本机存档不会被删除。')}</div>
        <form data-acct-form="delete" class="acct-form">
          <label class="acct-check"><input type="checkbox" name="ack" required> ${t('我确认删除账号与全部云端数据')}</label>
          <label>${t('输入密码确认')}<input name="password" type="password" required autocomplete="current-password"></label>
          <button class="save-btn danger" type="submit">${t('永久注销账号')}</button>
        </form>
      </div>

      <div class="acct-message" hidden></div>
    </div>`;
  }

  /* ---------- 启动与数据 ---------- */
  async function boot(){
    const bootId = ++state.booted;
    const authRev = state.authRev;
    state.health = 'unknown';
    render();
    try {
      await request('/api/health', { timeout: 6000 });
      state.health = 'ok';
    } catch(_){
      state.health = 'down';
      state.ready = true;
      render();
      return;
    }
    try {
      const data = await request('/api/auth/me');
      if(bootId !== state.booted) return;
      // 用户在这期间已手动登录/注册：以用户操作为准，丢弃启动探测结果
      if(state.authRev !== authRev){ state.ready = true; render(); return; }
      if(!data.user){
        state.me = null;
        state.view = 'login';
      } else {
        state.me = data.user;
        state.session = data.session;
        state.cloud = data.save || null;
        state.localMeta = loadLocalMeta();
        state.autoSync = autoSyncEnabled();
        state.view = 'account';
        await refreshSessions();
      }
    } catch(e){
      if(bootId !== state.booted) return;
      if(state.authRev !== authRev){ state.ready = true; render(); return; }
      if(e.code === 'unauthenticated' || e.code === 'http_401'){
        state.me = null;
        state.view = 'login';
      } else if(e.code === 'network'){
        state.health = 'down';
      }
    }
    state.ready = true;
    render();
  }

  async function refreshSessions(){
    if(!state.me) return;
    try {
      const data = await request('/api/account/sessions');
      state.sessions = data.sessions || [];
    } catch(_){ state.sessions = []; }
  }

  function mount(body){
    const box = document.createElement('div');
    box.id = 'account-root';
    box.className = 'acct-root';
    body.appendChild(box);
    state.root = box;
    if(state.ready){ render(); }
    else { boot(); }
  }

  /* ---------- 登录/注册/找回 ---------- */
  async function doLogin(form){
    state.authRev += 1;
    const fd = new FormData(form);
    const username = String(fd.get('username') || '').trim();
    const password = String(fd.get('password') || '');
    if(!username || !password) return setMessage(t('请填写用户名和密码'));
    setBusy(true); setMessage('');
    try {
      const data = await request('/api/auth/login', { method: 'POST', body: { username, password } });
      state.me = data.user;
      state.session = data.session;
      state.cloud = data.save || null;
      state.localMeta = loadLocalMeta();
      state.autoSync = autoSyncEnabled();
      state.view = 'account';
      state.conflict = null;
      await refreshSessions();
      render();
      setMessage(t('登录成功'), 'ok');
    } catch(e){
      setMessage(errText(e.code));
    } finally { setBusy(false); }
  }

  async function doRegister(form){
    state.authRev += 1;
    const fd = new FormData(form);
    const username = String(fd.get('username') || '').trim();
    const password = String(fd.get('password') || '');
    const confirm = String(fd.get('confirm') || '');
    const nickname = String(fd.get('nickname') || '').trim();
    if(password !== confirm) return setMessage(t('两次输入的密码不一致'));
    setBusy(true); setMessage('');
    try {
      const data = await request('/api/auth/register', { method: 'POST', body: { username, password, nickname } });
      state.me = data.user;
      state.session = data.session;
      state.cloud = data.save || null;
      state.recoveryCode = data.recoveryCode;
      state.view = 'registered';
      state.localMeta = null;
      await refreshSessions();
      render();
    } catch(e){
      setMessage(errText(e.code));
    } finally { setBusy(false); }
  }

  async function doRecover(form){
    state.authRev += 1;
    const fd = new FormData(form);
    const username = String(fd.get('username') || '').trim();
    const recoveryCode = String(fd.get('recoveryCode') || '').trim();
    const newPassword = String(fd.get('newPassword') || '');
    const confirm = String(fd.get('confirm') || '');
    if(newPassword !== confirm) return setMessage(t('两次输入的密码不一致'));
    setBusy(true); setMessage('');
    try {
      await request('/api/auth/recover', { method: 'POST', body: { username, recoveryCode, newPassword } });
      state.view = 'login';
      state.me = null;
      render();
      setMessage(t('密码已重置，请用新密码登录'), 'ok');
    } catch(e){
      setMessage(errText(e.code));
    } finally { setBusy(false); }
  }

  /* ---------- 云存档 ---------- */
  async function doUpload(force = false){
    if(!state.me) return;
    const saves = engine.getAllSaves ? engine.getAllSaves() : {};
    const filled = Object.keys(saves).filter(k => saves[k] && saves[k].state);
    if(!filled.length) return setMessage(t('本机还没有存档，先玩一会儿再上传'));
    const local = localSaveInfo();
    setBusy(true); setMessage('');
    try {
      const baseRevision = state.localMeta ? Number(state.localMeta.revision || 0) : 0;
      const data = await request('/api/saves', {
        method: 'PUT',
        body: {
          saves, baseRevision, force: !!force,
          clientUpdatedAt: local.latestTime,
          device: shortUa(navigator.userAgent)
        },
        timeout: 25000
      });
      state.conflict = null;
      state.cloud = data.save;
      saveLocalMeta({ revision: data.save.revision, updatedAt: data.save.updatedAt, saveTime: local.latestTime, syncedAt: new Date().toISOString() });
      render();
      setMessage(t('已上传到云端'), 'ok');
    } catch(e){
      if(e.code === 'save_conflict'){
        state.conflict = e.data || { serverRevision: '?', serverUpdatedAt: null };
        state.autoPaused = true;
        render();
        setMessage(t('检测到云端更新，请选择保留哪一份'));
      } else {
        setMessage(errText(e.code));
      }
    } finally { setBusy(false); }
  }

  async function fetchCloud(){
    setBusy(true); setMessage('');
    try {
      const data = await request('/api/saves');
      state.cloud = data.save || null;
      return data;
    } catch(e){
      setMessage(errText(e.code));
      return null;
    } finally { setBusy(false); }
  }

  async function doDownload(){
    const data = await fetchCloud();
    if(!data) return;
    if(!data.saves) return setMessage(t('云端还没有存档'));
    setBusy(true); setMessage('');
    try {
      const result = engine.applyCloudSaves ? engine.applyCloudSaves(data.saves) : { ok: false, reason: 'not supported' };
      if(!result.ok) return setMessage(t('恢复失败：') + (result.reason || ''));
      if(data.saves.auto && engine.load) engine.load('auto');
      if(typeof afterLoadRefresh === 'function') afterLoadRefresh();
      if(typeof renderSaves === 'function') renderSaves();
      state.confirmDownload = false;
      state.cloud = data.save || state.cloud;
      state.conflict = null;
      saveLocalMeta({ revision: data.save ? data.save.revision : 0, updatedAt: data.save ? data.save.updatedAt : null, saveTime: localSaveInfo().latestTime, syncedAt: new Date().toISOString() });
      render();
      setMessage(t('已用云端存档覆盖本机'), 'ok');
    } finally { setBusy(false); }
  }

  function scheduleAutoUpload(){
    if(!state.me || !state.autoSync || state.autoPaused) return;
    clearTimeout(state.autoTimer);
    state.autoTimer = setTimeout(() => {
      if(!state.me || !state.autoSync || state.autoPaused) return;
      const local = localSaveInfo();
      const lastUploaded = state.localMeta && state.localMeta.saveTime;
      if(!local.latestTime || local.latestTime === lastUploaded) return;
      doUpload(false);
    }, 6000);
  }

  /* ---------- 账号操作 ---------- */
  async function doProfile(form){
    const fd = new FormData(form);
    setBusy(true); setMessage('');
    try {
      const data = await request('/api/account/profile', { method: 'PATCH', body: { nickname: String(fd.get('nickname') || '') } });
      state.me = data.user;
      render();
      setMessage(t('昵称已更新'), 'ok');
    } catch(e){ setMessage(errText(e.code)); }
    finally { setBusy(false); }
  }

  async function doPassword(form){
    const fd = new FormData(form);
    const currentPassword = String(fd.get('currentPassword') || '');
    const newPassword = String(fd.get('newPassword') || '');
    const confirm = String(fd.get('confirm') || '');
    if(newPassword !== confirm) return setMessage(t('两次输入的密码不一致'));
    setBusy(true); setMessage('');
    try {
      await request('/api/account/password', { method: 'POST', body: { currentPassword, newPassword } });
      form.reset();
      await refreshSessions();
      render();
      setMessage(t('密码已修改，其它设备已退出'), 'ok');
    } catch(e){ setMessage(errText(e.code)); }
    finally { setBusy(false); }
  }

  async function doRotateRecovery(form){
    const fd = new FormData(form);
    setBusy(true); setMessage('');
    try {
      const data = await request('/api/account/recovery-code', { method: 'POST', body: { password: String(fd.get('password') || '') } });
      state.recoveryCode = data.recoveryCode;
      render();
      setMessage(t('新找回码已生成，请立即保存'), 'ok');
    } catch(e){ setMessage(errText(e.code)); }
    finally { setBusy(false); }
  }

  async function doLogout(){
    state.authRev += 1;
    setBusy(true);
    try { await request('/api/auth/logout', { method: 'POST', body: {} }); } catch(_) {}
    state.me = null; state.session = null; state.sessions = []; state.cloud = null;
    state.localMeta = null; state.recoveryCode = null; state.view = 'login'; state.conflict = null;
    state.busy = false;
    render();
    setMessage(t('已退出登录'), 'ok');
  }

  async function doDelete(form){
    state.authRev += 1;
    const fd = new FormData(form);
    setBusy(true); setMessage('');
    try {
      await request('/api/account', {
        method: 'DELETE',
        body: { password: String(fd.get('password') || '') }
      });
      const username = state.me ? state.me.username : null;
      if(username){ try { localStorage.removeItem(META_KEY(username)); } catch(_) {} }
      state.me = null; state.session = null; state.sessions = []; state.cloud = null;
      state.localMeta = null; state.view = 'login'; state.conflict = null;
      render();
      setMessage(t('账号已注销，本机存档仍保留'), 'ok');
    } catch(e){ setMessage(errText(e.code)); }
    finally { setBusy(false); }
  }

  async function doExport(){
    setBusy(true); setMessage('');
    try {
      const data = await request('/api/account/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neon-heart-account-${(state.me && state.me.username) || 'export'}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setMessage(t('账号数据已导出'), 'ok');
    } catch(e){ setMessage(errText(e.code)); }
    finally { setBusy(false); }
  }

  async function revokeSession(id){
    setBusy(true); setMessage('');
    try {
      await request(`/api/account/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' });
      await refreshSessions();
      render();
      setMessage(t('该设备已退出登录'), 'ok');
    } catch(e){ setMessage(errText(e.code)); }
    finally { setBusy(false); }
  }

  function copyRecovery(){
    const code = state.recoveryCode || '';
    if(!code) return;
    const done = () => setMessage(t('找回码已复制'), 'ok');
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(code).then(done).catch(() => fallbackCopy(code, done));
    } else fallbackCopy(code, done);
  }
  function fallbackCopy(text, done){
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove(); done();
    } catch(_){ setMessage(t('复制失败，请手动抄写')); }
  }

  /* ---------- 事件委托 ---------- */
  function bind(){
    document.addEventListener('submit', e => {
      const form = e.target.closest && e.target.closest('form[data-acct-form]');
      if(!form || !state.root || !state.root.contains(form)) return;
      e.preventDefault();
      const type = form.dataset.acctForm;
      if(type === 'login') doLogin(form);
      else if(type === 'register') doRegister(form);
      else if(type === 'recover') doRecover(form);
      else if(type === 'nickname') doProfile(form);
      else if(type === 'password') doPassword(form);
      else if(type === 'recovery') doRotateRecovery(form);
      else if(type === 'delete') doDelete(form);
    });

    document.addEventListener('click', e => {
      if(!state.root) return;
      const btn = e.target.closest && e.target.closest('[data-acct-action]');
      if(!btn || !state.root.contains(btn)) return;
      const action = btn.dataset.acctAction;
      if(action === 'tab-login'){ state.view = 'login'; state.message = null; render(); }
      else if(action === 'tab-register'){ state.view = 'register'; state.message = null; render(); }
      else if(action === 'tab-recover'){ state.view = 'recover'; state.message = null; render(); }
      else if(action === 'back-login'){ state.view = 'login'; state.message = null; render(); }
      else if(action === 'finish-register'){ state.view = 'account'; state.recoveryCode = null; render(); }
      else if(action === 'copy-recovery') copyRecovery();
      else if(action === 'upload') doUpload(false);
      else if(action === 'upload-force') doUpload(true);
      else if(action === 'download'){ state.confirmDownload = true; render(); }
      else if(action === 'download-confirm') doDownload();
      else if(action === 'download-cancel'){ state.confirmDownload = false; render(); }
      else if(action === 'dismiss-conflict'){ state.conflict = null; render(); }
      else if(action === 'refresh-cloud') doRefreshCloud();
      else if(action === 'logout') doLogout();
      else if(action === 'export-data') doExport();
      else if(action === 'revoke-session') revokeSession(btn.dataset.id);
      else if(action === 'retry-health'){ state.ready = false; boot(); }
    });

    document.addEventListener('change', e => {
      const box = e.target.closest && e.target.closest('[data-acct-auto]');
      if(!box || !state.root || !state.root.contains(box)) return;
      state.autoSync = !!box.checked;
      try { localStorage.setItem(AUTOSYNC_KEY, state.autoSync ? '1' : '0'); } catch(_) {}
      if(state.autoSync){ state.autoPaused = false; scheduleAutoUpload(); }
    });

    // 手动存档后 6 秒自动上传；自动存档没有 gameSaved 事件，由 30 秒轮询兜底
    if(typeof engine !== 'undefined' && engine.on){
      engine.on('gameSaved', () => scheduleAutoUpload());
      setInterval(() => {
        if(document.visibilityState === 'hidden') return;
        if(state.me && state.autoSync && !state.autoPaused) scheduleAutoUpload();
      }, 30000);
    }
  }

  async function doRefreshCloud(){
    const data = await fetchCloud();
    if(!data) return;
    if(state.localMeta && data.save && data.save.revision > state.localMeta.revision){
      state.conflict = { serverRevision: data.save.revision, serverUpdatedAt: data.save.updatedAt };
    }
    render();
    setMessage(t('云端状态已刷新'), 'ok');
  }

  // 语言切换后重渲染文案（renderSettings 会整体重建，mount 会被再次调用）
  window.addEventListener('i18nchange', () => {
    if(state.root && state.root.isConnected) render();
  });

  window.AccountUI = { mount, state };
  bind();
})();
