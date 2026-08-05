/* 进行中交互的轻量状态容器。引擎状态仍是普通 JSON，便于存档和导入。 */
class InteractionQueue {
  static priorities = {call:100, encounter:80, narrator_choice:70, route_choice:60};

  static ensure(state){
    if(!Array.isArray(state.pendingInteractions)) state.pendingInteractions = [];
    // v3 之前只有单个 pendingInteraction，第一次访问时迁移到队列。
    if(state.pendingInteractions.length === 0 && state.pendingInteraction && typeof state.pendingInteraction === 'object'){
      state.pendingInteractions.push(state.pendingInteraction);
    }
    this.syncLegacy(state);
    return state.pendingInteractions;
  }

  static syncLegacy(state){
    const list = Array.isArray(state.pendingInteractions) ? state.pendingInteractions : [];
    const sorted = [...list].sort((a,b)=>(b.priority||this.priorities[b.type]||0)-(a.priority||this.priorities[a.type]||0));
    state.pendingInteraction = sorted[0] || null;
    return state.pendingInteraction;
  }

  static upsert(state, item){
    const list = this.ensure(state);
    const id = item.id || `${item.type}:${item.eventId || item.encounterId || Date.now()}`;
    const next = {...item, id, priority:item.priority || this.priorities[item.type] || 0};
    const idx = list.findIndex(x=>x.id === id);
    if(idx >= 0) list[idx] = next;
    else list.push(next);
    this.syncLegacy(state);
    return next;
  }

  static find(state, predicate){
    return this.ensure(state).find(predicate) || null;
  }

  static remove(state, predicate){
    const list = this.ensure(state);
    const kept = [];
    const removed = [];
    list.forEach(item => (predicate(item) ? removed : kept).push(item));
    if(removed.length) state.pendingInteractions = kept;
    this.syncLegacy(state);
    return removed;
  }

  static all(state){ return [...this.ensure(state)]; }
}

if(typeof window !== 'undefined') window.InteractionQueue = InteractionQueue;
