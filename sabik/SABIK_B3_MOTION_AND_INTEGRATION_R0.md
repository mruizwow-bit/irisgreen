# SABIK_B3_MOTION_AND_INTEGRATION_R0

**Estado:** `SABIK_B3_MOTION_AND_INTEGRATION_R0_READY`  
**Tipo:** candidato de producción; gates humanos pendientes  
**NO MERGE · NO DEPLOY**

## Bases congeladas

- Familia visual #181: `742e502802cdc9e3e7b154ddbb8493493c903898`
- B3 estático / H1 #182: `e5f70cba76a4414527c10b0fbecfd549a7390e66`
- Design compatibility #163: `851e6c17185e76ffbb4f4b5ab34fe5eb9fd9dd68`
- Sabik real registrado al crear rama: `sabik-preview@96ebf38a535fa287f32fee8c7957ede39933365c`

## ID-14 · Motion B3

Rama separada:

`agent3/sabik-b3-motion-r0`

PR separado y draft.

Artefactos:
- `sabik/b3-motion-tokens.json`
- `sabik/b3-motion.js`
- `sabik/B3_MOTION_R0.md`

Cinco estados exactos:
- PRESENTE
- ORIENTAR
- TRANSICIÓN
- PAUSA
- CONFIRMAR

Motion no crea estados conversacionales.

### Invariantes

- PRESENTE se asienta y queda quieto.
- ORIENTAR no rebota ni dibuja una flecha.
- TRANSICIÓN no gira en loop y no sirve de loading.
- PAUSA queda contenida y visible.
- CONFIRMAR no celebra ni premia.
- una sola animación B3 activa;
- nueva entrada cancela la anterior;
- transform + opacity únicamente;
- no `requestAnimationFrame` permanente;
- no spinner/latido/respiración.

## ACC-07 · tres niveles

- `NORMAL`
- `REDUCIDO`
- `SIN_MOVIMIENTO`

`prefers-reduced-motion: reduce`, la reducción global de Iris Green o degradación conservadora de dispositivo llevan como mínimo a REDUCIDO.

La preferencia local puede fijar SIN_MOVIMIENTO.

Texto, Safety y función no desaparecen en ningún nivel.

## ID-15 · integración real

Rama:

`agent3/sabik-b3-integration-r0`

La interfaz real `/es/nea/` carga:
- `b3-motion.js`
- `voice-ui-adapter.js`
- `cognitive-preferences.js`
- `b3-integration.js`

La integración observa la presentación existente; **no escribe en Core/S0**.

Proyección:
- ready/presenting/retrieving/composing/error/risk → PRESENTE + capa existente;
- awaiting clarification / correction → ORIENTAR;
- paused → PAUSA;
- TRANSICIÓN y CONFIRMAR se exponen como funciones de presentación explícitas, no como loading;
- voz no cambia B3.

## Activos visuales congelados

El código resuelve los 15 keyframes en:

`/sabik/assets/b3/<presencia>_<estado>.png`

Los binarios se distribuyen en un paquete auditado separado:

`SABIK_B3_RUNTIME_ASSETS_R0.zip`

- SHA-256: `82373796ff32bb9f3834f1c59472c5f5f25ea5b81393a29ed1d993971ed3b218`
- 15 PNG 64×64 + manifest;
- derivados LANCZOS de R1 aceptado;
- ningún rediseño semántico/geométrico.

`ASSET_MANIFEST.json` congela tamaño/hash de cada archivo y `tools/stage-sabik-b3-assets-r0.py` verifica cada byte antes de copiarlo.

Sin staging, la integración mantiene el holograma existente como fallback. Por tanto el PR no debe desplegarse sin el paquete auditado.

## ACC-06 · controles cognitivos

Se reutilizan controles globales Iris Green para:
- tamaño de texto;
- tipografía/espaciado;
- interlineado;
- ancho;
- contraste;
- reducción de movimiento.

Sabik añade solo:
- movimiento local: automático / reducido / sin movimiento;
- densidad: completa / reducida / paso a paso;
- voz candidata detrás de S2;
- intensidad visual: reutiliza “Bajar intensidad”.

No existe un segundo control local de contraste/tamaño/espaciado.

## ACC-08 · voz

Implementado contrato UI con adaptador abstracto:
- on/off;
- volumen;
- velocidad;
- repetir;
- etiquetas;
- foco normal de controles nativos;
- ARIA descriptiva;
- disabled states.

Motor R0:
`NullVoiceAdapter`

Por tanto:
- ElevenLabs: NO;
- API externa: NO;
- TTS remoto: NO;
- autoplay: NO;
- micrófono: NO;
- speech synthesis local como sustituto de S2: NO.

## ACC-09 · lectura

El candidato hereda `IGPreferences`:
- escala de texto;
- fuente;
- letter/word spacing;
- line-height;
- ancho máximo;
- contraste;
- movimiento.

Se evita doble aplicar la escala: el root rem global es la única fuente de aumento.

CSS incluye cierre específico a 320 CSS px y los tests R0 vigilan que no se introduzca una segunda escala local.

200 % / 400 % / 320 px siguen siendo gates de navegador/AT además de este contrato de implementación.

## ACC-10 · carga cognitiva

Densidad:
- completa;
- reducida;
- paso a paso.

En el Sabik real actual la respuesta es texto continuo. R0 **no la trunca** ni inventa pasos semánticos.

Los modos cambian disposición/espaciado, y “paso a paso” queda listo para contenido futuro explícitamente estructurado. Se mantienen:
- respuesta completa;
- Safety;
- límites;
- fuentes/procedencia;
- controles esenciales.

## BR-04

`sabik/BRAND_GUIDE_FINAL_R0.md` consolida:
- T1;
- Matriz/Web/IA/Educa;
- tamaños/fondos;
- sistema verbal;
- contraste;
- B3;
- Motion;
- prohibiciones;
- no antropomorfización.

## Pruebas R0

- `tools/test-sabik-b3-motion-r0.js`
- `tools/test-sabik-b3-integration-r0.js`
- `tools/test-sabik-cognitive-r0.js`
- regresión S0 existente;
- regresión Sabik page existente;
- cierre estático A11Y existente.

Workflow:
`.github/workflows/comprobar-sabik-b3-r0.yml`

No se infiere validación humana desde estas pruebas.

## Diferencias respecto a #181 / #182

### #181

**0 cambios** en:
- masters;
- geometrías;
- paletas;
- wordmark;
- cuatro presencias.

R0 consume derivados de la familia; no modifica su fuente.

### #182

**0 cambios** en:
- B3_STATE_GRAMMAR_V1;
- 15 keyframes R1;
- H1;
- secuencias;
- respuestas;
- matrices humanas.

R0 añade Motion e integración en ramas nuevas.

## S0

No se modifica:
- `sabik/nea-core/**`;
- `sabik/S0_STATE_MACHINE.md`;
- `sabik/sabik-page.js`.

La proyección B3 es una capa posterior de presentación.

**Cambio semántico S0: 0.**

## Gates pendientes

- H1 continúa pendiente;
- percepción/compresión no se inventa;
- Motion R0 e Integration R0 siguen etiquetados como candidatos;
- S2 permanece cerrado.

**NO MERGE · NO DEPLOY.**
