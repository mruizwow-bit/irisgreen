# PRISMA · FÓSILES R02 · PILOTO 3 · ENTREGA PARA AXIOMA

Fecha: 2026-10-06  
Issue: #323  
Orden activa: comentario `6010670288`  
Rama: `prisma/fosiles-r02-piloto-3-20261006`

Gate Prisma:
`PRISMA_FOSSILS_R02_PILOT_3_EXECUTABLE_READY_FOR_AXIOMA`

## Autoría y base

Implementación de Prisma sobre la base Nexo:

`NEXO_FOSILES_PRACTICA_R01.zip`  
SHA-256 base:  
`21a6663524368ad2322f06e405d6af1417e42b21925d4a2123c9c29934ae668c`

R01 queda intacto como referencia.

## Alcance entregado

Tres encuentros completos:

1. Trilobite — segmentación visible.
2. Dimetrodon — prolongación estrecha + continuidad con base vertebral.
3. Meganeura — contorno de impresión + red de líneas internas.

Los 14 assets fósiles originales están incluidos y preservados byte a byte. Los otros once no se anuncian como experiencias terminadas.

## Cambios frente a R01

- eliminado el criterio universal 48 % + 2/3;
- regiones manuales por piloto;
- una única evaluación gobierna feedback, Observar y Revelar contexto;
- nada fuera de viewport cuenta como observado;
- `Despejar zona señalada` actúa en la coordenada elegida;
- `Guiarme` sólo señala/reencuadra, nunca despeja;
- selector de movimiento sin efecto retirado;
- cambio de idioma conserva modo;
- `pointercancel` no confirma acción;
- escena protagonista y explicación próxima;
- QA overlays separados del producto.

## QA browser real

Build commit:
`be7c36076381a6a91aa83df30c1379db8918c415`

GitHub Actions run:
`37426798610 · SUCCESS`

Browser QA:
- Trilobite / ratón directo: PASS
- Dimetrodon / single pointer sin drag: PASS
- Meganeura / teclado DOM: PASS
- R01 fuera de vista: PASS
- R02 teclado limitado a escena: PASS
- R04 idioma conserva modo: PASS
- R05 acción local conserva punto: PASS
- R06 selector inerte ausente: PASS
- pointercancel: PASS
- foco Tab/Space: PASS
- forced-colors smoke: PASS
- 320 / 390 / 1440: PASS
- texto 200 %: PASS
- targets mínimos: 44 px

`QA_BROWSER.json result = PASS`.

## Artifact exacto

Artifact ID:
`11394214546`

Artifact:
`PRISMA_FOSILES_R02_PILOTO_3`

Digest contenedor GitHub:
`sha256:25b41e91721a46207b6a0966220b125d4d596e98835486880e0255ec764f3191`

ZIP ejecutable interno:
`PRISMA_FOSILES_R02_PILOTO_3.zip`

Bytes:
`1,241,325`

SHA-256 ZIP:
`af3c5cd5f884787076508f6aa6a04385821cc2c0062d2632fa94a59b9fba62b7`

Contenido:
- 36 archivos totales;
- manifest con 35 entradas verificadas;
- 0 hashes incorrectos;
- 14 WebP fósiles preservados;
- 3 evidencias PNG de rutas reales;
- index.html autónomo sin instalación.

## Revisión visual posterior al primer PASS

Antes de cerrar la entrega se revisaron las capturas del artifact y se corrigieron dos defectos que el banco inicial no detectaba:

1. contador visual del Cuaderno no se actualizaba tras revelar;
2. rectángulos técnicos de regiones QA aparecían en el runtime.

El artifact `11394214546` ya contiene ambas correcciones. El QA se reejecutó después.

## Siguiente

`PRISMA → AXIOMA revisión independiente → HUMAN QA María → decidir extensión a 14`

Prisma no declara AXIOMA_PASS ni HUMAN_QA_PASS.

`NO MAIN · NO PUBLIC DEPLOY · NO SABIK`
