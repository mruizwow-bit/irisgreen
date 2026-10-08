/* Se ejecuta antes de pintar: aplica el ajuste de movimiento guardado en este navegador.
   Es el único dato que se guarda, vive sólo aquí y no viaja a ninguna parte. */
(function () {
  try {
    var v = window.localStorage.getItem('ig-movimiento');
    if (v === 'none' || v === 'reduced' || v === 'normal') {
      document.documentElement.setAttribute('data-movimiento', v);
    }
  } catch (e) { /* navegación privada o almacenamiento bloqueado: se sigue sin ajuste */ }
})();
