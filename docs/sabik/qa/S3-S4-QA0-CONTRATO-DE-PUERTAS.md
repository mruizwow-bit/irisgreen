# S3–S4 QA0 · Contrato de puertas

Base de trabajo: `sabik-preview@96ebf38a535fa287f32fee8c7957ede39933365c`.

Esta rama define **QA ejecutable** para S3 y S4. No implementa runtime, no modifica datasets públicos y no depende de los corpus I0 de Agentes 2/5.

## Clasificación obligatoria

- `AUTOMATIC_BLOCKING`: solo hechos deterministas observables mediante adapter de prueba. Un fallo bloquea.
- `MANUAL_BLOCKING`: requiere evidencia humana real. El runner **nunca** infiere PASS desde DOM, snapshots o heurísticas.
- `INFORMATIONAL`: registra fronteras lingüísticas/editoriales sin convertir juicio humano en aserción binaria.

## Archivos

Matrices:
- `tests/specs/sabik/s3-safety-gates.json`
- `tests/specs/sabik/s4-context-gates.json`

Fixtures independientes:
- `tests/fixtures/sabik/s3-safety-fixtures.json`
- `tests/fixtures/sabik/s4-context-fixtures.json`

Gates y runners:
- `tests/specs/sabik/s3-s4-gates.json`
- `tests/specs/sabik/s3-s4-qa0-manifest.json`
- `tests/specs/sabik/validate-s3-s4-qa0.mjs`
- `tests/specs/sabik/run-s3-s4-qa0.mjs`

Los fixtures se declaran `QA0_SYNTHETIC_INDEPENDENT_NO_I0`. Los recursos de S3 son objetos sintéticos de prueba y **no son datos operativos publicables**.

## Uso

```bash
node tests/specs/sabik/validate-s3-s4-qa0.mjs
node tests/specs/sabik/run-s3-s4-qa0.mjs
```

Ejecución futura contra implementación:

```bash
node tests/specs/sabik/run-s3-s4-qa0.mjs --adapter /ruta/adapter-s3-s4.mjs
```

El adapter exporta `evaluateS3(fixture)` y `evaluateS4(fixture)`. El runner compara `fixture.expected` como subconjunto recursivo de la observación.

Las puertas manuales solo pueden cerrarse mediante un archivo de evidencia humana con `PASS_REAL`, `FAIL_REAL` o `PENDIENTE_EVIDENCIA_REAL`; el runner no las infiere.

## Cobertura S3

Riesgo directo, indirecto, ambiguo y negado; tercera persona; citas; riesgo físico inmediato; falsos positivos; territorio ausente; recurso oficial sintético válido; recurso vencido/no publicable; ausencia de recurso; fuente no oficial; territorio incompatible; prohibición de inventar contenido; teclado; lector real; movimiento reducido; significado no dependiente solo de color/animación.

Los datos operativos reales deberán validarse contra fuente oficial antes de publicación. QA0 no los inventa.

## Cobertura S4

Primera consulta frente a corrección; negaciones con orden variable; `No es esto`; `Buscar por otra vía`; `No me preguntes`; pronombres/elipsis con antecedente único; cambio de tema; fallos individuales y conjuntos de datasets opcionales; reintento; ausencia de conversación en localStorage/sessionStorage/cookies/IndexedDB; sesión nueva tras recarga; conceptos rechazados no activos.

Pronombres con múltiples antecedentes y doble negación ambigua son `INFORMATIONAL`, no tests binarios automáticos.

## Límites

No modifica runtime, `main`, producción, deploy, S2, PR #162/#163/#164, datasets I0 ni datasets públicos. La salida QA0 acredita **contrato preparado**, no S3/S4 implementados.

