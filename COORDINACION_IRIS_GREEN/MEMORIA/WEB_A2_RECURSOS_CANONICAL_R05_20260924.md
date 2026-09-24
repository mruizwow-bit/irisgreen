# WEB-A2 · Recursos de Iris Green, cierre R05

Fecha: 24/09/2026  
Responsable: María y agente 2

## Decisión aplicada

Iris Green publicada es la base visual y funcional. Los cinco paquetes de Design aportan contenidos y datos ES/EN; no sustituyen la cabecera, navegación, accesibilidad ni pie comunes. El brief válido es el de Iris Green, conforme al markdown de coordinación recibido hoy.

## Entrega y pruebas

- Los cinco paquetes quedaron integrados en `main` mediante PR #239; Rincón tranquilo / Quiet space mediante PR #240.
- La corrección de las páginas índice de Recursos ES/EN quedó integrada mediante PR #241, squash `af850207129e8d5442d0bd2e3ad60d4f379a7125`.
- `/es/recursos/` y `/en/resources/` utilizan la cabecera y el pie comunes de Iris Green, navegación, controles Lectura/Música y tarjetas de Juegos, Rutinas visuales y Rutinas imprimibles; la versión ES incluye Tarjeta Iris.
- Los enlaces canónicos y hreflang se corresponden en ambas direcciones. El cambio de idioma mantiene el host de la previsualización #241.
- `python3 scripts/build_site.py` finalizó correctamente. En la previsualización Netlify #241 se comprobaron visualmente ambas páginas en escritorio y el salto ES → EN. No se certifica aquí una revisión visual móvil completa de Recursos.

## Estado de publicación

El código está fusionado en `main`; la producción pública sigue deliberadamente en el despliegue anterior. Este cierre no ordena ni realiza un nuevo despliegue de producción. Quedan para decisión de María la revisión visual final antes de publicar y la retirada o redirección de las antiguas páginas de juegos que ya no se enlazan. No se ha incorporado el `netlify.toml` anterior.
