# R51 A9 · Biblioteca Cloud Sabik R04 · checkpoint privado incremental · 29/09/2026

Estado: `R51_A9_R04_PRIVATE_CANDIDATE_VERIFIED_INCREMENTAL_READY`.

## Resumen

A9 ya no depende de reconstrucciones completas para cada cambio ordinario. Se ha construido y probado un carril incremental con:
- detección de delta por source SHA;
- impacto por dominio;
- separación `SAFETY_CHANGED` / `AGE_CHANGED`;
- tombstones;
- `NO_CONTENT_CHANGE` para CSS/UI-only;
- rebuild por content_id, juego o rutina individual;
- entrada manual/reusable `source_sha`;
- candidatos versionados en Cloud privado;
- retrieval privado con edad + safety antes del ranking;
- 0 datos de usuario.

## Cloud privado verificado

Run verificado:
- workflow: `R51 A9 R04 library verify`;
- run: `36533602541`;
- HEAD verificado: `7816781685d3568b21ddced9338d0f3e06a88062`;
- resultado: SUCCESS.

Netlify:
- site: `sabik-asistente`;
- site ID: `47b06e68-ff54-4097-8ad8-336b2d71758a`;
- deploy privado: `6abb60f346062fb1a8dfd750`;
- Team Login: requerido en todos los contextos;
- producción: sin cambios;
- store candidato: `sabik-r04-candidates`.

## Corpus candidato parcial unificado

- 2.718 entidades totales;
- 2.572 activas/recuperables;
- 146 held/inactivas.

Composición:
- Editorial 965: 1.700 entidades · READY_CANDIDATE;
- Juegos 297: 594 entidades · READY_CANDIDATE;
- Rutinas 109: 218 entidades · READY_CANDIDATE;
- Intereses 72: 144 entidades · HOLD;
- Taller: 25/27 = 50 entidades · READY_CANDIDATE;
- Rincón: 12 entidades = 10 activas + 2 held por crisis;
- Home: 0 entidades · HOLD.

## Retrieval

Probado por readback real desde Netlify Blobs:
- GENERAL = safe-by-default;
- AGE_0_12 / AGE_13_17 / AGE_18_PLUS / ALL_AGES;
- full S2 fuera de GENERAL;
- full S2 permitido solo con AGE_18_PLUS + explicit intent;
- Intereses held fuera del ranking;
- active/retrieval flags aplicados antes del ranking.

Prueba persistida:
`r51-r04-candidates/r04-retrieval-proof/7816781685d3568b21ddced9338d0f3e06a88062/r04-private-retrieval-proof.json`.

## Incremental

Tipos:
`ADDED · MODIFIED · UNCHANGED · REMOVED · SAFETY_CHANGED · AGE_CHANGED · ROUTE_CHANGED · LOCALE_CHANGED · SOURCE_CHANGED`.

Cobertura:
- cambio textual de una ficha;
- URL;
- S1→S2;
- safe variant;
- borrado + tombstone;
- alta;
- locale añadido/retirado;
- CSS-only → NO_CONTENT_CHANGE;
- UI JS-only → NO_CONTENT_CHANGE;
- fuente/cita;
- títulos duplicados con rutas distintas;
- single-ID Juegos;
- single-ID Rutinas.

El checkpoint A2 se avanza solo cuando el delta editorial ya está absorbido. Cambios posteriores en Sabik/UI no reabren corpus.

## Políticas

Retención:
- releases verificadas: metadata/deltas/source SHA/hashes/corpus inmutables;
- candidatos privados verificados: metadata 365 días; blobs 90 días salvo promoción;
- candidatos fallidos: 14 días;
- CI artifacts: 14 días.

Observabilidad permitida:
versiones, SHA, duración, conteos, delta, bytes, tests, readback y deploy IDs.
Prohibido: queries, IP, usuario, conversación, diagnóstico, etapa individual o datos personales.

## HOLDs reales

1. Home v4 R2 todavía no aceptada por HUMAN QA.
2. Intereses 72 sin clasificación canónica de edad/safety liberada por R59.
3. Taller: Modelado 3D + Videomapping aún fuera del source A2 consumible.
4. Rincón M-04: copy crisis pendiente de revisión.

Estos HOLDs no invalidan ni bloquean el corpus privado ya construido.

## Invariantes

- R38 no se modifica.
- R03 no se sobrescribe.
- no producción;
- no DNS;
- no cambios Team Login;
- no secretos;
- no frontend;
- no voz/LLM;
- no datos de usuario.
