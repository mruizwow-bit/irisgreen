# R40-RINCON-R04 · handoff Agente 7 → Agente 2

Estado: **R40_RINCON_R04_REAL_REBUILD_READY_FOR_A2**

## Base y rama

Base integrada observada y corregida:
`9ad3cc8116b6c1d237b84f71855f3808e93ddbad`

Rama de construcción:
`agent7/r40-rincon-r04-final-20260926`

Evidencia generada y revisada:
workflow GitHub Actions `36237393274` · **SUCCESS**

La rama final es un commit limpio sobre la base A2. Los blobs de producto y los tres assets de audio son byte-idénticos a los cubiertos por el workflow `36237393274` (HEAD de workflow `8278e3a4863fa31a71f0e7f1554cfb55a9e8c073`). A2 debe integrar el delta sobre su HEAD vigente; no resetear su rama a la base de A7.

## Qué integra A2

Producto:
- `assets/rincon-escenas-r04.js`
- `assets/rincon-audio-r04.js`
- `assets/rincon-r04.js`
- `assets/rincon-r04.css`
- `assets/rincon-calma.js`
- `es/sitio-tranquilo/index.html`
- `en/quiet-space/index.html`

Audio first-party:
- `audio/rincon/r04/general-nature.m4a`
- `audio/rincon/r04/general-calm.m4a`
- `audio/rincon/r04/scenes.m4a`
- `audio/rincon/r04/AUDIO_MANIFEST.json`

Reproducibilidad/QA:
- `tools/r40-rincon-r04/render_audio.py`
- `tools/test-r40-rincon-r04.js`
- `.github/workflows/r40-rincon-r04-build.yml`
- `docs/r40-a7-build/r04-evidence/`

## Gates ya cerrados por A7

- audio render reproducible: PASS;
- 21 segmentos / 3 sprites: PASS;
- static contract: PASS;
- navegador DOM real: PASS para Vídeos/Sonidos/Bola;
- herramienta activa primero: PASS;
- 6 capturas únicas: PASS;
- 1440×900: herramienta activa visible sin scroll: PASS visual A7;
- 390×844: herramienta activa visible sin scroll: PASS visual A7;
- ES/EN binding: PASS estructural;
- old R03 runtime de audio/visual sustituido en la página R04: PASS;
- sin autoplay: PASS estructural;
- historical HOLD recordings: no reutilizadas.

## Pendiente obligatorio

A7 **no** declara que los sonidos sean perceptivamente aceptados.  
A2 debe:
1. revisar/integrar el delta;
2. ejecutar build/gates de la web vigente;
3. publicar Deploy Preview;
4. comprobar ES/EN;
5. entregar URL;
6. María/QA escucha los 12 sonidos + 9 ambientes y revisa las 9 escenas;
7. probar móvil físico/lector real cuando aplique;
8. devolver a A7 cualquier defecto perceptivo concreto.

No merge a main ni producción sin autorización.
