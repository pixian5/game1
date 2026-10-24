/* ===== 霓虹心事 · Service Worker =====
 * 策略：静态资源 cache-first（离线可玩），页面请求 network-first（发版即见新内容）。
 * 缓存版本号必须与根目录 VERSION 一致——check_version.js 会校验（CACHE_VERSION 行）。
 * 每次发版：VERSION +0.0.1 后同步修改这里的 CACHE_VERSION。
 */
const CACHE_VERSION = 'neon-heart-v0.5.1';

// 预缓存核心资源（与 index.html 的脚本清单保持一致）
const PRECACHE = [
  './',
  './index.html',
  './privacy.html',
  './manifest.json',
  './style.css',
  // i18n 语言包与框架（v0.3.6 / B1-a；v0.3.8 B1-b 增 en 骨架）
  './i18n/zh-CN.js',
  './i18n/en-US.js',
  './i18n/index.js',
  // 剧情数据层
  './story/00_core.js',
  './story/01_events.js',
  './story/02_moments_dreams.js',
  './story/03_assets.js',
  './story/04_route_ending.js',
  './story/05_locations.js',
  './story/06_intel_invitations.js',
  './story/07_groups_profiles.js',
  './story/08_flashbacks.js',
  './story/09_shop_moods.js',
  './story/10_tarot_achievements.js',
  './story/11_collectibles_puzzles.js',
  './story/12_seasons_perspectives.js',
  './story/13_player_relationship.js',
  './story/14_critical_daily.js',
  './story/15_affection_themes.js',
  './story/16_dates_nightmares.js',
  './story/17_hints_ambiences.js',
  // 引擎
  './interaction_queue.js',
  './save_migrations.js',
  './engine.js',
  './engine_social.js',
  './engine_content.js',
  './engine_progress.js',
  './engine_save.js',
  // 音效
  './audio.js',
  './pwa.js',
  // UI 层
  './ui/00_shell.js',
  './ui/01_input_delegate.js',
  './ui/02_map_encounters.js',
  './ui/03_messages.js',
  './ui/04_engine_events.js',
  './ui/05_calls.js',
  './ui/06_album_calendar_music.js',
  './ui/07_notes_logs_endings.js',
  './ui/08_moments.js',
  './ui/09_dreams_memories_intel.js',
  './ui/10_voicemail_groups.js',
  './ui/11_contacts_flashbacks.js',
  './ui/12_shop_mood.js',
  './ui/13_tarot_achievements.js',
  './ui/14_collection_puzzles.js',
  './ui/15_holiday_perspective.js',
  './ui/16_player_profile.js',
  './ui/17_relationship_tasks_watch.js',
  './ui/18_affection_theme_gallery_dates.js',
  './ui/19_listeners_nightmares.js',
  './ui/20_saves.js',
  './ui/21_init.js',
  './ui/22_settings.js',
  // 图标（安装与桌面图标必需）
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-180.png',
  // v0.4.3 (D5 缓存策略): 仅预缓存首屏必需图片；其余图片（其余壁纸/相册/氛围/OG/截图）
  // 改为运行时按需缓存——见下方 fetch 的 cache-first + 写回逻辑，避免首装一次性拉 2.6MB。
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
