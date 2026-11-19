/* ===== 霓虹心事 · Service Worker =====
 * 策略：静态资源 cache-first（离线可玩），页面请求 network-first（发版即见新内容）。
 * 缓存版本号必须与根目录 VERSION 一致——check_version.js 会校验（CACHE_VERSION 行）。
 * 每次发版：VERSION +0.0.1 后同步修改这里的 CACHE_VERSION。
 */
const CACHE_VERSION = 'neon-heart-v0.9.7';

// 预缓存核心资源（与 index.html 的脚本清单保持一致）
const PRECACHE = [
  './',
  './index.html',
  './privacy.html',
  './privacy-en.html',
  './manifest.json',
  './bundle.js',
  './style.css',
  // i18n 语言包与框架（v0.3.6 / B1-a；v0.3.8 B1-b 增 en 骨架）
  // 剧情数据层
  // 引擎
  // 音效
  // UI 层
  // 图标（安装与桌面图标必需）
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-180.png',
  // v0.4.3 (D5 缓存策略): 仅预缓存首屏必需图片；其余图片（其余壁纸/相册/氛围/OG/截图）
  // 改为运行时按需缓存——见下方 fetch 的 cache-first + 写回逻辑，避免首装一次性拉 2.6MB。
  "./assets/cg/cg_nightmare_stage.jpg",
  "./assets/cg/cg_rooftop_night.jpg",
  "./assets/cg/cg_shenyan_confess.jpg",
  "./assets/cg/cg_luci_confess.jpg",
  "./assets/cg/cg_jiangyu_confess.jpg",
  "./assets/cg/cg_true_ending.jpg",
  './assets/wallpapers/default.jpg',
  './assets/avatars/thumbs/shenyan.jpg',
  './assets/avatars/thumbs/luci.jpg',
  './assets/avatars/thumbs/jiangyu.jpg',
  './assets/avatars/thumbs/susu.jpg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;

  // 页面导航：network-first，离线回退缓存
  if(req.mode === 'navigate'){
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }
  // 静态资源：cache-first，未命中回网络并写入缓存
  // v0.1.13: ignoreSearch——页面请求带 ?v=版本号，预缓存存的是无参数路径，
  // 严格匹配会全部 miss（离线时 JS/CSS 全挂），必须忽略查询参数匹配
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if(res.ok){
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
