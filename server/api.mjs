/* ===== 霓虹心事 · 账号 API =====
 * 路由一览（全部同源 /api，Cookie 会话）：
 *   GET  /api/health                     服务/数据库健康检查
 *   POST /api/auth/register              注册（返回一次性找回码）
 *   POST /api/auth/login                 登录
 *   POST /api/auth/logout                退出当前设备
 *   POST /api/auth/recover               用户名+找回码重置密码
 *   GET  /api/auth/me                    当前用户 + 云存档元信息
 *   PATCH /api/account/profile           改昵称
 *   POST /api/account/password           改密码（踢掉其它设备）
 *   POST /api/account/recovery-code      重新生成找回码
 *   GET  /api/account/sessions           登录设备列表
 *   DELETE /api/account/sessions/:id     踢掉指定设备
 *   GET  /api/account/export             导出账号数据（JSON）
 *   DELETE /api/account                  注销账号（需密码）
 *   GET  /api/saves                      读取云存档
 *   PUT  /api/saves                      上传云存档（revision 冲突检测 / force 覆盖）
 * 说明：错误统一返回 {error:{code,message}}，前端按 code 本地化，不直接展示服务端中文。
 */
import { RateLimiter, LoginGuard, serializeCookie, parseCookies, scryptHash, scryptVerify,
  sha256, randomToken, makeRecoveryCode, normalizeRecoveryCode, validateUsername, validateNickname,
  validatePassword } from './auth.mjs';
import { COOKIE_NAME, SESSION_TTL_MS, MAX_SAVE_BYTES, MAX_JSON_BYTES, SECURE_COOKIE } from './config.mjs';
import { nowIso, uuid } from './db.mjs';

const SAVE_SLOTS = ['auto', 'slot1', 'slot2', 'slot3'];
const authLimiter = new RateLimiter();
const loginGuard = new LoginGuard();

class ApiError extends Error {
  constructor(status, code, message, data = null){
    super(message || code);
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

function json(res, status, body, extraHeaders = {}){
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(payload),
    ...extraHeaders
  });
  res.end(payload);
}

function clientIp(req){
  const xff = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return xff || req.socket?.remoteAddress || '';
}

function isHttps(req){
  if(SECURE_COOKIE) return true;
  // 容器网关可能把外部 https 终结后再以 http 回源，这里把三种转发头都认一遍
  for(const h of ['x-forwarded-proto', 'x-forwarded-scheme', 'x-scheme']){
    const v = String(req.headers[h] || '').split(',')[0].trim().toLowerCase();
    if(v === 'https') return true;
  }
  return false;
}

function publicUser(row){
  if(!row) return null;
  return {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at || null
  };
}

function saveMeta(row){
  if(!row) return { revision: 0, updatedAt: null, clientUpdatedAt: null, bytes: 0, device: null };
  return {
    revision: Number(row.revision || 0),
    updatedAt: row.updated_at,
    clientUpdatedAt: row.client_updated_at || null,
    bytes: Number(row.bytes || 0),
    device: row.device || null
  };
}

function readBody(req){
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if(size > MAX_JSON_BYTES){
        reject(new ApiError(413, 'payload_too_large', '请求体过大'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if(!chunks.length) return resolve({});
      const text = Buffer.concat(chunks).toString('utf8');
      try { resolve(JSON.parse(text)); }
      catch(_){ reject(new ApiError(400, 'invalid_json', 'JSON 格式错误')); }
    });
    req.on('error', reject);
  });
}

function checkCsrf(req){
  const method = req.method;
  if(method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return;
  const origin = req.headers.origin;
  if(origin){
    try {
      const host = new URL(origin).host;
      // 直连时 Host 就是原始 host；经 nginx/网关时原始 host 在 X-Forwarded-Host
      const allowedHosts = [req.headers.host, req.headers['x-forwarded-host']]
        .flatMap(v => String(v || '').split(','))
        .map(v => v.trim())
        .filter(Boolean);
      if(!allowedHosts.includes(host)) throw new ApiError(403, 'csrf_blocked', '跨站请求被拒绝');
    } catch(e){
      if(e instanceof ApiError) throw e;
      throw new ApiError(403, 'csrf_blocked', '跨站请求被拒绝');
    }
  }
  // 自定义头无法由普通表单跨站伪造，作为第二道闸
  if(String(req.headers['x-requested-with'] || '') !== 'neon-account'){
    throw new ApiError(403, 'csrf_blocked', '缺少请求标识');
  }
}

function requireJson(req){
  if(!String(req.headers['content-type'] || '').toLowerCase().includes('application/json')){
    throw new ApiError(415, 'json_required', '需要 application/json');
  }
}

function authFrom(req, store){
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if(!token) return null;
  const hash = sha256(token);
  const session = store.sessionByToken(hash);
  if(!session) return null;
  if(Date.parse(session.expires_at) <= Date.now()){
    store.deleteSession(session.id);
    return null;
  }
  const user = store.userById(session.user_id);
  if(!user) { store.deleteSession(session.id); return null; }
  // 每 10 分钟更新一次 last_seen，避免每个请求都写库
  if(Date.now() - Date.parse(session.last_seen_at) > 10 * 60_000){
    store.touchSession(session.id);
  }
  return { user, session, token };
}

function requireAuth(req, store){
  const ctx = authFrom(req, store);
  if(!ctx) throw new ApiError(401, 'unauthenticated', '未登录');
  return ctx;
}

function startSession(req, store, userId){
  const token = randomToken();
  const id = uuid();
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  // 单账号最多 10 台设备，超出踢最旧的，避免会话无限膨胀
  const count = store.countSessions(userId);
  if(count >= 10){
    for(const sid of store.oldestSessions(userId, count - 9)) store.deleteSession(sid);
  }
  store.insertSession({
    id, userId, tokenHash: sha256(token), createdAt, expiresAt,
    ua: String(req.headers['user-agent'] || '').slice(0, 180),
    ip: clientIp(req).slice(0, 64)
  });
  return { id, token, createdAt, expiresAt };
}

function sessionCookie(req, token, maxAge = SESSION_TTL_MS){
  return serializeCookie(COOKIE_NAME, token, { maxAge, secure: isHttps(req) });
}

function clearCookie(req){
  return serializeCookie(COOKIE_NAME, '', { maxAge: 0, secure: isHttps(req) });
}

function assertSavePayload(payload){
  if(!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new ApiError(400, 'invalid_saves', '存档格式错误');
  const saves = payload.saves;
  if(!saves || typeof saves !== 'object' || Array.isArray(saves)) throw new ApiError(400, 'invalid_saves', '存档格式错误');
  const clean = {};
  let total = 0;
  for(const slot of SAVE_SLOTS){
    if(!(slot in saves)) continue;
    const item = saves[slot];
    if(!item || typeof item !== 'object' || Array.isArray(item)) throw new ApiError(400, 'invalid_saves', '存档槽位格式错误');
    if(!item.state || typeof item.state !== 'object' || Array.isArray(item.state)) throw new ApiError(400, 'invalid_saves', '存档缺少 state');
    let text;
    try { text = JSON.stringify(item); } catch(_) { throw new ApiError(400, 'invalid_saves', '存档无法序列化'); }
    total += text.length;
    if(total > MAX_SAVE_BYTES) throw new ApiError(413, 'saves_too_large', '存档超过大小上限');
    clean[slot] = item;
  }
  if(!Object.keys(clean).length) throw new ApiError(400, 'invalid_saves', '至少需要一个有效存档槽');
  return clean;
}

function validateBaseRevision(value){
  if(value == null) return 0;
  const n = Number(value);
  if(!Number.isInteger(n) || n < 0) throw new ApiError(400, 'invalid_revision', 'revision 非法');
  return n;
}

/* 主入口：index.mjs 把 /api 前缀的请求交给它 */
export async function handleApi(req, res, url, store, appVersion){
  try {
    checkCsrf(req);
    const path = url.pathname.replace(/\/+$/, '') || '/api';
    const method = req.method || 'GET';
    const ip = clientIp(req);

    if(method === 'GET' && path === '/api/health'){
      try {
        store.countUsers();
        return json(res, 200, { ok: true, service: 'neon-account', version: appVersion, time: nowIso(), database: 'ok' });
      } catch(e){
        return json(res, 503, { ok: false, service: 'neon-account', database: 'error' });
      }
    }

    /* ---------- 注册 ---------- */
    if(method === 'POST' && path === '/api/auth/register'){
      requireJson(req);
      const rl = authLimiter.hit(`register:${ip}`, 10, 60 * 60_000);
      if(!rl.allowed) throw new ApiError(429, 'rate_limited', '注册过于频繁', { retryAfter: rl.retryAfter });
      const body = await readBody(req);
      const u = validateUsername(body.username);
      if(!u.ok) throw new ApiError(400, u.code, '用户名需为 3-20 位字母/数字/下划线，且不能纯数字');
      const p = validatePassword(body.password, u.value);
      if(!p.ok) throw new ApiError(400, p.code, '密码需 8-72 位，且同时包含字母和数字');
      const n = validateNickname(body.nickname, u.value);
      if(!n.ok) throw new ApiError(400, n.code, '昵称最多 24 个字符');
      if(store.userByUsername(u.value)) throw new ApiError(409, 'username_taken', '用户名已被占用');

      const id = uuid();
      const at = nowIso();
      const pwd = scryptHash(p.value);
      const recoveryCode = makeRecoveryCode();
      const rec = scryptHash(normalizeRecoveryCode(recoveryCode));
      try {
        store.insertUser({
          id, username: u.value, usernameLower: u.value.toLowerCase(), nickname: n.value,
          pwdHash: pwd.hash, pwdSalt: pwd.salt, recoveryHash: rec.hash, recoverySalt: rec.salt,
          createdAt: at, updatedAt: at
        });
      } catch(e){
        if(String(e.message || '').includes('UNIQUE')) throw new ApiError(409, 'username_taken', '用户名已被占用');
        throw e;
      }
      const session = startSession(req, store, id);
      store.touchLogin(id, at);
      store.audit(id, 'register', `username=${u.value}`, ip);
      const row = store.userById(id);
      return json(res, 201, {
        user: publicUser(row), recoveryCode, save: saveMeta(null),
        session: { id: session.id, createdAt: session.createdAt, expiresAt: session.expiresAt }
      }, { 'Set-Cookie': sessionCookie(req, session.token) });
    }

    /* ---------- 登录 ---------- */
    if(method === 'POST' && path === '/api/auth/login'){
      requireJson(req);
      const rl = authLimiter.hit(`login:${ip}`, 30, 60_000);
      if(!rl.allowed) throw new ApiError(429, 'rate_limited', '尝试过于频繁', { retryAfter: rl.retryAfter });
      const body = await readBody(req);
      const username = String(body.username || '').trim();
      const password = String(body.password || '');
      if(!username || !password) throw new ApiError(400, 'invalid_credentials', '用户名或密码错误');
      const guardKey = `${username.toLowerCase()}|${ip}`;
      const guard = loginGuard.check(guardKey);
      if(!guard.allowed) throw new ApiError(429, 'locked_out', '失败次数过多，请稍后再试', { retryAfter: guard.retryAfter });
      const row = store.userByUsername(username);
      if(!row || !scryptVerify(password, row.pwd_hash, row.pwd_salt)){
        loginGuard.fail(guardKey);
        store.audit(row ? row.id : null, 'login_failed', `username=${username.slice(0, 32)}`, ip);
        throw new ApiError(401, 'invalid_credentials', '用户名或密码错误');
      }
      loginGuard.clear(guardKey);
      const session = startSession(req, store, row.id);
      store.touchLogin(row.id);
      store.audit(row.id, 'login', `session=${session.id}`, ip);
      return json(res, 200, {
        user: publicUser(row), save: saveMeta(store.saveByUser(row.id)),
        session: { id: session.id, createdAt: session.createdAt, expiresAt: session.expiresAt }
      }, { 'Set-Cookie': sessionCookie(req, session.token) });
    }

    /* ---------- 退出 ---------- */
    if(method === 'POST' && path === '/api/auth/logout'){
      const ctx = authFrom(req, store);
      if(ctx){
        store.deleteSession(ctx.session.id);
        store.audit(ctx.user.id, 'logout', `session=${ctx.session.id}`, ip);
      }
      return json(res, 200, { ok: true }, { 'Set-Cookie': clearCookie(req) });
    }

    /* ---------- 找回密码（无需登录） ---------- */
    if(method === 'POST' && path === '/api/auth/recover'){
      requireJson(req);
      const rl = authLimiter.hit(`recover:${ip}`, 10, 15 * 60_000);
      if(!rl.allowed) throw new ApiError(429, 'rate_limited', '尝试过于频繁', { retryAfter: rl.retryAfter });
      const body = await readBody(req);
      const row = store.userByUsername(body.username);
      const code = normalizeRecoveryCode(body.recoveryCode);
      const p = validatePassword(body.newPassword, body.username);
      if(!p.ok) throw new ApiError(400, p.code, '新密码需 8-72 位，且同时包含字母和数字');
      // 用户名不存在 / 找回码错误统一返回同一错误，避免枚举账号
      if(!row || !row.recovery_hash || !row.recovery_salt || !scryptVerify(code, row.recovery_hash, row.recovery_salt)){
        throw new ApiError(401, 'invalid_recovery', '用户名或找回码不正确');
      }
      const pwd = scryptHash(p.value);
      store.updatePassword(row.id, pwd.hash, pwd.salt);
      store.deleteUserSessions(row.id);
      store.audit(row.id, 'recovery_reset', null, ip);
      return json(res, 200, { ok: true }, { 'Set-Cookie': clearCookie(req) });
    }

    /* ---------- 当前用户：未登录也返回 200，避免浏览器控制台刷 401 ---------- */
    if(method === 'GET' && path === '/api/auth/me'){
      const maybe = authFrom(req, store);
      if(!maybe) return json(res, 200, { user: null, session: null, save: saveMeta(null) });
      return json(res, 200, {
        user: publicUser(maybe.user),
        session: { id: maybe.session.id, createdAt: maybe.session.created_at, expiresAt: maybe.session.expires_at },
        save: saveMeta(store.saveByUser(maybe.user.id))
      });
    }

    /* ---------- 以下均需登录 ---------- */
    const ctx = requireAuth(req, store);

    if(method === 'PATCH' && path === '/api/account/profile'){
      requireJson(req);
      const body = await readBody(req);
      const n = validateNickname(body.nickname, ctx.user.nickname);
      if(!n.ok) throw new ApiError(400, n.code, '昵称最多 24 个字符');
      store.updateProfile(ctx.user.id, n.value);
      store.audit(ctx.user.id, 'profile_update', null, ip);
      return json(res, 200, { user: publicUser(store.userById(ctx.user.id)) });
    }

    if(method === 'POST' && path === '/api/account/password'){
      requireJson(req);
      // 同一账号 15 分钟内最多 10 次改密尝试，防止会话被盗后暴力猜当前密码
      const pwdRl = authLimiter.hit(`password:${ctx.user.id}`, 10, 15 * 60_000);
      if(!pwdRl.allowed) throw new ApiError(429, 'rate_limited', '尝试过于频繁', { retryAfter: pwdRl.retryAfter });
      const body = await readBody(req);
      const current = String(body.currentPassword || '');
      if(!scryptVerify(current, ctx.user.pwd_hash, ctx.user.pwd_salt)) throw new ApiError(401, 'invalid_credentials', '当前密码不正确');
      const p = validatePassword(body.newPassword, ctx.user.username);
      if(!p.ok) throw new ApiError(400, p.code, '新密码需 8-72 位，且同时包含字母和数字');
      if(current === p.value) throw new ApiError(400, 'same_password', '新密码不能与旧密码相同');
      const pwd = scryptHash(p.value);
      store.updatePassword(ctx.user.id, pwd.hash, pwd.salt);
      store.deleteOtherSessions(ctx.user.id, ctx.session.id);
      store.audit(ctx.user.id, 'password_change', null, ip);
      return json(res, 200, { ok: true });
    }

    if(method === 'POST' && path === '/api/account/recovery-code'){
      requireJson(req);
      // 找回码重生成同样限流，避免被拿会话后反复试探密码
      const recRl = authLimiter.hit(`recovery-code:${ctx.user.id}`, 10, 15 * 60_000);
      if(!recRl.allowed) throw new ApiError(429, 'rate_limited', '尝试过于频繁', { retryAfter: recRl.retryAfter });
      const body = await readBody(req);
      const current = String(body.password || '');
      if(!scryptVerify(current, ctx.user.pwd_hash, ctx.user.pwd_salt)) throw new ApiError(401, 'invalid_credentials', '密码不正确');
      const code = makeRecoveryCode();
      const rec = scryptHash(normalizeRecoveryCode(code));
      store.updateRecovery(ctx.user.id, rec.hash, rec.salt);
      store.audit(ctx.user.id, 'recovery_code_rotate', null, ip);
      return json(res, 200, { recoveryCode: code });
    }

    if(method === 'GET' && path === '/api/account/sessions'){
      const list = store.sessionsByUser(ctx.user.id).map(s => ({
        id: s.id,
        createdAt: s.created_at,
        lastSeenAt: s.last_seen_at,
        expiresAt: s.expires_at,
        userAgent: s.ua || '',
        current: s.id === ctx.session.id
      }));
      return json(res, 200, { sessions: list });
    }

    if(method === 'DELETE' && path.startsWith('/api/account/sessions/')){
      const id = decodeURIComponent(path.slice('/api/account/sessions/'.length));
      if(!id) throw new ApiError(400, 'invalid_session', '会话不存在');
      const own = store.sessionsByUser(ctx.user.id).find(s => s.id === id);
      if(!own) throw new ApiError(404, 'invalid_session', '会话不存在');
      store.deleteSession(id);
      store.audit(ctx.user.id, 'session_revoke', `session=${id}`, ip);
      const headers = id === ctx.session.id ? { 'Set-Cookie': clearCookie(req) } : {};
      return json(res, 200, { ok: true }, headers);
    }

    if(method === 'GET' && path === '/api/account/export'){
      const row = store.saveByUser(ctx.user.id);
      let saves = null;
      if(row){ try { saves = JSON.parse(row.data); } catch(_) { saves = null; } }
      // 导出包含账号可见的会话与安全记录，便于用户完整备份/迁移（最多 200 条）
      store.audit(ctx.user.id, 'account_export', null, ip);
      const sessions = store.sessionsByUser(ctx.user.id).map(s => ({
        id: s.id, createdAt: s.created_at, lastSeenAt: s.last_seen_at, expiresAt: s.expires_at,
        userAgent: s.ua || '', ip: s.ip || '', current: s.id === ctx.session.id
      }));
      const audit = store.recentAudit(ctx.user.id, 200).map(a => ({
        action: a.action, detail: a.detail, ip: a.ip, createdAt: a.created_at
      }));
      return json(res, 200, {
        app: 'neon-heart',
        exportedAt: nowIso(),
        user: publicUser(ctx.user),
        saveMeta: saveMeta(row),
        saves,
        sessions,
        audit
      });
    }

    if(method === 'DELETE' && path === '/api/account'){
      requireJson(req);
      const body = await readBody(req);
      if(!scryptVerify(String(body.password || ''), ctx.user.pwd_hash, ctx.user.pwd_salt)){
        throw new ApiError(401, 'invalid_credentials', '密码不正确');
      }
      const uid = ctx.user.id;
      // 先清空该账号的审计记录，再删账号；sessions / saves 由外键级联删除。
      // 这样注销后不残留可关联的个人数据（订单/安全记录也不保留）。
      store.deleteAuditForUser(uid);
      store.deleteUser(uid);
      return json(res, 200, { ok: true }, { 'Set-Cookie': clearCookie(req) });
    }

    /* ---------- 云存档 ---------- */
    if(method === 'GET' && path === '/api/saves'){
      const row = store.saveByUser(ctx.user.id);
      if(!row) return json(res, 200, { save: saveMeta(null), saves: null });
      let saves = null;
      try { saves = JSON.parse(row.data); } catch(_) { throw new ApiError(500, 'save_corrupted', '云端存档损坏'); }
      return json(res, 200, { save: saveMeta(row), saves });
    }

    if(method === 'PUT' && path === '/api/saves'){
      requireJson(req);
      const body = await readBody(req);
      const clean = assertSavePayload(body);
      const baseRevision = validateBaseRevision(body.baseRevision);
      const force = body.force === true;
      const serialized = JSON.stringify(clean);
      const bytes = Buffer.byteLength(serialized);
      if(bytes > MAX_SAVE_BYTES) throw new ApiError(413, 'saves_too_large', '存档超过大小上限');
      const current = store.saveByUser(ctx.user.id);
      const currentRevision = current ? Number(current.revision) : 0;
      if(current && baseRevision !== currentRevision && !force){
        store.audit(ctx.user.id, 'save_conflict', `base=${baseRevision} server=${currentRevision}`, ip);
        throw new ApiError(409, 'save_conflict', '云端存档已被其它设备更新', {
          serverRevision: currentRevision,
          serverUpdatedAt: current.updated_at,
          serverBytes: Number(current.bytes || 0)
        });
      }
      const revision = currentRevision + 1;
      const at = nowIso();
      store.upsertSave(ctx.user.id, serialized, bytes, revision, at,
        typeof body.clientUpdatedAt === 'string' ? body.clientUpdatedAt.slice(0, 40) : null,
        typeof body.device === 'string' ? body.device.slice(0, 60) : null);
      store.audit(ctx.user.id, 'save_upload', `rev=${revision} bytes=${bytes}`, ip);
      return json(res, 200, {
        save: { revision, updatedAt: at, clientUpdatedAt: body.clientUpdatedAt || null, bytes, device: body.device || null }
      });
    }

    throw new ApiError(404, 'not_found', '接口不存在');
  } catch(e){
    const err = e instanceof ApiError ? e : new ApiError(500, 'internal_error', '服务器内部错误');
    if(err.status >= 500) console.error('[api]', req.method, url?.pathname, e);
    const body = { error: { code: err.code, message: err.message } };
    if(err.data) body.error.data = err.data;
    json(res, err.status, body);
  }
}
