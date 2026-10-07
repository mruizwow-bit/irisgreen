/* Iris Green · El taller · Estudio de música (R43).
   Línea de tiempo con pistas y clips, rodillo de piano, secuenciador de percusión,
   mezclador e instrumentos editables. Sonido con Tone.js; el cabezal sigue al reloj de audio.
   Exporta WAV (renderizado sin conexión) y MIDI. Nada suena hasta que la persona lo pide. */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;
  var LANG = IG.lang;
  var PPQ = 192;

  var DRUMS = [
    { p: 49, es: 'Platillo', en: 'Crash' }, { p: 46, es: 'Charles abierto', en: 'Open hi-hat' }, { p: 42, es: 'Charles cerrado', en: 'Closed hi-hat' },
    { p: 39, es: 'Palmada', en: 'Clap' }, { p: 50, es: 'Tom agudo', en: 'High tom' }, { p: 45, es: 'Tom grave', en: 'Low tom' },
    { p: 38, es: 'Caja', en: 'Snare' }, { p: 36, es: 'Bombo', en: 'Kick' }
  ];
  var NOTE_ES = ['do', 'do♯', 're', 're♯', 'mi', 'fa', 'fa♯', 'sol', 'sol♯', 'la', 'la♯', 'si'];
  var NOTE_EN = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  function noteName(p) { return (LANG === 'en' ? NOTE_EN : NOTE_ES)[p % 12] + (Math.floor(p / 12) - 1); }
  var PRESETS = {
    piano: { voice: 'fm', osc: 'sine', harm: 3, mod: 6, env: { a: 0.005, d: 0.9, s: 0.15, r: 1.1 }, cutoff: 6000, q: 0.5, reverb: 0.2, delay: 0, gm: 4 },
    bass: { voice: 'basic', osc: 'sawtooth', env: { a: 0.005, d: 0.25, s: 0.55, r: 0.2 }, cutoff: 700, q: 3, reverb: 0, delay: 0, gm: 38 },
    pad: { voice: 'am', osc: 'triangle', harm: 1.5, env: { a: 0.7, d: 0.6, s: 0.8, r: 2.5 }, cutoff: 2200, q: 0.7, reverb: 0.5, delay: 0, gm: 89 },
    lead: { voice: 'basic', osc: 'sawtooth', env: { a: 0.01, d: 0.2, s: 0.55, r: 0.35 }, cutoff: 2800, q: 5, reverb: 0.15, delay: 0.25, gm: 81 },
    bell: { voice: 'fm', osc: 'sine', harm: 5.07, mod: 11, env: { a: 0.001, d: 1.6, s: 0, r: 1.6 }, cutoff: 9000, q: 0.5, reverb: 0.35, delay: 0.1, gm: 14 },
    strings: { voice: 'basic', osc: 'sawtooth', env: { a: 0.35, d: 0.3, s: 0.85, r: 1.1 }, cutoff: 1700, q: 0.8, reverb: 0.4, delay: 0, gm: 48 },
    noise: { voice: 'noise', osc: 'pink', env: { a: 0.8, d: 0.5, s: 0.7, r: 2.5 }, cutoff: 1200, q: 2, reverb: 0.5, delay: 0, gm: 122 }
  };
  var TRACK_COLORS = ['#1f5f8b', '#a8336f', '#2e7d32', '#d86b00', '#5a49a8', '#197991', '#8a4b00', '#7d8b99'];

  IG.defineEngine('musica', {
    libs: ['pixi', 'tone'], version: 1, fileBase: LANG === 'en' ? 'music' : 'musica',
    extraKeys: ['kPlay', 'kEditor', 'kTyping'],
    initialStart: function (para) {
      var mode = (document.getElementById('igt-app') || { dataset: {} }).dataset.igsMode || 'compose';
      var map = { rhythm: { child: 'beat-first', teen: 'beat-dembow', adult: 'beat-poly', any: 'beat-rock' }, compose: { child: 'song-bells', teen: 'song-pop', adult: 'song-ambient', any: 'song-pop' }, synth: { child: 'synth-bells', teen: 'synth-bass', adult: 'synth-pad', any: 'synth-pad' } };
      return (map[mode] || map.compose)[para] || (map[mode] || map.compose).any;
    },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'beat-first', title: t('stBeatFirst'), desc: t('stBeatFirstD'), para: 'child' },
        { id: 'beat-rock', title: t('stBeatRock'), desc: t('stBeatRockD'), para: 'any' },
        { id: 'beat-dembow', title: t('stBeatDembow'), desc: t('stBeatDembowD'), para: 'teen' },
        { id: 'beat-poly', title: t('stBeatPoly'), desc: t('stBeatPolyD'), para: 'adult' },
        { id: 'song-bells', title: t('stSongBells'), desc: t('stSongBellsD'), para: 'child' },
        { id: 'song-pop', title: t('stSongPop'), desc: t('stSongPopD'), para: 'teen' },
        { id: 'song-ambient', title: t('stSongAmbient'), desc: t('stSongAmbientD'), para: 'adult' },
        { id: 'synth-bells', title: t('stSynthBells'), desc: t('stSynthBellsD'), para: 'child' },
        { id: 'synth-bass', title: t('stSynthBass'), desc: t('stSynthBassD'), para: 'teen' },
        { id: 'synth-pad', title: t('stSynthPad'), desc: t('stSynthPadD'), para: 'adult' },
        { id: 'synth-wind', title: t('stSynthWind'), desc: t('stSynthWindD'), para: 'any' }
      ];
    },
    create: function (ctx) { return createStudio(ctx); }
  });

  /* ---------- Ejemplos ---------- */
  function drumClip(bars, pattern) {
    /* pattern: {pitch: 'x...x...'} con 16 pasos por compás */
    var notes = [];
    Object.keys(pattern).forEach(function (p) {
      var s = pattern[p].replace(/\s/g, '');
      for (var i = 0; i < s.length; i++) if (s[i] !== '.') notes.push({ t: i / 4, d: 0.25, p: +p, v: s[i] === 'X' ? 1 : s[i] === 'o' ? 0.45 : 0.8 });
    });
    return { start: 0, len: bars * 4, notes: notes };
  }
  function melody(list, start) {
    /* list: [[pitch, beats], ...] (pitch null = silencio) */
    var t = 0, notes = [];
    list.forEach(function (n) { if (n[0] !== null) notes.push({ t: t, d: n[1] * 0.95, p: n[0], v: 0.8 }); t += n[1]; });
    return { start: start || 0, len: Math.ceil(t / 4) * 4, notes: notes };
  }
  function chords(list, beats) {
    var notes = [];
    list.forEach(function (ch, i) { ch.forEach(function (p) { notes.push({ t: i * beats, d: beats * 0.98, p: p, v: 0.6 }); }); });
    return { start: 0, len: list.length * beats, notes: notes };
  }
  function example(id, t) {
    var tr = function (name, kind, preset, clips, extra) { return Object.assign({ name: name, kind: kind, preset: preset, clips: clips, vol: -8, pan: 0, mute: false, solo: false }, extra || {}); };
    switch (id) {
      case 'beat-first': return { bpm: 90, bars: 2, tracks: [tr(t('trDrums'), 'drums', null, [drumClip(1, { 36: 'x...x...x...x...', 39: '....x.......x...', 42: 'x.x.x.x.x.x.x.x.' })])] };
      case 'beat-dembow': return { bpm: 96, bars: 2, tracks: [tr(t('trDrums'), 'drums', null, [drumClip(1, { 36: 'x...x...x...x...', 38: '...x..x....x..x.', 42: 'x.x.x.x.x.x.x.x.' })]), tr(t('trBass'), 'synth', 'bass', [melody([[36, 0.75], [null, 0.25], [36, 0.5], [39, 0.5], [41, 1], [38, 1]])])] };
      case 'beat-poly': return { bpm: 110, bars: 2, tracks: [tr(t('trDrums'), 'drums', null, [drumClip(1, { 36: 'x.....x.....x...', 45: 'x....x....x....x', 42: 'x..x..x..x..x..x', 50: '..x...x...x...x.', 38: '....x.......x...' })])] };
      case 'song-bells': return { bpm: 100, bars: 4, tracks: [
        tr(t('trMelody'), 'synth', 'bell', [melody([[72, 1], [74, 1], [76, 1], [72, 1], [72, 1], [74, 1], [76, 1], [72, 1], [76, 1], [77, 1], [79, 2], [76, 1], [77, 1], [79, 2]])]),
        tr(t('trDrums'), 'drums', null, [drumClip(4, { 36: 'x.......x.......x.......x.......x.......x.......x.......x.......', 42: '....x.......x.......x.......x.......x.......x.......x.......x...' })])] };
      case 'song-ambient': return { bpm: 72, bars: 8, tracks: [
        tr(t('trPad'), 'synth', 'pad', [chords([[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 67]], 8)], { vol: -12 }),
        tr(t('trBells'), 'synth', 'bell', [melody([[76, 1.5], [79, 0.5], [81, 2], [null, 4], [72, 1.5], [74, 0.5], [76, 2], [null, 4], [79, 1.5], [76, 0.5], [74, 2], [null, 4], [71, 3], [null, 5]])], { vol: -14, pan: 0.3 })] };
      case 'synth-bells': return { bpm: 96, bars: 2, tracks: [tr(t('trBells'), 'synth', 'bell', [melody([[72, 0.5], [74, 0.5], [76, 0.5], [79, 0.5], [81, 1], [79, 0.5], [76, 0.5], [74, 1], [72, 1], [null, 2]])])], focus: 'synth' };
      case 'synth-bass': return { bpm: 118, bars: 2, tracks: [tr(t('trBass'), 'synth', 'bass', [melody([[33, 0.5], [33, 0.25], [45, 0.25], [33, 0.5], [36, 0.5], [38, 0.5], [40, 0.5], [43, 0.5], [38, 0.5]])]), tr(t('trDrums'), 'drums', null, [drumClip(1, { 36: 'x...x...x...x...', 38: '....x.......x...', 42: '..x...x...x...x.' })])], focus: 'synth' };
      case 'synth-wind': return { bpm: 60, bars: 8, tracks: [tr(t('trWind'), 'synth', 'noise', [{ start: 0, len: 32, notes: [{ t: 0, d: 8, p: 55, v: 0.7 }, { t: 8, d: 8, p: 62, v: 0.8 }, { t: 16, d: 8, p: 50, v: 0.6 }, { t: 24, d: 8, p: 67, v: 0.8 }] }], { vol: -10 }), tr(t('trPad'), 'synth', 'pad', [chords([[50, 57, 62], [48, 55, 60]], 16)], { vol: -16 })], focus: 'synth' };
      case 'synth-pad': return { bpm: 80, bars: 4, tracks: [tr(t('trPad'), 'synth', 'pad', [chords([[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]], 4)]), tr(t('trBass'), 'synth', 'bass', [melody([[45, 4], [41, 4], [43, 4], [40, 4]])], { vol: -10 })], focus: 'synth' };
      case 'song-pop': return { bpm: 104, bars: 4, tracks: [
        tr(t('trChords'), 'synth', 'piano', [chords([[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], 4)], { vol: -12 }),
        tr(t('trBass'), 'synth', 'bass', [melody([[36, 2], [36, 1], [43, 1], [31, 2], [31, 1], [38, 1], [33, 2], [33, 1], [40, 1], [29, 2], [29, 1], [36, 1]])]),
        tr(t('trMelody'), 'synth', 'lead', [melody([[72, 1], [72, 0.5], [74, 0.5], [76, 2], [74, 1], [71, 1], [67, 2], [69, 1], [72, 1], [76, 2], [77, 1], [76, 0.5], [74, 0.5], [72, 2]])], { vol: -14 }),
        tr(t('trDrums'), 'drums', null, [drumClip(4, { 36: 'x.......x.x.....x.......x.x.....x.......x.x.....x.......x.x.....', 38: '....x.......x.......x.......x.......x.......x.......x.......x...', 42: 'x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.' })])] };
      default: return { bpm: 100, bars: 2, tracks: [tr(t('trDrums'), 'drums', null, [drumClip(1, { 36: 'x...x...x...x...', 38: '....x.......x...', 42: 'x.x.x.x.x.x.x.x.', 46: '..............x.' })]), tr(t('trBass'), 'synth', 'bass', [melody([[40, 1], [40, 0.5], [43, 0.5], [45, 1], [43, 1]])])] };
    }
  }

  function createStudio(ctx) {
    var t = ctx.t, h = ctx.h, PIXI = root.PIXI, Tone = root.Tone;
    var MODE = ctx.app.dataset.igsMode || 'compose';
    var S = null, seq = 0, selTrack = null, selClip = null, selNotes = [], playing = false, audioReady = false;
    var app = new PIXI.Application();
    return app.init({ antialias: true, background: '#fbfcfe', autoStart: false, resolution: Math.min(2, root.devicePixelRatio || 1), autoDensity: true, preference: 'webgl',
      width: Math.max(300, ctx.viewport.clientWidth), height: Math.max(240, ctx.viewport.clientHeight) }).then(function () {
      ctx.setTech('renderer', 'PixiJS ' + PIXI.VERSION + ' · ' + (app.renderer.name === 'webgpu' ? 'WebGPU' : 'WebGL'));
      ctx.setTech('audio', 'Tone.js ' + Tone.version + ' · Web Audio · ' + t('audioWaiting'));
      app.canvas.setAttribute('aria-hidden', 'true');
      ctx.viewport.appendChild(app.canvas);
      ctx.viewport.classList.add('igs-music');
      return build();
    });

    function build() {
      /* ======================= Audio ======================= */
      var master = null, reverb = null, delay = null, revBus = null, delBus = null, meterNode = null, level = { peak: [0, 0], rms: [0, 0] };
      var voices = {};   /* id de pista → {inst, channel, kind} */
      var metro = null, metroOn = false, metroId = null;
      var transport = Tone.getTransport();
      transport.PPQ = PPQ;
      function ensureAudio() {
        if (audioReady) return Promise.resolve();
        /* Contexto de audio nativo: así el AudioWorklet se carga desde el propio sitio
           (el envoltorio de Tone lo cargaría desde blob:, que la política de seguridad bloquea). */
        try {
          var Native = root.AudioContext || root.webkitAudioContext;
          if (Native) { Tone.setContext(new Native({ latencyHint: 'interactive' })); transport = Tone.getTransport(); transport.PPQ = PPQ; }
        } catch (_) {}
        return Tone.start().then(function () {
          master = new Tone.Gain(0.9).toDestination();
          reverb = new Tone.Reverb({ decay: 2.8, preDelay: 0.02, wet: 1 });
          delay = new Tone.FeedbackDelay({ delayTime: '8n.', feedback: 0.35, wet: 1 });
          revBus = new Tone.Channel({ volume: -4 }).receive('reverb'); revBus.chain(reverb, master);
          delBus = new Tone.Channel({ volume: -8 }).receive('delay'); delBus.chain(delay, master);
          metro = new Tone.MembraneSynth({ pitchDecay: 0.008, octaves: 2, envelope: { attack: 0.001, decay: 0.08, sustain: 0 }, volume: -14 }).connect(master);
          audioReady = true;
          var raw = Tone.getContext().rawContext;
          var label = 'Tone.js ' + Tone.version + ' · Web Audio ' + Math.round(raw.sampleRate / 100) / 10 + ' kHz';
          ctx.setTech('audio', label);
          /* Medidor en AudioWorklet servido desde el propio sitio (no desde blob:) */
          if (raw.audioWorklet && root.AudioWorkletNode) {
            raw.audioWorklet.addModule('/assets/ig-suite-meter-worklet.js?v=r43-1').then(function () {
              meterNode = new root.AudioWorkletNode(raw, 'igs-meter', { numberOfInputs: 1, numberOfOutputs: 0, channelCount: 2, channelCountMode: 'explicit' });
              meterNode.port.onmessage = function (e) { level = e.data; };
              master.connect(meterNode);
              ctx.setTech('audio', label + ' · AudioWorklet (' + t('meterWord') + ')');
            }).catch(function () { ctx.setTech('audio', label + ' · ' + t('noWorklet')); });
          }
          rebuildVoices();
        });
      }
      function makeInstrument(tr) {
        if (tr.kind === 'drums') return makeDrums();
        var P = tr.inst || PRESETS[tr.preset] || PRESETS.piano, inst;
        var filter = new Tone.Filter({ type: 'lowpass', frequency: P.cutoff, Q: P.q });
        if (P.voice === 'noise') {
          var ns = new Tone.NoiseSynth({ noise: { type: P.osc === 'white' || P.osc === 'brown' ? P.osc : 'pink' }, envelope: { attack: P.env.a, decay: P.env.d, sustain: P.env.s, release: P.env.r } });
          ns.connect(filter);
          return { filter: filter, output: filter, play: function (p, dur, time, vel) { filter.frequency.setValueAtTime(Math.max(80, Math.min(12000, P.cutoff * Math.pow(2, (p - 60) / 12))), time); ns.triggerAttackRelease(dur, time, vel); }, set: function (Q) { ns.set({ envelope: { attack: Q.env.a, decay: Q.env.d, sustain: Q.env.s, release: Q.env.r } }); filter.frequency.value = Q.cutoff; filter.Q.value = Q.q; P = Q; }, dispose: function () { ns.dispose(); filter.dispose(); } };
        }
        var Voice = P.voice === 'fm' ? Tone.FMSynth : P.voice === 'am' ? Tone.AMSynth : Tone.Synth;
        var opts = { oscillator: { type: P.osc }, envelope: { attack: P.env.a, decay: P.env.d, sustain: P.env.s, release: P.env.r } };
        if (P.voice === 'fm') { opts.harmonicity = P.harm || 3; opts.modulationIndex = P.mod || 6; }
        if (P.voice === 'am') { opts.harmonicity = P.harm || 1.5; }
        inst = new Tone.PolySynth(Voice, opts); inst.maxPolyphony = 24;
        inst.connect(filter);
        return { filter: filter, output: filter,
          play: function (p, dur, time, vel) { inst.triggerAttackRelease(Tone.Frequency(p, 'midi').toFrequency(), dur, time, vel); },
          set: function (Q) { var o = { oscillator: { type: Q.osc }, envelope: { attack: Q.env.a, decay: Q.env.d, sustain: Q.env.s, release: Q.env.r } }; if (Q.voice === 'fm') { o.harmonicity = Q.harm; o.modulationIndex = Q.mod; } if (Q.voice === 'am') o.harmonicity = Q.harm; inst.set(o); filter.frequency.value = Q.cutoff; filter.Q.value = Q.q; P = Q; },
          dispose: function () { inst.dispose(); filter.dispose(); } };
      }
      function makeDrums() {
        var out = new Tone.Gain(1);
        var kick = new Tone.MembraneSynth({ pitchDecay: 0.045, octaves: 6, envelope: { attack: 0.001, decay: 0.42, sustain: 0, release: 0.1 } }).connect(out);
        var tomL = new Tone.MembraneSynth({ pitchDecay: 0.03, octaves: 3, envelope: { attack: 0.001, decay: 0.35, sustain: 0 } }).connect(out);
        var snareF = new Tone.Filter({ type: 'bandpass', frequency: 2200, Q: 0.8 }).connect(out);
        var snare = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.18, sustain: 0 } }).connect(snareF);
        var snareBody = new Tone.MembraneSynth({ pitchDecay: 0.01, octaves: 2, envelope: { attack: 0.001, decay: 0.12, sustain: 0 }, volume: -8 }).connect(out);
        var clapF = new Tone.Filter({ type: 'bandpass', frequency: 1300, Q: 1.2 }).connect(out);
        var clap = new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.002, decay: 0.14, sustain: 0 } }).connect(clapF);
        var hatF = new Tone.Filter({ type: 'highpass', frequency: 7000, Q: 0.5 }).connect(out);
        var hat = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0 }, volume: -10 }).connect(hatF);
        var ohat = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.32, sustain: 0 }, volume: -12 }).connect(hatF);
        var crashF = new Tone.Filter({ type: 'highpass', frequency: 4000, Q: 0.3 }).connect(out);
        var crash = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.002, decay: 1.4, sustain: 0 }, volume: -14 }).connect(crashF);
        var parts = [kick, tomL, snare, snareBody, clap, hat, ohat, crash, snareF, clapF, hatF, crashF, out];
        return { output: out, drums: true,
          play: function (p, dur, time, vel) {
            switch (p) {
              case 36: kick.triggerAttackRelease('C1', '8n', time, vel); break;
              case 38: snare.triggerAttackRelease('16n', time, vel); snareBody.triggerAttackRelease('G2', '16n', time, vel * 0.8); break;
              case 39: clap.triggerAttackRelease('16n', time, vel); break;
              case 42: hat.triggerAttackRelease('32n', time, vel); break;
              case 46: ohat.triggerAttackRelease('8n', time, vel); break;
              case 45: tomL.triggerAttackRelease('G2', '8n', time, vel); break;
              case 50: tomL.triggerAttackRelease('D3', '8n', time, vel); break;
              case 49: crash.triggerAttackRelease('2n', time, vel); break;
            }
          },
          set: function () {}, dispose: function () { parts.forEach(function (x) { x.dispose(); }); } };
      }
      function dbFromAmount(a) { return a <= 0.001 ? -Infinity : 20 * Math.log10(a); }
      function rebuildVoices() {
        if (!audioReady) return;
        Object.keys(voices).forEach(function (id) { voices[id].inst.dispose(); voices[id].channel.dispose(); });
        voices = {};
        S.tracks.forEach(function (tr) {
          var inst = makeInstrument(tr), ch = new Tone.Channel({ volume: tr.vol, pan: tr.pan }).connect(master);
          inst.output.connect(ch);
          var P = tr.kind === 'drums' ? { reverb: 0.08, delay: 0 } : (tr.inst || PRESETS[tr.preset] || PRESETS.piano);
          ch.send('reverb', dbFromAmount(P.reverb || 0)); ch.send('delay', dbFromAmount(P.delay || 0));
          voices[tr.id] = { inst: inst, channel: ch };
        });
        applyMix();
      }
      function applyMix() {
        if (!audioReady) return;
        var anySolo = S.tracks.some(function (x) { return x.solo; });
        S.tracks.forEach(function (tr) {
          var v = voices[tr.id]; if (!v) return;
          v.channel.volume.value = tr.vol; v.channel.pan.value = tr.pan;
          v.channel.mute = tr.mute || (anySolo && !tr.solo);
        });
      }
      /* Programación de notas en el transporte (en tics: sigue al reloj de audio aunque cambie el tempo) */
      var scheduled = [];
      function schedule() {
        scheduled.forEach(function (id) { transport.clear(id); }); scheduled = [];
        S.tracks.forEach(function (tr) {
          tr.clips.forEach(function (cl) {
            cl.notes.forEach(function (n) {
              if (n.t >= cl.len) return;
              var beat = cl.start + n.t, dur = Math.min(n.d, cl.len - n.t);
              var id = transport.schedule(function (time) {
                var v = voices[tr.id]; if (!v) return;
                v.inst.play(n.p, Tone.Ticks(Math.max(1, Math.round(dur * PPQ))).toSeconds(), time, n.v);
              }, Math.round(beat * PPQ) + 'i');
              scheduled.push(id);
            });
          });
        });
        if (metroId !== null) { transport.clear(metroId); metroId = null; }
        if (metroOn) metroId = transport.scheduleRepeat(function (time) {
          var pos = transport.getTicksAtTime(time) / PPQ; metro.triggerAttackRelease(Math.round(pos) % 4 === 0 ? 'C5' : 'G4', '32n', time, 0.7);
        }, '4n', 0);
      }
      function setLoop() { transport.loop = true; transport.loopStart = Math.round(S.loop[0] * PPQ) + 'i'; transport.loopEnd = Math.round(S.loop[1] * PPQ) + 'i'; transport.bpm.value = S.bpm; }
      function play() {
        ensureAudio().then(function () {
          if (playing) { stopPlay(); return; }
          setLoop(); schedule();
          if (transport.ticks < S.loop[0] * PPQ || transport.ticks >= S.loop[1] * PPQ) transport.ticks = Math.round(S.loop[0] * PPQ);
          transport.start('+0.05'); playing = true; setPlayUI(); ctx.announce(t('playing'));
          tick();
        });
      }
      function stopPlay() {
        transport.stop(); transport.ticks = Math.round(S.loop[0] * PPQ); playing = false; setPlayUI(); ctx.announce(t('stoppedAudio')); requestRender();
      }
      function playNow(tr, p, dur) { ensureAudio().then(function () { var v = voices[tr.id]; if (v) v.inst.play(p, dur || 0.3, Tone.now() + 0.01, 0.8); }); }

      /* ======================= Estado y utilidades ======================= */
      function newId(p) { seq += 1; return p + seq; }
      function trackById(id) { for (var i = 0; i < S.tracks.length; i++) if (S.tracks[i].id === id) return S.tracks[i]; return null; }
      function clipById(id) { for (var i = 0; i < S.tracks.length; i++) for (var j = 0; j < S.tracks[i].clips.length; j++) if (S.tracks[i].clips[j].id === id) return { tr: S.tracks[i], cl: S.tracks[i].clips[j] }; return null; }
      function curTrack() { return trackById(selTrack); }
      function curClip() { var c = clipById(selClip); return c ? c.cl : null; }
      var fittedClip = null;
      function fitEditor() {
        var cl = curClip(); if (!cl) return;
        var w = size().w - edLeft() - 16;
        view.edPx = Math.max(16, Math.min(320, w / Math.max(1, cl.len))); view.edX = 0; fittedClip = cl.id;
        var tr = curTrack();
        if (tr && tr.kind !== 'drums' && cl.notes.length) { var hi = Math.max.apply(null, cl.notes.map(function (n) { return n.p; })); view.rollTop = Math.min(108, hi + 4); }
      }
      function instOf(tr) { if (!tr.inst && tr.kind !== 'drums') tr.inst = JSON.parse(JSON.stringify(PRESETS[tr.preset] || PRESETS.piano)); return tr.inst; }
      function fromExample(id) {
        var ex = example(id, t);
        seq = 0;
        S = { v: 1, bpm: ex.bpm, bars: ex.bars, loop: [0, ex.bars * 4], grid: 0.25, tracks: ex.tracks.map(function (tr, i) {
          var o = { id: newId('t'), name: tr.name, kind: tr.kind, preset: tr.preset, color: TRACK_COLORS[i % TRACK_COLORS.length], vol: tr.vol, pan: tr.pan || 0, mute: false, solo: false,
            clips: tr.clips.map(function (c) { return { id: newId('c'), start: c.start, len: c.len, notes: c.notes.map(function (n) { return { t: n.t, d: n.d, p: n.p, v: n.v }; }) }; }) };
          if (o.kind !== 'drums') instOf(o);
          return o;
        }) };
        /* repetir los clips cortos hasta llenar la canción */
        S.tracks.forEach(function (tr) {
          var c0 = tr.clips[0]; if (!c0) return;
          var end = S.bars * 4, pos = c0.start + c0.len;
          while (pos + c0.len <= end) { tr.clips.push({ id: newId('c'), start: pos, len: c0.len, notes: JSON.parse(JSON.stringify(c0.notes)) }); pos += c0.len; }
        });
        var focusTrack = S.tracks[0];
        if (MODE === 'rhythm') focusTrack = S.tracks.filter(function (x) { return x.kind === 'drums'; })[0] || focusTrack;
        selTrack = focusTrack.id; selClip = focusTrack.clips[0] ? focusTrack.clips[0].id : null; selNotes = [];
        if (playing) stopPlay();
        transport.ticks = 0; view.x = 0;
        rebuildVoices(); renderSide(); requestRender();
      }

      /* ======================= Vista (lienzo) ======================= */
      var view = { x: 0, pxBeat: 40, rollTop: 60, rowH: 14, split: 0.42 };
      var L = { head: 128, ruler: 26, trackH: 40, keys: 56, drumLabel: 132 };
      var gfx = new PIXI.Graphics(), txt = new PIXI.Container();
      app.stage.addChild(gfx); app.stage.addChild(txt);
      var pool = [], used = 0;
      function label(s, x, y, o) {
        o = o || {}; var lb = pool[used];
        if (!lb) { lb = new PIXI.Text({ text: '', style: { fontFamily: 'Atkinson Hyperlegible, Arial, sans-serif', fontSize: 12, fill: '#172b42' } }); pool.push(lb); txt.addChild(lb); }
        used += 1; lb.visible = true; lb.text = s; lb.style.fill = o.color || '#172b42'; lb.style.fontSize = o.size || 12; lb.style.fontWeight = o.bold ? '700' : '400';
        lb.anchor.set(o.ax || 0, o.ay === undefined ? 0.5 : o.ay); lb.x = Math.round(x); lb.y = Math.round(y); return lb;
      }
      var frame = 0;
      function requestRender() { if (!frame) frame = root.requestAnimationFrame(function () { frame = 0; render(); }); }
      function size() { return { w: app.renderer.width / app.renderer.resolution, h: app.renderer.height / app.renderer.resolution }; }
      if (root.ResizeObserver) new ResizeObserver(function () { app.renderer.resize(Math.max(200, ctx.viewport.clientWidth), Math.max(200, ctx.viewport.clientHeight)); requestRender(); }).observe(ctx.viewport);
      function arrH() { var sz = size(); return Math.max(L.ruler + L.trackH * 1.5, Math.min(sz.h * view.split, L.ruler + L.trackH * S.tracks.length + 8)); }
      function beatX(b) { return L.head + (b - view.x) * view.pxBeat; }
      function xBeat(x) { return (x - L.head) / view.pxBeat + view.x; }
      function isDrums() { var tr = curTrack(); return tr && tr.kind === 'drums'; }
      function editorTop() { return arrH() + 6; }
      function edLeft() { return isDrums() ? L.drumLabel : L.keys; }
      function edBeatX(b) { var c = curClip(); return edLeft() + (b - view.edX) * view.edPx; }
      function edXBeat(x) { return (x - edLeft()) / view.edPx + view.edX; }
      view.edX = 0; view.edPx = 60;
      function pitchY(p) { return editorTop() + 22 + (view.rollTop - p) * view.rowH + view.rowH; }
      function yPitch(y) { return Math.round(view.rollTop - ((y - editorTop() - 22) / view.rowH) + 0.5) + 0; }
      function drumRowY(i) { return editorTop() + 22 + i * Math.max(18, Math.min(34, (size().h - editorTop() - 30) / DRUMS.length)); }
      function drumRowH() { return Math.max(18, Math.min(34, (size().h - editorTop() - 30) / DRUMS.length)); }

      function render() {
        var sz = size(), W = sz.w, H = sz.h, g = gfx;
        g.clear(); used = 0;
        var AH = arrH(), bars = S.bars;
        /* ---- arreglo ---- */
        g.rect(0, 0, W, AH).fill({ color: 0xffffff });
        g.rect(0, 0, W, L.ruler).fill({ color: 0xf1f5f9 });
        for (var b = Math.floor(view.x); b <= bars * 4; b++) {
          var x = beatX(b); if (x < L.head - 1) continue; if (x > W) break;
          g.moveTo(x, b % 4 === 0 ? 0 : L.ruler * 0.55).lineTo(x, AH).stroke({ width: 1, color: b % 4 === 0 ? 0xb9c8d8 : 0xe3eaf2 });
          if (b % 4 === 0) label(String(b / 4 + 1), x + 3, L.ruler / 2 - 2, { size: 11, color: '#44586c' });
        }
        /* zona de bucle */
        var lx0 = Math.max(L.head, beatX(S.loop[0])), lx1 = beatX(S.loop[1]);
        if (lx1 > lx0) g.rect(lx0, L.ruler - 7, lx1 - lx0, 6).fill({ color: 0x5a49a8, alpha: 0.75 });
        S.tracks.forEach(function (tr, i) {
          var y = L.ruler + i * L.trackH, col = parseInt(tr.color.slice(1), 16), sel = tr.id === selTrack;
          g.rect(0, y, L.head, L.trackH).fill({ color: sel ? 0xe2ecf6 : 0xf7f9fb }).stroke({ width: 1, color: 0xdbe5ef });
          g.rect(0, y, 5, L.trackH).fill({ color: col });
          label((tr.mute ? '🔇 ' : '') + tr.name, 12, y + L.trackH / 2 - 6, { bold: sel, size: 12 });
          label(tr.kind === 'drums' ? t('kindDrums') : t('preset_' + (tr.preset || 'piano')), 12, y + L.trackH / 2 + 8, { size: 10, color: '#44586c' });
          if (tr.solo) label('S', L.head - 14, y + 10, { bold: true, size: 11, color: '#8a4b00' });
          g.moveTo(L.head, y + L.trackH).lineTo(W, y + L.trackH).stroke({ width: 1, color: 0xe3eaf2 });
          tr.clips.forEach(function (cl) {
            var x0 = beatX(cl.start), x1 = beatX(cl.start + cl.len); if (x1 < L.head || x0 > W) return;
            var cx0 = Math.max(L.head, x0), csel = cl.id === selClip;
            g.roundRect(cx0 + 1, y + 3, Math.max(4, x1 - cx0 - 2), L.trackH - 6, 6).fill({ color: col, alpha: tr.mute ? 0.25 : 0.2 }).stroke({ width: csel ? 3 : 1.5, color: csel ? 0x5a49a8 : col });
            /* miniatura de notas */
            var ps = cl.notes.map(function (n) { return n.p; }), lo = Math.min.apply(null, ps.concat([60])), hi = Math.max.apply(null, ps.concat([61]));
            cl.notes.forEach(function (n) {
              var nx = beatX(cl.start + n.t), nw = Math.max(1.5, n.d * view.pxBeat - 1); if (nx + nw < cx0) return;
              var ny = y + L.trackH - 7 - (n.p - lo) / Math.max(1, hi - lo) * (L.trackH - 14);
              g.rect(Math.max(cx0, nx), ny, nw, 2.5).fill({ color: col });
            });
          });
        });
        g.rect(0, 0, L.head, L.ruler).fill({ color: 0xf1f5f9 });
        label(t('bpmShort', { n: S.bpm }), 8, L.ruler / 2, { size: 11, bold: true });
        /* separador */
        g.rect(0, AH, W, 6).fill({ color: 0xdbe5ef });
        /* ---- editor ---- */
        var ET = editorTop(), cl = curClip(), tr = curTrack();
        if (cl && fittedClip !== cl.id) fitEditor();
        g.rect(0, ET, W, H - ET).fill({ color: 0xffffff });
        if (!cl || !tr) {
          label(t('noClip'), W / 2, ET + (H - ET) / 2, { ax: 0.5, color: '#44586c', size: 14 });
        } else {
          var left = edLeft(), top = ET + 22;
          g.rect(0, ET, W, 22).fill({ color: 0xf1f5f9 });
          var steps = S.grid;
          for (var gb = 0; gb <= cl.len + 1e-9; gb += steps) {
            var gx = edBeatX(gb); if (gx < left) continue; if (gx > W) break;
            var strong = Math.abs(gb % 4) < 1e-9, beat = Math.abs(gb % 1) < 1e-9;
            g.moveTo(gx, top).lineTo(gx, H).stroke({ width: 1, color: strong ? 0x9fb3c8 : beat ? 0xd3dde8 : 0xedf2f7 });
            if (beat) label(String(Math.floor(gb / 4) + 1) + '.' + String(Math.floor(gb % 4) + 1), gx + 2, ET + 11, { size: 10, color: '#44586c', ax: 0 });
          }
          var endX = edBeatX(cl.len); if (endX < W) g.rect(endX, top, W - endX, H - top).fill({ color: 0xe8eef5, alpha: 0.8 });
          if (tr.kind === 'drums') {
            var rh = drumRowH();
            DRUMS.forEach(function (d, i) {
              var y = drumRowY(i);
              g.rect(0, y, left, rh).fill({ color: i % 2 ? 0xf7f9fb : 0xffffff }).stroke({ width: 1, color: 0xe3eaf2 });
              g.moveTo(left, y + rh).lineTo(W, y + rh).stroke({ width: 1, color: 0xe3eaf2 });
              label(d[LANG], 8, y + rh / 2, { size: 12 });
            });
            cl.notes.forEach(function (n, k) {
              var i = DRUMS.findIndex(function (d) { return d.p === n.p; }); if (i < 0) return;
              var x = edBeatX(n.t), w = S.grid * view.edPx; if (x + w < left || x > W) return;
              var sel = selNotes.indexOf(k) >= 0;
              g.roundRect(x + 2, drumRowY(i) + 3, w - 4, rh - 6, 4).fill({ color: parseInt(tr.color.slice(1), 16), alpha: 0.35 + n.v * 0.65 }).stroke({ width: sel ? 3 : 1, color: sel ? 0x5a49a8 : 0x172b42 });
            });
          } else {
            var maxP = view.rollTop, minP = yPitch(H) - 1;
            for (var p = maxP; p >= minP; p--) {
              var y = pitchY(p) - view.rowH; if (y > H) break;
              var black = [1, 3, 6, 8, 10].indexOf(p % 12) >= 0;
              g.rect(left, y, W - left, view.rowH).fill({ color: black ? 0xf3f6f9 : 0xffffff });
              g.moveTo(left, y + view.rowH).lineTo(W, y + view.rowH).stroke({ width: 1, color: p % 12 === 0 ? 0xc3d0dd : 0xf0f3f7 });
              g.rect(0, y, left, view.rowH).fill({ color: black ? 0x2b3a4a : 0xffffff }).stroke({ width: 1, color: 0xc9d8e6 });
              if (p % 12 === 0) label(noteName(p), 4, y + view.rowH / 2, { size: 10, color: black ? '#ffffff' : '#172b42', bold: true });
            }
            cl.notes.forEach(function (n, k) {
              var x = edBeatX(n.t), w = Math.max(3, n.d * view.edPx), y = pitchY(n.p) - view.rowH; if (x + w < left || x > W || y < top - view.rowH || y > H) return;
              var sel = selNotes.indexOf(k) >= 0;
              g.roundRect(Math.max(left, x) + 1, y + 1, w - 2 - Math.max(0, left - x), view.rowH - 2, 3).fill({ color: parseInt(tr.color.slice(1), 16), alpha: 0.45 + n.v * 0.55 }).stroke({ width: sel ? 2.5 : 1, color: sel ? 0x2e2270 : 0x172b42 });
            });
          }
          /* cursor de teclado */
          if (kc.visible) {
            var cx = edBeatX(kc.t), cw = S.grid * view.edPx, cy = tr.kind === 'drums' ? drumRowY(kc.row) : pitchY(kc.p) - view.rowH, chh = tr.kind === 'drums' ? drumRowH() : view.rowH;
            g.rect(cx, cy, cw, chh).stroke({ width: 3, color: 0x5a49a8 });
          }
        }
        /* cabezal: sigue al reloj de audio */
        var pos = transport.ticks / PPQ;
        var px = beatX(pos); if (px >= L.head && px <= W) g.moveTo(px, 0).lineTo(px, AH).stroke({ width: 2, color: 0xa1283c });
        if (cl) { var ex = edBeatX(pos - cl.start); if (pos >= cl.start && pos <= cl.start + cl.len && ex >= edLeft() && ex <= W) g.moveTo(ex, ET + 22).lineTo(ex, H).stroke({ width: 2, color: 0xa1283c }); }
        /* medidor */
        if (audioReady) { var lv = Math.max(level.peak[0] || 0, level.peak[1] || 0); g.rect(W - 10, 4, 6, AH - 8).fill({ color: 0xe3eaf2 }); var mh = Math.min(1, lv) * (AH - 8); g.rect(W - 10, AH - 4 - mh, 6, mh).fill({ color: lv > 0.95 ? 0xa1283c : 0x2e7d32 }); }
        for (var i2 = used; i2 < pool.length; i2++) pool[i2].visible = false;
        app.render();
      }
      function tick() { if (!playing) return; render(); root.requestAnimationFrame(tick); }

      /* ======================= Interacción ======================= */
      var kc = { t: 0, p: 60, row: 7, visible: false };
      function local(e) { var r = ctx.viewport.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
      function snap(b) { var g = S.grid; return Math.round(b / g) * g; }
      function snapDown(b) { var g = S.grid; return Math.floor(b / g + 1e-9) * g; }
      function hitClip(p) {
        var i = Math.floor((p.y - L.ruler) / L.trackH); if (i < 0 || i >= S.tracks.length || p.x < L.head) return null;
        var tr = S.tracks[i], b = xBeat(p.x);
        for (var k = tr.clips.length - 1; k >= 0; k--) { var cl = tr.clips[k]; if (b >= cl.start && b <= cl.start + cl.len) return { tr: tr, cl: cl, edge: Math.abs(beatX(cl.start + cl.len) - p.x) < 8 }; }
        return { tr: tr, cl: null };
      }
      function hitNote(p) {
        var cl = curClip(), tr = curTrack(); if (!cl) return null;
        for (var k = cl.notes.length - 1; k >= 0; k--) {
          var n = cl.notes[k], x = edBeatX(n.t), w = tr.kind === 'drums' ? S.grid * view.edPx : Math.max(3, n.d * view.edPx);
          var y = tr.kind === 'drums' ? drumRowY(DRUMS.findIndex(function (d) { return d.p === n.p; })) : pitchY(n.p) - view.rowH, hh = tr.kind === 'drums' ? drumRowH() : view.rowH;
          if (p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + hh) return { k: k, edge: tr.kind !== 'drums' && p.x > x + w - 7 };
        }
        return null;
      }
      function cellAt(p) {
        var tr = curTrack(), b = snapDown(edXBeat(p.x));
        if (tr.kind === 'drums') { var i = Math.floor((p.y - editorTop() - 22) / drumRowH()); if (i < 0 || i >= DRUMS.length) return null; return { t: b, p: DRUMS[i].p, row: i }; }
        return { t: b, p: yPitch(p.y) };
      }
      var drag = null;
      ctx.viewport.addEventListener('pointerdown', function (e) {
        if (e.button > 0) return;
        ctx.viewport.focus({ preventScroll: true }); kc.visible = false;
        var p = local(e), tool = ctx.tool() || 'draw', AH = arrH();
        if (p.y < L.ruler && p.x >= L.head) {
          /* regla: situar el cabezal; con Mayús, marcar el bucle */
          var b = Math.max(0, Math.round(xBeat(p.x)));
          if (e.shiftKey) { drag = { kind: 'loop', from: b }; S.loop = [b, b + 1]; }
          else { transport.ticks = Math.round(Math.min(S.bars * 4, b) * PPQ); ctx.announce(t('playheadAt', { bar: Math.floor(b / 4) + 1, beat: b % 4 + 1 })); }
          requestRender(); ctx.viewport.setPointerCapture(e.pointerId); if (!drag) drag = { kind: 'none' }; return;
        }
        if (p.y < AH) {
          var hc = hitClip(p); if (!hc) return;
          if (p.x < L.head) return;
          selTrack = hc.tr.id;
          if (hc.cl) {
            if (tool === 'erase') { hc.tr.clips = hc.tr.clips.filter(function (c) { return c !== hc.cl; }); if (selClip === hc.cl.id) selClip = null; changed(t('clipDeleted')); return; }
            selClip = hc.cl.id; selNotes = []; view.edX = 0;
            var src = hc.cl;
            if (e.altKey) { var cp = { id: newId('c'), start: src.start, len: src.len, notes: JSON.parse(JSON.stringify(src.notes)) }; hc.tr.clips.push(cp); src = cp; selClip = cp.id; }
            drag = { kind: hc.edge ? 'clipLen' : 'clipMove', cl: src, tr: hc.tr, grab: xBeat(p.x) - src.start, orig: { start: src.start, len: src.len }, moved: false };
            ctx.viewport.setPointerCapture(e.pointerId);
          } else if (tool === 'draw') {
            var sb = Math.floor(xBeat(p.x) / 4) * 4;
            var ncl = { id: newId('c'), start: sb, len: 4, notes: [] }; hc.tr.clips.push(ncl); selClip = ncl.id; selNotes = [];
            if (sb + 4 > S.bars * 4) { S.bars = Math.min(64, Math.ceil((sb + 4) / 4)); }
            changed(t('clipAdded'));
          } else { selClip = null; }
          renderSide(); requestRender(); return;
        }
        /* editor */
        var cl = curClip(), tr = curTrack(); if (!cl || p.y < editorTop() + 22 || p.x < edLeft()) {
          if (cl && tr && tr.kind !== 'drums' && p.x < edLeft() && p.y > editorTop() + 22) playNow(tr, yPitch(p.y), 0.4);
          return;
        }
        var hn = hitNote(p);
        if (tool === 'erase') { if (hn) { cl.notes.splice(hn.k, 1); selNotes = []; changed(t('noteDeleted')); } return; }
        if (hn) {
          if (tr.kind === 'drums' && tool === 'draw') { cl.notes.splice(hn.k, 1); selNotes = []; changed(t('noteDeleted')); return; }
          if (e.shiftKey) { var ix = selNotes.indexOf(hn.k); if (ix >= 0) selNotes.splice(ix, 1); else selNotes.push(hn.k); }
          else if (selNotes.indexOf(hn.k) < 0) selNotes = [hn.k];
          var n0 = cl.notes[hn.k];
          drag = { kind: hn.edge ? 'noteLen' : 'noteMove', k: hn.k, startB: edXBeat(p.x), startP: tr.kind === 'drums' ? n0.p : yPitch(p.y), orig: selNotes.map(function (k) { return { k: k, t: cl.notes[k].t, p: cl.notes[k].p, d: cl.notes[k].d }; }), moved: false };
          if (tr.kind !== 'drums') playNow(tr, n0.p, 0.25);
          ctx.viewport.setPointerCapture(e.pointerId); renderSide(); requestRender(); return;
        }
        if (tool === 'draw') {
          var c = cellAt(p); if (!c || c.t < 0 || c.t >= cl.len) return;
          var n = { t: c.t, d: tr.kind === 'drums' ? S.grid : (view.lastLen || S.grid * 2), p: c.p, v: 0.8 };
          cl.notes.push(n); selNotes = [cl.notes.length - 1];
          playNow(tr, n.p, 0.25);
          if (tr.kind !== 'drums') { drag = { kind: 'noteLen', k: cl.notes.length - 1, startB: edXBeat(p.x), orig: [{ k: cl.notes.length - 1, t: n.t, p: n.p, d: n.d }], moved: false, created: true }; ctx.viewport.setPointerCapture(e.pointerId); }
          else changed(t('noteAdded', { name: DRUMS[c.row][LANG] }));
          renderSide(); requestRender();
        } else { selNotes = []; renderSide(); requestRender(); }
      });
      ctx.viewport.addEventListener('pointermove', function (e) {
        if (!drag) return; var p = local(e);
        if (drag.kind === 'loop') { var b = Math.max(0, Math.round(xBeat(p.x))); S.loop = [Math.min(drag.from, b), Math.max(drag.from, b) + (b === drag.from ? 1 : 0)]; requestRender(); return; }
        if (drag.kind === 'clipMove') { var ns = Math.max(0, Math.round(xBeat(p.x) - drag.grab)); if (ns !== drag.cl.start) { drag.cl.start = ns; drag.moved = true; if (ns + drag.cl.len > S.bars * 4) S.bars = Math.min(64, Math.ceil((ns + drag.cl.len) / 4)); requestRender(); } return; }
        if (drag.kind === 'clipLen') { var nl = Math.max(1, Math.round(xBeat(p.x)) - drag.cl.start); if (nl !== drag.cl.len) { drag.cl.len = nl; drag.moved = true; if (drag.cl.start + nl > S.bars * 4) S.bars = Math.min(64, Math.ceil((drag.cl.start + nl) / 4)); requestRender(); } return; }
        var cl = curClip(), tr = curTrack(); if (!cl) return;
        if (drag.kind === 'noteMove') {
          var db = snap(edXBeat(p.x) - drag.startB), dp = tr.kind === 'drums' ? 0 : yPitch(p.y) - drag.startP;
          drag.orig.forEach(function (o) { var n = cl.notes[o.k]; if (!n) return; n.t = Math.max(0, Math.min(cl.len - S.grid, o.t + db)); n.p = Math.max(21, Math.min(108, o.p + dp)); });
          if (db || dp) drag.moved = true; requestRender(); return;
        }
        if (drag.kind === 'noteLen') { var n2 = cl.notes[drag.k], o2 = drag.orig[0]; if (!n2) return; var end = Math.max(n2.t + S.grid, snap(edXBeat(p.x)) + (drag.created ? S.grid : 0)); n2.d = Math.max(S.grid, end - n2.t); drag.moved = true; view.lastLen = n2.d; requestRender(); }
      });
      ctx.viewport.addEventListener('pointerup', function () {
        if (!drag) return; var d = drag; drag = null;
        if (d.kind === 'loop') { if (playing) setLoop(); changed(t('loopSet', { a: Math.floor(S.loop[0] / 4) + 1, b: Math.ceil(S.loop[1] / 4) })); return; }
        if (d.kind === 'clipMove' || d.kind === 'clipLen') { if (d.moved) changed(d.kind === 'clipMove' ? t('clipMoved') : t('clipResized')); return; }
        if (d.created) { changed(t('noteAdded', { name: noteName(curClip().notes[d.k].p) })); return; }
        if ((d.kind === 'noteMove' || d.kind === 'noteLen') && d.moved) changed(t('noteMoved'));
      });
      ctx.viewport.addEventListener('wheel', function (e) {
        e.preventDefault(); var p = local(e);
        if (e.ctrlKey || e.metaKey) {
          if (p.y < arrH()) { view.pxBeat = Math.max(8, Math.min(200, view.pxBeat * Math.exp(-e.deltaY * 0.002))); }
          else { view.edPx = Math.max(16, Math.min(320, view.edPx * Math.exp(-e.deltaY * 0.002))); }
        } else if (p.y < arrH()) view.x = Math.max(0, view.x + (e.shiftKey ? e.deltaY : e.deltaX || e.deltaY) / view.pxBeat);
        else if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) view.edX = Math.max(0, view.edX + (e.deltaX || e.deltaY) / view.edPx);
        else if (!isDrums()) view.rollTop = Math.max(40, Math.min(108, view.rollTop + (e.deltaY > 0 ? -2 : 2)));
        requestRender();
      }, { passive: false });

      /* Teclado: cursor en el editor, reproducir, tocar con el teclado del ordenador */
      var typing = false, TYPE_KEYS = 'awsedftgyhujkolp';
      function announceCursor() {
        var tr = curTrack(); if (!tr) return;
        var what = tr.kind === 'drums' ? DRUMS[kc.row][LANG] : noteName(kc.p);
        var cl = curClip(), has = cl && cl.notes.some(function (n) { return Math.abs(n.t - kc.t) < 1e-9 && n.p === (tr.kind === 'drums' ? DRUMS[kc.row].p : kc.p); });
        ctx.announce(t('cursorMusic', { what: what, bar: Math.floor(kc.t / 4) + 1, beat: Math.floor(kc.t % 4) + 1, sub: Math.round((kc.t % 1) / S.grid) + 1 }) + (has ? ' · ' + t('hasNote') : ''));
      }
      function onKey(e) {
        if (!ctx.viewport.contains(e.target)) return false;
        var tr = curTrack(), cl = curClip();
        if (typing && tr && !e.ctrlKey && !e.metaKey && !e.altKey) {
          var ix = TYPE_KEYS.indexOf(e.key.toLowerCase());
          if (ix >= 0) { if (!e.repeat) playNow(tr, tr.kind === 'drums' ? DRUMS[ix % DRUMS.length].p : 60 + ix, 0.35); return true; }
        }
        if (e.key === ' ') { play(); return true; }
        if (!cl || !tr) return false;
        var dir = { ArrowLeft: -1, ArrowRight: 1 }[e.key], vdir = { ArrowUp: 1, ArrowDown: -1 }[e.key];
        if ((e.ctrlKey || e.metaKey) && selNotes.length && (dir || vdir)) {
          selNotes.forEach(function (k) { var n = cl.notes[k]; if (dir) n.t = Math.max(0, Math.min(cl.len - S.grid, n.t + dir * S.grid)); if (vdir && tr.kind !== 'drums') n.p = Math.max(21, Math.min(108, n.p + vdir)); });
          changed(t('noteMoved')); return true;
        }
        if (e.shiftKey && selNotes.length && dir && tr.kind !== 'drums') { selNotes.forEach(function (k) { var n = cl.notes[k]; n.d = Math.max(S.grid, n.d + dir * S.grid); }); changed(t('noteResized')); return true; }
        if (dir || vdir) {
          kc.visible = true;
          if (dir) kc.t = Math.max(0, Math.min(cl.len - S.grid, kc.t + dir * S.grid * (e.shiftKey ? 4 : 1)));
          if (vdir) { if (tr.kind === 'drums') kc.row = Math.max(0, Math.min(DRUMS.length - 1, kc.row - vdir)); else { kc.p = Math.max(21, Math.min(108, kc.p + vdir * (e.shiftKey ? 12 : 1))); if (kc.p > view.rollTop) view.rollTop = kc.p; if (pitchY(kc.p) > size().h) view.rollTop = Math.min(108, kc.p + 10); } }
          var cx = edBeatX(kc.t); if (cx < edLeft()) view.edX = kc.t; if (cx > size().w - 40) view.edX = kc.t - (size().w - edLeft() - 80) / view.edPx;
          announceCursor(); requestRender(); return true;
        }
        if (e.key === 'Enter') {
          kc.visible = true;
          var p = tr.kind === 'drums' ? DRUMS[kc.row].p : kc.p;
          var at = cl.notes.findIndex(function (n) { return Math.abs(n.t - kc.t) < 1e-9 && n.p === p; });
          if (at >= 0) { cl.notes.splice(at, 1); selNotes = []; changed(t('noteDeleted')); }
          else { cl.notes.push({ t: kc.t, d: tr.kind === 'drums' ? S.grid : (view.lastLen || S.grid * 2), p: p, v: 0.8 }); selNotes = [cl.notes.length - 1]; playNow(tr, p, 0.25); changed(t('noteAdded', { name: tr.kind === 'drums' ? DRUMS[kc.row][LANG] : noteName(p) })); }
          return true;
        }
        if ((e.key === 'Delete' || e.key === 'Backspace') && selNotes.length) {
          var keep = cl.notes.filter(function (_, k) { return selNotes.indexOf(k) < 0; }); cl.notes = keep; selNotes = []; changed(t('noteDeleted')); return true;
        }
        if (e.key === 'Escape') { selNotes = []; kc.visible = false; renderSide(); requestRender(); return true; }
        return false;
      }
      ctx.viewport.addEventListener('focus', function () { if (ctx.viewport.matches(':focus-visible')) { kc.visible = true; requestRender(); } });
      ctx.viewport.addEventListener('blur', function () { kc.visible = false; requestRender(); });

      /* ======================= Paneles ======================= */
      function changed(msg) { ctx.commit(msg); if (msg) ctx.announce(msg); if (playing) schedule(); renderSide(); requestRender(); }
      function renderSide() {
        var list = [h('h3', { text: t('tracks') })], ul = h('ul', { class: 'igs-list' });
        S.tracks.forEach(function (tr) {
          var li = h('li', { class: 'igs-track-row' });
          var b = h('button', { type: 'button', 'aria-current': String(tr.id === selTrack) }, h('span', { class: 'igs-swatch', style: 'background:' + tr.color }), h('span', { text: tr.name }), h('small', { text: tr.kind === 'drums' ? t('kindDrums') : t('preset_' + tr.preset) }));
          b.addEventListener('click', function () { selTrack = tr.id; selClip = tr.clips[0] ? tr.clips[0].id : null; selNotes = []; kc.p = 60; renderSide(); requestRender(); ctx.announce(t('trackChosen', { name: tr.name })); });
          var m = h('button', { type: 'button', class: 'igs-mini', 'aria-pressed': String(!!tr.mute), 'aria-label': t('muteTrack', { name: tr.name }), text: 'M' });
          m.addEventListener('click', function () { tr.mute = !tr.mute; applyMix(); changed(tr.mute ? t('muted', { name: tr.name }) : t('unmuted', { name: tr.name })); });
          var s = h('button', { type: 'button', class: 'igs-mini', 'aria-pressed': String(!!tr.solo), 'aria-label': t('soloTrack', { name: tr.name }), text: 'S' });
          s.addEventListener('click', function () { tr.solo = !tr.solo; applyMix(); changed(tr.solo ? t('soloOn', { name: tr.name }) : t('soloOff', { name: tr.name })); });
          li.append(b, h('span', { class: 'igs-mini-row' }, m, s)); ul.appendChild(li);
        });
        list.push(ul);
        var addSel = h('select', { 'aria-label': t('newTrackKind') });
        [['drums', t('kindDrums')]].concat(Object.keys(PRESETS).map(function (k) { return [k, t('preset_' + k)]; })).forEach(function (o) { addSel.appendChild(h('option', { value: o[0], text: o[1] })); });
        list.push(h('div', { class: 'igs-actions igs-add-track' }, h('label', { class: 'igs-inline-select' }, h('span', { text: t('newTrackKind') }), addSel), ctx.button(t('addTrack'), { icon: 'plus', onClick: function () { addTrack(addSel.value); } })));
        var tr = curTrack();
        if (tr) {
          list.push(h('h3', { text: t('clipsOf', { name: tr.name }) }));
          var ul2 = h('ul', { class: 'igs-list' });
          tr.clips.slice().sort(function (a, b) { return a.start - b.start; }).forEach(function (cl) {
            var bb = h('button', { type: 'button', 'aria-current': String(cl.id === selClip) }, h('span', { text: t('clipName', { bar: Math.floor(cl.start / 4) + 1, len: cl.len / 4 }) }), h('small', { text: t('notesN', { n: cl.notes.length }) }));
            bb.addEventListener('click', function () { selClip = cl.id; selNotes = []; view.edX = 0; renderSide(); requestRender(); });
            ul2.appendChild(h('li', null, bb));
          });
          list.push(ul2);
        }
        ctx.setStructure(list);

        var F = ctx.fields, out = [];
        out.push(h('h4', { text: t('song') }));
        out.push(F.number(t('tempo'), S.bpm, { unit: 'BPM', min: 40, max: 220, step: 1, onChange: function (v) { S.bpm = Math.round(v); transport.bpm.value = S.bpm; changed(t('tempoSet', { n: S.bpm })); } }));
        out.push(F.number(t('lengthBars'), S.bars, { unit: t('barsUnit'), min: 1, max: 64, step: 1, onChange: function (v) { S.bars = Math.round(v); S.loop[1] = Math.min(S.loop[1], S.bars * 4); changed(t('lengthSet')); } }));
        out.push(F.select(t('gridLabel'), String(S.grid), [['1', t('grid1')], ['0.5', t('grid2')], ['0.25', t('grid4')], ['0.125', t('grid8')]], { onChange: function (v) { S.grid = +v; renderSide(); requestRender(); ctx.announce(t('gridLabel') + ': ' + v); } }));
        if (tr) {
          out.push(h('h4', { text: t('trackTitle', { name: tr.name }) }));
          if (tr.kind !== 'drums' && MODE === 'synth') out = out.concat(synthPanel(tr));
          out.push(F.text(t('name'), tr.name, { max: 30, onChange: function (v) { tr.name = String(v).trim().slice(0, 30) || tr.name; changed(t('renamed')); } }));
          out.push(F.range(t('volume'), tr.vol, { min: -40, max: 6, step: 1, unit: 'dB', format: function (v) { return String(v); }, onInput: function (v) { tr.vol = v; applyMix(); }, onChange: function () { changed(t('volumeSet')); } }));
          out.push(F.range(t('pan'), tr.pan, { min: -1, max: 1, step: 0.1, format: function (v) { return v === 0 ? t('centre') : v < 0 ? t('leftN', { n: Math.round(-v * 100) }) : t('rightN', { n: Math.round(v * 100) }); }, onInput: function (v) { tr.pan = v; applyMix(); }, onChange: function () { changed(t('panSet')); } }));
          if (tr.kind !== 'drums' && MODE !== 'synth') out = out.concat(synthPanel(tr));
          var cl = curClip();
          if (cl) {
            out.push(h('h4', { text: t('clipTitle') }));
            out.push(F.number(t('clipStart'), Math.floor(cl.start / 4) + 1 + (cl.start % 4) / 4, { unit: t('barWord'), min: 1, max: 64, step: 0.25, onChange: function (v) { cl.start = Math.max(0, Math.round((v - 1) * 4)); changed(t('clipMoved')); } }));
            out.push(F.number(t('clipLen'), cl.len / 4, { unit: t('barsUnit'), min: 0.25, max: 16, step: 0.25, onChange: function (v) { cl.len = Math.max(1, Math.round(v * 4)); changed(t('clipResized')); } }));
            out.push(h('div', { class: 'igs-actions' },
              ctx.button(t('duplicateClip'), { icon: 'copy', onClick: function () { var c = { id: newId('c'), start: cl.start + cl.len, len: cl.len, notes: JSON.parse(JSON.stringify(cl.notes)) }; tr.clips.push(c); selClip = c.id; if (c.start + c.len > S.bars * 4) S.bars = Math.min(64, Math.ceil((c.start + c.len) / 4)); changed(t('clipDuplicated')); } }),
              ctx.button(t('deleteClip'), { icon: 'trash', class: 'igs-danger', onClick: function () { tr.clips = tr.clips.filter(function (c) { return c !== cl; }); selClip = null; changed(t('clipDeleted')); } })));
            if (selNotes.length === 1 && cl.notes[selNotes[0]]) {
              var n = cl.notes[selNotes[0]];
              out.push(h('h4', { text: t('noteTitle', { name: tr.kind === 'drums' ? (DRUMS.filter(function (d) { return d.p === n.p; })[0] || {})[LANG] : noteName(n.p) }) }));
              /* alternativa sin arrastrar (WCAG 2.5.7): colocar la nota con campos */
              out.push(F.number(t('noteStartF'), +(n.t + 1).toFixed(3), { unit: t('beatsUnitF'), min: 1, max: cl.len * 4 + 1, step: S.grid, onChange: function (v) { n.t = Math.max(0, Math.min(cl.len * 4 - S.grid, Math.round((v - 1) / S.grid) * S.grid)); changed(t('noteMoved')); } }));
              if (tr.kind !== 'drums') {
                out.push(F.number(t('noteLenF'), n.d, { unit: t('beatsUnitF'), min: S.grid, max: 16, step: S.grid, onChange: function (v) { n.d = Math.max(S.grid, Math.round(v / S.grid) * S.grid); changed(t('noteResized')); } }));
                var opts = []; for (var pp = 96; pp >= 24; pp--) opts.push([String(pp), noteName(pp)]);
                out.push(F.select(t('notePitchF'), String(n.p), opts, { onChange: function (v) { n.p = +v; playNow(tr, n.p, 0.25); changed(t('noteMoved')); } }));
              }
              out.push(F.range(t('velocity'), Math.round(n.v * 100), { min: 5, max: 100, step: 5, unit: '%', format: function (v) { return String(v); }, onChange: function (v) { n.v = v / 100; changed(t('velocitySet')); } }));
            }
            out.push(notesTable(tr, cl));
          }
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deleteTrack'), { icon: 'trash', class: 'igs-danger', disabled: S.tracks.length <= 1, onClick: function () { S.tracks = S.tracks.filter(function (x) { return x !== tr; }); selTrack = S.tracks[0].id; selClip = S.tracks[0].clips[0] ? S.tracks[0].clips[0].id : null; rebuildVoices(); changed(t('trackDeleted')); } })));
        }
        ctx.setInspector(out);
        ctx.setSummary(t('summary', { bpm: S.bpm, bars: S.bars, n: S.tracks.length, tracks: S.tracks.map(function (x) { return x.name + ' (' + x.clips.length + ')'; }).join(', ') }));
      }
      function notesTable(tr, cl) {
        var sorted = cl.notes.map(function (n, k) { return { n: n, k: k }; }).sort(function (a, b) { return a.n.t - b.n.t || b.n.p - a.n.p; }).slice(0, 64);
        var tb = h('table', { class: 'igs-table' }, h('caption', { text: t('notesTable', { n: cl.notes.length }) }),
          h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('thWhen') }), h('th', { scope: 'col', text: tr.kind === 'drums' ? t('thSound') : t('thNote') }), h('th', { scope: 'col', text: t('thLength') }))));
        var body = h('tbody');
        sorted.forEach(function (o) {
          body.appendChild(h('tr', null, h('td', { text: (Math.floor((cl.start + o.n.t) / 4) + 1) + '.' + (Math.floor((cl.start + o.n.t) % 4) + 1) + (o.n.t % 1 ? '.' + (Math.round((o.n.t % 1) / 0.25) + 1) : '') }),
            h('td', { text: tr.kind === 'drums' ? (DRUMS.filter(function (d) { return d.p === o.n.p; })[0] || {})[LANG] : noteName(o.n.p) }), h('td', { class: 'igs-numcell', text: IG.num(o.n.d, 2) })));
        });
        tb.appendChild(body);
        return h('details', { class: 'igs-notes-details' }, h('summary', { text: t('notesTable', { n: cl.notes.length }) }), h('div', { class: 'igs-table-wrap' }, tb));
      }
      function synthPanel(tr) {
        var F = ctx.fields, P = instOf(tr), out = [];
        function upd(label) { var v = voices[tr.id]; if (v) { v.inst.set(P); var ch = v.channel; ch.send('reverb', dbFromAmount(P.reverb || 0)); ch.send('delay', dbFromAmount(P.delay || 0)); } ctx.commit(label); }
        out.push(h('h4', { text: t('instrument') }));
        out.push(F.select(t('presetLabel'), tr.preset, Object.keys(PRESETS).map(function (k) { return [k, t('preset_' + k)]; }), { onChange: function (v) { tr.preset = v; tr.inst = JSON.parse(JSON.stringify(PRESETS[v])); rebuildVoices(); changed(t('presetSet', { name: t('preset_' + v) })); } }));
        if (P.voice !== 'noise') out.push(F.choice(t('waveform'), P.osc, [['sine', t('wSine')], ['triangle', t('wTriangle')], ['square', t('wSquare')], ['sawtooth', t('wSaw')]], { onChange: function (v) { P.osc = v; upd(t('waveform')); renderSide(); } }));
        else out.push(F.choice(t('noiseColour'), P.osc, [['white', t('nWhite')], ['pink', t('nPink')], ['brown', t('nBrown')]], { onChange: function (v) { P.osc = v; rebuildVoices(); ctx.commit(t('noiseColour')); } }));
        out.push(envelopeEditor(tr, P, upd));
        out.push(F.range(t('cutoff'), Math.round(P.cutoff), { min: 80, max: 12000, step: 10, unit: 'Hz', format: function (v) { return String(v); }, onInput: function (v) { P.cutoff = v; var vv = voices[tr.id]; if (vv && vv.inst.filter) vv.inst.filter.frequency.rampTo(v, 0.05); }, onChange: function () { upd(t('cutoff')); } }));
        out.push(F.range(t('resonance'), P.q, { min: 0.1, max: 12, step: 0.1, format: function (v) { return IG.num(v, 1); }, onInput: function (v) { P.q = v; var vv = voices[tr.id]; if (vv && vv.inst.filter) vv.inst.filter.Q.value = v; }, onChange: function () { upd(t('resonance')); } }));
        if (P.voice === 'fm') out.push(F.range(t('fmIndex'), P.mod || 6, { min: 0, max: 30, step: 0.5, format: function (v) { return IG.num(v, 1); }, onChange: function (v) { P.mod = v; upd(t('fmIndex')); } }));
        if (P.voice === 'fm' || P.voice === 'am') out.push(F.range(t('harmonicity'), P.harm || 1, { min: 0.5, max: 8, step: 0.01, format: function (v) { return IG.num(v, 2); }, onChange: function (v) { P.harm = v; upd(t('harmonicity')); } }));
        out.push(F.range(t('reverb'), Math.round((P.reverb || 0) * 100), { min: 0, max: 100, step: 5, unit: '%', format: function (v) { return String(v); }, onChange: function (v) { P.reverb = v / 100; upd(t('reverb')); } }));
        out.push(F.range(t('echo'), Math.round((P.delay || 0) * 100), { min: 0, max: 100, step: 5, unit: '%', format: function (v) { return String(v); }, onChange: function (v) { P.delay = v / 100; upd(t('echo')); } }));
        return out;
      }
      /* Envolvente ADSR con manipulación directa (arrastrar puntos) y campos numéricos equivalentes */
      function envelopeEditor(tr, P, upd) {
        var wrap = h('div', { class: 'igs-env' }), cv = h('canvas', { width: 260, height: 110, class: 'igs-env-canvas', role: 'img', 'aria-label': '' });
        var fields = h('div', { class: 'igs-env-fields' });
        wrap.append(h('p', { class: 'igs-env-title', text: t('envelope') }), cv, fields);
        var W2 = 260, H2 = 110, pad = 8;
        function geom() { var total = P.env.a + P.env.d + 1 + P.env.r, sx = (W2 - 2 * pad) / Math.max(0.5, total); return { ax: pad + P.env.a * sx, dx: pad + (P.env.a + P.env.d) * sx, sx2: pad + (P.env.a + P.env.d + 1) * sx, rx: pad + total * sx, sy: pad + (1 - P.env.s) * (H2 - 2 * pad), sx: sx }; }
        function draw() {
          var c = cv.getContext('2d'), g = geom(), dpr = 1;
          c.clearRect(0, 0, W2, H2); c.fillStyle = '#f7f9fb'; c.fillRect(0, 0, W2, H2);
          c.strokeStyle = '#1f5f8b'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(pad, H2 - pad); c.lineTo(g.ax, pad); c.lineTo(g.dx, g.sy); c.lineTo(g.sx2, g.sy); c.lineTo(g.rx, H2 - pad); c.stroke();
          [[g.ax, pad], [g.dx, g.sy], [g.rx, H2 - pad]].forEach(function (q) { c.fillStyle = '#ffffff'; c.strokeStyle = '#5a49a8'; c.lineWidth = 2; c.beginPath(); c.arc(q[0], q[1], 6, 0, Math.PI * 2); c.fill(); c.stroke(); });
          c.fillStyle = '#44586c'; c.font = '11px Atkinson Hyperlegible, Arial'; c.fillText('A', g.ax - 3, H2 - 2); c.fillText('D', g.dx - 3, H2 - 2); c.fillText('S', (g.dx + g.sx2) / 2, g.sy - 6); c.fillText('R', g.rx - 12, H2 - 2);
          cv.setAttribute('aria-label', t('envDesc', { a: IG.num(P.env.a, 2), d: IG.num(P.env.d, 2), s: Math.round(P.env.s * 100), r: IG.num(P.env.r, 2) }));
        }
        var dragPt = null;
        cv.addEventListener('pointerdown', function (e) {
          var r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * W2 / r.width, y = (e.clientY - r.top) * H2 / r.height, g = geom();
          var pts = [['a', g.ax, pad], ['d', g.dx, g.sy], ['r', g.rx, H2 - pad]], best = null, bd = 18;
          pts.forEach(function (q) { var dd = Math.hypot(q[1] - x, q[2] - y); if (dd < bd) { bd = dd; best = q[0]; } });
          if (best) { dragPt = { k: best, sx: g.sx }; cv.setPointerCapture(e.pointerId); }
        });
        cv.addEventListener('pointermove', function (e) {
          if (!dragPt) return; var r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * W2 / r.width, y = (e.clientY - r.top) * H2 / r.height, sx = dragPt.sx;
          if (dragPt.k === 'a') P.env.a = Math.max(0.001, Math.min(4, (x - pad) / sx));
          if (dragPt.k === 'd') { P.env.d = Math.max(0.01, Math.min(4, (x - pad) / sx - P.env.a)); P.env.s = Math.max(0, Math.min(1, 1 - (y - pad) / (H2 - 2 * pad))); }
          if (dragPt.k === 'r') P.env.r = Math.max(0.01, Math.min(8, (x - pad) / sx - P.env.a - P.env.d - 1));
          draw(); syncFields();
        });
        cv.addEventListener('pointerup', function () { if (dragPt) { dragPt = null; upd(t('envelope')); } });
        var F = ctx.fields, inputs = {};
        [['a', t('attack'), 0.001, 4, 's'], ['d', t('decay'), 0.01, 4, 's'], ['s', t('sustain'), 0, 100, '%'], ['r', t('release'), 0.01, 8, 's']].forEach(function (f) {
          var val = f[0] === 's' ? Math.round(P.env.s * 100) : +P.env[f[0]].toFixed(3);
          var fld = F.number(f[1], val, { unit: f[4], min: f[2], max: f[3], step: f[0] === 's' ? 5 : 0.01, onChange: function (v) { P.env[f[0]] = f[0] === 's' ? v / 100 : v; draw(); upd(f[1]); } });
          inputs[f[0]] = fld.input; fields.appendChild(fld);
        });
        function syncFields() { inputs.a.value = +P.env.a.toFixed(3); inputs.d.value = +P.env.d.toFixed(3); inputs.s.value = Math.round(P.env.s * 100); inputs.r.value = +P.env.r.toFixed(3); }
        draw();
        return wrap;
      }
      function addTrack(kind) {
        var i = S.tracks.length, tr = { id: newId('t'), name: kind === 'drums' ? t('trDrums') : t('preset_' + kind), kind: kind === 'drums' ? 'drums' : 'synth', preset: kind === 'drums' ? null : kind, color: TRACK_COLORS[i % TRACK_COLORS.length], vol: -8, pan: 0, mute: false, solo: false, clips: [{ id: newId('c'), start: 0, len: 4, notes: [] }] };
        if (tr.kind !== 'drums') instOf(tr);
        S.tracks.push(tr); selTrack = tr.id; selClip = tr.clips[0].id; selNotes = [];
        rebuildVoices(); changed(t('trackAdded', { name: tr.name }));
      }

      /* ======================= Exportar ======================= */
      var offlineSerial = 0;
      function exportWav() {
        offlineSerial += 1; var busR = 'reverb-offline-' + offlineSerial, busD = 'delay-offline-' + offlineSerial;
        var secs = S.bars * 4 * 60 / S.bpm + 3;
        ctx.announce(t('rendering'));
        var data = JSON.parse(JSON.stringify(S));
        Tone.Offline(function (o) {
          var tp = o.transport; tp.PPQ = PPQ; tp.bpm.value = data.bpm;
          var mst = new Tone.Gain(0.9).toDestination();
          var rv = new Tone.Reverb({ decay: 2.8, preDelay: 0.02, wet: 1 }); var rvb = new Tone.Channel({ volume: -4 }).receive(busR); rvb.chain(rv, mst);
          var dl = new Tone.FeedbackDelay({ delayTime: '8n.', feedback: 0.35, wet: 1 }); var dlb = new Tone.Channel({ volume: -8 }).receive(busD); dlb.chain(dl, mst);
          var anySolo = data.tracks.some(function (x) { return x.solo; });
          var ready = rv.ready || Promise.resolve();
          data.tracks.forEach(function (tr) {
            if (tr.mute || (anySolo && !tr.solo)) return;
            var inst = makeInstrument(tr), ch = new Tone.Channel({ volume: tr.vol, pan: tr.pan }).connect(mst); inst.output.connect(ch);
            var P = tr.kind === 'drums' ? { reverb: 0.08, delay: 0 } : (tr.inst || PRESETS[tr.preset]);
            ch.send(busR, dbFromAmount(P.reverb || 0)); ch.send(busD, dbFromAmount(P.delay || 0));
            tr.clips.forEach(function (cl) { cl.notes.forEach(function (n) {
              if (n.t >= cl.len) return; var dur = Math.min(n.d, cl.len - n.t);
              tp.schedule(function (time) { inst.play(n.p, Tone.Ticks(Math.max(1, Math.round(dur * PPQ))).toSeconds(), time, n.v); }, Math.round((cl.start + n.t) * PPQ) + 'i');
            }); });
          });
          return ready.then(function () { tp.start(0); });
        }, secs, 2, 44100).then(function (buf) {
          var blob = encodeWav(buf.get());
          ctx.download(blob, (LANG === 'en' ? 'song-' : 'cancion-') + ctx.stamp() + '.wav');
        }).catch(function (err) { ctx.announce(t('renderError')); if (root.console) console.error(err); });
      }
      function encodeWav(ab) {
        var ch = Math.min(2, ab.numberOfChannels), sr = ab.sampleRate, len = ab.length, dataBytes = len * ch * 2;
        var info = 'IRIS GREEN · irisgreen.eu', infoBytes = new TextEncoder().encode(info + '\0'); var infoLen = infoBytes.length + (infoBytes.length % 2);
        var listLen = 4 + 8 + infoLen, total = 44 + 8 + listLen + dataBytes;
        var buf = new ArrayBuffer(total), v = new DataView(buf), o = 0;
        function str(s) { for (var i = 0; i < s.length; i++) v.setUint8(o++, s.charCodeAt(i)); }
        str('RIFF'); v.setUint32(o, total - 8, true); o += 4; str('WAVE');
        str('fmt '); v.setUint32(o, 16, true); o += 4; v.setUint16(o, 1, true); o += 2; v.setUint16(o, ch, true); o += 2; v.setUint32(o, sr, true); o += 4; v.setUint32(o, sr * ch * 2, true); o += 4; v.setUint16(o, ch * 2, true); o += 2; v.setUint16(o, 16, true); o += 2;
        str('LIST'); v.setUint32(o, listLen, true); o += 4; str('INFO'); str('ISFT'); v.setUint32(o, infoLen, true); o += 4; for (var k = 0; k < infoLen; k++) v.setUint8(o++, k < infoBytes.length ? infoBytes[k] : 0);
        str('data'); v.setUint32(o, dataBytes, true); o += 4;
        var chans = []; for (var c = 0; c < ch; c++) chans.push(ab.getChannelData(c));
        var peak = 0; for (var c2 = 0; c2 < ch; c2++) for (var i2 = 0; i2 < len; i2++) { var a = Math.abs(chans[c2][i2]); if (a > peak) peak = a; }
        var gain = peak > 0.98 ? 0.98 / peak : 1;
        for (var i = 0; i < len; i++) for (var c3 = 0; c3 < ch; c3++) { var s = Math.max(-1, Math.min(1, chans[c3][i] * gain)); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2; }
        return new Blob([buf], { type: 'audio/wav' });
      }
      function exportMidi() {
        var TPQ = 480;
        function vlq(n) { var bytes = [n & 0x7f]; n >>= 7; while (n > 0) { bytes.unshift((n & 0x7f) | 0x80); n >>= 7; } return bytes; }
        function textEv(type, s) { var b = Array.from(new TextEncoder().encode(s)); return [0xff, type].concat(vlq(b.length), b); }
        function track(events) {
          events.sort(function (a, b) { return a.tick - b.tick || a.order - b.order; });
          var out = [], last = 0;
          events.forEach(function (e) { out = out.concat(vlq(Math.max(0, e.tick - last)), e.data); last = e.tick; });
          out = out.concat([0, 0xff, 0x2f, 0]);
          return [0x4d, 0x54, 0x72, 0x6b, (out.length >>> 24) & 255, (out.length >>> 16) & 255, (out.length >>> 8) & 255, out.length & 255].concat(out);
        }
        var usp = Math.round(60000000 / S.bpm);
        var tracks = [track([{ tick: 0, order: 0, data: textEv(0x03, LANG === 'en' ? 'Tempo' : 'Tempo') }, { tick: 0, order: 1, data: [0xff, 0x51, 3, (usp >> 16) & 255, (usp >> 8) & 255, usp & 255] }, { tick: 0, order: 2, data: [0xff, 0x58, 4, 4, 2, 24, 8] }, { tick: 0, order: 3, data: textEv(0x01, 'IRIS GREEN · irisgreen.eu') }])];
        var chanN = 0;
        S.tracks.forEach(function (tr) {
          var chn = tr.kind === 'drums' ? 9 : (chanN === 9 ? ++chanN : chanN); if (tr.kind !== 'drums') chanN = (chanN + 1) % 16;
          var ev = [{ tick: 0, order: 0, data: textEv(0x03, tr.name) }];
          if (tr.kind !== 'drums') ev.push({ tick: 0, order: 1, data: [0xc0 | chn, ((tr.inst || PRESETS[tr.preset] || {}).gm || 0) & 127] });
          tr.clips.forEach(function (cl) { cl.notes.forEach(function (n) {
            if (n.t >= cl.len) return;
            var on = Math.round((cl.start + n.t) * TPQ), off = on + Math.max(1, Math.round(Math.min(n.d, cl.len - n.t) * TPQ)), vel = Math.max(1, Math.min(127, Math.round(n.v * 127)));
            ev.push({ tick: on, order: 3, data: [0x90 | chn, n.p & 127, vel] }); ev.push({ tick: off, order: 2, data: [0x80 | chn, n.p & 127, 0] });
          }); });
          tracks.push(track(ev));
        });
        var header = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 1, (tracks.length >> 8) & 255, tracks.length & 255, (TPQ >> 8) & 255, TPQ & 255];
        var bytes = new Uint8Array(header.concat.apply(header, tracks));
        ctx.download(new Blob([bytes], { type: 'audio/midi' }), (LANG === 'en' ? 'song-' : 'cancion-') + ctx.stamp() + '.mid');
      }
      ctx.addExport(t('exportWav'), exportWav);
      ctx.addExport(t('exportMidi'), exportMidi);

      /* ======================= Herramientas ======================= */
      var playBtn, loopBtn, metroBtn, typeBtn;
      function setPlayUI() { if (!playBtn) return; playBtn.setAttribute('aria-pressed', String(playing)); playBtn.querySelector('.igs-btn-label').textContent = playing ? t('stopBtn') : t('play'); ctx.app.dataset.igsPlaying = String(playing); }
      ctx.setTools([
        { id: 'play', label: t('play'), icon: 'play', primary: true, keys: 'Space', action: function () { play(); } },
        { separator: true },
        { id: 'draw', label: t('toolDraw'), icon: 'pen' },
        { id: 'select', label: t('toolSelect'), icon: 'select' },
        { id: 'erase', label: t('toolErase'), icon: 'erase' },
        { separator: true },
        { id: 'metro', label: t('metronome'), icon: 'music', level: 'more', action: function (b) { metroOn = !metroOn; b.setAttribute('aria-pressed', String(metroOn)); if (playing) schedule(); ctx.announce(metroOn ? t('metroOn') : t('metroOff')); } },
        { id: 'typing', label: t('typing'), icon: 'note', level: 'more', action: function (b) { typing = !typing; b.setAttribute('aria-pressed', String(typing)); ctx.announce(typing ? t('typingOn') : t('typingOff')); ctx.viewport.focus(); } },
        { id: 'zoomIn', label: t('zoomIn'), icon: 'plus', level: 'more', action: function () { view.edPx = Math.min(320, view.edPx * 1.25); view.pxBeat = Math.min(200, view.pxBeat * 1.25); requestRender(); } },
        { id: 'zoomOut', label: t('zoomOut'), icon: 'minus', level: 'more', action: function () { view.edPx = Math.max(16, view.edPx / 1.25); view.pxBeat = Math.max(8, view.pxBeat / 1.25); requestRender(); } }
      ], { initial: 'draw' });
      playBtn = ctx.toolbar.querySelector('.igs-primary'); playBtn.setAttribute('aria-pressed', 'false');
      Array.prototype.forEach.call(ctx.toolbar.querySelectorAll('.igs-btn'), function (b) { var l = b.textContent; if (l === t('metronome') || l === t('typing')) b.setAttribute('aria-pressed', 'false'); });
      ctx.command('play', t('play') + ' / ' + t('stopBtn'), '', play);
      ctx.command('wav', t('exportWav'), '', exportWav); ctx.command('midi', t('exportMidi'), '', exportMidi);

      S = { v: 1, bpm: 100, bars: 2, loop: [0, 8], grid: 0.25, tracks: [] };
      return {
        serialize: function () { return { v: 1, bpm: S.bpm, bars: S.bars, loop: S.loop.slice(), grid: S.grid, seq: seq, tracks: JSON.parse(JSON.stringify(S.tracks)), sel: [selTrack, selClip] }; },
        restore: function (st) {
          var wasPlaying = playing; if (playing) stopPlay();
          var keepVoices = S.tracks.length === st.tracks.length && S.tracks.every(function (x, i) { return x.id === st.tracks[i].id && x.kind === st.tracks[i].kind && x.preset === st.tracks[i].preset && JSON.stringify(x.inst) === JSON.stringify(st.tracks[i].inst); });
          S = { v: 1, bpm: st.bpm, bars: st.bars, loop: st.loop.slice(), grid: st.grid, tracks: JSON.parse(JSON.stringify(st.tracks)) }; seq = Math.max(seq, st.seq || 0);
          selTrack = st.sel && trackById(st.sel[0]) ? st.sel[0] : (S.tracks[0] ? S.tracks[0].id : null); selClip = st.sel && clipById(st.sel[1]) ? st.sel[1] : null; selNotes = [];
          if (!keepVoices) rebuildVoices(); else applyMix();
          renderSide(); requestRender();
        },
        validate: function (d) {
          return d && isFinite(d.bpm) && d.bpm >= 20 && d.bpm <= 300 && isFinite(d.bars) && d.bars >= 1 && d.bars <= 64 && Array.isArray(d.tracks) && d.tracks.length >= 1 && d.tracks.length <= 16 &&
            d.tracks.every(function (tr) { return tr && typeof tr.id === 'string' && (tr.kind === 'drums' || (tr.kind === 'synth' && PRESETS[tr.preset])) && Array.isArray(tr.clips) && tr.clips.length <= 128 &&
              tr.clips.every(function (c) { return c && isFinite(c.start) && isFinite(c.len) && c.len > 0 && Array.isArray(c.notes) && c.notes.length <= 4096 && c.notes.every(function (n) { return n && isFinite(n.t) && isFinite(n.d) && isFinite(n.p) && n.p >= 0 && n.p <= 127 && isFinite(n.v); }); }); });
        },
        start: function (id) {
          if (id === 'empty') { seq = 0; S = { v: 1, bpm: 100, bars: 4, loop: [0, 16], grid: 0.25, tracks: [] }; selTrack = null; addTrack(MODE === 'rhythm' ? 'drums' : MODE === 'synth' ? 'pad' : 'piano'); ctx.resetHistory(); return; }
          fromExample(id);
        },
        onKey: onKey
      };
    }
  }
})(window);

