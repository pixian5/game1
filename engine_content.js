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
