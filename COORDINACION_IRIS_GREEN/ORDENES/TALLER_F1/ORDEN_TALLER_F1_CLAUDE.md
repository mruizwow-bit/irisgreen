# Orden · TALLER-F1 · Claude (carril Taller)

ESTADO: RECIBIDA → ENTREGADA_CON_CODIGO (ver `MEMORIA/ENTREGA_TALLER_F1_ESTUDIOS_R01_20260924.md`)
AUTORIDAD: instrucción directa de María, 24/09/2026: «otro agente está con Intereses (…); tú te encargarás del Taller». Plan de referencia: documento «Iris Green · Taller e Intereses: investigación, catálogo y plan» (24/09/2026), fases 0 y 1.
BASE_HEAD: `main` `117a53a01bf254054f759e7e08eb06ba06f00d00` (PR #242, que ya contiene Taller e Intereses integrados por María y agente 2).
ARCHIVOS_PROPIOS: `es/taller/**`, `en/workshop/**`, `assets/ig-taller-*`, `scripts/build_taller_estudios.py`, `scripts/taller_estudios/**`. Intereses, Rincón, Juegos, Rutinas, Sabik, Cloud y la navegación común quedan fuera.
OBJETIVO: Taller I (fase 1): estudios de Dibujo (1), Estructuras y puentes (7), Programación (12), Robótica (13) e Ideas (25, con las seis actividades actuales), más las piezas de la base común que necesitan (guardar y abrir proyectos en archivo propio, deshacer sin límite, retos por niveles con modo libre, imprimir).
ENTREGA: código y páginas ES/EN listos para subir (ZIP), parche, pruebas y capturas ES/EN de escritorio y móvil. Nada se publica sin el visto bueno de María.

## Marco normativo incorporado

NORMATIVA_VERSION: REQUISITOS_OPERATIVOS_ES_EN + MARCO_NORMATIVO_TRANSVERSAL_R01 (22/09/2026), aplicado solo en lo que afecta al Taller.

Construcción: páginas con la cabecera, navegación, Lectura, Música y pie de Iris Green; sin shell propio. Sin dependencias externas, sin eval ni `new Function`, sin peticiones de red, sin relajar la CSP.

Accesibilidad: WCAG 2.2 AA (ISO/IEC 40500:2025) como referencia funcional; EN 301 549 V4.1.1 como objetivo técnico (V3.2.1 sigue siendo la referencia armonizada hasta su cita en el DOUE); ISO 9241-171:2025 para el software. HTML semántico, teclado completo (también para dibujar, construir y programar), foco visible y no tapado, controles de 44 px, alternativa textual a todo lo que se dibuja en canvas, nada solo por color, movimiento reducido respetado, 320 px, espaciado de texto, colores forzados. Capa COGA.

Escritura y lectura: ISO 24495-1:2023, frases cortas, lo principal primero, términos técnicos explicados (tracción, compresión, pandeo, recursividad…), segunda persona, sin tono infantil, sin diagnóstico. No se etiqueta nada como Lectura Fácil. Usabilidad y presentación: ISO 9241-210, 9241-11 y 9241-112.

Privacidad: RGPD/LOPDGDD. Sin datos personales, sin registro de conducta, sin almacenamiento del navegador en el Taller: el trabajo vive en la página y se guarda solo en un archivo que descarga la persona. Sin puntuaciones ni comparación con otras personas.

Descargables: todo PNG e impresión lleva IRIS GREEN · irisgreen.eu, discreta, sin tapar el trabajo y en todas las páginas. Fuentes y límites de los datos visibles.

## Obligación bilingüe

IDIOMAS: ES+EN. Una sola fuente de textos por estudio (`scripts/taller_estudios/*.py`) con comprobación de que las claves ES y EN coinciden. Las pruebas recorren las rutas EN con todos los retos buscando texto en español.

## Comprobaciones de salida

Registradas en `EVIDENCIAS/TALLER_F1_R01/`.
