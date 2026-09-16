# Workspace Agente n.º 1 · QA, regresión y puertas de calidad

Issue #149 · Epic #145 · PR #164 (`sabik/qa-contract` → `sabik-preview`) · **draft**

## Fuente normativa S0

`tests/specs/sabik/s0-state-contract.json` es la única fuente ejecutable de estados, eventos, payloads y resultados.

El SHA `e69929b4b88128c4c935435987f35532f37d2df0` queda sustituido por la consolidación actual por contradicción interna entre contrato base y adenda B06/B07.

## Archivos ejecutables

- `tests/specs/sabik/s0-state-contract.json` — 84 filas.
- `tests/specs/sabik/s0-transition-cases.json` — 32 recorridos.
- `tests/specs/sabik/validate-s0-contract-consistency.mjs` — detector de contradicciones.
- `tests/specs/sabik/run-s0-contract.mjs` — runner principal.
- `tests/specs/sabik/s0-contract-addendum-b06-b07.json` — índice histórico de 28 filas / 12 recorridos.
- `tests/specs/sabik/run-s0-addendum-b06-b07.mjs` — ejecuta ese subconjunto leyendo la fuente principal.

## Validación sin runtime

```bash
node tests/specs/sabik/validate-s0-contract-consistency.mjs
node tests/specs/sabik/run-s0-contract.mjs
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs
```

Un verde contractual no abre S1 ni autoriza publicación. PR #164 permanece `draft`; `main`, producción y `noindex` quedan fuera de este trabajo.
