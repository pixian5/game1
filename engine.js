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
      ended: false
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
  }
  // 跳到次日某个时间
  advanceToNextDay(hour=9){
    this.state.day++;
    this.state.minute = hour*60;
    this.emit('timeChange', this.getTime());
    this.checkTimeEvents();
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
        conv.messages.push({
          from: msg.from,
          text: msg.text,
          time: this.getTime().time,
          ts: Date.now()
        });
        conv.unread++;
        this.emit('conversationUpdate', {id:msg.from, conv});
        this.emit('messageReceived', {from:msg.from, text:msg.text, conv});
        // 如果该消息后有玩家选择，触发选择
        if(msg.choice){
          conv.pendingChoice = msg.choice; // engine 层挂起选项，UI/测试均可读取
          this.emit('choicePrompt', {convId:msg.from, choice:msg.choice, conv});
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
        if(effects.thenEvent) setTimeout(()=> this.scheduleEvent(effects.thenEvent), 900);
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
      if(effects.thenEvent) setTimeout(()=> this.scheduleEvent(effects.thenEvent), 900);
    }
    // 不再自动推进时间——由 effects.thenEvent 自己用 advance_time/advance_day 控制
  }

  // 玩家选择路线（特殊处理：直接触发对应路线的首个事件）
  chooseRoute(route){
    this.state.route = route;
    this.state.flags.route = route;
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
    this.emit('incomingCall', {
      from: evt.from,
      name: this.story.characters[evt.from].name,
      script: evt.script,
      eventId
    });
  }
  answerCall(eventId){
    this.emit('callAnswered', eventId);
  }
  declineCall(eventId){
    const evt = this.story.events[eventId];
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
