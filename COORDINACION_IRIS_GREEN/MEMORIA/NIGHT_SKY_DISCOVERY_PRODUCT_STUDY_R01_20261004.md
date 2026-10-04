# CIELO NOCTURNO · PRODUCT STUDY R01 · DESCUBRIMIENTO

Fecha: 2026-10-04
Autoridad: María
Owner de producto/continuidad: Nexo
Estado: ESTUDIO · NO IMPLEMENTACIÓN

Gate:
`NIGHT_SKY_PRODUCT_STUDY_R01_ACTIVE`

Regla:
`NO_RUNTIME_UNTIL_SKY_MODEL_AND_FIRST_DISCOVERY_STORYBOARD_HUMAN_APPROVED`

---

## 0 · Corrección de fuente de verdad

Decisión explícita de María:

**Cielo no tiene prototipo de producto que conservar.**

Existen imágenes, datos, masters y documentación visual previa.
Cualquier nota histórica que afirme que una experiencia/runtime de Cielo ya está construida se considera:
`LEGACY_EXPERIMENT_NOT_PRODUCT_SOURCE_OF_TRUTH`

Reutilizable:
- datos;
- assets;
- constelaciones;
- horizonte;
- manifests/provenance;
- lógica astronómica factual que pase revisión.

No reutilizable por defecto:
- interacción vieja;
- layout viejo;
- first viewport viejo;
- decisiones de reveal antiguas.

Cielo se diseña ahora desde cero bajo:
`SEMANTIC_ACTION → OBSERVABLE_SIGNAL → INFERENCE/IDENTIFICATION → REVEAL → DEPTH`

---

# 1 · Inventario útil ya existente

## Campo estelar
- dataset local de ~5.070 estrellas;
- nombres IAU/WGSN disponibles para cientos de estrellas;
- estrellas deben ser DATA/PROCEDURAL, no sprites inventados.

## Constelaciones
- 88/88 masters R03 empaquetados;
- 88 registros JSON;
- geometría de figura separada de la región IAU;
- no regenerar.

Uso permitido:
`REVEAL / DEPTH / GUIDED_OBSERVATION`

No uso inicial:
`ENTRY_SCREEN_SOLUTION`

## Horizonte
Asset:
`01-cielo-horizonte-observacion-r01.png`

Función propuesta:
`ATMOSPHERIC_FOREGROUND / HORIZON FRAME`

No es una localización geográfica factual.
No usar su silueta para afirmar orientación real del terreno.

## Láminas/atlas/guías
Ejemplos:
- Atlas de constelaciones;
- guía visual de constelaciones;
- Osa Mayor → Polaris;
- escenas pedagógicas.

Función:
`POST_LOCATION_EXPLANATION / DEPTH / GUIDED_JOURNEY`

No:
`INITIAL_SKY`

---

# 2 · Error que debemos evitar

No construir:
`ENTRAR → VER CONSTELACIÓN DIBUJADA → TOCAR → FICHA`

Tampoco:
`CATÁLOGO DE 88 → ELEGIR ORIÓN → IMAGEN → TEXTO`

Eso convierte Descubrimiento en galería.

Contrato:
`ENTER SKY → ORIENT VIEW → OBSERVE STAR PATTERN → LOCATE → IDENTIFY → REVEAL`

---

# 3 · Qué es la acción semántica en Cielo

Acción real del fenómeno:
**mirar en otra dirección / orientar el campo / acercar el campo / seleccionar algo que has localizado.**

Por tanto:

Pointer/touch:
- pan opcional;
- pinch opcional;
- tap para examinar zona/objeto.

Siempre debe existir equivalente:
- controles de dirección;
- teclado;
- zoom + / −;
- retícula/centro de observación.

No depender:
- gyroscope;
- drag;
- device motion;
- precisión motora.

---

# 4 · Qué es la consecuencia observable

Al orientar:
- cambia el campo estelar;
- cambia azimut/altura o coordenadas del campo según el modelo elegido;
- cambian relaciones espaciales visibles.

Al hacer zoom:
- cambia escala del campo;
- NO inventar estrellas nuevas solo para premiar el zoom;
- cualquier cambio de visibilidad debe derivar de una regla astronómica/óptica definida.

Al seleccionar una región/patrón real:
- el sistema puede confirmar qué estrellas forman el patrón;
- entonces se permite el reveal.

No usar:
- brillo artificial tipo radar;
- partículas premio;
- “caliente/frío” arbitrario;
- pulsar un botón “Descubrir Orión”.

---

# 5 · Modelo de cielo · decisión pendiente obligatoria

Para un horizonte astronómico real, posición aparente de objetos depende de:
- fecha;
- hora;
- latitud/longitud.

Antes de runtime hay que elegir uno de dos modelos:

## A · Planetario localizado
La persona:
- permite ubicación o elige lugar;
- usa fecha/hora real o elegida.

Ventajas:
- cielo observado corresponde al mundo real;
- azimut/altura son significativos;
- puede responder “¿dónde está ahora?”.

Costes:
- permisos/privacidad;
- fallback;
- time zone;
- mayor complejidad de entrada.

## B · Escena de observación con preset explícito
El producto usa:
- lugar canónico declarado;
- fecha/hora declaradas;
- escena reproducible.

Ventajas:
- onboarding simple;
- reproducible;
- excelente para enseñanza.

Regla:
NO presentarla como “tu cielo ahora”.

### Recomendación de estudio
Para el **primer prototipo**, usar B:
`CURATED_OBSERVATION_PRESET`

y dejar A como profundidad posterior.

Motivo:
validar primero el descubrimiento sin introducir permisos/geolocalización.

---

# 6 · Primer prototipo recomendado · ORIÓN

No construir las 88 a la vez.

Primera prueba:
`FIND_THE_PATTERN → REVEAL_ORION`

Por qué Orión:
- master R03 disponible;
- patrón del cinturón muy reconocible;
- permite inferencia por geometría visible;
- no requiere empezar por una tarjeta;
- usable como prueba del motor común.

El preset debe elegirse de forma que Orión sea realmente visible en el campo.

---

# 7 · STORYBOARD FUNCIONAL PROPUESTO

## F01 · ENTRY

Vista:
- horizonte/paisaje inferior;
- cielo real/data-backed encima;
- sin nombres;
- sin líneas de constelación;
- sin figuras;
- sin tarjetas;
- sin 88 botones.

Prompt corto:
**Busca tres estrellas brillantes casi en línea.**

No decir “Orión” todavía.

Controles mínimos visibles:
- dirección/orientación;
- zoom +/− si hace falta;
- volver/salir.

La escena domina el viewport.

## F02 · ACTION

La persona orienta el cielo.

Consecuencia:
- campo estelar cambia coherentemente;
- indicador de orientación cambia;
- el horizonte permanece como referencia.

NORMAL:
movimiento suave.

REDUCED:
transición corta.

NONE:
saltos discretos entre campos equivalentes.

Mismo modelo mental.

## F03 · OBSERVABLE SIGNAL

En el campo correcto aparecen, por los propios datos:
**tres estrellas brillantes casi alineadas**.

No aparece aún:
- nombre Orión;
- dibujo de cazador;
- ficha.

La señal es el patrón astronómico.

La persona puede:
`EXAMINAR ESTA ZONA`
mediante tap/retícula/Enter.

## F04 · INFERENCE / IDENTIFICATION

Tras seleccionar correctamente la zona:

Primero:
- marcar las tres estrellas del cinturón;
- conectar el patrón de forma contenida.

Después:
**Has encontrado el cinturón de Orión.**

Ahora:
`OBJECT_IDENTIFIED = ORION`

Solo aquí se permite el nombre.

## F05 · REVEAL

Sobre el MISMO cielo:
- aparece la figura de líneas de la constelación, alineada con estrellas reales;
- nombre Orión;
- principales estrellas;
- posición/coordenadas que el modelo permita afirmar;
- datos factuales breves.

No abrir una tarjeta que sustituya al cielo.

Preferencia:
bottom sheet / panel lateral secundario.

## F06 · DEPTH

Opcional:
- “Ver la constelación”
- master R03 de Orión;
- “Cómo reconocerla”
- estrellas principales;
- región IAU vs figura tradicional;
- cultura/historia si procede;
- fuentes.

Cerrar depth vuelve al mismo cielo y misma orientación.

---

# 8 · Rol exacto de los assets

## Horizonte
ENTRY.

## Star dataset
CORE OBSERVABLE WORLD.

## Line geometry
INFERENCE/REVEAL overlay.

## 88 constellation masters
DEPTH after identification.

## Atlas / contact sheets / guides
EDITORIAL DEPTH or guided lessons.
Nunca primera pantalla.

## Osa Mayor → Polaris
Futura guided journey:
`LOCATE_URSA_MAJOR → EXTEND_POINTER_STARS → LOCATE_POLARIS → REVEAL`

No usar como wallpaper.

---

# 9 · Primer viewport

Debe contestar sin manual:
1. Estoy mirando un cielo.
2. Puedo mirar en otra dirección.
3. Hay algo que observar/buscar.
4. La respuesta no está ya escrita.

No mostrar de inicio:
- filtros;
- catálogo 88;
- lista de constelaciones;
- múltiples cards;
- datos técnicos;
- leyendas extensas;
- panel de facts;
- imagen de Orión.

---

# 10 · Accesibilidad equivalente

## Touch
- pan;
- botones de dirección visibles/abribles;
- tap zona;
- +/- zoom.

## Keyboard
Un solo viewport astronómico focusable:
- flechas = orientar;
- +/- = zoom;
- Enter = examinar centro/retícula;
- Escape = cerrar reveal/depth.

No convertir miles de estrellas en miles de tab stops.

## Screen reader
El viewport anuncia:
- dirección/campo actual;
- altitud/azimut si el modelo los soporta;
- señal observable cuando está en el campo, sin revelar identidad antes de acción.

Ejemplo previo a reveal:
**“En el centro hay tres estrellas brillantes casi alineadas.”**

Después de Enter:
**“Has localizado el cinturón de Orión.”**

Esto conserva:
`OBSERVE → INFER → REVEAL`

## REDUCED
- pan corto;
- sin inercia;
- reveal sin zoom dramático.

## NONE
- orientación por pasos;
- cambio instantáneo de campo;
- misma información y causalidad.

---

# 11 · Free/Plus

NO decidir en este estudio.

Primero hacer que Cielo funcione como Descubrimiento.

Después se clasifica:
`FREE / PLUS / FREE_CORE_PLUS_DEPTH`

No diseñar el mecanismo alrededor del paywall.

---

# 12 · Gates antes de código

### Gate 1 · modelo de cielo
Elegir:
`CURATED_PRESET`
o
`LOCALIZED_REAL_SKY`

### Gate 2 · primera experiencia
Aprobar Orión como primer target o elegir otro.

### Gate 3 · storyboard
Frames:
1. horizon entry;
2. orienting;
3. belt visible;
4. zone examined;
5. Orion revealed;
6. optional depth.

390 + 1440.

### Gate 4 · HUMAN QA María
Preguntas:
1. ¿entiendo que estoy explorando el cielo?
2. ¿sé qué acción puedo hacer?
3. ¿la acción cambia algo con sentido astronómico?
4. ¿puedo localizar el patrón sin que me den la respuesta?
5. ¿el reveal ocurre porque lo he localizado?
6. ¿el asset de constelación aparece después, no antes?
7. ¿me apetece seguir explorando?

Si falla 1–6:
`NO_CODE`

---

# 13 · Estado

`ASSETS_KEEP`
`PRODUCT_NEW_FROM_ZERO`
`NO_LEGACY_RUNTIME_REUSE`
`NO_REVEAL_BEFORE_SEMANTIC_ACTION`

Siguiente:
`HUMAN_DECIDE_SKY_MODEL_AND_FIRST_TARGET`
