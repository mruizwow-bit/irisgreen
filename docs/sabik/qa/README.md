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
- `MATRIZ-S0-S8.md`: clasificación BLOQUEANTE / INFORMATIVA / MANUAL por fase y tipo de prueba.
- `ACCESIBILIDAD-Y-AT-REAL.md`: pruebas automáticas y manuales de teclado, foco, AT, zoom, reflow, colores forzados, voz y movimiento.
- `METRICAS-Y-COBERTURA.md`: métricas separadas y cobertura.
- `s0-state-contract.json`: matriz ejecutable de transiciones con efectos lógicos.
- `s0-transition-cases.json`: recorridos canónicos.
- `run-s0-contract.mjs`: runner desacoplado del runtime.
- `conversation-corpus.v1.json`: copia QA verificable del corpus conversacional, coordinada por PR con Claude.

## Runner

Validación de contrato, fixtures y corpus sin ejecutar runtime:

```bash
node tests/specs/sabik/run-s0-contract.mjs
```

Puerta automática contra una implementación S0:

```bash
node tests/specs/sabik/run-s0-contract.mjs --module sabik/nea-core/sabik-machine.js
```

El segundo comando verifica pureza observable, determinismo, inmutabilidad, valores válidos, transiciones permitidas, rechazos explícitos, invariantes, serialización y estados imposibles. Un resultado verde del runner es necesario, pero **no suficiente**, para declarar S0 aceptado.

## Puerta S0

No puede empezar S1 hasta que concurran las cuatro condiciones:

1. implementación S0 revisable en PR #161;
2. revisión semántica de Claude disponible en PR #162;
3. runner canónico ejecutado contra la implementación;
4. cero contradicciones de contrato bloqueantes.

El veredicto de QA en PR #161 será exactamente uno de:

- `ACEPTADO_S0`
- `ACEPTADO_S0_CON_PENDIENTES_NO_BLOQUEANTES`
- `BLOQUEADO_S0`

## Reglas de salida pública

Terminar código no autoriza retirar `noindex`. La decisión es independiente y posterior a accesibilidad, seguridad, regresión, documentación pública y declaración de accesibilidad. Un build verde tampoco equivale a una fase terminada.
