/* ===== 霓虹心事 · 剧情数据：季节节日与男主视角 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// ===== v0.0.10 季节系统+节日事件 =====
STORY.seasons = {
  // 起始日期：7月15日（夏天）
  startDate: { month:7, date:15 },
  // 季节判定
  getSeason(month){
    if(month >= 3 && month <= 5) return 'spring';
    if(month >= 6 && month <= 8) return 'summer';
    if(month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  },
  seasonInfo: {
    spring:{ id:'spring', name:'春', icon:'🌸', color:'#ffb7c5', desc:'樱花飘进霓城的巷子' },
    summer:{ id:'summer', name:'夏', icon:'☀️', color:'#fbbf24', desc:'霓城的夜，亮得最早' },
    autumn:{ id:'autumn', name:'秋', icon:'🍂', color:'#d97706', desc:'银杏把整条街染成金' },
    winter:{ id:'winter', name:'冬', icon:'❄️', color:'#7dd3fc', desc:'霓城的第一场雪，落在你肩头' }
  },
  // 节日事件：按 月-日 触发
  holidays: {
    // ===== v0.5.10（F4）：现实世界季节事件——按玩家设备月-日触发（纯数据，节日限定收集品×3）=====
    '10-24': { id:'frost_descent', name:'霜降', icon:'❄️', text:'霜降。霓城的夜风开始带刀子，便利店的热饮柜换上了第二排。', effect:{ flag:'frost_descent_seen' } },
    '12-21': { id:'winter_solstice', name:'冬至', icon:'🥟', text:'冬至。北方吃饺子，南方吃汤圆——雾港今晚两种都备了。', effect:{ collectible:'ticket_solstice' } },
    '12-31': { id:'new_years_eve', name:'跨年夜', icon:'🎆', text:'跨年夜。整条江边的灯串亮到零点，霓城在倒数里换了一年。', effect:{ collectible:'postcard_fireworks' } },
    '3-20':  { id:'spring_equinox', name:'春分', icon:'🌸', text:'春分。老城区的巷子口，第一株樱花开得毫无预兆。', effect:{ collectible:'stamp_sakura' } },

    '7-15':  { id:'arrive_day',  name:'抵达霓城纪念日', icon:'🌃', text:'一年前的今天，你第一次踏上霓城。', effect:{ coins:100 } },
    '8-10':  { id:'luci_birthday', name:'陆辞生日', icon:'🎂', text:'陆辞的生日。他没告诉你，但苏苏发来提醒。', effect:{ flag:'luci_birthday_known' } },
    '8-25':  { id:'jiangyu_first_song', name:'《夏》首唱纪念日', icon:'🎤', text:'一年前的今天，江屿在雾港首唱了《夏》。', effect:{ coins:100 } },
    '9-12':  { id:'shenyan_birthday', name:'沈砚之生日', icon:'🎂', text:'沈砚之的生日。他从不过，但你可以提醒他。', effect:{ flag:'shenyan_birthday_known' } },
    '10-1':  { id:'national_day', name:'霓城艺术节', icon:'🎭', text:'霓城一年一度的艺术节，全城展览开幕。', effect:{ flag:'art_festival' } },
    '10-15': { id:'luci_reunion', name:'与陆辞重逢纪念日', icon:'💫', text:'一年前的今天，你和陆辞在砚美术馆重逢。', effect:{} },
    '11-11': { id:'singles_day', name:'独行节', icon:'🌑', text:'霓城的独行节。一个人的城市，也可以很热闹。', effect:{ flag:'solo_day', personality:{independent:1} } },
    '12-24': { id:'christmas_eve', name:'平安夜', icon:'🎄', text:'平安夜。霓城的雪下了整整一夜。', effect:{ flag:'christmas_eve', personality:{emotional:1} } },
    '12-25': { id:'christmas', name:'圣诞节', icon:'🎅', text:'圣诞节。某个男主发来一张匿名礼物图。', effect:{ flag:'christmas' } },
    '2-14':  { id:'valentine', name:'情人节', icon:'💝', text:'情人节。霓城的玫瑰卖到缺货。', effect:{ flag:'valentine_day' } },
    '6-9':   { id:'jiangyu_birthday', name:'江屿生日', icon:'🎂', text:'江屿的生日。他不会告诉任何人。', effect:{ flag:'jiangyu_birthday_known' } }
  }
};


// ===== v0.0.10 男主视角+反向剧情 =====
// 通关后解锁：以男主身份重看关键剧情，揭示他们没说出口的内心独白
STORY.malePerspectives = {
  shenyan: {
    charId:'shenyan',
    title:'沈砚之的视角',
    unlockCondition: s => (s.endingSeen||{}).shenyan_good || (s.endingSeen||{}).shenyan_bad,
    scenes:[
      {
        id:'mps_1',
        title:'第一次收到她的联系方式',
        time:'第一天清晨',
        narration:'导师把她的联系方式给我。林夏。我重复了一遍这个名字，没由来地，想起五年前那幅没画完的画。',
        innerVoice:'我以为自己早就过了会被一个名字打动的年纪。',
        choice:{
          prompt:'你要怎么开口？',
          options:[
            { text:'直接约她报到', inner:'不要让她觉得我太在意。' },
            { text:'加一句"我讨厌不守时"', inner:'让她知道，我的规则。' }
          ]
        }
      },
      {
        id:'mps_2',
        title:'开幕式前，她在展厅',
        time:'开幕式当天',
        narration:'她站在展厅中央，背对我，看着那幅画。灯光从她身后打下来，像为她量身定做的。',
        innerVoice:'陆辞说得对。她笑起来比那幅画好看。但我不会说出口。',
        choice:{
          prompt:'你要走过去吗？',
          options:[
            { text:'走过去，给她介绍人', inner:'让她进入我的世界。' },
            { text:'站在原地多看一眼', inner:'就一眼。然后假装刚才没在看她。' }
          ]
        }
      },
      {
        id:'mps_3',
        title:'南方出差，她睡着了',
        time:'沈砚之线 · 南方',
        narration:'飞机上她靠着窗户睡着了。我把外套盖在她身上，她没醒。窗外的云像海。',
        innerVoice:'我已经很多年没有，想要保护一个人的冲动了。',
        choice:{
          prompt:'你要叫醒她吗？',
          options:[
            { text:'让她多睡一会儿', inner:'就一会儿。这个时间，是属于我的。' },
            { text:'轻轻叫醒她', inner:'别让她错过云海。' }
          ]
        }
      }
    ],
    truthEnding:{
      title:'真相 · 沈砚之',
      text:'他第一次见你，不是在导师给联系方式的那个清晨。\n\n是五年前。你还在读大二，跟着陆辞来霓城看展，第一次走进这间美术馆。你站在一幅画前看了很久，回头对陆辞笑了一下。\n\n那个笑，他画了五年，没画完。\n\n直到你以策展人的身份，重新出现在他的展厅。'
    }
  },
  luci: {
    charId:'luci',
    title:'陆辞的视角',
    unlockCondition: s => (s.endingSeen||{}).luci_good || (s.endingSeen||{}).luci_bad,
    scenes:[
      {
        id:'mpl_1',
        title:'听说新策展人叫林夏',
        time:'第一天',
        narration:'朋友告诉我，砚美术馆新来的策展人叫林夏。我握着相机的手抖了一下。',
        innerVoice:'九年了。我以为我已经忘了这个名字。',
        choice:{
          prompt:'你要主动联系她吗？',
          options:[
            { text:'装作不认识，发消息给她', inner:'让她以为，我只是一时没认出来。' },
            { text:'直接告诉她我记得', inner:'不想再假装了。' }
          ]
        }
      },
      {
        id:'mpl_2',
        title:'她问"离他远点是什么意思"',
        time:'第三天',
        narration:'我脱口而出"离他远点"。她追问，我说了沈砚之看人像估价。其实我想说的是另一句。',
        innerVoice:'我想说的是：离他远点，离我近一点。',
        choice:{
          prompt:'你要说真话吗？',
          options:[
            { text:'说真话', inner:'九年了，不能再错过了。' },
            { text:'忍住，说一句模糊的话', inner:'她现在，还没准备好听这句话。' }
          ]
        }
      },
      {
        id:'mpl_3',
        title:'旧学校的银杏',
        time:'陆辞线 · 旧学校',
        narration:'带她回到旧学校。操场边的银杏又黄了。九年又一百八十二天。我想说一句"我喜欢你"，从高中就想说。',
        innerVoice:'但我只敢说"想给你拍张照"。',
        choice:{
          prompt:'按下快门前，你要说什么？',
          options:[
            { text:'什么都不说，按下快门', inner:'有些话，藏在照片里就好。' },
            { text:'说一句"笑一个"', inner:'至少，让她笑给我看。' }
          ]
        }
      }
    ],
    truthEnding:{
      title:'真相 · 陆辞',
      text:'那封没寄出的信，其实写了一百多封。\n\n每一年的今天，他都写一封。写到第九年，他终于鼓起勇气，把第一封信揣进口袋，去砚美术馆找你。\n\n但他没想到，重逢那一刻，他什么都说不出口。\n\n他只说了一句："诶诶诶！！！林夏是你吗？？？"\n\n其实他想说的是："我找了你九年。"'
    }
  },
  jiangyu: {
    charId:'jiangyu',
    title:'江屿的视角',
    unlockCondition: s => (s.endingSeen||{}).jiangyu_good || (s.endingSeen||{}).jiangyu_bad,
    scenes:[
      {
        id:'mpj_1',
        title:'她推门进雾港',
        time:'第一天',
        narration:'雾港的门被推开，她跟着陆辞走进来。我正在调一杯"夏"。',
        innerVoice:'她的名字，跟我写过的一首歌一样。 coincidence？',
        choice:{
          prompt:'第一杯酒，你要怎么给？',
          options:[
            { text:'算我请的', inner:'想让她记住雾港。' },
            { text:'收她的钱', inner:'保持距离。我不能再被打动。' }
          ]
        }
      },
      {
        id:'mpj_2',
        title:'深夜给她打电话',
        time:'第一天深夜',
        narration:'我打了电话给她。我说"没什么事，只是想确认一下"。其实我想说的是另一句。',
        innerVoice:'我想说：你叫林夏。我写过一首歌叫《夏》。这首歌我唱了五年，从来没敢公开。',
        choice:{
          prompt:'你要告诉她这首歌吗？',
          options:[
            { text:'告诉她，但说只是巧合', inner:'试探她的反应。' },
            { text:'不说，让她自己发现', inner:'她发现的那一天，就是答案。' }
          ]
        }
      },
      {
        id:'mpj_3',
        title:'天台，灯亮着',
        time:'开幕式当晚',
        narration:'天台上她靠过来一点。霓城的灯，亮着却没人懂。',
        innerVoice:'我也是。亮了五年，没人懂。',
        choice:{
          prompt:'你要开口吗？',
          options:[
            { text:'唱一句《夏》给她听', inner:'就一句。剩下的，让她猜。' },
            { text:'只是看着灯', inner:'有些话，唱出来就破坏了。' }
          ]
        }
      }
    ],
    truthEnding:{
      title:'真相 · 江屿',
      text:'《夏》不是巧合。\n\n五年前的夏天，他在霓城的天台上，第一次见到你。你跟着陆辞，笑着从楼下走过。\n\n那一晚他写了《夏》。歌词里的"林夏"，就是你。\n\n他唱了五年，没人知道这首歌是写给谁的。\n\n直到你推门走进雾港，他终于知道了：这首歌，是为了等你而写的。'
    }
  }
};
