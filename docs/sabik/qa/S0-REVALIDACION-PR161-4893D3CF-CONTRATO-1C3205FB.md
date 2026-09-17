# S0 · revalidación QA final de PR #161 sobre `4893d3cf`

**Implementación:** `4893d3cf9772e58bdc1b5f505d33965cbfea007a`  
**Padre:** `3ce023bf132ae728fce8e402e30eba0fb796edc8`  
**Contrato normativo:** `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`  
**PR implementación:** #161  
**PR semántica:** #162  
**PR QA:** #164  
**Veredicto:** `BLOQUEADO_S0`

## 1. Estado remoto y semántica

PR #161 está `open` / `draft` y su `head` es exactamente `4893d3cf9772e58bdc1b5f505d33965cbfea007a`.

PR #162 está `open` / `draft`, con head `c8d754270358d90c2f4eb3ad4b736d1dda3e61b0`, y publica `SEMANTICA_S0_APROBADA` sobre `4893d3cf...` en `docs/sabik/reviews/10-revalidacion-semantica-s0-4893d3cf.md`.

PR #164 permanece `open` / `draft`. El SHA contractual normativo sigue siendo `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`; los commits posteriores de #164 son evidencia, no una nueva definición contractual.

## 2. Entorno QA y método

Entorno de ejecución disponible:

```text
Linux 6.18.44 x86_64 GNU/Linux
git 2.47.3
Node v22.16.0
Python 3.13.5
```

El terminal no dispone de resolución DNS hacia `github.com` y no existe un checkout Git completo de `4893d3cf...` montado. Por tanto no fue posible crear el worktree completo solicitado.

Para la máquina pura se reconstruyó una copia verificable sin usar el directorio de Codex:

1. se partió de los inputs previamente verificados del paquete QA de `3ce023bf...`;
2. se aplicó únicamente el delta publicado `3ce023bf... -> 4893d3cf...`;
3. se comprobaron los blobs finales contra GitHub.

Blobs resultantes:

```text
sabik/nea-core/sabik-machine.js  b4e048c2e496ebe51e4daa6ffad3b9ad31f1fbc5
tools/test-sabik-machine-s0.js   760b46c90ba7d9f7c198e4ab33e983e81f75cb71
```

Estos hashes coinciden con los blobs del commit `4893d3cf...`.

Los archivos QA usados proceden del contrato congelado `1c3205fb...` y no fueron modificados.

## 3. Alcance

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

## 4. Suite propia S0

Comando ejecutado sobre los blobs exactos reconstruidos:

```bash
node tools/test-sabik-machine-s0.js
```

Resultado:

```text
146/146 validations passed
exit 0
```

**PASS.**

## 5. Contrato normativo

### Consistencia

```bash
node tests/specs/sabik/validate-s0-contract-consistency.mjs
```

Resultado:

```text
PASS
0 contradicciones
0 estados iniciales imposibles
0 referencias rotas
84 filas contractuales / 32 recorridos canónicos
exit 0
```

### Runner principal

```bash
node tests/specs/sabik/run-s0-contract.mjs --module <impl>/sabik/nea-core/sabik-machine.js
```

Resultado:

```text
QA contrato consolidado OK: 84 filas, 32 recorridos, 20 casos conversacionales.
ACEPTA_PUERTA_AUTOMATICA_S0
exit 0
```

Cobertura normativa:

```text
84/84 filas PASS
32/32 recorridos PASS
3/3 entradas inválidas PASS
```

Los 20 casos del corpus son validación estructural del corpus, no 20 conversaciones ejecutadas contra la interfaz integrada.

### B06/B07

```bash
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs --module <impl>/sabik/nea-core/sabik-machine.js
```

Resultado:

```text
QA subconjunto B06/B07 OK: 28 filas, 12 recorridos; 0 expectativas independientes.
ACEPTA_SUBCONJUNTO_B06_B07
exit 0
```

**PASS.**

## 6. Regresión de arrays

La sonda de arrays volvió a ejecutarse contra `4893d3cf...`.

Resultado:

```text
SONDA_ARRAYS_PASS
10/10 PASS
exit 0
```

Confirmado:

- `motion_meta: []` rechazado;
- `error_meta: []` rechazado;
- rechazo sin mutación de estado/evento y sin incremento de `revision`;
- metadatos ausentes, `{}`, parciales válidos y completos válidos continúan aceptándose.

**PASS.**

## 7. SB-1 / SB-2 · reproducción independiente QA

Se ejecutó una sonda QA separada sobre los blobs exactos de `4893d3cf...`.

Marcador final:

```text
SB1_SB2_QA_PASS
exit 0
```

### SB-1A

`booting -> TECHNICAL_ERROR -> RESET_SESSION`

- `RESET_SESSION` rechazado;
- no se alcanza `ready`;
- estado/evento no mutados por el rechazo;
- `revision` no incrementa.

### SB-1B

`booting -> TECHNICAL_ERROR -> TECHNICAL_ERROR -> RETRY`

- `origin_operation` permanece `booting`;
- `RETRY -> booting`;
- `SUBMIT` rechazado hasta `BOOT_OK`;
- `BOOT_OK` vuelve a ser la única puerta hacia flujo ordinario.

### SB-1C

Desde `booting` y desde error de arranque se rechazaron:

```text
RISK_UNCERTAIN
RISK_CONFIRMED
HUMAN_HANDOFF
RISK_CLEARED
```

Todos los rechazos preservan estado, evento y `revision`.

### SB-2

`uncertain + SPEECH_ERROR` produce estado válido con:

```text
safety=uncertain
dialogue=clarification
speech=error
energy=0
motion=protection_static
error_meta.layer=speech
```

Controles:

- `normal -> motion=off`;
- `risk -> protection_static`;
- `human_handoff -> protection_static`.

**SB-1/SB-2: PASS.**

## 8. Hallazgos N-1 / N-2 / N-7 / N-8

| Hallazgo | Reproducible | Cubierto como prohibición por contrato vigente | Alcanzable desde flujo válido | Bloqueante S0 | Clasificación |
|---|---|---|---|---|---|
| N-1 · `RISK_CLEARED` con `motion_meta.reduced=true` termina `motion=processing` | Sí | No existe fila específica que lo prohíba; el validador acepta el estado | Sí | No | precisión/cobertura contractual |
| N-2 · `speech_meta.end_reason` admite valores no catalogados | Sí | No; el contrato no define enumeración cerrada | Sí como estado inyectado/metadata preservada | No | precisión contractual |
| N-7 · `SET_REDUCED_MOTION{enabled:false}` durante `booting` produce `motion=ambient` | Sí | No existe fila que lo prohíba; `SET_REDUCED_MOTION` es activación explícita | Sí | No | precisión/cobertura contractual |
| N-8 · estado `error` externo sin `origin_operation` + `RETRY -> ready` | Sí | El validador actual admite esa forma | No generado por recorridos válidos de la máquina | No | precisión de frontera para estados externos |

Ninguno de los cuatro demuestra una violación de una regla normativa vigente y alcanzable que permita reabrir S0 por defecto. Se documentan sin modificar el contrato congelado.

## 9. V7

La orden exige una ejecución fresca sobre `4893d3cf...`:

```bash
node tools/test-sabik-page-v7.js
```

**Resultado QA de esta revalidación: `NO_EJECUTADO`.**

Motivo: V7 requiere el checkout completo (`es/nea/index.html`, `sabik/sabik-page.js`, `sabik/sabik-page.css`, core y datasets). El entorno QA no dispone de un checkout completo de `4893d3cf...`, no puede clonarlo por DNS y no existe workflow/status GitHub para este SHA. La evidencia 28/28 de `3ce023bf...` no se hereda ni se atribuye a `4893d3cf...`.

Esto no demuestra un defecto de código; es evidencia bloqueante ausente para la puerta solicitada.

## 10. Build Linux y `dist`

La orden exige:

```bash
python3 scripts/build_site.py
```

sobre checkout completo limpio de `4893d3cf...`.

**Build: `NO_EJECUTADO`.**  
**Dist fresco de `4893d3cf...`: `NO_EJECUTADO`.**

Motivo: el build necesita el árbol completo y múltiples scripts/datos. El snapshot parcial disponible no contiene esos insumos y GitHub no publica un workflow/check de build para el SHA.

Por tanto no se puede afirmar en esta revisión:

- `exit 0` del build sobre `4893d3cf...`;
- número/bytes del `dist` fresco;
- archivos >=49.000.000 bytes para ese artefacto;
- exclusión real de `dist/docs` y `dist/tests` en el artefacto generado por este SHA.

Los resultados del build de `3ce023bf...` son históricos y no se heredan.

## 11. Resumen de puerta

```text
suite propia                 146/146 PASS
V7                           NO_EJECUTADO
consistencia contractual     PASS
contrato                     84/84 + 32/32 + 3/3 PASS
B06/B07                      PASS
arrays                       10/10 PASS
SB1_SB2_QA                   PASS
N-1                          NO BLOQUEANTE
N-2                          NO BLOQUEANTE
N-7                          NO BLOQUEANTE
N-8                          NO BLOQUEANTE
build Linux                  NO_EJECUTADO
dist fresco                  NO_EJECUTADO
alcance                      PASS
semántica Claude             SEMANTICA_S0_APROBADA
```

## 12. Veredicto

```text
BLOQUEADO_S0
```

El bloqueo global responde **exclusivamente a la ausencia de V7 y build/dist frescos sobre el SHA `4893d3cf...`**, requisitos bloqueantes explícitos de esta puerta. No se atribuye un fallo de runtime a pruebas que no se ejecutaron.

La máquina pura y la puerta contractual automática están en verde; la revisión semántica de Claude también está aprobada.

S1 permanece cerrado hasta completar esta puerta y hasta decisión formal de Astra. No se modifica PR #162, PR #163, runtime, contrato, `sabik-preview`, `main`, producción ni `noindex`; no hay merge ni deploy.
