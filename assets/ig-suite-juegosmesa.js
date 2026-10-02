/* Iris Green · El taller · Estudio de juegos de mesa (R43).
   Tablero (rejilla, hexágonos o recorrido de casillas) en SVG propio, con casillas especiales,
   salida, meta y numeración; diseñador de mazo con hoja de impresión de 63 × 88 mm; dados de
   4 a 20 caras y de caras propias; reglas con plantilla y revisión de lenguaje claro (ISO 24495-1);
   modo partida con teclado; y herramientas de equilibrio: probabilidad exacta de las sumas de dados
   y simulación de Montecarlo del recorrido. Imprime el juego entero a escala real con ctx.printPages. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang, SVGNS = 'http://www.w3.org/2000/svg', SQ3 = Math.sqrt(3);
  var CELL = 26, HEX_R = 15;
  var TYPES = ['normal', 'start', 'goal', 'advance', 'back', 'skip', 'card', 'blocked'];
  var TCOL = { normal: '#ffffff', start: '#cfe7d2', goal: '#f6e0a8', advance: '#d3e7f6', back: '#f4d9d9', skip: '#e6e2ef', card: '#e8e0d2', blocked: '#c8cdd3' };
  var TINK = { normal: '#44586c', start: '#17532c', goal: '#7a5300', advance: '#134b73', back: '#8a2942', skip: '#3d2d86', card: '#6b4f1f', blocked: '#2b333a' };
  /* Símbolo de cada casilla: el tipo se distingue por la forma, no solo por el color (WCAG 1.4.1). */
  var TSYM = {
    normal: '', start: 'M-5-6h10l-4 6 4 6h-10z', goal: 'M-6-6h3v12h-3zM-2-6h8l-3 4 3 4h-8z',
    advance: 'M0-7l6 7h-3.5v6h-5v-6H-6z', back: 'M0 7l6-7h-3.5v-6h-5v6H-6z',
    skip: 'M-5-6h3.2v12H-5zM1.8-6H5v12H1.8z', card: 'M-5-6.5h10v13h-10zM-2.5-3.5h5M-2.5 0h5M-2.5 3.5h3',
    blocked: 'M-6-6l12 12M6-6L-6 6'
  };
  /* Iconos originales para las cartas (24 × 24, trazo). */
  var CARD_ICONS = {
    star: 'M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 16.9 6.7 19.7l1.1-6.1L3.4 9.4l6-.8z',
    moon: 'M16 4a8 8 0 100 16 9.5 9.5 0 010-16z', sun: 'M12 7a5 5 0 100 10 5 5 0 000-10M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19',
    leaf: 'M5 19C5 10 11 5 19 5c0 8-5 14-14 14M5 19c3-3 6-5 9-6', drop: 'M12 3s6 6.5 6 10.5a6 6 0 01-12 0C6 9.5 12 3 12 3z',
    flame: 'M12 3c3 4 6 5.5 6 9.5a6 6 0 01-12 0c0-2 1-3.5 2.5-5C9 9 10 7 12 3zM12 20a3 3 0 010-6c1 1.5 2 2 2 3.2A2.8 2.8 0 0112 20z',
    peak: 'M2 19l6.5-11 4 6 2.5-3.5L22 19z', eye: 'M2 12s4-6.5 10-6.5S22 12 22 12s-4 6.5-10 6.5S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6',
    key: 'M9 12a4 4 0 108 0 4 4 0 00-8 0M9 12H2M4 12v3M7 12v2', shield: 'M12 3l8 3v6c0 4-3.5 7.5-8 9-4.5-1.5-8-5-8-9V6z',
    clock: 'M12 3a9 9 0 100 18 9 9 0 000-18M12 7v5.5l3.5 2', bolt: 'M13 2L4 14h6l-1 8 9-12h-6z',
    anchor: 'M12 6a2.5 2.5 0 100 5 2.5 2.5 0 000-5M12 11v10M5 15a7 7 0 0014 0M8 21h8', seed: 'M12 21c-4 0-7-3-7-7s3-11 7-11 7 7 7 11-3 7-7 7M12 21V8'
  };
  var CARD_COLOURS = ['#1f5f8b', '#1d6b3a', '#8a2942', '#5a49a8', '#8a4b00', '#0b6a6a', '#44586c', '#7a5300'];
  var DICE_FACES = [4, 6, 8, 10, 12, 20];
  var PIECE_COLOURS = ['#b3261e', '#1f5f8b', '#1d6b3a', '#8a4b00', '#5a49a8', '#0b6a6a'];
  /* Verbos habituales en reglas de juego (ES/EN): sirven para avisar de pasos sin verbo (lenguaje claro). */
  var VERBS_ES = 'tira tirar lanza lanzar mueve mover avanza avanzar retrocede retroceder roba robar coge coger toma tomar baraja barajar reparte repartir coloca colocar pon poner quita quitar elige elegir suma sumar resta restar gana ganar pierde perder pasa pasar salta saltar juega jugar empieza empezar comienza comenzar termina terminar acaba acabar cuenta contar mira mirar enseña enseñar guarda guardar devuelve devolver cambia cambiar espera esperar vuelve volver sigue seguir descarta descartar reparta gira girar apila apilar puedes puede debes debe tienes tiene hay es son gana ganan haz hacer ve ir ven venir di decir pon sal salir ten tener da dar deja dejar usa usar lee leer saca sacar mete meter marca marcar anota anotar une unir suelta soltar reparte apunta apuntar acaba llega llegar toca tocar';
  var VERBS_EN = 'roll rolls throw throws move moves advance advances go goes back draw draws take takes shuffle shuffles deal deals place places put puts remove removes choose chooses pick picks add adds subtract subtracts win wins lose loses pass passes skip skips play plays start starts begin begins end ends finish finishes count counts look looks show shows keep keeps return returns swap swaps wait waits follow follows discard discards turn turns stack stacks can must may have has is are you do does go make makes say says set sets put gets get keep keeps tell tells give gives let lets read reads write writes use uses need needs';
  function wordSet(s) { var o = {}; s.split(/\s+/).forEach(function (w) { o[w] = 1; }); return o; }
  var VERBS = { es: wordSet(VERBS_ES), en: wordSet(VERBS_EN) };
  function plain(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function words(s) { return plain(s).split(/[^a-z0-9ñ]+/).filter(Boolean); }
  /* Un paso tiene verbo si usa una forma conocida o una terminación verbal clara.
     Ante la duda no avisa: vale más callar que dar un aviso falso. */
  function hasVerb(s) {
    var V = VERBS[LANG] || VERBS.es;
    return words(s).some(function (w) {
      if (V[w] === 1) return true;
      if (LANG === 'en') return w.length > 3 && (/(ing|ed|es)$/).test(w);
      if (w.length < 4) return false;
      if ((/(dad|tad|edad)$/).test(w)) return false;
      return (/(ar|er|ir|ad|ed|id|áis|éis|ís|mos|áis)$/).test(w);
    });
  }
  function sentences(s) { return String(s || '').split(/(?<=[.;:!?])\s+/).map(function (x) { return x.trim(); }).filter(Boolean); }
  /* Azar solo cuando la persona pulsa: la semilla sale del generador del navegador. */
  function freshSeed() { var a = new Uint32Array(1); (root.crypto || root.msCrypto).getRandomValues(a); return a[0]; }

  IG.defineEngine('juegosmesa', {
    version: 1, fileBase: LANG === 'en' ? 'board-game' : 'juego-de-mesa',
    extraKeys: ['kGameCursor', 'kGamePlay', 'kGameViews'],
    initialStart: function (para) { return { child: 'race', teen: 'cards', adult: 'hex' }[para] || 'two'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'race', title: t('stRace'), desc: t('stRaceD'), para: 'child' },
        { id: 'cards', title: t('stCards'), desc: t('stCardsD'), para: 'teen' },
        { id: 'hex', title: t('stHex'), desc: t('stHexD'), para: 'adult' },
        { id: 'two', title: t('stTwo'), desc: t('stTwoD'), para: 'any' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport, num = ctx.num;
    var seq = 0, S = emptyGame(), sel = null, view = 'board', tool = 'paint', cellType = 'advance', cellSteps = 2;
    var kc = 0, cursorShown = false, painting = null, play = null, sim = null, editTools = null;

    function emptyGame() {
      return { v: 1, name: t('newGameName'), players: 2, board: blankBoard('track', 8, 5), deck: [], dice: [{ id: nid('d'), faces: 6, custom: null }], pieces: [], numbering: true,
        rules: { objective: '', setup: [], turn: [], end: [], variants: [] } };
    }
    function blankBoard(kind, w, hh) {
      var cells = []; for (var i = 0; i < w * hh; i++) cells.push({ t: 'normal', n: 0 });
      if (kind === 'track') { cells[0].t = 'start'; cells[cells.length - 1].t = 'goal'; }
      return { kind: kind, w: w, h: hh, cells: cells };
    }
    function nid(p) { seq += 1; return p + seq; }
    function syncSeq() { ['deck', 'dice', 'pieces'].forEach(function (k) { (S[k] || []).forEach(function (o) { var n = parseInt(String(o.id).slice(1), 10); if (n > seq) seq = n; }); }); }
    function B() { return S.board; }
    function cellCount() { return B().cells.length; }
    function tname(k) { return t('type_' + k); }

    /* ---------- Geometría ---------- */
    var HEXPTS = [0, 1, 2, 3, 4, 5].map(function (k) { var a = (60 * k - 30) * Math.PI / 180; return [HEX_R * Math.cos(a), HEX_R * Math.sin(a)]; });
    function rowColOf(i) {
      var b = B(), r = Math.floor(i / b.w), c = i % b.w;
      if (b.kind === 'track' && (r & 1)) c = b.w - 1 - c;
      return { r: r, c: c };
    }
    function posOf(i) {
      var b = B(), p = rowColOf(i);
      if (b.kind === 'hex') return [HEX_R * SQ3 * (p.c + 0.5 * (p.r & 1)) + HEX_R * SQ3 / 2, HEX_R * 1.5 * p.r + HEX_R];
      return [p.c * CELL + CELL / 2, p.r * CELL + CELL / 2];
    }
    function cellPath(i) {
      var b = B(), p = posOf(i);
      if (b.kind === 'hex') return 'M' + HEXPTS.map(function (q) { return (p[0] + q[0]).toFixed(2) + ',' + (p[1] + q[1]).toFixed(2); }).join('L') + 'Z';
      var s = CELL / 2 - 1;
      return 'M' + (p[0] - s) + ',' + (p[1] - s) + 'h' + (2 * s) + 'v' + (2 * s) + 'h' + (-2 * s) + 'Z';
    }
    function boardBox() {
      var b = B();
      if (b.kind === 'hex') return { minX: 0, minY: 0, maxX: HEX_R * SQ3 * (b.w + 0.5), maxY: HEX_R * 1.5 * (b.h - 1) + HEX_R * 2 };
      return { minX: 0, minY: 0, maxX: b.w * CELL, maxY: b.h * CELL };
    }
    function neighbours(i) {
      var b = B(), p = rowColOf(i), out = [], d;
      if (b.kind === 'hex') d = (p.r & 1) ? [[1, 0], [-1, 0], [1, -1], [0, -1], [1, 1], [0, 1]] : [[1, 0], [-1, 0], [0, -1], [-1, -1], [0, 1], [-1, 1]];
      else d = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      d.forEach(function (v) { var c = p.c + v[0], r = p.r + v[1]; if (c >= 0 && r >= 0 && c < b.w && r < b.h) out.push(indexAt(c, r)); });
      return out;
    }
    function indexAt(c, r) { var b = B(); return b.kind === 'track' && (r & 1) ? r * b.w + (b.w - 1 - c) : r * b.w + c; }
    function cellFromPoint(x, y) {
      var b = B();
      if (b.kind === 'hex') {
        var q = (SQ3 / 3 * (x - HEX_R * SQ3 / 2) - (y - HEX_R) / 3) / HEX_R, rr = (2 / 3 * (y - HEX_R)) / HEX_R, s = -q - rr;
        var rq = Math.round(q), rrr = Math.round(rr), rs = Math.round(s), dq = Math.abs(rq - q), dr = Math.abs(rrr - rr), ds = Math.abs(rs - s);
        if (dq > dr && dq > ds) rq = -rrr - rs; else if (dr > ds) rrr = -rq - rs;
        var col = rq + (rrr - (rrr & 1)) / 2;
        return (col >= 0 && rrr >= 0 && col < b.w && rrr < b.h) ? indexAt(col, rrr) : -1;
      }
      var c = Math.floor(x / CELL), r = Math.floor(y / CELL);
      return (c >= 0 && r >= 0 && c < b.w && r < b.h) ? indexAt(c, r) : -1;
    }

    /* ---------- Escenario ---------- */
    function el(name, attrs, parent) { var e = D.createElementNS(SVGNS, name); Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }); if (parent) parent.appendChild(e); return e; }
    var stage = h('div', { class: 'igj-stage' });
    var svg = el('svg', { class: 'igj-svg', 'aria-hidden': 'true', focusable: 'false' });
    var world = el('g', {}, svg), pathG = el('g', { class: 'igj-pathline' }, world), cellsG = el('g', {}, world), marksG = el('g', {}, world), piecesG = el('g', {}, world);
    var overlay = el('g', {}, svg);
    var docView = h('div', { class: 'igj-doc', hidden: true });
    var zoomBox = h('div', { class: 'igs-zoom igj-zoom' },
      ctx.button(t('zoomOut'), { icon: 'minus', onClick: function () { zoomCentre(1 / 1.25); } }),
      ctx.button(t('zoomFit'), { icon: 'fit', onClick: function () { fit(); } }),
      ctx.button(t('zoomIn'), { icon: 'plus', onClick: function () { zoomCentre(1.25); } }));
    var turnBar = h('p', { class: 'igj-turnbar', role: 'status', hidden: true });
    stage.appendChild(svg); vp.append(stage, turnBar, zoomBox, docView); vp.classList.add('igj-viewport');
    ctx.setTech('renderer', 'SVG');

    var V = new ctx.View2D({ scale: 2, min: 0.3, max: 10, onChange: applyView });
    ctx.attachViewGestures(stage, V, { isPanTool: function () { return tool === 'pan'; } });
    function applyView() { world.setAttribute('transform', 'translate(' + V.x.toFixed(2) + ',' + V.y.toFixed(2) + ') scale(' + V.scale.toFixed(4) + ')'); drawOverlay(); }
    function fit() { var b = boardBox(), bar = turnBar.hidden ? 0 : turnBar.offsetHeight + 6; V.fit(b, Math.max(200, stage.clientWidth), Math.max(160, stage.clientHeight - bar), 16); }
    function zoomCentre(f) { V.zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, f); }
    if (root.ResizeObserver) new ResizeObserver(function () { if (view === 'board') fit(); }).observe(stage);

    function drawBoard() {
      [cellsG, pathG, marksG, piecesG].forEach(function (g) { while (g.firstChild) g.removeChild(g.firstChild); });
      var b = B();
      if (b.kind === 'track') {
        var d = b.cells.map(function (c, i) { var p = posOf(i); return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('');
        el('path', { d: d, class: 'igj-track-line' }, pathG);
      }
      b.cells.forEach(function (c, i) {
        var p = posOf(i);
        el('path', { d: cellPath(i), class: 'igj-cell igj-t-' + c.t, 'data-i': i }, cellsG);
        if (TSYM[c.t]) el('path', { d: TSYM[c.t], class: 'igj-sym igj-sym-' + c.t, transform: 'translate(' + p[0].toFixed(1) + ',' + (p[1] + (b.kind === 'hex' ? 0 : 1)).toFixed(1) + ') scale(' + (b.kind === 'hex' ? 0.9 : 0.74) + ')' }, marksG);
        if ((c.t === 'advance' || c.t === 'back') && c.n) { var tn = el('text', { x: p[0], y: p[1] + (b.kind === 'hex' ? 12 : 10), class: 'igj-cellnum igj-steps' }, marksG); tn.textContent = String(c.n); }
        if (S.numbering) { var tx = el('text', { x: p[0] - (b.kind === 'hex' ? 8 : CELL / 2 - 3), y: p[1] - (b.kind === 'hex' ? 6 : CELL / 2 - 7.5), class: 'igj-cellnum' }, marksG); tx.textContent = String(i + 1); }
      });
      S.pieces.forEach(function (pc, k) {
        var i = Math.max(0, Math.min(cellCount() - 1, pc.cell)), p = posOf(i), off = pieceOffset(i, k);
        var g = el('g', { class: 'igj-piece' + (sel && sel.k === 'piece' && sel.id === pc.id ? ' igj-sel' : ''), transform: 'translate(' + (p[0] + off[0]).toFixed(1) + ',' + (p[1] + off[1]).toFixed(1) + ')', 'data-piece': pc.id }, piecesG);
        el('circle', { r: 7, fill: pc.colour, stroke: '#101820', 'stroke-width': 1.6 }, g);
        var lb = el('text', { y: 3.2, class: 'igj-piecelab' }, g); lb.textContent = String(k + 1);
      });
      ctx.setSummary(summaryText());
    }
    function pieceOffset(cell, k) {
      var same = S.pieces.filter(function (p) { return p.cell === cell; }), idx = same.map(function (p) { return p.id; }).indexOf(S.pieces[k].id);
      if (same.length < 2) return [0, 0];
      var a = idx / same.length * Math.PI * 2;
      return [Math.cos(a) * 6, Math.sin(a) * 6];
    }
    function drawOverlay() {
      while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
      if (view !== 'board') return;
      var p = posOf(Math.max(0, Math.min(cellCount() - 1, kc))), s = V.toScreen(p[0], p[1]);
      var r = (B().kind === 'hex' ? HEX_R : CELL / 2) * V.scale;
      el('circle', { cx: s.x, cy: s.y, r: r, class: 'igj-cursor' + (cursorShown ? '' : ' igj-cursor-dim') }, overlay);
      if (play && play.on && play.steps > 0 && B().kind !== 'track') {
        reachable().forEach(function (i) { var q = V.toScreen(posOf(i)[0], posOf(i)[1]); el('circle', { cx: q.x, cy: q.y, r: r * 0.55, class: 'igj-reach' }, overlay); });
      }
    }

    /* ---------- Dados ---------- */
    function dieName(d) { return d.custom ? t('dieCustom', { n: d.custom.length }) : 'd' + d.faces; }
    function dieFaces(d) { return d.custom ? d.custom.length : d.faces; }
    function dieValue(d, face) { return d.custom ? d.custom[face - 1] : String(face); }
    function rollOne(d, rnd) { return 1 + Math.floor(rnd() * dieFaces(d)); }
    function rollAll(rnd) {
      var faces = S.dice.map(function (d) { return rollOne(d, rnd); });
      var total = S.dice.reduce(function (a, d, i) { return a + (d.custom ? (parseFloat(d.custom[faces[i] - 1]) || 0) : faces[i]); }, 0);
      return { faces: faces, total: total, text: S.dice.map(function (d, i) { return dieName(d) + ': ' + dieValue(d, faces[i]); }).join(' · ') };
    }
    /* Distribución exacta de la suma: convolución de las caras numéricas de cada dado. */
    function sumDistribution() {
      var dist = { 0: 1 };
      S.dice.forEach(function (d) {
        var next = {}, n = dieFaces(d);
        for (var f = 1; f <= n; f++) {
          var v = d.custom ? (parseFloat(d.custom[f - 1]) || 0) : f;
          Object.keys(dist).forEach(function (k) { var s = +k + v; next[s] = (next[s] || 0) + dist[k] / n; });
        }
        dist = next;
      });
      return Object.keys(dist).map(function (k) { return { sum: +k, p: dist[k] }; }).sort(function (a, b) { return a.sum - b.sum; });
    }

    /* ---------- Simulación de Montecarlo del recorrido ---------- */
    /* Distancia de cada casilla a la meta (anchura primero), sin pasar por casillas bloqueadas. */
    function distanceField() {
      var n = cellCount(), cells = B().cells, goal = -1;
      for (var i = n - 1; i >= 0; i--) if (cells[i].t === 'goal') goal = i;
      if (goal < 0) goal = n - 1;
      var dist = new Array(n).fill(-1), q = [goal], at = 0; dist[goal] = 0;
      while (at < q.length) { var cur = q[at++]; neighbours(cur).forEach(function (j) { if (dist[j] < 0 && cells[j].t !== 'blocked') { dist[j] = dist[cur] + 1; q.push(j); } }); }
      return { dist: dist, goal: goal };
    }
    function stepTowards(i, df, backwards) {
      var best = -1, bd = df.dist[i];
      neighbours(i).forEach(function (j) {
        if (B().cells[j].t === 'blocked' || df.dist[j] < 0) return;
        if (backwards ? df.dist[j] > bd : df.dist[j] < bd) { bd = df.dist[j]; best = j; }
      });
      return best < 0 ? i : best;
    }
    function simulate(games, useSpecials) {
      var rnd = ctx.rng(freshSeed()), n = cellCount(), players = Math.max(2, Math.min(6, S.players));
      var track = B().kind === 'track', df = track ? null : distanceField(), from = startCell();
      if (!track && (df.dist[from] < 0 || df.goal === from)) return null;
      function advance(pos, steps) {
        if (track) return Math.min(n - 1, Math.max(0, pos + steps));
        for (var k = 0; k < steps; k++) { if (pos === df.goal) break; pos = stepTowards(pos, df, false); }
        return pos;
      }
      function retreat(pos, steps) {
        if (track) return Math.max(0, pos - steps);
        for (var k = 0; k < steps; k++) pos = stepTowards(pos, df, true);
        return pos;
      }
      function arrived(pos) { return track ? pos >= n - 1 : pos === df.goal; }
      var wins = new Array(players).fill(0), turns = 0, specialMoves = 0, longest = 0, shortest = 1e9;
      for (var g = 0; g < games; g++) {
        var pos = new Array(players).fill(from), skip = new Array(players).fill(0), done = false, tc = 0;
        while (!done && tc < 1200) {
          for (var p = 0; p < players; p++) {
            tc++;
            if (skip[p] > 0) { skip[p]--; continue; }
            pos[p] = advance(pos[p], Math.round(rollAll(rnd).total));
            if (useSpecials) {
              var c = B().cells[pos[p]];
              if (c.t === 'advance') { pos[p] = advance(pos[p], c.n || 1); specialMoves++; }
              else if (c.t === 'back') { pos[p] = retreat(pos[p], c.n || 1); specialMoves++; }
              else if (c.t === 'skip') { skip[p] = 1; specialMoves++; }
            }
            if (arrived(pos[p])) { wins[p]++; done = true; break; }
          }
        }
        turns += tc; longest = Math.max(longest, tc); shortest = Math.min(shortest, tc);
      }
      return { games: games, players: players, wins: wins, avgTurns: turns / games / players, longest: Math.ceil(longest / players), shortest: Math.ceil(shortest / players), specials: specialMoves / games, useSpecials: useSpecials };
    }
    function canSimulate() { if (B().kind === 'track') return true; var df = distanceField(); return df.dist[startCell()] >= 0 && df.goal !== startCell(); }
    function runSimulation(games) {
      if (!canSimulate()) { ctx.announce(t('simNeedGoal')); return; }
      var withS = simulate(games, true), without = simulate(games, false);
      if (!withS || !without) { ctx.announce(t('simNeedGoal')); return; }
      sim = { on: withS, off: without, at: Date.now() };
      renderDoc(); renderInspector();
      var lead = leadPct(withS);
      ctx.announce(t('simDone', { n: games, turns: num(withS.avgTurns, 1), lead: num(lead, 1) }));
    }
    function leadPct(r) { var fair = 100 / r.players, first = r.wins[0] / r.games * 100; return first - fair; }

    /* ---------- Reglas: recuento y revisión de lenguaje claro ---------- */
    var RULE_SECTIONS = ['setup', 'turn', 'end', 'variants'];
    function ruleItems() {
      var out = [];
      if (String(S.rules.objective).trim()) out.push({ sec: 'objective', i: 0, text: S.rules.objective });
      RULE_SECTIONS.forEach(function (k) { S.rules[k].forEach(function (x, i) { if (String(x).trim()) out.push({ sec: k, i: i, text: x }); }); });
      return out;
    }
    function ruleCount() { return ruleItems().length; }
    function ruleReview() {
      var out = [];
      ruleItems().forEach(function (r) {
        sentences(r.text).forEach(function (s) {
          var w = words(s).length;
          if (w > 20) out.push({ kind: 'long', sec: r.sec, text: t('revLong', { sec: t('rs_' + r.sec), n: w, s: s.slice(0, 60) }) });
        });
        if (r.sec !== 'objective' && !hasVerb(r.text)) out.push({ kind: 'verb', sec: r.sec, text: t('revNoVerb', { sec: t('rs_' + r.sec), s: String(r.text).slice(0, 60) }) });
      });
      if (!String(S.rules.objective).trim()) out.push({ kind: 'objective', sec: 'objective', text: t('revNoObjective') });
      if (!S.rules.turn.length) out.push({ kind: 'turn', sec: 'turn', text: t('revNoTurn') });
      return out;
    }

    /* ---------- Mazo ---------- */
    function deckSize() { return S.deck.reduce(function (a, c) { return a + Math.max(1, c.copies || 1); }, 0); }
    function deckStats() {
      var vals = [], colours = {}, icons = {};
      S.deck.forEach(function (c) {
        var n = Math.max(1, c.copies || 1);
        for (var k = 0; k < n; k++) vals.push(c.value);
        colours[c.colour] = (colours[c.colour] || 0) + n; icons[c.icon] = (icons[c.icon] || 0) + n;
      });
      vals.sort(function (a, b) { return a - b; });
      var sum = vals.reduce(function (a, v) { return a + v; }, 0);
      var uniq = {}; vals.forEach(function (v) { uniq[v] = (uniq[v] || 0) + 1; });
      return { total: vals.length, kinds: S.deck.length, min: vals[0] || 0, max: vals[vals.length - 1] || 0, mean: vals.length ? sum / vals.length : 0,
        median: vals.length ? vals[Math.floor(vals.length / 2)] : 0, values: uniq, colours: colours, icons: icons };
    }

    /* ---------- Retos ---------- */
    function goals() {
      var rc = ruleCount(), rev = ruleReview(), st = deckStats();
      var balanced = !!sim && Math.abs(leadPct(sim.on)) < 10;
      var varied = Object.keys(st.values).length >= 3;
      return [
        { ok: S.players >= 2 && rc >= 5, title: t('ch1'), detail: t('ch1D', { players: S.players, n: rc }) },
        { ok: st.total >= 10 && varied && balanced, title: t('ch2'), parts: [
          [st.total >= 10, t('g2Cards', { n: st.total })], [varied, t('g2Values', { n: Object.keys(st.values).length })],
          [!!sim, t('g2Sim')], [balanced, t('g2Lead', { n: sim ? num(leadPct(sim.on), 1) : '—' })]
        ] },
        { ok: rc >= 5 && !rev.length, title: t('ch3'), detail: rev.length ? t('ch3D', { n: rev.length }) : t('ch3Ok') }
      ];
    }

    /* ---------- Vistas ---------- */
    function setView(v, quiet) {
      view = v; var isBoard = v === 'board';
      stage.hidden = !isBoard; zoomBox.hidden = !isBoard; docView.hidden = isBoard;
      turnBar.hidden = !(isBoard && play && play.on);
      if (isBoard) { vp.setAttribute('role', 'application'); vp.setAttribute('aria-label', t('canvasLabel')); }
      else { vp.setAttribute('role', 'region'); vp.setAttribute('aria-label', t('view_' + v)); }
      if (viewSel.value !== v) viewSel.value = v;
      if (isBoard) { fit(); drawOverlay(); } else renderDoc();
      if (!quiet) ctx.announce(t('viewNow', { v: t('view_' + v) }));
      ctx.setSummary(summaryText());
    }
    function renderDoc() {
      ctx.clear(docView);
      if (view === 'cards') renderCardsView();
      else if (view === 'rules') renderRulesView();
      else if (view === 'balance') renderBalanceView();
    }
    function cardNode(c, small) {
      var box = h('div', { class: 'igj-card' + (small ? ' igj-card-small' : ''), style: '--igj-card:' + c.colour });
      box.appendChild(h('span', { class: 'igj-card-value', text: String(c.value) }));
      var ic = el('svg', { viewBox: '0 0 24 24', class: 'igj-card-icon', 'aria-hidden': 'true', focusable: 'false' });
      el('path', { d: CARD_ICONS[c.icon] || CARD_ICONS.star }, ic);
      box.appendChild(ic);
      box.appendChild(h('strong', { class: 'igj-card-title', text: c.title }));
      box.appendChild(h('span', { class: 'igj-card-text', text: c.text }));
      if ((c.copies || 1) > 1) box.appendChild(h('span', { class: 'igj-card-copies', text: t('copiesN', { n: c.copies }) }));
      return box;
    }
    function renderCardsView() {
      docView.appendChild(h('h3', { text: t('view_cards') + ' (' + deckSize() + ')' }));
      if (!S.deck.length) docView.appendChild(h('p', { class: 'igj-empty', text: t('deckEmpty') }));
      var grid = h('div', { class: 'igj-cardgrid' });
      S.deck.forEach(function (c) {
        var b = h('button', { type: 'button', class: 'igj-cardbtn', 'aria-current': String(!!(sel && sel.k === 'card' && sel.id === c.id)), 'aria-label': t('cardLabel', { title: c.title, v: c.value }) }, cardNode(c));
        b.addEventListener('click', function () { select('card', c.id, true); });
        grid.appendChild(b);
      });
      docView.appendChild(grid);
      docView.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('addCard'), { icon: 'plus', onClick: function () { addCard(); } }),
        ctx.button(t('printCards'), { icon: 'file', onClick: printCards })));
      docView.appendChild(h('p', { class: 'igs-muted', text: t('cardsNote') }));
    }
    function renderRulesView() {
      docView.appendChild(h('h3', { text: t('rulesOf', { name: S.name }) }));
      docView.appendChild(h('p', { class: 'igj-lede', text: t('rulesMeta', { players: S.players, n: ruleCount() }) }));
      var R = S.rules;
      docView.appendChild(h('h4', { text: t('rs_objective') }));
      docView.appendChild(R.objective ? h('p', { text: R.objective }) : h('p', { class: 'igj-empty', text: t('noneYet') }));
      RULE_SECTIONS.forEach(function (k) {
        docView.appendChild(h('h4', { text: t('rs_' + k) }));
        if (!R[k].length) { docView.appendChild(h('p', { class: 'igj-empty', text: t('noneYet') })); return; }
        var listEl = h(k === 'variants' ? 'ul' : 'ol', { class: 'igj-rulelist' });
        R[k].forEach(function (x) { listEl.appendChild(h('li', { text: x })); });
        docView.appendChild(listEl);
      });
      var rev = ruleReview();
      docView.appendChild(h('h4', { text: t('revTitle') }));
      if (!rev.length) docView.appendChild(h('p', { class: 'igs-result', 'data-kind': 'ok' }, h('strong', { text: t('revOk') })));
      else { var ul = h('ul', { class: 'igj-warn' }); rev.forEach(function (r) { ul.appendChild(h('li', { text: r.text })); }); docView.appendChild(h('p', { class: 'igs-result', 'data-kind': 'bad' }, h('strong', { text: t('revBad', { n: rev.length }) }))); docView.appendChild(ul); }
      docView.appendChild(h('p', { class: 'igs-muted', text: t('revNote') }));
      docView.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('editRules'), { icon: 'text', onClick: function () { select('rules', 'rules'); } })));
    }
    /* Gráfico de barras de la probabilidad de cada suma, con su tabla al lado (gráficos con datos → tabla). */
    function distChart(dist) {
      var W = 520, H = 190, pad = { l: 34, r: 10, t: 14, b: 30 }, maxP = Math.max.apply(null, dist.map(function (d) { return d.p; }));
      var bw = (W - pad.l - pad.r) / dist.length, s = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'igj-chart', role: 'img', 'aria-label': t('chartAlt', { min: dist[0].sum, max: dist[dist.length - 1].sum }) });
      [0, 0.5, 1].forEach(function (f) {
        var y = pad.t + (1 - f) * (H - pad.t - pad.b);
        el('line', { x1: pad.l, y1: y, x2: W - pad.r, y2: y, class: 'igj-grid' }, s);
        var lb = el('text', { x: pad.l - 6, y: y + 4, class: 'igj-axis', 'text-anchor': 'end' }, s); lb.textContent = num(f * maxP * 100, 0) + '%';
      });
      dist.forEach(function (d, i) {
        var hgt = (d.p / maxP) * (H - pad.t - pad.b), x = pad.l + i * bw + bw * 0.16, w = Math.max(3, bw * 0.68), y = H - pad.b - hgt;
        el('rect', { x: x, y: y, width: w, height: Math.max(1, hgt), rx: Math.min(4, w / 2), class: 'igj-bar' }, s);
        if (d.p === maxP) { var vl = el('text', { x: x + w / 2, y: y - 4, class: 'igj-barlab', 'text-anchor': 'middle' }, s); vl.textContent = num(d.p * 100, 1) + '%'; }
        if (dist.length <= 14 || i % Math.ceil(dist.length / 12) === 0) { var xl = el('text', { x: x + w / 2, y: H - pad.b + 14, class: 'igj-axis', 'text-anchor': 'middle' }, s); xl.textContent = String(d.sum); }
      });
      el('line', { x1: pad.l, y1: H - pad.b, x2: W - pad.r, y2: H - pad.b, class: 'igj-axisline' }, s);
      var xt = el('text', { x: (W + pad.l) / 2, y: H - 3, class: 'igj-axis', 'text-anchor': 'middle' }, s); xt.textContent = t('sumWord');
      return s;
    }
    function distTable(dist) {
      var tb = h('table', { class: 'igs-table' }, h('caption', { text: t('distCap', { dice: S.dice.map(dieName).join(' + ') }) }),
        h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('sumWord') }), h('th', { scope: 'col', text: t('probWord') }), h('th', { scope: 'col', text: t('outOfWord') }))));
      var body = h('tbody');
      dist.forEach(function (d) {
        body.appendChild(h('tr', null, h('th', { scope: 'row', text: String(d.sum) }), h('td', { class: 'igs-numcell', text: num(d.p * 100, 2) + '%' }), h('td', { class: 'igs-numcell', text: t('oneIn', { n: num(1 / d.p, 1) }) })));
      });
      tb.appendChild(body); return h('div', { class: 'igs-table-wrap' }, tb);
    }
    function renderBalanceView() {
      var dist = sumDistribution(), st = deckStats();
      docView.appendChild(h('h3', { text: t('view_balance') }));
      docView.appendChild(h('h4', { text: t('diceTitle') }));
      docView.appendChild(h('p', { class: 'igj-lede', text: t('diceLede', { dice: S.dice.map(dieName).join(' + '), min: dist[0].sum, max: dist[dist.length - 1].sum, mean: num(dist.reduce(function (a, d) { return a + d.sum * d.p; }, 0), 2) }) }));
      docView.appendChild(h('div', { class: 'igj-chartwrap' }, distChart(dist)));
      docView.appendChild(distTable(dist));
      docView.appendChild(h('h4', { text: t('simTitle') }));
      if (!canSimulate()) docView.appendChild(h('p', { class: 'igs-muted', text: t('simNeedGoal') }));
      else {
        docView.appendChild(h('p', { class: 'igj-lede', text: t('simLede') }));
        docView.appendChild(h('div', { class: 'igs-actions' },
          ctx.button(t('simRun', { n: 2000 }), { icon: 'play', class: 'igs-primary', onClick: function () { runSimulation(2000); } }),
          ctx.button(t('simRunFast', { n: 300 }), { icon: 'play', onClick: function () { runSimulation(300); } })));
        if (sim) docView.appendChild(simTable());
        else docView.appendChild(h('p', { class: 'igs-muted', text: t('simNone') }));
      }
      docView.appendChild(h('h4', { text: t('deckTitle') }));
      docView.appendChild(deckTable(st));
    }
    function simTable() {
      var box = h('div');
      var lead = leadPct(sim.on);
      box.appendChild(h('p', { class: 'igs-result', 'data-kind': Math.abs(lead) < 10 ? 'ok' : 'bad' },
        h('strong', { text: Math.abs(lead) < 10 ? t('simBalanced') : t('simUnbalanced') }),
        t('simSummary', { turns: num(sim.on.avgTurns, 1), lead: num(lead, 1), short: sim.on.shortest, long: sim.on.longest })));
      var tb = h('table', { class: 'igs-table' }, h('caption', { text: t('simCap', { n: sim.on.games }) }),
        h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('colWho') }), h('th', { scope: 'col', text: t('colWinsWith') }), h('th', { scope: 'col', text: t('colWinsNo') }))));
      var body = h('tbody');
      for (var p = 0; p < sim.on.players; p++) {
        body.appendChild(h('tr', null, h('th', { scope: 'row', text: t('playerN', { n: p + 1 }) }),
          h('td', { class: 'igs-numcell', text: num(sim.on.wins[p] / sim.on.games * 100, 1) + '%' }),
          h('td', { class: 'igs-numcell', text: num((sim.off.wins[p] || 0) / sim.off.games * 100, 1) + '%' })));
      }
      body.appendChild(h('tr', null, h('th', { scope: 'row', text: t('rowTurns') }),
        h('td', { class: 'igs-numcell', text: num(sim.on.avgTurns, 1) }), h('td', { class: 'igs-numcell', text: num(sim.off.avgTurns, 1) })));
      body.appendChild(h('tr', null, h('th', { scope: 'row', text: t('rowSpecials') }),
        h('td', { class: 'igs-numcell', text: num(sim.on.specials, 1) }), h('td', { class: 'igs-numcell', text: '0' })));
      tb.appendChild(body); box.appendChild(h('div', { class: 'igs-table-wrap' }, tb));
      box.appendChild(h('p', { class: 'igs-muted', text: t('simNote') }));
      return box;
    }
    function deckTable(st) {
      if (!st.total) return h('p', { class: 'igs-muted', text: t('deckEmpty') });
      var box = h('div');
      box.appendChild(h('p', { class: 'igj-lede', text: t('deckLede', { total: st.total, kinds: st.kinds, min: st.min, max: st.max, mean: num(st.mean, 2), median: st.median }) }));
      var tb = h('table', { class: 'igs-table' }, h('caption', { text: t('deckCap') }),
        h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('colValue') }), h('th', { scope: 'col', text: t('colCards') }), h('th', { scope: 'col', text: '%' }))));
      var body = h('tbody');
      Object.keys(st.values).map(Number).sort(function (a, b) { return a - b; }).forEach(function (v) {
        body.appendChild(h('tr', null, h('th', { scope: 'row', text: String(v) }), h('td', { class: 'igs-numcell', text: String(st.values[v]) }), h('td', { class: 'igs-numcell', text: num(st.values[v] / st.total * 100, 0) })));
      });
      tb.appendChild(body); box.appendChild(h('div', { class: 'igs-table-wrap' }, tb));
      return box;
    }

    /* ---------- Modo partida ---------- */
    function startPlay() {
      if (!S.pieces.length) addPiece(true);
      /* Probar no cambia el juego: al salir, las fichas vuelven a donde las dejaste. */
      play = { on: true, turn: 0, steps: 0, roll: null, drawn: null, order: shuffledDeck(), used: 0, before: S.pieces.map(function (p) { return p.cell; }) };
      S.pieces.forEach(function (p) { p.cell = startCell(); p.skip = 0; });
      turnBar.hidden = false; setPlayMode(true); setView('board', true); drawBoard(); drawOverlay(); updateTurnBar(); fit();
      renderStructure(); renderInspector();
      try { btnRoll.focus({ preventScroll: true }); } catch (_) { btnRoll.focus(); }
      ctx.announce(t('playOn', { name: currentPiece().name }));
    }
    function stopPlay() {
      if (play && play.before) S.pieces.forEach(function (p, i) { if (play.before[i] !== undefined) p.cell = play.before[i]; p.skip = 0; });
      play = null; turnBar.hidden = true; setPlayMode(false); drawBoard(); drawOverlay();
      renderStructure(); renderInspector();
      try { btnPlay.focus({ preventScroll: true }); } catch (_) { btnPlay.focus(); }
      ctx.announce(t('playOff'));
    }
    function startCell() { var i = B().cells.findIndex(function (c) { return c.t === 'start'; }); return i < 0 ? 0 : i; }
    function currentPiece() { return S.pieces[play.turn % S.pieces.length]; }
    function shuffledDeck() {
      var list = [], rnd = ctx.rng(freshSeed());
      S.deck.forEach(function (c) { for (var k = 0; k < Math.max(1, c.copies || 1); k++) list.push(c.id); });
      for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), tmp = list[i]; list[i] = list[j]; list[j] = tmp; }
      return list;
    }
    function updateTurnBar() {
      if (!play || !play.on) return;
      var pc = currentPiece();
      turnBar.textContent = t('turnOf', { name: pc.name }) + (play.roll ? ' · ' + t('rolled', { r: play.roll }) : '') +
        (B().kind !== 'track' && play.steps ? ' · ' + t('stepsLeft', { n: play.steps }) : '') +
        (play.drawn ? ' · ' + t('cardDrawn', { title: play.drawn.title }) : '');
    }
    function doRoll() {
      if (!play || !play.on) return;
      var r = rollAll(ctx.rng(freshSeed()));
      play.roll = r.text; play.steps = Math.max(0, Math.round(r.total));
      if (B().kind === 'track') { movePiece(currentPiece(), play.steps); play.steps = 0; }
      else { drawOverlay(); ctx.announce(t('rollAnnounce', { r: r.text, total: r.total })); }
      updateTurnBar(); drawBoard(); renderInspector();
    }
    function movePiece(pc, steps) {
      var n = cellCount(), from = pc.cell;
      pc.cell = Math.max(0, Math.min(n - 1, pc.cell + steps));
      var c = B().cells[pc.cell], extra = '';
      if (c.t === 'advance') { pc.cell = Math.min(n - 1, pc.cell + (c.n || 1)); extra = ' ' + t('sqAdvance', { n: c.n || 1 }); }
      else if (c.t === 'back') { pc.cell = Math.max(0, pc.cell - (c.n || 1)); extra = ' ' + t('sqBack', { n: c.n || 1 }); }
      else if (c.t === 'skip') { pc.skip = 1; extra = ' ' + t('sqSkip'); }
      else if (c.t === 'card') { extra = ' ' + t('sqCard'); doDraw(true); }
      var win = B().cells[pc.cell].t === 'goal' || pc.cell === n - 1;
      ctx.announce(t('moveAnnounce', { name: pc.name, r: play.roll, from: from + 1, to: pc.cell + 1 }) + extra + (win ? ' ' + t('winAnnounce', { name: pc.name }) : ''));
      drawBoard(); drawOverlay(); updateTurnBar(); renderInspector();
    }
    function reachable() {
      if (!play || !play.on || play.steps <= 0) return [];
      var seen = {}, frontier = [currentPiece().cell], out = [];
      seen[currentPiece().cell] = 1;
      for (var s = 0; s < play.steps; s++) {
        var next = [];
        frontier.forEach(function (i) { neighbours(i).forEach(function (j) { if (!seen[j] && B().cells[j].t !== 'blocked') { seen[j] = 1; next.push(j); out.push(j); } }); });
        frontier = next;
      }
      return out;
    }
    function stepTo(i) {
      if (!play || !play.on) return false;
      var pc = currentPiece();
      if (B().kind === 'track') { ctx.announce(t('trackAuto')); return false; }
      if (play.steps <= 0) { ctx.announce(t('rollFirst')); return false; }
      if (reachable().indexOf(i) < 0) { ctx.announce(t('tooFar')); return false; }
      var dist = 1, seen = {}, frontier = [pc.cell]; seen[pc.cell] = 1;
      while (dist <= play.steps) { var nx = []; var found = false; frontier.forEach(function (x) { neighbours(x).forEach(function (y) { if (!seen[y] && B().cells[y].t !== 'blocked') { seen[y] = 1; nx.push(y); if (y === i) found = true; } }); }); if (found) break; frontier = nx; dist++; }
      pc.cell = i; play.steps -= dist;
      var c = B().cells[i], extra = '';
      if (c.t === 'card') { extra = ' ' + t('sqCard'); doDraw(true); }
      else if (c.t === 'goal') extra = ' ' + t('winAnnounce', { name: pc.name });
      drawBoard(); drawOverlay(); updateTurnBar();
      ctx.announce(t('pieceAt', { name: pc.name, n: i + 1, t: tname(c.t) }) + extra);
      return true;
    }
    function doDraw(quiet) {
      if (!play || !play.on) return;
      if (!play.order.length) { ctx.announce(t('deckEmptyPlay')); return; }
      if (play.used >= play.order.length) { play.order = shuffledDeck(); play.used = 0; ctx.announce(t('deckReshuffled')); }
      var id = play.order[play.used++], card = S.deck.filter(function (c) { return c.id === id; })[0];
      play.drawn = card || null; updateTurnBar(); renderInspector();
      if (card && !quiet) ctx.announce(t('drewCard', { title: card.title, v: card.value, text: card.text }));
      else if (card) ctx.announce(t('drewCardShort', { title: card.title, v: card.value }));
    }
    function doShuffle() { if (!play || !play.on) return; play.order = shuffledDeck(); play.used = 0; play.drawn = null; updateTurnBar(); renderInspector(); ctx.announce(t('deckShuffled', { n: play.order.length })); }
    function nextTurn() {
      if (!play || !play.on) return;
      play.turn++; play.roll = null; play.steps = 0; play.drawn = null;
      var pc = currentPiece();
      if (pc.skip) { pc.skip = 0; ctx.announce(t('skipTurn', { name: pc.name })); play.turn++; }
      updateTurnBar(); drawOverlay(); renderInspector();
      ctx.announce(t('turnOf', { name: currentPiece().name }));
    }

    /* ---------- Estructura e inspector ---------- */
    function find(k, id) {
      if (k === 'card') return S.deck.filter(function (c) { return c.id === id; })[0] || null;
      if (k === 'die') return S.dice.filter(function (c) { return c.id === id; })[0] || null;
      if (k === 'piece') return S.pieces.filter(function (c) { return c.id === id; })[0] || null;
      if (k === 'rules') return S.rules;
      if (k === 'cell') return B().cells[+id] ? { id: id, i: +id } : null;
      return null;
    }
    function selObj() { return sel ? find(sel.k, sel.id) : null; }
    function select(k, id, fromList) {
      sel = k && find(k, id) ? { k: k, id: String(id) } : null;
      if (sel && fromList) {
        var want = { card: 'cards', rules: 'rules', die: 'balance', piece: 'board', cell: 'board' }[k];
        if (want && want !== view) setView(want, true);
      }
      if (sel && sel.k === 'cell') { kc = +sel.id; cursorShown = true; }
      drawBoard(); drawOverlay(); if (view !== 'board') renderDoc();
      renderStructure(); renderInspector();
      var o = selObj();
      if (o) ctx.announce(k === 'cell' ? t('cellAt', { n: +id + 1, t: tname(B().cells[+id].t) }) : t('selectedItem', { kind: t('kind_' + k), name: o.title || o.name || dieName(o) || t('kind_' + k) }));
      else ctx.announce(t('deselected'));
    }
    function renderStructure() {
      var active = D.activeElement && ctx.structure.contains(D.activeElement) ? D.activeElement.dataset.skey : null;
      var out = [];
      var docB = h('button', { type: 'button', 'aria-current': String(!sel), 'data-skey': 'doc' }, h('span', { class: 'igs-swatch igj-sw-game' }), h('span', { text: S.name }), h('small', { text: t('kind_game') }));
      docB.addEventListener('click', function () { select(null); });
      out.push(h('ul', { class: 'igs-list' }, h('li', null, docB)));
      var rulesB = h('button', { type: 'button', 'aria-current': String(!!(sel && sel.k === 'rules')), 'data-skey': 'rules' }, h('span', { class: 'igs-swatch igj-sw-rules' }), h('span', { text: t('kind_rules') }), h('small', { text: t('rulesN', { n: ruleCount() }) }));
      rulesB.addEventListener('click', function () { select('rules', 'rules', true); });
      out.push(h('ul', { class: 'igs-list' }, h('li', null, rulesB)));
      var ulC = h('ul', { class: 'igs-list' });
      S.deck.forEach(function (c) {
        var b = h('button', { type: 'button', 'aria-current': String(!!(sel && sel.k === 'card' && sel.id === c.id)), 'data-skey': 'card:' + c.id },
          h('span', { class: 'igs-swatch', style: 'background:' + c.colour }), h('span', { text: c.title }), h('small', { text: String(c.value) + ((c.copies || 1) > 1 ? ' ×' + c.copies : '') }));
        b.addEventListener('click', function () { select('card', c.id, true); });
        ulC.appendChild(h('li', null, b));
      });
      var addC = ctx.button(t('addCard'), { icon: 'plus', class: 'igj-add', dataset: { skey: 'add:card' } });
      addC.addEventListener('click', function () { addCard(); });
      out.push(h('h3', { text: t('cardsTitle') + ' (' + deckSize() + ')' }), ulC, addC);
      var ulD = h('ul', { class: 'igs-list' });
      S.dice.forEach(function (d) {
        var b = h('button', { type: 'button', 'aria-current': String(!!(sel && sel.k === 'die' && sel.id === d.id)), 'data-skey': 'die:' + d.id },
          h('span', { class: 'igs-swatch igj-sw-die' }), h('span', { text: dieName(d) }), h('small', { text: t('facesN', { n: dieFaces(d) }) }));
        b.addEventListener('click', function () { select('die', d.id, true); });
        ulD.appendChild(h('li', null, b));
      });
      var addD = ctx.button(t('addDie'), { icon: 'plus', class: 'igj-add', dataset: { skey: 'add:die' } });
      addD.addEventListener('click', function () { addDie(); });
      out.push(h('h3', { text: t('diceTitle') + ' (' + S.dice.length + ')' }), ulD, addD);
      var ulP = h('ul', { class: 'igs-list' });
      S.pieces.forEach(function (pc, i) {
        var b = h('button', { type: 'button', 'aria-current': String(!!(sel && sel.k === 'piece' && sel.id === pc.id)), 'data-skey': 'piece:' + pc.id },
          h('span', { class: 'igs-swatch', style: 'background:' + pc.colour }), h('span', { text: pc.name }), h('small', { text: t('cellN', { n: pc.cell + 1 }) }));
        b.addEventListener('click', function () { select('piece', pc.id, true); });
        ulP.appendChild(h('li', null, b));
      });
      var addP = ctx.button(t('addPiece'), { icon: 'plus', class: 'igj-add', dataset: { skey: 'add:piece' } });
      addP.addEventListener('click', function () { addPiece(); });
      out.push(h('h3', { text: t('piecesTitle') + ' (' + S.pieces.length + ')' }), ulP, addP);
      ctx.setStructure(out);
      if (active) { var f = ctx.structure.querySelector('[data-skey="' + String(active).replace(/"/g, '') + '"]'); if (f) f.focus(); }
    }
    function fk(wrap, key) { var ins = wrap.querySelectorAll('input,select,textarea'); Array.prototype.forEach.call(ins, function (inp, i) { inp.dataset.fkey = ins.length > 1 ? key + '-' + i : key; }); return wrap; }
    var live = { goals: null, rules: null };
    function goalsNode() {
      var ul = h('ul', { class: 'igj-checks' });
      goals().forEach(function (g) {
        var li = h('li', { 'data-ok': String(g.ok) }, h('span', { class: 'igj-mark', 'aria-hidden': 'true', text: g.ok ? '✓' : '·' }), h('span', { class: 'igs-sr', text: (g.ok ? t('done') : t('pending')) + ': ' }),
          h('div', null, h('strong', { text: g.title }), g.detail ? h('span', { class: 'igj-sub', text: g.detail }) : null));
        if (g.parts) { var sub = h('ul', { class: 'igj-subchecks' }); g.parts.forEach(function (p) { sub.appendChild(h('li', { 'data-ok': String(p[0]) }, h('span', { 'aria-hidden': 'true', text: p[0] ? '✓ ' : '○ ' }), h('span', { class: 'igs-sr', text: (p[0] ? t('done') : t('pending')) + ': ' }), p[1])); }); li.lastChild.appendChild(sub); }
        ul.appendChild(li);
      });
      return ul;
    }
    function updateLive() { if (live.goals && live.goals.isConnected) { ctx.clear(live.goals); live.goals.appendChild(goalsNode()); } }
    function renderInspector(focusKey) {
      clearTimeout(inspTimer);
      var keep = focusKey || (D.activeElement && ctx.inspector.contains(D.activeElement) ? D.activeElement.dataset.fkey : null);
      var out;
      if (play && play.on) out = playInspector();
      else if (!sel) out = docInspector();
      else if (sel.k === 'card') out = cardInspector(selObj());
      else if (sel.k === 'die') out = dieInspector(selObj());
      else if (sel.k === 'piece') out = pieceInspector(selObj());
      else if (sel.k === 'cell') out = cellInspector(+sel.id);
      else out = rulesInspector();
      ctx.setInspector(out);
      if (keep) { var n = ctx.inspector.querySelector('[data-fkey="' + String(keep).replace(/"/g, '') + '"]'); if (n) n.focus(); }
    }
    function docInspector() {
      var b = B(), out = [h('h4', { text: t('gameTitle') })];
      out.push(fk(F.text(t('gameName'), S.name, { max: 60, onChange: function (v) { S.name = String(v).trim().slice(0, 60) || S.name; changed(t('renamed')); } }), 'gname'));
      out.push(fk(F.number(t('playersLabel'), S.players, { min: 1, max: 6, step: 1, onChange: function (v) { S.players = Math.max(1, Math.min(6, Math.round(v))); changed(t('changedWord'), true); } }), 'players'));
      out.push(h('h4', { text: t('challenges') }));
      live.goals = h('div', null, goalsNode()); out.push(live.goals);
      out.push(h('h4', { text: t('boardTitle') }));
      out.push(fk(F.choice(t('boardKind'), b.kind, [['track', t('bk_track')], ['grid', t('bk_grid')], ['hex', t('bk_hex')]], { onChange: function (v) { changeKind(v); } }), 'bkind'));
      out.push(h('div', { class: 'igj-two' },
        fk(F.number(t('colsLabel'), b.w, { min: 2, max: 20, step: 1, onChange: function (v) { resizeBoard(Math.round(v), b.h); } }), 'bw'),
        fk(F.number(t('rowsLabel'), b.h, { min: 1, max: 20, step: 1, onChange: function (v) { resizeBoard(b.w, Math.round(v)); } }), 'bh')));
      out.push(h('p', { class: 'igs-muted', text: t('boardInfo', { n: cellCount(), kind: t('bk_' + b.kind) }) }));
      out.push(fk(F.check(t('numbering'), S.numbering, { onChange: function (v) { S.numbering = !!v; drawBoard(); } }), 'numb'));
      out.push(h('h4', { text: t('paintTitle') }));
      var pal = h('div', { class: 'igj-palette', role: 'radiogroup', 'aria-label': t('cellTypeLabel') });
      TYPES.forEach(function (k, i) {
        var sw = el('svg', { viewBox: '-12 -12 24 24', width: '22', height: '22', 'aria-hidden': 'true', focusable: 'false', class: 'igj-sw' });
        el('rect', { x: -11, y: -11, width: 22, height: 22, rx: 4, fill: TCOL[k], stroke: TINK[k], 'stroke-width': 1.4 }, sw);
        if (TSYM[k]) el('path', { d: TSYM[k], fill: 'none', stroke: TINK[k], 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, sw);
        var bt = h('button', { type: 'button', role: 'radio', 'aria-checked': String(k === cellType), tabindex: k === cellType ? '0' : '-1', 'data-fkey': 'type-' + k }, sw, h('span', { text: tname(k) }));
        bt.addEventListener('click', function () { setCellType(k); renderInspector('type-' + k); });
        bt.addEventListener('keydown', function (e) { var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return; e.preventDefault(); var nk = TYPES[(i + d + TYPES.length) % TYPES.length]; setCellType(nk); renderInspector('type-' + nk); });
        pal.appendChild(bt);
      });
      out.push(pal);
      if (cellType === 'advance' || cellType === 'back') out.push(fk(F.number(t('stepsLabel'), cellSteps, { min: 1, max: 12, step: 1, onChange: function (v) { cellSteps = Math.round(v); } }), 'steps'));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('playBtn'), { icon: 'play', class: 'igs-primary', dataset: { fkey: 'playb' }, onClick: startPlay }),
        ctx.button(t('view_balance'), { icon: 'sliders', dataset: { fkey: 'balb' }, onClick: function () { setView('balance'); } })));
      return out;
    }
    function cardInspector(c) {
      var out = [h('h4', { text: t('kind_card') + ': ' + c.title })];
      out.push(h('div', { class: 'igj-preview' }, cardNode(c)));
      out.push(fk(F.text(t('cardTitle'), c.title, { max: 40, onChange: function (v) { c.title = String(v).trim().slice(0, 40) || c.title; changed(t('changedWord')); } }), 'ctitle'));
      out.push(fk(F.text(t('cardText'), c.text, { multiline: true, max: 200, onChange: function (v) { c.text = String(v).slice(0, 200); changed(t('changedWord')); } }), 'ctext'));
      out.push(fk(F.number(t('cardValue'), c.value, { min: -20, max: 99, step: 1, onChange: function (v) { c.value = Math.round(v); changed(t('changedWord'), true); } }), 'cvalue'));
      out.push(fk(F.number(t('cardCopies'), c.copies || 1, { min: 1, max: 20, step: 1, onChange: function (v) { c.copies = Math.max(1, Math.min(20, Math.round(v))); changed(t('changedWord'), true); } }), 'ccopies'));
      var icons = h('div', { class: 'igj-icons', role: 'radiogroup', 'aria-label': t('cardIcon') });
      Object.keys(CARD_ICONS).forEach(function (k, i) {
        var sw = el('svg', { viewBox: '0 0 24 24', width: '22', height: '22', 'aria-hidden': 'true', focusable: 'false', class: 'igj-iconsw' });
        el('path', { d: CARD_ICONS[k] }, sw);
        var bt = h('button', { type: 'button', role: 'radio', 'aria-checked': String(k === c.icon), 'aria-label': t('icon_' + k), tabindex: k === c.icon ? '0' : '-1', 'data-fkey': 'icon-' + k }, sw);
        bt.addEventListener('click', function () { c.icon = k; changed(t('changedWord'), true, 'icon-' + k); });
        bt.addEventListener('keydown', function (e) { var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return; e.preventDefault(); var ks = Object.keys(CARD_ICONS), nk = ks[(i + d + ks.length) % ks.length]; c.icon = nk; changed(t('changedWord'), true, 'icon-' + nk); });
        icons.appendChild(bt);
      });
      out.push(h('div', { class: 'igs-field' }, h('span', { class: 'igj-flabel', text: t('cardIcon') }), icons));
      var cols = h('div', { class: 'igj-colours', role: 'radiogroup', 'aria-label': t('cardColour') });
      CARD_COLOURS.forEach(function (k, i) {
        var bt = h('button', { type: 'button', role: 'radio', 'aria-checked': String(k === c.colour), 'aria-label': t('colour_' + i), tabindex: k === c.colour ? '0' : '-1', style: 'background:' + k, 'data-fkey': 'col-' + i });
        bt.addEventListener('click', function () { c.colour = k; changed(t('changedWord'), true, 'col-' + i); });
        cols.appendChild(bt);
      });
      out.push(h('div', { class: 'igs-field' }, h('span', { class: 'igj-flabel', text: t('cardColour') }), cols));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('dupCard'), { icon: 'copy', dataset: { fkey: 'cdup' }, onClick: function () { dupCard(c); } }),
        ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', dataset: { fkey: 'cdel' }, onClick: function () { removeCard(c.id); } })));
      return out;
    }
    function dieInspector(d) {
      var out = [h('h4', { text: t('kind_die') + ': ' + dieName(d) })];
      out.push(fk(F.select(t('dieFacesLabel'), d.custom ? 'custom' : String(d.faces), DICE_FACES.map(function (n) { return [String(n), 'd' + n]; }).concat([['custom', t('dieCustomOpt')]]), { onChange: function (v) {
        if (v === 'custom') d.custom = d.custom || ['1', '1', '2', '2', '3', t('faceBlank')];
        else { d.custom = null; d.faces = +v; }
        changed(t('changedWord'), true);
      } }), 'dfaces'));
      if (d.custom) {
        out.push(fk(F.text(t('dieCustomFaces'), d.custom.join(', '), { max: 200, onChange: function (v) {
          var l = String(v).split(',').map(function (x) { return x.trim().slice(0, 12); }).filter(Boolean).slice(0, 20);
          if (l.length < 2) { ctx.announce(t('dieNeedFaces')); renderInspector('dcustom'); return; }
          d.custom = l; changed(t('changedWord'), true);
        } }), 'dcustom'));
        out.push(h('p', { class: 'igs-muted', text: t('dieCustomHelp') }));
      }
      var dist = sumDistribution();
      out.push(h('p', { class: 'igs-muted', text: t('diceLede', { dice: S.dice.map(dieName).join(' + '), min: dist[0].sum, max: dist[dist.length - 1].sum, mean: num(dist.reduce(function (a, x) { return a + x.sum * x.p; }, 0), 2) }) }));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('view_balance'), { icon: 'sliders', dataset: { fkey: 'dbal' }, onClick: function () { setView('balance'); } }),
        ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', dataset: { fkey: 'ddel' }, onClick: function () { removeDie(d.id); } })));
      return out;
    }
    function pieceInspector(pc) {
      var out = [h('h4', { text: t('kind_piece') + ': ' + pc.name })];
      out.push(fk(F.text(t('name'), pc.name, { max: 30, onChange: function (v) { pc.name = String(v).trim().slice(0, 30) || pc.name; changed(t('renamed')); } }), 'pname'));
      out.push(fk(F.number(t('cellLabel'), pc.cell + 1, { min: 1, max: cellCount(), step: 1, onChange: function (v) { pc.cell = Math.max(0, Math.min(cellCount() - 1, Math.round(v) - 1)); changed(t('movedWord'), true); } }), 'pcell'));
      var cols = h('div', { class: 'igj-colours', role: 'radiogroup', 'aria-label': t('pieceColour') });
      PIECE_COLOURS.forEach(function (k, i) {
        var bt = h('button', { type: 'button', role: 'radio', 'aria-checked': String(k === pc.colour), 'aria-label': t('colour_' + i), tabindex: k === pc.colour ? '0' : '-1', style: 'background:' + k, 'data-fkey': 'pcol-' + i });
        bt.addEventListener('click', function () { pc.colour = k; changed(t('changedWord'), true, 'pcol-' + i); });
        cols.appendChild(bt);
      });
      out.push(h('div', { class: 'igs-field' }, h('span', { class: 'igj-flabel', text: t('pieceColour') }), cols));
      out.push(h('p', { class: 'igs-muted', text: t('pieceMoveHelp') }));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', dataset: { fkey: 'pdel' }, onClick: function () { removePiece(pc.id); } })));
      return out;
    }
    function cellInspector(i) {
      var c = B().cells[i], out = [h('h4', { text: t('cellAt', { n: i + 1, t: tname(c.t) }) })];
      out.push(fk(F.select(t('cellTypeLabel'), c.t, TYPES.map(function (k) { return [k, tname(k)]; }), { onChange: function (v) { c.t = v; if (v !== 'advance' && v !== 'back') c.n = 0; else if (!c.n) c.n = cellSteps; changed(t('cellChanged', { n: i + 1, t: tname(v) }), true); } }), 'ctype'));
      if (c.t === 'advance' || c.t === 'back') out.push(fk(F.number(t('stepsLabel'), c.n || 1, { min: 1, max: 12, step: 1, onChange: function (v) { c.n = Math.round(v); changed(t('changedWord'), true); } }), 'cn'));
      var here = S.pieces.filter(function (p) { return p.cell === i; });
      out.push(h('p', { class: 'igs-muted', text: here.length ? t('piecesHere', { list: here.map(function (p) { return p.name; }).join(', ') }) : t('noPiecesHere') }));
      out.push(h('p', { class: 'igs-muted', text: t('cellHelp') }));
      return out;
    }
    function rulesInspector() {
      var R = S.rules, out = [h('h4', { text: t('kind_rules') + ' · ' + t('rulesN', { n: ruleCount() }) })];
      out.push(fk(F.text(t('rs_objective'), R.objective, { multiline: true, max: 300, onChange: function (v) { R.objective = String(v).slice(0, 300); changed(t('rulesChanged'), true); } }), 'robj'));
      RULE_SECTIONS.forEach(function (k) {
        var fs = h('fieldset', { class: 'igs-field igj-rows' }, h('legend', { text: t('rs_' + k) }));
        R[k].forEach(function (x, i) {
          var inp = h('input', { type: 'text', maxlength: 200, 'aria-label': t('ruleN', { sec: t('rs_' + k), n: i + 1 }), 'data-fkey': k + i }); inp.value = x;
          inp.addEventListener('change', function () { R[k][i] = String(inp.value).slice(0, 200); changed(t('rulesChanged'), true, k + i); });
          var del = h('button', { type: 'button', class: 'igs-btn igj-rowdel', 'aria-label': t('removeRule', { sec: t('rs_' + k), n: i + 1 }), 'data-fkey': k + i + 'x' }, ctx.icon('trash'));
          del.addEventListener('click', function () { R[k].splice(i, 1); changed(t('rulesChanged'), true, 'add' + k); });
          fs.appendChild(h('div', { class: 'igj-row' }, inp, del));
        });
        var add = ctx.button(t('addRule'), { icon: 'plus', dataset: { fkey: 'add' + k } });
        add.addEventListener('click', function () { if (R[k].length >= 30) return; R[k].push(''); changed(t('rulesChanged'), true, k + (R[k].length - 1)); });
        fs.appendChild(add); out.push(fs);
      });
      var rev = ruleReview();
      out.push(h('h4', { text: t('revTitle') }));
      if (!rev.length) out.push(h('p', { class: 'igs-result', 'data-kind': 'ok' }, h('strong', { text: t('revOk') })));
      else { var ul = h('ul', { class: 'igj-warn' }); rev.forEach(function (r) { ul.appendChild(h('li', { text: r.text })); }); out.push(h('p', { class: 'igs-result', 'data-kind': 'bad' }, h('strong', { text: t('revBad', { n: rev.length }) }))); out.push(ul); }
      out.push(h('p', { class: 'igs-muted', text: t('revNote') }));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('seeRules'), { icon: 'text', dataset: { fkey: 'seer' }, onClick: function () { setView('rules'); } })));
      return out;
    }
    function playInspector() {
      var out = [h('h4', { text: t('playTitle') })];
      out.push(h('p', { class: 'igs-result', 'data-kind': 'ok' }, h('strong', { text: t('turnOf', { name: currentPiece().name }) }), play.roll ? t('rolled', { r: play.roll }) : t('rollPrompt')));
      if (B().kind !== 'track') out.push(h('p', { class: 'igs-muted', text: t('stepsLeft', { n: play.steps }) + ' ' + t('moveHelp') }));
      else out.push(h('p', { class: 'igs-muted', text: t('trackHelp') }));
      if (play.drawn) out.push(h('div', { class: 'igj-preview' }, cardNode(play.drawn)));
      var ul = h('ul', { class: 'igs-list' });
      S.pieces.forEach(function (pc, i) {
        ul.appendChild(h('li', null, h('button', { type: 'button', 'aria-current': String(i === play.turn % S.pieces.length), 'data-fkey': 'pl' + i, on: { click: function () { play.turn = i; updateTurnBar(); renderInspector('pl' + i); drawOverlay(); } } },
          h('span', { class: 'igs-swatch', style: 'background:' + pc.colour }), h('span', { text: pc.name }), h('small', { text: t('cellN', { n: pc.cell + 1 }) }))));
      });
      out.push(h('h4', { text: t('piecesTitle') }), ul);
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('exitPlay'), { icon: 'stop', dataset: { fkey: 'exit' }, onClick: stopPlay })));
      out.push(h('p', { class: 'igs-muted', text: t('playNote') }));
      return out;
    }

    /* ---------- Cambios ---------- */
    var inspTimer = 0;
    function changed(label, reInspector, focusKey) {
      drawBoard(); drawOverlay(); if (view !== 'board') renderDoc();
      ctx.commit(label); renderStructure(); updateLive(); ctx.setSummary(summaryText());
      if (reInspector) { clearTimeout(inspTimer); inspTimer = setTimeout(function () { renderInspector(focusKey); }, 0); }
      ctx.announce(label);
    }
    function setCellType(k) { cellType = k; typeSel.value = k; ctx.announce(t('typeNow', { t: tname(k) })); }
    function changeKind(kind) {
      var b = B(), old = b.cells.slice();
      b.kind = kind;
      if (kind === 'track') { b.cells[0].t = 'start'; b.cells[b.cells.length - 1].t = 'goal'; }
      drawBoard(); fit(); changed(t('kindChanged', { kind: t('bk_' + kind) }), true);
      if (!old) return;
    }
    function resizeBoard(w, hh) {
      var b = B(), cells = [];
      for (var i = 0; i < w * hh; i++) cells.push(b.cells[i] ? { t: b.cells[i].t, n: b.cells[i].n } : { t: 'normal', n: 0 });
      b.w = w; b.h = hh; b.cells = cells;
      if (b.kind === 'track') { cells[0].t = 'start'; cells[cells.length - 1].t = 'goal'; }
      S.pieces.forEach(function (p) { p.cell = Math.min(p.cell, cells.length - 1); });
      kc = Math.min(kc, cells.length - 1);
      drawBoard(); fit(); changed(t('boardResized', { n: cells.length }), true);
    }
    function addCard(quiet) {
      var n = S.deck.length, c = { id: nid('c'), title: t('cardDefault', { n: n + 1 }), text: '', value: 1, icon: Object.keys(CARD_ICONS)[n % Object.keys(CARD_ICONS).length], colour: CARD_COLOURS[n % CARD_COLOURS.length], copies: 1 };
      S.deck.push(c); sel = { k: 'card', id: c.id };
      if (view !== 'cards') setView('cards', true);
      if (!quiet) changed(t('added', { kind: t('kind_card'), name: c.title }), true, 'ctitle');
      return c;
    }
    function dupCard(c) {
      var copy = JSON.parse(JSON.stringify(c)); copy.id = nid('c'); copy.title = c.title + ' (2)';
      S.deck.splice(S.deck.indexOf(c) + 1, 0, copy); sel = { k: 'card', id: copy.id };
      changed(t('added', { kind: t('kind_card'), name: copy.title }), true, 'ctitle');
    }
    function removeCard(id) { var c = find('card', id); if (!c) return; S.deck = S.deck.filter(function (x) { return x.id !== id; }); sel = null; changed(t('deletedItem', { name: c.title }), true); focusAdd('card'); }
    function addDie() { if (S.dice.length >= 6) { ctx.announce(t('maxDice')); return; } var d = { id: nid('d'), faces: 6, custom: null }; S.dice.push(d); sel = { k: 'die', id: d.id }; changed(t('added', { kind: t('kind_die'), name: dieName(d) }), true, 'dfaces'); }
    function removeDie(id) { if (S.dice.length <= 1) { ctx.announce(t('minDice')); return; } var d = find('die', id); S.dice = S.dice.filter(function (x) { return x.id !== id; }); sel = null; changed(t('deletedItem', { name: dieName(d) }), true); focusAdd('die'); }
    function addPiece(quiet) {
      var n = S.pieces.length;
      if (n >= 6) { ctx.announce(t('maxPieces')); return null; }
      var pc = { id: nid('p'), name: t('playerN', { n: n + 1 }), colour: PIECE_COLOURS[n % PIECE_COLOURS.length], cell: startCell(), skip: 0 };
      S.pieces.push(pc);
      if (!quiet) { sel = { k: 'piece', id: pc.id }; changed(t('added', { kind: t('kind_piece'), name: pc.name }), true, 'pname'); }
      return pc;
    }
    function removePiece(id) { var pc = find('piece', id); if (!pc) return; S.pieces = S.pieces.filter(function (x) { return x.id !== id; }); sel = null; changed(t('deletedItem', { name: pc.name }), true); focusAdd('piece'); }
    function focusAdd(k) { var b = ctx.structure.querySelector('[data-skey="add:' + k + '"]'); if (b) b.focus(); }

    /* ---------- Puntero y teclado en el tablero ---------- */
    function worldFromEvent(e) { var r = svg.getBoundingClientRect(); return V.toWorld(e.clientX - r.left, e.clientY - r.top); }
    function paintAt(i) {
      var c = B().cells[i], nt = cellType, nn = (nt === 'advance' || nt === 'back') ? cellSteps : 0;
      if (c.t === nt && c.n === nn) return false;
      c.t = nt; c.n = nn; return true;
    }
    svg.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || tool === 'pan') return;
      var w = worldFromEvent(e), i = cellFromPoint(w.x, w.y); if (i < 0) return;
      kc = i; cursorShown = false;
      if (play && play.on) { stepTo(i); return; }
      if (tool === 'paint') { painting = { any: false }; svg.setPointerCapture(e.pointerId); if (paintAt(i)) { painting.any = true; drawBoard(); } drawOverlay(); return; }
      if (tool === 'piece') { var pc = S.pieces.filter(function (p) { return p.cell === i; })[0]; if (pc) { select('piece', pc.id); } else { var np = addPiece(true); if (np) { np.cell = i; sel = { k: 'piece', id: np.id }; changed(t('added', { kind: t('kind_piece'), name: np.name }), true); } } return; }
      var onPiece = S.pieces.filter(function (p) { return p.cell === i; })[0];
      if (onPiece) select('piece', onPiece.id); else select('cell', String(i));
    });
    svg.addEventListener('pointermove', function (e) {
      if (!painting) return;
      var w = worldFromEvent(e), i = cellFromPoint(w.x, w.y);
      if (i >= 0 && paintAt(i)) { painting.any = true; drawBoard(); }
      if (i >= 0) { kc = i; drawOverlay(); }
    });
    function endPointer() { if (!painting) return; var any = painting.any; painting = null; if (any) changed(t('painted', { t: tname(cellType) }), !!(sel && sel.k === 'cell')); }
    svg.addEventListener('pointerup', endPointer); svg.addEventListener('pointercancel', endPointer);

    function moveCursor(dc, dr) {
      var b = B(), p = rowColOf(kc), c = Math.max(0, Math.min(b.w - 1, p.c + dc)), r = Math.max(0, Math.min(b.h - 1, p.r + dr));
      kc = indexAt(c, r); cursorShown = true; drawOverlay();
      var cell = b.cells[kc], pcs = S.pieces.filter(function (x) { return x.cell === kc; });
      ctx.announce(t('cellAt', { n: kc + 1, t: tname(cell.t) }) + (cell.n ? ' ' + t('stepsN', { n: cell.n }) : '') + (pcs.length ? ' · ' + pcs.map(function (x) { return x.name; }).join(', ') : ''));
    }
    function onKey(e) {
      if (!vp.contains(e.target)) return false;
      var k = e.key;
      if (view !== 'board') {
        if (view === 'cards' && S.deck.length && e.target === vp) {
          var dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[k];
          if (dir) { var cur = sel && sel.k === 'card' ? S.deck.map(function (c) { return c.id; }).indexOf(sel.id) : -1; select('card', S.deck[(cur + dir + S.deck.length) % S.deck.length].id); return true; }
        }
        if (k === 'Escape' && sel) { select(null); return true; }
        return false;
      }
      var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
      if (play && play.on) {
        if (d) { var b = B(), p = rowColOf(kc); if (B().kind === 'track') { kc = Math.max(0, Math.min(cellCount() - 1, kc + (d[0] || d[1]))); cursorShown = true; drawOverlay(); ctx.announce(t('cellAt', { n: kc + 1, t: tname(B().cells[kc].t) })); } else moveCursor(d[0], d[1]); return true; }
        if (k === 'Enter' || k === ' ') { stepTo(kc); return true; }
        if (k === 'r' || k === 'R') { doRoll(); return true; }
        if (k === 'c' || k === 'C') { doDraw(); return true; }
        if (k === 'n' || k === 'N') { nextTurn(); return true; }
        if (k === 'Escape') { stopPlay(); return true; }
        return false;
      }
      if (d && sel && sel.k === 'piece') {
        var pc = selObj(), b2 = B(), q = rowColOf(pc.cell);
        var nc = Math.max(0, Math.min(b2.w - 1, q.c + d[0])), nr = Math.max(0, Math.min(b2.h - 1, q.r + d[1]));
        pc.cell = indexAt(nc, nr); kc = pc.cell;
        drawBoard(); drawOverlay(); clearTimeout(keyTimer); keyTimer = setTimeout(function () { changed(t('movedWord'), true); }, 350);
        ctx.announce(t('pieceAt', { name: pc.name, n: pc.cell + 1, t: tname(B().cells[pc.cell].t) })); return true;
      }
      if (d) { moveCursor(d[0], d[1]); return true; }
      if (k === 'Enter' || k === ' ') {
        if (tool === 'paint') { if (paintAt(kc)) changed(t('painted', { t: tname(cellType) }), !!(sel && sel.k === 'cell')); else ctx.announce(t('alreadyThat')); return true; }
        if (tool === 'piece') { var ex = S.pieces.filter(function (p) { return p.cell === kc; })[0]; if (ex) select('piece', ex.id); else { var np = addPiece(true); if (np) { np.cell = kc; sel = { k: 'piece', id: np.id }; changed(t('added', { kind: t('kind_piece'), name: np.name }), true); } } return true; }
        var onP = S.pieces.filter(function (p) { return p.cell === kc; })[0];
        if (onP) select('piece', onP.id); else select('cell', String(kc));
        return true;
      }
      if (k === '[' || k === ']') { var ix = TYPES.indexOf(cellType); setCellType(TYPES[(ix + (k === ']' ? 1 : -1) + TYPES.length) % TYPES.length]); if (!sel) renderInspector(); return true; }
      if ((k === 'Delete' || k === 'Backspace') && sel && sel.k === 'piece') { removePiece(sel.id); return true; }
      if (k === 'Escape' && sel) { select(null); return true; }
      if (k === '+' || k === '=') { zoomCentre(1.25); return true; }
      if (k === '-' || k === '_') { zoomCentre(1 / 1.25); return true; }
      if (k === '0') { fit(); return true; }
      return false;
    }
    var keyTimer = 0;

    function summaryText() {
      var b = B(), counts = {};
      b.cells.forEach(function (c) { counts[c.t] = (counts[c.t] || 0) + 1; });
      var specials = TYPES.filter(function (k) { return k !== 'normal' && counts[k]; }).map(function (k) { return tname(k).toLowerCase() + ': ' + counts[k]; }).join(', ');
      var base = t('summary', { name: S.name, kind: t('bk_' + b.kind).toLowerCase(), w: b.w, h: b.h, n: b.cells.length, specials: specials || t('noneWord'),
        cards: deckSize(), dice: S.dice.map(dieName).join(' + '), pieces: S.pieces.length, rules: ruleCount() });
      if (play && play.on) return base + ' ' + t('turnOf', { name: currentPiece().name }) + (play.roll ? ' ' + t('rolled', { r: play.roll }) : '');
      if (view !== 'board') return base + ' ' + t('viewNow', { v: t('view_' + view) });
      return base + ' ' + t('cursorSum', { n: kc + 1, t: tname(b.cells[kc] ? b.cells[kc].t : 'normal').toLowerCase() });
    }

    /* ---------- Herramientas ----------
       Una sola llamada a ctx.setTools: el núcleo añade un escuchador de teclado a la barra cada vez
       que se llama, así que las herramientas de partida se muestran y se ocultan en vez de rehacerse. */
    var typeSel = h('select', { 'aria-label': t('cellTypeLabel') });
    TYPES.forEach(function (k) { typeSel.appendChild(h('option', { value: k, text: tname(k) })); });
    typeSel.value = cellType;
    typeSel.addEventListener('change', function () { setCellType(typeSel.value); if (tool !== 'paint') ctx.selectTool('paint'); if (!sel) renderInspector(); });
    var viewSel = h('select', { 'aria-label': t('viewLabel') });
    ['board', 'cards', 'rules', 'balance'].forEach(function (v) { viewSel.appendChild(h('option', { value: v, text: t('view_' + v) })); });
    viewSel.addEventListener('change', function () { setView(viewSel.value); });
    /* En la barra con foco itinerante, las flechas izquierda y derecha pasan de largo por las listas
       desplegables; arriba y abajo siguen cambiando su valor. */
    function passThrough(selEl) {
      selEl.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault(); e.stopPropagation();
        var items = Array.prototype.filter.call(ctx.toolbar.querySelectorAll('button,select,input'), function (x) { return !x.disabled && x.offsetParent !== null; });
        var i = items.indexOf(selEl), n = items[(i + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length]; if (n) n.focus();
      });
    }
    passThrough(typeSel); passThrough(viewSel);
    var typeBox = h('label', { class: 'igs-inline-select' }, h('span', { text: t('cellTypeLabel') }), typeSel);
    var viewBox = h('label', { class: 'igs-inline-select' }, h('span', { text: t('viewLabel') }), viewSel);
    var sepEdit = h('span', { class: 'igs-sep', role: 'separator', 'aria-orientation': 'vertical' });
    var sepPlay = h('span', { class: 'igs-sep', role: 'separator', 'aria-orientation': 'vertical' });
    var btnPlay = ctx.button(t('playBtn'), { icon: 'play', onClick: startPlay });
    var btnBalance = ctx.button(t('view_balance'), { icon: 'sliders', onClick: function () { setView('balance'); } });
    var btnRoll = ctx.button(t('rollBtn'), { icon: 'sparkle', class: 'igs-primary', keys: 'R', onClick: doRoll });
    var btnDraw = ctx.button(t('drawBtn'), { icon: 'copy', keys: 'C', onClick: function () { doDraw(); } });
    var btnShuffle = ctx.button(t('shuffleBtn'), { icon: 'layers', onClick: doShuffle });
    var btnNext = ctx.button(t('nextBtn'), { icon: 'redo', keys: 'N', onClick: nextTurn });
    var btnExit = ctx.button(t('exitPlay'), { icon: 'stop', onClick: stopPlay });
    ctx.setTools([
      { id: 'select', label: t('toolSelect'), icon: 'select' },
      { id: 'paint', label: t('toolPaint'), icon: 'pen' },
      { id: 'piece', label: t('toolPiece'), icon: 'player' },
      { node: typeBox },
      { id: 'pan', label: t('toolPan'), icon: 'pan', level: 'more' },
      { node: sepEdit },
      { node: viewBox },
      { node: btnPlay },
      { node: btnBalance, level: 'more' },
      { node: btnRoll }, { node: btnDraw }, { node: btnShuffle }, { node: btnNext },
      { node: sepPlay }, { node: btnExit }
    ], { initial: 'paint' });
    var editOnly = [typeBox, sepEdit, viewBox, btnPlay, btnBalance], playOnly = [btnRoll, btnDraw, btnShuffle, btnNext, sepPlay, btnExit];
    function setPlayMode(on) {
      ['select', 'paint', 'piece', 'pan'].forEach(function (id) { var b = ctx.toolButton(id); if (b) b.hidden = on; });
      editOnly.forEach(function (n) { n.hidden = on; });
      playOnly.forEach(function (n) { n.hidden = !on; });
      var first = on ? btnRoll : ctx.toolButton('paint');
      Array.prototype.forEach.call(ctx.toolbar.querySelectorAll('button,select'), function (b) { b.tabIndex = b === first ? 0 : -1; });
    }
    setPlayMode(false);

    /* ---------- Impresión y exportaciones ---------- */
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    var CREDIT = 'IRIS GREEN · irisgreen.eu';
    function svgEl(w, h2, extra) {
      var s = D.createElementNS(SVGNS, 'svg');
      s.setAttribute('width', w + 'mm'); s.setAttribute('height', h2 + 'mm'); s.setAttribute('viewBox', '0 0 ' + w + ' ' + h2);
      s.setAttribute('xmlns', SVGNS); if (extra) Object.keys(extra).forEach(function (k) { s.setAttribute(k, extra[k]); });
      return s;
    }
    function creditText(s, x, y, anchor) {
      var e = el('text', { x: x, y: y, 'font-size': 2.6, fill: '#44586c', 'text-anchor': anchor || 'end', 'font-family': 'Atkinson Hyperlegible, Arial, sans-serif' }, s);
      e.textContent = CREDIT; return e;
    }
    /* Tablero a escala real repartido en hojas A4 (área útil 190 × 277 mm). */
    function boardPrintPages() {
      var b = boardBox(), mm = 18, W = (b.maxX - b.minX) / CELL * mm, H = (b.maxY - b.minY) / CELL * mm;
      var pw = 190, ph = 270, cols = Math.max(1, Math.ceil(W / pw)), rows = Math.max(1, Math.ceil(H / ph)), pages = [];
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        var s = svgEl(210, 297, { role: 'img' });
        var ti = el('title', {}, s); ti.textContent = t('boardSheet', { name: S.name, n: r * cols + c + 1, total: rows * cols });
        var ht = el('text', { x: 10, y: 8, 'font-size': 4, fill: '#172b42', 'font-family': 'Atkinson Hyperlegible, Arial, sans-serif' }, s);
        ht.textContent = t('boardSheet', { name: S.name, n: r * cols + c + 1, total: rows * cols });
        var g = el('g', { transform: 'translate(' + (10 - c * pw) + ',' + (12 - r * ph) + ') scale(' + (mm / CELL) + ')' }, s);
        var clone = world.cloneNode(true); clone.removeAttribute('transform');
        Array.prototype.forEach.call(clone.querySelectorAll('.igj-piece'), function (n) { n.remove(); });
        applyPrintStyles(clone);
        g.appendChild(clone);
        creditText(s, 200, 292);
        pages.push(s);
      }
      return pages;
    }
    function applyPrintStyles(node) {
      Array.prototype.forEach.call(node.querySelectorAll('.igj-cell'), function (n) {
        var k = (n.getAttribute('class').match(/igj-t-(\w+)/) || [])[1] || 'normal';
        n.setAttribute('fill', TCOL[k]); n.setAttribute('stroke', TINK[k]); n.setAttribute('stroke-width', '0.8');
      });
      Array.prototype.forEach.call(node.querySelectorAll('.igj-sym'), function (n) {
        var k = (n.getAttribute('class').match(/igj-sym-(\w+)/) || [])[1] || 'normal';
        n.setAttribute('fill', 'none'); n.setAttribute('stroke', TINK[k]); n.setAttribute('stroke-width', '1.6'); n.setAttribute('stroke-linejoin', 'round'); n.setAttribute('stroke-linecap', 'round');
      });
      Array.prototype.forEach.call(node.querySelectorAll('.igj-cellnum'), function (n) { n.setAttribute('font-size', '6'); n.setAttribute('fill', '#172b42'); n.setAttribute('font-family', 'Atkinson Hyperlegible, Arial, sans-serif'); });
      Array.prototype.forEach.call(node.querySelectorAll('.igj-track-line'), function (n) { n.setAttribute('fill', 'none'); n.setAttribute('stroke', '#c9d8e6'); n.setAttribute('stroke-width', '3'); });
      return node;
    }
    /* Cartas: 3 × 3 de 63 × 88 mm por A4, con marcas de corte. */
    function cardPrintPages() {
      var list = [];
      S.deck.forEach(function (c) { for (var k = 0; k < Math.max(1, c.copies || 1); k++) list.push(c); });
      if (!list.length) return [];
      var CW = 63, CH = 88, cols = 3, rows = 3, mx = (210 - cols * CW) / 2, my = (297 - rows * CH) / 2, pages = [];
      for (var p = 0; p < Math.ceil(list.length / 9); p++) {
        var s = svgEl(210, 297, { role: 'img' });
        var ti = el('title', {}, s); ti.textContent = t('cardSheet', { name: S.name, n: p + 1, total: Math.ceil(list.length / 9) });
        for (var i = 0; i < 9; i++) {
          var card = list[p * 9 + i]; if (!card) break;
          var cx = mx + (i % cols) * CW, cy = my + Math.floor(i / cols) * CH;
          var g = el('g', { transform: 'translate(' + cx + ',' + cy + ')' }, s);
          el('rect', { x: 0, y: 0, width: CW, height: CH, rx: 3, fill: '#ffffff', stroke: '#c9d8e6', 'stroke-width': 0.3 }, g);
          el('rect', { x: 0, y: 0, width: CW, height: 14, rx: 3, fill: card.colour }, g);
          el('rect', { x: 0, y: 11, width: CW, height: 3, fill: card.colour }, g);
          var ttl = el('text', { x: 5, y: 9.6, 'font-size': 5, 'font-weight': '700', fill: '#ffffff', 'font-family': 'Atkinson Hyperlegible, Arial, sans-serif' }, g);
          ttl.textContent = card.title.slice(0, 22);
          var vt = el('text', { x: CW - 5, y: 9.6, 'font-size': 5.4, 'font-weight': '700', fill: '#ffffff', 'text-anchor': 'end', 'font-family': 'Atkinson Hyperlegible, Arial, sans-serif' }, g);
          vt.textContent = String(card.value);
          var ig = el('g', { transform: 'translate(' + (CW / 2 - 12) + ',22) scale(1)' }, g);
          el('path', { d: CARD_ICONS[card.icon] || CARD_ICONS.star, fill: 'none', stroke: card.colour, 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, ig);
          wrapText(g, card.text, 5, 56, CW - 10, 4.2, 4.6, '#172b42');
          creditText(g, CW - 4, CH - 3.5);
          /* marcas de corte fuera de la carta */
          [[cx, cy], [cx + CW, cy], [cx, cy + CH], [cx + CW, cy + CH]].forEach(function (pt) {
            el('path', { d: 'M' + (pt[0] - 4) + ',' + pt[1] + 'h3M' + pt[0] + ',' + (pt[1] - 4) + 'v3', stroke: '#8a97a5', 'stroke-width': 0.2 }, s);
          });
        }
        pages.push(s);
      }
      return pages;
    }
    function wrapText(g, text, x, y, maxW, size, lh, fill) {
      var wordsArr = String(text || '').split(/\s+/).filter(Boolean), line = '', lines = [], perChar = size * 0.52;
      wordsArr.forEach(function (w) {
        var test = line ? line + ' ' + w : w;
        if (test.length * perChar > maxW && line) { lines.push(line); line = w; } else line = test;
      });
      if (line) lines.push(line);
      lines.slice(0, 8).forEach(function (l, i) {
        var e = el('text', { x: x, y: y + i * lh, 'font-size': size, fill: fill, 'font-family': 'Atkinson Hyperlegible, Arial, sans-serif' }, g);
        e.textContent = l;
      });
      return lines.length;
    }
    function rulesPrintPage() {
      var page = h('div', { class: 'igj-print' });
      page.appendChild(h('h1', { text: t('rulesOf', { name: S.name }) }));
      page.appendChild(h('p', { text: t('rulesMeta', { players: S.players, n: ruleCount() }) }));
      page.appendChild(h('h2', { text: t('rs_objective') }));
      page.appendChild(h('p', { text: S.rules.objective || t('noneYet') }));
      RULE_SECTIONS.forEach(function (k) {
        page.appendChild(h('h2', { text: t('rs_' + k) }));
        if (!S.rules[k].length) { page.appendChild(h('p', { text: t('noneYet') })); return; }
        var l = h(k === 'variants' ? 'ul' : 'ol');
        S.rules[k].forEach(function (x) { l.appendChild(h('li', { text: x })); });
        page.appendChild(l);
      });
      page.appendChild(h('h2', { text: t('componentsTitle') }));
      var comp = h('ul');
      comp.appendChild(h('li', { text: t('compBoard', { n: cellCount(), kind: t('bk_' + B().kind) }) }));
      comp.appendChild(h('li', { text: t('compCards', { n: deckSize() }) }));
      comp.appendChild(h('li', { text: t('compDice', { dice: S.dice.map(dieName).join(' + ') }) }));
      comp.appendChild(h('li', { text: t('compPieces', { n: S.pieces.length }) }));
      page.appendChild(comp);
      page.appendChild(h('p', { class: 'igj-print-credit', text: CREDIT }));
      return page;
    }
    function printAll() {
      var pages = boardPrintPages().concat(cardPrintPages()); pages.push(rulesPrintPage());
      ctx.printPages(pages); ctx.announce(t('printing', { n: pages.length }));
    }
    function printCards() { var p = cardPrintPages(); if (!p.length) { ctx.announce(t('deckEmpty')); return; } ctx.printPages(p); ctx.announce(t('printing', { n: p.length })); }
    function printBoard() { var p = boardPrintPages(); ctx.printPages(p); ctx.announce(t('printing', { n: p.length })); }
    function printRules() { ctx.printPages([rulesPrintPage()]); ctx.announce(t('printing', { n: 1 })); }
    function boardSVGString() {
      var b = boardBox(), pad = 10, W = b.maxX + pad * 2, H = b.maxY + pad * 2;
      var clone = world.cloneNode(true); clone.removeAttribute('transform');
      Array.prototype.forEach.call(clone.querySelectorAll('.igj-piece'), function (n) { n.remove(); }); /* el tablero se exporta vacío, listo para jugar */
      applyPrintStyles(clone);
      var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-pad) + ' ' + (-pad) + ' ' + W + ' ' + H + '" width="' + Math.round(W * 3) + '" height="' + Math.round(H * 3) + '" role="img">';
      s += '<title>' + esc(t('boardOf', { name: S.name })) + '</title><desc>' + esc(summaryText()) + '</desc>';
      s += '<rect x="' + (-pad) + '" y="' + (-pad) + '" width="' + W + '" height="' + H + '" fill="#ffffff"/>';
      s += new XMLSerializer().serializeToString(clone) + '</svg>';
      return s;
    }
    function boardCanvas(px) {
      return new Promise(function (resolve, reject) {
        var b = boardBox(), img = new Image(), url = URL.createObjectURL(new Blob([boardSVGString()], { type: 'image/svg+xml' }));
        img.onload = function () {
          var W = b.maxX + 20, H = b.maxY + 20, sc = (px || 1800) / W, c = D.createElement('canvas');
          c.width = Math.round(W * sc); c.height = Math.round(H * sc);
          var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url); resolve(ctx.canvasWithCredit(c, '#ffffff'));
        };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('svg')); };
        img.src = url;
      });
    }
    function rulesHTML() {
      var s = '<!DOCTYPE html><html lang="' + LANG + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(t('rulesOf', { name: S.name })) + '</title>';
      s += '<style>body{font-family:"Atkinson Hyperlegible",Arial,sans-serif;color:#172b42;background:#fff;max-width:48rem;margin:0 auto;padding:1.5rem;line-height:1.55}h2{border-bottom:2px solid #c9d8e6;padding-bottom:.2rem;margin-top:1.8rem}table{border-collapse:collapse}th,td{border:1px solid #c9d8e6;padding:.25rem .5rem;text-align:left}footer{margin-top:2rem;color:#44586c;font-size:.9rem}</style></head><body>';
      s += '<h1>' + esc(t('rulesOf', { name: S.name })) + '</h1><p>' + esc(t('rulesMeta', { players: S.players, n: ruleCount() })) + '</p>';
      s += '<h2>' + esc(t('rs_objective')) + '</h2><p>' + esc(S.rules.objective || t('noneYet')) + '</p>';
      RULE_SECTIONS.forEach(function (k) {
        s += '<h2>' + esc(t('rs_' + k)) + '</h2>';
        s += S.rules[k].length ? '<' + (k === 'variants' ? 'ul' : 'ol') + '>' + S.rules[k].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</' + (k === 'variants' ? 'ul' : 'ol') + '>' : '<p>' + esc(t('noneYet')) + '</p>';
      });
      s += '<h2>' + esc(t('componentsTitle')) + '</h2><ul><li>' + esc(t('compBoard', { n: cellCount(), kind: t('bk_' + B().kind) })) + '</li><li>' + esc(t('compCards', { n: deckSize() })) + '</li><li>' + esc(t('compDice', { dice: S.dice.map(dieName).join(' + ') })) + '</li><li>' + esc(t('compPieces', { n: S.pieces.length })) + '</li></ul>';
      if (S.deck.length) {
        s += '<h2>' + esc(t('cardsTitle')) + '</h2><table><caption>' + esc(t('deckCapList')) + '</caption><thead><tr><th scope="col">' + esc(t('cardTitle')) + '</th><th scope="col">' + esc(t('cardValue')) + '</th><th scope="col">' + esc(t('cardCopies')) + '</th><th scope="col">' + esc(t('cardText')) + '</th></tr></thead><tbody>';
        S.deck.forEach(function (c) { s += '<tr><td>' + esc(c.title) + '</td><td>' + c.value + '</td><td>' + (c.copies || 1) + '</td><td>' + esc(c.text) + '</td></tr>'; });
        s += '</tbody></table>';
      }
      return s + '<footer><p>' + esc(CREDIT) + ' · ' + esc(t('filesNote')) + '</p></footer></body></html>';
    }
    function rulesMarkdown() {
      var L = ['# ' + t('rulesOf', { name: S.name }), '', t('rulesMeta', { players: S.players, n: ruleCount() }), '', '## ' + t('rs_objective'), '', S.rules.objective || t('noneYet'), ''];
      RULE_SECTIONS.forEach(function (k) {
        L.push('## ' + t('rs_' + k), '');
        if (!S.rules[k].length) L.push(t('noneYet'), '');
        else { S.rules[k].forEach(function (x, i) { L.push((k === 'variants' ? '- ' : (i + 1) + '. ') + x); }); L.push(''); }
      });
      L.push('## ' + t('componentsTitle'), '', '- ' + t('compBoard', { n: cellCount(), kind: t('bk_' + B().kind) }), '- ' + t('compCards', { n: deckSize() }), '- ' + t('compDice', { dice: S.dice.map(dieName).join(' + ') }), '- ' + t('compPieces', { n: S.pieces.length }), '');
      if (S.deck.length) {
        L.push('## ' + t('cardsTitle'), '', '| ' + t('cardTitle') + ' | ' + t('cardValue') + ' | ' + t('cardCopies') + ' | ' + t('cardText') + ' |', '| --- | --- | --- | --- |');
        S.deck.forEach(function (c) { L.push('| ' + c.title + ' | ' + c.value + ' | ' + (c.copies || 1) + ' | ' + String(c.text).replace(/\|/g, '/') + ' |'); });
        L.push('');
      }
      L.push('---', '', CREDIT);
      return L.join('\n');
    }
    function fileBase() { return (plain(S.name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || (LANG === 'en' ? 'board-game' : 'juego')) + '-' + ctx.stamp(); }
    ctx.addExport(t('printGame'), printAll, 'file');
    ctx.addExport(t('exportPng'), function () { boardCanvas(1800).then(function (c) { return ctx.canvasBlob(c); }).then(function (b) { ctx.download(b, fileBase() + '-tablero.png'); }).catch(function () { ctx.announce(t('exportError')); }); });
    ctx.addExport(t('exportRulesHtml'), function () { ctx.download(new Blob([rulesHTML()], { type: 'text/html' }), fileBase() + '-reglas.html'); });
    ctx.addExport(t('exportRulesMd'), function () { ctx.download(new Blob([rulesMarkdown()], { type: 'text/markdown' }), fileBase() + '-reglas.md'); });
    ctx.command('play', t('playBtn'), t('playTitle'), startPlay);
    ctx.command('roll', t('rollBtn'), t('playTitle'), function () { if (play && play.on) doRoll(); else { startPlay(); doRoll(); } });
    ctx.command('sim', t('simRun', { n: 2000 }), t('view_balance'), function () { setView('balance'); runSimulation(2000); });
    ctx.command('print-cards', t('printCards'), t('fileMenu'), printCards);
    ctx.command('print-board', t('printBoard'), t('fileMenu'), printBoard);
    ctx.command('print-rules', t('printRules'), t('fileMenu'), printRules);
    ['board', 'cards', 'rules', 'balance'].forEach(function (v) { ctx.command('view-' + v, t('viewCmd', { v: t('view_' + v) }), t('viewLabel'), function () { setView(v); }); });
    ctx.command('add-card', t('addCard'), t('structure'), function () { addCard(); });
    ctx.command('add-piece', t('addPiece'), t('structure'), function () { addPiece(); });

    /* ---------- Puntos de partida ---------- */
    function setCells(spec) { Object.keys(spec).forEach(function (i) { var v = spec[i]; B().cells[+i] = { t: v[0], n: v[1] || 0 }; }); }
    function card(title, text, value, icon, colour, copies) { return { id: nid('c'), title: title, text: text, value: value, icon: icon, colour: colour, copies: copies || 1 }; }
    function example(id) {
      S = emptyGame(); sel = null; play = null; sim = null; seq = 0;
      if (id === 'race' || id === 'two') {
        var big = id === 'race';
        S.name = t(big ? 'exRaceName' : 'exTwoName');
        S.board = blankBoard('track', big ? 8 : 6, big ? 5 : 4);
        S.players = 2;
        if (big) setCells({ 6: ['advance', 3], 11: ['back', 2], 17: ['card'], 23: ['skip'], 28: ['advance', 2], 33: ['back', 3], 36: ['card'] });
        else setCells({ 4: ['advance', 2], 9: ['back', 2], 14: ['card'], 19: ['skip'] });
        S.dice = [{ id: nid('d'), faces: 6, custom: null }];
        S.pieces = [{ id: nid('p'), name: t('playerN', { n: 1 }), colour: PIECE_COLOURS[0], cell: 0, skip: 0 },
          { id: nid('p'), name: t('playerN', { n: 2 }), colour: PIECE_COLOURS[1], cell: 0, skip: 0 }];
        S.rules = { objective: t('exRaceObj'), setup: [t('exRaceSetup1'), t('exRaceSetup2')], turn: [t('exRaceTurn1'), t('exRaceTurn2'), t('exRaceTurn3')], end: [t('exRaceEnd1')], variants: [t('exRaceVar1')] };
        if (big) S.deck = [card(t('exCardWind'), t('exCardWindT'), 3, 'bolt', CARD_COLOURS[0], 2), card(t('exCardRest'), t('exCardRestT'), 0, 'clock', CARD_COLOURS[6], 2), card(t('exCardShort'), t('exCardShortT'), 2, 'leaf', CARD_COLOURS[1], 2)];
      } else if (id === 'cards') {
        S.name = t('exDeckName');
        S.board = blankBoard('grid', 5, 4); S.players = 2; S.numbering = true;
        setCells({ 0: ['start'], 19: ['goal'], 7: ['card'], 12: ['card'] });
        S.dice = [{ id: nid('d'), faces: 6, custom: null }];
        S.pieces = [{ id: nid('p'), name: t('playerN', { n: 1 }), colour: PIECE_COLOURS[0], cell: 0, skip: 0 },
          { id: nid('p'), name: t('playerN', { n: 2 }), colour: PIECE_COLOURS[1], cell: 0, skip: 0 }];
        var icons = Object.keys(CARD_ICONS);
        S.deck = [
          card(t('exC1'), t('exC1T'), 1, icons[0], CARD_COLOURS[0], 4), card(t('exC2'), t('exC2T'), 2, icons[3], CARD_COLOURS[1], 3),
          card(t('exC3'), t('exC3T'), 3, icons[5], CARD_COLOURS[2], 3), card(t('exC4'), t('exC4T'), 4, icons[9], CARD_COLOURS[3], 2),
          card(t('exC5'), t('exC5T'), 5, icons[11], CARD_COLOURS[4], 2)
        ];
        S.rules = { objective: t('exDeckObj'), setup: [t('exDeckSetup1'), t('exDeckSetup2')], turn: [t('exDeckTurn1'), t('exDeckTurn2'), t('exDeckTurn3')], end: [t('exDeckEnd1')], variants: [t('exDeckVar1')] };
      } else if (id === 'hex') {
        S.name = t('exHexName');
        S.board = blankBoard('hex', 7, 6); S.players = 2; S.numbering = false;
        setCells({ 0: ['start'], 41: ['goal'], 9: ['blocked'], 10: ['blocked'], 17: ['blocked'], 24: ['advance', 2], 31: ['back', 2], 20: ['card'], 27: ['skip'], 15: ['blocked'] });
        S.dice = [{ id: nid('d'), faces: 6, custom: null }, { id: nid('d'), faces: 6, custom: null }];
        S.pieces = [{ id: nid('p'), name: t('playerN', { n: 1 }), colour: PIECE_COLOURS[0], cell: 0, skip: 0 },
          { id: nid('p'), name: t('playerN', { n: 2 }), colour: PIECE_COLOURS[1], cell: 41, skip: 0 }];
        S.deck = [card(t('exH1'), t('exH1T'), 2, 'shield', CARD_COLOURS[0], 3), card(t('exH2'), t('exH2T'), 3, 'peak', CARD_COLOURS[5], 3), card(t('exH3'), t('exH3T'), 1, 'key', CARD_COLOURS[3], 4)];
        S.rules = { objective: t('exHexObj'), setup: [t('exHexSetup1'), t('exHexSetup2')], turn: [t('exHexTurn1'), t('exHexTurn2'), t('exHexTurn3')], end: [t('exHexEnd1')], variants: [t('exHexVar1'), t('exHexVar2')] };
      }
      kc = 0;
      drawBoard(); setView('board', true); fit(); renderStructure(); renderInspector();
    }

    /* ---------- Guardar / abrir ---------- */
    function str(v, max) { return typeof v === 'string' && v.length <= (max || 400); }
    function int(v, a, b) { return Number.isInteger(v) && v >= a && v <= b; }
    function validate(d) {
      if (!d || typeof d !== 'object' || !str(d.name, 80) || !int(d.players, 1, 6) || !d.board || !d.rules) return false;
      var b = d.board;
      if (['track', 'grid', 'hex'].indexOf(b.kind) < 0 || !int(b.w, 1, 30) || !int(b.h, 1, 30) || !Array.isArray(b.cells) || b.cells.length !== b.w * b.h) return false;
      if (!b.cells.every(function (c) { return c && TYPES.indexOf(c.t) >= 0 && int(c.n || 0, 0, 20); })) return false;
      if (!Array.isArray(d.deck) || d.deck.length > 120 || !Array.isArray(d.dice) || d.dice.length < 1 || d.dice.length > 6 || !Array.isArray(d.pieces) || d.pieces.length > 8) return false;
      if (!d.deck.every(function (c) { return c && str(c.id, 20) && str(c.title, 60) && str(c.text, 300) && int(c.value, -99, 999) && CARD_ICONS[c.icon] && /^#[0-9a-fA-F]{6}$/.test(c.colour) && int(c.copies || 1, 1, 40); })) return false;
      if (!d.dice.every(function (x) { return x && str(x.id, 20) && (x.custom === null || x.custom === undefined ? DICE_FACES.indexOf(x.faces) >= 0 : Array.isArray(x.custom) && x.custom.length >= 2 && x.custom.length <= 20 && x.custom.every(function (f) { return str(f, 20); })); })) return false;
      if (!d.pieces.every(function (p) { return p && str(p.id, 20) && str(p.name, 40) && /^#[0-9a-fA-F]{6}$/.test(p.colour) && int(p.cell, 0, b.cells.length - 1); })) return false;
      var R = d.rules;
      if (!str(R.objective, 400)) return false;
      return RULE_SECTIONS.every(function (k) { return Array.isArray(R[k]) && R[k].length <= 40 && R[k].every(function (x) { return str(x, 300); }); });
    }

    drawBoard(); setView('board', true); renderStructure(); renderInspector();
    return {
      serialize: function () { return JSON.parse(JSON.stringify(S)); },
      restore: function (d) {
        S = JSON.parse(JSON.stringify(d)); syncSeq();
        if (sel && !find(sel.k, sel.id)) sel = null;
        play = null; turnBar.hidden = true; sim = null;
        kc = Math.min(kc, cellCount() - 1);
        setPlayMode(false); drawBoard(); if (view === 'board') { fit(); drawOverlay(); } else renderDoc();
        renderStructure(); renderInspector(); ctx.setSummary(summaryText());
      },
      validate: validate,
      start: function (id) {
        if (id === 'empty') { S = emptyGame(); seq = 0; sel = null; play = null; sim = null; kc = 0; drawBoard(); setView('board', true); fit(); renderStructure(); renderInspector(); }
        else example(id);
        setPlayMode(false);
      },
      onTool: function (id) { if (play && play.on) return; tool = id; painting = null; stage.dataset.tool = id; drawOverlay(); },
      onKey: onKey
    };
  }
})(window);
