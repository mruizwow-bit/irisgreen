# WEB-A2 · Taller e Intereses integrados en Iris Green · R06

Fecha: 24/09/2026  
Responsable de integración: María y agente 2  
Origen: entrega de Claude R01 en el ZIP completo con Sistema Solar

## Base y alcance

Se integró el paquete `IRIS_TALLER_INTERESES_SISTEMA_SOLAR_ES_EN_PARA_SUBIR.zip` sobre `main` `af850207129e8d5442d0bd2e3ad60d4f379a7125`, sin superponer el ZIP anterior de menor alcance. Contiene El taller / The workshop, Tus intereses / Your interests, Cielo nocturno / Night sky y Planetas y sistema solar / Solar system, con sus datos, scripts y recursos gráficos. Se mantiene Iris Green como web canónica. Las páginas del Taller se adaptaron para usar su cabecera, navegación, panel Lectura, música, idioma, CSS y pie comunes; los módulos de contenido del paquete permanecen dentro.

## Integración y pruebas

- PR #242 fusionada en `main` con squash `117a53a01bf254054f759e7e08eb06ba06f00d00`. 100 archivos.
- `python3 scripts/build_site.py` correcto: 2156 archivos públicos y cero `eval`/`new Function`. `python3 scripts/prepare_initial_data.py --check` correcto.
- Netlify deploy preview #242 con estado SUCCESS. En navegador se comprobaron Taller ES y EN, el salto de idioma dentro de preview, filtro Diez minutos (72 a 35 retos), apertura de Lectura accesible, una única cabecera y pie, y el pie después del contenido.
- Se comprobó Tus intereses ES con enlace al Sistema Solar; la página solar muestra fichas y datos dinámicos. En este navegador remoto no hubo WebGL para comprobar la escena 3D: apareció la alternativa textual prevista. No se certifica aquí 3D en dispositivo real ni revisión móvil independiente.
- Rutas ES/EN y hreflang presentes en las páginas nuevas. No se modificaron Rincón, Juegos, Rutinas, Sabik o Cloud.

## Estado de publicación

El código está en `main`; no se hizo un nuevo despliegue de producción. La revisión final en dispositivo con WebGL y móvil, y la decisión de publicación pública, permanecen con María. Las pruebas locales descritas en la entrega original de Claude constan en su memoria R01 y no se presentan como repetidas aquí.
