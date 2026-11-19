/* neon-heart bundle v0.9.7 — 由 68 个源文件按加载顺序合并（tools/build_bundle.mjs） */

/* ===== i18n/zh-CN.js ===== */
/* ===== 霓虹心事 · 中文语言包（zh-CN，默认语言）=====
 * key = 中文原文；value = 当前语言文案（中文即自身，为将来 en-US 预留映射位）。
 * 本版覆盖 UI 固定文案（toast）；带变量的动态串由调用处拼接，未命中则回退原文。
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['zh-CN'] = {
    '没有未读消息': '没有未读消息',
    '已全部标为已读': '已全部标为已读',
    '全部已读': '全部已读',
    '🔊 音效：开': '🔊 音效：开',
    '🎵 环境音：关': '🎵 环境音：关',
    '在线': '在线',
    '正在输入…': '正在输入…',
    // 商城/心情
    '请选择赠送对象': '请选择赠送对象',
    '先写点什么吧': '先写点什么吧',
    '已记下': '已记下',
    // 关系/任务
    '暂不可领取': '暂不可领取',
    '策略已切换': '策略已切换',
    '观赏模式已开启': '观赏模式已开启',
    '观赏模式已停止': '观赏模式已停止',
    // 主题/图标
    '该主题尚未解锁': '该主题尚未解锁',
    '壁纸已切换': '壁纸已切换',
    '该图标主题尚未解锁': '该图标主题尚未解锁',
    '图标主题已切换': '图标主题已切换',
    // 约会
    '约会结算失败': '约会结算失败',
    '约会完成': '约会完成',
    // 存档
    '保存失败': '保存失败',
    '读取失败': '读取失败',
    '已删除': '已删除',
    '删除失败': '删除失败',
    '导出失败': '导出失败',
    '已导出': '已导出',
    '导入控件缺失': '导入控件缺失',
    '导入失败': '导入失败',
    '存档失败': '存档失败',
    '已继续游戏': '已继续游戏',
    '没有可继续的存档': '没有可继续的存档',
    // 谜题/收藏
    '请输入答案': '请输入答案',
    '谜题已解开': '谜题已解开',
    '答案不对': '答案不对',
    '照片未解锁': '照片未解锁',
    // 其他
    '（沉默）': '（沉默）',
    '这里暂时没有新发现…': '这里暂时没有新发现…',
    '梦魇已解': '梦魇已解',
    '已回复': '已回复',
    '这段回忆已经回味过了': '这段回忆已经回味过了',
    '回忆结束': '回忆结束',
    '已赴约': '已赴约',
    '已拒绝邀约': '已拒绝邀约',
    '邀约已错过': '邀约已错过',
    '未接来电': '未接来电',
    '档案已保存': '档案已保存',
    '已挂断': '已挂断',
    '抽牌失败': '抽牌失败',
    '语音已播放': '语音已播放',
    '正在回拨…': '正在回拨…',
    '写点什么吧': '写点什么吧',
    '已发表': '已发表',
    '智能提示已开启': '智能提示已开启',
    '智能提示已关闭': '智能提示已关闭',
    // v0.7.3 语音信箱 UI 深化（key = 中文原文，新增 UI 文案请同步 en-US）
    '语音信箱': '语音信箱',
    '全部': '全部',
    '未听': '未听',
    '全部标为已听': '全部标为已听',
    '第 {day} 天': '第 {day} 天',
    '共 {n} 条 · 未听 {m}': '共 {n} 条 · 未听 {m}',
    '还没有留言': '还没有留言',
    '电话打来却没接的时候，对方会在这里留下几秒钟的话。': '电话打来却没接的时候，对方会在这里留下几秒钟的话。',
    '没有未听的留言': '没有未听的留言',
    '所有留言都听过了。': '所有留言都听过了。',
    '播放留言': '播放留言',
    '播放进度': '播放进度',
    '关闭': '关闭',
    '回拨': '回拨',
    '已听完': '已听完',
    '标记已听': '标记已听',
    '已标记为听完': '已标记为听完',
    '已标记 {n} 条为听完': '已标记 {n} 条为听完',
    '删除': '删除',
    '确认删除？': '确认删除？',
    '留言已删除': '留言已删除',
    // v0.7.4 角色名 UI 标签英文化（key=中文原名，与剧情拼音译名表对齐；两包同步新增）
    '林夏': '林夏',
    '沈砚之': '沈砚之',
    '陆辞': '陆辞',
    '江屿': '江屿',
    '苏苏': '苏苏',
    '夏夏': '夏夏',
    '小夏': '小夏',
    '老夏': '老夏',
    '夏': '夏',
    '霓城': '霓城',
    '雾港': '雾港',
    '霓城小分队': '霓城小分队',
    '未知': '未知',
    '独行线': '独行线',
    '真结局': '真结局',
    '我': '我',
    '你': '你',
    '昵称 · {nick}': '昵称 · {nick}',
    '{char}发来邀约': '{char}发来邀约',
    '进入{char}线': '进入{char}线',
    '已送出 · {char} 好感 +{gain}': '已送出 · {char} 好感 +{gain}',
    '在「{group}」发了消息': '在「{group}」发了消息',
    '★ {char} 关系阶段提升：{stage} · {title}': '★ {char} 关系阶段提升：{stage} · {title}',
    '{m}月{d}日': '{m}月{d}日',   // v0.7.7：主屏日期（英文模式 {m}/{d}）

    // v0.7.8 静态 HTML 文本英文化（data-i18n 扫描替换，key=中文原文；两包同步新增）
    // —— index.html 静态文本（App 名/标题/按钮/placeholder）——
    '主角': '主角',
    '主角档案': '主角档案',
    '主页': '主页',
    '主题': '主题',
    '主题壁纸': '主题壁纸',
    '今日': '今日',
    '今日任务': '今日任务',
    '信物': '信物',
    '全部': '全部',
    '全部标为已听': '全部标为已听',
    '关系': '关系',
    '关系阶段': '关系阶段',
    '关闭': '关闭',
    '再来一次 · 二周目': '再来一次 · 二周目',
    '出行': '出行',
    '印章': '印章',
    '发动态': '发动态',
    '发表': '发表',
    '取消': '取消',
    '合上这页': '合上这页',
    '向上滑动解锁': '向上滑动解锁',
    '商店': '商店',
    '图鉴': '图鉴',
    '塔罗': '塔罗',
    '塔罗占卜': '塔罗占卜',
    '备忘录': '备忘录',
    '好感度深度': '好感度深度',
    '存档': '存档',
    '存档管理': '存档管理',
    '已送出': '已送出',
    '当前位置': '当前位置',
    '录音': '录音',
    '心情': '心情',
    '性格画像': '性格画像',
    '成就': '成就',
    '挂断': '挂断',
    '接听': '接听',
    '提示': '提示',
    '收集柜': '收集柜',
    '日历': '日历',
    '明信片': '明信片',
    '智能提示': '智能提示',
    '朋友圈': '朋友圈',
    '未听': '未听',
    '来电…': '来电…',
    '梦魇': '梦魇',
    '梦魇录': '梦魇录',
    '每日约会': '每日约会',
    '消息': '消息',
    '深度': '深度',
    '电话': '电话',
    '男主视角': '男主视角',
    '画像': '画像',
    '相册': '相册',
    '真相': '真相',
    '礼物商城': '礼物商城',
    '票根': '票根',
    '约会': '约会',
    '线索本': '线索本',
    '结局图鉴': '结局图鉴',
    '继续游戏': '继续游戏',
    '群': '群',
    '群聊': '群聊',
    '背包': '背包',
    '节日': '节日',
    '观赏': '观赏',
    '观赏模式': '观赏模式',
    '视角': '视角',
    '设置': '设置',
    '证据': '证据',
    '语音信箱': '语音信箱',
    '谜题': '谜题',
    '输入你想说的话…': '输入你想说的话…',
    '这一刻的想法…': '这一刻的想法…',
    '选择要去的地方': '选择要去的地方',
    '通讯录': '通讯录',
    '通话记录': '通话记录',
    '配图：': '配图：',
    '重新开始': '重新开始',
    '闪回': '闪回',
    '隐私与数据说明': '隐私与数据说明',
    '霓城 · 28°C 多云': '霓城 · 28°C 多云',
    '霓城时节': '霓城时节',
    '音乐': '音乐',
    '🌙 隐藏彩蛋': '🌙 隐藏彩蛋',
    '🚶 出行会推进时间，可能遇见某个人、触发新消息': '🚶 出行会推进时间，可能遇见某个人、触发新消息',
    // —— 日期标签显示层重拼（localizeDateLabel：weekday 值 + 模板）——
    '星期一': '星期一',
    '星期二': '星期二',
    '星期三': '星期三',
    '星期四': '星期四',
    '星期五': '星期五',
    '星期六': '星期六',
    '星期日': '星期日',
    '{m}月{d}日 {w}': '{m}月{d}日 {w}',
    // —— JS 文案缺口补齐 ——
    '暂无消息': '暂无消息',
    '通话中': '通话中',   // v0.7.8：通话状态标签
    '通话结束': '通话结束',
  };
})();

/* ===== i18n/en-US.js ===== */
/* ===== 霓虹心事 · English pack (en-US, v0.4.7 全量补完) =====
 * 覆盖 zh-CN 全部 47 条 UI 固定文案（key = 中文原文，含 {var} 占位）。
 * 未收录 key 由 I18N.translate 回退为中文原文；新增 UI 文案时请同步两侧。
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = {
    '全部已读': 'Mark All Read',
    '已全部标为已读': 'All marked as read',
    '没有未读消息': 'No unread messages',
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
    // v0.8.6：空态与界面提示文案补齐（商业级双语测试发现的 25 条残留）
    '还没有动态': 'No posts yet',
    '点击右上角': 'Tap the top-right corner',
    '发一条': 'to post',
    '还没有解锁照片': 'No photos unlocked yet',
    '继续剧情': 'Continue the story',
    '赴约或拍照后会出现': 'Photos appear after dates or story events',
    '星期二': 'Tuesday',
    '今日暂无日程': 'No events today',
    '未播放': 'Not playing',
    '环境音': 'Ambient',
    '入职第一天': 'First Day',
    '沈砚之': 'Shen Yanzhi',
    '主理人': 'Director',
    '剧情文本将随语言逐步补全': 'Story text will be translated gradually',
    '未翻译处回退中文': 'Untranslated parts fall back to Chinese',
    '总音量': 'Master',
    '提示音效': 'Sound FX',
    '环境音乐': 'Ambient Music',
    '自动存档会在关键进度变化时写入': 'Auto-save writes at key progress points',
    '手动槽位可长期保留': 'Manual slots persist long-term',
    '支持导出': 'Export supported',
    '自动存档': 'Auto Save',
    '未选线': 'No route yet',
    '暂无': 'None',
    '未解锁': 'Locked',
    '还没有解锁照片——继续剧情、赴约或拍照后会出现。': 'No photos yet — continue the story, go on dates, or take photos.',
    '暂无照片': 'No photos',
    '暂无通话记录': 'No call logs',
    '还没有群聊': 'No group chats yet',
    '暂无线索': 'No clues yet',
    '暂无视角': 'No perspectives yet',
    '美术馆报到': 'Museum Registration',
    '砚美术馆': 'Yan Art Museum',
    '开幕式筹备': 'Opening Prep',
    '美术馆会议室': 'Museum Meeting Room',
    '开幕式': 'Opening Ceremony',
    '砚美术馆展厅': 'Museum Gallery',
    '雾港酒吧': 'Wugang Bar',
    '巷子深处': 'Deep in the Alley',
    '星期一': 'Monday',
    '星期二': 'Tuesday',
    '星期三': 'Wednesday',
    '星期四': 'Thursday',
    '星期五': 'Friday',
    '星期六': 'Saturday',
    '星期日': 'Sunday',
    '梦境尚未开始，你的画像正在形成中': 'Dreams haven\'t begun yet — your portrait is forming',
    '邀约记录': 'Invitation Log',
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
    '★ {char} 关系阶段提升：{stage} · {title}': '★ {char} stage up: {stage} · {title}',
    '{m}月{d}日': '{m}/{d}',   // v0.7.7：主屏日期

    // v0.7.8 Static HTML text i18n (data-i18n scan; keys are Chinese source; sync with zh-CN)
    // —— index.html static text (app names / headers / buttons / placeholders) ——
    '主角': 'Player',
    '主角档案': 'Player Profile',
    '主页': 'Profile',
    '主题': 'Themes',
    '主题壁纸': 'Themes',
    '今日': 'Today',
    '今日任务': 'Daily Tasks',
    '信物': 'Mementos',
    '全部': 'All',
    '全部标为已听': 'Mark All Heard',
    '关系': 'Relations',
    '关系阶段': 'Relationship Stages',
    '关闭': 'Close',
    '再来一次 · 二周目': 'Play Again · New Game+',
    '出行': 'Map',
    '印章': 'Stamps',
    '发动态': 'New Post',
    '发表': 'Post',
    '取消': 'Cancel',
    '合上这页': 'Close This Page',
    '向上滑动解锁': 'Swipe up to unlock',
    '商店': 'Store',
    '图鉴': 'Endings',
    '塔罗': 'Tarot',
    '塔罗占卜': 'Tarot Reading',
    '备忘录': 'Notes',
    '好感度深度': 'Affection Depth',
    '存档': 'Saves',
    '存档管理': 'Save Manager',
    '已送出': 'Sent',
    '当前位置': 'Current Location',
    '录音': 'Recordings',
    '心情': 'Mood',
    '性格画像': 'Personality',
    '成就': 'Achievements',
    '挂断': 'Decline',
    '接听': 'Accept',
    '提示': 'Hints',
    '收集柜': 'Collection',
    '日历': 'Calendar',
    '明信片': 'Postcards',
    '智能提示': 'Smart Hints',
    '朋友圈': 'Moments',
    '未听': 'Unheard',
    '来电…': 'Incoming…',
    '梦魇': 'Dreams',
    '梦魇录': 'Dream Log',
    '每日约会': 'Daily Dates',
    '消息': 'Messages',
    '深度': 'Affection',
    '电话': 'Phone',
    '男主视角': 'His Perspective',
    '画像': 'Profile',
    '相册': 'Album',
    '真相': 'The Truth',
    '礼物商城': 'Gift Shop',
    '票根': 'Tickets',
    '约会': 'Dates',
    '线索本': 'Clue Book',
    '结局图鉴': 'Ending Gallery',
    '继续游戏': 'Continue Game',
    '群': 'Group',
    '群聊': 'Groups',
    '背包': 'Bag',
    '节日': 'Festivals',
    '观赏': 'Watch',
    '观赏模式': 'Watch Mode',
    '视角': 'Perspective',
    '设置': 'Settings',
    '证据': 'Evidence',
    '语音信箱': 'Voicemail',
    '谜题': 'Puzzle',
    '输入你想说的话…': 'Type something…',
    '这一刻的想法…': 'What\'s on your mind…',
    '选择要去的地方': 'Choose a destination',
    '通讯录': 'Contacts',
    '通话记录': 'Call Log',
    '配图：': 'Image:',
    '重新开始': 'Restart',
    '闪回': 'Flashback',
    '隐私与数据说明': 'Privacy & Data',
    '霓城 · 28°C 多云': 'Nicheng · 28°C Cloudy',
    '霓城时节': 'Nicheng Seasons',
    '音乐': 'Music',
    '🌙 隐藏彩蛋': '🌙 Hidden Eggs',
    '🚶 出行会推进时间，可能遇见某个人、触发新消息': '🚶 Going out advances time — you may meet someone or trigger new messages',
    // —— Date label reassembly (localizeDateLabel: weekday values + template) ——
    '星期一': 'Mon',
    '星期二': 'Tue',
    '星期三': 'Wed',
    '星期四': 'Thu',
    '星期五': 'Fri',
    '星期六': 'Sat',
    '星期日': 'Sun',
    '{m}月{d}日 {w}': '{m}/{d} {w}',
    // —— JS copy gap fill ——
    '暂无消息': 'No messages yet',
    '通话中': 'In Call',   // v0.7.8: call status labels
    '通话结束': 'Call Ended',
    // —— v0.8.7 双语长尾 ——
    '🔊 音效：开': '🔊 Sound: On',
    '🔇 音效：关': '🔇 Sound: Off',
    '🎵 环境音：开': '🎵 Ambient: On',
    '🎵 环境音：关': '🎵 Ambient: Off',
    '等到明天': 'Skip to Tomorrow',
    '推进到次日早上 8:00': 'Advance to 8:00 next morning',
    '一夜过去…': 'A night passes…',
    '还没来过这里——继续剧情，路会自己出现': "You haven't been here yet — keep playing and the path will open",
    '梦境尚未开始': "Dreams haven't begun yet",
    '你的画像正在形成中…': 'your portrait is forming…',
    '一个人的房间，窗外是霓城不眠的灯': 'A room for one, with the sleepless lights of Neon City outside',
    '当前': 'Current',
    '出发': 'Set out',
    '1. 9点前到美术馆\n2. 找人事办手续\n3. 沈砚之——主理人，据说难搞': '1. Be at the museum before 9\n2. Find HR to complete onboarding\n3. Shen Yanzhi — the director, said to be difficult',
    // —— v0.8.7 数据层（地点/角色/商店/邀约/心情/成就/收集/主题）——
    '旧学校': 'Old School',
    '操场边的银杏又长高了，九年的落叶堆在台阶上': 'The ginkgo by the playground has grown taller; nine years of fallen leaves pile on the steps',
    '空旷的展厅，回声里都是秘密': 'An empty gallery where every echo holds a secret',
    '爵士乐混着酒精，故事发酵的地方': 'Jazz mixes with alcohol — where stories ferment',
    '霓城的灯海，从这里看像一条流动的银河': 'The sea of lights in Neon City looks like a flowing galaxy from here',
    '霓城街头': 'Neon City Streets',
    '霓虹与雨水的城市，每个转角都是未知': 'A city of neon and rain, every corner unknown',
    '美术馆主理人，温柔腹黑': 'Museum director — gentle on the surface, calculating underneath',
    '自由摄影师，青梅竹马': 'Freelance photographer, childhood friend',
    '酒吧调酒师，前乐队主唱': 'Bar bartender, former band frontman',
    '大学闺蜜，八卦王': 'College best friend, queen of gossip',
    '绝版画册': 'Out-of-Print Art Book',
    '罕见的当代画册，扉页还带作者签名': 'A rare contemporary art book, signed on the title page',
    '艺术': 'Art',
    '复古胶卷相机': 'Vintage Film Camera',
    '七十年代机械相机，快门声清脆如初': 'A 1970s mechanical camera with a shutter as crisp as new',
    '摄影': 'Photography',
    '黑胶唱片': 'Vinyl Record',
    '限量黑胶，B面藏着一首未公开曲': 'Limited vinyl with an unreleased track hidden on side B',
    '调酒器具': 'Cocktail Set',
    '专业调酒七件套，铜质光泽': 'Seven-piece professional bartending set with a copper sheen',
    '酒具': 'Barware',
    '手作暖茶罐': 'Handmade Tea Tin',
    '桂花乌龙茶包，温热又妥帖': 'Osmanthus oolong tea bags — warm and comforting',
    '日常': 'Daily',
    '速写钢笔': 'Sketching Pen',
    '手工打磨笔尖，适合速写': 'Hand-polished nib, made for sketching',
    '过期胶卷': 'Expired Film',
    '过期三个月，拍出来颜色会偏暖': 'Expired three months ago; colors come out warmer',
    '空白黑胶': 'Blank Vinyl',
    '可以录一段自己的声音': 'You can record a piece of your own voice',
    '明晚 20:00': 'Tomorrow 20:00',
    '周六 09:00': 'Saturday 09:00',
    '今晚 21:00': 'Tonight 21:00',
    '开心': 'Happy',
    '阳光穿过指缝，连呼吸都轻快': 'Sunlight slips through your fingers; even breathing feels light',
    '平静': 'Calm',
    '像深夜的霓城，安静地亮着': 'Like Neon City at midnight — quietly lit',
    '纠结': 'Torn',
    '两个方向都想要，又都不敢要': 'You want both directions, yet dare not choose either',
    '低落': 'Low',
    '今天的云比平时沉一点': "Today's clouds sit a little heavier than usual",
    '决意': 'Resolute',
    '有些事不能再拖了': "Some things can't be put off any longer",
    '不安': 'Anxious',
    '夜色没有答案，心跳却一直没有停': "The night offers no answers, but your heart won't stop racing",
    '沉思': 'Reflective',
    '把梦写下来，才看清自己在害怕什么': "Write the dream down, and you see what you're afraid of",
    '孤单': 'Lonely',
    '房间很安静，仍然可以向可信的人靠近': 'The room is quiet — you can still reach out to someone you trust',
    '疲惫': 'Tired',
    '允许自己先休息，明天再做选择': 'Let yourself rest; choose tomorrow',
    '坚定': 'Determined',
    '答案还没出现，但你已经准备好面对它': "The answer hasn't come, but you're ready to face it",
    '初次回应': 'First Reply',
    '完美倾听者': 'Perfect Listener',
    '已读不回': 'Left on Read',
    '动态之星': 'Moment Star',
    '群聊活跃': 'Group Regular',
    '霓城漫游人': 'Neon City Wanderer',
    '记忆收藏家': 'Memory Collector',
    '梦境行者': 'Dream Walker',
    '占卜信徒': 'Tarot Believer',
    '心意传递': 'Gift of Heart',
    '情绪光谱': 'Mood Spectrum',
    '回望那年': 'Looking Back',
    '赴约之人': 'Promise Keeper',
    '心三向': 'Three Hearts',
    '独行侠': 'Lone Wanderer',
    '霓城夜景明信片': 'Neon Night Postcard',
    '南方海岸明信片': 'Southern Coast Postcard',
    '旧学校明信片': 'Old School Postcard',
    '霓城首日戳': 'Neon City First-Day Stamp',
    '路线选定戳': 'Route Chosen Stamp',
    '《夏》手稿': '"Summer" Manuscript',
    '天台合影底片': 'Rooftop Photo Negative',
    '未寄出的信': 'Unsent Letter',
    '《夏》试听带': '"Summer" Demo Tape',
    '语音信箱备份': 'Voicemail Backup',
    '雾港首杯券': 'Wugang First-Drink Voucher',
    '开幕式工作证': 'Opening Pass',
    '陆辞的胶卷': "Luci's Film Roll",
    '雨天限定明信片': 'Rainy-Day Postcard',
    '闺蜜暗号邮戳': 'Bestie Secret Stamp',
    '冬至饺子券': 'Winter Solstice Dumpling Voucher',
    '跨年烟花明信片': 'New Year Fireworks Postcard',
    '春樱邮戳': 'Spring Cherry Stamp',
    '霓虹初遇': 'Neon First Encounter',
    '星夜': 'Starry Night',
    '海雾': 'Sea Mist',
    '暮色': 'Dusk',
    '水墨': 'Ink Wash',
    '玫瑰': 'Rose',
    '深夜': 'Late Night',
    // —— v0.8.7 状态与画像 bio ——
    '切换心情': 'Change Mood',
    '未触发': 'Not triggered',
    '已赴约': 'Attended',
    '已拒绝': 'Declined',
    '已错过': 'Missed',
    '尚未达成': 'Not yet reached',
    '待回复': 'Awaiting reply',
    '邀约': 'Invitation',
    '砚美术馆主理人。寡言。画过一幅画，画了三年。': 'Director of the Yan Art Museum. A man of few words. He spent three years on a single painting.',
    '自由摄影师。九年没换过镜头盖。相机里全是同一个人。': 'Freelance photographer. Same lens cap for nine years. Every frame holds the same person.',
    '雾港调酒师。前渡鸦乐队主唱。有一首写了三年没写完的歌。': 'Wugang bartender. Former frontman of the Raven Band. He has a song three years unfinished.',
    '内心独白': 'Inner Monologue',
    '今天发生了什么？把心里的话写下来…': 'What happened today? Write down what you feel…',
    '记下这一刻': 'Capture This Moment',
    '今日尚未抽牌': "You haven't drawn today",
    '每日一抽，揭示霓城的运势': 'One draw a day reveals the fortunes of Neon City',
    '抽取今日塔罗': "Draw Today's Tarot",
    '今日已抽过': 'Already drawn today',
    // —— v0.8.7 角色主页（bio/tags/关系）——
    '大学闺蜜。情报王。霓城小分队群主。': 'College best friend. Queen of intel. Owner of the Nicheng Squad group chat.',
    '#美术馆': '#ArtMuseum',
    '#沉默的人': '#ManOfFewWords',
    '#控制欲': '#ControlFreak',
    '#摄影师': '#Photographer',
    '#九年': '#NineYears',
    '#青梅竹马': '#ChildhoodFriend',
    '#调酒师': '#Bartender',
    '#前乐队': '#ExBand',
    '#未完的歌': '#UnfinishedSong',
    '#闺蜜': '#Bestie',
    '#八卦': '#Gossip',
    '#情报网': '#IntelNetwork',
    '不喜欢他拍你。看他的眼神像在估价。': "He doesn't like Luci photographing you. His gaze appraises people.",
    '没说过话，但江屿唱《夏》那晚，他离场了。': 'They have never spoken, but Jiang Yu left the night he sang "Summer".',
    '给他拍过封面。后来说"看人的眼神像在估价"，再没合作。': 'She shot his cover once, then said "his gaze appraises people" and never worked with him again.',
    '雾港的常客。江屿喝多了会跟他借相机。': 'A regular at Wugang. When Jiang Yu drinks too much, he borrows her camera.',
    '美术馆开幕那天，他没去。说"那种地方不欢迎我"。': 'He skipped the museum opening, saying "that kind of place doesn\'t welcome me".',
    '跟陆辞喝过几次酒。陆辞说他"心里有人，唱不出来"。': 'He has drunk with Luci a few times. Luci says he "has someone in his heart he can\'t sing out".',
    '朋友在美术馆实习，能搞到内部消息。': 'A friend interning at the museum gets her inside info.',
    '追过陆辞的摄影展，被陆辞婉拒"我只拍一个人"。': 'She chased Luci\'s photo show and was turned down: "I only shoot one person."',
    '雾港常客，跟江屿混得很熟。': 'A regular at Wugang, very close with Jiang Yu.',
    // —— v0.8.7 设置/存档/约会页 ——
    '语言 Language': 'Language',
    '中文': 'Chinese',
    '剧情文本将随语言逐步补全，未翻译处回退中文。': 'Story text is completed per language; untranslated lines fall back to Chinese.',
    '声音': 'Sound',
    '音乐': 'Music',
    '音效': 'Sound FX',
    '画面与辅助': 'Display & Assistance',
    '减弱动效': 'Reduce Motion',
    '选项提示': 'Option Hints',
    '观赏模式': 'Watch Mode',
    '设置即时生效并自动保存。': 'Settings apply immediately and save automatically.',
    '可约会': 'Available',
    '本周场景已体验完': 'All scenes this week done',
    '冷却中': 'Cooling down',
    '天': 'd',
    '已体验': 'Played',
    '本周已约过': 'Already dated this week',
    '自动存档会在关键进度变化时写入。手动槽位可长期保留；支持导出/导入 JSON。': 'Auto-save writes at key progress points. Manual slots persist; JSON export/import supported.',
    '空槽位 · 可写入当前进度': 'Empty slot · can store current progress',
    // —— v0.8.7 存档按钮与约会场景 ——
    '自动存档': 'Auto-save',
    '手动槽位 1': 'Manual Slot 1',
    '手动槽位 2': 'Manual Slot 2',
    '手动槽位 3': 'Manual Slot 3',
    '写入': 'Save',
    '覆盖写入': 'Overwrite',
    '读取': 'Load',
    '导出': 'Export',
    '删除': 'Delete',
    '导入到此': 'Import Here',
    '提示：删除仅影响本地浏览器存档，不会回滚剧情文件。': 'Note: deleting only affects the local browser save; story files are not rolled back.',
    '午后茶会': 'Afternoon Tea',
    '画室参观': 'Studio Visit',
    '雨夜档案馆': 'Rainy Archive',
    '旧楼天台': 'Old Building Rooftop',
    '暗房显影': 'Darkroom Developing',
    '旧书店寻踪': 'Old Bookstore Trail',
    '深夜看海': 'Midnight Sea',
    '排练室': 'Rehearsal Room',
    '凌晨鱼市': 'Dawn Fish Market',
    '每位男主每周（游戏内7天）可约会1次。完成约会会提升三轴好感，部分场景会解锁独家照片。': 'Each love interest can be dated once per week (7 in-game days). Dates raise three-axis affection; some scenes unlock exclusive photos.',
  };
})();


/* ===== i18n/story-en-translations.js ===== */
/* ===== 霓虹心事 · 剧情文本英译包（story-en-translations，阶段 E4 一期）=====
 * key = 中文原文（与剧情数据逐字一致），value = 英文译文。
 * 译名表（拼音）：Lin Xia / Shen Yanzhi / Lu Ci / Jiang Yu / Su Su / Xiaxia / Nicheng / Wugang。
 * 加载顺序在 i18n/en-US.js 之后合并进 en-US 包；覆盖率由 tools/extract_story_strings.mjs 报告。
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = window.I18N_PACKS['en-US'] || {};
  Object.assign(window.I18N_PACKS['en-US'], {
    "林夏！！！你到霓城了吗？？": "Lin Xia!!! Are you in Nicheng yet??",
    "听说你明天去砚美术馆报到？那里可是出了名的难进！": "Heard you start at the Yan Art Museum tomorrow? That place is famously hard to get into!",
    "到了回我一声！别让我担心！": "Text me when you arrive! Don't make me worry!",
    "苏苏在等你的回复：": "Su Su is waiting for your reply:",
    "刚到，累死了，先睡了": "Just got here. Exhausted. Sleeping",
    "到了！明天报到，紧张": "Here! Registration tomorrow. Nervous",
    "（暂时不回）": "(Not replying for now)",
    "晚安！梦里也要替我逛逛霓城哦～": "Night! Stroll around Nicheng in your dreams for me~",
    "（你抱着满身行李箱的味道睡着了。梦里有蝉鸣。）": "(You fall asleep smelling of suitcase and travel. Cicadas in the dream.)",
    "紧张什么！你可是我认识的人里最靠谱的！": "Nervous about what? You're the most reliable person I know!",
    "明天报到完给我发消息！不许消失！": "Message me after registration tomorrow! No disappearing!",
    "（你把手机扣在桌上，没有回。窗外霓城亮得像另一颗星球。）": "(You put your phone face-down and don't reply. Outside, Nicheng glows like another planet.)",
    "（睡意来得比回复快。）": "(Sleep comes faster than a reply would.)",
    "次日清晨": "The Next Morning",
    "林夏。我是沈砚之。": "Lin Xia. This is Shen Yanzhi.",
    "导师把你的联系方式给我了。九点报到，别迟到。": "Your mentor gave me your contact. Be there at nine. Don't be late.",
    "我这个人，最讨厌不守时。": "I can't stand people who are late.",
    "诶诶诶！！！林夏是你吗？？？": "Hey hey hey!!! Lin Xia, is that you???",
    "我听说砚美术馆新来个策展人，没想到是你！": "I heard the Yan Art Museum hired a new curator. Never thought it'd be you!",
    "高中之后多少年没见了？九年？十年？": "How long has it been since high school? Nine years? Ten?",
    "晚上一起吃饭？我带你认认霓城！": "Dinner tonight? Let me show you around Nicheng!",
    "陆辞约你晚上吃饭。": "Lu Ci is asking you to dinner tonight.",
    "好啊，下班联系": "Sure, text me after work",
    "今天太累了，下次吧": "Too tired today. Next time",
    "好！！下班我去美术馆门口接你。": "Yes!! I'll pick you up at the museum entrance after work.",
    "霓城第一课：别信导航，信我。": "Lesson one of Nicheng: don't trust the map. Trust me.",
    "……那说好了，下次。": "...Then it's a promise. Next time.",
    "食堂难吃的话，记得保重胃。别学高中那样啃面包凑合。": "If the cafeteria food is bad, take care of your stomach. Don't live on bread like you did in high school.",
    "下班后": "After Work",
    "下班了吧？来\"雾港\"，巷子深处那家酒吧": "Off work? Come to \"Wugang\" — the bar deep in the alley",
    "我朋友开的，特调全霓城第一": "A friend of mine runs it. Best cocktails in Nicheng",
    "……": "...",
    "今天那杯酒，算我请的。我是江屿。": "That drink today was on me. I'm Jiang Yu.",
    "你叫林夏。": "Your name is Lin Xia.",
    "名字不错。": "Nice name.",
    "他要加你好友。": "He wants to add you as a friend.",
    "通过": "Accept",
    "（不通过）": "(Decline)",
    "（通过好友申请的那一秒，对面就发来一个举杯的表情。）": "(The second you accept, a toast emoji comes through from the other side.)",
    "雾港见。": "See you at Wugang.",
    "（你没有通过。手机安静了三分钟，然后又震了一下——第二条好友申请，验证消息写着：）": "(You decline. Three minutes of silence, then the phone buzzes again — a second friend request, with this message:)",
    "不留也行。反正霓城不大。": "It's fine if you don't. Nicheng isn't that big anyway.",
    "……喂。": "...Hey.",
    "我是江屿。今天的酒，味道还好吗。": "It's Jiang Yu. Was today's drink any good?",
    "好喝。怎么突然打电话？": "It was. Why the sudden call?",
    "还行。有事吗？": "Not bad. Something wrong?",
    "没什么事。只是想确认一下。": "Nothing. Just wanted to check.",
    "我写过一首歌，叫《夏》。歌词里的人，也叫林夏。": "I wrote a song once, called \"Summer\". The girl in the lyrics was named Lin Xia too.",
    "但那是很多年前的事了。别多想。只是巧合。": "But that was years ago. Don't read into it. Just a coincidence.",
    "真的只是巧合吗？": "Is it really just a coincidence?",
    "好。我不问。": "Fine. I won't ask.",
    "……晚安。": "...Good night.",
    "……没事。晚安。": "...It's nothing. Good night.",
    "第三天": "Day Three",
    "来我办公室。": "Come to my office.",
    "下周开幕式，你来盯。": "You'll oversee next week's opening.",
    "你不是说你相信直觉吗。": "Didn't you say you trust your instincts?",
    "怎么，不愿意？": "What, not willing?",
    "沈砚之的考验。你的回复：": "Shen Yanzhi's test. Your reply:",
    "好，我来盯。": "Alright. I'll oversee it.",
    "我可能还不够资格…": "I might not be qualified enough...",
    "为什么选我？": "Why me?",
    "不错。比我想的，要勇敢。明天九点，会议室见。": "Not bad. Braver than I expected. Nine tomorrow, meeting room.",
    "是吗。那就算了。我自己来。": "Is that so. Then forget it. I'll do it myself.",
    "因为你不会问\"为什么\"。结果你问了。不过没关系。": "Because you wouldn't ask \"why\". You did, though. It's fine.",
    "听说你被沈砚之点名盯开幕式了？": "Heard Shen Yanzhi personally picked you to oversee the opening?",
    "那家伙……你离他远点。": "That guy... stay away from him.",
    "陆辞的话里似乎有别的意思。": "There seems to be something else behind Lu Ci's words.",
    "你说\"离他远点\"是什么意思？": "What do you mean, \"stay away from him\"?",
    "谢谢你啦，我会注意的": "Thanks, I'll be careful",
    "我之前给他拍过封面。他看人的眼神，像在估价。我不希望你被他那样看。": "I shot his cover once. The way he looks at people — like appraising value. I don't want you looked at that way.",
    "嗯……有什么事，随时找我。": "Mm... if anything comes up, I'm here.",
    "开幕式当天": "Opening Day",
    "林夏，开幕式还有一小时开始。你来一下展厅。": "Lin Xia, the opening starts in an hour. Come to the gallery.",
    "林夏，给你拍张工作照？": "Lin Xia, let me get a work photo of you?",
    "两个男人之间的气氛微妙。": "The air between the two men is delicate.",
    "陪沈砚之应酬": "Attend the reception with Shen Yanzhi",
    "陪陆辞拍照": "Take photos with Lu Ci",
    "借口去后台": "Slip away backstage",
    "走吧，给你介绍几个人。": "Come on, let me introduce you to some people.",
    "看这边——笑一个。你笑起来，比那幅画好看多了。": "Over here — smile. When you smile, you outshine that painting.",
    "（你借口去后台，留下两个男人意味深长的沉默。）": "(You slip backstage, leaving the two men in a meaningful silence.)",
    "（沈砚之走在你左侧，步子不快，替你挡开举着相机的人群。）": "(Shen Yanzhi walks on your left, unhurried, shielding you from the raised cameras.)",
    "介绍就免了。他们的画会替自己说话。": "Introductions aren't necessary. Their paintings speak for themselves.",
    "天台有个陌生人，不归我管。": "There's a stranger on the rooftop. Not my department.",
    "（陆辞半跑着在前面带路，像高中放学时那样回头喊你跟上。）": "(Lu Ci half-jogs ahead leading the way, turning back to call you along like in high school after class.)",
    "天台！我刚才踩过点了，视野最好——咳，不是，我什么都还没喝。": "The rooftop! I scouted it already, best view — ahem, I mean, I haven't had anything to drink.",
    "……上面那个人看你的眼神有点复杂。认识的朋友？": "...The guy up there looks at you in a complicated way. A friend?",
    "（你自己穿过人群，在通往天台的楼梯口遇到一个刚抽完烟的人。他掐了烟，侧身让你先走。）": "(You cut through the crowd yourself, and at the stairwell to the rooftop meet a man who just finished a cigarette. He stubs it out and steps aside to let you pass.)",
    "（酒气混着夜风。他跟在你后面上了楼，谁也没说话。）": "(Alcohol and night wind. He follows you upstairs. Neither of you speaks.)",
    "夜深了": "Late Night",
    "你在天台吗。": "Are you on the rooftop?",
    "我也在。今天累吧。": "So am I. Long day, right?",
    "累的时候，适合看灯。霓城的夜，像谁的心事，亮着却没人懂。": "When you're tired, lights are good company. Nicheng's nights are like someone's secrets — glowing, understood by no one.",
    "夜风里，你的心跳漏了一拍。": "In the night wind, your heartbeat skips a beat.",
    "靠近他一点": "Move a little closer",
    "礼貌保持距离": "Politely keep your distance",
    "你这个人，总让人想靠近。": "You — people always want to get closer to you.",
    "……早点回去休息。": "...Go back and rest early.",
    "一个无眠的夜晚": "A Sleepless Night",
    "早些休息。": "Rest early.",
    "今天谢谢你。晚安。": "Thank you for today. Good night.",
    "（三个人同时发来消息。你回谁，将决定你的心属于谁。）": "(All three message you at once. Whom you answer decides where your heart belongs.)",
    "明天来办公室。有个出差，跟我一起去南方。": "Come to my office tomorrow. There's a business trip — you're coming south with me.",
    "别人我不放心。": "I don't trust anyone else with it.",
    "南方出差": "The Southern Business Trip",
    "这位是周先生。林夏，我新来的策展人。": "This is Mr. Zhou. Lin Xia, my new curator.",
    "（他介绍你时，像在介绍一件作品。你感到不适。）": "(He introduces you like presenting an exhibit. You feel uneasy.)",
    "晚宴上你感到被\"展示\"。": "At the dinner, you feel \"displayed\".",
    "配合他，回去再说": "Play along. Talk back at the hotel",
    "当场夺回主动": "Take back control right there",
    "雨夜回程": "Rainy Night Return",
    "对不起。我忘了你不是我。家里逼我活成一个\"沈砚之\"。只有遇见你时，我才是我自己。": "I'm sorry. I forgot you're not me. My family forced me to become \"Shen Yanzhi\". Only when I met you was I myself.",
    "半个月后": "Half a Month Later",
    "今天别穿白衬衫，不适合你。": "Don't wear the white shirt today. It doesn't suit you.",
    "林夏！你最近怎么了？我给你打了五个电话，都是沈砚之接的。": "Lin Xia! What's wrong with you lately? I called five times — Shen Yanzhi answered every one.",
    "他说你忙。可你根本没收到过那些电话，对吧？": "He said you were busy. But you never got those calls at all, did you?",
    "你意识到沈砚之在替你\"过滤\"外界。": "You realize Shen Yanzhi has been \"filtering\" the outside world for you.",
    "立刻去找陆辞问清楚": "Go find Lu Ci immediately",
    "替沈砚之解释": "Make excuses for Shen Yanzhi",
    "无论你选谁，都不能选一个让你\"消失\"的人。": "Whoever you choose — never choose someone who makes you \"disappear\".",
    "（你意识到这段关系出了问题。你的选择是？）": "(You realize something is wrong with this relationship. Your choice?)",
    "你的最后抉择：": "Your final choice:",
    "和他正面对峙": "Confront him head-on",
    "默默忍受": "Endure in silence",
    "明天周末，带你重走一遍我们以前的学校？往返四小时，赶得及吃晚饭。": "Weekend tomorrow — want to walk our old school with me? Four hours round trip, still in time for dinner.",
    "母校之行": "Trip to the Old School",
    "就是这儿。高二那年，被人堵的就是这里。是你把我拉出来的。": "Right here. Second year, when they cornered me — it was here. You were the one who pulled me out.",
    "从那天起，我就告诉自己，要变强。强到，可以站到你身边。": "From that day I told myself: get stronger. Strong enough to stand beside you.",
    "林夏，有句话我憋了九年。我喜欢你。从高一你借我橡皮那天，到现在。": "Lin Xia, something I've held in for nine years. I like you. Since the day you lent me an eraser in first year, until now.",
    "他说出口了。": "He said it out loud.",
    "让他继续说": "Let him keep going",
    "岔开话题": "Change the subject",
    "此后的日子": "The Days After",
    "林夏，米兰那边的工作室邀我过去驻半年。下个月的飞机。": "Lin Xia, a studio in Milan invited me for a six-month residency. Flight's next month.",
    "你不用回答我。我只是……来道个别。": "You don't have to answer. I just... came to say goodbye.",
    "他就要走了。": "He's about to leave.",
    "喊住他，不让他走": "Call out. Don't let him go",
    "看着他离开": "Watch him leave",
    "……你来了。": "...You came.",
    "雨夜": "Rainy Night",
    "（信封里是一张去米兰的机票，名字写着：林夏。背面：如果你愿意，我们一起走。）": "(Inside the envelope: a ticket to Milan. The name on it: Lin Xia. On the back: if you're willing, we go together.)",
    "雨水模糊了视线。": "The rain blurs everything.",
    "追去他家": "Chase after him",
    "站在雨里直到天亮": "Stand in the rain until dawn",
    "（看到他藏了九年的心意。你的选择是？）": "(Seeing nine years of hidden feelings. Your choice?)",
    "去找他，回应他": "Find him. Answer him",
    "错过时机": "Miss the moment",
    "今晚来雾港。想跟你说说话。": "Come to Wugang tonight. I want to talk.",
    "几天后": "A Few Days Later",
    "今天，能陪我去个地方吗。": "Today — could you come somewhere with me?",
    "墓园": "The Cemetery",
    "我妹妹，也叫林夏。十四年前的夏天，白血病。小夏，哥带了个人来看你。她跟你一样倔。": "My little sister was named Lin Xia too. Leukemia, fourteen summers ago. Xiaxia — big brother brought someone to see you. Stubborn just like you.",
    "鼓手忌日": "The Drummer's Memorial",
    "三年了。我一闭上眼，就看见他笑着回头跟我说：\"江屿，最后一首了！\"": "Three years. Every time I close my eyes I see him smiling, looking back: \"Jiang Yu, last song!\"",
    "我活着，有什么用。": "What's the point of me being alive.",
    "他在崩溃的边缘。": "He's at the edge of breaking down.",
    "抱住他，什么都不说": "Hold him. Say nothing",
    "让他一个人静一静": "Let him be alone",
    "三天后": "Three Days Later",
    "整理阿哲的遗物时，发现他没写完的副歌。我想把它写完。可我每次写到副歌，就写不下去。": "Sorting A-Zhe's things, I found his unfinished chorus. I want to finish it. But every time I reach the chorus, I can't go on.",
    "一个月后": "A Month Later",
    "今晚雾港，我想试试登台。只请了你一个人。": "Wugang tonight. I want to try the stage. You're the only one invited.",
    "我可能唱不完。但我想试。": "I might not make it through. But I want to try.",
    "他唱到副歌前，停了。": "He stops right before the chorus.",
    "站起来，走到台前": "Stand up. Walk to the stage",
    "安静等他自己开口": "Wait quietly for him to speak",
    "（你看到他在泥潭里挣扎。你的选择是？）": "(You watch him struggle in the mire. Your choice?)",
    "陪他一起写完那首歌": "Finish that song with him",
    "让他独自面对过去": "Let him face the past alone",
    "（你把手机扣在桌上，谁都没回。今天，太累了。）": "(You put your phone face-down and answer no one. Today was too much.)",
    "第二天": "Day Two",
    "昨晚的消息，你没回。": "You didn't reply last night.",
    "林夏，昨晚……没事吧？": "Lin Xia, last night... are you okay?",
    "睡不着的时候，喝这个。不用回。（附一张\"夏\"特调的图）": "When you can't sleep, drink this. No reply needed. (A photo of the \"Summer\" cocktail)",
    "你这种拼命法，是想让我心疼，还是想让我心疼死。": "The way you push yourself — are you trying to make my heart ache, or break it.",
    "开幕前一周": "One Week Before Opening",
    "夜景素材，不要钱，只想帮你。": "Night shots, free of charge. Just want to help.",
    "展厅背景音，我重新编的简版。你挑挑。": "Rearranged a simplified version for the gallery soundtrack. Take your pick.",
    "不用谢。这是你应得的。": "Don't mention it. You earned this.",
    "（三个人都在等你。你的回应是？）": "(All three are waiting. Your response?)",
    "感谢，但婉拒所有暧昧": "Thank them, decline all romance",
    "接受帮助，保持距离": "Accept help, keep distance"
  });
})();


/* ===== i18n/story-en-translations-2.js ===== */
/* ===== 霓虹心事 · 剧情文本英译包·第二批（v0.5.3，结局/群聊/梦境/闪回/收集品/谜题）=====
 * 与第一批同规则：key = 中文原文，拼音译名表，合并进 en-US 包。
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = window.I18N_PACKS['en-US'] || {};
  Object.assign(window.I18N_PACKS['en-US'], {
    // ===== 群聊开场（group_neon）=====
    "各位！欢迎来到霓城小分队！本群宗旨：保护林夏，监督各位男士！": "Everyone! Welcome to the Nicheng Squad! Group mission: protect Lin Xia, keep watch on the gentlemen!",
    "沈砚之先生，听说你让林夏盯开幕式？": "Mr. Shen Yanzhi — word is you put Lin Xia in charge of the opening?",
    "……苏苏，这个群为什么有我。": "...Su Su. Why am I in this group.",
    "哈哈哈哈沈砚之被点名了": "Hahaha Shen Yanzhi got called out",
    "林夏不在群里的时候，你们别想偷偷对她怎么样！我都盯着！": "When Lin Xia's not in this group, don't even THINK of anything sneaky! I'm watching!",
    "苏苏@你：夏夏你也说句话！": "Su Su @you: Xiaxia, say something too!",
    "你们几个怎么回事": "What is wrong with you people",
    "苏苏你又搞事": "Su Su, stirring things up again",
    "（潜水围观）": "(Lurking)",
    "没什么事。工作群而已。": "Nothing. Just a work group.",
    "工作群？沈总你骗谁呢哈哈哈哈": "A work group? Who are you kidding, Director Shen, hahaha",
    "林夏，别被他们带偏。": "Lin Xia, don't let them rub off on you.",
    "搞事？我这是正义监督！": "Stirring things up? This is righteous supervision!",
    "林夏你学坏了，跟苏苏一个调调": "Lin Xia, you're getting cheeky. Same tune as Su Su",
    "？？？林夏你潜水？": "??? Lin Xia, you're lurking?",
    "她不想理我们": "She doesn't want to talk to us",
    "正常。": "Normal.",
    "照片看完了？": "Done with the photos?",
    "别笑我。这九年，我一直没敢给你看。\n现在敢了——因为你回来了。": "Don't laugh. For nine years I never dared show you.\nNow I dare — because you're back.",
    "……还没睡吧。": "...You're still up, right.",
    "副歌那两句，今晚突然写完了。\n原来它缺的不是旋律，是一个人。": "Those two chorus lines finished themselves tonight.\nTurns out what was missing wasn't a melody. It was a person.",
    "……你今天去了旧展厅。": "...You went to the old gallery today.",
    "那面墙上的《海》，挂了五年。\n它是从一个下午开始画的——那天，展厅里有个人站着看了很久。": "The \"Sea\" on that wall has hung for five years.\nIt started one afternoon — the day someone stood in the gallery, watching for a long time.",
    "林夏。我有些话，想当面跟你说。": "Lin Xia. There are things I want to say face to face.",
    "明天有空吗。": "Are you free tomorrow?",
    "沈砚之想约你。": "Shen Yanzhi wants to meet you.",
    "有。": "I am.",
    "最近有点忙…": "A bit busy lately...",
    "明天，办公室。": "Tomorrow. My office.",
    "……谢谢。有些话，我憋了很久。": "...Thank you. Some words I've held in for a long time.",
    "好。那就改天。": "Fine. Another day, then.",
    "我不催你。但我会记得，你欠我一次。": "I won't rush you. But I'll remember — you owe me one.",
    "林夏，周末有空吗？带你去一个地方。": "Lin Xia, free this weekend? I want to take you somewhere.",
    "是我们以前的学校。九年了，我想带你回去看看。": "Our old school. Nine years — I want to take you back to see it.",
    "陆辞想带你去旧学校。": "Lu Ci wants to take you to the old school.",
    "好。": "Okay.",
    "现在…还不行。": "Now... not yet.",
    "说定了！明天下午三点，校门口见。": "Deal! Tomorrow 3 PM, at the school gate.",
    "带双舒服的鞋。要走很多路——我想带你看完每一处。": "Wear comfortable shoes. Lots of walking — I want to show you every spot.",
    "没事。我等。": "It's fine. I'll wait.",
    "九年都等了，不差这几天。": "I've waited nine years. A few more days won't hurt.",
    "今晚雾港，有我新歌的首唱。": "Wugang tonight — the premiere of my new song.",
    "你来吗。": "Will you come.",
    "江屿邀请你听首唱。": "Jiang Yu invites you to the premiere.",
    "去。": "I'll go.",
    "今晚有事…": "Busy tonight...",
    "……好。位置我留着。": "...Fine. Your seat is saved.",
    "第一排。只有你一个位子。": "Front row. Your seat — the only one.",
    "……好。": "...Okay.",
    "歌会留着。等你哪天想听。": "The song will wait. For whenever you want to hear it.",
    "酒吧灯光调到最暗。\n他抱着吉他上台，没看任何人，只看了角落的你一眼。\n\"这首新歌，叫《夏》。写给一个名字里带夏的人。\"\n副歌唱到一半，他停了：\n\"林夏。这首歌的最后一句，我写不出来。\"": "The bar lights dimmed to black.\nHe took the stage with his guitar, looked at no one — only a glance at you in the corner.\n\"This new song is called 'Summer'. Written for someone with summer in her name.\"\nHalfway through the chorus he stopped:\n\"Lin Xia. I can't write this song's last line.\"",
    "全场安静下来，等你的回应。": "The room falls silent, waiting for your answer.",
    "我来写最后一句": "I'll write the last line",
    "不需要最后一句": "It doesn't need a last line",
    "让我回去想想": "Let me go home and think",
    "……好。位置我撤了。": "...Fine. I'll strike your seat.",
    "歌唱完了。没人坐那个位置。": "The song ended. No one sat in that seat.",
    // ===== 17 个结局（title / text）=====
    "未完的画作": "The Unfinished Painting",
    "他终于明白，把你留在画框里，便再也看不见你眼里的光。\n美术馆闭馆那天，他把那幅以你为模特的画送进了库房。\n\"林夏，下次开展览，你来定主题。\"\n你笑着点头。\n——这一次，你们站在同一侧。": "He finally understood: keep you inside a picture frame, and the light in your eyes disappears.\nOn closing day he sent the portrait — you, his model for years — into storage.\n\"Lin Xia. Next exhibition, you pick the theme.\"\nYou nodded, smiling.\n— This time, you stood on the same side.",
    "镀金的笼": "The Gilded Cage",
    "画很美，美到让人忘了呼吸。\n你才发现，自己也只是他收藏的一件作品。\n\"别动，你现在的样子，刚刚好。\"\n玻璃外是霓城的夜，玻璃内是你的倒影。\n你笑得越完美，他越满意。": "The painting was beautiful — beautiful enough to make you forget to breathe.\nThen you understood: you were just another piece in his collection.\n\"Don't move. You're perfect like this.\"\nOutside the glass, Nicheng's night. Inside it, your reflection.\nThe more perfect your smile, the more pleased he looked.",
    "画框之外": "Outside the Frame",
    "你们把展览做成了彼此都能呼吸的样子。\n工作结束后，他依旧会把咖啡放在你桌上。\n画框之外的事，他没说，你也没有逼问。": "You built an exhibition where both of you could breathe.\nAfter work he still leaves coffee on your desk.\nWhatever lies outside the frame, he doesn't say — and you don't press.",
    "五年前的她": "The Her from Five Years Ago",
    "旧画室最深处藏着一张五年前的习作。\n他没有再把过去投射到你身上，只是把那张画交给你。\n你们终于在真相里看见了彼此。": "In the studio's deepest corner hid a study from five years ago.\nHe stopped projecting the past onto you — and simply handed you the painting.\nAt last you saw each other in the truth.",
    "九又二分之一": "Nine and a Half",
    "他在你相册里翻到了那张十年前的合影。\n\"我数过，从高一到今天，是九年又一百八十二天。\"\n\"那还差半年呢？\"\n\"差半年，凑个十年整，好不好？\"\n霓城的烟火刚好升起来。": "He found the ten-year-old photo in your album.\n\"I've counted. From first year to today: nine years and one hundred eighty-two days.\"\n\"What about the missing half year?\"\n\"Half a year — to make it a full ten. Deal?\"\nNicheng's fireworks rose right on cue.",
    "未送出的底片": "The Undeveloped Film",
    "他走的那天，把一卷没冲洗的胶卷留在你家门口。\n你后来洗出来，每张都是你。\n最后一张背面写着：\n\"我练了九年的告白，最终输给了一句再见。\"\n你拨他电话，那头已停机。": "The day he left, he left a roll of undeveloped film at your door.\nWhen you finally developed it — every frame was you.\nOn the back of the last one:\n\"The confession I rehearsed for nine years lost, in the end, to one word: goodbye.\"\nYou dialed. The number was disconnected.",
    "镜头之外": "Outside the Lens",
    "你们成了最默契的拍摄搭档。\n每次快门落下，他都会先确认你有没有笑。\n镜头之外的关系，谁都没有急着命名。": "You became perfectly matched shooting partners.\nEvery time the shutter fell, he'd check whether you smiled first.\nWhat you are outside the lens — neither of you rushed to name it.",
    "B面歌词": "Side B Lyrics",
    "旧储物柜里有一张被折过很多次的歌词。\n他承认那些年写下的不是告别，而是没敢寄出的求救。\n你把它放回他掌心，让他自己唱完。": "In the old locker was a sheet of lyrics, folded and refolded.\nHe admitted that what he'd written back then wasn't a farewell — it was a cry for help he never dared send.\nYou placed it back in his palm, and let him finish the song himself.",
    "雾散之后": "After the Fog",
    "他重新拿起了吉他。\n不是为观众，是为坐在吧台最角落的你。\n\"那首歌，我终于写完了最后一句。\"\n你问是什么。\n他凑到你耳边：\"她回来了。\"\n窗外，霓城的雾第一次散得那么干净。": "He picked the guitar back up.\nNot for the audience — for you, in the darkest corner of the bar.\n\"That song. I finally finished the last line.\"\nYou asked what it was.\nHe leaned close: \"She came back.\"\nOutside, for the first time, Nicheng's fog cleared completely clean.",
    "最后一首歌": "The Last Song",
    "酒吧歇业那天，他在台上唱了最后一首歌。\n歌词里的人，你听了很久才发现不是你。\n\"江屿——\"\n\"林夏，对不起。你来得太晚了。\"\n霓城的雨下了一整夜。": "The night the bar closed, he sang its last song on stage.\nYou listened for a long time before realizing: the person in the lyrics wasn't you.\n\"Jiang Yu—\"\n\"Lin Xia. I'm sorry. You came too late.\"\nIt rained in Nicheng all night.",
    "雾港常客": "Regular at Wugang",
    "你成了雾港最熟悉的客人。\n他偶尔唱起那段副歌，又在最后一个音前停住。\n你们都知道，有些伤口不该被催着愈合。": "You became Wugang's most familiar regular.\nSometimes he sings that chorus — and stops just before the final note.\nYou both know: some wounds shouldn't be rushed to heal.",
    "夏的另一面": "The Other Side of Summer",
    "原版歌词里有两个同名的人。\n他终于肯说起妹妹，也肯承认此刻坐在他身边的是你。\n《夏》的 B 面被填满，雾港第一次亮到天明。": "The original lyrics held two people with the same name.\nHe could finally speak of his sister — and admit that the one beside him now is you.\nSide B of \"Summer\" was filled in. For the first time, Wugang stayed lit until dawn.",
    "霓城无事": "Nothing Happens in Nicheng",
    "一年后，你办了自己的第一个独立策展。\n主题叫《霓城无事》。\n展厅里没有他们的画像，只有你拍下的这座城市的每一束光。\n开幕那天，三个人都没来。\n你举着酒杯，对着窗外轻轻一笑。\n——有些人路过，是为了让你学会一个人。": "A year later, you mounted your first independent exhibition.\nThe theme: \"Nothing Happens in Nicheng\".\nNo portraits of them in the gallery — only every beam of light you photographed in this city.\nOn opening day, none of the three came.\nYou raised your glass and smiled softly at the window.\n— Some people pass through your life to teach you how to stand alone.",
    "霓城独行": "Walking Nicheng Alone",
    "你感谢每一份善意，却没有把自己交给任何人的期待。\n展览开幕时，霓城的灯一盏盏亮起。\n这一次，你走向的是自己选的方向。": "You were grateful for every kindness, but gave yourself to no one's expectations.\nAs the exhibition opened, Nicheng's lights came on, one by one.\nThis time, you walked toward the direction you chose yourself.",
    "独立策展人": "The Independent Curator",
    "你收下了帮助，也守住了距离。\n作品按时落地，名字第一次只属于你自己。\n未来还很长，没有必要急着回答所有问题。": "You accepted help, and kept your distance.\nThe work landed on time, and the name on it belonged to you alone, for the first time.\nThe future is long. There's no need to answer every question right away.",
    "空房间": "The Empty Room",
    "你把所有人都隔在门外，也忘了给自己留一扇窗。\n展厅空下来后，霓城的夜显得格外安静。\n你知道独处和孤立从来不是一回事。": "You shut everyone outside the door — and forgot to leave a window for yourself.\nWhen the gallery emptied, Nicheng's night felt especially quiet.\nYou know being alone and being isolated were never the same thing.",
    "第四种可能": "The Fourth Possibility",
    "你回看一路收集的线索，忽然明白自己从不是任何人的支线。\n故事在你手里翻到新的一页。\n霓城仍旧喧闹，而你终于是自己的主角。": "Looking back over the clues you gathered, you suddenly understood: you were never anyone's side story.\nThe story turns a new page in your hands.\nNicheng is still loud — and you are finally your own protagonist.",
    // ===== 梦境×2 =====
    "梦 · 高三的教室": "Dream · The Senior-Year Classroom",
    "你又回到了高三那年的教室。\n窗外的蝉鸣很响。\n后座的男生在用笔戳你的背。\n你回头，看不清他的脸。": "You're back in the senior-year classroom.\nThe cicadas outside are loud.\nThe boy behind you pokes your back with his pen.\nYou turn around. His face is a blur.",
    "回头对他笑": "Turn and smile at him",
    "你记得有人为你笑过": "You remember someone once smiled for you",
    "假装没感觉，继续做题": "Pretend not to notice. Keep solving",
    "你习惯把心事藏起来": "You're used to hiding what you feel",
    "趴下睡觉": "Put your head down and sleep",
    "你想回到那个夏天": "You want to go back to that summer",
    "梦 · 空白的画廊": "Dream · The Blank Gallery",
    "你站在一间空白的画廊里。\n墙上只有一幅画，画的是你的背影。\n有人在画框上写字，你看不清。\n画框开始发烫。": "You stand in a blank gallery.\nOn the wall hangs one painting — your own back, walking away.\nSomeone is writing on the frame. You can't read it.\nThe frame grows hot.",
    "伸手去摸那幅画": "Reach out and touch the painting",
    "你主动靠近危险": "You walk toward danger on your own",
    "后退，离开画廊": "Step back. Leave the gallery",
    "你选择保护自己": "You choose to protect yourself",
    "站在原地等": "Stay where you are and wait",
    "你在等别人给你答案": "You wait for someone else to give you the answer",
    "梦 · 没有观众的舞台": "Dream · The Stage with No Audience",
    "你坐在一个空剧场的观众席。\n台上有人在弹吉他，唱着一首你从没听过的歌。\n他唱到副歌时停了，看向你。\n灯灭了。": "You sit in an empty theater's audience.\nOn stage, someone plays guitar, singing a song you've never heard.\nHe stops at the chorus and looks at you.\nThe lights go out.",
    "喊一声\"继续\"": "Call out \"keep going\"",
    "你敢在黑暗里发声": "You dare to speak in the dark",
    "安静等他继续": "Wait quietly for him to continue",
    "你尊重别人的节奏": "You respect another person's rhythm",
    "摸黑走上台": "Walk up to the stage in the dark",
    "你想靠近那个人的孤独": "You want to reach that person's loneliness",
    // ===== 闪回×3 =====
    "闪回 · 九年前的军训操场": "Flashback · The Training Field, Nine Years Ago",
    "你看着陆辞发来的旧照片，眼前模糊起来。\n蝉鸣声突然变得很近。你回到了高一军训的那个下午。": "Lu Ci's old photo blurs before your eyes.\nThe cicadas are suddenly close again. You're back at that first-year training afternoon.",
    "九月。操场。烈日。\n教官在喊\"向右看齐\"。\n你站第三排，身后第四排有个男生，总在偷拍。": "September. The field. Blazing sun.\nThe instructor shouts \"eyes right\".\nYou stand in the third row. In the fourth, a boy keeps secretly taking photos.",
    "休息时他递来一瓶水：\n\"嘿。我叫陆辞。三班的。你呢？\"\n你说了名字。\n他笑：\"林夏。夏天的夏。好名字。我记住了。\"": "At break he hands you a bottle of water:\n\"Hey. I'm Lu Ci. Class three. You?\"\nYou say your name.\nHe grins: \"Lin Xia. The xia of summer. Great name. I'll remember it.\"",
    "那天傍晚，他在你课本里夹了一张纸条：\n\"明天就告白。明天就告白。明天就告白。\"\n——他练了九年的告白。": "That evening he slipped a note into your textbook:\n\"Confess tomorrow. Confess tomorrow. Confess tomorrow.\"\n— A confession he rehearsed for nine years.",
    "回忆到这里，你想：": "The memory ends there. You think:",
    "原来他从高一就喜欢我": "So he liked me from first year",
    "我那时怎么没发现": "How did I never notice back then",
    "把这张纸条忘掉": "Forget the note ever existed",
    "闪回 · 八年前的天台": "Flashback · The Rooftop, Eight Years Ago",
    "江屿唱《夏》的那个夜晚，你突然想起来了——\n八年前，你听过同样的副歌。在另一座天台。": "The night Jiang Yu sang \"Summer\", it suddenly came back to you —\nEight years ago, you'd heard that same chorus. On a different rooftop.",
    "高二夏天。隔壁学校的天台。\n一个抱吉他的男生在唱副歌，唱到\"夏\"字就停。\n你路过，停下来听。": "Summer of second year. The neighboring school's rooftop.\nA boy with a guitar kept stopping at the word \"summer\" in the chorus.\nYou were passing by. You stopped to listen.",
    "他回头看见你：\n\"嘿。这首歌的副歌我写不出来。你叫什么？\"\n你说：\"林夏。\"\n他愣住，然后笑了：\n\"……原来夏字是这样写的。\"": "He turned and saw you:\n\"Hey. I can't finish this song's chorus. What's your name?\"\nYou said: \"Lin Xia.\"\nHe froze — then laughed:\n\"...So that's how you write 'xia'.\"",
    "你想起来了。": "You remember now.",
    "原来《夏》真的是写给我的": "So \"Summer\" really was written for me",
    "只是巧合，别多想": "Just a coincidence. Don't read into it",
    "我想去问他": "I want to go ask him",
    "闪回 · 五年前的美术馆": "Flashback · The Museum, Five Years Ago",
    "你路过砚美术馆的旧展厅，脚步忽然慢了下来——\n五年前的那个下午，你好像来过这里。": "Passing the Yan Art Museum's old wing, your steps slow —\nThat afternoon five years ago. You think you've been here.",
    "五年前。你还在读大二，跟着来霓城办展的陆辞，第一次走进这间美术馆。\n展厅最里面，有个人站在一幅画前，站了很久。": "Five years ago. Sophomore year. Following Lu Ci to Nicheng for his show, you entered this museum for the first time.\nDeep in the gallery, someone stood before a painting. Stood there a long time.",
    "你在旁边一幅画前停下了。\n画上是一片没有人的海。\n临走前，你回头，对等在门口的陆辞笑了一下：\n\"以后，我想在这样的地方工作。\"": "You stopped at the painting beside it.\nA sea with no one in it.\nBefore leaving, you turned back and smiled at Lu Ci, waiting at the door:\n\"Someday, I want to work in a place like this.\"",
    "原来策展人的梦，是从那天开始的": "So the curator's dream started that day",
    "那时候的陆辞，一直站在门口等我": "Back then, Lu Ci stood at the door, waiting for me the whole time",
    "我没有多看那个人一眼": "I never gave that man a second glance",
    "你没有注意到——展厅的角落里，有人在你回头笑的那一刻，停住了笔。\n那天之后，他开始画一幅新的画。\n那幅画，他画了五年。": "You didn't notice — in the gallery's corner, at the exact moment you turned back to smile, someone stopped drawing.\nAfter that day he began a new painting.\nHe painted it for five years.",
    // ===== 收集品 =====
    "霓城夜景": "Nicheng Night View",
    "出租车在高架桥上蜿蜒，窗外是一片流光溢彩的灯海。\n我靠着车窗，看那些光斑在玻璃上拖成长长的尾巴。\n这就是霓城。一座永远不会睡的城市。": "The taxi wound along the elevated highway, a sea of light outside the window.\nI leaned on the glass and watched the light-dots drag long tails across it.\nThis is Nicheng. A city that never sleeps.",
    "天台": "The Rooftop",
    "霓城的夜，从这个高度看下去，像一条流动的银河。\n他说：\"累的时候，适合看灯。\"\n灯都懂。": "Nicheng's night, from this height, is a flowing galaxy.\nHe said: \"When you're tired, lights are good company.\"\nThe lights understand.",
    "九年的相册": "The Nine-Year Album",
    "第一页是高一军训的我。第二页是高二运动会的我。\n吃饭的我、发呆的我、毕业典礼上哭的我。\n最后一页字条：\"明天就告白。明天就告白。明天就告白。\"\n——他练了九年的告白。": "First page: me at first-year training. Second: me at the second-year sports meet.\nMe eating. Me spacing out. Me crying at graduation.\nThe last page, a note: \"Confess tomorrow. Confess tomorrow. Confess tomorrow.\"\n— A confession he rehearsed for nine years.",
    "月光从天窗落下来，照在那幅盖了三年的画上。\n画布上是我的侧脸——比我自己记得的，更年轻，也更倔强。\n他站在画前，像站在一段没说出口的话前。": "Moonlight fell through the skylight onto a painting covered for three years.\nOn the canvas: my profile — younger and more stubborn than I remember being.\nHe stood before it, like standing before words never spoken.",
    "操场边的银杏又长高了。\n他给我看高一那张偷拍：短发、晒黑、笑得没心没肺。\n\"九年又一百八十二天。\"他说。\n原来被人默默记得，是这种感觉。": "The ginkgo by the field has grown taller again.\nHe showed me the secret shot from first year: short hair, sun-tanned, laughing without a care.\n\"Nine years and one hundred eighty-two days,\" he said.\nSo this is what it feels like — to be remembered, quietly, all along.",
    "霓城的夜，像谁的心事，亮着却没人懂。": "Nicheng's night is like someone's secret — glowing, understood by no one.",
    // ===== 收集品 how 文案 =====
    "第一天抵达霓城时获取": "Obtained on your first day in Nicheng",
    "沈砚之出差途中寄回的明信片，背面只有一字：等。": "A postcard Shen Yanzhi mailed back from his trip. One word on the back: Wait.",
    "沈砚之线 · 南方出差": "Shen Yanzhi route · Southern business trip",
    "九年又一百八十二天，操场边的银杏又黄了。": "Nine years and one hundred eighty-two days — the ginkgo by the field has yellowed again.",
    "陆辞线 · 旧学校邀约": "Lu Ci route · Old school invitation",
    "抵达霓城当日盖的邮戳，墨色未干。": "The postmark from your first day in Nicheng. The ink still wet.",
    "序章完成时获取": "Obtained on completing the prologue",
    "你选择路线的那一晚，霓城邮局留下的纪念戳。": "The commemorative stamp from the night you chose your route, at the Nicheng post office.",
    "路线选择后获取": "Obtained after choosing your route",
    "江屿写的歌《夏》的原始手稿，歌词里的人叫林夏。": "The original manuscript of Jiang Yu's song \"Summer\". The girl in the lyrics is Lin Xia.",
    "江屿线 · 通话后获取": "Jiang Yu route · Obtained after the phone call",
    "天台那晚的合影底片，灯光把两个人拉得很长。": "The negative from that rooftop night — the lights stretching two figures long.",
    "江屿线 · 天台剧情": "Jiang Yu route · Rooftop story",
    "陆辞高中写给你但从未寄出的信，字迹已经泛黄。": "The letter Lu Ci wrote you in high school and never sent. The ink has yellowed.",
    "陆辞线 · 闪回章节": "Lu Ci route · Flashback chapter",
    "江屿在雾港首唱的录音带，B面是空白。": "The tape of Jiang Yu's first performance of \"Summer\" at Wugang. Side B is blank.",
    "江屿线 · 雾港首唱": "Jiang Yu route · Wugang premiere",
    "某次未接来电的语音留言备份。": "A backup of the voicemail from a missed call.",
    "语音信箱回放后获取": "Obtained after replaying the voicemail",
    "江屿给你的第一杯酒，背面写着\"算我请的\"。": "The first drink Jiang Yu bought you. On the back: \"This one's on me.\"",
    "江屿线 · 雾港酒吧": "Jiang Yu route · Wugang Bar",
    "砚美术馆开幕式的工作证，你的名字被印成金色。": "The opening-day badge of the Yan Art Museum. Your name printed in gold.",
    "开幕式当天获取": "Obtained on opening day",
    "沈砚之用过多年的钢笔，笔尖磨出了他的角度。": "Shen Yanzhi's pen of many years. The nib is worn to his angle.",
    "沈砚之线 · 私人画室邀约": "Shen Yanzhi route · Private studio invitation",
    "陆辞给你的过期胶卷，拍出来的人会更温柔一点。": "An expired film roll from Lu Ci. People look gentler through it.",
    "陆辞线 · 重逢邀约": "Lu Ci route · Reunion invitation",
    "雨天的霓城被拉成一条条彩线。苏苏说：雨天也要互相报平安。": "Nicheng in the rain, stretched into threads of color. Su Su says: on rainy days, we check on each other.",
    "雨天剧情 · 选择叫苏苏来接": "Rain story · Choosing to ask Su Su for help",
    "苏苏的闺蜜暗号刻成的邮戳：1350，友谊不过期。": "A stamp of Su Su's best-friend code: 1350. Friendship has no expiry.",
    "解开「苏苏的闺蜜暗号」谜题": "Solve the puzzle \"Su Su's Best-Friend Code\"",
    // ===== 谜题 =====
    "沈砚之办公室的密码": "The Code to Shen Yanzhi's Office",
    "沈砚之办公桌抽屉上有一把四位数字密码锁，他只留下一张字条：「她笑起来的样子，比那幅画好看多了。」": "A four-digit lock on Shen Yanzhi's desk drawer. He left only a note: \"The way she smiles — far better than that painting.\"",
    "开幕式那晚，陆辞说：\"看这边——笑一个。\" 拍照时按下快门的瞬间，是 19:27。": "On opening night Lu Ci said: \"Over here — smile.\" The shutter fired at 19:27.",
    "沈砚之书架上那本画册的页码被折角，第 4 页。": "A corner folded on page 4 of the art book on Shen Yanzhi's shelf.",
    "《夏》手稿的落款日期：8月 0 日（江屿划掉了日期，留了个月份）。": "The date on the \"Summer\" manuscript: August 0 (Jiang Yu crossed out the day, kept the month).",
    "天台那晚，霓城的灯亮到 23 点才熄。": "That rooftop night, Nicheng's lights burned until 23:00.",
    "沈砚之看了你一眼：\"你比我以为的，更懂我。\"": "Shen Yanzhi gave you a look: \"You understand me better than I thought.\"",
    "密码不对。沈砚之的字条还在你口袋里。": "Wrong code. Shen Yanzhi's note is still in your pocket.",
    "陆辞的旧储物柜": "Lu Ci's Old Locker",
    "陆辞高中储物柜的密码锁，他记得是「某段记忆的日期」。但他不肯告诉你具体是哪一天。": "The lock on Lu Ci's high school locker. He remembers it as \"the date of a memory\" — but won't say which.",
    "陆辞说过：\"九年又一百八十二天。\" 9年 = 9。": "Lu Ci said: \"Nine years and one hundred eighty-two days.\" 9 years = 9.",
    "闪回里你们约定的\"明天\"是 1 号。": "In the flashback, the \"tomorrow\" you promised was the 1st.",
    "高中操场的银杏是 8 月开始黄。": "The field's ginkgo starts to yellow in August.",
    "你们一起拍过 2 张合影。": "You took exactly 2 photos together.",
    "陆辞看着你：\"……原来你还记得。\"": "Lu Ci looks at you: \"...You actually remember.\"",
    "陆辞摇头：\"不是这个数字。再想想。\"": "Lu Ci shakes his head: \"Wrong number. Think again.\"",
    "《夏》的歌词顺序": "The Order of \"Summer\"'s Lyrics",
    "江屿给你一张《夏》的歌词碎片，他记得顺序但故意打乱。让你拼回原来的样子。": "Jiang Yu hands you torn scraps of \"Summer\"'s lyrics. He knows the order but shuffled them on purpose. Reassemble it.",
    "第一句开头是\"夏\"，但被打乱成\"[3]天的风，[1]夏的开始\"。": "The first line starts with \"summer\", shuffled into \"[3] days of wind, the [1] of summer\".",
    "第二句关于\"林\"，他说\"林荫下的[2]个人\"。": "The second line is about \"woods\": \"[2] people under the trees\".",
    "第三句关于\"夜\"，\"霓城的[4]点\"。": "The third line is about \"night\": \"Nicheng at [4] o'clock\".",
    "第四句关于\"夏\"的回响，\"[3]年后的夏\"。": "The fourth line is \"summer\"'s echo: \"the summer [3] years later\".",
    "江屿笑了：\"你听懂了。\"": "Jiang Yu laughed: \"You understood.\"",
    "江屿摇头：\"顺序不对。再听一次？\"": "Jiang Yu shakes his head: \"Wrong order. Listen again?\"",
    "苏苏的闺蜜暗号": "Su Su's Best-Friend Code",
    "苏苏的旧手机挂饰上刻着四位数字，她卖关子：「这是我们闺蜜间的暗号！猜对就告诉你一个秘密。」她留下的三条提示都和你们有关。": "Four digits carved on Su Su's old phone charm. She teases: \"It's our best-friend code! Guess it and I'll tell you a secret.\" Her three hints all involve the two of you.",
    "你们大学宿舍的门牌：520 室的隔壁，宿舍编号个位数是 1。": "Your college dorm plaque: next to room 520, and the room number ends in 1.",
    "苏苏手机里你的备注后面跟着的爱心数：一直没变过的 3 颗。": "The hearts after your name in her phone: always exactly 3, never changed.",
    "大一期末一起熬夜的天数：整整 5 天，咖啡罐还留着。": "The finals-week all-nighters: a full 5 days. The coffee cans are still around.",
    "她说「友谊的保质期」时比的手势：0——不过期的意思。": "Her gesture for \"friendship's shelf life\": 0 — as in, it never expires.",
    "苏苏蹦了起来：\"答对了！暗号的秘密是——不管隔多远，雨天也要互相报平安！\"": "Su Su jumped up: \"Correct! The secret is — no matter how far apart, we check on each other on rainy days!\"",
    "苏苏摇头晃脑：\"不对不对～提示都写在你我回忆里啦。\"": "Su Su shakes her head: \"Nope nope~ The hints are all in our memories!\""
  });
})();


/* ===== i18n/story-en-translations-3.js ===== */
/* ===== 霓虹心事 · 剧情文本英译包·第三批（v0.5.9 阶段 F1，补全至 100%）=====
 * 覆盖：深夜独白/塔罗播报与即时反馈/群聊二波/雨天/中后期日常/邀约场景/约会对话/
 * 梦魇/邀约消息/成就与彩蛋描述。与第一二批同规则（key=中文原文，拼音译名）。
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = window.I18N_PACKS['en-US'] || {};
  Object.assign(window.I18N_PACKS['en-US'], {
    // ===== 深夜心动独白 =====
    "……睡了吗？": "...Still awake?",
    "翻旧手机，翻到五年前的一条草稿。打了很长，一直没敢发。": "Going through my old phone. Found a draft from five years ago. So long. Never dared to send it.",
    "\"今天你回头笑的样子，像整个夏天。\"": "\"The way you looked back and smiled today — it was like the whole of summer.\"",
    "迟到了五年的晚安。快睡吧，明天还要去美术馆报到。": "A good night, five years late. Sleep now — museum registration tomorrow.",
    "还没睡。": "Still up.",
    "……美术馆的灯，替你留了一盏。": "...The museum left a light on for you.",
    "想你想到睡不着，很幼稚吧。": "Can't sleep from missing you. Childish, right?",
    "——当我没发。快睡。": "—Forget I sent that. Sleep.",
    "新写的旋律，还差一句词。": "New melody. Still missing one line.",
    "词是：「深夜的风把你吹进我梦里」。睡觉。": "The line: \"The midnight wind blew you into my dreams.\" Sleep.",
    // ===== NG+ 变体与真结局尾声 =====
    "又来霓城了？这次可看仔细点哦——有些东西，第一次会错过。": "Back in Nicheng again? Look closer this time — some things get missed the first round.",
    "（她的语气像在打趣一个老朋友。也许，本来就是。）": "(Her tone teases like an old friend. Maybe she always was.)",
    "……感觉像是第三次自我介绍。抱歉，我最近总想起一些没道理的事。": "...Feels like introducing myself for the third time. Sorry. I keep thinking of things that make no sense lately.",
    "听说你回霓城了！": "Heard you're back in Nicheng!",
    "这次换我先到校门口。九年的事，我们边走边说。": "This time I got to the school gate first. Nine years of things — we'll talk as we walk.",
    "（他盯着好友申请看了很久，像在确认什么。）——这次，换我先开口。": "(He stares at the friend request for a long time, as if checking something.) — This time, I speak first.",
    "（独立策展落地后的第一个周一。霓城照常醒来，你也是。）": "(The first Monday after your independent exhibition opened. Nicheng wakes as always. So do you.)",
    "新展的名字定了：《无事》。第一个展签，留给你写。": "The new exhibition has a name: \"Nothing Happens\". The first label — I'm leaving it for you to write.",
    "[图片] 清晨的校门口。银杏第一次结了果——九年，值得。": "[Photo] The school gate at dawn. The ginkgo bore fruit for the first time — nine years, worth it.",
    "《夏》的完整版录好了。这次，B面不是空白。": "The full version of \"Summer\" is recorded. This time, side B isn't blank.",
    "（本群永久置顶：夏夏的幸福进度——已完结，撒花！）": "(Pinned forever in this group: Xiaxia's Happiness Tracker — complete! Confetti!)",
    // ===== 塔罗晨间播报 =====
    "夏夏早！昨日牌面提示：今天「相遇」的运势很高——走哪条路都可能撞见熟人哦。": "Morning, Xiaxia! Yesterday's card says \"meetings\" luck is high today — you might run into someone familiar on any street.",
    "出门前记得照镜子，把最好看的样子带上！": "Mirror check before you leave — bring your best look with you!",
    "夏夏早！昨日牌面全是恋爱的味道——今天谁对你好一点，都不是巧合。": "Morning, Xiaxia! Yesterday's card smells like love — anyone extra kind to you today isn't a coincidence.",
    "心跳的时候别否认，是你自己的心在跳。": "When your heart races, don't deny it. It's your own heart beating.",
    "夏夏早！昨日牌面指向「过去」——旧东西、旧地方、旧话题，今天都可能翻出来。": "Morning, Xiaxia! Yesterday's card points to \"the past\" — old things, old places, old topics may resurface today.",
    "翻到旧照片别急着划走，说不定有你想不起来的细节。": "If you swipe past an old photo, stop. There might be details you've forgotten.",
    "夏夏早！昨日牌面提示：今天适合动脑子不适合动心。": "Morning, Xiaxia! Yesterday's card says: use your head today, not your heart.",
    "有决定要做的话，列个清单再选。": "Got a decision to make? List it out first.",
    "夏夏早！昨日牌面只有两个字：「自己」。": "Morning, Xiaxia! Yesterday's card says just two words: \"yourself\".",
    "今天谁的话都可以听一半——包括这句。": "Take everything said today with half a grain of salt — including this.",
    "夏夏早！昨日牌面是好运预备——今天买咖啡可能买一送一，记得领！": "Morning, Xiaxia! Yesterday's card preps good luck — today's coffee might be buy-one-get-one. Don't forget to claim it!",
    "运气这东西，用掉才有。冲！": "Luck only counts when you spend it. Go!",
    "夏夏早！昨天那张牌……有点重，是「结局」的牌。": "Morning, Xiaxia. Yesterday's card... was heavy. An \"ending\" card.",
    "最近做的每个决定，都在悄悄写结局。慎重，但别怕。": "Every decision lately is quietly writing an ending. Be careful — but don't be afraid.",
    "夏夏早！昨日牌面与「梦」有关——今晚睡前别刷手机，梦会给你答案。": "Morning, Xiaxia! Yesterday's card is about \"dreams\" — no scrolling before bed tonight. Dreams will answer.",
    "醒来记得记下来，梦是限时的。": "Write them down when you wake. Dreams are time-limited.",
    // ===== 塔罗即时反馈 =====
    "🔮 夏夏！这张牌……今天会\"遇见\"重要的人。别低头走路，抬头！": "🔮 Xiaxia! This card... says you'll \"meet\" someone important today. Eyes up when you walk!",
    "🔮 夏夏！这牌面甜到齁——今天谁多看你一眼，都不是偶然。": "🔮 Xiaxia! This card is sickeningly sweet — anyone who glances at you twice today? Not an accident.",
    "🔮 夏夏！这张牌在翻旧账——旧照片、旧消息，今天别删，会有发现。": "🔮 Xiaxia! This card is digging up the past — old photos, old messages. Don't delete anything today. Discoveries await.",
    "🔮 夏夏！今天是清醒牌——适合算清楚，不适合上头。": "🔮 Xiaxia! A clear-headed card today — do the math, don't fall headfirst.",
    "🔮 夏夏！今天这张牌是\"自己\"——别人的意见，参考就好。": "🔮 Xiaxia! Today's card is \"yourself\" — treat others' opinions as reference only.",
    "🔮 夏夏！好牌！今天运气在线，第一杯咖啡都该是买一送一！": "🔮 Xiaxia! Great card! Luck is online today — even your first coffee should be buy-one-get-one!",
    "🔮 夏夏……这张牌有点重。最近的决定，都在悄悄写结局。慢慢来，别怕。": "🔮 Xiaxia... this card is heavy. Recent decisions are quietly writing endings. Take it slow. Don't be afraid.",
    "🔮 夏夏！今天梦运会很灵——睡前记得把明天的愿望想好。": "🔮 Xiaxia! Dream luck is strong today — decide tomorrow's wish before you sleep.",
    // ===== 群聊投票与现场 =====
    "通知！本周六「霓城小分队」首次线下聚餐！地点投票，现在开始！": "Notice! The Nicheng Squad's first offline dinner is this Saturday! Venue vote — starting now!",
    "+1！我可以负责摄影记录。": "+1! I'll handle the photography.",
    "都行。别选要我唱歌的地方。": "Anywhere. Just nowhere I'd have to sing.",
    "看日程。若在美术馆附近，可预留包间。": "Depends on my schedule. If it's near the museum, I can book a private room.",
    "聚餐地点投票：": "Dinner venue vote:",
    "火锅——热闹最重要": "Hotpot — liveliness matters most",
    "居酒屋——喝一点刚好": "Izakaya — a little to drink is just right",
    "美术馆包间——安静": "Museum private room — quiet",
    "投票有效！周六晚上七点，不许请假，不许迟到！": "Vote counted! Saturday 7 PM. No excuses. No lateness!",
    "（本群唯一的宗旨：盯紧我们夏夏的幸福进度。）": "(This group's one and only mission: keeping close watch on Xiaxia's happiness.)",
    "🔥首聚现场直击：红锅已开，毛肚已下，人齐了！": "🔥 First dinner live: the hotpot is boiling, the tripe is in, everyone's here!",
    "[图片] 九宫格。谁点的脑花，站出来。": "[Photo] The full spread. Whoever ordered the brain — own up.",
    "我。涮好了给你们留两筷子。": "Me. I'll save you two bites once it's done.",
    "……辣度超预期。水。": "...The spice is beyond expectations. Water.",
    "沈老板居然真的来了！夏夏你坐他旁边对不对！拍照了！": "Boss Shen actually came! Xiaxia, you're sitting next to him, right? Picture time!",
    "🏮首聚现场：居酒屋小间已包，烤串无限追加！": "🏮 First dinner: izakaya private room booked. Skewers on infinite refill!",
    "老板，梅子茶泡饭一份——她的。别的随意。": "Boss — one plum tea over rice. For her. Whatever for the rest.",
    "[图片] 招牌灯下的合影申请，举手的都入镜。": "[Photo] Group photo under the signboard — raise your hand and you're in.",
    "角落位置已占。观灯，比看人舒服。": "Corner seat taken. Watching the lights beats watching people.",
    "沈老板你入了！我看到你举手了！照片为证！": "Boss Shen, you're in! I saw you raise your hand! Photo evidence!",
    "🎨首聚现场：美术馆包间，据说菜单都是沈老板亲选。": "🎨 First dinner: museum private room. Rumor says Boss Shen picked the menu himself.",
    "闭馆后的展厅，顺路可以看一眼。只一眼。": "The gallery after closing. You can take a peek on the way. Just a peek.",
    "[图片] 月光展厅走廊。这张必须发朋友圈。": "[Photo] The moonlit gallery corridor. This one's going straight to Moments.",
    "这里连酒杯声音都是安静的。有点意思。": "Even the sound of glasses here is quiet. Interesting place.",
    "闭馆后的美术馆！四个人包场！这待遇可以吹一年！": "A museum after closing! Four people, entire venue! This is a year's worth of bragging!",
    // ===== 雨天剧情 =====
    "下雨了！！你带伞没？我看气象雷达，那片一时半会停不了！": "It's raining!! Did you bring an umbrella? The radar says that band won't clear for a while!",
    "（窗外，霓城泡在雨里。灯牌的光晕被雨拉成一条条彩线。）": "(Outside, Nicheng soaks in the rain. The neon signs smear into streaks of colored light.)",
    "雨越下越大。你决定：": "The rain gets heavier. You decide:",
    "冲进雨里跑回家": "Run home through the rain",
    "在檐下等雨小": "Wait under the eaves",
    "叫苏苏来接": "Ask Su Su to pick you up",
    "（她湿着半边肩膀跑来，伞全打在你头上。）": "(She arrives with half her shoulder soaked, the umbrella tilted entirely over your head.)",
    "给，雨天限定的明信片！霓城一下雨就这样，帅吧？": "Here — a rain-only postcard! Nicheng turns into this every time it rains. Cool, right?",
    "到家记得喝热的！别感冒！霓城的雨，说大就大。": "Drink something hot when you're home! Don't catch a cold! Nicheng's rain turns heavy without warning.",
    // ===== 中后期日常 =====
    "（来霓城的第七天。闹钟响之前你就醒了——身体先接受了这座城市的节奏。）": "(Day seven in Nicheng. You wake before the alarm — your body has accepted the city's rhythm first.)",
    "躺在床上，你想：": "Lying in bed, you think:",
    "这一周认识了三个人，不错": "Met three people this week. Not bad",
    "好像还是没适应": "Still haven't adjusted, it seems",
    "先起来，想这些没用": "Get up first. Thinking is useless now",
    "布展方案通过了。今晚不留下来加班？——这是陈述，不是命令。": "The exhibition plan was approved. You're not staying late tonight? — That's a statement, not an order.",
    "（你注意到，他开始区分\"命令\"和\"请求\"了。）": "(You notice he's learned to tell \"orders\" from \"requests\".)",
    "[图片] 早上扫街拍的。霓城早上七点和晚上七点，是两个城市。": "[Photo] Street shots from this morning. Nicheng at 7 AM and 7 PM are two different cities.",
    "哪张好？我投第二张——构图里有你上周站过的那个路口。": "Which is better? I vote the second — the composition has that crossing you stood at last week.",
    "[语音 12\"]": "[Voice 12\"]",
    "新歌demo，副歌还缺两个字。睡不着的代价就是半夜写歌。": "New song demo. The chorus is two words short. The price of insomnia is midnight songwriting.",
    "重大情报！！本周你被三个人同时约的概率是100%！！": "MAJOR INTEL!! This week the probability of all three asking you out at once is 100%!!",
    "（统计样本：我。误差范围：我说是就是。）": "(Sample size: me. Margin of error: I say so, so there.)",
    "（第十天。窗外的霓虹灯还没醒，城市露出少见的灰色轮廓。）": "(Day ten. The neon outside hasn't woken. The city shows its rare grey outline.)",
    "难得安静的清晨。你决定：": "A rare quiet morning. You decide:",
    "出门走走，看看睡着的霓城": "Walk out. See the sleeping Nicheng",
    "给最近聊得最多的人发早安": "Send a good-morning to whoever you've talked with most",
    "再睡半小时，难得不用赶": "Sleep half an hour more. No rush for once",
    "霓城美食地图更新：城南巷子口新开一家糖水铺，祖传配方！午休走起！": "Nicheng food map update: a new dessert-soup shop just opened at the south alley mouth. Family recipe! Lunch break, let's go!",
    "（傍晚的霓城开始点灯。你在江边站了一会儿，身后的城市一点点亮起来。）": "(Dusk. Nicheng begins to light up. You stand by the river a while, the city behind you glowing on, bit by bit.)",
    "情报：砚美术馆下周办新展，主题「未完成」。沈老板这次亲自下场策展！": "Intel: the Yan Art Museum's new show opens next week — theme: \"Unfinished\". Boss Shen is curating it himself this time!",
    "（来霓城第十四天。你已经能分辨每条街的灯牌，哪一盏先亮。）": "(Day fourteen in Nicheng. You can already tell which neon sign on each street lights up first.)",
    "两周啦！本情报王宣布：你在霓城正式\"混开了\"！": "Two weeks! The Intel Queen declares: you have officially \"made it\" in Nicheng!",
    "（开幕在即，你在展厅忙到很晚。手机在口袋里安静了一整晚——没有人催你回。）": "(Opening soon. You work late in the gallery. The phone stays quiet in your pocket all evening — no one rushing you.)",
    "（霓城的夜。你走在回家的路上，忽然想起他最近说过的一句话。）": "(A Nicheng night. Walking home, you suddenly recall something he said recently.)",
    "（来霓城三周。有些关系，比你以为的更近了一点。）": "(Three weeks in Nicheng. Some bonds are a little closer than you thought.)",
    "（开幕当晚。展厅的灯一盏盏熄灭，你才发觉自己站了一整天，却一点都不累。）": "(Opening night. The gallery lights go out one by one — and only now do you realize you've been on your feet all day, and not tired at all.)",
    "（深夜。手机里那几条没舍得删的对话，你又翻了一遍。）": "(Late night. You read again those conversations you couldn't bring yourself to delete.)",
    "（霓城的夜。你和他的距离，好像又近了一杯咖啡的宽度。）": "(A Nicheng night. The distance between you and him — one coffee-width closer, maybe.)",
    "（开幕过去了。你终于有空坐下来，把这几周的人和事，从头想了一遍。）": "(The opening has passed. You finally sit down and think through these weeks, from the beginning.)",
    "（来霓城半个月。你开始习惯这座城的呼吸：地铁的风、天桥的灯、楼下便利店的关东煮。）": "(Half a month in Nicheng. You're getting used to the city's breathing: subway wind, overpass lights, the oden at the corner store.)",
    "半月心得交一下！就一句：你现在走在霓城，像本地人了。": "Half-month report! One line: you walk around Nicheng like a local now.",
    "霓城进梅雨季了，出门记得带伞！顺便说，雨天的霓虹最好看，反光像满地碎钻。": "Nicheng's rainy season is here — carry an umbrella! Also: neon is at its best in the rain. The reflections look like scattered diamonds.",
    "（夜里一个人在阳台站了会儿。楼下的霓虹灭了一半，城市终于安静下来。）": "(Alone on the balcony at night for a while. Half the neon below has gone out. The city finally quiets.)",
    "（一个人也很好。你想。）": "(Being alone is fine too, you think.)",
    "情报：这周末霓城办「灯河节」，整条江边挂满灯串！一个人去也超好看，我作证！": "Intel: this weekend is the \"River of Lanterns Festival\" — the whole riverside strung with lights! Gorgeous even solo — I attest!",
    "（灯河节。你可以去，也可以不去。霓城会一直亮着。）": "(The River of Lanterns Festival. You can go, or not. Nicheng will keep glowing either way.)",
    "情报：城南那家美术馆在招夜场讲解，你要不要报个名？不赚钱，但能光明正大看展。": "Intel: the south-side museum is recruiting evening guides. Want to sign up? No pay — but you get to browse the exhibitions legitimately.",
    "（你在霓城养成了新的习惯：下班绕远路，只为经过那家亮着暖灯的书店。）": "(A new habit in Nicheng: taking the long way home, just to pass the bookstore with the warm light.)",
    "（来霓城三周。你不再需要导航就能穿过老城区，也不再需要借口才敢一个人吃饭。）": "(Three weeks in Nicheng. You can cross the old town without a map — and eat alone without an excuse.)",
    "三周！本情报王正式宣布：你已经是个合格的霓城人了。今晚奖励自己一顿好的！": "Three weeks! The Intel Queen officially declares you a qualified Nichenger. Treat yourself to a good dinner tonight!",
    // ===== 苏苏情报选项 =====
    "你说要不要去问问？我可以帮你打探！": "Should you go ask? I can do the digging for you!",
    "苏苏在等你的决定：": "Su Su awaits your decision:",
    "别问了，我相信他": "Don't ask. I trust him",
    "帮我盯着": "Keep an eye out for me",
    "不管，先忙眼前的": "Never mind. Focus on what's in front of me",
    "你说他不会真要走吧？九年没见，刚重逢就要走？": "He's not really leaving, is he? Nine years apart, and he leaves right after finding you again?",
    "苏苏替你着急：": "Su Su worries for you:",
    "去问问他": "Go ask him",
    "他要走是他的事": "If he leaves, that's his business",
    "也许只是工作": "Maybe it's just work",
    "你说那首《夏》，是不是跟你有关？毕竟你叫林夏诶！": "That song \"Summer\" — isn't it about you? I mean, you're literally named Lin Xia!",
    "苏苏的问题戳中了你：": "Su Su's question hits home:",
    "应该只是巧合": "It must be a coincidence",
    "我想去听他唱完": "I want to hear him finish singing it",
    "别瞎说，我们只是朋友": "Don't be silly. We're just friends",
    // ===== 邀约场景 =====
    "赴约 · 私人画室": "The Date · Private Studio",
    "私人画室": "Private Studio",
    "画室在美术馆顶楼，没有灯，只有月光。\n他指着一幅盖着布的画：\n\"这幅，画了三年。\"\n\"画的是谁？\"\n他没回答，把布掀开一角。": "The studio sits at the top of the museum. No lights — only moonlight.\nHe points at a canvas under cloth:\n\"This one took three years.\"\n\"Who is it?\"\nHe doesn't answer. He lifts a corner of the cloth.",
    "月光下，画布上是一张熟悉的侧脸。": "In the moonlight, the canvas holds a familiar profile.",
    "那是…我？": "Is that... me?",
    "为什么画我？": "Why did you paint me?",
    "我不喜欢被画": "I don't like being painted",
    "……也好。那幅画，本来也不该被人看见。": "...Fine. That painting was never meant to be seen anyway.",
    "画室的灯，我替你关了。下次不必再来。": "I turned off the studio lights for you. No need to come back.",
    "赴约 · 旧学校": "The Date · The Old School",
    "九年的旧学校": "The Nine-Year-Old School",
    "校门口的银杏又长高了一截。\n他带你走到当年高一军训的操场：\n\"你那时候站这里。我在你后面第三个。\"\n\"我数过，从那天到今天，九年又一百八十二天。\"": "The ginkgo at the gate has grown another stretch.\nHe walks you to the first-year training field:\n\"You stood here. I was third behind you.\"\n\"I counted — from that day to today: nine years and one hundred eighty-two days.\"",
    "他从相机里抽出一张旧照片——是你高一的侧脸。": "He pulls an old print from his camera bag — your first-year profile.",
    "你偷拍我？": "You secretly photographed me?",
    "为什么不说": "Why didn't you ever say",
    "照片给我": "Give me that photo",
    "没事。学校而已，下次还能去。其实也没有下次了。": "It's fine. Just a school. We can come again. ...There won't be a next time, actually.",
    "我在校门口等了两小时。银杏叶落了一地。没事，我先回了。": "I waited at the gate for two hours. The ginkgo leaves fell all over. It's fine — I'm heading back.",
    "赴约 · 雾港首唱": "The Date · Wugang Premiere",
    "雾港 · 首唱夜": "Wugang · Premiere Night",
    // ===== 朋友圈 =====
    "砚美术馆夏季展即将开幕。\n这次的主题是「城市与孤独」。\n我们花了三个月，收集了47位艺术家对这座城市的私人记忆。\n——欢迎来看。": "The Yan Art Museum's summer show opens soon.\nThis year's theme: \"City and Solitude\".\nThree months spent collecting the private memories of 47 artists about this city.\n— Come and see.",
    "去看的人不会孤独。": "Those who go won't be alone.",
    "一定去！": "I'll be there!",
    "主题听起来很沉重": "Sounds like a heavy theme",
    "（仅点赞不评论）": "(Like without commenting)",
    "今晚的霓城。\n高架桥上堵车，反而拍到了最好的光。\n——\n有人说，城市的灯是为孤独的人亮的。\n我觉得，灯是为等人的那个人亮的。": "Nicheng tonight.\nTraffic jam on the overpass — got the best light because of it.\n—\nThey say city lights shine for the lonely.\nI think they shine for the one who waits.",
    "啊啊啊好美！这是哪里拍的！": "Ahhh so beautiful! Where was this taken!",
    "等人的那个人，等到了吗？": "Did the one who waits... get waited for?",
    "拍得真好": "Beautiful shot",
    "今晚雾港。\n有人点了《夏》。\n我没唱。\n——\n有些歌，要等对的人在场才唱。": "Wugang tonight.\nSomeone requested \"Summer\".\nI didn't sing it.\n—\nSome songs wait for the right person in the room.",
    "下次唱给我听": "Sing it for me next time",
    "为什么是《夏》？": "Why \"Summer\"?",
    "开幕了。\n人来得很齐。\n有一位策展人，今天第一次独立完成了全部流程。\n——林夏，谢谢你。": "It opened.\nThe crowd came in full.\nAnd one curator completed the entire process on her own for the first time today.\n— Lin Xia. Thank you.",
    "恭喜。林夏值得。": "Congratulations. Lin Xia earned this.",
    "是我应该谢谢您": "I should be the one thanking you",
    "这只是开始": "This is only the beginning",
    // ===== 约会场景（dayScenes）=====
    "沈砚之带你去美术馆旁的茶室": "Shen Yanzhi takes you to the tea room beside the museum",
    "茶室很安静。我喜欢这里。": "The tea room is quiet. I like it here.",
    "比美术馆舒服多了。": "Much more comfortable than the museum.",
    "……难得听你说这种话。": "...Rare to hear you say that.",
    "下次，可以常来。": "Next time — come often.",
    "他破例让你看他未完成的画": "He makes an exception and shows you his unfinished painting",
    "这幅画，画了五年。": "This painting took five years.",
    "画的是……": "It's of...",
    "是你。": "You.",
    "从你来的第一天开始。": "From the day you arrived.",
    "暴雨夜，他约你在美术馆地下档案室整理捐赠文献": "On a stormy night he asks you to sort donated archives in the museum basement",
    "小心纸屑。这批文献比你我岁数都大。": "Mind the paper scraps. These documents are older than both of us.",
    "为什么挑下雨天做这个？": "Why do this on a rainy day?",
    "雨天闭馆。档案室只放得下两个人的安静。": "Rainy days close the museum. The archive holds quiet for exactly two people.",
    "……你提前查过天气预报吧。": "...You checked the weather forecast in advance, didn't you.",
    "查了一周。": "For a week.",
    "有些话，只在雨天说得出口。比如：今晚别走那么早。": "Some words only come out on rainy days. Like: don't leave so early tonight.",
    "陆辞带你去他高中的天台": "Lu Ci takes you to his high school rooftop",
    "这里，我高中每天都来。": "Here. I came every day in high school.",
    "九年没回来过？": "Nine years without coming back?",
    "直到今天，才敢带人来。": "Until today, I never dared bring anyone.",
    "……谢谢你愿意跟我来。": "...Thank you for coming with me.",
    "他让你进暗房看显影的过程": "He lets you into the darkroom to watch the print develop",
    "红光下，照片慢慢显出来。": "Under red light, the photo slowly emerges.",
    "这张……是我？": "This one... is me?",
    "你笑起来，比那幅画好看多了。": "When you smile, you outshine that painting.",
    "原来这话，我九年前就想说。": "Turns out I've wanted to say that since nine years ago.",
    "他不知从哪听说旧书店里有你们高中的校刊合订本": "He somehow heard the old bookstore has your high school's journal compilation",
    "老板说在架子最顶层。要我爬，还是你爬？": "The owner says it's on the top shelf. Me climbing, or you?",
    "你爬。你高。": "You climb. You're taller.",
    "……行。九年了，使唤起来还是这么顺手。": "...Fine. Nine years, and you still order me around so smoothly.",
    "找到了！《霓城一中校刊·合订本》！": "Found it! \"Nicheng No.1 High School Journal — Complete Volume\"!",
    "翻到运动会那页。第三张。": "Turn to the sports meet page. Third photo.",
    "……你偷拍我冲线这张，居然被登出来了？": "...You secretly shot me crossing the finish line — and it got published?",
    "是我投的稿。标题我起的：「她跑起来的样子，比夏天先到」。": "I submitted it. The title's mine too: \"She Runs Faster Than Summer Arrives.\"",
    "江屿骑车带你去看霓城的海": "Jiang Yu rides you out to see Nicheng's sea",
    "海的声音，比酒吧安静。": "The sea is quieter than the bar.",
    "你怎么知道我想来。": "How did you know I wanted to come.",
    "……不知道。只是觉得，你今天累。": "...I didn't. It just felt like you'd had a long day.",
    "累的时候，适合看海。": "When you're tired, the sea is good company.",
    "他让你听他独自排练《夏》": "He lets you listen to him rehearse \"Summer\" alone",
    "这首歌，从来没在人前唱过。": "This song — never sung in front of anyone.",
    "为什么今天唱给我？": "Why sing it for me today?",
    "……因为是你。": "...Because it's you.",
    "因为这首歌，本来就是要唱给你听的。": "Because this song was always meant to be sung to you.",
    "天没亮，他骑车带你去海边鱼市挑食材做早餐": "Before dawn he rides you to the seaside fish market to pick ingredients for breakfast",
    "挑吧。今晚想吃什么，早上说了算。": "Pick away. Whatever you want tonight — the morning decides.",
    "你还会做菜？": "You can cook?",
    "乐队散了那两年，我在大排档掌勺。": "The two years after the band broke up, I ran the wok at a food stall.",
    "……那你的歌里有没有海鲜的味道？": "...So do your songs taste of seafood?",
    "有。下一张专辑就叫这个。": "They do. That's the next album's title.",
    "开玩笑的。不过——跟你逛菜市场这种日子，我可以天天有。": "Kidding. But — days of browsing the market with you? I could have those every day.",
    // ===== 梦魇 =====
    "梦里你一个人站在空旷的房间，三道门都关着。每扇门后都有一个声音叫你，但你推不开任何一扇。": "In the dream you stand alone in an empty room, three doors all shut. A voice calls to you behind each — but none will open.",
    "（夜很深。你做了个梦。）": "(The night is deep. You dream.)",
    "……有人吗？": "...Anyone there?",
    "（三道门，三种声音，都听不真切。你醒了，冷汗未干。）": "(Three doors, three voices — none quite clear. You wake, cold sweat not yet dry.)",
    "醒来后你想：": "Waking, you think:",
    "记录下来，写进日记": "Write it down in the diary",
    "给苏苏发条消息": "Message Su Su",
    "继续睡": "Go back to sleep",
    "梦里他对你笑，递来一杯酒。酒杯里映出的却是另一个人的脸。": "In the dream he smiles at you and hands you a drink. Reflected in the glass — someone else's face.",
    "（梦里他在笑。）": "(In the dream, he is smiling.)",
    "喝吧。": "Drink.",
    "……杯子里是谁？": "...Who's in the glass?",
    "（酒杯映出的不是你的脸。你惊醒。）": "(The glass holds a face that isn't yours. You wake with a start.)",
    "醒来后你决定：": "Waking, you decide:",
    "主动问他过去的事": "Ask him about his past",
    "先观察一段时间": "Watch and wait a while",
    "假装不知道": "Pretend you don't know",
    "梦里你站在雾港的舞台上，追光灯白得晃眼。台下坐满了人，却没有一张脸是清楚的。\n你张嘴想唱，歌词全是空白。台下有人开始鼓掌，掌声越来越响，像潮水漫过头顶。": "In the dream you stand on Wugang's stage, the spotlight blinding white. The seats are full, yet not one face is clear.\nYou open your mouth to sing — the lyrics are all blank. Someone begins to clap; the applause swells like a tide over your head.",
    "（追光灯很烫。台下黑压压的一片。）": "(The spotlight burns. Below, a dark mass of people.)",
    "歌词……歌词是什么来着？": "The lyrics... what were the lyrics?",
    "（掌声轰然响起。你在掌声里惊醒，心跳快得像唱完了一整首歌。）": "(The applause crashes. You wake inside it, heart pounding as if you'd sung an entire song.)",
    "把梦里的鼓掌声写下来": "Write down the applause",
    "给江屿发条消息，什么都不说": "Message Jiang Yu, say nothing",
    "深呼吸，把灯全打开": "Breathe. Turn on every light",
    // ===== 邀约消息 =====
    "明天晚上，来我私人画室。有幅画，画了三年，想让你看。": "Tomorrow night, come to my private studio. There's a painting — three years in the making — I want you to see.",
    "周末有空吗？带你重走一遍我们以前的学校。往返四小时，赶得及吃晚饭。": "Free this weekend? Let me walk you through our old school. Four hours round trip — back in time for dinner.",
    "今晚雾港有我新歌的首唱。来吗？留了你最爱的位置。": "Wugang tonight, the premiere of my new song. Coming? Your favorite seat is saved.",
    "夏夏！我朋友在美术馆实习，她说沈砚之本周有个神秘会面，对象是从北方来的女人！": "Xiaxia! My friend interns at the museum — she says Shen Yanzhi has a mysterious meeting this week, with a woman from the north!",
    "陆辞最近是不是在收拾行李？我看见他朋友圈发了张机票照片，又秒删了！目的地好像是国外！": "Has Lu Ci been packing lately? I saw a plane ticket photo on his Moments — deleted in a second! The destination looked like abroad!",
    "雾港的调酒师小杨告诉我，江屿最近每晚都在写歌，写到天亮。他写的歌，副歌部分全是\"夏\"字！": "Xiao Yang the bartender at Wugang told me Jiang Yu's been writing songs every night lately — till dawn. And in the choruses? Nothing but \"summer\"!",
    // ===== 成就与彩蛋 =====
    "第一次回复男主消息": "Reply to a love interest's message for the first time",
    "听完3次电话通话": "Complete 3 phone calls",
    "让一个男主等待回复超过30秒": "Leave a love interest waiting over 30 seconds",
    "发动态并收到角色互动": "Post a Moment and get a reaction",
    "在群聊里发过消息": "Send a message in the group chat",
    "前往过所有地点": "Visit every location",
    "解锁3张以上相册照片": "Unlock 3 or more album photos",
    "收集3个以上梦境碎片": "Collect 3 or more dream shards",
    "连续3天抽塔罗": "Draw tarot 3 days in a row",
    "送出第一份礼物": "Give your first gift",
    "体验过4种以上不同心情": "Experience 4 or more moods",
    "触发闪回/前传章节": "Trigger a flashback chapter",
    "接受过一次邀约": "Accept an invitation",
    "(隐藏) 同时被三位男主的好感度推到5以上": "(Hidden) Have all three love interests' affection above 5 at once",
    "(隐藏) 选择\"谁都不回\"路线": "(Hidden) Choose the \"reply to no one\" route",
    "凌晨3点还在和某个人通话，霓城的夜，比想象的深。": "Still on a call at 3 AM. Nicheng's nights run deeper than you imagined.",
    "同一晚让三个男主都为你失眠。": "Keep all three of them up all night in one evening.",
    "收到一条来自五年前的消息。": "Receive a message from five years ago.",
    "连续七天写内心独白，霓城开始听你的话。": "Keep an inner diary for seven days straight — Nicheng starts listening to you.",
    "抽到\"世界\"牌的那一天，你做出了某个决定。": "The day you drew \"The World\", you made a certain decision.",
    "不依附任何一条路线，走完了霓城。": "Walked Nicheng to the end, tied to no route.",
    "给三位男主各送出一份礼物。": "Give a gift to each of the three.",
    "集齐10件以上收集品。": "Collect 10 or more collectibles.",
    "（你主动走过去，把伞举到他头顶。）": "(You walk over and hold the umbrella above his head.)"
  });
})();


/* ===== i18n/story-en-translations-4.js ===== */
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
    "（你把闹钟按掉。十分钟后自然醒，窗外已经亮了。）": "(You silence the alarm. Ten minutes later you wake on your own — the window's already bright.)",
    // ===== v0.7.1：三条线中段二周目变体 =====
    "你不用回答我。上一次，我就这样说了然后真的走了。": "You don't have to answer. Last time I said exactly this — and then I actually left.",
    "这一次我把话说完：机票我买了，但退掉的手续费我也查好了。所以——你只要说一个字，我就不上那班飞机。": "This time I'll finish the sentence: I bought the ticket, but I also checked the refund fee. So — say one word, and I won't board that flight.",
    "他把选择权交给你的第二次。": "He hands you the choice, for the second time.",
    "我可能唱不完。但我想试。……上一次我也是这么说的。": "I might not make it through. But I want to try. ...I said the same thing last time.",
    "上一次我停在副歌前。这一次我想知道，如果知道你在台下，我能不能唱完。": "Last time I stopped before the chorus. This time I want to know — if I know you're in the audience, can I finish it?",
    "同一个舞台，第二次。": "The same stage, the second time.",
    "他说你忙。可你根本没收到过那些电话，对吧？……这话我上一次也说过。": "He said you were busy. But you never got those calls at all, did you? ...I said this last time too.",
    "上一次你选择替沈砚之解释，然后我沉默了九年。这一次——我不问对错了，只问你还想不想被人替他\"过滤\"掉。": "Last time you chose to explain for Shen Yanzhi, and I stayed silent for nine years. This time — I won't ask who's right. I'll only ask: do you still want to be \"filtered\" on his behalf?",
    "同一个问题，第二次。": "The same question, the second time.",
    // ===== v0.8.5：三线 day7-14 日常 =====
    "还在整理展签？": "Still working on the exhibit labels?",
    "深夜的展厅只剩你一人。": "The gallery is empty except for you.",
    "马上就走": "Leaving right now",
    "再等五分钟": "Five more minutes",
    "你桌上的咖啡凉了。我替你换了一杯。": "Your coffee went cold. I got you a new one.",
    "不用谢。路过。": "Don't mention it. I was passing by.",
    "下雨了。你带伞了吗。": "It's raining. Did you bring an umbrella.",
    "他的语气像在陈述一个事实。": "His tone states a fact, not a question.",
    "没带，正在等雨停": "No. Waiting for it to stop",
    "带了，谢谢关心": "Yes. Thanks for asking",
    "展厅门口。等你。": "Gallery entrance. Waiting for you.",
    "今天画的速写，模特是自己。": "Today's sketch — I was my own model.",
    "他很少主动提起自己的画。": "He rarely brings up his own work.",
    "能看看吗？": "Can I see it?",
    "画得像你本人吗？": "Does it look like you?",
    "档案室整理完了。比预想的快。": "Archives are done. Faster than expected.",
    "……你不在的时候，安静得有点过分。": "...When you're not here, it's too quiet.",
    "[图片] 今天扫街拍的。猜猜这是哪条路。": "[Photo] Street shot today. Guess which road.",
    "照片里的路被夕阳染成橘色。": "The road in the photo is dyed orange by sunset.",
    "城南那条梧桐路？": "The plane-tree road in the south?",
    "不知道，带我去看看？": "No idea. Take me there?",
    "刚才路过一家琴行，有人在弹《卡农》。": "Passed a piano shop. Someone was playing Canon.",
    "我站在门口听完了整首。路人以为我在等人。": "I stood at the door for the whole piece. Strangers thought I was waiting for someone.",
    "其实我在想，九年前的你会不会也路过那里。": "Actually I was wondering if you'd passed there too, nine years ago.",
    "暗房的灯坏了，红灯还在。": "The darkroom light broke. The red one still works.",
    "他说他在黑暗里待了一下午。": "He says he spent the whole afternoon in the dark.",
    "别在暗房待太久，对眼睛不好": "Don't stay in the darkroom too long. Bad for your eyes",
    "洗出来的照片给我看看": "Show me the prints",
    "操场边的银杏开始黄了。": "The ginkgo by the field is starting to yellow.",
    "我记得你说过喜欢银杏。": "I remember you said you liked ginkgos.",
    "翻到高中时的校牌。你的是蓝色的，我的是红色的。": "Found our high school badges. Yours is blue, mine is red.",
    "他很少主动聊高中的事。": "He rarely talks about high school on his own.",
    "你还留着那些？": "You kept those?",
    "明天带给我看": "Bring them tomorrow",
    "下班走回来的时候，发现霓城有一条路我从没走过。": "Walking home from work, I found a road in Nicheng I'd never taken.",
    "等你哪天有空，带你去走一遍。": "When you're free, I'll walk it with you.",
    "昨晚喝多了。": "Drank too much last night.",
    "……说了什么吗。": "...Did I say anything.",
    "他在确认自己有没有失言。": "He's checking whether he slipped.",
    "你说了一首歌的名字": "You said a song's name",
    "你什么都没说，只是沉默": "You didn't say anything. Just silence",
    "今天的员工餐是拉面。老板娘多给了一个蛋。她说看我瘦。": "Staff meal was ramen. The owner's wife gave me an extra egg. Said I looked thin.",
    "[语音 8\"]": "[Voice 8\"]",
    "demo。副歌还差两个字。": "Demo. The chorus is two words short.",
    "他想让你听。": "He wants you to hear it.",
    "很好听，别急": "It sounds great. Don't rush",
    "差的那两个字是什么？": "What are the two missing words?",
    "酒吧今天来了个唱歌的女孩。唱得不错。但不是那首歌。": "A girl came to sing at the bar today. Good voice. But not that song.",
    "下班骑车去了海边。风很大。": "Rode to the sea after work. Wind was strong.",
    "他说海边的风把他的话吹散了。": "He says the wind blew his words away.",
    "什么话？": "What words?",
    "下次带我一起去": "Take me next time",
    "雾港的舞台今晚没人用。": "Wugang's stage is free tonight.",
    "我上去站了一会。追光没开，但我知道它在那。": "I stood on it a while. The spotlight was off, but I knew it was there."

  });
})();


/* ===== i18n/story-en-translations-5.js ===== */
/* ===== 霓虹心事 · 剧情文本英译包（day4-5 节奏补齐，v0.9.2）=====
 * key = 中文原文（与 story/01b_day45.js 逐字一致），value = 英文译文。
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = window.I18N_PACKS['en-US'] || {};
  Object.assign(window.I18N_PACKS['en-US'], {
    "霓城下雨了！你带伞没？那边雨说来就来。": "It's raining in Nicheng! Got an umbrella? The rain here comes out of nowhere.",
    "雨点已经砸在窗上。": "Rain is already hammering the window.",
    "折回去拿伞": "Go back for an umbrella",
    "（你跑回住处拿了伞。迟到五分钟，但干爽一整天。）": "(You run back for the umbrella. Five minutes late, but dry all day.)",
    "直接冲进雨里": "Run straight into the rain",
    "（雨水顺着领口灌进来。奇怪的是，你居然笑了。）": "(Rain pours down your collar. Oddly, you find yourself laughing.)",
    "靠谱！霓城的雨最喜欢欺负没伞的人。": "Reliable! Nicheng rain loves picking on people without umbrellas.",
    "疯了吧！到地方记得喝热的，别逞强。": "You're crazy! Get something hot when you arrive. Don't tough it out.",
    "展签初稿写完了。第三段空着——那句\"画中人的名字\"，我想由你来写。": "The first draft of the label is done. The third paragraph is blank — the line about the painted person's name. I'd like you to write it.",
    "展签上留着一行空白。": "A blank line waits on the label.",
    "写我的名字": "Write my name",
    "（你写下自己的名字。笔尖停了一秒才离开纸面。）": "(You write your own name. The nib lingers a second before leaving the paper.)",
    "还是留白吧": "Leave it blank",
    "（你把笔放下。有些答案，先不写反而更完整。）": "(You put the pen down. Some answers are more complete unwritten.)",
    "……好。那这一行，就不擦了。": "...All right. Then this line stays.",
    "留白也是一种答案。我尊重它。": "Blank space is an answer too. I respect it.",
    "雨后的光最好看。我在梧桐路，你要不要来当一次模特？只拍一张。": "The light after rain is the best. I'm on Wutong Road — want to be my model? Just one shot.",
    "窗外的天色刚放晴。": "The sky outside has just cleared.",
    "我现在过去": "I'm coming over",
    "（你抓起外套。他在楼下等你，相机已经举起来了。）": "(You grab your coat. He's waiting downstairs, camera already raised.)",
    "下次吧，今天有点累": "Next time — I'm a bit tired today",
    "（你回绝得很轻。他没有追问，只回了一个\"好\"。）": "(Your refusal is gentle. He doesn't push, only replies \"okay\".)",
    "别动。……好了。这张我不给别人看。": "Don't move. ...Done. I won't show this one to anyone.",
    "好。光会等我，我也会。": "Okay. The light will wait for me. So will I.",
    "排练室空着。你要是没地方去，可以来听一段没写完的。": "The rehearsal room is empty. If you've nowhere to go, come hear something unfinished.",
    "手机屏幕亮着，外面已经入夜。": "The phone screen glows; night has fallen outside.",
    "我去听": "I'll come listen",
    "（排练室的门虚掩着。你推门时，他正好按下第一个和弦。）": "(The rehearsal room door is ajar. As you push it open, he hits the first chord.)",
    "不打扰你了": "I won't disturb you",
    "（你把手机扣在桌上。那首歌，今晚只属于他自己。）": "(You set the phone face down. Tonight, that song belongs only to him.)",
    "……这一段，还没名字。你听完给一个？": "...This part has no name yet. Give it one after you listen?",
    "行。等它写完了，第一个给你听。": "Sure. When it's finished, you'll be the first to hear it.",
    "中午一起吃？我请你吃霓城最辣的粉，吃完什么烦恼都没了。": "Lunch together? I'll treat you to Nicheng's spiciest noodles — after that, no worries left.",
    "午饭时间，肚子先替你做了决定。": "It's lunchtime. Your stomach has decided for you.",
    "好，老地方见": "Sure, see you at our usual place",
    "（你到的时候，苏苏已经点好了两碗，辣得发亮。）": "(By the time you arrive, Su Su has ordered two bowls, glossy with chili oil.)",
    "今天想一个人吃": "I feel like eating alone today",
    "（你找了个靠窗的位置。一个人吃饭，也不算坏事。）": "(You take a window seat. Eating alone isn't so bad.)",
    "看吧！辣一口，霓城就没那么难懂了。": "See! One spicy bite and Nicheng makes more sense.",
    "行吧。那晚上记得吃点热的，别又糊弄。": "Fine. Just eat something hot tonight — don't skip it again.",
    "（第五天的傍晚。窗外是霓城不眠的灯，屋里只有你。）": "(Evening of day five. Outside, Nicheng's sleepless lights; inside, only you.)",
    "一个人待着的第五天。": "Day five, alone.",
    "给自己煮一碗面": "Cook yourself a bowl of noodles",
    "（水开了。你把面下进去，忽然觉得这间屋子开始像\"家\"了。）": "(The water boils. As you drop the noodles in, the room starts to feel like home.)",
    "翻出旧照片": "Take out old photos",
    "（照片里的人和现在的你隔着几年。你看了很久，才把它放回去。）": "(The person in the photo is years away from you now. You look for a long time before putting it back.)",
    "（面好了。你端着碗坐在窗边，霓城的灯一盏一盏亮着。）": "(The noodles are ready. Bowl in hand by the window, you watch Nicheng's lights come on one by one.)",
    "（照片背面写着一个日期。你记得那天，也记得当时没说出口的话。）": "(A date is written on the back. You remember that day — and the words you never said.)",
    // v0.9.3: day5 三条男主线
    "闭馆了，展厅只剩换灯的活儿。你要是不赶时间——留一盏灯给我就好。": "The museum's closed — only the lights left to change. If you're not in a hurry, just leave one on for me.",
    "展厅的灯已经灭了一半。": "Half the gallery lights are already out.",
    "留下，帮他扶梯子": "Stay and hold the ladder",
    "（梯子晃了一下。他扶住你的手腕，说：\"站稳。\"）": "(The ladder sways. He steadies your wrist and says, \"Stand firm.\")",
    "先回去，明天见": "Head back — see you tomorrow",
    "（你走到门口回头。他自己把最后一盏灯换完了。）": "(You glance back from the door. He finishes changing the last light alone.)",
    "手别松。……好了，这盏灯的位置，以后就按你扶的高度来。": "Don't let go. ...There. From now on, this light stays at the height you held.",
    "明天见。灯我会一盏一盏点好。": "See you tomorrow. I'll light them one by one.",
    "暗房今天只开一盏红灯。你要不要进来，看一张照片慢慢显影？": "The darkroom has only the red light on today. Want to come in and watch a photo develop?",
    "暗房的门缝里透出一点红光。": "A sliver of red light leaks from the darkroom door.",
    "进去看": "Go in and look",
    "（红灯下，照片里的人一点点浮出来——是你。）": "(Under the red light, the figure in the photo slowly surfaces — it's you.)",
    "在门口等你": "Wait outside",
    "（门再开时，他递出一张还湿着的照片：\"拍的是门口的光。\"）": "(When the door opens again, he hands you a still-damp print: \"It's the light at the doorway.\")",
    "别急，还要再等一会儿。显影和等人的耐心，是一回事。": "No rush — a little longer. Developing and waiting take the same patience.",
    "门口的光也很好看。你站在那里的时候，最好看。": "The light at the doorway is beautiful too. You standing there is the best part.",
    "今晚凌晨有鱼市。我要去买条鱼，顺便找点歌里的声音。你来吗？": "There's a fish market before dawn. I'm going to buy a fish and find a sound for the song. Coming?",
    "手机屏幕的光映在天花板上。": "Phone light reflects on the ceiling.",
    "陪他去": "Go with him",
    "（凌晨的鱼市亮着白灯。他挑鱼的动作很熟练，像在调弦。）": "(The pre-dawn market glows white. He picks fish the way he tunes a guitar.)",
    "下次吧": "Next time",
    "（你把闹钟关掉。凌晨三点，手机震了一下。）": "(You turn off the alarm. At 3 a.m., your phone buzzes.)",
    "听，这个水声。我找了三个月，就是它。": "Listen — this water sound. I've searched three months for it.",
    "（语音 20\"）：鱼市的潮声。你说下次，那就下次。": "(Voice 20\"): The tide sound of the fish market. You said next time — so, next time."
  });
})();

/* ===== i18n/story-en-translations-6.js ===== */
/* ===== 霓虹心事 · 剧情文本英译包（flavors 差异化文案收口，v0.9.4）=====
 * 覆盖塔罗/天气/情报/旁白等按性格或运势分化的历史变体文本。
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = window.I18N_PACKS['en-US'] || {};
  Object.assign(window.I18N_PACKS['en-US'], {
    "通知！本周六「霓城小分队」首次线下聚餐！地点投票，现在开始！今天你手气旺，选哪家都好吃！": "Notice! First offline gathering of the Nicheng Squad this Saturday! Location vote starts now! You're lucky today — any choice will taste great!",
    "通知！本周六「霓城小分队」首次线下聚餐！地点投票，现在开始！选对地方，某人会开心哦～": "Notice! First offline gathering of the Nicheng Squad this Saturday! Location vote starts now! Pick the right place and someone will be very happy~",
    "通知！本周六「霓城小分队」首次线下聚餐！地点投票，现在开始！三个选项都附了攻略，理性选择！": "Notice! First offline gathering of the Nicheng Squad this Saturday! Location vote starts now! All three options come with a guide. Choose rationally!",
    "投票有效！周六晚上七点，不许请假，不许迟到！今天你运气好，抢位子都顺！": "Vote confirmed! Saturday 7 p.m. — no excuses, no lateness! You're lucky today; even seats came easy!",
    "投票有效！周六晚上七点，不许请假，不许迟到！坐得离谁近，你懂的～": "Vote confirmed! Saturday 7 p.m. — no excuses, no lateness! Who you sit next to — you know what I mean~",
    "投票有效！周六晚上七点，不许请假，不许迟到！攻略已发群公告，预习一下！": "Vote confirmed! Saturday 7 p.m. — no excuses, no lateness! The guide is pinned in the group. Read up!",
    "投票有效！周六晚上七点，不许请假，不许迟到！这顿吃完，得拍张合影挂群相册！": "Vote confirmed! Saturday 7 p.m. — no excuses, no lateness! After this meal, we're taking a group photo for the album!",
    "🔥首聚现场直击：红锅已开，人齐了——今天连排队都特别顺，好运开场！": "🔥Live from the first gathering: the red pot is boiling and everyone's here — even the queue went smoothly. Lucky start!",
    "🔥首聚现场直击：红锅已开，沈老板居然主动坐你旁边！氛围感拉满！": "🔥Live from the first gathering: the red pot is boiling — Boss Shen actually chose the seat next to you! Maximum atmosphere!",
    "🔥首聚现场直击：红锅已开，这锅底的味道，和咱们毕业那顿一模一样！": "🔥Live from the first gathering: the red pot is boiling — this broth tastes exactly like our graduation dinner!",
    "🏮首聚现场：居酒屋小间已包，老板说今天酒水买一送一，好运！": "🏮First gathering: the izakaya back room is booked. The owner says drinks are buy-one-get-one today. Lucky!",
    "🏮首聚现场：居酒屋小间已包，江屿点的全是\"她的\"——就离谱！": "🏮First gathering: the izakaya back room is booked. Jiang Yu ordered everything \"for her\" — unbelievable!",
    "🏮首聚现场：居酒屋小间已包，这个位子，是咱们当年逃课喝酒那间！": "🏮First gathering: the izakaya back room is booked — this is the very room where we skipped class to drink!",
    "🎨首聚现场：美术馆包间，今天闭馆刚好赶上新展布置，运气绝了！": "🎨First gathering: the museum's private room. We caught the new exhibition setup on a closed day — incredible luck!",
    "🎨首聚现场：美术馆包间，沈老板亲选菜单——他什么时候这么用心过！": "🎨First gathering: the museum's private room, menu chosen by Boss Shen himself — when has he ever been this thoughtful!",
    "🎨首聚现场：美术馆包间，据可靠情报，菜单是他比了三天价的成果。": "🎨First gathering: the museum's private room. Reliable intel says he spent three days comparing prices for this menu.",
    "下雨了！！但你看窗外，雨把灯牌的光都点亮了，淋这一场说不定是好运开场！！": "It's raining!! But look outside — the rain has lit up every neon sign. Getting soaked might be a lucky start!!",
    "下雨了！！你站屋檐下别动！我拿伞去接你——这种天气最适合说点心里话！！": "It's raining!! Stay under the eaves! I'll bring an umbrella — this weather is perfect for saying what's on your mind!!",
    "下雨了！！雷达显示四十分钟后停。找个屋檐待着，别冲，淋感冒不划算！！": "It's raining!! Radar says it'll stop in forty minutes. Find shelter, don't dash — catching a cold isn't worth it!!",
    "下雨了！！这雨让我想起去年春天，你也是忘带伞，站在美术馆门口等雨停。": "It's raining!! This rain reminds me of last spring — you forgot your umbrella too, waiting at the museum entrance for it to stop.",
    "布展方案通过了。闭馆后只留一盏灯，你要不要来看看它独自发光的样子？": "The exhibition plan passed. After closing, I'll leave just one light on — want to see how it shines alone?",
    "布展方案通过了，还顺带抽到个好档期。今晚不忙的话，陪我验收一下？": "The exhibition plan passed, and we drew a good slot. If you're free tonight, come check it with me?",
    "布展方案通过了。流程都核过了，你今晚不必陪跑，好好休息。": "The exhibition plan passed. Every step is verified. You don't need to stay tonight — rest well.",
    "（他这句话说得很慢，像在练习怎么把\"命令\"换成\"邀请\"。）": "(He says it slowly, as if practicing how to turn a \"command\" into an \"invitation\".)",
    "（他说完自己顿了一下，像是意识到刚才那句话已经不再是命令了。）": "(He pauses after saying it, as if realizing those words are no longer a command.)",
    "[图片] 早上扫街正好撞见一束光，整个路口都是亮的。运气好，拍到了。": "[Photo] Caught a shaft of light while shooting this morning — the whole intersection lit up. Lucky shot.",
    "[图片] 路过咱们以前常走的那条街，多按了两张。路没变，光变了。": "[Photo] Passed the street we used to walk. Took two extra frames. The road hasn't changed; the light has.",
    "[图片] 街角那家店换了招牌，但玻璃上还映着你上次站的位置。顺手拍下来了。": "[Photo] The corner shop changed its sign, but the glass still reflects where you stood last time. Snapped it.",
    "[语音 15\"]": "[Voice 15\"]",
    "昨晚梦见一段旋律，醒了一半，只抓住这个副歌。梦比白天会写歌。": "Dreamed a melody last night. Woke halfway and only caught the chorus. Dreams write better songs than daylight.",
    "demo 写完了。副歌最后两个字，是那天晚上你随口哼的调子。": "The demo's done. The last two syllables of the chorus are the tune you hummed that night.",
    "改的是十年前那首没写完的歌。今天总算知道后面该接什么了。": "I reworked that unfinished song from ten years ago. Today I finally know what comes next.",
    "重大情报！！今天你幸运值拉满，走到哪都有桃花雷达自动锁定你！！": "Major intel!! Your luck is maxed today — romance radar locks onto you wherever you go!!",
    "重大情报！！你今天整个人的气场甜到发齁，恋爱信号爆表，快出门收割！！": "Major intel!! Your whole vibe is sickly sweet today, romance signals off the charts. Get out there and harvest!!",
    "重大情报！！我做了个统计：本周你被同时约的概率是 100%，结论：你需要一个日程管理 App！！": "Major intel!! I ran the numbers: 100% chance you'll be asked out by two people this week. Conclusion: you need a calendar app!!",
    "重大情报！！我刚翻到去年的聊天记录，你那天说的话居然全应验了，玄学！！": "Major intel!! I just found last year's chat logs — everything you said that day came true. Witchcraft!!",
    "霓城美食地图更新：城南巷子口新开一家糖水铺，第一锅被我们赶上，好运！午休走起！": "Nicheng food map update: a new dessert shop at the south alley. We caught the first pot — lucky! Let's go at lunch!",
    "霓城美食地图更新：城南巷子口新开一家糖水铺，据说甜到心动那种！午休走起！": "Nicheng food map update: a new dessert shop at the south alley. They say it's heart-achingly sweet! Lunch break, let's go!",
    "霓城美食地图更新：城南巷子口新开一家糖水铺，老板娘说手艺是跟咱们学校门口那家学的！午休走起！": "Nicheng food map update: a new dessert shop at the south alley. The owner learned her craft from the shop by our school gate! Lunch break, let's go!",
    "（傍晚的霓城开始点灯。江面上浮着旧年的倒影，你忽然想起第一次来这里的那个黄昏。）": "(Nicheng begins to light up at dusk. Old-year reflections float on the river; you suddenly recall the first dusk you came here.)",
    "（傍晚的霓城开始点灯。今天运气不错，你看见江对面那栋楼，刚好亮出你的星座。）": "(Nicheng begins to light up at dusk. Good luck today: across the river, a building lights up in your constellation.)",
    "（傍晚的霓城开始点灯。灯亮起来的样子，像极了你昨晚梦里的那片光。）": "(Nicheng begins to light up at dusk. The way the lights come on looks exactly like the light in last night's dream.)",
    "情报：砚美术馆下周办新展，主题「未完成」。沈老板亲自策展，据说方案改到第 27 版。": "Intel: the Yan Art Museum opens a new show next week, theme \"Unfinished\". Boss Shen curates it himself — they say the plan is on its 27th revision.",
    "情报：砚美术馆下周办新展，主题「未完成」。沈老板亲自策展——他上次这么上心，还是给你布展那次！": "Intel: the Yan Art Museum opens a new show next week, theme \"Unfinished\". Boss Shen curates it himself — the last time he cared this much was when he curated your exhibition!",
    "情报：砚美术馆下周办新展，主题「未完成」。像不像他那幅画了三年没画完的画？": "Intel: the Yan Art Museum opens a new show next week, theme \"Unfinished\". Doesn't it mirror that painting he's worked on for three years?",
    "（来霓城第十四天。你已经能分辨每条街的灯牌，哪一盏先亮——像是认识了很久的老朋友。）": "(Day fourteen in Nicheng. You can tell which sign on each street lights first — like an old friend you've known for years.)",
    "（来霓城第十四天。今天连红绿灯都在配合你，一路绿灯到公司。）": "(Day fourteen in Nicheng. Even the traffic lights cooperate today — all green to the office.)",
    "（开幕在即，你在展厅忙到很晚。布展清单一条条划掉，效率意外地高。）": "(The opening is near; you stay late in the gallery. Checking off the setup list one by one, you're unexpectedly efficient.)",
    "（开幕在即，你在展厅忙到很晚。中间他发来一句\"记得吃饭\"，你盯着看了几秒才继续干活。）": "(The opening is near; you stay late in the gallery. Midway, he texts \"remember to eat\". You stare at it for a few seconds before going back to work.)",
    "（开幕在即，你在展厅忙到很晚。挂画的姿势，让你想起第一次布展那天手忙脚乱的样子。）": "(The opening is near; you stay late in the gallery. The way you hang a painting reminds you of your fumbling first setup day.)",
    "（霓城的夜。你走在回家的路上，那句话像旧唱片一样，在心里转了一整天。）": "(Nicheng night. Walking home, that sentence spins in your heart all day like an old record.)",
    "（霓城的夜。你走在回家的路上，那句话让你的脚步不自觉地轻了一点。）": "(Nicheng night. Walking home, that sentence makes your steps a little lighter without meaning to.)",
    "（霓城的夜。你走在回家的路上，路灯一盏盏亮起，像有人提前替你铺好了路。）": "(Nicheng night. Walking home, streetlights come on one by one, as if someone paved the road ahead for you.)",
    "（来霓城三周。你发现自己开始习惯，消息里那个人的名字总是在最上面。）": "(Three weeks in Nicheng. You realize you're used to that person's name always sitting at the top of your messages.)",
    "（来霓城三周。你把最近的相处在脑子里捋了捋——边界感还在，但心甘情愿让出了一格。）": "(Three weeks in Nicheng. You review recent time together — the boundary is still there, but you willingly gave up one square.)",
    "（来霓城三周。回头看，遇见、重逢、并肩，好像都赶上了对的时辰。）": "(Three weeks in Nicheng. Looking back, meeting, reuniting, standing side by side — all seemed to arrive at the right hour.)",
    "（开幕当晚。参观数据比预估的高，你把复盘记了下来，明天继续。）": "(Opening night. Visitor numbers beat projections; you note the review and will continue tomorrow.)",
    "（开幕当晚。他离场前回头看了你一眼——那一秒，比整晚的掌声都清楚。）": "(Opening night. He glances back before leaving — that second is clearer than a whole night of applause.)",
    "（开幕当晚。布展的每一步你都记得清，像把一整段日子折进了这个展厅。）": "(Opening night. You remember every setup step, as if folding a whole stretch of days into this gallery.)",
    "（深夜。那几条对话你翻了一遍，时间戳停在一个平常的下午，你却记得很清楚。）": "(Late night. You scroll those few messages again; the timestamp stops on an ordinary afternoon you remember clearly.)",
    "（深夜。那几条对话你又翻了一遍，差点忍不住想再回一句。）": "(Late night. You scroll them again, barely stopping yourself from replying once more.)",
    "（深夜。那几条对话像会发光，你看着看着，做了一个很轻的梦。）": "(Late night. Those messages seem to glow; as you read, you drift into a very light dream.)",
    "（霓城的夜。你和他的距离，像又近了一杯咖啡的宽度——这一次你没有后退。）": "(Nicheng night. The distance between you and him narrows by the width of a coffee cup — this time you don't step back.)",
    "（霓城的夜。你复盘最近的相处：边界还在，但你好像默许了一些模糊。）": "(Nicheng night. You review recent time together: the boundary remains, but you seem to have allowed some blur.)",
    "（霓城的夜。今晚的霓虹，刚好是你们第一次遇见时的那两个颜色。）": "(Nicheng night. Tonight's neon happens to be the same two colors as when you first met.)",
    "（开幕过去了。你想的其实只有一件事：他上次说的那句话，到底算不算数。）": "(The opening has passed. Really, you think of only one thing: whether what he said last time counts.)",
    "（开幕过去了。你把状态、关系、进度都复盘了一遍，唯独\"他\"那一栏空着。）": "(The opening has passed. You review status, relationships, progress — everything except the \"him\" column, which stays blank.)",
    "（开幕过去了。你想起这几周里，有好几个瞬间，你都差点脱口而出。）": "(The opening has passed. You recall several moments these weeks when the words almost slipped out.)",
    "（来霓城半个月。你已经分得清，哪句\"有空吃饭\"是真的，哪句只是客套——像很多年前就懂了一样。）": "(Half a month in Nicheng. You can tell which \"let's eat sometime\" is real and which is polite — as if you'd known for years.)",
    "（来霓城半个月。你把这半个月在脑子里过了一遍：做了几件事，推掉几件事，账很清楚。）": "(Half a month in Nicheng. You replay it: what you did, what you declined. The ledger is clear.)",
    "（来霓城半个月。回头看，好几件事都赶在刚好那一刻——晚一步或早一步都不成。）": "(Half a month in Nicheng. Looking back, several things landed at exactly the right moment — a step earlier or later and they wouldn't have.)",
    "霓城进梅雨季了，记得带伞。雨天的霓虹你见过没有？反光在地上，像很多年前那场雨。": "Nicheng's rainy season has begun — bring an umbrella. Have you seen neon in the rain? It reflects on the ground like that rain years ago.",
    "霓城进梅雨季了，记得带伞！听说下雨天最适合两个人挤一把伞……（暗示）": "Nicheng's rainy season has begun — bring an umbrella! They say rainy days are best for two people squeezing under one umbrella... (hint)",
    "霓城进梅雨季了，记得带伞。雨天路滑，地铁比打车稳，别学我上次迟到。": "Nicheng's rainy season has begun — bring an umbrella. Roads are slippery; the subway is steadier than a cab. Don't repeat my lateness.",
    "（夜里一个人在阳台站了会儿。风里有点旧城区的味道，你忽然不太想挪动。）": "(You stand alone on the balcony at night. The wind carries a hint of the old district; suddenly you don't want to move.)",
    "（夜里一个人在阳台站了会儿。夜色深得像能一头扎进去，做一场好梦。）": "(You stand alone on the balcony at night. The night is deep enough to dive into and dream well.)",
    "（夜里一个人在阳台站了会儿。抬头看见一颗很亮的星——在霓城的灯里，居然还看得见。）": "(You stand alone on the balcony at night. You look up and see a bright star — visible even among Nicheng's lights.)",
    "情报：这周末霓城办「灯河节」，据说今年风向刚好，灯串会一路亮到江心！我去踩过点了，超灵！": "Intel: the Lantern River Festival is this weekend. They say the wind is just right this year — the strings of lights will reach the middle of the river! I scouted it; it's amazing!",
    "情报：这周末霓城办「灯河节」，整条江边挂满灯串——情侣扎堆，单身的去也不亏！": "Intel: the Lantern River Festival is this weekend. The whole riverside is covered in lights — couples everywhere, and going solo isn't a loss either!",
    "情报：这周末霓城办「灯河节」。人流量大，建议错峰，八点后去江对岸看更清楚。": "Intel: the Lantern River Festival is this weekend. Crowds will be heavy. Go off-peak; after eight, the far bank gives the best view.",
    "情报：城南那家美术馆在招夜场讲解。时薪一般，但能光明正大看展，性价比你自己算。": "Intel: the museum in the south is hiring night-tour guides. Pay is average, but you get to look at the exhibition openly. Do the math.",
    "情报：城南那家美术馆在招夜场讲解——据说沈老板偶尔去巡场，你懂的。": "Intel: the museum in the south is hiring night-tour guides — they say Boss Shen occasionally walks the floor. You know what I mean.",
    "情报：城南那家美术馆在招夜场讲解，名额就剩一个，我先帮你问了，手快有！": "Intel: the museum in the south is hiring night-tour guides. Only one slot left — I asked for you first. Move fast!",
    "（你在霓城养成了新的习惯：下班绕远路，经过那家书店——像小时候会特意绕去的那条巷子。）": "(You've picked up a new habit in Nicheng: taking the long way home past that bookstore — like the alley you used to detour to as a child.)",
    "（你在霓城养成了新的习惯：下班绕远路。有时你会在那家书店的橱窗前，做一会儿白日梦。）": "(You've picked up a new habit in Nicheng: taking the long way home. Sometimes you stop by the bookstore window and daydream a while.)",
    "（你在霓城养成了新的习惯：下班绕远路——好几次刚好赶上老板关门前熄灭的最后一盏灯。）": "(You've picked up a new habit in Nicheng: taking the long way home — several times you catch the last lamp going out before the owner closes.)",
    "（来霓城三周。有些事你以前觉得做不到，现在做起来，像早就习惯了。）": "(Three weeks in Nicheng. Things you once thought impossible now feel like habits.)",
    "（来霓城三周。你把住的地方收拾利落，日程排得明白——一个人也把日子过得像样。）": "(Three weeks in Nicheng. You keep your place tidy and your schedule clear — living well on your own.)",
    "（来霓城三周。回头看，当初那个\"要不要留下来\"的犹豫，好像是别人替你做的决定。）": "(Three weeks in Nicheng. Looking back, that hesitation over \"should I stay\" feels like a decision someone else made for you.)"
  });
})();

/* ===== i18n/story-en-translations-7.js ===== */
/* ===== 霓虹心事 · 剧情文本英译包（day6-7 节奏补齐，v0.9.5）===== */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = window.I18N_PACKS['en-US'] || {};
  Object.assign(window.I18N_PACKS['en-US'], {
    "雨停了，霓城像被擦过一遍。今天想干点什么？": "The rain stopped — Nicheng looks wiped clean. What do you feel like doing today?",
    "周六，难得放晴。": "Saturday, and the sky has finally cleared.",
    "去江边走": "Walk by the river",
    "（江风把云推得很低。你走了很久，没看手机。）": "(The river wind presses the clouds low. You walk a long time without checking your phone.)",
    "在家补觉": "Catch up on sleep",
    "（你睡到下午。醒来时，窗外的光换了角度。）": "(You sleep until afternoon. When you wake, the light outside has shifted.)",
    "（江边有人在放风筝。线很长，风筝很小。）": "(Someone is flying a kite by the river. The string is long; the kite is small.)",
    "（梦里也有一扇窗。醒来时，你不记得窗外是什么。）": "(There was a window in the dream too. When you wake, you can't remember what was outside.)",
    "档案室有一批旧展资料，我翻了半天没找到那份。你要是没事——来帮我一起？": "There's a batch of old exhibition files in the archive. I've been searching and can't find the one I need. If you're free — come help?",
    "档案室的灯是暖色的。": "The archive lights are warm.",
    "帮他找": "Help him search",
    "（你们并肩翻资料。他的袖子蹭到你的手背，谁都没躲。）": "(You leaf through files side by side. His sleeve brushes the back of your hand; neither of you pulls away.)",
    "让他自己来": "Let him handle it",
    "（你回了一句\"加油\"。半小时后，他发来照片：找到了。）": "(You reply \"good luck\". Half an hour later he sends a photo: found it.)",
    "找到了。……原来和你的入职档案放在一起。": "Found it. ...It was filed together with your onboarding papers.",
    "找到了。下次不勉强你。": "Found it. I won't push you next time.",
    "冲洗店今天出片。有一卷是那天梧桐路的，你要不要一起去取？": "The photo lab has prints today. One roll is from Wutong Road that day — want to come pick them up?",
    "天色刚暗，店里的红灯亮着。": "Dusk just fell; the red light is on in the shop.",
    "一起去": "Let's go together",
    "（老板把照片推过来。第一张就是你，背对镜头。）": "(The owner slides the prints over. The first one is you, back to the camera.)",
    "改天吧": "Another day",
    "（他一个人去了。回来时说：照片先放我这儿。）": "(He goes alone. When he returns: \"I'll keep the photos for now.\")",
    "这张我留下了。……不是不给你，是还没想好怎么给。": "I'm keeping this one. ...Not that I won't give it to you — I just haven't figured out how.",
    "好。它们跑不掉。": "Okay. They're not going anywhere.",
    "打烊了。今天最后一杯，我给自己调了杯，也顺手给你留了一杯无酒精的。": "Closing time. Last drink of the day — I made one for myself and left a non-alcoholic one for you.",
    "酒吧的灯只剩吧台一盏。": "Only the counter light is left on in the bar.",
    "等他收工": "Wait until he finishes",
    "（他擦杯子的动作很慢。你们谁都没提回家的事。）": "(He wipes the glasses slowly. Neither of you mentions going home.)",
    "先回了": "Head back first",
    "（你走到门口。他在身后说：路上小心。）": "(You reach the door. Behind you he says: \"Take care on the way.\")",
    "这杯叫「散场」。……但今晚我不想散。": "This one's called \"Last Call\". ...But tonight I don't want it to end.",
    "路上小心。杯子我给你留着。": "Take care. I'll keep the glass for you.",
    "一周了。布展的复盘我写了两页，留了一页空白——这一页，想听听你的。": "It's been a week. I wrote two pages of setup review and left one blank — that page should be yours.",
    "一周的第一次复盘。": "The first review of the week.",
    "认真写满": "Fill it seriously",
    "（你写得很慢。他在旁边看，没有催。）": "(You write slowly. He watches beside you and doesn't rush.)",
    "写一句就好": "Just one line",
    "（你只写了一句。他看了很久，把它折好收起来。）": "(You write a single line. He reads it for a long time, folds it, and keeps it.)",
    "……比我预想的多。这一页，我收进档案了。": "...More than I expected. This page goes into the archive.",
    "一句话也够了。有时候一句比一页重。": "One line is enough. Sometimes a line weighs more than a page.",
    "九年前我们也是这么走的，只是那天下雨。要不要再走一次？": "Nine years ago we walked like this too — only it was raining. Want to walk it again?",
    "旧街的路灯比记忆里矮了一点。": "The old street's lamps are a little lower than in memory.",
    "走": "Walk",
    "（你们走到那家关门的文具店。他停下，没说话。）": "(You reach the closed stationery shop. He stops and says nothing.)",
    "今天算了": "Not today",
    "（你站在路口。他把伞撑开，又收起来。）": "(You stand at the crossing. He opens the umbrella, then closes it.)",
    "那年我没敢说的话，今天可以说了吗？": "The words I didn't dare say that year — can I say them today?",
    "没关系。路还在这儿。": "It's okay. The road is still here.",
    "副歌写完了。我在排练室，想让你第一个听——不过你要是不方便，我录下来也行。": "The chorus is done. I'm in the rehearsal room and want you to hear it first — but if it's not convenient, I can record it.",
    "排练室的灯亮着。": "The rehearsal room light is on.",
    "现在去": "I'll come now",
    "（他唱到第二遍才看你。你发现他手心在出汗。）": "(He doesn't look at you until the second pass. You notice his palms are sweating.)",
    "听录音": "Send the recording",
    "（录音里有一段空白。他说，那是留给你的。）": "(There's a blank stretch in the recording. He says it's left for you.)",
    "……唱完了。你觉得，它该叫什么？": "...That's it. What do you think it should be called?",
    "行。空白那段，等你来填。": "Okay. That blank part waits for you."
  });
})();

/* ===== i18n/story-en-translations-8.js ===== */
/* ===== 霓虹心事 · 剧情文本英译包（day8-14 路线专属，v0.9.5）===== */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = window.I18N_PACKS['en-US'] || {};
  Object.assign(window.I18N_PACKS['en-US'], {
    "预展今晚只开给内部。你要不要来？灯还没调完。": "The preview tonight is internal only. Want to come? The lights aren't finished.",
    "展厅的灯只亮了一半。": "Only half the gallery lights are on.",
    "留下来看": "Stay and watch",
    "（空展厅里只有你们两个人。他关掉最后一排灯。）": "(Only the two of you in the empty gallery. He switches off the last row of lights.)",
    "先回家": "Head home first",
    "（你走到地铁口。他发来一张照片：展厅只剩一盏灯。）": "(You reach the subway entrance. He sends a photo: one light left in the gallery.)",
    "灯全关的时候，画反而更清楚。……你也是。": "With all the lights off, the painting is clearer. ...So are you.",
    "那盏灯我留着。下次你来了再关。": "I'll leave that light on. We'll turn it off when you come.",
    "评论家提前到了。我本来打算一个人应付——你如果在，站在我旁边就好。": "The critic arrived early. I planned to handle it alone — if you're here, just stand beside me.",
    "会客室的门开着。": "The reception room door is open.",
    "站他旁边": "Stand beside him",
    "（他介绍你时，语气比平时慢。评论家看了你一眼。）": "(He introduces you more slowly than usual. The critic glances at you.)",
    "让他处理": "Let him handle it",
    "（你留在办公室。半小时后他回来说：谈成了。）": "(You stay in the office. Half an hour later he returns: \"It's settled.\")",
    "他说这个展\"有温度\"。我知道温度是哪儿来的。": "He called the show \"warm\". I know where the warmth comes from.",
    "谈成了。下次这种场合，我还是希望你也在。": "It's settled. Next time, I still hope you'll be there.",
    "有卷底片划伤了。可能是那天赶时间。我想重拍一次，你还愿意当模特吗？": "One roll of film got scratched — maybe we rushed that day. I want to reshoot. Will you model for me again?",
    "暗房的红灯亮着。": "The red light is on in the darkroom.",
    "陪他重拍": "Reshoot with him",
    "（你们拍到天完全黑。他说：这次比上次好。）": "(You shoot until it's completely dark. He says: \"Better than last time.\")",
    "改天吧": "Another day",
    "（他把相机收进包里。划伤的那张，他说留着。）": "(He packs the camera away. The scratched frame, he says, he'll keep.)",
    "同一张脸，第二次拍，感觉不一样。你比第一次放松了。": "The same face, shot a second time, feels different. You're more relaxed than the first time.",
    "划伤的地方像一道闪电。也许它本来就该这样。": "The scratch looks like lightning. Maybe it was meant to be there.",
    "摄影展下周开幕。我留了一张票给你——不是工作票，是私人票。": "My photo show opens next week. I saved a ticket for you — not a work pass, a personal one.",
    "一张票压在相机包上。": "A ticket rests on the camera bag.",
    "去": "Go",
    "（展厅最里面那张，标签上写着你的名字。）": "(The print at the far end of the gallery has your name on its label.)",
    "不去": "Don't go",
    "（他说没关系。后来你收到一本展册，扉页有字。）": "(He says it's fine. Later you receive a catalogue; there's writing on the title page.)",
    "那张照片叫《九年》。你站在它前面的时候，我按下快门了吗？": "That photo is called \"Nine Years\". When you stood in front of it — did I press the shutter?",
    "扉页那句是：给没来的人。": "The line on the title page: for the one who didn't come.",
    "歌词卡在第二段。写不下去。你要不要来听听，顺便告诉我它缺什么？": "The lyrics are stuck on the second verse. I can't go on. Want to come listen and tell me what it's missing?",
    "排练室的窗开着，风把谱子吹起一角。": "The rehearsal room window is open; the wind lifts a corner of the score.",
    "去听": "Go listen",
    "（他唱到卡住的地方停下。你说：缺一句真话。他笑了。）": "(He stops where it gets stuck. You say: \"It's missing one true line.\" He smiles.)",
    "给点建议": "Send a suggestion",
    "（你发了三行字。他回：这句我留着。）": "(You send three lines. He replies: \"I'm keeping this one.\")",
    "真话最难写。……那第二段，就写你刚才那句话。": "The truest lines are the hardest. ...Then the second verse will be what you just said.",
    "三行字，比我一晚上写的都准。": "Three lines from you are more accurate than a whole night of mine.",
    "周五有个小场，唱三首。票不多，给你留了一张。": "There's a small show Friday, three songs. Not many tickets — I saved one for you.",
    "手机里躺着一张电子票。": "An e-ticket sits in your phone.",
    "（台下很挤。他唱到第二首时，看向你这边。）": "(The crowd is packed. Halfway through the second song, he looks your way.)",
    "（演出结束后他发来一段录音：第三首，留给没来的人。）": "(After the show he sends a recording: the third song, for the one who didn't come.)",
    "第二首是《夏》的旧版本。唱到一半我才发现，我在看你。": "The second was an old version of \"Summer\". Halfway through I realized I was looking at you.",
    "第三首没唱。留着，等你在的时候。": "I didn't sing the third. It's saved for when you're there.",
    "（第八天的夜。你给自己买了一束花，插在窗台的玻璃瓶里。）": "(Night of day eight. You buy yourself flowers and put them in a glass bottle on the windowsill.)",
    "最近怎么样？别老一个人待着。周末要不要出来走走？": "How have you been? Don't stay alone all the time. Want to go out this weekend?"
  });
})();

/* ===== i18n/index.js ===== */
/* ===== 霓虹心事 · i18n 框架（v0.3.6 / 计划 B1-a）=====
 * 结构抽取第一步：提供语言包查询与回退，默认中文（zh-CN）。
 * 约定：以「中文原文」为 key；未命中当前语言包时回退返回原文（中文为源，不阻塞运行）。
 * 用法：I18N.translate('壁纸已切换') → 当前语言译文（无译文时返回原文）。
 *       I18N.setLang('en-US') 切换；语言包挂到 window.I18N_PACKS[lang]（见 i18n/zh-CN.js）。
 * 渐进路线：本版先覆盖 UI 固定文案（toast）；story/ 剧情文本较大，后续按需抽取。
 */
(function(){
  'use strict';
  const DEFAULT_LANG = 'zh-CN';
  let currentLang = DEFAULT_LANG;

  function packs(){
    return (typeof window !== 'undefined' && window.I18N_PACKS) || {};
  }
  function translate(text, vars){
    if(text == null) return text;
    const src = String(text);
    const pack = packs()[currentLang] || {};
    let out = Object.prototype.hasOwnProperty.call(pack, src) ? pack[src] : src;
    if(vars){
      out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    }
    return out;
  }
  function setLang(lang){
    currentLang = lang || DEFAULT_LANG;
    try {
      localStorage.setItem('neon_lang', currentLang);
      document.documentElement.lang = currentLang;   // v0.5.3（E4）：css 排版随语言
    } catch(_) {}
    // v0.7.8：静态 HTML 文本（data-i18n 标注）随语言切换刷新，先于 i18nchange 派发
    try { applyStaticI18n(); } catch(_) {}
    // v0.5.4（E4）：通知 UI 重渲染已显示的文本（消息体/选项/图鉴等出口读取时机不同）
    try { window.dispatchEvent(new CustomEvent('i18nchange', {detail: {lang: currentLang}})); } catch(_) {}
  }
  function getLang(){ return currentLang; }
  function availableLangs(){ return Object.keys(packs()); }

  /* ===== v0.7.8：静态 HTML 文本英文化 =====
   * 约定：index.html/privacy.html 中用户可见的静态文本元素标注
   *   data-i18n="中文原文"            → textContent 替换（元素不得含需保留的子元素）
   *   data-i18n-placeholder="原文"    → placeholder 属性替换
   *   data-i18n-title="原文"          → title 属性替换
   *   data-i18n-aria="原文"           → aria-label 属性替换
   * key 与 t() 同机制（中文原文精确匹配、miss 回退原文）；切换语言时由 setLang 调用。
   */
  function applyStaticI18n(root){
    root = root || (typeof document !== 'undefined' ? document : null);
    if(!root || !root.querySelectorAll) return;
    const apply = (sel, fn) => {
      const attr = sel.slice(1, -1);
      root.querySelectorAll(sel).forEach(el => {
        const key = el.getAttribute(attr);
        if(key) fn(el, key);
      });
    };
    apply('[data-i18n]', (el, key) => {
      // 防御：含子元素的元素不做 textContent 替换（会丢结构），此类场景应包一层纯文本 span
      if(el.children.length === 0) el.textContent = translate(key);
    });
    apply('[data-i18n-placeholder]', (el, key) => { el.placeholder = translate(key); });
    apply('[data-i18n-title]', (el, key) => { el.title = translate(key); });
    apply('[data-i18n-aria]', (el, key) => { el.setAttribute('aria-label', translate(key)); });
    // data-i18n-href="zh页|en页"：按语言切换链接目标（privacy 合规文本双页面方案，避免破坏正文结构）
    root.querySelectorAll('[data-i18n-href]').forEach(el => {
      const parts = el.getAttribute('data-i18n-href').split('|');
      if(parts.length === 2) el.href = currentLang === 'en-US' ? parts[1] : parts[0];
    });
  }

  /* ===== v0.7.8：日期标签显示层重拼（存档/快照兼容） =====
   * 备忘录/朋友圈/存档摘要里存的是中文 full 快照（如「7月15日 星期三」），
   * 动态组合无法枚举翻译——显示层解析字段后用模板重拼（同 v0.7.4「中文快照+显示层翻译」）。
   * weekday 以完整词（星期三）为变量值，预先过 t() 再插入模板。
   */
  function localizeDateLabel(full){
    if(!full || typeof full !== 'string') return full;
    const m = full.match(/^(\d{1,2})月(\d{1,2})日(?:\s*星期([一二三四五六日]))?$/);
    if(!m) return full;   // 非标准格式原样返回（如「第3天」）
    const wk = m[3] ? '星期' + m[3] : '';
    if(wk) return translate('{m}月{d}日 {w}', {m: m[1], d: m[2], w: translate(wk)});
    return translate('{m}月{d}日', {m: m[1], d: m[2]});
  }

  const I18N = { translate, setLang, getLang, availableLangs, applyStaticI18n, localizeDateLabel, DEFAULT_LANG };
  if(typeof window !== 'undefined'){ window.I18N = I18N; window.t = translate; window.localizeDateLabel = localizeDateLabel; }
  else if(typeof globalThis !== 'undefined'){ globalThis.I18N = I18N; globalThis.t = translate; globalThis.localizeDateLabel = localizeDateLabel; }
})();

/* ===== story/00_core.js ===== */
/* ===== 霓虹心事 · 剧情数据：核心：STORY 对象与角色表 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */

const STORY = {
  characters: {
    linxia: {name:'林夏', color:'#ff5fa8', avatar:'林', bg:'#5a2a4a'},
    shenyan: {name:'沈砚之', color:'#7a5cff', avatar:'沈', avatarImg:'assets/avatars/shenyan.jpg', avatarThumb:'assets/avatars/thumbs/shenyan.jpg', bg:'#2a2f5a', desc:'美术馆主理人，温柔腹黑'},
    luci: {name:'陆辞', color:'#4ade80', avatar:'陆', avatarImg:'assets/avatars/luci.jpg', avatarThumb:'assets/avatars/thumbs/luci.jpg', bg:'#2a5a3a', desc:'自由摄影师，青梅竹马'},
    jiangyu: {name:'江屿', color:'#c084fc', avatar:'江', avatarImg:'assets/avatars/jiangyu.jpg', avatarThumb:'assets/avatars/thumbs/jiangyu.jpg', bg:'#4a3a5a', desc:'酒吧调酒师，前乐队主唱'},
    susu: {name:'苏苏', color:'#fbbf24', avatar:'苏', avatarImg:'assets/avatars/susu.jpg', avatarThumb:'assets/avatars/thumbs/susu.jpg', bg:'#5a4a1a', desc:'大学闺蜜，八卦王'},
  },
};


/* ===== story/01_events.js ===== */
/* ===== 霓虹心事 · 剧情数据：剧情事件主线（全部 events） =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */


Object.assign(STORY, {

  events: {
    // ===== 序章：抵达霓城 =====
    // v0.6.3：序章节奏——首条延后 1.5s（给"手机响了"的入场停顿），后续链自然拉开
    'intro_susu': {
      type:'message_batch', delay:1.5, collectible:'postcard_neon',
      messages:[
        {from:'susu', text:'林夏！！！你到霓城了吗？？', then:'intro_susu_2'}
      ]
    },
    'intro_susu_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'听说你明天去砚美术馆报到？那里可是出了名的难进！', then:'intro_susu_3'}
      ]
    },
    // v0.1.10: 汇流节点差异化——第一晚的回复不再直连梦境，苏苏的回应因你的选择而不同
    'intro_susu_3': {
      type:'message_batch', delay: 1.2,
      messages:[
        {from:'susu', text:'到了回我一声！别让我担心！', choice:{
          prompt:'苏苏在等你的回复：',
          options:[
            {text:'刚到，累死了，先睡了', effects:{affection:{}, thenEvent:'intro_reply_sleep', personality:{passive:1, emotional:1}}, hint:'入睡 · 梦境'},
            {text:'到了！明天报到，紧张', effects:{affection:{}, thenEvent:'intro_reply_report', personality:{active:1, emotional:1}}, hint:'入睡 · 梦境'},
            {text:'（暂时不回）', effects:{affection:{}, thenEvent:'intro_reply_silent', personality:{independent:1, passive:1}}, hint:'入睡 · 梦境'}
          ]
        }}
      ]
    },
    'intro_reply_sleep': {
      type:'message_batch', delay:1,
      effects:{ flags:{ intro_vibe_sleep: 1 } },
      messages:[
        {from:'susu', text:'晚安！梦里也要替我逛逛霓城哦～'},
        {from:'narrator', text:'（你抱着满身行李箱的味道睡着了。梦里有蝉鸣。）', then:'dream_day1_evt'}
      ]
    },
    'intro_reply_report': {
      type:'message_batch', delay:1,
      effects:{ flags:{ intro_vibe_report: 1 } },
      messages:[
        {from:'susu', text:'紧张什么！你可是我认识的人里最靠谱的！'},
        {from:'susu', text:'明天报到完给我发消息！不许消失！', then:'dream_day1_evt'}
      ]
    },
    'intro_reply_silent': {
      type:'message_batch', delay:1,
      effects:{ flags:{ intro_vibe_silent: 1 } },
      messages:[
        {from:'narrator', text:'（你把手机扣在桌上，没有回。窗外霓城亮得像另一颗星球。）'},
        {from:'narrator', text:'（睡意来得比回复快。）', then:'dream_day1_evt'}
      ]
    },
    // 第一夜梦境（事件包装）
    'dream_day1_evt': { type:'dream', dream:'dream_day1' },

    // ===== 第一天：报到 =====
    'day2_morning': {
      type:'advance_day', text:'次日清晨', hour:8,
      collectible:'stamp_first',  // v0.1.7: 序章完成的唯一发放点（霓城首日戳，与收集柜 how 描述一致）
      then:'shenyan_first_msg'
    },
    'shenyan_first_msg': {
      type:'message_batch', delay:2,
      messages:[
        {from:'shenyan', text:'林夏。我是沈砚之。', then:'shenyan_first_msg_2'}
      ]
    },
    'shenyan_first_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'导师把你的联系方式给我了。九点报到，别迟到。', then:'shenyan_first_msg_3'}
      ]
    },
    'shenyan_first_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'我这个人，最讨厌不守时。', then:'moment_shenyan_opening_evt'}
      ]
    },
    'moment_shenyan_opening_evt': {
      type:'moment_post', moment:'moment_shenyan_opening', collectible:'ticket_gallery',
      then:'luci_reunion_msg'
    },
    // 陆辞的重逢（并发会话）
    'luci_reunion_msg': {
      type:'message_batch', delay:3,
      messages:[
        {from:'luci', text:'诶诶诶！！！林夏是你吗？？？', then:'luci_reunion_msg_2'}
      ]
    },
    'luci_reunion_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'我听说砚美术馆新来个策展人，没想到是你！', then:'luci_reunion_msg_3'}
      ]
    },
    'luci_reunion_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'高中之后多少年没见了？九年？十年？', then:'luci_reunion_msg_4'}
      ]
    },
    // v0.1.10: 汇流节点差异化——陆辞的晚餐邀约，答应与改天各有后续反应
    'luci_reunion_msg_4': {
      type:'message_batch', delay: 0,
      messages:[
        {from:'luci', text:'晚上一起吃饭？我带你认认霓城！', choice:{
          prompt:'陆辞约你晚上吃饭。',
          options:[
            {text:'好啊，下班联系', effects:{affection:{luci:2}, thenEvent:'luci_dinner_yes'}, hint:'陆辞 +2'},
            {text:'今天太累了，下次吧', effects:{affection:{luci:1}, thenEvent:'luci_dinner_next'}, hint:'陆辞 +1（他还是来了）'}
          ]
        }}
      ]
    },
    'luci_dinner_yes': {
      type:'message_batch', delay:1,
      effects:{ flags:{ luci_dinner_yes: 1 } },
      messages:[
        {from:'luci', text:'好！！下班我去美术馆门口接你。'},
        {from:'luci', text:'霓城第一课：别信导航，信我。', then:'bar_invitation'}
      ]
    },
    'luci_dinner_next': {
      type:'message_batch', delay:1,
      effects:{ flags:{ luci_dinner_next: 1 } },
      messages:[
        {from:'luci', text:'……那说好了，下次。'},
        {from:'luci', text:'食堂难吃的话，记得保重胃。别学高中那样啃面包凑合。', then:'bar_invitation'}
      ]
    },

    // 雾港酒吧
    'bar_invitation': {
      type:'advance_time', text:'下班后', minutes:600, collectible:'ticket_bar',
      then:'bar_invitation_msg'
    },
    'bar_invitation_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'下班了吧？来"雾港"，巷子深处那家酒吧', then:'bar_invitation_msg_2'}
      ]
    },
    'bar_invitation_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'我朋友开的，特调全霓城第一', then:'photo_neon_city'}
      ]
    },
    'photo_neon_city': {
      type:'photo_unlock', photo:'neon_city',
      then:'moment_luci_neon_evt'
    },
    'moment_luci_neon_evt': {
      type:'moment_post', moment:'moment_luci_neon',
      then:'jiangyu_first_msg'
    },
    // 江屿登场
    'jiangyu_first_msg': {
      type:'message_batch', delay:3,
      messages:[
        {from:'jiangyu', text:'……', then:'jiangyu_first_msg_2'}
      ]
    },
    'jiangyu_first_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'今天那杯酒，算我请的。我是江屿。', then:'jiangyu_first_msg_3'}
      ]
    },
    'jiangyu_first_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'你叫林夏。', then:'jiangyu_first_msg_4'}
      ]
    },
    // v0.1.10: 汇流节点差异化——是否通过好友申请，他的反应不同（但深夜电话都会来）
    'jiangyu_first_msg_4': {
      type:'message_batch', delay: 1,
      messages:[
        {from:'jiangyu', text:'名字不错。', choice:{
          prompt:'他要加你好友。',
          options:[
            {text:'通过', effects:{affection:{jiangyu:1}, thenEvent:'jiangyu_friend_yes'}, hint:'江屿 +1'},
            {text:'（不通过）', effects:{affection:{jiangyu:0}, thenEvent:'jiangyu_friend_no'}, hint:'他还是会打来'}
          ]
        }}
      ]
    },
    'jiangyu_friend_yes': {
      type:'message_batch', delay:1,
      effects:{ flags:{ jiangyu_friend_yes: 1 } },
      messages:[
        {from:'narrator', text:'（通过好友申请的那一秒，对面就发来一个举杯的表情。）'},
        {from:'jiangyu', text:'雾港见。', then:'jiangyu_call_night'}
      ]
    },
    'jiangyu_friend_no': {
      type:'message_batch', delay:1,
      effects:{ flags:{ jiangyu_friend_no: 1 } },
      messages:[
        {from:'narrator', text:'（你没有通过。手机安静了三分钟，然后又震了一下——第二条好友申请，验证消息写着：）'},
        {from:'jiangyu', text:'不留也行。反正霓城不大。', then:'jiangyu_call_night'}
      ]
    },

    // 江屿来电
    'jiangyu_call_night': {
      type:'call', delay:2,
      from:'jiangyu',
      script:[
        {who:'him', text:'……喂。'},
        {who:'him', text:'我是江屿。今天的酒，味道还好吗。'},
        {who:'choice', options:[
          {text:'好喝。怎么突然打电话？'},
          {text:'还行。有事吗？'}
        ]},
        {who:'him', text:'没什么事。只是想确认一下。'},
        {who:'him', text:'我写过一首歌，叫《夏》。歌词里的人，也叫林夏。'},
        {who:'him', text:'但那是很多年前的事了。别多想。只是巧合。'},
        {who:'choice', options:[
          {text:'真的只是巧合吗？', effects:{affection:{jiangyu:2}}},
          {text:'好。我不问。', effects:{affection:{jiangyu:1}}}
        ]},
        {who:'him', text:'……晚安。'}
      ],
      onDecline:'jiangyu_call_declined',
      then:'music_xia_unlock'
    },
    'jiangyu_call_declined': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'……没事。晚安。'}],
      then:'music_xia_unlock'
    },
    'music_xia_unlock': {
      type:'music_unlock', music:'xia',
      then:'moment_jiangyu_bar_evt'
    },
    'moment_jiangyu_bar_evt': {
      type:'moment_post', moment:'moment_jiangyu_bar',
      then:'dream_day2_evt'
    },
    // 第二夜梦境（事件包装）
    'dream_day2_evt': { type:'dream', dream:'dream_day2' },

    // ===== 第三天：沈砚之的考验 =====
    'day3_shenyan_test': {
      type:'advance_day', text:'第三天', hour:10,
      then:'shenyan_test_msg'
    },
    'shenyan_test_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'来我办公室。', then:'shenyan_test_msg_2'}
      ]
    },
    'shenyan_test_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'下周开幕式，你来盯。', then:'shenyan_test_msg_3'}
      ]
    },
    'shenyan_test_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'你不是说你相信直觉吗。', then:'shenyan_test_choice'}
      ]
    },
    'shenyan_test_choice': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'怎么，不愿意？', choice:{
          prompt:'沈砚之的考验。你的回复：',
          options:[
            {text:'好，我来盯。', effects:{affection:{shenyan:2}, flags:{shenyan_brave:1}, thenEvent:'shenyan_test_reply_1'}, hint:'沈砚之 +2'},
            {text:'我可能还不够资格…', effects:{affection:{shenyan:0}, thenEvent:'shenyan_test_reply_2'}, hint:'沈砚之 +0'},
            {text:'为什么选我？', effects:{affection:{shenyan:1}, thenEvent:'shenyan_test_reply_3'}, hint:'沈砚之 +1'}
          ]
        }}
      ]
    },
    'shenyan_test_reply_1': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'不错。比我想的，要勇敢。明天九点，会议室见。'}],
      then:'luci_care_msg'
    },
    'shenyan_test_reply_2': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'是吗。那就算了。我自己来。'}],
      then:'luci_care_msg'
    },
    'shenyan_test_reply_3': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'因为你不会问"为什么"。结果你问了。不过没关系。'}],
      then:'luci_care_msg'
    },

    // 陆辞的关心
    'luci_care_msg': {
      type:'message_batch', delay:3,
      messages:[
        {from:'luci', text:'听说你被沈砚之点名盯开幕式了？', then:'luci_care_msg_2'}
      ]
    },
    'luci_care_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'那家伙……你离他远点。', choice:{
          prompt:'陆辞的话里似乎有别的意思。',
          options:[
            {text:'你说"离他远点"是什么意思？', effects:{affection:{luci:2}, thenEvent:'luci_care_reply_1'}, hint:'陆辞 +2'},
            {text:'谢谢你啦，我会注意的', effects:{affection:{luci:1}, thenEvent:'luci_care_reply_2'}, hint:'陆辞 +1'}
          ]
        }}
      ]
    },
    'luci_care_reply_1': {
      type:'message_batch', delay:1,
      messages:[{from:'luci', text:'我之前给他拍过封面。他看人的眼神，像在估价。我不希望你被他那样看。'}],
      then:'dream_day3_evt'
    },
    'luci_care_reply_2': {
      type:'message_batch', delay:1,
      messages:[{from:'luci', text:'嗯……有什么事，随时找我。'}],
      then:'dream_day3_evt'
    },
    // 第三夜梦境（事件包装）
    'dream_day3_evt': { type:'dream', dream:'dream_day3' },

    // ===== 开幕式当天 =====
    'opening_day': {
      type:'advance_day', text:'开幕式当天', hour:18,
      then:'opening_shenyan_msg'
    },
    'opening_shenyan_msg': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'林夏，开幕式还有一小时开始。你来一下展厅。', then:'moment_shenyan_opening_day_evt'}]
    },
    'moment_shenyan_opening_day_evt': {
      type:'moment_post', moment:'moment_shenyan_opening_day',
      then:'opening_tension'
    },
    'opening_tension': {
      type:'message_batch', delay:3,
      messages:[
        {from:'luci', text:'林夏，给你拍张工作照？', choice:{
          prompt:'两个男人之间的气氛微妙。',
          options:[
            {text:'陪沈砚之应酬', effects:{affection:{shenyan:2}, thenEvent:'opening_choice_shenyan'}, hint:'沈砚之 +2'},
            {text:'陪陆辞拍照', effects:{affection:{luci:2}, thenEvent:'opening_choice_luci'}, hint:'陆辞 +2'},
            {text:'借口去后台', effects:{affection:{}, thenEvent:'opening_choice_neutral'}, hint:'保持中立'}
          ]
        }}
      ]
    },
    // v0.1.9: 三分支差异化——开幕夜选择不再直接汇流，各插入一段"同行去天台"的专属过渡
    // （shenyan/luci/neutral 三条路径各有一段独有剧情与 flag，之后仍汇流到天台主线）
    'opening_choice_shenyan': {
      type:'message_batch', delay:1,
      effects:{ flags:{ opening_vibe_shenyan: 1 } },
      messages:[
        {from:'shenyan', text:'走吧，给你介绍几个人。', then:'opening_walk_shenyan'}
      ]
    },
    'opening_choice_luci': {
      type:'message_batch', delay:1,
      effects:{ flags:{ opening_vibe_luci: 1 } },
      messages:[
        {from:'luci', text:'看这边——笑一个。你笑起来，比那幅画好看多了。', then:'opening_walk_luci'}
      ]
    },
    'opening_choice_neutral': {
      type:'message_batch', delay:1,
      effects:{ flags:{ opening_vibe_neutral: 1 } },
      messages:[
        {from:'narrator', text:'（你借口去后台，留下两个男人意味深长的沉默。）', then:'opening_walk_neutral'}
      ]
    },
    'opening_walk_shenyan': {
      type:'message_batch', delay:1,
      messages:[
        {from:'narrator', text:'（沈砚之走在你左侧，步子不快，替你挡开举着相机的人群。）'},
        {from:'shenyan', text:'介绍就免了。他们的画会替自己说话。', then:'opening_walk_shenyan_2'}
      ]
    },
    'opening_walk_shenyan_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'天台有个陌生人，不归我管。', then:'rooftop_jiangyu'}
      ]
    },
    'opening_walk_luci': {
      type:'message_batch', delay:1,
      messages:[
        {from:'narrator', text:'（陆辞半跑着在前面带路，像高中放学时那样回头喊你跟上。）'},
        {from:'luci', text:'天台！我刚才踩过点了，视野最好——咳，不是，我什么都还没喝。', then:'opening_walk_luci_2'}
      ]
    },
    'opening_walk_luci_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'……上面那个人看你的眼神有点复杂。认识的朋友？', then:'rooftop_jiangyu'}
      ]
    },
    'opening_walk_neutral': {
      type:'message_batch', delay:1,
      messages:[
        {from:'narrator', text:'（你自己穿过人群，在通往天台的楼梯口遇到一个刚抽完烟的人。他掐了烟，侧身让你先走。）'},
        {from:'narrator', text:'（酒气混着夜风。他跟在你后面上了楼，谁也没说话。）', then:'rooftop_jiangyu'}
      ]
    },

    // 天台
    'rooftop_jiangyu': {
      type:'advance_time', text:'夜深了', minutes:240,
      then:'rooftop_jiangyu_msg'
    },
    'rooftop_jiangyu_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'你在天台吗。', then:'rooftop_jiangyu_msg_2'}
      ]
    },
    'rooftop_jiangyu_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'我也在。今天累吧。', then:'rooftop_jiangyu_msg_3'}
      ]
    },
    'rooftop_jiangyu_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'累的时候，适合看灯。霓城的夜，像谁的心事，亮着却没人懂。', choice:{
          prompt:'夜风里，你的心跳漏了一拍。',
          options:[
            {text:'靠近他一点', effects:{affection:{jiangyu:2}, thenEvent:'rooftop_jiangyu_close'}, hint:'江屿 +2'},
            {text:'礼貌保持距离', effects:{affection:{jiangyu:0}, thenEvent:'rooftop_jiangyu_distanced'}, hint:'江屿 +0'}
          ]
        }}
      ]
    },
    'rooftop_jiangyu_close': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'你这个人，总让人想靠近。'}],
      then:'photo_rooftop'
    },
    'rooftop_jiangyu_distanced': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'……早点回去休息。'}],
      then:'photo_rooftop'
    },
    'photo_rooftop': {
      type:'photo_unlock', photo:'rooftop_night',
      then:'route_choice_night'
    },

    // ===== 路线选择之夜 =====
    'route_choice_night': {
      type:'advance_day', text:'一个无眠的夜晚', hour:23,
      then:'route_choice_msgs'
    },
    'route_choice_msgs': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'早些休息。'},
        {from:'luci', text:'今天谢谢你。晚安。'},
        {from:'jiangyu', text:'……'},
        {from:'narrator', text:'（三个人同时发来消息。你回谁，将决定你的心属于谁。）'}
      ],
      then:'route_choice_trigger'
    },
    'route_choice_trigger': {
      type:'route_choice'
    },

    // ===== 沈砚之线 =====
    'route_shenyan_start': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'明天来办公室。有个出差，跟我一起去南方。', then:'route_shenyan_start_2'}]
    },
    'route_shenyan_start_2': {
      type:'message_batch', delay:0,
      messages:[{from:'shenyan', text:'别人我不放心。', then:'route_shenyan_south'}]
    },
    'route_shenyan_south': {
      type:'advance_day', text:'南方出差', hour:20, collectible:'postcard_sea',
      // v0.1.6: 补上 flag 写入，否则「海雾」主题（themes.sea）永远无法解锁
      effects:{ flags:{ shenyan_south:true } },
      then:'route_shenyan_dinner'
    },
    'route_shenyan_dinner': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'这位是周先生。林夏，我新来的策展人。', then:'route_shenyan_dinner_2'}
      ]
    },
    'route_shenyan_dinner_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'narrator', text:'（他介绍你时，像在介绍一件作品。你感到不适。）', choice:{
          prompt:'晚宴上你感到被"展示"。',
          options:[
            {text:'配合他，回去再说', effects:{affection:{shenyan:1}, flags:{shenyan_obey:1}, thenEvent:'route_shenyan_rain'}, hint:'向 BAD END'},
            {text:'当场夺回主动', effects:{affection:{shenyan:2}, flags:{shenyan_resist:1}, thenEvent:'route_shenyan_rain'}, hint:'向 GOOD END'}
          ]
        }}
      ]
    },
    'route_shenyan_rain': {
      type:'advance_time', text:'雨夜回程', minutes:180,
      then:'route_shenyan_rain_msg'
    },
    'route_shenyan_rain_msg': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'对不起。我忘了你不是我。家里逼我活成一个"沈砚之"。只有遇见你时，我才是我自己。', then:'route_shenyan_control'}]
    },
    'route_shenyan_control': {
      type:'advance_day', text:'半个月后', hour:9,
      then:'route_shenyan_control_msg'
    },
    'route_shenyan_control_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'今天别穿白衬衫，不适合你。', then:'route_shenyan_control_msg_2'}
      ]
    },
    'route_shenyan_control_msg_2': {
      type:'message_batch', delay:2,
      messages:[
        {from:'luci', text:'林夏！你最近怎么了？我给你打了五个电话，都是沈砚之接的。', then:'route_shenyan_control_msg_3'}
      ]
    },
    'route_shenyan_control_msg_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'他说你忙。可你根本没收到过那些电话，对吧？', choice:{
          prompt:'你意识到沈砚之在替你"过滤"外界。',
          options:[
            {text:'立刻去找陆辞问清楚', effects:{affection:{}, flags:{shenyan_awaken:1}, thenEvent:'route_shenyan_cafe'}, hint:'决心破局'},
            {text:'替沈砚之解释', effects:{affection:{}, flags:{shenyan_deny:1}, thenEvent:'route_shenyan_end_check'}, hint:'滑向 BAD END'}
          ]
        }}
      ]
    },
    'route_shenyan_cafe': {
      type:'message_batch', delay:1,
      messages:[{from:'luci', text:'无论你选谁，都不能选一个让你"消失"的人。', then:'route_shenyan_end_check'}]
    },
    'route_shenyan_end_check': {
      type:'message_batch', delay:2,
      messages:[
        {from:'narrator', text:'（你意识到这段关系出了问题。你的选择是？）', choice:{
          prompt:'你的最后抉择：',
          options:[
            {text:'和他正面对峙', effects:{affection:{}, flags:{shenyan_choice:'confront'}, thenEvent:'__shenyan_end_judge'}, hint:'决心破局'},
            {text:'默默忍受', effects:{affection:{}, flags:{shenyan_choice:'endure'}, thenEvent:'__shenyan_end_judge'}, hint:'滑向 BAD END'}
          ]
        }}
      ]
    },
    // 结局判定：累积 flag 决定走向，最终选择作为修正
    '__shenyan_end_judge': {
      type:'ending', delay:0,
      _compute: s => STORY.computeEnding(s, 'shenyan')
    },
    'ending_shenyan_good': { type:'ending', ending:'shenyan_good' },
    'ending_shenyan_bad': { type:'ending', ending:'shenyan_bad' },

    // ===== 陆辞线 =====
    'route_luci_start': {
      type:'message_batch', delay:1, collectible:'memento_camera',
      messages:[{from:'luci', text:'明天周末，带你重走一遍我们以前的学校？往返四小时，赶得及吃晚饭。', then:'route_luci_school'}]
    },
    'route_luci_school': {
      type:'advance_day', text:'母校之行', hour:19, collectible:'postcard_school',
      then:'route_luci_rooftop'
    },
    'route_luci_rooftop': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'就是这儿。高二那年，被人堵的就是这里。是你把我拉出来的。', then:'route_luci_rooftop_2'}
      ]
    },
    'route_luci_rooftop_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'从那天起，我就告诉自己，要变强。强到，可以站到你身边。', then:'route_luci_rooftop_3'}
      ]
    },
    'route_luci_rooftop_3': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'林夏，有句话我憋了九年。我喜欢你。从高一你借我橡皮那天，到现在。', choice:{
          prompt:'他说出口了。',
          options:[
            {text:'让他继续说', effects:{affection:{luci:2}, flags:{luci_confess:1}, thenEvent:'route_luci_after_confess'}, hint:'向 GOOD END'},
            {text:'岔开话题', effects:{affection:{luci:1}, flags:{luci_avoid:1}, thenEvent:'route_luci_after_confess'}, hint:'向 BAD END'}
          ]
        }}
      ]
    },
    'route_luci_after_confess': {
      type:'advance_day', text:'此后的日子', hour:10,
      then:'route_luci_album'
    },
    'route_luci_album': {
      type:'photo_unlock', photo:'luci_album',
      then:'route_luci_milan'
    },
    'route_luci_milan': {
      type:'message_batch', delay:2,
      messages:[
        {from:'luci', text:'林夏，米兰那边的工作室邀我过去驻半年。下个月的飞机。', then:'route_luci_milan_2'}
      ]
    },
    'route_luci_milan_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'你不用回答我。我只是……来道个别。', choice:{
          prompt:'他就要走了。',
          options:[
            {text:'喊住他，不让他走', effects:{affection:{}, flags:{luci_stop:1}, thenEvent:'route_luci_chase_rain'}},
            {text:'看着他离开', effects:{affection:{}, flags:{luci_letgo:1}, thenEvent:'route_luci_rain_night'}}
          ]
        }}
      ]
    },
    'route_luci_chase_rain': {
      type:'message_batch', delay:1,
      messages:[{from:'luci', text:'……你来了。'}],
      then:'route_luci_end_check'
    },
    'route_luci_rain_night': {
      type:'advance_time', text:'雨夜', minutes:120,
      then:'route_luci_ticket'
    },
    'route_luci_ticket': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'（信封里是一张去米兰的机票，名字写着：林夏。背面：如果你愿意，我们一起走。）', choice:{
          prompt:'雨水模糊了视线。',
          options:[
            {text:'追去他家', effects:{affection:{}, flags:{luci_chase:1}, thenEvent:'route_luci_end_check'}},
            {text:'站在雨里直到天亮', effects:{affection:{}, flags:{luci_giveup:1}, thenEvent:'route_luci_end_check'}}
          ]
        }}
      ]
    },
    'route_luci_end_check': {
      type:'message_batch', delay:2,
      messages:[
        {from:'narrator', text:'（看到他藏了九年的心意。你的选择是？）', choice:{
          prompt:'你的最后抉择：',
          options:[
            {text:'去找他，回应他', effects:{affection:{}, flags:{luci_choice:'accept'}, thenEvent:'__luci_end_judge'}, hint:'向 GOOD END'},
            {text:'错过时机', effects:{affection:{}, flags:{luci_choice:'miss'}, thenEvent:'__luci_end_judge'}, hint:'向 BAD END'}
          ]
        }}
      ]
    },
    '__luci_end_judge': {
      type:'ending', delay:0,
      _compute: s => STORY.computeEnding(s, 'luci')
    },
    'ending_luci_good': { type:'ending', ending:'luci_good' },
    'ending_luci_bad': { type:'ending', ending:'luci_bad' },

    // ===== 江屿线 =====
    'route_jiangyu_start': {
      type:'message_batch', delay:1, collectible:'recording_xia',
      messages:[{from:'jiangyu', text:'今晚来雾港。想跟你说说话。', then:'route_jiangyu_sister'}]
    },
    'route_jiangyu_sister': {
      type:'advance_day', text:'几天后', hour:9,
      then:'route_jiangyu_grave_msg'
    },
    'route_jiangyu_grave_msg': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'今天，能陪我去个地方吗。', then:'route_jiangyu_grave'}]
    },
    'route_jiangyu_grave': {
      type:'advance_time', text:'墓园', minutes:120,
      then:'route_jiangyu_grave_2'
    },
    'route_jiangyu_grave_2': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'我妹妹，也叫林夏。十四年前的夏天，白血病。小夏，哥带了个人来看你。她跟你一样倔。', then:'route_jiangyu_death_anniv'}]
    },
    'route_jiangyu_death_anniv': {
      type:'advance_day', text:'鼓手忌日', hour:23,
      then:'route_jiangyu_breakdown'
    },
    'route_jiangyu_breakdown': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'三年了。我一闭上眼，就看见他笑着回头跟我说："江屿，最后一首了！"', then:'route_jiangyu_breakdown_2'}
      ]
    },
    'route_jiangyu_breakdown_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'我活着，有什么用。', choice:{
          prompt:'他在崩溃的边缘。',
          options:[
            {text:'抱住他，什么都不说', effects:{affection:{jiangyu:2}, flags:{jiangyu_hold:1}, thenEvent:'route_jiangyu_relic'}, hint:'向 GOOD END'},
            {text:'让他一个人静一静', effects:{affection:{jiangyu:1}, flags:{jiangyu_leave:1}, thenEvent:'route_jiangyu_relic'}, hint:'向 BAD END'}
          ]
        }}
      ]
    },
    'route_jiangyu_relic': {
      type:'advance_day', text:'三天后', hour:14,
      then:'route_jiangyu_relic_msg'
    },
    'route_jiangyu_relic_msg': {
      type:'message_batch', delay:1,
      messages:[{from:'jiangyu', text:'整理阿哲的遗物时，发现他没写完的副歌。我想把它写完。可我每次写到副歌，就写不下去。', then:'route_jiangyu_show'}]
    },
    'route_jiangyu_show': {
      type:'advance_day', text:'一个月后', hour:21, collectible:'evidence_photo',
      then:'route_jiangyu_show_msg'
    },
    'route_jiangyu_show_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'今晚雾港，我想试试登台。只请了你一个人。', then:'route_jiangyu_show_msg_2'}
      ]
    },
    'route_jiangyu_show_msg_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'我可能唱不完。但我想试。', choice:{
          prompt:'他唱到副歌前，停了。',
          options:[
            {text:'站起来，走到台前', effects:{affection:{}, flags:{jiangyu_stand:1}, thenEvent:'route_jiangyu_end_check'}},
            {text:'安静等他自己开口', effects:{affection:{}, flags:{jiangyu_silent:1}, thenEvent:'route_jiangyu_end_check'}}
          ]
        }}
      ]
    },
    'route_jiangyu_end_check': {
      type:'message_batch', delay:2,
      messages:[
        {from:'narrator', text:'（你看到他在泥潭里挣扎。你的选择是？）', choice:{
          prompt:'你的最后抉择：',
          options:[
            {text:'陪他一起写完那首歌', effects:{affection:{}, flags:{jiangyu_choice:'stay'}, thenEvent:'__jiangyu_end_judge'}, hint:'向 GOOD END'},
            {text:'让他独自面对过去', effects:{affection:{}, flags:{jiangyu_choice:'leave'}, thenEvent:'__jiangyu_end_judge'}, hint:'向 BAD END'}
          ]
        }}
      ]
    },
    '__jiangyu_end_judge': {
      type:'ending', delay:0,
      _compute: s => STORY.computeEnding(s, 'jiangyu')
    },
    'ending_jiangyu_good': { type:'ending', ending:'jiangyu_good' },
    'ending_jiangyu_bad': { type:'ending', ending:'jiangyu_bad' },

    // ===== 真结局线 =====
    'route_solo_start': {
      type:'message_batch', delay:1,
      messages:[
        {from:'narrator', text:'（你把手机扣在桌上，谁都没回。今天，太累了。）'}
      ],
      then:'route_solo_day2'
    },
    'route_solo_day2': {
      type:'advance_day', text:'第二天', hour:10,
      then:'route_solo_day2_msg'
    },
    'route_solo_day2_msg': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'昨晚的消息，你没回。'},
        {from:'luci', text:'林夏，昨晚……没事吧？'},
        {from:'jiangyu', text:'睡不着的时候，喝这个。不用回。（附一张"夏"特调的图）'}
      ],
      then:'route_solo_work'
    },
    'route_solo_work': {
      type:'advance_day', text:'一个月后', hour:3,
      then:'route_solo_work_msg'
    },
    'route_solo_work_msg': {
      type:'message_batch', delay:1,
      messages:[{from:'shenyan', text:'你这种拼命法，是想让我心疼，还是想让我心疼死。', then:'route_solo_help'}]
    },
    'route_solo_help': {
      type:'advance_day', text:'开幕前一周', hour:19,
      then:'route_solo_help_msgs'
    },
    'route_solo_help_msgs': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'夜景素材，不要钱，只想帮你。'},
        {from:'jiangyu', text:'展厅背景音，我重新编的简版。你挑挑。'},
        {from:'shenyan', text:'不用谢。这是你应得的。'}
      ],
      then:'route_solo_end_choice'
    },
    'route_solo_end_choice': {
      type:'message_batch', delay:2,
      messages:[
        {from:'narrator', text:'（三个人都在等你。你的回应是？）', choice:{
          prompt:'你的最后抉择：',
          options:[
            {text:'感谢，但婉拒所有暧昧', effects:{affection:{}, flags:{solo_independent:1}, thenEvent:'ending_true'}},
            {text:'接受帮助，保持距离', effects:{affection:{}, flags:{solo_accept:1}, thenEvent:'ending_true'}}
          ]
        }}
      ]
    },
    'ending_true': { type:'ending', _compute: s => STORY.computeEnding(s, 'solo') },

    // ===== v0.1.7: 幽灵消息彩蛋（egg_ghost_msg 的达成条件） =====
    // 第 4 天凌晨 2 点送达——一条迟到五年的消息。advanceToNextDay 现在会补查睡眠跨过的中间小时，
    // 所以无论玩家当晚几点睡下都能收到。
    'ghost_msg_5y': {
      type:'message_batch', delay:0,
      trigger:{ day:4, hour:2 },
      effects:{ flags:{ ghost_msg_triggered:true } },
      messages:[
        {from:'luci', text:'……睡了吗？', then:'ghost_msg_5y_2'}
      ]
    },
    'ghost_msg_5y_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'翻旧手机，翻到五年前的一条草稿。打了很长，一直没敢发。', then:'ghost_msg_5y_3'}
      ]
    },
    'ghost_msg_5y_3': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'"今天你回头笑的样子，像整个夏天。"', then:'ghost_msg_5y_4'}
      ]
    },
    'ghost_msg_5y_4': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'迟到了五年的晚安。快睡吧，明天还要去美术馆报到。'}
      ]
    },

    // ===== v0.1.10: 暧昧度分项——深夜心动独白（tension≥10 时 23 点后触发，每角色一次） =====
    'tension_whisper_shenyan': {
      type:'message_batch', delay:0,
      effects:{ flags:{ whisper_shenyan_done: 1 } },
      messages:[
        {from:'shenyan', text:'还没睡。'},
        {from:'shenyan', text:'……美术馆的灯，替你留了一盏。'}
      ]
    },
    'tension_whisper_luci': {
      type:'message_batch', delay:0,
      effects:{ flags:{ whisper_luci_done: 1 } },
      messages:[
        {from:'luci', text:'想你想到睡不着，很幼稚吧。'},
        {from:'luci', text:'——当我没发。快睡。'}
      ]
    },
    'tension_whisper_jiangyu': {
      type:'message_batch', delay:0,
      effects:{ flags:{ whisper_jiangyu_done: 1 } },
      messages:[
        {from:'jiangyu', text:'新写的旋律，还差一句词。'},
        {from:'jiangyu', text:'词是：「深夜的风把你吹进我梦里」。睡觉。'}
      ]
    },

    // ===== v0.5.0（E3 周目）：二周目变体——引擎对 <id>_ng2 自动改道，此处只放数据 =====
    'intro_susu_ng2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'又来霓城了？这次可看仔细点哦——有些东西，第一次会错过。', then:'intro_susu_ng2_2'}
      ]
    },
    'intro_susu_ng2_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'susu', text:'（她的语气像在打趣一个老朋友。也许，本来就是。）', then:'intro_susu_2'}
      ]
    },
    'shenyan_first_msg_ng2': {
      type:'message_batch', delay:2,
      messages:[
        {from:'shenyan', text:'林夏。我是沈砚之。', then:'shenyan_first_msg_ng2_2'}
      ]
    },
    'shenyan_first_msg_ng2_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'shenyan', text:'……感觉像是第三次自我介绍。抱歉，我最近总想起一些没道理的事。', then:'shenyan_first_msg_2'}
      ]
    },
    'luci_reunion_msg_ng2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'听说你回霓城了！', then:'luci_reunion_msg_ng2_2'}
      ]
    },
    'luci_reunion_msg_ng2_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'这次换我先到校门口。九年的事，我们边走边说。', then:'luci_reunion_msg_3'}
      ]
    },
    'jiangyu_first_msg_ng2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'名字不错。', then:'jiangyu_first_msg_ng2_2'}
      ]
    },
    'jiangyu_first_msg_ng2_2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'（他盯着好友申请看了很久，像在确认什么。）——这次，换我先开口。', then:'jiangyu_first_msg_3'}
      ]
    },

    // ===== v0.5.0（E3 周目）：真结局二周目尾声——「霓城无事」之后的一周（checkTrueEndingEpilogue 派发） =====
    'true_ending_epilogue': {
      type:'message_batch', delay:0,
      messages:[
        {from:'narrator', text:'（独立策展落地后的第一个周一。霓城照常醒来，你也是。）', then:'true_ending_epilogue_2'}
      ]
    },
    'true_ending_epilogue_2': {
      type:'message_batch', delay:2,
      messages:[
        {from:'shenyan', text:'新展的名字定了：《无事》。第一个展签，留给你写。'},
        {from:'luci', text:'[图片] 清晨的校门口。银杏第一次结了果——九年，值得。'},
        {from:'jiangyu', text:'《夏》的完整版录好了。这次，B面不是空白。'},
        {from:'susu', text:'（本群永久置顶：夏夏的幸福进度——已完结，撒花！）'}
      ]
    },

    // ===== v0.6.1（G2）：新曲解锁链 =====
    'music_wu_unlock':   { type:'music_unlock', music:'wu' },
    'music_hai_unlock':  { type:'music_unlock', music:'hai' },
    'music_bside_unlock':{ type:'music_unlock', music:'bside' },
    // 《灯》：天台照片解锁后的第二天，苏苏转来你那晚哼的调子（她自己录的）
    'music_deng_unlock': {
      type:'message_batch', delay:0,
      trigger:{ day:6, hour:12 },
      messages:[
        {from:'susu', text:'夏夏！天台那晚你哼的那个调子，我录下来了发给小杨——他编成完整的一段！'}
      ],
      then:'music_deng_grant'
    },
    'music_deng_grant': { type:'music_unlock', music:'deng' },

    // ===== v0.7.1：二周目变体补齐——三条线的中段情感节点（此前每线仅 1 个变体） =====
    // 陆辞「米兰道别」（原：你不用回答我。我只是……来道个别。）
    'route_luci_milan_2_ng2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'你不用回答我。上一次，我就这样说了然后真的走了。', then:'route_luci_milan_2_ng2_2'}
      ]
    },
    'route_luci_milan_2_ng2_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'这一次我把话说完：机票我买了，但退掉的手续费我也查好了。所以——你只要说一个字，我就不上那班飞机。', choice:{
          prompt:'他把选择权交给你的第二次。',
          options:[
            {text:'喊住他，不让他走', effects:{affection:{luci:2}, thenEvent:'route_luci_chase_rain'}, hint:'向 GOOD END'},
            {text:'看着他离开', effects:{affection:{luci:1}, thenEvent:'route_luci_rain_night'}, hint:'向 BAD END'}
          ]
        }}
      ]
    },
    // 江屿「试登台」（原：我可能唱不完。但我想试。）
    'route_jiangyu_show_msg_2_ng2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'我可能唱不完。但我想试。……上一次我也是这么说的。', then:'route_jiangyu_show_msg_2_ng2_2'}
      ]
    },
    'route_jiangyu_show_msg_2_ng2_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'上一次我停在副歌前。这一次我想知道，如果知道你在台下，我能不能唱完。', choice:{
          prompt:'同一个舞台，第二次。',
          options:[
            {text:'站起来，走到台前', effects:{affection:{jiangyu:2}, flags:{jiangyu_stand:1}, thenEvent:'route_jiangyu_end_check'}, hint:'向 GOOD END'},
            {text:'安静等他自己开口', effects:{affection:{jiangyu:1}, flags:{jiangyu_silent:1}, thenEvent:'route_jiangyu_end_check'}, hint:'向 BAD END'}
          ]
        }}
      ]
    },
    // 沈砚之「朋友的警告」（原：他说你忙。可你根本没收到过那些电话，对吧？）
    'route_shenyan_control_msg_3_ng2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'他说你忙。可你根本没收到过那些电话，对吧？……这话我上一次也说过。', then:'route_shenyan_control_msg_3_ng2_2'}
      ]
    },
    'route_shenyan_control_msg_3_ng2_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'上一次你选择替沈砚之解释，然后我沉默了九年。这一次——我不问对错了，只问你还想不想被人替他"过滤"掉。', choice:{
          prompt:'同一个问题，第二次。',
          options:[
            {text:'立刻去找陆辞问清楚', effects:{affection:{luci:2}, thenEvent:'route_shenyan_cafe'}, hint:'追查真相'},
            {text:'替沈砚之解释', effects:{affection:{luci:1}, thenEvent:'route_shenyan_end_check'}, hint:'继续相信他'}
          ]
        }}
      ]
    },

    // ===== v0.8.5（H4）：三线 day7-14 日常纵深——每线 6 条专属日常消息 =====
    // -- 沈砚之线 --
    'sy_d7_late': {
      type:'message_batch', delay:0, trigger:{day:7, hour:22},
      messages:[
        {from:'shenyan', text:'还在整理展签？', choice:{
          prompt:'深夜的展厅只剩你一人。',
          options:[
            {text:'马上就走', effects:{affection:{shenyan:1}, personality:{independent:1}}},
            {text:'再等五分钟', effects:{affection:{shenyan:2}, personality:{passive:1}}}
          ]
        }}
      ]
    },
    'sy_d8_coffee': {
      type:'message_batch', delay:0, trigger:{day:8, hour:14},
      messages:[
        {from:'shenyan', text:'你桌上的咖啡凉了。我替你换了一杯。'},
        {from:'shenyan', text:'不用谢。路过。'}
      ]
    },
    'sy_d9_rain': {
      type:'message_batch', delay:0, trigger:{day:9, hour:18},
      messages:[
        {from:'shenyan', text:'下雨了。你带伞了吗。', choice:{
          prompt:'他的语气像在陈述一个事实。',
          options:[
            {text:'没带，正在等雨停', effects:{affection:{shenyan:2}, thenEvent:'sy_d9_rain_pick'}},
            {text:'带了，谢谢关心', effects:{affection:{shenyan:1}, personality:{rational:1}}}
          ]
        }}
      ]
    },
    'sy_d9_rain_pick': {
      type:'message_batch', delay:2,
      messages:[{from:'shenyan', text:'展厅门口。等你。'}]
    },
    'sy_d11_sketch': {
      type:'message_batch', delay:0, trigger:{day:11, hour:20},
      messages:[
        {from:'shenyan', text:'今天画的速写，模特是自己。', choice:{
          prompt:'他很少主动提起自己的画。',
          options:[
            {text:'能看看吗？', effects:{affection:{shenyan:2}, personality:{emotional:1}}},
            {text:'画得像你本人吗？', effects:{affection:{shenyan:1}, personality:{active:1}}}
          ]
        }}
      ]
    },
    'sy_d13_archive': {
      type:'message_batch', delay:0, trigger:{day:13, hour:16},
      messages:[
        {from:'shenyan', text:'档案室整理完了。比预想的快。'},
        {from:'shenyan', text:'……你不在的时候，安静得有点过分。'}
      ]
    },
    // -- 陆辞线 --
    'lc_d7_film': {
      type:'message_batch', delay:0, trigger:{day:7, hour:13},
      messages:[
        {from:'luci', text:'[图片] 今天扫街拍的。猜猜这是哪条路。', choice:{
          prompt:'照片里的路被夕阳染成橘色。',
          options:[
            {text:'城南那条梧桐路？', effects:{affection:{luci:2}, personality:{rational:1}}},
            {text:'不知道，带我去看看？', effects:{affection:{luci:2}, personality:{dependent:1}}}
          ]
        }}
      ]
    },
    'lc_d8_song': {
      type:'message_batch', delay:0, trigger:{day:8, hour:21},
      messages:[
        {from:'luci', text:'刚才路过一家琴行，有人在弹《卡农》。'},
        {from:'luci', text:'我站在门口听完了整首。路人以为我在等人。'},
        {from:'luci', text:'其实我在想，九年前的你会不会也路过那里。'}
      ]
    },
    'lc_d10_darkroom': {
      type:'message_batch', delay:0, trigger:{day:10, hour:19},
      messages:[
        {from:'luci', text:'暗房的灯坏了，红灯还在。', choice:{
          prompt:'他说他在黑暗里待了一下午。',
          options:[
            {text:'别在暗房待太久，对眼睛不好', effects:{affection:{luci:2}, personality:{emotional:1}}},
            {text:'洗出来的照片给我看看', effects:{affection:{luci:2}, personality:{active:1}}}
          ]
        }}
      ]
    },
    'lc_d11_ginkgo': {
      type:'message_batch', delay:0, trigger:{day:11, hour:15},
      messages:[
        {from:'luci', text:'操场边的银杏开始黄了。'},
        {from:'luci', text:'我记得你说过喜欢银杏。'}
      ]
    },
    'lc_d13_old': {
      type:'message_batch', delay:0, trigger:{day:13, hour:22},
      messages:[
        {from:'luci', text:'翻到高中时的校牌。你的是蓝色的，我的是红色的。', choice:{
          prompt:'他很少主动聊高中的事。',
          options:[
            {text:'你还留着那些？', effects:{affection:{luci:2}, personality:{emotional:1}}},
            {text:'明天带给我看', effects:{affection:{luci:2}, personality:{active:1}}}
          ]
        }}
      ]
    },
    'lc_d14_walk': {
      type:'message_batch', delay:0, trigger:{day:14, hour:17},
      messages:[
        {from:'luci', text:'下班走回来的时候，发现霓城有一条路我从没走过。'},
        {from:'luci', text:'等你哪天有空，带你去走一遍。'}
      ]
    },
    // -- 江屿线 --
    'jy_d7_hangover': {
      type:'message_batch', delay:0, trigger:{day:7, hour:11},
      messages:[
        {from:'jiangyu', text:'昨晚喝多了。'}, {from:'jiangyu', text:'……说了什么吗。', choice:{
          prompt:'他在确认自己有没有失言。',
          options:[
            {text:'你说了一首歌的名字', effects:{affection:{jiangyu:2}, personality:{rational:1}}},
            {text:'你什么都没说，只是沉默', effects:{affection:{jiangyu:1}, personality:{emotional:1}}}
          ]
        }}
      ]
    },
    'jy_d8_ramen': {
      type:'message_batch', delay:0, trigger:{day:8, hour:13},
      messages:[{from:'jiangyu', text:'今天的员工餐是拉面。老板娘多给了一个蛋。她说看我瘦。'}]
    },
    'jy_d9_demo': {
      type:'message_batch', delay:0, trigger:{day:9, hour:23},
      messages:[
        {from:'jiangyu', text:'[语音 8"]'}, {from:'jiangyu', text:'demo。副歌还差两个字。', choice:{
          prompt:'他想让你听。',
          options:[
            {text:'很好听，别急', effects:{affection:{jiangyu:2}, personality:{emotional:1}}},
            {text:'差的那两个字是什么？', effects:{affection:{jiangyu:2}, personality:{rational:1}}}
          ]
        }}
      ]
    },
    'jy_d11_smoke': {
      type:'message_batch', delay:0, trigger:{day:11, hour:20},
      messages:[{from:'jiangyu', text:'酒吧今天来了个唱歌的女孩。唱得不错。但不是那首歌。'}]
    },
    'jy_d12_sea': {
      type:'message_batch', delay:0, trigger:{day:12, hour:18},
      messages:[
        {from:'jiangyu', text:'下班骑车去了海边。风很大。', choice:{
          prompt:'他说海边的风把他的话吹散了。',
          options:[
            {text:'什么话？', effects:{affection:{jiangyu:2}}},
            {text:'下次带我一起去', effects:{affection:{jiangyu:2}, personality:{dependent:1}}}
          ]
        }}
      ]
    },
    'jy_d14_stage': {
      type:'message_batch', delay:0, trigger:{day:14, hour:21},
      messages:[
        {from:'jiangyu', text:'雾港的舞台今晚没人用。'}, {from:'jiangyu', text:'我上去站了一会。追光没开，但我知道它在那。'}
      ]
    },

    // ===== v0.6.1（G1 电话之夜）：三男主各 2 通电话——「模拟手机」的核心形式补全 =====
    // 沈砚之 ①：深夜"工作电话"说到一半变成私事（day12 晚）
    'shenyan_call_labels': {
      type:'call', delay:2, from:'shenyan',
      trigger:{ day:12, hour:22 },
      script:[
        {who:'him', text:'林夏。打扰了。展签第三面墙的英文译名，我念给你听——'},
        {who:'him', text:'……不对。'},
        {who:'choice', options:[
          {text:'哪里不对？', effects:{affection:{shenyan:1}}},
          {text:'译名明天再核吧，太晚了', effects:{affection:{shenyan:2}}}
        ]},
        {who:'him', text:'不对的不是译名。是我不该在十点半，用工作当借口打这通电话。'},
        {who:'him', text:'……办公室很安静。那幅《海》挂在对面。我看了它五年，今晚第一次觉得，它想听的不是我的声音。'},
        {who:'choice', options:[
          {text:'那你想听谁的声音？', effects:{affection:{shenyan:2}}},
          {text:'早点回去休息', effects:{affection:{shenyan:1}}}
        ]},
        {who:'him', text:'……晚安，林夏。明天九点，译名的事——当我没打过这通电话。'}
      ],
      onDecline:'shenyan_call_labels_declined',
      then:'shenyan_call_after'
    },
    'shenyan_call_labels_declined': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'（语音信箱 23"）：展签译名……算了。晚安。'}
      ]
    },
    'shenyan_call_after': {
      type:'message_batch', delay:2,
      messages:[
        {from:'shenyan', text:'译名已核。第三面墙用你说的那个。——电话里提的事，忘了吧。'}
      ]
    },
    // 沈砚之 ②：南方回程车上的沉默电话（day14 挂载在南方出差之后）
    'shenyan_call_silent': {
      type:'call', delay:3, from:'shenyan',
      trigger:{ day:15, hour:23 },
      script:[
        {who:'him', text:'……'},
        {who:'him', text:'（听筒里是车窗风声，很长的一段沉默。）'},
        {who:'choice', options:[
          {text:'（也不说话，陪着听）', effects:{affection:{shenyan:3}}},
          {text:'你到家了吗？', effects:{affection:{shenyan:2}}}
        ]},
        {who:'him', text:'高铁过江了。那座桥的灯，一盏一盏往后退。'},
        {who:'him', text:'我小时候坐这趟车，总在数灯。数到睡着，就不会想家里的事。'},
        {who:'him', text:'……刚才数到第一百盏，想告诉你。仅此而已。晚安。'}
      ],
      onDecline:'shenyan_call_silent_declined',
      then:'music_hai_unlock'
    },
    'shenyan_call_silent_declined': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'（语音信箱 8"）：……风声，和一串灯。抱歉，按错了。'}
      ]
    },
    // 陆辞 ①：暗房水声电话（day11 晚）
    'luci_call_darkroom': {
      type:'call', delay:2, from:'luci',
      trigger:{ day:11, hour:21 },
      script:[
        {who:'him', text:'嘘——别挂。听。'},
        {who:'him', text:'（水声。缓慢的、定时的水流过什么东西的声音。）'},
        {who:'choice', options:[
          {text:'这是……显影的水声？', effects:{affection:{luci:2}}},
          {text:'你在洗照片？', effects:{affection:{luci:1}}}
        ]},
        {who:'him', text:'对。红灯下，照片正在慢慢浮出来。这是我听过最安静的等待。'},
        {who:'him', text:'以前这个时候我谁也不告诉。今天想让电话那头也有人听着。'},
        {who:'choice', options:[
          {text:'那我就听着，直到它浮出来', effects:{affection:{luci:3}}},
          {text:'洗完给我看', effects:{affection:{luci:2}}}
        ]},
        {who:'him', text:'（水声停了。）……好了。是一张你的侧脸——今天你在展厅打光的侧影。明天给你。'}
      ],
      onDecline:'luci_call_darkroom_declined',
      then:'photo_luci_side_unlock'
    },
    'luci_call_darkroom_declined': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'（语音信箱 15"）：水声，和……嗯，没什么。明天你看相册就知道了。'}
      ]
    },
    'photo_luci_side_unlock': {
      type:'photo_unlock', photo:'luci_album'
    },
    // 陆辞 ②：机场广播里的告别电话（米兰线，day17）
    'luci_call_airport': {
      type:'call', delay:2, from:'luci',
      trigger:{ day:17, hour:19 },
      condition: s_flag => true,
      script:[
        {who:'him', text:'（背景是机场广播：飞往米兰的旅客——）'},
        {who:'him', text:'林夏。我在安检口。'},
        {who:'choice', options:[
          {text:'你真的决定走了？', effects:{affection:{luci:2}}},
          {text:'……一路平安', effects:{affection:{luci:1}}}
        ]},
        {who:'him', text:'九年前没说出口的话，我写在了信封里。如果你哪天想找答案，去旧学校的储物柜。'},
        {who:'him', text:'广播催了。这次换我先挂——不然我又会像九年前一样，话到嘴边就转弯。'},
        {who:'him', text:'……再见，林夏。不。是，再见。'}
      ],
      onDecline:'luci_call_airport_declined'
    },
    'luci_call_airport_declined': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'（语音信箱 20"）：广播响了……答案在储物柜。密码是那一天。你要自己想起来才算数。'}
      ]
    },
    // 江屿 ①：唱完歌后台的喘息电话（day13）
    'jiangyu_call_afterstage': {
      type:'call', delay:2, from:'jiangyu',
      trigger:{ day:13, hour:23 },
      script:[
        {who:'him', text:'（喘息声。琴弦的余震。）……台下来了三个人。'},
        {who:'choice', options:[
          {text:'唱完了？感觉怎么样', effects:{affection:{jiangyu:2}}},
          {text:'你在抖', effects:{affection:{jiangyu:3}}}
        ]},
        {who:'him', text:'唱完才发现，手一直是抖的。三年没上台，我以为我好了。'},
        {who:'him', text:'……刚才闭眼唱副歌的时候，台下有一盏灯特别亮。我当那是你。'},
        {who:'choice', options:[
          {text:'那就是我', effects:{affection:{jiangyu:3}}},
          {text:'下次我站到最前面', effects:{affection:{jiangyu:2}}}
        ]},
        {who:'him', text:'……好。下次，第一排中间。灯给你留着。'}
      ],
      onDecline:'jiangyu_call_afterstage_declined',
      then:'music_wu_unlock'
    },
    'jiangyu_call_afterstage_declined': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'（语音信箱 11"）：喘气声很吵，抱歉……今晚，谢谢。'}
      ]
    },
    // 江屿 ②：《夏》B面写完那晚的"无事发生"电话（真结局后二周目 / day19）
    'jiangyu_call_bside': {
      type:'call', delay:2, from:'jiangyu',
      trigger:{ day:19, hour:22 },
      script:[
        {who:'him', text:'……喂。没什么事。'},
        {who:'him', text:'B面写完了。最后一句话：无事发生。'},
        {who:'choice', options:[
          {text:'无事发生，是最好的事', effects:{affection:{jiangyu:2}}},
          {text:'唱给我听', effects:{affection:{jiangyu:2}}}
        ]},
        {who:'him', text:'（轻轻哼了两句，没有伴奏。）……以前打电话都要有事。跟你，才知道没事也可以打。'},
        {who:'him', text:'霓城今晚没有雾。就这样。晚安。'}
      ],
      onDecline:'jiangyu_call_bside_declined',
      then:'music_bside_unlock'
    },
    'jiangyu_call_bside_declined': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'（语音信箱 6"）：……霓城没雾。晚安。'}
      ]
    },

    // ===== v0.5.10（F3）：二周目中段变体——告白/危机节点的专属反应（此前变体全在开场） =====
    'route_luci_rooftop_3_ng2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'luci', text:'林夏。上一次在这个天台，我把话憋回去了九年。', then:'route_luci_rooftop_3_ng2_2'}
      ]
    },
    'route_luci_rooftop_3_ng2_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'luci', text:'这一次我不打算再等。我喜欢你——从高一你借我橡皮那天起，到这个第二次的天台。', then:'route_luci_after_confess'}
      ]
    },
    'route_jiangyu_breakdown_2_ng2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'jiangyu', text:'我活着，有什么用。……这句话，我好像说过一次了。', then:'route_jiangyu_breakdown_2_ng2_2'}
      ]
    },
    'route_jiangyu_breakdown_2_ng2_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'jiangyu', text:'但你还是来了。第二次也来了。……抱住我。这次我不装了。', then:'route_jiangyu_relic'}
      ]
    },
    'route_shenyan_dinner_2_ng2': {
      type:'message_batch', delay:0,
      messages:[
        {from:'narrator', text:'（又是那场晚宴。他介绍你时——你先一步伸出了手。）', then:'route_shenyan_dinner_2_ng2_2'}
      ]
    },
    'route_shenyan_dinner_2_ng2_2': {
      type:'message_batch', delay:1,
      messages:[
        {from:'shenyan', text:'……林夏会抢在我前面介绍了。她是我请来的策展人，也是这里的常客。', then:'route_shenyan_rain'}
      ]
    },

    // ===== v0.1.12: 塔罗次日指引——换日早晨按昨日牌面 hint 类型播报（苏苏人设：运势播报担当） =====
    'tarot_morning_encounter': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面提示：今天「相遇」的运势很高——走哪条路都可能撞见熟人哦。'},
        {from:'susu', text:'出门前记得照镜子，把最好看的样子带上！'}
      ]
    },
    'tarot_morning_affection': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面全是恋爱的味道——今天谁对你好一点，都不是巧合。'},
        {from:'susu', text:'心跳的时候别否认，是你自己的心在跳。'}
      ]
    },
    'tarot_morning_memory': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面指向「过去」——旧东西、旧地方、旧话题，今天都可能翻出来。'},
        {from:'susu', text:'翻到旧照片别急着划走，说不定有你想不起来的细节。'}
      ]
    },
    'tarot_morning_rational': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面提示：今天适合动脑子不适合动心。'},
        {from:'susu', text:'有决定要做的话，列个清单再选。'}
      ]
    },
    'tarot_morning_independent': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面只有两个字：「自己」。'},
        {from:'susu', text:'今天谁的话都可以听一半——包括这句。'}
      ]
    },
    'tarot_morning_luck': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面是好运预备——今天买咖啡可能买一送一，记得领！'},
        {from:'susu', text:'运气这东西，用掉才有。冲！'}
      ]
    },
    'tarot_morning_ending_hint': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨天那张牌……有点重，是「结局」的牌。'},
        {from:'susu', text:'最近做的每个决定，都在悄悄写结局。慎重，但别怕。'}
      ]
    },
    'tarot_morning_dream': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'夏夏早！昨日牌面与「梦」有关——今晚睡前别刷手机，梦会给你答案。'},
        {from:'susu', text:'醒来记得记下来，梦是限时的。'}
      ]
    },

    // ===== v0.2.4: 塔罗抽牌即时反馈——当日新牌面抽中后，苏苏立刻评论（当日牌面联动） =====
    // 由 engine.drawTarot 按 hint.type 派发；纯消息不带 choice
    'tarot_draw_reaction_encounter': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'🔮 夏夏！这张牌……今天会"遇见"重要的人。别低头走路，抬头！'}
      ]
    },
    'tarot_draw_reaction_affection': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'🔮 夏夏！这牌面甜到齁——今天谁多看你一眼，都不是偶然。'}
      ]
    },
    'tarot_draw_reaction_memory': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'🔮 夏夏！这张牌在翻旧账——旧照片、旧消息，今天别删，会有发现。'}
      ]
    },
    'tarot_draw_reaction_rational': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'🔮 夏夏！今天是清醒牌——适合算清楚，不适合上头。'}
      ]
    },
    'tarot_draw_reaction_independent': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'🔮 夏夏！今天这张牌是"自己"——别人的意见，参考就好。'}
      ]
    },
    'tarot_draw_reaction_luck': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'🔮 夏夏！好牌！今天运气在线，第一杯咖啡都该是买一送一！'}
      ]
    },
    'tarot_draw_reaction_ending_hint': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'🔮 夏夏……这张牌有点重。最近的决定，都在悄悄写结局。慢慢来，别怕。'}
      ]
    },
    'tarot_draw_reaction_dream': {
      type:'message_batch', delay:0,
      messages:[
        {from:'susu', text:'🔮 夏夏！今天梦运会很灵——睡前记得把明天的愿望想好。'}
      ]
    },

    // ===== v0.1.12: 群聊第二波——周末聚餐投票（day6 晚上触发，群 choice 写性格与 flag） =====
    'group_neon_wave2_vote': {
      type:'group_message_batch', delay:0, groupId:'group_neon',
      trigger:{ day:6, hour:21 },
      messages:[
        // v0.2.4: 塔罗 hint 文案变体——投票通知随当日运势
        {from:'susu', text:'通知！本周六「霓城小分队」首次线下聚餐！地点投票，现在开始！',
          flavors:{
            luck:'通知！本周六「霓城小分队」首次线下聚餐！地点投票，现在开始！今天你手气旺，选哪家都好吃！',
            affection:'通知！本周六「霓城小分队」首次线下聚餐！地点投票，现在开始！选对地方，某人会开心哦～',
            rational:'通知！本周六「霓城小分队」首次线下聚餐！地点投票，现在开始！三个选项都附了攻略，理性选择！'
          }, then:'group_neon_wave2_vote2'}
      ]
    },
    'group_neon_wave2_vote2': {
      type:'group_message_batch', delay:1, groupId:'group_neon',
      messages:[
        {from:'luci', text:'+1！我可以负责摄影记录。'},
        {from:'jiangyu', text:'都行。别选要我唱歌的地方。'},
        {from:'shenyan', text:'看日程。若在美术馆附近，可预留包间。', choice:{
          prompt:'聚餐地点投票：',
          options:[
            {text:'火锅——热闹最重要', effects:{flags:{group_dinner_hotpot:1}, personality:{emotional:1, active:1}}, thenEvent:'group_neon_wave2_after', hint:'苏苏喜欢'},
            {text:'居酒屋——喝一点刚好', effects:{affection:{jiangyu:1}, flags:{group_dinner_izakaya:1}, personality:{rational:1}}, thenEvent:'group_neon_wave2_after', hint:'江屿主场'},
            {text:'美术馆包间——安静', effects:{affection:{shenyan:1}, flags:{group_dinner_gallery:1}, personality:{passive:1}}, thenEvent:'group_neon_wave2_after', hint:'沈砚之主场'}
          ]
        }}
      ]
    },
    'group_neon_wave2_after': {
      type:'group_message_batch', delay:1, groupId:'group_neon',
      messages:[
        // v0.2.4: 塔罗 hint 文案变体——投票结果公布随当日运势
        {from:'susu', text:'投票有效！周六晚上七点，不许请假，不许迟到！',
          flavors:{
            luck:'投票有效！周六晚上七点，不许请假，不许迟到！今天你运气好，抢位子都顺！',
            affection:'投票有效！周六晚上七点，不许请假，不许迟到！坐得离谁近，你懂的～',
            rational:'投票有效！周六晚上七点，不许请假，不许迟到！攻略已发群公告，预习一下！',
            memory:'投票有效！周六晚上七点，不许请假，不许迟到！这顿吃完，得拍张合影挂群相册！'
          }},
        {from:'susu', text:'（本群唯一的宗旨：盯紧我们夏夏的幸福进度。）'}
      ]
    },

    // ===== v0.2.0: 群聊聚餐现场——按 day6 投票 flag 分歧（checkGroupDinner 于 day7 晚派发） =====
    'group_dinner_scene_hotpot': {
      type:'group_message_batch', delay:0, groupId:'group_neon',
      effects:{ affection:{jiangyu:1}, personality:{emotional:1} },
      messages:[
        // v0.2.3: 塔罗 hint 文案变体——幸运/心动/回忆日，直播开场语气不同
        {from:'susu', text:'🔥首聚现场直击：红锅已开，毛肚已下，人齐了！',
          flavors:{
            luck:'🔥首聚现场直击：红锅已开，人齐了——今天连排队都特别顺，好运开场！',
            affection:'🔥首聚现场直击：红锅已开，沈老板居然主动坐你旁边！氛围感拉满！',
            memory:'🔥首聚现场直击：红锅已开，这锅底的味道，和咱们毕业那顿一模一样！'
          }},
        {from:'luci', text:'[图片] 九宫格。谁点的脑花，站出来。'},
        {from:'jiangyu', text:'我。涮好了给你们留两筷子。'},
        {from:'shenyan', text:'……辣度超预期。水。'},
        {from:'susu', text:'沈老板居然真的来了！夏夏你坐他旁边对不对！拍照了！'}
      ]
    },
    'group_dinner_scene_izakaya': {
      type:'group_message_batch', delay:0, groupId:'group_neon',
      effects:{ affection:{jiangyu:1}, personality:{rational:1} },
      messages:[
        // v0.2.3: 塔罗 hint 文案变体
        {from:'susu', text:'🏮首聚现场：居酒屋小间已包，烤串无限追加！',
          flavors:{
            luck:'🏮首聚现场：居酒屋小间已包，老板说今天酒水买一送一，好运！',
            affection:'🏮首聚现场：居酒屋小间已包，江屿点的全是"她的"——就离谱！',
            memory:'🏮首聚现场：居酒屋小间已包，这个位子，是咱们当年逃课喝酒那间！'
          }},
        {from:'jiangyu', text:'老板，梅子茶泡饭一份——她的。别的随意。'},
        {from:'luci', text:'[图片] 招牌灯下的合影申请，举手的都入镜。'},
        {from:'shenyan', text:'角落位置已占。观灯，比看人舒服。'},
        {from:'susu', text:'沈老板你入了！我看到你举手了！照片为证！'}
      ]
    },
    'group_dinner_scene_gallery': {
      type:'group_message_batch', delay:0, groupId:'group_neon',
      effects:{ affection:{shenyan:1}, personality:{passive:1} },
      messages:[
        // v0.2.3: 塔罗 hint 文案变体
        {from:'susu', text:'🎨首聚现场：美术馆包间，据说菜单都是沈老板亲选。',
          flavors:{
            luck:'🎨首聚现场：美术馆包间，今天闭馆刚好赶上新展布置，运气绝了！',
            affection:'🎨首聚现场：美术馆包间，沈老板亲选菜单——他什么时候这么用心过！',
            rational:'🎨首聚现场：美术馆包间，据可靠情报，菜单是他比了三天价的成果。'
          }},
        {from:'shenyan', text:'闭馆后的展厅，顺路可以看一眼。只一眼。'},
        {from:'luci', text:'[图片] 月光展厅走廊。这张必须发朋友圈。'},
        {from:'jiangyu', text:'这里连酒杯声音都是安静的。有点意思。'},
        {from:'susu', text:'闭馆后的美术馆！四个人包场！这待遇可以吹一年！'}
      ]
    },

    // ===== v0.2.0: 雨天限定——首个雨天晚 20 点后触发（checkRainEvents 派发） =====
    'rain_ambush_msg': {
      type:'message_batch', delay:0,
      messages:[
        // v0.2.2: 塔罗 hint 文案变体——幸运/心动/清醒/回忆日语气不同
        {from:'susu', text:'下雨了！！你带伞没？我看气象雷达，那片一时半会停不了！',
          flavors:{
            luck:'下雨了！！但你看窗外，雨把灯牌的光都点亮了，淋这一场说不定是好运开场！！',
            affection:'下雨了！！你站屋檐下别动！我拿伞去接你——这种天气最适合说点心里话！！',
            rational:'下雨了！！雷达显示四十分钟后停。找个屋檐待着，别冲，淋感冒不划算！！',
            memory:'下雨了！！这雨让我想起去年春天，你也是忘带伞，站在美术馆门口等雨停。'
          }},
        {from:'susu', text:'（窗外，霓城泡在雨里。灯牌的光晕被雨拉成一条条彩线。）', choice:{
          prompt:'雨越下越大。你决定：',
          options:[
            {text:'冲进雨里跑回家', effects:{personality:{active:1, independent:1}, flags:{rain_choice_run:1}, thenEvent:'rain_ambush_after'}, hint:'淋一场，清醒一场'},
            {text:'在檐下等雨小', effects:{personality:{passive:1, rational:1}, flags:{rain_choice_wait:1}, thenEvent:'rain_ambush_after'}, hint:'听雨十分钟'},
            {text:'叫苏苏来接', effects:{personality:{dependent:1, emotional:1}, flags:{rain_choice_susu:1}, thenEvent:'rain_susu_gift'}, hint:'闺蜜是雨天的正义'}
          ]
        }}
      ]
    },
    'rain_susu_gift': {
      type:'message_batch', delay:1,
      collectible:'postcard_rain',  // v0.4.7: 雨天限定明信片——雨天剧情选「叫苏苏」专属
      messages:[
        {from:'susu', text:'（她湿着半边肩膀跑来，伞全打在你头上。）'},
        {from:'susu', text:'给，雨天限定的明信片！霓城一下雨就这样，帅吧？', then:'rain_ambush_after'}
      ]
    },
    'rain_ambush_after': {
      type:'message_batch', delay:2,
      messages:[
        {from:'susu', text:'到家记得喝热的！别感冒！霓城的雨，说大就大。'}
      ]
    },

    // ===== v0.2.0: 中后期日常（day7-10）——选项回复按性格分化 =====
    'week1_review': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发，防止侵入男主线结局段
      trigger:{ day:7, hour:9, soloOnly:true },
      messages:[
        {from:'narrator', text:'（来霓城的第七天。闹钟响之前你就醒了——身体先接受了这座城市的节奏。）', choice:{
          prompt:'躺在床上，你想：',
          options:[
            {text:'这一周认识了三个人，不错', effects:{personality:{active:1, rational:1}, thenEvent:'day7_shenyan_evening'}, reply:'（你把三个名字在心里过了一遍，像清点战利品。）'},
            {text:'好像还是没适应', effects:{personality:{passive:1, emotional:1}, thenEvent:'day7_shenyan_evening'}, reply:'（陌生感没有消失，只是学会了和它同睡一张床。）'},
            {text:'先起来，想这些没用', effects:{personality:{independent:1, rational:1}, thenEvent:'day7_shenyan_evening'}, reply:'（你掀开被子。霓城不相信赖床的人。）'}
          ]
        }}
      ]
    },
    'day7_shenyan_evening': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发
      trigger:{ day:7, hour:19, soloOnly:true },
      messages:[
        // v0.2.2: 塔罗 hint 文案变体——心动/幸运/清醒日语气不同
        {from:'shenyan', text:'布展方案通过了。今晚不留下来加班？——这是陈述，不是命令。',
          flavors:{
            affection:'布展方案通过了。闭馆后只留一盏灯，你要不要来看看它独自发光的样子？',
            luck:'布展方案通过了，还顺带抽到个好档期。今晚不忙的话，陪我验收一下？',
            rational:'布展方案通过了。流程都核过了，你今晚不必陪跑，好好休息。'
          }},
        {from:'shenyan', text:'（你注意到，他开始区分"命令"和"请求"了。）',
          flavors:{
            affection:'（他这句话说得很慢，像在练习怎么把"命令"换成"邀请"。）',
            rational:'（他说完自己顿了一下，像是意识到刚才那句话已经不再是命令了。）'
          }}
      ]
    },
    'day8_luci_photos': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发
      trigger:{ day:8, hour:13, soloOnly:true },
      messages:[
        // v0.2.2: 塔罗 hint 文案变体——幸运/回忆/心动日语气不同
        {from:'luci', text:'[图片] 早上扫街拍的。霓城早上七点和晚上七点，是两个城市。',
          flavors:{
            luck:'[图片] 早上扫街正好撞见一束光，整个路口都是亮的。运气好，拍到了。',
            memory:'[图片] 路过咱们以前常走的那条街，多按了两张。路没变，光变了。',
            affection:'[图片] 街角那家店换了招牌，但玻璃上还映着你上次站的位置。顺手拍下来了。'
          }},
        {from:'luci', text:'哪张好？我投第二张——构图里有你上周站过的那个路口。'}
      ]
    },
    'day8_jiangyu_clip': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发
      trigger:{ day:8, hour:22, soloOnly:true },
      messages:[
        // v0.2.2: 塔罗 hint 文案变体——梦境/心动/回忆日，副歌文案随运势变化
        {from:'jiangyu', text:'[语音 12"]',
          flavors:{ dream:'[语音 15"]' }},
        {from:'jiangyu', text:'新歌demo，副歌还缺两个字。睡不着的代价就是半夜写歌。',
          flavors:{
            dream:'昨晚梦见一段旋律，醒了一半，只抓住这个副歌。梦比白天会写歌。',
            affection:'demo 写完了。副歌最后两个字，是那天晚上你随口哼的调子。',
            memory:'改的是十年前那首没写完的歌。今天总算知道后面该接什么了。'
          }}
      ]
    },
    'day9_susu_gossip': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发
      trigger:{ day:9, hour:15, soloOnly:true },
      messages:[
        // v0.2.2: 塔罗 hint 文案变体——幸运/心动/清醒/回忆日，苏苏八卦语气不同
        {from:'susu', text:'重大情报！！本周你被三个人同时约的概率是100%！！',
          flavors:{
            luck:'重大情报！！今天你幸运值拉满，走到哪都有桃花雷达自动锁定你！！',
            affection:'重大情报！！你今天整个人的气场甜到发齁，恋爱信号爆表，快出门收割！！',
            rational:'重大情报！！我做了个统计：本周你被同时约的概率是 100%，结论：你需要一个日程管理 App！！',
            memory:'重大情报！！我刚翻到去年的聊天记录，你那天说的话居然全应验了，玄学！！'
          }},
        {from:'susu', text:'（统计样本：我。误差范围：我说是就是。）'}
      ]
    },
    'day10_morning_reflect': {
      type:'message_batch', delay:0,
      // v0.2.1: soloOnly——通用日常仅未进男主线时触发
      trigger:{ day:10, hour:8, soloOnly:true },
      messages:[
        {from:'narrator', text:'（第十天。窗外的霓虹灯还没醒，城市露出少见的灰色轮廓。）', choice:{
          prompt:'难得安静的清晨。你决定：',
          options:[
            {text:'出门走走，看看睡着的霓城', effects:{personality:{active:1, independent:1}}, reply:'（你拍下了一张没有霓虹的霓城。相册里第一张"素颜"照片。）', hint:'独立探索'},
            {text:'给最近聊得最多的人发早安', effects:{personality:{dependent:1, emotional:1}}, reply:'（发出去三秒就收到回复。原来也有人醒着。）', hint:'主动联结'},
            {text:'再睡半小时，难得不用赶', effects:{personality:{passive:1}}, reply:'（你把闹钟按掉。十分钟后自然醒，窗外已经亮了。）', hint:'休息'}
          ]
        }}
      ]
    },

    // ===== v0.2.3: 独行线中后期日常（day11-14）——纯消息、soloOnly，部分带塔罗 hint 变体 =====
    'day11_susu_snack': {
      type:'message_batch', delay:0,
      trigger:{ day:11, hour:12, soloOnly:true },
      messages:[
        // v0.2.3: 塔罗 hint 文案变体——幸运/心动/回忆日语气不同
        {from:'susu', text:'霓城美食地图更新：城南巷子口新开一家糖水铺，祖传配方！午休走起！',
          flavors:{
            luck:'霓城美食地图更新：城南巷子口新开一家糖水铺，第一锅被我们赶上，好运！午休走起！',
            affection:'霓城美食地图更新：城南巷子口新开一家糖水铺，据说甜到心动那种！午休走起！',
            memory:'霓城美食地图更新：城南巷子口新开一家糖水铺，老板娘说手艺是跟咱们学校门口那家学的！午休走起！'
          }}
      ]
    },
    'day12_city_walk': {
      type:'message_batch', delay:0,
      trigger:{ day:12, hour:18, soloOnly:true },
      messages:[
        // v0.2.3: 塔罗 hint 文案变体——回忆/幸运/梦境日视角不同
        {from:'narrator', text:'（傍晚的霓城开始点灯。你在江边站了一会儿，身后的城市一点点亮起来。）',
          flavors:{
            memory:'（傍晚的霓城开始点灯。江面上浮着旧年的倒影，你忽然想起第一次来这里的那个黄昏。）',
            luck:'（傍晚的霓城开始点灯。今天运气不错，你看见江对面那栋楼，刚好亮出你的星座。）',
            dream:'（傍晚的霓城开始点灯。灯亮起来的样子，像极了你昨晚梦里的那片光。）'
          }}
      ]
    },
    'day13_art_news': {
      type:'message_batch', delay:0,
      trigger:{ day:13, hour:10, soloOnly:true },
      messages:[
        // v0.2.3: 塔罗 hint 文案变体——清醒/心动/回忆日情报侧重不同
        {from:'susu', text:'情报：砚美术馆下周办新展，主题「未完成」。沈老板这次亲自下场策展！',
          flavors:{
            rational:'情报：砚美术馆下周办新展，主题「未完成」。沈老板亲自策展，据说方案改到第 27 版。',
            affection:'情报：砚美术馆下周办新展，主题「未完成」。沈老板亲自策展——他上次这么上心，还是给你布展那次！',
            memory:'情报：砚美术馆下周办新展，主题「未完成」。像不像他那幅画了三年没画完的画？'
          }}
      ]
    },
    'day14_two_weeks': {
      type:'message_batch', delay:0,
      trigger:{ day:14, hour:9, soloOnly:true },
      messages:[
        // v0.2.3: 塔罗 hint 文案变体——回忆/幸运日开场不同
        {from:'narrator', text:'（来霓城第十四天。你已经能分辨每条街的灯牌，哪一盏先亮。）',
          flavors:{
            memory:'（来霓城第十四天。你已经能分辨每条街的灯牌，哪一盏先亮——像是认识了很久的老朋友。）',
            luck:'（来霓城第十四天。今天连红绿灯都在配合你，一路绿灯到公司。）'
          }},
        {from:'susu', text:'两周啦！本情报王宣布：你在霓城正式"混开了"！'}
      ]
    },

    // ===== v0.3.1 (M3.3): 男主线中后期日常（day15-17）——纯消息、inRoute（仅已进男主线）=====
    // 与独行线日常对称：三条男主线共用中性文案（不特指某男主），带塔罗 hint 变体
    // day15：工作日常（开幕筹备期，忙碌中的彼此留白）
    'day15_route_work': {
      type:'message_batch', delay:0,
      trigger:{ day:15, hour:10, inRoute:true },
      messages:[
        {from:'narrator', text:'（开幕在即，你在展厅忙到很晚。手机在口袋里安静了一整晚——没有人催你回。）',
          flavors:{
            rational:'（开幕在即，你在展厅忙到很晚。布展清单一条条划掉，效率意外地高。）',
            affection:'（开幕在即，你在展厅忙到很晚。中间他发来一句"记得吃饭"，你盯着看了几秒才继续干活。）',
            memory:'（开幕在即，你在展厅忙到很晚。挂画的姿势，让你想起第一次布展那天手忙脚乱的样子。）'
          }}
      ]
    },
    // day16：城市夜色（关系推进中的回味）
    'day16_route_city': {
      type:'message_batch', delay:0,
      trigger:{ day:16, hour:20, inRoute:true },
      messages:[
        {from:'narrator', text:'（霓城的夜。你走在回家的路上，忽然想起他最近说过的一句话。）',
          flavors:{
            memory:'（霓城的夜。你走在回家的路上，那句话像旧唱片一样，在心里转了一整天。）',
            affection:'（霓城的夜。你走在回家的路上，那句话让你的脚步不自觉地轻了一点。）',
            dream:'（霓城的夜。你走在回家的路上，路灯一盏盏亮起，像有人提前替你铺好了路。）'
          }}
      ]
    },
    // day17：三周小结（男主线版，关系比预想更近）
    'day17_route_three': {
      type:'message_batch', delay:0,
      trigger:{ day:17, hour:9, inRoute:true },
      messages:[
        {from:'narrator', text:'（来霓城三周。有些关系，比你以为的更近了一点。）',
          flavors:{
            affection:'（来霓城三周。你发现自己开始习惯，消息里那个人的名字总是在最上面。）',
            rational:'（来霓城三周。你把最近的相处在脑子里捋了捋——边界感还在，但心甘情愿让出了一格。）',
            luck:'（来霓城三周。回头看，遇见、重逢、并肩，好像都赶上了对的时辰。）'
          }}
      ]
    },

    // ===== v0.3.2 (M3.4): 男主线后期日常（day18-20）——纯消息、inRoute，与独行线 day18-21 对称 =====
    // day18：开幕当晚（工作线高潮，忙碌却充实）
    'day18_route_open': {
      type:'message_batch', delay:0,
      trigger:{ day:18, hour:21, inRoute:true },
      messages:[
        {from:'narrator', text:'（开幕当晚。展厅的灯一盏盏熄灭，你才发觉自己站了一整天，却一点都不累。）',
          flavors:{
            rational:'（开幕当晚。参观数据比预估的高，你把复盘记了下来，明天继续。）',
            affection:'（开幕当晚。他离场前回头看了你一眼——那一秒，比整晚的掌声都清楚。）',
            memory:'（开幕当晚。布展的每一步你都记得清，像把一整段日子折进了这个展厅。）'
          }}
      ]
    },
    // day19：深夜消息（关系推进中的回味）
    'day19_route_msg': {
      type:'message_batch', delay:0,
      trigger:{ day:19, hour:23, inRoute:true },
      messages:[
        {from:'narrator', text:'（深夜。手机里那几条没舍得删的对话，你又翻了一遍。）',
          flavors:{
            memory:'（深夜。那几条对话你翻了一遍，时间戳停在一个平常的下午，你却记得很清楚。）',
            affection:'（深夜。那几条对话你又翻了一遍，差点忍不住想再回一句。）',
            dream:'（深夜。那几条对话像会发光，你看着看着，做了一个很轻的梦。）'
          }}
      ]
    },
    // day20：城市夜色（距离渐近）
    'day20_route_city': {
      type:'message_batch', delay:0,
      trigger:{ day:20, hour:20, inRoute:true },
      messages:[
        {from:'narrator', text:'（霓城的夜。你和他的距离，好像又近了一杯咖啡的宽度。）',
          flavors:{
            affection:'（霓城的夜。你和他的距离，像又近了一杯咖啡的宽度——这一次你没有后退。）',
            rational:'（霓城的夜。你复盘最近的相处：边界还在，但你好像默许了一些模糊。）',
            luck:'（霓城的夜。今晚的霓虹，刚好是你们第一次遇见时的那两个颜色。）'
          }}
      ]
    },
    // day21：开幕之后的复盘（男主线版小结，三线共用中性文案）
    'day21_route_month': {
      type:'message_batch', delay:0,
      trigger:{ day:21, hour:9, inRoute:true },
      messages:[
        {from:'narrator', text:'（开幕过去了。你终于有空坐下来，把这几周的人和事，从头想了一遍。）',
          flavors:{
            affection:'（开幕过去了。你想的其实只有一件事：他上次说的那句话，到底算不算数。）',
            rational:'（开幕过去了。你把状态、关系、进度都复盘了一遍，唯独"他"那一栏空着。）',
            memory:'（开幕过去了。你想起这几周里，有好几个瞬间，你都差点脱口而出。）'
          }}
      ]
    },

    // ===== v0.2.9 (M3.1): 独行线后期日常（day15-18）——纯消息、soloOnly，带塔罗 hint 变体 =====
    // day15：半月小结（回望这段独自生活的节奏）
    'day15_half_month': {
      type:'message_batch', delay:0,
      trigger:{ day:15, hour:9, soloOnly:true },
      messages:[
        {from:'narrator', text:'（来霓城半个月。你开始习惯这座城的呼吸：地铁的风、天桥的灯、楼下便利店的关东煮。）',
          flavors:{
            memory:'（来霓城半个月。你已经分得清，哪句"有空吃饭"是真的，哪句只是客套——像很多年前就懂了一样。）',
            rational:'（来霓城半个月。你把这半个月在脑子里过了一遍：做了几件事，推掉几件事，账很清楚。）',
            luck:'（来霓城半个月。回头看，好几件事都赶在刚好那一刻——晚一步或早一步都不成。）'
          }},
        {from:'susu', text:'半月心得交一下！就一句：你现在走在霓城，像本地人了。'}
      ]
    },
    // day16：天气联动（梅雨季文案，随当日运势变体）
    'day16_rainy_city': {
      type:'message_batch', delay:0,
      trigger:{ day:16, hour:16, soloOnly:true },
      messages:[
        {from:'susu', text:'霓城进梅雨季了，出门记得带伞！顺便说，雨天的霓虹最好看，反光像满地碎钻。',
          flavors:{
            memory:'霓城进梅雨季了，记得带伞。雨天的霓虹你见过没有？反光在地上，像很多年前那场雨。',
            affection:'霓城进梅雨季了，记得带伞！听说下雨天最适合两个人挤一把伞……（暗示）',
            rational:'霓城进梅雨季了，记得带伞。雨天路滑，地铁比打车稳，别学我上次迟到。'
          }}
      ]
    },
    // day17：独行线心境（一个人也很好，夜景独处）
    'day17_solo_night': {
      type:'message_batch', delay:0,
      trigger:{ day:17, hour:22, soloOnly:true },
      messages:[
        {from:'narrator', text:'（夜里一个人在阳台站了会儿。楼下的霓虹灭了一半，城市终于安静下来。）',
          flavors:{
            memory:'（夜里一个人在阳台站了会儿。风里有点旧城区的味道，你忽然不太想挪动。）',
            dream:'（夜里一个人在阳台站了会儿。夜色深得像能一头扎进去，做一场好梦。）',
            luck:'（夜里一个人在阳台站了会儿。抬头看见一颗很亮的星——在霓城的灯里，居然还看得见。）'
          }},
        {from:'narrator', text:'（一个人也很好。你想。）'}
      ]
    },
    // day18：节令联动（灯河节，城市活动，一人可去可不去的从容）
    'day18_neon_festival': {
      type:'message_batch', delay:0,
      trigger:{ day:18, hour:19, soloOnly:true },
      messages:[
        {from:'susu', text:'情报：这周末霓城办「灯河节」，整条江边挂满灯串！一个人去也超好看，我作证！',
          flavors:{
            luck:'情报：这周末霓城办「灯河节」，据说今年风向刚好，灯串会一路亮到江心！我去踩过点了，超灵！',
            affection:'情报：这周末霓城办「灯河节」，整条江边挂满灯串——情侣扎堆，单身的去也不亏！',
            rational:'情报：这周末霓城办「灯河节」。人流量大，建议错峰，八点后去江对岸看更清楚。'
          }},
        {from:'narrator', text:'（灯河节。你可以去，也可以不去。霓城会一直亮着。）'}
      ]
    },

    // ===== v0.2.10 (M3.2): 独行线后期日常 day19-21——纯消息、soloOnly，带塔罗 hint 变体 =====
    // day19：工作/机会情报（夜场讲解，一人也能光明正大看展）
    'day19_susu_tip': {
      type:'message_batch', delay:0,
      trigger:{ day:19, hour:13, soloOnly:true },
      messages:[
        {from:'susu', text:'情报：城南那家美术馆在招夜场讲解，你要不要报个名？不赚钱，但能光明正大看展。',
          flavors:{
            rational:'情报：城南那家美术馆在招夜场讲解。时薪一般，但能光明正大看展，性价比你自己算。',
            affection:'情报：城南那家美术馆在招夜场讲解——据说沈老板偶尔去巡场，你懂的。',
            luck:'情报：城南那家美术馆在招夜场讲解，名额就剩一个，我先帮你问了，手快有！'
          }}
      ]
    },
    // day20：城市习惯（独处也自在的日常）
    'day20_city_habit': {
      type:'message_batch', delay:0,
      trigger:{ day:20, hour:21, soloOnly:true },
      messages:[
        {from:'narrator', text:'（你在霓城养成了新的习惯：下班绕远路，只为经过那家亮着暖灯的书店。）',
          flavors:{
            memory:'（你在霓城养成了新的习惯：下班绕远路，经过那家书店——像小时候会特意绕去的那条巷子。）',
            dream:'（你在霓城养成了新的习惯：下班绕远路。有时你会在那家书店的橱窗前，做一会儿白日梦。）',
            luck:'（你在霓城养成了新的习惯：下班绕远路——好几次刚好赶上老板关门前熄灭的最后一盏灯。）'
          }}
      ]
    },
    // day21：三周小结（一个人也把日子过得很像样）
    'day21_three_weeks': {
      type:'message_batch', delay:0,
      trigger:{ day:21, hour:9, soloOnly:true },
      messages:[
        {from:'narrator', text:'（来霓城三周。你不再需要导航就能穿过老城区，也不再需要借口才敢一个人吃饭。）',
          flavors:{
            memory:'（来霓城三周。有些事你以前觉得做不到，现在做起来，像早就习惯了。）',
            rational:'（来霓城三周。你把住的地方收拾利落，日程排得明白——一个人也把日子过得像样。）',
            luck:'（来霓城三周。回头看，当初那个"要不要留下来"的犹豫，好像是别人替你做的决定。）'
          }},
        {from:'susu', text:'三周！本情报王正式宣布：你已经是个合格的霓城人了。今晚奖励自己一顿好的！'}
      ]
    }
  },
});

// ===== v0.1.8: 由 story/18_patches.js 收编的历史增量语句（保持逐字不变） =====
STORY.events['intel_shenyan_ex_reply'] = {
  type:'message_batch', delay:0,
  messages:[{from:'susu', text:'你说要不要去问问？我可以帮你打探！', choice:{
    prompt:'苏苏在等你的决定：',
    options:[
      {text:'别问了，我相信他', effects:{affection:{shenyan:2}, flags:{intel_shenyan_ex:'trust', trust_shenyan:1}, personality:{emotional:1}}, hint:'沈砚之 +2'},
      {text:'帮我盯着', effects:{affection:{shenyan:-1}, flags:{intel_shenyan_ex:'watch', suspect_shenyan:1}, personality:{rational:1}}, hint:'沈砚之 -1'},
      {text:'不管，先忙眼前的', effects:{affection:{}, flags:{intel_shenyan_ex:'ignore'}, personality:{independent:1}}, hint:'中立'}
    ]
  }}]
};

STORY.events['intel_luci_milan_reply'] = {
  type:'message_batch', delay:0,
  messages:[{from:'susu', text:'你说他不会真要走吧？九年没见，刚重逢就要走？', choice:{
    prompt:'苏苏替你着急：',
    options:[
      {text:'去问问他', effects:{affection:{luci:2}, flags:{intel_luci_milan:'ask', care_luci:1}, personality:{active:1}}, hint:'陆辞 +2'},
      {text:'他要走是他的事', effects:{affection:{luci:-1}, flags:{intel_luci_milan:'letgo'}, personality:{independent:1}}, hint:'陆辞 -1'},
      {text:'也许只是工作', effects:{affection:{luci:1}, flags:{intel_luci_milan:'rational'}, personality:{rational:1}}, hint:'陆辞 +1'}
    ]
  }}]
};

STORY.events['intel_jiangyu_song_reply'] = {
  type:'message_batch', delay:0,
  messages:[{from:'susu', text:'你说那首《夏》，是不是跟你有关？毕竟你叫林夏诶！', choice:{
    prompt:'苏苏的问题戳中了你：',
    options:[
      {text:'应该只是巧合', effects:{affection:{jiangyu:1}, flags:{intel_jiangyu_song:'coincide'}, personality:{rational:1}}, hint:'江屿 +1'},
      {text:'我想去听他唱完', effects:{affection:{jiangyu:2}, flags:{intel_jiangyu_song:'listen', want_listen:1}, personality:{emotional:1}}, hint:'江屿 +2'},
      {text:'别瞎说，我们只是朋友', effects:{affection:{jiangyu:0}, flags:{intel_jiangyu_song:'deny'}, personality:{passive:1}}, hint:'江屿 +0'}
    ]
  }}]
};


// 邀约相关事件

STORY.events['inv_shenyan_studio_accept'] = {
  type:'advance_time', text:'赴约 · 私人画室', minutes:120,
  then:'inv_shenyan_studio_scene'
};

STORY.events['inv_shenyan_studio_scene'] = {
  type:'encounter',
  encounter:{
    id:'inv_shenyan_studio_scene', char:'shenyan',
    title:'私人画室',
    desc:'画室在美术馆顶楼，没有灯，只有月光。\n他指着一幅盖着布的画：\n"这幅，画了三年。"\n"画的是谁？"\n他没回答，把布掀开一角。',
    choice:{ prompt:'月光下，画布上是一张熟悉的侧脸。',
      options:[
        {text:'那是…我？', affection:{shenyan:3}, reply:'"你比自己想象的，更值得被画下来。"', personality:{emotional:2}},
        {text:'为什么画我？', affection:{shenyan:2}, reply:'"因为我画不出别的。三年了，只画得出你。"', personality:{rational:1}},
        {text:'我不喜欢被画', affection:{shenyan:-1}, reply:'"……抱歉。我把它收起来。"', personality:{independent:1}}
      ]
    }
  },
  then:'inv_shenyan_studio_after'
};

STORY.events['inv_shenyan_studio_after'] = {
  type:'photo_unlock', photo:'shenyan_studio'
};

STORY.events['inv_shenyan_studio_decline'] = {
  type:'message_batch', delay:1,
  messages:[{from:'shenyan', text:'……也好。那幅画，本来也不该被人看见。'}]
};

STORY.events['inv_shenyan_studio_miss'] = {
  type:'message_batch', delay:0,
  messages:[{from:'shenyan', text:'画室的灯，我替你关了。下次不必再来。'}]
};

STORY.events['inv_luci_school_accept'] = {
  type:'advance_time', text:'赴约 · 旧学校', minutes:240,
  then:'inv_luci_school_scene'
};

STORY.events['inv_luci_school_scene'] = {
  type:'encounter',
  encounter:{
    id:'inv_luci_school_scene', char:'luci',
    title:'九年的旧学校',
    desc:'校门口的银杏又长高了一截。\n他带你走到当年高一军训的操场：\n"你那时候站这里。我在你后面第三个。"\n"我数过，从那天到今天，九年又一百八十二天。"',
    choice:{ prompt:'他从相机里抽出一张旧照片——是你高一的侧脸。',
      options:[
        {text:'你偷拍我？', affection:{luci:2}, reply:'"不叫偷拍。叫记录。我记录了你九年。"', personality:{emotional:2}},
        {text:'为什么不说', affection:{luci:3}, reply:'"怕说了，连记录的机会都没了。"', personality:{dependent:1}},
        {text:'照片给我', affection:{luci:1}, reply:'"都给你。连人一起，都给你。"', personality:{active:1}}
      ]
    }
  },
  then:'inv_luci_school_after'
};

STORY.events['inv_luci_school_after'] = {
  type:'photo_unlock', photo:'luci_school'
};

STORY.events['inv_luci_school_decline'] = {
  type:'message_batch', delay:1,
  messages:[{from:'luci', text:'没事。学校而已，下次还能去。其实也没有下次了。'}]
};

STORY.events['inv_luci_school_miss'] = {
  type:'message_batch', delay:0,
  messages:[{from:'luci', text:'我在校门口等了两小时。银杏叶落了一地。没事，我先回了。'}]
};

STORY.events['inv_jiangyu_bar_accept'] = {
  type:'advance_time', text:'赴约 · 雾港首唱', minutes:90,
  then:'inv_jiangyu_bar_scene'
};

STORY.events['inv_jiangyu_bar_scene'] = {
  type:'encounter',
  encounter:{
    id:'inv_jiangyu_bar_scene', char:'jiangyu',
    title:'雾港 · 首唱夜',
    desc:'酒吧灯光调到最暗。\n他抱着吉他上台，没看任何人，只看了角落的你一眼。\n"这首新歌，叫《夏》。写给一个名字里带夏的人。"\n副歌唱到一半，他停了：\n"林夏。这首歌的最后一句，我写不出来。"',
    choice:{ prompt:'全场安静下来，等你的回应。',
      options:[
        {text:'我来写最后一句', affection:{jiangyu:3}, reply:'"……好。你写。我唱。"', personality:{active:2, emotional:1}},
        {text:'不需要最后一句', affection:{jiangyu:2}, reply:'"也对。没结局的歌，才听得最久。"', personality:{rational:1}},
        {text:'让我回去想想', affection:{jiangyu:1}, reply:'"不急。我等了三年，不差这一晚。"', personality:{passive:1}}
      ]
    }
  },
  then:'inv_jiangyu_bar_after'
};

STORY.events['inv_jiangyu_bar_after'] = {
  type:'music_unlock', music:'xia'
};

STORY.events['inv_jiangyu_bar_decline'] = {
  type:'message_batch', delay:1,
  messages:[{from:'jiangyu', text:'……好。位置我撤了。'}]
};

STORY.events['inv_jiangyu_bar_miss'] = {
  type:'message_batch', delay:0,
  messages:[{from:'jiangyu', text:'歌唱完了。没人坐那个位置。'}]
};


// 新增赴约照片（供相册解锁）

STORY.events['susu_create_group'] = {
  type:'group_message_batch', delay:1,
  groupId:'group_neon',
  messages:[
    {from:'susu', text:'各位！欢迎来到霓城小分队！本群宗旨：保护林夏，监督各位男士！'},
    {from:'susu', text:'沈砚之先生，听说你让林夏盯开幕式？'},
    {from:'shenyan', text:'……苏苏，这个群为什么有我。'},
    {from:'luci', text:'哈哈哈哈沈砚之被点名了'},
    {from:'jiangyu', text:'……'},
    {from:'susu', text:'林夏不在群里的时候，你们别想偷偷对她怎么样！我都盯着！', choice:{
      prompt:'苏苏@你：夏夏你也说句话！',
      options:[
        {text:'你们几个怎么回事', effects:{affection:{shenyan:1,luci:1,jiangyu:1}, flags:{group_intro:1}, thenEvent:'group_neon_react1'}, hint:'全员 +1'},
        {text:'苏苏你又搞事', effects:{affection:{}, flags:{group_intro:2}, thenEvent:'group_neon_react2'}, hint:'中立'},
        {text:'（潜水围观）', effects:{affection:{shenyan:-1,luci:-1}, flags:{group_intro:3}, thenEvent:'group_neon_react3'}, hint:'沈陆 -1'}
      ]
    }}
  ]
};

STORY.events['group_neon_react1'] = {
  type:'group_message_batch', delay:0, groupId:'group_neon',
  messages:[
    {from:'shenyan', text:'没什么事。工作群而已。'},
    {from:'luci', text:'工作群？沈总你骗谁呢哈哈哈哈'},
    {from:'jiangyu', text:'林夏，别被他们带偏。'}
  ]
};

STORY.events['group_neon_react2'] = {
  type:'group_message_batch', delay:0, groupId:'group_neon',
  messages:[
    {from:'susu', text:'搞事？我这是正义监督！'},
    {from:'luci', text:'林夏你学坏了，跟苏苏一个调调'},
    {from:'shenyan', text:'……'}
  ]
};

STORY.events['group_neon_react3'] = {
  type:'group_message_batch', delay:0, groupId:'group_neon',
  messages:[
    {from:'susu', text:'？？？林夏你潜水？'},
    {from:'luci', text:'她不想理我们'},
    {from:'shenyan', text:'正常。'}
  ]
};


// 闪回触发检查（由 engine.checkFlashbacks 调用）
// 闪回完成后的回调事件（v0.1.6：补上原先 then:null 的断链，让闪回有落点）

STORY.events['fb_highschool_luci_after'] = {
  type:'message_batch', delay:1,
  messages:[
    {from:'luci', text:'照片看完了？', then:'fb_highschool_luci_after_2'}
  ]
};

STORY.events['fb_highschool_luci_after_2'] = {
  type:'message_batch', delay:0,
  messages:[
    {from:'luci', text:'别笑我。这九年，我一直没敢给你看。\n现在敢了——因为你回来了。'}
  ]
};

STORY.events['fb_highschool_jiangyu_after'] = {
  type:'message_batch', delay:1,
  messages:[
    {from:'jiangyu', text:'……还没睡吧。', then:'fb_highschool_jiangyu_after_2'}
  ]
};

STORY.events['fb_highschool_jiangyu_after_2'] = {
  type:'message_batch', delay:0,
  messages:[
    {from:'jiangyu', text:'副歌那两句，今晚突然写完了。\n原来它缺的不是旋律，是一个人。'}
  ]
};

STORY.events['fb_gallery_shenyan_after'] = {
  type:'message_batch', delay:1,
  messages:[
    {from:'shenyan', text:'……你今天去了旧展厅。', then:'fb_gallery_shenyan_after_2'}
  ]
};

STORY.events['fb_gallery_shenyan_after_2'] = {
  type:'message_batch', delay:0,
  messages:[
    {from:'shenyan', text:'那面墙上的《海》，挂了五年。\n它是从一个下午开始画的——那天，展厅里有个人站着看了很久。'}
  ]
};


/* ===== story/01b_day45.js ===== */
/* ===== 霓虹心事 · 剧情数据：day4-5 节奏补齐（v0.9.2）=====
 * 背景：day4 仅 1 条、day5 为 0 条时间触发事件，玩家在这两天缺乏可玩节点。
 * 本文件补 6 条时间事件（day4 通用 1 + 三线各 1；day5 通用 1 + 独行线 1），每条带选择与回复链。
 * 依赖 engine.js v0.9.2 的 trigger.route 过滤。
 */

// ===== day4：通用 =====
STORY.events['day4_rain_walk'] = {
  type:'message_batch', delay:0,
  trigger:{ deferWhenBusy:true, day:4, hour:9 },
  messages:[
    {from:'susu', text:'霓城下雨了！你带伞没？那边雨说来就来。', choice:{
      auto:true,
      prompt:'雨点已经砸在窗上。',
      options:[
        {text:'折回去拿伞', effects:{personality:{rational:1}, thenEvent:'day4_rain_umbrella'}, reply:'（你跑回住处拿了伞。迟到五分钟，但干爽一整天。）'},
        {text:'直接冲进雨里', effects:{personality:{independent:1, emotional:1}, thenEvent:'day4_rain_run'}, reply:'（雨水顺着领口灌进来。奇怪的是，你居然笑了。）'}
      ]
    }}
  ]
};
STORY.events['day4_rain_umbrella'] = {
  type:'message_batch', delay:2,
  messages:[{from:'susu', text:'靠谱！霓城的雨最喜欢欺负没伞的人。'}]
};
STORY.events['day4_rain_run'] = {
  type:'message_batch', delay:2,
  messages:[{from:'susu', text:'疯了吧！到地方记得喝热的，别逞强。'}]
};

// ===== day4：沈砚之线 =====
STORY.events['day4_shenyan_gallery_note'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:9, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'展签初稿写完了。第三段空着——那句"画中人的名字"，我想由你来写。', choice:{
      auto:true,
      prompt:'展签上留着一行空白。',
      options:[
        {text:'写我的名字', effects:{affection:{shenyan:1}, personality:{emotional:1}, thenEvent:'day4_shenyan_note_yes'}, reply:'（你写下自己的名字。笔尖停了一秒才离开纸面。）'},
        {text:'还是留白吧', effects:{affection:{shenyan:-1}, personality:{independent:1}, thenEvent:'day4_shenyan_note_no'}, reply:'（你把笔放下。有些答案，先不写反而更完整。）'}
      ]
    }}
  ]
};
STORY.events['day4_shenyan_note_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'……好。那这一行，就不擦了。'}]
};
STORY.events['day4_shenyan_note_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'留白也是一种答案。我尊重它。'}]
};

// ===== day4：陆辞线 =====
STORY.events['day4_luci_street_photo'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:10, route:'luci' },
  messages:[
    {from:'luci', text:'雨后的光最好看。我在梧桐路，你要不要来当一次模特？只拍一张。', choice:{
      auto:true,
      prompt:'窗外的天色刚放晴。',
      options:[
        {text:'我现在过去', effects:{affection:{luci:1}, personality:{emotional:1}, thenEvent:'day4_luci_photo_yes'}, reply:'（你抓起外套。他在楼下等你，相机已经举起来了。）'},
        {text:'下次吧，今天有点累', effects:{affection:{luci:1}, personality:{rational:1}, thenEvent:'day4_luci_photo_no'}, reply:'（你回绝得很轻。他没有追问，只回了一个"好"。）'}
      ]
    }}
  ]
};
STORY.events['day4_luci_photo_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'别动。……好了。这张我不给别人看。'}]
};
STORY.events['day4_luci_photo_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'好。光会等我，我也会。'}]
};

// ===== day4：江屿线 =====
STORY.events['day4_jiangyu_rehearsal'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:20, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'排练室空着。你要是没地方去，可以来听一段没写完的。', choice:{
      auto:true,
      prompt:'手机屏幕亮着，外面已经入夜。',
      options:[
        {text:'我去听', effects:{affection:{jiangyu:1}, personality:{emotional:1}, thenEvent:'day4_jiangyu_rehearsal_yes'}, reply:'（排练室的门虚掩着。你推门时，他正好按下第一个和弦。）'},
        {text:'不打扰你了', effects:{affection:{jiangyu:1}, personality:{independent:1}, thenEvent:'day4_jiangyu_rehearsal_no'}, reply:'（你把手机扣在桌上。那首歌，今晚只属于他自己。）'}
      ]
    }}
  ]
};
STORY.events['day4_jiangyu_rehearsal_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'……这一段，还没名字。你听完给一个？'}]
};
STORY.events['day4_jiangyu_rehearsal_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'行。等它写完了，第一个给你听。'}]
};

// ===== day5：通用 =====
STORY.events['day5_susu_lunch'] = {
  type:'message_batch', delay:0,
  trigger:{ deferWhenBusy:true, day:5, hour:12 },
  messages:[
    {from:'susu', text:'中午一起吃？我请你吃霓城最辣的粉，吃完什么烦恼都没了。', choice:{
      auto:true,
      prompt:'午饭时间，肚子先替你做了决定。',
      options:[
        {text:'好，老地方见', effects:{personality:{active:1}, thenEvent:'day5_susu_lunch_yes'}, reply:'（你到的时候，苏苏已经点好了两碗，辣得发亮。）'},
        {text:'今天想一个人吃', effects:{personality:{independent:1}, thenEvent:'day5_susu_lunch_no'}, reply:'（你找了个靠窗的位置。一个人吃饭，也不算坏事。）'}
      ]
    }}
  ]
};
STORY.events['day5_susu_lunch_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'susu', text:'看吧！辣一口，霓城就没那么难懂了。'}]
};
STORY.events['day5_susu_lunch_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'susu', text:'行吧。那晚上记得吃点热的，别又糊弄。'}]
};

// ===== day5：独行线 =====
STORY.events['day5_solo_window'] = {
  type:'message_batch', delay:0,
  trigger:{ deferWhenBusy:true, day:7, hour:19, route:'solo' },
  messages:[
    {from:'narrator', text:'（第五天的傍晚。窗外是霓城不眠的灯，屋里只有你。）', choice:{
      auto:true,
      prompt:'一个人待着的第五天。',
      options:[
        {text:'给自己煮一碗面', effects:{personality:{independent:1}, thenEvent:'day5_solo_noodle'}, reply:'（水开了。你把面下进去，忽然觉得这间屋子开始像"家"了。）'},
        {text:'翻出旧照片', effects:{personality:{emotional:1}, thenEvent:'day5_solo_photo'}, reply:'（照片里的人和现在的你隔着几年。你看了很久，才把它放回去。）'}
      ]
    }}
  ]
};
STORY.events['day5_solo_noodle'] = {
  type:'message_batch', delay:2,
  messages:[{from:'narrator', text:'（面好了。你端着碗坐在窗边，霓城的灯一盏一盏亮着。）'}]
};
STORY.events['day5_solo_photo'] = {
  type:'message_batch', delay:2,
  messages:[{from:'narrator', text:'（照片背面写着一个日期。你记得那天，也记得当时没说出口的话。）'}]
};
// ===== day5：沈砚之线 =====
STORY.events['day5_shenyan_afterhours'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:14, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'闭馆了，展厅只剩换灯的活儿。你要是不赶时间——留一盏灯给我就好。', choice:{
      auto:true,
      prompt:'展厅的灯已经灭了一半。',
      options:[
        {text:'留下，帮他扶梯子', effects:{affection:{shenyan:1}, personality:{active:1}, thenEvent:'day5_shenyan_after_yes'}, reply:'（梯子晃了一下。他扶住你的手腕，说："站稳。"）'},
        {text:'先回去，明天见', effects:{affection:{shenyan:1}, personality:{independent:1}, thenEvent:'day5_shenyan_after_no'}, reply:'（你走到门口回头。他自己把最后一盏灯换完了。）'}
      ]
    }}
  ]
};
STORY.events['day5_shenyan_after_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'手别松。……好了，这盏灯的位置，以后就按你扶的高度来。'}]
};
STORY.events['day5_shenyan_after_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'明天见。灯我会一盏一盏点好。'}]
};

// ===== day5：陆辞线 =====
STORY.events['day5_luci_darkroom'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:15, route:'luci' },
  messages:[
    {from:'luci', text:'暗房今天只开一盏红灯。你要不要进来，看一张照片慢慢显影？', choice:{
      auto:true,
      prompt:'暗房的门缝里透出一点红光。',
      options:[
        {text:'进去看', effects:{affection:{luci:1}, personality:{emotional:1}, thenEvent:'day5_luci_dark_yes'}, reply:'（红灯下，照片里的人一点点浮出来——是你。）'},
        {text:'在门口等你', effects:{affection:{luci:1}, personality:{rational:1}, thenEvent:'day5_luci_dark_no'}, reply:'（门再开时，他递出一张还湿着的照片："拍的是门口的光。"）'}
      ]
    }}
  ]
};
STORY.events['day5_luci_dark_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'别急，还要再等一会儿。显影和等人的耐心，是一回事。'}]
};
STORY.events['day5_luci_dark_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'门口的光也很好看。你站在那里的时候，最好看。'}]
};

// ===== day5：江屿线 =====
STORY.events['day5_jiangyu_market'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:21, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'今晚凌晨有鱼市。我要去买条鱼，顺便找点歌里的声音。你来吗？', choice:{
      auto:true,
      prompt:'手机屏幕的光映在天花板上。',
      options:[
        {text:'陪他去', effects:{affection:{jiangyu:1}, personality:{active:1}, thenEvent:'day5_jiangyu_market_yes'}, reply:'（凌晨的鱼市亮着白灯。他挑鱼的动作很熟练，像在调弦。）'},
        {text:'下次吧', effects:{affection:{jiangyu:1}, personality:{independent:1}, thenEvent:'day5_jiangyu_market_no'}, reply:'（你把闹钟关掉。凌晨三点，手机震了一下。）'}
      ]
    }}
  ]
};
STORY.events['day5_jiangyu_market_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'听，这个水声。我找了三个月，就是它。'}]
};
STORY.events['day5_jiangyu_market_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'（语音 20"）：鱼市的潮声。你说下次，那就下次。'}]
};

STORY.events['day8_solo_market'] = {
  type:'message_batch', delay:0,
  trigger:{ day:8, hour:19, route:'solo' },
  messages:[{from:'narrator', text:'（第八天的夜。你给自己买了一束花，插在窗台的玻璃瓶里。）'}]
};
STORY.events['day9_solo_call'] = {
  type:'message_batch', delay:0,
  trigger:{ day:9, hour:19, route:'solo' },
  messages:[{from:'susu', text:'最近怎么样？别老一个人待着。周末要不要出来走走？'}]
};


/* ===== story/01c_day67.js ===== */
/* ===== 霓虹心事 · 剧情数据：day6-7 节奏补齐（v0.9.5）=====
 * 依赖 engine v0.9.5 的调度隔离：主线链进行中时，日常时间事件延后派发。
 */

// ===== day6：通用 =====
STORY.events['day6_city_after_rain'] = {
  type:'message_batch', delay:0,
  trigger:{ deferWhenBusy:true, day:6, hour:10 },
  messages:[
    {from:'susu', text:'雨停了，霓城像被擦过一遍。今天想干点什么？', choice:{
      auto:true,
      prompt:'周六，难得放晴。',
      options:[
        {text:'去江边走', effects:{personality:{active:1}, thenEvent:'day6_city_walk'}, reply:'（江风把云推得很低。你走了很久，没看手机。）'},
        {text:'在家补觉', effects:{personality:{passive:1}, thenEvent:'day6_city_rest'}, reply:'（你睡到下午。醒来时，窗外的光换了角度。）'}
      ]
    }}
  ]
};
STORY.events['day6_city_walk'] = {
  type:'message_batch', delay:2,
  messages:[{from:'narrator', text:'（江边有人在放风筝。线很长，风筝很小。）'}]
};
STORY.events['day6_city_rest'] = {
  type:'message_batch', delay:2,
  messages:[{from:'narrator', text:'（梦里也有一扇窗。醒来时，你不记得窗外是什么。）'}]
};

// ===== day6：沈砚之线 =====
STORY.events['day6_shenyan_archive'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:12, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'档案室有一批旧展资料，我翻了半天没找到那份。你要是没事——来帮我一起？', choice:{
      auto:true,
      prompt:'档案室的灯是暖色的。',
      options:[
        {text:'帮他找', effects:{affection:{shenyan:1}, personality:{active:1}, thenEvent:'day6_shenyan_archive_yes'}, reply:'（你们并肩翻资料。他的袖子蹭到你的手背，谁都没躲。）'},
        {text:'让他自己来', effects:{affection:{shenyan:1}, personality:{independent:1}, thenEvent:'day6_shenyan_archive_no'}, reply:'（你回了一句"加油"。半小时后，他发来照片：找到了。）'}
      ]
    }}
  ]
};
STORY.events['day6_shenyan_archive_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'找到了。……原来和你的入职档案放在一起。'}]
};
STORY.events['day6_shenyan_archive_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'找到了。下次不勉强你。'}]
};

// ===== day6：陆辞线 =====
STORY.events['day6_luci_print'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:8, hour:10, route:'luci' },
  messages:[
    {from:'luci', text:'冲洗店今天出片。有一卷是那天梧桐路的，你要不要一起去取？', choice:{
      auto:true,
      prompt:'天色刚暗，店里的红灯亮着。',
      options:[
        {text:'一起去', effects:{affection:{luci:1}, personality:{emotional:1}, thenEvent:'day6_luci_print_yes'}, reply:'（老板把照片推过来。第一张就是你，背对镜头。）'},
        {text:'改天吧', effects:{affection:{luci:1}, personality:{rational:1}, thenEvent:'day6_luci_print_no'}, reply:'（他一个人去了。回来时说：照片先放我这儿。）'}
      ]
    }}
  ]
};
STORY.events['day6_luci_print_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'这张我留下了。……不是不给你，是还没想好怎么给。'}]
};
STORY.events['day6_luci_print_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'好。它们跑不掉。'}]
};

// ===== day6：江屿线 =====
STORY.events['day6_jiangyu_close'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:8, hour:20, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'打烊了。今天最后一杯，我给自己调了杯，也顺手给你留了一杯无酒精的。', choice:{
      auto:true,
      prompt:'酒吧的灯只剩吧台一盏。',
      options:[
        {text:'等他收工', effects:{affection:{jiangyu:1}, personality:{emotional:1}, thenEvent:'day6_jiangyu_close_yes'}, reply:'（他擦杯子的动作很慢。你们谁都没提回家的事。）'},
        {text:'先回了', effects:{affection:{jiangyu:1}, personality:{independent:1}, thenEvent:'day6_jiangyu_close_no'}, reply:'（你走到门口。他在身后说：路上小心。）'}
      ]
    }}
  ]
};
STORY.events['day6_jiangyu_close_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'这杯叫「散场」。……但今晚我不想散。'}]
};
STORY.events['day6_jiangyu_close_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'路上小心。杯子我给你留着。'}]
};

// ===== day7：沈砚之线 =====
STORY.events['day7_shenyan_review'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:16, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'一周了。布展的复盘我写了两页，留了一页空白——这一页，想听听你的。', choice:{
      auto:true,
      prompt:'一周的第一次复盘。',
      options:[
        {text:'认真写满', effects:{affection:{shenyan:1}, personality:{rational:1}, thenEvent:'day7_shenyan_review_yes'}, reply:'（你写得很慢。他在旁边看，没有催。）'},
        {text:'写一句就好', effects:{affection:{shenyan:1}, personality:{independent:1}, thenEvent:'day7_shenyan_review_no'}, reply:'（你只写了一句。他看了很久，把它折好收起来。）'}
      ]
    }}
  ]
};
STORY.events['day7_shenyan_review_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'……比我预想的多。这一页，我收进档案了。'}]
};
STORY.events['day7_shenyan_review_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'shenyan', text:'一句话也够了。有时候一句比一页重。'}]
};

// ===== day7：陆辞线 =====
STORY.events['day7_luci_walk'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:8, hour:15, route:'luci' },
  messages:[
    {from:'luci', text:'九年前我们也是这么走的，只是那天下雨。要不要再走一次？', choice:{
      auto:true,
      prompt:'旧街的路灯比记忆里矮了一点。',
      options:[
        {text:'走', effects:{affection:{luci:1}, personality:{emotional:1}, thenEvent:'day7_luci_walk_yes'}, reply:'（你们走到那家关门的文具店。他停下，没说话。）'},
        {text:'今天算了', effects:{affection:{luci:1}, personality:{rational:1}, thenEvent:'day7_luci_walk_no'}, reply:'（你站在路口。他把伞撑开，又收起来。）'}
      ]
    }}
  ]
};
STORY.events['day7_luci_walk_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'那年我没敢说的话，今天可以说了吗？'}]
};
STORY.events['day7_luci_walk_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'luci', text:'没关系。路还在这儿。'}]
};

// ===== day7：江屿线 =====
STORY.events['day7_jiangyu_song'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:8, hour:21, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'副歌写完了。我在排练室，想让你第一个听——不过你要是不方便，我录下来也行。', choice:{
      auto:true,
      prompt:'排练室的灯亮着。',
      options:[
        {text:'现在去', effects:{affection:{jiangyu:1}, personality:{emotional:1}, thenEvent:'day7_jiangyu_song_yes'}, reply:'（他唱到第二遍才看你。你发现他手心在出汗。）'},
        {text:'听录音', effects:{affection:{jiangyu:1}, personality:{rational:1}, thenEvent:'day7_jiangyu_song_no'}, reply:'（录音里有一段空白。他说，那是留给你的。）'}
      ]
    }}
  ]
};
STORY.events['day7_jiangyu_song_yes'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'……唱完了。你觉得，它该叫什么？'}]
};
STORY.events['day7_jiangyu_song_no'] = {
  type:'message_batch', delay:2,
  messages:[{from:'jiangyu', text:'行。空白那段，等你来填。'}]
};

/* ===== story/01d_day814.js ===== */
/* ===== 霓虹心事 · 剧情数据：day8-14 路线专属（v0.9.5）=====
 * 每条线 2 条专属事件（day9/day11），依赖 trigger.route 与 v0.9.5 调度隔离。
 */

// ===== 沈砚之线 =====
STORY.events['day9_shenyan_preview'] = {
  type:'message_batch', delay:1,
  trigger:{ deferWhenBusy:true, day:7, hour:18, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'预展今晚只开给内部。你要不要来？灯还没调完。', choice:{
      auto:true,
      prompt:'展厅的灯只亮了一半。',
      options:[
        {text:'留下来看', effects:{affection:{shenyan:1}, personality:{emotional:1}, thenEvent:'day9_shenyan_preview_yes'}, reply:'（空展厅里只有你们两个人。他关掉最后一排灯。）'},
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
  trigger:{ deferWhenBusy:true, day:7, hour:20, route:'shenyan' },
  messages:[
    {from:'shenyan', text:'评论家提前到了。我本来打算一个人应付——你如果在，站在我旁边就好。', choice:{
      auto:true,
      prompt:'会客室的门开着。',
      options:[
        {text:'站他旁边', effects:{affection:{shenyan:1}, personality:{active:1}, thenEvent:'day11_shenyan_critic_yes'}, reply:'（他介绍你时，语气比平时慢。评论家看了你一眼。）'},
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
  trigger:{ deferWhenBusy:true, day:9, hour:10, route:'luci' },
  messages:[
    {from:'luci', text:'有卷底片划伤了。可能是那天赶时间。我想重拍一次，你还愿意当模特吗？', choice:{
      auto:true,
      prompt:'暗房的红灯亮着。',
      options:[
        {text:'陪他重拍', effects:{affection:{luci:1}, personality:{emotional:1}, thenEvent:'day9_luci_negative_yes'}, reply:'（你们拍到天完全黑。他说：这次比上次好。）'},
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
  trigger:{ deferWhenBusy:true, day:9, hour:15, route:'luci' },
  messages:[
    {from:'luci', text:'摄影展下周开幕。我留了一张票给你——不是工作票，是私人票。', choice:{
      auto:true,
      prompt:'一张票压在相机包上。',
      options:[
        {text:'去', effects:{affection:{luci:1}, personality:{emotional:1}, thenEvent:'day11_luci_exhibit_yes'}, reply:'（展厅最里面那张，标签上写着你的名字。）'},
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
  trigger:{ deferWhenBusy:true, day:9, hour:20, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'歌词卡在第二段。写不下去。你要不要来听听，顺便告诉我它缺什么？', choice:{
      auto:true,
      prompt:'排练室的窗开着，风把谱子吹起一角。',
      options:[
        {text:'去听', effects:{affection:{jiangyu:1}, personality:{emotional:1}, thenEvent:'day9_jiangyu_lyric_yes'}, reply:'（他唱到卡住的地方停下。你说：缺一句真话。他笑了。）'},
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
  trigger:{ deferWhenBusy:true, day:9, hour:21, route:'jiangyu' },
  messages:[
    {from:'jiangyu', text:'周五有个小场，唱三首。票不多，给你留了一张。', choice:{
      auto:true,
      prompt:'手机里躺着一张电子票。',
      options:[
        {text:'去', effects:{affection:{jiangyu:1}, personality:{active:1}, thenEvent:'day11_jiangyu_stage_yes'}, reply:'（台下很挤。他唱到第二首时，看向你这边。）'},
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

/* ===== story/02_moments_dreams.js ===== */
/* ===== 霓虹心事 · 剧情数据：朋友圈动态与梦境碎片 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */


Object.assign(STORY, {

  // ===== 朋友圈动态 =====
  moments: {
    // 第一天：沈砚之发美术馆预告
    'moment_shenyan_opening': {
      author:'shenyan',
      text:'砚美术馆夏季展即将开幕。\n这次的主题是「城市与孤独」。\n我们花了三个月，收集了47位艺术家对这座城市的私人记忆。\n——欢迎来看。',
      art:'gallery',
      likes:['luci'],
      comments:[
        {from:'luci', text:'去看的人不会孤独。'}
      ],
      onLike:{affection:{shenyan:1}},
      replyOnLike:'谢谢关注。',
      commentOptions:[
        {text:'一定去！', affection:{shenyan:2}, reply:'届时我会在入口等你。'},
        {text:'主题听起来很沉重', affection:{shenyan:1}, reply:'沉重的是城市，不是展览。看了你会懂。'},
        {text:'（仅点赞不评论）', affection:{shenyan:0}, reply:null}
      ]
    },
    // 第二天：陆辞发霓城夜景摄影
    'moment_luci_neon': {
      author:'luci',
      text:'今晚的霓城。\n高架桥上堵车，反而拍到了最好的光。\n——\n有人说，城市的灯是为孤独的人亮的。\n我觉得，灯是为等人的那个人亮的。',
      art:'city',
      likes:['susu'],
      comments:[
        {from:'susu', text:'啊啊啊好美！这是哪里拍的！'}
      ],
      onLike:{affection:{luci:1}},
      replyOnLike:'你点赞了。这就够了。',
      commentOptions:[
        {text:'等人的那个人，等到了吗？', affection:{luci:2}, reply:'……也许快了。'},
        {text:'拍得真好', affection:{luci:1}, reply:'你笑起来比这好看。'},
        {text:'（仅点赞不评论）', affection:{luci:0}, reply:null}
      ]
    },
    // 第三天：江屿发酒吧驻唱
    'moment_jiangyu_bar': {
      author:'jiangyu',
      text:'今晚雾港。\n有人点了《夏》。\n我没唱。\n——\n有些歌，要等对的人在场才唱。',
      likes:[],
      comments:[],
      onLike:{affection:{jiangyu:2}},
      replyOnLike:'……你来了。',
      commentOptions:[
        {text:'下次唱给我听', affection:{jiangyu:2}, reply:'好。下次。'},
        {text:'为什么是《夏》？', affection:{jiangyu:1}, reply:'等你想知道的那天，我告诉你。'},
        {text:'（仅点赞不评论）', affection:{jiangyu:0}, reply:null}
      ]
    },
    // 开幕式：修罗场动态
    'moment_shenyan_opening_day': {
      author:'shenyan',
      text:'开幕了。\n人来得很齐。\n有一位策展人，今天第一次独立完成了全部流程。\n——林夏，谢谢你。',
      art:'gallery',
      likes:['luci','jiangyu'],
      comments:[
        {from:'luci', text:'恭喜。林夏值得。'},
        {from:'jiangyu', text:'……'}
      ],
      onLike:{affection:{shenyan:2}},
      replyOnLike:'你看到了。',
      commentOptions:[
        {text:'是我应该谢谢您', affection:{shenyan:2}, reply:'别叫我"您"。叫名字。'},
        {text:'这只是开始', affection:{shenyan:1}, reply:'是的。我期待。'},
        {text:'（仅点赞不评论）', affection:{shenyan:0}, reply:null}
      ]
    }
  },


  // ===== 梦境碎片 =====
  dreams: {
    // 第一天睡前：高中回忆
    'dream_day1': {
      title:'梦 · 高三的教室',
      desc:'你又回到了高三那年的教室。\n窗外的蝉鸣很响。\n后座的男生在用笔戳你的背。\n你回头，看不清他的脸。',
      options:[
        {text:'回头对他笑', shard:'少年的侧脸', meaning:'你记得有人为你笑过', personality:{emotional:2, active:1}},
        {text:'假装没感觉，继续做题', shard:'空着的座位', meaning:'你习惯把心事藏起来', personality:{rational:2, passive:1}},
        {text:'趴下睡觉', shard:'蝉鸣里的夏天', meaning:'你想回到那个夏天', personality:{passive:2, emotional:1}}
      ],
      then:'day2_morning'
    },
    // 第二天睡前：画廊的预兆
    'dream_day2': {
      title:'梦 · 空白的画廊',
      desc:'你站在一间空白的画廊里。\n墙上只有一幅画，画的是你的背影。\n有人在画框上写字，你看不清。\n画框开始发烫。',
      options:[
        {text:'伸手去摸那幅画', shard:'烫手的画框', meaning:'你主动靠近危险', personality:{active:2, emotional:1}},
        {text:'后退，离开画廊', shard:'关上的门', meaning:'你选择保护自己', personality:{rational:1, independent:2}},
        {text:'站在原地等', shard:'模糊的字迹', meaning:'你在等别人给你答案', personality:{passive:2, dependent:1}}
      ],
      then:'day3_shenyan_test'
    },
    // 第三天睡前：舞台预兆
    'dream_day3': {
      title:'梦 · 没有观众的舞台',
      desc:'你坐在一个空剧场的观众席。\n台上有人在弹吉他，唱着一首你从没听过的歌。\n他唱到副歌时停了，看向你。\n灯灭了。',
      options:[
        {text:'喊一声"继续"', shard:'黑暗中的回声', meaning:'你敢在黑暗里发声', personality:{active:2, emotional:1}},
        {text:'安静等他继续', shard:'未完的副歌', meaning:'你尊重别人的节奏', personality:{passive:1, rational:2}},
        {text:'摸黑走上台', shard:'触到琴弦的指尖', meaning:'你想靠近那个人的孤独', personality:{active:1, dependent:2, emotional:1}}
      ],
      then:'opening_day'
    }
  },
});


/* ===== story/03_assets.js ===== */
/* ===== 霓虹心事 · 剧情数据：照片、音乐、结局定义 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */


Object.assign(STORY, {

  // ===== 相册 =====
  photos: {
    neon_city: {
      title:'霓城夜景',
      caption:'出租车在高架桥上蜿蜒，窗外是一片流光溢彩的灯海。\n我靠着车窗，看那些光斑在玻璃上拖成长长的尾巴。\n这就是霓城。一座永远不会睡的城市。',
      art:'city'
    },
    rooftop_night: {
      title:'天台',
      caption:'霓城的夜，从这个高度看下去，像一条流动的银河。\n他说："累的时候，适合看灯。"\n灯都懂。',
      art:'rooftop'
    },
    luci_album: {
      title:'九年的相册',
      caption:'第一页是高一军训的我。第二页是高二运动会的我。\n吃饭的我、发呆的我、毕业典礼上哭的我。\n最后一页字条："明天就告白。明天就告白。明天就告白。"\n——他练了九年的告白。',
      art:'album'
    }
  },


  // ===== 音乐 =====
  music: {
    xia: {
      title:'《夏》',
      artist:'江屿',
      duration:'4:32',
      desc:'写给没能活到夏天的妹妹的歌。'
    },
    // v0.6.1（G2）：曲库扩容——江屿音乐人设定补全
    wu: {
      title:'《雾》',
      artist:'渡鸦乐队',
      duration:'3:58',
      desc:'解散前录的最后一首demo。雾散不散，他们没吵出答案。'
    },
    hai: {
      title:'《海》',
      artist:'沈砚之',
      duration:'5:04',
      desc:'他从不放给人听的一首钢琴小品。画《海》的那半年写的。'
    },
    deng: {
      title:'《灯》',
      artist:'林夏',
      duration:'2:47',
      desc:'你在天台那晚之后哼出来的调子。苏苏说像霓城的路灯。'
    },
    bside: {
      title:'《无名 B 面》',
      artist:'江屿',
      duration:'4:19',
      desc:'《夏》的B面。最后一句话是：无事发生。'
    },
    duya: {
      title:'《渡鸦》',
      artist:'渡鸦乐队',
      duration:'5:18',
      desc:'三年前解散前的最后一首。'
    }
  },


  // ===== 结局 =====
  endings: {
    shenyan_good:{title:'未完的画作', tag:'沈砚之 · GOOD END',
      text:'他终于明白，把你留在画框里，便再也看不见你眼里的光。\n美术馆闭馆那天，他把那幅以你为模特的画送进了库房。\n"林夏，下次开展览，你来定主题。"\n你笑着点头。\n——这一次，你们站在同一侧。'},
    shenyan_bad:{title:'镀金的笼', tag:'沈砚之 · BAD END',
      text:'画很美，美到让人忘了呼吸。\n你才发现，自己也只是他收藏的一件作品。\n"别动，你现在的样子，刚刚好。"\n玻璃外是霓城的夜，玻璃内是你的倒影。\n你笑得越完美，他越满意。'},
    shenyan_normal:{title:'画框之外', tag:'沈砚之 · NORMAL END',
      text:'你们把展览做成了彼此都能呼吸的样子。\n工作结束后，他依旧会把咖啡放在你桌上。\n画框之外的事，他没说，你也没有逼问。'},
    shenyan_hidden:{title:'五年前的她', tag:'沈砚之 · HIDDEN END',
      text:'旧画室最深处藏着一张五年前的习作。\n他没有再把过去投射到你身上，只是把那张画交给你。\n你们终于在真相里看见了彼此。'},
    luci_good:{title:'九又二分之一', tag:'陆辞 · GOOD END',
      text:'他在你相册里翻到了那张十年前的合影。\n"我数过，从高一到今天，是九年又一百八十二天。"\n"那还差半年呢？"\n"差半年，凑个十年整，好不好？"\n霓城的烟火刚好升起来。'},
    luci_bad:{title:'未送出的底片', tag:'陆辞 · BAD END',
      text:'他走的那天，把一卷没冲洗的胶卷留在你家门口。\n你后来洗出来，每张都是你。\n最后一张背面写着：\n"我练了九年的告白，最终输给了一句再见。"\n你拨他电话，那头已停机。'},
    luci_normal:{title:'镜头之外', tag:'陆辞 · NORMAL END',
      text:'你们成了最默契的拍摄搭档。\n每次快门落下，他都会先确认你有没有笑。\n镜头之外的关系，谁都没有急着命名。'},
    luci_hidden:{title:'B面歌词', tag:'陆辞 · HIDDEN END',
      text:'旧储物柜里有一张被折过很多次的歌词。\n他承认那些年写下的不是告别，而是没敢寄出的求救。\n你把它放回他掌心，让他自己唱完。'},
    jiangyu_good:{title:'雾散之后', tag:'江屿 · GOOD END',
      text:'他重新拿起了吉他。\n不是为观众，是为坐在吧台最角落的你。\n"那首歌，我终于写完了最后一句。"\n你问是什么。\n他凑到你耳边："她回来了。"\n窗外，霓城的雾第一次散得那么干净。'},
    jiangyu_bad:{title:'最后一首歌', tag:'江屿 · BAD END',
      text:'酒吧歇业那天，他在台上唱了最后一首歌。\n歌词里的人，你听了很久才发现不是你。\n"江屿——"\n"林夏，对不起。你来得太晚了。"\n霓城的雨下了一整夜。'},
    jiangyu_normal:{title:'雾港常客', tag:'江屿 · NORMAL END',
      text:'你成了雾港最熟悉的客人。\n他偶尔唱起那段副歌，又在最后一个音前停住。\n你们都知道，有些伤口不该被催着愈合。'},
    jiangyu_hidden:{title:'夏的另一面', tag:'江屿 · HIDDEN END',
      text:'原版歌词里有两个同名的人。\n他终于肯说起妹妹，也肯承认此刻坐在他身边的是你。\n《夏》的 B 面被填满，雾港第一次亮到天明。'},
    true_ending:{title:'霓城无事', tag:'TRUE END',
      text:'一年后，你办了自己的第一个独立策展。\n主题叫《霓城无事》。\n展厅里没有他们的画像，只有你拍下的这座城市的每一束光。\n开幕那天，三个人都没来。\n你举着酒杯，对着窗外轻轻一笑。\n——有些人路过，是为了让你学会一个人。'},
    solo_good:{title:'霓城独行', tag:'独行线 · GOOD END',
      text:'你感谢每一份善意，却没有把自己交给任何人的期待。\n展览开幕时，霓城的灯一盏盏亮起。\n这一次，你走向的是自己选的方向。'},
    solo_normal:{title:'独立策展人', tag:'独行线 · NORMAL END',
      text:'你收下了帮助，也守住了距离。\n作品按时落地，名字第一次只属于你自己。\n未来还很长，没有必要急着回答所有问题。'},
    solo_bad:{title:'空房间', tag:'独行线 · BAD END',
      text:'你把所有人都隔在门外，也忘了给自己留一扇窗。\n展厅空下来后，霓城的夜显得格外安静。\n你知道独处和孤立从来不是一回事。'},
    solo_hidden:{title:'第四种可能', tag:'独行线 · HIDDEN END',
      text:'你回看一路收集的线索，忽然明白自己从不是任何人的支线。\n故事在你手里翻到新的一页。\n霓城仍旧喧闹，而你终于是自己的主角。'}
  }
});

// ===== v0.1.8: 由 story/18_patches.js 收编的历史增量语句（保持逐字不变） =====
STORY.photos['shenyan_studio'] = {
  title:'私人画室',
  caption:'月光从天窗落下来，照在那幅盖了三年的画上。\n画布上是我的侧脸——比我自己记得的，更年轻，也更倔强。\n他站在画前，像站在一段没说出口的话前。',
  art:'studio'
};

STORY.photos['luci_school'] = {
  title:'九年的旧学校',
  caption:'操场边的银杏又长高了。\n他给我看高一那张偷拍：短发、晒黑、笑得没心没肺。\n"九年又一百八十二天。"他说。\n原来被人默默记得，是这种感觉。',
  art:'school'
};

// 群聊触发事件（在第三天开幕前由苏苏发起）


/* ===== story/04_route_ending.js ===== */
/* ===== 霓虹心事 · 剧情数据：路线选择、结局图鉴、真结局条件与结局判定函数 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// 路线选择数据（由 engine.chooseRoute 触发对应 thenEvent）
STORY.routeChoice = {
  prompt:'夜深了。你决定先回谁的消息？这将决定你的心属于谁。',
  options:[
    {text:'回沈砚之', route:'shenyan', thenEvent:'route_shenyan_start', hint:'进入沈砚之线'},
    {text:'回陆辞', route:'luci', thenEvent:'route_luci_start', hint:'进入陆辞线'},
    {text:'回江屿', route:'jiangyu', thenEvent:'route_jiangyu_start', hint:'进入江屿线'},
    {text:'谁都不回', route:'solo', thenEvent:'route_solo_start', hint:'进入真结局线'}
  ]
};


// ===== v0.0.15 结局图鉴 + 多分支 =====
// 结局分级：GOOD(HE) / NORMAL(NE) / BAD(BE) / HIDDEN(隐藏)
STORY.endingGallery = {
  // 沈砚之线
  shenyan_good:    { id:'shenyan_good',    charId:'shenyan', tier:'GOOD',    name:'月光画室',     desc:'他终于让你走进他的私人画室。那幅画，画了五年，画的是你。' },
  shenyan_normal:  { id:'shenyan_normal',  charId:'shenyan', tier:'NORMAL',  name:'画框之外',     desc:'你们成为工作上的最佳搭档。画框外的事，他没说，你也没问。' },
  shenyan_bad:     { id:'shenyan_bad',     charId:'shenyan', tier:'BAD',     name:'未完成的画',   desc:'画被收起来了。他说，下次再画。但你们都知道没有下次。' },
  shenyan_hidden:  { id:'shenyan_hidden',  charId:'shenyan', tier:'HIDDEN',  name:'五年前的她',   desc:'(隐藏) 他在画室里发现一张五年前的旧画，画的是另一个女孩。' },
  // 陆辞线
  luci_good:       { id:'luci_good',       charId:'luci',    tier:'GOOD',    name:'暗房显影',     desc:'九年又一百八十二天。他终于把那句话对你说了。' },
  luci_normal:     { id:'luci_normal',     charId:'luci',    tier:'NORMAL',  name:'镜头之外',     desc:'你们成为最默契的拍摄搭档。镜头之外的关系，没人挑明。' },
  luci_bad:        { id:'luci_bad',        charId:'luci',    tier:'BAD',     name:'未寄出的信',   desc:'那封信他最终没寄出。九年又一百八十二天，成了永远。' },
  luci_hidden:     { id:'luci_hidden',     charId:'luci',    tier:'HIDDEN',  name:'B面歌词',     desc:'(隐藏) 他在《夏》B面写了一首从未公开的歌，唱的是另一个林夏。' },
  // 江屿线
  jiangyu_good:    { id:'jiangyu_good',    charId:'jiangyu', tier:'GOOD',    name:'《夏》首唱',   desc:'这首歌，是为了等你而写的。B面那首，他只唱给你听。' },
  jiangyu_normal:  { id:'jiangyu_normal',  charId:'jiangyu', tier:'NORMAL',  name:'雾港常客',     desc:'你成了雾港的常客。他的歌单里，总有一首没唱完。' },
  jiangyu_bad:     { id:'jiangyu_bad',     charId:'jiangyu', tier:'BAD',     name:'空白B面',     desc:'B面永远是空白。他说，那首歌不唱了。' },
  jiangyu_hidden:  { id:'jiangyu_hidden',  charId:'jiangyu', tier:'HIDDEN',  name:'夏的另一面',   desc:'(隐藏) 《夏》的原版歌词里，"林夏"其实是两个人。' },
  // solo 线
  solo_good:       { id:'solo_good',       charId:null,      tier:'GOOD',    name:'霓城独行',     desc:'你谁也没选。霓城的夜，依然为你亮着。' },
  solo_normal:     { id:'solo_normal',     charId:null,      tier:'NORMAL',  name:'独立策展人',   desc:'你成了霓城最年轻的独立策展人。' },
  solo_bad:        { id:'solo_bad',        charId:null,      tier:'BAD',     name:'空房间',       desc:'你谁也没选。霓城的灯一盏盏熄了。' },
  solo_hidden:     { id:'solo_hidden',     charId:null,      tier:'HIDDEN',  name:'第四种可能',   desc:'(隐藏) 你发现自己也是某个故事的主角，不是任何人的配角。' },
  true_ending:     { id:'true_ending',     charId:null,      tier:'HIDDEN',  name:'霓城无事',     desc:'(隐藏) 你完成独立策展，也完整地成为了自己。' }
};

// 真结局解锁条件：成就数 ≥ 8 且路线为 solo
STORY.trueEndingUnlockCondition = s => {
  const total = Object.keys(STORY.achievements).length;
  const unlocked = Object.keys(s.achievements||{}).length;
  return unlocked >= Math.ceil(total * 0.6) && s.route === 'solo';
};

// v0.9.7（D2-A′ 原型，默认关闭）：结局链日期门槛。
// null = 现状（一选线就排最终抉择）；设为 9/11/15 时，最终抉择延后到该日再排程。
// 打开前请先看 docs 里 3.5/3.6 的供片曲线：day8 起只有 1–2 条/天，门槛放太早没有意义。
STORY.finaleGate = null;

// 结局判定函数：根据多维 flag 聚合计算实际 endingId
STORY.computeEnding = function(state, route){
  if(!route) return null;  // 未进入任何路线
  if(route === 'solo'){
    if(STORY.trueEndingUnlockCondition?.(state)) return 'true_ending';
    // v0.1.7: 移除从未写入的备用 flag _solo_hidden；新增性格路线——高度独立（≥12）也能解锁隐藏结局
    if((state.collected||[]).length >= 10 || (state.personality?.independent || 0) >= 12) return 'solo_hidden';
    if(state.flags.solo_independent) return 'solo_good';
    if(state.flags.solo_accept) return 'solo_normal';
    return 'solo_bad';
  }
  const flags = state.flags || {};
  const endingChoice = {shenyan:['shenyan_choice','confront','endure'], luci:['luci_choice','accept','miss'], jiangyu:['jiangyu_choice','stay','leave']}[route];
  if(!endingChoice) return null;
  const [choiceKey, goodChoice, badChoice] = endingChoice;
  const hiddenRequired = {shenyan:'memento_pen',luci:'evidence_letter',jiangyu:'evidence_lyrics'}[route];
  // v0.1.8: 数值闭环——选了好结局分支且该线好感达标，也能解锁隐藏结局（与隐藏收集品二选一，只增不拦）
  // v0.9.7: 阈值 15 → 19。实测 good 玩法沈 17 / 陆 18，旧阈值下三局两 HIDDEN，隐藏结局被数值淹没。
  if(flags['_' + route + '_hidden'] || (flags[choiceKey] === goodChoice && ((state.collected||[]).includes(hiddenRequired) || (state.affection?.[route] || 0) >= 19))) return route + '_hidden';
  const positives = {shenyan:['shenyan_resist','shenyan_awaken'],luci:['luci_confess','luci_stop','luci_chase'],jiangyu:['jiangyu_hold','jiangyu_stand']}[route];
  const negatives = {shenyan:['shenyan_obey','shenyan_deny'],luci:['luci_avoid','luci_letgo','luci_giveup'],jiangyu:['jiangyu_leave','jiangyu_silent']}[route];
  const goodCount = positives.filter(key=>flags[key]).length;
  const badCount = negatives.filter(key=>flags[key]).length;
  if(flags[choiceKey] === goodChoice && goodCount > badCount) return route + '_good';
  if(flags[choiceKey] === badChoice && badCount >= goodCount) return route + '_bad';
  return route + '_normal';
};


/* ===== story/05_locations.js ===== */
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
    unlock: {event:'inv_luci_school_accept', dayFallback:7},   // 母校之行邀约后解锁
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
    unlock: {day:2},   // v0.6.7：第二天报到后解锁
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
    unlock: {event:'bar_invitation', dayFallback:3},   // 陆辞带你去过后解锁
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
    unlock: {event:'rooftop_jiangyu_close', dayFallback:5},   // 天台之夜后解锁
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
    unlock: {day:5},   // 熟悉霓城后解锁
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


/* ===== story/06_intel_invitations.js ===== */
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


/* ===== story/07_groups_profiles.js ===== */
/* ===== 霓虹心事 · 剧情数据：群聊剧情与角色主页 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// ===== 多人聊天群 =====
STORY.groups = {
  'group_neon': {
    name:'霓城小分队',
    members:['susu','shenyan','luci','jiangyu'],
    bio:'苏苏拉的秘密群，名为"霓城小分队"，实则盯梢林夏感情动向。',
    trigger: s => s.day >= 3 && !s.flags.group_created_group_neon,
    createEvent: 'susu_create_group'
  }
};


// ===== 男主朋友圈/社交主页 =====
STORY.profiles = {
  shenyan: {
    bio:'砚美术馆主理人。寡言。画过一幅画，画了三年。',
    tags:['#美术馆', '#沉默的人', '#控制欲'],
    relations:[
      {to:'luci', hint:'不喜欢他拍你。看他的眼神像在估价。'},
      {to:'jiangyu', hint:'没说过话，但江屿唱《夏》那晚，他离场了。'}
    ]
  },
  luci: {
    bio:'自由摄影师。九年没换过镜头盖。相机里全是同一个人。',
    tags:['#摄影师', '#九年', '#青梅竹马'],
    relations:[
      {to:'shenyan', hint:'给他拍过封面。后来说"看人的眼神像在估价"，再没合作。'},
      {to:'jiangyu', hint:'雾港的常客。江屿喝多了会跟他借相机。'}
    ]
  },
  jiangyu: {
    bio:'雾港调酒师。前渡鸦乐队主唱。有一首写了三年没写完的歌。',
    tags:['#调酒师', '#前乐队', '#未完的歌'],
    relations:[
      {to:'shenyan', hint:'美术馆开幕那天，他没去。说"那种地方不欢迎我"。'},
      {to:'luci', hint:'跟陆辞喝过几次酒。陆辞说他"心里有人，唱不出来"。'}
    ]
  },
  susu: {
    bio:'大学闺蜜。情报王。霓城小分队群主。',
    tags:['#闺蜜', '#八卦', '#情报网'],
    relations:[
      {to:'shenyan', hint:'朋友在美术馆实习，能搞到内部消息。'},
      {to:'luci', hint:'追过陆辞的摄影展，被陆辞婉拒"我只拍一个人"。'},
      {to:'jiangyu', hint:'雾港常客，跟江屿混得很熟。'}
    ]
  }
};


/* ===== story/08_flashbacks.js ===== */
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


/* ===== story/09_shop_moods.js ===== */
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


/* ===== story/10_tarot_achievements.js ===== */
/* ===== 霓虹心事 · 剧情数据：塔罗、成就、彩蛋成就 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// ===== 塔罗占卜+每日运势 =====
STORY.tarot = {
  // 22张大阿尔卡那精选（节选）
  cards: {
    fool:        { id:'fool',        name:'愚者',     roman:'0',    upright:'今日宜出发。一个看似冲动的决定，会带来意料之外的相遇。', reversed:'警惕鲁莽。今天的"自由"可能是逃避的借口。', hint:{type:'encounter', value:1} },
    magician:    { id:'magician',    name:'魔术师',   roman:'I',    upright:'今日宜主动表达。你有让对方意外的能力。', reversed:'警惕花言巧语。今天听到的承诺，要打个问号。', hint:{type:'affection', value:1} },
    high_priestess:{ id:'high_priestess', name:'女祭司', roman:'II', upright:'今日宜独处。答案藏在安静里。', reversed:'警惕隐瞒。有秘密正在被遮盖。', hint:{type:'memory', value:1} },
    empress:     { id:'empress',     name:'女皇',     roman:'III',  upright:'今日宜温柔。被你温柔以待的人，会记很久。', reversed:'警惕溺爱。过度的包容也是另一种控制。', hint:{type:'affection', value:0.5} },
    emperor:     { id:'emperor',     name:'皇帝',     roman:'IV',   upright:'今日宜坚持。你的原则比想象中重要。', reversed:'警惕强势。把别人按在你的剧本里，会失去他们。', hint:{type:'rational', value:1} },
    lovers:      { id:'lovers',      name:'恋人',     roman:'VI',   upright:'今日宜面对心动。回避比拒绝更伤人。', reversed:'警惕摇摆。三心二意会一无所获。', hint:{type:'affection', value:1.5} },
    chariot:     { id:'chariot',     name:'战车',     roman:'VII',  upright:'今日宜行动。想见的人，就去见。', reversed:'警惕冲动。冲得太快，会错过细节。', hint:{type:'encounter', value:1} },
    hermit:      { id:'hermit',      name:'隐者',     roman:'IX',   upright:'今日宜独行。一个人走，也能走到很远。', reversed:'警惕封闭。一个人久了，会忘了被牵手的温度。', hint:{type:'independent', value:1} },
    wheel:       { id:'wheel',       name:'命运之轮', roman:'X',    upright:'今日宜顺应。转折会自己来，不必硬推。', reversed:'警惕侥幸。运气不会替你做选择。', hint:{type:'luck', value:1} },
    justice:     { id:'justice',     name:'正义',     roman:'XI',   upright:'今日宜诚实。谎话今晚就会反噬。', reversed:'警惕双重标准。你想要的公平，不一定是别人的。', hint:{type:'rational', value:1.5} },
    hanged_man:  { id:'hanged_man',  name:'倒吊人',   roman:'XII',  upright:'今日宜换角度看。难受的位置，看得到不一样的真相。', reversed:'警惕牺牲感。你付出的，不一定是对方需要的。', hint:{type:'memory', value:1} },
    death:       { id:'death',       name:'死神',     roman:'XIII', upright:'今日宜告别。有些东西必须结束，新的才会开始。', reversed:'警惕拖延。不愿结束的关系，会比结束更痛。', hint:{type:'ending_hint', value:1} },
    star:        { id:'star',        name:'星星',     roman:'XVII', upright:'今日宜相信。你等的那束光，正在路上。', reversed:'警惕空洞的期待。希望也需要落地。', hint:{type:'luck', value:1.5} },
    moon:        { id:'moon',        name:'月亮',     roman:'XVIII',upright:'今日宜留意梦。梦在替你说白天不敢说的话。', reversed:'警惕幻觉。你以为看见的，可能只是你想看见的。', hint:{type:'dream', value:1} },
    sun:         { id:'sun',         name:'太阳',     roman:'XIX',  upright:'今日宜真诚地笑。你笑起来，比那幅画好看。', reversed:'警惕强颜欢笑。撑不住的时候，可以不笑。', hint:{type:'affection', value:1} },
    world:       { id:'world',       name:'世界',     roman:'XXI',  upright:'今日宜完成。一件未完成的事，今天可以画上句号。', reversed:'警惕半途而废。终点比起点更需要耐心。', hint:{type:'ending_hint', value:1.5} }
  }
};


// ===== 成就系统+真结局解锁 =====
STORY.achievements = {
  // 对话类
  first_reply:   { id:'first_reply',   name:'初次回应',     icon:'💬', desc:'第一次回复男主消息', condition: s => Object.values(s.conversations).some(c=>c.messages.some(m=>m.from==='me')) },
  perfect_listen:{ id:'perfect_listen',name:'完美倾听者',   icon:'👂', desc:'听完3次电话通话', condition: s => (s.callLog||[]).filter(c=>c.type==='incoming').length >= 3 },
  no_reply:      { id:'no_reply',      name:'已读不回',     icon:'😶', desc:'让一个男主等待回复超过30秒', condition: s => s.flags.followup_triggered === true },
  // 社交类
  moment_star:   { id:'moment_star',   name:'动态之星',     icon:'🌟', desc:'发动态并收到角色互动', condition: s => s.moments.filter(m=>m.author==='me' && (m.likes||[]).length >= 1).length >= 1 },
  group_active:  { id:'group_active',  name:'群聊活跃',     icon:'👥', desc:'在群聊里发过消息', condition: s => {
    let cnt = 0;
    for(const gid in s.groups){ cnt += (s.groups[gid].messages||[]).filter(m=>m.from==='me').length; }
    return cnt >= 1;
  }},
  // 探索类
  explorer:      { id:'explorer',      name:'霓城漫游人',   icon:'🗺️', desc:'前往过所有地点', condition: s => s.flags.visited_all_locations === true },
  memory_keeper: { id:'memory_keeper', name:'记忆收藏家',   icon:'🖼️', desc:'解锁3张以上相册照片', condition: s => s.photos.length >= 3 },
  dream_walker:  { id:'dream_walker',  name:'梦境行者',     icon:'🌙', desc:'收集3个以上梦境碎片', condition: s => s.dreamShards.length >= 3 },
  tarot_believer:{ id:'tarot_believer',name:'占卜信徒',     icon:'🔮', desc:'连续3天抽塔罗', condition: s => {
    const days = new Set((s.tarotHistory||[]).map(t=>t.day).filter(Number.isFinite));
    const end = Math.max(...days, -Infinity);
    return Number.isFinite(end) && [end, end-1, end-2].every(day=>days.has(day));
  }},
  gift_giver:    { id:'gift_giver',    name:'心意传递',     icon:'🎁', desc:'送出第一份礼物', condition: s => (s.gifts||[]).length >= 1 },
  mood_explorer: { id:'mood_explorer', name:'情绪光谱',     icon:'🎭', desc:'体验过4种以上不同心情', condition: s => {
    const set = new Set((s.moodHistory||[]).map(m=>m.mood));
    return set.size >= 4;
  }},
  // 剧情类
  flashback_seen:{ id:'flashback_seen',name:'回望那年',   icon:'⏳', desc:'触发闪回/前传章节', condition: s => Object.keys(s.flashbacksSeen||{}).length >= 1 },
  invitation_accepted:{ id:'invitation_accepted', name:'赴约之人', icon:'💌', desc:'接受过一次邀约', condition: s => Object.values(s.resolvedInvitations||{}).some(v=>v==='accepted') },
  // 隐藏成就
  three_routes:  { id:'three_routes',  name:'心三向',       icon:'💗', desc:'(隐藏) 同时被三位男主的好感度推到5以上', condition: s => s.affection.shenyan>=5 && s.affection.luci>=5 && s.affection.jiangyu>=5 },
  solo_path:     { id:'solo_path',     name:'独行侠',       icon:'🌑', desc:'(隐藏) 选择"谁都不回"路线', condition: s => s.route === 'solo' }
};


// 隐藏彩蛋：满足特定条件触发
STORY.easterEggs = {
  egg_midnight:    { id:'egg_midnight',    name:'深夜来电',     icon:'🌙', desc:'凌晨3点还在和某个人通话，霓城的夜，比想象的深。', condition: s => Object.keys(s.callLog||{}).length >= 3 && s.flags.midnight_call === true },
  egg_three_hearts:{ id:'egg_three_hearts',name:'三心一意',     icon:'💗', desc:'同一晚让三个男主都为你失眠。', condition: s => s.affection.shenyan>=3 && s.affection.luci>=3 && s.affection.jiangyu>=3 },
  egg_ghost_msg:   { id:'egg_ghost_msg',   name:'幽灵消息',     icon:'👻', desc:'收到一条来自五年前的消息。', condition: s => s.flags.ghost_msg_triggered === true },
  egg_diary_7:     { id:'egg_diary_7',     name:'七天日记',     icon:'📖', desc:'连续七天写内心独白，霓城开始听你的话。', condition: s => (s.diary||[]).length >= 7 },
  egg_tarot_world: { id:'egg_tarot_world', name:'命运之轮',     icon:'☸️', desc:'抽到"世界"牌的那一天，你做出了某个决定。', condition: s => (s.tarotHistory||[]).some(t=>t.cardId==='world') },
  egg_solo_route:  { id:'egg_solo_route',  name:'独行侠',       icon:'🌑', desc:'不依附任何一条路线，走完了霓城。', condition: s => s.route === 'solo' },
  egg_gift_all:    { id:'egg_gift_all',    name:'心意传递',     icon:'🎁', desc:'给三位男主各送出一份礼物。', condition: s => {
    const recipients = new Set((s.gifts||[]).map(g=>g.to));
    return recipients.has('shenyan') && recipients.has('luci') && recipients.has('jiangyu');
  }},
  egg_collector:   { id:'egg_collector',   name:'霓城收藏家',   icon:'🏆', desc:'集齐10件以上收集品。', condition: s => (s.collected||[]).length >= 10 }
};


/* ===== story/11_collectibles_puzzles.js ===== */
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
  stamp_bff:        { id:'stamp_bff',        cat:'stamp',     name:'闺蜜暗号邮戳',    icon:'🔐', desc:'苏苏的闺蜜暗号刻成的邮戳：1350，友谊不过期。', how:'解开「苏苏的闺蜜暗号」谜题' },
  // v0.5.10（F4）：节日限定（现实日期触发，跨周目可集齐）
  ticket_solstice:  { id:'ticket_solstice',  cat:'ticket',    name:'冬至饺子券',      icon:'🥟', desc:'雾港的冬至限定：饺子汤圆双拼，两种都热。', how:'冬至（12月21日）登录' },
  postcard_fireworks:{ id:'postcard_fireworks', cat:'postcard', name:'跨年烟花明信片', icon:'🎆', desc:'零点的江边灯串连成一条河。背面写着：新年也要来看。', how:'跨年夜（12月31日）登录' },
  stamp_sakura:     { id:'stamp_sakura',     cat:'stamp',     name:'春樱邮戳',        icon:'🌸', desc:'巷口第一株樱花的落款。苏苏说：樱花只开十天，邮戳能留一年。', how:'春分（3月20日）登录' }
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


/* ===== story/12_seasons_perspectives.js ===== */
/* ===== 霓虹心事 · 剧情数据：季节节日与男主视角 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// ===== v0.0.10 季节系统+节日事件 =====
STORY.seasons = {
  // 起始日期：7月15日（夏天）
  startDate: { month:7, date:15 },
  // 季节判定
  getSeason(month){
    if(month >= 3 && month <= 5) return 'spring';
    if(month >= 6 && month <= 8) return 'summer';
    if(month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  },
  seasonInfo: {
    spring:{ id:'spring', name:'春', icon:'🌸', color:'#ffb7c5', desc:'樱花飘进霓城的巷子' },
    summer:{ id:'summer', name:'夏', icon:'☀️', color:'#fbbf24', desc:'霓城的夜，亮得最早' },
    autumn:{ id:'autumn', name:'秋', icon:'🍂', color:'#d97706', desc:'银杏把整条街染成金' },
    winter:{ id:'winter', name:'冬', icon:'❄️', color:'#7dd3fc', desc:'霓城的第一场雪，落在你肩头' }
  },
  // 节日事件：按 月-日 触发
  holidays: {
    // ===== v0.5.10（F4）：现实世界季节事件——按玩家设备月-日触发（纯数据，节日限定收集品×3）=====
    '10-24': { id:'frost_descent', name:'霜降', icon:'❄️', text:'霜降。霓城的夜风开始带刀子，便利店的热饮柜换上了第二排。', effect:{ flag:'frost_descent_seen' } },
    '12-21': { id:'winter_solstice', name:'冬至', icon:'🥟', text:'冬至。北方吃饺子，南方吃汤圆——雾港今晚两种都备了。', effect:{ collectible:'ticket_solstice' } },
    '12-31': { id:'new_years_eve', name:'跨年夜', icon:'🎆', text:'跨年夜。整条江边的灯串亮到零点，霓城在倒数里换了一年。', effect:{ collectible:'postcard_fireworks' } },
    '3-20':  { id:'spring_equinox', name:'春分', icon:'🌸', text:'春分。老城区的巷子口，第一株樱花开得毫无预兆。', effect:{ collectible:'stamp_sakura' } },

    '7-15':  { id:'arrive_day',  name:'抵达霓城纪念日', icon:'🌃', text:'一年前的今天，你第一次踏上霓城。', effect:{ coins:100 } },
    '8-10':  { id:'luci_birthday', name:'陆辞生日', icon:'🎂', text:'陆辞的生日。他没告诉你，但苏苏发来提醒。', effect:{ flag:'luci_birthday_known' } },
    '8-25':  { id:'jiangyu_first_song', name:'《夏》首唱纪念日', icon:'🎤', text:'一年前的今天，江屿在雾港首唱了《夏》。', effect:{ coins:100 } },
    '9-12':  { id:'shenyan_birthday', name:'沈砚之生日', icon:'🎂', text:'沈砚之的生日。他从不过，但你可以提醒他。', effect:{ flag:'shenyan_birthday_known' } },
    '10-1':  { id:'national_day', name:'霓城艺术节', icon:'🎭', text:'霓城一年一度的艺术节，全城展览开幕。', effect:{ flag:'art_festival' } },
    '10-15': { id:'luci_reunion', name:'与陆辞重逢纪念日', icon:'💫', text:'一年前的今天，你和陆辞在砚美术馆重逢。', effect:{} },
    '11-11': { id:'singles_day', name:'独行节', icon:'🌑', text:'霓城的独行节。一个人的城市，也可以很热闹。', effect:{ flag:'solo_day', personality:{independent:1} } },
    '12-24': { id:'christmas_eve', name:'平安夜', icon:'🎄', text:'平安夜。霓城的雪下了整整一夜。', effect:{ flag:'christmas_eve', personality:{emotional:1} } },
    '12-25': { id:'christmas', name:'圣诞节', icon:'🎅', text:'圣诞节。某个男主发来一张匿名礼物图。', effect:{ flag:'christmas' } },
    '2-14':  { id:'valentine', name:'情人节', icon:'💝', text:'情人节。霓城的玫瑰卖到缺货。', effect:{ flag:'valentine_day' } },
    '6-9':   { id:'jiangyu_birthday', name:'江屿生日', icon:'🎂', text:'江屿的生日。他不会告诉任何人。', effect:{ flag:'jiangyu_birthday_known' } }
  }
};


// ===== v0.0.10 男主视角+反向剧情 =====
// 通关后解锁：以男主身份重看关键剧情，揭示他们没说出口的内心独白
STORY.malePerspectives = {
  shenyan: {
    charId:'shenyan',
    title:'沈砚之的视角',
    unlockCondition: s => (s.endingSeen||{}).shenyan_good || (s.endingSeen||{}).shenyan_bad,
    scenes:[
      {
        id:'mps_1',
        title:'第一次收到她的联系方式',
        time:'第一天清晨',
        narration:'导师把她的联系方式给我。林夏。我重复了一遍这个名字，没由来地，想起五年前那幅没画完的画。',
        innerVoice:'我以为自己早就过了会被一个名字打动的年纪。',
        choice:{
          prompt:'你要怎么开口？',
          options:[
            { text:'直接约她报到', inner:'不要让她觉得我太在意。' },
            { text:'加一句"我讨厌不守时"', inner:'让她知道，我的规则。' }
          ]
        }
      },
      {
        id:'mps_2',
        title:'开幕式前，她在展厅',
        time:'开幕式当天',
        narration:'她站在展厅中央，背对我，看着那幅画。灯光从她身后打下来，像为她量身定做的。',
        innerVoice:'陆辞说得对。她笑起来比那幅画好看。但我不会说出口。',
        choice:{
          prompt:'你要走过去吗？',
          options:[
            { text:'走过去，给她介绍人', inner:'让她进入我的世界。' },
            { text:'站在原地多看一眼', inner:'就一眼。然后假装刚才没在看她。' }
          ]
        }
      },
      {
        id:'mps_3',
        title:'南方出差，她睡着了',
        time:'沈砚之线 · 南方',
        narration:'飞机上她靠着窗户睡着了。我把外套盖在她身上，她没醒。窗外的云像海。',
        innerVoice:'我已经很多年没有，想要保护一个人的冲动了。',
        choice:{
          prompt:'你要叫醒她吗？',
          options:[
            { text:'让她多睡一会儿', inner:'就一会儿。这个时间，是属于我的。' },
            { text:'轻轻叫醒她', inner:'别让她错过云海。' }
          ]
        }
      }
    ],
    truthEnding:{
      title:'真相 · 沈砚之',
      text:'他第一次见你，不是在导师给联系方式的那个清晨。\n\n是五年前。你还在读大二，跟着陆辞来霓城看展，第一次走进这间美术馆。你站在一幅画前看了很久，回头对陆辞笑了一下。\n\n那个笑，他画了五年，没画完。\n\n直到你以策展人的身份，重新出现在他的展厅。'
    }
  },
  luci: {
    charId:'luci',
    title:'陆辞的视角',
    unlockCondition: s => (s.endingSeen||{}).luci_good || (s.endingSeen||{}).luci_bad,
    scenes:[
      {
        id:'mpl_1',
        title:'听说新策展人叫林夏',
        time:'第一天',
        narration:'朋友告诉我，砚美术馆新来的策展人叫林夏。我握着相机的手抖了一下。',
        innerVoice:'九年了。我以为我已经忘了这个名字。',
        choice:{
          prompt:'你要主动联系她吗？',
          options:[
            { text:'装作不认识，发消息给她', inner:'让她以为，我只是一时没认出来。' },
            { text:'直接告诉她我记得', inner:'不想再假装了。' }
          ]
        }
      },
      {
        id:'mpl_2',
        title:'她问"离他远点是什么意思"',
        time:'第三天',
        narration:'我脱口而出"离他远点"。她追问，我说了沈砚之看人像估价。其实我想说的是另一句。',
        innerVoice:'我想说的是：离他远点，离我近一点。',
        choice:{
          prompt:'你要说真话吗？',
          options:[
            { text:'说真话', inner:'九年了，不能再错过了。' },
            { text:'忍住，说一句模糊的话', inner:'她现在，还没准备好听这句话。' }
          ]
        }
      },
      {
        id:'mpl_3',
        title:'旧学校的银杏',
        time:'陆辞线 · 旧学校',
        narration:'带她回到旧学校。操场边的银杏又黄了。九年又一百八十二天。我想说一句"我喜欢你"，从高中就想说。',
        innerVoice:'但我只敢说"想给你拍张照"。',
        choice:{
          prompt:'按下快门前，你要说什么？',
          options:[
            { text:'什么都不说，按下快门', inner:'有些话，藏在照片里就好。' },
            { text:'说一句"笑一个"', inner:'至少，让她笑给我看。' }
          ]
        }
      }
    ],
    truthEnding:{
      title:'真相 · 陆辞',
      text:'那封没寄出的信，其实写了一百多封。\n\n每一年的今天，他都写一封。写到第九年，他终于鼓起勇气，把第一封信揣进口袋，去砚美术馆找你。\n\n但他没想到，重逢那一刻，他什么都说不出口。\n\n他只说了一句："诶诶诶！！！林夏是你吗？？？"\n\n其实他想说的是："我找了你九年。"'
    }
  },
  jiangyu: {
    charId:'jiangyu',
    title:'江屿的视角',
    unlockCondition: s => (s.endingSeen||{}).jiangyu_good || (s.endingSeen||{}).jiangyu_bad,
    scenes:[
      {
        id:'mpj_1',
        title:'她推门进雾港',
        time:'第一天',
        narration:'雾港的门被推开，她跟着陆辞走进来。我正在调一杯"夏"。',
        innerVoice:'她的名字，跟我写过的一首歌一样。 coincidence？',
        choice:{
          prompt:'第一杯酒，你要怎么给？',
          options:[
            { text:'算我请的', inner:'想让她记住雾港。' },
            { text:'收她的钱', inner:'保持距离。我不能再被打动。' }
          ]
        }
      },
      {
        id:'mpj_2',
        title:'深夜给她打电话',
        time:'第一天深夜',
        narration:'我打了电话给她。我说"没什么事，只是想确认一下"。其实我想说的是另一句。',
        innerVoice:'我想说：你叫林夏。我写过一首歌叫《夏》。这首歌我唱了五年，从来没敢公开。',
        choice:{
          prompt:'你要告诉她这首歌吗？',
          options:[
            { text:'告诉她，但说只是巧合', inner:'试探她的反应。' },
            { text:'不说，让她自己发现', inner:'她发现的那一天，就是答案。' }
          ]
        }
      },
      {
        id:'mpj_3',
        title:'天台，灯亮着',
        time:'开幕式当晚',
        narration:'天台上她靠过来一点。霓城的灯，亮着却没人懂。',
        innerVoice:'我也是。亮了五年，没人懂。',
        choice:{
          prompt:'你要开口吗？',
          options:[
            { text:'唱一句《夏》给她听', inner:'就一句。剩下的，让她猜。' },
            { text:'只是看着灯', inner:'有些话，唱出来就破坏了。' }
          ]
        }
      }
    ],
    truthEnding:{
      title:'真相 · 江屿',
      text:'《夏》不是巧合。\n\n五年前的夏天，他在霓城的天台上，第一次见到你。你跟着陆辞，笑着从楼下走过。\n\n那一晚他写了《夏》。歌词里的"林夏"，就是你。\n\n他唱了五年，没人知道这首歌是写给谁的。\n\n直到你推门走进雾港，他终于知道了：这首歌，是为了等你而写的。'
    }
  }
};


/* ===== story/13_player_relationship.js ===== */
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


/* ===== story/14_critical_daily.js ===== */
/* ===== 霓虹心事 · 剧情数据：临界事件、每日任务与观赏模式 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// 临界事件：进入新阶段时触发的特殊事件
STORY.criticalEvents = {
  shenyan_critical_3: {
    id:'shenyan_critical_3', charId:'shenyan', stage:3,
    type:'message_batch', delay:1,
    messages:[
      { from:'shenyan', text:'林夏。我有些话，想当面跟你说。', then:'shenyan_critical_3_2' }
    ]
  },
  shenyan_critical_3_2: {
    type:'message_batch', delay:0,
    messages:[
      { from:'shenyan', text:'明天有空吗。', choice:{
        prompt:'沈砚之想约你。',
        options:[
          { text:'有。', effects:{ affection:{shenyan:1}, flags:{shenyan_critical_3_accepted:true}, thenEvent:'shenyan_critical_3_reply_yes' }, hint:'沈砚之 +1' },
          { text:'最近有点忙…', effects:{ affection:{shenyan:0}, thenEvent:'shenyan_critical_3_reply_no' }, hint:'他会等你' }
        ]
      }}
    ]
  },
  shenyan_critical_3_reply_yes: {
    type:'message_batch', delay:1,
    messages:[
      { from:'shenyan', text:'明天，办公室。', then:'shenyan_critical_3_reply_yes_2' }
    ]
  },
  shenyan_critical_3_reply_yes_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'shenyan', text:'……谢谢。有些话，我憋了很久。' }]
  },
  shenyan_critical_3_reply_no: {
    type:'message_batch', delay:1,
    messages:[
      { from:'shenyan', text:'好。那就改天。', then:'shenyan_critical_3_reply_no_2' }
    ]
  },
  shenyan_critical_3_reply_no_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'shenyan', text:'我不催你。但我会记得，你欠我一次。' }]
  },
  luci_critical_3: {
    id:'luci_critical_3', charId:'luci', stage:3,
    type:'message_batch', delay:1,
    messages:[
      { from:'luci', text:'林夏，周末有空吗？带你去一个地方。', then:'luci_critical_3_2' }
    ]
  },
  luci_critical_3_2: {
    type:'message_batch', delay:0,
    messages:[
      { from:'luci', text:'是我们以前的学校。九年了，我想带你回去看看。', choice:{
        prompt:'陆辞想带你去旧学校。',
        options:[
          { text:'好。', effects:{ affection:{luci:1}, flags:{luci_critical_3_accepted:true}, thenEvent:'luci_critical_3_reply_yes' }, hint:'陆辞 +1' },
          { text:'现在…还不行。', effects:{ affection:{luci:0}, thenEvent:'luci_critical_3_reply_no' }, hint:'他会等你准备好' }
        ]
      }}
    ]
  },
  luci_critical_3_reply_yes: {
    type:'message_batch', delay:1,
    messages:[
      { from:'luci', text:'说定了！明天下午三点，校门口见。', then:'luci_critical_3_reply_yes_2' }
    ]
  },
  luci_critical_3_reply_yes_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'luci', text:'带双舒服的鞋。要走很多路——我想带你看完每一处。' }]
  },
  luci_critical_3_reply_no: {
    type:'message_batch', delay:1,
    messages:[
      { from:'luci', text:'没事。我等。', then:'luci_critical_3_reply_no_2' }
    ]
  },
  luci_critical_3_reply_no_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'luci', text:'九年都等了，不差这几天。' }]
  },
  jiangyu_critical_3: {
    id:'jiangyu_critical_3', charId:'jiangyu', stage:3,
    type:'message_batch', delay:1,
    messages:[
      { from:'jiangyu', text:'今晚雾港，有我新歌的首唱。', then:'jiangyu_critical_3_2' }
    ]
  },
  jiangyu_critical_3_2: {
    type:'message_batch', delay:0,
    messages:[
      { from:'jiangyu', text:'你来吗。', choice:{
        prompt:'江屿邀请你听首唱。',
        options:[
          { text:'去。', effects:{ affection:{jiangyu:1}, flags:{jiangyu_critical_3_accepted:true}, thenEvent:'jiangyu_critical_3_reply_yes' }, hint:'江屿 +1' },
          { text:'今晚有事…', effects:{ affection:{jiangyu:0}, thenEvent:'jiangyu_critical_3_reply_no' }, hint:'他会等你下次' }
        ]
      }}
    ]
  },
  jiangyu_critical_3_reply_yes: {
    type:'message_batch', delay:1,
    messages:[
      { from:'jiangyu', text:'……好。位置我留着。', then:'jiangyu_critical_3_reply_yes_2' }
    ]
  },
  jiangyu_critical_3_reply_yes_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'jiangyu', text:'第一排。只有你一个位子。' }]
  },
  jiangyu_critical_3_reply_no: {
    type:'message_batch', delay:1,
    messages:[
      { from:'jiangyu', text:'……好。', then:'jiangyu_critical_3_reply_no_2' }
    ]
  },
  jiangyu_critical_3_reply_no_2: {
    type:'message_batch', delay:0,
    messages:[{ from:'jiangyu', text:'歌会留着。等你哪天想听。' }]
  }
};


// ===== v0.0.13 每日任务+连胜奖励 =====
STORY.dailyTasks = {
  // 任务模板池：每日随机抽 3 个
  pool: [
    { id:'task_reply',    name:'今日回复',     desc:'回复任意一位男主的消息',     check: s => Object.values(s.conversations||{}).some(c=>c.messages.some(m=>m.from==='me' && m.day===s.lastTaskDay)), reward:{coins:30} },
    { id:'task_tarot',    name:'今日占卜',     desc:'抽一次塔罗',                 check: s => s.lastTarotDay === s.lastTaskDay, reward:{coins:20} },
    { id:'task_gift',     name:'今日送礼',     desc:'给任意一位男主送一份礼物',   check: s => (s.gifts||[]).some(g=>g.day === s.lastTaskDay), reward:{coins:50} },
    { id:'task_mood',     name:'今日心情',     desc:'切换一次心情',               check: s => (s.moodHistory||[]).some(m=>m.day === s.lastTaskDay), reward:{coins:15} },
    { id:'task_diary',    name:'今日独白',     desc:'写一段内心独白',             check: s => (s.diary||[]).some(d=>d.day === s.lastTaskDay), reward:{coins:25} },
    { id:'task_moment',   name:'今日动态',     desc:'发一条朋友圈',               check: s => (s.moments||[]).some(m=>m.author==='me' && m.day===s.lastTaskDay), reward:{coins:35} },
    { id:'task_explore',  name:'今日出行',     desc:'前往一个新地点',             check: s => (s.locationVisits||[]).some(v=>v.day===s.lastTaskDay), reward:{coins:40} },
    { id:'task_call',     name:'今日通话',     desc:'接听或拨出一次电话',         check: s => (s.callLog||[]).some(c=>c.day === s.lastTaskDay), reward:{coins:30} },
    { id:'task_puzzle',   name:'今日解谜',     desc:'尝试解开一个谜题',           check: s => Object.values(s.puzzleProgress||{}).some(p=>p.lastAttemptDay === s.lastTaskDay), reward:{coins:45} }
  ],
  // 连胜奖励：连续 N 天完成所有任务
  // v0.1.7: 连胜奖励改为金币——收集品由剧情节点唯一发放（postcard_neon/stamp_first/ticket_bar 去重）
  streakRewards: [
    { days:3,  reward:{ coins:200 },          name:'三日连胜', desc:'连续3天完成所有日常' },
    { days:7,  reward:{ coins:600 },          name:'七日连胜', desc:'连续7天完成所有日常' },
    { days:14, reward:{ coins:800, flag:'streak_master' }, name:'半月连胜', desc:'连续14天完成所有日常' }
  ]
};


// ===== v0.0.13 观赏模式+自动推进 =====
STORY.watchMode = {
  // 观赏模式下的默认选择策略
  strategies: {
    balanced:   { id:'balanced',   name:'平衡',   desc:'均衡选择，体验完整剧情',     pick: opts => Math.floor(opts.length / 2) },
    affection:  { id:'affection',  name:'好感优先', desc:'优先选择好感度+最高的选项',  pick: opts => {
      let best = 0, bestIdx = 0;
      opts.forEach((o, i) => {
        const aff = (o.effects?.affection && Object.values(o.effects.affection).reduce((a,b)=>a+b,0)) || 0;
        if(aff > best){ best = aff; bestIdx = i; }
      });
      return bestIdx;
    }},
    rational:   { id:'rational',   name:'理性',   desc:'优先选择理性/独立型选项',     pick: opts => {
      let best = -1, bestIdx = 0;
      opts.forEach((o, i) => {
        const p = o.effects?.personality || {};
        const score = (p.rational||0) + (p.independent||0);
        if(score > best){ best = score; bestIdx = i; }
      });
      return bestIdx;
    }},
    emotional:  { id:'emotional',  name:'感性',   desc:'优先选择感性/情感型选项',     pick: opts => {
      let best = -1, bestIdx = 0;
      opts.forEach((o, i) => {
        const p = o.effects?.personality || {};
        const score = (p.emotional||0) + (p.dependent||0);
        if(score > best){ best = score; bestIdx = i; }
      });
      return bestIdx;
    }},
    random:     { id:'random',     name:'随机',   desc:'完全随机选择，体验不同结局',  pick: opts => Math.floor(Math.random() * opts.length) }
  },
  // 自动推进间隔（毫秒）
  autoAdvanceDelay: 1500,
  // 观赏模式下是否自动抽塔罗/写日记等日常
  autoDoDaily: true
};


/* ===== story/15_affection_themes.js ===== */
/* ===== 霓虹心事 · 剧情数据：好感深度维度与主题/图标主题 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// ===== v0.0.15 好感度深度系统 =====
// 在 state.affection[charId] 综合分之上，新增三轴：closeness(亲密度) / trust(信任度) / tension(暧昧度)
// 旧 effects.affection{charId:n} 仍驱动综合分；三轴按 50%/30%/20% 自动折算
// 新 effects.affectionDetail{charId:{closeness:x,trust:y,tension:z}} 可精细驱动
STORY.affectionDimensions = {
  closeness: { id:'closeness', name:'亲密度', icon:'🤝', color:'#4ade80', desc:'一起经历过的事越多越亲密' },
  trust:     { id:'trust',     name:'信任度', icon:'🔐', color:'#7a5cff', desc:'他愿意对你敞开心扉的程度' },
  tension:   { id:'tension',   name:'暧昧度', icon:'💫', color:'#ff5fa8', desc:'心跳加速的瞬间累积' }
};

// 三轴阶段定义（每轴 4 段，独立于关系阶段系统）
STORY.affectionDimStages = {
  closeness: [
    { min:0,  max:5,  name:'点头之交' },
    { min:6,  max:15, name:'熟悉' },
    { min:16, max:30, name:'知己' },
    { min:31, max:99, name:'生死之交' }
  ],
  trust: [
    { min:0,  max:5,  name:'戒备' },
    { min:6,  max:15, name:'信赖' },
    { min:16, max:30, name:'交心' },
    { min:31, max:99, name:'托付' }
  ],
  tension: [
    { min:0,  max:5,  name:'平淡' },
    { min:6,  max:15, name:'微澜' },
    { min:16, max:30, name:'心跳' },
    { min:31, max:99, name:'炽热' }
  ]
};


// ===== v0.0.15 手机主题/壁纸系统 =====
// v0.1.7: wallpaperImage 为程序化生成的壁纸（tools/generate_wallpapers.py），
// 由 ui/18 applyThemeToBody 叠加在 CSS 渐变之上——图片缺失时回退为纯渐变
STORY.themes = {
  default: { id:'default', name:'霓虹初遇', bg:'#0a0612', accent:'#ff5fa8', wallpaper:'gradient', wallpaperVar:'linear-gradient(160deg,#1a0a2e 0%,#2a0f4a 40%,#0a0712 100%)', unlockDesc:'默认主题', unlockCondition: null },
  starry:  { wallpaperImage:'assets/wallpapers/starry.jpg', id:'starry',  name:'星夜', bg:'#0a0a2a', accent:'#7a5cff', wallpaper:'stars',  wallpaperVar:'radial-gradient(circle at 30% 20%,#3a2a6a 0%,transparent 40%),radial-gradient(circle at 70% 60%,#5a2a4a 0%,transparent 40%),linear-gradient(160deg,#0a0a2a 0%,#1a1a4a 50%,#050518 100%)', unlockDesc:'收集3张梦境碎片解锁', unlockCondition: s => (s.dreamShards||[]).length >= 3 },
  sea:     { wallpaperImage:'assets/wallpapers/sea.jpg', id:'sea',     name:'海雾', bg:'#0a2a3a', accent:'#4ade80', wallpaper:'waves',  wallpaperVar:'linear-gradient(160deg,#0a2a3a 0%,#1a4a5a 40%,#050f18 100%)', unlockDesc:'南方出差剧情解锁', unlockCondition: s => s.flags.shenyan_south === true },
  sunset:  { wallpaperImage:'assets/wallpapers/sunset.jpg', id:'sunset',  name:'暮色', bg:'#2a1a0a', accent:'#fbbf24', wallpaper:'sunset', wallpaperVar:'linear-gradient(160deg,#2a1a0a 0%,#6a3a1a 30%,#fbbf24 70%,#ff5fa8 100%)', unlockDesc:'天台剧情解锁', unlockCondition: s => !!(s.photos||[]).find(p=>p.id==='rooftop_night') },
  ink:     { wallpaperImage:'assets/wallpapers/ink.jpg', id:'ink',     name:'水墨', bg:'#1a1a1a', accent:'#e5e5e5', wallpaper:'ink',    wallpaperVar:'linear-gradient(160deg,#1a1a1a 0%,#3a3a3a 50%,#0a0a0a 100%)', unlockDesc:'体验5种以上心情解锁', unlockCondition: s => (s.moodHistory||[]).length >= 5 },
  rose:    { wallpaperImage:'assets/wallpapers/rose.jpg', id:'rose',    name:'玫瑰', bg:'#2a0a1a', accent:'#ff5fa8', wallpaper:'rose',   wallpaperVar:'linear-gradient(160deg,#2a0a1a 0%,#5a1a3a 40%,#0a0510 100%)', unlockDesc:'任一男主好感度达12解锁', unlockCondition: s => Object.values(s.affection||{}).some(v=>v>=12) },
  dark:    { id:'dark',    name:'深夜', bg:'#000000', accent:'#888888', wallpaper:'dark',   wallpaperVar:'#000000', unlockDesc:'观看任一结局解锁', unlockCondition: s => Object.keys(s.endingSeen||{}).length >= 1 }
};

// 图标主题（与壁纸独立）
STORY.iconThemes = {
  default: { id:'default', name:'圆角方块', unlockDesc:'默认' },
  outline: { id:'outline', name:'线性描边', unlockDesc:'解锁5个成就' , unlockCondition: s => Object.keys(s.achievements||{}).length >= 5 },
  retro:   { id:'retro',   name:'复古拟物', unlockDesc:'连胜7天任务', unlockCondition: s => (s.taskStreak||0) >= 7 }
};


/* ===== story/16_dates_nightmares.js ===== */
/* ===== 霓虹心事 · 剧情数据：约会场景与梦魇 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// ===== v0.0.15 每日约会小剧场 =====
// 每位男主每周可约会1次（state.day % 7 === 0 时刷新）
// 约会完成后小事件影响三轴好感 + 解锁照片
STORY.dateScenes = {
  shenyan: [
    { id:'date_shenyan_tea',     name:'午后茶会',   desc:'沈砚之带你去美术馆旁的茶室',     effects:{affectionDetail:{shenyan:{closeness:3,trust:2}}},  unlockPhoto:null,        dialogue:[
      {who:'him', text:'茶室很安静。我喜欢这里。'},
      {who:'me',  text:'比美术馆舒服多了。'},
      {who:'him', text:'……难得听你说这种话。'},
      {who:'him', text:'下次，可以常来。'}
    ]},
    { id:'date_shenyan_studio',  name:'画室参观',   desc:'他破例让你看他未完成的画',       effects:{affectionDetail:{shenyan:{trust:4,tension:2}}},   unlockPhoto:'shenyan_studio', dialogue:[
      {who:'him', text:'这幅画，画了五年。'},
      {who:'me',  text:'画的是……'},
      {who:'him', text:'是你。'},
      {who:'him', text:'从你来的第一天开始。'}
    ]},
    { id:'date_shenyan_archive', name:'雨夜档案馆', desc:'暴雨夜，他约你在美术馆地下档案室整理捐赠文献', effects:{affectionDetail:{shenyan:{closeness:2,trust:4,tension:1}}}, unlockPhoto:null, dialogue:[
      {who:'him', text:'小心纸屑。这批文献比你我岁数都大。'},
      {who:'me',  text:'为什么挑下雨天做这个？'},
      {who:'him', text:'雨天闭馆。档案室只放得下两个人的安静。'},
      {who:'me',  text:'……你提前查过天气预报吧。'},
      {who:'him', text:'查了一周。'},
      {who:'him', text:'有些话，只在雨天说得出口。比如：今晚别走那么早。'}
    ]}
  ],
  luci: [
    { id:'date_luci_rooftop',    name:'旧楼天台',   desc:'陆辞带你去他高中的天台',         effects:{affectionDetail:{luci:{closeness:3,tension:2}}},   unlockPhoto:null,        dialogue:[
      {who:'him', text:'这里，我高中每天都来。'},
      {who:'me',  text:'九年没回来过？'},
      {who:'him', text:'直到今天，才敢带人来。'},
      {who:'him', text:'……谢谢你愿意跟我来。'}
    ]},
    { id:'date_luci_darkroom',   name:'暗房显影',   desc:'他让你进暗房看显影的过程',       effects:{affectionDetail:{luci:{trust:3,tension:3}}},      unlockPhoto:'luci_school', dialogue:[
      {who:'him', text:'红光下，照片慢慢显出来。'},
      {who:'me',  text:'这张……是我？'},
      {who:'him', text:'你笑起来，比那幅画好看多了。'},
      {who:'him', text:'原来这话，我九年前就想说。'}
    ]},
    { id:'date_luci_bookstore',  name:'旧书店寻踪', desc:'他不知从哪听说旧书店里有你们高中的校刊合订本', effects:{affectionDetail:{luci:{closeness:4,trust:2,tension:1}}}, unlockPhoto:null, dialogue:[
      {who:'him', text:'老板说在架子最顶层。要我爬，还是你爬？'},
      {who:'me',  text:'你爬。你高。'},
      {who:'him', text:'……行。九年了，使唤起来还是这么顺手。'},
      {who:'me',  text:'找到了！《霓城一中校刊·合订本》！'},
      {who:'him', text:'翻到运动会那页。第三张。'},
      {who:'me',  text:'……你偷拍我冲线这张，居然被登出来了？'},
      {who:'him', text:'是我投的稿。标题我起的：「她跑起来的样子，比夏天先到」。'}
    ]}
  ],
  jiangyu: [
    { id:'date_jiangyu_sea',     name:'深夜看海',   desc:'江屿骑车带你去看霓城的海',       effects:{affectionDetail:{jiangyu:{closeness:3,tension:3}}}, unlockPhoto:null,        dialogue:[
      {who:'him', text:'海的声音，比酒吧安静。'},
      {who:'me',  text:'你怎么知道我想来。'},
      {who:'him', text:'……不知道。只是觉得，你今天累。'},
      {who:'him', text:'累的时候，适合看海。'}
    ]},
    { id:'date_jiangyu_rehearsal', name:'排练室',   desc:'他让你听他独自排练《夏》',       effects:{affectionDetail:{jiangyu:{trust:3,tension:3}}},   unlockPhoto:null,        dialogue:[
      {who:'him', text:'这首歌，从来没在人前唱过。'},
      {who:'me',  text:'为什么今天唱给我？'},
      {who:'him', text:'……因为是你。'},
      {who:'him', text:'因为这首歌，本来就是要唱给你听的。'}
    ]},
    { id:'date_jiangyu_market',  name:'凌晨鱼市',   desc:'天没亮，他骑车带你去海边鱼市挑食材做早餐', effects:{affectionDetail:{jiangyu:{closeness:3,trust:2,tension:2}}}, unlockPhoto:null, dialogue:[
      {who:'him', text:'挑吧。今晚想吃什么，早上说了算。'},
      {who:'me',  text:'你还会做菜？'},
      {who:'him', text:'乐队散了那两年，我在大排档掌勺。'},
      {who:'me',  text:'……那你的歌里有没有海鲜的味道？'},
      {who:'him', text:'有。下一张专辑就叫这个。'},
      {who:'him', text:'开玩笑的。不过——跟你逛菜市场这种日子，我可以天天有。'}
    ]}
  ]
};

// 约会冷却：每周1次（每7天）
STORY.dateCooldownDays = 7;


// ===== v0.0.16 梦魇系统 =====
// 当任一男主三轴合计过低（<5）且 tension=0 时，夜晚触发梦魇
// 梦魇影响次日心情：随机扣 1-2 点某项 personality，并标记 flags.nightmare_seen_X
STORY.nightmares = {
  nightmare_lonely: {
    id:'nightmare_lonely',
    name:'空房间的回音',
    desc:'梦里你一个人站在空旷的房间，三道门都关着。每扇门后都有一个声音叫你，但你推不开任何一扇。',
    trigger: s => {
      // 任一男主 tension=0 且 closeness<3
      return ['shenyan','luci','jiangyu'].some(cid => {
        const ad = s.affectionDetail?.[cid];
        return ad && ad.tension === 0 && ad.closeness < 3;
      });
    },
    effects: { personality: {passive:1, emotional:1}, flags: {nightmare_seen_lonely:1} },
    moodAfter: 'anxious',
    dialogue: [
      {who:'narrator', text:'（夜很深。你做了个梦。）'},
      {who:'me', text:'……有人吗？'},
      {who:'narrator', text:'（三道门，三种声音，都听不真切。你醒了，冷汗未干。）'}
    ],
    resolve: {
      prompt:'醒来后你想：',
      options:[
        {text:'记录下来，写进日记', effects:{personality:{rational:1}}, moodAfter:'reflective'},
        {text:'给苏苏发条消息', effects:{personality:{emotional:1}}, moodAfter:'lonely'},
        {text:'继续睡', effects:{personality:{passive:1}}, moodAfter:'tired'}
      ]
    }
  },
  nightmare_betrayal: {
    id:'nightmare_betrayal',
    name:'熟悉的陌生人',
    desc:'梦里他对你笑，递来一杯酒。酒杯里映出的却是另一个人的脸。',
    trigger: s => {
      // 任一男主 trust < closeness 且 tension >= 10（暧昧却不够信任）
      return ['shenyan','luci','jiangyu'].some(cid => {
        const ad = s.affectionDetail?.[cid];
        return ad && ad.trust < ad.closeness && ad.tension >= 10;
      });
    },
    effects: { personality: {rational:1, emotional:1}, flags: {nightmare_seen_betrayal:1} },
    moodAfter: 'anxious',
    dialogue: [
      {who:'narrator', text:'（梦里他在笑。）'},
      {who:'him', text:'喝吧。'},
      {who:'me', text:'……杯子里是谁？'},
      {who:'narrator', text:'（酒杯映出的不是你的脸。你惊醒。）'}
    ],
    resolve: {
      prompt:'醒来后你决定：',
      options:[
        {text:'主动问他过去的事', effects:{personality:{active:1, independent:1}}, moodAfter:'determined'},
        {text:'先观察一段时间', effects:{personality:{rational:1, passive:1}}, moodAfter:'reflective'},
        {text:'假装不知道', effects:{personality:{dependent:1}}, moodAfter:'anxious'}
      ]
    }
  },

  // v0.1.9: 新增第三种梦魇——江屿线暧昧累积后的舞台梦
  nightmare_stage: {
    id:'nightmare_stage',
    name:'空舞台',
    desc:'梦里你站在雾港的舞台上，追光灯白得晃眼。台下坐满了人，却没有一张脸是清楚的。\n你张嘴想唱，歌词全是空白。台下有人开始鼓掌，掌声越来越响，像潮水漫过头顶。',
    trigger: s => {
      // 江屿线暧昧度累积到 8 以上（第 6 天起），心跳太吵的夜晚
      const ad = s.affectionDetail?.jiangyu;
      return !!(ad && ad.tension >= 8 && s.day >= 6);
    },
    effects: {
      personality: { emotional: 1, dependent: 1 },
      flags: { nightmare_seen_stage: 1 }
    },
    moodAfter: 'anxious',
    dialogue: [
      {who:'narrator', text:'（追光灯很烫。台下黑压压的一片。）'},
      {who:'me', text:'歌词……歌词是什么来着？'},
      {who:'narrator', text:'（掌声轰然响起。你在掌声里惊醒，心跳快得像唱完了一整首歌。）'}
    ],
    resolve: {
      prompt:'醒来后你决定：',
      options:[
        {text:'把梦里的鼓掌声写下来', effects:{personality:{emotional:1, active:1}}, moodAfter:'reflective'},
        {text:'给江屿发条消息，什么都不说', effects:{personality:{dependent:1, emotional:1}}, moodAfter:'tangled'},
        {text:'深呼吸，把灯全打开', effects:{personality:{rational:1, independent:1}}, moodAfter:'calm'}
      ]
    }
  }
};


/* ===== story/17_hints_ambiences.js ===== */
/* ===== 霓虹心事 · 剧情数据：选项提示、朋友圈评论与氛围 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// ===== v0.0.16 聊天选项智能提示 =====
// 二周目/观赏模式开启时，显示每个选项的"潜在影响"
// 提示规则：根据 effects 字段自动生成文案
STORY.optionHints = {
  // 通用规则：根据 effects.affection / flags / personality 自动生成
  generate: function(opt){
    if(!opt.effects) return null;
    // v0.7.4 角色名显示层翻译：提示串里的角色名过 t()（拼音映射）；无 i18n 环境（Node 测试）回退原文
    const _tn = (typeof window !== 'undefined' && typeof window.t === 'function') ? window.t : (s)=>s;
    const parts = [];
    if(opt.effects.affection){
      for(const k in opt.effects.affection){
        const v = opt.effects.affection[k];
        if(v > 0) parts.push(`${_tn(STORY.characters[k]?.name||k)} +${v}`);
        else if(v < 0) parts.push(`${_tn(STORY.characters[k]?.name||k)} ${v}`);
      }
    }
    if(opt.effects.affectionDetail){
      for(const k in opt.effects.affectionDetail){
        const ad = opt.effects.affectionDetail[k];
        const dims = [];
        if(ad.closeness) dims.push(`亲密${ad.closeness>0?'+':''}${ad.closeness}`);
        if(ad.trust) dims.push(`信任${ad.trust>0?'+':''}${ad.trust}`);
        if(ad.tension) dims.push(`暧昧${ad.tension>0?'+':''}${ad.tension}`);
        if(dims.length) parts.push(`${_tn(STORY.characters[k]?.name||k)}(${dims.join('/')})`);
      }
    }
    if(opt.effects.flags){
      const flagKeys = Object.keys(opt.effects.flags);
      if(flagKeys.length > 0) parts.push(`解锁 ${flagKeys.length} 个剧情标记`);
    }
    if(opt.effects.personality){
      const ps = [];
      for(const k in opt.effects.personality){
        const v = opt.effects.personality[k];
        if(v > 0) ps.push(k);
      }
      if(ps.length) parts.push(`性格+${ps.join('/')}`);
    }
    return parts.length > 0 ? parts.join(' · ') : null;
  }
};


// ===== v0.0.16 男主朋友圈互动 =====
// 玩家发朋友圈后，根据内容类别男主会主动评论
// 玩家可选择回复方式，回复影响三轴好感
STORY.momentComments = {
  // 类别 → 男主评论模板
  byCategory: {
    city: {  // 城市夜景类
      shenyan: [
        {text:'霓虹灯太吵。', effects:{affectionDetail:{shenyan:{tension:1}}}, replyOptions:[
          {text:'你也来吗？', effects:{affectionDetail:{shenyan:{closeness:1,tension:1}}}},
          {text:'安静点好。', effects:{affectionDetail:{shenyan:{trust:1}}}},
          {text:'（不回复）', effects:{}}
        ]},
        {text:'光影不错。', effects:{affectionDetail:{shenyan:{trust:1}}}, replyOptions:[
          {text:'你也喜欢？', effects:{affectionDetail:{shenyan:{closeness:1}}}},
          {text:'嗯。', effects:{}},
          {text:'（不回复）', effects:{}}
        ]}
      ],
      luci: [
        {text:'这角度我熟，是雾港那条巷子？', effects:{affectionDetail:{luci:{closeness:2}}}, replyOptions:[
          {text:'被你认出来了', effects:{affectionDetail:{luci:{tension:1}}}},
          {text:'下次带我去拍', effects:{affectionDetail:{luci:{closeness:1,tension:1}}}},
          {text:'（不回复）', effects:{}}
        ]}
      ],
      jiangyu: [
        {text:'……灯亮着，没人懂。', effects:{affectionDetail:{jiangyu:{tension:1}}}, replyOptions:[
          {text:'你在哪？', effects:{affectionDetail:{jiangyu:{closeness:1}}}},
          {text:'我懂。', effects:{affectionDetail:{jiangyu:{tension:1,trust:1}}}},
          {text:'（不回复）', effects:{}}
        ]}
      ]
    },
    rooftop: {  // 天台/夜景
      shenyan: [
        {text:'夜风有点凉。', effects:{affectionDetail:{shenyan:{trust:1}}}, replyOptions:[
          {text:'你也上去过？', effects:{affectionDetail:{shenyan:{closeness:1}}}},
          {text:'（不回复）', effects:{}}
        ]}
      ],
      jiangyu: [
        {text:'昨晚那阵风，我也在。', effects:{affectionDetail:{jiangyu:{tension:2}}}, replyOptions:[
          {text:'我看到你了。', effects:{affectionDetail:{jiangyu:{closeness:1,tension:1}}}},
          {text:'下次叫我。', effects:{affectionDetail:{jiangyu:{closeness:1}}}},
          {text:'（不回复）', effects:{}}
        ]}
      ]
    },
    '': {  // 无配图纯文字
      susu: [
        {text:'又emo了？', effects:{}, replyOptions:[
          {text:'没有啦', effects:{}},
          {text:'有点', effects:{}}
        ]}
      ],
      luci: [
        {text:'？', effects:{}, replyOptions:[
          {text:'没事', effects:{}},
          {text:'（不回复）', effects:{}}
        ]}
      ]
    }
  }
};


// ===== v0.0.16 动态背景氛围 =====
// 根据时间/心情/天气自动应用氛围层（不改主题，叠加在主题之上）
// v0.2.7 (M1.3): 雨天/夜晚/不安三档附带氛围纹理（tools/generate_ambiences.py 生成），
//   由 ui/18 composeWallpaper 合成进 --wallpaper-1；layerBlend 即 background-blend-mode。
STORY.ambiences = {
  day:     { id:'day',     name:'白昼', wallpaperOverlay:'rgba(255,250,240,0.04)', cond: s => Math.floor(s.minute/60) >= 8 && Math.floor(s.minute/60) < 18 },
  dusk:    { id:'dusk',    name:'黄昏', wallpaperOverlay:'rgba(251,191,36,0.08)', cond: s => { const h=Math.floor(s.minute/60); return h >= 17 && h < 20; } },
  night:   { id:'night',   name:'夜晚', wallpaperOverlay:'rgba(0,0,30,0.35)',    layerImage:'assets/ambiences/night.jpg',   layerBlend:'soft-light', cond: s => { const h=Math.floor(s.minute/60); return h >= 20 || h < 6; } },
  dawn:    { id:'dawn',    name:'黎明', wallpaperOverlay:'rgba(255,200,180,0.06)', cond: s => { const h=Math.floor(s.minute/60); return h >= 6 && h < 8; } },
  rainy:   { id:'rainy',   name:'雨天', wallpaperOverlay:'rgba(80,120,180,0.10)',  layerImage:'assets/ambiences/rainy.jpg',   layerBlend:'soft-light', cond: s => s.flags._weather === 'rainy' },
  anxious: { id:'anxious', name:'心绪不宁', wallpaperOverlay:'rgba(120,40,80,0.12)', layerImage:'assets/ambiences/anxious.jpg', layerBlend:'soft-light', cond: s => s.mood === 'anxious' },
  // v0.1.8: 塔罗运势接入氛围——抽牌当天叠加一层「幸运/沉重」色调（优先级低于心情与天气）
  lucky:   { id:'lucky',   name:'幸运', wallpaperOverlay:'rgba(255,160,210,0.07)', cond: s => s.todayFortune && s.todayFortune.day === s.day && s.todayFortune.reversed === false },
  unlucky: { id:'unlucky', name:'沉重', wallpaperOverlay:'rgba(60,60,90,0.14)', cond: s => s.todayFortune && s.todayFortune.day === s.day && s.todayFortune.reversed === true }
};

if (typeof window !== 'undefined') window.STORY = STORY;


/* ===== interaction_queue.js ===== */
/* 进行中交互的轻量状态容器。引擎状态仍是普通 JSON，便于存档和导入。 */
class InteractionQueue {
  static priorities = {call:100, encounter:80, narrator_choice:70, route_choice:60};

  static ensure(state){
    if(!Array.isArray(state.pendingInteractions)) state.pendingInteractions = [];
    // v3 之前只有单个 pendingInteraction，第一次访问时迁移到队列。
    if(state.pendingInteractions.length === 0 && state.pendingInteraction && typeof state.pendingInteraction === 'object'){
      state.pendingInteractions.push(state.pendingInteraction);
    }
    this.syncLegacy(state);
    return state.pendingInteractions;
  }

  static syncLegacy(state){
    const list = Array.isArray(state.pendingInteractions) ? state.pendingInteractions : [];
    const sorted = [...list].sort((a,b)=>(b.priority||this.priorities[b.type]||0)-(a.priority||this.priorities[a.type]||0));
    state.pendingInteraction = sorted[0] || null;
    return state.pendingInteraction;
  }

  static upsert(state, item){
    const list = this.ensure(state);
    const id = item.id || `${item.type}:${item.eventId || item.encounterId || Date.now()}`;
    const next = {...item, id, priority:item.priority || this.priorities[item.type] || 0};
    const idx = list.findIndex(x=>x.id === id);
    if(idx >= 0) list[idx] = next;
    else list.push(next);
    this.syncLegacy(state);
    return next;
  }

  static find(state, predicate){
    return this.ensure(state).find(predicate) || null;
  }

  static remove(state, predicate){
    const list = this.ensure(state);
    const kept = [];
    const removed = [];
    list.forEach(item => (predicate(item) ? removed : kept).push(item));
    if(removed.length) state.pendingInteractions = kept;
    this.syncLegacy(state);
    return removed;
  }

  static all(state){ return [...this.ensure(state)]; }
}

if(typeof window !== 'undefined') window.InteractionQueue = InteractionQueue;


/* ===== save_migrations.js ===== */
/* 存档迁移保持纯函数，具体字段校验仍由 PhoneEngine._sanitizeLoadedState 完成。 */
const SaveMigrations = {
  CURRENT_VERSION: 4,

  migrate(raw){
    const save = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const source = save.state && typeof save.state === 'object' && !Array.isArray(save.state) ? save.state : {};
    const state = {...source};
    const version = Number.isFinite(Number(save.v)) ? Number(save.v) : 1;

    if(version < 3){
      if(!Array.isArray(state.pendingInteractions)){
        state.pendingInteractions = state.pendingInteraction ? [state.pendingInteraction] : [];
      }
      if(!Array.isArray(state.pendingFollowups)) state.pendingFollowups = [];
      if(!Array.isArray(state.pendingTimeAdvances)) state.pendingTimeAdvances = [];
    }

    if(version < 4){
      // v0.9.7：选线前挂起的路线事件队列；旧档没有该字段，且已选线的旧档无需补发
      if(!Array.isArray(state.pendingRouteEvents)) state.pendingRouteEvents = [];
      if(state.route) state.pendingRouteEvents = [];
    }

    return {...save, v:SaveMigrations.CURRENT_VERSION, state};
  }
};

if(typeof window !== 'undefined') window.SaveMigrations = SaveMigrations;


/* ===== engine_domains.js ===== */
/* ===== 霓虹心事 · SaveManager / EventScheduler（v0.5.8 阶段 F2.3）=====
 * 从 PhoneEngine 上帝对象渐进拆出的两个职责域：
 *   - SaveManager：存档槽位/清洗/迁移/导入导出（原 engine_save.js 的方法域）
 *   - EventScheduler：定时器注册/清理/事件分发队列（原 engine.js 的 _timer 域）
 * 组合方式：两者持有 engine 引用（访问 state/story/emit），方法以 prototype 转发挂在
 * PhoneEngine 上——全部既有调用面（UI/测试/存档格式）零改动，纯内部重组。
 */
'use strict';

class EventScheduler {
  constructor(engine){
    this.engine = engine;
    this.timers = new Set();          // _setTimeout 句柄表
    this.callMissTimers = new Map();  // eventId -> timerId（并发通话）
    this.scheduledEvents = new Set(); // 已排队未触发（不提前入 firedEvents）
  }
  setTimeout(fn, delay){
    const clock = this.engine._clock;
    const handle = clock.setTimeout(() => {
      this.timers.delete(handle);
      try { fn(); } catch(e){ console.error('[engine timer]', e); }
    }, delay);
    this.timers.add(handle);
    return handle;
  }
  clearTimeout(handle){ this.engine._clock.clearTimeout(handle); this.timers.delete(handle); }
  clearAll(){
    this.timers.forEach(id => this.engine._clock.clearTimeout(id));
    this.timers.clear();
    this.callMissTimers.forEach(id => this.engine._clock.clearTimeout(id));
    this.callMissTimers.clear();
    this.scheduledEvents.clear();
  }
}

class SaveManager {
  constructor(engine){
    this.engine = engine;
    this.memorySaves = {};   // localStorage 不可用时的内存存档
    this.cache = null;       // v0.1.7 起的内存缓存
  }
  // 具体方法仍由 engine_save.js 的 prototype 混入提供（本类先承载状态域，
  // 方法迁移在后续版本逐个搬移，每步保持测试全绿——见 docs F2.3 计划）。
}

if (typeof window !== 'undefined'){ window.EventScheduler = EventScheduler; window.SaveManager = SaveManager; }
else if (typeof globalThis !== 'undefined'){ globalThis.EventScheduler = EventScheduler; globalThis.SaveManager = SaveManager; }


/* ===== engine.js ===== */
/* ===== 霓虹心事 · 手机模拟引擎 =====
 * 核心创新：不再是线性对话框，而是模拟一部手机
 * - 时间系统：游戏内时间随互动推进
 * - 事件队列：消息/电话/照片按时间触发，玩家自由选择何时处理
 * - 并发会话：多个男主同时发消息，已读不回会有后果
 * - 玩家自主：不强制顺序，何时回消息、接不接电话都由玩家决定
 */
// v0.9.7：选线后补发路线事件的间隔（避免 23:00 一次性涌入多条）
const ROUTE_BACKFILL_GAP_MS = 1500;

class PhoneEngine {
  constructor(story){
    this.story = story;
    // v0.5.8（F2.3）：职责域组合——调度器与存档管理独立成对象（方法经转发保持调用面不变）
    this.scheduler = new EventScheduler(this);
    this.saveManager = new SaveManager(this);
    this.state = this.defaultState();
    this.listeners = {};
    this._pendingCallEventId = null;
    this._pendingEncounterThen = null;
    this._pendingDate = null;  // v0.0.16: 进行中的约会（不持久化）
    this._disableAutoSave = false;
    this._lastAutoSaveAt = 0;
    this._autoSaveStarted = false;
    this._autoSaveInterval = null;
    this._autoSaveStateListener = null;
    // v0.5.7（F2.2）：可注入时钟（测试用虚拟钟提速；默认 Date）
    // 默认走宿主全局 setTimeout/clearTimeout；测试注入 FakeClock（含 now/setTimeout/clearTimeout）
    this._clock = (typeof Clock !== 'undefined' && Clock.setTimeout) ? Clock : { now: () => Date.now(), setTimeout: (fn, d) => setTimeout(fn, d), clearTimeout: (id) => clearTimeout(id) };
    // v0.1.7: 存档内存缓存（getAllSaves 高频调用，避免每次重读 localStorage + 全量规范化）
    this._savesCache = null;
    // v0.1.7: 其他标签页改动 localStorage 时使缓存失效
    if(typeof window !== 'undefined' && typeof window.addEventListener === 'function'){
      this._storageListener = () => { this._savesCache = null; };
      window.addEventListener('storage', this._storageListener);
    }
  }
  // v0.5.8（F2.3）：转发 EventScheduler（实现见 engine_domains.js）
  _setTimeout(fn, delay){ return this.scheduler.setTimeout(fn, delay); }
  _clearTimeout(handle){ this.scheduler.clearTimeout(handle); }
  _clearAllTimers(){
    // v0.5.8（F2.3）：集合清理转发 scheduler（引擎自身的挂起态字段仍在此处理）
    this.scheduler.clearAll();
    this._pendingCallEventId = null;
    this._pendingEncounterThen = null;
    this._pendingDate = null;
  }
  _addInteraction(item){
    return InteractionQueue.upsert(this.state, item);
  }
  _findInteraction(predicate){
    return InteractionQueue.find(this.state, predicate);
  }
  _removeInteraction(predicate){
    const removed = InteractionQueue.remove(this.state, predicate);
    this._retryDeferredEvents();
    return removed;
  }
  // v0.9.5：主线链（then 链/待处理选择/交互）是否仍在进行
  _mainChainBusy(){
    const st = this.state;
    if((st.pendingEventDispatches || []).length) return true;
    if((st.pendingMessages || []).length) return true;
    if((st.pendingInteractions || []).length) return true;
    if(Object.values(st.conversations || {}).some(c=>c && c.pendingChoice)) return true;
    if(Object.values(st.groups || {}).some(g=>g && g.pendingChoice)) return true;
    return false;
  }
  // v0.9.5：主线链空闲后，按原时间顺序派发被延后的日常事件
  _retryDeferredEvents(){
    const list = this.state.deferredEventIds;
    if(!list || !list.length){ this._deferredSince = 0; return; }
    if(!this._deferredSince) this._deferredSince = Date.now();
    const overdue = Date.now() - this._deferredSince > 15000;
    if(this._mainChainBusy() && !overdue){
      if(!this._deferredRetryTimer && this._setTimeout){
        this._deferredRetryTimer = this._setTimeout(()=>{ this._deferredRetryTimer = null; this._retryDeferredEvents(); }, 2000);
      }
      return;
    }
    this._deferredSince = 0;
    const ids = list.splice(0, list.length);
    ids.forEach(id=>{ if(id && !this.state.firedEvents[id]) this.scheduleEvent(id); });
  }
  // v0.9.7（D2-A′ 原型）：finaleGate 生效时，把最终抉择压到指定游戏日再排程。
  // 默认 gate=null → 行为与 v0.9.6 完全一致。
  _releasePendingFinale(){
    const p = this.state.pendingFinale;
    if(!p || !p.eventId) return false;
    if(this.state.ended) return false;
    if(this.state.day < (p.day || 0)) return false;
    this.state.pendingFinale = null;
    this.scheduleEvent(p.eventId);
    this.emit('stateChange', this.state);
    return true;
  }
  // v0.9.7：选线前命中的路线事件先入队，chooseRoute 后补发——否则按玩家节奏（选线夜 day6/day7）
  // 会静默丢掉整条线的当日事件（实测沈线 6 条全压在 day7 白天，慢节奏玩家 0/6）。
  _queuePendingRouteEvent(id, evt){
    if(this.state.ended || this.state.route) return;
    const trg = evt && evt.trigger;
    if(!trg || typeof trg.day !== 'number' || typeof trg.hour !== 'number') return;
    const now = this.getTime();
    // 只挂起已经过去/正在进行的窗口；未来窗口交给正常调度，避免提前触发
    if(trg.day > now.day || (trg.day === now.day && trg.hour > now.hour)) return;
    const list = this.state.pendingRouteEvents || (this.state.pendingRouteEvents = []);
    if(this.state.firedEvents[id] || list.some(x => x && x.id === id)) return;
    list.push({id, day:trg.day, hour:trg.hour});
  }
  // v0.9.7：选线后补发当前路线已过窗口的事件（错峰、去重、未来窗口不补）
  _flushPendingRouteEvents(){
    const list = this.state.pendingRouteEvents || [];
    if(!list.length) return 0;
    this.state.pendingRouteEvents = [];
    if(!this.state.route || this.state.ended) return 0;
    const now = this.getTime();
    const due = [];
    for(const item of list){
      if(!item || !item.id) continue;
      const evt = this.story.events[item.id] || (this.story.criticalEvents && this.story.criticalEvents[item.id]);
      if(!evt || !evt.trigger) continue;
      if(evt.trigger.route !== this.state.route) continue;   // 别的线：静默丢弃
      if(this.state.firedEvents[item.id] || this._scheduledEvents.has(item.id)) continue;   // 去重
      if(item.day > now.day || (item.day === now.day && item.hour > now.hour)) continue;    // 未来窗口不补
      due.push(item);
    }
    due.sort((a, b) => (a.day - b.day) || (a.hour - b.hour));
    due.forEach((item, i) => {
      this._setTimeout(() => this.scheduleEvent(item.id), i * ROUTE_BACKFILL_GAP_MS);
    });
    if(due.length) this.emit('stateChange', this.state);
    return due.length;
  }
  getPendingInteractions(){
    return InteractionQueue.all(this.state);
  }
  defaultState(){
    return {
      // 时间：第N天 + 当天分钟数(0-1440)
      day: 1, minute: 22*60+30, // 第一天 22:30
      // 会话状态：每个角色一条会话
      conversations: {
        shenyan: {messages:[], unread:0, typing:false, finished:false},
        luci:    {messages:[], unread:0, typing:false, finished:false},
        jiangyu: {messages:[], unread:0, typing:false, finished:false},
        susu:    {messages:[], unread:0, typing:false, finished:false}, // 苏苏(闺蜜)
      },
      // 通话记录
      callLog: [],
      // 相册
      photos: [],
      // 音乐
      music: {unlocked:[], playing:null},
      // 备忘录
      notes: [],
      // 日程
      calendar: [],
      // 通知(已读)
      notifs: [],
      // 好感度
      affection: {shenyan:0, luci:0, jiangyu:0},
      // 标记
      flags: {},
      // 已触发事件id
      firedEvents: {},
      // 结局
      endingSeen: {},
      // 当前路线
      route: null,
      // 游戏是否结束
      ended: false,
      // 朋友圈动态
      moments: [],
      // 朋友圈互动记录 {momentId: {liked, commented, commentIdx}}
      momentInteractions: {},
      // 梦境碎片
      dreamShards: [],
      resolvedDreams: {},
      activeDream: null,
      // 可恢复的异步剧情工作。存档时不能只记录 firedEvents，否则刷新会吞剧情。
      pendingMessages: [],
      pendingEventDispatches: [],
      pendingCalls: [],
      // v0.9.5：主线链忙碌时被延后的时间事件
      deferredEventIds: [],
      // v0.9.7：选线前命中的路线事件暂存，选线后按序补发（避免按玩家节奏随机丢内容）
      pendingRouteEvents: [],
      // v0.9.7（D2-A′，默认关闭）：被日期门槛拦下的最终抉择
      pendingFinale: null,
      // 已显示但尚未完成的交互，读档后由 UI 按该状态重建。
      pendingInteractions: [],
      pendingInteraction: null,
      // 消息送达后的延迟后果与时间推进动画同样需要跨读档恢复。
      pendingFollowups: [],
      pendingTimeAdvances: [],
      // 性格画像维度
      personality: {active:0, passive:0, rational:0, emotional:0, independent:0, dependent:0},
      // 当前地点
      currentLocation: 'home',
      locationVisits: [],
      // 已触发的偶遇（避免重复）
      visitedEncounters: {},
      // 回忆碎片（通过照片触发）
      memoryShards: [],
      // 已触发的回忆
      resolvedMemories: {},
      // 已触发的情报
      firedIntel: {},
      // 共同邀约/赴约系统
      invitations: [],          // pending 列表 {id, status, ts}
      firedInvitations: {},     // 已触发过邀请的 id
      resolvedInvitations: {},  // {invId: 'accepted'|'declined'|'missed'}
      // 多人聊天群
      groups: {},               // {groupId: {name, members, messages, unread, typing}}
      // 语音信箱
      voicemails: [],           // {id, from, text, time, eventId, heard, callbackEvent}
      // 闪回/前传章节
      flashbacksSeen: {},       // {fbId: true}
      flashbackShards: [],      // 闪回收集的碎片
      // 礼物商城+喜好系统
      coins: 500,               // 玩家金钱
      inventory: [],            // 已购未送出礼物 [{id, ts}]
      gifts: [],                // 已送出礼物 [{to, itemId, mult, ts, day}]
      // 心情状态+内心独白
      mood: 'calm',             // 当前心情 id
      moodHistory: [],          // 历史心情 [{mood, day, ts}]
      diary: [],                // 内心独白 [{text, mood, day, ts}]
      // 塔罗占卜+每日运势
      tarotHistory: [],         // [{day, cardId, reversed}]
      lastTarotDay: 0,          // 上次抽塔罗的游戏内日期
      todayFortune: null,       // {cardId, reversed, text}
      // 成就系统
      achievements: {},          // {achId: true}
      // v0.0.10 收集柜+隐藏彩蛋
      collected: [],             // 已收集的道具 id 列表
      easterEggsSeen: {},        // {eggId: true}
      // v0.0.10 解谜玩法
      puzzleProgress: {},        // {puzzleId: {attemptCount, solved, lastAttempt}}
      discoveredClues: {},       // {clueId: true}
      // v0.0.10 男主视角
      perspectivesSeen: {},      // {charId: {sceneId: true}}
      truthEndingsSeen: {},      // {charId: true}
      // v0.0.13 主角自定义
      player: null,              // {name, nickname, avatar, bg, age, pronoun, answers}
      playerQuizDone: false,     // 是否完成性格问答
      // v0.0.13 关系阶段
      relationshipStages: {},    // {charId: currentStage}
      // v0.0.13 每日任务
      dailyTasks: [],            // [{id, name, desc, reward, completed}]
      lastTaskDay: 0,            // 上次生成任务的游戏日
      taskStreak: 0,             // 连续完成天数
      taskStreakClaimed: {},     // 已领取的连胜奖励 {days: true}
      // v0.0.13 观赏模式
      watchMode: false,          // 是否开启观赏模式
      watchStrategy: 'balanced',  // 观赏策略
      // v0.0.15 好感度深度系统（三轴）
      affectionDetail: {         // {charId: {closeness, trust, tension}}
        shenyan: {closeness:0, trust:0, tension:0},
        luci:    {closeness:0, trust:0, tension:0},
        jiangyu: {closeness:0, trust:0, tension:0}
      },
      // v0.0.15 主题系统
      currentTheme: 'default',   // 当前壁纸主题 id
      currentIconTheme: 'default', // 当前图标主题 id
      unlockedThemes: {default:true},  // 已解锁主题
      unlockedIconThemes: {default:true},
      // v0.0.15 结局图鉴
      endingGallerySeen: {},     // {endingId: true}
      // v0.0.15 每日约会小剧场
      dateLastDone: {},          // {charId: day}
      dateHistory: [],           // [{charId, sceneId, day, ts}]
      // v0.0.16 梦魇系统
      nightmaresSeen: {},        // {nightmareId: true}
      lastNightmareDay: 0,       // 上次梦魇的游戏日
      activeNightmare: null,     // 等待玩家选择的梦魇 id
      // v0.0.16 智能提示开关
      showOptionHints: true,     // v0.6.6（P1-3）：一周目默认开提示（新玩家理解选择后果；老存档的显式 false 会被保留）
      // v0.0.16 男主朋友圈互动
      momentReplies: {}          // {momentId: {charId, commentIdx, replyIdx}}
    };
  }
  on(event, fn){ (this.listeners[event] ||= []).push(fn); return fn; }
  off(event, fn){
    if(!this.listeners[event]) return;
    const i = this.listeners[event].indexOf(fn);
    if(i >= 0) this.listeners[event].splice(i, 1);
  }
  once(event, fn){
    const wrapper = (payload)=>{
      this.off(event, wrapper);
      try { fn(payload); } catch(e){ console.error('[emit once]', event, e); }
    };
    return this.on(event, wrapper);
  }
  emit(event, payload){
    const list = this.listeners[event] || [];
    for(const fn of list){
      try { fn(payload); } catch(e){ console.error('[emit]', event, e); }
    }
    // stateChange 时统一检查成就（避免 30+ 处重复调用）
    if(event === 'stateChange' && this.story && this.story.achievements){
      try { this.checkAchievements(); } catch(_) {}
      // v0.0.15: 主题解锁检查
      if(this.story.themes || this.story.iconThemes){
        try { this.checkThemeUnlocks(); } catch(_) {}
      }
    }
  }
  // 统一应用 effects：避免 30+ 处复制粘贴
  _applyEffects(effects){
    if(!effects) return;
    const affChanged = [];
    if(effects.affection){
      for(const k in effects.affection){
        if(this.state.affection[k] !== undefined){
          const delta = Number(effects.affection[k]);
          if(!Number.isFinite(delta)) continue;
          this.state.affection[k] += delta;
          affChanged.push(k);
          // v0.0.15: 旧 effects.affection 按比例自动折算到三轴（50%/30%/20%），正负都折算
          if(this.state.affectionDetail && this.state.affectionDetail[k]){
            const ad = this.state.affectionDetail[k];
            if(delta !== 0){
              ad.closeness += Math.round(delta * 0.5);
              ad.trust += Math.round(delta * 0.3);
              ad.tension += Math.round(delta * 0.2);
              // 三轴下限为 0，避免负数
              if(ad.closeness < 0) ad.closeness = 0;
              if(ad.trust < 0) ad.trust = 0;
              if(ad.tension < 0) ad.tension = 0;
            }
          }
        }
      }
    }
    // v0.0.15: 精细驱动三轴，并反向同步综合 affection（用于关系阶段/称谓）
    if(effects.affectionDetail){
      for(const k in effects.affectionDetail){
          const delta = effects.affectionDetail[k];
          if(!delta || typeof delta !== 'object') continue;
        if(this.state.affectionDetail && this.state.affectionDetail[k]){
          const ad = this.state.affectionDetail[k];
          let dimSum = 0;
          if(Number.isFinite(delta.closeness)){ ad.closeness += delta.closeness; dimSum += delta.closeness; }
          if(Number.isFinite(delta.trust)){ ad.trust += delta.trust; dimSum += delta.trust; }
          if(Number.isFinite(delta.tension)){ ad.tension += delta.tension; dimSum += delta.tension; }
          // 三轴下限为 0
          if(ad.closeness < 0) ad.closeness = 0;
          if(ad.trust < 0) ad.trust = 0;
          if(ad.tension < 0) ad.tension = 0;
          // 反向同步综合分（取三轴合计的 1/3，避免重复加成过度膨胀）
          if(this.state.affection[k] !== undefined && dimSum !== 0){
            this.state.affection[k] += Math.round(dimSum / 3);
            if(this.state.affection[k] < 0) this.state.affection[k] = 0;
          }
          if(!affChanged.includes(k)) affChanged.push(k);
        }
      }
    }
    if(effects.flags){
      for(const k in effects.flags) this.state.flags[k] = effects.flags[k];
    }
    if(effects.personality){
      for(const k in effects.personality){
        if(this.state.personality[k] !== undefined && Number.isFinite(effects.personality[k])) this.state.personality[k] += effects.personality[k];
      }
    }
    // v0.0.13 关系阶段检查
    affChanged.forEach(cid => this.checkRelationshipStageUp(cid));
  }
  // 公开接口：供 UI 层调用，避免直接改 state
  applyEffects(effects){ this._applyEffects(effects); this.emit('stateChange', this.state); }

  newGame(opts = {}){
    const prev = this.state;   // v0.5.0: 旧局引用（二周目从 prev.ngCarry 取携带快照）
    this._clearAllTimers();
    this.state = this.defaultState();
    // v0.5.0（E3 周目系统）：二周目携带跨周目资产（收集/成就/结局图鉴/塔罗图鉴/彩蛋/主题解锁）
    if(opts.ngPlus && prev && prev.ngCarry){
      const c = prev.ngCarry;
      Object.assign(this.state, {
        collected: c.collected || [], achievements: c.achievements || {},
        endingSeen: c.endingSeen || {}, endingGallery: c.endingGallery || {},
        easterEggsSeen: c.easterEggsSeen || {}, tarotHistory: c.tarotHistory || [],
        unlockedThemes: c.unlockedThemes || {}, unlockedIconThemes: c.unlockedIconThemes || {},
        ngPlus: (c.ngPlus || 0) + 1,
      });
    }
    // 初始金币和心情从 story 配置读取
    if(this.story.shop) this.state.coins = this.story.shop.initialCoins || 500;
    if(this.story.moods) this.state.mood = 'calm';
    // v0.0.13 初始化每日任务
    this.generateDailyTasks();
    // v0.1.7: 初始化第 1 天天气
    this._updateWeather();
    // 初始：苏苏发来欢迎消息
    this.scheduleEvent('intro_susu');
    this.emit('stateChange', this.state);
    this.emit('timeChange', this.getTime());
    this.emit('ambienceChange', this.getCurrentAmbience());
  }

  // ===== 时间系统 =====
  getTime(){
    const d = this.state.day;
    const m = this.state.minute;
    const hh = String(Math.floor(m/60)).padStart(2,'0');
    const mm = String(m%60).padStart(2,'0');
    return {day:d, time:`${hh}:${mm}`, hour:Math.floor(m/60), minute:mm};
  }
  getDateLabel(){
    const dayMap = ['日','一','二','三','四','五','六'];
    // 起始7月15日星期三
    const startDate = new Date(2025, 6, 15);
    startDate.setDate(startDate.getDate() + this.state.day - 1);
    return {
      month: startDate.getMonth()+1,
      date: startDate.getDate(),
      weekday: dayMap[startDate.getDay()],
      full: `${startDate.getMonth()+1}月${startDate.getDate()}日 星期${dayMap[startDate.getDay()]}`
    };
  }
  // 时间推进前先派发待处理事件链，避免日常事件插到主线（路线选择等）前面
  _flushPendingEventDispatches(){
    const queue = this.state?.pendingEventDispatches;
    if(!queue || !queue.length) return;
    const items = queue.splice(0, queue.length);
    for(const item of items){
      if(this.state.firedEvents[item.eventId]) continue;
      if(this._scheduledEvents.has(item.eventId)) continue;
      this.scheduleEvent(item.eventId);
    }
  }
  advanceTime(minutes){
    this._flushPendingEventDispatches();
    const startHour = Math.floor(this.state.minute / 60);
    const startDay = this.state.day;
    this.state.minute += minutes;
    while(this.state.minute >= 1440){
      this.state.minute -= 1440;
      this.state.day++;
    }
    this.emit('timeChange', this.getTime());
    // 跨小时跳越：枚举经过的所有 (day,hour) 组合，避免漏触发事件
    this._runPostTimeAdvanceChecks();
    // 若跨越了多个小时，补查中间小时
    const endHour = Math.floor(this.state.minute / 60);
    if(startDay !== this.state.day || endHour !== startHour){
      // 已通过 _runPostTimeAdvanceChecks 处理当前终态；中间小时的历史事件由 firedEvents 去重保证不重复
      // 但为防止漏触发中间小时事件，额外枚举
      this._checkTimeEventsForRange(startDay, startHour, this.state.day, endHour);
    }
  }
  // 跳到次日某个时间
  advanceToNextDay(hour=9){
    this._flushPendingEventDispatches();
    const prevDay = this.state.day;
    const prevHour = Math.floor(this.state.minute / 60);
    this.state.day++;
    this.state.minute = hour*60;
    this._resetDailyFortune();
    this._updateWeather();
    this.emit('timeChange', this.getTime());
    // v0.1.7: 补查睡眠跨过的中间小时（凌晨 2 点彩蛋等时间触发事件不再漏触发）
    this._checkTimeEventsForRange(prevDay, prevHour, this.state.day, hour);
    this._runPostTimeAdvanceChecks();
    this.checkAchievements();
    // v0.0.16: 跳到夜晚时间时检查梦魇
    if(hour >= 20 || hour < 6){
      this.checkNightmare();
    }
    // v0.0.16: 时间变化后重新应用氛围
    this.emit('ambienceChange', this.getCurrentAmbience());
  }
  // v0.1.7: 每日天气（确定性伪随机）。修复「雨天氛围」从未生效的问题：
  // 每 5 天中第 3 天为雨天（day 3/8/13……），其余晴天；氛围层 rainy 依据 flags._weather
  _updateWeather(){
    const day = this.state.day || 1;
    this.state.flags._weather = (day % 5 === 3) ? 'rainy' : 'clear';
  }
  _runPostTimeAdvanceChecks(){
    this.checkTimeEvents();
    this.checkIntel();
    this.checkInvitations();
    this.checkGroups();
    this.checkFlashbacks();
    this.checkHoliday();
    this.checkEasterEggs();
    this.checkDailyTasks();
    this.checkTensionWhispers();
    this.checkAutoMoments();       // v0.8.4: 朋友圈日常动态  // v0.1.10: 暧昧度深夜独白
    this.checkGroupDinner();      // v0.2.0: 群聊聚餐后续（按投票 flag 分歧）
    this.checkRainEvents();       // v0.2.0: 雨天限定剧情
    this.checkTrueEndingEpilogue();  // v0.5.0: 真结局二周目尾声
  }
  // v0.2.0: 读取「今日抽中的塔罗牌 hint 值」（hint.type 匹配且是今天抽的）；
  // 返回 0 表示无该运势。塔罗数值从"只写 flag"变为真实影响玩法。
  _fortuneValue(type){
    const f = this.state.todayFortune;
    return f && f.day === this.state.day && f.hint?.type === type ? (f.hint.value || 1) : 0;
  }
  // v0.2.2: 今日塔罗 hint 类型（无牌面或非当日返回 null），供文案变体等读取
  _fortuneType(){
    const f = this.state.todayFortune;
    return f && f.day === this.state.day && f.hint?.type ? f.hint.type : null;
  }
  // v0.2.0: 群聊聚餐后续——day7 晚按投票 flag 派发对应现场（每局一次）
  checkGroupDinner(){
    if(this.state.ended || this.state.flags.group_dinner_done) return;
    const hour = Math.floor(this.state.minute / 60);
    if(this.state.day < 7 || hour < 19) return;
    const sceneId = this.state.flags.group_dinner_hotpot ? 'group_dinner_scene_hotpot'
      : this.state.flags.group_dinner_izakaya ? 'group_dinner_scene_izakaya'
      : this.state.flags.group_dinner_gallery ? 'group_dinner_scene_gallery' : null;
    if(!sceneId || !this.story.events?.[sceneId]) return;
    this.state.flags.group_dinner_done = true;
    this._queueEventDispatch(sceneId, 1500);
  }
  // v0.2.0: 雨天限定剧情——首个雨天晚 20 点后派发（每局一次），呼应每日天气系统
  checkRainEvents(){
    if(this.state.ended || this.state.flags.rain_event_done) return;
    // v0.2.1: 雨天闺蜜日常同样只服务未进男主线玩家，避免结局段插入 choice 阻塞主线
    if(this.state.route && this.state.route !== 'solo') return;
    if(this.state.flags._weather !== 'rainy') return;
    const hour = Math.floor(this.state.minute / 60);
    if(hour < 20 && hour >= 6) return;
    if(!this.story.events?.['rain_ambush_msg']) return;
    this.state.flags.rain_event_done = true;
    this._queueEventDispatch('rain_ambush_msg', 1200);
  }
  // v0.5.0（E3 周目）：真结局二周目尾声——day≥8 白天派发「霓城无事」后续（每局一次）
  checkTrueEndingEpilogue(){
    if(this.state.ended || this.state.flags.epilogue_done) return;
    if(!this.state.ngPlus || !this.state.endingSeen.true_ending) return;
    if(this.state.day < 8) return;
    const hour = Math.floor(this.state.minute / 60);
    if(hour < 10 || hour >= 22) return;
    if(!this.story.events?.['true_ending_epilogue']) return;
    this.state.flags.epilogue_done = true;
    this._queueEventDispatch('true_ending_epilogue', 1500);
  }
  _checkTimeEventsForRange(fromDay, fromHour, toDay, toHour){
    // 枚举 (day, hour) 范围内可能被跳过的时间触发事件
    const events = this.story.events;
    // v0.2.1: 与 checkTimeEvents 同口径——已进男主线时跳过 soloOnly 通用日常
    const inRoute = !!this.state.route && this.state.route !== 'solo';
    for(const [id, evt] of Object.entries(events)){
      if(this.state.firedEvents[id]) continue;
      if(evt.legacy) continue;   // v0.9.7（D2）：同上
      if(!evt.trigger) continue;
      if(evt.trigger.soloOnly && inRoute) continue;
      if(evt.trigger.inRoute && !inRoute) continue;   // v0.3.1: 男主线专属中后期日常（仅已进男主线时触发）
      if(evt.trigger.route && evt.trigger.route !== this.state.route){   // v0.9.2: 按具体路线过滤
        // v0.9.7：跨小时补扫时同样先挂起，避免选线前的窗口被永久丢弃
        if(!this.state.route) this._queuePendingRouteEvent(id, evt);
        continue;
      }
      // 简化：仅检查从起点到终点之间的所有 hour
      let d = fromDay, h = fromHour;
      while(d < toDay || (d === toDay && h <= toHour)){
        if(evt.trigger.day === d && evt.trigger.hour === h){
          if(evt.deferWhenBusy && this._mainChainBusy() && !['ending','route_choice'].includes(evt.type)){
            if(!this.state.deferredEventIds.includes(id)){
              this.state.deferredEventIds.push(id);
              if(!this._deferredSince) this._deferredSince = Date.now();
            }
            break;
          }
          this.scheduleEvent(id);
          break;
        }
        h++;
        if(h >= 24){ h = 0; d++; }
      }
    }
  }

  // ===== 事件调度 =====
  scheduleEvent(eventId){
    if(this.state.ended) return;   // 结局后不再调度
    // v0.5.0（E3 周目）：二周目时若存在 <id>_ng2 变体事件则调度变体（数据层零侵入的差异内容）
    if(this.state.ngPlus){
      const v = eventId + '_ng2';
      if((this.story.events[v] || this.story.criticalEvents?.[v]) && !this.state.firedEvents[v] && !this._scheduledEvents.has(v)){
        return this.scheduleEvent(v);
      }
    }
    // 优先查 events，fallback 查 criticalEvents（v0.0.13 临界事件单独定义在 STORY.criticalEvents）
    const evt = this.story.events[eventId] || this.story.criticalEvents?.[eventId];
    if(!evt) return;
    if(evt.legacy) return;   // v0.9.7（D2）：legacy 内容永不调度
    // 标记已触发（避免重复）
    if(this.state.firedEvents[eventId] || this._scheduledEvents.has(eventId)) return;
    this._scheduledEvents.add(eventId);
    this.state.firedEvents[eventId] = true;
    if(evt.collectible) this.collectItem(evt.collectible);
    // v0.1.6: 事件级 effects（可选）：让数据层可以直接设置 flag / 好感 / 性格，无需依赖玩家选项
    if(evt.effects) this._applyEffects(evt.effects);
    // 立即触发的消息事件
    if(evt.type === 'message_batch'){
      const n = evt.messages.length;
      evt.messages.forEach((m, i) => this.queueMessage(m, (evt.delay || 0) + i*0.3));
      // 若整个 batch 有 then，等所有消息发送完再触发
      if(evt.then){
        const lastDelay = (evt.delay || 0) + (n-1)*0.3;
        const totalDelay = (lastDelay + 2.8) * 1000; // 留足打字时间
        this._queueEventDispatch(evt.then, totalDelay);
      }
      return; // 不走 afterEvent
    } else if(evt.type === 'call'){
      // 电话事件：稍后触发
      this._queueCall(eventId, (evt.delay||0)*1000);
      return; // 电话的后续在通话结束后处理
    } else if(evt.type === 'photo_unlock'){
      this.unlockPhoto(evt.photo);
    } else if(evt.type === 'music_unlock'){
      this.unlockMusic(evt.music);
    } else if(evt.type === 'note_add'){
      this.addNote(evt.note);
    } else if(evt.type === 'calendar_add'){
      this.addCalendar(evt.event);
    } else if(evt.type === 'moment_post'){
      this.postMoment(evt.moment);
    } else if(evt.type === 'dream'){
      this.triggerDream(evt.dream);
      return; // 梦境后续在玩家完成后处理
    } else if(evt.type === 'advance_time'){
      this._queueTimeAdvance(eventId);
      return;
    } else if(evt.type === 'advance_day'){
      this._queueTimeAdvance(eventId);
      return;
    } else if(evt.type === 'route_choice'){
      // 路线选择：发出提示消息后等待玩家选择
      this._addInteraction({id:`route:${eventId}`, type:'route_choice', eventId});
      this.emit('routeChoiceReady', this.story.routeChoice);
      this.emit('stateChange', this.state);
      return;
    } else if(evt.type === 'ending'){
      // 支持动态结局判定：若事件带 _compute，根据 state 计算实际 endingId
      const endingId = (typeof evt._compute === 'function') ? evt._compute(this.state) : evt.ending;
      this.triggerEnding(endingId);
      return;
    } else if(evt.type === 'encounter'){
      // 赴约/剧情场景：复用偶遇屏，then 在 resolveEncounter 后触发
      this._pendingEncounterThen = evt.then || null;
      this._addInteraction({id:`encounter:event:${eventId}`, type:'encounter', eventId, encounterId:evt.encounter?.id || ''});
      this.emit('encounterTriggered', {locId:null, enc:evt.encounter});
      this.emit('stateChange', this.state);
      return;
    } else if(evt.type === 'group_message_batch'){
      // 多人群聊消息
      const n = evt.messages.length;
      evt.messages.forEach((m, i) => this.queueGroupMessage(evt.groupId, m, (evt.delay || 0) + i*0.3));
      if(evt.then){
        const lastDelay = (evt.delay || 0) + (n-1)*0.3;
        const totalDelay = (lastDelay + 2.8) * 1000;
        this._queueEventDispatch(evt.then, totalDelay);
      }
      return;
    }
    this.afterEvent(evt);
  }
  afterEvent(evt){
    if(evt.then) this._queueEventDispatch(evt.then, 400);
  }

  checkTimeEvents(){
    this._releasePendingFinale();   // v0.9.7（D2-A′）：到日子了再放行最终抉择
    // 检查基于时间触发的事件
    const t = this.getTime();
    const d = this.state.day;
    // v0.2.1: 已进男主线（shenyan/luci/jiangyu）的玩家跳过通用日常事件
    const inRoute = !!this.state.route && this.state.route !== 'solo';
    for(const [id, evt] of Object.entries(this.story.events)){
      if(this.state.firedEvents[id]) continue;
      if(evt.legacy) continue;   // v0.9.7（D2）：结局日之后的内容，结构性不可达，不参与调度
      if(evt.trigger && evt.trigger.day === d && evt.trigger.hour === t.hour){
        // trigger.soloOnly 的通用日常事件（day7-10 中后期日常、雨天等）只在未确定男主线时派发，
        // 否则会侵入男主线结局段（曾导致 week1_review 的 choice 抢走最终抉择，测试 294→291 失败）
        if(evt.trigger.soloOnly && inRoute) continue;
        if(evt.trigger.inRoute && !inRoute) continue;   // v0.3.1: 男主线专属中后期日常
        if(evt.trigger.route && evt.trigger.route !== this.state.route){   // v0.9.2: 按具体路线过滤
          // v0.9.7：尚未选线时不要直接丢弃，先挂起，chooseRoute 后补发
          if(!this.state.route) this._queuePendingRouteEvent(id, evt);
          continue;
        }
        // v0.9.5：主线链进行中，日常时间事件延后派发，避免抢占主线 choice
        if(evt.deferWhenBusy && this._mainChainBusy() && !['ending','route_choice'].includes(evt.type)){
          if(!this.state.deferredEventIds.includes(id)){
            this.state.deferredEventIds.push(id);
            if(!this._deferredSince) this._deferredSince = Date.now();
          }
          continue;
        }
        this.scheduleEvent(id);
      }
    }
  }

  // ===== 消息系统 =====
  _newPendingId(prefix){
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
  _queueEventDispatch(eventId, delay=0){
    if(!this.story.events?.[eventId] && !this.story.criticalEvents?.[eventId]) return null;
    const item = {id:this._newPendingId('event'), eventId, dueAt:Date.now() + Math.max(0, delay)};
    this.state.pendingEventDispatches.push(item);
    this._schedulePendingEventDispatch(item);
    this.emit('stateChange', this.state);
    return item.id;
  }
  _schedulePendingEventDispatch(item){
    this._setTimeout(()=>{
      const idx = this.state.pendingEventDispatches.findIndex(p=>p.id === item.id);
      if(idx < 0) return;
      const [pending] = this.state.pendingEventDispatches.splice(idx, 1);
      this.scheduleEvent(pending.eventId);
    }, Math.max(0, item.dueAt - Date.now()));
  }
  _queueTimeAdvance(eventId, delay=1800){
    const evt = this.story.events?.[eventId];
    if(!evt || !['advance_time','advance_day'].includes(evt.type)) return null;
    const item = {id:this._newPendingId('time-advance'), eventId, dueAt:Date.now() + Math.max(0, delay)};
    this.state.pendingTimeAdvances.push(item);
    this._schedulePendingTimeAdvance(item, true);
    this.emit('stateChange', this.state);
    return item.id;
  }
  _schedulePendingTimeAdvance(item, announce=false){
    const evt = this.story.events?.[item.eventId];
    if(!evt || !['advance_time','advance_day'].includes(evt.type)) return;
    if(announce) this.emit('timeAdvance', {text:evt.text});
    this._setTimeout(()=>{
      const idx = this.state.pendingTimeAdvances.findIndex(p=>p.id === item.id);
      if(idx < 0) return;
      this.state.pendingTimeAdvances.splice(idx, 1);
      if(evt.type === 'advance_time') this.advanceTime(evt.minutes);
      else this.advanceToNextDay(evt.hour || 9);
      this.afterEvent(evt);
      this.emit('timeAdvanceEnd');
      this.emit('stateChange', this.state);
    }, Math.max(0, item.dueAt - Date.now()));
  }
  _queueCall(eventId, delay=0){
    const item = {id:this._newPendingId('call'), eventId, dueAt:Date.now() + Math.max(0, delay)};
    this.state.pendingCalls.push(item);
    this._schedulePendingCall(item);
    this.emit('stateChange', this.state);
    return item.id;
  }
  _schedulePendingCall(item){
    this._setTimeout(()=>{
      const idx = this.state.pendingCalls.findIndex(p=>p.id === item.id);
      if(idx < 0) return;
      const [pending] = this.state.pendingCalls.splice(idx, 1);
      this.triggerCall(pending.eventId);
    }, Math.max(0, item.dueAt - Date.now()));
  }
  _schedulePendingMessage(item){
    this._setTimeout(()=> this._deliverPendingMessage(item.id), Math.max(0, item.dueAt - Date.now()));
  }
  _stampChoiceDeadline(choice){
    if(!choice || typeof choice !== 'object') return choice;
    if(!choice.timeout || choice.dueAt > 0) return choice;
    return {...choice, dueAt: Date.now() + choice.timeout * 1000};
  }
  _deliverPendingMessage(id){
    const idx = this.state.pendingMessages.findIndex(p=>p.id === id);
    if(idx < 0) return;
    const [msg] = this.state.pendingMessages.splice(idx, 1);
    // v0.9.5：氛围事件自动结算，不挂起选择，避免与主线 choice 竞争
    if(msg.choice && msg.choice.auto){
      const autoOpt = msg.choice.options && msg.choice.options[0];
      msg.choice = null;
      if(autoOpt){
        this._applyEffects(autoOpt.effects || {});
        if(autoOpt.effects && autoOpt.effects.thenEvent) this._queueEventDispatch(autoOpt.effects.thenEvent, 600);
      }
    }
    if(msg.choice) msg.choice = this._stampChoiceDeadline(msg.choice);
    if(msg.groupId){
      const group = this.state.groups[msg.groupId];
      if(!group) return;
      group.typing = false;
      group.messages.push({from:msg.from, text:msg.text, time:this.getTime().time, ts:Date.now()});
      group.unread++;
      this.emit('groupUpdate', {id:msg.groupId, group});
      this.emit('groupMessageReceived', {groupId:msg.groupId, from:msg.from, text:msg.text, group});
      if(msg.choice){
        group.pendingChoice = msg.choice;
        this.emit('choicePrompt', {convId:'group:'+msg.groupId, choice:msg.choice, conv:group});
      }
      if(msg.thenEvent) this._queueEventDispatch(msg.thenEvent, 600);
      this.emit('stateChange', this.state);
      return;
    }
    if(msg.from === 'narrator'){
      this.emit('messageReceived', {from:'narrator', text:msg.text});
      if(msg.choice){
        this._addInteraction({id:`narrator:${msg.id}`, type:'narrator_choice', messageId:msg.id, choice:msg.choice});
        this.emit('choicePrompt', {convId:'narrator', choice:msg.choice, conv:null});
      }
      if(msg.thenEvent) this._queueEventDispatch(msg.thenEvent, 600);
      this.emit('stateChange', this.state);
      return;
    }
    const conv = this.state.conversations[msg.from];
    if(!conv || conv.finished) return;
    conv.typing = false;
    const msgObj = {id:this._newPendingId('received'), from:msg.from, text:msg.text, time:this.getTime().time, ts:Date.now(), replied:false};
    conv.messages.push(msgObj);
    conv.unread++;
    this.emit('conversationUpdate', {id:msg.from, conv});
    this.emit('messageReceived', {from:msg.from, text:msg.text, conv});
    if(msg.choice){
      conv.pendingChoice = msg.choice;
      this.emit('choicePrompt', {convId:msg.from, choice:msg.choice, conv});
    }
    if(msg.followup){
      this._queueFollowup(msg.from, msgObj, msg.followup);
    }
    if(msg.thenEvent) this._queueEventDispatch(msg.thenEvent, 600);
    this.emit('stateChange', this.state);
  }
  _queueFollowup(convId, message, followup){
    if(!message?.id || !followup?.text) return null;
    const item = {
      id:this._newPendingId('followup'), convId, messageId:message.id,
      text:followup.text, affection:followup.affection || {},
      dueAt:Date.now() + Math.max(1, followup.delay || 30) * 1000
    };
    this.state.pendingFollowups.push(item);
    this._schedulePendingFollowup(item);
    return item.id;
  }
  _schedulePendingFollowup(item){
    this._setTimeout(()=>{
      const idx = this.state.pendingFollowups.findIndex(p=>p.id === item.id);
      if(idx < 0) return;
      const [pending] = this.state.pendingFollowups.splice(idx, 1);
      const conv = this.state.conversations[pending.convId];
      const message = conv?.messages.find(m=>m.id === pending.messageId);
      if(conv && message && !message.replied && conv.messages[conv.messages.length-1] === message){
        conv.messages.push({from:pending.convId, text:pending.text, time:this.getTime().time, ts:Date.now(), isFollowup:true});
        conv.unread++;
        if(pending.affection) this._applyEffects({affection:pending.affection});
        this.emit('conversationUpdate', {id:pending.convId, conv});
        this.emit('messageReceived', {from:pending.convId, text:pending.text, conv, isFollowup:true});
        this.state.flags.followup_triggered = true;
      }
      this.emit('stateChange', this.state);
    }, Math.max(0, item.dueAt - Date.now()));
  }

  // 玩家发送消息（通过选项触发）
  // 归一化选项 effects：兼容 thenEvent 写在 effects 外层

  // 处理特殊 thenEvent（邀约 accept/decline），否则按普通事件触发

  // 玩家选择路线（特殊处理：直接触发对应路线的首个事件）

  // 标记会话已读

  // ===== 电话系统 =====
  // 添加通话记录

  // ===== 相册 =====

  // ===== 音乐 =====

  // ===== 备忘录 =====

  // ===== 日历 =====

  // ===== 朋友圈 =====
  // 玩家自己发动态

  // ===== 梦境碎片 =====

  // ===== 性格画像 =====
  // 记录性格变化（由选择触发）

  // ===== 出行/地点系统 =====

  // ===== 回忆杀系统 =====

  // ===== 苏苏情报网 =====

  // ===== 共同邀约/赴约系统 =====
  // 玩家在会话选项里选了"接受/拒绝"
  // 检查所有 pending 邀约是否需要判定为 missed（路线选择后未处理的邀约自动 miss）

  // ===== 多人聊天群 =====
  // 玩家在群里选择

  // ===== 语音信箱（未接来电） =====
  // 回拨：触发 callbackEvent（如果有）

  // ===== 闪回/前传章节 =====

  // ===== 时间推进动画 =====

  // ===== 结局 =====

  // ===== 礼物商城+喜好系统 =====

  // ===== 心情状态+内心独白 =====

  // ===== 塔罗占卜+每日运势 =====
  // 跨天重置每日运势（由 advanceToNextDay 调用）

  // ===== 成就系统 =====
  // 获取已解锁成就详情列表
  // 获取未解锁成就（隐藏成就的 desc 显示为 ???）

  // ===== v0.0.10 收集柜+隐藏彩蛋 =====

  // ===== v0.0.10 解谜玩法 =====

  // ===== v0.0.10 季节系统+节日事件 =====

  // ===== v0.0.10 男主视角+反向剧情 =====
  // 是否解锁全部3个男主真相结局（解锁终极真结局）

  // ===== v0.0.13 主角自定义+动态称谓 =====
  // 获取男主对玩家的当前称谓
  // 文本替换：把 $PLAYER$ / $NICK$ 替换为玩家名/昵称

  // ===== v0.0.13 关系阶段+临界事件 =====

  // ===== v0.0.13 每日任务+连胜奖励 =====

  // ===== v0.0.13 观赏模式+自动推进 =====

  // ===== v0.0.15 好感度深度系统 =====

  // ===== v0.0.15 主题/壁纸系统 =====
  // 检查并解锁所有满足条件的主题（每次 stateChange 后调用）

  // ===== v0.0.15 结局图鉴 =====
  // triggerEnding 时自动记入 endingGallerySeen
  // 调用 STORY.computeEnding 计算实际结局

  // ===== v0.0.15 每日约会小剧场 =====
  // 判断男主本周是否可约会（从未约过/值为0视为可约）
  // 获取男主可用的约会场景列表
  // 发起约会：只做校验和触发模态，不标记 firedEvents/dateLastDone（移到 finishDate）
  // 但需要占用"本周约会名额"，用 _pendingDate 字段标记"正在进行的约会"
  // 取消约会：玩家点"先离开"时调用，清理 _pendingDate，不消耗本周名额
  // 完成约会：应用 effects + 解锁照片 + 记录历史 + 标记 firedEvents/dateLastDone

  // ===== v0.0.16 梦魇系统 =====
  // 在 advanceToNextDay 后调用：检查是否触发梦魇
  // 解梦：玩家选择后应用 effects + 更新心情

  // ===== v0.0.16 智能提示开关 =====
  // 给 UI 用：获取某个选项的提示文案

  // ===== v0.0.16 男主朋友圈互动 =====
  // 玩家发朋友圈后调用：根据配图类别生成男主评论
  // moment = {id, art, text, ...}
  // 玩家回复男主评论：应用 reply effects + 记录

  // ===== v0.0.16 动态背景氛围 =====
  // 根据当前 state 计算应用哪个氛围层

  // ===== 存档 =====
  // v0.1.0: 多槽位 + 自动存档 + 继续游戏 + 导出导入
  static SAVE_VERSION = 3;
  static SAVE_KEY = 'neon_phone_saves';
  static SLOT_AUTO = 'auto';
  static SLOT_MANUAL = ['slot1', 'slot2', 'slot3'];
  static AUTO_SAVE_MIN_INTERVAL_MS = 8000;
  static AUTO_SAVE_PERIODIC_MS = 60000;
  static MAX_SAVE_BYTES = 1500000;


}

// v0.5.8（F2.3）：旧字段名转发到组合对象（调用面/测试零改动）
Object.defineProperties(PhoneEngine.prototype, {
  _timers:          { get(){ return this.scheduler.timers; }, configurable: true },
  _callMissTimers:  { get(){ return this.scheduler.callMissTimers; }, configurable: true },
  _scheduledEvents: { get(){ return this.scheduler.scheduledEvents; }, configurable: true },
  _memorySaves:     { get(){ return this.saveManager.memorySaves; }, set(v){ this.saveManager.memorySaves = v; }, configurable: true },
  _savesCache:      { get(){ return this.saveManager.cache; }, set(v){ this.saveManager.cache = v; }, configurable: true },
});

if (typeof window !== 'undefined') window.PhoneEngine = PhoneEngine;


/* ===== engine_content.js ===== */
/* ===== 霓虹心事 · 引擎：内容玩法：照片/音乐/备忘/日历/朋友圈/梦境/性格/地点偶遇/回忆/情报/邀约/闪回/结局触发/礼物/心情/日记/塔罗 =====
 * 本文件由 engine.js 拆分而来（v0.1.7），方法逐字搬移，经 Object.assign 混入 PhoneEngine.prototype。
 */

Object.assign(PhoneEngine.prototype, {
  unlockPhoto(photoId){
    if(this.state.photos.find(p=>p.id===photoId)) return;
    const photo = this.story.photos[photoId];
    if(photo){
      this.state.photos.push({id:photoId, ...photo, unlocked:true});
      this.emit('photoUnlocked', photo);
      this.emit('stateChange', this.state);
    }
  },

  unlockMusic(musicId){
    if(this.state.music.unlocked.includes(musicId)) return;
    const m = this.story.music[musicId];
    if(m){
      this.state.music.unlocked.push(musicId);
      this.emit('musicUnlocked', m);
      this.emit('stateChange', this.state);
    }
  },

  playMusic(musicId){
    if(!this.state.music.unlocked.includes(musicId)) return false;
    this.state.music.playing = musicId;
    this.emit('musicChange', this.story.music[musicId]);
    return true;
  },

  addNote(note){
    this.state.notes.unshift({...note, time:this.getDateLabel().full});
    this.emit('stateChange', this.state);
  },

  addCalendar(event){
    this.state.calendar.push(event);
    this.emit('stateChange', this.state);
  },

  postMoment(momentId){
    const tmpl = this.story.moments[momentId];
    if(!tmpl) return;
    if(this.state.moments.find(m=>m.id===momentId)) return; // 已发布
    const char = this.story.characters[tmpl.author];
    const moment = {
      id: momentId,
      author: tmpl.author,
      name: char?.name || tmpl.author,
      avatar: char?.avatar || '?',
      avatarImg: char?.avatarImg || '',
      avatarThumb: char?.avatarThumb || '',
      bg: char?.bg || '#2a2f5a',
      text: tmpl.text,
      art: tmpl.art || null,
      time: this.getTime().time,
      day: this.state.day,
      dateLabel: this.getDateLabel().full,
      likes: [...(tmpl.likes||[])],
      comments: [...(tmpl.comments||[])],
      // 玩家互动后的追加评论（角色回复）
      replyOnLike: tmpl.replyOnLike || null,
      commentOptions: tmpl.commentOptions || null,
      replyOnComment: tmpl.replyOnComment || null
    };
    this.state.moments.unshift(moment);
    this.emit('momentPosted', moment);
    this.emit('stateChange', this.state);
    // 若有 onLike 的自动回复，不在此触发——等玩家点赞时再触发
  },

  likeMoment(momentId){
    const moment = this.state.moments.find(m=>m.id===momentId);
    if(!moment) return false;
    const inter = this.state.momentInteractions[momentId] || {};
    if(inter.liked) return false; // 已点赞
    inter.liked = true;
    this.state.momentInteractions[momentId] = inter;
    moment.likes.push('me');
    // 若有回复触发
    if(moment.replyOnLike){
      this._setTimeout(()=>{
        moment.comments.push({from: moment.author, text: moment.replyOnLike, isReply:true});
        this.emit('momentUpdate', moment);
        this.emit('stateChange', this.state);
      }, 1500);
    }
    // 好感度变化
    const tmpl = this.story.moments[momentId];
    if(tmpl?.onLike?.affection){
      this._applyEffects({affection: tmpl.onLike.affection});
    }
    this.emit('momentUpdate', moment);
    this.emit('stateChange', this.state);
    return true;
  },

  commentMoment(momentId, optIdx){
    const moment = this.state.moments.find(m=>m.id===momentId);
    if(!moment || !moment.commentOptions) return false;
    const inter = this.state.momentInteractions[momentId] || {};
    if(inter.commented) return false;
    const opt = moment.commentOptions[optIdx];
    if(!opt) return false;
    inter.commented = true;
    inter.commentIdx = optIdx;
    this.state.momentInteractions[momentId] = inter;
    // 玩家评论
    moment.comments.push({from:'me', text: opt.text});
    // 好感度
    this._applyEffects({affection: opt.affection});
    // 角色回复
    if(opt.reply){
      this._setTimeout(()=>{
        moment.comments.push({from: moment.author, text: opt.reply, isReply:true});
        this.emit('momentUpdate', moment);
        this.emit('stateChange', this.state);
      }, 1800);
    }
    this.emit('momentUpdate', moment);
    this.emit('stateChange', this.state);
    return true;
  },

  createMyMoment(text, art){
    const normalizedText = typeof text === 'string' ? text.trim().slice(0, 280) : '';
    if(!normalizedText) return null;
    if(this.state.moments.filter(m=>m.isMine).length >= 200) return null;
    const id = 'my_moment_' + Date.now();
    const moment = {
      id, author:'me', name:'林夏', avatar:'林', bg:'#5a2a4a',
      text: normalizedText, art: art||null,
      time: this.getTime().time, day: this.state.day,
      dateLabel: this.getDateLabel().full,
      likes: [], comments: [],
      isMine: true
    };
    this.state.moments.unshift(moment);
    this.emit('momentPosted', moment);
    this.emit('stateChange', this.state);
    // 好感度高的角色可能来点赞评论
    this._maybeReactToMyMoment(moment);
    return id;
  },

  _maybeReactToMyMoment(moment){
    // 根据好感度，随机角色来互动
    const affs = Object.entries(this.state.affection).filter(([k,v])=>v > 0);
    if(affs.length === 0) return;
    affs.sort((a,b)=>b[1]-a[1]);
    const topChar = affs[0][0];
    this._setTimeout(()=>{
      moment.likes.push(topChar);
      // 高好感度时偶尔评论
      const aff = this.state.affection[topChar];
      if(aff >= 3 && moment.text){
        const replies = ['.', '我知道了', '嗯'];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        moment.comments.push({from: topChar, text: reply, isReply:true});
      }
      this.emit('momentUpdate', moment);
      this.emit('stateChange', this.state);
    }, 2000 + Math.random()*3000);
  },

  triggerDream(dreamId){
    const dream = this.story.dreams[dreamId];
    if(!dream || this.state.activeDream || this.state.resolvedDreams[dreamId]) return false;
    this.state.activeDream = dreamId;
    this.emit('dreamStart', {dreamId, dream});
    this.emit('stateChange', this.state);
    return true;
  },

  resolveDream(dreamId, choiceIdx){
    const dream = this.story.dreams[dreamId];
    if(!dream || this.state.activeDream !== dreamId || this.state.resolvedDreams[dreamId]) return false;
    const opt = dream.options[choiceIdx];
    if(!opt) return false;
    // 收集碎片
    this.state.dreamShards.push({
      dreamId,
      title: dream.title,
      choice: opt.text,
      shard: opt.shard || null,
      meaning: opt.meaning || null
    });
    // 性格画像
    this._applyEffects({personality: opt.personality});
    this.state.resolvedDreams[dreamId] = true;
    this.state.activeDream = null;
    this.emit('dreamResolved', {dreamId, choice: opt});
    this.emit('stateChange', this.state);
    // 触发后续
    if(dream.then) this._queueEventDispatch(dream.then, 800);
    return true;
  },

  getPersonalityProfile(){
    const p = this.state.personality;
    const traits = [];
    // 主动 vs 被动
    if(p.active > p.passive) traits.push({dim:'行动力', value:'主动型', score: p.active});
    else if(p.passive > p.active) traits.push({dim:'行动力', value:'被动型', score: p.passive});
    else traits.push({dim:'行动力', value:'平衡型', score: p.active});
    // 感性 vs 理性
    if(p.emotional > p.rational) traits.push({dim:'决策方式', value:'感性主导', score: p.emotional});
    else if(p.rational > p.emotional) traits.push({dim:'决策方式', value:'理性主导', score: p.rational});
    else traits.push({dim:'决策方式', value:'平衡型', score: p.rational});
    // 独立 vs 依赖
    if(p.independent > p.dependent) traits.push({dim:'依赖度', value:'独立型', score: p.independent});
    else if(p.dependent > p.independent) traits.push({dim:'依赖度', value:'依赖型', score: p.dependent});
    else traits.push({dim:'依赖度', value:'平衡型', score: p.independent});
    return {
      traits,
      shards: this.state.dreamShards.length,
      shardDetails: this.state.dreamShards,
      memoryShards: this.state.memoryShards,
      memoryCount: this.state.memoryShards.length
    };
  },

  trackPersonality(dim, value){
    if(this.state.personality[dim] !== undefined){
      this.state.personality[dim] += value;
    }
  },

  // v0.6.7：地点渐进解锁（story.locations[].unlock：{day} / {event, dayFallback}）
  isLocationUnlocked(locId){
    const loc = this.story.locations?.[locId];
    if(!loc) return false;
    const u = loc.unlock;
    if(!u) return true;   // 无条件（如：家）
    if(u.day && this.state.day >= u.day) return true;
    if(u.event){
      if(this.state.firedEvents?.[u.event]) return true;
      if(u.dayFallback && this.state.day >= u.dayFallback) return true;
    }
    return false;
  },
  goToLocation(locId){
    const loc = this.story.locations[locId];
    if(!loc) return false;
    if(!this.isLocationUnlocked(locId)){
      this.emit('locationLocked', {locId});
      return false;
    }
    this.state.currentLocation = locId;
    this.state.locationVisits.push({locId, day:this.state.day, ts:Date.now()});
    if(this.state.locationVisits.length > 200) this.state.locationVisits.splice(0, this.state.locationVisits.length - 200);
    this.emit('locationChange', {locId, loc});
    this.emit('stateChange', this.state);
    // 推进时间30分钟
    this.advanceTime(30);
    if(!this.state.flags._visited_set) this.state.flags._visited_set = {};
    this.state.flags._visited_set[locId] = true;
    const allLocs = Object.keys(this.story.locations || {});
    if(allLocs.length > 0 && allLocs.every(l => this.state.flags._visited_set[l])){
      this.state.flags.visited_all_locations = true;
    }
    // 尝试触发偶遇
    return this.tryEncounter(locId);
  },

  tryEncounter(locId){
    const loc = this.story.locations[locId];
    if(!loc || !loc.encounters) return false;
    // 找满足条件且未触发过的偶遇
    const available = loc.encounters.filter(e=>{
      if(e.once && this.state.visitedEncounters[e.id]) return false;
      try { return !e.condition || e.condition(this.state); }
      catch(_) { return false; }
    });
    if(available.length === 0){
      // v0.2.0: 塔罗「遇见」hint 落地——此地无事但今日运势高时，50% 概率「转角撞见」：
      // 从全城已满足条件且未触发过的偶遇里随机补一场（每局一次）
      const enc2 = this._fortuneValue('encounter') && !this.state.flags.encounter_fortune_used
        ? Object.values(this.story.locations).flatMap(loc => (loc.encounters||[]).filter(e => {
            if(e.once && this.state.visitedEncounters[e.id]) return false;
            try { return !e.condition || e.condition(this.state); } catch(_) { return false; }
          }))
        : [];
      if(enc2.length > 0 && Math.random() < 0.5){
        this.state.flags.encounter_fortune_used = true;
        const pick = enc2[Math.floor(Math.random() * enc2.length)];
        this.state.visitedEncounters[pick.id] = true;
        this._addInteraction({id:`encounter:fortune:${pick.id}`, type:'encounter', locId:null, encounterId:pick.id});
        this.emit('encounterTriggered', {locId:null, enc:pick, isFortune:true});
        this.emit('stateChange', this.state);
        return true;
      }
      this.emit('encounterEmpty', {locId});
      return false;
    }
    // 随机选一个
    const enc = available[Math.floor(Math.random() * available.length)];
    this.state.visitedEncounters[enc.id] = true;
    this._addInteraction({id:`encounter:location:${locId}:${enc.id}`, type:'encounter', locId, encounterId:enc.id});
    this.emit('encounterTriggered', {locId, enc});
    this.emit('stateChange', this.state);
    return true;
  },

  resolveEncounter(enc, optIdx){
    const opt = enc.choice?.options?.[optIdx];
    if(!opt) return false;
    // 应用 effects
    this._applyEffects({affection: opt.affection, personality: opt.personality, flags: opt.flags});
    // v0.1.10: 亲密度分项——偶遇是"一起经历过的事"，完成一次偶遇该角色 closeness +1
    // （closeness+1 经三轴反向同步对综合好感的影响为 round(1/3)=0，只动分项）
    if(enc.char && this.state.affectionDetail?.[enc.char]){
      this._applyEffects({affectionDetail: {[enc.char]: {closeness: 1}}});
    }
    // 角色回复（若有）
    if(opt.reply){
      const conv = this.state.conversations[enc.char];
      if(conv){
        this._setTimeout(()=>{
          conv.messages.push({
            from: enc.char,
            text: opt.reply,
            time: this.getTime().time,
            ts: Date.now()
          });
          conv.unread++;
          this.emit('conversationUpdate', {id:enc.char, conv});
          this.emit('messageReceived', {from:enc.char, text:opt.reply, conv});
        }, 1200);
      } else if(enc.char === 'narrator'){
        this._setTimeout(()=> this.emit('messageReceived', {from:'narrator', text:opt.reply}), 1200);
      }
    }
    const pending = this._findInteraction(item=>item.type === 'encounter' &&
      (item.encounterId === enc.id || item.eventId === enc.id));
    const pendingEventId = pending?.eventId;
    this.emit('encounterResolved', {enc, opt});
    if(pending) this._removeInteraction(item=>item.id === pending.id);
    this.emit('stateChange', this.state);
    // 触发 then（赴约场景的后续事件）
    const thenEvt = enc.then || this._pendingEncounterThen || this.story.events?.[pendingEventId]?.then;
    this._pendingEncounterThen = null;
    if(thenEvt) this._queueEventDispatch(thenEvt, 1000);
    return true;
  },

  getPendingEncounter(){
    const pending = this._findInteraction(item=>item.type === 'encounter');
    if(!pending || pending.type !== 'encounter') return null;
    const eventEncounter = pending.eventId && this.story.events?.[pending.eventId]?.encounter;
    if(eventEncounter) return eventEncounter;
    const list = this.story.locations?.[pending.locId]?.encounters || [];
    return list.find(enc=>enc.id === pending.encounterId) || null;
  },

  cancelPendingInteraction(idOrType='encounter'){
    const pending = typeof idOrType === 'string'
      ? this._findInteraction(item=>item.id === idOrType || item.type === idOrType)
      : this._findInteraction(item=>item.id === idOrType?.id ||
        (item.type === 'encounter' && item.encounterId === idOrType?.id));
    if(!pending) return false;
    if(pending.type === 'encounter'){
      this._pendingEncounterThen = null;
      if(pending.locId){
        const encounter = this.story.locations?.[pending.locId]?.encounters?.find(enc=>enc.id === pending.encounterId);
        if(encounter?.once) delete this.state.visitedEncounters[pending.encounterId];
      }
      if(pending.eventId) this.state.flags[`interaction_cancelled_${pending.eventId}`] = true;
    }
    this._removeInteraction(item=>item.id === pending.id);
    this.emit('stateChange', this.state);
    return true;
  },

  triggerMemory(memId){
    const mem = this.story.memories[memId];
    if(!mem) return false;
    if(this.state.resolvedMemories[memId]) return false;
    this.emit('memoryStart', {memId, mem});
    return true;
  },

  resolveMemory(memId, optIdx){
    const mem = this.story.memories[memId];
    if(!mem || this.state.resolvedMemories[memId]) return false;
    const opt = mem.options[optIdx];
    if(!opt) return false;
    this.state.resolvedMemories[memId] = true;
    this.state.memoryShards.push({
      memId,
      title: mem.title,
      choice: opt.text,
      shard: opt.shard || null,
      meaning: opt.meaning || null
    });
    this._applyEffects({personality: opt.personality});
    this.emit('memoryResolved', {memId, opt});
    this.emit('stateChange', this.state);
    // 触发后续（与其他 resolve 方法保持一致）
    if(mem.then) this._queueEventDispatch(mem.then, 800);
    return true;
  },

  getMemoriesByPhoto(photoId){
    // 找到触发该照片的回忆
    const memId = Object.keys(this.story.memories).find(k=> this.story.memories[k].triggerPhoto === photoId);
    return memId || null;
  },

  checkIntel(){
    if(!this.story.intel) return;
    for(const [id, intel] of Object.entries(this.story.intel)){
      if(this.state.firedIntel[id]) continue;
      try {
        if(!intel.condition || intel.condition(this.state)){
          this.state.firedIntel[id] = true;
          this.state.flags[id] = true;
          // 苏苏发情报消息
          this.queueMessage({
            from:'susu',
            text: intel.text,
            then: intel.then || null
          }, 1);
          this.emit('intelReceived', {id, intel});
        }
      } catch(_) {}
    }
  },

  checkInvitations(){
    if(!this.story.invitations) return;
    for(const [id, inv] of Object.entries(this.story.invitations)){
      if(this.state.firedInvitations[id]) continue;
      try {
        if(!inv.condition || inv.condition(this.state)){
          this.state.firedInvitations[id] = true;
          this.state.invitations.push({id, status:'pending', ts:Date.now()});
          // 邀约以特殊消息形式送达对应男主会话，附 choice
          this.queueMessage({
            from: inv.from,
            text: inv.text + `\n（${inv.schedule}）`,
            choice: {
              prompt: `${this.story.characters[inv.from]?.name||''}在等你回复：`,
              isInvitation: true, invitationId: id,
              options:[
                {text:'好，我去', effects:{thenEvent:'__inv_accept_'+id}, hint:'赴约'},
                {text:'抱歉，去不了', effects:{thenEvent:'__inv_decline_'+id}, hint:'拒绝'}
              ]
            }
          }, 1);
          this.emit('invitationReceived', {id, inv});
        }
      } catch(_) {}
    }
    // 检查超时的 pending 邀约（按真实时间判定）
    this.state.invitations.forEach(p=>{
      if(p.status !== 'pending') return;
      const inv = this.story.invitations[p.id];
      if(!inv) return;
      const elapsed = (Date.now() - p.ts)/1000;
      if(elapsed > (inv.timeoutSec || 120)){
        this.resolveInvitation(p.id, 'missed');
      }
    });
  },

  resolveInvitation(invId, decision){
    if(this.state.resolvedInvitations[invId]) return false;
    const inv = this.story.invitations[invId];
    if(!inv) return false;
    this.state.resolvedInvitations[invId] = decision;
    // 标记 pending 项已完成
    const p = this.state.invitations.find(x=>x.id===invId);
    if(p) p.status = decision;
    if(decision === 'accepted'){
      this.scheduleEvent(inv.acceptEvent);
    } else if(decision === 'declined'){
      this._applyEffects({affection: inv.affectionOnDecline});
      this.scheduleEvent(inv.declineEvent);
    } else if(decision === 'missed'){
      this._applyEffects({affection: inv.affectionOnMiss});
      this.scheduleEvent(inv.missEvent);
    }
    this.emit('invitationResolved', {id:invId, decision});
    this.emit('stateChange', this.state);
    return true;
  },

  missPendingInvitations(){
    const missed = [];
    this.state.invitations.forEach(p=>{
      if(p.status === 'pending'){
        const inv = this.story.invitations[p.id];
        let condMet = true;
        try {
          condMet = inv ? inv.condition(this.state) : false;
        } catch(_) { condMet = false; }
        if(inv && !condMet){
          // 条件不再满足（如已进入路线），自动 miss
          this.resolveInvitation(p.id, 'missed');
          missed.push(p.id);
        }
      }
    });
    return missed;
  },

  checkFlashbacks(){
    if(!this.story.flashbacks) return;
    for(const [id, fb] of Object.entries(this.story.flashbacks)){
      if(this.state.flashbacksSeen[id]) continue;
      try {
        if(!fb.trigger || fb.trigger(this.state)){
          this.state.flashbacksSeen[id] = true;
          this.triggerFlashback(id);
        }
      } catch(_) {}
    }
  },

  triggerFlashback(fbId){
    const fb = this.story.flashbacks[fbId];
    if(!fb) return false;
    this.emit('flashbackStart', {fbId, fb});
    return true;
  },

  resolveFlashback(fbId, sceneChoices){
    const fb = this.story.flashbacks[fbId];
    if(!fb) return;
    // sceneChoices: [{sceneIdx, optIdx}]
    if(sceneChoices){
      sceneChoices.forEach(sc=>{
        const scene = fb.scenes[sc.sceneIdx];
        const opt = scene.choice?.options?.[sc.optIdx];
        if(opt){
          this._applyEffects({personality: opt.personality});
          if(opt.shard){
            this.state.flashbackShards.push({fbId, shard:opt.shard, meaning:opt.meaning||null});
          }
        }
      });
    }
    if(fb.reward){
      if(fb.reward.photo) this.unlockPhoto(fb.reward.photo);
      if(fb.reward.flag) this.state.flags[fb.reward.flag] = true;
    }
    this.emit('flashbackResolved', {fbId, fb});
    this.emit('stateChange', this.state);
    if(fb.then) this._queueEventDispatch(fb.then, 800);
  },

  showTimeAdvance(text, callback){
    this.emit('timeAdvance', {text});
    this._setTimeout(()=>{ callback && callback(); this.emit('timeAdvanceEnd'); }, 1800);
  },

  triggerEnding(endingId){
    const ending = this.story.endings?.[endingId];
    if(this.state.ended || !ending) return false;
    this.state.ended = true;
    this.state.endingSeen[endingId] = true;
    // v0.5.0（E3）：结局时快照跨周目资产（持久化在 state，读档后点二周目依然可用）
    this.state.ngCarry = {
      collected: [...this.state.collected], achievements: {...this.state.achievements},
      endingSeen: {...this.state.endingSeen}, endingGallery: {...this.state.endingGallery},
      easterEggsSeen: {...this.state.easterEggsSeen}, tarotHistory: [...this.state.tarotHistory],
      unlockedThemes: {...this.state.unlockedThemes}, unlockedIconThemes: {...this.state.unlockedIconThemes},
      ngPlus: this.state.ngPlus || 0,
    };
    // v0.0.15: 同步记录结局图鉴
    this.recordEndingGallery(endingId);
    // 结局后清理所有定时器，避免幽灵消息
    this._clearAllTimers();
    this.emit('stateChange', this.state);
    // 结局是最不能丢失的状态，绕过节流立即落盘。
    this.autoSave(true);
    this.emit('ending', {...ending, id: endingId});  // v0.5.2: 补 id 供 UI 挂 CG 映射
    return true;
  },

  buyGift(itemId){
    const item = this.story.shop.items[itemId];
    if(!item) return {ok:false, reason:'物品不存在'};
    // v0.2.0: 塔罗「好运」hint 落地——今日每件立减 hint 值×10%（下限 10% 折）
    const luck = this._fortuneValue('luck');
    const price = luck ? Math.max(1, Math.round(item.price * Math.max(0.1, 1 - luck * 0.1))) : item.price;
    if(this.state.coins < price) return {ok:false, reason:'金币不足'};
    this.state.coins -= price;
    this.state.inventory.push({id:itemId, ts:Date.now()});
    this.emit('stateChange', this.state);
    this.checkAchievements();
    return {ok:true, item, paidPrice: price};
  },

  giveGift(toCharId, itemId){
    const item = this.story.shop.items[itemId];
    if(!item) return {ok:false, reason:'物品不存在'};
    // 从背包中移除一件
    const invIdx = this.state.inventory.findIndex(g=>g.id===itemId);
    if(invIdx < 0) return {ok:false, reason:'背包里没有这件礼物'};
    this.state.inventory.splice(invIdx, 1);
    const prefs = this.story.shop.preferences[toCharId] || {};
    const mult = prefs[itemId] !== undefined ? prefs[itemId] : 1;
    // 基础好感 = 物品价格/50，乘以喜好倍率
    const baseAff = Math.max(1, Math.round(item.price / 50));
    const gain = Math.round(baseAff * mult);
    this._applyEffects({affection:{[toCharId]:gain}});
    // v0.1.10: 信任度分项——投其所好（喜好倍率>1）信任 +1；普通礼物只是多相处，亲密 +1
    // （+1 经三轴反向同步对综合好感影响为 0，只动分项）
    if(this.state.affectionDetail?.[toCharId]){
      if(mult > 1) this._applyEffects({affectionDetail:{[toCharId]:{trust:1}}});
      else this._applyEffects({affectionDetail:{[toCharId]:{closeness:1}}});
    }
    const giftRec = {to:toCharId, itemId, mult, gain, ts:Date.now(), day:this.state.day};
    this.state.gifts.push(giftRec);
    // 触发男主反应消息
    const reactions = (this.story.shop.reactions || {})[toCharId] || {};
    let reactionText = reactions[mult] || reactions[1] || '……谢谢。';
    // 江屿 1.5 的两种情况（黑胶 vs 调酒器具）
    if(toCharId === 'jiangyu' && mult === 1.5){
      reactionText = itemId === 'cocktail_set' ? (reactions['1.5b'] || reactions['1.5']) : reactions['1.5'];
    }
    const conv = this.state.conversations[toCharId];
    if(conv){
      this._setTimeout(()=>{
        conv.messages.push({
          from: toCharId,
          text: reactionText,
          time: this.getTime().time,
          ts: Date.now(),
          isGiftReaction: true,
          giftItem: itemId,
          giftMult: mult
        });
        conv.unread++;
        this.emit('conversationUpdate', {id:toCharId, conv});
        this.emit('messageReceived', {from:toCharId, text:reactionText, conv, isGiftReaction:true});
      }, 800);
    }
    this.emit('giftGiven', {to:toCharId, itemId, mult, gain, reaction:reactionText});
    this.emit('stateChange', this.state);
    this.checkAchievements();
    return {ok:true, mult, gain, reaction:reactionText};
  },

  setMood(moodId){
    if(!this.story.moods[moodId]) return false;
    this.state.mood = moodId;
    this.state.moodHistory.push({mood:moodId, day:this.state.day, ts:Date.now()});
    // 应用心情效果：写入对应 flag
    const eff = this.story.moodEffects[moodId];
    if(eff){
      if(eff.flag) this.state.flags[eff.flag] = true;
      if(eff.bonusPersonality){
        this.state.personality[eff.bonusPersonality] = (this.state.personality[eff.bonusPersonality]||0) + 1;
      }
    }
    this.emit('moodChanged', {mood:moodId, moodInfo:this.story.moods[moodId]});
    this.emit('stateChange', this.state);
    this.checkAchievements();
    return true;
  },

  addDiary(text){
    if(!text || !text.trim()) return false;
    const normalizedText = text.trim().slice(0, 500);
    this.state.diary.push({
      text: normalizedText,
      mood: this.state.mood,
      day: this.state.day,
      time: this.getTime().time,
      ts: Date.now()
    });
    if(this.state.diary.length > 200) this.state.diary.splice(0, this.state.diary.length - 200);
    // 内心独白影响性格画像（写下来 = 自省 = 理性+1）
    this.state.personality.rational = (this.state.personality.rational||0) + 1;
    this.emit('diaryAdded', this.state.diary[this.state.diary.length-1]);
    this.emit('stateChange', this.state);
    return true;
  },

  drawTarot(){
    // 每天只能抽一次
    if(this.state.lastTarotDay === this.state.day && this.state.todayFortune){
      return {ok:false, reason:'今日已抽过', fortune:this.state.todayFortune};
    }
    const cards = Object.values(this.story.tarot.cards);
    if(cards.length === 0) return {ok:false, reason:'无牌组'};
    const card = cards[Math.floor(Math.random() * cards.length)];
    const reversed = Math.random() < 0.35;  // 35% 概率逆位
    const text = reversed ? card.reversed : card.upright;
    const fortune = {cardId:card.id, name:card.name, roman:card.roman, reversed, text, hint:card.hint, day:this.state.day};
    this.state.todayFortune = fortune;
    this.state.lastTarotDay = this.state.day;
    this.state.tarotHistory.push({day:this.state.day, cardId:card.id, reversed, ts:Date.now()});
    // 写入运势 flag
    if(card.hint){
      this.state.flags['tarot_' + card.hint.type] = card.hint.value;
    }
    // v0.2.4: 抽牌即时反馈——按当日牌面 hint 类型派发苏苏评论（当日新牌面联动）
    if(card.hint && this.story.events?.['tarot_draw_reaction_' + card.hint.type]){
      this._queueEventDispatch('tarot_draw_reaction_' + card.hint.type, 800);
    }
    this.emit('tarotDrawn', fortune);
    this.emit('stateChange', this.state);
    this.emit('ambienceChange', this.getCurrentAmbience());  // v0.1.8: 抽牌立即叠加幸运/沉重氛围
    this.checkAchievements();
    return {ok:true, fortune};
  },

  _resetDailyFortune(){
    const f = this.state.todayFortune;
    if(f && f.day !== this.state.day){
      // v0.1.12: 昨日运势早报——换日时按牌面 hint 类型派发一条晨间指引（每张牌至多一次）
      const evtId = 'tarot_morning_' + (f.hint?.type || 'luck');
      if(this.story.events?.[evtId] && !this.state.flags['tarot_morning_day' + f.day]){
        this.state.flags['tarot_morning_day' + f.day] = true;
        this._queueEventDispatch(evtId, 2500);
      }
      this.state.todayFortune = null;
    }
  },
});


/* ===== engine_progress.js ===== */
/* ===== 霓虹心事 · 引擎：成长系统：成就/收集/彩蛋/线索解谜/季节节日/视角/玩家档案/问答/关系阶段/每日任务/连胜/观赏模式/好感深度/主题/结局图鉴/约会/梦魇/提示 =====
 * 本文件由 engine.js 拆分而来（v0.1.7），方法逐字搬移，经 Object.assign 混入 PhoneEngine.prototype。
 */

Object.assign(PhoneEngine.prototype, {
  checkAchievements(){
    if(!this.story.achievements) return [];
    const newly = [];
    for(const [id, ach] of Object.entries(this.story.achievements)){
      if(this.state.achievements[id]) continue;
      try {
        if(ach.condition(this.state)){
          this.state.achievements[id] = true;
          newly.push(id);
        }
      } catch(_) {}
    }
    if(newly.length > 0){
      this.emit('achievementsUnlocked', newly.map(id=>this.story.achievements[id]));
    }
    return newly;
  },

  isTrueEndingUnlocked(){
    try {
      return this.story.trueEndingUnlockCondition(this.state);
    } catch(_) { return false; }
  },

  getUnlockedAchievements(){
    const list = [];
    for(const [id, ach] of Object.entries(this.story.achievements||{})){
      if(this.state.achievements[id]){
        list.push({...ach, unlocked:true});
      }
    }
    return list;
  },

  getLockedAchievements(){
    const list = [];
    for(const [id, ach] of Object.entries(this.story.achievements||{})){
      if(!this.state.achievements[id]){
        const isHidden = ach.desc.startsWith('(隐藏)');
        list.push({
          id, icon: isHidden ? '❓' : ach.icon,
          name: isHidden ? '???' : ach.name,
          desc: isHidden ? '（隐藏成就）' : ach.desc,
          unlocked:false
        });
      }
    }
    return list;
  },

  collectItem(itemId){
    if(!this.story.collectibles || !this.story.collectibles[itemId]) return false;
    if(this.state.collected.includes(itemId)) return false;
    this.state.collected.push(itemId);
    const item = this.story.collectibles[itemId];
    this.emit('itemCollected', {item, itemId});
    this.emit('stateChange', this.state);
    this.checkAchievements();
    this.checkEasterEggs();
    return true;
  },

  getCollectedByCategory(cat){
    return this.state.collected
      .map(id => this.story.collectibles[id])
      .filter(c => c && c.cat === cat);
  },

  checkEasterEggs(){
    if(!this.story.easterEggs) return [];
    const newly = [];
    for(const [id, egg] of Object.entries(this.story.easterEggs)){
      if(this.state.easterEggsSeen[id]) continue;
      try {
        if(egg.condition(this.state)){
          this.state.easterEggsSeen[id] = true;
          newly.push(egg);
        }
      } catch(_) {}
    }
    if(newly.length > 0){
      this.emit('easterEggUnlocked', newly);
    }
    return newly;
  },

  getUnlockedEasterEggs(){
    return Object.keys(this.state.easterEggsSeen||{})
      .map(id => this.story.easterEggs?.[id])
      .filter(Boolean);
  },

  discoverClue(clueId){
    this.state.discoveredClues[clueId] = true;
    this.emit('clueDiscovered', {clueId});
    this.emit('stateChange', this.state);
  },

  attemptPuzzle(puzzleId, answer){
    const puzzle = this.story.puzzles?.[puzzleId];
    if(!puzzle) return {ok:false, reason:'谜题不存在'};
    const progress = this.state.puzzleProgress[puzzleId] || {attemptCount:0, solved:false};
    if(progress.solved) return {ok:false, reason:'已解开', solved:true};
    progress.attemptCount++;
    progress.lastAttempt = answer;
    progress.lastAttemptDay = this.state.day;
    if(answer === puzzle.answer){
      progress.solved = true;
      this.state.puzzleProgress[puzzleId] = progress;
      // 发放奖励
      const reward = puzzle.reward || {};
      if(reward.collectible) this.collectItem(reward.collectible);
      if(reward.flag) this.state.flags[reward.flag] = true;
      if(reward.affection){
        this._applyEffects({affection: reward.affection});
      }
      this.emit('puzzleSolved', {puzzleId, puzzle, reward});
      this.emit('stateChange', this.state);
      this.checkAchievements();
      return {ok:true, solved:true, message:puzzle.onSuccess, reward};
    } else {
      this.state.puzzleProgress[puzzleId] = progress;
      this.emit('puzzleFailed', {puzzleId, attempt:answer, attemptCount:progress.attemptCount});
      this.emit('stateChange', this.state);
      return {ok:false, solved:false, message:puzzle.onFail, attemptCount:progress.attemptCount};
    }
  },

  isPuzzleSolved(puzzleId){
    return this.state.puzzleProgress[puzzleId]?.solved === true;
  },

  getAllPuzzles(){
    if(!this.story.puzzles) return [];
    return Object.values(this.story.puzzles).map(p=>{
      const progress = this.state.puzzleProgress[p.id] || {};
      return {
        ...p,
        solved: progress.solved === true,
        attemptCount: progress.attemptCount || 0,
        clues: p.clues.map(c=>({
          ...c,
          discovered: this.state.discoveredClues[c.id] === true
        }))
      };
    });
  },

  getCurrentSeason(){
    const date = this.getDateLabel();
    const seasonId = this.story.seasons?.getSeason(date.month) || 'summer';
    return this.story.seasons?.seasonInfo[seasonId] || {id:seasonId, name:'夏', icon:'☀️', desc:''};
  },

  checkHoliday(){
    if(!this.story.seasons?.holidays) return null;
    const date = this.getDateLabel();
    let key = `${date.month}-${date.date}`;
    let holiday = this.story.seasons.holidays[key];
    // v0.5.10（F4）：现实世界季节事件——玩家设备月-日命中同一张表（霜降/冬至/跨年/春分等）
    if(!holiday && typeof Date !== 'undefined'){
      try {
        const now = new Date();
        const rk = `${now.getMonth() + 1}-${now.getDate()}`;
        const real = this.story.seasons.holidays[rk];
        if(real && real.id && !this.state.flags['holiday_real_' + real.id + '_done']){
          this.state.flags['holiday_real_' + real.id + '_done'] = true;
          holiday = real;
        }
      } catch(_) {}
    }
    if(!holiday) return null;
    // 防止同一天重复触发
    const flagKey = 'holiday_' + holiday.id + '_day' + this.state.day;
    if(this.state.flags[flagKey]) return null;
    this.state.flags[flagKey] = true;
    // 应用效果
    const eff = holiday.effect || {};
    if(eff.collectible) this.collectItem(eff.collectible);
    if(eff.coins) this.state.coins = (this.state.coins || 0) + eff.coins;  // v0.1.7: 支持金币奖励
    if(eff.flag) this.state.flags[eff.flag] = true;
    if(eff.personality){
      for(const k in eff.personality){
        if(this.state.personality[k] !== undefined) this.state.personality[k] += eff.personality[k];
      }
    }
    this.emit('holidayTriggered', {holiday, date});
    this.emit('stateChange', this.state);
    return holiday;
  },

  getUpcomingHolidays(days=7){
    if(!this.story.seasons?.holidays) return [];
    const date = this.getDateLabel();
    const result = [];
    const start = new Date(2025, date.month-1, date.date);
    for(let i=1; i<=days; i++){
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = `${d.getMonth()+1}-${d.getDate()}`;
      const h = this.story.seasons.holidays[key];
      if(h) result.push({holiday:h, inDays:i, date:{month:d.getMonth()+1, date:d.getDate()}});
    }
    return result;
  },

  isPerspectiveUnlocked(charId){
    const p = this.story.malePerspectives?.[charId];
    if(!p) return false;
    try { return p.unlockCondition(this.state); } catch(_) { return false; }
  },

  getAllPerspectives(){
    if(!this.story.malePerspectives) return [];
    return Object.values(this.story.malePerspectives).map(p=>{
      const seen = this.state.perspectivesSeen[p.charId] || {};
      return {
        ...p,
        unlocked: this.isPerspectiveUnlocked(p.charId),
        scenesSeen: Object.keys(seen).length,
        totalScenes: p.scenes.length,
        truthEndingSeen: this.state.truthEndingsSeen[p.charId] === true,
        scenes: p.scenes.map(s=>({
          ...s,
          seen: seen[s.id] === true
        }))
      };
    });
  },

  markPerspectiveSceneSeen(charId, sceneId){
    if(!this.state.perspectivesSeen[charId]) this.state.perspectivesSeen[charId] = {};
    this.state.perspectivesSeen[charId][sceneId] = true;
    const p = this.story.malePerspectives?.[charId];
    if(p){
      const allSeen = p.scenes.every(s => this.state.perspectivesSeen[charId][s.id]);
      if(allSeen && !this.state.truthEndingsSeen[charId]){
        this.state.truthEndingsSeen[charId] = true;
        this.emit('truthEndingUnlocked', {charId, perspective:p});
      }
    }
    this.emit('stateChange', this.state);
  },

  isTruthEndingSeen(charId){
    return this.state.truthEndingsSeen[charId] === true;
  },

  isUltimateTruthEndingUnlocked(){
    return ['shenyan','luci','jiangyu'].every(c => this.state.truthEndingsSeen[c] === true);
  },

  setPlayer(info){
    const def = (this.story.playerCustomization && this.story.playerCustomization.defaultPlayer) || {};
    this.state.player = {
      name: info.name || def.name || '林夏',
      nickname: info.nickname || def.nickname || '夏夏',
      avatar: info.avatar || (info.name ? info.name[0] : '林'),
      bg: info.bg || def.bg || '#5a2a4a',
      age: info.age || def.age || 24,
      pronoun: info.pronoun || def.pronoun || '她',
      answers: info.answers || {}
    };
    this.emit('playerChanged', this.state.player);
    this.emit('stateChange', this.state);
  },

  getPlayer(){
    if(this.state.player) return this.state.player;
    return (this.story.playerCustomization && this.story.playerCustomization.defaultPlayer) || {name:'林夏',nickname:'夏夏',avatar:'林'};
  },

  answerQuiz(quizId, optIdx){
    const quiz = (this.story.playerCustomization?.personalityQuiz || []).find(q=>q.id === quizId);
    if(!quiz) return false;
    const opt = quiz.options[optIdx];
    if(!opt) return false;
    if(!this.state.player) this.setPlayer({});
    const previous = this.state.player.answers[quizId];
    if(previous === optIdx) return true;
    this._applyQuizPersonalityDelta(quiz, previous, -1);
    this.state.player.answers[quizId] = optIdx;
    this._applyQuizPersonalityDelta(quiz, optIdx, 1);
    this.emit('stateChange', this.state);
    return true;
  },

  _applyQuizPersonalityDelta(quiz, optIdx, direction){
    if(!quiz || !Number.isInteger(optIdx) || !quiz.options?.[optIdx]?.effects?.personality) return;
    const delta = {};
    for(const [key, value] of Object.entries(quiz.options[optIdx].effects.personality)){
      if(this.state.personality[key] !== undefined && Number.isFinite(value)) delta[key] = value * direction;
    }
    this._applyEffects({personality: delta});
  },

  updatePlayerProfile(info){
    const oldAnswers = {...(this.state.player?.answers || {})};
    const nextAnswers = {...(info?.answers || {})};
    const quiz = this.story.playerCustomization?.personalityQuiz || [];
    quiz.forEach(q=>{
      const oldIdx = oldAnswers[q.id];
      const newIdx = nextAnswers[q.id];
      if(oldIdx !== newIdx){
        this._applyQuizPersonalityDelta(q, oldIdx, -1);
        this._applyQuizPersonalityDelta(q, newIdx, 1);
      }
    });
    this.setPlayer({...info, answers:nextAnswers});
  },

  finishQuiz(){
    this.state.playerQuizDone = true;
    this.emit('quizFinished', this.state.player);
    this.emit('stateChange', this.state);
  },

  getCharNickname(charId){
    const aff = this.state.affection[charId] || 0;
    const list = this.story.playerCustomization?.dynamicNicknames?.[charId] || [];
    for(const n of list){
      if(aff >= n.min && aff <= n.max) return n;
    }
    return list[0] || { call: this.getPlayer().name, inner: '' };
  },

  replacePlayerTokens(text){
    if(!text) return text;
    const p = this.getPlayer();
    return text.replace(/\$PLAYER\$/g, () => p.name)
               .replace(/\$NICK\$/g, () => p.nickname);
  },

  getRelationshipStage(charId){
    const aff = this.state.affection[charId] || 0;
    const stages = this.story.relationshipStages?.[charId] || [];
    for(const s of stages){
      if(aff >= s.minAff && aff <= s.maxAff) return s;
    }
    return stages[0] || null;
  },

  getRelationshipStageNum(charId){
    const st = this.getRelationshipStage(charId);
    return (st && st.stage) || 1;
  },

  checkRelationshipStageUp(charId){
    const cur = this.getRelationshipStageNum(charId);
    const prev = this.state.relationshipStages[charId] || 1;
    if(cur > prev){
      // 阶段提升
      this.state.relationshipStages[charId] = cur;
      const stage = this.getRelationshipStage(charId);
      this.emit('relationshipStageUp', {charId, stage, prevStage: prev});
      // 临界事件延迟入队；任务本身持久化，读档后仍可继续派发。
      if(stage.criticalEvent){
        const evt = this.story.criticalEvents?.[stage.criticalEvent];
        const pending = this.state.pendingEventDispatches.some(item=>item.eventId === stage.criticalEvent);
        if(evt && !this.state.firedEvents[stage.criticalEvent] && !pending){
          this._queueEventDispatch(stage.criticalEvent, 2000);
        }
      }
      return stage;
    } else if(cur < prev){
      this.state.relationshipStages[charId] = cur;
    }
    return null;
  },

  getAllRelationshipStages(){
    return ['shenyan','luci','jiangyu'].map(cid => ({
      charId: cid,
      stage: this.getRelationshipStage(cid) || {stage:1, name:'陌生', title:'', desc:''},
      stageNum: this.getRelationshipStageNum(cid),
      affection: this.state.affection[cid] || 0
    }));
  },

  generateDailyTasks(){
    const pool = (this.story.dailyTasks?.pool || []).slice();
    // 随机抽 3 个
    const tasks = [];
    for(let i=0; i<3 && pool.length>0; i++){
      const idx = Math.floor(Math.random() * pool.length);
      const t = pool.splice(idx, 1)[0];
      tasks.push({
        id: t.id, name: t.name, desc: t.desc, reward: t.reward,
        completed: false, day: this.state.day, check: t.check
      });
    }
    this.state.dailyTasks = tasks;
    this.state.lastTaskDay = this.state.day;
    this.emit('dailyTasksUpdated', tasks);
    return tasks;
  },

  checkDailyTasks(){
    if(this.state.lastTaskDay !== this.state.day){
      // 跨天：检查昨日是否全部完成，更新连胜
      const allDone = this.state.dailyTasks.length > 0 && this.state.dailyTasks.every(t=>t.completed);
      if(allDone){
        this.state.taskStreak = (this.state.taskStreak || 0) + 1;
      } else {
        this.state.taskStreak = 0;
      }
      this.generateDailyTasks();
    }
    // 检查当前任务完成情况
    let newlyCompleted = [];
    this.state.dailyTasks.forEach(t => {
      if(!t.completed){
        try {
          if(t.check(this.state)){
            t.completed = true;
            // 发放奖励
            if(t.reward.coins){
              this.state.coins = (this.state.coins || 0) + t.reward.coins;
            }
            newlyCompleted.push(t);
          }
        } catch(_) {}
      }
    });
    if(newlyCompleted.length > 0){
      this.emit('dailyTaskCompleted', newlyCompleted);
      this.checkStreakRewards();
    }
    this.emit('stateChange', this.state);
    return newlyCompleted;
  },

  checkStreakRewards(){
    // 仅通知"可领取"，不自动发放，由玩家在 UI 上手动 claimStreakReward
    const rewards = this.story.dailyTasks?.streakRewards || [];
    const claimable = [];
    for(const r of rewards){
      if(this.state.taskStreak >= r.days && !this.state.taskStreakClaimed[r.days]){
        claimable.push(r);
      }
    }
    if(claimable.length > 0){
      this.emit('streakRewardAvailable', claimable);
    }
  },

  claimStreakReward(days){
    const rewards = this.story.dailyTasks?.streakRewards || [];
    const r = rewards.find(rr => rr.days === days);
    if(!r) return false;
    if(this.state.taskStreak < r.days) return false;
    if(this.state.taskStreakClaimed[days]) return false;
    this.state.taskStreakClaimed[days] = true;
    if(r.reward.coins) this.state.coins += r.reward.coins;
    if(r.reward.collectible) this.collectItem(r.reward.collectible);
    if(r.reward.flag) this.state.flags[r.reward.flag] = true;
    this.emit('streakRewardClaimed', r);
    this.emit('stateChange', this.state);
    return true;
  },

  getDailyTasks(){
    if(this.state.lastTaskDay !== this.state.day){
      this.generateDailyTasks();
    }
    return this.state.dailyTasks;
  },

  setWatchMode(enabled, strategy){
    this.state.watchMode = !!enabled;
    if(strategy) this.state.watchStrategy = strategy;
    this.emit('watchModeChanged', {enabled: this.state.watchMode, strategy: this.state.watchStrategy});
    this.emit('stateChange', this.state);
  },

  pickAutoChoice(options){
    const strategy = this.story.watchMode?.strategies?.[this.state.watchStrategy] || this.story.watchMode?.strategies?.balanced;
    if(!strategy || !options || options.length === 0) return 0;
    try { return strategy.pick(options); } catch(_) { return 0; }
  },

  getAffectionDetail(charId){
    const ad = this.state.affectionDetail && this.state.affectionDetail[charId];
    if(!ad) return {closeness:0, trust:0, tension:0};
    return {closeness:ad.closeness||0, trust:ad.trust||0, tension:ad.tension||0};
  },

  getAffectionDimStage(charId, dimId){
    const ad = this.getAffectionDetail(charId);
    const stages = this.story.affectionDimStages?.[dimId] || [];
    const v = ad[dimId] || 0;
    for(const s of stages){
      if(v >= s.min && v <= s.max) return s;
    }
    return stages[0] || {name:'-'};
  },

  getAllAffectionDetail(){
    return ['shenyan','luci','jiangyu'].map(cid => ({
      charId: cid,
      detail: this.getAffectionDetail(cid),
      stages: {
        closeness: this.getAffectionDimStage(cid, 'closeness'),
        trust: this.getAffectionDimStage(cid, 'trust'),
        tension: this.getAffectionDimStage(cid, 'tension')
      }
    }));
  },

  checkThemeUnlocks(){
    const themes = this.story.themes || {};
    const iconThemes = this.story.iconThemes || {};
    let newlyUnlocked = [];
    for(const id in themes){
      const t = themes[id];
      if(this.state.unlockedThemes[id]) continue;
      if(!t.unlockCondition){ this.state.unlockedThemes[id] = true; continue; }
      try {
        if(t.unlockCondition(this.state)){
          this.state.unlockedThemes[id] = true;
          newlyUnlocked.push({type:'theme', id, name:t.name});
        }
      } catch(_) {}
    }
    for(const id in iconThemes){
      const t = iconThemes[id];
      if(this.state.unlockedIconThemes[id]) continue;
      if(!t.unlockCondition){ this.state.unlockedIconThemes[id] = true; continue; }
      try {
        if(t.unlockCondition(this.state)){
          this.state.unlockedIconThemes[id] = true;
          newlyUnlocked.push({type:'iconTheme', id, name:t.name});
        }
      } catch(_) {}
    }
    if(newlyUnlocked.length > 0){
      this.emit('themesUnlocked', newlyUnlocked);
    }
    return newlyUnlocked;
  },

  setTheme(themeId){
    if(!this.state.unlockedThemes[themeId]) return false;
    this.state.currentTheme = themeId;
    this.emit('themeChanged', {type:'theme', id:themeId, theme:this.story.themes[themeId]});
    this.emit('stateChange', this.state);
    return true;
  },

  setIconTheme(iconThemeId){
    if(!this.state.unlockedIconThemes[iconThemeId]) return false;
    this.state.currentIconTheme = iconThemeId;
    this.emit('themeChanged', {type:'iconTheme', id:iconThemeId, theme:this.story.iconThemes[iconThemeId]});
    this.emit('stateChange', this.state);
    return true;
  },

  getCurrentTheme(){ return this.story.themes?.[this.state.currentTheme] || this.story.themes?.default; },

  getCurrentIconTheme(){ return this.story.iconThemes?.[this.state.currentIconTheme] || this.story.iconThemes?.default; },

  recordEndingGallery(endingId){
    if(!endingId) return;
    this.state.endingGallerySeen[endingId] = true;
    this.emit('endingGalleryUpdated', endingId);
  },

  getEndingGallery(){
    const all = this.story.endingGallery || {};
    return Object.values(all).map(e => ({
      ...e,
      seen: !!this.state.endingGallerySeen[e.id],
      charName: e.charId ? (this.story.characters[e.charId]?.name || e.charId) : '独行线'
    }));
  },

  computeCurrentEnding(){
    if(typeof this.story.computeEnding !== 'function') return null;
    try { return this.story.computeEnding(this.state, this.state.route); }
    catch(_) { return null; }
  },

  canDate(charId){
    const last = this.state.dateLastDone[charId];
    if(!last) return true;  // 0/undefined/null 都视为未约过
    const cooldown = this.story.dateCooldownDays || 7;
    return (this.state.day - last) >= cooldown;
  },

  getAvailableDateScenes(charId){
    const list = (this.story.dateScenes && this.story.dateScenes[charId]) || [];
    return list.filter(s => !this.state.firedEvents[s.id]);
  },

  startDate(sceneId){
    let charId = null, scene = null;
    for(const cid in this.story.dateScenes || {}){
      const found = (this.story.dateScenes[cid]||[]).find(s=>s.id===sceneId);
      if(found){ charId = cid; scene = found; break; }
    }
    if(!scene || !charId) return {ok:false, reason:'场景不存在'};
    if(!this.canDate(charId)) return {ok:false, reason:'本周已约过'};
    if(this.state.firedEvents[sceneId]) return {ok:false, reason:'已体验过'};
    if(this._pendingDate && this._pendingDate.sceneId){
      return {ok:false, reason:'已有进行中的约会'};
    }
    // 标记进行中（不写入持久化状态，避免存档腐败）
    this._pendingDate = {charId, sceneId, scene};
    this.emit('dateStarted', {charId, scene});
    return {ok:true, charId, scene};
  },

  cancelDate(){
    this._pendingDate = null;
  },

  finishDate(sceneId){
    let charId = null, scene = null;
    for(const cid in this.story.dateScenes || {}){
      const found = (this.story.dateScenes[cid]||[]).find(s=>s.id===sceneId);
      if(found){ charId = cid; scene = found; break; }
    }
    if(!scene || this.state.firedEvents[sceneId]) return false;
    if(!this._pendingDate || this._pendingDate.sceneId !== sceneId) return false;
    if(scene.effects) this._applyEffects(scene.effects);
    if(scene.unlockPhoto) this.unlockPhoto(scene.unlockPhoto);
    // 现在才真正标记已完成
    this.state.firedEvents[sceneId] = true;
    this.state.dateLastDone[charId] = this.state.day;
    this.state.dateHistory.push({
      charId, sceneId, day:this.state.day, ts:Date.now()
    });
    this._pendingDate = null;
    this.emit('dateFinished', {charId, scene});
    this.emit('stateChange', this.state);
    return true;
  },

  getDateStats(){
    const cooldown = this.story.dateCooldownDays || 7;
    return ['shenyan','luci','jiangyu'].map(cid => {
      const last = this.state.dateLastDone[cid];
      const remaining = last ? Math.max(0, cooldown - (this.state.day - last)) : 0;
      const available = this.getAvailableDateScenes(cid);
      return {
        charId: cid,
        canDate: this.canDate(cid),
        remainingDays: remaining,
        availableScenes: available,
        totalScenes: (this.story.dateScenes?.[cid]||[]).length,
        doneScenes: (this.story.dateScenes?.[cid]||[]).length - available.length
      };
    });
  },

  // v0.1.10: 暧昧度分项——深夜（23 点后）心动独白
  // tension≥10 的男主发来一条独白消息（每角色一次，flag 去重）；呼应「心跳加速的瞬间累积」
  // v0.8.4: 朋友圈自动日常动态——每天随机一个角色发一条（day2 起）
  checkAutoMoments(){
    if(this.state.ended) return;
    if(this.state.day < 2) return;
    const flagKey = 'auto_moment_day' + this.state.day;
    if(this.state.flags[flagKey]) return;
    const pool = [
      {author:'susu', text:'今日份霓城天气播报☀️ 记得吃早饭！', art:null},
      {author:'susu', text:'有没有人告诉我，这家店的拿铁为什么这么好喝🥤', art:null},
      {author:'luci', text:'扫街随手拍。霓城的早高峰，人人都很赶，但光不赶。', art:'street'},
      {author:'luci', text:'今天的光线很适合拍照。可惜好照片都是等出来的。', art:null},
      {author:'jiangyu', text:'深夜写歌的人，不需要听众。但如果你在听，那就更好了。', art:null},
      {author:'jiangyu', text:'今晚雾港的客人点了三首老歌。第三首我没唱。有些歌要留着。', art:null},
      {author:'shenyan', text:'闭馆后的展厅，回声都是干净的。', art:'gallery'},
      {author:'shenyan', text:'今天的展签改了三遍。有些话说多了不如放着一幅画。', art:null},
    ];
    const usedTexts = new Set(this.state.moments.map(m=>m.text));
    const available = pool.filter(p=>!usedTexts.has(p.text));
    if(available.length === 0) return;
    const pick = available[Math.floor(Math.random() * available.length)];
    this.state.flags[flagKey] = true;
    const char = this.story.characters[pick.author];
    if(char){
      this.state.moments.unshift({
        id: 'auto_moment_' + this.state.day,
        author: pick.author, name: char.name, avatar: char.avatar,
        avatarImg: char.avatarImg || '', bg: char.bg,
        text: pick.text, art: pick.art, ts: Date.now(), day: this.state.day,
        likes: [], comments: []
      });
      this.emit('momentPosted', this.state.moments[0]);
      this.emit('stateChange', this.state);
    }
  },

  checkTensionWhispers(){
    if(this.state.ended) return;
    const hour = Math.floor(this.state.minute / 60);
    if(hour < 23) return;
    for(const cid of ['shenyan','luci','jiangyu']){
      const ad = this.state.affectionDetail?.[cid];
      if(!ad || ad.tension < 10) continue;
      const flag = 'whisper_' + cid + '_done';
      if(this.state.flags[flag]) continue;
      const evtId = 'tension_whisper_' + cid;
      if(!this.story.events?.[evtId] || this.state.firedEvents[evtId]) continue;
      this.scheduleEvent(evtId);
    }
  },

  checkNightmare(){
    if(this.state.ended) return null;
    // 同一天不重复触发
    if(this.state.lastNightmareDay === this.state.day || this.state.activeNightmare) return null;
    const nightmares = this.story.nightmares || {};
    const hour = Math.floor(this.state.minute / 60);
    // 只在夜晚（20:00-次日6:00）触发
    if(hour < 20 && hour >= 6) return null;
    for(const id in nightmares){
      const nm = nightmares[id];
      if(this.state.nightmaresSeen[id]) continue;  // 已看过的不重复
      try {
        if(nm.trigger(this.state)){
          this.state.activeNightmare = id;
          this.emit('nightmareTriggered', nm);
          return nm;
        }
      } catch(_) {}
    }
    return null;
  },

  resolveNightmare(nightmareId, optIdx){
    const nm = this.story.nightmares?.[nightmareId];
    if(!nm || !nm.resolve || this.state.activeNightmare !== nightmareId || this.state.nightmaresSeen[nightmareId]) return false;
    const opt = nm.resolve.options[optIdx];
    if(!opt) return false;
    if(nm.effects) this._applyEffects(nm.effects);
    if(opt.effects) this._applyEffects(opt.effects);
    this.state.nightmaresSeen[nightmareId] = true;
    this.state.lastNightmareDay = this.state.day;
    this.state.activeNightmare = null;
    const mood = opt.moodAfter || nm.moodAfter;
    if(mood && this.story.moods?.[mood]) this.state.mood = mood;
    this.emit('nightmareResolved', {nightmareId, optIdx, opt});
    this.emit('stateChange', this.state);
    return true;
  },

  setShowOptionHints(on){
    this.state.showOptionHints = !!on;
    this.emit('optionHintsToggled', this.state.showOptionHints);
    this.emit('stateChange', this.state);
  },

  getOptionHint(opt){
    if(!this.state.showOptionHints) return null;
    if(!this.story.optionHints?.generate) return null;
    try { return this.story.optionHints.generate(opt); } catch(_) { return null; }
  },

  generateMomentComments(moment){
    const cfg = this.story.momentComments?.byCategory || {};
    const cat = moment.art || '';
    const charComments = cfg[cat] || cfg[''] || {};
    const result = [];
    for(const charId in charComments){
      const list = charComments[charId];
      if(!list || list.length === 0) continue;
      // 随机选一条评论（确定性：用 moment.id 做种子）
      const seed = (moment.id || '').split('').reduce((a,c)=>a + c.charCodeAt(0), 0);
      const comment = list[seed % list.length];
      result.push({charId, comment, commentIdx: seed % list.length});
      // 同时把评论作为消息加入男主会话
      const char = this.story.characters[charId];
      if(char){
        this.queueMessage({
          from: charId,
          text: `[评论了你的朋友圈] ${comment.text}`
        }, 1.5);
      }
      // 应用评论本身的 effects（玩家被动接收）
      if(comment.effects) this._applyEffects(comment.effects);
    }
    // v0.0.16: 直接写入 moment.charComments，便于 UI 读取
    moment.charComments = result;
    this.emit('momentCommentsGenerated', {momentId: moment.id, comments: result});
    return result;
  },

  replyMomentComment(momentId, charId, commentIdx, replyIdx){
    const moment = this.state.moments.find(m => m.id === momentId);
    if(!moment) return false;
    const cat = moment.art || '';
    const cfg = this.story.momentComments?.byCategory || {};
    const charComments = cfg[cat] || cfg[''] || {};
    const replyKey = `${momentId}_${charId}`;
    if(this.state.momentReplies[replyKey]) return false;
    const list = charComments[charId] || [];
    const comment = list[commentIdx];
    if(!comment) return false;
    const reply = comment.replyOptions?.[replyIdx];
    if(!reply) return false;
    if(reply.effects) this._applyEffects(reply.effects);
    this.state.momentReplies[replyKey] = {commentIdx, replyIdx};
    this.emit('momentReplySent', {momentId, charId, commentIdx, replyIdx, reply});
    this.emit('stateChange', this.state);
    return true;
  },

  getCurrentAmbience(){
    const list = this.story.ambiences || {};
    // 优先级：anxious > rainy > unlucky > night > dusk > dawn > lucky > day
    // （v0.1.8: unlucky/lucky 为塔罗运势层，低于心情与天气，高于白昼底色）
    const priority = ['anxious','rainy','unlucky','night','dusk','dawn','lucky','day'];
    for(const id of priority){
      const a = list[id];
      if(!a) continue;
      try { if(a.cond(this.state)) return a; } catch(_) {}
    }
    return null;
  },
});


/* ===== engine_save.js ===== */
/* ===== 霓虹心事 · 引擎：存档系统：槽位、规范化、读写、自动存档、导入导出 =====
 * 本文件由 engine.js 拆分而来（v0.1.7），方法逐字搬移，经 Object.assign 混入 PhoneEngine.prototype。
 */

Object.assign(PhoneEngine.prototype, {
  _isSaveSlot(slot){
    return slot === PhoneEngine.SLOT_AUTO || PhoneEngine.SLOT_MANUAL.includes(slot);
  },

  _buildSaveSummary(state=this.state){
    const t = {time:`${String(Math.floor(state.minute / 60)).padStart(2,'0')}:${String(state.minute % 60).padStart(2,'0')}`};
    const playerName = state.player?.name || state.player?.nickname || '林夏';
    const routeLabel = state.route ? (this.story.characters?.[state.route]?.name || state.route) : '未选线';
    return {
      day: state.day,
      clock: t.time,
      dateLabel: `第${state.day}天`,
      playerName,
      route: state.route || null,
      routeLabel,
      mood: state.mood || 'calm',
      ended: !!state.ended,
      affection: {...(state.affection || {})}
    };
  },

  _buildSaveData(slot, note){
    const t = this.getTime();
    const date = this.getDateLabel();
    const summary = this._buildSaveSummary(this.state);
    return {
      v: PhoneEngine.SAVE_VERSION,
      slot,
      state: JSON.parse(JSON.stringify(this.state)),
      time: new Date().toISOString(),
      note: typeof note === 'string' ? note.slice(0, 140) : '',
      label: `第${this.state.day}天 · ${t.time}`,
      summary: {...summary, dateLabel: date.full}
    };
  },

  _normalizeSaveData(raw, forcedSlot=null){
    if(!raw || typeof raw !== 'object' || Array.isArray(raw) || !raw.state || typeof raw.state !== 'object' || Array.isArray(raw.state)) return null;
    raw = SaveMigrations.migrate(raw);
    const slot = forcedSlot || raw.slot;
    if(!this._isSaveSlot(slot)) return null;
    const state = this._sanitizeLoadedState(raw.state);
    const parsedTime = typeof raw.time === 'string' ? Date.parse(raw.time) : NaN;
    const time = Number.isFinite(parsedTime) ? new Date(parsedTime).toISOString() : new Date().toISOString();
    const clock = `${String(Math.floor(state.minute / 60)).padStart(2,'0')}:${String(state.minute % 60).padStart(2,'0')}`;
    return {
      v: PhoneEngine.SAVE_VERSION,
      slot,
      state,
      time,
      note: typeof raw.note === 'string' ? raw.note.slice(0, 140) : '',
      label: `第${state.day}天 · ${clock}`,
      summary: this._buildSaveSummary(state)
    };
  },

  _sanitizeLoadedState(raw){
    const def = this.defaultState();
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const asText = (value, max=1000) => typeof value === 'string' ? value.slice(0, max) : '';
    const asInt = (value, fallback=0, min=0, max=999999) => {
      const n = Number(value);
      return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.trunc(n))) : fallback;
    };
    const asBool = value => value === true;
    const array = (value, limit, map) => Array.isArray(value) ? value.slice(0, limit).map(map).filter(v=>v !== null) : [];
    const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const safeKey = key => /^[a-zA-Z0-9_:-]{1,100}$/.test(key) && key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
    const record = (value, limit, map) => {
      const result = {};
      Object.entries(object(value)).slice(0, limit).forEach(([key, item])=>{
        if(safeKey(key)) result[key] = map(item, key);
      });
      return result;
    };
    const knownIds = values => new Set(Object.keys(values || {}));
    const idList = (value, allowed, limit=200) => [...new Set(array(value, limit, id => typeof id === 'string' && allowed.has(id) ? id : null))];
    const color = value => /^#[0-9a-fA-F]{6}$/.test(value || '') ? value : '#5a2a4a';
    const eventIds = new Set([
      ...Object.keys(this.story.events || {}),
      ...Object.keys(this.story.criticalEvents || {}),
      ...Object.values(this.story.dateScenes || {}).flat().map(scene=>scene.id)
    ]);
    const safeEventId = value => {
      if(typeof value !== 'string') return null;
      if(eventIds.has(value)) return value;
      return /^__inv_(accept|decline)_[a-zA-Z0-9_:-]{1,100}$/.test(value) ? value : null;
    };
    const sanitizeEffects = value => {
      const e = object(value);
      const result = {};
      const affection = {};
      Object.keys(def.affection).forEach(cid=>{
        const n = Number(object(e.affection)[cid]);
        if(Number.isFinite(n)) affection[cid] = Math.max(-9999, Math.min(9999, n));
      });
      if(Object.keys(affection).length) result.affection = affection;
      const personality = {};
      Object.keys(def.personality).forEach(key=>{
        const n = Number(object(e.personality)[key]);
        if(Number.isFinite(n)) personality[key] = Math.max(-9999, Math.min(9999, n));
      });
      if(Object.keys(personality).length) result.personality = personality;
      const affectionDetail = {};
      Object.keys(def.affectionDetail).forEach(cid=>{
        const detail = object(object(e.affectionDetail)[cid]);
        const clean = {};
        ['closeness','trust','tension'].forEach(key=>{
          const n = Number(detail[key]);
          if(Number.isFinite(n)) clean[key] = Math.max(-9999, Math.min(9999, n));
        });
        if(Object.keys(clean).length) affectionDetail[cid] = clean;
      });
      if(Object.keys(affectionDetail).length) result.affectionDetail = affectionDetail;
      const flags = {};
      Object.entries(object(e.flags)).slice(0, 50).forEach(([key, value])=>{
        if(!safeKey(key)) return;
        flags[key] = typeof value === 'string' ? value.slice(0, 100) : (Number.isFinite(value) ? Math.max(-9999, Math.min(9999, value)) : asBool(value));
      });
      if(Object.keys(flags).length) result.flags = flags;
      const thenEvent = safeEventId(e.thenEvent);
      if(thenEvent) result.thenEvent = thenEvent;
      return result;
    };
    const sanitizeChoice = value => {
      const c = object(value);
      if(typeof c.prompt !== 'string' || !Array.isArray(c.options)) return null;
      const options = c.options.slice(0, 10).map(opt=>{
        const o = object(opt);
        const outOpt = {text:asText(o.text, 500), hint:asText(o.hint, 300), effects:sanitizeEffects(o.effects)};
        const thenEvent = safeEventId(o.thenEvent);
        if(thenEvent) outOpt.thenEvent = thenEvent;
        if(o.route && ['shenyan','luci','jiangyu','solo'].includes(o.route)) outOpt.route = o.route;
        return outOpt;
      });
      const out = {prompt:asText(c.prompt, 1000), options, isInvitation:asBool(c.isInvitation)};
      const timeout = asInt(c.timeout, 0, 0, 3600);
      if(timeout > 0) out.timeout = timeout;
      const dueAt = asInt(c.dueAt, 0, 0, 9999999999999);
      if(dueAt > 0) out.dueAt = dueAt;
      if(c.freeInput && typeof c.freeInput === 'object' && !Array.isArray(c.freeInput)){
        const fi = c.freeInput;
        out.freeInput = {
          placeholder: asText(fi.placeholder, 200),
          keywords: Array.isArray(fi.keywords) ? fi.keywords.slice(0, 10).map(k=>{
            const o = object(k);
            return {
              words: Array.isArray(o.words) ? o.words.slice(0, 10).map(w=>asText(w, 50)).filter(Boolean) : [],
              effects: sanitizeEffects(o.effects),
              reply: asText(o.reply, 200)
            };
          }).filter(k=>k.words.length) : [],
          defaultEffect: sanitizeEffects(fi.defaultEffect)
        };
      }
      return out;
    };
    const sanitizePendingInteraction = value => {
      const p = object(value);
      const id = /^[a-zA-Z0-9_:-]{1,120}$/.test(p.id || '') ? p.id : null;
      const priority = asInt(p.priority, 0, 0, 999);
      if(p.type === 'route_choice'){
        const evt = safeEventId(p.eventId);
        return evt && this.story.events?.[evt]?.type === 'route_choice' ? {id:id || `route:${evt}`, type:'route_choice', eventId:evt, priority:priority || 60} : null;
      }
      if(p.type === 'narrator_choice'){
        const choice = sanitizeChoice(p.choice);
        return choice ? {id:id || `narrator:${asText(p.messageId,120) || 'pending'}`, type:'narrator_choice', messageId:asText(p.messageId,120), choice, priority:priority || 70} : null;
      }
      if(p.type === 'encounter'){
        const eventId = safeEventId(p.eventId);
        if(eventId && this.story.events?.[eventId]?.type === 'encounter'){
          return {id:id || `encounter:event:${eventId}`, type:'encounter', eventId, encounterId:asText(p.encounterId,100), priority:priority || 80};
        }
        const locId = typeof p.locId === 'string' && this.story.locations?.[p.locId] ? p.locId : null;
        const encounterId = asText(p.encounterId,100);
        if(locId && this.story.locations[locId].encounters?.some(enc=>enc.id === encounterId)){
          return {id:id || `encounter:location:${locId}:${encounterId}`, type:'encounter', locId, encounterId, priority:priority || 80};
        }
        return null;
      }
      if(p.type === 'call'){
        const eventId = safeEventId(p.eventId);
        return eventId && this.story.events?.[eventId]?.type === 'call'
          ? {id:id || `call:${eventId}`, type:'call', eventId, dueAt:asInt(p.dueAt, Date.now(), 0, 9999999999999), priority:priority || 100}
          : null;
      }
      return null;
    };
    const out = def;
    out.day = asInt(source.day, def.day, 1, 999);   // v0.8.6：收紧上限（商业级）
    out.minute = asInt(source.minute, def.minute, 0, 1439);
    out.ended = asBool(source.ended);
    out.route = ['shenyan','luci','jiangyu','solo'].includes(source.route) ? source.route : null;
    // v0.9.7（D2-A′）：被日期门槛拦下的最终抉择要能跨刷新存活
    {
      const finale = object(source.pendingFinale);
      const finaleId = safeEventId(finale.eventId);
      out.pendingFinale = finaleId ? {eventId: finaleId, day: asInt(finale.day, 0, 1, 999)} : null;
    }
    // v0.9.7：主线忙时延后的事件也必须随档恢复——旧实现只读不存，刷新一次延后队列就全丢，
    // 与 D1 同族：内容在内存里排好了，却因为存档白名单没带它而永久消失。
    out.deferredEventIds = idList(source.deferredEventIds, eventIds, 100);
    // v0.9.7：选线前挂起的路线事件必须随档恢复，否则刷新一次就永久丢掉整段线内剧情
    out.pendingRouteEvents = Array.isArray(source.pendingRouteEvents)
      ? source.pendingRouteEvents.slice(0, 50).map(item => {
          const row = object(item);
          const id = safeEventId(row.id);
          if(!id) return null;
          const trg = (this.story.events[id] || (this.story.criticalEvents && this.story.criticalEvents[id]) || {}).trigger;
          if(!trg || !trg.route) return null;
          return {id, day:asInt(row.day, trg.day, 1, 999), hour:asInt(row.hour, trg.hour, 0, 23)};
        }).filter(Boolean)
      : [];
    out.currentLocation = this.story.locations?.[source.currentLocation] ? source.currentLocation : def.currentLocation;
    out.coins = asInt(source.coins, def.coins, 0, 1000000);
    out.lastTarotDay = asInt(source.lastTarotDay, 0, 0, 9999);
    out.lastTaskDay = asInt(source.lastTaskDay, 0, 0, 9999);
    out.taskStreak = asInt(source.taskStreak, 0, 0, 9999);
    out.lastNightmareDay = asInt(source.lastNightmareDay, 0, 0, 9999);
    out.watchMode = asBool(source.watchMode);
    out.watchStrategy = this.story.watchMode?.strategies?.[source.watchStrategy] ? source.watchStrategy : def.watchStrategy;
    out.showOptionHints = asBool(source.showOptionHints);
    out.playerQuizDone = asBool(source.playerQuizDone);
    out.mood = this.story.moods?.[source.mood] ? source.mood : def.mood;
    out.flags = record(source.flags, 500, value => typeof value === 'string' ? value.slice(0, 100) : (Number.isFinite(value) ? Math.max(-999999, Math.min(999999, value)) : asBool(value)));
    out.firedEvents = record(source.firedEvents, 500, (_value, key) => eventIds.has(key));
    Object.keys(out.firedEvents).forEach(key=>{ if(!out.firedEvents[key]) delete out.firedEvents[key]; });
    const chars = Object.keys(def.conversations);
    chars.forEach(cid=>{
      const conv = object(object(source.conversations)[cid]);
      out.conversations[cid] = {
        ...def.conversations[cid],
        messages: array(conv.messages, 500, message=>{
          const m = object(message);
          const from = ['me','shenyan','luci','jiangyu','susu','narrator'].includes(m.from) ? m.from : cid;
          return {id:/^[a-zA-Z0-9_:-]{1,120}$/.test(m.id || '') ? m.id : null, from, text:asText(m.text, 1000), time:asText(m.time, 8), day:asInt(m.day, 0, 0, 9999), ts:asInt(m.ts, 0, 0, 9999999999999), replied:asBool(m.replied), isFollowup:asBool(m.isFollowup), isGiftReaction:asBool(m.isGiftReaction)};
        }),
        unread:asInt(conv.unread, 0, 0, 500),
        typing:false,
        finished:asBool(conv.finished),
        pendingChoice:sanitizeChoice(conv.pendingChoice)
      };
    });
    out.affection = {...def.affection};
    Object.keys(out.affection).forEach(cid=> out.affection[cid] = asInt(object(source.affection)[cid], 0, 0, 999));   // v0.8.6
    out.personality = {...def.personality};
    Object.keys(out.personality).forEach(key=> out.personality[key] = asInt(object(source.personality)[key], 0, 0, 9999));
    out.affectionDetail = {...def.affectionDetail};
    Object.keys(out.affectionDetail).forEach(cid=>{
      const saved = object(object(source.affectionDetail)[cid]);
      out.affectionDetail[cid] = {closeness:asInt(saved.closeness, 0, 0, 999), trust:asInt(saved.trust, 0, 0, 999), tension:asInt(saved.tension, 0, 0, 999)};
    });
    out.photos = array(source.photos, 200, item=>{
      const id = typeof object(item).id === 'string' ? object(item).id : '';
      return this.story.photos?.[id] ? {id, ...this.story.photos[id], unlocked:true} : null;
    });
    out.music = {unlocked:idList(object(source.music).unlocked, knownIds(this.story.music)), playing:null};
    out.music.playing = out.music.unlocked.includes(object(source.music).playing) ? object(source.music).playing : null;
    out.notes = array(source.notes, 200, item=>{ const n=object(item); return {title:asText(n.title,120), preview:asText(n.preview,1000), time:asText(n.time,40)}; });
    out.calendar = array(source.calendar, 200, item=>{ const e=object(item); return {title:asText(e.title,120), time:asText(e.time,40), desc:asText(e.desc,1000)}; });
    out.callLog = array(source.callLog, 300, item=>{ const c=object(item); const from=chars.includes(c.from)?c.from:'susu'; return {from,type:['incoming','missed','declined','outgoing'].includes(c.type)?c.type:'incoming',duration:asText(c.duration,20),name:asText(c.name,40),time:asText(c.time,8),day:asInt(c.day,0,0,9999)}; });
    // v0.7.3：durationSec 由文本重算而非存档字段——老存档无需迁移即可得到时长
    out.voicemails = array(source.voicemails, 100, item=>{ const vm=object(item); const from=chars.includes(vm.from)?vm.from:'susu'; const vmText=asText(vm.text,1000); return {id:asText(vm.id,100),from,text:vmText,eventId:asText(vm.eventId,100),callbackEvent:eventIds.has(vm.callbackEvent)?vm.callbackEvent:null,time:asText(vm.time,8),day:asInt(vm.day,0,0,9999),heard:asBool(vm.heard),durationSec:this.voicemailMeta(vmText).durationSec}; });
    out.moments = array(source.moments, 250, item=>{
      const m=object(item); const author=['me',...chars].includes(m.author)?m.author:'me';
      const id = /^[a-zA-Z0-9_:-]{1,100}$/.test(m.id || '') ? m.id : null;
      if(!id) return null;
      const template = this.story.moments?.[id];
      const commentsConfig = this.story.momentComments?.byCategory?.[m.art] || this.story.momentComments?.byCategory?.[''] || {};
      const charComments = array(m.charComments, 20, cc=>{
        const item = object(cc);
        const charId = chars.includes(item.charId) ? item.charId : null;
        const commentIdx = asInt(item.commentIdx, -1, 0, 99);
        const comment = charId && commentsConfig[charId]?.[commentIdx];
        return comment ? {charId, commentIdx, comment} : null;
      });
      return {
        id, author, name:asText(m.name,40), avatar:asText(m.avatar,8), bg:color(m.bg),
        text:asText(m.text,280), art:asText(m.art,30)||null, time:asText(m.time,8), day:asInt(m.day,0,0,9999), dateLabel:asText(m.dateLabel,40),
        likes:idList(m.likes,new Set(['me',...chars]),20),
        comments:array(m.comments,100,c=>{ const x=object(c); return {from:['me',...chars].includes(x.from)?x.from:'me', text:asText(x.text,1000), isReply:asBool(x.isReply)}; }),
        replyOnLike:template?.replyOnLike || null,
        commentOptions:template?.commentOptions || null,
        replyOnComment:template?.replyOnComment || null,
        charComments,
        isMine:asBool(m.isMine)
      };
    });
    out.momentInteractions = record(source.momentInteractions, 250, item=>{const i=object(item);return {liked:asBool(i.liked),commented:asBool(i.commented),commentIdx:asInt(i.commentIdx,0,0,99)};});
    out.momentReplies = record(source.momentReplies, 250, item=>{const i=object(item);return {commentIdx:asInt(i.commentIdx,0,0,99),replyIdx:asInt(i.replyIdx,0,0,99)};});
    out.dreamShards = array(source.dreamShards,100,item=>{const d=object(item);return {dreamId:asText(d.dreamId,100),title:asText(d.title,120),choice:asText(d.choice,1000),shard:asText(d.shard,120)||null,meaning:asText(d.meaning,1000)||null};});
    out.resolvedDreams = record(source.resolvedDreams, 100, value=>asBool(value));
    out.activeDream = this.story.dreams?.[source.activeDream] && !out.resolvedDreams[source.activeDream] ? source.activeDream : null;
    out.memoryShards = array(source.memoryShards,100,item=>{const m=object(item);return {memId:asText(m.memId,100),title:asText(m.title,120),choice:asText(m.choice,1000),shard:asText(m.shard,120)||null,meaning:asText(m.meaning,1000)||null};});
    out.resolvedMemories = record(source.resolvedMemories,100,value=>asBool(value));
    out.flashbackShards = array(source.flashbackShards,100,item=>{const f=object(item);return {fbId:asText(f.fbId,100),shard:asText(f.shard,120),meaning:asText(f.meaning,1000)||null};});
    out.flashbacksSeen = record(source.flashbacksSeen,100,value=>asBool(value));
    out.firedIntel = record(source.firedIntel,100,value=>asBool(value));
    out.visitedEncounters = record(source.visitedEncounters,200,value=>asBool(value));
    out.locationVisits = array(source.locationVisits,200,item=>{const v=object(item);return this.story.locations?.[v.locId] ? {locId:v.locId,day:asInt(v.day,0,0,9999),ts:asInt(v.ts,0,0,9999999999999)} : null;});
    out.inventory = array(source.inventory,100,item=>{const i=object(item);return this.story.shop?.items?.[i.id] ? {id:i.id,ts:asInt(i.ts,0,0,9999999999999)} : null;});
    out.gifts = array(source.gifts,200,item=>{const g=object(item);return {to:chars.includes(g.to)?g.to:'susu',itemId:this.story.shop?.items?.[g.itemId]?g.itemId:null,mult:Number.isFinite(g.mult)?g.mult:1,gain:asInt(g.gain,0,0,9999),ts:asInt(g.ts,0,0,9999999999999),day:asInt(g.day,0,0,9999)};}).filter(g=>g.itemId);
    out.moodHistory = array(source.moodHistory,200,item=>{const m=object(item);return this.story.moods?.[m.mood] ? {mood:m.mood,day:asInt(m.day,0,0,9999),ts:asInt(m.ts,0,0,9999999999999)} : null;});
    out.diary = array(source.diary,200,item=>{const d=object(item);return {text:asText(d.text,500),mood:this.story.moods?.[d.mood]?d.mood:def.mood,day:asInt(d.day,0,0,9999),time:asText(d.time,8),ts:asInt(d.ts,0,0,9999999999999)};});
    out.tarotHistory = array(source.tarotHistory,200,item=>{const t=object(item);return this.story.tarot?.cards?.[t.cardId] ? {day:asInt(t.day,0,0,9999),cardId:t.cardId,reversed:asBool(t.reversed),ts:asInt(t.ts,0,0,9999999999999)} : null;});
    const fortune=object(source.todayFortune); out.todayFortune=this.story.tarot?.cards?.[fortune.cardId] ? {cardId:fortune.cardId,name:asText(fortune.name,40),roman:asText(fortune.roman,10),reversed:asBool(fortune.reversed),text:asText(fortune.text,1000),hint:(()=>{const h=object(fortune.hint); return {type:['encounter','affection','gift','music','photo','weather'].includes(h.type)?h.type:'',value:asInt(h.value,0,0,99)};})(),day:asInt(fortune.day,0,0,9999)} : null;
    out.achievements = record(source.achievements,100,(_value,key)=>!!this.story.achievements?.[key]);
    Object.keys(out.achievements).forEach(key=>{ if(!out.achievements[key]) delete out.achievements[key]; });
    out.collected = idList(source.collected, knownIds(this.story.collectibles));
    out.easterEggsSeen = record(source.easterEggsSeen,100,(_value,key)=>!!this.story.easterEggs?.[key]);
    out.puzzleProgress = record(source.puzzleProgress,100,(item,key)=>{const p=object(item);return this.story.puzzles?.[key] ? {attemptCount:asInt(p.attemptCount,0,0,9999),solved:asBool(p.solved),lastAttempt:asText(p.lastAttempt,200),lastAttemptDay:asInt(p.lastAttemptDay,0,0,9999)} : null;});
    Object.keys(out.puzzleProgress).forEach(key=>{if(!out.puzzleProgress[key]) delete out.puzzleProgress[key];});
    out.discoveredClues = record(source.discoveredClues,200,value=>asBool(value));
    out.perspectivesSeen = record(source.perspectivesSeen,20,value=>record(value,100,seen=>asBool(seen)));
    out.truthEndingsSeen = record(source.truthEndingsSeen,20,value=>asBool(value));
    const player=object(source.player);
    const quizIds = new Set((this.story.playerCustomization?.personalityQuiz||[]).map(q=>q.id));
    const answers = record(player.answers,20,(value,key)=>quizIds.has(key) ? asInt(value,0,0,9) : null);
    Object.keys(answers).forEach(key=>{ if(answers[key] === null) delete answers[key]; });
    out.player=player.name || player.nickname ? {name:asText(player.name,6)||'林夏',nickname:asText(player.nickname,6)||'夏夏',avatar:asText(player.avatar,4)||'林',bg:color(player.bg),age:asInt(player.age,24,18,40),pronoun:['她','他','TA'].includes(player.pronoun)?player.pronoun:'她',answers} : null;
    const taskMap = new Map((this.story.dailyTasks?.pool||[]).map(t=>[t.id,t]));
    out.dailyTasks = array(source.dailyTasks,3,item=>{const t=object(item), defTask=taskMap.get(t.id);return defTask ? {id:defTask.id,name:defTask.name,desc:defTask.desc,reward:defTask.reward,completed:asBool(t.completed),day:asInt(t.day,out.lastTaskDay,0,9999),check:defTask.check} : null;});
    out.taskStreakClaimed = record(source.taskStreakClaimed,20,value=>asBool(value));
    out.relationshipStages = record(source.relationshipStages,20,value=>asInt(value,1,1,99));
    out.invitations = array(source.invitations,100,item=>{const i=object(item);return this.story.invitations?.[i.id] ? {id:i.id,status:['pending','accepted','declined','missed'].includes(i.status)?i.status:'pending',ts:asInt(i.ts,0,0,9999999999999)} : null;});
    out.firedInvitations = record(source.firedInvitations,100,value=>asBool(value));
    out.resolvedInvitations = record(source.resolvedInvitations,100,value=>['accepted','declined','missed'].includes(value)?value:'missed');
    out.groups = record(source.groups,20,(item,key)=>{const g=object(item); if(!this.story.groups?.[key]) return null; return {id:key,name:asText(g.name,80),members:idList(g.members,new Set(chars),10),messages:array(g.messages,300,m=>{const x=object(m);return {from:['me',...chars].includes(x.from)?x.from:'me',text:asText(x.text,1000),time:asText(x.time,8),ts:asInt(x.ts,0,0,9999999999999)};}),unread:asInt(g.unread,0,0,300),typing:false,pendingChoice:sanitizeChoice(g.pendingChoice)};});
    Object.keys(out.groups).forEach(key=>{if(!out.groups[key]) delete out.groups[key];});
    out.currentTheme = this.story.themes?.[source.currentTheme] ? source.currentTheme : 'default';
    out.currentIconTheme = this.story.iconThemes?.[source.currentIconTheme] ? source.currentIconTheme : 'default';
    out.unlockedThemes = record(source.unlockedThemes,50,(_value,key)=>!!this.story.themes?.[key]); out.unlockedThemes.default=true;
    out.unlockedIconThemes = record(source.unlockedIconThemes,50,(_value,key)=>!!this.story.iconThemes?.[key]); out.unlockedIconThemes.default=true;
    out.endingSeen = record(source.endingSeen,50,(_value,key)=>!!this.story.endings?.[key]);
    // v0.5.0（E3 周目）：ngCarry 携带快照与 ngPlus 计数入白名单（读档后二周目仍可用）
    out.ngPlus = asInt(source.ngPlus, 0, 0, 99);
    const ngc = object(source.ngCarry);
    if(ngc && (source.ngCarry !== undefined)){
      out.ngCarry = {
        collected: idList(ngc.collected, knownIds(this.story.collectibles), 200),
        achievements: record(ngc.achievements, 100, (_v, key) => !!this.story.achievements?.[key]),
        endingSeen: record(ngc.endingSeen, 50, v => !!v),
        endingGallery: record(ngc.endingGallery, 50, (_v, key) => !!this.story.endings?.[key]),
        easterEggsSeen: record(ngc.easterEggsSeen, 100, v => !!v),
        tarotHistory: array(ngc.tarotHistory, 200, t => {const o=object(t); return this.story.tarot?.cards?.[o.cardId] ? {day:asInt(o.day,0,0,9999), cardId:o.cardId, reversed:asBool(o.reversed), ts:asInt(o.ts,0,0,9999999999999)} : null;}),
        unlockedThemes: record(ngc.unlockedThemes, 50, v => !!v),
        unlockedIconThemes: record(ngc.unlockedIconThemes, 50, v => !!v),
        ngPlus: asInt(ngc.ngPlus, 0, 0, 99),
      };
      Object.keys(out.ngCarry.achievements).forEach(k => { if(!out.ngCarry.achievements[k]) delete out.ngCarry.achievements[k]; });
      Object.keys(out.ngCarry.endingGallery).forEach(k => { if(!out.ngCarry.endingGallery[k]) delete out.ngCarry.endingGallery[k]; });
    }
    out.endingGallerySeen = record(source.endingGallerySeen,50,(_value,key)=>!!this.story.endingGallery?.[key]);
    Object.keys(out.endingSeen).forEach(key=>{ if(!out.endingSeen[key]) delete out.endingSeen[key]; });
    Object.keys(out.endingGallerySeen).forEach(key=>{ if(!out.endingGallerySeen[key]) delete out.endingGallerySeen[key]; });
    out.dateLastDone = record(source.dateLastDone,20,value=>asInt(value,0,0,9999));
    out.dateHistory = array(source.dateHistory,100,item=>{const d=object(item);return {charId:chars.includes(d.charId)?d.charId:'susu',sceneId:eventIds.has(d.sceneId)?d.sceneId:'',day:asInt(d.day,0,0,9999),ts:asInt(d.ts,0,0,9999999999999)};}).filter(d=>d.sceneId);
    out.nightmaresSeen = record(source.nightmaresSeen,20,(_value,key)=>!!this.story.nightmares?.[key]);
    out.activeNightmare = this.story.nightmares?.[source.activeNightmare] && !out.nightmaresSeen[source.activeNightmare] ? source.activeNightmare : null;
    out.pendingMessages = array(source.pendingMessages, 300, item=>{
      const p = object(item);
      const from = ['narrator', ...chars].includes(p.from) ? p.from : null;
      const groupId = typeof p.groupId === 'string' && this.story.groups?.[p.groupId] ? p.groupId : null;
      const thenEvent = safeEventId(p.thenEvent);
      if((!from && !groupId) || !p.id || typeof p.id !== 'string') return null;
      return {id:asText(p.id,120), from:from || (chars.includes(p.from) ? p.from : 'susu'), groupId, text:asText(p.text,1000), choice:sanitizeChoice(p.choice), thenEvent,
        followup:object(p.followup).text ? {text:asText(p.followup.text,1000), delay:asInt(p.followup.delay,30,1,86400), affection:sanitizeEffects({affection:p.followup.affection}).affection || {}} : null,
        dueAt:asInt(p.dueAt, Date.now(), 0, 9999999999999)};
    });
    out.pendingEventDispatches = array(source.pendingEventDispatches, 300, item=>{
      const p = object(item); const eventId = safeEventId(p.eventId);
      return eventId && p.id ? {id:asText(p.id,120), eventId, dueAt:asInt(p.dueAt, Date.now(), 0, 9999999999999)} : null;
    });
    out.pendingCalls = array(source.pendingCalls, 100, item=>{
      const p = object(item); const eventId = safeEventId(p.eventId);
      return eventId && p.id ? {id:asText(p.id,120), eventId, dueAt:asInt(p.dueAt, Date.now(), 0, 9999999999999)} : null;
    });
    out.pendingFollowups = array(source.pendingFollowups, 300, item=>{
      const p = object(item);
      const convId = chars.includes(p.convId) ? p.convId : null;
      const text = asText(p.text,1000);
      if(!convId || !text || !p.id || !/^[a-zA-Z0-9_:-]{1,120}$/.test(p.messageId || '')) return null;
      return {id:asText(p.id,120), convId, messageId:p.messageId, text,
        affection:sanitizeEffects({affection:p.affection}).affection || {},
        dueAt:asInt(p.dueAt, Date.now(), 0, 9999999999999)};
    });
    out.pendingTimeAdvances = array(source.pendingTimeAdvances, 100, item=>{
      const p = object(item); const eventId = safeEventId(p.eventId);
      const evt = eventId && this.story.events?.[eventId];
      return evt && ['advance_time','advance_day'].includes(evt.type) && p.id
        ? {id:asText(p.id,120), eventId, dueAt:asInt(p.dueAt, Date.now(), 0, 9999999999999)}
        : null;
    });
    const pendingRaw = Array.isArray(source.pendingInteractions)
      ? source.pendingInteractions
      : (source.pendingInteraction ? [source.pendingInteraction] : []);
    out.pendingInteractions = pendingRaw.slice(0, 50).map(sanitizePendingInteraction).filter(Boolean);
    InteractionQueue.syncLegacy(out);
    return out;
  },

  _resumePendingWork(){
    this.state.pendingMessages.forEach(item=>this._schedulePendingMessage(item));
    this.state.pendingEventDispatches.forEach(item=>this._schedulePendingEventDispatch(item));
    this.state.pendingCalls.forEach(item=>this._schedulePendingCall(item));
    this.state.pendingFollowups.forEach(item=>this._schedulePendingFollowup(item));
    this.state.pendingTimeAdvances.forEach(item=>this._schedulePendingTimeAdvance(item));
    const calls = this.getPendingInteractions().filter(item=>item.type === 'call');
    this._pendingCallEventId = calls[0]?.eventId || null;
    calls.forEach(interaction=> this._scheduleActiveCall(interaction.eventId, interaction.dueAt));
  },

  _applySaveData(data){
    if(!data || !data.state) return false;
    this._clearAllTimers();
    this._pendingDate = null; // load 后清空进行中约会，避免卡死本周约会名额
    this._disableAutoSave = true;
    try {
      const migrated = SaveMigrations.migrate(data);
      this.state = this._sanitizeLoadedState(migrated.state);
      this._updateWeather();  // v0.1.7: 读档后按当前天数重算天气（旧存档补上该 flag）
      this._rehydrateDailyTaskChecks();
      this._resumePendingWork();
      this.emit('stateChange', this.state);
      this.emit('timeChange', this.getTime());
      this.emit('gameLoaded', {slot: data.slot || null, label: data.label || ''});
      this.emit('ambienceChange', this.getCurrentAmbience());
      return true;
    } catch(e) {
      console.error('[load failed]', e);
      this.emit('loadFailed', {error:e.message});
      return false;
    } finally {
      this._disableAutoSave = false;
    }
  },

  save(slot='auto', opts={}){
    const note = opts.note || '';
    const silent = !!opts.silent;
    try {
      if(!this._isSaveSlot(slot)) throw new Error('无效存档槽位');
      const data = this._buildSaveData(slot, note);
      const saves = this.getAllSaves();
      saves[slot] = data;
      if(!this._writeAllSaves(saves)) throw new Error('浏览器存储不可用');
      this._lastAutoSaveAt = Date.now();
      if(!silent) this.emit('gameSaved', {slot, data});
      return true;
    } catch(e){
      console.error('[save failed]', e);
      this.emit('saveFailed', {slot, error: e.message});
      return false;
    }
  },

  autoSave(force=false){
    if(this._disableAutoSave) return false;
    const now = Date.now();
    if(!force && this._lastAutoSaveAt && (now - this._lastAutoSaveAt) < PhoneEngine.AUTO_SAVE_MIN_INTERVAL_MS){
      return false;
    }
    return this.save(PhoneEngine.SLOT_AUTO, {silent: true, note: '自动存档'});
  },

  startAutoSave(){
    if(this._autoSaveStarted) return;
    this._autoSaveStarted = true;
    this._lastAutoSaveAt = 0;
    this._autoSaveStateListener = ()=>{
      try { this.autoSave(false); } catch(_) {}
    };
    this.on('stateChange', this._autoSaveStateListener);
    if(typeof setInterval !== 'undefined'){
      this._autoSaveInterval = setInterval(()=>{
        try { this.autoSave(true); } catch(_) {}
      }, PhoneEngine.AUTO_SAVE_PERIODIC_MS);
    }
  },

  stopAutoSave(){
    if(this._autoSaveInterval){
      clearInterval(this._autoSaveInterval);
      this._autoSaveInterval = null;
    }
    if(this._autoSaveStateListener){
      this.off('stateChange', this._autoSaveStateListener);
      this._autoSaveStateListener = null;
    }
    this._autoSaveStarted = false;
  },

  load(slot){
    if(!this._isSaveSlot(slot)) return false;
    const saves = this.getAllSaves();
    const data = saves[slot];
    if(!data) return false;
    return this._applySaveData(data);
  },

  hasSave(slot){
    const saves = this.getAllSaves();
    return !!(saves && saves[slot] && saves[slot].state);
  },

  hasAnySave(){
    const saves = this.getAllSaves();
    return Object.keys(saves).some(k => saves[k] && saves[k].state);
  },

  getLatestSave(){
    const saves = this.getAllSaves();
    let best = null;
    for(const slot in saves){
      const s = saves[slot];
      if(!s || !s.state) continue;
      const newer = !best || String(s.time||'') > String(best.time||'');
      // 同一毫秒内手动存档可能与自动档时间戳相同，手动档应优先，避免继续游戏回退。
      const sameTimeManual = best && String(s.time||'') === String(best.time||'')
        && s.slot !== PhoneEngine.SLOT_AUTO && best.slot === PhoneEngine.SLOT_AUTO;
      if(newer || sameTimeManual){
        best = {...s, slot};
      }
    }
    return best;
  },

  continueGame(){
    const latest = this.getLatestSave();
    if(latest && latest.slot) return this.load(latest.slot);
    return false;
  },

  listSaveSlots(){
    const saves = this.getAllSaves();
    const order = [PhoneEngine.SLOT_AUTO, ...PhoneEngine.SLOT_MANUAL];
    return order.map(slot => {
      const data = saves[slot] || null;
      return {
        slot,
        empty: !data || !data.state,
        isAuto: slot === PhoneEngine.SLOT_AUTO,
        label: data?.label || '空槽位',
        time: data?.time || null,
        note: data?.note || '',
        summary: data?.summary || null,
        v: data?.v || null
      };
    });
  },

  exportSave(slot){
    const saves = this.getAllSaves();
    const data = saves[slot];
    if(!data) return null;
    return JSON.stringify({
      app: 'neon-heart',
      exportVersion: 1,
      exportedAt: new Date().toISOString(),
      slot,
      save: data
    }, null, 2);
  },

  importSave(jsonText, targetSlot){
    try {
      if(typeof jsonText === 'string' && jsonText.length > PhoneEngine.MAX_SAVE_BYTES) return {ok:false, reason:'存档文件过大'};
      if(typeof jsonText !== 'string'){
        let size = 0;
        try { size = JSON.stringify(jsonText ?? null).length; } catch (_) { return {ok:false, reason:'无效存档'}; }
        if(!jsonText || typeof jsonText !== 'object' || size > PhoneEngine.MAX_SAVE_BYTES) return {ok:false, reason:'无效存档'};
      }
      const parsed = typeof jsonText === 'string' ? JSON.parse(jsonText) : jsonText;
      const data = parsed.save || parsed;
      const slot = targetSlot || data?.slot || PhoneEngine.SLOT_AUTO;
      if(!this._isSaveSlot(slot)) return {ok:false, reason:'无效存档槽位'};
      const wrapped = this._normalizeSaveData({...data, slot, note:data?.note || '导入存档'}, slot);
      if(!wrapped) return {ok:false, reason:'无效存档文件'};
      const saves = this.getAllSaves();
      saves[slot] = wrapped;
      if(!this._writeAllSaves(saves)) return {ok:false, reason:'浏览器存储不可用'};
      this.emit('gameImported', {slot, data: wrapped});
      return {ok:true, slot};
    } catch(e){
      return {ok:false, reason: e.message || '解析失败'};
    }
  },

  _rehydrateDailyTaskChecks(){
    const pool = (this.story.dailyTasks && this.story.dailyTasks.pool) || [];
    const poolMap = {};
    pool.forEach(t => { poolMap[t.id] = t; });
    if(!Array.isArray(this.state.dailyTasks)) this.state.dailyTasks = [];
    this.state.dailyTasks = this.state.dailyTasks.filter(t => t && poolMap[t.id]).slice(0, 3);
    this.state.dailyTasks.forEach(t => {
      const src = poolMap[t.id];
      if(src){
        t.name = src.name; t.desc = src.desc; t.reward = src.reward;
        t.day = Number.isFinite(t.day) ? t.day : this.state.lastTaskDay;
        t.check = src.check;
      }
    });
  },

  deleteSave(slot){
    if(!this._isSaveSlot(slot)) return false;
    const saves = this.getAllSaves();
    delete saves[slot];
    if(!this._writeAllSaves(saves)){
      this.emit('saveFailed', {slot, error:'浏览器存储不可用'});
      return false;
    }
    this.emit('gameDeleted', {slot});
    return true;
  },

  getAllSaves(){
    // v0.1.7: 命中内存缓存直接返回（UI 高频调用，避免每次重读 localStorage + 全量规范化）。
    // 缓存在写档时更新，其他标签页改动时由 storage 监听失效。
    if(this._savesCache) return {...this._savesCache};
    // 优先 localStorage，失败时回退内存（测试环境 / 隐私模式也能记住进度）
    try{
      if(typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function'){
        const raw = localStorage.getItem(PhoneEngine.SAVE_KEY);
        if(raw){
          const parsed = JSON.parse(raw || '{}') || {};
          const normalized = {};
          for(const slot of [PhoneEngine.SLOT_AUTO, ...PhoneEngine.SLOT_MANUAL]){
            const save = this._normalizeSaveData(parsed[slot], slot);
            if(save) normalized[slot] = save;
          }
          this._memorySaves = normalized;
          this._savesCache = normalized;
          return {...normalized};
        }
      }
    } catch(e){}
    const normalized = {};
    for(const slot of [PhoneEngine.SLOT_AUTO, ...PhoneEngine.SLOT_MANUAL]){
      const save = this._normalizeSaveData(this._memorySaves?.[slot], slot);
      if(save) normalized[slot] = save;
    }
    this._memorySaves = normalized;
    this._savesCache = normalized;
    return {...normalized};
  },

  _writeAllSaves(saves){
    const payload = {};
    for(const slot of [PhoneEngine.SLOT_AUTO, ...PhoneEngine.SLOT_MANUAL]){
      const save = this._normalizeSaveData(saves?.[slot], slot);
      if(save) payload[slot] = save;
    }
    try{
      const serialized = JSON.stringify(payload);
      if(serialized.length > PhoneEngine.MAX_SAVE_BYTES) throw new Error('存档数据过大');
      if(typeof localStorage !== 'undefined' && localStorage && typeof localStorage.setItem === 'function'){
        localStorage.setItem(PhoneEngine.SAVE_KEY, serialized);
      }
      this._memorySaves = {...payload};
      this._savesCache = {...payload};  // v0.1.7: 写档后同步缓存
      return true;
    } catch(e){
      console.error('[save failed]', e && e.message ? e.message : e);
      this._savesCache = null;  // 写档失败时缓存作废，下次重读
      return false;
    }
  },
});


/* ===== audio.js ===== */
/* ===== 霓虹心事 · WebAudio 音效系统 =====
 * 零依赖纯合成：消息提示、来电铃声、点击、收集/成就、分层环境音（BGM）。
 * v0.2.4: 环境音分层——主题琶音层 + 时段底噪层（雨声/夜晚底噪）+ 心绪不安的心跳脉冲。
 * 浏览器自动播放策略：首次用户手势（pointerdown）时解锁 AudioContext。
 * 开关持久化：localStorage 'neon_sound'（音效，默认开）/ 'neon_bgm'（环境音，默认关）。
 */
const AudioSys = (() => {
  let ctx = null;
  let unlocked = false;
  let musicTimer = null;
  let step = 0;
  let currentTheme = 'default';
  let currentAmbId = 'day';   // 当前氛围 id（day/dusk/night/rainy/anxious/lucky/unlucky/dawn）
  let ambience = null;        // 当前底噪档：'rain' | 'night' | null
  let ambNodes = null;        // 底噪节点组 {src, gain, lfo}
  let _noiseBuf = null;       // 复用噪声 buffer（粉噪倾向，比白噪柔和）

  const readPref = (key, fallback) => {
    try { return localStorage.getItem(key) === null ? fallback : localStorage.getItem(key) === '1'; }
    catch(_) { return fallback; }
  };
  let soundOn = readPref('neon_sound', true);
  let bgmOn = readPref('neon_bgm', false);

  // ===== v0.4.8: 音量总线（master/music/sfx 三级，设置中心滑杆驱动） =====
  let masterGain = null, musicBus = null, sfxBus = null;
  let vol = { master: 1, music: 0.8, sfx: 1 };
  try {
    const saved = JSON.parse(localStorage.getItem('neon_vol') || 'null');
    if(saved && ['master','music','sfx'].every(k => typeof saved[k] === 'number')) vol = saved;
  } catch(_) {}
  function ensureBus(c){
    if(masterGain) return;
    masterGain = c.createGain(); masterGain.connect(c.destination);
    musicBus = c.createGain(); musicBus.connect(masterGain);
    sfxBus = c.createGain(); sfxBus.connect(masterGain);
    applyVol();
  }
  function applyVol(){
    if(!masterGain) return;
    masterGain.gain.value = vol.master;
    musicBus.gain.value = vol.music;
    sfxBus.gain.value = vol.sfx;
  }

  function ensure(){
    if(!soundOn && !bgmOn) return null;
    if(!ctx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return null;
      try { ctx = new AC(); } catch(_) { return null; }
    }
    if(ctx.state === 'suspended') ctx.resume();
    ensureBus(ctx);
    return ctx;
  }

  // 单个音符：振荡器 + 音量包络（挂 sfx 总线）
  function tone({freq=880, dur=0.12, type='sine', gain=0.04, when=0, slideTo=0}){
    const c = ensure(); if(!c) return;
    const t0 = c.currentTime + when;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if(slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(sfxBus);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }

  const SFX = {
    msg()    { tone({freq:880, dur:0.09, gain:0.05}); tone({freq:1318, dur:0.12, when:0.07, gain:0.032}); },
    send()   { tone({freq:660, dur:0.08, gain:0.035, slideTo:880}); },
    tap()    { tone({freq:520, dur:0.045, type:'triangle', gain:0.024}); },
    ring()   { for(let i=0;i<2;i++){ tone({freq:988, dur:0.16, when:i*0.28, gain:0.055}); tone({freq:784, dur:0.16, when:i*0.28+0.13, gain:0.05}); } },
    achieve(){ [523,659,784,1047].forEach((f,i)=>tone({freq:f, dur:0.16, when:i*0.09, type:'triangle', gain:0.042})); },
    dream()  { [392,330,262].forEach((f,i)=>tone({freq:f, dur:0.5, when:i*0.28, gain:0.032})); },
    // v0.4.10（E2）：场景 sting——结局/梦魇/邀约/解谜各配 2-4 秒短乐句
    stingEnding(){ [392,494,587,784].forEach((f,i)=>toneTo(musicBus,{freq:f, dur:0.8, when:i*0.22, type:'triangle', gain:0.05})); },
    stingNightmare(){ [415,392,370,349].forEach((f,i)=>tone({freq:f, dur:0.55, when:i*0.3, type:'sawtooth', gain:0.028})); },
    stingInvite(){ tone({freq:784, dur:0.14, gain:0.04}); tone({freq:1047, dur:0.22, when:0.14, gain:0.038}); },
    stingPuzzle(){ [523,659,880,1047,1319].forEach((f,i)=>tone({freq:f, dur:0.18, when:i*0.08, type:'triangle', gain:0.045})); },
    // v0.7.3：语音信箱——按键起播与播完挂断（短促电子音，和线路噪声区分开）
    vmStart(){ tone({freq:660, dur:0.06, type:'triangle', gain:0.03}); },
    vmEnd(){ tone({freq:494, dur:0.11, gain:0.028, slideTo:392}); tone({freq:988, dur:0.05, when:0.03, gain:0.014}); }
  };

  // ===== v0.7.3：语音信箱底声——合成「电话那头有人在说话」的听感 =====
  // 约束：项目不引入任何音频素材，全部 WebAudio 实时合成。
  // 做法（共振峰近似）：锯齿波声源（基频随角色不同）→ 两路带通滤波（元音共振峰 F1/F2）
  //   → 音节包络 LFO（约 3.2Hz，模拟说话的一顿一顿）+ 一路低音量线路噪声。
  // 刻意不追求听清内容——只提供「有人在讲话、语调在起伏」的听觉暗示。
  let vmNodes = null;
  // 角色基频：男主偏低沉、苏苏偏高；未收录的角色走默认值
  const VM_PITCH = { shenyan: 116, luci: 124, jiangyu: 134, susu: 196, wugang: 128, nicheng: 122 };
  function startVoicemailBed(charId){
    stopVoicemailBed();          // 同一时刻只可能有一条在播
    if(!soundOn) return false;   // 音效总开关关闭时静默（UI 仍在走进度）
    const c = ensure();
    if(!c) return false;
    const now = c.currentTime;
    const base = VM_PITCH[charId] || 124;

    // 总线：120ms 淡入，避免按键瞬间爆音
    const bus = c.createGain();
    bus.gain.setValueAtTime(0.0001, now);
    bus.gain.exponentialRampToValueAtTime(1, now + 0.12);
    bus.connect(sfxBus);

    // 声源：锯齿 + 轻微失谐三角，两个副本叠加避免过于电子
    const oscA = c.createOscillator(); oscA.type = 'sawtooth'; oscA.frequency.value = base;
    const oscB = c.createOscillator(); oscB.type = 'triangle'; oscB.frequency.value = base * 1.006;
    const src = c.createGain(); src.gain.value = 0.6;
    oscA.connect(src); oscB.connect(src);

    // 共振峰：F1≈700Hz（元音主体）+ F2≈1300Hz（亮度），并联后合流
    const f1 = c.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 700; f1.Q.value = 4.5;
    const f2 = c.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 1300; f2.Q.value = 6;
    const voice = c.createGain(); voice.gain.value = 0.4;
    src.connect(f1).connect(voice);
    src.connect(f2).connect(voice);

    // 音节起伏 3.2Hz + 呼吸弛缓 0.7Hz，叠加在共振峰通道的增益上
    const syll = c.createOscillator(); syll.type = 'sine'; syll.frequency.value = 3.2;
    const syllGain = c.createGain(); syllGain.gain.value = 0.22;
    syll.connect(syllGain).connect(voice.gain);
    const breath = c.createOscillator(); breath.type = 'sine'; breath.frequency.value = 0.7;
    const breathGain = c.createGain(); breathGain.gain.value = 0.1;
    breath.connect(breathGain).connect(voice.gain);

    // 线路噪声：极低音量低通粉噪，给合成声一点"电话空间感"
    const noise = c.createBufferSource();
    noise.buffer = noiseBuffer(c); noise.loop = true;
    const nf = c.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 1100; nf.Q.value = 0.7;
    const ng = c.createGain(); ng.gain.value = 0.014;
    noise.connect(nf).connect(ng).connect(bus);

    voice.connect(bus);
    [oscA, oscB, syll, breath].forEach(n => n.start(now));
    noise.start(now);
    vmNodes = { bus, nodes: [oscA, oscB, syll, breath, noise] };
    return true;
  }
  function stopVoicemailBed(){
    if(!vmNodes) return;
    const group = vmNodes; vmNodes = null;
    try {
      const t = ctx ? ctx.currentTime : 0;
      if(ctx){
        group.bus.gain.cancelScheduledValues(t);
        group.bus.gain.setTargetAtTime(0.0001, t, 0.05);   // 50ms 指数淡出
      }
      group.nodes.forEach(n => { try { n.stop(t + 0.3); } catch(_) {} });
    } catch(_) {}
  }

  // ===== v0.2.4: 底噪层（本地合成，无外部素材） =====

  // 一阶低通噪声 buffer：白噪 + 单极低通，比纯白噪更"像空气"，作为雨声/夜晚底噪的原料
  function noiseBuffer(c){
    if(_noiseBuf) return _noiseBuf;
    const len = Math.floor(c.sampleRate * 2);
    _noiseBuf = c.createBuffer(1, len, c.sampleRate);
    const d = _noiseBuf.getChannelData(0);
    let last = 0;
    for(let i=0;i<len;i++){
      const white = Math.random() * 2 - 1;
      last = (last + 0.08 * white) / 1.08;
      d[i] = last * 3.2;
    }
    return _noiseBuf;
  }

  // 启动底噪层：rain=雨声（中频滤波 + 慢起伏 LFO）；night=夜晚底噪（低频滤波，极低音量）
  function startAmbience(kind){
    stopAmbience();
    if(!kind) return;
    const c = ensure(); if(!c) return;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c);
    src.loop = true;
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    const base = kind === 'rain' ? 0.014 : 0.005;
    filter.type = 'lowpass';
    filter.frequency.value = kind === 'rain' ? 1400 : 320;
    filter.Q.value = 0.8;
    gain.gain.setValueAtTime(base, c.currentTime);
    src.connect(filter).connect(gain).connect(musicBus);
    src.start();
    let lfo = null;
    if(kind === 'rain'){
      // 雨声起伏：0.13Hz 正弦调制音量 ±40%
      lfo = c.createOscillator();
      const lfoGain = c.createGain();
      lfo.frequency.value = 0.13;
      lfoGain.gain.value = base * 0.4;
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();
    }
    ambNodes = {src, gain, lfo};
    ambience = kind;
  }

  function stopAmbience(){
    if(!ambNodes) return;
    try {
      if(ambNodes.lfo) ambNodes.lfo.stop();
      ambNodes.src.stop();
      ambNodes.gain.disconnect();
    } catch(_) {}
    ambNodes = null;
    ambience = null;
  }

  // ===== v0.4.10（E2 音频二阶）：曲式引擎 =====
  // 每主题 = 4 和弦进行（triangle 垫音）+ 低音（根/五度交替）+ 琶音（半拍）+ 打击（hat/kick）
  // + 2 小节周期主旋律（五声音阶片段）。氛围分层：night 放慢、anxious 只留低音+心跳。
  const NOTE_RE = /^([A-G])(#|b)?(-?\d)$/;
  const SEMI = {C:0, D:2, E:4, F:5, G:7, A:9, B:11};
  function note(n){                       // 'A4' -> 440
    const m = NOTE_RE.exec(n); if(!m) return 440;
    let s = SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
    const oct = Number(m[3]);
    return 440 * Math.pow(2, (s - 9) / 12 + (oct - 4));
  }
  const THEME_PROG = {
    default: { chords:[['A3','C4','E4'],['F3','A3','C4'],['G3','B3','D4'],['A3','C4','E4']], bass:['A2','F2','G2','A2'], melody:['E5','C5','A4','B4','C5','B4','A4','E4'], hat:true },
    starry:  { chords:[['C4','E4','G4'],['A3','C4','E4'],['F3','A3','C4'],['G3','B3','D4']], bass:['C3','A2','F2','G2'], melody:['G4','E5','D5','C5','E5','G5','D5','C5'], hat:true },
    sea:     { chords:[['D4','F4','A4'],['B3','D4','F4'],['G3','B3','D4'],['A3','C4','E4']], bass:['D3','B2','G2','A2'], melody:['A4','D5','F5','E5','D5','A4','B4','D5'], hat:false },
    sunset:  { chords:[['C4','E4','G4'],['E4','G4','B4'],['F4','A4','C5'],['G4','B4','D5']], bass:['C3','E3','F3','G3'], melody:['E5','D5','C5','G4','A4','C5','D5','E5'], hat:false },
    ink:     { chords:[['A3','C4','E4'],['G3','B3','D4'],['F3','A3','C4'],['E3','G3','B3']], bass:['A2','G2','F2','E2'], melody:['A4','G4','E4','D4','C4','D4','E4','G4'], hat:false },
    rose:    { chords:[['D4','F4','A4'],['A3','C4','E4'],['B3','D4','F4'],['G3','B3','D4']], bass:['D3','A2','B2','G2'], melody:['F5','E5','D5','A4','B4','D5','F5','E5'], hat:true },
    dark:    { chords:[['E4','G4','B4'],['C4','E4','G4'],['A3','C4','E4'],['B3','D4','F4']], bass:['E3','C3','A2','B2'], melody:['B4','G4','E4','G4','B4','C5','B4','G4'], hat:true },
  };
  // 剧情曲（v0.4.10 E2：音乐 App 曲目真实可播）——《夏》写给妹妹的温柔曲，《渡鸦》解散前的暗色曲
  const TRACKS = {
    xia:  { bpm:0.44, chords:[['G3','B3','D4'],['E4','G4','B4'],['C4','E4','G4'],['D4','G4','B4']], bass:['G2','E3','C3','D3'],
            melody:['B4','D5','G5','D5','B4','G4','A4','B4','D5','G5','A5','G5','D5','B4','A4','G4'], lead:'sine', hat:false, shimmer:true },
    duya: { bpm:0.5, chords:[['A3','C4','E4'],['F3','A3','C4'],['D4','F4','A4'],['E4','G4','B4']], bass:['A2','F2','D3','E3'],
            melody:['A4','C5','E5','D5','C5','A4','E4','A4','F5','E5','D5','C5','B4','C5','D5','E5'], lead:'square', hat:true, kickEvery:2 },
    // v0.6.1（G2）：新曲×4——《雾》暗色徘徊 /《海》钢琴感慢板 /《灯》上行明亮 / B面收束平静
    wu:    { bpm:0.55, chords:[['A3','C4','E4'],['F3','A3','C4'],['A3','C4','E4'],['E3','G3','B3']], bass:['A2','F2','A2','E2'],
             melody:['A4','E4','C5','B4','A4','G4','A4','B4','C5','B4','A4','G4','E4','A4','B4','G4'], lead:'sine', hat:true, kickEvery:4 },
    hai:   { bpm:0.62, chords:[['C4','E4','G4'],['G3','B3','D4'],['A3','C4','E4'],['F3','A3','C4']], bass:['C3','G2','A2','F2'],
             melody:['E5','G5','C5','D5','E5','D5','C5','G4','A4','C5','D5','E5','G5','E5','D5','C5'], lead:'sine', hat:false, shimmer:true },
    deng:  { bpm:0.36, chords:[['G3','B3','D4'],['C4','E4','G4'],['G3','B3','D4'],['D4','F4','A4']], bass:['G2','C3','G2','D3'],
             melody:['D5','E5','G5','B4','D5','G4','B4','C5','D5','E5','D5','B4','G4','A4','B4','D5'], lead:'triangle', hat:false },
    bside: { bpm:0.44, chords:[['G3','B3','D4'],['E4','G4','B4'],['C4','E4','G4'],['G3','B3','D4']], bass:['G2','E3','C3','G2'],
             melody:['B4','D5','G5','D5','B4','A4','G4','A4','B4','C5','D5','B4','A4','G4','D4','G4'], lead:'sine', hat:false, shimmer:true },
  };
  let currentTrack = null;    // 正在播的剧情曲 id（null = 主题 BGM）
  let bar = 0;                // 小节计数

  // 调度一小节（4 拍）
  function scheduleBar(){
    const c = ctx; if(!c) return;
    const anxious = currentAmbId === 'anxious';
    const night = currentAmbId === 'night';
    let spec, melody, lead, hat, kickEvery = 0, baseGain = 0.016;
    if(currentTrack && TRACKS[currentTrack]){
      spec = TRACKS[currentTrack]; melody = spec.melody; lead = spec.lead; hat = spec.hat; kickEvery = spec.kickEvery || 0;
      baseGain = 0.03;   // 点播曲目音量略高
    } else {
      spec = THEME_PROG[currentTheme] || THEME_PROG.default;
      melody = spec.melody; hat = spec.hat;
    }
    let beat = (spec.bpm || 0.42);
    if(night) beat *= 1.25;
    if(anxious) beat *= 1.5;
    const chord = spec.chords[bar % spec.chords.length];
    const barAt = c.currentTime + 0.05;
    // 1) 和弦垫音：triangle 长音铺底
    chord.forEach((n, i) => toneTo(musicBus, {freq:note(n), dur:beat*4*0.95, type:'triangle', gain:baseGain*0.55, at:barAt}));
    // 2) 低音：根音/五度交替，每两拍
    for(let b = 0; b < 4; b += 2){
      const bn = spec.bass[bar % spec.bass.length];
      const f = note(bn) * (b === 2 ? 1.5 : 1);
      toneTo(musicBus, {freq:f, dur:beat*1.8, type:'sine', gain:baseGain*0.9, at:barAt + b*beat});
    }
    // 3) 琶音：每半拍和弦内音上行
    if(!anxious){
      for(let h = 0; h < 8; h++){
        const n = chord[h % chord.length];
        toneTo(musicBus, {freq:note(n)*2, dur:beat*0.5, type:'sine', gain:baseGain*0.3, at:barAt + h*beat/2});
      }
    }
    // 4) 打击：hat（短噪声脉冲）每拍；kick（低频正弦）指定拍
    for(let b = 0; b < 4; b++){
      if(hat) hatHit(barAt + b*beat, baseGain*0.35);
      if(kickEvery && (bar*4 + b) % kickEvery === 0) kick(barAt + b*beat, baseGain*1.6);
    }
    // 5) 主旋律：2 小节周期，anxious 时省略（只留低音+心跳）
    if(!anxious && melody.length){
      const ml = melody.length;
      for(let s2 = 0; s2 < 4; s2++){
        const idx = (bar*4 + s2) % ml;
        if(melody[idx]) toneTo(musicBus, {freq:note(melody[idx]), dur:beat*1.4, type:lead || 'sine', gain:baseGain*0.8, at:barAt + s2*beat});
      }
    }
    // 6) anxious 心跳（55Hz 低频脉冲，v0.2.4 保留）
    if(anxious) tone({freq:55, dur:0.5, gain:0.02});
    bar++;
    musicTimer = setTimeout(() => {
      if(!bgmOn && !currentTrack) { stopMusic(); return; }
      scheduleBar();
    }, beat*4*1000);
  }
  function hatHit(at, g){
    const c = ctx; if(!c) return;
    const src = c.createBufferSource(); src.buffer = noiseBuffer(c);
    const f = c.createBiquadFilter(); f.type='highpass'; f.frequency.value = 6000;
    const gn = c.createGain();
    gn.gain.setValueAtTime(g*0.6, at); gn.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    src.connect(f).connect(gn).connect(musicBus);
    src.start(at); src.stop(at + 0.06);
  }
  function kick(at, g){
    const c = ctx; if(!c) return;
    const o = c.createOscillator(), gn = c.createGain();
    o.frequency.setValueAtTime(120, at); o.frequency.exponentialRampToValueAtTime(45, at + 0.12);
    gn.gain.setValueAtTime(g, at); gn.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
    o.connect(gn).connect(musicBus);
    o.start(at); o.stop(at + 0.18);
  }
  // 带绝对时间与目标总线的音符（toneTo；tone 保持相对时间+sfx 总线）
  function toneTo(bus, {freq=880, dur=0.12, type='sine', gain=0.04, at=0, slideTo=0}){
    const c = ensure(); if(!c) return;
    const t0 = Math.max(at, c.currentTime);
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if(slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(bus);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  function stopMusic(){
    if(musicTimer){ clearTimeout(musicTimer); musicTimer = null; }
    step = 0; bar = 0;
    stopAmbience();
  }
  function startMusic(){
    stopMusic();
    if(!(bgmOn || currentTrack) || !unlocked) return;
    scheduleBar();
    startAmbience(ambience);
  }

  // 首次手势解锁（浏览器自动播放策略）
  if(typeof document !== 'undefined' && document.addEventListener){
    document.addEventListener('pointerdown', () => {
      if(unlocked) return;
      unlocked = true;
      if(bgmOn) startMusic();
    }, { once:true, capture:true });
  }

  return {
    play(name){ if(soundOn && unlocked && Object.prototype.hasOwnProperty.call(SFX, name)) SFX[name](); },
    // v0.7.3：语音信箱——按角色基频起播/停播合成底声。返回是否真的发声：
    // 音效关闭或未解锁时为 false，此时 UI 侧仍照常走进度条（视觉不受音频开关影响）。
    startVoicemail(charId){ return startVoicemailBed(charId); },
    stopVoicemail(){ stopVoicemailBed(); },
    // v0.4.10（E2）：音乐 App 点播——剧情曲真实可播；再次点同曲或传 null 回主题 BGM
    playTrack(trackId){
      if(trackId && Object.prototype.hasOwnProperty.call(TRACKS, trackId) && currentTrack === trackId) trackId = null;
      currentTrack = trackId || null;
      if(unlocked && (bgmOn || currentTrack)) startMusic();
      return currentTrack;
    },
    playingTrack(){ return currentTrack; },
    isEnabled(){ return soundOn; },
    // v0.4.8: 音量三分级（master/music/sfx，0-1），设置中心滑杆驱动
    setVolume(kind, v){
      if(!(kind in vol)) return;
      vol[kind] = Math.max(0, Math.min(1, Number(v) || 0));
      try { localStorage.setItem('neon_vol', JSON.stringify(vol)); } catch(_) {}
      applyVol();
    },
    getVolumes(){ return { ...vol }; },
    isBgmEnabled(){ return bgmOn; },
    setSound(on){
      soundOn = !!on;
      try { localStorage.setItem('neon_sound', soundOn ? '1' : '0'); } catch(_) {}
      if(!soundOn && !bgmOn) stopMusic();
    },
    setBgm(on){
      bgmOn = !!on;
      try { localStorage.setItem('neon_bgm', bgmOn ? '1' : '0'); } catch(_) {}
      if(bgmOn){ unlocked = true; startMusic(); } else stopMusic();
    },
    // 主题切换时切换环境音音组
    applyTheme(themeId){
      currentTheme = THEME_PROG[themeId] ? themeId : 'default';
      if(musicTimer) startMusic();  // 正在播则切换音组
    },
    // v0.2.4: 氛围切换时切换底噪档（rainy→雨声；night/dusk/anxious→夜晚底噪；其余无底噪）
    applyAmbience(ambId){
      currentAmbId = ambId || 'day';
      const kind = ambId === 'rainy' ? 'rain'
        : (ambId === 'night' || ambId === 'dusk' || ambId === 'anxious') ? 'night' : null;
      if(kind !== ambience){
        // 正在播放环境音则切换底噪；未播放只记档，开 BGM 时生效
        if(bgmOn && unlocked) startAmbience(kind);
        else ambience = kind;
      }
    },
  };
})();
if(typeof window !== 'undefined') window.AudioSys = AudioSys;


/* ===== debug.js ===== */
/* ===== 霓虹心事 · 调试日志系统（v0.6.4）=====
 * 目的：开发/测试期实时捕获异常与运行时健康问题，便于「全流程跑一遍就发现问题」。
 *
 * 启用方式（默认关闭、零开销）：
 *   - URL 加 ?debug=1          → 本次开启
 *   - localStorage.neon_debug=1 → 长期开启（?debug=0 关闭）
 *   - 控制台：NeonDebug.enable() / disable()
 *
 * 能力：
 *   1. 事件流捕获：引擎全部 emit 事件（时间/类型/关键字段），环形缓冲保留最近 500 条
 *   2. 异常捕获：window.onerror / unhandledrejection / console.error 转发
 *   3. 运行时健康检测（每 2s 体检）：
 *      - 定时器泄漏：_timers 持续增长不回落
 *      - 消息积压：pendingMessages 长时间不消化
 *      - 屏幕卡死：同一屏停留过久且无任何事件
 *      - 资源 404：PerformanceObserver + fetch 失败
 *      - i18n 回退：英文模式下出现未翻译的中文文本
 *      - 未读爆增：单次 >5 条（信息过载预警）
 *   4. 导出：NeonDebug.dump() 返回文本；NeonDebug.download() 下载 .log
 *   5. 控制台面板：右下角小徽标（异常计数），点开看最近日志
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;

  const params = new URLSearchParams(location.search);
  const __origConsoleError = console.error.bind(console);
  const __origConsoleWarn = console.warn.bind(console);
  const qs = params.get('debug');
  let enabled = false;
  try {
    if(qs === '0'){ localStorage.removeItem('neon_debug'); enabled = false; }
    else if(qs === '1'){ localStorage.setItem('neon_debug', '1'); enabled = true; }
    else enabled = localStorage.getItem('neon_debug') === '1';
  } catch(_) {}

  const MAX_ENTRIES = 500;
  const buffer = [];
  const issues = [];      // 仅异常/警告，便于快速定位
  let seq = 0;
  let engineRef = null;
  const t0 = Date.now();

  const ts = () => {
    const ms = Date.now() - t0;
    return '+' + String(ms).padStart(6, ' ') + 'ms';
  };

  function push(level, tag, msg, extra){
    if(!enabled) return;
    const entry = { seq: ++seq, at: ts(), level, tag, msg: String(msg), extra };
    buffer.push(entry);
    if(buffer.length > MAX_ENTRIES) buffer.shift();
    if(level !== 'info'){
      issues.push(entry);
      if(issues.length > 200) issues.shift();
      updateBadge();
      const fn = level === 'error' ? __origConsoleError : __origConsoleWarn;
      fn('[NeonDebug]', entry.at, tag, msg, extra === undefined ? '' : extra);
    } else if(enabled && params.get('verbose') === '1'){
      console.log('[NeonDebug]', entry.at, tag, msg, extra === undefined ? '' : extra);
    }
  }
  const info = (tag, msg, extra) => push('info', tag, msg, extra);
  const warn = (tag, msg, extra) => push('warn', tag, msg, extra);
  const error = (tag, msg, extra) => push('error', tag, msg, extra);

  // ---------- 全局异常 ----------
  window.addEventListener('error', e => {
    error('window.error', e.message + ' @ ' + (e.filename || '?') + ':' + (e.lineno || 0));
  });
  window.addEventListener('unhandledrejection', e => {
    const r = e.reason;
    error('unhandledrejection', r && r.message ? r.message : String(r));
  });
  const origConsoleError = console.error.bind(console);
  console.error = function(...args){
    error('console.error', args.map(a => a && a.message ? a.message : String(a)).join(' '));
    origConsoleError(...args);
  };

  // ---------- 资源加载失败 ----------
  if(typeof PerformanceObserver !== 'undefined'){
    try {
      new PerformanceObserver(list => {
        for(const e of list.getEntries()){
          if(e.responseStatus >= 400) error('resource', e.responseStatus + ' ' + e.name);
        }
      }).observe({ type: 'resource', buffered: true });
    } catch(_) {}
  }
  window.addEventListener('offline', () => warn('network', '浏览器离线'));
  window.addEventListener('online', () => info('network', '浏览器恢复在线'));

  // ---------- 引擎事件流 ----------
  // 引擎创建后调用 attach(engine) 挂上（ui/00_shell 里已调用）
  const WATCH_EVENTS = [
    'stateChange','timeChange','messageReceived','choicePrompt','conversationUpdate',
    'incomingCall','callAnswered','callDeclined','ending','routeChoiceReady',
    'dreamStart','dreamResolved','nightmareTriggered','encounterTriggered','encounterResolved',
    'groupCreated','groupMessageReceived','itemCollected','achievementsUnlocked',
    'puzzleSolved','puzzleFailed','photoUnlocked','musicUnlocked','momentPosted',
    'holidayTriggered','tarotDrawn','giftGiven','saveFailed','loadFailed','gameLoaded','gameSaved',
    'ambienceChange','invitationNew','flashbackTriggered'
  ];
  function attach(engine){
    engineRef = engine;
    for(const evt of WATCH_EVENTS){
      engine.on(evt, payload => {
        if(!enabled) return;
        let brief = '';
        try {
          if(evt === 'messageReceived') brief = (payload.from || '') + ': ' + String(payload.text || '').slice(0, 40);
          else if(evt === 'choicePrompt') brief = (payload.convId || '') + ' → ' + String(payload.choice?.prompt || '').slice(0, 40);
          else if(evt === 'ending') brief = payload.id || payload.title || '';
          else if(evt === 'incomingCall') brief = payload.from || '';
          else if(evt === 'itemCollected') brief = payload.item?.name || payload.itemId || '';
          else if(evt === 'timeChange') brief = (payload?.time || '') + ' day' + (engine.state.day);
          else if(evt === 'saveFailed' || evt === 'loadFailed') brief = payload?.error || '';
        } catch(_) {}
        push(evt === 'saveFailed' || evt === 'loadFailed' ? 'error' : 'info', 'engine', evt + (brief ? ' | ' + brief : ''));
      });
    }
    info('debug', '已挂接引擎事件监听（' + WATCH_EVENTS.length + ' 类）');
    startHealthChecks();
  }

  // ---------- 运行时健康体检 ----------
  let healthTimer = null;
  let lastTimers = 0, timerGrowthStreak = 0;
  let lastScreen = '';
  let lastEventAt = Date.now();
  let lastUnread = 0;
  let pendingStuckSince = 0;

  function startHealthChecks(){
    if(healthTimer) return;
    healthTimer = setInterval(() => {
      if(!enabled || !engineRef) return;
      const e = engineRef;
      try {
        // 1) 定时器泄漏
        const timers = e._timers ? e._timers.size : 0;
        if(timers > lastTimers) timerGrowthStreak++; else timerGrowthStreak = 0;
        if(timerGrowthStreak >= 5 && timers > 8){
          warn('health', '定时器疑似泄漏：连续增长至 ' + timers + ' 个');
          timerGrowthStreak = 0;
        }
        lastTimers = timers;

        // 2) 待发消息积压
        const pendingMsgs = (e.state.pendingMessages || []).length;
        if(pendingMsgs > 0){
          if(!pendingStuckSince) pendingStuckSince = Date.now();
          else if(Date.now() - pendingStuckSince > 15000){
            warn('health', '待发消息积压 ' + pendingMsgs + ' 条超过 15s 未消化');
            pendingStuckSince = 0;
          }
        } else pendingStuckSince = 0;

        // 3) 未读爆增（信息过载）
        const unread = Object.values(e.state.conversations || {}).reduce((a, c) => a + (c.unread || 0), 0);
        if(unread - lastUnread >= 5){
          warn('health', '未读消息突增 ' + (unread - lastUnread) + ' 条（信息过载）', { unread });
        }
        lastUnread = unread;

        // 4) 屏幕卡死：同屏超过 60s 且无任何事件（主屏/会话等可长时间停留的屏幕豁免）
        const screen = document.querySelector('.screen.active')?.id || '';
        const calmScreens = ['home-screen', 'chat-screen', 'messages-app', 'group-chat-screen'];
        if(screen !== lastScreen){ lastScreen = screen; lastEventAt = Date.now(); }
        else if(screen && !calmScreens.includes(screen) && Date.now() - lastEventAt > 60000 && (e.state.pendingMessages || []).length === 0){
          warn('health', '屏幕「' + screen + '」已停留 60s 且无事件（可能卡死或无内容）');
          lastEventAt = Date.now();
        }

        // 5) 英文模式下出现中文回退
        if(window.I18N && window.I18N.getLang && window.I18N.getLang() === 'en-US'){
          const body = document.querySelector('.screen.active')?.innerText || '';
          if(/[\u4e00-\u9fa5]{3,}/.test(body)){
            warn('health', '英文模式下检测到未翻译中文', { sample: body.match(/[\u4e00-\u9fa5]{3,}/)?.[0] });
          }
        }
      } catch(err){
        error('health', '体检异常: ' + err.message);
      }
    }, 2000);
  }
  function stopHealthChecks(){ if(healthTimer){ clearInterval(healthTimer); healthTimer = null; } }

  // ---------- 面板与导出 ----------
  let badge = null;
  function updateBadge(){
    if(!enabled) return;
    if(!badge){
      badge = document.createElement('div');
      badge.id = 'neon-debug-badge';
      badge.style.cssText = 'position:fixed;right:6px;bottom:6px;z-index:99999;background:rgba(0,0,0,.75);color:#ff5fa8;font:11px/1.4 monospace;padding:3px 6px;border-radius:8px;cursor:pointer;border:1px solid rgba(255,95,168,.5)';
      badge.title = '点击复制最近日志';
      badge.onclick = () => {
        const text = dump();
        if(navigator.clipboard) navigator.clipboard.writeText(text).then(() => {
          badge.textContent = '已复制 ' + issues.length;
          setTimeout(() => updateBadge(), 1200);
        });
      };
      document.body.appendChild(badge);
    }
    const errs = issues.filter(i => i.level === 'error').length;
    badge.textContent = 'DBG ' + errs + 'E/' + issues.length + 'W';
    badge.style.color = errs ? '#ff4d4d' : '#ff5fa8';
  }

  function dump(){
    const head = ['=== NeonDebug dump ===', 'enabled:' + enabled, 'entries:' + buffer.length, 'issues:' + issues.length, ''];
    const lines = buffer.map(e => `${e.at} [${e.level}] ${e.tag} — ${e.msg}` + (e.extra ? ' ' + JSON.stringify(e.extra) : ''));
    return head.concat(lines).join('\n');
  }
  function download(){
    const blob = new Blob([dump()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'neon-debug-' + new Date().toISOString().replace(/[:.]/g, '-') + '.log';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  window.NeonDebug = {
    enable(){ enabled = true; try { localStorage.setItem('neon_debug','1'); } catch(_) {} info('debug','已启用'); if(engineRef) startHealthChecks(); return true; },
    disable(){ enabled = false; stopHealthChecks(); try { localStorage.removeItem('neon_debug'); } catch(_) {} return false; },
    isEnabled(){ return enabled; },
    attach,
    info, warn, error,
    dump, download,
    issues(){ return issues.slice(); },
    entries(){ return buffer.slice(); },
    // 便捷：记录自定义检查点
    mark(name, extra){ info('mark', name, extra); },
  };

  if(enabled) info('debug', 'NeonDebug 已启用（?debug=1）');
})();


/* ===== engine_social.js ===== */
/* ===== 霓虹心事 · 引擎：消息/通话/群聊/语音信箱（消息队列、并发来电、群发） =====
 * 本文件由 engine.js 拆分而来（v0.1.7），方法逐字搬移，经 Object.assign 混入 PhoneEngine.prototype。
 */

Object.assign(PhoneEngine.prototype, {
  // v0.2.2: 塔罗 hint 文案变体——消息可带 flavors: {hintType: '替代文本'}，
  // 今日牌面 hint.type 命中时用变体文本，否则用默认 text（数据驱动，逐条消息可配）
  _flavoredText(msg){
    if(!msg || !msg.flavors) return typeof msg.text === 'string' ? msg.text : '';
    const type = this._fortuneType();
    if(type && typeof msg.flavors[type] === 'string') return msg.flavors[type];
    return typeof msg.text === 'string' ? msg.text : '';
  },
  queueMessage(msg, delay=0){
    if(!msg || !['narrator', ...Object.keys(this.state.conversations)].includes(msg.from)) return;
    const text = this._flavoredText(msg);
    const typingTime = msg.from === 'narrator' ? 0 : Math.min(2200, Math.max(700, text.length * 50));
    const item = {
      id:this._newPendingId('message'), from:msg.from, text,
      choice:msg.choice || null, thenEvent:msg.then || null, followup:msg.followup || null,
      dueAt:Date.now() + Math.max(0, delay * 1000) + typingTime
    };
    this.state.pendingMessages.push(item);
    if(msg.from !== 'narrator'){
      this._setTimeout(()=>{
        const conv = this.state.conversations[msg.from];
        if(conv && this.state.pendingMessages.some(p=>p.id === item.id)){
          conv.typing = true;
          this.emit('conversationUpdate', {id:msg.from, conv});
        }
      }, Math.max(0, delay * 1000));
    }
    this._schedulePendingMessage(item);
    this.emit('stateChange', this.state);
  },

  normalizeOptionEffects(opt){
    if(!opt) return {};
    const eff = {...(opt.effects || {})};
    if(opt.thenEvent && !eff.thenEvent) eff.thenEvent = opt.thenEvent;
    return eff;
  },

  sendMessage(convId, text, effects){
    const eff = effects || {};
    // 旁白决策：不入会话，仅应用 effects
    if(convId === 'narrator'){
      this._removeInteraction(item=>item.type === 'narrator_choice');
      this._applyEffects(eff);
      if(eff.thenEvent) this._dispatchSpecialThen(eff.thenEvent);
      this.emit('stateChange', this.state);
      return;
    }
    const conv = this.state.conversations[convId];
    if(!conv) return;
    const safeText = typeof text === 'string' ? text.slice(0, 1000) : String(text || '').slice(0, 1000);
    conv.messages.push({from:'me', text:safeText, time:this.getTime().time, day:this.state.day, ts:Date.now()});
    // 标记玩家已回复上一条 NPC 消息（用于已读不回判定）
    for(let i = conv.messages.length - 2; i >= 0; i--){
      if(conv.messages[i].from !== 'me'){
        conv.messages[i].replied = true;
        if(conv.messages[i].id){
          this.state.pendingFollowups = this.state.pendingFollowups.filter(p=>p.messageId !== conv.messages[i].id);
        }
        break;
      }
    }
    // 清理会话挂起选项
    if(conv.pendingChoice){ delete conv.pendingChoice; }
    this.emit('conversationUpdate', {id:convId, conv});
    this._applyEffects(eff);
    if(eff.thenEvent) this._dispatchSpecialThen(eff.thenEvent);
    this.emit('stateChange', this.state);
    if(this._retryDeferredEvents) this._retryDeferredEvents();
  },

  _dispatchSpecialThen(thenEvent){
    if(!thenEvent) return;
    if(thenEvent.startsWith('__inv_accept_')){
      const invId = thenEvent.slice('__inv_accept_'.length);
      this.resolveInvitation(invId, 'accepted');
      return;
    }
    if(thenEvent.startsWith('__inv_decline_')){
      const invId = thenEvent.slice('__inv_decline_'.length);
      this.resolveInvitation(invId, 'declined');
      return;
    }
    this._queueEventDispatch(thenEvent, 900);
  },

  chooseRoute(route){
    if(!['shenyan','luci','jiangyu','solo'].includes(route) || this.state.route || this.state.ended) return false;
    this.state.route = route;
    this._removeInteraction(item=>item.type === 'route_choice');
    this.state.flags.route = route;
    this.collectItem('stamp_route');
    // v0.9.7：补发选线前已经错过窗口的路线事件（否则 day7 选线会丢掉当天白天全部内容）
    this._flushPendingRouteEvents();
    // 进入路线后，未处理的邀约自动判定为 missed
    this.missPendingInvitations();
    const opt = this.story.routeChoice.options.find(o=>o.route===route);
    if(opt && opt.thenEvent){
      const gate = Number(this.story.finaleGate);
      // v0.9.7（D2-A′，默认关闭）：门槛未到就挂起，到日子由 checkTimeEvents 放行
      if(Number.isFinite(gate) && gate > this.state.day){
        this.state.pendingFinale = {eventId: opt.thenEvent, day: gate};
      } else {
        this.scheduleEvent(opt.thenEvent);
      }
    }
    this.emit('stateChange', this.state);
    return true;
  },

  markRead(convId){
    const conv = this.state.conversations[convId];
    if(!conv) return;
    conv.unread = 0;
    this.emit('stateChange', this.state);
  },

  // v0.9.6：一键已读——清理所有会话与群聊未读，缓解消息过载
  markAllRead(){
    let changed = 0;
    Object.values(this.state.conversations || {}).forEach(c=>{
      if(c && c.unread){ c.unread = 0; changed++; }
    });
    Object.values(this.state.groups || {}).forEach(g=>{
      if(g && g.unread){ g.unread = 0; changed++; }
    });
    if(changed) this.emit('stateChange', this.state);
    return changed;
  },

  triggerCall(eventId, dueAt=null){
    const evt = this.story.events[eventId];
    if(!evt || evt.type !== 'call') return;
    const callDueAt = Number.isFinite(dueAt) ? dueAt : Date.now() + 25000;
    const interaction = this._addInteraction({id:`call:${eventId}`, type:'call', eventId, dueAt:callDueAt});
    this._pendingCallEventId = interaction.eventId;
    this.emit('incomingCall', {
      from: evt.from,
      name: this.story.characters[evt.from].name,
      script: evt.script,
      eventId
    });
    this._scheduleActiveCall(eventId, callDueAt);
    this.emit('stateChange', this.state);
  },

  _scheduleActiveCall(eventId, dueAt){
    const evt = this.story.events[eventId];
    if(!evt || evt.type !== 'call') return;
    // 25 秒未接听 → 自动 missed 并留语音信箱
    // 支持并发：用 Map 按 eventId 注册定时器
    const oldTimer = this._callMissTimers.get(eventId);
    if(oldTimer) clearTimeout(oldTimer);  // 旧定时器句柄（全局 setTimeout 产生）
    const tid = this._setTimeout(()=>{
      this._callMissTimers.delete(eventId);
      const pending = this._findInteraction(item=>item.type === 'call' && item.eventId === eventId);
      if(pending){
        this._removeInteraction(item=>item.id === pending.id);
        this._pendingCallEventId = this._findInteraction(item=>item.type === 'call')?.eventId || null;
        this.addCallLog(evt.from, 'missed', '00:00');
        // 留语音信箱
        const lastHim = evt.script && [...evt.script].reverse().find(l=>l.who==='him');
        if(lastHim){
          this.addVoicemail(evt.from, lastHim.text, eventId, evt.voicemailCallback || null);
        }
        if(evt.onMissed) this.scheduleEvent(evt.onMissed);
        this.emit('callMissed', eventId);
        this.emit('stateChange', this.state);
      }
    }, Math.max(0, dueAt - Date.now()));
    this._callMissTimers.set(eventId, tid);
  },

  answerCall(eventId){
    const tid = this._callMissTimers.get(eventId);
    if(tid){ clearTimeout(tid); this._timers.delete(tid); this._callMissTimers.delete(eventId); }
    this._removeInteraction(item=>item.type === 'call' && item.eventId === eventId);
    this._pendingCallEventId = this._findInteraction(item=>item.type === 'call')?.eventId || null;
    // v0.1.7: 凌晨 3 点仍在接电话 → 记录「深夜来电」彩蛋（egg_midnight 的达成条件）
    if(this.getTime().hour === 3) this.state.flags.midnight_call = true;
    this.emit('callAnswered', eventId);
    this.emit('stateChange', this.state);
  },

  declineCall(eventId){
    const tid = this._callMissTimers.get(eventId);
    if(tid){ clearTimeout(tid); this._timers.delete(tid); this._callMissTimers.delete(eventId); }
    this._removeInteraction(item=>item.type === 'call' && item.eventId === eventId);
    this._pendingCallEventId = this._findInteraction(item=>item.type === 'call')?.eventId || null;
    const evt = this.story.events[eventId];
    // 留下语音信箱（基于 script 末尾的台词）
    if(evt && evt.from && evt.script){
      const lastHim = [...evt.script].reverse().find(l=>l.who==='him');
      if(lastHim){
        this.addVoicemail(evt.from, lastHim.text, eventId, evt.voicemailCallback || null);
      }
    }
    // 主动拒接也写入通话记录
    if(evt) this.addCallLog(evt.from, 'declined', '00:00');
    if(evt && evt.onDecline) this.scheduleEvent(evt.onDecline);
    this.emit('callDeclined', eventId);
    this.emit('stateChange', this.state);
  },

  addCallLog(from, type, duration){
    this.state.callLog.unshift({
      from, type, duration,
      name: this.story.characters[from]?.name || '未知',
      time: this.getTime().time,
      day: this.state.day
    });
    this.emit('stateChange', this.state);
  },

  checkGroups(){
    if(!this.story.groups) return;
    for(const [id, g] of Object.entries(this.story.groups)){
      if(this.state.flags['group_created_'+id]) continue;
      try {
        if(!g.trigger || g.trigger(this.state)){
          this.state.flags['group_created_'+id] = true;
          this.state.groups[id] = {
            id, name: g.name, members: g.members,
            messages: [], unread:0, typing:false
          };
          this.emit('groupCreated', {id, group:this.state.groups[id]});
          if(g.createEvent) this._queueEventDispatch(g.createEvent, 1500);
        }
      } catch(_) {}
    }
  },

  queueGroupMessage(groupId, msg, delay=0){
    const group = this.state.groups[groupId];
    if(!group){
      // 群还没创建，先创建（容错）
      const gdef = this.story.groups[groupId];
      if(!gdef) return;
      this.state.groups[groupId] = {id:groupId, name:gdef.name, members:gdef.members, messages:[], unread:0, typing:false};
    }
    const g = this.state.groups[groupId];
    const text = this._flavoredText(msg);
    const typingTime = Math.min(2200, Math.max(700, text.length * 50));
    const item = {id:this._newPendingId('group-message'), groupId, from:msg.from, text,
      choice:msg.choice || null, thenEvent:msg.then || null,
      dueAt:Date.now() + Math.max(0, delay * 1000) + typingTime};
    this.state.pendingMessages.push(item);
    this._setTimeout(()=>{
      if(this.state.pendingMessages.some(p=>p.id === item.id)){
        g.typing = true;
        this.emit('groupUpdate', {id:groupId, group:g});
      }
    }, Math.max(0, delay * 1000));
    this._schedulePendingMessage(item);
    this.emit('stateChange', this.state);
  },

  sendGroupMessage(groupId, text, effects){
    const g = this.state.groups[groupId];
    if(!g) return;
    g.messages.push({from:'me', text, time:this.getTime().time, ts:Date.now()});
    // 清理群挂起选项
    if(g.pendingChoice){ delete g.pendingChoice; }
    this.emit('groupUpdate', {id:groupId, group:g});
    this._applyEffects(effects);
    if(effects && effects.thenEvent) this._queueEventDispatch(effects.thenEvent, 900);
  },

  markGroupRead(groupId){
    const g = this.state.groups[groupId];
    if(!g) return;
    g.unread = 0;
    this.emit('stateChange', this.state);
  },

  addVoicemail(from, text, eventId, callbackEvent){
    const vmId = 'vm_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now()+'_'+Math.random().toString(36).slice(2));
    const vm = {
      id: vmId,
      from, text, eventId, callbackEvent,
      time: this.getTime().time,
      day: this.state.day,
      heard: false,
      durationSec: this.voicemailMeta(text).durationSec   // v0.7.3：由文本派生，不占存档名额
    };
    this.state.voicemails.unshift(vm);
    this.emit('voicemailReceived', vm);
    this.emit('stateChange', this.state);
    return vm.id;
  },

  // ===== v0.7.3：语音信箱时长元数据 =====
  // 剧情数据里的留言自带时长标记，形如「（语音信箱 23"）：展签译名……算了。晚安。」，
  // 英译包中同一条为「(Voicemail 23"): The wall titles... never mind. Good night.」。
  // 此前这些秒数被当作正文的一部分丢掉了；解析出来后可显示时长并驱动播放进度。
  parseVoicemailMeta(text){
    const src = typeof text === 'string' ? text : String(text == null ? '' : text);
    const m = /^[（(]\s*(?:语音信箱|voicemail)\s*(\d{1,3})\s*(?:["″]|秒|s)?\s*[）)]\s*[:：]?\s*/i.exec(src);
    if(m){
      const sec = parseInt(m[1], 10);
      const body = src.slice(m[0].length).trim();
      return { durationSec: (sec > 0 && sec <= 600) ? sec : null, body: body || src.trim() };
    }
    return { durationSec: null, body: src.trim() };
  },
  // 无显式标记时的兜底估算：中文按 5.5 字/秒、西文按 2.6 词/秒（含换气停顿），加 1.5s 起手留白。
  // 保证任何留言都有合理秒数，UI 不会拿到 0 / NaN。
  estimateVoicemailDuration(body){
    const src = String(body == null ? '' : body);
    const cnCount = (src.match(/[\u4e00-\u9fa5]/g) || []).length;
    const wordCount = (src.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9']+/g) || []).length;
    const sec = Math.max(cnCount / 5.5, wordCount / 2.6) + 1.5;
    return Math.min(60, Math.max(3, Math.round(sec)));
  },
  // 统一入口：任何地方拿到留言文本都走这里，返回 {durationSec, body}
  voicemailMeta(text){
    const meta = this.parseVoicemailMeta(text);
    if(meta.durationSec == null) meta.durationSec = this.estimateVoicemailDuration(meta.body);
    return meta;
  },

  // ===== v0.7.3：已听标记与删除 =====
  unreadVoicemailCount(){
    return (this.state.voicemails || []).filter(vm => !vm.heard).length;
  },
  markVoicemailRead(vmId){
    const vm = (this.state.voicemails || []).find(v => v.id === vmId);
    if(!vm || vm.heard) return false;
    vm.heard = true;
    this.emit('voicemailUpdate', vm);
    this.emit('stateChange', this.state);
    return true;
  },
  markAllVoicemailsRead(){
    const targets = (this.state.voicemails || []).filter(vm => !vm.heard);
    if(targets.length === 0) return 0;
    targets.forEach(vm => { vm.heard = true; });
    this.emit('voicemailUpdate', null);
    this.emit('stateChange', this.state);
    return targets.length;
  },
  deleteVoicemail(vmId){
    const list = this.state.voicemails || [];
    const idx = list.findIndex(v => v.id === vmId);
    if(idx < 0) return false;
    const removed = list.splice(idx, 1)[0];
    this.emit('voicemailDeleted', removed);
    this.emit('stateChange', this.state);
    return true;
  },

  playVoicemail(vmId){
    const vm = this.state.voicemails.find(v=>v.id===vmId);
    if(!vm) return false;
    vm.heard = true;
    this.collectItem('recording_msg');
    this.emit('voicemailPlayed', vm);
    this.emit('stateChange', this.state);
    return true;
  },

  callbackVoicemail(vmId){
    const vm = this.state.voicemails.find(v=>v.id===vmId);
    if(!vm || !vm.callbackEvent) return false;
    vm.heard = true;
    this.scheduleEvent(vm.callbackEvent);
    this.emit('voicemailCallback', vm);
    this.emit('stateChange', this.state);
    return true;
  },
});


/* ===== ui/00_shell.js ===== */
/* ===== 霓虹心事 · UI：壳：引擎实例、屏幕表、屏幕切换、Toast、通知、时间显示、锁屏 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

/* ===== 霓虹心事 · 手机模拟应用入口 ===== */
  const engine = new PhoneEngine(window.STORY);
  // v0.6.4：调试日志挂接（?debug=1 启用；默认零开销）
  if(typeof NeonDebug !== 'undefined') NeonDebug.attach(engine);  // v0.5.6（F2.1）：story 已 ESM 化，从 window 取
  const $ = id => document.getElementById(id);
  const screens = {
    lock:$('lock-screen'), home:$('home-screen'),
    messages:$('messages-app'), chat:$('chat-screen'),
    phone:$('phone-app'), incomingCall:$('incoming-call'),
    moments:$('moments-app'), postMoment:$('post-moment-screen'),
    album:$('album-app'), photoView:$('photo-view'),
    calendar:$('calendar-app'), music:$('music-app'),
    notes:$('notes-app'), profile:$('profile-app'),
    dream:$('dream-screen'), ending:$('ending-screen'),
    map:$('map-app'), encounter:$('encounter-screen'),
    groups:$('groups-app'), groupChat:$('group-chat-screen'),
    contacts:$('contacts-app'), charProfile:$('char-profile-screen'),
    flashback:$('flashback-screen'),
    shop:$('shop-app'), mood:$('mood-app'),
    tarot:$('tarot-app'), achievements:$('achievements-app'),
    collection:$('collection-app'), puzzles:$('puzzles-app'),
    puzzleDetail:$('puzzle-detail-screen'), calendar2:$('calendar2-app'),
    perspective:$('perspective-app'), pscene:$('perspective-scene-screen'),
    truthEnding:$('truth-ending-screen'),
    // v0.0.13 新玩法
    player:$('player-app'), playerEdit:$('player-edit-screen'),
    relations:$('relations-app'), tasks:$('tasks-app'),
    watch:$('watch-app'),
    // v0.0.15 新玩法
    affection:$('affection-app'), themes:$('themes-app'),
    endings:$('endings-app'), dates:$('dates-app'),
    dateScene:$('date-scene-screen'),
    // v0.0.16 新玩法
    dreams:$('dreams-app'), hints:$('hints-app'),
    nightmare:$('nightmare-screen'),
    // v0.1.0 存档
    saves:$('saves-app'), settings:$('settings-app')
  };
  let currentConvId = null;
  let currentGroupId = null;
  let timeoutTimer = null;
  // v0.8.1: 限时回复按会话管理，切换会话只重建视图、不重置截止时间
  const chatTimeouts = new Map();
  function clearChatTimeout(convId){
    const item = chatTimeouts.get(convId);
    if(item){ window.clearTimeout(item.handle); chatTimeouts.delete(convId); }
  }
  function clearAllChatTimeouts(){
    chatTimeouts.forEach(item=>window.clearTimeout(item.handle));
    chatTimeouts.clear();
    if(timeoutTimer){ window.clearTimeout(timeoutTimer); timeoutTimer = null; }
  }
  let selectedMomentArt = '';
  const uiTimers = new Set();

  function setUiTimeout(fn, delay){
    const id = window.setTimeout(()=>{
      uiTimers.delete(id);
      fn();
    }, delay);
    uiTimers.add(id);
    return id;
  }
  function resetTransientUi(){
    uiTimers.forEach(id=>window.clearTimeout(id));
    uiTimers.clear();
    clearAllChatTimeouts();
    currentConvId = null;
    currentGroupId = null;
    currentEncounter = null;
    currentNightmare = null;
    window._currentCall = null;
    if($('time-adv')) $('time-adv').hidden = true;
    document.getElementById('route-choice-modal')?.remove();
    document.getElementById('narrator-choice-modal')?.remove();
    // v0.7.3：清掉语音信箱详情抽屉（内部会停掉正在播放的留言）
    closeVmDetail();
  }

  // ===== 屏幕切换 =====
  function showScreen(name){
    // v0.7.3：离开当前屏幕即停播留言，避免声音与进度条残留在后台继续走
    stopVmPlayback();
    Object.values(screens).forEach(s=>{ if(s) s.classList.remove('active'); });
    if(screens[name]) screens[name].classList.add('active');
  }

  // ===== Toast =====
  let toastTimer = null;
  function toast(msg){
    const t = $('toast');
    // v0.3.6: i18n 文案集中层——按当前语言包翻译，未命中回退原文（中文为源）
    t.textContent = (typeof I18N !== 'undefined' && I18N.translate) ? I18N.translate(msg) : msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setUiTimeout(()=>{ t.hidden = true; }, 1500);
  }

  // ===== 共享工具 =====
  function escapeHtml(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function nl2brEscaped(s){
    return escapeHtml(s).replace(/\n/g, '<br>');
  }
  function mergeOptionEffects(opt){
    return engine.normalizeOptionEffects ? engine.normalizeOptionEffects(opt) : {...(opt?.effects||{})};
  }

  // ===== 角色头像 =====
  function avatarImg(char){
    if(char && char.avatarImg){
      return `<img class="avatar-img" src="${char.avatarThumb || char.avatarImg}" alt="" loading="lazy" decoding="async" width="128" height="128">`;
    }
    return escapeHtml(char && char.avatar ? char.avatar : '?');
  }

  // ===== 通知 =====
  // v0.6.3：读档/新开局后的静默窗口——期间到达的消息只计未读，不弹通知。
  // 修复「打开就看到一堆弹窗」：恢复 pending 消息时玩家还没进入状态。
  let notifMuteUntil = 0;
  function muteNotifs(ms){ notifMuteUntil = Date.now() + ms; }

  function showNotif(from, text, onClick){
    const char = STORY.characters[from];
    if(!char) return;
    if(Date.now() < notifMuteUntil) return;   // 静默窗口内不打扰
    AudioSys.play('msg');  // v0.1.7: 消息提示音
    const stack = $('notif-stack');
    // v0.6.3：通知栈上限 3 条，避免一次性涌入叠成一堵墙
    while(stack.children.length >= 3) stack.firstElementChild?.remove();
    const n = document.createElement('div');
    n.className = 'notif';
    n.innerHTML = `
      <div class="n-icon" style="background:${char.bg}">${avatarImg(char)}</div>
      <div class="n-content">
        <div class="n-title">${escapeHtml(window.t(char.name))}</div>
        <div class="n-text">${escapeHtml(text)}</div>
      </div>
    `;
    n.onclick = ()=>{
      if(typeof onClick === 'function') onClick();
      else openConversation(from);
      n.remove();
    };
    stack.appendChild(n);
    setUiTimeout(()=> n.remove(), 5000);
  }

  // ===== 时间显示 =====
  function updateTimeDisplay(){
    const t = engine.getTime();
    const d = engine.getDateLabel();
    $('sb-time').textContent = t.time;
    $('lock-time').textContent = t.time;
    $('lock-date').textContent = window.localizeDateLabel(d.full);   // v0.7.8：中文快照显示层重拼（英文模式 7/15 Wed）
    $('widget-time').textContent = t.time;
    $('widget-date').textContent = window.t('{m}月{d}日', {m: d.month, d: d.date});   // v0.7.7：日期走 i18n 模板（英文模式显示 7/15）
  }

  // ===== 锁屏 =====
  $('lock-screen').addEventListener('click', ()=>{
    if(!restorePendingUi()) showScreen('home');
  });
  let lockSwipeStart = null;
  $('lock-screen').addEventListener('touchstart', e=>{
    lockSwipeStart = e.touches[0].clientY;
  });
  $('lock-screen').addEventListener('touchend', e=>{
    if(lockSwipeStart === null) return;
    const dy = e.changedTouches[0].clientY - lockSwipeStart;
    if(dy < -30 && !restorePendingUi()) showScreen('home');
    lockSwipeStart = null;
  });


/* ===== ui/01_input_delegate.js ===== */
/* ===== 霓虹心事 · UI：全局点击委托（按钮/选项/导航的统一事件分发） =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 全局点击委托 =====
  document.body.addEventListener('click', e=>{
    if(e.target.closest('button')) AudioSys.play('tap');  // v0.1.7: 按键点击音
    const appBtn = e.target.closest('[data-app]');
    if(appBtn){ openApp(appBtn.dataset.app); return; }
    const backBtn = e.target.closest('[data-back]');
    if(backBtn){ showScreen(backBtn.dataset.back); return; }
    const convBtn = e.target.closest('[data-conv]');
    if(convBtn){ openConversation(convBtn.dataset.conv); return; }
    const photoBtn = e.target.closest('[data-photo]');
    if(photoBtn){ viewPhoto(photoBtn.dataset.photo); return; }
    const musicBtn = e.target.closest('[data-music]');
    if(musicBtn){ engine.playMusic(musicBtn.dataset.music); AudioSys.playTrack(musicBtn.dataset.music); return; }  // v0.4.10（E2）：点播真实出声
    // v0.1.7: 音乐 App 内的音效/环境音开关
    if(e.target.closest('#ss-sound')){ toggleSoundSetting(); return; }
    if(e.target.closest('#ss-bgm')){ toggleBgmSetting(); return; }
    // v0.5.0（E3 周目）：二周目——携带收集/成就/图鉴重开
    const ngBtn = e.target.closest('#btn-ngplus');
    if(ngBtn){
      engine.newGame({ngPlus: true});
      afterLoadRefresh();
      toast('二周目开始——收集与图鉴已继承');
      showScreen('lock');
      return;
    }
    const restartBtn = e.target.closest('[data-action="restart"]');
    if(restartBtn){
      engine.newGame();
      afterLoadRefresh();
      showScreen('lock');
      return;
    }
    // v0.1.0 存档操作
    const continueBtn = e.target.closest('[data-action="continue-game"]');
    if(continueBtn){
      const ok = engine.continueGame();
      if(ok){
        const restored = afterLoadRefresh();
        toast('已继续游戏');
        if(!restored) showScreen('home');
      } else {
        toast('没有可继续的存档');
      }
      return;
    }
    const openSavesBtn = e.target.closest('[data-action="open-saves"]');
    if(openSavesBtn){ openApp('saves'); return; }
    const saveSlotBtn = e.target.closest('[data-save-action]');
    if(saveSlotBtn){
      handleSaveAction(saveSlotBtn.dataset.saveAction, saveSlotBtn.dataset.slot || '');
      return;
    }
    const callBtn = e.target.closest('[data-call]');
    if(callBtn){ handleCallAction(callBtn.dataset.call); return; }
    const routeBtn = e.target.closest('[data-route]');
    if(routeBtn){ handleRouteChoice(routeBtn.dataset.route); return; }
    // 朋友圈
    const postBtn = e.target.closest('[data-action="post-moment"]');
    if(postBtn){ openPostMoment(); return; }
    const publishBtn = e.target.closest('[data-action="publish-moment"]');
    if(publishBtn){ publishMoment(); return; }
    const artBtn = e.target.closest('[data-moment-art]');
    if(artBtn){ selectMomentArt(artBtn); return; }
    const likeBtn = e.target.closest('[data-moment-like]');
    if(likeBtn){ engine.likeMoment(likeBtn.dataset.momentLike); return; }
    const commentBtn = e.target.closest('[data-moment-comment]');
    if(commentBtn){ toggleCommentOptions(commentBtn.dataset.momentComment); return; }
    const commentOpt = e.target.closest('[data-moment-comment-opt]');
    if(commentOpt){ engine.commentMoment(commentOpt.dataset.momentCommentOpt, parseInt(commentOpt.dataset.optIdx)); return; }
    // 梦境
    const dreamOpt = e.target.closest('[data-dream-opt]');
    if(dreamOpt){ engine.resolveDream(dreamOpt.dataset.dreamOpt, parseInt(dreamOpt.dataset.optIdx)); return; }
    // 自由输入
    const freeSendBtn = e.target.closest('[data-action="free-send"]');
    if(freeSendBtn){ handleFreeSend(); return; }
    // 出行/地点
    const locBtn = e.target.closest('[data-loc]');
    if(locBtn){ goToLocation(locBtn.dataset.loc); return; }
    // 偶遇选项
    const encOpt = e.target.closest('[data-enc-opt]');
    if(encOpt){
      const idx = parseInt(encOpt.dataset.encOpt);
      if(currentEncounter){
        const isMemory = !!currentEncounter.isMemory;
        const resolved = isMemory
          ? engine.resolveMemory(currentEncounter.id, idx)
          : engine.resolveEncounter(currentEncounter, idx);
        if(resolved && !isMemory) setUiTimeout(()=> closeEncounter(), 200);
      }
      return;
    }
    // 关闭偶遇屏
    const closeEncBtn = e.target.closest('[data-action="close-encounter"]');
    if(closeEncBtn){ closeEncounter(); return; }
    // 回忆杀（相册触发）
    const memBtn = e.target.closest('[data-memory]');
    if(memBtn){
      const memId = engine.getMemoriesByPhoto(memBtn.dataset.memory);
      if(memId){
        const ok = engine.triggerMemory(memId);
        if(!ok) toast('这段回忆已经回味过了');
      }
      return;
    }
    // v0.0.9 新玩法
    const shopTab = e.target.closest('[data-shop-tab]');
    if(shopTab){ renderShop(shopTab.dataset.shopTab); return; }
    const buyBtn = e.target.closest('[data-buy]');
    if(buyBtn){ handleBuyGift(buyBtn.dataset.buy); return; }
    const sendGiftBtn = e.target.closest('[data-send-gift]');
    if(sendGiftBtn){ openGiftSendModal(sendGiftBtn.dataset.sendGift); return; }
    const giftCharBtn = e.target.closest('[data-gift-char]');
    if(giftCharBtn){ selectGiftChar(giftCharBtn.dataset.giftChar); return; }
    const giftConfirmBtn = e.target.closest('[data-action="confirm-gift"]');
    if(giftConfirmBtn){ handleConfirmGift(); return; }
    const giftCancelBtn = e.target.closest('[data-action="cancel-gift"]');
    if(giftCancelBtn){ closeGiftSendModal(); return; }
    const moodOpt = e.target.closest('[data-mood-opt]');
    if(moodOpt){ engine.setMood(moodOpt.dataset.moodOpt); renderMood(); return; }
    const diarySubmit = e.target.closest('[data-action="submit-diary"]');
    if(diarySubmit){ handleDiarySubmit(); return; }
    const tarotDraw = e.target.closest('[data-action="draw-tarot"]');
    if(tarotDraw){ handleDrawTarot(); return; }
    // v0.0.10 新玩法
    const collTab = e.target.closest('[data-coll-cat]');
    if(collTab){ renderCollection(collTab.dataset.collCat); return; }
    const puzzleCardBtn = e.target.closest('[data-puzzle]');
    if(puzzleCardBtn){ openPuzzleDetail(puzzleCardBtn.dataset.puzzle); return; }
    const puzzleSubmit = e.target.closest('[data-action="submit-puzzle"]');
    if(puzzleSubmit){ handlePuzzleSubmit(); return; }
    const clueDiscover = e.target.closest('[data-clue]');
    if(clueDiscover){ engine.discoverClue(clueDiscover.dataset.clue); renderPuzzleDetail(currentPuzzleId); return; }
    const perspSceneBtn = e.target.closest('[data-pscene]');
    if(perspSceneBtn){ openPerspectiveScene(perspSceneBtn.dataset.pscene); return; }
    const psceneOpt = e.target.closest('[data-pscene-opt]');
    if(psceneOpt){ handlePsceneOption(parseInt(psceneOpt.dataset.psceneOpt)); return; }
    const truthBtn = e.target.closest('[data-action="show-truth"]');
    if(truthBtn){ showTruthEnding(truthBtn.dataset.charId); return; }
    // v0.0.13 主角档案编辑
    const editPlayerBtn = e.target.closest('[data-action="edit-player"]');
    if(editPlayerBtn){ openPlayerEdit(); return; }
    const cancelEditBtn = e.target.closest('[data-action="cancel-player-edit"]');
    if(cancelEditBtn){ playerEditState = null; showScreen('player'); return; }
    const savePlayerBtn = e.target.closest('[data-action="save-player"]');
    if(savePlayerBtn){ savePlayer(); return; }
    if(handlePlayerEditClick(e.target)){ return; }
    // v0.0.13 每日任务连胜奖励
    const claimStreakBtn = e.target.closest('[data-action="claim-streak"]');
    if(claimStreakBtn){ claimStreakReward(parseInt(claimStreakBtn.dataset.days)); return; }
    // v0.0.13 观赏模式
    const watchToggleBtn = e.target.closest('[data-action="toggle-watch"]');
    if(watchToggleBtn){ toggleWatchMode(); return; }
    const watchStrategyBtn = e.target.closest('[data-watch-strategy]');
    if(watchStrategyBtn){ setWatchStrategy(watchStrategyBtn.dataset.watchStrategy); return; }
    // v0.0.15 主题/约会
    const themeBtn = e.target.closest('[data-theme]');
    if(themeBtn){ handleThemeClick(themeBtn.dataset.theme); return; }
    const iconThemeBtn = e.target.closest('[data-icon-theme]');
    if(iconThemeBtn){ handleIconThemeClick(iconThemeBtn.dataset.iconTheme); return; }
    const dateBtn = e.target.closest('[data-date]');
    if(dateBtn){ handleDateClick(dateBtn.dataset.date); return; }
    const closeDateBtn = e.target.closest('[data-action="close-date"]');
    if(closeDateBtn){ closeDateScene(); return; }
    const finishDateBtn = e.target.closest('[data-action="finish-date"]');
    if(finishDateBtn){ handleFinishDate(finishDateBtn.dataset.finishDate); return; }
    // v0.0.16 梦魇/提示
    const nightmareOptBtn = e.target.closest('[data-nightmare-opt]');
    if(nightmareOptBtn){ handleNightmareOpt(parseInt(nightmareOptBtn.dataset.nightmareOpt)); return; }
    const closeNightmareBtn = e.target.closest('[data-action="close-nightmare"]');
    if(closeNightmareBtn){ closeNightmareScreen(); return; }
    const toggleHintsBtn = e.target.closest('[data-action="toggle-hints"]');
    if(toggleHintsBtn){ toggleOptionHints(); return; }
    const momentReplyBtn = e.target.closest('[data-moment-reply]');
    if(momentReplyBtn){ handleMomentReply(momentReplyBtn.dataset.momentReply); return; }
  });

  function openApp(app){
    switch(app){
      case 'messages': renderConvList(); showScreen('messages'); break;
      case 'phone': renderCallLog(); renderVoicemails(); showScreen('phone'); break;
      case 'moments': renderMoments(); showScreen('moments'); break;
      case 'album': renderAlbum(); showScreen('album'); break;
      case 'calendar': renderCalendar(); showScreen('calendar'); break;
      case 'music': renderMusic(); showScreen('music'); break;
      case 'notes': renderNotes(); showScreen('notes'); break;
      case 'profile': renderProfile(); showScreen('profile'); break;
      case 'map': renderMap(); showScreen('map'); break;
      case 'groups': renderGroupList(); showScreen('groups'); break;
      case 'contacts': renderContacts(); showScreen('contacts'); break;
      case 'shop': renderShop('store'); showScreen('shop'); break;
      case 'mood': renderMood(); showScreen('mood'); break;
      case 'tarot': renderTarot(); showScreen('tarot'); break;
      case 'achievements': renderAchievements(); showScreen('achievements'); break;
      case 'collection': renderCollection('all'); showScreen('collection'); break;
      case 'puzzles': renderPuzzles(); showScreen('puzzles'); break;
      case 'calendar2': renderCalendar2(); showScreen('calendar2'); break;
      case 'perspective': renderPerspective(); showScreen('perspective'); break;
      // v0.0.13 新玩法
      case 'player': renderPlayer(); showScreen('player'); break;
      case 'relations': renderRelations(); showScreen('relations'); break;
      case 'tasks': renderTasks(); showScreen('tasks'); break;
      case 'watch': renderWatch(); showScreen('watch'); break;
      // v0.0.15 新玩法
      case 'affection': renderAffection(); showScreen('affection'); break;
      case 'themes': renderThemes(); showScreen('themes'); break;
      case 'endings': renderEndings(); showScreen('endings'); break;
      case 'dates': renderDates(); showScreen('dates'); break;
      // v0.0.16 新玩法
      case 'dreams': renderDreams(); showScreen('dreams'); break;
      case 'hints': renderHints(); showScreen('hints'); break;
    // v0.1.0 存档
      case 'saves': renderSaves(); showScreen('saves'); break;
      case 'settings': renderSettings(); showScreen('settings'); break;
    }
  }

  // ===== v0.4.0 (D1.1 无障碍): 键盘可玩基础 =====
  // 原生 <button> 自带 Enter/Space 触发 click；此处补：锁屏回车解锁、非按钮可点元素回车触发、Esc 返回。
  document.addEventListener('keydown', e=>{
    const tag = (e.target && e.target.tagName) || '';
    if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;  // 表单内不拦截
    if(e.key === 'Escape'){
      const active = document.querySelector('.screen.active');
      if(active && active.id !== 'home-screen' && active.id !== 'lock-screen'){
        const back = active.querySelector('[data-back]');
        if(back) back.click(); else showScreen('home');
        e.preventDefault();
      }
      return;
    }
    if(e.key === 'Enter' || e.key === ' '){
      const lock = document.getElementById('lock-screen');
      if(lock && lock.classList.contains('active')){ lock.click(); e.preventDefault(); return; }
      const el = document.activeElement;
      if(el && el !== document.body && !/^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(el.tagName)){
        el.click();
        e.preventDefault();
      }
    }
  });


/* ===== ui/02_map_encounters.js ===== */
/* ===== 霓虹心事 · UI：出行地图与偶遇/回忆剧情屏 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 出行/地图 =====
  function renderMap(){
    const cur = engine.state.currentLocation || 'home';
    const curLoc = STORY.locations[cur];
    $('map-current-name').textContent = curLoc ? (curLoc.icon + ' ' + window.t(curLoc.name)) : window.t('未知');
    $('map-current-hint').textContent = curLoc ? window.t(curLoc.hint) : '';
    const list = $('map-list');
    list.innerHTML = '';
    // v0.8.4：等到明天——一键推进到次日早上，解决空窗期反复点同地点的枯燥
    const skipBtn = document.createElement('button');
    skipBtn.className = 'map-skip-day';
    skipBtn.innerHTML = '⏩ ' + window.t('等到明天') + ' <span class="map-skip-hint">' + window.t('推进到次日早上 8:00') + '</span>';
    skipBtn.onclick = ()=>{
      skipBtn.disabled = true;
      showTimeAdvanceOverlay(window.t('一夜过去…'));
      engine.advanceToNextDay(8);
      setUiTimeout(()=>{ skipBtn.disabled = false; renderMap(); }, 800);
    };
    list.appendChild(skipBtn);
    Object.entries(STORY.locations).forEach(([id, loc])=>{
      const item = document.createElement('button');
      item.className = 'map-item' + (id===cur ? ' current' : '');
      // v0.6.7：未解锁地点显示为暗色「尚未到达」卡（保留位置感，不剧透内容）
      const unlocked = engine.isLocationUnlocked ? engine.isLocationUnlocked(id) : true;
      item.dataset.loc = id;
      if(!unlocked){
        item.classList.add('locked');
        item.disabled = true;
        item.innerHTML = `
          <div class="map-item-icon">🔒</div>
          <div class="map-item-info">
            <div class="map-item-name">？？？</div>
            <div class="map-item-hint">${escapeHtml(window.t('还没来过这里——继续剧情，路会自己出现'))}</div>
          </div>
        `;
      } else {
        item.innerHTML = `
          <div class="map-item-icon">${loc.icon}</div>
          <div class="map-item-info">
            <div class="map-item-name">${escapeHtml(window.t(loc.name))}</div>
            <div class="map-item-hint">${escapeHtml(window.t(loc.hint))}</div>
          </div>
          ${id===cur ? '<div class="map-item-tag">' + window.t('当前') + '</div>' : '<div class="map-item-go">' + window.t('出发') + '</div>'}
        `;
      }
      list.appendChild(item);
    });
  }
  function goToLocation(locId){
    if(locId === engine.state.currentLocation){
      // 已在当前地点，仍尝试触发偶遇
      const ok = engine.tryEncounter(locId);
      if(!ok) toast('这里暂时没有新发现…');
      return;
    }
    const hadEncounter = engine.goToLocation(locId);
    renderMap();
    if(!hadEncounter) toast(t('到了{loc}，没什么特别的', {loc: STORY.locations[locId]?.name || ''}));
  }

  // ===== 偶遇/回忆剧情屏 =====
  let currentEncounter = null;
  function showEncounter(enc){
    currentEncounter = enc;
    const _t = window.t;  // v0.5.3（E4）
    $('encounter-title').textContent = _t(enc.title);
    $('encounter-desc').textContent = _t(enc.desc);
    const opts = $('encounter-options');
    opts.innerHTML = '';
    if(enc.choice){
      enc.choice.options.forEach((opt, i)=>{
        const btn = document.createElement('button');
        btn.className = 'dream-opt';
        btn.innerHTML = escapeHtml(window.t(opt.text)) + (opt.hint?` <span style="color:var(--ink-mute);font-size:11px">(${escapeHtml(window.t(opt.hint))})</span>`:'');
        btn.dataset.encOpt = i;
        opts.appendChild(btn);
      });
    } else {
      // 无选择，加一个"继续"按钮
      const btn = document.createElement('button');
      btn.className = 'dream-opt';
      btn.textContent = '继续';
      btn.dataset.encOpt = '0';
      opts.appendChild(btn);
    }
    showScreen('encounter');
  }
  function closeEncounter(){
    if(currentEncounter && !currentEncounter.isMemory){
      engine.cancelPendingInteraction(currentEncounter);
    }
    currentEncounter = null;
    showScreen('map');
  }


/* ===== ui/03_messages.js ===== */
/* ===== 霓虹心事 · UI：消息列表与单个会话渲染 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 消息列表 =====
  function renderConvList(){
    const list = $('conv-list');
    list.innerHTML = '';
    const convs = engine.state.conversations;
    const visibleConvs = Object.entries(convs).filter(([id,c])=> c.messages.length > 0 || id==='susu');
    visibleConvs.sort((a,b)=>{
      if(a[1].unread !== b[1].unread) return b[1].unread - a[1].unread;
      const aLast = a[1].messages[a[1].messages.length-1];
      const bLast = b[1].messages[b[1].messages.length-1];
      return (bLast?.ts||0) - (aLast?.ts||0);
    });
    visibleConvs.forEach(([id, conv])=>{
      const char = STORY.characters[id];
      if(!char) return;
      const last = conv.messages[conv.messages.length-1];
      const item = document.createElement('div');
      item.className = 'conv-item' + (conv.unread>0?' unread':'');
      item.dataset.conv = id;
      const preview = last ? (last.from==='me'? window.t('你') + ': ' : '') + window.t(last.text) : window.t('暂无消息');
      item.innerHTML = `
        <div class="conv-avatar" style="background:${char.bg}">${avatarImg(char)}</div>
        <div class="conv-info">
          <div class="conv-top">
            <span class="conv-name">${escapeHtml(window.t(char.name))}</span>
            <span class="conv-time">${last?.time || ''}</span>
          </div>
          <div class="conv-preview">${conv.typing?`<span style="color:var(--accent)">${window.t('正在输入…')}</span>`:escapeHtml(preview)}</div>
        </div>
        ${conv.unread>0?`<span class="conv-unread">${conv.unread}</span>`:''}
      `;
      list.appendChild(item);
    });
    updateBadges();
  }

  function updateBadges(){
    let totalMsg = 0;
    Object.values(engine.state.conversations).forEach(c=> totalMsg += c.unread);
    const badge = $('badge-messages');
    if(totalMsg > 0){
      badge.textContent = totalMsg;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
    // v0.0.15 结局图鉴/约会徽章
    updateEndingsBadge();
    updateDatesBadge();
    // v0.0.16 梦魇徽章
    updateDreamsBadge();
    // v0.1.0 存档徽章
    updateSavesBadge();
    // v0.7.3 语音信箱徽章（未听条数）
    updateVmBadges();
  }
  function updateDreamsBadge(){
    const b = $('badge-dreams');
    if(!b) return;
    if(!engine.state.nightmaresSeen) return;
    const seenCount = Object.keys(engine.state.nightmaresSeen).filter(k=>engine.state.nightmaresSeen[k]).length;
    if(seenCount > 0){
      b.textContent = seenCount;
      b.hidden = false;
    } else {
      b.hidden = true;
    }
    const counter = $('dreams-counter');
    const total = Object.keys(STORY.nightmares||{}).length;
    if(counter && total){
      counter.textContent = `${seenCount}/${total}`;
    }
  }
  function updateEndingsBadge(){
    const b = $('badge-endings');
    if(!b) return;
    const all = engine.getEndingGallery ? engine.getEndingGallery() : [];
    const seenCount = all.filter(e=>e.seen).length;
    if(seenCount > 0){
      b.textContent = seenCount;
      b.hidden = false;
    } else {
      b.hidden = true;
    }
    const counter = $('endings-counter');
    if(counter && all.length){
      counter.textContent = `${seenCount}/${all.length}`;
    }
  }
  function updateDatesBadge(){
    const b = $('badge-dates');
    if(!b) return;
    if(!engine.getDateStats) return;
    const stats = engine.getDateStats();
    const availableCount = stats.filter(s=>s.canDate && s.availableScenes.length > 0).length;
    if(availableCount > 0){
      b.textContent = availableCount;
      b.hidden = false;
    } else {
      b.hidden = true;
    }
  }

  // ===== 单个会话 =====
  function openConversation(convId){
    currentConvId = convId;
    const char = STORY.characters[convId];
    const conv = engine.state.conversations[convId];
    if(!char || !conv) return;
    $('chat-avatar').innerHTML = avatarImg(char);
    $('chat-avatar').style.background = char.bg;
    $('chat-name').textContent = window.t(char.name);
    $('chat-status').textContent = conv.typing ? window.t('正在输入…') : window.t('在线');
    renderChatBody(convId);
    engine.markRead(convId);
    updateBadges();
    // 关闭可能存在的旧选项栏
    $('chat-input-bar').hidden = true;
    showScreen('chat');
    // 如果有待处理选项，立即显示
    if(conv.pendingChoice){
      setUiTimeout(()=> showChatChoice(convId, conv.pendingChoice), 400);
    }
    setUiTimeout(()=>{
      const body = $('chat-body');
      body.scrollTop = body.scrollHeight;
    }, 50);
  }

  function renderChatBody(convId){
    const conv = engine.state.conversations[convId];
    const body = $('chat-body');
    body.innerHTML = '';
    conv.messages.forEach(m=> appendMessage(m));
    if(conv.typing){
      const t = document.createElement('div');
      t.className = 'typing-indicator';
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
    }
    body.scrollTop = body.scrollHeight;
  }

  function appendMessage(m){
    const body = $('chat-body');
    const div = document.createElement('div');
    const _t = window.t;  // v0.5.3（E4）：剧情文本英译出口
    if(m.from === 'me'){
      div.className = 'msg send';
      div.textContent = _t(m.text);
    } else if(m.from === 'narrator'){
      div.className = 'msg sys';
      div.textContent = _t(m.text);
    } else {
      div.className = 'msg recv' + (m.isFollowup ? ' is-followup' : '');
      div.textContent = _t(m.text);
    }
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = m.time || '';
    div.appendChild(time);
    body.appendChild(div);
  }

// v0.9.6：一键已读（缓解消息过载）
(function(){
  const btn = document.getElementById('mark-all-read');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const n = engine.markAllRead();
    if(typeof renderConversations === 'function') renderConversations();
    if(typeof toast === 'function') toast(n ? window.t('已全部标为已读') : window.t('没有未读消息'));
  });
})();


/* ===== ui/04_engine_events.js ===== */
const _t = (typeof window.t === 'function') ? window.t : (x => x);  // v0.5.3（E4）
/* ===== 霓虹心事 · UI：引擎事件订阅（消息送达、状态刷新、限时回复等） =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 引擎事件 =====
  engine.on('stateChange', ()=>{
    updateBadges();
    if(screens.messages.classList.contains('active')) renderConvList();
    updateMomentsBadge();
  });
  engine.on('timeChange', updateTimeDisplay);
  engine.on('conversationUpdate', ({id, conv})=>{
    updateBadges();
    if(screens.messages.classList.contains('active')) renderConvList();
    if(currentConvId === id && screens.chat.classList.contains('active')){
      renderChatBody(id);
      $('chat-status').textContent = conv.typing ? window.t('正在输入…') : window.t('在线');
    }
  });
  engine.on('messageReceived', ({from, text})=>{
    if(from === 'narrator'){
      // 旁白以 toast 展示
      toast(text);
      return;
    }
    showNotif(from, text);
  });

  // 选项触发：若玩家正在该会话则立即显示，否则 engine 已挂起 pendingChoice
  // v0.6.6（P1-4）：首支剧情曲解锁 → 引导去音乐 App / 开环境音乐（只提醒一次）
  engine.on('musicUnlocked', (m)=>{
    if(!engine.state.flags.music_guide_shown && m && m.title){
      engine.state.flags.music_guide_shown = true;
      setUiTimeout(()=>{
        toast(`🎧 已解锁 ${m.title}——去「音乐」App 听，或在设置开启环境音乐`);
      }, 1200);
    }
  });

  engine.on('choicePrompt', ({convId, choice, conv})=>{
    // v0.0.13 观赏模式：自动选择（用 engine._setTimeout 集中管理，读档/关闭时清理）
    if(engine.state.watchMode && choice.options && choice.options.length > 0 && !choice.isInvitation){
      const autoIdx = engine.pickAutoChoice(choice.options);
      const autoOpt = choice.options[autoIdx];
      const delay = STORY.watchMode?.autoAdvanceDelay || 1500;
      engine._setTimeout(()=>{
        // 二次校验：定时器触发时观赏模式仍开启才执行
        if(!engine.state.watchMode) return;
        if(conv){ conv.pendingChoice = null; }
        engine.sendMessage(convId, autoOpt.text, engine.normalizeOptionEffects(autoOpt));
        toast('🎬 ' + t('观赏自动选：{opt}', {opt: autoOpt.text}));
      }, delay);
      return;
    }
    if(convId === 'narrator'){
      // 旁白决策：直接弹模态框
      showNarratorChoice(choice);
    } else if(currentConvId === convId && screens.chat.classList.contains('active')){
      showChatChoice(convId, choice);
    } else {
      // 给个提示通知
      showNotif(convId, choice.prompt);
    }
  });

  function showNarratorChoice(choice){
    if(!choice || !Array.isArray(choice.options) || choice.options.length === 0) return;
    let modal = document.getElementById('narrator-choice-modal');
    if(modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'narrator-choice-modal';
    modal.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:160;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:32px;animation:screenIn .4s ease;';
    modal.innerHTML = `
      <div style="font-family:var(--serif);font-size:15px;color:var(--ink-dim);margin-bottom:20px;text-align:center;line-height:1.9;letter-spacing:0.05em;max-width:300px;">
        ${escapeHtml(_t(choice.prompt))}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
        ${choice.options.map((opt, i)=>`
          <button class="chat-opt" data-narrator-choice="${i}" style="padding:14px;">
            ${escapeHtml(_t(opt.text))}
            ${opt.hint?`<span style="color:var(--ink-mute);font-size:11px;display:block;margin-top:4px;">${escapeHtml(_t(opt.hint))}</span>`:''}
          </button>
        `).join('')}
      </div>
    `;
    document.getElementById('phone').appendChild(modal);
    modal.querySelectorAll('[data-narrator-choice]').forEach(btn=>{
      btn.onclick = (e)=>{
        e.stopPropagation();
        const idx = parseInt(btn.dataset.narratorChoice);
        const opt = choice.options[idx];
        modal.remove();
        engine.sendMessage('narrator', opt.text, opt.effects);
      };
    });
  }

  function showChatChoice(convId, choice){
    const bar = $('chat-input-bar');
    if(!choice || !Array.isArray(choice.options) || choice.options.length === 0){
      if(bar) bar.hidden = true;
      return;
    }
    if(bar) delete bar.dataset.answered;   // v0.8.6：新选择重置防重复标记
    $('chat-prompt').textContent = _t(choice.prompt);
    const opts = $('chat-options');
    const timeoutBar = $('chat-timeout-bar');
    const freeInput = $('chat-free-input');
    opts.innerHTML = '';
    // v0.8.1: 只清理当前会话的旧计时器；截止时间固定，切会话/重开只重建视图
    clearChatTimeout(convId);
    if(choice.timeout && !(choice.dueAt > 0)) choice.dueAt = Date.now() + choice.timeout * 1000;
    timeoutBar.hidden = true;
    freeInput.hidden = true;
    const expired = choice.timeout && choice.dueAt <= Date.now();

    // 自由输入模式
    if(choice.freeInput){
      opts.hidden = true;
      freeInput.hidden = false;
      const field = $('chat-free-input-field');
      field.value = '';
      field.placeholder = choice.freeInput.placeholder || '输入你想说的话…';
      field.focus();
      $('chat-free-input-field').dataset.convId = convId;
      $('chat-free-input-field').dataset.keywords = JSON.stringify(choice.freeInput.keywords || []);
      $('chat-free-input-field').dataset.defaultEffect = JSON.stringify(choice.freeInput.defaultEffect || {});
      // 限时
      if(choice.timeout){
        if(expired){ setUiTimeout(()=> handleFreeSend(true), 0); return; }
        startTimeout(convId, choice.dueAt, choice.timeout * 1000, ()=> handleFreeSend(true));
      }
      return;
    }

    // 普通选项模式
    opts.hidden = false;
    choice.options.forEach((opt)=>{
      const btn = document.createElement('button');
      btn.className = 'chat-opt';
      // v0.0.16: 当 showOptionHints 开启时，追加智能提示
      const smartHint = engine.getOptionHint(opt);
      const hintHtml = opt.hint ? ` <span style="color:var(--ink-mute);font-size:11px">(${escapeHtml(_t(opt.hint))})</span>` : '';
      const smartHintHtml = smartHint ? ` <span class="chat-opt-smart-hint">💡 ${escapeHtml(smartHint)}</span>` : '';
      btn.innerHTML = escapeHtml(opt.text) + hintHtml + smartHintHtml;
      btn.onclick = (e)=>{
        e.stopPropagation();
        // v0.8.6：防重复——点击后立即禁用全部选项按钮并清空容器，
        // 防止快速连点导致同一选择被发送多次（商业级测试发现的真 bug）
        if(bar.dataset.answered === '1') return;
        bar.dataset.answered = '1';
        [...bar.querySelectorAll('.chat-opt')].forEach(b => b.disabled = true);
        clearChatTimeout(convId);
        const conv = engine.state.conversations[convId];
        if(conv) conv.pendingChoice = null;
        engine.sendMessage(convId, opt.text, mergeOptionEffects(opt));
        bar.hidden = true;
        opts.innerHTML = '';
      };
      opts.appendChild(btn);
    });
    bar.hidden = false;

    // 限时回复
    if(choice.timeout){
      const applyDefault = ()=>{
        // 超时自动选择默认项（最后一个或标记为 default 的）
        const defaultIdx = choice.options.findIndex(o=>o.default) !== -1
          ? choice.options.findIndex(o=>o.default)
          : choice.options.length - 1;
        const opt = choice.options[defaultIdx];
        const conv = engine.state.conversations[convId];
        if(conv) conv.pendingChoice = null;
        engine.sendMessage(convId, opt.text, mergeOptionEffects(opt));
        bar.hidden = true;
        toast('（沉默）');
      };
      if(expired){ setUiTimeout(applyDefault, 0); return; }
      startTimeout(convId, choice.dueAt, choice.timeout * 1000, applyDefault);
    }
  }

  function startTimeout(convId, dueAt, totalMs, onTimeout){
    const bar = $('chat-timeout-bar');
    const fill = $('chat-timeout-fill');
    const text = $('chat-timeout-text');
    bar.hidden = false;
    bar.classList.remove('urgent');
    clearChatTimeout(convId);
    const item = {handle:null, dueAt, totalMs, onTimeout};
    chatTimeouts.set(convId, item);
    function tick(){
      const remain = Math.max(0, dueAt - Date.now());
      const pct = Math.min(100, (remain / Math.max(1, totalMs)) * 100);
      fill.style.width = pct + '%';
      text.textContent = Math.ceil(remain / 1000) + 's';
      if(remain < totalMs * 0.3) bar.classList.add('urgent');
      if(remain <= 0){
        chatTimeouts.delete(convId);
        if(timeoutTimer){ clearTimeout(timeoutTimer); timeoutTimer = null; }
        onTimeout();
        return;
      }
      item.handle = setUiTimeout(tick, 100);
      timeoutTimer = item.handle;
    }
    tick();
  }

  function safeJSON(str, fallback){
    try { return JSON.parse(str); } catch(e){ return fallback; }
  }
  function handleFreeSend(isTimeout){
    const field = $('chat-free-input-field');
    const text = field.value.trim();
    const convId = field.dataset.convId;
    if(!convId) return;
    const keywords = safeJSON(field.dataset.keywords || '[]', []);
    const defaultEffect = safeJSON(field.dataset.defaultEffect || '{}', {});
    const bar = $('chat-input-bar');
    clearChatTimeout(convId);
    const conv = engine.state.conversations[convId];
    if(conv) conv.pendingChoice = null;
    // 关键词匹配
    let matched = null;
    if(text){
      for(const kw of keywords){
        if(kw.words && kw.words.some(w=> text.includes(w))){
          matched = kw;
          break;
        }
      }
    }
    const finalText = text || '……';
    const finalEffects = matched ? {...(matched.effects||{})} : {...defaultEffect};
    engine.sendMessage(convId, finalText, finalEffects);
    bar.hidden = true;
    if(matched && matched.reply){
      setUiTimeout(()=> toast(matched.reply), 1200);
    }
  }

  function showTimeAdvanceOverlay(text){
    $('time-adv-text').textContent = text || '时间流逝…';
    $('time-adv').hidden = false;
  }
  engine.on('timeAdvance', ({text})=>{
    showTimeAdvanceOverlay(text);
  });
  engine.on('timeAdvanceEnd', ()=>{
    $('time-adv').hidden = true;
    updateTimeDisplay();
  });


/* ===== ui/05_calls.js ===== */
/* ===== 霓虹心事 · UI：来电 UI 与通话脚本 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 来电 =====
  function showIncomingCall({from, name, script, eventId}){
    AudioSys.play('ring');  // v0.1.7: 来电铃声
    const char = STORY.characters[from];
    $('call-name').textContent = window.t(name || char?.name || '');
    $('call-bg').style.background = `radial-gradient(ellipse at center, ${char?.bg || '#2a2f5a'}, #000)`;
    $('call-label').textContent = window.t('来电…');
    $('call-actions').hidden = false;
    $('call-timer').hidden = true;
    $('call-script').hidden = true;
    showScreen('incomingCall');
    window._currentCall = {from, name, script, eventId, step:0};
  }
  engine.on('incomingCall', (call)=>{
    showIncomingCall(call);
  });

  function handleCallAction(action){
    const call = window._currentCall;
    if(!call) return;
    if(action === 'accept'){
      engine.answerCall(call.eventId);
      $('call-actions').hidden = true;
      $('call-label').textContent = window.t('通话中');
      $('call-timer').hidden = false;
      $('call-script').hidden = false;
      engine.addCallLog(call.from, 'incoming', '03:24');
      runCallScript(call);
    } else if(action === 'decline'){
      engine.declineCall(call.eventId);
      window._currentCall = null;
      showScreen('home');
      toast('已挂断');
    }
  }

  function runCallScript(call){
    const scriptEl = $('call-script');
    scriptEl.innerHTML = '';
    call.step = 0;
    function nextStep(){
      if(call.step >= call.script.length){
        // 通话结束：触发后续事件（通过 engine 的 afterEvent 链）
        $('call-label').textContent = window.t('通话结束');
        const evt = engine.story.events[call.eventId];
        setUiTimeout(()=>{
          showScreen('home');
          window._currentCall = null;
          if(evt && evt.then) engine.scheduleEvent(evt.then);
        }, 1500);
        return;
      }
      const line = call.script[call.step];
      if(line.who === 'choice'){
        const choices = document.createElement('div');
        choices.className = 'choices';
        line.options.forEach((opt)=>{
          const btn = document.createElement('button');
          btn.textContent = opt.text;
          btn.onclick = (e)=>{
            e.stopPropagation();
            engine.applyEffects(mergeOptionEffects(opt));
            choices.remove();
            // 防御：then:0 视为"继续下一步"，避免无限循环
            call.step = (typeof opt.then === 'number' && opt.then > 0) ? opt.then : call.step + 1;
            nextStep();
          };
          choices.appendChild(btn);
        });
        scriptEl.appendChild(choices);
        scriptEl.scrollTop = scriptEl.scrollHeight;
      } else {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'line';
        const speaker = line.who === 'me' ? `<span class="you">${escapeHtml(window.t('你'))}：</span>` : `<span class="speaker">${escapeHtml(window.t(call.name))}：</span>`;
        lineDiv.innerHTML = speaker + escapeHtml(line.text);
        scriptEl.appendChild(lineDiv);
        scriptEl.scrollTop = scriptEl.scrollHeight;
        call.step++;
        setUiTimeout(nextStep, 1100);
      }
    }
    nextStep();
  }


/* ===== ui/06_album_calendar_music.js ===== */
/* ===== 霓虹心事 · UI：相册、日历、音乐 App =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 相册 =====
  function renderAlbum(){
    const grid = $('album-grid');
    grid.innerHTML = '';
    const allPhotos = Object.keys(STORY.photos);
    allPhotos.forEach(pid=>{
      const unlocked = engine.state.photos.find(p=>p.id===pid);
      const item = document.createElement('div');
      item.className = 'album-item' + (unlocked?'':' locked');
      item.dataset.photo = pid;
      if(unlocked){
        const p = STORY.photos[pid];
        item.innerHTML = `<img src="${photoSrc(p.art)}" alt="${escapeHtml(p.title)}" loading="lazy">`;
      } else {
        item.innerHTML = '?';
      }
      grid.appendChild(item);
    });
    const unlockedCount = allPhotos.filter(pid=>engine.state.photos.find(p=>p.id===pid)).length;
    if(allPhotos.length > 0 && unlockedCount === 0){
      const tip = document.createElement('div');
      tip.className = 'album-empty-hint';
      tip.style.cssText = 'grid-column:1/-1;color:var(--ink-mute);text-align:center;padding:4px 16px 20px;font-size:12px;line-height:1.8;';
      tip.textContent = window.t('还没有解锁照片——继续剧情、赴约或拍照后会出现。');
      grid.appendChild(tip);
    }
    if(allPhotos.length === 0){
      grid.innerHTML = '<div style="color:var(--ink-mute);text-align:center;padding:40px;grid-column:1/-1;">' + window.t('暂无照片') + '</div>';
    }
  }
  function viewPhoto(pid){
    const p = STORY.photos[pid];
    if(!p) return;
    const unlocked = engine.state.photos.find(x=>x.id===pid);
    if(!unlocked){ toast('照片未解锁'); return; }
    $('photo-bg').style.background = `linear-gradient(135deg, #1a0a2e, #0a0712)`;
    $('photo-art').innerHTML = `<img src="${photoSrc(p.art)}" alt="${escapeHtml(p.title)}">`;
    // 检查是否有回忆可触发
    const memId = engine.getMemoriesByPhoto(pid);
    const hasMemory = memId && !engine.state.resolvedMemories[memId];
    const memBtn = hasMemory
      ? `<button class="photo-memory-btn" data-memory="${escapeHtml(pid)}">✦ 回味这段回忆</button>`
      : (memId ? '<div class="photo-memory-done">回忆已回味</div>' : '');
    $('photo-caption').innerHTML = `<strong>${escapeHtml(p.title)}</strong><br>${escapeHtml(p.caption).replace(/\n/g,'<br>')}${memBtn}`;
    showScreen('photoView');
  }
  function photoSrc(type){
    return `assets/photos/${type}.jpg`;
  }

  // ===== 日历 =====
  function renderCalendar(){
    const t = engine.getTime();
    const d = engine.getDateLabel();
    $('cal-current').innerHTML = `
      <div class="cc-day">${d.date}</div>
      <div class="cc-month">${d.month}月</div>
      <div class="cc-weekday">${escapeHtml(window.t('星期' + d.weekday))}</div>
    `;
    const events = $('cal-events');
    events.innerHTML = '';
    const defaultEvents = [
      {time:'09:00', title:'美术馆报到', loc:'砚美术馆', day:2},
      {time:'10:00', title:'开幕式筹备', loc:'美术馆会议室', day:3},
      {time:'19:00', title:'开幕式', loc:'砚美术馆展厅', day:5},
      {time:'22:00', title:'雾港酒吧', loc:'巷子深处', day:2}
    ];
    const visible = defaultEvents.filter(e=>e.day <= t.day);
    if(visible.length === 0){
      events.innerHTML = '<div style="color:var(--ink-mute);text-align:center;padding:40px;">' + window.t('今日暂无日程') + '</div>';
      return;
    }
    visible.forEach(e=>{
      const div = document.createElement('div');
      div.className = 'cal-event' + (e.day < t.day ? ' past':'');
      div.innerHTML = `
        <div class="ce-time">${escapeHtml(e.time)}</div>
        <div class="ce-title">${escapeHtml(window.t(e.title))}</div>
        <div class="ce-loc">${escapeHtml(window.t(e.loc))}</div>
      `;
      events.appendChild(div);
    });
  }

  // ===== 音乐 =====
  // v0.1.7: 音效/环境音开关（设置持久化在 localStorage，由 audio.js 管理）
  function refreshSoundSettings(){
    const soundBtn = $('ss-sound'), bgmBtn = $('ss-bgm');
    if(soundBtn) soundBtn.textContent = AudioSys.isEnabled() ? window.t('🔊 音效：开') : window.t('🔇 音效：关');
    if(bgmBtn) bgmBtn.textContent = AudioSys.isBgmEnabled() ? window.t('🎵 环境音：开') : window.t('🎵 环境音：关');
  }
  function toggleSoundSetting(){
    AudioSys.setSound(!AudioSys.isEnabled());
    refreshSoundSettings();
  }
  function toggleBgmSetting(){
    AudioSys.setBgm(!AudioSys.isBgmEnabled());
    refreshSoundSettings();
  }
  function renderMusic(){
    const playlist = $('music-playlist');
    playlist.innerHTML = '';
    refreshSoundSettings();
    const unlocked = engine.state.music.unlocked;
    const playing = engine.state.music.playing;
    Object.entries(STORY.music).forEach(([id, m])=>{
      const isUnlocked = unlocked.includes(id);
      const isPlaying = playing === id;
      const item = document.createElement('div');
      item.className = 'music-item' + (isPlaying?' playing':'') + (isUnlocked?'':' locked');
      item.dataset.music = id;
      item.innerHTML = `
        <span class="mi-num">${isPlaying?'▶':(Object.keys(STORY.music).indexOf(id)+1)}</span>
        <span class="mi-title">${escapeHtml(m.title)}</span>
        <span class="mi-dur">${escapeHtml(m.duration)}</span>
      `;
      playlist.appendChild(item);
    });
    if(playing){
      const m = STORY.music[playing];
      $('np-title').textContent = m.title;
      $('np-artist').textContent = m.artist;
      $('np-art').classList.add('playing');
      $('np-art').textContent = '♪';
    } else {
      $('np-title').textContent = window.t('未播放');
      $('np-artist').textContent = '—';
      $('np-art').classList.remove('playing');
    }
  }


/* ===== ui/07_notes_logs_endings.js ===== */
/* ===== 霓虹心事 · UI：备忘录、通话记录、结局屏、路线选择 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 备忘录 =====
  function renderNotes(){
    const list = $('notes-list');
    list.innerHTML = '';
    if(engine.state.notes.length === 0){
      const notes = [
        {title:'入职第一天', preview:'1. 9点前到美术馆\n2. 找人事办手续\n3. 沈砚之——主理人，据说难搞', time:'7月16日'}
      ];
      notes.forEach(n=>{
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `
          <div class="ni-title">${escapeHtml(window.t(n.title))}</div>
          <div class="ni-preview">${nl2brEscaped(window.t(n.preview))}</div>
          <div class="ni-date">${escapeHtml(window.localizeDateLabel(n.time))}</div>
        `;
        list.appendChild(div);
      });
    } else {
      engine.state.notes.forEach(n=>{
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `
          <div class="ni-title">${escapeHtml(window.t(n.title))}</div>
          <div class="ni-preview">${nl2brEscaped(n.preview||'')}</div>
          <div class="ni-date">${escapeHtml(window.localizeDateLabel(n.time))}</div>
        `;
        list.appendChild(div);
      });
    }
  }

  // ===== 通话记录 =====
  function renderCallLog(){
    const list = $('call-list');
    list.innerHTML = '';
    if(engine.state.callLog.length === 0){
      list.innerHTML = '<div style="color:var(--ink-mute);text-align:center;padding:40px;">' + window.t('暂无通话记录') + '</div>';
      return;
    }
    engine.state.callLog.forEach(c=>{
      const char = STORY.characters[c.from];
      const div = document.createElement('div');
      div.className = 'call-item';
      const typeText = c.type==='incoming'?'已接来电':c.type==='missed'?'未接来电':'已拨出';
      div.innerHTML = `
        <div class="call-avatar" style="background:${char?.bg||'#2a2f5a'}">${avatarImg(char)}</div>
        <div class="call-info">
          <div class="call-name">${escapeHtml(window.t(c.name))}</div>
          <div class="call-meta">${escapeHtml(typeText)} · ${escapeHtml(c.duration)}</div>
        </div>
        <div class="call-type ${escapeHtml(c.type)}">${escapeHtml(c.time)}</div>
      `;
      list.appendChild(div);
    });
  }

  // ===== 结局 =====
  // v0.5.2（E5）：结局 → CG 映射（线隐藏/普通结局挂对应男主 CG，真结局/独行隐藏挂专属）
  const ENDING_CG = {
    shenyan_hidden:'cg_shenyan_confess', shenyan_good:'cg_shenyan_confess', shenyan_normal:'cg_shenyan_confess', shenyan_bad:'cg_shenyan_confess',
    luci_hidden:'cg_luci_confess', luci_good:'cg_luci_confess', luci_normal:'cg_luci_confess', luci_bad:'cg_luci_confess',
    jiangyu_hidden:'cg_jiangyu_confess', jiangyu_good:'cg_jiangyu_confess', jiangyu_normal:'cg_jiangyu_confess', jiangyu_bad:'cg_jiangyu_confess',
    true_ending:'cg_true_ending', solo_hidden:'cg_true_ending', solo_good:'cg_rooftop_night',
    solo_normal:'cg_rooftop_night', solo_bad:'cg_nightmare_stage',
  };
  engine.on('ending', (ending)=>{
    const _t = window.t;  // v0.5.3（E4）
    $('ending-tag').textContent = ending.tag || 'END';
    $('ending-title').textContent = _t(ending.title) || '';
    $('ending-text').textContent = _t(ending.text) || '';
    const cg = ENDING_CG[ending.id || ''];
    $('ending-cg').src = cg ? `assets/cg/${cg}.jpg` : '';
    $('ending-cg').hidden = !cg;
    $('ending-bg').style.background = 'linear-gradient(135deg, #1a0a2e, #0a0712)';
    showScreen('ending');
  });

  // ===== 路线选择 =====
  engine.on('routeChoiceReady', (routeChoice)=>{
    if(currentNightmare || engine.state.activeNightmare){
      return;
    }
    showRouteChoiceModal(routeChoice);
  });

  function showRouteChoiceModal(routeChoice){
    // 先回主屏
    showScreen('home');
    const home = $('home-screen');
    let modal = document.getElementById('route-choice-modal');
    if(modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'route-choice-modal';
    modal.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:160;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:32px;animation:screenIn .4s ease;';
    modal.innerHTML = `
      <div style="font-family:var(--serif);font-size:17px;color:var(--ink-dim);margin-bottom:24px;text-align:center;line-height:1.9;letter-spacing:0.05em;">
        ${escapeHtml(routeChoice.prompt)}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
        ${routeChoice.options.map((opt)=>`
          <button class="chat-opt" data-route="${opt.route}" style="padding:14px;">
            ${escapeHtml(opt.text)}
            <span style="color:var(--ink-mute);font-size:11px;display:block;margin-top:4px;">${escapeHtml(opt.hint)}</span>
          </button>
        `).join('')}
      </div>
    `;
    home.appendChild(modal);
  }

  function handleRouteChoice(route){
    const modal = document.getElementById('route-choice-modal');
    if(modal) modal.remove();
    const opt = STORY.routeChoice.options.find(o=>o.route===route);
    if(!opt) return;
    engine.chooseRoute(route);
    toast(t('进入{char}线', {char: window.t(STORY.characters[route]?.name || '真结局')}));
  }


/* ===== ui/08_moments.js ===== */
/* ===== 霓虹心事 · UI：朋友圈 App =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 朋友圈 =====
  function renderMoments(){
    const list = $('moments-list');
    list.innerHTML = '';
    if(engine.state.moments.length === 0){
      list.innerHTML = '<div class="moments-empty">' + window.t('还没有动态') + '<br>' + window.t('点击右上角') + ' 📷 ' + window.t('发一条') + '</div>';
      return;
    }
    engine.state.moments.forEach(m=>{
      const inter = engine.state.momentInteractions[m.id] || {};
      const item = document.createElement('div');
      item.className = 'moment-item';
      item.dataset.momentId = m.id;
      const safeMomentId = escapeHtml(m.id);
      // 点赞列表
      const likeNames = m.likes.map(l=>{
        if(l === 'me') return window.t('我');
        const c = STORY.characters[l];
        return c ? window.t(c.name) : window.t(l);
      }).join('、');
      // 评论列表
      const commentsHtml = m.comments.map(c=>{
        const char = STORY.characters[c.from];
        const name = c.from === 'me' ? window.t('我') : (char ? window.t(char.name) : window.t(c.from));
        return `<div class="moment-comment ${c.from==='me'?'me':''} ${c.isReply?'reply':''}">
          <span class="mc-name">${escapeHtml(name)}</span>${escapeHtml(c.text)}
        </div>`;
      }).join('');
      // 评论选项
      let commentOptsHtml = '';
      if(m.commentOptions && !inter.commented){
        commentOptsHtml = `<div class="moment-comment-options" id="opts-${safeMomentId}" hidden>
          ${m.commentOptions.map((opt,i)=>`<button class="moment-comment-opt" data-moment-comment-opt="${safeMomentId}" data-opt-idx="${i}">${escapeHtml(opt.text)}</button>`).join('')}
        </div>`;
      }
      // v0.0.16: 男主朋友圈互动评论 + 回复选项
      const charCommentsHtml = (m.charComments || []).map(cc => {
        const char = STORY.characters[cc.charId];
        const charName = char ? window.t(char.name) : window.t(cc.charId);
        const replyKey = `${m.id}_${cc.charId}`;
        const sentReply = engine.state.momentReplies?.[replyKey];
        const comment = cc.comment;
        let replyOptsHtml = '';
        if(comment.replyOptions && !sentReply){
          replyOptsHtml = '<div class="moment-reply-options">';
          comment.replyOptions.forEach((rp, ri) => {
            replyOptsHtml += `<button class="moment-reply-opt" data-moment-reply="${safeMomentId}|${escapeHtml(cc.charId)}|${cc.commentIdx}|${ri}">${escapeHtml(rp.text)}</button>`;
          });
          replyOptsHtml += '</div>';
        } else if(sentReply){
          const sent = comment.replyOptions?.[sentReply.replyIdx];
          replyOptsHtml = `<div class="moment-reply-options"><span class="moment-reply-opt sent">已回复：${escapeHtml(sent?.text || '')}</span></div>`;
        }
        return `<div class="moment-char-comment">
          <span class="moment-char-comment-name">${escapeHtml(charName)}：</span>
          <span class="moment-char-comment-text">${escapeHtml(comment.text)}</span>
          ${replyOptsHtml}
        </div>`;
      }).join('');
      const charCommentsBlock = charCommentsHtml ? `<div class="moment-char-comments">${charCommentsHtml}</div>` : '';
      item.innerHTML = `
        <div class="moment-top">
          <div class="moment-avatar" style="background:${escapeHtml(m.bg)}">${avatarImg(m)}</div>
          <div class="moment-body">
            <div class="moment-name">${escapeHtml(window.t(m.name))}</div>
            <div class="moment-text">${nl2brEscaped(m.text)}</div>
            ${m.art ? `<div class="moment-art">${getMomentArt(m.art)}</div>` : ''}
            <div class="moment-meta">
              <span>${escapeHtml(window.localizeDateLabel(m.dateLabel))} ${escapeHtml(m.time)}</span>
              <div class="moment-actions">
                <button class="moment-act-btn ${inter.liked?'liked':''}" data-moment-like="${safeMomentId}" ${inter.liked?'disabled':''}>
                  ${inter.liked?'♥':'♡'} ${m.likes.length}
                </button>
                ${m.commentOptions && !inter.commented ? `<button class="moment-act-btn" data-moment-comment="${safeMomentId}">💬 评论</button>` : ''}
              </div>
            </div>
            ${likeNames ? `<div class="moment-likes">♥ ${escapeHtml(likeNames)}</div>` : ''}
            ${commentsHtml ? `<div class="moment-comments">${commentsHtml}</div>` : ''}
            ${charCommentsBlock}
            ${commentOptsHtml}
          </div>
        </div>
      `;
      list.appendChild(item);
    });
    updateMomentsBadge();
  }
  function getMomentArt(type){
    // 复用相册的 SVG art
    const arts = {
      city:`<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#0a0712"/>
        <rect x="10" y="60" width="20" height="90" fill="#1a1f3a"/>
        <rect x="35" y="40" width="25" height="110" fill="#2a1f4a"/>
        <rect x="65" y="25" width="30" height="125" fill="#1a2f4a"/>
        <rect x="100" y="50" width="22" height="100" fill="#2a1f3a"/>
        <rect x="125" y="30" width="28" height="120" fill="#1a1f4a"/>
        <rect x="158" y="55" width="18" height="95" fill="#2a2f4a"/>
        <g fill="#ff5fa8"><rect x="15" y="70" width="2" height="2"/><rect x="22" y="80" width="2" height="2"/></g>
        <g fill="#7a5cff"><rect x="40" y="50" width="2" height="2"/><rect x="48" y="65" width="2" height="2"/></g>
        <g fill="#39d6ff"><rect x="70" y="35" width="2" height="2"/><rect x="80" y="50" width="2" height="2"/></g>
      </svg>`,
      gallery:`<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#1a0a2e"/>
        <rect x="20" y="20" width="160" height="100" fill="#2a1f3a" rx="2"/>
        <rect x="30" y="30" width="60" height="80" fill="#0a0712"/>
        <rect x="100" y="30" width="70" height="50" fill="#1a1420"/>
        <rect x="100" y="85" width="70" height="25" fill="#15101f"/>
        <g fill="#ff5fa8"><rect x="35" y="35" width="3" height="3"/><rect x="45" y="50" width="3" height="3"/></g>
        <g fill="#7a5cff"><rect x="105" y="35" width="3" height="3"/><rect x="115" y="50" width="3" height="3"/></g>
      </svg>`
    };
    return arts[type] || '';
  }
  function updateMomentsBadge(){
    // 朋友圈新动态（未互动的）
    const uninteracted = engine.state.moments.filter(m=>{
      if(m.isMine) return false;
      const inter = engine.state.momentInteractions[m.id] || {};
      return !inter.liked && !inter.commented;
    }).length;
    const badge = $('badge-moments');
    if(uninteracted > 0){
      badge.textContent = uninteracted;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }
  function toggleCommentOptions(momentId){
    const opts = document.getElementById('opts-' + momentId);
    if(opts) opts.hidden = !opts.hidden;
  }
  // 发朋友圈
  function openPostMoment(){
    $('post-moment-text').value = '';
    selectedMomentArt = '';
    document.querySelectorAll('.pm-art-opt').forEach(b=>b.classList.remove('selected'));
    showScreen('postMoment');
  }
  function selectMomentArt(btn){
    document.querySelectorAll('.pm-art-opt').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMomentArt = btn.dataset.momentArt;
  }
  function publishMoment(){
    const text = $('post-moment-text').value.trim();
    if(!text){ toast('写点什么吧'); return; }
    const id = engine.createMyMoment(text, selectedMomentArt || null);
    // v0.0.16: 触发男主朋友圈互动评论
    const moment = engine.state.moments.find(m => m.id === id);
    if(moment) engine.generateMomentComments(moment);
    toast('已发表');
    renderMoments();
    showScreen('moments');
  }
  // 朋友圈事件
  engine.on('momentPosted', (payload)=>{
    const moment = payload && payload.moment ? payload.moment : payload;
    if(!moment) return;
    if(moment.author !== 'me'){
      showNotif(moment.author, '发了新动态：' + String(moment.text || '').slice(0,20) + '…');
    }
    updateMomentsBadge();
  });
  engine.on('momentUpdate', ()=>{
    if(screens.moments.classList.contains('active')) renderMoments();
  });


/* ===== ui/09_dreams_memories_intel.js ===== */
/* ===== 霓虹心事 · UI：梦境、偶遇、回忆杀、苏苏情报、性格画像 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 梦境 =====
  function openDreamScreen(dreamId, dream){
    if(!dream) return;
    $('dream-title').textContent = dream.title;
    $('dream-desc').textContent = dream.desc;
    const opts = $('dream-options');
    opts.innerHTML = '';
    dream.options.forEach((opt, i)=>{
      const btn = document.createElement('button');
      btn.className = 'dream-opt';
      btn.textContent = opt.text;
      btn.dataset.dreamOpt = dreamId;
      btn.dataset.optIdx = i;
      opts.appendChild(btn);
    });
    showScreen('dream');
  }
  engine.on('dreamStart', ({dreamId, dream})=>{
    openDreamScreen(dreamId, dream);
  });
  engine.on('dreamResolved', ({choice})=>{
    setUiTimeout(()=>{
      if(choice.shard) toast('✦ ' + t('获得记忆碎片：{shard}', {shard: choice.shard}));
    }, 500);
    // 碎片提示后回到主屏（若 timeAdvance 随后触发会自动覆盖）
    setUiTimeout(()=>{
      if(screens.dream.classList.contains('active')) showScreen('home');
    }, 1800);
  });

  // ===== 偶遇 =====
  engine.on('encounterTriggered', ({locId, enc})=>{
    showEncounter(enc);
  });
  engine.on('encounterEmpty', ()=>{
    toast('这里暂时没有新发现…');
  });

  // ===== 回忆杀 =====
  engine.on('memoryStart', ({memId, mem})=>{
    // 复用偶遇屏显示回忆
    showEncounter({
      id: memId,
      title: mem.title,
      desc: mem.desc,
      choice: { prompt:'', options: mem.options },
      isMemory: true,
      char: 'narrator'
    });
  });
  engine.on('memoryResolved', ({opt})=>{
    setUiTimeout(()=>{
      if(opt.shard) toast('✦ ' + t('获得回忆碎片：{shard}', {shard: opt.shard}));
    }, 300);
    setUiTimeout(()=>{
      if(screens.encounter.classList.contains('active')) showScreen('album');
    }, 1500);
  });

  // ===== 苏苏情报 =====
  engine.on('intelReceived', ({id, intel})=>{
    toast('📨 苏苏发来一条情报');
  });

  // ===== 性格画像 =====
  function renderProfile(){
    const content = $('profile-content');
    const profile = engine.getPersonalityProfile();
    const p = engine.state.personality;
    if(profile.shards === 0 && p.active + p.passive + p.emotional + p.rational === 0){
      const invHtml = renderInvitationsList();
      content.innerHTML = '<div class="profile-empty">' + window.t('梦境尚未开始') + '<br>' + window.t('你的画像正在形成中…') + '</div>' + (invHtml || '');
      return;
    }
    let html = '<div class="profile-hero"><div class="profile-hero-title">林夏</div><div class="profile-hero-sub">已收集 ' + profile.shards + ' 个记忆碎片</div></div>';
    // 三维画像
    const dims = [
      {label:'行动力', a:'active', b:'passive', aLabel:'主动', bLabel:'被动'},
      {label:'决策方式', a:'rational', b:'emotional', aLabel:'理性', bLabel:'感性'},
      {label:'依赖度', a:'independent', b:'dependent', aLabel:'独立', bLabel:'依赖'}
    ];
    dims.forEach(d=>{
      const aVal = p[d.a], bVal = p[d.b];
      const total = aVal + bVal;
      const aPct = total > 0 ? (aVal / total) * 100 : 50;
      const bPct = total > 0 ? (bVal / total) * 100 : 50;
      const value = aVal > bVal ? d.aLabel + '型' : (bVal > aVal ? d.bLabel + '型' : '平衡型');
      html += `<div class="profile-trait">
        <div class="profile-trait-dim">${d.label}</div>
        <div class="profile-trait-value">${value}</div>
        <div class="profile-trait-bar">
          <div class="profile-trait-fill ${d.a}" style="width:${aPct}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:11px;color:var(--ink-mute)">
          <span>${d.aLabel} ${aVal}</span><span>${d.bLabel} ${bVal}</span>
        </div>
      </div>`;
    });
    // 记忆碎片
    if(profile.shardDetails.length > 0){
      html += '<div class="profile-shards"><div class="profile-shards-title">记忆碎片</div>';
      profile.shardDetails.forEach(s=>{
        html += `<div class="profile-shard">
          <div class="profile-shard-title">✦ ${escapeHtml(s.shard || s.title)}</div>
          ${s.meaning ? `<div class="profile-shard-meaning">${escapeHtml(s.meaning)}</div>` : ''}
        </div>`;
      });
      html += '</div>';
    }
    // 回忆碎片
    if(profile.memoryShards && profile.memoryShards.length > 0){
      html += '<div class="profile-shards"><div class="profile-shards-title">回忆碎片</div>';
      profile.memoryShards.forEach(s=>{
        html += `<div class="profile-shard">
          <div class="profile-shard-title">✦ ${escapeHtml(s.shard || s.title)}</div>
          ${s.meaning ? `<div class="profile-shard-meaning">${escapeHtml(s.meaning)}</div>` : ''}
        </div>`;
      });
      html += '</div>';
    }
    // 邀约列表
    const invHtml = renderInvitationsList();
    if(invHtml) html += invHtml;
    content.innerHTML = html;
  }

  // 邀约列表渲染（嵌入性格画像App）
  function renderInvitationsList(){
    if(!STORY.invitations) return '';
    const entries = Object.entries(STORY.invitations);
    if(entries.length === 0) return '';
    let html = '<div class="profile-shards"><div class="profile-shards-title">' + window.t('邀约记录') + '</div>';
    entries.forEach(([id, inv])=>{
      const char = STORY.characters[inv.from] || {name:'?'};
      const resolved = engine.state.resolvedInvitations[id];
      const pending = engine.state.invitations.find(p=>p.id===id && p.status==='pending');
      let status = window.t('未触发'), cls = 'inv-pending';
      if(resolved === 'accepted'){ status = window.t('已赴约'); cls = 'inv-accepted'; }
      else if(resolved === 'declined'){ status = window.t('已拒绝'); cls = 'inv-declined'; }
      else if(resolved === 'missed'){ status = window.t('已错过'); cls = 'inv-missed'; }
      else if(pending){ status = window.t('待回复') + ' · ' + (inv.schedule || ''); cls = 'inv-active'; }
      else { status = window.t('尚未达成'); cls = 'inv-locked'; }
      html += `<div class="profile-shard ${cls}">
        <div class="profile-shard-title">${escapeHtml(char.avatar)} ${escapeHtml(window.t(char.name))} · ${escapeHtml(window.t(inv.schedule||'邀约'))}</div>
        <div class="profile-shard-meaning">${escapeHtml(window.t(inv.text))}</div>
        <div style="margin-top:4px;font-size:11px;color:var(--ink-mute)">状态：${escapeHtml(status)}</div>
      </div>`;
    });
    html += '</div>';
    return html;
  }


/* ===== ui/10_voicemail_groups.js ===== */
/* ===== 霓虹心事 · UI：语音信箱与多人聊天群 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 语音信箱（v0.7.3 深化：未听计数/筛选、详情抽屉、波形播放）=====
  // 通关一次后这里会攒下 6 条以上留言，成了常驻功能；此前只有「一行摘要 + 播放/回拨」，
  // 且整条 item 是点击死区（样式写了 cursor:pointer 却没绑事件）。本版重做。
  //
  // v0.7.3：剧情文本英译出口——此前留言正文直接 escapeHtml 输出，英文模式下显示中文原文。
  const VMT = (text, vars) => (typeof window.t === 'function')
    ? window.t(text, vars)
    : (vars ? String(text).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : text);

  let vmFilter = 'all';     // 列表筛选：'all' 全部 | 'unheard' 未听
  let vmOpenId = null;      // 详情抽屉当前展示的留言 id
  let vmPlay = null;        // 播放状态 {id, total, elapsed, paused, stopTick}；纯 UI 态，不入存档

  // 秒 → m:ss
  function fmtVmTime(sec){
    const s = Math.max(0, Math.round(sec));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  // 稳定伪随机波形：以留言 id 作种子，保证同一条每次打开高度一致，不会闪
  function vmWaveHeights(id, count){
    let h = 2166136261;
    const src = String(id);
    for(let i = 0; i < src.length; i++) h = ((h ^ src.charCodeAt(i)) * 16777619) >>> 0;
    const out = [];
    for(let i = 0; i < count; i++){
      h = (h * 1103515245 + 12345) >>> 0;
      out.push(28 + ((h >>> 16) % 73));   // 28%~100%
    }
    return out;
  }
  // 100ms 节拍定时器：返回停止函数。走 setUiTimeout 以便随 resetTransientUi 统一清理
  function setUiInterval(fn, ms){
    let stopped = false;
    const tick = ()=>{
      if(stopped) return;
      fn();
      if(!stopped) setUiTimeout(tick, ms);
    };
    setUiTimeout(tick, ms);
    return ()=>{ stopped = true; };
  }
  function vmById(vmId){
    return (engine.state.voicemails || []).find(v => v.id === vmId) || null;
  }
  // 留言的展示形态：时长以原文为准（数据源），正文按当前语言显示。
  // 注意顺序——剧情翻译包的 key 是「含前缀的完整原文」（如「（语音信箱 6"）：……霓城没雾。」），
  // 所以必须先整条翻译再剥前缀；反过来先剥前缀就永远查不到译文（v0.7.3 实测踩到）。
  function vmDisplay(vm){
    const src = engine.voicemailMeta(vm.text);
    const localized = engine.voicemailMeta(VMT(vm.text));
    return {durationSec: src.durationSec, body: localized.body || src.body};
  }
  function vmUnreadCount(){
    return (engine.state.voicemails || []).filter(vm => !vm.heard).length;
  }

  function renderVoicemails(){
    const list = $('voicemail-list');
    if(!list) return;
    list.innerHTML = '';
    const all = engine.state.voicemails || [];
    const unheard = all.filter(vm => !vm.heard);
    const shown = vmFilter === 'unheard' ? unheard : all;

    // index.html 里的中文只是首屏占位，这里按当前语言刷一遍，保证英文模式下新 UI 也是英文
    const vmTab = document.querySelector('[data-phone-tab="voicemail"]');
    if(vmTab){
      const dot = vmTab.querySelector('.tab-dot');
      vmTab.textContent = VMT('语音信箱');
      if(dot) vmTab.appendChild(dot);
    }
    document.querySelectorAll('[data-vm-filter]').forEach(b=>{
      b.textContent = VMT(b.dataset.vmFilter === 'all' ? '全部' : '未听');
    });
    const readAllBtn = $('vm-read-all');
    if(readAllBtn) readAllBtn.textContent = VMT('全部标为已听');

    const hint = $('vm-filter-hint');
    if(hint) hint.textContent = all.length === 0 ? '' : VMT('共 {n} 条 · 未听 {m}', {n: all.length, m: unheard.length});
    if(readAllBtn) readAllBtn.disabled = unheard.length === 0;

    if(shown.length === 0){
      const title = all.length === 0 ? '还没有留言' : '没有未听的留言';
      const sub = all.length === 0 ? '电话打来却没接的时候，对方会在这里留下几秒钟的话。' : '所有留言都听过了。';
      list.innerHTML = `<div class="vm-empty">${escapeHtml(VMT(title))}<span class="vm-empty-sub">${escapeHtml(VMT(sub))}</span></div>`;
      updateVmBadges();
      return;
    }
    shown.forEach(vm => list.appendChild(vmListItem(vm)));
    updateVmBadges();
  }

  function vmListItem(vm){
    const char = STORY.characters[vm.from] || {name:'未知', avatar:'?', bg:'#3a3a5a'};
    const meta = vmDisplay(vm);
    const isPlaying = !!(vmPlay && vmPlay.id === vm.id && !vmPlay.paused);
    const item = document.createElement('div');
    item.className = 'voicemail-item' + (vm.heard ? '' : ' unheard') + (isPlaying ? ' playing' : '');
    item.dataset.vmOpen = vm.id;   // v0.7.3：修复——此前整条无事件，只有两个小按钮可点
    item.innerHTML = `
      <div class="vm-icon">${avatarImg(char)}</div>
      <div class="vm-info">
        <div class="vm-top">
          <span class="vm-name">${escapeHtml(VMT(char.name))}</span>
          ${vm.heard ? '' : '<span class="vm-new-dot"></span>'}
          <span class="vm-dur">${escapeHtml(fmtVmTime(meta.durationSec))}</span>
        </div>
        <div class="vm-text">${escapeHtml(meta.body)}</div>
        <div class="vm-meta">${escapeHtml(VMT('第 {day} 天', {day: vm.day}))} ${escapeHtml(vm.time)}</div>
      </div>
      <button class="vm-play-btn" data-vm-toggle="${escapeHtml(vm.id)}" aria-label="${escapeHtml(VMT('播放留言'))}">${isPlaying ? '❙❙' : '▶'}</button>
    `;
    return item;
  }

  // App 徽标 + tab 红点：挂进 updateBadges 统一入口，读档/开局/收到新留言都能刷新
  function updateVmBadges(){
    const n = vmUnreadCount();
    const dot = $('phone-vm-dot');
    if(dot) dot.hidden = n === 0;
    const badge = $('badge-phone');
    if(!badge) return;
    if(n > 0){ badge.textContent = String(n); badge.hidden = false; }
    else { badge.hidden = true; }
  }

  // ===== 播放控制 =====
  function toggleVmPlay(vmId){
    if(vmPlay && vmPlay.id === vmId){
      if(vmPlay.paused) resumeVmPlayback();
      else pauseVmPlayback();
      return;
    }
    startVmPlayback(vmId);
  }
  function startVmPlayback(vmId){
    const vm = vmById(vmId);
    if(!vm) return;
    stopVmPlayback();
    const total = engine.voicemailMeta(vm.text).durationSec;
    // 起播即标记已听：与旧版一致（点过播放就算听过），并触发「留言录音」收集品
    engine.playVoicemail(vmId);
    AudioSys.play('vmStart');
    AudioSys.startVoicemail(vm.from);
    vmPlay = {id: vmId, total, elapsed: 0, paused: false, stopTick: null};
    vmPlay.stopTick = setUiInterval(vmTick, 100);
    renderVoicemails();                          // 未听 → 已听
    if(vmOpenId === vmId) openVmDetail(vmId);    // 详情内的按钮/已听态同步重绘
    updateVmPlayUi();
  }
  function pauseVmPlayback(){
    if(!vmPlay || vmPlay.paused) return;
    vmPlay.paused = true;
    AudioSys.stopVoicemail();
    updateVmPlayUi();
  }
  function resumeVmPlayback(){
    if(!vmPlay || !vmPlay.paused) return;
    const vm = vmById(vmPlay.id);
    vmPlay.paused = false;
    AudioSys.startVoicemail(vm ? vm.from : null);
    updateVmPlayUi();
  }
  function stopVmPlayback(){
    if(!vmPlay) return;
    if(vmPlay.stopTick) vmPlay.stopTick();
    vmPlay = null;
    AudioSys.stopVoicemail();
    updateVmPlayUi();
  }
  function finishVmPlayback(){
    if(!vmPlay) return;
    const id = vmPlay.id;
    stopVmPlayback();
    AudioSys.play('vmEnd');
    renderVoicemails();
    if(vmOpenId === id) openVmDetail(id);
  }
  function vmTick(){
    if(!vmPlay || vmPlay.paused) return;
    vmPlay.elapsed = Math.min(vmPlay.total, vmPlay.elapsed + 0.1);
    if(vmPlay.elapsed >= vmPlay.total){ finishVmPlayback(); return; }
    updateVmPlayUi();
  }
  // 拖动进度条跳转：保持当前播放/暂停态，暂停时拖动不自动续播
  function seekVmByEvent(e){
    if(!vmPlay) return;
    const bar = $('vm-progress');
    if(!bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    vmPlay.elapsed = vmPlay.total * ratio;
    updateVmPlayUi();
  }

  // 只更新 DOM 上的播放态（不整体重渲染，避免把正在播放的节点换掉）
  function updateVmPlayUi(){
    const playing = !!(vmPlay && !vmPlay.paused);
    const toggle = document.querySelector('.vm-play-toggle');
    if(toggle) toggle.textContent = playing ? '❙❙' : '▶';
    const elapsedEl = $('vm-elapsed');
    if(elapsedEl) elapsedEl.textContent = vmPlay ? fmtVmTime(vmPlay.elapsed) : '0:00';
    renderVmProgress();
    document.querySelectorAll('.voicemail-item').forEach(el=>{
      const isPlaying = !!(vmPlay && vmPlay.id === el.dataset.vmOpen && !vmPlay.paused);
      el.classList.toggle('playing', isPlaying);
      const btn = el.querySelector('.vm-play-btn');
      if(btn) btn.textContent = isPlaying ? '❙❙' : '▶';
    });
  }
  function renderVmProgress(){
    const fill = $('vm-progress-fill'), knob = $('vm-progress-knob');
    const ratio = (vmPlay && vmPlay.total > 0) ? Math.min(1, vmPlay.elapsed / vmPlay.total) : 0;
    if(fill) fill.style.width = (ratio * 100) + '%';
    if(knob) knob.style.left = (ratio * 100) + '%';
    const bars = document.querySelectorAll('#vm-wave .vm-wave-bar');
    const lit = Math.round(ratio * bars.length);
    const playing = !!(vmPlay && !vmPlay.paused);
    bars.forEach((b, i)=>{
      b.classList.toggle('played', i < lit);
      b.classList.toggle('head', playing && i === lit - 1);
    });
  }
  function buildVmWave(vmId){
    const wave = $('vm-wave');
    if(!wave) return;
    wave.innerHTML = '';
    vmWaveHeights(vmId, 34).forEach(h=>{
      const bar = document.createElement('span');
      bar.className = 'vm-wave-bar';
      bar.style.height = h + '%';
      wave.appendChild(bar);
    });
  }

  // ===== 详情抽屉 =====
  function openVmDetail(vmId){
    const vm = vmById(vmId);
    if(!vm) return;
    vmOpenId = vmId;
    const char = STORY.characters[vm.from] || {name:'未知', avatar:'?'};
    const meta = vmDisplay(vm);
    const overlay = $('vm-overlay');
    if(!overlay) return;
    overlay.innerHTML = `
      <div class="vm-sheet">
        <div class="vm-sheet-head">
          <div class="vm-sheet-avatar">${avatarImg(char)}</div>
          <div>
            <div class="vm-sheet-title">${escapeHtml(VMT(char.name))}</div>
            <div class="vm-sheet-sub">${escapeHtml(VMT('第 {day} 天', {day: vm.day}))} ${escapeHtml(vm.time)} · ${escapeHtml(fmtVmTime(meta.durationSec))}</div>
          </div>
          <button class="vm-sheet-close" data-vm-close aria-label="${escapeHtml(VMT('关闭'))}">×</button>
        </div>
        <div class="vm-player">
          <div class="vm-wave" id="vm-wave"></div>
          <div class="vm-progress" id="vm-progress" role="slider" aria-label="${escapeHtml(VMT('播放进度'))}">
            <div class="vm-progress-track"></div>
            <div class="vm-progress-fill" id="vm-progress-fill"></div>
            <div class="vm-progress-knob" id="vm-progress-knob"></div>
          </div>
          <div class="vm-player-row">
            <button class="vm-play-toggle" data-vm-toggle="${escapeHtml(vm.id)}" aria-label="${escapeHtml(VMT('播放留言'))}">▶</button>
            <span class="vm-time" id="vm-elapsed">0:00</span>
            <span class="vm-time total" id="vm-total">${escapeHtml(fmtVmTime(meta.durationSec))}</span>
          </div>
        </div>
        <div class="vm-body">${escapeHtml(meta.body)}</div>
        <div class="vm-sheet-actions">
          ${vm.callbackEvent ? `<button class="vm-sheet-btn primary" data-vm-callback="${escapeHtml(vm.id)}">${escapeHtml(VMT('回拨'))}</button>` : ''}
          <button class="vm-sheet-btn" data-vm-read="${escapeHtml(vm.id)}"${vm.heard ? ' disabled' : ''}>${escapeHtml(VMT(vm.heard ? '已听完' : '标记已听'))}</button>
          <button class="vm-sheet-btn danger" data-vm-del="${escapeHtml(vm.id)}">${escapeHtml(VMT('删除'))}</button>
        </div>
      </div>
    `;
    overlay.hidden = false;
    buildVmWave(vm.id);
    const progress = $('vm-progress');
    if(progress) progress.addEventListener('click', seekVmByEvent);
    updateVmPlayUi();
  }
  function closeVmDetail(){
    stopVmPlayback();      // 关抽屉即停，避免合上面板后声音还在走
    vmOpenId = null;
    const overlay = $('vm-overlay');
    if(!overlay) return;
    overlay.hidden = true;
    overlay.innerHTML = '';
  }
  // 删除走二次确认（留言不可恢复）：首次点击转为待确认，3.5s 无操作自动复原
  function confirmDeleteVm(vmId, btn){
    if(btn.dataset.vmPending === '1'){
      stopVmPlayback();
      engine.deleteVoicemail(vmId);
      closeVmDetail();
      renderVoicemails();
      toast('留言已删除');
      return;
    }
    btn.dataset.vmPending = '1';
    btn.classList.add('pending');
    btn.textContent = VMT('确认删除？');
    setUiTimeout(()=>{
      if(!btn.isConnected) return;
      delete btn.dataset.vmPending;
      btn.classList.remove('pending');
      btn.textContent = VMT('删除');
    }, 3500);
  }

  // 电话 tabs 切换
  document.addEventListener('click', e=>{
    const tab = e.target.closest('[data-phone-tab]');
    if(tab){
      stopVmPlayback();   // v0.7.3：切走语音信箱面板时停播
      const tabName = tab.dataset.phoneTab;
      document.querySelectorAll('.phone-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('[data-phone-panel]').forEach(p=>{
        p.hidden = p.dataset.phonePanel !== tabName;
      });
      return;
    }
    const filterBtn = e.target.closest('[data-vm-filter]');
    if(filterBtn){
      vmFilter = filterBtn.dataset.vmFilter;
      document.querySelectorAll('[data-vm-filter]').forEach(b=> b.classList.toggle('active', b === filterBtn));
      renderVoicemails();
      return;
    }
    if(e.target.closest('#vm-read-all')){
      const n = engine.markAllVoicemailsRead ? engine.markAllVoicemailsRead() : 0;
      renderVoicemails();
      toast(n > 0 ? VMT('已标记 {n} 条为听完', {n}) : VMT('没有未听的留言'));
      return;
    }
    if(e.target.closest('[data-vm-close]')){ closeVmDetail(); return; }
    const toggleBtn = e.target.closest('[data-vm-toggle]');
    if(toggleBtn){ toggleVmPlay(toggleBtn.dataset.vmToggle); return; }
    const readBtn = e.target.closest('[data-vm-read]');
    if(readBtn){
      engine.markVoicemailRead(readBtn.dataset.vmRead);
      renderVoicemails();
      if(vmOpenId) openVmDetail(vmOpenId);
      toast('已标记为听完');
      return;
    }
    const delBtn = e.target.closest('[data-vm-del]');
    if(delBtn){ confirmDeleteVm(delBtn.dataset.vmDel, delBtn); return; }
    const cbBtn = e.target.closest('[data-vm-callback]');
    if(cbBtn){
      stopVmPlayback();
      engine.callbackVoicemail(cbBtn.dataset.vmCallback);
      closeVmDetail();
      toast('正在回拨…');
      return;
    }
    const openBtn = e.target.closest('[data-vm-open]');
    if(openBtn){ openVmDetail(openBtn.dataset.vmOpen); return; }
    const overlay = e.target.closest('#vm-overlay');
    if(overlay){ closeVmDetail(); return; }
  });

  // 新留言到达 / 状态变化时刷新计数（玩家此时可能不在电话 App 内）
  engine.on('voicemailReceived', ()=>{ updateVmBadges(); });
  engine.on('voicemailUpdate', ()=>{ updateVmBadges(); });
  engine.on('voicemailDeleted', ()=>{ updateVmBadges(); });

  // ===== 多人聊天群 =====
  function renderGroupList(){
    const list = $('group-list');
    list.innerHTML = '';
    const groups = engine.state.groups;
    const entries = Object.entries(groups);
    if(entries.length === 0){
      list.innerHTML = '<div style="padding:40px 20px;text-align:center;color:var(--ink-mute);font-size:13px;">' + window.t('还没有群聊') + '</div>';
      return;
    }
    entries.forEach(([id, g])=>{
      const last = g.messages[g.messages.length-1];
      const item = document.createElement('div');
      item.className = 'conv-item' + (g.unread>0?' unread':'');
      item.dataset.group = id;
      const preview = last ? VMT(STORY.characters[last.from]?.name || '') + ': ' + last.text : VMT('暂无消息');
      item.innerHTML = `
        <div class="group-avatar">${VMT('群')}</div>
        <div class="group-info">
          <div class="conv-top">
            <span class="conv-name">${escapeHtml(VMT(g.name))}</span>
            <span class="conv-time">${last?.time || ''}</span>
          </div>
          <div class="group-preview">${g.typing?`<span style="color:var(--accent)">${VMT('正在输入…')}</span>`:escapeHtml(preview)}</div>
        </div>
        ${g.unread>0?`<span class="conv-unread">${g.unread}</span>`:''}
      `;
      list.appendChild(item);
    });
    updateGroupBadge();
  }
  function updateGroupBadge(){
    let total = 0;
    Object.values(engine.state.groups).forEach(g=> total += g.unread);
    const badge = $('badge-groups');
    if(total > 0){ badge.textContent = total; badge.hidden = false; }
    else { badge.hidden = true; }
  }
  function openGroupChat(groupId){
    currentGroupId = groupId;
    const g = engine.state.groups[groupId];
    if(!g) return;
    $('group-chat-name').textContent = VMT(g.name);
    $('group-chat-members').textContent = g.members.length + ' 位成员';
    renderGroupChatBody(groupId);
    engine.markGroupRead(groupId);
    updateGroupBadge();
    $('group-chat-input-bar').hidden = true;
    showScreen('groupChat');
    if(g.pendingChoice){
      setUiTimeout(()=> showGroupChoice(groupId, g.pendingChoice), 400);
    }
    setUiTimeout(()=>{
      const body = $('group-chat-body');
      body.scrollTop = body.scrollHeight;
    }, 50);
  }
  function renderGroupChatBody(groupId){
    const g = engine.state.groups[groupId];
    const body = $('group-chat-body');
    body.innerHTML = '';
    g.messages.forEach(m=>{
      const div = document.createElement('div');
      if(m.from === 'me'){
        div.className = 'msg send';
        div.textContent = m.text;
      } else {
        div.className = 'msg recv';
        const char = STORY.characters[m.from];
        const tag = document.createElement('span');
        tag.className = 'speaker-tag ' + m.from;
        tag.textContent = VMT(char?.name || m.from);
        div.appendChild(tag);
        div.appendChild(document.createTextNode(m.text));
      }
      const time = document.createElement('span');
      time.className = 'time';
      time.textContent = m.time || '';
      div.appendChild(time);
      body.appendChild(div);
    });
    if(g.typing){
      const t = document.createElement('div');
      t.className = 'typing-indicator';
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
    }
    body.scrollTop = body.scrollHeight;
  }
  function showGroupChoice(groupId, choice){
    const bar = $('group-chat-input-bar');
    if(!choice || !Array.isArray(choice.options) || choice.options.length === 0){
      if(bar) bar.hidden = true;
      return;
    }
    bar.hidden = false;
    $('group-chat-prompt').textContent = choice.prompt;
    const opts = $('group-chat-options');
    opts.innerHTML = '';
    choice.options.forEach((opt, i)=>{
      const btn = document.createElement('button');
      btn.className = 'chat-opt';
        btn.innerHTML = escapeHtml(opt.text) + (opt.hint?` <span style="color:var(--ink-mute);font-size:11px">(${escapeHtml(opt.hint)})</span>`:'');
      btn.dataset.groupOpt = i;
      opts.appendChild(btn);
    });
  }

  // 群聊事件绑定
  engine.on('groupCreated', ()=>{ updateGroupBadge(); });
  engine.on('groupUpdate', ({id, group})=>{
    updateGroupBadge();
    if(screens.groups.classList.contains('active')) renderGroupList();
    if(currentGroupId === id && screens.groupChat.classList.contains('active')){
      renderGroupChatBody(id);
      $('group-chat-members').textContent = group.members.length + ' 位成员';
    }
  });
  engine.on('groupMessageReceived', ({groupId, from})=>{
    const char = STORY.characters[from];
    const g = engine.state.groups[groupId];
    if(char && g) showNotif(from, VMT('在「{group}」发了消息', {group: VMT(g.name)}), ()=> openGroupChat(groupId));
  });

  // 群聊点击委托
  document.body.addEventListener('click', e=>{
    const gBtn = e.target.closest('[data-group]');
    if(gBtn){ openGroupChat(gBtn.dataset.group); return; }
    const gOpt = e.target.closest('[data-group-opt]');
    if(gOpt && currentGroupId){
      const idx = parseInt(gOpt.dataset.groupOpt);
      const g = engine.state.groups[currentGroupId];
      if(g && g.pendingChoice){
        const opt = g.pendingChoice.options[idx];
        if(opt){
          engine.sendGroupMessage(currentGroupId, opt.text, mergeOptionEffects(opt));
          g.pendingChoice = null;
          $('group-chat-input-bar').hidden = true;
        }
      }
      return;
    }
    const contactBtn = e.target.closest('[data-contact]');
    if(contactBtn){ openCharProfile(contactBtn.dataset.contact); return; }
  });


/* ===== ui/11_contacts_flashbacks.js ===== */
/* ===== 霓虹心事 · UI：通讯录/社交主页、闪回前传、邀约事件、未接提醒 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 通讯录/社交主页 =====
  function renderContacts(){
    const list = $('contacts-list');
    list.innerHTML = '';
    Object.entries(STORY.characters).forEach(([id, char])=>{
      if(id === 'linxia') return;
      const profile = STORY.profiles?.[id];
      const item = document.createElement('div');
      item.className = 'contact-item';
      item.dataset.contact = id;
      item.innerHTML = `
        <div class="contact-avatar" style="background:${char.bg}">${avatarImg(char)}</div>
        <div class="contact-info">
          <div class="contact-name">${escapeHtml(window.t(char.name))}</div>
          <div class="contact-desc">${escapeHtml(window.t(profile?.bio || char.desc || ''))}</div>
        </div>
      `;
      list.appendChild(item);
    });
  }
  function openCharProfile(charId){
    const char = STORY.characters[charId];
    const profile = STORY.profiles?.[charId];
    if(!char || !profile) return;
    const body = $('char-profile-body');
    let html = `
      <div class="char-profile-header">
        <div class="char-profile-avatar" style="background:${char.bg}">${avatarImg(char)}</div>
        <div class="char-profile-name">${escapeHtml(window.t(char.name))}</div>
        <div class="char-profile-bio">${escapeHtml(window.t(profile.bio))}</div>
        <div class="char-profile-tags">
          ${profile.tags.map(t=>`<span class="char-profile-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
    if(profile.relations && profile.relations.length > 0){
      html += `<div class="char-profile-section-title">关系网</div><div class="char-profile-relations">`;
      profile.relations.forEach(r=>{
        const relChar = STORY.characters[r.to];
        html += `
          <div class="char-profile-relation">
            <div class="char-profile-relation-name">${escapeHtml(window.t(relChar?.name || r.to))}</div>
            <div class="char-profile-relation-hint">${r.hint}</div>
          </div>
        `;
      });
      html += '</div>';
    }
    html += `<div class="char-profile-section-title">好感度</div>`;
    html += `<div class="char-profile-relation"><div class="char-profile-relation-hint">当前好感度：${engine.state.affection[charId] || 0}</div></div>`;
    body.innerHTML = html;
    showScreen('charProfile');
  }

  // ===== 闪回/前传章节 =====
  let currentFlashback = null;
  function showFlashback(fbId, fb){
    currentFlashback = {fbId, fb, choices:[]};
    // v0.1.6: 闪回时间标签改为按数据读取（原先固定显示"五年前"，与九年/八年前内容矛盾）
    const flashbackLabel = $('flashback-label');
    if(flashbackLabel) flashbackLabel.textContent = fb.time || '闪回';
    $('flashback-title').textContent = fb.title;
    const scenesEl = $('flashback-scenes');
    scenesEl.innerHTML = '';
    fb.scenes.forEach((sc, i)=>{
      const div = document.createElement('div');
      div.className = 'flashback-scene';
      div.textContent = sc.text;
      scenesEl.appendChild(div);
    });
    // 最后一个场景有 choice
    const lastScene = fb.scenes[fb.scenes.length-1];
    const optsEl = $('flashback-options');
    optsEl.innerHTML = '';
    if(lastScene.choice){
      lastScene.choice.options.forEach((opt, i)=>{
        const btn = document.createElement('button');
        btn.className = 'dream-opt';
        btn.innerHTML = escapeHtml(opt.text) + (opt.shard?` <span style="color:#c8a84a;font-size:11px">✦ ${escapeHtml(opt.shard)}</span>`:'');
        btn.dataset.fbOpt = i;
        optsEl.appendChild(btn);
      });
    } else {
      const btn = document.createElement('button');
      btn.className = 'dream-opt';
      btn.textContent = '继续';
      btn.dataset.fbOpt = '0';
      optsEl.appendChild(btn);
    }
    showScreen('flashback');
  }
  engine.on('flashbackStart', ({fbId, fb})=>{
    showFlashback(fbId, fb);
  });
  document.body.addEventListener('click', e=>{
    const fbOpt = e.target.closest('[data-fb-opt]');
    if(fbOpt && currentFlashback){
      const optIdx = parseInt(fbOpt.dataset.fbOpt);
      const lastScene = currentFlashback.fb.scenes[currentFlashback.fb.scenes.length-1];
      const opt = lastScene.choice?.options?.[optIdx];
      currentFlashback.choices.push({sceneIdx: currentFlashback.fb.scenes.length-1, optIdx});
      engine.resolveFlashback(currentFlashback.fbId, currentFlashback.choices);
      toast(opt?.shard ? t('收集碎片：{shard}', {shard: opt.shard}) : '回忆结束');
      currentFlashback = null;
      setUiTimeout(()=> showScreen('home'), 1800);
      return;
    }
  });

  // ===== 邀约事件 =====
  engine.on('invitationReceived', ({id, inv})=>{
    const char = STORY.characters[inv.from];
    if(char) showNotif(inv.from, window.t('{char}发来邀约', {char: window.t(char.name)}));
  });
  engine.on('invitationResolved', ({id, decision})=>{
    if(decision === 'accepted') toast('已赴约');
    else if(decision === 'declined') toast('已拒绝邀约');
    else if(decision === 'missed') toast('邀约已错过');
  });

  // ===== 通话未接提醒 =====
  engine.on('callMissed', (eventId)=>{
    if(window._currentCall?.eventId === eventId){
      window._currentCall = null;
      if(screens.incomingCall?.classList.contains('active')) showScreen('home');
    }
    toast('未接来电');
  });


/* ===== ui/12_shop_mood.js ===== */
/* ===== 霓虹心事 · UI：礼物商城与心情状态 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.9 礼物商城 =====
  let shopCurrentTab = 'store';
  function renderShop(tab){
    shopCurrentTab = tab || shopCurrentTab;
    document.querySelectorAll('.shop-tab').forEach(t=>{
      t.classList.toggle('active', t.dataset.shopTab === shopCurrentTab);
    });
    $('shop-coins').textContent = '💰 ' + engine.state.coins;
    const content = $('shop-content');
    if(shopCurrentTab === 'store'){
      const items = Object.values(STORY.shop.items);
      content.innerHTML = items.map(item=>{
        const canAfford = engine.state.coins >= item.price;
        return `<div class="shop-item">
          <div class="shop-item-icon">${item.icon}</div>
          <div class="shop-item-info">
            <div class="shop-item-name">${escapeHtml(window.t(item.name))} <span style="font-size:10px;color:var(--ink-mute)">·${window.t(item.cat)}</span></div>
            <div class="shop-item-desc">${escapeHtml(window.t(item.desc))}</div>
            <div class="shop-item-price">💰 ${item.price}</div>
          </div>
          <button class="shop-buy-btn" data-buy="${item.id}" ${canAfford?'':'disabled'}>${canAfford?'购买':'金币不足'}</button>
        </div>`;
      }).join('');
    } else if(shopCurrentTab === 'inventory'){
      const inv = engine.state.inventory;
      if(inv.length === 0){
        content.innerHTML = '<div class="shop-empty">背包空空如也<br>去商店买点礼物送给他吧</div>';
      } else {
        // 按物品id分组
        const grouped = {};
        inv.forEach(g=>{ grouped[g.id] = (grouped[g.id]||0) + 1; });
        content.innerHTML = Object.entries(grouped).map(([itemId, count])=>{
          const item = STORY.shop.items[itemId];
          if(!item) return '';
          return `<div class="shop-item">
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-info">
              <div class="shop-item-name">${escapeHtml(item.name)} ×${count}</div>
              <div class="shop-item-desc">${escapeHtml(window.t(item.desc))}</div>
            </div>
            <button class="shop-buy-btn" data-send-gift="${itemId}" style="background:var(--accent2)">送出</button>
          </div>`;
        }).join('');
      }
    } else if(shopCurrentTab === 'gifts'){
      const gifts = engine.state.gifts;
      if(gifts.length === 0){
        content.innerHTML = '<div class="shop-empty">还没送出过礼物</div>';
      } else {
        content.innerHTML = gifts.slice().reverse().map(g=>{
          const item = STORY.shop.items[g.itemId];
          const char = STORY.characters[g.to] || {};
          const multLabel = g.mult >= 2 ? '最爱 ⭐⭐' : (g.mult >= 1.5 ? '喜欢 ⭐' : (g.mult >= 1 ? '一般' : '不喜欢'));
          return `<div class="shop-item">
            <div class="shop-item-icon">${item?.icon || '🎁'}</div>
            <div class="shop-item-info">
              <div class="shop-item-name">${char.avatar||''} ${escapeHtml(window.t(char.name||g.to))} · ${escapeHtml(item?.name||'')}</div>
              <div class="shop-item-desc">第${g.day}天送出 · ${multLabel} · 好感 +${g.gain}</div>
            </div>
          </div>`;
        }).join('');
      }
    }
  }
  function handleBuyGift(itemId){
    const r = engine.buyGift(itemId);
    if(!r.ok){ toast(r.reason); return; }
    toast(t('已购买：{name}', {name: r.item.name}));
    renderShop(shopCurrentTab);
  }
  let giftSendItemId = null;
  let giftSendCharId = null;
  function openGiftSendModal(itemId){
    giftSendItemId = itemId;
    giftSendCharId = null;
    const item = STORY.shop.items[itemId];
    if(!item) return;
    const modal = document.createElement('div');
    modal.className = 'gift-send-modal';
    modal.id = 'gift-send-modal';
    modal.innerHTML = `<div class="gift-send-content">
      <div class="gift-send-title">把「${escapeHtml(item.name)}」送给谁？</div>
      <div class="gift-send-char">
        ${['shenyan','luci','jiangyu'].map(cid=>{
          const c = STORY.characters[cid];
          return `<button class="gift-send-char-btn" data-gift-char="${cid}" style="background:${c.bg}" title="${escapeHtml(window.t(c.name))}">${avatarImg(c)}</button>`;
        }).join('')}
      </div>
      <div class="gift-pref-hint" id="gift-pref-hint">点击头像查看他对此礼物的喜好</div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;">
        <button data-action="cancel-gift" style="padding:8px 20px;background:rgba(255,255,255,0.08);color:var(--ink);border:none;border-radius:10px;font-size:13px;cursor:pointer;">取消</button>
        <button data-action="confirm-gift" id="gift-confirm-btn" disabled style="padding:8px 20px;background:var(--accent);color:#fff;border:none;border-radius:10px;font-size:13px;cursor:pointer;opacity:0.4;">确认送出</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
    // 点击背景关闭
    modal.addEventListener('click', e=>{ if(e.target === modal) closeGiftSendModal(); });
  }
  function selectGiftChar(charId){
    giftSendCharId = charId;
    document.querySelectorAll('.gift-send-char-btn').forEach(b=>{
      b.classList.toggle('selected', b.dataset.giftChar === charId);
    });
    const prefs = STORY.shop.preferences[charId] || {};
    const mult = prefs[giftSendItemId];
    const hintEl = $('gift-pref-hint');
    const confirmBtn = $('gift-confirm-btn');
    if(!mult){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">一般（×1）</span>';
    } else if(mult >= 2){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">最爱（×2）⭐⭐</span>';
    } else if(mult >= 1.5){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">喜欢（×1.5）⭐</span>';
    } else if(mult >= 1){
      hintEl.innerHTML = '他对此礼物的喜好：<span class="star">一般（×1）</span>';
    } else {
      hintEl.innerHTML = '他不太喜欢这类东西（×0.5）';
    }
    if(confirmBtn){ confirmBtn.disabled = false; confirmBtn.style.opacity = '1'; }
  }
  function handleConfirmGift(){
    if(!giftSendItemId || !giftSendCharId){ toast('请选择赠送对象'); return; }
    const r = engine.giveGift(giftSendCharId, giftSendItemId);
    closeGiftSendModal();
    if(!r.ok){ toast(r.reason); return; }
    const charName = STORY.characters[giftSendCharId]?.name || '';
    toast(t('已送出 · {char} 好感 +{gain}', {char: window.t(charName), gain: r.gain}));
    renderShop(shopCurrentTab);
  }
  function closeGiftSendModal(){
    const m = $('gift-send-modal');
    if(m) m.remove();
    giftSendItemId = null;
    giftSendCharId = null;
  }
  engine.on('giftGiven', ({to, itemId, mult, gain, reaction})=>{
    const char = STORY.characters[to];
    if(char) showNotif(to, `收到礼物 · 好感 +${gain}`);
  });

  // ===== v0.0.9 心情状态+内心独白 =====
  function renderMood(){
    const content = $('mood-content');
    const cur = STORY.moods[engine.state.mood] || STORY.moods.calm;
    let html = `<div class="mood-current">
      <div class="mood-current-icon">${cur.icon}</div>
      <div class="mood-current-label">${escapeHtml(window.t(cur.label))}</div>
      <div class="mood-current-hint">"${escapeHtml(window.t(cur.hint))}"</div>
    </div>`;
    html += '<div class="mood-section-title">' + window.t('切换心情') + '</div>';
    html += '<div class="mood-grid">';
    Object.values(STORY.moods).forEach(m=>{
      html += `<div class="mood-opt ${m.id===engine.state.mood?'selected':''}" data-mood-opt="${m.id}">
        <div class="mood-opt-icon">${m.icon}</div>
        <div class="mood-opt-label">${m.label}</div>
      </div>`;
    });
    html += '</div>';
    // 内心独白
    html += '<div class="mood-diary-section">';
    html += '<div class="mood-section-title">' + window.t('内心独白') + '</div>';
    html += `<textarea class="mood-diary-input" id="mood-diary-text" placeholder="${escapeHtml(window.t('今天发生了什么？把心里的话写下来…'))}"></textarea>`;
    html += '<button class="mood-diary-submit" data-action="submit-diary">' + window.t('记下这一刻') + '</button>';
    // 历史日记
    if(engine.state.diary.length > 0){
      html += '<div class="mood-diary-list">';
      engine.state.diary.slice().reverse().slice(0, 5).forEach(d=>{
        const m = STORY.moods[d.mood] || {icon:'·'};
        html += `<div class="mood-diary-item">
          <div class="mood-diary-item-text">${m.icon} ${escapeHtml(d.text)}</div>
          <div class="mood-diary-item-meta">第${d.day}天 ${d.time}</div>
        </div>`;
      });
      html += '</div>';
    }
    html += '</div>';
    content.innerHTML = html;
  }
  function handleDiarySubmit(){
    const field = $('mood-diary-text');
    if(!field) return;
    const text = field.value.trim();
    if(!text){ toast('先写点什么吧'); return; }
    engine.addDiary(text);
    toast('已记下');
    renderMood();
  }
  engine.on('moodChanged', ({mood, moodInfo})=>{
    toast(t('心情：{mood}', {mood: moodInfo.label}));
  });


/* ===== ui/13_tarot_achievements.js ===== */
/* ===== 霓虹心事 · UI：塔罗占卜与成就系统 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.9 塔罗占卜 =====
  function renderTarot(){
    const content = $('tarot-content');
    const fortune = engine.state.todayFortune;
    let html = '';
    if(fortune){
      html += `<div class="tarot-today">
        <div class="tarot-card-display ${fortune.reversed?'reversed':''}">
          ${fortune.reversed ? '<div class="tarot-card-reversed-tag">逆位</div>' : ''}
          <div class="tarot-card-roman">${fortune.roman}</div>
          <div class="tarot-card-name">${escapeHtml(fortune.name)}</div>
        </div>
        <div class="tarot-text">${escapeHtml(fortune.text)}</div>
        <div class="tarot-hint">第${fortune.day}天的牌阵 · ${fortune.reversed?'逆位':'正位'}</div>
      </div>`;
      html += `<button class="tarot-draw-btn" disabled>${escapeHtml(window.t('今日已抽过'))}</button>`;
    } else {
      html += `<div class="tarot-empty">
        <div class="tarot-empty-icon">🔮</div>
        <div>${escapeHtml(window.t('今日尚未抽牌'))}</div>
        <div style="font-size:11px;margin-top:6px;">${escapeHtml(window.t('每日一抽，揭示霓城的运势'))}</div>
      </div>`;
      html += `<button class="tarot-draw-btn" data-action="draw-tarot">${escapeHtml(window.t('抽取今日塔罗'))}</button>`;
    }
    // 历史
    if(engine.state.tarotHistory.length > 0){
      html += '<div class="tarot-history">';
      html += '<div class="tarot-history-title">历史牌阵</div>';
      engine.state.tarotHistory.slice().reverse().slice(0, 6).forEach(h=>{
        const card = STORY.tarot.cards[h.cardId];
        if(!card) return;
        html += `<div class="tarot-history-item">
          <span class="tarot-history-card">${card.roman} ${card.name}</span>
          <span style="color:${h.reversed?'#ff5fa8':'#4ade80'}">${h.reversed?'逆':'正'}</span>
          <span style="margin-left:auto;color:var(--ink-mute)">第${h.day}天</span>
        </div>`;
      });
      html += '</div>';
    }
    content.innerHTML = html;
  }
  function handleDrawTarot(){
    const r = engine.drawTarot();
    if(!r.ok){ toast(r.reason || '抽牌失败'); return; }
    renderTarot();
  }

  // ===== v0.0.9 成就系统 =====
  function renderAchievements(){
    const content = $('achievements-content');
    const unlocked = engine.getUnlockedAchievements();
    const locked = engine.getLockedAchievements();
    const total = unlocked.length + locked.length;
    const pct = total > 0 ? (unlocked.length / total) * 100 : 0;
    const trueUnlocked = engine.isTrueEndingUnlocked();
    let html = `<div class="ach-progress">
      <div class="ach-progress-num">${unlocked.length} / ${total}</div>
      <div class="ach-progress-total">已解锁成就</div>
      <div class="ach-progress-bar"><div class="ach-progress-fill" style="width:${pct}%"></div></div>
      <div class="ach-true-ending-hint ${trueUnlocked?'unlocked':''}">${trueUnlocked?'✨ 真结局已解锁':'达成 60% 成就 + 选择独行路线 → 解锁真结局'}</div>
    </div>`;
    if(unlocked.length > 0){
      html += '<div class="ach-section-title">已解锁</div>';
      unlocked.forEach(a=>{
        html += `<div class="ach-item unlocked">
          <div class="ach-item-icon">${a.icon}</div>
          <div class="ach-item-info">
            <div class="ach-item-name">${escapeHtml(a.name)}</div>
            <div class="ach-item-desc">${escapeHtml(a.desc)}</div>
          </div>
        </div>`;
      });
    }
    if(locked.length > 0){
      html += '<div class="ach-section-title">未解锁</div>';
      locked.forEach(a=>{
        html += `<div class="ach-item locked">
          <div class="ach-item-icon">${a.icon}</div>
          <div class="ach-item-info">
            <div class="ach-item-name">${escapeHtml(a.name)}</div>
            <div class="ach-item-desc">${escapeHtml(a.desc)}</div>
          </div>
        </div>`;
      });
    }
    content.innerHTML = html;
  }
  // 成就解锁通知
  engine.on('achievementsUnlocked', (achs)=>{
    AudioSys.play('achieve');  // v0.1.7: 成就解锁音
    achs.forEach(a=>{
      const n = document.createElement('div');
      n.className = 'ach-notif';
      n.textContent = `🏆 成就解锁：${a.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 3000);
    });
    // 若成就页打开则刷新
    if(screens.achievements && screens.achievements.classList.contains('active')){
      renderAchievements();
    }
  });


/* ===== ui/14_collection_puzzles.js ===== */
/* ===== 霓虹心事 · UI：收集柜与线索解谜 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.10 收集柜 =====
  let collectionCurrentCat = 'all';
  function renderCollection(cat){
    collectionCurrentCat = cat || collectionCurrentCat;
    document.querySelectorAll('.collection-tab').forEach(t=>{
      t.classList.toggle('active', t.dataset.collCat === collectionCurrentCat);
    });
    const allItems = Object.values(STORY.collectibles || {});
    const total = allItems.length;
    const collected = engine.state.collected.length;
    $('collection-count').textContent = `${collected}/${total}`;
    const content = $('collection-content');
    let items = allItems;
    if(collectionCurrentCat !== 'all') items = items.filter(i=>i.cat === collectionCurrentCat);
    content.innerHTML = items.map(item=>{
      const isCollected = engine.state.collected.includes(item.id);
      return `<div class="coll-card ${isCollected?'':'locked'}">
        <div class="coll-card-icon">${isCollected ? item.icon : '❓'}</div>
        <div class="coll-card-name">${isCollected ? escapeHtml(item.name) : '未收集'}</div>
        <div class="coll-card-desc">${isCollected ? escapeHtml(item.desc) : '等待霓城的某一个瞬间…'}</div>
        ${isCollected ? `<div class="coll-card-how">${escapeHtml(item.how)}</div>` : ''}
      </div>`;
    }).join('');
    // 隐藏彩蛋
    const eggsEl = $('collection-eggs');
    const allEggs = Object.values(STORY.easterEggs || {});
    eggsEl.innerHTML = allEggs.map(egg=>{
      const seen = engine.state.easterEggsSeen[egg.id];
      return `<div class="coll-egg ${seen?'':'locked'}">
        <div class="coll-egg-icon">${seen ? egg.icon : '🔒'}</div>
        <div class="coll-egg-info">
          <div class="coll-egg-name">${seen ? escapeHtml(egg.name) : '???'}</div>
          <div class="coll-egg-desc">${seen ? escapeHtml(egg.desc) : '尚未触发'}</div>
        </div>
      </div>`;
    }).join('');
  }
  engine.on('itemCollected', ({item, itemId})=>{
    AudioSys.play('achieve');  // v0.1.7: 收集提示音
    showNotif('susu', `✦ ${window.t('新收集')}：${window.t(item.name)}`);
    if(screens.collection && screens.collection.classList.contains('active')){
      renderCollection(collectionCurrentCat);
    }
  });
  engine.on('easterEggUnlocked', (eggs)=>{
    eggs.forEach(egg=>{
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `✦ 彩蛋：${egg.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 3000);
    });
  });

  // ===== v0.0.10 线索本/解谜 =====
  let currentPuzzleId = null;
  function renderPuzzles(){
    const content = $('puzzles-content');
    const puzzles = engine.getAllPuzzles();
    if(puzzles.length === 0){
      content.innerHTML = '<div class="shop-empty">' + window.t('暂无线索') + '</div>';
      return;
    }
    content.innerHTML = puzzles.map(p=>{
      const statusCls = p.solved ? 'solved' : '';
      const statusText = p.solved ? '已解开' : (p.attemptCount > 0 ? `已尝试 ${p.attemptCount} 次` : '未尝试');
      const discoveredClues = p.clues.filter(c=>c.discovered).length;
      return `<div class="puzzle-card ${statusCls}" data-puzzle="${p.id}">
        <div class="puzzle-card-title">
          <span>${escapeHtml(p.title)}</span>
          <span class="puzzle-card-status ${p.solved?'solved':''}">${statusText}</span>
        </div>
        <div class="puzzle-card-desc">${escapeHtml(p.desc)}</div>
        <div class="puzzle-card-meta">线索 ${discoveredClues}/${p.clues.length} · 点击进入</div>
      </div>`;
    }).join('');
  }
  function openPuzzleDetail(puzzleId){
    currentPuzzleId = puzzleId;
    renderPuzzleDetail(puzzleId);
    showScreen('puzzleDetail');
  }
  function renderPuzzleDetail(puzzleId){
    const puzzle = STORY.puzzles?.[puzzleId];
    if(!puzzle) return;
    const progress = engine.state.puzzleProgress[puzzleId] || {};
    $('puzzle-detail-title').textContent = puzzle.title;
    const content = $('puzzle-detail-content');
    let html = `<div class="pd-desc">${escapeHtml(puzzle.desc)}</div>`;
    html += '<div class="pd-section-title">线索</div>';
    puzzle.clues.forEach(c=>{
      const discovered = engine.state.discoveredClues[c.id];
      html += `<div class="pd-clue">
        <div class="pd-clue-text">
          ${discovered ? escapeHtml(c.text) : '<span style="color:var(--ink-mute)">未发现线索 · 点击发现</span>'}
          ${discovered ? `<span class="pd-clue-digit">${c.digit}</span>` : ''}
        </div>
        ${!discovered ? `<button data-clue="${c.id}" style="margin-top:6px;padding:4px 10px;font-size:11px;background:rgba(255,255,255,0.05);color:var(--ink-mute);border:0.5px solid rgba(255,255,255,0.1);border-radius:6px;cursor:pointer;">翻开这条线索</button>` : ''}
      </div>`;
    });
    // 输入区
    if(progress.solved){
      html += `<div class="pd-result success">✓ ${escapeHtml(puzzle.onSuccess)}</div>`;
    } else {
      html += '<div class="pd-section-title" style="margin-top:18px;">输入答案</div>';
      html += `<div class="pd-input-row">
        <input type="text" class="pd-input" id="puzzle-answer-input" maxlength="4" placeholder="____" inputmode="numeric">
        <button class="pd-submit" data-action="submit-puzzle">提交</button>
      </div>`;
      // v0.3.4: 多级提示链——首次显示 1 条，每次失败多揭示 1 条（无 hints 时回退单条 hint）
      const hintList = puzzle.hints || (puzzle.hint ? [puzzle.hint] : []);
      if(hintList.length){
        const showN = Math.min(hintList.length, Math.max(1, (progress.attemptCount || 0) + 1));
        html += `<div class="pd-hint">${hintList.slice(0, showN).map(h=>escapeHtml(h)).join('<br>')}</div>`;
      }
      if(progress.attemptCount > 0){
        html += `<div class="pd-result fail">✗ ${escapeHtml(puzzle.onFail)}（已尝试 ${progress.attemptCount} 次）</div>`;
      }
    }
    content.innerHTML = html;
  }
  function handlePuzzleSubmit(){
    const input = $('puzzle-answer-input');
    if(!input || !currentPuzzleId) return;
    const answer = input.value.trim();
    if(!answer){ toast('请输入答案'); return; }
    const r = engine.attemptPuzzle(currentPuzzleId, answer);
    if(r.solved){
      toast('谜题已解开');
    } else {
      toast(r.message || '答案不对');
    }
    renderPuzzleDetail(currentPuzzleId);
  }
  engine.on('puzzleSolved', ({puzzleId, puzzle, reward})=>{
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = `🔍 谜题解开：${puzzle.title}`;
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 3000);
  });


/* ===== ui/15_holiday_perspective.js ===== */
/* ===== 霓虹心事 · UI：节日 App 与男主视角 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.10 节日App =====
  function renderCalendar2(){
    const content = $('calendar2-content');
    const season = engine.getCurrentSeason();
    const today = engine.getDateLabel();
    const todayHoliday = STORY.seasons?.holidays[`${today.month}-${today.date}`];
    let html = `<div class="cal2-season">
      <div class="cal2-season-icon">${season.icon}</div>
      <div class="cal2-season-name">${season.name} · ${today.month}月${today.date}日</div>
      <div class="cal2-season-desc">"${escapeHtml(season.desc)}"</div>
    </div>`;
    if(todayHoliday){
      html += `<div class="cal2-today-holiday">
        <div class="cal2-today-holiday-icon">${todayHoliday.icon}</div>
        <div class="cal2-today-holiday-name">${escapeHtml(todayHoliday.name)}</div>
        <div class="cal2-today-holiday-text">${escapeHtml(todayHoliday.text)}</div>
      </div>`;
    } else {
      html += '<div class="cal2-section-title">今日</div>';
      html += '<div style="font-size:12px;color:var(--ink-mute);padding:8px 0;">今天没有特别的日子。</div>';
    }
    // 即将到来的节日
    const upcoming = engine.getUpcomingHolidays(30);
    if(upcoming.length > 0){
      html += '<div class="cal2-section-title">即将到来</div>';
      upcoming.forEach(u=>{
        html += `<div class="cal2-upcoming-item">
          <div class="cal2-upcoming-icon">${u.holiday.icon}</div>
          <div class="cal2-upcoming-info">
            <div class="cal2-upcoming-name">${escapeHtml(u.holiday.name)}</div>
            <div class="cal2-upcoming-date">${u.date.month}月${u.date.date}日</div>
          </div>
          <div class="cal2-upcoming-in">${u.inDays}天后</div>
        </div>`;
      });
    }
    // 全部节日列表
    html += '<div class="cal2-section-title">霓城节日历</div>';
    Object.values(STORY.seasons?.holidays || {}).forEach(h=>{
      html += `<div class="cal2-upcoming-item">
        <div class="cal2-upcoming-icon">${h.icon}</div>
        <div class="cal2-upcoming-info">
          <div class="cal2-upcoming-name">${escapeHtml(h.name)}</div>
          <div class="cal2-upcoming-date">${escapeHtml(h.text)}</div>
        </div>
      </div>`;
    });
    content.innerHTML = html;
  }
  engine.on('holidayTriggered', ({holiday, date})=>{
    showNotif('susu', `今日节日：${holiday.name}`);
  });

  // ===== v0.0.10 男主视角+反向剧情 =====
  let currentPerspectiveCharId = null;
  let currentPsceneId = null;
  function renderPerspective(){
    const content = $('perspective-content');
    const perspectives = engine.getAllPerspectives();
    if(perspectives.length === 0){
      content.innerHTML = '<div class="shop-empty">' + window.t('暂无视角') + '</div>';
      return;
    }
    content.innerHTML = perspectives.map(p=>{
      const char = STORY.characters[p.charId] || {};
      const lockedCls = p.unlocked ? '' : 'locked';
      const statusText = p.unlocked
        ? (p.truthEndingSeen ? '✓ 真相已揭示' : `${p.scenesSeen}/${p.totalScenes} 场景已看`)
        : '通关对应路线后解锁';
      let scenesHtml = '';
      if(p.unlocked){
        scenesHtml = '<div class="persp-card-scenes">';
        p.scenes.forEach(s=>{
          scenesHtml += `<div class="persp-scene-item ${s.seen?'seen':''}" data-pscene="${p.charId}:${s.id}">
            <span class="persp-scene-item-title">${escapeHtml(s.title)}</span>
            ${s.seen ? '<span class="persp-scene-item-check">✓</span>' : '<span style="font-size:10px;color:var(--ink-mute)">未看</span>'}
          </div>`;
        });
        scenesHtml += '</div>';
        // 真相结局按钮
        const allScenesSeen = p.scenesSeen === p.totalScenes;
        if(allScenesSeen){
          scenesHtml += `<button class="persp-truth-btn ${p.truthEndingSeen?'':'unlocked'}" data-action="show-truth" data-char-id="${p.charId}">
            ${p.truthEndingSeen ? '✓ 重看真相结局' : '✦ 揭示真相结局'}
          </button>`;
        }
      }
      return `<div class="persp-card ${lockedCls}">
        <div class="persp-card-header">
          <div class="persp-card-avatar" style="background:${char.bg||'#333'}">${avatarImg(char)}</div>
          <div>
            <div class="persp-card-title">${escapeHtml(p.title)}</div>
            <div class="persp-card-status">${statusText}</div>
          </div>
        </div>
        ${scenesHtml}
      </div>`;
    }).join('');
  }
  function openPerspectiveScene(charSceneId){
    const [charId, sceneId] = charSceneId.split(':');
    currentPerspectiveCharId = charId;
    currentPsceneId = sceneId;
    const p = STORY.malePerspectives?.[charId];
    const scene = p?.scenes.find(s=>s.id === sceneId);
    if(!scene) return;
    $('pscene-title').textContent = p.title;
    const content = $('pscene-content');
    let html = `<div class="pscene-time">${escapeHtml(scene.time)}</div>`;
    html += `<div class="pscene-title">${escapeHtml(scene.title)}</div>`;
    html += `<div class="pscene-narration">${escapeHtml(scene.narration)}</div>`;
    html += `<div class="pscene-inner">${escapeHtml(scene.innerVoice)}</div>`;
    if(scene.choice){
      html += `<div class="pscene-choice-prompt">${escapeHtml(scene.choice.prompt)}</div>`;
      html += '<div class="pscene-options">';
      scene.choice.options.forEach((opt, i)=>{
        html += `<div class="pscene-opt" data-pscene-opt="${i}">
          ${escapeHtml(opt.text)}
          <span class="pscene-opt-inner">${escapeHtml(opt.inner)}</span>
        </div>`;
      });
      html += '</div>';
    }
    content.innerHTML = html;
    showScreen('pscene');
  }
  function handlePsceneOption(idx){
    const p = STORY.malePerspectives?.[currentPerspectiveCharId];
    const scene = p?.scenes.find(s=>s.id === currentPsceneId);
    if(!scene || !scene.choice) return;
    const opt = scene.choice.options[idx];
    if(!opt) return;
    // 标记场景已看
    engine.markPerspectiveSceneSeen(currentPerspectiveCharId, currentPsceneId);
    toast(t('心声：{inner}', {inner: opt.inner}));
    // 返回视角列表
    setUiTimeout(()=>{
      renderPerspective();
      showScreen('perspective');
    }, 1500);
  }
  function showTruthEnding(charId){
    const p = STORY.malePerspectives?.[charId];
    if(!p || !p.truthEnding) return;
    $('truth-title').textContent = p.truthEnding.title;
    $('truth-text').textContent = p.truthEnding.text;
    showScreen('truthEnding');
  }
  engine.on('truthEndingUnlocked', ({charId, perspective})=>{
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = `✦ 真相结局解锁：${perspective.title}`;
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 4000);
  });


/* ===== ui/16_player_profile.js ===== */
/* ===== 霓虹心事 · UI：主角档案 App =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.13 主角档案 App =====
  const PLAYER_COLORS = ['#5a2a4a','#2a2f5a','#2a5a3a','#5a3a1a','#3a1a3a','#1a3a4a','#4a1a2a','#3a3a3a'];
  let playerEditState = null;  // 临时编辑态
  function renderPlayer(){
    const content = $('player-content');
    const p = engine.getPlayer();
    let html = `<div class="player-hero">
      <div class="player-hero-avatar" style="background:${p.bg || '#5a2a4a'}">${escapeHtml(p.avatar || (p.name ? p.name[0] : '林'))}</div>
      <div class="player-hero-name">${escapeHtml(window.t(p.name || '林夏'))}</div>
      <div class="player-hero-nick">${escapeHtml(window.t('昵称 · {nick}', {nick: window.t(p.nickname || '夏夏')}))}</div>
      <div class="player-hero-meta">
        <span>${p.age || 24} 岁</span>
        <span>称谓 · ${escapeHtml(p.pronoun || '她')}</span>
        ${engine.state.playerQuizDone ? '<span style="color:#4ade80">✓ 性格已画像</span>' : '<span style="color:var(--accent2)">性格问答待完成</span>'}
      </div>
      <div class="player-hero-meta">
        ${engine.state.ngPlus ? `<span style="color:#fbbf24">周目 ${engine.state.ngPlus + 1}</span>` : '<span>一周目</span>'}
        <span>结局达成 ${Object.keys(engine.state.endingSeen || {}).length}/17</span>
      </div>
    </div>`;
    // 性格问答回顾
    const quiz = STORY.playerCustomization?.personalityQuiz || [];
    if(quiz.length > 0){
      html += '<div class="player-section-title">性格画像回顾</div>';
      html += '<div class="player-quiz-list">';
      quiz.forEach(q=>{
        const ansIdx = p.answers?.[q.id];
        const opt = (ansIdx !== undefined) ? q.options[ansIdx] : null;
        html += `<div class="player-quiz-item">
          <div class="player-quiz-q">${escapeHtml(q.question)}</div>
          <div class="player-quiz-a">${opt ? ('→ ' + escapeHtml(opt.text) + (opt.label ? ` (${opt.label})` : '')) : '未作答'}</div>
        </div>`;
      });
      html += '</div>';
    }
    // 动态称谓表
    const chars = ['shenyan','luci','jiangyu','susu'];
    html += '<div class="player-section-title">男主对你的称谓</div>';
    html += '<div class="player-nick-table">';
    chars.forEach(cid=>{
      const char = STORY.characters[cid];
      if(!char) return;
      const nick = engine.getCharNickname(cid);
      const hasRelStage = !!(STORY.relationshipStages && STORY.relationshipStages[cid]);
      const stageNum = hasRelStage ? engine.getRelationshipStageNum(cid) : '—';
      html += `<div class="player-nick-row">
        <div class="player-nick-char" style="background:${char.bg}">${avatarImg(char)}</div>
        <div class="player-nick-info">
          <div class="player-nick-call">${escapeHtml(window.t(nick.call))}</div>
          ${nick.inner ? `<div class="player-nick-inner">"${escapeHtml(nick.inner)}"</div>` : ''}
        </div>
        <div class="player-nick-stage">${hasRelStage ? ('阶段 ' + stageNum) : '闺蜜'}</div>
      </div>`;
    });
    html += '</div>';
    content.innerHTML = html;
  }

  function openPlayerEdit(){
    const p = engine.getPlayer();
    playerEditState = {
      name: p.name || '林夏',
      nickname: p.nickname || '夏夏',
      avatar: p.avatar || (p.name ? p.name[0] : '林'),
      bg: p.bg || '#5a2a4a',
      age: p.age || 24,
      pronoun: p.pronoun || '她',
      answers: {...(p.answers || {})}
    };
    renderPlayerEdit();
    showScreen('playerEdit');
  }

  function renderPlayerEdit(){
    const s = playerEditState;
    if(!s) return;
    const quiz = STORY.playerCustomization?.personalityQuiz || [];
    let html = `<div class="player-edit-title">编辑主角档案</div>
      <div class="player-edit-sub">自定义姓名、昵称和性格画像</div>`;
    // 基本信息
    html += `<div class="player-edit-field">
      <div class="player-edit-label">姓名</div>
      <input class="player-edit-input" id="pe-name" type="text" maxlength="6" value="${escapeHtml(s.name)}">
    </div>`;
    html += `<div class="player-edit-field">
      <div class="player-edit-label">昵称（闺蜜/男主称呼你的小名基础）</div>
      <input class="player-edit-input" id="pe-nick" type="text" maxlength="6" value="${escapeHtml(s.nickname)}">
    </div>`;
    html += `<div class="player-edit-field">
      <div class="player-edit-label">年龄</div>
      <input class="player-edit-input" id="pe-age" type="number" min="18" max="40" value="${s.age}">
    </div>`;
    // 头像底色
    html += `<div class="player-edit-field">
      <div class="player-edit-label">头像底色</div>
      <div class="player-edit-color-row" id="pe-colors">
        ${PLAYER_COLORS.map(c=>`<div class="player-edit-color-opt ${c===s.bg?'selected':''}" data-pe-color="${c}" style="background:${c}"></div>`).join('')}
      </div>
    </div>`;
    // 称谓
    html += `<div class="player-edit-field">
      <div class="player-edit-label">称谓</div>
      <div class="player-edit-pronoun-row" id="pe-pronouns">
        ${['她','他','TA'].map(pn=>`<div class="player-edit-pronoun-opt ${pn===s.pronoun?'selected':''}" data-pe-pronoun="${pn}">${pn}</div>`).join('')}
      </div>
    </div>`;
    // 性格问答
    html += '<div class="player-edit-label" style="margin-top:8px;">性格问答（影响初始画像）</div>';
    quiz.forEach(q=>{
      const sel = s.answers[q.id];
      html += `<div class="player-edit-question">
        <div class="player-edit-question-text">${escapeHtml(q.question)}</div>
        <div class="player-edit-options">`;
      q.options.forEach((opt, i)=>{
        html += `<div class="player-edit-opt ${i===sel?'selected':''}" data-pe-quiz="${q.id}" data-pe-idx="${i}">
          ${escapeHtml(opt.text)}
          ${opt.label ? `<span class="player-edit-opt-label">${escapeHtml(opt.label)}</span>` : ''}
        </div>`;
      });
      html += '</div></div>';
    });
    // 操作按钮
    html += `<div class="player-edit-actions">
      <button class="player-edit-btn secondary" data-action="cancel-player-edit">取消</button>
      <button class="player-edit-btn" data-action="save-player">保存</button>
    </div>`;
    $('player-edit-content').innerHTML = html;
  }

  function capturePlayerEditInputs(){
    if(!playerEditState) return;
    const name = $('pe-name');
    const nickname = $('pe-nick');
    const age = $('pe-age');
    if(name) playerEditState.name = name.value.slice(0, 6);
    if(nickname) playerEditState.nickname = nickname.value.slice(0, 6);
    if(age) playerEditState.age = Math.max(18, Math.min(40, parseInt(age.value) || 24));
  }

  function handlePlayerEditClick(target){
    // 颜色选择
    const colorOpt = target.closest('[data-pe-color]');
    if(colorOpt){
      capturePlayerEditInputs();
      playerEditState.bg = colorOpt.dataset.peColor;
      renderPlayerEdit();
      return true;
    }
    // 称谓选择
    const pronounOpt = target.closest('[data-pe-pronoun]');
    if(pronounOpt){
      capturePlayerEditInputs();
      playerEditState.pronoun = pronounOpt.dataset.pePronoun;
      renderPlayerEdit();
      return true;
    }
    // 性格问答选择
    const quizOpt = target.closest('[data-pe-quiz]');
    if(quizOpt){
      capturePlayerEditInputs();
      playerEditState.answers[quizOpt.dataset.peQuiz] = parseInt(quizOpt.dataset.peIdx);
      renderPlayerEdit();
      return true;
    }
    return false;
  }

  function savePlayer(){
    if(!playerEditState) return;
    capturePlayerEditInputs();
    const nameInput = $('pe-name');
    const nickInput = $('pe-nick');
    const ageInput = $('pe-age');
    const name = (nameInput?.value || '').trim() || '林夏';
    const nickname = (nickInput?.value || '').trim() || '夏夏';
    const age = Math.max(18, Math.min(40, parseInt(ageInput?.value) || 24));
    // 头像取姓名首字
    const avatar = name[0];
    const newAnswers = playerEditState.answers;
    const quiz = STORY.playerCustomization?.personalityQuiz || [];
    engine.updatePlayerProfile({
      name, nickname, avatar, age,
      bg: playerEditState.bg,
      pronoun: playerEditState.pronoun,
      answers: newAnswers
    });
    // 完成性问答题标志
    if(Object.keys(newAnswers).length >= quiz.length){
      engine.state.playerQuizDone = true;
      engine.emit('stateChange', engine.state);
    }
    playerEditState = null;
    toast('档案已保存');
    renderPlayer();
    showScreen('player');
  }

  // 监听主角变化刷新
  engine.on('playerChanged', ()=>{
    if(screens.player && screens.player.classList.contains('active')) renderPlayer();
  });


/* ===== ui/17_relationship_tasks_watch.js ===== */
/* ===== 霓虹心事 · UI：关系阶段、每日任务、观赏模式 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.13 关系阶段 App =====
  function renderRelations(){
    const content = $('relations-content');
    const all = engine.getAllRelationshipStages();
    let html = '';
    all.forEach(r=>{
      const char = STORY.characters[r.charId];
      if(!char) return;
      const stages = STORY.relationshipStages?.[r.charId] || [];
      const curStageNum = r.stageNum;
      const aff = r.affection;
      const maxAff = stages[stages.length-1]?.maxAff || 99;
      const pct = Math.min(100, (aff / maxAff) * 100);
      html += `<div class="rel-card">
        <div class="rel-card-header">
          <div class="rel-card-avatar" style="background:${char.bg}">${avatarImg(char)}</div>
          <div class="rel-card-info">
            <div class="rel-card-name">${escapeHtml(window.t(char.name))}</div>
            <div class="rel-card-stage">阶段 ${curStageNum} · ${escapeHtml(r.stage.name)} · ${escapeHtml(r.stage.title)}</div>
            <div class="rel-card-aff">好感度 ${aff}</div>
          </div>
        </div>
        <div class="rel-card-bar">
          <div class="rel-card-bar-fill" style="width:${pct}%"></div>
          <div class="rel-card-bar-marks">
            ${stages.map(()=>'<div class="rel-card-bar-mark"></div>').join('')}
          </div>
        </div>
        <div class="rel-stages">`;
      stages.forEach(s=>{
        const isCurrent = s.stage === curStageNum;
        const isPassed = s.stage < curStageNum;
        const isLocked = s.stage > curStageNum;
        const cls = isCurrent ? 'current' : (isPassed ? 'passed' : 'locked');
        html += `<div class="rel-stage-item ${cls}">
          <div class="rel-stage-dot"></div>
          <div class="rel-stage-info">
            <div class="rel-stage-name">阶段 ${s.stage} · ${escapeHtml(s.name)}</div>
            <div class="rel-stage-title">${escapeHtml(s.title)}</div>
            <div class="rel-stage-desc">${escapeHtml(s.desc)}</div>
            ${isCurrent && s.unlockMsg ? `<div class="rel-stage-unlock">"${escapeHtml(s.unlockMsg)}"</div>` : ''}
            ${s.criticalEvent && !isLocked ? `<div class="rel-stage-unlock" style="color:#ffd566">★ 临界事件已配置</div>` : ''}
          </div>
        </div>`;
      });
      html += '</div></div>';
    });
    content.innerHTML = html;
  }

  // 关系阶段提升提示
  engine.on('relationshipStageUp', ({charId, stage, prevStage})=>{
    const char = STORY.characters[charId];
    if(!char) return;
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = window.t('★ {char} 关系阶段提升：{stage} · {title}', {char: window.t(char.name), stage: window.t(stage.name), title: window.t(stage.title)});
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 4000);
    if(stage.unlockMsg){
      toast(stage.unlockMsg);
    }
    if(screens.relations && screens.relations.classList.contains('active')){
      renderRelations();
    }
  });

  // ===== v0.0.13 每日任务 App =====
  function renderTasks(){
    // 顶部连胜
    $('tasks-streak').textContent = '🔥 ' + (engine.state.taskStreak || 0);
    const content = $('tasks-content');
    const tasks = engine.getDailyTasks();
    let html = `<div class="tasks-streak-banner">
      <div class="tasks-streak-num">${engine.state.taskStreak || 0}</div>
      <div class="tasks-streak-label">连续完成天数</div>
      <div class="tasks-streak-hint">${tasks.every(t=>t.completed) && tasks.length>0 ? '今日已全部完成 ✓' : `今日完成 ${tasks.filter(t=>t.completed).length}/${tasks.length}`}</div>
    </div>`;
    // 今日任务列表
    html += '<div class="tasks-section-title">今日任务</div>';
    if(tasks.length === 0){
      html += '<div style="font-size:12px;color:var(--ink-mute);padding:8px 0;">暂无任务</div>';
    } else {
      tasks.forEach(t=>{
        html += `<div class="task-item ${t.completed?'done':''}">
          <div class="task-check">${t.completed ? '✓' : ''}</div>
          <div class="task-info">
            <div class="task-name">${escapeHtml(t.name)}</div>
            <div class="task-desc">${escapeHtml(t.desc)}</div>
          </div>
          <div class="task-reward">+${t.reward?.coins || 0} 💰</div>
        </div>`;
      });
    }
    // 连胜奖励
    const rewards = STORY.dailyTasks?.streakRewards || [];
    if(rewards.length > 0){
      html += '<div class="tasks-section-title">连胜奖励</div>';
      html += '<div class="tasks-streak-rewards">';
      rewards.forEach(r=>{
        const claimed = engine.state.taskStreakClaimed[r.days];
        const unlocked = (engine.state.taskStreak || 0) >= r.days;
        const cls = claimed ? 'claimed' : (unlocked ? 'unlocked' : '');
        html += `<div class="streak-reward-item ${cls}">
          <div class="streak-reward-days">${r.days}天</div>
          <div class="streak-reward-info">
            <div class="streak-reward-name">${escapeHtml(r.name)}</div>
            <div class="streak-reward-desc">${escapeHtml(r.desc)} · 奖励 ${r.reward?.coins||0}💰${r.reward?.collectible?' +纪念品':''}</div>
          </div>
          ${claimed ? '<div class="streak-reward-claimed">已领取 ✓</div>' :
            (unlocked ? `<button class="streak-reward-claim" data-action="claim-streak" data-days="${r.days}">领取</button>` :
            `<div style="font-size:10px;color:var(--ink-mute)">还差 ${r.days - (engine.state.taskStreak||0)} 天</div>`)}
        </div>`;
      });
      html += '</div>';
    }
    content.innerHTML = html;
  }

  // 任务完成通知
  engine.on('dailyTaskCompleted', (tasks)=>{
    tasks.forEach(t=>{
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `✅ 任务完成：${t.name} +${t.reward?.coins||0}💰`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 3000);
    });
    if(screens.tasks && screens.tasks.classList.contains('active')){
      renderTasks();
    }
  });
  engine.on('streakRewardClaimed', (r)=>{
    toast(t('连胜奖励：{name} +{coins}💰', {name: r.name, coins: r.reward?.coins||0}));
    if(screens.tasks && screens.tasks.classList.contains('active')){
      renderTasks();
    }
  });
  engine.on('streakRewardAvailable', (rewards)=>{
    rewards.forEach(r=>{
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `🎁 连胜 ${r.days} 天达成！可领取：${r.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 4500);
    });
    if(screens.tasks && screens.tasks.classList.contains('active')){
      renderTasks();
    }
  });

  function claimStreakReward(days){
    const ok = engine.claimStreakReward(days);
    if(!ok) toast('暂不可领取');
    renderTasks();
  }

  // ===== v0.0.13 观赏模式 App =====
  function renderWatch(){
    const content = $('watch-content');
    const isOn = engine.state.watchMode;
    const curStrategy = engine.state.watchStrategy || 'balanced';
    const strategies = STORY.watchMode?.strategies || {};
    let html = `<div class="watch-status-card">
      <div class="watch-status-icon">${isOn ? '🎬' : '⏸'}</div>
      <div class="watch-status-title">${isOn ? '观赏模式 · 运行中' : '观赏模式 · 未开启'}</div>
      <div class="watch-status-sub">${isOn ? `策略：${escapeHtml(strategies[curStrategy]?.name || '平衡')}` : '开启后剧情将自动推进'}</div>
      <button class="watch-toggle-btn ${isOn?'off':''}" data-action="toggle-watch">${isOn ? '停止观赏' : '开启观赏模式'}</button>
    </div>`;
    // v0.5.10（F3）：导演视角——三周目起解锁的数值面板（剧情党考古用）
    if((engine.state.ngPlus || 0) >= 2){
      const aff = engine.state.affection, ad = engine.state.affectionDetail;
      const rows = ['shenyan','luci','jiangyu'].map(cid => {
        const c = STORY.characters[cid];
        const d = ad[cid] || {closeness:0, trust:0, tension:0};
        return `<div class="director-row"><span style="background:${c.bg}">${c.avatar}</span> ${escapeHtml(window.t(c.name))}
          好感 ${aff[cid]||0} · 密 ${d.closeness} / 信 ${d.trust} / 暧 ${d.tension}</div>`;
      }).join('');
      const flags = ['shenyan_resist','luci_confess','jiangyu_hold','solo_independent','group_dinner_hotpot','rain_event_done']
        .filter(f => engine.state.flags[f]).join('、') || '（关键 flag 未触发）';
      html += `<div class="watch-status-card" style="margin-top:12px">
        <div class="watch-status-icon">🎬</div>
        <div class="watch-status-title">导演视角 · 三周目</div>
        <div class="director-rows">${rows}</div>
        <div class="director-flags">关键走向：${flags}</div>
        <div class="watch-status-sub" style="font-size:11px">周目 ${engine.state.ngPlus + 1} · 结局达成 ${Object.keys(engine.state.endingSeen||{}).length}/17</div>
      </div>`;
    }
    html += '<div class="watch-section-title">选择自动策略</div>';
    html += '<div class="watch-strategy-list">';
    Object.values(strategies).forEach(s=>{
      html += `<div class="watch-strategy-item ${s.id===curStrategy?'selected':''}" data-watch-strategy="${s.id}">
        <div class="watch-strategy-icon">${WATCH_ICONS[s.id] || '🎯'}</div>
        <div class="watch-strategy-info">
          <div class="watch-strategy-name">${escapeHtml(s.name)}</div>
          <div class="watch-strategy-desc">${escapeHtml(s.desc)}</div>
        </div>
        ${s.id===curStrategy ? '<div class="watch-strategy-check">✓</div>' : ''}
      </div>`;
    });
    html += '</div>';
    html += `<div class="watch-info">
      💡 观赏模式下，遇到选项时引擎会按所选策略自动选择，剧情自动推进。适合反复体验不同路线与结局。<br>
      · 平衡：折中选择，体验完整剧情<br>
      · 好感优先：优先好感度+最高的选项<br>
      · 理性/感性：按性格偏好选择<br>
      · 随机：完全随机，可能触发不同结局
    </div>`;
    content.innerHTML = html;
  }
  const WATCH_ICONS = {balanced:'🎯', affection:'💖', rational:'🧠', emotional:'💫', random:'🎲'};

  function toggleWatchMode(){
    const newOn = !engine.state.watchMode;
    engine.setWatchMode(newOn);
    toast(newOn ? '观赏模式已开启' : '观赏模式已停止');
    renderWatch();
  }
  function setWatchStrategy(strategyId){
    engine.setWatchMode(engine.state.watchMode, strategyId);
    toast('策略已切换');
    renderWatch();
  }


/* ===== ui/18_affection_theme_gallery_dates.js ===== */
/* ===== 霓虹心事 · UI：好感度深度、主题壁纸、结局图鉴、约会 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.15 好感度深度 App =====
  function renderAffection(){
    const content = $('affection-content');
    if(!content) return;
    const list = engine.getAllAffectionDetail();
    const dims = STORY.affectionDimensions || {};
    let html = '';
    list.forEach(item => {
      const char = STORY.characters[item.charId];
      if(!char) return;
      const total = item.detail.closeness + item.detail.trust + item.detail.tension;
      const aff = engine.state.affection[item.charId] || 0;
      html += `<div class="aff-dim-card">
        <div class="aff-dim-header">
          <div class="aff-dim-avatar" style="background:${char.bg}">${avatarImg(char)}</div>
          <div class="aff-dim-info">
            <div class="aff-dim-name">${escapeHtml(window.t(char.name))}</div>
            <div class="aff-dim-total">综合好感 <strong>${aff}</strong> · 三轴合计 ${total}</div>
          </div>
        </div>`;
      ['closeness','trust','tension'].forEach(dimId => {
        const dim = dims[dimId] || {};
        const v = item.detail[dimId] || 0;
        const stage = item.stages[dimId] || {name:'-'};
        const pct = Math.min(100, (v/40)*100); // 40 为满格刻度
        html += `<div class="aff-dim-row">
          <div class="aff-dim-row-header">
            <div class="aff-dim-label">${dim.icon||''} ${escapeHtml(dim.name||dimId)}<span class="aff-dim-stage">${escapeHtml(stage.name||'-')}</span></div>
            <div class="aff-dim-value"><strong>${v}</strong></div>
          </div>
          <div class="aff-dim-bar"><div class="aff-dim-bar-fill ${dimId}" style="width:${pct}%"></div></div>
        </div>`;
      });
      html += `</div>`;
    });
    html += `<div class="watch-info" style="margin-top:6px;">
      💡 三轴说明：<br>
      · 🤝 亲密度：一起经历的事越多越亲密<br>
      · 🔐 信任度：他愿意对你敞开心扉的程度<br>
      · 💫 暧昧度：心跳加速的瞬间累积<br>
      新剧情选项会精细驱动三轴，旧选项按 50%/30%/20% 自动折算。
    </div>`;
    content.innerHTML = html;
  }

  // ===== v0.0.15 主题壁纸 App =====
  function renderThemes(){
    const content = $('themes-content');
    if(!content) return;
    const themes = STORY.themes || {};
    const iconThemes = STORY.iconThemes || {};
    const curTheme = engine.state.currentTheme || 'default';
    const curIcon = engine.state.currentIconTheme || 'default';
    let html = '<div class="themes-section-title">壁纸主题</div><div class="themes-grid">';
    Object.values(themes).forEach(t => {
      const unlocked = !!engine.state.unlockedThemes[t.id];
      const selected = t.id === curTheme;
      // v0.1.11: 预览与实际效果一致——壁纸图叠在渐变上层（与 applyThemeToBody 同规则）
      const bg = t.wallpaperImage
        ? `background:url('${t.wallpaperImage}') center/cover no-repeat, ${t.wallpaperVar || 'none'};`
        : (t.wallpaperVar ? `background:${t.wallpaperVar};` : '');
      html += `<div class="theme-card ${unlocked?'':'locked'} ${selected?'selected':''}" data-theme="${escapeHtml(t.id)}">
        <div class="theme-card-bg" style="${bg}"></div>
        <div class="theme-card-overlay">
          <div class="theme-card-name">${escapeHtml(t.name)}</div>
          <div class="theme-card-unlock">${unlocked ? '已解锁' : escapeHtml(t.unlockDesc||'未解锁')}</div>
        </div>
        ${selected ? '<div class="theme-card-check">✓</div>' : ''}
      </div>`;
    });
    html += '</div>';
    html += '<div class="themes-section-title">图标主题</div><div class="icon-theme-list">';
    Object.values(iconThemes).forEach(t => {
      const unlocked = !!engine.state.unlockedIconThemes[t.id];
      const selected = t.id === curIcon;
      html += `<div class="icon-theme-item ${unlocked?'':'locked'} ${selected?'selected':''}" data-icon-theme="${escapeHtml(t.id)}">
        <div class="icon-theme-preview">${selected?'✓':'🎨'}</div>
        <div class="icon-theme-info">
          <div class="icon-theme-name">${escapeHtml(t.name)}</div>
          <div class="icon-theme-unlock">${unlocked ? '已解锁' : escapeHtml(t.unlockDesc||'未解锁')}</div>
        </div>
      </div>`;
    });
    html += '</div>';
    html += `<div class="watch-info" style="margin-top:14px;">
      💡 主题通过剧情、任务、成就解锁。壁纸与图标独立切换，互不影响。<br>
      当前壁纸：<strong>${escapeHtml(themes[curTheme]?.name||'默认')}</strong> · 当前图标：<strong>${escapeHtml(iconThemes[curIcon]?.name||'默认')}</strong>
    </div>`;
    content.innerHTML = html;
  }
  function handleThemeClick(themeId){
    if(!engine.state.unlockedThemes[themeId]){
      toast('该主题尚未解锁');
      return;
    }
    const ok = engine.setTheme(themeId);
    if(ok){
      applyThemeToBody();
      toast('壁纸已切换');
      renderThemes();
    }
  }
  function handleIconThemeClick(themeId){
    if(!engine.state.unlockedIconThemes[themeId]){
      toast('该图标主题尚未解锁');
      return;
    }
    const ok = engine.setIconTheme(themeId);
    if(ok){
      toast('图标主题已切换');
      renderThemes();
    }
  }
  // 合成壁纸：氛围纹理(可选) + 主题图 + 主题渐变，写入 --wallpaper-1 与 --wallpaper-blend
  // v0.2.7 (M1.3): 氛围随 ambience 切换（雨天雾感/夜晚灯海/不安暗流），叠加在主题壁纸之上
  function composeWallpaper(){
    const t = engine.getCurrentTheme ? engine.getCurrentTheme() : null;
    const amb = engine.getCurrentAmbience ? engine.getCurrentAmbience() : null;
    const layers = [], blends = [];
    if(amb && amb.layerImage){
      layers.push(`url('${amb.layerImage}') center/cover no-repeat`);
      blends.push(amb.layerBlend || 'soft-light');
    }
    if(t && t.wallpaperImage){
      layers.push(`url('${t.wallpaperImage}') center/cover no-repeat`);
      blends.push('normal');
    }
    if(t && t.wallpaperVar){
      layers.push(t.wallpaperVar);
      blends.push('normal');
    }
    document.body.style.setProperty('--wallpaper-1', layers.length ? layers.join(', ') : 'none');
    document.body.style.setProperty('--wallpaper-blend', blends.length ? blends.join(', ') : 'normal');
  }
  // 把当前主题颜色变量写入 body，实现真实壁纸切换
  function applyThemeToBody(){
    const t = engine.getCurrentTheme ? engine.getCurrentTheme() : null;
    if(!t) return;
    if(t.bg) document.body.style.setProperty('--bg', t.bg);
    if(t.accent) document.body.style.setProperty('--accent', t.accent);
    composeWallpaper();  // v0.1.7: 图叠在渐变上层；v0.2.7: 再叠氛围纹理
    AudioSys.applyTheme(t.id);  // v0.1.7: 同步切换主题环境音
  }

  // ===== v0.0.15 结局图鉴 App =====
  // v0.5.10（F3）：未解锁结局的模糊线索（不剧透 flag 名）
  const DIRECTOR_HINTS = {
    shenyan_hidden: '在晚宴上守住自己，并留住一支画了五年的钢笔……',
    luci_hidden: '雨夜里追出去的人，会看到一封九年前的信……',
    jiangyu_hidden: '陪他唱完那首歌，歌词的线索藏在储物柜里……',
    shenyan_good: '正视他画的"她"，也正视自己的位置。',
    luci_good: '他收拾行李的那天，你的回答会改变一切。',
    jiangyu_good: '舞台上的最后一句，等一个人来接。',
    shenyan_bad: '被"展示"的时候，你沉默了。',
    luci_bad: '有些告别，一旦说出口就收不回。',
    jiangyu_bad: '空着的那个座位，等的人没有来。',
    solo_good: '谁的消息都不回的那个夜晚，你听见了自己。',
    solo_normal: '善意可以收下，边界也可以留下。',
    solo_bad: '把自己关在门里，窗也忘了开。',
    solo_hidden: '十件收藏，或一颗足够独立的心。',
    true_ending: '不依附任何路线，把霓城走完。',
  };
  function renderEndings(){
    const content = $('endings-content');
    if(!content) return;
    const all = engine.getEndingGallery();
    const tiers = [
      {id:'GOOD',   label:'Good Ending · 完美结局'},
      {id:'NORMAL', label:'Normal Ending · 普通结局'},
      {id:'BAD',    label:'Bad Ending · 遗憾结局'},
      {id:'HIDDEN', label:'Hidden Ending · 隐藏结局'}
    ];
    // 预测当前结局走向
    const curEndingId = engine.computeCurrentEnding ? engine.computeCurrentEnding() : null;
    const curEnding = curEndingId ? (STORY.endingGallery||{})[curEndingId] : null;
    let html = '';
    if(curEnding){
      html += `<div class="aff-dim-card" style="border-color:rgba(255,95,168,0.4);">
        <div class="aff-dim-name" style="margin-bottom:6px;">🔮 当前走向预测</div>
        <div class="ending-card-char">${escapeHtml(window.t(curEnding.charId ? (STORY.characters[curEnding.charId]?.name||curEnding.charId) : '独行线'))}</div>
        <div class="ending-card-name">${escapeHtml(curEnding.name)}</div>
        <div class="ending-card-desc">${escapeHtml(curEnding.desc)}</div>
      </div>`;
    } else if(engine.state.route){
      html += `<div class="watch-info" style="margin-bottom:12px;">当前路线：<strong>${escapeHtml(window.t(STORY.characters[engine.state.route]?.name || engine.state.route))}</strong>，结局尚未达成。</div>`;
    } else {
      html += `<div class="watch-info" style="margin-bottom:12px;">尚未进入任何路线。完成剧情后这里会预测你的结局走向。</div>`;
    }
    tiers.forEach(tier => {
      const items = all.filter(e => e.tier === tier.id);
      if(items.length === 0) return;
      html += `<div class="endings-tier-title ${tier.id.toLowerCase()}">${escapeHtml(tier.label)} · ${items.filter(e=>e.seen).length}/${items.length}</div>`;
      html += '<div class="endings-grid">';
      items.forEach(e => {
        html += `<div class="ending-card ${e.seen?'seen':'unseen'}">
          <div class="ending-card-tier ${e.tier}">${e.tier}</div>
          <div class="ending-card-char">${escapeHtml(window.t(e.charName))}</div>
          <div class="ending-card-name">${e.seen ? escapeHtml(e.name) : '???'}</div>
          <div class="ending-card-desc">${e.seen ? escapeHtml(e.desc) : escapeHtml(DIRECTOR_HINTS[e.id] || '尚未解锁此结局，继续游戏以发现它。')}</div>
        </div>`;
      });
      html += '</div>';
    });
    content.innerHTML = html;
    updateEndingsBadge();
  }

  // ===== v0.0.15 约会 App =====
  function renderDates(){
    const content = $('dates-content');
    if(!content) return;
    const stats = engine.getDateStats();
    let html = '';
    stats.forEach(s => {
      const char = STORY.characters[s.charId];
      if(!char) return;
      const statusText = s.canDate ? (s.availableScenes.length > 0 ? window.t('可约会') : window.t('本周场景已体验完')) : window.t('冷却中') + ' · ' + s.remainingDays + window.t('天');
      const statusClass = s.canDate && s.availableScenes.length > 0 ? 'available' : 'cooldown';
      html += `<div class="date-char-card">
        <div class="date-char-header">
          <div class="date-char-avatar" style="background:${char.bg}">${avatarImg(char)}</div>
          <div class="date-char-info">
            <div class="date-char-name">${escapeHtml(window.t(char.name))}</div>
            <div class="date-char-status ${statusClass}">${statusText}</div>
            <div class="date-char-progress">${window.t('已体验')} ${s.doneScenes}/${s.totalScenes}</div>
          </div>
        </div>
        <div class="date-scenes-list">`;
      const allScenes = (STORY.dateScenes && STORY.dateScenes[s.charId]) || [];
      allScenes.forEach(sc => {
        const isDone = !!engine.state.firedEvents[sc.id];
        const canPick = !isDone && s.canDate;
        const cls = isDone ? 'done' : (canPick ? '' : 'locked');
        // v0.6.6（P2-5）：未就绪时说明原因而非空白（此前只在角色级显示冷却，场景级一片空白）
        let statusHtml;
        if(isDone) statusHtml = '<span class="date-scene-status done">' + window.t('已体验') + '</span>';
        else if(canPick) statusHtml = '<span class="date-scene-status available">' + window.t('可约会') + '</span>';
        else if(!s.canDate) statusHtml = '<span class="date-scene-status locked">' + window.t('冷却中') + ' · ' + s.remainingDays + window.t('天') + '</span>';
        else statusHtml = '<span class="date-scene-status locked">' + window.t('本周已约过') + '</span>';
        html += `<div class="date-scene-item ${cls}" ${canPick?`data-date="${escapeHtml(sc.id)}"`:''}>
          <div class="date-scene-name">${escapeHtml(window.t(sc.name))}${statusHtml}</div>
          <div class="date-scene-desc">${escapeHtml(window.t(sc.desc))}</div>
        </div>`;
      });
      if(allScenes.length === 0){
        html += '<div class="date-scene-desc">暂无场景</div>';
      }
      html += `</div></div>`;
    });
    html += `<div class="watch-info" style="margin-top:6px;">
      💡 ${escapeHtml(window.t('每位男主每周（游戏内7天）可约会1次。完成约会会提升三轴好感，部分场景会解锁独家照片。'))}
    </div>`;
    content.innerHTML = html;
    updateDatesBadge();
  }

  // 约会模态：展示对话并允许完成
  let currentDateScene = null;
  function openDateScene(sceneId){
    let charId = null, scene = null;
    for(const cid in STORY.dateScenes || {}){
      const found = (STORY.dateScenes[cid]||[]).find(s=>s.id===sceneId);
      if(found){ charId = cid; scene = found; break; }
    }
    if(!scene || !charId) return;
    currentDateScene = {charId, sceneId, scene};
    const char = STORY.characters[charId];
    const content = $('date-scene-content');
    let html = `<div class="date-scene-title">${escapeHtml(scene.name)}</div>
      <div class="date-scene-bg-char" style="background:${char.bg}">${avatarImg(char)}</div>
      <div class="date-dialogue-list">`;
    (scene.dialogue||[]).forEach(d => {
      const who = d.who === 'me' ? 'me' : 'him';
      html += `<div class="date-dialogue-item ${who}">${escapeHtml(d.text||'')}</div>`;
    });
    html += `</div>
      <div class="date-scene-actions">
        <button class="date-scene-btn secondary" data-action="close-date">先离开</button>
        <button class="date-scene-btn" data-action="finish-date" data-finish-date="${escapeHtml(sceneId)}">完成约会</button>
      </div>`;
    content.innerHTML = html;
    showScreen('dateScene');
  }
  function closeDateScene(){
    // 玩家点"先离开"时取消约会，不消耗本周名额
    if(engine.cancelDate) engine.cancelDate();
    currentDateScene = null;
    showScreen('dates');
  }
  function handleDateClick(sceneId){
    if(!sceneId) return;
    const res = engine.startDate(sceneId);
    if(!res.ok){
      toast(res.reason || '无法发起约会');
      return;
    }
    openDateScene(sceneId);
  }
  function handleFinishDate(sceneId){
    const ok = engine.finishDate(sceneId);
    if(!ok){
      toast('约会结算失败');
      return;
    }
    const scene = currentDateScene && currentDateScene.scene;
    currentDateScene = null;
    toast(scene ? t('完成「{scene}」', {scene: scene.name}) : '约会完成');
    renderDates();
    showScreen('dates');
  }


/* ===== ui/19_listeners_nightmares.js ===== */
/* ===== 霓虹心事 · UI：引擎事件监听、梦魇、智能提示、朋友圈互动 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.0.15 引擎事件监听 =====
  engine.on('themesUnlocked', (items)=>{
    if(!items || items.length === 0) return;
    items.forEach(it => {
      const n = document.createElement('div');
      n.className = 'egg-notif';
      n.textContent = `🎨 解锁${it.type==='theme'?'壁纸':'图标'}主题：${it.name}`;
      document.body.appendChild(n);
      setUiTimeout(()=> n.remove(), 4500);
    });
    if(screens.themes && screens.themes.classList.contains('active')){
      renderThemes();
    }
  });
  engine.on('themeChanged', ()=>{
    applyThemeToBody();
  });
  engine.on('endingGalleryUpdated', ()=>{
    updateEndingsBadge();
    if(screens.endings && screens.endings.classList.contains('active')){
      renderEndings();
    }
  });
  engine.on('dateStarted', ({charId, scene})=>{
    // 用引擎事件触发模态（外部触发也支持）
    if(scene && !currentDateScene){
      openDateScene(scene.id);
    }
  });
  engine.on('dateFinished', ()=>{
    updateDatesBadge();
  });

  // ===== v0.0.16 梦魇 App =====
  function renderDreams(){
    const content = $('dreams-content');
    if(!content) return;
    const all = Object.values(STORY.nightmares || {});
    const seen = engine.state.nightmaresSeen || {};
    let html = `<div class="watch-info" style="margin-bottom:12px;">
      💡 当三轴好感过低或暧昧却不够信任时，夜晚会触发梦魇。梦魇影响次日心情与性格画像。<br>
      已触发 ${all.filter(n=>seen[n.id]).length}/${all.length} 个梦魇。
    </div>`;
    all.forEach(nm => {
      const isSeen = !!seen[nm.id];
      html += `<div class="dream-card ${isSeen?'seen':'unseen'}">
        <div class="dream-card-status">${isSeen?'已触发':'未触发'}</div>
        <div class="dream-card-icon">🌙</div>
        <div class="dream-card-name">${isSeen ? escapeHtml(nm.name) : '???'}</div>
        <div class="dream-card-desc">${isSeen ? escapeHtml(nm.desc) : '尚未触发此梦魇。'}</div>
      </div>`;
    });
    content.innerHTML = html;
    updateDreamsBadge();
  }

  // 梦魇触发模态
  let currentNightmare = null;
  function openNightmareScreen(nm){
    currentNightmare = nm;
    const content = $('nightmare-content');
    // v0.5.2（E5）：空舞台梦魇配专属 CG
    const nmCg = nm.id === 'nightmare_stage' ? '<img class="nightmare-cg" src="assets/cg/cg_nightmare_stage.jpg" alt="" loading="lazy">' : '';
    let html = `<div class="nightmare-title">🌙 ${escapeHtml(nm.name)}</div>${nmCg}`;
    html += '<div class="nightmare-dialogue">';
    (nm.dialogue||[]).forEach(d => {
      const who = d.who === 'me' ? 'me' : (d.who === 'narrator' ? 'narrator' : 'him');
      html += `<div class="nightmare-dialogue-item ${who}">${escapeHtml(d.text||'')}</div>`;
    });
    html += '</div>';
    if(nm.resolve){
      html += `<div class="nightmare-prompt">${escapeHtml(nm.resolve.prompt||'你的选择：')}</div>`;
      html += '<div class="nightmare-options">';
      nm.resolve.options.forEach((opt, idx) => {
        html += `<button class="nightmare-opt" data-nightmare-opt="${idx}">${escapeHtml(opt.text)}</button>`;
      });
      html += '</div>';
    } else {
      html += `<div class="nightmare-options">
        <button class="nightmare-opt" data-action="close-nightmare">醒来</button>
      </div>`;
    }
    content.innerHTML = html;
    showScreen('nightmare');
  }
  function closeNightmareScreen(){
    currentNightmare = null;
    if(!restorePendingUi()) showScreen('home');
  }
  function handleNightmareOpt(optIdx){
    if(!currentNightmare) return;
    const nm = currentNightmare;
    if(!engine.resolveNightmare(nm.id, optIdx)) return;
    toast('梦魇已解');
    currentNightmare = null;
    if(!restorePendingUi()) showScreen('home');
  }

  function restorePendingUi(){
    const activeNightmareId = engine.state.activeNightmare;
    if(activeNightmareId && STORY.nightmares?.[activeNightmareId]){
      openNightmareScreen(STORY.nightmares[activeNightmareId]);
      return true;
    }
    const activeDreamId = engine.state.activeDream;
    if(activeDreamId && STORY.dreams?.[activeDreamId]){
      openDreamScreen(activeDreamId, STORY.dreams[activeDreamId]);
      return true;
    }
    const pending = engine.getPendingInteractions?.()[0] || engine.state.pendingInteraction;
    if(pending?.type === 'call'){
      const evt = STORY.events?.[pending.eventId];
      const char = evt && STORY.characters?.[evt.from];
      if(evt?.type === 'call' && char){
        showIncomingCall({from:evt.from, name:char.name, script:evt.script, eventId:pending.eventId});
        return true;
      }
    }
    if(pending?.type === 'encounter'){
      const encounter = engine.getPendingEncounter?.();
      if(encounter){
        showEncounter(encounter);
        return true;
      }
    }
    if(pending?.type === 'narrator_choice' && pending.choice){
      showScreen('home');
      showNarratorChoice(pending.choice);
      return true;
    }
    if(pending?.type === 'route_choice' && !engine.state.route){
      showRouteChoiceModal(STORY.routeChoice);
      return true;
    }
    const advancing = engine.state.pendingTimeAdvances?.[0];
    if(advancing) showTimeAdvanceOverlay(STORY.events?.[advancing.eventId]?.text);
    return false;
  }

  // ===== v0.0.16 智能提示 App =====
  function renderHints(){
    const content = $('hints-content');
    if(!content) return;
    const isOn = !!engine.state.showOptionHints;
    let html = `<div class="hints-status-card">
      <div class="hints-status-icon">${isOn ? '💡' : '💤'}</div>
      <div class="hints-status-title">${isOn ? '智能提示 · 开启' : '智能提示 · 关闭'}</div>
      <div class="hints-status-sub">${isOn ? '选项下方会显示好感度/性格/剧情标记的影响预测' : '开启后，剧情选项会显示潜在影响提示'}</div>
      <button class="hints-toggle-btn ${isOn?'off':''}" data-action="toggle-hints">${isOn ? '关闭提示' : '开启提示'}</button>
    </div>`;
    html += `<div class="hints-example">
      <div class="hints-example-title">提示样式示例</div>
      <div class="hints-example-text">沈砚之 +2 · 沈砚之(亲密+1/信任+2) · 解锁 1 个剧情标记 · 性格+active/emotional</div>
    </div>`;
    html += `<div class="watch-info" style="margin-top:14px;">
      💡 适合二周目玩家或想提前规划路线的人。提示文案由选项的 effects 字段自动生成，不会泄露隐藏剧情。<br>
      · 数字提示：综合好感度增减<br>
      · 三轴提示：亲密度/信任度/暧昧度<br>
      · 标记提示：会影响哪些剧情分支<br>
      · 性格提示：会被记录的性格画像维度
    </div>`;
    content.innerHTML = html;
  }
  function toggleOptionHints(){
    engine.setShowOptionHints(!engine.state.showOptionHints);
    toast(engine.state.showOptionHints ? '智能提示已开启' : '智能提示已关闭');
    renderHints();
  }

  // ===== v0.0.16 男主朋友圈互动 UI =====
  // 在 renderMoments 时为每条朋友圈追加男主评论+回复选项
  // 这里给 engine.on('momentPosted') 添加触发评论生成的钩子
  // （renderMoments 内部直接读取 moment.comments 渲染）

  // ===== v0.0.16 引擎事件监听 =====
  engine.on('nightmareTriggered', (nm)=>{
    // 顶部通知
    const n = document.createElement('div');
    n.className = 'egg-notif';
    n.textContent = `🌙 梦魇触发：${nm.name}`;
    document.body.appendChild(n);
    setUiTimeout(()=> n.remove(), 4500);
    // 弹出梦魇模态
    openNightmareScreen(nm);
    updateDreamsBadge();
  });
  engine.on('nightmareResolved', ()=>{
    updateDreamsBadge();
  });
  engine.on('optionHintsToggled', ()=>{
    // 重新渲染聊天界面（如果正在显示）
    if(currentConvId && screens.chat.classList.contains('active')){
      const conv = engine.state.conversations[currentConvId];
      if(conv && conv.pendingChoice){
        showChatChoice(currentConvId, conv.pendingChoice);
      }
    }
  });
  engine.on('ambienceChange', (amb)=>{
    applyAmbienceToBody(amb);
    // v0.2.4: 氛围变化同步切换环境音底噪档（雨声/夜晚底噪）
    AudioSys.applyAmbience(amb?.id || 'day');
  });
  engine.on('momentCommentsGenerated', ({momentId, comments})=>{
    // 把评论写到对应 moment 对象上（供 renderMoments 显示）
    const moment = engine.state.moments.find(m => m.id === momentId);
    if(moment){
      moment.charComments = comments;
    }
    if(screens.moments && screens.moments.classList.contains('active')){
      renderMoments();
    }
  });
  engine.on('momentReplySent', ({momentId, charId})=>{
    if(screens.moments && screens.moments.classList.contains('active')){
      renderMoments();
    }
    toast('已回复');
  });


/* ===== ui/20_saves.js ===== */
/* ===== 霓虹心事 · UI：存档 App =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== v0.1.0 存档 App =====
  function formatSaveTime(iso){
    if(!iso) return '—';
    try {
      const d = new Date(iso);
      if(Number.isNaN(d.getTime())) return '—';
      const pad = n => String(n).padStart(2,'0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch(_){
      return '—';
    }
  }
  function slotDisplayName(slot){
    if(slot === 'auto') return window.t('自动存档');
    if(slot === 'slot1') return window.t('手动槽位 1');
    if(slot === 'slot2') return window.t('手动槽位 2');
    if(slot === 'slot3') return window.t('手动槽位 3');
    return slot;
  }
  function updateSavesBadge(){
    const b = $('badge-saves');
    const counter = $('saves-counter');
    const slots = engine.listSaveSlots ? engine.listSaveSlots() : [];
    const used = slots.filter(s => !s.empty).length;
    if(b){
      if(used > 0){ b.textContent = used; b.hidden = false; }
      else b.hidden = true;
    }
    if(counter) counter.textContent = `${used}/${slots.length || 4}`;
  }
  function updateLockContinueBtn(){
    const btn = $('lock-continue-btn');
    if(!btn) return;
    const has = engine.hasAnySave ? engine.hasAnySave() : false;
    btn.hidden = !has;
  }
  function afterLoadRefresh(){
    resetTransientUi();
    updateTimeDisplay();
    updateBadges();
    updateSavesBadge();
    updateLockContinueBtn();
    applyThemeToBody();
    applyAmbienceToBody(engine.getCurrentAmbience ? engine.getCurrentAmbience() : null);
    // 关闭可能残留的覆盖层，再按存档中的进行中状态恢复。
    currentDateScene = null;
    if(screens.dateScene) screens.dateScene.classList.remove('active');
    if(screens.nightmare) screens.nightmare.classList.remove('active');
    return restorePendingUi();
  }
  function renderSaves(){
    const content = $('saves-content');
    if(!content || !engine.listSaveSlots) return;
    const slots = engine.listSaveSlots();
    let html = `<div class="saves-intro">${escapeHtml(window.t('自动存档会在关键进度变化时写入。手动槽位可长期保留；支持导出/导入 JSON。'))}</div>`;
    slots.forEach(s => {
      const summary = s.summary || {};
      const title = slotDisplayName(s.slot);
      const tag = s.isAuto ? 'AUTO' : 'MANUAL';
      const meta = s.empty
        ? window.t('空槽位 · 可写入当前进度')
        : `${escapeHtml(s.label || '')}<br>${escapeHtml(window.t(summary.playerName || '林夏'))} · ${escapeHtml(window.t(summary.routeLabel || '未选线'))}<br>${escapeHtml(formatSaveTime(s.time))}${s.note ? ' · ' + escapeHtml(window.t(s.note)) : ''}`;
      html += `<div class="save-slot ${s.empty?'empty':''}">
        <div class="save-slot-top">
          <div class="save-slot-title">${escapeHtml(title)}</div>
          <div class="save-slot-tag">${tag}</div>
        </div>
        <div class="save-slot-meta">${meta}</div>
        <div class="save-slot-actions">
          <button class="save-btn primary" data-save-action="write" data-slot="${escapeHtml(s.slot)}">${s.empty?window.t('写入'):window.t('覆盖写入')}</button>
          ${s.empty ? '' : `<button class="save-btn primary" data-save-action="load" data-slot="${escapeHtml(s.slot)}">${window.t('读取')}</button>
          <button class="save-btn" data-save-action="export" data-slot="${escapeHtml(s.slot)}">${window.t('导出')}</button>
          <button class="save-btn danger" data-save-action="delete" data-slot="${escapeHtml(s.slot)}">${window.t('删除')}</button>`}
          <button class="save-btn" data-save-action="import" data-slot="${escapeHtml(s.slot)}">${window.t('导入到此')}</button>
        </div>
      </div>`;
    });
    html += `<div class="saves-intro" style="margin-top:8px;">${escapeHtml(window.t('提示：删除仅影响本地浏览器存档，不会回滚剧情文件。'))}</div>`;
    content.innerHTML = html;
    updateSavesBadge();
  }
  function downloadText(filename, text){
    const blob = new Blob([text], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setUiTimeout(()=> URL.revokeObjectURL(url), 1000);
  }
  function handleSaveAction(action, slot){
    if(!action) return;
    if(action === 'write'){
      const ok = engine.save(slot || 'slot1', {note: '手动存档'});
      toast(ok ? t('已保存到 {slot}', {slot: slotDisplayName(slot)}) : '保存失败');
      renderSaves();
      updateLockContinueBtn();
      return;
    }
    if(action === 'load'){
      const ok = engine.load(slot);
      if(ok){
        const restored = afterLoadRefresh();
        toast(t('已读取 {slot}', {slot: slotDisplayName(slot)}));
        if(!restored) showScreen('home');
      } else toast('读取失败');
      return;
    }
    if(action === 'delete'){
      if(!confirm(`确认删除 ${slotDisplayName(slot)}？`)) return;
      const ok = engine.deleteSave(slot);
      toast(ok ? '已删除' : '删除失败');
      renderSaves();
      updateLockContinueBtn();
      return;
    }
    if(action === 'export'){
      const text = engine.exportSave(slot);
      if(!text){ toast('导出失败'); return; }
      downloadText(`neon-heart-${slot}.json`, text);
      toast('已导出');
      return;
    }
    if(action === 'import'){
      const input = $('save-import-input');
      if(!input){ toast('导入控件缺失'); return; }
      input.value = '';
      input.onchange = ()=>{
        const file = input.files && input.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = ()=>{
          const res = engine.importSave(String(reader.result || ''), slot || 'slot1');
          if(res && res.ok){
            toast(t('已导入到 {slot}', {slot: slotDisplayName(res.slot || slot)}));
            renderSaves();
            updateLockContinueBtn();
          } else {
            toast(t('导入失败：{reason}', {reason: res?.reason || '未知错误'}));
          }
        };
        reader.readAsText(file);
      };
      input.click();
    }
  }

  // 氛围层应用到 body
  function applyAmbienceToBody(amb){
    const overlay = amb?.wallpaperOverlay || 'transparent';
    document.body.style.setProperty('--ambience-overlay', overlay);
    // 应用到 #phone-frame::before
    const phoneFrame = document.getElementById('phone-frame');
    if(phoneFrame){
      phoneFrame.style.setProperty('--ambience-overlay', overlay);
    }
    // v0.2.7 (M1.3): 同步把氛围纹理合成进壁纸层
    if(typeof composeWallpaper === 'function') composeWallpaper();
  }

  function handleMomentReply(replyData){
    // replyData 格式: `${momentId}|${charId}|${commentIdx}|${replyIdx}`
    const parts = replyData.split('|');
    if(parts.length !== 4) return;
    const [momentId, charId, commentIdx, replyIdx] = parts;
    engine.replyMomentComment(momentId, charId, parseInt(commentIdx), parseInt(replyIdx));
  }

  engine.on('gameSaved', ()=>{
    updateSavesBadge();
    updateLockContinueBtn();
    if(screens.saves && screens.saves.classList.contains('active')) renderSaves();
  });
  engine.on('gameLoaded', ()=>{
    afterLoadRefresh();
  });
  engine.on('gameDeleted', ()=>{
    updateSavesBadge();
    updateLockContinueBtn();
  });
  engine.on('gameImported', ()=>{
    updateSavesBadge();
    updateLockContinueBtn();
  });
  engine.on('saveFailed', ({error})=>{
    toast(t('存档失败：{reason}', {reason: error || '未知错误'}));
  });


/* ===== ui/22_settings.js ===== */
/* ===== 霓虹心事 · UI：设置 App（v0.4.8 阶段 E1）=====
 * 语言（zh-CN/en-US）/ 音量三分级（master/music/sfx）/ 减弱动效 / 选项提示 / 观赏模式。
 * 持久化：neon_vol（audio.js）、neon_reduce_motion（本文件）、neon_lang（i18n 侧）。
 */
  // ===== 设置 App =====
  function renderSettings(){
    const body = $('settings-body');
    if(!body) return;
    const lang = (typeof I18N !== 'undefined' && I18N.getLang) ? I18N.getLang() : 'zh-CN';
    const vols = AudioSys.getVolumes();
    const reduce = localStorage.getItem('neon_reduce_motion') === '1';
    const hints = engine.state.showOptionHints !== false;
    const watch = !!engine.state.watchMode?.enabled;
    body.innerHTML = `
      <div class="set-group">
        <div class="set-title">${window.t('语言 Language')}</div>
        <div class="set-row">
          <label><input type="radio" name="set-lang" value="zh-CN" ${lang==='zh-CN'?'checked':''}> ${window.t('中文')}</label>
          <label><input type="radio" name="set-lang" value="en-US" ${lang==='en-US'?'checked':''}> English</label>
        </div>
        <div class="set-note">${window.t('剧情文本将随语言逐步补全，未翻译处回退中文。')}</div>
      </div>
      <div class="set-group">
        <div class="set-title">${window.t('声音')}</div>
        <div class="set-row set-slider"><span>${window.t('总音量')}</span><input type="range" min="0" max="100" value="${Math.round(vols.master*100)}" data-vol="master"></div>
        <div class="set-row set-slider"><span>${window.t('音乐')}</span><input type="range" min="0" max="100" value="${Math.round(vols.music*100)}" data-vol="music"></div>
        <div class="set-row set-slider"><span>${window.t('音效')}</span><input type="range" min="0" max="100" value="${Math.round(vols.sfx*100)}" data-vol="sfx"></div>
        <div class="set-row">
          <label><input type="checkbox" id="set-sound" ${AudioSys.isEnabled()?'checked':''}> ${window.t('提示音效')}</label>
          <label><input type="checkbox" id="set-bgm" ${AudioSys.isBgmEnabled()?'checked':''}> ${window.t('环境音乐')}</label>
        </div>
      </div>
      <div class="set-group">
        <div class="set-title">${window.t('画面与辅助')}</div>
        <div class="set-row">
          <label><input type="checkbox" id="set-reduce" ${reduce?'checked':''}> ${window.t('减弱动效')}</label>
        </div>
        <div class="set-row">
          <label><input type="checkbox" id="set-hints" ${hints?'checked':''}> ${window.t('选项提示')}</label>
          <label><input type="checkbox" id="set-watch" ${watch?'checked':''}> ${window.t('观赏模式')}</label>
        </div>
      </div>
      <div class="set-note">${window.t('设置即时生效并自动保存。')}</div>
    `;
    bindSettings();
  }

  function bindSettings(){
    const body = $('settings-body');
    // 语言
    body.querySelectorAll('input[name="set-lang"]').forEach(r => {
      r.addEventListener('change', () => {
        if(typeof I18N !== 'undefined' && I18N.setLang){
          I18N.setLang(r.value);
          try { localStorage.setItem('neon_lang', r.value); } catch(_) {}
          renderSettings();
        }
      });
    });
    // 音量滑杆
    body.querySelectorAll('input[data-vol]').forEach(sl => {
      sl.addEventListener('input', () => AudioSys.setVolume(sl.dataset.vol, sl.value / 100));
    });
    // 声音开关
    const snd = $('set-sound'), bgm = $('set-bgm');
    if(snd) snd.addEventListener('change', () => { AudioSys.setSound(snd.checked); });
    if(bgm) bgm.addEventListener('change', () => { AudioSys.setBgm(bgm.checked); });
    // 减弱动效
    const red = $('set-reduce');
    if(red) red.addEventListener('change', () => {
      document.body.classList.toggle('reduce-motion', red.checked);
      try { localStorage.setItem('neon_reduce_motion', red.checked ? '1' : '0'); } catch(_) {}
    });
    // 选项提示 / 观赏模式（复用引擎既有开关）
    const hints = $('set-hints');
    if(hints) hints.addEventListener('change', () => { engine.setShowOptionHints(hints.checked); });
    const watch = $('set-watch');
    if(watch) watch.addEventListener('change', () => { engine.setWatchMode(watch.checked); renderSettings(); });
  }

  // 启动时应用持久化的减弱动效与语言
  (function applyPersistedSettings(){
    try {
      if(localStorage.getItem('neon_reduce_motion') === '1') document.body.classList.add('reduce-motion');
      const lang = localStorage.getItem('neon_lang');
      if(lang && typeof I18N !== 'undefined' && I18N.setLang) I18N.setLang(lang);
    } catch(_) {}
  })();

  // v0.5.4（E4）：语言切换后重渲染当前可见文本（已渲染 DOM 不会自动重译）
  window.addEventListener('i18nchange', () => {
    try {
      updateTimeDisplay();   // v0.7.7：主屏日期走 i18n 模板，语言切换后需重算（widget-date/锁屏日期）
      if(screens.chat && screens.chat.classList.contains('active') && typeof currentConvId === 'string'){
        renderChatBody(currentConvId);
        const conv = engine.state.conversations[currentConvId];
        $('chat-status').textContent = conv && conv.typing ? t('正在输入…') : t('在线');
      }
      if(screens.messages && screens.messages.classList.contains('active')) renderConvList();
      if(screens.settings && screens.settings.classList.contains('active')) renderSettings();
    } catch(_) {}
  });


/* ===== ui/23_idle_hint.js ===== */
/* ===== 霓虹心事 · UI：空窗期引导（v0.6.6 P0-1）=====
 * 问题：玩家回复完所有消息后游戏静默停摆——唯一推进时间的方式（出行）无任何提示，
 * 玩家不知道该做什么，误以为"没内容了"。
 * 方案：检测"无待办空窗"（消息全清 + 无待发 + 无挂起交互 + 非结局态）持续 ~8 秒后，
 * 弹出可点击的引导气泡（带 10 分钟冷却），点击直达出行页。
 */
  // ===== 空窗期引导 =====
  let idleHintEl = null;
  let idleHintTimer = null;
  let idleHintLastAt = 0;      // 上次展示时间（冷却 10 分钟）
  let idleWatchStart = null;   // 空窗开始时刻

  function dismissIdleHint(){
    if(idleHintEl){ idleHintEl.remove(); idleHintEl = null; }
  }

  function isIdleWindow(){
    const e = engine.state;
    if(e.ended) return false;
    const hasUnread = Object.values(e.conversations).some(c => c.unread > 0);
    const hasPendingChoice = Object.values(e.conversations).some(c => c.pendingChoice);
    const hasPendingMsgs = (e.pendingMessages || []).length > 0;
    const hasPendingQueue = engine.getPendingInteractions?.().length > 0;
    // v0.7.3：忽略 activeDream（梦境屏是全屏覆盖层有强制选择，不会真正卡住玩家）
    const hasActiveNightmare = !!e.activeNightmare;
    return !hasUnread && !hasPendingChoice && !hasPendingMsgs && !hasPendingQueue && !hasActiveNightmare;
  }

  const IDLE_MESSAGES = [
    '消息都回完了。出门走走？霓城的街角，说不定有人等你 🚶',
    '现在的你很闲——去「出行」转转，时间会往前走 ✨',
    '手机安静下来了。出门一趟，也许会遇见谁 🌃',
  ];

  function showIdleHint(){
    if(idleHintEl || Date.now() - idleHintLastAt < 10 * 60 * 1000) return;
    idleHintLastAt = Date.now();
    dismissIdleHint();
    idleHintEl = document.createElement('div');
    idleHintEl.className = 'idle-hint';
    idleHintEl.setAttribute('role', 'button');
    idleHintEl.tabIndex = 0;
    idleHintEl.textContent = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
    idleHintEl.onclick = ()=>{
      dismissIdleHint();
      openApp('map');
    };
    idleHintEl.addEventListener('keydown', ev=>{ if(ev.key === 'Enter' || ev.key === ' ') idleHintEl.click(); });
    document.body.appendChild(idleHintEl);
    // 12 秒后自动消失
    setUiTimeout(dismissIdleHint, 12000);
  }

  // 每秒检查一次空窗状态；连续空窗 8 秒触发（避免通知间隙误触）
  function startIdleWatch(){
    if(idleHintTimer) return;
    idleHintTimer = setInterval(()=>{
      const screen = document.querySelector('.screen.active')?.id || '';
      // 只在主屏/锁屏之外的轻打扰：主屏展示，其他 App 内不打扰（玩家正在探索）
      if(isIdleWindow()){
        if(!idleWatchStart) idleWatchStart = Date.now();
        else if(Date.now() - idleWatchStart > 8000 && (screen === 'home-screen')){
          showIdleHint();
          idleWatchStart = null;
        }
      } else {
        idleWatchStart = null;
        dismissIdleHint();
      }
    }, 1000);
  }
  // 游戏加载完成后启动观察（锁屏/结局态自动被 isIdleWindow/屏检测排除）
  startIdleWatch();


/* ===== ui/24_app_unlock.js ===== */
/* ===== 霓虹心事 · UI：App 渐进解锁（v0.6.6 P0-2）=====
 * 问题：开局 31 个 App 全部可见，认知过载且空架子误导探索。
 * 方案：开局只亮核心 8 个；其余按剧情事件解锁——解锁时刻推通知（"手机装上了新 App"），
 *       把解锁本身变成奖励反馈。解锁状态存 state.appsUnlocked（随存档走，二周目继承）。
 * 实现：渲染层过滤（CSS 类隐藏 + 每秒对账），不改静态 HTML；openApp 拦截未解锁提示。
 */
  // ===== App 渐进解锁 =====
  // 解锁条件：故事事件 flag 或一次性剧情触发（keyed by app id）
  const APP_UNLOCK_RULES = {
    // 核心开局组（无条件）
    messages: null, phone: null, moments: null, album: null,
    music: null, notes: null, settings: null, saves: null,
    // 剧情解锁组（flag 达成即亮）
    calendar:    s => (s.collected || []).length > 0 || s.day >= 3,       // 首件收集/第3天：日程感建立
    map:         s => s.day >= 2,                                          // 第二天可以出门
    profile:     s => s.day >= 2,
    contacts:    s => s.day >= 2,
    shop:        s => s.day >= 3,                                          // 商城随剧情接触
    tarot:       s => s.day >= 3,
    mood:        s => s.day >= 3,
    groups:      s => !!s.flags?.group_created_group_neon,                 // 群聊建群时
    collection:  s => (s.collected || []).length >= 2,                     // v0.6.9：第 2 件起（序章首件明信片不触发，避免开局空柜）
    achievements:s => Object.keys(s.achievements || {}).length >= 1,       // 第一个成就
    puzzles:     s => (s.discoveredClues && Object.keys(s.discoveredClues).length >= 1) || s.day >= 5,
    hints:       s => s.day >= 4,
    dates:       s => s.day >= 6,                                          // 约会随剧情位置出现
    affection:   s => s.day >= 5,
    relations:   s => s.day >= 5,
    player:      s => s.day >= 4,
    themes:      s => Object.keys(s.unlockedThemes || {}).length >= 2,     // 第二套主题解锁时
    endings:     s => Object.keys(s.endingSeen || {}).length >= 1,         // 首个结局后（或图鉴预测）
    dreams:      s => s.day >= 7,
    tasks:       s => s.day >= 5,     // v0.6.7：每日任务 day5 上线（此前漏配导致开局可见）
    watch:       s => s.day >= 8,
    'perspective': s => s.day >= 9,
    calendar2:   s => s.day >= 10,   // 节日 App（data-app=calendar2，v0.6.9 修正：此前误写 holiday 导致永远可见）
  };

  const APP_NAMES = {
    calendar:'日历', map:'出行', profile:'画像', contacts:'通讯录', shop:'礼物商城',
    tarot:'塔罗占卜', mood:'心情', groups:'群聊', collection:'收集柜', achievements:'成就',
    puzzles:'线索本', hints:'智能提示', dates:'约会', affection:'好感度深度',
    relations:'关系', player:'主角档案', themes:'主题', endings:'结局图鉴',
    dreams:'梦魇录', watch:'观赏模式', perspective:'男主视角', calendar2:'节日',
  };

  function computeUnlockedApps(state){
    const set = new Set();
    for(const [app, cond] of Object.entries(APP_UNLOCK_RULES)){
      if(cond === null){ set.add(app); continue; }
      try { if(cond(state)) set.add(app); } catch(_) {}
    }
    // 没有规则的 App（后续新增）默认可见——规则缺省不隐藏
    return set;
  }

  function applyAppUnlocks(){
    const prev = engine.state.appsUnlocked || {};
    const now = computeUnlockedApps(engine.state);
    let newly = [];
    for(const app of now){
      if(!prev[app]){ newly.push(app); prev[app] = true; }
    }
    engine.state.appsUnlocked = prev;
    // 视觉过滤：未解锁的图标隐藏（保留 DOM，解锁即亮）
    const grid = document.getElementById('app-grid');
    if(grid){
      [...grid.querySelectorAll('.app-icon')].forEach(el => {
        const app = el.dataset.app;
        el.hidden = !!(app && !now.has(app) && app in APP_UNLOCK_RULES);
      });
    }
    // 新解锁：亮起动画 + 通知（一次最多报 1 条，避免轰炸）
    if(newly.length && engine.state.day > 1){   // day1 的初始解锁不通知
      const app = newly[0];
      const name = APP_NAMES[app] || app;
      el_unlock_pulse(app);
      showNotif('susu', `📱 新 App 上线：${name}`);
      if(newly.length > 1) console.info('[apps] 本批解锁', newly);
    }
    return newly;
  }

  function el_unlock_pulse(app){
    const el = document.querySelector(`.app-icon[data-app="${app}"]`);
    if(!el) return;
    el.hidden = false;
    el.style.animation = 'appUnlock 0.8s ease';
    setUiTimeout(()=>{ el.style.animation = ''; }, 900);
  }

  // openApp 拦截：未解锁时提示（防止通过通知/其他入口提前进入）
  const _origOpenApp = openApp;
  openApp = function(app){
    const now = computeUnlockedApps(engine.state);
    if(app in APP_UNLOCK_RULES && !now.has(app)){
      toast('这个 App 还没上线——继续剧情，它会随故事出现');
      return;
    }
    return _origOpenApp(app);
  };

  // 状态变化时对账（含读档）
  engine.on('stateChange', ()=> applyAppUnlocks());
  engine.on('gameLoaded', ()=> { applyAppUnlocks(); });


/* ===== ui/21_init.js ===== */
/* ===== 霓虹心事 · UI：初始化与测试钩子 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 初始化 =====
  function init(){
    updateTimeDisplay();
    engine.startAutoSave();
    // 有存档则恢复进度，否则新开一局
    if(engine.hasAnySave()){
      const ok = engine.continueGame();
      if(!ok) engine.newGame();
    } else {
      engine.newGame();
    }
    afterLoadRefresh();
    muteNotifs(4000);   // v0.6.3：开局/续玩 4 秒内不弹通知，先让玩家看清界面
    AudioSys.applyTheme(engine.state.currentTheme);  // v0.1.7: 启动时按当前主题配置环境音
    // 启动后再强制写一次自动存档，保证下次能继续
    engine.autoSave(true);
    updateLockContinueBtn();
    showScreen('lock');
  }
  if(typeof window !== 'undefined' && (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')){
    window.__neonTest = {engine, restorePendingUi, showEncounter, closeEncounter};
  }
  init();


/* ===== pwa.js ===== */
/* ===== 霓虹心事 · PWA 注册 =====
 * 注册 Service Worker（离线游玩 / 添加到主屏幕）。
 * file:// 协议或浏览器不支持时静默跳过，不影响正常游戏。
 */
(function(){
  // v0.2.0: 前端错误上报（自有服务器 /collect-error，nginx 记入 neon-errors.log）
  // v0.8.1: 仅自有服务器启用；HF Space / GitHub Pages / 本地无该端点，避免制造 404
  // 只上报摘要（消息+位置+当前版本），节流 30s 一条，静默失败不影响游玩
  let lastReportAt = 0;
  const REPORT_ENABLED = location.hostname === 'oh.sbbz.tech' || location.port === '9443';
  const report = msg => {
    if(!REPORT_ENABLED) return;
    const now = Date.now();
    if(now - lastReportAt < 30000) return;
    lastReportAt = now;
    try {
      const v = document.querySelector('meta[name="version"]')?.content || '';
      navigator.sendBeacon(`/collect-error?e=${encodeURIComponent(String(msg).slice(0, 300))}&v=${encodeURIComponent(v)}`);
    } catch(_) {}
  };
  window.addEventListener('error', e => report(e.message + ' @' + (e.filename || '') + ':' + (e.lineno || 0)));
  window.addEventListener('unhandledrejection', e => report('unhandledrejection: ' + (e.reason && e.reason.message ? e.reason.message : e.reason)));

  if(typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  if(location.protocol !== 'https:' && location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.info('[PWA] Service Worker 注册失败（不影响游玩）:', err.message);
    });
  });
})();

