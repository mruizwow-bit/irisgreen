# R63 · ASTRA · SAKURA · VISUAL PASS · CIERRE RUNTIME + HANDOFF

Fecha: 29/09/2026
Issue: #328
Estado: `R63_SAKURA_VISUAL_PASS_RUNTIME_HANDOFF_REQUIRED`

## Decisión

La dirección visual Sakura pasa.

No más rework visual en esta fase.

KEEP:
- sala sensorial circular;
- canopy LIGHT/NAVY horneado;
- ramas/racimos;
- óculo;
- pared;
- tubo;
- mobiliario;
- cove;
- pétalos;
- gobos/reflejos;
- 1440/390.

Las diferencias frente a la referencia fotográfica son aceptables y no deben perseguirse con blur/bloom/fotorealismo artificial.

## Cierre obligatorio

1. Evidencia temporal NORMAL y REDUCIDO.
2. SIN_MOVIMIENTO: 0 RAF continuo.
3. Reconciliar tiers A/B/C/D con los niveles reales; no declarar un tier vacío.
4. Test de shader compile fail → fallback diagnosticado, no pantalla vacía silenciosa.
5. Test de texture upload fail → fallback diagnosticado.
6. Test resource-late-load en SIN_MOVIMIENTO: repaint único y después 0 RAF.
7. start/stop/start sin listeners/recursos duplicados.
8. 0 autoplay, 0 red externa, ES/EN, 1440/390/320.
9. keyboard/touch/focus/forced-colors/reflow.
10. performance: `PENDING_HARDWARE_QA` si no hay dispositivo representativo.

## Entrega

Preparar handoff/ZIP reproducible SOLO después de esos checks:
- source;
- assets;
- generator canopy;
- hashes/manifest;
- QA;
- videos;
- fallbacks;
- instrucciones;
- base/head/diff.

Marcador:
`R63_CLAUDE_SAKURA_RUNTIME_HANDOFF_READY_FOR_ASTRA_A2`

STOP.

No push propio.
No main.
No producción.
No siguiente sala.

A2 integra después de verificación Astra.
HUMAN QA María en Deploy Preview.
