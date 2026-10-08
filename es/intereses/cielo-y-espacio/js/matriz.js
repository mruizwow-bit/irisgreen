/* Cielo y Espacio · R03.1 · MATRICES.

   Lo mínimo para una cámara de verdad: perspectiva, mirar desde un sitio hacia
   otro, y componer traslación, rotación y escala de cada cuerpo. Columna mayor,
   como espera WebGL. Sin dependencias: el paquete se abre con file://. */
(function (g) {
  'use strict';
  function identidad() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
  function multiplicar(a, b) {
    var o = new Float32Array(16);
    for (var c = 0; c < 4; c++) {
      for (var f = 0; f < 4; f++) {
        var s = 0;
        for (var k = 0; k < 4; k++) s += a[k * 4 + f] * b[c * 4 + k];
        o[c * 4 + f] = s;
      }
    }
    return o;
  }
  function perspectiva(fovY, aspecto, cerca, lejos) {
    var f = 1 / Math.tan(fovY / 2), nf = 1 / (cerca - lejos);
    var o = new Float32Array(16);
    o[0] = f / aspecto; o[5] = f; o[10] = (lejos + cerca) * nf;
    o[11] = -1; o[14] = 2 * lejos * cerca * nf;
    return o;
  }
  function normalizar(v) {
    var n = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / n, v[1] / n, v[2] / n];
  }
  function cruz(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function restar(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function punto(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function mirarDesde(ojo, centro, arriba) {
    var f = normalizar(restar(centro, ojo));
    var s = normalizar(cruz(f, arriba));
    var u = cruz(s, f);
    var o = new Float32Array(16);
    o[0] = s[0]; o[4] = s[1]; o[8] = s[2];
    o[1] = u[0]; o[5] = u[1]; o[9] = u[2];
    o[2] = -f[0]; o[6] = -f[1]; o[10] = -f[2];
    o[12] = -punto(s, ojo); o[13] = -punto(u, ojo); o[14] = punto(f, ojo);
    o[15] = 1;
    return o;
  }
  function trasladar(x, y, z) {
    var o = identidad(); o[12] = x; o[13] = y; o[14] = z; return o;
  }
  function escalar(s) {
    var o = identidad(); o[0] = s; o[5] = s; o[10] = s; return o;
  }
  function escalar3(x, y, z) {
    var o = identidad(); o[0] = x; o[5] = y; o[10] = z; return o;
  }
  function rotarX(a) {
    var c = Math.cos(a), s = Math.sin(a), o = identidad();
    o[5] = c; o[6] = s; o[9] = -s; o[10] = c; return o;
  }
  function rotarY(a) {
    var c = Math.cos(a), s = Math.sin(a), o = identidad();
    o[0] = c; o[2] = -s; o[8] = s; o[10] = c; return o;
  }
  function rotarZ(a) {
    var c = Math.cos(a), s = Math.sin(a), o = identidad();
    o[0] = c; o[1] = s; o[4] = -s; o[5] = c; return o;
  }
  /* Matriz normal = inversa transpuesta del 3×3 del modelo. R04 introduce
     escala no uniforme por achatamiento, así que copiar la submatriz ya no
     sería correcto. */
  function normal3(m) {
    var a00=m[0], a01=m[4], a02=m[8], a10=m[1], a11=m[5], a12=m[9], a20=m[2], a21=m[6], a22=m[10];
    var b01=a22*a11-a12*a21, b11=-a22*a10+a12*a20, b21=a21*a10-a11*a20;
    var det=a00*b01+a01*b11+a02*b21; if (Math.abs(det)<1e-12) det=1; var id=1/det;
    var i00=b01*id, i01=(-a22*a01+a02*a21)*id, i02=(a12*a01-a02*a11)*id;
    var i10=b11*id, i11=(a22*a00-a02*a20)*id, i12=(-a12*a00+a02*a10)*id;
    var i20=b21*id, i21=(-a21*a00+a01*a20)*id, i22=(a11*a00-a01*a10)*id;
    return new Float32Array([i00,i01,i02,i10,i11,i12,i20,i21,i22]);
  }
  function aplicar(m, v) {
    return [m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12],
            m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13],
            m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14]];
  }
  /* Igual que aplicar, pero devolviendo w: hace falta para proyectar un punto
     del mundo a la pantalla, donde la división por w ES la perspectiva. */
  function aplicar4(m, v) {
    var w = v[3] === undefined ? 1 : v[3];
    return [m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * w,
            m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * w,
            m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * w,
            m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * w];
  }
  g.IG_MATRIZ = { identidad: identidad, aplicar4: aplicar4, multiplicar: multiplicar, perspectiva: perspectiva,
                  mirarDesde: mirarDesde, trasladar: trasladar, escalar: escalar, escalar3: escalar3,
                  rotarX: rotarX, rotarY: rotarY, rotarZ: rotarZ, normal3: normal3,
                  normalizar: normalizar, cruz: cruz, punto: punto, restar: restar,
                  aplicar: aplicar };
})(window);
