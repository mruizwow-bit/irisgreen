# ADDENDUM R42 · child-safe reactivado para la nueva web · 27/09/2026

## Decisión

La deferencia anterior:
`R42_CHILD_SAFE_DEFERRED_UNTIL_CURRENT_WORK_COMPLETE`

queda superada **para la fase Design/contenido de la nueva web**.

Nuevo estado:
`R42_CHILD_SAFE_CONTENT_REACTIVATED_FOR_DESIGN_NEW_WEB`

Esto no reactiva automáticamente los parches de implementación antiguos #294–#297. Se conserva su historial y se esperará a que Design #302 entregue la arquitectura sobre el nuevo baseline.

## Modelo canónico

Audiencia:
- INFANCIA
- ADOLESCENCIA
- ADULTEZ
- TRANSVERSAL

Sensibilidad:
- S0_GENERAL
- S1_SENSITIVE
- S2_HIGH_SENSITIVITY

Discovery:
- NORMAL
- INTENTIONAL_ONLY
- SAFE_VARIANT_REQUIRED

Sin selección:
`SAFE_BY_DEFAULT`.

## Privacidad

No pedir fecha de nacimiento, identidad, diagnóstico ni cuenta como requisito de esta lente.

La protección de esta fase es frente a **descubrimiento incidental**; no se debe presentar como verificación de edad.

La lente de etapa debe mantenerse en memoria de sesión en esta fase, salvo nueva decisión documentada.

## Regla S2 de contenido inicial

En DEFAULT / INFANCIA / ADOLESCENCIA:
- no cuerpo completo S2 en HTML;
- no cuerpo completo S2 en JSON inicial;
- no prefetch/preload;
- no autocomplete;
- no recommendation/related aleatorio;
- deep link o búsqueda clara → variante segura.

En ADOLESCENCIA:
- intención clara puede dar variante segura extendida;
- nunca detalle de métodos, gráfico o contenido que enseñe conductas de riesgo.

En ADULTEZ:
- catálogo completo;
- full S2 solo tras acción explícita.

## No ocultar vías de ayuda

Abuso, miedo, relaciones inseguras, alimentación preocupante o pensamientos de hacerse daño no se borran para menores.

Se ofrece un resumen seguro centrado en:
- reconocer preocupación/riesgo;
- pedir ayuda;
- seguridad;
- apoyo de confianza/profesional/emergencias cuando corresponda.

## Arquitectura de búsqueda

Filtrar metadatos antes de render.

No reutilizar un único índice completo para después ocultar tarjetas.

Mantener índices/pipelines separados para:
- safe default;
- resolución intencional segura;
- catálogo adulto.

## Investigación agregada

Los estudios S2 no pueden viajar con cuerpo completo en el dataset inicial de la página Investigación. Separar metadata/summary de fragmentos completos.

## Referencias de seguridad

AEPD · FAQ verificación de edad: la finalidad es impedir acceso inadecuado sin necesidad de conocer identidad/edad exacta.

ICO Children’s Code · age appropriate application / high privacy by default: aplicar protecciones base a todos cuando no exista certeza proporcional de edad, sin infantilizar adultos.

Comisión Europea · directrices DSA 14/07/2025: medidas proporcionadas contra contenido nocivo y otros riesgos a menores.

Samaritans · guidelines: reducir acceso a contenido dañino de autolesión/suicidio, especialmente promoción, métodos detallados y contenido gráfico; preservar rutas de ayuda.

## Gate

Design #302 → Astra review → implementación contra nuevo baseline → A2 → HUMAN QA.

No producción.
