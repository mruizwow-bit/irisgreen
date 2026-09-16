# 06 · Revisión del conocimiento actual

Datasets de `sabik/assets/NEA/` en `sabik-preview` @ `efa4ed9`. Todo es **[H]** salvo marca.

## 1. Resumen

| Dataset | Registros | Consumido por el runtime | Problemas principales |
|---|---|---|---|
| `concepts.es.json` | 6 | sí | alias genéricos; un concepto mezcla preferencia y necesidad; 2 conceptos sin fragmentos |
| `relations.es.json` | 4 | sí (solo `from` → `to`) | orígenes que no son conceptos; 2 relaciones sin evidencia posible; campos ignorados |
| `actions.es.json` | 3 | se calcula, **no se representa** | concepto inexistente; promesas que el panel no cumple |
| `discriminating-questions.es.json` | 1 | sí | inutilizable: concepto inexistente |
| `procedures.es.json` | 1 | **no** | demo marcado `PUBLICABLE`; fragmento de origen inexistente |
| `human-resources.es.json` | 0 | **no** | vacío y obligatorio para cargar |
| `iris-fragments-index.es.json` | 4332 | sí | todo `PUBLICABLE`; sin anclas; etiquetado léxico; encabezado dentro del texto |
| `language-corpora.json` (fuera del alcance pedido) | 1 | **no** | ruta inexistente |

## 2. `concepts.es.json`

- `riesgo_suicida` tiene el alias «hacerme dano», que coincide con usos literales («¿Qué alimentos pueden hacerme daño?») y etiqueta la ficha de pica en el índice. Ver `04-seguridad-conversacional.md`.
- `baja_demanda` usa como alias «menos texto» y «no puedo pensar»: una preferencia de formato se convierte en concepto y dispara la acción `bajar_intensidad` y respuestas sobre cines con menos estímulos (C-12).
- `carga_atencional` y `baja_demanda` no tienen ningún fragmento en el índice: nunca pueden aportar evidencia.
- `sobrecarga_sensorial` alias «me saturo»; el detector de estado cognitivo usa «estoy saturad». Dos vocabularios para lo mismo.
- **[H]** El generador del índice (`tools/rebuild-sabik-index.py`, `CONCEPT_TERMS`) duplica los alias y **no coincide** con el dataset: añade «sobrecarga» a `sobrecarga_sensorial`. 30 de sus 52 fragmentos no contienen «sobrecarga sensorial».
- Faltan conceptos que la conversación necesita (ver `03-corpus-conversacional.md`, §1).
- Todos los conceptos son `PUBLICABLE` sin fecha de revisión ni responsable.

## 3. `relations.es.json`

- Los cuatro `from` (`supermercado` ×3, `no_puedo_pensar`) **no son conceptos**: funcionan como disparadores léxicos. «súper», «hacer la compra» o «mercado» no los activan; el ejemplo del propio `placeholder` («cuando vuelvo de comprar…») tampoco.
- `rel_supermercado_carga_atencional` y `rel_no_puedo_pensar_baja_demanda` apuntan a conceptos sin fragmentos: **nunca pueden producir una respuesta**, porque `decideCore()` exige evidencia.
- `relation_type`, `strength` y `show_as_expansion` no se leen en ningún módulo.
- `rel_supermercado_decisiones` produce hoy la respuesta «Una posibilidad es que esto se relacione con…» para «en el supermercado me bloqueo»; con la petición práctica, la ficha de autismo (T-P5).

## 4. `actions.es.json`

- **Ninguna acción se representa en el panel**: `sabik-page.js` no lee `plan.actions`.
- `ver_fuente` referencia el concepto `fuente`, que no existe; el código la incluye siempre por su `id`, también en `accompaniment_presence`, que no tiene fuentes.
- `bajar_intensidad` promete «pasar a estado visual minimo»; el CSS mantiene el movimiento (V7-027).
- `ayuda_humana` promete «mostrar recursos aprobados» sin recursos; `requires_permission: true` no se consulta.
- `sabik_can` y `sabik_must_not` son texto sin tildes y no se usan para decidir nada.

## 5. `discriminating-questions.es.json`

- `q_durante_o_despues` exige `recuperacion_posterior`, concepto inexistente. `findDiscriminatingQuestion()` necesita ambos conceptos entre las posibilidades viables: **la decisión `ask` y el tipo `clarifying_question` son inalcanzables**.
- `contexts_allowed`, `risk_max` y `gender_neutral` no se leen.
- El texto carece de signos y tildes: «Te pesa mas mientras estas alli o sobre todo al volver?». **[E]** Corrección ortográfica antes de cualquier uso.

## 6. `procedures.es.json`

- `proc_demo_preparar_salida` es un **demo** (`id` y `source_fragment_id` con `demo`) marcado `PUBLICABLE` y con `reviewed_at`.
- `frag_demo_preparar_salida_001` no existe en el índice.
- El runtime no usa procedimientos. Por eso «necesito prepararme para ir al supermercado» toma los «pasos» de la ficha de autismo en vez de un procedimiento.
- **[E]** Retirar el demo o sustituirlo por procedimientos reales con fragmento de origen.

## 7. `human-resources.es.json`

Vacío. Ver `05-recursos-humanos-esquema.md`. Es un dataset **obligatorio de facto**: `loadData()` usa `Promise.all`, y si falla, Sabik no responde (UF1).

## 8. `iris-fragments-index.es.json`

- 4332 fragmentos, **todos `PUBLICABLE`**. El generador fija el valor para todo lo que no tenga marca de borrador o `noindex`. «Publicable» significa hoy «publicado», no «revisado para Sabik». **[E]** Decidir si hace falta una aprobación específica.
- **Sin anclas**: 0 URL con `#`. Todas las secciones de una página comparten URL, así que el enlace lleva al inicio de la ficha.
- 120 registros de investigación apuntan a `/es/investigacion/`. «¿Qué es el autismo?» cita primero un registro de investigación y enlaza al listado.
- 3639 de 3741 secciones incluyen el encabezado al principio del texto. De ahí salen frases como «Me ayuda Reducir preguntas…» y «Qué puede ayudar ahora Hacer la comida…».
- Etiquetado léxico: de 207 fragmentos con `decisiones`, 67 lo tienen solo por «elegir»; de 253 con `ruido`, 24 solo por «sonido». La ficha de pica tiene `riesgo_suicida`.
- Metadatos: `url_count = 471`, pero hay 472 URL distintas (los registros de investigación añaden una).
- 5 fragmentos miden exactamente 3000 caracteres. **[I]** Probablemente están truncados.
- El título es el mismo para 4 URL distintas en las descripciones meta.

## 9. `language-corpora.json`

`index_path` apunta a `assets/NEA/data/fragments-index.es.json`, que no existe. Nadie lo lee. `label` «Espanol» sin eñe.

## 10. Datos demostrativos tratados como producción

- `procedures.es.json` completo.
- `relations.es.json` y `concepts.es.json` tienen el tamaño de un ejemplo (4 y 6 registros) y están marcados `PUBLICABLE` sin revisión.
- `discriminating-questions.es.json` es un ejemplo con un concepto que no existe.

## 11. Propuestas

Todas **[P]**.

1. Un validador de datos en el build que falle si un ID referenciado no existe, si un dataset obligatorio está vacío, si hay `demo` en un registro `PUBLICABLE` o si un concepto no tiene evidencia.
2. Una única fuente de alias (el dataset), leída por el generador del índice.
3. Etiquetado editorial de secciones (ver `07-indice-funcional.md`), no por coincidencia de palabras.
4. Separar el encabezado del texto del fragmento en el generador.
5. Carga tolerante: los datasets opcionales pueden faltar sin romper Sabik; la capa de seguridad no depende de la red.
