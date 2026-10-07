# NEXO · ORDEN ACTIVA · DETECTIVE GAME_FIRST VERTICAL SLICE R01

Fecha: 2026-10-07
Autoridad: María
Coordinación: Nexo
Carril: Juegos / R41-R56
Base medida:
- rama `atlas/first-party-assets-packaged-runtime-20261003`
- HEAD `69199a98e75db50bfdd171b7b3538f2b546b13b7`

## 1. Problema reproducido

Desktop 1440:
- cestas empiezan ~360 px;
- primera carta real ~1003 px.

Móvil 390×844:
- cestas: ~406 / 951 / 1495 px;
- reset ~2088 px;
- primera carta real ~2148 px.

Resultado:
la persona ve primero destinos gigantes y sólo después descubre qué tiene que mover.

Esto incumple:
- R41 §2 workspace-first;
- R41 §6 mobile-specific.

## 2. KEEP

Conservar:
- concepto “me calma / me activa / depende”;
- ausencia de respuesta correcta/incorrecta;
- posibilidad de sacar/cambiar cartas;
- ES/EN;
- teclado/touch;
- accesibilidad existente útil;
- assets aprobados;
- idea de que “depende” es una respuesta válida;
- conexión posterior con Tarjeta/Situaciones si sigue aportando.

No rehacer contenido por estética.

## 3. Nuevo loop

`VER → PROBAR → CAMBIAR → OBSERVAR CONSECUENCIA → RESOLVER`

Primera pantalla:
**una carta concreta + tres destinos compactos y legibles**.

La persona puede actuar inmediatamente.

No:
- tres cestas gigantes antes de la carta;
- explicación larga;
- tutorial de botones;
- lista completa de 12 cartas como primer paso.

## 4. Interacción propuesta

### Entrada
Mostrar:
- título compacto;
- frase máxima de una línea;
- primera carta protagonista;
- tres destinos: Me calma / Me activa / Depende.

Pregunta implícita por diseño:
**¿Dónde la pondrías hoy?**

### Acción
La persona:
- toca carta y destino; o
- toca directamente un destino para la carta activa; o
- teclado: izquierda/derecha entre destinos + Enter.

Drag puede existir, pero nunca ser obligatorio.

### Consecuencia
Al colocar:
- la carta se mueve visualmente al destino;
- feedback breve;
- aparece inmediatamente la siguiente;
- el espacio de “mis cestas” se construye progresivamente.

Si cambia de idea:
- seleccionar carta ya colocada;
- elegir otro destino;
- consecuencia visible inmediata.

## 5. Progresión

No mostrar 12 cartas gigantes de golpe.

Opciones válidas:
- mazo/stack;
- carrusel breve;
- una carta activa + próximas 1–2 como contexto.

Debe conservar:
- posibilidad de revisar todas;
- no presión temporal;
- no puntuación;
- no obligación de terminar.

## 6. “Depende”

No empujar artificialmente a usar “Depende”.

La versión actual, al final, sugiere volver a mirar si no puso ninguna.
Eliminar cualquier presión que implique que una distribución es “más normal”.

“Depende” debe estar disponible y explicarse como opción válida, no como respuesta esperada.

## 7. Móvil específico

390/320:
- carta activa visible;
- tres destinos visibles o accesibles sin más de un gesto simple;
- sin cestas de 500+ px;
- sin apilar desktop verticalmente;
- controles secundarios en sheet/drawer;
- reset/ayuda fuera del camino principal;
- sin overflow.

Objetivo:
**primera decisión jugable en el primer viewport.**

## 8. UI / tokens

Regla canónica:
`GLOBAL_UI_TOKENS_FOR_CHROME · DOMAIN_COLOR_INSIDE_THE_WORKSPACE`

- chrome/página/botones/texto/foco/sheets: tokens globales;
- colores de las tres categorías pueden existir dentro del stage;
- color nunca es el único significado;
- DARK = DARK NAVY global;
- no #FFFFFF como superficie extensa;
- no paleta UI propia del juego.

## 9. Accesibilidad

Obligatorio:
- teclado completo;
- touch;
- alternativa a drag;
- targets >=44 px policy;
- foco visible;
- 320/390/1440;
- 200%;
- forced-colors;
- reduced motion;
- NONE si hay movimiento;
- ES/EN;
- estado no sólo por color;
- live feedback sobrio.

## 10. HUMAN QA

Sin explicar la interfaz:
1. ¿entiende qué puede hacer?
2. ¿clasifica la primera carta sin buscar instrucciones?
3. ¿entiende qué cambió?
4. ¿puede cambiar de idea?
5. ¿sabe qué significa “Depende” sin presión?
6. ¿mira principalmente las cartas/cestas o los controles?
7. ¿móvil se siente diseñado, no apilado?

## 11. Entrega

Entregar:
- ZIP ejecutable aislado;
- SHA/manifest;
- vídeo 1440;
- vídeo 390;
- comparación before/after;
- medición y de primera acción;
- teclado/touch;
- tests con alcance declarado.

Gate:
`DETECTIVE_GAME_FIRST_R01_READY_FOR_NEXO_AXIOMA_HUMAN_QA`

No tocar los otros 13 juegos en esta entrega.
NO MAIN · NO PUBLIC DEPLOY.
