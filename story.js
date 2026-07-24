/* ===== 霓虹心事 · 手机模拟剧情数据 =====
 * 玩法：剧情通过手机消息/电话/相册解锁推进，玩家自主决定何时回应
 * 设计：所有剧情节点用 then/thenEvent 串联，choice 的 thenEvent 由玩家点击触发
 */

const STORY = {
  characters: {
    linxia: {name:'林夏', color:'#ff5fa8', avatar:'林', bg:'#5a2a4a'},
    shenyan: {name:'沈砚之', color:'#7a5cff', avatar:'沈', bg:'#2a2f5a', desc:'美术馆主理人，温柔腹黑'},
    luci: {name:'陆辞', color:'#4ade80', avatar:'陆', bg:'#2a5a3a', desc:'自由摄影师，青梅竹马'},
    jiangyu: {name:'江屿', color:'#c084fc', avatar:'江', bg:'#4a3a5a', desc:'酒吧调酒师，前乐队主唱'},
    susu: {name:'苏苏', color:'#fbbf24', avatar:'苏', bg:'#5a4a1a', desc:'大学闺蜜，八卦王'},
  },

  events: {
    // ===== 序章：抵达霓城 =====
    'intro_susu': {
      type:'message_batch', delay:0,
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
    'intro_susu_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'到了回我一声！别让我担心！', choice:{
          prompt:'苏苏在等你的回复：',
          options:[
            {text:'刚到，累死了，先睡了', effects:{affection:{}, thenEvent:'dream_day1_evt', personality:{passive:1, emotional:1}}, hint:'入睡 · 梦境'},
            {text:'到了！明天报到，紧张', effects:{affection:{}, thenEvent:'dream_day1_evt', personality:{active:1, emotional:1}}, hint:'入睡 · 梦境'},
            {text:'（暂时不回）', effects:{affection:{}, thenEvent:'dream_day1_evt', personality:{independent:1, passive:1}}, hint:'入睡 · 梦境'}
          ]
        }}
      ]
    },
    // 第一夜梦境（事件包装）
    'dream_day1_evt': { type:'dream', dream:'dream_day1' },

    // ===== 第一天：报到 =====
    'day2_morning': {
      type:'advance_day', text:'次日清晨', hour:8,
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
      type:'moment_post', moment:'moment_shenyan_opening',
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
    'luci_reunion_msg_4': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'晚上一起吃饭？我带你认认霓城！', choice:{
          prompt:'陆辞约你晚上吃饭。',
          options:[
            {text:'好啊，下班联系', effects:{affection:{luci:2}, thenEvent:'bar_invitation'}, hint:'陆辞 +2'},
            {text:'今天太累了，下次吧', effects:{affection:{luci:1}, thenEvent:'bar_invitation'}, hint:'陆辞 +1（他还是来了）'}
          ]
        }}
      ]
    },

    // 雾港酒吧
    'bar_invitation': {
      type:'advance_time', text:'下班后', minutes:600,
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
    'jiangyu_first_msg_4': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'名字不错。', choice:{
          prompt:'他要加你好友。',
          options:[
            {text:'通过', effects:{affection:{jiangyu:1}, thenEvent:'jiangyu_call_night'}, hint:'江屿 +1'},
            {text:'（不通过）', effects:{affection:{jiangyu:0}, thenEvent:'jiangyu_call_night'}, hint:'他还是会打来'}
          ]
        }}
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
    'opening_choice_shenyan': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'走吧，给你介绍几个人。'}],
      then:'rooftop_jiangyu'
    },
    'opening_choice_luci': {
      type:'message_batch', delay:1,
      messages:[{from:'luci', text:'看这边——笑一个。你笑起来，比那幅画好看多了。'}],
      then:'rooftop_jiangyu'
    },
    'opening_choice_neutral': {
      type:'message_batch', delay:1,
      messages:[{from:'narrator', text:'（你借口去后台，留下两个男人意味深长的沉默。）'}],
      then:'rooftop_jiangyu'
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
      type:'advance_day', text:'南方出差', hour:20,
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
      // ending 在触发时由 engine 根据 flags 计算
      _compute: s => {
        const good = (s.flags.shenyan_brave?1:0) + (s.flags.shenyan_resist?1:0) + (s.flags.shenyan_awaken?1:0) + (s.flags.shenyan_choice==='confront'?1:0);
        const bad  = (s.flags.shenyan_obey?1:0) + (s.flags.shenyan_deny?1:0) + (s.flags.shenyan_choice==='endure'?1:0);
        return good >= bad ? 'shenyan_good' : 'shenyan_bad';
      }
    },
    'ending_shenyan_good': { type:'ending', ending:'shenyan_good' },
    'ending_shenyan_bad': { type:'ending', ending:'shenyan_bad' },

    // ===== 陆辞线 =====
    'route_luci_start': {
      type:'message_batch', delay:1,
      messages:[{from:'luci', text:'明天周末，带你重走一遍我们以前的学校？往返四小时，赶得及吃晚饭。', then:'route_luci_school'}]
    },
    'route_luci_school': {
      type:'advance_day', text:'母校之行', hour:19,
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
      _compute: s => {
        const good = (s.flags.luci_confess?1:0) + (s.flags.luci_stop?1:0) + (s.flags.luci_chase?1:0) + (s.flags.luci_choice==='accept'?1:0);
        const bad  = (s.flags.luci_avoid?1:0) + (s.flags.luci_letgo?1:0) + (s.flags.luci_giveup?1:0) + (s.flags.luci_choice==='miss'?1:0);
        return good >= bad ? 'luci_good' : 'luci_bad';
      }
    },
    'ending_luci_good': { type:'ending', ending:'luci_good' },
    'ending_luci_bad': { type:'ending', ending:'luci_bad' },

    // ===== 江屿线 =====
    'route_jiangyu_start': {
      type:'message_batch', delay:1,
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
      type:'advance_day', text:'一个月后', hour:21,
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
      _compute: s => {
        const good = (s.flags.jiangyu_hold?1:0) + (s.flags.jiangyu_stand?1:0) + (s.flags.jiangyu_choice==='stay'?1:0);
        const bad  = (s.flags.jiangyu_leave?1:0) + (s.flags.jiangyu_silent?1:0) + (s.flags.jiangyu_choice==='leave'?1:0);
        return good >= bad ? 'jiangyu_good' : 'jiangyu_bad';
      }
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
    'ending_true': { type:'ending', ending:'true_ending' }
  },

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

  // ===== 相册 =====
  photos: {
    neon_city: {
      title:'霓城夜景',
      caption:'出租车在高架桥上蜿蜒，窗外是一片流光溢彩的灯海。\n我靠着车窗，看那些光斑在玻璃上拖成长长的尾巴。\n这就是霓城。一座永远不会睡的城市。',
      art:'city'
    },
    rooftop_night: {
      title:'天台',
      caption:'霓城的夜，从这个高度看下去，像一条流动的银河。\n他说："累的时候，适合看灯。"\n灯都懂。',
      art:'rooftop'
    },
    luci_album: {
      title:'九年的相册',
      caption:'第一页是高一军训的我。第二页是高二运动会的我。\n吃饭的我、发呆的我、毕业典礼上哭的我。\n最后一页字条："明天就告白。明天就告白。明天就告白。"\n——他练了九年的告白。',
      art:'album'
    }
  },

  // ===== 音乐 =====
  music: {
    xia: {
      title:'《夏》',
      artist:'江屿',
      duration:'4:32',
      desc:'写给没能活到夏天的妹妹的歌。'
    },
    duya: {
      title:'《渡鸦》',
      artist:'渡鸦乐队',
      duration:'5:18',
      desc:'三年前解散前的最后一首。'
    }
  },

  // ===== 结局 =====
  endings: {
    shenyan_good:{title:'未完的画作', tag:'沈砚之 · GOOD END',
      text:'他终于明白，把你留在画框里，便再也看不见你眼里的光。\n美术馆闭馆那天，他把那幅以你为模特的画送进了库房。\n"林夏，下次开展览，你来定主题。"\n你笑着点头。\n——这一次，你们站在同一侧。'},
    shenyan_bad:{title:'镀金的笼', tag:'沈砚之 · BAD END',
      text:'画很美，美到让人忘了呼吸。\n你才发现，自己也只是他收藏的一件作品。\n"别动，你现在的样子，刚刚好。"\n玻璃外是霓城的夜，玻璃内是你的倒影。\n你笑得越完美，他越满意。'},
    luci_good:{title:'九又二分之一', tag:'陆辞 · GOOD END',
      text:'他在你相册里翻到了那张十年前的合影。\n"我数过，从高一到今天，是九年又一百八十二天。"\n"那还差半年呢？"\n"差半年，凑个十年整，好不好？"\n霓城的烟火刚好升起来。'},
    luci_bad:{title:'未送出的底片', tag:'陆辞 · BAD END',
      text:'他走的那天，把一卷没冲洗的胶卷留在你家门口。\n你后来洗出来，每张都是你。\n最后一张背面写着：\n"我练了九年的告白，最终输给了一句再见。"\n你拨他电话，那头已停机。'},
    jiangyu_good:{title:'雾散之后', tag:'江屿 · GOOD END',
      text:'他重新拿起了吉他。\n不是为观众，是为坐在吧台最角落的你。\n"那首歌，我终于写完了最后一句。"\n你问是什么。\n他凑到你耳边："她回来了。"\n窗外，霓城的雾第一次散得那么干净。'},
    jiangyu_bad:{title:'最后一首歌', tag:'江屿 · BAD END',
      text:'酒吧歇业那天，他在台上唱了最后一首歌。\n歌词里的人，你听了很久才发现不是你。\n"江屿——"\n"林夏，对不起。你来得太晚了。"\n霓城的雨下了一整夜。'},
    true_ending:{title:'霓城无事', tag:'TRUE END',
      text:'一年后，你办了自己的第一个独立策展。\n主题叫《霓城无事》。\n展厅里没有他们的画像，只有你拍下的这座城市的每一束光。\n开幕那天，三个人都没来。\n你举着酒杯，对着窗外轻轻一笑。\n——有些人路过，是为了让你学会一个人。'}
  }
};

// 路线选择数据（由 engine.chooseRoute 触发对应 thenEvent）
STORY.routeChoice = {
  prompt:'夜深了。你决定先回谁的消息？这将决定你的心属于谁。',
  options:[
    {text:'回沈砚之', route:'shenyan', thenEvent:'route_shenyan_start', hint:'进入沈砚之线'},
    {text:'回陆辞', route:'luci', thenEvent:'route_luci_start', hint:'进入陆辞线'},
    {text:'回江屿', route:'jiangyu', thenEvent:'route_jiangyu_start', hint:'进入江屿线'},
    {text:'谁都不回', route:'solo', thenEvent:'route_solo_start', hint:'进入真结局线'}
  ]
};

// ===== 出行/地点系统 =====
// 每个地点有一个偶遇池，玩家前往时随机触发一个满足条件的偶遇
STORY.locations = {
  home: {
    name:'家', icon:'🏠', bg:'linear-gradient(160deg,#1a0a2e 0%,#0a0712 100%)',
    hint:'一个人的房间，窗外是霓城不眠的灯',
    encounters: [
      { id:'home_susu_video', char:'susu',
        condition: s => s.day >= 2 && (s.affection.shenyan + s.affection.luci + s.affection.jiangyu) > 0,
        once:true,
        title:'苏苏的视频请求',
        desc:'苏苏发来视频请求。\n"夏夏！快接！我有大事要宣布！"',
        choice: { prompt:'苏苏激动得声音发抖。',
          options:[
            {text:'接听', affection:{}, reply:'苏苏："我跟你说！我打听到沈砚之这个月会亲自盯开幕式！机会来了！"', personality:{active:1}},
            {text:'回拨语音', affection:{}, reply:'苏苏："语音也行！听我说，陆辞最近好像在拍一组你的旧照集，你小心点。"', personality:{rational:1}}
          ]
        }
      },
      { id:'home_dream_diary', char:'narrator',
        condition: s => s.dreamShards.length >= 1,
        once:true,
        title:'翻看梦境笔记',
        desc:'你翻开备忘录，写下今晚的梦。\n那些碎片在脑海里反复闪烁。',
        choice: { prompt:'你想记下什么？',
          options:[
            {text:'记下少年的侧脸', personality:{emotional:1}, meaning:'你执着于过去'},
            {text:'记下空白的画廊', personality:{rational:1}, meaning:'你预感未来'},
            {text:'什么都不记', personality:{independent:1}, meaning:'你选择活在当下'}
          ]
        }
      }
    ]
  },
  gallery: {
    name:'砚美术馆', icon:'🎨', bg:'linear-gradient(160deg,#2a0f4a 0%,#0a0712 100%)',
    hint:'空旷的展厅，回声里都是秘密',
    encounters: [
      { id:'gallery_shenyan_night', char:'shenyan',
        condition: s => s.day >= 2 && s.affection.shenyan >= 0,
        once:true,
        title:'空展厅的偶遇',
        desc:'加班到深夜，你在空无一人的展厅遇到沈砚之。\n他站在一幅未完成的画前，背对你。\n"又来了。我以为只有我会加班到这个时候。"',
        choice: { prompt:'他的语气里听不出情绪。',
          options:[
            {text:'我只是想多看看', affection:{shenyan:2}, reply:'"……看吧。这里没人时会更好看。"', personality:{emotional:1}},
            {text:'您也没回去？', affection:{shenyan:1}, reply:'"家里太安静。不如这里有画陪。"', personality:{passive:1}},
            {text:'那我先走了', affection:{shenyan:0}, reply:'"嗯。路上小心。"', personality:{independent:1}}
          ]
        }
      }
    ]
  },
  bar: {
    name:'雾港酒吧', icon:'🍸', bg:'linear-gradient(160deg,#4a2a0f 0%,#1a0e05 100%)',
    hint:'爵士乐混着酒精，故事发酵的地方',
    encounters: [
      { id:'bar_jiangyu_drink', char:'jiangyu',
        condition: s => s.day >= 2 && s.affection.jiangyu >= 0,
        once:true,
        title:'吧台的沉默',
        desc:'江屿在擦杯子，看见你进来，没说话，推过来一杯淡粉色的酒。\n"这杯叫\'夏\'。今天调的。不收钱。"',
        choice: { prompt:'酒液在灯下泛着光。',
          options:[
            {text:'尝一口', affection:{jiangyu:2}, reply:'"……甜吗？"他终于看你。"我妹妹以前最爱这种甜。"', personality:{emotional:1}},
            {text:'问他为什么调这杯', affection:{jiangyu:1}, reply:'"……因为今天是你第一次来。"', personality:{rational:1}},
            {text:'推开酒杯', affection:{jiangyu:0}, reply:'"……也对。太早了。"他把酒倒掉。', personality:{independent:1}}
          ]
        }
      }
    ]
  },
  rooftop: {
    name:'天台', icon:'🌃', bg:'linear-gradient(160deg,#0a1a2e 0%,#050810 100%)',
    hint:'霓城的灯海，从这里看像一条流动的银河',
    encounters: [
      { id:'rooftop_luci_photo', char:'luci',
        condition: s => s.day >= 2 && s.affection.luci >= 0,
        once:true,
        title:'天台的快门声',
        desc:'你推开天台门，陆辞正举着相机拍夜景。\n听到门响，他回头，镜头对着你按了一下快门。\n"诶！这张我留底了。今晚的光，刚刚好。"',
        choice: { prompt:'他笑得像高中时一样。',
          options:[
            {text:'让他别拍', affection:{luci:0}, reply:'"好好好，不拍。但你刚才那表情，我记住了。"', personality:{independent:1}},
            {text:'让他再拍一张', affection:{luci:2}, reply:'"……你笑了。这才是你该有的样子。"', personality:{emotional:1}},
            {text:'问他为什么这么晚还在', affection:{luci:1}, reply:'"……因为这里的灯，会让人想起一些人。"', personality:{passive:1}}
          ]
        }
      }
    ]
  },
  street: {
    name:'霓城街头', icon:'🛣️', bg:'linear-gradient(160deg,#2e1a0a 0%,#1a0e05 100%)',
    hint:'霓虹与雨水的城市，每个转角都是未知',
    encounters: [
      { id:'street_susu_intel', char:'susu',
        condition: s => s.day >= 2 && (s.affection.shenyan + s.affection.luci) >= 2,
        once:true,
        title:'苏苏的情报',
        desc:'苏苏突然冲过来拉住你。\n"夏夏！我刚路过美术馆，看见沈砚之和一个陌生女人在门口说话！"\n"那女人长得……怎么说呢，跟你有点像。"',
        choice: { prompt:'苏苏眼里闪着八卦的光。',
          options:[
            {text:'可能是合作方吧', affection:{shenyan:1}, reply:'苏苏："你心真大。不过也对，也许是我多想了。"', personality:{rational:1}, flags:{sus_ignore_ex:1}},
            {text:'去问问沈砚之', affection:{}, reply:'苏苏："行！我陪你去——算了，你自己去，我不好意思。"', personality:{active:1}, flags:{sus_ask:1}},
            {text:'告诉陆辞', affection:{luci:1}, reply:'苏苏："啊？你告诉陆辞干嘛……哦我懂了。"', personality:{emotional:1}, flags:{sus_tell_luci:1}}
          ]
        }
      }
    ]
  }
};

// ===== 回忆杀系统 =====
// 通过相册照片触发，揭示角色过去，收集回忆片段
STORY.memories = {
  'mem_neon_city': {
    triggerPhoto:'neon_city',
    title:'回忆 · 高架桥上的风',
    desc:'你看着这张夜景照，想起拍下它的那个晚上。\n出租车里，司机问你是来旅游还是工作。\n你说是来"重新开始"的。\n司机笑了："霓城啊，重新开始的人太多了。"',
    options:[
      {text:'问司机霓城的故事', shard:'司机的沉默', meaning:'你愿意听陌生人的故事', personality:{emotional:2, active:1}},
      {text:'闭眼听风声', shard:'高架桥上的风', meaning:'你习惯在移动中安放自己', personality:{passive:1, independent:1}},
      {text:'看窗外的灯', shard:'流动的光', meaning:'你相信光会指向答案', personality:{emotional:1, dependent:1}}
    ]
  },
  'mem_rooftop_night': {
    triggerPhoto:'rooftop_night',
    title:'回忆 · 江屿的吉他',
    desc:'天台那晚，江屿走前哼了一段旋律。\n你后来在雾港又听到过一次。\n那是他写给妹妹的《夏》的副歌——\n"她说夏天会回来，她说夏天不会走。"\n他唱到"走"字时，停了。',
    options:[
      {text:'在心里接下一句', shard:'未完的副歌', meaning:'你想替他唱完', personality:{emotional:2, dependent:1}},
      {text:'默默记住这段旋律', shard:'江屿的旋律', meaning:'你把别人的痛收好了', personality:{rational:1, passive:1}},
      {text:'下次问他后面的歌词', shard:'没问出口的话', meaning:'你给自己留了约定', personality:{active:2, independent:1}}
    ]
  },
  'mem_luci_album': {
    triggerPhoto:'luci_album',
    title:'回忆 · 九年的相册',
    desc:'翻开陆辞的相册，每一页都是你。\n你在想，他是从什么时候开始拍的？\n高一军训？高二运动会？\n还是更早——你借他橡皮那天？',
    options:[
      {text:'数一数有多少张', shard:'九年的重量', meaning:'你用数字丈量感情', personality:{rational:2}},
      {text:'翻到最后一页就合上', shard:'没翻完的相册', meaning:'你怕看到自己不想知道的', personality:{passive:1, emotional:1}},
      {text:'拍下这张相册', shard:'被记录的时光', meaning:'你想留下证据', personality:{active:1, independent:1}}
    ]
  }
};

// ===== 苏苏情报网 =====
// 基于剧情进度/好感度，苏苏主动发来的情报消息
STORY.intel = {
  'intel_shenyan_ex': {
    condition: s => s.day >= 3 && s.affection.shenyan >= 3 && !s.flags.intel_shenyan_ex,
    text:'夏夏！我朋友在美术馆实习，她说沈砚之本周有个神秘会面，对象是从北方来的女人！',
    then:'intel_shenyan_ex_reply'
  },
  'intel_luci_milan': {
    condition: s => s.day >= 3 && s.affection.luci >= 3 && !s.flags.intel_luci_milan,
    text:'陆辞最近是不是在收拾行李？我看见他朋友圈发了张机票照片，又秒删了！目的地好像是国外！',
    then:'intel_luci_milan_reply'
  },
  'intel_jiangyu_song': {
    condition: s => s.day >= 3 && s.affection.jiangyu >= 3 && !s.flags.intel_jiangyu_song,
    text:'雾港的调酒师小杨告诉我，江屿最近每晚都在写歌，写到天亮。他写的歌，副歌部分全是"夏"字！',
    then:'intel_jiangyu_song_reply'
  }
};

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

// ===== 共同邀约/赴约系统 =====
// 男主主动发邀约，玩家接受→触发专属赴约剧情；拒绝/超时有后果
STORY.invitations = {
  'inv_shenyan_studio': {
    from:'shenyan',
    text:'明天晚上，来我私人画室。有幅画，画了三年，想让你看。',
    location:'gallery', schedule:'明晚 20:00',
    condition: s => s.day >= 3 && s.affection.shenyan >= 2 && !s.flags.route,
    acceptEvent:'inv_shenyan_studio_accept',
    declineEvent:'inv_shenyan_studio_decline',
    missEvent:'inv_shenyan_studio_miss',
    affectionOnDecline:{shenyan:-2}, affectionOnMiss:{shenyan:-3},
    timeoutSec: 120
  },
  'inv_luci_school': {
    from:'luci',
    text:'周末有空吗？带你重走一遍我们以前的学校。往返四小时，赶得及吃晚饭。',
    location:'school', schedule:'周六 09:00',
    condition: s => s.day >= 3 && s.affection.luci >= 3 && !s.flags.route,
    acceptEvent:'inv_luci_school_accept',
    declineEvent:'inv_luci_school_decline',
    missEvent:'inv_luci_school_miss',
    affectionOnDecline:{luci:-2}, affectionOnMiss:{luci:-3},
    timeoutSec: 120
  },
  'inv_jiangyu_bar': {
    from:'jiangyu',
    text:'今晚雾港有我新歌的首唱。来吗？留了你最爱的位置。',
    location:'bar', schedule:'今晚 21:00',
    condition: s => s.day >= 3 && s.affection.jiangyu >= 3 && !s.flags.route,
    acceptEvent:'inv_jiangyu_bar_accept',
    declineEvent:'inv_jiangyu_bar_decline',
    missEvent:'inv_jiangyu_bar_miss',
    affectionOnDecline:{jiangyu:-2}, affectionOnMiss:{jiangyu:-3},
    timeoutSec: 120
  }
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

// ===== 闪回/前传章节 =====
// 通过特定条件触发，进入独立时间线，揭示五年前的过去
STORY.flashbacks = {
  'fb_highschool_luci': {
    title:'闪回 · 五年前的军训操场',
    trigger: s => s.affection.luci >= 4 && s.flags.intel_luci_milan && !s.flags.fb_highschool_luci,
    desc:'你看着陆辞发来的旧照片，眼前模糊起来。\n蝉鸣声突然变得很近。你回到了高一军训的那个下午。',
    scenes:[
      {text:'九月。操场。烈日。\n教官在喊"向右看齐"。\n你站第三排，身后第四排有个男生，总在偷拍。'},
      {text:'休息时他递来一瓶水：\n"嘿。我叫陆辞。三班的。你呢？"\n你说了名字。\n他笑："林夏。夏天的夏。好名字。我记住了。"'},
      {text:'那天傍晚，他在你课本里夹了一张纸条：\n"明天就告白。明天就告白。明天就告白。"\n——他练了九年的告白。', choice:{
        prompt:'回忆到这里，你想：',
        options:[
          {text:'原来他从高一就喜欢我', personality:{emotional:2, dependent:1}, shard:'高一的纸条'},
          {text:'我那时怎么没发现', personality:{rational:1, passive:1}, shard:'错过的夏天'},
          {text:'把这张纸条忘掉', personality:{independent:2}, shard:'被遗忘的告白'}
        ]
      }}
    ],
    reward:{photo:'luci_album', flag:'fb_highschool_luci'},
    then:null
  },
  'fb_highschool_jiangyu': {
    title:'闪回 · 五年前的天台',
    trigger: s => s.affection.jiangyu >= 4 && s.flags.want_listen && !s.flags.fb_highschool_jiangyu,
    desc:'江屿唱《夏》的那个夜晚，你突然想起来了——\n五年前，你听过同样的副歌。在另一座天台。',
    scenes:[
      {text:'高二夏天。隔壁学校的天台。\n一个抱吉他的男生在唱副歌，唱到"夏"字就停。\n你路过，停下来听。'},
      {text:'他回头看见你：\n"嘿。这首歌的副歌我写不出来。你叫什么？"\n你说："林夏。"\n他愣住，然后笑了：\n"……原来夏字是这样写的。"', choice:{
        prompt:'你想起来了。',
        options:[
          {text:'原来《夏》真的是写给我的', personality:{emotional:2}, shard:'天台的副歌'},
          {text:'只是巧合，别多想', personality:{rational:2}, shard:'理性的距离'},
          {text:'我想去问他', personality:{active:2}, shard:'想问的话'}
        ]
      }}
    ],
    reward:{photo:'rooftop_night', flag:'fb_highschool_jiangyu'},
    then:null
  }
};

// 闪回触发检查（由 engine.checkFlashbacks 调用）
// 闪回完成后的回调事件（可选）

// ===== 礼物商城+喜好系统 =====
// 礼物分类：每个男主有"最爱/喜欢/一般/讨厌"四档，对应好感倍率
STORY.shop = {
  // 商品库（按品类分组）
  items: {
    art_book:     { id:'art_book',     name:'绝版画册',     icon:'📖', price:280, cat:'艺术', desc:'罕见的当代画册，扉页还带作者签名' },
    vintage_cam:  { id:'vintage_cam',  name:'复古胶卷相机', icon:'📷', price:350, cat:'摄影', desc:'七十年代机械相机，快门声清脆如初' },
    vinyl_record: { id:'vinyl_record', name:'黑胶唱片',     icon:'💿', price:220, cat:'音乐', desc:'限量黑胶，B面藏着一首未公开曲' },
    cocktail_set: { id:'cocktail_set', name:'调酒器具',     icon:'🍸', price:180, cat:'酒具', desc:'专业调酒七件套，铜质光泽' },
    hand_warm:    { id:'hand_warm',    name:'手作暖茶罐',   icon:'🍵', price:80,  cat:'日常', desc:'桂花乌龙茶包，温热又妥帖' },
    sketch_pen:   { id:'sketch_pen',   name:'速写钢笔',     icon:'✒️', price:120, cat:'艺术', desc:'手工打磨笔尖，适合速写' },
    film_roll:    { id:'film_roll',    name:'过期胶卷',     icon:'🎞️', price:60,  cat:'摄影', desc:'过期三个月，拍出来颜色会偏暖' },
    vinyl_blank:  { id:'vinyl_blank',  name:'空白黑胶',     icon:'⚫', price:150, cat:'音乐', desc:'可以录一段自己的声音' }
  },
  // 男主喜好表：key=礼物id, value=倍率(0.5/1/1.5/2)
  preferences: {
    shenyan: {
      art_book:2, sketch_pen:1.5, vintage_cam:1, vinyl_record:0.5,
      cocktail_set:0.5, hand_warm:1, film_roll:0.5, vinyl_blank:1
    },
    luci: {
      vintage_cam:2, film_roll:1.5, art_book:1, sketch_pen:1,
      vinyl_record:0.5, cocktail_set:0.5, hand_warm:1.5, vinyl_blank:0.5
    },
    jiangyu: {
      vinyl_record:2, vinyl_blank:1.5, cocktail_set:1.5, art_book:0.5,
      vintage_cam:0.5, sketch_pen:0.5, hand_warm:1, film_roll:0.5
    }
  },
  // 男主收到礼物后的反应台词（按好感倍率）
  reactions: {
    shenyan: {
      2:   '画册？……你怎么知道我找这本找了三年。林夏，你这个人，比画里更会让人意外。',
      1.5: '钢笔。是我常用的那种笔尖。你观察得很仔细。',
      1:   '……谢谢。这东西不算特别，但来自你，就不一样。',
      0.5: '抱歉，我不太用得上。不过既然是你送的，我收着。'
    },
    luci: {
      2:   '这台相机！我盯它好久了！林夏你怎么跟我想到一块去了！',
      1.5: '胶卷过期了？挺好，过期胶卷拍出来的人，会更温柔一点。',
      1:   '嗯，谢啦。回头我给你拍张照当回礼。',
      0.5: '……这东西我用不上啊，不过心意我领了。'
    },
    jiangyu: {
      2:   '黑胶。B面那首，是我没公开的。你怎么知道？……算了，给你的话，不用知道也知道。',
      1.5: '空白黑胶？想让我录点什么——歌，还是别的？',
      '1.5b':'调酒器具。下次你来雾港，我给你调一杯只属于你的。',
      1:   '……谢谢。我放在吧台最显眼的位置。',
      0.5: '这东西不太适合我。不过，你送的，我留着。'
    }
  },
  // 玩家金钱（初始）
  initialCoins: 500
};

// ===== 心情状态+内心独白 =====
STORY.moods = {
  happy:     { id:'happy',     icon:'😊', label:'开心',     hint:'阳光穿过指缝，连呼吸都轻快', tone:'soft' },
  calm:      { id:'calm',      icon:'😌', label:'平静',     hint:'像深夜的霓城，安静地亮着', tone:'neutral' },
  tangled:   { id:'tangled',   icon:'😖', label:'纠结',     hint:'两个方向都想要，又都不敢要', tone:'tense' },
  low:       { id:'low',       icon:'😔', label:'低落',     hint:'今天的云比平时沉一点', tone:'sad' },
  brave:     { id:'brave',     icon:'😤', label:'决意',     hint:'有些事不能再拖了', tone:'strong' }
};
// 不同心情对男主消息语气的影响（仅作为对话分支提示）
STORY.moodEffects = {
  // 当玩家处于某心情时，发送特定回复会触发隐藏加成
  brave:   { flag:'mood_brave',   bonusAffection:0.5 },
  tangled: { flag:'mood_tangled', bonusPersonality:'emotional' },
  low:     { flag:'mood_low',     bonusPersonality:'dependent' },
  happy:   { flag:'mood_happy',   bonusAffection:0.3 },
  calm:    { flag:'mood_calm',    bonusPersonality:'rational' }
};

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
  perfect_listen:{ id:'perfect_listen',name:'完美倾听者',   icon:'👂', desc:'听完所有电话通话', condition: s => s.callLog.filter(c=>c.status==='answered').length >= 3 },
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
  tarot_believer:{ id:'tarot_believer',name:'占卜信徒',     icon:'🔮', desc:'连续3天抽塔罗', condition: s => (s.tarotHistory||[]).length >= 3 },
  gift_giver:    { id:'gift_giver',    name:'心意传递',     icon:'🎁', desc:'送出第一份礼物', condition: s => (s.gifts||[]).length >= 1 },
  mood_explorer: { id:'mood_explorer', name:'情绪光谱',     icon:'🎭', desc:'体验过4种以上不同心情', condition: s => {
    const set = new Set((s.moodHistory||[]).map(m=>m.mood));
    return set.size >= 4;
  }},
  // 剧情类
  flashback_seen:{ id:'flashback_seen',name:'回望五年前',   icon:'⏳', desc:'触发闪回/前传章节', condition: s => Object.keys(s.flashbacksSeen||{}).length >= 1 },
  invitation_accepted:{ id:'invitation_accepted', name:'赴约之人', icon:'💌', desc:'接受过一次邀约', condition: s => Object.values(s.resolvedInvitations||{}).some(v=>v==='accepted') },
  // 隐藏成就
  three_routes:  { id:'three_routes',  name:'心三向',       icon:'💗', desc:'(隐藏) 同时被三位男主的好感度推到5以上', condition: s => s.affection.shenyan>=5 && s.affection.luci>=5 && s.affection.jiangyu>=5 },
  solo_path:     { id:'solo_path',     name:'独行侠',       icon:'🌑', desc:'(隐藏) 选择"谁都不回"路线', condition: s => s.route === 'solo' }
};
// 真结局解锁条件：成就数 ≥ 8 且路线为 solo
STORY.trueEndingUnlockCondition = s => {
  const total = Object.keys(STORY.achievements).length;
  const unlocked = Object.keys(s.achievements||{}).length;
  return unlocked >= Math.ceil(total * 0.6) && s.route === 'solo';
};

// ===== v0.0.10 收集柜+隐藏彩蛋 =====
// 多类道具：postcard(明信片)/stamp(印章)/evidence(证据)/recording(录音)/ticket(票根)/memento(信物)
STORY.collectibles = {
  postcard_neon:    { id:'postcard_neon',    cat:'postcard',  name:'霓城夜景明信片',  icon:'🌃', desc:'霓城的夜，像谁的心事，亮着却没人懂。', how:'第一天抵达霓城时获取' },
  postcard_sea:     { id:'postcard_sea',     cat:'postcard',  name:'南方海岸明信片',  icon:'🌊', desc:'沈砚之出差途中寄回的明信片，背面只有一字：等。', how:'沈砚之线 · 南方出差' },
  postcard_school:  { id:'postcard_school',  cat:'postcard',  name:'旧学校明信片',    icon:'🏫', desc:'九年又一百八十二天，操场边的银杏又黄了。', how:'陆辞线 · 旧学校邀约' },
  stamp_first:      { id:'stamp_first',      cat:'stamp',     name:'霓城首日戳',      icon:'📮', desc:'抵达霓城当日盖的邮戳，墨色未干。', how:'序章完成时获取' },
  stamp_route:      { id:'stamp_route',      cat:'stamp',     name:'路线选定戳',      icon:'💌', desc:'你选择路线的那一晚，霓城邮局留下的纪念戳。', how:'路线选择后获取' },
  evidence_lyrics:  { id:'evidence_lyrics',  cat:'evidence',  name:'《夏》手稿',      icon:'📝', desc:'江屿写的歌《夏》的原始手稿，歌词里的人叫林夏。', how:'江屿线 · 通话后获取' },
  evidence_photo:   { id:'evidence_photo',   cat:'evidence',  name:'天台合影底片',    icon:'🎞️', desc:'天台那晚的合影底片，灯光把两个人拉得很长。', how:'江屿线 · 天台剧情' },
  evidence_letter:  { id:'evidence_letter',  cat:'evidence',  name:'未寄出的信',      icon:'✉️', desc:'陆辞高中写给你但从未寄出的信，字迹已经泛黄。', how:'陆辞线 · 闪回章节' },
  recording_xia:    { id:'recording_xia',    cat:'recording', name:'《夏》试听带',    icon:'🎵', desc:'江屿在雾港首唱的录音带，B面是空白。', how:'江屿线 · 雾港首唱' },
  recording_msg:    { id:'recording_msg',    cat:'recording', name:'语音信箱备份',    icon:'🎙️', desc:'某次未接来电的语音留言备份。', how:'语音信箱回放后获取' },
  ticket_bar:       { id:'ticket_bar',       cat:'ticket',    name:'雾港首杯券',      icon:'🍸', desc:'江屿给你的第一杯酒，背面写着"算我请的"。', how:'江屿线 · 雾港酒吧' },
  ticket_gallery:   { id:'ticket_gallery',   cat:'ticket',    name:'开幕式工作证',    icon:'🎫', desc:'砚美术馆开幕式的工作证，你的名字被印成金色。', how:'开幕式当天获取' },
  memento_pen:      { id:'memento_pen',      cat:'memento',   name:'速写钢笔',        icon:'✒️', desc:'沈砚之用过多年的钢笔，笔尖磨出了他的角度。', how:'沈砚之线 · 私人画室邀约' },
  memento_camera:   { id:'memento_camera',   cat:'memento',   name:'陆辞的胶卷',      icon:'📷', desc:'陆辞给你的过期胶卷，拍出来的人会更温柔一点。', how:'陆辞线 · 重逢邀约' }
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

// ===== v0.0.10 解谜玩法+线索本 =====
STORY.puzzles = {
  puzzle_shenyan_office: {
    id:'puzzle_shenyan_office',
    title:'沈砚之办公室的密码',
    desc:'沈砚之办公桌抽屉上有一把四位数字密码锁，他只留下一张字条：「她笑起来的样子，比那幅画好看多了。」',
    // 解谜线索：每个线索给出一个数字
    clues:[
      { id:'clue_1', text:'开幕式那晚，陆辞说："看这边——笑一个。" 拍照时按下快门的瞬间，是 19:27。', digit:1 },
      { id:'clue_2', text:'沈砚之书架上那本画册的页码被折角，第 4 页。', digit:4 },
      { id:'clue_3', text:'《夏》手稿的落款日期：8月 0 日（江屿划掉了日期，留了个月份）。', digit:0 },
      { id:'clue_4', text:'天台那晚，霓城的灯亮到 23 点才熄。', digit:2 }
    ],
    answer:'1402',  // 拼出 1-4-0-2 = 林夏的生日？其实指向"一四零二"=1402
    hint:'四个数字按线索顺序拼接',
    reward:{ collectible:'memento_pen', flag:'shenyan_office_unlocked', affection:{shenyan:3} },
    onSuccess:'沈砚之看了你一眼："你比我以为的，更懂我。"',
    onFail:'密码不对。沈砚之的字条还在你口袋里。'
  },
  puzzle_luci_locker: {
    id:'puzzle_luci_locker',
    title:'陆辞的旧储物柜',
    desc:'陆辞高中储物柜的密码锁，他记得是「某段记忆的日期」。但他不肯告诉你具体是哪一天。',
    clues:[
      { id:'clue_l1', text:'陆辞说过："九年又一百八十二天。" 9年 = 9。', digit:9 },
      { id:'clue_l2', text:'闪回里你们约定的"明天"是 1 号。', digit:1 },
      { id:'clue_l3', text:'高中操场的银杏是 8 月开始黄。', digit:8 },
      { id:'clue_l4', text:'你们一起拍过 2 张合影。', digit:2 }
    ],
    answer:'9182',
    hint:'四位数字，按"年月日事"的顺序',
    reward:{ collectible:'evidence_letter', flag:'luci_locker_unlocked', affection:{luci:3} },
    onSuccess:'陆辞看着你："……原来你还记得。"',
    onFail:'陆辞摇头："不是这个数字。再想想。"'
  },
  puzzle_jiangyu_song: {
    id:'puzzle_jiangyu_song',
    title:'《夏》的歌词顺序',
    desc:'江屿给你一张《夏》的歌词碎片，他记得顺序但故意打乱。让你拼回原来的样子。',
    clues:[
      { id:'clue_j1', text:'第一句开头是"夏"，但被打乱成"[3]天的风，[1]夏的开始"。', digit:1 },
      { id:'clue_j2', text:'第二句关于"林"，他说"林荫下的[2]个人"。', digit:2 },
      { id:'clue_j3', text:'第三句关于"夜"，"霓城的[4]点"。', digit:4 },
      { id:'clue_j4', text:'第四句关于"夏"的回响，"[3]年后的夏"。', digit:3 }
    ],
    answer:'1243',
    hint:'四句歌词的正确顺序',
    reward:{ collectible:'evidence_lyrics', flag:'jiangyu_song_unlocked', affection:{jiangyu:3} },
    onSuccess:'江屿笑了："你听懂了。"',
    onFail:'江屿摇头："顺序不对。再听一次？"'
  }
};

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
    '7-15':  { id:'arrive_day',  name:'抵达霓城纪念日', icon:'🌃', text:'一年前的今天，你第一次踏上霓城。', effect:{ collectible:'stamp_first' } },
    '8-10':  { id:'luci_birthday', name:'陆辞生日', icon:'🎂', text:'陆辞的生日。他没告诉你，但苏苏发来提醒。', effect:{ flag:'luci_birthday_known' } },
    '8-25':  { id:'jiangyu_first_song', name:'《夏》首唱纪念日', icon:'🎤', text:'一年前的今天，江屿在雾港首唱了《夏》。', effect:{ collectible:'ticket_bar' } },
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
      text:'他第一次见你，不是在导师给联系方式的那个清晨。\n\n是五年前。你还是高中生，跟着陆辞来美术馆参观。你站在一幅画前看了很久，回头对陆辞笑了一下。\n\n那个笑，他画了五年，没画完。\n\n直到你以策展人的身份，重新出现在他的展厅。'
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

// ===== v0.0.13 主角自定义+动态称谓 =====
STORY.playerCustomization = {
  // 默认主角信息
  defaultPlayer: {
    name: '林夏',
    nickname: '夏夏',         // 苏苏叫你的昵称
    avatar: '林',             // 单字头像
    bg: '#5a2a4a',
    age: 24,
    pronoun: '她',            // 称谓
    answers: {}               // 性格问答的答案
  },
  // 性格问答：开局时玩家回答 3 道题，影响初始性格画像
  personalityQuiz: [
    {
      id: 'pq1',
      question: '深夜接到陌生来电，你的第一反应是？',
      options: [
        { text: '立刻接起', effects:{ personality:{active:1, brave:1} }, label:'主动型' },
        { text: '看一眼来电，犹豫后再接', effects:{ personality:{passive:1, rational:1} }, label:'谨慎型' },
        { text: '不接，等对方留言', effects:{ personality:{independent:1, passive:1} }, label:'独立型' }
      ]
    },
    {
      id: 'pq2',
      question: '霓城第一晚，你想先做什么？',
      options: [
        { text: '给苏苏回消息', effects:{ personality:{dependent:1, emotional:1} }, label:'重情型' },
        { text: '整理明天的资料', effects:{ personality:{rational:1, active:1} }, label:'务实型' },
        { text: '靠窗看霓城的夜', effects:{ personality:{emotional:1, independent:1} }, label:'感性型' }
      ]
    },
    {
      id: 'pq3',
      question: '遇到一个让你心动的人，你会？',
      options: [
        { text: '主动找机会接近', effects:{ personality:{active:1, brave:1} }, label:'直球型' },
        { text: '默默观察一段时间', effects:{ personality:{rational:1, passive:1} }, label:'观察型' },
        { text: '假装不在意，等他先开口', effects:{ personality:{passive:1, emotional:1} }, label:'等待型' }
      ]
    }
  ],
  // 男主对玩家的动态称谓：根据好感度阶段切换
  dynamicNicknames: {
    shenyan: [
      { min:0,  max:2,  call:'林夏',  inner:'她的名字，我重复了很多遍。' },
      { min:3,  max:6,  call:'林夏',  inner:'叫她全名的时候，我会下意识放轻一点。' },
      { min:7,  max:11, call:'夏夏',  inner:'"夏夏"——这两个字，我没敢叫出口。' },
      { min:12, max:99, call:'小夏',  inner:'小夏。原来这就是，把一个人放在心上的感觉。' }
    ],
    luci: [
      { min:0,  max:2,  call:'林夏',  inner:'九年没见，连名字都陌生了。' },
      { min:3,  max:6,  call:'林夏',  inner:'她的名字，跟九年前一样好听。' },
      { min:7,  max:11, call:'夏夏',  inner:'夏夏。原来这两个字，我憋了九年。' },
      { min:12, max:99, call:'老夏',  inner:'老夏——这是我们高中时的外号。只有我能叫。' }
    ],
    jiangyu: [
      { min:0,  max:2,  call:'林夏',  inner:'林夏。名字不错。' },
      { min:3,  max:6,  call:'林夏',  inner:'她叫林夏。我写过一首歌叫《夏》。' },
      { min:7,  max:11, call:'夏',    inner:'夏。一个字就够了。' },
      { min:12, max:99, call:'小夏',  inner:'小夏。这是《夏》B面歌词里，最后一句没唱出来的字。' }
    ],
    susu: [
      { min:0,  max:99, call:'夏夏',  inner:'我的闺蜜！必须叫夏夏！' }
    ]
  }
};

// ===== v0.0.13 关系阶段+临界事件 =====
STORY.relationshipStages = {
  // 每个男主 4 个阶段
  shenyan: [
    { id:'rs_shenyan_1', stage:1, name:'陌生',   minAff:0,  maxAff:2,  title:'初见·美术馆', desc:'你是新来的策展人，他是你的导师。', unlockMsg:'沈砚之：初来乍到，多听少说。' },
    { id:'rs_shenyan_2', stage:2, name:'熟悉',   minAff:3,  maxAff:6,  title:'共事·开幕式', desc:'你盯下了开幕式，他开始信任你。', unlockMsg:'沈砚之：比我想的，要勇敢。' },
    { id:'rs_shenyan_3', stage:3, name:'暧昧',   minAff:7,  maxAff:11, title:'出差·南方',   desc:'飞机上她睡着了，他把外套盖在她身上。', unlockMsg:'沈砚之：我已经很多年没有，想要保护一个人的冲动了。', criticalEvent:'shenyan_critical_3' },
    { id:'rs_shenyan_4', stage:4, name:'心意',   minAff:12, maxAff:99, title:'画室·月光',   desc:'他终于让你走进他的私人画室。', unlockMsg:'沈砚之：那幅画，我画了五年。画的是你。' }
  ],
  luci: [
    { id:'rs_luci_1', stage:1, name:'陌生',   minAff:0,  maxAff:2,  title:'重逢·美术馆', desc:'九年后的重逢，他假装不认识。', unlockMsg:'陆辞：诶诶诶！！！林夏是你吗？？？' },
    { id:'rs_luci_2', stage:2, name:'熟悉',   minAff:3,  maxAff:6,  title:'雾港·第一杯', desc:'他带你去雾港，给你点了第一杯酒。', unlockMsg:'陆辞：回头我给你拍张照当回礼。' },
    { id:'rs_luci_3', stage:3, name:'暧昧',   minAff:7,  maxAff:11, title:'旧学校·银杏', desc:'他带你回到九年前的操场。', unlockMsg:'陆辞：九年又一百八十二天。我终于敢带你了。', criticalEvent:'luci_critical_3' },
    { id:'rs_luci_4', stage:4, name:'心意',   minAff:12, maxAff:99, title:'暗房·显影',   desc:'他让你进暗房，看你在他镜头里的样子。', unlockMsg:'陆辞：你笑起来，比那幅画好看多了。原来这话，我九年前就想说。' }
  ],
  jiangyu: [
    { id:'rs_jiangyu_1', stage:1, name:'陌生',   minAff:0,  maxAff:2,  title:'雾港·第一杯', desc:'他请你一杯酒，名字不错。', unlockMsg:'江屿：你叫林夏。名字不错。' },
    { id:'rs_jiangyu_2', stage:2, name:'熟悉',   minAff:3,  maxAff:6,  title:'深夜·来电',  desc:'他打了电话给你，提起一首叫《夏》的歌。', unlockMsg:'江屿：我写过一首歌，叫《夏》。歌词里的人，也叫林夏。' },
    { id:'rs_jiangyu_3', stage:3, name:'暧昧',   minAff:7,  maxAff:11, title:'天台·灯亮', desc:'天台上你靠近他一点，霓城的灯亮着却没人懂。', unlockMsg:'江屿：你这个人，总让人想靠近。', criticalEvent:'jiangyu_critical_3' },
    { id:'rs_jiangyu_4', stage:4, name:'心意',   minAff:12, maxAff:99, title:'首唱·《夏》', desc:'他在雾港首唱《夏》，B面那首未公开的，唱给你。', unlockMsg:'江屿：这首歌，是为了等你而写的。' }
  ]
};

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
          { text:'有。', effects:{ affection:{shenyan:1}, flags:{shenyan_critical_3_accepted:true}, thenEvent:'shenyan_critical_3_reply' }, hint:'沈砚之 +1' },
          { text:'最近有点忙…', effects:{ affection:{shenyan:0}, thenEvent:'shenyan_critical_3_reply' }, hint:'他会等你' }
        ]
      }}
    ]
  },
  shenyan_critical_3_reply: {
    type:'message_batch', delay:1,
    messages:[{ from:'shenyan', text:'好。那就改天。' }]
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
          { text:'好。', effects:{ affection:{luci:1}, flags:{luci_critical_3_accepted:true}, thenEvent:'luci_critical_3_reply' }, hint:'陆辞 +1' },
          { text:'现在…还不行。', effects:{ affection:{luci:0}, thenEvent:'luci_critical_3_reply' }, hint:'他会等你准备好' }
        ]
      }}
    ]
  },
  luci_critical_3_reply: {
    type:'message_batch', delay:1,
    messages:[{ from:'luci', text:'没事。我等。' }]
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
          { text:'去。', effects:{ affection:{jiangyu:1}, flags:{jiangyu_critical_3_accepted:true}, thenEvent:'jiangyu_critical_3_reply' }, hint:'江屿 +1' },
          { text:'今晚有事…', effects:{ affection:{jiangyu:0}, thenEvent:'jiangyu_critical_3_reply' }, hint:'他会等你下次' }
        ]
      }}
    ]
  },
  jiangyu_critical_3_reply: {
    type:'message_batch', delay:1,
    messages:[{ from:'jiangyu', text:'……好。' }]
  }
};

// ===== v0.0.13 每日任务+连胜奖励 =====
STORY.dailyTasks = {
  // 任务模板池：每日随机抽 3 个
  pool: [
    { id:'task_reply',    name:'今日回复',     desc:'回复任意一位男主的消息',     check: s => Object.values(s.conversations||{}).some(c=>c.messages.some(m=>m.from==='me')), reward:{coins:30} },
    { id:'task_tarot',    name:'今日占卜',     desc:'抽一次塔罗',                 check: s => s.lastTarotDay === s.day, reward:{coins:20} },
    { id:'task_gift',     name:'今日送礼',     desc:'给任意一位男主送一份礼物',   check: s => (s.gifts||[]).some(g=>g.day === s.day), reward:{coins:50} },
    { id:'task_mood',     name:'今日心情',     desc:'切换一次心情',               check: s => (s.moodHistory||[]).some(m=>m.day === s.day), reward:{coins:15} },
    { id:'task_diary',    name:'今日独白',     desc:'写一段内心独白',             check: s => (s.diary||[]).some(d=>d.day === s.day), reward:{coins:25} },
    { id:'task_moment',   name:'今日动态',     desc:'发一条朋友圈',               check: s => (s.moments||[]).some(m=>m.author==='me'), reward:{coins:35} },
    { id:'task_explore',  name:'今日出行',     desc:'前往一个新地点',             check: s => s.flags._visited_set && Object.keys(s.flags._visited_set).length > 0, reward:{coins:40} },
    { id:'task_call',     name:'今日通话',     desc:'接听或拨出一次电话',         check: s => (s.callLog||[]).some(c=>c.day === s.day), reward:{coins:30} },
    { id:'task_puzzle',   name:'今日解谜',     desc:'尝试解开一个谜题',           check: s => Object.values(s.puzzleProgress||{}).some(p=>p.lastAttemptDay === s.day), reward:{coins:45} }
  ],
  // 连胜奖励：连续 N 天完成所有任务
  streakRewards: [
    { days:3,  reward:{ coins:100, collectible:'stamp_first' },     name:'三日连胜', desc:'连续3天完成所有日常' },
    { days:7,  reward:{ coins:300, collectible:'postcard_neon' },    name:'七日连胜', desc:'连续7天完成所有日常' },
    { days:14, reward:{ coins:800, flag:'streak_master' },          name:'半月连胜', desc:'连续14天完成所有日常' }
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

if (typeof window !== 'undefined') window.STORY = STORY;
