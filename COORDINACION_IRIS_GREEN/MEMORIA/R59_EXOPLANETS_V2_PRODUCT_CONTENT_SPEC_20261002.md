# R59 · INTERÉS 03 · EXOPLANETAS V2 · PRODUCT + CONTENT SPEC

Fecha: 02/10/2026  
Owner: Senda · R59  
Scope: producto, contenido y reuse-first. Sin runtime, sin imágenes, sin main.  
Estado: INTEREST_03_EXOPLANETS_V2_PRODUCT_CONTENT_AND_REUSE_PASS

## 1. Decisión de producto

El Exoplanetas actual pasa a:

DONOR_RICH_DATA_AND_EDITORIAL__FIRST_EXPERIENCE_REWORK

Dirección V2:

EVIDENCE_FIRST → CHOOSE_A_WORLD → WHAT_WE_KNOW / WHAT_WE_DO_NOT_KNOW → DEPTH_ON_DEMAND

Exoplanetas V2 no empieza con un catálogo de 6.366 objetos ni con un mapa 3D global. Empieza con una pregunta humana: cómo podemos saber que existe un planeta que casi nunca vemos directamente.

## 2. Pregunta central

ES: **¿Cómo sabemos que existe un planeta que casi nunca podemos ver directamente?**

EN: **How do we know a planet exists when we can almost never see it directly?**

## 3. Acción humana principal

Elegir una señal de detección o un mundo representativo → ver qué observación permitió detectarlo → distinguir qué sabemos, qué se calcula y qué todavía no sabemos → comparar con otro caso.

Cinco pistas principales para el primer nivel:
- tránsito;
- velocidad radial;
- microlente gravitatoria;
- imagen directa;
- tiempo de un púlsar.

No se intenta representar los 11 métodos simultáneamente en el primer viewport.

## 4. Primer viewport

Debe contener solo:

1. título + pregunta central;
2. una escena de evidencia, no un mapa de miles de estrellas;
3. cinco controles de método/pista;
4. un mundo seleccionado;
5. selector compacto de seis mundos;
6. dos bloques breves:
   - Qué sabemos / What we know;
   - Qué no sabemos aquí / What we do not know here;
7. línea de procedencia:
   - ES: “Datos locales · NASA Exoplanet Archive · snapshot 24/09/2026”;
   - EN: “Local data · NASA Exoplanet Archive · snapshot 24 Sep 2026”;
8. acción de profundidad:
   - ES: “Explorar más exoplanetas”;
   - EN: “Explore more exoplanets”.

Selección inicial recomendada: **51 Peg b**.

## 5. Subset inicial curado

Seis mundos. Cubren cinco técnicas de detección y muestran que no todos los planetas tienen el mismo conjunto de datos.

### 51 Peg b
- Sistema/estrella: 51 Peg.
- Método: velocidad radial.
- Descubrimiento: 1995.
- Periodo: 4,2308 días.
- Distancia orbital del snapshot: 0,052 ua.
- Radio compuesto del archivo: 14,1 radios terrestres.
- Masa compuesta del archivo: 193,9 masas terrestres.
- Temperatura de equilibrio del archivo: 1329 K.
- ES: “Un planeta gigante muy cerca de su estrella. Se detectó por el pequeño movimiento que induce en la estrella.”
- EN: “A giant planet very close to its star. It was detected through the small motion it induces in the star.”

### TRAPPIST-1 e
- Sistema/estrella: TRAPPIST-1.
- Método: tránsito.
- Descubrimiento: 2017.
- Periodo: 6,10101 días.
- Distancia orbital del snapshot: 0,02925 ua.
- Radio compuesto: 0,92 radios terrestres.
- Masa compuesta: 0,692 masas terrestres.
- Temperatura de equilibrio: 249,7 K.
- ES: “Un mundo de tamaño parecido al de la Tierra dentro de un sistema compacto. Lo detectamos cuando pasa por delante de su estrella.”
- EN: “An Earth-sized world in a compact planetary system. We detect it when it passes in front of its star.”
- Cautela: temperatura de equilibrio ≠ temperatura real de la superficie y tamaño parecido ≠ habitabilidad.

### HR 8799 b
- Sistema/estrella: HR 8799.
- Método: imagen directa.
- Descubrimiento: 2008.
- Separación orbital compuesta del snapshot: 68 ua.
- Radio compuesto: 13 radios terrestres.
- Masa compuesta: 2000 masas terrestres.
- ES: “Un planeta gigante en una órbita muy amplia. Es uno de los casos en los que el planeta puede separarse visualmente de la luz de su estrella.”
- EN: “A giant planet on a very wide orbit. It is one of the cases where the planet can be visually separated from the glare of its star.”
- No usar una recreación como si fuera la observación real.

### PSR B1257+12 c
- Sistema/estrella: PSR B1257+12.
- Método: tiempo de un púlsar.
- Descubrimiento: 1992.
- Periodo: 66,5419 días.
- Distancia orbital: 0,36 ua.
- Radio compuesto: 1,91 radios terrestres.
- Masa compuesta: 4,3 masas terrestres.
- Temperatura: no disponible en el snapshot local.
- ES: “Orbita un púlsar. Su presencia se deduce por cambios extremadamente regulares en la llegada de los pulsos.”
- EN: “It orbits a pulsar. Its presence is inferred from tiny changes in the otherwise very regular arrival times of the pulses.”

### OGLE-2003-BLG-235L b
- Sistema/estrella: OGLE-2003-BLG-235L.
- Método: microlente gravitatoria.
- Descubrimiento: 2004.
- Distancia orbital compuesta: 4,3 ua.
- Radio compuesto: 13,2 radios terrestres.
- Masa compuesta: 830 masas terrestres.
- Periodo: no disponible en el snapshot local.
- Temperatura: no disponible en el snapshot local.
- ES: “Se descubrió durante un episodio de lente gravitatoria. Este caso enseña que algunos métodos dejan muchos campos sin medir.”
- EN: “It was discovered during a gravitational microlensing event. This case shows that some methods leave many properties unmeasured.”

### Proxima Cen b
- Sistema/estrella: Proxima Cen.
- Método: velocidad radial.
- Descubrimiento: 2016.
- Periodo: 11,1846 días.
- Distancia orbital: 0,04848 ua.
- Masa compuesta: 1,055 masas terrestres.
- Radio compuesto del PSCompPars local: 1,02 radios terrestres.
- Distancia de la estrella: 1,3012 pc ≈ 4,24 años luz.
- ES: “Orbita la estrella más cercana al Sol. Es un buen caso para separar cercanía de certeza: estar cerca no significa que conozcamos todos sus detalles.”
- EN: “It orbits the nearest star to the Sun. It is a useful case for separating proximity from certainty: being nearby does not mean we know every detail.”

## 6. Qué información real aparece al entrar

Por defecto, solo del mundo seleccionado:
- nombre;
- estrella/sistema;
- método de detección;
- año de descubrimiento;
- uno o dos valores útiles para ese caso;
- qué dato falta, si falta;
- snapshot y fuente.

No mostrar una parrilla de diez cifras por planeta.

## 7. Qué queda en depth

KEEP bajo demanda:
- los 11 métodos de detección;
- conteos por método;
- año a año;
- récords;
- “parecidos a la Tierra” con su cautela explícita;
- sistemas editoriales actuales;
- descubrimientos desde España;
- nombres propios;
- estrellas anfitrionas visibles a simple vista;
- catálogo completo de 6.366 del snapshot;
- página de lista ES/EN;
- datos descargables;
- fuentes y metodología;
- mapa 3D global, si más adelante aporta tras acción explícita.

Mi colección/localStorage no forma parte del V2 mínimo.

## 8. Qué NO debe cargar al inicio

No eager:
- exoplanetas.json completo de 910.859 bytes;
- cielo-fondo.json de 411.894 bytes;
- 6.366 planetas como objetos interactivos;
- 4.775 estrellas anfitrionas;
- bundle 3D de 566.030 bytes;
- página estática completa de ~1,2 MB;
- tablas globales;
- API/TAP live.

El primer nivel puede usar un subset pequeño, versionado y local de los seis mundos.

## 9. REAL_DATA / CALCULATION / SIMULATION

### REAL_DATA
Datos del snapshot local NASA Exoplanet Archive PSCompPars de 24/09/2026:
- nombre del planeta;
- host;
- método;
- año e instalación de descubrimiento;
- periodo;
- semieje/distancia orbital;
- radio;
- masa;
- excentricidad;
- temperatura de equilibrio;
- insolación;
- coordenadas/distancia estelar cuando existan.

Importante: PSCompPars es una tabla compuesta. El propio archivo de NASA advierte que una fila puede mezclar parámetros de distintas referencias y contener valores calculados.

### CALCULATION
- parsec → años luz;
- Kelvin → Celsius, solo si aporta;
- comparaciones relativas;
- escalas logarítmicas;
- heurísticas como “parecido en tamaño y luz”;
- zona templada aproximada.

Toda transformación se etiqueta como cálculo. La temperatura de equilibrio nunca se presenta como temperatura superficial.

### SIMULATION
Cualquier animación pedagógica de:
- caída de brillo de tránsito;
- bamboleo por velocidad radial;
- amplificación por microlente;
- pulsos;
- órbita;
- separación para imagen directa.

Una simulación del método NO es la curva o imagen observada del planeta seleccionado, salvo que se incorpore una observación real con su propia fuente.

## 10. Tratamiento de incertidumbre

Reglas V2:
1. cero no sustituye a “sin dato”;
2. no completar huecos con estimaciones inventadas;
3. no mostrar más precisión que la necesaria para comprender;
4. “radio/masa/temperatura” del PSCompPars se describen como valores compuestos del archivo;
5. la temperatura de equilibrio es un modelo, no clima/superficie;
6. “parecido a la Tierra” no equivale a habitable;
7. el snapshot compacto actual NO conserva columnas err1/err2 ni referencia por parámetro;
8. por tanto el primer V2 no inventa barras de error;
9. si se necesitan intervalos en una fase posterior, crear un subset versionado que conserve columnas de incertidumbre y referencias del Archive; no depender del live del navegador.

La documentación NASA de PS/PSCompPars mantiene columnas de incertidumbre positivas/negativas y recomienda cautela con PSCompPars para parámetros de un planeta individual.

## 11. Snapshot vs Archive actual

Snapshot local:
- fecha: 24/09/2026;
- confirmados: 6.366;
- estrellas anfitrionas: 4.775.

NASA Exoplanet Archive observado/verificado:
- 01/10/2026: 6.375 confirmados.

Delta: +9.

Decisión:
SNAPSHOT_DELTA_IS_NOT_AN_ERROR.

No se cambia el titular local a 6.375 sin regenerar el dataset correspondiente. Cuando se muestra el catálogo local, dice 6.366 + 24/09/2026.

## 12. Child-safe

SAFE_BY_DEFAULT:
- 0 geolocalización;
- 0 cuenta;
- 0 búsqueda externa en la experiencia inicial;
- 0 autoplay;
- 0 streaks/recompensas;
- 0 lenguaje de “planeta habitable” sin evidencia;
- 0 afirmaciones de vida;
- 0 inferencia de edad/diagnóstico;
- 0 recopilación necesaria para explorar.

## 13. Teclado / touch / pointer

- controles nativos;
- target Iris >=44 px;
- Tab no recorre miles de estrellas;
- seis mundos como lista/selector DOM;
- anterior/siguiente;
- Enter/Space seleccionan;
- pointer/touch equivalentes;
- ningún drag es obligatorio;
- reset/volver claro;
- ficha no oculta foco;
- alternativa textual completa a la escena.

## 14. NORMAL / REDUCED / NONE

NORMAL:
- movimiento solo después de acción;
- puede animar una señal breve y controlable.

REDUCED:
- sin viajes de cámara;
- señal en pasos/fades discretos;
- mismo resultado factual.

NONE:
- diagrama estático antes/después;
- texto explica la señal;
- mismas selecciones y datos.

Ningún modo pierde contenido.

## 15. 320 / 390

- una evidencia + un mundo focal;
- selector compacto de métodos;
- lista/tira de seis mundos;
- ficha debajo de la escena;
- sin tabla horizontal inicial;
- sin mapa global;
- profundidad tabular en región etiquetada solo cuando se pide.

## 16. HUMAN QA

PASS si una persona puede:
1. explicar que casi todos los exoplanetas se detectan indirectamente;
2. distinguir tránsito, velocidad radial e imagen directa;
3. seleccionar al menos tres mundos y volver;
4. entender que “sin dato” no significa cero;
5. distinguir dato del snapshot, cálculo y simulación;
6. entender que 6.366 (24/09) y 6.375 (01/10) pueden coexistir sin contradicción;
7. no interpretar temperatura de equilibrio como clima;
8. no interpretar “parecido a la Tierra” como habitable;
9. usar teclado y touch;
10. usar 320/390;
11. evitar movimiento sin perder información;
12. llegar al catálogo completo solo cuando lo pide.

FAIL si:
- el primer viewport parece catálogo/dashboard;
- 6.366 puntos dominan la experiencia;
- una simulación parece observación real;
- se rellenan datos ausentes;
- el V2 necesita red NASA para funcionar;
- se confunde cercanía/tamaño con habitabilidad.

## 17. Assets

Resultado:
**NO_NEW_ASSETS_REQUIRED**

Para el V2 mínimo, la evidencia se puede representar con SVG/Canvas/DOM first-party y el contenido local.

El único raster específico localizado:
img/intereses/exoplanetas/tarjeta.webp

Estado:
PROVENANCE_UNKNOWN_FOR_V2_REUSE.

Se añadió junto al paquete de Exoplanetas el 24/09/2026, pero no existe en el donor auditado un manifest individual de inputs/licencia. No es necesario para V2 y no se hereda automáticamente.

## 18. Marcador

INTEREST_03_EXOPLANETS_V2_PRODUCT_CONTENT_AND_REUSE_PASS

STOP después de registrar MEMORIA + CONTROL/evidencia + #323.
