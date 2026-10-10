/* ===== 霓虹心事 · PWA 注册 =====
 * 注册 Service Worker（离线游玩 / 添加到主屏幕）。
 * file:// 协议或浏览器不支持时静默跳过，不影响正常游戏。
 */
(function(){
  if(typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  if(location.protocol !== 'https:' && location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.info('[PWA] Service Worker 注册失败（不影响游玩）:', err.message);
    });
  });
})();
