# CIELO NOCTURNO · ORIÓN · STORYBOARD FUNCIONAL R01

Fecha: 2026-10-04
Owner funcional: Nexo
Dirección visual: Prisma
Autoridad HUMAN QA: María

Estado:
`NIGHT_SKY_ORION_STORYBOARD_R01_READY_FOR_VISUAL_DESIGN`

Decisiones ya fijadas:
- modelo inicial: `CURATED_OBSERVATION_PRESET`
- primer target: `ORION`
- patrón de descubrimiento:
  `ORIENT → OBSERVE PATTERN → LOCATE → IDENTIFY → REVEAL → DEPTH`

No runtime nuevo antes de HUMAN QA del storyboard.

---

# 1 · Qué enseña esta primera experiencia

Una sola idea:

> **Puedes orientarte en el cielo observando patrones reales de estrellas.**

No enseña todavía:
- catálogo de 88 constelaciones;
- nombres de estrellas al entrar;
- fichas;
- capas avanzadas;
- fecha/hora editable;
- ubicación;
- filtros;
- modo “mi cielo ahora”.

La persona debe descubrir primero un patrón visible.

---

# 2 · Modelo factual del primer prototipo

El prototipo usa:
`CURATED_OBSERVATION_PRESET`

Significa:
- lugar de observación definido por el producto;
- fecha/hora definidas por el producto;
- campo estelar reproducible;
- posiciones calculadas desde datos;
- el preset se declara en profundidad, no ocupa el first viewport.

Antes del runtime definitivo:
`ASTRONOMICAL_PRESET_VALUES_TBD_FROM_DATA`

No inventar:
- azimut;
- altura;
- fecha;
- lugar;
- visibilidad.

Esos valores se fijarán desde el dataset/cálculo astronómico y deben hacer que:
- Orión sea observable;
- el cinturón NO esté ya centrado al entrar;
- pueda localizarse con pocas acciones de orientación.

---

# 3 · Regla de reveal

Antes de la acción de la persona está prohibido mostrar:

- “Orión”;
- Orion;
- líneas completas de la constelación;
- figura artística;
- tarjeta;
- Betelgeuse/Rigel como pista nominal;
- una flecha que apunte a la respuesta.

Prompt permitido:

**Busca tres estrellas brillantes casi en línea.**

La información aparece porque la persona ha observado y localizado el patrón.

---

# 4 · FRAME 01 · ENTRY / CIELO SIN RESOLVER

Identificador:
`SKY_ORION_F01_ENTRY`

## Vista

Pantalla dominada por el cielo.

Parte inferior:
- horizonte nocturno Iris Green;
- sin función geográfica factual.

Parte principal:
- campo de estrellas data-backed;
- densidad realista;
- sin nombres;
- sin líneas de constelación;
- sin dibujos;
- sin tarjetas.

Orión:
- no debe estar ya resuelto;
- el cinturón no queda centrado;
- idealmente está fuera del campo inicial o en borde insuficiente para identificarlo.

## Copy

Título pequeño:
**Cielo nocturno**

Objetivo:
**Busca tres estrellas brillantes casi en línea.**

Nada más en el bloque principal.

## Interacción visible

Controles discretos:
- mirar izquierda;
- mirar derecha;
- mirar arriba;
- mirar abajo;
- zoom +;
- zoom −.

Touch:
- pan/drag permitido como comodidad.

Pero los botones de dirección existen para:
- teclado;
- touch sin precisión;
- REDUCED;
- NONE.

## Lo que debe entenderse

Sin manual:
1. esto es un cielo que puedo explorar;
2. tengo que buscar un patrón;
3. todavía no me han dado la respuesta.

---

# 5 · FRAME 02 · ORIENTING

Identificador:
`SKY_ORION_F02_ORIENTING`

La persona orienta el cielo.

## Consecuencia

El campo cambia de forma coherente.

Un pequeño indicador de orientación puede mostrar:
- dirección actual;
- no el nombre del objetivo.

No:
- “más cerca”;
- flechas hacia Orión;
- radar;
- vibración de premio;
- partículas.

## Movimiento

NORMAL:
- pan suave corto;
- sin inercia larga.

REDUCED:
- desplazamiento corto y amortiguado.

NONE:
- salto discreto al siguiente campo.

La causalidad es idéntica:
`ACTION → NEW_SKY_FIELD`

---

# 6 · FRAME 03 · OBSERVABLE SIGNAL

Identificador:
`SKY_ORION_F03_BELT_VISIBLE`

Tras orientar correctamente, el campo muestra por sus propios datos:

**tres estrellas brillantes casi alineadas.**

No se destacan automáticamente.

No aparece Orión.

La persona tiene que reconocer:
> “Eso se parece a lo que me pidieron.”

## Acción disponible

Una retícula central muy discreta o acción:
**Examinar esta zona**

Touch:
- tap sobre región/patrón.

Keyboard:
- orientar con flechas;
- Enter examina el centro.

No convertir estrellas individuales en cientos de botones.

---

# 7 · FRAME 04 · LOCATE / INFERENCE

Identificador:
`SKY_ORION_F04_PATTERN_LOCATED`

La persona examina correctamente la zona del cinturón.

Ahora sí aparece una consecuencia visual:

- las tres estrellas quedan marcadas;
- línea muy contenida une el patrón;
- resto de cielo permanece visible.

Primer reveal textual permitido:

**Has encontrado tres estrellas alineadas.**

Después, en segundo paso del mismo estado:

**Es el cinturón de Orión.**

Así la inferencia no ocurre antes que la evidencia.

## Si examina otra zona

No:
- “Incorrecto”;
- cruz roja;
- penalización.

Respuesta neutral:
**Aquí no aparece ese patrón. Sigue mirando.**

El cielo queda igual y puede continuar.

---

# 8 · FRAME 05 · REVEAL ORION

Identificador:
`SKY_ORION_F05_ORION_REVEALED`

Tras identificar el cinturón:

sobre el MISMO campo estelar:
- aparecen las líneas completas de la figura de Orión;
- se mantienen ancladas a las estrellas reales;
- nombre: **Orión**;
- las estrellas principales pueden recibir nombre de forma progresiva.

Información inicial breve:
- qué es;
- qué estrellas principales se ven;
- qué parte acaba de localizar la persona.

No tapar el cielo con una ficha grande.

Preferencia:
- bottom sheet móvil;
- panel lateral escritorio.

El cielo sigue siendo el producto principal.

---

# 9 · FRAME 06 · DEPTH OPTIONAL

Identificador:
`SKY_ORION_F06_DEPTH`

Acciones opcionales:

**Ver la constelación de cerca**
→ master R03 de Orión.

**Cómo reconocerla**
→ cinturón + relaciones visuales.

**Qué estrellas la forman**
→ información factual.

**Fuentes**
→ fuentes y procedencia de datos.

Posible profundidad posterior:
- región IAU vs figura de líneas;
- cultura/historia;
- objetos profundos relevantes;
- recorridos hacia otras constelaciones.

Cerrar Depth:
- vuelve al MISMO cielo;
- misma orientación;
- Orión permanece localizado.

---

# 10 · Rol visual de los assets

## Horizonte
Frame 01–05:
`BACKGROUND/HORIZON_REFERENCE`

No usarlo como foto geográfica real.

## 5.070 estrellas
Frames 01–05:
`CORE_SKY_DATA`

## Líneas de constelación
Solo Frame 04/05:
`INFERENCE_REVEAL_OVERLAY`

## Master R03 Orión
Solo Frame 06:
`DEPTH_ASSET`

## Atlas/guías
No first viewport.

Podrán alimentar:
- rutas guiadas;
- “cómo encontrar…”;
- profundidad editorial.

---

# 11 · Composición 390

Prioridad:
`SKY 70%+ → PROMPT → CONTROLS MINIMAL`

No panel lateral.

- cielo ocupa prácticamente toda la pantalla;
- horizonte en banda inferior;
- objetivo corto flotante/superior;
- controles de orientación pueden vivir en una barra inferior compacta;
- reveal en bottom sheet parcial;
- sheet nunca cubre todo el cielo salvo que la persona abra profundidad.

No meter:
- 88 cards;
- filtros;
- lista;
- dos columnas.

---

# 12 · Composición 1440

El cielo sigue dominando.

Puede existir:
- control/orientación discreto en borde;
- reveal factual lateral estrecho;
- mucho aire visual.

No convertir escritorio en dashboard astronómico.

---

# 13 · Accesibilidad

## Touch
- pan;
- botones dirección;
- tap zona;
- +/-.

## Keyboard
Un solo viewport de cielo focusable:
- flechas: orientar;
- +/-: zoom;
- Enter: examinar centro;
- Escape: cerrar reveal/depth.

No miles de tabstops.

## Screen reader

Antes del reveal:
**Campo de cielo nocturno. Dirección [valor del preset/runtime].**

Cuando el cinturón está en la región examinable:
**En el centro hay tres estrellas brillantes casi alineadas.**

Solo después de Enter:
**Has localizado el cinturón de Orión.**

## Reduced
- transición corta;
- sin inercia;
- overlays estables.

## None
- campos discretos;
- selección discreta;
- mismo patrón;
- mismo reveal.

---

# 14 · Error states

Si la persona examina zona incorrecta:

**Aquí no aparece ese patrón. Sigue mirando.**

No revelar dónde está.

Si hace mucho zoom:
- mantener orientación;
- permitir volver;
- no desbloquear información por zoom arbitrario.

Si sale del preset/campo:
- wrap o límites claros;
- sin pérdida de progreso.

---

# 15 · Condiciones de HUMAN QA

María debe poder mirar los seis frames y responder:

1. ¿Parece que estoy mirando un cielo, no una aplicación de fichas?
2. ¿Entiendo qué tengo que buscar?
3. ¿Entiendo cómo mirar en otra dirección?
4. ¿La pantalla no me revela Orión antes de localizarlo?
5. ¿Las tres estrellas funcionan como señal observable?
6. ¿El nombre aparece después de mi acción?
7. ¿El reveal explica lo que acabo de encontrar sin tapar el cielo?
8. ¿Me apetece buscar otra cosa después?

Si 1–7 no son PASS:
`NO_CODE`

Si 8 falla:
`PRODUCT_REWORK_BEFORE_SCALE`

---

# 16 · Orden de trabajo

1. Prisma hace SOLO los 6 frames.
2. 390 + 1440.
3. María HUMAN QA.
4. Solo después:
   - fijar preset astronómico real;
   - validar datos;
   - construir un runtime mínimo de Orión.
5. No segunda constelación antes de usar Orión.

Gate:
`NIGHT_SKY_ORION_STORYBOARD_HUMAN_QA_PASS`
