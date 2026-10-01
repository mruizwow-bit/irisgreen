# ECO · A6 · RUNBOOK DE DEGRADACIÓN REALTIME Y HARDWARE

Fecha: 01/10/2026

## Objetivo

Reproducir y clasificar fallos de una experiencia de voz bajo red, hardware y lifecycle reales.

## A · Baseline

Antes de degradar:
- misma build;
- mismo browser;
- mismo device;
- mismo mic/output;
- misma red limpia;
- misma fixture;
- misma configuración;
- 5+ repeticiones.

Guardar baseline p50/p95.

## B · Red

Perfiles:
- RTT;
- jitter;
- random loss;
- burst loss;
- bandwidth limit;
- reconnect;
- temporary offline;
- TURN-only cuando corresponda.

No combinar todos a la vez en primera pasada.

## C · WebRTC stats

Capturar cada intervalo:
- timestamp;
- inbound/outbound SSRC;
- packets;
- loss;
- jitter;
- jitter buffer;
- concealment;
- RTT;
- selected candidate pair;
- bitrate disponible cuando exista.

Guardar raw + derivadas.

## D · Opus resilience

Probar:
1. sin FEC;
2. in-band FEC;
3. loss aislado;
4. burst loss;
5. DTX/silence si está en alcance.

Medir:
- audible dropout;
- concealed samples;
- playout delay;
- bitrate;
- recovery.

FEC no es gratis:
puede añadir overhead/latency.

## E · Microphone processing

Matriz:
- AEC on/off;
- NS on/off;
- AGC on/off.

Fixtures:
- speech;
- music;
- far field;
- speaker echo;
- fan noise;
- keyboard;
- two speakers.

No asumir que un preset sirve para todo.

## F · Hardware route

Eventos:
- connect headset;
- disconnect headset;
- connect Bluetooth;
- switch speaker;
- lock/unlock;
- incoming interruption;
- background/foreground;
- mic revoked.

Esperar:
- estado UI correcto;
- stream/lifecycle correcto;
- no audio fantasma;
- recover o error explícito;
- no capture silenciosa.

## G · Bluetooth

Distinguir perfiles/rutas.

Especialmente en voz:
Bluetooth HFP puede cambiar:
- sample rate/bandwidth;
- input route;
- output route;
- latency.

Nunca comparar Bluetooth vs speaker sin etiquetar ruta real.

## H · Mobile thermal/power

Sesión larga:
- 15 min;
- 30 min;
- 60 min cuando producto lo requiera.

Registrar:
- audio dropouts;
- reconnects;
- drift;
- memory;
- CPU;
- battery/thermal indicators disponibles;
- background events.

Un soak sintético no sustituye teléfono real.

## I · Interruption matrix

- system notification;
- incoming call;
- media playback conflict;
- screen lock;
- route unplug;
- permission revocation;
- browser tab background;
- OS suspension.

Por caso:
- input state;
- output state;
- transcript;
- pending turn;
- backend task;
- UI;
- recovery.

## J · Failure classification

`NETWORK`
`CODEC`
`JITTER_BUFFER`
`CAPTURE`
`OUTPUT_ROUTE`
`AEC_NS_AGC`
`VAD_ENDPOINT`
`MODEL`
`TOOL`
`PLAYBACK_QUEUE`
`BROWSER`
`OS`
`HARDWARE`
`HARNESS`
`UNKNOWN`

## K · Rule

**Nunca “arreglar” una voz realtime cambiando tres capas a la vez.**

Cambiar una variable, repetir, comparar baseline.

## Resultado

`ECO_REALTIME_DEGRADATION_RUNBOOK_R01_READY`


## L · Evidencia didáctica de jitter buffer

`EVIDENCIA/ECO_JITTER_BUFFER_SIM_20261001.json`

La simulación no reemplaza `getStats()` ni NetEq real. Se conserva para enseñar y comprobar el razonamiento:

- buffer corto → más paquetes llegan tarde;
- buffer largo → menos late loss pero más playout latency;
- network loss no desaparece al ampliar el buffer.

En producción, medir el jitter buffer adaptativo real y correlacionarlo con concealment y audio audible.
