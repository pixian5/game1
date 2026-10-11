/* ===== 霓虹心事 · 剧情数据：约会场景与梦魇 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */


// ===== v0.0.15 每日约会小剧场 =====
// 每位男主每周可约会1次（state.day % 7 === 0 时刷新）
// 约会完成后小事件影响三轴好感 + 解锁照片
STORY.dateScenes = {
  shenyan: [
    { id:'date_shenyan_tea',     name:'午后茶会',   desc:'沈砚之带你去美术馆旁的茶室',     effects:{affectionDetail:{shenyan:{closeness:3,trust:2}}},  unlockPhoto:null,        dialogue:[
      {who:'him', text:'茶室很安静。我喜欢这里。'},
      {who:'me',  text:'比美术馆舒服多了。'},
      {who:'him', text:'……难得听你说这种话。'},
      {who:'him', text:'下次，可以常来。'}
    ]},
    { id:'date_shenyan_studio',  name:'画室参观',   desc:'他破例让你看他未完成的画',       effects:{affectionDetail:{shenyan:{trust:4,tension:2}}},   unlockPhoto:'shenyan_studio', dialogue:[
      {who:'him', text:'这幅画，画了五年。'},
      {who:'me',  text:'画的是……'},
      {who:'him', text:'是你。'},
      {who:'him', text:'从你来的第一天开始。'}
    ]}
  ],
  luci: [
    { id:'date_luci_rooftop',    name:'旧楼天台',   desc:'陆辞带你去他高中的天台',         effects:{affectionDetail:{luci:{closeness:3,tension:2}}},   unlockPhoto:null,        dialogue:[
      {who:'him', text:'这里，我高中每天都来。'},
      {who:'me',  text:'九年没回来过？'},
      {who:'him', text:'直到今天，才敢带人来。'},
      {who:'him', text:'……谢谢你愿意跟我来。'}
    ]},
    { id:'date_luci_darkroom',   name:'暗房显影',   desc:'他让你进暗房看显影的过程',       effects:{affectionDetail:{luci:{trust:3,tension:3}}},      unlockPhoto:'luci_school', dialogue:[
      {who:'him', text:'红光下，照片慢慢显出来。'},
      {who:'me',  text:'这张……是我？'},
      {who:'him', text:'你笑起来，比那幅画好看多了。'},
      {who:'him', text:'原来这话，我九年前就想说。'}
    ]}
  ],
  jiangyu: [
    { id:'date_jiangyu_sea',     name:'深夜看海',   desc:'江屿骑车带你去看霓城的海',       effects:{affectionDetail:{jiangyu:{closeness:3,tension:3}}}, unlockPhoto:null,        dialogue:[
      {who:'him', text:'海的声音，比酒吧安静。'},
      {who:'me',  text:'你怎么知道我想来。'},
      {who:'him', text:'……不知道。只是觉得，你今天累。'},
      {who:'him', text:'累的时候，适合看海。'}
    ]},
    { id:'date_jiangyu_rehearsal', name:'排练室',   desc:'他让你听他独自排练《夏》',       effects:{affectionDetail:{jiangyu:{trust:3,tension:3}}},   unlockPhoto:null,        dialogue:[
      {who:'him', text:'这首歌，从来没在人前唱过。'},
      {who:'me',  text:'为什么今天唱给我？'},
      {who:'him', text:'……因为是你。'},
      {who:'him', text:'因为这首歌，本来就是要唱给你听的。'}
    ]}
  ]
};

// 约会冷却：每周1次（每7天）
STORY.dateCooldownDays = 7;


// ===== v0.0.16 梦魇系统 =====
// 当任一男主三轴合计过低（<5）且 tension=0 时，夜晚触发梦魇
// 梦魇影响次日心情：随机扣 1-2 点某项 personality，并标记 flags.nightmare_seen_X
STORY.nightmares = {
  nightmare_lonely: {
    id:'nightmare_lonely',
    name:'空房间的回音',
    desc:'梦里你一个人站在空旷的房间，三道门都关着。每扇门后都有一个声音叫你，但你推不开任何一扇。',
    trigger: s => {
      // 任一男主 tension=0 且 closeness<3
      return ['shenyan','luci','jiangyu'].some(cid => {
        const ad = s.affectionDetail?.[cid];
        return ad && ad.tension === 0 && ad.closeness < 3;
      });
    },
    effects: { personality: {passive:1, emotional:1}, flags: {nightmare_seen_lonely:1} },
    moodAfter: 'anxious',
    dialogue: [
      {who:'narrator', text:'（夜很深。你做了个梦。）'},
      {who:'me', text:'……有人吗？'},
      {who:'narrator', text:'（三道门，三种声音，都听不真切。你醒了，冷汗未干。）'}
    ],
    resolve: {
      prompt:'醒来后你想：',
      options:[
        {text:'记录下来，写进日记', effects:{personality:{rational:1}}, moodAfter:'reflective'},
        {text:'给苏苏发条消息', effects:{personality:{emotional:1}}, moodAfter:'lonely'},
        {text:'继续睡', effects:{personality:{passive:1}}, moodAfter:'tired'}
      ]
    }
  },
  nightmare_betrayal: {
    id:'nightmare_betrayal',
    name:'熟悉的陌生人',
    desc:'梦里他对你笑，递来一杯酒。酒杯里映出的却是另一个人的脸。',
    trigger: s => {
      // 任一男主 trust < closeness 且 tension >= 10（暧昧却不够信任）
      return ['shenyan','luci','jiangyu'].some(cid => {
        const ad = s.affectionDetail?.[cid];
        return ad && ad.trust < ad.closeness && ad.tension >= 10;
      });
    },
    effects: { personality: {rational:1, emotional:1}, flags: {nightmare_seen_betrayal:1} },
    moodAfter: 'anxious',
    dialogue: [
      {who:'narrator', text:'（梦里他在笑。）'},
      {who:'him', text:'喝吧。'},
      {who:'me', text:'……杯子里是谁？'},
      {who:'narrator', text:'（酒杯映出的不是你的脸。你惊醒。）'}
    ],
    resolve: {
      prompt:'醒来后你决定：',
      options:[
        {text:'主动问他过去的事', effects:{personality:{active:1, independent:1}}, moodAfter:'determined'},
        {text:'先观察一段时间', effects:{personality:{rational:1, passive:1}}, moodAfter:'reflective'},
        {text:'假装不知道', effects:{personality:{dependent:1}}, moodAfter:'anxious'}
      ]
    }
  },

  // v0.1.9: 新增第三种梦魇——江屿线暧昧累积后的舞台梦
  nightmare_stage: {
    id:'nightmare_stage',
    name:'空舞台',
    desc:'梦里你站在雾港的舞台上，追光灯白得晃眼。台下坐满了人，却没有一张脸是清楚的。\n你张嘴想唱，歌词全是空白。台下有人开始鼓掌，掌声越来越响，像潮水漫过头顶。',
    trigger: s => {
      // 江屿线暧昧度累积到 8 以上（第 6 天起），心跳太吵的夜晚
      const ad = s.affectionDetail?.jiangyu;
      return !!(ad && ad.tension >= 8 && s.day >= 6);
    },
    effects: {
      personality: { emotional: 1, dependent: 1 },
      flags: { nightmare_seen_stage: 1 }
    },
    moodAfter: 'anxious',
    dialogue: [
      {who:'narrator', text:'（追光灯很烫。台下黑压压的一片。）'},
      {who:'me', text:'歌词……歌词是什么来着？'},
      {who:'narrator', text:'（掌声轰然响起。你在掌声里惊醒，心跳快得像唱完了一整首歌。）'}
    ],
    resolve: {
      prompt:'醒来后你决定：',
      options:[
        {text:'把梦里的鼓掌声写下来', effects:{personality:{emotional:1, active:1}}, moodAfter:'reflective'},
        {text:'给江屿发条消息，什么都不说', effects:{personality:{dependent:1, emotional:1}}, moodAfter:'tangled'},
        {text:'深呼吸，把灯全打开', effects:{personality:{rational:1, independent:1}}, moodAfter:'calm'}
      ]
    }
  }
};
