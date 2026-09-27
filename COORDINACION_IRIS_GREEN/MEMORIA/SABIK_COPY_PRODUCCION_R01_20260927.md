# Sabik · COPY PRODUCCIÓN ES/EN · R01 · 27/09/2026

Estado: `SABIK_COPY_PRODUCCION_R01_EXTRACTED_REVIEWED_PENDING_MARIA`.

## Autoridad y objetivo

Por decisión de María, `SABIK_COPY_PRODUCCION` es la fuente canónica del lenguaje propio de Sabik que puede aparecer o ser locutado en Iris Green. Se separa de forma estricta del corpus usado para entrenamiento vocal.

La biblioteca de audio no se genera desde textos de entrenamiento. Solo se genera desde copy de producción revisado y aprobado.

## Fuente técnica exacta auditada

Repositorio: `mruizwow-bit/irisgreen`.
PR de integración web: #244.
HEAD auditado: `e8cad400a30d5d4857f9f99b0c1070d786958a8b`.

Se han leído las superficies Sabik activas en ese HEAD:
- `sabik/iris-panel.html`
- `sabik/iris-mount.mjs`
- `sabik/retrieval-panel.js`
- `sabik/sabik-web-r01.js`

No se modifica la rama A2 ni se despliega producto.

## Inventario R01

Se han extraído y normalizado 40 registros de copy fijo/plantillas del sistema:
- 25 se conservan sin cambio editorial;
- 14 se revisan para lenguaje más natural, concreto y coherente ES/EN;
- 1 queda en HOLD (`Bajar intensidad / Lower intensity`) hasta confirmar qué adapta exactamente el control.

Política de locución:
- `SYSTEM_VOICE`: 10;
- `SYSTEM_VOICE_OPTIONAL`: 5;
- `UI_ONLY`: 14;
- `UI_SCREENREADER`: 6;
- `SCREENREADER_ONLY`: 5.

Archivos:
- `CONTROL/SABIK_COPY_PRODUCCION_R01_20260927.csv`
- `CONTROL/SABIK_COPY_PRODUCCION_R01_20260927.json`

SHA-256 CSV: `d5f4f7209ff132581c70f84264a188b422e5f3aac61f4346a3db5d03000f22cb`.

## Reglas editoriales vigentes

El copy de Sabik:
1. describe funciones, resultados y siguientes pasos concretos;
2. usa lenguaje adulto, claro y natural;
3. no presupone emociones, diagnóstico, cansancio, miedo, presión, abandono o necesidad de compañía;
4. no presenta al sistema como cuidador, terapeuta o presencia emocional;
5. no usa abstracciones para describir una función técnica si puede decir qué ocurre;
6. mantiene equivalencia real ES/EN, no traducción literal torpe;
7. separa texto visible, anuncios de lector de pantalla y locución;
8. evita duplicar mensajes si la interfaz ya comunica el mismo estado;
9. no convierte el contenido de artículos/fichas en copy propio de Sabik;
10. no se promueve automáticamente ningún texto de `CORPUS_ENTRENAMIENTO_VOZ`.

Ejemplo de exclusión registrada:
`la ausencia de voz no significa abandono` no pertenece al lenguaje de producto y no puede entrar en `SABIK_COPY_PRODUCCION`.

## Relación con el contenido público de Iris Green

`SABIK_COPY_PRODUCCION` contiene el lenguaje propio del sistema Sabik.

El contenido editorial de páginas, fichas, artículos, ayudas, recursos o biblioteca conserva su fuente de verdad en la web. Cuando Sabik lo lea, la biblioteca de audio se vincula a la unidad canónica de contenido mediante ID, versión y hash de texto; no se mantiene una tercera copia editorial manual.

## Biblioteca de audio futura

`SABIK_AUDIO_LIBRARY` se generará solo desde:
- copy fijo aprobado en `SABIK_COPY_PRODUCCION`;
- contenido editorial canónico de la web con versión/hash aprobado.

Contrato mínimo previsto por unidad:
`id`, `locale`, `source_kind`, `source_path/url`, `source_version`, `text_sha256`, `voice_master`, `generation_config`, `audio_file`, `audio_sha256`, `duration`, `status`.

Los masters vigentes son los ya registrados:
- ES: `SABIK_ES_MASTER_V1.wav`;
- EN: `SABIK_EN_MASTER_RETEST_01.wav`.

## Supersesión de decisiones históricas

`MEMORIA/SABIK_BIBLIOTECA_NARRADA_ES_EN_R01_20260925.md` se conserva como historia, pero queda SUPERSEDIDO en su arquitectura de voz/proveedor: ya no gobierna una biblioteca basada en ElevenLabs ni dos voces humanas distintas.

La extracción `MEMORIA/SABIK_TEXTOS_ES_EN_EXTRAIDOS_R01_20260925.md` sigue siendo evidencia útil de cobertura del HEAD histórico `82106c8...`, pero no es el catálogo final porque R42 ha cambiado la web y la integración sigue abierta.

## Gate para continuar

Antes de generar audio:
1. María revisa/acepta el copy revisado R01;
2. A2 congela un HEAD web para extracción completa posterior a R42;
3. se vuelve a extraer contenido público desde ese HEAD, con ES/EN;
4. cada unidad recibe hash/versionado;
5. se genera audio únicamente de unidades aprobadas.

No main · no producción · no deploy · no audio generado en esta operación.
