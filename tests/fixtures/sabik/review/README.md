# Fixtures de la revisión semántica (PR #162)

Carpeta propia de la revisión de Claude para no colisionar con `tests/fixtures/sabik/README.md` ni con `conversation-corpus.v1.json`, que pertenecen a QA (PR #164).

Todos los ficheros son **no ejecutables**: describen expectativas y comportamiento observado. No los consume ningún runner todavía. QA conserva su copia canónica; estos casos se proponen para incorporarse allí.

| Fichero | Contenido |
|---|---|
| `conversation-corpus.review.es.json` | 48 casos conversacionales (14 categorías de la orden + índice funcional), positivos y negativos, con el comportamiento de `sabik-preview@efa4ed9`. |
| `safety-corpus.review.es.json` | 51 casos de seguridad conversacional (11 categorías + persistencia), con el comportamiento actual. |
| `human-resource.schema.json` | JSON Schema propuesto para `human-resources.<idioma>.json`. Impide publicar registros sin verificación, teléfono o URL. |
| `human-resources.candidates.es.json` | Dos candidatos marcados `⚠ COMPROBAR — NO PUBLICAR`. No son publicables y no validan como `PUBLICABLE`. |
| `functional-unit.schema.json` | JSON Schema propuesto para la unidad recuperable funcional (sección con ancla). |
| `state-inventory.es.json` | Inventario de estados legible por máquina y correspondencias con S0 y con el contrato QA. |
| `s0-machine-review.es.json` | Secuencias ejecutadas contra la máquina S0 de PR #161 (`e8bcedf`), con resultado observado y propuesta. |

## Compatibilidad con el contrato QA

Los corpus usan los 16 campos obligatorios del contrato QA (`id`, `idioma`, `entrada`, `contexto_anterior`, `intencion`, `objetivo`, `conceptos_esperados`, `conceptos_prohibidos`, `tipo_salida`, `accion_permitida`, `accion_prohibida`, `pregunta_si_no`, `recurso_humano_si_no`, `fuentes_aceptables`, `estado_final`, `incertidumbre`).

Diferencias que conviene conocer antes de fusionar casos:

- `conceptos_esperados` y `conceptos_prohibidos` contienen **IDs de `concepts.es.json`**, no etiquetas semánticas libres. Los IDs propuestos que aún no existen se repiten en `conceptos_no_existentes_en_dataset`.
- Las prohibiciones de conducta (diagnosticar, inventar recursos) están en `accion_prohibida`.
- `tipo_respuesta_detallado` conserva el tipo de plan del Core (o el propuesto); `tipo_salida` es su proyección a los cinco valores QA.
- Campos adicionales pedidos por la orden de #147: `debe_reconocer_insuficiencia`, `conservar_tema_anterior`, `polaridad`, `categoria`, `entrada_es_control`.
- Ningún caso marca como fuente aceptable un contacto sin verificar: `fuentes_aceptables` solo admite `recurso_humano_verificado*` y `contenido_publicable_iris_green`.

## Cómo se obtuvo `comportamiento_actual`

Ejecutando el Core de `sabik-preview@efa4ed9` con los datasets reales. Método en `docs/sabik/reviews/evidencia/sondeo-runtime.md`. El campo `cumple` resume comprobaciones automáticas; `observacion_revisor` señala casos que las cumplen con un texto no pertinente.
