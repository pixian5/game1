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
      return {prompt:asText(c.prompt, 1000), options, isInvitation:asBool(c.isInvitation)};
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
          return {id:/^[a-zA-Z0-9_:-]{1,120}$/.test(m.id || '') ? m.id : null, from, text:asText(m.text, 1000), time:asText(m.time, 8), day:asInt(m.day, 0, 0, 9999), ts:asInt(m.ts, 0, 0, 9999999999999), replied:asBool(m.replied), isFollowup:asBool(m.isFollowup), isGiftReaction:asBool(m.isGiftReaction)};
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
    out.pendingInteractions = pendingRaw.map(sanitizePendingInteraction).filter(Boolean);
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
