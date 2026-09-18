# CONTROL-STATES

**NO PUBLICAR · NO RUNTIME · REFERENCIA DE IMPLEMENTACIÓN**
Rama `sabik/design-states-voice` · issue #148 · PR draft #163

---

## Retirada de «Parar»

Hoy `#sabik-clear`, etiquetado «Parar», hace dos cosas a la vez y no dice cuál:
vacía el campo, oculta la respuesta, **descarta la sesión entera** y pone a
Sabik en pausa. Quien lo pulsa para que Sabik se calle pierde la respuesta que
estaba leyendo. Quien lo pulsa para empezar de cero no sabe si Sabik queda
apagado.

Se divide en dos controles con un efecto cada uno:

| Control | Conserva conversación | Conserva respuesta | Detiene voz | Borra sesión |
|---|---:|---:|---:|---:|
| **Pausar Sabik** `#sabik-pause` | Sí | Sí | Sí | No |
| **Detener voz** `#sabik-voice-stop` | Sí | Sí | Sí | No |
| **Empezar de nuevo** `#sabik-restart` | No | No | Sí | Sí |
| **Ocultar / plegar** `#sabik-toggle` | Sí | Sí | Sí | No |

`#sabik-clear` queda retirado. La etiqueta «Parar» no se reutiliza para nada:
reaparecer sobre otra acción arrastraría el mismo problema.

**Empezar de nuevo no pide confirmación ni ofrece deshacer.** Contrato exacto:

```
Empezar de nuevo
→ cancela la voz
→ crea una sesión nueva
→ borra campo, respuesta y fuentes
→ anuncia «Has empezado una sesión nueva»
→ coloca el foco en el campo
```

Sin diálogo modal y **sin temporizador**. Un «deshacer» de seis segundos mete
presión temporal en una interfaz para personas que pueden necesitar más tiempo,
obliga a retener la sesión vieja después de haber dicho que se empezó de cero, y
añade una transición, un anuncio y una gestión de foco que no hacen falta para
cerrar el fallo. Si más adelante hay que prevenir pulsaciones accidentales, se
estudiará una confirmación en línea **no temporizada**; no forma parte del
contrato inicial.

---

## Estados visuales comunes

Se especifican nueve estados por control. Base para todos:

| | Valor |
|---|---|
| Alto mínimo | `44px` |
| Radio | `8px` (`--sabik-radius`) · redondo `999px` solo en Ocultar/Mostrar |
| Relleno | `10px 14px` |
| Peso | `650` |
| Separación entre controles | `8px`; `12px` con «Botones más grandes» |
| Transición | `border-color 180ms, background 180ms` · `none` en movimiento reducido |

### Borde: corrección obligatoria

El borde actual `#8492a5` pasa el 3:1 sobre blanco puro por muy poco y **no lo
pasa sobre el fondo real del panel**. Un borde que es el único límite de un
control necesita 3:1 donde el control está de verdad:

```
#8492a5   →   3,16:1 sobre #fff   ·   2,96:1 sobre #F8F6FF   ✗
#6E7E93   →   4,14:1 sobre #fff   ·   3,87:1 sobre #F8F6FF   ·   3,51:1 sobre #E9ECF7   ✓
```

Afecta a `.sabik-button:not(.primary)`, `.sabik-badge`, `.sabik-button.danger`,
`.sabik-icon-button`, `.sabik-state-dot[data-state="minimal"]`.

### Los nueve estados

| Estado | Especificación |
|---|---|
| **normal** | Secundario: borde `1px #6E7E93`, fondo `rgba(255,255,255,.72)`, texto `#17395c`. Primario: fondo y borde `#17395c`, texto `#fff`. |
| **hover** | Secundario: borde `#17395c`, fondo `rgba(255,255,255,.92)`. Primario: fondo `#0F2A45`. Sin desplazamiento, sin sombra nueva, sin escala. |
| **focus-visible** | `outline: 3px solid #5a49a8; outline-offset: 3px`. Idéntico en todos. **Nunca `outline: none`.** El foco no sustituye al hover: se pueden ver a la vez. |
| **activo** (`:active`) | `translateY(1px)`. Sin cambio de color: el desplazamiento ya confirma. En movimiento reducido, `filter: brightness(.96)` en lugar del desplazamiento. |
| **pressed** (`aria-pressed="true"`) | Borde `2px #5a49a8`, fondo `#EEE9FF`, texto `#17395c`, peso `750`. **El fondo no es la única señal**: el grosor del borde cambia de 1 a 2 px. |
| **disabled** | `opacity: .55`, `cursor: not-allowed` — salvo durante «Buscando», donde es `wait`. Borde a `#6E7E93`. Se mantiene `1px`: no adelgazar, o el control desaparece del layout visual. **Nunca ocultar en lugar de deshabilitar** si la persona podía verlo un instante antes. |
| **error** | Solo en Enviar y Escuchar. Borde `1px #8f1d1d`, texto `#8f1d1d`, fondo sin cambios. Sin animación, sin sacudida. El mensaje va en `#sabik-notice`, no en el botón. |
| **alto contraste** (`html[data-ig-contrast=on]`) | Fondo `#fff`, texto `#111`, borde `#111`. Primario: fondo `#111`, texto `#fff`. Pressed: borde `3px #111` más `▪` antes de la etiqueta, porque a este contraste el relleno lila desaparece. |
| **colores forzados** (`forced-colors: active`) | `background: ButtonFace`, `color: ButtonText`, `border-color: ButtonText`. Pressed: `border: 2px solid Highlight`. Disabled: `color: GrayText`. Focus: `outline: 3px solid Highlight`. Ningún `box-shadow` sobrevive aquí, así que ninguna señal puede depender de uno. |

---

## Los trece controles

### 1 · Ocultar / Mostrar

| | |
|---|---|
| id | `#sabik-toggle` |
| Tipo | Icono con texto, radio `999px`, borde `2px #6E7E93` |
| Etiquetas | «Ocultar» ⇄ «Mostrar» |
| ARIA | `aria-expanded` `true`/`false`, `aria-controls="sabik-widget-body"` |
| Jerarquía | Terciario. Nunca compite con Enviar. |
| Disponible en | Todos los estados, incluidos error y riesgo |
| Nunca | Deshabilitado. Es la salida. |

Al cambiar de etiqueta **no cambia de sitio ni de ancho**: se reserva el ancho
del texto más largo (`Mostrar`, 7 caracteres) con `min-width: 108px`. Si el
botón se encoge, el foco visible salta.

### 2 · Pausar Sabik / Reanudar

| | |
|---|---|
| id | `#sabik-pause` |
| Tipo | Secundario |
| Etiquetas | «Pausar Sabik» ⇄ «Reanudar» |
| ARIA | `aria-pressed` no aplica: cambia la etiqueta, que es más claro |
| Jerarquía | Secundario, en la fila discreta |
| Deshabilitado en | «Arrancando», «Oculto» |
| Ancho reservado | `min-width: 132px` |

### 3 · Empezar de nuevo

| | |
|---|---|
| id | `#sabik-restart` |
| Tipo | Secundario |
| Deshabilitado en | «Listo» sin nada escrito ni respondido, «Arrancando» |
| Tras pulsar | Anuncia «Has empezado una sesión nueva» y lleva el foco al campo |
| Nunca | Estilo de peligro, ni temporizador de deshacer. Vaciar un formulario sin historial no es destructivo. |

### 4 · Escuchar

| | |
|---|---|
| id | `#sabik-listen` |
| Tipo | Secundario |
| Deshabilitado en | Cualquier estado sin texto en `#sabik-answer`; «Error de voz» por falta de soporte |
| Estado de error | Borde `#8f1d1d` una sola vez, con el aviso en `#sabik-notice` |
| Etiqueta | «Escuchar», **siempre**. Es también el nombre accesible, y no cambia nunca. |
| Durante locución | Sigue diciendo «Escuchar», **deshabilitado y en su sitio** en `speech=starting`, `speaking` y `paused`. No se retira, no cambia de ancho y no se renombra; los dos controles de voz de al lado se habilitan según el estado. |
| Ancho reservado | `min-width: 132px` |

Si `window.speechSynthesis` no existe, el botón **no se renderiza**. Un control
permanentemente deshabilitado sin explicación es peor que su ausencia.

**«Escuchar» no se renombra durante la locución.** La identidad del control es
estable: quien lo ha pulsado una vez sabe dónde está y qué hace. El estado de la
locución se comunica por otros tres canales, que es donde la persona lo busca:

- el **texto de estado** — «Iniciando voz», «Leyendo en voz alta», «Voz en
  pausa»;
- **Pausar voz / Reanudar voz**, que sí cambia de etiqueta porque su efecto
  cambia;
- **Detener voz**, `#sabik-voice-stop`, el **único** control que detiene la
  locución.

Renombrar el botón de origen al estado en curso mueve la señal de estado a un
sitio donde estorba —el control que la persona volverá a pulsar— y deja el
control sin nombre propio mientras suena la voz.

### 5 · Pausar voz / Reanudar voz

| | |
|---|---|
| id | `#sabik-voice-pause` |
| Tipo | Secundario |
| Etiquetas | «Pausar voz» ⇄ «Reanudar voz» |
| Presencia | **Siempre presente**, como los otros dos de su fila |
| Habilitado en | `hablando`, `pausada` |
| Deshabilitado en | `iniciando` —no se puede pausar lo que no ha sonado—, `silencio`, `finalizada`, `error` |
| Ancho reservado | `min-width: 144px` |

### 6 · Detener voz

| | |
|---|---|
| id | `#sabik-voice-stop` |
| Tipo | Secundario |
| Presencia | **Siempre presente** |
| Habilitado en | `iniciando`, `hablando`, `pausada` |
| Efecto | `cancel()` y caída inmediata de energía, sin esperar `onend`. Soltar `onerror` antes de cancelar: ver `VOICE-WAVE-SPEC.md § Parada`. |
| Diferencia con Pausar Sabik | Detener voz no toca la conversación; Pausar Sabik detiene todo |

### 7 · Bajar intensidad / Intensidad normal

| | |
|---|---|
| id | `#sabik-low` |
| Tipo | Secundario, `aria-pressed` |
| Etiquetas | «Bajar intensidad» ⇄ «Intensidad normal» |
| Pressed | Borde `2px #5a49a8`, fondo `#EEE9FF` |
| Retirado en | **En ninguno.** Sigue disponible bajo `uncertain`, `risk` y `human_handoff`: la protección decide contenido y prioridad, no revoca una preferencia de reducción de estímulo. |
| Ancho reservado | `min-width: 168px` |

Se usan **las dos señales**: `aria-pressed` y el cambio de etiqueta. Un
`aria-pressed` sin etiqueta que cambie obliga a recordar en qué modo estás.

### 8 · Más corto

| | |
|---|---|
| id | `#sabik-shorter` |
| Tipo | Secundario, `aria-pressed` |
| Efecto | `response_length: "short"` y vuelve a pedir la respuesta |
| Deshabilitado en | Sin respuesta previa; «Buscando»; «Componiendo» |
| Retirado en | «Riesgo incierto», «Derivación humana» — es formato, y ahí no se ajusta formato |

Es **conmutable**: pulsado otra vez, vuelve a longitud normal. Hoy solo va en
un sentido, y eso es una vía sin retorno dentro de la sesión.

### 9 · Una opción

| | |
|---|---|
| id | `#sabik-single` |
| Tipo | Secundario, `aria-pressed` |
| Efecto | `max_options: 1` |
| Relación con Más corto | Independientes. «Más corto» acorta el texto; «Una opción» reduce la lista. Hoy están fundidos en `#sabik-shorter` y hay que separarlos. |
| Retirado en | «Riesgo incierto», «Derivación humana» |

### 10 · Evitar preguntas

| | |
|---|---|
| id | `#sabik-no-questions` |
| Tipo | Secundario, `aria-pressed` |
| Efecto | Sabik entrega lo mejor que tiene sin pedir aclaración |
| Disponible en | Todos, y **en especial** en «Esperando aclaración» |
| Retirado en | «Riesgo incierto» — ahí preguntar es la conducta correcta |
| Ancho reservado | `min-width: 156px` |

### 11 · No es esto

| | |
|---|---|
| id | `#sabik-not-this` |
| Tipo | Secundario, fila de respuesta |
| Visible solo en | «Respuesta preparada», «Esperando aclaración» |
| Deshabilitado tras | Pulsarlo, hasta que haya una respuesta nueva |
| Retirado en | «Derivación humana» |

### 12 · Buscar por otra vía

| | |
|---|---|
| id | `#sabik-other-way` |
| Tipo | Secundario, fila de respuesta |
| Visible solo en | «Respuesta preparada» |
| Deshabilitado si | No hay vía alternativa real. Con el botón deshabilitado, `#sabik-notice` explica por qué. |
| Retirado en | «Derivación humana» |

### 13 · Enviar

| | |
|---|---|
| id | `#sabik-submit` |
| Tipo | **Primario y único.** Fondo `#17395c`, texto `#fff` |
| Deshabilitado en | Campo vacío; «Arrancando»; «Buscando»; «Componiendo»; «Sabik pausado» |
| `cursor` al deshabilitar | `wait` durante buscar y componer; `not-allowed` en el resto |
| Estado de error | Borde `#8f1d1d` y aviso en `#sabik-notice` |
| Nunca | Dos primarios en el panel a la vez |

Al deshabilitarse durante la búsqueda **no cambia de etiqueta**. «Enviando…»
dentro del botón mueve su ancho y desplaza la fila; el progreso ya está en
`#sabik-status-text`.

---

## Jerarquía y orden

Tres filas, y el orden es el orden de lectura:

```
Fila 1  ·  primaria      Enviar
Fila 2  ·  ajustes       Bajar intensidad · Más corto · Una opción · Evitar preguntas
Fila 3  ·  sesión        Escuchar · Pausar voz · Detener voz · Pausar Sabik · Empezar de nuevo
Fila 4  ·  respuesta     No es esto · Buscar por otra vía     (solo con respuesta)
```

Reglas:

- Un solo primario en el panel. Los demás, borde.
- `Ocultar` vive en la cabecera, fuera de las filas.
- Los tres controles de voz —Escuchar, Pausar voz, Detener voz— están **siempre
  presentes en la fila 3**, y los que no aplican quedan deshabilitados. Si
  aparecieran y desaparecieran con la locución, la fila crecería y todo lo de
  debajo bajaría a media lectura.
- Ningún control aparece y desaparece dentro de un mismo estado. Los que no
  aplican están deshabilitados, no retirados, **salvo** los retirados por
  riesgo o derivación, donde la retirada es intencionada y el bloque entero
  cambia de composición.
