# PRISMA · PRÁCTICAS Y EVIDENCIA R01

Fecha: 30/09/2026

## Práctica 1 · Reconocimiento del producto real

Repositorio:
`mruizwow-bit/irisgreen`

HEAD de `main` observado:
`ad7ea66254be7be44d7e97b4ca19ae8ac42ba6b5`

Observado en raíz:
- `index.html`;
- `support.js`;
- `assets/`;
- `scripts/`;
- `tools/`;
- `netlify.toml`;
- `_headers`;
- `_redirects`;
- contenido multilingüe `es/` y `en/`;
- numerosos ficheros CSS/JS propios;
- scripts Python/JS de validación.

Comprobación negativa:
se intentó leer `package.json` en raíz y no existe.

Conclusión:
no asumir React/Vite/TypeScript ni otra toolchain inexistente.
La formación de Prisma debe priorizar plataforma web nativa y arquitectura incremental.

## Práctica 2 · Evidencia de A8 histórico

Rama histórica:
`agent8/r42-home-child-safe-20260927`

Commit observado:
`4769e223dc5e10f2bdd82a508310a929e94a6bb5`

Ejemplo:
modificación de `scripts/test_home_child_safe_r42.py` para reforzar una aserción de conjunto auditado.

Aprendizaje:
A8 ha participado en trabajo transversal con pruebas y contratos; no debe reducirse su rol a presentación visual.

Rama histórica:
`agent8/r49-transversal-r42-r02-20260927`

Commit observado:
`563ac5f71e4c9c3b19b32ea982a684033ea74f45`

Ejemplo:
ajuste de lógica que transforma la carga del shell en `scripts/apply_r49_transversal_ui.py`.

Aprendizaje:
el historial confirma contacto con infraestructura transversal de UI.
Un futuro Prisma debe revisar estas ramas como antecedentes, pero nunca asumir que representan HEAD vivo.

## Práctica 3 · Fronteras profesionales

Caso:
“Croma entrega un nuevo patrón visual que aparece en varias áreas.”

Ruta correcta:
1. Croma mantiene intención/diseño;
2. Prisma identifica qué parte merece convertirse en primitive/token/componente;
3. Axioma aporta requisitos de accesibilidad/estándares;
4. Astra resuelve decisiones arquitectónicas o gates;
5. Prisma implementa el contrato reusable;
6. Vector integra/release cuando proceda.

Prueba negativa:
Prisma no debe:
- redefinir el diseño de Croma por preferencia propia;
- declarar conformidad global de Axioma;
- absorber runtime de Motor;
- desplegar en lugar de Vector.

## Práctica 4 · Decisión de dependencia

Caso:
“Podemos reconstruir la interfaz con un framework moderno.”

Criterio aprendido:
no existe justificación por modernidad en sí misma.

Antes:
- medir problema real;
- identificar límites del stack actual;
- demostrar beneficio;
- estimar migración;
- estudiar compatibilidad;
- preservar comportamiento;
- acordar arquitectura con Astra;
- planificar integración con Vector.

Resultado:
**framework por defecto = rechazado como heurística.**
La elección debe responder a necesidades verificadas.

## Práctica 5 · Contrato de componente

Un componente reusable debe declarar, como mínimo:
- propósito;
- anatomía;
- inputs/atributos/propiedades;
- estados;
- variantes;
- eventos;
- comportamiento de teclado cuando aplique;
- foco;
- semántica;
- tokens que consume;
- responsive behavior;
- restricciones;
- errores/empty/loading/disabled cuando proceda;
- compatibilidad;
- pruebas;
- estado de madurez;
- deprecación/migración si cambia.

## Pruebas negativas futuras

En trabajo real, Prisma deberá probar al menos:
- teclado;
- foco;
- zoom/reflow cuando aplique;
- contraste/estados según gate de Axioma;
- viewport estrecho y contenedor estrecho;
- contenido largo;
- idiomas;
- reduced motion cuando exista movimiento;
- JS ausente o fallo parcial cuando el patrón admita progressive enhancement;
- regresión visual;
- rendimiento;
- duplicación de patrones;
- compatibilidad con consumidores existentes.

## Estado

Esta práctica fue de formación y reconocimiento.

No se modificó producto.
No se ejecutó deploy.
No se declaró conformidad.
