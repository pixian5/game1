/* ===== 霓虹心事 · 测试虚拟时钟（v0.5.7 F2.2）=====
 * 供 vm 沙箱注入：零真实等待跑完全部延迟事件。
 * 用法（测试侧）：
 *   const clock = FakeClock.create();
 *   sandbox.Clock = clock.api; sandbox.setTimeout = clock.setTimeout; sandbox.clearTimeout = clock.clearTimeout;
 *   ... 触发事件后 clock.flush();  // 立即执行全部到期定时器
 */
(function(){
  'use strict';
  function create(){
    let seq = 0;
    const tasks = new Map();     // id -> {fn, at}
    let now = 0;
    function setTimeout(fn, delay){
      const id = ++seq;
      tasks.set(id, {fn, at: now + Math.max(0, delay)});
      return id;
    }
    function clearTimeout(id){ tasks.delete(id); }
    function advance(ms){       // 前进虚拟时间并执行到期任务
      now += ms;
      flush();
    }
    function flush(){           // 执行全部已到期任务（新任务可能再排，循环到稳态）
      let guard = 10000;
      while(guard-- > 0){
        const due = [...tasks.entries()].filter(([, t]) => t.at <= now).sort((a, b) => a[1].at - b[1].at);
        if(!due.length) break;
        for(const [id, t] of due){ tasks.delete(id); t.fn(); }
      }
    }
    const api = { setTimeout, clearTimeout, advance, flush, now: () => now, pending: () => tasks.size };
    return {
      api,
      setTimeout, clearTimeout, advance, flush,
      Date: { now: () => now },   // engine._clock 读取 now()
    };
  }
  const FakeClock = { create };
  if(typeof window !== 'undefined') window.FakeClock = FakeClock;
  else if(typeof globalThis !== 'undefined') globalThis.FakeClock = FakeClock;
})();
