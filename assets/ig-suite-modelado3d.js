/* Iris Green · El taller · Estudio de modelado 3D (R43).
   Formas sólidas y huecos que se combinan (CSG) sobre una cama de impresión de 200 × 200 mm.
   Mover, girar y escalar con el gizmo o con el teclado y el panel de propiedades.
   Exporta STL (para imprimir, con Z hacia arriba), GLB y OBJ. */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;
  var LANG = IG.lang;
  var KINDS = ['box', 'roundbox', 'sphere', 'cylinder', 'cone', 'pyramid', 'torus', 'wedge'];
  var COLORS = [['azul', 'blue', '#1f5f8b'], ['rojo', 'red', '#b3261e'], ['verde', 'green', '#2e7d32'], ['amarillo', 'yellow', '#e0b000'], ['morado', 'purple', '#5a49a8'], ['naranja', 'orange', '#d86b00'], ['gris', 'grey', '#7d8b99'], ['blanco', 'white', '#f4f4f4']];
  var BED = 200;

  IG.defineEngine('modelado3d', {
    libs: ['three'], version: 1, fileBase: LANG === 'en' ? 'model' : 'modelo',
    extraKeys: ['k3dMove', 'k3dView'],
    initialStart: function (para) { return { child: 'keychain', teen: 'stand', adult: 'box' }[para] || 'rocket'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'keychain', title: t('stKey'), desc: t('stKeyD'), para: 'child' },
        { id: 'rocket', title: t('stRocket'), desc: t('stRocketD'), para: 'any' },
        { id: 'stand', title: t('stStand'), desc: t('stStandD'), para: 'teen' },
        { id: 'box', title: t('stBox'), desc: t('stBoxD'), para: 'adult' }
      ];
    },
    create: function (ctx) { return createStudio(ctx); }
  });

  function createStudio(ctx) {
    var t = ctx.t, h = ctx.h, THREE = root.THREE, T3 = IG.ThreeD;
    return T3.createRenderer(THREE, ctx.viewport).then(function (renderer) {
      ctx.setTech('renderer', 'Three.js r' + THREE.REVISION + ' · ' + renderer.igsBackend + ' · three-bvh-csg');
      return build(renderer);
    });

    function build(renderer) {
      var scene = new THREE.Scene(); scene.background = new THREE.Color(0xf1f5f9);
      var camera = new THREE.PerspectiveCamera(40, 1, 1, 5000); camera.position.set(170, 170, 230);
      var loop = new T3.Loop(renderer, scene, camera, ctx.viewport);
      T3.lights(THREE, scene);
      /* cama de impresión */
      var bed = new THREE.Mesh(new THREE.BoxGeometry(BED, 2, BED), new THREE.MeshStandardMaterial({ color: 0xdfe6ee, roughness: 0.9 })); bed.position.y = -1; scene.add(bed);
      var grid = new THREE.GridHelper(BED, 20, 0x91a9bf, 0xc9d8e6); grid.position.y = 0.05; scene.add(grid);
      var axisX = new THREE.Mesh(new THREE.BoxGeometry(BED, 0.4, 0.8), new THREE.MeshBasicMaterial({ color: 0xa1283c })); axisX.position.set(0, 0.2, BED / 2 + 1); scene.add(axisX);
      var axisZ = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, BED), new THREE.MeshBasicMaterial({ color: 0x2e7d32 })); axisZ.position.set(-BED / 2 - 1, 0.2, 0); scene.add(axisZ);
      var controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 20, 0); controls.enableDamping = false; controls.maxPolarAngle = Math.PI * 0.49; controls.minDistance = 30; controls.maxDistance = 1200;
      controls.addEventListener('change', loop.request); controls.update();
      var gizmo = new THREE.TransformControls(camera, renderer.domElement);
      gizmo.setTranslationSnap(1); gizmo.setRotationSnap(THREE.MathUtils.degToRad(15)); gizmo.setScaleSnap(0.05);
      var gizmoHelper = gizmo.getHelper ? gizmo.getHelper() : gizmo; scene.add(gizmoHelper);
      gizmo.addEventListener('change', loop.request);
      gizmo.addEventListener('dragging-changed', function (e) { controls.enabled = !e.value; if (!e.value) { syncFromMesh(); changed(t('transformed')); } });
      gizmo.addEventListener('objectChange', function () { syncFromMesh(true); });

      var S = null, seq = 0, sel = [], meshes = {}, boxHelper = null;
      var matCache = {};
      function material(o) {
        if (o.hole) return new THREE.MeshStandardMaterial({ color: 0x7d8b99, transparent: true, opacity: 0.38, roughness: 0.6, depthWrite: false });
        return new THREE.MeshStandardMaterial({ color: new THREE.Color(o.color || '#1f5f8b'), roughness: 0.55, metalness: 0.05 });
      }
      function unitGeometry(kind) {
        switch (kind) {
          case 'sphere': return new THREE.SphereGeometry(0.5, 48, 32);
          case 'cylinder': return new THREE.CylinderGeometry(0.5, 0.5, 1, 64);
          case 'cone': return new THREE.ConeGeometry(0.5, 1, 64);
          case 'pyramid': { var g = new THREE.ConeGeometry(0.7071, 1, 4); g.rotateY(Math.PI / 4); return g; }
          case 'torus': { var tg = new THREE.TorusGeometry(0.35, 0.15, 24, 64); tg.rotateX(Math.PI / 2); return tg; }
          case 'roundbox': return new THREE.RoundedBoxGeometry(1, 1, 1, 4, 0.12);
          case 'wedge': {
            var shape = new THREE.Shape(); shape.moveTo(-0.5, -0.5); shape.lineTo(0.5, -0.5); shape.lineTo(-0.5, 0.5); shape.lineTo(-0.5, -0.5);
            var wg = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false }); wg.translate(0, 0, -0.5); return wg;
          }
          default: return new THREE.BoxGeometry(1, 1, 1);
        }
      }
      function geomFor(o) {
        if (o.kind !== 'group') return unitGeometry(o.kind);
        /* grupo: unión de sólidos menos los huecos (CSG), con las posiciones de los hijos relativas al grupo */
        var ev = new THREE.Evaluator(); ev.useGroups = false;
        var solids = o.children.filter(function (c) { return !c.hole; }), holes = o.children.filter(function (c) { return c.hole; });
        function brush(c) {
          /* la transformación de cada pieza se hornea en su geometría: el pincel queda en el origen del grupo */
          var tmp = new THREE.Object3D(); applyTransform(tmp, c); tmp.updateMatrix();
          var g = geomFor(c).clone(); g.applyMatrix4(tmp.matrix);
          var b = new THREE.Brush(g, new THREE.MeshStandardMaterial()); b.updateMatrixWorld(); return b;
        }
        var result = null;
        solids.forEach(function (c) { var b = brush(c); result = result ? ev.evaluate(result, b, THREE.ADDITION) : b; });
        if (!result) return new THREE.BoxGeometry(1, 1, 1);
        holes.forEach(function (c) { result = ev.evaluate(result, brush(c), THREE.SUBTRACTION); });
        return result.geometry.clone();
      }
      function applyTransform(obj, o) {
        obj.position.set(o.pos[0], o.pos[1], o.pos[2]);
        obj.rotation.set(THREE.MathUtils.degToRad(o.rot[0]), THREE.MathUtils.degToRad(o.rot[1]), THREE.MathUtils.degToRad(o.rot[2]));
        if (o.kind === 'group') obj.scale.set(1, 1, 1); else obj.scale.set(o.size[0], o.size[1], o.size[2]);
      }
      function rebuild() {
        Object.keys(meshes).forEach(function (id) { scene.remove(meshes[id]); meshes[id].geometry.dispose(); });
        meshes = {};
        S.objects.forEach(function (o) {
          var m = new THREE.Mesh(geomFor(o), material(o.kind === 'group' ? { color: groupColor(o) } : o));
          m.name = o.name; m.userData.id = o.id; applyTransform(m, o);
          scene.add(m); meshes[o.id] = m;
        });
        attachGizmo(); loop.request();
      }
      function groupColor(o) { var s = o.children.filter(function (c) { return !c.hole; })[0]; return (s && (s.kind === 'group' ? groupColor(s) : s.color)) || '#1f5f8b'; }
      function attachGizmo() {
        if (boxHelper) { scene.remove(boxHelper); boxHelper = null; }
        var id = sel.length === 1 ? sel[0] : null;
        if (id && meshes[id]) { gizmo.attach(meshes[id]); } else gizmo.detach();
        sel.forEach(function (sid) { if (!meshes[sid]) return; var bh = new THREE.BoxHelper(meshes[sid], 0x5a49a8); scene.add(bh); if (!boxHelper) boxHelper = new THREE.Group(); boxHelper.add(bh); });
        if (boxHelper) { var grp = boxHelper; boxHelper = grp; scene.add(grp); }
      }
      function refreshHelpers() { if (boxHelper) boxHelper.children.forEach(function (b) { b.update(); }); }
      function byId(id) { for (var i = 0; i < S.objects.length; i++) if (S.objects[i].id === id) return S.objects[i]; return null; }
      function syncFromMesh(live) {
        var id = sel.length === 1 ? sel[0] : null, o = id && byId(id), m = id && meshes[id]; if (!o || !m) return;
        o.pos = [round(m.position.x), round(m.position.y), round(m.position.z)];
        o.rot = [round(THREE.MathUtils.radToDeg(m.rotation.x)), round(THREE.MathUtils.radToDeg(m.rotation.y)), round(THREE.MathUtils.radToDeg(m.rotation.z))];
        if (o.kind !== 'group') { o.size = [Math.max(0.5, round(m.scale.x)), Math.max(0.5, round(m.scale.y)), Math.max(0.5, round(m.scale.z))]; m.scale.set(o.size[0], o.size[1], o.size[2]); }
        refreshHelpers();
        if (!live) renderSide(); else updateHud();
      }
      function round(v) { return (Math.round(v * 10) / 10) || 0; }
      function worldBox(id) { var b = new THREE.Box3(); if (meshes[id]) b.setFromObject(meshes[id]); return b; }
      function dims(id) { var b = worldBox(id), s = new THREE.Vector3(); b.getSize(s); return s; }

      /* ---------- Selección con el puntero ---------- */
      var ray = new THREE.Raycaster(), down = null;
      renderer.domElement.addEventListener('pointerdown', function (e) { down = { x: e.clientX, y: e.clientY }; });
      renderer.domElement.addEventListener('pointerup', function (e) {
        if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5 || gizmo.dragging) { down = null; return; }
        down = null;
        var r = renderer.domElement.getBoundingClientRect(), p = new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
        ray.setFromCamera(p, camera);
        var hit = ray.intersectObjects(Object.keys(meshes).map(function (k) { return meshes[k]; }), false)[0];
        var id = hit ? hit.object.userData.id : null;
        if (e.shiftKey && id) { var i = sel.indexOf(id); if (i >= 0) sel.splice(i, 1); else sel.push(id); }
        else sel = id ? [id] : [];
        attachGizmo(); renderSide(); loop.request();
        if (id) ctx.announce(t('selected', { name: describe(byId(id)) }));
      });

      /* ---------- Teclado: mover el objeto o la cámara ---------- */
      function onKey(e) {
        if (!ctx.viewport.contains(e.target)) return false;
        var step = e.shiftKey ? 10 : 1, k = e.key;
        if (sel.length) {
          var d = { ArrowLeft: [-step, 0, 0], ArrowRight: [step, 0, 0], ArrowUp: [0, 0, -step], ArrowDown: [0, 0, step], PageUp: [0, step, 0], PageDown: [0, -step, 0] }[k];
          if (d) { sel.forEach(function (id) { var o = byId(id); o.pos = [round(o.pos[0] + d[0]), round(o.pos[1] + d[1]), round(o.pos[2] + d[2])]; applyTransform(meshes[id], o); }); refreshHelpers(); loop.request(); var o1 = byId(sel[0]); ctx.announce(t('posAnnounce', { x: IG.num(o1.pos[0], 1), y: IG.num(o1.pos[1], 1), z: IG.num(o1.pos[2], 1) })); changed(null); return true; }
          if (k === 'r' || k === 'R') { sel.forEach(function (id) { var o = byId(id); o.rot[1] = (o.rot[1] + (e.shiftKey ? -15 : 15) + 360) % 360; applyTransform(meshes[id], o); }); refreshHelpers(); loop.request(); changed(t('rotated')); return true; }
          if (k === 'Delete' || k === 'Backspace') { removeSel(); return true; }
          if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'd') { duplicate(); return true; }
          if (k === 'Escape') { sel = []; attachGizmo(); renderSide(); loop.request(); ctx.announce(t('deselected')); return true; }
        }
        var ang = { ArrowLeft: 15, ArrowRight: -15 }[k], el = { ArrowUp: 10, ArrowDown: -10 }[k];
        if (ang || el) {
          var off = camera.position.clone().sub(controls.target), sph = new THREE.Spherical().setFromVector3(off);
          if (ang) sph.theta += THREE.MathUtils.degToRad(ang); if (el) sph.phi = Math.max(0.1, Math.min(Math.PI * 0.49, sph.phi - THREE.MathUtils.degToRad(el)));
          camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sph)); controls.update(); loop.request(); return true;
        }
        if (k === '+' || k === '=') { camera.position.lerp(controls.target, 0.2); controls.update(); loop.request(); return true; }
        if (k === '-') { camera.position.sub(controls.target).multiplyScalar(1.25).add(controls.target); controls.update(); loop.request(); return true; }
        if (k === '0') { viewPreset('iso'); return true; }
        return false;
      }
      /* Encuadra el modelo: la cámara se aleja lo justo para verlo entero desde la vista pedida. */
      function viewPreset(v) {
        var box = new THREE.Box3();
        S.objects.forEach(function (o) { if (meshes[o.id]) box.union(worldBox(o.id)); });
        if (box.isEmpty()) box.set(new THREE.Vector3(-30, 0, -30), new THREE.Vector3(30, 40, 30));
        var sphere = box.getBoundingSphere(new THREE.Sphere()), r = Math.max(35, sphere.radius);
        var dist = r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.15;
        var dir = new THREE.Vector3().fromArray({ front: [0, 0.18, 1], top: [0, 1, 0.001], side: [1, 0.18, 0], iso: [0.55, 0.6, 0.75] }[v] || [0.55, 0.6, 0.75]).normalize();
        controls.target.copy(sphere.center); camera.position.copy(sphere.center).addScaledVector(dir, dist);
        controls.update(); loop.request(); ctx.announce(t('view_' + v));
      }

      /* ---------- Operaciones ---------- */
      function nameFor(kind, hole) { var base = t('kind_' + kind) + (hole ? ' · ' + t('holeWord') : ''), n = 1; while (S.objects.some(function (o) { return o.name === base + (n > 1 ? ' ' + n : ''); })) n += 1; return base + (n > 1 ? ' ' + n : ''); }
      function addShape(kind, hole) {
        seq += 1;
        var size = kind === 'torus' ? [40, 12, 40] : kind === 'sphere' ? [30, 30, 30] : [30, 30, 30];
        var o = { id: 'o' + seq, name: nameFor(kind, hole), kind: kind, hole: !!hole, color: hole ? null : COLORS[(seq - 1) % COLORS.length][2], pos: [0, size[1] / 2, 0], rot: [0, 0, 0], size: size };
        /* aparece al lado de lo elegido para que se vea */
        if (sel.length) { var b = worldBox(sel[0]); o.pos[0] = round(b.max.x + size[0] / 2 + 5); }
        S.objects.push(o); sel = [o.id]; rebuild(); changed(t('added', { name: o.name }));
      }
      function removeSel() {
        if (!sel.length) return;
        var names = sel.map(function (id) { return byId(id).name; }).join(', ');
        S.objects = S.objects.filter(function (o) { return sel.indexOf(o.id) < 0; }); sel = []; rebuild(); changed(t('deleted', { name: names }));
      }
      function duplicate() {
        if (!sel.length) return;
        var copies = sel.map(function (id) { var c = JSON.parse(JSON.stringify(byId(id))); seq += 1; c.id = 'o' + seq; c.name = c.name + ' ' + t('copyWord'); c.pos[0] = round(c.pos[0] + 10); c.pos[2] = round(c.pos[2] + 10); return c; });
        S.objects = S.objects.concat(copies); sel = copies.map(function (c) { return c.id; }); rebuild(); changed(t('duplicated'));
      }
      function group() {
        if (sel.length < 2) { ctx.announce(t('needTwo')); return; }
        var objs = sel.map(byId), center = new THREE.Vector3(), b = new THREE.Box3();
        sel.forEach(function (id) { b.union(worldBox(id)); }); b.getCenter(center);
        var children = objs.map(function (o) { var c = JSON.parse(JSON.stringify(o)); c.pos = [round(o.pos[0] - center.x), round(o.pos[1] - center.y), round(o.pos[2] - center.z)]; return c; });
        seq += 1;
        var g = { id: 'o' + seq, name: t('groupWord') + ' ' + seq, kind: 'group', hole: false, pos: [round(center.x), round(center.y), round(center.z)], rot: [0, 0, 0], size: [1, 1, 1], children: children };
        if (!children.some(function (c) { return !c.hole; })) { ctx.announce(t('needSolid')); return; }
        S.objects = S.objects.filter(function (o) { return sel.indexOf(o.id) < 0; }).concat([g]); sel = [g.id];
        try { rebuild(); } catch (err) { S.objects = S.objects.filter(function (o) { return o !== g; }).concat(objs); sel = objs.map(function (o) { return o.id; }); rebuild(); ctx.announce(t('groupError')); return; }
        changed(t('grouped', { n: children.length }));
      }
      function ungroup() {
        var id = sel.length === 1 ? sel[0] : null, g = id && byId(id); if (!g || g.kind !== 'group') return;
        var m = meshes[id]; m.updateMatrixWorld(true);
        var kids = g.children.map(function (c) {
          var cc = JSON.parse(JSON.stringify(c)); seq += 1; cc.id = 'o' + seq;
          var obj = new THREE.Object3D(); applyTransform(obj, c); obj.updateMatrix(); obj.applyMatrix4(m.matrixWorld);
          cc.pos = [round(obj.position.x), round(obj.position.y), round(obj.position.z)];
          var eu = new THREE.Euler().setFromQuaternion(obj.quaternion); cc.rot = [round(THREE.MathUtils.radToDeg(eu.x)), round(THREE.MathUtils.radToDeg(eu.y)), round(THREE.MathUtils.radToDeg(eu.z))];
          return cc;
        });
        S.objects = S.objects.filter(function (o) { return o !== g; }).concat(kids); sel = kids.map(function (k) { return k.id; }); rebuild(); changed(t('ungrouped'));
      }
      function dropToBed() {
        if (!sel.length) return;
        sel.forEach(function (id) { var b = worldBox(id), o = byId(id); o.pos[1] = round(o.pos[1] - b.min.y); applyTransform(meshes[id], o); });
        refreshHelpers(); loop.request(); changed(t('dropped'));
      }
      function describe(o) {
        if (!o) return '';
        var d = meshes[o.id] ? dims(o.id) : new THREE.Vector3(o.size[0], o.size[1], o.size[2]);
        return t('describe', { name: o.name, w: IG.num(d.x, 1), h: IG.num(d.y, 1), d: IG.num(d.z, 1), x: IG.num(o.pos[0], 1), y: IG.num(o.pos[1], 1), z: IG.num(o.pos[2], 1) }) + (o.hole ? ' ' + t('isHole') : '');
      }

      /* ---------- Paneles ---------- */
      var hud = h('div', { class: 'igs-hud', 'aria-hidden': 'true' }); ctx.viewport.appendChild(hud);
      function updateHud() {
        ctx.clear(hud);
        if (sel.length === 1 && meshes[sel[0]]) { var d = dims(sel[0]); hud.appendChild(h('span', { text: IG.num(d.x, 1) + ' × ' + IG.num(d.y, 1) + ' × ' + IG.num(d.z, 1) + ' mm' })); }
        hud.appendChild(h('span', { text: t('bedLabel') }));
        var off = offBed(); if (off.length) hud.appendChild(h('span', { text: t('offBedShort', { n: off.length }) }));
      }
      function offBed() { return S.objects.filter(function (o) { if (o.hole || !meshes[o.id]) return false; var b = worldBox(o.id); return b.min.y < -0.5 || b.min.x < -BED / 2 || b.max.x > BED / 2 || b.min.z < -BED / 2 || b.max.z > BED / 2; }); }
      /* Flota lo que no toca la cama ni se apoya (directa o indirectamente) en algo que la toca. */
      function floating() {
        var solids = S.objects.filter(function (o) { return !o.hole && meshes[o.id]; });
        var boxes = {}, ok = {};
        solids.forEach(function (o) { boxes[o.id] = worldBox(o.id).expandByScalar(0.5); if (boxes[o.id].min.y <= 1) ok[o.id] = true; });
        var grew = true;
        while (grew) {
          grew = false;
          solids.forEach(function (o) { if (ok[o.id]) return; for (var k in ok) if (boxes[k].intersectsBox(boxes[o.id])) { ok[o.id] = true; grew = true; return; } });
        }
        return solids.filter(function (o) { return !ok[o.id]; });
      }
      function changed(msg) { if (msg !== null) { ctx.commit(msg || ''); if (msg) ctx.announce(msg); } else ctx.commit(t('moved3d')); renderSide(); }
      function renderSide() {
        var list = [h('h3', { text: t('objects') + ' (' + S.objects.length + ')' })], ul = h('ul', { class: 'igs-list' });
        S.objects.forEach(function (o) {
          var b = h('button', { type: 'button', 'aria-current': String(sel.indexOf(o.id) >= 0) }, h('span', { class: 'igs-swatch', style: 'background:' + (o.hole ? 'repeating-linear-gradient(45deg,#7d8b99 0 3px,#fff 3px 6px)' : (o.kind === 'group' ? groupColor(o) : o.color)) }), h('span', { text: o.name }), h('small', { text: o.kind === 'group' ? t('kind_group') : o.hole ? t('holeWord') : t('kind_' + o.kind) }));
          b.addEventListener('click', function (e) { if (e.shiftKey) { var i = sel.indexOf(o.id); if (i >= 0) sel.splice(i, 1); else sel.push(o.id); } else sel = [o.id]; attachGizmo(); renderSide(); loop.request(); ctx.announce(t('selected', { name: describe(o) })); });
          ul.appendChild(h('li', null, b));
        });
        list.push(ul);
        list.push(h('p', { class: 'igs-muted', text: t('multiHelp') }));
        ctx.setStructure(list);
        var F = ctx.fields, out = [], o = sel.length === 1 ? byId(sel[0]) : null;
        if (o) {
          out.push(h('h4', { text: o.name }));
          out.push(F.text(t('name'), o.name, { max: 40, onChange: function (v) { o.name = String(v).trim().slice(0, 40) || o.name; changed(t('renamed')); } }));
          if (o.kind !== 'group') {
            out.push(F.choice(t('solidOrHole'), o.hole ? 'hole' : 'solid', [['solid', t('solidWord')], ['hole', t('holeWord')]], { onChange: function (v) { o.hole = v === 'hole'; if (!o.hole && !o.color) o.color = '#1f5f8b'; rebuild(); changed(o.hole ? t('nowHole') : t('nowSolid')); } }));
            if (!o.hole) out.push(F.select(t('colour'), o.color, COLORS.map(function (c) { return [c[2], c[LANG === 'en' ? 1 : 0]]; }), { onChange: function (v) { o.color = v; rebuild(); changed(t('colourSet')); } }));
            out.push(h('p', { class: 'igs-field-group', text: t('sizeMm') }));
            ['x', 'y', 'z'].forEach(function (ax, i) { out.push(F.number(t('size_' + ax), o.size[i], { unit: 'mm', min: 0.5, max: 400, step: 1, onChange: function (v) { o.size[i] = v; applyTransform(meshes[o.id], o); refreshHelpers(); loop.request(); changed(t('resized3d')); } })); });
          } else {
            out.push(h('p', { class: 'igs-muted', text: t('groupHelp', { n: o.children.length }) }));
          }
          out.push(h('p', { class: 'igs-field-group', text: t('positionMm') }));
          ['x', 'y', 'z'].forEach(function (ax, i) { out.push(F.number(t('pos_' + ax), o.pos[i], { unit: 'mm', min: -400, max: 400, step: 1, onChange: function (v) { o.pos[i] = v; applyTransform(meshes[o.id], o); refreshHelpers(); loop.request(); changed(t('moved3d')); } })); });
          out.push(h('p', { class: 'igs-field-group', text: t('rotationDeg') }));
          ['x', 'y', 'z'].forEach(function (ax, i) { out.push(F.number(t('rot_' + ax), o.rot[i], { unit: '°', min: -360, max: 360, step: 15, onChange: function (v) { o.rot[i] = v; applyTransform(meshes[o.id], o); refreshHelpers(); loop.request(); changed(t('rotated')); } })); });
          out.push(h('div', { class: 'igs-actions' },
            ctx.button(t('dropToBed'), { icon: 'minus', onClick: dropToBed }), ctx.button(t('duplicateBtn'), { icon: 'copy', onClick: duplicate }),
            o.kind === 'group' ? ctx.button(t('ungroupBtn'), { icon: 'layers', onClick: ungroup }) : null,
            ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', onClick: removeSel })));
        } else if (sel.length > 1) {
          out.push(h('h4', { text: t('nSelected', { n: sel.length }) }));
          out.push(h('p', { class: 'igs-muted', text: t('groupExplain') }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('groupBtn'), { icon: 'layers', onClick: group }), ctx.button(t('dropToBed'), { icon: 'minus', onClick: dropToBed }), ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', onClick: removeSel })));
        }
        out.push(h('h4', { text: t('printCheck') }));
        var ob = offBed(), fl = floating();
        out.push(h('p', { class: 'igs-result', 'data-kind': ob.length || fl.length ? 'bad' : 'ok' }, h('strong', { text: ob.length || fl.length ? t('printWarn') : t('printOk') }), ' ',
          ob.length ? t('offBed', { names: ob.map(function (x) { return x.name; }).join(', ') }) + ' ' : '', fl.length ? t('floating', { names: fl.map(function (x) { return x.name; }).join(', ') }) : (ob.length ? '' : t('printOkText'))));
        ctx.setInspector(out);
        updateHud();
        ctx.setSummary(S.objects.length ? S.objects.map(describe).join(' ') : t('emptyModel'));
      }

      /* ---------- Herramientas ---------- */
      var shapeSel = h('select', { class: 'igs-shape-select', 'aria-label': t('shapeLabel') });
      KINDS.forEach(function (k) { shapeSel.appendChild(h('option', { value: k, text: t('kind_' + k) })); });
      var shapeWrap = h('label', { class: 'igs-inline-select' }, h('span', { text: t('shapeLabel') }), shapeSel);
      ctx.setTools([
        { node: shapeWrap },
        { id: 'addSolid', label: t('addSolid'), icon: 'box', primary: true, action: function () { addShape(shapeSel.value, false); } },
        { id: 'addHole', label: t('addHole'), icon: 'circle', action: function () { addShape(shapeSel.value, true); } },
        { separator: true },
        { id: 'translate', label: t('toolMove'), icon: 'move' },
        { id: 'rotate', label: t('toolRotate'), icon: 'rotate' },
        { id: 'scale', label: t('toolScale'), icon: 'scale' },
        { separator: true },
        { id: 'groupT', label: t('groupBtn'), icon: 'layers', action: group },
        { id: 'viewTop', label: t('view_top'), icon: 'grid', level: 'more', action: function () { viewPreset('top'); } },
        { id: 'viewFront', label: t('view_front'), icon: 'square', level: 'more', action: function () { viewPreset('front'); } },
        { id: 'viewIso', label: t('view_iso'), icon: 'box', level: 'more', action: function () { viewPreset('iso'); } }
      ], { initial: 'translate' });
      var eng = {};
      ctx.addExport(t('exportStl'), function () { var ms = S.objects.filter(function (o) { return !o.hole; }).map(function (o) { return meshes[o.id]; }); if (!ms.length) { ctx.announce(t('nothingToExport')); return; } T3.exportSTL(THREE, ctx, ms, (LANG === 'en' ? 'model-' : 'modelo-') + ctx.stamp()); });
      ctx.addExport(t('exportGlb'), function () { var ms = S.objects.filter(function (o) { return !o.hole; }).map(function (o) { return meshes[o.id]; }); if (!ms.length) { ctx.announce(t('nothingToExport')); return; } T3.exportGLB(THREE, ctx, ms, (LANG === 'en' ? 'model-' : 'modelo-') + ctx.stamp()).catch(function () { ctx.announce(t('exportError')); }); });
      ctx.addExport(t('exportObj'), function () { var ms = S.objects.filter(function (o) { return !o.hole; }).map(function (o) { return meshes[o.id]; }); if (!ms.length) { ctx.announce(t('nothingToExport')); return; } T3.exportOBJ(THREE, ctx, ms, (LANG === 'en' ? 'model-' : 'modelo-') + ctx.stamp()); });
      ctx.addExport(t('exportPng'), function () { loop.request(); root.requestAnimationFrame(function () { renderer.render(scene, camera); var c = ctx.canvasWithCredit(renderer.domElement, '#f1f5f9'); ctx.canvasBlob(c).then(function (b) { ctx.download(b, (LANG === 'en' ? 'model-' : 'modelo-') + ctx.stamp() + '.png'); }); }); });
      ctx.command('addSolid', t('addSolid'), '', function () { addShape(shapeSel.value, false); });
      ctx.command('group', t('groupBtn'), '', group); ctx.command('drop', t('dropToBed'), '', dropToBed);

      function ex(id) {
        seq = 0; var O = [];
        function add(kind, size, pos, extra) { seq += 1; var o = Object.assign({ id: 'o' + seq, name: t('kind_' + kind) + ' ' + seq, kind: kind, hole: false, color: '#1f5f8b', pos: pos, rot: [0, 0, 0], size: size }, extra || {}); O.push(o); return o; }
        if (id === 'keychain') {
          add('roundbox', [50, 4, 30], [0, 2, 0], { name: t('exBase'), color: '#5a49a8' });
          add('cylinder', [7, 10, 7], [-18, 2, 0], { name: t('exRing'), hole: true, color: null });
          add('sphere', [14, 8, 14], [8, 4, 0], { name: t('exDome'), color: '#e0b000' });
        } else if (id === 'stand') {
          add('box', [80, 6, 70], [0, 3, 0], { name: t('exBase2'), color: '#2e7d32' });
          add('box', [80, 90, 6], [0, 45, 10], { name: t('exBack'), rot: [20, 0, 0], color: '#2e7d32' });
          add('box', [80, 14, 6], [0, 10, -22], { name: t('exLip'), color: '#2e7d32' });
          add('cylinder', [14, 20, 14], [0, 40, 12], { name: t('exCable'), hole: true, color: null, rot: [70, 0, 0] });
        } else if (id === 'box') {
          seq += 1;
          O.push({ id: 'o' + seq, name: t('exHollow'), kind: 'group', hole: false, pos: [-38, 15, 0], rot: [0, 0, 0], size: [1, 1, 1], children: [
            { id: 'c1', name: t('exOuter'), kind: 'roundbox', hole: false, color: '#197991', pos: [0, 0, 0], rot: [0, 0, 0], size: [60, 30, 40] },
            { id: 'c2', name: t('exInner'), kind: 'box', hole: true, color: null, pos: [0, 2, 0], rot: [0, 0, 0], size: [56, 30, 36] }] });
          add('roundbox', [60, 4, 40], [38, 2, 0], { name: t('exLid'), color: '#197991' });
          add('box', [55.6, 3, 35.6], [38, 5.5, 0], { name: t('exLidLip'), color: '#197991' });
        } else if (id === 'rocket') {
          add('cylinder', [30, 70, 30], [0, 35, 0], { name: t('exBody'), color: '#f4f4f4' });
          add('cone', [30, 30, 30], [0, 85, 0], { name: t('exNose'), color: '#b3261e' });
          [0, 120, 240].forEach(function (a, i) { var r = THREE.MathUtils.degToRad(a); add('wedge', [22, 25, 3], [Math.cos(r) * 24, 12.5, -Math.sin(r) * 24], { name: t('exFin') + ' ' + (i + 1), rot: [0, a, 0], color: '#b3261e' }); });
          add('cylinder', [14, 4, 14], [0, 45, 15.2], { name: t('exWindow'), rot: [90, 0, 0], color: '#1f5f8b' });
        }
        S = { v: 1, objects: O }; sel = []; rebuild(); renderSide(); viewPreset('iso');
      }
      S = { v: 1, objects: [] };
      return {
        serialize: function () { return { v: 1, seq: seq, objects: JSON.parse(JSON.stringify(S.objects)) }; },
        restore: function (st) { S = { v: 1, objects: JSON.parse(JSON.stringify(st.objects)) }; seq = Math.max(seq, st.seq || 0); sel = sel.filter(function (id) { return !!byId(id); }); rebuild(); renderSide(); },
        validate: function (d) {
          function okObj(o, depth) {
            if (!o || typeof o.id !== 'string' || typeof o.name !== 'string' || !Array.isArray(o.pos) || o.pos.length !== 3 || !Array.isArray(o.rot) || o.rot.length !== 3) return false;
            if (![].concat(o.pos, o.rot).every(isFinite)) return false;
            if (o.kind === 'group') return depth < 6 && Array.isArray(o.children) && o.children.length >= 1 && o.children.length <= 64 && o.children.every(function (c) { return okObj(c, depth + 1); });
            return KINDS.indexOf(o.kind) >= 0 && Array.isArray(o.size) && o.size.length === 3 && o.size.every(function (v) { return isFinite(v) && v > 0 && v <= 1000; });
          }
          return d && Array.isArray(d.objects) && d.objects.length <= 200 && d.objects.every(function (o) { return okObj(o, 0); });
        },
        start: function (id) { if (id === 'empty') { seq = 0; S = { v: 1, objects: [] }; sel = []; rebuild(); renderSide(); viewPreset('iso'); } else ex(id); },
        onTool: function (id) { if (id === 'translate' || id === 'rotate' || id === 'scale') { gizmo.setMode(id); loop.request(); } },
        onKey: onKey
      };
    }
  }
})(window);