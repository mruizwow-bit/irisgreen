# B3_LEGACY_COMPATIBILITY_MATRIX_V1

**Fuente revisada:** PR #163 · `Design · especificación de estados, voz y movimiento` · HEAD `05ebcfddd268a9378e2c776c728031f04c51ff7f`.

Esta matriz no modifica ni fusiona #163. Clasifica sus conceptos frente al núcleo B3 actual.

| Concepto heredado #163 | Clasificación | Relación con B3 actual | Decisión |
|---|---|---|---|
| Arrancando / `booting` | `UI_LAYER` | Estado operativo de arranque | No crear keyframe B3 propio. PRESENTE puede coexistir con texto de arranque. |
| Listo / `ready` | `CURRENT_B3` | Equivale al baseline funcional | Mapear a **PRESENTE**. |
| Buscando / `retrieving` | `UI_LAYER` | Progreso operativo | No es estado B3. Usar texto/progreso de UI; B3 solo TRANSICIÓN si existe un cambio funcional real. |
| Componiendo / `composing` | `UI_LAYER` | Progreso operativo | No es estado B3. No reintroducir “pensando”. |
| Respuesta preparada / `presenting` | `UI_LAYER` | Disponibilidad de contenido | No mapear automáticamente a CONFIRMAR. PRESENTE puede acompañar la respuesta. |
| Esperando aclaración | `UI_LAYER` | Turn-taking / solicitud de información | Puede activar ORIENTAR si la UI necesita dirigir a una opción concreta; no es estado B3 por sí mismo. |
| Corrección | `NEEDS_REVIEW` | Puede implicar orientación o confirmación según la acción | Resolver caso a caso; no crear sexto estado. |
| Sabik pausado / `paused` | `CURRENT_B3` | Contención funcional | Mapear a **PAUSA**. |
| Error técnico / `error` | `UI_LAYER` | Fallo operativo | Mensaje y controles de error en UI. No crear ERROR en B3. |
| Riesgo incierto / `uncertain` | `SAFETY_LAYER` | Protección S0 | No crear estado emocional B3. Menos estímulo y más claridad. |
| Riesgo / `risk` | `SAFETY_LAYER` | Protección S0 | `protection_static`; B3 no sustituye Safety. |
| Derivación humana / `human_handoff` | `SAFETY_LAYER` | Recurso humano prioritario | No es estado B3. |
| Voz iniciando / `starting` | `VOICE_LAYER` | Canal de voz | B3 permanece en uno de los cinco estados funcionales. |
| Hablando / `speaking` | `VOICE_LAYER` | Canal de voz | No crear forma “hablando”. |
| Voz pausada / `speech paused` | `VOICE_LAYER` | Pausa del canal de voz | No confundir con **PAUSA B3**. |
| Voz finalizada / `ended` | `VOICE_LAYER` | Canal de voz | Sin estado B3 propio. |
| Error de voz | `VOICE_LAYER` | Error del canal de voz | Mensaje de UI/voz; no B3. |
| `voice_reactive` | `VOICE_LAYER` | Movimiento de ondas | Fuera de Fase 3A. |
| `processing` | `UI_LAYER` | Intención de movimiento operativa | No definir motion todavía; no es estado B3. |
| `protection_static` | `SAFETY_LAYER` | Movimiento/quietud de protección | Se mantiene separado del núcleo B3. |
| Plegado / Oculto | `UI_LAYER` | Estado de contenedor | No modifica el núcleo B3. |
| `low_intensity` | `UI_LAYER` | Preferencia explícita de reducción de estímulo | Se conserva en Safety y UI; no es estado B3. |
| hover / focus / pressed / disabled | `UI_LAYER` | Estado de controles | No forma parte de la presencia B3. |
| Bajar intensidad / Más corto / Una opción / Evitar preguntas | `UI_LAYER` | Preferencias y controles | No son estados B3. |
| “Respuesta lista” como celebración | `OBSOLETE` | Contradice la semántica actual | CONFIRMAR no es premio ni “correcto”. |
| “Pensando”, “Loading”, “Speaking” como núcleo visual | `OBSOLETE` | Multiplica el núcleo y mezcla capas | Prohibido en el B3 actual. |

## Regla de compatibilidad

El paquete #163 sigue siendo antecedente útil para **UI, voz, Safety, controles y accesibilidad**, pero no es fuente de verdad del núcleo B3 actual.

**VOZ = contenido/canal.**  
**B3 = función.**  
**SAFETY = protección.**

Nada de esta matriz autoriza cambios en #163.