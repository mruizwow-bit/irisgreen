# R62 · ASTRA / HUMAN QA · P03 · RUTAS DE LUZ · REWORK

Fecha: 29/09/2026  
Issue: #326  
Autoridad de producto: María  
Dirección/revisión: Astra  
Responsable de rework: Claude

Estado:

`R62_P03_HUMAN_QA_REWORK_REQUIRED`

Esta orden supersede el estado de mera autorización de concepto de `04_CLAUDE_P03_RUTAS_LUZ.md` como siguiente acción operativa. P03 sigue siendo el piloto autorizado, pero su primera ejecución visual no pasa HUMAN QA/E4.

## 1. Qué falla

### 1.1 No se lee como una sala

La propuesta se percibe como un alzado de muro con elementos colgados.

Faltan:
- suelo;
- testeros/laterales;
- volumen;
- profundidad;
- perspectiva;
- relación espacial entre piezas y arquitectura.

P01 y P02 son referencia de nivel de ejecución, no de estilo: P01 tenía volumen arquitectónico y P02 construía mundo, vaso, sustrato y fondo. P03 debe alcanzar la misma lectura espacial con lenguaje propio.

### 1.2 El muro domina como retícula casi perfecta

La superficie principal se resuelve como cuadrícula regular.

Eso debilita:
- materia;
- geometría;
- profundidad;
- composición;
- acabado perceptivo E4.

No sustituir la cuadrícula por ruido decorativo. La pared debe tener construcción material y jerarquía espacial.

### 1.3 La luz no actúa

El haz no produce suficiente consecuencia visible sobre el entorno.

FAIL:
- pilares/espejos sin contacto/sombra legible;
- haz que pasa junto a una pared sin iluminarla;
- luz que se comporta como barra gráfica.

La luz debe construir la escena:
- incidir en superficies;
- generar contacto/sombra/oclusión;
- producir rebote/reflejo o cambio perceptible cuando corresponda;
- explicar la mecánica dentro del mundo.

### 1.4 El bastidor añade ruido

Las siete verticales repartidas por el ancho se leen como otra cuadrícula superpuesta.

Los soportes deben:
- pertenecer a la arquitectura;
- tener profundidad;
- responder a la luz;
- organizar la interacción.

Eliminar o reducir elementos que solo funcionen como overlay repetitivo.

## 2. Qué se conserva

KEEP:
- P03 · Rutas de luz como producto;
- bucle conectar → desviar → observar → comparar → rehacer;
- varias soluciones;
- luz como material;
- sin puntuación/velocidad obligatoria;
- accesibilidad prevista;
- taxonomía AGE_*;
- tokens globales del chrome;
- separación visual respecto a P01 y P02.

No convertir el rework en otro juego.

## 3. Rework R2 obligatorio

Claude debe:

1. reconstruir el encuadre como **sala tridimensional legible**;
2. incluir suelo y al menos dos referencias espaciales laterales/testeros o equivalente convincente;
3. reducir la regularidad de la pared mediante materia, juntas/variación e imperfección apropiada;
4. hacer que la luz ilumine realmente superficies y genere contacto/sombra/reflejo/oclusión;
5. integrar espejos, nodos, pilares y soportes en la arquitectura;
6. eliminar verticales cuya única función sea crear una retícula;
7. mantener lectura clara de la ruta sin recurrir a neón agresivo, bloom o color-only;
8. mantener composición móvil propia, no desktop reducido.

## 4. Entrega R2

Entregar como mínimo:
- gameplay 1440;
- segundo estado 1440 con otra ruta o transformación;
- móvil 390;
- LIGHT/NAVY del chrome cuando aparezca interfaz;
- detalle QA que demuestre `luz → superficie → sombra/reflejo/resultado`;
- nota de comparación contra E4, especialmente §§ 2, 7, 8 y 15.

La mecánica debe seguir siendo comprensible si se oculta el texto explicativo.

## 5. Gate

Marcador esperado:

`R62_P03_RUTAS_LUZ_E4_R2_READY_FOR_ASTRA_MARIA`

STOP después de entregar R2.

Astra review → HUMAN QA María.

Hasta entonces:
- P04 HOLD;
- P05 HOLD;
- P06 HOLD;
- Codex #321 HOLD;
- A2 HOLD;
- no main;
- no producción.

## 6. Normativa

No cambia normativa transversal.

Aplica directamente:
- `IRIS_GREEN_VISUAL_STANDARD_SEP_2026`;
- `IRIS_GREEN_VISUAL_EXECUTION_TARGET_E4_PREMIUM_2026`;
- `IRIS_GREEN_GLOBAL_UI_TOKENS_2026`;
- `IRIS_GREEN_LOW_STIMULATION_SURFACE_STANDARD_2026`;
- `IRIS_GREEN_AGE_TAXONOMY_2026`;
- WCAG/ISO/EN/COGA vigentes.

El registro normativo específico de esta aplicación está en:
`NORMATIVA/ADDENDUM_R62_P03_E4_APPLICATION_20260929.md`.
