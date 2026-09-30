# APRENDIZAJE_VECTOR_2026-09-30

Estado de formación:
`FOUNDATION_STUDIED_PRACTICE_PENDING`

Marcador:
`A2_VECTOR_RELEASE_ENGINEERING_FOUNDATION_STUDIED`

> Este documento es continuidad técnica. Los SHAs, deploy IDs y estados de proyecto son una fotografía del 30/09/2026 y DEBEN revalidarse al abrir un chat nuevo.

## Identidad

- Alias: **Vector**
- Agente: **A2 / Agente 2**
- Puesto profesional: **Web Release & Integration Engineer**
- Español: **Ingeniero de Release e Integración Web**
- Jefatura: **Aura**
- Especialidad: Release Engineering + Build Engineering + CI/CD + integración web multicomponente.
- Misión Iris Green: ser el **gateway único de integración y release de la web**.

Ruta profesional:

`HANDOFF → RECONCILIACIÓN → INTEGRACIÓN → BUILD → ARTEFACTO → QA → PREVIEW → HUMAN QA → RELEASE`

Vector no es “el que sube cosas a Netlify”.

---

## Qué estudié

### Google SRE · Release Engineering
https://sre.google/sre-book/release-engineering/

Aprendizaje:
- Release Engineering gobierna el recorrido desde source hasta release.
- Versionado, build, testing, empaquetado y deployment forman un solo sistema.
- Un release debe ser identificable, repetible y controlable.
- No se debe normalizar el “snowflake release”: una versión construida de una manera irrepetible.

### Google SRE Workbook · Canarying Releases
https://sre.google/workbook/canarying-releases/

Aprendizaje:
- separar candidate, validación y promoción;
- reducir blast radius;
- definir señales de fallo antes de liberar;
- preparar rollback/fix-forward conscientemente.

### Google SRE · Postmortem Culture
https://sre.google/sre-book/postmortem-culture/

Aprendizaje:
- un fallo debe convertirse en una mejora del sistema;
- evitar culpabilizar;
- preguntar qué gate, control o supuesto permitió la regresión.

### Git oficial / Pro Git
https://git-scm.com/docs
https://git-scm.com/book/en/v2/Git-Internals-Git-Objects
https://git-scm.com/docs/git-merge-base
https://git-scm.com/docs/git-cherry-pick
https://git-scm.com/docs/git-rerere

Aprendizaje:
- blob = contenido;
- tree = snapshot del árbol;
- commit = tree + padres + metadatos;
- branch/ref no es la identidad suficiente de una entrega;
- `merge-base` es clave para reconciliar handoff y A2 vivo;
- merge sin conflicto textual puede contener conflicto funcional;
- cherry-pick/patch sirven para portar deltas concretos;
- rerere puede ayudar, pero nunca sustituye revisión consciente.

### GitHub Actions
https://docs.github.com/en/actions
https://docs.github.com/en/actions/reference/security/secure-use
https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency
https://docs.github.com/en/actions/concepts/security/artifact-attestations
https://docs.github.com/en/actions/tutorials/store-and-share-data

Aprendizaje:
- CI no equivale a “tener muchos workflows”;
- los gates deben probar el producto combinado vigente;
- permisos mínimos;
- actions por full SHA cuando sea viable;
- separar secrets y permisos de producción;
- usar environments/approvals/concurrency para promoción;
- identificar artefactos con digest/provenance;
- un job verde solo demuestra lo que realmente prueba.

### Netlify
https://docs.netlify.com/deploy/deploy-overview/
https://docs.netlify.com/deploy/deploy-types/deploy-previews/
https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/
https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/
https://cli.netlify.com/commands/deploy/
https://docs.netlify.com/build/environment-variables/overview/
https://docs.netlify.com/build/configure-builds/file-based-configuration/

Aprendizaje:
- distinguir `production`, `deploy-preview`, `branch-deploy`, `preview-server`, `dev`;
- el alias de Deploy Preview puede cambiar con nuevos pushes;
- el permalink por deploy ID identifica un deploy concreto;
- `netlify deploy` no es lo mismo que `netlify deploy --prod`;
- production no debe usarse para QA;
- deploy bloqueado es una defensa útil;
- rollback puede publicar un deploy anterior sin recompilar;
- `NETLIFY=true`, `CONTEXT`, `BRANCH` pueden cambiar el comportamiento del build.

### DORA
https://dora.dev/capabilities/continuous-delivery/
https://dora.dev/capabilities/deployment-automation/
https://dora.dev/capabilities/trunk-based-development/
https://dora.dev/guides/dora-metrics/

Aprendizaje:
- cambios pequeños reducen riesgo de integración;
- integración frecuente detecta incompatibilidades antes;
- medir recovery, fallos y retrabajo sirve para mejorar el sistema, no para presionar personas;
- una entrega rápida que genera retrabajo no es buen rendimiento.

### SLSA / provenance
https://slsa.dev/spec/v1.2/
https://slsa.dev/spec/v1.2/provenance

Aprendizaje:
- un artefacto debe poder relacionarse con inputs y proceso de build;
- la procedencia verificable reduce ambigüedad entre source y binario/artefacto publicado.

### NIST SSDF
Final estudiado:
https://csrc.nist.gov/pubs/sp/800/218/final

Borrador revisado, NO presentar como final:
https://csrc.nist.gov/pubs/sp/800/218/r1/ipd

Aprendizaje:
- proteger organización, software, proceso y respuesta a vulnerabilidades;
- distinguir siempre norma final de draft;
- SSDF 1.1 / SP 800-218 es referencia final estudiada; la revisión posterior no se eleva a final sin comprobar NIST.

### OWASP CI/CD Security
https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html
https://owasp.org/projects/top-10-cicd-security-risks

Aprendizaje:
- el pipeline es infraestructura crítica;
- riesgos: permisos excesivos, secretos, dependencias, pipeline poisoning, terceros, falta de integridad y falta de trazabilidad.

### OpenSSF / Reproducible Builds / SBOM
https://openssf.org/scorecard/
https://reproducible-builds.org/docs/definition/
https://reproducible-builds.org/docs/
https://www.cisa.gov/sites/default/files/2025-08/2025_CISA_SBOM_Minimum_Elements.pdf

Aprendizaje:
- fijar y conocer dependencias;
- buscar builds reproducibles;
- SBOM/provenance son herramientas de trazabilidad, no burocracia decorativa.

---

## Lo explico con mis palabras

### 1. El HEAD real manda

Nunca integrar desde memoria, nombre de rama o texto histórico de un PR.

Antes de tocar una entrega:
- repositorio;
- branch;
- HEAD real;
- tree real;
- base;
- merge-base;
- diff;
- archivos tocados;
- checks sobre ese SHA.

Un PR puede describir un HEAD antiguo mientras la rama ya avanzó.

### 2. Integrar no es copiar

A2 no “pone una carpeta encima”.

Debe comparar:

`BASE_HANDOFF → HEAD_HANDOFF`

contra:

`BASE_HANDOFF → HEAD_A2_ACTUAL`

y clasificar cambios como:
- KEEP;
- PORT;
- CONFLICT;
- SUPERSEDED.

### 3. El artefacto es el producto

En Iris Green:

`source → scripts/build_site.py → dist/`

La web desplegable es **dist/**.

Que un archivo exista en source no demuestra que:
- sobreviva al build;
- quede cargado;
- no sea reescrito por otro postprocesado;
- no colisione con otra generación de UI.

### 4. Component PASS ≠ Integrated PASS

Muchos módulos verdes no garantizan un producto verde.

Debe probarse la composición final.

### 5. Test what you deploy / deploy what you tested

La evidencia de QA debe apuntar al mismo candidato que se pretende enseñar/promover.

Si se reconstruye otro candidato:
- nueva identidad;
- nuevos hashes;
- gates relevantes otra vez.

### 6. Preview no es producción

Preview/draft sirve para revisar.
Producción exige promoción explícita y gate humano cuando la orden lo exige.

### 7. READY no significa aceptado

Netlify READY = deploy terminado.
No significa:
- producto correcto;
- QA aprobada;
- HUMAN QA hecha;
- seguridad o accesibilidad cerradas.

### 8. Permalink inmutable para QA

Para HUMAN QA registrar:
- source SHA;
- deploy ID;
- permalink inmutable;
- alias mutable si existe.

No depender únicamente de `deploy-preview-N--...`.

### 9. Rollback se prepara antes

Antes de producción identificar:
- deploy sano anterior;
- permalink;
- procedimiento;
- qué ocurre con auto-publish después del rollback.

### 10. Seguridad pertenece al pipeline

Least privilege, secrets, dependencias, actions, provenance, integridad y separación preview/production son parte del release, no una revisión posterior.

---

## Qué practiqué en Iris Green

### A. Reconstrucción de mi función real

Leí la coordinación y confirmé que A2 es el **gateway único de la web**.

Fuente clave:
- Issue #254: freeze/handoff A2 y corrección de alcance.
- Issue #247: R40 por fases.
- Issue #333: R67 A2 integración real.

Conclusión:
otros agentes pueden construir y probar módulos; **A2 integra y sube la web integrada**.

### B. Separación de repositorios/sistemas

Repositorios inspeccionados:
- `mruizwow-bit/irisgreen`: web pública y pipeline web.
- `mruizwow-bit/nea-web-irisgreen`: paquete NEA/Unity/web separado.

Conclusión:
NEA no se “vuelca” a Netlify. Su propio documento `PAQUETE_INTEGRACION_NEA_WEB_V1.md` dice que genera un paquete mínimo para integración y que no debe publicarse automáticamente.

Regla:
**paquete externo → handoff → reconciliación Iris → build Iris → preview Iris → QA**.

### C. Pipeline público real

Leí:
- `netlify.toml`;
- `scripts/build_site.py`;
- `scripts/repair_routes.py`;
- `.github/workflows/comprobar-publicacion.yml`;
- workflows de publicación cuando existen en la rama examinada.

Confirmación:
- publish dir = `dist`;
- build = `python3 scripts/build_site.py`;
- `dist` se crea desde cero;
- se excluyen dirs de trabajo;
- build normal ocurre sobre staging temporal para no modificar source real.

### D. Problema de generaciones de UI

En A2 vivo observé que `build_site.py` encadenaba distintas generaciones/adaptadores:
- page finder;
- R42;
- R50/R67;
- shell global;
- posteriores capas.

Esto explica por qué PASS parciales podían coexistir con producto visible mezclado.

R69 (#341) documenta la misma causa raíz: varias generaciones de interfaz coexistiendo.

Aprendizaje:
**orden y ownership del pipeline importan tanto como los archivos.**

### E. Estado A2 leído de forma viva al cerrar esta formación

PR A2:
- PR **#244**
- rama: `agent2/sabik-iris-r08-20260924`
- HEAD leído: **8ea50128b490207b4dd5508c3c46692f5be69c87**
- PR abierto/draft.
- El cuerpo del PR contiene texto histórico: NO usarlo como HEAD sin revalidar.

Deploy Preview comprobada:
- site: `irisgreen-home`
- site ID: `40042464-343c-4587-b6b7-f6159836e291`
- deploy ID: **6abc96c64143ae0008099792**
- state: READY
- context: **deploy-preview**
- review_id: 244
- commit_ref: **8ea50128b490207b4dd5508c3c46692f5be69c87**
- branch: `agent2/sabik-iris-r08-20260924`
- published_at: null
- manual_deploy: false
- Functions: 0
- Edge Functions: 0
- permalink: `https://6abc96c64143ae0008099792--irisgreen-home.netlify.app`
- alias mutable: `https://deploy-preview-244--irisgreen-home.netlify.app`
- secret scan del deploy: sin matches reportados por Netlify.

Esto es un buen ejemplo de identidad trazable:
**PR + branch + commit_ref + deploy ID + permalink**.

### F. R69: ejemplo de por qué leer HEAD real

PR **#341**:
- base: rama A2
- base SHA: `8ea50128b490207b4dd5508c3c46692f5be69c87`
- rama: `astra/r69-unified-interface-recovery-20260930`
- HEAD real leído al cerrar esta formación: **6f6392f833a4d1d6716ecabec4e192b70d180b0b**
- abierto/draft.

El cuerpo de #341 todavía describe un “HEAD final” histórico diferente.

Aprendizaje:
**el cuerpo del PR es documentación; el HEAD API/Git es identidad.**

No integrar #341 por el SHA escrito en la descripción sin revalidar.

### G. Workflow de preview antigua peligrosa

Leí un workflow que usaba una URL fija:
`deploy-preview-337--irisgreen-home.netlify.app`

R69 incorpora un modelo mejor:
- URL exacta de preview como input;
- no polling sobre alias histórico.

Aprendizaje:
un test live puede estar verde y probar **otra web** si la URL está hardcodeada.

### H. Sabik: conexión web ≠ backend dentro de Iris

Leí:
- `sabik/mount-config.mjs`;
- `sabik/iris-mount.mjs`;
- `sabik/authorized-transport.mjs`;
- `_headers`.

Confirmé que el transporte aprobado no es un fetch directo convencional:
- crea iframe oculto al Cloud exacto;
- negocia `MessageChannel`;
- valida `event.origin`;
- controla timeout/cancelación;
- CSP habilita el origen mediante `frame-src`;
- `connect-src` de Iris continúa acotado a self.

Aprendizaje:
cambiar Cloud exige revisar como conjunto:
1. mount-config;
2. transport;
3. CSP;
4. allowlist/origen del Cloud;
5. QA HTTP/messaging;
6. UI.

### I. Producción ≠ A2 preview

Durante formación comprobé que el deploy de producción disponible en Netlify era manual/drop y no llevaba `commit_ref`.

Aprendizaje:
no se puede afirmar “producción corresponde a SHA X” si Netlify no conserva esa relación y no existe evidencia externa suficiente.

No inferir.

### J. Diferencias de entorno en build

Leí `prepare_video_thumbnails.py` y observé que `build_site.py` varía argumentos según `NETLIFY=true`.

Aprendizaje:
local/GitHub Actions/Netlify pueden producir comportamiento diferente si un script lee variables de plataforma.

Todo branching por entorno debe ser:
- intencional;
- documentado;
- probado;
- incluido en reproducibilidad.

---

## Pruebas negativas / fallos que sé reconocer

### Handoff viejo sobre A2 vivo
Riesgo:
restaurar archivos antiguos y perder trabajo nuevo.

Detección:
merge-base + diff a ambos lados + lista de solapamientos.

### PASS aislado sin PASS integrado
Riesgo:
shell, Taller, Sabik y child-safe pasan por separado pero se pisan en build.

Detección:
build final + navegador sobre dist + preview real.

### Preview mutable
Riesgo:
María revisa una URL que luego apunta a otro push.

Mitigación:
permalink por deploy ID + SHA.

### Test contra URL equivocada
Riesgo:
workflow prueba deploy-preview histórico.

Mitigación:
pasar URL exacta y validar metadata del deploy.

### READY asumido como QA
Riesgo:
deploy técnicamente terminado pero producto incorrecto.

Mitigación:
smoke + gates + HUMAN QA.

### Source correcto / dist incorrecto
Riesgo:
postprocesado posterior cambia o elimina integración.

Mitigación:
QA de artefacto.

### Producción como preview
Riesgo:
uso accidental de `--prod`.

Mitigación:
preview/draft separado + gate de production.

---

## Errores propios detectados

### Error 1 · identidad funcional equivocada al iniciar este chat

Respondí inicialmente como si “Agente 2” perteneciera al trabajo de Instagram.

Causa:
continuidad insuficiente entre chats/roles.

Corrección:
leer identidad canónica `FORMACION/A2_VECTOR` y GitHub vivo antes de responder sobre función.

Regla nueva:
**Vector = A2 = Web Release & Integration Engineer.**
Instagram no pertenece a Vector.

### Error 2 · concebir el trabajo como “subir paquetes”

Causa:
modelo operativo demasiado simple.

Corrección:
adoptar Release Engineering como profesión.

Regla nueva:
no existe “subir paquete” sin:
base → delta → reconciliación → build → artefacto → QA → preview.

### Error 3 · riesgo de confiar en documentación del PR

Hallazgo:
#341 tenía HEAD escrito en body distinto del HEAD real.

Corrección:
leer HEAD actual por Git/API antes de integrar.

### Error 4 · confundir disponibilidad de archivo con integración

Corrección:
un módulo no está integrado hasta que:
- build lo incorpora;
- artefacto lo contiene/ejecuta;
- no lo pisa otra capa;
- QA final lo prueba.

---

## Runbook resumido

### Intake
1. leer orden;
2. leer A2 HEAD/tree vivo;
3. leer handoff HEAD/tree/base;
4. obtener merge-base;
5. diff handoff/base;
6. diff A2/base;
7. clasificar KEEP/PORT/CONFLICT/SUPERSEDED.

### Integración
8. preservar baseline;
9. aplicar delta mínimo;
10. resolver conflictos con ownership;
11. no rehacer módulo ajeno;
12. commit acotado.

### Build
13. construir `dist`;
14. verificar que source no quedó mutado;
15. inventariar artefacto;
16. registrar hashes cuando aplique.

### QA
17. unit/integration;
18. build gates;
19. static artifact gates;
20. browser sobre dist;
21. regresión transversal;
22. ES/EN y breakpoints aplicables;
23. tests negativos del cambio.

### Preview
24. desplegar preview/draft, no production;
25. leer metadata Netlify;
26. confirmar context;
27. confirmar commit_ref cuando exista;
28. registrar deploy ID;
29. registrar permalink inmutable;
30. smoke live.

### Handoff de QA
31. comunicar SHA + tree + deploy ID + permalink + alias + gates + pendientes;
32. HUMAN QA cuando la orden lo exija.

### Producción
33. solo autorización explícita;
34. candidato aprobado identificado;
35. rollback preparado;
36. un solo deploy concurrente;
37. publicar;
38. verificar producción;
39. smoke;
40. registrar.

Runbook ampliado:
`04_RUNBOOK_RELEASE_R01.md`.

---

## Límites actuales

Esta sesión **NO** acredita todavía todos los laboratorios/examen de `02_PRACTICAS_Y_EXAMEN.md`.

Pendiente:
- ejecutar laboratorio reproducible completo;
- ejercicio formal KEEP/PORT/CONFLICT/SUPERSEDED sobre un handoff que vaya realmente a integrarse;
- prueba de build doble + hashes sobre candidato acordado;
- examen aplicado completo;
- endurecimiento real del workflow de producción, solo cuando exista orden de producto/infra para ello.

No se ha:
- hecho merge a main;
- desplegado producción;
- modificado producto;
- autorizado R69;
- completado HUMAN QA;
- alterado Netlify.

La jornada ha sido de **formación + documentación**.

---

## Estado al cerrar el chat

### Fuente de coordinación
Branch:
`coordinacion/iris-green-canonica-20260924`

Carpeta:
`COORDINACION_IRIS_GREEN/FORMACION/A2_VECTOR/`

### A2
- PR #244 abierto/draft.
- rama A2: `agent2/sabik-iris-r08-20260924`.
- HEAD observado: `8ea50128b490207b4dd5508c3c46692f5be69c87`.

### Preview A2 observada
- deploy: `6abc96c64143ae0008099792`;
- commit_ref = `8ea50128...`;
- context = deploy-preview;
- published_at = null;
- permalink inmutable registrado arriba.

### R67
- Issue #333 abierto.
- Es la orden P0 de integración conjunta A2.
- No inferir cierre por PASS parciales.

### R69
- PR #341 abierto/draft.
- base A2 = `8ea50128...`.
- HEAD real observado al cierre = `6f6392f833a4d1d6716ecabec4e192b70d180b0b`.
- cuerpo del PR contiene SHAs históricos: volver a leer.
- necesita seguir gates/QA de su orden; no producción implícita.

---

## Los primeros 15 minutos del siguiente Vector

1. Leer `00_IDENTIDAD_Y_PUESTO.md`.
2. Leer `01_PLAN_FORMACION.md`.
3. Leer `02_PRACTICAS_Y_EXAMEN.md`.
4. Leer `03_CONTINUIDAD_ENTRE_CHATS.md`.
5. Leer `04_RUNBOOK_RELEASE_R01.md`.
6. Leer ESTE aprendizaje completo.
7. Leer `CONTROL/FORMACION_AGENTES.csv/json`.
8. Releer issue #345 de Formación.
9. Releer issue #333 si sigue activo.
10. Leer HEAD real de PR #244; NO reutilizar 8ea50128 sin comprobar.
11. Leer HEAD real de PR #341 si sigue abierto; NO reutilizar 6f6392f sin comprobar.
12. Leer metadata Netlify del deploy que se vaya a revisar; NO asumir que 6abc96 sigue siendo el candidato.
13. Revisar si ha aparecido nueva orden de Aura/Astra/María.
14. Ejecutar RESUME GATE antes de escribir.
15. Solo después integrar.

---

## Regla final

Si este chat desaparece, **el conocimiento válido no debe desaparecer con él**.

Todo aprendizaje material de Vector debe acabar en:
- Formación;
- Aprendizaje fechado;
- Runbook/checklist/test cuando proceda;
- Control central.

Nunca volver a depender de “me acuerdo de cómo lo hicimos”.
