/* ===== 霓虹心事 · 引擎：成长系统：成就/收集/彩蛋/线索解谜/季节节日/视角/玩家档案/问答/关系阶段/每日任务/连胜/观赏模式/好感深度/主题/结局图鉴/约会/梦魇/提示 =====
 * 本文件由 engine.js 拆分而来（v0.1.7），方法逐字搬移，经 Object.assign 混入 PhoneEngine.prototype。
 */

Object.assign(PhoneEngine.prototype, {
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
  },

  isTrueEndingUnlocked(){
    try {
      return this.story.trueEndingUnlockCondition(this.state);
    } catch(_) { return false; }
  },

  getUnlockedAchievements(){
    const list = [];
    for(const [id, ach] of Object.entries(this.story.achievements||{})){
      if(this.state.achievements[id]){
        list.push({...ach, unlocked:true});
      }
    }
    return list;
  },

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
  },

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
  },

  getCollectedByCategory(cat){
    return this.state.collected
      .map(id => this.story.collectibles[id])
      .filter(c => c && c.cat === cat);
  },

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
  },

  getUnlockedEasterEggs(){
    return Object.keys(this.state.easterEggsSeen||{})
      .map(id => this.story.easterEggs?.[id])
      .filter(Boolean);
  },

  discoverClue(clueId){
    this.state.discoveredClues[clueId] = true;
    this.emit('clueDiscovered', {clueId});
    this.emit('stateChange', this.state);
  },

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
  },

  isPuzzleSolved(puzzleId){
    return this.state.puzzleProgress[puzzleId]?.solved === true;
  },

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
  },

  getCurrentSeason(){
    const date = this.getDateLabel();
    const seasonId = this.story.seasons?.getSeason(date.month) || 'summer';
    return this.story.seasons?.seasonInfo[seasonId] || {id:seasonId, name:'夏', icon:'☀️', desc:''};
  },

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
    if(eff.coins) this.state.coins = (this.state.coins || 0) + eff.coins;  // v0.1.7: 支持金币奖励
    if(eff.flag) this.state.flags[eff.flag] = true;
    if(eff.personality){
      for(const k in eff.personality){
        if(this.state.personality[k] !== undefined) this.state.personality[k] += eff.personality[k];
      }
    }
    this.emit('holidayTriggered', {holiday, date});
    this.emit('stateChange', this.state);
    return holiday;
  },

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
  },

  isPerspectiveUnlocked(charId){
    const p = this.story.malePerspectives?.[charId];
    if(!p) return false;
    try { return p.unlockCondition(this.state); } catch(_) { return false; }
  },

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
  },

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
  },

  isTruthEndingSeen(charId){
    return this.state.truthEndingsSeen[charId] === true;
  },

  isUltimateTruthEndingUnlocked(){
    return ['shenyan','luci','jiangyu'].every(c => this.state.truthEndingsSeen[c] === true);
  },

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
  },

  getPlayer(){
    if(this.state.player) return this.state.player;
    return (this.story.playerCustomization && this.story.playerCustomization.defaultPlayer) || {name:'林夏',nickname:'夏夏',avatar:'林'};
  },

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
  },

  _applyQuizPersonalityDelta(quiz, optIdx, direction){
    if(!quiz || !Number.isInteger(optIdx) || !quiz.options?.[optIdx]?.effects?.personality) return;
    const delta = {};
    for(const [key, value] of Object.entries(quiz.options[optIdx].effects.personality)){
      if(this.state.personality[key] !== undefined && Number.isFinite(value)) delta[key] = value * direction;
    }
    this._applyEffects({personality: delta});
  },

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
  },

  finishQuiz(){
    this.state.playerQuizDone = true;
    this.emit('quizFinished', this.state.player);
    this.emit('stateChange', this.state);
  },

  getCharNickname(charId){
    const aff = this.state.affection[charId] || 0;
    const list = this.story.playerCustomization?.dynamicNicknames?.[charId] || [];
    for(const n of list){
      if(aff >= n.min && aff <= n.max) return n;
    }
    return list[0] || { call: this.getPlayer().name, inner: '' };
  },

  replacePlayerTokens(text){
    if(!text) return text;
    const p = this.getPlayer();
    return text.replace(/\$PLAYER\$/g, p.name)
               .replace(/\$NICK\$/g, p.nickname);
  },

  getRelationshipStage(charId){
    const aff = this.state.affection[charId] || 0;
    const stages = this.story.relationshipStages?.[charId] || [];
    for(const s of stages){
      if(aff >= s.minAff && aff <= s.maxAff) return s;
    }
    return stages[0] || null;
  },

  getRelationshipStageNum(charId){
    const st = this.getRelationshipStage(charId);
    return (st && st.stage) || 1;
  },

  checkRelationshipStageUp(charId){
    const cur = this.getRelationshipStageNum(charId);
    const prev = this.state.relationshipStages[charId] || 1;
    if(cur > prev){
      // 阶段提升
      this.state.relationshipStages[charId] = cur;
      const stage = this.getRelationshipStage(charId);
      this.emit('relationshipStageUp', {charId, stage, prevStage: prev});
      // 临界事件延迟入队；任务本身持久化，读档后仍可继续派发。
      if(stage.criticalEvent){
        const evt = this.story.criticalEvents?.[stage.criticalEvent];
        const pending = this.state.pendingEventDispatches.some(item=>item.eventId === stage.criticalEvent);
        if(evt && !this.state.firedEvents[stage.criticalEvent] && !pending){
          this._queueEventDispatch(stage.criticalEvent, 2000);
        }
      }
      return stage;
    } else if(cur < prev){
      this.state.relationshipStages[charId] = cur;
    }
    return null;
  },

  getAllRelationshipStages(){
    return ['shenyan','luci','jiangyu'].map(cid => ({
      charId: cid,
      stage: this.getRelationshipStage(cid) || {stage:1, name:'陌生', title:'', desc:''},
      stageNum: this.getRelationshipStageNum(cid),
      affection: this.state.affection[cid] || 0
    }));
  },

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
  },

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
  },

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
  },

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
  },

  getDailyTasks(){
    if(this.state.lastTaskDay !== this.state.day){
      this.generateDailyTasks();
    }
    return this.state.dailyTasks;
  },

  setWatchMode(enabled, strategy){
    this.state.watchMode = !!enabled;
    if(strategy) this.state.watchStrategy = strategy;
    this.emit('watchModeChanged', {enabled: this.state.watchMode, strategy: this.state.watchStrategy});
    this.emit('stateChange', this.state);
  },

  pickAutoChoice(options){
    const strategy = this.story.watchMode?.strategies?.[this.state.watchStrategy] || this.story.watchMode?.strategies?.balanced;
    if(!strategy || !options || options.length === 0) return 0;
    try { return strategy.pick(options); } catch(_) { return 0; }
  },

  getAffectionDetail(charId){
    const ad = this.state.affectionDetail && this.state.affectionDetail[charId];
    if(!ad) return {closeness:0, trust:0, tension:0};
    return {closeness:ad.closeness||0, trust:ad.trust||0, tension:ad.tension||0};
  },

  getAffectionDimStage(charId, dimId){
    const ad = this.getAffectionDetail(charId);
    const stages = this.story.affectionDimStages?.[dimId] || [];
    const v = ad[dimId] || 0;
    for(const s of stages){
      if(v >= s.min && v <= s.max) return s;
    }
    return stages[0] || {name:'-'};
  },

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
  },

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
  },

  setTheme(themeId){
    if(!this.state.unlockedThemes[themeId]) return false;
    this.state.currentTheme = themeId;
    this.emit('themeChanged', {type:'theme', id:themeId, theme:this.story.themes[themeId]});
    this.emit('stateChange', this.state);
    return true;
  },

  setIconTheme(iconThemeId){
    if(!this.state.unlockedIconThemes[iconThemeId]) return false;
    this.state.currentIconTheme = iconThemeId;
    this.emit('themeChanged', {type:'iconTheme', id:iconThemeId, theme:this.story.iconThemes[iconThemeId]});
    this.emit('stateChange', this.state);
    return true;
  },

  getCurrentTheme(){ return this.story.themes?.[this.state.currentTheme] || this.story.themes?.default; },

  getCurrentIconTheme(){ return this.story.iconThemes?.[this.state.currentIconTheme] || this.story.iconThemes?.default; },

  recordEndingGallery(endingId){
    if(!endingId) return;
    this.state.endingGallerySeen[endingId] = true;
    this.emit('endingGalleryUpdated', endingId);
  },

  getEndingGallery(){
    const all = this.story.endingGallery || {};
    return Object.values(all).map(e => ({
      ...e,
      seen: !!this.state.endingGallerySeen[e.id],
      charName: e.charId ? (this.story.characters[e.charId]?.name || e.charId) : '独行线'
    }));
  },

  computeCurrentEnding(){
    if(typeof this.story.computeEnding !== 'function') return null;
    try { return this.story.computeEnding(this.state, this.state.route); }
    catch(_) { return null; }
  },

  canDate(charId){
    const last = this.state.dateLastDone[charId];
    if(!last) return true;  // 0/undefined/null 都视为未约过
    const cooldown = this.story.dateCooldownDays || 7;
    return (this.state.day - last) >= cooldown;
  },

  getAvailableDateScenes(charId){
    const list = (this.story.dateScenes && this.story.dateScenes[charId]) || [];
    return list.filter(s => !this.state.firedEvents[s.id]);
  },

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
  },

  cancelDate(){
    this._pendingDate = null;
  },

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
  },

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
  },

  // v0.1.10: 暧昧度分项——深夜（23 点后）心动独白
  // tension≥10 的男主发来一条独白消息（每角色一次，flag 去重）；呼应「心跳加速的瞬间累积」
  checkTensionWhispers(){
    if(this.state.ended) return;
    const hour = Math.floor(this.state.minute / 60);
    if(hour < 23) return;
    for(const cid of ['shenyan','luci','jiangyu']){
      const ad = this.state.affectionDetail?.[cid];
      if(!ad || ad.tension < 10) continue;
      const flag = 'whisper_' + cid + '_done';
      if(this.state.flags[flag]) continue;
      const evtId = 'tension_whisper_' + cid;
      if(!this.story.events?.[evtId] || this.state.firedEvents[evtId]) continue;
      this.scheduleEvent(evtId);
    }
  },

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
  },

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
  },

  setShowOptionHints(on){
    this.state.showOptionHints = !!on;
    this.emit('optionHintsToggled', this.state.showOptionHints);
    this.emit('stateChange', this.state);
  },

  getOptionHint(opt){
    if(!this.state.showOptionHints) return null;
    if(!this.story.optionHints?.generate) return null;
    try { return this.story.optionHints.generate(opt); } catch(_) { return null; }
  },

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
  },

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
  },

  getCurrentAmbience(){
    const list = this.story.ambiences || {};
    // 优先级：anxious > rainy > unlucky > night > dusk > dawn > lucky > day
    // （v0.1.8: unlucky/lucky 为塔罗运势层，低于心情与天气，高于白昼底色）
    const priority = ['anxious','rainy','unlucky','night','dusk','dawn','lucky','day'];
    for(const id of priority){
      const a = list[id];
      if(!a) continue;
      try { if(a.cond(this.state)) return a; } catch(_) {}
    }
    return null;
  },
});
