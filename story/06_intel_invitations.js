/* ===== 霓虹心事 · 剧情数据：苏苏情报与邀约事件 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */


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
