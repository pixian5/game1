/* ===== 霓虹心事 · 剧情数据：闪回/前传章节 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// ===== 闪回/前传章节 =====
// 通过特定条件触发，进入独立时间线，揭示过去的记忆
STORY.flashbacks = {
  'fb_highschool_luci': {
    title:'闪回 · 九年前的军训操场',
    time:'九年前',
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
    then:'fb_highschool_luci_after'
  },
  'fb_highschool_jiangyu': {
    title:'闪回 · 八年前的天台',
    time:'八年前',
    trigger: s => s.affection.jiangyu >= 4 && s.flags.want_listen && !s.flags.fb_highschool_jiangyu,
    desc:'江屿唱《夏》的那个夜晚，你突然想起来了——\n八年前，你听过同样的副歌。在另一座天台。',
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
    then:'fb_highschool_jiangyu_after'
  },
  // v0.1.6: 补上沈砚之的闪回（原先只有陆辞/江屿两条），与"真相结局"呼应但不剧透
  'fb_gallery_shenyan': {
    title:'闪回 · 五年前的美术馆',
    time:'五年前',
    trigger: s => s.affection.shenyan >= 4 && s.flags.intel_shenyan_ex && !s.flags.fb_gallery_shenyan,
    desc:'你路过砚美术馆的旧展厅，脚步忽然慢了下来——\n五年前的那个下午，你好像来过这里。',
    scenes:[
      {text:'五年前。你还在读大二，跟着来霓城办展的陆辞，第一次走进这间美术馆。\n展厅最里面，有个人站在一幅画前，站了很久。'},
      {text:'你在旁边一幅画前停下了。\n画上是一片没有人的海。\n临走前，你回头，对等在门口的陆辞笑了一下：\n"以后，我想在这样的地方工作。"', choice:{
        prompt:'你想起来了。',
        options:[
          {text:'原来策展人的梦，是从那天开始的', personality:{active:1, rational:1}, shard:'没有人的海'},
          {text:'那时候的陆辞，一直站在门口等我', personality:{emotional:1, dependent:1}, shard:'门口的身影'},
          {text:'我没有多看那个人一眼', personality:{independent:2}, shard:'错过的目光'}
        ]
      }},
      {text:'你没有注意到——展厅的角落里，有人在你回头笑的那一刻，停住了笔。\n那天之后，他开始画一幅新的画。\n那幅画，他画了五年。'}
    ],
    reward:{flag:'fb_gallery_shenyan'},
    then:'fb_gallery_shenyan_after'
  }
};
