# AXIOMA · PRE-CODE A11Y QA · HABITACIÓN IMPOSIBLE · SALA 1

Fecha: 04/10/2026

Estado:
`AXIOMA_IMPOSSIBLE_ROOM_SALA1_PRECODE_REWORK_REQUIRED`

## Evidencia visual revisada

1. `Progresión de la Habitación Imposible-4.png`
   - 1223×1286 RGBA
   - SHA-256: `77eb04c3b88ff229415f146ea9eeefc2e6d3e9f5c5f26a473bb094302704a1a4`
2. `Tutorial de Habitación Imposible-3.png`
   - 1536×1024 RGBA
   - SHA-256: `8992eed88ac9b8d4a9a2acb4a16ef9b1d176edfbebb194344b9857ec4bc55e6b`
3. `Storyboard de puzzle isométrico acogedor-2.png`
   - 1536×1024 RGBA
   - SHA-256: `d36ac4838cfba1df6deb1b6deada434f226002b76a6ed9da797caa59419fa22c`
4. `Rompecabezas del observatorio estelar-1.png`
   - 1536×1024 RGBA
   - SHA-256: `87a79014a5fe0ffcebd8e41034428fff53ab7c294eddd9b8ee30e19224fec37c`

Contrato de producto:
`EXPLORE → LOCATE → REVEAL`

Para Sala 1:
`OBSERVAR → ELEGIR/PROBAR ORIENTACIÓN → VER CONSECUENCIA → CONECTAR ENTRADA/SALIDA → REVELAR SALA RESUELTA`

## Veredicto por propuesta

### 1 · Progresión de la Habitación Imposible
**KEEP visual / REWORK interacción.**

Fortalezas:
- la habitación imposible se entiende;
- entrada y salida tienen identidad visual fuerte;
- el camino resuelto queda muy claro;
- el estado final tiene acción evidente “Siguiente sala”.

Problema:
- las miniaturas inferiores no explican por sí mismas qué acción representan;
- en estado inicial una miniatura ya aparece resaltada, por lo que no queda claro si se está eligiendo, confirmando o comparando;
- el giro se comunica con movimiento/halo, no con un control semántico visible.

### 2 · Tutorial de Habitación Imposible
**MEJOR BASE DE PRODUCTO / KEEP + REWORK.**

Es la propuesta que mejor explica la intención:
“Une la entrada con la salida. Prueba otra orientación.”

KEEP:
- mecánica de habitación completa;
- puerta de entrada + puerta de salida;
- cambio de orientación;
- camino final;
- CTA de siguiente sala.

Rework:
- convertir las miniaturas en controles inequívocos;
- evitar depender del gran giro animado como única explicación;
- el copy debe reflowear debajo de la escena en ancho estrecho;
- estado 2 necesita una acción clara: seleccionar una orientación debe tener una consecuencia semántica inmediata o un botón explícito de probar/confirmar.

### 3 · Storyboard acogedor 390/1440
**KEEP solo como patrón de responsive/estado; NO como identidad visual canónica.**

Aporta:
- lectura clara en 390 y 1440;
- feedback textual persistente;
- progresión de estado legible;
- shell móvil útil como referencia.

Pero:
- cambia la identidad de “habitación imposible” por una habitación cotidiana;
- las flechas laterales parecen un control, pero no están definidas semánticamente;
- “¿Es la correcta?” introduce un paso cognitivo extra sin mostrar un botón de confirmar;
- los puntos superiores no pueden ser el único indicador de progreso.

### 4 · Rompecabezas del observatorio
**REJECT para Sala 1.**

Cambia la mecánica:
- pasa de orientar la habitación a rotar/elegir piezas de suelo;
- introduce avatar/robot y otro modelo mental;
- no es una traducción visual del contrato de Sala 1 sino otro juego.

Puede conservarse como referencia para otro interés, no para este gate.

## Requisitos duros antes de código

### A · Acción semántica equivalente

Nunca:
`DRAG_ONLY`

Debe existir una acción semántica equivalente y operable sin precisión motora.

Patrón recomendado:
- cada orientación = botón o radio real;
- nombre accesible: “Orientación 1”, “Orientación 2”… o nombre funcional definido por Nexo;
- estado seleccionado mediante `aria-pressed` o radio checked;
- activar con Enter/Space;
- touch target mínimo 44×44 CSS px.

El drag/giro gestual puede ser adicional, nunca obligatorio.

### B · Orden de foco

Orden esperado:
1. título / objetivo;
2. escena o descripción equivalente;
3. controles de orientación;
4. feedback/estado;
5. “Siguiente sala” cuando aparezca.

No mover el foco automáticamente al reorientar.
El control activado conserva el foco.
Al resolver, anunciar el éxito y hacer aparecer “Siguiente sala”, pero no secuestrar el foco.

### C · Equivalente textual de la escena

La habitación no puede ser solo una imagen.

Debe existir descripción actualizable que exponga el mismo estado sin revelar información que una persona vidente no tenga:

Ejemplo de estructura:
- Sala 1.
- Entrada: zona inferior izquierda.
- Salida: zona superior derecha.
- Orientación actual: X.
- Estado: camino no conectado / camino conectado.

No describir “la solución correcta” antes de que la persona la descubra.

La escena visual puede ser `role=img` / SVG accesible / canvas con nombre, pero los datos esenciales deben existir también como DOM.

### D · Feedback no dependiente del color

No basta:
- borde dorado;
- puerta brillante;
- camino luminoso;
- estrella amarilla.

Añadir siempre estado textual/semántico:
- “Orientación seleccionada”;
- “Camino conectado”;
- “Sala resuelta”.

Para selected:
`aria-pressed=true` / checked.

Para resolución:
`aria-live="polite"`.

### E · Reduced motion

En REDUCED:
- no rotación larga del cubo/habitación;
- transición breve o cross-fade/salto de orientación;
- eliminar órbitas decorativas/giros repetidos;
- partículas de éxito reducidas o ausentes.

### F · No motion

En NONE:
- cero interpolación de giro;
- cambio instantáneo entre orientaciones;
- ningún movimiento continuo;
- ninguna pista depende de animación.

### G · Forced colors

En forced-colors:
- selected debe seguir visible con `Highlight/HighlightText` o outline del sistema;
- foco visible;
- puertas y camino no pueden depender de glow;
- “Camino conectado” y “Sala resuelta” permanecen como texto real.

### H · Progreso

Los puntos visuales no son suficientes.

Exponer:
- “Sala 1 de N”;
- estado actual;
- nombre accesible de cada paso si existe navegación.

Los dots pueden mantenerse decorativamente.

### I · Reflow / texto 200%

Obligatorio:
- 320 / 390 / 1440;
- texto 200%;
- sin clipping;
- sin overlay de copy sobre controles;
- la columna de instrucciones pasa debajo de la habitación cuando no quepa;
- thumbnails/controles pueden hacer wrap.

### J · Contraste

En implementación:
- texto normal >= 4.5:1;
- componentes/foco/estados visuales >= 3:1 respecto al fondo adyacente;
- medir colores computados reales, no solo tokens.

## Dirección recomendada a Prisma

Construir R02 de storyboard combinando:

- **mecánica y mundo visual** de la propuesta 2;
- **claridad del camino final** de la propuesta 1;
- **patrón responsive y feedback textual** de la propuesta 3;
- **descartar la mecánica** de la propuesta 4.

No añadir Sala 2.
No código todavía.

## Gate requerido antes de implementación

Prisma debe entregar 4 frames definitivos en 390 y 1440:

1. Estado inicial:
   - objetivo comprensible;
   - orientaciones reconocibles como controles.
2. Orientación seleccionada:
   - selected inequívoco por forma + estado semántico;
   - sin depender de animación.
3. Habitación reorientada / camino conectado:
   - consecuencia visible;
   - equivalente textual.
4. Sala resuelta:
   - “Camino conectado / Sala resuelta”;
   - “Siguiente sala” >=44 px.

Axioma vuelve a revisar esos 8 frames antes de código.

Gate esperado:
`AXIOMA_IMPOSSIBLE_ROOM_SALA1_STORYBOARD_READY_FOR_HUMAN_QA`

No se emite todavía.
