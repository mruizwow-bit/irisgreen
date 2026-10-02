# ASTRA · INVENTARIO MAESTRO DE CONSTRUCCIÓN PENDIENTE · 02/10/2026

## Frontera

### FUERA DE ESTE INVENTARIO OPERATIVO · OWNER NEXO
Nexo coordina la recuperación transversal de la web:
- Sabik definitivo P0: núcleo/orbitas/movimiento/voz/estados;
- navegación global redundante;
- retícula/anchura global;
- first paint, flashes blancos, idioma, LIGHT/DARK;
- Home;
- arquitectura visible de Recursos;
- limpieza/copy de páginas de contenido;
- calidad visual final de experiencias cuando toque.

Astra no duplica esos microbloques.

Este inventario recoge **producto aún por construir, completar, reconciliar o activar**.

---

# 1 · INTERESES · 72 TEMAS

Regla:
`DISCOVER → REUSE → PRODUCT SPEC → ASSETS ONLY IF NEEDED → BUILD → QA → MAIN`

No construir 72 a la vez.

La matriz R59 ya decidió 72/72 a nivel de producto:
- 14 KEEP;
- 58 REWORK;
- change scope documentado: 23 MUNDO_NUEVO · 35 REENFOQUE · 14 AFINAR.

## 01 · Cielo
Estado:
- runtime/primer viewport técnico ya entró en main;
- HUMAN QA visual = FAIL;
- datos HYG/IAU/JPL, targets, teclado/touch, Motion3 y lazy depth = KEEP;
- rework visual pertenece al carril de calidad web coordinado por Nexo/Prisma;
- panorama Atlas aún no está cerrado técnicamente.

Pendiente de construcción fuera del shell:
- Atlas: `01-cielo-horizonte-observacion-r01` → 2560×768 RGBA, sRGB, safe crops.
Gate:
`INTEREST_01_SKY_HORIZON_ASSET_PASS`

## 02 · Sistema Solar V2
Estado:
`INTEREST_02_SOLAR_SYSTEM_V2_PRODUCT_AND_ASSET_AUDIT_PASS`

Producto/reuse definido.
No hacen falta assets nuevos para el V2 mínimo.

Pendiente:
- runtime V2;
- escena first;
- subset Sol + 8 planetas + 6 lunas contextuales;
- lentes size/distance/movement;
- tiempo solo por acción;
- depth on demand;
- evitar `cielo-fondo.json` eager;
- QA ES/EN, mobile, Motion3, teclado/touch.

## 03 · Exoplanetas V2
Estado:
`INTEREST_03_EXOPLANETS_V2_PRODUCT_CONTENT_AND_REUSE_PASS`

Dirección:
`EVIDENCE_FIRST → CHOOSE_A_WORLD → WHAT_WE_KNOW / WHAT_WE_DO_NOT_KNOW → DEPTH_ON_DEMAND`

Pendiente:
- runtime V2;
- subset inicial de 6 mundos;
- evitar ~1.32 MB JSON eager;
- mantener 3D lazy;
- incertidumbre/missing explícitos;
- no assets nuevos.

## 04 · Eclipses V2
Estado:
`INTEREST_04_ECLIPSES_V2_PRODUCT_CONTENT_AND_REUSE_PASS`

Dirección:
`SAME_EVENT → CHANGE_PLACE → SEE_WHAT_CHANGES → EXPLAIN_THE_SHADOW → DEPTH_ON_DEMAND`

Pendiente:
- runtime V2;
- evento 02/08/2027;
- separación REAL_DATA / CALCULATION / SIMULATION;
- Astronomy Engine bajo demanda si es posible;
- NORMAL animación controlada / REDUCED por pasos / NONE estático;
- safety solar;
- no assets nuevos.

## 05–07 · Espacio
Estado de source audit:
- no source wiring profundo identificado;
- `NOT_WIRED` no significa fuente rota.

Pendiente:
- Senda debe hacer, uno por uno, product spec + contenido + reuse audit;
- después runtime;
- no inventar dependencia NASA si no aporta.

Assets ya previstos históricamente:
- Voyager master para 06;
- ISS master para 07;
pero NO producir/activar a ciegas antes de releer spec vigente.

## 08 · Minerales
Estado:
`R59_MINERALS_UNBLOCKED_AFTER_FOSSILS_APPROVAL`

Pendiente:
- implementación real;
- demostrar técnica multivista/iluminación dentro de presupuesto;
- medir bytes, calidad, jitter, 1x/2x y móvil;
- cambiar técnica si 75 vistas no son viables con E4.

## 09 · Fósiles
Producto/arte:
`APPROVED KEEP`
`R59_FOSSILS_KEEP__NO_PRODUCT_OR_ART_REBUILD`

Paquetes R2v4 están siendo preservados por Nexo en Library.

Pendiente real:
- promover set R2v4 canónico;
- excepción mínima R48 tema 09:
  `TIMELINE → EXCAVACION`;
- motor `ig-r48-m-excavacion.js`;
- `R.motor('EXCAVACION', ...)`;
- contenido ES/EN del tema 09;
- arte first-party lazy;
- snapshot renderer 72/72 antes/después con diff exactamente 1;
- QA integración;
- paquete/branch remoto reproducible;
- HUMAN QA antes de integración.

Gate:
`R59_FOSSILS_R2V4_R48_INTEGRATION_QA_GOV_READY_FOR_ASTRA_AURA_MARIA`

## 22 · Vida marina / Mar y peces
Estado:
- runtime de descenso preparado;
- 5 zonas;
- agua/nieve marina/linterna;
- loader lazy;
- 6 PNG mesopelágicos Atlas ya empaquetados:
  pez hacha, pez linterna, calamar de cristal · luz/oscuro.

Pendiente inmediato:
- integrar los 6 PNG;
- verificar hashes/geometría/alpha;
- metadata factual;
- browser QA real.

Gate:
`MAR_22_MESO_RUNTIME_INTEGRATION_QA_PASS`

Después:
- completar las otras 12 especies, por micro-batches;
- cerrar producto completo de Vida marina.

## Resto de Intereses
Los 72 tienen decisión R59, pero NO convertir el resto en una lista de builds ciegos.
Tras cerrar pilotos activos:
- consumir matriz por lotes;
- KEEP/REWORK real;
- Senda define asset need;
- Atlas produce 3–6 assets máximo por batch;
- Motor/runtime después.

---

# 2 · JUEGOS

## Catálogo doméstico existente
Documento recuperado:
`EXISTING_GAME_FAMILIES = 19`

Son familias, no 19 juegos únicos.
No reconstruir por defecto.
Nexo resolverá su arquitectura visible dentro de Recursos.

## R62 · 6 juegos nuevos
`R62_NEW_GAMES_TOTAL = 6`

### P01 · Habitación imposible
- HUMAN/E4 approved;
- set visual definitivo preservable;
- montaje especial;
- pendiente: reconciliar delta exacto + convertirlo en experiencia jugable web + QA + main.

### P02 · Terrario vivo
- HUMAN approved;
- E4 + causalidad roca→sombra→humedad→musgo;
- montaje especial;
- pendiente: integración jugable + QA + main.

### P03 · Rutas de luz
- HUMAN approved;
- motor/generador real;
- trazado calculado, divisor, múltiples soluciones;
- cadena/bundle preservable;
- pendiente: integración jugable exacta + QA + main.

### P04 · Ritmo de colores
- concepto/sala/framing KEEP;
- cadena especial:
  mecanismo → sala → golpe/plan;
- bloqueo histórico: legibilidad de causalidad del golpe;
- pendiente: seleccionar set canónico de todos los paquetes que María está aportando, cerrar impacto, HUMAN QA, integración jugable.

### P05 · Pesca tranquila
- concepto definido;
- NO construido;
- debe reutilizar especies/runtime de Intereses 22 y evitar duplicación.

### P06 · Mi museo
- concepto definido;
- NO construido;
- debe consumir hallazgos/colecciones de Intereses, no crear colección paralela.

## Juegos en sala
Familia distinta del catálogo doméstico.

Estado S0:
`ROOM_GAMES_S0_SPLIT_PASS`
- ruta Parejas ES/EN en main;
- carga pack individual;
- no monolito;
- no storage;
- 0 terceros.

Pendiente:
- S1 · formato pack first-party Iris Green;
- S2 · modo sala real: reset/estado/ajustes;
- S3 · Parejas completo;
- S4 · ¿Qué falta aquí? + Ordena la historia;
- S5 · prueba real de pantalla compartida.

Contrato vigente:
- `DELIVERY = WEB_ONLY`;
- `CONTENT_OWNER = IRIS_GREEN`;
- sin cuenta/memoria/reloj/puntuación/ranking;
- sonido off al inicio;
- teclado cuando exista + touch/pointer + alternativa no drag-only.

## Intake
María sigue aportando muchos paquetes.
Estado:
`R62_SPECIAL_ASSEMBLY_INTAKE_PARTIAL_MORE_EXPECTED`

Nexo preserva.
Astra decide:
`CANONICAL_FINAL | CANONICAL_SUPPORTING | HISTORY_SUPERSEDED | DUPLICATE | UNKNOWN_PENDING`

No cerrar inventario hasta que María diga que ya están todos.

---

# 3 · TALLER

## Ya cerrado / no reconstruir
### R65
- 27 estudios ES/EN;
- 9 variantes infantiles;
- motores/escenas;
- integrado y recuperado.

### Suite5
Cinco estudios:
- Pixel art;
- Escritura;
- Juegos de mesa;
- Ritmo;
- Videojuegos.

Estado final:
`R44_SUITE5_TOKEN_CONSUMPTION_QA_PASS`
`R44_SUITE5_MAIN_NETLIFY_PASS`

Integración main:
`eb1ced268baea42eaba2c3d6e543d8a56da99090`

No reabrir.

## R44 · expansión de retos
Matriz:
`R44_TALLER_64_EXPANSION`

Total:
64 retos.

A0:
- 8 fichas/retos guiados presentes;
- capa de guía ya integrada;
- finalización actual es marca manual, no certificación automática del artefacto.

Matriz restante:
**56 retos todavía no construidos como expansión pública completa.**

Pendiente si María mantiene la expansión completa:
- construir por olas pequeñas;
- reutilizar retos ya existentes;
- no duplicar motores;
- cada ola con ES/EN + real challenge function + reflow + temas + a11y;
- no construir 56 de golpe.

---

# 4 · NUEVO RINCÓN · 16 PIEZAS AUDIOVISUALES

Reglas:
`5MIN = FINAL PRODUCT TARGET`
`ONE ACTIVE MEDIA ITEM ONLY`

## Relajantes · 8
A1 Acuario/Pecera
A2 Medusas
A3 Mar
A4 Río
A5 Lluvia en la ventana
A6 Noche estrellada
A7 Bosque
A8 Brasas

## Sala sensorial · 8
B1 Tubo de burbujas
B2 Discos líquidos
B3 Espejo infinito
B4 Cielo de estrellas
B5 Columna de cera
B6 Cáusticas
B7 Velos de color
B8 Lluvia de luz

## Estado A1 Pecera
Lumen visual KEEP PASS.
Eco audio/media PASS.
Mux final ya existe:
`A1_pecera_5min_AV_ECO_R01.mp4`

Pendiente inmediato:
1. Lumen final AV check;
2. Motor player común;
3. Axioma accessibility/Motion3;
4. Astra + María final gate.

Gate:
`RINCON_A1_FINAL_PASS`

## Después de A1
Orden:
A3 Mar → B2 Discos líquidos → A2 → A4 → A5 → A6 → A7 → A8 → B1 → B3 → B4 → B5 → B6 → B7 → B8.

- Mar: prototipo 30 s visual KEEP; audio necesita corrección.
- Discos: prototipo 30 s.
- las otras 13 piezas aún requieren producción.

El player común se construye una vez y se reutiliza.

## Faroles R68
Fuera de la cola 16.
Pendiente:
- revisión espacial Lumen;
- decidir qué runtime R3 se reutiliza y qué arquitectura se rehace;
- después Motor + Axioma + Lumen.
No terminar contra arquitectura potencialmente superseded.

## Sakura
Integrada/preservada.
Solo verificar supervivencia; no construir de nuevo.

---

# 5 · VIDEOTECA R06

No reconstruir desde cero.

Paquete canónico preservado por Nexo:
`/Iris Green/Handoffs/ENTRADAS_CANONICAS/VIDEOTECA_R06/`

Contenido:
- 122 vídeos;
- 17 temas;
- ES/EN;
- auditoría de 171 candidatos.

Estado:
`REBASE_REQUIRED`

Pendiente:
- reconciliar contra main actual;
- resolver precedencia de rutas actuales;
- revisar child-safe schema/política vigente;
- absorber tokens/controles globales actuales;
- browser QA;
- HUMAN QA;
- main.

No copiar el ZIP deployable a ciegas.

---

# 6 · INFORMACIÓN NUEVA / CONTENIDO PÚBLICO

Paquete canónico preservado:
`DOCUMENTACION_PUBLICA_ES_EN_20261002`

Total:
**23 piezas bilingües ES+EN**.

Áreas:
- Condiciones;
- Situaciones;
- Vida diaria;
- Datos;
- Investigación;
- Ayudas y trámites.

Estado:
`WAIT_FOR_PRODUCT_GATE`

Pendiente:
1. HUMAN QA María;
2. mapear PC-01…PC-23 a rutas canónicas ES/EN;
3. evitar duplicados;
4. Axioma en lenguaje/accesibilidad;
5. Lex en piezas jurídicas/laborales cuando aplique;
6. integración por lotes pequeños;
7. build + ES/EN + HUMAN QA.

No etiquetar formalmente Lectura Fácil sin validación humana correspondiente.

Pendientes no publicables siguen fuera:
- cuantías SEPE antiguas;
- atención temprana por CCAA incompleta;
- otros apoyos autonómicos;
- Perú territorial dudoso;
- RLCPD Colombia sin fecha de corte exacta;
- otros puntos ya registrados.

---

# 7 · CARRIL NEXO · DEPENDENCIAS PARA NO DUPLICAR

No asignar a nuestros agentes:
- Sabik definitivo;
- navegación global;
- breadcrumbs/barras secundarias;
- retícula global;
- first paint/idioma/theme;
- Home;
- arquitectura visual Recursos;
- copy global de páginas;
- Cielo visual final dentro de la secuencia de calidad de experiencias.

Nuestros productos deben integrarse DESPUÉS sobre esa base sin volver a romperla.

---

# 8 · SIGUIENTES CONSTRUCCIONES EN PARALELO SIN PISAR NEXO

## Motor
Reservado temporalmente por María para:
`NEXO → SABIK_DEFINITIVE_P0`

No interrumpir para Mar22 ni Rincón.

Cuando Nexo emita release explícito, el siguiente producto preparado sigue siendo:
`MAR_22_MESO_RUNTIME_INTEGRATION_QA_PASS`

Después podrá asumir el player común del Nuevo Rincón según precedencia Astra/Nexo.

## Senda
Eclipses V2 product spec ya cerrado.
Siguiente:
**Interés 05 · Lluvias de estrellas y meteoritos**, solo producto/contenido/reuse + asset brief first-party;
después 06 y 07, uno a uno.

## Atlas
Cerrar técnicamente el panorama:
`INTEREST_01_SKY_HORIZON_ASSET_PASS`

Después releer specs antes de Voyager/ISS.

## Lumen
A1 Pecera ya cerrada:
`RINCON_A1_LUMEN_FINAL_AV_PASS`

A1 queda `WAIT_MOTOR_RELEASE`.

Lumen pasa al programa visual first-party transversal #370.
Primer bloque:
Sol · Mercurio · Venus · Tierra.
Gate:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_READY_FOR_REVIEW`.

## Eco
A1 ya PASS.
Espera siguiente pieza media después de A1 final.

## Prisma
No abrir nuevo rework Cielo si Nexo está secuenciando el shell; coordinar con su gate para no duplicar.

## Axioma
Esperar superficies construidas; QA no sustituye construcción.

---

# 9 · PRINCIPIO DE CIERRE

Para cada construcción:
`SMALL BLOCK → TEST → HUMAN QA WHEN NEEDED → MAIN → CI → MEMORY/CONTROL → NEXT`

Preservar no equivale a integrar.
Un paquete en Library no equivale a producto público.
Un PASS técnico no equivale a HUMAN QA visual.
No reconstruir lo ya aprobado si solo falta integración.


## Programa visual first-party transversal

Tracking:
GitHub #370.

Memoria:
`COORDINACION_IRIS_GREEN/MEMORIA/FIRST_PARTY_VISUAL_ASSET_PROGRAM_20261002.md`

Control:
`COORDINACION_IRIS_GREEN/CONTROL/FIRST_PARTY_VISUAL_ASSET_PROGRAM_20261002.json`

Owners:
- Lumen = creación/dirección visual;
- Atlas = packaging/provenance;
- Senda = requisitos factual/producto;
- Motor = integración cuando Nexo lo libere.

Regla:
`3–6 MASTERS → VISUAL GATE → ATLAS PACKAGING → INTEGRATION → NEXT`.
