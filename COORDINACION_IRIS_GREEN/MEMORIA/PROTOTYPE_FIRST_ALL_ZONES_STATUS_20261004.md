# IRIS GREEN · PROTOTYPE-FIRST ALL ZONES · ESTADO CANÓNICO

Fecha: 2026-10-04  
Owner de continuidad: **Nexo · Continuidad Técnica & Sistemas**  
Fuente: decisiones explícitas de María + auditorías/revisiones técnicas de los prototipos entregados.  
Estado superior:

`PROTOTYPE_FIRST_ALL_ZONES_GATE_ACTIVE`

## 0 · Regla de proyecto

Iris Green deja de escalar producto por familias antes de tener una base de producto probada.

Secuencia obligatoria:

`ZONA / PATRÓN → PROTOTIPO → TECHNICAL REVIEW → HUMAN QA MARÍA → PASS → DOCUMENTAR PATRÓN`

Hasta completar el mapa de prototipos representativos de **todas las zonas/tipos de experiencia**:

`NO_SCALE_AND_BUILD`

Permitido:
- recuperar prototipos;
- corregir prototipos;
- crear prototipos de zonas/patrones aún no cubiertos;
- QA técnico, accesibilidad, responsive y HUMAN QA;
- preservar arte/media/productos KEEP;
- documentar patrones reutilizables.

No permitido:
- escalar a lotes completos;
- multiplicar variantes antes de PASS;
- usar una plantilla universal entre productos distintos;
- declarar producto final por CI/axe/build sin HUMAN QA;
- continuar producción masiva de una zona cuyo patrón aún no esté validado.

Gate global futuro:

`ALL_ZONES_PROTOTYPE_FOUNDATION_HUMAN_QA_PASS`

Solo después:

`SCALE_AND_BUILD_REOPENED`

---

# 1 · Mapa actual de prototipos

## A · Juegos · búsqueda / descubrimiento
Prototipo: **Mapa del tesoro de casa**

Contrato:
`ESCONDER → PISTA → EXPLORAR → DESCARTAR → NUEVA PISTA → TESORO`

Estado funcional:
- concepto R01 descartado;
- R03/R04 ya es juego real;
- 8 destinos;
- primera pista deja 4 candidatas;
- ninguna primera pista revela el tesoro;
- handoff de dos personas oculta el plano;
- foco de teclado preservado tras descartar habitación;
- targets 44×44+;
- 320/390/1440 sin overflow.

Estado actual:
`MAPA_TESORO_FUNCTIONAL_FREEZE`

Pendiente antes de cierre técnico total:
- microfix semántico EN de accessible names:
  - Language;
  - Dark mode;
  - Mode;
  - House floor plan;
- barrido EN/ES visible + accessibility strings.

Observación HUMAN QA:
- la primera pista tiende a ser separación amplia arriba/abajo por la topología;
- no es bug técnico; María decide si es demasiado previsible.

Gate esperado:
`MAPA_TESORO_TECHNICAL_BASE_READY_FOR_HUMAN_QA`

---

## B · Juegos · puzle espacial / causal
Prototipo: **Habitación imposible · R62 P01**

Concepto:
`KEEP`

Bucle:
`OBSERVAR → CAMBIAR SUELO Y/O MOVER PIEZA → RECALCULAR RUTA → DECIDIR → CONTINUAR`

Progresión:
- Sala 1 = aprender cambio de suelo;
- Sala 2 = girar no basta, hay que mover pieza;
- Sala 3 = exige combinar floor change + piece move;
- Sala 4 = abierta / varias soluciones.

Solver reproducible entregado en R05:
- `solver/tabla.js`;
- `solver/camino3.js`.

Tabla reproducible:
- Sala 1: floor-only 1 / move-only 0 / combined 91 / total 92;
- Sala 2: floor-only 0 / move-only 3 / combined 94 / total 97;
- Sala 3: floor-only 0 / move-only 0 / combined 44 / total 44;
- Sala 4: floor-only 0 / move-only 10 / combined 282 / total 292.

Secuencia mínima comprobada para Sala 3:
`suelo 4 → bloque ← ← ↑`

Accesibilidad:
- flechas con nombre acción + pieza + dirección;
- selector de pieza debe comunicar pieza seleccionada + acción de cambiar;
- anterior/siguiente traducidos ES/EN;
- 0 controles sin nombre;
- 0 nombres en idioma incorrecto tras cierre R05.

Estado:
`HABITACION_RUNTIME_SOLVER_REPRODUCIBLE_PASS`
`HABITACION_IMPOSIBLE_TECHNICAL_BASE_READY_FOR_HUMAN_QA`

No reabrir salas ni concepto salvo regresión demostrada.

---

## C · Taller · entrada guiada → creación libre
Prototipo: **Ritmo · Tu primer ritmo**

Patrón:
`LISTEN_LOCK → ONE_TARGET_UNLOCK → LISTEN_CHANGED → HEAR_BOTH → FREE_INSTRUMENT`

KEEP técnico:
- paso avanza al final real de reproducción, no al clic;
- `CLICKED_BOTH != HEARD_BOTH`;
- Stop cancela y recupera el estado sin deadlock;
- comparación interrumpida no cuenta como escuchada;
- loop libre funciona;
- Stop limpia y permite volver a reproducir;
- targets 44×48 en 320/390;
- una sola línea temporal con scroll interno;
- no secuestra Tab.

Estado:
`TALLER_RITMO_FUNCTIONAL_FREEZE`

Pendiente de cierre semántico:
- microfix EN de accessible names:
  - Language;
  - Motion;
  - Dark mode;
  - Guide;
  - Rhythm grid / Rhythm instrument;
- barrido ES/EN accessibility strings.

Gate esperado:
`TALLER_RITMO_TECHNICAL_BASE_READY_FOR_HUMAN_QA`

No reabrir onboarding/audio/grid salvo regresión.

---

## D · Intereses · explorar / descubrir / registrar
Prototipo: **Vida marina**

Se separan dos experiencias:

### D1 · Arrecife
Patrón:
`EXPLORE → NOTICE → APPROACH → DISCOVER → REGISTER → KEEP EXPLORING`

No:
- catálogo inicial;
- grid de 30 cards;
- peces canvas genéricos;
- usar contact sheet como sprite.

R05:
- shell por 4 hábitats;
- 0 catálogo inicial;
- runtime ES/EN corregido;
- barrido de cinco/siete estados EN sin fugas tras fix.

Estado:
`REEF_EXPERIENCE_SHELL_TECHNICAL_PASS`
`REEF_REAL_ASSETS_BLOCKED`

Bloqueo:
- faltan los PNG individuales reales de los peces para HUMAN visual QA.

### D2 · Bajar al fondo
Contrato:
`MOVE_LIGHT → REVEAL → DARKNESS_RETURNS`

5 zonas:
- epipelágica;
- mesopelágica;
- batipelágica;
- abisopelágica;
- hadal.

Reglas:
`USER_ACTION_ONLY_VISUAL_CHANGE`
`BIOLUMINESCENCE_IS_SIGNAL_NOT_ANIMATION`

KEEP:
- 0 requestAnimationFrame en reposo;
- canvas bit-identical sin input;
- cinco zonas;
- lista DOM equivalente;
- `NONLINEAR_DISPLAY_SCALE` declarado honestamente.

Pendientes:
- `DEEP_SEA_REAL_ASSETS_PENDING`;
- `FACTUAL_HOLD_PRAYA_DUBIA_ZONE`;
- no colocar Praya dubia hasta resolución factual;
- no llamar `REAL_SCALE` a la escala comprimida.

Estado:
`INTEREST_22_RUNTIME_BASE_READY`
con asset/factual holds separados.

---

## E · Rincón · vídeo relajante / audiovisual
Prototipo: **Pecera / Acuario R02**

Clasificación:
`RELAXING_AUDIOVISUAL_VIDEO`

NO es:
- juego;
- Taller;
- Interés;
- actividad con objetivo;
- descubrimiento;
- gamificación.

Producto:
la persona entra para **mirar y escuchar una pecera relajante**.

### Visual R02
Estado:
`RINCON_PECERA_R02_VISUAL_KEEP_CANDIDATE_FOR_HUMAN_QA`

Mejoras R02:
- `SCENE_LAYOUT_SEED` separado de `WATER_PALETTE` para comparaciones;
- `warm(nFrames)`;
- hierba por matas, sin retícula marcada;
- neones con mejor lectura de franjas;
- haces de luz más orgánicos;
- señales sutiles de cristal/menisco;
- evitación blanda de obstáculos;
- composición/cámara/cardumen preservados;
- rendimiento ~12.9 ms/frame, sin degradación significativa;
- costura de tramos exacta;
- determinismo preservado;
- flashing test local = `NO_PROBLEM_DETECTED`, no normative PASS.

No generar R03 visual por iniciativa propia.

### RNG
Hallazgo:
el informe R02 exageró el desacoplamiento total del RNG.
Persisten consumos de `Math.random` global en montaje (p. ej. peces/motas).

Regla:
`NO_VISUAL_REGRESSION > PERFECT_RNG_ARCHITECTURE`

O se termina el desacoplamiento preservando escena exacta, o se documenta como tech debt.

### Memoria
Clasificación:
`RENDER_PIPELINE_NATIVE_MEMORY_DEBT`

El troceado se mantiene.
No tratar como blocker de producto mientras:
- render por tramos funciona;
- costuras pasan;
- 5 min son reproducibles.

### MP4
Antes de derivado web final:
`RINCON_PECERA_MP4_FASTSTART_PASS`

El clip R02 de review tenía `moov` al final; añadir faststart al mux final y medir offsets reales.

---

# 2 · Pecera · contrato de sonido

Regla de producto de María:

`SOUND_ON_BY_DEFAULT`

Interpretación correcta:
- el vídeo se inicia con sonido a partir de una **acción de usuario** (ej. `Ver y escuchar`);
- no se exige autoplay audible espontáneo sin gesto;
- si `play()` es rechazado por política del navegador, mostrar Play sin mentir sobre el estado.

Control:
`Quitar sonido`

Al quitar/poner sonido:
- no pausa;
- no reinicia;
- no cambia `currentTime`;
- no recarga.

Bug R02 a corregir:
- reglas CSS contradictorias de icono;
- `volume=0` + “Poner sonido” debe restaurar volumen audible;
- ES/EN parity;
- README no puede conservar snippet antiguo con `muted`.

Gates:
`RINCON_SOUND_ICON_STATE_PASS`
`PUT_SOUND_RESTORES_AUDIBLE_STATE_PASS`
`RINCON_SOUND_ES_EN_PARITY_PASS`
`RINCON_SOUND_INTEGRATION_DOC_SINGLE_SOURCE_PASS`

---

# 3 · Pecera · dirección acústica corregida

María escucha en el clip:
- **burbujas = KEEP**;
- segundo fondo = FAIL perceptual.

Descripción de María:
“como cuando te sumerges en una piscina o el mar”, ruido hueco/amortiguado.

Diagnóstico:
- capa base con perspectiva submarina;
- oleaje/respiración lenta no corresponde a una bomba;
- exceso de energía grave produce sensación de “estar dentro del agua”.

Dirección aprobada:

`LISTENER_POSITION = IN_FRONT_OF_AQUARIUM_GLASS`

NO:
`UNDERWATER_LISTENER`

### KEEP
- burbujas actuales, sujetas a HUMAN QA de densidad/naturalidad.

### REMOVE
`REMOVE_SUBMERGED_HOLLOW_AMBIENCE`

Eliminar:
- ruido hueco submarino;
- sensación de piscina/mar;
- oleaje;
- modulación lenta tipo respiración de ~30 s.

### Nueva capa base
Construir UNA sola prueba corta con:
- bomba/filtro estable;
- zumbido discreto sin “respirar”;
- retorno/goteo/corriente suave del filtro;
- burbujas más claras desde perspectiva exterior;
- contenido suficiente en medios para portátil/tablet/móvil;
- sin estridencia;
- sin sonido de playa/mar.

No hacer 5 min todavía.

Entregable:
`PECERA_AUDIO_R03_EXTERIOR_40s`

HUMAN QA:
1. ¿Suena a pecera?
2. ¿Se oye a volumen normal?
3. ¿La bomba es estable?
4. ¿Las burbujas suenan naturales?
5. ¿El filtro sitúa la escucha delante del cristal?
6. ¿Hay algo que parezca mar/oleaje/submersión?

Gate:
`PECERA_AUDIO_EXTERIOR_HUMAN_QA_PASS`

---

# 4 · Rincón · música separada del sonido de Pecera

No confundir:
- **paisaje sonoro de Pecera**;
- **música del Rincón**.

### Claude Music 01
Estado:
`RINCON_MUSIC_01_HUMAN_QA_FAIL`

Diagnóstico:
- no melodía perceptible;
- bloques armónicos;
- static/block harmony.

### Claude Music 02
Mejora:
- sí hay melodía;
- frase/dirección perceptible.

Pero María NO aprueba la dirección musical para el Rincón.

Estado:
`RINCON_MUSIC_02_HUMAN_QA_FAIL`
`PERCEIVED_MELODY_YES / RINCON_MUSICAL_DIRECTION_FAIL`

Decisión:
`STOP_CLAUDE_COMPOSITION`
`HANDOFF_TO_MUSIC_EXPERT`

No Music 03.
No nueva flauta/Rhodes/mezcla de Claude.

Handoff al experto:
- Music 01 si está disponible;
- Music 02 Melody Only;
- Music 02 completa;
- diagnóstico de ambos;
- Music 02 es referencia diagnóstica, NO modelo estético.

Gate:
`RINCON_MUSIC_HANDOFF_TO_MUSIC_EXPERT_READY`

---

# 5 · Estado de evidencia / capturas

Las capturas incompletas de algunos prototipos se clasifican:
`EVIDENCE_CAPTURE_GAP`

No:
`PRODUCT_FAIL`

No modificar producto por limitaciones del capturador.

Aun así, completar cuando exista una superficie fiable:
- 320;
- 390;
- 1440;
- estados significativos.

---

# 6 · Siguiente micro-ronda de prototipos

Único código pendiente para cierre técnico de los cuatro primeros:

`R06_SEMANTIC_LANGUAGE_MICROFIX_MAP_AND_RHYTHM_ONLY`

Mapa:
- traducir accessible names dinámicos en EN.

Ritmo:
- traducir accessible names dinámicos en EN.

No tocar gameplay/visual.

Después:
`PROTOTYPES_TECHNICAL_BASE_READY_FOR_HUMAN_QA`

No:
`HUMAN_QA_PASS`

Eso lo decide María.

---

# 7 · Zonas/patrones aún por prototipar

Los cinco prototipos actuales NO completan el mapa del producto.

Pendiente inventario y prototipo representativo de patrones distintos, como mínimo donde aplique:
- Rutinas;
- Recursos / soporte;
- Datos / consulta;
- Investigación;
- Ayudas / trámites;
- Libros / muestra / compra;
- Sabik / conversación;
- Home / navegación global;
- otras superficies que el inventario de producto revele como patrón distinto.

Regla:
NO hace falta un prototipo por página.
Sí hace falta un prototipo por **tipo de experiencia realmente distinto**.

No forzar reutilización entre categorías que no comparten interacción.

---

# 8 · Marcadores canónicos actuales

`PROTOTYPE_FIRST_ALL_ZONES_GATE_ACTIVE`

`NO_SCALE_AND_BUILD`

`MAPA_TESORO_FUNCTIONAL_FREEZE`

`HABITACION_IMPOSIBLE_TECHNICAL_BASE_READY_FOR_HUMAN_QA`

`TALLER_RITMO_FUNCTIONAL_FREEZE`

`INTEREST_22_RUNTIME_BASE_READY`

`REEF_REAL_ASSETS_BLOCKED`

`DEEP_SEA_REAL_ASSETS_PENDING`

`FACTUAL_HOLD_PRAYA_DUBIA_ZONE`

`RINCON_PECERA_R02_VISUAL_KEEP_CANDIDATE_FOR_HUMAN_QA`

`RINCON_PECERA_SOUND_PRODUCT_CONTRACT_REWORK`

`PECERA_AUDIO_EXTERNAL_GLASS_PERSPECTIVE_REQUIRED`

`STOP_CLAUDE_COMPOSITION`

`RINCON_MUSIC_HANDOFF_TO_MUSIC_EXPERT_READY`

---

# 9 · Regla de continuidad

Cualquier agente que retome:
1. lee este documento;
2. lee el CONTROL asociado;
3. lee el issue específico de su zona;
4. NO reconstruye desde chat;
5. NO reabre un KEEP sin finding nuevo;
6. deja evidencia en GitHub.



---

# 10 · R06 semantic microfix · revisión independiente

Paquete revisado:
`PROTOTIPOS_IRIS_GREEN_R06_SEMANTIC_FIX.zip`

SHA:
- Mapa R06: `47d494b013691ca3cf990c8857e6f83593b1c3aa1a59d4ca20f3b6eff35ea509`
- Habitación: `c643e990726fd0a97c892410fdb8dd43e870b3631c2a3c54b482cb5f81f3c0a9` = R05
- Ritmo R06: `4d09487853a6096985727989991377ccbc97b5571c68436ada10dfd816a06194`
- Vida marina: `78fc43ae40ab15a1f9c8d2b226ae89904d48a6eefa9fae8070a65e81c27e86f7` = R05

## PASS confirmados

Mapa:
`MAPA_ES_EN_A11Y_PARITY_PASS`

Ritmo:
`RITMO_ES_EN_A11Y_PARITY_PASS`

El diff R05→R06 es semántico/a11y:
- diccionario a11y ES/EN;
- wiring en `idioma()`;
- options de movimiento;
- sufijos dinámicos locked/target;
- ids necesarios para regiones.

Habitación:
solver reproducido independientemente:
- Sala 1 = 1 / 0 / 91 / 92;
- Sala 2 = 0 / 3 / 94 / 97;
- Sala 3 = 0 / 0 / 44 / 44;
- Sala 4 = 0 / 10 / 282 / 292.

`camino3.js`:
`suelo 4 → bloque ← ← ↑`.

## REGRESIÓN R06 · DOCUMENT SHELL

Los dos HTML modificados en R06 —Mapa y Ritmo— perdieron accidentalmente respecto a R05:
- `<html lang="es">`;
- `<head>`;
- `<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`;
- cierre `</html>`.

El navegador puede reparar parte de la estructura implícitamente, pero la pérdida de `meta viewport` es material en móvil real y hace que las mediciones/capturas anteriores de 320/390 no sean evidencia válida del **R06 servido en dispositivo móvil**.

Por tanto:
`MAPA_R06_DOCUMENT_SHELL_REGRESSION`
`RITMO_R06_DOCUMENT_SHELL_REGRESSION`

No se acepta todavía:
`PROTOTYPES_TECHNICAL_BASE_READY_FOR_HUMAN_QA`.

## Microfix requerido

Restaurar en Mapa y Ritmo únicamente el shell válido de R05:
- doctype;
- `<html lang="es">`;
- `<head>`;
- charset;
- viewport;
- title/style;
- cierre de head/body/html conforme a la estructura previa.

Preservar íntegramente los fixes semánticos R06.

Después:
1. validar HTML/DOM;
2. repetir barrido ES/EN;
3. comprobar 320/390/1440 con viewport real;
4. 0 overflow;
5. targets >=44;
6. regresión funcional ya definida.

Gate siguiente:
`R06_1_DOCUMENT_SHELL_RESTORE_AND_SEMANTIC_PARITY_PASS`

Solo entonces:
`PROTOTYPES_TECHNICAL_BASE_READY_FOR_HUMAN_QA`.

## Evidencia de capturas

El ZIP conserva capturas antiguas R05 de Mapa a 320/1440 y nuevas R06 a 375.
Las capturas antiguas NO sustituyen la validación móvil del HTML R06 después de perder viewport meta.

`EVIDENCE_CAPTURE_GAP` permanece para:
- R06 móvil real tras shell restore;
- Ritmo 320/1440;
- Vida marina según inventario previo.

