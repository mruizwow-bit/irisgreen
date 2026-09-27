# Sabik · voz master ES/EN · procedencia, creación y decisión final R01

Fecha: 27/09/2026  
Estado: `SABIK_VOICE_MASTERS_ES_EN_APPROVED_PROVENANCE_REGISTERED`

## 1. Decisión vigente

María ha cerrado la búsqueda de voz. Sabik conserva **una misma identidad vocal** y dos masters lingüísticos separados:

- **Sabik EN**: `SABIK_EN_MASTER_RETEST_01.wav`.
- **Sabik ES**: `SABIK_ES_MASTER_V1.wav`, copia canónica de `SABIK_ES_LONG_REF.wav`.

La separación por idioma es deliberada. El master inglés **no** se utilizará para forzar pronunciación española. El español final es peninsular y se genera desde su propio master.

## 2. Procedencia humana y autorización

La fuente humana de la identidad vocal es **voz propia de la titular del proyecto**, aportada voluntariamente por la propia hablante y autorizada por ella para crear Sabik.

Registro de fuente humana conservada fuera del repositorio público:

- artefacto: `SABIK_SOURCE_MARIA.wav`;
- duración: 25.374 s;
- formato observado: mono, 44.1 kHz, PCM 24-bit;
- SHA-256: `6545fcad588db96c1d0bce1cd1f2c43cb8cda124627bcccd7fac6075c2dad770`.

La titular autoriza dentro del proyecto Iris Green / Sabik la grabación, transformación, clonación, síntesis, entrenamiento, fine-tuning, conversión, integración, reproducción, publicación y uso de la voz Sabik derivada de su propia voz en los soportes y despliegues del proyecto, incluidos usos públicos y comerciales del proyecto.

**Regla de privacidad:** las grabaciones humanas originales y los masters de voz no se suben al repositorio público. GitHub conserva nombres, parámetros, versiones y hashes, no el audio.

## 3. Master inglés aprobado

`SABIK_EN_MASTER_RETEST_01.wav`

- motor: Qwen3-TTS 12Hz 1.7B Base;
- modo: clonación x-vector;
- parámetros usados en el retest aprobado: temperature 0.9, top_k 50, top_p 1.0, repetition_penalty 1.05, seed 404;
- duración: 9.20 s;
- formato: mono, 24 kHz, PCM 24-bit;
- SHA-256: `fe58b4af6e89fd15fd631945a8fedfe0b14a225a0dc1689703311d47db412285`;
- snapshot local Base observado: `fd4b254389122332181a7c3db7f27e918eec64e3`.

Semilla histórica aprobada que llevó a este cierre:
`TEST_EN_3_QWEN_XVECTOR(2).wav`, SHA-256
`20c244aa7d0175c81e58903b1f35dc60dba687222b155052636b47b5167d3655`.

La referencia VoiceDesign intermedia exacta de la primera sesión no se recuperó; por tanto no se presenta como si existiera una cadena criptográfica completa de ese paso histórico. El master EN aprobado sí queda identificado por hash.

## 3B. Master inglés V2 seleccionado

Tras la búsqueda controlada V4 y la comparación perceptiva/técnica posterior, María selecciona definitivamente la candidata **12 · seed 9112** como nuevo master inglés de referencia.

`SABIK_EN_MASTER_V2.wav` = copia canónica de `SABIK_EN_REG_V4_12_seed9112.wav`.

- seed: `9112`;
- SHA-256: `c5f666cf090d71d81240f6ab0dd514a2da5af082d311cbbcf79dbd2b05794ede`;
- motor: Qwen3-TTS 12Hz 1.7B Base;
- origen de identidad: master inglés aprobado previo + generación x-vector-only;
- texto exacto usado para generar la candidata 12:
  `Hello. I'm Sabik. I can help you find the information you need. We can go step by step. If something isn't clear, I can explain it in a different way.`

La comparación final se hizo con las candidatas 02, 06, 08, 10, 11 y 12. María y Astra coinciden en cerrar la selección con la 12 tras escuchar estabilidad, timbre, ritmo y similitud con Sabik ES.

La referencia ralentizada 0.88 queda **DESCARTADA** por sonido robótico y no debe entrar en ningún corpus ni entrenamiento.

Desde este punto, el master EN vigente para corpus/ICL/fine-tuning es `SABIK_EN_MASTER_V2.wav`; el antiguo `SABIK_EN_MASTER_RETEST_01.wav` se conserva solo como evidencia histórica de la identidad que dio origen a la V2.

## 4. Master español aprobado

`SABIK_ES_MASTER_V1.wav` es una copia canónica de `SABIK_ES_LONG_REF.wav`.

- duración: 27.00 s;
- formato: mono, 44.1 kHz, PCM 24-bit;
- SHA-256: `c9d18290375d46608d37f65b05788ef552980706161a0eb0e26e2a268059c8fa`;
- variedad: español peninsular;
- motor validado para texto nuevo: Qwen3-TTS 12Hz 1.7B Base;
- modo: ICL, `x_vector_only_mode=False`, `language="Spanish"`.

Transcripción fijada del master ES:

> Los plazos, las cuantías y los requisitos pueden cambiar, así que las fuentes oficiales siguen siendo importantes. Yo no debería ocultar esa diferencia. Una explicación de Iris Green puede ayudarte a comprender. Una fuente oficial puede confirmar un derecho, un plazo o un procedimiento. Un testimonio puede contar cómo ha vivido algo una persona. Una investigación puede estudiar una relación concreta.

La titular validó primero una generación ICL nueva y después un banco de **20 frases variadas** con preguntas, números, fechas, instrucciones, errores y copy informativo. Resultado humano comunicado: **20/20 correctas**, misma mujer y español peninsular.

## 5. Investigación que queda como histórica o rechazada

### OpenVoice
Descartado como voz final por artefactos robóticos. No reabrir como ruta final sin evidencia nueva.

### RVC / Applio sobre master inglés
Se creó `SABIK_MASTER_RVC_TEST` con:
- 96 WAV;
- 5.01 min;
- 40 kHz;
- HiFi-GAN;
- RMVPE;
- ContentVec;
- batch 4;
- 100 épocas;
- pesos cada 10 épocas.

El checkpoint 40e fue el mejor candidato en prueba corta, pero una prueba larga en español mostró **cambio de voz y acento inglés**. Decisión: esta ruta **no** es el master español.

### Corpus español RVC descartado
Se segmentaron 5:20 de guía en 135 fragmentos y se convirtieron 135/135 con el RVC 40e. La escucha reveló el acento anterior/no deseado. Esos outputs quedan como evidencia técnica y **no deben utilizarse para entrenar el master español final**.

## 6. Arquitectura final

```text
FUENTE HUMANA PROPIA AUTORIZADA
        ↓
IDENTIDAD SABIK
        ├── SABIK_EN_MASTER
        │     → generación EN
        └── SABIK_ES_MASTER
              → Qwen ICL / generación ES peninsular
```

No se incorpora como identidad final ninguna voz humana de terceros.

## 7. Corpus de entrenamiento ≠ copy de producción

Se separan formalmente dos conjuntos:

- `CORPUS_ENTRENAMIENTO_VOZ`: material fonético/técnico para estabilidad de voz; puede contener frases que nunca se publiquen.
- `SABIK_COPY_PRODUCCION`: fuente canónica de todo texto propio del sistema que Sabik pueda decir en la web, revisado ES/EN con las reglas editoriales de Iris Green.

La observación de María queda convertida en gate editorial: expresiones como **«la ausencia de voz no significa abandono»** no pertenecen al lenguaje de producción. Sabik no presupone abandono, miedo, presión, tristeza ni otras emociones si el usuario no las ha expresado. Se evita antropomorfismo emocional, prosa terapéutica y abstracciones innecesarias.

El contenido editorial dinámico de Iris Green no se duplica dentro de `SABIK_COPY_PRODUCCION`: Sabik lo lee desde la fuente canónica de la web. El copy propio del sistema sí se versiona por ID estable.

## 8. Biblioteca Cloud prevista

`SABIK_AUDIO_LIBRARY` se generará únicamente a partir de copy aprobado y contendrá, por entrada:
- ID estable;
- ES/EN;
- versión de texto;
- hash de texto;
- master de voz usado;
- hash/versión del audio generado;
- estado editorial.

## 9. Licencias y límite jurídico del registro

El repositorio Qwen3-TTS consultado publica su código bajo Apache-2.0:
https://github.com/QwenLM/Qwen3-TTS/blob/main/LICENSE

Antes de release público se mantiene un gate separado para comprobar la licencia/condiciones exactas de pesos, tokenizador, vocoder y demás dependencias del snapshot final. Este registro **documenta procedencia, autorización y cadena técnica**, pero no sustituye revisión jurídica ni convierte por sí solo las licencias de terceros en permisos propios.

## 10. Resultado

La búsqueda de identidad vocal queda cerrada en ambos idiomas. El siguiente trabajo de voz es: generar y revisar `SABIK_EN_TRAIN_V1`, ejecutar fine-tuning EN; después fine-tuning ES; validar ambos checkpoints con frases inéditas; y solo entonces continuar con `SABIK_COPY_PRODUCCION` y `SABIK_AUDIO_LIBRARY`.

No subir masters ni grabaciones humanas al GitHub público.
