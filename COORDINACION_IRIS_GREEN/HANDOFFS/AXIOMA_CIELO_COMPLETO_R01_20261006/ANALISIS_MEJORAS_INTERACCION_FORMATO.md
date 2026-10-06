# AXIOMA · CIELO NOCTURNO COMPLETO R01 · ANÁLISIS + INVESTIGACIÓN + MEJORAS

Fecha: 2026-10-06

Estado:
`AXIOMA_SKY_COMPLETE_R01_KEEP_DATA_ENGINE__INTERACTION_FORMAT_REWORK_BEFORE_SCALE`

## 1 · Evidencia exacta revisada

Paquete:
`DESCUBRIMIENTO_CIELO_COMPLETO_R01(2).zip`

SHA-256:
`eaa15fcc98157f4d7f26c874a74d9d50bc8bc63061ca81067c56b66f01512bd6`

Integridad:
- ZIP test PASS;
- 320/320 hashes de SHA256SUMS.txt verificados;
- 88 SVG;
- 88 PNG review;
- 88 fichas;
- 12 campos;
- banco del autor 40/40.

Se revisaron directamente:
- README;
- NOTAS_DE_PRUEBAS;
- config/motor/interfaz;
- índice y los 12 campos;
- fichas representativas;
- banco y resultados;
- capturas 320/390/1440.

## 2 · KEEP · no rehacería

### Datos/cobertura
- 88/88 con ficha, SVG, PNG y experiencia;
- datos ausentes quedan null con motivo;
- separación región IAU / figura Stellarium;
- lazy load de campos;
- notebook sin spoilers.

### Motor
- click/tap directo sobre zona;
- drag separado de click;
- rueda solo con escena enfocada;
- teclado físico equivalente;
- selección no recentra;
- reveal conserva cámara;
- reposo sin loop;
- forced-colors y motion modes.

### Proyección
KEEP stereographic para los campos amplios.

La decisión de abandonar gnomónica es defendible: la gnomónica no es conforme y está limitada a menos de un cuarto de circunferencia desde el centro; en astronomía las proyecciones esféricas forman parte de las convenciones WCS. Para reconocimiento de forma local, conservar ángulos es preferible a la deformación periférica de una gnomónica amplia.

Fuentes:
- Calabretta & Greisen, A&A 395 (2002), proyecciones celestes FITS;
- NASA FITS WCS;
- PROJ / MathWorld sobre gnomónica y estereográfica.

## 3 · P0 · no escalar el formato actual tal cual

### P0-01 · Los 12 campos deberían ser chunks técnicos, no la metáfora principal

La portada expone:
`Campo 01 · Cielo del norte`, `Campo 02 · Norte medio`, etc.

Eso refleja el particionado k-means del dataset, no cómo una persona aprende o recuerda el cielo.

Recomendación:
`ONE_SKY_EXPERIENCE__FIELDS_AS_HIDDEN_STREAMING_TILES`

La persona debería percibir un cielo continuo.

Los 12 campos pueden seguir existiendo para:
- carga perezosa;
- caché;
- spatial indexing;
- cobertura QA.

Pero no como 12 destinos técnicos obligatorios.

### P0-02 · Hacer transición entre campos sin borde artificial

Actualmente la cámara se clampa al límite del campo y anuncia que se alcanzó el borde.

El cielo real no tiene ese borde.

Mejora:
- precargar campo vecino al acercarse al borde;
- conservar dirección/FOV;
- reproyectar los datos vecinos en la proyección de cámara actual;
- transición invisible o muy breve.

Importante: como cada campo fue preproyectado con su propio centro estereográfico, NO conviene pegar sus u/v directamente. Para un cielo continuo, mantener RA/Dec o vector unitario como fuente runtime y proyectar alrededor del centro actual.

Alternativa de datos para escalado: HEALPix ofrece partición jerárquica de la esfera, búsquedas locales y multirresolución. No es obligatorio adoptarlo, pero es mejor modelo de tiles celestes que exponer k-means al usuario.

### P0-03 · El radio mínimo de examen es demasiado permisivo en móvil

Config actual:
`ZONA.fraccion=0.19 · min_px=88 · max_px=150`.

En móvil el mínimo de 88 px domina.

Axioma ejecutó un probe matemático con:
- coordenadas proyectadas entregadas;
- fórmula exacta de `examinar()`;
- zoom inicial 1.35;
- regla 30% / min3-max5 / ventaja1.5.

Indicador aproximado de aceptación de click aleatorio:
- 320, escena ~296×352: media ~87.9%, mediana ~88.3%;
- 390, escena ~366×523: media ~69.3%;
- 1440, escena ~1408×558: media ~11.1%.

No significa que cada aceptación sea astronómicamente falsa. Sí demuestra que C18 prueba ALCANZABILIDAD, no ESPECIFICIDAD, y que en móvil el descubrimiento puede degradarse a tanteo.

Corrección:
- definir zona en ángulo celeste, no con `min_px` fijo;
- radio adaptado al FOV/zoom;
- firma reconocible por constelación/asterismo;
- test de blind clicks + matriz de confusión.

Nuevos oráculos:
`SKY_DISCOVERY_SPECIFICITY_ORACLE`
`CONSTELLATION_CONFUSION_MATRIX`.

### P0-04 · Las pistas se repiten demasiado

Análisis de las 88 pistas:
- sólo 10 familias normalizadas de frase;
- 31/88 usan esencialmente:
  `Busca una estrella clara de magnitud N con un trazo de puntos más débiles a su lado.`
- hay pistas EXACTAMENTE duplicadas dentro del mismo campo;
- en campo 12, Men/Cae/Ret comparten la misma pista exacta.

Esto es factual pero no necesariamente memorable ni divertido.

Recomendación:
`DATA_DERIVED_CLUES + EDITORIAL_OBSERVING_PATHS`.

Las pistas automáticas pueden quedarse como fallback, pero el recorrido principal debería usar landmarks observacionales documentados:
- asterismos;
- estrellas ancla;
- relaciones espaciales;
- Vía Láctea;
- vecinos ya descubiertos;
- forma verdaderamente distintiva.

NASA recomienda usar asterismos y estrellas brillantes como landmarks para orientarse. Orión ya funciona precisamente así con su cinturón.

### P0-05 · LOCATE → REVEAL debe ser consistente para las 88

En `examinar()`/interfaz:
- Orión especial pasa a `localizada` y espera `Revelar`;
- las otras 87 pasan directamente a `revelada` y quedan descubiertas.

Eso colapsa:
`LOCATE → REVEAL`
en una sola acción para casi todo el catálogo.

Recomendación:
para TODAS:
1. LOCATE: reconocer zona/patrón;
2. confirmación visual neutra: marcar estrellas ancla, sin nombre/figura completa;
3. REVEAL deliberado: `Ver la figura`;
4. DEPTH: `Saber más`.

El gesto de descubrir gana peso y no parece una máquina de revelar nombres al click.

### P0-06 · Evitar acumulación de 14 figuras en el mismo campo

`dibujar()` conserva todas las figuras reveladas.

Campo 11 contiene 14 constelaciones.

Tras muchos hallazgos, el cielo puede convertirse en atlas de líneas y perder la experiencia de observar estrellas.

Recomendación:
- última figura revelada visible temporalmente;
- figuras anteriores desvanecidas/ocultas por defecto;
- capa opcional `Mis hallazgos`;
- al seleccionar una del cuaderno, mostrar solo esa o sus vecinas.

`CLEAN_SKY_IS_DEFAULT`.

## 4 · P1 · hacer la experiencia más intuitiva

### 4.1 Portada: entrar al cielo, no elegir un número técnico

Formato recomendado:

**Cielo nocturno**
`Explorar libremente`
`Dame una pista`
`Cuaderno`

Debajo, opcional:
`Rutas para empezar`
- Orión y el cielo de invierno;
- Osa Mayor y el norte;
- Triángulo de Verano;
- Cruz del Sur;
- Vía Láctea.

Los 12 chunks desaparecen de la navegación primaria.

### 4.2 Pista opcional, no objetivo obligatorio

Actualmente `elegirObjetivo()` elige la primera pendiente por orden de campo.

Eso puede convertir la exploración en checklist.

Recomendación:
- free exploration por defecto;
- botón `Dame una pista`;
- la pista se elige según lo que esté visible/cerca;
- si la persona descubre otra constelación, no se trata como desvío.

### 4.3 Star-hopping como segunda capa

Después de descubrir un landmark, ofrecer:
`Desde aquí puedes encontrar…`

Ejemplos sourced:
- Osa Mayor → Polaris;
- Summer Triangle → Lyra/Cygnus/Aquila;
- Orion → Sirius/Procyon / Winter Triangle;
- asterismos brillantes → constelaciones más débiles cercanas.

NASA Night Sky Network describe precisamente asterismos y estrellas brillantes como landmarks para aprender a navegar el cielo.

Esto crea un mapa mental, no 88 búsquedas independientes.

### 4.4 Modos de densidad del cielo

Con 700–1250 estrellas por campo, móvil puede ser visualmente denso.

NASA recuerda que bajo contaminación lumínica sólo se ven las estrellas más brillantes y la Vía Láctea puede desaparecer.

Propuesta didáctica:
`Cielo urbano` → cutoff de magnitud más brillante;
`Cielo oscuro` → catálogo más completo;
`Aprendizaje` → densidad adaptativa al FOV.

No presentar esto como predicción local; es REPRESENTATION.

Beneficios:
- patrones más legibles;
- aprendizaje gradual;
- relación directa con magnitud aparente.

### 4.5 Separar meses de una predicción de visibilidad

Los campos muestran `Mejor hacia septiembre/febrero...` usando mediana de metadatos.

Sin lugar/hora/hemisferio explícito puede leerse como consejo de observación real.

Formato recomendado:
- en modo educativo: `Referencia estacional del atlas`;
- o quitar el mes del selector primario;
- futuro modo `Mi cielo esta noche` debe calcular fecha/lugar de forma explícita y opt-in.

No mezclar atlas preparado con cielo real localizado.

### 4.6 `Examinar esta zona` necesita una semántica más clara

Pointer/tap ya ejecuta `examinar(punto)` directamente.

El botón `Examinar esta zona` ejecuta examen del CENTRO y activa la marca de teclado.

Son dos conceptos distintos con el mismo copy.

Recomendación:
- pointer: click/tap = examinar directamente;
- teclado: centro visible con indicador y botón/Enter `Examinar zona central`;
- ayuda accesible explica equivalencia;
- no presentar el botón como si actuara sobre la última zona pulsada.

COGA recomienda que la relación entre control y contenido afectado sea inequívoca.

### 4.7 Primer viewport móvil: cielo antes, manual después

En 320 se repite la pista arriba y de nuevo antes del cielo, junto con:
- `Vista preparada para observar`;
- instrucciones;
- volver;
- nombre técnico de campo;
- progreso.

Resultado: el cielo empieza bastante abajo.

Formato:
- H1 compacto;
- UNA pista;
- cielo inmediatamente;
- instrucción de 1 línea o primer-use tooltip;
- detalles/controles secundarios tras la escena.

`SKY_FIRST__INSTRUCTIONS_ON_DEMAND`.

## 5 · P1 · ficha y profundidad

### 5.1 No tapar la constelación con la ficha

En 1440 la ficha lateral se superpone al canvas y puede cubrir parte de la figura que se está explicando.

Mejora:
- desktop: panel docked fuera del cielo o lado opuesto al hallazgo;
- mobile: bottom sheet plegable;
- conservar un mínimo de cielo visible;
- al abrir ficha, no mover cámara.

### 5.2 Progressive disclosure

Primera capa después del hallazgo:
- nombre;
- qué patrón acabas de reconocer;
- 2–4 estrellas clave;
- una idea principal.

Después:
`Cómo reconocerla`
`Estrellas`
`Región IAU y figura`
`Cuándo observar`
`Verla de cerca`
`Fuentes`.

No mostrar siete bloques con el mismo peso desde el primer instante.

### 5.3 Ciencia vs convención vs cultura

IAU define regiones del cielo por límites oficiales; los line figures no son la definición oficial.

Formato explícito:
- `Región IAU`;
- `Figura de líneas · Stellarium Modern`;
- `Asterismo/landmark observacional` si aplica;
- `Otras formas culturales de ver esta zona` sólo cuando exista fuente.

No rellenar `contexto_cultural` con una única mitología universal.

## 6 · P2 · sistema de descubrimiento mejorado

### 6.1 Firmas de reconocimiento, no 30% genérico para todas

El 30% + 3–5 puntos hace que patrones muy distintos compartan el mismo criterio.

Propuesta de metadata:
`recognition_signature`:
- anchor stars;
- min angular geometry;
- brightness weights;
- asterism subset;
- shape class;
- confusion neighbours;
- recommended FOV;
- optional star-hop origin.

Para Hydra, por ejemplo, no intentar reconocer 100° completos: usar un subset observacional documentado (p.ej. cabeza/estrella ancla) y luego revelar extensión total.

### 6.2 Medir especificidad, no solo coverage

C18 responde:
`¿puedo identificar las 88 si pongo la vista donde corresponde?`

Falta:
`¿cuántos sitios incorrectos también identifican algo?`

QA nuevo:
- Monte Carlo de clicks ciegos por campo/FOV;
- mapa de regiones aceptadas;
- matriz objetivo→candidato;
- tasa de ambigüedad;
- tasa de false discovery;
- sensibilidad por viewport 320/390/1440;
- sensibilidad por zoom.

### 6.3 Human recognition oracle

Una firma matemática puede ser única y seguir sin ser fácil de reconocer.

Para una muestra representativa:
- brillo alto/bajo;
- patrón pequeño/grande;
- denso/tenue;
- norte/sur;
- asterismo famoso/no famoso;

preguntar sin nombre:
`¿puedes localizar el patrón de la pista?`

Registrar:
- primera mirada;
- pan/zoom;
- click;
- si usa pista extra;
- tiempo no como score universal, sino como señal de fricción.

## 7 · Formato de cuaderno

No convertir 88 hallazgos en una lista larga.

Propuesta:
- mini mapa celeste de descubiertas;
- filtros Norte / Ecuador / Sur;
- rutas/asterismos;
- búsqueda sólo sobre hallazgos;
- fichas por constelación;
- progreso global secundario.

Pendientes continúan ocultas para evitar spoiler.

## 8 · Qué dicen las fuentes externas

### IAU
La IAU define las 88 constelaciones como áreas con límites oficiales; los dibujos de líneas son convenciones de mapas, no patrones gráficos oficiales.
https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx

### NASA · asterismos
NASA describe asterismos como patrones familiares que ayudan a localizar constelaciones y recomienda usar estrellas brillantes/landmarks para orientarse.
https://science.nasa.gov/solar-system/what-are-asterisms/
https://science.nasa.gov/solar-system/skywatching/night-sky-network/connecting-the-dots-with-asterisms/

### Stellarium / WorldWide Telescope
Ambos usan una metáfora continua de cielo: drag/pan, zoom y selección/observación. Eso apoya ocultar los chunks de almacenamiento detrás de una experiencia celeste continua.
https://stellarium.org/guide/
https://docs.worldwidetelescope.org/user-manual/1/explore/

### W3C COGA
Los controles deben ser identificables, comprensibles y dejar clara su relación con lo que afectan. Si hay que descubrir cómo funciona el control, parte de las personas falla.
https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p05-clear-controls/
https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p06-control-actions/

### HEALPix
HEALPix es una partición jerárquica de la esfera diseñada para operaciones locales y multirresolución; es una referencia útil si el atlas celeste crece y necesita tiling continuo.
https://healpix.sourceforge.io/doc/html/intro.htm

## 9 · Orden recomendado de mejora

### Patch 1 · antes de HUMAN QA amplio
1. separar LOCATE/REVEAL para las 88;
2. arreglar radio de examen móvil;
3. añadir specificity/confusion tests;
4. quitar duplicación de clue/copy en 320;
5. aclarar `Examinar centro` vs click directo;
6. no acumular todas las figuras por defecto.

### Patch 2 · cambiar formato
7. ocultar 12 fields como chunks;
8. portada `Explorar libremente / Dame una pista / Cuaderno`;
9. rutas de asterismos/star-hopping;
10. panel de ficha docked/bottom sheet;
11. cuaderno cartográfico.

### Patch 3 · escala
12. firmas de reconocimiento por constelación;
13. densidad/magnitude modes;
14. transición continua entre chunks;
15. cultura editorial sourced;
16. modo localizado futuro separado del atlas preparado.

## 10 · Decisión

`KEEP_DATA_AND_STEREOGRAPHIC_ENGINE`
`DO_NOT_KEEP_FIELDS_AS_PRIMARY_UX`
`DO_NOT_USE_COVERAGE_ONLY_AS_RECOGNITION_QA`
`MAKE_LOCATE_REVEAL_CONSISTENT_88_OF_88`
`ASTERISMS_AND_STAR_HOPS_FOR_LEARNING`
`ONE_SKY__STREAMED_TILES`

Resultado:
`AXIOMA_SKY_COMPLETE_R01_KEEP_DATA_ENGINE__INTERACTION_FORMAT_REWORK_BEFORE_SCALE`