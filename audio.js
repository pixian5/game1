/* ===== 霓虹心事 · WebAudio 音效系统 =====
 * 零依赖纯合成：消息提示、来电铃声、点击、收集/成就、分层环境音（BGM）。
 * v0.2.4: 环境音分层——主题琶音层 + 时段底噪层（雨声/夜晚底噪）+ 心绪不安的心跳脉冲。
 * 浏览器自动播放策略：首次用户手势（pointerdown）时解锁 AudioContext。
 * 开关持久化：localStorage 'neon_sound'（音效，默认开）/ 'neon_bgm'（环境音，默认关）。
 */
const AudioSys = (() => {
  let ctx = null;
  let unlocked = false;
  let musicTimer = null;
  let step = 0;
  let currentTheme = 'default';
  let currentAmbId = 'day';   // 当前氛围 id（day/dusk/night/rainy/anxious/lucky/unlucky/dawn）
  let ambience = null;        // 当前底噪档：'rain' | 'night' | null
  let ambNodes = null;        // 底噪节点组 {src, gain, lfo}
  let _noiseBuf = null;       // 复用噪声 buffer（粉噪倾向，比白噪柔和）

  const readPref = (key, fallback) => {
    try { return localStorage.getItem(key) === null ? fallback : localStorage.getItem(key) === '1'; }
    catch(_) { return fallback; }
  };
  let soundOn = readPref('neon_sound', true);
  let bgmOn = readPref('neon_bgm', false);

  // ===== v0.4.8: 音量总线（master/music/sfx 三级，设置中心滑杆驱动） =====
  let masterGain = null, musicBus = null, sfxBus = null;
  let vol = { master: 1, music: 0.8, sfx: 1 };
  try {
    const saved = JSON.parse(localStorage.getItem('neon_vol') || 'null');
    if(saved && ['master','music','sfx'].every(k => typeof saved[k] === 'number')) vol = saved;
  } catch(_) {}
  function ensureBus(c){
    if(masterGain) return;
    masterGain = c.createGain(); masterGain.connect(c.destination);
    musicBus = c.createGain(); musicBus.connect(masterGain);
    sfxBus = c.createGain(); sfxBus.connect(masterGain);
    applyVol();
  }
  function applyVol(){
    if(!masterGain) return;
    masterGain.gain.value = vol.master;
    musicBus.gain.value = vol.music;
    sfxBus.gain.value = vol.sfx;
  }

  function ensure(){
    if(!soundOn && !bgmOn) return null;
    if(!ctx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return null;
      try { ctx = new AC(); } catch(_) { return null; }
    }
    if(ctx.state === 'suspended') ctx.resume();
    ensureBus(ctx);
    return ctx;
  }

  // 单个音符：振荡器 + 音量包络（挂 sfx 总线）
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
    osc.connect(g).connect(sfxBus);
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

  // ===== v0.2.4: 底噪层（本地合成，无外部素材） =====

  // 一阶低通噪声 buffer：白噪 + 单极低通，比纯白噪更"像空气"，作为雨声/夜晚底噪的原料
  function noiseBuffer(c){
    if(_noiseBuf) return _noiseBuf;
    const len = Math.floor(c.sampleRate * 2);
    _noiseBuf = c.createBuffer(1, len, c.sampleRate);
    const d = _noiseBuf.getChannelData(0);
    let last = 0;
    for(let i=0;i<len;i++){
      const white = Math.random() * 2 - 1;
      last = (last + 0.08 * white) / 1.08;
      d[i] = last * 3.2;
    }
    return _noiseBuf;
  }

  // 启动底噪层：rain=雨声（中频滤波 + 慢起伏 LFO）；night=夜晚底噪（低频滤波，极低音量）
  function startAmbience(kind){
    stopAmbience();
    if(!kind) return;
    const c = ensure(); if(!c) return;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c);
    src.loop = true;
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    const base = kind === 'rain' ? 0.014 : 0.005;
    filter.type = 'lowpass';
    filter.frequency.value = kind === 'rain' ? 1400 : 320;
    filter.Q.value = 0.8;
    gain.gain.setValueAtTime(base, c.currentTime);
    src.connect(filter).connect(gain).connect(musicBus);
    src.start();
    let lfo = null;
    if(kind === 'rain'){
      // 雨声起伏：0.13Hz 正弦调制音量 ±40%
      lfo = c.createOscillator();
      const lfoGain = c.createGain();
      lfo.frequency.value = 0.13;
      lfoGain.gain.value = base * 0.4;
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();
    }
    ambNodes = {src, gain, lfo};
    ambience = kind;
  }

  function stopAmbience(){
    if(!ambNodes) return;
    try {
      if(ambNodes.lfo) ambNodes.lfo.stop();
      ambNodes.src.stop();
      ambNodes.gain.disconnect();
    } catch(_) {}
    ambNodes = null;
    ambience = null;
  }

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
    if(musicTimer){ clearTimeout(musicTimer); musicTimer = null; }
    step = 0;
    stopAmbience();
  }
  // setTimeout 链：可随时调整节奏（心绪不安时放慢并加入心跳脉冲）
  function musicLoop(){
    const slow = currentAmbId === 'anxious';  // 不安时放慢到 1.5s/拍
    musicTimer = setTimeout(()=>{
      if(!bgmOn) { stopMusic(); return; }
      const notes = BGM_THEMES[currentTheme] || BGM_THEMES.default;
      const anxious = currentAmbId === 'anxious';
      const dur = anxious ? 0.7 : 0.9;
      const f = notes[step % notes.length];
      // 琶音 + 低八度垫音，营造氛围
      tone({freq:f, dur:dur, type:'sine', gain:0.018});
      if(step % notes.length === 0) tone({freq:f/2, dur:anxious ? 2.2 : 1.6, type:'sine', gain:0.012});
      // v0.2.4: 心绪不安时每两拍一个低频心跳脉冲（55Hz，几乎不可闻但压心）
      if(anxious && step % 2 === 0) tone({freq:55, dur:0.5, type:'sine', gain:0.02});
      step++;
      musicLoop();
    }, slow ? 1500 : 900);
  }
  function startMusic(){
    stopMusic();
    if(!bgmOn || !unlocked) return;
    musicLoop();
    startAmbience(ambience);
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
    // v0.4.8: 音量三分级（master/music/sfx，0-1），设置中心滑杆驱动
    setVolume(kind, v){
      if(!(kind in vol)) return;
      vol[kind] = Math.max(0, Math.min(1, Number(v) || 0));
      try { localStorage.setItem('neon_vol', JSON.stringify(vol)); } catch(_) {}
      applyVol();
    },
    getVolumes(){ return { ...vol }; },
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
    // v0.2.4: 氛围切换时切换底噪档（rainy→雨声；night/dusk/anxious→夜晚底噪；其余无底噪）
    applyAmbience(ambId){
      currentAmbId = ambId || 'day';
      const kind = ambId === 'rainy' ? 'rain'
        : (ambId === 'night' || ambId === 'dusk' || ambId === 'anxious') ? 'night' : null;
      if(kind !== ambience){
        // 正在播放环境音则切换底噪；未播放只记档，开 BGM 时生效
        if(bgmOn && unlocked) startAmbience(kind);
        else ambience = kind;
      }
    },
  };
})();
if(typeof window !== 'undefined') window.AudioSys = AudioSys;
