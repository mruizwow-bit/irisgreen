# SENDA · PRÁCTICAS RESUELTAS R01

Fecha: 30/09/2026  
Estado: `SENDA_PRACTICE_SET_R01_COMPLETED_SELF_REVIEW_PENDING`

Estas prácticas son formación. No modifican producto ni autorizan gates R59.

---

## P1 · Experiencia antes que renderer

Caso de entrenamiento:
“Aves”.

### Pregunta humana
¿Qué aves puedo observar y cómo distingo algunas especies por contexto, forma, hábitat o estación?

### Acción principal
Observar → seleccionar → comparar rasgos → identificar/consultar.

### Información mínima
- especie;
- rasgos visuales relevantes;
- hábitat;
- estacionalidad cuando sea fiable;
- región/contexto;
- fuente.

### Primera representación
Escena/hábitat curado + observación dirigida.

No:
- mapa mundial primero;
- feed infinito de observaciones;
- cards como identidad;
- catálogo exhaustivo.

### Datos
Snapshot curado para experiencia base.
Live solo si una función concreta necesita actualidad.

### Alternativa accesible
Lista/tabla estructurada + filtros + descripción visible + navegación por teclado.

PASS de aprendizaje:
`QUESTION_BEFORE_RENDERER`.

---

## P2 · State model de Fósiles

Estados funcionales de entrenamiento:

- IDLE
- LAYER_SELECTED
- EXCAVATING
- FIND_REVEALED
- FOSSIL_SELECTED
- INFO_OPEN

Estado paralelo:
- THEME
- LOCALE
- MOTION_PREFERENCE
- VIEWPORT_CLASS

### Invariantes

1. `INFO_OPEN => active_fossil_id != null`
2. nombre visible de fósil = nombre del `active_fossil_id`
3. un hallazgo no puede figurar REVEALED sin superar el umbral lógico correspondiente;
4. resize/theme/locale no cambia porcentaje excavado;
5. pérdida de renderer no cambia progreso;
6. undo revierte la última transición reversible sin alterar historial previo.

### Error histórico que evita
filename nominal ≠ evidencia nominal.

La captura “T. rex” solo es válida si:
`active_fossil_id == trex` antes de capturar.

---

## P3 · Dragging accesible

Caso:
recomponer un fósil con piezas.

### Método natural
drag pieza → destino.

### Alternativa single pointer
1. tap/click pieza;
2. destinos válidos se identifican;
3. tap/click destino.

### Teclado
1. Tab entra en componente;
2. flechas cambian pieza/destino cuando el patrón lo justifique;
3. Enter/Espacio selecciona/confirma;
4. Escape cancela selección.

### Voz
controles visibles:
- “Seleccionar pieza”
- “Mover a…”
- “Cancelar”

Accessible name conserva label visible.

### Feedback
- pieza seleccionada;
- destino válido/no válido;
- colocada;
- progreso.

No audio-only.

---

## P4 · Contrato de fuente · GEBCO 2026

### Autoridad
GEBCO / IHO-IOC ecosystem.

### Producto
GEBCO_2026 Grid.

### Naturaleza
modelo global continuo de terreno oceánico/terrestre derivado de datos heterogéneos e interpolación.

### Uso permitido
uso amplio bajo términos publicados, con atribución.

### Limitaciones
- no navegación;
- precisión/cobertura variables;
- resolución de grid no equivale a resolución de medición original;
- no representar como “medición exacta del fondo”.

### Uso Iris hipotético
subconjunto espacial mínimo o valores curados.
No descargar 7 GB para una escena.

### UI
“Relieve batimétrico modelado · GEBCO 2026”
con fuente y fecha.

---

## P5 · REAL_DATA vs SIMULATION

Caso:
Mar.

- profundidad GEBCO: `REAL_DATA_DERIVED_MODEL` en metadatos internos; públicamente explicar “modelo batimétrico”.
- nombre/taxonomía validada: REAL_DATA.
- posición animada de un pez generada por algoritmo: SIMULATION.
- pez moviéndose según rango de profundidad real: sigue siendo SIMULATION.
- dibujo guardado por la persona: USER_CREATED.
- criatura inventada para una actividad creativa: FICTIONAL.

Regla:
usar datos reales para parametrizar no convierte la simulación en observación real.

---

## P6 · Selección de técnica · Minerales

### SVG
Ventajas:
- semántica/DOM;
- ligero;
- excelente para diagramas.

Límite:
insuficiente si el concepto exige materialidad cristalina E4.

### Raster multivista
Ventajas:
- control visual alto;
- coste runtime bajo;
- fallback sencillo.

Riesgo:
muchas vistas × DPR = peso.

### Canvas2D
Ventajas:
- composiciones dinámicas;
- bajo overhead frente a 3D.

Límite:
materialidad/rotación real limitada.

### WebGL
Ventajas:
- PBR;
- iluminación interactiva;
- rotación/volumen.

Riesgos:
- GPU memory;
- context loss;
- complejidad;
- semántica externa obligatoria.

### WebGPU
Ventaja:
techo técnico mayor.

No baseline universal:
solo progressive enhancement.

### Decisión de entrenamiento
No elegir tecnología hasta demostrar concepto/presupuesto.
Si raster multivista alcanza E4 con peso razonable, preferirlo a 3D más complejo.
Si no, escalar a WebGL.
WebGPU no es requisito.

---

## P7 · Performance budget · método

El presupuesto se divide:

### Transferencia
- HTML;
- CSS;
- JS;
- arte;
- fuentes;
- datos;
- motor;
- fallback cargado realmente.

### Runtime
- memoria JS;
- texturas;
- buffers;
- framebuffer;
- long tasks/frames;
- primera interacción.

### Experiencia
- LCP;
- INP;
- CLS;
- first meaningful interaction.

### Móvil
presupuesto más estricto por:
- ancho;
- DPR;
- memoria;
- CPU/GPU;
- red.

Regla:
no fijar un único número universal antes de conocer el piloto.

PASS:
`TOTAL_COST_NOT_ART_ONLY`.

---

## P8 · GPU loss

Prueba de entrenamiento:

1. seleccionar fósil;
2. descubrir 42%;
3. abrir ficha;
4. guardar selección;
5. provocar `WEBGL_lose_context`;
6. comprobar que state store conserva:
   - active fossil;
   - reveal progress;
   - collection;
   - locale;
7. restaurar;
8. recrear texturas/buffers;
9. rerender desde state;
10. assertions equivalentes.

Si restauración falla:
fallback accesible, no pérdida de progreso.

---

## P9 · Visualización compleja accesible

Caso:
perfil de profundidad marina.

Entrega equivalente:
- título corto;
- resumen de tendencia;
- lista de zonas;
- tabla con rangos;
- descripción de relaciones;
- unidades localizadas;
- selección por botones/lista;
- color + patrón/etiqueta.

No:
una alt de 800 palabras;
un aria-describedby con tabla linearizada;
color como único significado.

---

## P10 · Incertidumbre

Caso:
edad de límite estratigráfico.

Mostrar:
`259.857 ± 0.084 Ma`
cuando esa precisión sea relevante y la fuente la publique.

No:
- redondear a un número “exacto” sin indicar incertidumbre;
- inventar más decimales;
- convertir rango en fecha puntual por estética.

Caso GTFS:
`wheelchair_boarding` vacío = DESCONOCIDO/no informado.
No = “inaccesible”.

---

## P11 · Fallos de fuente

Estados distintos:
- LOADING
- EMPTY_RESULT
- OFFLINE
- TIMEOUT
- RATE_LIMITED
- SOURCE_ERROR
- SCHEMA_ERROR
- FALLBACK_SNAPSHOT

Cada uno tiene:
- mensaje humano;
- status accesible cuando corresponda;
- acción disponible;
- reintento controlado;
- fecha del fallback.

Nunca:
retry infinito.

---

## P12 · QA nominal

Secuencia:

1. set target ID;
2. assert target existe;
3. select target;
4. assert active ID;
5. assert visible name;
6. realizar interacción;
7. screenshot;
8. registrar target/active/hash;
9. negative test cambia expected ID;
10. test debe salir nonzero.

Regla:
`EVIDENCE_PROVES_CLAIM`.

---

## P13 · Model-based testing

Modelo reducido:
- selected: id|null
- discovered: Set
- collection: Set
- online: bool
- locale: ES|EN

Commands:
- select(id)
- discover(id)
- save(id)
- remove(id)
- changeLocale()
- offline()
- online()
- undo()

Properties:
- collection subset of valid IDs;
- selected valid or null;
- locale does not alter IDs;
- offline does not erase collection;
- save undiscovered forbidden if product model says so;
- undo restores previous logical state.

---

## P14 · 320 px / orientation

A 320 CSS px:
- escena mantiene viewport 2D si necesario;
- controls reflow;
- ficha sale debajo/overlay usable;
- texto no obliga horizontal scroll;
- touch targets mantienen tamaño;
- foco visible;
- no desktop reducido proporcionalmente.

Portrait y landscape:
misma función, composición distinta.

---

## P15 · ES/EN científico

Reglas:
- IDs y hechos compartidos;
- copy separado;
- `lang`;
- Intl para unidades/rangos/fechas;
- nombres científicos no se “traducen” arbitrariamente;
- glosario si término técnico lo requiere;
- incertidumbre idéntica.

---

## P16 · Derechos por capa

Ejemplo Espacio:

1. dato orbital JPL → contrato factual/fuente;
2. foto NASA → media usage + comprobar tercero;
3. logo NASA → régimen de marca separado;
4. textura original Iris → first-party;
5. audio externo → licencia propia.

Resultado:
nunca “NASA” como licencia única.

---

## P17 · Cognitive load

Dashboard original:
12 controles + 5 paneles + mapa + gráfica + filtros.

Transformación:
1. pregunta;
2. acción principal;
3. 1–3 controles primarios;
4. ficha contextual;
5. “Profundizar”;
6. filtros avanzados bajo demanda.

Adultez:
más profundidad disponible, no más ruido obligatorio.

---

## P18 · E4 sin sobreingeniería

Orden:
1. definir resultado perceptivo;
2. identificar materia/luz/profundidad necesarias;
3. prototipo de técnica mínima;
4. medir;
5. comparar con benchmark;
6. si no alcanza E4:
   `TECHNIQUE_LIMIT_DETECTED`;
7. cambiar técnica.

No:
cinco rondas cosméticas para defender un renderer.

---

# Resultado de autoevaluación R01

Fortalezas demostradas:
- experiencia antes que tecnología;
- separación state/renderer;
- accesibilidad multimodal;
- contratos de fuente;
- epistemología de datos;
- QA/evidencia;
- resiliencia.

Pendiente antes de PASS final:
- examen escrito completo;
- práctica de presupuesto con artefacto real no-producto;
- práctica de profiling real;
- revisión externa/por Aura/Astra si se decide.

Estado:
`SENDA_PRACTICE_SET_R01_COMPLETED_SELF_REVIEW_PENDING`

No certificación externa.
No autorización de build R59.
