/* Iris Green · R44 · retos del Taller (Ola A · A0).
   Espacio de nombres propio: no toca `taller-retos.json`, que son las 72
   propuestas de papel y lapiz del Taller heredado, ni su interfaz.
   Sin almacenamiento: el estado vive en la pestana y se pierde al cerrarla,
   igual que el resto del Taller (OBS-R42-TALLER-STORAGE-01). */
(function () {
  'use strict';
  var D = document;
  if (D.getElementById('igr44')) return;
  /* El ID lo escribe el generador desde el propio fichero de datos: emparejar
     por nombre de motor no vale, porque Ritmo monta el motor `musica` y Juegos
     de mesa el motor `juegosmesa`. */
  var app0 = D.getElementById('igt-app');
  var retoId = app0 && app0.getAttribute('data-r44-reto');
  if (!retoId) return;
  var en = String(D.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var L = en
    ? { reto: 'Challenge', pasos: 'Steps', alternativa: 'If you would rather not drag',
        criterio: 'You are done when', estado: 'State', artefacto: 'What you take away',
        s0: 'Not started', s1: 'In progress', s2: 'Done',
        empezado: 'Challenge started.', empezadoFoco: 'Challenge started. You are now on the studio canvas.', terminado: 'Challenge marked as done.',
        reiniciar: 'Start over', fuente: 'Challenge {id} of the R44 matrix' }
    : { reto: 'Reto', pasos: 'Pasos', alternativa: 'Si prefieres no arrastrar',
        criterio: 'Has terminado cuando', estado: 'Estado', artefacto: 'Lo que te llevas',
        s0: 'Sin empezar', s1: 'En curso', s2: 'Terminado',
        empezado: 'Reto empezado.', empezadoFoco: 'Reto empezado. Estás en el lienzo del estudio.', terminado: 'Reto marcado como terminado.',
        reiniciar: 'Empezar de nuevo', fuente: 'Reto {id} de la matriz R44' };

  function h(tag, attrs, kids) {
    var el = D.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') el.textContent = attrs[k];
      else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (k) { if (k) el.appendChild(k); });
    return el;
  }

  fetch('/assets/data/r44-retos.json').then(function (r) { return r.json(); }).then(function (data) {
    var reto = (data.retos || []).filter(function (x) { return x.id === retoId; })[0];
    if (!reto) return;
    var c = en ? reto.en : reto.es;
    var estado = 0;

    var sec = h('section', { id: 'igr44', class: 'igr44', 'aria-labelledby': 'igr44-t',
                             'data-estado': 'sin-empezar' });
    /* Mini-escena: el reto se propone enseñando lo que sales llevando, no
       solo contandolo. Trazo en currentColor, asi que sirve en LIGHT y en
       DARK NAVY sin escribir un color. */
    var escena = null;
    if (reto.escena) {
      escena = h('div', { class: 'igr44-escena' });
      escena.innerHTML = reto.escena;
      var pie = h('p', { class: 'igr44-escena-pie' });
      pie.appendChild(h('strong', { text: L.artefacto + ': ' }));
      pie.appendChild(D.createTextNode(en ? reto.artefacto_en : reto.artefacto_es));
      escena.appendChild(pie);
    }
    var cab = h('div', { class: 'igr44-cab' }, [
      h('div', { class: 'igr44-titulo' }, [
        h('p', { class: 'igr44-eyebrow', text: L.reto + ' · ' + reto.id }),
        h('h2', { id: 'igr44-t', text: c.titulo }),
        h('p', { class: 'igr44-lede', text: c.entradilla })
      ]),
      escena
    ]);
    var pasos = h('ol', { class: 'igr44-pasos' });
    (c.pasos || []).forEach(function (p) { pasos.appendChild(h('li', { text: p })); });

    var cuerpo = h('div', { class: 'igr44-cuerpo' }, [
      h('h3', { class: 'igr44-h3', text: L.pasos }), pasos,
      c.alternativa ? h('p', { class: 'igr44-nota' }, [
        h('strong', { text: L.alternativa + ': ' }), D.createTextNode(c.alternativa)
      ]) : null,
      h('h3', { class: 'igr44-h3', text: L.criterio }),
      h('p', { class: 'igr44-crit', text: c.criterio }),
    ]);

    var etiqueta = h('span', { class: 'igr44-pill', text: L.s0 });
    var vivo = h('p', { class: 'igr44-sr', role: 'status', 'aria-live': 'polite' });
    var accion = h('button', { type: 'button', class: 'igr44-bot', text: c.cta });
    var reinicio = h('button', { type: 'button', class: 'igr44-bot igr44-sec', text: L.reiniciar, hidden: 'hidden' });

    function pinta() {
      var nombres = [L.s0, L.s1, L.s2], claves = ['sin-empezar', 'en-curso', 'terminado'];
      etiqueta.textContent = nombres[estado];
      sec.setAttribute('data-estado', claves[estado]);
      accion.textContent = estado === 0 ? c.cta : c.cta_fin;
      accion.hidden = estado === 2;
      reinicio.hidden = estado !== 2;
    }
    /* Empezar tiene que entrar de verdad en el taller, no solo cambiar una
       etiqueta: lleva el foco al lienzo del estudio y avisa al motor, que
       puede cargar un punto de partida. Sin puntuacion y sin premio. */
    function entrar() {
      /* Entrar donde de verdad se trabaja. El lienzo solo es enfocable cuando
         su rol es `application`: en los estudios de texto no lo es, asi que
         ahi el sitio correcto es el propio editor. */
      var app = D.getElementById('igt-app');
      var destino = null;
      if (app) {
        destino = app.querySelector('textarea, [contenteditable="true"]')
               || app.querySelector('.igs-viewport[tabindex]')
               || app.querySelector('.igs-viewport')
               || app;
      }
      D.dispatchEvent(new CustomEvent('ig:r44-reto', {
        detail: { id: reto.id, estudio: reto.estudio, fase: 'empezar' }
      }));
      if (destino) {
        var enfocable = /^(TEXTAREA|INPUT|SELECT|BUTTON)$/.test(destino.tagName)
          || destino.hasAttribute('tabindex') || destino.isContentEditable;
        if (!enfocable) destino.setAttribute('tabindex', '-1');
        destino.focus({ preventScroll: false });
        destino.scrollIntoView({ block: 'center',
          behavior: (D.documentElement.dataset.igMotion === 'off') ? 'auto' : 'smooth' });
      }
      return !!destino;
    }
    accion.addEventListener('click', function () {
      var previo = estado;
      estado = estado === 0 ? 1 : 2;
      pinta();
      if (previo === 0) {
        var ok = entrar();
        vivo.textContent = ok ? L.empezadoFoco : L.empezado;
      } else {
        vivo.textContent = L.terminado;
        D.dispatchEvent(new CustomEvent('ig:r44-reto', {
          detail: { id: reto.id, estudio: reto.estudio, fase: 'terminar' }
        }));
        reinicio.focus();
      }
    });
    reinicio.addEventListener('click', function () {
      estado = 0; vivo.textContent = ''; pinta(); accion.focus();
    });

    var pie = h('div', { class: 'igr44-pie' }, [
      h('p', { class: 'igr44-estado' }, [ h('span', { text: L.estado + ': ' }), etiqueta ]),
      accion, reinicio, vivo
    ]);
    sec.appendChild(cab); sec.appendChild(cuerpo); sec.appendChild(pie);
    pinta();

    /* Workspace-first: el reto se monta DESPUES de la herramienta. */
    var app = D.getElementById('igt-app');
    if (app && app.parentNode) app.parentNode.insertBefore(sec, app.nextSibling);
    else (D.getElementById('main') || D.body).appendChild(sec);
  }).catch(function () { /* sin reto, el estudio funciona igual */ });
})();
