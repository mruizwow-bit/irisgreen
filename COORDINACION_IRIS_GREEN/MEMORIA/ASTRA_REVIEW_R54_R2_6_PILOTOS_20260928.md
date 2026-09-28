# R54 · Astra review R2 · seis pilotos · 28/09/2026

Issue: #318.

Estado: `R54_ASTRA_6_PILOTS_DIRECTION_PASS_SYNC_GATE_REQUIRED_BEFORE_SCALE`.

## Material revisado

Entrega Claude:
- `R54_R2.patch.gz` SHA-256 `28d92ff87c05b16fc2ac069a8a4db095e990b26cc09e7aba6b58beb059d0b90b`;
- `R54_R2.patch` SHA-256 `7770e3c2de2ecbace14cbdbd4bfcb73c6fb8b1cfda5c94e2646104fb4bf7b48b`;
- commit del format-patch: `7aa484ae8657831739ab3ad51bcc6fd3bc49d896`;
- base declarada: `625e5673`;
- coordinación y evidencias R44/R47/R54 recibidas aparte.

Astra extrajo los WebP directamente del Git binary patch y revisó visualmente las seis escenas finales a 1280×800.

Astra reconstruyó además la cadena R54 → R54_PILOTOS → R54_R2 para los módulos de escena y portada:
- todos los módulos Python finales compilan;
- las seis funciones generan SVG válido 640×400;
- `MIGRADAS` contiene exactamente dibujo, estructuras, modelado-3d, mundos, programacion y videojuegos;
- los pesos reales coinciden con la entrega: 131332 B en 1x y 209410 B en 2x.

## PASS de dirección visual 6/6

### Dibujo · PASS
La jarra real + dibujo de observación a medio construir elimina el sesgo de ficha infantil. Se ve proceso, corrección, construcción y material de trabajo.

### Programación · PASS
Ya no es robot/edtech. El grafo, la curva de respuesta, el módulo sin conectar, la placa y el cuaderno forman un banco de trabajo reconocible y transversal.

### Videojuegos · PASS
Ya no es un platformer casual terminado. Se lee como editor: rejilla, piezas, capas, cámara, selección e inspector. La criatura funciona como recurso y no como mascota.

### Mundos · PASS
La lámina de herbario corrige el elemento más infantil sin romper la escena ya aprobada.

### Estructuras · PASS / KEEP
No reabrir por el camión rojo. En la composición funciona como carga de prueba del puente, no como mascota ni protagonista. Si se revisa en un futuro pase global puede neutralizarse, pero no es motivo para retrasar R54.

### Modelado 3D · PASS / KEEP
Mantiene el estándar aprobado.

Conclusión visual:
**el listón R54 queda fijado con estas seis escenas** para los 21 restantes.

Regla de escala:
`THE_CARD_SHOWS_THE_WORKBENCH_NOT_THE_FINISHED_PRODUCT`.

Para Infancia se confirma:
- mismo lugar/proceso creativo;
- menos elementos cuando ayude;
- objetos/acciones más grandes y legibles;
- menor abstracción;
- nunca «lo mismo más mono»;
- no mascotas/ojos/estética bebé como atajo.

## Técnica · lo que sí pasa

PASS:
- pipeline de raster ahora está versionado;
- 1x 640×400 y 2x 1280×800;
- `srcset` por densidad real;
- 1x/2x del patch tienen dimensiones correctas;
- portada general marca las ricas iniciales eager/high y el resto lazy/low;
- `V='r54-r2-1'` actualiza el cache-bust del launcher generado;
- build-strict comprueba que toda escena en `MIGRADAS` tenga 1x y 2x;
- la caída silenciosa al SVG plano queda reservada a estudios no migrados.

## Bloqueo técnico único antes de escala

El requisito de Astra de **sincronización fuente → output** NO está cerrado todavía.

Problema reproducido por inspección del código:
- `render_escenas_ricas.py` genera los WebP;
- `migradas.py` declara qué escenas son obligatorias;
- `portada.py` comprueba existencia de 1x y 2x;
- pero NO existe hash/fingerprint que relacione el SVG/Python actual con los WebP versionados.

Por tanto sigue siendo posible:
1. editar `rica_<slug>.py` o el común `escenas_ricas.py`;
2. olvidar ejecutar el raster;
3. conservar WebP antiguos;
4. pasar el build porque los archivos existen.

Eso era precisamente parte del hueco técnico señalado en la revisión anterior.

### Corrección mínima requerida

Añadir un manifiesto determinista de escenas ricas, por ejemplo:
`img/taller/escenas/manifest.json`.

Por slug debe registrar al menos:
- `svg_sha256` del SVG generado por `R[slug]()`;
- `webp_1x_sha256`;
- `webp_2x_sha256`;
- dimensiones;
- quality/render settings relevantes.

`render_escenas_ricas.py` lo regenera.

El build/gate debe:
- recalcular el `svg_sha256` actual;
- verificar hashes de ambos WebP;
- fallar si fuente y outputs no corresponden;
- dar un mensaje accionable para rerender.

Test obligatorio:
- modificar artificialmente el fuente de una escena sin regenerar;
- build/check debe salir != 0;
- regenerar;
- build/check vuelve a PASS.

## Robustez del rasterizador

El docstring dice que si Playwright/Chromium no está disponible sale con código 2 sin tocar imágenes. En revisión Astra, Playwright estaba importable pero el ejecutable Chromium no estaba instalado y la excepción de `chromium.launch()` quedó sin capturar.

No es el bloqueo raíz, pero corregir en la misma vuelta:
- capturar el error de launch de Playwright además de `ImportError`;
- salir con mensaje corto y código definido, sin traceback largo.

## Loading/LCP

La implementación prioriza solo el lanzador general y deja las rejillas de etapa ocultas en lazy, de forma deliberada. Se acepta para escala.

Pendiente para A2 preview:
- medir entrada general;
- medir deep-link/selección inicial de Adolescencia, porque Videojuegos y Modelado 3D se vuelven visibles desde una rejilla que parte lazy/low;
- no convertir todas las rejillas ocultas en eager por defecto.

## Corrección documental

La entrega declara cache-busting `r54-r2-1` «en 58 rutas». El patch R2 cambia materialmente las dos salidas de launcher ES/EN y el generador `portada.py`; no aporta 58 archivos de ruta modificados en esta entrega.

En Control/Memoria futura no afirmar «58 rutas» salvo que un build/evidencia específica enumere esas 58 salidas.

## Gate

Visual 6/6: PASS.

Escala 21 + 9: HOLD únicamente por el sync gate.

Marcador esperado de Claude:

`R54_CLAUDE_RASTER_SOURCE_OUTPUT_SYNC_READY_FOR_ASTRA`

Tras PASS de ese check:
- autorizar 21 escenas restantes;
- autorizar 9 variantes de Infancia bajo la regla confirmada;
- después revisar 27 interiores.

No A2 todavía para R54.
No main.
No producción.
