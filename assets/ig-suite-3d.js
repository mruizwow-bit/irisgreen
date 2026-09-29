/* Iris Green · El taller · utilidades 3D comunes (R43).
   Three.js con WebGPURenderer: usa WebGPU si el navegador lo ofrece y funciona;
   si no, el mismo renderizador pasa a WebGL 2. Dibujo bajo demanda (no gasta batería en reposo). */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;

  function createRenderer(THREE, host) {
    function test(r) {
      var sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
      sc.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial()));
      r.setSize(8, 8, false); r.render(sc, cam);
    }
    function make(forceWebGL) {
      var r = new THREE.WebGPURenderer({ antialias: true, forceWebGL: !!forceWebGL });
      return r.init().then(function () { test(r); return r; });
    }
    return make(false).catch(function () { return make(true); }).then(function (r) {
      r.setPixelRatio(Math.min(2, root.devicePixelRatio || 1));
      r.domElement.setAttribute('aria-hidden', 'true');
      r.domElement.classList.add('igs-3d-canvas');
      host.appendChild(r.domElement);
      r.igsBackend = r.backend && r.backend.isWebGPUBackend ? 'WebGPU' : 'WebGL 2';
      return r;
    });
  }

  /* Bucle bajo demanda: solo dibuja cuando algo cambia. */
  function Loop(renderer, scene, camera, host) {
    var self = this, frame = 0;
    this.renderer = renderer; this.scene = scene; this.camera = camera;
    this.request = function () { if (!frame) frame = root.requestAnimationFrame(function () { frame = 0; if (self.before) self.before(); renderer.render(scene, self.camera); if (self.after) self.after(); }); };
    function resize() {
      var w = Math.max(10, host.clientWidth), h = Math.max(10, host.clientHeight);
      renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
      if (self.camera.isPerspectiveCamera) { self.camera.aspect = w / h; self.camera.updateProjectionMatrix(); }
      else if (self.camera.isOrthographicCamera && self.onOrthoResize) self.onOrthoResize(w, h);
      self.request();
    }
    this.resize = resize;
    if (root.ResizeObserver) new ResizeObserver(resize).observe(host);
    resize();
  }

  function lights(THREE, scene) {
    var hemi = new THREE.HemisphereLight(0xffffff, 0x9aa7b4, 1.6); scene.add(hemi);
    var sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(120, 220, 160); scene.add(sun);
    var fill = new THREE.DirectionalLight(0xffffff, 0.7); fill.position.set(-160, 80, -120); scene.add(fill);
    return { hemi: hemi, sun: sun, fill: fill };
  }

  function download(ctx, data, name, type) { ctx.download(data instanceof Blob ? data : new Blob([data], { type: type }), name); }

  /* Exportaciones de mallas horneadas (transformaciones aplicadas). Para impresión: Z hacia arriba. */
  function bakedGroup(THREE, meshes, zUp) {
    var g = new THREE.Group();
    meshes.forEach(function (m) {
      m.updateMatrixWorld(true);
      var geo = m.geometry.clone(); geo.applyMatrix4(m.matrixWorld);
      if (zUp) geo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
      var mm = new THREE.Mesh(geo, m.material.clone()); mm.name = m.name || '';
      g.add(mm);
    });
    return g;
  }
  function exportSTL(THREE, ctx, meshes, name) { var g = bakedGroup(THREE, meshes, true); var data = new THREE.STLExporter().parse(g, { binary: true }); download(ctx, new Blob([data], { type: 'model/stl' }), name + '.stl'); }
  function exportOBJ(THREE, ctx, meshes, name) { var g = bakedGroup(THREE, meshes, false); var data = '# IRIS GREEN · irisgreen.eu\n' + new THREE.OBJExporter().parse(g); download(ctx, data, name + '.obj', 'model/obj'); }
  function exportGLB(THREE, ctx, meshes, name) {
    var g = bakedGroup(THREE, meshes, false); g.name = name;
    return new Promise(function (resolve, reject) {
      new THREE.GLTFExporter().parse(g, function (res) { download(ctx, new Blob([res], { type: 'model/gltf-binary' }), name + '.glb'); resolve(); }, function (err) { reject(err); }, { binary: true });
    });
  }

  IG.ThreeD = { createRenderer: createRenderer, Loop: Loop, lights: lights, exportSTL: exportSTL, exportOBJ: exportOBJ, exportGLB: exportGLB, bakedGroup: bakedGroup };
})(window);