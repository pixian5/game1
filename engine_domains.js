/* ===== 霓虹心事 · SaveManager / EventScheduler（v0.5.8 阶段 F2.3）=====
 * 从 PhoneEngine 上帝对象渐进拆出的两个职责域：
 *   - SaveManager：存档槽位/清洗/迁移/导入导出（原 engine_save.js 的方法域）
 *   - EventScheduler：定时器注册/清理/事件分发队列（原 engine.js 的 _timer 域）
 * 组合方式：两者持有 engine 引用（访问 state/story/emit），方法以 prototype 转发挂在
 * PhoneEngine 上——全部既有调用面（UI/测试/存档格式）零改动，纯内部重组。
 */
'use strict';

class EventScheduler {
  constructor(engine){
    this.engine = engine;
    this.timers = new Set();          // _setTimeout 句柄表
    this.callMissTimers = new Map();  // eventId -> timerId（并发通话）
    this.scheduledEvents = new Set(); // 已排队未触发（不提前入 firedEvents）
  }
  setTimeout(fn, delay){
    const clock = this.engine._clock;
    const handle = clock.setTimeout(() => {
      this.timers.delete(handle);
      try { fn(); } catch(e){ console.error('[engine timer]', e); }
    }, delay);
    this.timers.add(handle);
    return handle;
  }
  clearTimeout(handle){ this.engine._clock.clearTimeout(handle); this.timers.delete(handle); }
  clearAll(){
    this.timers.forEach(id => this.engine._clock.clearTimeout(id));
    this.timers.clear();
    this.callMissTimers.forEach(id => this.engine._clock.clearTimeout(id));
    this.callMissTimers.clear();
    this.scheduledEvents.clear();
  }
}

class SaveManager {
  constructor(engine){
    this.engine = engine;
    this.memorySaves = {};   // localStorage 不可用时的内存存档
    this.cache = null;       // v0.1.7 起的内存缓存
  }
  // 具体方法仍由 engine_save.js 的 prototype 混入提供（本类先承载状态域，
  // 方法迁移在后续版本逐个搬移，每步保持测试全绿——见 docs F2.3 计划）。
}

if (typeof window !== 'undefined'){ window.EventScheduler = EventScheduler; window.SaveManager = SaveManager; }
else if (typeof globalThis !== 'undefined'){ globalThis.EventScheduler = EventScheduler; globalThis.SaveManager = SaveManager; }
