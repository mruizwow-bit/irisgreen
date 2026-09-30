# ECO · A6 · ESTUDIO AVANZADO R02

Fecha: 30/09/2026  
Estado: `ADVANCED_R02_STUDIED_CONTINUOUS`

## 1 · El fallo multimedia es una cadena, no un punto

Una misma frase “no suena” puede ser:
- asset corrupto;
- moov/index ausente;
- códec sin decoder;
- MIME incorrecto;
- range/seek roto;
- autoplay;
- `AudioContext` suspendido;
- salida equivocada;
- device permission;
- WebRTC jitter;
- TTS vacío;
- un test runner sin codec;
- un problema de hardware.

R02 obliga a diagnosticar por capas.

## 2 · Compatibilidad declarada vs efectiva

Tres niveles distintos:

1. **Declaración**: `canPlayType()`.
2. **Capacidad estimada**: Media Capabilities.
3. **Ejecución**: decodificar y reproducir realmente.

La verdad de producto vive en el tercero, apoyada por los dos primeros.

## 3 · Chromium ≠ Chrome

Chromium documenta AAC entre códecs propietarios limitados a Google Chrome. Los flags de build alteran el soporte reclamado.

Consecuencia:
- Playwright Chromium sigue siendo excelente para lógica/media estándar;
- para códecs sujetos al build, debe añadirse navegador branded/target real;
- el informe debe nombrar el binario probado.

Este patrón generaliza a hardware decoder, OS media framework y Safari/iOS.

## 4 · Container ≠ codec

`.m4a` describe un uso común de ISO-BMFF, no una garantía universal sobre el codec interno.

Un QA serio registra:
`container + codec + profile + sample_rate + channel_layout + duration + MIME + browser`.

## 5 · Latencia end-to-end de voz

No usar una cifra vaga.

Descomponer:
- captura/VAD;
- uplink;
- servidor/provider;
- razonamiento/tool;
- síntesis;
- primer chunk;
- downstream;
- jitter buffer;
- audio output.

Para una experiencia conversacional, también medir:
- tiempo hasta detectar fin de turno;
- tiempo hasta primer audio;
- respuesta completa;
- barge-in/interrupción;
- recuperación tras interrupción.

## 6 · Speech-to-speech vs pipeline encadenado

Pipeline STT → agente → TTS:
- mayor inspeccionabilidad;
- texto intermedio;
- componentes reemplazables;
- latencia acumulativa.

Speech-to-speech realtime:
- menor fricción/latencia potencial;
- conserva más información paralingüística;
- exige evals específicas de turn-taking, interrupción y salida de audio.

Full-duplex con backend:
- conversación puede continuar mientras backend trabaja;
- QA debe comprobar simultaneidad, preámbulos, delegación, interrupción y coherencia.

Eco valida; Córtex decide provider/model/arquitectura junto con Pulso según fronteras.

## 7 · Turn-taking y barge-in

Casos avanzados:
- usuario interrumpe TTS;
- ruido dispara falso turno;
- silencio prolongado;
- backchannel corto;
- frase incompleta;
- herramienta tarda;
- modelo habla encima;
- doble respuesta;
- audio residual después de cancelación.

Evidencia:
timestamps de input, VAD/turn events, cancel, first audio, stop output y transcript/event log.

## 8 · WebRTC: calidad no es solo packet loss

La experiencia depende de:
- jitter;
- buffer;
- loss;
- concealment;
- RTT;
- codec;
- CPU;
- input processing;
- output device.

`jitterBufferDelay / jitterBufferEmittedCount` ofrece un promedio útil; concealed samples ayudan a ver cuánto audio fue reconstruido/silenciado por pérdidas.

## 9 · Procesamiento de micrófono puede ser correcto o destructivo

Echo cancellation, AGC y noise suppression son valiosos para speech conversacional, pero pueden dañar:
- música;
- ambientes;
- análisis acústico;
- ciertos inputs no verbales.

Nunca asumir que “más procesamiento” = mejor.

## 10 · Calidad perceptual

Objetivo y subjetivo no son rivales.

- P.863: predictor objetivo de calidad de escucha en dominios previstos;
- P.800/P.808: evaluación subjetiva;
- P.835: separa calidad de habla, ruido y global;
- P.85: salida de voz/TTS.

Para voz sintética añadir:
- pronunciación;
- prosodia;
- inteligibilidad;
- naturalidad;
- coherencia;
- fatiga;
- adecuación al contexto.

## 11 · PESQ no es el default moderno

P.862/PESQ está eliminado desde enero de 2024.

Una base de pruebas nueva debe justificar cualquier uso legacy y preferir la familia vigente aplicable, particularmente P.863 cuando proceda.

## 12 · Loudness

BS.1770 y EBU R128 proporcionan medición seria de loudness/true peak.

Pero:
- broadcast;
- TTS;
- audio ambiental;
- notificaciones;
- música

no tienen necesariamente el mismo target de producto.

Eco mide primero y aplica target solo si está especificado.

## 13 · Audio accesible no significa “audio perfecto”

Para algunos usuarios, la mejor experiencia es:
- texto;
- silencio;
- subtítulos;
- control;
- menos estímulo;
- no tener que hablar.

Por eso voice-first nunca debe convertirse sin decisión en voice-only.

## 14 · Privacidad por diseño

Media capture puede exponer:
- voz;
- entorno;
- device labels;
- identificadores;
- patrones de uso.

El QA ideal usa:
- fixtures sintéticos;
- corpus consentido;
- datos minimizados;
- redacción de logs;
- retención corta.

El contenido hablado real no debe aparecer en logs técnicos por comodidad.

## 15 · Test pyramid de Eco

### L0 · static/probe
- hashes;
- signatures;
- ffprobe;
- MIME map.

### L1 · unit/API
- source selection;
- capability checks;
- state/error mapping.

### L2 · automated browser
- controls;
- play/reject;
- events;
- network.

### L3 · branded target browser
- codecs;
- OS integration;
- permissions.

### L4 · real device/hardware
- speakers;
- mics;
- Bluetooth;
- mobile interruptions.

### L5 · human/perceptual QA
- intelligibility;
- comfort;
- pronunciation;
- sensory load.

Un PASS inferior no reemplaza el siguiente nivel cuando el riesgo lo exige.

## 16 · Safari/iOS

No extrapolar desktop Chromium a iOS.

Validar:
- user gesture/autoplay;
- inline playback;
- HLS cuando aplique;
- device capture;
- background/interruption;
- output route;
- formatos reales soportados por versión objetivo.

## 17 · Observabilidad sin invadir

Preferir métricas:
- error class;
- latency;
- buffer;
- loss;
- codec;
- device class general;
- state transitions.

Evitar:
- guardar audio;
- transcripción completa;
- identificadores persistentes;
- nombres de dispositivo

salvo necesidad aprobada.

## 18 · Watchlist tecnológica

Revisar periódicamente:
- Web Audio 1.1;
- Media Capture;
- MediaStream Recording;
- Media Capabilities;
- Audio Output Devices;
- Audio Session;
- MSE;
- WebCodecs;
- browser codec matrices;
- Safari/WebKit releases;
- OpenAI Audio/Voice/Realtime docs si Sabik usa ese provider;
- ITU-T speech-quality revisions.

Cada borrador debe etiquetarse como borrador.

## Resultado profesional R02

Eco deja de preguntar solo:
> “¿Se oye?”

y pasa a preguntar:
> “¿Qué cadena de media estamos validando, en qué target, con qué codec/container/policy/device, qué medida define éxito y qué evidencia permite reproducir el resultado?”
