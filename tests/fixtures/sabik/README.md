# Fixtures Sabik compartidos

## Corpus conversacional QA

Archivo canónico de QA: `conversation-corpus.v1.json`.

El corpus puede recibir casos propuestos desde la auditoría semántica de PR #162, pero QA conserva una copia verificable y ejecutable desde PR #164.

Cada caso declara obligatoriamente:

- `id`
- `idioma`
- `entrada`
- `contexto_anterior`
- `intencion`
- `objetivo`
- `conceptos_esperados`
- `conceptos_prohibidos`
- `tipo_salida`
- `accion_permitida`
- `accion_prohibida`
- `pregunta_si_no`
- `recurso_humano_si_no`
- `fuentes_aceptables`
- `estado_final`
- `incertidumbre`

### Coordinación con Claude

Para evitar dos esquemas incompatibles, cualquier fixture semántico nuevo de PR #162 debe:

1. reutilizar estos nombres de campo o documentar un mapeo inequívoco;
2. mantener IDs estables;
3. distinguir riesgo directo, ambiguo y negado;
4. distinguir insuficiencia editorial de error técnico;
5. no marcar como fuente aceptable un contacto, URL, teléfono, importe o fecha sin verificación;
6. no modificar casos QA para acomodar errores de implementación.

El runner de QA valida la estructura de esta copia. La evaluación semántica de conceptos esperados/prohibidos se activará en las fases de conversación correspondientes; no se declara pasada durante S0.
