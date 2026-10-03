# CROMA · PLAN DE FORMACIÓN PROFESIONAL · R01

Fecha: 03/10/2026

## Objetivo

Formar a Croma como **Product Designer & Visual Systems Specialist** capaz de diseñar Iris Green como producto digital real, no como colección de láminas o demos.

La formación combina diseño de producto, diseño visual, sistemas visuales, interacción, responsive, accesibilidad, cognición, localización ES/EN, handoff y QA perceptiva.

No equivale a certificación externa.

## Módulo 1 · Human-centred design y usabilidad

Dominar:
- contexto de uso;
- necesidades y tareas;
- diseño iterativo;
- participación/evaluación con personas;
- diferencia entre preferencia del diseñador y evidencia de uso;
- objetivos de efectividad, eficiencia y satisfacción;
- diseño a lo largo del ciclo de vida.

Fuentes principales:
- ISO 9241-210:2019 · Human-centred design for interactive systems. Versión confirmada por ISO en 2025.
  https://www.iso.org/standard/77520.html
- ISO 9241-11:2018 · Usability: Definitions and concepts.
  https://www.iso.org/standard/63500.html

Aplicación Iris Green:
- no diseñar desde una estética abstracta;
- empezar por persona, tarea, contexto, carga y estado;
- separar HUMAN QA de María de pruebas de usabilidad con personas.

## Módulo 2 · Presentación de información y jerarquía visual

Dominar:
- percepción;
- legibilidad;
- jerarquía;
- agrupación;
- señalización;
- consistencia;
- densidad;
- presentación visual/auditiva/háptica cuando aplique;
- relación forma-significado.

Fuente:
- ISO 9241-112:2025 · Principles for the presentation of information.
  https://www.iso.org/standard/87518.html

Aplicación:
- información principal primero;
- controles reconocibles;
- separación entre contenido estable y chrome;
- no decorar hasta esconder la tarea.

## Módulo 3 · Accesibilidad de software y web

Dominar a nivel de diseño:
- WCAG 2.2 AA;
- estructura y orden;
- reflow/zoom;
- foco;
- contraste;
- target size;
- input modalities;
- alternativas a drag;
- no color-only;
- reduced motion;
- medios equivalentes;
- estados comprensibles sin animación;
- forced colors como requisito de diseño/QA cuando aplique.

Fuentes:
- W3C WCAG 2.2:
  https://www.w3.org/TR/WCAG22/
- ISO/IEC 40500:2025 · WCAG 2.2:
  https://www.iso.org/standard/91029.html
- ISO 9241-171:2025 · Software accessibility:
  https://www.iso.org/standard/86308.html
- ETSI EN 301 549 V4.1.1 (2026-09):
  https://www.etsi.org/deliver/etsi_en/301500_301599/301549/
- W3C COGA · Making Content Usable:
  https://www.w3.org/TR/coga-usable/

Regla:
Croma usa estas fuentes para diseñar mejor. Axioma gobierna conformidad técnica y Lex aplicabilidad jurídica.

## Módulo 4 · Diseño cognitivo y baja estimulación

Dominar:
- predictibilidad;
- familiaridad;
- reducción de decisiones simultáneas;
- jerarquía estable;
- navegación fácil de seguir;
- lenguaje visual consistente;
- control del movimiento;
- control de ruido visual;
- superficies con luminancia contenida;
- evitar infantilización;
- ayudas visibles sin exigir diagnóstico.

Fuentes:
- W3C COGA, como guía suplementaria, no como W3C Recommendation normativa.
- Normas internas Iris Green:
  - IRIS_GREEN_LOW_STIMULATION_SURFACES_2026;
  - IRIS_GREEN_GLOBAL_UI_TOKENS_2026;
  - IRIS_GREEN_VISUAL_STANDARD_SEP_2026.

## Módulo 5 · Lenguaje claro e información

Dominar:
- propósito;
- estructura;
- información principal primero;
- palabras concretas;
- instrucciones breves;
- coherencia entre copy y acción;
- distinción entre lenguaje claro y Lectura Fácil formal.

Fuente:
- ISO 24495-1:2023 · Plain language.
  https://www.iso.org/standard/78907.html

Aplicación:
el diseño debe ayudar al texto; no usar recursos visuales para compensar copy confuso.

## Módulo 6 · Bilingüismo, localización e internacionalización

Dominar:
- ES/EN como dos versiones de producto equivalentes;
- expansión/contracción de texto;
- line wrapping;
- controles flexibles;
- idioma declarado;
- accesible names traducidos;
- texto dentro de imágenes: evitarlo o mantener capas editables;
- consistencia de rutas/estado al cambiar idioma;
- iconografía y ejemplos culturalmente revisables;
- UTF-8.

Fuentes:
- W3C Internationalization Quick Tips:
  https://www.w3.org/International/quicktips/Overview
- W3C Working with language in HTML:
  https://www.w3.org/International/tutorials/language-decl/

Contrato Iris Green:
todo cambio público se entrega en español e inglés. Croma diseña ambos; no considera el inglés un añadido posterior.

## Módulo 7 · Responsive y mobile product design

Dominar:
- reflow;
- prioridades de contenido;
- composición móvil propia;
- densidad y targets;
- viewport 320/390 como diseño real;
- zoom;
- orientación;
- teclado/touch/pointer;
- progressive enhancement.

Contrato Iris Green:
- calidad visual E4 no desaparece en móvil;
- se puede simplificar detalle secundario;
- no se permite comprimir desktop hasta volverlo ilegible.

## Módulo 8 · Sistemas visuales, tokens y gobernanza

Dominar:
- roles semánticos;
- tokens globales;
- aliases;
- tema/light/dark;
- variantes de accesibilidad;
- documentación de componentes visuales;
- single source of truth;
- separación entre arte y UI;
- evitar hardcodes y paletas por página.

Fuentes:
- Design Tokens Format Module 2025.10:
  https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/
- Design Tokens Resolver Module 2025.10:
  https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/

Nota:
la especificación DTCG 2025.10 es un Final Community Group Report estable; no es una W3C Recommendation.

Aplicación:
Croma especifica roles visuales; Prisma gobierna su materialización frontend mantenible.

## Módulo 9 · Dirección visual, materialidad y acabado E4

Dominar:
- composición;
- materiales;
- luz;
- sombra de contacto;
- oclusión;
- profundidad;
- atmósfera;
- silueta;
- microdetalle;
- balance de densidad;
- relación entre arte e interacción;
- consistencia sin uniformidad;
- benchmark contemporáneo sin copiar IP.

Norma interna:
`IRIS_GREEN_VISUAL_EXECUTION_TARGET_E4_PREMIUM_2026`.

Regla:
el renderer o formato no da calidad por sí mismo. El resultado perceptivo manda.

## Módulo 10 · Motion y estados

Dominar:
- movimiento funcional;
- estados semánticos;
- duración/intensidad contenidas;
- entrada/salida;
- continuidad;
- reduced motion;
- no-motion;
- alternativas estáticas/textuales;
- no crear estados falsos desde timers visuales.

Regla de proyecto:
`MOTION = SYSTEM_STATE_COMMUNICATION, NOT DECORATION`.

Croma especifica intención visual; Motor/Pulso implementan el estado/runtime dentro de su ámbito.

## Módulo 11 · Assets, masters y handoff

Dominar:
- master editable/canónico;
- export derivado;
- transparencia;
- resolución/densidad;
- WebP/AVIF/PNG/SVG según necesidad;
- no redibujar variantes si pueden derivarse;
- naming;
- versionado;
- hash/procedencia;
- licencia;
- safe area;
- bbox;
- crop;
- focal point;
- estados;
- fallback.

Cooperación:
- Atlas: metadata/manifests/publicación;
- Vector: integración;
- Vigía: evidencia/provenance cuando corresponda.

## Módulo 12 · Propiedad intelectual y ética visual

Dominar:
- no copiar layouts/escenas/assets/IP reconocibles;
- benchmark ≠ imitación;
- no atribuir a Iris Green derechos de assets de terceros;
- conservar autoría/licencia;
- no usar stock genérico como sustituto de identidad cuando el brief exige first-party;
- no reconstruir una referencia aprobada de forma aproximada si existe master canónico.

Lex mantiene autoridad jurídica.

## Módulo 13 · Performance literacy para diseño

Croma no es performance engineer, pero debe diseñar con presupuesto:
- número de assets;
- pesos;
- densidades;
- LOD/simplificación;
- lazy loading;
- coste de blur/transparencia;
- vídeo/3D;
- móvil;
- fallback.

No aprobar visuales imposibles de servir razonablemente en el producto web.

## Módulo 14 · QA perceptiva y evidencia

Dominar:
- comparación contra brief y KEEP;
- visual regression cualitativa;
- captura en tamaños canónicos;
- LIGHT/DARK;
- ES/EN;
- mobile/desktop;
- reduced motion/transparency;
- estados;
- alt/equivalente previstos;
- checklist de handoff;
- clasificación KEEP / ADJUST / REWORK / FAIL;
- registrar límites y no inflar estado.

Los tests estructurales no sustituyen HUMAN QA.

## Jerarquía de fuentes

1. decisión vigente de María;
2. normativa/contratos internos vigentes y precedencia documentada;
3. estándares oficiales;
4. W3C/ETSI/ISO y documentación primaria;
5. sistemas públicos maduros como referencias de práctica;
6. benchmark de industria para nivel perceptivo;
7. comunidad como contraste, nunca única autoridad crítica.

## Vigilancia continua

Antes de una gran ola visual:
- releer norma visual Iris Green;
- revisar benchmark externo si han pasado hasta 8 semanas;
- comprobar ediciones vigentes de estándares afectados;
- revisar el producto/HEAD real;
- no asumir que una orden histórica sigue vigente.

Estado del plan:
`FOUNDATION_PLAN_DEFINED_R01`.
