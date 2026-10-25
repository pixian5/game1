/* ===== 霓虹心事 · 剧情数据：礼物商城、心情与心情影响 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



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
  brave:     { id:'brave',     icon:'😤', label:'决意',     hint:'有些事不能再拖了', tone:'strong' },
  anxious:   { id:'anxious',   icon:'😟', label:'不安',     hint:'夜色没有答案，心跳却一直没有停', tone:'tense' },
  reflective:{ id:'reflective',icon:'🫧', label:'沉思',     hint:'把梦写下来，才看清自己在害怕什么', tone:'neutral' },
  lonely:    { id:'lonely',    icon:'🌙', label:'孤单',     hint:'房间很安静，仍然可以向可信的人靠近', tone:'sad' },
  tired:     { id:'tired',     icon:'😪', label:'疲惫',     hint:'允许自己先休息，明天再做选择', tone:'neutral' },
  determined:{ id:'determined',icon:'🧭', label:'坚定',     hint:'答案还没出现，但你已经准备好面对它', tone:'strong' }
};

// 不同心情对男主消息语气的影响（仅作为对话分支提示）
STORY.moodEffects = {
  // 当玩家处于某心情时，发送特定回复会触发隐藏加成
  brave:   { flag:'mood_brave' },
  tangled: { flag:'mood_tangled', bonusPersonality:'emotional' },
  low:     { flag:'mood_low',     bonusPersonality:'dependent' },
  happy:   { flag:'mood_happy' },
  calm:    { flag:'mood_calm',    bonusPersonality:'rational' }
};
