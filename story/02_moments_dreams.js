/* ===== 霓虹心事 · 剧情数据：朋友圈动态与梦境碎片 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */

Object.assign(STORY, {

  // ===== 朋友圈动态 =====
  moments: {
    // 第一天：沈砚之发美术馆预告
    'moment_shenyan_opening': {
      author:'shenyan',
      text:'砚美术馆夏季展即将开幕。\n这次的主题是「城市与孤独」。\n我们花了三个月，收集了47位艺术家对这座城市的私人记忆。\n——欢迎来看。',
      art:'gallery',
      likes:['luci'],
      comments:[
        {from:'luci', text:'去看的人不会孤独。'}
      ],
      onLike:{affection:{shenyan:1}},
      replyOnLike:'谢谢关注。',
      commentOptions:[
        {text:'一定去！', affection:{shenyan:2}, reply:'届时我会在入口等你。'},
        {text:'主题听起来很沉重', affection:{shenyan:1}, reply:'沉重的是城市，不是展览。看了你会懂。'},
        {text:'（仅点赞不评论）', affection:{shenyan:0}, reply:null}
      ]
    },
    // 第二天：陆辞发霓城夜景摄影
    'moment_luci_neon': {
      author:'luci',
      text:'今晚的霓城。\n高架桥上堵车，反而拍到了最好的光。\n——\n有人说，城市的灯是为孤独的人亮的。\n我觉得，灯是为等人的那个人亮的。',
      art:'city',
      likes:['susu'],
      comments:[
        {from:'susu', text:'啊啊啊好美！这是哪里拍的！'}
      ],
      onLike:{affection:{luci:1}},
      replyOnLike:'你点赞了。这就够了。',
      commentOptions:[
        {text:'等人的那个人，等到了吗？', affection:{luci:2}, reply:'……也许快了。'},
        {text:'拍得真好', affection:{luci:1}, reply:'你笑起来比这好看。'},
        {text:'（仅点赞不评论）', affection:{luci:0}, reply:null}
      ]
    },
    // 第三天：江屿发酒吧驻唱
    'moment_jiangyu_bar': {
      author:'jiangyu',
      text:'今晚雾港。\n有人点了《夏》。\n我没唱。\n——\n有些歌，要等对的人在场才唱。',
      likes:[],
      comments:[],
      onLike:{affection:{jiangyu:2}},
      replyOnLike:'……你来了。',
      commentOptions:[
        {text:'下次唱给我听', affection:{jiangyu:2}, reply:'好。下次。'},
        {text:'为什么是《夏》？', affection:{jiangyu:1}, reply:'等你想知道的那天，我告诉你。'},
        {text:'（仅点赞不评论）', affection:{jiangyu:0}, reply:null}
      ]
    },
    // 开幕式：修罗场动态
    'moment_shenyan_opening_day': {
      author:'shenyan',
      text:'开幕了。\n人来得很齐。\n有一位策展人，今天第一次独立完成了全部流程。\n——林夏，谢谢你。',
      art:'gallery',
      likes:['luci','jiangyu'],
      comments:[
        {from:'luci', text:'恭喜。林夏值得。'},
        {from:'jiangyu', text:'……'}
      ],
      onLike:{affection:{shenyan:2}},
      replyOnLike:'你看到了。',
      commentOptions:[
        {text:'是我应该谢谢您', affection:{shenyan:2}, reply:'别叫我"您"。叫名字。'},
        {text:'这只是开始', affection:{shenyan:1}, reply:'是的。我期待。'},
        {text:'（仅点赞不评论）', affection:{shenyan:0}, reply:null}
      ]
    }
  },


  // ===== 梦境碎片 =====
  dreams: {
    // 第一天睡前：高中回忆
    'dream_day1': {
      title:'梦 · 高三的教室',
      desc:'你又回到了高三那年的教室。\n窗外的蝉鸣很响。\n后座的男生在用笔戳你的背。\n你回头，看不清他的脸。',
      options:[
        {text:'回头对他笑', shard:'少年的侧脸', meaning:'你记得有人为你笑过', personality:{emotional:2, active:1}},
        {text:'假装没感觉，继续做题', shard:'空着的座位', meaning:'你习惯把心事藏起来', personality:{rational:2, passive:1}},
        {text:'趴下睡觉', shard:'蝉鸣里的夏天', meaning:'你想回到那个夏天', personality:{passive:2, emotional:1}}
      ],
      then:'day2_morning'
    },
    // 第二天睡前：画廊的预兆
    'dream_day2': {
      title:'梦 · 空白的画廊',
      desc:'你站在一间空白的画廊里。\n墙上只有一幅画，画的是你的背影。\n有人在画框上写字，你看不清。\n画框开始发烫。',
      options:[
        {text:'伸手去摸那幅画', shard:'烫手的画框', meaning:'你主动靠近危险', personality:{active:2, emotional:1}},
        {text:'后退，离开画廊', shard:'关上的门', meaning:'你选择保护自己', personality:{rational:1, independent:2}},
        {text:'站在原地等', shard:'模糊的字迹', meaning:'你在等别人给你答案', personality:{passive:2, dependent:1}}
      ],
      then:'day3_shenyan_test'
    },
    // 第三天睡前：舞台预兆
    'dream_day3': {
      title:'梦 · 没有观众的舞台',
      desc:'你坐在一个空剧场的观众席。\n台上有人在弹吉他，唱着一首你从没听过的歌。\n他唱到副歌时停了，看向你。\n灯灭了。',
      options:[
        {text:'喊一声"继续"', shard:'黑暗中的回声', meaning:'你敢在黑暗里发声', personality:{active:2, emotional:1}},
        {text:'安静等他继续', shard:'未完的副歌', meaning:'你尊重别人的节奏', personality:{passive:1, rational:2}},
        {text:'摸黑走上台', shard:'触到琴弦的指尖', meaning:'你想靠近那个人的孤独', personality:{active:1, dependent:2, emotional:1}}
      ],
      then:'opening_day'
    }
  },
});
