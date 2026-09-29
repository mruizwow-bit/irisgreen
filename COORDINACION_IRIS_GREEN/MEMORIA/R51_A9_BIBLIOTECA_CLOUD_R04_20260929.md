# R51 A9 · Biblioteca Cloud Sabik R04 · release privado parcial verificado · 29/09/2026

Estado: `R51_A9_R04_PRIVATE_PARTIAL_RELEASE_VERIFIED_HOLDS_ISOLATED`.

## Identidad verificada

- branch: `agent9/r51-cloud-library-r04-20260927`
- HEAD verificado: `3e9a7fc3b9cd4cd3312e89a59e7505b6dd56e662`
- GitHub Actions: run `36535666347` · SUCCESS
- versión privada parcial: `sabik-r04-private-partial-20260929-f3f72e4e075b`
- corpus SHA-256: `f3f72e4e075b9653e3fe934e19232c25ebb943ea55eda39db40e623cbd0e5659`
- manifest SHA-256: `e5f21b259eb4b790bbc3d46fae6a2bf93f4c4e393427d7ea5f3d54b399380b36`

## Cloud privado

- site: `sabik-asistente`
- site ID: `47b06e68-ff54-4097-8ad8-336b2d71758a`
- deploy ID: `6abb66029456439c4426d0ca`
- origin: `https://6abb66029456439c4426d0ca--sabik-asistente.netlify.app`
- Team Login: activo
- store: `sabik-r04-candidates`
- producción: sin cambios
- readback: verificado en todos los objetos publicados

## Corpus privado parcial

- 2.718 entidades totales
- 2.366 activas/recuperables
- 352 held/inactivas

Desglose de HOLD:
- 206 entidades editoriales ligadas a 204 rutas del paquete #302 aún no presentes en A2;
- 144 entidades de Intereses, pendientes de clasificación canónica R59;
- 2 entidades del módulo de crisis M-04 del Rincón.

Componentes construidos:
- Editorial 965: 1.700 entidades; 1.494 activas; 206 held por ruta pendiente A2.
- Juegos 297: 594 entidades · READY.
- Rutinas 109: 218 entidades · READY.
- Intereses 72: 144 entidades · HOLD.
- Taller: 25/27 = 50 entidades · READY; faltan Modelado 3D + Videomapping en source A2.
- Rincón: 12 entidades; 10 activas + 2 held.
- Home: 0 entidades; Home v4 R2 sigue HOLD.

## QA global

Citas/rutas:
- invalid URLs: 0
- missing routes entre entidades activas: 0

Duplicados:
- exact duplicate groups: 0
- cross-content exact duplicate groups: 0
- near duplicate pairs: 1
- caso: dependencia Valencia vs Extremadura · similitud 0,8871 · decisión KEEP_SEPARATE_REVIEWED_SIMILAR por jurisdicción distinta.

Retrieval:
- edad antes del ranking;
- safety antes del ranking;
- GENERAL = safe-by-default;
- full S2 fuera de GENERAL;
- full S2 solo AGE_18_PLUS + explicit intent;
- held excluido;
- readback real desde Netlify Blobs PASS.

## Incremental

Delta:
`ADDED · MODIFIED · UNCHANGED · REMOVED · SAFETY_CHANGED · AGE_CHANGED · ROUTE_CHANGED · LOCALE_CHANGED · SOURCE_CHANGED`.

- tombstones;
- CSS/UI-only → NO_CONTENT_CHANGE;
- single-content editorial rebuild;
- single-game rebuild;
- single-routine rebuild;
- `workflow_dispatch source_sha`;
- `workflow_call source_sha` para A2.

Rendimiento medido:
- Editorial full: 5.368,91 ms; 1 content_id: 23,69 ms; reducción entidades 99,88%; reducción bytes 99,88%.
- Juegos full: 18,11 ms; 1 juego: 12,48 ms; reducción entidades 99,66%; reducción bytes 99,68%.
- Rutinas full: 14,29 ms; 1 rutina: 11,10 ms; reducción entidades 99,08%; reducción bytes 99,04%.

## Retención / observabilidad

- releases verificadas: inmutables;
- metadata/deltas/source SHA/hashes de release: indefinidos;
- candidatos privados verificados: metadata 365 días, blobs 90 días salvo promoción;
- fallidos y artifacts CI: 14 días;
- permitido: versión, SHA, duración, conteos, delta, bytes, tests, readback, deploy ID;
- prohibido: queries, IP, usuario, conversaciones, diagnóstico, etapa individual y datos personales.

## HOLDs externos

1. 204 rutas editoriales aprobadas del paquete #302 todavía no existen en A2.
2. Home v4 R2 todavía no está aceptada.
3. Intereses 72 aún no tienen clasificación canónica de edad/safety liberada por R59.
4. Taller: Modelado 3D + Videomapping aún fuera del source A2 consumible.
5. Rincón M-04: copy crisis pendiente de review.

No se declara R04 final sellada hasta cerrar esos puntos.

## Invariantes

- R38 intacto.
- R03 intacto.
- no producción;
- no DNS;
- no cambios Team Login;
- no secretos;
- no frontend;
- no voz/LLM;
- no datos de usuario.
