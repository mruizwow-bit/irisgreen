# R54 · Taller · corrección visual Home + interiores · 28/09/2026

Issue: #318
Estado: `R54_CLAUDE_TALLER_VISUAL_REBUILD_ORDERED`

## Fuente auditada

- `R47_TALLER_DEFINITIVO.patch.gz`
- `COORDINACION_R47.patch.gz`

Astra detecta que la Home del Taller usa en muchas tarjetas `igk-art` con SVG inline demasiado esquemáticos: bloques, pocas líneas, cuadrículas y formas mínimas.

## Decisión de María

**El Taller no puede entrar por iconos; tiene que entrar por escenas.**

El problema no es el uso de SVG, sino el nivel de resolución visual.

## Alcance

KEEP:
- 27 estudios;
- motores;
- child-safe;
- R42/R02;
- storage/privacidad;
- workspace architecture;
- ES/EN;
- exportaciones;
- tests funcionales.

REBUILD:
- arte de la Home;
- hero/starter visual de interiores;
- composiciones demasiado esquemáticas;
- variantes de infancia cuando hagan falta.

## Regla por etapa

Infancia:
- más inmediata;
- cálida;
- narrativa;
- objetos grandes;
- menos abstracción técnica.

Adolescencia/adultez:
- pueden ser más sobrias;
- nunca vacías ni iconográficas.

## Gate

FAIL:
- icono ampliado;
- “dos líneas y ya”;
- placeholder;
- Home atractiva pero interiores pobres;
- infancia con estética técnica.

PASS:
- mini-escenas;
- estudio reconocible sin leer título;
- actividad/creación visibles;
- diferenciación real 27/27;
- interiores visualmente coherentes.

Marcador:
`R54_CLAUDE_TALLER_HOME_INTERIORS_VISUAL_READY_FOR_ASTRA`.

Claude → Astra → A2 → preview → HUMAN QA María.
