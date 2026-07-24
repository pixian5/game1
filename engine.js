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
      flashbackShards: []       // 闪回收集的碎片
    };
  }
  on(event, fn){ (this.listeners[event] ||= []).push(fn); }
  emit(event, payload){ (this.listeners[event]||[]).forEach(fn=>fn(payload)); }

  newGame(){
    this.state = this.defaultState();
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
    this.state.minute += minutes;
    while(this.state.minute >= 1440){
      this.state.minute -= 1440;
      this.state.day++;
    }
    this.emit('timeChange', this.getTime());
    // 检查时间触发的事件
    this.checkTimeEvents();
    this.checkIntel();
    this.checkInvitations();
    this.checkGroups();
    this.checkFlashbacks();
  }
  // 跳到次日某个时间
  advanceToNextDay(hour=9){
    this.state.day++;
    this.state.minute = hour*60;
    this.emit('timeChange', this.getTime());
    this.checkTimeEvents();
    this.checkIntel();
    this.checkInvitations();
    this.checkGroups();
    this.checkFlashbacks();
  }

  // ===== 事件调度 =====
  scheduleEvent(eventId){
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
        setTimeout(()=> this.scheduleEvent(evt.then), totalDelay);
      }
      return; // 不走 afterEvent
    } else if(evt.type === 'call'){
      // 电话事件：稍后触发
      setTimeout(()=> this.triggerCall(eventId), (evt.delay||0)*1000);
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
      this.emit('routeChoiceReady', STORY.routeChoice);
      return;
    } else if(evt.type === 'ending'){
      this.triggerEnding(evt.ending);
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
        setTimeout(()=> this.scheduleEvent(evt.then), totalDelay);
      }
      return;
    }
    this.afterEvent(evt);
  }
  afterEvent(evt){
    if(evt.then) setTimeout(()=> this.scheduleEvent(evt.then), 400);
  }

  checkTimeEvents(){
    // 检查基于时间触发的事件
    const t = this.getTime();
    const d = this.state.day;
    for(const [id, evt] of Object.entries(this.story.events)){
      if(this.state.firedEvents[id]) continue;
      if(evt.trigger && evt.trigger.day === d && evt.trigger.hour === t.hour){
        this.state.firedEvents[id] = true;
        this.scheduleEvent(id);
      }
    }
  }

  // ===== 消息系统 =====
  queueMessage(msg, delay=0){
    // 旁白消息：不依赖会话，直接发出事件（带选项时作为决策弹窗）
    if(msg.from === 'narrator'){
      setTimeout(()=>{
        this.emit('messageReceived', {from:'narrator', text:msg.text});
        if(msg.choice){
          this.emit('choicePrompt', {convId:'narrator', choice:msg.choice, conv:null});
        }
        if(msg.then) setTimeout(()=> this.scheduleEvent(msg.then), 600);
      }, delay*1000);
      return;
    }
    const conv = this.state.conversations[msg.from];
    if(!conv) return;
    setTimeout(()=>{
      if(conv.finished) return;
      conv.typing = true;
      this.emit('conversationUpdate', {id:msg.from, conv});
      // 打字时间根据字数
      const typingTime = Math.min(2200, Math.max(700, msg.text.length * 50));
      setTimeout(()=>{
        conv.typing = false;
        const msgObj = {
          from: msg.from,
          text: msg.text,
          time: this.getTime().time,
          ts: Date.now()
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
        if(msg.followup){
          const fu = msg.followup;
          setTimeout(()=>{
            // 若该消息仍是会话最后一条（玩家既没读也没回）→ 触发跟进
            if(conv.messages[conv.messages.length-1] === msgObj && conv.unread > 0){
              conv.messages.push({
                from: msg.from,
                text: fu.text,
                time: this.getTime().time,
                ts: Date.now(),
                isFollowup: true
              });
              conv.unread++;
              if(fu.affection){
                Object.keys(fu.affection).forEach(k=> this.state.affection[k] += fu.affection[k]);
              }
              this.emit('conversationUpdate', {id:msg.from, conv});
              this.emit('messageReceived', {from:msg.from, text:fu.text, conv, isFollowup:true});
              this.emit('stateChange', this.state);
            }
          }, (fu.delay || 30) * 1000);
        }
        // 链式触发下一个事件（msg.then 指向 event id）
        if(msg.then) setTimeout(()=> this.scheduleEvent(msg.then), 600);
      }, typingTime);
    }, delay*1000);
  }

  // 玩家发送消息（通过选项触发）
  sendMessage(convId, text, effects){
    // 旁白决策：不入会话，仅应用 effects
    if(convId === 'narrator'){
      if(effects){
        if(effects.affection) Object.keys(effects.affection).forEach(k=> this.state.affection[k] += effects.affection[k]);
        if(effects.flags) Object.keys(effects.flags).forEach(k=> this.state.flags[k] = effects.flags[k]);
        if(effects.personality) Object.keys(effects.personality).forEach(k=> this.state.personality[k] += effects.personality[k]);
        if(effects.thenEvent) this._dispatchSpecialThen(effects.thenEvent);
      }
      return;
    }
    const conv = this.state.conversations[convId];
    if(!conv) return;
    conv.messages.push({from:'me', text, time:this.getTime().time, ts:Date.now()});
    this.emit('conversationUpdate', {id:convId, conv});
    if(effects){
      if(effects.affection) Object.keys(effects.affection).forEach(k=> this.state.affection[k] += effects.affection[k]);
      if(effects.flags) Object.keys(effects.flags).forEach(k=> this.state.flags[k] = effects.flags[k]);
      if(effects.personality) Object.keys(effects.personality).forEach(k=> this.state.personality[k] += effects.personality[k]);
      if(effects.thenEvent) this._dispatchSpecialThen(effects.thenEvent);
    }
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
    setTimeout(()=> this.scheduleEvent(thenEvent), 900);
  }

  // 玩家选择路线（特殊处理：直接触发对应路线的首个事件）
  chooseRoute(route){
    this.state.route = route;
    this.state.flags.route = route;
    // 进入路线后，未处理的邀约自动判定为 missed
    this.missPendingInvitations();
    const opt = STORY.routeChoice.options.find(o=>o.route===route);
    if(opt && opt.thenEvent) this.scheduleEvent(opt.thenEvent);
    this.emit('stateChange', this.state);
  }

  // 标记会话已读
  markRead(convId){
    const conv = this.state.conversations[convId];
    if(conv) conv.unread = 0;
    this.emit('stateChange', this.state);
  }

  // ===== 电话系统 =====
  triggerCall(eventId){
    const evt = this.story.events[eventId];
    if(!evt || evt.type !== 'call') return;
    this.state.firedEvents[eventId] = true;
    this._pendingCallEventId = eventId;
    this.emit('incomingCall', {
      from: evt.from,
      name: this.story.characters[evt.from].name,
      script: evt.script,
      eventId
    });
    // 25 秒未接听 → 自动 missed 并留语音信箱
    if(this._callMissTimer) clearTimeout(this._callMissTimer);
    this._callMissTimer = setTimeout(()=>{
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
  }
  answerCall(eventId){
    if(this._callMissTimer){ clearTimeout(this._callMissTimer); this._callMissTimer = null; }
    this._pendingCallEventId = null;
    this.emit('callAnswered', eventId);
  }
  declineCall(eventId){
    if(this._callMissTimer){ clearTimeout(this._callMissTimer); this._callMissTimer = null; }
    this._pendingCallEventId = null;
    const evt = this.story.events[eventId];
    // 留下语音信箱（基于 script 末尾的台词）
    if(evt && evt.from && evt.script){
      const lastHim = [...evt.script].reverse().find(l=>l.who==='him');
      if(lastHim){
        this.addVoicemail(evt.from, lastHim.text, eventId, evt.voicemailCallback || null);
      }
    }
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
      setTimeout(()=>{
        moment.comments.push({from: moment.author, text: moment.replyOnLike, isReply:true});
        this.emit('momentUpdate', moment);
        this.emit('stateChange', this.state);
      }, 1500);
    }
    // 好感度变化
    const tmpl = this.story.moments[momentId];
    if(tmpl?.onLike?.affection){
      Object.keys(tmpl.onLike.affection).forEach(k=> this.state.affection[k] += tmpl.onLike.affection[k]);
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
    if(opt.affection){
      Object.keys(opt.affection).forEach(k=> this.state.affection[k] += opt.affection[k]);
    }
    // 角色回复
    if(opt.reply){
      setTimeout(()=>{
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
    setTimeout(()=>{
      moment.likes.push(topChar);
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
    if(opt.personality){
      Object.keys(opt.personality).forEach(k=> this.state.personality[k] += opt.personality[k]);
    }
    this.emit('dreamResolved', {dreamId, choice: opt});
    this.emit('stateChange', this.state);
    // 触发后续
    if(dream.then) setTimeout(()=> this.scheduleEvent(dream.then), 800);
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
    if(!opt) return;
    // 应用 effects
    if(opt.affection){
      Object.keys(opt.affection).forEach(k=> this.state.affection[k] += opt.affection[k]);
    }
    if(opt.personality){
      Object.keys(opt.personality).forEach(k=> this.state.personality[k] += opt.personality[k]);
    }
    if(opt.flags){
      Object.keys(opt.flags).forEach(k=> this.state.flags[k] = opt.flags[k]);
    }
    // 角色回复（若有）
    if(opt.reply){
      const conv = this.state.conversations[enc.char];
      if(conv){
        setTimeout(()=>{
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
        setTimeout(()=> this.emit('messageReceived', {from:'narrator', text:opt.reply}), 1200);
      }
    }
    this.emit('encounterResolved', {enc, opt});
    this.emit('stateChange', this.state);
    // 触发 then（赴约场景的后续事件）
    const thenEvt = enc.then || this._pendingEncounterThen;
    this._pendingEncounterThen = null;
    if(thenEvt) setTimeout(()=> this.scheduleEvent(thenEvt), 1000);
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
    if(opt.personality){
      Object.keys(opt.personality).forEach(k=> this.state.personality[k] += opt.personality[k]);
    }
    this.emit('memoryResolved', {memId, opt});
    this.emit('stateChange', this.state);
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
    // 检查超时的 pending 邀约
    this.state.invitations.forEach(p=>{
      if(p.status !== 'pending') return;
      const inv = this.story.invitations[p.id];
      if(!inv) return;
      const elapsed = (Date.now() - p.ts)/1000;
      // 测试环境加速：实际游戏 120s 太长，这里用 60s 作上限，且 advanceTime 会主动判定
      if(elapsed > (inv.timeoutSec || 120) * 1000){ /* 不靠真实时间触发 */ }
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
      if(inv.affectionOnDecline){
        Object.keys(inv.affectionOnDecline).forEach(k=> this.state.affection[k] += inv.affectionOnDecline[k]);
      }
      this.scheduleEvent(inv.declineEvent);
    } else if(decision === 'missed'){
      if(inv.affectionOnMiss){
        Object.keys(inv.affectionOnMiss).forEach(k=> this.state.affection[k] += inv.affectionOnMiss[k]);
      }
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
        if(inv && !inv.condition(this.state)){
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
          if(g.createEvent) setTimeout(()=> this.scheduleEvent(g.createEvent), 1500);
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
    setTimeout(()=>{
      g.typing = true;
      this.emit('groupUpdate', {id:groupId, group:g});
      const typingTime = Math.min(2200, Math.max(700, msg.text.length * 50));
      setTimeout(()=>{
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
        if(msg.then) setTimeout(()=> this.scheduleEvent(msg.then), 600);
      }, typingTime);
    }, delay*1000);
  }
  // 玩家在群里选择
  sendGroupMessage(groupId, text, effects){
    const g = this.state.groups[groupId];
    if(!g) return;
    g.messages.push({from:'me', text, time:this.getTime().time, ts:Date.now()});
    this.emit('groupUpdate', {id:groupId, group:g});
    if(effects){
      if(effects.affection) Object.keys(effects.affection).forEach(k=> this.state.affection[k] += effects.affection[k]);
      if(effects.flags) Object.keys(effects.flags).forEach(k=> this.state.flags[k] = effects.flags[k]);
      if(effects.personality) Object.keys(effects.personality).forEach(k=> this.state.personality[k] += effects.personality[k]);
      if(effects.thenEvent) setTimeout(()=> this.scheduleEvent(effects.thenEvent), 900);
    }
  }
  markGroupRead(groupId){
    const g = this.state.groups[groupId];
    if(g) g.unread = 0;
    this.emit('stateChange', this.state);
  }

  // ===== 语音信箱（未接来电） =====
  addVoicemail(from, text, eventId, callbackEvent){
    const vm = {
      id: 'vm_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
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
          if(opt.personality){
            Object.keys(opt.personality).forEach(k=> this.state.personality[k] += opt.personality[k]);
          }
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
    if(fb.then) setTimeout(()=> this.scheduleEvent(fb.then), 800);
  }

  // ===== 时间推进动画 =====
  showTimeAdvance(text, callback){
    this.emit('timeAdvance', {text});
    setTimeout(()=>{ callback && callback(); this.emit('timeAdvanceEnd'); }, 1800);
  }

  // ===== 结局 =====
  triggerEnding(endingId){
    this.state.ended = true;
    this.state.endingSeen[endingId] = true;
    this.emit('ending', this.story.endings[endingId]);
  }

  // ===== 存档 =====
  save(slot){
    const data = {
      state: this.state,
      time: new Date().toISOString(),
      label: `第${this.state.day}天 · ${this.getTime().time}`
    };
    const saves = this.getAllSaves();
    saves[slot] = data;
    localStorage.setItem('neon_phone_saves', JSON.stringify(saves));
  }
  load(slot){
    const saves = this.getAllSaves();
    const data = saves[slot];
    if(!data) return false;
    this.state = data.state;
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
