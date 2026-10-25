/* ===== 霓虹心事 · 手机模拟引擎 =====
 * 核心创新：不再是线性对话框，而是模拟一部手机
 * - 时间系统：游戏内时间随互动推进
 * - 事件队列：消息/电话/照片按时间触发，玩家自由选择何时处理
 * - 并发会话：多个男主同时发消息，已读不回会有后果
 * - 玩家自主：不强制顺序，何时回消息、接不接电话都由玩家决定
 */
class PhoneEngine {
  constructor(story){
    this.story = story;
    this.state = this.defaultState();
    this.listeners = {};
    this._timers = new Set();   // 注册所有 setTimeout，便于 newGame/load 时全量清理
    this._callMissTimers = new Map();  // eventId -> timerId，支持并发通话
    this._pendingCallEventId = null;
    this._pendingEncounterThen = null;
    this._pendingDate = null;  // v0.0.16: 进行中的约会（不持久化）
    this._memorySaves = {};  // localStorage 不可用时的内存存档
    this._disableAutoSave = false;
    this._lastAutoSaveAt = 0;
    this._autoSaveStarted = false;
    this._autoSaveInterval = null;
    this._autoSaveStateListener = null;
    // 已排队但尚未真正触发的事件只存在运行时，不能提前写入 firedEvents。
    this._scheduledEvents = new Set();
    // v0.5.7（F2.2）：可注入时钟（测试用虚拟钟提速；默认 Date）
    this._clock = (typeof Clock !== 'undefined' && Clock) || Date;
    // v0.1.7: 存档内存缓存（getAllSaves 高频调用，避免每次重读 localStorage + 全量规范化）
    this._savesCache = null;
    // v0.1.7: 其他标签页改动 localStorage 时使缓存失效
    if(typeof window !== 'undefined' && typeof window.addEventListener === 'function'){
      this._storageListener = () => { this._savesCache = null; };
      window.addEventListener('storage', this._storageListener);
    }
  }
  // 统一注册 setTimeout，便于清理
  _setTimeout(fn, delay){
    // v0.5.7（F2.2）：经 _clock 注册（测试注入虚拟定时器后全程零真实等待）
    const handle = this._clock.setTimeout(() => {
      this._timers.delete(handle);
      try { fn(); } catch(e){ console.error('[engine timer]', e); }
    }, delay);
    this._timers.add(handle);
    return handle;
  }
  _clearTimeout(handle){
    clearTimeout(handle);
    this._timers.delete(handle);
  }
  _clearAllTimers(){
    this._timers.forEach(id=> clearTimeout(id));
    this._timers.clear();
    this._callMissTimers.forEach(id=> clearTimeout(id));
    this._callMissTimers.clear();
    this._pendingCallEventId = null;
    this._pendingEncounterThen = null;
    this._pendingDate = null;
    this._scheduledEvents.clear();
  }
  _addInteraction(item){
    return InteractionQueue.upsert(this.state, item);
  }
  _findInteraction(predicate){
    return InteractionQueue.find(this.state, predicate);
  }
  _removeInteraction(predicate){
    return InteractionQueue.remove(this.state, predicate);
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
      showOptionHints: false,    // 是否显示选项影响提示
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
  advanceTime(minutes){
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
    this.checkTensionWhispers();  // v0.1.10: 暧昧度深夜独白
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
      if(!evt.trigger) continue;
      if(evt.trigger.soloOnly && inRoute) continue;
      if(evt.trigger.inRoute && !inRoute) continue;   // v0.3.1: 男主线专属中后期日常（仅已进男主线时触发）
      // 简化：仅检查从起点到终点之间的所有 hour
      let d = fromDay, h = fromHour;
      while(d < toDay || (d === toDay && h <= toHour)){
        if(evt.trigger.day === d && evt.trigger.hour === h){
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
    // 检查基于时间触发的事件
    const t = this.getTime();
    const d = this.state.day;
    // v0.2.1: 已进男主线（shenyan/luci/jiangyu）的玩家跳过通用日常事件
    const inRoute = !!this.state.route && this.state.route !== 'solo';
    for(const [id, evt] of Object.entries(this.story.events)){
      if(this.state.firedEvents[id]) continue;
      if(evt.trigger && evt.trigger.day === d && evt.trigger.hour === t.hour){
        // trigger.soloOnly 的通用日常事件（day7-10 中后期日常、雨天等）只在未确定男主线时派发，
        // 否则会侵入男主线结局段（曾导致 week1_review 的 choice 抢走最终抉择，测试 294→291 失败）
        if(evt.trigger.soloOnly && inRoute) continue;
        if(evt.trigger.inRoute && !inRoute) continue;   // v0.3.1: 男主线专属中后期日常
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
  _deliverPendingMessage(id){
    const idx = this.state.pendingMessages.findIndex(p=>p.id === id);
    if(idx < 0) return;
    const [msg] = this.state.pendingMessages.splice(idx, 1);
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

if (typeof window !== 'undefined') window.PhoneEngine = PhoneEngine;
