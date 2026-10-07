# APRENDIZAJE_AXIOMA_2026-10-07

Fecha: 07/10/2026  
Rol: Axioma · Quality, Accessibility & Standards Lead  
Estado: `PRACTICE_ADVANCED__PRODUCT_EVIDENCE_AND_HUMAN_QA_GATES`

## Regla profesional consolidada

`CLAIM → SOURCE/ARTIFACT → VERSION → PRECONDITION → ORACLE → INDEPENDENT_RETEST → HUMAN_QA → SCALE`

No convertir:
- una demo técnica en producto terminado;
- un test verde en prueba de calidad humana;
- ausencia de casos observados en imposibilidad;
- geometría visible en evidencia si el punto que sostiene la decisión no se renderiza;
- compatibilidad de lectura de un storage futuro en permiso para sobrescribirlo;
- “3D” en sinónimo de WebGL;
- “game-first” en gamificación, checklist o tutorial;
- “workspace-first” en interfaz vacía o técnica;
- un medio visual atractivo en obligación de usar ese mismo medio dentro de todos los estudios.

---

## 1. Evidencia y oráculos · aprendizaje transversal

### 1.1 El oráculo debe probar exactamente la afirmación

Un test puede pasar y seguir siendo inválido si:
- no alcanza la precondición;
- cambia el objeto que dice seguir;
- comprueba una propiedad indirecta;
- mide datos ya guardados en vez de recalcularlos;
- prueba alcanzabilidad y se presenta como precisión.

Reglas nuevas:
- `PRECONDITION_REACHED > 0` antes de evaluar conflicto/histéresis/ambigüedad;
- distinguir `PRODUCT_REAL_CASE` de `DECLARED_FIXTURE`;
- guardar el contraejemplo reproducible, no sólo el porcentaje agregado;
- si el test dice “mismo dedo +1 px”, debe conservar pointerId y producir desplazamiento pequeño no nulo;
- si el test dice “misma evidencia”, no puede permitir que cambie la semántica sólo por CSS px.

### 1.2 La evidencia debe ser observable

Nueva regla:
`EVIDENCE_POINT → RENDERED/OBSERVABLE OR EXCLUDED`.

Cielo 3D R02 mostró un caso crítico:
- Perseo tenía un punto de figura con `estrella=null`;
- el renderer no lo dibujaba como estrella;
- el motor sí lo contaba para alcanzar el mínimo semántico;
- por tanto podía anunciar “3 estrellas” usando 2 estrellas reales + 1 punto no renderizado.

Aprendizaje:
la consistencia entre modelo, renderer, hit-test, overlay y decisión es un gate de integridad, no sólo de UI.

Oracle recomendado:
`ALL_EVIDENCE_POINTS_ARE_RENDERED_OR_EXCLUDED_ORACLE`.

### 1.3 No sobrescribir formatos futuros

Nueva regla:
`UNKNOWN_FUTURE_VERSION → READ_ONLY/TEMPORARY_SESSION`.

No basta con ignorar un guardado futuro al cargar. Si después una interacción normal vuelve a escribir con la versión actual, se destruyen datos que la aplicación no comprende.

Aplicar:
- detección de versión futura;
- `soloLectura=true`;
- no escribir, borrar ni anunciar éxito;
- migración sólo si existe transformador explícito;
- test `FUTURE_STORAGE_NO_OVERWRITE_ORACLE`.

---

## 2. Cielo 3D · aprendizaje de arquitectura espacial

### 2.1 3D no significa WebGL

Un sistema puede tener geometría 3D real y rasterizar en Canvas2D.

El criterio correcto es:
- posiciones/direcciones en espacio 3D;
- cámara/orientación;
- delante/detrás;
- proyección coherente;
- continuidad espacial.

No exigir WebGL sólo por la etiqueta “3D”.

### 2.2 La mejora clave es continuidad, no profundidad visual

La diferencia útil entre Cielo por campos y Cielo esférico continuo es:

`FIELD_SCOPED_PROJECTION → CONTINUOUS_CELESTIAL_SPHERE`.

El valor de producto aparece cuando:
- Orión y Tauro pertenecen al mismo espacio;
- se llega orientando, sin selector;
- no hay carga/cambio de campo;
- el cuaderno puede devolver a una orientación real, no sólo a una pantalla.

No afirmar “esto no puede hacerse en 2D”; el renderer puede seguir siendo 2D.

### 2.3 Separar tolerancia motora de decisión semántica

La tolerancia en CSS px sirve para la mano/puntero.

No debe decidir:
- qué constelación gana;
- si una situación es ambigua;
- evidencia astronómica.

La decisión semántica debe vivir en espacio angular/intrínseco o quedar ambigua de forma consistente.

### 2.4 Foco no es modalidad de entrada

Un foco programático necesario para accesibilidad no debe activar automáticamente:
- retícula;
- ayuda de teclado;
- modo visual específico de teclado.

Mantener:
`FOCUS_STATE != INPUT_MODALITY`.

La modalidad cambia tras input real.

### 2.5 Data-driven de verdad

“Las rutas son datos” exige que la interfaz no conserve excepciones duras como `porAbbr('Ori')`.

Antes de escalar 88:
- raíz del recorrido;
- orientación inicial;
- pistas;
- saltos;
- ayudas;
deben derivar de datos explícitos.

---

## 3. Vida marina 3D · aprendizaje de representación y rendimiento

### 3.1 Billboards pueden validar arquitectura espacial

Para probar:
- cámara;
- raycast;
- luz;
- profundidad;
- selección;
- continuidad;
no hace falta producir modelos 3D definitivos.

Es válido:
`3D WORLD + 2D BILLBOARD ASSET`
si se declara honestamente y no se finge anatomía volumétrica.

Esto reduce coste de prototipado sin rehacer PNG aprobados.

### 3.2 Un parámetro 2D no se hereda ciegamente a 3D

El haz 31°/13° del motor 2D dejó de discriminar correctamente en 3D.

Aprendizaje:
- conservar intención, no número;
- documentar la adaptación;
- no presentar el parámetro nuevo como “igual al 2D”.

### 3.3 Rendimiento depende del entorno de medición

SwiftShader/software rasterizer no puede usarse como conclusión universal de GPU real.

Separar:
- software renderer;
- GPU real;
- desktop;
- móvil físico;
- rAF disponible;
- frame time efectivo.

No comparar FPS de dos arquitecturas si se ejecutan con renderers distintos.

### 3.4 Reproducibilidad exige fijar la fuente exacta

Un generador no es reproducible si dice derivar de “R06.1a” pero no fija:
- artifact/commit;
- SHA del input exacto;
- comando;
- output esperado.

Regla:
`INPUT_SHA → GENERATOR → OUTPUT_SHA`.

---

## 4. Vera · reparaciones localizadas y alcance

### 4.1 Reparar sólo el defecto demostrado

La reparación del bolso mostró una práctica válida:
- comparar contra el original;
- identificar exactamente los vértices que cambian;
- demostrar que el resto queda idéntico;
- verificar 0 influencia residual de huesos erróneos;
- no extender la corrección al vestido sin orden/evidencia.

Regla:
`LOCALIZED_DEFECT → LOCALIZED_PATCH → UNCHANGED_REST_PROOF`.

### 4.2 Un claim cuantitativo debe viajar con su métrica

No aceptar una frase como “mediana 3,7 %” si el JSON empaquetado usa otra métrica y no puede reproducirla.

Toda cifra debe tener:
- nombre de métrica;
- dataset;
- cálculo;
- unidades;
- output reproducible.

---

## 5. El Vado · diferencia entre motor y juego

Una entrega puede tener:
- cámara 3D;
- locomoción;
- construcción;
- inventario;
- guardado;
- animaciones;
y seguir siendo una demo técnica.

Aprendizaje de HUMAN QA María:
“funciona” no equivale a “ya es un juego”.

El loop debe demostrar:
`CONSTRUIR → CONSECUENCIA FUNCIONAL → MUNDO RESPONDE → SIGUIENTE DECISIÓN`.

Para El Vado:
- construir una solución al paso;
- cruzar;
- construir refugio/taller funcional;
- NPC lo usa;
- guardar base;
- continuar con una nueva decisión.

No aceptar como objetivo final:
- colocar N piezas;
- retirar una pieza;
- abrir caja;
- completar checklist.

### Animaciones específicas

No aplicar un clip semánticamente específico a todas las acciones similares.

`Carry_Heavy_Object_Walk_inplace` no debe mapearse a transporte genérico si HUMAN QA dice que no corresponde.

Mejor:
- dejarlo sin asignar;
- usar locomoción neutra temporal;
- introducir “heavy” sólo para una carga realmente pesada y validada.

---

## 6. Web/shell · fuente de verdad y documentación

Un producto puede estar corregido y aun así no estar listo si:
- MANIFEST;
- README;
- registry;
- datos fuente;
- procedencia;
se contradicen.

Regla:
`ONE OWNER PER FACT`.

Ejemplo consolidado:
- `datos/imagenes.json` owner de colocación/rol visual;
- `PROCEDENCIA.json` derivado;
- `sitio.json` no debe duplicar asignaciones viejas.

Añadir oráculos:
- `SOURCE_OF_TRUTH_IMAGE_CONSISTENCY_ORACLE`;
- `PROVENANCE_PACKAGED_FILES_ORACLE`.

La generación reproducible con 0 diff es evidencia importante, pero no reemplaza HUMAN QA.

---

## 7. Creación/Taller · aprendizaje de producto y calidad

Dirección adoptada:

`GAME_FIRST_EVERYWHERE · 3D_FOR_SPATIAL_MEANING · CORRECT_MEDIUM_PER_STUDIO`.

### 7.1 Game-first no es gamificación

Debe significar:
`SITUACIÓN → ACCIÓN → CONSECUENCIA → DECISIÓN → ARTEFACTO`.

No:
- puntos;
- badges;
- mascota;
- tutorial obligatorio;
- checklist;
- éxito por pulsar botones.

### 7.2 3D donde añade significado

3D principal:
- Estructuras;
- Arquitectura;
- Modelado 3D;
- Máquinas;
- Simulaciones espaciales;
- Robótica como gemelo/resultado.

2D/temporal/documental principal:
- Dibujo;
- Diseño;
- Pixel;
- Cómic;
- Color;
- Fotografía;
- Ritmo;
- Composición;
- Síntesis;
- Programación;
- Escritura;
- Lenguas;
- documentación de Juegos de mesa.

Híbridos:
- Circuitos;
- Papiroflexia/poliedros;
- Mundos;
- Juegos de mesa;
- Ideas.

Elegir el medio por tarea, no por moda tecnológica.

### 7.3 HUB 3D no puede ser puerta obligatoria

Debe existir:
- deep link directo;
- lista;
- búsqueda;
- teclado;
- touch;
- NONE;
- navegación sin cámara.

El HUB organiza y orienta; no sustituye el workspace.

### 7.4 Misión y modo libre deben compartir proyecto

No construir una misión como demo separada.

Regla:
`MISSION_PROJECT_CONTINUES_IN_FREE_MODE_WITHOUT_DATA_LOSS`.

Misión y libre usan:
- mismo modelo;
- mismo undo/redo;
- mismas herramientas;
- misma exportación;
- mismo estado accesible.

### 7.5 Elegir vertical slices por incertidumbre que eliminan

Los cinco slices recomendados:

1. Dibujo.
2. Estructuras.
3. Ritmo.
4. Robótica.
5. Escritura con restricciones.

Razón:
- Dibujo demuestra game-first sin 3D;
- Estructuras demuestra 3D/física;
- Ritmo demuestra causalidad temporal;
- Robótica une código + mundo;
- Escritura es el test más duro para demostrar que game-first no deriva en 3D obligatorio.

Mundos y Videojuegos son útiles, pero demasiado favorables al paradigma espacial para ser la primera prueba crítica.

### 7.6 Workspace-first no es empty-first

Aprendizaje de R54:
- una herramienta puede estar arriba y seguir siendo poco atractiva;
- starter/escena rica debe mostrar “qué puedo crear aquí”;
- no iconos ampliados;
- no SVG mínimo como techo de calidad;
- arte visual y UI/chrome son capas distintas.

El arte puede variar.
La UI consume tokens globales.

### 7.7 Gate humano de un slice

Cada slice debe demostrar en 3–5 min:
- primera acción comprensible;
- consecuencia visible;
- decisión real;
- posibilidad de corregir;
- continuidad misión→libre;
- artefacto final propio del dominio;
- teclado/touch/alternativa a drag;
- 320/390/1440;
- 200 %;
- forced-colors;
- NORMAL/REDUCED/NONE;
- ES/EN;
- child-safe sin analizar obra privada.

No aceptar JSON genérico como artefacto universal.

---

## 8. HUMAN QA · aprendizaje operativo

HUMAN QA no es la última formalidad después de los tests.

Puede cambiar:
- dirección de producto;
- significado de una animación;
- profundidad del loop;
- jerarquía visual;
- metáfora de interacción;
- necesidad de escalar.

Ejemplos aprendidos:
- Cielo continuo ganó por continuidad espacial;
- Vida marina 3D se entiende mejor espacialmente;
- El Vado seguía siendo demasiado básico aunque el motor funcionara;
- el gesto de carga pesada fue rechazado aunque técnicamente estuviera integrado.

Regla:
`AUTOMATION PROVES MECHANISM; HUMAN QA PROVES EXPERIENCE`.

---

## 9. Estado de práctica Axioma

Competencias reforzadas:
- análisis de ZIP/artefacto exacto;
- hashing y comparación byte a byte;
- retest Chrome real vía CDP;
- separación test autor / test independiente;
- validación de foco/modalidad;
- pruebas de storage forward-compatible;
- trazabilidad de generación;
- revisión de vídeo/capturas;
- consistencia modelo-renderer-evidencia;
- gates de producto frente a gates técnicos;
- arquitectura 3D/2D por significado;
- definición de vertical slices de alto valor informativo.

Pendientes antes de `AXIOMA_FOUNDATION_PASS_INTERNAL`:
- NVDA real;
- VoiceOver real;
- TalkBack real;
- pruebas de usuario estructuradas;
- braille cuando aplique;
- examen interno completo;
- matriz final de estándares sobre release candidata.

## Regla de continuidad actualizada

`KEEP VALID CORE → PATCH MINIMAL → INDEPENDENT RETEST → AXIOMA PRECHECK → HUMAN QA → SCALE ONLY AFTER EXPERIENCE PASS`.

Y, para reestructuraciones grandes:

`5 HIGH-INFORMATION SLICES → HUMAN QA → FIX PATTERN → SCALE BY WAVES`.

No escalar una arquitectura porque sea nueva, 3D o técnicamente elegante.
Escalar sólo cuando:
- mejora comprensión;
- conserva accesibilidad;
- produce una consecuencia útil;
- la evidencia es reproducible;
- HUMAN QA confirma que aporta.
