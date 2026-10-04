# HABITACIÓN IMPOSIBLE · SALA 1 · STORYBOARD FUNCIONAL R01

Fecha: 2026-10-04
Owner funcional: Nexo
Dirección visual: Prisma
Autoridad HUMAN QA: María

Estado:
`ROOM_1_FUNCTIONAL_STORYBOARD_READY_FOR_PRISMA`

Regla superior:
`UNDERSTAND_THE_TASK_BEFORE_UNDERSTANDING_THE_INTERFACE`

No runtime nuevo antes de HUMAN QA del storyboard.

---

# 1 · Qué enseña Sala 1

Una sola idea:

`THE_ROOM_CAN_CHANGE_ORIENTATION`

No enseña:
- mover piezas;
- elegir pieza;
- flechas;
- rotar pieza;
- cuatro orientaciones;
- combinaciones.

La persona debe descubrir únicamente:

> **Si cambio qué cara de la habitación queda abajo, el camino puede conectar.**

---

# 2 · Estado lógico real

Sala 1 actual del solver:

Entrada:
`E = [0,2,0]`

Salida:
`X = [2,0,2]`

Piezas:
- columna en `[1,0]`, altura 3;
- bloque en `[0,1]`, altura 1;
- losa fija en `[0,0]`, altura 1.

Solver:

- orientación 1 → NO camino;
- orientación 2 → SÍ camino;
- orientación 3 → NO camino;
- orientación 4 → NO camino.

Secuencia mínima:
`ORIENTATION_1 → ORIENTATION_2 → SOLVED`

Para onboarding se exponen solo:
- estado actual;
- una alternativa real.

Las otras dos orientaciones permanecen fuera de Sala 1.

---

# 3 · Modelo mental que debe transmitir

No usar como copy principal:
- “Suelo 1”;
- “Suelo 2”;
- “gravedad 2”;
- números 1–4.

Modelo visible:

**La habitación es un objeto que puede apoyarse sobre otra de sus caras.**

La arquitectura y sus módulos permanecen unidos a la habitación.

No simular piezas cayendo al cambiar orientación.

---

# 4 · Composición de pantalla

Prioridad:

`ROOM > GOAL > ORIENTATION CHOICE > SECONDARY CONTROLS`

## Escena

La habitación ocupa aproximadamente:
- móvil: 60–70 % de la altura útil central;
- escritorio: el foco visual dominante.

Debe recuperar la dirección R62:
- cubo de piedra;
- profundidad;
- luz;
- sombras;
- entrada clara;
- salida de latón/oro;
- recorrido actual visible;
- pieza/arquitectura legible.

No wireframe como representación principal.

## Cabecera mínima

- “Habitación imposible”
- “Sala 1”
- salida/volver secundaria
- idioma/tema solo si el shell global lo requiere

No llenar la primera vista de utilidades.

## Objetivo

Texto corto:

**Une la entrada con la salida.**

Segunda línea solo si hace falta:

**Prueba a cambiar qué cara queda abajo.**

No explicación larga.

---

# 5 · Frame 01 · ESTADO INICIAL

La persona ve:

- cubo/sala grande;
- ENTRADA inequívoca;
- SALIDA inequívoca;
- recorrido visible desde la entrada;
- recorrido termina antes de alcanzar la salida;
- la salida está claramente más alta/inaccesible.

Debajo de la escena:

**Prueba otra orientación**

Dos miniaturas grandes de la MISMA habitación:

1. miniatura A:
   - estado actual;
   - marcada “Actual” visualmente;
   - no necesita número.

2. miniatura B:
   - muestra la misma habitación apoyada sobre otra cara;
   - flecha/chevrón hacia abajo indicando qué cara será el apoyo;
   - no muestra el resultado del camino.

La miniatura B debe parecer claramente accionable.

Pregunta perceptual:
> Sin leer un manual, ¿entiendo que puedo probar a apoyar la habitación de otra manera?

Si no:
`REWORK_BEFORE_FRAME_02`

---

# 6 · Frame 02 · SELECCIÓN

La persona toca la miniatura B.

Respuesta inmediata:

- B queda seleccionada;
- la habitación principal comienza a reorientarse.

NORMAL:
- rotación corta, clara y continua;
- no giro ornamental;
- mantener referencias de entrada/salida durante el movimiento.

REDUCED:
- transición muy corta / crossfade/reencuadre.

NONE:
- cambio instantáneo de estado.

No aparece:
- “Correcto”;
- punto;
- estrella;
- puntuación.

El feedback es la propia transformación.

---

# 7 · Frame 03 · NUEVA ORIENTACIÓN

Tras el cambio:

- la nueva cara se percibe inequívocamente como base;
- entrada y salida siguen identificables;
- arquitectura/piezas mantienen identidad;
- el recorrido se recalcula inmediatamente.

El recorrido ahora llega hasta la salida.

La persona debe poder entender:

> “Ah, al apoyar la habitación de otra manera, ahora sí conecta.”

No texto explicativo obligatorio.

---

# 8 · Frame 04 · RESOLUCIÓN

Cuando la ruta conecta:

Feedback visual contenido:

- un pulso/luz recorre el camino desde ENTRADA hasta SALIDA;
- la salida recibe un pequeño énfasis;
- copy:

**Camino completo**

Botón:
**Siguiente sala**

No:
- confeti;
- marcador;
- tiempo;
- “¡Correcto!” gigante;
- modal que tape la habitación.

La habitación resuelta sigue visible.

---

# 9 · Qué NO existe en Sala 1

Eliminar completamente del viewport:

- selector “Suelo 1/2/3/4”;
- “Pieza anterior”;
- “Pieza siguiente”;
- nombre de pieza como botón;
- ↑ ↓ ← →;
- controles de mover;
- losa/columna como selección;
- instrucciones sobre mover piezas.

Sala 1 es deliberadamente pequeña como sistema.

---

# 10 · Interacción accesible equivalente

Touch/pointer:
- tocar miniatura de orientación.

Keyboard:
- Tab llega a las dos orientaciones;
- Enter/Espacio selecciona.

Nombre accesible sugerido:

A:
`Orientación actual`

B:
`Cambiar orientación: apoyar la habitación sobre la pared lateral`

El nombre final se ajustará a lo que la miniatura represente visualmente.

No usar:
`Suelo 2`
como única etiqueta accesible.

---

# 11 · Deshacer

Sala 1 puede permitir volver a orientación A tocando su miniatura.

Eso hace la interacción:
- reversible;
- explorable;
- sin miedo a equivocarse.

No hace falta botón “Deshacer” adicional en esta sala si A/B ya son reversibles.

---

# 12 · Regla de puzzle

Aunque sea onboarding, no debe resolverse sola.

La persona tiene que hacer la acción.

No:
- autoselección;
- animación que enseñe la solución antes del toque;
- tooltip “elige la segunda”.

La interfaz sí debe hacer evidente **qué se puede probar**, no cuál es la respuesta.

---

# 13 · Gate visual para Prisma

Prisma debe producir storyboard estático de 4 frames:

1. `ROOM1_F01_INITIAL`
2. `ROOM1_F02_ORIENTATION_SELECTED`
3. `ROOM1_F03_REORIENTED_PATH_CONNECTED`
4. `ROOM1_F04_SOLVED`

En:
- 390 px;
- 1440 px.

Primero puede entregar una composición de revisión, pero cada frame debe existir individualmente.

Usar la dirección artística R62 como referencia:
- no recrear el wireframe R06.1;
- no inventar nueva estética sin necesidad;
- recuperar piedra, luz, profundidad, latón, entrada/salida y recorrido.

---

# 14 · HUMAN QA María

Preguntas binarias:

1. ¿Entiendo que tengo que unir entrada y salida?
2. ¿Veo claramente por qué ahora no llegan?
3. ¿Veo sin explicación que puedo cambiar la orientación de la habitación?
4. ¿Entiendo qué ocurrirá al tocar la miniatura alternativa?
5. Después del cambio, ¿entiendo por qué ahora sí funciona?
6. ¿La escena parece un juego y no un diagrama?
7. ¿Me apetece probar?

Si 1–5 no son PASS:
`NO_CODE`

Si 6–7 fallan:
`VISUAL_PRODUCT_REWORK_BEFORE_CODE`

---

# 15 · Siguiente

Solo después de HUMAN QA de Sala 1:
`DESIGN_ROOM_2_FUNCTIONAL_STORYBOARD`

No diseñar Sala 3/4 todavía.
