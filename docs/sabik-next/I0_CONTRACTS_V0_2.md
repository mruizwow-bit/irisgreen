# I0 · CONTRATO DE SABIK WEB · V0.2

**Fecha:** 20/09/2026  
**Estado:** revisión correctiva tras dictamen adversarial de Claude  
**Base protegida:** `sabik-preview@96ebf38a535fa287f32fee8c7957ede39933365c`  
**Sustituye para revisión:** `I0_CONTRACTS_V0_1.md`

## 0. Principios

- S0 sigue siendo la máquina de estado normativa.
- La seguridad se evalúa **antes** que la intención ordinaria.
- El Core nunca ejecuta JavaScript, URLs, comandos, SQL ni código generado.
- Las acciones se representan mediante enums y parámetros tipados.
- Las acciones con efecto externo no se ejecutan en I0.
- Las preferencias son funcionales, no diagnósticas.
- Texto, voz y B3 son capas separadas.
- I0/I1 no envían consultas reales fuera del navegador.

## 1. Cadena obligatoria de decisión

```text
entrada
  ↓
normalización segura
  ↓
SAFETY GATE
  ├─ normal → interpretación de intención
  └─ uncertain/risk/human_handoff → flujo S0 de seguridad
                                  → CERO acciones ordinarias
  ↓
resolución de contexto pendiente
  ↓
interpretación de una o varias acciones
  ↓
política / riesgo / confirmación
  ↓
resultado estructurado
  ↓
adaptador de Iris valida y ejecuta solo acciones permitidas
```

### 1.1 Safety gate

El safety gate no diagnostica ni infiere emociones. Solo clasifica expresiones explícitas o patrones de seguridad definidos y auditados.

Cuando S0 queda en `uncertain`, `risk` o `human_handoff`:
- no se ejecuta ninguna acción ordinaria del catálogo;
- no se navega por similitud;
- no se cambia una preferencia como efecto colateral;
- solo actúa el flujo de seguridad ya autorizado por S0;
- cualquier ayuda humana debe proceder de recursos verificados.

## 2. Tipos cerrados

```ts
type Locale = "es" | "en";

type B3State =
  | "PRESENTE"
  | "ORIENTAR"
  | "TRANSICIÓN"
  | "PAUSA"
  | "CONFIRMAR";

type RiskLevel =
  | "local_reversible"
  | "local_with_loss"
  | "external_effect";

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
  | "response"
  | "action_result"
  | "clarification"
  | "insufficient"
  | "human_help"
  | "out_of_scope";
```

`ACLARAR_SOLICITUD` y `FUERA_DE_ALCANCE` dejan de ser intenciones: son resultados.

## 3. Entrada y contexto de sesión

```ts
type ShownOption = {
  slot: number;
  contentId: string;
  route: string;
  title: string;
};

type PendingClarification = {
  id: string;
  kind: string;
  allowedAnswers?: string[];
};

type PendingConfirmation = {
  id: string;
  action: SabikAction;
  parameterHash: string;
  sessionId: string;
  expiresAt: number;
  used: boolean;
};

type LastAction = {
  action: SabikAction;
  reversible: boolean;
};

type SessionContext = {
  lastResultId?: string;
  optionsShown: ShownOption[];
  pendingClarification?: PendingClarification;
  pendingConfirmation?: PendingConfirmation;
  lastAction?: LastAction;
  activeFlow?: "none" | "step_by_step";
  currentStep?: number;
  totalSteps?: number;
};

type SabikInput = {
  sessionId: string;
  locale: Locale;
  text: string;
  currentRoute: string;
  currentContentId?: string;
  requestTime: number;
  s0: {
    operation: string;
    safety: "normal" | "uncertain" | "risk" | "human_handoff";
    speech: string;
    visibility: string;
  };
  context: SessionContext;
  preferences: {
    motion?: "normal" | "reduced" | "none";
    textSize?: "normal" | "large" | "xlarge";
    stepByStep?: boolean;
    simpleView?: boolean;
    origin?: "user" | "system";
  };
};
```

### 3.1 Límites de entrada

- normalización Unicode NFC;
- se rechazan controles Unicode no permitidos;
- máximo inicial: **1200 code points**;
- no truncar silenciosamente;
- máximo de **3 acciones locales independientes** por entrada;
- URLs y esquemas como `javascript:`, `data:` o `tel:` nunca se convierten en acciones;
- `currentRoute`, `locale` y `contentId` se validan contra catálogos permitidos.

## 4. Interpretación

```ts
type IntentCommand = {
  intent: IntentType;
  confidence: number;
  parameters:
    | { query: string; mode: "list" | "locate" }
    | { contentId: string }
    | { size: "normal" | "large" | "xlarge" }
    | { motion: "normal" | "reduced" | "none" }
    | { enabled: boolean }
    | { contentId: string; expanded: boolean }
    | { scope: "step" | "page" | "undo" }
    | { target: "speech" | "assistant" | "step_by_step" }
    | { confirmationId: string }
    | { scope: "session" | "saved" | "all" }
    | Record<string, never>;
};

type SabikPlan = {
  commands: IntentCommand[];
  needsClarification: boolean;
  clarificationQuestion?: string;
};
```

### 4.1 Umbrales provisionales de I0

Los umbrales se validarán contra el corpus antes de cerrar I0:

- ejecución automática de acción local reversible: `confidence >= 0.90`;
- además, margen frente a la segunda intención: `>= 0.15`;
- `0.70–0.89` o margen `< 0.15`: una sola aclaración;
- `< 0.70`: `insufficient` / `out_of_scope`;
- una acción externa nunca se autoejecuta, independientemente de la confianza.

Si el evaluador del corpus demuestra que estos umbrales no son adecuados, solo pueden cambiar mediante una nueva versión del contrato.

## 5. Catálogo funcional

### 5.1 Contenido

#### ENCONTRAR_CONTENIDO
Unifica búsqueda y localización.

Parámetros:
- `query`
- `mode = list | locate`

Reglas:
- una lista de resultados no es ORIENTAR por sí misma;
- no abrir automáticamente;
- si no hay fuente pertinente, `insufficient`.

#### ABRIR_CONTENIDO
Solo acepta `contentId` resuelto desde catálogo o desde `optionsShown`.

Reglas:
- prohibido construir rutas desde texto libre;
- con varias coincidencias, listar y no abrir;
- `"abre el segundo"` usa el slot estable de `optionsShown`;
- nunca abrir URL externa ni `tel:` automáticamente.

### 5.2 Preferencias

- `CAMBIAR_TAMANO_TEXTO`
- `CAMBIAR_MOVIMIENTO`
- `CAMBIAR_PASO_A_PASO`
- `CAMBIAR_VISTA_SENCILLA`
- `CAMBIAR_DETALLES`

Todos usan parámetros explícitos; no existen intents `ACTIVAR_*` ambiguos.

### 5.3 Navegación y control

- `SIGUIENTE`
- `ATRAS` con `scope = step | page | undo`
- `REPETIR_INDICACION`
- `CANCELAR`
- `DESHACER_ULTIMA_ACCION`
- `DETENER` con target obligatorio
- `RECHAZAR_RESULTADO`
- `OTRA_VIA`

Sin ámbito suficiente, `ATRAS` o `DETENER` preguntan una sola aclaración.

### 5.4 Confirmación y ayuda

- `CONFIRMAR_ACCION` solo puede resolver una confirmación pendiente válida.
- `PEDIR_AYUDA_HUMANA` no inventa recursos y queda subordinada a S0 y a recursos verificados.

## 6. Semántica de negación

### 6.1 Negación del verbo
Produce **no acción** + acuse textual.

Ejemplos:
- `No amplíes el texto` → no acción.
- `No vuelvas atrás` → no acción.

### 6.2 Negación de parámetro
Aplica el complemento solo cuando es inequívoco.

- `No quiero paso a paso` → `CAMBIAR_PASO_A_PASO { enabled:false }`.
- si ya está desactivado → no-op.

### 6.3 Exclusión explícita
Una cláusula `pero no...` prevalece sobre el comportamiento por defecto.

### 6.4 Contradicción
Si la entrada contiene instrucciones incompatibles, se hace una sola aclaración.

### 6.5 Corrección
`Más grande no, más pequeño` reemplaza el primer objetivo por el segundo; no ejecuta ambos.

## 7. Aclaración única

- una respuesta a `pendingClarification` se interpreta primero contra esa aclaración;
- si la persona inicia otra petición clara, se descarta la aclaración anterior;
- si la respuesta sigue ambigua, se devuelve `insufficient`; no se encadena una segunda pregunta;
- `sí` o `no` sin aclaración/confirmación pendiente nunca ejecutan una acción.

## 8. Confirmaciones

La confirmación se deriva de `risk`, no de un booleano independiente.

- `local_reversible`: no requiere confirmación;
- `local_with_loss`: puede requerir confirmación si hay pérdida no solicitada de estado/datos;
- `external_effect`: siempre requiere confirmación.

Toda confirmación contiene:
- ID único;
- acción exacta;
- hash de parámetros;
- sessionId;
- caducidad;
- estado `used`.

Una confirmación caducada, usada o de otra sesión se rechaza.

## 9. Navegación y pérdida de estado

En I0/I1 no se persiste historial conversacional entre páginas.

- `ABRIR_CONTENIDO` solicitado explícitamente puede navegar y reiniciar contexto conversacional.
- si existe información no enviada, aclaración pendiente o estado que se perdería, la acción se clasifica como `local_with_loss`.
- la interfaz debe avisar de la pérdida relevante antes de navegar cuando no haya sido solicitada de forma inequívoca.
- una futura continuidad entre páginas necesita una decisión de privacidad separada.

## 10. Resultado

```ts
type SabikAction = {
  id: string;
  type: string;
  parameters: object;
  risk: RiskLevel;
};

type SabikResult = {
  kind: ResultKind;
  text: string;
  sources: Array<{
    contentId: string;
    url: string;
    title: string;
  }>;
  actions: SabikAction[];
  b3: B3State;
};
```

Reglas de fuentes:
- `response` sobre contenido exige `sources.length >= 1`;
- acciones de preferencia/navegación pueden llevar `sources=[]`;
- `insufficient` no inventa fuente;
- `human_help` solo usa recursos humanos verificados.

## 11. Fuera de alcance I0

Se devuelve `out_of_scope` o `insufficient` para:
- consejo clínico individual;
- dosis/medicación;
- acciones sobre terceros;
- conocimiento general ajeno a Iris;
- cambio a idioma no soportado por el corpus activo;
- texto libre para sintetizar con la voz de Sabik;
- ejecutar código, URLs, scripts o comandos;
- crear tareas futuras;
- suscripciones/formularios reales mientras no exista fase autorizada.

## 12. Riesgo de acciones

### local_reversible
- preferencias temporales;
- mostrar/ocultar detalles;
- paso siguiente/anterior dentro de flujo;
- repetir indicación.

### local_with_loss
- navegación de página que pierda contexto;
- restablecer preferencias guardadas;
- deshacer cuando pueda borrar estado local relevante.

### external_effect
Reservado para fases futuras:
- enviar formulario;
- suscribir;
- compartir;
- borrar datos persistentes;
- acciones sobre terceros.

## 13. Criterios de cierre I0

I0 solo puede cerrarse cuando:
1. safety gate aprobado;
2. tipos/enums y parámetros aprobados;
3. contexto de sesión aprobado;
4. semántica de negación aprobada;
5. aclaración/confirmación aprobadas;
6. catálogo y fuera de alcance aprobados;
7. proyección S0→B3 v0.2 aprobada;
8. privacidad/red/offline documentados;
9. corpus separado creado y evaluado;
10. umbrales calibrados con el corpus;
11. ninguna regla contradice S0/S1;
12. producción, main, Netlify y S2 siguen intactos.
