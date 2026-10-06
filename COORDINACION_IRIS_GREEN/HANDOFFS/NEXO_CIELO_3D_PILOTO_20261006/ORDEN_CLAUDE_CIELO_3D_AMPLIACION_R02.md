# NEXO · ORDEN CIELO 3D · AMPLIACIÓN R02 SOBRE DIRECCIÓN ELEGIDA

Fecha: 2026-10-06  
Autoridad de producto: María  
Coordinación: Nexo  
Ejecutor previsto: Claude Design  
Estado: ORDEN ACTIVA  
Base elegida: `CIELO_3D_PILOTO_R01.zip`  
SHA256: `369b37a569a26689f7b52197a6393280d538ef4a413d65ceae98042a19dfb813`

## 1. Decisión cerrada

María ha probado personalmente el piloto 3D y ha elegido la esfera celeste continua como dirección de producto.

No repetir comparación 2D vs 3D.  
No volver a condicionar esta dirección a una nueva elección.  
R02.1 se conserva únicamente como referencia/rollback.

La revisión técnica ya realizada sobre R01 no invalida la elección de producto. Sus correcciones concretas se integran durante esta ampliación.

## 2. Objetivo

Convertir el piloto 3D en la siguiente base funcional de Cielo:

`EXPLORE → LOCATE → REVEAL`

Experiencia:
- observador fijo dentro de la esfera celeste;
- orientación continua;
- pan/orientación siguiendo la mano/puntero;
- zoom anclado al punto señalado;
- selección directa de estrellas/patrones;
- cielo continuo, sin selector de “campos” como metáfora visible;
- localizar una constelación y después revelarla;
- conservar orientación al abrir/cerrar ficha;
- navegación espacial comprensible sin retícula obligatoria.

## 3. Alcance de esta entrega

Ampliar desde Orión + zona adyacente hasta una muestra suficientemente grande para demostrar que el modelo escala sin perder continuidad.

Entrega R02:
- mínimo 8 constelaciones reales conectadas espacialmente, incluyendo Orión y Tauro;
- relaciones reales de vecindad;
- estrellas del catálogo existente;
- fichas y fuentes ya existentes reutilizadas;
- capa de hallazgos;
- pistas observacionales basadas en forma, relación, brillo relativo y star-hopping;
- hallazgo fuera de orden permitido;
- primera visita sin revelar “Orión” ni otro objetivo por nombre.

No escalar todavía a 88/88 hasta que esta ampliación demuestre continuidad, selección, foco, accesibilidad y rendimiento.

## 4. KEEP obligatorio

Conservar del piloto:
- esfera/canvas 3D;
- observador fijo;
- catálogo y magnitudes existentes;
- cero estrellas inventadas;
- clic/tap directo;
- teclado;
- ES/EN;
- NAVY;
- NORMAL / REDUCED / NONE;
- recursos locales;
- no autoplay/giro automático;
- no vuelo por el espacio;
- no retícula como interacción principal;
- no rehacer masters aprobados.

Conservar del Cielo R02 anterior cuando sea útil:
- fichas progresivas;
- fuentes;
- cuaderno/hallazgos;
- dos etapas LOCATE → REVEAL;
- persistencia saneada;
- cancelación de cargas obsoletas;
- borrado separado de reset;
- controles alternativos al drag.

## 5. Correcciones obligatorias incorporadas

### C3D-01 · evidencia independiente del viewport
Separar:
- tolerancia motora en CSS px;
- evidencia astronómica/geométrica.

Misma evidencia celeste + misma cámara semántica debe producir la misma decisión en 320 / 390 / 1440.

### C3D-02 · ambigüedad
No resolver una ambigüedad usando proximidad CSS que cambie con viewport.

Si hay más de un candidato plausible:
- no revelar;
- ofrecer opciones o feedback inequívoco sin spoilers;
- mantener la orientación.

### C3D-03 · foco y modalidad
El foco programático no debe convertir la alternativa central en la metáfora principal.

Prioridad:
1. clic/tap directo;
2. teclado/alternativa accesible;
3. control central sólo como apoyo secundario.

### C3D-04 · pinch → un dedo
Rehacer el oracle:
- mismo pointerId superviviente;
- desplazamiento pequeño y no nulo;
- sin salto de cámara;
- sin cambiar de dedo artificialmente.

### C3D-05 · selección visible
Un patrón no se localiza por una fracción semánticamente insuficiente de estrellas visibles.
Overlay, hit-test y reveal deben compartir la misma lógica de observabilidad.

### C3D-06 · fichas async
Cerrar/cambiar ficha invalida callbacks anteriores aunque se permanezca en la misma zona.

### C3D-07 · persistencia
Guardar cámara/orientación con números finitos y rangos válidos después del movimiento pertinente; sanear datos al cargar.

### C3D-08 · paneles
La ficha no debe tapar el objetivo observado.
En móvil usar composición que preserve el cielo; en escritorio dock/opuesto cuando sea posible.

### C3D-09 · pistas
No depender de magnitud numérica como pista primaria.
Favorecer rasgos observables y relaciones espaciales.

### C3D-10 · continuidad de foco
Transiciones de pantalla/panel con destino de foco determinista, retorno de foco y resize sin perder el elemento activo.

## 6. Interacción de entrada

Primera visita:
- “Empezar a explorar / Start exploring”.
- No “Empezar por Orión”.
- No nombre de objetivo antes del hallazgo.

Tras un hallazgo:
- sí puede aparecer “Volver a Orión”, “Seguir explorando”, etc.

No temporizadores para presionar a la persona.

## 7. Accesibilidad y modos

Obligatorio:
- teclado completo;
- touch/pointer;
- alternativa a drag;
- foco visible;
- 44 px mínimos en controles;
- reflow 320/390/1440;
- 200 % texto;
- forced-colors;
- NORMAL / REDUCED / NONE;
- reduced motion sin movimientos inesperados;
- live regions sólo para cambios útiles;
- confirmaciones destructivas con semántica coherente y retorno de foco.

Normativa de referencia:
- WCAG 2.2 AA;
- WAI-ARIA 1.2 cuando aplique;
- EN 301 549 como objetivo técnico;
- COGA/APG como guía informativa.

## 8. Rendimiento

Medir en ejecución real:
- FPS;
- memoria;
- tiempo de arranque;
- input latency perceptible;
- número de estrellas/renderables;
- resize;
- móvil 320/390;
- 1440 escritorio.

No aumentar complejidad visual si no mejora orientación/descubrimiento.

## 9. QA mínimo de autor

Entregar:
- tests unitarios;
- tests de invariancia 320/390/1440;
- same-sky evidence;
- low-evidence never identifies;
- ambigüedad;
- pinch→one finger;
- foco/resize;
- async stale callback;
- storage corrupt/future;
- NORMAL/REDUCED/NONE;
- ES/EN.

Distinguir:
- tests del autor;
- browser real;
- AT real;
- HUMAN QA.

No llamar PASS independiente a pruebas propias.

## 10. Entrega

Entregar:
- ZIP ejecutable aislado;
- SHA256;
- manifest;
- vídeo real de recorrido;
- resultados de tests;
- capturas 1440 / 390 / 320;
- métricas de rendimiento;
- lista KEEP/CHANGE;
- pendientes;
- documentación de escalado de 8+ hacia 88.

Gate de entrega:
`CLAUDE_SKY_3D_R02_EXPANSION_READY_FOR_NEXO`

Después:
Nexo retest técnico → Axioma accesibilidad/conformidad → HUMAN QA María → decidir escalado 88/88.

## 11. Límites

NO:
- volver a 2D como candidata de producto;
- rehacer constelaciones aprobadas;
- inventar estrellas;
- cambiar datos/fuentes sin necesidad;
- main;
- producción;
- deploy público;
- escalar 88/88 antes de demostrar el patrón.

La dirección 3D ya está elegida. Esta orden es para hacerla crecer bien, no para volver a discutirla.
