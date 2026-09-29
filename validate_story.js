/* ===== 剧情数据一致性校验器 =====
 * 目的：在提交/CI 阶段自动拦截「引用了不存在的事件/收集品/结局/flag/角色」这类数据错误，
 *       避免靠人肉排查（历史上多次出现 then 断链、flag 无设置者、收集品无获取路径）。
 * 运行：node validate_story.js
 * 结果：错误（errors）会导致进程退出码 1；警告（warnings）只提示不拦截。
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ---------- 加载剧情与引擎（与 test_regressions.js 相同的沙箱方式） ----------
const sandbox = {
  window: {}, console, Date, Math, JSON, Object, Array, String, Number, Boolean,
  Set, Map, setTimeout, clearTimeout, setInterval, clearInterval
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for(const file of ['story.js', 'interaction_queue.js', 'save_migrations.js', 'engine.js']){
  vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), sandbox);
}
const { STORY, PhoneEngine } = sandbox.window;

// ---------- 基础集合（合法 id / 合法角色 / 合法数值维度） ----------
const state = new PhoneEngine(STORY).state;
const cast = new Set(Object.keys(state.conversations));           // shenyan/luci/jiangyu/susu
const speakers = new Set(['narrator', 'me', 'linxia', ...cast]);  // 允许出现在消息/动态/评论里的来源
const affIds = new Set(Object.keys(state.affection));
const affDetailIds = new Set(Object.keys(state.affectionDetail));
const personalityIds = new Set(Object.keys(state.personality));
const moodIds = new Set(Object.keys(STORY.moods || {}));
const eventIds = new Set([...Object.keys(STORY.events || {}), ...Object.keys(STORY.criticalEvents || {})]);

const errors = [];
const warnings = [];
const err = msg => errors.push(msg);
const warn = msg => warnings.push(msg);
const has = (map, id) => !!(map && Object.prototype.hasOwnProperty.call(map, id));
// 合法事件引用：已定义事件，或邀约系统的特殊目标（__inv_accept_xxx / __inv_decline_xxx）
const isEventRef = id => eventIds.has(id) || /^__inv_(accept|decline)_[A-Za-z0-9_:-]+$/.test(id || '');

// ---------- 通用：校验 event / criticalEvent 结构里的引用 ----------
function checkEventLike(label, evt){
  if(!evt || typeof evt !== 'object') return;
  if(evt.then && !isEventRef(evt.then)) err(`${label}.then 引用了不存在的事件：${evt.then}`);
  if(evt.collectible && !has(STORY.collectibles, evt.collectible)) err(`${label}.collectible 未定义：${evt.collectible}`);
  if(evt.photo && !has(STORY.photos, evt.photo)) err(`${label}.photo 未定义：${evt.photo}`);
  if(evt.music && !has(STORY.music, evt.music)) err(`${label}.music 未定义：${evt.music}`);
  if(evt.dream && !has(STORY.dreams, evt.dream)) err(`${label}.dream 未定义：${evt.dream}`);
  if(evt.moment && !has(STORY.moments, evt.moment)) err(`${label}.moment 未定义：${evt.moment}`);
  if(evt.ending && !has(STORY.endings, evt.ending)) err(`${label}.ending 未定义：${evt.ending}`);
  if(evt.groupId && !has(STORY.groups, evt.groupId)) err(`${label}.groupId 未定义：${evt.groupId}`);
  (evt.messages || []).forEach((m, i)=>{
    if(!m || typeof m !== 'object') return;
    if(m.from && !speakers.has(m.from)) err(`${label}.messages[${i}].from 角色非法：${m.from}`);
    if(m.then && !isEventRef(m.then)) err(`${label}.messages[${i}].then 引用了不存在的事件：${m.then}`);
    const opts = m.choice && Array.isArray(m.choice.options) ? m.choice.options : [];
    opts.forEach((o, j)=>{
      const target = o && (o.thenEvent || (o.effects && o.effects.thenEvent));
      if(target && !isEventRef(target)){
        err(`${label}.messages[${i}].choice.options[${j}] 的 thenEvent 不存在：${target}`);
      }
    });
  });
}

// ---------- 1. 事件与临界事件 ----------
Object.entries(STORY.events || {}).forEach(([id, evt]) => checkEventLike(`events.${id}`, evt));
Object.entries(STORY.criticalEvents || {}).forEach(([id, evt]) => checkEventLike(`criticalEvents.${id}`, evt));
Object.entries(STORY.events || {}).forEach(([id, evt]) => {
  if(!evt || typeof evt !== 'object') err(`events.${id} 不是有效对象`);
  else if(!evt.type) err(`events.${id} 缺少 type 字段`);
});

// ---------- 2. 路线选择 ----------
(STORY.routeChoice?.options || []).forEach((opt, i)=>{
  if(!['shenyan', 'luci', 'jiangyu', 'solo'].includes(opt.route)) err(`routeChoice.options[${i}].route 非法：${opt.route}`);
  if(opt.thenEvent && !isEventRef(opt.thenEvent)) err(`routeChoice.options[${i}].thenEvent 不存在：${opt.thenEvent}`);
});

// ---------- 3. 情报 / 邀约 / 群聊 / 闪回 ----------
Object.entries(STORY.intel || {}).forEach(([id, it])=>{
  if(it.then && !isEventRef(it.then)) err(`intel.${id}.then 不存在：${it.then}`);
});
Object.entries(STORY.invitations || {}).forEach(([id, inv])=>{
  ['acceptEvent', 'declineEvent', 'missEvent'].forEach(key=>{
    if(inv[key] && !isEventRef(inv[key])) err(`invitations.${id}.${key} 不存在：${inv[key]}`);
  });
  if(inv.location && !has(STORY.locations, inv.location)) err(`invitations.${id}.location 未定义：${inv.location}`);
});
Object.entries(STORY.groups || {}).forEach(([id, g])=>{
  if(g.createEvent && !isEventRef(g.createEvent)) err(`groups.${id}.createEvent 不存在：${g.createEvent}`);
  (g.members || []).forEach(m => { if(!cast.has(m)) err(`groups.${id}.members 角色非法：${m}`); });
});
Object.entries(STORY.flashbacks || {}).forEach(([id, fb])=>{
  if(fb.then && !isEventRef(fb.then)) err(`flashbacks.${id}.then 不存在：${fb.then}`);
  if(fb.reward?.photo && !has(STORY.photos, fb.reward.photo)) err(`flashbacks.${id}.reward.photo 未定义：${fb.reward.photo}`);
  if(fb.reward?.collectible && !has(STORY.collectibles, fb.reward.collectible)) err(`flashbacks.${id}.reward.collectible 未定义：${fb.reward.collectible}`);
  (fb.scenes || []).forEach((sc, i)=>{
    (sc?.choice?.options || []).forEach((o, j)=>{
      const target = o && (o.thenEvent || (o.effects && o.effects.thenEvent));
      if(target && !isEventRef(target)) err(`flashbacks.${id}.scenes[${i}].options[${j}] thenEvent 不存在：${target}`);
    });
  });
});

// ---------- 4. 地点 / 回忆 / 解谜 ----------
const encounterIds = new Set();
Object.entries(STORY.locations || {}).forEach(([locId, loc])=>{
  (loc.encounters || []).forEach(enc=>{
    if(!enc.id) err(`locations.${locId} 存在缺少 id 的偶遇`);
    else if(encounterIds.has(enc.id)) err(`偶遇 id 重复：${enc.id}`);
    else encounterIds.add(enc.id);
  });
});
Object.entries(STORY.memories || {}).forEach(([id, mem])=>{
  if(mem.triggerPhoto && !has(STORY.photos, mem.triggerPhoto)) err(`memories.${id}.triggerPhoto 未定义：${mem.triggerPhoto}`);
});
Object.entries(STORY.puzzles || {}).forEach(([id, p])=>{
  if(p.reward?.collectible && !has(STORY.collectibles, p.reward.collectible)) err(`puzzles.${id}.reward.collectible 未定义：${p.reward.collectible}`);
});

// ---------- 5. 结局 / 图鉴一致性 ----------
Object.keys(STORY.endings || {}).forEach(id=>{
  if(!has(STORY.endingGallery, id)) err(`结局 ${id} 缺少图鉴条目（endingGallery）`);
});
Object.entries(STORY.endingGallery || {}).forEach(([id, g])=>{
  if(!has(STORY.endings, id)) err(`图鉴条目 ${id} 没有对应结局定义（endings）`);
  if(g.id !== id) err(`图鉴 ${id} 的 id 字段不一致：${g.id}`);
});

// ---------- 6. 朋友圈 / 约会 / 梦魇 / 男主视角 ----------
Object.entries(STORY.moments || {}).forEach(([id, m])=>{
  if(m.author && !speakers.has(m.author)) err(`moments.${id}.author 角色非法：${m.author}`);
  (m.likes || []).forEach(c => { if(!speakers.has(c)) err(`moments.${id}.likes 角色非法：${c}`); });
  (m.comments || []).forEach((c, i) => { if(!speakers.has(c.from)) err(`moments.${id}.comments[${i}].from 角色非法：${c.from}`); });
});
Object.entries(STORY.momentComments?.byCategory || {}).forEach(([cat, byChar])=>{
  Object.keys(byChar || {}).forEach(cid => { if(!cast.has(cid)) err(`momentComments.byCategory.${cat} 角色非法：${cid}`); });
});
Object.entries(STORY.dateScenes || {}).forEach(([cid, scenes])=>{
  if(!cast.has(cid)) err(`dateScenes 角色非法：${cid}`);
  const ids = new Set();
  (scenes || []).forEach(sc=>{
    if(ids.has(sc.id)) err(`dateScenes.${cid} 场景 id 重复：${sc.id}`);
    ids.add(sc.id);
    if(sc.unlockPhoto && !has(STORY.photos, sc.unlockPhoto)) err(`dateScenes.${cid}.${sc.id}.unlockPhoto 未定义：${sc.unlockPhoto}`);
  });
});
Object.entries(STORY.nightmares || {}).forEach(([id, nm])=>{
  if(nm.moodAfter && !moodIds.has(nm.moodAfter)) err(`nightmares.${id}.moodAfter 心情未定义：${nm.moodAfter}`);
  (nm.resolve?.options || []).forEach((o, i)=>{
    if(o.moodAfter && !moodIds.has(o.moodAfter)) err(`nightmares.${id}.resolve.options[${i}].moodAfter 未定义：${o.moodAfter}`);
  });
});
Object.entries(STORY.malePerspectives || {}).forEach(([cid, mp])=>{
  const ids = new Set();
  (mp.scenes || []).forEach(sc=>{
    if(ids.has(sc.id)) err(`malePerspectives.${cid} 场景 id 重复：${sc.id}`);
    ids.add(sc.id);
  });
});

// ---------- 7. 关系阶段 / 主角问答 ----------
Object.entries(STORY.relationshipStages || {}).forEach(([cid, stages])=>{
  (stages || []).forEach(st=>{
    if(st.criticalEvent && !has(STORY.criticalEvents, st.criticalEvent)) err(`relationshipStages.${cid}.stage${st.stage} 的 criticalEvent 未定义：${st.criticalEvent}`);
  });
});
const quizIds = new Set();
(STORY.playerCustomization?.personalityQuiz || []).forEach(q=>{
  if(quizIds.has(q.id)) err(`personalityQuiz 题目 id 重复：${q.id}`);
  quizIds.add(q.id);
});

// ---------- 8. 全量深扫：effects 里的角色 / 性格维度 / 心情 ----------
function walk(node, at){
  if(!node || typeof node !== 'object') return;
  if(Array.isArray(node)){ node.forEach((v, i) => walk(v, `${at}[${i}]`)); return; }
  for(const [k, v] of Object.entries(node)){
    const p = `${at}.${k}`;
    if(['affection', 'affectionOnDecline', 'affectionOnMiss'].includes(k) && v && typeof v === 'object'){
      // 只把「数值型」的条目当作好感度；避免把 watchMode.strategies.affection 这类同名配置误判
      Object.entries(v).forEach(([cid, val]) => { if(typeof val === 'number' && !affIds.has(cid)) err(`${p} 角色非法：${cid}`); });
    }
    if(k === 'affectionDetail' && v && typeof v === 'object'){
      Object.entries(v).forEach(([cid, val]) => {
        const isDetail = val && typeof val === 'object'
          && ['closeness', 'trust', 'tension'].some(dim => typeof val[dim] === 'number');
        if(isDetail && !affDetailIds.has(cid)) err(`${p} 角色非法：${cid}`);
      });
    }
    if(k === 'personality' && v && typeof v === 'object'){
      Object.entries(v).forEach(([dim, val]) => { if(typeof val === 'number' && !personalityIds.has(dim)) err(`${p} 性格维度非法：${dim}`); });
    }
    if((k === 'mood' || k === 'moodAfter') && typeof v === 'string' && !moodIds.has(v)) err(`${p} 心情未定义：${v}`);
    walk(v, p);
  }
}
walk(STORY, 'STORY');
Object.keys(STORY.moodEffects || {}).forEach(id => { if(!moodIds.has(id)) err(`moodEffects.${id} 心情未定义`); });

// ---------- 9. 收集品获取路径（警告级） ----------
const grants = new Map();  // collectible -> [来源]
const addGrant = (id, src) => { if(!grants.has(id)) grants.set(id, []); grants.get(id).push(src); };
Object.entries(STORY.events || {}).forEach(([id, evt]) => { if(evt.collectible) addGrant(evt.collectible, `events.${id}`); });
Object.entries(STORY.puzzles || {}).forEach(([id, p]) => { if(p.reward?.collectible) addGrant(p.reward.collectible, `puzzles.${id}`); });
Object.entries(STORY.seasons?.holidays || {}).forEach(([day, h]) => { if(h.effect?.collectible) addGrant(h.effect.collectible, `holidays.${day}`); });
(STORY.dailyTasks?.streakRewards || []).forEach(r => { if(r.reward?.collectible) addGrant(r.reward.collectible, `streakRewards.${r.days}天`); });
// 引擎代码里硬编码的发放路径（stamp_route / recording_msg 等）
const engineText = fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8');
for(const m of engineText.matchAll(/collectItem\('([^']+)'\)/g)) addGrant(m[1], 'engine.js');
Object.keys(STORY.collectibles || {}).forEach(id=>{
  const sources = grants.get(id) || [];
  if(!sources.length) warn(`收集品「${id}」没有任何获取路径`);
  else if(sources.length > 1) warn(`收集品「${id}」有多条获取路径：${sources.join('、')}`);
});

// ---------- 10. flag 读写一致性（警告级） ----------
const appText = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const allText = fs.readFileSync(path.join(__dirname, 'story.js'), 'utf8') + engineText + appText;
const flagReaders = new Set();
for(const m of allText.matchAll(/(?:state|s|self)\.flags\.([A-Za-z_][A-Za-z0-9_]*)/g)) flagReaders.add(m[1]);
for(const m of allText.matchAll(/\bflags\[([^\]]+)\]/g)){
  const key = m[1].trim();
  if(/^['"][A-Za-z_][A-Za-z0-9_]*['"]$/.test(key)) flagReaders.add(key.slice(1, -1));
}
const flagWriters = new Set();
// 剧情数据中的写入点：effects.flags / reward.flag / effect.flag / moodEffects[].flag
function collectFlagWriters(node){
  if(!node || typeof node !== 'object') return;
  if(Array.isArray(node)){ node.forEach(collectFlagWriters); return; }
  for(const [k, v] of Object.entries(node)){
    if(k === 'flags' && v && typeof v === 'object') Object.keys(v).forEach(f => flagWriters.add(f));
    if(k === 'flag' && typeof v === 'string') flagWriters.add(v);
    collectFlagWriters(v);
  }
}
collectFlagWriters(STORY);
// 引擎与 UI 代码中的直接赋值
for(const m of engineText.matchAll(/state\.flags\.([A-Za-z_][A-Za-z0-9_]*)\s*=[^=]/g)) flagWriters.add(m[1]);
for(const m of engineText.matchAll(/flags\.([A-Za-z_][A-Za-z0-9_]*)\s*=[^=]/g)) flagWriters.add(m[1]);
// 动态键写入（如 flags['group_created_'+id] = true）：收集其中的字面量前缀/后缀，
// 避免把 group_created_group_neon 这类"由引擎拼接写入"的 flag 误判为无写入点
const dynamicFlagParts = [];
for(const m of (engineText + appText).matchAll(/\bflags\[([^\]]+)\]\s*=(?!=)/g)){
  for(const lit of m[1].matchAll(/'([^']*)'|"([^"]*)"/g)){
    const text = lit[1] !== undefined ? lit[1] : lit[2];
    if(text && text.length >= 3) dynamicFlagParts.push(text);
  }
}
const dynamicFlags = new Set(['followup_triggered']);  // 引擎运行时写入的已知 flag
flagReaders.forEach(f=>{
  if(flagWriters.has(f) || dynamicFlags.has(f)) return;
  if(dynamicFlagParts.some(part => f.startsWith(part) || f.endsWith(part))) return;
  warn(`flag「${f}」被读取但没有任何写入点`);
});

// ---------- 输出 ----------
console.log(`=== 剧情数据校验 ===`);
console.log(`事件 ${Object.keys(STORY.events || {}).length} 条 · 临界事件 ${Object.keys(STORY.criticalEvents || {}).length} 条 · 结局 ${Object.keys(STORY.endings || {}).length} 个 · 收集品 ${Object.keys(STORY.collectibles || {}).length} 件`);
if(errors.length){
  console.error(`\n错误 ${errors.length} 条：`);
  errors.slice(0, 60).forEach(e => console.error(`  ✗ ${e}`));
  if(errors.length > 60) console.error(`  …… 其余 ${errors.length - 60} 条省略`);
}
if(warnings.length){
  console.log(`\n警告 ${warnings.length} 条（不拦截）：`);
  warnings.slice(0, 40).forEach(w => console.log(`  ! ${w}`));
  if(warnings.length > 40) console.log(`  …… 其余 ${warnings.length - 40} 条省略`);
}
if(errors.length){
  console.error(`\n剧情数据校验失败：请修正以上错误后重试。`);
  process.exit(1);
}
console.log(`\n剧情数据校验通过（错误 0 条，警告 ${warnings.length} 条）。`);