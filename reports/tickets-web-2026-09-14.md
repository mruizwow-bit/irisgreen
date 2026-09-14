# Verificación de los cinco tickets web · 14-09-2026

Base revisada: `main` en `b40d5bf5f6c0e06bd89ee517badb8d19b69bddc5`.

Este informe no cambia producción. `reports/` está fuera de `dist` por contrato de `scripts/build_site.py`.

## Resultado

Cuatro partes funcionales del encargo ya estaban resueltas en el `main` restaurado antes de abrir esta rama. Conforme a la regla «si alguno se cerró por otra vía, se anota y no se toca», no se modifica ninguna de esas implementaciones. B.5 sí conserva una entrega pendiente: documentar el plan de retirada completa de `unsafe-inline`; `unsafe-eval` ya fue eliminado de la salida pública por una implementación anterior.

### B.1 · `frame-src` y reproductores — CERRADO

- `_headers` ya publica `frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.instagram.com`.
- `scripts/audit_csp_dependencies.py` ya usa esos hosts permitidos; no conserva la expectativa `frame-src 'none'`.
- `scripts/fix_video_external_links.py`, integrado en `scripts/build_site.py`, añade el enlace externo de respaldo usando el destino y la etiqueta ya existentes en cada vídeo.
- `scripts/test_csp_runtime.py` ya activa reproductores reales en `/es/videos/`: expande la colección, pulsa el poster, espera el `<iframe>`, intercepta la petición al proveedor para no depender de Internet y falla si aparecen mensajes `Content Security Policy` / `Refused to…` o si el proveedor no llega a intentar cargarse.
- El historial contiene el commit `edbb78e5141697acd6ccce338df56311a24026e3` (`Prueba la CSP al activar los reproductores`) y su corrección posterior `f2844ba2cb873043fb49c6b3ae669a7ba20e44c0`.

No se toca CSP ni código de vídeo en este PR.

### B.2 · Buscadores de Investigación y Vídeos — CERRADO

- `scripts/fix_search_accessible_names.py`, integrado en el build, inyecta nombres estables en la salida pública:
  - Investigación: `Buscar publicaciones`.
  - Vídeos: `Buscar vídeos`.
- El script falla si no encuentra exactamente un buscador por página o si el `aria-label` final no queda publicado.
- La salida sin JavaScript ya lleva el nombre accesible porque la corrección se aplica directamente a `dist`, no después de montar el runtime.
- Con JavaScript, `scripts/audit_axe_wcag.py` incluye expresamente `/es/investigacion/` y `/es/videos/` y mantiene baseline de cero `violations`.
- El foco visible ya está definido en `assets/controles-comunes.css`: `.ig-search-shell:focus-within` dibuja `outline:3px solid #5a49a8` con `outline-offset:3px`; el `outline:0` del input queda limitado al interior de ese contenedor visible.
- El historial registra `b4a69a7ebeaea619088065a821d6b3e67305d025` (`Añade nombres accesibles a los dos buscadores`).

No se toca plantilla, CSS ni JS en este PR.

### B.3 · Siete pares `hreflang` de Condiciones — CERRADO

`scripts/fix_condition_hreflang.py`, integrado en el build, declara exactamente las siete parejas solicitadas y publica `es`, `en` y `x-default` en ambos documentos. El propio script vuelve a leer los 14 HTML y falla ante ausencia, valor incorrecto o duplicado. `scripts/audit_seo_idiomas.py` añade además la comprobación general de reciprocidad.

Parejas verificadas:

1. `tdah` ↔ `adhd`.
2. `autismo` ↔ `autism`.
3. `dislexia` ↔ `dyslexia`.
4. `arfid` ↔ `arfid`.
5. `evitacion-persistente-de-demandas-perfil-pda` ↔ `persistent-demand-avoidance-pda-profile`.
6. `sueno` ↔ `sleep`.
7. `trastorno-del-desarrollo-de-la-coordinacion-dcd-dispraxia` ↔ `developmental-coordination-disorder-dcd-dyspraxia`.

No se toca hreflang en este PR.

### B.4 · Descripciones y títulos duplicados — CERRADO

`scripts/fix_seo_metadata.py`, integrado en el build:

- diferencia los dos títulos ES y los dos EN de empleo/autismo por país;
- cambia el título de la página temática de autismo a `Autismo en el día a día · Iris Green`, separándolo de la condición;
- sustituye las descripciones genéricas de Situaciones usando texto ya existente en `buscador.json` y, cuando ese texto sigue siendo genérico, el `.lede` ya publicado en la ficha;
- no inventa contenido visible.

El historial contiene `c4f88d6ce9beec36dbc11a8b37b61f5a84b6b7dd` (`Corrige metadatos SEO sin inventar contenido`) y `aba7397d45725526c984f82c7e510fa0c9db822e` (`Sincroniza SEO de Situaciones con texto existente`).

No se toca SEO en este PR.

### B.5 · Retirada de `unsafe-inline` / `unsafe-eval` — PARCIALMENTE CERRADO

La parte `unsafe-eval` del ticket fue ejecutada antes de este encargo y no se reabre:

- `scripts/finalize_dc_runtime_csp.py` identifica exactamente 24 páginas DC;
- precompila el bloque de lógica de cada una durante el build;
- publica un runtime CSP-safe sin `eval()` ni `new Function()`;
- retira los runtimes antiguos de `dist`;
- elimina `unsafe-eval` **solo en `dist/_headers`**;
- falla si aparecen imports dinámicos no contemplados, `{{ }}` crudos en markup o enlaces con plantilla cruda.

`scripts/check_csp_eval_scope.py` impide reintroducir `eval()`, `new Function()` o `unsafe-eval` en la salida pública.

La salida pública sigue necesitando `script-src 'unsafe-inline'`. La entrega pendiente de B.5 es únicamente el plan escrito para retirarlo con seguridad. Ese plan se añade en `reports/plan-csp-unsafe-inline-2026-09-14.md`; **no se ejecuta en este PR y no se modifica la CSP**.

## Archivos tocados

- `reports/tickets-web-2026-09-14.md` — este informe.
- `reports/plan-csp-unsafe-inline-2026-09-14.md` — plan de B.5, sin ejecución.

## Comprobaciones

- Revisión del `main` exacto indicado arriba, no de una rama de rutinas, Juegos, Tarjetas o Design.
- Verificación de integración de cada script en `scripts/build_site.py`.
- Verificación de la CSP fuente y de la transformación CSP de `dist`.
- Verificación de los guardarraíles existentes de navegador, axe, hreflang y SEO.
- Sin cambios en menú, plantilla común, contenido visible ni CSP.

## Capturas

No proceden: este PR no cambia ninguna interfaz ni producción.

## Decisiones pendientes para la propietaria

Ninguna para este PR. La ejecución del plan B.5 requiere un PR separado y revisión previa, tal como pide el encargo.
