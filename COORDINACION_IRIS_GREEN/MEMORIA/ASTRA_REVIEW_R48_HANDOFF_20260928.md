# R48 · Astra review handoff · 28/09/2026

Estado: `R48_ASTRA_HANDOFF_ACCEPTED_AS_DONOR_NOT_FOR_DIRECT_UPLOAD`

## Paquetes revisados
- COORDINACION_R48_MEMORIA_20260928.zip
- IRIS_INTERESES_R48_CAPTURAS.zip
- IRIS_INTERESES_R48_ES_EN_PARA_SUBIR.zip

Se revisaron matriz 72/72, memoria, 45 temas ES/EN, portada, 11 grupos, Cuaderno de Campo, 32 motores y capturas desktop/móvil.

## Dictamen

R48 es valioso como **donor de datos, editorial, lógica, privacidad e interacción**, pero NO debe subirse “tal cual” ni fijar la dirección visual final.

La entrega R48 usa la arquitectura anterior:
- cabecera/navegación global previa;
- patrón app/panel/listas;
- tarjetas;
- diagramas;
- laboratorios;
- ilustración esquemática.

R58/R59 redefine Intereses como:
**mundos visuales propios + exploración + actividad + colección opcional + información real dosificada.**

Por tanto:
- KEEP datos y lógica útiles;
- REBUILD la experiencia visual/espacial donde R58 lo exige;
- A2 no integra el ZIP completo.

## Matriz 72

La matriz es una buena entrada para Codex:
- 72/72 decididos;
- 59 sin mapa;
- 10 mapa secundario;
- 3 mapa principal;
- source pressure: 64 BAJA, 5 MEDIA, 3 ALTA;
- 45 necesitan datos reales, 18 parcialmente, 9 no;
- 40 construidos R48, 5 páginas profundas previas, 27 pendientes.

Codex debe verificarla contra HEAD actual y adaptar `proposed_world_scene`: muchos valores todavía describen renderers R48 (timeline/cards/map/etc.), no los mundos visuales finales.

## Donors para los seis pilotos

### Mar y peces
KEEP:
- R48 #22 DEPTH;
- 5 zonas;
- 18 especies;
- lógica de profundidad.

REBUILD:
- mundo marino propio;
- explorar;
- pesca tranquila;
- ficha real;
- colección/acuario opcional.

### Aves
KEEP:
- R48 #17;
- 20 especies;
- hábitat/estación;
- Cuaderno de Campo.

REBUILD:
- observación;
- localizar/identificar;
- encuadre/foto simulada;
- campo, no grid de cards como experiencia final.

### Fósiles
KEEP:
- R48 #09;
- escala temporal;
- 14 especies;
- 6 yacimientos.

REBUILD:
- excavación;
- hallazgo;
- reconstrucción;
- ficha;
- museo.

### Minerales
KEEP:
- R48 #08;
- Mohs;
- sistemas cristalinos;
- lógica CRYSTAL3D.

REBUILD:
- cristal/material/luz ricos;
- búsqueda/comparación;
- colección/museo.

### Trenes
R48 pendiente.

R58:
- estaciones;
- rutas;
- señales;
- conexiones;
- puzle espacial;
- info real contextual.

No empezar por mapa/dashboard.

### Espacio
KEEP:
- datos/hitos curados R48 #01–#07.

REBUILD:
- mundo visual Iris;
- observación;
- constelaciones/planetas/objetos;
- ficha real;
- colección.

Fuentes externas alimentan hechos; no definen identidad visual.

## Cuaderno de Campo

KEEP funcional:
- session-first;
- persistencia opt-in;
- export/import;
- borrado;
- mapa solo bajo acción;
- alternativa de teclado;
- marca de salida.

Puede recibir nueva capa visual después, sin perder este contrato.

## Handoff

R48 se acepta como:
- DONOR_DATA
- DONOR_EDITORIAL
- DONOR_LOGIC
- DONOR_PRIVACY
- DONOR_INTERACTION

R48 no se acepta como:
- FINAL_VISUAL_PRODUCT
- DIRECT_UPLOAD
- R58_STANDARD

A2 HOLD.
No main.
No producción.