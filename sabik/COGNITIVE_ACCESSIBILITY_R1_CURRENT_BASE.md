# SABIK · ACCESIBILIDAD COGNITIVA R1 · CURRENT PREVIEW

## ACC-06

Se reutiliza `IGPreferences` para:
- tamaño;
- fuente;
- letter/word spacing;
- interlineado;
- ancho de lectura;
- contraste;
- reducción global de movimiento.

Sabik añade solo:
- movimiento local;
- densidad;
- voz candidata;
- intensidad visual mediante el control ya existente.

## ACC-07

`NORMAL · REDUCIDO · SIN_MOVIMIENTO`

Reduced Motion no elimina voz futura, texto ni función.

## ACC-08

UI de voz con adaptador abstracto:
- on/off;
- volumen;
- velocidad;
- repetir;
- etiquetas ES/EN;
- foco nativo;
- ARIA;
- estados disabled.

Motor actual: `NullVoiceAdapter`.

S2 sigue cerrado:
- sin ElevenLabs;
- sin TTS remoto;
- sin cloud;
- sin micrófono;
- sin autoplay.

## ACC-09

El panel Sabik refleja las preferencias globales de lectura. El gate automático incluye:
- reflow 320 CSS px;
- guardarraíl de texto ampliado;
- sin overflow horizontal;
- Reduced Motion real en navegador.

## ACC-10

Densidad:
- completa;
- reducida;
- paso a paso.

Ningún modo puede ocultar Safety, límites, procedencia o el texto completo de una respuesta no estructurada.

**NO MERGE · NO DEPLOY.**
