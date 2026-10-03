# R59 · CIELO · BRIEF FACTUAL VISUAL · TANDA R01

Fecha: 03/10/2026  
Owner factual: **Senda · R59**  
Destinatario: **productor visual asignado por Astra/María**  
Gate: `INTEREST_01_SKY_VISUAL_FACTUAL_BRIEF_PASS`

## OBJETIVO

Evitar que el productor convierta datos astronómicos en decoración inventada.

### REAL_DATA
- posiciones, magnitudes y color estelar del snapshot HYG local;
- nombres/abreviaturas/límites de constelaciones: IAU;
- nombres de estrellas: IAU/WGSN snapshot;
- el horizonte first-party B00 ya aprobado es un asset de escena, no dato astronómico.

### CALCULATION
- qué estrellas/constelaciones aparecen en la vista para fecha/lugar;
- altura/azimut;
- posición aproximada de planetas con fórmula local JPL, dentro de su rango;
- fase/dirección lunar cuando aplique.

JPL deja claro que sus fórmulas son aproximadas y no sustituyen Horizons de alta precisión.

### REPRESENTATION
- horizonte;
- atmósfera/haze;
- gradiente nocturno;
- líneas de constelación;
- halos de selección;
- profundidad visual.

## REGLAS PARA LA TANDA

1. **NO generar estrellas raster como catálogo.**
2. **NO dibujar constelaciones como figuras mitológicas.**
3. Las estrellas visibles deben conservar posición relativa/densidad desde dato/runtime.
4. Las líneas de constelación son ayuda gráfica; finas, discretas y no cambian las relaciones estelares.
5. El horizonte B00:
   `01-cielo-horizonte-observacion-r01.png`
   queda **KEEP_LOCKED**. No regenerar.
6. Si se crea atmósfera/sky layer nuevo:
   - `REPRESENTATION`;
   - noche neutral;
   - sin aurora;
   - sin nubes protagonistas;
   - sin Luna/planetas/estrellas horneados;
   - sin Vía Láctea inventada;
   - sin landmarks.
7. Cualquier planeta/Luna que aparezca se coloca por cálculo, no por composición artística.

## NO INFERIBLE

- cielo “en directo”;
- posición exacta fuera del rango/método usado;
- brillo planetario actual si no se calcula;
- meteorología;
- contaminación lumínica real;
- geografía concreta del horizonte B00;
- color/forma inventada de constelaciones.

## FUENTES

- IAU: 88 constelaciones oficiales; límites/nomenclatura.
- JPL Approximate Positions of the Planets: fórmula aproximada, tabla 1800–2050.
- HYG: snapshot local del proyecto; no producción visual.

## SALIDA DEL PRODUCTOR

Puede trabajar solo en **capas de representación de escena**.  
No crea catálogo astronómico.

`INTEREST_01_SKY_VISUAL_FACTUAL_BRIEF_PASS`
