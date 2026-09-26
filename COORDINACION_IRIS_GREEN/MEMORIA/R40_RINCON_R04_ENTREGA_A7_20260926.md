# Memoria · entrega Agente 7 · R40 Rincón R04 · 26/09/2026

## Estado
`R40_RINCON_R04_REAL_REBUILD_READY_FOR_A2`

R04 #271 sustituye R03 tras el HUMAN QA FAIL de María.

## Identidad
- Base A2 de construcción: `9ad3cc8116b6c1d237b84f71855f3808e93ddbad`.
- Rama final: `agent7/r40-rincon-r04-final-20260926`.
- HEAD final: `7f15dd174fc26b7768224896492ff240c5cecdf5`.
- Tree: `cac62fe72d1a193edc9e31ab9cfa177e5c92ca6d`.
- Draft PR: #274.
- Rama A2 observada al cerrar: `e7e2e986e370af093c094a78deaacd2eb1f04707`; A2 debe integrar sobre su HEAD vigente, no resetear.

## Reconstrucción real

### Arquitectura
- Vídeos: escena/reproductor primero, controles esenciales después, selector compacto y Ajustes después.
- Sonidos: estado del sonido + volumen + Parar primero; búsqueda/catálogo después.
- Bola: bola + Empezar/Parar/Pantalla limpia primero; Ajustes después.
- Desktop: tabs superiores.
- Móvil: selector nativo con el mismo modelo mental.
- No se usa `scrollIntoView` para rescatar una herramienta enterrada.

### Audio
Se renderizaron offline 21 segmentos first-party:
- 12 sonidos generales;
- 9 ambientes de escena.

Tres sprites AAC-LC mono, 24 kHz:
- `general-nature.m4a` SHA-256 `b2678dea90536a331755fc0291d955e7513f388341b3d390dd5daf884a7124e9`.
- `general-calm.m4a` SHA-256 `b0accd420f0344cdfa5cb2957e52e4fb39fc947a75da3dc6f481b7210fed3505`.
- `scenes.m4a` SHA-256 `a3e9a7b9fc3c82f002b5699d613ebe68be881c08d3650d2f849065e4440d12da`.

A7 recalculó los tres SHA sobre los bytes del HEAD final: 3/3 PASS.

Procedencia: `SYNTHETIC_FIRST_PARTY_R40_R04`.
El runtime R04 carga/decodifica/loop/fade/volumen; no crea la identidad sonora natural con osciladores en runtime.
Las grabaciones históricas HOLD no se reutilizan.

### Visuales
`assets/rincon-escenas-r04.js` sustituye el motor anterior y contiene las nueve escenas:
Mar, Lluvia, Río, Noche, Acuario, Tubo de burbujas, Medusas, Fibra óptica y Pulpos.

### ES/EN y adaptación
- controles, estados y copy equivalentes;
- desktop y móvil;
- targets >=44 px;
- reduced motion;
- forced-colors;
- no autoplay;
- fallback visual/textual.

## QA y revisión GitHub

Workflow `36237393274` → SUCCESS.
HEAD cubierto por el workflow: `8278e3a4863fa31a71f0e7f1554cfb55a9e8c073`.

A7 comprobó que los blobs de producto, manifiesto y audio del HEAD final son idénticos a los cubiertos por el workflow.

A7 revisó visualmente las seis capturas finales:
- Vídeos 1440×900 y 390×844;
- Sonidos 1440×900 y 390×844;
- Bola 1440×900 y 390×844.

Resultado: herramienta activa visible arriba; no se reproduce el defecto R03 de reproductor/bola/sonido enterrado.

La rama contiene:
- `docs/r40-a7-build/HANDOFF_R04.md`;
- `QA_PRECHECK_R04.md`;
- `r04-evidence/R03_R04_AB.md`;
- `r04-evidence/VISUAL_FILES.md`;
- `r04-evidence/FINAL_GITHUB_REVIEW.md`;
- screenshots, DOM y SHA256SUMS.

## Límite de aceptación
A7 **no declara PASS perceptivo** de los 21 sonidos ni aceptación final de las 9 escenas.

Siguiente gate:
A2 integra PR #274 → build/gates → Deploy Preview → María/QA escucha 12+9 y revisa 9 escenas → corrección si aparece un defecto.

0 merge main por A7. 0 deploy por A7. 0 voz/TTS.
