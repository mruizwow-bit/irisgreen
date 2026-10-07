# LUMEN · FARO R04.1 · TRIÁNGULOS PERSONAJES PASS

Fecha: 07/10/2026

Estado:
`FARO_R04_1_CHARACTER_TRIANGLE_BUDGET_PASS`

## Base

Se continúa sobre:
`EL_TALLER_DE_LAS_ISLAS_3D_R03_NPC_6_OF_6`

No se reconstruye jugabilidad.

## Resultado medido

| Personaje | Triángulos | Tope | Estado |
|---|---:|---:|---|
| Vera | 15.000 | 15.000 | PASS |
| Lili | 11.998 | 12.000 | PASS |
| Teo | 11.999 | 12.000 | PASS |
| Nara | 11.999 | 12.000 | PASS |
| Leo | 11.998 | 12.000 | PASS |
| Inés | 11.995 | 12.000 | PASS |
| Sol | 11.994 | 12.000 | PASS |

## Método

- simplificación de geometría preservando atributos de skinning;
- esqueleto/skin conservados;
- seis NPC mantienen 30 nodos, 1 skin y 11/11 huesos humanoides clave;
- los clips `Walking` embebidos de los NPC se retiran porque R02/R03 ya asignan locomoción a `js/npc-motion.js` + `js/poblado.js`;
- texturas NPC reducidas para bajar peso sin cambiar jugabilidad;
- fallback base64 de Vera sincronizado con el GLB optimizado.

## QA ejecutado

- `python pruebas/npc-rigs.py` → PASS 6/6;
- `node pruebas/npc-integracion.mjs` → PASS;
- `node pruebas/expansion.mjs` → PASS;
- `node pruebas/faro-calidad-visual.mjs` → PASS 17/17;
- `node --check js/escena3d.js` → PASS;
- `node --check js/poblado.js` → PASS;
- `sha256sum -c SHA256SUMS.txt` → PASS.

## Entrega

`FARO_R04_1_VISUAL_REWORK_TRIANGLES_PASS.zip`

SHA-256:
`9291b6c3e35046760c84d7f9d9b401cebb747291a9aebe31859fd9a5c1994662`

Library:
`/Iris Green/Handoffs/Lumen/FARO_R04_VISUAL_REWORK/`

## Pendiente no falseado

IrisGreen sigue offline.
No se declaran todavía:
- FPS reales;
- renderer GPU;
- capturas nuevas 1440/390/320 sobre hardware IrisGreen.
