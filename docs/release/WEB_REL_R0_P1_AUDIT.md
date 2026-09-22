# WEB-REL-R0 · Auditoría independiente de los cuatro P1 de #179

**Base inicial:** `main@fb396a2d4963045d489970866c5089a8e28e9533`  
**Fuente:** PR #179 · `CI_POST_AUDIT_FINDINGS`.  
**Candidato frontend verificado:** PR #189 · `70f96961e617973113c868f6f3be4def81a37092`.

| P1 | Evidencia independiente | Estado R0 |
|---|---|---|
| Contraste `/es/tramites/directorio/` | #189 cambia solo el eyebrow `#1f8ba8 → #16708a`. Cálculo independiente sobre blanco: **5,647:1**, superior a 4,5:1 para texto normal. El build de #189 también informa la corrección final del Directorio a contraste 5,02:1. El workflow global de contraste sigue rojo por **4 firmas de pixel probe**, pero registra **0 best-case-white failures**: el P1 concreto del Directorio queda corregido. | **PASS_P1_189** |
| `/es/tarjetas-iris/` sin `<main>/<h1>` | #189 añade exactamente un `<main id="main">` y un `<h1>Tarjeta Iris</h1>` sin cambiar la redirección. En el workflow de publicación de #189 la auditoría estructural termina **SUCCESS**; el rojo global procede del contrato congelado de indexación 999→1003 HTML / 995→999 sitemap. | **PASS_P1_189** |
| copy-status / teclado | #189 actualiza únicamente el test obsoleto para la herramienta canónica `/es/recursos/tarjeta-iris/`, `#ti-copy` + `#ti-card-status`, y exige `role=status`, `aria-live=polite`, `aria-atomic=true`, anuncio «Copiada.» y foco conservado. Workflow `Comprobar WCAG flujos de teclado` de #189: **SUCCESS**. | **PASS_P1_189** |
| sessionStorage | Inventario real y política congelados en `browser-storage-contract-r0.json`; no se corrige producto. | **RESUELTO_CONTRACTUALMENTE_R0** |

## Scope

Agente 1 **no modifica** los tres archivos de frontend de #189. La verificación se hace contra su SHA y su artefacto/CI.

La corrección histórica de copia de #101 no sustituye esta verificación: #179 demostró que el test publicado seguía apuntando a la ruta/IDs históricos.

## Rojos globales que no invalidan estos tres P1

- Contraste global: 4 firmas de pixel probe todavía requieren tratamiento separado; el P1 del Directorio ya no está entre los fallos de contraste de texto sobre blanco.
- Preflight de publicación: contrato congelado de indexación desactualizado; no modificar dentro de #189.
- Privacidad/almacenamiento: deuda contractual de las claves sessionStorage; resuelta en este carril QA R0, no dentro de #189.

**No deploy.**
