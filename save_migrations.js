/* 存档迁移保持纯函数，具体字段校验仍由 PhoneEngine._sanitizeLoadedState 完成。 */
const SaveMigrations = {
  CURRENT_VERSION: 4,

  migrate(raw){
    const save = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const source = save.state && typeof save.state === 'object' && !Array.isArray(save.state) ? save.state : {};
    const state = {...source};
    const version = Number.isFinite(Number(save.v)) ? Number(save.v) : 1;

    if(version < 3){
      if(!Array.isArray(state.pendingInteractions)){
        state.pendingInteractions = state.pendingInteraction ? [state.pendingInteraction] : [];
      }
      if(!Array.isArray(state.pendingFollowups)) state.pendingFollowups = [];
      if(!Array.isArray(state.pendingTimeAdvances)) state.pendingTimeAdvances = [];
    }

    if(version < 4){
      // v0.9.7：选线前挂起的路线事件队列；旧档没有该字段，且已选线的旧档无需补发
      if(!Array.isArray(state.pendingRouteEvents)) state.pendingRouteEvents = [];
      if(state.route) state.pendingRouteEvents = [];
    }

    return {...save, v:SaveMigrations.CURRENT_VERSION, state};
  }
};

if(typeof window !== 'undefined') window.SaveMigrations = SaveMigrations;
