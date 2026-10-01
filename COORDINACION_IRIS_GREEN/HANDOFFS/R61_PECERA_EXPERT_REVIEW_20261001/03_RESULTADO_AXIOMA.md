# R61 · PECERA · RESULTADO AXIOMA · 01/10/2026

Owner:
**Axioma · Quality, Accessibility & Standards Lead**

Especialidad aplicada:
**ICT Accessibility, Quality & Standards Engineering**

Fuentes revisadas:
- `02_RESULTADO_LUMEN.md`;
- `ENTREGA_R61_PECERA_ILUSTRADA_3.md`;
- `COORDINACION_IRIS_GREEN/NORMATIVA/IRIS_GREEN_VISUAL_STANDARD_SEP_2026.md`;
- Issue #325 y decisiones vigentes;
- `COORDINACION_IRIS_GREEN/ORDENES/R61_CLAUDE_RINCON_PECERA/06_POST_TRANSFER_FINAL_QA.md`;
- W3C WCAG 2.2 · SC 1.4.11 / 2.4.7 / 2.5.8 como referencia técnica externa, sin convertir esta revisión en certificación WCAG.

Estado:
`R61_AXIOMA_STANDARD_QA_READY_FOR_ASTRA_MARIA`

## Resultado ejecutivo

- **§4 / §7: NO_CONFLICT_CONFIRMED**
- **§12 RESPONSIVE: PASS**
- **§13 ACCESSIBILITY: NOT_PASS**
- **§14 PERFORMANCE: PENDING_ECO**
- **§15 / E4 PACKAGE: BLOCKED**
- **VISUAL ART: KEEP**
- **NO_RERENDER**
- **PLAYER/RUNTIME QA + REWORK/EVIDENCE REQUIRED**

No recomiendo reabrir:
- composición;
- roca;
- sustrato;
- burbujas;
- densidad;
- saturación;
- fauna;
- vegetación;
- cámara;
- dirección ilustrada.

El bloqueo de Axioma está en **motion/accessibility evidence del reproductor**, no en el arte.

## 1 · §4 vs §7 vs dirección ilustrada

Confirmo la lectura de Lumen.

§4 exige resultado:
- luz con volumen;
- materiales diferenciados;
- imperfección;
- atmósfera;
- estabilidad;
- profundidad;
- detalle suficiente.

§7 dice:
`volumetría/bruma solo si aporta`.

Por tanto:
- niebla;
- DOF;
- blur;
- absorción física

NO son técnicas obligatorias para cumplir §4.

La orden específica de Pecera puede exigir lenguaje ilustrado, plano y nítido y seguir cumpliendo la norma si el resultado perceptivo alcanza profundidad/atmósfera por otros medios.

Decisión:
`R61_AXIOMA_NO_CONFLICT_CONFIRMED`.

No existe conflicto normativo que justifique rerender.

## 2 · §12 Responsive

La evidencia preservada demuestra:
- asset 4:5 específico a <=520 px;
- 512×640, no 16:9 miniaturizado;
- 320 / 360 / 390 sin overflow;
- stage útil en los tres anchos;
- controles fuera del stage;
- layout que se reorganiza;
- target declarado >=44 px.

La norma §12 permite:
- simplificar;
- cambiar disposición;
- servir asset más ligero.

No exige un render artístico independiente si un derivado 4:5 del máster conserva calidad y composición.

Lumen aporta el juicio perceptivo humano de que el recorte conserva foco, jerarquía y profundidad.

Decisión:
`R61_AXIOMA_RESPONSIVE_STANDARD_PASS`.

## 3 · §13 Accesibilidad · resultado por subcontrol

### 3.1 Keyboard

Evidencia disponible:
- orden de tabulación documentado;
- controles deshabilitados se omiten.

Esto demuestra **focus order parcial**.

No queda demostrado en la entrega:
- activación por Enter/Space de cada control;
- fullscreen por teclado;
- Escape/salida;
- retorno de foco cuando corresponda;
- equivalencia completa click/keyboard.

Estado:
`KEYBOARD_PARTIAL_EVIDENCE_PENDING`.

No emitir PASS completo de teclado.

### 3.2 Touch

Evidencia disponible:
- ningún target <44 px.

Esto supera el mínimo de tamaño WCAG 2.2 SC 2.5.8 (24×24 CSS px, con excepciones).

Pero la orden R61 exige además probar **touch**.

No queda preservada evidencia de activación táctil real/simulada de:
- play;
- mute;
- volumen;
- stop;
- fullscreen;
- modos.

Estado:
`TARGET_SIZE_PASS_TOUCH_OPERATION_PENDING`.

### 3.3 Drag no único

El reproductor no depende de drag como única vía funcional según la evidencia disponible.

Estado:
`DRAG_NOT_UNIQUE_NA_OR_PASS_BY_DESIGN`.

### 3.4 Forced colors

Evidencia declarada:
- adopta paleta del sistema;
- texto negro/fondo blanco/bordes negros;
- no overflow.

Esto es evidencia positiva.

Pero Axioma no dispone aquí del HTML final ni de inspección AT para comprobar que todos los estados/significados permanecen distinguibles.

Estado:
`FORCED_COLORS_PASS_PARTIAL_EVIDENCE`.

### 3.5 Reduced motion / contrato de movimiento

Este es el **blocker principal de Axioma**.

Orden vigente 06 exige demostrar tres estados:

`NORMAL`
- movimiento completo.

`REDUCIDO`
- reducción real y observable;
- no basta etiqueta.

`SIN_MOVIMIENTO`
- 0 movimiento continuo;
- frame estático o equivalente.

La entrega demuestra:
- normal;
- “modo suave” a velocidad 0,7;
- “solo imagen”;
- `prefers-reduced-motion` pone transiciones de botones a 0 s.

Esto NO demuestra el contrato exigido.

Problemas:
1. “solo imagen” describe audio, no ausencia de movimiento;
2. no se demuestra un estado de 0 movimiento continuo;
3. `prefers-reduced-motion` no se demuestra aplicado a la escena principal;
4. no se documenta qué asset/runtime usa cada estado;
5. la orden #325 mantiene reduced motion y mute como controles independientes.

Estado:
`R61_MOTION3_CONTRACT_FAIL`.

Este fallo **bloquea §13 y E4**, pero NO requiere rerender del arte.

Corrección esperada:
- mapear/implementar `NORMAL / REDUCIDO / SIN_MOVIMIENTO`;
- `SIN_MOVIMIENTO` = poster/frame estático persistente o equivalente, sin movimiento continuo;
- mantener audio independiente cuando el contrato del Rincón lo permita;
- aplicar `prefers-reduced-motion` a la experiencia de movimiento, no solo al chrome;
- documentar la reducción real de `REDUCIDO`;
- retest.

### 3.6 Targets

Targets >=44 px:
`PASS_INTERNAL`.

Como contexto externo:
WCAG 2.2 SC 2.5.8 AA exige 24×24 CSS px o excepciones/espaciado equivalente.

No usar este único dato para declarar conformidad total.

### 3.7 Foco

Evidencia:
- existe anillo;
- token declarado: `#5A49A8`;
- LIGHT: `#F6F8FB`;
- DARK NAVY: `#0B1A2B`.

Cálculo sobre los colores declarados:
- focus `#5A49A8` vs LIGHT `#F6F8FB` ≈ **6,68:1**;
- focus `#5A49A8` vs DARK NAVY `#0B1A2B` ≈ **2,47:1**.

WCAG 2.2 SC 1.4.11 exige que un indicador de foco modificado por el autor tenga al menos 3:1 contra el color adyacente relevante.

Conclusión:
- LIGHT: compatible con el mínimo 3:1 en esa pareja;
- DARK NAVY: **riesgo de fallo** si `#0B1A2B` es realmente el color adyacente al anillo.

La evidencia no preserva geometría/adyacencia suficiente para declarar FAIL definitivo.

Estado:
`FOCUS_CONTRAST_DARK_PENDING_VERIFICATION`.

Acción:
- medir el color realmente adyacente al outline en DARK NAVY;
- si es `#0B1A2B`, corregir token/indicador o usar un indicador de dos colores;
- retest visible de todos los controles.

### 3.8 Zoom / reflow

Evidencia:
- zoom 200 % + texto de usuario 200 %;
- overflow horizontal 0 en 320 px;
- responsive 320/360/390 sin overflow.

Esto es evidencia positiva para el requisito interno §13.

Estado:
`ZOOM_REFLOW_PASS_INTERNAL_EVIDENCE`.

No se eleva a declaración formal WCAG completa sin método/conformance evaluation reproducible.

### 3.9 No flashes

La entrega preserva:
- recorrido de luminancia muy bajo;
- ausencia de saltos;
- métricas de alternancia/autocorrelación;
- cámara fija.

Estado interno:
`NO_FLASHES_EVIDENCE_PASS`.

No equivale a certificación independiente de todos los criterios de seizures/physical reactions.

### 3.10 No color-only / lectura clara / time-based media

No existe evidencia suficiente en este handoff para cerrar:
- todos los estados sin dependencia exclusiva de color;
- lectura clara completa;
- accessible names/descriptions mediante AT;
- tratamiento completo WCAG de media temporal;
- screen reader;
- captions/alternativas cuando sean aplicables.

Estado:
`NOT_TESTED_FOR_FULL_WCAG_CONFORMANCE`.

## 4 · §14 Rendimiento

La norma exige:
- formatos modernos según técnica;
- peso controlado;
- no carga innecesaria;
- presupuestos;
- fallback;
- profiling real.

Evidencia positiva:
- asset móvil separado;
- `preload="none"`;
- máster conservado;
- posibilidad de re-encode sin rerender.

Pendiente:
- startup real del MP4 final;
- range;
- buffering;
- seek;
- memoria;
- CPU/GPU;
- red móvil;
- coste de datos;
- playback real H.264/AAC.

Por tanto:
`R61_AXIOMA_PERFORMANCE_STANDARD_PENDING_ECO`.

No es correcto emitir PASS §14 antes de Eco.

Si Eco demuestra problema:
- transcodificar/delivery encode desde máster;
- no tocar arte.

## 5 · §15 / E4

Acepto como evidencia especializada de Lumen:
- `VISUAL_KEEP`;
- `MOBILE_PASS`;
- `NO_CONFLICT`.

Pero E4 exige conjuntamente:
- arte;
- móvil;
- accesibilidad;
- rendimiento;
- benchmark.

La pregunta 9 de §15:
“¿Respeta accesibilidad y rendimiento?”

todavía no puede responderse YES.

Por tanto:
`R61_E4_PACKAGE_BLOCKED_BY_ACCESSIBILITY_AND_MEDIA_QA`.

No implica:
`VISUAL_REWORK_REQUIRED`.

Implica:
`PLAYER_RUNTIME_REWORK_OR_EVIDENCE_REQUIRED`.

## 6 · Qué debe corregirse / demostrarse sin tocar arte

1. Motion3:
   - NORMAL;
   - REDUCIDO real;
   - SIN_MOVIMIENTO real;
   - mapping con `prefers-reduced-motion`.

2. Keyboard:
   - activar cada control por teclado;
   - fullscreen;
   - Escape;
   - retorno de foco cuando proceda.

3. Touch:
   - operación real/simulada, no solo tamaño.

4. Focus:
   - verificar contraste real del indicador en DARK NAVY;
   - corregir si el adyacente produce <3:1.

5. Forced colors:
   - comprobar estados/selección, no solo colores computados.

6. Registrar evidencia:
   - viewport;
   - browser;
   - input;
   - resultado;
   - captura/log cuando corresponda.

7. Eco:
   - cerrar playback/performance/delivery.

## 7 · Conformance / claims

Axioma NO autoriza todavía claims como:
- “WCAG 2.2 AA conforme”;
- “totalmente accesible”;
- “accesibilidad certificada”;
- “E4 PASS completo”.

Sí puede afirmarse internamente:
- responsive estándar PASS;
- targets PASS;
- forced-colors con evidencia parcial positiva;
- zoom/reflow con evidencia interna positiva;
- no-flashes con evidencia positiva;
- motion contract FAIL;
- teclado/touch/focus completo pendientes;
- performance pendiente de Eco.

## 8 · Trazabilidad

Confirmo la normalización futura del marcador:

`R61_PECERA_FINAL_PACKAGE_MOBILE_BENCHMARK_QA_READY_FOR_ASTRA_MARIA`

El informe original conserva:
`61_PECERA...`

como evidencia histórica exacta y no debe editarse retrospectivamente.

## 9 · Siguiente acción exacta

1. **KEEP arte y móvil.**
2. **NO rerender.**
3. Corregir o demostrar únicamente player/runtime:
   - Motion3;
   - keyboard/touch;
   - focus dark contrast;
   - fullscreen/Escape/focus return.
4. Eco cierra media/performance.
5. Axioma retesta los puntos anteriores.
6. Astra integra gates.
7. María hace HUMAN QA final.

## 10 · Marcadores

`R61_AXIOMA_STANDARD_QA_READY_FOR_ASTRA_MARIA`

`R61_AXIOMA_NO_CONFLICT_CONFIRMED`

`R61_AXIOMA_RESPONSIVE_STANDARD_PASS`

`R61_AXIOMA_ACCESSIBILITY_NOT_PASS`

`R61_MOTION3_CONTRACT_FAIL`

`R61_FOCUS_CONTRAST_DARK_PENDING_VERIFICATION`

`R61_PERFORMANCE_STANDARD_PENDING_ECO`

`R61_E4_PACKAGE_BLOCKED_BY_ACCESSIBILITY_AND_MEDIA_QA`

`R61_NO_RERENDER_PLAYER_RUNTIME_ONLY`
