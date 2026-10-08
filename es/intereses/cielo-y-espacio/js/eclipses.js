/* Cielo y Espacio · R03 · ECLIPSES · KEEP.

   El conjunto canónico V2 estaba aprobado y aquí no se reabre: seis tipos, dos
   secuencias didácticas, títulos y textos alternativos en ES y EN, tal como se
   entregaron. Lo único que pone R03 es la puerta: que se llegue desde el mismo
   producto, con el mismo idioma, el mismo foco y el mismo cuaderno.

   Lo que estos dibujos representan es el TIPO de eclipse. No son un eclipse
   concreto visto desde un sitio concreto, y así se dice en la página. */
(function (g) {
  'use strict';
  var P = null, D = g.IG_ECLIPSES, el = {}, construido = false;
  function t() { return P.t(); }
  function es() { return P.estado().idioma === 'es'; }

  function nodo(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto !== undefined) n.textContent = texto;
    return n;
  }

  function construir() {
    var L = t(), raiz = document.getElementById('eclipses');
    raiz.textContent = '';
    var cab = nodo('div', 'ig-escena-cab');
    el.volver = nodo('button', 'ig-btn ig-pequeno', L.volver_a_la_portada);
    el.volver.type = 'button';
    el.volver.addEventListener('click', function () { P.mostrarPantalla('portada'); });
    cab.appendChild(el.volver);
    raiz.appendChild(cab);

    el.intro = nodo('p', 'ig-objetivo', '');
    raiz.appendChild(el.intro);

    el.lista = nodo('div', 'ig-eclipses');
    raiz.appendChild(el.lista);

    el.nota = nodo('p', 'ig-nota', '');
    raiz.appendChild(el.nota);
    construido = true;
  }

  function tarjeta(item, esSecuencia) {
    var L = t(), art = nodo('article', 'ig-eclipse');
    var h = nodo('h2', 'ig-eclipse-titulo');
    var b = nodo('button', 'ig-eclipse-btn', es() ? item.titulo_es : item.titulo_en);
    b.type = 'button';
    b.setAttribute('aria-expanded', 'false');
    h.appendChild(b); art.appendChild(h);

    var caja = nodo('div', 'ig-eclipse-cuerpo');
    caja.hidden = true;
    var img = document.createElement('img');
    img.className = 'ig-eclipse-img';
    img.src = item.archivo;
    img.alt = es() ? item.alt_es : item.alt_en;
    img.loading = 'lazy';
    caja.appendChild(img);
    caja.appendChild(nodo('p', 'ig-nota', es() ? item.alt_es : item.alt_en));
    if (esSecuencia) caja.appendChild(nodo('p', 'ig-nota', L.eclipse_secuencia_nota));
    art.appendChild(caja);

    b.addEventListener('click', function () {
      var abierto = !caja.hidden;
      caja.hidden = abierto;
      b.setAttribute('aria-expanded', String(!abierto));
      if (!abierto) {
        P.registrarHallazgo('eclipses', item.id, true);
        P.anunciar(L.eclipse_abierto(es() ? item.titulo_es : item.titulo_en));
      }
    });
    return art;
  }

  function pintar() {
    var L = t();
    el.volver.textContent = L.volver_a_la_portada;
    el.intro.textContent = L.eclipse_intro;
    el.lista.textContent = '';
    var h1 = nodo('h2', 'ig-h2', L.eclipse_tipos);
    el.lista.appendChild(h1);
    D.tipos.forEach(function (x) { el.lista.appendChild(tarjeta(x, false)); });
    if (D.secuencias.length) {
      var h2 = nodo('h2', 'ig-h2', L.eclipse_secuencias);
      el.lista.appendChild(h2);
      D.secuencias.forEach(function (x) { el.lista.appendChild(tarjeta(x, true)); });
    }
    el.nota.textContent = L.eclipse_declaracion;
  }

  function abrir() {
    if (!construido) construir();
    pintar();
  }
  function cuandoListo() {
    if (!g.IG_PRODUCTO) { setTimeout(cuandoListo, 10); return; }
    P = g.IG_PRODUCTO;
    P.registrarBloque({
      id: 'eclipses', seccion: 'eclipses',
      clave_nombre: 'bloque_eclipses', clave_resumen: 'bloque_eclipses_resumen',
      abrir: abrir, cerrar: function () {},
      aplicarIdioma: function () { if (construido) pintar(); },
      foco: function () { return el.volver; },
      total: function () { return D ? D.tipos.length + D.secuencias.length : 0; }
    });
  }
  if (D) cuandoListo();
})(window);
