/* ===== 霓虹心事 · 核心类型文档（JSDoc typedef） =====
 * 类型化的第一步（v0.1.13）：纯文档，不参与运行、不被 index.html 引入。
 * 用途：IDE 悬停提示 + 后续 JSDoc/TS 渐进落地的权威参照。
 * 维护约定：state/story 结构性变更时同步更新本文件（check:ui 会做语法编译校验）。
 */

/**
 * 三轴好感分项（v0.1.10 起各轴有独立行为意义）：
 * - closeness 亲密度：完成偶遇 +1（"一起经历过的事越多越亲密"）
 * - trust 信任度：送投其所好的礼物 +1（"愿意敞开心扉的程度"）
 * - tension 暧昧度：≥10 且深夜触发心动独白（"心跳加速的瞬间累积"）
 * 任意单项 +1 经反向同步对综合好感影响为 round(1/3)=0，不污染关系阶段/称谓。
 * @typedef {Object} AffectionDetail
 * @property {number} closeness 亲密度（≥0）
 * @property {number} trust 信任度（≥0）
 * @property {number} tension 暧昧度（≥0）
 */

/**
 * 单个会话（每个可发消息角色一条）。
 * @typedef {Object} Conversation
 * @property {Array<{id:string, from:string, text:string, time:string, ts:number, replied:boolean, isFollowup?:boolean}>} messages
 * @property {number} unread 未读数
 * @property {boolean} typing 对方正在输入
 * @property {boolean} finished 会话已终结（不再接收消息）
 * @property {{prompt:string, options:Array<Object>}|null} pendingChoice 挂起的选项
 */

/**
 * 游戏核心状态（PhoneEngine.state，持久化到 localStorage 'neon_phone_saves'）。
 * v0.3.5 起与 engine.js defaultState() 逐字段对齐；结构性变更须同步本文件。
 * @typedef {Object} GameState
 * @property {number} day 第 N 天（≥1）
 * @property {number} minute 当天分钟数（0-1440）
 * @property {Object<string,Conversation>} conversations 会话表（shenyan/luci/jiangyu/susu）
 * @property {Array<Object>} callLog 通话记录
 * @property {Array<string>} photos 已解锁照片 id
 * @property {{unlocked:Array<string>, playing:(string|null)}} music 音乐解锁与播放
 * @property {Array<Object>} notes 备忘录
 * @property {Array<Object>} calendar 日程
 * @property {Array<Object>} notifs 已读通知
 * @property {Object<string,number>} affection 综合好感（shenyan/luci/jiangyu）
 * @property {Object<string,string>} flags 剧情/系统 flag（读写一致性由 validate_story.js 校验）
 * @property {Object<string,boolean>} firedEvents 已触发事件（防重入；排队事件不提前写入）
 * @property {Object<string,boolean>} endingSeen 已见结局
 * @property {('shenyan'|'luci'|'jiangyu'|'solo'|null)} route 当前路线（null=未定）
 * @property {boolean} ended 已到结局（引擎停止调度）
 * @property {Array<Object>} moments 朋友圈动态
 * @property {Object<string,Object>} momentInteractions 朋友圈互动记录
 * @property {Array<string>} dreamShards 梦境碎片
 * @property {Object<string,boolean>} resolvedDreams 已解梦境
 * @property {(string|null)} activeDream 进行中的梦境
 * @property {Array<Object>} pendingMessages 待送达消息（异步剧情，跨读档恢复）
 * @property {Array<Object>} pendingEventDispatches 待派发事件
 * @property {Array<Object>} pendingCalls 待触发通话
 * @property {Array<Object>} pendingInteractions 待完成交互（读档后由 UI 重建）
 * @property {(Object|null)} pendingInteraction 当前挂起交互
 * @property {Array<Object>} pendingFollowups 延迟后果
 * @property {Array<Object>} pendingTimeAdvances 待执行时间推进
 * @property {Object<string,number>} personality 性格六维（active/passive/rational/emotional/independent/dependent）
 * @property {string} currentLocation 当前地点 id（STORY.locations 键）
 * @property {Array<string>} locationVisits 已访问地点
 * @property {Object<string,boolean>} visitedEncounters 已触发偶遇（防重）
 * @property {Array<string>} memoryShards 回忆碎片
 * @property {Object<string,boolean>} resolvedMemories 已触发回忆
 * @property {Object<string,boolean>} firedIntel 已触发情报
 * @property {Array<Object>} invitations 待处理邀约
 * @property {Object<string,boolean>} firedInvitations 已触发邀约
 * @property {Object<string,string>} resolvedInvitations 邀约结果（accepted|declined|missed）
 * @property {Object<string,Object>} groups 多人群聊状态
 * @property {Array<Object>} voicemails 语音信箱
 * @property {Object<string,boolean>} flashbacksSeen 已看闪回
 * @property {Array<string>} flashbackShards 闪回碎片
 * @property {number} coins 玩家金钱
 * @property {Array<Object>} inventory 已购未送出礼物
 * @property {Array<Object>} gifts 已送出礼物
 * @property {string} mood 当前心情 id（STORY.moods 键）
 * @property {Array<Object>} moodHistory 历史心情
 * @property {Array<Object>} diary 内心独白
 * @property {Array<Object>} tarotHistory 塔罗历史
 * @property {number} lastTarotDay 上次抽塔罗日
 * @property {(Object|null)} todayFortune 今日塔罗 {cardId,reversed,text,hint:{type,value},day}
 * @property {Object<string,boolean>} achievements 已达成成就
 * @property {Array<string>} collected 已收集收集品 id（STORY.collectibles 键）
 * @property {Object<string,boolean>} easterEggsSeen 已见彩蛋
 * @property {Object<string,PuzzleProgress>} puzzleProgress 解谜进度
 * @property {Object<string,boolean>} discoveredClues 已翻开线索
 * @property {Object<string,Object>} perspectivesSeen 男主视角已见
 * @property {Object<string,boolean>} truthEndingsSeen 真相结局已见
 * @property {(PlayerProfile|null)} player 主角自定义
 * @property {boolean} playerQuizDone 性格问答是否完成
 * @property {Object<string,string>} relationshipStages 关系阶段 {charId: stage}
 * @property {Array<Object>} dailyTasks 每日任务
 * @property {number} lastTaskDay 上次生成任务日
 * @property {number} taskStreak 连续完成天数
 * @property {Object<string,boolean>} taskStreakClaimed 已领取连胜奖励
 * @property {boolean} watchMode 观赏模式
 * @property {string} watchStrategy 观赏策略
 * @property {Object<string,AffectionDetail>} affectionDetail 三轴好感分项
 * @property {string} currentTheme 当前壁纸主题 id
 * @property {string} currentIconTheme 当前图标主题 id
 * @property {Object<string,boolean>} unlockedThemes 已解锁壁纸主题
 * @property {Object<string,boolean>} unlockedIconThemes 已解锁图标主题
 * @property {Object<string,boolean>} endingGallerySeen 结局图鉴已见
 * @property {Object<string,number>} dateLastDone 每日约会 {charId: day}
 * @property {Array<Object>} dateHistory 约会历史
 * @property {Object<string,boolean>} nightmaresSeen 已见梦魇
 * @property {number} lastNightmareDay 上次梦魇日
 * @property {(string|null)} activeNightmare 待选梦魇
 * @property {boolean} showOptionHints 是否显示选项提示
 * @property {Object<string,Object>} momentReplies 男主朋友圈互动记录
 */

/**
 * 剧情事件（STORY.events / STORY.criticalEvents 的值）。
 * @typedef {Object} GameEvent
 * @property {string} type 类型：message_batch|advance_time|advance_day|call|photo_unlock|
 *   music_unlock|note_add|calendar_add|moment_post|dream|route_choice|ending|encounter|
 *   group_message_batch
 * @property {number} [delay] 延迟秒数
 * @property {string} [from] 发送者角色 id（message_batch）
 * @property {Array<MessageItem>} [messages] 消息列表（含可选 flavors 文案变体）
 * @property {string} [then] 事件级后续链接（选项用 effects.thenEvent）
 * @property {Trigger} [trigger] 时间触发（day/hour + 可选 soloOnly / inRoute）
 * @property {EventEffects} [effects] 事件级效果（v0.1.6+）
 * @property {string} [collectible] 触发即发放的收集品（发放路径由校验器去重）
 * @property {string} [ending] 结局 id（type=ending）
 * @property {(function(GameState):string)} [_compute] 结局动态判定（type=ending）
 * @property {string} [groupId] 群 id（group_message_batch）
 */

/**
 * 选项（choice.options 的值；effects 由 normalizeOptionEffects 归一）。
 * @typedef {Object} ChoiceOption
 * @property {string} text 选项文案
 * @property {string} [hint] 选项提示（可关）
 * @property {{affection?:Object<string,number>, flags?:Object<string,number>, personality?:Object<string,number>, affectionDetail?:Object<string,AffectionDetail>, thenEvent?:string}} [effects] 效果（写关键 flag 的选项=结局分水岭，勿插入汇流过渡）
 * @property {string} [reply] 选后角色回复（偶遇）
 */

/**
 * 约会场景（STORY.dateScenes[charId] 数组项）。
 * @typedef {Object} DateScene
 * @property {string} id 场景 id（date_<char>_<name>）
 * @property {string} name 场景名
 * @property {string} desc 约会列表展示文案
 * @property {{affectionDetail:{[charId:string]:AffectionDetail}}} effects 三轴驱动（各场有侧重）
 * @property {string|null} unlockPhoto 完成后解锁的照片 id
 * @property {Array<{who:'him'|'me', text:string}>} dialogue 线性对话
 */

/**
 * 存档包裹（localStorage 'neon_phone_saves' 的槽位值 / 导入导出格式）。
 * @typedef {Object} SaveData
 * @property {number} v 存档版本（现 3，迁移见 save_migrations.js）
 * @property {string} slot 槽位（auto|slot1|slot2|slot3）
 * @property {GameState} state 游戏状态（读档经 _sanitizeLoadedState 白名单清洗）
 * @property {string} time ISO 时间戳
 * @property {string} note 用户备注
 * @property {string} label 自动标签（第N天 · HH:MM）
 * @property {Object|null} summary 摘要（结局图鉴等）
 */

/**
 * 时间触发条件（GameEvent.trigger）。引擎在 checkTimeEvents 与 _checkTimeEventsForRange
 * 两处同口径判定：
 * - 无附加条件=通用（所有玩家）
 * - soloOnly=true：仅未进男主线（含独行线与尚未选线）触发
 * - inRoute=true：仅已进男主线（shenyan/luci/jiangyu）触发
 * 两者互斥，可同日同 hour 并存而不互相干扰。
 * @typedef {Object} Trigger
 * @property {number} day 触发日
 * @property {number} hour 触发小时（0-23）
 * @property {boolean} [soloOnly] 仅非男主线
 * @property {boolean} [inRoute] 仅男主线
 */

/**
 * 事件级/选项级效果（GameEvent.effects / ChoiceOption.effects）。
 * @typedef {Object} EventEffects
 * @property {Object<string,string>} [flags] 写入 flag
 * @property {Object<string,number>} [personality] 性格六维增量
 * @property {Object<string,number>} [affection] 综合好感增量
 * @property {Object<string,AffectionDetail>} [affectionDetail] 三轴好感增量
 * @property {string} [collectible] 发放收集品
 */

/**
 * 单条消息（GameEvent.messages 项）。flavors 为塔罗 hint 文案变体：命中当日 hint 类型时
 * 用变体文本替换 text，未命中则保留默认 text。
 * @typedef {Object} MessageItem
 * @property {string} from 发送者角色 id 或 narrator
 * @property {string} text 默认文案
 * @property {Object<string,string>} [flavors] hint 类型 → 变体文案
 * @property {string} [then] 消息级后续事件
 * @property {{prompt:string, options:Array<ChoiceOption>}} [choice] 内嵌选项
 */

/**
 * 解谜进度（GameState.puzzleProgress 项）。
 * @typedef {Object} PuzzleProgress
 * @property {number} attemptCount 已尝试次数（UI 据此逐级揭示 hints）
 * @property {boolean} solved 是否已解开
 * @property {string} [lastAttempt] 上次提交的答案
 */

/**
 * 主角自定义画像（GameState.player）。
 * @typedef {Object} PlayerProfile
 * @property {string} name 本名
 * @property {string} nickname 昵称
 * @property {string} avatar 头像
 * @property {string} bg 背景
 * @property {number} [age] 年龄
 * @property {string} pronoun 人称（他/她）
 * @property {Object<string,number>} answers 性格问答答案
 */

/**
 * 氛围档（STORY.ambiences 值）。由 getCurrentAmbience 按优先级选出；layerImage/layerBlend
 * 由 ui/18 composeWallpaper 合成进 --wallpaper-1 壁纸层（v0.2.7 M1.3）。
 * @typedef {Object} Ambience
 * @property {string} id 氛围 id（day|dusk|night|dawn|rainy|anxious|lucky|unlucky）
 * @property {string} name 显示名
 * @property {string} wallpaperOverlay 叠加色（rgba）
 * @property {string} [layerImage] 氛围纹理图路径（assets/ambiences/*.jpg）
 * @property {string} [layerBlend] 该纹理层的 background-blend-mode（soft-light|screen|…）
 * @property {(function(GameState):boolean)} cond 命中条件
 */

/**
 * 谜题（STORY.puzzles 值）。解谜输入 4 位数字；clues 逐条翻开各给 1 位，
 * hints 为分级提示（v0.3.4 / M3.6 起 ≥2 级，UI 按 attemptCount 逐级揭示）。
 * @typedef {Object} Puzzle
 * @property {string} id 谜题 id
 * @property {string} title 标题
 * @property {string} desc 描述
 * @property {Array<{id:string, text:string, digit:number}>} clues 线索（每条给 1 位数字）
 * @property {string} answer 正确答案（4 位）
 * @property {string} hint 单条策略提示（兼容保留）
 * @property {Array<string>} [hints] 分级提示（≥2 级，逐级收窄）
 * @property {{collectible?:string, flag?:string, affection?:Object<string,number>}} reward 解谜奖励
 * @property {string} onSuccess 成功文案
 * @property {string} onFail 失败文案
 */

if (typeof window !== 'undefined') { void 0; }  // 纯文档文件：无运行时代码
