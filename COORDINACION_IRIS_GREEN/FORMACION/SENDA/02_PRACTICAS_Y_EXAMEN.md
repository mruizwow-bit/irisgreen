# SENDA · PRÁCTICAS Y EXAMEN PROFESIONAL

Fecha: 30/09/2026  
Estado: `SENDA_PRACTICE_EXAM_DEFINED_R01`

Rol:
**Senda · R59**

Especialidad de trabajo:
**Interactive Experience Engineer & Creative Technologist**  
**Ingeniería de Experiencias Interactivas y Tecnología Creativa**

No equivale a certificación externa.

---

## Práctica 1 · Experiencia antes que renderer

Caso:
un interés dispone de:
- API;
- coordenadas;
- datos tabulares;
- posibilidad de Three.js.

Resolver:
1. pregunta humana;
2. acción principal;
3. información mínima;
4. representación;
5. técnica;
6. alternativa accesible;
7. qué NO cargar.

PASS:
la técnica no determina la experiencia.

---

## Práctica 2 · State model

Diseñar una máquina de estados para una experiencia de descubrimiento.

Incluir:
- estados legales;
- transiciones;
- precondiciones;
- estado final;
- undo/redo;
- pérdida/restauración de renderer;
- invariantes.

PASS:
ningún estado visual contradictorio y el estado funcional sobrevive al renderer.

---

## Práctica 3 · Dragging accesible

Diseñar una mecánica natural de arrastre con:
- pointer drag;
- alternativa single-pointer sin drag;
- teclado;
- touch;
- foco visible;
- feedback de estado.

PASS:
ninguna capacidad depende únicamente de drag o teclado.

---

## Práctica 4 · Fuente científica

Tomar una fuente externa.

Crear contrato:
- autoridad;
- versión;
- query;
- campos;
- subset;
- licencia de datos;
- licencia de medios;
- atribución;
- incertidumbre;
- snapshot/live;
- fallback;
- refresh;
- failure mode.

PASS:
fuente, datos, medios y marca están separados.

---

## Práctica 5 · Dato vs simulación

Caso:
una escena usa observaciones reales para parametrizar un modelo.

Clasificar y explicar:
- REAL_DATA;
- SIMULATION;
- USER_CREATED;
- FICTIONAL.

PASS:
la simulación sigue declarada como simulación aunque use datos reales.

---

## Práctica 6 · Técnica gráfica

Comparar para un mismo concepto:
- DOM/SVG;
- Canvas2D;
- raster/híbrido;
- WebGL;
- WebGPU.

Evaluar:
- acabado;
- accesibilidad;
- peso;
- memoria;
- móvil;
- fallback;
- riesgo;
- maintainability.

PASS:
se recomienda la técnica menos compleja que alcanza el resultado.

---

## Práctica 7 · Performance budget

Diseñar presupuesto para:
- móvil 390;
- desktop;
- DPR alto;
- first interaction;
- arte;
- JS/CSS;
- motor;
- fuentes;
- fallback;
- GPU memory.

Medir:
- transferencia total;
- LCP;
- INP;
- CLS;
- long frames/tasks;
- primera interacción;
- memoria gráfica.

PASS:
no confundir “peso del arte” con coste total.

---

## Práctica 8 · GPU loss

Simular:
- pérdida de contexto WebGL;
- restauración;
- o pérdida de GPUDevice.

PASS:
- estado funcional preservado;
- recursos gráficos recreados;
- no pérdida de selección/progreso;
- fallback si no puede restaurarse.

---

## Práctica 9 · Visualización compleja accesible

Tomar:
- mapa;
- gráfico;
- diagrama;
- escena informativa.

Entregar:
- nombre corto;
- resumen;
- descripción estructurada;
- datos/relaciones equivalentes;
- no color-only;
- soporte teclado/touch/voz;
- forced colors.

PASS:
la información esencial no depende de visión de la escena.

---

## Práctica 10 · Incertidumbre

Tomar datos con:
- estimación;
- error;
- intervalo;
- interpolación;
- campo desconocido.

PASS:
- no falsa precisión;
- “desconocido” no se transforma en “no”;
- incertidumbre relevante visible/explicable;
- modelo derivado no se presenta como medición exacta.

---

## Práctica 11 · Source failure

Sabotear:
- offline;
- timeout;
- 404;
- 500;
- 429;
- JSON malformado;
- schema incompatible;
- asset CORS;
- media no disponible.

PASS:
- experiencia no queda vacía;
- estado de error es distinguible;
- fallback honesto;
- fecha de snapshot visible cuando corresponda;
- sin retry loop agresivo.

---

## Práctica 12 · QA que prueba lo que dice

Caso inspirado en R59 Fósiles:
captura con filename nominal pero estado activo distinto.

Diseñar:
- selección explícita;
- assertion;
- screenshot;
- manifest;
- negative test;
- exit code real.

PASS:
evidencia y afirmación coinciden.

---

## Práctica 13 · Property/model-based testing

Definir:
- modelo simplificado;
- commands;
- preconditions;
- properties;
- shrink/repro.

Probar secuencias:
- seleccionar;
- descubrir;
- guardar;
- quitar;
- resize;
- locale;
- theme;
- offline;
- undo/redo.

PASS:
encuentra estados imposibles o demuestra invariantes en secuencias amplias.

---

## Práctica 14 · Responsive 320 / orientation

Diseñar una escena que:
- mantiene función a 320 CSS px;
- permite portrait/landscape;
- conserva escena 2D cuando sea esencial;
- reflow de controles/texto;
- no miniaturiza desktop.

PASS:
la excepción bidimensional no se extiende a toda la interfaz.

---

## Práctica 15 · ES/EN científico

Traducir una ficha con:
- unidades;
- fechas;
- rangos;
- nombres propios/taxonómicos;
- término técnico;
- dato con incertidumbre.

PASS:
- lang correcto;
- Intl cuando corresponda;
- hechos idénticos;
- claridad natural;
- no concatenación frágil.

---

## Práctica 16 · Licencia por capa

Caso:
- datos NASA;
- fotografía de tercero;
- logo NASA;
- composición Iris;
- audio de repositorio externo.

PASS:
cinco capas con derechos/procedencia independientes.

---

## Práctica 17 · Cognitive load

Transformar un “dashboard completo” en experiencia progresiva.

Mantener:
- profundidad disponible;
- acción principal;
- reorientación;
- progreso;
- ayudas.

PASS:
adultez no equivale a máxima densidad.

---

## Práctica 18 · E4 sin sobreingeniería

Recibir un concepto visual premium.

Proponer:
- materialidad;
- luz;
- profundidad;
- microdetalle;
- técnica;
- presupuesto;
- fallback;
- reduced motion;
- móvil.

PASS:
si una técnica no alcanza el nivel, declarar `TECHNIQUE_LIMIT_DETECTED` y cambiarla; no defender el motor.

---

# EXAMEN DE SENDA

Responder con razonamiento y evidencia:

1. ¿Cuál es la profesión de Senda y qué problema resuelve?
2. ¿Por qué una API no define una experiencia?
3. ¿Cuándo un mapa es CENTRAL, LIGHT o NONE?
4. ¿Cuándo usar live y cuándo snapshot?
5. ¿Qué diferencia hay entre dato, visualización derivada y simulación?
6. ¿Por qué WebGPU no puede ser una dependencia única?
7. ¿Qué debe sobrevivir a una pérdida de GPU?
8. ¿Qué diferencia existe entre keyboard accessibility y alternativa single-pointer a dragging?
9. ¿Por qué Canvas/WebGL no deben contener la única semántica?
10. ¿Cómo se hace accesible un gráfico complejo?
11. ¿Qué significa “unknown != no”?
12. ¿Cómo se evita falsa precisión científica?
13. ¿Qué diferencia hay entre licencia de dato y licencia de media?
14. ¿Qué demuestra un manifest y qué NO demuestra?
15. ¿Por qué un test que sale exit 0 puede ser inválido?
16. ¿Qué distingue product correctness, test correctness y evidence correctness?
17. ¿Cómo se diseña un performance budget?
18. ¿Qué se mide además de bytes transferidos?
19. ¿Qué significa E4 sin sobreingeniería?
20. ¿Cuándo declarar TECHNIQUE_LIMIT_DETECTED?
21. ¿Cómo se preserva progreso con undo/back?
22. ¿Qué ocurre a 320 px con una escena bidimensional?
23. ¿Cómo se mantiene calidad visual con reduced motion?
24. ¿Por qué un recurso NASA no implica permiso para usar su logo?
25. ¿Por qué una observación eBird no da permiso sobre un canto de Macaulay?
26. ¿Qué diferencia hay entre un campo GTFS vacío y “no accesible”?
27. ¿Por qué GEBCO no debe presentarse como medición exacta del fondo?
28. ¿Por qué la versión ICS debe quedar fijada?
29. ¿Cómo se prueba que R58 no deriva accidentalmente de R48?
30. ¿Cuándo un resultado automatizado necesita HUMAN QA?

---

# Gate interno de formación

Gate futuro, solo tras prácticas/examen revisados:

`SENDA_INTERACTIVE_EXPERIENCE_ENGINEERING_FOUNDATION_PASS`

No equivale a:
- certificación universitaria;
- certificación ISO;
- acreditación W3C;
- título profesional externo.

Estado actual:
`SENDA_PRACTICE_EXAM_DEFINED_R01`

La formación continúa.
