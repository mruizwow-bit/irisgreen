# LUMEN · EL TALLER DE LAS ISLAS 3D · R03 NPC 6/6

Fecha: 07/10/2026

Estado:
`EL_TALLER_DE_LAS_ISLAS_3D_R03_NPC_6_OF_6_INTEGRATED`

## NPC finales

- Lili ← Meshy AI Winter Dolllight
- Teo ← Meshy AI Little Wanderer
- Nara ← Meshy AI Violet Meadow Doll
- Leo ← Meshy AI Curly Autumn Boy
- Inés ← Meshy AI Autumn Ember Princess
- Sol ← Meshy AI Willow Buttonbloom

## Validación rig

6/6:
- GLB v2 válido;
- 30 nodos;
- 1 skin;
- 11/11 huesos humanoides clave reconocidos;
- clip Walking embebido.

## Runtime

- 0 clones de Vera;
- un GLB propio por NPC;
- movimiento de mundo/pathfinding/orientación/terreno controlado por Iris Green;
- estados reposo/caminar/saludar/usar;
- llegada secuencial;
- encargos persistentes;
- migración de partida `alba → lili`.

Las PNG de referencia quedan solo como fallback técnico/visual; los habitantes finales son los GLB.

## QA

- `npc-rigs.py` → PASS 6/6;
- `npc-integracion.mjs` → PASS;
- `expansion.mjs` → PASS;
- `SHA256SUMS.txt` → 101/101 OK.

Pruebas Playwright legacy:
PENDIENTE porque el contenedor actual no tiene el módulo Playwright disponible.

GPU/capturas:
PENDIENTE hasta IrisGreen online.

No se falsean esos PASS.

## Package

`EL_TALLER_DE_LAS_ISLAS_3D_R03_NPC_6_OF_6.zip`

SHA-256:
`31aefc7d58d77f67e9f9dd6b251692373e4d760a374c54312fac008dc53bf8bc`

Library:
`/Iris Green/Handoffs/Lumen/EL_TALLER_DE_LAS_ISLAS_3D_R03_NPC_6_OF_6/`

No main.
No deploy.
