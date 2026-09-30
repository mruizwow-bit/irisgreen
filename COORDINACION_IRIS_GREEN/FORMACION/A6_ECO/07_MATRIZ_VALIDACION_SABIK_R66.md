# ECO · A6 · MATRIZ DE VALIDACIÓN SABIK R66

Fecha: 30/09/2026  
Fuente canónica de producto leída:
`NORMATIVA/ADDENDUM_R66_SABIK_CONVERSATIONAL_VOICE_20260929.md`

Estado R66 observado:
`R66_SABIK_CONVERSATIONAL_VOICE_CONTRACT_ADOPTED`

## Contrato que Eco deberá validar

`voz/texto → mismo Core/Safety/sesión → Cloud/retrieval cuando proceda → respuesta textual → fuentes → voz Sabik dinámica si el turno es hablado`

No se ejecuta producto durante esta jornada. Esta matriz deja preparados los gates de Eco.

## A · Activación de micrófono

PASS solo si:
- requiere acción explícita;
- no hay wake word;
- no always-listening;
- permiso aparece tras gesto;
- stop/cancel visible;
- puede abandonarse la captura;
- no se reactiva sola tras cancel/reset.

Negativos:
- permiso denegado;
- permiso revocado;
- mic no disponible;
- device desaparece;
- background;
- doble click;
- navegación durante captura.

## B · Privacidad

Comprobar:
- no audio persistente por defecto;
- no transcript persistente por defecto;
- no conversación completa persistente;
- no query/audio en logs de aplicación;
- temporales efímeros;
- cancel/reset limpia turnos pendientes.

Eco no audita obligación jurídica; entrega evidencia a Lex/Vigía.

## C · Texto/voz comparten turno

Para la misma intención:
- mismo Core;
- mismo Safety;
- misma sesión;
- mismas corrections;
- mismo response;
- mismas fuentes.

La voz no puede verbalizar contenido que el texto no mostraría.

Test:
repetir fixtures equivalentes por teclado y voz y comparar intención/safety/respuesta factual.

## D · STT ES/EN

Corpus mínimo:
- español España;
- inglés;
- nombres propios;
- cifras;
- fechas;
- acrónimos;
- negaciones;
- preguntas cortas;
- frases largas;
- ruido moderado;
- code-switching.

Evidencia:
- transcript visible;
- transcript final;
- errores críticos;
- latencia;
- posibilidad de cancelar/corregir.

## E · TTS dinámico Sabik

Validar:
- identidad vocal aprobada;
- ES/EN;
- pronunciación;
- cifras/fechas;
- fuentes/citas: decidir qué se verbaliza y qué queda visual según contrato;
- no truncado;
- no doble voz;
- no overlap accidental;
- streaming sin huecos anómalos;
- time-to-first-audio;
- stop inmediato;
- cancel real;
- nueva respuesta no arrastra audio anterior.

Los 30 WAV R01:
- sistema/fallback;
- no sustituyen síntesis dinámica de respuesta.

## F · Alternativa textual

PASS solo si:
- texto siempre disponible;
- persona puede usar Sabik sin micrófono;
- respuesta hablada conserva equivalente textual;
- error de TTS no bloquea la respuesta textual;
- error de STT permite volver a texto.

## G · Estados operativos

Mapeo canónico:
- idle → PRESENTE;
- escribir/escuchar → ORIENTAR;
- STT/Core/retrieval/composición → TRANSICIÓN;
- respuesta/TTS → CONFIRMAR;
- cancel/error/stop → PAUSA.

Eco valida sincronía entre:
- estado visual;
- capture;
- transcript;
- TTS;
- cancel.

No inventar estados emocionales.

## H · Barge-in/interrupción

Casos:
1. usuario habla mientras TTS suena;
2. pulsa stop;
3. empieza nuevo turno;
4. TTS acaba al mismo tiempo que entra voz;
5. red se corta durante TTS;
6. tool/backend tarda;
7. usuario cancela durante TRANSICIÓN.

Comprobar:
- audio viejo se detiene;
- no quedan buffers;
- sesión conserva consistencia;
- no aparece respuesta duplicada.

## I · Device matrix

Cuando exista hardware:
- speaker integrado;
- auriculares cableados;
- Bluetooth;
- mic integrado;
- headset;
- cambio de output;
- conexión/desconexión durante sesión.

Plataformas:
- desktop Chrome;
- Firefox;
- Safari/macOS;
- iOS Safari;
- Android Chrome;
- Edge si población objetivo.

## J · Network matrix

Perfilar:
- normal;
- RTT elevado;
- jitter;
- packet loss;
- offline temporal;
- reconnect.

Medir:
- turn latency;
- first audio;
- dropout;
- concealment cuando haya WebRTC;
- recuperación.

## K · Accesibilidad / baja estimulación

Con Axioma:
- mic/stop/mute/voice con nombre accesible;
- foco/teclado;
- estados no solo por color;
- texto equivalente;
- voz compatible con NORMAL/REDUCIDO/SIN_MOVIMIENTO;
- no autoplay;
- no audio inesperado;
- control de volumen/stop según superficie;
- no obligación de hablar.

## L · Evidence pack mínimo

Por caso:
- commit/deploy;
- browser/version;
- OS/device;
- permission state;
- input/output device class;
- session/turn id no sensible;
- timestamps;
- transcript fixture;
- TTS fixture;
- audio format;
- state transitions;
- errors;
- metrics;
- PASS/FAIL/PENDING;
- limitaciones.

## M · Gate Eco propuesto

Eco solo puede emitir:
`ECO_R66_MEDIA_VALIDATION_PASS`

cuando:
- matriz target real ejecutada;
- negativos ejecutados;
- no hay P0/P1 media abierto;
- privacidad observable coincide con contrato;
- texto fallback funciona;
- TTS/STT ES/EN cumplen criterios definidos;
- evidencia queda archivada;
- Axioma/Lex/Vigía/Pulso/Córtex han resuelto sus dominios cuando corresponda.

Ese marcador **no sustituye**:
- gate de arquitectura;
- gate de Axioma;
- gate legal;
- integración A2;
- HUMAN QA María.
