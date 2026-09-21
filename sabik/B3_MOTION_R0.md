# SABIK · B3 MOTION R0 · CANDIDATO DE PRODUCCIÓN

**Estado:** `SABIK_B3_MOTION_R0_CANDIDATE`  
**Base Sabik real:** `sabik-preview@96ebf38a535fa287f32fee8c7957ede39933365c`  
**Familia visual:** PR #181 @ `742e502802cdc9e3e7b154ddbb8493493c903898`  
**B3 estático:** PR #182 @ `e5f70cba76a4414527c10b0fbecfd549a7390e66`  
**Design compatibility:** PR #163 @ `851e6c17185e76ffbb4f4b5ab34fe5eb9fd9dd68`

> Candidato de desarrollo. H1 sigue pendiente. Motion R0 no declara superado ningún gate humano.

## Principio

El movimiento **explica un cambio funcional ya definido por B3**. No inventa función.

B3 conserva exactamente cinco estados:

**PRESENTE · ORIENTAR · TRANSICIÓN · PAUSA · CONFIRMAR**

No se crea Motion para buscar, componer, hablar, error, riesgo o loading.

## Contrato de tres niveles

| Nivel | Entrada | Resultado |
|---|---|---|
| NORMAL | sin reducción global/sistema y dispositivo con margen | transición breve de transform/opacity; nunca loop |
| REDUCIDO | `prefers-reduced-motion: reduce`, reducción global o degradación conservadora | desplazamiento mínimo o crossfade breve; sin rotación |
| SIN_MOVIMIENTO | preferencia manual Sabik | cambio inmediato al keyframe estático |

`prefers-reduced-motion` **nunca** produce NORMAL.

## Estados

### PRESENTE

- duración de entrada NORMAL: 220 ms;
- easing: `cubic-bezier(.2,.65,.25,1)`;
- amplitud: 0.04;
- desplazamiento/rotación: 0;
- escala: 1;
- opacidad: 1;
- permanencia: **quieto**; no existe respiración, pulso ni idle loop;
- entrada: baseline funcional;
- salida: cuando otra función B3 sea necesaria;
- interrupción: cancelar y continuar desde estilo computado.

### ORIENTAR

- duración NORMAL: 380 ms;
- easing: `cubic-bezier(.2,.78,.24,1)`;
- amplitud: 0.34;
- desplazamiento máximo: 7 px / −3 px;
- rotación máxima: −2,2°;
- escala: 1.008;
- opacidad: 1;
- entrada: la interfaz necesita dirigir a un siguiente elemento/paso;
- salida: cesa esa necesidad;
- interrupción: inmediata;
- prohibido: rebote, flecha, barrido repetitivo.

La dirección primaria está en el **keyframe estático ORIENTAR**; Motion solo hace legible la llegada.

### TRANSICIÓN

- duración NORMAL: 500 ms;
- easing: `cubic-bezier(.25,.1,.25,1)`;
- amplitud: 0.42;
- desplazamiento máximo: 4 px / −2 px;
- rotación máxima: −2,8°;
- escala: .992;
- opacidad: .98;
- entrada: cambio funcional B3 con origen/destino;
- salida: al alcanzar destino;
- interrupción: cancelar; nunca encolar giros;
- prohibido: 360°, spinner, periodicidad, “trabajando…”.

El estado TRANSICIÓN no se usa como indicador de retrieval/composing.

### PAUSA

- duración NORMAL: 300 ms;
- easing: `cubic-bezier(.22,.61,.36,1)`;
- amplitud: .18;
- desplazamiento/rotación: 0;
- escala: .955;
- opacidad: .78;
- entrada: PAUSA funcional;
- permanencia: estática y contenida;
- salida: reanudación/cambio;
- prohibido: apagarse, latir, parecer tristeza.

### CONFIRMAR

- duración NORMAL: 320 ms;
- easing: `cubic-bezier(.2,.7,.3,1)`;
- amplitud: .22;
- desplazamiento: 0 / −1 px;
- rotación: .5°;
- escala: .985;
- opacidad: 1;
- entrada: cierre funcional explícito;
- salida: tras tiempo mínimo de lectura o siguiente función;
- interrupción: inmediata;
- prohibido: bounce, confetti, flare, premio, check animado.

## Transición entre todos los pares

`b3-motion-tokens.json` contiene una matriz 5×5 para NORMAL, REDUCIDO y SIN_MOVIMIENTO.

Regla común:
- una sola animación B3 activa;
- una llegada nueva cancela la anterior;
- el destino visual siempre es el keyframe estático aceptado;
- misma-state → 0 ms;
- SIN_MOVIMIENTO → 0 ms en todos los pares.

## 60 Hz y rendimiento

Implementación R0:
- Web Animations API;
- únicamente `transform` y `opacity`;
- no anima layout, blur, filtros ni sombras;
- no usa un `requestAnimationFrame` continuo;
- PRESENTE no consume frames una vez asentado.

En equipos modestos, `hardwareConcurrency <= 4`, `deviceMemory <= 4` o `saveData` degradan NORMAL → REDUCIDO. Esto no cambia texto, función, Safety ni accesibilidad.

## Voz

Motion B3 no lee:
- energía;
- amplitud;
- fonemas;
- boundaries;
- cadencia de voz.

La voz es un canal independiente según DG-FINAL.

## H1

H1 sigue siendo el gate humano de discriminación/comprensión. R0 puede desarrollarse, pero queda marcado **candidate** hasta el gate correspondiente.

**NO MERGE · NO DEPLOY.**
