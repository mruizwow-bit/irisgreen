# I3 · PROTOCOLO DE BENCHMARK VOCAL · V0.1

**Fecha:** 20/09/2026  
**Estado:** protocolo de laboratorio; no producción  
**Objetivo:** comparar tecnologías STT/TTS/voice conversion para una voz propia de SABIK ejecutable en infraestructura controlada por el proyecto.

## 1. Referencias protegidas

### MARIA_VOZ_01.m4a
- función: referencia original autorizada de la propietaria de la voz;
- duración PCM decodificado: 657,963 s;
- frecuencia: 48 kHz mono;
- pico de muestra: -2,76 dBFS;
- RMS global: -28,94 dBFS;
- F0 mediana estimada: 167,4 Hz;
- F0 p10-p90 estimado: 139,5-217,0 Hz;
- SHA-256: `50a307a10e653af22a22ed92516eebc4677625a47ab5f3d8acd4c88b43826914`.

### SABIK_E2_CONTROL_06_seleccionada.mp3
- función: referencia perceptiva de dirección vocal;
- **nunca dataset de entrenamiento salvo derechos expresos compatibles**;
- duración PCM decodificado: 21,879 s;
- frecuencia: 44,1 kHz mono;
- pico de muestra: -6,38 dBFS;
- RMS global: -23,59 dBFS;
- F0 mediana estimada: 169,4 Hz;
- F0 p10-p90 estimado: 143,9-203,2 Hz;
- SHA-256: `1db9a73bb64b5f4981d4d779c7702cacabb5a1c2e679414e2864d0fc39bda754`.

## 2. Qué NO concluyen estas mediciones

Las cifras no validan:
- acento;
- calidez;
- naturalidad;
- identidad vocal;
- inteligibilidad;
- serenidad;
- madurez;
- calidad perceptiva;
- equivalencia entre voces.

No modificar pitch global ni normalizar la referencia MARIA únicamente para aproximar RMS a SABIK 6.

## 3. Dirección perceptiva objetivo

La evaluación humana debe puntuar de forma separada:
- español peninsular de España;
- minimizar rasgos andaluces marcados;
- adulta y madura, no mayor;
- suave;
- cálida;
- relajante;
- baja proyección;
- ritmo natural tranquilo;
- comienzos y finales suaves;
- no locutora;
- no teatral;
- no infantil;
- no maternal;
- agradable durante explicaciones largas;
- pronunciación correcta de `Sábik`.

La referencia perceptiva sirve para comparar; no se asume que un modelo pueda reproducirla exactamente.

## 4. Candidatos TTS/voz

Primera lista de laboratorio:
1. VoxCPM2
2. Chatterbox es-ES
3. Qwen3-TTS Base
4. Fun-CosyVoice3
5. OpenVoice V2 únicamente si aporta una mejora material en separación timbre/acento

Antes de cada prueba registrar:
- URL/repositorio oficial;
- versión/commit/checkpoint exacto;
- licencia de código;
- licencia de pesos;
- licencia de tokenizer/vocoder/componentes;
- permiso comercial;
- atribuciones;
- tamaño de modelo;
- requisitos de RAM/VRAM;
- hardware usado.

## 5. Candidatos STT

1. faster-whisper / Whisper multilingüe
2. Qwen3-ASR
3. NVIDIA Parakeet TDT 0.6B v3

No elegir por WER únicamente. Medir:
- negaciones;
- cifras;
- nombres;
- correcciones;
- parámetros de acciones;
- errores que cambian intención.

Ejemplo crítico:
- entrada: `No amplíes el texto`
- fallo crítico: `Amplía el texto`

## 6. Material permitido

Permitido:
- grabaciones originales autorizadas de la propietaria;
- textos de prueba creados por el proyecto;
- pesos/modelos cuya licencia permita la prueba prevista.

No permitido:
- usar salidas de ElevenLabs como corpus de entrenamiento sin licencia expresa compatible;
- publicar el corpus original;
- exponer un endpoint que permita sintetizar texto libre arbitrario con la voz clonada;
- descargar pesos durante cada arranque de producción.

## 7. Banco de frases

Crear al menos 100 frases inéditas, agrupadas en:
- 20 frases cortas de interfaz;
- 20 explicaciones medias;
- 20 frases largas;
- 10 preguntas;
- 10 negaciones/correcciones;
- 10 números, fechas, siglas y nombres;
- 10 frases con `Sábik`, Iris Green y vocabulario propio del proyecto.

Todas las tecnologías deben generar exactamente el mismo banco.

## 8. Métricas técnicas

Por candidato:
- tiempo de carga;
- RAM;
- VRAM;
- RTF;
- latencia hasta primer audio;
- latencia total;
- frecuencia de muestreo de salida;
- errores/omisiones/repeticiones;
- estabilidad en textos largos;
- CPU/GPU exacta;
- coste/hora del entorno;
- concurrencia medida bajo objetivo p95.

Para audio generado:
- pico de muestra;
- RMS;
- F0 mediana;
- F0 p10-p90;
- pausas/baja energía con el mismo método de referencia;
- no usar estas medidas como sustituto de escucha humana.

## 9. Evaluación perceptiva

La propietaria evalúa muestras ciegas con escala 1-5 para:
- acento peninsular;
- similitud de identidad/timbre;
- suavidad;
- baja proyección;
- madurez;
- naturalidad;
- dicción;
- ritmo;
- finales de frase;
- fatiga tras 3-5 minutos;
- adecuación general a SABIK.

Además registrar:
- `preferida`;
- `aceptable`;
- `descartada`;
- comentario libre.

## 10. Gates de aceptación

Un candidato no pasa a integración si falla cualquiera:
- licencia comercial o self-hosting no claros;
- pronunciación española inaceptable;
- errores de texto relevantes;
- latencia fuera del objetivo acordado;
- hardware/coste incompatible;
- identidad vocal o dirección perceptiva rechazada por la propietaria.

No declarar ganador hasta completar:
1. prueba corta;
2. prueba larga;
3. frases inéditas;
4. evaluación ciega;
5. métricas;
6. revisión de licencia.

## 11. Decisión de infraestructura

La nube definitiva se decide **después** del benchmark.

El benchmark debe producir una ficha por candidato con:
- hardware mínimo;
- hardware recomendado;
- coste de laboratorio;
- coste 24/7;
- capacidad medida;
- proveedor(es) compatibles;
- portabilidad del contenedor.

## 12. Prohibiciones durante I3

- no tocar `main`;
- no tocar producción;
- no modificar Netlify;
- no abrir S2;
- no publicar modelos;
- no subir grabaciones privadas a repositorios públicos;
- no entrenar sobre outputs de terceros sin derechos verificados.
