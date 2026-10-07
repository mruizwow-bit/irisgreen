/* Iris Green · El taller · física 2D común.
   Planck.js (Box2D en JavaScript), sin WebAssembly.
   Unidades: metros, kilogramos, segundos. Eje y hacia arriba. */
(function (root) {
  'use strict';
  var VENDOR = '/assets/vendor/taller/';

  function wasmAllowed() { return false; }

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

  /* ---------- Fábrica ---------- */
  var backendPromise = null;
  function backend(IG) {
    if (backendPromise) return backendPromise;
    var loadLib = IG && IG.load ? IG.load : function () { return Promise.resolve(); };
    backendPromise = loadLib(['planck']).then(function () { return 'planck'; });
    return backendPromise;
  }
  function createWorld(kind, opts) { return new PlanckWorld(opts || {}); }

  root.IGPhysics = { backend: backend, createWorld: createWorld, wasmAllowed: wasmAllowed };
})(window);

