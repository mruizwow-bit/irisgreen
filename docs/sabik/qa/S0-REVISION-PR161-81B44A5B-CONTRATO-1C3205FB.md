# S0 · revisión técnica de PR #161 sobre `81b44a5b`

**Implementación:** `81b44a5b8bfdcb3f662b8d7de3385cbce8090f63`  
**Árbol de implementación:** `1294ef852759950574e664103891197ce0bad1a2`  
**Padre:** `5b0220612404d400cbf9de35240a3dacf98868a5`  
**Contrato normativo:** `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`  
**PR implementación:** #161  
**PR QA/evidencia:** #164  
**Veredicto:** `BLOQUEADO_S0`

## 1. Método y procedencia

Esta revisión integra cuatro capas sin mezclar su procedencia:

### A. Agente n.º 1 QA · verificación del paquete y repetición pequeña

Paquete utilizado:

```text
EVIDENCIA_QA_S0_81B44A5B.zip
bytes:   211133
SHA-256: 0728e8d6f7aa4e26a0f79f668fe85889f483280e50fceccdc3f116337e6da456
```

QA extrajo el ZIP en una carpeta nueva, comprobó que no hubiera rutas que escaparan del destino ni enlaces simbólicos y verificó directamente:

- 151/151 archivos declarados por `manifest.json` (más `manifest.json` y `RESUMEN.md` = 153 archivos reales);
- 10/10 inputs por tamaño, SHA-256 y `git hash-object --no-filters` contra el manifiesto;
- 44/44 pares `stdout`/`stderr` por tamaño y SHA-256;
- `dist-inventory.csv` por SHA-256 y recálculo independiente;
- 1649 rutas únicas, 447074912 bytes, 0 archivos de 49000000 bytes o más;
- ausencia de rutas `docs/` y `tests/` en el inventario;
- los 10 inputs permanecieron byte a byte intactos antes y después de la repetición pequeña.

Entorno de la repetición QA:

```text
Linux 6.18.44 x86_64 GNU/Linux
Node v22.16.0
Python 3.13.5
git 2.47.3
```

### B. Claude · ejecución Linux completa

> Ejecutado por Claude en clon completo Linux sobre `81b44a5b8bfdcb3f662b8d7de3385cbce8090f63`; registros, manifiesto, hashes e inventario verificados por QA.

Entorno documentado:

```text
Linux 6.18.44-fc-v33 x86_64
Ubuntu 24.04.4 LTS
git 2.43.0
Node v22.22.2
Python 3.12.3
```

Los worktrees registran:

```text
implementación HEAD = 81b44a5b8bfdcb3f662b8d7de3385cbce8090f63
implementación tree = 1294ef852759950574e664103891197ce0bad1a2
contrato HEAD       = 1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b
contrato tree       = 8baf547e03581108d7d611efc8cabe07cbca472c
```

Los árboles estaban limpios al inicio y al final; `git fsck --connectivity-only` terminó con código 0 según los registros del paquete.

### C. Astra · comprobación de apoyo

Astra había verificado previamente integridad del paquete, los diez blobs, los registros, el inventario y había repetido los comandos pequeños. Esa comprobación se usa como corroboración; no sustituye la repetición propia de QA ni el veredicto formal.

### D. `DIAGNÓSTICO_NO_NORMATIVO`

El paquete incluye `logs/aux/diagnostico-no-normativo.mjs`, fuera del repositorio. QA lo ejecutó de nuevo sobre los inputs verificados. Su resultado no modifica el código de salida de los runners congelados ni añade cobertura normativa.

## 2. Resultado normativo reproducido por QA

Comandos ejecutados desde la raíz descomprimida:

```bash
(cd inputs/impl && node tools/test-sabik-machine-s0.js)
(cd inputs/qa && node tests/specs/sabik/validate-s0-contract-consistency.mjs)
(cd inputs/qa && node tests/specs/sabik/run-s0-contract.mjs \
  --module ../impl/sabik/nea-core/sabik-machine.js)
(cd inputs/qa && node tests/specs/sabik/run-s0-addendum-b06-b07.mjs \
  --module ../impl/sabik/nea-core/sabik-machine.js)
```

Resultados frescos de QA:

```text
suite propia S0        exit 0 · 67/67 validations passed
consistencia contrato  exit 0 · PASS · 84 filas / 32 recorridos
runner canónico        exit 0 · ACEPTA_PUERTA_AUTOMATICA_S0
subconjunto B06/B07    exit 0 · ACEPTA_SUBCONJUNTO_B06_B07
```

Los diez inputs quedaron intactos después de las cuatro ejecuciones.

El runner principal aceptado implica la ejecución completa de:

```text
84/84 filas contractuales
32/32 recorridos canónicos
3/3 entradas inválidas definidas en el contrato
```

Los 20 casos del corpus se validan estructuralmente; esto no significa que se hayan ejecutado 20 conversaciones contra el asistente integrado.

El subconjunto B06/B07 (28 filas / 12 recorridos) está contenido en la misma matriz y no suma cobertura adicional.

## 3. Correcciones anteriores confirmadas

Quedan en PASS normativo:

- `EV-SPEECH-REQUEST-PARTIAL-META` y recorrido `S0-C29`;
- B14: las 13 filas de `error_meta` incluidas en el runner completo;
- B15: `EV-SPEECH-REQUEST-META-OMITTED-OFF`;
- metadatos parciales de `speech_meta` con defaults solo para campos omitidos;
- movimiento `off` sin `motion_meta` hasta reactivación explícita;
- arranque, seguridad, pausa, retry, voz, movimiento reducido, pureza, determinismo, inmutabilidad y serialización cubiertos por la puerta congelada.

No se conservan los estados históricos de «B14 parcial» ni «B15 abierto» para este SHA.

## 4. V7, build Linux y `dist`

Evidencia atribuida a Claude, verificada por QA mediante manifiesto, hashes y registros:

```text
V7                         28/28 PASS · exit 0
build_site.py              exit 0
dist                       1649 archivos
bytes totales              447074912
archivos >= 49000000       0
dist/docs/                 ausente
dist/tests/                ausente
```

Avisos no bloqueantes por tamaño:

```text
audio/meditacion-larga.mp3          11061912 bytes
audio/rincon/lluvia-en-tienda.mp3   10795463 bytes
```

El umbral interno es por archivo. El total de `dist` no constituye por sí mismo un fallo de esa comprobación.

La máquina aparece en `dist/sabik/nea-core/sabik-machine.js`, pero los registros indican que ninguna página/script la carga todavía. Por tanto esta evidencia no acredita integración visual, S1/S2, voz integrada ni accesibilidad manual.

## 5. Alcance

Lectura GitHub del delta `5b022061… → 81b44a5b…`:

```text
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

PR #161 acumulado permanece limitado a:

```text
sabik/AGENTS.md
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

**Alcance: PASS.**

## 6. Hallazgo A · arrays en `motion_meta` y `error_meta`

### Resultado del runner congelado

```text
PASS
ACEPTA_PUERTA_AUTOMATICA_S0
```

El runner no incluye `motion_meta: []` ni `error_meta: []` entre sus tres muestras de entrada inválida.

### Comprobación adicional reproducida

QA reprodujo el diagnóstico y realizó un contraste directo entre el validador contractual congelado y la implementación:

```text
motion_meta: []
  validateState(contracto)     -> RECHAZADO: motion_meta inválido
  validateSabikState(runtime)  -> ACEPTADO
  BOOT_OK                      -> ACEPTADO; normaliza a {reduced:false}

error_meta: []
  validateState(contracto)     -> RECHAZADO: error_meta inválido
  validateSabikState(runtime)  -> ACEPTADO
  BOOT_OK                      -> ACEPTADO; normaliza a
                                 {origin_operation:null, layer:null,
                                  code:null, message:null}
```

Las entradas permanecen intactas; la divergencia está en la validación pública, no en mutación.

### Regla contractual afectada

`tests/specs/sabik/validate-s0-contract-consistency.mjs` define `validateMetadata()` de modo que `speech_meta`, `motion_meta` y `error_meta` deben ser objetos y **no arrays** (`Array.isArray(...)` implica rechazo).

Por tanto no se trata de inventar un nuevo catálogo: la regla de tipo ya existe en el contrato normativo `1c3205fb…`.

### Riesgo y gravedad

**Bloqueante para S0.**

S0 fija la frontera pública de estados. La implementación acepta estados que la fuente contractual declara inválidos. Aunque la máquina todavía no esté conectada a la página, aceptar S0 con esta divergencia congelaría una frontera runtime más amplia que la frontera normativa y trasladaría un estado imposible a fases posteriores.

### Criterio mínimo derivado del contrato

La implementación debe rechazar `motion_meta` y `error_meta` cuando sean arrays, sin mutar estado/evento ni incrementar `revision` en una transición rechazada. Esta frase documenta el criterio incumplido; no constituye una orden de cambio dentro de esta tarea.

## 7. Hallazgo B · `speech_meta.end_reason`

QA reprodujo:

```text
speech_meta.end_reason = 5           -> aceptado y conservado
speech_meta.end_reason = "inventado" -> aceptado y conservado
```

El contraste directo muestra que **el validador contractual congelado también acepta ambos valores**. El contrato contiene perfiles con `null`, `explicit_stop`, `natural_end`, `error` y `safety_interrupted`, pero no declara una enumeración cerrada ni una regla que convierta otros valores en inválidos.

### Clasificación

**No bloqueante para esta implementación bajo el contrato vigente.**

Se registra como **laguna de precisión/cobertura contractual**: implementación y contrato se comportan igual, y no existe base normativa suficiente para exigir ahora un catálogo cerrado. No se modifica el contrato en esta tarea y no se presenta una inferencia como requisito de Codex.

## 8. Pruebas no acreditadas por S0

No se marcan como ejecutadas/aceptadas por esta revisión:

- accesibilidad manual del panel;
- NVDA, JAWS, VoiceOver, TalkBack;
- línea braille real;
- locución real integrada en interfaz;
- integración pública S1/S2.

La aceptación automática de la máquina no acredita esas capas.

## 9. Veredicto

```text
BLOQUEADO_S0
```

Motivo único actualmente demostrado contra el contrato vigente: **Hallazgo A**, divergencia de tipo en la frontera pública para `motion_meta: []` y `error_meta: []`.

No se reabren B05, B14 ni B15:

- B05 dispone de V7/build Linux y `dist` verificados para `81b44a5b…`;
- B14 pasa dentro del runner completo;
- B15 pasa dentro del runner completo;
- `EV-SPEECH-REQUEST-PARTIAL-META` y `S0-C29` pasan.

El Hallazgo B queda documentado como pendiente de precisión contractual no bloqueante.

## 10. Estado de puertas

- PR #161 permanece abierto y `draft` contra `sabik-preview`.
- PR #164 permanece abierto y `draft`; este commit es evidencia, no un nuevo contrato.
- El SHA contractual normativo continúa siendo `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`.
- S1 y S2 permanecen cerrados.
- No se modifica PR #162 ni PR #163.
- No se modifica `main`, producción ni `noindex`.
- No se realiza deploy.
- Esta tarea no ordena un siguiente ciclo a Codex.
