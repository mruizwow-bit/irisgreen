# Adenda contractual B06/B07 · S0 congelado

**Issue:** #149  
**PR QA:** #164  
**Implementación revisada:** PR #161  
**Semántica independiente:** PR #162  
**Diseño:** PR #163  
**Estado:** `NORMATIVE_FROZEN`

## 1. Propósito

Esta adenda cierra antes del siguiente commit de Codex dos ambigüedades detectadas durante la revalidación de S0 y fija la semántica de voz que Design necesita para no confundir intención de escuchar con audio real.

No corrige el contrato para ajustarlo a una implementación. La implementación debe ajustarse a este contrato.

La versión ejecutable de esta adenda es:

- `tests/specs/sabik/s0-contract-addendum-b06-b07.json`
- `tests/specs/sabik/run-s0-addendum-b06-b07.mjs`

## 2. B06 · Respuesta a una aclaración normal

Estado previo:

```text
operation = awaiting_clarification
dialogue = clarification
safety = normal
```

Evento:

```text
SUBMIT
```

Resultado obligatorio:

```text
operation = retrieving
dialogue = clarification
safety = normal
```

Debe conservar:

- `adaptation` completa;
- `language`;
- `visibility`;
- revisión coherente;
- contexto conversacional de la sesión, que vive fuera de la máquina S0.

Una respuesta a una aclaración no es una consulta nueva desligada. S0 no almacena el texto ni el historial, pero tampoco puede representar ese `SUBMIT` como reset de sesión.

### Política de revisión

Para las transiciones de esta adenda:

```text
evento permitido  → next.revision = previous.revision + 1
evento rechazado  → revision y estado permanecen intactos
```

## 3. B07 · Resolución explícita de una aclaración de seguridad

Mientras:

```text
safety = uncertain
operation = awaiting_clarification
```

un `SUBMIT` representa la respuesta de la persona a la aclaración de seguridad, pero **no resuelve por sí solo el riesgo**.

Por tanto:

```text
uncertain + SUBMIT
→ uncertain + awaiting_clarification
```

Después debe existir un evento de resolución explícito.

### Confirmación

```text
uncertain + RISK_CONFIRMED
→ safety = risk
→ dialogue = human_handoff
→ operation = presenting
→ speech = silent
→ motion = protection_static
```

### Descartado explícitamente

```text
uncertain + RISK_CLEARED
→ safety = normal
→ operation = retrieving
→ dialogue = clarification
→ speech = silent
→ motion = processing
```

`RISK_CLEARED` significa únicamente: «la aclaración de seguridad ha sido resuelta explícitamente y no confirma riesgo».

No puede utilizarse:

- desde `safety = normal`;
- desde `safety = risk`;
- desde `safety = human_handoff`;
- como sustituto de `RESET_SESSION`;
- como forma genérica de rebajar protección.

El contexto previo permanece en la capa de sesión/controlador y continúa hacia recuperación ordinaria controlada.

## 4. Semántica de voz congelada

### `SPEECH_REQUEST`

Significa exclusivamente que la persona pulsa **Escuchar**.

```text
speech = starting
energía = 0
sin onda de voz
```

El clic no demuestra que haya sonido.

### `SPEECH_START`

Significa exclusivamente el evento real equivalente a:

```text
speechSynthesis.onstart
```

Resultado:

```text
speech = speaking
motion = voice_reactive
```

Con movimiento reducido:

```text
speech = speaking
motion = off
```

Las ondas empiezan aquí, con audio real, no en `SPEECH_REQUEST`.

### `SPEECH_BOUNDARY`

Solo puede ocurrir durante una voz ya iniciada.

```text
speaking + SPEECH_BOUNDARY → speaking
```

Está prohibido:

```text
starting + SPEECH_BOUNDARY → speaking
```

`SPEECH_BOUNDARY` actualiza impulso, energía o posición; nunca sustituye a `SPEECH_START`.

### Pausa, reanudación, final y error

```text
SPEECH_PAUSE
→ speech = paused
→ motion = off

SPEECH_RESUME
→ speech = speaking
→ motion = voice_reactive
```

Con movimiento reducido, `SPEECH_RESUME` mantiene `motion = off`.

```text
SPEECH_STOP
→ speech = ended
→ motion = ambient
```

Con movimiento reducido, `motion = off`.

```text
SPEECH_END
→ speech = ended
→ motion = ambient
```

Con movimiento reducido, `motion = off`.

```text
SPEECH_ERROR
→ speech = error
→ motion = off
```

### Seguridad y voz

Durante:

```text
safety = risk
safety = human_handoff
```

la voz ordinaria permanece bloqueada. Ni `SPEECH_REQUEST` ni `SPEECH_START` pueden activar locución ordinaria y:

```text
motion = protection_static
```

prevalece sobre `voice_reactive`.

## 5. Forma pública canónica

La máquina S0 debe exponer sin ambigüedad:

```text
operation: scalar
dialogue: scalar
adaptation: object completo
safety: scalar
visibility: scalar
speech: scalar
motion: scalar
language: scalar
revision: integer
```

`adaptation` conserva como mínimo:

```text
response_length
max_options
question_policy
intensity
depth
```

Pueden existir metadatos como:

```text
speech_meta
motion_meta
```

o valores derivados por `deriveSabikPresentation()` para energía, contador de límites, origen o razón de finalización.

Esos metadatos **no pueden sustituir** `speech` ni `motion` escalares.

## 6. Filas y recorridos añadidos

La adenda ejecutable añade **25 filas contractuales** y **8 recorridos** para cubrir:

- `SUBMIT` tras aclaración normal;
- `SUBMIT` durante `uncertain` sin rebaja silenciosa;
- `RISK_CONFIRMED` desde `uncertain`;
- `RISK_CLEARED` desde `uncertain`;
- rechazo de `RISK_CLEARED` fuera de `uncertain`;
- `SPEECH_REQUEST` normal y con movimiento reducido;
- `SPEECH_START` como inicio real del audio;
- `SPEECH_BOUNDARY` solo después del inicio real;
- pausa, reanudación, stop, end y error;
- voz bloqueada durante `risk` y `human_handoff`;
- forma pública escalar y revisión coherente.

## 7. Puerta automática adicional

Validación de la adenda sin runtime:

```bash
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs
```

Revalidación contra S0:

```bash
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs --module <módulo puro S0>
```

El runner canónico anterior sigue siendo obligatorio:

```bash
node tests/specs/sabik/run-s0-contract.mjs --module <módulo puro S0>
```

Un verde en uno no compensa un fallo en el otro.

## 8. Próxima revalidación S0

Cuando PR #161 publique un SHA posterior al contractual congelado, QA reconstruirá el checkout desde GitHub y repetirá desde cero:

1. alcance del diff;
2. suite propia S0;
3. V7;
4. runner canónico base;
5. runner B06/B07;
6. transiciones de aclaración y voz;
7. secuencias de Claude disponibles;
8. build completo en Linux;
9. pureza, determinismo, inmutabilidad, serialización y seguridad;
10. un único veredicto: `ACEPTADO_S0`, `ACEPTADO_S0_CON_PENDIENTES_NO_BLOQUEANTES` o `BLOQUEADO_S0`.

Ningún `26/26`, `28/28` ni otro resultado previo se hereda.

## 9. Regla de congelación

Tras publicar el SHA contractual de PR #164, Codex debe programar contra ese SHA.

Durante el siguiente ciclo de Codex no se cambiarán eventos, valores ni semántica de esta adenda salvo que aparezca un **defecto de seguridad crítico documentado**. Una incompatibilidad de implementación no es motivo para cambiar el contrato.
