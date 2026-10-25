/* ===== 霓虹心事 · 剧情数据：收集品与解谜 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



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
  memento_camera:   { id:'memento_camera',   cat:'memento',   name:'陆辞的胶卷',      icon:'📷', desc:'陆辞给你的过期胶卷，拍出来的人会更温柔一点。', how:'陆辞线 · 重逢邀约' },
  // v0.4.7: 新收集品×2——雨天限定 + 闺蜜谜题奖励（与既有发放路径零重叠）
  postcard_rain:    { id:'postcard_rain',    cat:'postcard',  name:'雨天限定明信片',  icon:'🌧️', desc:'雨天的霓城被拉成一条条彩线。苏苏说：雨天也要互相报平安。', how:'雨天剧情 · 选择叫苏苏来接' },
  stamp_bff:        { id:'stamp_bff',        cat:'stamp',     name:'闺蜜暗号邮戳',    icon:'🔐', desc:'苏苏的闺蜜暗号刻成的邮戳：1350，友谊不过期。', how:'解开「苏苏的闺蜜暗号」谜题' }
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
    hints:['别急着填，先把四条线索都翻开。','四个数字的先后，就是线索列出的顺序。'],
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
    hints:['他说的那句"九年又一百八十二天"，是第一个数字的来处。','顺序：年 → 日 → 月 → 事，四位依次拼。'],
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
    hints:['碎片上的数字就是歌词顺序，别按字面念。','把每句里的数字按句序 1→2→3→4 排好，就是答案。'],
    reward:{ collectible:'evidence_lyrics', flag:'jiangyu_song_unlocked', affection:{jiangyu:3} },
    onSuccess:'江屿笑了："你听懂了。"',
    onFail:'江屿摇头："顺序不对。再听一次？"'
  },

  // v0.4.7: 新谜题——苏苏的闺蜜暗号（4 位，奖励新收集品 postcard_rain）
  puzzle_susu_bff_code: {
    id:'puzzle_susu_bff_code',
    title:'苏苏的闺蜜暗号',
    desc:'苏苏的旧手机挂饰上刻着四位数字，她卖关子：「这是我们闺蜜间的暗号！猜对就告诉你一个秘密。」她留下的三条提示都和你们有关。',
    clues:[
      { id:'clue_s1', text:'你们大学宿舍的门牌：520 室的隔壁，宿舍编号个位数是 1。', digit:1 },
      { id:'clue_s2', text:'苏苏手机里你的备注后面跟着的爱心数：一直没变过的 3 颗。', digit:3 },
      { id:'clue_s3', text:'大一期末一起熬夜的天数：整整 5 天，咖啡罐还留着。', digit:5 },
      { id:'clue_s4', text:'她说「友谊的保质期」时比的手势：0——不过期的意思。', digit:0 }
    ],
    answer:'1350',
    hint:'三条提示加一个手势',
    hints:['四条线索按顺序各取一位数字。','手势那次是最后一个数字——"0"代表不过期。'],
    reward:{ collectible:'stamp_bff', flag:'susu_bff_code_unlocked' },
    onSuccess:'苏苏蹦了起来："答对了！暗号的秘密是——不管隔多远，雨天也要互相报平安！"',
    onFail:'苏苏摇头晃脑："不对不对～提示都写在你我回忆里啦。"'
  }
};
