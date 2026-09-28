# IRIS GREEN · LUMINANCIA Y SUPERFICIES DE BAJA ESTIMULACIÓN · 2026

Fecha: 28/09/2026  
Autoridad de producto: María  
Estado: `IRIS_GREEN_LOW_STIMULATION_SURFACE_STANDARD_2026_ADOPTED`

## 1. Regla dura

En Iris Green queda prohibido usar:

`#FFFFFF`

como:
- fondo principal de página;
- tarjeta de contenido extensa;
- panel grande;
- diálogo/sheet de gran superficie;
- área estable de lectura;
- superficie amplia de workspace.

También evitar negro puro `#000000` como fondo dominante salvo necesidad específica de forced colors/sistema.

La regla NO prohíbe que blanco/negro aparezcan de forma puntual en:
- iconos;
- detalles gráficos;
- assets;
- estados de sistema;
- impresión;
- forced colors;
- contenido cuyo material real lo requiera.

## 2. Motivo

Iris Green está dirigida también a personas con sensibilidad visual y neurodivergencia.

Objetivos:
- reducir deslumbramiento;
- reducir saltos bruscos de luminancia;
- reducir fatiga visual;
- evitar superficies que “enciendan” gran parte de la pantalla;
- mantener contraste suficiente sin convertirlo en contraste agresivo;
- disminuir ruido visual;
- mantener lectura estable.

Esto es una decisión de producto más estricta que WCAG mínima.

## 3. Base de color canónica

Usar como base clara del sistema el canvas ya existente:

`#F6F8FB`

Token:
`--ig-page-canvas`

Las superficies de contenido deben usar un tono opaco, claro y matizado, pero NO blanco puro.

La migración debe partir de la paleta ya existente y medir contraste real antes de fijar cada token.

Referencia inicial disponible:
- page canvas: `#F6F8FB`;
- content soft existente: `#F4F7FA`;
- ink principal: `#17395C`;
- ink muted: `#435268`.

No inventar una paleta nueva por carril.

## 4. Regla de luminancia

No debe haber saltos innecesarios entre:
- canvas;
- tarjeta;
- diálogo;
- panel;
- header;
- workspace.

La separación debe construirse con:
- diferencia moderada de tono;
- borde;
- sombra contenida;
- espacio;
- jerarquía;

no mediante una gran placa blanca pura sobre fondo oscuro.

## 5. Chrome y cristal

Se conserva la regla R42/R02:

`contenido estable/opaco → chrome interactivo → overlays temporales`.

Pero “opaco” NO significa blanco puro.

El cristal se limita al chrome interactivo cuando proceda.

Si:
- el fondo es dinámico;
- el contraste no puede garantizarse;
- reduced transparency;
- móvil;
- alta carga visual;

usar material opaco de baja estimulación.

## 6. Modo oscuro / superficies inmersivas

Rincón y experiencias inmersivas pueden usar dark material.

Evitar:
- negro puro;
- blancos brillantes dentro de superficies oscuras;
- diálogos/paneles que iluminen de golpe gran parte de la pantalla.

Usar navy/desaturados con tinta clara controlada.

## 7. Taller / tarjetas

Las tarjetas del launcher de Taller NO deben usar `#FFFFFF` como placa extensa.

El arte R54 se conserva.

Debe corregirse únicamente el chasis/material de tarjeta y cualquier superficie de launcher que use blanco puro.

La página de QA oscura de Claude NO fija el producto final.

El launcher A2 tampoco puede usar tarjetas blancas puras.

## 8. Home

Home ya usa `#F6F8FB` como canvas.

Debe eliminar sus usos extensos de `#FFFFFF` y aliases equivalentes:
- hero/cards;
- search card;
- area cards;
- Sabik wrapper;
- settings dialog;
- inputs/result cards cuando ocupen superficie perceptible.

No sustituir todo por un único color plano: conservar jerarquía con tonos vecinos de baja estimulación.

## 9. Toda la web

Aplica a:
- Home;
- CONTENT;
- BROWSE;
- WORKSPACE;
- Condiciones;
- Situaciones;
- Vida diaria;
- Investigación;
- Datos;
- Trámites;
- Recursos;
- Juegos;
- Rutinas;
- Taller;
- Intereses;
- Rincón;
- Sabik;
- Cloud-facing UI;
- futuras superficies.

## 10. Preferencias

Mantener:
- Normal;
- Transparencia reducida;
- Opaco;
- Más contraste;
- forced colors;
- reduced motion.

Considerar posteriormente un ajuste de color/fondo configurable sin crear una experiencia paralela.

## 11. QA

Gate obligatorio:

1. barrido de `#fff`, `#ffffff`, `white`, `rgb(255 255 255)` y equivalentes;
2. clasificar cada uso: puntual permitido / superficie extensa prohibida;
3. capturas Home + CONTENT + BROWSE + WORKSPACE a 1440/390;
4. comparar luminancia efectiva entre canvas y superficies;
5. WCAG 2.2 AA para texto/controles;
6. no color como único canal;
7. HUMAN QA María.

No declarar PASS por contraste automático solamente.

Marcador:
`IRIS_GREEN_NO_PURE_WHITE_SURFACE_GATE`
