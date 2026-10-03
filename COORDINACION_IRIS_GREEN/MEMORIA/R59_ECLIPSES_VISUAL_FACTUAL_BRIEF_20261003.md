# R59 · ECLIPSES · BRIEF FACTUAL VISUAL · TANDA R01

Fecha: 03/10/2026  
Owner factual: **Senda · R59**  
Destinatario: **productor visual asignado por Astra/María**  
Gate: `INTEREST_04_ECLIPSES_VISUAL_FACTUAL_BRIEF_PASS`

## OBJETIVO

Crear visuales educativos reutilizables sin convertir cálculos de 2027/2028 en ilustraciones “oficiales”.

Tanda recomendada:
1. Total solar · geometría
2. Partial solar · geometría
3. Annular solar · geometría
4. Lunar eclipse · geometría

## REAL_DATA

Solo datos publicados:
- tipo/fecha/zona de visibilidad IGN/NASA;
- seguridad solar;
- Natural Earth cuando se use mapa;
- 2/08/2027: totalidad en franja del sur de España, parcial fuera.

## CALCULATION

Pertenece al motor/dataset, no al productor:
- horas de contacto;
- oscurecimiento;
- altura/azimut;
- tipo local;
- path/rejilla;
- visibilidad sobre horizonte;
- comparación Cádiz/Madrid;
- 2028 Barcelona/Palma y puesta de Sol.

Regla:
`GEOMETRIC_ECLIPSE_KIND != FULL_VISIBLE_PHASE`.

Los mapas y porcentajes event-specific se generan desde cálculo/dato, no se pintan a mano.

## REPRESENTATION

Las cuatro piezas son `REPRESENTATION`.

### Total solar
Sol–Luna–Tierra alineados; umbra/penumbra legibles.
Corona solo alrededor del Sol durante totalidad, genérica, no estructura real fechada.

### Partial solar
Mostrar que el observador está en penumbra y solo parte del disco queda tapada.
No fijar un porcentaje concreto.

### Annular solar
Luna aparente menor que el Sol; anillo visible.
No usarlo para afirmar que una ciudad ve toda la anularidad.

### Lunar eclipse
Sol–Tierra–Luna; sombra terrestre sobre la Luna.
Rojo/cobre permitido como representación genérica de totalidad lunar; el tono exacto cambia con la atmósfera terrestre.

## PROHIBIDO

- skyline/relieve local inventado para Cádiz, Ceuta, Madrid, Barcelona o Palma;
- nubes/meteorología;
- mapa “oficial” generado artísticamente;
- porcentajes/horas horneados;
- corona visible en parcial/anular;
- presentar la simulación como fotografía;
- omitir protección ocular en materiales de eclipse solar.

## SEGURIDAD

En parcial/anular y fases parciales de un total:
protección solar adecuada; gafas normales no sirven.
Sin protección solo durante totalidad completa.

## FUENTES

- IGN · eclipse total 2/08/2027.
- NASA · eclipse geometry/types.
- NASA · eclipse viewing safety.
- NASA · lunar eclipses.

## SALIDA DEL PRODUCTOR

Cuatro visuales genéricos de geometría.  
Los eventos concretos siguen siendo datos/cálculos del producto.

`INTEREST_04_ECLIPSES_VISUAL_FACTUAL_BRIEF_PASS`
