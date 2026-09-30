# ECO · A6 · VIGILANCIA DE ESTÁNDARES Y COMPATIBILIDAD

Corte: 30/09/2026

## Regla

Eco debe registrar el **estatus** de cada fuente. Una publicación reciente no implica norma estable.

## Estándares / especificaciones

| Área | Documento | Estado observado | Uso Eco |
|---|---|---|---|
| Web Audio | Web Audio API 1.0 | W3C Recommendation · 17/06/2021 | base estable |
| Web Audio | Web Audio API 1.1 | Working Draft · 22/09/2026 | vigilancia / no requisito automático |
| WebRTC | WebRTC 1.0 | W3C Recommendation vigente | base realtime |
| Capture | Media Capture and Streams | Candidate Recommendation Draft | base de captura + privacidad |
| Recording | MediaStream Recording | Working Draft · 16/03/2026 | seguimiento |
| Media Capabilities | Media Capabilities | publicación WG · 09/06/2026 | capability/performance hints |
| MSE | Media Source Extensions | Working Draft · 07/08/2026 | streaming avanzado |
| WebCodecs | WebCodecs | Working Draft · 21/09/2026 | avanzado; soporte real por navegador |
| WebCodecs | Codec Registry | Draft Registry · 24/09/2026 | codec strings/interoperabilidad |
| WebCodecs | AAC Registration | Draft Note · 24/09/2026 | no implica soporte AAC obligatorio |
| WebCodecs | Opus Registration | Draft Note · 24/09/2026 | no implica soporte Opus obligatorio |
| Audio Output | Audio Output Devices API | Candidate Recommendation Draft | output routing |
| Audio Session | Audio Session | Working Draft · 13/11/2024 | vigilancia de integración OS |
| Media Session | Media Session | publicación WG · 05/06/2026 | platform controls |
| Autoplay | Autoplay Policy Detection | publicación WG · 04/09/2025 | detección de policy, no sustituye prueba |

## Calidad de audio/voz

| Documento | Estado |
|---|---|
| ITU-T P.835 (07/2026) | **In force**, aprobada 29/07/2026; SIG/BAK/OVRL |
| ITU-T P.808 (06/2021) | vigente para crowdsourced subjective speech quality |
| ITU-T P.863 | familia vigente para evaluación objetiva perceptual donde aplique |
| ITU-T P.862 / PESQ | **deleted/withdrawn 05/01/2024** |
| ITU-R BS.1770-5 (11/2023) | **In force**, loudness y true peak |
| EBU R128 v5.0 (11/2023) | -23 LUFS en workflow broadcast; no target universal |

## Navegadores

### Chromium / Chrome

Hecho operativo crítico:
Chromium documenta AAC entre los códecs propietarios limitados a Google Chrome.

Implicación:
- registrar binario exacto;
- no inferir Chrome Stable desde Playwright Chromium;
- usar control MP3/Opus/WAV;
- probar target real.

### Safari / WebKit

Revisar en cada ciclo:
- autoplay/user gesture;
- inline playback;
- HLS;
- capture;
- media recorder;
- WebRTC;
- versión iOS/macOS;
- output/background.

WebKit 18.4 amplió formatos de MediaRecorder y añadió Ogg/Opus/Vorbis en plataformas Apple modernas; una matriz vieja puede quedar obsoleta.

### WebCodecs

A 30/09/2026 sigue siendo Working Draft y `AudioDecoder`/`AudioEncoder` no son Baseline universal.

No diseñar un fallback crítico que dependa únicamente de WebCodecs sin matriz objetivo.

## Provider de voz AI

OpenAI docs revisadas al 30/09/2026:
- Audio & Voice;
- Voice Agents;
- Realtime;
- Text to Speech.

Arquitecturas actuales descritas:
- GPT-Live full duplex con backend delegado;
- Realtime speech-to-speech;
- chained STT → agent → TTS.

Eco debe vigilar:
- transporte;
- formatos;
- voces/modelos disponibles;
- turn handling;
- latency;
- disclosure/requisitos de proveedor;
- cambios de API.

Córtex conserva autoridad sobre provider/model.

## Frecuencia de vigilancia

Revisar antes de cualquier gate importante si han pasado:
- >30 días para browser/provider docs;
- >90 días para W3C drafts;
- inmediatamente si aparece una regresión o nueva versión de navegador/OS;
- al cambiar de modelo/provider;
- al añadir nuevo formato/códec/dispositivo.

## Qué NO hacer

- copiar una tabla de compatibilidad sin fecha;
- tratar “Baseline” como garantía para toda la población;
- tratar un Working Draft como obligación vigente;
- afirmar soporte por extensión de archivo;
- asumir codec availability por user agent;
- congelar una matriz de 2026 para siempre.

## Resultado

`ECO_MEDIA_STANDARDS_WATCHLIST_R01_ACTIVE`
