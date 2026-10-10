/* ===== 霓虹心事 · WebAudio 音效系统 =====
 * 零依赖纯合成：消息提示、来电铃声、点击、收集/成就、主题环境音（BGM）。
 * 浏览器自动播放策略：首次用户手势（pointerdown）时解锁 AudioContext。
 * 开关持久化：localStorage 'neon_sound'（音效，默认开）/ 'neon_bgm'（环境音，默认关）。
 */
const AudioSys = (() => {
  let ctx = null;
  let unlocked = false;
  let musicTimer = null;
  let step = 0;
  let currentTheme = 'default';

  const readPref = (key, fallback) => {
    try { return localStorage.getItem(key) === null ? fallback : localStorage.getItem(key) === '1'; }
    catch(_) { return fallback; }
  };
  let soundOn = readPref('neon_sound', true);
  let bgmOn = readPref('neon_bgm', false);

  function ensure(){
    if(!soundOn && !bgmOn) return null;
    if(!ctx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return null;
      try { ctx = new AC(); } catch(_) { return null; }
    }
    if(ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // 单个音符：振荡器 + 音量包络
  function tone({freq=880, dur=0.12, type='sine', gain=0.04, when=0, slideTo=0}){
    const c = ensure(); if(!c) return;
    const t0 = c.currentTime + when;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if(slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }

  const SFX = {
    msg()    { tone({freq:880, dur:0.09, gain:0.05}); tone({freq:1318, dur:0.12, when:0.07, gain:0.032}); },
    send()   { tone({freq:660, dur:0.08, gain:0.035, slideTo:880}); },
    tap()    { tone({freq:520, dur:0.045, type:'triangle', gain:0.024}); },
    ring()   { for(let i=0;i<2;i++){ tone({freq:988, dur:0.16, when:i*0.28, gain:0.055}); tone({freq:784, dur:0.16, when:i*0.28+0.13, gain:0.05}); } },
    achieve(){ [523,659,784,1047].forEach((f,i)=>tone({freq:f, dur:0.16, when:i*0.09, type:'triangle', gain:0.042})); },
    dream()  { [392,330,262].forEach((f,i)=>tone({freq:f, dur:0.5, when:i*0.28, gain:0.032})); },
  };

  // 主题环境音：每主题一组琶音（极简、音量很低）
  const BGM_THEMES = {
    default: [220.00, 277.18, 329.63, 415.30, 329.63, 277.18],
    starry:  [261.63, 392.00, 329.63, 493.88, 329.63, 392.00],
    sea:     [196.00, 246.94, 293.66, 392.00, 293.66, 246.94],
    sunset:  [233.08, 293.66, 349.23, 440.00, 349.23, 293.66],
    ink:     [174.61, 220.00, 261.63, 329.63, 261.63, 220.00],
    rose:    [246.94, 311.13, 369.99, 466.16, 369.99, 311.13],
    dark:    [146.83, 185.00, 220.00, 277.18, 220.00, 185.00],
  };
  function stopMusic(){
    if(musicTimer){ clearInterval(musicTimer); musicTimer = null; }
    step = 0;
  }
  function startMusic(){
    stopMusic();
    if(!bgmOn || !unlocked) return;
    const notes = BGM_THEMES[currentTheme] || BGM_THEMES.default;
    musicTimer = setInterval(()=>{
      if(!bgmOn) { stopMusic(); return; }
      const f = notes[step % notes.length];
      // 琶音 + 低八度垫音，营造氛围
      tone({freq:f, dur:0.9, type:'sine', gain:0.018});
      if(step % notes.length === 0) tone({freq:f/2, dur:1.6, type:'sine', gain:0.012});
      step++;
    }, 900);
  }

  // 首次手势解锁（浏览器自动播放策略）
  if(typeof document !== 'undefined' && document.addEventListener){
    document.addEventListener('pointerdown', () => {
      if(unlocked) return;
      unlocked = true;
      if(bgmOn) startMusic();
    }, { once:true, capture:true });
  }

  return {
    play(name){ if(soundOn && unlocked && SFX[name]) SFX[name](); },
    isEnabled(){ return soundOn; },
    isBgmEnabled(){ return bgmOn; },
    setSound(on){
      soundOn = !!on;
      try { localStorage.setItem('neon_sound', soundOn ? '1' : '0'); } catch(_) {}
      if(!soundOn && !bgmOn) stopMusic();
    },
    setBgm(on){
      bgmOn = !!on;
      try { localStorage.setItem('neon_bgm', bgmOn ? '1' : '0'); } catch(_) {}
      if(bgmOn){ unlocked = true; startMusic(); } else stopMusic();
    },
    // 主题切换时切换环境音音组
    applyTheme(themeId){
      currentTheme = BGM_THEMES[themeId] ? themeId : 'default';
      if(musicTimer) startMusic();  // 正在播则切换音组
    },
  };
})();
if(typeof window !== 'undefined') window.AudioSys = AudioSys;
