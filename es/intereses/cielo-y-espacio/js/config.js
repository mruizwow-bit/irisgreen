/* Cielo 3D · piloto R01 · CONFIGURACIÓN
   Observador fijo dentro de la esfera celeste. Aquí sólo hay números: la
   geometría está en esfera.js y el dibujo en escena.js. */
(function (g) {
  'use strict';

  /* ------------------------------------------------- R04.5 · rastro de error
     __IG_SCENE_ERROR__ es el sitio donde esta escena deja dicho por qué no ha
     arrancado, para que en el móvil de alguien quede rastro en vez de una
     pantalla en blanco sin explicación.

     AVISO HONESTO: en el repo de Iris Green este nombre NO aparece hoy. Se ha
     buscado y sale cero veces. Así que esto no es «el contrato del sitio»: es
     una convención que proponemos con este paquete. Si al montar el sitio
     prefiere otro nombre u otra forma, se cambia aquí y en nada más.

     Vale null mientras todo va bien. Cuando algo falla queda:
       { codigo, mensaje, cuando, detalle }
     · codigo   · una de SIN_WEBGL2, CONTEXTO_PERDIDO, SIN_CANVAS_2D, RECURSO
     · mensaje  · una frase corta en inglés, para registro, NO para la pantalla
     · cuando   · ISO 8601
     · detalle  · lo que se sepa; puede ir vacío
     Lo que se le enseña a la persona es otra cosa y está en copia.js.

     Sólo se guarda el PRIMER fallo: el que cuenta es el que rompió la cadena.
     Los siguientes se apilan en `despues` sin pisar al primero. */
  /* `g` es null cuando esto se carga desde node en el banco de unitarias:
     allí no hay escena que pueda fallar, así que no hay rastro que montar. */
  if (g && !('__IG_SCENE_ERROR__' in g)) g.__IG_SCENE_ERROR__ = null;
  if (g) g.IG_ESCENA_ERROR = function (codigo, mensaje, detalle) {
    var e = { codigo: codigo, mensaje: mensaje,
              cuando: new Date().toISOString(), detalle: detalle || null };
    if (g.__IG_SCENE_ERROR__) {
      (g.__IG_SCENE_ERROR__.despues = g.__IG_SCENE_ERROR__.despues || []).push(e);
    } else {
      g.__IG_SCENE_ERROR__ = e;
    }
    try {
      g.dispatchEvent(new CustomEvent('ig:scene-error', { detail: e }));
    } catch (_) { /* un navegador sin CustomEvent no impide guardar el rastro */ }
    return e;
  };

  var CFG = {

    /* --- Dos cosas distintas, y conviene no volver a mezclarlas -----------
       TOLERANCIA_ENTRADA_PX es puntería: cuánto se perdona al señalar una
       estrella con el dedo o el ratón, y cuánta diferencia de distancia hace
       falta para decidir a cuál de dos patrones se apuntaba. Está en píxeles
       porque describe la mano. NO aporta ni una estrella a la evidencia.

       EVIDENCIA.apertura_radio_grados es la región del CIELO que sustenta una
       identificación: un cono de radio angular fijo alrededor de la dirección
       señalada. En grados, no en píxeles: el mismo punto del cielo con la
       misma orientación decide lo mismo a 320, a 390 y a 1440. Es también el
       contorno que se dibuja, así que lo que se ve es lo que cuenta. */
    TOLERANCIA_ENTRADA_PX: 24,
    EVIDENCIA: {
      apertura_radio_grados: 6.0,
      minimo_puntos: 3,          /* puntos SEGUIDOS de la figura, por defecto */
      ventaja_minima: 1.5
    },

    /* Cámara: el observador no se mueve. Sólo cambia hacia dónde mira y
       cuánto cielo abarca. Sin roll, sin inercia, sin deriva. */
    CAMPO_VISION: { inicial: 60, minimo: 12, maximo: 95, paso: 1.3 },
    DEC_MAXIMA: 85,              /* no se mira al polo de canto */

    /* Píxeles de recorrido a partir de los cuales el gesto es orientación y
       no selección. Es desplazamiento, NO tiempo: una pulsación quieta sigue
       siendo una pulsación aunque dure. */
    UMBRAL_ARRASTRE: 6,

    /* Orientar con flechas, en grados por pulsación. Nunca mayor que la
       región de evidencia: con teclado no se puede saltar por encima de un
       patrón sin examinarlo. */
    PASO_TECLADO_GRADOS: 5,

    /* La rueda amplía cuando la escena tiene el foco y ya se ha actuado en
       ella, para no atrapar el scroll de quien sólo lee la página. */
    RUEDA_REQUIERE_FOCO: true,

    /* Movimiento. NONE actualiza de golpe y no interpola nada. */
    MOVIMIENTO: { NORMAL: 260, REDUCED: 90, NONE: 0 },

    /* Dibujo de estrellas: radio en píxeles por magnitud, a 1× de densidad. */
    ESTRELLA: { mag_min: -1.5, mag_max: 5.6, radio_max: 5.2, radio_min: 0.55 },
    UMBRAL_BRILLANTE: 3.2,

    CLAVE_GUARDADO: 'iris-green.cielo-3d.r02'
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = CFG;
  if (g) g.IG_CONFIG = CFG;
})(typeof window !== 'undefined' ? window : null);
