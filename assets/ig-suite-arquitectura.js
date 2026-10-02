/* Iris Green · El taller · Estudio de arquitectura (R43).
   Plano en planta (SVG, en metros) y vista 3D sincronizada (Three.js, WebGPU o WebGL 2).
   Habitaciones, paredes, puertas, ventanas y muebles; cotas, superficies y una revisión orientativa
   de luz natural y accesibilidad (CTE DB-SUA, anejo A). Exporta plano SVG a escala 1:50, PNG, GLB y OBJ. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang, SVGNS = 'http://www.w3.org/2000/svg';
  var GRID = 0.1;
  var ROOM_TYPES = { bedroom: '#dfe9f5', living: '#f3ead6', kitchen: '#e3f1e4', bath: '#dff1f1', corridor: '#ecebf6', other: '#eeeeee' };
  var FURN = {
    bed: [0.9, 1.9, 0.5], bed2: [1.5, 1.9, 0.5], desk: [1.2, 0.6, 0.75], table: [1.2, 0.8, 0.75], chair: [0.45, 0.45, 0.9], sofa: [2.0, 0.9, 0.8],
    wardrobe: [1.0, 0.6, 2.0], shelf: [0.8, 0.3, 1.8], counter: [2.4, 0.6, 0.9], sink: [0.6, 0.45, 0.85], toilet: [0.4, 0.7, 0.8], shower: [0.9, 0.9, 0.05],
    bathtub: [1.7, 0.75, 0.55], plant: [0.4, 0.4, 1.0], turn: [1.5, 1.5, 0.01]
  };
  var FURN_COLORS = { bed: '#6c8fb3', bed2: '#6c8fb3', desk: '#b08a5a', table: '#b08a5a', chair: '#8a6a45', sofa: '#7d6aa8', wardrobe: '#c7a77a', shelf: '#c7a77a', counter: '#d9d9d9', sink: '#f4f4f4', toilet: '#f4f4f4', shower: '#cfe3ea', bathtub: '#f4f4f4', plant: '#3f8f4f', turn: '#2e7d32' };

  IG.defineEngine('arquitectura', {
    libs: ['three'], version: 1, fileBase: LANG === 'en' ? 'plan' : 'plano',
    extraKeys: ['kArchCursor', 'kArchWalk'],
    initialStart: function (para) { return { child: 'room', teen: 'light', adult: 'accessible' }[para] || 'house'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'room', title: t('stRoom'), desc: t('stRoomD'), para: 'child' },
        { id: 'house', title: t('stHouse'), desc: t('stHouseD'), para: 'any' },
        { id: 'light', title: t('stLight'), desc: t('stLightD'), para: 'teen' },
        { id: 'accessible', title: t('stAccess'), desc: t('stAccessD'), para: 'adult' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, THREE = root.THREE, T3 = IG.ThreeD;
    var S = empty(), seq = 0, selId = null, tool = 'select', furnKind = 'bed', dims = true;
    function empty() { return { v: 1, walls: [], openings: [], rooms: [], furniture: [], wallH: 2.5, wallT: 0.15 }; }
    function nid(p) { seq += 1; return p + seq; }
    function r2(v) { return (Math.round(v * 100) / 100) || 0; }
    function snap(v) { return (Math.round(v / GRID) * GRID) || 0; }
    function m(v) { return IG.num(v, 2) + ' m'; }
    function m2(v) { return IG.num(v, 1) + ' m²'; }

    /* ---------- Estructura de la vista: planta + 3D ---------- */
    var planBox = h('div', { class: 'iga-plan' }), view3d = h('div', { class: 'iga-3d', tabindex: '0', role: 'img', 'aria-label': t('view3dLabel') });
    var split = h('div', { class: 'iga-split', 'data-show': root.innerWidth >= 900 ? 'both' : 'plan' }, planBox, view3d);
    ctx.viewport.appendChild(split); ctx.viewport.classList.add('iga-viewport');
    var svg = D.createElementNS(SVGNS, 'svg'); svg.setAttribute('class', 'iga-svg'); svg.setAttribute('aria-hidden', 'true');
    planBox.appendChild(svg);
    var world = D.createElementNS(SVGNS, 'g'); svg.appendChild(world);
    var view = new ctx.View2D({ scale: 40, min: 6, max: 400, onChange: applyView });
    function applyView() { world.setAttribute('transform', 'translate(' + view.x + ',' + view.y + ') scale(' + view.scale + ')'); drawOverlay(); }
    ctx.attachViewGestures(planBox, view, { isPanTool: function () { return tool === 'pan'; } });

    /* ---------- 3D ---------- */
    var renderer, scene, camera, controls, loop, group3d, walkMode = false, walk = { x: 2, z: 2, yaw: 0 };
    var eyeH = ctx.para === 'child' ? 1.1 : 1.6;
    var ready3d = T3.createRenderer(THREE, view3d).then(function (r) {
      renderer = r;
      ctx.setTech('renderer', 'SVG · Three.js r' + THREE.REVISION + ' · ' + r.igsBackend);
      scene = new THREE.Scene(); scene.background = new THREE.Color(0xeef3f8);
      camera = new THREE.PerspectiveCamera(50, 1, 0.05, 400);
      loop = new T3.Loop(renderer, scene, camera, view3d);
      T3.lights(THREE, scene).sun.position.set(12, 20, 8);
      var ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0xdfe8d8, roughness: 1 }));
      ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01; scene.add(ground);
      controls = new THREE.OrbitControls(camera, renderer.domElement); controls.maxPolarAngle = Math.PI * 0.495; controls.addEventListener('change', loop.request);
      group3d = new THREE.Group(); scene.add(group3d);
      var down = null;
      renderer.domElement.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY]; });
      renderer.domElement.addEventListener('pointerup', function (e) {
        if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return; down = null;
        var rc = renderer.domElement.getBoundingClientRect(), ray = new THREE.Raycaster();
        ray.setFromCamera(new THREE.Vector2((e.clientX - rc.left) / rc.width * 2 - 1, -(e.clientY - rc.top) / rc.height * 2 + 1), camera);
        var hit = ray.intersectObjects(group3d.children, true).filter(function (x) { return x.object.userData.id; })[0];
        select(hit ? hit.object.userData.id : null);
      });
      build3d(); frame3d();
    }).catch(function () {
      /* Sin WebGL ni WebGPU: la planta sigue funcionando y se explica por qué no hay 3D. */
      view3d.appendChild(h('p', { class: 'iga-no3d', text: t('no3d') })); ctx.setTech('renderer', 'SVG');
    });
    var build3dTimer = 0;
    function schedule3d() { clearTimeout(build3dTimer); build3dTimer = setTimeout(build3d, 60); }
    function mat(color, opts) { return new THREE.MeshStandardMaterial(Object.assign({ color: new THREE.Color(color), roughness: 0.85 }, opts || {})); }
    function box(w, hh, d, color, x, y, z, rotY, id, opts) {
      var mesh = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.001, w), Math.max(0.001, hh), Math.max(0.001, d)), mat(color, opts));
      mesh.position.set(x, y, z); mesh.rotation.y = rotY || 0; if (id) mesh.userData.id = id; return mesh;
    }
    function build3d() {
      if (!group3d) return;
      group3d.children.slice().forEach(function (c) { group3d.remove(c); c.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); });
      S.rooms.forEach(function (r) {
        var f = box(r.w, 0.02, r.h, ROOM_TYPES[r.type] || '#eee', r.x + r.w / 2, 0.01, r.y + r.h / 2, 0, r.id); group3d.add(f);
      });
      S.walls.forEach(function (w) {
        var L = len(w); if (L < 0.01) return;
        var ang = Math.atan2(w.b[1] - w.a[1], w.b[0] - w.a[0]), ux = Math.cos(ang), uz = Math.sin(ang), H = w.h || S.wallH, T = w.t || S.wallT;
        var sel = w.id === selId, col = sel ? '#5a49a8' : '#f2f0ea';
        var ops = S.openings.filter(function (o) { return o.wall === w.id; }).map(function (o) { return { s: Math.max(0, o.pos - o.w / 2), e: Math.min(L, o.pos + o.w / 2), o: o }; }).sort(function (a, b) { return a.s - b.s; });
        var cur = -T / 2, pieces = [];
        ops.forEach(function (op) { if (op.s > cur) pieces.push([cur, op.s, 0, H]); var o = op.o, top = o.kind === 'door' ? o.hgt : o.sill + o.hgt; if (o.kind === 'window' && o.sill > 0) pieces.push([op.s, op.e, 0, o.sill]); if (top < H) pieces.push([op.s, op.e, top, H]); cur = Math.max(cur, op.e); });
        if (cur < L + T / 2) pieces.push([cur, L + T / 2, 0, H]);
        pieces.forEach(function (p) {
          var mid = (p[0] + p[1]) / 2, x = w.a[0] + ux * mid, z = w.a[1] + uz * mid;
          group3d.add(box(p[1] - p[0], p[3] - p[2], T, col, x, (p[2] + p[3]) / 2, z, -ang, w.id));
        });
        ops.forEach(function (op) {
          var o = op.o, mid = o.pos, x = w.a[0] + ux * mid, z = w.a[1] + uz * mid, isSel = o.id === selId;
          if (o.kind === 'window') group3d.add(box(o.w, o.hgt, 0.02, isSel ? '#5a49a8' : '#9ec9e8', x, o.sill + o.hgt / 2, z, -ang, o.id, { transparent: true, opacity: 0.45, roughness: 0.1 }));
          else {
            var leaf = box(o.w - 0.04, o.hgt - 0.02, 0.04, isSel ? '#5a49a8' : '#a9855a', 0, o.hgt / 2, 0, 0, o.id), pivot = new THREE.Group();
            leaf.position.set((o.w - 0.04) / 2, (o.hgt - 0.02) / 2, 0); pivot.add(leaf);
            pivot.position.set(w.a[0] + ux * (mid - o.w / 2), 0, w.a[1] + uz * (mid - o.w / 2)); pivot.rotation.y = -ang - (o.flip ? -1 : 1) * Math.PI / 3; group3d.add(pivot);
          }
        });
      });
      S.furniture.forEach(function (f) { if (f.kind !== 'turn') group3d.add(furniture3d(f)); else { var disc = new THREE.Mesh(new THREE.CylinderGeometry(f.w / 2, f.w / 2, 0.01, 48), mat('#2e7d32', { transparent: true, opacity: 0.35 })); disc.position.set(f.x, 0.03, f.y); disc.userData.id = f.id; group3d.add(disc); } });
      if (loop) loop.request();
    }
    function furniture3d(f) {
      var g = new THREE.Group(), c = f.id === selId ? '#5a49a8' : (FURN_COLORS[f.kind] || '#999'), W = f.w, Dd = f.d, H = f.h;
      function add(w, hh, d, x, y, z, col) { g.add(box(w, hh, d, col || c, x, y, z, 0, f.id)); }
      switch (f.kind) {
        case 'bed': case 'bed2': add(W, H * 0.6, Dd, 0, H * 0.3, 0, '#a58b6d'); add(W - 0.04, H * 0.35, Dd - 0.04, 0, H * 0.78, 0.02, c); add(W * 0.8, 0.12, 0.35, 0, H + 0.02, -Dd / 2 + 0.25, '#f4f4f4'); add(W, 0.9, 0.06, 0, 0.45, -Dd / 2 + 0.03, '#8a6a45'); break;
        case 'table': case 'desk': add(W, 0.04, Dd, 0, H - 0.02, 0); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (s) { add(0.05, H - 0.04, 0.05, s[0] * (W / 2 - 0.05), (H - 0.04) / 2, s[1] * (Dd / 2 - 0.05)); }); break;
        case 'chair': add(W, 0.05, Dd, 0, 0.45, 0); add(W, H - 0.45, 0.05, 0, 0.45 + (H - 0.45) / 2, -Dd / 2 + 0.025); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (s) { add(0.04, 0.43, 0.04, s[0] * (W / 2 - 0.03), 0.215, s[1] * (Dd / 2 - 0.03)); }); break;
        case 'sofa': add(W, 0.42, Dd, 0, 0.21, 0); add(W, H - 0.42, 0.2, 0, 0.42 + (H - 0.42) / 2, -Dd / 2 + 0.1); add(0.18, 0.62, Dd, -W / 2 + 0.09, 0.31, 0); add(0.18, 0.62, Dd, W / 2 - 0.09, 0.31, 0); break;
        case 'toilet': { var bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.16, 0.42, 24), mat(c)); bowl.position.set(0, 0.21, 0.08); bowl.userData.id = f.id; g.add(bowl); add(W, 0.4, 0.18, 0, 0.6, -Dd / 2 + 0.09); break; }
        case 'plant': { var pot = new THREE.Mesh(new THREE.CylinderGeometry(W * 0.4, W * 0.3, 0.35, 20), mat('#b0643c')); pot.position.y = 0.175; pot.userData.id = f.id; g.add(pot); var leaves = new THREE.Mesh(new THREE.SphereGeometry(W * 0.55, 20, 14), mat(c)); leaves.position.y = 0.35 + (H - 0.35) / 2; leaves.scale.y = (H - 0.35) / (W * 1.1); leaves.userData.id = f.id; g.add(leaves); break; }
        case 'sink': add(W, 0.15, Dd, 0, H - 0.075, 0); add(0.12, H - 0.15, 0.12, 0, (H - 0.15) / 2, -Dd / 4, '#dcdcdc'); break;
        case 'bathtub': add(W, H, Dd, 0, H / 2, 0); add(W - 0.12, 0.02, Dd - 0.12, 0, H + 0.001, 0, '#bcdbe6'); break;
        default: add(W, H, Dd, 0, H / 2, 0);
      }
      g.position.set(f.x, 0, f.y); g.rotation.y = -(f.rot || 0) * Math.PI / 180;
      return g;
    }
    function frame3d() {
      if (!camera) return;
      var b = bounds(), cx = (b.minX + b.maxX) / 2, cz = (b.minY + b.maxY) / 2, r = Math.max(4, Math.hypot(b.maxX - b.minX, b.maxY - b.minY) / 2);
      walkMode = false; controls.enabled = true;
      controls.target.set(cx, 0.8, cz); camera.position.set(cx + r * 0.9, r * 1.35, cz + r * 1.45); controls.update(); loop.request();
    }
    function setWalk(on) {
      if (!camera) return;
      walkMode = on; controls.enabled = !on;
      if (on) {
        var inRoom = S.rooms.filter(function (r) { return kc.x > r.x && kc.x < r.x + r.w && kc.y > r.y && kc.y < r.y + r.h; })[0];
        var big = inRoom || S.rooms.slice().sort(function (a, b) { return b.w * b.h - a.w * a.h; })[0];
        if (inRoom) { walk.x = kc.x; walk.z = kc.y; } else if (big) { walk.x = big.x + big.w / 2; walk.z = big.y + big.h / 2; } else { walk.x = kc.x; walk.z = kc.y; }
        if (big) walk.yaw = big.w >= big.h ? 0 : Math.PI / 2;
        placeWalk(); ctx.announce(t('walkOn', { h: m(eyeH) })); view3d.focus(); }
      else { frame3d(); ctx.announce(t('walkOff')); }
      drawOverlay();
    }
    function placeWalk() {
      camera.position.set(walk.x, eyeH, walk.z);
      camera.lookAt(walk.x + Math.cos(walk.yaw), eyeH - 0.05, walk.z + Math.sin(walk.yaw)); loop.request(); drawOverlay();
    }
    view3d.addEventListener('keydown', function (e) {
      if (!camera) return;
      var k = e.key;
      if (!walkMode) {
        var ang = { ArrowLeft: 0.2, ArrowRight: -0.2 }[k];
        if (ang) { e.preventDefault(); var off = camera.position.clone().sub(controls.target); off.applyAxisAngle(new THREE.Vector3(0, 1, 0), ang); camera.position.copy(controls.target).add(off); controls.update(); loop.request(); }
        if (k === '+' || k === '-') { e.preventDefault(); var o2 = camera.position.clone().sub(controls.target).multiplyScalar(k === '+' ? 0.8 : 1.25); camera.position.copy(controls.target).add(o2); controls.update(); loop.request(); }
        return;
      }
      var step = e.shiftKey ? 0.5 : 0.2;
      if (k === 'ArrowUp' || k === 'ArrowDown') { e.preventDefault(); var s = k === 'ArrowUp' ? step : -step; walk.x += Math.cos(walk.yaw) * s; walk.z += Math.sin(walk.yaw) * s; placeWalk(); }
      else if (k === 'ArrowLeft' || k === 'ArrowRight') { e.preventDefault(); walk.yaw += (k === 'ArrowLeft' ? -1 : 1) * Math.PI / 12; placeWalk(); }
      else if (k === 'Escape') { e.preventDefault(); setWalk(false); }
    });

    /* ---------- Geometría ---------- */
    function len(w) { return Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]); }
    function bounds() {
      var b = { minX: 0, minY: 0, maxX: 6, maxY: 5 }, any = false;
      function add(x, y) { if (!any) { b = { minX: x, minY: y, maxX: x, maxY: y }; any = true; } b.minX = Math.min(b.minX, x); b.minY = Math.min(b.minY, y); b.maxX = Math.max(b.maxX, x); b.maxY = Math.max(b.maxY, y); }
      S.walls.forEach(function (w) { add(w.a[0], w.a[1]); add(w.b[0], w.b[1]); });
      S.rooms.forEach(function (r) { add(r.x, r.y); add(r.x + r.w, r.y + r.h); });
      S.furniture.forEach(function (f) { add(f.x, f.y); });
      return b;
    }
    function distToWall(w, x, y) {
      var dx = w.b[0] - w.a[0], dy = w.b[1] - w.a[1], L2 = dx * dx + dy * dy || 1e-9, u = Math.max(0, Math.min(1, ((x - w.a[0]) * dx + (y - w.a[1]) * dy) / L2));
      return { d: Math.hypot(x - (w.a[0] + u * dx), y - (w.a[1] + u * dy)), along: u * Math.sqrt(L2) };
    }
    function nearestWall(x, y, maxD) {
      var best = null; S.walls.forEach(function (w) { var r = distToWall(w, x, y); if (r.d <= maxD && (!best || r.d < best.d)) best = { w: w, d: r.d, along: r.along }; }); return best;
    }
    /* Añade una pared evitando duplicar tramos que ya existen en la misma línea (habitaciones vecinas). */
    function addWallDedup(a, b) {
      var horiz = Math.abs(a[1] - b[1]) < 1e-6, vert = Math.abs(a[0] - b[0]) < 1e-6;
      if (!horiz && !vert) { S.walls.push({ id: nid('w'), a: a, b: b, t: S.wallT, h: S.wallH }); return; }
      var ax = horiz ? 0 : 1, fixed = horiz ? a[1] : a[0], s = Math.min(a[ax], b[ax]), e = Math.max(a[ax], b[ax]), free = [[s, e]];
      S.walls.forEach(function (w) {
        var wh = Math.abs(w.a[1] - w.b[1]) < 1e-6, wv = Math.abs(w.a[0] - w.b[0]) < 1e-6;
        if ((horiz && wh && Math.abs(w.a[1] - fixed) < 1e-6) || (vert && wv && Math.abs(w.a[0] - fixed) < 1e-6)) {
          var ws = Math.min(w.a[ax], w.b[ax]), we = Math.max(w.a[ax], w.b[ax]);
          free = free.reduce(function (acc, iv) { if (we <= iv[0] || ws >= iv[1]) acc.push(iv); else { if (ws > iv[0]) acc.push([iv[0], ws]); if (we < iv[1]) acc.push([we, iv[1]]); } return acc; }, []);
        }
      });
      free.forEach(function (iv) { if (iv[1] - iv[0] < 0.05) return; var p = horiz ? [[iv[0], fixed], [iv[1], fixed]] : [[fixed, iv[0]], [fixed, iv[1]]]; S.walls.push({ id: nid('w'), a: p[0], b: p[1], t: S.wallT, h: S.wallH }); });
    }
    function addRoom(x, y, w, hh, type, name) {
      var r = { id: nid('r'), name: name || t('roomType_' + (type || 'other')), type: type || 'other', x: r2(x), y: r2(y), w: r2(w), h: r2(hh) };
      S.rooms.push(r);
      addWallDedup([r.x, r.y], [r.x + r.w, r.y]); addWallDedup([r.x + r.w, r.y], [r.x + r.w, r.y + r.h]);
      addWallDedup([r.x + r.w, r.y + r.h], [r.x, r.y + r.h]); addWallDedup([r.x, r.y + r.h], [r.x, r.y]);
      return r;
    }
    function addOpening(kind, x, y) {
      var nw = nearestWall(x, y, 0.6); if (!nw) { ctx.announce(t('noWallNear')); return null; }
      var L = len(nw.w), wdt = kind === 'door' ? 0.9 : 1.2;
      if (L < wdt + 0.1) { ctx.announce(t('wallTooShort')); return null; }
      var o = { id: nid(kind === 'door' ? 'd' : 'v'), wall: nw.w.id, kind: kind, pos: r2(Math.max(wdt / 2 + 0.05, Math.min(L - wdt / 2 - 0.05, snap(nw.along)))), w: wdt, sill: kind === 'door' ? 0 : 0.9, hgt: kind === 'door' ? 2.1 : 1.2, flip: false };
      S.openings.push(o); return o;
    }
    function byId(id) {
      var lists = [S.walls, S.openings, S.rooms, S.furniture];
      for (var i = 0; i < lists.length; i++) for (var j = 0; j < lists[i].length; j++) if (lists[i][j].id === id) return lists[i][j];
      return null;
    }
    function kindOf(id) { return id ? ({ w: 'wall', d: 'opening', v: 'opening', r: 'room', f: 'furniture' })[id.charAt(0)] : null; }
    function describe(o) {
      if (!o) return '';
      var k = kindOf(o.id);
      if (k === 'wall') return t('descWall', { l: m(len(o)), t: IG.num(o.t * 100, 0) });
      if (k === 'opening') return t(o.kind === 'door' ? 'descDoor' : 'descWindow', { w: m(o.w), h: m(o.hgt), s: m(o.sill) });
      if (k === 'room') return t('descRoom', { name: o.name, w: m(o.w), h: m(o.h), a: m2(o.w * o.h) });
      return t('descFurn', { name: t('furn_' + o.kind), w: m(o.w), d: m(o.d) });
    }

    /* ---------- Dibujo de la planta ---------- */
    function el(name, attrs, parent) { var e = D.createElementNS(SVGNS, name); Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }); if (parent) parent.appendChild(e); return e; }
    var overlay = D.createElementNS(SVGNS, 'g'); svg.appendChild(overlay);
    function render() {
      while (world.firstChild) world.removeChild(world.firstChild);
      var b = bounds(), gx0 = Math.floor(b.minX) - 10, gy0 = Math.floor(b.minY) - 10, gx1 = Math.ceil(b.maxX) + 10, gy1 = Math.ceil(b.maxY) + 10;
      var grid = el('g', { class: 'iga-grid' }, world);
      for (var i = 0; gx0 + i * 0.5 <= gx1; i++) el('line', { x1: gx0 + i * 0.5, y1: gy0, x2: gx0 + i * 0.5, y2: gy1, class: i % 2 ? 'iga-g2' : 'iga-g1' }, grid);
      for (var j = 0; gy0 + j * 0.5 <= gy1; j++) el('line', { x1: gx0, y1: gy0 + j * 0.5, x2: gx1, y2: gy0 + j * 0.5, class: j % 2 ? 'iga-g2' : 'iga-g1' }, grid);
      S.rooms.forEach(function (r) {
        el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: ROOM_TYPES[r.type] || '#eee', class: 'iga-room' + (r.id === selId ? ' iga-sel' : ''), 'data-id': r.id }, world);
      });
      S.furniture.forEach(function (f) {
        var g = el('g', { transform: 'translate(' + f.x + ',' + f.y + ') rotate(' + (f.rot || 0) + ')', 'data-id': f.id, class: 'iga-furn' + (f.id === selId ? ' iga-sel' : '') }, world);
        if (f.kind === 'turn') { el('circle', { r: f.w / 2, class: 'iga-turn' }, g); return; }
        if (f.kind === 'plant' || f.kind === 'sink') el('ellipse', { rx: f.w / 2, ry: f.d / 2, class: 'iga-fshape' }, g);
        else el('rect', { x: -f.w / 2, y: -f.d / 2, width: f.w, height: f.d, rx: f.kind === 'bathtub' ? 0.2 : 0.03, class: 'iga-fshape' }, g);
        if (f.kind === 'bed' || f.kind === 'bed2') el('rect', { x: -f.w / 2 + 0.08, y: -f.d / 2 + 0.08, width: f.w - 0.16, height: 0.3, rx: 0.05, class: 'iga-fdetail' }, g);
        if (f.kind === 'toilet') el('ellipse', { cx: 0, cy: 0.08, rx: 0.16, ry: 0.22, class: 'iga-fdetail' }, g);
        if (f.kind === 'sofa') el('rect', { x: -f.w / 2, y: -f.d / 2, width: f.w, height: 0.2, class: 'iga-fdetail' }, g);
      });
      S.walls.forEach(function (w) {
        var L = len(w), ang = Math.atan2(w.b[1] - w.a[1], w.b[0] - w.a[0]) * 180 / Math.PI, T = w.t || S.wallT;
        var g = el('g', { transform: 'translate(' + w.a[0] + ',' + w.a[1] + ') rotate(' + ang + ')', 'data-id': w.id, class: 'iga-wall' + (w.id === selId ? ' iga-sel' : '') }, world);
        el('rect', { x: -T / 2, y: -T / 2, width: L + T, height: T, class: 'iga-wallrect' }, g);
        S.openings.filter(function (o) { return o.wall === w.id; }).forEach(function (o) {
          var og = el('g', { 'data-id': o.id, class: 'iga-open' + (o.id === selId ? ' iga-sel' : '') }, g);
          el('rect', { x: o.pos - o.w / 2, y: -T / 2 - 0.005, width: o.w, height: T + 0.01, class: 'iga-gap' }, og);
          if (o.kind === 'window') { el('line', { x1: o.pos - o.w / 2, y1: -0.02, x2: o.pos + o.w / 2, y2: -0.02, class: 'iga-glass' }, og); el('line', { x1: o.pos - o.w / 2, y1: 0.02, x2: o.pos + o.w / 2, y2: 0.02, class: 'iga-glass' }, og); }
          else {
            var s = o.flip ? -1 : 1, x0 = o.pos - o.w / 2;
            el('line', { x1: x0, y1: 0, x2: x0, y2: s * o.w, class: 'iga-leaf' }, og);
            el('path', { d: 'M' + x0 + ',' + (s * o.w) + ' A' + o.w + ',' + o.w + ' 0 0,' + (s > 0 ? 0 : 1) + ' ' + (x0 + o.w) + ',0', class: 'iga-swing' }, og);
          }
        });
      });
      drawOverlay();
      ctx.setSummary(summary());
    }
    /* Capa en píxeles: textos, cotas, cursor y asas; así el texto no se deforma con el zoom. */
    function drawOverlay() {
      while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
      function P(x, y) { return view.toScreen(x, y); }
      function text(x, y, s, cls, rot) { var p = P(x, y), e = el('text', { x: p.x, y: p.y, class: cls, transform: rot ? 'rotate(' + rot + ' ' + p.x + ' ' + p.y + ')' : null }, overlay); e.textContent = s; return e; }
      S.rooms.forEach(function (r) { if (r.w * view.scale < 40) return; text(r.x + r.w / 2, r.y + r.h / 2 - 0.05, r.name, 'iga-label'); text(r.x + r.w / 2, r.y + r.h / 2 + 12 / view.scale, m2(r.w * r.h), 'iga-area'); });
      if (dims) S.walls.forEach(function (w) {
        var L = len(w); if (L * view.scale < 36) return;
        var ang = Math.atan2(w.b[1] - w.a[1], w.b[0] - w.a[0]), nx = -Math.sin(ang), ny = Math.cos(ang), off = (w.t || S.wallT) / 2 + 12 / view.scale;
        var deg = ang * 180 / Math.PI; if (deg > 90 || deg <= -90) deg += 180;
        text((w.a[0] + w.b[0]) / 2 - nx * off, (w.a[1] + w.b[1]) / 2 - ny * off, IG.num(L, 2), 'iga-dim', deg);
      });
      var s = byId(selId);
      if (s && kindOf(s.id) === 'wall') [s.a, s.b].forEach(function (p) { var q = P(p[0], p[1]); el('circle', { cx: q.x, cy: q.y, r: 7, class: 'iga-handle' }, overlay); });
      if (pending) {
        var a = P(pending[0], pending[1]), c = P(kc.x, kc.y);
        if (tool === 'room') el('rect', { x: Math.min(a.x, c.x), y: Math.min(a.y, c.y), width: Math.abs(c.x - a.x), height: Math.abs(c.y - a.y), class: 'iga-rubber' }, overlay);
        else el('line', { x1: a.x, y1: a.y, x2: c.x, y2: c.y, class: 'iga-rubber' }, overlay);
        text((pending[0] + kc.x) / 2, (pending[1] + kc.y) / 2 - 10 / view.scale, tool === 'room' ? IG.num(Math.abs(kc.x - pending[0]), 2) + ' × ' + IG.num(Math.abs(kc.y - pending[1]), 2) + ' m' : m(Math.hypot(kc.x - pending[0], kc.y - pending[1])), 'iga-dim iga-live');
      }
      var cc = P(kc.x, kc.y);
      el('path', { d: 'M' + (cc.x - 9) + ',' + cc.y + 'h18M' + cc.x + ',' + (cc.y - 9) + 'v18', class: 'iga-cursor' + (cursorVisible ? '' : ' iga-cursor-dim') }, overlay);
      if (walkMode) { var wp = P(walk.x, walk.z); el('circle', { cx: wp.x, cy: wp.y, r: 6, class: 'iga-walker' }, overlay); el('line', { x1: wp.x, y1: wp.y, x2: wp.x + Math.cos(walk.yaw) * 18, y2: wp.y + Math.sin(walk.yaw) * 18, class: 'iga-walker-dir' }, overlay); }
    }
    function summary() {
      if (!S.walls.length && !S.rooms.length) return t('emptyPlan');
      var area = S.rooms.reduce(function (a, r) { return a + r.w * r.h; }, 0);
      return t('summary', { rooms: S.rooms.length, area: m2(area), walls: S.walls.length, doors: S.openings.filter(function (o) { return o.kind === 'door'; }).length, windows: S.openings.filter(function (o) { return o.kind === 'window'; }).length, furn: S.furniture.length }) +
        (S.rooms.length ? ' ' + S.rooms.map(function (r) { return r.name + ' ' + m2(r.w * r.h); }).join(', ') + '.' : '');
    }

    /* ---------- Puntero ---------- */
    var kc = { x: 1, y: 1 }, pending = null, drag = null, cursorVisible = false;
    function worldFromEvent(e) { var r = svg.getBoundingClientRect(); return view.toWorld(e.clientX - r.left, e.clientY - r.top); }
    svg.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var p = worldFromEvent(e), sx = snap(p.x), sy = snap(p.y); kc.x = sx; kc.y = sy; cursorVisible = false;
      var target = e.target.closest && e.target.closest('[data-id]'), id = target ? target.getAttribute('data-id') : null;
      if (tool === 'select') {
        var s = byId(selId);
        if (s && kindOf(s.id) === 'wall') { var ea = Math.hypot(p.x - s.a[0], p.y - s.a[1]) * view.scale, eb = Math.hypot(p.x - s.b[0], p.y - s.b[1]) * view.scale; if (ea < 12 || eb < 12) { drag = { id: s.id, end: ea < eb ? 'a' : 'b', start: [sx, sy], orig: JSON.stringify(s) }; svg.setPointerCapture(e.pointerId); return; } }
        select(id);
        if (id) { var o = byId(id); drag = { id: id, start: [sx, sy], orig: JSON.stringify(o) }; svg.setPointerCapture(e.pointerId); }
        return;
      }
      if (tool === 'erase') { if (id) removeById(id); return; }
      act(sx, sy);
    });
    svg.addEventListener('pointermove', function (e) {
      var p = worldFromEvent(e); kc.x = snap(p.x); kc.y = snap(p.y);
      if (drag) {
        var o = byId(drag.id), orig = JSON.parse(drag.orig), dx = kc.x - drag.start[0], dy = kc.y - drag.start[1], k = kindOf(drag.id);
        if (k === 'wall') { if (drag.end) o[drag.end] = [r2(orig[drag.end][0] + dx), r2(orig[drag.end][1] + dy)]; else { o.a = [r2(orig.a[0] + dx), r2(orig.a[1] + dy)]; o.b = [r2(orig.b[0] + dx), r2(orig.b[1] + dy)]; } }
        else if (k === 'room' || k === 'furniture') { o.x = r2(orig.x + dx); o.y = r2(orig.y + dy); }
        else if (k === 'opening') { var w = byId(o.wall); if (w) { var along = distToWall(w, kc.x, kc.y).along; o.pos = r2(Math.max(o.w / 2, Math.min(len(w) - o.w / 2, snap(along)))); } }
        render(); schedule3d(); return;
      }
      if (pending) drawOverlay();
    });
    function endDrag() { if (!drag) return; var o = byId(drag.id), moved = o && JSON.stringify(o) !== drag.orig; drag = null; if (moved) { commit(t('moved')); } }
    svg.addEventListener('pointerup', endDrag); svg.addEventListener('pointercancel', endDrag);
    svg.addEventListener('dblclick', function () { if (tool === 'wall' && pending) { pending = null; drawOverlay(); ctx.announce(t('wallChainEnd')); } });

    /* Acción de la herramienta en un punto (ratón o Intro del cursor de teclado). */
    function act(x, y) {
      if (tool === 'room' || tool === 'wall') {
        if (!pending) { pending = [x, y]; drawOverlay(); ctx.announce(t(tool === 'room' ? 'roomStart' : 'wallStart', { x: IG.num(x, 1), y: IG.num(y, 1) })); return; }
        if (tool === 'room') {
          var w = Math.abs(x - pending[0]), hh = Math.abs(y - pending[1]);
          if (w < 0.5 || hh < 0.5) { ctx.announce(t('roomTooSmall')); return; }
          var r = addRoom(Math.min(x, pending[0]), Math.min(y, pending[1]), w, hh, roomType, null); pending = null; selId = r.id; commit(t('roomAdded', { name: r.name, a: m2(r.w * r.h) }));
        } else {
          if (Math.hypot(x - pending[0], y - pending[1]) < 0.1) { pending = null; drawOverlay(); ctx.announce(t('wallChainEnd')); return; }
          var nw = { id: nid('w'), a: pending.slice(), b: [x, y], t: S.wallT, h: S.wallH }; S.walls.push(nw); pending = [x, y]; selId = nw.id; commit(t('wallAdded', { l: m(len(nw)) }));
        }
        return;
      }
      if (tool === 'door' || tool === 'window') { var o = addOpening(tool, x, y); if (o) { selId = o.id; commit(t(tool === 'door' ? 'doorAdded' : 'windowAdded')); } return; }
      if (tool === 'furniture') {
        var sz = FURN[furnKind], f = { id: nid('f'), kind: furnKind, x: x, y: y, w: sz[0], d: sz[1], h: sz[2], rot: 0 };
        S.furniture.push(f); selId = f.id; commit(t('furnAdded', { name: t('furn_' + furnKind) })); return;
      }
    }
    function select(id) {
      selId = id && byId(id) ? id : null; render(); build3d(); renderSide();
      if (selId) ctx.announce(t('selected', { what: describe(byId(selId)) }));
    }
    function removeById(id) {
      var k = kindOf(id); if (!k) return;
      var o = byId(id), label = describe(o);
      if (k === 'wall') { S.walls = S.walls.filter(function (w) { return w.id !== id; }); S.openings = S.openings.filter(function (x) { return x.wall !== id; }); }
      else if (k === 'opening') S.openings = S.openings.filter(function (x) { return x.id !== id; });
      else if (k === 'room') S.rooms = S.rooms.filter(function (x) { return x.id !== id; });
      else S.furniture = S.furniture.filter(function (x) { return x.id !== id; });
      if (selId === id) selId = null;
      commit(t('deleted', { what: label }));
    }
    function commit(label) { render(); build3d(); ctx.commit(label); renderSide(); if (label) ctx.announce(label); }

    /* ---------- Teclado en la planta ---------- */
    function onKey(e) {
      if (!ctx.viewport.contains(e.target) || view3d.contains(e.target)) return false;
      var k = e.key, st = e.shiftKey ? 1 : GRID, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[k];
      var s = byId(selId);
      if (d && tool === 'select' && s) {
        var kk = kindOf(s.id);
        if (kk === 'wall') { s.a = [r2(s.a[0] + d[0]), r2(s.a[1] + d[1])]; s.b = [r2(s.b[0] + d[0]), r2(s.b[1] + d[1])]; }
        else if (kk === 'opening') { var w = byId(s.wall); s.pos = r2(Math.max(s.w / 2, Math.min(len(w) - s.w / 2, s.pos + (d[0] || d[1])))); }
        else { s.x = r2(s.x + d[0]); s.y = r2(s.y + d[1]); }
        render(); schedule3d(); clearTimeout(keyCommit); keyCommit = setTimeout(function () { ctx.commit(t('moved')); renderSide(); }, 400);
        ctx.announce(t('selected', { what: describe(s) })); return true;
      }
      if (d) {
        kc.x = r2(kc.x + d[0]); kc.y = r2(kc.y + d[1]); cursorVisible = true; drawOverlay();
        var hit = hitAt(kc.x, kc.y);
        ctx.announce(t('cursorAt', { x: IG.num(kc.x, 1), y: IG.num(kc.y, 1) }) + (hit ? ' · ' + describe(hit) : '') + (pending ? ' · ' + t(tool === 'room' ? 'pendingRoom' : 'pendingWall', { l: tool === 'room' ? IG.num(Math.abs(kc.x - pending[0]), 1) + ' × ' + IG.num(Math.abs(kc.y - pending[1]), 1) + ' m' : m(Math.hypot(kc.x - pending[0], kc.y - pending[1])) }) : ''));
        return true;
      }
      if (k === 'Enter' || k === ' ') {
        if (tool === 'select') { var hit2 = hitAt(kc.x, kc.y); select(hit2 ? hit2.id : null); if (!hit2) ctx.announce(t('nothingHere')); return true; }
        if (tool === 'erase') { var h3 = hitAt(kc.x, kc.y); if (h3) removeById(h3.id); else ctx.announce(t('nothingHere')); return true; }
        act(kc.x, kc.y); return true;
      }
      if (k === 'Escape') { if (pending) { pending = null; drawOverlay(); ctx.announce(t('cancelled')); return true; } if (selId) { select(null); ctx.announce(t('deselected')); return true; } return false; }
      if ((k === 'Delete' || k === 'Backspace') && selId) { removeById(selId); return true; }
      if ((k === 'r' || k === 'R') && s && kindOf(s.id) === 'furniture') { s.rot = ((s.rot || 0) + (e.shiftKey ? -90 : 90) + 360) % 360; commit(t('rotated')); return true; }
      return false;
    }
    var keyCommit = 0;
    function hitAt(x, y) {
      var o = null;
      S.openings.forEach(function (op) { var w = byId(op.wall); if (!w) return; var r = distToWall(w, x, y); if (r.d < 0.3 && Math.abs(r.along - op.pos) <= op.w / 2) o = op; }); if (o) return o;
      S.furniture.forEach(function (f) { if (Math.abs(x - f.x) <= Math.max(f.w, f.d) / 2 && Math.abs(y - f.y) <= Math.max(f.w, f.d) / 2) o = f; }); if (o) return o;
      var nw = nearestWall(x, y, 0.15); if (nw) return nw.w;
      S.rooms.forEach(function (r) { if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) o = r; }); return o;
    }

    /* ---------- Revisión: luz natural y accesibilidad (orientativa) ---------- */
    function roomWindows(r) {
      var area = 0;
      S.openings.forEach(function (o) {
        if (o.kind !== 'window') return; var w = byId(o.wall); if (!w) return;
        var ang = Math.atan2(w.b[1] - w.a[1], w.b[0] - w.a[0]), px = w.a[0] + Math.cos(ang) * o.pos, py = w.a[1] + Math.sin(ang) * o.pos, e = 0.1;
        var onEdge = (px >= r.x - e && px <= r.x + r.w + e && py >= r.y - e && py <= r.y + r.h + e) && (Math.abs(px - r.x) < e || Math.abs(px - r.x - r.w) < e || Math.abs(py - r.y) < e || Math.abs(py - r.y - r.h) < e);
        if (onEdge) area += o.w * o.hgt;
      });
      return area;
    }
    function review() {
      var items = [];
      S.rooms.forEach(function (r) {
        if (r.type === 'corridor') { var wd = Math.min(r.w, r.h); items.push({ ok: wd >= 1.2, text: t(wd >= 1.2 ? 'revCorrOk' : 'revCorrBad', { name: r.name, w: m(wd) }) }); return; }
        var a = r.w * r.h, wa = roomWindows(r), need = a / 10;
        if (r.type !== 'bath') items.push({ ok: wa >= need, text: t(wa >= need ? 'revLightOk' : 'revLightBad', { name: r.name, wa: m2(wa), need: m2(need) }) });
        var turn = Math.min(r.w, r.h) >= 1.5;
        items.push({ ok: turn, text: t(turn ? 'revTurnOk' : 'revTurnBad', { name: r.name }) });
      });
      S.openings.forEach(function (o) {
        if (o.kind !== 'door') return;
        var clear = o.w - 0.1; /* hoja y marco restan unos 10 cm al paso libre */
        items.push({ ok: clear >= 0.8, text: t(clear >= 0.8 ? 'revDoorOk' : 'revDoorBad', { w: m(o.w), c: m(clear) }) });
      });
      return items;
    }

    /* ---------- Paneles ---------- */
    var roomType = 'bedroom';
    function renderSide() {
      var ul = h('ul', { class: 'igs-list' });
      function item(o, label, small, color) {
        var b = h('button', { type: 'button', 'aria-current': String(o.id === selId) }, h('span', { class: 'igs-swatch', style: 'background:' + color }), h('span', { text: label }), h('small', { text: small }));
        b.addEventListener('click', function () { select(o.id); }); ul.appendChild(h('li', null, b));
      }
      S.rooms.forEach(function (r) { item(r, r.name, m2(r.w * r.h), ROOM_TYPES[r.type]); });
      S.walls.forEach(function (w, i) { item(w, t('wallN', { n: i + 1 }), m(len(w)), '#6b6b6b'); });
      S.openings.forEach(function (o) { item(o, t(o.kind === 'door' ? 'door' : 'window'), m(o.w), o.kind === 'door' ? '#a9855a' : '#9ec9e8'); });
      S.furniture.forEach(function (f) { item(f, t('furn_' + f.kind), IG.num(f.w, 2) + ' × ' + IG.num(f.d, 2), FURN_COLORS[f.kind]); });
      ctx.setStructure([h('h3', { text: t('elements') }), ul]);

      var out = [], s = byId(selId), k = kindOf(selId);
      if (s) {
        out.push(h('h4', { text: describe(s) }));
        if (k === 'room') {
          out.push(F.text(t('name'), s.name, { max: 30, onChange: function (v) { s.name = String(v).trim().slice(0, 30) || s.name; commit(t('renamed')); } }));
          out.push(F.select(t('roomTypeLabel'), s.type, Object.keys(ROOM_TYPES).map(function (x) { return [x, t('roomType_' + x)]; }), { onChange: function (v) { s.type = v; commit(t('changed')); } }));
          out.push(F.number('x', s.x, { unit: 'm', min: -100, max: 100, step: 0.1, onChange: function (v) { s.x = r2(v); commit(t('moved')); } }));
          out.push(F.number('y', s.y, { unit: 'm', min: -100, max: 100, step: 0.1, onChange: function (v) { s.y = r2(v); commit(t('moved')); } }));
          out.push(F.number(t('width'), s.w, { unit: 'm', min: 0.5, max: 40, step: 0.1, onChange: function (v) { s.w = r2(v); commit(t('changed')); } }));
          out.push(F.number(t('depth'), s.h, { unit: 'm', min: 0.5, max: 40, step: 0.1, onChange: function (v) { s.h = r2(v); commit(t('changed')); } }));
          out.push(h('p', { class: 'igs-muted', text: t('roomWallsNote') }));
        } else if (k === 'wall') {
          out.push(F.number(t('length'), r2(len(s)), { unit: 'm', min: 0.1, max: 60, step: 0.1, onChange: function (v) { var L = len(s) || 1, ux = (s.b[0] - s.a[0]) / L, uy = (s.b[1] - s.a[1]) / L; s.b = [r2(s.a[0] + ux * v), r2(s.a[1] + uy * v)]; commit(t('changed')); } }));
          [['a', t('wallStartPt')], ['b', t('wallEndPt')]].forEach(function (pt) { [0, 1].forEach(function (ax) { out.push(F.number(pt[1] + ' · ' + (ax ? 'y' : 'x'), s[pt[0]][ax], { unit: 'm', min: -100, max: 100, step: 0.1, onChange: function (v) { s[pt[0]][ax] = r2(v); commit(t('moved')); } })); }); });
          out.push(F.number(t('thickness'), Math.round(s.t * 100), { unit: 'cm', min: 5, max: 60, step: 1, onChange: function (v) { s.t = v / 100; commit(t('changed')); } }));
          out.push(F.number(t('height'), s.h, { unit: 'm', min: 0.5, max: 8, step: 0.1, onChange: function (v) { s.h = v; commit(t('changed')); } }));
        } else if (k === 'opening') {
          out.push(F.number(t('width'), s.w, { unit: 'm', min: 0.4, max: 4, step: 0.05, onChange: function (v) { s.w = v; commit(t('changed')); } }));
          out.push(F.number(t('height'), s.hgt, { unit: 'm', min: 0.3, max: 3, step: 0.05, onChange: function (v) { s.hgt = v; commit(t('changed')); } }));
          if (s.kind === 'window') out.push(F.number(t('sill'), s.sill, { unit: 'm', min: 0, max: 2.5, step: 0.05, onChange: function (v) { s.sill = v; commit(t('changed')); } }));
          else out.push(F.check(t('flipDoor'), !!s.flip, { onChange: function (v) { s.flip = !!v; commit(t('changed')); } }));
          out.push(F.number(t('fromStart'), s.pos, { unit: 'm', min: 0, max: 60, step: 0.1, onChange: function (v) { var w = byId(s.wall); s.pos = r2(Math.max(s.w / 2, Math.min(len(w) - s.w / 2, v))); commit(t('moved')); } }));
        } else if (k === 'furniture') {
          out.push(F.number('x', s.x, { unit: 'm', min: -100, max: 100, step: 0.1, onChange: function (v) { s.x = r2(v); commit(t('moved')); } }));
          out.push(F.number('y', s.y, { unit: 'm', min: -100, max: 100, step: 0.1, onChange: function (v) { s.y = r2(v); commit(t('moved')); } }));
          out.push(F.number(t('width'), s.w, { unit: 'm', min: 0.1, max: 6, step: 0.05, onChange: function (v) { s.w = v; if (s.kind === 'turn') s.d = v; commit(t('changed')); } }));
          if (s.kind !== 'turn') {
            out.push(F.number(t('depth'), s.d, { unit: 'm', min: 0.1, max: 6, step: 0.05, onChange: function (v) { s.d = v; commit(t('changed')); } }));
            out.push(F.number(t('height'), s.h, { unit: 'm', min: 0.02, max: 3, step: 0.05, onChange: function (v) { s.h = v; commit(t('changed')); } }));
            out.push(F.choice(t('rotation'), String(s.rot || 0), [['0', '0°'], ['90', '90°'], ['180', '180°'], ['270', '270°']], { onChange: function (v) { s.rot = +v; commit(t('rotated')); } }));
          }
        }
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', onClick: function () { removeById(s.id); } })));
      } else {
        out.push(h('h4', { text: t('planSettings') }));
        out.push(F.select(t('newRoomType'), roomType, Object.keys(ROOM_TYPES).map(function (x) { return [x, t('roomType_' + x)]; }), { onChange: function (v) { roomType = v; } }));
        out.push(F.number(t('wallHeight'), S.wallH, { unit: 'm', min: 2, max: 6, step: 0.1, onChange: function (v) { S.wallH = v; S.walls.forEach(function (w) { w.h = v; }); commit(t('changed')); } }));
        out.push(F.check(t('showDims'), dims, { onChange: function (v) { dims = !!v; drawOverlay(); } }));
        out.push(F.number(t('eyeHeight'), eyeH, { unit: 'm', min: 0.8, max: 2, step: 0.05, onChange: function (v) { eyeH = v; if (walkMode) placeWalk(); } }));
      }
      out.push(h('h4', { text: t('reviewTitle') }));
      var rv = review();
      if (!rv.length) out.push(h('p', { class: 'igs-muted', text: t('reviewEmpty') }));
      else {
        var bad = rv.filter(function (x) { return !x.ok; }).length;
        out.push(h('p', { class: 'igs-result', 'data-kind': bad ? 'bad' : 'ok' }, h('strong', { text: bad ? t('reviewBad', { n: bad }) : t('reviewOk') })));
        var ul2 = h('ul', { class: 'iga-review' });
        rv.forEach(function (x) { ul2.appendChild(h('li', { 'data-ok': String(x.ok) }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: x.ok ? '✓' : '!' }), h('span', { class: 'igs-sr', text: x.ok ? t('okWord') + ': ' : t('checkWord') + ': ' }), x.text)); });
        out.push(ul2);
      }
      out.push(h('p', { class: 'igs-muted', text: t('reviewNote') }));
      ctx.setInspector(out);
    }

    /* ---------- Herramientas ---------- */
    var furnSel = h('select', { class: 'igs-shape-select', 'aria-label': t('furnLabel') });
    Object.keys(FURN).forEach(function (k) { furnSel.appendChild(h('option', { value: k, text: t('furn_' + k) })); });
    furnSel.addEventListener('change', function () { furnKind = furnSel.value; ctx.selectTool('furniture'); });
    var viewSel = h('select', { 'aria-label': t('viewLabel') }, h('option', { value: 'both', text: t('viewBoth') }), h('option', { value: 'plan', text: t('viewPlan') }), h('option', { value: '3d', text: t('view3d') }));
    viewSel.value = split.dataset.show;
    viewSel.addEventListener('change', function () { split.dataset.show = viewSel.value; if (loop) setTimeout(loop.resize, 30); ctx.announce(viewSel.options[viewSel.selectedIndex].text); });
    ctx.setTools([
      { id: 'select', label: t('toolSelect'), icon: 'select' },
      { id: 'room', label: t('toolRoom'), icon: 'square' },
      { id: 'wall', label: t('toolWall'), icon: 'wall' },
      { id: 'door', label: t('toolDoor'), icon: 'door' },
      { id: 'window', label: t('toolWindow'), icon: 'window' },
      { id: 'furniture', label: t('toolFurn'), icon: 'box' },
      { node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('furnLabel') }), furnSel) },
      { id: 'erase', label: t('toolErase'), icon: 'erase', level: 'more' },
      { id: 'pan', label: t('toolPan'), icon: 'pan', level: 'more' },
      { separator: true },
      { node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('viewLabel') }), viewSel) },
      { id: 'walk', label: t('walkBtn'), icon: 'player', action: function (b) { setWalk(!walkMode); b.setAttribute('aria-pressed', String(walkMode)); if (walkMode && split.dataset.show === 'plan') { split.dataset.show = 'both'; viewSel.value = 'both'; setTimeout(function () { loop.resize(); }, 30); } } },
      { id: 'fit', label: t('fitBtn'), icon: 'fit', level: 'more', action: function () { fitPlan(); frame3d(); } }
    ], { initial: 'select' });
    function fitPlan() { var b = bounds(); view.fit({ minX: b.minX - 1, minY: b.minY - 1, maxX: b.maxX + 1, maxY: b.maxY + 1 }, planBox.clientWidth, planBox.clientHeight, 16); }
    if (root.ResizeObserver) new ResizeObserver(function () { drawOverlay(); }).observe(planBox);

    /* ---------- Exportaciones ---------- */
    function planSVG(forExport) {
      var b = bounds(), pad = 1, W = b.maxX - b.minX + 2 * pad, H = b.maxY - b.minY + 2 * pad + 0.8;
      var clone = world.cloneNode(true); clone.removeAttribute('transform'); var grid = clone.querySelector('.iga-grid'); if (grid) grid.remove();
      Array.prototype.forEach.call(clone.querySelectorAll('.iga-sel'), function (n) { n.classList.remove('iga-sel'); });
      var css = '.iga-room{stroke:none}.iga-wallrect{fill:#2b2f36}.iga-gap{fill:#fff}.iga-glass{stroke:#1f5f8b;stroke-width:.02}.iga-leaf{stroke:#2b2f36;stroke-width:.03}.iga-swing{fill:none;stroke:#2b2f36;stroke-width:.01;stroke-dasharray:.06 .04}.iga-fshape{fill:#fff;stroke:#44586c;stroke-width:.015}.iga-fdetail{fill:none;stroke:#44586c;stroke-width:.01}.iga-turn{fill:rgba(46,125,50,.12);stroke:#2e7d32;stroke-width:.015;stroke-dasharray:.05 .04}text{font-family:system-ui,Arial,sans-serif;fill:#172b42}';
      var out = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (W * 20).toFixed(1) + 'mm" height="' + (H * 20).toFixed(1) + 'mm" viewBox="' + (b.minX - pad) + ' ' + (b.minY - pad) + ' ' + W + ' ' + H + '">' +
        '<title>' + esc(t('planTitle')) + '</title><style>' + css + '</style><rect x="' + (b.minX - pad) + '" y="' + (b.minY - pad) + '" width="' + W + '" height="' + H + '" fill="#fff"/>' + clone.innerHTML;
      S.rooms.forEach(function (r) { out += '<text x="' + (r.x + r.w / 2) + '" y="' + (r.y + r.h / 2) + '" font-size=".22" text-anchor="middle">' + esc(r.name) + '</text><text x="' + (r.x + r.w / 2) + '" y="' + (r.y + r.h / 2 + 0.28) + '" font-size=".18" text-anchor="middle">' + esc(m2(r.w * r.h)) + '</text>'; });
      S.walls.forEach(function (w) { var L = len(w); if (L < 0.4) return; var ang = Math.atan2(w.b[1] - w.a[1], w.b[0] - w.a[0]), nx = -Math.sin(ang), ny = Math.cos(ang), off = (w.t || S.wallT) / 2 + 0.2, deg = ang * 180 / Math.PI; if (deg > 90 || deg <= -90) deg += 180; var x = (w.a[0] + w.b[0]) / 2 - nx * off, y = (w.a[1] + w.b[1]) / 2 - ny * off; out += '<text x="' + x + '" y="' + y + '" font-size=".16" text-anchor="middle" dominant-baseline="middle" transform="rotate(' + deg + ' ' + x + ' ' + y + ')">' + IG.num(L, 2) + '</text>'; });
      /* barra de escala de 1 m y crédito */
      var sy = b.maxY + pad + 0.3, sx = b.minX - pad + 0.3;
      out += '<rect x="' + sx + '" y="' + sy + '" width="1" height=".06" fill="#172b42"/><text x="' + (sx + 1.1) + '" y="' + (sy + 0.06) + '" font-size=".16">1 m · ' + esc(t('scaleNote')) + '</text>';
      if (forExport) out += '<text x="' + (b.maxX + pad - 0.2) + '" y="' + (sy + 0.06) + '" font-size=".14" text-anchor="end">IRIS GREEN · irisgreen.eu</text>';
      out += '</svg>';
      return out;
    }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    var base = function () { return (LANG === 'en' ? 'plan-' : 'plano-') + ctx.stamp(); };
    ctx.addExport(t('exportSvg'), function () { ctx.download(new Blob([planSVG(true)], { type: 'image/svg+xml' }), base() + '.svg'); });
    ctx.addExport(t('exportPngPlan'), function () {
      var svgText = planSVG(false), img = new Image(), url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));
      img.onload = function () {
        var b = bounds(), W = b.maxX - b.minX + 2, H = b.maxY - b.minY + 2.8, sc = Math.min(100, 2400 / Math.max(W, H)), c = D.createElement('canvas');
        c.width = Math.round(W * sc); c.height = Math.round(H * sc); var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        ctx.canvasBlob(ctx.canvasWithCredit(c, '#ffffff')).then(function (bl) { ctx.download(bl, base() + '.png'); });
      };
      img.onerror = function () { URL.revokeObjectURL(url); ctx.announce(t('exportError')); };
      img.src = url;
    });
    function meshes() { var list = []; if (group3d) { group3d.updateMatrixWorld(true); group3d.traverse(function (o) { if (o.isMesh) list.push(o); }); } return list; }
    ctx.addExport(t('exportGlb'), function () { if (!group3d) return; T3.exportGLB(THREE, ctx, meshes(), (LANG === 'en' ? 'building-' : 'edificio-') + ctx.stamp()).catch(function () { ctx.announce(t('exportError')); }); });
    ctx.addExport(t('exportObj'), function () { if (!group3d) return; T3.exportOBJ(THREE, ctx, meshes(), (LANG === 'en' ? 'building-' : 'edificio-') + ctx.stamp()); });
    ctx.addExport(t('exportPng3d'), function () { if (!renderer) return; renderer.render(scene, camera); ctx.canvasBlob(ctx.canvasWithCredit(renderer.domElement, '#eef3f8')).then(function (bl) { ctx.download(bl, (LANG === 'en' ? 'view-3d-' : 'vista-3d-') + ctx.stamp() + '.png'); }); });
    ctx.command('room', t('toolRoom'), '', function () { ctx.selectTool('room'); }); ctx.command('walk', t('walkBtn'), '', function () { setWalk(!walkMode); });

    /* ---------- Ejemplos ---------- */
    function ex(id) {
      S = empty(); seq = 0; selId = null; pending = null;
      function door(wallMatch, pos, w, flip) { var wl = S.walls.filter(wallMatch)[0]; if (wl) S.openings.push({ id: nid('d'), wall: wl.id, kind: 'door', pos: pos, w: w || 0.9, sill: 0, hgt: 2.1, flip: !!flip }); }
      function win(wallMatch, pos, w, sill, hh) { var wl = S.walls.filter(wallMatch)[0]; if (wl) S.openings.push({ id: nid('v'), wall: wl.id, kind: 'window', pos: pos, w: w || 1.2, sill: sill == null ? 0.9 : sill, hgt: hh || 1.2, flip: false }); }
      function horiz(y, x0, x1) { return function (w) { return Math.abs(w.a[1] - y) < 1e-6 && Math.abs(w.b[1] - y) < 1e-6 && Math.min(w.a[0], w.b[0]) <= x0 + 1e-6 && Math.max(w.a[0], w.b[0]) >= x1 - 1e-6; }; }
      function vert(x, y0, y1) { return function (w) { return Math.abs(w.a[0] - x) < 1e-6 && Math.abs(w.b[0] - x) < 1e-6 && Math.min(w.a[1], w.b[1]) <= y0 + 1e-6 && Math.max(w.a[1], w.b[1]) >= y1 - 1e-6; }; }
      function fur(kind, x, y, rot) { var sz = FURN[kind]; S.furniture.push({ id: nid('f'), kind: kind, x: x, y: y, w: sz[0], d: sz[1], h: sz[2], rot: rot || 0 }); }
      function along(pred, x, y) { var w = S.walls.filter(pred)[0]; return w ? r2(distToWall(w, x, y).along) : 1; }
      if (id === 'room') {
        addRoom(0, 0, 4, 3.5, 'bedroom', t('exMyRoom'));
        door(horiz(3.5, 0.2, 1.2), along(horiz(3.5, 0.2, 1.2), 0.7, 3.5), 0.9, true);
        win(horiz(0, 1.5, 3), along(horiz(0, 1.5, 3), 2.2, 0), 1.4);
        fur('bed', 3.45, 1.1, 0); fur('desk', 1.0, 0.4, 0); fur('chair', 1.0, 0.95, 180); fur('wardrobe', 3.4, 3.1, 180); fur('plant', 0.35, 1.6);
      } else if (id === 'house' || id === 'light') {
        addRoom(0, 0, 5, 4, 'living', t('exLiving')); addRoom(5, 0, 3.5, 4, 'bedroom', t('exBed1'));
        addRoom(0, 4, 3, 3, 'kitchen', t('exKitchen')); addRoom(3, 4, 2.5, 3, 'bath', t('exBath')); addRoom(5.5, 4, 3, 3, 'bedroom', t('exBed2'));
        var big = id === 'light';
        win(horiz(0, 0, 5), along(horiz(0, 0, 5), 2.5, 0), big ? 2.4 : 1.2, big ? 0.4 : 0.9, big ? 1.8 : 1.2);
        win(horiz(0, 5, 8.5), along(horiz(0, 5, 8.5), 6.75, 0), big ? 1.6 : 1.0);
        win(horiz(7, 0, 3), along(horiz(7, 0, 3), 1.5, 7), 1.0);
        win(horiz(7, 5.5, 8.5), along(horiz(7, 5.5, 8.5), 7, 7), big ? 1.4 : 0.8, 0.9, big ? 1.3 : 1.0);
        win(horiz(7, 3, 5.5), along(horiz(7, 3, 5.5), 4.25, 7), 0.6, 1.5, 0.5);
        door(vert(0, 1, 2), along(vert(0, 1, 2), 0, 1.5), 0.9);
        door(vert(5, 1, 2), along(vert(5, 1, 2), 5, 1.5), 0.8, true);
        door(horiz(4, 1, 2), along(horiz(4, 1, 2), 1.5, 4), 0.8);
        door(horiz(4, 3.5, 4.5), along(horiz(4, 3.5, 4.5), 4.2, 4), 0.7, true);
        door(horiz(4, 6, 7), along(horiz(4, 6, 7), 6.5, 4), 0.8);
        fur('sofa', 2.5, 3.4, 180); fur('table', 1.3, 1.3); fur('bed2', 7.5, 1.2); fur('wardrobe', 5.6, 3.6, 90);
        fur('counter', 1.5, 6.6, 180); fur('toilet', 3.35, 6.55, 180); fur('shower', 5.0, 6.5); fur('sink', 4.2, 4.35);
        fur('bed', 7.9, 5.6); fur('desk', 6.2, 6.6, 180);
      } else if (id === 'accessible') {
        addRoom(0, 0, 5, 4.5, 'living', t('exLiving')); addRoom(5, 0, 1.3, 7.5, 'corridor', t('exCorridor'));
        addRoom(6.3, 0, 3.7, 3.5, 'bedroom', t('exBed1')); addRoom(6.3, 3.5, 3.7, 4, 'bath', t('exBathAcc')); addRoom(0, 4.5, 5, 3, 'kitchen', t('exKitchen'));
        win(horiz(0, 0, 5), along(horiz(0, 0, 5), 2.5, 0), 2.2, 0.6, 1.5); win(horiz(0, 6.3, 10), along(horiz(0, 6.3, 10), 8.1, 0), 1.6);
        win(horiz(7.5, 0, 5), along(horiz(7.5, 0, 5), 2.5, 7.5), 1.4); win(vert(10, 4, 6), along(vert(10, 4, 6), 10, 5.5), 0.8, 1.2, 0.8);
        door(horiz(7.5, 5.2, 6.1), along(horiz(7.5, 5.2, 6.1), 5.65, 7.5), 1.0);
        door(vert(5, 1.5, 2.5), along(vert(5, 1.5, 2.5), 5, 2), 0.9);
        door(vert(6.3, 1.5, 2.5), along(vert(6.3, 1.5, 2.5), 6.3, 2), 0.9, true);
        door(vert(6.3, 5, 6), along(vert(6.3, 5, 6), 6.3, 5.5), 0.9);
        door(vert(5, 5.5, 6.5), along(vert(5, 5.5, 6.5), 5, 6), 0.9, true);
        fur('turn', 8.2, 5.4); fur('toilet', 9.6, 4.1, 270); fur('shower', 9.45, 6.9); fur('sink', 6.6, 4.3, 90);
        fur('turn', 2.5, 2.2); fur('sofa', 2.5, 4.0, 180); fur('bed2', 8.6, 1.5, 270); fur('turn', 7.3, 2.6); fur('counter', 2.5, 7.1, 180); fur('table', 3.3, 5.6);
      }
      kc = { x: 1, y: 1 };
      render(); build3d(); renderSide(); fitPlan(); frame3d();
    }
    render(); renderSide();
    return ready3d.then(function () {
      return {
        serialize: function () { return JSON.parse(JSON.stringify(Object.assign({}, S, { seq: seq }))); },
        restore: function (st) { S = JSON.parse(JSON.stringify(st)); seq = Math.max(seq, st.seq || 0); delete S.seq; if (!byId(selId)) selId = null; pending = null; render(); build3d(); renderSide(); },
        validate: function (d) {
          function n(v) { return typeof v === 'number' && isFinite(v) && Math.abs(v) < 1000; }
          function pt(p) { return Array.isArray(p) && p.length === 2 && n(p[0]) && n(p[1]); }
          if (!d || !Array.isArray(d.walls) || !Array.isArray(d.openings) || !Array.isArray(d.rooms) || !Array.isArray(d.furniture)) return false;
          if (d.walls.length > 500 || d.openings.length > 500 || d.rooms.length > 200 || d.furniture.length > 500) return false;
          return d.walls.every(function (w) { return w && typeof w.id === 'string' && pt(w.a) && pt(w.b) && n(w.t) && n(w.h); }) &&
            d.openings.every(function (o) { return o && typeof o.id === 'string' && (o.kind === 'door' || o.kind === 'window') && typeof o.wall === 'string' && n(o.pos) && n(o.w) && n(o.hgt) && n(o.sill); }) &&
            d.rooms.every(function (r) { return r && typeof r.id === 'string' && typeof r.name === 'string' && ROOM_TYPES[r.type] && n(r.x) && n(r.y) && n(r.w) && n(r.h); }) &&
            d.furniture.every(function (f) { return f && typeof f.id === 'string' && FURN[f.kind] && n(f.x) && n(f.y) && n(f.w) && n(f.d) && n(f.h); });
        },
        start: function (id) { if (id === 'empty') { S = empty(); seq = 0; selId = null; pending = null; render(); build3d(); renderSide(); view.fit({ minX: -1, minY: -1, maxX: 9, maxY: 7 }, planBox.clientWidth, planBox.clientHeight, 16); frame3d(); } else ex(id); },
        onTool: function (id) { tool = id; pending = null; drawOverlay(); planBox.dataset.tool = id; },
        onKey: onKey
      };
    });
  }
})(window);
