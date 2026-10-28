/* ===== 霓虹心事 · UI：App 渐进解锁（v0.6.6 P0-2）=====
 * 问题：开局 31 个 App 全部可见，认知过载且空架子误导探索。
 * 方案：开局只亮核心 8 个；其余按剧情事件解锁——解锁时刻推通知（"手机装上了新 App"），
 *       把解锁本身变成奖励反馈。解锁状态存 state.appsUnlocked（随存档走，二周目继承）。
 * 实现：渲染层过滤（CSS 类隐藏 + 每秒对账），不改静态 HTML；openApp 拦截未解锁提示。
 */
  // ===== App 渐进解锁 =====
  // 解锁条件：故事事件 flag 或一次性剧情触发（keyed by app id）
  const APP_UNLOCK_RULES = {
    // 核心开局组（无条件）
    messages: null, phone: null, moments: null, album: null,
    music: null, notes: null, settings: null, saves: null,
    // 剧情解锁组（flag 达成即亮）
    calendar:    s => (s.collected || []).length > 0 || s.day >= 3,       // 首件收集/第3天：日程感建立
    map:         s => s.day >= 2,                                          // 第二天可以出门
    profile:     s => s.day >= 2,
    contacts:    s => s.day >= 2,
    shop:        s => s.day >= 3,                                          // 商城随剧情接触
    tarot:       s => s.day >= 3,
    mood:        s => s.day >= 3,
    groups:      s => !!s.flags?.group_created_group_neon,                 // 群聊建群时
    collection:  s => (s.collected || []).length >= 1,                     // 第一件收集品
    achievements:s => Object.keys(s.achievements || {}).length >= 1,       // 第一个成就
    puzzles:     s => (s.discoveredClues && Object.keys(s.discoveredClues).length >= 1) || s.day >= 5,
    hints:       s => s.day >= 4,
    dates:       s => s.day >= 6,                                          // 约会随剧情位置出现
    affection:   s => s.day >= 5,
    relations:   s => s.day >= 5,
    player:      s => s.day >= 4,
    themes:      s => Object.keys(s.unlockedThemes || {}).length >= 2,     // 第二套主题解锁时
    endings:     s => Object.keys(s.endingSeen || {}).length >= 1,         // 首个结局后（或图鉴预测）
    dreams:      s => s.day >= 7,
    watch:       s => s.day >= 8,
    'perspective': s => s.day >= 9,
    holiday:     s => s.day >= 10,
  };

  const APP_NAMES = {
    calendar:'日历', map:'出行', profile:'画像', contacts:'通讯录', shop:'礼物商城',
    tarot:'塔罗占卜', mood:'心情', groups:'群聊', collection:'收集柜', achievements:'成就',
    puzzles:'线索本', hints:'智能提示', dates:'约会', affection:'好感度深度',
    relations:'关系', player:'主角档案', themes:'主题', endings:'结局图鉴',
    dreams:'梦魇录', watch:'观赏模式', perspective:'男主视角', holiday:'节日',
  };

  function computeUnlockedApps(state){
    const set = new Set();
    for(const [app, cond] of Object.entries(APP_UNLOCK_RULES)){
      if(cond === null){ set.add(app); continue; }
      try { if(cond(state)) set.add(app); } catch(_) {}
    }
    // 没有规则的 App（后续新增）默认可见——规则缺省不隐藏
    return set;
  }

  function applyAppUnlocks(){
    const prev = engine.state.appsUnlocked || {};
    const now = computeUnlockedApps(engine.state);
    let newly = [];
    for(const app of now){
      if(!prev[app]){ newly.push(app); prev[app] = true; }
    }
    engine.state.appsUnlocked = prev;
    // 视觉过滤：未解锁的图标隐藏（保留 DOM，解锁即亮）
    const grid = document.getElementById('app-grid');
    if(grid){
      [...grid.querySelectorAll('.app-icon')].forEach(el => {
        const app = el.dataset.app;
        el.hidden = !!(app && !now.has(app) && app in APP_UNLOCK_RULES);
      });
    }
    // 新解锁：亮起动画 + 通知（一次最多报 1 条，避免轰炸）
    if(newly.length && engine.state.day > 1){   // day1 的初始解锁不通知
      const app = newly[0];
      const name = APP_NAMES[app] || app;
      el_unlock_pulse(app);
      showNotif('susu', `📱 新 App 上线：${name}`);
      if(newly.length > 1) console.info('[apps] 本批解锁', newly);
    }
    return newly;
  }

  function el_unlock_pulse(app){
    const el = document.querySelector(`.app-icon[data-app="${app}"]`);
    if(!el) return;
    el.hidden = false;
    el.style.animation = 'appUnlock 0.8s ease';
    setUiTimeout(()=>{ el.style.animation = ''; }, 900);
  }

  // openApp 拦截：未解锁时提示（防止通过通知/其他入口提前进入）
  const _origOpenApp = openApp;
  openApp = function(app){
    const now = computeUnlockedApps(engine.state);
    if(app in APP_UNLOCK_RULES && !now.has(app)){
      toast('这个 App 还没上线——继续剧情，它会随故事出现');
      return;
    }
    return _origOpenApp(app);
  };

  // 状态变化时对账（含读档）
  engine.on('stateChange', ()=> applyAppUnlocks());
  engine.on('gameLoaded', ()=> { applyAppUnlocks(); });
