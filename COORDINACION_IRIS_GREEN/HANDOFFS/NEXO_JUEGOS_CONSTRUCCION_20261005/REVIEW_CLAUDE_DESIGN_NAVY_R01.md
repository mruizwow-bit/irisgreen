# Nexo · revisión del ZIP Claude Design Juegos · NAVY R01
Fecha: 2026-10-05
Issue: #369
Gate: NEXO_CLAUDE_DESIGN_GAMES_NAVY_R01_PATCH_REQUIRED

## Evidencia y alcance
Paquete recibido: CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01(1).zip.
ZIP descargado: 64762 bytes.
SHA-256: 33a2b0eccf4cd75b0260a5607ff23291daa262850265d07ae62387a96159b28c.
18 frames editables .dc.html, canvas.json, manifest, README y copy. ZIP íntegro.
Revisión estática del paquete real. No se ha renderizado en navegador: el ejecutable Chromium no está disponible. No se emite PASS visual, accesibilidad, responsive ni runtime.

## KEEP
- Fondo NAVY #0B1A2B en los 18 frames; paleta semántica y botón principal #DCE8F2 / #0B1A2B conforme a la instrucción de María.
- Atkinson Hyperlegible y Newsreader sustituyen la tipografía provisional.
- Portada J01: 56 / 44 / 40 px para 1440 / 390 / 320, Newsreader 400 e interlineado 1.06.
- Base declarada 16 px. Sin selector de tema claro.
- README reconoce diseño visual y READY_FOR_REVIEW; no presenta el paquete como juego funcional.
Los tamaños de títulos de catálogo J02/J03 no se juzgan con la regla específica de portada 40–56 px.

## Patch acotado para Claude Design
1. Marca: eliminar el símbolo geométrico provisional del encabezado. Mantener la marca textual Iris Green conforme al canon; no esperar un nuevo logotipo ni inventarlo.
2. Tipografía reproducible: usar los archivos locales canónicos Atkinson 400/700 y Newsreader variable y la definición IG Zero de assets/ig-fonts.css. Los 18 frames dependen actualmente de Google Fonts; no hay fuentes incluidas.
3. Herencia: fijar cuerpo/base a line-height: 1.6 y títulos a Newsreader 600 / 1.2, preservando la excepción de portada 400 / 1.06 e introducción ~19 px / 1.58. El div raíz carece de line-height; varios h2 tampoco lo fijan. Esto es un hallazgo de código, no una medición visual.
4. Documentación: reemplazar la referencia antigua de foco #0B57D0 del README por #C3B8FF. El color antiguo no está en los frames actuales.
5. Entrega reproducible: todos los frames referencian ./support.js y el archivo falta. Aclarar si es dependencia del canvas nativo; incluir lo necesario para abrir la entrega o retirar la referencia si es prescindible y verificar. No se afirma que esta ausencia por sí sola rompa todos los frames.
6. Exportar los PNG sRGB de revisión solicitados. Hay cero PNG y PNG_REVISION_PENDIENTE.txt reconoce el pendiente. Verificar visualmente 320/390/1440, textos, foco y ampliación después de cargar fuentes reales.

## Dependencias de contenido
La imagen de Construcción continúa como placeholder. Incorporar un frame aprobado de Construcción cuando esté disponible, sin generar otra propuesta del juego. Mantener pendientes de clasificación Para todos/Plus como anotaciones de revisión; no inventar condiciones comerciales ni mostrar notas técnicas en la futura interfaz pública.

## Secuencia y separación de trabajos
Claude Design: completar este patch del área de Juegos → revisión del paquete renderizado → Axioma → HUMAN QA María de la superficie web.
Prisma: continúa por separado el prototipo jugable de Construcción autorizado en ORDEN_PRISMA_PROTOTIPO_JUGABLE_R01.md. Esta revisión no reinstaura un bloqueo previo al código en ese carril.
Claude Rincón: Pecera ~5 minutos; no pertenece a esta entrega.
No modificar main, desplegar producción ni cambiar mecánicas para cerrar este patch.
Registro en GitHub no equivale a activar al agente externo.
