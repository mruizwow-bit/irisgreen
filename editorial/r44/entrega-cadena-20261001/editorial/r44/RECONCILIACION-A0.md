# R44 · A0 · reconciliación contra el Taller construido

Fecha: 30/09/2026 · Issue #319

El §3 de la orden pide reconciliar contra el Taller final aprobado antes de
implementar cada piloto. La reconciliación anterior
(`MEMORIA/R44_MATRIZ_RECONCILIADA_OLA_A_CLAUDE_20260930.md`) comprobó motores,
exportadores, entrada y accesibilidad de los 27 estudios. No comprobó **si el
reto ya existía dentro del estudio**, y ahí está el problema.

## Lo medido

Leyendo el bloque `igt-i18n` de las ocho páginas de estudio implicadas:

| Ámbito | Estudio | Retos que ya trae |
|---|---|---:|
| Dibujo | `es/taller/dibujo/` | **15** |
| Estructuras | `es/taller/estructuras/` | **11** |
| Circuitos | `es/taller/circuitos/` | **14** |
| Pixel art | `es/taller/pixel-art/` | 0 |
| Escritura | `es/taller/escritura-restricciones/` | 0 |
| Juegos de mesa | `es/taller/juegos-de-mesa/` | 0 |
| Ritmo | `es/taller/ritmo/` | 0 |
| Videojuegos | `es/taller/videojuegos/` | 0 |

## Tres pilotos de los ocho ya están construidos

No parecidos: **el mismo reto**, con sus reglas y su comprobación automática.

| Piloto R44 | Ya existe como | Reglas que ya tiene |
|---|---|---|
| `E01` Una línea sin levantar el lápiz | `d1` **Una sola línea** (Dibujo, nivel 1) | `maxStrokes: 1`, `noErase: true` |
| `E17` Un puente que aguanta el camión | `e6` **Pasa un camión** (Estructuras, nivel 3) | prueba de carga del estudio |
| `E22` Un semáforo que no se equivoca | `l6` **Semáforo** (Circuitos, nivel 4) | lógica y tabla del estudio |

Construirlos otra vez bajo R44 mete un segundo sistema de retos dentro del
mismo estudio: dos listas, dos estados, dos comprobaciones y dos sitios donde
mirar. Es el mismo error que la matriz reconciliada ya señaló con
`taller-retos.json`, pero un nivel más adentro.

## Lo que propongo

- **Donde el reto ya existe** (E01, E17, E22): R44 no lo reconstruye. Lo
  **adopta**: el panel R44 apunta al reto del estudio, hereda su comprobación y
  añade lo que R44 sí aporta y el estudio no tiene —ficha con ID de matriz,
  `recommended_stage`/`starter_stage` separados de `audience`, criterio de
  aprobación humana, y ES/EN completos con nombres accesibles—.
- **Donde no existe** (E06, E28, E34, E38, E44, cinco de ocho): el framework
  R44 aporta la capa entera, que es donde de verdad añade.

Con eso A0 sigue cubriendo los ocho ámbitos del §4 y ninguno de los ocho IDs se
inventa ni se duplica.

## Lo que no cambia

El framework ya construido y medido (`assets/ig-retos-r44.js`,
`assets/ig-retos-r44.css`, `assets/retos-r44.json`) vale para las dos ramas del
reparto: la adopción es un campo más en la ficha, no otro motor.
