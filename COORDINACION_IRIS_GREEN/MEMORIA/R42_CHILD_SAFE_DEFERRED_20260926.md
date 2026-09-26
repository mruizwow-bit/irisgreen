# Memoria · diferir implementación child-safe hasta terminar R42 actual · 26/09/2026

## Decisión de María

La arquitectura de protección de menores para Situaciones/Condiciones (#293–#297) se mantiene aprobada, pero **no se implementará durante la oleada R42 actualmente en construcción**.

## Motivo operativo

La separación por etapa, el nuevo app shell, Taller, Juegos/Recursos, Intereses/Cuaderno, Rincón e integración A2 están todavía en curso. Implementar ahora la arquitectura child-safe obligaría a tocar buscadores, catálogos, rutas y enlaces cruzados mientras esas superficies aún están cambiando.

Para evitar duplicación y retrabajo:
- primero termina la arquitectura/producto R42 actual;
- A2 integra y publica una preview estable;
- se registra el nuevo HEAD/tree/baseline;
- después se retoma child-safe sobre esa base consolidada.

## Trabajo diferido

Se conserva íntegra la especificación:
- #293 parent;
- #294 clasificación de 372 fichas;
- #295 implementación de audience/sensitivity/discovery;
- #296 enlaces seguros desde Recursos/Juegos;
- #297 integración y HUMAN QA.

No se descarta ninguna decisión de seguridad ya registrada.

## Trigger de reanudación

Retomar cuando:
1. los trabajos R42 actuales terminen construcción;
2. A2 los integre;
3. exista preview estable;
4. se congele/registre el nuevo baseline de producto.

## Estado

`R42_CHILD_SAFE_DEFERRED_UNTIL_CURRENT_WORK_COMPLETE`
