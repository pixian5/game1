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
    // 已排队但尚未真正触发的事件只存在运行时，不能提前写入 firedEvents。
    this._scheduledEvents = new Set();
  }
  // 统一注册 setTimeout，便于清理
  _setTimeout(fn, delay){
    const id = setTimeout(()=>{
      this._timers.delete(id);
      try { fn(); } catch(e){ console.error('[engine timer]', e); }
    }, delay);
    this._timers.add(id);
    return id;
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

  newGame(){
    this._clearAllTimers();
    this.state = this.defaultState();
    // 初始金币和心情从 story 配置读取
    if(this.story.shop) this.state.coins = this.story.shop.initialCoins || 500;
    if(this.story.moods) this.state.mood = 'calm';
    // v0.0.13 初始化每日任务
    this.generateDailyTasks();
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
    this.state.day++;
    this.state.minute = hour*60;
    this._resetDailyFortune();
    this.emit('timeChange', this.getTime());
    this._runPostTimeAdvanceChecks();
    this.checkAchievements();
    // v0.0.16: 跳到夜晚时间时检查梦魇
    if(hour >= 20 || hour < 6){
      this.checkNightmare();
    }
    // v0.0.16: 时间变化后重新应用氛围
    this.emit('ambienceChange', this.getCurrentAmbience());
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
  }
  _checkTimeEventsForRange(fromDay, fromHour, toDay, toHour){
    // 枚举 (day, hour) 范围内可能被跳过的时间触发事件
    const events = this.story.events;
    for(const [id, evt] of Object.entries(events)){
      if(this.state.firedEvents[id]) continue;
      if(!evt.trigger) continue;
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
    // 优先查 events，fallback 查 criticalEvents（v0.0.13 临界事件单独定义在 STORY.criticalEvents）
    const evt = this.story.events[eventId] || this.story.criticalEvents?.[eventId];
    if(!evt) return;
    // 标记已触发（避免重复）
    if(this.state.firedEvents[eventId] || this._scheduledEvents.has(eventId)) return;
    this._scheduledEvents.add(eventId);
    this.state.firedEvents[eventId] = true;
    if(evt.collectible) this.collectItem(evt.collectible);
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
      this.showTimeAdvance(evt.text, ()=>{ this.advanceTime(evt.minutes); this.afterEvent(evt); });
      return;
    } else if(evt.type === 'advance_day'){
      this.showTimeAdvance(evt.text, ()=>{ this.advanceToNextDay(evt.hour||9); this.afterEvent(evt); });
      return;
    } else if(evt.type === 'route_choice'){
      // 路线选择：发出提示消息后等待玩家选择
      this.emit('routeChoiceReady', this.story.routeChoice);
      return;
    } else if(evt.type === 'ending'){
      // 支持动态结局判定：若事件带 _compute，根据 state 计算实际 endingId
      const endingId = (typeof evt._compute === 'function') ? evt._compute(this.state) : evt.ending;
      this.triggerEnding(endingId);
      return;
    } else if(evt.type === 'encounter'){
      // 赴约/剧情场景：复用偶遇屏，then 在 resolveEncounter 后触发
      this._pendingEncounterThen = evt.then || null;
      this.emit('encounterTriggered', {locId:null, enc:evt.encounter});
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
    for(const [id, evt] of Object.entries(this.story.events)){
      if(this.state.firedEvents[id]) continue;
      if(evt.trigger && evt.trigger.day === d && evt.trigger.hour === t.hour){
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
      if(msg.choice) this.emit('choicePrompt', {convId:'narrator', choice:msg.choice, conv:null});
      if(msg.thenEvent) this._queueEventDispatch(msg.thenEvent, 600);
      this.emit('stateChange', this.state);
      return;
    }
    const conv = this.state.conversations[msg.from];
    if(!conv || conv.finished) return;
    conv.typing = false;
    const msgObj = {from:msg.from, text:msg.text, time:this.getTime().time, ts:Date.now(), replied:false};
    conv.messages.push(msgObj);
    conv.unread++;
    this.emit('conversationUpdate', {id:msg.from, conv});
    this.emit('messageReceived', {from:msg.from, text:msg.text, conv});
    if(msg.choice){
      conv.pendingChoice = msg.choice;
      this.emit('choicePrompt', {convId:msg.from, choice:msg.choice, conv});
    }
    if(msg.followup){
      const fu = msg.followup;
      this._setTimeout(()=>{
        if(!msgObj.replied && conv.messages[conv.messages.length-1] === msgObj){
          conv.messages.push({from:msg.from, text:fu.text, time:this.getTime().time, ts:Date.now(), isFollowup:true});
          conv.unread++;
          if(fu.affection) this._applyEffects({affection:fu.affection});
          this.emit('conversationUpdate', {id:msg.from, conv});
          this.emit('messageReceived', {from:msg.from, text:fu.text, conv, isFollowup:true});
          this.state.flags.followup_triggered = true;
          this.emit('stateChange', this.state);
        }
      }, (fu.delay || 30) * 1000);
    }
    if(msg.thenEvent) this._queueEventDispatch(msg.thenEvent, 600);
    this.emit('stateChange', this.state);
  }
  queueMessage(msg, delay=0){
    if(!msg || !['narrator', ...Object.keys(this.state.conversations)].includes(msg.from)) return;
    const text = typeof msg.text === 'string' ? msg.text : '';
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
  }

  // 玩家发送消息（通过选项触发）
  // 归一化选项 effects：兼容 thenEvent 写在 effects 外层
  normalizeOptionEffects(opt){
    if(!opt) return {};
    const eff = {...(opt.effects || {})};
    if(opt.thenEvent && !eff.thenEvent) eff.thenEvent = opt.thenEvent;
    return eff;
  }
  sendMessage(convId, text, effects){
    const eff = effects || {};
    // 旁白决策：不入会话，仅应用 effects
    if(convId === 'narrator'){
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
        break;
      }
    }
    // 清理会话挂起选项
    if(conv.pendingChoice){ delete conv.pendingChoice; }
    this.emit('conversationUpdate', {id:convId, conv});
    this._applyEffects(eff);
    if(eff.thenEvent) this._dispatchSpecialThen(eff.thenEvent);
    this.emit('stateChange', this.state);
  }

  // 处理特殊 thenEvent（邀约 accept/decline），否则按普通事件触发
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
  }

  // 玩家选择路线（特殊处理：直接触发对应路线的首个事件）
  chooseRoute(route){
    if(!['shenyan','luci','jiangyu','solo'].includes(route) || this.state.route || this.state.ended) return false;
    this.state.route = route;
    this.state.flags.route = route;
    this.collectItem('stamp_route');
    // 进入路线后，未处理的邀约自动判定为 missed
    this.missPendingInvitations();
    const opt = this.story.routeChoice.options.find(o=>o.route===route);
    if(opt && opt.thenEvent) this.scheduleEvent(opt.thenEvent);
    this.emit('stateChange', this.state);
    return true;
  }

  // 标记会话已读
  markRead(convId){
    const conv = this.state.conversations[convId];
    if(!conv) return;
    conv.unread = 0;
    this.emit('stateChange', this.state);
  }

  // ===== 电话系统 =====
  triggerCall(eventId){
    const evt = this.story.events[eventId];
    if(!evt || evt.type !== 'call') return;
    this._pendingCallEventId = eventId;
    this.emit('incomingCall', {
      from: evt.from,
      name: this.story.characters[evt.from].name,
      script: evt.script,
      eventId
    });
    // 25 秒未接听 → 自动 missed 并留语音信箱
    // 支持并发：用 Map 按 eventId 注册定时器
    const oldTimer = this._callMissTimers.get(eventId);
    if(oldTimer) clearTimeout(oldTimer);
    const tid = this._setTimeout(()=>{
      this._callMissTimers.delete(eventId);
      if(this._pendingCallEventId === eventId){
        this.addCallLog(evt.from, 'missed', '00:00');
        // 留语音信箱
        const lastHim = evt.script && [...evt.script].reverse().find(l=>l.who==='him');
        if(lastHim){
          this.addVoicemail(evt.from, lastHim.text, eventId, evt.voicemailCallback || null);
        }
        if(evt.onMissed) this.scheduleEvent(evt.onMissed);
        this.emit('callMissed', eventId);
        this._pendingCallEventId = null;
      }
    }, 25000);
    this._callMissTimers.set(eventId, tid);
  }
  answerCall(eventId){
    const tid = this._callMissTimers.get(eventId);
    if(tid){ clearTimeout(tid); this._timers.delete(tid); this._callMissTimers.delete(eventId); }
    this._pendingCallEventId = null;
    this.emit('callAnswered', eventId);
  }
  declineCall(eventId){
    const tid = this._callMissTimers.get(eventId);
    if(tid){ clearTimeout(tid); this._timers.delete(tid); this._callMissTimers.delete(eventId); }
    this._pendingCallEventId = null;
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
  }
  // 添加通话记录
  addCallLog(from, type, duration){
    this.state.callLog.unshift({
      from, type, duration,
      name: this.story.characters[from]?.name || '未知',
      time: this.getTime().time,
      day: this.state.day
    });
    this.emit('stateChange', this.state);
  }

  // ===== 相册 =====
  unlockPhoto(photoId){
    if(this.state.photos.find(p=>p.id===photoId)) return;
    const photo = this.story.photos[photoId];
    if(photo){
      this.state.photos.push({id:photoId, ...photo, unlocked:true});
      this.emit('photoUnlocked', photo);
      this.emit('stateChange', this.state);
    }
  }

  // ===== 音乐 =====
  unlockMusic(musicId){
    if(this.state.music.unlocked.includes(musicId)) return;
    const m = this.story.music[musicId];
    if(m){
      this.state.music.unlocked.push(musicId);
      this.emit('musicUnlocked', m);
      this.emit('stateChange', this.state);
    }
  }
  playMusic(musicId){
    if(!this.state.music.unlocked.includes(musicId)) return false;
    this.state.music.playing = musicId;
    this.emit('musicChange', this.story.music[musicId]);
    return true;
  }

  // ===== 备忘录 =====
  addNote(note){
    this.state.notes.unshift({...note, time:this.getDateLabel().full});
    this.emit('stateChange', this.state);
  }

  // ===== 日历 =====
  addCalendar(event){
    this.state.calendar.push(event);
    this.emit('stateChange', this.state);
  }

  // ===== 朋友圈 =====
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
  }
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
  }
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
  }
  // 玩家自己发动态
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
  }
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
  }

  // ===== 梦境碎片 =====
  triggerDream(dreamId){
    const dream = this.story.dreams[dreamId];
    if(!dream || this.state.activeDream || this.state.resolvedDreams[dreamId]) return false;
    this.state.activeDream = dreamId;
    this.emit('dreamStart', {dreamId, dream});
    this.emit('stateChange', this.state);
    return true;
  }
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
  }

  // ===== 性格画像 =====
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
  }
  // 记录性格变化（由选择触发）
  trackPersonality(dim, value){
    if(this.state.personality[dim] !== undefined){
      this.state.personality[dim] += value;
    }
  }

  // ===== 出行/地点系统 =====
  goToLocation(locId){
    const loc = this.story.locations[locId];
    if(!loc) return false;
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
  }
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
      this.emit('encounterEmpty', {locId});
      return false;
    }
    // 随机选一个
    const enc = available[Math.floor(Math.random() * available.length)];
    this.state.visitedEncounters[enc.id] = true;
    this.emit('encounterTriggered', {locId, enc});
    return true;
  }
  resolveEncounter(enc, optIdx){
    const opt = enc.choice?.options?.[optIdx];
    if(!opt) return false;
    // 应用 effects
    this._applyEffects({affection: opt.affection, personality: opt.personality, flags: opt.flags});
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
    this.emit('encounterResolved', {enc, opt});
    this.emit('stateChange', this.state);
    // 触发 then（赴约场景的后续事件）
    const thenEvt = enc.then || this._pendingEncounterThen;
    this._pendingEncounterThen = null;
    if(thenEvt) this._queueEventDispatch(thenEvt, 1000);
    return true;
  }

  // ===== 回忆杀系统 =====
  triggerMemory(memId){
    const mem = this.story.memories[memId];
    if(!mem) return false;
    if(this.state.resolvedMemories[memId]) return false;
    this.emit('memoryStart', {memId, mem});
    return true;
  }
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
  }
  getMemoriesByPhoto(photoId){
    // 找到触发该照片的回忆
    const memId = Object.keys(this.story.memories).find(k=> this.story.memories[k].triggerPhoto === photoId);
    return memId || null;
  }

  // ===== 苏苏情报网 =====
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
  }

  // ===== 共同邀约/赴约系统 =====
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
  }
  // 玩家在会话选项里选了"接受/拒绝"
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
  }
  // 检查所有 pending 邀约是否需要判定为 missed（路线选择后未处理的邀约自动 miss）
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
  }

  // ===== 多人聊天群 =====
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
  }
  queueGroupMessage(groupId, msg, delay=0){
    const group = this.state.groups[groupId];
    if(!group){
      // 群还没创建，先创建（容错）
      const gdef = this.story.groups[groupId];
      if(!gdef) return;
      this.state.groups[groupId] = {id:groupId, name:gdef.name, members:gdef.members, messages:[], unread:0, typing:false};
    }
    const g = this.state.groups[groupId];
    const text = typeof msg.text === 'string' ? msg.text : '';
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
  }
  // 玩家在群里选择
  sendGroupMessage(groupId, text, effects){
    const g = this.state.groups[groupId];
    if(!g) return;
    g.messages.push({from:'me', text, time:this.getTime().time, ts:Date.now()});
    // 清理群挂起选项
    if(g.pendingChoice){ delete g.pendingChoice; }
    this.emit('groupUpdate', {id:groupId, group:g});
    this._applyEffects(effects);
    if(effects && effects.thenEvent) this._queueEventDispatch(effects.thenEvent, 900);
  }
  markGroupRead(groupId){
    const g = this.state.groups[groupId];
    if(!g) return;
    g.unread = 0;
    this.emit('stateChange', this.state);
  }

  // ===== 语音信箱（未接来电） =====
  addVoicemail(from, text, eventId, callbackEvent){
    const vmId = 'vm_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now()+'_'+Math.random().toString(36).slice(2));
    const vm = {
      id: vmId,
      from, text, eventId, callbackEvent,
      time: this.getTime().time,
      day: this.state.day,
      heard: false
    };
    this.state.voicemails.unshift(vm);
    this.emit('voicemailReceived', vm);
    this.emit('stateChange', this.state);
    return vm.id;
  }
  playVoicemail(vmId){
    const vm = this.state.voicemails.find(v=>v.id===vmId);
    if(!vm) return false;
    vm.heard = true;
    this.collectItem('recording_msg');
    this.emit('voicemailPlayed', vm);
    this.emit('stateChange', this.state);
    return true;
  }
  // 回拨：触发 callbackEvent（如果有）
  callbackVoicemail(vmId){
    const vm = this.state.voicemails.find(v=>v.id===vmId);
    if(!vm || !vm.callbackEvent) return false;
    vm.heard = true;
    this.scheduleEvent(vm.callbackEvent);
    this.emit('voicemailCallback', vm);
    this.emit('stateChange', this.state);
    return true;
  }

  // ===== 闪回/前传章节 =====
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
  }
  triggerFlashback(fbId){
    const fb = this.story.flashbacks[fbId];
    if(!fb) return false;
    this.emit('flashbackStart', {fbId, fb});
    return true;
  }
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
  }

  // ===== 时间推进动画 =====
  showTimeAdvance(text, callback){
    this.emit('timeAdvance', {text});
    this._setTimeout(()=>{ callback && callback(); this.emit('timeAdvanceEnd'); }, 1800);
  }

  // ===== 结局 =====
  triggerEnding(endingId){
    const ending = this.story.endings?.[endingId];
    if(this.state.ended || !ending) return false;
    this.state.ended = true;
    this.state.endingSeen[endingId] = true;
    // v0.0.15: 同步记录结局图鉴
    this.recordEndingGallery(endingId);
    // 结局后清理所有定时器，避免幽灵消息
    this._clearAllTimers();
    this.emit('stateChange', this.state);
    // 结局是最不能丢失的状态，绕过节流立即落盘。
    this.autoSave(true);
    this.emit('ending', ending);
    return true;
  }

  // ===== 礼物商城+喜好系统 =====
  buyGift(itemId){
    const item = this.story.shop.items[itemId];
    if(!item) return {ok:false, reason:'物品不存在'};
    if(this.state.coins < item.price) return {ok:false, reason:'金币不足'};
    this.state.coins -= item.price;
    this.state.inventory.push({id:itemId, ts:Date.now()});
    this.emit('stateChange', this.state);
    this.checkAchievements();
    return {ok:true, item};
  }
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
  }

  // ===== 心情状态+内心独白 =====
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
  }
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
  }

  // ===== 塔罗占卜+每日运势 =====
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
    this.emit('tarotDrawn', fortune);
    this.emit('stateChange', this.state);
    this.checkAchievements();
    return {ok:true, fortune};
  }
  // 跨天重置每日运势（由 advanceToNextDay 调用）
  _resetDailyFortune(){
    if(this.state.todayFortune && this.state.todayFortune.day !== this.state.day){
      this.state.todayFortune = null;
    }
  }

  // ===== 成就系统 =====
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
  }
  isTrueEndingUnlocked(){
    try {
      return this.story.trueEndingUnlockCondition(this.state);
    } catch(_) { return false; }
  }
  // 获取已解锁成就详情列表
  getUnlockedAchievements(){
    const list = [];
    for(const [id, ach] of Object.entries(this.story.achievements||{})){
      if(this.state.achievements[id]){
        list.push({...ach, unlocked:true});
      }
    }
    return list;
  }
  // 获取未解锁成就（隐藏成就的 desc 显示为 ???）
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
  }

  // ===== v0.0.10 收集柜+隐藏彩蛋 =====
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
  }
  getCollectedByCategory(cat){
    return this.state.collected
      .map(id => this.story.collectibles[id])
      .filter(c => c && c.cat === cat);
  }
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
  }
  getUnlockedEasterEggs(){
    return Object.keys(this.state.easterEggsSeen||{})
      .map(id => this.story.easterEggs?.[id])
      .filter(Boolean);
  }

  // ===== v0.0.10 解谜玩法 =====
  discoverClue(clueId){
    this.state.discoveredClues[clueId] = true;
    this.emit('clueDiscovered', {clueId});
    this.emit('stateChange', this.state);
  }
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
  }
  isPuzzleSolved(puzzleId){
    return this.state.puzzleProgress[puzzleId]?.solved === true;
  }
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
  }

  // ===== v0.0.10 季节系统+节日事件 =====
  getCurrentSeason(){
    const date = this.getDateLabel();
    const seasonId = this.story.seasons?.getSeason(date.month) || 'summer';
    return this.story.seasons?.seasonInfo[seasonId] || {id:seasonId, name:'夏', icon:'☀️', desc:''};
  }
  checkHoliday(){
    if(!this.story.seasons?.holidays) return null;
    const date = this.getDateLabel();
    const key = `${date.month}-${date.date}`;
    const holiday = this.story.seasons.holidays[key];
    if(!holiday) return null;
    // 防止同一天重复触发
    const flagKey = 'holiday_' + holiday.id + '_day' + this.state.day;
    if(this.state.flags[flagKey]) return null;
    this.state.flags[flagKey] = true;
    // 应用效果
    const eff = holiday.effect || {};
    if(eff.collectible) this.collectItem(eff.collectible);
    if(eff.flag) this.state.flags[eff.flag] = true;
    if(eff.personality){
      for(const k in eff.personality){
        if(this.state.personality[k] !== undefined) this.state.personality[k] += eff.personality[k];
      }
    }
    this.emit('holidayTriggered', {holiday, date});
    this.emit('stateChange', this.state);
    return holiday;
  }
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
  }

  // ===== v0.0.10 男主视角+反向剧情 =====
  isPerspectiveUnlocked(charId){
    const p = this.story.malePerspectives?.[charId];
    if(!p) return false;
    try { return p.unlockCondition(this.state); } catch(_) { return false; }
  }
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
  }
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
  }
  isTruthEndingSeen(charId){
    return this.state.truthEndingsSeen[charId] === true;
  }
  // 是否解锁全部3个男主真相结局（解锁终极真结局）
  isUltimateTruthEndingUnlocked(){
    return ['shenyan','luci','jiangyu'].every(c => this.state.truthEndingsSeen[c] === true);
  }

  // ===== v0.0.13 主角自定义+动态称谓 =====
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
  }
  getPlayer(){
    if(this.state.player) return this.state.player;
    return (this.story.playerCustomization && this.story.playerCustomization.defaultPlayer) || {name:'林夏',nickname:'夏夏',avatar:'林'};
  }
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
  }
  _applyQuizPersonalityDelta(quiz, optIdx, direction){
    if(!quiz || !Number.isInteger(optIdx) || !quiz.options?.[optIdx]?.effects?.personality) return;
    const delta = {};
    for(const [key, value] of Object.entries(quiz.options[optIdx].effects.personality)){
      if(this.state.personality[key] !== undefined && Number.isFinite(value)) delta[key] = value * direction;
    }
    this._applyEffects({personality: delta});
  }
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
  }
  finishQuiz(){
    this.state.playerQuizDone = true;
    this.emit('quizFinished', this.state.player);
    this.emit('stateChange', this.state);
  }
  // 获取男主对玩家的当前称谓
  getCharNickname(charId){
    const aff = this.state.affection[charId] || 0;
    const list = this.story.playerCustomization?.dynamicNicknames?.[charId] || [];
    for(const n of list){
      if(aff >= n.min && aff <= n.max) return n;
    }
    return list[0] || { call: this.getPlayer().name, inner: '' };
  }
  // 文本替换：把 $PLAYER$ / $NICK$ 替换为玩家名/昵称
  replacePlayerTokens(text){
    if(!text) return text;
    const p = this.getPlayer();
    return text.replace(/\$PLAYER\$/g, p.name)
               .replace(/\$NICK\$/g, p.nickname);
  }

  // ===== v0.0.13 关系阶段+临界事件 =====
  getRelationshipStage(charId){
    const aff = this.state.affection[charId] || 0;
    const stages = this.story.relationshipStages?.[charId] || [];
    for(const s of stages){
      if(aff >= s.minAff && aff <= s.maxAff) return s;
    }
    return stages[0] || null;
  }
  getRelationshipStageNum(charId){
    const st = this.getRelationshipStage(charId);
    return (st && st.stage) || 1;
  }
  checkRelationshipStageUp(charId){
    const cur = this.getRelationshipStageNum(charId);
    const prev = this.state.relationshipStages[charId] || 1;
    if(cur > prev){
      // 阶段提升
      this.state.relationshipStages[charId] = cur;
      const stage = this.getRelationshipStage(charId);
      this.emit('relationshipStageUp', {charId, stage, prevStage: prev});
      // 临界事件延迟入队；运行时集合去重，真正触发时才写 firedEvents。
      if(stage.criticalEvent){
        const evt = this.story.criticalEvents?.[stage.criticalEvent];
        if(evt && !this.state.firedEvents[stage.criticalEvent] && !this._scheduledEvents.has(stage.criticalEvent)){
          this._scheduledEvents.add(stage.criticalEvent);
          this._setTimeout(()=>{
            this._scheduledEvents.delete(stage.criticalEvent);
            this.scheduleEvent(stage.criticalEvent);
          }, 2000);
        }
      }
      return stage;
    } else if(cur < prev){
      this.state.relationshipStages[charId] = cur;
    }
    return null;
  }
  getAllRelationshipStages(){
    return ['shenyan','luci','jiangyu'].map(cid => ({
      charId: cid,
      stage: this.getRelationshipStage(cid) || {stage:1, name:'陌生', title:'', desc:''},
      stageNum: this.getRelationshipStageNum(cid),
      affection: this.state.affection[cid] || 0
    }));
  }

  // ===== v0.0.13 每日任务+连胜奖励 =====
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
  }
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
  }
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
  }
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
  }
  getDailyTasks(){
    if(this.state.lastTaskDay !== this.state.day){
      this.generateDailyTasks();
    }
    return this.state.dailyTasks;
  }

  // ===== v0.0.13 观赏模式+自动推进 =====
  setWatchMode(enabled, strategy){
    this.state.watchMode = !!enabled;
    if(strategy) this.state.watchStrategy = strategy;
    this.emit('watchModeChanged', {enabled: this.state.watchMode, strategy: this.state.watchStrategy});
    this.emit('stateChange', this.state);
  }
  pickAutoChoice(options){
    const strategy = this.story.watchMode?.strategies?.[this.state.watchStrategy] || this.story.watchMode?.strategies?.balanced;
    if(!strategy || !options || options.length === 0) return 0;
    try { return strategy.pick(options); } catch(_) { return 0; }
  }

  // ===== v0.0.15 好感度深度系统 =====
  getAffectionDetail(charId){
    const ad = this.state.affectionDetail && this.state.affectionDetail[charId];
    if(!ad) return {closeness:0, trust:0, tension:0};
    return {closeness:ad.closeness||0, trust:ad.trust||0, tension:ad.tension||0};
  }
  getAffectionDimStage(charId, dimId){
    const ad = this.getAffectionDetail(charId);
    const stages = this.story.affectionDimStages?.[dimId] || [];
    const v = ad[dimId] || 0;
    for(const s of stages){
      if(v >= s.min && v <= s.max) return s;
    }
    return stages[0] || {name:'-'};
  }
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
  }

  // ===== v0.0.15 主题/壁纸系统 =====
  // 检查并解锁所有满足条件的主题（每次 stateChange 后调用）
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
  }
  setTheme(themeId){
    if(!this.state.unlockedThemes[themeId]) return false;
    this.state.currentTheme = themeId;
    this.emit('themeChanged', {type:'theme', id:themeId, theme:this.story.themes[themeId]});
    this.emit('stateChange', this.state);
    return true;
  }
  setIconTheme(iconThemeId){
    if(!this.state.unlockedIconThemes[iconThemeId]) return false;
    this.state.currentIconTheme = iconThemeId;
    this.emit('themeChanged', {type:'iconTheme', id:iconThemeId, theme:this.story.iconThemes[iconThemeId]});
    this.emit('stateChange', this.state);
    return true;
  }
  getCurrentTheme(){ return this.story.themes?.[this.state.currentTheme] || this.story.themes?.default; }
  getCurrentIconTheme(){ return this.story.iconThemes?.[this.state.currentIconTheme] || this.story.iconThemes?.default; }

  // ===== v0.0.15 结局图鉴 =====
  // triggerEnding 时自动记入 endingGallerySeen
  recordEndingGallery(endingId){
    if(!endingId) return;
    this.state.endingGallerySeen[endingId] = true;
    this.emit('endingGalleryUpdated', endingId);
  }
  getEndingGallery(){
    const all = this.story.endingGallery || {};
    return Object.values(all).map(e => ({
      ...e,
      seen: !!this.state.endingGallerySeen[e.id],
      charName: e.charId ? (this.story.characters[e.charId]?.name || e.charId) : '独行线'
    }));
  }
  // 调用 STORY.computeEnding 计算实际结局
  computeCurrentEnding(){
    if(typeof this.story.computeEnding !== 'function') return null;
    try { return this.story.computeEnding(this.state, this.state.route); }
    catch(_) { return null; }
  }

  // ===== v0.0.15 每日约会小剧场 =====
  // 判断男主本周是否可约会（从未约过/值为0视为可约）
  canDate(charId){
    const last = this.state.dateLastDone[charId];
    if(!last) return true;  // 0/undefined/null 都视为未约过
    const cooldown = this.story.dateCooldownDays || 7;
    return (this.state.day - last) >= cooldown;
  }
  // 获取男主可用的约会场景列表
  getAvailableDateScenes(charId){
    const list = (this.story.dateScenes && this.story.dateScenes[charId]) || [];
    return list.filter(s => !this.state.firedEvents[s.id]);
  }
  // 发起约会：只做校验和触发模态，不标记 firedEvents/dateLastDone（移到 finishDate）
  // 但需要占用"本周约会名额"，用 _pendingDate 字段标记"正在进行的约会"
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
  }
  // 取消约会：玩家点"先离开"时调用，清理 _pendingDate，不消耗本周名额
  cancelDate(){
    this._pendingDate = null;
  }
  // 完成约会：应用 effects + 解锁照片 + 记录历史 + 标记 firedEvents/dateLastDone
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
  }
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
  }

  // ===== v0.0.16 梦魇系统 =====
  // 在 advanceToNextDay 后调用：检查是否触发梦魇
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
  }
  // 解梦：玩家选择后应用 effects + 更新心情
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
  }

  // ===== v0.0.16 智能提示开关 =====
  setShowOptionHints(on){
    this.state.showOptionHints = !!on;
    this.emit('optionHintsToggled', this.state.showOptionHints);
    this.emit('stateChange', this.state);
  }
  // 给 UI 用：获取某个选项的提示文案
  getOptionHint(opt){
    if(!this.state.showOptionHints) return null;
    if(!this.story.optionHints?.generate) return null;
    try { return this.story.optionHints.generate(opt); } catch(_) { return null; }
  }

  // ===== v0.0.16 男主朋友圈互动 =====
  // 玩家发朋友圈后调用：根据配图类别生成男主评论
  // moment = {id, art, text, ...}
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
  }
  // 玩家回复男主评论：应用 reply effects + 记录
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
  }

  // ===== v0.0.16 动态背景氛围 =====
  // 根据当前 state 计算应用哪个氛围层
  getCurrentAmbience(){
    const list = this.story.ambiences || {};
    // 优先级：anxious > rainy > night > dusk > dawn > day
    const priority = ['anxious','rainy','night','dusk','dawn','day'];
    for(const id of priority){
      const a = list[id];
      if(!a) continue;
      try { if(a.cond(this.state)) return a; } catch(_) {}
    }
    return null;
  }

  // ===== 存档 =====
  // v0.1.0: 多槽位 + 自动存档 + 继续游戏 + 导出导入
  static SAVE_VERSION = 2;
  static SAVE_KEY = 'neon_phone_saves';
  static SLOT_AUTO = 'auto';
  static SLOT_MANUAL = ['slot1', 'slot2', 'slot3'];
  static AUTO_SAVE_MIN_INTERVAL_MS = 8000;
  static AUTO_SAVE_PERIODIC_MS = 60000;
  static MAX_SAVE_BYTES = 1500000;

  _isSaveSlot(slot){
    return slot === PhoneEngine.SLOT_AUTO || PhoneEngine.SLOT_MANUAL.includes(slot);
  }
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
  }

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
  }
  _normalizeSaveData(raw, forcedSlot=null){
    if(!raw || typeof raw !== 'object' || Array.isArray(raw) || !raw.state || typeof raw.state !== 'object' || Array.isArray(raw.state)) return null;
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
  }
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
      return {prompt:asText(c.prompt, 1000), options, isInvitation:asBool(c.isInvitation)};
    };
    const out = def;
    out.day = asInt(source.day, def.day, 1, 9999);
    out.minute = asInt(source.minute, def.minute, 0, 1439);
    out.ended = asBool(source.ended);
    out.route = ['shenyan','luci','jiangyu','solo'].includes(source.route) ? source.route : null;
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
          return {from, text:asText(m.text, 1000), time:asText(m.time, 8), day:asInt(m.day, 0, 0, 9999), ts:asInt(m.ts, 0, 0, 9999999999999), replied:asBool(m.replied), isFollowup:asBool(m.isFollowup), isGiftReaction:asBool(m.isGiftReaction)};
        }),
        unread:asInt(conv.unread, 0, 0, 500),
        typing:false,
        finished:asBool(conv.finished),
        pendingChoice:sanitizeChoice(conv.pendingChoice)
      };
    });
    out.affection = {...def.affection};
    Object.keys(out.affection).forEach(cid=> out.affection[cid] = asInt(object(source.affection)[cid], 0, 0, 9999));
    out.personality = {...def.personality};
    Object.keys(out.personality).forEach(key=> out.personality[key] = asInt(object(source.personality)[key], 0, 0, 9999));
    out.affectionDetail = {...def.affectionDetail};
    Object.keys(out.affectionDetail).forEach(cid=>{
      const saved = object(object(source.affectionDetail)[cid]);
      out.affectionDetail[cid] = {closeness:asInt(saved.closeness, 0, 0, 9999), trust:asInt(saved.trust, 0, 0, 9999), tension:asInt(saved.tension, 0, 0, 9999)};
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
    out.voicemails = array(source.voicemails, 100, item=>{ const vm=object(item); const from=chars.includes(vm.from)?vm.from:'susu'; return {id:asText(vm.id,100),from,text:asText(vm.text,1000),eventId:asText(vm.eventId,100),callbackEvent:eventIds.has(vm.callbackEvent)?vm.callbackEvent:null,time:asText(vm.time,8),day:asInt(vm.day,0,0,9999),heard:asBool(vm.heard)}; });
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
    const fortune=object(source.todayFortune); out.todayFortune=this.story.tarot?.cards?.[fortune.cardId] ? {cardId:fortune.cardId,name:asText(fortune.name,40),roman:asText(fortune.roman,10),reversed:asBool(fortune.reversed),text:asText(fortune.text,1000),hint:object(fortune.hint),day:asInt(fortune.day,0,0,9999)} : null;
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
    return out;
  }
  _resumePendingWork(){
    this.state.pendingMessages.forEach(item=>this._schedulePendingMessage(item));
    this.state.pendingEventDispatches.forEach(item=>this._schedulePendingEventDispatch(item));
    this.state.pendingCalls.forEach(item=>this._schedulePendingCall(item));
  }
  _applySaveData(data){
    if(!data || !data.state) return false;
    this._clearAllTimers();
    this._pendingDate = null; // load 后清空进行中约会，避免卡死本周约会名额
    this._disableAutoSave = true;
    try {
      this.state = this._sanitizeLoadedState(data.state);
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
  }
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
  }
  autoSave(force=false){
    if(this._disableAutoSave) return false;
    const now = Date.now();
    if(!force && this._lastAutoSaveAt && (now - this._lastAutoSaveAt) < PhoneEngine.AUTO_SAVE_MIN_INTERVAL_MS){
      return false;
    }
    return this.save(PhoneEngine.SLOT_AUTO, {silent: true, note: '自动存档'});
  }
  startAutoSave(){
    if(this._autoSaveStarted) return;
    this._autoSaveStarted = true;
    this._lastAutoSaveAt = 0;
    this.on('stateChange', ()=>{
      try { this.autoSave(false); } catch(_) {}
    });
    if(typeof setInterval !== 'undefined'){
      this._autoSaveInterval = setInterval(()=>{
        try { this.autoSave(true); } catch(_) {}
      }, PhoneEngine.AUTO_SAVE_PERIODIC_MS);
    }
  }
  stopAutoSave(){
    if(this._autoSaveInterval){
      clearInterval(this._autoSaveInterval);
      this._autoSaveInterval = null;
    }
    this._autoSaveStarted = false;
  }
  load(slot){
    if(!this._isSaveSlot(slot)) return false;
    const saves = this.getAllSaves();
    const data = saves[slot];
    if(!data) return false;
    return this._applySaveData(data);
  }
  hasSave(slot){
    const saves = this.getAllSaves();
    return !!(saves && saves[slot] && saves[slot].state);
  }
  hasAnySave(){
    const saves = this.getAllSaves();
    return Object.keys(saves).some(k => saves[k] && saves[k].state);
  }
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
  }
  continueGame(){
    const latest = this.getLatestSave();
    if(latest && latest.slot) return this.load(latest.slot);
    return false;
  }
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
  }
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
  }
  importSave(jsonText, targetSlot){
    try {
      if(typeof jsonText === 'string' && jsonText.length > PhoneEngine.MAX_SAVE_BYTES) return {ok:false, reason:'存档文件过大'};
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
  }
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
  }
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
  }
  getAllSaves(){
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
    return {...normalized};
  }
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
      return true;
    } catch(e){
      console.error('[save failed]', e && e.message ? e.message : e);
      return false;
    }
  }
}

if (typeof window !== 'undefined') window.PhoneEngine = PhoneEngine;
