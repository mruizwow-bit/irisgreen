# S0 · revalidación QA final de PR #161 sobre `4893d3cf`

**Implementación:** `4893d3cf9772e58bdc1b5f505d33965cbfea007a`  
**Padre:** `3ce023bf132ae728fce8e402e30eba0fb796edc8`  
**Contrato normativo:** `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`  
**PR implementación:** #161  
**PR semántica:** #162  
**PR QA:** #164  
**Veredicto final:** `ACEPTADO_S0`

## 1. Estado remoto y semántica

PR #161 permanece `open` / `draft` y apunta exactamente a `4893d3cf9772e58bdc1b5f505d33965cbfea007a`.

PR #162 permanece `open` / `draft`, con head `c8d754270358d90c2f4eb3ad4b736d1dda3e61b0`, y publica `SEMANTICA_S0_APROBADA` sobre `4893d3cf...` en `docs/sabik/reviews/10-revalidacion-semantica-s0-4893d3cf.md`.

PR #164 permanece `open` / `draft`. El SHA contractual normativo sigue siendo `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`; los commits posteriores de #164 son evidencia, no una nueva definición contractual.

## 2. Alcance

El commit `4893d3cf...` tiene como padre exacto `3ce023bf...` y cambia únicamente:

```text
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

El diff acumulado de PR #161 sigue limitado a:

```text
sabik/AGENTS.md
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

**Alcance: PASS.**

## 3. Puertas QA cerradas sobre `4893d3cf`

```text
suite propia S0        146/146 PASS
consistencia contrato  PASS
runner canónico        84/84 filas + 32/32 recorridos + 3/3 inválidos PASS
runner                  ACEPTA_PUERTA_AUTOMATICA_S0
B06/B07                 ACEPTA_SUBCONJUNTO_B06_B07
arrays                  10/10 PASS
SB1_SB2_QA              PASS
alcance                 PASS
semántica Claude        SEMANTICA_S0_APROBADA
```

QA reprodujo independientemente SB-1A/B/C y SB-2. `BOOT_OK` conserva su papel como única puerta de bootstrap; rechazos de bootstrap no mutan estado/evento ni incrementan `revision`; y `uncertain + SPEECH_ERROR` conserva `uncertain / clarification`, energía 0 y `protection_static`.

## 4. Hallazgos no bloqueantes

| Hallazgo | Reproducible | Bloqueante S0 | Clasificación |
|---|---|---|---|
| N-1 · `RISK_CLEARED` con reduced motion produce `processing` | Sí | No | precisión/cobertura contractual |
| N-2 · `speech_meta.end_reason` no tiene enumeración cerrada | Sí | No | precisión contractual |
| N-7 · `SET_REDUCED_MOTION{enabled:false}` durante `booting` produce `ambient` | Sí | No | precisión/cobertura contractual |
| N-8 · estado `error` externo sin `origin_operation` + `RETRY -> ready` | Sí | No | precisión de frontera externa; no generado por flujo válido |

Ninguno demuestra una violación normativa bloqueante bajo `1c3205fb...`. No se modifica el contrato en esta tarea.

## 5. EVIDENCIA LINUX FRESCA RECIBIDA

Paquete verificado:

```text
EVIDENCIA_LINUX_S0_4893D3CF.zip
SHA-256: 728dc5055c550e15bbdb96240e1af7649d45bf0896d658c1597e4d88642487a5
```

QA verificó directamente:

- SHA-256 del ZIP interior: coincide exactamente;
- `SHA256SUMS.txt`: **14/14 entradas OK**;
- ausencia de discrepancias materiales entre logs, resumen e inventario;
- inventario `dist` recalculado de forma independiente desde `03-dist-inventario.csv`.

### Procedencia del checkout Linux

```text
Ubuntu 24.04.4 LTS
Linux 6.18.44 x86_64
git 2.43.0
Node v22.22.2
Python 3.12.3
HEAD  4893d3cf9772e58bdc1b5f505d33965cbfea007a
tree  92f055753899bc2f19a28773563b732bafb6d6bb
parent 3ce023bf132ae728fce8e402e30eba0fb796edc8
```

El paquete documenta clon completo sin promisor, worktree nuevo detach y `git fsck --connectivity-only` OK. No se usó el directorio de Codex ni una copia de auditoría.

### V7 fresco

```bash
node tools/test-sabik-page-v7.js
```

Resultado verificado:

```text
28/28 validations passed
exit 0
stderr vacío
```

**V7: PASS.**

### Build Linux fresco

```bash
python3 scripts/build_site.py
```

Resultado verificado:

```text
exit 0
Directorio público: 1649 archivos; fuentes e informes permanecen fuera de dist.
stderr vacío
```

**Build Linux: PASS.**

### `dist` · recálculo independiente QA

Desde `03-dist-inventario.csv`:

```text
archivos                  1649
bytes totales             447075800
archivos >=49.000.000     0
archivos >10.000.000      2
dist/docs                 ausente
dist/tests                ausente
```

Avisos no bloqueantes:

```text
audio/meditacion-larga.mp3          11061912 bytes
audio/rincon/lluvia-en-tienda.mp3   10795463 bytes
```

### Integridad Git

Antes y después de V7/build:

```text
HEAD = 4893d3cf9772e58bdc1b5f505d33965cbfea007a
tree = 92f055753899bc2f19a28773563b732bafb6d6bb
git status --short = vacío
git diff --quiet HEAD = sin diferencias
git ls-files -m = vacío
```

Tras el build solo existen artefactos ignorados esperados (`dist/` y `scripts/__pycache__/`). `dist/` no está versionado. Código y tests permanecen sin cambios.

**Integridad: PASS.**

## 6. Resumen final

```text
suite propia                 146/146 PASS
V7                           28/28 PASS
consistencia contractual     PASS
contrato                     84/84 + 32/32 + 3/3 PASS
B06/B07                      PASS
arrays                       10/10 PASS
SB1_SB2_QA                   PASS
N-1                          NO BLOQUEANTE
N-2                          NO BLOQUEANTE
N-7                          NO BLOQUEANTE
N-8                          NO BLOQUEANTE
build Linux                  exit 0
dist                         1649 archivos / 447075800 bytes
archivos >=49 MB             0
dist/docs                    ausente
dist/tests                   ausente
alcance                      PASS
semántica Claude             SEMANTICA_S0_APROBADA
```

## 7. Veredicto final

```text
ACEPTADO_S0
```

La evidencia Linux fresca elimina el único bloqueo pendiente de la revalidación anterior. No queda ningún incumplimiento normativo reproducible que impida cerrar S0 bajo el contrato `1c3205fb...`.

N-1/N-2/N-7/N-8 permanecen documentados como precisiones no bloqueantes y no cambian el veredicto.

`ACEPTADO_S0` no abre S1 automáticamente. S1 permanece cerrado hasta una orden formal separada de Astra. S2 permanece cerrado. No se modifica PR #162, PR #163, runtime, contrato, `sabik-preview`, `main`, producción ni `noindex`; no hay merge ni deploy.
