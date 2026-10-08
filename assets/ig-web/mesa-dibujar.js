/* Mesa de dibujar · Iris Green. El dibujo vive en esta pestaña: no se envía ni se guarda solo. */
(function () {
  'use strict';
  var lienzo = document.getElementById('md-lienzo');
  if (!lienzo || !lienzo.getContext) return;
  var ctx = lienzo.getContext('2d');
  var estado = document.getElementById('md-estado');
  var FONDO = '#15304A';
  var color = '#EEF4F8';
  var grosor = 8;
  var borrando = false;
  var pasos = [];
  var dibujando = false;
  var ultimo = null;
  var lapiz = { x: lienzo.width / 2, y: lienzo.height / 2, bajado: false };

  function decir(m) { if (estado) estado.textContent = m; }

  function limpiar() {
    ctx.fillStyle = FONDO;
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
  }

  function guardarPaso() {
    try { pasos.push(ctx.getImageData(0, 0, lienzo.width, lienzo.height)); }
    catch (e) { return; }
    if (pasos.length > 12) pasos.shift();
  }

  function preparar() {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = borrando ? FONDO : color;
    ctx.lineWidth = grosor;
  }

  function punto(ev) {
    var caja = lienzo.getBoundingClientRect();
    return {
      x: (ev.clientX - caja.left) * (lienzo.width / caja.width),
      y: (ev.clientY - caja.top) * (lienzo.height / caja.height)
    };
  }

  function trazo(desde, hasta) {
    preparar();
    ctx.beginPath();
    ctx.moveTo(desde.x, desde.y);
    ctx.lineTo(hasta.x, hasta.y);
    ctx.stroke();
  }

  lienzo.addEventListener('pointerdown', function (ev) {
    if (ev.button !== undefined && ev.button !== 0) return;
    guardarPaso();
    dibujando = true;
    ultimo = punto(ev);
    trazo(ultimo, { x: ultimo.x + 0.01, y: ultimo.y });
    if (lienzo.setPointerCapture) { try { lienzo.setPointerCapture(ev.pointerId); } catch (e) {} }
    ev.preventDefault();
  });

  lienzo.addEventListener('pointermove', function (ev) {
    if (!dibujando) return;
    var p = punto(ev);
    trazo(ultimo, p);
    ultimo = p;
    ev.preventDefault();
  });

  function soltar() { dibujando = false; ultimo = null; }
  lienzo.addEventListener('pointerup', soltar);
  lienzo.addEventListener('pointercancel', soltar);
  lienzo.addEventListener('pointerleave', soltar);

  /* Dibujar con el teclado: flechas para mover, Intro para bajar o subir el lápiz. */
  lienzo.addEventListener('keydown', function (ev) {
    var paso = ev.shiftKey ? 40 : 12;
    var dx = 0, dy = 0;
    if (ev.key === 'ArrowLeft') dx = -paso;
    else if (ev.key === 'ArrowRight') dx = paso;
    else if (ev.key === 'ArrowUp') dy = -paso;
    else if (ev.key === 'ArrowDown') dy = paso;
    else if (ev.key === 'Enter' || ev.key === ' ') {
      if (!lapiz.bajado) guardarPaso();
      lapiz.bajado = !lapiz.bajado;
      decir(lapiz.bajado ? 'Lápiz bajado. Mueve con las flechas para dibujar.'
                         : 'Lápiz levantado. Flechas para mover, Intro para bajar el lápiz.');
      ev.preventDefault();
      return;
    } else { return; }
    ev.preventDefault();
    var destino = {
      x: Math.min(lienzo.width, Math.max(0, lapiz.x + dx)),
      y: Math.min(lienzo.height, Math.max(0, lapiz.y + dy))
    };
    if (lapiz.bajado) trazo({ x: lapiz.x, y: lapiz.y }, destino);
    lapiz.x = destino.x;
    lapiz.y = destino.y;
    if (!lapiz.bajado) decir('Lápiz levantado en ' + Math.round(lapiz.x) + ', ' + Math.round(lapiz.y) + '.');
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-color]'), function (b) {
    b.addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('[data-color]'), function (o) {
        o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
      });
      color = b.getAttribute('data-color');
      borrando = false;
      Array.prototype.forEach.call(document.querySelectorAll('[data-borrar]'), function (o) {
        o.setAttribute('aria-pressed', 'false');
      });
      decir('Color elegido: ' + b.textContent.trim() + '.');
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-grosor]'), function (b) {
    b.addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('[data-grosor]'), function (o) {
        o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
      });
      grosor = parseInt(b.getAttribute('data-grosor'), 10) || 8;
      borrando = b.hasAttribute('data-borrar');
      decir(borrando ? 'Borrador elegido.' : 'Grosor elegido: ' + b.textContent.trim() + '.');
    });
  });

  document.getElementById('md-deshacer').addEventListener('click', function () {
    var paso = pasos.pop();
    if (!paso) { decir('No hay nada que deshacer.'); return; }
    ctx.putImageData(paso, 0, 0);
    decir('Deshecho el último trazo.');
  });

  document.getElementById('md-limpiar').addEventListener('click', function () {
    guardarPaso();
    limpiar();
    decir('Lienzo limpio.');
  });

  document.getElementById('md-guardar').addEventListener('click', function () {
    var a = document.createElement('a');
    try { a.href = lienzo.toDataURL('image/png'); }
    catch (e) { decir('No se ha podido guardar la imagen en este navegador.'); return; }
    a.download = 'mi-dibujo.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    decir('Dibujo guardado como mi-dibujo.png.');
  });

  limpiar();
})();
