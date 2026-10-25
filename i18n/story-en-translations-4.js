/* ===== 霓虹心事 · 剧情文本英译包·第四批（v0.6.2 阶段 G4，补全至 100%）=====
 * 覆盖：G1 六通电话脚本与信箱、G2 曲库描述、G3 二周目中段变体、邀约场景回复、
 * F4 节日收集品描述、day7/10 日常选项回复。
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = window.I18N_PACKS['en-US'] || {};
  Object.assign(window.I18N_PACKS['en-US'], {
    // ===== G2 音乐曲名与描述 =====
    "《夏》": "\"Summer\"",
    "写给没能活到夏天的妹妹的歌。": "A song for the sister who never lived to see summer.",
    "《渡鸦》": "\"The Raven\"",
    "三年前解散前的最后一首。": "The last one, recorded before they broke up three years ago.",
    "《雾》": "\"Fog\"",
    "解散前录的最后一首demo。雾散不散，他们没吵出答案。": "The last demo they recorded. Whether the fog would lift — they never settled it.",
    "《海》": "\"Sea\"",
    "他从不放给人听的一首钢琴小品。画《海》的那半年写的。": "A piano piece he never lets anyone hear. Written during the half year he painted \"Sea\".",
    "《灯》": "\"Lights\"",
    "你在天台那晚之后哼出来的调子。苏苏说像霓城的路灯。": "The tune you hummed after that rooftop night. Su Su says it sounds like Nicheng's streetlights.",
    "《无名 B 面》": "\"Untitled Side B\"",
    "《夏》的B面。最后一句话是：无事发生。": "Side B of \"Summer\". The last line: nothing happens.",
    // ===== G1 沈砚之电话① =====
    "林夏。打扰了。展签第三面墙的英文译名，我念给你听——": "Lin Xia. Sorry to bother you. The English titles on wall three — let me read them to you—",
    "……不对。": "...No. That's not right.",
    "哪里不对？": "What's wrong?",
    "译名明天再核吧，太晚了": "Check the titles tomorrow. It's late",
    "不对的不是译名。是我不该在十点半，用工作当借口打这通电话。": "It's not the titles that are wrong. It's me — calling at half past ten with work as an excuse.",
    "……办公室很安静。那幅《海》挂在对面。我看了它五年，今晚第一次觉得，它想听的不是我的声音。": "...The office is quiet. \"Sea\" hangs across from me. Five years I've looked at it, and tonight is the first time I feel it doesn't want my voice.",
    "那你想听谁的声音？": "Whose voice does it want, then?",
    "早点回去休息": "Go home and rest early",
    "……晚安，林夏。明天九点，译名的事——当我没打过这通电话。": "...Good night, Lin Xia. Nine tomorrow, about the titles — pretend I never made this call.",
    "（语音信箱 23\"）：展签译名……算了。晚安。": "(Voicemail 23\"): The wall titles... never mind. Good night.",
    "译名已核。第三面墙用你说的那个。——电话里提的事，忘了吧。": "Titles checked. Wall three will use yours. — Forget what I brought up on the phone.",
    // ===== G1 沈砚之电话② =====
    "（听筒里是车窗风声，很长的一段沉默。）": "(Wind past a train window. A long stretch of silence.)",
    "（也不说话，陪着听）": "(Say nothing. Just listen with him)",
    "你到家了吗？": "Are you home yet?",
    "高铁过江了。那座桥的灯，一盏一盏往后退。": "The train crossed the river. The bridge lights fell back one by one.",
    "我小时候坐这趟车，总在数灯。数到睡着，就不会想家里的事。": "As a kid on this line I'd count the lights. Count until I fell asleep, and then I wouldn't think about home.",
    "……刚才数到第一百盏，想告诉你。仅此而已。晚安。": "...I got to the hundredth just now and wanted to tell you. That's all. Good night.",
    "（语音信箱 8\"）：……风声，和一串灯。抱歉，按错了。": "(Voicemail 8\"): ...Wind, and a string of lights. Sorry, wrong button.",
    // ===== G1 陆辞电话① =====
    "嘘——别挂。听。": "Shh — don't hang up. Listen.",
    "（水声。缓慢的、定时的水流过什么东西的声音。）": "(Running water. Slow, rhythmic, washing over something.)",
    "这是……显影的水声？": "Is that... the rinse for developing?",
    "你在洗照片？": "You're washing a print?",
    "对。红灯下，照片正在慢慢浮出来。这是我听过最安静的等待。": "Yeah. Under the red light the image is slowly surfacing. The quietest waiting I know.",
    "以前这个时候我谁也不告诉。今天想让电话那头也有人听着。": "I never tell anyone at this hour. Today I wanted someone on the other end of the line to hear it.",
    "那我就听着，直到它浮出来": "Then I'll listen until it surfaces",
    "洗完给我看": "Show me when it's done",
    "（水声停了。）……好了。是一张你的侧脸——今天你在展厅打光的侧影。明天给你。": "(The water stops.) ...Done. It's your profile — the silhouette of you working the gallery lights today. I'll give it to you tomorrow.",
    "（语音信箱 15\"）：水声，和……嗯，没什么。明天你看相册就知道了。": "(Voicemail 15\"): Water, and... mm, nothing. Check your album tomorrow.",
    // ===== G1 陆辞电话② =====
    "（背景是机场广播：飞往米兰的旅客——）": "(Airport announcement in the background: passengers flying to Milan—)",
    "林夏。我在安检口。": "Lin Xia. I'm at security.",
    "你真的决定走了？": "You've really decided to go?",
    "……一路平安": "...Safe travels",
    "九年前没说出口的话，我写在了信封里。如果你哪天想找答案，去旧学校的储物柜。": "What I couldn't say nine years ago is in an envelope. If you ever want the answer, go to the old school locker.",
    "广播催了。这次换我先挂——不然我又会像九年前一样，话到嘴边就转弯。": "The announcement's calling. This time I hang up first — otherwise I'll turn the words around at the last second again, like nine years ago.",
    "……再见，林夏。不。是，再见。": "...Goodbye, Lin Xia. No. I mean — goodbye.",
    "（语音信箱 20\"）：广播响了……答案在储物柜。密码是那一天。你要自己想起来才算数。": "(Voicemail 20\"): The announcement went off... the answer's in the locker. The code is that day. It only counts if you remember it yourself.",
    // ===== G1 江屿电话① =====
    "（喘息声。琴弦的余震。）……台下来了三个人。": "(Breathing. The echo of guitar strings.) ...Three people came down front.",
    "唱完了？感觉怎么样": "Finished? How did it feel?",
    "你在抖": "You're shaking",
    "唱完才发现，手一直是抖的。三年没上台，我以为我好了。": "Only after did I notice my hands had been shaking the whole time. Three years off stage — I thought I was over it.",
    "……刚才闭眼唱副歌的时候，台下有一盏灯特别亮。我当那是你。": "...When I closed my eyes in the chorus, one light down there was especially bright. I pretended it was you.",
    "那就是我": "That was me",
    "下次我站到最前面": "Next time I'll stand in the very front",
    "……好。下次，第一排中间。灯给你留着。": "...Okay. Next time, front row center. The light's saved for you.",
    "（语音信箱 11\"）：喘气声很吵，抱歉……今晚，谢谢。": "(Voicemail 11\"): The breathing's loud, sorry... thank you, tonight.",
    // ===== G1 江屿电话② =====
    "……喂。没什么事。": "...Hey. Nothing's wrong.",
    "B面写完了。最后一句话：无事发生。": "Side B is done. The last line: nothing happens.",
    "无事发生，是最好的事": "Nothing happening is the best thing",
    "唱给我听": "Sing it to me",
    "（轻轻哼了两句，没有伴奏。）……以前打电话都要有事。跟你，才知道没事也可以打。": "(Hums two lines, no accompaniment.) ...Calls used to need a reason. With you, I learned they don't.",
    "霓城今晚没有雾。就这样。晚安。": "No fog in Nicheng tonight. That's all. Good night.",
    "（语音信箱 6\"）：……霓城没雾。晚安。": "(Voicemail 6\"): ...No fog in Nicheng. Good night.",
    // ===== G2 天台解锁《灯》 =====
    "夏夏！天台那晚你哼的那个调子，我录下来了发给小杨——他编成完整的一段！": "Xiaxia! That tune you hummed on the rooftop — I recorded it and sent it to Xiao Yang. He arranged a full section!",
    // ===== G3 二周目中段变体 =====
    "林夏。上一次在这个天台，我把话憋回去了九年。": "Lin Xia. Last time on this rooftop, I swallowed my words for nine years.",
    "这一次我不打算再等。我喜欢你——从高一你借我橡皮那天起，到这个第二次的天台。": "This time I'm not waiting. I like you — from the day you lent me an eraser in first year, to this rooftop the second time around.",
    "我活着，有什么用。……这句话，我好像说过一次了。": "What's the point of me being alive. ...I think I've said that once before.",
    "但你还是来了。第二次也来了。……抱住我。这次我不装了。": "But you came anyway. Second time, still came. ...Hold me. This time I'm not pretending.",
    "（又是那场晚宴。他介绍你时——你先一步伸出了手。）": "(That dinner again. As he starts to introduce you — you offer your hand first.)",
    "……林夏会抢在我前面介绍了。她是我请来的策展人，也是这里的常客。": "...Lin Xia beats me to the introductions now. She's the curator I invited — and a regular here.",
    // ===== 邀约场景回复 =====
    "\"因为我画不出别的。三年了，只画得出你。\"": "\"Because I can't paint anything else. Three years, and all I can paint is you.\"",
    "\"……抱歉。我把它收起来。\"": "\"...Sorry. I'll put it away.\"",
    "\"不叫偷拍。叫记录。我记录了你九年。\"": "\"It's not a sneak shot. It's a record. I've been recording you for nine years.\"",
    "\"怕说了，连记录的机会都没了。\"": "\"I was afraid if I said it, I'd lose even the chance to record.\"",
    "\"都给你。连人一起，都给你。\"": "\"All yours. Everything — the photos and me.\"",
    "\"……好。你写。我唱。\"": "\"...Okay. You write it. I'll sing it.\"",
    "\"也对。没结局的歌，才听得最久。\"": "\"Fair. Songs without an ending are the ones you listen to longest.\"",
    "\"不急。我等了三年，不差这一晚。\"": "\"No rush. I've waited three years — one night more won't matter.\"",
    "\"你比自己想象的，更值得被画下来。\"": "\"You're more worth painting than you think.\"",
    // ===== F4 节日收集品 =====
    "雾港的冬至限定：饺子汤圆双拼，两种都热。": "Wugang's winter-solstice special: dumplings and tangyuan, both hot.",
    "冬至（12月21日）登录": "Log in on the winter solstice (Dec 21)",
    "零点的江边灯串连成一条河。背面写着：新年也要来看。": "The riverside lights at midnight, strung into a river. On the back: come see it again next year.",
    "跨年夜（12月31日）登录": "Log in on New Year's Eve (Dec 31)",
    "巷口第一株樱花的落款。苏苏说：樱花只开十天，邮戳能留一年。": "The first cherry blossom at the alley mouth. Su Su says: blossoms last ten days, a postmark lasts a year.",
    "春分（3月20日）登录": "Log in on the spring equinox (Mar 20)",
    // ===== day7/10 日常选项回复 =====
    "（你把三个名字在心里过了一遍，像清点战利品。）": "(You run the three names through your mind, like counting spoils.)",
    "（陌生感没有消失，只是学会了和它同睡一张床。）": "(The strangeness hasn't gone. You've just learned to share a bed with it.)",
    "（你掀开被子。霓城不相信赖床的人。）": "(You throw off the covers. Nicheng doesn't believe in sleepers-in.)",
    "（你拍下了一张没有霓虹的霓城。相册里第一张\"素颜\"照片。）": "(You take a shot of Nicheng without neon. The first bare-faced photo in the album.)",
    "（发出去三秒就收到回复。原来也有人醒着。）": "(A reply in three seconds. So someone else is awake too.)",
    "（你把闹钟按掉。十分钟后自然醒，窗外已经亮了。）": "(You silence the alarm. Ten minutes later you wake on your own — the window's already bright.)"
  });
})();
