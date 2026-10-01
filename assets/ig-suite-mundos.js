/* Iris Green · El taller · Estudio de mundos (R43).
   Mapa de terrenos en rejilla hexagonal o cuadrada (SVG propio) con pincel, relleno, ríos y lugares;
   generador de islas, archipiélagos y continentes con ruido y semilla reproducible.
   Fichas enlazadas: especies (hábitat → terrenos del mapa), culturas con lengua y calendario propio,
   historia con fechas de ese calendario y personajes con relaciones (gráfico + tabla alternativa).
   Exporta un atlas HTML accesible, el mapa en PNG y SVG, y lo imprime con el diálogo del navegador. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang, SVGNS = 'http://www.w3.org/2000/svg', SQ3 = Math.sqrt(3);
  var HEX_R = 10, SQ = 16;

  /* Terrenos: color de fondo y tinta de la textura (la textura distingue sin depender del color). */
  var TERR = ['water', 'coast', 'plain', 'forest', 'mountain', 'desert', 'ice', 'swamp'];
  var TCOL = { water: '#8cbfe3', coast: '#f1e2b3', plain: '#c5e09a', forest: '#6fae68', mountain: '#b5a797', desert: '#ecc97f', ice: '#f3f8fb', swamp: '#8fa88a' };
  var TINK = { water: '#2b6591', coast: '#8a6a22', plain: '#4f7424', forest: '#1f4d25', mountain: '#4f4234', desert: '#8a5c12', ice: '#5d7d97', swamp: '#2c4a34' };
  var TPAT = {
    water: [12, '<path d="M0 6q3-3 6 0t6 0" fill="none" stroke="INK" stroke-width="1"/>'],
    coast: [8, '<circle cx="2" cy="2" r=".95" fill="INK"/><circle cx="6" cy="6" r=".95" fill="INK"/>'],
    plain: [12, '<path d="M2 9l1.2-3 1.2 3M8 4l1.2-3 1.2 3" fill="none" stroke="INK" stroke-width=".9"/>'],
    forest: [12, '<path d="M6 1.5l3.6 6.5H2.4z" fill="INK"/><path d="M6 8v2.5" stroke="INK" stroke-width="1"/>'],
    mountain: [12, '<path d="M1.5 10l4.5-6.5 4.5 6.5" fill="none" stroke="INK" stroke-width="1.2" stroke-linejoin="round"/>'],
    desert: [10, '<path d="M0 10L10 0M-2 2L2-2M8 12l4-4" stroke="INK" stroke-width=".8"/>'],
    ice: [10, '<path d="M5 2v6M2 5h6" stroke="INK" stroke-width=".9"/>'],
    swamp: [12, '<path d="M1.5 8.5h7M3.5 8.5V5.5M6 8.5V6.5" fill="none" stroke="INK" stroke-width=".9"/>']
  };
  var PLACE_KINDS = ['city', 'village', 'port', 'ruin', 'landmark'];
  var DIETS = ['plants', 'meat', 'both', 'sun', 'filter'];
  var SIZES = ['tiny', 'small', 'medium', 'large', 'huge'];
  var RELS = ['family', 'friend', 'rival', 'mentor', 'ally'];
  var REL_STYLE = { family: [3.2, ''], friend: [1.8, ''], rival: [2.2, '7 5'], mentor: [2, '2 4'], ally: [2, '10 3 2 3'] };
  /* Sílabas curadas para el generador de nombres. */
  var SYL = {
    soft: 'la li lo ma mi na ne no ri ra sa se vi ve lu ya el an in ia',
    stone: 'kar dor gar tok bru dun rok tam gor bel dak kor um ag ul brim',
    sea: 'ma ra su ol me ta co al ni sal mar ola ne ru da bi',
    bright: 'ae li ori sol lin tel ia en va ri quel el sa ya dri fen'
  };
  /* Filtro de palabras malsonantes (ES/EN), en ROT13 para no dejarlas legibles en el código servido. */
  var BAD_SUB = 'chgn chgb zvreqn cbyyn wbqre pnoeba craqrw tvyvcbyy znevpba znevpn iretn mbeen vzorpvy rfghcvq fhoabezny zbatby sbyyne ubfgvn pubpub pbwba pnchyyb bwrgr cnwre pntne pntba ergenfnq anmv uvgyre ivbyne shpx fuvg phag ovgpu onfgneq juber fyhg avtt sntt ergneq jnax gjng cevpx cravf intvan qvyqb cbea encr xvyy obbo sneg cvff penc qvpx pbpx fhpx vqvbg zbeba';
  var BAD_EDGE = 'phyb pnpn crqb cvf grgn crar pbab znzba gbagb cvgb puhcn wbgb begb nff nefr gvg cbb ohz ohgg frk uryy qnza snt phz crr qhzo gheq nahf zngn zhre';
  function rot13(s) { return s.replace(/[a-z]/g, function (c) { return String.fromCharCode((c.charCodeAt(0) - 97 + 13) % 26 + 97); }); }
  var BADS = rot13(BAD_SUB).split(' '), BADE = rot13(BAD_EDGE).split(' ');
  function plain(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, ''); }
  function isBad(name) {
    var p = plain(name); if (!p) return false;
    if (BADS.some(function (w) { return p.indexOf(w) >= 0; })) return true;
    return BADE.some(function (w) { return p === w || p.indexOf(w) === 0 || p.slice(-w.length) === w; });
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function sylList(str) { return String(str || '').toLowerCase().split(/[\s,;]+/).map(function (x) { return x.replace(/[^a-záéíóúüñçàèìòùâêîôûäëïö'-]/g, ''); }).filter(function (x) { return x && x.length <= 5; }).slice(0, 60); }
  function makeName(sylls, rnd) {
    var list = sylList(sylls); if (list.length < 2) list = sylList(SYL.soft);
    for (var i = 0; i < 60; i++) {
      var n = 2 + (rnd() < 0.35 ? 1 : 0), s = '';
      for (var k = 0; k < n; k++) s += list[Math.floor(rnd() * list.length)];
      s = s.replace(/(.)\1\1+/g, '$1$1').replace(/'+/g, "'");
      if (s.length < 3 || s.length > 12 || isBad(s)) continue;
      return cap(s);
    }
    return cap(list[0] + list[1]);
  }
  /* Azar solo cuando la persona pulsa: semilla nueva desde el generador criptográfico del navegador. */
  function freshSeed() { var a = new Uint32Array(1); (root.crypto || root.msCrypto).getRandomValues(a); return a[0]; }

  IG.defineEngine('mundos', {
    version: 1, fileBase: LANG === 'en' ? 'world' : 'mundo',
    extraKeys: ['kWorldCursor', 'kWorldTerrain', 'kWorldViews'],
    initialStart: function (para) { return { child: 'island', teen: 'calendar', adult: 'atlas' }[para] || 'continent'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'island', title: t('stIsland'), desc: t('stIslandD'), para: 'child' },
        { id: 'calendar', title: t('stCalendar'), desc: t('stCalendarD'), para: 'teen' },
        { id: 'atlas', title: t('stAtlas'), desc: t('stAtlasD'), para: 'adult' },
        { id: 'continent', title: t('stContinent'), desc: t('stContinentD'), para: 'any' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport, num = ctx.num;
    var seq = 0, S = emptyWorld(), sel = null, viewMode = 'map', tool = 'brush', terrain = 'forest', brush = 1;
    var showTex = true, showGrid = false, showNames = true, atlasDone = false;
    var kc = { c: 0, r: 0 }, cursorShown = false, pendingRiver = null, moveMode = false, drag = null, painting = null;

    function emptyWorld() { return { v: 1, name: t('newWorldName'), map: blankMap('hex', 32, 22), places: [], species: [], cultures: [], events: [], characters: [], relations: [] }; }
    function blankMap(shape, w, hh) { return { shape: shape, w: w, h: hh, cells: new Array(w * hh).fill('water'), rivers: [], seed: '', gen: 'island' }; }
    function nid(p) { seq += 1; return p + seq; }
    function syncSeq() { ['places', 'species', 'cultures', 'events', 'characters', 'relations'].forEach(function (k) { S[k].forEach(function (o) { var n = parseInt(String(o.id).slice(1), 10); if (n > seq) seq = n; }); }); }
    function M() { return S.map; }
    function tname(k) { return t('terr_' + k); }
    function pct(v) { return num(v, 0) + (LANG === 'en' ? '%' : ' %'); }
    function list(k) { return { place: S.places, species: S.species, culture: S.cultures, event: S.events, character: S.characters }[k]; }
    function find(k, id) { var l = list(k) || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
    function selObj() { return sel ? find(sel.k, sel.id) : null; }

    /* ---------- Geometría de la rejilla ---------- */
    function ci(c, r) { return r * M().w + c; }
    function cr(i) { return { c: i % M().w, r: Math.floor(i / M().w) }; }
    function inb(c, r) { return c >= 0 && r >= 0 && c < M().w && r < M().h; }
    function centre(i, map) {
      map = map || M(); var c = i % map.w, r = Math.floor(i / map.w);
      if (map.shape === 'hex') return [HEX_R * SQ3 * (c + 0.5 * (r & 1)), HEX_R * 1.5 * r];
      return [(c + 0.5) * SQ, (r + 0.5) * SQ];
    }
    var HEXPTS = [0, 1, 2, 3, 4, 5].map(function (k) { var a = (60 * k - 30) * Math.PI / 180; return [HEX_R * Math.cos(a), HEX_R * Math.sin(a)]; });
    function cellPath(i, map) {
      map = map || M(); var p = centre(i, map);
      if (map.shape === 'hex') return 'M' + HEXPTS.map(function (q) { return (p[0] + q[0]).toFixed(2) + ',' + (p[1] + q[1]).toFixed(2); }).join('L') + 'Z';
      return 'M' + (p[0] - SQ / 2) + ',' + (p[1] - SQ / 2) + 'h' + SQ + 'v' + SQ + 'h-' + SQ + 'Z';
    }
    function bounds(map) {
      map = map || M();
      if (map.shape === 'hex') return { minX: -HEX_R * SQ3 / 2, minY: -HEX_R, maxX: HEX_R * SQ3 * (map.w - 1 + (map.h > 1 ? 0.5 : 0)) + HEX_R * SQ3 / 2, maxY: HEX_R * 1.5 * (map.h - 1) + HEX_R };
      return { minX: 0, minY: 0, maxX: map.w * SQ, maxY: map.h * SQ };
    }
    function cellAt(x, y) {
      var m = M();
      if (m.shape !== 'hex') { var c0 = Math.floor(x / SQ), r0 = Math.floor(y / SQ); return inb(c0, r0) ? ci(c0, r0) : -1; }
      var q = (SQ3 / 3 * x - y / 3) / HEX_R, rr = (2 / 3 * y) / HEX_R, s = -q - rr;
      var rq = Math.round(q), rrr = Math.round(rr), rs = Math.round(s);
      var dq = Math.abs(rq - q), dr = Math.abs(rrr - rr), ds = Math.abs(rs - s);
      if (dq > dr && dq > ds) rq = -rrr - rs; else if (dr > ds) rrr = -rq - rs;
      var col = rq + (rrr - (rrr & 1)) / 2;
      return inb(col, rrr) ? ci(col, rrr) : -1;
    }
    function neigh(i, map) {
      map = map || M(); var c = i % map.w, r = Math.floor(i / map.w), out = [], d;
      if (map.shape === 'hex') d = (r & 1) ? [[1, 0], [-1, 0], [1, -1], [0, -1], [1, 1], [0, 1]] : [[1, 0], [-1, 0], [0, -1], [-1, -1], [0, 1], [-1, 1]];
      else d = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      d.forEach(function (v) { var nc = c + v[0], nr = r + v[1]; if (nc >= 0 && nr >= 0 && nc < map.w && nr < map.h) out.push(nr * map.w + nc); });
      return out;
    }
    function brushCells(i) {
      var set = [i]; if (brush < 2) return set;
      var seen = {}; seen[i] = 1; var frontier = [i];
      for (var k = 1; k < brush; k++) { var next = []; frontier.forEach(function (x) { neigh(x).forEach(function (n) { if (!seen[n]) { seen[n] = 1; set.push(n); next.push(n); } }); }); frontier = next; }
      return set;
    }

    /* ---------- Generador de mapas (ruido de valor con semilla) ---------- */
    function noiseField(rnd, w, hh, octaves) {
      var layers = [];
      for (var o = 0; o < octaves; o++) {
        var cell = Math.max(2, Math.round(Math.max(w, hh) / (3 * Math.pow(2, o)))), gw = Math.ceil(w / cell) + 2, gh = Math.ceil(hh / cell) + 2, g = [];
        for (var k = 0; k < gw * gh; k++) g.push(rnd());
        layers.push({ cell: cell, gw: gw, g: g, amp: Math.pow(0.5, o) });
      }
      return function (x, y) {
        var v = 0, a = 0;
        layers.forEach(function (L) {
          var fx = x / L.cell, fy = y / L.cell, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
          tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
          function G(i, j) { return L.g[(j + 1) * L.gw + (i + 1)] || 0; }
          var top = G(x0, y0) * (1 - tx) + G(x0 + 1, y0) * tx, bot = G(x0, y0 + 1) * (1 - tx) + G(x0 + 1, y0 + 1) * tx;
          v += (top * (1 - ty) + bot * ty) * L.amp; a += L.amp;
        });
        return v / a;
      };
    }
    function generate(opts) {
      var shape = opts.shape || 'hex', w = opts.w || 32, hh = opts.h || 22, type = opts.type || 'island';
      var rnd = ctx.rng(String(opts.seed)), map = blankMap(shape, w, hh); map.seed = String(opts.seed); map.gen = type;
      var nE = noiseField(rnd, w, hh, 4), nM = noiseField(rnd, w, hh, 3), centres = [];
      if (type === 'archipelago') { var k = 4 + Math.floor(rnd() * 3); for (var q = 0; q < k; q++) centres.push([0.2 + rnd() * 0.6, 0.2 + rnd() * 0.6, 0.18 + rnd() * 0.12]); }
      var elev = [], moist = [], N = w * hh;
      for (var i = 0; i < N; i++) {
        var c = i % w, r = Math.floor(i / w), x = c + (shape === 'hex' && (r & 1) ? 0.5 : 0), y = r * (shape === 'hex' ? 0.866 : 1);
        var u = (c + 0.5) / w, v = (r + 0.5) / hh, e = nE(x, y), fall;
        if (type === 'archipelago') { fall = 0; centres.forEach(function (cc) { var d = Math.hypot((u - cc[0]) / cc[2], (v - cc[1]) / cc[2]); fall = Math.max(fall, 1 - d); }); e = e * 0.55 + fall * 0.6; }
        else { var dx = (u - 0.5) * 2, dy = (v - 0.5) * 2, d2 = dx * dx + dy * dy; e = e * (type === 'continent' ? 0.75 : 0.6) + (1 - d2) * (type === 'continent' ? 0.35 : 0.5); }
        elev.push(e); moist.push(nM(x, y));
      }
      var land = Math.max(0.1, Math.min(0.8, (opts.land || (type === 'continent' ? 55 : type === 'archipelago' ? 30 : 38)) / 100));
      var sorted = elev.slice().sort(function (a, b) { return a - b; }), sea = sorted[Math.floor((1 - land) * (N - 1))];
      var edge = type !== 'continent';
      for (var j = 0; j < N; j++) { var cj = j % w, rj = Math.floor(j / w); if (edge && (cj === 0 || rj === 0 || cj === w - 1 || rj === hh - 1)) elev[j] = Math.min(elev[j], sea - 0.01); }
      var landE = elev.filter(function (e) { return e > sea; }).sort(function (a, b) { return a - b; });
      function q(p) { return landE.length ? landE[Math.min(landE.length - 1, Math.floor(p * landE.length))] : 1; }
      var mountain = q(0.87), low = q(0.18), lowish = q(0.45);
      var landM = moist.filter(function (m, i) { return elev[i] > sea; }).sort(function (a, b) { return a - b; });
      function mq(p) { return landM.length ? landM[Math.min(landM.length - 1, Math.floor(p * landM.length))] : 0.5; }
      var dry = mq(0.2), wet = mq(0.5), soaked = mq(0.82);
      for (var z = 0; z < N; z++) {
        var ez = elev[z]; if (ez <= sea) { map.cells[z] = 'water'; continue; }
        var rz = Math.floor(z / w), lat = Math.abs((rz + 0.5) / hh * 2 - 1), temp = 1 - lat * 1.05 - Math.max(0, ez - sea) * 0.6, m = moist[z];
        var nearWater = neigh(z, map).some(function (n) { return elev[n] <= sea; });
        var tt;
        if (ez >= mountain) tt = 'mountain';
        else if (temp < 0.12) tt = 'ice';
        else if (nearWater && ez <= low) tt = 'coast';
        else if (m < dry && temp > 0.4) tt = 'desert';
        else if (m > soaked && ez <= lowish) tt = 'swamp';
        else if (m > wet) tt = 'forest';
        else tt = 'plain';
        map.cells[z] = tt;
      }
      /* Ríos: desde tierras altas, siempre cuesta abajo hasta el agua. */
      var wanted = opts.rivers === undefined ? 3 : opts.rivers, tries = 0, used = {};
      var sources = []; for (var s2 = 0; s2 < N; s2++) if (map.cells[s2] === 'mountain' || (map.cells[s2] !== 'water' && elev[s2] >= q(0.7))) sources.push(s2);
      while (map.rivers.length < wanted && tries++ < 80 && sources.length) {
        var src = sources[Math.floor(rnd() * sources.length)]; if (used[src]) continue;
        var path = [src], cur = src, ok = false;
        for (var st = 0; st < 60; st++) {
          var best = -1, be = elev[cur];
          neigh(cur, map).forEach(function (n) { if (elev[n] < be && path.indexOf(n) < 0) { be = elev[n]; best = n; } });
          if (best < 0) break;
          path.push(best); cur = best;
          if (map.cells[best] === 'water' || used[best]) { ok = true; break; }
        }
        if (ok && path.length >= 4) { map.rivers.push(path); path.forEach(function (p) { used[p] = 1; }); }
      }
      return { map: map, rnd: rnd, elev: elev };
    }
    function autoPlaces(map, rnd, count, sylls) {
      var cand = [], out = [];
      for (var i = 0; i < map.cells.length; i++) { var tt = map.cells[i]; if (tt === 'coast' || tt === 'plain' || tt === 'forest') cand.push(i); }
      for (var k = 0; k < 200 && out.length < count && cand.length; k++) {
        var i2 = cand[Math.floor(rnd() * cand.length)], p = { c: i2 % map.w, r: Math.floor(i2 / map.w) };
        if (out.some(function (o) { return Math.hypot(o.c - p.c, o.r - p.r) < Math.max(4, map.w / 7); })) continue;
        var kind = out.length === 0 ? 'city' : map.cells[i2] === 'coast' ? 'port' : 'village';
        out.push({ id: nid('p'), name: makeName(sylls || SYL.soft, rnd), kind: kind, c: p.c, r: p.r, text: '' });
      }
      return out;
    }

    /* ---------- Lienzo SVG ---------- */
    function el(name, attrs, parent) { var e = D.createElementNS(SVGNS, name); Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }); if (parent) parent.appendChild(e); return e; }
    function patternDefs(prefix) {
      return TERR.map(function (k) { var p = TPAT[k]; return '<pattern id="' + prefix + k + '" patternUnits="userSpaceOnUse" width="' + p[0] + '" height="' + p[0] + '"><rect width="' + p[0] + '" height="' + p[0] + '" fill="' + TCOL[k] + '"/>' + p[1].replace(/INK/g, TINK[k]) + '</pattern>'; }).join('');
    }
    function cellCss(prefix, scope) {
      return TERR.map(function (k) { return scope + ' .igw-t-' + k + '{fill:url(#' + prefix + k + ');stroke:' + TCOL[k] + '}' + scope + '.igw-flat .igw-t-' + k + '{fill:' + TCOL[k] + '}'; }).join('') +
        scope + ' .igw-c{stroke-width:.7}' + scope + '.igw-grid .igw-c{stroke:rgba(23,43,66,.28)}';
    }
    var stage = h('div', { class: 'igw-stage' });
    var defsSvg = el('svg', { class: 'igw-defs', width: '0', height: '0', 'aria-hidden': 'true', focusable: 'false' });
    defsSvg.innerHTML = '<defs>' + patternDefs('igw-p-') + '</defs><style>' + cellCss('igw-p-', '.igw-svg') + TERR.map(function (k) { return '.igw-sw .igw-t-' + k + '{fill:url(#igw-p-' + k + ')}.igw-sw.igw-flat .igw-t-' + k + '{fill:' + TCOL[k] + '}'; }).join('') + '</style>';
    var svg = el('svg', { class: 'igw-svg', 'aria-hidden': 'true', focusable: 'false' });
    var habStyle = el('style', {}, svg);
    var world = el('g', { class: 'igw-world' }, svg), cellsG = el('g', {}, world), riverG = el('g', { class: 'igw-rivers' }, world);
    var overlay = el('g', { class: 'igw-overlay' }, svg);
    var legend = h('ul', { class: 'igw-legend', 'aria-label': t('legend') });
    var docView = h('div', { class: 'igw-doc', hidden: true });
    var zoomBox = h('div', { class: 'igs-zoom igw-zoom' },
      ctx.button(t('zoomOut'), { icon: 'minus', onClick: function () { zoomCenter(1 / 1.25); } }),
      ctx.button(t('zoomFit'), { icon: 'fit', onClick: function () { fit(); } }),
      ctx.button(t('zoomIn'), { icon: 'plus', onClick: function () { zoomCenter(1.25); } }));
    stage.appendChild(svg); vp.append(defsSvg, stage, legend, zoomBox, docView); vp.classList.add('igw-viewport');
    ctx.setTech('renderer', 'SVG');

    var view = new ctx.View2D({ scale: 2, min: 0.4, max: 12, onChange: applyView });
    ctx.attachViewGestures(stage, view, { isPanTool: function () { return tool === 'pan'; } });
    function applyView() { world.setAttribute('transform', 'translate(' + view.x.toFixed(2) + ',' + view.y.toFixed(2) + ') scale(' + view.scale.toFixed(4) + ')'); drawOverlay(); }
    /* Encaja el mapa dejando libre la franja de la leyenda. */
    function fit() { var b = bounds(), lh = legend.hidden ? 0 : legend.offsetHeight + 6; view.fit(b, Math.max(200, stage.clientWidth), Math.max(160, stage.clientHeight - lh), 12); view.y += lh; view.onChange(); }
    function zoomCenter(f) { view.zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, f); }
    if (root.ResizeObserver) new ResizeObserver(function () { if (viewMode === 'map') fit(); }).observe(stage);

    var cellEls = [], builtKey = '';
    function buildCells() {
      var m = M(); builtKey = m.shape + m.w + 'x' + m.h;
      while (cellsG.firstChild) cellsG.removeChild(cellsG.firstChild);
      cellEls = [];
      var frag = D.createDocumentFragment();
      for (var i = 0; i < m.cells.length; i++) { var p = el('path', { d: cellPath(i), class: 'igw-c igw-t-' + m.cells[i] }); p.igT = m.cells[i]; frag.appendChild(p); cellEls.push(p); }
      cellsG.appendChild(frag);
    }
    function syncCells() {
      var m = M(); if (builtKey !== m.shape + m.w + 'x' + m.h) buildCells();
      for (var i = 0; i < m.cells.length; i++) if (cellEls[i].igT !== m.cells[i]) { cellEls[i].igT = m.cells[i]; cellEls[i].setAttribute('class', 'igw-c igw-t-' + m.cells[i]); }
      drawRivers(); svg.classList.toggle('igw-flat', !showTex); svg.classList.toggle('igw-grid', showGrid);
      updateHab(); renderLegend();
    }
    /* Río suavizado: curvas que pasan por el punto medio de cada tramo (sin esquinas). */
    function riverPath(path, map) {
      var P = path.map(function (i) { return centre(i, map); }), f = function (v) { return v.toFixed(1); };
      if (P.length < 3) return P.map(function (p, k) { return (k ? 'L' : 'M') + f(p[0]) + ',' + f(p[1]); }).join('');
      var d = 'M' + f(P[0][0]) + ',' + f(P[0][1]);
      for (var k = 1; k < P.length - 1; k++) { var mx = (P[k][0] + P[k + 1][0]) / 2, my = (P[k][1] + P[k + 1][1]) / 2; d += 'Q' + f(P[k][0]) + ',' + f(P[k][1]) + ' ' + f(mx) + ',' + f(my); }
      return d + 'L' + f(P[P.length - 1][0]) + ',' + f(P[P.length - 1][1]);
    }
    function drawRivers() {
      while (riverG.firstChild) riverG.removeChild(riverG.firstChild);
      M().rivers.forEach(function (rv) { if (rv.length < 2) return; var d = riverPath(rv); el('path', { d: d, class: 'igw-river-case' }, riverG); el('path', { d: d, class: 'igw-river' }, riverG); });
    }
    function updateHab() {
      var s = sel && sel.k === 'species' ? selObj() : null;
      svg.classList.toggle('igw-hab', !!(s && s.habitat.length));
      habStyle.textContent = s ? s.habitat.map(function (k) { return '.igw-hab .igw-t-' + k; }).join(',') + '{opacity:1}' : '';
    }
    function renderLegend() {
      ctx.clear(legend); var counts = terrCounts();
      TERR.forEach(function (k) {
        if (!counts[k] && viewMode === 'map' && terrain !== k) return;
        var sw = el('svg', { viewBox: '0 0 16 16', width: '16', height: '16', 'aria-hidden': 'true', focusable: 'false', class: 'igw-sw' + (showTex ? '' : ' igw-flat') });
        el('rect', { x: 0.5, y: 0.5, width: 15, height: 15, rx: 3, class: 'igw-t-' + k, 'stroke-width': 1, style: 'stroke:' + TINK[k] }, sw);
        legend.appendChild(h('li', { class: terrain === k ? 'igw-legend-on' : null }, sw, h('span', { text: tname(k) })));
      });
    }

    /* Capa en píxeles de pantalla: lugares, rótulos, cursor y río en curso (el texto no se deforma con el zoom). */
    function drawOverlay() {
      while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
      if (viewMode !== 'map') return;
      function P(i) { var c = centre(i); return view.toScreen(c[0], c[1]); }
      if (pendingRiver && pendingRiver.length) {
        var d = pendingRiver.map(function (i, k) { var p = P(i); return (k ? 'L' : 'M') + p.x + ',' + p.y; }).join('');
        el('path', { d: d, class: 'igw-river-pending' }, overlay);
        pendingRiver.forEach(function (i) { var p = P(i); el('circle', { cx: p.x, cy: p.y, r: 3.5, class: 'igw-river-dot' }, overlay); });
      }
      S.places.forEach(function (pl) {
        var p = P(ci(pl.c, pl.r)), isSel = sel && sel.k === 'place' && sel.id === pl.id;
        var g = el('g', { class: 'igw-place' + (isSel ? ' igw-sel' : ''), transform: 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')' }, overlay);
        if (isSel) el('circle', { r: 13, class: 'igw-selring' }, g);
        markerShape(pl.kind, g);
        if (showNames) { var tx = el('text', { x: 10, y: 4, class: 'igw-label' }, g); tx.textContent = pl.name; }
      });
      var cc = P(ci(kc.c, kc.r)), rad = Math.max(6, (M().shape === 'hex' ? HEX_R : SQ / 2) * view.scale);
      el('circle', { cx: cc.x, cy: cc.y, r: rad, class: 'igw-cursor' + (cursorShown ? '' : ' igw-cursor-dim') }, overlay);
      if (moveMode) { var sp = selObj(); if (sp) { var q = P(ci(sp.c, sp.r)); el('circle', { cx: q.x, cy: q.y, r: 18, class: 'igw-movering' }, overlay); } }
    }
    function markerShape(kind, g) {
      if (kind === 'city') el('rect', { x: -6, y: -6, width: 12, height: 12, class: 'igw-mk' }, g);
      else if (kind === 'port') { el('circle', { r: 6, class: 'igw-mk' }, g); el('path', { d: 'M0-3.5v7M-3 1.5q3 3 6 0', class: 'igw-mk-in' }, g); }
      else if (kind === 'ruin') el('path', { d: 'M0-7L6.5 5H-6.5Z', class: 'igw-mk igw-mk-open' }, g);
      else if (kind === 'landmark') el('path', { d: 'M0-7L2 -2 7-2 3 1.5 4.5 7 0 3.8-4.5 7-3 1.5-7-2-2-2Z', class: 'igw-mk' }, g);
      else el('circle', { r: 5, class: 'igw-mk' }, g);
    }

    /* ---------- Cálculos y comprobaciones ---------- */
    function terrCounts(map) { map = map || M(); var c = {}; TERR.forEach(function (k) { c[k] = 0; }); map.cells.forEach(function (k) { c[k] = (c[k] || 0) + 1; }); return c; }
    function isIsland() {
      var m = M(), landN = 0;
      for (var i = 0; i < m.cells.length; i++) {
        var p = cr(i); if (m.cells[i] === 'water') continue; landN++;
        if (p.c === 0 || p.r === 0 || p.c === m.w - 1 || p.r === m.h - 1) return false;
      }
      return landN > 0;
    }
    function habitatCells(sp) { var c = terrCounts(); return sp.habitat.reduce(function (a, k) { return a + (c[k] || 0); }, 0); }
    function calOf(cu) { return cu && cu.calendar; }
    function yearLen(cal) { return cal.months.reduce(function (a, m) { return a + (m.days || 0); }, 0); }
    function calProblems(cu) {
      var cal = cu.calendar, out = [];
      if (!cal.months.length) out.push(t('chkNoMonths', { name: cu.name }));
      cal.months.forEach(function (m, i) { if (!String(m.name).trim()) out.push(t('chkMonthName', { name: cu.name, n: i + 1 })); });
      if (!cal.week.filter(function (w) { return String(w).trim(); }).length) out.push(t('chkNoWeek', { name: cu.name }));
      cal.feasts.forEach(function (f) { var m = cal.months[f.month]; if (!m || f.day < 1 || f.day > m.days) out.push(t('chkFeastDay', { name: cu.name, feast: f.name })); });
      return out;
    }
    function calOk(cu) { var c = cu.calendar; return c.months.length >= 3 && c.week.length >= 3 && c.feasts.length >= 1 && !calProblems(cu).length; }
    function checks() {
      var out = [], counts = terrCounts();
      S.species.forEach(function (sp) {
        if (!sp.habitat.length) out.push(t('chkNoHabitat', { name: sp.name }));
        else sp.habitat.forEach(function (k) { if (!counts[k]) out.push(t('chkHabitatMissing', { name: sp.name, terr: tname(k).toLowerCase() })); });
      });
      S.cultures.forEach(function (cu) { out = out.concat(calProblems(cu)); });
      S.events.forEach(function (ev) {
        var cu = find('culture', ev.culture); if (!cu) return;
        var m = cu.calendar.months[ev.month]; if (!m || ev.day < 1 || ev.day > m.days) out.push(t('chkEventDate', { name: ev.title }));
      });
      S.places.forEach(function (pl) { if (M().cells[ci(pl.c, pl.r)] === 'water' && pl.kind !== 'port') out.push(t('chkPlaceWater', { name: pl.name })); });
      return out;
    }
    function goals() {
      var goodSp = S.species.filter(function (sp) { return sp.habitat.length && sp.habitat.every(function (k) { return terrCounts()[k] > 0; }); }).length;
      var island = isIsland(), calGood = S.cultures.some(calOk);
      var parts = [
        [S.places.length >= 3, t('gPlaces', { n: S.places.length })], [goodSp >= 3, t('gSpecies', { n: goodSp })], [calGood, t('gCalendar')],
        [S.events.length >= 3, t('gEvents', { n: S.events.length })], [S.characters.length >= 3, t('gChars', { n: S.characters.length })],
        [S.relations.length >= 2, t('gRels', { n: S.relations.length })], [atlasDone, t('gAtlas')]
      ];
      return [
        { ok: island && goodSp >= 3, title: t('ch1'), detail: t('ch1D', { island: island ? t('yes') : t('no'), n: goodSp }) },
        { ok: calGood, title: t('ch2'), detail: t('ch2D') },
        { ok: parts.every(function (p) { return p[0]; }), title: t('ch3'), parts: parts }
      ];
    }

    /* ---------- Fechas del calendario propio ---------- */
    function fmtDate(ev) {
      var cu = find('culture', ev.culture);
      if (!cu) return t('dateYearOnly', { y: ev.year });
      var m = cu.calendar.months[ev.month];
      return t('dateFmt', { d: ev.day, m: m ? m.name : '?', y: ev.year, era: cu.calendar.era || '' }).replace(/\s+$/, '');
    }
    function dateKey(ev) { var cu = find('culture', ev.culture), before = 0; if (cu) for (var i = 0; i < ev.month && i < cu.calendar.months.length; i++) before += cu.calendar.months[i].days; return ev.year * 100000 + before + (ev.day || 1); }

    /* ---------- Vistas: mapa, calendario, historia, relaciones ---------- */
    function setView(v, quiet) {
      viewMode = v; var isMap = v === 'map';
      stage.hidden = !isMap; legend.hidden = !isMap; zoomBox.hidden = !isMap; docView.hidden = isMap;
      /* El mapa es un lienzo con teclado propio; las demás vistas son documentos que se leen con normalidad. */
      if (isMap) { vp.setAttribute('role', 'application'); vp.setAttribute('aria-label', t('canvasLabel')); }
      else { vp.setAttribute('role', 'region'); vp.setAttribute('aria-label', t('view_' + v)); }
      viewSel.value = v;
      if (isMap) { fit(); drawOverlay(); } else renderDoc();
      if (!quiet) ctx.announce(t('viewNow', { v: t('view_' + v) }));
      summary();
    }
    function renderDoc() {
      ctx.clear(docView);
      if (viewMode === 'calendar') renderCalendar();
      else if (viewMode === 'timeline') renderTimeline();
      else if (viewMode === 'relations') renderRelations();
    }
    function currentCulture() { var s = sel && sel.k === 'culture' ? selObj() : null; return s || S.cultures[0] || null; }
    function calendarTables(cu, container, headingTag) {
      var cal = cu.calendar, W = cal.week.length || 1, yl = yearLen(cal), start = (((cal.year - 1) * yl) % W + W + (cal.first || 0)) % W, dayCount = 0;
      var feastsBy = {}; cal.feasts.forEach(function (f) { feastsBy[f.month + ':' + f.day] = f; });
      var grid = h('div', { class: 'igw-months' });
      cal.months.forEach(function (m, mi) {
        var tb = h('table', { class: 'igw-month' }, h('caption', { text: t('monthCap', { m: m.name, n: m.days }) }));
        var hr = h('tr'); cal.week.forEach(function (wd) { hr.appendChild(h('th', { scope: 'col' }, h('abbr', { title: wd, text: String(wd).slice(0, 2) }))); });
        tb.appendChild(h('thead', null, hr));
        var body = h('tbody'), row = h('tr'), col = (start + dayCount) % W;
        for (var e = 0; e < col; e++) row.appendChild(h('td', { class: 'igw-blank' }));
        for (var d = 1; d <= m.days; d++) {
          var f = feastsBy[mi + ':' + d];
          row.appendChild(h('td', { class: f ? 'igw-feast' : null }, h('span', { text: String(d) }), f ? h('span', { class: 'igs-sr', text: ' · ' + t('feastWord') + ': ' + f.name }) : null));
          col++; if (col === W && d < m.days) { body.appendChild(row); row = h('tr'); col = 0; }
        }
        while (col > 0 && col < W) { row.appendChild(h('td', { class: 'igw-blank' })); col++; }
        body.appendChild(row); tb.appendChild(body); grid.appendChild(tb); dayCount += m.days;
      });
      container.appendChild(grid);
      var fl = h('ul', { class: 'igw-feasts' });
      cal.feasts.slice().sort(function (a, b) { return a.month - b.month || a.day - b.day; }).forEach(function (f) { var m = cal.months[f.month]; fl.appendChild(h('li', null, h('strong', { text: f.name }), ' · ' + t('dateShort', { d: f.day, m: m ? m.name : '?' }))); });
      container.appendChild(h(headingTag, { text: t('feastsTitle') })); container.appendChild(cal.feasts.length ? fl : h('p', { class: 'igs-muted', text: t('noFeasts') }));
    }
    function renderCalendar() {
      var cu = currentCulture();
      if (!cu) { docView.appendChild(h('p', { class: 'igw-empty', text: t('calEmpty') })); docView.appendChild(ctx.button(t('addCulture'), { icon: 'plus', onClick: function () { addItem('culture'); } })); return; }
      var cal = cu.calendar;
      docView.appendChild(h('h3', { text: t('calTitle', { name: cu.name }) }));
      docView.appendChild(h('p', { class: 'igw-lede', text: t('calLede', { days: yearLen(cal), months: cal.months.length, week: cal.week.length, y: cal.year, era: cal.era || '' }) }));
      if (S.cultures.length > 1) {
        var row = h('div', { class: 'igs-actions' });
        S.cultures.forEach(function (c) { row.appendChild(ctx.button(c.name, { pressed: c === cu, onClick: function () { select('culture', c.id, true); } })); });
        docView.appendChild(row);
      }
      calendarTables(cu, docView, 'h4');
    }
    function renderTimeline() {
      docView.appendChild(h('h3', { text: t('view_timeline') }));
      if (!S.events.length) { docView.appendChild(h('p', { class: 'igw-empty', text: t('tlEmpty') })); docView.appendChild(ctx.button(t('addEvent'), { icon: 'plus', onClick: function () { addItem('event'); } })); return; }
      var ol = h('ol', { class: 'igw-timeline' });
      S.events.slice().sort(function (a, b) { return dateKey(a) - dateKey(b); }).forEach(function (ev) {
        var pl = find('place', ev.place), cu = find('culture', ev.culture);
        var b = h('button', { type: 'button', class: 'igw-tl-item', 'aria-current': String(!!(sel && sel.k === 'event' && sel.id === ev.id)) },
          h('span', { class: 'igw-tl-date', text: fmtDate(ev) }), h('strong', { text: ev.title }),
          ev.text ? h('span', { class: 'igw-tl-text', text: ev.text }) : null,
          (pl || cu) ? h('span', { class: 'igw-tl-meta', text: [pl ? t('whereLabel') + ': ' + pl.name : '', cu ? t('calendarOf', { name: cu.name }) : ''].filter(Boolean).join(' · ') }) : null);
        b.addEventListener('click', function () { select('event', ev.id, true); });
        ol.appendChild(h('li', null, b));
      });
      docView.appendChild(ol);
    }
    function relationSVG(forExport) {
      var n = S.characters.length, W = 560, H = Math.max(300, Math.min(520, 200 + n * 34)), cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 70, pos = {};
      S.characters.forEach(function (c, i) { var a = -Math.PI / 2 + i / Math.max(1, n) * Math.PI * 2; pos[c.id] = [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; });
      var s = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'igw-rel-svg', role: forExport ? 'img' : null, 'aria-hidden': forExport ? null : 'true', focusable: 'false' });
      if (forExport) { var tt = el('title', {}, s); tt.textContent = t('relTitle'); }
      S.relations.forEach(function (rl, ri) {
        var a = pos[rl.a], b = pos[rl.b]; if (!a || !b) return; var st = REL_STYLE[rl.kind] || REL_STYLE.friend;
        el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#44586c', 'stroke-width': st[0], 'stroke-dasharray': st[1] || null, 'stroke-linecap': 'round' }, s);
        var fr = ri % 2 ? 0.62 : 0.38, mx = a[0] + (b[0] - a[0]) * fr, my = a[1] + (b[1] - a[1]) * fr, lab = el('text', { x: mx, y: my + 4, 'text-anchor': 'middle', class: 'igw-rel-lab', 'font-size': '13', fill: '#172b42', stroke: '#fff', 'stroke-width': '5', 'paint-order': 'stroke', 'font-family': 'Atkinson Hyperlegible, Arial, sans-serif' }, s);
        lab.textContent = t('rel_' + rl.kind);
      });
      S.characters.forEach(function (c) {
        var p = pos[c.id], isSel = sel && sel.k === 'character' && sel.id === c.id;
        var g = el('g', { transform: 'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')', class: 'igw-node' + (isSel ? ' igw-sel' : ''), 'data-id': c.id }, s);
        el('circle', { r: 22, fill: isSel ? '#e7e2f8' : '#fff', stroke: isSel ? '#5a49a8' : '#17395c', 'stroke-width': isSel ? 4 : 2 }, g);
        var ini = el('text', { y: 6, 'text-anchor': 'middle', 'font-size': '16', 'font-weight': '700', fill: '#17395c', 'font-family': 'Atkinson Hyperlegible, Arial, sans-serif' }, g); ini.textContent = c.name.slice(0, 2);
        var nm = el('text', { y: 40, 'text-anchor': 'middle', 'font-size': '13', 'font-weight': '700', fill: '#172b42', stroke: '#fff', 'stroke-width': '4', 'paint-order': 'stroke', 'font-family': 'Atkinson Hyperlegible, Arial, sans-serif' }, g); nm.textContent = c.name;
      });
      return s;
    }
    function relTable() {
      var tb = h('table', { class: 'igs-table igw-rel-table' }, h('caption', { text: t('relTableCap') }),
        h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('colChar') }), h('th', { scope: 'col', text: t('colRel') }), h('th', { scope: 'col', text: t('colWith') }))));
      var body = h('tbody');
      S.relations.forEach(function (rl) { var a = find('character', rl.a), b = find('character', rl.b); if (a && b) body.appendChild(h('tr', null, h('td', { text: a.name }), h('td', { text: t('rel_' + rl.kind) }), h('td', { text: b.name }))); });
      tb.appendChild(body); return tb;
    }
    function renderRelations() {
      docView.appendChild(h('h3', { text: t('view_relations') }));
      if (!S.characters.length) { docView.appendChild(h('p', { class: 'igw-empty', text: t('relEmpty') })); docView.appendChild(ctx.button(t('addCharacter'), { icon: 'plus', onClick: function () { addItem('character'); } })); return; }
      var gsvg = relationSVG(false); docView.appendChild(h('div', { class: 'igw-rel-wrap' }, gsvg));
      gsvg.addEventListener('click', function (e) { var g = e.target.closest && e.target.closest('[data-id]'); if (g) select('character', g.getAttribute('data-id'), true); });
      var key = h('ul', { class: 'igw-rel-key', 'aria-label': t('relKey') });
      RELS.forEach(function (k) { var st = REL_STYLE[k], sw = el('svg', { viewBox: '0 0 40 10', width: '40', height: '10', 'aria-hidden': 'true', focusable: 'false' }); el('line', { x1: 2, y1: 5, x2: 38, y2: 5, stroke: '#44586c', 'stroke-width': st[0], 'stroke-dasharray': st[1] || null }, sw); key.appendChild(h('li', null, sw, h('span', { text: t('rel_' + k) }))); });
      docView.appendChild(key);
      docView.appendChild(h('div', { class: 'igs-table-wrap' }, relTable()));
      if (!S.relations.length) docView.appendChild(h('p', { class: 'igs-muted', text: t('relNone') }));
    }

    /* ---------- Selección, estructura e inspector ---------- */
    function select(k, id, fromList) {
      sel = k && id && find(k, id) ? { k: k, id: id } : null; moveMode = false;
      if (sel && fromList) { var want = { place: 'map', species: 'map', culture: 'calendar', event: 'timeline', character: 'relations' }[k]; if (want !== viewMode) setView(want, true); }
      updateHab(); drawOverlay(); if (viewMode !== 'map') renderDoc();
      renderStructure(); renderInspector(); summary();
      var o = selObj(); ctx.announce(o ? t('selectedItem', { kind: t('kind_' + k), name: o.name || o.title }) : t('deselected'));
    }
    var SKINDS = [['place', 'places'], ['species', 'speciesPl'], ['culture', 'cultures'], ['event', 'events'], ['character', 'characters']];
    function renderStructure() {
      var active = D.activeElement && ctx.structure.contains(D.activeElement) ? D.activeElement.dataset.skey : null;
      var out = [];
      var docB = h('button', { type: 'button', 'aria-current': String(!sel), 'data-skey': 'doc' }, h('span', { class: 'igs-swatch igw-world-sw' }), h('span', { text: S.name || t('newWorldName') }), h('small', { text: t('kind_world') }));
      docB.addEventListener('click', function () { select(null); });
      out.push(h('ul', { class: 'igs-list' }, h('li', null, docB)));
      SKINDS.forEach(function (pair) {
        var k = pair[0], items = list(k), ul = h('ul', { class: 'igs-list' });
        items.forEach(function (o) {
          var small = k === 'place' ? t('pk_' + o.kind) : k === 'species' ? o.habitat.map(function (x) { return tname(x); }).slice(0, 2).join(', ') : k === 'culture' ? t('monthsN', { n: o.calendar.months.length }) : k === 'event' ? t('yearN', { y: o.year }) : (find('culture', o.culture) || {}).name || '';
          var b = h('button', { type: 'button', 'aria-current': String(!!(sel && sel.k === k && sel.id === o.id)), 'data-skey': k + ':' + o.id },
            h('span', { class: 'igs-swatch igw-sw-' + k, 'aria-hidden': 'true' }), h('span', { text: o.name || o.title }), small ? h('small', { text: small }) : null);
          b.addEventListener('click', function () { select(k, o.id, true); });
          ul.appendChild(h('li', null, b));
        });
        var add = ctx.button(t('add_' + k), { icon: 'plus', class: 'igw-add', dataset: { skey: 'add:' + k } });
        add.addEventListener('click', function () { addItem(k); });
        out.push(h('h3', { text: t(pair[1]) + ' (' + items.length + ')' }), ul, add);
      });
      ctx.setStructure(out);
      if (active) { var f = ctx.structure.querySelector('[data-skey="' + active.replace(/"/g, '') + '"]'); if (f) f.focus(); }
    }
    function fk(wrap, key) { var ins = wrap.querySelectorAll('input,select,textarea'); Array.prototype.forEach.call(ins, function (inp, i) { inp.dataset.fkey = ins.length > 1 ? key + '-' + i : key; }); return wrap; }
    function nameRow(o, key, sylls) {
      var f = fk(F.text(t('name'), o.name, { max: 40, onChange: function (v) { v = String(v).trim().slice(0, 40); if (!v) { f.input.value = o.name; return; } o.name = v; changed(t('renamed')); } }), key);
      var b = ctx.button(t('otherName'), { icon: 'sparkle', class: 'igw-namebtn', dataset: { fkey: key + '-gen' } });
      b.addEventListener('click', function () { o.name = makeName(sylls(), ctx.rng(freshSeed())); f.input.value = o.name; changed(t('newNameIs', { name: o.name }), true, key + '-gen'); });
      return h('div', { class: 'igw-namerow' }, f, b);
    }
    function optList(k, none) { return [['', none]].concat(list(k).map(function (o) { return [o.id, o.name || o.title]; })); }
    function renderInspector(focusKey) {
      clearTimeout(inspTimer);
      var keep = focusKey || (D.activeElement && ctx.inspector.contains(D.activeElement) ? D.activeElement.dataset.fkey : null);
      var o = selObj(), out = [];
      if (!o) out = docInspector();
      else if (sel.k === 'place') out = placeInspector(o);
      else if (sel.k === 'species') out = speciesInspector(o);
      else if (sel.k === 'culture') out = cultureInspector(o);
      else if (sel.k === 'event') out = eventInspector(o);
      else out = characterInspector(o);
      ctx.setInspector(out);
      if (keep) { var n = ctx.inspector.querySelector('[data-fkey="' + String(keep).replace(/"/g, '') + '"]'); if (n) n.focus(); }
    }
    function delButton(k, o) { return h('div', { class: 'igs-actions' }, ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', dataset: { fkey: 'del' }, onClick: function () { removeItem(k, o.id); } })); }
    function worldSylls() { return S.cultures[0] ? S.cultures[0].lang.syl : SYL.soft; }
    function cultureSylls(id) { var cu = find('culture', id); return cu ? cu.lang.syl : worldSylls(); }

    /* Partes del panel del documento sin controles: se rehacen en su sitio con cada cambio. */
    var live = { goals: null, surface: null, checks: null };
    function goalsNode() {
      var ul = h('ul', { class: 'igw-checks' });
      goals().forEach(function (g) {
        var li = h('li', { 'data-ok': String(g.ok) }, h('span', { class: 'igw-mark', 'aria-hidden': 'true', text: g.ok ? '✓' : '·' }), h('span', { class: 'igs-sr', text: (g.ok ? t('done') : t('pending')) + ': ' }), h('div', null, h('strong', { text: g.title }), g.detail ? h('span', { class: 'igw-sub', text: g.detail }) : null));
        if (g.parts) { var sub = h('ul', { class: 'igw-subchecks' }); g.parts.forEach(function (p) { sub.appendChild(h('li', { 'data-ok': String(p[0]) }, h('span', { 'aria-hidden': 'true', text: p[0] ? '✓ ' : '○ ' }), h('span', { class: 'igs-sr', text: (p[0] ? t('done') : t('pending')) + ': ' }), p[1])); }); li.lastChild.appendChild(sub); }
        ul.appendChild(li);
      });
      return ul;
    }
    function surfaceNode() {
      var counts = terrCounts(), total = M().cells.length;
      var tb = h('table', { class: 'igs-table' }, h('caption', { text: t('surfaceCap') }), h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('colTerrain') }), h('th', { scope: 'col', text: t('colCells') }), h('th', { scope: 'col', text: '%' }))));
      var body = h('tbody'); TERR.forEach(function (k) { if (!counts[k]) return; body.appendChild(h('tr', null, h('th', { scope: 'row', text: tname(k) }), h('td', { class: 'igs-numcell', text: String(counts[k]) }), h('td', { class: 'igs-numcell', text: num(counts[k] / total * 100, 0) }))); });
      tb.appendChild(body); return h('div', { class: 'igs-table-wrap' }, tb);
    }
    function checksNode() {
      var cks = checks(), box = h('div', { class: 'igw-checkbox' });
      if (!cks.length) box.appendChild(h('p', { class: 'igs-result', 'data-kind': 'ok' }, h('strong', { text: t('checksOk') })));
      else { var cl = h('ul', { class: 'igw-warn' }); cks.forEach(function (c) { cl.appendChild(h('li', { text: c })); }); box.appendChild(h('p', { class: 'igs-result', 'data-kind': 'bad' }, h('strong', { text: t('checksBad', { n: cks.length }) }))); box.appendChild(cl); }
      return box;
    }
    function updateLive() {
      [['goals', goalsNode], ['surface', surfaceNode], ['checks', checksNode]].forEach(function (p) { var box = live[p[0]]; if (box && box.isConnected) { ctx.clear(box); box.appendChild(p[1]()); } });
    }
    function docInspector() {
      var out = [h('h4', { text: t('worldTitle') })];
      out.push(fk(F.text(t('worldName'), S.name, { max: 60, onChange: function (v) { S.name = String(v).trim().slice(0, 60) || S.name; changed(t('renamed')); } }), 'wname'));
      out.push(h('h4', { text: t('challenges') }));
      live.goals = h('div', null, goalsNode()); out.push(live.goals);
      out.push(h('h4', { text: t('terrainTitle') }));
      var pal = h('div', { class: 'igw-palette', role: 'radiogroup', 'aria-label': t('terrainLabel') });
      TERR.forEach(function (k, i) {
        var sw = el('svg', { viewBox: '0 0 20 20', width: '20', height: '20', 'aria-hidden': 'true', focusable: 'false', class: 'igw-sw' }); el('rect', { x: 0.5, y: 0.5, width: 19, height: 19, rx: 4, class: 'igw-t-' + k, style: 'stroke:' + TINK[k] }, sw);
        var b = h('button', { type: 'button', role: 'radio', 'aria-checked': String(k === terrain), tabindex: k === terrain ? '0' : '-1', 'data-fkey': 'terr-' + k }, sw, h('span', { text: tname(k) }));
        b.addEventListener('click', function () { setTerrain(k); renderInspector('terr-' + k); });
        b.addEventListener('keydown', function (e) { var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return; e.preventDefault(); var nk = TERR[(i + d + TERR.length) % TERR.length]; setTerrain(nk); renderInspector('terr-' + nk); });
        pal.appendChild(b);
      });
      out.push(pal);
      out.push(fk(F.choice(t('brushSize'), String(brush), [['1', t('brush1')], ['2', t('brush2')], ['3', t('brush3')]], { onChange: function (v) { brush = +v; ctx.announce(t('brushNow', { n: t('brush' + v) })); } }), 'brush'));
      out.push(h('h4', { text: t('mapTitle') }));
      var m = M();
      out.push(h('p', { class: 'igs-muted', text: t('mapInfo', { shape: t('shape_' + m.shape), w: m.w, h: m.h, seed: m.seed || '—' }) }));
      out.push(fk(F.choice(t('shapeLabel'), m.shape, [['hex', t('shape_hex')], ['square', t('shape_square')]], { onChange: function (v) { M().shape = v; buildCells(); syncCells(); fit(); changed(t('shapeChanged'), true); } }), 'shape'));
      out.push(fk(F.select(t('sizeLabel'), m.w + 'x' + m.h, sizeOptions(m), { onChange: function (v) { var p = v.split('x'); resizeMap(+p[0], +p[1]); } }), 'size'));
      out.push(fk(F.check(t('showTex'), showTex, { onChange: function (v) { showTex = !!v; syncCells(); } }), 'tex'));
      out.push(fk(F.check(t('showGrid'), showGrid, { onChange: function (v) { showGrid = !!v; syncCells(); } }), 'grid'));
      out.push(fk(F.check(t('showNames'), showNames, { onChange: function (v) { showNames = !!v; drawOverlay(); } }), 'names'));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('generateBtn') + '…', { icon: 'sparkle', dataset: { fkey: 'gen' }, onClick: function (e) { openGenerator(e && e.currentTarget); } }), ctx.button(t('namesBtn') + '…', { icon: 'text', dataset: { fkey: 'names' }, onClick: function (e) { openNames(e && e.currentTarget); } })));
      live.surface = h('div', null, surfaceNode()); out.push(live.surface);
      out.push(h('h4', { text: t('checksTitle') }));
      live.checks = h('div', null, checksNode()); out.push(live.checks);
      return out;
    }
    function sizeOptions(m) {
      var opts = [[16, 12], [24, 16], [32, 22], [40, 26], [48, 32]].map(function (s) { return [s[0] + 'x' + s[1], s[0] + ' × ' + s[1]]; });
      if (!opts.some(function (o) { return o[0] === m.w + 'x' + m.h; })) opts.push([m.w + 'x' + m.h, m.w + ' × ' + m.h]);
      return opts;
    }
    function resizeMap(w, hh) {
      var m = M(), cells = new Array(w * hh).fill('water');
      for (var r = 0; r < Math.min(hh, m.h); r++) for (var c = 0; c < Math.min(w, m.w); c++) cells[r * w + c] = m.cells[r * m.w + c];
      var ow = m.w; m.rivers = m.rivers.map(function (rv) { return rv.filter(function (i) { return i % ow < w && Math.floor(i / ow) < hh; }).map(function (i) { return Math.floor(i / ow) * w + i % ow; }); }).filter(function (rv) { return rv.length >= 2; });
      m.w = w; m.h = hh; m.cells = cells;
      S.places.forEach(function (p) { p.c = Math.min(p.c, w - 1); p.r = Math.min(p.r, hh - 1); });
      kc = { c: Math.min(kc.c, w - 1), r: Math.min(kc.r, hh - 1) };
      buildCells(); syncCells(); fit(); changed(t('resized'), true);
    }
    function placeInspector(o) {
      var out = [h('h4', { text: t('kind_place') + ': ' + o.name })];
      out.push(nameRow(o, 'pname', function () { return worldSylls(); }));
      out.push(fk(F.select(t('placeKind'), o.kind, PLACE_KINDS.map(function (k) { return [k, t('pk_' + k)]; }), { onChange: function (v) { o.kind = v; changed(t('changedWord')); } }), 'pkind'));
      out.push(h('div', { class: 'igw-two' },
        fk(F.number(t('colLabel'), o.c + 1, { min: 1, max: M().w, step: 1, onChange: function (v) { o.c = Math.round(v) - 1; changed(t('movedWord'), true); } }), 'pc'),
        fk(F.number(t('rowLabel'), o.r + 1, { min: 1, max: M().h, step: 1, onChange: function (v) { o.r = Math.round(v) - 1; changed(t('movedWord'), true); } }), 'pr')));
      var mb = ctx.button(moveMode ? t('moveCancel') : t('moveTap'), { icon: 'move', pressed: moveMode, dataset: { fkey: 'pmove' } });
      mb.addEventListener('click', function () { moveMode = !moveMode; if (viewMode !== 'map') setView('map', true); drawOverlay(); renderInspector('pmove'); ctx.announce(moveMode ? t('moveTapHelp') : t('cancelled')); });
      out.push(mb);
      out.push(h('p', { class: 'igs-muted', text: t('placeTerrain', { terr: tname(M().cells[ci(o.c, o.r)]) }) }));
      var here = M().cells[ci(o.c, o.r)], sp = S.species.filter(function (s) { return s.habitat.indexOf(here) >= 0; });
      out.push(h('p', { class: 'igs-muted', text: sp.length ? t('speciesHere', { list: sp.map(function (s) { return s.name; }).join(', ') }) : t('speciesHereNone') }));
      out.push(fk(F.text(t('description'), o.text, { multiline: true, max: 600, onChange: function (v) { o.text = String(v).slice(0, 600); changed(t('changedWord')); } }), 'ptext'));
      out.push(delButton('place', o));
      return out;
    }
    function speciesInspector(o) {
      var out = [h('h4', { text: t('kind_species') + ': ' + o.name })];
      out.push(nameRow(o, 'sname', function () { return worldSylls(); }));
      var counts = terrCounts(), fs = h('fieldset', { class: 'igs-field igw-habitat' }, h('legend', { text: t('habitat') }));
      TERR.forEach(function (k) {
        var id = 'igw-hab-' + k, inp = h('input', { type: 'checkbox', id: id, 'data-fkey': 'hab-' + k }); inp.checked = o.habitat.indexOf(k) >= 0;
        inp.addEventListener('change', function () { if (inp.checked) { if (o.habitat.indexOf(k) < 0) o.habitat.push(k); } else o.habitat = o.habitat.filter(function (x) { return x !== k; }); o.habitat.sort(function (a, b) { return TERR.indexOf(a) - TERR.indexOf(b); }); changed(t('habitatChanged'), true); });
        fs.appendChild(h('div', { class: 'igs-check' }, inp, h('label', { for: id, text: tname(k) + ' · ' + t('cellsN', { n: counts[k] || 0 }) })));
      });
      out.push(fs);
      var hc = habitatCells(o);
      out.push(h('p', { class: 'igs-result', 'data-kind': o.habitat.length && o.habitat.every(function (k) { return counts[k]; }) ? 'ok' : 'bad' }, o.habitat.length ? t('habitatInfo', { n: hc, p: num(hc / M().cells.length * 100, 0) }) : t('chkNoHabitat', { name: o.name })));
      out.push(fk(F.select(t('diet'), o.diet, DIETS.map(function (k) { return [k, t('diet_' + k)]; }), { onChange: function (v) { o.diet = v; changed(t('changedWord')); } }), 'sdiet'));
      out.push(fk(F.select(t('sizeWord'), o.size, SIZES.map(function (k) { return [k, t('size_' + k)]; }), { onChange: function (v) { o.size = v; changed(t('changedWord')); } }), 'ssize'));
      out.push(fk(F.text(t('traits'), o.traits, { multiline: true, max: 600, onChange: function (v) { o.traits = String(v).slice(0, 600); changed(t('changedWord')); } }), 'straits'));
      out.push(delButton('species', o));
      return out;
    }
    function cultureInspector(o) {
      var cal = o.calendar, out = [h('h4', { text: t('kind_culture') + ': ' + o.name })];
      out.push(nameRow(o, 'cname', function () { return o.lang.syl; }));
      out.push(fk(F.select(t('homeland'), o.place || '', optList('place', t('noneOpt')), { onChange: function (v) { o.place = v; changed(t('changedWord')); } }), 'cplace'));
      out.push(fk(F.text(t('description'), o.text, { multiline: true, max: 600, onChange: function (v) { o.text = String(v).slice(0, 600); changed(t('changedWord')); } }), 'ctext'));
      out.push(h('h4', { text: t('languageTitle') }));
      out.push(fk(F.text(t('langName'), o.lang.name, { max: 40, onChange: function (v) { o.lang.name = String(v).trim().slice(0, 40); changed(t('changedWord')); } }), 'lname'));
      out.push(fk(F.text(t('syllables'), o.lang.syl, { max: 300, onChange: function (v) { var l = sylList(v); if (l.length < 2) { ctx.announce(t('sylTooFew')); renderInspector('lsyl'); return; } o.lang.syl = l.join(' '); changed(t('changedWord'), true); } }), 'lsyl'));
      out.push(h('p', { class: 'igs-muted', text: t('sylHelp') }));
      var sample = []; var r = ctx.rng('muestra-' + o.id + o.lang.syl); for (var i = 0; i < 5; i++) sample.push(makeName(o.lang.syl, r));
      out.push(h('p', { class: 'igw-sample' }, h('strong', { text: t('sampleNames') + ' ' }), sample.join(' · ')));
      out.push(h('h4', { text: t('calendarTitle') }));
      out.push(h('p', { class: 'igs-muted', text: t('calSum', { days: yearLen(cal), months: cal.months.length, week: cal.week.length }) }));
      out.push(h('div', { class: 'igw-two' },
        fk(F.number(t('curYear'), cal.year, { min: 1, max: 99999, step: 1, onChange: function (v) { cal.year = Math.round(v); changed(t('calChanged')); } }), 'cyear'),
        fk(F.text(t('eraName'), cal.era, { max: 40, onChange: function (v) { cal.era = String(v).slice(0, 40); changed(t('calChanged')); } }), 'cera')));
      var mt = h('fieldset', { class: 'igs-field igw-rows' }, h('legend', { text: t('monthsTitle') }));
      cal.months.forEach(function (m, i) {
        var nameIn = h('input', { type: 'text', maxlength: 30, 'aria-label': t('monthName', { n: i + 1 }), 'data-fkey': 'm' + i + 'n' }); nameIn.value = m.name;
        nameIn.addEventListener('change', function () { m.name = String(nameIn.value).trim().slice(0, 30) || m.name; nameIn.value = m.name; changed(t('calChanged')); });
        var daysIn = h('input', { type: 'number', min: 1, max: 99, step: 1, inputmode: 'numeric', 'aria-label': t('monthDays', { n: i + 1 }), 'data-fkey': 'm' + i + 'd' }); daysIn.value = String(m.days);
        daysIn.addEventListener('change', function () { var v = Math.max(1, Math.min(99, Math.round(+daysIn.value || m.days))); m.days = v; daysIn.value = String(v); changed(t('calChanged'), true); });
        var del = h('button', { type: 'button', class: 'igs-btn igw-rowdel', 'aria-label': t('removeMonth', { name: m.name }), 'data-fkey': 'm' + i + 'x' }, ctx.icon('trash'));
        del.addEventListener('click', function () { if (cal.months.length <= 1) { ctx.announce(t('oneMonthMin')); return; } cal.months.splice(i, 1); cal.feasts = cal.feasts.filter(function (f) { return f.month !== i; }).map(function (f) { if (f.month > i) f.month -= 1; return f; }); changed(t('calChanged'), true, 'm' + Math.max(0, i - 1) + 'n'); });
        mt.appendChild(h('div', { class: 'igw-row' }, nameIn, daysIn, del));
      });
      var addM = ctx.button(t('addMonth'), { icon: 'plus', dataset: { fkey: 'addm' } });
      addM.addEventListener('click', function () { if (cal.months.length >= 24) return; cal.months.push({ name: makeName(o.lang.syl, ctx.rng(freshSeed())), days: 30 }); changed(t('calChanged'), true, 'm' + (cal.months.length - 1) + 'n'); });
      mt.appendChild(addM); out.push(mt);
      out.push(fk(F.text(t('weekDays'), cal.week.join(', '), { max: 300, onChange: function (v) { var l = String(v).split(',').map(function (x) { return x.trim().slice(0, 20); }).filter(Boolean).slice(0, 12); if (!l.length) { renderInspector('cweek'); ctx.announce(t('chkNoWeek', { name: o.name })); return; } cal.week = l; if ((cal.first || 0) >= l.length) cal.first = 0; changed(t('calChanged'), true); } }), 'cweek'));
      out.push(fk(F.select(t('firstDay'), String(cal.first || 0), cal.week.map(function (w, i) { return [String(i), w]; }), { onChange: function (v) { cal.first = +v; changed(t('calChanged')); } }), 'cfirst'));
      var ft = h('fieldset', { class: 'igs-field igw-rows' }, h('legend', { text: t('feastsTitle') }));
      cal.feasts.forEach(function (f, i) {
        var nameIn = h('input', { type: 'text', maxlength: 40, 'aria-label': t('feastName', { n: i + 1 }), 'data-fkey': 'f' + i + 'n' }); nameIn.value = f.name;
        nameIn.addEventListener('change', function () { f.name = String(nameIn.value).trim().slice(0, 40) || f.name; nameIn.value = f.name; changed(t('calChanged')); });
        var mSel = h('select', { 'aria-label': t('feastMonth', { name: f.name }), 'data-fkey': 'f' + i + 'm' }); cal.months.forEach(function (m, mi) { var op = h('option', { value: String(mi), text: m.name }); if (mi === f.month) op.selected = true; mSel.appendChild(op); });
        mSel.addEventListener('change', function () { f.month = +mSel.value; changed(t('calChanged'), true); });
        var dIn = h('input', { type: 'number', min: 1, max: 99, step: 1, inputmode: 'numeric', 'aria-label': t('feastDay', { name: f.name }), 'data-fkey': 'f' + i + 'd' }); dIn.value = String(f.day);
        dIn.addEventListener('change', function () { f.day = Math.max(1, Math.min(99, Math.round(+dIn.value || 1))); dIn.value = String(f.day); changed(t('calChanged'), true); });
        var del = h('button', { type: 'button', class: 'igs-btn igw-rowdel', 'aria-label': t('removeFeast', { name: f.name }), 'data-fkey': 'f' + i + 'x' }, ctx.icon('trash'));
        del.addEventListener('click', function () { cal.feasts.splice(i, 1); changed(t('calChanged'), true, 'addf'); });
        ft.appendChild(h('div', { class: 'igw-row igw-row-feast' }, nameIn, mSel, dIn, del));
      });
      var addF = ctx.button(t('addFeast'), { icon: 'plus', dataset: { fkey: 'addf' } });
      addF.addEventListener('click', function () { if (cal.feasts.length >= 40) return; cal.feasts.push({ name: t('feastDefault', { n: cal.feasts.length + 1 }), month: 0, day: 1 }); changed(t('calChanged'), true, 'f' + (cal.feasts.length - 1) + 'n'); });
      ft.appendChild(addF); out.push(ft);
      var probs = calProblems(o);
      out.push(h('p', { class: 'igs-result', 'data-kind': probs.length ? 'bad' : 'ok' }, h('strong', { text: probs.length ? t('checksBad', { n: probs.length }) : t('calOkMsg') }), probs.length ? probs.join(' ') : ''));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('seeCalendar'), { icon: 'grid', onClick: function () { setView('calendar'); } })));
      out.push(delButton('culture', o));
      return out;
    }
    function eventInspector(o) {
      var out = [h('h4', { text: t('kind_event') + ': ' + o.title })];
      out.push(fk(F.text(t('titleLabel'), o.title, { max: 80, onChange: function (v) { o.title = String(v).trim().slice(0, 80) || o.title; changed(t('renamed')); } }), 'etitle'));
      out.push(fk(F.select(t('calendarUsed'), o.culture || '', optList('culture', t('noCalendar')), { onChange: function (v) { o.culture = v; o.month = 0; o.day = 1; changed(t('changedWord'), true); } }), 'ecul'));
      var cu = find('culture', o.culture);
      out.push(fk(F.number(t('yearLabel'), o.year, { min: -99999, max: 99999, step: 1, onChange: function (v) { o.year = Math.round(v); changed(t('changedWord'), true); } }), 'eyear'));
      if (cu) {
        out.push(h('div', { class: 'igw-two' },
          fk(F.select(t('monthLabel'), String(o.month), cu.calendar.months.map(function (m, i) { return [String(i), m.name]; }), { onChange: function (v) { o.month = +v; changed(t('changedWord'), true); } }), 'emonth'),
          fk(F.number(t('dayLabel'), o.day, { min: 1, max: (cu.calendar.months[o.month] || { days: 99 }).days, step: 1, onChange: function (v) { o.day = Math.round(v); changed(t('changedWord'), true); } }), 'eday')));
      }
      out.push(h('p', { class: 'igs-muted', text: t('dateIs', { date: fmtDate(o) }) }));
      out.push(fk(F.select(t('whereLabel'), o.place || '', optList('place', t('noneOpt')), { onChange: function (v) { o.place = v; changed(t('changedWord')); } }), 'eplace'));
      out.push(fk(F.text(t('description'), o.text, { multiline: true, max: 800, onChange: function (v) { o.text = String(v).slice(0, 800); changed(t('changedWord')); } }), 'etext'));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('seeTimeline'), { icon: 'layers', onClick: function () { setView('timeline'); } })));
      out.push(delButton('event', o));
      return out;
    }
    function characterInspector(o) {
      var out = [h('h4', { text: t('kind_character') + ': ' + o.name })];
      out.push(nameRow(o, 'kname', function () { return cultureSylls(o.culture); }));
      out.push(fk(F.text(t('roleLabel'), o.role, { max: 80, onChange: function (v) { o.role = String(v).slice(0, 80); changed(t('changedWord')); } }), 'krole'));
      out.push(fk(F.select(t('kind_culture'), o.culture || '', optList('culture', t('noneOpt')), { onChange: function (v) { o.culture = v; changed(t('changedWord')); } }), 'kcul'));
      out.push(fk(F.select(t('placeLabel'), o.place || '', optList('place', t('noneOpt')), { onChange: function (v) { o.place = v; changed(t('changedWord')); } }), 'kplace'));
      out.push(fk(F.text(t('description'), o.text, { multiline: true, max: 600, onChange: function (v) { o.text = String(v).slice(0, 600); changed(t('changedWord')); } }), 'ktext'));
      var fs = h('fieldset', { class: 'igs-field igw-rows' }, h('legend', { text: t('relationsTitle') }));
      var mine = S.relations.filter(function (r) { return r.a === o.id || r.b === o.id; });
      mine.forEach(function (rl, i) {
        var other = rl.a === o.id ? rl.b : rl.a;
        var kSel = h('select', { 'aria-label': t('relKind', { n: i + 1 }), 'data-fkey': 'r' + i + 'k' }); RELS.forEach(function (k) { var op = h('option', { value: k, text: t('rel_' + k) }); if (k === rl.kind) op.selected = true; kSel.appendChild(op); });
        kSel.addEventListener('change', function () { rl.kind = kSel.value; changed(t('relChanged'), true); });
        var oSel = h('select', { 'aria-label': t('relWith', { n: i + 1 }), 'data-fkey': 'r' + i + 'o' }); S.characters.forEach(function (c) { if (c.id === o.id) return; var op = h('option', { value: c.id, text: c.name }); if (c.id === other) op.selected = true; oSel.appendChild(op); });
        oSel.addEventListener('change', function () { if (rl.a === o.id) rl.b = oSel.value; else rl.a = oSel.value; changed(t('relChanged'), true); });
        var del = h('button', { type: 'button', class: 'igs-btn igw-rowdel', 'aria-label': t('removeRel', { n: i + 1 }), 'data-fkey': 'r' + i + 'x' }, ctx.icon('trash'));
        del.addEventListener('click', function () { S.relations = S.relations.filter(function (x) { return x !== rl; }); changed(t('relChanged'), true, 'addr'); });
        fs.appendChild(h('div', { class: 'igw-row' }, kSel, oSel, del));
      });
      if (S.characters.length < 2) fs.appendChild(h('p', { class: 'igs-muted', text: t('relNeedTwo') }));
      else {
        var addR = ctx.button(t('addRel'), { icon: 'plus', dataset: { fkey: 'addr' } });
        addR.addEventListener('click', function () { var other = S.characters.filter(function (c) { return c.id !== o.id; })[0]; S.relations.push({ id: nid('l'), a: o.id, b: other.id, kind: 'friend' }); changed(t('relChanged'), true, 'r' + mine.length + 'k'); });
        fs.appendChild(addR);
      }
      out.push(fs);
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('seeRelations'), { icon: 'player', onClick: function () { setView('relations'); } })));
      out.push(delButton('character', o));
      return out;
    }

    /* ---------- Cambios, alta y baja ---------- */
    /* Tras un cambio: el panel de propiedades se rehace después de que el foco haya llegado a su destino
       (si no, un cambio confirmado con Tabulador dejaría el foco atrapado). Las partes sin controles se actualizan en su sitio. */
    var inspTimer = 0;
    function changed(label, reInspector, focusKey) {
      if (viewMode === 'map') { syncCells(); drawOverlay(); } else renderDoc();
      ctx.commit(label); renderStructure(); summary(); updateLive();
      if (reInspector) { clearTimeout(inspTimer); inspTimer = setTimeout(function () { renderInspector(focusKey); }, 0); }
      ctx.announce(label);
    }
    function addItem(k) {
      var rnd = ctx.rng(freshSeed()), o;
      if (k === 'place') { o = { id: nid('p'), name: makeName(worldSylls(), rnd), kind: 'village', c: kc.c, r: kc.r, text: '' }; S.places.push(o); }
      else if (k === 'species') { var here = M().cells[ci(kc.c, kc.r)]; o = { id: nid('s'), name: makeName(worldSylls(), rnd), habitat: [here], diet: 'plants', size: 'medium', traits: '' }; S.species.push(o); }
      else if (k === 'culture') {
        var sets = Object.keys(SYL), syl = SYL[sets[Math.floor(rnd() * sets.length)]], months = [], week = [];
        for (var i = 0; i < 6; i++) months.push({ name: makeName(syl, rnd), days: 30 + (i % 2) });
        for (var j = 0; j < 5; j++) week.push(makeName(syl, rnd));
        o = { id: nid('c'), name: makeName(syl, rnd), place: S.places[0] ? S.places[0].id : '', text: '', lang: { name: makeName(syl, rnd), syl: syl },
          calendar: { months: months, week: week, first: 0, year: 1, era: '', feasts: [{ name: t('feastDefault', { n: 1 }), month: 0, day: 1 }] } };
        S.cultures.push(o);
      }
      else if (k === 'event') { o = { id: nid('e'), title: t('eventDefault', { n: S.events.length + 1 }), year: S.cultures[0] ? S.cultures[0].calendar.year : 1, month: 0, day: 1, culture: S.cultures[0] ? S.cultures[0].id : '', place: '', text: '' }; S.events.push(o); }
      else { o = { id: nid('k'), name: makeName(worldSylls(), rnd), role: '', culture: S.cultures[0] ? S.cultures[0].id : '', place: S.places[0] ? S.places[0].id : '', text: '' }; S.characters.push(o); }
      sel = { k: k, id: o.id };
      var want = { place: 'map', species: 'map', culture: 'calendar', event: 'timeline', character: 'relations' }[k]; if (want !== viewMode) setView(want, true);
      changed(t('added', { kind: t('kind_' + k), name: o.name || o.title }), true, k === 'event' ? 'etitle' : { place: 'pname', species: 'sname', culture: 'cname', character: 'kname' }[k]);
    }
    function removeItem(k, id) {
      var o = find(k, id); if (!o) return;
      var arr = { place: 'places', species: 'species', culture: 'cultures', event: 'events', character: 'characters' }[k];
      S[arr] = S[arr].filter(function (x) { return x.id !== id; });
      if (k === 'place') { S.cultures.forEach(function (c) { if (c.place === id) c.place = ''; }); S.events.forEach(function (e) { if (e.place === id) e.place = ''; }); S.characters.forEach(function (c) { if (c.place === id) c.place = ''; }); }
      if (k === 'culture') { S.events.forEach(function (e) { if (e.culture === id) e.culture = ''; }); S.characters.forEach(function (c) { if (c.culture === id) c.culture = ''; }); }
      if (k === 'character') S.relations = S.relations.filter(function (r) { return r.a !== id && r.b !== id; });
      sel = null; moveMode = false; updateHab();
      changed(t('deletedItem', { name: o.name || o.title }), true);
      var b = ctx.structure.querySelector('[data-skey="add:' + k + '"]'); if (b) b.focus();
    }

    /* ---------- Herramientas del mapa ---------- */
    function setTerrain(k) { terrain = k; terrSel.value = k; renderLegend(); ctx.announce(t('terrainNow', { t: tname(k) })); }
    function paintAt(i) { var ch = false; brushCells(i).forEach(function (x) { if (M().cells[x] !== terrain) { M().cells[x] = terrain; ch = true; } }); return ch; }
    function flood(i) {
      var m = M(), target = m.cells[i]; if (target === terrain) return 0;
      var stack = [i], n = 0, seen = {};
      while (stack.length) { var x = stack.pop(); if (seen[x] || m.cells[x] !== target) continue; seen[x] = 1; m.cells[x] = terrain; n++; neigh(x).forEach(function (y) { if (!seen[y]) stack.push(y); }); }
      return n;
    }
    function placeAt(i) { var p = cr(i); for (var k = S.places.length - 1; k >= 0; k--) if (S.places[k].c === p.c && S.places[k].r === p.r) return S.places[k]; return null; }
    function placeNearScreen(sx, sy) {
      var best = null, bd = 16;
      S.places.forEach(function (pl) { var c = centre(ci(pl.c, pl.r)), p = view.toScreen(c[0], c[1]), d = Math.hypot(p.x - sx, p.y - sy); if (d < bd) { bd = d; best = pl; } });
      return best;
    }
    function riverAdd(i) {
      if (!pendingRiver) { pendingRiver = [i]; drawOverlay(); ctx.announce(t('riverStart')); return; }
      var last = pendingRiver[pendingRiver.length - 1];
      if (i === last) { finishRiver(); return; }
      pendingRiver.push(i); drawOverlay(); ctx.announce(t('riverPoint', { n: pendingRiver.length }));
    }
    function finishRiver() {
      if (pendingRiver && pendingRiver.length >= 2) { M().rivers.push(pendingRiver.slice(0, 200)); pendingRiver = null; changed(t('riverAdded')); }
      else { pendingRiver = null; drawOverlay(); ctx.announce(t('cancelled')); }
    }
    function riverRemoveAt(i) {
      var p = centre(i), best = -1, bd = (M().shape === 'hex' ? HEX_R : SQ / 2) * 1.2;
      M().rivers.forEach(function (rv, ri) { rv.forEach(function (x, k) { if (!k) return; var a = centre(rv[k - 1]), b = centre(x), dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1, u = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2)), d = Math.hypot(p[0] - a[0] - u * dx, p[1] - a[1] - u * dy); if (d < bd) { bd = d; best = ri; } }); });
      if (best < 0) { ctx.announce(t('noRiverHere')); return; }
      M().rivers.splice(best, 1); changed(t('riverRemoved'));
    }
    function useTool(i, how) {
      if (i < 0) return;
      if (moveMode) { var sp = selObj(); if (sp) { var p = cr(i); sp.c = p.c; sp.r = p.r; moveMode = false; changed(t('placeMoved', { name: sp.name, c: p.c + 1, r: p.r + 1 }), true); } return; }
      if (tool === 'brush') { if (paintAt(i) && how !== 'drag') changed(t('painted', { t: tname(terrain) })); return; }
      if (tool === 'fill') { var n = flood(i); if (n) changed(t('filled', { n: n, t: tname(terrain) })); else ctx.announce(t('alreadyThat')); return; }
      if (tool === 'river') { riverAdd(i); return; }
      if (tool === 'unriver') { riverRemoveAt(i); return; }
      if (tool === 'place') { var pos = cr(i), o = { id: nid('p'), name: makeName(worldSylls(), ctx.rng(freshSeed())), kind: M().cells[i] === 'coast' ? 'port' : 'village', c: pos.c, r: pos.r, text: '' }; S.places.push(o); sel = { k: 'place', id: o.id }; changed(t('added', { kind: t('kind_place'), name: o.name }), true); return; }
      if (tool === 'select') { var pl = placeAt(i); if (pl) select('place', pl.id); else { if (sel) select(null); ctx.announce(describeCell(i)); } }
    }
    function describeCell(i) {
      var p = cr(i), pl = placeAt(i), onRiver = M().rivers.some(function (rv) { return rv.indexOf(i) >= 0; });
      return t('cellAt', { c: p.c + 1, r: p.r + 1, t: tname(M().cells[i]) }) + (onRiver ? ' · ' + t('riverWord') : '') + (pl ? ' · ' + pl.name : '');
    }
    function worldFromEvent(e) { var r = svg.getBoundingClientRect(); return view.toWorld(e.clientX - r.left, e.clientY - r.top); }
    svg.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || tool === 'pan') return;
      var w = worldFromEvent(e), i = cellAt(w.x, w.y), r = svg.getBoundingClientRect();
      if (i >= 0) { var p = cr(i); kc = { c: p.c, r: p.r }; cursorShown = false; }
      if (tool === 'select' && !moveMode) {
        var pl = placeNearScreen(e.clientX - r.left, e.clientY - r.top);
        if (pl) { if (!sel || sel.id !== pl.id) select('place', pl.id); drag = { id: pl.id, c: pl.c, r: pl.r, moved: false }; svg.setPointerCapture(e.pointerId); return; }
      }
      if (tool === 'brush' && !moveMode) { painting = { any: false }; svg.setPointerCapture(e.pointerId); if (i >= 0 && paintAt(i)) { painting.any = true; syncCells(); } drawOverlay(); return; }
      useTool(i, 'click');
    });
    svg.addEventListener('pointermove', function (e) {
      var w = worldFromEvent(e), i = cellAt(w.x, w.y);
      if (painting) { if (i >= 0 && paintAt(i)) { painting.any = true; syncCells(); } if (i >= 0) { var p = cr(i); kc = { c: p.c, r: p.r }; drawOverlay(); } return; }
      if (drag && i >= 0) { var o = find('place', drag.id), q = cr(i); if (o && (o.c !== q.c || o.r !== q.r)) { o.c = q.c; o.r = q.r; drag.moved = true; drawOverlay(); } }
    });
    function endPointer() {
      if (painting) { var any = painting.any; painting = null; if (any) changed(t('painted', { t: tname(terrain) })); }
      if (drag) { var o = find('place', drag.id), mv = drag.moved; drag = null; if (o && mv) changed(t('placeMoved', { name: o.name, c: o.c + 1, r: o.r + 1 }), true); }
    }
    svg.addEventListener('pointerup', endPointer); svg.addEventListener('pointercancel', endPointer);
    svg.addEventListener('dblclick', function () { if (tool === 'river' && pendingRiver) finishRiver(); });

    var keyTimer = 0;
    function onKey(e) {
      if (!vp.contains(e.target)) return false;
      var k = e.key;
      if (viewMode !== 'map') {
        var kind = { calendar: 'culture', timeline: 'event', relations: 'character' }[viewMode], items = kind === 'event' ? S.events.slice().sort(function (a, b) { return dateKey(a) - dateKey(b); }) : list(kind);
        var dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[k];
        if (dir && items.length && e.target === vp) { var cur = sel && sel.k === kind ? items.findIndex(function (x) { return x.id === sel.id; }) : -1; var nx = items[(cur + dir + items.length) % items.length]; select(kind, nx.id); return true; }
        if ((k === 'Delete' || k === 'Backspace') && sel && e.target === vp) { removeItem(sel.k, sel.id); return true; }
        if (k === 'Escape' && sel) { select(null); return true; }
        return false;
      }
      var st = e.shiftKey ? 4 : 1, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[k];
      var sp = sel && sel.k === 'place' ? selObj() : null;
      if (d && tool === 'select' && sp && !moveMode) {
        sp.c = Math.max(0, Math.min(M().w - 1, sp.c + d[0])); sp.r = Math.max(0, Math.min(M().h - 1, sp.r + d[1])); kc = { c: sp.c, r: sp.r };
        drawOverlay(); clearTimeout(keyTimer); keyTimer = setTimeout(function () { changed(t('placeMoved', { name: sp.name, c: sp.c + 1, r: sp.r + 1 }), true); }, 350);
        ctx.announce(t('placeMoved', { name: sp.name, c: sp.c + 1, r: sp.r + 1 }) + ' · ' + tname(M().cells[ci(sp.c, sp.r)])); return true;
      }
      if (d) { kc.c = Math.max(0, Math.min(M().w - 1, kc.c + d[0])); kc.r = Math.max(0, Math.min(M().h - 1, kc.r + d[1])); cursorShown = true; drawOverlay(); ctx.announce(describeCell(ci(kc.c, kc.r)) + (pendingRiver ? ' · ' + t('riverPending', { n: pendingRiver.length }) : '')); return true; }
      if (k === 'Enter' || k === ' ') { useTool(ci(kc.c, kc.r), 'key'); return true; }
      if (k === '[' || k === ']') { var ix = TERR.indexOf(terrain); setTerrain(TERR[(ix + (k === ']' ? 1 : -1) + TERR.length) % TERR.length]); if (!sel) renderInspector(); return true; }
      if (k === 'Escape') { if (pendingRiver) { finishRiver(); return true; } if (moveMode) { moveMode = false; drawOverlay(); renderInspector(); ctx.announce(t('cancelled')); return true; } if (sel) { select(null); return true; } return false; }
      if ((k === 'Delete' || k === 'Backspace') && sel) { removeItem(sel.k, sel.id); return true; }
      if (k === '+' || k === '=') { zoomCenter(1.25); return true; }
      if (k === '-' || k === '_') { zoomCenter(1 / 1.25); return true; }
      if (k === '0') { fit(); return true; }
      return false;
    }

    /* ---------- Resumen accesible ---------- */
    function summary() {
      var m = M(), c = terrCounts(), total = m.cells.length;
      var terrs = TERR.filter(function (k) { return c[k]; }).sort(function (a, b) { return c[b] - c[a]; }).map(function (k) { return tname(k).toLowerCase() + ' ' + pct(c[k] / total * 100); }).join(', ');
      var base = t('summary', { name: S.name, shape: t('shape_' + m.shape).toLowerCase(), w: m.w, h: m.h, terr: terrs, rivers: m.rivers.length, places: S.places.length, species: S.species.length, cultures: S.cultures.length, events: S.events.length, chars: S.characters.length });
      var pl = S.places.length ? ' ' + t('placesList', { list: S.places.map(function (p) { return p.name + ' (' + t('pk_' + p.kind).toLowerCase() + ')'; }).join(', ') }) : '';
      var extra = viewMode === 'map' ? ' ' + t('cursorSum', { c: kc.c + 1, r: kc.r + 1, t: tname(m.cells[ci(kc.c, kc.r)]).toLowerCase() }) : ' ' + t('viewNow', { v: t('view_' + viewMode) });
      ctx.setSummary(base + pl + extra);
    }

    /* ---------- Diálogos: generador de mapas y de nombres ---------- */
    var genDlg = ctx.dialog(t('genTitle'), { wide: true });
    function openGenerator(trigger) {
      var m = M(), o = { type: m.gen || 'island', seed: m.seed || String(freshSeed() % 100000), land: m.gen === 'continent' ? 55 : m.gen === 'archipelago' ? 30 : 38, rivers: 3, shape: m.shape, size: m.w + 'x' + m.h, newPlaces: true };
      ctx.clear(genDlg.body);
      genDlg.body.appendChild(h('p', { class: 'igs-note', text: t('genWarn') }));
      var form = h('div', { class: 'igw-genform' });
      form.appendChild(F.choice(t('genType'), o.type, [['island', t('gen_island')], ['archipelago', t('gen_archipelago')], ['continent', t('gen_continent')]], { onChange: function (v) { o.type = v; o.land = v === 'continent' ? 55 : v === 'archipelago' ? 30 : 38; landF.input.value = String(o.land); landF.input.dispatchEvent(new Event('input')); } }));
      var seedF = F.text(t('seedLabel'), o.seed, { max: 40, onChange: function (v) { o.seed = String(v).trim() || o.seed; } });
      var seedBtn = ctx.button(t('newSeed'), { icon: 'sparkle', onClick: function () { o.seed = String(freshSeed() % 1000000); seedF.input.value = o.seed; ctx.announce(t('seedIs', { s: o.seed })); } });
      form.appendChild(h('div', { class: 'igw-namerow' }, seedF, seedBtn));
      form.appendChild(h('p', { class: 'igs-muted', text: t('seedHelp') }));
      var landF = F.range(t('landLabel'), o.land, { min: 15, max: 75, step: 1, unit: '%', format: function (v) { return num(v, 0); }, onInput: function (v) { o.land = v; }, onChange: function (v) { o.land = v; } });
      form.appendChild(landF);
      form.appendChild(F.number(t('riversLabel'), o.rivers, { min: 0, max: 10, step: 1, onChange: function (v) { o.rivers = Math.round(v); } }));
      form.appendChild(F.choice(t('shapeLabel'), o.shape, [['hex', t('shape_hex')], ['square', t('shape_square')]], { onChange: function (v) { o.shape = v; } }));
      form.appendChild(F.select(t('sizeLabel'), o.size, sizeOptions(m), { onChange: function (v) { o.size = v; } }));
      form.appendChild(F.check(t('genPlaces'), o.newPlaces, { onChange: function (v) { o.newPlaces = !!v; } }));
      genDlg.body.appendChild(form);
      genDlg.body.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('generateGo'), { icon: 'sparkle', class: 'igs-primary', onClick: function () {
        var sz = o.size.split('x'); runGenerate({ type: o.type, seed: o.seed, land: o.land, rivers: o.rivers, shape: o.shape, w: +sz[0], h: +sz[1] }, o.newPlaces); genDlg.close();
      } }), ctx.button(t('cancel'), { onClick: function () { genDlg.close(); } })));
      genDlg.open(trigger);
    }
    function runGenerate(opts, newPlaces) {
      var g = generate(opts); S.map = g.map;
      if (newPlaces) {
        var gone = S.places.map(function (p) { return p.id; });
        S.places = autoPlaces(S.map, g.rnd, 4, worldSylls());
        [S.cultures, S.events, S.characters].forEach(function (l) { l.forEach(function (x) { if (gone.indexOf(x.place) >= 0) x.place = ''; }); });
        if (sel && sel.k === 'place') sel = null;
      } else S.places.forEach(function (p) { p.c = Math.min(p.c, S.map.w - 1); p.r = Math.min(p.r, S.map.h - 1); });
      kc = { c: Math.floor(S.map.w / 2), r: Math.floor(S.map.h / 2) };
      if (viewMode !== 'map') setView('map', true);
      buildCells(); syncCells(); fit();
      changed(t('generated', { seed: opts.seed, t: t('gen_' + opts.type).toLowerCase() }), true);
    }
    var namesDlg = ctx.dialog(t('namesTitle'), { wide: true });
    function openNames(trigger) {
      var src = S.cultures[0] ? 'c:' + S.cultures[0].id : 'soft';
      ctx.clear(namesDlg.body);
      namesDlg.body.appendChild(h('p', { class: 'igs-muted', text: t('namesHelp') }));
      var opts = Object.keys(SYL).map(function (k) { return [k, t('syl_' + k)]; }).concat(S.cultures.map(function (c) { return ['c:' + c.id, t('langOf', { name: c.name })]; }));
      var box = h('ul', { class: 'igw-namelist', 'aria-live': 'polite' });
      function sylFor(v) { if (v.indexOf('c:') === 0) { var c = find('culture', v.slice(2)); return c ? c.lang.syl : SYL.soft; } return SYL[v]; }
      function batch() { ctx.clear(box); var r = ctx.rng(freshSeed()), seen = {}; for (var i = 0; i < 12; i++) { var n = makeName(sylFor(src), r); if (seen[n]) continue; seen[n] = 1; box.appendChild(h('li', { text: n })); } }
      namesDlg.body.appendChild(F.select(t('sylSet'), src, opts, { onChange: function (v) { src = v; batch(); } }));
      namesDlg.body.appendChild(box);
      namesDlg.body.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('moreNames'), { icon: 'sparkle', class: 'igs-primary', onClick: batch })));
      namesDlg.body.appendChild(h('p', { class: 'igs-muted', text: t('namesFilter') }));
      batch(); namesDlg.open(trigger);
    }

    /* ---------- Toolbar ---------- */
    var terrSel = h('select', { 'aria-label': t('terrainLabel') });
    TERR.forEach(function (k) { terrSel.appendChild(h('option', { value: k, text: tname(k) })); });
    terrSel.value = terrain;
    terrSel.addEventListener('change', function () { setTerrain(terrSel.value); if (tool !== 'brush' && tool !== 'fill') ctx.selectTool('brush'); if (!sel) renderInspector(); });
    var viewSel = h('select', { 'aria-label': t('viewLabel') });
    ['map', 'calendar', 'timeline', 'relations'].forEach(function (v) { viewSel.appendChild(h('option', { value: v, text: t('view_' + v) })); });
    viewSel.addEventListener('change', function () { setView(viewSel.value); });
    /* En la barra con foco itinerante, las flechas izquierda y derecha pasan de largo por las listas desplegables
       (arriba y abajo siguen cambiando su valor). El núcleo las deja sin salida con las flechas. */
    function passThrough(selEl) {
      selEl.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault(); e.stopPropagation();
        var items = Array.prototype.filter.call(ctx.toolbar.querySelectorAll('button,select,input'), function (x) { return !x.disabled && x.offsetParent !== null; });
        var i = items.indexOf(selEl), n = items[(i + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length]; if (n) n.focus();
      });
    }
    passThrough(terrSel); passThrough(viewSel);
    ctx.setTools([
      { id: 'select', label: t('toolSelect'), icon: 'select' },
      { id: 'brush', label: t('toolBrush'), icon: 'pen' },
      { id: 'fill', label: t('toolFill'), icon: 'bucket' },
      { id: 'river', label: t('toolRiver'), icon: 'wave' },
      { id: 'place', label: t('toolPlace'), icon: 'flag' },
      { node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('terrainLabel') }), terrSel) },
      { id: 'unriver', label: t('toolUnriver'), icon: 'erase', level: 'more' },
      { id: 'pan', label: t('toolPan'), icon: 'pan', level: 'more' },
      { separator: true },
      { node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('viewLabel') }), viewSel) },
      { id: 'generate', label: t('generateBtn'), icon: 'sparkle', action: function (b) { openGenerator(b); } },
      { id: 'names', label: t('namesBtn'), icon: 'text', level: 'more', action: function (b) { openNames(b); } }
    ], { initial: 'brush' });

    /* ---------- Exportaciones ---------- */
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function mapSVGString(opts) {
      opts = opts || {}; var m = M(), b = bounds(), pad = 14, legendH = 46, W = b.maxX - b.minX + pad * 2, H = b.maxY - b.minY + pad * 2 + legendH, x0 = b.minX - pad, y0 = b.minY - pad, pre = 'igwx-';
      var sizeAttr = opts.mm ? ' width="' + opts.mm + 'mm" height="' + (opts.mm * H / W).toFixed(1) + 'mm"' : ' width="' + (W * 2).toFixed(0) + '" height="' + (H * 2).toFixed(0) + '"';
      var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + x0.toFixed(2) + ' ' + y0.toFixed(2) + ' ' + W.toFixed(2) + ' ' + H.toFixed(2) + '"' + sizeAttr + ' role="img" aria-labelledby="igwx-t igwx-d" class="igwx' + (showTex ? '' : ' igw-flat') + (showGrid ? ' igw-grid' : '') + '">';
      s += '<title id="igwx-t">' + esc(t('mapOf', { name: S.name })) + '</title><desc id="igwx-d">' + esc(summaryText()) + '</desc>';
      s += '<defs>' + patternDefs(pre) + '</defs><style>' + cellCss(pre, '.igwx') + '.igw-river{fill:none;stroke:#1f5f8b;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.igw-river-case{fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;opacity:.8}text{font-family:"Atkinson Hyperlegible",Arial,sans-serif}</style>';
      s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="#ffffff"/>';
      for (var i = 0; i < m.cells.length; i++) s += '<path class="igw-c igw-t-' + m.cells[i] + '" d="' + cellPath(i) + '"/>';
      m.rivers.forEach(function (rv) { if (rv.length < 2) return; var d = riverPath(rv); s += '<path class="igw-river-case" d="' + d + '"/><path class="igw-river" d="' + d + '"/>'; });
      S.places.forEach(function (pl) {
        var p = centre(ci(pl.c, pl.r)), tr = 'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ') scale(.62)', mk = '';
        var st = ' fill="#fff" stroke="#172b42" stroke-width="2"';
        if (pl.kind === 'city') mk = '<rect x="-6" y="-6" width="12" height="12"' + st + '/>';
        else if (pl.kind === 'port') mk = '<circle r="6"' + st + '/><path d="M0-3.5v7M-3 1.5q3 3 6 0" fill="none" stroke="#172b42" stroke-width="1.6"/>';
        else if (pl.kind === 'ruin') mk = '<path d="M0-7L6.5 5H-6.5Z" fill="none" stroke="#172b42" stroke-width="2.2"/>';
        else if (pl.kind === 'landmark') mk = '<path d="M0-7L2 -2 7-2 3 1.5 4.5 7 0 3.8-4.5 7-3 1.5-7-2-2-2Z"' + st + '/>';
        else mk = '<circle r="5"' + st + '/>';
        s += '<g transform="' + tr + '">' + mk + '<text x="10" y="4" font-size="12" font-weight="700" fill="#172b42" stroke="#fff" stroke-width="3.5" paint-order="stroke">' + esc(pl.name) + '</text></g>';
      });
      /* Leyenda con textura y nombre de cada terreno usado */
      var used = TERR.filter(function (k) { return terrCounts()[k]; }), lx = x0 + pad, ly = b.maxY + pad + 8, colW = Math.max(56, (W - pad * 2) / Math.max(1, Math.min(used.length, 4)));
      used.forEach(function (k, i) { var cx = lx + (i % 4) * colW, cy = ly + Math.floor(i / 4) * 16; s += '<rect class="igw-t-' + k + '" x="' + cx + '" y="' + cy + '" width="10" height="10" style="stroke:' + TINK[k] + ';stroke-width:.6"/><text x="' + (cx + 14) + '" y="' + (cy + 8.5) + '" font-size="8.5" fill="#172b42">' + esc(tname(k)) + '</text>'; });
      if (!opts.noCredit) s += '<text x="' + (x0 + W - pad) + '" y="' + (y0 + H - 5) + '" font-size="7" text-anchor="end" fill="#44586c">IRIS GREEN · irisgreen.eu</text>';
      return s + '</svg>';
    }
    function summaryText() { var n = D.getElementById('igs-scene-summary'); return n ? n.textContent : ''; }
    /* PNG: el crédito va en la franja de ctx.canvasWithCredit, debajo del mapa, sin tapar nada. */
    function mapCanvas(px) {
      return new Promise(function (resolve, reject) {
        var str = mapSVGString({ noCredit: true }), img = new Image(), url = URL.createObjectURL(new Blob([str], { type: 'image/svg+xml' }));
        img.onload = function () {
          var b = bounds(), W = b.maxX - b.minX + 28, H = b.maxY - b.minY + 28 + 46, sc = (px || 2000) / W, c = D.createElement('canvas');
          c.width = Math.round(W * sc); c.height = Math.round(H * sc); var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url); resolve(ctx.canvasWithCredit(c, '#ffffff'));
        };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('svg')); };
        img.src = url;
      });
    }
    function fileBase() { return (plain(S.name).slice(0, 30) || (LANG === 'en' ? 'world' : 'mundo')) + '-' + ctx.stamp(); }
    function atlasSections(hn) {
      /* Devuelve el cuerpo del atlas como HTML semántico (títulos, listas y tablas reales). hn = nivel base de títulos. */
      var H2 = 'h' + hn, H3 = 'h' + (hn + 1), H4 = 'h' + (hn + 2), s = '';
      s += '<section aria-labelledby="a-places"><' + H2 + ' id="a-places">' + esc(t('places')) + '</' + H2 + '>';
      s += S.places.length ? '<ul>' + S.places.map(function (p) { return '<li><strong>' + esc(p.name) + '</strong> · ' + esc(t('pk_' + p.kind)) + ' · ' + esc(tname(M().cells[ci(p.c, p.r)])) + ' (' + esc(t('colRow', { c: p.c + 1, r: p.r + 1 })) + ')' + (p.text ? '. ' + esc(p.text) : '') + '</li>'; }).join('') + '</ul>' : '<p>' + esc(t('noneYet')) + '</p>';
      s += '</section><section aria-labelledby="a-species"><' + H2 + ' id="a-species">' + esc(t('speciesPl')) + '</' + H2 + '>';
      S.species.forEach(function (sp) { s += '<' + H3 + '>' + esc(sp.name) + '</' + H3 + '><dl><dt>' + esc(t('habitat')) + '</dt><dd>' + esc(sp.habitat.map(tname).join(', ') || '—') + '</dd><dt>' + esc(t('diet')) + '</dt><dd>' + esc(t('diet_' + sp.diet)) + '</dd><dt>' + esc(t('sizeWord')) + '</dt><dd>' + esc(t('size_' + sp.size)) + '</dd>' + (sp.traits ? '<dt>' + esc(t('traits')) + '</dt><dd>' + esc(sp.traits) + '</dd>' : '') + '</dl>'; });
      if (!S.species.length) s += '<p>' + esc(t('noneYet')) + '</p>';
      s += '</section><section aria-labelledby="a-cultures"><' + H2 + ' id="a-cultures">' + esc(t('cultures')) + '</' + H2 + '>';
      S.cultures.forEach(function (cu) {
        var cal = cu.calendar, home = find('place', cu.place);
        s += '<' + H3 + '>' + esc(cu.name) + '</' + H3 + '>' + (cu.text ? '<p>' + esc(cu.text) + '</p>' : '') + (home ? '<p>' + esc(t('homeland')) + ': ' + esc(home.name) + '</p>' : '');
        s += '<p>' + esc(t('languageTitle')) + ': ' + esc(cu.lang.name || '—') + ' · ' + esc(t('syllables')) + ': ' + esc(cu.lang.syl) + '</p>';
        s += '<' + H4 + '>' + esc(t('calendarTitle')) + '</' + H4 + '><p>' + esc(t('calLede', { days: yearLen(cal), months: cal.months.length, week: cal.week.length, y: cal.year, era: cal.era || '' })) + '</p>';
        s += '<table><caption>' + esc(t('monthsTitle')) + '</caption><thead><tr><th scope="col">' + esc(t('monthLabel')) + '</th><th scope="col">' + esc(t('daysWord')) + '</th></tr></thead><tbody>' + cal.months.map(function (m) { return '<tr><th scope="row">' + esc(m.name) + '</th><td>' + m.days + '</td></tr>'; }).join('') + '</tbody></table>';
        s += '<p>' + esc(t('weekDays')) + ': ' + esc(cal.week.join(', ')) + '</p>';
        s += '<p>' + esc(t('feastsTitle')) + ':</p><ul>' + cal.feasts.map(function (f) { var m = cal.months[f.month]; return '<li>' + esc(f.name) + ' · ' + esc(t('dateShort', { d: f.day, m: m ? m.name : '?' })) + '</li>'; }).join('') + '</ul>';
      });
      if (!S.cultures.length) s += '<p>' + esc(t('noneYet')) + '</p>';
      s += '</section><section aria-labelledby="a-history"><' + H2 + ' id="a-history">' + esc(t('view_timeline')) + '</' + H2 + '>';
      s += S.events.length ? '<ol>' + S.events.slice().sort(function (a, b) { return dateKey(a) - dateKey(b); }).map(function (ev) { var pl = find('place', ev.place); return '<li><strong>' + esc(fmtDate(ev)) + '</strong>: ' + esc(ev.title) + (pl ? ' (' + esc(pl.name) + ')' : '') + (ev.text ? '. ' + esc(ev.text) : '') + '</li>'; }).join('') + '</ol>' : '<p>' + esc(t('noneYet')) + '</p>';
      s += '</section><section aria-labelledby="a-chars"><' + H2 + ' id="a-chars">' + esc(t('characters')) + '</' + H2 + '>';
      S.characters.forEach(function (c) { var cu = find('culture', c.culture), pl = find('place', c.place); s += '<' + H3 + '>' + esc(c.name) + '</' + H3 + '><p>' + [c.role, cu ? t('kind_culture') + ': ' + cu.name : '', pl ? t('placeLabel') + ': ' + pl.name : ''].filter(Boolean).map(esc).join(' · ') + '</p>' + (c.text ? '<p>' + esc(c.text) + '</p>' : ''); });
      if (!S.characters.length) s += '<p>' + esc(t('noneYet')) + '</p>';
      if (S.relations.length) {
        s += '<table><caption>' + esc(t('relTableCap')) + '</caption><thead><tr><th scope="col">' + esc(t('colChar')) + '</th><th scope="col">' + esc(t('colRel')) + '</th><th scope="col">' + esc(t('colWith')) + '</th></tr></thead><tbody>';
        S.relations.forEach(function (rl) { var a = find('character', rl.a), b = find('character', rl.b); if (a && b) s += '<tr><td>' + esc(a.name) + '</td><td>' + esc(t('rel_' + rl.kind)) + '</td><td>' + esc(b.name) + '</td></tr>'; });
        s += '</tbody></table>';
      }
      return s + '</section>';
    }
    var ATLAS_CSS = 'body{font-family:"Atkinson Hyperlegible",Arial,sans-serif;color:#172b42;background:#fff;max-width:60rem;margin:0 auto;padding:1.5rem;line-height:1.55}h1,h2,h3,h4{line-height:1.25}h2{border-bottom:2px solid #c9d8e6;padding-bottom:.2rem;margin-top:2rem}img{max-width:100%;height:auto;border:1px solid #c9d8e6;border-radius:8px}table{border-collapse:collapse;margin:.5rem 0}th,td{border:1px solid #c9d8e6;padding:.25rem .5rem;text-align:left}caption{text-align:left;font-weight:700}nav ul{columns:2}dt{font-weight:700}dd{margin:0 0 .4rem 1rem}a{color:#1f5f8b}footer{margin-top:2rem;color:#44586c;font-size:.9rem}';
    function exportAtlas() {
      mapCanvas(1600).then(function (c) {
        var png = c.toDataURL('image/png'), used = TERR.filter(function (k) { return terrCounts()[k]; });
        var html = '<!DOCTYPE html><html lang="' + LANG + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(t('atlasOf', { name: S.name })) + '</title><style>' + ATLAS_CSS + '</style></head><body><header><h1>' + esc(t('atlasOf', { name: S.name })) + '</h1><p>' + esc(t('atlasIntro')) + '</p></header>';
        html += '<nav aria-labelledby="a-toc"><h2 id="a-toc">' + esc(t('tocTitle')) + '</h2><ul><li><a href="#a-map">' + esc(t('mapTitle')) + '</a></li><li><a href="#a-places">' + esc(t('places')) + '</a></li><li><a href="#a-species">' + esc(t('speciesPl')) + '</a></li><li><a href="#a-cultures">' + esc(t('cultures')) + '</a></li><li><a href="#a-history">' + esc(t('view_timeline')) + '</a></li><li><a href="#a-chars">' + esc(t('characters')) + '</a></li></ul></nav><main>';
        html += '<section aria-labelledby="a-map"><h2 id="a-map">' + esc(t('mapTitle')) + '</h2><figure><img src="' + png + '" alt="' + esc(summaryText()) + '" width="' + c.width + '" height="' + c.height + '"><figcaption>' + esc(t('mapInfo', { shape: t('shape_' + M().shape), w: M().w, h: M().h, seed: M().seed || '—' })) + '</figcaption></figure>';
        html += '<h3>' + esc(t('legend')) + '</h3><ul>' + used.map(function (k) { return '<li>' + esc(tname(k)) + ': ' + esc(t('legendTex_' + k)) + '</li>'; }).join('') + '<li>' + esc(t('legendMarkers')) + '</li></ul></section>';
        html += atlasSections(2) + '</main><footer><p>' + esc(t('atlasFooter')) + '</p></footer></body></html>';
        ctx.download(new Blob([html], { type: 'text/html' }), fileBase() + '-atlas.html');
        atlasDone = true; if (!sel) renderInspector();
      }).catch(function () { ctx.announce(t('exportError')); });
    }
    /* Pie discreto en cada hoja impresa, sin tapar el contenido. */
    function printFoot(page) { page.appendChild(h('p', { class: 'igw-print-credit', text: 'IRIS GREEN · irisgreen.eu' })); return page; }
    function printAtlas() {
      var p1 = h('div', { class: 'igw-print' }, h('h1', { text: t('atlasOf', { name: S.name }) }));
      var wrap = h('div', { class: 'igw-print-map' }); wrap.innerHTML = mapSVGString({ mm: 186, noCredit: true }); p1.appendChild(wrap);
      p1.appendChild(h('p', { text: summaryText() }));
      var p2 = h('div', { class: 'igw-print' }); p2.innerHTML = atlasSections(2);
      ctx.printPages([printFoot(p1), printFoot(p2)]); atlasDone = true; if (!sel) renderInspector();
    }
    ctx.addExport(t('exportAtlas'), exportAtlas);
    ctx.addExport(t('exportPng'), function () { mapCanvas(2000).then(function (c) { return ctx.canvasBlob(c); }).then(function (b) { ctx.download(b, fileBase() + '.png'); }).catch(function () { ctx.announce(t('exportError')); }); });
    ctx.addExport(t('exportSvg'), function () { ctx.download(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + mapSVGString()], { type: 'image/svg+xml' }), fileBase() + '.svg'); });
    ctx.addExport(t('printAtlas'), printAtlas, 'file');
    ctx.command('generate', t('generateBtn'), t('genTitle'), function () { openGenerator(); });
    ctx.command('names', t('namesBtn'), t('namesTitle'), function () { openNames(); });
    ['map', 'calendar', 'timeline', 'relations'].forEach(function (v) { ctx.command('view-' + v, t('viewCmd', { v: t('view_' + v) }), t('viewLabel'), function () { setView(v); }); });
    ['species', 'culture', 'event', 'character', 'place'].forEach(function (k) { ctx.command('add-' + k, t('add_' + k), t('structure'), function () { addItem(k); }); });
    ctx.command('atlas', t('exportAtlas'), t('fileMenu'), exportAtlas);
    ctx.command('print', t('printAtlas'), t('fileMenu'), printAtlas);

    /* ---------- Puntos de partida ---------- */
    function sp(name, habitat, diet, size, traits) { return { id: nid('s'), name: name, habitat: habitat, diet: diet, size: size, traits: traits }; }
    function ensureTerrain(k, near) { if (terrCounts()[k]) return; var i = near; M().cells[i] = k; neigh(i).forEach(function (n) { if (M().cells[n] !== 'water') M().cells[n] = k; }); }
    function example(id) {
      S = emptyWorld(); sel = null; pendingRiver = null; moveMode = false; atlasDone = false;
      if (id === 'island' || id === 'calendar') {
        var g = generate({ type: 'island', seed: 'iris-7', shape: 'hex', w: 28, h: 20, land: 40, rivers: 2 }); S.map = g.map;
        S.name = t(id === 'island' ? 'exIslandName' : 'exTideName');
        S.places = autoPlaces(S.map, g.rnd, 3, SYL.sea);
        ensureTerrain('swamp', ci(10, 10));
        S.species = [sp(t('exSp1'), ['coast', 'swamp'], 'plants', 'medium', t('exSp1T')), sp(t('exSp2'), ['mountain', 'plain'], 'plants', 'medium', t('exSp2T')), sp(t('exSp3'), ['water'], 'meat', 'small', t('exSp3T'))];
        if (id === 'calendar') {
          var cu = { id: nid('c'), name: t('exCul1'), place: S.places[0].id, text: t('exCul1T'), lang: { name: t('exLang1'), syl: SYL.sea },
            calendar: { months: [['Aluna', 40], ['Merosa', 40], ['Talvi', 45], ['Soren', 45], ['Ulma', 40], ['Kesta', 40], ['Irren', 45], ['Delma', 45]].map(function (m) { return { name: m[0], days: m[1] }; }),
              week: ['Ara', 'Bel', 'Cor', 'Dun', 'Esk', 'Fel'], first: 0, year: 342, era: t('exEra1'), feasts: [{ name: t('exFeast1'), month: 0, day: 1 }, { name: t('exFeast2'), month: 3, day: 20 }, { name: t('exFeast3'), month: 7, day: 45 }] } };
          S.cultures.push(cu);
          S.events = [{ id: nid('e'), title: t('exEv1'), year: 1, month: 0, day: 1, culture: cu.id, place: S.places[0].id, text: t('exEv1T') },
            { id: nid('e'), title: t('exEv2'), year: 120, month: 3, day: 20, culture: cu.id, place: S.places[1] ? S.places[1].id : '', text: t('exEv2T') },
            { id: nid('e'), title: t('exEv3'), year: 341, month: 6, day: 12, culture: cu.id, place: '', text: t('exEv3T') }];
        }
      } else if (id === 'atlas') {
        var g2 = generate({ type: 'continent', seed: 'atlas-42', shape: 'hex', w: 40, h: 26, land: 55, rivers: 4 }); S.map = g2.map;
        S.name = t('exAtlasName');
        S.places = autoPlaces(S.map, g2.rnd, 5, SYL.stone);
        ensureTerrain('desert', ci(26, 13)); ensureTerrain('swamp', ci(14, 14));
        S.species = [sp(t('exSp1'), ['coast', 'swamp'], 'plants', 'medium', t('exSp1T')), sp(t('exSp2'), ['mountain', 'plain'], 'plants', 'medium', t('exSp2T')), sp(t('exSp4'), ['desert'], 'both', 'small', t('exSp4T')), sp(t('exSp5'), ['forest'], 'sun', 'huge', t('exSp5T'))];
        var c1 = { id: nid('c'), name: t('exCul2'), place: S.places[0].id, text: t('exCul2T'), lang: { name: t('exLang2'), syl: SYL.stone },
          calendar: { months: [['Dorkal', 36], ['Brumak', 36], ['Tamgor', 36], ['Ulbrim', 36], ['Kardun', 36], ['Gorbel', 36], ['Rokum', 36], ['Dakor', 36], ['Belag', 36], ['Tokar', 36]].map(function (m) { return { name: m[0], days: m[1] }; }),
            week: ['Kar', 'Dor', 'Gar', 'Tok', 'Bru', 'Dun'], first: 2, year: 1204, era: t('exEra2'), feasts: [{ name: t('exFeast4'), month: 0, day: 1 }, { name: t('exFeast5'), month: 4, day: 18 }] } };
        var c2 = { id: nid('c'), name: t('exCul3'), place: S.places[1] ? S.places[1].id : '', text: t('exCul3T'), lang: { name: t('exLang3'), syl: SYL.bright },
          calendar: { months: [['Aelin', 30], ['Solri', 30], ['Oriya', 30], ['Fenel', 30], ['Drisa', 30], ['Quelen', 30], ['Terva', 30], ['Linae', 30], ['Yasol', 30], ['Vaeri', 30], ['Enli', 30], ['Saori', 35]].map(function (m) { return { name: m[0], days: m[1] }; }),
            week: ['Ae', 'Li', 'Ori', 'Sol', 'Fen', 'Dri', 'Ya'], first: 0, year: 88, era: t('exEra3'), feasts: [{ name: t('exFeast6'), month: 5, day: 15 }, { name: t('exFeast7'), month: 11, day: 35 }] } };
        S.cultures = [c1, c2];
        S.events = [{ id: nid('e'), title: t('exEv4'), year: 1, month: 0, day: 1, culture: c1.id, place: S.places[0].id, text: t('exEv4T') },
          { id: nid('e'), title: t('exEv5'), year: 780, month: 4, day: 18, culture: c1.id, place: S.places[2] ? S.places[2].id : '', text: t('exEv5T') },
          { id: nid('e'), title: t('exEv6'), year: 12, month: 2, day: 9, culture: c2.id, place: S.places[1] ? S.places[1].id : '', text: t('exEv6T') },
          { id: nid('e'), title: t('exEv7'), year: 1203, month: 9, day: 30, culture: c1.id, place: S.places[3] ? S.places[3].id : '', text: t('exEv7T') }];
        var k1 = { id: nid('k'), name: 'Tamdor', role: t('exRole1'), culture: c1.id, place: S.places[0].id, text: '' };
        var k2 = { id: nid('k'), name: 'Oriel', role: t('exRole2'), culture: c2.id, place: S.places[1] ? S.places[1].id : '', text: '' };
        var k3 = { id: nid('k'), name: 'Brugar', role: t('exRole3'), culture: c1.id, place: S.places[2] ? S.places[2].id : '', text: '' };
        var k4 = { id: nid('k'), name: 'Solveya', role: t('exRole4'), culture: c2.id, place: S.places[1] ? S.places[1].id : '', text: '' };
        S.characters = [k1, k2, k3, k4];
        S.relations = [{ id: nid('l'), a: k1.id, b: k3.id, kind: 'family' }, { id: nid('l'), a: k1.id, b: k2.id, kind: 'ally' }, { id: nid('l'), a: k2.id, b: k4.id, kind: 'mentor' }, { id: nid('l'), a: k3.id, b: k4.id, kind: 'rival' }, { id: nid('l'), a: k2.id, b: k3.id, kind: 'friend' }];
      } else if (id === 'continent') {
        var g3 = generate({ type: 'continent', seed: 'continente-7', shape: 'hex', w: 36, h: 24, land: 52, rivers: 4 }); S.map = g3.map;
        S.name = t('exContName');
        S.places = autoPlaces(S.map, g3.rnd, 4, SYL.bright);
      }
      kc = { c: Math.floor(M().w / 2), r: Math.floor(M().h / 2) };
      buildCells(); syncCells(); setView(id === 'calendar' ? 'calendar' : 'map', true); fit(); renderStructure(); renderInspector(); summary();
    }

    /* ---------- Validación de proyectos ---------- */
    function rle(a) { var out = [], i = 0; while (i < a.length) { var v = a[i], n = 1; while (i + n < a.length && a[i + n] === v) n++; out.push(TERR.indexOf(v), n); i += n; } return out; }
    function unrle(r, total) { if (!Array.isArray(r) || r.length % 2) return null; var f = []; for (var i = 0; i < r.length; i += 2) { var v = r[i], n = r[i + 1]; if (!(Number.isInteger(v) && v >= 0 && v < TERR.length && Number.isInteger(n) && n > 0) || f.length + n > total) return null; for (var k = 0; k < n; k++) f.push(TERR[v]); } return f.length === total ? f : null; }
    function str(v, max) { return typeof v === 'string' && v.length <= (max || 1000); }
    function int(v, a, b) { return Number.isInteger(v) && v >= a && v <= b; }
    function validate(d) {
      if (!d || typeof d !== 'object' || !str(d.name, 80) || !d.map) return false;
      var m = d.map; if (!(m.shape === 'hex' || m.shape === 'square') || !int(m.w, 4, 80) || !int(m.h, 4, 60)) return false;
      if (!unrle(m.cells, m.w * m.h) || !Array.isArray(m.rivers) || m.rivers.length > 60) return false;
      if (!m.rivers.every(function (rv) { return Array.isArray(rv) && rv.length <= 300 && rv.every(function (i) { return int(i, 0, m.w * m.h - 1); }); })) return false;
      var arrs = ['places', 'species', 'cultures', 'events', 'characters', 'relations'];
      if (!arrs.every(function (k) { return Array.isArray(d[k]) && d[k].length <= 300; })) return false;
      if (!d.places.every(function (p) { return p && str(p.id, 20) && str(p.name, 80) && PLACE_KINDS.indexOf(p.kind) >= 0 && int(p.c, 0, m.w - 1) && int(p.r, 0, m.h - 1) && str(p.text || '', 1000); })) return false;
      if (!d.species.every(function (s) { return s && str(s.id, 20) && str(s.name, 80) && Array.isArray(s.habitat) && s.habitat.every(function (x) { return TERR.indexOf(x) >= 0; }) && DIETS.indexOf(s.diet) >= 0 && SIZES.indexOf(s.size) >= 0 && str(s.traits || '', 1000); })) return false;
      if (!d.cultures.every(function (c) {
        var cal = c && c.calendar;
        return !!cal && str(c.id, 20) && str(c.name, 80) && c.lang && str(c.lang.name, 80) && str(c.lang.syl, 400) && cal && Array.isArray(cal.months) && cal.months.length >= 1 && cal.months.length <= 24 &&
          cal.months.every(function (x) { return x && str(x.name, 40) && int(x.days, 1, 99); }) && Array.isArray(cal.week) && cal.week.length >= 1 && cal.week.length <= 12 && cal.week.every(function (w) { return str(w, 30); }) &&
          int(cal.year, -99999, 99999) && str(cal.era || '', 60) && Array.isArray(cal.feasts) && cal.feasts.length <= 60 && cal.feasts.every(function (f) { return f && str(f.name, 60) && int(f.month, 0, 23) && int(f.day, 1, 99); });
      })) return false;
      if (!d.events.every(function (e) { return e && str(e.id, 20) && str(e.title, 100) && int(e.year, -99999, 99999) && int(e.month, 0, 23) && int(e.day, 1, 99) && str(e.culture || '', 20) && str(e.place || '', 20) && str(e.text || '', 1200); })) return false;
      if (!d.characters.every(function (c) { return c && str(c.id, 20) && str(c.name, 80) && str(c.role || '', 100) && str(c.culture || '', 20) && str(c.place || '', 20) && str(c.text || '', 1000); })) return false;
      return d.relations.every(function (r) { return r && str(r.id, 20) && str(r.a, 20) && str(r.b, 20) && RELS.indexOf(r.kind) >= 0; });
    }

    buildCells(); syncCells(); setView('map', true); renderStructure(); renderInspector();
    return {
      serialize: function () { var c = JSON.parse(JSON.stringify(S)); c.map.cells = rle(S.map.cells); return c; },
      restore: function (d) {
        var c = JSON.parse(JSON.stringify(d)); c.map.cells = unrle(d.map.cells, d.map.w * d.map.h);
        S = c; syncSeq(); if (sel && !find(sel.k, sel.id)) sel = null; pendingRiver = null; moveMode = false;
        kc = { c: Math.min(kc.c, M().w - 1), r: Math.min(kc.r, M().h - 1) };
        syncCells(); if (viewMode === 'map') { fit(); drawOverlay(); } else renderDoc(); renderStructure(); renderInspector(); summary();
      },
      validate: validate,
      start: function (id) { if (id === 'empty') { S = emptyWorld(); sel = null; pendingRiver = null; atlasDone = false; kc = { c: 16, r: 11 }; buildCells(); syncCells(); setView('map', true); fit(); renderStructure(); renderInspector(); summary(); } else example(id); },
      onTool: function (id) { tool = id; pendingRiver = null; moveMode = false; if (viewMode !== 'map') setView('map'); drawOverlay(); stage.dataset.tool = id; },
      onKey: onKey
    };
  }
})(window);
