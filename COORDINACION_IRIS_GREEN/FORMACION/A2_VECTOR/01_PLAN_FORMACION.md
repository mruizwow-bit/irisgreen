# VECTOR · PLAN DE FORMACIÓN PROFESIONAL R01

## Profesión

**Web Release & Integration Engineering**

No se limita a una herramienta.

### Bloque 1 · Git avanzado e internals

Dominar:
- blobs, trees, commits, refs;
- HEAD;
- merge-base;
- ancestor/descendant;
- three-way merge;
- diff entre trees;
- cherry-pick;
- rebase;
- revert;
- reset y por qué está restringido en ramas compartidas;
- worktrees/repos temporales;
- bundles;
- patches;
- bisect;
- reflog en entornos donde exista.

Fuentes:
- Git manual: https://git-scm.com/docs/user-manual
- Git reference: https://git-scm.com/docs

Práctica Iris Green:
- comparar handoff antiguo con A2 vivo;
- explicar qué archivos colisionan;
- demostrar por qué aplicar un ZIP completo sería destructivo;
- reconstruir un delta mínimo.

### Bloque 2 · Release Engineering

Dominar:
- reproducibilidad;
- releases identificables;
- build inputs;
- versionado;
- artefactos;
- promoción;
- rollback;
- release candidate;
- “no probar A y publicar B”.

Fuente principal:
- Google SRE · Release Engineering:
  https://sre.google/sre-book/release-engineering/

Estudiar además:
- Canarying Releases:
  https://sre.google/workbook/canarying-releases/

### Bloque 3 · Build Engineering

Dominar:
- fuentes → build → dist;
- determinismo/reproducibilidad cuando aplique;
- dependencias;
- manifests;
- hashes;
- cache;
- inputs externos;
- scripts que mutan salida;
- diferencia código fuente / artefacto publicado.

Práctica:
- trazar `scripts/build_site.py`;
- identificar qué scripts postprocesan child-safe, rutas, assets y metadata;
- generar inventario del output y compararlo con HEAD fuente.

### Bloque 4 · GitHub Actions / CI-CD

Dominar:
- triggers;
- jobs;
- needs;
- artifacts;
- permissions;
- environments;
- approvals;
- secrets;
- concurrency;
- matrices;
- gates;
- attestations.

Fuentes:
- https://docs.github.com/en/actions
- Deployment environments:
  https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments
- Control deployments:
  https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments
- Artifact attestations:
  https://docs.github.com/en/actions/concepts/security/artifact-attestations

Práctica:
explicar qué checks prueban R67 de verdad y cuáles solo prueban piezas aisladas.

### Bloque 5 · Netlify como plataforma de release

Dominar:
- production;
- deploy-preview;
- branch-deploy;
- preview-server;
- dev;
- permalink inmutable;
- URL mutable de preview;
- build contexts;
- rollback;
- CLI vs Git deploy;
- headers/redirects;
- variables por contexto.

Fuentes:
- Deploy overview:
  https://docs.netlify.com/deploy/deploy-overview/
- Deploy Previews:
  https://docs.netlify.com/deploy/deploy-types/deploy-previews/
- Production deploy:
  https://docs.netlify.com/deploy/deploy-types/production-deploy/
- Manage deploys:
  https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/
- CLI:
  https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/

Práctica:
- identificar deploy preview por PR;
- identificar permalink exacto;
- demostrar qué contenido puede cambiar bajo una URL de preview y cuál no;
- diseñar rollback sin recompilar.

### Bloque 6 · Seguridad de CI/CD y supply chain

Dominar:
- least privilege;
- secretos;
- dependencias;
- pipeline tampering;
- artifact integrity;
- provenance;
- firma/attestations;
- separación preview/production.

Fuentes:
- OWASP CI/CD Security:
  https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html
- SLSA Provenance:
  https://slsa.dev/spec/v1.2/provenance

Práctica:
crear checklist de “qué NO debe entrar en Git/client/build público”.

### Bloque 7 · QA de integración

Dominar:
- component PASS ≠ integrated PASS;
- smoke;
- regression;
- contract tests;
- visual QA;
- a11y;
- mobile;
- payload;
- network;
- negative tests;
- HUMAN QA.

En Iris Green:
- ES/EN;
- 1440/390/320;
- LIGHT/DARK NAVY;
- AGE_*;
- child-safe hard payload;
- no legacy flash;
- no duplicate header/footer/controls;
- navegación funcional;
- Sabik/Taller/Rincón según orden.

### Bloque 8 · Web platform debugging

Estudiar:
- DOM lifecycle;
- first paint/hydration/runtime replacement;
- CSS cascade/layers;
- caching;
- resource order;
- network;
- responsive;
- accessibility tree;
- CSP;
- media queries;
- forced-colors/reduced-motion.

Fuentes:
- MDN Web Docs: https://developer.mozilla.org/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/

Práctica:
diagnosticar un “se ve bien en código pero mal en preview” sin reescribir a ciegas.

### Bloque 9 · Operación de incidentes y rollback

Dominar:
- detectar;
- contener;
- preservar;
- revertir de forma segura;
- no resetear trabajo válido;
- comparar antes/después;
- postmortem factual.

Aplicar:
`PRESERVE → INTEGRATE → ACTIVATE → NEW_WORK`.

### Bloque 10 · Métricas de entrega

Fuente:
- DORA metrics:
  https://dora.dev/guides/dora-metrics/

Usar para aprender:
- frecuencia de entrega;
- recovery;
- change fail rate;
- rework.

NO convertirlas en KPI de presión sobre agentes.
Sirven para descubrir fallos del proceso.

## Resultado de formación

Vector debe producir:
`APRENDIZAJE_VECTOR_2026-09-30.md`

con explicación, prácticas y runbook.

Marcador interno de graduación inicial:
`A2_VECTOR_RELEASE_ENGINEERING_FOUNDATION_PASS`.

Ese marcador NO autoriza producción.
