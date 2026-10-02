/* Iris Green · El taller · Papiroflexia y poliedros (R43).
   Seis vistas de un mismo proyecto:
   - Sólido 3D (Three.js, WebGPU o WebGL 2): poliedros que se despliegan con «Plegado %» (lo mueve la persona).
   - Red para imprimir (SVG en mm): pestañas de pegado, líneas de valle y monte, colores por cara, impresión a escala real.
   - Pliegues: papel que se pliega de verdad (capas reflejadas), deshacer, modelos guiados y hoja de diagramas automática.
   - Vértice plano: teoremas de Maekawa y Kawasaki sobre un patrón que dibuja la persona.
   - Grulla: diagramas originales paso a paso.
   - Cubo Sonobe: plegado del módulo y montaje en 3D pieza a pieza.
   Nada sale del navegador salvo los archivos que descarga la persona. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang, SVGNS = 'http://www.w3.org/2000/svg';
  var GEO = root.IGPapiroGeo, DIA = root.IGPapiroDiag;
  var MODES = ['poly', 'net', 'fold', 'vertex', 'crane', 'sonobe'];
  var PALETTE = ['#e0603a', '#2a8c8c', '#f2b134', '#6a4c93', '#3f8f4f', '#d64d8a', '#3b6fb6', '#8a6a45'];
  var GUIDES = ['plane', 'cup', 'hat', 'envelope'];
  var PAGE = { w: 190, h: 275, netH: 240, head: 28 };  /* mm: hoja A4 menos márgenes de impresión */
  var SON_UNIT = 8, SON_TOTAL = 14;

  IG.defineEngine('papiroflexia', {
    libs: ['three'], version: 1, fileBase: LANG === 'en' ? 'origami' : 'papiroflexia',
    extraKeys: ['kModes', 'kPoly', 'kFold', 'kVertex', 'kSteps'],
    initialStart: function (para) { return { child: 'plane', teen: 'sonobe', adult: 'printable' }[para] || 'icosa'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'icosa', title: t('stIcosa'), desc: t('stIcosaD'), para: 'any' },
        { id: 'plane', title: t('stPlane'), desc: t('stPlaneD'), para: 'child' },
        { id: 'cup', title: t('stCup'), desc: t('stCupD'), para: 'child' },
        { id: 'cubeNet', title: t('stCubeNet'), desc: t('stCubeNetD'), para: 'child' },
        { id: 'crane', title: t('stCrane'), desc: t('stCraneD'), para: 'any' },
        { id: 'sonobe', title: t('stSonobe'), desc: t('stSonobeD'), para: 'teen' },
        { id: 'vertex', title: t('stVertex'), desc: t('stVertexD'), para: 'teen' },
        { id: 'printable', title: t('stPrintable'), desc: t('stPrintableD'), para: 'adult' },
        { id: 'hat', title: t('stHat'), desc: t('stHatD'), para: 'any' },
        { id: 'envelope', title: t('stEnvelope'), desc: t('stEnvelopeD'), para: 'any' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, THREE = root.THREE, T3 = IG.ThreeD;
    var S = defaults(), sel = null, fromFile = false;
    function defaults() {
      return {
        v: 1, mode: 'poly',
        poly: { kind: 'cube', n: 5, hr: 1, edgeMm: 40, netIdx: 0, colors: [], tabs: true, tabMm: 7, numbers: true, fill: true, side: 'out', fold: 100 },
        paper: { shape: 'square', orient: 'square', front: '#2a7ab0', back: '#fff6e0', steps: [], guide: null, pick: 'line' },
        vertex: { creases: [] },
        crane: { step: 0, color: '#d8425f' },
        sonobe: { step: 0, colors: ['#d8425f', '#1f7a8c', '#f2b134'] }
      };
    }
    function num(v, d) { return IG.num(v, d === undefined ? 1 : d); }
    function deg(r) { return r * 180 / Math.PI; }
    function esc(s) { return DIA.esc(s); }
    function svgEl(name, attrs, parent) { var e = D.createElementNS(SVGNS, name); Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }); if (parent) parent.appendChild(e); return e; }
    function parseSVG(str) { var doc = new DOMParser().parseFromString(str, 'image/svg+xml'); return D.importNode(doc.documentElement, true); }

    /* ================= Estructura del escenario ================= */
    var vp = ctx.viewport; vp.id = 'igp-stage'; vp.classList.add('igp-viewport');
    var host3d = h('div', { class: 'igp-3d' });
    var svg = svgEl('svg', { class: 'igp-svg', 'aria-hidden': 'true' });
    var world = svgEl('g', {}, svg), overlay = svgEl('g', {}, svg);
    var diag = h('div', { class: 'igp-diag', 'aria-hidden': 'true' });
    var hud = h('div', { class: 'igs-hud igp-hud', 'aria-hidden': 'true' });
    vp.append(host3d, svg, diag, hud);
    /* pestañas de vista (patrón ARIA tabs) encima del escenario */
    var tabs = h('div', { class: 'igs-tabs igp-tabs', role: 'tablist', 'aria-label': t('modesLabel') });
    var tabBtns = {};
    MODES.forEach(function (m, i) {
      var b = h('button', { type: 'button', role: 'tab', id: 'igp-tab-' + m, 'aria-controls': 'igp-stage', 'aria-selected': 'false', tabindex: '-1', 'aria-keyshortcuts': String(i + 1) }, h('span', { text: t('mode_' + m) }));
      b.addEventListener('click', function () { setMode(m, true); });
      b.addEventListener('keydown', function (e) {
        var k = MODES.indexOf(m), n = null;
        if (e.key === 'ArrowRight') n = (k + 1) % MODES.length; else if (e.key === 'ArrowLeft') n = (k - 1 + MODES.length) % MODES.length; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = MODES.length - 1;
        if (n !== null) { e.preventDefault(); setMode(MODES[n], true); tabBtns[MODES[n]].focus(); }
      });
      tabBtns[m] = b; tabs.appendChild(b);
    });
    vp.parentNode.insertBefore(tabs, vp);
    vp.setAttribute('aria-labelledby', 'igp-tab-poly');

    /* ================= 3D ================= */
    var VgCur = [], renderer = null, scene, camera, controls, loop, polyG, sonG, meshes = [], faceMats = [], faceLines = [], hingeData = null, faceOrder = [];
    var ready3d = T3.createRenderer(THREE, host3d).then(function (r) {
      renderer = r; ctx.setTech('renderer', 'SVG · Three.js r' + THREE.REVISION + ' · ' + r.igsBackend);
      scene = new THREE.Scene(); scene.background = new THREE.Color(0xf1f5f9);
      camera = new THREE.PerspectiveCamera(38, 1, 0.01, 200);
      loop = new T3.Loop(renderer, scene, camera, host3d);
      T3.lights(THREE, scene).sun.position.set(4, 9, 6);
      var ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: 0xe3eaf1, roughness: 1 }));
      ground.rotation.x = -Math.PI / 2; ground.position.y = -0.002; scene.add(ground);
      var grid = new THREE.GridHelper(20, 40, 0xb7c7d6, 0xd3dee8); grid.position.y = 0.001; scene.add(grid);
      polyG = new THREE.Group(); sonG = new THREE.Group(); scene.add(polyG); scene.add(sonG);
      controls = new THREE.OrbitControls(camera, renderer.domElement); controls.enableDamping = false; controls.maxPolarAngle = Math.PI * 0.495;
      controls.addEventListener('change', loop.request);
      var down = null, ray = new THREE.Raycaster();
      renderer.domElement.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY]; });
      renderer.domElement.addEventListener('pointerup', function (e) {
        if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5 || S.mode !== 'poly') { down = null; return; }
        down = null;
        var rc = renderer.domElement.getBoundingClientRect();
        ray.setFromCamera(new THREE.Vector2((e.clientX - rc.left) / rc.width * 2 - 1, -(e.clientY - rc.top) / rc.height * 2 + 1), camera);
        var hit = ray.intersectObjects(meshes, false)[0];
        selectFace(hit ? hit.object.userData.face : null);
      });
    }).catch(function () { host3d.appendChild(h('p', { class: 'igp-no3d', text: t('no3d') })); ctx.setTech('renderer', 'SVG'); });

    /* ================= Poliedros ================= */
    var polyCache = {};
    function polyKey() { var p = S.poly; return p.kind + '|' + (GEO.HAS_N[p.kind] ? p.n : '') + '|' + (GEO.HAS_N[p.kind] ? p.hr : ''); }
    function PD() {
      var k = polyKey();
      if (!polyCache[k]) { var p = GEO.build(S.poly.kind, S.poly.n, S.poly.hr); polyCache[k] = { p: p, nets: GEO.nets(p, PAGE.w, PAGE.netH), draw: {} }; }
      return polyCache[k];
    }
    function curNet() { var c = PD(); return c.nets[((S.poly.netIdx % c.nets.length) + c.nets.length) % c.nets.length]; }
    function netDraw() {
      var c = PD(), key = S.poly.netIdx + '|' + (S.poly.tabs ? S.poly.tabMm / S.poly.edgeMm : 0);
      if (!c.draw[key]) c.draw[key] = GEO.netDrawing(c.p, curNet(), { tabH: S.poly.tabs ? S.poly.tabMm / S.poly.edgeMm : 0.001 });
      return c.draw[key];
    }
    function faceTypes(p) {
      var types = [], idx = p.faceType.map(function (ft) { var i = types.indexOf(ft); if (i < 0) { types.push(ft); i = types.length - 1; } return i; });
      return { types: types, idx: idx };
    }
    /* Colores de partida: si todas las caras son iguales (platónicos), una por color para distinguirlas;
       si hay varios tipos de cara, un color por tipo, que es lo que ayuda a entender el sólido. */
    function defaultColors(p) {
      var ft = faceTypes(p);
      if (ft.types.length === 1) return p.F.map(function (f, i) { return PALETTE[i % PALETTE.length]; });
      return ft.idx.map(function (i) { return PALETTE[i % PALETTE.length]; });
    }
    function colorsByType(p) { var ft = faceTypes(p); return ft.idx.map(function (i) { return PALETTE[i % PALETTE.length]; }); }
    function ensureColors() { var p = PD().p; if (!Array.isArray(S.poly.colors) || S.poly.colors.length !== p.F.length) S.poly.colors = defaultColors(p); }
    function shapeName(nSides) { return t('shape_' + Math.min(nSides, 13)); }
    function polyName() { var p = S.poly; return t('kind_' + p.kind) + (GEO.HAS_N[p.kind] ? ' (' + t('nSides', { n: p.n }) + ')' : ''); }

    function build3d() {
      if (!renderer) return;
      polyG.children.slice().forEach(function (c) { polyG.remove(c); if (c.geometry) c.geometry.dispose(); });
      meshes = []; faceMats = []; faceLines = [];
      var p = PD().p, net = curNet(); ensureColors();
      var r = net.tree.root, n0 = new THREE.Vector3().fromArray(p.normals[r]);
      var q = new THREE.Quaternion().setFromUnitVectors(n0, new THREE.Vector3(0, -1, 0)), Gm = new THREE.Matrix4().makeRotationFromQuaternion(q);
      var Vg = p.V.map(function (v) { return new THREE.Vector3().fromArray(v).applyMatrix4(Gm); }); VgCur = Vg;
      p.F.forEach(function (f, fi) {
        var pos = []; for (var i = 1; i < f.length - 1; i++) [f[0], f[i], f[i + 1]].forEach(function (vi) { pos.push(Vg[vi].x, Vg[vi].y, Vg[vi].z); });
        var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
        var mf = new THREE.MeshStandardMaterial({ color: new THREE.Color(S.poly.colors[fi]), roughness: 0.7, side: THREE.FrontSide });
        var mb = new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.9, side: THREE.BackSide });
        var front = new THREE.Mesh(g, mf), back = new THREE.Mesh(g, mb);
        [front, back].forEach(function (m) { m.matrixAutoUpdate = false; m.userData.face = fi; polyG.add(m); meshes.push(m); });
        var lp = []; f.concat([f[0]]).forEach(function (vi) { lp.push(Vg[vi].x, Vg[vi].y, Vg[vi].z); });
        var lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
        var ln = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0x172b42 })); ln.matrixAutoUpdate = false; polyG.add(ln);
        faceMats[fi] = { front: front, back: back, line: ln, mat: mf, bmat: mb };
      });
      var hg = GEO.hinges(p, net.tree);
      hingeData = hg.map(function (x) { return x && { parent: x.parent, point: new THREE.Vector3().fromArray(x.point).applyMatrix4(Gm), axis: new THREE.Vector3().fromArray(x.axis).transformDirection(Gm), angle: x.angle }; });
      /* orden: cada cara después de su padre */
      var depth = function (f) { var d = 0; while (net.tree.parent[f] >= 0) { f = net.tree.parent[f]; d++; } return d; };
      faceOrder = p.F.map(function (f, i) { return i; }).sort(function (a, b) { return depth(a) - depth(b); });
      applyFold(); highlight3d(); frame3d();
    }
    function applyFold() {
      if (!renderer || !hingeData) return;
      var tt = S.poly.fold / 100, M = [];
      faceOrder.forEach(function (fi) {
        var hd = hingeData[fi];
        if (!hd) { M[fi] = new THREE.Matrix4(); return; }
        var R = new THREE.Matrix4().makeRotationAxis(hd.axis, (1 - tt) * hd.angle);
        var T1 = new THREE.Matrix4().makeTranslation(hd.point.x, hd.point.y, hd.point.z), T2 = new THREE.Matrix4().makeTranslation(-hd.point.x, -hd.point.y, -hd.point.z);
        M[fi] = M[hd.parent].clone().multiply(T1).multiply(R).multiply(T2);
      });
      var box = new THREE.Box3(), p = PD().p;
      p.F.forEach(function (f, fi) {
        var fm = faceMats[fi]; [fm.front, fm.back, fm.line].forEach(function (m) { m.matrix.copy(M[fi]); m.matrixWorldNeedsUpdate = true; });
        f.forEach(function (vi) { box.expandByPoint(VgCur[vi].clone().applyMatrix4(M[fi])); });
      });
      var c = new THREE.Vector3(); box.getCenter(c);
      polyG.position.set(-c.x, -box.min.y, -c.z);
      loop.request();
    }
    function highlight3d() {
      if (!renderer) return;
      faceMats.forEach(function (fm, i) {
        var on = sel && sel.kind === 'face' && sel.i === i;
        fm.mat.color.set(S.poly.colors[i]); fm.bmat.color.set(S.poly.colors[i]).lerp(new THREE.Color(0xffffff), 0.35); fm.mat.emissive = new THREE.Color(on ? 0x3a2a78 : 0x000000);
        fm.line.material.color.set(on ? 0xffd400 : 0x172b42);
      });
      loop.request();
    }
    function frame3d(dirOverride) {
      if (!renderer) return;
      var target = new THREE.Vector3(), box;
      if (S.mode === 'sonobe') { box = new THREE.Box3(new THREE.Vector3(-0.6, -0.1, -0.6), new THREE.Vector3(0.6, 1.1, 0.6)); }
      else { box = new THREE.Box3().setFromObject(polyG); if (box.isEmpty()) box = new THREE.Box3(new THREE.Vector3(-1, 0, -1), new THREE.Vector3(1, 1, 1)); }
      box.getCenter(target);
      var cur = camera.position.clone().sub(controls.target);
      /* Sin dirección pedida, se mantiene desde dónde estás mirando: reencuadrar no te desorienta. */
      var dir = dirOverride ? new THREE.Vector3().fromArray(dirOverride).normalize()
        : (cur.length() > 1e-6 ? cur.normalize() : new THREE.Vector3(0.55, 0.62, 0.75).normalize());
      /* Distancia justa para que quepa lo que se ve de verdad (no la esfera): una red plana vista
         de lado ocupa mucho menos alto que ancho, y así llena la vista. */
      var up = Math.abs(dir.y) > 0.98 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);
      var right = new THREE.Vector3().crossVectors(up, dir).normalize(), vup = new THREE.Vector3().crossVectors(dir, right).normalize();
      var tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), aspect = Math.max(0.3, (host3d.clientWidth || 4) / (host3d.clientHeight || 3));
      var dist = 0.6, corner = new THREE.Vector3();
      [box.min.x, box.max.x].forEach(function (x) { [box.min.y, box.max.y].forEach(function (y) { [box.min.z, box.max.z].forEach(function (z) {
        corner.set(x, y, z).sub(target);
        var depth = corner.dot(dir), px = Math.abs(corner.dot(right)), py = Math.abs(corner.dot(vup));
        dist = Math.max(dist, depth + py / tv, depth + px / (tv * aspect));
      }); }); });
      dist *= 1.1;
      controls.target.copy(target); camera.position.copy(target).addScaledVector(dir, dist);
      camera.near = Math.max(0.005, dist / 200); camera.far = dist * 20; camera.updateProjectionMatrix();
      controls.minDistance = dist * 0.25; controls.maxDistance = dist * 4; controls.update(); loop.request();
    }
    function polyBounds() { return new THREE.Box3().setFromObject(polyG).getBoundingSphere(new THREE.Sphere()); }
    /* Reencuadra solo cuando el sólido se sale de la vista o se queda muy pequeño, y nunca mientras
       se mueve el control: así la cámara no da saltos a cada paso del deslizador. */
    function autoFrame() { if (renderer && S.mode === 'poly') frame3d(); }
    function orbit(dAz, dEl, zoom) {
      if (!renderer) return;
      var off = camera.position.clone().sub(controls.target), sph = new THREE.Spherical().setFromVector3(off);
      sph.theta += THREE.MathUtils.degToRad(dAz || 0); sph.phi = Math.max(0.12, Math.min(Math.PI * 0.49, sph.phi - THREE.MathUtils.degToRad(dEl || 0)));
      if (zoom) sph.radius = Math.max(controls.minDistance, Math.min(controls.maxDistance, sph.radius * zoom));
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sph)); controls.update(); loop.request();
    }

    /* ================= Sonobe 3D ================= */
    var sonTween = 0;
    function buildSonobe(animate) {
      if (!renderer) return;
      sonG.children.slice().forEach(function (c) { sonG.remove(c); c.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); });
      var k = Math.max(0, S.sonobe.step - SON_UNIT + 1), units = DIA.sonobeCube();
      for (var i = 0; i < Math.min(6, k); i++) {
        var u = units[i], g = sonobeUnit(u, S.sonobe.colors[u.color], i === k - 1);
        sonG.add(g);
        if (i === k - 1 && animate && !ctx.reducedMotion()) {
          var nF = new THREE.Vector3().fromArray(u.face), t0 = performance.now();
          g.position.copy(nF.clone().multiplyScalar(0.9));
          cancelAnimationFrame(sonTween);
          (function tick() {
            var a = Math.min(1, (performance.now() - t0) / 450), e = 1 - Math.pow(1 - a, 3);
            g.position.copy(nF.clone().multiplyScalar(0.9 * (1 - e))); loop.request();
            if (a < 1) sonTween = requestAnimationFrame(tick);
          })();
        }
      }
      sonG.position.set(0, 0.5, 0); loop.request();
    }
    function sonobeUnit(u, color, isNew) {
      var nF = new THREE.Vector3().fromArray(u.face), tA = new THREE.Vector3().fromArray(u.tab), w = new THREE.Vector3().crossVectors(nF, tA);
      var c = nF.clone().multiplyScalar(0.5), s = 0.49;
      function P(a, b, n) { return c.clone().addScaledVector(tA, a).addScaledVector(w, b).addScaledVector(nF, n || 0); }
      var sq = [P(-s, -s), P(s, -s), P(s, s), P(-s, s)];
      var in1 = -0.012;
      /* pestaña +tA: bisagra en el borde +tA; tercer vértice hacia dentro por la cara vecina */
      var t1 = [P(0.5, -0.5, 0).addScaledVector(tA, in1), P(0.5, 0.5, 0).addScaledVector(tA, in1), P(0.5, 0.5, -1).addScaledVector(tA, in1)];
      var t2 = [P(-0.5, 0.5, 0).addScaledVector(tA, -in1), P(-0.5, -0.5, 0).addScaledVector(tA, -in1), P(-0.5, -0.5, -1).addScaledVector(tA, -in1)];
      var grp = new THREE.Group(), col = new THREE.Color(color);
      function tri(list, mat) {
        var pos = []; list.forEach(function (tr) { tr.forEach(function (v) { pos.push(v.x, v.y, v.z); }); });
        var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return new THREE.Mesh(g, mat);
      }
      var mSq = new THREE.MeshStandardMaterial({ color: col, roughness: 0.75, side: THREE.DoubleSide, emissive: new THREE.Color(isNew ? 0x2a1f55 : 0x000000) });
      var mTab = new THREE.MeshStandardMaterial({ color: col.clone().lerp(new THREE.Color(0xffffff), 0.35), roughness: 0.8, side: THREE.DoubleSide });
      grp.add(tri([[sq[0], sq[1], sq[2]], [sq[0], sq[2], sq[3]]], mSq));
      grp.add(tri([t1, t2], mTab));
      var lg = new THREE.BufferGeometry().setFromPoints(sq.concat([sq[0]]));
      grp.add(new THREE.Line(lg, new THREE.LineBasicMaterial({ color: isNew ? 0xffd400 : 0x172b42 })));
      [t1, t2].forEach(function (tr) { grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(tr.concat([tr[0]])), new THREE.LineBasicMaterial({ color: 0x44586c }))); });
      return grp;
    }

    /* ================= Red para imprimir (SVG en mm) ================= */
    var view = new ctx.View2D({ scale: 2, min: 0.05, max: 60, onChange: function () { applyView(); } });
    function applyView() { world.setAttribute('transform', 'translate(' + view.x + ',' + view.y + ') scale(' + view.scale + ')'); drawOverlay(); }
    ctx.attachViewGestures(svg, view, { wheelPans: false });
    function mmScale() { return S.poly.edgeMm; }
    function foldStyle() { return S.poly.side === 'out' ? 'mountain' : 'valley'; }
    /* Contenido de la red en mm. forPrint: sin selección; con leyenda aparte. */
    function netContent(opts) {
      opts = opts || {};
      var d = netDraw(), s = mmScale(), ox = (opts.ox || 0), oy = (opts.oy || 0), rot = !!opts.rot;
      var bw = (d.bbox.maxX - d.bbox.minX) * s, bh = (d.bbox.maxY - d.bbox.minY) * s;
      /* y matemática → y de pantalla: se refleja para ver la cara exterior de frente */
      function P(p) { var x = (p[0] - d.bbox.minX) * s, y = (d.bbox.maxY - p[1]) * s; if (rot) { var tx = x; x = bh - y; y = tx; } return [x + ox, y + oy]; }
      function ps(pts) { return pts.map(function (p) { var q = P(p); return q[0].toFixed(3) + ',' + q[1].toFixed(3); }).join(' '); }
      var out = '', cut = 0.35, fl = 0.4, u = s / 40;
      d.tabs.forEach(function (tb) { if (!S.poly.tabs) return; out += '<polygon points="' + ps(tb.pts) + '" fill="#f1f1ee" stroke="#172b42" stroke-width="' + cut + '" stroke-linejoin="round"/>'; });
      d.faces.forEach(function (f, fi) {
        var isSel = opts.select && sel && sel.kind === 'face' && sel.i === fi;
        out += '<polygon data-face="' + fi + '" points="' + ps(f) + '" fill="' + (S.poly.fill ? S.poly.colors[fi] : '#ffffff') + '" stroke="none"' + (isSel ? ' class="igp-selface"' : '') + '/>';
      });
      /* bordes de corte: todo el contorno menos las bisagras */
      var foldSet = {}; d.folds.forEach(function (x) { foldSet[x.e] = 1; });
      var ft = foldStyle(), dash = ft === 'mountain' ? '3.2 1 0.45 1 0.45 1' : '2.6 1.6', col = ft === 'mountain' ? '#6e1428' : '#123f63';
      d.faces.forEach(function (f, fi) {
        var pd = PD().p, fv = pd.F[fi];
        f.forEach(function (pt, i) {
          var a = fv[i], b = fv[(i + 1) % fv.length], ei = -1;
          for (var k = 0; k < pd.E.length; k++) if ((pd.E[k].a === Math.min(a, b)) && (pd.E[k].b === Math.max(a, b))) { ei = k; break; }
          var q = f[(i + 1) % f.length], A = P(pt), B = P(q);
          if (foldSet[ei]) { if (pd.E[ei].f[0] === fi) out += '<line x1="' + A[0].toFixed(3) + '" y1="' + A[1].toFixed(3) + '" x2="' + B[0].toFixed(3) + '" y2="' + B[1].toFixed(3) + '" stroke="' + col + '" stroke-width="' + fl + '" stroke-dasharray="' + dash + '"/>'; }
          else {
            var tabbed = S.poly.tabs && d.tabs.some(function (tb) { return tb.e === ei && tb.face === fi; });
            if (tabbed) out += '<line x1="' + A[0].toFixed(3) + '" y1="' + A[1].toFixed(3) + '" x2="' + B[0].toFixed(3) + '" y2="' + B[1].toFixed(3) + '" stroke="' + col + '" stroke-width="' + fl + '" stroke-dasharray="' + dash + '"/>';
            else out += '<line x1="' + A[0].toFixed(3) + '" y1="' + A[1].toFixed(3) + '" x2="' + B[0].toFixed(3) + '" y2="' + B[1].toFixed(3) + '" stroke="#172b42" stroke-width="' + cut + '" stroke-linecap="round"/>';
          }
        });
      });
      if (S.poly.numbers) {
        var fs = Math.max(2.2, Math.min(4, s * 0.12));
        d.tabs.forEach(function (tb) {
          if (S.poly.tabs) { var c = centroid(tb.pts.map(P)); out += '<text x="' + c[0].toFixed(2) + '" y="' + (c[1] + fs * 0.35).toFixed(2) + '" font-size="' + fs.toFixed(2) + '" text-anchor="middle" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-weight="700" fill="#172b42">' + tb.num + '</text>'; }
          /* el mismo número en el borde donde se pega */
          var cu = d.cuts.filter(function (c2) { return c2.e === tb.e; })[0]; if (!cu) return;
          var A = P(cu.s[0]), B = P(cu.s[1]), fc = centroid(d.faces[cu.f].map(P)), m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], dv = [fc[0] - m[0], fc[1] - m[1]], l = Math.hypot(dv[0], dv[1]) || 1, off = Math.min(fs * 1.1, l * 0.45);
          out += '<text x="' + (m[0] + dv[0] / l * off).toFixed(2) + '" y="' + (m[1] + dv[1] / l * off + fs * 0.35).toFixed(2) + '" font-size="' + (fs * 0.9).toFixed(2) + '" text-anchor="middle" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-weight="700" fill="#172b42" paint-order="stroke" stroke="#fff" stroke-width="' + (fs * 0.25).toFixed(2) + '">' + tb.num + '</text>';
        });
      }
      return { svg: out, w: rot ? bh : bw, h: rot ? bw : bh, u: u };
    }
    function centroid(pts) { var x = 0, y = 0; pts.forEach(function (p) { x += p[0]; y += p[1]; }); return [x / pts.length, y / pts.length]; }
    function netSizeMm() { var d = netDraw(), s = mmScale(); return { w: (d.bbox.maxX - d.bbox.minX) * s, h: (d.bbox.maxY - d.bbox.minY) * s }; }
    /* Reparto en hojas A4: una si cabe (girando si hace falta); si no, mosaico con solape de 10 mm. */
    function printPlan() {
      var sz = netSizeMm(), W = PAGE.w - 4, H = PAGE.netH - 4;
      if (sz.w <= W && sz.h <= H) return { pages: 1, rot: false, cols: 1, rows: 1, w: sz.w, h: sz.h };
      if (sz.h <= W && sz.w <= H) return { pages: 1, rot: true, cols: 1, rows: 1, w: sz.h, h: sz.w };
      var rot = (Math.ceil(sz.h / (W - 10)) * Math.ceil(sz.w / (H - 10))) < (Math.ceil(sz.w / (W - 10)) * Math.ceil(sz.h / (H - 10)));
      var w = rot ? sz.h : sz.w, hh = rot ? sz.w : sz.h, cols = Math.ceil((w - 10) / (W - 10)), rows = Math.ceil((hh - 10) / (H - 10));
      return { pages: cols * rows, rot: rot, cols: cols, rows: rows, w: w, h: hh };
    }
    function maxEdgeOnePage() {
      var sz = netSizeMm(), W = PAGE.w - 4, H = PAGE.netH - 4, k = Math.max(Math.min(W / sz.w, H / sz.h), Math.min(W / sz.h, H / sz.w));
      /* las pestañas no crecen con la arista: margen de seguridad */
      return Math.floor(S.poly.edgeMm * k * 0.97);
    }
    /* Leyenda de la hoja impresa en dos filas, con la regla de comprobación de escala a la derecha. */
    function legendSVG(x, y) {
      var o = '<g font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="3" fill="#172b42">';
      o += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 10) + '" y2="' + y + '" stroke="#172b42" stroke-width="0.35"/><text x="' + (x + 12) + '" y="' + (y + 1) + '">' + esc(t('legCut')) + '</text>';
      var ft = foldStyle();
      o += '<line x1="' + (x + 40) + '" y1="' + y + '" x2="' + (x + 50) + '" y2="' + y + '" stroke="' + (ft === 'mountain' ? '#6e1428' : '#123f63') + '" stroke-width="0.4" stroke-dasharray="' + (ft === 'mountain' ? '3.2 1 0.45 1 0.45 1' : '2.6 1.6') + '"/><text x="' + (x + 52) + '" y="' + (y + 1) + '">' + esc(t(ft === 'mountain' ? 'legMountain' : 'legValley')) + '</text>';
      if (S.poly.tabs) o += '<rect x="' + x + '" y="' + (y + 4.6) + '" width="7" height="4" fill="#f1f1ee" stroke="#172b42" stroke-width="0.3"/><text x="' + (x + 9) + '" y="' + (y + 7.6) + '">' + esc(t('legTab')) + '</text>';
      /* regla: debe medir 50 mm exactos al imprimir a escala 100 % */
      var rx = x + 133;
      o += '<line x1="' + rx + '" y1="' + (y + 6.6) + '" x2="' + (rx + 50) + '" y2="' + (y + 6.6) + '" stroke="#172b42" stroke-width="0.5"/>';
      o += '<line x1="' + rx + '" y1="' + (y + 5.1) + '" x2="' + rx + '" y2="' + (y + 8.1) + '" stroke="#172b42" stroke-width="0.4"/><line x1="' + (rx + 50) + '" y1="' + (y + 5.1) + '" x2="' + (rx + 50) + '" y2="' + (y + 8.1) + '" stroke="#172b42" stroke-width="0.4"/>';
      o += '<text x="' + (rx + 50) + '" y="' + (y + 3.6) + '" text-anchor="end" font-size="2.8">' + esc(t('scaleCheck')) + '</text>';
      return o + '</g>';
    }
    function netPages(forExport) {
      var plan = printPlan(), pages = [], W = PAGE.w, H = PAGE.h, top = PAGE.head;
      var cw = plan.cols > 1 ? (W - 4 - 10) : plan.w, ch = plan.rows > 1 ? (PAGE.netH - 4 - 10) : plan.h;
      var content = netContent({ rot: plan.rot });
      for (var r = 0; r < plan.rows; r++) for (var c = 0; c < plan.cols; c++) {
        var x0 = c * cw, y0 = r * ch, ox = plan.pages === 1 ? (W - plan.w) / 2 : 2;
        var oy = top + (plan.pages === 1 ? Math.max(1, (PAGE.netH - plan.h) / 2) : 2);
        var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + 'mm" height="' + H + 'mm" viewBox="0 0 ' + W + ' ' + H + '" role="img">';
        s += '<title>' + esc(t('netTitle', { name: polyName(), mm: S.poly.edgeMm })) + '</title>';
        s += '<rect width="' + W + '" height="' + H + '" fill="#fff"/>';
        s += '<text x="2" y="6" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="4.6" font-weight="700" fill="#172b42">' + esc(polyName() + ' · ' + t('edgeIs', { mm: S.poly.edgeMm })) + (plan.pages > 1 ? ' · ' + esc(t('sheetOf', { i: r * plan.cols + c + 1, n: plan.pages, r: r + 1, c: c + 1 })) : '') + '</text>';
        s += legendSVG(2, 11);
        s += '<svg x="' + ox + '" y="' + oy + '" width="' + (plan.pages === 1 ? plan.w + 0.5 : cw + 10) + '" height="' + (plan.pages === 1 ? plan.h + 0.5 : ch + 10) + '" viewBox="' + x0 + ' ' + y0 + ' ' + (plan.pages === 1 ? plan.w + 0.5 : cw + 10) + ' ' + (plan.pages === 1 ? plan.h + 0.5 : ch + 10) + '" overflow="hidden">' + content.svg + '</svg>';
        if (plan.pages > 1) {
          /* marcas para alinear las hojas: la franja de 10 mm se repite en la hoja vecina */
          var mk = '#5a49a8';
          if (c < plan.cols - 1) s += '<line x1="' + (ox + cw) + '" y1="' + oy + '" x2="' + (ox + cw) + '" y2="' + (oy + ch + 10) + '" stroke="' + mk + '" stroke-width="0.25" stroke-dasharray="1 1.5"/>';
          if (r < plan.rows - 1) s += '<line x1="' + ox + '" y1="' + (oy + ch) + '" x2="' + (ox + cw + 10) + '" y2="' + (oy + ch) + '" stroke="' + mk + '" stroke-width="0.25" stroke-dasharray="1 1.5"/>';
          s += '<text x="2" y="' + (H - 7) + '" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="2.8" fill="#172b42">' + esc(t('tileHelp')) + '</text>';
        }
        s += '<text x="' + (W - 2) + '" y="' + (H - 2) + '" text-anchor="end" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="2.6" fill="#44586c">IRIS GREEN · irisgreen.eu</text></svg>';
        pages.push(s);
      }
      return pages;
    }
    function netSVGFile() {
      /* archivo único en mm (sin partir en hojas): para recortadoras o para imprimir con otro programa */
      var c = netContent({ ox: 5, oy: 14 }), W = Math.ceil(c.w + 10), H = Math.ceil(c.h + 22);
      return '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="' + W + 'mm" height="' + H + 'mm" viewBox="0 0 ' + W + ' ' + H + '"><title>' + esc(t('netTitle', { name: polyName(), mm: S.poly.edgeMm })) + '</title><rect width="' + W + '" height="' + H + '" fill="#fff"/>' +
        '<text x="5" y="6" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="4" font-weight="700" fill="#172b42">' + esc(polyName() + ' · ' + t('edgeIs', { mm: S.poly.edgeMm })) + '</text>' + legendSVG(5, 10.5) + c.svg +
        '<text x="' + (W - 3) + '" y="' + (H - 2) + '" text-anchor="end" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="2.6" fill="#44586c">IRIS GREEN · irisgreen.eu</text></svg>';
    }
    function renderNet(fit) {
      var c = netContent({ select: true });
      world.innerHTML = '<rect x="-4" y="-4" width="' + (c.w + 8) + '" height="' + (c.h + 8) + '" fill="#fff" stroke="#c9d8e6" stroke-width="' + (1 / view.scale) + '"/>' + c.svg;
      if (fit) view.fit({ minX: -6, minY: -6, maxX: c.w + 6, maxY: c.h + 6 }, vp.clientWidth, vp.clientHeight, 16);
      else applyView();
    }

    /* ================= Pliegues: papel ================= */
    var paperCache = null, pick = [], cursor = -1, flipSide = false, foldType = 'V', topOnly = false, guideCache = {};
    function paperStates() {
      var key = JSON.stringify([S.paper.shape, S.paper.orient, S.paper.steps]);
      if (!paperCache || paperCache.key !== key) { var r = GEO.replay(S.paper, S.paper.steps); paperCache = { key: key, states: r.states, errors: r.errors, marks: null }; }
      return paperCache;
    }
    function curPaper() { var pc = paperStates(); return pc.states[pc.states.length - 1]; }
    function marks() { var pc = paperStates(); if (!pc.marks) pc.marks = GEO.paperMarks(curPaper()); return pc.marks; }
    function guideDef(id) { if (!guideCache[id]) guideCache[id] = GEO.guide(id); return guideCache[id]; }
    function guideState() {
      var g = S.paper.guide; if (!g) return null;
      var def = guideDef(g), k = S.paper.steps.length, on = k <= def.steps.length && S.paper.steps.every(function (st, i) { return JSON.stringify(stripNote(st)) === JSON.stringify(def.steps[i]); });
      var prefix = 0; while (prefix < k && prefix < def.steps.length && JSON.stringify(stripNote(S.paper.steps[prefix])) === JSON.stringify(def.steps[prefix])) prefix++;
      return { id: g, def: def, k: k, n: def.steps.length, onTrack: on, done: on && k === def.steps.length, prefix: prefix };
    }
    function stripNote(st) { var c = {}; Object.keys(st).forEach(function (k) { if (k !== 'note') c[k] = st[k]; }); return c; }
    var PSCALE = 100;
    function paperShade(part, maxZ) { var base = part.flip ? S.paper.back : S.paper.front; return DIA.shade(base, -Math.min(0.24, 0.035 * (maxZ - part.z))); }
    function renderFold(fit) {
      var st = curPaper(), maxZ = st.parts.length - 1, out = '';
      st.parts.forEach(function (pt) { out += '<polygon points="' + pt.poly.map(function (p) { return (p[0] * PSCALE).toFixed(3) + ',' + (p[1] * PSCALE).toFixed(3); }).join(' ') + '" fill="' + paperShade(pt, maxZ) + '" stroke="#172b42" stroke-width="1.4" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>'; });
      world.innerHTML = out;
      if (fit) fitPaper(); else applyView();
    }
    function fitPaper() { var b = GEO.paperBBox(curPaper()); view.fit({ minX: b.minX * PSCALE - 12, minY: b.minY * PSCALE - 12, maxX: b.maxX * PSCALE + 12, maxY: b.maxY * PSCALE + 12 }, vp.clientWidth, vp.clientHeight, 24); }
    /* Pliegue que se está preparando con los puntos elegidos */
    function pendingFold() {
      if (pick.length < 2) return null;
      var st = curPaper(), a, b, side;
      if (S.paper.pick === 'p2p') { var pp = GEO.pointToPoint(pick[0], pick[1]); a = pp.a; b = pp.b; side = pp.side; }
      else { a = pick[0]; b = pick[1]; side = GEO.defaultSide(st, a, b); }
      if (flipSide) side = -side;
      return { op: 'fold', a: a, b: b, type: foldType, side: side, layers: topOnly ? 'top' : 'all' };
    }
    function drawOverlay() {
      while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
      if (S.mode !== 'fold') return;
      function P(p) { return view.toScreen(p[0] * PSCALE, p[1] * PSCALE); }
      var st = curPaper(), gs = guideState();
      /* pista del modelo guiado */
      if (gs && gs.onTrack && !gs.done && !pick.length) {
        var gstep = gs.def.steps[gs.k];
        if (gstep.op === 'fold') { var seg = GEO.lineOnPaper(st, gstep.a, gstep.b); if (seg) { var g0 = P(seg[0]), g1 = P(seg[1]); svgEl('line', { x1: g0.x, y1: g0.y, x2: g1.x, y2: g1.y, class: 'igp-hint' }, overlay); } }
      }
      marks().forEach(function (m, i) { var q = P(m.p); svgEl('circle', { cx: q.x, cy: q.y, r: m.kind === 'v' ? 4.5 : 3.5, class: 'igp-mark' + (m.kind === 'm' ? ' igp-mark-mid' : '') }, overlay); });
      pick.forEach(function (p, i) { var q = P(p); svgEl('circle', { cx: q.x, cy: q.y, r: 8, class: 'igp-picked' }, overlay); var tx = svgEl('text', { x: q.x + 10, y: q.y - 10, class: 'igp-picklabel' }, overlay); tx.textContent = String(i + 1); });
      var pf = pendingFold();
      if (pf) {
        var seg2 = GEO.lineOnPaper(st, pf.a, pf.b) || GEO.clipLineToBox(pf.a, pf.b, GEO.paperBBox(st), 0.05);
        if (seg2) {
          var dx = seg2[1][0] - seg2[0][0], dy = seg2[1][1] - seg2[0][1];
          var s0 = P([seg2[0][0] - dx * 0.06, seg2[0][1] - dy * 0.06]), s1 = P([seg2[1][0] + dx * 0.06, seg2[1][1] + dy * 0.06]);
          svgEl('line', { x1: s0.x, y1: s0.y, x2: s1.x, y2: s1.y, class: pf.type === 'V' ? 'igp-valley' : 'igp-mountain' }, overlay);
          var ar = foldArrow(st, pf);
          if (ar) { var A = P(ar[0]), B = P(ar[1]), mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, cx = mx - (B.y - A.y) * 0.3, cy = my + (B.x - A.x) * 0.3; svgEl('path', { d: 'M' + A.x + ',' + A.y + ' Q' + cx + ',' + cy + ' ' + B.x + ',' + B.y, class: 'igp-arrow', 'marker-end': 'url(#igp-ah)' }, overlay); }
        }
      }
      if (cursor >= 0 && marks()[cursor]) { var c = P(marks()[cursor].p); svgEl('circle', { cx: c.x, cy: c.y, r: 12, class: 'igp-cursor' }, overlay); }
    }
    function foldArrow(st, step) {
      var r = GEO.foldPaper(st, step); if (!r.ok || !r.movedBefore || !r.movedBefore.length) return null;
      var big = r.movedBefore.slice().sort(function (x, y) { return Math.abs(GEO.area(y)) - Math.abs(GEO.area(x)); })[0];
      var nrm = GEO.lineNormal(step.a, step.b), far = big[0], fd = -1;
      big.forEach(function (q) { var d = Math.abs(GEO.sideOf(q, step.a, nrm)); if (d > fd) { fd = d; far = q; } });
      var c = GEO.centroid2(big), p0 = [far[0] + (c[0] - far[0]) * 0.3, far[1] + (c[1] - far[1]) * 0.3], R = GEO.reflectT(step.a, step.b);
      return [p0, GEO.applyT(R, p0)];
    }
    var defs = svgEl('defs', {}, svg);
    defs.innerHTML = '<marker id="igp-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="#172b42"/></marker>';
    function pickPoint(p, announceIt) {
      if (pick.length >= 2) pick = [];
      if (pick.length === 1 && Math.hypot(pick[0][0] - p[0], pick[0][1] - p[1]) < 1e-6) { ctx.announce(t('samePoint')); return; }
      pick.push(p.slice()); flipSide = false;
      if (pick.length === 2) { var pf = pendingFold(), r = GEO.foldPaper(curPaper(), pf); if (!r.ok) { ctx.announce(t('foldErr_' + r.error)); setStatus(t('foldErr_' + r.error)); } else setStatus(t('readyToFold')); }
      else setStatus(t(S.paper.pick === 'p2p' ? 'pickTarget' : 'pickSecond'));
      if (announceIt !== false) ctx.announce(t('pointPicked', { n: pick.length, x: num(p[0] * 100, 0), y: num(p[1] * 100, 0) }) + ' ' + (pick.length === 2 ? t('readyToFold') : t(S.paper.pick === 'p2p' ? 'pickTarget' : 'pickSecond')));
      drawOverlay(); renderTools();
    }
    function doFold() {
      var pf = pendingFold(); if (!pf) { ctx.announce(t('needTwo')); return; }
      var r = GEO.foldPaper(curPaper(), pf);
      if (!r.ok) { ctx.announce(t('foldErr_' + r.error)); setStatus(t('foldErr_' + r.error)); return; }
      S.paper.steps.push(pf); pick = []; cursor = -1; sel = null;
      commit(t('folded', { n: S.paper.steps.length, type: t(pf.type === 'V' ? 'valleyWord' : 'mountainWord') }));
    }
    function doFlip() { S.paper.steps.push({ op: 'flip' }); pick = []; cursor = -1; commit(t('flipped')); }
    function doRotate() { S.paper.steps.push({ op: 'rotate' }); pick = []; cursor = -1; commit(t('rotatedPaper')); }
    function doGuideStep() {
      var gs = guideState(); if (!gs) return;
      if (!gs.onTrack) { ctx.announce(t('guideOff')); return; }
      if (gs.done) { ctx.announce(t('guideDone')); return; }
      S.paper.steps.push(JSON.parse(JSON.stringify(gs.def.steps[gs.k]))); pick = []; cursor = -1;
      commit(t('guideStepDone', { k: gs.k + 1, n: gs.n }));
    }
    function loadGuide(id) {
      if (id && GUIDES.indexOf(id) >= 0) { var def = guideDef(id); S.paper.shape = def.paper.shape; S.paper.orient = def.paper.orient; S.paper.guide = id; }
      else S.paper.guide = null;
      S.paper.steps = []; pick = []; cursor = -1; sel = null;
    }
    function moveCursor(dx, dy) {
      var ms = marks(); if (!ms.length) return;
      if (cursor < 0 || !ms[cursor]) { cursor = 0; }
      else {
        var c = ms[cursor].p, best = -1, bs = Infinity;
        ms.forEach(function (m, i) {
          if (i === cursor) return; var vx = m.p[0] - c[0], vy = m.p[1] - c[1], d = Math.hypot(vx, vy); if (d < 1e-9) return;
          var along = (vx * dx + vy * dy) / d; if (along < 0.5) return; /* ±60° */
          var sc = d * (2 - along); if (sc < bs) { bs = sc; best = i; }
        });
        if (best >= 0) cursor = best;
      }
      var p = ms[cursor].p; drawOverlay();
      ctx.announce(t('cursorAt', { x: num(p[0] * 100, 0), y: num(p[1] * 100, 0), kind: t(ms[cursor].kind === 'v' ? 'markCorner' : 'markMid') }));
    }

    /* Hoja de diagramas: cada paso sobre el estado anterior, con la línea, la flecha y el texto. */
    function paperPanels() {
      var pc = paperStates(), gs = guideState(), panels = [];
      S.paper.steps.forEach(function (st, i) {
        var state = pc.states[i], items = [], maxZ = state.parts.length - 1;
        state.parts.forEach(function (pt) { items.push({ k: 'poly', pts: pt.poly, fill: paperShade(pt, maxZ) }); });
        var b = GEO.paperBBox(state);
        if (st.op === 'fold') {
          var seg = GEO.lineOnPaper(state, st.a, st.b);
          if (seg) { var dx = seg[1][0] - seg[0][0], dy = seg[1][1] - seg[0][1]; items.push({ k: 'line', a: [seg[0][0] - dx * 0.06, seg[0][1] - dy * 0.06], b: [seg[1][0] + dx * 0.06, seg[1][1] + dy * 0.06], style: st.type === 'V' ? 'valley' : 'mountain' }); }
          var ar = foldArrow(state, st); if (ar) items.push({ k: 'arrow', from: ar[0], to: ar[1], type: st.type === 'V' ? 'valley' : 'mountain', bend: 0.3 });
        } else items.push({ k: 'turn', p: [b.maxX + 0.12, b.minY], size: Math.max(b.maxX - b.minX, b.maxY - b.minY) * 0.14 });
        var text = t('stepN', { n: i + 1 }) + ' ' + stepText(st, i, gs);
        panels.push({ items: items, caption: text });
      });
      var fin = curPaper(), fitems = [], mz = fin.parts.length - 1;
      fin.parts.forEach(function (pt) { fitems.push({ k: 'poly', pts: pt.poly, fill: paperShade(pt, mz) }); });
      panels.push({ items: fitems, caption: gs && gs.done ? t('guideEnd_' + gs.id) : t('finalResult') });
      return panels;
    }
    function stepText(st, i, gs) {
      if (st.note) return st.note;
      if (gs && i < gs.n && i < gs.prefix) return t('guide_' + gs.id + '_' + (i + 1));
      if (st.op === 'flip') return t('descFlip');
      if (st.op === 'rotate') return t('descRotate');
      return t(st.type === 'V' ? 'descValley' : 'descMountain') + ' ' + t(st.layers === 'top' ? 'descTop' : 'descAll');
    }
    /* Páginas A4 con 6 casillas (2 × 3), título y leyenda. Texto real para PDF accesible. */
    function sheetPages(title, panels, colors) {
      var W = PAGE.w, H = PAGE.h, cols = 2, rows = 3, top = 24, gap = 5, pw = (W - gap) / cols, ph = (H - top - 8 - gap * (rows - 1)) / rows, dh = ph - 22, pages = [];
      for (var i = 0; i < panels.length; i += cols * rows) {
        var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + 'mm" height="' + H + 'mm" viewBox="0 0 ' + W + ' ' + H + '" role="img"><title>' + esc(title) + '</title><rect width="' + W + '" height="' + H + '" fill="#fff"/>';
        s += '<text x="0" y="7" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="5.4" font-weight="700" fill="#172b42">' + esc(title) + '</text>';
        s += sheetLegend(0, 15);
        panels.slice(i, i + cols * rows).forEach(function (pn, j) {
          var cx = (j % cols) * (pw + gap), cy = top + Math.floor(j / cols) * (ph + gap);
          s += '<rect x="' + cx + '" y="' + cy + '" width="' + pw + '" height="' + ph + '" rx="3" fill="#fff" stroke="#c9d8e6" stroke-width="0.3"/>';
          var inner = DIA.toSVG(pn.items, { front: colors[0], back: colors[1], idp: 'p' + (i + j) + '-' });
          s += inner.replace('<svg ', '<svg x="' + (cx + 3) + '" y="' + (cy + 2) + '" width="' + (pw - 6) + '" height="' + dh + '" ');
          wrap(pn.caption, Math.floor((pw - 6) / 1.62)).slice(0, 5).forEach(function (ln, k) {
            var lab = k === 0 ? (ln.match(/^[^.]*\./) || [''])[0] : '';
            s += '<text x="' + (cx + 3) + '" y="' + (cy + dh + 6 + k * 4) + '" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="3.3" fill="#172b42">' + (lab ? '<tspan font-weight="700">' + esc(lab) + '</tspan>' + esc(ln.slice(lab.length)) : esc(ln)) + '</text>';
          });
        });
        s += '<text x="' + W + '" y="' + (H - 1) + '" text-anchor="end" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="2.6" fill="#44586c">' + esc(t('pageN', { i: pages.length + 1, n: Math.ceil(panels.length / (cols * rows)) })) + ' · IRIS GREEN · irisgreen.eu</text></svg>';
        pages.push(s);
      }
      return pages;
    }
    function sheetLegend(x, y) {
      return '<g font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="3" fill="#172b42">' +
        '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 12) + '" y2="' + y + '" stroke="#1f5f8b" stroke-width="0.5" stroke-dasharray="2.4 1.4"/><text x="' + (x + 14) + '" y="' + (y + 1) + '">' + esc(t('legValley')) + '</text>' +
        '<line x1="' + (x + 55) + '" y1="' + y + '" x2="' + (x + 67) + '" y2="' + y + '" stroke="#a1283c" stroke-width="0.5" stroke-dasharray="2.7 .9 .4 .9 .4 .9"/><text x="' + (x + 69) + '" y="' + (y + 1) + '">' + esc(t('legMountain')) + '</text>' +
        '<line x1="' + (x + 122) + '" y1="' + y + '" x2="' + (x + 134) + '" y2="' + y + '" stroke="#5d7185" stroke-width="0.25"/><text x="' + (x + 136) + '" y="' + (y + 1) + '">' + esc(t('legCrease')) + '</text></g>';
    }
    function wrap(text, maxc) {
      var words = String(text).split(/\s+/), lines = [], cur = '';
      words.forEach(function (w) { if ((cur + ' ' + w).trim().length > maxc && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
      if (cur) lines.push(cur); return lines;
    }
    function stackedSVG(pages) {
      /* una sola imagen SVG con todas las hojas una debajo de otra */
      var W = PAGE.w, H = PAGE.h, out = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="' + W + 'mm" height="' + (H * pages.length + 4 * (pages.length - 1)) + 'mm" viewBox="0 0 ' + W + ' ' + (H * pages.length + 4 * (pages.length - 1)) + '">';
      pages.forEach(function (p, i) { out += p.replace('<svg ', '<svg x="0" y="' + (i * (H + 4)) + '" ').replace(/ width="[\d.]+mm" height="[\d.]+mm"/, ' width="' + W + '" height="' + H + '"'); });
      return out + '</svg>';
    }
    function printSVGPages(pages) { ctx.printPages(pages.map(parseSVG)); }

    /* ================= Vértice plano ================= */
    var vCursor = 0, vSel = -1;
    function vRender() {
      var cr = sortedCreases(), res = GEO.checkVertex(cr), out = '';
      out += '<rect x="-96" y="-96" width="192" height="192" rx="4" fill="' + S.paper.back + '" stroke="#172b42" stroke-width="1.2" vector-effect="non-scaling-stroke"/>';
      out += '<circle r="78" fill="none" stroke="#c9d8e6" stroke-width="1" vector-effect="non-scaling-stroke"/>';
      /* sectores con su ángulo */
      res.sectors.forEach(function (sa, i) {
        var a0 = cr[i].a, mid = (a0 + sa / 2) * Math.PI / 180, bad = res.blbBad.indexOf(i) >= 0;
        var tx = Math.cos(mid) * 52, ty = -Math.sin(mid) * 52;
        out += '<text x="' + tx.toFixed(1) + '" y="' + (ty + 3).toFixed(1) + '" class="igp-sector' + (bad ? ' igp-sector-bad' : '') + '" text-anchor="middle">' + esc(num(sa, 1) + '°') + '</text>';
      });
      cr.forEach(function (c, i) {
        var a = c.a * Math.PI / 180, x = Math.cos(a) * 96, y = -Math.sin(a) * 96;
        out += '<line x1="0" y1="0" x2="' + x.toFixed(2) + '" y2="' + y.toFixed(2) + '" class="' + (c.t === 'V' ? 'igp-valley' : 'igp-mountain') + (i === vSel ? ' igp-crease-sel' : '') + '" data-crease="' + i + '"/>';
        var lx = Math.cos(a) * 86, ly = -Math.sin(a) * 86;
        out += '<text x="' + (lx + (Math.cos(a) > 0 ? -2 : 2)).toFixed(1) + '" y="' + (ly + (Math.sin(a) > 0 ? 9 : -5)).toFixed(1) + '" class="igp-creaselabel" text-anchor="middle">' + (c.t === 'V' ? t('vShort') : t('mShort')) + (i + 1) + '</text>';
      });
      var ca = vCursor * Math.PI / 180;
      out += '<line x1="0" y1="0" x2="' + (Math.cos(ca) * 92).toFixed(2) + '" y2="' + (-Math.sin(ca) * 92).toFixed(2) + '" class="igp-vcursor"/>';
      out += '<circle r="3.5" fill="#172b42"/>';
      world.innerHTML = out;
      view.fit({ minX: -100, minY: -100, maxX: 100, maxY: 100 }, vp.clientWidth, vp.clientHeight, 12);
      return res;
    }
    function sortedCreases() { return S.vertex.creases.slice().sort(function (a, b) { return a.a - b.a; }); }
    function vAdd(angle) {
      angle = ((Math.round(angle * 10) / 10) % 360 + 360) % 360;
      var cr = sortedCreases(), near = -1;
      cr.forEach(function (c, i) { var d = Math.abs(((c.a - angle + 540) % 360) - 180); if (d < 4) near = i; });
      if (near >= 0) { vSel = near; renderAll(); ctx.announce(t('creaseSel', { n: near + 1, a: num(cr[near].a, 1), type: t(cr[near].t === 'V' ? 'valleyWord' : 'mountainWord') })); return; }
      if (cr.length >= 16) { ctx.announce(t('tooManyCreases')); return; }
      S.vertex.creases = cr.concat([{ a: angle, t: foldType }]).sort(function (a, b) { return a.a - b.a; });
      vSel = S.vertex.creases.findIndex(function (c) { return c.a === angle; });
      commit(t('creaseAdded', { a: num(angle, 1), type: t(foldType === 'V' ? 'valleyWord' : 'mountainWord') }));
    }
    function vPreset(id) {
      var P = {
        cross: [[0, 'M'], [90, 'M'], [180, 'M'], [270, 'V']],
        kite: [[0, 'V'], [67.5, 'M'], [180, 'V'], [292.5, 'V']],
        six: [[0, 'M'], [50, 'V'], [120, 'M'], [180, 'M'], [230, 'V'], [300, 'M']],
        bad: [[0, 'M'], [70, 'M'], [180, 'M'], [250, 'V']]
      }[id] || [];
      S.vertex.creases = P.map(function (x) { return { a: x[0], t: x[1] }; }); vSel = -1;
    }

    /* ================= Grulla y Sonobe ================= */
    var craneSteps = DIA.craneSteps(), sonSteps = DIA.sonobeSteps();
    function renderDiagram() {
      ctx.clear(diag);
      var isCrane = S.mode === 'crane', k = isCrane ? S.crane.step : S.sonobe.step;
      var total = isCrane ? craneSteps.length : SON_TOTAL;
      var cap = h('div', { class: 'igp-caption' }, h('strong', { text: t('stepOf', { k: k + 1, n: total }) }), ' ', h('span', { text: diagramText() }));
      if (!isCrane && k >= SON_UNIT) { diag.dataset.three = 'true'; diag.appendChild(cap); return; }
      diag.dataset.three = 'false';
      var st = isCrane ? craneSteps[k] : sonSteps[k];
      var node = parseSVG(DIA.toSVG(st.items, { front: isCrane ? S.crane.color : S.sonobe.colors[0], back: '#ffffff', idp: 'v-' }));
      node.setAttribute('class', 'igp-diag-svg'); node.setAttribute('aria-hidden', 'true'); node.removeAttribute('role');
      diag.appendChild(node); diag.appendChild(cap);
    }
    function diagramText() {
      if (S.mode === 'crane') return t(craneSteps[S.crane.step].key);
      var k = S.sonobe.step;
      if (k < SON_UNIT) return t(sonSteps[k].key);
      return t('sonA' + (k - SON_UNIT + 1));
    }
    function goStep(d, abs) {
      var isCrane = S.mode === 'crane', total = isCrane ? craneSteps.length : SON_TOTAL, obj = isCrane ? S.crane : S.sonobe, prev = obj.step;
      obj.step = abs !== undefined ? Math.max(0, Math.min(total - 1, abs)) : Math.max(0, Math.min(total - 1, obj.step + d));
      if (obj.step === prev) { ctx.announce(t(d > 0 ? 'lastStep' : 'firstStep')); return; }
      sel = null; renderAll();
      if (!isCrane) { buildSonobe(obj.step > prev); if (obj.step >= SON_UNIT && prev < SON_UNIT) setTimeout(function () { if (loop) loop.resize(); frame3d(); }, 30); }
      ctx.announce(t('stepOf', { k: obj.step + 1, n: total }) + ' ' + diagramText());
    }
    function cranePanels() { return craneSteps.map(function (s, i) { return { items: s.items, caption: t('stepN', { n: i + 1 }) + ' ' + t(s.key) }; }); }
    function sonobePanels() { return sonSteps.map(function (s, i) { return { items: s.items, caption: t('stepN', { n: i + 1 }) + ' ' + t(s.key) }; }).concat([{ items: sonobeAssemblyItems(), caption: t('sonAssemblyPrint') }]); }
    /* dibujo en perspectiva caballera del cubo montado, para la hoja impresa */
    function sonobeAssemblyItems() {
      var c = S.sonobe.colors, o = [0, 0], dx = [0.5, -0.35];
      function P(x, y, z) { return [o[0] + x + z * dx[0], o[1] - y + z * dx[1]]; }
      return [
        { k: 'poly', pts: [P(0, 0, 0), P(1, 0, 0), P(1, 1, 0), P(0, 1, 0)], fill: c[2] },
        { k: 'poly', pts: [P(1, 0, 0), P(1, 0, 1), P(1, 1, 1), P(1, 1, 0)], fill: DIA.shade(c[1], -0.15) },
        { k: 'poly', pts: [P(0, 1, 0), P(1, 1, 0), P(1, 1, 1), P(0, 1, 1)], fill: DIA.shade(c[0], 0.1) },
        { k: 'line', a: P(0, 1, 0), b: P(1, 0, 0), style: 'crease' }, { k: 'line', a: P(1, 1, 0), b: P(1, 0, 1), style: 'crease' }, { k: 'line', a: P(0, 1, 1), b: P(1, 1, 0), style: 'crease' }
      ];
    }

    /* ================= Paneles ================= */
    function setStatus(text) { ctx.clear(hud); if (text) hud.appendChild(h('span', { text: text })); }
    function modeName(m) { return t('mode_' + m); }
    function listButton(label, small, current, onClick, swatch) {
      var b = h('button', { type: 'button', 'aria-current': String(!!current) }, swatch ? h('span', { class: 'igs-swatch', style: 'background:' + swatch }) : null, h('span', { text: label }), small ? h('small', { text: small }) : null);
      b.addEventListener('click', onClick); return h('li', null, b);
    }
    /* Conserva el foco al redibujar barras y paneles (teclado y lectores de pantalla no pierden el sitio). */
    function focusKey(container) {
      var a = D.activeElement; if (!a || !container.contains(a)) return null;
      var lab = a.id && container.querySelector('label[for="' + a.id + '"]');
      return { tag: a.tagName, type: a.type || '', text: lab ? lab.textContent : (a.getAttribute('aria-label') || a.textContent || '') };
    }
    function restoreFocus(container, k) {
      if (!k) return;
      var list = container.querySelectorAll('button,input,select,textarea');
      for (var i = 0; i < list.length; i++) {
        var el = list[i]; if (el.tagName !== k.tag || (el.type || '') !== k.type) continue;
        var lab = el.id && container.querySelector('label[for="' + el.id + '"]');
        var txt = lab ? lab.textContent : (el.getAttribute('aria-label') || el.textContent || '');
        if (txt === k.text && !el.disabled) { try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); } return; }
      }
    }
    function renderSide() {
      var st = [], ul = h('ul', { class: 'igs-list' }), m = S.mode;
      if (m === 'poly' || m === 'net') {
        var p = PD().p; ensureColors();
        st.push(h('h3', { text: t('facesTitle', { n: p.F.length }) }));
        p.F.forEach(function (f, i) { ul.appendChild(listButton(t('faceN', { n: i + 1 }), shapeName(f.length), sel && sel.kind === 'face' && sel.i === i, function () { selectFace(i); }, S.poly.colors[i])); });
      } else if (m === 'fold') {
        st.push(h('h3', { text: t('stepsTitle', { n: S.paper.steps.length }) }));
        ul.appendChild(listButton(t('paperStart'), t(S.paper.shape === 'a4' ? 'paperA4' : 'paperSquare'), !sel, function () { sel = null; renderAll(); ctx.announce(t('paperStart')); }, S.paper.front));
        S.paper.steps.forEach(function (s, i) { ul.appendChild(listButton(t('stepN', { n: i + 1 }).replace(/\.$/, ''), s.op === 'flip' ? t('flipShort') : s.op === 'rotate' ? t('rotateShort') : t(s.type === 'V' ? 'valleyWord' : 'mountainWord'), sel && sel.kind === 'step' && sel.i === i, function () { sel = { kind: 'step', i: i }; renderAll(); ctx.announce(t('stepN', { n: i + 1 }) + ': ' + stepText(s, i, guideState())); })); });
      } else if (m === 'vertex') {
        var cr = sortedCreases();
        st.push(h('h3', { text: t('creasesTitle', { n: cr.length }) }));
        cr.forEach(function (c, i) { ul.appendChild(listButton(t('creaseN', { n: i + 1 }), num(c.a, 1) + '° · ' + t(c.t === 'V' ? 'valleyWord' : 'mountainWord'), vSel === i, function () { vSel = i; vCursor = c.a; renderAll(); ctx.announce(t('creaseSel', { n: i + 1, a: num(c.a, 1), type: t(c.t === 'V' ? 'valleyWord' : 'mountainWord') })); }, c.t === 'V' ? '#1f5f8b' : '#a1283c')); });
      } else {
        var isCrane = m === 'crane', total = isCrane ? craneSteps.length : SON_TOTAL, cur = isCrane ? S.crane.step : S.sonobe.step;
        st.push(h('h3', { text: t(isCrane ? 'craneSteps' : 'sonobeSteps') }));
        for (var i = 0; i < total; i++) (function (i) {
          var label = isCrane ? t('stepN', { n: i + 1 }).replace(/\.$/, '') : (i < SON_UNIT ? t('sonUnitStep', { n: i + 1 }) : t('sonPiece', { n: i - SON_UNIT + 1 }));
          ul.appendChild(listButton(label, null, cur === i, function () { goStep(0, i); }));
        })(i);
      }
      st.push(ul);
      var fs = focusKey(ctx.structure), fi = focusKey(ctx.inspector);
      ctx.setStructure(st);
      ctx.setInspector(inspector());
      restoreFocus(ctx.structure, fs); restoreFocus(ctx.inspector, fi);
      ctx.setSummary(summary());
    }
    function solidFields() {
      var out = [], p = S.poly;
      out.push(F.select(t('solidLabel'), p.kind, GEO.KINDS.map(function (k) { return [k, t('fam_' + GEO.FAMILY[k]) + ' · ' + t('kind_' + k)]; }), { onChange: function (v) { changePoly({ kind: v }); } }));
      if (GEO.HAS_N[p.kind]) {
        out.push(F.number(t('nLabel'), p.n, { min: 3, max: 12, step: 1, onChange: function (v) { changePoly({ n: Math.round(v) }); } }));
        out.push(F.number(t('hrLabel'), p.hr, { min: 0.3, max: 3, step: 0.1, unit: '×', onChange: function (v) { changePoly({ hr: Math.round(v * 100) / 100 }); } }));
        out.push(h('p', { class: 'igs-muted', text: t(p.kind === 'antiprism' ? 'hrHelpAnti' : 'hrHelp') }));
      }
      return out;
    }
    function polyFacts() {
      var p = PD().p, V = p.V.length, E = p.E.length, Fn = p.F.length, out = [];
      out.push(h('h4', { text: t('factsTitle') }));
      out.push(h('p', { class: 'igs-result', 'data-kind': V - E + Fn === 2 ? 'ok' : 'bad' }, h('strong', { text: t('eulerLine', { v: V, e: E, f: Fn, r: V - E + Fn }) }), ' ', t('eulerText')));
      var ft = faceTypes(p), rows = ft.types.map(function (ty, i) {
        var idx = ft.idx.indexOf(i), cnt = ft.idx.filter(function (x) { return x === i; }).length;
        var ang = p.faceAngles[idx].map(function (a) { return num(deg(a), 1) + '°'; }).filter(function (v, j, arr) { return arr.indexOf(v) === j; }).join(', ');
        return [shapeName(p.F[idx].length), cnt, ang];
      });
      out.push(table(t('faceTable'), [t('colFace'), t('colCount'), t('colAngles')], rows));
      var dih = {};
      p.E.forEach(function (e, i) { var k = num(deg(p.dihedral[i]), 1) + '°', key = [shapeName(p.F[e.f[0]].length), shapeName(p.F[e.f[1]].length)].sort().join(' – '); dih[k + '|' + key] = (dih[k + '|' + key] || 0) + 1; });
      out.push(table(t('dihTable'), [t('colBetween'), t('colDihedral'), t('colEdges')], Object.keys(dih).map(function (k) { var sp = k.split('|'); return [sp[1], sp[0], dih[k]]; })));
      var lens = p.edgeLen.map(function (l) { return num(l * S.poly.edgeMm, 1); }).filter(function (v, j, arr) { return arr.indexOf(v) === j; });
      out.push(h('p', { class: 'igs-muted', text: t('edgesMm', { list: lens.join(' mm, ') }) }));
      var defect = p.defect.reduce(function (a, b) { return a + b; }, 0);
      out.push(h('p', { class: 'igs-muted', text: t('defectText', { d: num(deg(defect), 1) }) }));
      return out;
    }
    function table(caption, heads, rows) {
      var tb = h('table', { class: 'igs-table' }, h('caption', { text: caption }));
      var tr = h('tr'); heads.forEach(function (x) { tr.appendChild(h('th', { scope: 'col', text: x })); }); tb.appendChild(h('thead', null, tr));
      var body = h('tbody'); rows.forEach(function (r) { var row = h('tr'); r.forEach(function (c, i) { row.appendChild(h('td', { text: String(c), class: i > 0 && typeof c === 'number' ? 'igs-numcell' : null })); }); body.appendChild(row); });
      tb.appendChild(body); return h('div', { class: 'igs-table-wrap' }, tb);
    }
    function faceInspector(i) {
      var p = PD().p, out = [], f = p.F[i];
      out.push(h('h4', { text: t('faceN', { n: i + 1 }) + ' · ' + shapeName(f.length) }));
      out.push(F.color(t('faceColour'), S.poly.colors[i], { onChange: function (v) { S.poly.colors[i] = v; commit(t('colourSet')); } }));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('sameColourType'), { icon: 'bucket', onClick: function () { var ft = faceTypes(p); ft.idx.forEach(function (x, j) { if (x === ft.idx[i]) S.poly.colors[j] = S.poly.colors[i]; }); commit(t('colourAll')); } })));
      out.push(h('p', { class: 'igs-muted', text: t('faceAngles', { list: p.faceAngles[i].map(function (a) { return num(deg(a), 1) + '°'; }).join(', '), sum: num(deg(p.faceAngles[i].reduce(function (a, b) { return a + b; }, 0)), 0) }) }));
      var nb = []; p.E.forEach(function (e, k) { if (e.f[0] === i || e.f[1] === i) nb.push(t('faceN', { n: (e.f[0] === i ? e.f[1] : e.f[0]) + 1 }) + ' (' + num(deg(p.dihedral[k]), 1) + '°)'); });
      out.push(h('p', { class: 'igs-muted', text: t('faceNeighbours', { list: nb.join(', ') }) }));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deselect'), { icon: 'select', onClick: function () { selectFace(null); } })));
      return out;
    }
    function inspector() {
      var out = [], m = S.mode;
      if (m === 'poly') {
        if (sel && sel.kind === 'face') return faceInspector(sel.i).concat(polyFacts());
        out.push(h('h4', { text: polyName() }));
        out = out.concat(solidFields());
        out.push(h('p', { class: 'igs-muted', text: t('foldHelp', { n: S.poly.fold }) }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('recolour'), { icon: 'bucket', onClick: function () { S.poly.colors = colorsByType(PD().p); commit(t('recoloured')); } })));
        return out.concat(polyFacts());
      }
      if (m === 'net') {
        if (sel && sel.kind === 'face') return faceInspector(sel.i);
        out.push(h('h4', { text: t('netSettings') }));
        out = out.concat(solidFields());
        out.push(F.number(t('edgeLabel'), S.poly.edgeMm, { unit: 'mm', min: 10, max: 200, step: 1, onChange: function (v) { S.poly.edgeMm = Math.round(v); commit(t('edgeSet', { mm: S.poly.edgeMm })); } }));
        out.push(F.check(t('tabsLabel'), S.poly.tabs, { onChange: function (v) { S.poly.tabs = !!v; commit(t(v ? 'tabsOn' : 'tabsOff')); } }));
        if (S.poly.tabs) out.push(F.number(t('tabLabel'), S.poly.tabMm, { unit: 'mm', min: 3, max: 15, step: 1, onChange: function (v) { S.poly.tabMm = Math.round(v); commit(t('tabSet')); } }));
        out.push(F.check(t('numbersLabel'), S.poly.numbers, { onChange: function (v) { S.poly.numbers = !!v; commit(t('changedWord')); } }));
        out.push(F.check(t('fillLabel'), S.poly.fill, { onChange: function (v) { S.poly.fill = !!v; commit(t('changedWord')); } }));
        out.push(F.choice(t('sideLabel'), S.poly.side, [['out', t('sideOut')], ['in', t('sideIn')]], { onChange: function (v) { S.poly.side = v; commit(t('changedWord')); } }));
        out.push(h('p', { class: 'igs-muted', text: t(S.poly.side === 'out' ? 'sideOutHelp' : 'sideInHelp') }));
        var nn = PD().nets.length;
        out.push(h('p', { class: 'igs-muted', text: t('netOf', { k: (S.poly.netIdx % nn) + 1, n: nn }) }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('otherNet'), { icon: 'layers', onClick: otherNet })));
        var plan = printPlan(), sz = netSizeMm();
        out.push(h('h4', { text: t('printTitle') }));
        out.push(h('p', { class: 'igs-result', 'data-kind': plan.pages === 1 ? 'ok' : 'bad' }, h('strong', { text: plan.pages === 1 ? t('fitsOne') : t('needsPages', { n: plan.pages }) }), ' ',
          t('netSize', { w: num(sz.w, 0), h: num(sz.h, 0) }) + (plan.pages === 1 ? '' : ' ' + t('reduceTo', { mm: maxEdgeOnePage() }))));
        if (plan.pages > 1) out.push(h('div', { class: 'igs-actions' }, ctx.button(t('fitOnePage'), { icon: 'fit', onClick: function () { S.poly.edgeMm = Math.max(10, maxEdgeOnePage()); commit(t('edgeSet', { mm: S.poly.edgeMm })); } })));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('printNet'), { icon: 'file', class: 'igs-primary', onClick: printNet }), ctx.button(t('downloadNet'), { icon: 'download', onClick: exportNet })));
        out.push(h('p', { class: 'igs-muted', text: t('printHelp') }));
        return out;
      }
      if (m === 'fold') {
        var gs = guideState();
        if (sel && sel.kind === 'step' && S.paper.steps[sel.i]) {
          var sp = S.paper.steps[sel.i], idx = sel.i;
          out.push(h('h4', { text: t('stepN', { n: idx + 1 }) }));
          out.push(h('p', { class: 'igs-muted', text: stepText(sp, idx, gs) }));
          out.push(F.text(t('stepNote'), sp.note || '', { max: 160, multiline: true, onChange: function (v) { var s2 = String(v).trim().slice(0, 160); if (s2) S.paper.steps[idx].note = s2; else delete S.paper.steps[idx].note; commit(t('noteSet')); } }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deleteFrom'), { icon: 'trash', class: 'igs-danger', onClick: function () { S.paper.steps = S.paper.steps.slice(0, idx); sel = null; pick = []; commit(t('deletedFrom', { n: idx + 1 })); } }), ctx.button(t('deselect'), { icon: 'select', onClick: function () { sel = null; renderAll(); } })));
          return out;
        }
        if (gs) {
          out.push(h('h4', { text: t('guideTitle', { name: t('guideName_' + gs.id) }) }));
          if (gs.done) out.push(h('p', { class: 'igs-result', 'data-kind': 'ok' }, h('strong', { text: t('guideDone') }), ' ', t('guideEnd_' + gs.id)));
          else if (!gs.onTrack) out.push(h('p', { class: 'igs-result', 'data-kind': 'bad' }, h('strong', { text: t('guideOffTitle') }), ' ', t('guideOff')));
          else {
            out.push(h('p', { class: 'igs-note' }, h('strong', { text: t('stepOf', { k: gs.k + 1, n: gs.n }) + ' ' }), t('guide_' + gs.id + '_' + (gs.k + 1))));
            out.push(h('div', { class: 'igs-actions' }, ctx.button(t('doGuideStep'), { icon: 'play', class: 'igs-primary', onClick: doGuideStep })));
            out.push(h('p', { class: 'igs-muted', text: t('guideHint') }));
          }
        }
        out.push(h('h4', { text: t('paperTitle') }));
        out.push(F.select(t('guideLabel'), S.paper.guide || '', [['', t('guideNone')]].concat(GUIDES.map(function (g) { return [g, t('guideName_' + g)]; })), { onChange: function (v) { loadGuide(v || null); commit(v ? t('guideLoaded', { name: t('guideName_' + v) }) : t('guideCleared')); } }));
        out.push(F.choice(t('paperShape'), S.paper.shape, [['square', t('paperSquare')], ['a4', t('paperA4')]], { onChange: function (v) { S.paper.shape = v; if (v === 'a4') S.paper.orient = 'square'; S.paper.steps = []; S.paper.guide = null; pick = []; commit(t('paperChanged')); } }));
        if (S.paper.shape === 'square') out.push(F.choice(t('paperOrient'), S.paper.orient, [['square', t('orientSquare')], ['diamond', t('orientDiamond')]], { onChange: function (v) { S.paper.orient = v; S.paper.steps = []; S.paper.guide = null; pick = []; commit(t('paperChanged')); } }));
        if (S.paper.steps.length) out.push(h('p', { class: 'igs-muted', text: t('paperChangeWarn') }));
        out.push(F.color(t('frontColour'), S.paper.front, { onChange: function (v) { S.paper.front = v; commit(t('colourSet')); } }));
        out.push(F.color(t('backColour'), S.paper.back, { onChange: function (v) { S.paper.back = v; commit(t('colourSet')); } }));
        out.push(F.choice(t('pickMode'), S.paper.pick, [['line', t('pickLine')], ['p2p', t('pickP2P')]], { onChange: function (v) { S.paper.pick = v; pick = []; renderAll(); ctx.announce(t(v === 'line' ? 'pickLineHelp' : 'pickP2PHelp')); } }));
        out.push(h('p', { class: 'igs-muted', text: t(S.paper.pick === 'line' ? 'pickLineHelp' : 'pickP2PHelp') }));
        out.push(h('h4', { text: t('patternTitle') }));
        out.push(creasePatternNode());
        out.push(h('p', { class: 'igs-muted', text: t('patternHelp') }));
        var pc = paperStates(); if (pc.errors.length) out.push(h('p', { class: 'igs-result', 'data-kind': 'bad', text: t('replayErrors', { n: pc.errors.length }) }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('printSheet'), { icon: 'file', onClick: printPaperSheet }), ctx.button(t('downloadSheet'), { icon: 'download', onClick: exportPaperSheet })));
        return out;
      }
      if (m === 'vertex') {
        var cr = sortedCreases(), res = GEO.checkVertex(cr);
        if (vSel >= 0 && cr[vSel]) {
          var c = cr[vSel];
          out.push(h('h4', { text: t('creaseN', { n: vSel + 1 }) }));
          out.push(F.number(t('angleLabel'), c.a, { unit: '°', min: 0, max: 359.9, step: 0.5, onChange: function (v) { var a = ((Math.round(v * 10) / 10) % 360 + 360) % 360; if (cr.some(function (o, j) { return j !== vSel && Math.abs(o.a - a) < 0.5; })) { ctx.announce(t('angleTaken')); renderSide(); return; } c.a = a; S.vertex.creases = cr.sort(function (x, y) { return x.a - y.a; }); vSel = S.vertex.creases.indexOf(c); vCursor = a; commit(t('creaseMoved', { a: num(a, 1) })); } }));
          out.push(F.choice(t('typeLabel'), c.t, [['V', t('valleyWord')], ['M', t('mountainWord')]], { onChange: function (v) { c.t = v; S.vertex.creases = cr; commit(t('typeSet', { type: t(v === 'V' ? 'valleyWord' : 'mountainWord') })); } }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deleteCrease'), { icon: 'trash', class: 'igs-danger', onClick: vDelete }), ctx.button(t('deselect'), { icon: 'select', onClick: function () { vSel = -1; renderAll(); } })));
        } else {
          out.push(h('h4', { text: t('vertexTitle') }));
          out.push(h('p', { class: 'igs-muted', text: t('vertexHelp') }));
          out.push(F.select(t('presetLabel'), '', [['', t('presetChoose')], ['cross', t('preset_cross')], ['kite', t('preset_kite')], ['six', t('preset_six')], ['bad', t('preset_bad')]], { onChange: function (v) { if (!v) return; vPreset(v); commit(t('presetLoaded', { name: t('preset_' + v) })); } }));
          out.push(F.number(t('cursorLabel'), vCursor, { unit: '°', min: 0, max: 359.9, step: 1, onChange: function (v) { vCursor = ((v % 360) + 360) % 360; renderAll(); } }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('addCrease'), { icon: 'plus', class: 'igs-primary', onClick: function () { vAdd(vCursor); } }), ctx.button(t('clearCreases'), { icon: 'trash', class: 'igs-danger', onClick: function () { S.vertex.creases = []; vSel = -1; commit(t('creasesCleared')); } })));
        }
        out.push(h('h4', { text: t('checkTitle') }));
        if (cr.length < 2) { out.push(h('p', { class: 'igs-muted', text: t('checkNeedTwo') })); return out; }
        out.push(h('p', { class: 'igs-result', 'data-kind': res.flat ? 'ok' : 'bad' }, h('strong', { text: t(res.flat ? 'flatYes' : 'flatNo') }), ' ', t(res.flat ? 'flatYesText' : 'flatNoText')));
        var ul = h('ul', { class: 'iga-review igp-checks' });
        function item(ok, text) { ul.appendChild(h('li', { 'data-ok': String(ok) }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: ok ? '✓' : '!' }), h('span', { class: 'igs-sr', text: (ok ? t('okWord') : t('failWord')) + ': ' }), text)); }
        item(res.even, t('chkEven', { n: res.n }));
        item(res.maekawa, t('chkMaekawa', { m: res.M, v: res.V, d: Math.abs(res.M - res.V) }));
        item(res.kawasaki, t('chkKawasaki', { a: num(res.sumEven, 1), b: num(res.sumOdd, 1) }));
        item(res.blb, t(res.blb ? 'chkBlbOk' : 'chkBlbBad', { list: res.blbBad.map(function (i) { return num(res.sectors[i], 1) + '°'; }).join(', ') }));
        out.push(ul);
        out.push(table(t('sectorTable'), [t('colSector'), t('colBetween'), t('colAngle')], res.sectors.map(function (s, i) { return [i + 1, t('creaseN', { n: i + 1 }) + ' – ' + t('creaseN', { n: (i + 1) % cr.length + 1 }), num(s, 1) + '°']; })));
        out.push(h('p', { class: 'igs-muted', text: t('theoremsNote') }));
        return out;
      }
      if (m === 'crane') {
        out.push(h('h4', { text: t('stepOf', { k: S.crane.step + 1, n: craneSteps.length }) }));
        out.push(h('p', { class: 'igs-note', text: t(craneSteps[S.crane.step].key) }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('prevStep'), { icon: 'undo', onClick: function () { goStep(-1); }, disabled: S.crane.step === 0 }), ctx.button(t('nextStep'), { icon: 'redo', class: 'igs-primary', onClick: function () { goStep(1); }, disabled: S.crane.step === craneSteps.length - 1 })));
        out.push(F.color(t('paperColour'), S.crane.color, { onChange: function (v) { S.crane.color = v; commit(t('colourSet')); } }));
        out.push(h('p', { class: 'igs-muted', text: t('craneHelp') }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('printCrane'), { icon: 'file', onClick: printCrane }), ctx.button(t('downloadCrane'), { icon: 'download', onClick: exportCrane })));
        return out;
      }
      if (m === 'sonobe') {
        var k = S.sonobe.step;
        out.push(h('h4', { text: t('stepOf', { k: k + 1, n: SON_TOTAL }) }));
        out.push(h('p', { class: 'igs-note', text: diagramText() }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('prevStep'), { icon: 'undo', onClick: function () { goStep(-1); }, disabled: k === 0 }), ctx.button(t('nextStep'), { icon: 'redo', class: 'igs-primary', onClick: function () { goStep(1); }, disabled: k === SON_TOTAL - 1 })));
        [0, 1, 2].forEach(function (i) { out.push(F.color(t('sonColour', { n: i + 1 }), S.sonobe.colors[i], { onChange: function (v) { S.sonobe.colors[i] = v; commit(t('colourSet')); } })); });
        out.push(h('p', { class: 'igs-muted', text: t('sonobeHelp') }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('printSonobe'), { icon: 'file', onClick: printSonobe }), ctx.button(t('downloadSonobe'), { icon: 'download', onClick: exportSonobe })));
        return out;
      }
      return out;
    }
    function creasePatternNode() {
      var st0 = paperStates().states[0], b = GEO.paperBBox(st0), cr = curPaper().creases;
      /* el patrón se dibuja sobre el papel original (sin girar) */
      var W = S.paper.shape === 'a4' ? 1 : 1, H = S.paper.shape === 'a4' ? Math.SQRT2 : 1, pad = 0.04;
      var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-pad) + ' ' + (-pad) + ' ' + (W + 2 * pad) + ' ' + (H + 2 * pad) + '" class="igp-cp" role="img" aria-label="' + esc(t('patternAlt', { v: cr.filter(function (c) { return c.t === 'V'; }).length, m: cr.filter(function (c) { return c.t === 'M'; }).length })) + '">';
      s += '<rect width="' + W + '" height="' + H + '" fill="' + S.paper.front + '" fill-opacity=".18" stroke="#172b42" stroke-width="0.008"/>';
      cr.forEach(function (c) { s += '<line x1="' + c.p[0].toFixed(4) + '" y1="' + c.p[1].toFixed(4) + '" x2="' + c.q[0].toFixed(4) + '" y2="' + c.q[1].toFixed(4) + '" stroke="' + (c.t === 'V' ? '#1f5f8b' : '#a1283c') + '" stroke-width="0.012" stroke-dasharray="' + (c.t === 'V' ? '0.03 0.018' : '0.034 0.011 0.005 0.011 0.005 0.011') + '"/>'; });
      void b;
      return parseSVG(s + '</svg>');
    }
    function summary() {
      var m = S.mode;
      if (m === 'poly') { var p = PD().p; return t('sumPoly', { name: polyName(), f: p.F.length, e: p.E.length, v: p.V.length, fold: S.poly.fold }) + (sel && sel.kind === 'face' ? ' ' + t('selected', { name: t('faceN', { n: sel.i + 1 }) }) : ''); }
      if (m === 'net') { var plan = printPlan(), sz = netSizeMm(); return t('sumNet', { name: polyName(), mm: S.poly.edgeMm, w: num(sz.w, 0), h: num(sz.h, 0), pages: plan.pages, tabs: S.poly.tabs ? netDraw().tabs.length : 0 }); }
      if (m === 'fold') {
        var st = curPaper(), gs = guideState();
        return t('sumFold', { steps: S.paper.steps.length, layers: st.parts.length, creases: st.creases.length }) + (gs ? ' ' + (gs.done ? t('guideDone') : gs.onTrack ? t('stepOf', { k: gs.k + 1, n: gs.n }) + ' ' + t('guide_' + gs.id + '_' + (gs.k + 1)) : t('guideOff')) : '') + (pick.length ? ' ' + t('pickedN', { n: pick.length }) : '');
      }
      if (m === 'vertex') { var cr = sortedCreases(), r = GEO.checkVertex(cr); return t('sumVertex', { n: cr.length, list: cr.map(function (c) { return num(c.a, 1) + '° ' + t(c.t === 'V' ? 'valleyWord' : 'mountainWord'); }).join(', ') || '—' }) + ' ' + (cr.length >= 2 ? t(r.flat ? 'flatYes' : 'flatNo') : ''); }
      return t('stepOf', { k: (m === 'crane' ? S.crane.step : S.sonobe.step) + 1, n: m === 'crane' ? craneSteps.length : SON_TOTAL }) + ' ' + diagramText();
    }

    /* ================= Herramientas por vista ================= */
    var foldRange = null;
    function renderTools() {
      var m = S.mode, tools = [];
      if (m === 'poly') {
        var red = ctx.reducedMotion(), id = 'igp-fold-range', out = h('output', { for: id, class: 'igs-out', text: S.poly.fold + ' %' });
        foldRange = h('input', { id: id, type: 'range', min: 0, max: 100, step: red ? 10 : 1, 'aria-valuetext': t('foldValue', { n: S.poly.fold }) }); foldRange.value = String(S.poly.fold);
        foldRange.addEventListener('input', function () { out.textContent = foldRange.value + ' %'; if (!red) setFold(+foldRange.value, true); });
        foldRange.addEventListener('change', function () { setFold(+foldRange.value); });
        tools.push({ node: h('div', { class: 'igp-foldctl' }, h('label', { for: id, text: t('foldLabel') }), foldRange, out) });
        tools.push({ id: 'unfold', label: t('unfoldBtn'), icon: 'layers', action: function () { setFold(0); } });
        tools.push({ id: 'fold', label: t('foldBtn'), icon: 'box', action: function () { setFold(100); } });
        solidTool(tools);
        tools.push({ separator: true });
        tools.push({ id: 'toNet', label: t('toNet'), icon: 'grid', action: function () { setMode('net', true); } });
        tools.push({ id: 'otherNet', label: t('otherNet'), icon: 'rotate', level: 'more', action: otherNet });
        tools.push({ id: 'view0', label: t('viewReset'), icon: 'fit', level: 'more', action: function () { frame3d([0.55, 0.62, 0.75]); ctx.announce(t('viewReset')); } });
        tools.push({ id: 'viewTop', label: t('viewTop'), icon: 'grid', level: 'more', action: function () { frame3d([0.001, 1, 0.001]); ctx.announce(t('viewTop')); } });
      } else if (m === 'net') {
        solidTool(tools);
        tools.push({ id: 'print', label: t('printNet'), icon: 'file', primary: true, action: printNet });
        tools.push({ id: 'svg', label: t('downloadNetShort'), icon: 'download', action: exportNet });
        tools.push({ id: 'otherNet', label: t('otherNet'), icon: 'rotate', action: otherNet });
        tools.push({ separator: true });
        tools.push({ id: 'to3d', label: t('to3d'), icon: 'box', level: 'more', action: function () { setMode('poly', true); } });
        tools.push({ id: 'fit', label: t('fitView'), icon: 'fit', level: 'more', action: function () { renderNet(true); } });
      } else if (m === 'fold') {
        var pf = pendingFold(), gs = guideState();
        tools.push({ id: 'valley', label: t('valleyWord'), icon: 'minus', action: function () { setType('V'); } });
        tools.push({ id: 'mountain', label: t('mountainWord'), icon: 'minus', action: function () { setType('M'); } });
        tools.push({ id: 'doFold', label: t('doFold'), icon: 'check', primary: true, action: doFold });
        tools.push({ id: 'swap', label: t('swapSide'), icon: 'rotate', action: function () { if (!pick.length || pick.length < 2) { ctx.announce(t('needTwo')); return; } flipSide = !flipSide; drawOverlay(); ctx.announce(t('sideSwapped')); } });
        tools.push({ id: 'top', label: t('topOnly'), icon: 'layers', action: function () { topOnly = !topOnly; renderTools(); drawOverlay(); ctx.announce(t(topOnly ? 'topOnlyOn' : 'topOnlyOff')); } });
        tools.push({ separator: true });
        tools.push({ id: 'flip', label: t('flipBtn'), icon: 'redo', action: doFlip });
        if (gs && gs.onTrack && !gs.done) tools.push({ id: 'guide', label: t('doGuideStep'), icon: 'play', action: doGuideStep });
        tools.push({ id: 'rot', label: t('rotateBtn'), icon: 'rotate', level: 'more', action: doRotate });
        tools.push({ id: 'cancel', label: t('cancelPick'), icon: 'erase', level: 'more', action: function () { pick = []; drawOverlay(); renderTools(); ctx.announce(t('cancelled')); } });
        tools.push({ id: 'sheet', label: t('printSheet'), icon: 'file', level: 'more', action: printPaperSheet });
        tools.push({ id: 'fitP', label: t('fitView'), icon: 'fit', level: 'more', action: fitPaper });
        void pf;
      } else if (m === 'vertex') {
        tools.push({ id: 'add', label: t('addCrease'), icon: 'plus', primary: true, action: function () { vAdd(vCursor); } });
        tools.push({ id: 'valley', label: t('valleyWord'), icon: 'minus', action: function () { setType('V'); } });
        tools.push({ id: 'mountain', label: t('mountainWord'), icon: 'minus', action: function () { setType('M'); } });
        tools.push({ id: 'del', label: t('deleteCrease'), icon: 'trash', action: vDelete });
        tools.push({ id: 'left', label: t('turnLeft'), icon: 'undo', level: 'more', action: function () { vTurn(15); } });
        tools.push({ id: 'right', label: t('turnRight'), icon: 'redo', level: 'more', action: function () { vTurn(-15); } });
      } else {
        var isCrane = m === 'crane', total = isCrane ? craneSteps.length : SON_TOTAL, cur = isCrane ? S.crane.step : S.sonobe.step;
        tools.push({ id: 'prev', label: t('prevStep'), icon: 'undo', action: function () { goStep(-1); } });
        tools.push({ node: h('span', { class: 'igp-stepcount', 'aria-hidden': 'true', text: (cur + 1) + ' / ' + total }) });
        tools.push({ id: 'next', label: t('nextStep'), icon: 'redo', primary: true, action: function () { goStep(1); } });
        tools.push({ separator: true });
        tools.push({ id: 'print', label: t(isCrane ? 'printCrane' : 'printSonobe'), icon: 'file', action: isCrane ? printCrane : printSonobe });
        tools.push({ id: 'first', label: t('firstStepBtn'), icon: 'undo', level: 'more', action: function () { goStep(0, 0); } });
      }
      var ft = focusKey(ctx.toolbar);
      ctx.setTools(tools);
      /* estado de los conmutadores (no son herramientas exclusivas del núcleo) */
      Array.prototype.forEach.call(ctx.toolbar.querySelectorAll('button'), function (b) {
        var lab = b.textContent;
        if (lab === t('valleyWord')) b.setAttribute('aria-pressed', String(foldType === 'V'));
        if (lab === t('mountainWord')) b.setAttribute('aria-pressed', String(foldType === 'M'));
        if (lab === t('topOnly')) b.setAttribute('aria-pressed', String(topOnly));
        if (lab === t('doFold') && m === 'fold') b.disabled = !pendingFold();
        if (lab === t('prevStep')) b.disabled = (m === 'crane' ? S.crane.step : S.sonobe.step) === 0;
        if (lab === t('nextStep')) b.disabled = (m === 'crane' ? S.crane.step === craneSteps.length - 1 : S.sonobe.step === SON_TOTAL - 1);
        if (lab === t('swapSide') && m === 'fold') b.disabled = pick.length < 2;
      });
      /* El foco itinerante del núcleo se fija antes de desactivar botones: si el que quedó
         con tabindex 0 se ha desactivado, la barra se quedaría sin nada que recibir el foco. */
      var live = Array.prototype.filter.call(ctx.toolbar.querySelectorAll('button,select,input'), function (b) { return !b.disabled; });
      if (live.length && !live.some(function (b) { return b.tabIndex === 0; })) live[0].tabIndex = 0;
      restoreFocus(ctx.toolbar, ft);
    }
    function solidTool(tools) {
      var ksel = h('select', { class: 'igs-shape-select', 'aria-label': t('solidLabel') });
      GEO.KINDS.forEach(function (k) { var o = h('option', { value: k, text: t('kind_' + k) }); if (k === S.poly.kind) o.selected = true; ksel.appendChild(o); });
      ksel.addEventListener('change', function () { changePoly({ kind: ksel.value }); });
      tools.push({ node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('solidShort') }), ksel) });
    }
    function setType(tp) { foldType = tp; renderTools(); drawOverlay(); ctx.announce(t('typeNow', { type: t(tp === 'V' ? 'valleyWord' : 'mountainWord') })); if (S.mode === 'vertex' && vSel >= 0) { var cr = sortedCreases(); cr[vSel].t = tp; S.vertex.creases = cr; commit(t('typeSet', { type: t(tp === 'V' ? 'valleyWord' : 'mountainWord') })); } }
    function vDelete() { var cr = sortedCreases(); if (vSel < 0 || !cr[vSel]) { ctx.announce(t('noCreaseSel')); return; } var a = cr[vSel].a; cr.splice(vSel, 1); S.vertex.creases = cr; vSel = -1; commit(t('creaseDeleted', { a: num(a, 1) })); }
    function vTurn(d) { vCursor = ((vCursor + d) % 360 + 360) % 360; renderAll(); ctx.announce(t('cursorAngle', { a: num(vCursor, 1) })); }
    function setFold(v, live) {
      S.poly.fold = Math.max(0, Math.min(100, Math.round(v)));
      if (foldRange && +foldRange.value !== S.poly.fold) { foldRange.value = String(S.poly.fold); foldRange.nextSibling.textContent = S.poly.fold + ' %'; }
      if (foldRange) foldRange.setAttribute('aria-valuetext', t('foldValue', { n: S.poly.fold }));
      applyFold();
      if (!live) { autoFrame(); renderSide(); setStatus(t('hudPoly', { name: polyName(), n: S.poly.fold })); ctx.announce(t('foldValue', { n: S.poly.fold })); }
    }
    function otherNet() { S.poly.netIdx = (S.poly.netIdx + 1) % PD().nets.length; commit(t('netChanged', { k: S.poly.netIdx + 1, n: PD().nets.length })); if (S.mode === 'poly') { build3d(); } }
    function changePoly(ch) {
      Object.keys(ch).forEach(function (k) { S.poly[k] = ch[k]; });
      if (GEO.HAS_N[S.poly.kind]) { S.poly.n = Math.max(3, Math.min(12, Math.round(S.poly.n || 5))); S.poly.hr = Math.max(0.3, Math.min(3, +S.poly.hr || 1)); }
      S.poly.netIdx = 0; sel = null; S.poly.colors = defaultColors(PD().p);
      build3d(); commit(t('solidSet', { name: polyName() }));
    }
    function selectFace(i) {
      sel = i === null || i === undefined ? null : { kind: 'face', i: i };
      highlight3d(); if (S.mode === 'net') renderNet(false); renderSide();
      ctx.announce(sel ? t('faceSelected', { n: i + 1, shape: shapeName(PD().p.F[i].length) }) : t('deselected'));
    }

    /* ================= Vistas ================= */
    function setMode(m, user) {
      if (MODES.indexOf(m) < 0) m = 'poly';
      var prev = S.mode; S.mode = m; if (prev !== m) { sel = null; pick = []; cursor = -1; }
      MODES.forEach(function (x) { tabBtns[x].setAttribute('aria-selected', String(x === m)); tabBtns[x].tabIndex = x === m ? 0 : -1; });
      vp.setAttribute('aria-labelledby', 'igp-tab-' + m);
      vp.dataset.mode = m;
      renderAll(true);
      if (user) ctx.announce(t('modeNow', { name: modeName(m) }) + ' ' + t('modeHelp_' + m));
    }
    function renderAll(fit) {
      var m = S.mode, three = m === 'poly' || (m === 'sonobe' && S.sonobe.step >= SON_UNIT);
      vp.dataset.view = three ? '3d' : (m === 'crane' || m === 'sonobe') ? 'diagram' : '2d';
      if (renderer) { polyG.visible = m === 'poly'; sonG.visible = m === 'sonobe'; }
      if (m === 'poly') { setStatus(t('hudPoly', { name: polyName(), n: S.poly.fold })); if (fit && renderer) setTimeout(function () { loop.resize(); frame3d(); }, 20); else if (renderer) loop.request(); }
      else if (m === 'net') { renderNet(fit); setStatus(t('hudNet', { mm: S.poly.edgeMm, n: printPlan().pages })); }
      else if (m === 'fold') { renderFold(fit); var gs = guideState(); setStatus(pick.length === 2 ? t('readyToFold') : pick.length === 1 ? t(S.paper.pick === 'p2p' ? 'pickTarget' : 'pickSecond') : (gs && gs.onTrack && !gs.done ? t('hudGuide', { k: gs.k + 1, n: gs.n }) : t('pickFirst'))); }
      else if (m === 'vertex') { vRender(); setStatus(t('cursorAngle', { a: num(vCursor, 1) })); }
      else { renderDiagram(); setStatus(''); if (m === 'sonobe' && renderer) { buildSonobe(false); if (fit) setTimeout(function () { loop.resize(); frame3d(); }, 20); } }
      if (m !== 'net' && m !== 'fold' && m !== 'vertex') world.innerHTML = '';
      drawOverlay(); renderTools(); renderSide();
    }
    function commit(label) {
      if (S.mode === 'poly' || S.mode === 'net') { ensureColors(); highlight3d(); }
      renderAll(false);
      if (S.mode === 'poly') applyFold();
      ctx.commit(label); if (label) ctx.announce(label);
    }

    /* ================= Puntero en 2D ================= */
    function worldFromEvent(e) { var r = svg.getBoundingClientRect(); return view.toWorld(e.clientX - r.left, e.clientY - r.top); }
    var down2 = null;
    svg.addEventListener('pointerdown', function (e) { if (e.button !== 0) return; down2 = [e.clientX, e.clientY, e.target]; });
    svg.addEventListener('pointerup', function (e) {
      if (!down2 || Math.hypot(e.clientX - down2[0], e.clientY - down2[1]) > 6) { down2 = null; return; }
      var target = down2[2]; down2 = null;
      var w = worldFromEvent(e);
      if (S.mode === 'net') { var fnode = target.closest && target.closest('[data-face]'); selectFace(fnode ? +fnode.getAttribute('data-face') : null); return; }
      if (S.mode === 'fold') {
        var ms = marks(), best = -1, bd = Infinity;
        ms.forEach(function (m, i) { var q = view.toScreen(m.p[0] * PSCALE, m.p[1] * PSCALE), r = svg.getBoundingClientRect(), d = Math.hypot(q.x - (e.clientX - r.left), q.y - (e.clientY - r.top)); if (d < bd) { bd = d; best = i; } });
        if (best >= 0 && bd <= 22) { cursor = best; pickPoint(ms[best].p); }
        else ctx.announce(t('tapAMark'));
        return;
      }
      if (S.mode === 'vertex') {
        var cn = target.closest && target.closest('[data-crease]');
        if (cn) { vSel = +cn.getAttribute('data-crease'); vCursor = sortedCreases()[vSel].a; renderAll(); var c = sortedCreases()[vSel]; ctx.announce(t('creaseSel', { n: vSel + 1, a: num(c.a, 1), type: t(c.t === 'V' ? 'valleyWord' : 'mountainWord') })); return; }
        var a = Math.atan2(-w.y, w.x) * 180 / Math.PI; if (Math.hypot(w.x, w.y) < 8) return;
        vCursor = ((Math.round(a) % 360) + 360) % 360; vAdd(vCursor);
      }
    });

    /* ================= Teclado ================= */
    function onKey(e) {
      if (!vp.contains(e.target)) return false;
      var k = e.key, m = S.mode;
      if (!e.ctrlKey && !e.metaKey && !e.altKey && /^[1-6]$/.test(k)) { setMode(MODES[+k - 1], true); return true; }
      if (m === 'poly') {
        if (k === 'ArrowLeft' || k === 'ArrowRight') { orbit(k === 'ArrowLeft' ? 15 : -15, 0); return true; }
        if (k === 'ArrowUp' || k === 'ArrowDown') { orbit(0, k === 'ArrowUp' ? 10 : -10); return true; }
        if (k === '+' || k === '=') { orbit(0, 0, 0.8); return true; }
        if (k === '-') { orbit(0, 0, 1.25); return true; }
        if (k === '0') { frame3d([0.55, 0.62, 0.75]); ctx.announce(t('viewReset')); return true; }
        if (k === '[' || k === ']') { setFold(S.poly.fold + (k === ']' ? 1 : -1) * (e.shiftKey ? 1 : 10)); return true; }
        if (k === 'Home') { setFold(0); return true; }
        if (k === 'End') { setFold(100); return true; }
      }
      if (m === 'poly' || m === 'net') {
        if (k === 'PageDown' || k === 'PageUp') { var nF = PD().p.F.length, cur = sel && sel.kind === 'face' ? sel.i : -1; selectFace(k === 'PageDown' ? (cur + 1) % nF : (cur - 1 + nF) % nF); return true; }
        if (k === 'Escape' && sel) { selectFace(null); return true; }
      }
      if (m === 'net' || m === 'fold') {
        var pan = { ArrowLeft: [40, 0], ArrowRight: [-40, 0], ArrowUp: [0, 40], ArrowDown: [0, -40] }[k];
        if (m === 'net' && pan) { view.x += pan[0]; view.y += pan[1]; view.onChange(); return true; }
        if (k === '+' || k === '=') { view.zoomAt(vp.clientWidth / 2, vp.clientHeight / 2, 1.25); return true; }
        if (k === '-') { view.zoomAt(vp.clientWidth / 2, vp.clientHeight / 2, 0.8); return true; }
        if (k === '0') { if (m === 'net') renderNet(true); else fitPaper(); return true; }
      }
      if (m === 'fold') {
        var dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
        if (dir) { moveCursor(dir[0], dir[1]); return true; }
        if (k === 'Enter' || k === ' ') { if (pick.length === 2 && (cursor < 0 || isSameAsPicked())) { doFold(); return true; } if (cursor >= 0) pickPoint(marks()[cursor].p); else { moveCursor(1, 0); } return true; }
        var lk = k.toLowerCase();
        if (lk === 'v') { setType('V'); return true; }
        if (lk === 'm') { setType('M'); return true; }
        if (lk === 's') { if (pick.length === 2) { flipSide = !flipSide; drawOverlay(); ctx.announce(t('sideSwapped')); } return true; }
        if (lk === 't') { topOnly = !topOnly; renderTools(); drawOverlay(); ctx.announce(t(topOnly ? 'topOnlyOn' : 'topOnlyOff')); return true; }
        if (lk === 'f') { doFlip(); return true; }
        if (lk === 'r') { doRotate(); return true; }
        if (lk === 'g') { doGuideStep(); return true; }
        if (k === 'Escape') { if (pick.length) { pick = []; drawOverlay(); renderTools(); ctx.announce(t('cancelled')); return true; } if (sel) { sel = null; renderAll(); return true; } return false; }
      }
      if (m === 'vertex') {
        if (k === 'ArrowLeft' || k === 'ArrowUp') { vTurn(e.shiftKey ? 15 : 1); return true; }
        if (k === 'ArrowRight' || k === 'ArrowDown') { vTurn(e.shiftKey ? -15 : -1); return true; }
        if (k === 'Enter' || k === ' ') { vAdd(vCursor); return true; }
        var lv = k.toLowerCase();
        if (lv === 'v') { setType('V'); return true; }
        if (lv === 'm') { setType('M'); return true; }
        if (k === 'Delete' || k === 'Backspace') { vDelete(); return true; }
        if (k === 'PageDown' || k === 'PageUp') { var cr = sortedCreases(); if (!cr.length) return true; vSel = k === 'PageDown' ? (vSel + 1) % cr.length : (vSel - 1 + cr.length) % cr.length; vCursor = cr[vSel].a; renderAll(); ctx.announce(t('creaseSel', { n: vSel + 1, a: num(cr[vSel].a, 1), type: t(cr[vSel].t === 'V' ? 'valleyWord' : 'mountainWord') })); return true; }
        if (k === 'Escape' && vSel >= 0) { vSel = -1; renderAll(); ctx.announce(t('deselected')); return true; }
      }
      if (m === 'crane' || m === 'sonobe') {
        if (k === 'ArrowRight' || k === 'PageDown') { goStep(1); return true; }
        if (k === 'ArrowLeft' || k === 'PageUp') { goStep(-1); return true; }
        if (k === 'Home') { goStep(0, 0); return true; }
        if (k === 'End') { goStep(0, 99); return true; }
        if (m === 'sonobe' && S.sonobe.step >= SON_UNIT && renderer) {
          if (k === 'ArrowUp' || k === 'ArrowDown') { orbit(0, k === 'ArrowUp' ? 10 : -10); return true; }
          if (k === '+' || k === '=') { orbit(0, 0, 0.8); return true; }
          if (k === '-') { orbit(0, 0, 1.25); return true; }
          if (k === '0') { frame3d(); return true; }
        }
      }
      return false;
    }
    function isSameAsPicked() { if (cursor < 0 || pick.length < 2) return true; var p = marks()[cursor].p; return pick.some(function (q) { return Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-6; }); }

    /* ================= Exportaciones ================= */
    function base(x) { return x + '-' + ctx.stamp(); }
    function exportNet() { ctx.download(new Blob([netSVGFile()], { type: 'image/svg+xml' }), base(LANG === 'en' ? 'net' : 'red') + '.svg'); }
    function printNet() { var pages = netPages(); printSVGPages(pages); ctx.announce(t('printing', { n: pages.length })); }
    function paperColors() { return [S.paper.front, S.paper.back]; }
    function paperTitle() { var gs = guideState(); return gs ? t('guideName_' + gs.id) + ' · ' + t('sheetWord') : t('mySheet'); }
    function exportPaperSheet() { if (!S.paper.steps.length) { ctx.announce(t('noSteps')); return; } ctx.download(new Blob([stackedSVG(sheetPages(paperTitle(), paperPanels(), paperColors()))], { type: 'image/svg+xml' }), base(LANG === 'en' ? 'fold-diagrams' : 'diagramas-pliegues') + '.svg'); }
    function printPaperSheet() { if (!S.paper.steps.length) { ctx.announce(t('noSteps')); return; } var p = sheetPages(paperTitle(), paperPanels(), paperColors()); printSVGPages(p); ctx.announce(t('printing', { n: p.length })); }
    function exportCrane() { ctx.download(new Blob([stackedSVG(sheetPages(t('craneTitle'), cranePanels(), [S.crane.color, '#ffffff']))], { type: 'image/svg+xml' }), base(LANG === 'en' ? 'crane' : 'grulla') + '.svg'); }
    function printCrane() { var p = sheetPages(t('craneTitle'), cranePanels(), [S.crane.color, '#ffffff']); printSVGPages(p); ctx.announce(t('printing', { n: p.length })); }
    function exportSonobe() { ctx.download(new Blob([stackedSVG(sheetPages(t('sonobeTitle'), sonobePanels(), [S.sonobe.colors[0], '#ffffff']))], { type: 'image/svg+xml' }), base('sonobe') + '.svg'); }
    function printSonobe() { var p = sheetPages(t('sonobeTitle'), sonobePanels(), [S.sonobe.colors[0], '#ffffff']); printSVGPages(p); ctx.announce(t('printing', { n: p.length })); }
    function exportPng() {
      if (!renderer) { ctx.announce(t('no3d')); return; }
      var showSon = S.mode === 'sonobe';
      if (!showSon && hingeData === null) build3d();
      polyG.visible = !showSon; sonG.visible = showSon;
      if (showSon && S.sonobe.step < SON_UNIT) { buildSonobeAll(); }
      var hidden = host3d.offsetParent === null;
      if (hidden) { renderer.setSize(1200, 900, false); camera.aspect = 1200 / 900; camera.updateProjectionMatrix(); if (!showSon) frame3d(); else frame3d(); }
      renderer.render(scene, camera);
      var c = ctx.canvasWithCredit(renderer.domElement, '#f1f5f9');
      ctx.canvasBlob(c).then(function (b) { ctx.download(b, base(showSon ? 'sonobe-3d' : (LANG === 'en' ? 'polyhedron' : 'poliedro')) + '.png'); });
      if (hidden) { setTimeout(function () { renderAll(false); loop.resize(); }, 0); }
    }
    function buildSonobeAll() { var keep = S.sonobe.step; S.sonobe.step = SON_TOTAL - 1; buildSonobe(false); S.sonobe.step = keep; }
    ctx.addExport(t('exportNetSvg'), exportNet, 'download');
    ctx.addExport(t('exportNetPrint'), printNet, 'file');
    ctx.addExport(t('exportSheetSvg'), exportPaperSheet, 'download');
    ctx.addExport(t('exportSheetPrint'), printPaperSheet, 'file');
    ctx.addExport(t('exportCraneSvg'), exportCrane, 'download');
    ctx.addExport(t('exportCranePrint'), printCrane, 'file');
    ctx.addExport(t('exportSonobeSvg'), exportSonobe, 'download');
    ctx.addExport(t('exportSonobePrint'), printSonobe, 'file');
    ctx.addExport(t('exportPng'), exportPng, 'download');
    MODES.forEach(function (m) { ctx.command('mode-' + m, t('goMode', { name: modeName(m) }), t('modeHelp_' + m), function () { setMode(m, true); }); });
    ctx.command('unfold', t('unfoldBtn'), t('mode_poly'), function () { if (S.mode !== 'poly') setMode('poly'); setFold(0); });
    ctx.command('fold', t('foldBtn'), t('mode_poly'), function () { if (S.mode !== 'poly') setMode('poly'); setFold(100); });
    ctx.command('othernet', t('otherNet'), t('mode_net'), otherNet);
    ctx.command('printnet', t('printNet'), t('mode_net'), printNet);
    ctx.command('flip', t('flipBtn'), t('mode_fold'), function () { if (S.mode !== 'fold') setMode('fold'); doFlip(); });
    ctx.command('guidestep', t('doGuideStep'), t('mode_fold'), function () { if (S.mode !== 'fold') setMode('fold'); doGuideStep(); });
    ctx.command('sheet', t('printSheet'), t('mode_fold'), printPaperSheet);
    ctx.command('printcrane', t('printCrane'), t('mode_crane'), printCrane);
    ctx.command('printsonobe', t('printSonobe'), t('mode_sonobe'), printSonobe);

    /* ================= Puntos de partida ================= */
    function start(id) {
      S = defaults(); sel = null; pick = []; cursor = -1; vSel = -1; vCursor = 0; foldType = 'V'; topOnly = false; flipSide = false;
      var mode = 'poly';
      if (id === 'icosa') { S.poly.kind = 'icosa'; S.poly.fold = 55; S.poly.edgeMm = 35; }
      else if (id === 'cubeNet') { S.poly.kind = 'cube'; S.poly.edgeMm = 50; mode = 'net'; }
      else if (id === 'printable') { S.poly.kind = 'tocta'; S.poly.edgeMm = 25; mode = 'net'; }
      else if (id === 'plane' || id === 'cup' || id === 'hat' || id === 'envelope') { loadGuide(id); mode = 'fold'; if (id === 'plane') S.paper.front = '#3b6fb6'; if (id === 'cup') S.paper.front = '#2a8c8c'; if (id === 'hat') S.paper.front = '#e0603a'; if (id === 'envelope') S.paper.front = '#6a4c93'; }
      else if (id === 'crane') mode = 'crane';
      else if (id === 'sonobe') mode = 'sonobe';
      else if (id === 'vertex') { vPreset('kite'); mode = 'vertex'; }
      S.poly.colors = defaultColors(PD().p);
      if (id === 'printable') { var p = PD().p, ft = faceTypes(p); S.poly.colors = ft.idx.map(function (i, j) { return i === 0 ? ['#3b6fb6', '#6a4c93'][j % 2] : '#f2b134'; }); }
      build3d(); if (renderer) buildSonobe(false);
      S.mode = null; setMode(mode, false);
    }

    /* ================= Proyecto ================= */
    function serialize() { return JSON.parse(JSON.stringify(S)); }
    function validate(d) {
      function hex(c) { return typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c); }
      function n(v, a, b) { return typeof v === 'number' && isFinite(v) && v >= a && v <= b; }
      function pt(p) { return Array.isArray(p) && p.length === 2 && n(p[0], -100, 100) && n(p[1], -100, 100); }
      try {
        if (!d || d.v !== 1 || MODES.indexOf(d.mode) < 0) return false;
        var p = d.poly; if (!p || GEO.KINDS.indexOf(p.kind) < 0 || !n(p.n, 3, 12) || !n(p.hr, 0.3, 3) || !n(p.edgeMm, 10, 200) || !n(p.netIdx, 0, 100) || !n(p.tabMm, 3, 15) || !n(p.fold, 0, 100) || !Array.isArray(p.colors) || p.colors.length > 64 || !p.colors.every(hex) || (p.side !== 'out' && p.side !== 'in')) return false;
        var q = d.paper; if (!q || (q.shape !== 'square' && q.shape !== 'a4') || (q.orient !== 'square' && q.orient !== 'diamond') || !hex(q.front) || !hex(q.back) || !Array.isArray(q.steps) || q.steps.length > 200 || (q.guide !== null && GUIDES.indexOf(q.guide) < 0) || (q.pick !== 'line' && q.pick !== 'p2p')) return false;
        if (!q.steps.every(function (s) { return s && (s.op === 'flip' || s.op === 'rotate' || (s.op === 'fold' && pt(s.a) && pt(s.b) && (s.type === 'V' || s.type === 'M') && (s.side === 1 || s.side === -1) && (s.layers === 'all' || s.layers === 'top') && (s.note === undefined || (typeof s.note === 'string' && s.note.length <= 160)))); })) return false;
        if (!d.vertex || !Array.isArray(d.vertex.creases) || d.vertex.creases.length > 16 || !d.vertex.creases.every(function (c) { return c && n(c.a, 0, 360) && (c.t === 'V' || c.t === 'M'); })) return false;
        if (!d.crane || !n(d.crane.step, 0, 12) || !hex(d.crane.color)) return false;
        if (!d.sonobe || !n(d.sonobe.step, 0, SON_TOTAL - 1) || !Array.isArray(d.sonobe.colors) || d.sonobe.colors.length !== 3 || !d.sonobe.colors.every(hex)) return false;
      } catch (_) { return false; }
      fromFile = true; return true;
    }
    function restore(d) {
      var prev = S, next = JSON.parse(JSON.stringify(d));
      if (fromFile) { fromFile = false; S = next; sel = null; pick = []; vSel = -1; build3d(); if (renderer) buildSonobe(false); var m = S.mode; S.mode = null; setMode(m, false); return; }
      /* deshacer/rehacer: cambia el trabajo, no la vista; se enseña la vista donde estaba el cambio */
      var changedPart = ['poly', 'paper', 'vertex', 'crane', 'sonobe'].filter(function (k) { return JSON.stringify(strip(prev[k], k)) !== JSON.stringify(strip(next[k], k)); })[0];
      var keep = { mode: prev.mode, fold: prev.poly.fold, cs: prev.crane.step, ss: prev.sonobe.step };
      var polyChanged = polyKey() !== next.poly.kind + '|' + (GEO.HAS_N[next.poly.kind] ? next.poly.n : '') + '|' + (GEO.HAS_N[next.poly.kind] ? next.poly.hr : '') || prev.poly.netIdx !== next.poly.netIdx;
      S = next; S.mode = keep.mode; S.poly.fold = keep.fold; S.crane.step = keep.cs; S.sonobe.step = keep.ss;
      if (sel && sel.kind === 'face' && (!S.poly.colors[sel.i])) sel = null;
      if (sel && sel.kind === 'step' && !S.paper.steps[sel.i]) sel = null;
      pick = []; if (vSel >= S.vertex.creases.length) vSel = -1;
      if (polyChanged) build3d();
      var target = { poly: S.mode === 'net' ? 'net' : 'poly', paper: 'fold', vertex: 'vertex', crane: 'crane', sonobe: 'sonobe' }[changedPart];
      if (target && target !== S.mode) setMode(target, false); else renderAll(false);
      if (S.mode === 'poly' || S.mode === 'net') { highlight3d(); applyFold(); }
    }
    function strip(o, k) { var c = JSON.parse(JSON.stringify(o)); if (k === 'poly') delete c.fold; if (k === 'crane' || k === 'sonobe') delete c.step; return c; }

    ensureColors();
    return ready3d.then(function () {
      return { serialize: serialize, validate: validate, restore: restore, start: start, onKey: onKey };
    });
  }
})(window);
