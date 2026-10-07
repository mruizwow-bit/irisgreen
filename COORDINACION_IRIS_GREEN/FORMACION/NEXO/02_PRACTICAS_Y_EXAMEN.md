# NEXO · PRÁCTICAS Y EXAMEN

Fecha: 30/09/2026  
Issue: #350  
Estado: `NEXO_PRACTICE_EXAM_R01`

## Propósito

La formación de Nexo no se considera suficiente si solo puede repetir conceptos.

Debe poder convertirlos en decisiones operativas reproducibles.

---

## Práctica 1 · Servicio degradado sin caída total

Escenario:

Sabik responde, pero aumenta la latencia y algunas herramientas fallan.

Nexo debe:

1. distinguir disponibilidad de calidad;
2. identificar SLI afectados;
3. delimitar usuarios/rutas impactadas;
4. pedir correlación de trazas/métricas/logs;
5. revisar cambios recientes;
6. identificar dependencia degradada;
7. definir contención/fallback;
8. comprobar que la recuperación es visible para el usuario.

PASS:

no declara “servicio sano” solo porque HTTP responde.

---

## Práctica 2 · Provider de IA no disponible

Escenario:

el provider principal deja de responder o impone rate limits.

Nexo debe coordinar:

- Córtex: provider/model/fallback;
- Pulso: comportamiento conversacional;
- Vigía: evidencia, telemetría e impacto;
- Astra: cambio arquitectónico si procede;
- Vector: release si requiere modificación desplegable.

PASS:

la respuesta de continuidad preserva seguridad, experiencia y trazabilidad.

FAIL:

cambiar provider/model improvisadamente sin control de versión, evals o evidencia.

---

## Práctica 3 · Telemetría con información sensible

Escenario:

un trace contiene datos que no deberían conservarse.

Nexo debe:

1. contener exposición;
2. preservar evidencia mínima necesaria;
3. involucrar a Vigía;
4. escalar a Lex si puede existir obligación jurídica;
5. evitar copiar datos sensibles en más sistemas;
6. corregir pipeline/instrumentación;
7. verificar que la observabilidad sigue siendo útil tras la minimización.

PASS:

no sacrifica privacidad por debugging.

---

## Práctica 4 · PASS aislados / integración FAIL

Escenario:

Pulso PASS, Córtex PASS y Vigía PASS por separado; conversación real falla.

Nexo debe investigar interfaces:

- request/response contract;
- context propagation;
- auth;
- timeout/retry;
- tool routing;
- IDs/correlation;
- version mismatch;
- data shape;
- ordering/race;
- fallback.

PASS:

el gate final exige evidencia end-to-end.

---

## Práctica 5 · Recuperación desde nuevo chat

Escenario:

este chat desaparece.

Un nuevo Nexo debe poder localizar:

- puesto;
- equipo;
- límites;
- issue;
- rama;
- formación;
- runbook;
- fuentes;
- estado;
- último aprendizaje.

PASS:

puede retomar sin pedir a María una reconstrucción manual.

---

# Examen de preparación

## Pregunta 1

¿Fiabilidad = 100 % de disponibilidad?

**Respuesta esperada:** no. La fiabilidad se define respecto de expectativas/objetivos del servicio y puede incorporar disponibilidad, latencia, calidad y otros SLI. Un objetivo irreal de 100 % puede bloquear cambio sin beneficio real.

## Pregunta 2

¿Qué diferencia hay entre SLI y SLO?

**Respuesta esperada:** SLI = indicador medido; SLO = objetivo acordado para ese indicador.

## Pregunta 3

¿Un error budget autoriza fallos deliberados?

**Respuesta esperada:** no. Es un mecanismo para cuantificar tolerancia al incumplimiento del SLO y equilibrar riesgo/cambio.

## Pregunta 4

¿Qué se hace primero en un incidente?

**Respuesta esperada:** proteger usuarios/sistema y contener impacto; investigación completa de causa puede continuar después.

## Pregunta 5

¿Observabilidad significa guardar todos los datos posibles?

**Respuesta esperada:** no. Debe aportar señales diagnósticas suficientes con minimización y controles de seguridad/privacidad.

## Pregunta 6

¿Puede Nexo aprobar arquitectura?

**Respuesta esperada:** no por sustitución de Astra. Puede detectar riesgo, aportar evidencia y coordinar continuidad.

## Pregunta 7

¿Puede Nexo ejecutar el trabajo de Córtex cuando Córtex está bloqueado?

**Respuesta esperada:** no por defecto. Debe desbloquear, delegar, coordinar o escalar. El rescate recurrente destruye especialización y crea dependencia.

## Pregunta 8

¿Qué prueba que un incidente está recuperado?

**Respuesta esperada:** evidencia del comportamiento real del sistema/usuario, no solo desaparición de una alerta.

## Pregunta 9

¿Por qué importa el blast radius?

**Respuesta esperada:** permite dimensionar exposición, contener, priorizar y evitar expandir el fallo durante mitigación.

## Pregunta 10

¿Qué diferencia existe entre continuidad y backup?

**Respuesta esperada:** backup es solo una capacidad. Continuidad abarca prioridad de servicios, personas, conocimiento, dependencias, comunicación, recuperación y pruebas.

---

## Resultado R01

Foundation considerada suficiente para iniciar actividad profesional supervisada dentro del mandato de Iris Green.

No equivale a certificación externa.

La competencia se mantiene mediante:
- práctica;
- incident review;
- actualización de fuentes;
- simulaciones;
- revisión del runbook.


## Práctica 6 · Transferencia y autorrevisión de Descubrimiento · 2026-10-06

Referencia: [formación aplicada R03](07_FORMACION_APLICADA_R03_20261006.md). Ejercicio propio: Fósiles con 14 assets existentes. Resultado real: SELF_REVIEW_REWORK_REQUIRED, no examen aprobado.

Aprendizajes comprobados: siete comportamientos problemáticos reproducidos; anclajes anatómicos genéricos detectados; el banco inicial demostraba finalización pero no coherencia de cada gesto.

Para la siguiente revisión, una vez recibidas las respuestas independientes:
1. Explicar cada acción: intención, entrada, estado, consecuencia y contexto conservado.
2. Probar que el objetivo visible y el punto seleccionado coinciden con la acción.
3. Probar una única decisión de preparación para botón, examen y mensaje.
4. Revisar anclajes individualmente; un asset intacto no valida etiquetas nuevas.
5. Usar un contraejemplo que falle con la R01; no cambiar la aserción para obtener verde.
6. Separar evidencia estática, fixture, navegador y observación de producto.
7. Valorar repetición y encontrabilidad en caparazón, espina y ala, sin convertir la experiencia en test escolar.

Ejercicios de giro a distintas tasas, cancelación asíncrona, foco y reflow definidos en R03 siguen pendientes cuando no hay ejecución registrada. No dar por realizados ejercicios por haber escrito su procedimiento.


## Prácticas7–14 · Transferencia R04 · 2026-10-06
Estado inicial de TODAS: PENDIENTE_DE_EJECUCIÓN_Y_REVISIÓN. Los fallos de origen sí tienen reproducciones; eso no aprueba la corrección futura.

| Práctica | Trabajo y contraejemplo | Criterio de salida y método |
|---|---|---|
| 7 · Evidencia semántica | Cinturón1/3,2/3,3/3; hacha cola sin tronco; fósil con losa despejada pero rasgo oculto | Predicado único y mínimo propio por patrón; marcadores/mensaje usan lo visible. Motor + captura del estado + revisión humana. |
| 8 · Intención | Clic sobre objeto pequeño junto a grande; elección explícita, candidato que desaparece | Caso fijado antes del resultado, sin buscar encuadre ganador. Elegido/foco/contexto coherentes por ratón y teclado real. |
| 9 · Tiempo y gesto | Cambiar perfiles en fase avanzada; seguir un periodo; pinch→un dedo; cancelar | Centro/pose/fase/cámara continuos, velocidad coherente a tiempos iguales; fixtures primero y teléfono real para gesto. |
| 10 · Asíncronía y restore | FichasA/B con llegada invertida, cerrar mientras carga, recargar tras pan, save malformado | Ninguna respuesta vieja reaparece; estado persistido válido; carga fallida conserva partida. Navegador con retrasos controlados. |
| 11 · Construcción útil | Dos puentes/refugios válidos, retirar apoyo, deshacer con Vera encima; colocar/quitar para engañar contador | La obra abre acceso y puede usarse; no éxito con parcela vacía; invariantes de personaje/inventario/ocupación. Partida real y fixtures. |
| 12 · Vera | Idle/caminar/correr/girar/recoger/escalera con los clips reales | Identidad, escala, bucles, pies y root motion coherentes. Reproducción visual; no PASS por nombresFBX. |
| 13 · Web completa | Seis áreas, home con imágenes, rutas, reset de vacío, cambio ES/EN y texto200% con panel abierto | Mandato de rediseño cumplido, sin Intereses/Taller duplicados ni rutinas sustituyendo Juegos; browser/layout + HUMAN QA. |
| 14 · Mundo y percepción | Microescena con tres consecuencias diferentes; NONE equivalente; escucha de media exacta cuando corresponda | María entiende qué hacer y cómo continuar; nota diferencias sin presión. Registrar observaciones sin inventar aprobación o preferencias universales. |

Para cada ejercicio entregar: base/hash, hipótesis, caso negativo, resultado esperado, resultado observado, método, límite y siguiente decisión. Sólo pruebas relevantes al riesgo; no una batería ornamental.
Pregunta de transferencia: explicar cómo un fallo propio de Fósiles anticipa un fallo de Cielo o Peces y demostrar la prevención en código. Repetir el concepto no es suficiente.
Evaluación independiente: Axioma/Prisma según encargo y María para HUMAN QA; esta formación no les atribuye revisión ya realizada.


## Prácticas15–20 · R05 · 2026-10-07
Estado inicial: PENDIENTE salvo reproducciones ya documentadas. No aprobar por escribir el procedimiento.

| Práctica | Caso | PASS |
|---|---|---|
| 15 · Oracle no vacío | Diseñar prueba de selección/histéresis donde el estado de dos candidatos deba ocurrir | La prueba falla si 0 casos alcanzan la precondición; fixture y caso real se etiquetan por separado. |
| 16 · Evidencia visible | Introducir punto semántico no renderizado en patrón/objeto | Nunca cuenta para mínimo, overlay o mensaje; mismo conjunto observable en render/hit/reveal. |
| 17 · Schema futuro | Cargar save con versión mayor y usar la app | Bytes intactos tras mover/editar/cambiar idioma; sin falso “guardado”. |
| 18 · Dirección 3D | Comparar una tarea espacial y una no espacial | Justificar 3D sólo cuando mejora orientación/volumen/física; no imponerlo a documento/timeline. |
| 19 · Gameplay profundo | Vertical slice con dos estrategias y consecuencia visible | No checklist prescrita; dos soluciones reales; mundo cambia y puede corregirse. |
| 20 · Creación por consecuencia | Uno de los cinco slices Creación | Sin manual previo: primera acción autónoma, consecuencia entendida, segunda modificación, artefacto real y paso a libre en mismo proyecto. |

Pregunta de examen R05: explicar con un ejemplo por qué PRODUCT_DIRECTION_SELECTED no equivale a FULL_PRODUCT_PASS y qué gates permanecen abiertos.
