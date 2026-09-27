# Sabik EN · selección master V2 · 27/09/2026

Estado: `SABIK_EN_MASTER_V2_SELECTED`.

## Decisión humana

María selecciona como master inglés definitivo de referencia la candidata:
- archivo origen: `SABIK_EN_REG_V4_12_seed9112.wav`;
- seed: `9112`;
- SHA-256: `c5f666cf090d71d81240f6ab0dd514a2da5af082d311cbbcf79dbd2b05794ede`.

Se adopta como nombre canónico local:
`SABIK_EN_MASTER_V2.wav`.

La selección se produce tras:
1. descarte de V2 con referencia ralentizada por sonido robótico;
2. retorno a Qwen3-TTS Base con `x_vector_only_mode=True` y master original aprobado;
3. búsqueda de 12 generaciones naturales;
4. comparación perceptiva y técnica frente al master español;
5. finalistas 02, 06, 08, 10, 11 y 12;
6. prueba ICL cruzada con cuatro frases nuevas por finalista;
7. comparación final entre 11 y 12;
8. elección expresa de María: **12**.

## Texto exacto de referencia

La candidata 12 se generó con:

> Hello. I'm Sabik. I can help you find the information you need. We can go step by step. If something isn't clear, I can explain it in a different way.

Este texto queda fijado como `ref_text` exacto para ICL cuando se use `SABIK_EN_MASTER_V2.wav`.

## Arquitectura de generación para corpus EN

- modelo: Qwen3-TTS-12Hz-1.7B-Base;
- master: `SABIK_EN_MASTER_V2.wav`;
- modo corpus: ICL;
- `x_vector_only_mode=False`;
- `non_streaming_mode=True`;
- `temperature=0.9`;
- `top_k=50`;
- `top_p=1.0`;
- `repetition_penalty=1.05`.

El corpus de entrenamiento EN se mantiene separado de `SABIK_COPY_PRODUCCION`.

## Siguiente gate

1. generar `SABIK_EN_TRAIN_V1` con 160 clips;
2. revisar una muestra de calidad;
3. preparar `train_with_codes.jsonl` con el tokenizer oficial;
4. ejecutar fine-tuning single-speaker Qwen3-TTS;
5. validar checkpoints con frases inéditas;
6. solo después volver a copy/audio de producción.

No publicar master ni corpus humano/sintético en GitHub. En coordinación solo se conservan nombres, hashes y trazabilidad.
