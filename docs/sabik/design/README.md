# Sabik · Especificación visual de estados, voz y movimiento

**NO PUBLICAR · NO RUNTIME · REFERENCIA DE IMPLEMENTACIÓN**

| | |
|---|---|
| Repositorio | `mruizwow-bit/irisgreen` |
| Base | `sabik-preview` |
| Rama | `sabik/design-states-voice` |
| Issue | #148 |
| PR draft | #163 (mantener en draft) |
| Destino | `sabik-preview` |

Esta carpeta no se despliega y no se carga desde ninguna página. Nada de aquí
debe importarse desde `sabik/sabik-page.css`, `sabik/sabik-page.js`,
`es/nea/index.html` ni `sabik/nea-core/**` en esta fase.

## Documentos

| Archivo | Contenido |
|---|---|
| `STATE-VISUAL-MATRIX.md` | El mapa con S0, los 20 estados sobre 6 ejes, con valores, texto, foco, anuncio y transiciones. |
| `VOICE-WAVE-SPEC.md` | Ondas de voz: geometría, energía, eventos, fallback sin `boundary`. |
| `CONTROL-STATES.md` | Los 13 controles × 9 estados visuales. Retirada de «Parar». |
| `RESPONSIVE-A11Y.md` | Escritorio a 320 px, 200 % de texto, 400 % de zoom, medidas de contraste. |
| `prototypes/` | Banco de estados y voz, más su aviso de seguridad. Referencia visual, no runtime. **Leer `prototypes/README.md` antes de copiar nada.** |

## Tres decisiones que condicionan la implementación

**1. Seis ejes, no veinte estados.** Los 20 estados del encargo no son pares
entre sí: «Hablando» y «Buscando» pueden coexistir, «Plegado» y «Baja
intensidad» también. Se especifican como combinación de seis ejes
independientes, que son la **proyección visual** de la máquina central S0, no un
sustituto de ella: las transiciones válidas las decide `sabik-machine.js`. Un
`switch` de veinte ramas produce estados imposibles y transiciones inventadas.
Cuatro de los ejes ya existen; `data-voice-state` es el único atributo nuevo, y
el movimiento efectivo se deriva del sistema de preferencias que la web ya
mantiene. Los ejes y sus valores están en `STATE-VISUAL-MATRIX.md § Ejes`.

**2. «Parar» se retira.** Hoy `#sabik-clear` con la etiqueta «Parar» hace dos
cosas distintas —vacía la sesión y detiene a Sabik— y no dice cuál. Se
sustituye por dos controles con un solo efecto cada uno: «Pausar Sabik»
(reversible, conserva el texto en pantalla) y «Empezar de nuevo» (vacía campo,
respuesta y sesión, anuncia y lleva el foco al campo; sin diálogo y sin
temporizador de deshacer). Detalle en `CONTROL-STATES.md § Retirada de «Parar»`.

**3. Cuando Sabik calla, las ondas no existen.** Energía 0 no es una animación
lenta ni `animation-play-state: paused`: es `animation: none` con la geometría
de reposo aplicada, y en JS también el `requestAnimationFrame` dormido y los
temporizadores cancelados. Una onda que respira en silencio convierte la señal
de voz en decoración ambiental y deja de informar. Las ondas arrancan con
`onstart`, nunca con el clic; y el fallback solo sustituye la ausencia de
`boundary`, nunca la ausencia de voz. Regla completa en
`VOICE-WAVE-SPEC.md § Regla principal`.

## Un hallazgo que bloquea

`#8492a5`, el borde actual de `.sabik-button:not(.primary)`, `.sabik-badge`,
`.sabik-button.danger` y `.sabik-state-dot[data-state="minimal"]`, pasa el 3:1
sobre blanco puro por muy poco —**3,16:1**— y **no lo pasa sobre el fondo real
del panel**, `#F8F6FF`: **2,96:1**. Como es el único límite de todos los botones
secundarios, hay que sustituirlo por `#6E7E93` (4,14:1 sobre blanco, 3,87:1
sobre el panel). Mismo problema en `.sabik-search input` y
`.sabik-widget textarea`, que delimitan el campo con `--sabik-border` a 1,13:1.
Afecta a `sabik/sabik-page.css` y por tanto queda fuera de esta rama: anotado
para la fase de implementación en `RESPONSIVE-A11Y.md § Contraste medido`.

## Veredicto

**DESIGN_CANONICAL_PACKAGE_READY** — entrega canónica final, ocho archivos, sin
contradicciones pendientes.

### Fuente de partida y blob

La reconciliación parte de la entrega posterior (`Desingzip.zip`), que es la que
trae la alineación canónica de los cinco ejes S0, `human_handoff`,
`protection_static`, la conservación de `low_intensity` y las reglas de
protección. Los blobs antiguos del prototipo —`1fa72e285…` y `4ee16024…`—
quedan **superados**: no son requisito de integridad. El prototipo de esta
entrega tiene un **nuevo blob canónico**, que es el que se congela.

### Contradicción cerrada en esta revisión

`#sabik-listen` **conserva siempre** la etiqueta y el nombre accesible
«Escuchar». Durante `speech=starting`, `speaking` o `paused` puede quedar
deshabilitado, pero **no se renombra**. El estado de la locución
lo comunican el texto de estado —«Iniciando voz», «Leyendo en voz alta», «Voz en
pausa»—, el par «Pausar voz / Reanudar voz» y `#sabik-voice-stop`, que sigue
siendo el **único** control «Detener voz». Corregido en `CONTROL-STATES.md § 4`,
en `STATE-VISUAL-MATRIX.md § 13/14/16` y en el prototipo. Los ocho archivos no
contienen ya ninguna etiqueta alternativa para este control.

### Verificado

| Punto | Estado |
|---|---|
| Ocho archivos exactos bajo `docs/sabik/design/**` | ✓ sin noveno archivo |
| «Escuchar» con etiqueta estable en todos los estados | ✓ docs y prototipo |
| `#sabik-voice-stop` único «Detener voz» | ✓ |
| Cinco ejes S0 + visibilidad de panel | ✓ contrato congelado, sin segunda máquina |
| `human_handoff` en `dialogue` y `safety` | ✓ |
| `motion=protection_static` bajo protección | ✓ sin ondas de voz ordinarias |
| `low_intensity` heredado en `risk` y `human_handoff` | ✓ nunca forzado a `false` |
| Secuencia `starting → start → boundary → pause → resume → end → error` | ✓ energía 0 salvo en `speaking` |
| Onda inactiva en `starting` y en `paused` | ✓ boundaries tardíos ignorados |
| `cancel()` no deja error falso | ✓ manejadores soltados antes de cancelar |
| Movimiento reducido desde la preferencia global | ✓ sin segunda preferencia paralela |
| Vistas fijas de plegado y derivación humana | ✓ renderizan |
| Un único `<main>` y orden móvil real en DOM | ✓ sin `order` |
| Valores de contraste | ✓ idénticos en los cuatro documentos |
| `support.js` solo en `prototypes/` | ✓ enlazado como `./support.js` |

### Build: ya defendido

`docs/` no puede alcanzar `dist/`.
`PUBLIC_DIRS=('assets','audio','img','es','en','sabik')` es una **lista blanca**
y `docs` no está en ella; el `copytree` descarta además `*.md` y `*.dc.html`; y
`check_csp_eval_scope.py` ya contempla `support.js` por nombre y rompe el build
ante cualquier `new Function` publicado. Detalle en
`prototypes/README.md § Comprobación de build`.

Un aviso que sale de ahí: `sabik` **sí** está en `PUBLIC_DIRS`. `support.js`
bajo `sabik/` se publicaría y tumbaría la auditoría de CSP. Por eso el archivo
no sale de `docs/sabik/design/prototypes/`.

### Fuera de esta entrega

La especificación holográfica y de companions es posterior y **no forma parte de
PR #163**. Vive aparte, pendiente de delimitación técnica.

## Cuerpo para el PR #163

> Especificación visual definitiva de estados, voz y movimiento (issue #148).
>
> Añade `docs/sabik/design/**`: matriz de estados sobre seis ejes, especificación
> de ondas de voz con valores implementables y fallback sin eventos de palabra,
> estados de los trece controles y especificación responsive y de accesibilidad
> de 1440 a 320 px.
>
> No toca runtime, activos públicos ni producción. Los prototipos de
> `docs/sabik/design/prototypes/` están marcados NO PUBLICAR / NO RUNTIME y no
> se cargan desde ninguna página.
>
> Tres cambios de criterio respecto a las capturas previas: seis ejes
> ortogonales en lugar de veinte estados planos; «Parar» se divide en «Pausar
> Sabik» y «Empezar de nuevo»; energía 0 de las ondas es `animation: none`, no
> una animación lenta.
>
> Bloqueo de accesibilidad para la fase siguiente: el borde `#8492a5` da 2,96:1
> sobre el fondo real del panel y no cumple 3:1.
>
> Se mantiene en draft. No fusionar.

### Decisiones de coordinación

> - seis ejes visuales aprobados como proyección de la máquina S0;
> - no se añade una segunda fuente global de movimiento;
> - «Parar» se divide;
> - undo temporizado descartado;
> - ondas empiezan en `onstart`;
> - fallback solo sustituye `boundary`, nunca la ausencia de voz;
> - contraste confirmado;
> - reestructuración DOM requerida, conservando un único `<main>`;
> - mapa `S0 → deriveSabikPresentation → proyección` en
>   `STATE-VISUAL-MATRIX.md § Mapa con S0`, con los nombres de estado canónico
>   marcados como provisionales hasta que `sabik-machine.js` publique los suyos.
