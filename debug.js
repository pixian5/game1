/* ===== 霓虹心事 · 调试日志系统（v0.6.4）=====
 * 目的：开发/测试期实时捕获异常与运行时健康问题，便于「全流程跑一遍就发现问题」。
 *
 * 启用方式（默认关闭、零开销）：
 *   - URL 加 ?debug=1          → 本次开启
 *   - localStorage.neon_debug=1 → 长期开启（?debug=0 关闭）
 *   - 控制台：NeonDebug.enable() / disable()
 *
 * 能力：
 *   1. 事件流捕获：引擎全部 emit 事件（时间/类型/关键字段），环形缓冲保留最近 500 条
 *   2. 异常捕获：window.onerror / unhandledrejection / console.error 转发
 *   3. 运行时健康检测（每 2s 体检）：
 *      - 定时器泄漏：_timers 持续增长不回落
 *      - 消息积压：pendingMessages 长时间不消化
 *      - 屏幕卡死：同一屏停留过久且无任何事件
 *      - 资源 404：PerformanceObserver + fetch 失败
 *      - i18n 回退：英文模式下出现未翻译的中文文本
 *      - 未读爆增：单次 >5 条（信息过载预警）
 *   4. 导出：NeonDebug.dump() 返回文本；NeonDebug.download() 下载 .log
 *   5. 控制台面板：右下角小徽标（异常计数），点开看最近日志
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;

  const params = new URLSearchParams(location.search);
  const qs = params.get('debug');
  let enabled = false;
  try {
    if(qs === '0'){ localStorage.removeItem('neon_debug'); enabled = false; }
    else if(qs === '1'){ localStorage.setItem('neon_debug', '1'); enabled = true; }
    else enabled = localStorage.getItem('neon_debug') === '1';
  } catch(_) {}

  const MAX_ENTRIES = 500;
  const buffer = [];
  const issues = [];      // 仅异常/警告，便于快速定位
  let seq = 0;
  let engineRef = null;
  const t0 = Date.now();

  const ts = () => {
    const ms = Date.now() - t0;
    return '+' + String(ms).padStart(6, ' ') + 'ms';
  };

  function push(level, tag, msg, extra){
    if(!enabled) return;
    const entry = { seq: ++seq, at: ts(), level, tag, msg: String(msg), extra };
    buffer.push(entry);
    if(buffer.length > MAX_ENTRIES) buffer.shift();
    if(level !== 'info'){
      issues.push(entry);
      if(issues.length > 200) issues.shift();
      updateBadge();
      const fn = level === 'error' ? console.error : console.warn;
      fn('[NeonDebug]', entry.at, tag, msg, extra === undefined ? '' : extra);
    } else if(enabled && params.get('verbose') === '1'){
      console.log('[NeonDebug]', entry.at, tag, msg, extra === undefined ? '' : extra);
    }
  }
  const info = (tag, msg, extra) => push('info', tag, msg, extra);
  const warn = (tag, msg, extra) => push('warn', tag, msg, extra);
  const error = (tag, msg, extra) => push('error', tag, msg, extra);

  // ---------- 全局异常 ----------
  window.addEventListener('error', e => {
    error('window.error', e.message + ' @ ' + (e.filename || '?') + ':' + (e.lineno || 0));
  });
  window.addEventListener('unhandledrejection', e => {
    const r = e.reason;
    error('unhandledrejection', r && r.message ? r.message : String(r));
  });
  const origConsoleError = console.error.bind(console);
  console.error = function(...args){
    error('console.error', args.map(a => a && a.message ? a.message : String(a)).join(' '));
    origConsoleError(...args);
  };

  // ---------- 资源加载失败 ----------
  if(typeof PerformanceObserver !== 'undefined'){
    try {
      new PerformanceObserver(list => {
        for(const e of list.getEntries()){
          if(e.responseStatus >= 400) error('resource', e.responseStatus + ' ' + e.name);
        }
      }).observe({ type: 'resource', buffered: true });
    } catch(_) {}
  }
  window.addEventListener('offline', () => warn('network', '浏览器离线'));
  window.addEventListener('online', () => info('network', '浏览器恢复在线'));

  // ---------- 引擎事件流 ----------
  // 引擎创建后调用 attach(engine) 挂上（ui/00_shell 里已调用）
  const WATCH_EVENTS = [
    'stateChange','timeChange','messageReceived','choicePrompt','conversationUpdate',
    'incomingCall','callAnswered','callDeclined','ending','routeChoiceReady',
    'dreamStart','dreamResolved','nightmareTriggered','encounterTriggered','encounterResolved',
    'groupCreated','groupMessageReceived','itemCollected','achievementsUnlocked',
    'puzzleSolved','puzzleFailed','photoUnlocked','musicUnlocked','momentPosted',
    'holidayTriggered','tarotDrawn','giftGiven','saveFailed','loadFailed','gameLoaded','gameSaved',
    'ambienceChange','invitationNew','flashbackTriggered'
  ];
  function attach(engine){
    engineRef = engine;
    for(const evt of WATCH_EVENTS){
      engine.on(evt, payload => {
        if(!enabled) return;
        let brief = '';
        try {
          if(evt === 'messageReceived') brief = (payload.from || '') + ': ' + String(payload.text || '').slice(0, 40);
          else if(evt === 'choicePrompt') brief = (payload.convId || '') + ' → ' + String(payload.choice?.prompt || '').slice(0, 40);
          else if(evt === 'ending') brief = payload.id || payload.title || '';
          else if(evt === 'incomingCall') brief = payload.from || '';
          else if(evt === 'itemCollected') brief = payload.item?.name || payload.itemId || '';
          else if(evt === 'timeChange') brief = (payload?.time || '') + ' day' + (engine.state.day);
          else if(evt === 'saveFailed' || evt === 'loadFailed') brief = payload?.error || '';
        } catch(_) {}
        push(evt === 'saveFailed' || evt === 'loadFailed' ? 'error' : 'info', 'engine', evt + (brief ? ' | ' + brief : ''));
      });
    }
    info('debug', '已挂接引擎事件监听（' + WATCH_EVENTS.length + ' 类）');
    startHealthChecks();
  }

  // ---------- 运行时健康体检 ----------
  let healthTimer = null;
  let lastTimers = 0, timerGrowthStreak = 0;
  let lastScreen = '';
  let lastEventAt = Date.now();
  let lastUnread = 0;
  let pendingStuckSince = 0;

  function startHealthChecks(){
    if(healthTimer) return;
    healthTimer = setInterval(() => {
      if(!enabled || !engineRef) return;
      const e = engineRef;
      try {
        // 1) 定时器泄漏
        const timers = e._timers ? e._timers.size : 0;
        if(timers > lastTimers) timerGrowthStreak++; else timerGrowthStreak = 0;
        if(timerGrowthStreak >= 5 && timers > 8){
          warn('health', '定时器疑似泄漏：连续增长至 ' + timers + ' 个');
          timerGrowthStreak = 0;
        }
        lastTimers = timers;

        // 2) 待发消息积压
        const pendingMsgs = (e.state.pendingMessages || []).length;
        if(pendingMsgs > 0){
          if(!pendingStuckSince) pendingStuckSince = Date.now();
          else if(Date.now() - pendingStuckSince > 15000){
            warn('health', '待发消息积压 ' + pendingMsgs + ' 条超过 15s 未消化');
            pendingStuckSince = 0;
          }
        } else pendingStuckSince = 0;

        // 3) 未读爆增（信息过载）
        const unread = Object.values(e.state.conversations || {}).reduce((a, c) => a + (c.unread || 0), 0);
        if(unread - lastUnread >= 5){
          warn('health', '未读消息突增 ' + (unread - lastUnread) + ' 条（信息过载）', { unread });
        }
        lastUnread = unread;

        // 4) 屏幕卡死：同屏超过 60s 且无任何事件
        const screen = document.querySelector('.screen.active')?.id || '';
        if(screen !== lastScreen){ lastScreen = screen; lastEventAt = Date.now(); }
        else if(screen && Date.now() - lastEventAt > 60000 && (e.state.pendingMessages || []).length === 0){
          warn('health', '屏幕「' + screen + '」已停留 60s 且无事件（可能卡死或无内容）');
          lastEventAt = Date.now();
        }

        // 5) 英文模式下出现中文回退
        if(window.I18N && window.I18N.getLang && window.I18N.getLang() === 'en-US'){
          const body = document.querySelector('.screen.active')?.innerText || '';
          if(/[\u4e00-\u9fa5]{3,}/.test(body)){
            warn('health', '英文模式下检测到未翻译中文', { sample: body.match(/[\u4e00-\u9fa5]{3,}/)?.[0] });
          }
        }
      } catch(err){
        error('health', '体检异常: ' + err.message);
      }
    }, 2000);
  }
  function stopHealthChecks(){ if(healthTimer){ clearInterval(healthTimer); healthTimer = null; } }

  // ---------- 面板与导出 ----------
  let badge = null;
  function updateBadge(){
    if(!enabled) return;
    if(!badge){
      badge = document.createElement('div');
      badge.id = 'neon-debug-badge';
      badge.style.cssText = 'position:fixed;right:6px;bottom:6px;z-index:99999;background:rgba(0,0,0,.75);color:#ff5fa8;font:11px/1.4 monospace;padding:3px 6px;border-radius:8px;cursor:pointer;border:1px solid rgba(255,95,168,.5)';
      badge.title = '点击复制最近日志';
      badge.onclick = () => {
        const text = dump();
        if(navigator.clipboard) navigator.clipboard.writeText(text).then(() => {
          badge.textContent = '已复制 ' + issues.length;
          setTimeout(() => updateBadge(), 1200);
        });
      };
      document.body.appendChild(badge);
    }
    const errs = issues.filter(i => i.level === 'error').length;
    badge.textContent = 'DBG ' + errs + 'E/' + issues.length + 'W';
    badge.style.color = errs ? '#ff4d4d' : '#ff5fa8';
  }

  function dump(){
    const head = ['=== NeonDebug dump ===', 'enabled:' + enabled, 'entries:' + buffer.length, 'issues:' + issues.length, ''];
    const lines = buffer.map(e => `${e.at} [${e.level}] ${e.tag} — ${e.msg}` + (e.extra ? ' ' + JSON.stringify(e.extra) : ''));
    return head.concat(lines).join('\n');
  }
  function download(){
    const blob = new Blob([dump()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'neon-debug-' + new Date().toISOString().replace(/[:.]/g, '-') + '.log';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  window.NeonDebug = {
    enable(){ enabled = true; try { localStorage.setItem('neon_debug','1'); } catch(_) {} info('debug','已启用'); if(engineRef) startHealthChecks(); return true; },
    disable(){ enabled = false; stopHealthChecks(); try { localStorage.removeItem('neon_debug'); } catch(_) {} return false; },
    isEnabled(){ return enabled; },
    attach,
    info, warn, error,
    dump, download,
    issues(){ return issues.slice(); },
    entries(){ return buffer.slice(); },
    // 便捷：记录自定义检查点
    mark(name, extra){ info('mark', name, extra); },
  };

  if(enabled) info('debug', 'NeonDebug 已启用（?debug=1）');
})();
