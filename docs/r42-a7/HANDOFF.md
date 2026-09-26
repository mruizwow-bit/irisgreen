# R42-A7 · Rincón tranquilo inmersivo · handoff a A2

Estado de construcción: `R42_A7_QUIET_SPACE_IMMERSIVE_READY_FOR_A2`.

## Base
- Fuente exacta: integración R04 de A2 `574356cba3b73dc8477a625d2c6311008260a2d6`.
- R03 no se usa como motor visual.
- El ambiente sonoro de Mar de R04 se conserva porque María lo valoró positivamente.

## Construcción R42
- Motor visual nuevo WebGL2 first-party con fallback Canvas2D.
- 12 espacios: los 9 existentes + Bosque con niebla / Misty forest + Lago al amanecer / Lake at dawn + Nubes lentas / Slow clouds.
- Stage dominante en escritorio y móvil.
- Pantalla limpia inmersiva; los controles reaparecen con interacción o foco.
- Móvil: stage primero, selector compacto y ajustes como bottom sheet.
- 12 sonidos generales y los ambientes rechazados se regeneran como buffers estéreo deterministas solo después de una acción explícita. No comparten una única cama audible de viento/pad.
- Nada inicia solo. ES/EN equivalentes.

## Normativa aplicada
- WCAG 2.2 AA / ISO/IEC 40500:2025: teclado, foco, nombres accesibles, reduced motion, forced colors y alternativa estática.
- ISO 9241-171/-210/-11/-112: herramienta principal primero, progressive disclosure y controles recuperables.
- ISO 24495-1 + COGA: instrucciones directas, sin infantilizar y sin comportamiento inesperado.
- Privacidad/minimización: sin perfil, telemetría o registro de conducta nuevo.

## Evidencia técnica
- Contrato estático remoto: `R42_A7_STATIC_CONTRACT_PASS`.
- Sintaxis PASS para `rincon-calma.js`, `rincon-r42.js`, `rincon-immersive-r42.js` y `rincon-audio-r42.js`.
- ES y EN contienen exactamente 12 espacios.
- El loader Canvas2D R04 queda fuera de la ruta R42.

## Pendiente obligatorio
Esto NO declara PASS perceptivo. Tras integrar A2:
1. María escucha cada sonido/ambiente en la Deploy Preview.
2. Revisión visual de los 12 espacios en escritorio y móvil real.
3. WebGL2 real y fallback sin WebGL2.
4. Teclado/foco y lector de pantalla.
5. Reduced motion y forced colors.

Si la imagen no resulta inmersiva o un paisaje sonoro molesta, vuelve a construcción.
