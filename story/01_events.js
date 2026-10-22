/* ===== 霓虹心事 · 剧情数据：剧情事件主线（全部 events） =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */

Object.assign(STORY, {

  events: {
    // ===== 序章：抵达霓城 =====
    'intro_susu': {
      type:'message_batch', delay:0, collectible:'postcard_neon',
      messages:[
        {from:'susu', text:'林夏！！！你到霓城了吗？？', then:'intro_susu_2'}
      ]
    },
    'intro_susu_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'听说你明天去砚美术馆报到？那里可是出了名的难进！', then:'intro_susu_3'}
      ]
    },
    // v0.1.10: 汇流节点差异化——第一晚的回复不再直连梦境，苏苏的回应因你的选择而不同
    'intro_susu_3': {
      type:'message_batch', delay: 0,
      messages:[
        {from:'susu', text:'到了回我一声！别让我担心！', choice:{
          prompt:'苏苏在等你的回复：',
          options:[
            {text:'刚到，累死了，先睡了', effects:{affection:{}, thenEvent:'intro_reply_sleep', personality:{passive:1, emotional:1}}, hint:'入睡 · 梦境'},
            {text:'到了！明天报到，紧张', effects:{affection:{}, thenEvent:'intro_reply_report', personality:{active:1, emotional:1}}, hint:'入睡 · 梦境'},
            {text:'（暂时不回）', effects:{affection:{}, thenEvent:'intro_reply_silent', personality:{independent:1, passive:1}}, hint:'入睡 · 梦境'}
          ]
        }}
      ]
    },
    'intro_reply_sleep': {
      type:'message_batch', delay:1,
      effects:{ flags:{ intro_vibe_sleep: 1 } },
      messages:[
        {from:'susu', text:'晚安！梦里也要替我逛逛霓城哦～'},
        {from:'narrator', text:'（你抱着满身行李箱的味道睡着了。梦里有蝉鸣。）', then:'dream_day1_evt'}
      ]
    },
    'intro_reply_report': {
      type:'message_batch', delay:1,
      effects:{ flags:{ intro_vibe_report: 1 } },
      messages:[
        {from:'susu', text:'紧张什么！你可是我认识的人里最靠谱的！'},
        {from:'susu', text:'明天报到完给我发消息！不许消失！', then:'dream_day1_evt'}
      ]
    },
    'intro_reply_silent': {
      type:'message_batch', delay:1,
      effects:{ flags:{ intro_vibe_silent: 1 } },
      messages:[
        {from:'narrator', text:'（你把手机扣在桌上，没有回。窗外霓城亮得像另一颗星球。）'},
        {from:'narrator', text:'（睡意来得比回复快。）', then:'dream_day1_evt'}
      ]
    },
    // 第一夜梦境（事件包装）
    'dream_day1_evt': { type:'dream', dream:'dream_day1' },

    // ===== 第一天：报到 =====
    'day2_morning': {
      type:'advance_day', text:'次日清晨', hour:8,
      collectible:'stamp_first',  // v0.1.7: 序章完成的唯一发放点（霓城首日戳，与收集柜 how 描述一致）
      then:'shenyan_first_msg'
    },
    'shenyan_first_msg': {
      type:'message_batch', delay:2,
      messages:[
        {from:'shenyan', text:'林夏。我是沈砚之。', then:'shenyan_first_msg_2'}
      ]
    },
    'shenyan_first_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'导师把你的联系方式给我了。九点报到，别迟到。', then:'shenyan_first_msg_3'}
      ]
    },
    'shenyan_first_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'我这个人，最讨厌不守时。', then:'moment_shenyan_opening_evt'}
      ]
    },
    'moment_shenyan_opening_evt': {
      type:'moment_post', moment:'moment_shenyan_opening', collectible:'ticket_gallery',
      then:'luci_reunion_msg'
    },
    // 陆辞的重逢（并发会话）
    'luci_reunion_msg': {
      type:'message_batch', delay:3,
      messages:[
        {from:'luci', text:'诶诶诶！！！林夏是你吗？？？', then:'luci_reunion_msg_2'}
      ]
    },
    'luci_reunion_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'我听说砚美术馆新来个策展人，没想到是你！', then:'luci_reunion_msg_3'}
      ]
    },
    'luci_reunion_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'高中之后多少年没见了？九年？十年？', then:'luci_reunion_msg_4'}
      ]
    },
    // v0.1.10: 汇流节点差异化——陆辞的晚餐邀约，答应与改天各有后续反应
    'luci_reunion_msg_4': {
      type:'message_batch', delay: 0,
      messages:[
        {from:'luci', text:'晚上一起吃饭？我带你认认霓城！', choice:{
          prompt:'陆辞约你晚上吃饭。',
          options:[
            {text:'好啊，下班联系', effects:{affection:{luci:2}, thenEvent:'luci_dinner_yes'}, hint:'陆辞 +2'},
            {text:'今天太累了，下次吧', effects:{affection:{luci:1}, thenEvent:'luci_dinner_next'}, hint:'陆辞 +1（他还是来了）'}
          ]
        }}
      ]
    },
    'luci_dinner_yes': {
      type:'message_batch', delay:1,
      effects:{ flags:{ luci_dinner_yes: 1 } },
      messages:[
        {from:'luci', text:'好！！下班我去美术馆门口接你。'},
        {from:'luci', text:'霓城第一课：别信导航，信我。', then:'bar_invitation'}
      ]
    },
    'luci_dinner_next': {
      type:'message_batch', delay:1,
      effects:{ flags:{ luci_dinner_next: 1 } },
      messages:[
        {from:'luci', text:'……那说好了，下次。'},
        {from:'luci', text:'食堂难吃的话，记得保重胃。别学高中那样啃面包凑合。', then:'bar_invitation'}
      ]
    },

    // 雾港酒吧
    'bar_invitation': {
      type:'advance_time', text:'下班后', minutes:600, collectible:'ticket_bar',
      then:'bar_invitation_msg'
    },
    'bar_invitation_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'下班了吧？来"雾港"，巷子深处那家酒吧', then:'bar_invitation_msg_2'}
      ]
    },
    'bar_invitation_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'我朋友开的，特调全霓城第一', then:'photo_neon_city'}
      ]
    },
    'photo_neon_city': {
      type:'photo_unlock', photo:'neon_city',
      then:'moment_luci_neon_evt'
    },
    'moment_luci_neon_evt': {
      type:'moment_post', moment:'moment_luci_neon',
      then:'jiangyu_first_msg'
    },
    // 江屿登场
    'jiangyu_first_msg': {
      type:'message_batch', delay:3,
      messages:[
        {from:'jiangyu', text:'……', then:'jiangyu_first_msg_2'}
      ]
    },
    'jiangyu_first_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'今天那杯酒，算我请的。我是江屿。', then:'jiangyu_first_msg_3'}
      ]
    },
    'jiangyu_first_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'你叫林夏。', then:'jiangyu_first_msg_4'}
      ]
    },
    // v0.1.10: 汇流节点差异化——是否通过好友申请，他的反应不同（但深夜电话都会来）
    'jiangyu_first_msg_4': {
      type:'message_batch', delay: 1,
      messages:[
        {from:'jiangyu', text:'名字不错。', choice:{
          prompt:'他要加你好友。',
          options:[
            {text:'通过', effects:{affection:{jiangyu:1}, thenEvent:'jiangyu_friend_yes'}, hint:'江屿 +1'},
            {text:'（不通过）', effects:{affection:{jiangyu:0}, thenEvent:'jiangyu_friend_no'}, hint:'他还是会打来'}
          ]
        }}
      ]
    },
    'jiangyu_friend_yes': {
      type:'message_batch', delay:1,
      effects:{ flags:{ jiangyu_friend_yes: 1 } },
      messages:[
        {from:'narrator', text:'（通过好友申请的那一秒，对面就发来一个举杯的表情。）'},
        {from:'jiangyu', text:'雾港见。', then:'jiangyu_call_night'}
      ]
    },
    'jiangyu_friend_no': {
      type:'message_batch', delay:1,
      effects:{ flags:{ jiangyu_friend_no: 1 } },
      messages:[
        {from:'narrator', text:'（你没有通过。手机安静了三分钟，然后又震了一下——第二条好友申请，验证消息写着：）'},
        {from:'jiangyu', text:'不留也行。反正霓城不大。', then:'jiangyu_call_night'}
      ]
    },

    // 江屿来电
    'jiangyu_call_night': {
      type:'call', delay:2,
      from:'jiangyu',
      script:[
        {who:'him', text:'……喂。'},
        {who:'him', text:'我是江屿。今天的酒，味道还好吗。'},
        {who:'choice', options:[
          {text:'好喝。怎么突然打电话？'},
          {text:'还行。有事吗？'}
        ]},
        {who:'him', text:'没什么事。只是想确认一下。'},
        {who:'him', text:'我写过一首歌，叫《夏》。歌词里的人，也叫林夏。'},
        {who:'him', text:'但那是很多年前的事了。别多想。只是巧合。'},
        {who:'choice', options:[
          {text:'真的只是巧合吗？', effects:{affection:{jiangyu:2}}},
          {text:'好。我不问。', effects:{affection:{jiangyu:1}}}
        ]},
        {who:'him', text:'……晚安。'}
      ],
      onDecline:'jiangyu_call_declined',
      then:'music_xia_unlock'
    },
    'jiangyu_call_declined': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'……没事。晚安。'}],
      then:'music_xia_unlock'
    },
    'music_xia_unlock': {
      type:'music_unlock', music:'xia',
      then:'moment_jiangyu_bar_evt'
    },
    'moment_jiangyu_bar_evt': {
      type:'moment_post', moment:'moment_jiangyu_bar',
      then:'dream_day2_evt'
    },
    // 第二夜梦境（事件包装）
    'dream_day2_evt': { type:'dream', dream:'dream_day2' },

    // ===== 第三天：沈砚之的考验 =====
    'day3_shenyan_test': {
      type:'advance_day', text:'第三天', hour:10,
      then:'shenyan_test_msg'
    },
    'shenyan_test_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'来我办公室。', then:'shenyan_test_msg_2'}
      ]
    },
    'shenyan_test_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'下周开幕式，你来盯。', then:'shenyan_test_msg_3'}
      ]
    },
    'shenyan_test_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'你不是说你相信直觉吗。', then:'shenyan_test_choice'}
      ]
    },
    'shenyan_test_choice': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'怎么，不愿意？', choice:{
          prompt:'沈砚之的考验。你的回复：',
          options:[
            {text:'好，我来盯。', effects:{affection:{shenyan:2}, flags:{shenyan_brave:1}, thenEvent:'shenyan_test_reply_1'}, hint:'沈砚之 +2'},
            {text:'我可能还不够资格…', effects:{affection:{shenyan:0}, thenEvent:'shenyan_test_reply_2'}, hint:'沈砚之 +0'},
            {text:'为什么选我？', effects:{affection:{shenyan:1}, thenEvent:'shenyan_test_reply_3'}, hint:'沈砚之 +1'}
          ]
        }}
      ]
    },
    'shenyan_test_reply_1': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'不错。比我想的，要勇敢。明天九点，会议室见。'}],
      then:'luci_care_msg'
    },
    'shenyan_test_reply_2': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'是吗。那就算了。我自己来。'}],
      then:'luci_care_msg'
    },
    'shenyan_test_reply_3': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'因为你不会问"为什么"。结果你问了。不过没关系。'}],
      then:'luci_care_msg'
    },

    // 陆辞的关心
    'luci_care_msg': {
      type:'message_batch', delay:3,
      messages:[
        {from:'luci', text:'听说你被沈砚之点名盯开幕式了？', then:'luci_care_msg_2'}
      ]
    },
    'luci_care_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'那家伙……你离他远点。', choice:{
          prompt:'陆辞的话里似乎有别的意思。',
          options:[
            {text:'你说"离他远点"是什么意思？', effects:{affection:{luci:2}, thenEvent:'luci_care_reply_1'}, hint:'陆辞 +2'},
            {text:'谢谢你啦，我会注意的', effects:{affection:{luci:1}, thenEvent:'luci_care_reply_2'}, hint:'陆辞 +1'}
          ]
        }}
      ]
    },
    'luci_care_reply_1': {
      type:'message_batch', delay:1,
      messages:[{from:'luci', text:'我之前给他拍过封面。他看人的眼神，像在估价。我不希望你被他那样看。'}],
      then:'dream_day3_evt'
    },
    'luci_care_reply_2': {
      type:'message_batch', delay:1,
      messages:[{from:'luci', text:'嗯……有什么事，随时找我。'}],
      then:'dream_day3_evt'
    },
    // 第三夜梦境（事件包装）
    'dream_day3_evt': { type:'dream', dream:'dream_day3' },

    // ===== 开幕式当天 =====
    'opening_day': {
      type:'advance_day', text:'开幕式当天', hour:18,
      then:'opening_shenyan_msg'
    },
    'opening_shenyan_msg': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'林夏，开幕式还有一小时开始。你来一下展厅。', then:'moment_shenyan_opening_day_evt'}]
    },
    'moment_shenyan_opening_day_evt': {
      type:'moment_post', moment:'moment_shenyan_opening_day',
      then:'opening_tension'
    },
    'opening_tension': {
      type:'message_batch', delay:3,
      messages:[
        {from:'luci', text:'林夏，给你拍张工作照？', choice:{
          prompt:'两个男人之间的气氛微妙。',
          options:[
            {text:'陪沈砚之应酬', effects:{affection:{shenyan:2}, thenEvent:'opening_choice_shenyan'}, hint:'沈砚之 +2'},
            {text:'陪陆辞拍照', effects:{affection:{luci:2}, thenEvent:'opening_choice_luci'}, hint:'陆辞 +2'},
            {text:'借口去后台', effects:{affection:{}, thenEvent:'opening_choice_neutral'}, hint:'保持中立'}
          ]
        }}
      ]
    },
    // v0.1.9: 三分支差异化——开幕夜选择不再直接汇流，各插入一段"同行去天台"的专属过渡
    // （shenyan/luci/neutral 三条路径各有一段独有剧情与 flag，之后仍汇流到天台主线）
    'opening_choice_shenyan': {
      type:'message_batch', delay:1,
      effects:{ flags:{ opening_vibe_shenyan: 1 } },
      messages:[
        {from:'shenyan', text:'走吧，给你介绍几个人。', then:'opening_walk_shenyan'}
      ]
    },
    'opening_choice_luci': {
      type:'message_batch', delay:1,
      effects:{ flags:{ opening_vibe_luci: 1 } },
      messages:[
        {from:'luci', text:'看这边——笑一个。你笑起来，比那幅画好看多了。', then:'opening_walk_luci'}
      ]
    },
    'opening_choice_neutral': {
      type:'message_batch', delay:1,
      effects:{ flags:{ opening_vibe_neutral: 1 } },
      messages:[
        {from:'narrator', text:'（你借口去后台，留下两个男人意味深长的沉默。）', then:'opening_walk_neutral'}
      ]
    },
    'opening_walk_shenyan': {
      type:'message_batch', delay:1,
      messages:[
        {from:'narrator', text:'（沈砚之走在你左侧，步子不快，替你挡开举着相机的人群。）'},
        {from:'shenyan', text:'介绍就免了。他们的画会替自己说话。', then:'opening_walk_shenyan_2'}
      ]
    },
    'opening_walk_shenyan_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'天台有个陌生人，不归我管。', then:'rooftop_jiangyu'}
      ]
    },
    'opening_walk_luci': {
      type:'message_batch', delay:1,
      messages:[
        {from:'narrator', text:'（陆辞半跑着在前面带路，像高中放学时那样回头喊你跟上。）'},
        {from:'luci', text:'天台！我刚才踩过点了，视野最好——咳，不是，我什么都还没喝。', then:'opening_walk_luci_2'}
      ]
    },
    'opening_walk_luci_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'……上面那个人看你的眼神有点复杂。认识的朋友？', then:'rooftop_jiangyu'}
      ]
    },
    'opening_walk_neutral': {
      type:'message_batch', delay:1,
      messages:[
        {from:'narrator', text:'（你自己穿过人群，在通往天台的楼梯口遇到一个刚抽完烟的人。他掐了烟，侧身让你先走。）'},
        {from:'narrator', text:'（酒气混着夜风。他跟在你后面上了楼，谁也没说话。）', then:'rooftop_jiangyu'}
      ]
    },

    // 天台
    'rooftop_jiangyu': {
      type:'advance_time', text:'夜深了', minutes:240,
      then:'rooftop_jiangyu_msg'
    },
    'rooftop_jiangyu_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'你在天台吗。', then:'rooftop_jiangyu_msg_2'}
      ]
    },
    'rooftop_jiangyu_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'我也在。今天累吧。', then:'rooftop_jiangyu_msg_3'}
      ]
    },
    'rooftop_jiangyu_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'累的时候，适合看灯。霓城的夜，像谁的心事，亮着却没人懂。', choice:{
          prompt:'夜风里，你的心跳漏了一拍。',
          options:[
            {text:'靠近他一点', effects:{affection:{jiangyu:2}, thenEvent:'rooftop_jiangyu_close'}, hint:'江屿 +2'},
            {text:'礼貌保持距离', effects:{affection:{jiangyu:0}, thenEvent:'rooftop_jiangyu_distanced'}, hint:'江屿 +0'}
          ]
        }}
      ]
    },
    'rooftop_jiangyu_close': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'你这个人，总让人想靠近。'}],
      then:'photo_rooftop'
    },
    'rooftop_jiangyu_distanced': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'……早点回去休息。'}],
      then:'photo_rooftop'
    },
    'photo_rooftop': {
      type:'photo_unlock', photo:'rooftop_night',
      then:'route_choice_night'
    },

    // ===== 路线选择之夜 =====
    'route_choice_night': {
      type:'advance_day', text:'一个无眠的夜晚', hour:23,
      then:'route_choice_msgs'
    },
    'route_choice_msgs': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'早些休息。'},
        {from:'luci', text:'今天谢谢你。晚安。'},
        {from:'jiangyu', text:'……'},
        {from:'narrator', text:'（三个人同时发来消息。你回谁，将决定你的心属于谁。）'}
      ],
      then:'route_choice_trigger'
    },
    'route_choice_trigger': {
      type:'route_choice'
    },

    // ===== 沈砚之线 =====
    'route_shenyan_start': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'明天来办公室。有个出差，跟我一起去南方。', then:'route_shenyan_start_2'}]
    },
    'route_shenyan_start_2': {
      type:'message_batch', delay:0,
      messages:[{from:'shenyan', text:'别人我不放心。', then:'route_shenyan_south'}]
    },
    'route_shenyan_south': {
      type:'advance_day', text:'南方出差', hour:20, collectible:'postcard_sea',
      // v0.1.6: 补上 flag 写入，否则「海雾」主题（themes.sea）永远无法解锁
      effects:{ flags:{ shenyan_south:true } },
      then:'route_shenyan_dinner'
    },
    'route_shenyan_dinner': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'这位是周先生。林夏，我新来的策展人。', then:'route_shenyan_dinner_2'}
      ]
    },
    'route_shenyan_dinner_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'narrator', text:'（他介绍你时，像在介绍一件作品。你感到不适。）', choice:{
          prompt:'晚宴上你感到被"展示"。',
          options:[
            {text:'配合他，回去再说', effects:{affection:{shenyan:1}, flags:{shenyan_obey:1}, thenEvent:'route_shenyan_rain'}, hint:'向 BAD END'},
            {text:'当场夺回主动', effects:{affection:{shenyan:2}, flags:{shenyan_resist:1}, thenEvent:'route_shenyan_rain'}, hint:'向 GOOD END'}
          ]
        }}
      ]
    },
    'route_shenyan_rain': {
      type:'advance_time', text:'雨夜回程', minutes:180,
      then:'route_shenyan_rain_msg'
    },
    'route_shenyan_rain_msg': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'对不起。我忘了你不是我。家里逼我活成一个"沈砚之"。只有遇见你时，我才是我自己。', then:'route_shenyan_control'}]
    },
    'route_shenyan_control': {
      type:'advance_day', text:'半个月后', hour:9,
      then:'route_shenyan_control_msg'
    },
    'route_shenyan_control_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'今天别穿白衬衫，不适合你。', then:'route_shenyan_control_msg_2'}
      ]
    },
    'route_shenyan_control_msg_2': {
      type:'message_batch', delay:2,
      messages:[
        {from:'luci', text:'林夏！你最近怎么了？我给你打了五个电话，都是沈砚之接的。', then:'route_shenyan_control_msg_3'}
      ]
    },
    'route_shenyan_control_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'他说你忙。可你根本没收到过那些电话，对吧？', choice:{
          prompt:'你意识到沈砚之在替你"过滤"外界。',
          options:[
            {text:'立刻去找陆辞问清楚', effects:{affection:{}, flags:{shenyan_awaken:1}, thenEvent:'route_shenyan_cafe'}, hint:'决心破局'},
            {text:'替沈砚之解释', effects:{affection:{}, flags:{shenyan_deny:1}, thenEvent:'route_shenyan_end_check'}, hint:'滑向 BAD END'}
          ]
        }}
      ]
    },
    'route_shenyan_cafe': {
      type:'message_batch', delay:1,
      messages:[{from:'luci', text:'无论你选谁，都不能选一个让你"消失"的人。', then:'route_shenyan_end_check'}]
    },
    'route_shenyan_end_check': {
      type:'message_batch', delay:2,
      messages:[
        {from:'narrator', text:'（你意识到这段关系出了问题。你的选择是？）', choice:{
          prompt:'你的最后抉择：',
          options:[
            {text:'和他正面对峙', effects:{affection:{}, flags:{shenyan_choice:'confront'}, thenEvent:'__shenyan_end_judge'}, hint:'决心破局'},
            {text:'默默忍受', effects:{affection:{}, flags:{shenyan_choice:'endure'}, thenEvent:'__shenyan_end_judge'}, hint:'滑向 BAD END'}
          ]
        }}
      ]
    },
    // 结局判定：累积 flag 决定走向，最终选择作为修正
    '__shenyan_end_judge': {
      type:'ending', delay:0,
      _compute: s => STORY.computeEnding(s, 'shenyan')
    },
    'ending_shenyan_good': { type:'ending', ending:'shenyan_good' },
    'ending_shenyan_bad': { type:'ending', ending:'shenyan_bad' },

    // ===== 陆辞线 =====
    'route_luci_start': {
      type:'message_batch', delay:1, collectible:'memento_camera',
      messages:[{from:'luci', text:'明天周末，带你重走一遍我们以前的学校？往返四小时，赶得及吃晚饭。', then:'route_luci_school'}]
    },
    'route_luci_school': {
      type:'advance_day', text:'母校之行', hour:19, collectible:'postcard_school',
      then:'route_luci_rooftop'
    },
    'route_luci_rooftop': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'就是这儿。高二那年，被人堵的就是这里。是你把我拉出来的。', then:'route_luci_rooftop_2'}
      ]
    },
    'route_luci_rooftop_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'从那天起，我就告诉自己，要变强。强到，可以站到你身边。', then:'route_luci_rooftop_3'}
      ]
    },
    'route_luci_rooftop_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'林夏，有句话我憋了九年。我喜欢你。从高一你借我橡皮那天，到现在。', choice:{
          prompt:'他说出口了。',
          options:[
            {text:'让他继续说', effects:{affection:{luci:2}, flags:{luci_confess:1}, thenEvent:'route_luci_after_confess'}, hint:'向 GOOD END'},
            {text:'岔开话题', effects:{affection:{luci:1}, flags:{luci_avoid:1}, thenEvent:'route_luci_after_confess'}, hint:'向 BAD END'}
          ]
        }}
      ]
    },
    'route_luci_after_confess': {
      type:'advance_day', text:'此后的日子', hour:10,
      then:'route_luci_album'
    },
    'route_luci_album': {
      type:'photo_unlock', photo:'luci_album',
      then:'route_luci_milan'
    },
    'route_luci_milan': {
      type:'message_batch', delay:2,
      messages:[
        {from:'luci', text:'林夏，米兰那边的工作室邀我过去驻半年。下个月的飞机。', then:'route_luci_milan_2'}
      ]
    },
    'route_luci_milan_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'你不用回答我。我只是……来道个别。', choice:{
          prompt:'他就要走了。',
          options:[
            {text:'喊住他，不让他走', effects:{affection:{}, flags:{luci_stop:1}, thenEvent:'route_luci_chase_rain'}},
            {text:'看着他离开', effects:{affection:{}, flags:{luci_letgo:1}, thenEvent:'route_luci_rain_night'}}
          ]
        }}
      ]
    },
    'route_luci_chase_rain': {
      type:'message_batch', delay:1,
      messages:[{from:'luci', text:'……你来了。'}],
      then:'route_luci_end_check'
    },
    'route_luci_rain_night': {
      type:'advance_time', text:'雨夜', minutes:120,
      then:'route_luci_ticket'
    },
    'route_luci_ticket': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'（信封里是一张去米兰的机票，名字写着：林夏。背面：如果你愿意，我们一起走。）', choice:{
          prompt:'雨水模糊了视线。',
          options:[
            {text:'追去他家', effects:{affection:{}, flags:{luci_chase:1}, thenEvent:'route_luci_end_check'}},
            {text:'站在雨里直到天亮', effects:{affection:{}, flags:{luci_giveup:1}, thenEvent:'route_luci_end_check'}}
          ]
        }}
      ]
    },
    'route_luci_end_check': {
      type:'message_batch', delay:2,
      messages:[
        {from:'narrator', text:'（看到他藏了九年的心意。你的选择是？）', choice:{
          prompt:'你的最后抉择：',
          options:[
            {text:'去找他，回应他', effects:{affection:{}, flags:{luci_choice:'accept'}, thenEvent:'__luci_end_judge'}, hint:'向 GOOD END'},
            {text:'错过时机', effects:{affection:{}, flags:{luci_choice:'miss'}, thenEvent:'__luci_end_judge'}, hint:'向 BAD END'}
          ]
        }}
      ]
    },
    '__luci_end_judge': {
      type:'ending', delay:0,
      _compute: s => STORY.computeEnding(s, 'luci')
    },
    'ending_luci_good': { type:'ending', ending:'luci_good' },
    'ending_luci_bad': { type:'ending', ending:'luci_bad' },

    // ===== 江屿线 =====
    'route_jiangyu_start': {
      type:'message_batch', delay:1, collectible:'recording_xia',
      messages:[{from:'jiangyu', text:'今晚来雾港。想跟你说说话。', then:'route_jiangyu_sister'}]
    },
    'route_jiangyu_sister': {
      type:'advance_day', text:'几天后', hour:9,
      then:'route_jiangyu_grave_msg'
    },
    'route_jiangyu_grave_msg': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'今天，能陪我去个地方吗。', then:'route_jiangyu_grave'}]
    },
    'route_jiangyu_grave': {
      type:'advance_time', text:'墓园', minutes:120,
      then:'route_jiangyu_grave_2'
    },
    'route_jiangyu_grave_2': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'我妹妹，也叫林夏。十四年前的夏天，白血病。小夏，哥带了个人来看你。她跟你一样倔。', then:'route_jiangyu_death_anniv'}]
    },
    'route_jiangyu_death_anniv': {
      type:'advance_day', text:'鼓手忌日', hour:23,
      then:'route_jiangyu_breakdown'
    },
    'route_jiangyu_breakdown': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'三年了。我一闭上眼，就看见他笑着回头跟我说："江屿，最后一首了！"', then:'route_jiangyu_breakdown_2'}
      ]
    },
    'route_jiangyu_breakdown_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'我活着，有什么用。', choice:{
          prompt:'他在崩溃的边缘。',
          options:[
            {text:'抱住他，什么都不说', effects:{affection:{jiangyu:2}, flags:{jiangyu_hold:1}, thenEvent:'route_jiangyu_relic'}, hint:'向 GOOD END'},
            {text:'让他一个人静一静', effects:{affection:{jiangyu:1}, flags:{jiangyu_leave:1}, thenEvent:'route_jiangyu_relic'}, hint:'向 BAD END'}
          ]
        }}
      ]
    },
    'route_jiangyu_relic': {
      type:'advance_day', text:'三天后', hour:14,
      then:'route_jiangyu_relic_msg'
    },
    'route_jiangyu_relic_msg': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'整理阿哲的遗物时，发现他没写完的副歌。我想把它写完。可我每次写到副歌，就写不下去。', then:'route_jiangyu_show'}]
    },
    'route_jiangyu_show': {
      type:'advance_day', text:'一个月后', hour:21, collectible:'evidence_photo',
      then:'route_jiangyu_show_msg'
    },
    'route_jiangyu_show_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'今晚雾港，我想试试登台。只请了你一个人。', then:'route_jiangyu_show_msg_2'}
      ]
    },
    'route_jiangyu_show_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'我可能唱不完。但我想试。', choice:{
          prompt:'他唱到副歌前，停了。',
          options:[
            {text:'站起来，走到台前', effects:{affection:{}, flags:{jiangyu_stand:1}, thenEvent:'route_jiangyu_end_check'}},
            {text:'安静等他自己开口', effects:{affection:{}, flags:{jiangyu_silent:1}, thenEvent:'route_jiangyu_end_check'}}
          ]
        }}
      ]
    },
    'route_jiangyu_end_check': {
      type:'message_batch', delay:2,
      messages:[
        {from:'narrator', text:'（你看到他在泥潭里挣扎。你的选择是？）', choice:{
          prompt:'你的最后抉择：',
          options:[
            {text:'陪他一起写完那首歌', effects:{affection:{}, flags:{jiangyu_choice:'stay'}, thenEvent:'__jiangyu_end_judge'}, hint:'向 GOOD END'},
            {text:'让他独自面对过去', effects:{affection:{}, flags:{jiangyu_choice:'leave'}, thenEvent:'__jiangyu_end_judge'}, hint:'向 BAD END'}
          ]
        }}
      ]
    },
    '__jiangyu_end_judge': {
      type:'ending', delay:0,
      _compute: s => STORY.computeEnding(s, 'jiangyu')
    },
    'ending_jiangyu_good': { type:'ending', ending:'jiangyu_good' },
    'ending_jiangyu_bad': { type:'ending', ending:'jiangyu_bad' },

    // ===== 真结局线 =====
    'route_solo_start': {
      type:'message_batch', delay:1,
      messages:[
        {from:'narrator', text:'（你把手机扣在桌上，谁都没回。今天，太累了。）'}
      ],
      then:'route_solo_day2'
    },
    'route_solo_day2': {
      type:'advance_day', text:'第二天', hour:10,
      then:'route_solo_day2_msg'
    },
    'route_solo_day2_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'昨晚的消息，你没回。'},
        {from:'luci', text:'林夏，昨晚……没事吧？'},
        {from:'jiangyu', text:'睡不着的时候，喝这个。不用回。（附一张"夏"特调的图）'}
      ],
      then:'route_solo_work'
    },
    'route_solo_work': {
      type:'advance_day', text:'一个月后', hour:3,
      then:'route_solo_work_msg'
    },
    'route_solo_work_msg': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'你这种拼命法，是想让我心疼，还是想让我心疼死。', then:'route_solo_help'}]
    },
    'route_solo_help': {
      type:'advance_day', text:'开幕前一周', hour:19,
      then:'route_solo_help_msgs'
    },
    'route_solo_help_msgs': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'夜景素材，不要钱，只想帮你。'},
        {from:'jiangyu', text:'展厅背景音，我重新编的简版。你挑挑。'},
        {from:'shenyan', text:'不用谢。这是你应得的。'}
      ],
      then:'route_solo_end_choice'
    },
    'route_solo_end_choice': {
      type:'message_batch', delay:2,
      messages:[
        {from:'narrator', text:'（三个人都在等你。你的回应是？）', choice:{
          prompt:'你的最后抉择：',
          options:[
            {text:'感谢，但婉拒所有暧昧', effects:{affection:{}, flags:{solo_independent:1}, thenEvent:'ending_true'}},
            {text:'接受帮助，保持距离', effects:{affection:{}, flags:{solo_accept:1}, thenEvent:'ending_true'}}
          ]
        }}
      ]
    },
    'ending_true': { type:'ending', _compute: s => STORY.computeEnding(s, 'solo') },

    // ===== v0.1.7: 幽灵消息彩蛋（egg_ghost_msg 的达成条件） =====
    // 第 4 天凌晨 2 点送达——一条迟到五年的消息。advanceToNextDay 现在会补查睡眠跨过的中间小时，
    // 所以无论玩家当晚几点睡下都能收到。
    'ghost_msg_5y': {
      type:'message_batch', delay:0,
      trigger:{ day:4, hour:2 },
      effects:{ flags:{ ghost_msg_triggered:true } },
      messages:[
        {from:'luci', text:'……睡了吗？', then:'ghost_msg_5y_2'}
      ]
    },
    'ghost_msg_5y_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'翻旧手机，翻到五年前的一条草稿。打了很长，一直没敢发。', then:'ghost_msg_5y_3'}
      ]
    },
    'ghost_msg_5y_3': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'"今天你回头笑的样子，像整个夏天。"', then:'ghost_msg_5y_4'}
      ]
    },
    'ghost_msg_5y_4': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'迟到了五年的晚安。快睡吧，明天还要去美术馆报到。'}
      ]
    },

    // ===== v0.1.10: 暧昧度分项——深夜心动独白（tension≥10 时 23 点后触发，每角色一次） =====
    'tension_whisper_shenyan': {
      type:'message_batch', delay:0,
      effects:{ flags:{ whisper_shenyan_done: 1 } },
      messages:[
        {from:'shenyan', text:'还没睡。'},
        {from:'shenyan', text:'……美术馆的灯，替你留了一盏。'}
      ]
    },
    'tension_whisper_luci': {
      type:'message_batch', delay:0,
      effects:{ flags:{ whisper_luci_done: 1 } },
      messages:[
        {from:'luci', text:'想你想到睡不着，很幼稚吧。'},
        {from:'luci', text:'——当我没发。快睡。'}
      ]
    },
    'tension_whisper_jiangyu': {
      type:'message_batch', delay:0,
      effects:{ flags:{ whisper_jiangyu_done: 1 } },
      messages:[
        {from:'jiangyu', text:'新写的旋律，还差一句词。'},
        {from:'jiangyu', text:'词是：「深夜的风把你吹进我梦里」。睡觉。'}
      ]
    },

    // ===== v0.1.12: 塔罗次日指引——换日早晨按昨日牌面 hint 类型播报（苏苏人设：运势播报担当） =====
    'tarot_morning_encounter': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面提示：今天「相遇」的运势很高——走哪条路都可能撞见熟人哦。'},
        {from:'susu', text:'出门前记得照镜子，把最好看的样子带上！'}
      ]
    },
    'tarot_morning_affection': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面全是恋爱的味道——今天谁对你好一点，都不是巧合。'},
        {from:'susu', text:'心跳的时候别否认，是你自己的心在跳。'}
      ]
    },
    'tarot_morning_memory': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面指向「过去」——旧东西、旧地方、旧话题，今天都可能翻出来。'},
        {from:'susu', text:'翻到旧照片别急着划走，说不定有你想不起来的细节。'}
      ]
    },
    'tarot_morning_rational': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面提示：今天适合动脑子不适合动心。'},
        {from:'susu', text:'有决定要做的话，列个清单再选。'}
      ]
    },
    'tarot_morning_independent': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面只有两个字：「自己」。'},
        {from:'susu', text:'今天谁的话都可以听一半——包括这句。'}
      ]
    },
    'tarot_morning_luck': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面是好运预备——今天买咖啡可能买一送一，记得领！'},
        {from:'susu', text:'运气这东西，用掉才有。冲！'}
      ]
    },
    'tarot_morning_ending_hint': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨天那张牌……有点重，是「结局」的牌。'},
        {from:'susu', text:'最近做的每个决定，都在悄悄写结局。慎重，但别怕。'}
      ]
    },
    'tarot_morning_dream': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面与「梦」有关——今晚睡前别刷手机，梦会给你答案。'},
        {from:'susu', text:'醒来记得记下来，梦是限时的。'}
      ]
    },

    // ===== v0.1.12: 群聊第二波——周末聚餐投票（day6 晚上触发，群 choice 写性格与 flag） =====
    'group_neon_wave2_vote': {
      type:'group_message_batch', delay:0, groupId:'group_neon',
      trigger:{ day:6, hour:21 },
      messages:[
        {from:'susu', text:'通知！本周六「霓城小分队」首次线下聚餐！地点投票，现在开始！', then:'group_neon_wave2_vote2'}
      ]
    },
    'group_neon_wave2_vote2': {
      type:'group_message_batch', delay:1, groupId:'group_neon',
      messages:[
        {from:'luci', text:'+1！我可以负责摄影记录。'},
        {from:'jiangyu', text:'都行。别选要我唱歌的地方。'},
        {from:'shenyan', text:'看日程。若在美术馆附近，可预留包间。', choice:{
          prompt:'聚餐地点投票：',
          options:[
            {text:'火锅——热闹最重要', effects:{flags:{group_dinner_hotpot:1}, personality:{emotional:1, active:1}}, thenEvent:'group_neon_wave2_after', hint:'苏苏喜欢'},
            {text:'居酒屋——喝一点刚好', effects:{affection:{jiangyu:1}, flags:{group_dinner_izakaya:1}, personality:{rational:1}}, thenEvent:'group_neon_wave2_after', hint:'江屿主场'},
            {text:'美术馆包间——安静', effects:{affection:{shenyan:1}, flags:{group_dinner_gallery:1}, personality:{passive:1}}, thenEvent:'group_neon_wave2_after', hint:'沈砚之主场'}
          ]
        }}
      ]
    },
    'group_neon_wave2_after': {
      type:'group_message_batch', delay:1, groupId:'group_neon',
      messages:[
        {from:'susu', text:'投票有效！周六晚上七点，不许请假，不许迟到！'},
        {from:'susu', text:'（本群唯一的宗旨：盯紧我们夏夏的幸福进度。）'}
      ]
    },

    // ===== v0.2.0: 群聊聚餐现场——按 day6 投票 flag 分歧（checkGroupDinner 于 day7 晚派发） =====
    'group_dinner_scene_hotpot': {
      type:'group_message_batch', delay:0, groupId:'group_neon',
      effects:{ affection:{jiangyu:1}, personality:{emotional:1} },
      messages:[
        {from:'susu', text:'🔥首聚现场直击：红锅已开，毛肚已下，人齐了！'},
        {from:'luci', text:'[图片] 九宫格。谁点的脑花，站出来。'},
        {from:'jiangyu', text:'我。涮好了给你们留两筷子。'},
        {from:'shenyan', text:'……辣度超预期。水。'},
        {from:'susu', text:'沈老板居然真的来了！夏夏你坐他旁边对不对！拍照了！'}
      ]
    },
    'group_dinner_scene_izakaya': {
      type:'group_message_batch', delay:0, groupId:'group_neon',
      effects:{ affection:{jiangyu:1}, personality:{rational:1} },
      messages:[
        {from:'susu', text:'🏮首聚现场：居酒屋小间已包，烤串无限追加！'},
        {from:'jiangyu', text:'老板，梅子茶泡饭一份——她的。别的随意。'},
        {from:'luci', text:'[图片] 招牌灯下的合影申请，举手的都入镜。'},
        {from:'shenyan', text:'角落位置已占。观灯，比看人舒服。'},
        {from:'susu', text:'沈老板你入了！我看到你举手了！照片为证！'}
      ]
    },
    'group_dinner_scene_gallery': {
      type:'group_message_batch', delay:0, groupId:'group_neon',
      effects:{ affection:{shenyan:1}, personality:{passive:1} },
      messages:[
        {from:'susu', text:'🎨首聚现场：美术馆包间，据说菜单都是沈老板亲选。'},
        {from:'shenyan', text:'闭馆后的展厅，顺路可以看一眼。只一眼。'},
        {from:'luci', text:'[图片] 月光展厅走廊。这张必须发朋友圈。'},
        {from:'jiangyu', text:'这里连酒杯声音都是安静的。有点意思。'},
        {from:'susu', text:'闭馆后的美术馆！四个人包场！这待遇可以吹一年！'}
      ]
    },

    // ===== v0.2.0: 雨天限定——首个雨天晚 20 点后触发（checkRainEvents 派发） =====
    'rain_ambush_msg': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'下雨了！！你带伞没？我看气象雷达，那片一时半会停不了！'},
        {from:'susu', text:'（窗外，霓城泡在雨里。灯牌的光晕被雨拉成一条条彩线。）', choice:{
          prompt:'雨越下越大。你决定：',
          options:[
            {text:'冲进雨里跑回家', effects:{personality:{active:1, independent:1}, flags:{rain_choice_run:1}, thenEvent:'rain_ambush_after'}, hint:'淋一场，清醒一场'},
            {text:'在檐下等雨小', effects:{personality:{passive:1, rational:1}, flags:{rain_choice_wait:1}, thenEvent:'rain_ambush_after'}, hint:'听雨十分钟'},
            {text:'叫苏苏来接', effects:{personality:{dependent:1, emotional:1}, flags:{rain_choice_susu:1}, thenEvent:'rain_ambush_after'}, hint:'闺蜜是雨天的正义'}
          ]
        }}
      ]
    },
    'rain_ambush_after': {
      type:'message_batch', delay:2,
      messages:[
        {from:'susu', text:'到家记得喝热的！别感冒！霓城的雨，说大就大。'}
      ]
    },

    // ===== v0.2.0: 中后期日常（day7-10）——选项回复按性格分化 =====
    'week1_review': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发，防止侵入男主线结局段
      trigger:{ day:7, hour:9, soloOnly:true },
      messages:[
        {from:'narrator', text:'（来霓城的第七天。闹钟响之前你就醒了——身体先接受了这座城市的节奏。）', choice:{
          prompt:'躺在床上，你想：',
          options:[
            {text:'这一周认识了三个人，不错', effects:{personality:{active:1, rational:1}, thenEvent:'day7_shenyan_evening'}, reply:'（你把三个名字在心里过了一遍，像清点战利品。）'},
            {text:'好像还是没适应', effects:{personality:{passive:1, emotional:1}, thenEvent:'day7_shenyan_evening'}, reply:'（陌生感没有消失，只是学会了和它同睡一张床。）'},
            {text:'先起来，想这些没用', effects:{personality:{independent:1, rational:1}, thenEvent:'day7_shenyan_evening'}, reply:'（你掀开被子。霓城不相信赖床的人。）'}
          ]
        }}
      ]
    },
    'day7_shenyan_evening': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发
      trigger:{ day:7, hour:19, soloOnly:true },
      messages:[
        {from:'shenyan', text:'布展方案通过了。今晚不留下来加班？——这是陈述，不是命令。'},
        {from:'shenyan', text:'（你注意到，他开始区分"命令"和"请求"了。）'}
      ]
    },
    'day8_luci_photos': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发
      trigger:{ day:8, hour:13, soloOnly:true },
      messages:[
        {from:'luci', text:'[图片] 早上扫街拍的。霓城早上七点和晚上七点，是两个城市。'},
        {from:'luci', text:'哪张好？我投第二张——构图里有你上周站过的那个路口。'}
      ]
    },
    'day8_jiangyu_clip': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发
      trigger:{ day:8, hour:22, soloOnly:true },
      messages:[
        {from:'jiangyu', text:'[语音 12"]'},
        {from:'jiangyu', text:'新歌demo，副歌还缺两个字。睡不着的代价就是半夜写歌。'}
      ]
    },
    'day9_susu_gossip': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发
      trigger:{ day:9, hour:15, soloOnly:true },
      messages:[
        {from:'susu', text:'重大情报！！本周你被三个人同时约的概率是100%！！'},
        {from:'susu', text:'（统计样本：我。误差范围：我说是就是。）'}
      ]
    },
    'day10_morning_reflect': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发
      trigger:{ day:10, hour:8, soloOnly:true },
      messages:[
        {from:'narrator', text:'（第十天。窗外的霓虹灯还没醒，城市露出少见的灰色轮廓。）', choice:{
          prompt:'难得安静的清晨。你决定：',
          options:[
            {text:'出门走走，看看睡着的霓城', effects:{personality:{active:1, independent:1}}, reply:'（你拍下了一张没有霓虹的霓城。相册里第一张"素颜"照片。）', hint:'独立探索'},
            {text:'给最近聊得最多的人发早安', effects:{personality:{dependent:1, emotional:1}}, reply:'（发出去三秒就收到回复。原来也有人醒着。）', hint:'主动联结'},
            {text:'再睡半小时，难得不用赶', effects:{personality:{passive:1}}, reply:'（你把闹钟按掉。十分钟后自然醒，窗外已经亮了。）', hint:'休息'}
          ]
        }}
      ]
    }
  },
});

// ===== v0.1.8: 由 story/18_patches.js 收编的历史增量语句（保持逐字不变） =====
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
