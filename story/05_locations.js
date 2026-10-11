/* ===== 霓虹心事 · 剧情数据：地点与偶遇、回忆剧情 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */


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
  school: {
    name:'旧学校', icon:'🏫', bg:'linear-gradient(160deg,#1a2e0a 0%,#071208 100%)',
    hint:'操场边的银杏又长高了，九年的落叶堆在台阶上',
    // v0.1.9: 补齐旧学校偶遇（此前为空）
    encounters: [
      { id:'school_luci_ginkgo', char:'luci',
        condition: s => s.day >= 3 && s.affection.luci >= 0,
        once:true,
        title:'银杏树下的第九年',
        desc:'陆辞站在操场边的银杏树下，手里捏着一张泛黄的照片。\n看见你，他扬了扬照片："高一军训。你晒得比我还黑。"\n风把落叶卷到你们中间。',
        choice: { prompt:'他把照片递过来。',
          options:[
            {text:'接过照片仔细看', affection:{luci:2}, reply:'"背面还有。"照片背后是一行小字：今天她笑了，记一笔。', personality:{emotional:1}},
            {text:'笑他当时太傻', affection:{luci:1}, reply:'"傻？"他也笑，"傻了九年，恒心奖该发我。"', personality:{active:1}},
            {text:'还给他，说风大', affection:{luci:0}, reply:'"……嗯。"他把照片收回口袋，动作很轻，像收起一段没说完的话。', personality:{independent:1}}
          ]
        }
      },
      { id:'school_shenyan_sketch', char:'shenyan',
        condition: s => s.day >= 4 && s.affection.shenyan >= 0,
        once:true,
        title:'写生簿里的旧学校',
        desc:'放学后的走廊尽头，沈砚之支着画架在写生。\n画的是这栋旧教学楼，笔触比他平时的画柔软很多。\n"美术馆收城市记忆。"他没回头，"有人把青春存在这里，我来取件。"',
        choice: { prompt:'夕阳落在他的画纸上。',
          options:[
            {text:'问画里画了谁的记忆', affection:{shenyan:2}, reply:'他顿了一下："……一个在这里待了九年的人的。"\n画角落有棵银杏。你想起陆辞说他在树下站了九年。', personality:{rational:1}},
            {text:'夸他画得好', affection:{shenyan:1}, reply:'"普通。"他嘴上否定，却把画纸往你那边偏了偏，"……构图还可以。"', personality:{emotional:1}},
            {text:'安静地看他画完', affection:{shenyan:1}, reply:'他没再说话。粉笔灰在光里浮动。\n画完时他说："陪我取件的人，也算共犯。"', personality:{passive:1}}
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
