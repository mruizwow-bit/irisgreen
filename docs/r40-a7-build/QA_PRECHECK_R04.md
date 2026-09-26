# R40-RINCON-R04 · QA de construcción A7

## Resultado
`R40_RINCON_R04_REAL_REBUILD_READY_FOR_A2`

No equivale a aceptación perceptiva.

## CI final
- workflow: `36237393274`
- resultado: SUCCESS
- Python: 3.12.14
- Node: 22.23.2
- FFmpeg: 6.1.1
- NumPy: 2.5.3 (pin del workflow)
- Actions: checkout/setup-python fijadas por SHA.

## Gates del workflow
1. render first-party audio;
2. static contract;
3. servidor HTTP real;
4. Browser DOM contract;
5. capturas 1440×900 y 390×844;
6. verificación de tres hashes visuales distintos por tamaño;
7. SHA256SUMS;
8. commit de assets/evidencia.

Todos: PASS.

## Evidencia de audio
3 archivos AAC-LC, mono, 24 kHz, 48 kbps:
- general-nature: 112 s / 8 segmentos
- general-calm: 56 s / 4 segmentos
- scenes: 126 s / 9 segmentos

Total: 21 segmentos.

## Evidencia visual
Revisión A7 de las seis capturas:
- Vídeos escritorio: reproductor visible inmediatamente después del selector; controles esenciales visibles.
- Sonidos escritorio: estado/sonido actual, volumen y Parar antes de catálogo.
- Bola escritorio: bola y Empezar/Parar antes de ajustes.
- Móvil: selector nativo; herramienta activa inmediatamente debajo en los tres modos.
- No se usa scroll forzado para rescatar la herramienta.

## Accesibilidad / adaptación estructural
- ES/EN;
- tabs teclado;
- controles >=44 px;
- reduced motion;
- forced-colors;
- un modo activo;
- estados textuales y selección no solo por color;
- no autoplay;
- fallback textual/visual;
- copy público claro y no infantilizante.

## Pendientes humanos
- escuchar cada uno de los 12 sonidos generales;
- escuchar los 9 ambientes;
- revisar las 9 escenas activas en preview;
- valorar sobresalto/fatiga/repetición;
- revisión de tecnologías de apoyo reales donde aplique;
- móvil físico.

Por diseño de la orden R04, cualquiera de esos hallazgos puede devolver un defecto específico sin invalidar los gates independientes ya demostrados.
