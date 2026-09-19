# 07 · Índice funcional

Fixture: `tests/fixtures/sabik/review/functional-unit.schema.json`.
Base: `sabik-preview` @ `efa4ed9`. Leyenda en `00-resumen-y-bloqueantes.md`.

## 1. El problema

El índice actual sabe **qué palabras** tiene cada fragmento, pero no **para qué sirve**. Compartir vocabulario no equivale a responder a la intención.

| Consulta | Intención | Resultado actual **[H]** | Por qué falla |
|---|---|---|---|
| «¿Necesitaría un psicólogo?» | Saber cuándo conviene pedir ayuda profesional y cómo acceder, sin que Sabik decida por la persona | `insufficient_information` (F-01) | «psicólogo» no es un concepto y ningún fragmento está marcado con esa intención, aunque existen **187** secciones «Cuándo pedir ayuda profesional». |
| «¿Cómo pido cita?» | Pasos para pedir cita en un servicio concreto | «Esta ficha parte de la situación cotidiana «Hacer una llamada para pedir una cita se me hace enorme».» (F-02) | Coincide con el título y devuelve la frase meta de la descripción, no los pasos. Falta el servicio. |
| «¿Dónde solicito esta ayuda?» | Organismo o canal para solicitar una ayuda ya mencionada | Ficha de crisis de ansiedad: «Me ayuda Reducir preguntas…» (F-03) | «ayuda» coincide con el encabezado «Me ayuda» (415 secciones); «esta» no tiene referente. |
| «¿Qué puedo hacer ahora?» | Acción inmediata sobre el tema en curso | Ficha de temperaturas de la comida: «Qué puede ayudar ahora…» (F-04) | Coincide con uno de los **187** encabezados «Qué puede ayudar ahora»; sin concepto, la elección es arbitraria. |

**[H]** Las fichas siguen plantillas: «Esto me cuesta», «Me ayuda» y «Necesito» (415 cada una); «Qué puede ayudar ahora», «Cuándo pedir ayuda profesional», «Qué conviene evitar» (187 cada una). El encabezado ya es un **marcador funcional editorial**, pero el índice lo usa como texto.

**[H]** Las secciones «Necesito» son enunciados en primera persona dirigidos a quien acompaña («Necesito Elegir contigo mis apoyos»). Usarlas como pasos prácticos produce T-P5.

**[I]** Ajustar pesos o umbrales no resuelve esto. Un peso mayor para títulos empeora F-02; uno menor para encabezados rompe «¿Qué es la dislexia?», que hoy funciona. La orden de #147 lo excluye expresamente.

## 2. Unidad recuperable

| Opción | Ventajas | Riesgos | Requisitos |
|---|---|---|---|
| **Página completa** | Enlace estable; contexto completo; sin trabajo de anclas | Respuesta genérica; varias intenciones en una unidad; no puede citar «la parte que responde»; el texto mostrado sigue saliendo de una sección | Título legible por página |
| **Sección con ancla estable** | Coincide con la plantilla editorial; enlace directo a lo que responde; intención heredable del tipo de encabezado; se puede citar una sección y enlazar su página | Hoy no hay anclas (22 de 5327 encabezados h2/h3 tienen `id`); cambiar un encabezado rompe enlaces; secciones cortas sin contexto | `id` estable generado en el build y congelado; título de página + encabezado como título legible; separar encabezado y texto; prueba que falle si un ancla publicada desaparece |
| **Fragmento editorial** | Control total del texto; intención y límites explícitos; ideal para seguridad y trámites | Coste editorial alto; riesgo de divergir de la ficha publicada; duplicación | Flujo de revisión, fecha de verificación y enlace a la sección de origen |

**Recomendación [P].** Sección con ancla estable como unidad por defecto, con metadatos funcionales. Fragmentos editoriales solo para casos de alto riesgo o alta precisión (recursos humanos, procedimientos de trámite), siempre enlazados a una sección publicada. La página completa queda solo como destino del enlace.

## 3. Campos funcionales mínimos

Definidos en `functional-unit.schema.json` **[P]**:

| Campo | Contenido |
|---|---|
| `concepto` | IDs existentes en `concepts.<idioma>.json`, asignados editorialmente |
| `intenciones` | `informacion`, `situacion_personal`, `peticion_practica`, `acompanamiento`, `donde_solicitar`, `como_pedir_cita`, `cuando_pedir_ayuda_profesional`, `que_hacer_ahora`, `derechos`, `requisitos` |
| `objetivos` | Qué consigue la persona con la sección |
| `prioridad` | 1–5 entre unidades con el mismo concepto e intención |
| `sabik_puede` | Acciones permitidas con esta unidad |
| `sabik_no_debe` | Siempre incluye «diagnosticar» y «decidir por la persona» |
| `recurso_humano` | IDs `hr_*` vigentes |
| `territorio` | Códigos ISO o `general` |
| `fecha_verificacion` | Obligatoria si hay datos operativos |
| `editorial_status` | Mismo ciclo que los recursos humanos |
| `url` | Página publicada |
| `ancla` | `id` estable del encabezado |
| `titulo_legible` | Título de página + encabezado |
| `tipo_de_fuente` | `ficha_situacion`, `ficha_condicion`, `ficha_biblioteca`, `procedimiento`, `registro_investigacion`, `directorio_tramites`, `pagina_institucional` |

Opcionales: `texto_fragmento` (sin encabezado) y `requiere_contexto` (`territorio`, `servicio`, `ayuda_concreta`, `edad`).

Reglas del esquema:
- Una `ficha_condicion` no puede declarar `que_hacer_ahora` ni `peticion_practica`. Evita T-P5.
- Las intenciones `donde_solicitar` y `como_pedir_cita` exigen `requiere_contexto`. Si falta ese dato, Sabik pregunta.

## 4. Aplicación a los cuatro casos

Todas **[P]**, sujetas a contenido aprobado **[E]**.

- **«¿Necesitaría un psicólogo?»** → unidades `cuando_pedir_ayuda_profesional` del concepto activo o, sin concepto, una unidad general. Sabik no responde sí o no. Muestra los criterios publicados y el acceso (`recurso_humano`).
- **«¿Cómo pido cita?»** → `como_pedir_cita` con `requiere_contexto: [servicio, territorio]`. Sin servicio, una pregunta.
- **«¿Dónde solicito esta ayuda?»** → resuelve «esta ayuda» con el concepto activo de la sesión. Sin referente, una pregunta. Con referente, `donde_solicitar` + territorio.
- **«¿Qué puedo hacer ahora?»** → `que_hacer_ahora` del concepto activo. Sin concepto activo, una pregunta, no una ficha al azar.

## 5. Requisitos para implantarlo

1. Anclas estables en las plantillas de ficha, generadas en el build y registradas para detectar roturas.
2. Mapa editorial de encabezados de plantilla → intención («Cuándo pedir ayuda profesional» → `cuando_pedir_ayuda_profesional`, «Qué puede ayudar ahora» → `que_hacer_ahora`; «Necesito» → ninguna intención práctica).
3. Etiquetado de concepto editorial por página, heredado por sus secciones, en lugar de alias léxicos.
4. Resolución de referentes con el concepto activo de la sesión.
5. Pruebas con `CONV-FUNC-001` y `CONV-PRAC-*` del corpus.

## 6. Decisiones editoriales pendientes

- **[E]** Lista cerrada de intenciones.
- **[E]** Qué plantillas y encabezados se consideran estables.
- **[E]** Contenido aprobado para «cuándo pedir ayuda profesional» cuando no hay concepto.
- **[E]** Si los registros de investigación son recuperables por Sabik o solo enlazables.
