# ECO · A6 · METODOLOGÍA DE EVALUACIÓN STT, TTS Y VOICE AGENTS · R03

Fecha: 01/10/2026

## 1 · Principio

Una evaluación de voz tiene dos ejes que pueden fallar independientemente:

1. **contenido/acción**;
2. **audio/interacción**.

Una respuesta factual correcta puede ser una mala experiencia por:
- corte;
- silencio;
- overlap;
- mala pronunciación;
- latencia;
- barge-in roto.

Y una voz agradable puede ejecutar una acción equivocada.

## 2 · Ground truth

Regla crítica:
**el transcript generado por ASR no es ground truth del audio.**

Para evaluar percepción del sistema:
- conservar fixture de audio controlado;
- conservar reference transcript humano/curado;
- comparar ASR cuando el objetivo sea ASR;
- comparar task outcome cuando el objetivo sea el agente.

Un transcript limpio puede ocultar audio roto; un transcript malo puede no implicar que el modelo no comprendió el turno.

## 3 · STT

### Métrica base

NIST SCTK / sclite:
- correct;
- substitutions;
- deletions;
- insertions;
- sentence errors.

WER:
`(S + D + I) / N_ref`.

### WER no basta

Crear además:
- Critical Entity Error Rate;
- Number Error Rate;
- Negation Error Rate;
- Proper-Noun Error Rate;
- Language/locale error;
- Command semantic success.

Ejemplo:
“no reserves para el 15” → “reserva para el 15” puede tener WER bajo y riesgo semántico alto.

### Dataset

Etiquetas mínimas:
- language;
- region/accent;
- device;
- mic distance;
- SNR/noise class;
- codec;
- bandwidth;
- speaking rate;
- code-switch;
- intent;
- critical entities;
- expected outcome.

### Corpus Sabik ES/EN

Incluir:
- nombres propios;
- neurodiversidad/terminología;
- URLs/domains;
- fechas;
- números;
- edades;
- acrónimos;
- autocorrecciones;
- pausas;
- filler;
- habla rápida;
- susurro;
- voz baja;
- ruido doméstico;
- dos voces;
- Bluetooth;
- far-field;
- telephony-like bandlimit si aplica.

## 4 · TTS

### Capas

Evaluar separadamente:

**Text correctness**
- dice el contenido correcto;
- no omite;
- no añade.

**Pronunciation**
- nombres;
- acrónimos;
- números;
- idiomas;
- homógrafos.

**Intelligibility**
- se entiende a primera escucha.

**Naturalness**
- prosodia;
- timing;
- stress;
- pausas.

**Audio integrity**
- clipping;
- crackle;
- glitches;
- discontinuidades;
- gaps entre chunks.

**Interaction**
- first audio;
- stop;
- barge-in;
- resume;
- fallback.

### Evaluación subjetiva

P.85:
método de listening tests para voice-output devices/speech synthesis.

P.800/P.808:
base para pruebas subjetivas de calidad de speech.

P.835:
separar speech signal, background y overall cuando el caso lo requiera.

No mezclar escalas sin protocolo.

## 5 · Voice agent

### Crawl → Walk → Run

Adoptar la estrategia de evals realtime:

**Crawl**
- audio sintético;
- single turn;
- VAD off/manual commit;
- entorno determinista.

**Walk**
- audio real guardado;
- ruido/echo/compression;
- single turn;
- preprocessing igual a producción.

**Run**
- multi-turn;
- interrupciones;
- cambios de intención;
- tool errors;
- stateful interaction.

Después:
manual E2E con hardware real.

## 6 · Determinismo del harness

Fijar:
- audio bytes;
- preprocessing;
- sample rate;
- codec;
- chunk size;
- cadence;
- VAD config;
- model/provider version;
- prompt/config;
- tools;
- mock tool outputs;
- environment.

Para comparación:
**cambiar una variable cada vez**.

## 7 · Chunking

Para eval offline realtime:
- cadence constante;
- tamaño constante;
- timestamps guardados.

20 ms/chunk es una referencia práctica usada en la guía de eval Realtime; no es un requisito universal.

Chunking puede cambiar:
- VAD;
- latency;
- buffering;
- model behavior.

## 8 · VAD

Primero evaluar con VAD apagado para aislar modelo/agent.

Luego activar producción VAD y medir:
- false start;
- false stop;
- clipping;
- endpoint delay;
- interruptions;
- empty turn.

OpenAI Realtime actual distingue `server_vad` y otras configuraciones; registrar siempre la configuración exacta.

## 9 · Latencia de voice agent

No medir solo request→response.

Timestamps recomendados:
- user speech start;
- user speech stop;
- turn committed;
- delegation/backend start;
- first backend useful result;
- tool start;
- tool end;
- result submitted;
- first output audio received;
- first output audio actually played;
- final audio played.

Reportar:
- p50;
- p95;
- min/max;
- success-conditioned latency;
- failed/retry sessions por separado.

## 10 · Barge-in

Grader determinista:
- input speech starts at T0;
- assistant output must stop within threshold definido por producto;
- no queued old audio after stop;
- canceled response cannot later resume;
- task state remains coherent.

Grader humano:
- ¿el asistente cedió el turno de forma natural?;
- ¿cortó al usuario?;
- ¿hubo doble habla molesta?;
- ¿la recuperación tuvo sentido?.

## 11 · Task outcome

Verificar backend real, no solo spoken confirmation.

Ejemplo:
si Sabik dice “he cambiado X”, la acción debe estar realmente confirmada por el sistema.

Para Iris Green, si Sabik es informativo:
- fuente correcta;
- safety correcto;
- age correcto;
- respuesta visual/textual consistente con audio.

## 12 · Graders

### Deterministas
- tool;
- JSON/schema;
- timing;
- silence;
- overlap;
- transcript/entity exactness;
- audio duration;
- clipping;
- state transitions.

### LLM
- factuality;
- relevance;
- instruction following;
- clarification;
- conversational coherence.

### Audio/human
- pronunciation;
- naturalness;
- prosody;
- comfort;
- interruptions;
- sensory load.

No colapsar todos en una “nota mágica”.

## 13 · Producción → dataset

Cada fallo real:
1. preservar evidencia minimizada;
2. recrear fixture no sensible;
3. añadir tag;
4. añadir expected outcome;
5. añadir regression test;
6. comparar antes/después.

## 14 · OpenAI provider watch · 01/10/2026

Documentación vigente observada:

### Voice architectures
- GPT-Live: full duplex + backend separado;
- Realtime API: speech/reasoning/tools en una sesión;
- chained voice pipeline: STT → text agent → TTS.

### Realtime
Guía actual muestra modelos Realtime modernos y WebRTC browser flow.

### VAD
Realtime expone speech-start/speech-stop events y permite desactivar turn detection según modo/modelo.

### Transcription
Documentación actual recomienda `gpt-transcribe` para file transcription y dispone de rutas realtime para audio continuo; la configuración de delay introduce trade-off latency/accuracy y debe probarse con audio real.

### TTS
Speech endpoint actual ofrece streaming y múltiples voces/modelos; la documentación exige disclosure claro de que la voz es generada por IA.

### Eval
La documentación actual pide comparar:
- task success;
- audible latency;
- interruptions;
- unwanted silence;
manteniendo constantes caller/audio/model/tools/transport al comparar configuraciones.

Córtex decide provider/model.
Eco diseña/ejecuta evaluación media.

## 15 · Gate de evaluación Eco

No emitir PASS de voz por:
- una demo;
- una conversación;
- un transcript;
- un MOS aislado;
- una métrica de latency;
- un browser.

PASS exige:
- dataset versionado;
- negativos;
- hardware/targets;
- p50/p95;
- task + audio;
- human spot-check;
- failures backfilled;
- reproducibilidad;
- privacidad.

## Fuentes

- NIST SCTK / sclite
- ITU-T P.85, P.800, P.808, P.835
- OpenAI Realtime Eval Guide 25/01/2026
- OpenAI GPT-Live / Voice Agents docs
- OpenAI current Realtime VAD / transcription / TTS docs

## Resultado

`ECO_VOICE_EVAL_METHOD_R03_DEFINED`
