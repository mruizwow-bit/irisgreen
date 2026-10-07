# CADA CEREBRO, SU CAMINO · ESTUDIO + STORYBOARD + PRUEBA DE APERTURA R01

Fecha: 07/10/2026  
Autoridad de producto: María  
Responsable de este estudio: Axioma  
Estado: READY_FOR_HUMAN_QA_BEFORE_CODE  
Código: NO  
Producción/main: NO

## 1. Estudio

### Rutina practicada
Preparar una actividad cotidiana o escolar eligiendo **cómo** abordarla cuando existen varias maneras válidas de avanzar.

El juego conserva el núcleo del original: los mismos tres problemas base —**Los lápices, La mochila y El ovillo**— y las cinco familias de estrategia —**Dibujarlo, Hacer una lista, Usar la regla, Probar y ver, Decirlo en voz alta**—, pero deja de ser una pantalla de elección y pasa a una escena 3D donde cada estrategia transforma físicamente el problema.

### Decisión real
La persona no elige “la respuesta correcta”. Elige una combinación de estrategias bajo un límite de recursos. Cada estrategia aporta ventajas distintas y ninguna es universal.

La decisión es:
1. qué estrategias activar;
2. en qué orden;
3. cuándo mantener, retirar o cambiar una tras observar la consecuencia.

### Solución abierta
Cada escenario admite varias combinaciones válidas y varias soluciones mínimas distintas. No existe una ruta canónica única.

### Qué aprende haciendo
El aprendizaje no es “todos pensamos distinto” como mensaje abstracto. Se practica:
- probar una forma;
- observar qué cambia;
- detectar qué sigue bloqueando;
- cambiar la combinación;
- comprobar que otra ruta también funciona.

Contrato funcional:
`CONFIGURAR → PROBAR → OBSERVAR → CAMBIAR → RESOLVER`

## 2. Storyboard 3D

### Escena general
Una mesa-taller 3D ocupa el centro. En el lateral hay cinco herramientas físicas, una por estrategia:
- **Dibujarlo** → tablero translúcido donde aparecen esquemas;
- **Hacer una lista** → carril de fichas ordenables;
- **Usar la regla** → regla/compás mecánico que impone una estructura;
- **Probar y ver** → manipuladores físicos para mover/repartir/ensayar;
- **Decirlo en voz alta** → pulsador de voz que hace aparecer una secuencia visual sincronizada, sin audio obligatorio.

La persona dispone de un máximo de tres herramientas activas.

### Escenario A · Los lápices
Problema heredado: 24 lápices y 6 mesas.

Representación:
- seis recipientes 3D;
- 24 lápices manipulables;
- una cinta de distribución.

Consecuencias:
- Dibujarlo superpone grupos visuales;
- Lista crea seis casillas de reparto;
- Regla muestra relaciones 24÷6 sobre la cinta;
- Probar permite repartir físicamente;
- Voz marca secuencias visuales de conteo.

El escenario termina cuando todos los lápices quedan repartidos de forma coherente. No se etiqueta una estrategia como correcta.

### Escenario B · La mochila
Problema heredado: preparar una mochila para una excursión.

Representación:
- mochila 3D con volumen real;
- objetos con tamaño/peso relativo;
- capas internas visibles al girar la mochila.

Consecuencias:
- Dibujarlo muestra un plano por capas;
- Lista convierte objetos en una secuencia editable;
- Regla aporta estructura “pesado abajo / primero arriba”;
- Probar deja meter/sacar y observar cierre y acceso;
- Voz convierte la secuencia verbal en una línea visual de pasos.

Se resuelve cuando la mochila cierra y los elementos necesarios quedan accesibles según la configuración elegida. Varias configuraciones son válidas.

### Escenario C · El ovillo
Problema heredado: desenredar un ovillo.

Representación:
- ovillo 3D con varios cruces y dos extremos;
- mesa con puntos de apoyo.

Consecuencias:
- Dibujarlo proyecta el recorrido visible del hilo;
- Lista numera cruces/nudos;
- Regla fija un extremo y estructura el avance;
- Probar permite tirar, deshacer y cambiar de punto;
- Voz transforma cada paso dicho en un marcador visual ordenado.

Se resuelve cuando existe un recorrido continuo sin bloqueos. Diferentes órdenes de resolución pueden funcionar.

### Consecuencia visible
Nada importante se comunica sólo en texto:
- los objetos cambian;
- el recorrido se abre o se bloquea;
- la mochila cierra/no cierra;
- los lápices quedan repartidos o no;
- el hilo libera cruces o crea tensión.

El DOM paralelo describe el mismo estado para accesibilidad.

## 3. Prueba de apertura

Se modelan tres dimensiones funcionales:
- C = claridad de la representación;
- O = orden/secuencia;
- V = verificación/feedback.

Aportes por estrategia:
- Dibujarlo = (2,0,1)
- Lista = (1,2,0)
- Regla = (1,1,2)
- Probar = (0,1,2)
- Voz = (1,2,1)

Umbrales por escenario:
- Lápices = (2,1,2)
- Mochila = (2,2,1)
- Ovillo = (1,2,2)

Se permiten combinaciones de 1 a 3 estrategias.

Resultado exhaustivo:

### Lápices
15 combinaciones válidas.
Soluciones mínimas:
- Dibujarlo + Regla
- Dibujarlo + Probar
- Dibujarlo + Voz
- Lista + Regla
- Regla + Voz
- Lista + Probar + Voz

### Mochila
15 combinaciones válidas.
Soluciones mínimas:
- Dibujarlo + Lista
- Dibujarlo + Voz
- Lista + Regla
- Lista + Voz
- Regla + Voz
- Dibujarlo + Regla + Probar

### Ovillo
16 combinaciones válidas.
Soluciones mínimas:
- Dibujarlo + Voz
- Lista + Regla
- Lista + Probar
- Regla + Probar
- Regla + Voz
- Probar + Voz

Conclusión:
- ningún escenario tiene una única solución;
- ningún escenario exige una única estrategia;
- no hay una estrategia universal que resuelva sola los tres;
- la apertura es suficiente para pasar a HUMAN QA de concepto.

## 4. Límites declarados
- La matriz de apertura prueba diversidad combinatoria del diseño, no la calidad final de la experiencia.
- El storyboard no valida todavía legibilidad espacial, comprensión humana ni accesibilidad real.
- No se ha decidido banda de edad.
- No se ha escrito código.
- No se toca `main`, producción ni PR #405.

## Gate

`CADA_CEREBRO_3D_STUDY_STORYBOARD_OPENING_R01_READY_FOR_HUMAN_QA`

Siguiente paso sólo tras HUMAN QA de María:
código ES/EN + DOM paralelo accesible + three.js vendorizado + NORMAL/REDUCED/NONE + forced-colors + 320/390/1440 + prueba completa.
