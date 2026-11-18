/* ===== 霓虹心事 · 剧情数据：day8-14 路线专属（v0.9.5）=====
 * 每条线 2 条专属事件（day9/day11），依赖 trigger.route 与 v0.9.5 调度隔离。
 */

// ===== 沈砚之线 =====
STORY.events['day9_shenyan_preview'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:9, hour:20, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'预展今晚只开给内部。你要不要来？灯还没调完。', choice:{
      auto:true,
      prompt:'展厅的灯只亮了一半。',
      options:[
        {text:'留下来看', effects:{affection:{shenyan:2}, personality:{emotional:1}, thenEvent:'day9_shenyan_preview_yes'}, reply:'（空展厅里只有你们两个人。他关掉最后一排灯。）'},
        {text:'先回家', effects:{affection:{shenyan:1}, personality:{rational:1}, thenEvent:'day9_shenyan_preview_no'}, reply:'（你走到地铁口。他发来一张照片：展厅只剩一盏灯。）'}
      ]
    }}
  ]
};
STORY.events['day9_shenyan_preview_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'灯全关的时候，画反而更清楚。……你也是。'}]
};
STORY.events['day9_shenyan_preview_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'那盏灯我留着。下次你来了再关。'}]
};
STORY.events['day11_shenyan_critic'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:11, hour:15, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'评论家提前到了。我本来打算一个人应付——你如果在，站在我旁边就好。', choice:{
      auto:true,
      prompt:'会客室的门开着。',
      options:[
        {text:'站他旁边', effects:{affection:{shenyan:2}, personality:{active:1}, thenEvent:'day11_shenyan_critic_yes'}, reply:'（他介绍你时，语气比平时慢。评论家看了你一眼。）'},
        {text:'让他处理', effects:{affection:{shenyan:1}, personality:{independent:1}, thenEvent:'day11_shenyan_critic_no'}, reply:'（你留在办公室。半小时后他回来说：谈成了。）'}
      ]
    }}
  ]
};
STORY.events['day11_shenyan_critic_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'他说这个展"有温度"。我知道温度是哪儿来的。'}]
};
STORY.events['day11_shenyan_critic_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'谈成了。下次这种场合，我还是希望你也在。'}]
};

// ===== 陆辞线 =====
STORY.events['day9_luci_negative'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:9, hour:18, route:'luci' },
  messages:[
    {from:'luci', text:'有卷底片划伤了。可能是那天赶时间。我想重拍一次，你还愿意当模特吗？', choice:{
      auto:true,
      prompt:'暗房的红灯亮着。',
      options:[
        {text:'陪他重拍', effects:{affection:{luci:2}, personality:{emotional:1}, thenEvent:'day9_luci_negative_yes'}, reply:'（你们拍到天完全黑。他说：这次比上次好。）'},
        {text:'改天吧', effects:{affection:{luci:1}, personality:{rational:1}, thenEvent:'day9_luci_negative_no'}, reply:'（他把相机收进包里。划伤的那张，他说留着。）'}
      ]
    }}
  ]
};
STORY.events['day9_luci_negative_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'同一张脸，第二次拍，感觉不一样。你比第一次放松了。'}]
};
STORY.events['day9_luci_negative_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'划伤的地方像一道闪电。也许它本来就该这样。'}]
};
STORY.events['day11_luci_exhibit'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:11, hour:19, route:'luci' },
  messages:[
    {from:'luci', text:'摄影展下周开幕。我留了一张票给你——不是工作票，是私人票。', choice:{
      auto:true,
      prompt:'一张票压在相机包上。',
      options:[
        {text:'去', effects:{affection:{luci:2}, personality:{emotional:1}, thenEvent:'day11_luci_exhibit_yes'}, reply:'（展厅最里面那张，标签上写着你的名字。）'},
        {text:'不去', effects:{affection:{luci:1}, personality:{independent:1}, thenEvent:'day11_luci_exhibit_no'}, reply:'（他说没关系。后来你收到一本展册，扉页有字。）'}
      ]
    }}
  ]
};
STORY.events['day11_luci_exhibit_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'那张照片叫《九年》。你站在它前面的时候，我按下快门了吗？'}]
};
STORY.events['day11_luci_exhibit_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'扉页那句是：给没来的人。'}]
};

// ===== 江屿线 =====
STORY.events['day9_jiangyu_lyric'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:9, hour:22, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'歌词卡在第二段。写不下去。你要不要来听听，顺便告诉我它缺什么？', choice:{
      auto:true,
      prompt:'排练室的窗开着，风把谱子吹起一角。',
      options:[
        {text:'去听', effects:{affection:{jiangyu:2}, personality:{emotional:1}, thenEvent:'day9_jiangyu_lyric_yes'}, reply:'（他唱到卡住的地方停下。你说：缺一句真话。他笑了。）'},
        {text:'给点建议', effects:{affection:{jiangyu:1}, personality:{rational:1}, thenEvent:'day9_jiangyu_lyric_no'}, reply:'（你发了三行字。他回：这句我留着。）'}
      ]
    }}
  ]
};
STORY.events['day9_jiangyu_lyric_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'真话最难写。……那第二段，就写你刚才那句话。'}]
};
STORY.events['day9_jiangyu_lyric_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'三行字，比我一晚上写的都准。'}]
};
STORY.events['day11_jiangyu_stage'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:11, hour:20, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'周五有个小场，唱三首。票不多，给你留了一张。', choice:{
      auto:true,
      prompt:'手机里躺着一张电子票。',
      options:[
        {text:'去', effects:{affection:{jiangyu:2}, personality:{active:1}, thenEvent:'day11_jiangyu_stage_yes'}, reply:'（台下很挤。他唱到第二首时，看向你这边。）'},
        {text:'不去', effects:{affection:{jiangyu:1}, personality:{independent:1}, thenEvent:'day11_jiangyu_stage_no'}, reply:'（演出结束后他发来一段录音：第三首，留给没来的人。）'}
      ]
    }}
  ]
};
STORY.events['day11_jiangyu_stage_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'第二首是《夏》的旧版本。唱到一半我才发现，我在看你。'}]
};
STORY.events['day11_jiangyu_stage_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'第三首没唱。留着，等你在的时候。'}]
};