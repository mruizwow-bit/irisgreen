# Nexo · ampliación OAI R02 · fuente localizada, generador pendiente
2026-10-05. Petición de María: «lo puedes ampliar?».
Estado: SOURCE_GENERATOR_TRANSFER_REQUIRED. No audio de 300 s generado.

## Responsabilidad
El tratamiento OAI R02 fue de Nexo. La entrega a Claude no incluía receta/fuente completa. Nexo mantiene la responsabilidad del procesamiento y no devuelve a Claude el encargo de inventar otra mezcla.

## Fuente localizada
Library RINCON_PECERA_R02_20261004.zip, libfile_834876a429448191b8b7b6a9c2b44cd4, descargado e inspeccionado.
clip_r02.sh, línea 19:
```sh
python3 /home/claude/r70/nuevo/audio2.py acuario "$DURS" "$W/son.m4a"
```
Ese archivo NO está incluido en el ZIP R02.
También se inspeccionó RINCON_NUEVO_PROTOTIPOS_R1_20261002.zip: fuente/audio.py solo implementa mar/discos; NO sustituye audio2.py acuario.
Las búsquedas dirigidas en GitHub y Library no recuperaron audio2.py ni el script exacto histórico del tratamiento OAI.

Original de 40 s recuperado: PECERA_R02_CLIP_40s.mp4, libfile_3c43fc4a063481919e91958dc2077a63.
Referencia aprobada: PECERA_AUDIO_OAI_R02_BUBBLE_DOMINANT.m4a, libfile_d696ddc1ac408191b2cba7516a80a2c9.

## Recuperación del tratamiento, no del generador
Comparación independiente de PCM decodificado de original vs aprobado.
Prueba de identificación sobre canal medio, remuestreo de 48 kHz a 4.8 kHz, tramo 2–38 s:
Butterworth high-pass orden 8, aplicación bidireccional, corte ajustado 149.9727 Hz, ganancia media 5.61150 (~14.9816 dB), factor side estimado 0.348329.
Correlación de la componente media predicha vs aprobada: 0.9999352; error cuadrático relativo 0.00012957.
Esto respalda original filtrado, no una nueva síntesis. Son parámetros INFERIDOS del binario, no recuperación documental del script exacto, ni equivalencia perceptual, ni PASS final. Falta validar a 48 kHz, extremos y estéreo antes de usar en un full.

## Solicitud exacta a Claude Rincón
Entregar el archivo original /home/claude/r70/nuevo/audio2.py usado por clip_r02.sh para PECERA_R02_CLIP_40s.mp4, con cualquier dependencia local.
Como alternativa equivalente, renderizar con ese generador ORIGINAL acuario una señal continua de 300 s y entregarla en WAV estéreo 48 kHz, preferiblemente antes de AAC, indicando semilla/parámetros.
No usar PECERA_R02_CLIP_40s_AUDIO_R2, no repetir el M4A aprobado de 40 s, no generar una mezcla nueva.
Nexo aplica y valida el tratamiento OAI R02; Claude conserva el vídeo full ya producido.
Esta solicitud queda registrada; no se ha contactado automáticamente al chat externo.

## Cierre pendiente
Fuente completa → validación del tratamiento reconstruido contra referencia → render 300 s → AAC/WAV + hashes y receta → mux vídeo copiado → Eco sobre AV exacto.
No main. No sustituir por A1 antiguo.
