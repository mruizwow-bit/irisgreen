# Workspace Design · estados, voz y movimiento

Orden completa: issue #148.  
Epic: #145.  
Programa: PR #144.

## Alcance de esta rama

Definir el comportamiento visual de los estados y la voz sin editar todavía runtime, Core, HTML ni CSS público.

Entregar:

- tabla visual y textual de estados;
- comportamiento del holograma en silencio, búsqueda, composición, respuesta, voz, pausa, error y protección;
- ondas quietas en silencio y reactivas solo durante locución;
- fallback visual si el navegador no emite límites de palabra;
- variante `prefers-reduced-motion` y control manual;
- controles y etiquetas separados;
- foco, contraste y estados interactivos;
- escritorio, tableta, móvil, zoom y 320 CSS px;
- valores implementables: duración, amplitud, opacidad y condiciones de inicio/fin.

Archivos permitidos:

- `docs/sabik/design/**`
- activos de prototipo marcados expresamente como no públicos

No tocar `main`, producción, `sabik-page.css`, `sabik-page.js`, `/es/nea/index.html` ni el Core.
