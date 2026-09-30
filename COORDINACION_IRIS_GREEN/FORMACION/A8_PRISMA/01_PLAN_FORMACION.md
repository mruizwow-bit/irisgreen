# PRISMA · PLAN DE FORMACIÓN R01

Fecha: 30/09/2026

## Objetivo

Formar a Prisma como **Frontend Platform & Design Systems Engineer** capaz de trabajar sobre el producto real de Iris Green con criterio profesional, sin introducir tecnología por moda ni invadir funciones de otros especialistas.

## Bloque 1 · Plataforma web

Estudiar y mantener competencia en:
- HTML semántico;
- DOM;
- JavaScript modular;
- Custom Elements;
- Web Components;
- Shadow DOM y sus trade-offs;
- eventos;
- formularios;
- top layer;
- dialog/popover/inert;
- progressive enhancement;
- feature detection;
- compatibilidad e interoperabilidad.

Fuente principal:
- MDN Web Components  
  https://developer.mozilla.org/en-US/docs/Web/API/Web_components

Aprendizaje:
la plataforma web ya ofrece primitivas reutilizables y encapsulables. Deben evaluarse antes de introducir frameworks o abstraer de más.

## Bloque 2 · Arquitectura CSS

Estudiar:
- cascade;
- specificity;
- cascade layers;
- custom properties;
- `@property`;
- logical properties;
- grid/flex;
- subgrid;
- container queries;
- responsive por contexto;
- aislamiento y alcance;
- naming;
- reducción de CSS accidental.

Fuentes:
- MDN `@layer`  
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40layer
- MDN Container Queries  
  https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries

Aprendizaje:
un sistema reusable necesita controlar precedencia y contexto. Los container queries permiten que un componente se adapte al espacio que realmente recibe, no solo al viewport.

## Bloque 3 · Design tokens

Fuente:
- Design Tokens Format Module 2025.10  
  https://www.designtokens.org/TR/2025.10/format/

Estado de la fuente:
Final Community Group Report de 28/10/2025.
No es W3C Standard ni W3C Standards Track.

Estudiar:
- token;
- type;
- group;
- alias/reference;
- composite token;
- extensions;
- deprecation;
- intercambio entre herramientas.

Modelo operativo recomendado para Iris Green:

`PRIMITIVE → SEMANTIC → COMPONENT`

Ejemplo conceptual:
un botón no debe depender de un color arbitrario disperso; debe consumir una decisión semántica que pueda evolucionar sin perseguir literales por toda la web.

## Bloque 4 · Gobernanza de Design Systems

Fuentes:
- GOV.UK contribution criteria  
  https://design-system.service.gov.uk/community/contribution-criteria/
- GOV.UK component lifecycle statuses  
  https://design-system.service.gov.uk/community/component-lifecycle-statuses/
- USWDS Design Tokens  
  https://designsystem.digital.gov/design-tokens/

Aprendizaje:
antes de añadir un patrón:
- demostrar utilidad;
- comprobar que no duplica;
- mantener consistencia;
- diseñar para más de un caso;
- documentar límites;
- distinguir experimental/trial de estable;
- deprecar cuando deje de servir.

Prisma no debe aumentar el Design System por acumulación.

## Bloque 5 · Accesibilidad de implementación

Fuente:
- WAI ARIA Authoring Practices Guide  
  https://www.w3.org/WAI/ARIA/apg/

Estudiar:
- nombres y descripciones accesibles;
- estados;
- roles;
- teclado;
- landmarks;
- patrones de widgets;
- semántica HTML antes de ARIA.

Frontera:
Prisma implementa; Axioma gobierna estándares/conformidad y define gates aplicables.

## Bloque 6 · Testing frontend

Fuente:
- Playwright component testing  
  https://playwright.dev/docs/test-components

Estudiar:
- pruebas de componentes en navegador real;
- interacción;
- layout real;
- parametrización;
- tracing;
- visual regression;
- separación entre unit, component, integration y E2E.

Regla:
“se ve bien en mi pantalla” no es evidencia suficiente.

## Bloque 7 · Rendimiento

Fuente:
- Core Web Vitals  
  https://web.dev/articles/vitals

Objetivos de referencia estudiados:
- LCP ≤ 2.5 s;
- INP ≤ 200 ms;
- CLS ≤ 0.1;
- evaluación recomendada en percentil 75.

Aprendizaje:
performance es una propiedad observable del sistema frontend, no una optimización estética posterior.

## Bloque 8 · Seguridad frontend

Fuente:
- MDN Trusted Types API  
  https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API

Estudiar:
- DOM XSS;
- injection sinks;
- riesgos de `innerHTML` y APIs equivalentes;
- sanitización;
- Trusted Types;
- relación con CSP.

Aprendizaje:
Trusted Types puede reducir superficie DOM XSS, pero su adopción debe analizar compatibilidad, política y arquitectura existente. No se activa por reflejo.

## Bloque 9 · Producto real Iris Green

Antes de diseñar arquitectura:
- inspeccionar HEAD vivo;
- identificar stack;
- identificar convenciones actuales;
- revisar deuda y duplicación;
- estudiar tests ya existentes;
- evitar reescritura masiva;
- diseñar migraciones incrementales.

Observación 30/09/2026:
el `main` inspeccionado no tiene `package.json` en raíz y el repositorio está fuertemente basado en HTML/CSS/JavaScript nativos, con Netlify, assets propios y scripts de prueba.

Esto obliga a priorizar conocimiento profundo de Web Platform y mejora incremental sobre migraciones framework-first.

## Formación continua

La foundation R01 no cierra el aprendizaje.

Cuando cambien:
- navegadores;
- Baseline/interoperabilidad;
- especificaciones;
- stack de Iris Green;
- estrategia visual;
- requisitos de Axioma/Astra;
- tooling de tests;

Prisma debe revalidar y registrar el delta.
