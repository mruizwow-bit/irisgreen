/* Mesa de escribir · Iris Green. Todo ocurre en esta pestaña: nada se envía ni se guarda. */
(function () {
  'use strict';
  var texto = document.getElementById('me-texto');
  if (!texto) return;
  var cuenta = document.getElementById('me-cuenta');
  var aviso = document.getElementById('me-aviso');
  var btDeshacer = document.getElementById('me-deshacer');
  var vaciado = '';

  function decir(msg) { if (aviso) aviso.textContent = msg; }

  function contar() {
    var valor = texto.value;
    var palabras = valor.trim() ? valor.trim().split(/\s+/).length : 0;
    var lineas = valor ? valor.split('\n').length : 0;
    cuenta.textContent = palabras + (palabras === 1 ? ' palabra' : ' palabras') + ' · ' +
      lineas + (lineas === 1 ? ' línea' : ' líneas');
  }

  function insertar(fragmento) {
    var ini = texto.selectionStart, fin = texto.selectionEnd, valor = texto.value;
    var antes = valor.slice(0, ini), despues = valor.slice(fin);
    var separa = antes && !/\s$/.test(antes) ? ' ' : '';
    texto.value = antes + separa + fragmento + ' ' + despues;
    var pos = (antes + separa + fragmento + ' ').length;
    texto.focus();
    texto.setSelectionRange(pos, pos);
    contar();
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-arranque]'), function (b) {
    b.addEventListener('click', function () { insertar(b.getAttribute('data-arranque')); });
  });

  texto.addEventListener('input', function () { contar(); decir(''); });

  function descargar(nombre, contenido) {
    var blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = nombre;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  document.getElementById('me-descargar').addEventListener('click', function () {
    if (!texto.value.trim()) { decir('Todavía no hay nada escrito.'); return; }
    descargar('mi-texto.txt', texto.value);
    decir('Descargado como mi-texto.txt.');
  });

  document.getElementById('me-copiar').addEventListener('click', function () {
    if (!texto.value) { decir('Todavía no hay nada escrito.'); return; }
    function viejo() {
      texto.focus(); texto.select();
      try { document.execCommand('copy'); decir('Copiado.'); }
      catch (e) { decir('No se ha podido copiar. Selecciona el texto y cópialo tú.'); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto.value).then(function () { decir('Copiado.'); }, viejo);
    } else { viejo(); }
  });

  document.getElementById('me-vaciar').addEventListener('click', function () {
    if (!texto.value) { decir('Ya estaba vacío.'); return; }
    vaciado = texto.value;
    texto.value = '';
    btDeshacer.hidden = false;
    contar();
    decir('Vaciado. Puedes deshacerlo.');
    texto.focus();
  });

  btDeshacer.addEventListener('click', function () {
    if (!vaciado) return;
    texto.value = vaciado;
    vaciado = '';
    btDeshacer.hidden = true;
    contar();
    decir('Recuperado.');
    texto.focus();
  });

  contar();
})();
