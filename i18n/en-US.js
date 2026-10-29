/* ===== 霓虹心事 · English pack (en-US, v0.4.7 全量补完) =====
 * 覆盖 zh-CN 全部 47 条 UI 固定文案（key = 中文原文，含 {var} 占位）。
 * 未收录 key 由 I18N.translate 回退为中文原文；新增 UI 文案时请同步两侧。
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = {
    '在线': 'Online',
    '正在输入…': 'Typing…',
    // 商城/心情
    '请选择赠送对象': 'Choose someone to send a gift to',
    '先写点什么吧': 'Write something first',
    '已记下': 'Noted',
    // 关系/任务
    '暂不可领取': 'Not ready to claim yet',
    '策略已切换': 'Strategy switched',
    '观赏模式已开启': 'Spectator mode on',
    '观赏模式已停止': 'Spectator mode off',
    // 主题/图标
    '该主题尚未解锁': 'Theme not unlocked yet',
    '壁纸已切换': 'Wallpaper switched',
    '该图标主题尚未解锁': 'Icon theme not unlocked yet',
    '图标主题已切换': 'Icon theme switched',
    // 约会
    '约会结算失败': 'Failed to finish the date',
    '约会完成': 'Date completed',
    // 存档
    '保存失败': 'Save failed',
    '读取失败': 'Load failed',
    '已删除': 'Deleted',
    '删除失败': 'Delete failed',
    '导出失败': 'Export failed',
    '已导出': 'Exported',
    '导入控件缺失': 'Import control missing',
    '导入失败': 'Import failed',
    '存档失败': 'Save failed',
    '已继续游戏': 'Resumed game',
    '没有可继续的存档': 'No save to continue',
    '已保存到 {slot}': 'Saved to {slot}',
    '已读取 {slot}': 'Loaded {slot}',
    '已导入到 {slot}': 'Imported to {slot}',
    '导入失败：{reason}': 'Import failed: {reason}',
    '存档失败：{reason}': 'Save failed: {reason}',
    // 解谜
    '请输入答案': 'Enter your answer',
    '谜题已解开': 'Puzzle solved',
    '答案不对': 'Wrong answer',
    // 相册/旁白
    '照片未解锁': 'Photo not unlocked',
    '（沉默）': '(Silence)',
    '这里暂时没有新发现…': 'No new discoveries here yet…',
    // 梦魇/回忆
    '梦魇已解': 'Nightmare faced',
    '已回复': 'Replied',
    '这段回忆已经回味过了': 'This memory has already been revisited',
    '回忆结束': 'Memory ended',
    // 邀约/来电
    '已赴约': 'Arrived at the date',
    '已拒绝邀约': 'Invitation declined',
    '邀约已错过': 'Invitation missed',
    '未接来电': 'Missed call',
    '档案已保存': 'Note saved',
    '已挂断': 'Call ended',
    // 塔罗/语音
    '抽牌失败': 'Failed to draw a card',
    '语音已播放': 'Voicemail played',
    '正在回拨…': 'Calling back…',
    // 备忘录/朋友圈
    '写点什么吧': 'Write something first',
    '已发表': 'Posted',
    // 提示
    '智能提示已开启': 'Hints on',
    '智能提示已关闭': 'Hints off',
    // v0.7.3 Voicemail UI overhaul (keys are the zh-CN source strings; keep the two packs in sync)
    '语音信箱': 'Voicemail',
    '全部': 'All',
    '未听': 'Unplayed',
    '全部标为已听': 'Mark all played',
    '第 {day} 天': 'Day {day}',
    '共 {n} 条 · 未听 {m}': '{n} total · {m} unplayed',
    '还没有留言': 'No voicemails yet',
    '电话打来却没接的时候，对方会在这里留下几秒钟的话。': 'Miss a call, and they leave a few seconds of their voice here.',
    '没有未听的留言': 'No unplayed voicemails',
    '所有留言都听过了。': 'Every voicemail has been played.',
    '播放留言': 'Play voicemail',
    '播放进度': 'Playback progress',
    '关闭': 'Close',
    '回拨': 'Call back',
    '已听完': 'Played',
    '标记已听': 'Mark as played',
    '已标记为听完': 'Marked as played',
    '已标记 {n} 条为听完': 'Marked {n} as played',
    '删除': 'Delete',
    '确认删除？': 'Confirm delete?',
    '留言已删除': 'Voicemail deleted',
    // v0.7.4 Character name labels (pinyin per project convention; sync with zh-CN)
    '林夏': 'Lin Xia',
    '沈砚之': 'Shen Yanzhi',
    '陆辞': 'Lu Ci',
    '江屿': 'Jiang Yu',
    '苏苏': 'Su Su',
    '夏夏': 'Xiaxia',
    '小夏': 'Xiao Xia',
    '老夏': 'Lao Xia',
    '夏': 'Xia',
    '霓城': 'Nicheng',
    '雾港': 'Wugang',
    '霓城小分队': 'Nicheng Squad',
    '未知': 'Unknown',
    '独行线': 'Solo Route',
    '真结局': 'True Ending',
    '我': 'Me',
    '你': 'You',
    '昵称 · {nick}': 'Nickname · {nick}',
    '{char}发来邀约': '{char} sent an invitation',
    '进入{char}线': "Entering {char}'s route",
    '已送出 · {char} 好感 +{gain}': 'Sent to {char} · Affection +{gain}',
    '在「{group}」发了消息': 'New message in "{group}"',
    '★ {char} 关系阶段提升：{stage} · {title}': '★ {char} stage up: {stage} · {title}'
  };
})();
