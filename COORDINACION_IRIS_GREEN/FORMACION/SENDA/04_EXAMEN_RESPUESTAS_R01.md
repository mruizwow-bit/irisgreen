# SENDA · EXAMEN PROFESIONAL · RESPUESTAS R01

Fecha: 30/09/2026  
Estado: `SENDA_EXAM_R01_COMPLETED_SELF_REVIEW_PENDING`

Este examen es formación interna. No equivale a certificación externa ni autoriza gates de producto.

---

## 1. ¿Cuál es la profesión de Senda y qué problema resuelve?

**Interactive Experience Engineer & Creative Technologist**.

Senda convierte una intención/concepto de producto aprobado en una experiencia interactiva que funcione de verdad: interacción, representación, arte técnico, accesibilidad, datos, rendimiento, resiliencia y QA.

No diseña el producto por autoridad propia cuando la decisión pertenece a María/Astra/Croma, ni sustituye plataforma/release/estándares/legal.

Problema que resuelve:
evitar que una idea visual se convierta en una demo bonita pero frágil, inaccesible, pesada, científicamente ambigua o dependiente de una API.

---

## 2. ¿Por qué una API no define una experiencia?

Porque una API describe disponibilidad de datos, no:
- la pregunta de la persona;
- la acción principal;
- el volumen cognitivo;
- el orden;
- la representación;
- el propósito.

Una fuente con millones de registros no convierte “ver millones” en buena experiencia.

La experiencia decide qué dato necesita.

---

## 3. ¿Cuándo un mapa es CENTRAL, LIGHT o NONE?

CENTRAL:
la posición/relación geográfica responde directamente a la pregunta.

LIGHT:
la geografía contextualiza, pero no es la tarea principal.

NONE:
la ubicación no añade comprensión o acción relevante.

La existencia de coordenadas nunca basta para justificar mapa.

---

## 4. ¿Cuándo usar live y cuándo snapshot?

LIVE:
solo cuando el cambio temporal modifica el valor de la experiencia.

Ejemplos:
- situación reciente;
- paso/estado actual;
- incidencia cuya actualidad sea la pregunta.

SNAPSHOT:
cuando:
- los datos cambian poco;
- la fuente es enorme;
- child-safe/revisión editorial importa;
- se necesita reproducibilidad;
- disponibilidad externa no debe romper el producto.

Snapshot debe llevar fecha/versión/procedencia.

---

## 5. ¿Qué diferencia hay entre dato, visualización derivada y simulación?

Dato:
registro/medición/fuente factual.

Visualización derivada:
representación de esos datos, posiblemente transformados/agrupados/interpolados.

Simulación:
modelo que genera comportamiento/estado, aunque se parametrice con datos reales.

Ejemplo:
profundidad publicada = dato/modelo derivado de fuente;
pez moviéndose según esa profundidad = simulación.

---

## 6. ¿Por qué WebGPU no puede ser una dependencia única?

Porque no tiene soporte universal suficiente para ser la única ruta funcional y puede existir pérdida de dispositivo/capacidad variable.

Debe ser progressive enhancement:
- detectar capacidad;
- usar cuando aporta;
- conservar fallback WebGL/Canvas/DOM según necesidad;
- no perder semántica ni funcionalidad.

---

## 7. ¿Qué debe sobrevivir a una pérdida de GPU?

El estado funcional:
- selección;
- progreso;
- colección;
- filtros;
- locale;
- datos ya obtenidos;
- historial reversible.

No es obligatorio conservar buffers/texturas: se recrean.

Regla:
`STATE_SURVIVES_RENDERER`.

---

## 8. ¿Qué diferencia existe entre keyboard accessibility y alternativa single-pointer a dragging?

Son requisitos distintos.

Teclado:
la acción se puede realizar sin puntero.

Single-pointer alternative:
la acción de dragging se puede completar con click/tap sin mantener y desplazar el puntero.

Ejemplo:
seleccionar pieza → seleccionar destino.

Tener teclado no resuelve por sí solo la barrera de drag para una persona que usa puntero pero no puede arrastrar.

---

## 9. ¿Por qué Canvas/WebGL no deben contener la única semántica?

Porque dibujar píxeles no crea automáticamente:
- roles;
- nombres;
- estructura;
- foco;
- relaciones;
- texto seleccionable/ajustable;
- comunicación accesible de estado.

El mundo puede dibujarse en Canvas/WebGL, pero controles e información esencial necesitan una capa accesible equivalente.

---

## 10. ¿Cómo se hace accesible un gráfico complejo?

No con una alt interminable.

Debe combinar:
- identificación corta;
- resumen de la información principal;
- descripción de relaciones/tendencias;
- tabla/lista/estructura cuando corresponda;
- navegación/controles accesibles;
- no color-only;
- equivalente textual visible cuando beneficie.

---

## 11. ¿Qué significa “unknown != no”?

Ausencia de información no equivale a una afirmación negativa.

Ejemplo:
campo GTFS de accesibilidad vacío = no especificado/desconocido.
No autoriza “esta parada no es accesible”.

---

## 12. ¿Cómo se evita falsa precisión científica?

- conservar precisión de fuente;
- mostrar incertidumbre cuando cambia interpretación;
- no inventar decimales;
- no convertir rango/modelo en valor exacto;
- identificar estimación/interpolación/simulación;
- fijar versión.

---

## 13. ¿Qué diferencia hay entre licencia de dato y licencia de media?

Un dataset puede permitir reutilización mientras:
- una foto;
- un audio;
- un vídeo;
- un logo;
- una ilustración

tienen derechos distintos.

Ejemplo:
observación eBird no concede automáticamente derecho sobre audio/foto Macaulay.

---

## 14. ¿Qué demuestra un manifest y qué NO demuestra?

Demuestra, según su diseño:
- qué archivos fueron declarados;
- integridad/hash;
- correspondencia con una versión.

No demuestra:
- que el contenido sea correcto;
- que el arte sea bueno;
- que la licencia sea válida;
- que el test pruebe lo que afirma;
- que el producto sea accesible.

---

## 15. ¿Por qué un test que sale exit 0 puede ser inválido?

Porque puede:
- detectar fallo pero no devolver código no-cero;
- probar una condición irrelevante;
- omitir una assertion;
- usar fixture incorrecto;
- capturar estado distinto del nominal.

Exit 0 es solo significativo si el contrato del test está bien diseñado.

---

## 16. ¿Qué distingue product correctness, test correctness y evidence correctness?

PRODUCT:
el producto hace lo correcto.

TEST:
el arnés comprueba realmente la propiedad declarada.

EVIDENCE:
la evidencia entregada corresponde a ese test/estado/versión.

Puede existir producto correcto con screenshot equivocado.

R59 Fósiles ya mostró ese caso.

---

## 17. ¿Cómo se diseña un performance budget?

Desde la experiencia y dispositivo objetivo.

Separar:
- transferencia;
- runtime;
- CPU;
- GPU/memoria;
- first interaction;
- responsive;
- fallback.

Incluir:
HTML/CSS/JS/arte/fuentes/datos/motor realmente descargados.

No usar una cifra universal sin contexto.

---

## 18. ¿Qué se mide además de bytes transferidos?

- LCP;
- INP;
- CLS;
- long tasks/frames;
- first interaction;
- draw calls;
- geometrías/texturas;
- memoria observable;
- estabilidad tras repetir entradas/salidas;
- pérdida/restauración GPU;
- decode/upload cost;
- comportamiento en móvil real.

---

## 19. ¿Qué significa E4 sin sobreingeniería?

Conseguir el acabado perceptivo exigido:
- material;
- luz;
- volumen;
- profundidad;
- atmósfera;
- composición;
- identidad;
- móvil;

usando la técnica menos compleja capaz de lograrlo con accesibilidad/rendimiento.

E4 no significa WebGPU ni máximo efecto.

---

## 20. ¿Cuándo declarar TECHNIQUE_LIMIT_DETECTED?

Cuando la técnica elegida no puede alcanzar el resultado aprobado sin:
- artefactos perceptivos;
- peso inaceptable;
- falta de profundidad/materialidad;
- accesibilidad comprometida;
- rendimiento insuficiente.

Entonces se cambia técnica.
No se hacen rondas cosméticas infinitas defendiendo el motor.

---

## 21. ¿Cómo se preserva progreso con undo/back?

El estado funcional vive en un store/modelo independiente de la representación.

Cada transición reversible registra suficiente información para restaurar.

Back/undo no debe:
- borrar inesperadamente trabajo;
- depender de reconstruir píxeles;
- perder colección/selección por cambiar de vista.

---

## 22. ¿Qué ocurre a 320 px con una escena bidimensional?

La parte 2D puede conservar un espacio propio si su significado lo requiere.

Pero:
- controles;
- texto;
- fichas;
- acciones;
- navegación

deben reflow y seguir usables.

No convertir desktop en miniatura.

---

## 23. ¿Cómo se mantiene calidad visual con reduced motion?

Reducir movimiento no significa eliminar calidad.

Conservar:
- composición;
- materialidad;
- luz;
- profundidad;
- estado final.

Sustituir:
- viajes de cámara;
- parallax;
- movimiento continuo;
- transiciones grandes

por:
- cambios instantáneos;
- opacity/fade suave si tolerable;
- estados estáticos.

---

## 24. ¿Por qué un recurso NASA no implica permiso para usar su logo?

Contenido factual/media y marcas institucionales tienen reglas distintas.
Además NASA puede alojar contenido de terceros.

La procedencia “NASA” no es una licencia universal.

---

## 25. ¿Por qué una observación eBird no da permiso sobre un canto de Macaulay?

Porque la observación y el archivo audiovisual tienen derechos separados.
El colaborador conserva derechos sobre el medio según los términos correspondientes.

---

## 26. ¿Qué diferencia hay entre un campo GTFS vacío y “no accesible”?

Vacío:
la información no está especificada.

“No accesible”:
afirmación factual que necesita un valor/fuente que la sustente.

No rellenar desconocido con conclusión negativa.

---

## 27. ¿Por qué GEBCO no debe presentarse como medición exacta del fondo?

Porque es un grid/modelo global derivado de múltiples fuentes, con interpolación y calidad/cobertura variables.

La resolución del grid no significa que cada celda haya sido medida directamente a esa resolución.

---

## 28. ¿Por qué la versión ICS debe quedar fijada?

Porque las edades/límites pueden actualizarse.

Sin versión:
- una cifra futura podría diferir;
- no se podría reproducir el contenido;
- no sabríamos qué autoridad temporal sustentó la ficha.

---

## 29. ¿Cómo se prueba que R58 no deriva accidentalmente de R48?

Test metamórfico/invariancia:

1. tomar fixture;
2. cambiar artificialmente renderer_r48 o r48_build_state;
3. permitir que cambien donor_*;
4. exigir que:
   - primary_mode;
   - play_role;
   - collection_role;
   - proposed_world_scene;
   - r58_decision_basis;
   - keep/rework
   permanezcan idénticos.

Si cambian:
FAIL.

---

## 30. ¿Cuándo un resultado automatizado necesita HUMAN QA?

Siempre que la propiedad final no pueda decidirse completamente de forma objetiva por software.

Ejemplos:
- calidad visual;
- claridad;
- carga cognitiva;
- naturalidad ES/EN;
- experiencia con lector de pantalla;
- comprensibilidad;
- adecuación de interacción;
- tono/no infantilización;
- aceptación de producto.

La automatización reduce errores; no sustituye juicio humano donde el criterio es perceptivo/contextual.

---

# Autoevaluación

Resultado:
30/30 respondidas.

No me asigno automáticamente PASS final porque:
- la autoevaluación no es una revisión independiente;
- falta práctica real de profiling con artefacto de entrenamiento;
- puede ser útil revisión Aura/Astra si María decide usar gate formal.

Fortalezas:
- límites profesionales claros;
- estado separado de renderer;
- accesibilidad multimodal;
- procedencia;
- epistemología;
- QA/evidencia;
- performance como sistema.

Pendientes de entrenamiento:
1. profiling práctico no-producto;
2. leak test;
3. performance marks/assertions;
4. ejemplo de adaptive quality;
5. revisión de formación.

Estado:
`SENDA_EXAM_R01_COMPLETED_SELF_REVIEW_PENDING`

No certificación externa.
No producto modificado.
