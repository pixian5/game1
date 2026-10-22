/* ===== 霓虹心事 · PWA 注册 =====
 * 注册 Service Worker（离线游玩 / 添加到主屏幕）。
 * file:// 协议或浏览器不支持时静默跳过，不影响正常游戏。
 */
(function(){
  // v0.2.0: 前端错误上报（自有服务器 /collect-error，nginx 记入 neon-errors.log）
  // 只上报摘要（消息+位置+当前版本），节流 30s 一条，静默失败不影响游玩
  let lastReportAt = 0;
  const report = msg => {
    const now = Date.now();
    if(now - lastReportAt < 30000) return;
    lastReportAt = now;
    try {
      const v = document.querySelector('meta[name="version"]')?.content || '';
      navigator.sendBeacon(`/collect-error?e=${encodeURIComponent(String(msg).slice(0, 300))}&v=${encodeURIComponent(v)}`);
    } catch(_) {}
  };
  window.addEventListener('error', e => report(e.message + ' @' + (e.filename || '') + ':' + (e.lineno || 0)));
  window.addEventListener('unhandledrejection', e => report('unhandledrejection: ' + (e.reason && e.reason.message ? e.reason.message : e.reason)));

  if(typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  if(location.protocol !== 'https:' && location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.info('[PWA] Service Worker 注册失败（不影响游玩）:', err.message);
    });
  });
})();
