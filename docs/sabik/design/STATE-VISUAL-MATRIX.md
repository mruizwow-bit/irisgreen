# STATE-VISUAL-MATRIX

**NO PUBLICAR · NO RUNTIME · REFERENCIA DE IMPLEMENTACIÓN**
Rama `sabik/design-states-voice` · issue #148 · PR draft #163

---

## Ejes

Ningún estado del encargo es un valor plano: cada uno es una combinación.

**Estos ejes son la proyección visual, no la máquina de estados.** La verdad del
comportamiento vive en `sabik-machine.js`; esta matriz describe cómo se ve cada
combinación representativa:

```
Máquina central S0
    ↓ deriveSabikPresentation(state)
Proyección visual (este documento)
    ↓
atributos data-*, clases, textos y controles
```

Codex no debe escribir un `switch` de veinte ramas, y Design no es la fuente de
verdad de las transiciones: las decide la máquina. Los veinte bloques de abajo
documentan vistas.

De los ejes, **cuatro ya existen** en `sabik/sabik-page.js`:
`data-cognitive-state`, `data-interaction-state`, `data-protection-state` y
`data-low-intensity`. **`data-voice-state` es el único atributo nuevo.** El
movimiento efectivo no es un atributo propio: se deriva del sistema global de
preferencias de Iris Green y de la preferencia del dispositivo.

| Eje | Soporte | Valores | Significado |
|---|---|---|---|
| `data-cognitive-state` | `#sabik-hologram` | `NucleoBase` · `Hiperfoco` · `Sobrecarga` · `Vinculo` · `VozInterior` · `Creatividad` | Identidad del holograma. **No es estado de conversación y no describe a la persona.** |
| `data-interaction-state` | `#sabik-hologram` | `arrancando` · `espera` · `buscando` · `componiendo` · `respuesta` · `aclaracion` · `correccion` · `pausa` · `error` · `derivacion` | Dónde está el turno. Extiende los cinco valores actuales. |
| `data-protection-state` | `#sabik-hologram` | `normal` · `incierto` · `riesgo` | Protección. `incierto` es nuevo. |
| `data-low-intensity` | `#sabik-hologram` | `true` · `false` | Baja intensidad pedida por la persona. |
| `data-voice-state` | `#sabik-voice` — **único atributo nuevo** | `silencio` · `iniciando` · `hablando` · `pausada` · `finalizada` · `error` | Locución. Único eje que mueve las ondas. |
| Movimiento efectivo | **Derivado, no es atributo propio** | `normal` · `reducido` | `manualReadingPreference \|\| systemReducedMotion`. Se proyecta con los atributos que la web ya mantiene. Ver estado 19. |

Estados de contenedor, no de atributo:

| Estado | Soporte |
|---|---|
| Plegado | `.sabik-panel.is-collapsed` + `body.sabik-panel-collapsed` |
| Oculto | `.sabik-panel[hidden]` |

### Combinaciones prohibidas

- `data-voice-state` distinto de `silencio` con `data-interaction-state="pausa"`.
  Pausar Sabik detiene la voz primero.
- `data-protection-state="riesgo"` con `data-interaction-state="buscando"`.
  En riesgo no se busca: se acompaña y se ofrece recurso humano.
- `.is-collapsed` con `data-voice-state="hablando"`. Plegar detiene la voz y
  deja el estado en `finalizada`.
- `data-low-intensity="true"` no altera nunca el texto de la respuesta, solo su
  presentación y la intensidad visual.

---

## Mapa con S0

Contrato de entrada. `deriveSabikPresentation(state)` es una función **pura**:
recibe el estado canónico de la máquina y devuelve la proyección. No decide
transiciones, no escribe en la sesión y no tiene efectos secundarios. Es el
único sitio donde ocurre la proyección.

```
S0 (contrato congelado)
→ deriveSabikPresentation(state)
→ atributos visuales y accesibles
```

### Los cinco ejes de S0

| Eje S0 | Valores congelados |
|---|---|
| `operation` | `booting` · `ready` · `retrieving` · `composing` · `presenting` · `awaiting_clarification` · `paused` · `error` |
| `dialogue` | `none` · `information` · `practical` · `clarification` · `accompaniment` · `correction` · `insufficient` · `human_handoff` |
| `safety` | `normal` · `uncertain` · `risk` · `human_handoff` |
| `speech` | `silent` · `starting` · `speaking` · `paused` · `ended` · `error` |
| `motion` | `off` · `ambient` · `processing` · `voice_reactive` · `protection_static` |

`speech` proyecta uno a uno sobre `data-voice-state`:

```
silent → silencio     starting → iniciando     speaking → hablando
paused → pausada      ended → finalizada       error → error
```

`motion` es **intención declarada por S0**, no algo que la proyección invente.
La preferencia global solo la recorta:

| `motion` de S0 | Proyección | Con movimiento reducido |
|---|---|---|
| `off` | `paused` | `paused` |
| `ambient` | `96s` running | `paused` |
| `processing` | `30s` en `retrieving`, `44s` en `composing` | `paused` |
| `voice_reactive` | aros en `ambient` · **las ondas responden a la locución** | aros `paused` · ondas estáticas · la voz sigue |
| `protection_static` | `300s` paused | `300s` paused |

`voice_reactive` no acelera los aros: si lo hiciera, habría dos señales
compitiendo por decir lo mismo. Mueve las ondas, y solo las ondas.

### Atributos

Catorce combinaciones representativas. **No son estados nuevos**: son ternas de
`operation` / `dialogue` / `safety` que conviene tener dibujadas.

| `operation` | `dialogue` | `safety` | `interaction` | `protection` | `low-intensity` |
|---|---|---|---|---|---|
| `booting` | `none` | `normal` | `arrancando` | `normal` | heredado |
| `ready` | `none` | `normal` | `espera` | `normal` | heredado |
| `retrieving` | `information` \| `practical` | `normal` | `buscando` | `normal` | heredado |
| `composing` | `information` \| `practical` | `normal` | `componiendo` | `normal` | heredado |
| `presenting` | `information` | `normal` | `respuesta` | `normal` | heredado |
| `presenting` | `practical` | `normal` | `respuesta` | `normal` | heredado |
| `presenting` | `insufficient` | `normal` | `respuesta` | `normal` | heredado |
| `awaiting_clarification` | `clarification` | `normal` | `aclaracion` | `normal` | heredado |
| `presenting` | `correction` | `normal` | `correccion` | `normal` | heredado |
| `awaiting_clarification` | `clarification` | `uncertain` | `aclaracion` | `incierto` | **heredado** |
| `presenting` | `accompaniment` | `risk` | `respuesta` | `riesgo` | **heredado** |
| `presenting` | `human_handoff` | `human_handoff` | `derivacion` | `riesgo` | **heredado** |
| `paused` | cualquiera | heredado | `pausa` | heredado | heredado |
| `error` | cualquiera | heredado | `error` | heredado | heredado |

«heredado» = viene de la preferencia de sesión, no del estado.

### La protección no anula la baja intensidad

`low_intensity` es **heredado en todas las filas, protección incluida.** El modo
de protección decide contenido y prioridad; no revoca una preferencia de
reducción de estímulo que la persona ha pedido, y menos en el momento en que más
le puede hacer falta.

Con `low_intensity = true` bajo `risk` o `human_handoff`:

| Baja | Intacto |
|---|---|
| Brillo del holograma (`.74`) | Texto de la respuesta, palabra por palabra |
| Opacidad de los aros (`.35`) | Bloque de recurso humano y sus enlaces |
| Puntos (`0`) | Todos los controles visibles y habilitados |
| Degradados del panel, a plano | Contraste: los mínimos de `RESPONSIVE-A11Y.md` se cumplen igual |

La intensidad visual baja. La información, no.

### Texto, anuncio, controles y movimiento

| Estado canónico S0 | Texto visible | Anuncio accesible | Controles activos | `motion` de S0 |
|---|---|---|---|---|
| `booting` | «Preparando» | uno, `polite` | Ocultar | `ambient` |
| `ready` | «Disponible» | solo al volver | todos | `ambient` |
| `retrieving` | «Buscando» | uno, `polite`, sin repetir | Ocultar, Pausar Sabik | `processing` |
| `composing` | «Preparando respuesta» | **ninguno** | Ocultar, Pausar Sabik | `processing` |
| `presenting` · `information` | «Respuesta lista» | primer párrafo, `polite` | todos + respuesta | `ambient` |
| `presenting` · `practical` | «Respuesta lista» | primer párrafo, `polite` | todos + respuesta | `ambient` |
| `presenting` · `insufficient` | «Respuesta lista» | primer párrafo, `polite` | todos + respuesta | `ambient` |
| `awaiting_clarification` | «Necesito una aclaración» | la pregunta, `polite` | opciones, Evitar preguntas | `ambient` |
| `presenting` · `correction` | «Espero una corrección» | confirmación, `polite` | campo, Enviar | `ambient` |
| `awaiting_clarification` · `uncertain` | «Prefiero preguntar» | la pregunta, `polite` | pregunta, recurso, campo, Bajar intensidad | `protection_static` |
| `presenting` · `accompaniment` · `risk` | «Aquí te acompaño» | acompañamiento, `polite` | recurso, campo, Bajar intensidad | `protection_static` |
| `presenting` · `human_handoff` | «Aquí te acompaño» | bloque de recurso, `polite` | recurso, Ocultar, Bajar intensidad | `protection_static` |
| `paused` | «En pausa» | «Sabik está en pausa», `polite` | Reanudar, Empezar de nuevo | `off` |
| `error` | «No he podido» | aviso, `polite`, **nunca `assertive`** | Reintentar, Empezar de nuevo | `off` |

Con `speech` en `speaking`, la fila activa pasa a `voice_reactive` y el texto
visible lo sustituye «Leyendo en voz alta». Los aros no cambian de velocidad.

### Lo que NO multiplica la tabla

Estos tres no son filas y no añaden estados a la máquina:

| | Proyección |
|---|---|
| `speech` | Eje propio de seis valores. Multiplica sobre cualquier fila salvo `paused`, `error` y `booting`, donde se fuerza `silent`. |
| Panel | `.is-collapsed` y `[hidden]` son de contenedor. Plegar fuerza `silent`. |
| `low_intensity` | Modificador de sesión. Cambia intensidad visual, nunca el texto, el recurso ni los controles. Sobrevive a la protección. |

Catorce filas × seis valores de `speech` × tres de panel **no** son 252 ramas:
son tres proyecciones independientes que se componen. Ese es el motivo de
separar los ejes.

---

## Tokens de tiempo

| Token | Valor | Uso |
|---|---|---|
| `--t-inmediata` | `120ms` | Caídas de energía por error. |
| `--t-corta` | `180ms` | Entrada de ondas, cambio de etiqueta. |
| `--t-media` | `320ms` | Aparición y plegado de bloques. |
| `--t-opacidad` | `520ms` | Opacidad y `filter` del holograma. Ya en uso. |
| `--t-transform` | `620ms` | `transform` del holograma. Ya en uso. |
| `--e-entrada` | `cubic-bezier(.2,.7,.3,1)` | Todo lo que aparece o sube. |
| `--e-salida` | `cubic-bezier(.4,0,.6,1)` | Todo lo que desaparece o baja. |

Velocidad de precesión de los aros por estado (`--sabik-layer-speed`), medida a
72 px de holograma:

| `data-interaction-state` | Velocidad | Nota |
|---|---|---|
| `arrancando` | `96s` | Igual que reposo. Arrancar no es trabajar. |
| `espera` | `96s` | Reposo. Perceptible sin llamar. |
| `buscando` | `30s` | Ya en uso para `procesando`. |
| `componiendo` | `44s` | Entre buscar y reposar. |
| `respuesta` | `96s` | Vuelve a reposo: el trabajo terminó. |
| `aclaracion` | `110s` | Reverso, como `correccion`. |
| `correccion` | `110s` | Reverso. Ya en uso. |
| `pausa` | `300s` + `paused` | Ya en uso. |
| `error` | `300s` + `paused` | Quieto, sin dramatizar. |
| `derivacion` | `300s` + `paused` | Quieto: la atención va al recurso humano. |

---

## Los veinte estados

Cada bloque da los doce campos del encargo. «Controles» remite a los nombres de
`CONTROL-STATES.md`.

---

### 1 · Arrancando

- **Apariencia** — Panel completo, holograma 72 px al 90 % de opacidad. Punto de
  presencia `data-state="base"` con anillo sin relleno.
- **Texto de estado** — `#sabik-state-label`: «Preparando». `#sabik-status-text`:
  «Un momento, estoy cargando lo que necesito.»
- **Controles visibles** — Ocultar, campo, Enviar.
- **Controles habilitados** — Ocultar. **Enviar deshabilitado**; el campo acepta
  escritura y conserva el texto al terminar la carga.
- **Movimiento** — `arrancando`, `96s`, `running`.
- **Voz** — `silencio`. Ondas ausentes del DOM.
- **Foco** — No se mueve. Nunca robar foco al cargar.
- **Anuncio accesible** — `#sabik-status-text` es `role="status"` `aria-live="polite"`
  `aria-atomic="true"`. Un solo anuncio.
- **Entrada** — Sin transición: es el primer pintado.
- **Salida** — A «Listo»: opacidad del holograma .90 → .98 en `--t-opacidad`.
- **Duración** — Indeterminada. Si pasa de **8 s**, ir a «Error técnico» con el
  mensaje de Core no disponible.
- **Movimiento reducido** — `paused`. El texto ya comunica la carga.

---

### 2 · Listo

- **Apariencia** — Estado de referencia. Holograma `.98`,
  `drop-shadow(0 18px 34px rgba(92,91,190,.18))`. Punto de presencia `#5a49a8`.
- **Texto de estado** — «Disponible» / «Estoy aquí si quieres ayuda.»
- **Controles visibles** — Ocultar, campo, Enviar, Escuchar, Bajar intensidad,
  Más corto, Una opción, Evitar preguntas, Pausar Sabik.
- **Controles habilitados** — Todos. Empezar de nuevo deshabilitado mientras no
  haya nada que borrar.
- **Movimiento** — `espera`, `96s`, `running`.
- **Voz** — `silencio`.
- **Foco** — Donde lo dejó la persona.
- **Anuncio accesible** — Solo al volver de otro estado, no al cargar.
- **Entrada** — `--t-opacidad`.
- **Salida** — Según destino.
- **Duración** — Indefinida.
- **Movimiento reducido** — `paused`. Ningún cambio de texto ni de color.

---

### 3 · Buscando

- **Apariencia** — Holograma opacidad `1`, `brightness(1.05) saturate(1.08)`,
  sombra a `rgba(92,91,190,.26)`. Punto de presencia sin cambio de color: la
  señal es la velocidad y el texto.
- **Texto de estado** — «Buscando» / «Sabik está buscando en Iris Green.»
- **Controles visibles** — Todos los de «Listo».
- **Controles habilitados** — Enviar **deshabilitado** con `cursor: wait`.
  Pausar Sabik y Ocultar habilitados. Escuchar deshabilitado: no hay texto.
- **Movimiento** — `buscando`, `30s`, `running`.
- **Voz** — `silencio`.
- **Foco** — Permanece en Enviar. No se mueve al aparecer la respuesta.
- **Anuncio accesible** — Un anuncio `polite` al entrar. **No repetir** mientras
  dura: nada de progreso hablado en bucle.
- **Entrada** — `--t-opacidad` para `filter` y opacidad; la velocidad de los
  aros cambia sin transición (es `animation-duration`, no interpolable).
- **Salida** — `--t-opacidad`.
- **Duración** — Si pasa de **12 s**, «Error técnico».
- **Movimiento reducido** — `paused`. El texto «Buscando» es la única señal, y
  basta.

---

### 4 · Componiendo

- **Apariencia** — Como «Buscando» con `brightness(1.03)`. No aparece ningún
  bloque de respuesta todavía: nada de texto escribiéndose letra a letra.
- **Texto de estado** — «Preparando respuesta» / «Estoy ordenando lo que he
  encontrado.»
- **Controles visibles** — Como «Buscando».
- **Controles habilitados** — Como «Buscando».
- **Movimiento** — `componiendo`, `44s`, `running`.
- **Voz** — `silencio`.
- **Foco** — Sin cambios.
- **Anuncio accesible** — **Ninguno.** Si «Buscando» y «Componiendo» anuncian
  por separado, el lector de pantalla interrumpe dos veces en dos segundos.
  Solo cambia el texto visible.
- **Entrada** — `--t-opacidad`.
- **Salida** — `--t-opacidad`.
- **Duración** — Típica < 400 ms. Si el tramo es menor de **250 ms**, **omitir
  el estado**: un parpadeo de texto es peor que no tenerlo.
- **Movimiento reducido** — `paused`.

---

### 5 · Respuesta preparada

- **Apariencia** — `#sabik-output` visible con borde superior
  `1px solid var(--sabik-border)`. Holograma de vuelta a reposo.
- **Texto de estado** — «Respuesta lista» / «Sabik ha preparado una respuesta.»
- **Controles visibles** — Los de «Listo» más Escuchar, No es esto, Buscar por
  otra vía.
- **Controles habilitados** — Todos. Empezar de nuevo ya habilitado.
- **Movimiento** — `respuesta`, `96s`, `running`.
- **Voz** — `silencio` hasta que la persona pulse Escuchar. **Nunca autoplay.**
- **Foco** — No se mueve. `#sabik-answer` recibe `tabindex="-1"`; el foco se
  lleva allí **solo** si la persona llegó pulsando Enviar con el teclado.
- **Anuncio accesible** — `#sabik-output` es `aria-live="polite"`. Se anuncia el
  primer párrafo, no la lista de fuentes.
- **Entrada** — `opacity 0→1` y `translateY(4px)→0` en `--t-media` con
  `--e-entrada`.
- **Salida** — `opacity 1→0` en `--t-corta` con `--e-salida`.
- **Duración** — Indefinida.
- **Movimiento reducido** — Sin `translateY`: solo opacidad, `--t-corta`.

---

### 6 · Esperando aclaración

- **Apariencia** — Panel normal. La pregunta discriminante va en
  `#sabik-answer`; las opciones, como botones en `#sabik-response-actions`.
- **Texto de estado** — «Necesito una aclaración» / «Para seguir necesito que me
  concretes una cosa.»
- **Controles visibles** — Campo, Enviar, las opciones de la pregunta, Evitar
  preguntas, Ocultar.
- **Controles habilitados** — Todos. **Evitar preguntas** sigue disponible aquí:
  es el modo de salir de una cadena de preguntas.
- **Movimiento** — `aclaracion`, `110s`, `reverse`, `running`.
- **Voz** — `silencio`.
- **Foco** — A la primera opción, **solo** si la persona venía del teclado.
- **Anuncio accesible** — La pregunta, `polite`.
- **Entrada** — Como «Respuesta preparada».
- **Salida** — `--t-corta`.
- **Duración** — Indefinida. Máximo **dos** preguntas seguidas; a la tercera se
  entrega lo que haya con lo que se sabe.
- **Movimiento reducido** — Sin `translateY`.

---

### 7 · Sabik pausado

- **Apariencia** — Holograma opacidad `.72`, `saturate(.72) brightness(.98)`,
  aros detenidos. El texto de la respuesta **se conserva en pantalla**.
- **Texto de estado** — «En pausa» / «Sabik está en pausa. Lo que hay en
  pantalla se queda.»
- **Controles visibles** — Reanudar (en el sitio de Pausar Sabik), Empezar de
  nuevo, Ocultar, Mostrar respuesta si estaba abierta.
- **Controles habilitados** — Reanudar, Empezar de nuevo, Ocultar. Campo, Enviar
  y Escuchar **deshabilitados**.
- **Movimiento** — `pausa`, `300s`, `paused`.
- **Voz** — `silencio`. Pausar Sabik **detiene** la voz, no la aparca.
- **Foco** — Se queda en Reanudar, que ocupa el sitio del botón pulsado.
- **Anuncio accesible** — «Sabik está en pausa», `polite`.
- **Entrada** — `--t-opacidad` para opacidad y `filter`; los aros paran sin
  transición.
- **Salida** — `--t-opacidad`.
- **Duración** — Indefinida, hasta Reanudar.
- **Movimiento reducido** — Ya está quieto. Idéntico.

---

### 8 · Error técnico

- **Apariencia** — `#sabik-answer.is-warning`, color `var(--sabik-warn)`
  `#775400`. Holograma quieto al `.76`. Sin rojo, sin icono de alarma.
- **Texto de estado** — «No he podido» / «No he podido cargar lo que necesito.»
  El detalle técnico va en `#sabik-notice`, no en el estado.
- **Controles visibles** — Reintentar, Empezar de nuevo, Ocultar, y la búsqueda
  manual del sitio, que no depende de Sabik.
- **Controles habilitados** — Reintentar, Empezar de nuevo, Ocultar.
- **Movimiento** — `error`, `300s`, `paused`.
- **Voz** — `silencio`.
- **Foco** — A `#sabik-answer`. Aquí sí: la persona necesita saber que falló.
- **Anuncio accesible** — `role="status"` `polite`. **No `assertive`**: un fallo
  de carga no justifica interrumpir.
- **Entrada** — Opacidad en `--t-corta`. Sin desplazamiento.
- **Salida** — `--t-corta`.
- **Duración** — Indefinida.
- **Movimiento reducido** — Idéntico.

---

### 9 · Riesgo incierto

- **Apariencia** — `data-protection-state="incierto"`. Aros al `.5`, puntos al
  `.2`, `paused`. Punto de presencia con **cambio de forma**: anillo de 2 px con
  punto interior (`box-shadow: inset 0 0 0 2px #fff`), no solo otro color. El
  recurso humano ya visible, encima de la respuesta.
- **Texto de estado** — «Prefiero preguntar» / «No estoy seguro de haber
  entendido. Prefiero preguntarte antes de responder.»
- **Controles visibles** — La pregunta, el recurso humano, campo, Ocultar,
  **Bajar intensidad**. **Se retiran** Más corto y Una opción: aquí no se ajusta
  el formato de la respuesta. Bajar intensidad no es formato, es estímulo, y esa
  preferencia se respeta también aquí.
- **Controles habilitados** — Los visibles.
- **Movimiento** — `300s`, `paused`. Ningún pulso, ninguna urgencia.
- **Voz** — `silencio`. Escuchar sigue disponible para el texto de acompañamiento.
- **Foco** — No se mueve.
- **Anuncio accesible** — La pregunta, `polite`.
- **Entrada** — Opacidad en `--t-media`. Nada que entre rápido.
- **Salida** — `--t-media`.
- **Duración** — Indefinida.
- **Movimiento reducido** — Idéntico: ya está quieto por diseño.

---

### 10 · Derivación humana

- **Apariencia** — El bloque de recurso humano es el primer elemento de
  `#sabik-output`, con borde `1px solid var(--sabik-danger)` **como borde, nunca
  como relleno** y nunca animado. Holograma quieto al `.76`.
- **Texto de estado** — «Aquí te acompaño» / «Esto se atiende mejor con una
  persona. Te dejo dónde.»
- **Controles visibles** — Recurso humano, Ocultar, campo, **Bajar intensidad**.
  Se retiran los ajustes de formato y **No es esto** y **Buscar por otra vía**:
  no se pide reformular esto.
- **Controles habilitados** — Los visibles.
- **Movimiento** — `derivacion`, `300s`, `paused`.
- **Voz** — Disponible. Si está activa, sigue: cortarla aquí sería peor.
- **Foco** — Al primer enlace o teléfono del recurso.
- **Anuncio accesible** — El bloque de recurso, `polite`.
- **Entrada** — Opacidad en `--t-media`. Sin escala, sin desplazamiento.
- **Salida** — Solo por Empezar de nuevo.
- **Duración** — Indefinida.
- **Movimiento reducido** — Idéntico.

---

### 11 · Plegado

- **Apariencia** — Solo la cabecera: holograma 44 px, nombre, insignia IA,
  estado. `.sabik-subtitle` y `.sabik-widget-body` ocultos. La columna pasa a
  `minmax(180px,220px)`.
- **Texto de estado** — `#sabik-state-label`: «Oculto». El botón dice «Mostrar»,
  `aria-expanded="false"`.
- **Controles visibles** — Solo Mostrar.
- **Controles habilitados** — Mostrar.
- **Movimiento** — `paused`, `300s`. Plegado no es sitio para movimiento.
- **Voz** — `silencio` forzado. Plegar **detiene** la locución y deja
  `finalizada`.
- **Foco** — Se queda en el botón, que no se mueve de sitio.
- **Anuncio accesible** — `aria-expanded` lo dice. **Sin anuncio de texto
  adicional**: sería redundante.
- **Entrada** — `--t-media` para la altura; el holograma 72→44 px con
  `--t-transform`.
- **Salida** — Inversa, `--t-media`.
- **Duración** — Persiste en la sesión, no entre sesiones.
- **Movimiento reducido** — Sin transición de altura: cambio directo.

---

### 12 · Oculto

- **Apariencia** — `.sabik-panel[hidden]`. La columna desaparece; el contenido
  pasa a una sola columna a ancho completo.
- **Texto de estado** — Ninguno en el panel. Un botón «Mostrar Sabik» queda al
  final del bloque de búsqueda, no flotando.
- **Controles visibles** — Mostrar Sabik.
- **Controles habilitados** — Ese.
- **Movimiento** — Ninguno: no hay nodo animado.
- **Voz** — `silencio`, detenida.
- **Foco** — Al botón Mostrar Sabik, que sustituye al que se pulsó.
- **Anuncio accesible** — «Sabik oculto», `polite`, una vez.
- **Entrada** — `--t-media` de opacidad, luego `hidden`.
- **Salida** — `hidden` fuera, luego opacidad.
- **Duración** — Persiste en la sesión.
- **Movimiento reducido** — Sin transición.

---

### 13 · Voz iniciando

- **Apariencia** — `#sabik-voice` presente, cinco barras a **geometría de
  reposo**: 6 px de alto, opacidad `.38`.
- **Texto de estado** — «Iniciando voz».
- **Controles visibles** — Los tres de voz, siempre presentes: Escuchar
  **deshabilitado, con su etiqueta intacta**, Pausar voz **deshabilitado**,
  Detener voz.
- **Controles habilitados** — Detener voz.
- **Movimiento** — El del estado de interacción, sin cambios.
- **Voz** — `data-voice-state="iniciando"`. **Energía 0.** Las ondas no se mueven
  hasta el evento `start` real. Pulsar Escuchar no mueve nada.
- **Foco** — Se queda en Escuchar, que sigue existiendo con el mismo nombre
  aunque quede deshabilitado. Si el navegador suelta el foco de un botón
  deshabilitado, pasa a Detener voz, que es el control vivo de esa fila.
- **Anuncio accesible** — Ninguno: el texto de estado «Iniciando voz» ya informa
  por `aria-live` del panel.
- **Entrada** — Aparición de las barras: opacidad `0→.38` en `--t-corta`.
- **Salida** — A «Hablando» en cuanto llega `start`.
- **Duración** — Si `start` no llega en **1500 ms**, ir a «Error de voz».
- **Movimiento reducido** — Barras estáticas visibles al `.38`. Idéntico, porque
  en este estado no hay movimiento que reducir.

---

### 14 · Hablando

- **Apariencia** — Cinco barras respondiendo a la locución. Ver
  `VOICE-WAVE-SPEC.md` para amplitud, cadencia y curvas.
- **Texto de estado** — «Leyendo en voz alta».
- **Controles visibles** — Los tres de voz. Escuchar queda deshabilitado en su
  sitio, **sin cambiar de etiqueta**.
- **Controles habilitados** — Pausar voz, Detener voz.
- **Movimiento** — El del estado de interacción **sin acelerar**. Hablar no
  cambia la precesión de los aros: si lo hiciera, habría dos señales compitiendo.
- **Voz** — `hablando`. Energía por impulso, reposo entre impulsos.
- **Foco** — Sin cambios.
- **Anuncio accesible** — **Ninguno.** Sabik ya está hablando; anunciarlo por
  `aria-live` lo solaparía con la síntesis.
- **Entrada** — Rampa de energía `0 → activo` en `180ms`, `--e-entrada`.
- **Salida** — Según destino: pausada `160ms`, finalizada `240ms`, error `120ms`.
- **Duración** — La de la locución.
- **Movimiento reducido** — **La voz sigue.** Barras estáticas al `.38`; el
  estado se comunica por el texto «Leyendo en voz alta» y por las etiquetas de
  los botones. No se pierde información.

---

### 15 · Voz pausada

- **Apariencia** — Barras a reposo, opacidad `.38`, quietas.
- **Texto de estado** — «Voz en pausa».
- **Controles visibles** — Los tres de voz. Pausar voz dice «Reanudar voz».
- **Controles habilitados** — Reanudar voz, Detener voz.
- **Movimiento** — Sin cambios.
- **Voz** — `pausada`. **Energía 0 exacta**, no una animación lenta.
- **Foco** — En el botón, que cambia de etiqueta sin moverse.
- **Anuncio accesible** — Ninguno: la etiqueta informa.
- **Entrada** — Energía `activo → 0` en `160ms`, `--e-salida`.
- **Salida** — Reanudar: `0 → activo` en `180ms`, `--e-entrada`.
- **Duración** — Indefinida.
- **Movimiento reducido** — Idéntico.

---

### 16 · Voz finalizada

- **Apariencia** — Barras a reposo y luego fuera del DOM tras `600ms`, para que
  no quede un elemento vacío ocupando sitio.
- **Texto de estado** — Vuelve al del estado de interacción.
- **Controles visibles** — Los tres de voz. Escuchar vuelve a estar habilitado;
  Pausar voz y Detener voz quedan deshabilitados.
- **Controles habilitados** — Escuchar.
- **Movimiento** — Sin cambios.
- **Voz** — `finalizada` → `silencio`.
- **Foco** — Se queda donde estaba. Escuchar, que no se ha movido ni renombrado
  en ningún momento, vuelve a estar habilitado.
- **Anuncio accesible** — Ninguno.
- **Entrada** — Energía `→ 0` en `240ms`, `--e-salida`, luego opacidad `.38→0`
  en `--t-corta`.
- **Salida** — Retirada del nodo a los `600ms`.
- **Duración** — `600ms` en total.
- **Movimiento reducido** — Sin desvanecido: retirada directa.

---

### 17 · Error de voz

- **Apariencia** — Barras a `0` de inmediato y fuera. `#sabik-notice`: «No he
  podido leerlo en voz alta. El texto sigue completo aquí.»
- **Texto de estado** — «La voz no está disponible».
- **Controles visibles** — Escuchar, deshabilitado el resto de la sesión si el
  fallo es de soporte; habilitado si fue puntual.
- **Controles habilitados** — Según lo anterior.
- **Movimiento** — Sin cambios.
- **Voz** — `error`.
- **Foco** — No se mueve. Un fallo de voz no justifica saltar el foco.
- **Anuncio accesible** — El aviso, `polite`. Nunca `assertive`.
- **Entrada** — Energía `→ 0` en `120ms`, **sin rebote y sin dramatizar**.
- **Salida** — Retirada inmediata del nodo.
- **Duración** — `120ms`.
- **Movimiento reducido** — Idéntico.

---

### 18 · Baja intensidad

- **Apariencia** — `data-low-intensity="true"` y `body.sabik-low-stim`. Aros al
  `.35`, puntos a `0`, `brightness(.94)`, holograma sin `drop-shadow`, opacidad
  `.82`. Fondos de degradado del panel a plano `#fff`.
- **Texto de estado** — «Baja intensidad» / «Baja intensidad activada.»
- **Controles visibles** — Todos, con **Intensidad normal** en el sitio de Bajar
  intensidad. **Sigue disponible bajo protección**: ver
  § La protección no anula la baja intensidad.
- **Controles habilitados** — Todos.
- **Movimiento** — `paused`, `300s`.
- **Voz** — Disponible sin cambios. Barras al `.30` de opacidad máxima y
  amplitud máxima reducida a `2.2` (ver `VOICE-WAVE-SPEC.md`).
- **Foco** — Sin cambios.
- **Anuncio accesible** — «Baja intensidad activada», `polite`, una vez.
- **Entrada** — `--t-opacidad`.
- **Salida** — `--t-opacidad`.
- **Duración** — Persiste en la sesión.
- **Movimiento reducido** — Ya incluye parada. Se acumulan sin conflicto.

---

### 19 · Movimiento reducido

Dos orígenes, mismo resultado visual, y **el manual gana siempre**.

**No se crea una segunda fuente de verdad.** Iris Green ya mantiene el
movimiento globalmente, y un atributo propio de Sabik se desincronizaría del
panel Lectura. El valor se deriva:

```js
effectiveReducedMotion =
  manualReadingPreference ||   // html[data-ig-motion="off"]
  systemReducedMotion;         // html[data-ig-system-motion="reduce"]
```

Y se proyecta con los selectores que ya existen:

```css
html[data-ig-motion="off"]              { /* preferencia manual */ }
html[data-ig-system-motion="reduce"]    { /* preferencia del dispositivo */ }
@media (prefers-reduced-motion: reduce) { /* respaldo sin JS */ }
```

El `data-motion` que aparece en el prototipo es **pseudocódigo del banco** para
poder conmutar sin tocar las preferencias del sitio. No va al runtime.

- **Apariencia** — Sin cambio de color, de tamaño ni de contenido respecto al
  estado equivalente en movimiento normal.
- **Texto de estado** — El del estado activo, **sin añadidos**. Reducir
  movimiento no es un estado que anunciar.
- **Controles visibles / habilitados** — Idénticos. Nada se retira.
- **Movimiento** — `--sabik-layer-motion: paused` en todos los estados.
  `animation: none !important` dentro de `.sabik-panel`, ya presente.
- **Voz** — **Disponible y completa.** Las ondas quedan estáticas a reposo.
- **Foco** — Idéntico.
- **Anuncio accesible** — Aquí está la compensación: los estados que perdían su
  señal de movimiento (`buscando`, `componiendo`) la recuperan íntegra en
  `#sabik-status-text`. Ningún estado queda distinguible solo por color.
- **Entrada / salida / duración** — `0ms`. Cambio directo.
- **Movimiento reducido** — N/A.

---

### 20 · Holograma

Identidad, no estado. Se conserva sin excepción:

- Iris `#5a49a8`, violeta, lavanda `#eee9ff`, periwinkle `#dfe8ff`.
- Azul como **luz secundaria**: `#8cbbfc`, `#669bfc`, `#54b1fc` en los degradados
  de aros y puntos. Nunca como color dominante.
- Centro blanco o muy claro: `radial-gradient(circle at 50% 51%, rgba(255,255,255,.95) 0 1.8%, …)`.
- Carácter abstracto y no humano: esfera, aros y puntos. **Sin cara, sin ojos,
  sin boca, sin gesto.**

Reglas duras:

- `data-cognitive-state` **no representa a la persona**. No hay diagnóstico, no
  hay emoción inferida, no hay estado psicológico atribuido. Es la variación de
  presencia de un objeto abstracto.
- Ningún estado usa rojo pulsante ni movimiento urgente. `--sabik-danger`
  `#8f1d1d` existe solo como borde de 1 px y como color de texto.
- Ningún estado se distingue **solo** por color: siempre acompaña texto en
  `#sabik-state-label`, y el punto de presencia cambia de forma además de tono.
- Tamaños: 72 px en cabecera desplegada, 44 px plegada, 56 px por debajo de
  360 px de ancho.
- La respiración en bucle (`sabikImageBreath`) queda **retirada**: era animación
  decorativa. El reposo de los aros a `96s` es el único movimiento en espera.
