# PRISMA · REVISIÓN IRIS GREEN WEB R02 · IMÁGENES, SEMÁNTICA Y QA

Fecha: 2026-10-06

Base exacta:
`IRIS_GREEN_WEB_R02.zip`

SHA-256:
`f4e2dd62a4f92fcf1e4ea12d7bd7cb8d8496768ad6eab416bea1f47b4d0b4281`

Gate Prisma propuesto:
`WEB_R02_KEEP_NAVIGATION_CORE__ASSET_ASSIGNMENT_A11Y_ALT_AND_PRODUCT_STATUS_PATCH_REQUIRED`

No modifica producto, main ni producción.

---

# 1. Integridad

Prisma reextrajo el ZIP en una carpeta limpia.

`HASHES.txt`:
- 192 entradas;
- 192/192 archivos presentes;
- 0 mismatches.

Un primer hash-check dio un falso mismatch de `PRUEBAS.md` porque mi repetición local del test lo había reescrito en la copia de revisión. Se descartó esa evidencia y se volvió a extraer limpio antes de verificar.

El ZIP coincide con el SHA comunicado.

---

# 2. Qué conservar

R02 supone una mejora clara del shell navegable.

KEEP:
- seis áreas de producto y Home fuera de esa lista;
- fuente estructural `datos/sitio.json`;
- ES/EN simétrico;
- rutas internas reales;
- estados no disponibles sin enlaces falsos;
- búsqueda construida desde contenido real;
- filtros funcionales;
- menú móvil con fondo inert + aria-hidden;
- foco visible;
- Ajustes NORMAL/REDUCED/NONE persistentes;
- reflow;
- estado honesto de Sabik;
- separación Juegos / Recursos;
- Descubrimiento / Creación / Espacio tranquilo diferenciados;
- provenance manifest para los nuevos visuales;
- no inventar Rincón/Pecera/Ritmo cuando el arte no existe.

No recomiendo volver al shell R01.

---

# 3. Los assets existen de verdad

Prisma contrastó el commit fuente:
`4893d3cf9772e58bdc1b5f505d33965cbfea007a`

y el main actual:
`33e9cf299764ebd1f48611ad68cddc3045f54390`.

Para los assets comprobados:
- `img/vineta-mapa.webp`;
- `img/vineta-hoja.webp`;
- `img/intereses/constelaciones/04-orion.webp`;
- `img/taller-portada.webp`;
- `assets/mulberry/hablar.svg`;

los blobs siguen siendo los mismos en main.

Por tanto no son archivos inventados durante R02.

Esto NO resuelve la siguiente cuestión:
**existencia/procedencia ≠ aprobación para representar un área concreta**.

---

# 4. P1 · falta un gate de asignación visual

`PROCEDENCIA.json` documenta de dónde viene el archivo.

No documenta de forma homogénea:
- para qué superficie está aprobado;
- quién aprobó esa asignación;
- si es canon;
- si es una reutilización provisional;
- si sólo es mood/decoración;
- si no debe usarse.

Ejemplos:

## Información
`vineta-mapa.webp` existe y es coherente como metáfora visual.

Pero “estaba en el repo” no demuestra:
`APPROVED_AS_INFORMATION_AREA_ART`.

## Espacio tranquilo
`vineta-hoja.webp` es una ilustración real existente.

No es:
- El Rincón;
- la Pecera;
- una escena de Espacio tranquilo.

Es una **ilustración de ambiente/decoración**.

Debe registrarse así, no como “imagen del Rincón”.

## Creación
`taller-portada.webp` y las seis mesas están alineadas con el contenido.

La página ya evita asignar una de las seis mesas a Ritmo, lo cual es correcto.

Pero las mesas deben distinguir:
`EXISTING_DESIGN_ASSET`
de
`CONNECTED_EXPERIENCE`.

## Construcción
La imagen viene del storyboard R02 F01 aprobado.

Es un asset aprobado de diseño, pero NO una captura de runtime.

La documentación R02 llega a llamarla “escena real”.

Eso debe corregirse a:
- `storyboard / vista de diseño aprobada`;
- `runtime no conectado`.

El propio HTML de `construccion.html` está mejor redactado que el README: dice que la escena es la aprobada y que el juego aún no está conectado.

### Registry recomendado

Añadir un registro de assets:

```json
{
  "assetId": "...",
  "sourcePath": "...",
  "sha256": "...",
  "visualSubject": "...",
  "role": "product|mood|decorative|preview|qa",
  "assignmentStatus": "approved|provisional|blocked|do_not_use",
  "approvedFor": ["home:creacion"],
  "approvalGate": "...",
  "alt": {"es":"...", "en":"..."},
  "focalPoint": {"x":0.5,"y":0.5},
  "licenseId": "...",
  "notes": "..."
}
```

Esto evita que el nombre del archivo se convierta en fuente de verdad.

---

# 5. P1 · el hallazgo vineta-lavanda exige un sistema, no una nota

R02 detectó correctamente:
`img/vineta-lavanda.webp` = dos dados, no lavanda.

También detectó:
`img/rincon-tranquilo/*.svg` = placeholders con “Open sea” / “Moon jellies”.

No basta con “no usarlos”.

Aprendizaje:
- filename no es semántica;
- repo presence no es aprobación;
- alt automático no puede salir del filename.

Añadir estados:
- `SUBJECT_VERIFIED`;
- `PLACEHOLDER_DO_NOT_USE`;
- `NAME_CONTENT_MISMATCH`.

Añadir test:
`ASSET_REGISTRY_HAS_VERIFIED_SUBJECT_BEFORE_PUBLIC_USE`.

---

# 6. P1 A11Y · el oracle “ninguna imagen sin alt” es incorrecto

El test actual falla cualquier imagen cuyo alt esté vacío.

Eso no es un buen oracle universal.

WCAG distingue:
- imágenes informativas/funcionales → alternativa útil;
- imágenes decorativas/redundantes → `alt=""`.

En Home las seis imágenes están DENTRO de enlaces que ya contienen:
- título;
- verbo;
- descripción.

Ejemplo Creación:
el nombre accesible del enlace incorpora potencialmente:
- un alt largo describiendo seis personas y actividades;
- “Creación”;
- “Crear”;
- la descripción de la tarjeta.

Eso puede aumentar mucho la verbosidad sin añadir funcionalidad.

### Corrección

Clasificar cada imagen:

`informative | functional | decorative/redundant`

Y testar según rol:

- decorative/redundant → `alt=""`;
- informative → alt conciso con la información no presente en texto;
- functional → alt describe función/destino si no hay texto equivalente.

No usar:
`ALT_NON_EMPTY_FOR_ALL_IMAGES`.

Usar:
`ALT_APPROPRIATE_FOR_IMAGE_ROLE`.

### Caso Descubrimiento / Orión

Además hay una decisión de producto pendiente:
si Cielo no debe revelar Orión antes del primer hallazgo, el alt actual:

“la constelación de Orión…”

es un spoiler explícito para usuarios no visuales.

La imagen visible también dibuja la figura.

Esto NO debe resolverse dentro de la web por iniciativa de Prisma/Claude.
Debe seguir la decisión canónica Cielo:
- si “Empezar por Orión” queda aprobado → puede nombrarse;
- si se vuelve a onboarding no-spoiler → cambiar imagen/alt.

Paridad de spoiler visual/no visual obligatoria.

---

# 7. P1 · imagen actual de Construcción puede quedar obsoleta

La web usa el storyboard 2D aprobado.

Mientras el runtime 3D de El Vado siga en revisión, es razonable conservar el último asset aprobado.

Pero debe estar registrado como:
`APPROVED_DESIGN_PREVIEW`,
no como:
`CURRENT_RUNTIME_SCREENSHOT`.

Cuando el 3D obtenga gate visual/HUMAN QA:
- crear thumbnail del runtime aprobado;
- actualizar web;
- no mezclar storyboard histórico y estado actual.

---

# 8. P1 · “las seis áreas tienen imagen real” necesita precisión

Sí:
cada puerta del Home tiene un fichero real.

No:
cada fichero representa necesariamente una experiencia real conectada.

Terminología recomendada:

- “asset existente”;
- “ilustración de área”;
- “preview de diseño”;
- “captura de runtime”;
- “arte canónico de experiencia”.

Evitar usar “imagen real” para todas esas categorías.

---

# 9. P2 · rendimiento de imágenes

Escaneo estático del paquete:

- 96 tags `<img>` en ES+EN;
- `loading="lazy"`: 0;
- `decoding="async"`: 0.

Creación carga:
- hero 1600×900;
- seis WebP 1448×1086;

todos de inmediato.

Sólo esas siete imágenes ocupan aproximadamente 2,9 MB de archivo.

En móvil varias están bajo el fold.

### Mejora

- hero/foto inicial: carga normal / fetchpriority si se justifica;
- tarjetas bajo fold: `loading="lazy"`, `decoding="async"`;
- generar derivados de thumbnail para las puertas del Home, conservando el master intacto;
- srcset/sizes si el sistema de build lo permite;
- mantener width/height para evitar layout shift.

Esto no cambia el arte aprobado.

---

# 10. P2 · consistencia visual de las seis puertas

Los seis assets mezclan:
- acuarela;
- pictograma plano;
- screenshot de juego;
- carta celeste;
- ilustración detallada de taller;
- hoja aislada.

No es necesariamente un error: las áreas son distintas.

Pero los assets complejos:
- Construcción;
- Creación;

pierden mucha información en el pequeño cuadrado móvil.

En `index_320.png`, el taller de seis personas se convierte en una miniatura difícil de leer.

### Mejora sin retocar masters

- derivados/crops aprobados de thumbnail;
- focalPoint por asset;
- mismo contrato de framing;
- no forzar escenas complejas a funcionar como iconos.

---

# 11. P1/P2 · Mulberry: licencia correcta, wording incorrecto

El proyecto Mulberry declara actualmente los símbolos bajo CC BY-SA 4.0 y pide atribución clara al redistribuirlos.

La página de Pictogramas incluye una atribución visible y el paquete incluye:
`LICENCIA-MULBERRY.txt`.

Eso es una base razonable.

Pero el README dice:
“el texto completo viaja en el paquete”.

No es cierto.

`LICENCIA-MULBERRY.txt` contiene:
- copyright;
- nombre de licencia;
- URL a CC BY-SA 4.0.

No contiene el legal code completo.

Corregir wording a:
“el aviso de licencia y el enlace al texto completo viajan en el paquete”.

No considero que esto pruebe por sí solo incumplimiento de la licencia.
Lex debe cerrar aplicabilidad y obligaciones de redistribución/derivados.

Fuente oficial Mulberry:
CC BY-SA 4.0, atribución clara y ShareAlike para símbolos derivados.

---

# 12. P1 · procedencia ≠ cadena completa de derechos

`PROCEDENCIA.json` dice:

`resto = material propio de Iris Green, del repositorio de la web`.

Eso demuestra dónde se encontró el archivo.

No necesariamente:
- quién lo creó;
- cómo se creó;
- qué términos aplican;
- si es una generación anterior;
- si su asignación está aprobada.

Especialmente para arte generado/encargado:
repo commit ≠ cadena de derechos.

Añadir por asset, cuando corresponda:
- author/source;
- creation method;
- license/rights;
- approval gate;
- original master id.

No es trabajo de Prisma decidir conclusión jurídica; Lex.

---

# 13. P1 · “WEB COMPLETA” puede inflar el estado del producto

El propio README declara pendientes:
- contenido real;
- motores de Construcción/Cielo/Peces/Ritmo/Rincón/Pecera;
- Sabik;
- reparto Plus;
- pagos;
- lector real.

Por tanto el artifact es mejor descrito como:
`WEB_NAVIGABLE_R02`
o
`PRODUCT_SHELL_R02`.

“WEB COMPLETA” puede confundirse con:
“producto completo”.

Gate actual `READY_FOR_REVIEW` sí es honesto.

Recomiendo alinear nombre del artifact con ese alcance.

---

# 14. P1 · Plus visible antes de decisión

Juegos/Descubrimiento/Creación muestran:
- Para todos;
- Plus;
- “más para explorar/materiales…”.

Después aclaran:
“todavía no está decidido”.

Esto es honesto, pero el simple hecho de mostrar Plus ya crea una expectativa comercial.

Si el reparto/tier todavía no está aprobado por:
- producto;
- Cifra;
- Lex;

considerar:
- ocultar estas secciones del shell público;
- mantenerlas sólo en prototipo interno;
- o etiquetar explícitamente “propuesta sin decidir”.

No convertir una arquitectura comercial futura en promesa pública.

---

# 15. P1 · promesas de privacidad/producción

Footer:
`Sin publicidad y sin seguimiento.`

En este ZIP:
- no hay peticiones externas;
- la afirmación es compatible con el prototipo.

Pero la frase se convierte en promesa de producto cuando se integra en producción.

Gate recomendado:
`PRODUCTION_PRIVACY_CLAIMS_REVALIDATED`

antes de publicar:
- analytics;
- logs;
- Sabik;
- pagos;
- embeds;
- CDN;
- consent/cookies;
- monitoring.

Lo mismo para:
“no se envía a ninguna parte”
cuando Creación/Juegos se conecten.

---

# 16. Sobre las 47 pruebas

El paquete aporta:
`47/47` del autor, Chromium 141.

Prisma inició repetición independiente con Chrome del equipo.

Se reprodujeron correctamente los primeros bloques:
- 56 páginas sin errores;
- fuentes;
- enlaces;
- href;
- imágenes;
- navegación;
- idiomas;
- filtros;
- buscador;
- query malformada.

La copia temporal del harness se detuvo después por **encoding de consola de Windows** al intentar imprimir el carácter `→`.

No es un fallo del producto.

No declaro por ello:
`47/47 independently reproduced`.

Conservo:
`AUTHOR_47_47`
+
`PRISMA_PARTIAL_BROWSER_REPRODUCTION`.

Hallazgos de oráculo que los 47 no cubren:
- alt apropiado según rol;
- correspondencia semántica asset↔área;
- approval gate de asset;
- visual spoiler parity;
- performance/lazy images;
- provenance/rights completeness;
- stale preview vs current runtime.

---

# 17. Prioridad de patch

## Antes de Axioma/HUMAN QA del shell
1. asset assignment registry;
2. corregir alt oracle y Home alts redundantes;
3. resolver decisión Orión/spoiler;
4. etiquetar Construcción como design preview;
5. corregir wording de Mulberry;
6. distinguir leaf mood art de Rincón/Pecera;
7. ocultar/etiquetar Plus si producto aún no lo decide.

## Antes de integración pública
8. lazy/responsive images;
9. rights/provenance per asset;
10. privacy claims revalidated;
11. actualizar thumbnails cuando runtimes obtengan gates.

## No reabrir
- mapa de navegación;
- búsqueda;
- filtros;
- ES/EN;
- menú;
- reflow;
- ajuste de movimiento;
- estados honestos de “todavía no”.

---

# 18. Veredicto

R02 es un **KEEP fuerte del shell**.

Las imágenes mejoran mucho la legibilidad y reducen la sensación de maqueta vacía.

El siguiente salto no es “buscar más imágenes”.

Es convertir el uso visual en un sistema gobernado:

`ASSET_EXISTS → SUBJECT_VERIFIED → RIGHTS_KNOWN → ASSIGNMENT_APPROVED → ROLE/ALT_CORRECT → PRODUCT_STATE_CURRENT`

Gate Prisma:

`WEB_R02_KEEP_NAVIGATION_CORE__ASSET_ASSIGNMENT_A11Y_ALT_AND_PRODUCT_STATUS_PATCH_REQUIRED`

`NO MAIN · NO PUBLIC DEPLOY`
