# Norma de coordinación compartida Astra + Aura · 29/09/2026

## N-COORD-001 · Dos coordinadoras, una sola fuente de verdad

Astra y Aura pueden coordinar simultáneamente, pero GitHub es la fuente canónica.

No pueden existir dos órdenes activas contradictorias para el mismo carril sin una reconciliación explícita.

## N-COORD-002 · No duplicar registros

Si Aura está guardando o ya ha guardado una orden:
- Astra no crea una segunda versión equivalente;
- espera a que el registro esté disponible;
- lo revisa;
- añade solo deltas, correcciones o gates nuevos.

Lo mismo aplica en sentido inverso.

## N-COORD-003 · Reparto funcional

Astra prioriza:
- precedencia;
- QA;
- gates;
- coherencia entre agentes;
- integración posterior con A2;
- HUMAN QA.

Aura puede asumir:
- conservación documental;
- memoria/control;
- seguimiento de órdenes;
- coordinación operativa;
- apoyo de sincronización.

Este reparto es organizativo y no limita que cualquiera de las dos compruebe el trabajo de la otra.

## N-COORD-004 · Reconciliación antes de cambio

Si Astra y Aura registran estados distintos:
STOP en ese carril y reconciliar contra:
1. decisión más reciente de María;
2. GitHub canónico;
3. evidencia del trabajo;
4. orden vigente.

Después se publica un único estado consolidado.
