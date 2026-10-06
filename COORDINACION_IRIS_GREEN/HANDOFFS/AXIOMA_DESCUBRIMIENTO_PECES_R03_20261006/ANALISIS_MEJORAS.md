# AXIOMA · DESCUBRIMIENTO PECES R03 · ANÁLISIS DE MEJORA

Fecha: 2026-10-06

Estado:
`AXIOMA_MARINE_R03_KEEP_CORE__TARGETED_REWORK_BEFORE_SCALE`

## Evidencia exacta revisada

- app: `descubrimiento-peces-R03-01-app_1(1).zip`
  - SHA-256 `8db78a2746d5171331813fb6757d30eacbea0e4cbbe2227f3a17470c0fe5a144`
- assets: `descubrimiento-peces-R03-02-assets_1(1).zip`
  - SHA-256 `70f8624f441fc4c42cb84fe5382e8f0e7e0866a71f53572ec733c66a941d58cc`
- vídeo: `descubrimiento-peces-R03_1(1).mp4`
  - SHA-256 `0e26985a0b82dad2799c18c3da31838223f96599e4b1463aa7a187a2f228dad4`
  - duración 40,96 s
- entrega combinada reconstruida según `LEEME_EXTRACCION.md`: `MANIFEST_SHA256.txt` = **91/91 PASS**.

## KEEP · lo que no rehacería

- separación datos / motor / interfaz;
- composición alfa corregida luz/oscuro;
- misma deformación para render y muestras de detección;
- click/tap = orientar luz; drag = mover vista;
- teclado físico como vía equivalente;
- cámara y pose separadas;
- pausar congela cámara en la posición visible;
- NORMAL / REDUCED / NONE diferenciados;
- NONE sin natación;
- candidatos reconciliados por id y foco conservado;
- pieza fuera de viewport no cuenta como examinable;
- identidad oculta hasta Examinar;
- carga perezosa por escena;
- error de asset no derriba el resto;
- fuentes locales, NAVY y funcionamiento sin red.

## P0 · cambios antes de escalar

### 1 · Entregar una build de producto, no la build de equipo

`app/datos.js` llega con `modoEquipo:true`.

Eso expone selector de escenas e informe de intake. Para HUMAN QA de producto debe existir una build separada con `modoEquipo:false`; el banco técnico y la escena de 13 no deben contaminar la primera experiencia.

### 2 · Retirar los controles muertos de profundidad hasta que existan tramos reales

`Subir tramo` y `Bajar tramo` están visibles pero siempre responden que solo existe mesopelágica.

Es una falsa affordance y añade carga justo en una experiencia llamada `Bajar al fondo`.

Opciones correctas:
- ocultarlos hasta que haya >=2 tramos; o
- implementar la progresión real.

No mantener controles que no tienen efecto.

### 3 · Robustecer el gesto touch/puntero

Hallazgos de lectura directa:

- `gestos.toqueMaxMs = 420`: una pulsación quieta de >420 ms no ilumina nada aunque nunca haya sido drag.
- `pointercancel` llama al mismo `soltar()` que `pointerup`; si ocurre pronto y sin arrastre puede ejecutar `motor.apuntar(...)` aunque el gesto haya sido cancelado.
- en `NONE`, `motor.apuntar()` cuantiza el puntero a una cuadrícula 1/14. No-motion no necesita perder precisión espacial.

Corrección:
- decidir tap vs drag por desplazamiento, no por una ventana máxima rígida;
- `pointercancel` debe limpiar estado sin ejecutar acción;
- conservar precisión exacta del puntero en NONE; discretizar solo la vía de teclado si hace falta.

Tests nuevos:
`SLOW_TAP_STILL_AIMS`
`POINTER_CANCEL_NEVER_AIMS`
`NONE_POINTER_PRECISION_PARITY`.

### 4 · Mejorar el oráculo de reflow 200%

T10 actual comprueba `document.documentElement.scrollWidth - innerWidth` y el 200% solo en 390.

Eso NO detecta:
- clipping vertical interno;
- `overflow:hidden` en componentes;
- texto tapado;
- diálogos/visor abiertos;
- candidate grid en estados dinámicos.

Aplicar el oráculo aprendido por Axioma:
`REFLOW_INTERNAL_CLIP_ORACLE`

en 320/390/1440 y en estados:
- first view;
- varios candidatos;
- identidad revelada;
- controles abiertos;
- álbum;
- visor;
- ajustes.

### 5 · Mejorar el oráculo de natación

`NADO` y `qa-movimiento-y-quietud` usan principalmente cantidad de píxeles que cambian y número de frames.

Eso demuestra movimiento, no que el movimiento se lea como natación.

Antes de escalar:
- trayectoria de centroide;
- continuidad de orientación;
- velocidad/aceleración sin saltos;
- deformación máxima por morfología;
- giro completo;
- revisión perceptual humana en vídeo continuo.

El vídeo R03 se ve bastante mejor, pero esa valoración no la sustituye `44862 px cambian`.

### 6 · Corregir una contradicción factual interna

En `i18n.js`, el selector de equipo dice:
`Tramo mesopelágico · 3 animales con tramo validado`.

Pero los datos de esos tres declaran estado `HEREDADO` y el propio README dice que no están revalidados por Senda/Astra.

Cambiar a una formulación como:
`3 animales con asignación heredada · revalidación pendiente`.

Antes de publicación, la matriz factual debe cerrar taxón, talla y zona.

## P1 · mejoras de experiencia y accesibilidad

### 7 · La vía accesible es funcional, pero puede conservar mejor el descubrimiento

`Explorar con controles` enumera todas las señales —también las fuera de vista— y permite `Encuadrar e iluminar`, que centra/zoom/pausa automáticamente.

Eso es una alternativa muy útil, pero reduce bastante la búsqueda respecto al flujo visual.

Recomendación:
- conservarla;
- hacer `Encuadrar e iluminar` una asistencia explícita;
- ofrecer primero orientación relativa/dirección y navegación por pasos, para preservar `EXPLORE → NOTICE → DISCOVER` cuando sea posible.

No quitar la asistencia: mejorar la equivalencia de experiencia, no hacerla más difícil.

### 8 · Calibrar revelado por especie, no asumir 35% universal

`fraccionExaminable = 0.35` y la apertura del haz son parámetros globales.

El propio README reconoce que no están calibrados con personas.

Antes de 13/50/100 animales:
- definir qué rasgo debe ser visible para reconocer cada morfología;
- ajustar umbral por familia/especie si hace falta;
- comprobar que apartar la luz devuelve realmente la sensación de oscuridad.

En el vídeo algunos estados oscuros conservan bastante silueta —especialmente calamar/hacha—. No lo considero fallo automático: es un punto de HUMAN QA sobre cuánto misterio debe conservarse.

### 9 · Evitar duplicación de descripción en el visor

`abrirVisor()` asigna al `alt`:
`nombre + descripción`
y a continuación vuelve a presentar la misma descripción como texto visible.

Para AT esto puede ser redundante.

Decidir una sola estrategia:
- alt breve con el rasgo visual que la imagen aporta y descripción detallada en texto; o
- `alt=""` si la imagen se considera redundante con el contenido inmediatamente adyacente.

### 10 · Reanunciar acciones repetidas importantes

`avisar()` no actualiza el live region si el mensaje es idéntico al anterior.

Una segunda acción inválida idéntica puede no generar nuevo anuncio para AT.

Para acciones iniciadas por la persona, permitir reanuncio controlado aunque el string sea igual.

### 11 · Probar touch físico y scroll de página

`#lienzo { touch-action:none }` hace que un gesto iniciado sobre la escena pertenezca al runtime.

Es coherente con drag para explorar, pero en móvil debe comprobarse físicamente que no vuelve incómodo desplazarse por la página para llegar a controles/fichas.

No inferir esto desde eventos sintéticos.

## P2 · escalado / rendimiento / trazabilidad

### 12 · No escalar la escena de 13 antes de medir móvil real

El propio paquete reconoce que la escena privada decodifica 26 PNG grandes y los deforma por tiras.

Antes de usar esa densidad públicamente:
- memoria decodificada;
- FPS / frame budget;
- long tasks;
- consumo al abrir/cambiar escena;
- gama media/baja real.

### 13 · QA de registro luz/oscuro de los 13

La corrección alfa está bien demostrada sintéticamente.

Falta un sweep visual por pareja que compruebe:
- alineación anatómica;
- ausencia de salto al mover el haz;
- transparencia;
- retirada del haz;
- no cambio de pose entre oscuro/luz.

Cajas alfa cercanas no bastan para demostrar anatomía.

### 14 · Normalizar versionado

El paquete es R03, pero `IG_DATOS.version` sigue en `R02` y la clave local es `ig-descubrimiento-peces-r01`.

Si se desea compatibilidad de schema/save, declararlo explícitamente:
- `schemaVersion`;
- `productVersion`;
- `saveVersion`.

No usar un único campo ambiguo.

## Prioridad recomendada

Antes de otro lote grande:
1. build producto (`modoEquipo:false`);
2. quitar controles de tramo sin efecto;
3. corregir tap/pointercancel/NONE precision;
4. fortalecer reflow 200%;
5. fortalecer oracle de natación;
6. corregir copy factual `validado` vs `HEREDADO`;
7. HUMAN QA de primera tarea y balance oscuridad/reveal.

Después:
registro luz/oscuro de 13 + rendimiento móvil + factual matrix.

## Resultado

`KEEP_CORE`

No recomiendo rehacer el motor ni la dirección visual.

Sí recomiendo un patch acotado de interacción/oráculos/product-mode antes de usar R03 como plantilla para ampliar la biblioteca.

Marcador:
`AXIOMA_MARINE_R03_KEEP_CORE__TARGETED_REWORK_BEFORE_SCALE`