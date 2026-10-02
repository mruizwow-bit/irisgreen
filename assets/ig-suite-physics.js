/* Iris Green · El taller · física 2D común.
   Una sola interfaz para dos motores reales:
   - Rapier (WebAssembly) cuando la política de seguridad del sitio permite compilar WebAssembly;
   - Planck.js (Box2D en JavaScript) en cualquier otro caso.
   Unidades: metros, kilogramos, segundos. Eje y hacia arriba. */
(function (root) {
  'use strict';
  var VENDOR = '/assets/vendor/taller/';

  function wasmAllowed() {
    /* Módulo WebAssembly mínimo válido (8 bytes). Si la CSP no permite compilar, lanza. */
    try {
      var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]);
      new root.WebAssembly.Module(bytes);
      return true;
    } catch (_) { return false; }
  }

  /* ---------- Planck.js ---------- */
  function PlanckWorld(opts) {
    var P = root.planck;
    this.kind = 'planck'; this.label = 'Planck.js (Box2D, JavaScript)';
    this.P = P; this.world = new P.World({ gravity: P.Vec2(0, opts.gravity === undefined ? -9.81 : opts.gravity) });
    this.bodies = {}; this.joints = {}; this.seq = 0; this.dt = 1 / 60;
    this.velIt = opts.velocityIterations || 12; this.posIt = opts.positionIterations || 6;
  }
  PlanckWorld.prototype._shape = function (s) {
    var P = this.P;
    if (s.type === 'circle') return P.Circle(P.Vec2(s.x || 0, s.y || 0), s.r);
    if (s.type === 'poly') return P.Polygon(s.points.map(function (p) { return P.Vec2(p.x, p.y); }));
    return P.Box(s.w / 2, s.h / 2, P.Vec2(s.x || 0, s.y || 0), s.angle || 0);
  };
  PlanckWorld.prototype.addBody = function (o) {
    var P = this.P, self = this;
    var b = this.world.createBody({ type: o.type || 'dynamic', position: P.Vec2(o.x, o.y), angle: o.angle || 0,
      linearDamping: o.linearDamping || 0, angularDamping: o.angularDamping || 0, fixedRotation: !!o.fixedRotation, bullet: !!o.bullet });
    (o.shapes || [o.shape]).forEach(function (s) {
      b.createFixture({ shape: self._shape(s), density: o.density === undefined ? 1 : o.density, friction: o.friction === undefined ? 0.6 : o.friction,
        restitution: o.restitution || 0, filterGroupIndex: o.group ? -Math.abs(o.group) : 0, isSensor: !!o.sensor });
    });
    var id = ++this.seq; this.bodies[id] = b; b.setUserData(id); return id;
  };
  PlanckWorld.prototype.addJoint = function (o) {
    var P = this.P, a = this.bodies[o.a], b = this.bodies[o.b]; if (!a || !b) return null;
    var j;
    if (o.type === 'weld') j = P.WeldJoint({ frequencyHz: 0, dampingRatio: 0 }, a, b, P.Vec2(o.x, o.y));
    else j = P.RevoluteJoint({ enableMotor: !!o.motor, motorSpeed: o.motor ? o.motor.speed : 0, maxMotorTorque: o.motor ? o.motor.torque : 0, collideConnected: false }, a, b, P.Vec2(o.x, o.y));
    this.world.createJoint(j);
    var id = ++this.seq; this.joints[id] = j; return id;
  };
  PlanckWorld.prototype.removeJoint = function (id) { var j = this.joints[id]; if (j) { this.world.destroyJoint(j); delete this.joints[id]; } };
  PlanckWorld.prototype.removeBody = function (id) { var b = this.bodies[id]; if (b) { this.world.destroyBody(b); delete this.bodies[id]; } };
  PlanckWorld.prototype.step = function (dt) { this.dt = dt || 1 / 60; this.world.step(this.dt, this.velIt, this.posIt); };
  PlanckWorld.prototype.get = function (id) {
    var b = this.bodies[id]; if (!b) return null;
    var p = b.getPosition(), v = b.getLinearVelocity();
    return { x: p.x, y: p.y, angle: b.getAngle(), vx: v.x, vy: v.y, w: b.getAngularVelocity() };
  };
  PlanckWorld.prototype.setPose = function (id, x, y, angle) { var b = this.bodies[id]; if (b) b.setTransform(this.P.Vec2(x, y), angle || 0); };
  PlanckWorld.prototype.setVelocity = function (id, vx, vy, w) { var b = this.bodies[id]; if (!b) return; b.setLinearVelocity(this.P.Vec2(vx, vy)); if (w !== undefined) b.setAngularVelocity(w); b.setAwake(true); };
  PlanckWorld.prototype.applyForce = function (id, fx, fy, px, py) {
    var b = this.bodies[id]; if (!b) return;
    if (px === undefined) b.applyForceToCenter(this.P.Vec2(fx, fy), true); else b.applyForce(this.P.Vec2(fx, fy), this.P.Vec2(px, py), true);
  };
  PlanckWorld.prototype.applyImpulse = function (id, ix, iy) { var b = this.bodies[id]; if (b) b.applyLinearImpulse(this.P.Vec2(ix, iy), b.getWorldCenter(), true); };
  PlanckWorld.prototype.applyTorque = function (id, tq) { var b = this.bodies[id]; if (b) b.applyTorque(tq, true); };
  PlanckWorld.prototype.setMotor = function (id, speed, torque) { var j = this.joints[id]; if (!j) return; j.enableMotor(true); j.setMotorSpeed(speed); if (torque !== undefined) j.setMaxMotorTorque(torque); j.getBodyA().setAwake(true); j.getBodyB().setAwake(true); };
  PlanckWorld.prototype.jointForce = function (id) { var j = this.joints[id]; if (!j) return 0; var f = j.getReactionForce(1 / this.dt); return Math.hypot(f.x, f.y); };
  PlanckWorld.prototype.mass = function (id) { var b = this.bodies[id]; return b ? b.getMass() : 0; };
  PlanckWorld.prototype.raycast = function (x1, y1, x2, y2, ignore) {
    var P = this.P, best = null;
    this.world.rayCast(P.Vec2(x1, y1), P.Vec2(x2, y2), function (fixture, point, normal, fraction) {
      if (fixture.isSensor()) return -1;
      var id = fixture.getBody().getUserData();
      if (ignore && ignore.indexOf(id) >= 0) return -1;
      best = { x: point.x, y: point.y, fraction: fraction, body: id };
      return fraction;
    });
    if (best) best.dist = Math.hypot(x2 - x1, y2 - y1) * best.fraction;
    return best;
  };
  PlanckWorld.prototype.destroy = function () { this.bodies = {}; this.joints = {}; this.world = null; };

  /* ---------- Rapier ---------- */
  function RapierWorld(opts) {
    var R = root.RAPIER;
    this.kind = 'rapier'; this.label = 'Rapier (WebAssembly)';
    this.R = R; this.world = new R.World({ x: 0, y: opts.gravity === undefined ? -9.81 : opts.gravity });
    this.world.integrationParameters.numSolverIterations = opts.velocityIterations || 12;
    this.bodies = {}; this.joints = {}; this.jointBodies = {}; this.seq = 0; this.dt = 1 / 60; this.byHandle = {};
  }
  RapierWorld.prototype._collider = function (s) {
    var R = this.R, c;
    if (s.type === 'circle') c = R.ColliderDesc.ball(s.r);
    else if (s.type === 'poly') { var arr = new Float32Array(s.points.length * 2); s.points.forEach(function (p, i) { arr[2 * i] = p.x; arr[2 * i + 1] = p.y; }); c = R.ColliderDesc.convexHull(arr); }
    else c = R.ColliderDesc.cuboid(s.w / 2, s.h / 2);
    if (s.x || s.y) c.setTranslation(s.x || 0, s.y || 0);
    if (s.angle) c.setRotation(s.angle);
    return c;
  };
  RapierWorld.prototype.addBody = function (o) {
    var R = this.R, self = this;
    var desc = o.type === 'static' ? R.RigidBodyDesc.fixed() : o.type === 'kinematic' ? R.RigidBodyDesc.kinematicPositionBased() : R.RigidBodyDesc.dynamic();
    desc.setTranslation(o.x, o.y).setRotation(o.angle || 0).setLinearDamping(o.linearDamping || 0).setAngularDamping(o.angularDamping || 0);
    if (o.fixedRotation) desc.lockRotations();
    if (o.bullet) desc.setCcdEnabled(true);
    var rb = this.world.createRigidBody(desc);
    (o.shapes || [o.shape]).forEach(function (s) {
      var c = self._collider(s);
      c.setDensity(o.density === undefined ? 1 : o.density).setFriction(o.friction === undefined ? 0.6 : o.friction).setRestitution(o.restitution || 0);
      /* Mismo grupo = no chocan entre sí (miembros: bit g; filtro: todo menos g). */
      if (o.group) { var g = 1 << (Math.abs(o.group) % 15); c.setCollisionGroups(((g << 16) | (0xffff & ~g)) >>> 0); }
      if (o.sensor) c.setSensor(true);
      self.world.createCollider(c, rb);
    });
    var id = ++this.seq; this.bodies[id] = rb; this.byHandle[rb.handle] = id; return id;
  };
  RapierWorld.prototype.addJoint = function (o) {
    var R = this.R, a = this.bodies[o.a], b = this.bodies[o.b]; if (!a || !b) return null;
    function local(rb) {
      var p = rb.translation(), ang = rb.rotation(), dx = o.x - p.x, dy = o.y - p.y, c = Math.cos(-ang), s = Math.sin(-ang);
      return { x: dx * c - dy * s, y: dx * s + dy * c };
    }
    var la = local(a), lb = local(b), data;
    if (o.type === 'weld') data = R.JointData.fixed(la, 0, lb, b.rotation() - a.rotation());
    else data = R.JointData.revolute(la, lb);
    var j = this.world.createImpulseJoint(data, a, b, true);
    if (o.motor && j.configureMotorVelocity) j.configureMotorVelocity(o.motor.speed, o.motor.torque > 0 ? 1e3 : 0);
    var id = ++this.seq; this.joints[id] = j; this.jointBodies[id] = [o.a, o.b]; return id;
  };
  RapierWorld.prototype.removeJoint = function (id) { var j = this.joints[id]; if (j) { this.world.removeImpulseJoint(j, true); delete this.joints[id]; } };
  RapierWorld.prototype.removeBody = function (id) { var b = this.bodies[id]; if (b) { delete this.byHandle[b.handle]; this.world.removeRigidBody(b); delete this.bodies[id]; } };
  RapierWorld.prototype.step = function (dt) { this.dt = dt || 1 / 60; this.world.timestep = this.dt; this.world.step(); };
  RapierWorld.prototype.get = function (id) {
    var b = this.bodies[id]; if (!b) return null; var p = b.translation(), v = b.linvel();
    return { x: p.x, y: p.y, angle: b.rotation(), vx: v.x, vy: v.y, w: b.angvel() };
  };
  RapierWorld.prototype.setPose = function (id, x, y, angle) {
    var b = this.bodies[id]; if (!b) return;
    if (b.isKinematic()) { b.setNextKinematicTranslation({ x: x, y: y }); b.setNextKinematicRotation(angle || 0); }
    else { b.setTranslation({ x: x, y: y }, true); b.setRotation(angle || 0, true); }
  };
  RapierWorld.prototype.setVelocity = function (id, vx, vy, w) { var b = this.bodies[id]; if (!b) return; b.setLinvel({ x: vx, y: vy }, true); if (w !== undefined) b.setAngvel(w, true); };
  RapierWorld.prototype.applyForce = function (id, fx, fy, px, py) {
    var b = this.bodies[id]; if (!b) return;
    /* Rapier acumula fuerzas: se aplican como impulso de un paso para igualar el comportamiento de Box2D. */
    if (px === undefined) b.applyImpulse({ x: fx * this.dt, y: fy * this.dt }, true);
    else b.applyImpulseAtPoint({ x: fx * this.dt, y: fy * this.dt }, { x: px, y: py }, true);
  };
  RapierWorld.prototype.applyImpulse = function (id, ix, iy) { var b = this.bodies[id]; if (b) b.applyImpulse({ x: ix, y: iy }, true); };
  RapierWorld.prototype.applyTorque = function (id, tq) { var b = this.bodies[id]; if (b) b.applyTorqueImpulse(tq * this.dt, true); };
  RapierWorld.prototype.setMotor = function (id, speed, torque) { var j = this.joints[id]; if (j && j.configureMotorVelocity) j.configureMotorVelocity(speed, torque === 0 ? 0 : 1e3); var bs = this.jointBodies[id]; if (bs) bs.forEach(function (bid) { var b = this.bodies[bid]; if (b) b.wakeUp(); }, this); };
  RapierWorld.prototype.jointForce = function () { return NaN; /* Rapier JS no expone la reacción de la unión */ };
  RapierWorld.prototype.mass = function (id) { var b = this.bodies[id]; return b ? b.mass() : 0; };
  RapierWorld.prototype.raycast = function (x1, y1, x2, y2, ignore) {
    var R = this.R, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy); if (len < 1e-9) return null;
    var self = this, ray = new R.Ray({ x: x1, y: y1 }, { x: dx / len, y: dy / len });
    var best = null;
    this.world.intersectionsWithRay(ray, len, true, function (hit) {
      var c = hit.collider; if (c.isSensor()) return true;
      var rb = c.parent(); var id = rb ? self.byHandle[rb.handle] : null;
      if (ignore && ignore.indexOf(id) >= 0) return true;
      var toi = hit.timeOfImpact !== undefined ? hit.timeOfImpact : hit.toi;
      if (!best || toi < best.dist) best = { x: x1 + dx / len * toi, y: y1 + dy / len * toi, dist: toi, fraction: toi / len, body: id };
      return true;
    });
    return best;
  };
  RapierWorld.prototype.destroy = function () { try { this.world.free(); } catch (_) {} this.bodies = {}; this.joints = {}; };

  /* ---------- Fábrica ---------- */
  var backendPromise = null;
  function backend(IG) {
    if (backendPromise) return backendPromise;
    var loadLib = IG && IG.load ? IG.load : function () { return Promise.resolve(); };
    if (wasmAllowed() && root.fetch) {
      backendPromise = loadLib(['rapier']).then(function () {
        return root.fetch(VENDOR + 'rapier2d.wasm').then(function (r) { if (!r.ok) throw new Error('wasm'); return r.arrayBuffer(); });
      }).then(function (buf) {
        root.__IGRapierWasm = buf; return root.RAPIER.init();
      }).then(function () { return 'rapier'; }).catch(function () {
        return loadLib(['planck']).then(function () { return 'planck'; });
      });
    } else {
      backendPromise = loadLib(['planck']).then(function () { return 'planck'; });
    }
    return backendPromise;
  }
  function createWorld(kind, opts) { return kind === 'rapier' ? new RapierWorld(opts || {}) : new PlanckWorld(opts || {}); }

  root.IGPhysics = { backend: backend, createWorld: createWorld, wasmAllowed: wasmAllowed };
})(window);
