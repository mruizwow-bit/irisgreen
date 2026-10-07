# LUMEN · FARO · R04 CALIDAD VISUAL · 07/10/2026

Estado:
`FARO_R04_VISUAL_REWORK_BUILT__CHARACTER_TRIANGLE_REWORK_REQUIRED__GPU_EVIDENCE_PENDING`

Orden ejecutada:
`ORDEN_CALIDAD_VISUAL_FARO(1).md`

Base preservada:
`EL_TALLER_DE_LAS_ISLAS_3D_R03_NPC_6_OF_6.zip`

No se han modificado:
- reglas de construcción;
- costes;
- alcance 0,75 m;
- encargos;
- decoración;
- guardado;
- accesibilidad;
- rigs/identidades NPC.

## Aplicado
- paleta canónica de 14 colores;
- césped luz/sombra/borde;
- sombra desplazada a frío y sol cálido;
- bisel visual de bordes sin alterar colisión;
- costa/plata irregular y rocas;
- agua por profundidad + espuma;
- NONE congela agua;
- cielo degradado + bruma;
- cámara inicial más alejada para escala;
- vegetación repetida con InstancedMesh;
- árboles 4 formas, escala 0,8–1,4, giro libre, inclinación ±6°;
- arbustos 3 variantes;
- hierba 2 planos cruzados / 8 triángulos;
- flores más grandes y menos numerosas;
- rocas 3 variantes / 80 triángulos;
- UI plegada: objetivo actual, Materiales+Vista agrupados, un aviso de ayuda, piezas en barra inferior.

## QA estático
- `node --check js/*.js` PASS;
- `faro-calidad-visual.mjs` 17/17 PASS;
- `npc-rigs.py` 6/6 PASS;
- `npc-integracion.mjs` PASS;
- `expansion.mjs` PASS.

Playwright:
PENDIENTE; el contenedor no dispone del módulo.

## Triángulos medidos
- terreno: 3.164 / 8.000 PASS;
- árbol: 196 / 120–300 PASS;
- arbusto: 108 / 60–150 PASS;
- roca: 80 / 40–120 PASS;
- hierba: 8 / 8–20 PASS;
- flor: 13 / 12–24 PASS;
- Vera: 30.708 / 15.000 REWORK;
- Lili: 29.824 / 12.000 REWORK;
- Teo: 30.961 / 12.000 REWORK;
- Nara: 30.838 / 12.000 REWORK;
- Leo: 31.110 / 12.000 REWORK;
- Inés: 29.902 / 12.000 REWORK;
- Sol: 30.379 / 12.000 REWORK.

No se recortaron triángulos a ciegas porque dañaría malla, skin y rig. Se requiere retopología/decimación rig-safe y nueva validación.

## Hardware real
IrisGreen seguía offline.

No se declaran:
- capturas 1440/390/320;
- renderer;
- FPS;
- GPU PASS.

## Entrega local de esta ejecución
`FARO_R04_VISUAL_REWORK.zip`
SHA256:
`2db5409f247fd28f4691233642180ea1281c473569672b541f8772ea29c07eb7`

La subida a Library se intentó en:
`/Iris Green/Handoffs/Lumen/FARO_R04_VISUAL_REWORK/`
pero el backend de Library rechazó el `container_path` por no tener una sesión de contenedor activa para esa operación. No se declara subida.

Siguiente gate:
`RIG_SAFE_RET0POLOGY -> STATIC_QA -> IRISGREEN_GPU/CAPTURES -> HUMAN_QA_MARIA`
