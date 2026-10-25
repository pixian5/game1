/* ===== 霓虹心事 · UI：初始化与测试钩子 =====
 * 本文件由 app.js 拆分而来（v0.1.7），代码逐字搬移；原 IIFE 顶层作用域改为全局脚本共享。
 */

  // ===== 初始化 =====
  function init(){
    updateTimeDisplay();
    engine.startAutoSave();
    // 有存档则恢复进度，否则新开一局
    if(engine.hasAnySave()){
      const ok = engine.continueGame();
      if(!ok) engine.newGame();
    } else {
      engine.newGame();
    }
    afterLoadRefresh();
    muteNotifs(4000);   // v0.6.3：开局/续玩 4 秒内不弹通知，先让玩家看清界面
    AudioSys.applyTheme(engine.state.currentTheme);  // v0.1.7: 启动时按当前主题配置环境音
    // 启动后再强制写一次自动存档，保证下次能继续
    engine.autoSave(true);
    updateLockContinueBtn();
    showScreen('lock');
  }
  if(typeof window !== 'undefined' && (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')){
    window.__neonTest = {engine, restorePendingUi, showEncounter, closeEncounter};
  }
  init();
