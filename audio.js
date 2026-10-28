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
    // v0.4.10（E2）：场景 sting——结局/梦魇/邀约/解谜各配 2-4 秒短乐句
    stingEnding(){ [392,494,587,784].forEach((f,i)=>toneTo(musicBus,{freq:f, dur:0.8, when:i*0.22, type:'triangle', gain:0.05})); },
    stingNightmare(){ [415,392,370,349].forEach((f,i)=>tone({freq:f, dur:0.55, when:i*0.3, type:'sawtooth', gain:0.028})); },
    stingInvite(){ tone({freq:784, dur:0.14, gain:0.04}); tone({freq:1047, dur:0.22, when:0.14, gain:0.038}); },
    stingPuzzle(){ [523,659,880,1047,1319].forEach((f,i)=>tone({freq:f, dur:0.18, when:i*0.08, type:'triangle', gain:0.045})); },
    // v0.7.3：语音信箱——按键起播与播完挂断（短促电子音，和线路噪声区分开）
    vmStart(){ tone({freq:660, dur:0.06, type:'triangle', gain:0.03}); },
    vmEnd(){ tone({freq:494, dur:0.11, gain:0.028, slideTo:392}); tone({freq:988, dur:0.05, when:0.03, gain:0.014}); }
  };

  // ===== v0.7.3：语音信箱底声——合成「电话那头有人在说话」的听感 =====
  // 约束：项目不引入任何音频素材，全部 WebAudio 实时合成。
  // 做法（共振峰近似）：锯齿波声源（基频随角色不同）→ 两路带通滤波（元音共振峰 F1/F2）
  //   → 音节包络 LFO（约 3.2Hz，模拟说话的一顿一顿）+ 一路低音量线路噪声。
  // 刻意不追求听清内容——只提供「有人在讲话、语调在起伏」的听觉暗示。
  let vmNodes = null;
  // 角色基频：男主偏低沉、苏苏偏高；未收录的角色走默认值
  const VM_PITCH = { shenyan: 116, luci: 124, jiangyu: 134, susu: 196, wugang: 128, nicheng: 122 };
  function startVoicemailBed(charId){
    stopVoicemailBed();          // 同一时刻只可能有一条在播
    if(!soundOn) return false;   // 音效总开关关闭时静默（UI 仍在走进度）
    const c = ensure();
    if(!c) return false;
    const now = c.currentTime;
    const base = VM_PITCH[charId] || 124;

    // 总线：120ms 淡入，避免按键瞬间爆音
    const bus = c.createGain();
    bus.gain.setValueAtTime(0.0001, now);
    bus.gain.exponentialRampToValueAtTime(1, now + 0.12);
    bus.connect(sfxBus);

    // 声源：锯齿 + 轻微失谐三角，两个副本叠加避免过于电子
    const oscA = c.createOscillator(); oscA.type = 'sawtooth'; oscA.frequency.value = base;
    const oscB = c.createOscillator(); oscB.type = 'triangle'; oscB.frequency.value = base * 1.006;
    const src = c.createGain(); src.gain.value = 0.6;
    oscA.connect(src); oscB.connect(src);

    // 共振峰：F1≈700Hz（元音主体）+ F2≈1300Hz（亮度），并联后合流
    const f1 = c.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 700; f1.Q.value = 4.5;
    const f2 = c.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 1300; f2.Q.value = 6;
    const voice = c.createGain(); voice.gain.value = 0.4;
    src.connect(f1).connect(voice);
    src.connect(f2).connect(voice);

    // 音节起伏 3.2Hz + 呼吸弛缓 0.7Hz，叠加在共振峰通道的增益上
    const syll = c.createOscillator(); syll.type = 'sine'; syll.frequency.value = 3.2;
    const syllGain = c.createGain(); syllGain.gain.value = 0.22;
    syll.connect(syllGain).connect(voice.gain);
    const breath = c.createOscillator(); breath.type = 'sine'; breath.frequency.value = 0.7;
    const breathGain = c.createGain(); breathGain.gain.value = 0.1;
    breath.connect(breathGain).connect(voice.gain);

    // 线路噪声：极低音量低通粉噪，给合成声一点"电话空间感"
    const noise = c.createBufferSource();
    noise.buffer = noiseBuffer(c); noise.loop = true;
    const nf = c.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 1100; nf.Q.value = 0.7;
    const ng = c.createGain(); ng.gain.value = 0.014;
    noise.connect(nf).connect(ng).connect(bus);

    voice.connect(bus);
    [oscA, oscB, syll, breath].forEach(n => n.start(now));
    noise.start(now);
    vmNodes = { bus, nodes: [oscA, oscB, syll, breath, noise] };
    return true;
  }
  function stopVoicemailBed(){
    if(!vmNodes) return;
    const group = vmNodes; vmNodes = null;
    try {
      const t = ctx ? ctx.currentTime : 0;
      if(ctx){
        group.bus.gain.cancelScheduledValues(t);
        group.bus.gain.setTargetAtTime(0.0001, t, 0.05);   // 50ms 指数淡出
      }
      group.nodes.forEach(n => { try { n.stop(t + 0.3); } catch(_) {} });
    } catch(_) {}
  }

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

  // ===== v0.4.10（E2 音频二阶）：曲式引擎 =====
  // 每主题 = 4 和弦进行（triangle 垫音）+ 低音（根/五度交替）+ 琶音（半拍）+ 打击（hat/kick）
  // + 2 小节周期主旋律（五声音阶片段）。氛围分层：night 放慢、anxious 只留低音+心跳。
  const NOTE_RE = /^([A-G])(#|b)?(-?\d)$/;
  const SEMI = {C:0, D:2, E:4, F:5, G:7, A:9, B:11};
  function note(n){                       // 'A4' -> 440
    const m = NOTE_RE.exec(n); if(!m) return 440;
    let s = SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
    const oct = Number(m[3]);
    return 440 * Math.pow(2, (s - 9) / 12 + (oct - 4));
  }
  const THEME_PROG = {
    default: { chords:[['A3','C4','E4'],['F3','A3','C4'],['G3','B3','D4'],['A3','C4','E4']], bass:['A2','F2','G2','A2'], melody:['E5','C5','A4','B4','C5','B4','A4','E4'], hat:true },
    starry:  { chords:[['C4','E4','G4'],['A3','C4','E4'],['F3','A3','C4'],['G3','B3','D4']], bass:['C3','A2','F2','G2'], melody:['G4','E5','D5','C5','E5','G5','D5','C5'], hat:true },
    sea:     { chords:[['D4','F4','A4'],['B3','D4','F4'],['G3','B3','D4'],['A3','C4','E4']], bass:['D3','B2','G2','A2'], melody:['A4','D5','F5','E5','D5','A4','B4','D5'], hat:false },
    sunset:  { chords:[['C4','E4','G4'],['E4','G4','B4'],['F4','A4','C5'],['G4','B4','D5']], bass:['C3','E3','F3','G3'], melody:['E5','D5','C5','G4','A4','C5','D5','E5'], hat:false },
    ink:     { chords:[['A3','C4','E4'],['G3','B3','D4'],['F3','A3','C4'],['E3','G3','B3']], bass:['A2','G2','F2','E2'], melody:['A4','G4','E4','D4','C4','D4','E4','G4'], hat:false },
    rose:    { chords:[['D4','F4','A4'],['A3','C4','E4'],['B3','D4','F4'],['G3','B3','D4']], bass:['D3','A2','B2','G2'], melody:['F5','E5','D5','A4','B4','D5','F5','E5'], hat:true },
    dark:    { chords:[['E4','G4','B4'],['C4','E4','G4'],['A3','C4','E4'],['B3','D4','F4']], bass:['E3','C3','A2','B2'], melody:['B4','G4','E4','G4','B4','C5','B4','G4'], hat:true },
  };
  // 剧情曲（v0.4.10 E2：音乐 App 曲目真实可播）——《夏》写给妹妹的温柔曲，《渡鸦》解散前的暗色曲
  const TRACKS = {
    xia:  { bpm:0.44, chords:[['G3','B3','D4'],['E4','G4','B4'],['C4','E4','G4'],['D4','G4','B4']], bass:['G2','E3','C3','D3'],
            melody:['B4','D5','G5','D5','B4','G4','A4','B4','D5','G5','A5','G5','D5','B4','A4','G4'], lead:'sine', hat:false, shimmer:true },
    duya: { bpm:0.5, chords:[['A3','C4','E4'],['F3','A3','C4'],['D4','F4','A4'],['E4','G4','B4']], bass:['A2','F2','D3','E3'],
            melody:['A4','C5','E5','D5','C5','A4','E4','A4','F5','E5','D5','C5','B4','C5','D5','E5'], lead:'square', hat:true, kickEvery:2 },
    // v0.6.1（G2）：新曲×4——《雾》暗色徘徊 /《海》钢琴感慢板 /《灯》上行明亮 / B面收束平静
    wu:    { bpm:0.55, chords:[['A3','C4','E4'],['F3','A3','C4'],['A3','C4','E4'],['E3','G3','B3']], bass:['A2','F2','A2','E2'],
             melody:['A4','E4','C5','B4','A4','G4','A4','B4','C5','B4','A4','G4','E4','A4','B4','G4'], lead:'sine', hat:true, kickEvery:4 },
    hai:   { bpm:0.62, chords:[['C4','E4','G4'],['G3','B3','D4'],['A3','C4','E4'],['F3','A3','C4']], bass:['C3','G2','A2','F2'],
             melody:['E5','G5','C5','D5','E5','D5','C5','G4','A4','C5','D5','E5','G5','E5','D5','C5'], lead:'sine', hat:false, shimmer:true },
    deng:  { bpm:0.36, chords:[['G3','B3','D4'],['C4','E4','G4'],['G3','B3','D4'],['D4','F4','A4']], bass:['G2','C3','G2','D3'],
             melody:['D5','E5','G5','B4','D5','G4','B4','C5','D5','E5','D5','B4','G4','A4','B4','D5'], lead:'triangle', hat:false },
    bside: { bpm:0.44, chords:[['G3','B3','D4'],['E4','G4','B4'],['C4','E4','G4'],['G3','B3','D4']], bass:['G2','E3','C3','G2'],
             melody:['B4','D5','G5','D5','B4','A4','G4','A4','B4','C5','D5','B4','A4','G4','D4','G4'], lead:'sine', hat:false, shimmer:true },
  };
  let currentTrack = null;    // 正在播的剧情曲 id（null = 主题 BGM）
  let bar = 0;                // 小节计数

  // 调度一小节（4 拍）
  function scheduleBar(){
    const c = ctx; if(!c) return;
    const anxious = currentAmbId === 'anxious';
    const night = currentAmbId === 'night';
    let spec, melody, lead, hat, kickEvery = 0, baseGain = 0.016;
    if(currentTrack && TRACKS[currentTrack]){
      spec = TRACKS[currentTrack]; melody = spec.melody; lead = spec.lead; hat = spec.hat; kickEvery = spec.kickEvery || 0;
      baseGain = 0.03;   // 点播曲目音量略高
    } else {
      spec = THEME_PROG[currentTheme] || THEME_PROG.default;
      melody = spec.melody; hat = spec.hat;
    }
    let beat = (spec.bpm || 0.42);
    if(night) beat *= 1.25;
    if(anxious) beat *= 1.5;
    const chord = spec.chords[bar % spec.chords.length];
    const barAt = c.currentTime + 0.05;
    // 1) 和弦垫音：triangle 长音铺底
    chord.forEach((n, i) => toneTo(musicBus, {freq:note(n), dur:beat*4*0.95, type:'triangle', gain:baseGain*0.55, at:barAt}));
    // 2) 低音：根音/五度交替，每两拍
    for(let b = 0; b < 4; b += 2){
      const bn = spec.bass[bar % spec.bass.length];
      const f = note(bn) * (b === 2 ? 1.5 : 1);
      toneTo(musicBus, {freq:f, dur:beat*1.8, type:'sine', gain:baseGain*0.9, at:barAt + b*beat});
    }
    // 3) 琶音：每半拍和弦内音上行
    if(!anxious){
      for(let h = 0; h < 8; h++){
        const n = chord[h % chord.length];
        toneTo(musicBus, {freq:note(n)*2, dur:beat*0.5, type:'sine', gain:baseGain*0.3, at:barAt + h*beat/2});
      }
    }
    // 4) 打击：hat（短噪声脉冲）每拍；kick（低频正弦）指定拍
    for(let b = 0; b < 4; b++){
      if(hat) hatHit(barAt + b*beat, baseGain*0.35);
      if(kickEvery && (bar*4 + b) % kickEvery === 0) kick(barAt + b*beat, baseGain*1.6);
    }
    // 5) 主旋律：2 小节周期，anxious 时省略（只留低音+心跳）
    if(!anxious && melody.length){
      const ml = melody.length;
      for(let s2 = 0; s2 < 4; s2++){
        const idx = (bar*4 + s2) % ml;
        if(melody[idx]) toneTo(musicBus, {freq:note(melody[idx]), dur:beat*1.4, type:lead || 'sine', gain:baseGain*0.8, at:barAt + s2*beat});
      }
    }
    // 6) anxious 心跳（55Hz 低频脉冲，v0.2.4 保留）
    if(anxious) tone({freq:55, dur:0.5, gain:0.02});
    bar++;
    musicTimer = setTimeout(() => {
      if(!bgmOn && !currentTrack) { stopMusic(); return; }
      scheduleBar();
    }, beat*4*1000);
  }
  function hatHit(at, g){
    const c = ctx; if(!c) return;
    const src = c.createBufferSource(); src.buffer = noiseBuffer(c);
    const f = c.createBiquadFilter(); f.type='highpass'; f.frequency.value = 6000;
    const gn = c.createGain();
    gn.gain.setValueAtTime(g*0.6, at); gn.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    src.connect(f).connect(gn).connect(musicBus);
    src.start(at); src.stop(at + 0.06);
  }
  function kick(at, g){
    const c = ctx; if(!c) return;
    const o = c.createOscillator(), gn = c.createGain();
    o.frequency.setValueAtTime(120, at); o.frequency.exponentialRampToValueAtTime(45, at + 0.12);
    gn.gain.setValueAtTime(g, at); gn.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
    o.connect(gn).connect(musicBus);
    o.start(at); o.stop(at + 0.18);
  }
  // 带绝对时间与目标总线的音符（toneTo；tone 保持相对时间+sfx 总线）
  function toneTo(bus, {freq=880, dur=0.12, type='sine', gain=0.04, at=0, slideTo=0}){
    const c = ensure(); if(!c) return;
    const t0 = Math.max(at, c.currentTime);
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if(slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(bus);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  function stopMusic(){
    if(musicTimer){ clearTimeout(musicTimer); musicTimer = null; }
    step = 0; bar = 0;
    stopAmbience();
  }
  function startMusic(){
    stopMusic();
    if(!(bgmOn || currentTrack) || !unlocked) return;
    scheduleBar();
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
    // v0.7.3：语音信箱——按角色基频起播/停播合成底声。返回是否真的发声：
    // 音效关闭或未解锁时为 false，此时 UI 侧仍照常走进度条（视觉不受音频开关影响）。
    startVoicemail(charId){ return startVoicemailBed(charId); },
    stopVoicemail(){ stopVoicemailBed(); },
    // v0.4.10（E2）：音乐 App 点播——剧情曲真实可播；再次点同曲或传 null 回主题 BGM
    playTrack(trackId){
      if(trackId && TRACKS[trackId] && currentTrack === trackId) trackId = null;
      currentTrack = trackId || null;
      if(unlocked && (bgmOn || currentTrack)) startMusic();
      return currentTrack;
    },
    playingTrack(){ return currentTrack; },
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
      currentTheme = THEME_PROG[themeId] ? themeId : 'default';
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
