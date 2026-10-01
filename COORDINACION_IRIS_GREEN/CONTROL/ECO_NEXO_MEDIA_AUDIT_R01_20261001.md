# ECO · A6 · AUDITORÍA VOZ, AUDIO & MEDIA · CARRIL C NEXO

Fecha: 01/10/2026  
Issue coordinador: #353  
Autoridad de producto: María  
Jefatura: Nexo · Continuidad Técnica & Sistemas  
Modo: READ-ONLY / RESEARCH / ANALYSIS  
Estado: ECO_NEXO_MEDIA_AUDIT_R01_READY_FOR_NEXO

## 0 · Pregunta central

¿La capa de voz/media puede servir a personas con perfiles comunicativos y sensoriales distintos de forma estable y comprensible?

Regla aplicada:

COMPONENT_PASS != SYSTEM_PASS

No se asigna PASS de hardware, voz conversacional, STT/TTS o realtime cuando esa evidencia no existe.

---

## 1 · Alcance y referencias inspeccionadas

### Coordinación

- Nexo #353.
- Base de esta rama: b753746dccaba59d5968cfa1c65567a85f907ec6.
- Decisión de producto Sabik Web / Motion: #354.
- Criterio semántico adoptado: MOTION = SYSTEM_STATE_COMMUNICATION, NOT DECORATION.

### Código / candidatos

Se separan deliberadamente cuatro estados para no mezclar evidencia:

1. main observado: ad7ea66254be7be44d7e97b4ca19ae8ac42ba6b5. Es anterior a los carriles de recuperación y no se usa como sustituto del estado integrado actual.
2. A2 integración R67: agent2/sabik-iris-r08-20260924@8ea50128b490207b4dd5508c3c46692f5be69c87.
3. AS-IS visual declarado por #354: agent3/r52-correct-new-sabik-r37-motion-20260928@9c34acf4736acaecc7b4d532572d7e67ea358d2f.
4. R69 candidato posterior: astra/r69-unified-interface-recovery-20260930@6f6392f833a4d1d6716ecabec4e192b70d180b0b.

R69 se trata como candidato, no como producto aceptado.

### Evidencia histórica reutilizada

- reports/audio-diagnostic.json · SHA ed3748eeadf73be607f6b00026564b555ff1da6b.
- scripts/diagnose_audio.py · SHA 9d49d330a115d8b8c3f04cca74e1c1d86f40d503.

---

# 2 · Resumen ejecutivo

La capa media actual tiene buenas defensas parciales: voz fija opt-in, texto siempre disponible, no autoplay, materialización verificada de WAV, fallback textual, controles de movimiento y una mitigación específica de AAC en la música global.

Pero Sabik Web todavía no es un sistema conversacional de voz. El runtime inspeccionado sigue siendo texto + mensajes WAV fijos. No hay en el montaje actual captura de micrófono, STT, TTS dinámico de respuestas, WebRTC de voz, endpointing, barge-in, estadísticas realtime, rutas de dispositivo, evidencia mobile/hardware ni una ruta visual/AAC para personas que no usan texto ni habla como canal principal.

La nueva decisión semántica de Motion todavía necesita un contrato real con estados de voz. El R37 AS-IS no comunica escuchar/procesar/hablar; el candidato R69 introduce movimiento continuo del cuerpo completo que ya no encaja con el criterio nuevo de núcleo estable.

La oportunidad fuerte es que no hace falta construir un segundo Sabik: el core R66 ya acepta inputMode, por lo que voz y entrada visual pueden desembocar en el mismo turno/safety/sesión.

---

# 3 · Hallazgos

## ECO-C01 · MEDIA_GAP · Sabik Web sigue siendo text-first, no voice conversational

HALLAZGO  
El core R66 declara un camino común para texto/voz, pero el montaje web actual solo lo usa como texto.

EVIDENCIA
- sabik/conversation-core-r66.mjs expone submitTurn(text,{inputMode='text', ...}), propaga inputMode y mantiene un único lifecycle de turno.
- sabik/iris-mount.mjs llama conversation.submitTurn con inputMode:'text'.
- No contiene getUserMedia(), control de micrófono, STT, TTS dinámico ni WebRTC.
- El copy R69 declara que las respuestas conversacionales dinámicas por voz todavía no sustituyen al texto.
- El test R67 browser se describe literalmente como Sabik text conversation y valida texto/fuentes/fallback local.

IMPACTO  
La visión R66 de voz/texto → mismo Core/Safety/sesión → respuesta → TTS no está implementada de extremo a extremo.

PROPUESTA  
Conservar el core único. Añadir voz como adaptador de entrada/salida sobre el mismo submitTurn, no crear un segundo asistente. Definir antes de implementar:
- mic/STT → inputMode:'voice';
- transcript visible/editable;
- stop/cancel;
- TTS vinculado a la misma respuesta textual;
- fallo STT/TTS que vuelve a texto, no que bloquea Sabik.

DEPENDENCIA  
Pulso, Córtex, Prisma, Axioma, Vigía, Vector.

PRIORIDAD SUGERIDA  
NOW · contrato; implementación solo tras gate de arquitectura/Producto.

---

## ECO-C02 · VOICE_RISK · La voz fija tiene integridad probada, pero no experiencia audible E2E probada

HALLAZGO  
Los 30 WAV fijos tienen una cadena de integridad buena, pero los tests localizados no demuestran reproducción real, calidad perceptual o hardware.

EVIDENCIA
- sabik/audio-r01.mjs SHA 07377196aac6832616a53804117e8e59b6b127f1.
- Voz OFF por defecto, preload='none', cancelación antes de nueva pieza, verificación hash de texto y tratamiento de errores play().
- manifest.runtime.json: 30 entradas ES/EN con hashes de texto y audio.
- scripts/materialize_sabik_audio_r01.py reconstruye y verifica los 30 WAV antes de publicar.
- build_site.py ejecuta la materialización.
- test_sabik_audio_assets_r01.py valida RIFF/WAVE + tamaño + SHA.
- test_sabik_audio_r01.mjs usa fakeAudio() para lógica.
- test_sabik_presence_r52_browser.py activa setVoiceActive(true), pero no reproduce audio real.

No se localizó evidencia actual de:
- 30/30 playback en browsers objetivo;
- time-to-first-audio;
- clipping/dropout;
- loudness entre piezas;
- pronunciación/comfort ES/EN;
- iOS/Android/Bluetooth.

IMPACTO  
Existe PASS de integridad/control, no PASS de experiencia audible.

PROPUESTA  
Crear un gate separado:
1. materializar dist exacto;
2. reproducir 30/30 en browsers target;
3. registrar play(), MediaError, duración y first-audio;
4. medir loudness/true peak;
5. HUMAN QA estructurado de inteligibilidad, pronunciación, naturalidad y carga sensorial;
6. repetir en móvil/hardware.

No regrabar nada hasta tener evidencia de fallo.

DEPENDENCIA  
Eco + Vector; Axioma para criterios; María HUMAN QA.

PRIORIDAD SUGERIDA  
NOW · evidence gate.

---

## ECO-C03 · REALTIME_RISK · No existe todavía evidencia de endpointing, barge-in o WebRTC

HALLAZGO  
La capa actual no tiene transporte realtime de voz ni harness de conversación hablada.

EVIDENCIA
- no getUserMedia en mount;
- no PeerConnection/WebRTC;
- no VAD/endpointing;
- no TTS dinámico que pueda sufrir barge-in;
- tests R67 cubren texto;
- cancel() de WAV fijo no demuestra interrupción conversacional.

IMPACTO  
No puede afirmarse latencia de voz, time-to-first-useful-audio, turn-taking, recuperación ante jitter/loss, routing de mic/altavoz o continuidad de backend durante interrupciones.

PROPUESTA  
Antes de decidir arquitectura final, comparar por evals las clases que Córtex/Pulso consideren. La documentación actual de OpenAI, solo como referencia tecnológica y no como elección de provider, distingue:
- full-duplex con backend delegado;
- Realtime speech-to-speech;
- pipeline encadenado STT → agent → TTS.

El harness Eco debe separar:
- speech start/stop;
- turn commit;
- backend/tool;
- first audio recibido;
- first audio reproducido;
- stop latency;
- task outcome real.

Para endpointing:
- PTT/manual commit como baseline determinista;
- VAD de silencio;
- VAD semántico si la arquitectura elegida lo ofrece.

DEPENDENCIA  
Pulso + Córtex + Vigía + Eco.

PRIORIDAD SUGERIDA  
NOW · definir harness/SLI antes de realtime.

Fuentes:
https://developers.openai.com/api/docs/guides/voice-agents
https://developers.openai.com/api/docs/guides/realtime
https://developers.openai.com/api/docs/guides/realtime-vad
https://developers.openai.com/cookbook/examples/realtime_eval_guide

---

## ECO-C04 · REALTIME_RISK · Jitter/packet-loss no tienen todavía contrato observable

HALLAZGO  
No existe una sesión WebRTC Sabik de la que obtener métricas; por tanto no hay evidencia de degradación de voz.

EVIDENCIA  
W3C WebRTC Stats expone:
- jitterBufferDelay;
- jitterBufferTargetDelay;
- jitterBufferEmittedCount;
- concealedSamples;
- silentConcealedSamples;
- concealmentEvents.

El promedio de buffer puede derivarse como jitterBufferDelay / jitterBufferEmittedCount.

No existe en el runtime Sabik auditado una ruta que genere estas métricas.

IMPACTO  
Sin contrato de métricas, “la voz se corta” puede confundirse con red, jitter buffer, decoder, endpointing, provider, playback o device route.

PROPUESTA  
Cuando exista WebRTC, acordar con Vigía un paquete mínimo sin contenido hablado:
- RTT;
- jitter;
- packet loss;
- jitter-buffer delay;
- concealment ratio/events;
- first-audio latency;
- reconnect;
- route/device class general no identificable.

DEPENDENCIA  
Vigía + Pulso + Eco.

PRIORIDAD SUGERIDA  
NEXT · instrumentación junto al primer prototipo realtime.

Fuente:
https://www.w3.org/TR/webrtc-stats/

---

## ECO-C05 · MEDIA_GAP · El Rincón conserva una dependencia AAC/M4A sin fallback específico

HALLAZGO  
El reproductor musical global ya filtra M4A si el browser no declara AAC; el audio del Rincón no replica esa protección para el mar.

EVIDENCIA
- assets/musica.js sonda canPlayType('audio/mp4; codecs="mp4a.40.2"'), filtra .m4a cuando AAC no está disponible, mantiene MP3 y maneja play() reject/error.
- reports/audio-diagnostic.json demostró Chromium 140: M4A/AAC → NotSupportedError / MediaError 4; MP3 → PASS; Chrome 152 → M4A/AAC PASS.
- commit d7572a9cba3373b1e06cf95a6b9b7864b581c5f3: “Hacer el reproductor compatible con pistas soportadas por cada navegador”.
- assets/rincon-audio-r42.js fija SEA='/audio/rincon/r04/scenes.m4a', usa fetch + decodeAudioData y no negocia codec alternativo.
- si falla, emite ig:r42-audio-error.
- el resto de soundscapes R42 se genera localmente tras gesto explícito.

IMPACTO  
En un browser/build sin AAC, el sonido opcional de mar puede desaparecer aunque el resto del Rincón siga funcionando.

PROPUESTA  
No sustituir audio aceptado sin evidencia. Preparar una política común de capability/fallback:
- formato alternativo first-party, o
- fallback silencioso explícito y comprensible, o
- soundscape local equivalente aprobado.

DEPENDENCIA  
Eco + Lumen/Motor + Vector + Astra; María si cambia audio aprobado.

PRIORIDAD SUGERIDA  
NEXT · riesgo localizado.

---

## ECO-C06 · PERCEPTUAL_QUALITY · La nueva gramática Motion no existe todavía en el AS-IS

HALLAZGO  
La decisión de María define reposo, escuchando, procesando, respondiendo y degradado, pero R37 no los comunica como voz.

EVIDENCIA
- sabik/sabik-motion-r37.js comenta: “Retrieval, composing, ordinary responses, errors, safety and voice do not animate.”
- retrieval/composing/error proyectan a presente.
- no existen estados LISTENING/PROCESSING/SPEAKING.
- setVoiceActive(active) AS-IS solo cambia data-voice-active.
- #353/#354 ya adoptan MOTION = SYSTEM_STATE_COMMUNICATION, NOT DECORATION.

IMPACTO  
Una persona no puede inferir de forma consistente por el comportamiento visual si Sabik escucha, procesa o habla.

PROPUESTA  
Pulso entrega estados semánticos. Eco define requisitos perceptivos:
- LISTENING: recepción/convergencia suave;
- PROCESSING: actividad interna, no traslación del cuerpo;
- SPEAKING: expansión/pulsación lenta;
- DEGRADED: menos actividad, nunca alarma.

No ligar el movimiento directamente a la amplitud instantánea de TTS. Si se usa energía de audio, aplicar una envolvente suavizada y límites. REDUCIDO/SIN_MOVIMIENTO deben conservar significado mediante forma/composición/etiqueta.

DEPENDENCIA  
Pulso + Motor + Prisma + Axioma + Eco; Astra gate.

PRIORIDAD SUGERIDA  
NOW · #354.

---

## ECO-C07 · PERCEPTUAL_QUALITY · R69 no debe confundirse con la solución Motion aprobada

HALLAZGO  
R69 mejora lifecycle/visibilidad, pero introduce movimiento continuo del contenedor visual que contradice la nueva dirección de núcleo estable.

EVIDENCIA  
R69 iris-mount.css:
- PRESENTE ≈ 5.6 s;
- ORIENTAR 4.6 s;
- TRANSICIÓN 3.8 s;
- CONFIRMAR 3.2 s;
- voice-active acelera a 2.7 s;
- keyframes normales incluyen translate3d + rotación + escala continua.
- REDUCIDO reduce mucho el movimiento y SIN_MOVIMIENTO lo elimina.

#354 ordena centro estable, respiración suave, sin saltos y transformación interna con significado.

IMPACTO  
Aceptar R69 como dirección final preservaría una dinámica que María ya ha identificado como perceptualmente incorrecta.

PROPUESTA  
KEEP de R69:
- lifecycle;
- pausa por visibilidad;
- reduced/no-motion;
- separación de capa visual.

NO KEEP automático:
- traslación/rotación continua;
- acelerar el cuerpo completo al hablar.

Reutilizar infraestructura, sustituir gramática.

DEPENDENCIA  
Motor/Prisma/Pulso/Eco/Axioma/Astra.

PRIORIDAD SUGERIDA  
NOW · dentro de #354.

---

## ECO-C08 · ACCESSIBILITY · Sabik conserva buenos fallbacks que deben ser invariantes

HALLAZGO  
Hay decisiones actuales que reducen riesgo sensorial y de acceso y deberían declararse invariantes.

EVIDENCIA
- texto siempre disponible;
- textarea y botón de envío;
- voz fija opt-in y OFF por defecto;
- no autoplay;
- preload='none';
- Cancelar/Empezar de nuevo;
- status/live region;
- NORMAL / REDUCIDO / SIN_MOVIMIENTO;
- respuesta textual + fuentes;
- R66 prohíbe always-listening.

Media Capture and Streams exige consentimiento explícito para micrófono y advierte del carácter sensible y fingerprintable de información de dispositivos.

IMPACTO  
Una implementación voice-first que elimine estos caminos convertiría una mejora modal en una barrera.

PROPUESTA  
Non-regression contract:
- voz nunca obligatoria;
- mic solo por gesto;
- stop/cancel visible;
- transcript visible;
- respuesta textual equivalente;
- TTS mute/stop;
- no autoplay;
- no persistencia por defecto;
- motion no obligatorio;
- error de voz vuelve a texto.

DEPENDENCIA  
Axioma + Pulso + Vigía + Eco + Lex en obligaciones.

PRIORIDAD SUGERIDA  
NOW · requisito previo.

Fuente:
https://www.w3.org/TR/mediacapture-streams/

---

## ECO-C09 · ACCESSIBILITY · Falta una ruta de comunicación visual/no verbal en Sabik

HALLAZGO  
El único input conversacional visible es texto. Una futura entrada por micrófono ampliaría modalidades, pero seguiría sin cubrir a personas que necesitan símbolos/AAC o una entrada visual más directa.

EVIDENCIA
- sabik/iris-panel.html: textarea, sin composer de símbolos.
- assets/data/pictogramas-iris.js SHA 8a444b32c9ea3caabdd519c1f4a459a6a68f5d7e contiene cientos de referencias SVG con texto ES/EN.
- existen símbolos como hablar, preguntar, silencio, descansar y muchas acciones/objetos.
- existe manifiesto/licencia bajo assets/pictogramas/.

W3C COGA recomienda símbolos familiares, claros y sin saturar la interfaz. WAI-Adapt mantiene trabajo específico sobre símbolos/AAC.

IMPACTO  
La visión de Sabik para personas no verbales no está representada todavía en la interfaz conversacional.

PROPUESTA  
Estudiar un modo opcional “Comunicar con símbolos”:
- no sustituye texto;
- no obliga a voz;
- usa subconjunto familiar/personalizable;
- composición visible de intención/frase;
- representación textual transparente antes de enviar;
- mismo submitTurn/Safety/sesión;
- corregir/borrar/confirmar;
- no inferir emociones desde pictogramas.

No crear un nuevo set antes de auditar/reutilizar el corpus existente.

DEPENDENCIA  
Prisma/Senda, Axioma, Pulso, Atlas, Lex si hay alcance de licencia nuevo, Eco.

PRIORIDAD SUGERIDA  
NEXT · prototipo + user testing.

Fuentes:
https://www.w3.org/TR/coga-usable/
https://www.w3.org/WAI/adapt/
https://www.w3.org/TR/adapt-symbols/

---

## ECO-C10 · MEDIA_GAP · La música global tiene buena mitigación AAC, pero no encontré regression test específico

HALLAZGO  
La lógica es defensiva, pero la protección parece depender de código sin un test específico localizado.

EVIDENCIA
- assets/musica.js filtra M4A según AAC;
- play() errors se muestran;
- audio solo tras gesto;
- volumen controlable;
- existe diagnóstico histórico;
- la búsqueda de tests de music/audio localizó tests de Sabik audio, no del reproductor global.

IMPACTO  
Un refactor futuro puede eliminar accidentalmente el filtro que corrigió una regresión real.

PROPUESTA  
En fase de ejecución:
- test unit de filtrado AAC;
- browser test con canPlayType simulado;
- control MP3;
- test de play() reject;
- conservar diagnóstico histórico como fixture.

DEPENDENCIA  
Eco + owner frontend/runtime + Vector CI.

PRIORIDAD SUGERIDA  
NEXT · safe quality win.

---

## ECO-C11 · PERCEPTUAL_QUALITY · No hay gate transversal de loudness/comfort entre superficies

HALLAZGO  
No se localizó una matriz actual que compare niveles/comfort entre WAV de Sabik, música global, Rincón y futuro TTS dinámico.

EVIDENCIA
- música global arranca a volume=.6;
- Rincón usa buses/targets propios y sliders limitados;
- Sabik WAV depende del archivo + volumen de salida;
- no se localizó un artefacto reciente de loudness/true-peak transversal.

Esto es evidence gap, no afirmación de inconsistencia audible.

IMPACTO  
Un cambio entre superficies puede producir saltos de nivel o fatiga aunque cada componente aislado funcione.

PROPUESTA  
Crear Media Comfort Gate:
- integrated/short-term loudness cuando aplique;
- true peak;
- fade in/out;
- primer transitorio;
- comparación Sabik ↔ música ↔ Rincón;
- auriculares/altavoz;
- evaluación humana de confort.

No imponer -23 LUFS de broadcast como target web universal.

DEPENDENCIA  
Eco + Lumen + Axioma + María HUMAN QA.

PRIORIDAD SUGERIDA  
NEXT · antes de TTS dinámico por defecto.

---

## ECO-C12 · HARDWARE_PENDING · Mobile/browser/device sigue sin evidencia suficiente

HALLAZGO  
No hay evidencia actual para declarar voice/media PASS en hardware objetivo.

EVIDENCIA FALTANTE
- Safari/iPhone físico;
- Android físicos;
- Bluetooth HFP;
- auriculares;
- cambios input/output;
- background/lock;
- interrupciones OS;
- permission revoke;
- mic distante/ruidoso;
- route switch durante turno;
- sesiones largas.

Safari 26.0 añadió, entre otros cambios WebRTC, Speaker Selection API en iOS/iPadOS; la matriz real debe estar versionada por navegador/OS.

IMPACTO  
Los fallos de rutas, permiso y latencia pueden aparecer solo en dispositivo real.

PROPUESTA  
Mantener marcador PENDING_HARDWARE_QA hasta completar matriz mínima.

DEPENDENCIA  
Eco + Vector preview + hardware real; Vigía para métricas.

PRIORIDAD SUGERIDA  
NOW para reservar el gate; LATER para ejecución física.

Fuente:
https://webkit.org/blog/17333/webkit-features-in-safari-26-0/

---

# 4 · KEEP / NO REGRESSION

## KEEP-01 · Texto como base común
La voz debe complementar, no sustituir el path textual.

## KEEP-02 · Un único core
conversation-core-r66.mjs ya admite inputMode. Aprovecharlo para voz y futuras modalidades visuales.

## KEEP-03 · Voz fija opt-in e íntegra
Mantener OFF por defecto, preload='none', hash texto↔audio, cancelación, materialización verificada y mensajes fijos como fallback/sistema.

## KEEP-04 · Música: aprendizaje convertido en defensa
Mantener filtro AAC/MP3 y error accesible.

## KEEP-05 · Rincón: nada empieza solo
Mantener sonido opt-in, volumen, video silencioso separado, reduced/no-motion, sonido first-party y stop/fades.

## KEEP-06 · Privacidad observable
Mantener no always-listening, no audio/transcript persistente por defecto y texto siempre disponible.

---

# 5 · Dirección de validación sugerida para voz Sabik

Eco no elige provider/model.

## V0 · Contrato multimodal
- submitTurn único;
- input modes text / voice / visual-symbol;
- transcript/representación visible;
- cancel/reset;
- mismo safety/age/retrieval;
- output text siempre;
- TTS opcional.

## V1 · Baseline controlable
- push-to-talk o commit manual;
- single-turn;
- audio fixture;
- texto final;
- TTS;
- sin VAD complejo.

## V2 · Turn-taking
- VAD/endpointing;
- barge-in;
- interruption;
- noisy input;
- pausas/hesitación.

## V3 · Realtime/mobile
- WebRTC si procede;
- stats;
- network impairment;
- reconnect;
- Bluetooth/routes;
- iOS/Android.

## V4 · Evals continuas
INCIDENT → fixture no sensible → grader → regression.

---

# 6 · SLI / evidencia mínima

## Entrada
- mic permission state;
- speech start/stop;
- turn committed;
- input mode;
- locale;
- STT partial/final timing;
- sin contenido crudo en telemetría por defecto.

## Backend
Owner Pulso/Córtex/Vigía:
- turn/operation ID;
- tool timing;
- retrieval timing;
- cancel/retry.

## Salida
- first audio received;
- first audio actually played;
- audio completed;
- stop requested/effective;
- playback error;
- output route class general.

## WebRTC
- RTT;
- jitter;
- packet loss;
- jitter-buffer average;
- concealment;
- reconnect.

## Evals
- task success;
- critical entity errors;
- WER/CER solo donde aporten;
- pronunciation;
- intelligibility;
- comfort;
- interruption behavior;
- p50/p95 audible latency.

---

# 7 · NOW / NEXT / LATER propuesto por Eco

## NOW
1. Declarar invariantes accessibility/privacy de voz.
2. Conectar Motion #354 al contrato de estados Pulso↔Eco.
3. Diseñar eval harness antes de construir realtime.
4. Crear gate audible real para 30 WAV.
5. Mantener protección AAC global.
6. Registrar scenes.m4a del Rincón como riesgo codec localizado.

## NEXT
1. Prototipo voz sobre el mismo core R66.
2. PTT baseline → VAD/endpointing.
3. Prototipo opcional de comunicación visual con pictogramas existentes.
4. WebRTC stats + evidence minimizada con Vigía.
5. Media Comfort Gate transversal.
6. Regression tests música/AAC.

## LATER
1. iOS/Android/Bluetooth real.
2. Network impairment/TURN.
3. Soak 30–60 min.
4. HUMAN QA perceptual ES/EN.
5. Comparativa arquitectura/provider cuando Córtex presente opciones.
6. Activar voz por defecto solo si Producto lo decide tras evidencia.

---

# 8 · Handoffs

### Nexo
Cruzar common turn contract, evidence contract, semantic state contract y fallback contract.

### Pulso
inputMode voice, mic/STT lifecycle, turn commit, cancel/barge-in, LISTENING/PROCESSING/SPEAKING/DEGRADED, fallback text.

### Vigía
media SLI sin contenido sensible, WebRTC stats, correlation IDs, device-route failure taxonomy.

### Córtex
comparar arquitectura/provider con latency, task success, interruptions, inspectability, cost y fallback. Sin migración hoy.

### Motor / Prisma
#354, input modes, visual/AAC prototype, lifecycle media.

### Axioma
motion meaning NORMAL/REDUCIDO/SIN_MOVIMIENTO, mic/stop/TTS controls, símbolos/user testing, text fallback.

### Vector
exact dist + browser/device matrix + preview tras gates.

---

# 9 · Evidencia que Eco NO tiene

PENDING:
- mic Sabik real;
- STT Sabik real;
- TTS dinámico real;
- voice WebRTC real;
- barge-in real;
- jitter/loss real;
- iOS/Android;
- Bluetooth;
- cross-surface loudness medido;
- human perceptual QA de voz dinámica.

Eco no emite SYSTEM PASS.

---

# 10 · Fuentes externas actuales

W3C/WAI:
- https://www.w3.org/TR/mediacapture-streams/
- https://www.w3.org/TR/webrtc-stats/
- https://www.w3.org/TR/webrtc/
- https://www.w3.org/TR/coga-usable/
- https://www.w3.org/WAI/adapt/
- https://www.w3.org/TR/adapt-symbols/

WebKit:
- https://webkit.org/blog/17333/webkit-features-in-safari-26-0/

OpenAI · contexto tecnológico, provider decision = Córtex:
- https://developers.openai.com/api/docs/guides/voice-agents
- https://developers.openai.com/api/docs/guides/live
- https://developers.openai.com/api/docs/guides/realtime
- https://developers.openai.com/api/docs/guides/realtime-vad
- https://developers.openai.com/cookbook/examples/realtime_eval_guide

---

# 11 · Cierre

Estado:
ECO_NEXO_MEDIA_AUDIT_R01_READY_FOR_NEXO

No se ha modificado producto, hecho build nuevo, merge, deploy, cambiado audio, activado micrófono, afirmado hardware PASS ni elegido provider/model.

Principio final:

La voz de Sabik debe ser una modalidad del mismo sistema seguro, no un sistema paralelo.
La media debe comunicar estado y comprensión, no añadir estimulación por sí misma.
Sin hardware/evidencia real, Eco mantiene PENDING.
