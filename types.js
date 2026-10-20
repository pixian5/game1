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
 * 仅列结构性字段；完整字段以 engine.js defaultState() 为准。
 * @typedef {Object} GameState
 * @property {number} day 第 N 天（≥1）
 * @property {number} minute 当天分钟数（0-1440）
 * @property {Object<string,string>} flags 剧情/系统 flag（读写一致性由 validate_story.js 校验）
 * @property {Object<string,number>} affection 综合好感（shenyan/luci/jiangyu 有；susu 无）
 * @property {Object<string,AffectionDetail>} affectionDetail 三轴好感分项
 * @property {Object<string,number>} personality 性格六维（active/passive/rational/emotional/independent/dependent）
 * @property {Object<string,Conversation>} conversations 会话表
 * @property {string} currentTheme 当前主题 id（STORY.themes 键）
 * @property {string} mood 当前心情（STORY.moods 键）
 * @property {Array<string>} collected 已收集收集品 id（STORY.collectibles 键）
 * @property {Object<string,boolean>} firedEvents 已触发事件（防重入；运行时排队事件不提前写入）
 * @property {{cardId:string,name:string,roman:string,reversed:boolean,text:string,hint:{type:string,value:number},day:number}|null} todayFortune 今日塔罗（换日时可能触发次日指引）
 * @property {boolean} ended 已到结局（结局后引擎停止调度）
 */

/**
 * 剧情事件（STORY.events / STORY.criticalEvents 的值）。
 * @typedef {Object} GameEvent
 * @property {string} type 类型：message_batch|advance_time|advance_day|call|photo_unlock|
 *   music_unlock|note_add|calendar_add|moment_post|dream|route_choice|ending|encounter|
 *   group_message_batch
 * @property {number} [delay] 延迟秒数
 * @property {string} [from] 发送者角色 id（message_batch）
 * @property {Array<{from:string,text:string,then?:string,choice?:{prompt:string,options:Array<ChoiceOption>}}>} [messages] 消息列表（then 为消息级链）
 * @property {string} [then] 事件级后续链接（ChoiceOption 用 effects.thenEvent）
 * @property {{day:number,hour:number}} [trigger] 时间触发（checkTimeEvents 用）
 * @property {{collectible?:string, flags?:Object<string,number>, personality?:Object<string,number>, affection?:Object<string,number>}} [effects] 事件级效果（v0.1.6+）
 * @property {string} [collectible] 触发即发放的收集品（发放路径由校验器去重）
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

if (typeof window !== 'undefined') { void 0; }  // 纯文档文件：无运行时代码
