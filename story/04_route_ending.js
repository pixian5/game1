/* ===== 霓虹心事 · 剧情数据：路线选择、结局图鉴、真结局条件与结局判定函数 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// 路线选择数据（由 engine.chooseRoute 触发对应 thenEvent）
STORY.routeChoice = {
  prompt:'夜深了。你决定先回谁的消息？这将决定你的心属于谁。',
  options:[
    {text:'回沈砚之', route:'shenyan', thenEvent:'route_shenyan_start', hint:'进入沈砚之线'},
    {text:'回陆辞', route:'luci', thenEvent:'route_luci_start', hint:'进入陆辞线'},
    {text:'回江屿', route:'jiangyu', thenEvent:'route_jiangyu_start', hint:'进入江屿线'},
    {text:'谁都不回', route:'solo', thenEvent:'route_solo_start', hint:'进入真结局线'}
  ]
};


// ===== v0.0.15 结局图鉴 + 多分支 =====
// 结局分级：GOOD(HE) / NORMAL(NE) / BAD(BE) / HIDDEN(隐藏)
STORY.endingGallery = {
  // 沈砚之线
  shenyan_good:    { id:'shenyan_good',    charId:'shenyan', tier:'GOOD',    name:'月光画室',     desc:'他终于让你走进他的私人画室。那幅画，画了五年，画的是你。' },
  shenyan_normal:  { id:'shenyan_normal',  charId:'shenyan', tier:'NORMAL',  name:'画框之外',     desc:'你们成为工作上的最佳搭档。画框外的事，他没说，你也没问。' },
  shenyan_bad:     { id:'shenyan_bad',     charId:'shenyan', tier:'BAD',     name:'未完成的画',   desc:'画被收起来了。他说，下次再画。但你们都知道没有下次。' },
  shenyan_hidden:  { id:'shenyan_hidden',  charId:'shenyan', tier:'HIDDEN',  name:'五年前的她',   desc:'(隐藏) 他在画室里发现一张五年前的旧画，画的是另一个女孩。' },
  // 陆辞线
  luci_good:       { id:'luci_good',       charId:'luci',    tier:'GOOD',    name:'暗房显影',     desc:'九年又一百八十二天。他终于把那句话对你说了。' },
  luci_normal:     { id:'luci_normal',     charId:'luci',    tier:'NORMAL',  name:'镜头之外',     desc:'你们成为最默契的拍摄搭档。镜头之外的关系，没人挑明。' },
  luci_bad:        { id:'luci_bad',        charId:'luci',    tier:'BAD',     name:'未寄出的信',   desc:'那封信他最终没寄出。九年又一百八十二天，成了永远。' },
  luci_hidden:     { id:'luci_hidden',     charId:'luci',    tier:'HIDDEN',  name:'B面歌词',     desc:'(隐藏) 他在《夏》B面写了一首从未公开的歌，唱的是另一个林夏。' },
  // 江屿线
  jiangyu_good:    { id:'jiangyu_good',    charId:'jiangyu', tier:'GOOD',    name:'《夏》首唱',   desc:'这首歌，是为了等你而写的。B面那首，他只唱给你听。' },
  jiangyu_normal:  { id:'jiangyu_normal',  charId:'jiangyu', tier:'NORMAL',  name:'雾港常客',     desc:'你成了雾港的常客。他的歌单里，总有一首没唱完。' },
  jiangyu_bad:     { id:'jiangyu_bad',     charId:'jiangyu', tier:'BAD',     name:'空白B面',     desc:'B面永远是空白。他说，那首歌不唱了。' },
  jiangyu_hidden:  { id:'jiangyu_hidden',  charId:'jiangyu', tier:'HIDDEN',  name:'夏的另一面',   desc:'(隐藏) 《夏》的原版歌词里，"林夏"其实是两个人。' },
  // solo 线
  solo_good:       { id:'solo_good',       charId:null,      tier:'GOOD',    name:'霓城独行',     desc:'你谁也没选。霓城的夜，依然为你亮着。' },
  solo_normal:     { id:'solo_normal',     charId:null,      tier:'NORMAL',  name:'独立策展人',   desc:'你成了霓城最年轻的独立策展人。' },
  solo_bad:        { id:'solo_bad',        charId:null,      tier:'BAD',     name:'空房间',       desc:'你谁也没选。霓城的灯一盏盏熄了。' },
  solo_hidden:     { id:'solo_hidden',     charId:null,      tier:'HIDDEN',  name:'第四种可能',   desc:'(隐藏) 你发现自己也是某个故事的主角，不是任何人的配角。' },
  true_ending:     { id:'true_ending',     charId:null,      tier:'HIDDEN',  name:'霓城无事',     desc:'(隐藏) 你完成独立策展，也完整地成为了自己。' }
};

// 真结局解锁条件：成就数 ≥ 8 且路线为 solo
STORY.trueEndingUnlockCondition = s => {
  const total = Object.keys(STORY.achievements).length;
  const unlocked = Object.keys(s.achievements||{}).length;
  return unlocked >= Math.ceil(total * 0.6) && s.route === 'solo';
};

// 结局判定函数：根据多维 flag 聚合计算实际 endingId
STORY.computeEnding = function(state, route){
  if(!route) return null;  // 未进入任何路线
  if(route === 'solo'){
    if(STORY.trueEndingUnlockCondition?.(state)) return 'true_ending';
    // v0.1.7: 移除从未写入的备用 flag _solo_hidden；新增性格路线——高度独立（≥12）也能解锁隐藏结局
    if((state.collected||[]).length >= 10 || (state.personality?.independent || 0) >= 12) return 'solo_hidden';
    if(state.flags.solo_independent) return 'solo_good';
    if(state.flags.solo_accept) return 'solo_normal';
    return 'solo_bad';
  }
  const flags = state.flags || {};
  const endingChoice = {shenyan:['shenyan_choice','confront','endure'], luci:['luci_choice','accept','miss'], jiangyu:['jiangyu_choice','stay','leave']}[route];
  if(!endingChoice) return null;
  const [choiceKey, goodChoice, badChoice] = endingChoice;
  const hiddenRequired = {shenyan:'memento_pen',luci:'evidence_letter',jiangyu:'evidence_lyrics'}[route];
  // v0.1.8: 数值闭环——选了好结局分支且该线好感 ≥15，也能解锁隐藏结局（与隐藏收集品二选一，只增不拦）
  if(flags['_' + route + '_hidden'] || (flags[choiceKey] === goodChoice && ((state.collected||[]).includes(hiddenRequired) || (state.affection?.[route] || 0) >= 15))) return route + '_hidden';
  const positives = {shenyan:['shenyan_resist','shenyan_awaken'],luci:['luci_confess','luci_stop','luci_chase'],jiangyu:['jiangyu_hold','jiangyu_stand']}[route];
  const negatives = {shenyan:['shenyan_obey','shenyan_deny'],luci:['luci_avoid','luci_letgo','luci_giveup'],jiangyu:['jiangyu_leave','jiangyu_silent']}[route];
  const goodCount = positives.filter(key=>flags[key]).length;
  const badCount = negatives.filter(key=>flags[key]).length;
  if(flags[choiceKey] === goodChoice && goodCount > badCount) return route + '_good';
  if(flags[choiceKey] === badChoice && badCount >= goodCount) return route + '_bad';
  return route + '_normal';
};
