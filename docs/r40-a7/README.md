# R40-A7 · sistema audiovisual, activos y QA visual

Estado: **SPEC_READY_FOR_FREEZE_A2 · SIN CAMBIOS DE PRODUCTO**

Issue: #252 · Parent: #247

## Bases observadas
- `main`: `2e17ed3ae02e23a4fd734b00c10f843d14a19d4d`.
- A2 observado en PR #244: `bb1efb8608681b138e5ce8029a6d425eddcaed98`.
- El HEAD de A2 **no se congela aquí** y no es base de implementación hasta handoff explícito.
- Sistema Sabik observado: `sabik/iris-mount.css`, `sabik/iris-panel.html`, `sabik/R37_MOTION.md`.
- Rincón observado: `es/sitio-tranquilo/index.html`, `en/quiet-space/index.html`, `assets/rincon-calma.js`, `assets/rincon-acuario.js`, `assets/rincon-escenas-3d.js`, `assets/rincon-sonidos.js`.

## Entregables
1. `RINCON_ASSET_INVENTORY.md` — escenas, motores, miniaturas, audio y estado de procedencia.
2. `RINCON_AV_SPEC.md` — contrato audiovisual R40, activación, crossfade, reduced motion y equivalentes textuales.
3. `SABIK_VISUAL_SYSTEM_R40.md` — Sabik Glass y patrones de Taller/Intereses sin saturación de tarjetas.
4. `QA_VISUAL_R40.md` — checklist manual y automatizable para escenas claras/oscuras y componentes Sabik.
5. `scene-contract.v1.json` — contrato de escena consumible por implementación posterior.

## Límites
- 0 HTML/CSS/JS de producto modificados.
- 0 cambios en rama A2.
- 0 voz/TTS.
- 0 masters Sabik redibujados o recoloreados.
- 0 nuevos assets externos aprobados por A7.
- A4 (#250) todavía no ha entregado matriz READY/HOLD; cualquier audio/asset externo queda condicionado a esa entrega.
- Nada empieza solo. Audio y movimiento requieren acción explícita.
- No se declara conformidad WCAG/EN/ISO por esta especificación.

## Gate de implementación
Tras freeze A2:
1. registrar HEAD exacto;
2. cruzar cada asset con A4 READY/HOLD;
3. implementar por fases;
4. QA ES/EN escritorio+móvil;
5. aceptación de María antes de avanzar.
