/* ===== 霓虹心事 · 剧情数据：塔罗、成就、彩蛋成就 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */


// ===== 塔罗占卜+每日运势 =====
STORY.tarot = {
  // 22张大阿尔卡那精选（节选）
  cards: {
    fool:        { id:'fool',        name:'愚者',     roman:'0',    upright:'今日宜出发。一个看似冲动的决定，会带来意料之外的相遇。', reversed:'警惕鲁莽。今天的"自由"可能是逃避的借口。', hint:{type:'encounter', value:1} },
    magician:    { id:'magician',    name:'魔术师',   roman:'I',    upright:'今日宜主动表达。你有让对方意外的能力。', reversed:'警惕花言巧语。今天听到的承诺，要打个问号。', hint:{type:'affection', value:1} },
    high_priestess:{ id:'high_priestess', name:'女祭司', roman:'II', upright:'今日宜独处。答案藏在安静里。', reversed:'警惕隐瞒。有秘密正在被遮盖。', hint:{type:'memory', value:1} },
    empress:     { id:'empress',     name:'女皇',     roman:'III',  upright:'今日宜温柔。被你温柔以待的人，会记很久。', reversed:'警惕溺爱。过度的包容也是另一种控制。', hint:{type:'affection', value:0.5} },
    emperor:     { id:'emperor',     name:'皇帝',     roman:'IV',   upright:'今日宜坚持。你的原则比想象中重要。', reversed:'警惕强势。把别人按在你的剧本里，会失去他们。', hint:{type:'rational', value:1} },
    lovers:      { id:'lovers',      name:'恋人',     roman:'VI',   upright:'今日宜面对心动。回避比拒绝更伤人。', reversed:'警惕摇摆。三心二意会一无所获。', hint:{type:'affection', value:1.5} },
    chariot:     { id:'chariot',     name:'战车',     roman:'VII',  upright:'今日宜行动。想见的人，就去见。', reversed:'警惕冲动。冲得太快，会错过细节。', hint:{type:'encounter', value:1} },
    hermit:      { id:'hermit',      name:'隐者',     roman:'IX',   upright:'今日宜独行。一个人走，也能走到很远。', reversed:'警惕封闭。一个人久了，会忘了被牵手的温度。', hint:{type:'independent', value:1} },
    wheel:       { id:'wheel',       name:'命运之轮', roman:'X',    upright:'今日宜顺应。转折会自己来，不必硬推。', reversed:'警惕侥幸。运气不会替你做选择。', hint:{type:'luck', value:1} },
    justice:     { id:'justice',     name:'正义',     roman:'XI',   upright:'今日宜诚实。谎话今晚就会反噬。', reversed:'警惕双重标准。你想要的公平，不一定是别人的。', hint:{type:'rational', value:1.5} },
    hanged_man:  { id:'hanged_man',  name:'倒吊人',   roman:'XII',  upright:'今日宜换角度看。难受的位置，看得到不一样的真相。', reversed:'警惕牺牲感。你付出的，不一定是对方需要的。', hint:{type:'memory', value:1} },
    death:       { id:'death',       name:'死神',     roman:'XIII', upright:'今日宜告别。有些东西必须结束，新的才会开始。', reversed:'警惕拖延。不愿结束的关系，会比结束更痛。', hint:{type:'ending_hint', value:1} },
    star:        { id:'star',        name:'星星',     roman:'XVII', upright:'今日宜相信。你等的那束光，正在路上。', reversed:'警惕空洞的期待。希望也需要落地。', hint:{type:'luck', value:1.5} },
    moon:        { id:'moon',        name:'月亮',     roman:'XVIII',upright:'今日宜留意梦。梦在替你说白天不敢说的话。', reversed:'警惕幻觉。你以为看见的，可能只是你想看见的。', hint:{type:'dream', value:1} },
    sun:         { id:'sun',         name:'太阳',     roman:'XIX',  upright:'今日宜真诚地笑。你笑起来，比那幅画好看。', reversed:'警惕强颜欢笑。撑不住的时候，可以不笑。', hint:{type:'affection', value:1} },
    world:       { id:'world',       name:'世界',     roman:'XXI',  upright:'今日宜完成。一件未完成的事，今天可以画上句号。', reversed:'警惕半途而废。终点比起点更需要耐心。', hint:{type:'ending_hint', value:1.5} }
  }
};


// ===== 成就系统+真结局解锁 =====
STORY.achievements = {
  // 对话类
  first_reply:   { id:'first_reply',   name:'初次回应',     icon:'💬', desc:'第一次回复男主消息', condition: s => Object.values(s.conversations).some(c=>c.messages.some(m=>m.from==='me')) },
  perfect_listen:{ id:'perfect_listen',name:'完美倾听者',   icon:'👂', desc:'听完3次电话通话', condition: s => (s.callLog||[]).filter(c=>c.type==='incoming').length >= 3 },
  no_reply:      { id:'no_reply',      name:'已读不回',     icon:'😶', desc:'让一个男主等待回复超过30秒', condition: s => s.flags.followup_triggered === true },
  // 社交类
  moment_star:   { id:'moment_star',   name:'动态之星',     icon:'🌟', desc:'发动态并收到角色互动', condition: s => s.moments.filter(m=>m.author==='me' && (m.likes||[]).length >= 1).length >= 1 },
  group_active:  { id:'group_active',  name:'群聊活跃',     icon:'👥', desc:'在群聊里发过消息', condition: s => {
    let cnt = 0;
    for(const gid in s.groups){ cnt += (s.groups[gid].messages||[]).filter(m=>m.from==='me').length; }
    return cnt >= 1;
  }},
  // 探索类
  explorer:      { id:'explorer',      name:'霓城漫游人',   icon:'🗺️', desc:'前往过所有地点', condition: s => s.flags.visited_all_locations === true },
  memory_keeper: { id:'memory_keeper', name:'记忆收藏家',   icon:'🖼️', desc:'解锁3张以上相册照片', condition: s => s.photos.length >= 3 },
  dream_walker:  { id:'dream_walker',  name:'梦境行者',     icon:'🌙', desc:'收集3个以上梦境碎片', condition: s => s.dreamShards.length >= 3 },
  tarot_believer:{ id:'tarot_believer',name:'占卜信徒',     icon:'🔮', desc:'连续3天抽塔罗', condition: s => {
    const days = new Set((s.tarotHistory||[]).map(t=>t.day).filter(Number.isFinite));
    const end = Math.max(...days, -Infinity);
    return Number.isFinite(end) && [end, end-1, end-2].every(day=>days.has(day));
  }},
  gift_giver:    { id:'gift_giver',    name:'心意传递',     icon:'🎁', desc:'送出第一份礼物', condition: s => (s.gifts||[]).length >= 1 },
  mood_explorer: { id:'mood_explorer', name:'情绪光谱',     icon:'🎭', desc:'体验过4种以上不同心情', condition: s => {
    const set = new Set((s.moodHistory||[]).map(m=>m.mood));
    return set.size >= 4;
  }},
  // 剧情类
  flashback_seen:{ id:'flashback_seen',name:'回望那年',   icon:'⏳', desc:'触发闪回/前传章节', condition: s => Object.keys(s.flashbacksSeen||{}).length >= 1 },
  invitation_accepted:{ id:'invitation_accepted', name:'赴约之人', icon:'💌', desc:'接受过一次邀约', condition: s => Object.values(s.resolvedInvitations||{}).some(v=>v==='accepted') },
  // 隐藏成就
  three_routes:  { id:'three_routes',  name:'心三向',       icon:'💗', desc:'(隐藏) 同时被三位男主的好感度推到5以上', condition: s => s.affection.shenyan>=5 && s.affection.luci>=5 && s.affection.jiangyu>=5 },
  solo_path:     { id:'solo_path',     name:'独行侠',       icon:'🌑', desc:'(隐藏) 选择"谁都不回"路线', condition: s => s.route === 'solo' }
};


// 隐藏彩蛋：满足特定条件触发
STORY.easterEggs = {
  egg_midnight:    { id:'egg_midnight',    name:'深夜来电',     icon:'🌙', desc:'凌晨3点还在和某个人通话，霓城的夜，比想象的深。', condition: s => Object.keys(s.callLog||{}).length >= 3 && s.flags.midnight_call === true },
  egg_three_hearts:{ id:'egg_three_hearts',name:'三心一意',     icon:'💗', desc:'同一晚让三个男主都为你失眠。', condition: s => s.affection.shenyan>=3 && s.affection.luci>=3 && s.affection.jiangyu>=3 },
  egg_ghost_msg:   { id:'egg_ghost_msg',   name:'幽灵消息',     icon:'👻', desc:'收到一条来自五年前的消息。', condition: s => s.flags.ghost_msg_triggered === true },
  egg_diary_7:     { id:'egg_diary_7',     name:'七天日记',     icon:'📖', desc:'连续七天写内心独白，霓城开始听你的话。', condition: s => (s.diary||[]).length >= 7 },
  egg_tarot_world: { id:'egg_tarot_world', name:'命运之轮',     icon:'☸️', desc:'抽到"世界"牌的那一天，你做出了某个决定。', condition: s => (s.tarotHistory||[]).some(t=>t.cardId==='world') },
  egg_solo_route:  { id:'egg_solo_route',  name:'独行侠',       icon:'🌑', desc:'不依附任何一条路线，走完了霓城。', condition: s => s.route === 'solo' },
  egg_gift_all:    { id:'egg_gift_all',    name:'心意传递',     icon:'🎁', desc:'给三位男主各送出一份礼物。', condition: s => {
    const recipients = new Set((s.gifts||[]).map(g=>g.to));
    return recipients.has('shenyan') && recipients.has('luci') && recipients.has('jiangyu');
  }},
  egg_collector:   { id:'egg_collector',   name:'霓城收藏家',   icon:'🏆', desc:'集齐10件以上收集品。', condition: s => (s.collected||[]).length >= 10 }
};
