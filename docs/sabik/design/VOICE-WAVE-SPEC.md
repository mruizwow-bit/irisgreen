# VOICE-WAVE-SPEC

**NO PUBLICAR · NO RUNTIME · REFERENCIA DE IMPLEMENTACIÓN**
Rama `sabik/design-states-voice` · issue #148 · PR draft #163

---

## Regla principal

> **Cuando Sabik calla, las ondas de voz están quietas.
> Cuando Sabik habla, las ondas responden a la locución.**

Obligatoria y sin excepción. Tres consecuencias que hay que implementar
literalmente:

1. **Energía 0 es `animation: none`**, no `animation-play-state: paused` ni una
   animación lenta. Una barra que respira en silencio convierte la señal en
   decoración ambiental y deja de informar de nada.
2. **Las ondas no arrancan al pulsar el botón.** Arrancan con el evento `start`
   de la locución. Entre pulsar Escuchar y el primer sonido hay un hueco real
   (50–900 ms según navegador) y llenarlo con movimiento es mentir.
3. **La animación de voz no puede ser ambiental.** No existe un estado
   «hablando en general»: existe impulso e existe reposo, y el reposo es 0.

### Energía cero también detiene el JavaScript

`animation: none` basta si la onda es CSS. Si la conduce JS —y la conduce—, al
llegar a cero el controlador también debe:

- cancelar o dormir el `requestAnimationFrame`;
- vaciar la lista de impulsos pendientes;
- cancelar los temporizadores del fallback;
- dejar de escribir `transform` y `opacity`;
- despertar solo cuando vuelva a haber voz o una rampa pendiente.

Un bucle que sigue corriendo en silencio no se ve, pero gasta batería y deja la
puerta abierta a que un impulso huérfano mueva una barra sobre un silencio.

> El prototipo del banco mantiene el `requestAnimationFrame` permanente para
> poder leer la energía en vivo. Es admisible en un banco no público y **no debe
> copiarse al runtime.**

---

## Geometría

| Propiedad | Valor |
|---|---|
| Número máximo de ondas | **5** |
| Ancho de barra | `3px` |
| Separación | `4px` |
| Ancho total | `31px` |
| Radio | `999px` |
| Alto en reposo | `6px` |
| Alto máximo | `22px` |
| `transform-origin` | `center` |
| Alineación | `align-items: center`, crecen en ambos sentidos |
| Color | `var(--sabik-iris)` `#5a49a8` |
| Posición | En `.sabik-state`, tras `#sabik-state-label`, altura de caja fija `22px` para que la aparición no mueva nada |

La caja reserva sus `22px` siempre. Si el bloque de ondas empuja el texto al
aparecer, el panel entero salta en cada locución.

### Escala

Se anima `scaleY`, no `height`: `height` fuerza *layout* en cada fotograma.

| Token | Valor | Alto resultante |
|---|---|---|
| `--sabik-wave-scale-min` | `1` | `6px` — reposo |
| `--sabik-wave-scale-max` | `3.6` | `21.6px` |
| `--sabik-wave-scale-max` en baja intensidad | `2.2` | `13.2px` |

### Opacidad

| Estado | Opacidad |
|---|---|
| Reposo visible (`iniciando`, `pausada`) | `.38` |
| Impulso (`hablando`) | `.92` |
| Entre impulsos (`hablando`) | `.52` |
| Baja intensidad, máximo | `.30` |
| `finalizada`, `error` | `0` tras la caída |

---

## Energía

`E(t) ∈ [0,1]`. Una sola variable. `E = 0` es silencio absoluto: sin animación
declarada, `scaleY(1)`, opacidad `.38`.

| Momento | E | Duración | Curva |
|---|---|---|---|
| Silencio | `0` | — | ninguna |
| Inicio de voz | `0 → .55` | `180ms` | `--e-entrada` `cubic-bezier(.2,.7,.3,1)` |
| Impulso de palabra o frase | `.55 → 1 → .55` | `90ms` ataque + `260ms` caída | ataque `--e-entrada`, caída `--e-salida` |
| Pausa | `→ 0` | `160ms` | `--e-salida` `cubic-bezier(.4,0,.6,1)` |
| Reanudación | `0 → .55` | `180ms` | `--e-entrada` |
| Final | `→ 0` | `240ms` | `--e-salida` |
| Error | `→ 0` | `120ms` | `linear`, **sin rebote** |

`.55` es el suelo activo: hablando pero entre palabras. No es `0`, porque
durante la locución hay sonido continuo; y no es `1`, porque entonces el
impulso no se distinguiría.

### Impulso por barra

Las cinco barras no se mueven al unísono: un bloque que sube entero parece un
solo objeto, no una onda. Retardo por índice, con la central al frente:

| Barra | Retardo | Factor de amplitud |
|---|---|---|
| 1 | `40ms` | `.62` |
| 2 | `20ms` | `.84` |
| 3 | `0ms` | `1.00` |
| 4 | `20ms` | `.88` |
| 5 | `40ms` | `.66` |

Los factores no son simétricos a propósito: la simetría exacta se lee como un
gráfico, no como voz.

### Frecuencia

| Concepto | Valor |
|---|---|
| Cadencia máxima admitida | `1 impulso / 200ms` (5 Hz). Por encima, se descartan impulsos. |
| Cadencia del fallback | `1 impulso / 420ms` (≈2,4 Hz) |
| Cadencia mínima antes de caer a reposo | Sin impulso en `700ms` → `E → .55`, no a `0`: sigue hablando |

---

## Condiciones de inicio y de parada

Todas atadas a eventos reales de `SpeechSynthesisUtterance`. Ninguna al clic.

### Inicio

| Disparador | Acción |
|---|---|
| Clic en Escuchar | `data-voice-state="iniciando"`. **E = 0.** Barras a reposo visible. |
| `utterance.onstart` | `data-voice-state="hablando"`. Rampa `0 → .55` en `180ms`. |
| `utterance.onresume` | `hablando`. Rampa `0 → .55` en `180ms`. |
| `utterance.onboundary` con `name === "word"` | Un impulso. |

### Parada

| Disparador | Acción |
|---|---|
| `utterance.onpause` | `pausada`. `E → 0` en `160ms`. |
| `utterance.onend` | `finalizada`. `E → 0` en `240ms`, nodo fuera a los `600ms`. |
| `utterance.onerror` | `error`. `E → 0` en `120ms`, nodo fuera de inmediato. |
| Clic en Detener voz | `speechSynthesis.cancel()` y **caída inmediata**, sin esperar a `onend`. |
| Clic en Pausar Sabik | `cancel()` y `E → 0` en `120ms`. |
| Clic en Ocultar / plegar | `cancel()` y `E → 0` en `120ms`. |
| `pagehide` o navegación real | `cancel()` sin transición. |
| Guardián: `speechSynthesis.speaking === false` con `data-voice-state="hablando"` | Forzar `E = 0` y `finalizada`. **Comprobar cada 250 ms.** |
| `onstart` no llega en `1500ms` | «Error de voz». |

**`visibilitychange` no cancela.** Cambiar de pestaña o de aplicación no es
abandonar la página, y cortar ahí una lectura que la persona ha pedido es
perder su sitio en el texto. Si el navegador interrumpe la síntesis por su
cuenta al quedar oculta, **el guardián corrige el estado visual**; Sabik no
cancela preventivamente.

**Parar y fallar son ramas distintas, y `cancel()` las confunde por defecto.**
`speechSynthesis.cancel()` dispara `onerror` con `canceled` o `interrupted` en
la locución viva. Sin precaución, «Detener voz», «Ocultar» y «Pausar Sabik»
acaban en «Error de voz» y la etiqueta miente. Dos medidas, las dos
obligatorias:

```js
// 1 · soltar los manejadores antes de cancelar
if (utter) { utter.onerror = null; utter.onend = null; utter.onboundary = null; }
speechSynthesis.cancel();

// 2 · e ignorar los errores con forma de cancelación
utter.onerror = (ev) => {
  if (ev && (ev.error === "canceled" || ev.error === "interrupted")) return;
  errorVoice();
};
```

**Los `boundary` sobreviven a la pausa, y hay que descartarlos.** Los motores
encolan los eventos de palabra y los vuelcan después de `pause()`: llegan tres o
cuatro cuando la voz ya está detenida. Sin guarda, cada uno mete un impulso y
las barras siguen saltando durante «Voz en pausa» mientras la energía vale 0.
**Los impulsos solo existen con `speech = speaking`**, en el productor y en el
consumidor:

```js
// productor
utter.onboundary = (ev) => {
  if (ev.name && ev.name !== "word") return;
  if (voiceState !== "speaking") return;      // \u2190 la guarda
  pushImpulse();
};

// consumidor
impulses = voiceState === "speaking" ? liveImpulses() : [];
```

La rampa de bajada sí se sigue pintando desde la energía base: es la caída de
`160ms` de la tabla de arriba, no un impulso.

El guardián no es opcional. `onend` se pierde con cierta frecuencia al cambiar
de pestaña o al cortar la síntesis por sistema, y sin él quedan barras
moviéndose sobre un silencio: exactamente lo que prohíbe la regla principal.

---

## Fallback sin eventos de palabra

El fallback tiene **una sola condición de uso**, y las tres partes son
necesarias:

```
la voz ha empezado  (onstart recibido)
+ existe audio real
+ no llegan eventos boundary
→ estimar la cadencia intermedia
```

**No sirve para simular voz cuando el navegador no tiene síntesis.** Sin
`speechSynthesis`:

```
sin speechSynthesis
→ no se muestra Escuchar
→ no se activan ondas
→ el texto permanece completo
```

Una onda moviéndose sin audio es la misma mentira que la regla principal
prohíbe, solo que peor: no hay nada que la desmienta.

> El banco de pruebas sí simula cadencia sin síntesis, para poder revisar el
> fallback en cualquier navegador. Está marcado en el propio prototipo como
> **simulación exclusiva del banco** y no describe el runtime.

Cumplida la condición, cuatro reglas:

**1. Ritmo suave.** Un impulso cada `420ms` de base. Sin variación aleatoria de
amplitud: **todos los impulsos son idénticos**, solo cambia su separación. Se
sincroniza aproximadamente, no se simula la amplitud exacta de la voz.

**2. Inicio, pausa y final exactos.** Vienen de `onstart`, `onpause`,
`onresume`, `onend`, `onerror`, que sí son fiables. El fallback afecta **solo**
a la cadencia intermedia. Los cuatro extremos nunca se estiman.

**3. Sincronización con puntuación.** Se recorre el texto y se inserta silencio
donde lo habría al hablar:

| Signo | Silencio insertado |
|---|---|
| `,` `;` `:` | `300ms` de reposo a `.55`, sin impulso |
| `.` `?` `!` | `520ms` de reposo a `.55` |
| Fin de párrafo | `700ms` |
| Guion de lista | `420ms` |

**4. Sincronización con velocidad.** Cadencia derivada de `utterance.rate`:

```
intervalo = 420ms / rate        // rate 1 → 420ms; rate 1.2 → 350ms
intervalo = clamp(intervalo, 200ms, 900ms)
```

Con `rate` desconocido, `1.0`. Para el reparto de silencios se estima la
duración total como `palabras / (165 · rate)` minutos y se escala la posición de
la puntuación proporcionalmente. Es aproximación declarada, y por eso no se
intenta emparejar amplitud con volumen.

### Detección

```
soportaBoundary = false
// al recibir el primer onboundary con name === "word" → true, cancelar el fallback
// si no ha llegado ninguno 1200ms después de onstart → arrancar el fallback
```

Los `1200ms` dan margen a la primera palabra de una frase larga sin dejar un
hueco perceptible.

---

## Movimiento reducido

En `html[data-ig-motion="off"]`, `html[data-ig-system-motion="reduce"]` y
`prefers-reduced-motion: reduce` —el movimiento efectivo, derivado, nunca un
atributo propio de Sabik:

- Las cinco barras se muestran **estáticas** a `scaleY(1)`, `6px`, opacidad
  `.38`. Visibles, para que el sitio de la voz sea el mismo.
- `animation: none`, `transition: none`. Ni impulsos, ni rampas, ni caídas.
- **La voz sigue disponible y completa.** No se degrada la locución.
- **El texto sigue completo.** La respuesta escrita no cambia.
- El estado se comunica por `#sabik-state-label` —«Leyendo en voz alta», «Voz en
  pausa»— y por las etiquetas de los botones. No se pierde información: lo que
  las ondas decían, lo dice el texto.
- Ninguna señal queda en el color solamente: los estados de voz se distinguen
  por texto y por etiqueta de control, no por el tono de las barras.

---

## Resumen de valores implementables

```
ondas máximas          5
barra                  3px × 6px reposo, radio 999px, gap 4px
caja                   31px × 22px, reservada siempre
escala mínima          1     (6px)
escala máxima          3.6   (21.6px)   · baja intensidad 2.2 (13.2px)
opacidad reposo        .38
opacidad impulso       .92   · baja intensidad .30
opacidad entre impulso .52
suelo activo           E = .55
rampa de inicio        180ms  cubic-bezier(.2,.7,.3,1)
ataque de impulso       90ms  cubic-bezier(.2,.7,.3,1)
caída de impulso       260ms  cubic-bezier(.4,0,.6,1)
caída a pausa          160ms  cubic-bezier(.4,0,.6,1)
caída a final          240ms  cubic-bezier(.4,0,.6,1)
caída a error          120ms  linear
frecuencia máxima      5 Hz   (1/200ms)
frecuencia fallback    2,4 Hz (1/420ms), clamp 200–900ms
retardo por barra      40 / 20 / 0 / 20 / 40 ms
amplitud por barra     .62 / .84 / 1.00 / .88 / .66
guardián               cada 250ms
timeout de onstart     1500ms
timeout de boundary    1200ms
retirada del nodo      600ms tras finalizada
```
