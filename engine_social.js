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
    // 进入路线后，未处理的邀约自动判定为 missed
    this.missPendingInvitations();
    const opt = this.story.routeChoice.options.find(o=>o.route===route);
    if(opt && opt.thenEvent) this.scheduleEvent(opt.thenEvent);
    this.emit('stateChange', this.state);
    return true;
  },

  markRead(convId){
    const conv = this.state.conversations[convId];
    if(!conv) return;
    conv.unread = 0;
    this.emit('stateChange', this.state);
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
      heard: false
    };
    this.state.voicemails.unshift(vm);
    this.emit('voicemailReceived', vm);
    this.emit('stateChange', this.state);
    return vm.id;
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
