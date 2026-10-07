# LUMEN · EL TALLER DE LAS ISLAS 3D · R01

Fecha: 07/10/2026
Owner: Lumen · A7
Orden base: `ORDEN_EL_TALLER_DE_LAS_ISLAS_3D_GPT.md`

Estado:
`EL_TALLER_DE_LAS_ISLAS_3D_R01_PACKAGE_BUILT__PUBLIC_RELEASE_BLOCKED`

## Base ejecutada

Paquete disponible suministrado por María:
`EL_VADO_3D_VERA.zip`

SHA-256 base:
`39e7b7eb518eab98137250c7094b12e6e34d5c91de3c3293378ad6d9189515fa`

La base se amplía; no se reconstruye.

## Implementado

- nombre visible: `El taller de las islas`;
- 3D sustituye conceptualmente a la versión 2D, sin coexistencia prevista;
- enclave ampliado:
  - canal 1 = 3 casillas de ancho;
  - canal 2 = 5 casillas de ancho;
  - terraza lejana = 3 cotas;
- Vera y sus animaciones preservadas byte-identical;
- 6 habitantes nuevos con llegada secuencial;
- 6 encargos persistentes, sin caducidad/racha/recompensa diaria;
- 15 objetos decorativos sin función/puntuación;
- nombre editable del sitio y persistencia;
- guardado v3 local;
- botón de borrado de partida;
- ES/EN local;
- no CDN;
- `noindex,nofollow`;
- shadow map reducido a 1024 como margen de rendimiento;
- privacidad ES/EN documentada en rama;
- README y procedencia corregidos para no declarar a Vera como original Iris Green.

## QA ejecutado

JS syntax:
PASS.

Auditor de requisitos nuevos sobre base original:
`0/12 PASS`.

Mismo auditor sobre R01:
`12/12 PASS`.

Integridad Vera:
- `activos/Vera.glb`
  `d50ca6617a01b412348513a989539803651f926d5e9044a708c4a34503c9b1e9`
- `activos/vera-glb.js`
  `40c602d5c57823eaf6cc3ec96f1052c673cf7d693393a90fc8969d6785100f60`

Final package:
`EL_TALLER_DE_LAS_ISLAS_3D_R01.zip`

SHA-256:
`cf9c1b7b073cb0430f00bcba477ccb89ad2ce1dd421cf57000f368a413646e9c`

`SHA256SUMS.txt`:
PASS.

Library:
`/Iris Green/Handoffs/Lumen/EL_TALLER_DE_LAS_ISLAS_3D_R01/`

## Sustitución 2D

Paquete 2D identificado:
`PRISMA_CONSTRUCTION_PLAYABLE_R01.zip`

Al integrar el 3D en la ruta de construcción, quedan obsoletos como runtime:
- `juegos.html`;
- `game.css`;
- `game.js`.

Sus QA/README/manifest históricos se preservan como evidencia.

## Bloqueo de licencia Vera

El paquete original declara procedencia Meshy pero no conserva el plan de Meshy usado al generar el activo.

La documentación R01 deja:
`PUBLIC_RELEASE_BLOCKED_PENDING_LEX_AND_PLAN_EVIDENCE`

No declarar licencia final hasta que exista evidencia del plan/términos aplicables y Lex cierre el gate.

## GPU/capturas

`GPU_REAL_MEASUREMENT_PENDING`

El dispositivo IrisGreen estaba offline durante esta ejecución.
No se inventan:
- FPS;
- renderer GPU;
- capturas 1440;
- capturas 390;
- capturas 320.

Esas evidencias deben ejecutarse sobre hardware real al volver IrisGreen.

## GitHub

Rama:
`lumen/taller-islas-3d-r01-20261007`

Privacidad ES:
`8cc7bd7db71d82d8f1cc6209f2f9e67ce36e01b7`

Privacidad EN:
`a8ac32c56091e520a3da5f9f453f17fba8facf55`

Contrato publicación revisado:
`4c035759a00e2e5b990f8ab38ba2a4921bcd5a07`

No main.
No deploy.

## Siguiente gate real

1. IrisGreen online → GPU benchmark real + capturas 1440/390/320.
2. Evidencia plan Meshy → Lex.
3. Si ambos cierran → integración exacta en `/es/juegos/construccion/` + build/QA.
4. HUMAN QA María.
