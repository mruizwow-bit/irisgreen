# PRISMA · REVISIÓN CIELO NOCTURNO COMPLETO R01 · 2026-10-06

Estado propuesto:
`KEEP_ASTRONOMICAL_CORE_REWORK_DISCOVERY_INTERACTION_AND_FORMAT`

No modifica el paquete, `main` ni producción.

## 1. Base exacta

Paquete recibido:
`DESCUBRIMIENTO_CIELO_COMPLETO_R01(1).zip`

SHA-256:
`eaa15fcc98157f4d7f26c874a74d9d50bc8bc63061ca81067c56b66f01512bd6`

Verificación propia:
- 337 entradas en ZIP;
- `SHA256SUMS.txt`: 320/320 archivos verificados;
- 88 fichas;
- 88 SVG;
- 106 PNG;
- 12 campos;
- 40 resultados del banco entregado: 40 OK.

No declaro repetición propia del banco Chromium completo: el entorno de browser de esta sesión bloquea navegación al file:// del paquete. Sí ejecuté análisis del motor, datos exactos y pruebas adversas propias sobre su algoritmo.

---

# 2. Qué conservar

## Proyección y datos
- estereográfica para campos amplios;
- una única transformación compartida por estrellas, figuras, regiones y selección;
- orientación este-izquierda / norte-arriba del preset;
- límites oficiales IAU separados de figura convencional;
- estrellas reales y Vía Láctea;
- carga lazy de campos/fichas;
- null explícito en datos no documentados.

## Interacción
- selección directa mediante tap/click;
- tap no mueve la cámara;
- drag mueve y no selecciona;
- pointercancel no confirma un tap;
- animación de cámara cancelable;
- NORMAL / REDUCED / NONE;
- descripción no visual opcional;
- progreso y cuaderno sin spoilers;
- figura sólo después del hallazgo.

No recomiendo volver a gnomónica ni reconstruir las 88.

---

# 3. Hallazgos reproducibles del código

## CIE-I01 · el objetivo no avanza tras una constelación normal

En `interfaz.js::examinar()`:
- una constelación normal pasa a `revelada`;
- se añade a `descubiertas`;
- se guarda;
- se actualizan mensaje/cabecera;

pero **no se llama a `elegirObjetivo()`**.

`elegirObjetivo()` sólo se llama:
- al abrir un campo;
- tras `revelar()` el caso especial de Orión;
- al reiniciar.

Consecuencia:
después de Orión el objetivo pasa correctamente a Géminis; al descubrir una constelación normal que sea el objetivo, la pista queda apuntando a la ya encontrada.

Esto no está cubierto por C10, que sólo prueba el avance especial de Orión.

Corrección:
```
if (abbr === estado.objetivoActual) elegirObjetivo();
```
tras registrar cualquier hallazgo normal.

Añadir test de al menos tres hallazgos normales consecutivos.

**Prioridad: blocker de flujo.**

---

## CIE-I02 · hay dos objetivos simultáneos y pueden contradecirse

El hero global conserva siempre:
`Busca tres estrellas brillantes casi en línea.`

Eso es la misión de Orión.

Al pasar a la siguiente constelación o abrir otro campo, el objetivo local cambia, pero el hero sigue mostrando Orión.

La captura entregada después de descubrir Orión muestra simultáneamente:
- arriba: `Busca tres estrellas brillantes casi en línea.`
- debajo: `Busca un grupo de 4 estrellas brillantes...`

En otro campo la contradicción es mayor.

Propuesta:
- portada: copy general (`Explora el cielo y aprende a reconocer sus patrones`);
- escena: **un único objetivo vivo**;
- Orión conserva su copy únicamente al comenzar su encuentro.

**Prioridad: alta de formato/comprensión.**

---

## CIE-I03 · el radio de reconocimiento cambia la semántica entre pantallas

Config:
`ZONA = { fraccion: 0.19, min_px: 88, max_px: 150 }`.

El mínimo de 88 px hace que en móvil la zona astronómica examinada sea enorme respecto al campo.

### Prueba adversa propia

Método:
- motor equivalente a `motor.js::examinar()`;
- datos exactos de los 12 campos;
- cámara inicial y zoom 1.35;
- taps uniformes sobre la parte del cielo situada por encima del horizonte;
- ninguna constelación previamente descubierta;
- 3.000–5.000 taps por campo;
- no es un estudio de usuario; sirve para medir sensibilidad/accidentalidad del oráculo.

Con dimensiones nominales de las vistas medidas por el propio banco:

| ancho | tasa aleatoria por campo |
|---|---|
| 320 | mínimo ~71 %, mediana ~87 %, máximo ~98 % |
| 390 | mínimo ~49 %, mediana ~68 %, máximo ~88 % |
| 1440 | mínimo 0 %, mediana ~8 %, máximo ~30 % |

Ejemplo:
- campo 11: ~96–98 % a 320 frente a ~30 % a 1440;
- campo 12: ~95–97 % a 320 frente a ~24 % a 1440;
- campo 09: ~84–86 % a 320 frente a ~0 % a 1440.

El cálculo no incluye los pequeños occluders de botones, por lo que no pretende ser un valor de producción exacto. La diferencia de orden de magnitud sí viene del radio mínimo en píxeles.

### Problema conceptual

Se mezclaron dos necesidades distintas:
1. **target cómodo para tocar**;
2. **apertura astronómica usada para decidir qué patrón se reconoce**.

Deben separarse.

### Corrección

- la tolerancia de entrada puede medirse en CSS px;
- la zona que decide el patrón debe expresarse en **coordenadas angulares / unidades del campo** y conservar significado al cambiar viewport/zoom;
- mostrar opcionalmente esa zona sólo al examinar;
- añadir negativos:
  - tap aleatorio;
  - zona entre dos patrones;
  - borde de patrón;
  - misma coordenada astronómica a 320/390/1440.

**Prioridad: blocker de equivalencia de interacción.**

---

## CIE-I04 · las pistas no son suficientemente discriminativas

Análisis de las 88 fichas:
- 88 pistas;
- sólo **47 textos únicos**;
- **21 textos** se repiten;
- hay colisiones dentro del mismo campo.

Ejemplos dentro del mismo campo:
- campo 02: Cnc / LMi → misma pista;
- campo 07: Aqr / Cap → misma pista;
- campo 11: Ind/Mic, Tel/Cir, Aps/Nor → pares con pistas idénticas;
- campo 12:
  - Hor/Dor idénticas;
  - Men/Cae/Ret idénticas.

La plantilla más repetida aparece en siete constelaciones:
`Busca un trazo tenue de 4 puntos en una zona pequeña; aquí no hay estrellas muy brillantes.`

Una pista puede ser verdadera y seguir sin ayudar a distinguir.

### Magnitudes como pista primaria

Ejemplos:
`Busca una estrella clara de magnitud 2.2...`

La escala de magnitudes es inversa y logarítmica; no es un lenguaje intuitivo para principiantes.

Propuesta:
- valor numérico en la ficha avanzada;
- pista primaria en lenguaje visual relativo:
  - `una de las estrellas más brillantes de esta zona`;
  - `una pareja claramente más brillante`;
  - `arco compacto`;
  - `cadena larga`;
  - `cruce`;
  - `triángulo`;
  - `dos ramas que parten del mismo punto`.

### Nuevo generador: pista contrastiva

No generar una descripción aislada.
Generar **la combinación mínima de rasgos que diferencie a la constelación de las demás del campo**.

Features posibles:
- grado de nodos / ramificaciones;
- endpoints;
- bucles;
- aspect ratio;
- arco/curvatura;
- compacidad;
- estrella más brillante relativa al campo;
- posición de estrellas brillantes dentro del patrón;
- proximidad a Vía Láctea;
- relación espacial con un patrón ya descubierto.

Gate:
`CLUE_UNIQUE_WITHIN_ACTIVE_FIELD`.

**Prioridad: alta de producto.**

---

## CIE-I05 · drag no tiene alternativa de puntero equivalente para mover el cielo

El producto dice:
- drag → mover cielo;
- flechas físicas → mover cielo.

Pero WCAG 2.2 SC 2.5.7 pide que una funcionalidad basada en drag tenga una alternativa **de single pointer sin drag**. El teclado no sustituye esa obligación de puntero.

Esto importa porque el propio modelo dice que algunas partes deben moverse para salir del horizonte / llegar a otra zona.

No recomiendo volver a poner una cruceta como interacción principal.

Alternativas mejores:
1. minimapa: tocar otra zona → recentrar;
2. modo secundario `Mover cielo`: tap de destino → animación/recentrado;
3. botones discretos de `vista anterior / encajar campo` y navegación de regiones;
4. overview de campo con viewport seleccionable.

**Prioridad: alta de accesibilidad/interacción.**

---

## CIE-I06 · “Fuentes” cambia de pantalla desde portada/cuaderno

Código:
si `btn-fuentes` se pulsa fuera de escena:
`abrirCampo(CAMPO_INICIAL, ... abrirPanel('fuentes'))`.

Por tanto:
- portada → Fuentes → se abre campo 06 detrás del panel;
- cerrar Fuentes deja a la persona dentro de la escena.

Leer información secundaria no debería navegar a Orión.

Corrección:
panel/modal de fuentes independiente de la pantalla actual, o una ruta documental propia.

---

## CIE-I07 · Reiniciar borra 88 hallazgos sin confirmación

`reiniciar()` borra inmediatamente localStorage y el estado.

Cuando el producto puede acumular 88 hallazgos, el coste de un toque accidental es alto.

Mover a Opciones y:
- diálogo de confirmación;
- copy explícito;
- foco de retorno;
- opcionalmente undo corto o export/import si posteriormente se justifica.

---

## CIE-I08 · “Continuar” conserva campo, no punto de observación

Guardado:
- descubiertas;
- último campo.

No conserva:
- cámara;
- zoom;
- zona que se estaba observando.

Por eso `Continuar` significa realmente “volver al campo”, no “continuar exactamente”.

Opciones:
- renombrar a `Volver al último campo`;
- o persistir cámara/zoom por campo.

Durante la sesión, el cuaderno también podría conservar la cámara por campo.

---

## CIE-I09 · la portada expone los shards técnicos como arquitectura del producto

Los 12 campos vienen de clustering espacial y carga de datos.
En interfaz aparecen como:
- Campo 01;
- Campo 02;
- Campo 03;
...

con etiquetas repetidas `Norte medio`, `Sur medio`, etc.

Son buenos **chunks de runtime**, pero no necesariamente las mejores unidades mentales para aprender el cielo.

Campo 11 tiene 14 constelaciones; campo 12, 13. Campo 02 sólo 5.

Propuesta:
los campos siguen existiendo debajo, pero la persona ve un **mapa continuo / overview del cielo**.

---

## CIE-I10 · en móvil el cielo llega demasiado tarde

Captura 320:
antes de la escena aparecen:
- título grande;
- misión de Orión;
- preset;
- instrucciones;
- volver;
- nombre de campo;
- progreso;
- objetivo local.

El cielo empieza aproximadamente alrededor de y=400 en un viewport de 568.
La experiencia principal queda parcialmente bajo el fold.

Después de entrar:
- colapsar hero;
- barra compacta:
  `← · Campo / ubicación · pista actual`;
- cielo ocupando ~65–75 % de la ventana;
- CTA contextual pegada a escena;
- instrucciones completas en Ayuda.

---

# 4. Investigación externa

## IAU: región oficial ≠ dibujo convencional

IAU explica que las 88 constelaciones modernas son **áreas delimitadas del cielo**; las figuras de líneas son representaciones convencionales y las culturas han usado otros asterismos.

Implicación de formato:
tras descubrir, ofrecer capas claramente etiquetadas:
- Figura;
- Región IAU;
- estrellas/nombres;
- Vía Láctea;
- posteriormente culturas documentadas.

No presentar el dibujo como “la frontera real”.

Fuente:
IAU · The 88 IAU Constellations.

## Stellarium: capas y ayudas de navegación

El User Guide de Stellarium separa:
- constellation art;
- boundaries;
- asterism lines;
- ray helpers;
- proyección.

Los `ray helpers` conectan estrellas —incluso de constelaciones distintas— como ayuda de navegación.

Implicación:
**star-hopping** y capas bajo demanda son mejores que intentar cargar toda la enseñanza dentro de una pista textual.

La elección estereográfica de R01 es razonable y debe conservarse.

## Star-hopping

Sky & Telescope define star-hopping como seguir una cadena de patrones desde un lugar conocido hacia otro desconocido.

Eso es exactamente la estructura de aprendizaje que falta entre las 88:
- descubrimiento encontrado = nuevo punto de referencia;
- la siguiente pista puede relacionarse con ese ancla;
- se construye un mapa mental del cielo.

No hace falta poner nombres antes de descubrir.

## Planisphere / cielo real

Una planisfera combina:
- fecha;
- hora;
- horizonte;
- latitud del observador.

Sky & Telescope señala que distintos rangos de latitud necesitan planisferios distintos y que el mapa muestra qué está sobre el horizonte en ese momento.

Consecuencia:
el actual `CURATED_OBSERVATION_PRESET` no debe parecer `mi cielo ahora`.

Recomiendo separar productos/modos:

### Modo A · Aprender el cielo / Atlas
- las 88 disponibles;
- vista preparada;
- no pretende horizonte real;
- campos/chunks técnicos ocultos;
- star-hopping y descubrimiento.

### Modo B · Mi cielo ahora (futuro)
- lugar/fecha/hora;
- horizonte y puntos cardinales reales;
- sólo constelaciones realmente visibles;
- brillo/contaminación lumínica si se incorpora.

No mezclar ambos modelos.

## Magnitud

La escala de magnitud cuenta “al revés”: menor número = estrella más brillante.

Es información valiosa después del hallazgo, pero mala instrucción primaria para una persona que está aprendiendo a reconocer patrones.

## Visualización: overview first

Shneiderman:
`overview first, zoom and filter, then details-on-demand`.

Aplicación:
- overview celeste;
- entrar/acercar una región;
- explorar;
- seleccionar patrón;
- detalles bajo demanda.

Mejor que una portada de 12 tarjetas de shards.

## Progressive disclosure

NN/g:
mostrar primero las opciones principales y relegar las avanzadas.

Aplicación a Cielo:
### En escena
- cielo;
- pista actual;
- examinar;
- zoom;
- ayuda compacta.

### Bajo Opciones
- idioma;
- movimiento;
- descripción;
- fuentes;
- reiniciar.

### Después del hallazgo
- identificación + rasgo observado;
- luego Saber más;
- dentro: datos, región oficial, material visual, fuentes.

## Curiosity-driven exploration

GDC / Outer Wilds:
la exploración puede impulsarse por curiosidad y señales del mundo en vez de una cadena explícita de misiones.

Aplicación:
de-emfatizar `0/88` y barras de progreso en el primer contacto.
El cuaderno sí puede conservar el progreso.

---

# 5. Rediseño de interacción propuesto

## CIELO R02 · principio

**Los 12 campos dejan de ser pantallas para convertirse en tiles internos.**

La persona siente que explora **un solo cielo**.

## Entrada

Portada:
`Cielo nocturno`
`Aprende a reconocer el cielo por sus patrones.`

CTA:
`Empezar por Orión`

Secundario:
`Abrir atlas`
`Cuaderno`

No mostrar inicialmente una cuadrícula administrativa de 12 campos.

## Overview / Atlas

Mapa celeste simplificado:
- posición aproximada de los 12 chunks sin sus nombres técnicos;
- viewport actual;
- descubierto/no descubierto sin enseñar nombres pendientes;
- selección por tap;
- lista DOM equivalente.

Puede usar una proyección all-sky apropiada para overview; al entrar en detalle se mantiene la estereográfica.

## Encuentro Orión

Se conserva tal cual conceptualmente:
`Busca tres estrellas brillantes casi en línea.`

Encontrar → localizar → revelar → profundizar.

## Después de Orión: star-hopping

Pistas de tres niveles:

### H1 · Forma
`Busca dos estrellas brillantes casi gemelas con un trazo que baja desde ellas.`

### H2 · Relación espacial
`Desde el cinturón que acabas de encontrar, mira más arriba y hacia la izquierda.`

Sin nombrar el objetivo.

### H3 · Ayuda solicitada
Minimapa / sector aproximado, no un círculo de “respuesta”.

No usar H2/H3 si la persona no los solicita o no lleva varios intentos.

## Descubrimiento libre

Si encuentra otra constelación antes que el objetivo:
- se acepta;
- se celebra;
- la misión sugerida sigue disponible;
- no se castiga ni se fuerza orden.

---

# 6. Regla de reconocimiento propuesta

Separar:

### Input tolerance
Comfort de tap/click en px.

### Evidence aperture
Zona astronómica en coordenadas del mundo/campo.

La evidence aperture:
- independiente de viewport;
- consistente a igual zoom;
- visible opcionalmente al confirmar;
- calibrada con negativos, no sólo con reachability.

Añadir test:
`SAME_SKY_POINT_SAME_EVIDENCE_320_390_1440`.

Añadir test Monte Carlo con máximo de identificaciones accidentales definido por producto.

---

# 7. Formato de ficha

La ficha actual es correcta como repositorio de datos, pero demasiado densa para primera profundidad.

## Nivel 1
- nombre;
- “lo reconociste por…”;
- 1–3 estrellas principales;
- mini patrón.

## Nivel 2
accordions:
- Cómo reconocerlo;
- Estrellas;
- Región IAU;
- Visibilidad de referencia;
- Material visual.

## Nivel 3
- fuentes;
- procedencia;
- notas técnicas.

La magnitud exacta y las tablas se conservan: simplemente dejan de competir con la explicación principal.

---

# 8. Cuaderno

En vez de sólo lista:
- vista mapa de lo descubierto;
- lista accesible equivalente;
- “volver a donde lo encontré”;
- conexiones espaciales entre hallazgos.

Esto convierte progreso en **memoria espacial**, no sólo colección.

---

# 9. Pruebas nuevas necesarias

## Flujo
1. objetivo normal avanza al descubrirlo;
2. descubrimiento fuera de orden no rompe pista;
3. fuente abierta desde portada no navega;
4. reset pide confirmación.

## Reconocimiento
5. negativos aleatorios por campo/viewport;
6. zonas entre patrones;
7. misma evidencia astronómica en 320/390/1440;
8. pistas únicas dentro del campo activo.

## Navegación
9. alternativa single-pointer a drag;
10. overview → detalle → overview conserva contexto;
11. vecino/anchor sin desorientación.

## Producto
12. primer minuto en 320: cielo visible sin scroll previo excesivo;
13. persona entiende qué hacer sin leer ayuda larga;
14. después de cinco hallazgos puede explicar relaciones espaciales, no sólo nombres.

## Accesibilidad
15. screen reader real;
16. foco;
17. touch físico;
18. Firefox/Safari;
19. 200 % real;
20. forced-colors real.

---

# 10. Orden recomendado

## Patch inmediato, sin rediseño
1. CIE-I01 objetivo normal.
2. CIE-I02 hero contradictorio.
3. CIE-I03 separar tap radius / evidence aperture.
4. CIE-I06 Fuentes no debe navegar.
5. confirmar reset.
6. añadir alternativa single-pointer a pan.

## Prototipo de formato
7. compact scene-first mobile.
8. overview celeste en vez de cards.
9. pistas contrastivas.
10. star-hopping desde hallazgos.

## Después
11. ficha progressive disclosure.
12. cuaderno espacial.
13. Atlas vs Mi cielo ahora.
14. cultura celeste sólo cuando CIE-P01 tenga fuentes.

## Veredicto

El paquete demuestra cobertura técnica de las 88 y una buena base astronómica.
El siguiente salto no es añadir más datos.

Es pasar de:
`12 listas/campos + pista genérica + tap amplio`

a:
`overview → orientación espacial → pista discriminativa → señalar → revelar → usar el hallazgo como nuevo ancla`.

Ese cambio puede enseñar realmente el cielo en vez de convertir las 88 en una colección alcanzable.

`NO MAIN · NO PRODUCCIÓN`
