# S0 · sexta revalidación técnica de PR #161

**Implementación:** `5b0220612404d400cbf9de35240a3dacf98868a5`  
**Contrato normativo:** `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`  
**PR implementación:** #161  
**PR QA/evidencia:** #164  
**Veredicto:** `BLOQUEADO_S0`

## 1. Método y procedencia

Esta revisión integra tres capas de evidencia sin confundir su procedencia:

### A. Claude · ejecución Linux completa

> Ejecutado por Claude en clon completo Linux sobre el SHA indicado; registros y hashes verificados por QA.

Paquete recibido y verificado:

```text
EVIDENCIA_QA_S0_5B022061.zip
bytes:   122177
SHA-256: 90c99e9976476702ee262f360171bc44a88e1589d4448b5b23a7caa786b0425b
```

Entorno documentado por Claude:

```text
Linux 6.18.44-fc-v33 x86_64
Ubuntu 24.04.4 LTS
git 2.43.0
Node v22.22.2
Python 3.12.3
```

Los worktrees Linux de Claude registran:

```text
implementación HEAD = 5b0220612404d400cbf9de35240a3dacf98868a5
implementación tree = 7fa9bb4da8e706ddece10c252c79a63c05179ccf
contrato HEAD       = 1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b
contrato tree       = 8baf547e03581108d7d611efc8cabe07cbca472c
```

Los dos árboles estaban limpios al inicio y permanecían limpios al final. `git fsck --connectivity-only` terminó con código 0 según el paquete.

### B. Agente n.º 1 QA · integridad y repetición pequeña

Entorno de la repetición independiente del Agente n.º 1:

```text
Linux 6.18.44 x86_64 GNU/Linux
Node v22.16.0
Python 3.13.5
git 2.47.3
```

No se clonó de nuevo el repositorio. Se utilizó el paquete adjunto como copia parcial de archivos verificados, tal como autoriza la orden de esta revisión.

QA verificó directamente:

- SHA-256 y tamaño del ZIP;
- tamaño, SHA-256 y `git hash-object --no-filters` de los 10 archivos de `inputs/`;
- coincidencia de esos blobs con `manifest.json`;
- hashes y tamaños de los 40 pares `stdout`/`stderr` declarados;
- SHA-256 y contenido de `dist-inventory.csv`;
- 1649 rutas únicas, 447074960 bytes totales y máximos del inventario;
- ausencia de rutas `docs/` y `tests/` en el inventario;
- 0 archivos individuales de 49000000 bytes o más.

La comprobación previa de Astra ya había contrastado además los diez blobs declarados con GitHub en los commits de origen. En esta revisión no se repitieron diez descargas innecesarias.

Los 10 inputs permanecieron byte a byte intactos antes y después de las ejecuciones pequeñas.

### C. Astra · comprobación de apoyo

Se incorpora como evidencia de apoyo la comprobación descrita en la orden de integración:

- ZIP interior verificado contra `90c99e99…b0425b`;
- diez archivos fuente verificados por tamaño, SHA-256 y blob;
- blobs contrastados contra GitHub en los commits de origen;
- 40 pares `stdout`/`stderr` verificados;
- inventario de `dist` recalculado;
- repetición de las pruebas pequeñas con resultados coincidentes con Claude.

Astra no sustituye el veredicto QA y no se atribuye V7/build como ejecución propia de Astra.

### D. Diagnóstico no normativo

El paquete contiene `logs/diagnostico/diag-no-stop.mjs`, fuera del repositorio. QA volvió a ejecutarlo sobre los inputs verificados.

Se mantiene expresamente la etiqueta:

```text
DIAGNÓSTICO_NO_NORMATIVO
```

No sustituye al runner canónico ni amplía de forma normativa la cobertura que este alcanzó antes de detenerse.

### E. Pruebas manuales / integración pública

No ejecutadas en esta revisión:

- accesibilidad manual del panel;
- NVDA, JAWS, VoiceOver, TalkBack;
- línea braille real;
- locución real integrada en la interfaz;
- integración pública S1/S2.

Una máquina S0 todavía no integrada no acredita esas capas.

## 2. Integridad del paquete

Resultado QA:

```text
ZIP SHA-256                          PASS
ZIP tamaño 122177 bytes              PASS
10/10 inputs tamaño                  PASS
10/10 inputs SHA-256                 PASS
10/10 inputs git blob vs manifest    PASS
40/40 pares stdout/stderr            PASS
80/80 archivos de salida             PASS
dist-inventory.csv SHA-256           PASS
1649 rutas únicas                    PASS
suma 447074960 bytes                 PASS
0 archivos >= 49000000 bytes         PASS
docs/ en inventario                  AUSENTE
tests/ en inventario                 AUSENTE
```

SHA-256 del inventario:

```text
b5249541ba822a49cb092a86100ef383e93928fffdbba97011d0a0d320d01f21
```

## 3. Repetición pequeña de QA sin red

Comandos ejecutados por separado desde la raíz descomprimida:

```bash
(cd inputs/impl && node tools/test-sabik-machine-s0.js)
(cd inputs/qa && node tests/specs/sabik/validate-s0-contract-consistency.mjs)
(cd inputs/qa && node tests/specs/sabik/run-s0-contract.mjs --module ../impl/sabik/nea-core/sabik-machine.js)
(cd inputs/qa && node tests/specs/sabik/run-s0-addendum-b06-b07.mjs --module ../impl/sabik/nea-core/sabik-machine.js)
```

### Suite propia S0

```text
exit 0
37/37 validations passed
```

El `stdout` y `stderr` obtenidos por QA coinciden byte a byte con `logs/20-impl-test-s0.*` del paquete de Claude.

### Consistencia contractual

```text
exit 0
PASS
0 contradicciones
0 estados iniciales imposibles
0 referencias rotas
84 filas contractuales / 32 recorridos canónicos
```

El resultado coincide byte a byte con `logs/10-qa-validate-consistency.*`.

### Runner canónico con implementación

```text
exit 1
stdout:
QA contrato consolidado OK: 84 filas, 32 recorridos, 20 casos conversacionales.

stderr:
BLOQUEO_QA_S0: EV-SPEECH-REQUEST-PARTIAL-META: permitido rechazado: Invalid Sabik state: invalid speech boundary_count
```

El resultado coincide byte a byte con `logs/30-qa-contract-con-impl.*`.

### Subconjunto B06/B07

```text
exit 0
QA subconjunto B06/B07 OK: 28 filas, 12 recorridos; 0 expectativas independientes.
ACEPTA_SUBCONJUNTO_B06_B07
```

El resultado coincide byte a byte con `logs/31-qa-addendum-con-impl.*`.

El subconjunto es parte de la misma matriz consolidada: no suma cobertura adicional a 84 filas / 32 recorridos.

## 4. Bloqueo reproducido

### Caso

```text
EV-SPEECH-REQUEST-PARTIAL-META
```

**Posición:** 49 de 84.  
**Recorrido relacionado:** `S0-C29`.

### Estado previo

Plantilla contractual `T32`, con perfil parcial:

```json
{
  "speech_meta": {
    "energy": 0
  }
}
```

### Evento

```text
SPEECH_REQUEST
```

### Expectativa contractual

El evento es permitido. Los campos opcionales ausentes del objeto parcial deben completarse con los valores predeterminados contractuales, sin reinterpretar valores explícitos inválidos como válidos.

### Resultado observado

```text
Invalid Sabik state: invalid speech boundary_count
```

La implementación acepta la ausencia completa de `speech_meta`, pero cuando el objeto existe exige que `boundary_count` ya esté presente y sea entero antes de aplicar valores predeterminados.

### Invariante afectada

Semántica de metadatos opcionales/parciales en la frontera pública S0.

### Riesgo

Un estado público que el contrato considera válido puede ser rechazado por la implementación antes de ejecutar una transición permitida. Esto rompe la equivalencia entre matriz normativa y runtime y hace fallar el runner de aceptación.

### Criterio incumplido

Los metadatos opcionales parciales deben normalizar campos omitidos según `metadata_defaults`; los valores explícitamente inválidos sí deben seguir siendo rechazados.

### Corrección mínima esperada

Normalizar los campos omitidos de un `speech_meta` parcial antes de exigir su forma completa, manteniendo rechazo explícito para valores presentes pero inválidos.

Esta descripción es únicamente el criterio mínimo derivado del contrato; **no constituye una orden de implementación ni autoriza cambios a Codex en esta tarea**.

## 5. Cobertura normativa real

El runner canónico se detiene en el primer fallo. Por tanto la cobertura ejecutada por ese runner es exactamente:

```text
filas previstas:          84
filas alcanzadas:         49
filas PASS:               48
filas FAIL:                1
recorridos ejecutados:     0/32
entradas inválidas:        0/3
```

No se presenta como ejecutada ninguna fila posterior a la 49 por el runner principal.

## 6. Diagnóstico complementario

QA volvió a ejecutar `diag-no-stop.mjs` sobre los inputs verificados. La salida coincide byte a byte con `logs/90-DIAGNOSTICO_NO_NORMATIVO-filas-y-recorridos.*`.

Resultado:

```text
DIAGNÓSTICO_NO_NORMATIVO
filas:       83/84 PASS
recorridos:  31/32 PASS
```

Único fallo de fila:

```text
EV-SPEECH-REQUEST-PARTIAL-META
```

Único recorrido fallido:

```text
S0-C29
```

Las 3 entradas inválidas no se ejecutan en este diagnóstico porque `runInvalidInputs` no está exportado. No se presentan como PASS.

## 7. Estado de B14 y B15

### B14 · `error_meta`

El runner principal alcanzó 3 de las 13 filas B14 antes de detenerse:

```text
EV-BOOT-TECHNICAL-ERROR     PASS
EV-SPEECH-ERROR             PASS
EV-SPEECH-ERROR-REDUCED     PASS
```

Las otras 10 filas B14 quedan `NO_EJECUTADO` por el runner normativo en esta ejecución. El diagnóstico complementario las ejecutó individualmente y muestra PASS en las 13/13 filas B14.

Por tanto:

```text
B14 runner normativo: 3/13 ejecutadas, 3 PASS
B14 diagnóstico:      13/13 PASS
```

No se afirma que las 13 pasaran en la ejecución principal.

### B15 · movimiento off sin metadatos

```text
EV-SPEECH-REQUEST-META-OMITTED-OFF  PASS
```

Esta fila sí fue ejecutada por el runner canónico antes del bloqueo. B15 queda demostrado como PASS normativo para esta fila.

## 8. V7 · evidencia Linux de Claude verificada por QA

**Procedencia:** ejecutado por Claude en clon completo Linux sobre `5b022061…`; registros y hashes verificados por QA.

Registro:

```text
logs/21-impl-test-v7.meta.json
```

Resultado documentado y verificado:

```text
exit 0
28/28 validations passed
```

QA verificó que `stdout`/`stderr`, tamaños y SHA-256 coinciden con `manifest.json`.

No se atribuye esta ejecución al terminal del Agente n.º 1 ni a GitHub Actions.

## 9. Build Linux · evidencia de Claude verificada por QA

**Procedencia:** ejecutado por Claude en clon completo Linux sobre `5b022061…`; registros y hashes verificados por QA.

Registro principal:

```text
logs/40-impl-build.meta.json
```

Resultado:

```text
python3 scripts/build_site.py
exit 0
Directorio público: 1649 archivos; fuentes e informes permanecen fuera de dist.
```

QA verificó además los registros de HEAD/estado inicial y final y utiliza `42-estado-post-build-qa-repetido` como comprobación válida de QA tras build.

Registros expresamente inválidos/no usados:

```text
41-estado-post-build-qa
95-paquete-sin-red-prueba-de-aislamiento
```

Sustitutos válidos:

```text
42-estado-post-build-qa-repetido
96-paquete-sin-red-prueba-de-aislamiento-curl
```

El build actual **sí tiene evidencia Linux verificable**. No se mantiene B05 como “sin evidencia”.

## 10. `dist` y límite interno del proyecto

QA verificó el hash de `dist-inventory.csv` y recalculó el inventario completo.

Resultado:

```text
archivos:                       1649
total bytes:                    447074960
rutas únicas:                   1649
archivos >= 49000000 bytes:     0
dist/docs/:                     ausente en inventario
dist/tests/:                    ausente en inventario
```

Archivos por encima del aviso interno de 10 MB:

```text
11061912 bytes  audio/meditacion-larga.mp3
10795463 bytes  audio/rincon/lluvia-en-tienda.mp3
```

Son avisos, no bloqueos del umbral de 49.000.000 bytes por archivo. No se modifican los audios en esta tarea.

El inventario también confirma los seis `.b64` registrados; los logs `53-*` documentan que ya existían en la base `efa4ed9…`. No se clasifican como artefactos de transporte de esta revisión.

`dist/sabik/nea-core/sabik-machine.js` está presente e idéntico a la fuente. `logs/54-*` muestra que `dist/es/nea/index.html` y `dist/sabik/sabik-page.js` no referencian todavía `sabik-machine`. Esto no acredita integración visual ni accesibilidad del panel.

## 11. Alcance

Lectura remota de GitHub y registros del paquete coinciden.

### Sexto commit respecto a `8df93fc…`

Solo modifica:

```text
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

### PR #161 acumulado respecto a `efa4ed9…`

Limitado a:

```text
sabik/AGENTS.md
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

**PASS de alcance.** No aparecen panel, HTML, CSS, datasets, índice, assets, `.github`, `main` ni producción.

## 12. Pureza e invariantes

La suite propia fresca de QA da 37/37 e incluye comprobaciones de:

- importación Node sin `window`;
- forma pública;
- rechazo explícito sin mutar el estado previo;
- arranque;
- seguridad;
- voz;
- movimiento reducido;
- determinismo;
- eventos imposibles;
- validación de metadatos.

El runner canónico no llega a la fase de recorridos/entradas inválidas por el bloqueo en la fila 49; por tanto no se infiere cobertura dinámica completa de todas las invariantes a partir de ese runner.

## 13. Corpus conversacional

El runner sin implementación valida la estructura del corpus y cuenta 20 casos. Esa validación estructural **no significa que las veinte conversaciones hayan sido ejecutadas por el motor**.

No se infla cobertura conversacional en esta revisión.

## 14. Veredicto

```text
BLOQUEADO_S0
```

### Motivo bloqueante

El runner normativo de aceptación falla en una fila permitida del contrato consolidado:

```text
EV-SPEECH-REQUEST-PARTIAL-META
```

El fallo está reproducido por QA con los bytes exactos del paquete y coincide byte a byte con la ejecución Linux de Claude.

### Lo que queda acreditado

```text
suite propia S0                 37/37 PASS (QA, copia parcial verificada)
consistencia contractual       PASS (QA, copia parcial verificada)
subconjunto B06/B07             PASS (QA, copia parcial verificada)
B15                              PASS normativo
B14                              3/13 PASS normativo; 13/13 PASS diagnóstico
V7                               28/28 PASS (Claude Linux, hashes verificados por QA)
build Linux                      exit 0 (Claude Linux, hashes verificados por QA)
dist                             1649 archivos, 0 >=49 MB, docs/tests ausentes
alcance                          PASS
```

### Lo que impide aceptar S0

```text
runner canónico: exit 1
fila: EV-SPEECH-REQUEST-PARTIAL-META
recorrido relacionado: S0-C29
```

No se emite `ACEPTADO_S0` mientras el runner principal falle.

## 15. Estado de coordinación

- PR #161 permanece abierto y `draft`.
- PR #164 permanece abierto y `draft`.
- SHA contractual normativo sigue siendo `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`; este informe es solo evidencia posterior.
- No se modifica PR #162.
- No se modifica PR #163.
- S1 y S2 permanecen cerrados.
- No se fusiona nada.
- No se toca `main`.
- `noindex` no cambia.
- No se realiza deploy.
- Esta revisión no ordena otro ciclo ni cambios a Codex.
