# R42 · Agente 7 · rebuild tras HUMAN QA · 26/09/2026

**Estado:** `R42_A7_HQA_REBUILD_READY_FOR_A2`.

María rechaza la entrega A7 anterior por baja calidad visual, ausencia de inmersión real e interfaz con controles solapados. A7 registra el fallo y reconstruye sobre el resultado integrado real de A2, no sobre el componente aislado.

## Base
- A2 integrado: `ab952077464b1348d3da88ee974f9375b3458bc9`.
- PR anterior #291 queda superseded como solución final.

## Nueva entrega
- branch `agent7/r42-quiet-space-humanqa-rebuild-20260926`
- HEAD `6c312d3fbd2677180a7894159f14b19894fe0eae`
- tree `94ae6c72e88b6dc9752c14cfbd3a9c6cb9c16dc5`
- PR #300
- precheck `R42_A7_HQA_REBUILD_STATIC_PASS`

## Cambio de arquitectura
- 7 escenas naturales usan vídeo real de Wikimedia Commons cargado solo tras acción explícita.
- Tubo de burbujas y Fibra óptica siguen como escenas sensoriales GPU locales.
- El catálogo vuelve a 9 escenas curadas; las tres extras se retiran hasta alcanzar calidad suficiente.
- Se eliminan del stage y selector los pósteres legacy de baja calidad.
- Controles esenciales en grid estable; acciones secundarias dentro de Más opciones.
- Layouts específicos para 760 px y 390 px; clean mode elimina también el chrome del app shell.
- reduced motion, Save-Data y fallo remoto conservan fallback local.
- Audio de Río se rehace para bajar hiss/ruido superior.

## Procedencia
`docs/r42-a7-humanqa/MEDIA_PROVENANCE.md` registra fuente, autor y licencia de cada vídeo natural.

## Gate
No hay PASS perceptivo. A2 integra #300, genera preview y María ejecuta HUMAN QA visual y auditiva. Si sigue sin estar al nivel, vuelve a construcción.
