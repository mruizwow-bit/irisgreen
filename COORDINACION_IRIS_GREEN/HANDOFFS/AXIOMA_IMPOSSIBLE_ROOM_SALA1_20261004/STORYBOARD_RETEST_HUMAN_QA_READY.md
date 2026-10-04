# AXIOMA · HABITACIÓN IMPOSIBLE · SALA 1 · STORYBOARD RETEST

Fecha: 04/10/2026

Gate:
`AXIOMA_IMPOSSIBLE_ROOM_SALA1_STORYBOARD_READY_FOR_HUMAN_QA`

## Evidencia revisada

1. `Interfaz de puzzle Habitación imposible-4 (1).png`
   - 1536×1024 RGBA
   - SHA-256: `9469817ca0ab3fa759a89fb6a59b80915382ef724c1d2272910a5a0dbbce81d0`

2. `Comparativa de interfaz para puzzle espacial-3 (1).png`
   - 1536×1024 RGBA
   - SHA-256: `1bc2962ba307b122fc119b49ad57e05a7296bb91019969f1556b2451ece2f788`

3. `Storyboard UI de puzzle isométrico-2 (1).png`
   - 1536×1024 RGBA
   - SHA-256: `1a62ffdf9afda00ef344a04bc87006155f62763367df5e36938ec7f732360567`

4. `Storyboard de puzzle isométrico en español-1 (1).png`
   - 1536×1024 RGBA
   - SHA-256: `d15ea8179e7f934633e5c34b04226ef0c57026453f23ac7c2186625b4e258ffd`

## Selección Axioma

### CANDIDATA PARA HUMAN QA
**Propuesta 2 · Comparativa de interfaz para puzzle espacial-3**

Es la propuesta más sólida para accesibilidad cognitiva e interacción antes de código.

PASS storyboard:
- 390 y 1440 resueltos de forma coherente;
- objetivo inicial explícito;
- cuatro orientaciones como acciones discretas;
- selected visible por forma + estado, no solo color;
- feedback textual persistente en cada etapa;
- estado resuelto inequívoco;
- CTA “Siguiente sala” visible y grande;
- “Sala 1 de N” independiente de los dots;
- no requiere drag para entender la mecánica;
- la acción puede implementarse directamente como botones nativos;
- `EXPLORE → LOCATE → REVEAL` queda traducido a:
  `OBSERVAR → ELEGIR ORIENTACIÓN → VER CONSECUENCIA → CAMINO CONECTADO → SALA RESUELTA`.

### Requisitos de implementación ya fijados por Axioma

Los cuatro botones de orientación deben ser:
- `button` reales;
- >=44×44 CSS px;
- Enter/Space;
- nombre accesible:
  - Arriba;
  - Derecha;
  - Abajo;
  - Izquierda;
- selected con `aria-pressed=true`;
- foco visible independiente del estado seleccionado.

En móvil, aunque el texto visible pueda reducirse al icono:
- el nombre accesible completo es obligatorio.

Feedback:
- `aria-live=polite`;
- no mover foco al cambiar orientación;
- no mover foco automáticamente al resolver;
- “Siguiente sala” aparece en DOM después de resolución.

Motion:
- NORMAL puede animar reorientación;
- REDUCED: transición breve/no espacial;
- NONE: cambio instantáneo;
- ninguna pista depende del movimiento.

Forced colors:
- selected/focus no dependen del glow azul;
- estado resuelto no depende del brillo de puerta/camino.

### Propuesta 1 · piedra
**NO PASS como storyboard final actual.**

Tiene la identidad “habitación imposible” más explícita y se puede conservar como referencia de arte, pero el frame 3 a 390 px presenta solapamiento/clipping real de texto:
- “Salida: arriba derecha”;
- “Orientación: pared lateral”;
- “Camino: conectado”.

Por tanto no es candidato final sin reflow.

### Propuesta 3
**KEEP parcial.**

Buen panel de estados, pero:
- los controles de orientación aparecen superpuestos sobre la escena;
- incrementan riesgo de oclusión/foco;
- el estado 4 no muestra CTA de continuación.

No preferida.

### Propuesta 4
**KEEP parcial.**

Muy limpia y directa, pero:
- usa dos progresos simultáneos (“Sala 1 de N” + 1/4, 2/4…);
- los botones de orientación no llevan texto visible en escritorio;
- es algo menos autoexplicativa que la propuesta 2.

Puede aportar copy y limpieza visual, no el patrón principal.

## Aclaración de alcance

Este gate aprueba el **storyboard pre-code para HUMAN QA**.

NO significa:
- conformidad WCAG;
- QA de implementación;
- aprobación legal;
- PASS de runtime.

Después de HUMAN QA María, el código deberá volver a Axioma para:
- teclado;
- foco/orden;
- roles/nombres/estados;
- touch;
- 320/390/1440;
- texto 200%;
- contraste computado;
- forced-colors;
- REDUCED/NONE;
- ES/EN;
- aria-live.

## Gate

`AXIOMA_IMPOSSIBLE_ROOM_SALA1_STORYBOARD_READY_FOR_HUMAN_QA`
