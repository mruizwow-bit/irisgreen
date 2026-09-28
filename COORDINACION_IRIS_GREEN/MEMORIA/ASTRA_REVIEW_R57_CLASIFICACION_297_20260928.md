# R57 · Astra review clasificación 297/297 · 28/09/2026

Issue: #321
Estado: `R57_ASTRA_GAMES_297_CLASSIFICATION_ACCEPTED`

## Entregables revisados
- clasificacion-297.json
- clasificacion-297.csv

JSON/CSV contienen los mismos 297 IDs y coinciden en campos clave.

## Resultado
- 297 registros
- 297 IDs únicos
- 0 sin product_kind
- 260 ROUTINE_PRACTICE
- 26 TOOL
- 11 GAME
- 0 INTEREST_MINIGAME

## Lectura Astra
Los 11 GAME son todos variantes de memoria/parejas.

Dos deben fusionarse:
- r40-higiene-memoria -> memoria-de-la-higiene
- r40-comidas-memoria -> memoria-de-la-cocina

Lectura correcta tras dedupe:
**1 motor de memoria + 9 barajas temáticas**, no 11 juegos finales distintos.

## ROUTINE_PRACTICE
Clasificación aceptada.

106/260 tienen routine_id.
154/260 todavía necesitan matriz de destino antes de migrar a Rutinas → Practicar.

## TOOL
26 aceptados como salida de Juegos.

Después se enrutan entre:
- Rutinas/planificación
- Recursos generales
- apoyos de transición/autocuidado

## Human review
32 registros marcados.

27 MEDIUM:
product_kind aceptado.

5 LOW:
- intruso-ducha / intruso-compra / intruso-escritorio:
  ROUTINE_PRACTICE + REWORK_OR_RETIRE
- busca-lo-que-necesitas-para-salir / busca-lo-del-bano:
  ROUTINE_PRACTICE + REWORK
  y candidato a nueva familia VISUAL_SEARCH si se reconstruye como juego real.

## INTEREST_MINIGAME
0 es correcto para el dataset histórico.
Los nuevos minijuegos de Intereses se crean en R56/R58, no salen de estos 297.

## Gate
P0 aceptado.

Codex HOLD hasta:
`R56_PLAY_6_PILOT_CONCEPTS_APPROVED_FOR_CODEX`.

No migración, no A2, no main, no producción.
