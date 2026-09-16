# Workspace Agente n.º 1 · QA, regresión y puertas de calidad

**Issue:** #149  
**Epic:** #145  
**PR:** #164 (`sabik/qa-contract` → `sabik-preview`)  
**Estado:** draft. No habilita por sí solo S1 ni retirada de `noindex`.

## Alcance

Esta rama convierte el programa Sabik/NEA en contratos verificables. Durante la primera oleada no modifica runtime ni contenido público.

Archivos permitidos:

- `docs/sabik/qa/**`
- `tests/specs/sabik/**`
- `tests/fixtures/sabik/**`

Quedan fuera de alcance en esta fase:

- `sabik/nea-core/**`
- `sabik/sabik-page.js`
- `sabik/sabik-page.css`
- `es/nea/index.html`
- datasets públicos
- `main`
- producción

## Inventario QA

- `S0-CONTRATO-DE-ESTADOS-Y-PRUEBAS.md`: contrato normativo y puerta S0.
- `ADENDA-B06-B07-CONTRATO-CONGELADO.md`: revisión normativa congelada para aclaraciones, seguridad, voz y forma pública.
- `MATRIZ-S0-S8.md`: clasificación BLOQUEANTE / INFORMATIVA / MANUAL por fase y tipo de prueba.
- `ACCESIBILIDAD-Y-AT-REAL.md`: pruebas automáticas y manuales de teclado, foco, AT, zoom, reflow, colores forzados, voz y movimiento.
- `METRICAS-Y-COBERTURA.md`: métricas separadas y cobertura.
- `s0-state-contract.json`: matriz ejecutable base de transiciones con efectos lógicos.
- `s0-transition-cases.json`: recorridos canónicos base.
- `s0-contract-addendum-b06-b07.json`: **25 filas y 8 recorridos adicionales congelados**.
- `run-s0-contract.mjs`: runner canónico base desacoplado del runtime.
- `run-s0-addendum-b06-b07.mjs`: runner adicional obligatorio para B06/B07.
- `conversation-corpus.v1.json`: copia QA verificable del corpus conversacional, coordinada por PR con Claude.

## Runner base

Validación de contrato, fixtures y corpus sin ejecutar runtime:

```bash
node tests/specs/sabik/run-s0-contract.mjs
```

Puerta automática base contra una implementación S0:

```bash
node tests/specs/sabik/run-s0-contract.mjs --module <módulo puro S0>
```

El segundo comando verifica pureza observable, determinismo, inmutabilidad, valores válidos, transiciones permitidas, rechazos explícitos, invariantes, serialización y estados imposibles.

## Adenda B06/B07 congelada

Validación estructural de la adenda:

```bash
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs
```

Puerta adicional contra una implementación S0:

```bash
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs --module <módulo puro S0>
```

La adenda congela:

- `awaiting_clarification + SUBMIT → retrieving` en aclaración normal, conservando adaptación, idioma, visibilidad y contexto externo de sesión;
- `SUBMIT` durante `safety=uncertain` sin rebaja automática;
- resolución explícita mediante `RISK_CONFIRMED` o `RISK_CLEARED`;
- `RISK_CLEARED` únicamente desde `uncertain`, nunca como reset genérico;
- `SPEECH_REQUEST` como clic de Escuchar sin audio real;
- `SPEECH_START` como `speechSynthesis.onstart` real;
- `SPEECH_BOUNDARY` solo después del inicio real;
- pausa, reanudación, stop, end y error con movimiento definido;
- voz ordinaria bloqueada durante `risk` y `human_handoff`;
- forma pública canónica con `operation`, `dialogue`, `safety`, `visibility`, `speech`, `motion`, `language` escalares, `revision` entero y `adaptation` completa.

Los metadatos opcionales `speech_meta` y `motion_meta`, o la proyección de `deriveSabikPresentation()`, pueden contener energía, límites o razón de finalización, pero no reemplazar los campos escalares.

**La puerta S0 exige que runner base y runner de adenda estén ambos en verde. Un verde no compensa un fallo del otro.**

## Puerta S0

No puede empezar S1 hasta que concurran las cuatro condiciones:

1. implementación S0 revisable en PR #161;
2. revisión semántica de Claude disponible en PR #162;
3. runner canónico y adenda B06/B07 ejecutados contra la implementación;
4. cero contradicciones de contrato bloqueantes.

Cuando aparezca un nuevo SHA de PR #161, QA reconstruirá el checkout desde GitHub y repetirá desde cero suite propia, V7, runner base, runner B06/B07, secuencias de Claude, build Linux e invariantes. **No se heredan resultados anteriores.**

El veredicto de QA en PR #161 será exactamente uno de:

- `ACEPTADO_S0`
- `ACEPTADO_S0_CON_PENDIENTES_NO_BLOQUEANTES`
- `BLOQUEADO_S0`

## Regla de congelación

El SHA de PR #164 publicado tras esta adenda es la referencia contractual para el siguiente ciclo de Codex. No se cambiarán valores, eventos ni semántica durante ese ciclo salvo defecto de seguridad crítico documentado. Una incompatibilidad de implementación no justifica cambiar el contrato.

## Reglas de salida pública

Terminar código no autoriza retirar `noindex`. La decisión es independiente y posterior a accesibilidad, seguridad, regresión, documentación pública y declaración de accesibilidad. Un build verde tampoco equivale a una fase terminada.
