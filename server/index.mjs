/* ===== 霓虹心事 · 账号服务入口 =====
 * 同一个 Node 进程同时提供：静态站点（index.html / js / assets）+ /api 账号接口，
 * 这样 Cookie 天然同源，不需要 CORS，也不依赖额外 nginx 规则。
 *
 * 启动：node server/index.mjs（默认 8095）
 * 环境：NH_PORT / NH_HOST / NH_DB / NH_SECURE_COOKIE / NH_SITE_ROOT
 * 说明：容器/生产也可以让 nginx 只反代 /api 到本进程，静态仍由 nginx 发；
 *       NH_SITE_ROOT 指向 dist 时即可作为纯静态+API 一体化服务。
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handleApi } from './api.mjs';
import { openDb, createStore } from './db.mjs';
import { PORT, HOST, DB_PATH, SITE_ROOT } from './config.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

// 不允许通过静态服务访问的目录/文件（源码、文档、测试、凭据、数据库都在此列）
const DENY_PREFIX = ['server', 'docs', '经验', 'tools', 'deploy', 'playwright', 'node_modules',
  '.git', '.handoff', 'qa-shots', 'dist', 'patches'];
const DENY_FILE = /^(?:test_.*\.js|test_engine_direct\.mjs|eslint\.config\.mjs|playwright\.config\.js|package(?:-lock)?\.json|README\.md|文档索引\.md)$/i;

let appVersion = 'unknown';
try { appVersion = fs.readFileSync(path.join(SITE_ROOT, 'VERSION'), 'utf8').trim(); } catch(_) {}

const store = createStore(openDb(DB_PATH));
store.cleanupSessions();
store.cleanupAudit();

function log(...args){
  console.log(new Date().toISOString(), '[account]', ...args);
}

function sendError(res, status, text){
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(text);
}

function serveStatic(req, res, url){
  // 解码可能抛 URIError（例如请求 /%）：不捕获的话异常会穿透 http 回调
  // 变成 uncaughtException 直接杀死整个服务进程
  // （已实测：curl /% 一个请求就能让服务崩溃，属于远程拒绝服务漏洞）
  let rel;
  try { rel = decodeURIComponent(url.pathname); }
  catch(_){ return sendError(res, 400, 'Bad request'); }
  if(rel === '/' || rel === '') rel = '/index.html';
  const cleanRel = rel.replace(/^\/+/, '');
  const first = cleanRel.split('/')[0].toLowerCase();
  if(DENY_PREFIX.includes(first) || cleanRel.split('/').some(seg => seg.startsWith('.')) || DENY_FILE.test(cleanRel)){
    return sendError(res, 404, 'Not found');
  }
  if(rel.endsWith('/')) rel += 'index.html';
  const file = path.resolve(SITE_ROOT, cleanRel);
  if(file !== SITE_ROOT && !file.startsWith(SITE_ROOT + path.sep)) return sendError(res, 403, 'Forbidden');
  fs.stat(file, (err, stat) => {
    if(err || !stat.isFile()) return sendError(res, 404, 'Not found');
    const ext = path.extname(file).toLowerCase();
    if(!MIME[ext]) return sendError(res, 404, 'Not found');
    const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
    if(req.headers['if-none-match'] === etag){
      res.writeHead(304, { 'ETag': etag });
      return res.end();
    }
    const headers = {
      'Content-Type': MIME[ext],
      'Content-Length': stat.size,
      'ETag': etag,
      'Last-Modified': stat.mtime.toUTCString(),
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
    res.writeHead(200, headers);
    if(req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

// v0.9.12：安全响应头。静态文件、接口、错误响应统一带上（在请求入口一次性设置，后面各处 writeHead 传入的头与之合并）。
//   X-Frame-Options / frame-ancestors  禁止被别的网页嵌进框架，防「点击劫持」（把真实的登录界面盖在诱饵页面下面）。
//                                       页面里的策略元标签管不到这一项，必须由响应头下发
//   X-Content-Type-Options              浏览器不要自作聪明地猜文件类型
//   Referrer-Policy                     跳到别的网站时不带完整地址，只带来源
//   Permissions-Policy                  本游戏用不到的设备能力一律关闭（摄像头、麦克风、定位、支付、通用串行总线设备）
// 其余内容安全策略仍由 index.html 的策略元标签负责（纯静态部署时同样生效），这里不重复下发，免得两份策略不一致
const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};

const server = http.createServer((req, res) => {
  const started = Date.now();
  let url;
  try { url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`); }
  catch(_){ return sendError(res, 400, 'Bad request'); }

  for(const [name, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(name, value);

  res.on('finish', () => {
    // 只记录方法/路径/状态/耗时，避免把 Cookie、密码写进日志
    log(req.method, url.pathname, res.statusCode, `${Date.now() - started}ms`);
  });

  if(url.pathname === '/api' || url.pathname.startsWith('/api/')){
    handleApi(req, res, url, store, appVersion).catch(e => {
      log('UNHANDLED', e && e.stack ? e.stack : e);
      if(!res.headersSent) sendError(res, 500, 'Internal error');
    });
    return;
  }
  if(req.method !== 'GET' && req.method !== 'HEAD') return sendError(res, 405, 'Method not allowed');
  serveStatic(req, res, url);
});

server.listen(PORT, HOST, () => {
  log(`listening http://${HOST}:${PORT}`);
  log(`site=${SITE_ROOT}`);
  log(`db=${DB_PATH}`);
  log(`version=${appVersion} users=${store.countUsers()}`);
});

function shutdown(sig){
  log(`收到 ${sig}，准备退出`);
  server.close(() => {
    try { store.db.close(); } catch(_) {}
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 3000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
// 最后一道防线：任何漏网的未捕获异常只记录不退出。
// 账号服务挂掉的代价是所有用户登录态不可用，比带着异常继续跑更糟；
// 精确的解码等缺陷已在各自的 try/catch 里处理，这里只兜真正的意外。
process.on('uncaughtException', (err) => {
  log('UNCAUGHT', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (err) => {
  log('UNHANDLED_REJECTION', err && err.stack ? err.stack : err);
});
process.on('SIGTERM', () => shutdown('SIGTERM'));
