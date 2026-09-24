# Entrega · Rincón tranquilo R02 + Recursos R03 · Claude

- **Fecha:** 24/09/2026.
- **Responsable:** Claude, por encargo directo de María.
- **Estado:** ENTREGADA_CON_CODIGO. No está integrada ni desplegada: la integración web corresponde a María y al agente 2.

## Orden y autoridad

- Petición de María del 24/09/2026: seguir mejorando el Rincón tranquilo (escenas sensoriales, sonido y pantalla) y ejecutar el Brief Design R02 («Muchos más juegos + rutinas descargables + pictogramas · todas las edades»; DEC-113, DEC-114, DEC-110/109/024/023), primera entrega R03.
- Regla de María: Claude entrega el trabajo terminado en ES y EN, adaptado a la web y a la normativa de escritura y adaptabilidad, en un zip listo para subir. Claude no sube ni despliega nada.
- Lectura previa: README, ESTADO_ACTUAL, NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN, ORDENES (EQUIPO_VIGENTE, PLANTILLA_ORDEN), MEMORIA (DECISION_CENTRALIZACION_ES_EN, ESTADO_CONSOLIDADO), CONTROL/ESTADO_TRABAJOS y el marco transversal R01 que María pegó en el chat.

## Base y resultado

| Dato | Valor |
|---|---|
| Base | `integration/irisgreen-full-r35-20260923` HEAD `299dae1367f422780a6d8ff955805c80ec89f2d5` (trabajo vigente de María + agente 2). No es main ni una copia antigua. |
| Rama de entrega (local, sin push) | `claude/rincon-r02-recursos-r03-20260924` |
| HEAD | `6409d85d22e74d2b801ad2f0bedf61da3be1dec8` |
| Tree | `16d3bc01172e3921a78394d927e074d38d10a938` |
| Cambios | 8 commits. Todos los archivos son nuevos salvo 8 modificados. No se borra nada. |

Modificados:
- `es/sitio-tranquilo/index.html` y `en/quiet-space/index.html`;
- `es/recursos/juegos/index.html` y `en/resources/games/index.html`;
- `es/recursos/rutinas-visuales/index.html` y `en/resources/visual-routines/index.html`;
- `assets/data/juegos-iris-data.js`;
- `assets/rutinas-publicas.js`: la etiqueta de etapa usa `data-etapa` cuando existe.

**Entrega:** el zip `irisgreen-r02-r03-listo.zip` contiene `web/` (archivos añadidos o modificados respecto a 299dae13) y `COORDINACION_IRIS_GREEN/` (esta actualización). Comprobado: al copiar `web/` sobre una copia limpia de 299dae13 se obtiene exactamente el tree `16d3bc01…`, y el build pasa.

## Qué se entrega

**Rincón tranquilo R02** (Mirar, Escuchar y Pausa ya existentes):
- Dos escenas 3D nuevas, hechas por Iris Green (sin vídeo ni red): **Medusas / Jellyfish** y **Fibra óptica / Fibre optics**. Se suman al acuario y al tubo de burbujas. Tienen versión 2D si el navegador no permite 3D y respetan «Reducir movimiento».
- **Sonido de la escena / Scene sound**, opcional:
  - lo genera la página con Web Audio, sin archivos ni licencias;
  - apagado por defecto, con volumen propio;
  - entra en 4 s y sale en 1,5 s;
  - nunca suena a la vez que otro sonido, vídeo o la mezcla.
- **Ver a pantalla completa / View full screen**; se sale con Esc.
- **Pantalla encendida** (Wake Lock) mientras hay una escena o la pausa en marcha. Se libera al parar o al salir.
- Botón «Parar vídeo o escena / Stop video or scene».
- **Mirar en grande / Watch at full size.** Al empezar un vídeo de YouTube o cualquier escena (acuario, tubo, medusas, fibra), la tarjeta Mirar ocupa todo el ancho, la imagen pasa arriba y sus botones quedan justo debajo. Medido: de 290 a 982 px de ancho a 1440 px; en móvil ocupa todo el ancho de la tarjeta (307 px a 390). Si hace falta, la página baja hasta la imagen sin animación. Al parar, todo vuelve a su sitio.
- **Calidad 3D adaptable:** si el dispositivo va lento, baja la resolución interna hasta un 75 % como mínimo; si va sobrado, la sube.

**Juegos R03:**
- 21 juegos nuevos en el motor existente. El total pasa de 46 a 67.
- Por etapa: adolescencia 14, adultez 15, cualquier edad 4, infancia 1.
- Contexto nuevo: «Estudio y trabajo». Necesidad nueva: «Comunicación».
- Lista sin JavaScript en ES y EN.
- Catálogo con la plantilla de juego (objetivo observable, etc.) en `editorial/r03/juegos-r03.json`.
- 126 pictogramas Mulberry nuevos en `assets/juegos/mulberry-r03/`, con el `LICENSE-MULBERRY.txt` del commit.

**Rutinas descargables R03:**
- 12 rutinas completas, de la auditoría 92/427, elegidas por tener todos los pasos en estado MATCH.
- Por idioma: hoja A4 (PDF y PNG), tira para la nevera, tarjetas de pasos y lista para marcar. En total 96 PDF, 24 PNG y 24 vistas previas.
- Todas las páginas llevan la marca **IRIS GREEN · irisgreen.eu** abajo a la derecha y, separada, la atribución Mulberry.
- Nueva sección pública «Rutinas para descargar e imprimir / Routines to download and print» con vista previa (alt que enumera los pasos), etapa, contexto, formato y tamaño. Cada rutina enlaza a sus descargas.

**Documentación:**
- `editorial/r03/ARQUITECTURA_BIBLIOTECAS_R03.md`: arquitectura, filtros, plantillas y escalado a ≥200 juegos y 92 rutinas. Hay copia en esta carpeta (`R03_ARQUITECTURA_BIBLIOTECAS.md`).
- Manifest de pictogramas `editorial/r03/manifest-pictogramas-r03.csv`: 191 relaciones y 136 pictogramas.
- Generadores reproducibles en `tools/recursos-r03/` y `tools/escenas-3d/`.

## Addendum R02b · Rincón hecho por completo en Iris Green (24/09/2026)

Petición de María: quitar los vídeos de YouTube, dejar solo las escenas propias y crear también los sonidos y la música.

**Mirar**
- Sin YouTube. Se retiran la lista de 6 vídeos, sus textos y el código que creaba el reproductor, en ES y EN. La página ya no se conecta a ningún servicio externo; comprobado sin peticiones fuera del sitio.
- Cuatro escenas 3D nuevas, hechas en Iris Green, con tres ambientes de color:
  - **Mar / Sea:** olas con reflejo del sol, orilla con la lámina de agua que sube y baja, y espuma.
  - **Lluvia en la ventana / Rain on the window:** gotas que actúan como lentes sobre luces desenfocadas, y gotas grandes que resbalan dejando rastro.
  - **Río en el bosque / Stream in the forest:** agua con corriente y espuma en las piedras, 22.000 briznas de hierba que se mueven, árboles con copas de hojas, rayos de luz y hojas que caen y se van con el agua.
  - **Cielo nocturno / Night sky:** estrellas, aurora en cortinas, montañas, lago que refleja y pinos. Muy de vez en cuando cruza una estrella fugaz, sin destellos, y no aparece con «Reducir movimiento».
- En total hay 8 escenas propias. Si el navegador no permite 3D, aparece un aviso en texto y se proponen las escenas que tienen versión 2D.
- Los carteles `/img/rincon-tranquilo/*.svg` de los vídeos quedan sin uso. No se borran porque son de A2; pueden retirarse al integrar.

**Escuchar**
- Nuevo grupo «Creados en Iris Green / Made by Iris Green», en `assets/rincon-sonidos.js`, con 13 sonidos creados con Web Audio:
  - naturaleza: lluvia, lluvia en la ventana, olas, río, viento, pájaros, grillos y chimenea;
  - ruido rosa y ruido marrón;
  - música: piano suave, música ambiental y cuencos.
- La música se compone sola y nunca se repite igual.
- Sin archivos, sin grabaciones, sin licencias y sin red. Nada suena hasta que se pulsa. Entran bajito (4 s) y salen suave (1,5 s).
- El volumen de los 13 se igualó midiéndolo; los niveles medidos están en esta entrega.
- Los 13 también están en «Mezclar sonidos». Cada escena usa su propia mezcla creada.
- Solo suena una fuente a la vez: grabación, mezcla, sonido creado o sonido de escena.

**Decisión pendiente de María:** si se quitan las 8 grabaciones de Pixabay. Página de comparación privada, con fragmentos de 1 minuto: https://claude.ai/artifact/WENrpkAKBWR6kmvLd484V3. Hasta que María decida, las grabaciones siguen en la página, debajo de los sonidos creados.

**Verificación de R02b**
- Build: exit 0.
- `audit_target_size`, `audit_autoplay_motion`, `audit_focus_not_obscured`, `audit_nontext_contrast` y `audit_sin_js`: pasan.
- `audit_privacidad_almacenamiento`: 36 errores, los mismos que la base, ninguno de esta entrega.
- axe: 0 infracciones en ES y EN, a 1280 y 390 px.
- Sin desbordamiento horizontal a 320 px.
- Prueba funcional en ES y EN:
  - 8 escenas;
  - 13 sonidos creados;
  - 21 filas en la mezcla;
  - ningún AudioContext se crea antes de que la persona pulse;
  - la exclusividad entre fuentes funciona en los cuatro sentidos;
  - ninguna petición externa.
- La fluidez en ordenador y móvil reales está pendiente: aquí se renderiza por software.

## Comprobaciones de salida

**FUNCIONAMIENTO:**
- `python3 scripts/build_site.py` pasa: exit 0, incluidas las auditorías internas del build (estados públicos, CSP sin eval).
- Pruebas propias en Chromium:
  - las 4 escenas cargan en 3D sin errores de consola;
  - el sonido solo existe tras activarlo, y el AudioContext se crea después del gesto;
  - al reproducir la mezcla se apaga el sonido de escena;
  - todos los aria-pressed se reinician al parar;
  - los 21 juegos se validaron por datos (todas las claves de pictograma existen) y uno se jugó en ES y EN, escritorio y móvil;
  - 72 de 72 enlaces de descarga por página e idioma responden 200;
  - «Ver los pasos» abre la rutina.

**ACCESIBILIDAD:**
- axe-core 4.10.2 (WCAG 2.0/2.1/2.2 A y AA) en las 6 páginas afectadas, a 1280 y a 390 px: 0 infracciones, igual que la base.
- Auditorías del repositorio comparadas con la base 299dae13, con resultado idéntico:
  - `audit_target_size`, `audit_autoplay_motion`, `audit_focus_not_obscured`, `audit_nontext_contrast` y `audit_sin_js` pasan;
  - `test_accessibility_journey` falla igual que en la base porque busca `/es/recursos/juegos/las-cinco-cosas/`, un enlace anterior;
  - `audit_privacidad_almacenamiento` da los mismos 36 errores que la base, en Taller y tarjeta; ninguno es de esta entrega.
- Sin desbordamiento horizontal a 390 y a 320 px.
- Pruebas extremas: con el texto al 200 % a 320 px, y con el espaciado de texto de WCAG 1.4.12, las páginas de juegos y rutinas ya desbordaban en la base. En la versión EN de juegos el desbordamiento pasa de 51 a 55 px. Queda pendiente, porque el componente es de A2.
- Controles de 44 px como mínimo, foco visible, `scroll-margin` para que la cabecera fija no tape el destino de los enlaces internos, `forced-colors` y ninguna información solo por color.
- PDF: texto real, etiquetados, `/Lang` es o en, título; marca y atribución verificadas con pdftotext en 96 de 96. El pie tiene contraste 7,6:1. PDF/UA está pendiente de validar con PAC o veraPDF y con lector de pantalla: no se declara conformidad.
- Escritura (ISO 24495-1, COGA): segunda persona, frases cortas, información principal primero, sin lenguaje diagnóstico ni infantil. Varias respuestas válidas en las decisiones.

**ES_EN:** todos los textos nuevos (botones, instrucciones, estados, aria-label, alt, mensajes, descargables, nombres de archivo y rutas) están en ES y EN. La traducción la hizo Claude, sin otro agente. Verificado en capturas ES y EN en escritorio y móvil.

**PRIVACIDAD_LICENCIAS:**
- Sin almacenamiento, sin telemetría y sin red nueva: nada se carga de fuera.
- Mulberry Symbols fijado al commit `9cbab9f400c5de44e2bc58839cca07294aadb086`. El LICENSE del commit dice CC BY-SA 4.0; la discrepancia con el expediente sigue abierta y no se ha borrado ninguna referencia. Sin ARASAAC.
- three.js 0.186.0 con licencia MIT dentro del bundle. Fuentes solo incrustadas en los PDF, sin distribuir archivos de fuente nuevos.

**INTEGRACION:** la hacen María y el agente 2 sobre su HEAD, copiando la carpeta `web/` del zip.

**DESPLIEGUE:** no autorizado y no realizado. No hay push: el repositorio no está autorizado en la sesión de Claude.

**BLOQUEO:** ninguno para integrar. Pendientes de revisión humana:
- las 6 alternativas aproximadas de pictograma;
- «Secarse» (dry) y «Cerrar el agua» (shower), según la auditoría existente;
- PDF/UA;
- prueba en GPU real (ordenador y móvil) de las escenas 3D;
- prueba con personas usuarias.

## Evidencias

Las capturas de escritorio (1280) y móvil (390) en ES y EN de Rincón, Juegos y Rutinas se entregaron a María en la conversación (carpeta `prototipos-r03`). Las listas de comprobación completas están en `editorial/r03/*.json` y `*.csv` de la rama de entrega.
