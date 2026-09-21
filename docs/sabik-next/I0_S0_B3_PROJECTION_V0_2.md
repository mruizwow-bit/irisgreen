# I0 · PROYECCIÓN S0 → B3 · V0.2

**Fecha:** 20/09/2026  
**Estado:** revisión correctiva  
**Sustituye para revisión:** `I0_S0_B3_PROJECTION_V0_1.md`

## 1. Relación normativa

- **S0** es estado técnico/operativo normativo.
- **B3** es la función perceptible de presentación.
- B3 se deriva de S0 + resultado/acción.
- B3 nunca modifica S0.
- Un momento tiene una sola función B3 dominante.
- No existe sexto estado B3.

## 2. Seguridad antes que presentación

S0 safety tiene prioridad sobre acciones ordinarias.

Si `safety = uncertain | risk | human_handoff`:
- se bloquean acciones ordinarias;
- B3 no representa emoción, ansiedad, gravedad ni diagnóstico;
- `motion = protection_static` sigue siendo normativo cuando S0 lo exige;
- el mensaje textual/controles de seguridad son el canal principal;
- ORIENTAR solo aparece si existe un recurso humano concreto y verificado.

## 3. Precedencia de función B3

Cuando varias funciones podrían aplicar:

1. **PAUSA** mientras exista pausa funcional del asistente.
2. **TRANSICIÓN** durante un cambio real y finito de etapa/ruta.
3. **ORIENTAR** cuando Sabik señala un único objetivo o siguiente acción concreta.
4. **CONFIRMAR** solo si existe un resultado concreto cuya confirmación no sea ya perceptible por sí misma.
5. **PRESENTE** en los demás estados estables.

Una secuencia puede ser `TRANSICIÓN → ORIENTAR`, nunca dos funciones simultáneas.

## 4. Reglas

### PRESENTE
Usar para:
- boot estable;
- ready;
- retrieving;
- composing;
- presentación informativa;
- lista de resultados;
- aclaración con opciones;
- insuficiencia;
- error técnico con texto;
- cambio perceptible de preferencia que no necesita confirmación adicional.

Procesamiento técnico no es TRANSICIÓN.

### ORIENTAR
Exige un objetivo concreto:
- un único destino;
- una acción siguiente;
- un recurso humano verificado.

Una lista de 2+ resultados = PRESENTE.

### TRANSICIÓN
Exige:
- origen;
- cambio real;
- destino.

`SIGUIENTE` / `ATRAS(scope=step)`:
- TRANSICIÓN durante el cambio;
- después PRESENTE u ORIENTAR.

No usar por recuperar, componer, esperar red o hablar.

### PAUSA
Solo para pausa funcional de Sabik:
- `PAUSE_ASSISTANT` → PAUSA.

No son PAUSA:
- pausar voz;
- silencio;
- Reduced Motion;
- error;
- espera de red.

### CONFIRMAR
Solo cuando:
- hay resultado concreto;
- la confirmación añade información útil;
- el cambio no es ya suficientemente perceptible.

No usar por defecto al:
- cambiar tamaño;
- activar vista sencilla;
- mostrar/ocultar detalles;
- avanzar paso.

No es recompensa.

## 5. S0 operation

| operation | B3 base |
|---|---|
| booting | PRESENTE |
| ready | PRESENTE |
| retrieving | PRESENTE |
| composing | PRESENTE |
| presenting | derivar por semántica; base PRESENTE |
| awaiting_clarification | PRESENTE |
| paused | PAUSA |
| error | PRESENTE |

## 6. S0 dialogue

`dialogue` no determina B3 por sí solo.

- information → PRESENTE
- practical → ORIENTAR solo con objetivo único
- clarification → PRESENTE
- correction → CONFIRMAR solo si aporta valor no perceptible
- insufficient → PRESENTE
- human_handoff → ORIENTAR solo con recurso/destino concreto

## 7. S0 speech

Speech nunca determina función B3:
- starting;
- speaking;
- paused;
- ended;
- error.

`speech_meta.energy` puede alimentar la representación de movimiento prevista por S0, pero **nunca cambia la función B3**.

## 8. S0 motion

`motion` es normativo para la representación del holograma dentro de S0.

Valores vigentes:
- off
- ambient
- processing
- voice_reactive
- protection_static

B3 define **qué comunica** la presencia.  
S0 motion define **cómo se representa técnicamente** dentro del contrato existente.

La preferencia Normal/Reducido/Sin movimiento permanece transversal y no altera el significado B3.

## 9. Eventos y acciones

| Evento/resultado | B3 |
|---|---|
| BOOT_OK | PRESENTE |
| SUBMIT | PRESENTE |
| RETRIEVAL_OK | PRESENTE |
| RETRIEVAL_EMPTY | PRESENTE |
| RESPONSE_READY informativo | PRESENTE |
| ASK_CLARIFICATION | PRESENTE |
| PAUSE_ASSISTANT | PAUSA |
| RESUME_ASSISTANT | recalcular; nunca CONFIRMAR por el mero resume |
| RESET_SESSION | PRESENTE |
| COLLAPSE / EXPAND | sin función nueva |
| SPEECH_* | sin función nueva |
| TECHNICAL_ERROR | PRESENTE + texto |
| RETRY | PRESENTE |
| lista de resultados | PRESENTE |
| destino único señalado | ORIENTAR |
| navegación real | TRANSICIÓN |
| preferencia perceptible aplicada | PRESENTE |
| resultado no perceptible que requiere acuse útil | CONFIRMAR |

## 10. Casos contractuales obligatorios

- búsqueda con 5 resultados → PRESENTE;
- cambio de tamaño → PRESENTE;
- pausar voz → B3 sin cambio;
- pausar asistente → PAUSA;
- error técnico durante `uncertain` → PRESENTE, protección S0 intacta;
- `RESUME_ASSISTANT` → recalcular desde S0 + último resultado, nunca CONFIRMAR automático;
- acción completada + siguiente paso concreto → ORIENTAR gana sobre CONFIRMAR;
- navegación a nueva etapa → TRANSICIÓN y después PRESENTE/ORIENTAR.
