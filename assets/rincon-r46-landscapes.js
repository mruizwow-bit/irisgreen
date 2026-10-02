/* R46-CLAUDE · Paisajes largos · embeds autorizados youtube-nocookie.
   Nada se descarga, nada se re-aloja, nada arranca solo.
   El reproductor va SIEMPRE en silencio: el sonido, si la persona lo quiere,
   es el de Iris Green (window.IGSonidos) y nunca se mezcla con el del video. */
(function (window, document) {
  'use strict';

  var ORIGIN_PROD = 'https://irisgreen.eu';

  /* Catalogo prioritario. Cada ficha lleva su estado de control humano:
     'candidato'  = pasa el filtro tecnico, pendiente de ad gate y de HUMAN QA
     'aprobado'   = ad gate superado y revision editorial hecha
     'no-disponible' = el video dejo de permitir incrustacion */
  var CATALOG = [
    { id: 'playa',   es: 'Playa',   en: 'Beach',
      des: 'Una sola orilla, cámara fija, oleaje continuo',
      den: 'A single shore, fixed camera, continuous surf',
      audio: 'escena-mar', minutes: 720, estado: 'candidato',
      video: 'KIjSUAvm8EI',
      tono: ['#12303f', '#2a6079', '#8fc0d4'] },
    { id: 'rio',     es: 'Río',     en: 'River',
      des: 'Corriente de bosque, plano fijo, sin cortes',
      den: 'Forest stream, fixed shot, no cuts',
      audio: 'escena-rio', minutes: 600, estado: 'candidato',
      video: 'mv6fre-v1vE',
      tono: ['#12291f', '#2f5b41', '#9ec7a8'] },
    { id: 'lluvia',  es: 'Lluvia',  en: 'Rain',
      des: 'Lluvia sobre cristal, sin tormenta ni relámpagos',
      den: 'Rain on glass, no storm and no lightning',
      audio: 'lluvia-ventana', minutes: 660, estado: 'candidato',
      video: 'g0CVa9DAv-s',
      tono: ['#141b24', '#33475c', '#9aaec4'] },
    { id: 'noche',   es: 'Noche',   en: 'Night',
      des: 'Cielo nocturno muy lento, sin destellos',
      den: 'Very slow night sky with no flashes',
      audio: 'escena-noche', minutes: 600, estado: 'candidato',
      video: '-ozV9or0gMY',
      tono: ['#0b1020', '#1e2b4d', '#8f9ec6'] },
    { id: 'acuario', es: 'Acuario', en: 'Aquarium',
      des: 'Un solo acuario, cámara quieta, sin música',
      den: 'A single tank, still camera, no music',
      audio: 'escena-acuario', minutes: 720, estado: 'candidato',
      video: 'cExYJVF3f6I',
      tono: ['#0d2430', '#1f5a6b', '#8ecbd6'] },
    { id: 'medusas', es: 'Medusas', en: 'Jellyfish',
      des: 'Desplazamiento lento y continuo bajo el agua',
      den: 'Slow continuous drift underwater',
      audio: 'escena-medusas', minutes: 600, estado: 'candidato',
      video: 'uHcgQ_MALmg',
      tono: ['#171029', '#3d2a5e', '#b7a2d6'] }
  ];

  var DURATIONS = [
    { id: 'cont', es: 'Continuo', en: 'Continuous', sec: 0 },
    { id: '10',   es: '10 minutos', en: '10 minutes', sec: 600 },
    { id: '20',   es: '20 minutos', en: '20 minutes', sec: 1200 },
    { id: '30',   es: '30 minutos', en: '30 minutes', sec: 1800 },
    { id: '60',   es: '60 minutos', en: '60 minutes', sec: 3600 }
  ];

  /* Cartel previo de origen propio. No se usa ninguna imagen de YouTube:
     se dibuja aqui, sin peticiones de red y sin terceros. */
  function poster(entry) {
    var t = entry.tono;
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">',
      '<defs>',
      '<linearGradient id="g" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="', t[1], '"/>',
      '<stop offset="0.62" stop-color="', t[0], '"/>',
      '<stop offset="1" stop-color="', t[0], '"/>',
      '</linearGradient>',
      '<radialGradient id="h" cx="0.28" cy="0.24" r="0.72">',
      '<stop offset="0" stop-color="', t[2], '" stop-opacity="0.34"/>',
      '<stop offset="1" stop-color="', t[2], '" stop-opacity="0"/>',
      '</radialGradient>',
      '</defs>',
      '<rect width="160" height="90" fill="url(#g)"/>',
      '<rect width="160" height="90" fill="url(#h)"/>',
      '<g fill="none" stroke="', t[2], '" stroke-opacity="0.16" stroke-width="0.7">',
      '<path d="M0 60 C 32 55, 56 65, 84 60 S 132 54, 160 59"/>',
      '<path d="M0 68 C 30 64, 58 73, 86 68 S 134 62, 160 67"/>',
      '<path d="M0 76 C 34 72, 60 80, 88 76 S 136 71, 160 75"/>',
      '</g>',
      '</svg>'
    ].join('');
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function embedSrc(videoId) {
    var o = (location.protocol === 'https:' ? location.origin : ORIGIN_PROD);
    return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) +
      '?rel=0&playsinline=1&mute=1&modestbranding=1&iv_load_policy=3' +
      '&disablekb=1&fs=0&controls=0&enablejsapi=1&origin=' + encodeURIComponent(o);
  }

  function saveData() {
    try { return !!(navigator.connection && navigator.connection.saveData); } catch (e) { return false; }
  }

  function create(host, opts) {
    opts = opts || {};
    var lang = opts.lang === 'en' ? 'en' : 'es';
    var listeners = {};
    var frame = null, current = null, sound = null, timer = 0, startedAt = 0;
    var durationSec = 0, destroyed = false, ready = false, unavailableTimer = 0;
    var posterEl = null;

    function emit(n, d) { (listeners[n] || []).forEach(function (f) { try { f(d); } catch (_) {} }); }
    function txt(e, k) { return lang === 'en' ? e[k + 'n'] || e.en : e[k + 's'] || e.es; }

    function post(func, args) {
      if (!frame || !frame.contentWindow) return;
      try {
        frame.contentWindow.postMessage(JSON.stringify({
          event: 'command', func: func, args: args || []
        }), 'https://www.youtube-nocookie.com');
      } catch (_) {}
    }

    function onMessage(ev) {
      if (!frame || ev.source !== frame.contentWindow) return;
      if (ev.origin.indexOf('youtube-nocookie.com') < 0 && ev.origin.indexOf('youtube.com') < 0) return;
      var d; try { d = JSON.parse(ev.data); } catch (_) { return; }
      if (!d) return;
      if (d.event === 'onReady' || (d.info && typeof d.info.playerState === 'number')) {
        if (!ready) {
          ready = true;
          window.clearTimeout(unavailableTimer);
          post('mute'); /* el silencio del reproductor no es opcional */
          emit('ready', { scene: current && current.id });
        }
      }
      if (d.info && typeof d.info.playerState === 'number') {
        post('mute');
        if (d.info.playerState === 0) post('playVideo'); /* continuidad sin corte visible */
      }
      if (d.event === 'onError' || (d.info && d.info.errorCode)) markUnavailable('EMBED_ERROR');
    }

    function markUnavailable(reason) {
      if (current) current.estado = 'no-disponible';
      emit('unavailable', { scene: current && current.id, reason: reason || 'EMBED_BLOCKED' });
      teardownFrame();
    }

    function teardownFrame() {
      if (frame) {
        try { post('stopVideo'); } catch (_) {}
        if (frame.parentNode) frame.parentNode.removeChild(frame);
        frame = null;
      }
      ready = false;
      window.clearTimeout(unavailableTimer);
      if (posterEl) posterEl.hidden = false;
    }

    function stopSound(fade) {
      if (sound) { try { sound.stop(fade == null ? 2.4 : fade); } catch (_) {} sound = null; }
    }

    var api = {
      catalog: CATALOG,
      durations: DURATIONS,

      mount: function () {
        posterEl = document.createElement('div');
        posterEl.className = 'r46-land-poster';
        posterEl.setAttribute('role', 'img');
        host.appendChild(posterEl);
        api.preview(CATALOG[0].id);
        window.addEventListener('message', onMessage);
        return api;
      },

      /* Antes de pulsar no existe ningun iframe ni ninguna conexion a YouTube. */
      preview: function (sceneId) {
        var e = CATALOG.filter(function (x) { return x.id === sceneId; })[0];
        if (!e || !posterEl) return api;
        current = e;
        posterEl.hidden = false;
        posterEl.style.backgroundImage = 'url("' + poster(e) + '")';
        posterEl.setAttribute('aria-label', (lang === 'en' ? e.en : e.es) + '. ' + txt(e, 'de'));
        emit('preview', { scene: e.id, estado: e.estado });
        return api;
      },

      /* Solo tras una accion explicita de la persona. */
      play: function (sceneId, o) {
        o = o || {};
        var e = CATALOG.filter(function (x) { return x.id === sceneId; })[0];
        if (!e) return api;
        if (e.estado === 'no-disponible') { emit('unavailable', { scene: e.id, reason: 'MARKED' }); return api; }
        if (saveData() && !o.forceData) { emit('savedata', { scene: e.id }); return api; }

        teardownFrame();
        current = e;
        durationSec = o.duration != null ? o.duration : durationSec;

        frame = document.createElement('iframe');
        frame.className = 'r46-land-frame';
        frame.title = (lang === 'en' ? e.en : e.es);
        frame.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
        frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        frame.setAttribute('loading', 'eager');
        frame.setAttribute('tabindex', '-1');
        frame.setAttribute('aria-hidden', 'true');
        frame.setAttribute('scrolling', 'no');
        frame.src = embedSrc(e.video);
        host.appendChild(frame);

        frame.addEventListener('load', function () {
          try {
            frame.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), 'https://www.youtube-nocookie.com');
          } catch (_) {}
          post('mute'); post('playVideo');
          window.setTimeout(function () { if (posterEl) posterEl.hidden = true; }, 900);
        });

        /* si en 12 s no hay senal de vida, el video no se puede incrustar */
        unavailableTimer = window.setTimeout(function () {
          if (!ready) markUnavailable('NO_RESPONSE');
        }, 12000);

        startedAt = Date.now();
        window.clearTimeout(timer);
        if (durationSec > 0) {
          timer = window.setTimeout(function () { api.stop(); }, durationSec * 1000);
        }
        emit('play', { scene: e.id, duration: durationSec });
        return api;
      },

      /* El audio de Iris Green es independiente y nunca se mezcla con el video. */
      sound: function (on, level) {
        if (!on) { stopSound(); emit('sound', { on: false }); return api; }
        if (!window.IGSonidos || !window.IGSonidos.supported) { emit('sound', { on: false, unsupported: true }); return api; }
        stopSound(0.6);
        var id = current ? current.audio : 'escena-mar';
        sound = window.IGSonidos.start(id, level == null ? 0.18 : level, 2.6);
        emit('sound', { on: true, id: id });
        return api;
      },
      soundLevel: function (v) { if (sound && sound.setLevel) sound.setLevel(v); return api; },

      setDuration: function (sec) {
        durationSec = sec > 0 ? sec : 0;
        window.clearTimeout(timer);
        if (durationSec > 0 && frame) {
          var left = durationSec - (Date.now() - startedAt) / 1000;
          if (left <= 0) api.stop();
          else timer = window.setTimeout(function () { api.stop(); }, left * 1000);
        }
        return api;
      },

      elapsed: function () { return frame ? (Date.now() - startedAt) / 1000 : 0; },

      stop: function () {
        window.clearTimeout(timer);
        teardownFrame();
        stopSound(3.2);
        emit('stop', { scene: current && current.id });
        return api;
      },

      on: function (n, f) { (listeners[n] = listeners[n] || []).push(f); return api; },

      destroy: function () {
        destroyed = true;
        window.clearTimeout(timer);
        window.removeEventListener('message', onMessage);
        teardownFrame();
        stopSound(0.4);
        if (posterEl && posterEl.parentNode) posterEl.parentNode.removeChild(posterEl);
        posterEl = null; listeners = {};
      }
    };
    return api;
  }

  window.IGPaisajes46 = {
    create: create,
    catalog: CATALOG,
    durations: DURATIONS,
    poster: poster,
    embedSrc: embedSrc,
    kind: 'R46_LANDSCAPES_AUTHORISED_EMBED',
    provenance: 'docs/r53/PAISAJES_PROCEDENCIA.json',
    policy: {
      source: 'youtube-nocookie.com',
      download: false,
      rehost: false,
      playerAudio: 'always-muted',
      irisAudio: 'separate-and-optional',
      posterOrigin: 'first-party-inline-svg',
      preconnect: false,
      iframeOnEntry: false,
      autoplayOnLoad: false
    },
    csp: {
      requirement: 'frame-src https://www.youtube-nocookie.com',
      alreadyPresentInBase: true,
      note: 'La politica del sitio ya lo incluye en _headers desde la base de A2. No hace falta ningun cambio.'
    }
  };
})(window, document);
