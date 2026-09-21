# SABIK · B3 MOTION R1 · CURRENT PREVIEW

**Estado:** CANDIDATE  
**Base real:** `fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`  
**S4:** preservado y verificado por lock de blobs.

## Núcleo único

**PRESENTE · ORIENTAR · TRANSICIÓN · PAUSA · CONFIRMAR**

No existen estados B3 para búsqueda, composición, voz, error, riesgo o loading.

## Contrato

Los tokens viven en `sabik/b3-motion-tokens.json` y definen por estado:

- duración;
- easing;
- amplitud;
- traslación;
- rotación;
- escala;
- opacidad;
- entrada/salida;
- interrupción;
- matriz 5×5 de transiciones.

PRESENTE se asienta y queda quieto.  
ORIENTAR no rebota ni se convierte en flecha.  
TRANSICIÓN no gira en loop ni representa carga.  
PAUSA permanece contenida y visible.  
CONFIRMAR no celebra ni premia.

## Modos

- NORMAL
- REDUCIDO
- SIN_MOVIMIENTO

`prefers-reduced-motion: reduce`, la preferencia global de Iris Green o la degradación conservadora por equipo impiden NORMAL. La elección manual puede fijar SIN_MOVIMIENTO.

La función, el texto y Safety permanecen accesibles en los tres niveles.

## Rendimiento

Web Animations API. Solo `transform` y `opacity`. Sin `requestAnimationFrame` continuo, blur animado, layout animado, spinner, respiración ni latido.

**NO MERGE · NO DEPLOY.**
