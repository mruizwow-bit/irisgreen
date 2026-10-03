# APRENDIZAJE_PRISMA_2026-10-03

## Identidad
- Prisma · A8
- Frontend Platform & Design Systems Engineer
- Jefatura: Astra · Calidad de Producto & Arquitectura
- GitHub = fuente formal; Slack = coordinación rápida.

## Resume gate ejecutado
Se releyó la formación R01 completa y el runbook de continuidad antes de continuar producto.

Contexto de trabajo reconciliado:
- #369 = auditoría post-recovery y reparaciones frontend por microbloques.
- #370 = producción/integración first-party de Cielo y espacio.
- No mezclar ambos carriles ni reabrir arte aprobado.

## #369 · P22 + P24 + P27
El bloque queda cerrado después de que el build tardío dejara de reintroducir copy legacy.

Corrección final:
- normalizador post-R69: `6d5c575e1e6a276fb545af723a36c19800147618`
- hook de build: `8ede1263843a86706aa9ab0f46d1e321eb3ce441`
- checkpoint previo: `d1b7b973c31e49f74ab925d826e0545d256d027f`
- CI final: `37113131250`
- job: `111174746246`
- conclusión: `SUCCESS`

Resultado:
- #22 Condiciones: cabecera breve.
- #24 Situaciones: cabecera breve.
- #27 Ayudas: título/texto funcional sin explicación redundante.
- ES/EN preservados donde existe superficie bilingüe del bloque.
- `main` no modificado.

Estado:
`P22_P24_P27_FINAL_PASS`

## Inglés
Regla vigente:
- el inglés no es traducción literal mecánica;
- mantener jerarquía y función idénticas entre ES/EN;
- copy público natural y breve;
- no filtrar metadatos editoriales/QA;
- accesible name/alt localizado debe venir del contrato público de idioma cuando el asset interno no sea suficiente.

En este bloque:
- Conditions EN: copy breve y natural.
- Situations EN: copy breve y natural.
- el directorio de ayudas reparado corresponde a la superficie ES de `/es/tramites/directorio/`; no se inventa una ruta EN inexistente.

## Refresh de estándares · 03/10/2026
Verificado en fuentes oficiales:
- WCAG 2.2 sigue siendo W3C Recommendation; versión publicada 12/12/2024.
- EN 301 549 V4.1.1 (2026-09) ya está publicada y la edición 2026 usa WCAG 2.2.
- WAI-ARIA 1.2 sigue siendo Recommendation.
- WAI-ARIA 1.3 continúa como Working Draft; no usarla como requisito estable.
- ARIA in HTML tiene Recommendation actualizada en 2026.
- Design Tokens Format Module 2025.10 sigue siendo el formato publicado de referencia del CG; no es W3C Standard.

Frontera:
Prisma implementa contratos; Axioma conserva autoridad de standards/conformidad y Lex la aplicabilidad jurídica.

## #370 · reconciliación de orden
Estado más reciente observado:
- 88 constelaciones R03: ya integradas por Motor.
- Cielo B00 y Eclipses: rework Axioma corregido; retest Axioma pendiente.
- Atlas cerró packaging de Cielo 88, Meteoros 10 y Solar B03 10 en `69199a98e75db50bfdd171b7b3538f2b546b13b7`.
- El orden de integración permanece:
  `Constelaciones → Solar principal → B03 → Meteoros → Exoplanetas`.
- Solar principal aún requiere `ATLAS_WEB_PACKAGING_FOR_SOLAR_FOUNDATION_FINAL_10`.

Por tanto:
- no saltar directamente a B03/Meteoros;
- no inventar paths/hashes;
- no reabrir Cielo/Eclipses salvo defecto devuelto por Axioma;
- no tocar masters KEEP_LOCKED.

## Siguiente acción
1. Cerrar formalmente P22/P24/P27 en #369.
2. Mantener #369 y #370 separados.
3. Para Cielo y espacio, esperar el packaging web canónico de Solar principal o una orden explícita que cambie el orden.
4. Cuando llegue, integrar un solo paquete, ejecutar ES/EN + 390/1440 + accesibilidad/forced-colors/lazy y handoff a Axioma.
