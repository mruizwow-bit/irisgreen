# RESPONSIVE-A11Y

**NO PUBLICAR · NO RUNTIME · REFERENCIA DE IMPLEMENTACIÓN**
Rama `sabik/design-states-voice` · issue #148 · PR draft #163

---

## Orden de lectura: hay que mover el DOM

El orden útil en una columna es:

```
1. búsqueda manual
2. Sabik
3. resultados o directorio
```

Hoy no se puede conseguir sin tocar el DOM. En `es/nea/index.html` el orden real es:

```
<div class="sabik-home-with-panel">
  <main>  hero + búsqueda · #results · #secciones (directorio)  </main>
  <aside class="sabik-panel"> … </aside>
</div>
```

En una columna eso se lee **búsqueda → resultados → directorio → Sabik**: el
panel queda detrás de todo el directorio, a dos pantallas de scroll.

`order`, `grid-row` o `flex-direction` lo arreglarían visualmente y dejarían el
orden de lectura y de tabulación intactos, es decir, distinto del visual. Eso
está excluido por el encargo, y con razón: quien tabula acabaría en Sabik
después del directorio mientras lo ve encima.

**Reestructuración necesaria** (fase de implementación, `es/nea/index.html`).
Un solo `<main>`, y el `<aside>` **dentro** de él: sacar resultados y directorio
del landmark principal arreglaría el orden a costa de una regresión semántica
peor que el problema.

```html
<main id="main" class="sabik-home-with-panel">
  <div class="sabik-home-intro">
    <!-- hero + búsqueda manual -->         <!-- 1 -->
  </div>

  <aside class="sabik-panel" aria-label="Sabik">
    <!-- Sabik -->                           <!-- 2 -->
  </aside>

  <div class="sabik-home-rest">
    <!-- resultados + directorio -->         <!-- 3 -->
  </div>

  <div class="detail-page" hidden>
    <!-- vista de detalle existente -->
  </div>
</main>
```

Y la rejilla de escritorio recoloca sin reordenar la lectura:

```css
.sabik-home-with-panel{
  display:grid;
  grid-template-columns:minmax(0,1fr) minmax(340px,400px);
  column-gap:28px;
}
.sabik-home-intro { grid-column:1; grid-row:1 }
.sabik-panel      { grid-column:2; grid-row:1 / span 2 }
.sabik-home-rest  { grid-column:1; grid-row:2 }
.detail-page      { grid-column:1 / -1 }
```

En una columna, `grid-template-columns:minmax(0,1fr)` y los tres bloques caen en
su orden de DOM, que ya es el orden útil. El orden visual y el de lectura
coinciden en los dos casos, sin `order` y sin sacar contenido principal de
`<main>`.

---

## Puntos de ruptura

| Ancho | Comportamiento |
|---|---|
| **≥ 1440px** | Dos columnas. Panel `minmax(340px,400px)`, `position: sticky`, `top: 112px`, `max-height: calc(100dvh - 136px)`, `overflow-y: auto`. Holograma 72 px. |
| **1281–1439px** | Igual, columna del panel a `minmax(320px,360px)`. |
| **≤ 1280px** | Una columna. Panel `position: static`, `max-height: none`, `overflow: visible`. Ya resuelto en la hoja actual. Los tres bloques caen en orden de DOM. |
| **881–1280px** (tableta) | Una columna, panel a ancho completo, `padding: 20px`. Filas de controles en `flex-wrap`. Holograma 72 px. |
| **≤ 880px** (móvil) | `padding: 18px`. Controles a `flex-wrap`, mínimo dos por fila mientras caben. |
| **≤ 420px** | Controles a `flex-basis: 100%`: uno por fila. Un botón de 44 px de alto partido en dos líneas es peor que cuatro botones anchos. |
| **≤ 360px** | Holograma 56 px, cabecera `grid-template-columns: 56px minmax(0,1fr) auto`. |
| **320px** | Ver abajo. |

### 320 CSS px

| Elemento | Valor |
|---|---|
| Padding del panel | `14px` |
| Ancho útil | `292px` |
| Cabecera | `44px minmax(0,1fr) auto`, `gap: 10px` |
| Holograma | `44px` |
| `#sabik-toggle` | Solo icono, `aria-label` obligatorio, 44×44 |
| Botones | `flex-basis: 100%`, `min-height: 44px` |
| `textarea` | `min-height: 72px` — a este ancho una frase ocupa tres líneas |
| Insignia «IA» | Se mantiene: es la declaración de que es una IA, y eso no se recorta |
| Caja de ondas | `31px × 22px`, sin cambios. Cabe. |

Nada se recorta con puntos suspensivos. Ningún `min-width` de los reservados en
`CONTROL-STATES.md` se aplica por debajo de 420 px: ahí manda `flex-basis: 100%`,
y el ancho ya está fijo.

### 200 % de texto

Raíz `17px → 34px`. Se verifica con zoom de solo texto, no con zoom de página.

- Ningún alto fijo en el panel. `min-height` sí; `height` nunca.
- El panel con `max-height` y `overflow-y: auto` absorbe el desbordamiento en
  escritorio. Con viewport bajo, el `sticky` debe liberarse:

```css
@media (max-height: 640px){
  body.sabik-iris-page .sabik-home-with-panel > .sabik-panel{
    position:static; max-height:none; overflow:visible;
  }
}
```

- `.sabik-name-row` ya lleva `flex-wrap: wrap`: el título y la insignia se
  parten en dos líneas sin romper.
- `.sabik-title` usa `clamp(2.9rem,6vw,4.9rem)`. Con texto al 200 % el `clamp`
  no crece, porque `vw` no depende del tamaño de fuente. **Cambiar a
  `clamp(2.2rem, 2rem + 2.4vw, 4.9rem)`** para que el suelo escale con la raíz.
- Los `min-width` reservados de los botones pasan a `min-width: max-content` por
  encima de 150 % de texto, o la etiqueta se sale de la caja.

### Movimiento efectivo

Ninguna regla de este documento usa un atributo de movimiento propio de Sabik.
El valor se deriva de `html[data-ig-motion="off"]`,
`html[data-ig-system-motion="reduce"]` y `prefers-reduced-motion: reduce`, que
es lo que Iris Green ya mantiene desde el panel Lectura.

### 400 % de zoom

Con viewport de 1280 px, 400 % equivale a **320 CSS px**: se aplica la columna
de 320 px, sin reglas propias. Verificación: ningún scroll horizontal, ninguna
pérdida de contenido, ningún control fuera de la ventana.

### Orientación

| Orientación | Comportamiento |
|---|---|
| Vertical, móvil | Una columna. Panel entre búsqueda y directorio. |
| Horizontal, móvil (≈740×360) | Una columna igual. `position: static` forzado por `max-height: 640px`. El panel **no** se pega: en 360 px de alto un sticky tapa la mitad de la pantalla. |
| Horizontal, tableta (≈1180×820) | Una columna, panel a ancho completo. |

Ninguna regla usa `orientation` directamente. Se deriva de ancho y alto, que es
lo que de verdad condiciona el layout.

---

## Contraste medido

Fondo de referencia: **`#F8F6FF`**, el color efectivo del degradado del panel
(`linear-gradient(160deg, rgba(255,255,255,.93), rgba(248,246,255,.82))`), no el
blanco puro. Es donde están los controles de verdad.

### Texto

| Token | Uso | Sobre `#fff` | Sobre `#F8F6FF` | Mínimo | |
|---|---|---|---|---|---|
| `--sabik-ink` `#17395c` | Títulos, etiquetas, texto de botón | 11,8:1 | 11,1:1 | 4,5:1 | ✅ |
| `--sabik-muted` `#43566d` | Estado, capacidad, notas, insignia | 7,5:1 | 7,0:1 | 4,5:1 | ✅ |
| `--sabik-warn` `#775400` | `.sabik-answer.is-warning` | 6,9:1 | 6,4:1 | 4,5:1 | ✅ |
| `--sabik-danger` `#8f1d1d` | Texto de derivación | 8,9:1 | 8,3:1 | 4,5:1 | ✅ |
| `#fff` sobre `#17395c` | Botón primario | 11,8:1 | — | 4,5:1 | ✅ |

### Bordes e iconos

| Token | Uso | Sobre `#fff` | Sobre `#F8F6FF` | Mínimo | |
|---|---|---|---|---|---|
| `#8492a5` | Borde de botón secundario, insignia, punto «minimal» | 3,16:1 | **2,96:1** | 3:1 | ❌ |
| `#6E7E93` **propuesto** | Lo mismo | 4,14:1 | 3,87:1 | 3:1 | ✅ |
| `--sabik-focus` `#5a49a8` | Anillo de foco | 7,1:1 | 6,7:1 | 3:1 | ✅ |
| `--sabik-focus` sobre `#E9ECF7` | Foco sobre hover | 6,0:1 | — | 3:1 | ✅ |
| `--sabik-border` `rgba(80,107,132,.14)` | Separadores | 1,21:1 | 1,13:1 | — | ⚠️ |
| `#dfe6ef` | `border-top` de la fila de respuesta | 1,26:1 | — | — | ⚠️ |

**El hallazgo que bloquea.** `#8492a5` pasa el 3:1 sobre blanco puro por muy
poco (3,16:1) y **no lo pasa sobre el fondo real del panel: 2,96:1**. Como es el
único límite de todos los botones secundarios, hay que cambiarlo a `#6E7E93`.
Cae en `sabik/sabik-page.css`, fuera de esta rama: queda anotado para la fase de
implementación.

**Los ⚠️ son correctos, con una condición.** `--sabik-border` y `#dfe6ef` son
separadores decorativos y no necesitan 3:1. La condición: **ningún borde que
delimite un control, un campo o un estado deshabilitado puede usarlos.** Hoy
`.sabik-search input` y `.sabik-widget textarea` llevan
`border: 1px solid var(--sabik-border)` a 1,13:1, y ahí el borde **sí** es el
límite del campo. Pasan a `#6E7E93`.

### Señal que no es solo color

| Estado | Color | Segunda señal |
|---|---|---|
| Presencia base | `#5a49a8` relleno | Texto «Disponible» |
| Presencia minimal | `#6E7E93` relleno | Texto «En pausa» / «Buscando» |
| Presencia riesgo | Anillo `#8f1d1d` | **Forma**: anillo de 2 px con centro blanco, más el texto |
| Botón pressed | Fondo `#EEE9FF` | **Grosor**: borde 1 px → 2 px, más `aria-pressed` |
| Respuesta de aviso | Texto `#775400` | Encabezado explícito, más `aria-live` |
| Ondas activas | Opacidad `.92` | Movimiento, más texto «Leyendo en voz alta» |

En movimiento reducido, donde la sexta fila pierde su señal de movimiento, el
texto de estado queda como única señal y **es suficiente por sí mismo**.

---

## Objetivos interactivos

| Elemento | Actual | Mínimo | |
|---|---|---|---|
| `.sabik-button` | `min-height: 44px` | 44px | ✅ |
| `.sabik-icon-button` | `min-width/min-height: 44px` | 44px | ✅ |
| `.sabik-widget textarea` | `min-height: 58px` | 44px | ✅ |
| `.sabik-examples a` | `min-height: 34px` | 44px | ❌ |
| Enlaces de `.sabik-source-list` | Alto de línea, ≈24px | 44px | ❌ |

`.sabik-examples a` y los enlaces de fuente se quedan en 34 px y ≈24 px. En
línea de texto, WCAG 2.5.8 admite el objetivo pequeño si hay separación
suficiente; los de fuente están en una lista con `gap: 6px`, que no basta.
**Subir el `gap` de `.sabik-source-list` a `12px`** y dar a cada enlace
`padding-block: 10px`: llega a 44 px sin convertir la lista en una botonera.

**Separación entre controles:** `8px` en `.sabik-actions` y
`.sabik-response-actions`. Con «Botones más grandes» activado, `12px`. Con
objetivos de 44 px, la separación de 8 px cumple 2.5.8.

---

## Reflow y truncamiento

- **Sin scroll horizontal** entre 1920 px y 320 px. El panel lleva
  `min-width: 0` en sí y en todos sus descendientes; `.sabik-answer`,
  `.sabik-notice` y `.sabik-source-list` llevan `overflow-wrap: anywhere`.
- **Sin `text-overflow: ellipsis`** en ninguna parte del panel. Las etiquetas de
  estado y de control no se recortan: se reserva su ancho o se parten en dos
  líneas.
- **URLs.** El enlace de fuente muestra `pathname`, no la URL completa. Cuando
  el Core exponga `source_titles` pasará a mostrar el título de la ficha. Es la
  línea pendiente de `nea-core/response.js`.
- **Región desplazable.** Con `overflow-y: auto` en escritorio, el panel es una
  región desplazable. Siempre contiene controles enfocables, así que se alcanza
  con teclado sin `tabindex="0"`. Si alguna vez queda sin enfocables —plegado
  con `max-height`—, necesita `tabindex="0"` y nombre accesible.

## Foco

- `outline: 3px solid #5a49a8; outline-offset: 3px` en todo el panel. Ya
  presente para `button`, `input`, `textarea` y `a`.
- `outline-offset: 3px` necesita 3 px de espacio libre alrededor. Los controles a
  `flex-basis: 100%` con `gap: 8px` lo tienen; al borde del panel, el
  `padding: 14px` de 320 px también.
- **El foco no se mueve solo**, salvo en tres casos justificados: «Error
  técnico» (a `#sabik-answer`), «Derivación humana» (al primer recurso) y
  «Esperando aclaración» (a la primera opción, y solo si la persona venía del
  teclado).
- Los controles que cambian de etiqueta no cambian de sitio ni de ancho. Un
  botón que se encoge al pulsarlo mueve el anillo de foco y se pierde el hilo.
- `:focus-visible`, no `:focus`: el anillo no aparece al pulsar con el ratón.
- El anillo nunca se sustituye por sombra: en `forced-colors: active` las
  sombras no se pintan.

## Estado deshabilitado

- `opacity: .55` sobre texto `#17395c` da **6,1:1** sobre el panel. Cumple.
- Sobre el primario (`#fff` en `#17395c` al 55 %) da **4,7:1**. Cumple, al
  límite. No bajar de `.55`.
- `cursor: wait` durante «Buscando» y «Componiendo»; `not-allowed` en el resto.
  Hoy `.sabik-button[disabled]` pone `wait` siempre, y un campo vacío no es una
  espera.
- En `forced-colors: active`, `color: GrayText`: la opacidad no se aplica.
- Un control deshabilitado **no se oculta**. Se oculta solo lo retirado por
  riesgo o derivación, donde el bloque cambia de composición a propósito.
