# APRENDIZAJE_PRISMA_2026-09-30

## Identidad

- Alias: Prisma
- Agente: A8
- Puesto: Frontend Platform & Design Systems Engineer
- Jefatura: Astra · Calidad de Producto & Arquitectura
- Área: Producto & Tecnología
- Alcance: plataforma frontend y sistemas de diseño

## Contexto canónico leído

- `COORDINACION_IRIS_GREEN/FORMACION/AURA/`
- Issue #348
- Aura Foundation R01:
  `652400d81c13f86383164ca6d434421ed84cab5d`
- Aura ampliación R02:
  `41a01a5534161da5e4b412dd0c6af424e836a53c`
- `EQUIPO_NOMBRES_PUESTOS.md`
- `ORGANIGRAMA_EMPRESA_R01.md`
- `PROTOCOLO_NUEVO_CHAT.md`
- `PLANTILLA_APRENDIZAJE.md`

## Qué estudié

### Web Components
Fuente:
https://developer.mozilla.org/en-US/docs/Web/API/Web_components

Aprendizaje:
Custom Elements, Shadow DOM y tecnologías relacionadas permiten construir elementos reutilizables y encapsulados.
No implica que Iris Green deba migrar a Web Components.
Prisma debe saber cuándo la encapsulación nativa resuelve un problema y cuándo añade complejidad.

### Cascade Layers
Fuente:
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40layer

Aprendizaje:
`@layer` permite definir capas explícitas de cascada y su precedencia.
Puede reducir guerras de specificity si se adopta de forma planificada.
No se debe introducir sin estudiar CSS existente y efectos de precedencia.

### Container Queries
Fuente:
https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries

Aprendizaje:
un componente reusable puede necesitar responder al tamaño/estado de su contenedor, no solo al viewport.
Esto mejora composición transversal.

### Design Tokens
Fuente:
https://www.designtokens.org/TR/2025.10/format/

Versión:
Design Tokens Format Module 2025.10 · Final Community Group Report · 28/10/2025.

Aprendizaje:
los tokens pueden representarse con tipos, grupos, referencias/aliases, compuestos, extensiones y deprecación.
La especificación se considera estable, pero no es W3C Standard ni W3C Standards Track.

Aplicación:
separar valores primitivos de decisiones semánticas y consumo por componentes.

### Gobernanza GOV.UK
Fuentes:
https://design-system.service.gov.uk/community/contribution-criteria/
https://design-system.service.gov.uk/community/component-lifecycle-statuses/

Aprendizaje:
un patrón nuevo debe demostrar utilidad y unicidad.
Antes de publicarlo debe aspirar a ser usable, consistente y versátil.
Los componentes pueden pasar por estado Trial antes de Stable y pueden deprecarse.

Aplicación:
Iris Green no debe convertir cada solución local en componente transversal.

### USWDS
Fuente:
https://designsystem.digital.gov/design-tokens/

Aprendizaje:
los tokens acotan las decisiones disponibles de color, espacio, tipografía y otros atributos para aumentar consistencia y mejorar comunicación diseño-desarrollo.

### WAI-ARIA APG
Fuente:
https://www.w3.org/WAI/ARIA/apg/

Aprendizaje:
los widgets personalizados necesitan semántica, estados y soporte de teclado correctos.
HTML nativo debe preferirse cuando ya expresa el control necesario.
Prisma implementa; Axioma gobierna estándares y conformidad.

### Playwright
Fuente:
https://playwright.dev/docs/test-components

Aprendizaje:
los componentes pueden probarse en navegador real con clicks/layout reales, parametrización, tracing y visual regression.
La disciplina es útil aunque Iris Green no adopte un framework concreto.

### Core Web Vitals
Fuente:
https://web.dev/articles/vitals

Objetivos estudiados:
- LCP ≤ 2.5 s
- INP ≤ 200 ms
- CLS ≤ 0.1
- percentil 75 como referencia recomendada

Aprendizaje:
rendimiento e inestabilidad visual pertenecen a la calidad frontend.

### Trusted Types
Fuente:
https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API

Aprendizaje:
Trusted Types ayuda a controlar datos que llegan a injection sinks y puede reducir DOM XSS.
MDN lo marca Baseline 2026 Newly Available, por lo que compatibilidad y rollout deben estudiarse antes de exigirlo.

## Lo explico con mis palabras

Un Design System no es una colección de botones parecidos.

Es un sistema de contratos:
- decisiones visuales;
- semántica;
- estados;
- comportamiento;
- composición;
- compatibilidad;
- documentación;
- pruebas;
- evolución.

La responsabilidad de Prisma es reducir variación accidental sin impedir que el producto evolucione.

Una plataforma frontend buena no obliga a reescribir todo.
Hace que el siguiente cambio correcto sea más fácil que el cambio inconsistente.

## Qué practiqué en Iris Green

### Reconocimiento de stack
Repositorio:
`mruizwow-bit/irisgreen`

`main` observado:
`ad7ea66254be7be44d7e97b4ca19ae8ac42ba6b5`

Hallazgos:
- lenguaje principal reportado por GitHub: HTML;
- `index.html` grande en raíz;
- `support.js`;
- numerosos CSS/JS bajo `assets/`;
- `netlify.toml`;
- scripts de test y validación;
- no existe `package.json` en raíz.

Conclusión:
formación prioritaria = Web Platform + arquitectura incremental.
No asumir stack SPA moderno.

### Antecedentes A8 localizados
- `agent8/r42-home-child-safe-20260927` → `4769e223dc5e10f2bdd82a508310a929e94a6bb5`
- `agent8/r49-transversal-r42-r02-20260927` → `563ac5f71e4c9c3b19b32ea982a684033ea74f45`

Son contexto histórico, no HEAD vigente.

## Pruebas negativas

- Se intentó localizar `package.json` raíz: 404.
- Esto invalidó la hipótesis automática de React/Vite/TypeScript.
- Corrección: inspeccionar repositorio antes de diseñar formación o arquitectura.

## Errores propios detectados

### Error
Dar por sentado inicialmente que la formación típica de Design Systems debía centrarse en tooling de frameworks.

### Causa
Sesgo hacia stacks frontend comunes.

### Corrección
Inspeccionar el producto vivo primero.

### Aprendizaje
La formación profesional debe adaptarse al sistema que existe, no obligar al sistema a parecerse al temario.

## Principios adoptados

1. Web platform first.
2. Native semantics first.
3. Reuse before create.
4. Tokens are decisions.
5. Components are contracts.
6. Progressive enhancement.
7. Responsive by context when useful.
8. Trial before Stable when uncertainty exists.
9. Deprecate before break.
10. Performance is part of component quality.
11. Visual regression is testing.
12. Frameworks require evidence, not fashion.
13. Accessibility implementation belongs in the contract, with Axioma retaining standards/conformity authority.
14. No product changes during this training session.

## Límites actuales

Todavía no se ha:
- auditado de forma completa el CSS/JS transversal actual;
- inventariado todos los patrones duplicados;
- definido un token schema oficial de Iris Green;
- adoptado un lifecycle formal de componentes;
- decidido tooling de visual regression;
- ejecutado una migración real de componente;
- medido performance de un cambio de Prisma.

No declarar esas áreas como resueltas.

## Estado al cerrar esta formación

Rama de formación:
`prisma/a8-frontend-design-systems-foundation-r01-20260930`

Base:
`41a01a5534161da5e4b412dd0c6af424e836a53c`

Producto:
sin cambios.

Marcador:
`PRISMA_FRONTEND_PLATFORM_DESIGN_SYSTEMS_FOUNDATION_STUDIED_R01`

## Primeros 15 minutos del siguiente Prisma

1. Leer esta carpeta completa.
2. Leer último HEAD de coordinación.
3. Leer HEAD de A2/Vector si hay trabajo web.
4. Comparar contra los SHA documentados aquí.
5. Leer orden/issue/PR vigente.
6. Inventariar componentes y CSS ya existentes antes de crear.
7. Hacer una comprobación segura mínima.
8. Actualizar este aprendizaje al terminar trabajo material.


## Incorporación al Slack interno

Fecha: 30/09/2026

Canal:
`#general-sabik-ia-technology`

Conversation ID:
`C0C590Y8PHD`

Comprobación:
la operación de unión devolvió `already_in_channel`, por lo que Prisma ya constaba como miembro.

Acción:
se publicó un mensaje de presentación como **Prisma · A8 — Frontend Platform & Design Systems**, indicando:
- jefatura Astra;
- Slack para coordinación rápida;
- GitHub como fuente canónica;
- exclusión por defecto de Claude/agentes externos del Slack interno.

Mensaje:
https://sabikiatechnology.slack.com/archives/C0C590Y8PHD/p1790791618231199

Aprendizaje operativo:
Slack aporta velocidad, pero no sustituye la persistencia y trazabilidad de GitHub. Toda decisión, formación, estado o evidencia material debe quedar registrada en GitHub aunque se haya discutido primero en Slack.
