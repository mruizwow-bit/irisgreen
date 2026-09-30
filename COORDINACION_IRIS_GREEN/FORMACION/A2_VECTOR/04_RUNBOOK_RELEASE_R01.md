# VECTOR · RUNBOOK DE RELEASE E INTEGRACIÓN WEB R01

Estado:
`A2_VECTOR_RUNBOOK_R01_ACTIVE_FOR_TRAINING`

Fecha:
30/09/2026

Autoridad organizativa:
María → Aura → Vector/A2 según orden vigente.

Este runbook NO autoriza producción por sí mismo.

## 0. Regla principal

**Leer estado vivo antes de actuar.**

No integrar desde:
- memoria del chat;
- un comentario antiguo;
- nombre de rama;
- ZIP sin identidad;
- “PASS” de otro agente;
- SHA escrito en un documento sin revalidación.

## 1. Contrato mínimo de handoff

Un handoff integrable debe identificar, cuando aplique:
- repo;
- rama;
- base SHA;
- HEAD SHA;
- tree;
- archivos modificados;
- propósito;
- ownership;
- tests;
- artefactos;
- dependencias;
- límites;
- QA pendiente.

Si falta algo:
A2 primero recupera la identidad real del repositorio.

## 2. RESUME GATE

Al empezar una sesión:
1. leer Formación Vector;
2. leer último APRENDIZAJE_VECTOR;
3. leer Control;
4. leer órdenes vivas;
5. obtener A2 HEAD/tree;
6. obtener PR status;
7. obtener Netlify deploy relevante;
8. comparar con snapshot del aprendizaje;
9. declarar cualquier divergencia;
10. solo entonces escribir.

## 3. Reconciliación

Para entrega con base B, handoff H y A2 actual A:

- calcular/confirmar merge-base;
- analizar B→H;
- analizar B→A;
- listar intersección de rutas;
- revisar conflictos funcionales aunque Git no marque conflictos.

Clasificación:
- **KEEP**: A2 ya posee versión correcta/no debe tocarse.
- **PORT**: delta del handoff sigue siendo válido y puede aplicarse.
- **CONFLICT**: ambas ramas modifican el mismo contrato/propiedad.
- **SUPERSEDED**: A2 contiene evolución posterior y el handoff antiguo no debe restaurarse.

## 4. Integración

Preferencia:
- delta pequeño;
- commit acotado;
- patch/cherry-pick solo cuando la procedencia lo justifique;
- resolución consciente;
- preservar ownership.

Prohibido:
- copiar branch entera “encima”;
- reset a main para simplificar;
- sustituir una carpeta nueva por una histórica;
- reescribir módulo de otro agente para “hacerlo encajar” sin orden.

## 5. Build

Iris Green:
`python3 scripts/build_site.py`

Artefacto:
`dist/`

A2 debe comprobar:
- build exit 0;
- source real no mutado cuando el contrato lo exige;
- dirs de trabajo fuera de dist;
- rutas/roots previstos;
- archivos críticos;
- scripts postbuild;
- orden de transformaciones;
- variables de entorno que alteran salida.

Regla:
**source correcto no equivale a artefacto correcto**.

## 6. Reproducibilidad

Para candidato sensible:
- limpiar entorno;
- fijar runtime/tooling;
- build;
- inventariar;
- hash;
- repetir cuando proceda;
- explicar diferencias.

Evitar tooling crítico con `@latest`.

Si existe input remoto:
- manifest;
- versión;
- hash;
- fallback;
- declarar si rompe reproducibilidad.

## 7. QA antes de deploy

Orden recomendado:
1. sintaxis;
2. unit;
3. integración;
4. build;
5. static gates sobre dist;
6. browser gates sobre dist;
7. negative tests;
8. regresión transversal.

Para Iris Green según alcance:
- ES/EN;
- 1440/390/320;
- teclado/foco;
- reduced motion;
- LIGHT/DARK NAVY;
- AGE_*;
- child-safe payload;
- no headers/footers duplicados;
- assets;
- CSP;
- errores de consola;
- navegación;
- Sabik/Taller/Rincón cuando sean afectados.

## 8. Deploy Preview

Objetivo:
que María/Astra prueben el candidato sin tocar producción.

Registrar:
- site ID;
- deploy ID;
- context;
- source SHA;
- review/PR;
- branch;
- permalink;
- alias;
- published_at;
- funciones/edge inesperadas;
- error_message.

PASS técnico mínimo:
- state READY;
- context esperado;
- no producción;
- identidad coherente;
- smoke OK.

Recordatorio:
READY ≠ QA.
Alias mutable ≠ evidencia inmutable.

## 9. Formato de handoff de preview

```
A2_RELEASE_CANDIDATE
repo:
branch:
source_sha:
source_tree:
base_sha:
merge_base:
build_run:
artifact:
artifact_sha256:
netlify_site:
deploy_id:
deploy_context:
deploy_permalink:
deploy_alias:
tests_pass:
tests_pending:
human_qa:
production_authorized:
rollback_candidate:
```

## 10. HUMAN QA

Cuando la orden exija HUMAN QA:
- entregar permalink exacto;
- explicar qué debe probarse;
- no cambiar el candidato silenciosamente;
- si cambia SHA/deploy, avisar y reiniciar el gate correspondiente.

No usar una URL mutable para hacer creer que la misma revisión sigue activa.

## 11. Producción

Producción es una operación separada.

Precondiciones:
- autorización explícita;
- candidato aprobado;
- HEAD/artefacto identificados;
- gates requeridos;
- rollback;
- secrets/context;
- no deploy concurrente;
- diferencia preview→prod comprendida.

Durante:
- no usar producción como prueba;
- registrar deploy;
- verificar final.

Después:
- smoke producción;
- CSP/headers/rutas críticas;
- estado locked si la política lo requiere;
- evidencia;
- rollback disponible.

## 12. Rollback

Antes del release:
- último deploy sano;
- ID/permalink;
- fecha;
- alcance.

Ante incidente:
1. STOP promociones;
2. preservar evidencia;
3. evaluar rollback vs fix-forward;
4. rollback si reduce riesgo;
5. verificar;
6. documentar;
7. crear gate que evite recurrencia.

## 13. Netlify · reglas

Distinguir siempre:
- production;
- deploy-preview;
- branch-deploy;
- preview-server;
- dev.

`netlify deploy` = draft por defecto.
`netlify deploy --prod` = producción.

No ejecutar `--prod` para obtener una URL cómoda de QA.

## 14. GitHub Actions · reglas

- permissions mínimos;
- actions por SHA inmutable cuando proceda;
- secrets no disponibles a código no fiable;
- environment para producción cuando se implante;
- concurrency para release;
- artifact digest/provenance;
- no modificar test para conseguir verde sin reconciliar contrato.

## 15. Carriles separados

### Iris Green web
Repo:
`mruizwow-bit/irisgreen`

Artefacto:
`dist/`

### Sabik Cloud
Proyecto Netlify separado.
No asumir que una actualización de web despliega Cloud.

Si cambia origen Cloud revisar:
- mount-config;
- authorized transport;
- CSP;
- allowlist/origen;
- QA real;
- fallbacks.

### NEA
Repo:
`mruizwow-bit/nea-web-irisgreen`

Su `dist/nea-web-v1` es handoff de integración, no publicación Iris automática.

Antes de montar:
- ruta;
- shell;
- CSP;
- no-JS;
- a11y;
- ES/EN según alcance.

## 16. Señales de peligro

STOP si aparece:
- base desconocida;
- branch cientos de commits por detrás sin delta claro;
- PR body y HEAD difieren y nadie lo ha revalidado;
- test live apunta a preview fija de otro PR;
- deploy dice production cuando buscábamos preview;
- source SHA no coincide con deploy esperado;
- Functions/Edge aparecen inesperadamente;
- build local y Netlify divergen;
- `@latest` introduce cambio no controlado;
- un fix restaura UI vieja;
- component PASS pero browser integrado falla;
- child-safe depende solo de hidden/inert/CSS;
- “READY” usado como prueba de producto.

## 17. Evidencia mínima

Cada integración material debe dejar:
- base;
- HEAD;
- tree;
- diff/archivos;
- decisión de conflictos;
- build;
- tests;
- artifact/deploy identity;
- pendientes;
- aprobación humana cuando aplique.

## 18. Aprendizaje continuo

Un error costoso se transforma en al menos una de estas piezas:
- test;
- gate;
- checklist;
- regla de runbook;
- APRENDIZAJE;
- práctica de formación.

No repetir errores como conocimiento tácito.

## 19. No negociables de Vector

1. Read live state first.
2. Never integrate from memory.
3. Know the base.
4. Integrate the delta, not the history.
5. Build the final composition.
6. Test what you deploy.
7. Deploy what you tested.
8. Identify every artifact.
9. Preview is not production.
10. READY is not accepted.
11. Human QA is a real gate.
12. Rollback is planned before release.
13. Security belongs inside the pipeline.
14. Small traceable changes beat giant merges.
15. Evidence must identify exact SHA + artifact/deploy.
