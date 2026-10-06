# PRISMA · Fósiles R02 · piloto ejecutable de 3 encuentros

Entrada: `index.html`.

Abrir:
1. Extraer el ZIP completo.
2. Abrir `index.html` en un navegador moderno.
3. No necesita servidor, instalación ni conexión de red para funcionar.

## Alcance

Implementación Prisma sobre la base `NEXO_FOSILES_PRACTICA_R01.zip`.
Base SHA-256: `21a6663524368ad2322f06e405d6af1417e42b21925d4a2123c9c29934ae668c`.

Piloto público:
1. Trilobite — segmentación visible.
2. Dimetrodon — prolongación estrecha y continuidad con base vertebral.
3. Meganeura — contorno de impresión y red de líneas internas.

Los 14 assets fósiles de R01 se preservan byte a byte dentro del paquete. Los otros once no se presentan como experiencias terminadas.

## Contrato

`EXPLORAR → NOTAR INDICIO → HACER VISIBLE UN RASGO → OBSERVAR → REVELAR CONTEXTO → PROFUNDIZAR`

No hay porcentaje global de limpieza. Las decisiones dependen de regiones manuales y tolerantes de los tres pilotos. La misma evaluación gobierna status, Observación y Revelar contexto.

## Entradas

Puntero:
- Explorar: toque/clic señala; arrastre desplaza vista.
- Despejar: toque/clic retira cobertura local; arrastre retira cobertura a lo largo del gesto.
- `Despejar zona señalada`: alternativa sin arrastrar que actúa exactamente en el punto marcado.
- `Guiarme al siguiente detalle`: señala y, si hace falta, reencuadra de forma explícita; nunca despeja automáticamente.

Teclado con la escena enfocada:
- flechas: mover vista en Explorar / punto de trabajo en Despejar;
- Enter/Espacio: seleccionar o despejar;
- + / −: zoom;
- O: observar;
- I: revelar contexto;
- Escape: volver a Explorar.

## Estado

El progreso dura durante la sesión actual. Recargar reinicia el piloto. No se promete persistencia entre visitas.

## Límites

- Las ilustraciones son representaciones digitales heredadas, no especímenes concretos.
- No se infieren reverso, relieve o escala física no documentados.
- La cobertura es una simplificación interactiva, no una simulación de preparación paleontológica profesional.
- La identificación es contexto de la representación; no se afirma que un rasgo aislado permita diagnosticar científicamente una especie.

`NO MAIN · NO PUBLIC DEPLOY · NO SABIK`
