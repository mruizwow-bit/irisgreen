/* Iris Green · El taller · máquina en cadena con física real (Planck.js, Box2D en JavaScript).
   Módulo sin interfaz: define las piezas, su forma y la simulación completa. La simulación se
   calcula de una vez (determinista) y guarda fotogramas y la lista de pasos: qué pieza pone en
   marcha a cuál. Así la animación solo se reproduce cuando la persona lo pide y, con movimiento
   reducido, se puede avanzar paso a paso. Unidades: metros, kilogramos, segundos; eje y hacia arriba. */
(function (root) {
  'use strict';

  var W = 12, H = 7;               /* banco de trabajo: 12 m × 7 m */
  var TH = 0.12;                   /* grosor de tablas y rampas */
  var TYPES = ['ball', 'domino', 'ramp', 'lever', 'pendulum', 'wheel', 'block', 'spring', 'bucket'];
  var DYNAMIC = { ball: 1, domino: 1, lever: 1, pendulum: 1, wheel: 1, block: 1 };
  /* Equivalencia con las piezas del plan del estudio antiguo (IGTMaq.PARTS). */
  var OLD_PART = { ball: 'canica', domino: 'domino', ramp: 'rampa', lever: 'palanca', pendulum: 'pendulo', wheel: 'rueda', block: 'balanza', spring: 'muelle', bucket: 'embudo' };
  var LIMITS = {
    r: [0.08, 0.3], h: [0.3, 1.2], w: [0.2, 2], L: [0.4, 8], angle: [-75, 75], at: [0.1, 0.9], x: [0, W], y: [0, H]
  };

  function defaults(type) {
    switch (type) {
      case 'ball': return { r: 0.15 };
      case 'domino': return { h: 0.6 };
      case 'block': return { w: 0.4, h: 0.4 };
      case 'ramp': return { L: 2, angle: -12 };
      case 'spring': return { w: 1, angle: 0 };
      case 'bucket': return { w: 0.9, h: 0.6 };
      case 'lever': return { L: 2.4, at: 0.5, angle: 0 };
      case 'pendulum': return { L: 1.5, angle: 0 };
      case 'wheel': return { r: 0.5 };
    }
    return {};
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function deg(a) { return a * Math.PI / 180; }

  /* Formas de cada pieza en su sistema local (origen = posición de la pieza, ángulo inicial aparte).
     Las usan la física y el dibujo, así lo que se ve es lo que choca. */
  function shapes(p) {
    switch (p.type) {
      case 'ball': return [{ k: 'circle', x: 0, y: 0, r: p.r }];
      case 'domino': return [{ k: 'box', x: 0, y: 0, w: Math.max(0.08, p.h * 0.2), h: p.h }];
      case 'block': return [{ k: 'box', x: 0, y: 0, w: p.w, h: p.h }];
      case 'ramp': return [{ k: 'box', x: 0, y: 0, w: p.L, h: TH }];
      case 'spring': return [{ k: 'box', x: 0, y: 0, w: p.w, h: 0.2, bouncy: true }];
      case 'bucket': {
        var t = 0.08;
        return [{ k: 'box', x: 0, y: t / 2, w: p.w, h: t }, { k: 'box', x: -p.w / 2 + t / 2, y: p.h / 2, w: t, h: p.h }, { k: 'box', x: p.w / 2 - t / 2, y: p.h / 2, w: t, h: p.h },
          { k: 'box', x: 0, y: p.h * 0.4, w: p.w - 2 * t - 0.02, h: p.h * 0.6, sensor: true }];
      }
      case 'lever': return [{ k: 'box', x: (0.5 - p.at) * p.L, y: 0, w: p.L, h: TH }];
      case 'pendulum': return [{ k: 'box', x: 0, y: -p.L / 2, w: 0.04, h: p.L, light: true }, { k: 'circle', x: 0, y: -p.L, r: 0.16 }];
      case 'wheel': return [{ k: 'box', x: 0, y: 0, w: 2 * p.r, h: 0.08 }, { k: 'box', x: 0, y: 0, w: 0.08, h: 2 * p.r }, { k: 'circle', x: 0, y: 0, r: 0.07 }];
    }
    return [];
  }
  function angleOf(p) { return p.type === 'ramp' || p.type === 'spring' || p.type === 'lever' || p.type === 'pendulum' ? deg(p.angle || 0) : 0; }
  /* Caja que envuelve la pieza en el mundo (para elegir con el puntero y encuadrar). */
  function bounds(p) {
    var a = angleOf(p), c = Math.cos(a), s = Math.sin(a), b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    function add(x, y) { var X = p.x + x * c - y * s, Y = p.y + x * s + y * c; b.minX = Math.min(b.minX, X); b.maxX = Math.max(b.maxX, X); b.minY = Math.min(b.minY, Y); b.maxY = Math.max(b.maxY, Y); }
    shapes(p).forEach(function (sh) {
      if (sh.sensor) return;
      if (sh.k === 'circle') { add(sh.x - sh.r, sh.y - sh.r); add(sh.x + sh.r, sh.y + sh.r); add(sh.x - sh.r, sh.y + sh.r); add(sh.x + sh.r, sh.y - sh.r); }
      else { add(sh.x - sh.w / 2, sh.y - sh.h / 2); add(sh.x + sh.w / 2, sh.y - sh.h / 2); add(sh.x + sh.w / 2, sh.y + sh.h / 2); add(sh.x - sh.w / 2, sh.y + sh.h / 2); }
    });
    return b;
  }
  /* Media altura de la pieza cuando está apoyada (para dejarla encima de lo que tiene debajo). */
  function restHalf(p) {
    if (p.type === 'ball') return p.r;
    if (p.type === 'domino' || p.type === 'block') return p.h / 2;
    if (p.type === 'spring') return 0.1;
    if (p.type === 'bucket') return 0;
    return null;
  }
  /* Altura de la superficie más alta que hay bajo el punto x por debajo de yTop (suelo = 0). */
  function surfaceBelow(parts, x, yTop, skipId) {
    var best = 0;
    parts.forEach(function (q) {
      if (q.id === skipId) return;
      var tops = [];
      if (q.type === 'ramp' || q.type === 'spring') {
        var a = deg(q.angle || 0), hl = (q.type === 'ramp' ? q.L : q.w) / 2, dx = x - q.x;
        if (Math.abs(dx) <= hl * Math.cos(a) + 1e-6) tops.push(q.y + Math.tan(a) * dx + (q.type === 'ramp' ? TH / 2 : 0.1) / Math.cos(a));
      } else if (q.type === 'block' || q.type === 'domino') {
        var w = q.type === 'block' ? q.w : Math.max(0.08, q.h * 0.2);
        if (Math.abs(x - q.x) <= w / 2) tops.push(q.y + q.h / 2);
      } else if (q.type === 'bucket') {
        if (Math.abs(x - q.x) <= q.w / 2) tops.push(q.y + 0.08);
      } else if (q.type === 'lever' && Math.abs(q.angle || 0) < 1) {
        var cx = q.x + (0.5 - q.at) * q.L; if (Math.abs(x - cx) <= q.L / 2) tops.push(q.y + TH / 2);
      }
      tops.forEach(function (tp) { if (tp <= yTop + 1e-6 && tp > best) best = tp; });
    });
    return best;
  }
  function settle(parts, p) {
    var hh = restHalf(p); if (hh === null) return p.y;
    var top = surfaceBelow(parts, p.x, p.y - hh + 0.05, p.id);
    return Math.round((top + hh + (p.type === 'ball' ? 0.003 : 0.015)) * 1000) / 1000;
  }

  function sanitize(p) {
    var d = defaults(p.type), o = { id: String(p.id), type: p.type, x: clamp(+p.x || 0, -2, W + 2), y: clamp(+p.y || 0, -1, H + 2), note: String(p.note || '').slice(0, 120) };
    Object.keys(d).forEach(function (k) { var v = +p[k]; o[k] = isFinite(v) ? clamp(v, LIMITS[k][0], LIMITS[k][1]) : d[k]; });
    return o;
  }

  /* ---------- Simulación ---------- */
  function simulate(planck, doc, opts) {
    opts = opts || {};
    var P = planck, world = new P.World({ gravity: P.Vec2(0, -9.81) });
    var dt = 1 / 60, maxT = opts.maxT || 30, parts = doc.parts || [];
    var ground = world.createBody({ type: 'static', position: P.Vec2(W / 2, -0.5) });
    ground.createFixture({ shape: P.Box(40, 0.5), friction: 0.6 });
    /* bordes del banco: nada se escapa por los lados */
    ground.createFixture({ shape: P.Box(0.1, H, P.Vec2(-W / 2 - 0.1, H), 0), friction: 0.3 });
    ground.createFixture({ shape: P.Box(0.1, H, P.Vec2(W / 2 + 0.1, H), 0), friction: 0.3 });
    ground.setUserData({ id: null });
    var bodies = {}, dyn = [], info = {};
    parts.forEach(function (p) {
      var isDyn = !!DYNAMIC[p.type];
      var body = world.createBody({ type: isDyn ? 'dynamic' : 'static', position: P.Vec2(p.x, p.y), angle: angleOf(p), angularDamping: p.type === 'wheel' ? 0.8 : p.type === 'ball' ? 0.25 : 0.02, linearDamping: p.type === 'ball' ? 0.03 : 0, bullet: p.type === 'ball' });
      shapes(p).forEach(function (sh) {
        var shape = sh.k === 'circle' ? P.Circle(P.Vec2(sh.x, sh.y), sh.r) : P.Box(sh.w / 2, sh.h / 2, P.Vec2(sh.x, sh.y), 0);
        var dens = p.type === 'ball' ? 4 : p.type === 'block' ? 2 : sh.light ? 0.2 : p.type === 'pendulum' ? 6 : p.type === 'wheel' ? 0.6 : 1;
        body.createFixture({ shape: shape, density: dens, friction: p.type === 'ball' ? 0.25 : p.type === 'ramp' ? 0.3 : 0.5, restitution: sh.bouncy ? 0.9 : p.type === 'ball' ? 0.25 : 0.05, isSensor: !!sh.sensor });
      });
      body.setUserData({ id: p.id });
      bodies[p.id] = body; info[p.id] = p;
      if (isDyn) dyn.push(p.id);
      if (p.type === 'lever' || p.type === 'pendulum' || p.type === 'wheel') {
        var jd = { collideConnected: false };
        if (p.type === 'lever') { jd.enableLimit = true; jd.lowerAngle = deg(-40) - angleOf(p); jd.upperAngle = deg(40) - angleOf(p); }
        world.createJoint(P.RevoluteJoint(jd, ground, body, P.Vec2(p.x, p.y)));
      }
    });
    var active = {}, counted = {}, steps = [], recent = {}, events = [], goal = false, selfMoved = [];
    function mark(id, by, t, what) {
      if (counted[id]) return; counted[id] = true;
      steps.push({ n: steps.length + 1, id: id, by: by, t: Math.round(t * 100) / 100, what: what });
      if (by === null && steps.length > 1) selfMoved.push(id);
    }
    world.on('begin-contact', function (c) {
      var fa = c.getFixtureA(), fb = c.getFixtureB();
      events.push({ a: fa.getBody().getUserData().id, b: fb.getBody().getUserData().id, sa: fa.isSensor(), sb: fb.isSensor() });
    });
    /* La pieza que empieza */
    var startId = doc.start && bodies[doc.start] ? doc.start : (parts.filter(function (p) { return DYNAMIC[p.type]; })[0] || {}).id;
    if (startId && DYNAMIC[info[startId].type]) {
      var sb = bodies[startId], sp = info[startId], kick = isFinite(+doc.kick) ? +doc.kick : 1.5, m = sb.getMass();
      if (sp.type === 'ball' || sp.type === 'block') sb.setLinearVelocity(P.Vec2(kick, 0));
      else if (sp.type === 'domino') sb.applyLinearImpulse(P.Vec2(m * kick * 0.6, 0), sb.getWorldPoint(P.Vec2(0, sp.h * 0.4)), true);
      else { var ext = sp.type === 'wheel' ? sp.r : sp.L; sb.setAngularVelocity(-kick / Math.max(0.2, ext)); }
      active[startId] = 0; mark(startId, null, 0, 'start');
    }
    var frames = [], t = 0, n = 0, quiet = 0, lastAct = 0;
    function snap() {
      var f = new Float32Array(dyn.length * 3);
      dyn.forEach(function (id, k) { var b = bodies[id], q = b.getPosition(); f[k * 3] = q.x; f[k * 3 + 1] = q.y; f[k * 3 + 2] = b.getAngle(); });
      frames.push(f);
    }
    snap();
    while (t < maxT) {
      world.step(dt, 10, 8); t += dt; n += 1;
      /* choques nuevos: quién toca a quién */
      events.forEach(function (e) {
        [[e.a, e.b, e.sb], [e.b, e.a, e.sa]].forEach(function (pr) {
          var src = pr[0], dst = pr[1], sensor = pr[2];
          if (src === null || dst === null || active[src] === undefined) return;
          var ty = info[dst].type;
          if (ty === 'bucket') { if (sensor && info[src].type !== 'lever' && info[src].type !== 'wheel' && info[src].type !== 'pendulum') { mark(dst, src, t, 'goal'); goal = true; } return; }
          if (!DYNAMIC[ty]) { if (ty === 'ramp' || ty === 'spring') mark(dst, src, t, 'touch'); return; }
          recent[dst] = { by: src, t: t };
        });
      });
      events = [];
      /* piezas que se ponen en marcha */
      var moving = false;
      dyn.forEach(function (id) {
        var b = bodies[id], v = b.getLinearVelocity(), p = info[id];
        var ext = p.type === 'wheel' ? p.r : p.type === 'lever' || p.type === 'pendulum' ? p.L / 2 : p.type === 'domino' ? p.h / 2 : 0.2;
        var sp = Math.hypot(v.x, v.y) + Math.abs(b.getAngularVelocity()) * ext;
        if (sp > 0.1) moving = true;
        if (active[id] !== undefined || sp < 0.3 || b.getPosition().y < -3) return;
        var by = null;
        for (var ce = b.getContactList(); ce; ce = ce.next) {
          if (!ce.contact.isTouching()) continue;
          var oid = ce.other.getUserData().id;
          if (oid !== null && active[oid] !== undefined && DYNAMIC[info[oid].type]) { by = oid; break; }
        }
        if (by === null && recent[id] && t - recent[id].t < 0.6) by = recent[id].by;
        if (by === null && t < 0.4) return; /* se está asentando: todavía no cuenta */
        active[id] = t; lastAct = t; mark(id, by, t, 'move');
      });
      if (n % 2 === 0) snap();
      quiet = moving ? 0 : quiet + dt;
      if (t > 1 && quiet > 1) break;
      if (t - lastAct > 12 && t > 15) break;
    }
    if (n % 2 !== 0) snap();
    var unused = dyn.filter(function (id) { return active[id] === undefined; });
    return { frames: frames, fps: 30, dyn: dyn, steps: steps, goal: goal, duration: Math.round(t * 100) / 100, selfMoved: selfMoved, unused: unused };
  }

  root.IGSMaqCadena = { W: W, H: H, TH: TH, TYPES: TYPES, DYNAMIC: DYNAMIC, OLD_PART: OLD_PART, LIMITS: LIMITS, defaults: defaults, shapes: shapes, angleOf: angleOf,
    bounds: bounds, settle: settle, surfaceBelow: surfaceBelow, sanitize: sanitize, simulate: simulate };
})(typeof window !== 'undefined' ? window : this);
