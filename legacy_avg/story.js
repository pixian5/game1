/* ===== 霓虹心事 · 剧情数据 ===== */
/* 角色立绘：极简纯色块 + 大字角色名 + 字符画标识（无外部图片依赖） */

// 通用立绘生成器：纯色块 + 角色名 + 心境词 + 字符画标识
function _sprite(opts, mood='neutral'){
  const {name, color, color2, symbol, moodMap} = opts;
  const moodText = moodMap[mood] || moodMap.neutral;
  return `<svg viewBox="0 0 200 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
    <defs>
      <linearGradient id="g_${color.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${color}" stop-opacity="0.95"/>
        <stop offset="1" stop-color="${color2}" stop-opacity="0.85"/>
      </linearGradient>
    </defs>
    <rect x="20" y="40" width="160" height="300" rx="6" fill="url(#g_${color.replace('#','')})" stroke="${color}" stroke-width="1.5" stroke-opacity="0.6"/>
    <rect x="20" y="40" width="160" height="300" rx="6" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="100" y="110" text-anchor="middle" font-family="monospace" font-size="34" fill="rgba(255,255,255,0.85)" letter-spacing="2">${symbol}</text>
    <line x1="50" y1="150" x2="150" y2="150" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <text x="100" y="220" text-anchor="middle" font-family="serif" font-size="42" font-weight="700" fill="#ffffff" letter-spacing="8">${name}</text>
    <line x1="50" y1="260" x2="150" y2="260" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <text x="100" y="300" text-anchor="middle" font-family="serif" font-size="18" fill="rgba(255,255,255,0.7)" letter-spacing="6">${moodText}</text>
    <text x="100" y="330" text-anchor="middle" font-family="monospace" font-size="10" fill="rgba(255,255,255,0.35)" letter-spacing="3">— NEON —</text>
  </svg>`;
}

// 沈砚之 - 深蓝紫 ◑ 眼镜符号
const SPRITE_SHENYAN = (mood='neutral') => _sprite({
  name:'沈砚之', color:'#2a2f5a', color2:'#15182e', symbol:'▣ - ▣',
  moodMap:{neutral:'· 沉静 ·', smile:'· 温润 ·', sad:'· 黯然 ·', angry:'· 冷厉 ·'}
}, mood);

// 陆辞 - 森绿 ◉ 相机符号
const SPRITE_LUCI = (mood='neutral') => _sprite({
  name:'陆 辞', color:'#2a5a3a', color2:'#143018', symbol:'[__○__]',
  moodMap:{neutral:'· 阳光 ·', smile:'· 灿烂 ·', sad:'· 怅然 ·', angry:'· 沉脸 ·'}
}, mood);

// 江屿 - 暗银紫 ♪ 音符符号
const SPRITE_JIANGYU = (mood='neutral') => _sprite({
  name:'江 屿', color:'#4a3a5a', color2:'#241a30', symbol:'♪ ~ ♫',
  moodMap:{neutral:'· 沉默 ·', smile:'· 微光 ·', sad:'· 忧郁 ·', angry:'· 嘶哑 ·'}
}, mood);



const STORY = {
  characters: {
    narrator: {name:'', color:'#b8a6d4'},
    linxia: {name:'林夏', color:'#ff5fa8', age:25, portrait:null, locked:false,
      desc:'25岁，刚从美院艺术史专业毕业的硕士生。性格倔强、爱逞强，私底下是个情绪丰富的人。为了逃离家乡的束缚，独自搬到霓城，入职"砚美术馆"成为一名新晋策展人。表面冷静理智，遇到心动的人却会慌乱。'},
    shenyan: {name:'沈砚之', color:'#7a5cff', age:28, portrait:SPRITE_SHENYAN, locked:false,
      desc:'28岁，砚美术馆主理人，海外留学归来继承家业。温润如玉的外表下藏着极深的城府，对人有礼却疏离。习惯掌控一切，对感兴趣的人有强烈的占有欲。说话慢条斯理，每一句都经过精心计算。识别要点：金丝眼镜、深蓝西装、永远不动声色。', tags:['温柔腹黑','年上','掌控欲']},
    luci: {name:'陆辞', color:'#4caf50', age:26, portrait:SPRITE_LUCI, locked:false,
      desc:'26岁，自由摄影师，林夏的高中同班同学。高中时沉默寡言，常被欺负，是林夏替他出头。如今蜕变得阳光开朗，嘴贫心软。暗恋林夏多年却从未说出口，重逢时假装只是普通朋友。相机里有一半的照片，主角都是她。', tags:['青梅竹马','年下','阳光']},
    jiangyu: {name:'江屿', color:'#9c27b0', age:27, portrait:SPRITE_JIANGYU, locked:false,
      desc:'27岁，"雾港"酒吧老板兼调酒师，前地下乐队"渡鸦"主唱。三年前因一场事故退圈，从此封闭内心。沉默寡言，眼神里有化不开的忧郁。唯独对林夏有种莫名的熟悉感——她长得很像他写过的最后一首歌里的人。', tags:['神秘','忧郁','救赎']},
  },

  backgrounds: {
    city_night:{name:'霓城夜景'},
    apartment:{name:'林夏的公寓'},
    gallery:{name:'砚美术馆'},
    bar:{name:'雾港酒吧'},
    cafe:{name:'巷口咖啡馆'},
    street:{name:'霓城街道'},
    rooftop:{name:'天台'},
    studio:{name:'画室'},
    rain:{name:'雨夜'},
    black:{name:'黑屏'},
  },

  endings: {
    shenyan_good:{title:'未完的画作', tag:'沈砚之 · GOOD END', char:'shenyan', bg:'gallery',
      text:'他终于明白，把你留在画框里，便再也看不见你眼里的光。\n美术馆闭馆那天，他把那幅以你为模特的画送进了库房。\n"林夏，"他摘下眼镜，第一次显得不那么完美，"下次开展览，你来定主题。"\n你笑着点头。\n——这一次，你们站在同一侧。'},
    shenyan_bad:{title:'镀金的笼', tag:'沈砚之 · BAD END', char:'shenyan', bg:'gallery',
      text:'画很美，美到让人忘了呼吸。\n你才发现，自己也只是他收藏的一件作品。\n"别动，"他轻声说，"你现在的样子，刚刚好。"\n玻璃外是霓城的夜，玻璃内是你的倒影。\n你笑得越完美，他越满意。'},
    luci_good:{title:'九又二分之一', tag:'陆辞 · GOOD END', char:'luci', bg:'rooftop',
      text:'他在你相册里翻到了那张十年前的合影。\n"我数过，"他红着耳朵说，"从高一到今天，是九年又一百八十二天。"\n"那还差半年呢？"\n"差半年，"他终于敢直视你，"凑个十年整，好不好？"\n霓城的烟火刚好升起来。'},
    luci_bad:{title:'未送出的底片', tag:'陆辞 · BAD END', char:'luci', bg:'rain',
      text:'他走的那天，把一卷没冲洗的胶卷留在你家门口。\n你后来洗出来，每张都是你——上课的你、吃饭的你、发呆的你。\n最后一张背面写着：\n"我练了九年的告白，最终输给了一句再见。"\n你拨他电话，那头已停机。'},
    jiangyu_good:{title:'雾散之后', tag:'江屿 · GOOD END', char:'jiangyu', bg:'bar',
      text:'他重新拿起了吉他。\n不是为观众，是为坐在吧台最角落的你。\n"那首歌，"他低声说，"我终于写完了最后一句。"\n你问是什么。\n他凑到你耳边："她回来了。"\n窗外，霓城的雾第一次散得那么干净。'},
    jiangyu_bad:{title:'最后一首歌', tag:'江屿 · BAD END', char:'jiangyu', bg:'rain',
      text:'酒吧歇业那天，他在台上唱了最后一首歌。\n歌词里的人，你听了很久才发现不是你。\n"江屿——"\n他没有回头。"林夏，对不起。你来得太晚了。"\n霓城的雨下了一整夜。\n你撑着伞，看着"雾港"的招牌灯一盏盏熄灭。'},
    true_ending:{title:'霓城无事', tag:'TRUE END', char:null, bg:'city_night',
      text:'一年后，你办了自己的第一个独立策展。\n主题叫《霓城无事》。\n展厅里没有他们的画像，只有你拍下的这座城市的每一束光。\n开幕那天，三个人都没来。\n你举着酒杯，对着窗外轻轻一笑。\n——有些人路过，是为了让你学会一个人。'},
  },

  scenes: {
    /* ===== 序章 ===== */
    'prologue_1': {
      bg:'city_night', chapter:'序章', date:'7月15日 22:30',
      steps:[
        {type:'narration', text:'霓城的夜，是被霓虹灯点燃的。'},
        {type:'narration', text:'出租车在高架桥上蜿蜒，窗外是一片流光溢彩的灯海。我靠着车窗，看那些光斑在玻璃上拖成长长的尾巴。'},
        {type:'talk', speaker:'linxia', text:'（这就是霓城啊……）'},
        {type:'talk', speaker:'linxia', text:'（比起家乡那种天黑就熄灯的小城，这里好像永远不会睡。）'},
        {type:'narration', text:'手机震了一下。是导师发来的消息：「林夏，明天到砚美术馆报到，沈先生人很好，但别迟到。他这个人，最讨厌不守时。」'},
        {type:'talk', speaker:'linxia', text:'沈先生……'},
        {type:'narration', text:'我嘀咕着这个名字，莫名觉得有点不安。'},
        {type:'narration', text:'车子转过一个弯，整座城市的天际线在眼前铺开。我忽然有种预感——这座城市，会改变我。'},
        {type:'goto', next:'prologue_2'}
      ]
    },
    'prologue_2': {
      bg:'apartment', chapter:'序章', date:'7月15日 23:15',
      steps:[
        {type:'narration', text:'新租的公寓在二十三楼，不大，但有一整面落地窗。'},
        {type:'narration', text:'我把行李箱推到墙角，扑到床上，不想动。'},
        {type:'talk', speaker:'linxia', text:'好累……'},
        {type:'narration', text:'手机又响了，是大学时最好的朋友苏苏。'},
        {type:'talk', speaker:'linxia', text:'"喂？苏苏。"', mood:'smile'},
        {type:'narration', text:'"林夏！听说你明天去砚美术馆？那里可是出了名的难进，你一定要挺住！"'},
        {type:'talk', speaker:'linxia', text:'"有那么夸张吗？"'},
        {type:'narration', text:'"那个沈砚之，圈子里传得很邪——说是温文尔雅，其实是个吃人不吐骨头的。"'},
        {type:'narration', text:'我笑她八卦，挂了电话。'},
        {type:'talk', speaker:'linxia', text:'（不管怎么样，明天先去看看再说。）'},
        {type:'narration', text:'我把闹钟定在六点，熄了灯。'},
        {type:'narration', text:'窗外霓虹通明，我却在陌生的床上，沉沉睡去。'},
        {type:'goto', next:'prologue_3'}
      ]
    },
    'prologue_3': {
      bg:'gallery', chapter:'序章', date:'7月16日 08:55',
      steps:[
        {type:'narration', text:'砚美术馆在老城区和新区的交界，是一栋改造过的旧工厂。'},
        {type:'narration', text:'白色的外墙，巨大的落地玻璃，里面正在展出"光与影的几何"。'},
        {type:'talk', speaker:'linxia', text:'（好酷的建筑……）'},
        {type:'narration', text:'我站在门口深吸一口气，正要推门——门却从里面被打开了。'},
        {type:'narration', text:'一个高大的身影几乎是同时要出门，被我迎面撞上。'},
        {type:'talk', speaker:'linxia', text:'啊，对不起！', mood:'sad'},
        {type:'narration', text:'我抬头，对上一双极淡的眼睛。金丝眼镜，深蓝色西装，神情不动如水。'},
        {type:'talk', speaker:'shenyan', text:'没事。', sprite:'shenyan', mood:'neutral'},
        {type:'narration', text:'他只看了我一眼，便侧身让开。礼貌，却疏离。'},
        {type:'talk', speaker:'shenyan', text:'你是新来的策展人？'},
        {type:'talk', speaker:'linxia', text:'是、是的，我叫林夏。'},
        {type:'talk', speaker:'shenyan', text:'林夏。', mood:'smile'},
        {type:'narration', text:'他重复了一遍我的名字，像在品一杯茶。'},
        {type:'talk', speaker:'shenyan', text:'比约定的时间早了五分钟，不错。'},
        {type:'narration', text:'他往门外走，走到一半停下，回头。'},
        {type:'talk', speaker:'shenyan', text:'人事在二楼左转。别迷路。'},
        {type:'narration', text:'说完，他钻进一辆等在门口的黑色轿车。'},
        {type:'talk', speaker:'linxia', text:'（……这就是那个"吃人不吐骨头"的沈砚之？）'},
        {type:'talk', speaker:'linxia', text:'（看起来，也就那样嘛。）'},
        {type:'goto', next:'prologue_4'}
      ]
    },
    'prologue_4': {
      bg:'gallery', chapter:'序章', date:'7月16日 14:30',
      steps:[
        {type:'narration', text:'入职手续办得很顺利。下午，我被分配去协助一场摄影展的布展。'},
        {type:'narration', text:'展厅里，一个年轻男人正举着相机对着展品调试光线。'},
        {type:'narration', text:'栗色卷发，宽松的绿色T恤，背影有点眼熟。'},
        {type:'talk', speaker:'linxia', text:'（……不会吧。）'},
        {type:'talk', speaker:'luci', text:'诶？', sprite:'luci', mood:'neutral'},
        {type:'narration', text:'他听见脚步声，转过头。看清我的瞬间，眼睛亮了。'},
        {type:'talk', speaker:'luci', text:'林夏？！', mood:'smile'},
        {type:'talk', speaker:'linxia', text:'陆、陆辞？', mood:'smile'},
        {type:'talk', speaker:'luci', text:'真的是你！', mood:'smile'},
        {type:'narration', text:'他几乎是蹦过来，相机在胸前晃荡。'},
        {type:'talk', speaker:'luci', text:'我听说美术馆新来了个策展人，没想到是你！'},
        {type:'talk', speaker:'linxia', text:'你不是去南方做自由摄影了吗？怎么在霓城？'},
        {type:'talk', speaker:'luci', text:'啊……这个嘛，', mood:'sad'},
        {type:'talk', speaker:'luci', text:'回来有阵子了，一直没好意思找你。'},
        {type:'narration', text:'他挠了挠头，神色有点不自然。'},
        {type:'talk', speaker:'luci', text:'不过——既然你来了，那以后我们就是同事啦？', mood:'smile'},
        {type:'talk', speaker:'linxia', text:'我不算同事，只是协助布展……'},
        {type:'talk', speaker:'luci', text:'那也是一起工作的关系！走走走，我带你看看这边。', mood:'smile'},
        {type:'narration', text:'他不由分说拉着我往展厅深处走，像个孩子。'},
        {type:'talk', speaker:'linxia', text:'（这家伙，怎么一点都没变。）'},
        {type:'goto', next:'prologue_5'}
      ]
    },
    'prologue_5': {
      bg:'bar', chapter:'序章', date:'7月16日 22:10',
      steps:[
        {type:'narration', text:'下班后，陆辞说要带我"认认地方"，最后停在一条小巷深处。'},
        {type:'narration', text:'招牌只写了两个字——"雾港"。'},
        {type:'talk', speaker:'linxia', text:'这就是你说的"宝藏小馆"？'},
        {type:'talk', speaker:'luci', text:'相信我，他家的特调，全霓城第一。', mood:'smile'},
        {type:'narration', text:'推门进去，昏黄的灯光，旧木的吧台，墙上挂着一把落了灰的电吉他。'},
        {type:'narration', text:'吧台后站着一个人，银白色的长发垂到肩，正在擦杯子。'},
        {type:'talk', speaker:'luci', text:'江屿！老规矩，两杯。'},
        {type:'talk', speaker:'jiangyu', text:'……嗯。', sprite:'jiangyu', mood:'neutral'},
        {type:'narration', text:'他没抬头，声音很低，像砂纸。'},
        {type:'narration', text:'调酒的动作很熟练，却有一种机械感。'},
        {type:'talk', speaker:'luci', text:'这是我朋友，林夏。刚来霓城。'},
        {type:'talk', speaker:'jiangyu', text:'欢迎。'},
        {type:'narration', text:'他抬起头，把酒推到我面前。'},
        {type:'narration', text:'四目相对的瞬间，他的动作顿了一下。'},
        {type:'talk', speaker:'jiangyu', text:'……', mood:'sad'},
        {type:'talk', speaker:'linxia', text:'（他……怎么了？）'},
        {type:'talk', speaker:'jiangyu', text:'这杯，算我请的。'},
        {type:'talk', speaker:'luci', text:'诶？江老板今天太阳打西边出来？', mood:'smile'},
        {type:'talk', speaker:'jiangyu', text:'别多话。'},
        {type:'narration', text:'我没问他为什么。只是端起杯子，喝了一口。'},
        {type:'talk', speaker:'linxia', text:'……好喝。'},
        {type:'talk', speaker:'jiangyu', text:'嗯。'},
        {type:'narration', text:'他重新低下头擦杯子，像什么都没发生。'},
        {type:'narration', text:'但我看见，他握着杯子的手，轻轻颤了一下。'},
        {type:'goto', next:'common_1'}
      ]
    },

    /* ===== 共通线 ===== */
    'common_1': {
      bg:'gallery', chapter:'第一章 · 入职', date:'7月18日 10:00',
      steps:[
        {type:'narration', text:'入职第三天，我被叫去沈砚之的办公室汇报工作。'},
        {type:'narration', text:'办公室在美术馆顶层，整面墙都是书。'},
        {type:'talk', speaker:'shenyan', text:'坐。', sprite:'shenyan', mood:'neutral'},
        {type:'narration', text:'他没抬头，正在签一份文件。'},
        {type:'narration', text:'我坐到他对面，等了大概五分钟，他才放下笔。'},
        {type:'talk', speaker:'shenyan', text:'看过你导师写的推荐信了。她说你"心思细腻，但容易冲动"。'},
        {type:'talk', speaker:'linxia', text:'……她这么评价我？'},
        {type:'talk', speaker:'shenyan', text:'怎么，不认同？', mood:'smile'},
        {type:'talk', speaker:'linxia', text:'我觉得，"冲动"这个词不太准。我只是……比较相信直觉。'},
        {type:'talk', speaker:'shenyan', text:'直觉。'},
        {type:'narration', text:'他重复了一遍，似乎觉得有趣。'},
        {type:'talk', speaker:'shenyan', text:'艺术这一行，直觉有时候比理性重要。'},
        {type:'talk', speaker:'shenyan', text:'但也只是"有时候"。'},
        {type:'narration', text:'他站起来，走到落地窗前。'},
        {type:'talk', speaker:'shenyan', text:'下周的开幕式，你来盯。'},
        {type:'talk', speaker:'linxia', text:'我？我才刚入职……'},
        {type:'talk', speaker:'shenyan', text:'你不是说你相信直觉吗。'},
        {type:'narration', text:'他回过头，镜片后的眼神意味不明。'},
        {type:'choice', prompt:'面对沈砚之的"考验"，你的回应是——', options:[
          {text:'接下挑战', hint:'沈砚之 +2', effects:{affection:{shenyan:2}, flags:{}} , next:'common_2a'},
          {text:'婉拒，怕做不好', hint:'沈砚之 +0', effects:{affection:{shenyan:0}}, next:'common_2b'},
          {text:'反问他为什么选我', hint:'沈砚之 +1', effects:{affection:{shenyan:1}}, next:'common_2c'}
        ]}
      ]
    },
    'common_2a': {
      bg:'gallery', chapter:'第一章', date:'7月18日 10:15',
      steps:[
        {type:'talk', speaker:'linxia', text:'好，我来盯。', mood:'smile'},
        {type:'talk', speaker:'shenyan', text:'……', mood:'smile'},
        {type:'narration', text:'他似乎有点意外，但很快掩饰过去。'},
        {type:'talk', speaker:'shenyan', text:'不错。比我想的，要勇敢。'},
        {type:'talk', speaker:'shenyan', text:'明天九点，会议室见。别迟到。'},
        {type:'talk', speaker:'linxia', text:'（他刚才那个笑，是不是真心的？）'},
        {type:'goto', next:'common_3'}
      ]
    },
    'common_2b': {
      bg:'gallery', chapter:'第一章', date:'7月18日 10:15',
      steps:[
        {type:'talk', speaker:'linxia', text:'抱歉，我可能……还不够资格。'},
        {type:'talk', speaker:'shenyan', text:'是吗。'},
        {type:'narration', text:'他没说什么，只是重新拿起笔。'},
        {type:'talk', speaker:'shenyan', text:'那就算了。我自己来。'},
        {type:'narration', text:'语气淡淡的，我却莫名觉得心里一沉。'},
        {type:'talk', speaker:'linxia', text:'（是不是太怂了……）'},
        {type:'goto', next:'common_3'}
      ]
    },
    'common_2c': {
      bg:'gallery', chapter:'第一章', date:'7月18日 10:15',
      steps:[
        {type:'talk', speaker:'linxia', text:'为什么选我？'},
        {type:'talk', speaker:'shenyan', text:'……', mood:'smile'},
        {type:'narration', text:'他看了我几秒，似乎在斟酌。'},
        {type:'talk', speaker:'shenyan', text:'因为你不会问我"为什么"。'},
        {type:'talk', speaker:'shenyan', text:'结果你问了。'},
        {type:'narration', text:'他笑了一下，笑意没到眼底。'},
        {type:'talk', speaker:'shenyan', text:'不过没关系。敢于质疑，也是一种直觉。'},
        {type:'goto', next:'common_3'}
      ]
    },
    'common_3': {
      bg:'cafe', chapter:'第一章', date:'7月19日 13:00',
      steps:[
        {type:'narration', text:'第二天午休，我去巷口的咖啡馆。'},
        {type:'narration', text:'没想到，陆辞已经占了靠窗的位子。'},
        {type:'talk', speaker:'luci', text:'林夏！这边这边。', mood:'smile', sprite:'luci'},
        {type:'talk', speaker:'linxia', text:'你怎么也在？'},
        {type:'talk', speaker:'luci', text:'今天来美术馆取片子，顺便喝一杯。'},
        {type:'narration', text:'他推过来一杯热可可。'},
        {type:'talk', speaker:'luci', text:'加了你喜欢的棉花糖。', mood:'smile'},
        {type:'talk', speaker:'linxia', text:'你还记得？'},
        {type:'talk', speaker:'luci', text:'高中时候你每天一杯嘛，我怎么会忘。', mood:'sad'},
        {type:'narration', text:'他说得云淡风轻，眼睛却看着窗外。'},
        {type:'talk', speaker:'luci', text:'对了，听说你被沈砚之点名盯开幕式了？', mood:'neutral'},
        {type:'talk', speaker:'linxia', text:'嗯。'},
        {type:'talk', speaker:'luci', text:'那家伙……你离他远点。'},
        {type:'talk', speaker:'linxia', text:'啊？'},
        {type:'talk', speaker:'luci', text:'没、没什么。', mood:'sad'},
        {type:'talk', speaker:'luci', text:'我是说，他那个人很难搞，你别太辛苦。'},
        {type:'choice', prompt:'陆辞的话里似乎有别的意思，你怎么回应？', options:[
          {text:'追问到底', hint:'陆辞 +2', effects:{affection:{luci:2}}, next:'common_4a'},
          {text:'笑着岔开话题', hint:'陆辞 +1', effects:{affection:{luci:1}}, next:'common_4b'}
        ]}
      ]
    },
    'common_4a': {
      bg:'cafe', chapter:'第一章', date:'7月19日 13:10',
      steps:[
        {type:'talk', speaker:'linxia', text:'你说"离他远点"，是什么意思？'},
        {type:'talk', speaker:'luci', text:'……'},
        {type:'narration', text:'他沉默了一会，搅动着咖啡。'},
        {type:'talk', speaker:'luci', text:'我之前给他拍过一次封面，他……太可怕了。', mood:'sad'},
        {type:'talk', speaker:'luci', text:'他看人的眼神，像在估价。'},
        {type:'talk', speaker:'luci', text:'我不希望你被他那样看。'},
        {type:'narration', text:'他说得很轻，但语气很认真。'},
        {type:'talk', speaker:'linxia', text:'（他是在……担心我？）'},
        {type:'goto', next:'common_5'}
      ]
    },
    'common_4b': {
      bg:'cafe', chapter:'第一章', date:'7月19日 13:10',
      steps:[
        {type:'talk', speaker:'linxia', text:'谢谢你啦，我会注意的。', mood:'smile'},
        {type:'talk', speaker:'luci', text:'嗯……', mood:'sad'},
        {type:'narration', text:'他愣了一下，似乎想说什么，又咽了回去。'},
        {type:'talk', speaker:'luci', text:'有什么事，随时找我。'},
        {type:'goto', next:'common_5'}
      ]
    },
    'common_5': {
      bg:'bar', chapter:'第一章', date:'7月20日 21:30',
      steps:[
        {type:'narration', text:'开幕式筹备得很累。下班后我没回家，鬼使神差又去了"雾港"。'},
        {type:'narration', text:'江屿看见我，没说话，递过来一杯酒。'},
        {type:'talk', speaker:'jiangyu', text:'今天看起来很累。', sprite:'jiangyu', mood:'neutral'},
        {type:'talk', speaker:'linxia', text:'嗯……有点。'},
        {type:'talk', speaker:'jiangyu', text:'喝完这杯，回去睡。'},
        {type:'narration', text:'我喝了一口，是热的，带一点肉桂的香。'},
        {type:'talk', speaker:'linxia', text:'好喝。'},
        {type:'talk', speaker:'jiangyu', text:'……'},
        {type:'narration', text:'他擦着杯子，似乎在犹豫什么。'},
        {type:'talk', speaker:'jiangyu', text:'你叫林夏？', mood:'sad'},
        {type:'talk', speaker:'linxia', text:'嗯。'},
        {type:'talk', speaker:'jiangyu', text:'夏天的夏。'},
        {type:'talk', speaker:'linxia', text:'对。'},
        {type:'narration', text:'他放下杯子，从吧台下抽出一本旧笔记本。'},
        {type:'talk', speaker:'jiangyu', text:'我写过一首歌，叫《夏》。'},
        {type:'talk', speaker:'jiangyu', text:'歌词里的人，也叫林夏。', mood:'sad'},
        {type:'talk', speaker:'linxia', text:'……？'},
        {type:'talk', speaker:'jiangyu', text:'但那是很多年前的事了。'},
        {type:'narration', text:'他合上本子，重新变回那个沉默的调酒师。'},
        {type:'talk', speaker:'jiangyu', text:'别多想。只是巧合。'},
        {type:'choice', prompt:'他的话让你心生疑窦，你要不要追问？', options:[
          {text:'问个清楚', hint:'江屿 +2', effects:{affection:{jiangyu:2}}, next:'common_6a'},
          {text:'不追问，给他空间', hint:'江屿 +1', effects:{affection:{jiangyu:1}}, next:'common_6b'}
        ]}
      ]
    },
    'common_6a': {
      bg:'bar', chapter:'第一章', date:'7月20日 21:45',
      steps:[
        {type:'talk', speaker:'linxia', text:'真的只是巧合吗？'},
        {type:'talk', speaker:'jiangyu', text:'……'},
        {type:'narration', text:'他抬头看我，眼神里有很深的情绪。'},
        {type:'talk', speaker:'jiangyu', text:'你想听真话？', mood:'sad'},
        {type:'talk', speaker:'linxia', text:'想。'},
        {type:'talk', speaker:'jiangyu', text:'真话是——', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'我以前有个妹妹，也叫林夏。她没能活到夏天。'},
        {type:'narration', text:'他说完，沉默了很久。'},
        {type:'talk', speaker:'jiangyu', text:'所以你第一次走进来的时候，我吓了一跳。'},
        {type:'talk', speaker:'jiangyu', text:'对不起。吓到你了。'},
        {type:'talk', speaker:'linxia', text:'……没事。'},
        {type:'goto', next:'common_6c'}
      ]
    },
    'common_6b': {
      bg:'bar', chapter:'第一章', date:'7月20日 21:45',
      steps:[
        {type:'talk', speaker:'linxia', text:'好。我不问。'},
        {type:'talk', speaker:'jiangyu', text:'……谢谢。', mood:'sad'},
        {type:'narration', text:'他似乎松了口气。'},
        {type:'talk', speaker:'jiangyu', text:'你这种人，不多见。'},
        {type:'goto', next:'common_6c'}
      ]
    },
    'common_6c': {
      bg:'street', chapter:'第一章 · 间奏', date:'7月21日 18:30',
      steps:[
        {type:'narration', text:'离开幕式只剩一天。我一个人在霓城的街上走着，理清这一周。'},
        {type:'narration', text:'霓城的晚高峰，人流像潮水。我逆着走，没人认识我。'},
        {type:'talk', speaker:'linxia', text:'（沈砚之，是我老板，也是最先让我心动的人。）'},
        {type:'talk', speaker:'linxia', text:'（陆辞，是我九年前的故人，他的眼神里有我读不懂的东西。）'},
        {type:'talk', speaker:'linxia', text:'（江屿，他看我的时候，像在看一个很远很远的人。）'},
        {type:'narration', text:'路灯一盏盏亮起，霓城开始它真正的呼吸。'},
        {type:'talk', speaker:'linxia', text:'（明天开幕式，他们会都在。）'},
        {type:'talk', speaker:'linxia', text:'（我得想清楚，自己要的是什么。）'},
        {type:'narration', text:'我停下脚步，望着街对面巨大的电子屏。屏上正放着一条广告——"砚美术馆，光与影的几何，明晚开幕。"'},
        {type:'talk', speaker:'linxia', text:'……走吧。回家。'},
        {type:'goto', next:'common_7'}
      ]
    },
    'common_7': {
      bg:'gallery', chapter:'第二章 · 开幕式', date:'7月22日 19:00',
      steps:[
        {type:'narration', text:'开幕式当晚，美术馆来了很多人。'},
        {type:'narration', text:'我忙前忙后，确保每个环节都顺利。'},
        {type:'narration', text:'沈砚之站在展厅中央，被一群人簇拥着，举手投足都是完美的主人模样。'},
        {type:'talk', speaker:'shenyan', text:'林夏，过来一下。', sprite:'shenyan', mood:'neutral'},
        {type:'narration', text:'我走过去。他顺势把一只香槟杯递给我。'},
        {type:'talk', speaker:'shenyan', text:'今天的布展，做得不错。', mood:'smile'},
        {type:'talk', speaker:'linxia', text:'谢谢。'},
        {type:'talk', speaker:'shenyan', text:'不过——第三幅画的灯光，偏了一度。'},
        {type:'narration', text:'他说得很轻，却让我的心一沉。'},
        {type:'talk', speaker:'shenyan', text:'没事，已经派人调了。下次注意。'},
        {type:'narration', text:'这时，陆辞端着相机走过来。'},
        {type:'talk', speaker:'luci', text:'林夏，给你拍张工作照？', mood:'smile', sprite:'luci'},
        {type:'talk', speaker:'shenyan', text:'……'},
        {type:'narration', text:'我看见沈砚之的眼神，在陆辞身上停了一秒。'},
        {type:'talk', speaker:'shenyan', text:'她现在是工作时间。'},
        {type:'talk', speaker:'luci', text:'啊，抱歉抱歉。', mood:'sad'},
        {type:'narration', text:'气氛一下子有点僵。'},
        {type:'choice', prompt:'两个男人之间的气氛微妙，你如何化解？', options:[
          {text:'陪沈砚之应酬', hint:'沈砚之 +2', effects:{affection:{shenyan:2}}, next:'common_8a'},
          {text:'陪陆辞拍照', hint:'陆辞 +2', effects:{affection:{luci:2}}, next:'common_8b'},
          {text:'借口去后台', hint:'保持中立', effects:{affection:{}}, next:'common_8c'}
        ]}
      ]
    },
    'common_8a': {
      bg:'gallery', chapter:'第二章', date:'7月22日 19:20',
      steps:[
        {type:'talk', speaker:'linxia', text:'抱歉陆辞，等我忙完。'},
        {type:'talk', speaker:'luci', text:'……好。', mood:'sad'},
        {type:'narration', text:'陆辞识趣地退开。'},
        {type:'talk', speaker:'shenyan', text:'走吧，给你介绍几个人。', mood:'smile'},
        {type:'narration', text:'他自然地把手放在我腰后，没有真的碰触，却像是一种宣告。'},
        {type:'talk', speaker:'linxia', text:'（他这是……）'},
        {type:'goto', next:'common_9'}
      ]
    },
    'common_8b': {
      bg:'gallery', chapter:'第二章', date:'7月22日 19:20',
      steps:[
        {type:'talk', speaker:'linxia', text:'沈总，我去去就回。'},
        {type:'talk', speaker:'shenyan', text:'……', mood:'neutral'},
        {type:'narration', text:'他顿了一下，眼神暗了暗。'},
        {type:'talk', speaker:'shenyan', text:'去吧。'},
        {type:'narration', text:'陆辞拉着我到落地窗前。'},
        {type:'talk', speaker:'luci', text:'看这边——笑一个。', mood:'smile'},
        {type:'narration', text:'快门响起的瞬间，他低声说：'},
        {type:'talk', speaker:'luci', text:'（你笑起来，比那幅画好看多了。）'},
        {type:'goto', next:'common_9'}
      ]
    },
    'common_8c': {
      bg:'gallery', chapter:'第二章', date:'7月22日 19:20',
      steps:[
        {type:'talk', speaker:'linxia', text:'抱歉，我去后台盯一下流程。'},
        {type:'talk', speaker:'shenyan', text:'嗯。'},
        {type:'talk', speaker:'luci', text:'啊……好。'},
        {type:'narration', text:'我快步离开，背后是两个人意味深长的沉默。'},
        {type:'talk', speaker:'linxia', text:'（这场开幕式，比我想的还要累人。）'},
        {type:'goto', next:'common_9'}
      ]
    },
    'common_9': {
      bg:'rooftop', chapter:'第二章', date:'7月22日 23:00',
      steps:[
        {type:'narration', text:'开幕式结束，大家都散了。我一个人跑到美术馆的天台吹风。'},
        {type:'narration', text:'霓城的夜，从这个高度看下去，像一条流动的银河。'},
        {type:'talk', speaker:'linxia', text:'……终于结束了。'},
        {type:'narration', text:'这时，身后传来脚步声。'},
        {type:'talk', speaker:'jiangyu', text:'……你在这儿。', sprite:'jiangyu', mood:'neutral'},
        {type:'talk', speaker:'linxia', text:'江屿？你怎么上来的？'},
        {type:'talk', speaker:'jiangyu', text:'这边酒水是我供的。卸货后顺便上来。'},
        {type:'narration', text:'他走到我身边，靠着栏杆。'},
        {type:'talk', speaker:'jiangyu', text:'今天累吧。'},
        {type:'talk', speaker:'linxia', text:'嗯。'},
        {type:'talk', speaker:'jiangyu', text:'累的时候，适合看灯。'},
        {type:'narration', text:'我们都没说话。霓城的灯光，在我们脚下延伸到天边。'},
        {type:'talk', speaker:'jiangyu', text:'我以前，唱过一首歌。', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'歌词是——"霓城的夜，像谁的心事，亮着却没人懂。"'},
        {type:'talk', speaker:'linxia', text:'……'},
        {type:'talk', speaker:'jiangyu', text:'现在看看，其实灯都懂。'},
        {type:'narration', text:'他难得地笑了一下。'},
        {type:'choice', prompt:'夜风里，你的心跳漏了一拍。你的反应是？', options:[
          {text:'靠近他一点', hint:'江屿 +2', effects:{affection:{jiangyu:2}}, next:'common_10a'},
          {text:'礼貌地保持距离', hint:'江屿 +0', effects:{affection:{jiangyu:0}}, next:'common_10b'}
        ]}
      ]
    },
    'common_10a': {
      bg:'rooftop', chapter:'第二章', date:'7月22日 23:15',
      steps:[
        {type:'narration', text:'我下意识地往他那边靠了靠。'},
        {type:'talk', speaker:'jiangyu', text:'……'},
        {type:'narration', text:'他没动，也没躲。'},
        {type:'talk', speaker:'jiangyu', text:'你这个人，', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'总让人想靠近。'},
        {type:'talk', speaker:'linxia', text:'……'},
        {type:'goto', next:'common_11'}
      ]
    },
    'common_10b': {
      bg:'rooftop', chapter:'第二章', date:'7月22日 23:15',
      steps:[
        {type:'narration', text:'我往后退了半步。'},
        {type:'talk', speaker:'jiangyu', text:'……', mood:'sad'},
        {type:'narration', text:'他似乎察觉到了，沉默地收回视线。'},
        {type:'talk', speaker:'jiangyu', text:'早点回去休息。'},
        {type:'goto', next:'common_11'}
      ]
    },
    'common_11': {
      bg:'apartment', chapter:'第三章 · 心事', date:'7月25日 23:30',
      steps:[
        {type:'narration', text:'回到公寓，我躺在床上，却怎么也睡不着。'},
        {type:'narration', text:'脑海里，是这三个男人。'},
        {type:'talk', speaker:'linxia', text:'（沈砚之……城府深，却有一种说不出的吸引力。）'},
        {type:'talk', speaker:'linxia', text:'（陆辞……我们认识那么多年，他对我意味着什么？）'},
        {type:'talk', speaker:'linxia', text:'（江屿……他眼里的忧郁，让我想了解他。）'},
        {type:'narration', text:'手机响了一声，三个人同时发来消息。'},
        {type:'choice', prompt:'夜深了，你决定先回谁的消息？这将决定你的心属于谁。', options:[
          {text:'回沈砚之', hint:'进入沈砚之线', effects:{affection:{shenyan:3}, flags:{route:'shenyan'}}, next:'route_shenyan_1'},
          {text:'回陆辞', hint:'进入陆辞线', effects:{affection:{luci:3}, flags:{route:'luci'}}, next:'route_luci_1'},
          {text:'回江屿', hint:'进入江屿线', effects:{affection:{jiangyu:3}, flags:{route:'jiangyu'}}, next:'route_jiangyu_1'},
          {text:'谁都不回', hint:'进入真结局线', effects:{affection:{}, flags:{route:'solo'}}, next:'route_solo_1'}
        ]}
      ]
    },

    /* ===== 沈砚之线 ===== */
    'route_shenyan_1': {
      bg:'gallery', chapter:'沈砚之线 · 一', date:'7月26日 10:00',
      steps:[
        {type:'narration', text:'我回的是沈砚之。'},
        {type:'narration', text:'消息只有四个字："早些休息。"'},
        {type:'narration', text:'第二天去公司，他比平常早到了半小时。'},
        {type:'talk', speaker:'shenyan', text:'林夏，进来。', sprite:'shenyan', mood:'neutral'},
        {type:'narration', text:'他递给我一份文件。'},
        {type:'talk', speaker:'shenyan', text:'下周去南方，跟我一起出差。有个私人藏家，需要策展人陪同。'},
        {type:'talk', speaker:'linxia', text:'我？'},
        {type:'talk', speaker:'shenyan', text:'别人我不放心。'},
        {type:'narration', text:'他说得很平静，却让我愣了一下。'},
        {type:'talk', speaker:'shenyan', text:'怎么？不愿意？', mood:'smile'},
        {type:'talk', speaker:'linxia', text:'没有。我去。'},
        {type:'talk', speaker:'shenyan', text:'好。'},
        {type:'narration', text:'他看着我，眼神里有一种我看不懂的认真。'},
        {type:'goto', next:'route_shenyan_2'}
      ]
    },
    'route_shenyan_2': {
      bg:'studio', chapter:'沈砚之线 · 二', date:'7月29日 16:00',
      steps:[
        {type:'narration', text:'出差前，他带我去看一个画室。'},
        {type:'narration', text:'画室在郊外，里面挂满了他自己的画作。'},
        {type:'talk', speaker:'linxia', text:'这些都是你画的？'},
        {type:'talk', speaker:'shenyan', text:'嗯。从来没给人看过。', mood:'sad', sprite:'shenyan'},
        {type:'narration', text:'我走过去，发现所有画的主角，都是同一种类型——黑发，瘦削，眼神倔强。'},
        {type:'talk', speaker:'linxia', text:'她们都是……？'},
        {type:'talk', speaker:'shenyan', text:'都是我理想中的人。'},
        {type:'talk', speaker:'shenyan', text:'直到现在，我都没找到。'},
        {type:'narration', text:'他走到我身后，声音放得很低。'},
        {type:'talk', speaker:'shenyan', text:'直到遇见你。', mood:'smile'},
        {type:'talk', speaker:'linxia', text:'……'},
        {type:'narration', text:'我心跳得很厉害，却又隐隐觉得不安。'},
        {type:'choice', prompt:'面对他突然的"告白"，你怎么回应？', options:[
          {text:'问他画的是否真实', hint:'向 GOOD END 倾斜', effects:{affection:{shenyan:2}, flags:{shenyan_understand:1}}, next:'route_shenyan_3a'},
          {text:'害羞接受', hint:'向 BAD END 倾斜', effects:{affection:{shenyan:1}, flags:{shenyan_trap:1}}, next:'route_shenyan_3b'}
        ]}
      ]
    },
    'route_shenyan_3a': {
      bg:'studio', chapter:'沈砚之线 · 三', date:'7月29日 16:30',
      steps:[
        {type:'talk', speaker:'linxia', text:'沈砚之，你喜欢的，是真实的我，还是你画里的那个我？'},
        {type:'talk', speaker:'shenyan', text:'……', mood:'sad'},
        {type:'narration', text:'他沉默了。'},
        {type:'talk', speaker:'shenyan', text:'你果然看出来了。'},
        {type:'talk', speaker:'shenyan', text:'我承认，一开始，是因为你像她们。'},
        {type:'talk', speaker:'shenyan', text:'但相处下来，我发现你不是任何人的替身。'},
        {type:'talk', speaker:'shenyan', text:'你比她们，都鲜活。'},
        {type:'goto', next:'route_shenyan_4'}
      ]
    },
    'route_shenyan_3b': {
      bg:'studio', chapter:'沈砚之线 · 三', date:'7月29日 16:30',
      steps:[
        {type:'talk', speaker:'linxia', text:'……我，我不知道说什么。', mood:'sad'},
        {type:'talk', speaker:'shenyan', text:'不用说什么。'},
        {type:'narration', text:'他握住我的手，眼神温柔得让我放松警惕。'},
        {type:'talk', speaker:'shenyan', text:'留下来，做我的模特。', mood:'smile'},
        {type:'talk', speaker:'shenyan', text:'我会画一辈子的你。'},
        {type:'narration', text:'我没察觉，他说的"留下"，是什么意思。'},
        {type:'goto', next:'route_shenyan_4'}
      ]
    },
    'route_shenyan_4': {
      bg:'gallery', chapter:'沈砚之线 · 四', date:'8月3日 20:00',
      steps:[
        {type:'narration', text:'南方。私人藏家的晚宴在一座临海别墅。'},
        {type:'narration', text:'沈砚之一路牵着我的手，礼貌而笃定，像在牵一件即将展出的作品。'},
        {type:'talk', speaker:'shenyan', text:'这位是周先生，国内最重要的当代艺术藏家之一。', sprite:'shenyan', mood:'smile'},
        {type:'narration', text:'他侧身，把我"递"到周先生面前。'},
        {type:'talk', speaker:'shenyan', text:'林夏，我新来的策展人。灵气得很。', mood:'smile'},
        {type:'narration', text:'周先生的目光从我脸滑到我锁骨，又落回脸。'},
        {type:'talk', speaker:'narrator', text:'"确实，确实。沈先生眼光一向好。"'},
        {type:'talk', speaker:'linxia', text:'（……他在介绍我，还是在展示我？）'},
        {type:'narration', text:'我想退后半步，沈砚之的手却稳稳按在我腰后。'},
        {type:'talk', speaker:'shenyan', text:'林夏下个月会独立策一个青年艺术家单元，周先生有兴趣看看吗？', mood:'neutral'},
        {type:'narration', text:'他替我做了主，语气里没有商量的余地。'},
        {type:'choice', prompt:'晚宴上你感到被"展示"的不适。你的反应是？', options:[
          {text:'配合他，回去再说', hint:'向 BAD END 倾斜', effects:{affection:{shenyan:1}, flags:{shenyan_obey:1}}, next:'route_shenyan_5'},
          {text:'当场岔开话题，夺回主动', hint:'向 GOOD END 倾斜', effects:{affection:{shenyan:2}, flags:{shenyan_resist:1}}, next:'route_shenyan_5'}
        ]}
      ]
    },
    'route_shenyan_5': {
      bg:'rain', chapter:'沈砚之线 · 五', date:'8月3日 23:40',
      steps:[
        {type:'narration', text:'回程的车上，雨下得很大。'},
        {type:'narration', text:'沈砚之靠在后座，闭着眼，领带松开一半。'},
        {type:'talk', speaker:'shenyan', text:'……你今天，不太高兴。', sprite:'shenyan', mood:'sad'},
        {type:'talk', speaker:'linxia', text:'我以为我是来协助策展的。'},
        {type:'talk', speaker:'shenyan', text:'你是。'},
        {type:'talk', speaker:'linxia', text:'可你介绍我的时候，像在介绍一只花瓶。'},
        {type:'narration', text:'他沉默良久，雨打在车窗上。'},
        {type:'talk', speaker:'shenyan', text:'对不起。', mood:'sad'},
        {type:'talk', speaker:'shenyan', text:'我从小被教，人脉要这样经营。我忘了你不是我。'},
        {type:'narration', text:'他摘下眼镜，揉了揉眉心。第一次，他显得不那么完美。'},
        {type:'talk', speaker:'shenyan', text:'家里逼我接手美术馆，逼我相亲，逼我活成一个"沈砚之"。', mood:'sad'},
        {type:'talk', speaker:'shenyan', text:'只有画画的时候，只有……遇见你的时候，我才是我自己。', mood:'sad'},
        {type:'narration', text:'我心软了一瞬。'},
        {type:'talk', speaker:'linxia', text:'（他也有他的牢笼。）'},
        {type:'goto', next:'route_shenyan_6'}
      ]
    },
    'route_shenyan_6': {
      bg:'apartment', chapter:'沈砚之线 · 六', date:'8月15日 09:00',
      steps:[
        {type:'narration', text:'那之后，我们的关系近了一层。'},
        {type:'narration', text:'可我也渐渐发现，他的"近"，是另一种包裹。'},
        {type:'narration', text:'早上发来："今天别穿那件白衬衫，不适合你。"'},
        {type:'narration', text:'中午："陆辞约你吃饭？推了吧，我给你订了餐厅。"'},
        {type:'narration', text:'晚上："这么晚还在雾港？那种地方，不适合你。"'},
        {type:'talk', speaker:'linxia', text:'（他不是在爱我。他是在重塑我。）'},
        {type:'narration', text:'镜子里的我，开始穿他选的衣服，说他会笑的话。'},
        {type:'talk', speaker:'linxia', text:'我还是我吗？', mood:'sad'},
        {type:'narration', text:'手机响了。是陆辞。'},
        {type:'talk', speaker:'luci', text:'林夏，你最近怎么了？消息也不回。', sprite:'luci', mood:'sad'},
        {type:'talk', speaker:'luci', text:'我给你打了五个电话，都是沈砚之接的。他说你忙。', mood:'sad'},
        {type:'narration', text:'我怔住。我根本没收到过那些电话。'},
        {type:'choice', prompt:'你意识到沈砚之在替你"过滤"外界。你的反应是？', options:[
          {text:'立刻去找陆辞问清楚', hint:'决心破局 → 对峙', effects:{affection:{}, flags:{shenyan_awaken:1}}, next:'route_shenyan_7'},
          {text:'替沈砚之解释，继续逃避', hint:'滑向 BAD END', effects:{affection:{}, flags:{shenyan_deny:1}}, next:'route_shenyan_end_check'}
        ]}
      ]
    },
    'route_shenyan_7': {
      bg:'cafe', chapter:'沈砚之线 · 七', date:'8月15日 14:00',
      steps:[
        {type:'narration', text:'我冲到巷口咖啡馆。陆辞已经在了，看见我，眼眶有点红。'},
        {type:'talk', speaker:'luci', text:'你瘦了。', mood:'sad', sprite:'luci'},
        {type:'talk', speaker:'linxia', text:'陆辞，对不起。'},
        {type:'talk', speaker:'luci', text:'我不需要对不起。我需要你告诉我，你还活着。', mood:'sad'},
        {type:'narration', text:'他把那五通被拦截的通话记录翻给我看。'},
        {type:'talk', speaker:'luci', text:'林夏，你认得出来这是谁的手笔吗？', mood:'neutral'},
        {type:'talk', speaker:'linxia', text:'……我认得。'},
        {type:'narration', text:'我捧着热可可，棉花糖化了，甜得发苦。'},
        {type:'talk', speaker:'luci', text:'你不用现在做决定。但你得知道——', mood:'sad'},
        {type:'talk', speaker:'luci', text:'无论你选谁，都不能选一个让你"消失"的人。', mood:'sad'},
        {type:'narration', text:'我看着窗外的霓城，第一次，看清了自己这两个月走过的路。'},
        {type:'talk', speaker:'linxia', text:'谢谢你，陆辞。', mood:'sad'},
        {type:'talk', speaker:'linxia', text:'（……该回去了。回去，跟他说清楚。）'},
        {type:'goto', next:'route_shenyan_end_check'}
      ]
    },
    'route_shenyan_end_check': {
      bg:'black', chapter:'沈砚之线 · 抉择', date:'——',
      steps:[
        {type:'narration', text:'时间一天天过去，我和沈砚之的关系越来越深。'},
        {type:'narration', text:'但我渐渐发现，他对我生活的"建议"越来越多。'},
        {type:'narration', text:'穿什么、见谁、什么时候回家……他都"恰好"有意见。'},
        {type:'choice', prompt:'你意识到这段关系出了问题。你的选择是？', options:[
          {text:'和他正面对峙', hint:'走向 GOOD END', effects:{affection:{}, flags:{shenyan_choice:'confront'}}, next:'route_shenyan_good'},
          {text:'默默忍受', hint:'走向 BAD END', effects:{affection:{}, flags:{shenyan_choice:'endure'}}, next:'route_shenyan_bad'}
        ]}
      ]
    },
    'route_shenyan_good': {
      bg:'gallery', chapter:'沈砚之线 · 终', date:'9月20日',
      steps:[
        {type:'narration', text:'那天，我推开了他办公室的门。'},
        {type:'talk', speaker:'linxia', text:'沈砚之，我们需要谈谈。'},
        {type:'talk', speaker:'shenyan', text:'……', mood:'neutral', sprite:'shenyan'},
        {type:'talk', speaker:'linxia', text:'我喜欢你。但我不要被你"收藏"。'},
        {type:'talk', speaker:'linxia', text:'我要做你身边那个人，不是你画框里那个人。'},
        {type:'narration', text:'他看着我，很久。'},
        {type:'talk', speaker:'shenyan', text:'……', mood:'sad'},
        {type:'talk', speaker:'shenyan', text:'对不起。', mood:'sad'},
        {type:'talk', speaker:'shenyan', text:'我以为这是爱你的方式。'},
        {type:'talk', speaker:'shenyan', text:'我学得慢，但我会改。', mood:'smile'},
        {type:'narration', text:'他摘下眼镜，第一次在我面前显得不那么完美。'},
        {type:'talk', speaker:'shenyan', text:'林夏，谢谢你愿意告诉我。'},
        {type:'ending', id:'shenyan_good'}
      ]
    },
    'route_shenyan_bad': {
      bg:'gallery', chapter:'沈砚之线 · 终', date:'9月20日',
      steps:[
        {type:'narration', text:'我没有开口。'},
        {type:'narration', text:'我习惯了听他的。习惯了被他安排。'},
        {type:'narration', text:'直到有一天，他在画室给我画一幅肖像。'},
        {type:'talk', speaker:'shenyan', text:'别动。', mood:'smile', sprite:'shenyan'},
        {type:'talk', speaker:'shenyan', text:'你现在的样子，刚刚好。'},
        {type:'narration', text:'我看着画里那个笑得完美的女人。'},
        {type:'narration', text:'她不是我。'},
        {type:'talk', speaker:'linxia', text:'……'},
        {type:'narration', text:'但我说不出话。'},
        {type:'ending', id:'shenyan_bad'}
      ]
    },

    /* ===== 陆辞线 ===== */
    'route_luci_1': {
      bg:'street', chapter:'陆辞线 · 一', date:'7月26日 17:00',
      steps:[
        {type:'narration', text:'我回的是陆辞。'},
        {type:'narration', text:'他秒回："明天周末，带你重走一遍我们以前的学校？"'},
        {type:'narration', text:'第二天，他真的开车来接我。'},
        {type:'talk', speaker:'luci', text:'上车！', mood:'smile', sprite:'luci'},
        {type:'talk', speaker:'linxia', text:'我们以前的学校在邻市啊。'},
        {type:'talk', speaker:'luci', text:'往返四个小时，赶得及吃晚饭。', mood:'smile'},
        {type:'narration', text:'车开上高速，他放了我们高中时爱听的那支乐队。'},
        {type:'talk', speaker:'luci', text:'还记得吗？你高二的时候，非要拉我听这场演唱会。'},
        {type:'talk', speaker:'linxia', text:'记得。那时候你被我硬拽去的。'},
        {type:'talk', speaker:'luci', text:'嗯。', mood:'sad'},
        {type:'talk', speaker:'luci', text:'后来我一个人又听了三场。', mood:'sad'},
        {type:'talk', speaker:'linxia', text:'……？'},
        {type:'talk', speaker:'luci', text:'没什么。', mood:'smile'},
        {type:'goto', next:'route_luci_2'}
      ]
    },
    'route_luci_2': {
      bg:'rooftop', chapter:'陆辞线 · 二', date:'7月26日 19:00',
      steps:[
        {type:'narration', text:'我们到了以前的高中。校门换了，操场还在。'},
        {type:'narration', text:'爬到教学楼天台，整座小城的灯火都在脚下。'},
        {type:'talk', speaker:'luci', text:'就是这儿。', mood:'sad', sprite:'luci'},
        {type:'talk', speaker:'linxia', text:'什么这儿？'},
        {type:'talk', speaker:'luci', text:'你忘了？'},
        {type:'narration', text:'他指了指墙角的一处。'},
        {type:'talk', speaker:'luci', text:'高二那年，被人堵的就是这里。是你把我拉出来的。'},
        {type:'talk', speaker:'linxia', text:'……我想起来了。'},
        {type:'talk', speaker:'luci', text:'从那天起，我就告诉自己，要变强。', mood:'sad'},
        {type:'talk', speaker:'luci', text:'强到，可以站到你身边。'},
        {type:'narration', text:'他忽然转头看我，眼睛里有星光。'},
        {type:'talk', speaker:'luci', text:'林夏，有句话我憋了九年。', mood:'sad'},
        {type:'choice', prompt:'他要说出口了。你的反应是？', options:[
          {text:'让他继续说', hint:'向 GOOD END 倾斜', effects:{affection:{luci:2}, flags:{luci_confess:1}}, next:'route_luci_3a'},
          {text:'打断他，岔开话题', hint:'向 BAD END 倾斜', effects:{affection:{luci:1}, flags:{luci_avoid:1}}, next:'route_luci_3b'}
        ]}
      ]
    },
    'route_luci_3a': {
      bg:'rooftop', chapter:'陆辞线 · 三', date:'7月26日 19:15',
      steps:[
        {type:'talk', speaker:'linxia', text:'你说。'},
        {type:'talk', speaker:'luci', text:'……', mood:'sad'},
        {type:'talk', speaker:'luci', text:'我喜欢你。'},
        {type:'talk', speaker:'luci', text:'从高一你借我橡皮那天，到现在。'},
        {type:'talk', speaker:'luci', text:'九年了。'},
        {type:'narration', text:'风把他的卷发吹乱，他没去理。'},
        {type:'talk', speaker:'luci', text:'我知道我们认识太久，突然说这个，可能让你为难。'},
        {type:'talk', speaker:'luci', text:'但我不想再憋着了。', mood:'sad'},
        {type:'goto', next:'route_luci_4'}
      ]
    },
    'route_luci_3b': {
      bg:'rooftop', chapter:'陆辞线 · 三', date:'7月26日 19:15',
      steps:[
        {type:'talk', speaker:'linxia', text:'诶，你看那边的灯——'},
        {type:'talk', speaker:'luci', text:'……', mood:'sad'},
        {type:'narration', text:'他的话被堵在喉咙里。'},
        {type:'talk', speaker:'luci', text:'嗯。挺漂亮的。', mood:'sad'},
        {type:'narration', text:'他笑了一下，笑得很苦。'},
        {type:'talk', speaker:'luci', text:'那我……下次再说吧。'},
        {type:'goto', next:'route_luci_4'}
      ]
    },
    'route_luci_4': {
      bg:'gallery', chapter:'陆辞线 · 四', date:'7月27日 10:00',
      steps:[
        {type:'narration', text:'告白之后，我们谁都没再提那晚的事。'},
        {type:'narration', text:'美术馆里碰见，他笑着点头，我也笑着点头，像两个排练好的演员。'},
        {type:'talk', speaker:'luci', text:'片子我放你桌上了。', mood:'neutral', sprite:'luci'},
        {type:'talk', speaker:'linxia', text:'好。'},
        {type:'talk', speaker:'luci', text:'嗯。'},
        {type:'narration', text:'他转身走的时候，我看见他攥紧了相机带子。'},
        {type:'talk', speaker:'linxia', text:'（他在等我回应。可我不知道怎么回应。）'},
        {type:'narration', text:'九年太重了。重到我怕一接手，就还不起。'},
        {type:'choice', prompt:'面对他的克制与等待，你的态度是？', options:[
          {text:'主动找他打破僵局', hint:'向 GOOD END 倾斜', effects:{affection:{luci:2}, flags:{luci_brave:1}}, next:'route_luci_5'},
          {text:'继续装作无事发生', hint:'向 BAD END 倾斜', effects:{affection:{luci:1}, flags:{luci_hide:1}}, next:'route_luci_5'}
        ]}
      ]
    },
    'route_luci_5': {
      bg:'studio', chapter:'陆辞线 · 五', date:'8月2日 16:00',
      steps:[
        {type:'narration', text:'我去他工作室送还一卷胶卷。他不在。'},
        {type:'narration', text:'桌上摊着一本旧相册，黑色封皮，边角磨白。'},
        {type:'talk', speaker:'linxia', text:'（这是……）'},
        {type:'narration', text:'我翻开。第一页，是高一军训时的我，晒得发红，在笑。'},
        {type:'narration', text:'第二页，高二运动会，我跑过终点，他拍的是我冲线的侧脸。'},
        {type:'narration', text:'第三页、第四页、第五页……全是我。'},
        {type:'narration', text:'吃饭的我、发呆的我、被老师点名皱眉的我、毕业典礼上哭的我。'},
        {type:'talk', speaker:'linxia', text:'（他……拍了九年。）'},
        {type:'narration', text:'最后一页夹着一张字条，墨水褪了色：'},
        {type:'narration', text:'"今天她又穿了那件白裙子。我没敢上前。也许明天。"'},
        {type:'narration', text:'字条背面，密密麻麻写着同一句话，写了整整一页——'},
        {type:'narration', text:'"明天就告白。明天就告白。明天就告白。"'},
        {type:'talk', speaker:'linxia', text:'……', mood:'sad'},
        {type:'narration', text:'相册啪地合上。我捂住嘴。'},
        {type:'goto', next:'route_luci_6'}
      ]
    },
    'route_luci_6': {
      bg:'cafe', chapter:'陆辞线 · 六', date:'8月10日 19:30',
      steps:[
        {type:'narration', text:'八天后，陆辞约我在巷口咖啡馆。'},
        {type:'narration', text:'他难得穿了衬衫，头发也梳了，像是去赴什么约。'},
        {type:'talk', speaker:'luci', text:'林夏，有件事想跟你说。', mood:'sad', sprite:'luci'},
        {type:'talk', speaker:'luci', text:'米兰那边的工作室邀我过去驻半年。机会难得。'},
        {type:'talk', speaker:'linxia', text:'米兰？'},
        {type:'talk', speaker:'luci', text:'下个月的飞机。', mood:'sad'},
        {type:'narration', text:'他搅着咖啡，没看我。'},
        {type:'talk', speaker:'luci', text:'我知道这时间不对。但我想，也许离远一点，对我们都好。', mood:'sad'},
        {type:'talk', speaker:'luci', text:'你不用回答我。我只是……来道个别。'},
        {type:'narration', text:'他起身，把一个牛皮纸信封推到我面前。'},
        {type:'talk', speaker:'luci', text:'这个，等我走了再看。', mood:'sad'},
        {type:'choice', prompt:'他就要走了。这一刻，你的选择是？', options:[
          {text:'喊住他，不让他走', hint:'走向 GOOD END', effects:{affection:{}, flags:{luci_stop:1}}, next:'route_luci_end_check'},
          {text:'看着他离开，没开口', hint:'走向 BAD END', effects:{affection:{}, flags:{luci_letgo:1}}, next:'route_luci_7'}
        ]}
      ]
    },
    'route_luci_7': {
      bg:'rain', chapter:'陆辞线 · 七', date:'8月10日 22:00',
      steps:[
        {type:'narration', text:'他走出咖啡馆，没打伞。雨很快把他淋透。'},
        {type:'narration', text:'我坐在原位，看着窗外他的背影一点点消失在街角。'},
        {type:'talk', speaker:'linxia', text:'（九年。他等了我九年。）'},
        {type:'talk', speaker:'linxia', text:'（我却连一句"别走"都没说出口。）', mood:'sad'},
        {type:'narration', text:'我拆开那个信封。'},
        {type:'narration', text:'里面是一张机票——去米兰的，日期是下个月，名字写着：林夏。'},
        {type:'narration', text:'背面一行字："如果你愿意，我们一起走。不愿意，就当我没来过。"'},
        {type:'talk', speaker:'linxia', text:'……', mood:'sad'},
        {type:'narration', text:'我冲出咖啡馆，跑进雨里。'},
        {type:'narration', text:'街角空空荡荡。他已经不在了。'},
        {type:'choice', prompt:'雨水模糊了视线。你的最后选择是？', options:[
          {text:'追去他家，敲他的门', hint:'走向 GOOD END', effects:{affection:{}, flags:{luci_chase:1}}, next:'route_luci_end_check'},
          {text:'站在雨里，直到天亮', hint:'走向 BAD END', effects:{affection:{}, flags:{luci_giveup:1}}, next:'route_luci_end_check'}
        ]}
      ]
    },
    'route_luci_end_check': {
      bg:'black', chapter:'陆辞线 · 抉择', date:'——',
      steps:[
        {type:'narration', text:'回霓城的路上，我们都没说话。'},
        {type:'narration', text:'此后几天，陆辞没主动找我。'},
        {type:'narration', text:'我打开他送我的相册，翻到最后那一页——'},
        {type:'choice', prompt:'看到他藏了九年的心意，你的选择是？', options:[
          {text:'去找他，回应他', hint:'走向 GOOD END', effects:{affection:{}, flags:{luci_choice:'accept'}}, next:'route_luci_good'},
          {text:'错过时机', hint:'走向 BAD END', effects:{affection:{}, flags:{luci_choice:'miss'}}, next:'route_luci_bad'}
        ]}
      ]
    },
    'route_luci_good': {
      bg:'rooftop', chapter:'陆辞线 · 终', date:'8月8日',
      steps:[
        {type:'narration', text:'我冲到他的工作室。'},
        {type:'talk', speaker:'linxia', text:'陆辞！'},
        {type:'talk', speaker:'luci', text:'林夏？你怎么……', mood:'neutral', sprite:'luci'},
        {type:'talk', speaker:'linxia', text:'你数过吗？从高一到今天，是多少天？'},
        {type:'talk', speaker:'luci', text:'……九年又一百八十二天。', mood:'sad'},
        {type:'talk', speaker:'linxia', text:'那还差半年。'},
        {type:'talk', speaker:'linxia', text:'凑个十年整，好不好？'},
        {type:'narration', text:'他愣住了，然后眼眶红了。'},
        {type:'talk', speaker:'luci', text:'好。', mood:'smile'},
        {type:'narration', text:'窗外，霓城的烟火刚好升起。'},
        {type:'ending', id:'luci_good'}
      ]
    },
    'route_luci_bad': {
      bg:'rain', chapter:'陆辞线 · 终', date:'8月8日',
      steps:[
        {type:'narration', text:'我犹豫了一晚又一晚。'},
        {type:'narration', text:'等我终于鼓起勇气去敲门，工作室已经空了。'},
        {type:'narration', text:'门口放着一卷没冲洗的胶卷。'},
        {type:'talk', speaker:'linxia', text:'……'},
        {type:'narration', text:'我后来洗出来。每张都是我。'},
        {type:'narration', text:'最后一张背面，是他歪歪扭扭的字：'},
        {type:'talk', speaker:'luci', text:'"我练了九年的告白，最终输给了一句再见。"'},
        {type:'narration', text:'我拨他电话。'},
        {type:'narration', text:'"您拨打的电话已停机。"'},
        {type:'ending', id:'luci_bad'}
      ]
    },

    /* ===== 江屿线 ===== */
    'route_jiangyu_1': {
      bg:'bar', chapter:'江屿线 · 一', date:'7月26日 23:00',
      steps:[
        {type:'narration', text:'我回的是江屿。'},
        {type:'narration', text:'他只回了一个字："嗯。"'},
        {type:'narration', text:'当晚我去了"雾港"。还没到打烊时间，酒吧里只有他。'},
        {type:'talk', speaker:'jiangyu', text:'坐。', mood:'neutral', sprite:'jiangyu'},
        {type:'talk', speaker:'linxia', text:'今天没客人？'},
        {type:'talk', speaker:'jiangyu', text:'我让他们今天别来。'},
        {type:'talk', speaker:'linxia', text:'为什么？'},
        {type:'talk', speaker:'jiangyu', text:'想跟你说话。', mood:'sad'},
        {type:'narration', text:'他给我倒了一杯酒。'},
        {type:'talk', speaker:'jiangyu', text:'我妹妹，叫林夏。'},
        {type:'talk', speaker:'jiangyu', text:'她小时候，最喜欢夏天。'},
        {type:'talk', speaker:'jiangyu', text:'十四岁那年，她没能等到夏天。', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'我写的那首《夏》，是写给她的。'},
        {type:'talk', speaker:'linxia', text:'……'},
        {type:'talk', speaker:'jiangyu', text:'但你不是她。', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'你是另一个，让我想再写一首歌的人。'},
        {type:'goto', next:'route_jiangyu_2'}
      ]
    },
    'route_jiangyu_2': {
      bg:'studio', chapter:'江屿线 · 二', date:'8月1日 15:00',
      steps:[
        {type:'narration', text:'他带我去了一个旧排练室。'},
        {type:'narration', text:'墙上还贴着"渡鸦乐队"的海报。'},
        {type:'talk', speaker:'jiangyu', text:'三年没来了。', mood:'sad', sprite:'jiangyu'},
        {type:'talk', speaker:'linxia', text:'三年前那场事故……？'},
        {type:'talk', speaker:'jiangyu', text:'乐队演出，舞台塌了。'},
        {type:'talk', speaker:'jiangyu', text:'鼓手是我最好的朋友。他没了。'},
        {type:'talk', speaker:'jiangyu', text:'我没事，但从此唱不出来。'},
        {type:'narration', text:'他坐在落灰的鼓凳上，低头。'},
        {type:'talk', speaker:'jiangyu', text:'我总在想，如果他没死，是不是该是我。'},
        {type:'talk', speaker:'jiangyu', text:'我活着，却像死了。', mood:'sad'},
        {type:'choice', prompt:'他的伤口在你面前敞开。你的反应是？', options:[
          {text:'告诉他，活着本身就是意义', hint:'向 GOOD END 倾斜', effects:{affection:{jiangyu:2}, flags:{jiangyu_save:1}}, next:'route_jiangyu_3a'},
          {text:'陪他沉默', hint:'向 BAD END 倾斜', effects:{affection:{jiangyu:1}, flags:{jiangyu_silence:1}}, next:'route_jiangyu_3b'}
        ]}
      ]
    },
    'route_jiangyu_3a': {
      bg:'studio', chapter:'江屿线 · 三', date:'8月1日 15:30',
      steps:[
        {type:'talk', speaker:'linxia', text:'江屿。'},
        {type:'talk', speaker:'linxia', text:'你活着，是为了替他看夏天。'},
        {type:'talk', speaker:'linxia', text:'是为了有一天，能再写出歌。'},
        {type:'talk', speaker:'jiangyu', text:'……', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'你怎么这么确定？'},
        {type:'talk', speaker:'linxia', text:'因为我也差点放弃过。'},
        {type:'talk', speaker:'linxia', text:'但我没放弃。我来了霓城，遇见了你。'},
        {type:'talk', speaker:'jiangyu', text:'……', mood:'smile'},
        {type:'narration', text:'他第一次，对着我笑了。'},
        {type:'goto', next:'route_jiangyu_4'}
      ]
    },
    'route_jiangyu_3b': {
      bg:'studio', chapter:'江屿线 · 三', date:'8月1日 15:30',
      steps:[
        {type:'narration', text:'我没说话，只是坐在他旁边。'},
        {type:'talk', speaker:'jiangyu', text:'谢谢你。', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'但有些痛，陪也陪不好。'},
        {type:'narration', text:'他站起来，背对着我。'},
        {type:'talk', speaker:'jiangyu', text:'对不起，让你白跑一趟。'},
        {type:'goto', next:'route_jiangyu_4'}
      ]
    },
    'route_jiangyu_4': {
      bg:'rain', chapter:'江屿线 · 四', date:'8月5日 09:00',
      steps:[
        {type:'narration', text:'清晨，他敲我的门。一身黑，手里一束白菊。'},
        {type:'talk', speaker:'jiangyu', text:'今天，能陪我去个地方吗。', mood:'sad', sprite:'jiangyu'},
        {type:'talk', speaker:'linxia', text:'好。'},
        {type:'narration', text:'车开到郊外一座小墓园。墓碑上刻着：林夏之墓。'},
        {type:'talk', speaker:'linxia', text:'……她也叫林夏。', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'我妹妹。十四年前的夏天，白血病。', mood:'sad'},
        {type:'narration', text:'他把白菊放好，蹲下，像在跟一个小孩说话。'},
        {type:'talk', speaker:'jiangyu', text:'小夏，哥带了个人来看你。她跟你一样倔。', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'她叫林夏。是另一个，让我想写歌的人。'},
        {type:'narration', text:'风吹过墓园，白菊轻轻颤。'},
        {type:'talk', speaker:'jiangyu', text:'我以前不敢来。今天，想带你一起。', mood:'sad'},
        {type:'talk', speaker:'linxia', text:'……我很荣幸。', mood:'sad'},
        {type:'goto', next:'route_jiangyu_5'}
      ]
    },
    'route_jiangyu_5': {
      bg:'bar', chapter:'江屿线 · 五', date:'8月9日 23:30',
      steps:[
        {type:'narration', text:'四天后，是前鼓手阿哲的忌日。'},
        {type:'narration', text:'我到"雾港"时，吧台后空着。江屿坐在角落，地上滚着空酒瓶。'},
        {type:'talk', speaker:'jiangyu', text:'……你来了。', mood:'sad', sprite:'jiangyu'},
        {type:'talk', speaker:'linxia', text:'你喝了多少？'},
        {type:'talk', speaker:'jiangyu', text:'不够多。', mood:'sad'},
        {type:'narration', text:'他抬头，眼眶通红。'},
        {type:'talk', speaker:'jiangyu', text:'三年了。我妈说，该放下了。', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'可我一闭上眼，就看见他笑着回头跟我说："江屿，最后一首了！"'},
        {type:'talk', speaker:'jiangyu', text:'然后舞台就塌了。', mood:'sad'},
        {type:'narration', text:'他抱住自己，肩膀发抖。'},
        {type:'talk', speaker:'jiangyu', text:'我活着，有什么用。', mood:'sad'},
        {type:'choice', prompt:'他在崩溃的边缘。你的反应是？', options:[
          {text:'抱住他，什么都不说', hint:'向 GOOD END 倾斜', effects:{affection:{jiangyu:2}, flags:{jiangyu_hold:1}}, next:'route_jiangyu_6'},
          {text:'让他一个人静一静', hint:'向 BAD END 倾斜', effects:{affection:{jiangyu:1}, flags:{jiangyu_leave:1}}, next:'route_jiangyu_6'}
        ]}
      ]
    },
    'route_jiangyu_6': {
      bg:'studio', chapter:'江屿线 · 六', date:'8月12日 14:00',
      steps:[
        {type:'narration', text:'忌日之后，江屿把排练室的钥匙给了我一把。'},
        {type:'narration', text:'他说："你在我才敢进去。"'},
        {type:'narration', text:'今天我们去整理阿哲留下的东西。纸箱里是旧谱子、鼓槌、一件洗褪色的乐队T恤。'},
        {type:'talk', speaker:'jiangyu', text:'这是他最后写的东西。', mood:'sad', sprite:'jiangyu'},
        {type:'narration', text:'他抽出一张皱巴巴的纸，上面是阿哲的笔迹。'},
        {type:'narration', text:'是一首歌的副歌，只写了四行，后面是空白。'},
        {type:'talk', speaker:'jiangyu', text:'他没写完，就……', mood:'sad'},
        {type:'narration', text:'我接过那张纸，看见空白处，有江屿后来用铅笔轻轻补的一行字：'},
        {type:'narration', text:'"剩下的，等我敢唱了，我替你写。"'},
        {type:'talk', speaker:'linxia', text:'江屿……'},
        {type:'talk', speaker:'jiangyu', text:'我想把它写完。', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'可我每次写到副歌，就写不下去。'},
        {type:'choice', prompt:'他终于想写完了。你要怎么帮他？', options:[
          {text:'陪他一起，一句一句写', hint:'走向 GOOD END', effects:{affection:{}, flags:{jiangyu_write:1}}, next:'route_jiangyu_7'},
          {text:'让他自己慢慢来，别催', hint:'走向 BAD END', effects:{affection:{}, flags:{jiangyu_wait:1}}, next:'route_jiangyu_7'}
        ]}
      ]
    },
    'route_jiangyu_7': {
      bg:'bar', chapter:'江屿线 · 七', date:'9月10日 21:00',
      steps:[
        {type:'narration', text:'一个月后。江屿说，他在"雾港"约了个小场子，想试试登台。'},
        {type:'narration', text:'只请了我一个人。'},
        {type:'talk', speaker:'jiangyu', text:'我可能唱不完。', mood:'sad', sprite:'jiangyu'},
        {type:'talk', speaker:'jiangyu', text:'但我想试。'},
        {type:'narration', text:'他抱着那把落了三年灰的吉他，坐到小舞台中央。'},
        {type:'narration', text:'灯光调得很暗。他试了一个和弦，手指在抖。'},
        {type:'talk', speaker:'jiangyu', text:'……我唱不下去的时候，你在就行。', mood:'sad'},
        {type:'narration', text:'我坐在吧台最角落，朝他点了点头。'},
        {type:'narration', text:'他闭上眼，弦音落下。是那首《夏》。'},
        {type:'choice', prompt:'他唱到副歌前，停了。这一刻，你的选择是？', options:[
          {text:'站起来，走到台前', hint:'走向 GOOD END', effects:{affection:{}, flags:{jiangyu_stand:1}}, next:'route_jiangyu_end_check'},
          {text:'安静等他自己开口', hint:'走向 BAD END', effects:{affection:{}, flags:{jiangyu_silent:1}}, next:'route_jiangyu_end_check'}
        ]}
      ]
    },
    'route_jiangyu_end_check': {
      bg:'black', chapter:'江屿线 · 抉择', date:'——',
      steps:[
        {type:'narration', text:'那之后，江屿开始尝试写新歌。'},
        {type:'narration', text:'但每一次，都在副歌前停下。'},
        {type:'narration', text:'"雾港"一周只开三天了。'},
        {type:'choice', prompt:'你看到他在泥潭里挣扎。你的选择是？', options:[
          {text:'陪他一起写完那首歌', hint:'走向 GOOD END', effects:{affection:{}, flags:{jiangyu_choice:'stay'}}, next:'route_jiangyu_good'},
          {text:'让他独自面对过去', hint:'走向 BAD END', effects:{affection:{}, flags:{jiangyu_choice:'leave'}}, next:'route_jiangyu_bad'}
        ]}
      ]
    },
    'route_jiangyu_good': {
      bg:'bar', chapter:'江屿线 · 终', date:'9月15日',
      steps:[
        {type:'narration', text:'我天天去"雾港"。'},
        {type:'narration', text:'他在吧台后写，我在角落看书。'},
        {type:'narration', text:'某天深夜，他放下笔。'},
        {type:'talk', speaker:'jiangyu', text:'写完了。', mood:'smile', sprite:'jiangyu'},
        {type:'talk', speaker:'linxia', text:'真的？'},
        {type:'talk', speaker:'jiangyu', text:'最后一句，是："她回来了。"'},
        {type:'talk', speaker:'jiangyu', text:'你愿不愿意听？'},
        {type:'talk', speaker:'linxia', text:'唱吧。'},
        {type:'narration', text:'他拿起那把落了灰的吉他，弦音一响，整个"雾港"都安静了。'},
        {type:'narration', text:'窗外，霓城的雾，第一次散得那么干净。'},
        {type:'ending', id:'jiangyu_good'}
      ]
    },
    'route_jiangyu_bad': {
      bg:'rain', chapter:'江屿线 · 终', date:'9月15日',
      steps:[
        {type:'narration', text:'我没敢打扰他。'},
        {type:'narration', text:'直到某天，"雾港"挂出了歇业的牌子。'},
        {type:'narration', text:'最后一晚，他在台上唱了那首《夏》。'},
        {type:'talk', speaker:'jiangyu', text:'这首歌，', mood:'sad', sprite:'jiangyu'},
        {type:'talk', speaker:'jiangyu', text:'我从来没唱完过。'},
        {type:'talk', speaker:'jiangyu', text:'今天，是最后一次。'},
        {type:'narration', text:'我站在最后排，听着他唱。'},
        {type:'narration', text:'副歌响起，我才发现——'},
        {type:'narration', text:'歌词里的人，不是他妹妹。'},
        {type:'narration', text:'也不是我。'},
        {type:'narration', text:'是他自己。'},
        {type:'talk', speaker:'jiangyu', text:'林夏，对不起。', mood:'sad'},
        {type:'talk', speaker:'jiangyu', text:'你来得太晚了。'},
        {type:'ending', id:'jiangyu_bad'}
      ]
    },

    /* ===== 真结局线（独立） ===== */
    'route_solo_1': {
      bg:'apartment', chapter:'独行 · 一', date:'7月25日 23:59',
      steps:[
        {type:'narration', text:'我把手机扣在桌上，谁都没回。'},
        {type:'talk', speaker:'linxia', text:'（今天，太累了。）'},
        {type:'talk', speaker:'linxia', text:'（他们的事，明天再说。）'},
        {type:'narration', text:'我关了灯，睡了这一周以来最踏实的一觉。'},
        {type:'goto', next:'route_solo_2'}
      ]
    },
    'route_solo_2': {
      bg:'gallery', chapter:'独行 · 二', date:'7月26日 10:30',
      steps:[
        {type:'narration', text:'第二天，我到美术馆，三个人都来了。'},
        {type:'narration', text:'沈砚之站在展厅中央，看见我，眉头几不可察地皱了一下。'},
        {type:'talk', speaker:'shenyan', text:'昨晚的消息，你没回。', mood:'neutral', sprite:'shenyan'},
        {type:'talk', speaker:'linxia', text:'太累了，睡了。'},
        {type:'talk', speaker:'shenyan', text:'……以后早些休息。', mood:'smile'},
        {type:'narration', text:'他没追问，转身走了。'},
        {type:'narration', text:'陆辞端着相机过来，欲言又止。'},
        {type:'talk', speaker:'luci', text:'林夏，昨晚……没事吧？', mood:'sad', sprite:'luci'},
        {type:'talk', speaker:'linxia', text:'没事。最近有点忙。'},
        {type:'talk', speaker:'luci', text:'哦。那、有事随时叫我。', mood:'sad'},
        {type:'narration', text:'江屿没出现。只在吧台留了一杯冰好的"夏"，附一张纸条：'},
        {type:'narration', text:'"睡不着的时候，喝这个。不用回。"'},
        {type:'talk', speaker:'linxia', text:'（他们都对我好。）'},
        {type:'talk', speaker:'linxia', text:'（可我现在，只想把自己理清楚。）'},
        {type:'goto', next:'route_solo_3'}
      ]
    },
    'route_solo_3': {
      bg:'gallery', chapter:'独行 · 三', date:'8月20日 15:00',
      steps:[
        {type:'narration', text:'我推掉了他们所有的私下邀约，把精力全砸进工作。'},
        {type:'narration', text:'馆长交给我一个棘手的案子：一位已故摄影师的遗作展，家属和画廊在版权上撕得不可开交。'},
        {type:'talk', speaker:'linxia', text:'（这种展，做好了能立住名声。做砸了，我就完了。）'},
        {type:'narration', text:'我连熬了三个通宵，方案改到第十一稿。'},
        {type:'narration', text:'第四个通宵的凌晨三点，我在办公室睡着了。'},
        {type:'narration', text:'醒来时，身上盖着一件男式外套。是沈砚之的。'},
        {type:'talk', speaker:'shenyan', text:'你这种拼命法，是想让我心疼，还是想让我心疼死。', mood:'sad', sprite:'shenyan'},
        {type:'talk', speaker:'linxia', text:'……我只是想靠自己。'},
        {type:'talk', speaker:'shenyan', text:'我知道。', mood:'sad'},
        {type:'talk', speaker:'shenyan', text:'所以我没替你做。只给你盖了件衣服。', mood:'smile'},
        {type:'narration', text:'他第一次，没有"替我安排"。'},
        {type:'talk', speaker:'linxia', text:'（……他也在学。）'},
        {type:'goto', next:'route_solo_4'}
      ]
    },
    'route_solo_4': {
      bg:'cafe', chapter:'独行 · 四', date:'9月1日 19:00',
      steps:[
        {type:'narration', text:'遗作展开幕前一周，三个人前后脚来找我。'},
        {type:'narration', text:'陆辞带着他拍的霓城夜景，说可以作为预热素材。'},
        {type:'talk', speaker:'luci', text:'不要钱。就想帮你。', mood:'sad', sprite:'luci'},
        {type:'narration', text:'江屿送来一份手写歌单，是他为这位摄影师生前最喜欢的几首歌重新编的简版。'},
        {type:'talk', speaker:'jiangyu', text:'展厅背景音。你挑挑。', mood:'sad', sprite:'jiangyu'},
        {type:'narration', text:'沈砚之则是直接把美术馆最好的展厅时段让给了我。'},
        {type:'talk', speaker:'shenyan', text:'不用谢。这是你应得的。', mood:'neutral', sprite:'shenyan'},
        {type:'narration', text:'三个人坐在咖啡馆的不同角落，彼此没说话，却都看着我。'},
        {type:'choice', prompt:'他们都在等你。你的回应是？', options:[
          {text:'感谢，但婉拒所有暧昧', hint:'走向真结局', effects:{affection:{}, flags:{solo_independent:1}}, next:'route_solo_5'},
          {text:'接受帮助，保持距离', hint:'走向真结局', effects:{affection:{}, flags:{solo_accept:1}}, next:'route_solo_5'}
        ]}
      ]
    },
    'route_solo_5': {
      bg:'gallery', chapter:'独行 · 终', date:'一年后',
      steps:[
        {type:'narration', text:'一年后。'},
        {type:'narration', text:'我从砚美术馆辞职了。'},
        {type:'narration', text:'我用这一年攒的钱，办了自己的第一个独立策展。'},
        {type:'narration', text:'主题叫——《霓城无事》。'},
        {type:'talk', speaker:'linxia', text:'（这一年，我学会了很多。）'},
        {type:'talk', speaker:'linxia', text:'（学会不被任何人定义。）'},
        {type:'talk', speaker:'linxia', text:'（学会一个人，也走得很好。）'},
        {type:'narration', text:'展厅里没有他们的画像，只有我拍下的这座城市的每一束光。'},
        {type:'narration', text:'开幕那天，三个人都没来。'},
        {type:'narration', text:'我举着酒杯，对着窗外，轻轻一笑。'},
        {type:'ending', id:'true_ending'}
      ]
    }
  }
};

if (typeof window !== 'undefined') window.STORY = STORY;
