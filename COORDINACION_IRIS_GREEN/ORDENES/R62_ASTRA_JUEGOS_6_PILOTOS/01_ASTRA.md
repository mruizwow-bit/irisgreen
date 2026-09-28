# R62 · ASTRA · JUEGOS · 6 PILOTOS · DIRECCIÓN VISUAL + MECÁNICA ANTES DE CODEX

Fecha: 28/09/2026  
Autoridad de producto: **María**  
Dirección de producto / concepto: **Astra**  
Constructor técnico posterior: **Codex**  
Integración posterior: **A2**  
Aceptación final: **HUMAN QA María**

## ESTADO

`R62_GAMES_6_PILOT_CONCEPTS_ORDERED`

Parent:
- #320 · R56 rediseño Juegos/Recursos/Intereses
- #321 · R57 Codex
- P0 R57 ya aceptado por Astra

Resultado P0 validado:
- 297 registros;
- 260 `ROUTINE_PRACTICE`;
- 26 `TOOL`;
- 11 `GAME`;
- 0 `INTEREST_MINIGAME`.

Los 11 GAME históricos son una sola familia de memoria/parejas. Por tanto, la nueva biblioteca de Juegos NO se construye a partir de multiplicar esas plantillas.

---

# 1. OBJETIVO

Definir **seis juegos piloto reales**, visualmente excelentes y mecánicamente distintos, antes de que Codex escriba el producto final.

Regla:

**CONCEPTO → MARÍA APRUEBA → CODEX CONSTRUYE.**

No:
- inventar el aspecto mientras se programa;
- construir los 6 a ciegas;
- escalar catálogo;
- reutilizar la estética de los 297 históricos.

---

# 2. MÉTODO · UNO A UNO

No diseñar los seis en bloque.

Orden:

1. P01 concepto
2. Astra review
3. María HUMAN QA
4. P02 concepto
5. review
6. etc.

Cuando los 6 conceptos estén aprobados:

`R56_PLAY_6_PILOT_CONCEPTS_APPROVED_FOR_CODEX`

Solo entonces Codex sale del HOLD.

---

# 3. CONTRATO VISUAL GLOBAL

Los pilotos deben demostrar que Iris Green puede tener **juegos de alta calidad gráfica**, no “actividades educativas con iconos”.

## NO

- personajes con ojos como recurso por defecto;
- mascots;
- cartoon infantil genérico;
- monedas/estrellas/banderas como lenguaje universal;
- tarjeta blanca + pictograma;
- gradiente pastel como sustituto de arte;
- UI edtech;
- copiar Animal Crossing, Monument Valley, Unpacking, Townscaper u otra IP;
- reproducir escenas, layouts o assets reconocibles de terceros.

## SÍ

Según cada piloto:
- ilustración 2D rica;
- 2.5D;
- volumen;
- materiales;
- luz;
- sombra;
- atmósfera;
- composición;
- profundidad;
- animación propia;
- Canvas/WebGL/SVG/raster original cuando aporte.

Los seis deben compartir:
**calidad Iris Green**, no una plantilla visual única.

---

# 4. ENTREGABLE DE CONCEPTO POR PILOTO

Antes de código final, cada piloto debe tener:

1. **imagen principal** de gameplay;
2. **detalle de interacción** o segundo estado;
3. descripción de la mecánica en 4–8 líneas;
4. bucle:
   `acción → respuesta → decisión/descubrimiento → continuación`;
5. qué lo hace juego;
6. qué NO es;
7. materiales/luz/paleta;
8. qué se mueve;
9. qué hace la persona;
10. controles equivalentes teclado/touch;
11. reduced motion;
12. stage adaptation si aplica;
13. riesgos de similitud con IP externa;
14. criterio de PASS visual.

Las imágenes serán **originales de Iris Green**.

---

# 5. P01 · HABITACIÓN IMPOSIBLE

## Tipo
Puzle espacial/visual.

## Idea
Una habitación arquitectónica elegante con objetos, aperturas, rampas, niveles o perspectivas que pueden reorganizarse para crear caminos/relaciones inesperadas.

No es:
- “recoge tu habitación”;
- rutina doméstica;
- copia de arquitectura imposible de una IP concreta.

## Mecánica
- observar;
- mover/rotar/cambiar elementos;
- descubrir relaciones espaciales;
- encontrar una o varias soluciones.

## Visual
- arquitectura propia;
- materiales agradables;
- luz;
- profundidad;
- sombras;
- composición clara.

Debe parecer un **puzle premium**, no una ficha escolar.

---

# 6. P02 · TERRARIO VIVO

## Tipo
Juguete digital abierto.

## Idea
Construir un pequeño ecosistema visual colocando:
- plantas;
- piedras;
- agua;
- refugios;
- pequeñas formas de vida cuando proceda.

## Mecánica
- colocar;
- combinar;
- observar respuesta;
- modificar;
- construir algo propio.

No hay victoria obligatoria.

## Visual
Debe sentirse:
- táctil;
- material;
- vivo;
- bonito;
- con humedad/luz/profundidad.

No “jardín cute” genérico.

---

# 7. P03 · RUTAS DE LUZ

## Tipo
Puzle de conexiones.

## Idea
Un espacio visual donde la persona crea caminos de luz entre nodos/objetos atravesando restricciones y eligiendo rutas.

## Mecánica
- conectar;
- desviar;
- desbloquear;
- comparar soluciones;
- rehacer.

## Visual
- luz como material;
- profundidad;
- superficies;
- refracción/reflejo si aporta;
- estado nunca dependiente solo de color.

No parecer un diagrama de electrónica escolar.

---

# 8. P04 · RITMO DE COLORES

## Tipo
Juego musical / secuenciador lúdico.

## Idea
Construir pequeñas secuencias audiovisuales con formas, color, ritmo y sonido.

## Mecánica
- colocar;
- escuchar;
- repetir;
- cambiar;
- superponer;
- descubrir combinaciones.

No:
- examen de ritmo;
- puntuación;
- “acierta la nota”;
- batería de pads genérica.

## Visual
El sonido y la imagen deben sentirse unidos.

La escena puede ser:
- cinética;
- espacial;
- luminosa;
pero no frenética.

---

# 9. P05 · PESCA TRANQUILA

## Tipo
`INTEREST_MINIGAME`.

Debe coordinar con R58/R59 Intereses.

## Bucle
`explorar → observar señal → pescar → descubrir → ficha real → guardar opcionalmente`.

## Visual
Crear un entorno original Iris Green:
- agua;
- profundidad;
- vegetación/rocas si procede;
- peces propios;
- luz;
- calma.

No copiar:
- Animal Crossing;
- sus proporciones;
- UI;
- cámara;
- personajes;
- estilo;
- sonidos;
- progresión.

La inspiración permitida es únicamente:
**explorar + descubrir + coleccionar**.

No timing fino obligatorio.

---

# 10. P06 · MI MUSEO

## Tipo
Colección/exposición interactiva.

## Idea
Un espacio visual propio donde los hallazgos de Intereses puedan verse, ordenarse y consultarse.

Puede contener:
- peces;
- fósiles;
- minerales;
- conchas;
- especies;
- objetos temáticos.

## Mecánica
- colocar;
- ordenar;
- agrupar;
- consultar;
- reorganizar;
- observar la colección crecer si la persona decide guardar.

## Visual
No hacer “grid de cards”.

Debe sentirse como:
- galería;
- gabinete;
- vitrina;
- exposición;
según la familia de colección.

No copiar museos/juegos existentes.

---

# 11. ACCESIBILIDAD DE CONCEPTO

Todos los conceptos deben prever desde el principio:

- teclado;
- touch/pointer;
- drag nunca único método;
- seleccionar→destino o equivalente;
- reduced motion;
- no flashes;
- no color único;
- controles claros;
- 320 px;
- no interacción rápida obligatoria;
- audio opcional y controlable cuando exista.

No diseñar primero una versión inaccesible para “adaptarla después”.

---

# 12. ETAPAS

No crear una versión visual “de niños”.

Infancia puede cambiar:
- complejidad;
- cantidad de elementos;
- starter;
- ayudas;
- tamaño de targets;
- copy.

No:
- baby palette;
- mascots;
- ojos;
- infantilización.

Adolescencia/adultez:
no significa gris/vacío.

---

# 13. GATES INDIVIDUALES

Después de cada concepto aprobado:

`R62_P01_HABITACION_CONCEPT_APPROVED`
`R62_P02_TERRARIO_CONCEPT_APPROVED`
`R62_P03_RUTAS_LUZ_CONCEPT_APPROVED`
`R62_P04_RITMO_CONCEPT_APPROVED`
`R62_P05_PESCA_CONCEPT_APPROVED`
`R62_P06_MUSEO_CONCEPT_APPROVED`

Cuando estén los seis:

`R56_PLAY_6_PILOT_CONCEPTS_APPROVED_FOR_CODEX`

---

# 14. DESBLOQUEO DE CODEX

Al recibir el marcador final anterior, #321 queda autorizado para construir únicamente los seis pilotos.

Marcador de build posterior:

`R57_CODEX_PLAY_6_PILOTS_READY_FOR_ASTRA`

Después:
Astra review → María HUMAN QA → estándar → escala.

---

# 15. LÍMITES

No:
- migrar todavía 260 prácticas;
- mover todavía 26 tools;
- escalar catálogo;
- A2;
- main;
- producción;
- copiar IP;
- usar los 11 Memory como plantilla universal.

Este issue es exclusivamente **dirección visual + mecánica de los seis pilotos**.