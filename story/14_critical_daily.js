/* ===== 霓虹心事 · 剧情数据：临界事件、每日任务与观赏模式 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// 临界事件：进入新阶段时触发的特殊事件
STORY.criticalEvents = {
  shenyan_critical_3: {
    id:'shenyan_critical_3', charId:'shenyan', stage:3,
    type:'message_batch', delay:1,
    messages:[
      { from:'shenyan', text:'林夏。我有些话，想当面跟你说。', then:'shenyan_critical_3_2' }
    ]
  },
  shenyan_critical_3_2: {
    type:'message_batch', delay:0,
    messages:[
      { from:'shenyan', text:'明天有空吗。', choice:{
        prompt:'沈砚之想约你。',
        options:[
          { text:'有。', effects:{ affection:{shenyan:1}, flags:{shenyan_critical_3_accepted:true}, thenEvent:'shenyan_critical_3_reply_yes' }, hint:'沈砚之 +1' },
          { text:'最近有点忙…', effects:{ affection:{shenyan:0}, thenEvent:'shenyan_critical_3_reply_no' }, hint:'他会等你' }
        ]
      }}
    ]
  },
  shenyan_critical_3_reply_yes: {
    type:'message_batch', delay:1,
    messages:[
      { from:'shenyan', text:'明天，办公室。', then:'shenyan_critical_3_reply_yes_2' }
    ]
  },
  shenyan_critical_3_reply_yes_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'shenyan', text:'……谢谢。有些话，我憋了很久。' }]
  },
  shenyan_critical_3_reply_no: {
    type:'message_batch', delay:1,
    messages:[
      { from:'shenyan', text:'好。那就改天。', then:'shenyan_critical_3_reply_no_2' }
    ]
  },
  shenyan_critical_3_reply_no_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'shenyan', text:'我不催你。但我会记得，你欠我一次。' }]
  },
  luci_critical_3: {
    id:'luci_critical_3', charId:'luci', stage:3,
    type:'message_batch', delay:1,
    messages:[
      { from:'luci', text:'林夏，周末有空吗？带你去一个地方。', then:'luci_critical_3_2' }
    ]
  },
  luci_critical_3_2: {
    type:'message_batch', delay:0,
    messages:[
      { from:'luci', text:'是我们以前的学校。九年了，我想带你回去看看。', choice:{
        prompt:'陆辞想带你去旧学校。',
        options:[
          { text:'好。', effects:{ affection:{luci:1}, flags:{luci_critical_3_accepted:true}, thenEvent:'luci_critical_3_reply_yes' }, hint:'陆辞 +1' },
          { text:'现在…还不行。', effects:{ affection:{luci:0}, thenEvent:'luci_critical_3_reply_no' }, hint:'他会等你准备好' }
        ]
      }}
    ]
  },
  luci_critical_3_reply_yes: {
    type:'message_batch', delay:1,
    messages:[
      { from:'luci', text:'说定了！明天下午三点，校门口见。', then:'luci_critical_3_reply_yes_2' }
    ]
  },
  luci_critical_3_reply_yes_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'luci', text:'带双舒服的鞋。要走很多路——我想带你看完每一处。' }]
  },
  luci_critical_3_reply_no: {
    type:'message_batch', delay:1,
    messages:[
      { from:'luci', text:'没事。我等。', then:'luci_critical_3_reply_no_2' }
    ]
  },
  luci_critical_3_reply_no_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'luci', text:'九年都等了，不差这几天。' }]
  },
  jiangyu_critical_3: {
    id:'jiangyu_critical_3', charId:'jiangyu', stage:3,
    type:'message_batch', delay:1,
    messages:[
      { from:'jiangyu', text:'今晚雾港，有我新歌的首唱。', then:'jiangyu_critical_3_2' }
    ]
  },
  jiangyu_critical_3_2: {
    type:'message_batch', delay:0,
    messages:[
      { from:'jiangyu', text:'你来吗。', choice:{
        prompt:'江屿邀请你听首唱。',
        options:[
          { text:'去。', effects:{ affection:{jiangyu:1}, flags:{jiangyu_critical_3_accepted:true}, thenEvent:'jiangyu_critical_3_reply_yes' }, hint:'江屿 +1' },
          { text:'今晚有事…', effects:{ affection:{jiangyu:0}, thenEvent:'jiangyu_critical_3_reply_no' }, hint:'他会等你下次' }
        ]
      }}
    ]
  },
  jiangyu_critical_3_reply_yes: {
    type:'message_batch', delay:1,
    messages:[
      { from:'jiangyu', text:'……好。位置我留着。', then:'jiangyu_critical_3_reply_yes_2' }
    ]
  },
  jiangyu_critical_3_reply_yes_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'jiangyu', text:'第一排。只有你一个位子。' }]
  },
  jiangyu_critical_3_reply_no: {
    type:'message_batch', delay:1,
    messages:[
      { from:'jiangyu', text:'……好。', then:'jiangyu_critical_3_reply_no_2' }
    ]
  },
  jiangyu_critical_3_reply_no_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'jiangyu', text:'歌会留着。等你哪天想听。' }]
  }
};


// ===== v0.0.13 每日任务+连胜奖励 =====
STORY.dailyTasks = {
  // 任务模板池：每日随机抽 3 个
  pool: [
    { id:'task_reply',    name:'今日回复',     desc:'回复任意一位男主的消息',     check: s => Object.values(s.conversations||{}).some(c=>c.messages.some(m=>m.from==='me' && m.day===s.lastTaskDay)), reward:{coins:30} },
    { id:'task_tarot',    name:'今日占卜',     desc:'抽一次塔罗',                 check: s => s.lastTarotDay === s.lastTaskDay, reward:{coins:20} },
    { id:'task_gift',     name:'今日送礼',     desc:'给任意一位男主送一份礼物',   check: s => (s.gifts||[]).some(g=>g.day === s.lastTaskDay), reward:{coins:50} },
    { id:'task_mood',     name:'今日心情',     desc:'切换一次心情',               check: s => (s.moodHistory||[]).some(m=>m.day === s.lastTaskDay), reward:{coins:15} },
    { id:'task_diary',    name:'今日独白',     desc:'写一段内心独白',             check: s => (s.diary||[]).some(d=>d.day === s.lastTaskDay), reward:{coins:25} },
    { id:'task_moment',   name:'今日动态',     desc:'发一条朋友圈',               check: s => (s.moments||[]).some(m=>m.author==='me' && m.day===s.lastTaskDay), reward:{coins:35} },
    { id:'task_explore',  name:'今日出行',     desc:'前往一个新地点',             check: s => (s.locationVisits||[]).some(v=>v.day===s.lastTaskDay), reward:{coins:40} },
    { id:'task_call',     name:'今日通话',     desc:'接听或拨出一次电话',         check: s => (s.callLog||[]).some(c=>c.day === s.lastTaskDay), reward:{coins:30} },
    { id:'task_puzzle',   name:'今日解谜',     desc:'尝试解开一个谜题',           check: s => Object.values(s.puzzleProgress||{}).some(p=>p.lastAttemptDay === s.lastTaskDay), reward:{coins:45} }
  ],
  // 连胜奖励：连续 N 天完成所有任务
  // v0.1.7: 连胜奖励改为金币——收集品由剧情节点唯一发放（postcard_neon/stamp_first/ticket_bar 去重）
  streakRewards: [
    { days:3,  reward:{ coins:200 },          name:'三日连胜', desc:'连续3天完成所有日常' },
    { days:7,  reward:{ coins:600 },          name:'七日连胜', desc:'连续7天完成所有日常' },
    { days:14, reward:{ coins:800, flag:'streak_master' }, name:'半月连胜', desc:'连续14天完成所有日常' }
  ]
};


// ===== v0.0.13 观赏模式+自动推进 =====
STORY.watchMode = {
  // 观赏模式下的默认选择策略
  strategies: {
    balanced:   { id:'balanced',   name:'平衡',   desc:'均衡选择，体验完整剧情',     pick: opts => Math.floor(opts.length / 2) },
    affection:  { id:'affection',  name:'好感优先', desc:'优先选择好感度+最高的选项',  pick: opts => {
      let best = 0, bestIdx = 0;
      opts.forEach((o, i) => {
        const aff = (o.effects?.affection && Object.values(o.effects.affection).reduce((a,b)=>a+b,0)) || 0;
        if(aff > best){ best = aff; bestIdx = i; }
      });
      return bestIdx;
    }},
    rational:   { id:'rational',   name:'理性',   desc:'优先选择理性/独立型选项',     pick: opts => {
      let best = -1, bestIdx = 0;
      opts.forEach((o, i) => {
        const p = o.effects?.personality || {};
        const score = (p.rational||0) + (p.independent||0);
        if(score > best){ best = score; bestIdx = i; }
      });
      return bestIdx;
    }},
    emotional:  { id:'emotional',  name:'感性',   desc:'优先选择感性/情感型选项',     pick: opts => {
      let best = -1, bestIdx = 0;
      opts.forEach((o, i) => {
        const p = o.effects?.personality || {};
        const score = (p.emotional||0) + (p.dependent||0);
        if(score > best){ best = score; bestIdx = i; }
      });
      return bestIdx;
    }},
    random:     { id:'random',     name:'随机',   desc:'完全随机选择，体验不同结局',  pick: opts => Math.floor(Math.random() * opts.length) }
  },
  // 自动推进间隔（毫秒）
  autoAdvanceDelay: 1500,
  // 观赏模式下是否自动抽塔罗/写日记等日常
  autoDoDaily: true
};
