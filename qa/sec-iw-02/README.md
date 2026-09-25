# SEC-IW-02 · Actions supply-chain QA freeze

Estado contractual: `SEC_IW_02_ACTIONS_QA_FREEZE_READY` solo cuando el baseline exacto reproduce el hallazgo de seguridad y la rama contiene únicamente archivos QA.

## Autoridad

- DEC-050 / DEC-038 / DEC-033 / DEC-031.
- Baseline: `main@e48b51814afed825a92e83a2f6e51ee8a1c85e45`.
- Auditoría: `IRIS_WEB_SECURITY_COPY_R01_AUDIT_READY`.
- Scope: solo tres workflows productivos, sin modificarlos durante este freeze.

## Workflows congelados

1. `.github/workflows/diagnostico-build-investigacion.yml`
2. `.github/workflows/publicar-investigacion-120.yml`
3. `.github/workflows/rutinas-visuales.yml`

El baseline debe reproducir exactamente tres referencias `actions/checkout@v4`. Diagnóstico ya tiene `contents: read`; publicación tiene `contents: write` y el paso controlado `git add/commit/push`; Rutinas no tiene `permissions:` explícito.

## Futuro candidato

El mismo runner se reejecuta con `--phase candidate`. El candidato debe:

- cambiar exactamente esos tres workflows y ningún otro archivo;
- usar `actions/checkout@11d5960a326750d5838078e36cf38b85af677262` en los tres;
- declarar permisos explícitos:
  - diagnóstico: `contents: read`;
  - publicación: `contents: write`;
  - rutinas: `contents: read`;
- preservar semánticamente, tras normalizar únicamente checkout ref y permisos top-level, triggers, jobs, nombres de pasos, scripts y resto del YAML;
- conservar el único write remoto intencionado de publicación;
- introducir 0 familias de Actions nuevas;
- pasar parse YAML y `git diff --check`.

## Casos S01–S18

El contrato exacto es `qa/sec-iw-02/actions-contract-v1.json`. Congela inventario baseline, pinning, permisos, escritura, triggers, semántica, parse, scope, rollback y prohibición de merge/deploy.

En baseline, S06, S07 y S11 deben quedar rojos de forma esperada: son precisamente las condiciones que el futuro candidato debe corregir. El workflow del freeze solo queda verde si reproduce exactamente ese rojo y no existe drift.

## Static lint

El runner realiza parse YAML y comparación estructural estricta. El workflow ejecuta `actionlint` solo si está preinstalado en el runner; su ausencia se registra y no se convierte en fallo porque R18 lo exige únicamente “si disponible”.

## Rollback

Los blobs exactos baseline de los tres workflows están fijados en el contrato. Restaurar esos blobs desde `main@e48b518...` revierte íntegramente el futuro hardening.

## Límites

Este freeze no cambia workflows productivos, settings del repositorio, rulesets, cuentas, Netlify ni producción. No es una auditoría general de GitHub Actions: solo congela SEC-IW-02.
