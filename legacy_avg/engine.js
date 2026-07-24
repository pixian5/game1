/* ===== 霓虹心事 · AVG 引擎 ===== */
class AVGEngine {
  constructor(story){
    this.story = story;
    this.state = this.defaultState();
    this.listeners = {};
    this.history = []; // 回看日志
  }
  defaultState(){
    return {
      sceneId:null,
      stepIndex:0,
      affection:{shenyan:0, luci:0, jiangyu:0},
      flags:{},
      route:null,
      readScenes:{},
      endingSeen:{},
      chapter:'',
      date:''
    };
  }
  on(event, fn){ (this.listeners[event] ||= []).push(fn); }
  emit(event, payload){ (this.listeners[event]||[]).forEach(fn=>fn(payload)); }

  newGame(){
    this.state = this.defaultState();
    this.history = [];
    this.loadScene('prologue_1');
  }

  loadScene(sceneId){
    const scene = this.story.scenes[sceneId];
    if(!scene){ console.error('场景不存在:', sceneId); return; }
    this.state.sceneId = sceneId;
    this.state.stepIndex = 0;
    this.state.chapter = scene.chapter || this.state.chapter;
    this.state.date = scene.date || this.state.date;
    this.state.readScenes[sceneId] = true;
    this.emit('sceneChange', {scene, state:this.state});
    this.renderCurrent();
  }

  getCurrentStep(){
    const scene = this.story.scenes[this.state.sceneId];
    if(!scene) return null;
    return scene.steps[this.state.stepIndex] || null;
  }

  renderCurrent(){
    const step = this.getCurrentStep();
    if(!step){
      // 场景结束，无后续
      return;
    }
    const scene = this.story.scenes[this.state.sceneId];
    switch(step.type){
      case 'talk':
      case 'narration':
        this.emit('step', {step, scene, state:this.state});
        break;
      case 'choice':
        this.emit('choice', {step, scene, state:this.state});
        break;
      case 'goto':
        this.loadScene(step.next);
        break;
      case 'ending':
        this.state.endingSeen[step.id] = true;
        this.emit('ending', {ending:this.story.endings[step.id], state:this.state});
        break;
      default:
        console.error('未知步骤类型:', step.type);
    }
  }

  next(){
    const step = this.getCurrentStep();
    if(!step) return;
    if(step.type==='talk' || step.type==='narration'){
      // 记录到回看日志
      this.history.push({
        speaker: step.speaker || '',
        name: step.speaker ? (this.story.characters[step.speaker]?.name || '') : '',
        text: step.text,
        scene: this.state.sceneId
      });
      this.state.stepIndex++;
      this.renderCurrent();
    }
    // choice / ending / goto 不响应 next
  }

  choose(optionIndex){
    const step = this.getCurrentStep();
    if(!step || step.type!=='choice') return;
    const opt = step.options[optionIndex];
    if(!opt) return;
    // 应用效果
    if(opt.effects){
      if(opt.effects.affection){
        for(const k in opt.effects.affection){
          this.state.affection[k] = (this.state.affection[k]||0) + opt.effects.affection[k];
        }
      }
      if(opt.effects.flags){
        for(const k in opt.effects.flags){
          this.state.flags[k] = opt.effects.flags[k];
          if(k==='route') this.state.route = opt.effects.flags[k];
        }
      }
    }
    if(opt.next){
      this.loadScene(opt.next);
    } else {
      this.state.stepIndex++;
      this.renderCurrent();
    }
  }

  // 存档
  save(slot){
    const data = {
      state: this.state,
      history: this.history.slice(-50),
      time: new Date().toISOString(),
      label: this.getSaveLabel()
    };
    const saves = this.getAllSaves();
    saves[slot] = data;
    localStorage.setItem('neon_saves', JSON.stringify(saves));
    return data;
  }
  load(slot){
    const saves = this.getAllSaves();
    const data = saves[slot];
    if(!data) return false;
    this.state = data.state;
    this.history = data.history || [];
    this.emit('sceneChange', {scene:this.story.scenes[this.state.sceneId], state:this.state});
    this.renderCurrent();
    return true;
  }
  deleteSave(slot){
    const saves = this.getAllSaves();
    delete saves[slot];
    localStorage.setItem('neon_saves', JSON.stringify(saves));
  }
  getAllSaves(){
    try{ return JSON.parse(localStorage.getItem('neon_saves')||'{}'); }
    catch(e){ return {}; }
  }
  getSaveLabel(){
    const scene = this.story.scenes[this.state.sceneId];
    return `${this.state.chapter||''} · ${this.state.date||''}`.trim();
  }

  // 设置
  getSettings(){
    try{ return JSON.parse(localStorage.getItem('neon_settings')||'null') || {
      textSpeed:40, autoInterval:3, sfx:true, skipUnread:false
    }; }catch(e){ return {textSpeed:40, autoInterval:3, sfx:true, skipUnread:false}; }
  }
  saveSettings(s){
    localStorage.setItem('neon_settings', JSON.stringify(s));
  }

  getEndings(){ return this.story.endings; }
  getCharacters(){ return this.story.characters; }
  getBackgrounds(){ return this.story.backgrounds; }
}

if (typeof window !== 'undefined') window.AVGEngine = AVGEngine;
