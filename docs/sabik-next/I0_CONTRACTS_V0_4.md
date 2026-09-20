# I0 · CONTRATO DE SABIK WEB · V0.4

**Fecha:** 20/09/2026  
**Estado:** candidata contractual tras tercera revisión adversarial  
**Base protegida:** `sabik-preview@96ebf38a535fa287f32fee8c7957ede39933365c`  
**Sustituye para revisión:** `I0_CONTRACTS_V0_3.md`

## 0. Principios

- S0 sigue siendo la máquina de estado normativa.
- La seguridad se evalúa antes que la intención ordinaria.
- El Core no ejecuta DOM, JavaScript, URLs arbitrarias, SQL, comandos ni código generado.
- Las acciones son enums cerrados con parámetros discriminados.
- Las acciones con efecto externo no se ejecutan en I0.
- Texto, voz y B3 son capas separadas.
- I0/I1 no envían contenido conversacional fuera del navegador.
- El límite de entrada sigue S1: **2000 puntos de código Unicode antes de recortar espacios; exceso = rechazo, nunca truncado**.
- El Core natural-language de I0/I1 reconoce únicamente español; el idioma visual de la interfaz no cambia esa capacidad.

## 1. Cadena obligatoria

```text
SabikInput
  ↓
normalización segura
  ↓
Safety Gate
  ├─ normal → contexto pendiente → intención ordinaria
  └─ uncertain/risk/human_handoff
       → invalida pendientes ordinarios
       → conserva solo cláusula ordinaria separable, si existe
       → solicita evento S0
       → CERO acciones ordinarias en ese turno
  ↓
plan tipado
  ↓
política / riesgo / confirmación
  ↓
resultado + acciones + eventos S0
  ↓
adaptador valida, ordena eventos y ejecuta
```

### 1.1 Gate de seguridad

- El gate usa el corpus histórico de seguridad de PR #162 como regresión.
- La semántica ordinaria de negación de §8 no se aplica dentro del gate.
- El gate analiza todas las cláusulas relevantes; una negación previa no puede anular una señal explícita posterior.
- Al entrar en `uncertain`, `risk` o `human_handoff` se invalidan:
  - `pendingClarification`
  - `pendingConfirmation`
  - `optionsShown`
- El gate puede conservar únicamente una cláusula ordinaria **separable e independiente** en `safetyResume.ordinaryClauseText`.
- La frase de seguridad completa **no se vuelve a inyectar** en el pipeline ordinario.
- La respuesta usada para aclarar seguridad puede solicitar `RISK_CLEARED`, pero no ejecuta en ese mismo turno ninguna cláusula ordinaria adicional.
- Tras aceptar `RISK_CLEARED`:
  - si existe `safetyResume.ordinaryClauseText`, esa cláusula entra una sola vez en la fase **postSafetyResolved**, sin volver a pasar por el Safety Gate;
  - la fase postSafetyResolved solo admite el texto ordinario separado previamente por el gate;
  - si no existe cláusula ordinaria separable, se devuelve respuesta abierta sin acción;
  - el texto original de riesgo nunca se interpreta como `DETENER`, navegación, preferencia u otra acción ordinaria.
- `human_help` con `safety=normal` no emite `HUMAN_HANDOFF`.

## 2. Tipos S0 cerrados

```ts
type S0Operation =
  | "booting" | "ready" | "retrieving" | "composing"
  | "presenting" | "awaiting_clarification" | "paused" | "error";

type S0Safety = "normal" | "uncertain" | "risk" | "human_handoff";
type S0Speech = "silent" | "starting" | "speaking" | "paused" | "ended" | "error";
type S0Visibility = "expanded" | "collapsed" | "hidden";
type S0Motion = "off" | "ambient" | "processing" | "voice_reactive" | "protection_static";
type S0Dialogue =
  | "none" | "information" | "practical" | "clarification"
  | "accompaniment" | "correction" | "insufficient" | "human_handoff";
type S0Language = "es" | "en";

type CoreS0Event =
  | { type: "RISK_UNCERTAIN" }
  | { type: "RISK_CONFIRMED" }
  | { type: "RISK_CLEARED" }
  | { type: "HUMAN_HANDOFF" }
  | { type: "PAUSE_ASSISTANT" }
  | { type: "SPEECH_STOP" }
  | { type: "ASK_CLARIFICATION" };
```

`RESET_SESSION` y `RESUME_ASSISTANT` son controles de interfaz S1, no eventos emitidos por el Core de lenguaje natural en I0/I1.

## 3. Tipos funcionales cerrados

```ts
type Locale = "es" | "en";
type B3State = "PRESENTE" | "ORIENTAR" | "TRANSICIÓN" | "PAUSA" | "CONFIRMAR";
type RiskLevel = "local_reversible" | "local_with_loss" | "external_effect";

type IntentType =
  | "ENCONTRAR_CONTENIDO"
  | "ABRIR_CONTENIDO"
  | "CAMBIAR_TAMANO_TEXTO"
  | "CAMBIAR_MOVIMIENTO"
  | "CAMBIAR_PASO_A_PASO"
  | "CAMBIAR_VISTA_SENCILLA"
  | "CAMBIAR_DETALLES"
  | "SIGUIENTE"
  | "ATRAS"
  | "REPETIR_INDICACION"
  | "RESTABLECER_PREFERENCIAS"
  | "CONFIRMAR_ACCION"
  | "CANCELAR"
  | "DESHACER_ULTIMA_ACCION"
  | "RECHAZAR_RESULTADO"
  | "OTRA_VIA"
  | "DETENER"
  | "PEDIR_AYUDA_HUMANA";

type ResultKind =
  | "response" | "action_result" | "clarification"
  | "insufficient" | "human_help" | "out_of_scope";
```

## 4. SabikInput cerrado

```ts
type SabikPreferences = {
  textSize: "normal" | "large" | "xlarge";
  motion: "normal" | "reduced" | "none";
  stepByStep: boolean;
  simpleView: boolean;
  origin: {
    textSize: "user" | "system";
    motion: "user" | "system";
    stepByStep: "user";
    simpleView: "user";
  };
};

type SabikInput = {
  requestId: string;
  sessionId: string;
  locale: Locale;
  text: string;
  currentRoute: string;
  currentContentId?: string;
  nowMonotonicMs: number;
  s0: {
    operation: S0Operation;
    dialogue: S0Dialogue;
    safety: S0Safety;
    visibility: S0Visibility;
    speech: S0Speech;
    motion: S0Motion;
    language: S0Language;
    revision: number;
  };
  context: SessionContext;
  preferences: SabikPreferences;
};
```

Reglas:
- `nowMonotonicMs` procede de un reloj monotónico del adaptador; no de hora civil.
- `currentRoute` y `currentContentId` se validan contra el catálogo local.
- `locale` describe la interfaz, no la competencia lingüística del Core.

## 5. Parámetros discriminados

```ts
type IntentCommand =
  | { intent: "ENCONTRAR_CONTENIDO"; confidence: number; parameters: { query: string; mode: "list" | "locate" } }
  | { intent: "ABRIR_CONTENIDO"; confidence: number; parameters: { contentId: string } }
  | { intent: "CAMBIAR_TAMANO_TEXTO"; confidence: number; parameters: { size: "normal" | "large" | "xlarge" } }
  | { intent: "CAMBIAR_MOVIMIENTO"; confidence: number; parameters: { motion: "normal" | "reduced" | "none" } }
  | { intent: "CAMBIAR_PASO_A_PASO"; confidence: number; parameters: { enabled: boolean } }
  | { intent: "CAMBIAR_VISTA_SENCILLA"; confidence: number; parameters: { enabled: boolean } }
  | { intent: "CAMBIAR_DETALLES"; confidence: number; parameters: { contentId: string; expanded: boolean } }
  | { intent: "SIGUIENTE"; confidence: number; parameters: { scope: "step" } }
  | { intent: "ATRAS"; confidence: number; parameters: { scope: "step" | "page" } }
  | { intent: "REPETIR_INDICACION"; confidence: number; parameters: { contextId: string } }
  | { intent: "RESTABLECER_PREFERENCIAS"; confidence: number; parameters: { scope: "session" | "saved" | "all" } }
  | { intent: "CONFIRMAR_ACCION"; confidence: number; parameters: { confirmationId: string } }
  | { intent: "CANCELAR"; confidence: number; parameters: { target: "clarification" | "confirmation" | "current_request" } }
  | { intent: "DESHACER_ULTIMA_ACCION"; confidence: number; parameters: Record<string, never> }
  | { intent: "RECHAZAR_RESULTADO"; confidence: number; parameters: { resultId: string } }
  | { intent: "OTRA_VIA"; confidence: number; parameters: { query: string } }
  | { intent: "DETENER"; confidence: number; parameters: { target: "speech" | "assistant" } }
  | { intent: "PEDIR_AYUDA_HUMANA"; confidence: number; parameters: Record<string, never> };
```

No existe `ATRAS{undo}`.  
No existe `DETENER{step_by_step}`.

## 6. Acciones ejecutables y riesgo

```ts
type SabikAction =
  | { id: string; type: "SET_TEXT_SIZE"; parameters: { size: "normal" | "large" | "xlarge" }; risk: "local_reversible" }
  | { id: string; type: "SET_MOTION"; parameters: { motion: "normal" | "reduced" | "none" }; risk: "local_reversible" }
  | { id: string; type: "SET_STEP_BY_STEP"; parameters: { enabled: boolean }; risk: "local_reversible" }
  | { id: string; type: "SET_SIMPLE_VIEW"; parameters: { enabled: boolean }; risk: "local_reversible" }
  | { id: string; type: "SET_DETAILS"; parameters: { contentId: string; expanded: boolean }; risk: "local_reversible" }
  | { id: string; type: "STEP_NEXT"; parameters: { flowId: string }; risk: "local_reversible" }
  | { id: string; type: "STEP_BACK"; parameters: { flowId: string }; risk: "local_reversible" }
  | { id: string; type: "REPEAT_INSTRUCTION"; parameters: { contextId: string }; risk: "local_reversible" }
  | { id: string; type: "NAVIGATE_IRIS"; parameters: { contentId: string; route: string }; risk: "local_with_loss" }
  | { id: string; type: "RESET_PREFERENCES"; parameters: { scope: "session" | "saved" | "all"; namedEffects: string[] }; risk: "local_with_loss" }
  | { id: string; type: "RESTORE_PREVIOUS_STATE"; parameters: { actionId: string }; risk: "local_reversible" };
```

### 6.1 Tabla intención → riesgo

| Intención | Riesgo |
|---|---|
| ENCONTRAR_CONTENIDO | sin efecto |
| ABRIR_CONTENIDO / ATRAS(page) | local_with_loss |
| CAMBIAR_* | local_reversible |
| SIGUIENTE / ATRAS(step) | local_reversible |
| REPETIR_INDICACION | local_reversible |
| RESTABLECER(session) | local_reversible |
| RESTABLECER(saved/all) | local_with_loss |
| DESHACER | riesgo de la inversa |
| DETENER(speech/assistant) | local_reversible |
| acciones externas futuras | external_effect |

## 7. Contexto de sesión

```ts
type ShownOption = { slot: number; contentId: string; route: string; title: string };
type SourceRef = { contentId: string; route: string; title: string };

type ClarificationCandidate = {
  slot: number;
  label: string;
  resolvesTo: IntentCommand;
};

type PendingClarification = {
  id: string;
  kind: "choose_content" | "choose_back_scope" | "choose_stop_target" | "choose_reset_scope" | "resolve_conflict";
  candidates: ClarificationCandidate[];
};

type PendingConfirmation = {
  id: string;
  action: SabikAction;
  parameterHash: string;
  sessionId: string;
  expiresAtMonotonicMs: number;
};

type LastAction = {
  action: SabikAction;
  inverse?: SabikAction;
  originRoute: string;
};

type SafetyResumeContext = {
  sourceRequestId: string;
  ordinaryClauseText?: string;
  resolved: boolean;
};

type SessionContext = {
  lastResultId?: string;
  lastSources: SourceRef[];
  lastQuery?: string;
  optionsShown: ShownOption[];
  excludedContentIds: string[];
  pendingClarification?: PendingClarification;
  pendingConfirmation?: PendingConfirmation;
  lastAction?: LastAction;
  safetyResume?: SafetyResumeContext;
  activeFlow?: "none" | "step_by_step";
  currentStep?: number;
  totalSteps?: number;
};
```

Reglas:
- una lista nueva sustituye `optionsShown` y reinicia slots desde 1;
- una respuesta única actualiza `lastSources`;
- `OTRA_VIA` mantiene el mismo `lastQuery` y añade descartes a `excludedContentIds`;
- un `ENCONTRAR_CONTENIDO` con query normalizada distinta de `lastQuery` vacía `excludedContentIds`;
- navegación y RESET eliminan `lastAction`;
- RESET invalida pendientes, opciones, fuentes, descartes y contexto de seguridad; conserva preferencias S1.

## 8. Negación y cese

Estas reglas operan solo después del Safety Gate.

- Negación del verbo → no acción + acuse.
- Negación inequívoca de parámetro → complemento.
- Exclusión `pero no...` prevalece.
- Contradicción → una aclaración.
- Corrección clara sustituye objetivo anterior.

### 8.1 Actividades en curso

Orden de resolución para expresiones `para/deja de`, aplicando exclusiones explícitas:

1. `speech` en `starting|speaking|paused` → `DETENER{speech}`.
2. si el texto nombra explícitamente a Sabik/asistente → `DETENER{assistant}`.
3. `activeFlow=step_by_step` y el texto se refiere al flujo → `CAMBIAR_PASO_A_PASO{false}`.
4. petición ordinaria en curso sin target inequívoco → una aclaración; no se cancela por inferencia.
5. ninguna actividad compatible → no acción.

Ejemplo:
- «Para, pero no el asistente», speech activo → detener speech.
- misma frase, speech inactivo y paso a paso activo → desactivar paso a paso.
- sin actividad compatible → no acción.

## 9. Planes multiacción

- máximo 3 comandos;
- confianza por comando;
- reversibles claros e independientes pueden ejecutarse aunque otro comando solo liste/aclare;
- with_loss/external no se ejecutan parcialmente con aclaración pendiente;
- navegación siempre se ordena al final;
- si una preferencia del mismo plan es solo de sesión y la navegación la destruirá, el resultado lo avisa **antes** de navegar;
- acciones dependientes de una acción ambigua no se ejecutan.

## 10. Umbrales provisionales

### local_reversible
- ejecutar: `>=0.90` y margen `>=0.15`;
- aclarar: `0.70–0.89` o margen `<0.15`;
- abstener: `<0.70`.

### local_with_loss
- ejecución directa: solicitud inequívoca, sin texto no enviado ni aclaración pendiente, `>=0.97`, margen `>=0.20`;
- con texto no enviado, aclaración pendiente o pérdida no solicitada → confirmar;
- si no alcanza umbral → aclarar/abstener.

### elección explícita de candidato
Elegir un `ClarificationCandidate` por slot o etiqueta equivale a solicitud inequívoca:
- no se reaplica el umbral de intención;
- si su acción es with_loss, solo se confirma por pérdida real (por ejemplo texto no enviado), no por baja confianza.

Los números siguen provisionales hasta #173.

## 11. Confirmación

- reversible: nunca;
- with_loss: según pérdida real;
- external_effect: siempre.

Confirmación:
- reloj monotónico;
- se elimina al usarse;
- safety la invalida;
- confirmación caducada se rechaza.

## 12. Idioma

No se usa `locale` para inferir el idioma del texto.

I0/I1:
- el parser intenta únicamente patrones/corpus españoles;
- si una frase coincide con el contrato español, se procesa aunque `locale=en`;
- si no alcanza confianza suficiente, se devuelve `out_of_scope`;
- con interfaz EN, el mensaje añade el aviso S1: `Answers and source titles are currently available in Spanish.`;
- no existe clasificador general de idioma en I0/I1.

## 13. Preferencias guardadas · mapeo exacto

Almacén existente: `window.IGPreferences`, clave `ig-a11y`, versión 2.

### Tamaño Sabik → IGPreferences

| Sabik | IGPreferences.scale |
|---|---:|
| normal | 1 |
| large | 1.3 |
| xlarge | 1.5 |

El valor 1.15 puede existir por el panel de Lectura; Sabik lo respeta, pero no lo selecciona directamente.

### Movimiento

| Sabik | Persistencia |
|---|---|
| normal | `IGPreferences.update({motion:false})`; siempre se respeta `prefers-reduced-motion` del sistema |
| reduced | `IGPreferences.update({motion:true})` |
| none | **sesión solamente** en I0/I1; `scope=saved` devuelve no-op explícito |

`origin=system` se refleja desde `IGPreferences.system().reducedMotion`; nunca se escribe como preferencia de la persona.

### Paso a paso y Vista sencilla

No existen hoy en `IGPreferences`:
- son de sesión en I0/I1;
- petición de guardarlas → no-op explícito + explicación;
- no se crea una segunda clave localStorage.

### Restablecer

**Nunca llamar `IGPreferences.reset()` desde Sabik I0/I1.**

Sabik solo restablece las claves que gestiona:
- `scale → 1`
- `motion → false`
- preferencias de sesión Sabik → defaults.

No toca:
- contrast;
- spacing;
- guide;
- controls;
- ajustes tipográficos finos.

`scope=saved` nombra explícitamente los efectos: «tamaño de texto y movimiento guardados».  
`scope=all` = sesión Sabik + esas dos preferencias guardadas; no significa «todas las preferencias de Lectura».

## 14. Recursos humanos

- `PEDIR_AYUDA_HUMANA` con safety normal busca recursos verificados sin HUMAN_HANDOFF.
- safety flow puede emitir HUMAN_HANDOFF según S0.
- offline exige recurso verificado o `approvedHumanHelpFallback`.
- sin artefacto, función declarada no disponible / insufficient.
- no inventar teléfono, URL, territorio ni texto clínico.

## 15. Orden de eventos S0

El adaptador es responsable de no dejar eventos operativos tardíos.

### 15.1 Ciclo ordinario de texto

Para una consulta ordinaria:
`SUBMIT → RETRIEVAL_OK/EMPTY → RESPONSE_READY/ASK_CLARIFICATION`.

### 15.2 Eventos de control posteriores

Para acciones como `DETENER{assistant}`:
1. completar el ciclo ordinario hasta el acuse visible;
2. invalidar cualquier trabajo tardío de ese requestId;
3. despachar `PAUSE_ASSISTANT`;
4. ningún `RETRIEVAL_OK`/resultado tardío del mismo request puede ejecutarse después.

### 15.3 SPEECH_STOP

Si `speech` está activo y el texto ordena detener lectura:
1. el adaptador clasifica el control local antes de iniciar efectos asíncronos;
2. despacha `SPEECH_STOP` mientras S0 todavía admite el evento;
3. después ejecuta el ciclo textual necesario para mostrar el acuse;
4. el motor de TTS se cancela como efecto del cambio de S0.

### 15.4 Safety

Un submit puede entrar en safety; los eventos safety prevalecen sobre cualquier acción ordinaria. El requestId invalida resultados ordinarios tardíos.

## 16. Salida

```ts
type SabikResult = {
  kind: ResultKind;
  text: string;
  sources: SourceRef[];
  actions: SabikAction[];
  s0Events: CoreS0Event[];
  continuation?: { type: "POST_SAFETY_RESOLVED"; sourceRequestId: string };
  b3: B3State;
};
```

## 17. Presentación

Aplicar `I0_PRESENTATION_EFFECTS_V0_1.md`.

Vista sencilla nunca oculta explicación principal, acción necesaria, error, seguridad, navegación, controles esenciales ni fuentes necesarias.

## 18. Privacidad

Aplicar `I0_PRIVACY_NETWORK_OFFLINE_V0_2.md`.

El índice no debe particionarse con paths temáticos sensibles identificables.

## 19. Cierre I0

I0 solo puede cerrarse cuando:
1. v0.4 sea declarada aprobable por revisión independiente;
2. corpus #173 esté alineado con v0.4;
3. umbrales calibrados;
4. verificación S0/S1;
5. human-help offline tenga artefacto aprobado o quede declarado no disponible;
6. producción/main/Netlify/S2 sigan intactos.
