# SABIK · B3 INTEGRATION SPIKE R0

**Estado:** `SABIK_B3_INTEGRATION_R0_CANDIDATE`  
**Base real:** `sabik-preview@96ebf38a535fa287f32fee8c7957ede39933365c`

## Separación de responsabilidades

No se ha modificado `sabik/nea-core/**`, la máquina S0 ni su semántica.

El spike observa la **capa de presentación existente** y proyecta B3 sin escribir de vuelta en S0.

### Proyección actual

| Señal existente | B3 |
|---|---|
| ready / espera | PRESENTE |
| retrieving / composing / procesando | PRESENTE |
| presenting / respuesta | PRESENTE |
| awaiting_clarification / correccion | ORIENTAR |
| paused / pausa | PAUSA |
| error | PRESENTE + texto/error UI existente |
| risk / protection | PRESENTE + Safety existente |
| voice states | sin cambio B3 |

**TRANSICIÓN** y **CONFIRMAR** están integrados como funciones de presentación explícitas:

- TRANSICIÓN se usa para cambios locales con origen/destino conocido, como reiniciar la sesión; nunca como spinner de retrieval/composing.
- CONFIRMAR se usa para confirmar cambios locales de presentación, como movimiento, densidad, intensidad o respuesta breve.
- ninguno modifica S0.

## Presencias

El resolvedor admite:
- `web`
- `ia`
- `educa`

La interfaz real `/es/nea/` declara IA como presencia por defecto. Otras superficies pueden declarar `data-sabik-presence` sin cambiar la gramática.

## Activo visual de runtime

El repositorio contiene **15 derivados WebP**, uno por combinación presencia/estado, en:

`sabik/assets/b3/`

Contrato:
- fuentes: 15 keyframes R1 congelados de #182;
- presencias: Web / IA / Educa;
- estados: PRESENTE / ORIENTAR / TRANSICIÓN / PAUSA / CONFIRMAR;
- dimensión mínima del derivado: 64×64;
- SHA-256, bytes y dimensión real registrados por archivo en `ASSET_MANIFEST.json`;
- no existe dependencia de sprite para el runtime.

Los derivados no rediseñan #181/#182. Si un asset no carga, el spike conserva visible el holograma legacy existente: la interfaz y el texto no desaparecen.

## Motion

El stage utiliza el controlador de `b3-motion.js`:
- NORMAL;
- REDUCIDO;
- SIN_MOVIMIENTO.

No existe loop de PRESENTE.

## ACC-06 / ACC-09

No se duplican ajustes globales.

Los ajustes globales de Iris Green siguen gobernando:
- tamaño;
- espaciado;
- tipografía;
- ancho de lectura;
- contraste;
- reducción de movimiento.

El panel Sabik hereda esas variables mediante CSS.

Ajustes locales añadidos:
- movimiento en Sabik: normal / reducido / sin movimiento (la preferencia global, el sistema o la degradación conservadora pueden bajar NORMAL a REDUCIDO);
- densidad: completa / reducida / paso a paso;
- intensidad visual: reutiliza el control existente “Bajar intensidad”;
- voz: UI candidata detrás del adaptador abstracto S2.

## ACC-08

`voice-ui-adapter.js` contiene un `NullVoiceAdapter`.

En R0:
- no hay motor conectado;
- no hay autoplay;
- no hay micrófono;
- no hay ElevenLabs;
- no hay API externa;
- no hay TTS remoto;
- controles dependientes del motor aparecen deshabilitados con explicación.

La API permite inyectar un adaptador futuro después del gate S2 sin convertir voz en B3.

## ACC-10

Densidad:
- **completa:** interfaz completa;
- **reducida:** reduce separación/ruido visual de elementos secundarios, sin tocar respuesta ni Safety;
- **paso a paso:** prepara estructura progresiva para bloques explícitamente marcados `data-sabik-step`; si la respuesta no está estructurada así, mantiene el contenido completo.

R0 no trunca respuestas ni oculta:
- Safety;
- límites;
- advertencias;
- contenido completo;
- procedencia.

## H1

H1 continúa pendiente. Ninguna decisión de este spike sustituye la prueba humana.

**NO MERGE · NO DEPLOY.**
