/* ===== 霓虹心事 · 剧情数据：好感深度维度与主题/图标主题 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// ===== v0.0.15 好感度深度系统 =====
// 在 state.affection[charId] 综合分之上，新增三轴：closeness(亲密度) / trust(信任度) / tension(暧昧度)
// 旧 effects.affection{charId:n} 仍驱动综合分；三轴按 50%/30%/20% 自动折算
// 新 effects.affectionDetail{charId:{closeness:x,trust:y,tension:z}} 可精细驱动
STORY.affectionDimensions = {
  closeness: { id:'closeness', name:'亲密度', icon:'🤝', color:'#4ade80', desc:'一起经历过的事越多越亲密' },
  trust:     { id:'trust',     name:'信任度', icon:'🔐', color:'#7a5cff', desc:'他愿意对你敞开心扉的程度' },
  tension:   { id:'tension',   name:'暧昧度', icon:'💫', color:'#ff5fa8', desc:'心跳加速的瞬间累积' }
};

// 三轴阶段定义（每轴 4 段，独立于关系阶段系统）
STORY.affectionDimStages = {
  closeness: [
    { min:0,  max:5,  name:'点头之交' },
    { min:6,  max:15, name:'熟悉' },
    { min:16, max:30, name:'知己' },
    { min:31, max:99, name:'生死之交' }
  ],
  trust: [
    { min:0,  max:5,  name:'戒备' },
    { min:6,  max:15, name:'信赖' },
    { min:16, max:30, name:'交心' },
    { min:31, max:99, name:'托付' }
  ],
  tension: [
    { min:0,  max:5,  name:'平淡' },
    { min:6,  max:15, name:'微澜' },
    { min:16, max:30, name:'心跳' },
    { min:31, max:99, name:'炽热' }
  ]
};


// ===== v0.0.15 手机主题/壁纸系统 =====
// v0.1.7: wallpaperImage 为程序化生成的壁纸（tools/generate_wallpapers.py），
// 由 ui/18 applyThemeToBody 叠加在 CSS 渐变之上——图片缺失时回退为纯渐变
STORY.themes = {
  default: { id:'default', name:'霓虹初遇', bg:'#0a0612', accent:'#ff5fa8', wallpaper:'gradient', wallpaperVar:'linear-gradient(160deg,#1a0a2e 0%,#2a0f4a 40%,#0a0712 100%)', unlockDesc:'默认主题', unlockCondition: null },
  starry:  { wallpaperImage:'assets/wallpapers/starry.jpg', id:'starry',  name:'星夜', bg:'#0a0a2a', accent:'#7a5cff', wallpaper:'stars',  wallpaperVar:'radial-gradient(circle at 30% 20%,#3a2a6a 0%,transparent 40%),radial-gradient(circle at 70% 60%,#5a2a4a 0%,transparent 40%),linear-gradient(160deg,#0a0a2a 0%,#1a1a4a 50%,#050518 100%)', unlockDesc:'收集3张梦境碎片解锁', unlockCondition: s => (s.dreamShards||[]).length >= 3 },
  sea:     { wallpaperImage:'assets/wallpapers/sea.jpg', id:'sea',     name:'海雾', bg:'#0a2a3a', accent:'#4ade80', wallpaper:'waves',  wallpaperVar:'linear-gradient(160deg,#0a2a3a 0%,#1a4a5a 40%,#050f18 100%)', unlockDesc:'南方出差剧情解锁', unlockCondition: s => s.flags.shenyan_south === true },
  sunset:  { wallpaperImage:'assets/wallpapers/sunset.jpg', id:'sunset',  name:'暮色', bg:'#2a1a0a', accent:'#fbbf24', wallpaper:'sunset', wallpaperVar:'linear-gradient(160deg,#2a1a0a 0%,#6a3a1a 30%,#fbbf24 70%,#ff5fa8 100%)', unlockDesc:'天台剧情解锁', unlockCondition: s => !!(s.photos||[]).find(p=>p.id==='rooftop_night') },
  ink:     { wallpaperImage:'assets/wallpapers/ink.jpg', id:'ink',     name:'水墨', bg:'#1a1a1a', accent:'#e5e5e5', wallpaper:'ink',    wallpaperVar:'linear-gradient(160deg,#1a1a1a 0%,#3a3a3a 50%,#0a0a0a 100%)', unlockDesc:'体验5种以上心情解锁', unlockCondition: s => (s.moodHistory||[]).length >= 5 },
  rose:    { wallpaperImage:'assets/wallpapers/rose.jpg', id:'rose',    name:'玫瑰', bg:'#2a0a1a', accent:'#ff5fa8', wallpaper:'rose',   wallpaperVar:'linear-gradient(160deg,#2a0a1a 0%,#5a1a3a 40%,#0a0510 100%)', unlockDesc:'任一男主好感度达12解锁', unlockCondition: s => Object.values(s.affection||{}).some(v=>v>=12) },
  dark:    { id:'dark',    name:'深夜', bg:'#000000', accent:'#888888', wallpaper:'dark',   wallpaperVar:'#000000', unlockDesc:'观看任一结局解锁', unlockCondition: s => Object.keys(s.endingSeen||{}).length >= 1 }
};

// 图标主题（与壁纸独立）
STORY.iconThemes = {
  default: { id:'default', name:'圆角方块', unlockDesc:'默认' },
  outline: { id:'outline', name:'线性描边', unlockDesc:'解锁5个成就' , unlockCondition: s => Object.keys(s.achievements||{}).length >= 5 },
  retro:   { id:'retro',   name:'复古拟物', unlockDesc:'连胜7天任务', unlockCondition: s => (s.taskStreak||0) >= 7 }
};
