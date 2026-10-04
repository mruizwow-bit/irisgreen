# HABITACIÓN IMPOSIBLE · ESTUDIO DE MECÁNICA Y PRODUCTO R01

Fecha: 2026-10-04  
Autoridad de producto: María  
Coordinación: Nexo  
Estado: **ESTUDIO / NO IMPLEMENTACIÓN**

Gate:
`HABITACION_PRODUCT_MECHANIC_STUDY_R01_ACTIVE`

Regla:
`NO_NEW_RUNTIME_UNTIL_MECHANIC_AND_INTERACTION_CONTRACT_HUMAN_APPROVED`

---

## 1 · Por qué se reabre el estudio

El runtime R06.1 pasó:
- solver/paridad;
- teclado;
- nombres accesibles;
- responsive;
- ES/EN.

Pero HUMAN QA de María demuestra que eso no equivale a juego usable.

Hallazgo:
`TECHNICAL_CORRECTNESS != PRODUCT_COMPREHENSION`

El prototipo:
- no se entiende de un vistazo;
- obliga a estudiar controles antes de entender la tarea;
- hace pequeña la escena y grande la interfaz;
- usa controles abstractos donde el concepto pedía manipulación de la propia escena.

No se escribe otra versión hasta comprender y fijar la mecánica.

---

## 2 · Qué hace REALMENTE el solver R06.1

El tablero lógico es un cubo discreto de:
`4 × 4 × 4` celdas.

Cada sala contiene:
- entrada `E`;
- salida `X`;
- una columna;
- un bloque;
- una losa fija.

### Orientaciones

Existen 4 orientaciones discretas.

Cambiar "suelo" aplica una rotación matemática al cubo completo:
- d0 = identidad;
- d1 = otra cara como suelo;
- d2 = otra cara como suelo;
- d3 = cara opuesta.

La geometría almacenada en coordenadas de sala NO cambia.

Por tanto:
`CHANGE_FLOOR = CHANGE_ROOM_ORIENTATION`

No es un sistema de física libre.

### Qué es una celda caminable

Una celda puede formar parte del recorrido si:
1. está dentro del cubo;
2. está vacía;
3. tiene suelo debajo o está en z=0.

El recorrido puede avanzar en las cuatro direcciones cardinales y:
- mantenerse a la misma altura;
- subir 1;
- bajar 1.

No puede saltar más de una unidad.

### Entrada

La entrada se proyecta a la orientación actual y "cae" verticalmente hasta la primera celda caminable.

### Salida

La salida se proyecta a la orientación actual y debe quedar directamente en una celda caminable.

### Piezas

- `losa` = inmóvil;
- `columna` = movible;
- `bloque` = movible.

El runtime permite mover una pieza una celda en el plano del suelo actual.

Después de moverla, esa pieza baja hasta quedar apoyada.

### Contratos de las cuatro salas actuales

Sala 1:
- existe solución solo cambiando orientación.

Sala 2:
- cambiar orientación por sí solo no basta;
- mover una pieza sí puede ser necesario/suficiente según secuencia.

Sala 3:
- ninguna solución solo con orientación;
- ninguna solución solo moviendo;
- obliga a combinar ambas.

Sala 4:
- abierta;
- muchas soluciones.

---

## 3 · Inconsistencia de modelo que hay que resolver

El concepto habla de "gravedad", pero el solver hace dos cosas distintas:

### Al cambiar suelo
Las piezas NO caen.
Permanecen fijas respecto a la sala.

### Al mover una pieza
La pieza SÍ cae hasta quedar apoyada.

Esto produce una regla física híbrida:
`ANCHORED_WHEN_ROOM_ROTATES / GRAVITY_WHEN_MANUALLY_MOVED`

Puede ser una regla de juego válida, pero no es intuitiva si se presenta simplemente como "gravedad".

### Decisión propuesta

No venderlo como simulación física de gravedad.

Modelo de producto:
**la habitación se reorienta; sus módulos están anclados a la arquitectura hasta que la persona decide recolocar uno.**

Cuando se recoloca un módulo:
- se coloca/snap en un destino válido;
- no necesitamos comunicar una simulación de caída.

Así la regla es coherente y predecible.

Si se quisiera gravedad física real —todas las piezas caen al girar la habitación— habría que:
- rehacer solver;
- rehacer las cuatro salas;
- rehacer progresión.

No hacerlo sin una decisión explícita posterior.

---

## 4 · Diferencias entre el concepto aprobado y el runtime fallido

### A · Visual

Concepto R62:
- sala cúbica;
- piedra/material;
- volumen;
- sombras;
- atmósfera;
- entrada y salida claras;
- recorrido visible.

Runtime R06.1:
- wireframe/diagrama isométrico pequeño;
- rejilla dominante;
- objetos poco diferenciados;
- escena visualmente subordinada a los controles.

Resultado:
`VISUAL_PRODUCT_FIDELITY_FAIL`

### B · Selector de suelo

Concepto:
- miniaturas de la propia sala;
- cada miniatura muestra qué cara pasará a ser suelo;
- cambio visible de orientación.

Runtime:
- cuatro mini-cubos pequeños + números 1/2/3/4;
- la consecuencia requiere interpretación.

Resultado:
`FLOOR_SELECTION_AFFORDANCE_FAIL`

### C · Movimiento de piezas

El documento visual móvil aprobado decía literalmente:
`TOCA UNA PIEZA Y LUEGO SU DESTINO`

El runtime usa:
- anterior;
- siguiente;
- nombre de pieza;
- ↑ ↓ ← →.

Es una contradicción directa con el contrato aprobado.

Resultado:
`DIRECT_MANIPULATION_CONTRACT_BROKEN`

### D · Giro manual de piezas

El concepto menciona recolocar y girar piezas.

El runtime actual:
- recoloca;
- NO ofrece giro manual de pieza.

Antes de reconstruir hay que decidir si el giro manual:
- forma parte realmente del juego;
- o se elimina del contrato.

No dejarlo ambiguo.

---

## 5 · Definición humana del juego

Si no se puede explicar así, no se construye:

> Hay una entrada y una salida dentro de una habitación cúbica.  
> Tu objetivo es conseguir un camino continuo entre las dos.  
> Puedes cambiar qué cara de la habitación está abajo y, en algunas salas, recolocar piezas de piedra para crear escalones o puentes.  
> Cada cambio modifica inmediatamente el recorrido visible.

No personaje.
No puntos.
No cronómetro.
No vidas.
No "correcto/incorrecto".

La recompensa es:
`AHA → AHORA ENCAJA`

---

## 6 · Contrato de interacción propuesto

Principio:
`SCENE_IS_THE_PRIMARY_CONTROLLER`

No:
`CONTROL_PANEL_IS_THE_GAME`

### Cambiar orientación

La persona debe actuar sobre una representación de la habitación, no sobre "Suelo 1/2/3/4".

Opciones válidas para prototipo:
- miniaturas grandes de la propia habitación;
- o control de orientación directamente asociado al cubo.

Al elegir:
1. preview comprensible;
2. la habitación cambia de orientación;
3. entrada/salida/piezas permanecen visualmente identificables;
4. el recorrido se recalcula delante de la persona.

### Mover una pieza

Flujo primario:
`TAP PIECE → VALID DESTINATIONS APPEAR → TAP DESTINATION`

No flechas como UI principal.

El objeto seleccionado:
- se ilumina/marca;
- destinos válidos aparecen en la propia escena;
- destinos imposibles NO parecen botones.

Después:
- pieza se coloca;
- recorrido se actualiza inmediatamente.

### Undo

Acción siempre disponible:
`DESHACER`

El juego debe invitar a probar, no penalizar.

### Reset

Secundario:
`REINICIAR SALA`

---

## 7 · Progresión correcta

Apple recomienda introducir los elementos de juego de uno en uno y permitir que la persona demuestre lo aprendido antes de añadir complejidad.

Aplicación:

### Sala 1 · solo orientación

Objetivo:
entender que una pared puede pasar a ser suelo.

Interfaz:
- escena grande;
- entrada y salida evidentes;
- cero piezas movibles;
- solo 2 orientaciones disponibles;
- una acción produce un cambio visual fuerte y comprensible.

No controles de piezas.

Gate:
la persona debe resolverla sin explicación externa.

### Sala 2 · solo pieza

Objetivo:
entender recolocación.

Interfaz:
- orientación fijada;
- una única pieza claramente manipulable;
- tocar pieza;
- 2–3 destinos válidos visibles;
- tocar destino.

No selector de suelo.

### Sala 3 · combinar

Solo ahora:
- selector de orientación;
- una pieza;
- combinación de ambas ideas.

### Sala 4 · abierta

Más libertad:
- varias soluciones;
- puede introducir segunda pieza si HUMAN QA demuestra que sigue siendo legible.

---

## 8 · Contrato visual

La referencia visual R62 vuelve a ser fuente de dirección.

La escena debe ocupar la mayor parte del viewport.

Prioridades visuales:

1. **Entrada**
   - marco claro;
   - inequívoca.

2. **Salida**
   - latón/oro;
   - inequívoca.

3. **Recorrido actual**
   - visible como material/ranura/luz;
   - mostrar hasta dónde llega;
   - no depender solo del color.

4. **Piezas manipulables**
   - material distinto;
   - seleccionables directamente.

5. **Orientación actual**
   - el suelo debe sentirse como suelo;
   - no requerir leer "Suelo 3".

6. **Destinos válidos**
   - aparecen solo cuando una pieza está seleccionada.

Eliminar del first view:
- panel de cuatro flechas;
- carousel anterior/siguiente pieza;
- números abstractos 1–4 como explicación principal.

---

## 9 · Feedback

Toda acción debe tener efecto inmediatamente visible.

Principios de direct manipulation:
- objeto visible;
- acción sobre el objeto;
- efecto rápido;
- incremental;
- reversible.

Al cambiar orientación:
- rotación/reencuadre visible;
- con reduced motion: snap/crossfade sin giro.

Al mover:
- la pieza viaja/snap al destino;
- el recorrido se vuelve a dibujar.

Cuando se conecta:
- pulso/luz recorre de entrada a salida;
- aparece "Sala resuelta";
- siguiente sala.

No confeti obligatorio.
No flash.
No score.

---

## 10 · Accesibilidad sin sacrificar la interacción

Pointer/touch:
`tap piece → tap destination`

Esto proporciona una alternativa de un solo puntero y evita depender del drag.

Opcionalmente puede existir drag como comodidad, nunca como único camino.

Keyboard:
- Tab a pieza/orientación;
- Enter selecciona;
- Tab/cursores entre destinos;
- Enter coloca;
- Deshacer/Reiniciar accesibles.

44×44 mínimo.
Forced colors.
Reduced/none motion.
No información solo por color.

---

## 11 · Gates antes de programar

### Gate A · explicación
María/Nexo pueden explicar exactamente:
- objetivo;
- regla de orientación;
- regla de piezas;
- qué puede tocarse;
- qué ocurre después.

### Gate B · storyboard
Crear 3–5 fotogramas de interacción:
1. Sala 1 inicial.
2. elegir orientación.
3. resultado.
4. Sala 2 seleccionar pieza.
5. elegir destino.

Si viendo los fotogramas no se entiende sin manual:
`REWORK BEFORE CODE`

### Gate C · paper interaction
Antes del runtime:
- simular Sala 1;
- simular Sala 2;
- comprobar que la primera acción es obvia.

### Gate D · runtime mínimo
Solo después:
- una sala;
- arte suficiente para leerla;
- manipulación directa real;
- no catálogo de controles.

---

## 12 · Fuentes de interacción

Direct manipulation:
- objetos y acciones visibles;
- acciones rápidas, reversibles e incrementales;
- efectos inmediatamente visibles.

Game onboarding:
- una mecánica por vez;
- instrucciones cortas;
- persona activa;
- complejidad progresiva.

Accessibility:
- no depender de gestos complejos;
- drag debe tener alternativa simple;
- teclado equivalente.

Fuentes de referencia:
- Shneiderman / University of Maryland · Direct Manipulation.
- Oxford Academic · principle of direct manipulation.
- Apple Developer · Onboarding for Games.
- W3C WCAG 2.2 · Pointer Gestures / Dragging Movements / Keyboard.

---

# 13 · Decisión actual

`KEEP_CORE_IDEA`

`DISCARD_CURRENT_RUNTIME_UI`

`DO_NOT_REUSE_R06_1_RENDERER_AS_PRODUCT`

`KEEP_SOLVER_AS_REFERENCE_ONLY_UNTIL_RULE_MODEL_IS_HUMAN_APPROVED`

`NO_CLAUDE_IMPLEMENTATION`

Siguiente:
`HUMAN_APPROVE_MECHANIC_AND_INTERACTION_STORYBOARD_BEFORE_CODE`
