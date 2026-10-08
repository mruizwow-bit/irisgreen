/* Mesa de inventar · Iris Green. La ficha se arma en esta pestaña y no se envía a ningún sitio. */
(function () {
  'use strict';
  var campoRegla = document.getElementById('mi-regla');
  if (!campoRegla) return;
  var lista = document.getElementById('mi-reglas');
  var sinReglas = document.getElementById('mi-sin-reglas');
  var salida = document.getElementById('mi-salida');
  var zona = document.getElementById('mi-zona-ficha');
  var aviso = document.getElementById('mi-aviso');
  var reglas = [];

  function decir(m) { aviso.textContent = m; }

  function pintarReglas() {
    lista.textContent = '';
    reglas.forEach(function (regla, i) {
      var li = document.createElement('li');
      var span = document.createElement('span');
      span.className = 'lista-reglas__texto';
      span.textContent = regla;
      var quitar = document.createElement('button');
      quitar.type = 'button';
      quitar.className = 'boton boton--secundario boton--pequeno';
      quitar.textContent = 'Quitar';
      quitar.setAttribute('aria-label', 'Quitar la regla ' + (i + 1) + ': ' + regla);
      quitar.addEventListener('click', function () {
        reglas.splice(i, 1);
        pintarReglas();
        decir('Regla quitada.');
        campoRegla.focus();
      });
      li.appendChild(span);
      li.appendChild(quitar);
      lista.appendChild(li);
    });
    sinReglas.hidden = reglas.length > 0;
  }

  function anadir() {
    var valor = campoRegla.value.trim();
    if (!valor) { decir('Escribe la regla antes de añadirla.'); campoRegla.focus(); return; }
    reglas.push(valor);
    campoRegla.value = '';
    pintarReglas();
    decir('Regla añadida.');
    campoRegla.focus();
  }

  document.getElementById('mi-anadir').addEventListener('click', anadir);
  campoRegla.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') { ev.preventDefault(); anadir(); }
  });

  function datos() {
    return {
      nombre: document.getElementById('mi-nombre').value.trim(),
      trata: document.getElementById('mi-trata').value.trim(),
      personas: document.getElementById('mi-personas').value.trim(),
      material: document.getElementById('mi-material').value.trim(),
      reglas: reglas.slice()
    };
  }

  function fila(padre, etiqueta, valor) {
    if (!valor) return;
    var p = document.createElement('p');
    var fuerte = document.createElement('strong');
    fuerte.textContent = etiqueta + ': ';
    p.appendChild(fuerte);
    p.appendChild(document.createTextNode(valor));
    padre.appendChild(p);
  }

  function pintarFicha() {
    var d = datos();
    if (!d.nombre && !d.trata && !d.reglas.length) {
      decir('Pon al menos el nombre o una regla para armar la ficha.');
      return null;
    }
    salida.textContent = '';
    var h = document.createElement('h3');
    h.textContent = d.nombre || 'Juego sin nombre todavía';
    salida.appendChild(h);
    fila(salida, 'De qué va', d.trata);
    fila(salida, 'Personas', d.personas);
    fila(salida, 'Material', d.material);
    if (d.reglas.length) {
      var t = document.createElement('p');
      t.appendChild(document.createElement('strong')).textContent = 'Reglas';
      salida.appendChild(t);
      var ol = document.createElement('ol');
      d.reglas.forEach(function (r) {
        var li = document.createElement('li');
        li.textContent = r;
        ol.appendChild(li);
      });
      salida.appendChild(ol);
    }
    zona.hidden = false;
    return d;
  }

  function comoTexto(d) {
    var lineas = [d.nombre || 'Juego sin nombre todavía', ''];
    if (d.trata) lineas.push('De qué va: ' + d.trata);
    if (d.personas) lineas.push('Personas: ' + d.personas);
    if (d.material) lineas.push('Material: ' + d.material);
    if (d.reglas.length) {
      lineas.push('', 'Reglas:');
      d.reglas.forEach(function (r, i) { lineas.push('  ' + (i + 1) + '. ' + r); });
    }
    lineas.push('', 'Ficha hecha en la mesa de inventar de Iris Green.');
    return lineas.join('\n');
  }

  document.getElementById('mi-ficha').addEventListener('click', function () {
    var d = pintarFicha();
    if (d) { decir('Ficha lista, más abajo.'); zona.scrollIntoView({ block: 'start' }); }
  });

  document.getElementById('mi-descargar').addEventListener('click', function () {
    var d = pintarFicha();
    if (!d) return;
    var blob = new Blob([comoTexto(d)], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (d.nombre ? d.nombre.replace(/[^\wáéíóúñü -]/gi, '').trim().replace(/\s+/g, '-').toLowerCase() : 'mi-juego') + '.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    decir('Ficha descargada.');
  });

  document.getElementById('mi-imprimir').addEventListener('click', function () {
    var d = pintarFicha();
    if (!d) return;
    decir('Preparando la impresión de la ficha.');
    window.print();
  });

  pintarReglas();
})();
