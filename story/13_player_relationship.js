/* ===== 霓虹心事 · 剧情数据：玩家自定义与关系阶段 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */


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
        { text: '立刻接起', effects:{ personality:{active:1, independent:1} }, label:'主动型' },
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
        { text: '主动找机会接近', effects:{ personality:{active:1, independent:1} }, label:'直球型' },
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
