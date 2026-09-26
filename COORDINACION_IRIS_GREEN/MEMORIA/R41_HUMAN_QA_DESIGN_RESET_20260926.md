# Memoria · R41 HUMAN QA Design Reset · 26/09/2026

## Observación de María
La preview integrada del Taller, después de #263, no se acepta visualmente.

Capturas revisadas:
- portada con seis áreas en grandes acordeones;
- Mi colección/proyectos al final con texto y botones nativos;
- estudio Dibujo con bloque Retos antes del lienzo;
- fila extensa de acciones de igual jerarquía;
- lienzo relegado debajo;
- herramientas/propiedades con apariencia de formulario.

Percepción expresada: el diseño se siente muy atrasado y las nuevas entregas están cambiando interfaz sin construir una experiencia interactiva moderna.

## Causa identificada
Las órdenes R40 eran fuertes en inventario funcional y seguridad, pero insuficientemente prescriptivas en experiencia. Los agentes optimizaron para checks: presencia, conteos, 44 px, rutas, páginas y funciones. Eso permitió una implementación técnicamente correcta pero visualmente débil.

## Decisión
Se crea R41 (#276) como reset de diseño interactivo.

R40 queda como base funcional/histórica, no como aceptación visual:
- #260 → #277
- #261 → #279
- #262 → #280
- #263 → #278
- #265 → #282

Rincón R04 #271/PR274 conserva sus nuevos assets; aceptación final se rige también por #281.

## Dirección de producto
- workspace-first;
- direct manipulation;
- inspector contextual;
- toolbars compactas;
- secondary actions en popover/drawer;
- mobile específico;
- human QA en web.

## Estado observado de web al reset
A2 branch:
- HEAD `e7e2e986e370af093c094a78deaacd2eb1f04707`
- mensaje: `A2 R40: integrar Taller 25 + capa local de A5`

Ese HEAD es evidencia/base funcional, no diseño aceptado.

## Estado
`R41_INTERACTIVE_PRODUCT_REBUILD_REQUIRED`
