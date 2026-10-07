# LUMEN · EL TALLER DE LAS ISLAS 3D · R02 NPC READY

Fecha: 07/10/2026

Estado:
`EL_TALLER_DE_LAS_ISLAS_3D_R02_NPC_RUNTIME_READY_FOR_MESHY_RIGS`

## Cambio respecto a R01

Se elimina el sistema provisional de habitantes clonados desde Vera.

NPC canónicos:
- Lili;
- Teo;
- Nara;
- Leo;
- Inés;
- Sol.

Cada uno tiene:
- identidad visual propia;
- referencia PNG canónica;
- slot GLB propio;
- encargo persistente;
- posición/llegada independiente.

## Contrato Meshy

María solo necesita producir:
- un GLB por personaje;
- rig humanoide/bípedo;
- skinning funcional;
- texturas incluidas.

No se requieren clips de animación.

Filenames:
- `activos/habitantes/lili.glb`
- `activos/habitantes/teo.glb`
- `activos/habitantes/nara.glb`
- `activos/habitantes/leo.glb`
- `activos/habitantes/ines.glb`
- `activos/habitantes/sol.glb`

## Movimiento Lumen

`js/npc-motion.js`:
- detecta huesos humanoides comunes Meshy/Mixamo;
- genera reposo;
- caminar;
- saludo;
- uso/interacción;
- normaliza altura del modelo.

`js/poblado.js`:
- carga GLB individual;
- no usa `clonarPiel(Vera)`;
- pathfinding;
- altura de terreno;
- orientación;
- llegada secuencial;
- continuidad;
- encargo;
- fallback PNG local mientras falta el GLB.

Lili sustituye a la antigua habitante provisional y cumple el objetivo histórico:
refugio → llegada → saludo → uso real del banco.

Después se abre la llegada secuencial del resto.

## Migración

Partidas R01 con `alba` migran automáticamente a `lili`.

## QA

- JS syntax PASS;
- expansión PASS;
- NPC integration PASS;
- 6/6 referencias presentes;
- 6/6 slots GLB;
- 0 clones de Vera en Poblado;
- SHA256SUMS PASS.

Package:
`EL_TALLER_DE_LAS_ISLAS_3D_R02_NPC_READY.zip`

SHA-256:
`3d5261966680a1846c905097c01eef0a7c567a9c8dc028e73e258b733e9c5964`

Library:
`/Iris Green/Handoffs/Lumen/EL_TALLER_DE_LAS_ISLAS_3D_R02_NPC_READY/`

## Pendiente

- 6 GLB riggeados reales;
- ajuste de mapping/orientación si algún rig Meshy usa nombres particulares;
- browser/HUMAN QA con los seis modelos;
- GPU/capturas reales con IrisGreen online.

No main.
No deploy.
