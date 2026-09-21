# I0 · CONTRATO DE SABIK WEB · V0.3

**Fecha:** 20/09/2026  
**Estado:** revisión correctiva tras segunda revisión adversarial  
**Base protegida:** `sabik-preview@96ebf38a535fa287f32fee8c7957ede39933365c`  
**Sustituye para revisión:** `I0_CONTRACTS_V0_2.md`

## 0. Principios

- S0 sigue siendo la máquina de estado normativa.
- La seguridad se evalúa antes que la intención ordinaria.
- El Core no ejecuta DOM, JavaScript, URLs arbitrarias, SQL, comandos ni código generado.
- Las acciones son enums cerrados con parámetros discriminados.
- Las acciones con efecto externo no se ejecutan en I0.
- Texto, voz y B3 son capas separadas.
- I0/I1 no envían contenido conversacional fuera del navegador.
- El límite de entrada sigue S1: **2000 puntos de código Unicode antes de recortar espacios; exceso = rechazo, nunca truncado**.

## 1. Cadena obligatoria

```text
entrada
  ↓
normalización segura
  ↓
SAFETY GATE
  ├─ normal → contexto pendiente → intención ordinaria
  └─ uncertain/risk/human_handoff
       → invalida pendientes ordinarios
       → emite evento S0 cerrado
       → CERO acciones ordinarias
  ↓
plan tipado
  ↓
política / riesgo / confirmación
  ↓
resultado + acciones + eventos S0
  ↓
adaptador valida y ejecuta
```

### 1.1 Gate de seguridad

- El gate usa el corpus de seguridad histórico de PR #162 como evidencia de regresión y la tabla gate→S0 de `I0_SAFETY_GATE_MAPPING_V0_1.md`.
- La semántica ordinaria de negación de §7 **no se aplica dentro del gate**.
- El gate evalúa todas las cláusulas relevantes; una negación previa no puede anular una señal explícita posterior.
- Al entrar en `uncertain`, `risk` o `human_handoff` se invalidan:
  - `pendingClarification`
  - `pendingConfirmation`
  - `optionsShown`
- Se conserva solo en memoria un `safetyOriginalRequest` para reanudar el flujo autorizado si S0 recibe `RISK_CLEARED`.
- La respuesta usada para aclarar seguridad puede emitir `RISK_CLEARED`, pero **no ejecuta en ese mismo turno ninguna cláusula ordinaria adicional**.
- Tras `RISK_CLEARED`, el adaptador reanuda únicamente `safetyOriginalRequest`; no reutiliza como orden la frase de despeje.
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
  | { type: "RESUME_ASSISTANT" }
  | { type: "RESET_SESSION" }
  | { type: "SPEECH_STOP" }
  | { type: "ASK_CLARIFICATION" };
```

El Core solo puede solicitar esos eventos. El controlador S0 sigue validando la transición real.

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

`ACLARAR_SOLICITUD` y `FUERA_DE_ALCANCE` no son intenciones.

## 4. Parámetros discriminados

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

No existe `ATRAS{scope:"undo"}`.  
No existe `DETENER{target:"step_by_step"}`.

Superficies lingüísticas equivalentes se normalizan a:
- «deshaz eso» → `DESHACER_ULTIMA_ACCION`
- «quita el paso a paso» → `CAMBIAR_PASO_A_PASO{enabled:false}`

## 5. Acciones ejecutables cerradas

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
  | { id: string; type: "RESET_PREFERENCES"; parameters: { scope: "session" | "saved" | "all" }; risk: "local_with_loss" }
  | { id: string; type: "RESTORE_PREVIOUS_STATE"; parameters: { actionId: string }; risk: "local_reversible" };
```

No hay `type:string` ni `parameters:object` en la frontera ejecutable.

### 5.1 Tabla intención → riesgo

| Intención | Riesgo canónico |
|---|---|
| ENCONTRAR_CONTENIDO | sin efecto ejecutable |
| ABRIR_CONTENIDO | local_with_loss |
| CAMBIAR_* | local_reversible |
| SIGUIENTE / ATRAS(step) | local_reversible |
| ATRAS(page) | local_with_loss |
| REPETIR_INDICACION | local_reversible |
| RESTABLECER_PREFERENCIAS(session) | local_reversible |
| RESTABLECER_PREFERENCIAS(saved/all) | local_with_loss |
| DESHACER_ULTIMA_ACCION | riesgo de su `inverse` |
| DETENER(speech) | local_reversible + evento `SPEECH_STOP` |
| DETENER(assistant) | local_reversible + evento `PAUSE_ASSISTANT` |
| acciones externas futuras | external_effect |

El adaptador rechaza cualquier acción cuyo riesgo no coincida con esta tabla.

## 6. Contexto de sesión

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

type SessionContext = {
  lastResultId?: string;
  lastSources: SourceRef[];
  optionsShown: ShownOption[];
  excludedContentIds: string[];
  pendingClarification?: PendingClarification;
  pendingConfirmation?: PendingConfirmation;
  lastAction?: LastAction;
  safetyOriginalRequest?: { requestId: string; text: string };
  activeFlow?: "none" | "step_by_step";
  currentStep?: number;
  totalSteps?: number;
};
```

Reglas:
- una lista nueva sustituye completamente `optionsShown` y reinicia slots desde 1;
- una respuesta única actualiza `lastSources`;
- `OTRA_VIA` añade los resultados rechazados a `excludedContentIds`;
- navegación de página y `RESET_SESSION` eliminan `lastAction`;
- `RESET_SESSION` invalida `pendingConfirmation`, `pendingClarification`, `optionsShown`, `lastSources`, `excludedContentIds` y contexto conversacional; conserva preferencias según S1.

## 7. Semántica de negación y cese

Estas reglas operan solo después del Safety Gate.

### Negación del verbo
No acción + acuse textual.

### Negación de parámetro
Aplica complemento solo si es inequívoco.

### Exclusión explícita
«pero no…» prevalece sobre comportamiento por defecto.

### Contradicción
Una sola aclaración.

### Corrección
El objetivo posterior sustituye al anterior cuando la estructura lingüística lo deja claro.

### «deja de…» / «para de…»
- si existe una actividad compatible en curso, se resuelve al intent canónico correspondiente;
- «deja de leer» con `speech=speaking` → `DETENER{speech}`;
- «para Sabik» → `DETENER{assistant}`;
- «quita el paso a paso» → `CAMBIAR_PASO_A_PASO{false}`;
- si no existe actividad compatible en curso → no acción.

## 8. Planes multiacción

Cada comando tiene confianza propia.

Si una entrada contiene varias órdenes:
- se permiten hasta 3;
- una acción clara `local_reversible` e independiente puede ejecutarse aunque otro comando solo requiera listar/aclarar;
- nunca se ejecuta de forma parcial una acción `local_with_loss` o `external_effect` cuando el plan contiene aclaración pendiente;
- una acción dependiente de otra ambigua no se ejecuta;
- el resultado debe declarar qué acciones se ejecutaron y cuáles quedaron pendientes.

## 9. Umbrales provisionales

### local_reversible
- ejecutar: `confidence >= 0.90` y margen `>= 0.15`;
- aclarar: `0.70–0.89` o margen `< 0.15`;
- abstener: `< 0.70`.

### local_with_loss
- ejecutar sin confirmación solo si fue solicitada inequívocamente, no hay dato no enviado ni aclaración pendiente, `confidence >= 0.97` y margen `>= 0.20`;
- si hay texto no enviado, aclaración pendiente o pérdida no solicitada → confirmar;
- si no cumple el umbral → aclarar/abstener.

Los valores son provisionales hasta #173.

Métricas prioritarias:
- tasa de acción falsa;
- cero inversión en contrastes de negación;
- tasa de aclaración;
- tasa de abstención;
- calibración por tramo;
- margen top1-top2;
- cobertura de seguridad separada de estos umbrales.

## 10. Aclaración y confirmación

- la respuesta a una aclaración se evalúa primero contra `candidates`;
- si inicia otra petición clara, la aclaración anterior se descarta;
- si sigue ambigua, `insufficient`, sin segunda pregunta;
- «sí/no» sin pendiente no ejecuta nada;
- seguridad invalida toda aclaración/confirmación ordinaria pendiente.

Confirmación:
- `local_reversible`: nunca;
- `local_with_loss`: según §9 y estado real de pérdida;
- `external_effect`: siempre.

La confirmación caduca por reloj monotónico y se elimina al usarse. No existe campo `used`.

## 11. EN / ES

S1 permite interfaz ES/EN pero corpus editorial aprobado solo en español.

En I0/I1:
- el **Core de lenguaje natural se declara ES-only**;
- con `locale=en`, los controles visuales existentes siguen funcionando en inglés porque no dependen del Core;
- una consulta escrita en inglés al Core devuelve `out_of_scope` y el aviso S1: `Answers and source titles are currently available in Spanish.`;
- no se finge comprensión EN hasta que exista corpus y pruebas EN.

## 12. Preferencias guardadas

El único almacén persistente autorizado en I0/I1 es el sistema existente `window.IGPreferences` / `assets/preferencias-lectura.js`, que usa `localStorage` para **presentación**.

- clave existente: `ig-a11y`;
- no guarda conversación;
- voz vuelve apagada en una nueva página;
- `scope=saved` solo puede operar sobre preferencias que el almacén existente soporte;
- cualquier preferencia Sabik nueva que aún no exista en `IGPreferences` permanece de sesión hasta autorización de integración;
- `RESET_SESSION` no borra estas preferencias.

## 13. Recursos humanos

- `PEDIR_AYUDA_HUMANA` en `safety=normal` busca recursos verificados sin emitir `HUMAN_HANDOFF`.
- El flujo de seguridad puede emitir `HUMAN_HANDOFF` únicamente según S0.
- Para funcionar offline, el build debe incluir:
  1. recurso humano verificado aplicable, **o**
  2. un `approvedHumanHelpFallback` editorial estático.
- El build/piloto no puede declarar soporte de `human_help` si no existe uno de esos dos artefactos.
- Este contrato no inventa teléfono, URL, territorio ni texto clínico.

## 14. Salida

```ts
type SabikResult = {
  kind: ResultKind;
  text: string;
  sources: SourceRef[];
  actions: SabikAction[];
  s0Events: CoreS0Event[];
  continuation?: { type: "RESUME_ORIGINAL_AFTER_SAFETY"; requestId: string };
  b3: B3State;
};
```

Reglas:
- respuesta de contenido: `sources.length >= 1`;
- preferencias/navegación pueden usar `sources=[]`;
- `human_help` normal no emite `HUMAN_HANDOFF`;
- `DETENER{speech}` → `SPEECH_STOP`;
- `DETENER{assistant}` → `PAUSE_ASSISTANT`;
- pausa por texto usa el mismo estado y anuncio breve de S1; no fuerza foco al botón Reanudar cuando el origen fue texto: conserva foco natural del mecanismo de envío;
- el controlador S0 sigue siendo quien acepta/rechaza cada evento.

## 15. Vista sencilla y detalles

La matriz normativa está en `I0_PRESENTATION_EFFECTS_V0_1.md`.

`Vista sencilla` nunca puede ocultar:
- explicación principal;
- acción necesaria;
- error;
- seguridad;
- navegación;
- controles esenciales;
- fuente necesaria para sostener la respuesta.

## 16. Fuera de alcance

- consejo clínico individual;
- dosis/medicación;
- acciones sobre terceros;
- conocimiento general ajeno a Iris;
- comprensión natural en idioma no soportado;
- texto libre para la voz;
- ejecutar código/URLs/scripts/comandos;
- tareas futuras;
- suscripciones/formularios reales no autorizados.

## 17. Cierre I0

I0 solo puede cerrarse cuando:
1. safety gate + eventos S0 aprobados;
2. tipos cerrados aprobados;
3. contexto e inversas aprobados;
4. negación/cese aprobados;
5. multiacción aprobada;
6. riesgo/confirmación aprobados;
7. privacidad/offline/saved prefs aprobados;
8. presentación simple/detalles aprobados;
9. recursos humanos offline tienen artefacto aprobado o se declara función no disponible;
10. corpus #173 creado;
11. umbrales calibrados;
12. regresión S0/S1 sin contradicciones;
13. producción/main/Netlify/S2 intactos.
