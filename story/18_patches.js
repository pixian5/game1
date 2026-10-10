/* ===== 霓虹心事 · 剧情数据：增量补丁（对 events/photos 等的追加定义） =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */


// 情报回复事件（玩家选择如何处理）
STORY.events['intel_shenyan_ex_reply'] = {
  type:'message_batch', delay:0,
  messages:[{from:'susu', text:'你说要不要去问问？我可以帮你打探！', choice:{
    prompt:'苏苏在等你的决定：',
    options:[
      {text:'别问了，我相信他', effects:{affection:{shenyan:2}, flags:{intel_shenyan_ex:'trust', trust_shenyan:1}, personality:{emotional:1}}, hint:'沈砚之 +2'},
      {text:'帮我盯着', effects:{affection:{shenyan:-1}, flags:{intel_shenyan_ex:'watch', suspect_shenyan:1}, personality:{rational:1}}, hint:'沈砚之 -1'},
      {text:'不管，先忙眼前的', effects:{affection:{}, flags:{intel_shenyan_ex:'ignore'}, personality:{independent:1}}, hint:'中立'}
    ]
  }}]
};

STORY.events['intel_luci_milan_reply'] = {
  type:'message_batch', delay:0,
  messages:[{from:'susu', text:'你说他不会真要走吧？九年没见，刚重逢就要走？', choice:{
    prompt:'苏苏替你着急：',
    options:[
      {text:'去问问他', effects:{affection:{luci:2}, flags:{intel_luci_milan:'ask', care_luci:1}, personality:{active:1}}, hint:'陆辞 +2'},
      {text:'他要走是他的事', effects:{affection:{luci:-1}, flags:{intel_luci_milan:'letgo'}, personality:{independent:1}}, hint:'陆辞 -1'},
      {text:'也许只是工作', effects:{affection:{luci:1}, flags:{intel_luci_milan:'rational'}, personality:{rational:1}}, hint:'陆辞 +1'}
    ]
  }}]
};

STORY.events['intel_jiangyu_song_reply'] = {
  type:'message_batch', delay:0,
  messages:[{from:'susu', text:'你说那首《夏》，是不是跟你有关？毕竟你叫林夏诶！', choice:{
    prompt:'苏苏的问题戳中了你：',
    options:[
      {text:'应该只是巧合', effects:{affection:{jiangyu:1}, flags:{intel_jiangyu_song:'coincide'}, personality:{rational:1}}, hint:'江屿 +1'},
      {text:'我想去听他唱完', effects:{affection:{jiangyu:2}, flags:{intel_jiangyu_song:'listen', want_listen:1}, personality:{emotional:1}}, hint:'江屿 +2'},
      {text:'别瞎说，我们只是朋友', effects:{affection:{jiangyu:0}, flags:{intel_jiangyu_song:'deny'}, personality:{passive:1}}, hint:'江屿 +0'}
    ]
  }}]
};


// 邀约相关事件
STORY.events['inv_shenyan_studio_accept'] = {
  type:'advance_time', text:'赴约 · 私人画室', minutes:120,
  then:'inv_shenyan_studio_scene'
};

STORY.events['inv_shenyan_studio_scene'] = {
  type:'encounter',
  encounter:{
    id:'inv_shenyan_studio_scene', char:'shenyan',
    title:'私人画室',
    desc:'画室在美术馆顶楼，没有灯，只有月光。\n他指着一幅盖着布的画：\n"这幅，画了三年。"\n"画的是谁？"\n他没回答，把布掀开一角。',
    choice:{ prompt:'月光下，画布上是一张熟悉的侧脸。',
      options:[
        {text:'那是…我？', affection:{shenyan:3}, reply:'"你比自己想象的，更值得被画下来。"', personality:{emotional:2}},
        {text:'为什么画我？', affection:{shenyan:2}, reply:'"因为我画不出别的。三年了，只画得出你。"', personality:{rational:1}},
        {text:'我不喜欢被画', affection:{shenyan:-1}, reply:'"……抱歉。我把它收起来。"', personality:{independent:1}}
      ]
    }
  },
  then:'inv_shenyan_studio_after'
};

STORY.events['inv_shenyan_studio_after'] = {
  type:'photo_unlock', photo:'shenyan_studio'
};

STORY.events['inv_shenyan_studio_decline'] = {
  type:'message_batch', delay:1,
  messages:[{from:'shenyan', text:'……也好。那幅画，本来也不该被人看见。'}]
};

STORY.events['inv_shenyan_studio_miss'] = {
  type:'message_batch', delay:0,
  messages:[{from:'shenyan', text:'画室的灯，我替你关了。下次不必再来。'}]
};


STORY.events['inv_luci_school_accept'] = {
  type:'advance_time', text:'赴约 · 旧学校', minutes:240,
  then:'inv_luci_school_scene'
};

STORY.events['inv_luci_school_scene'] = {
  type:'encounter',
  encounter:{
    id:'inv_luci_school_scene', char:'luci',
    title:'九年的旧学校',
    desc:'校门口的银杏又长高了一截。\n他带你走到当年高一军训的操场：\n"你那时候站这里。我在你后面第三个。"\n"我数过，从那天到今天，九年又一百八十二天。"',
    choice:{ prompt:'他从相机里抽出一张旧照片——是你高一的侧脸。',
      options:[
        {text:'你偷拍我？', affection:{luci:2}, reply:'"不叫偷拍。叫记录。我记录了你九年。"', personality:{emotional:2}},
        {text:'为什么不说', affection:{luci:3}, reply:'"怕说了，连记录的机会都没了。"', personality:{dependent:1}},
        {text:'照片给我', affection:{luci:1}, reply:'"都给你。连人一起，都给你。"', personality:{active:1}}
      ]
    }
  },
  then:'inv_luci_school_after'
};

STORY.events['inv_luci_school_after'] = {
  type:'photo_unlock', photo:'luci_school'
};

STORY.events['inv_luci_school_decline'] = {
  type:'message_batch', delay:1,
  messages:[{from:'luci', text:'没事。学校而已，下次还能去。其实也没有下次了。'}]
};

STORY.events['inv_luci_school_miss'] = {
  type:'message_batch', delay:0,
  messages:[{from:'luci', text:'我在校门口等了两小时。银杏叶落了一地。没事，我先回了。'}]
};


STORY.events['inv_jiangyu_bar_accept'] = {
  type:'advance_time', text:'赴约 · 雾港首唱', minutes:90,
  then:'inv_jiangyu_bar_scene'
};

STORY.events['inv_jiangyu_bar_scene'] = {
  type:'encounter',
  encounter:{
    id:'inv_jiangyu_bar_scene', char:'jiangyu',
    title:'雾港 · 首唱夜',
    desc:'酒吧灯光调到最暗。\n他抱着吉他上台，没看任何人，只看了角落的你一眼。\n"这首新歌，叫《夏》。写给一个名字里带夏的人。"\n副歌唱到一半，他停了：\n"林夏。这首歌的最后一句，我写不出来。"',
    choice:{ prompt:'全场安静下来，等你的回应。',
      options:[
        {text:'我来写最后一句', affection:{jiangyu:3}, reply:'"……好。你写。我唱。"', personality:{active:2, emotional:1}},
        {text:'不需要最后一句', affection:{jiangyu:2}, reply:'"也对。没结局的歌，才听得最久。"', personality:{rational:1}},
        {text:'让我回去想想', affection:{jiangyu:1}, reply:'"不急。我等了三年，不差这一晚。"', personality:{passive:1}}
      ]
    }
  },
  then:'inv_jiangyu_bar_after'
};

STORY.events['inv_jiangyu_bar_after'] = {
  type:'music_unlock', music:'xia'
};

STORY.events['inv_jiangyu_bar_decline'] = {
  type:'message_batch', delay:1,
  messages:[{from:'jiangyu', text:'……好。位置我撤了。'}]
};

STORY.events['inv_jiangyu_bar_miss'] = {
  type:'message_batch', delay:0,
  messages:[{from:'jiangyu', text:'歌唱完了。没人坐那个位置。'}]
};


// 新增赴约照片（供相册解锁）
STORY.photos['shenyan_studio'] = {
  title:'私人画室',
  caption:'月光从天窗落下来，照在那幅盖了三年的画上。\n画布上是我的侧脸——比我自己记得的，更年轻，也更倔强。\n他站在画前，像站在一段没说出口的话前。',
  art:'studio'
};

STORY.photos['luci_school'] = {
  title:'九年的旧学校',
  caption:'操场边的银杏又长高了。\n他给我看高一那张偷拍：短发、晒黑、笑得没心没肺。\n"九年又一百八十二天。"他说。\n原来被人默默记得，是这种感觉。',
  art:'school'
};

// 群聊触发事件（在第三天开幕前由苏苏发起）
STORY.events['susu_create_group'] = {
  type:'group_message_batch', delay:1,
  groupId:'group_neon',
  messages:[
    {from:'susu', text:'各位！欢迎来到霓城小分队！本群宗旨：保护林夏，监督各位男士！'},
    {from:'susu', text:'沈砚之先生，听说你让林夏盯开幕式？'},
    {from:'shenyan', text:'……苏苏，这个群为什么有我。'},
    {from:'luci', text:'哈哈哈哈沈砚之被点名了'},
    {from:'jiangyu', text:'……'},
    {from:'susu', text:'林夏不在群里的时候，你们别想偷偷对她怎么样！我都盯着！', choice:{
      prompt:'苏苏@你：夏夏你也说句话！',
      options:[
        {text:'你们几个怎么回事', effects:{affection:{shenyan:1,luci:1,jiangyu:1}, flags:{group_intro:1}, thenEvent:'group_neon_react1'}, hint:'全员 +1'},
        {text:'苏苏你又搞事', effects:{affection:{}, flags:{group_intro:2}, thenEvent:'group_neon_react2'}, hint:'中立'},
        {text:'（潜水围观）', effects:{affection:{shenyan:-1,luci:-1}, flags:{group_intro:3}, thenEvent:'group_neon_react3'}, hint:'沈陆 -1'}
      ]
    }}
  ]
};

STORY.events['group_neon_react1'] = {
  type:'group_message_batch', delay:0, groupId:'group_neon',
  messages:[
    {from:'shenyan', text:'没什么事。工作群而已。'},
    {from:'luci', text:'工作群？沈总你骗谁呢哈哈哈哈'},
    {from:'jiangyu', text:'林夏，别被他们带偏。'}
  ]
};

STORY.events['group_neon_react2'] = {
  type:'group_message_batch', delay:0, groupId:'group_neon',
  messages:[
    {from:'susu', text:'搞事？我这是正义监督！'},
    {from:'luci', text:'林夏你学坏了，跟苏苏一个调调'},
    {from:'shenyan', text:'……'}
  ]
};

STORY.events['group_neon_react3'] = {
  type:'group_message_batch', delay:0, groupId:'group_neon',
  messages:[
    {from:'susu', text:'？？？林夏你潜水？'},
    {from:'luci', text:'她不想理我们'},
    {from:'shenyan', text:'正常。'}
  ]
};


// 闪回触发检查（由 engine.checkFlashbacks 调用）
// 闪回完成后的回调事件（v0.1.6：补上原先 then:null 的断链，让闪回有落点）
STORY.events['fb_highschool_luci_after'] = {
  type:'message_batch', delay:1,
  messages:[
    {from:'luci', text:'照片看完了？', then:'fb_highschool_luci_after_2'}
  ]
};

STORY.events['fb_highschool_luci_after_2'] = {
  type:'message_batch', delay:0,
  messages:[
    {from:'luci', text:'别笑我。这九年，我一直没敢给你看。\n现在敢了——因为你回来了。'}
  ]
};

STORY.events['fb_highschool_jiangyu_after'] = {
  type:'message_batch', delay:1,
  messages:[
    {from:'jiangyu', text:'……还没睡吧。', then:'fb_highschool_jiangyu_after_2'}
  ]
};

STORY.events['fb_highschool_jiangyu_after_2'] = {
  type:'message_batch', delay:0,
  messages:[
    {from:'jiangyu', text:'副歌那两句，今晚突然写完了。\n原来它缺的不是旋律，是一个人。'}
  ]
};

STORY.events['fb_gallery_shenyan_after'] = {
  type:'message_batch', delay:1,
  messages:[
    {from:'shenyan', text:'……你今天去了旧展厅。', then:'fb_gallery_shenyan_after_2'}
  ]
};

STORY.events['fb_gallery_shenyan_after_2'] = {
  type:'message_batch', delay:0,
  messages:[
    {from:'shenyan', text:'那面墙上的《海》，挂了五年。\n它是从一个下午开始画的——那天，展厅里有个人站着看了很久。'}
  ]
};
