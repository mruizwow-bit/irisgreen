# Memoria · protección de menores en Situaciones y Condiciones · 26/09/2026

## Decisión de María
Tras adoptar separación por etapas de vida, María plantea extenderla a toda la parte de Situaciones y Condiciones. Motivo principal: evitar que un niño entre en un juego/recurso y llegue accidentalmente a contenido de alta sensibilidad como autolesión u otros temas potencialmente dañinos.

## Estado observado
En el HEAD A2 observado:
- Condiciones publica un catálogo abierto de 185 fichas.
- Situaciones publica un catálogo abierto de 187 fichas.
- `buscador.json` mezcla ambos catálogos y no tiene todavía campos canónicos de etapa/sensibilidad/discovery.
- Condiciones contiene en el mismo catálogo temas de sensibilidad muy distinta, por ejemplo abuso y explotación, anorexia nerviosa, TCA, depresión, TEPT y sexualidad.
- No se encontró en el árbol actual una ruta cuyo slug sea específicamente “autolesion”; esto no excluye menciones dentro de otras páginas ni futuras incorporaciones.

## Decisión arquitectónica
Separar dos ejes:
1. etapa: infancia / adolescencia / adultez / transversal;
2. sensibilidad: S0 / S1 / S2.

El sistema debe impedir **exposición incidental**, no impedir que un menor encuentre una vía segura de ayuda.

### Infancia
S2 no aparece en recomendación/browse/enlaces desde juegos. Los temas necesarios para seguridad se ofrecen en variante infantil segura.

### Adolescencia
S2 solo con intención clara, aviso neutral y contenido seguro.

### Adultez
Catálogo completo.

### Cualquier edad
Safe-by-default para descubrimiento incidental.

## Privacidad
No DOB, cuenta ni identidad. Preferencia por etapa local/session y explícita.

## Issues
- #293 parent
- #294 A4 clasificación
- #295 A3 implementación
- #296 A1 enlaces desde recursos
- #297 A2 integración/live QA

Estado: `R42_CHILD_SAFE_CONTENT_ARCHITECTURE_REQUIRED`.
