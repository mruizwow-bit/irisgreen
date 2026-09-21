# SABIK_B3_MOTION_AND_INTEGRATION_R0

**Estado:** `SABIK_B3_MOTION_AND_INTEGRATION_R0_READY`  
**Tipo:** candidato de producción; gates humanos pendientes  
**Issue coordinador:** #196  
**NO MERGE · NO DEPLOY**

## Bases congeladas

- Familia visual #181: `742e502802cdc9e3e7b154ddbb8493493c903898`
- B3 estático / H1 #182: `e5f70cba76a4414527c10b0fbecfd549a7390e66`
- Design compatibility #163: `851e6c17185e76ffbb4f4b5ab34fe5eb9fd9dd68`
- Sabik real: `sabik-preview@96ebf38a535fa287f32fee8c7957ede39933365c`

## ID-14 · Motion B3

Artefactos:
- `sabik/b3-motion-tokens.json`
- `sabik/b3-motion.js`
- `sabik/B3_MOTION_R0.md`

Estados únicos:
- PRESENTE
- ORIENTAR
- TRANSICIÓN
- PAUSA
- CONFIRMAR

Invariantes:
- PRESENTE se asienta y queda quieto;
- ORIENTAR no rebota ni dibuja una flecha;
- TRANSICIÓN no gira en loop y no sirve de loading;
- PAUSA queda contenida y visible;
- CONFIRMAR no celebra ni premia;
- una sola animación B3 activa;
- nueva entrada cancela la anterior;
- transform + opacity únicamente;
- no `requestAnimationFrame` permanente;
- no spinner, latido o respiración.

## ACC-07 · tres niveles

- `NORMAL`
- `REDUCIDO`
- `SIN_MOVIMIENTO`

`prefers-reduced-motion: reduce`, la reducción global de Iris Green o degradación conservadora de dispositivo llevan como mínimo a REDUCIDO.

La preferencia local puede fijar SIN_MOVIMIENTO.

Texto, Safety y función permanecen en todos los niveles.

## ID-15 · integración real

La interfaz real `/es/nea/` carga:
- `b3-motion.js`
- `voice-ui-adapter.js`
- `cognitive-preferences.js`
- `b3-integration.js`

La integración observa la presentación existente y **no escribe en Core/S0**.

Proyección:
- ready/presenting/retrieving/composing/error/risk → PRESENTE + capa existente;
- awaiting clarification / correction → ORIENTAR;
- paused → PAUSA;
- TRANSICIÓN se usa solo para un cambio funcional/presentacional explícito;
- CONFIRMAR se usa solo tras un cambio local que requiere confirmación;
- voz no cambia B3.

## Activo visual de runtime

El runtime consume 15 derivados WebP versionados en:

`sabik/assets/b3/`

- un archivo por presencia × estado;
- dimensión mínima: 64×64;
- SHA-256, bytes y dimensiones reales por archivo en `ASSET_MANIFEST.json`;
- fallback: holograma legacy visible si el derivado solicitado no carga;
- fuentes: keyframes R1 congelados de #182;
- #181/#182 permanecen sin cambios.


## ACC-06 · controles cognitivos

Se reutilizan controles globales Iris Green para:
- tamaño de texto;
- tipografía/espaciado;
- interlineado;
- ancho;
- contraste;
- reducción de movimiento.

Sabik añade solo:
- movimiento local: normal / reducido / sin movimiento;
- densidad: completa / reducida / paso a paso;
- voz candidata detrás de S2;
- intensidad visual: reutiliza “Bajar intensidad”.

No existe un segundo control local de contraste/tamaño/espaciado.

## ACC-08 · voz

Contrato UI con adaptador abstracto:
- on/off;
- volumen;
- velocidad;
- repetir;
- etiquetas;
- foco nativo;
- ARIA;
- disabled states.

Motor R0: `NullVoiceAdapter`.

No hay:
- ElevenLabs;
- API externa;
- TTS remoto;
- autoplay;
- micrófono;
- speech synthesis local usado como sustituto de S2.

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

Los tests R0 mantienen 320 CSS px como guardarraíl estático; 200 % y 400 % siguen requiriendo comprobación de navegador/AT además del contrato.

## ACC-10 · carga cognitiva

Densidad:
- completa;
- reducida;
- paso a paso.

R0 **no trunca** la respuesta actual ni inventa pasos semánticos.

Los modos cambian disposición/espaciado. Se mantienen:
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
**0 cambios** en masters, geometrías, paletas, wordmark y cuatro presencias.

### #182
**0 cambios** en B3_STATE_GRAMMAR_V1, 15 keyframes R1, H1, secuencias, respuestas o matrices humanas.

R0 solo consume las fuentes congeladas.

## S0

No se modifica:
- `sabik/nea-core/**`;
- `sabik/S0_STATE_MACHINE.md`;
- `sabik/sabik-page.js`.

La proyección B3 es una capa posterior de presentación.

**Cambio semántico S0: 0.**

## Reversión

El spike se revierte eliminando:
- los cuatro scripts R0 cargados por `/es/nea/`;
- el sprite y manifest B3;
- el bloque CSS R0;
- los documentos/tests/workflow R0.

El Core/S0 y la familia congelada no requieren rollback porque no se modifican.

## Gates pendientes

- H1 continúa pendiente;
- no se inventan resultados de percepción/comprensión;
- Motion e Integration R0 siguen etiquetados como candidatos;
- S2 permanece cerrado.

**NO MERGE · NO DEPLOY.**
