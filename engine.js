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
      // 性格画像维度
      personality: {active:0, passive:0, rational:0, emotional:0, independent:0, dependent:0},
      // 当前地点
      currentLocation: 'home',
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
      truthEndingsSeen: {}       // {charId: true}
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
    }
  }
  // 统一应用 effects：避免 30+ 处复制粘贴
  _applyEffects(effects){
    if(!effects) return;
    if(effects.affection){
      for(const k in effects.affection){
        if(this.state.affection[k] !== undefined) this.state.affection[k] += effects.affection[k];
      }
    }
    if(effects.flags){
      for(const k in effects.flags) this.state.flags[k] = effects.flags[k];
    }
    if(effects.personality){
      for(const k in effects.personality){
        if(this.state.personality[k] !== undefined) this.state.personality[k] += effects.personality[k];
      }
    }
  }
  // 公开接口：供 UI 层调用，避免直接改 state
  applyEffects(effects){ this._applyEffects(effects); this.emit('stateChange', this.state); }

  newGame(){
    this._clearAllTimers();
    this.state = this.defaultState();
    // 初始金币和心情从 story 配置读取
    if(this.story.shop) this.state.coins = this.story.shop.initialCoins || 500;
    if(this.story.moods) this.state.mood = 'calm';
    // 初始：苏苏发来欢迎消息
    this.scheduleEvent('intro_susu');
    this.emit('stateChange', this.state);
    this.emit('timeChange', this.getTime());
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
  }
  _runPostTimeAdvanceChecks(){
    this.checkTimeEvents();
    this.checkIntel();
    this.checkInvitations();
    this.checkGroups();
    this.checkFlashbacks();
    this.checkHoliday();
    this.checkEasterEggs();
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
          this.state.firedEvents[id] = true;
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
    const evt = this.story.events[eventId];
    if(!evt) return;
    // 标记已触发（避免重复）
    if(this.state.firedEvents[eventId]) return;
    this.state.firedEvents[eventId] = true;
    // 立即触发的消息事件
    if(evt.type === 'message_batch'){
      const n = evt.messages.length;
      evt.messages.forEach((m, i) => this.queueMessage(m, (evt.delay || 0) + i*0.3));
      // 若整个 batch 有 then，等所有消息发送完再触发
      if(evt.then){
        const lastDelay = (evt.delay || 0) + (n-1)*0.3;
        const totalDelay = (lastDelay + 2.8) * 1000; // 留足打字时间
        this._setTimeout(()=> this.scheduleEvent(evt.then), totalDelay);
      }
      return; // 不走 afterEvent
    } else if(evt.type === 'call'){
      // 电话事件：稍后触发
      this._setTimeout(()=> this.triggerCall(eventId), (evt.delay||0)*1000);
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
        this._setTimeout(()=> this.scheduleEvent(evt.then), totalDelay);
      }
      return;
    }
    this.afterEvent(evt);
  }
  afterEvent(evt){
    if(evt.then) this._setTimeout(()=> this.scheduleEvent(evt.then), 400);
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
  queueMessage(msg, delay=0){
    // 旁白消息：不依赖会话，直接发出事件（带选项时作为决策弹窗）
    if(msg.from === 'narrator'){
      this._setTimeout(()=>{
        this.emit('messageReceived', {from:'narrator', text:msg.text});
        if(msg.choice){
          this.emit('choicePrompt', {convId:'narrator', choice:msg.choice, conv:null});
        }
        if(msg.then) this._setTimeout(()=> this.scheduleEvent(msg.then), 600);
      }, delay*1000);
      return;
    }
    const conv = this.state.conversations[msg.from];
    if(!conv) return;
    this._setTimeout(()=>{
      if(conv.finished) return;
      conv.typing = true;
      this.emit('conversationUpdate', {id:msg.from, conv});
      // 打字时间根据字数
      const typingTime = Math.min(2200, Math.max(700, msg.text.length * 50));
      this._setTimeout(()=>{
        conv.typing = false;
        const msgObj = {
          from: msg.from,
          text: msg.text,
          time: this.getTime().time,
          ts: Date.now(),
          replied: false   // 跟踪玩家是否回复此消息
        };
        conv.messages.push(msgObj);
        conv.unread++;
        this.emit('conversationUpdate', {id:msg.from, conv});
        this.emit('messageReceived', {from:msg.from, text:msg.text, conv});
        // 如果该消息后有玩家选择，触发选择
        if(msg.choice){
          conv.pendingChoice = msg.choice; // engine 层挂起选项，UI/测试均可读取
          this.emit('choicePrompt', {convId:msg.from, choice:msg.choice, conv});
        }
        // 已读不回后果：若该消息配置了 followup，启动计时器
        // 判定逻辑：玩家未在 delay 时间内回复此消息（msgObj.replied 仍为 false）
        if(msg.followup){
          const fu = msg.followup;
          this._setTimeout(()=>{
            // 若该消息仍是会话最后一条且玩家未回复 → 触发跟进
            if(!msgObj.replied && conv.messages[conv.messages.length-1] === msgObj){
              conv.messages.push({
                from: msg.from,
                text: fu.text,
                time: this.getTime().time,
                ts: Date.now(),
                isFollowup: true
              });
              conv.unread++;
              if(fu.affection){
                Object.keys(fu.affection).forEach(k=> {
                  if(this.state.affection[k] !== undefined) this.state.affection[k] += fu.affection[k];
                });
              }
              this.emit('conversationUpdate', {id:msg.from, conv});
              this.emit('messageReceived', {from:msg.from, text:fu.text, conv, isFollowup:true});
              // 标记已触发过 followup，用于成就判定
              this.state.flags.followup_triggered = true;
              this.emit('stateChange', this.state);
            }
          }, (fu.delay || 30) * 1000);
        }
        // 链式触发下一个事件（msg.then 指向 event id）
        if(msg.then) this._setTimeout(()=> this.scheduleEvent(msg.then), 600);
      }, typingTime);
    }, delay*1000);
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
      return;
    }
    const conv = this.state.conversations[convId];
    if(!conv) return;
    conv.messages.push({from:'me', text, time:this.getTime().time, ts:Date.now()});
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
    this._setTimeout(()=> this.scheduleEvent(thenEvent), 900);
  }

  // 玩家选择路线（特殊处理：直接触发对应路线的首个事件）
  chooseRoute(route){
    this.state.route = route;
    this.state.flags.route = route;
    // 进入路线后，未处理的邀约自动判定为 missed
    this.missPendingInvitations();
    const opt = this.story.routeChoice.options.find(o=>o.route===route);
    if(opt && opt.thenEvent) this.scheduleEvent(opt.thenEvent);
    this.emit('stateChange', this.state);
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
    const tid = setTimeout(()=>{
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
    if(tid){ clearTimeout(tid); this._callMissTimers.delete(eventId); }
    this._pendingCallEventId = null;
    this.emit('callAnswered', eventId);
  }
  declineCall(eventId){
    const tid = this._callMissTimers.get(eventId);
    if(tid){ clearTimeout(tid); this._callMissTimers.delete(eventId); }
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
    const id = 'my_moment_' + Date.now();
    const moment = {
      id, author:'me', name:'林夏', avatar:'林', bg:'#5a2a4a',
      text, art: art||null,
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
    if(!dream) return;
    this.emit('dreamStart', {dreamId, dream});
  }
  resolveDream(dreamId, choiceIdx){
    const dream = this.story.dreams[dreamId];
    if(!dream) return;
    const opt = dream.options[choiceIdx];
    if(!opt) return;
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
    this.emit('dreamResolved', {dreamId, choice: opt});
    this.emit('stateChange', this.state);
    // 触发后续
    if(dream.then) this._setTimeout(()=> this.scheduleEvent(dream.then), 800);
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
    if(thenEvt) this._setTimeout(()=> this.scheduleEvent(thenEvt), 1000);
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
    if(!mem) return;
    const opt = mem.options[optIdx];
    if(!opt) return;
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
    if(mem.then) this._setTimeout(()=> this.scheduleEvent(mem.then), 800);
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
          if(g.createEvent) this._setTimeout(()=> this.scheduleEvent(g.createEvent), 1500);
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
    this._setTimeout(()=>{
      g.typing = true;
      this.emit('groupUpdate', {id:groupId, group:g});
      const typingTime = Math.min(2200, Math.max(700, msg.text.length * 50));
      this._setTimeout(()=>{
        g.typing = false;
        g.messages.push({
          from: msg.from,
          text: msg.text,
          time: this.getTime().time,
          ts: Date.now()
        });
        g.unread++;
        this.emit('groupUpdate', {id:groupId, group:g});
        this.emit('groupMessageReceived', {groupId, from:msg.from, text:msg.text, group:g});
        // 群内选项
        if(msg.choice){
          g.pendingChoice = msg.choice;
          this.emit('choicePrompt', {convId:'group:'+groupId, choice:msg.choice, conv:g});
        }
        if(msg.then) this._setTimeout(()=> this.scheduleEvent(msg.then), 600);
      }, typingTime);
    }, delay*1000);
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
    if(effects && effects.thenEvent) this._setTimeout(()=> this.scheduleEvent(effects.thenEvent), 900);
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
    if(fb.then) this._setTimeout(()=> this.scheduleEvent(fb.then), 800);
  }

  // ===== 时间推进动画 =====
  showTimeAdvance(text, callback){
    this.emit('timeAdvance', {text});
    this._setTimeout(()=>{ callback && callback(); this.emit('timeAdvanceEnd'); }, 1800);
  }

  // ===== 结局 =====
  triggerEnding(endingId){
    this.state.ended = true;
    this.state.endingSeen[endingId] = true;
    // 结局后清理所有定时器，避免幽灵消息
    this._clearAllTimers();
    this.emit('ending', this.story.endings[endingId]);
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
    if(this.state.affection[toCharId] !== undefined){
      this.state.affection[toCharId] += gain;
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
    this.state.diary.push({
      text: text.trim(),
      mood: this.state.mood,
      day: this.state.day,
      time: this.getTime().time,
      ts: Date.now()
    });
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
    if(answer === puzzle.answer){
      progress.solved = true;
      this.state.puzzleProgress[puzzleId] = progress;
      // 发放奖励
      const reward = puzzle.reward || {};
      if(reward.collectible) this.collectItem(reward.collectible);
      if(reward.flag) this.state.flags[reward.flag] = true;
      if(reward.affection){
        for(const k in reward.affection){
          if(this.state.affection[k] !== undefined) this.state.affection[k] += reward.affection[k];
        }
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

  // ===== 存档 =====
  static SAVE_VERSION = 1;
  save(slot){
    const data = {
      v: PhoneEngine.SAVE_VERSION,
      state: this.state,
      time: new Date().toISOString(),
      label: `第${this.state.day}天 · ${this.getTime().time}`
    };
    try {
      const saves = this.getAllSaves();
      saves[slot] = data;
      localStorage.setItem('neon_phone_saves', JSON.stringify(saves));
      return true;
    } catch(e){
      console.error('[save failed]', e);
      this.emit('saveFailed', {slot, error: e.message});
      return false;
    }
  }
  load(slot){
    const saves = this.getAllSaves();
    const data = saves[slot];
    if(!data) return false;
    // 清理旧游戏的定时器，避免幽灵消息
    this._clearAllTimers();
    // 用默认值兜底新字段（兼容旧存档）
    const def = this.defaultState();
    this.state = {...def, ...data.state,
      conversations: {...def.conversations, ...(data.state.conversations||{})},
      affection: {...def.affection, ...(data.state.affection||{})},
      flags: {...(data.state.flags||{})},
      personality: {...def.personality, ...(data.state.personality||{})},
      moments: data.state.moments || [],
      invitations: data.state.invitations || [],
      groups: data.state.groups || {},
      voicemails: data.state.voicemails || [],
      callLog: data.state.callLog || [],
      photos: data.state.photos || [],
      notes: data.state.notes || [],
      calendar: data.state.calendar || [],
      dreamShards: data.state.dreamShards || [],
      memoryShards: data.state.memoryShards || [],
      flashbackShards: data.state.flashbackShards || [],
      coins: data.state.coins !== undefined ? data.state.coins : def.coins,
      inventory: data.state.inventory || [],
      gifts: data.state.gifts || [],
      mood: data.state.mood || def.mood,
      moodHistory: data.state.moodHistory || [],
      diary: data.state.diary || [],
      tarotHistory: data.state.tarotHistory || [],
      lastTarotDay: data.state.lastTarotDay || 0,
      todayFortune: data.state.todayFortune || null,
      achievements: data.state.achievements || {},
      collected: data.state.collected || [],
      easterEggsSeen: data.state.easterEggsSeen || {},
      puzzleProgress: data.state.puzzleProgress || {},
      discoveredClues: data.state.discoveredClues || {},
      perspectivesSeen: data.state.perspectivesSeen || {},
      truthEndingsSeen: data.state.truthEndingsSeen || {}
    };
    this.emit('stateChange', this.state);
    this.emit('timeChange', this.getTime());
    return true;
  }
  deleteSave(slot){
    const saves = this.getAllSaves();
    delete saves[slot];
    localStorage.setItem('neon_phone_saves', JSON.stringify(saves));
  }
  getAllSaves(){
    try{ return JSON.parse(localStorage.getItem('neon_phone_saves')||'{}'); }
    catch(e){ return {}; }
  }
}

if (typeof window !== 'undefined') window.PhoneEngine = PhoneEngine;
