# R62 · CLAUDE · P03 · RUTAS DE LUZ · CONCEPTO AUTORIZADO


> **PRECEDENCIA · 29/09/2026**  
> La primera entrega visual P03 ha fallado HUMAN QA/E4. El estado operativo vigente ya no es solo `R62_P03_RUTAS_LUZ_CONCEPT_AUTHORIZED`, sino `R62_P03_HUMAN_QA_REWORK_REQUIRED`.  
> Ejecutar `05_ASTRA_P03_HUMAN_QA_REWORK.md`. Esta orden 04 se conserva como autorización/origen del concepto y no debe usarse para saltar el rework.

Fecha: 29/09/2026  
Issue: #326  
Autoridad: María  
Dirección/revisión: Astra  
Responsable: Claude

Estado:
`R62_P03_RUTAS_LUZ_CONCEPT_AUTHORIZED`

## Entrada

P02 queda aprobado por HUMAN QA:

`R62_P02_TERRARIO_E4_HUMAN_APPROVED_UNLOCK_P03`

P01 y P02 funcionan como referencias de **nivel de ejecución**, no como plantilla visual.

## Objetivo

Definir el concepto completo de:

**P03 · Rutas de luz**

Tipo:
puzle de conexiones.

Bucle:
`conectar → desviar → observar → comparar → rehacer`.

La persona crea rutas de luz entre nodos/objetos atravesando restricciones y puede encontrar más de una solución válida.

No hay puntuación ni velocidad obligatoria.

## Dirección visual

La luz debe sentirse como **material dentro de un espacio**, no como líneas de un diagrama.

Sí:
- volumen;
- superficies;
- profundidad;
- rebote/reflejo;
- refracción si aporta;
- sombra/oclusión;
- piezas que reciben/transforman/desvían luz;
- oscuridad controlada que permita leer el recorrido;
- identidad Iris Green propia.

No:
- diagrama escolar de circuitos;
- rayas neón sobre fondo negro;
- tablero 2D de nodos;
- estética sci-fi genérica;
- láseres agresivos;
- flashes;
- bloom excesivo;
- copiar Monument Valley, The Witness, Portal u otra IP.

P03 debe tener lenguaje propio diferente de:
- P01 arquitectónico/piedra;
- P02 orgánico/húmedo.

## Mecánica a resolver en concepto

Definir exactamente:
- qué es un nodo;
- qué piezas puede colocar/mover/rotar la persona;
- qué transforma la luz;
- qué restricciones existen;
- cómo se sabe que una ruta está conectada;
- cómo existen varias soluciones;
- qué ocurre después de conectar;
- cómo se deshace/rehace.

No depender solo del color.

Debe existir al menos un segundo canal:
- forma;
- intensidad;
- patrón;
- posición;
- contorno;
- icono accesible.

## Entrega visual

Entregar:
1. gameplay principal 1440;
2. segundo estado 1440 mostrando una ruta distinta o cambio de pieza;
3. móvil 390 con composición propia;
4. LIGHT/NAVY del chrome si aparece interfaz;
5. detalle de interacción;
6. esquema breve de mecánica, NO diagrama como arte final.

El stage puede ser oscuro si la luz lo necesita.
El chrome consume tokens globales.

## Accesibilidad

Desde concepto:
- teclado;
- touch/pointer;
- drag no único método;
- seleccionar → destino/rotación equivalente;
- targets ≥44 px;
- reduced motion;
- sin flashes;
- no color-only;
- 320 px;
- audio opcional y controlable;
- no interacción rápida obligatoria.

## Etapas

Usar taxonomía:
- AGE_0_12
- AGE_13_17
- AGE_18_PLUS
- ALL_AGES

AGE_0_12 puede:
- tener menos piezas;
- rutas más cortas;
- targets mayores;
- ayudas más directas.

No infantilizar estética.

## E4

Aunque esta fase sea concepto, la imagen de referencia debe nacer ya con:
`IRIS_GREEN_VISUAL_EXECUTION_TARGET_E4_PREMIUM_2026`.

No entregar blocking plano para “mejorarlo luego”.

Queremos comprobar desde ahora:
- materialidad;
- luz;
- profundidad;
- composición;
- legibilidad móvil;
- originalidad.

## Gate

Marcador esperado:

`R62_P03_RUTAS_LUZ_CONCEPT_READY_FOR_ASTRA_MARIA`

STOP.

Astra review → HUMAN QA María.

No P04.
No Codex.
No A2.
No main.
No producción.

## Normativa

No cambia normativa transversal.
Consumir:
- IRIS_GREEN_VISUAL_STANDARD_SEP_2026;
- IRIS_GREEN_GLOBAL_UI_TOKENS_2026;
- IRIS_GREEN_AGE_TAXONOMY_2026;
- low stimulation;
- WCAG/ISO/EN/COGA vigentes.
