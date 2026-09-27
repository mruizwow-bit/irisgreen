# R50 · HUMAN QA María · Home + header global · 27/09/2026

Estado: `R50_A2_HOME_GLOBAL_HEADER_ISO_COPY_ORDERED`
Issue: #313
Owner: A2

## Hallazgos HUMAN QA

1. R49 eliminó Música del header nuevo.
2. Accesibilidad/Lectura dejó de estar presentada como utilidad global clara.
3. La navegación primaria repite Condiciones, Situaciones, Vida diaria, Investigación y Recursos aunque Home ya las ofrece como accesos.
4. El copy de Home introduce “etiquetas”, “diagnóstico” y “Protección por defecto / Safe by default”, contradiciendo la intención de lenguaje neutral y añadiendo carga conceptual innecesaria.

## Decisión

Header visible:
`Iris Green · Buscar · Música · Accesibilidad · Contenido · idioma · Explorar`.

Las áreas de contenido salen de la navegación primaria permanente y pasan a Home/Buscar/Explorar.

`Más / More` pasa a `Explorar / Explore`.

Estado público default de Contenido:
`General`.
`SAFE_BY_DEFAULT` permanece interno.

## Copy Home

ES:
- eyebrow: `Información clara y herramientas prácticas`;
- H1: `Empieza por lo que necesitas.`;
- lead: `Busca información, recursos y herramientas para situaciones del día a día.`.

EN:
- eyebrow: `Clear information and practical tools`;
- H1: `Start with what you need.`;
- lead: `Find information, resources and tools for everyday situations.`.

El copy completo por tarjeta y selector está fijado en #313.

## Normativa

Se apoya en:
- ISO 24495-1:2023;
- ISO 9241-112:2025;
- W3C COGA.

Regla editorial Home:
describir qué puede hacer la persona de forma directa, literal y concreta; no explicar Iris Green mediante negaciones o conceptos sensibles innecesarios.

## Gate

A2 integra R49 pero no presenta preview final hasta cerrar R50.

Marcador:
`R50_A2_HOME_GLOBAL_HEADER_ISO_COPY_READY_FOR_ASTRA`.

No main/producción.
