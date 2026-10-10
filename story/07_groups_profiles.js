/* ===== 霓虹心事 · 剧情数据：群聊剧情与角色主页 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */


// ===== 多人聊天群 =====
STORY.groups = {
  'group_neon': {
    name:'霓城小分队',
    members:['susu','shenyan','luci','jiangyu'],
    bio:'苏苏拉的秘密群，名为"霓城小分队"，实则盯梢林夏感情动向。',
    trigger: s => s.day >= 3 && !s.flags.group_created_group_neon,
    createEvent: 'susu_create_group'
  }
};


// ===== 男主朋友圈/社交主页 =====
STORY.profiles = {
  shenyan: {
    bio:'砚美术馆主理人。寡言。画过一幅画，画了三年。',
    tags:['#美术馆', '#沉默的人', '#控制欲'],
    relations:[
      {to:'luci', hint:'不喜欢他拍你。看他的眼神像在估价。'},
      {to:'jiangyu', hint:'没说过话，但江屿唱《夏》那晚，他离场了。'}
    ]
  },
  luci: {
    bio:'自由摄影师。九年没换过镜头盖。相机里全是同一个人。',
    tags:['#摄影师', '#九年', '#青梅竹马'],
    relations:[
      {to:'shenyan', hint:'给他拍过封面。后来说"看人的眼神像在估价"，再没合作。'},
      {to:'jiangyu', hint:'雾港的常客。江屿喝多了会跟他借相机。'}
    ]
  },
  jiangyu: {
    bio:'雾港调酒师。前渡鸦乐队主唱。有一首写了三年没写完的歌。',
    tags:['#调酒师', '#前乐队', '#未完的歌'],
    relations:[
      {to:'shenyan', hint:'美术馆开幕那天，他没去。说"那种地方不欢迎我"。'},
      {to:'luci', hint:'跟陆辞喝过几次酒。陆辞说他"心里有人，唱不出来"。'}
    ]
  },
  susu: {
    bio:'大学闺蜜。情报王。霓城小分队群主。',
    tags:['#闺蜜', '#八卦', '#情报网'],
    relations:[
      {to:'shenyan', hint:'朋友在美术馆实习，能搞到内部消息。'},
      {to:'luci', hint:'追过陆辞的摄影展，被陆辞婉拒"我只拍一个人"。'},
      {to:'jiangyu', hint:'雾港常客，跟江屿混得很熟。'}
    ]
  }
};
