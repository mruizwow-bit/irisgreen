# AXIOMA · CIELO NOCTURNO COMPLETO R02 · REVIEW

Fecha: 2026-10-06

Estado:
`AXIOMA_SKY_COMPLETE_R02_KEEP_MAJOR_IMPROVEMENTS__SPECIFICITY_REWORK_REQUIRED`

## Evidencia exacta

ZIP:
`DESCUBRIMIENTO_CIELO_COMPLETO_R02_1(2).zip`

SHA-256:
`581368ff4b2db0208274f3d8cca65f4973b64a4038e4c15b209a8591cd814cfa`

Vídeo:
`CIELO_R02_recorrido_1(2).mp4`

SHA-256:
`7d475c97631e66683db9adb03a02f4bf9399ebeac0bce4ead405f196cd5bc05a`

Duración:
28.64 s.

ZIP test PASS.

Nota de packaging:
el `SHA256SUMS.txt` del ZIP exacto contiene **328 entradas** y Axioma verificó **328/328 PASS**. El resumen de entrega dice 320/320; esa cifra está desactualizada para este binario exacto.

## KEEP · mejoras que R02 sí cierra

### Continuidad
- objetivo avanza tras hallazgo general;
- hallazgo fuera de orden no congela objetivo;
- cargas obsoletas descartadas;
- cámara persistida por campo/versionada;
- restablecer vista separado de borrar hallazgos;
- animación cancelada al salir;
- fuentes contextuales;
- foco de confirmación/borrado documentado.

### Input
- click/tap directo;
- drag separado;
- segundo dedo no selecciona;
- pinch anclado a su centro;
- rueda anclada al puntero y sólo con foco;
- teclado equivalente.

### Descubrimiento
- LOCATE y REVEAL separados para 88/88;
- figura limpia/activa;
- capa Mis hallazgos voluntaria;
- lo ya descubierto puede reactivarse;
- evidencia sólo sobre puntos visibles;
- resultados ninguno / unico / intencion / ambiguo.

### Formato
- portada más corta;
- escena world-first mejorada;
- ficha progresiva;
- ayuda voluntaria sin temporizadores;
- panel reconocido como oclusor;
- cuaderno sin spoilers.

## Orión en portada

**KEEP.**

`Empezar por Orión` funciona como ruta guiada de entrada, no como revelación de la solución.

El nombre de la ruta puede conocerse y seguir existiendo descubrimiento en:
- localizar el cinturón;
- reconocer qué estrellas forman el patrón;
- revelar la figura completa.

Si se quiere afinar copy, `Ruta guiada · Orión` sería todavía más explícito, pero no considero necesaria una corrección.

## §5 · cielo continuo

Correcto dejarlo fuera de R02 y no fingir continuidad ocultando el selector.

Los 12 campos permanecen una limitación de formato conocida, no un defecto oculto.

El siguiente prototipo debe resolver una costura real entre dos campos conservando FOV/cámara y reproyectando desde coordenadas celestes; no pegar coordenadas u/v preproyectadas.

## Finding P0 · specificity móvil aún insuficiente

R02 mejora mucho el algoritmo, pero conserva:
`ZONA.fraccion = 0.19 · min_px = 88 · max_px = 150`.

Axioma ejecutó el motor exacto entregado con los 12 campos y muestreo ciego en la cámara inicial.

### 320 · escena aprox 296×420
- identificación directa media: **47.85%**;
- ambiguo medio: **12.25%**;
- cualquier resultado distinto de ninguno: **60.10%**;
- por campo la identificación oscila ~31.1–63.4%.

### 390 · escena aprox 366×625
- identificación directa media: **30.87%**;
- ambiguo: **2.49%**;
- cualquier no-ninguno: **33.36%**.

### 1440 · escena aprox 1408×648
- identificación directa media: **12.83%**;
- ambiguo: **0.09%**;
- cualquier no-ninguno: **12.92%**.

Interpretación:
esto NO dice que cada punto aceptado sea astronómicamente falso.

Sí demuestra que:
- C18/matriz intención miden reachability/correct target;
- todavía falta medir false-discovery/brute-force selectivity;
- el mínimo fijo de 88 px afecta desproporcionadamente al viewport estrecho.

Corrección recomendada:
1. complementar radio motor con apertura angular/FOV;
2. reducir dependencia de min_px fijo;
3. usar recognition_signature/anchor subset cuando la figura completa sea muy extensa;
4. añadir SKY_DISCOVERY_SPECIFICITY_ORACLE;
5. añadir mapa de aceptación por campo/zoom y tasa de blind clicks.

No fijar un % objetivo arbitrario sin HUMAN calibration, pero el resultado actual merece patch antes de congelar la regla.

## Finding P1 · siguiente objetivo aparece mientras la ficha anterior sigue abierta

En el vídeo, tras revelar Orión:
- el panel sigue explicando Orión;
- la cabecera ya cambia a `Busca 4 estrellas claras.`

Eso mezcla dos tareas:
`profundizar hallazgo anterior` + `buscar siguiente objetivo`.

Mejora:
- recalcular internamente el próximo objetivo inmediatamente;
- pero mostrarlo sólo al cerrar la ficha / pulsar Seguir explorando.

Así se mantiene continuidad cognitiva sin perder estado.

## Finding P1 · Examinar zona central sigue visualmente dominante en móvil

La vía de teclado está correctamente diferenciada semánticamente.

Pero en 320, el botón de zona central queda como uno de los elementos más prominentes después del cielo, aunque touch ya permite pulsar directamente.

No eliminarlo.

Propuesta:
- mantenerlo como vía accesible secundaria;
- estilo secundario frente al gesto directo;
- copy corto `Examinar el centro`;
- ayuda explica que es la alternativa de centro/teclado.

Validar en HUMAN QA que no vuelva a inducir la metáfora de retícula como flujo principal.

## Pistas R02

PASS técnico de unicidad dentro del campo:
- 88/88 distinguen por valores en su campo;
- 63 textos ES distintos;
- 0 no distinguidas.

Pero siguen siendo principalmente descripciones numéricas:
`n estrellas claras / magnitud / extensión`.

Para R02 field-scoped es aceptable.

Para cielo continuo, cambiar oracle a:
`CLUE_UNIQUE_WITHIN_VISIBLE_NEIGHBORHOOD`

y favorecer:
- asterismos;
- estrellas ancla;
- star-hop desde hallazgos;
- Vía Láctea;
- forma reconocible.

## Browser/AT

El autor aporta 65/65 Chromium PASS.

Axioma pudo inspeccionar código, paquete, vídeo, datos y ejecutar el motor exacto en Node, pero el Chromium de este entorno bloquea file:// y hosts locales por política administrativa; no se atribuye una segunda ejecución browser completa.

Pendientes reales:
- NVDA/VoiceOver/TalkBack;
- teléfono físico;
- Firefox/Safari;
- zoom navegador real.

## Decisión

R02 es una mejora fuerte y mantiene el núcleo.

No volver a R01.

Antes de llamar final a la interacción de 88:
1. patch de specificity móvil;
2. separar visualmente ficha actual / siguiente objetivo;
3. HUMAN QA de la prominencia de Examinar centro.

Después:
`HUMAN QA R02 → prototipo cielo continuo entre 2 campos → decisión R03`

Resultado:
`AXIOMA_SKY_COMPLETE_R02_KEEP_MAJOR_IMPROVEMENTS__SPECIFICITY_REWORK_REQUIRED`

No main. No deploy.
