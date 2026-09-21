# DG-FINAL · ADENDA DE COMPATIBILIDAD FINAL

**Estado:** `SABIK_DESIGN_GATE_FINAL_READY`  
**Fecha:** 21/09/2026  
**Coordinación:** Astra  
**Alcance:** especificación Design previa a S2 · **NO RUNTIME · NO MOTION B3 · NO DEPLOY**

## 1 · Fuentes congeladas

Esta adenda no sustituye los paquetes aceptados: define cómo se componen y cuál prevalece cuando el vocabulario histórico de #163 entra en conflicto con la arquitectura actual.

| Fuente | Referencia | Autoridad vigente |
|---|---|---|
| PR #163 · Design canónico | HEAD canónico previo `05ebcfddd268a9378e2c776c728031f04c51ff7f` | UI, controles, voz, ondas, accesibilidad responsive, Safety y antecedentes S0 |
| PR #181 · familia visual | `742e502802cdc9e3e7b154ddbb8493493c903898` | masters, geometrías, paletas, wordmark y cuatro presencias |
| PR #182 · B3 estático R1 | candidato visual `16a4b7debf801d190a6174fd6831a5176db5960d` | semántica B3 y cinco keyframes por presencia de producto |
| PR #182 · H1 | protocolo congelado posterior | evaluación humana; no modifica la arquitectura ni los keyframes |

## 2 · Regla de precedencia

Cuando dos documentos parecen describir el mismo concepto de forma distinta, aplicar este orden:

1. **Identidad/familia:** #181.
2. **Semántica B3:** #182.
3. **Safety:** contrato S0 + reglas de protección de #163.
4. **Voz/ondas/controles/accessibility:** #163, con el alcance corregido por esta adenda.
5. **Movimiento B3:** **no definido todavía**. Se difiere expresamente a Fase 3B.

Nada de #163 puede crear un sexto estado B3 ni alterar los masters aceptados de #181.

## 3 · Núcleo B3 único

B3 tiene exactamente cinco estados:

**PRESENTE · ORIENTAR · TRANSICIÓN · PAUSA · CONFIRMAR**

Estos cinco describen **función del sistema**, no emoción, voz, progreso técnico, diagnóstico ni personalidad.

No son estados B3:

- arrancando / booting;
- buscando / retrieving;
- componiendo / composing;
- respuesta lista / presenting;
- aclaración;
- error técnico;
- riesgo / uncertain / human_handoff;
- plegado / oculto;
- iniciando voz;
- hablando;
- voz pausada;
- voz finalizada;
- error de voz.

Los términos anteriores pueden seguir existiendo en sus capas propias de UI, Safety, contenedor o voz.

## 4 · Arquitectura composicional

La presentación visible de Sabik se compone conceptualmente, no como una máquina plana:

```text
presentation =
  family_presence
  + B3_state
  + ui_operation
  + safety_state
  + voice_state
  + voice_energy
  + motion_preference
  + low_intensity
```

Donde:

```text
family_presence ∈ {WEB, IA, EDUCA}
B3_state        ∈ {PRESENTE, ORIENTAR, TRANSICIÓN, PAUSA, CONFIRMAR}
voice_state     ∈ {silent, starting, speaking, paused, ended, error}
voice_energy    ∈ [0,1]
motion_preference ∈ {full, reduced/off}
```

Presencia Matriz sigue siendo origen/control familiar y no interfaz de producto.

### Independencia semántica

- Cambiar `voice_state` **no cambia automáticamente** `B3_state`.
- Cambiar `voice_energy` **no cambia** `B3_state`.
- Un evento `boundary`, fonema, palabra estimada o amplitud **nunca decide significado B3**.
- `ui_operation=retrieving/composing` no crea BUSCANDO/COMPONIENDO en B3.
- Safety puede reducir estímulo o bloquear voz ordinaria sin inventar un estado emocional B3.
- La pausa del canal de voz no equivale a **PAUSA B3**.

## 5 · Voz · contrato final de compatibilidad

### 5.1 Inicio explícito

La voz solo comienza por acción explícita de la persona.

```text
acción Escuchar
→ voice_state=starting
→ voice_energy=0
→ sin señal visual de habla activa

evento real de inicio de audio
→ voice_state=speaking
→ voice_energy puede ser >0
```

El clic no autoriza a representar voz ya emitida.

### 5.2 Energía

| voice_state | voice_energy semánticamente permitido | Señal de voz en movimiento |
|---|---:|---|
| silent | 0 | ninguna |
| starting | 0 | ninguna señal de habla; indicador estático opcional |
| speaking | 0..1 según locución | solo en componente de voz y solo si Motion está permitido |
| paused | 0 | ninguna |
| ended | 0 | ninguna |
| error | 0 | ninguna |

Durante `speaking`, los impulsos de palabra/boundary o el fallback aproximado de #163 pertenecen **exclusivamente a la visualización de voz**.

No se sincronizan las membranas B3, la geometría de Web/IA/Educa ni un cambio de estado B3 con fonemas, palabras o amplitud.

### 5.3 Silencio

Silencio significa:

- energía de voz 0;
- sin onda que “respira”;
- sin falsa señal de audio;
- sin bucle visual huérfano;
- B3 permanece en el estado funcional que corresponda.

### 5.4 Pausa/final/error de voz

`paused`, `ended` y `error` llevan la energía a 0.

Esto no activa **PAUSA B3** salvo que, además e independientemente, la función del sistema sea realmente PAUSA.

### 5.5 Texto y alternativa no vocal

La voz nunca es la única vía de acceso a la información.

- el texto completo permanece disponible;
- detener o reducir el movimiento no elimina el texto;
- ausencia de `speechSynthesis` no elimina contenido;
- la UI mantiene nombre/estado textual accesible del canal de voz;
- “IA”/identificador textual de sistema no depende del holograma.

## 6 · Reduced Motion

La preferencia de movimiento recorta la representación visual, no la capacidad de voz:

```text
voice_state=speaking
+ motion_preference=reduced/off
→ la voz puede continuar
→ movimiento de ondas = none
→ B3 conserva keyframe estático
→ texto completo permanece
→ estado se comunica por texto/controles
```

En esta fase no se definen timings de Motion B3.

Los valores históricos de velocidad, precesión, transformaciones o procesamiento de #163 **no son especificación de Motion para los cinco estados B3**. Podrán servir como antecedente técnico, pero Fase 3B deberá definir el movimiento B3 sobre los keyframes congelados.

## 7 · Qué permanece vigente de #163

Se mantiene como especificación útil para S2, salvo las excepciones expresas de esta adenda:

- separación y comportamiento de controles;
- foco, hover, active, disabled y error de controles;
- estructura responsive, 320 CSS px, zoom/text resize;
- contraste y forced colors;
- `low_intensity`;
- Safety / protection_static;
- semántica de eventos de voz;
- energía 0 en silencio/pausa/final/error;
- inicio de ondas con evento real de voz, no con clic;
- fallback de voz limitado al componente de ondas;
- Reduced Motion sin pérdida de voz o texto;
- no autoplay.

## 8 · Qué queda superseded / legacy de #163

### 8.1 “20 estados” o “seis ejes” como núcleo visual

La tabla histórica sigue siendo útil como catálogo de escenarios y capas de presentación, pero **no define el núcleo B3**.

Los cinco estados B3 de #182 prevalecen.

### 8.2 `data-cognitive-state`

Los valores históricos:

`NucleoBase · Hiperfoco · Sobrecarga · Vinculo · VozInterior · Creatividad`

no son estados B3, no sustituyen las presencias aceptadas de #181 y no deben usarse para inferir o representar el estado mental, diagnóstico o emoción de la persona.

No son objetivo de implementación S2 como máquina visual de B3.

### 8.3 Estados operativos del turno

`arrancando · buscando · componiendo · respuesta · aclaracion · correccion · error · derivacion`

son vocabulario UI/operacional heredado. Pueden informar texto, controles o Safety; no crean una geometría B3 independiente.

### 8.4 Movimiento del “holograma” legado

Los tiempos de aros/precesión y tratamientos de brillo/opacidad ligados a buscar/componer/respuesta pertenecen a la exploración anterior.

No deben usarse para animar los cinco estados B3 antes de Fase 3B.

## 9 · No antropomorfización

La presencia visual no representa una persona, emoción, cara, respiración, ánimo o diagnóstico.

La voz es una función de salida del sistema, no “vida” de Sabik.

Las etiquetas deben describir funciones observables:
- “Leyendo en voz alta”;
- “Voz en pausa”;
- “Disponible”;
- etc.

La interfaz debe poder indicar textualmente que se interactúa con una IA; el usuario no debe tener que inferirlo de la presencia visual.

## 10 · Matriz de compatibilidad resumida

| Concepto #163 | Capa final | Compatibilidad | Regla final |
|---|---|---|---|
| ready/listo | B3 + UI | COMPATIBLE | baseline B3 = PRESENTE |
| retrieving/buscando | UI | COMPATIBLE CON CORRECCIÓN | no es B3 |
| composing | UI | COMPATIBLE CON CORRECCIÓN | no es B3 |
| presenting/respuesta | UI | COMPATIBLE CON CORRECCIÓN | no activa CONFIRMAR automáticamente |
| paused de sistema | B3 + UI | COMPATIBLE | puede mapear a PAUSA B3 |
| speech starting | VOICE | COMPATIBLE | energía 0; no “hablando” |
| speech speaking | VOICE | COMPATIBLE | onda de voz opcional; B3 independiente |
| speech paused | VOICE | COMPATIBLE CON ACLARACIÓN | energía 0; no PAUSA B3 automática |
| speech ended/error | VOICE | COMPATIBLE | energía 0 |
| voice_reactive | VOICE | COMPATIBLE CON ALCANCE | solo ondas; nunca geometría B3 |
| processing | UI/Motion legacy | SUPERSEDED PARA B3 | no motion B3 hasta 3B |
| uncertain/risk/handoff | SAFETY | COMPATIBLE | protección separada |
| low_intensity | UI/PREFERENCE | COMPATIBLE | se conserva incluso en protección |
| collapsed/hidden | CONTAINER | COMPATIBLE | no es B3 |
| cognitive-state legacy | LEGACY | SUPERSEDED | no implementar como núcleo B3 |
| rings/precession timings | LEGACY MOTION | SUPERSEDED PARA B3 | 3B definirá motion B3 |

## 11 · Contradicciones detectadas y resolución documental

| ID | Contradicción | Severidad antes de adenda | Resolución |
|---|---|---|---|
| DG-01 | #163 puede leerse como un sistema de “20 estados” frente a B3 de cinco | bloqueante | los 20 se reinterpretan como escenarios/capas; B3=5 |
| DG-02 | speaking/starting/paused podían parecer estados semánticos de la presencia | bloqueante | se confinan a VOICE_LAYER |
| DG-03 | `voice_reactive` podía interpretarse como animación global del holograma | alta | afecta solo ondas de voz |
| DG-04 | pausa de voz podía confundirse con PAUSA B3 | alta | variables independientes |
| DG-05 | processing/buscando/componiendo podían reintroducir “thinking/loading” | alta | UI_LAYER; no B3 |
| DG-06 | timings del holograma legado podían adelantarse a 3B | alta | marcados legacy/no normativos para B3 |
| DG-07 | `data-cognitive-state` entra en conflicto con familia aceptada y riesgo de inferencia | alta | superseded como núcleo B3 |
| DG-08 | boundary/fallback podía contaminar semántica B3 | alta | solo voice_energy/ondas |
| DG-09 | Reduced Motion podía confundirse con desactivar voz | media | voz y texto permanecen |
| DG-10 | cierre Design podía confundirse con autorización Motion | media | 3B sigue expresamente cerrado |

## 12 · Correcciones documentales necesarias

Para cerrar el gate Design no hace falta cambiar runtime ni assets.

Esta adenda es la corrección normativa necesaria. El paquete canónico original de #163 se conserva como antecedente verificable; esta adenda es su **capa de compatibilidad posterior** frente a #181/#182.

No se corrigen capturas ni prototipos históricos: se evita convertirlos de nuevo en fuente de verdad.

## 13 · Dictamen Design

Con esta adenda:

- todos los entregables originales de #148 tienen una capa vigente y no contradictoria;
- voz, Safety, UI y B3 quedan separados;
- la familia visual aceptada es autoridad de identidad;
- los cinco estados B3 son la única gramática semántica de presencia;
- Reduced Motion conserva voz, texto y función;
- no se anticipa Fase 3B;
- no se requiere cambio en runtime/S2 para cerrar la especificación Design.

### Dictamen

**`DESIGN_SPECIFICATION_GATE_PASS_CANDIDATE`**

Desde el punto de vista de **especificación Design**, **#148 puede cerrarse tras revisión y aceptación de Astra de esta adenda**.

Ese cierre:
- **no** fusiona #163;
- **no** abre Motion 3B;
- **no** modifica H1;
- **no** certifica resultados del piloto humano;
- **no** implementa S2;
- **no** autoriza deploy.

Después del gate de Astra, S2 puede abrirse formalmente usando esta precedencia documental.

**NO MERGE.**
