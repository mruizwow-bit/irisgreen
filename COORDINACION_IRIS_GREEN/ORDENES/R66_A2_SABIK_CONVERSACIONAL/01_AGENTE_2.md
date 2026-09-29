# R66 · A2 · SABIK TIPO ALEXA · CORE + CLOUD + STT/TTS + VOZ CONVERSACIONAL ES/EN

Fecha: 29/09/2026  
Issue: #332  
Responsable: Agente 2  
Revisión: Astra  
Aceptación: HUMAN QA María

Estado:
`R66_A2_SABIK_CONVERSATIONAL_INTEGRATION_ORDERED`

## Objetivo

Cerrar Sabik como asistente conversacional real:

`persona habla o escribe → mismo Core/Safety/sesión → Cloud cuando proceda → respuesta textual con fuentes → Sabik habla si el turno es hablado`.

La Biblioteca Cloud es conocimiento, no voz.
No aceptar como cierre “consulta → lista de resultados”.

## Base

Rama A2:
`agent2/sabik-iris-r08-20260924`

HEAD observado al emitir:
`a7e65891872dd3597b37c2f612fd64f5cc6a4ddd`

Releer HEAD/tree antes de tocar.

Runtime vivo:
- Sabik actual/nuevo;
- 5 masters Web R01;
- Motion R37;
- textarea;
- retrieval actual;
- audio-r01.mjs con WAV fijos;
- sin mic conversacional;
- Cloud histórica en mount-config.

## Reutilizar Core histórico

Baseline:
`sabik-preview@efa4ed9b71d9e766f7b32830793f6b711aa5574a`

Reconciliar:
- nea-core/intent.js
- nea-core/retrieval.js
- nea-core/decision.js
- nea-core/response.js
- nea-core/risk.js
- nea-core/corrections.js
- nea-core/session.js
- nea-core/knowledge.js
- state/language

No restaurar UI antigua.
No copiar el baseline entero.
No crear segundo Core.

Texto y voz terminan en la misma ruta:
`submitTurn(text,{inputMode,locale,session,audience})`.

## Cloud R04

Candidato privado parcial disponible:
`sabik-r04-private-partial-20260929-f3f72e4e075b`
deploy `6abb66029456439c4426d0ca`.

Puede usarse para construir/QA privada:
- 2.366 entidades activas;
- 352 HOLD quedan fuera;
- age/safety antes de ranking;
- citas verificadas.

No declarar R04 final hasta el marcador final A9/Astra.
Para el gate final R66, migrar a R04 final aceptada.

## Respuesta

Pipeline:
`INPUT → SAFETY → INTENT/CORRECTIONS/SESSION → RETRIEVAL → RESPONSE → SOURCES → TTS`.

La respuesta:
- aparece en texto;
- es clara y breve;
- se basa en evidencia recuperada;
- conserva fuentes;
- no inventa;
- no diagnostica;
- puede mantener contexto/correcciones dentro de la sesión actual.

Fuentes = evidencia secundaria bajo la respuesta, no UI principal de “resultados”.

## Micrófono/STT

Añadir:
ES `Hablar con Sabik`
EN `Talk to Sabik`

Requisitos:
- acción explícita;
- permiso solo tras gesto;
- no always-listening;
- no wake word en R66 Web;
- escuchar/transcribir/stop/cancel;
- transcripción visible/editable;
- mismo submitTurn que teclado;
- cancel descarta audio/resultado tardío.

STT final:
- adaptador server-side/self-hosted;
- reutilizar selección aprobada si existe;
- si falta, decidir desde candidatos I3 con evidencia ES/EN, privacidad, licencia, latencia y coste;
- no Web Speech API remota como dependencia final silenciosa;
- no persistir audio/transcripción.

## TTS dinámico

Usar identidad Sabik aprobada de #172:
- ES master aprobado;
- EN master V2 seed 9112;
- Qwen3-TTS/artefacto aprobado cuando corresponda;
- masters humanos fuera de GitHub.

No:
- SpeechSynthesis como sustituto final;
- otra voz;
- proveedor comercial no aprobado;
- reentrenar por iniciativa de A2.

Si falta runtime ejecutable EN:
`R66_DYNAMIC_TTS_EN_RUNTIME_ARTIFACT_REQUIRED`.
No bloquea el resto de integración, sí bloquea el marcador final ES/EN.

## 30 WAV R01

KEEP.

Usarlos para mensajes fijos/sistema/fallback.

Separar APIs:
- `systemVoice.playFixed(id)`
- `conversationVoice.speak(text,locale)`

No fingir respuesta dinámica con WAV fijos.

## B3 / Motion

Mantener:
PRESENTE / ORIENTAR / TRANSICIÓN / PAUSA / CONFIRMAR.

Mapeo:
- idle → PRESENTE;
- escribir/escuchar → ORIENTAR;
- STT/Core/retrieval/response → TRANSICIÓN;
- respuesta lista/TTS → CONFIRMAR;
- cancelar/error → PAUSA;
- fin → PRESENTE.

Listening/speaking son flags operativos, no B3 nuevos.

Mantener NORMAL / REDUCIDO / SIN_MOVIMIENTO.
Voz funciona aunque motion esté OFF.

## Panel final

Debe incluir:
- visual Sabik actual;
- respuesta principal;
- textarea + Enviar;
- Hablar con Sabik;
- Parar escucha/Cancelar;
- Activar/Silenciar voz;
- Parar voz;
- fuentes secundarias;
- Motion;
- Reset;
- live status accesible.

Retirar copy de producto que reduzca Sabik a “buscar información” y “solo mensajes fijos”.

## Sesión

Alternar texto↔voz sin perder:
- contexto;
- correcciones;
- idioma;
- safety/audience;
- fuentes/contexto de sesión que el Core necesite.

Reset borra contexto Sabik de esa sesión.
No historia persistente por defecto.

## Privacidad

No almacenar por defecto:
- audio;
- transcript;
- chat completo;
- respuesta hablada;
- consultas identificadas;
- datos sensibles.

No-store, logs sanitizados, temporales efímeros.

## Age/safety

Usar:
AGE_0_12 / AGE_13_17 / AGE_18_PLUS / ALL_AGES.
GENERAL = estado sin filtro.

Filtrar antes de retrieval y response.
La salida de voz nunca amplía lo permitido en texto.

## Fallos

STT/permiso:
texto sigue funcionando.

Cloud:
no inventar; mostrar fallo recuperable.

TTS:
texto/fuentes quedan; no sustituir voz.

Cancel:
aborta capture/STT/request/Core/retrieval/TTS y descarta tardíos.

## QA

Texto ES/EN:
- query;
- follow-up;
- correction;
- reset;
- citations;
- no result;
- Cloud error;
- cancel.

Voz ES/EN:
- permission;
- listening;
- transcript;
- same Core;
- answer;
- dynamic TTS;
- stop;
- second turn;
- alternar voz/texto.

Safety:
- GENERAL;
- AGE_0_12;
- AGE_13_17;
- AGE_18_PLUS no-intent;
- AGE_18_PLUS explicit intent;
- safe variant;
- R04 holds excluded.

Visual:
- estados B3 reales;
- NORMAL/REDUCIDO/SIN_MOVIMIENTO;
- 1440/390/320.

A11y:
- teclado/foco;
- mic/stop labels;
- live region;
- transcripción editable;
- lector pantalla;
- equivalente textual.

Performance:
- STT final;
- Core/retrieval;
- response;
- TTS first audio;
- total turn;
- memory;
- payload;
- mobile.

## Marcadores

Intermedio contra R04 privada parcial:
`R66_A2_SABIK_CONVERSATIONAL_PRIVATE_PREVIEW_READY_FOR_ASTRA`

Final, solo con R04 final + STT/TTS ES/EN reales:
`R66_A2_SABIK_ALEXA_STYLE_ES_EN_PREVIEW_READY_FOR_MARIA`

STOP para Astra/HUMAN QA.

No main.
No producción.

## Normativa

Aplica:
`NORMATIVA/ADDENDUM_R66_SABIK_CONVERSATIONAL_VOICE_20260929.md`
más normativa transversal vigente.
