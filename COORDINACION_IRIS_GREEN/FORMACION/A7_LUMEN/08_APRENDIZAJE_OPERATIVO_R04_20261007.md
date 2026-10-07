# LUMEN · APRENDIZAJE OPERATIVO R04

Fecha: 07/10/2026
Estado: LUMEN_R04_PRODUCTION_LEARNING_PERSISTED

## 1 · Gate técnico no equivale a gate perceptivo

La producción real volvió a confirmar la lección de #288:
una solución técnicamente avanzada puede seguir siendo visualmente pobre.

En Pecera, Cielo, Sistema Solar y juegos 3D hay que separar:
- arte/visual;
- runtime;
- accesibilidad;
- media;
- packaging;
- HUMAN QA.

Un producto puede estar a la vez en:
VISUAL_KEEP + RUNTIME_REWORK + MEDIA_EVIDENCE_PENDING.

No colapsar estados distintos en un único PASS.

## 2 · QA audiovisual prolongada

Para media inmersiva:
- verificar vídeo y audio por separado;
- comprobar que muxar audio no altera el vídeo;
- comparar elementary stream cuando sea necesario;
- medir LUFS, LRA y true peak;
- revisar fades, picos y continuidad;
- observar sesiones largas.

No concluir “relajante” solo por intención o por métricas.

## 3 · Producción visual por tandas

Patrón aprendido:
10 ASSETS → 1 CONTACT SHEET → REVIEW → REWORK SOLO FAIL.

Consecuencias:
- no regenerar 10 porque fallen 2;
- KEEP significa KEEP;
- rework quirúrgico;
- recomponer la contact sheet con los KEEP originales y solo las correcciones;
- QA técnica después.

## 4 · Contrato técnico de raster first-party

Para master:
- PNG RGBA;
- alpha real 0–255;
- sRGB ICC;
- transparencia real;
- un objeto por archivo;
- hash SHA-256;
- QA BLACK / WHITE / MID-GRAY.

Una contact sheet es evidencia de revisión, no un master.

## 5 · Representación científica

Regla:
ASSIGN_BY_PHYSICS_NOT_AESTHETIC_SIMILARITY.

Si la apariencia está poco constreñida:
- reducir detalle;
- no inventar cartografía;
- usar representación neutral;
- separar observación, cálculo y representación.

Casos aprendidos:
- Haumea: forma alargada sí; superficie específica inventada no.
- Titán: haze opaco en visible; no enseñar la superficie como visible.
- Europa: hielo/fracturas sí; océano interior visible no.
- Ganímedes: regiones oscuras antiguas + terrenos claros acanalados.
- Encélado: plumas como estado, no base obligatoria.

## 6 · Recuperar arte aprobado sin redibujar

Si la imagen aprobada está dentro de una composición:
- extraer;
- limpiar alpha;
- resize premultiplicado;
- centrar;
- normalizar canvas;
- insertar sRGB;
- validar bordes.

Regla:
APPROVED_VISUAL_REFERENCE → TECHNICAL_EXTRACTION, NOT REDESIGN.

## 7 · Generación de imagen no equivale a asset final

Un generador puede devolver:
- tamaño incorrecto;
- alpha 254;
- ICC ausente;
- una lámina cuando se pidieron archivos individuales;
- contaminación de borde.

Por eso:
GENERATED_IMAGE != FINAL_ASSET.

Siempre inspeccionar, normalizar y volver a verificar.

## 8 · Meshy / rigs / GLB

Workflow aprendido:
1. María puede producir modelo + rig.
2. Lumen inspecciona GLB.
3. Validar skin, skeleton y nombres de huesos.
4. Lumen implementa movimiento, pathfinding, orientación, estados y uso.
5. No exigir a María animaciones si el runtime puede resolverlas.

Con rigs humanoides:
- detectar Hips/Spine/Head/brazos/piernas;
- separar locomoción visual de traslación del mundo;
- evitar double root motion;
- ajustar altura al terreno;
- orientar al destino;
- conservar accesibilidad.

Rig compatible NO implica automáticamente que personajes distintos compartan una sola malla.
Si una orden exige compartir geometría por presupuesto, medir y validar antes de afirmarlo.

## 9 · Base 3D existente

Si la orden dice que la base está bien hecha:
- no reconstruir controlador;
- no rehacer reglas;
- no sustituir cámara;
- no romper alcance;
- no borrar accesibilidad;
- no perder pruebas históricas.

Añadir capas sobre la base.

## 10 · Persistencia / privacidad

Si existe localStorage o IndexedDB:
- documentar qué se guarda;
- dónde;
- duración;
- cómo se borra;
- proporcionar borrado dentro de la experiencia.

No afirmar “sin almacenamiento” si existe persistencia local.

Evitar por producto:
- rachas;
- daily rewards;
- pérdida por ausencia;
- cuenta atrás;
- puntuación si la orden la excluye.

## 11 · Licencias y procedencia

Nunca inferir licencia desde el nombre del proveedor.

Registrar:
- fuente;
- plan usado;
- términos aplicables;
- atribución;
- comercial;
- redistribución;
- derivados.

Si falta prueba del plan:
PUBLIC_RELEASE_BLOCKED_PENDING_LICENSE_EVIDENCE.

Los términos actuales de un proveedor no prueban por sí solos qué plan se usó al generar un asset histórico.

## 12 · Faro · producto web

Faro:
- es web, no Unity;
- one engine / five data scenes;
- Casa del Faro + 4 islas;
- three.js local;
- no CDN;
- no mundo abierto.

Presupuestos:
- primera carga ≤ 6 MB;
- isla ≤ 2.5 MB;
- paquete ≤ 15 MB;
- ≤150.000 triángulos;
- ≤150 draw calls;
- 30 fps móvil gama media;
- medir GPU real y declarar renderer.

Si no se midió, no se declara.

## 13 · Faro · low-poly premium

Low-poly no significa placeholder.

Dentro del mismo presupuesto:
- biseles y siluetas naturales;
- terreno con bandas de color;
- vegetación con variantes;
- InstancedMesh;
- color por vértice;
- máximo 14 colores;
- sol cálido / sombra fría;
- agua con gradiente de profundidad;
- orilla clara;
- espuma discreta;
- cielo degradado;
- haze;
- contacto bajo personajes/props.

No usar atlas de texturas para el mundo salvo que la orden lo permita expresamente.

## 14 · Escala

Personaje detallado sobre una isla minúscula convierte el mundo en maqueta.

Regla Faro:
meseta ≥ 20 × ancho de Vera.

Si hace falta, alejar la cámara.
La escala perceptiva es una decisión visual central.

## 15 · UI sobre escena

Accesibilidad no significa llenar la pantalla de paneles.

Faro:
- escena ≥70 % limpia;
- objetivo actual compacto;
- un aviso de ayuda;
- piezas en barra inferior;
- materiales/vista agrupados;
- controles 44 px;
- teclado preservado.

## 16 · Evidencia operacional

Regla:
NO_EVIDENCE__NO_GATE.

Nunca afirmar:
- deploy;
- capturas;
- FPS;
- renderer;
- browser PASS;
- SHA;
- fichero disponible;
sin haberlo verificado.

Todo entregable debe decir:
- path;
- hash;
- commit;
- pruebas ejecutadas;
- pruebas no ejecutadas.

## 17 · Hardware offline

Si IrisGreen está offline:
sí:
- código;
- diseño técnico;
- assets;
- manifests;
- QA estático;
- packaging;
- preparación de harness.

no:
- GPU real;
- capturas de ese hardware;
- interacción real en ese equipo;
- FPS del dispositivo.

Estado:
ADVANCE_INDEPENDENT_WORK__HARDWARE_EVIDENCE_PENDING.
