# R57 · CODEX · JUEGOS R56 · RECLASIFICAR 297 + CONSTRUIR 6 PILOTOS TRAS GATE VISUAL

Fecha: 28/09/2026  
Autoridad de producto: **María**  
Diseño de producto / revisión: **Astra**  
Constructor técnico: **Codex**  
Integración: **A2**  
Aceptación final: **HUMAN QA María**

## ESTADO DE ENTRADA

Diseño canónico:
#320 · R56

Estado:
`R56_ASTRA_GAMES_RESOURCES_PLAY_SYSTEM_DESIGN_FROZEN`

Codex ejecuta técnicamente R56.

**No rediseña R56.**
**No inventa dirección artística.**
**No escala 297 elementos.**

---

# 0. REGLA DE TRABAJO

Orden obligatoria:

1. reclasificar 297/297;
2. Astra revisa clasificación;
3. Astra/María aprueban concepto visual de 6 pilotos;
4. Codex construye solo esos 6;
5. Astra revisa;
6. María HUMAN QA;
7. solo entonces se autoriza escala.

Regla:
**PILOTOS → ESTÁNDAR APROBADO → ESCALADO.**

---

# 1. FASE INMEDIATA · P0 · RECLASIFICAR 297/297

Fuente funcional vigente:
- dataset R42 de 297 registros;
- no borrar ningún registro;
- no renombrar rutas públicas aún;
- no migrar todavía a Rutinas.

Clasificar cada registro como:

`GAME`
Juego autónomo real.

`ROUTINE_PRACTICE`
Práctica interactiva asociada a una rutina/tarea cotidiana.

`TOOL`
Herramienta práctica.

`INTEREST_MINIGAME`
Minijuego cuyo lugar natural es un interés concreto.

## Campos mínimos

Crear matriz machine-readable con 297 filas:

- game_id;
- title_es;
- title_en;
- current_type;
- current_context;
- current_stages[];
- lineage;
- `product_kind`;
- `play_loop`;
- `intrinsic_play = YES | NO`;
- routine_id, si aplica;
- interest_id, si aplica;
- `classification_confidence = HIGH | MEDIUM | LOW`;
- `needs_human_review = true | false`;
- keep / rework / merge;
- visual_status;
- accessibility_status;
- notes.

## Criterio de GAME

Debe existir:
- acción principal interesante por sí misma;
- sistema que responde;
- decisión/descubrimiento/puzle/exploración/construcción/experimentación;
- feedback;
- razón intrínseca para continuar.

NO basta:
- ordenar pasos de una rutina;
- elegir siguiente paso;
- encontrar paso que falta;
- checklist cotidiano;
- pregunta/respuesta con decoración.

## Criterio de ROUTINE_PRACTICE

Si la actividad existe principalmente para practicar una tarea real:
- higiene;
- vestirse;
- cocinar;
- preparar mochila;
- transporte;
- compras;
- citas;
- tareas;
- rutina de mañana/noche;
- organización cotidiana;
entonces presumir `ROUTINE_PRACTICE` salvo evidencia clara de juego autónomo.

No degradar el contenido.
Cambiar su casa de producto.

## Gate P0

- 297/297 clasificados;
- 0 sin product_kind;
- 0 IDs perdidos;
- conteos por categoría;
- lista LOW confidence;
- no cambios destructivos;
- no UI pública todavía.

Marcador:

`R57_CODEX_GAMES_297_CLASSIFICATION_READY_FOR_ASTRA`

**STOP DE PRODUCTO AQUÍ.**

Codex puede seguir con pruebas técnicas internas no públicas, pero NO construir el arte final ni escalar sin el gate siguiente.

---

# 2. GATE VISUAL PREVIO A PILOTOS

Astra/María entregarán/aprobarán concepto para los 6 pilotos.

Marcador que desbloquea construcción:

`R56_PLAY_6_PILOT_CONCEPTS_APPROVED_FOR_CODEX`

Sin ese marcador:

**NO implementar dirección visual final.**

Codex no sustituye conceptos faltantes por:
- iconos;
- SVG genérico;
- gradientes;
- placeholders;
- estilo “educational app”;
- assets de stock;
- estética copiada de otros juegos.

---

# 3. FASE P2 · CONSTRUIR SOLO 6 PILOTOS

## P01 · Habitación imposible

Tipo:
puzle espacial/visual.

Necesita:
- escena rica;
- objetos manipulables;
- más de una solución;
- interacción pointer/touch;
- alternativa teclado;
- seleccionar→destino como fallback;
- sin cronómetro/puntos.

No convertir en:
“ordena la habitación” cotidiano.

Debe ser un **puzle**.

---

## P02 · Terrario vivo

Tipo:
juguete digital abierto.

Necesita:
- colocar plantas/piedras/agua/refugios;
- cambios visibles del pequeño ecosistema;
- sin ganar/perder obligatorio;
- experimentación;
- snapshot/export opcional.

No usar datos científicos ficticios como reales.

Si hay simulación:
etiquetar `SIMULATION`.

---

## P03 · Rutas de luz

Tipo:
puzle de caminos/conexiones.

Necesita:
- nodos/caminos;
- obstáculos;
- varias soluciones;
- estado accesible no dependiente de color;
- teclado completo;
- visual fuerte.

No copiar Monument Valley ni otra IP.
Solo usar principios generales de puzle espacial.

---

## P04 · Ritmo de colores

Tipo:
juego musical.

Necesita:
- crear patrones;
- escuchar tras acción explícita;
- editar/repetir;
- visualización original;
- volumen/mute;
- reduced motion;
- alternativa visual al audio relevante.

No puntuación de ritmo.
No exigir oído perfecto.

---

## P05 · Pesca tranquila

Tipo:
`INTEREST_MINIGAME`.

Vive dentro del interés adecuado de mar/fauna.

Bucle:
`explorar → observar señal → pescar → descubrir → ficha → colección opcional`.

Necesita:
- mundo original Iris Green;
- fauna/datos reales cuando corresponda;
- ficha con fuente;
- interacción tranquila;
- alternativa accesible a timing fino.

Prohibido:
- copiar Animal Crossing;
- sus personajes;
- UI;
- escena;
- proporciones;
- assets;
- sonidos;
- rarezas;
- progresión.

Inspiración permitida:
solo estructura abstracta:
**explorar + descubrir + coleccionar**.

---

## P06 · Mi museo

Tipo:
sistema de colección de Intereses.

Puede reunir:
- peces;
- conchas;
- minerales;
- fósiles;
- especies;
- objetos temáticos.

Necesita:
- exposición visual agradable;
- organizar/consultar;
- ficha accesible;
- filtro/búsqueda cuando proceda.

Persistencia:
- default de sesión;
- guardar solo con acción explícita;
- no cuenta;
- no tracking;
- no obligación de volver.

No:
- streaks;
- logros compulsivos;
- cofres;
- recompensas diarias;
- rareza artificial para retención.

---

# 4. ARQUITECTURA TÉCNICA

Mantener MPA/progressive enhancement.

No introducir framework global.

Se permite por piloto:
- SVG;
- Canvas2D;
- PixiJS;
- Three/WebGL cuando aporte;
- Web Audio/Tone existente;
- assets first-party.

Compartir motores solo cuando tenga sentido.

**No crear un único “game renderer” genérico para los seis.**

Pueden compartir:
- input;
- a11y helpers;
- storage adapter;
- audio controls;
- state lifecycle;
- responsive shell.

Cada piloto conserva mecánica y lenguaje visual propios.

---

# 5. VISUAL · REGLA DURA

Codex implementa contra concepto aprobado.

Objetivo:
**calidad visual magnífica**.

No usar como techo:
- 3 KB SVG;
- número mínimo de elementos;
- template uniforme.

Permitido:
- SVG rico;
- Canvas;
- assets WebP/AVIF originales;
- render/snapshot de motores;
- texturas first-party;
- vector+raster.

Prohibido:
- stock genérico;
- copiar escenas protegidas;
- imitar UI identificable de juegos comerciales;
- personajes ajenos;
- “tres pictogramas sobre un gradiente”.

Cada piloto debe tener:
- profundidad;
- luz;
- material/volumen cuando corresponda;
- composición;
- identidad propia;
- buen acabado.

---

# 6. ACCESIBILIDAD OBLIGATORIA

Cada piloto:

- teclado completo;
- pointer/touch;
- drag no único método;
- seleccionar→destino o equivalente;
- controles >=44 px;
- foco visible;
- 320 px;
- zoom/reflow;
- forced colors cuando proceda;
- reduced motion;
- sin flashes;
- sin pulsación rápida obligatoria;
- sin mantener pulsado como requisito;
- no depender solo de color;
- sonido solo tras acción;
- volumen/mute;
- contenido significativo con alternativa textual;
- lector de pantalla con estados comprensibles.

No crear “versión accesible aparte”.

**Es el mismo juego.**

---

# 7. CHILD-SAFE / ETAPAS

Los 6 pilotos deben clasificarse en el sistema vigente.

No pedir:
- diagnóstico;
- fecha de nacimiento;
- perfil.

Infancia puede cambiar:
- starter;
- complejidad;
- copy;
- tamaño de objetos.

No significa:
- estética bebé;
- mascotas obligatorias;
- cartoon genérico.

---

# 8. DATOS / INTERESES

P05/P06 consumen contrato R48.

Separar siempre:
- `REAL_DATA`;
- `SIMULATION`;
- `USER_CREATED`;
- `FICTIONAL`.

No inventar especie/dato real.

Fuentes reales:
trazables y citable según R48.

No cargar datasets masivos en primer viewport.

---

# 9. STORAGE / PRIVACIDAD

Default:
sesión/local temporal según contrato existente.

Guardar:
solo tras acción explícita.

No:
- cuenta;
- perfil oculto;
- analytics de conducta;
- sincronización externa;
- colección enviada al servidor.

Export/import de archivo first-party permitido cuando corresponda.

---

# 10. QA P2

Por piloto:

## Funcional
- empezar;
- jugar;
- reiniciar;
- salir;
- cambio de etapa si aplica;
- guardar/exportar si aplica.

## A11y
- teclado;
- lector;
- reduced motion;
- forced colors;
- 320;
- reflow;
- foco.

## Visual
- captura 1440;
- captura 390;
- comparación con concepto aprobado;
- before/after;
- técnica usada;
- peso;
- frame time si anima.

## Producto
Codex debe responder:
- qué hace divertido/interesante el piloto;
- por qué no es una rutina;
- por qué pertenece a Juegos o Intereses;
- qué parte es opcional.

---

# 11. ENTREGA P2

Marcador:

`R57_CODEX_PLAY_6_PILOTS_READY_FOR_ASTRA`

Entregar:
- branch;
- base HEAD/tree;
- final HEAD/tree;
- diff;
- clasificación 297/297;
- 6 pilotos;
- screenshots;
- recordings si hay movimiento;
- ES/EN;
- QA;
- performance;
- child-safe;
- fuentes;
- pendientes.

Después:
Codex → Astra → María HUMAN QA.

Solo tras:

`R56_PLAY_SYSTEM_STANDARD_APPROVED_FOR_SCALE`

se emite orden de escalado.

---

# 12. LÍMITES

No tocar:
- R53 Rincón;
- R54 Taller;
- Home final;
- Cloud;
- voz Sabik;
- producción.

No borrar los 297.
No migrar en masa antes del gate.
No main.
No deploy producción.
No abrir Ola de escalado por iniciativa propia.