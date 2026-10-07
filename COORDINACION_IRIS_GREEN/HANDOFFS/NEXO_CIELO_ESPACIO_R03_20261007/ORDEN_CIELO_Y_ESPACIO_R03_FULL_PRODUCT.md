# NEXO · ORDEN ACTIVA · CIELO Y ESPACIO R03 · PRODUCTO COMPLETO

Fecha: 2026-10-07
Autoridad de producto: María
Coordinación: Nexo
Carril principal: #323
Dependencia visual: #370

## 0. Cambio de fase

Este carril deja de tratarse como prototipo.

Gate humano de entrada:
`MARIA_SKY_3D_R02_1_HUMAN_QA_PASS__RIGEL_ANCHOR_UNDERSTOOD`

Nueva fase:
`CIELO_Y_ESPACIO_R03_FULL_PRODUCT_BUILD`

No volver a hacer pilotos parciales para decidir la arquitectura general.

## 1. Alcance completo

Cielo y Espacio NO es sólo constelaciones.

El producto completo debe integrar, en este orden operativo:

1. **Cielo nocturno completo · 88 constelaciones**
2. **Sistema Solar principal**
   - Sol
   - Mercurio
   - Venus
   - Tierra
   - Marte
   - Júpiter
   - Saturno
   - Urano
   - Neptuno
3. **Lunas y planetas enanos / contexto B03**
4. **Lluvias de meteoros**
5. **Exoplanetas**
6. **Eclipses**
   - KEEP de la integración ya existente;
   - no reabrir salvo defecto real de Axioma/HUMAN QA.

Contrato común:
`EXPLORE → LOCATE → REVEAL`

## 2. Base Cielo LOCKED

Base exacta:
`CIELO_3D_R02_1.zip`

SHA-256:
`1f7e6ac7aab0b56d88b880375049a621bb85d9e0bc74105366f1d71073423ba8`

KEEP:
- esfera continua;
- cámara/orientación/zoom;
- LOCATE→REVEAL;
- hallazgo fuera de orden;
- cuaderno;
- retorno espacial;
- pistas data-driven;
- observabilidad real;
- evidencia angular;
- selección explícita;
- ambigüedad sin desempate CSS;
- 320/390/1440;
- teclado/touch;
- NORMAL/REDUCED/NONE;
- storage forward-compatible.

## 3. Bloque 1 · 88 constelaciones

Integrar los 88 masters aprobados existentes.

NO:
- redibujar;
- regenerar assets;
- crear R04 visual.

Debe existir:
- una única esfera;
- 88/88 geometrías;
- nombres ES/EN;
- estrellas asociadas;
- puntos observables/no observables;
- mínimos semánticos;
- fichas;
- anclas;
- rutas;
- pistas;
- regiones;
- procedencia.

Regla:
`GEOMETRY != OBSERVABLE_EVIDENCE`

Un vértice puede existir en la figura y no contar para identificación.

## 4. Escala 88 integrada dentro de la construcción

No crear tres pilotos separados.

Validar dentro del producto completo:

### SKY-SCALE-01
Constelaciones grandes/dispersas:
- Hidra;
- Eridano;
- Serpiente;
- Virgo;
- Osa Mayor;
- otras equivalentes.

### SKY-SCALE-02
Barrido real de ambigüedad con 88/88.
Entregar:
`AMBIGUITY_88_REPORT.json`

### SKY-SCALE-03
Rutas humanas:
- por estación;
- por región;
- por anclas;
- libres;
- “seguir desde aquí”.

No cadena lineal de 88 pasos.

## 5. Sistema Solar principal

Construir como espacio explorable, no como carrusel de fichas.

Acciones:
- rotar;
- acercar/alejar;
- localizar cuerpos;
- seleccionar;
- revelar.

Integrar assets first-party aprobados de #370.

No inventar:
- escalas;
- superficies;
- órbitas.

Separar:
- `REAL_DATA`
- `CALCULATION`
- `SIMULATION`

Cuando una representación no sea a escala real, declararlo.



## 5A. Regla volumétrica · aprendida de Vida marina

La experiencia Cielo y Espacio no puede repetir el límite de Vida marina:

`WORLD_3D = TRUE` no basta si el objeto principal sigue siendo una lámina.

Regla:

`TRUE_3D_WHERE_OBJECT_HAS_REAL_VOLUME`

### No convertir en volumen lo que no corresponde

Las constelaciones:
- siguen siendo patrones angulares;
- estrellas + líneas/figuras;
- no se extruyen;
- no se convierten en “objetos sólidos” ficticios.

### Volumen 3D real obligatorio

Cuando el objeto físico tiene volumen y se explora espacialmente:
- Sol;
- Mercurio;
- Venus;
- Tierra;
- Marte;
- Júpiter;
- Saturno;
- Urano;
- Neptuno;
- lunas;
- planetas enanos;
- asteroides/cometas si entran como cuerpos explorables.

No usar como solución final:
- PNG sobre `PlaneGeometry`;
- billboard orientado a cámara;
- dos planos cruzados;
- extrusión falsa de una imagen;
- curvar una lámina para fingir volumen;
- mantener siempre el objeto de frente.

Debe existir:
- silueta coherente desde frontal/lateral/oblicuo;
- iluminación sobre geometría real;
- rotación real;
- oclusión real;
- selección/raycast sobre volumen.

### Exoplanetas

El volumen geométrico puede representarse cuando el radio/tamaño está suficientemente respaldado.

La apariencia superficial NO se inventa.

Mantener:
- `UNKNOWN_APPEARANCE_REPRESENTATION`;
- `HOLD_NO_SAFE_VISUAL_ASSIGNMENT`;
- `ASSIGN_BY_PHYSICS_NOT_AESTHETIC_SIMILARITY`.

Si el color/superficie es desconocido:
- geometría neutra;
- representación declarada;
- no textura ficticia presentada como factual.

### Meteoros

No son billboards de “estrella fugaz”.

La experiencia debe representar:
- trayectoria 3D coherente;
- radiante;
- dirección;
- relación espacial con el observador.

El asset ilustrado puede seguir usándose en ficha/contexto, pero no sustituye la trayectoria espacial del fenómeno.

### Eclipses

Los seis assets didácticos existentes siguen KEEP.

No rehacerlos por esta regla.

Si se añade una simulación espacial:
- geometría Sol–Tierra–Luna coherente;
- separar claramente `SIMULATION` de asset didáctico;
- no invalidar los visuals canónicos aprobados.

### Gate interno previo a escalar cuerpos

Antes de integrar catálogo amplio:
- validar Sol + 1 planeta rocoso + 1 gigante gaseoso + 1 luna en 3D real;
- después aplicar el pipeline al resto.

Esto NO reabre la dirección general del producto; valida el pipeline volumétrico.


## 6. Lunas y planetas enanos

Integrar el bloque B03 después del Sistema Solar principal.

Debe permitir:
- entender relación con cuerpo principal;
- localizar;
- seleccionar;
- comparar sin convertirlo en tabla dominante.

No cargar catálogos enormes sin utilidad.

## 7. Lluvias de meteoros

Integrar la tanda canónica ya producida.

Experiencia:
- explorar cielo;
- localizar radiante;
- revelar origen/actividad.

La escena debe conservar:
- dirección;
- contexto;
- variación por lluvia;
- sin texto/datos horneados en assets.

Datos factuales separados de arte.

## 8. Exoplanetas

Integrar catálogo aprobado por tandas y reglas físicas existentes.

Regla:
`ASSIGN_BY_PHYSICS_NOT_AESTHETIC_SIMILARITY`

Cuando apariencia no sea conocida:
- `UNKNOWN_APPEARANCE_REPRESENTATION`
- o `HOLD_NO_SAFE_VISUAL_ASSIGNMENT`

No inventar superficie.

Experiencia:
- navegar estrellas/sistemas;
- localizar planeta;
- seleccionar;
- revelar.

Distinguir siempre:
- REAL_DATA;
- CALCULATION;
- SIMULATION.

## 9. Eclipses · KEEP

Eclipses V2 ya integrado.

Conservar:
- seis tipos canónicos;
- títulos ES/EN;
- alt ES/EN;
- secuencias didácticas;
- geometría aprobada.

No reabrir salvo defecto reproducido.

## 10. Navegación común del producto

La persona debe sentir que está dentro del mismo producto Cielo y Espacio.

No cinco micrositios aislados.

Debe haber:
- una entrada común;
- transición clara entre experiencias;
- estado espacial coherente donde tenga sentido;
- cuaderno/colección de hallazgos común o arquitectura compatible;
- volver a explorar sin perder contexto;
- ES/EN;
- accesibilidad consistente.

No obligar a recorrer bloques en orden.

## 11. Ayuda progresiva

Principio:
la persona aprende a leer el espacio.

Ayuda opcional por niveles:
1. relación/forma;
2. dirección aproximada;
3. ancla ya aprendida.

Nunca revelar directamente el objetivo antes de LOCATE.

## 12. Rendimiento

Medir el producto completo, no extrapolar R02.

Obligatorio:
- 320;
- 390;
- 1440;
- móvil real cuando sea posible;
- GPU real;
- frame time;
- memoria;
- arranque;
- navegación entre bloques;
- densidad máxima.

Objetivo:
>=30 fps en hardware objetivo para escenas 3D interactivas.

## 13. Accesibilidad

Mantener:
- teclado;
- touch;
- alternativa a drag;
- foco visible;
- 44 px;
- 200%;
- forced-colors;
- NORMAL / REDUCED / NONE;
- ES/EN;
- equivalente textual de información significativa.

NONE:
- producto completo usable;
- no bloquear revelado ni navegación.

## 14. Datos / fuentes

No hardcodes de objetos concretos en runtime.

Todo objeto:
- id;
- tipo;
- fuente;
- versión;
- procedencia;
- ES/EN;
- estado factual;
- representación;
- incertidumbre cuando aplique.

No mezclar dato real con simulación sin etiqueta.

## 15. Construcción

No entregar bloques como “pilotos”.

Se permite trabajar internamente por lotes para ingeniería, pero el objetivo de entrega es:

`CIELO_Y_ESPACIO_R03_FULL_PRODUCT`

La revisión intermedia debe ser de integración/riesgo, no volver a preguntar si la dirección general gusta.

## 16. Entrega final de esta fase

Entregar:
- producto completo ejecutable;
- 88/88 constelaciones;
- Sistema Solar principal;
- lunas/planetas enanos;
- meteoros;
- exoplanetas;
- Eclipses KEEP integrado;
- manifest;
- hashes;
- datos/procedencia;
- benchmarks;
- QA;
- vídeos 1440/390;
- lista de límites reales;
- informe de ambigüedad 88;
- rutas humanas;
- matriz factual REAL_DATA/CALCULATION/SIMULATION.

Gate esperado:
`CIELO_Y_ESPACIO_R03_FULL_PRODUCT_READY_FOR_NEXO`

Secuencia:
Nexo retest → Axioma precheck → HUMAN QA María → integración autorizada.

## 17. Límites

NO:
- volver a comparar 2D/3D;
- redibujar 88 constelaciones;
- rehacer Eclipses;
- inventar superficies de exoplanetas;
- inventar escala del Sistema Solar;
- convertir cada bloque en micrositio;
- main;
- public deploy antes de gate.

Dirección:
`ONE_PRODUCT · MULTIPLE_SPACE_EXPERIENCES · EXPLORE_LOCATE_REVEAL`
