# S0 · cierre QA sobre `3ce023bf`

**Implementación:** `3ce023bf132ae728fce8e402e30eba0fb796edc8`  
**Árbol implementación:** `4b485f8d5aab54cfc3b4fc86c35ea705e64ebe5a`  
**Padre:** `81b44a5b8bfdcb3f662b8d7de3385cbce8090f63`  
**Contrato normativo:** `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`  
**PR implementación:** #161  
**PR QA/evidencia:** #164  
**Veredicto:** `ACEPTADO_S0`

## 1. Procedencia y método

Esta revisión separa expresamente:

1. **Agente n.º 1 QA:** verificación de integridad del paquete y repetición local de cinco pruebas pequeñas.
2. **Claude:** ejecución Linux completa sobre clon y worktrees completos, incluida V7 y `build_site.py`.
3. **Astra:** comprobación previa de apoyo sobre integridad y reproducibilidad.
4. **Hallazgo no bloqueante:** precisión contractual de `speech_meta.end_reason`.

No se modificó runtime, contrato, matriz, recorridos, runners, corpus, PR #162 ni PR #163 durante esta tarea.

## 2. Estado remoto confirmado

PR #161:

```text
open
draft
head = 3ce023bf132ae728fce8e402e30eba0fb796edc8
base = sabik-preview
```

PR #164:

```text
open
draft
head posterior por evidencia
contrato normativo vigente = 1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b
```

El head de #164 no sustituye al SHA contractual.

## 3. Integridad del paquete

Paquete utilizado:

```text
EVIDENCIA_QA_S0_3CE023BF.zip
SHA-256 = 519fef1bc52c4d26aa2008b3367202b6db765286bb1c2c630899fa8b93fcd922
```

QA verificó:

```text
extracción segura                               PASS
rutas fuera del destino                         0
symlinks                                        0
archivos reales                                 183
archivos inventariados + manifest/resumen       183 exactos
inputs                                          11/11 PASS
registros                                       54/54 PASS
stdout/stderr                                   hashes y tamaños PASS
dist-inventory.csv                              hash PASS
secretos de formatos críticos                   0 hallazgos
```

Los inputs procedentes de Git conservan tamaño, SHA-256 y `git hash-object --no-filters` declarados. La sonda auxiliar no procede de Git; su propio hash Git auxiliar y SHA-256 también coinciden con el manifiesto.

Los worktrees Linux documentados por Claude registran:

```text
implementación HEAD = 3ce023bf132ae728fce8e402e30eba0fb796edc8
implementación tree = 4b485f8d5aab54cfc3b4fc86c35ea705e64ebe5a
contrato HEAD       = 1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b
contrato tree       = 8baf547e03581108d7d611efc8cabe07cbca472c
```

Ambos worktrees estaban limpios al inicio y al final.

## 4. Repetición QA pequeña

Entorno QA de repetición:

```text
Linux 6.18.44 x86_64 GNU/Linux
Node v22.16.0
Python 3.13.5
git 2.47.3
```

Comandos ejecutados desde el paquete:

```bash
(cd inputs/impl && node tools/test-sabik-machine-s0.js)
(cd inputs/qa && node tests/specs/sabik/validate-s0-contract-consistency.mjs)
(cd inputs/qa && node tests/specs/sabik/run-s0-contract.mjs \
  --module ../impl/sabik/nea-core/sabik-machine.js)
(cd inputs/qa && node tests/specs/sabik/run-s0-addendum-b06-b07.mjs \
  --module ../impl/sabik/nea-core/sabik-machine.js)
(cd inputs/sonda && node sonda-arrays.mjs)
```

Resultados frescos de QA:

```text
suite propia S0        117/117 PASS · exit 0
consistencia contrato  PASS · 84 filas / 32 recorridos · exit 0
runner canónico        ACEPTA_PUERTA_AUTOMATICA_S0 · exit 0
subconjunto B06/B07    ACEPTA_SUBCONJUNTO_B06_B07 · exit 0
sonda arrays           SONDA_ARRAYS_PASS · 10/10 · exit 0
```

Los cinco `stdout`/`stderr` coinciden byte a byte con los registros válidos de Claude.

La aceptación del runner canónico implica:

```text
84/84 filas ejecutadas
32/32 recorridos ejecutados
3/3 entradas inválidas definidas por el runner ejecutadas
20 casos de corpus validados estructuralmente
```

Los 20 casos del corpus no equivalen a 20 conversaciones ejecutadas contra una interfaz integrada.

El subconjunto B06/B07 forma parte de la misma matriz y no suma cobertura adicional.

## 5. Cierre del bloqueo anterior · arrays

### `motion_meta: []`

```text
contrato            RECHAZA
runtime             RECHAZA
transición BOOT_OK  RECHAZA explícitamente
estado de entrada   no mutado
evento              no mutado
revision            no incrementa
```

### `error_meta: []`

```text
contrato            RECHAZA
runtime             RECHAZA
transición BOOT_OK  RECHAZA explícitamente
estado de entrada   no mutado
evento              no mutado
revision            no incrementa
```

La sonda también confirma aceptación de las variantes válidas:

```text
motion_meta ausente
motion_meta = {}
motion_meta = {reduced:false}
motion_meta = {reduced:true}

error_meta ausente
error_meta = {}
error_meta parcial válido
error_meta completo válido
```

**Bloqueo de arrays: CERRADO.**

## 6. B14, B15 y metadatos parciales

Quedan en PASS normativo:

- B14: filas contractuales de `error_meta` incluidas en el runner completo.
- B15: `EV-SPEECH-REQUEST-META-OMITTED-OFF`.
- `EV-SPEECH-REQUEST-PARTIAL-META`.
- recorrido `S0-C29`.
- arranque, pausa, retry, seguridad, voz y movimiento reducido.
- rechazo explícito de eventos inválidos.
- pureza estática y dinámica, determinismo, inmutabilidad y serialización cubiertos por la puerta congelada.

## 7. `speech_meta.end_reason`

Se conserva como:

```text
HALLAZGO_NO_BLOQUEANTE_DE_PRECISION_CONTRACTUAL
```

La implementación acepta `speech_meta.end_reason = "inventado"` y el validador contractual vigente también lo acepta. El contrato `1c3205fb…` no define una enumeración cerrada para este campo.

Por tanto:

- no es un incumplimiento del contrato vigente;
- no afecta la frontera contractual acordada ni la seguridad;
- no impide la aceptación técnica de S0;
- no se modifica el contrato en esta tarea.

## 8. V7 y build Linux

Evidencia atribuida a Claude y verificada por QA mediante logs, hashes, manifiesto e inventario:

```text
Entorno: Ubuntu 24.04.4 LTS
Linux:   6.18.44-fc-v33 x86_64
Node:    v22.22.2
Python:  3.12.3
git:     2.43.0
```

V7:

```text
28/28 PASS
exit 0
```

Build:

```text
python3 scripts/build_site.py
exit 0
Directorio público: 1649 archivos; fuentes e informes permanecen fuera de dist.
```

Los worktrees permanecieron limpios al terminar.

## 9. `dist` y puerta interna de tamaño

Inventario verificado:

```text
archivos                       1649
bytes totales                  447074983
archivos >= 49.000.000 bytes   0
dist/docs                      ausente
dist/tests                     ausente
artefactos de esta ejecución   ausentes
```

Avisos no bloqueantes:

```text
11061912 bytes · audio/meditacion-larga.mp3
10795463 bytes · audio/rincon/lluvia-en-tienda.mp3
```

Los seis `.b64` registrados ya existen en la base `efa4ed9…` y no son artefactos introducidos por esta revisión.

## 10. Alcance

Delta `81b44a5b… → 3ce023bf…`:

```text
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

PR #161 acumulado respecto a `sabik-preview`:

```text
sabik/AGENTS.md
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

No aparecen panel, HTML, CSS, datasets, índice, assets, `.github`, `main`, producción ni `dist` versionado.

**Alcance: PASS.**

## 11. Veredicto

```text
ACEPTADO_S0
```

Se cumplen simultáneamente todos los requisitos bloqueantes de la puerta S0 consolidada contra `1c3205fb…`:

- integridad de evidencia;
- 117/117;
- contrato coherente;
- 84/84 filas;
- 32/32 recorridos;
- 3/3 entradas inválidas;
- B06/B07;
- arrays 10/10;
- V7 28/28;
- build Linux exit 0;
- `dist` sin archivos individuales >=49 MB;
- alcance correcto;
- pureza, determinismo, inmutabilidad, serialización y seguridad contractuales.

El hallazgo de `end_reason` es no bloqueante y no cambia este veredicto.

## 12. Puertas posteriores

`ACEPTADO_S0` **no abre S1 automáticamente**.

S1 permanece cerrado hasta que coordinación confirme las condiciones independientes pendientes, incluida la revisión semántica final de Claude. S2 permanece cerrado y sigue sujeto además a Design.

No se fusiona nada, no se toca `main`, no se retira `noindex` y no se realiza deploy dentro de esta tarea.
