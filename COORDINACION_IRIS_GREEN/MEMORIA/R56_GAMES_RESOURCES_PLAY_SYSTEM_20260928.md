# R56 · Astra · Rediseño Juegos + Recursos + capa lúdica de Intereses · 28/09/2026

Issue: #320
Estado: `R56_ASTRA_GAMES_RESOURCES_PLAY_SYSTEM_DESIGN_FROZEN`

## Decisión de producto

La biblioteca actual mezcla cuatro tipos de producto:
- GAME;
- ROUTINE_PRACTICE;
- TOOL;
- INTEREST_MINIGAME.

La auditoría previa encontró un volumen muy alto de juegos derivados de rutinas, y el metadata R42 vigente concentra 224/297 en la mecánica ordenar. Por tanto, la identidad pública de Juegos no puede seguir siendo una extensión de Rutinas.

## Nuevo modelo

### Rutinas
`Ver · Practicar · Crear la mía · Imprimir`.

Las prácticas cotidianas actuales se preservan y migran semánticamente a Practicar.

### Juegos
Espacio de juego real:
- exploración;
- puzle;
- construcción;
- colección;
- música;
- estrategia tranquila;
- palabras/historias;
- juguetes digitales.

Sin presión, puntos, streaks o obligación de volver.

### Intereses
Añadir `play_role = NONE | SECONDARY | PRIMARY`.

Minijuegos solo cuando la actividad sea natural al tema:
pesca, observación, búsqueda, fósiles, minerales, rutas, constelaciones, etc.

### Recursos
Herramientas prácticas:
- Rutinas;
- Tarjeta Iris;
- Descargas visuales;
- futuras herramientas.

Visuales = preview del producto real, no icono.

## Pilotos

1. Habitación imposible
2. Terrario vivo
3. Rutas de luz
4. Ritmo de colores
5. Pesca tranquila
6. Mi museo

Método:
`concepto aprobado -> implementación -> comparación -> corrección -> Astra -> María -> escala`.

## Reclasificación

297/297 deben recibir:
`product_kind`, `play_loop`, `intrinsic_play`, relación rutina/interés y estado visual/a11y.

## Regla de calidad

No KPI de 200 juegos.
Calidad, identidad, variedad y accesibilidad mandan.

No escalar antes de:
`R56_PLAY_SYSTEM_STANDARD_APPROVED_FOR_SCALE`.
