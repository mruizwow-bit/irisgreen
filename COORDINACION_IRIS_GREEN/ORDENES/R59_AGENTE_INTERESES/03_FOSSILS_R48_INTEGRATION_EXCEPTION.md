# R59 · FÓSILES · EXCEPCIÓN MÍNIMA DE INTEGRACIÓN R48

Fecha: 01/10/2026
Issue: #323
Autoridad: María
Coordinación: Aura
Responsable: Agente R59
Estado: R59_FOSSILS_R48_MINIMAL_INTEGRATION_EXCEPTION_AUTHORIZED

## Objetivo

Integrar el piloto Fósiles dentro de la página existente del tema 09 y del runtime R48, sin crear página ni runtime paralelos.

Rutas:
- es/intereses/temas/09-fosiles-y-dinosaurios/
- en/interests/topics/09-fossils-and-dinosaurs/

## Cambio compartido autorizado

Archivo declarado por el agente:
scripts/intereses_r48/matriz.py

Único cambio permitido:
tema 09 · renderer: TIMELINE → EXCAVACION

### Guardrail 72/72

Antes:
exportar mapa id → renderer de los 72 temas.

Después:
repetir export.

Diff permitido:
- exactamente 1 entrada;
- ID 09;
- TIMELINE → EXCAVACION.

Cualquier otro cambio:
FAIL / STOP.

No tocar:
- otros 71 temas;
- IDs;
- motores ajenos;
- Fósiles/Minerales como taxonomía separada.

## Motor

Nuevo:
assets/ig-r48-m-excavacion.js

Contrato:
R.motor('EXCAVACION', fn)

Consumir host/ui/now/data/cfg/api/stage.

No reutilizar el nombre timeline.
No página independiente.

## Contenido

Tema 09:
- ES/EN;
- variantes/ayudas por etapa;
- tabla sin JavaScript;
- fuentes;
- fallback;
- accesibilidad.

## Arte E4

Permitido:
img/intereses/temas/09-fosiles-y-dinosaurios/

Arte:
- first-party;
- AVIF/WebP cuando proceda;
- lazy/on-demand;
- manifest/hashes;
- fallback.

La restricción histórica R48 de inline/no-image no prevalece sobre el Visual Standard SEP 2026 si degrada el resultado R58/R59.

Cifras declaradas a verificar:
- 59 archivos;
- ~960 kB total;
- ~214 kB primera vista.

No son PASS hasta network QA real.

## ALBUM_TEMATICO

Estado:
R59_FOSSILS_ALBUM_TEMATICO_FUTURE_SCOPE

Fuera de este piloto.
No bloquea cierre.

## QA adicional integración

- ES/EN;
- JSON r48-tema = EXCAVACION;
- carga ig-r48-m-excavacion.js;
- 0 timeline para tema 09;
- otro TIMELINE conserva su motor;
- fallback no JS;
- 1440/390/320;
- LIGHT/DARK;
- AGE_* / ALL_AGES;
- teclado/touch;
- reduced motion;
- child-safe;
- initial transfer;
- lazy assets por estrato.

## QA/GOV previa sigue vigente

Cerrar también:
- QA nominal 4/4;
- negative test;
- gobernanza;
- GOV-01;
- paquete final reproducible.

## Salida

R59_FOSSILS_R2V4_R48_INTEGRATION_QA_GOV_READY_FOR_ASTRA_AURA_MARIA

Después STOP.

## Integración A2

Agente R59 no toca A2.

Tras PASS Astra/Aura + HUMAN QA María:
handoff a Vector/#356.

No Minerales.
No main.
No producción.
