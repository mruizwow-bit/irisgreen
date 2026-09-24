/* Iris Green · Sonidos y música creados en la propia página (Web Audio).
   Sin grabaciones, sin archivos, sin red y sin licencias de terceros. Nada suena hasta que la persona lo pide.
   API: IGSonidos.catalog · IGSonidos.start(id) → { out: GainNode, stop(segundos) } */
(function () {
  'use strict';
  var ctx = null, bus = null, verb = null, verbIn = null, NB = {};
  function R(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }

  function context() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC();
    bus = ctx.createDynamicsCompressor();             // evita picos: todo queda suave y parejo
    bus.threshold.value = -18; bus.knee.value = 20; bus.ratio.value = 3; bus.attack.value = 0.01; bus.release.value = 0.4;
    bus.connect(ctx.destination);
    verb = ctx.createConvolver(); verb.buffer = impulse(3.2, 2.6);
    verbIn = ctx.createGain(); verbIn.gain.value = 1; verbIn.connect(verb); verb.connect(bus);
    return ctx;
  }
  function impulse(sec, decay) {
    var len = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = b.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }
  function noiseBuf(kind) {
    if (NB[kind]) return NB[kind];
    var len = ctx.sampleRate * 8, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = b.getChannelData(c), b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
      for (var i = 0; i < len; i++) {
        var w = Math.random() * 2 - 1;
        if (kind === 'white') d[i] = w * 0.5;
        else if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
        else { // rosa (Paul Kellet)
          b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
          b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
        }
      }
    }
    NB[kind] = b; return b;
  }

  /* Cada sonido construye su grafo dentro de un «voice» que sabe pararse solo */
  function Voice(wet) {
    var v = { nodes: [], timers: [], alive: true };
    v.out = ctx.createGain(); v.out.gain.value = 1;
    v.dry = ctx.createGain(); v.dry.connect(v.out);
    v.send = ctx.createGain(); v.send.gain.value = wet || 0.15; v.dry.connect(v.send);
    v.out.connect(bus); v.send.connect(verbIn);
    v.keep = function (n) { v.nodes.push(n); return n; };
    v.every = function (fn, ms) { var id = setInterval(function () { if (v.alive) fn(); }, ms); v.timers.push(id); fn(); };
    v.noise = function (kind, dest) { var s = ctx.createBufferSource(); s.buffer = noiseBuf(kind); s.loop = true; s.loopStart = R(0, 2); s.start(0, R(0, 7)); v.keep(s); if (dest) s.connect(dest); return s; };
    v.filter = function (type, f, q, dest) { var x = ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; if (q) x.Q.value = q; if (dest) x.connect(dest); return x; };
    v.gain = function (g, dest) { var x = ctx.createGain(); x.gain.value = g; if (dest) x.connect(dest); return x; };
    v.pan = function (p, dest) { if (!ctx.createStereoPanner) return v.gain(1, dest); var x = ctx.createStereoPanner(); x.pan.value = p; if (dest) x.connect(dest); return x; };
    v.walk = function (param, lo, hi, minS, maxS) {     // paseo aleatorio suave de un parámetro
      function go() { if (!v.alive) return; param.setTargetAtTime(R(lo, hi), ctx.currentTime, R(minS, maxS) / 3); v.timers.push(setTimeout(go, R(minS, maxS) * 1000)); }
      go();
    };
    v.stop = function (sec) {
      if (!v.alive) return; v.alive = false;
      v.timers.forEach(function (id) { clearInterval(id); clearTimeout(id); });
      var t = ctx.currentTime, f = sec === undefined ? 1.5 : sec;
      v.out.gain.cancelScheduledValues(t); v.out.gain.setValueAtTime(v.out.gain.value, t); v.out.gain.linearRampToValueAtTime(0, t + f);
      setTimeout(function () { v.nodes.forEach(function (n) { try { n.stop(); } catch (e) {} }); try { v.out.disconnect(); v.send.disconnect(); } catch (e) {} }, f * 1000 + 3500);
    };
    return v;
  }
  /* planificador: llama a fn(t) con eventos por delante del reloj de audio */
  function schedule(v, rate, fn) {
    var next = ctx.currentTime + 0.1;
    v.every(function () { var until = ctx.currentTime + 0.25; while (next < until) { fn(next); next += rate(); } }, 60);
  }
  function burst(v, t, dur, type, f, q, g, pan, src) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf(src || 'white');
    var fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    var e = ctx.createGain(); e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + Math.min(0.004, dur / 3)); e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    var p = v.pan(pan);
    s.connect(fl); fl.connect(e); e.connect(p); p.connect(v.dry);
    s.start(t, R(0, 7), dur + 0.05);
  }
  function tone(v, t, f, dur, g, type, pan, dest) {
    var o = ctx.createOscillator(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    var e = ctx.createGain(); e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + 0.006); e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    var p = v.pan(pan || 0); o.connect(e); e.connect(p); p.connect(dest || v.dry);
    o.start(t); o.stop(t + dur + 0.05);
    return o;
  }

  /* ---------- Naturaleza ---------- */
  function rain(v, level, window_) {
    var bed = v.gain(0.55 * level, v.dry);
    var hp = v.filter('highpass', 350, 0.5), lp = v.filter('lowpass', window_ ? 5200 : 7500, 0.4, bed); hp.connect(lp);
    v.noise('pink', hp);
    v.walk(bed.gain, 0.42 * level, 0.62 * level, 1.5, 4);
    var rum = v.gain(0.3 * level, v.dry); v.noise('brown', v.filter('lowpass', 220, 0.5, rum));
    schedule(v, function () { return R(0.006, 0.03); }, function (t) {        // gotas sueltas
      burst(v, t, R(0.006, 0.02), 'bandpass', R(1800, 6500), R(0.8, 2.5), R(0.02, 0.09) * level, R(-0.9, 0.9));
    });
    if (window_) schedule(v, function () { return R(0.15, 0.6); }, function (t) {  // gotas en el cristal
      tone(v, t, R(1600, 3400), R(0.03, 0.07), R(0.015, 0.05) * level, 'sine', R(-0.6, 0.6));
      burst(v, t, 0.012, 'bandpass', R(3000, 5000), 2, 0.05 * level, R(-0.6, 0.6));
    });
  }
  function waves(v, level) {
    [-0.5, 0.5].forEach(function (pan, k) {
      var g = v.gain(0.0001, v.pan(pan, v.dry)), lp = v.filter('lowpass', 400, 0.6, g);
      var mix = v.gain(1, lp); v.noise('brown', v.gain(0.9, mix)); v.noise('pink', v.gain(0.35, mix));
      function wave() {
        if (!v.alive) return;
        var t = ctx.currentTime + 0.05, rise = R(3, 4.5), fall = R(3.5, 5.5), peak = R(0.65, 1) * level;
        g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(peak, t, rise / 3);
        lp.frequency.cancelScheduledValues(t); lp.frequency.setTargetAtTime(R(1500, 2600), t, rise / 3);
        g.gain.setTargetAtTime(0.14 * level, t + rise, fall / 3);
        lp.frequency.setTargetAtTime(R(350, 550), t + rise, fall / 2.5);
        v.timers.push(setTimeout(wave, (rise + fall + R(0.5, 2.5)) * 1000));
      }
      v.timers.push(setTimeout(wave, k * R(2500, 4500)));
    });
    var hiss = v.gain(0.06 * level, v.dry); v.noise('pink', v.filter('highpass', 2500, 0.5, hiss)); v.walk(hiss.gain, 0.02 * level, 0.09 * level, 2, 5);
  }
  function stream(v, level) {
    var base = v.gain(0.35 * level, v.dry); v.noise('brown', v.filter('lowpass', 500, 0.5, base));
    for (var i = 0; i < 7; i++) {
      var g = v.gain(0.22 * level, v.pan(R(-0.8, 0.8), v.dry));
      var bp = v.filter('bandpass', R(350, 2600), R(4, 12), g);
      v.noise('pink', bp);
      v.walk(bp.frequency, 300 + i * 150, 900 + i * 380, 0.08, 0.35);   // borboteo: la resonancia cambia muy rápido
      v.walk(g.gain, 0.05 * level, 0.35 * level, 0.1, 0.5);
    }
    var spl = v.gain(0.05 * level, v.dry); v.noise('white', v.filter('highpass', 3500, 0.5, spl)); v.walk(spl.gain, 0.02 * level, 0.07 * level, 0.3, 1.2);
  }
  function wind(v, level) {
    var g = v.gain(0.4 * level, v.dry), bp = v.filter('bandpass', 500, 0.9, g);
    v.noise('pink', bp); v.noise('brown', v.gain(0.8, bp));
    v.walk(bp.frequency, 250, 950, 2, 6); v.walk(g.gain, 0.15 * level, 0.6 * level, 2.5, 7);
    var wh = v.gain(0.0, v.dry), wb = v.filter('bandpass', 900, 14, wh); v.noise('pink', wb);
    v.walk(wb.frequency, 600, 1400, 3, 8); v.walk(wh.gain, 0.0, 0.12 * level, 3, 9);
  }
  function birds(v, level) {
    function call(t) {
      var pan = R(-0.9, 0.9), sp = (Math.random() * 4) | 0, n, i, f;
      if (sp === 0) { n = (R(3, 6)) | 0; for (i = 0; i < n; i++) { var o = tone(v, t + i * 0.14, R(2600, 3000), 0.1, 0.05 * level, 'sine', pan); o.frequency.exponentialRampToValueAtTime(R(3800, 4600), t + i * 0.14 + 0.08); } }
      else if (sp === 1) { var tr = tone(v, t, R(4500, 5500), 0.45, 0.035 * level, 'sine', pan); var am = ctx.createOscillator(), ag = ctx.createGain(); am.frequency.value = R(22, 34); ag.gain.value = 400; am.connect(ag); ag.connect(tr.frequency); am.start(t); am.stop(t + 0.5); }
      else if (sp === 2) { f = R(2800, 3400); var a = tone(v, t, f, 0.22, 0.05 * level, 'sine', pan); a.frequency.linearRampToValueAtTime(f * 0.72, t + 0.2); var b = tone(v, t + 0.32, f * 0.95, 0.3, 0.045 * level, 'sine', pan); b.frequency.linearRampToValueAtTime(f * 0.7, t + 0.6); }
      else { n = (R(2, 4)) | 0; for (i = 0; i < n; i++) { var c = tone(v, t + i * 0.09, R(5000, 6200), 0.05, 0.03 * level, 'sine', pan); c.frequency.exponentialRampToValueAtTime(R(3000, 3600), t + i * 0.09 + 0.05); } }
    }
    schedule(v, function () { return R(1.2, 5); }, call);
  }
  function crickets(v, level) {
    [[4300, -0.6], [4650, 0.5], [4480, 0.1]].forEach(function (c, k) {
      var next = ctx.currentTime + R(0.2, 1);
      v.every(function () {
        var until = ctx.currentTime + 0.3;
        while (next < until) {
          for (var p = 0; p < 3; p++) tone(v, next + p * 0.045, c[0], 0.028, (k === 2 ? 0.012 : 0.022) * level, 'sine', c[1]);
          next += R(0.55, 0.85) * (k === 2 ? 1.6 : 1);
        }
      }, 60);
    });
  }
  function fire(v, level) {
    var g = v.gain(0.45 * level, v.dry), lp = v.filter('lowpass', 520, 0.5, g); v.noise('brown', lp); v.walk(g.gain, 0.3 * level, 0.55 * level, 0.3, 1.5);
    schedule(v, function () { return Math.random() < 0.15 ? R(0.01, 0.04) : R(0.06, 0.35); }, function (t) {
      if (Math.random() < 0.85) burst(v, t, R(0.002, 0.008), 'highpass', R(1500, 4000), 0.7, R(0.03, 0.14) * level, R(-0.5, 0.5));
      else burst(v, t, R(0.02, 0.05), 'bandpass', R(300, 900), 1.5, R(0.08, 0.2) * level, R(-0.4, 0.4), 'pink');
    });
  }
  function softNoise(v, level, kind) { var g = v.gain((kind === 'brown' ? 0.55 : 0.4) * level, v.dry); v.noise(kind, v.filter('lowpass', kind === 'brown' ? 900 : 6000, 0.4, g)); }
  function aquariumHum(v, level, many) {
    var g = v.gain(0.5 * level, v.dry), lp = v.filter('lowpass', many ? 300 : 420, 0.5, g); v.noise('brown', lp);
    v.walk(lp.frequency, 220, 520, 3, 8);
    schedule(v, function () { return many ? R(0.4, 1.4) : R(1.2, 4); }, function (t) {
      var f0 = R(280, 800), o = tone(v, t, f0, 0.16, R(0.02, 0.05) * level, 'sine', R(-0.5, 0.5)); o.frequency.exponentialRampToValueAtTime(f0 * R(1.6, 2.6), t + 0.09);
    });
  }

  /* ---------- Música generada ---------- */
  var SCALES = [[0, 2, 4, 7, 9], [0, 2, 5, 7, 9], [0, 3, 5, 7, 10]];
  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function pianoNote(v, t, f, g, pan) {
    var p = v.pan(pan || 0, v.dry), lp = v.filter('lowpass', Math.min(9000, f * 8), 0.3, p);
    lp.frequency.setValueAtTime(Math.min(9000, f * 10), t); lp.frequency.exponentialRampToValueAtTime(Math.max(300, f * 2), t + 2.5);
    for (var h = 1; h <= 6; h++) {
      var fh = f * h * (1 + 0.0004 * h * h), o = ctx.createOscillator(), e = ctx.createGain(), amp = g / Math.pow(h, 1.6), dec = 4.5 / Math.pow(h, 0.7);
      o.frequency.value = fh; e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(amp, t + 0.004); e.gain.exponentialRampToValueAtTime(0.0001, t + dec);
      o.connect(e); e.connect(lp); o.start(t); o.stop(t + dec + 0.1);
    }
  }
  function piano(v, level) {
    var root = pick([57, 60, 62, 55]), sc = pick(SCALES), deg = 7, bars = 0;
    function noteAt(d) { var o = Math.floor(d / 5), s = ((d % 5) + 5) % 5; return root + 12 * o + sc[s]; }
    schedule(v, function () { return pick([0.9, 1.2, 1.2, 1.8, 2.4]) * R(0.95, 1.05); }, function (t) {
      if (Math.random() < 0.12) return;                           // silencios
      deg = Math.max(3, Math.min(13, deg + pick([-2, -1, -1, 0, 1, 1, 2])));
      pianoNote(v, t, midi(noteAt(deg)), 0.11 * level, R(-0.25, 0.25));
      if (++bars % 4 === 0) { var b = noteAt(Math.max(0, deg - 7) - (deg % 5)); pianoNote(v, t, midi(b - 12), 0.08 * level, -0.1); pianoNote(v, t + 0.02, midi(b - 5), 0.05 * level, 0.1); }
      if (Math.random() < 0.02) { root = pick([57, 60, 62, 55]); }
    });
  }
  function pads(v, level, low) {
    var voices = [], base = low ? 45 : 57, sc = SCALES[0];
    var lp = v.filter('lowpass', low ? 600 : 1100, 0.7, v.gain(1, v.dry)); v.walk(lp.frequency, low ? 400 : 700, low ? 800 : 1500, 6, 14);
    for (var i = 0; i < 4; i++) for (var d = 0; d < 2; d++) {
      var o = ctx.createOscillator(); o.type = d ? 'triangle' : 'sawtooth'; o.detune.value = d ? 6 : -6;
      var g = v.gain((d ? 0.05 : 0.012) * level, lp); o.connect(g); o.start(); v.keep(o); voices.push(o);
    }
    var CH = [[0, 4, 7, 11], [9, 12, 16, 19], [5, 9, 12, 16], [7, 11, 14, 19], [2, 5, 9, 12]];
    function next() {
      if (!v.alive) return;
      var c = pick(CH), t = ctx.currentTime;
      voices.forEach(function (o, i) { o.frequency.setTargetAtTime(midi(base + c[i >> 1]), t, 2.5); });
      v.timers.push(setTimeout(next, R(11, 16) * 1000));
    }
    next();
  }
  function bowls(v, level) {
    var RATIOS = [1, 2.71, 5.12, 8.4], AMPS = [1, 0.45, 0.2, 0.08], DEC = [14, 10, 6, 4];
    schedule(v, function () { return R(9, 16); }, function (t) {
      var f0 = pick([146.8, 164.8, 196, 220, 174.6]), pan = R(-0.4, 0.4);
      for (var i = 0; i < 4; i++) for (var b = 0; b < 2; b++) {
        var o = ctx.createOscillator(), e = ctx.createGain(), p = v.pan(pan, v.dry);
        o.frequency.value = f0 * RATIOS[i] + (b ? R(0.4, 1.2) : 0);
        e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(0.06 * AMPS[i] * level, t + 0.01); e.gain.exponentialRampToValueAtTime(0.0001, t + DEC[i]);
        o.connect(e); e.connect(p); o.start(t); o.stop(t + DEC[i] + 0.1);
      }
    });
  }

  var BUILD = {
    'lluvia': function (v) { rain(v, 1, false); },
    'lluvia-ventana': function (v) { rain(v, 0.85, true); },
    'olas': function (v) { waves(v, 1); },
    'rio': function (v) { stream(v, 1); },
    'viento': function (v) { wind(v, 1); },
    'pajaros': function (v) { wind(v, 0.25); birds(v, 1); },
    'grillos': function (v) { wind(v, 0.2); crickets(v, 1); },
    'fuego': function (v) { fire(v, 1); },
    'ruido-rosa': function (v) { softNoise(v, 1, 'pink'); },
    'ruido-marron': function (v) { softNoise(v, 1, 'brown'); },
    'piano': function (v) { piano(v, 1); },
    'ambiental': function (v) { pads(v, 1, false); },
    'cuencos': function (v) { bowls(v, 1); },
    // mezclas de las escenas
    'escena-acuario': function (v) { aquariumHum(v, 1, false); },
    'escena-burbujas': function (v) { aquariumHum(v, 0.8, true); },
    'escena-medusas': function (v) { aquariumHum(v, 0.6, false); pads(v, 0.7, true); },
    'escena-fibra': function (v) { pads(v, 0.9, false); },
    'escena-mar': function (v) { waves(v, 1); },
    'escena-lluvia': function (v) { rain(v, 0.9, true); },
    'escena-rio': function (v) { stream(v, 0.9); birds(v, 0.6); wind(v, 0.15); },
    'escena-noche': function (v) { crickets(v, 0.8); wind(v, 0.3); pads(v, 0.35, true); }
  };
  /* igualar el volumen percibido entre sonidos (medido en dB, ver memoria) */
  var TRIM = { 'pajaros': 3.2, 'grillos': 3.6, 'cuencos': 3.0, 'piano': 1.7, 'escena-noche': 2.2, 'olas': 0.72, 'escena-mar': 0.68, 'viento': 1.3, 'ambiental': 1.1 };
  var WET = { 'piano': 0.45, 'ambiental': 0.5, 'cuencos': 0.6, 'pajaros': 0.35, 'escena-rio': 0.25, 'escena-noche': 0.35, 'escena-fibra': 0.45, 'escena-medusas': 0.4 };

  var catalog = [
    { id: 'lluvia', fam: 'nat', es: 'Lluvia', en: 'Rain', des: 'Lluvia constante, sin truenos', den: 'Steady rain, no thunder' },
    { id: 'lluvia-ventana', fam: 'nat', es: 'Lluvia en la ventana', en: 'Rain on the window', des: 'Gotas que golpean el cristal', den: 'Drops tapping on the glass' },
    { id: 'olas', fam: 'nat', es: 'Olas del mar', en: 'Sea waves', des: 'Olas que llegan y se van despacio', den: 'Waves that come and go slowly' },
    { id: 'rio', fam: 'nat', es: 'Río', en: 'Stream', des: 'Agua que corre entre piedras', den: 'Water running over stones' },
    { id: 'viento', fam: 'nat', es: 'Viento suave', en: 'Gentle wind', des: 'Brisa que sube y baja', den: 'A breeze that rises and falls' },
    { id: 'pajaros', fam: 'nat', es: 'Pájaros en el bosque', en: 'Birds in the forest', des: 'Cantos lejanos y brisa', den: 'Distant birdsong and a breeze' },
    { id: 'grillos', fam: 'nat', es: 'Grillos de noche', en: 'Crickets at night', des: 'Noche tranquila de verano', den: 'A calm summer night' },
    { id: 'fuego', fam: 'nat', es: 'Chimenea', en: 'Fireplace', des: 'Fuego bajo que crepita', den: 'A low, crackling fire' },
    { id: 'ruido-rosa', fam: 'ruido', es: 'Ruido rosa', en: 'Pink noise', des: 'Sonido parejo, parecido a la lluvia fina', den: 'An even sound, like light rain' },
    { id: 'ruido-marron', fam: 'ruido', es: 'Ruido marrón', en: 'Brown noise', des: 'Sonido grave y envolvente', den: 'A deep, enveloping sound' },
    { id: 'piano', fam: 'mus', es: 'Piano suave', en: 'Soft piano', des: 'Notas lentas que nunca se repiten igual', den: 'Slow notes that never repeat the same way' },
    { id: 'ambiental', fam: 'mus', es: 'Música ambiental', en: 'Ambient music', des: 'Acordes largos y cálidos', den: 'Long, warm chords' },
    { id: 'cuencos', fam: 'mus', es: 'Cuencos', en: 'Singing bowls', des: 'Un cuenco que suena de vez en cuando', den: 'A bowl that rings now and then' }
  ];

  /* level: volumen final (0–1); fade: segundos para llegar a él (empieza bajito) */
  function start(id, level, fade) {
    if (!context() || !BUILD[id]) return null;
    var v = Voice(WET[id]);
    BUILD[id](v);
    var trim = TRIM[id] || 1, t = ctx.currentTime; v.out.gain.setValueAtTime(0, t); v.out.gain.linearRampToValueAtTime((level === undefined ? 0.5 : level) * trim, t + (fade === undefined ? 4 : fade));
    return {
      out: v.out, stop: v.stop,
      setLevel: function (l) { v.out.gain.cancelScheduledValues(ctx.currentTime); v.out.gain.setTargetAtTime(l * trim, ctx.currentTime, 0.15); }
    };
  }
  window.IGSonidos = { catalog: catalog, start: start, context: context, supported: !!(window.AudioContext || window.webkitAudioContext) };
})();
