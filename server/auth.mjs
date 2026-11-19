/* ===== 霓虹心事 · 账号安全工具 =====
 * 密码：scrypt(N=16384,r=8,p=1) + 随机盐，恒定时间比较；
 * 会话：32 字节随机 token，只把 SHA-256 存库，Cookie 为 HttpOnly + SameSite=Lax；
 * 找回码：12 位易读字符（避免 0/O/1/I），同样 scrypt 哈希存储，仅在生成时明文返回一次。
 */
import crypto from 'node:crypto';

const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export function scryptHash(plain, saltBase64 = null){
  const salt = saltBase64 ? Buffer.from(saltBase64, 'base64') : crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(plain), salt, 64, SCRYPT);
  return { hash: hash.toString('base64'), salt: salt.toString('base64') };
}

export function scryptVerify(plain, hashBase64, saltBase64){
  try {
    const expected = Buffer.from(hashBase64, 'base64');
    const actual = crypto.scryptSync(String(plain), Buffer.from(saltBase64, 'base64'), expected.length, SCRYPT);
    return crypto.timingSafeEqual(expected, actual);
  } catch(_){
    return false;
  }
}

export function sha256(text){
  return crypto.createHash('sha256').update(String(text)).digest('hex');
}

export function randomToken(){
  return crypto.randomBytes(32).toString('base64url');
}

/* 找回码：去掉易混淆字符，按 4-4-4 分组，用户抄写/比对都方便 */
const RECOVERY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function makeRecoveryCode(){
  const bytes = crypto.randomBytes(12);
  let out = '';
  for(let i = 0; i < 12; i++){
    if(i > 0 && i % 4 === 0) out += '-';
    out += RECOVERY_ALPHABET[bytes[i] % RECOVERY_ALPHABET.length];
  }
  return out;
}

export function normalizeRecoveryCode(code){
  return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/* 用户名：3-20 位字母/数字/下划线；不允许纯数字（避免和 QQ 号混淆）
 * 昵称：1-24 字符，允许中文，过滤控制字符与首尾空白 */
export function validateUsername(username){
  const value = String(username || '').trim();
  if(!/^[A-Za-z0-9_]{3,20}$/.test(value)) return { ok: false, code: 'invalid_username' };
  if(!/[A-Za-z_]/.test(value)) return { ok: false, code: 'invalid_username' };
  return { ok: true, value };
}

export function validateNickname(nickname, fallback){
  let value = String(nickname == null ? '' : nickname).replace(/[\u0000-\u001f\u007f]/g, '').trim();
  if(!value) value = fallback;
  if([...value].length > 24) return { ok: false, code: 'invalid_nickname' };
  return { ok: true, value };
}

export function validatePassword(password, username = ''){
  const value = String(password == null ? '' : password);
  if(value.length < 8 || value.length > 72) return { ok: false, code: 'weak_password' };
  if(!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) return { ok: false, code: 'weak_password' };
  if(username && value.toLowerCase() === String(username).toLowerCase()) return { ok: false, code: 'weak_password' };
  if(/^(?:password|12345678|qwerty|abc123|11111111)$/i.test(value)) return { ok: false, code: 'weak_password' };
  return { ok: true, value };
}

/* ---------- Cookie ---------- */
export function parseCookies(header){
  const out = {};
  String(header || '').split(';').forEach(part => {
    const idx = part.indexOf('=');
    if(idx < 0) return;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if(!key) return;
    try { out[key] = decodeURIComponent(val); } catch(_) { out[key] = val; }
  });
  return out;
}

export function serializeCookie(name, value, opts = {}){
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if(opts.maxAge != null) parts.push(`Max-Age=${Math.floor(opts.maxAge / 1000)}`);
  if(opts.secure) parts.push('Secure');
  return parts.join('; ');
}

/* ---------- 简易滑动窗口限流（单进程内存；重启即清零，够用且不引入 Redis） ---------- */
export class RateLimiter {
  constructor(){
    this.buckets = new Map();
    this.timer = setInterval(() => this.sweep(), 60_000);
    if(this.timer.unref) this.timer.unref();
  }
  hit(key, limit, windowMs){
    const now = Date.now();
    let b = this.buckets.get(key);
    if(!b || b.resetAt <= now){
      b = { count: 0, resetAt: now + windowMs };
      this.buckets.set(key, b);
    }
    b.count += 1;
    return {
      allowed: b.count <= limit,
      remaining: Math.max(0, limit - b.count),
      retryAfter: Math.max(1, Math.ceil((b.resetAt - now) / 1000))
    };
  }
  reset(key){ this.buckets.delete(key); }
  sweep(){
    const now = Date.now();
    for(const [k, b] of this.buckets){ if(b.resetAt <= now) this.buckets.delete(k); }
  }
}

/* 登录失败锁定：同一「用户名+IP」15 分钟 5 次；成功登录即清零 */
export class LoginGuard {
  constructor(){ this.map = new Map(); }
  check(key){
    const item = this.map.get(key);
    if(!item) return { allowed: true };
    const now = Date.now();
    // until=0 表示还在累计失败次数、尚未锁定，不能当成「已到期」清空
    if(item.until > now) return { allowed: false, retryAfter: Math.ceil((item.until - now) / 1000) };
    if(item.until && item.until <= now){
      this.map.delete(key);
      return { allowed: true };
    }
    return { allowed: true };
  }
  fail(key){
    const now = Date.now();
    let item = this.map.get(key);
    if(!item || item.firstAt + 15 * 60_000 < now) item = { count: 0, firstAt: now, until: 0 };
    item.count += 1;
    if(item.count >= 5) item.until = now + 15 * 60_000;
    this.map.set(key, item);
  }
  clear(key){ this.map.delete(key); }
}
