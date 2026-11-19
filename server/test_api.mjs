/* ===== 霓虹心事 · 账号 API 集成测试 =====
 * 不依赖测试框架：启动一个真实进程 + 临时 SQLite，用 fetch 走完整 HTTP 流程。
 * 覆盖：注册/登录/登出/me/昵称/改密/找回码重置/设备会话/云存档冲突/导出/注销/CSRF/静态目录隔离。
 * 运行：node server/test_api.mjs
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const PORT = Number(process.env.NH_TEST_PORT || 4198);
const BASE = `http://127.0.0.1:${PORT}`;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'nh-account-'));
const DB = path.join(TMP, 'test.db');

let passed = 0;
const failures = [];
function ok(name, cond, extra = ''){
  if(cond){ passed++; console.log(`  ✓ ${name}`); }
  else { failures.push(`${name}${extra ? ' :: ' + extra : ''}`); console.log(`  ✗ ${name}${extra ? ' :: ' + extra : ''}`); }
}
function eq(name, actual, expected){ ok(name, JSON.stringify(actual) === JSON.stringify(expected), `actual=${JSON.stringify(actual)} expected=${JSON.stringify(expected)}`); }

async function call(pathname, { method = 'GET', body = null, cookie = '', headers = {}, omitCsrf = false } = {}){
  const h = { ...headers };
  if(body != null) h['Content-Type'] = 'application/json';
  if(method !== 'GET' && !omitCsrf) h['X-Requested-With'] = 'neon-account';
  if(cookie) h['Cookie'] = cookie;
  const res = await fetch(BASE + pathname, { method, headers: h, body: body == null ? undefined : JSON.stringify(body) });
  let data = null;
  try { data = await res.json(); } catch(_) {}
  const setCookie = res.headers.get('set-cookie') || '';
  const cookiePair = setCookie.split(';')[0];
  return { status: res.status, data, cookie: cookiePair, setCookie };
}
async function waitUp(){
  for(let i = 0; i < 60; i++){
    try { const r = await call('/api/health'); if(r.status === 200) return; } catch(_){}
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('server did not start');
}

const child = spawn(process.execPath, ['--no-warnings', 'server/index.mjs'], {
  cwd: path.resolve(import.meta.dirname, '..'),
  env: { ...process.env, NH_PORT: String(PORT), NH_DB: DB, NH_HOST: '127.0.0.1' },
  stdio: ['ignore', 'pipe', 'pipe']
});
let log = '';
child.stdout.on('data', d => { log += d; });
child.stderr.on('data', d => { log += d; });

try {
  await waitUp();
  console.log('== 基础 ==');
  const health = await call('/api/health');
  ok('health 200', health.status === 200 && health.data.ok === true, JSON.stringify(health.data));

  console.log('== 注册校验 ==');
  eq('用户名过短被拒', (await call('/api/auth/register', { method: 'POST', body: { username: 'ab', password: 'abc12345' } })).data?.error?.code, 'invalid_username');
  eq('纯数字用户名被拒', (await call('/api/auth/register', { method: 'POST', body: { username: '123456', password: 'abc12345' } })).data?.error?.code, 'invalid_username');
  eq('弱密码被拒', (await call('/api/auth/register', { method: 'POST', body: { username: 'weakuser', password: 'abcdefgh' } })).data?.error?.code, 'weak_password');
  eq('超长昵称被拒', (await call('/api/auth/register', { method: 'POST', body: { username: 'nickuser', password: 'abc12345', nickname: 'x'.repeat(25) } })).data?.error?.code, 'invalid_nickname');
  eq('缺少请求标识被 CSRF 拦截', (await call('/api/auth/register', { method: 'POST', body: { username: 'csrfuser', password: 'abc12345' }, omitCsrf: true })).status, 403);

  console.log('== 注册 / 登录 / me ==');
  const reg = await call('/api/auth/register', { method: 'POST', body: { username: 'alice', password: 'abc12345', nickname: '爱丽丝' } });
  ok('注册 201', reg.status === 201, JSON.stringify(reg.data));
  ok('返回找回码', /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(reg.data.recoveryCode || ''), reg.data.recoveryCode);
  ok('注册下发会话 Cookie', reg.cookie.startsWith('nh_session='), reg.setCookie);
  const aliceCookie = reg.cookie;
  const recoveryCode = reg.data.recoveryCode;
  eq('重复用户名 409', (await call('/api/auth/register', { method: 'POST', body: { username: 'alice', password: 'abc12345' } })).status, 409);
  const me = await call('/api/auth/me', { cookie: aliceCookie });
  eq('me 返回昵称', me.data?.user?.nickname, '爱丽丝');
  eq('me 返回空云存档元信息', me.data?.save?.revision, 0);

  console.log('== 昵称 ==');
  const prof = await call('/api/account/profile', { method: 'PATCH', body: { nickname: '爱丽丝2' }, cookie: aliceCookie });
  eq('昵称更新成功', prof.data?.user?.nickname, '爱丽丝2');

  console.log('== 云存档 ==');
  const save1 = { auto: { v: 3, slot: 'auto', state: { day: 3, player: { name: '林夏' } }, time: '2026-11-20T00:00:00.000Z' }, slot1: { v: 3, slot: 'slot1', state: { day: 2 }, time: '2026-11-19T00:00:00.000Z' } };
  const put1 = await call('/api/saves', { method: 'PUT', body: { saves: save1, baseRevision: 0, clientUpdatedAt: '2026-11-20T00:00:00.000Z' }, cookie: aliceCookie });
  eq('首次上传 revision=1', put1.data?.save?.revision, 1);
  const get1 = await call('/api/saves', { cookie: aliceCookie });
  eq('读取云存档槽位', Object.keys(get1.data?.saves || {}).sort(), ['auto', 'slot1']);
  eq('读取 revision=1', get1.data?.save?.revision, 1);
  const conflict = await call('/api/saves', { method: 'PUT', body: { saves: save1, baseRevision: 0 }, cookie: aliceCookie });
  eq('旧 revision 冲突 409', conflict.status, 409);
  eq('冲突返回 serverRevision', conflict.data?.error?.data?.serverRevision, 1);
  const force = await call('/api/saves', { method: 'PUT', body: { saves: save1, baseRevision: 0, force: true }, cookie: aliceCookie });
  eq('force 覆盖 revision=2', force.data?.save?.revision, 2);
  const emptySaves = await call('/api/saves', { method: 'PUT', body: { saves: {}, baseRevision: 2 }, cookie: aliceCookie });
  eq('空存档被拒', emptySaves.data?.error?.code, 'invalid_saves');
  const tooBig = await call('/api/saves', { method: 'PUT', body: { saves: { auto: { v: 3, slot: 'auto', state: { blob: 'x'.repeat(1_600_000) } } }, baseRevision: 2 }, cookie: aliceCookie });
  eq('超限存档 413', tooBig.status, 413);

  console.log('== 多设备会话 ==');
  const login2 = await call('/api/auth/login', { method: 'POST', body: { username: 'alice', password: 'abc12345' } });
  ok('第二设备登录成功', login2.status === 200 && login2.cookie.startsWith('nh_session='));
  const sessions = await call('/api/account/sessions', { cookie: aliceCookie });
  eq('设备数为 2', sessions.data?.sessions?.length, 2);
  const other = sessions.data.sessions.find(s => !s.current);
  ok('存在非当前设备', !!other);
  const revoked = await call(`/api/account/sessions/${other.id}`, { method: 'DELETE', cookie: aliceCookie });
  eq('踢掉设备 200', revoked.status, 200);
  const meOld = await call('/api/auth/me', { cookie: login2.cookie });
  eq('被踢会话失效', meOld.data?.user, null);

  console.log('== 改密 / 找回 ==');
  eq('错误当前密码被拒', (await call('/api/account/password', { method: 'POST', body: { currentPassword: 'wrong', newPassword: 'abc12345' }, cookie: aliceCookie })).status, 401);
  const pwd = await call('/api/account/password', { method: 'POST', body: { currentPassword: 'abc12345', newPassword: 'xyz12345' }, cookie: aliceCookie });
  eq('改密成功', pwd.status, 200);
  eq('旧密码登录失败', (await call('/api/auth/login', { method: 'POST', body: { username: 'alice', password: 'abc12345' } })).status, 401);
  ok('新密码登录成功', (await call('/api/auth/login', { method: 'POST', body: { username: 'alice', password: 'xyz12345' } })).status === 200);
  const rotate = await call('/api/account/recovery-code', { method: 'POST', body: { password: 'xyz12345' }, cookie: aliceCookie });
  ok('重新生成找回码', /^[A-Z0-9]{4}-/.test(rotate.data?.recoveryCode || ''));
  eq('旧找回码重置失败', (await call('/api/auth/recover', { method: 'POST', body: { username: 'alice', recoveryCode, newPassword: 'new12345' } })).status, 401);
  const recover = await call('/api/auth/recover', { method: 'POST', body: { username: 'alice', recoveryCode: rotate.data.recoveryCode, newPassword: 'new12345' } });
  eq('新找回码重置成功', recover.status, 200);
  eq('重置后旧会话失效', (await call('/api/auth/me', { cookie: aliceCookie })).data?.user, null);
  ok('重置后新密码可登录', (await call('/api/auth/login', { method: 'POST', body: { username: 'alice', password: 'new12345' } })).status === 200);

  console.log('== 导出 / 注销 ==');
  const login3 = await call('/api/auth/login', { method: 'POST', body: { username: 'alice', password: 'new12345' } });
  const exported = await call('/api/account/export', { cookie: login3.cookie });
  eq('导出含用户', exported.data?.user?.username, 'alice');
  ok('导出含云存档', !!exported.data?.saves?.auto);
  ok('导出含设备会话', Array.isArray(exported.data?.sessions) && exported.data.sessions.length > 0);
  ok('导出含安全记录', Array.isArray(exported.data?.audit) && exported.data.audit.length > 0);
  eq('错误密码注销被拒', (await call('/api/account', { method: 'DELETE', body: { password: 'bad' }, cookie: login3.cookie })).status, 401);
  const del = await call('/api/account', { method: 'DELETE', body: { password: 'new12345' }, cookie: login3.cookie });
  eq('注销成功', del.status, 200);
  eq('注销后登录失败', (await call('/api/auth/login', { method: 'POST', body: { username: 'alice', password: 'new12345' } })).status, 401);
  // 注销必须级联清空 users / sessions / saves / audit_log，不能残留可关联数据
  const uid = login3.data?.user?.id;
  const checkDb = new DatabaseSync(DB, { readOnly: true });
  const count = (sql, ...args) => Number(checkDb.prepare(sql).get(...args)?.n || 0);
  eq('注销后用户行已删除', count('SELECT COUNT(*) AS n FROM users WHERE id = ?', uid), 0);
  eq('注销后会话行已删除', count('SELECT COUNT(*) AS n FROM sessions WHERE user_id = ?', uid), 0);
  eq('注销后云存档已删除', count('SELECT COUNT(*) AS n FROM saves WHERE user_id = ?', uid), 0);
  eq('注销后审计记录已删除', count('SELECT COUNT(*) AS n FROM audit_log WHERE user_id = ?', uid), 0);
  checkDb.close();

  console.log('== 静态目录隔离 ==');
  eq('首页 200', (await fetch(BASE + '/')).status, 200);
  eq('server 源码被隐藏', (await fetch(BASE + '/server/api.mjs')).status, 404);
  eq('docs 目录被隐藏', (await fetch(BASE + '/docs/')).status, 404);

  console.log('== 畸形 URL 不崩服务（v0.9.10 回归）==');
  // 历史缺陷：/% 这类非法百分号编码会让 decodeURIComponent 抛 URIError，
  // 穿透 http 回调直接杀死进程。修复后必须返回 400 且服务存活。
  const bad1 = await fetch(BASE + '/%');
  eq('畸形编码返回 400', bad1.status, 400);
  const bad2 = await fetch(BASE + '/static/%E0%A4%A');
  ok('半截编码也被拦（400 或 404，不能 5xx）', [400, 404].includes(bad2.status));
  await new Promise(r => setTimeout(r, 200));
  const alive = await call('/api/health');
  eq('畸形请求后服务仍存活', alive.status, 200);

  console.log('== 账号锁定 ==');
  for(let i = 0; i < 5; i++) await call('/api/auth/login', { method: 'POST', body: { username: 'carol', password: 'wrong1234' } });
  const locked = await call('/api/auth/login', { method: 'POST', body: { username: 'carol', password: 'wrong1234' } });
  eq('5 次失败后锁定 429', locked.status, 429);
  eq('锁定码正确', locked.data?.error?.code, 'locked_out');

} catch(e){
  failures.push('UNCAUGHT: ' + (e.stack || e));
  console.error(e);
} finally {
  child.kill('SIGTERM');
  await new Promise(r => setTimeout(r, 300));
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`\n结果：${passed} 通过 / ${failures.length} 失败`);
  if(failures.length){
    console.log('失败项：'); failures.forEach(f => console.log(' -', f));
    if(process.env.NH_TEST_VERBOSE) console.log(log);
    process.exit(1);
  }
  process.exit(0);
}
