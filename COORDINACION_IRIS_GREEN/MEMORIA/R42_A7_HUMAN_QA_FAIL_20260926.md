# R42 · Agente 7 · HUMAN QA FAIL · 26/09/2026

**Estado:** `R42_A7_HUMAN_QA_FAIL_REBUILD_REQUIRED`.

María prueba la preview integrada del Rincón R42 y rechaza la entrega.

## Fallos reportados
- escenas/vídeos con calidad visual muy baja;
- ausencia de sensación inmersiva real;
- interfaz pobre;
- botones y controles solapados.

## Diagnóstico
El trabajo A7 confundió modernización tecnológica con calidad de experiencia. El motor procedural/GPU no alcanza por sí mismo la presencia audiovisual solicitada. Además, el resultado integrado con el app shell R42 no recibió un gate visual de composición suficiente; el contrato aislado de A7 no detectó las colisiones de controles.

## Consecuencia
`R42_A7_QUIET_SPACE_IMMERSIVE_READY_FOR_A2` queda superseded como estado de aceptación.

La siguiente iteración debe:
- partir de la preview integrada real, no del componente aislado;
- resolver arquitectura/interfaz y solapamientos antes de añadir efectos;
- elevar sustancialmente la dirección audiovisual hacia experiencia inmersiva relajante;
- mantener ES/EN, accesibilidad, reduced motion, fallback y no-autoplay;
- volver a HUMAN QA de María antes de cerrar.

No PASS por CI/hashes. No producción.
