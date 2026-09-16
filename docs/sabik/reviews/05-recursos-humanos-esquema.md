# 05 · Recursos humanos · esquema editorial

Fixtures: `tests/fixtures/sabik/review/human-resource.schema.json` y `human-resources.candidates.es.json`.
Leyenda en `00-resumen-y-bloqueantes.md`.

## 1. Situación actual

- **[H]** `sabik/assets/NEA/data/human-resources.es.json` es `[]`.
- **[H]** El runtime lo carga en `loadData()` y no lo usa. Si la carga falla, Sabik entero falla (UF1).
- **[H]** La acción `ayuda_humana` promete «mostrar recursos aprobados» y el panel no representa acciones.
- **[H]** Iris Green sí publica información de recursos en su contenido editorial: la ficha `/es/biblioteca/crisis-de-ansiedad-panico-y-salud-mental-que-hacer-y-donde-pedir-ayuda`, sección «Riesgo suicida», menciona el 024 y las emergencias vitales. **[I]** Esa ficha es la fuente editorial de Iris, no la fuente oficial del recurso.

## 2. Esquema propuesto

**[P]** Un registro por recurso y territorio. Campos pedidos por la orden, más los mínimos para gobernar caducidad y avisos.

| Campo | Tipo | Obligatorio para publicar | Notas |
|---|---|---|---|
| `id` | `hr_[a-z0-9_]+` | sí | Estable; no se reutiliza. |
| `territorio` | `{ambito, codigo, nombre_visible}` | sí | `codigo` ISO 3166-1/3166-2 (`ES`, `ES-AN`). |
| `idioma` | lista BCP 47 | sí | Idiomas en que **atiende** el servicio. |
| `tipo_de_recurso` | enum | sí | `emergencias`, `linea_crisis_suicidio`, `linea_apoyo_emocional`, `servicio_sanitario`, `servicio_social`, `asociacion`, `informacion_administrativa`. |
| `nombre` | texto | sí | Tal como lo nombra la fuente oficial. |
| `finalidad` | texto | sí | Para qué sirve, según la fuente oficial. |
| `telefono` | dígitos, espacios, `+` o `null` | **sí para emergencias y crisis**; en los demás, teléfono **o** URL | |
| `url` | `https://` o `null` | teléfono **o** URL | |
| `canales_adicionales` | lista | no | Chat, SMS, texto para personas sordas. |
| `disponibilidad` | `{modo, horario_texto, gratuito, confidencial}` | sí; `modo=24h` para emergencias y crisis | `null` en `gratuito` o `confidencial` si no está verificado. |
| `fuente_oficial` | `{url, organismo, titulo}` | sí | Página del organismo responsable, no de terceros. |
| `fecha_verificacion` | fecha | sí | |
| `verificado_por` | texto | sí | Rol editorial; nunca un agente automático. |
| `caduca_en_dias` | entero | no (90 por defecto) | |
| `prioridad_por_nivel` | mapa nivel → orden | no | Niveles de `04-seguridad-conversacional.md`. |
| `editorial_status` | `BORRADOR`, `PENDIENTE_VERIFICACION`, `PUBLICABLE`, `CADUCADO`, `RETIRADO` | `PUBLICABLE` | |
| `texto_visible` | 5–180 caracteres | sí | Frase aprobada que Sabik muestra tal cual. Sin consejo clínico. |
| `condiciones_de_uso` | lista | sí | Niveles o situaciones en que se muestra. |
| `advertencia` | texto | obligatorio si no es `PUBLICABLE` | `⚠ COMPROBAR — NO PUBLICAR`. |
| `campos_sin_verificar` | lista | debe estar vacía para publicar | |

El JSON Schema aplica estas reglas **[H, verificado con `jsonschema`]**. Los dos candidatos validan como `PENDIENTE_VERIFICACION` y fallan si se marcan `PUBLICABLE`, porque faltan `fecha_verificacion`, `verificado_por` y la lista de campos sin verificar no está vacía.

**[P]** Un recurso se considera **vigente** si es `PUBLICABLE` y `fecha_verificacion + caduca_en_dias` no ha pasado. La vigencia se calcula al construir el sitio, no en el navegador, para que la máquina de estados siga sin reloj.

## 3. Comportamiento de Sabik ante huecos

Todas **[P]**. En ningún caso Sabik inventa, completa ni deduce un dato.

| Situación | Conducta propuesta |
|---|---|
| **No conoce el territorio** | Muestra el recurso vigente de ámbito estatal del idioma de la página y una frase aprobada que diga que existen recursos locales. No pregunta la ubicación durante `riesgo_inmediato`. En otros niveles puede ofrecer elegir territorio sin obligar. |
| **El recurso ha caducado** | No se muestra. Se usa el siguiente recurso vigente del mismo tipo y nivel. Si no queda ninguno, se aplica «no hay recurso aprobado». El build registra la caducidad como aviso editorial. |
| **Falta un número** | Un recurso de `emergencias` o `linea_crisis_suicidio` sin teléfono no es publicable (el esquema lo impide). En otros tipos, se muestra con su URL. |
| **Solo existe una URL** | Se muestra como enlace con `texto_visible`; nunca como único recurso de `riesgo_inmediato`. |
| **El dataset no carga** | La capa de seguridad usa el recurso mínimo embebido en el código (versionado y revisado con el mismo esquema). El resto de Sabik indica un error técnico sin mensajes internos, y la navegación convencional sigue disponible. Un fallo de este dataset no debe impedir la búsqueda normal, ni al revés. |
| **No hay recurso aprobado** | Texto aprobado sin número, enlace a la página de ayuda publicada de Iris Green y conversación abierta. Sabik no dice «llama a emergencias» sin un número verificado para el territorio. |

## 4. Candidatos incluidos

`human-resources.candidates.es.json` contiene dos registros en `PENDIENTE_VERIFICACION`. Todos sus textos visibles son `⚠ COMPROBAR — NO PUBLICAR`:

- `hr_es_emergencias_112` · ⚠ COMPROBAR — NO PUBLICAR
- `hr_es_linea_024` · ⚠ COMPROBAR — NO PUBLICAR

Sus números proceden de conocimiento general y de la ficha de Iris Green citada arriba; **no se han contrastado con la fuente oficial en esta revisión**. `fuente_oficial.url` apunta a un dominio reservado `.invalid` para que no pueda confundirse con una fuente real. Gratuidad, confidencialidad e idiomas quedan en `null`.

## 5. Datos que no pueden inventarse

Deben verificarse contra fuente oficial antes de integrarse (requisito de #147):

- teléfonos, extensiones y prefijos;
- URL de servicios y de fuentes oficiales;
- organismo responsable;
- territorio de cobertura;
- horario y disponibilidad 24 h;
- gratuidad y confidencialidad;
- idiomas y canales accesibles (por ejemplo, para personas sordas);
- fecha de verificación y persona que verifica;
- importes, plazos y requisitos de ayudas;
- nombres de asociaciones y su ámbito;
- texto visible del recurso.

## 6. Decisiones editoriales pendientes

- **[E]** Organismo y página oficial de referencia para cada recurso.
- **[E]** Periodo de caducidad.
- **[E]** Territorio por defecto y si se ofrece selector.
- **[E]** Recurso mínimo embebido y su texto.
- **[E]** Si se incluyen recursos no urgentes (apoyo emocional, asociaciones) y con qué criterio de selección.
