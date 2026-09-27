# Handoff · R42 Design · contenido R01 auditado + child-safe · 27/09/2026

## Estado

`R42_CONTENT_R01_AUDITED_READY_FOR_DESIGN_CHILD_SAFE`

Issue Design: #302  
Parent child-safe: #293  
Puerta A2: #289

## Fuente

Paquete recibido:
`iris-green-contenido-R01-20260924.zip`

SHA-256:
`e44633d2c4707e69276c88728a090212f6d791046cc8dbe38399270f5c29551a`

Paquete preparado por Astra para entregar a Design:
`iris-green-contenido-R02-DESIGN-CHILD-SAFE-20260927.zip`

SHA-256:
`b24998fbdb5fab9b59135237ba5c5edb5d67167d8aa31b413656eb53459f6f23`

El ZIP preparado conserva R01 como fuente de solo lectura y añade auditoría, datos normalizados, manifest de seguridad, variantes seguras y contrato de búsqueda.

## Auditoría de inventario

- 118 entidades de contenido nuevas reales:
  - 41 Condiciones
  - 36 Situaciones
  - 14 Vida diaria
  - 11 Datos
  - 4 Trámites/Ayudas
  - 12 Investigación
- La cifra 152 del documento fuente mezcla 118 contenidos + 34 archivos modificados; no son 152 fichas nuevas.
- 204 HTML nuevos = 102 fichas de página propia × ES/EN.
- catálogo completo incluido: 226 Condiciones, 223 Situaciones, 62 Vida diaria, 60 Datos, 132 Investigación, 262 registros ES de Trámites.

## QA editorial/estructura

Las 204 nuevas hojas ES/EN tienen idioma, H1, title/meta description, fuente externa y pareja de idioma.

Escaneo heurístico de esas 204 hojas:
- 0 pesos/calorías numéricos;
- 0 BMI/IMC numérico;
- 0 dosis tipo mg/ml;
- 0 lenguaje explícito de métodos de autolesión/suicidio;
- 0 descripciones gráficas detectadas.

Es un gate automático, no sustituto de revisión humana.

## Bilingüismo

Se detectaron 245 enlaces del footer de páginas EN que apuntan a `/es/`. Es deuda del shell legado: **no migrar ese footer**.

Investigación 121–132 tenía `sample_en` en español. Se entregan los 12 corregidos y cuatro `authors_en` normalizados.

## Correcciones jurídicas normalizadas

1. Tarjeta Europea de Discapacidad: transposición 05/06/2027; aplicación 05/06/2028.
2. Tarjeta Europea de Estacionamiento: no afirmar gratuidad universal; puede haber tasa limitada al coste administrativo.
3. Perro de asistencia: fuente BOE, regla estatal general ≥33 %, reconocimiento autonómico adicional y retiro a 10 años salvo informe veterinario anual.
4. RD 707/2026: entrada en vigor 02/01/2027 y requisitos específicos en algunas obligaciones, entre ellas parte del art. 14 de empleo.

## Child-safe

Manifest preparado: 965 registros.
- S0_GENERAL: 724
- S1_SENSITIVE: 225
- S2_HIGH_SENSITIVITY: 16
- NORMAL: 945
- SAFE_VARIANT_REQUIRED: 16
- INTENTIONAL_ONLY: 4

Los 16 S2 son revisión manual de temas principales. S0/S1 son seed editorial y se revisarán progresivamente.

Regla dura:
**el cuerpo completo S2 no puede formar parte del HTML/payload inicial para DEFAULT, INFANCIA o ADOLESCENCIA.**

La protección es de descubrimiento incidental; no se presenta como age assurance.

## Archivos clave del paquete Design

- `AUDIT/AUDITORIA_ASTRA_R02.md`
- `DESIGN_HANDOFF_NUEVA_WEB_CHILD_SAFE.md`
- `SAFETY/PROTECCION_INFANCIA_IMPLEMENTACION.md`
- `SAFETY/content-safety-manifest.json`
- `SAFETY/safe-variants.json`
- `SAFETY/s2-review.csv`
- `SAFETY/search-safe-default.json`
- `SAFETY/search-intentional-safe.json`
- `SAFETY/search-adult-full-catalog.json`
- `NORMALIZED/`

## Límite

Los HTML R01 son fuente editorial/QA, no plantilla para la nueva web.

No main. No producción. Design entrega #302 para revisión Astra antes de A2.
