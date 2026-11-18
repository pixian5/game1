/* ===== 霓虹心事 · 剧情数据：day6-7 节奏补齐（v0.9.5）=====
 * 依赖 engine v0.9.5 的调度隔离：主线链进行中时，日常时间事件延后派发。
 */

// ===== day6：通用 =====
STORY.events['day6_city_after_rain'] = {
  type:'message_batch', delay:0,
  trigger:{ deferWhenBusy:true, day:6, hour:10 },
  messages:[
    {from:'susu', text:'雨停了，霓城像被擦过一遍。今天想干点什么？', choice:{
      auto:true,
      prompt:'周六，难得放晴。',
      options:[
        {text:'去江边走', effects:{personality:{active:1}, thenEvent:'day6_city_walk'}, reply:'（江风把云推得很低。你走了很久，没看手机。）'},
        {text:'在家补觉', effects:{personality:{passive:1}, thenEvent:'day6_city_rest'}, reply:'（你睡到下午。醒来时，窗外的光换了角度。）'}
      ]
    }}
  ]
};
STORY.events['day6_city_walk'] = {
  type:'message_batch', delay:2,
  messages:[{from:'narrator', text:'（江边有人在放风筝。线很长，风筝很小。）'}]
};
STORY.events['day6_city_rest'] = {
  type:'message_batch', delay:2,
  messages:[{from:'narrator', text:'（梦里也有一扇窗。醒来时，你不记得窗外是什么。）'}]
};

// ===== day6：沈砚之线 =====
STORY.events['day6_shenyan_archive'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:6, hour:17, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'档案室有一批旧展资料，我翻了半天没找到那份。你要是没事——来帮我一起？', choice:{
      auto:true,
      prompt:'档案室的灯是暖色的。',
      options:[
        {text:'帮他找', effects:{affection:{shenyan:2}, personality:{active:1}, thenEvent:'day6_shenyan_archive_yes'}, reply:'（你们并肩翻资料。他的袖子蹭到你的手背，谁都没躲。）'},
        {text:'让他自己来', effects:{affection:{shenyan:1}, personality:{independent:1}, thenEvent:'day6_shenyan_archive_no'}, reply:'（你回了一句"加油"。半小时后，他发来照片：找到了。）'}
      ]
    }}
  ]
};
STORY.events['day6_shenyan_archive_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'找到了。……原来和你的入职档案放在一起。'}]
};
STORY.events['day6_shenyan_archive_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'找到了。下次不勉强你。'}]
};

// ===== day6：陆辞线 =====
STORY.events['day6_luci_print'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:6, hour:19, route:'luci' },
  messages:[
    {from:'luci', text:'冲洗店今天出片。有一卷是那天梧桐路的，你要不要一起去取？', choice:{
      auto:true,
      prompt:'天色刚暗，店里的红灯亮着。',
      options:[
        {text:'一起去', effects:{affection:{luci:2}, personality:{emotional:1}, thenEvent:'day6_luci_print_yes'}, reply:'（老板把照片推过来。第一张就是你，背对镜头。）'},
        {text:'改天吧', effects:{affection:{luci:1}, personality:{rational:1}, thenEvent:'day6_luci_print_no'}, reply:'（他一个人去了。回来时说：照片先放我这儿。）'}
      ]
    }}
  ]
};
STORY.events['day6_luci_print_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'这张我留下了。……不是不给你，是还没想好怎么给。'}]
};
STORY.events['day6_luci_print_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'好。它们跑不掉。'}]
};

// ===== day6：江屿线 =====
STORY.events['day6_jiangyu_close'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:6, hour:22, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'打烊了。今天最后一杯，我给自己调了杯，也顺手给你留了一杯无酒精的。', choice:{
      auto:true,
      prompt:'酒吧的灯只剩吧台一盏。',
      options:[
        {text:'等他收工', effects:{affection:{jiangyu:2}, personality:{emotional:1}, thenEvent:'day6_jiangyu_close_yes'}, reply:'（他擦杯子的动作很慢。你们谁都没提回家的事。）'},
        {text:'先回了', effects:{affection:{jiangyu:1}, personality:{independent:1}, thenEvent:'day6_jiangyu_close_no'}, reply:'（你走到门口。他在身后说：路上小心。）'}
      ]
    }}
  ]
};
STORY.events['day6_jiangyu_close_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'这杯叫「散场」。……但今晚我不想散。'}]
};
STORY.events['day6_jiangyu_close_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'路上小心。杯子我给你留着。'}]
};

// ===== day7：沈砚之线 =====
STORY.events['day7_shenyan_review'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:16, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'一周了。布展的复盘我写了两页，留了一页空白——这一页，想听听你的。', choice:{
      auto:true,
      prompt:'一周的第一次复盘。',
      options:[
        {text:'认真写满', effects:{affection:{shenyan:2}, personality:{rational:1}, thenEvent:'day7_shenyan_review_yes'}, reply:'（你写得很慢。他在旁边看，没有催。）'},
        {text:'写一句就好', effects:{affection:{shenyan:1}, personality:{independent:1}, thenEvent:'day7_shenyan_review_no'}, reply:'（你只写了一句。他看了很久，把它折好收起来。）'}
      ]
    }}
  ]
};
STORY.events['day7_shenyan_review_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'……比我预想的多。这一页，我收进档案了。'}]
};
STORY.events['day7_shenyan_review_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'一句话也够了。有时候一句比一页重。'}]
};

// ===== day7：陆辞线 =====
STORY.events['day7_luci_walk'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:20, route:'luci' },
  messages:[
    {from:'luci', text:'九年前我们也是这么走的，只是那天下雨。要不要再走一次？', choice:{
      auto:true,
      prompt:'旧街的路灯比记忆里矮了一点。',
      options:[
        {text:'走', effects:{affection:{luci:2}, personality:{emotional:1}, thenEvent:'day7_luci_walk_yes'}, reply:'（你们走到那家关门的文具店。他停下，没说话。）'},
        {text:'今天算了', effects:{affection:{luci:1}, personality:{rational:1}, thenEvent:'day7_luci_walk_no'}, reply:'（你站在路口。他把伞撑开，又收起来。）'}
      ]
    }}
  ]
};
STORY.events['day7_luci_walk_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'那年我没敢说的话，今天可以说了吗？'}]
};
STORY.events['day7_luci_walk_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'没关系。路还在这儿。'}]
};

// ===== day7：江屿线 =====
STORY.events['day7_jiangyu_song'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:21, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'副歌写完了。我在排练室，想让你第一个听——不过你要是不方便，我录下来也行。', choice:{
      auto:true,
      prompt:'排练室的灯亮着。',
      options:[
        {text:'现在去', effects:{affection:{jiangyu:2}, personality:{emotional:1}, thenEvent:'day7_jiangyu_song_yes'}, reply:'（他唱到第二遍才看你。你发现他手心在出汗。）'},
        {text:'听录音', effects:{affection:{jiangyu:1}, personality:{rational:1}, thenEvent:'day7_jiangyu_song_no'}, reply:'（录音里有一段空白。他说，那是留给你的。）'}
      ]
    }}
  ]
};
STORY.events['day7_jiangyu_song_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'……唱完了。你觉得，它该叫什么？'}]
};
STORY.events['day7_jiangyu_song_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'行。空白那段，等你来填。'}]
};