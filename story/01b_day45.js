/* ===== 霓虹心事 · 剧情数据：day4-5 节奏补齐（v0.9.2）=====
 * 背景：day4 仅 1 条、day5 为 0 条时间触发事件，玩家在这两天缺乏可玩节点。
 * 本文件补 6 条时间事件（day4 通用 1 + 三线各 1；day5 通用 1 + 独行线 1），每条带选择与回复链。
 * 依赖 engine.js v0.9.2 的 trigger.route 过滤。
 */

// ===== day4：通用 =====
STORY.events['day4_rain_walk'] = {
  type:'message_batch', delay:0,
  trigger:{ deferWhenBusy:true, day:4, hour:9 },
  messages:[
    {from:'susu', text:'霓城下雨了！你带伞没？那边雨说来就来。', choice:{
      auto:true,
      prompt:'雨点已经砸在窗上。',
      options:[
        {text:'折回去拿伞', effects:{personality:{rational:1}, thenEvent:'day4_rain_umbrella'}, reply:'（你跑回住处拿了伞。迟到五分钟，但干爽一整天。）'},
        {text:'直接冲进雨里', effects:{personality:{independent:1, emotional:1}, thenEvent:'day4_rain_run'}, reply:'（雨水顺着领口灌进来。奇怪的是，你居然笑了。）'}
      ]
    }}
  ]
};
STORY.events['day4_rain_umbrella'] = {
  type:'message_batch', delay:2,
  messages:[{from:'susu', text:'靠谱！霓城的雨最喜欢欺负没伞的人。'}]
};
STORY.events['day4_rain_run'] = {
  type:'message_batch', delay:2,
  messages:[{from:'susu', text:'疯了吧！到地方记得喝热的，别逞强。'}]
};

// ===== day4：沈砚之线 =====
STORY.events['day4_shenyan_gallery_note'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:4, hour:14, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'展签初稿写完了。第三段空着——那句"画中人的名字"，我想由你来写。', choice:{
      auto:true,
      prompt:'展签上留着一行空白。',
      options:[
        {text:'写我的名字', effects:{affection:{shenyan:2}, personality:{emotional:1}, thenEvent:'day4_shenyan_note_yes'}, reply:'（你写下自己的名字。笔尖停了一秒才离开纸面。）'},
        {text:'还是留白吧', effects:{affection:{shenyan:-1}, personality:{independent:1}, thenEvent:'day4_shenyan_note_no'}, reply:'（你把笔放下。有些答案，先不写反而更完整。）'}
      ]
    }}
  ]
};
STORY.events['day4_shenyan_note_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'……好。那这一行，就不擦了。'}]
};
STORY.events['day4_shenyan_note_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'留白也是一种答案。我尊重它。'}]
};

// ===== day4：陆辞线 =====
STORY.events['day4_luci_street_photo'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:4, hour:16, route:'luci' },
  messages:[
    {from:'luci', text:'雨后的光最好看。我在梧桐路，你要不要来当一次模特？只拍一张。', choice:{
      auto:true,
      prompt:'窗外的天色刚放晴。',
      options:[
        {text:'我现在过去', effects:{affection:{luci:2}, personality:{emotional:1}, thenEvent:'day4_luci_photo_yes'}, reply:'（你抓起外套。他在楼下等你，相机已经举起来了。）'},
        {text:'下次吧，今天有点累', effects:{affection:{luci:1}, personality:{rational:1}, thenEvent:'day4_luci_photo_no'}, reply:'（你回绝得很轻。他没有追问，只回了一个"好"。）'}
      ]
    }}
  ]
};
STORY.events['day4_luci_photo_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'别动。……好了。这张我不给别人看。'}]
};
STORY.events['day4_luci_photo_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'好。光会等我，我也会。'}]
};

// ===== day4：江屿线 =====
STORY.events['day4_jiangyu_rehearsal'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:4, hour:20, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'排练室空着。你要是没地方去，可以来听一段没写完的。', choice:{
      auto:true,
      prompt:'手机屏幕亮着，外面已经入夜。',
      options:[
        {text:'我去听', effects:{affection:{jiangyu:2}, personality:{emotional:1}, thenEvent:'day4_jiangyu_rehearsal_yes'}, reply:'（排练室的门虚掩着。你推门时，他正好按下第一个和弦。）'},
        {text:'不打扰你了', effects:{affection:{jiangyu:1}, personality:{independent:1}, thenEvent:'day4_jiangyu_rehearsal_no'}, reply:'（你把手机扣在桌上。那首歌，今晚只属于他自己。）'}
      ]
    }}
  ]
};
STORY.events['day4_jiangyu_rehearsal_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'……这一段，还没名字。你听完给一个？'}]
};
STORY.events['day4_jiangyu_rehearsal_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'行。等它写完了，第一个给你听。'}]
};

// ===== day5：通用 =====
STORY.events['day5_susu_lunch'] = {
  type:'message_batch', delay:0,
  trigger:{ deferWhenBusy:true, day:5, hour:12 },
  messages:[
    {from:'susu', text:'中午一起吃？我请你吃霓城最辣的粉，吃完什么烦恼都没了。', choice:{
      auto:true,
      prompt:'午饭时间，肚子先替你做了决定。',
      options:[
        {text:'好，老地方见', effects:{personality:{active:1}, thenEvent:'day5_susu_lunch_yes'}, reply:'（你到的时候，苏苏已经点好了两碗，辣得发亮。）'},
        {text:'今天想一个人吃', effects:{personality:{independent:1}, thenEvent:'day5_susu_lunch_no'}, reply:'（你找了个靠窗的位置。一个人吃饭，也不算坏事。）'}
      ]
    }}
  ]
};
STORY.events['day5_susu_lunch_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'susu', text:'看吧！辣一口，霓城就没那么难懂了。'}]
};
STORY.events['day5_susu_lunch_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'susu', text:'行吧。那晚上记得吃点热的，别又糊弄。'}]
};

// ===== day5：独行线 =====
STORY.events['day5_solo_window'] = {
  type:'message_batch', delay:0,
  trigger:{ deferWhenBusy:true, day:5, hour:19, route:'solo' },
  messages:[
    {from:'narrator', text:'（第五天的傍晚。窗外是霓城不眠的灯，屋里只有你。）', choice:{
      auto:true,
      prompt:'一个人待着的第五天。',
      options:[
        {text:'给自己煮一碗面', effects:{personality:{independent:1}, thenEvent:'day5_solo_noodle'}, reply:'（水开了。你把面下进去，忽然觉得这间屋子开始像"家"了。）'},
        {text:'翻出旧照片', effects:{personality:{emotional:1}, thenEvent:'day5_solo_photo'}, reply:'（照片里的人和现在的你隔着几年。你看了很久，才把它放回去。）'}
      ]
    }}
  ]
};
STORY.events['day5_solo_noodle'] = {
  type:'message_batch', delay:2,
  messages:[{from:'narrator', text:'（面好了。你端着碗坐在窗边，霓城的灯一盏一盏亮着。）'}]
};
STORY.events['day5_solo_photo'] = {
  type:'message_batch', delay:2,
  messages:[{from:'narrator', text:'（照片背面写着一个日期。你记得那天，也记得当时没说出口的话。）'}]
};
// ===== day5：沈砚之线 =====
STORY.events['day5_shenyan_afterhours'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:5, hour:15, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'闭馆了，展厅只剩换灯的活儿。你要是不赶时间——留一盏灯给我就好。', choice:{
      auto:true,
      prompt:'展厅的灯已经灭了一半。',
      options:[
        {text:'留下，帮他扶梯子', effects:{affection:{shenyan:2}, personality:{active:1}, thenEvent:'day5_shenyan_after_yes'}, reply:'（梯子晃了一下。他扶住你的手腕，说："站稳。"）'},
        {text:'先回去，明天见', effects:{affection:{shenyan:1}, personality:{independent:1}, thenEvent:'day5_shenyan_after_no'}, reply:'（你走到门口回头。他自己把最后一盏灯换完了。）'}
      ]
    }}
  ]
};
STORY.events['day5_shenyan_after_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'手别松。……好了，这盏灯的位置，以后就按你扶的高度来。'}]
};
STORY.events['day5_shenyan_after_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'明天见。灯我会一盏一盏点好。'}]
};

// ===== day5：陆辞线 =====
STORY.events['day5_luci_darkroom'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:5, hour:18, route:'luci' },
  messages:[
    {from:'luci', text:'暗房今天只开一盏红灯。你要不要进来，看一张照片慢慢显影？', choice:{
      auto:true,
      prompt:'暗房的门缝里透出一点红光。',
      options:[
        {text:'进去看', effects:{affection:{luci:2}, personality:{emotional:1}, thenEvent:'day5_luci_dark_yes'}, reply:'（红灯下，照片里的人一点点浮出来——是你。）'},
        {text:'在门口等你', effects:{affection:{luci:1}, personality:{rational:1}, thenEvent:'day5_luci_dark_no'}, reply:'（门再开时，他递出一张还湿着的照片："拍的是门口的光。"）'}
      ]
    }}
  ]
};
STORY.events['day5_luci_dark_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'别急，还要再等一会儿。显影和等人的耐心，是一回事。'}]
};
STORY.events['day5_luci_dark_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'门口的光也很好看。你站在那里的时候，最好看。'}]
};

// ===== day5：江屿线 =====
STORY.events['day5_jiangyu_market'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:5, hour:21, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'今晚凌晨有鱼市。我要去买条鱼，顺便找点歌里的声音。你来吗？', choice:{
      auto:true,
      prompt:'手机屏幕的光映在天花板上。',
      options:[
        {text:'陪他去', effects:{affection:{jiangyu:2}, personality:{active:1}, thenEvent:'day5_jiangyu_market_yes'}, reply:'（凌晨的鱼市亮着白灯。他挑鱼的动作很熟练，像在调弦。）'},
        {text:'下次吧', effects:{affection:{jiangyu:1}, personality:{independent:1}, thenEvent:'day5_jiangyu_market_no'}, reply:'（你把闹钟关掉。凌晨三点，手机震了一下。）'}
      ]
    }}
  ]
};
STORY.events['day5_jiangyu_market_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'听，这个水声。我找了三个月，就是它。'}]
};
STORY.events['day5_jiangyu_market_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'（语音 20"）：鱼市的潮声。你说下次，那就下次。'}]
};
