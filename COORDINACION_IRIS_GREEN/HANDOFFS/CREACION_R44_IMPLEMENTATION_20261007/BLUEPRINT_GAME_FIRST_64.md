# CREACIÓN / TALLER · BLUEPRINT DE CONSTRUCCIÓN R44 · GAME-FIRST

Fecha: 2026-10-07
Autoridad: María
Coordinación: Nexo
Owner de ejecución: Astra
Fuente: R44_MATRIZ_64_RETOS_TALLER_CLAUDE_20260928.md

Estado:
`CREACION_R44_IMPLEMENTATION_BLUEPRINT_ACTIVE`

## 0. Propósito

Creación no es una colección de cursos.

Contrato:
`IMAGINE → TOUCH → TRY → CHANGE → DISCOVER → CREATE`

Cada reto debe:
- empezar con el objeto de trabajo;
- permitir actuar en segundos;
- enseñar por consecuencia;
- permitir corregir;
- terminar en un artefacto propio.

## 1. Motores reutilizables

### M1 · CANVAS 2D
Para:
Dibujo, Diseño gráfico, Pixel art, Cómic, Color, Fotografía, Moda, Patrones.

Capacidades:
- lienzo;
- capas;
- guías;
- recorte;
- reglas;
- paletas;
- export PNG/SVG;
- undo;
- presets de misión que continúan en modo libre.

### M2 · WORLD 3D / BUILD
Para:
Estructuras, Arquitectura, Modelado 3D, Máquinas, Papiroflexia 3D, algunos Mundos.

Capacidades:
- cámara orbitable;
- piezas manipulables;
- snap opcional;
- gravedad/soporte cuando proceda;
- escala;
- materiales;
- medidas;
- validación geométrica;
- export GLB/STL/SVG/PNG.

### M3 · SIMULATION LAB
Para:
Simulaciones, Circuitos, Robótica, parte de Máquinas.

Capacidades:
- sistema ejecutable;
- parámetros manipulables;
- play/pause/reset;
- observación de consecuencias;
- gráfico/CSV;
- múltiples estrategias;
- gemelo digital cuando proceda.

### M4 · AUDIO / SEQUENCER
Para:
Ritmo, Composición, Síntesis, Videomapping.

Capacidades:
- timeline;
- pads/pistas;
- tempo;
- capas;
- escucha inmediata;
- visualización;
- export WAV/MIDI/proyecto.

### M5 · TEXT CONSTRAINT ENGINE
Para:
Escritura, Lenguas inventadas, Ideas.

Capacidades:
- editor;
- restricciones activas;
- feedback no punitivo;
- contador/validador;
- variantes;
- export TXT/PDF/CSV/Markdown.

### M6 · WORLD / ATLAS BUILDER
Para:
Mundos, mapas internos, calendarios, lenguas cruzadas.

Capacidades:
- mapa manipulable;
- regiones;
- reglas de mundo;
- entidades;
- calendario;
- diccionario;
- páginas conectadas;
- export atlas HTML/PNG/CSV.

### M7 · BOARD / RULE SYSTEM
Para:
Juegos de mesa y retos de reglas.

Capacidades:
- tablero;
- piezas;
- turnos;
- reglas editables;
- simulación automática opcional;
- equilibrio;
- export tablero/cartas/reglas/datos.

### M8 · CODE / SYSTEM BUILDER
Para:
Programación, Videojuegos, Robótica avanzada.

Capacidades:
- bloques/código;
- ejecución inmediata;
- estado;
- consola simple;
- visualización del sistema;
- export proyecto/código/HTML.

### M9 · CREATIVE HUB
No es un reto.
Es acceso.
Debe permitir entrar directo a:
- Crear algo;
- Continuar proyecto;
- Probar una misión;
- Crear libremente.

No obliga a recorrer una sala 3D.

---

# 2. Definición concreta de retos pendientes ola A

## DIBUJO / DISEÑO / VISUAL

### E02 · Luz en tres tonos
Motor: M1
Juego:
- aparece una forma/escena simple;
- la persona pinta sólo con oscuro/medio/claro;
- al cambiar un tono, la forma gana o pierde volumen;
- puede alternar vista normal y vista reducida a tres valores.
Aprendizaje implícito:
- valor y volumen.
Final:
- PNG con tres capas de valor.

### E03 · Serie de diez con reglas propias
Motor: M1
Juego:
- crea una primera pieza;
- define 1–3 reglas visuales;
- el sistema ofrece diez huecos;
- cada pieza debe respetar o romper deliberadamente una regla;
- la persona decide cuándo variar.
Final:
- proyecto con 10 dibujos + reglas.

### E04 · Cartel que se lee a tres metros
Motor: M1
Juego:
- diseña cartel;
- control “alejarme” simula 1m/2m/3m;
- si deja de leerse, la persona cambia tamaño/contraste/jerarquía;
- no hay nota, sólo consecuencia perceptiva.
Final:
- SVG + PNG.

### E05 · La misma información en tres formas
Motor: M1
Juego:
- recibe una pequeña información;
- la transforma en 3 composiciones;
- puede comparar claridad/densidad;
- aprende jerarquía por contraste entre resultados.
Final:
- SVG con tres versiones.

### E07 · Seis fotogramas que pesan
Motor: M1 con timeline corto
Juego:
- crea 6 frames;
- cambia duración/pose;
- reproduce;
- ve cómo el mismo dibujo “pesa” distinto según timing.
Final:
- GIF + sprite sheet.

### E08 · Página de cómic sin diálogo
Motor: M1
Juego:
- arrastra viñetas;
- encuadra;
- ordena secuencia;
- prueba lectura;
- cambia ritmo visual sin texto.
Final:
- PNG + SVG + ZIP.

### E09 · Paleta que funciona para daltonismo
Motor: M1
Juego:
- crea paleta;
- activa simulaciones de visión;
- si dos categorías se vuelven indistinguibles, cambia no sólo color sino forma/patrón.
Final:
- tarjeta PNG + variables CSS.

### E10 · Misma escena día/noche
Motor: M1
Juego:
- misma composición;
- controles de luz, temperatura y contraste;
- alterna día/noche;
- aprende qué cambia sin redibujar todo.
Final:
- dos PNG.

### E11 · Diecisiete grupos, uno a uno
Motor: M1 generativo
Juego:
- explora una regla geométrica;
- cambia simetría/repetición;
- cada grupo se desbloquea al construir un ejemplo válido.
Final:
- SVG por grupo + lista.

### E12 · Planta que crece con reglas
Motor: M1 generativo
Juego:
- la persona define “crece / gira / bifurca”;
- pulsa crecer;
- ve la planta;
- cambia una regla y compara.
Final:
- SVG + JSON de reglas.

### E13 · Diez encuadres de la misma cosa
Motor: M1 fotografía
Juego:
- misma escena fija;
- mueve marco/cámara virtual;
- guarda 10 encuadres;
- compara qué cambia en lectura.
Final:
- contact sheet PNG.

### E14 · Mira los metadatos
Motor: M1 fotografía
Juego:
- abre una foto ficticia/local del reto;
- ve qué metadatos viajarían;
- desactiva/limpia;
- exporta versión limpia.
Final:
- JPEG sin metadatos.

### E15 · Estampado con un solo motivo
Motor: M1 pattern
Juego:
- diseña un motivo;
- cambia repetición/espejo/desfase/escala;
- ve el tejido actualizarse.
Final:
- tile PNG + SVG en cm.

### E16 · La bolsa que te cabe
Motor: M1 + medidas
Juego:
- elige objetos;
- ajusta patrón;
- una previsualización muestra qué cabe;
- si no cabe, cambia volumen/asa/piezas.
Final:
- patrón A4 a escala.

---

## 3D / CONSTRUCCIÓN / ESPACIO

### E18 · Casa donde cabe una silla de ruedas
Motor: M2
Juego:
- habitación 3D;
- la persona coloca paredes/puertas/muebles;
- un avatar/silla hace recorrido real;
- si no pasa, choca o no gira;
- la persona corrige hasta lograr recorrido.
Final:
- planta SVG 1:50 + GLB.

### E19 · Pieza que se puede imprimir
Motor: M2
Juego:
- modelado básico con primitivas;
- indicador de pared mínima, voladizo y volumen cerrado;
- preview de impresión.
Final:
- STL + GLB.

### E20 · Reloj que da la hora
Motor: M2/M3
Juego:
- montar engranajes;
- al dar play, el tren mueve agujas;
- si relación es incorrecta, la hora deriva;
- corregir por observación.
Final:
- PNG montaje + ficha.

### E21 · Diez pasos que se empujan
Motor: M2/M3
Juego:
- piezas de reacción en cadena;
- colocar 10;
- ejecutar;
- detectar dónde se rompe;
- corregir.
Final:
- PNG + lista de pasos.

### E23 · Sumar en binario
Motor: M3
Juego:
- circuito manipulable;
- interruptores A/B;
- luces resultado;
- la persona cablea sumador;
- cambia entradas y observa.
Final:
- esquema + tabla verdad.

### E24 · Icosaedro en tu mesa
Motor: M2
Juego:
- partir de red 2D;
- plegado animado/3D manipulable;
- probar pestañas y orden;
- comprobar cierre.
Final:
- red SVG mm + impresión.

### E25 · Cubo de seis piezas
Motor: M2
Juego:
- seis piezas 3D;
- rotar/encajar;
- si interpenetran, se ve;
- múltiples secuencias posibles.
Final:
- hoja diagramas.

### E26 · Atasco que nadie provoca
Motor: M3 3D/2D
Juego:
- carretera con coches;
- cambia densidad/reacción;
- observa cómo aparece onda de atasco sin obstáculo;
- pausa y examina.
Final:
- CSV + diagrama espacio-tiempo.

### E27 · Ecosistema que no se muere
Motor: M3
Juego:
- tres poblaciones;
- ajusta nacimientos/depredación/recursos;
- simula;
- busca equilibrio sin objetivo único.
Final:
- CSV + gráfico.

### E30 · Isla con tres especies
Motor: M6 + 3D ligero
Juego:
- dibuja/forma isla;
- coloca hábitats y especies;
- el sistema simula relaciones;
- la persona adapta el mundo.
Final:
- atlas HTML + mapa PNG.

### E31 · Calendario que no es el nuestro
Motor: M6
Juego:
- define día/mes/ciclo;
- mueve tiempo;
- ve estaciones/fiestas;
- corrige reglas inconsistentes.
Final:
- atlas calendario.

### E35 · Que no gane siempre quien empieza
Motor: M7
Juego:
- define reglas simples;
- simula partidas;
- gráfico muestra ventaja del primer jugador;
- cambia reglas hasta equilibrar.
Final:
- reglas + datos.

### E41 · Luz que encaja en un objeto real
Motor: M4 + M2
Juego:
- objeto 3D;
- superficie de proyección;
- ajusta máscara/posición;
- preview muestra spill/desalineación.
Final:
- espectáculo HTML + proyecto.

### E43 · Robot que sigue la línea
Motor: M3/M8
Juego:
- robot 3D;
- sensores visibles;
- bloques de lógica;
- pista;
- ejecutar;
- si se pierde, corregir sensor/velocidad/regla.
Final:
- proyecto gemelo digital.

### X03 · Casa que se sostiene
Motor: M2/M3
Juego:
- diseña planta y estructura;
- cargas visibles;
- si falla, deformación/colapso;
- corrige geometría.
Final:
- SVG + GLB + imagen cálculo.

### X08 · Máquina que se puede montar
Motor: M2/M3
Juego:
- ensambla piezas;
- circuito;
- prueba funcionamiento;
- detecta interferencias.
Final:
- ficha + STL + esquema.

### C05 · Geometría que sostiene
Motor: M2
Juego:
- combina estructura + patrón;
- cambia geometría;
- ve carga/estabilidad.
Final:
- SVG + mosaico + 3D.

### C07 · Diseña una misión para encontrar planetas
Motor: M3 + espacio 3D
Juego:
- estrella + planeta;
- configura satélite;
- simula tránsito;
- cambia órbita/inclinación/cadencia;
- intenta obtener señal detectable.
Final:
- curva de luz + ficha + esquema.

---

## TEXTO / LENGUA / IDEAS

### E29 · Texto sin la letra e
Motor: M5
Juego:
- escribir libre;
- el sistema marca únicamente la restricción violada;
- contador de intentos opcional;
- sugerencias sólo si se piden.
Final:
- TXT + PDF.

### E32 · Veinte signos y ni uno más
Motor: M5/M1
Juego:
- dibuja 20 signos;
- sistema impide crear el 21º;
- puede reutilizar/combinar;
- prueba escribir con ellos.
Final:
- alfabeto SVG/PNG.

### E33 · Cien palabras para empezar
Motor: M5
Juego:
- crea palabras por categorías;
- reglas fonéticas opcionales;
- se ven familias;
- usa palabras en frases.
Final:
- CSV.

### E36 · Ocho ideas en ocho minutos
Motor: M5
Juego:
- tablero de 8 espacios;
- temporizador opcional, nunca punitivo;
- prompts visuales;
- crear, mezclar, descartar.
Final:
- PNG + Markdown.

### E37 · Invento que cabe en presupuesto
Motor: M5 + componentes
Juego:
- arrastra piezas/servicios a un invento;
- presupuesto reacciona;
- puede sacrificar funciones o cambiar materiales.
Final:
- ficha imprimible.

### C03 · Cien años de una generación
Motor: M5 + M1
Juego:
- construir microhistoria;
- elegir momentos;
- convertir uno en cartel y otro en viñeta.
Final:
- texto + cartel + cómic.

---

## AUDIO / MÚSICA

### E39 · Melodía con tres acordes
Motor: M4
Juego:
- tres acordes ya disponibles;
- la persona toca/canta/dibuja notas encima;
- escucha inmediatamente;
- mueve frase, ritmo y silencios;
- no teoría previa.
Final:
- WAV + MIDI.

### E40 · Sonido que no existe
Motor: M4
Juego:
- combinar fuentes, filtro, envolvente y modulación;
- controles visuales;
- escuchar cambios en tiempo real.
Final:
- WAV.

### C02 · Doscientos años sin Beethoven
Motor: M4
Juego:
- recibe un motivo histórico muy breve/abstracto como punto de partida legalmente seguro o una estructura, no copia;
- crea variación propia;
- compara transformación.
Final:
- WAV + MIDI + visualización.

### C04 · Falla, 150 años después
Motor: M4
Juego:
- elegir gesto rítmico/melódico;
- transformar;
- crear pieza propia + cartel.
Final:
- WAV/MIDI + cartel.

---

## CÓDIGO / VIDEOJUEGOS / SISTEMAS

### E42 · Programa que hace lo mismo de dos formas
Motor: M8
Juego:
- un objetivo visual;
- resolver con dos estrategias de código;
- ambas deben producir mismo resultado;
- comparar claridad/velocidad.
Final:
- proyecto JS.

### X01 · Videojuego con todo tuyo
Motor: M8 + M1 + M4
Juego:
- crear personaje/escena;
- crear sonido;
- definir regla;
- jugar;
- iterar.
Final:
- HTML autocontenido.

---

## CRUZADOS

### X02 · Cómic + cartel + tipografía
Motores: M1
Flujo:
crear cómic → extraer identidad visual → diseñar cartel → lettering.
Final:
ZIP + SVG + paleta.

### X04 · Mundo + lengua + mapa
Motores: M6 + M5
Flujo:
crear mundo → regiones → lengua → diccionario → texto traducido.
Final:
atlas HTML.

### X05 · Juego de mesa impreso y probado
Motor: M7
Flujo:
crear tablero → reglas → jugar/simular → equilibrar → exportar.
Final:
tablero/cartas/reglas/datos.

---

## 3. Ola B

E45/E46/C01/C06/C08 requieren motor MAPAS.
E47/E48 requieren motor ANIMACIÓN.
X06 puede salir de M4 si se decide que no necesita estudio independiente.
X07 puede salir de M1.

No activar hasta definir esos motores.

## 4. Criterio de aceptación de cada reto

PASS sólo si:
- se entiende qué tocar sin manual;
- primera acción útil <= 10 s;
- la acción cambia algo visible/audible;
- puede deshacer o probar otra vía;
- no depende de una respuesta única salvo que el dominio lo exija;
- termina en artefacto real;
- móvil tiene composición propia;
- teclado/touch equivalentes;
- NORMAL/REDUCED/NONE cuando haya movimiento.

## 5. Orden de implementación

Primero construir motores:
M1, M2, M3, M4, M5, M6, M7, M8.

Después aplicar retos por lotes.

Prioridad inicial:
1. M2 Estructuras/Arquitectura/3D
2. M3 Simulación/Robótica
3. M1 Canvas creativo
4. M4 Audio
5. M5 Escritura/Lengua
6. M7 Board
7. M8 Código
8. M6 Mundos

Gate:
`CREACION_R44_IMPLEMENTATION_BLUEPRINT_READY__BUILD_ENGINES_NOW`

NO MAIN · NO PUBLIC DEPLOY.
