# ADDENDUM R66 · SABIK CONVERSACIONAL · VOZ WEB DINÁMICA · 29/09/2026

Estado: `R66_SABIK_CONVERSATIONAL_VOICE_CONTRACT_ADOPTED`

Ámbito: **Sabik Web únicamente**.

## 1. Decisión canónica

Cuando la persona decide usar voz, Sabik funciona como asistente conversacional de voz tipo Alexa:

`voz/texto → mismo Core/Safety/sesión → Cloud/retrieval cuando proceda → respuesta textual → fuentes → voz Sabik dinámica si el turno es hablado`.

La Biblioteca Cloud es el **conocimiento** de Sabik.
No es la voz.
No sustituye al Core.
No convierte el producto en un buscador de tarjetas.

## 2. Precedencia

Este addendum supersede, para Sabik Web, cualquier regla anterior que limite el producto a:
- web sin micrófono;
- web sin STT;
- web sin TTS dinámico;
- voz web compuesta solo por mensajes WAV fijos;
- retrieval presentado como respuesta final.

Se conserva de las reglas históricas:
- texto siempre disponible;
- no escucha permanente;
- no autoplay;
- privacidad/minimización;
- no perfiles diagnósticos;
- no inferencias emocionales;
- B3 seguro;
- child-safe;
- citas/fuentes;
- Core portable.

## 3. Entrada hablada

Micrófono:
- solo por acción explícita;
- sin wake word/always-listening en R66 Web;
- permiso solo tras gesto;
- stop/cancel visible;
- transcripción visible;
- mismo flujo de turno que teclado;
- no guardar audio/transcripción por defecto.

## 4. Salida hablada

La respuesta dinámica usa la identidad vocal aprobada de Sabik.

Los 30 WAV `SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED` siguen válidos para mensajes fijos/sistema/fallback, pero NO sustituyen la síntesis dinámica de una respuesta conversacional.

No usar como sustituto final:
- SpeechSynthesis del navegador;
- voces genéricas del sistema;
- voces comerciales/terceras no aprobadas.

## 5. Core

No construir un segundo asistente.

Reconciliar el Core histórico PRE-#144:
`sabik/nea-core/{intent,retrieval,decision,response,risk,corrections,session,knowledge,...}`

con:
- Safety vigente;
- age taxonomy vigente;
- Cloud R04;
- UI Sabik actual;
- Motion R37;
- voz aprobada.

Texto y voz comparten sesión, intención, safety, corrections y response.

## 6. Cloud

R51/A9 mantiene propiedad de la Biblioteca Cloud:
- corpus;
- citas;
- child-safe;
- age;
- versionado;
- updater;
- releases privadas.

R66/A2 consume ese conocimiento.
A9 no implementa voz.

El candidato R04 parcial puede usarse en preview privada respetando HOLDs fail-closed.
El gate final de Sabik debe consumir la R04 final aceptada cuando exista.

## 7. Estados visuales

B3 sigue siendo:
- PRESENTE;
- ORIENTAR;
- TRANSICIÓN;
- PAUSA;
- CONFIRMAR.

Escuchando/transcribiendo/hablando son subestados operativos, no estados cognitivos/emocionales nuevos.

Mapeo:
- idle → PRESENTE;
- escribir/escuchar → ORIENTAR;
- STT/Core/retrieval/composición → TRANSICIÓN;
- respuesta/TTS → CONFIRMAR;
- cancel/error/stop → PAUSA.

## 8. Edad y safety

IDs:
- `AGE_0_12`
- `AGE_13_17`
- `AGE_18_PLUS`
- `ALL_AGES`

`GENERAL` = sin selección, no banda de edad.

Age/safety filtran antes de ranking y antes de respuesta.
La voz nunca verbaliza contenido que el texto no podría mostrar.

## 9. Privacidad

Por defecto:
- no audio persistente;
- no transcripciones persistentes;
- no conversación completa persistente;
- no entrenamiento con audio/turnos;
- no query/audio en logs de aplicación;
- no-store;
- temporales efímeros;
- reset/cancel limpia turnos pendientes.

## 10. Accesibilidad

Siempre existe equivalente textual.
Mic, stop, mute/voice y estados tienen nombres accesibles.
No depender solo del color.
Teclado/foco/lector de pantalla obligatorios.
NORMAL/REDUCIDO/SIN_MOVIMIENTO se mantienen y la voz puede funcionar sin movimiento.

## 11. Integración

Responsable: A2.
Issue operativo: #332 / R66.

No main.
No producción.
HUMAN QA María obligatoria antes de salida.

Este addendum es específico de Sabik y NO convierte micrófono/TTS en requisito global de Iris Green.
