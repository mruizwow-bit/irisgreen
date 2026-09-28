# R62 · P01 Habitación imposible · Astra review · 28/09/2026

Estado: `R62_P01_MECHANIC_PASS_VISUAL_CONCEPT_REWORK_REQUIRED`

Issue: #326.

## Material revisado

Handoff recibido por patch:
- `r62-p01-concepto.patch`
- SHA-256: `f1333e8f564810ddc537a4080d49cdab3d6572d157c24e4e37185a111518dd5b`
- base declarada: `c119d3297bfa3fadff89a3c0423b2fbf3ff9f633`
- HEAD original no subido declarado por Claude: `0e414c48`

Archivos revisados:
- `CONCEPTO.md`
- `gameplay.svg` · SHA-256 `3d4f4fbd88c0c7ae43f4e20f88d47363b210ec12cf03f0ce934b4c2e96bae33c`
- `interaccion.svg` · SHA-256 `8070129d8be925fb799da69b70ac3763f0e6f3459c6c6314bd7e30101e53f172`
- `scripts/r62_p01_concepto.py` · SHA-256 `820869006d7ec6f6a1c564f1b59de3a3b4a3e99a1fba69e4d623c1634985a697`

Reproducción Astra:
- `python -m py_compile scripts/r62_p01_concepto.py` = PASS;
- regeneración de ambos SVG = byte-identical;
- render visual de ambas láminas realizado.

## Decisión

### KEEP · mecánica

Se acepta como dirección de mecánica:
- cuatro orientaciones de suelo/gravedad;
- piezas que pueden recolocarse/girarse;
- objetivo de construir un camino continuo;
- múltiples soluciones;
- sin cronómetro/puntuación/fallo;
- diferenciación clara respecto a P03: la luz es material, no mecánica;
- adaptación por etapa sin infantilización;
- drag no es canal único;
- reduced motion y no-color-only están previstos desde concepto.

La idea es suficientemente distinta de un simple puzle de proyección y puede evolucionar a un juego propio de Iris Green.

### REWORK · concepto visual antes de aprobación P01

P01 NO recibe todavía `R62_P01_HABITACION_CONCEPT_APPROVED`.

Motivos:

1. **La mecánica central no está demostrada visualmente.**
   Las dos láminas muestran esencialmente la misma orientación de la sala. La segunda demuestra selección/movimiento del plinto, pero no enseña el momento decisivo: cambiar qué cara es suelo y ver cómo cambia la transitabilidad.

2. **El nivel gráfico sigue siendo blocking.**
   Se lee como diagrama/maqueta isométrica cuidada, no aún como la dirección visual premium que R62 debe fijar antes de Codex. Materiales, atmósfera, profundidad y luz necesitan una pasada adicional.

3. **Inicio/camino/salida no se leen con suficiente claridad.**
   El tramo frío del camino no conecta visualmente de forma obvia las dos aperturas y el rol del balcón/plataforma alta necesita mayor jerarquía.

4. **El selector de cuatro rombos parece un D-pad.**
   Puede confundirse con control de movimiento. Debe convertirse en un selector espacial de caras/suelos inequívoco.

5. **Fallo de render real en la lámina de interacción.**
   Los glifos `↑↓←→` aparecen como cuadrados vacíos con la fuente monospace usada. Sustituir por texto ("Flechas") o flechas vectoriales propias.

6. **El segundo estado debe explicar la mecánica propia, no una interacción secundaria.**
   La próxima entrega debe mostrar al menos:
   - estado A: suelo/orientación actual, ruta incompleta;
   - estado B: tras cambiar de suelo, relación espacial modificada y nueva posibilidad de ruta.

## Reentrada P01

Entregar solo P01 R2, no P02 todavía:

- imagen principal refinada;
- segundo estado centrado en cambio de suelo;
- selector de suelo rediseñado;
- jerarquía clara entrada → ruta → salida;
- controles sin glifos rotos;
- prueba 1440 + 390;
- mantener la mecánica aprobada salvo que el nuevo visual revele un problema.

Marcador esperado:

`R62_P01_HABITACION_CONCEPT_R2_READY_FOR_ASTRA`

Codex #321 sigue HOLD.
P02 no empieza todavía.
No A2, no main, no producción.
