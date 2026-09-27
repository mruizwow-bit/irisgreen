# R42 · Rincon.zip · A7 porta dos fixes · 27/09/2026

**Estado: `R42_RINCON_ZIP_A7_FIXES_READY_FOR_A2`.**

En cumplimiento del handoff `R42_RINCON_ZIP_AUDIT_A7_A2_ONLY`, Agente 7 porta únicamente los dos fixes del Rincón detectados en la entrega Design R01. No se integra el bundle completo.

## Base vigente
- A2 HEAD al rehacer el delta: `a0036d541393f103d2dfefd05ec2f66a979f49e2`.

## Entrega A7
- branch `agent7/r42-rincon-fix-clean-hidden-r02-20260927`
- HEAD `2b5db6dfcffa3c17b375abb4629016fd14cc65a7`
- tree `165ac2f3c9f2cc389ef74d67b2b20b414adaf793`
- PR #303 · draft · mergeable
- precheck `R42_A7_RINCON_TWO_FIXES_PASS`

## Fix 1 · Pantalla limpia
Se sustituye la mutación repetitiva de clases de `body` por `setBodyClass(c,on)`, que solo muta cuando el estado cambia. Esto evita que el `MutationObserver` sobre `body.class` se realimente y congele la página.

## Fix 2 · control oculto
Se añade `.r42-rincon .r40-scene-actions [hidden]{display:none!important}` para que `#sceneTouch[hidden]` no sea forzado a `display:flex!important` ni aparezca como píldora vacía sin nombre accesible.

## Despliegue seguro
ES y EN actualizan los query strings de `rincon-r42.js` y `rincon-r42-humanqa.css` a `-d01` para evitar caché de las versiones defectuosas.

## Límites
No cambia audio, escenas, catálogo, real-media ni diseño audiovisual. A2 integra #303 y valida en preview.
