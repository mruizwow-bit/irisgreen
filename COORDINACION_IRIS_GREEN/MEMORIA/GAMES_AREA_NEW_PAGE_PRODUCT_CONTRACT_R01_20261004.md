# ÁREA DE JUEGOS · NUEVA BASE R01

Fecha: 2026-10-04
Base: main@b9d9858dc2f2d892f57175057277ca399815080b
Rama: nexo/new-games-area-r01-20261004

Estado:
`GAMES_AREA_R01_ONE_GAME_AT_A_TIME_ACTIVE`

## Regla
`ONE_GAME → USE → HUMAN_QA → FIX/FREEZE → NEXT_GAME`

No añadir el segundo juego hasta que María use y apruebe el primero.

## Superficie nueva
- `/es/juegos/`
- `/es/juegos/mapa-del-tesoro/`

Ambas:
- noindex/nofollow durante construcción;
- no enlazadas desde Home;
- no sustituyen legacy;
- no modifican Recursos.

## Primer juego
`Mapa del tesoro de casa`

Se monta desde el prototipo R06.1 validado.
No rework previo a uso real.

## Legacy
`/es/recursos/juegos/` y `/en/resources/games/` permanecen intactos como rollback.

## Motor
Motor continúa Sabik/Home sobre main.
Esta rama no toca Home, Sabik, build scripts ni assets legacy de Juegos.

## Cutover
Bloqueado hasta:
1. HUMAN QA María del primer juego;
2. patrón de página de Juegos aprobado;
3. siguientes juegos probados uno a uno;
4. fresh-main drift check;
5. reconciliación;
6. Axioma;
7. cutover atómico.

## Reconciliación previa al preview
La rama fue rehecha desde `main@496dc10a9e791331aa43647c32aa74048c698584` después de detectar que el primer preview se había quedado 16 commits por detrás del trabajo activo de Motor/Sabik. Solo se reaplicaron los archivos aislados de esta nueva Área de Juegos.
