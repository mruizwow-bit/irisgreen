# WEB-CLAUDE · Tus intereses · Eclipses · R01

Fecha: 24/09/2026
Responsable: Claude (Cowork), carril Intereses, por encargo directo de María («sigue construyendo»). Es el cuarto interés del grupo 1, El cielo y el espacio, del plan «Iris Green · Taller e Intereses: investigación, catálogo y plan»: «Eclipses | Cuándo y desde dónde se ven (España: 2026, 2027 y 2028) | Simulador del eclipse desde tu ciudad | Cálculo propio con efemérides».
Carril: Tus intereses ES/EN. No se tocan Taller, Rincón, Juegos, Rutinas, Sabik, Cloud ni la navegación común.

## Lectura previa

Se leyó la rama `coordinacion/iris-green-canonica-20260924` en `eacbd35d`: ESTADO_ACTUAL, CONTROL/ESTADO_TRABAJOS.csv y las memorias A2 R12 a R19 (Exoplanetas integrado, nueva estructura de Intereses por grupos, cabecera interior en dos filas) y la orden TALLER_F1 del otro agente Claude, que se ocupa del Taller.
Por eso la entrega se adapta a la web vigente, que es PR244, y no a `main`.

## Base y HEAD

- Base real: rama `agent2/sabik-iris-r08-20260924` (PR244), HEAD `cd39aa8ca957a4b1448400be98d0911b35851db6` (A2 R19).
  - Esa base ya contiene Exoplanetas (A2 R12). Los archivos de Exoplanetas en PR244 son idénticos byte a byte a los de mi entrega R01, así que no se vuelven a enviar.
- Commit local de la entrega, sin subir: `96fd7768347ecfac603fbec35e9e9385ee97ce95`, tree `55eedb77542f69970fb6ee34b9b0a99d7c193508`.
- ZIP para subir: `IRIS_INTERESES_ECLIPSES_ES_EN_PARA_SUBIR.zip`, 13 archivos, SHA-256 `2603bb4548ce8e68de996f3a60aa517e23eebd317a87a9bb58169e28cf16dbbc`. La lista de archivos y sus SHA-256 está en `EVIDENCIAS/WEB_CLAUDE_ECLIPSES_R01/MANIFEST_SHA256.txt`. Parche equivalente: `ECLIPSES_R01.patch`.
- Archivos nuevos (8):
  - `/es/intereses/eclipses/` y `eclipses.json`, `/en/interests/eclipses/`;
  - `assets/ig-eclipses.js` e `ig-eclipses.css`;
  - `assets/astronomy-engine-2.1.19.min.js` (MIT, autoalojado, sin `eval`);
  - `img/intereses/eclipses/tarjeta.webp`.
- Archivos que ya existían (5), con cambios aditivos sobre PR244:
  - `es/intereses/index.html` y `en/interests/index.html`: tarjeta «Eclipses» en El cielo y el espacio, después de Exoplanetas, y descripción de la página.
  - `es/privacidad/index.html` y `en/privacy/index.html`: una sección nueva sobre las listas locales de Cielo nocturno, Planetas y sistema solar y Eclipses, y sobre «Usar mi ubicación».
  - `scripts/audit_privacidad_almacenamiento.py`: las claves `ig-cielo-mis-listas`, `ig-sistema-solar-coleccion` e `ig-eclipses-coleccion`, con su finalidad y el aviso público.
    - Antes, la auditoría las marcaba como no aprobadas: las dos primeras eran de mis entregas anteriores y no tenían aviso público.
    - Con este cambio desaparecen esas líneas. El resto del informe de la auditoría (claves de otros carriles) no se ha tocado.
  - `assets/ig-cielo.css`: una regla (`.cn-stage-title .crumb a` con `!important`). `iris-brief-r08.css` (R19) pone la miga de pan en `#435268 !important`, y sobre el escenario oscuro no llegaba al contraste mínimo. Afectaba a Cielo nocturno, Planetas y sistema solar, Exoplanetas y Eclipses.

## Qué contiene

- **Simulador** (canvas, calculado en el navegador con astronomy-engine):
  - Se puede usar desde 72 lugares de España, desde cualquier punto de los mapas o con «Usar mi ubicación», que solo pide la posición al pulsarlo y no la guarda.
  - Cielo con horizonte y camino del Sol, oscurecimiento según la luz que queda, brillo en el horizonte durante la totalidad, y planetas y estrellas (HYG) que aparecen cuando oscurece.
  - Recuadro con el Sol y la Luna a su tamaño real, ampliados:
    - con filtro solar durante la fase parcial y la anular;
    - corona y protuberancias en la totalidad;
    - anillo de diamante unos segundos antes y después de la totalidad.
    - Cada estado lleva su aviso de seguridad y la etiqueta «Imagen hecha por ordenador» (AI Act art. 50).
  - Deslizador de hora (teclado: flechas y Av/Re Pág), y botones Inicio, Máximo, Final y «Avanzar el tiempo». Nada se mueve solo.
  - Horas oficiales de cada lugar (península o Canarias) y «Guardar imagen» con la marca IRIS GREEN · irisgreen.eu.
- **Mapas SVG** de los eclipses del 2 de agosto de 2027 (total), el 26 de enero de 2028 (anular) y el 12 de agosto de 2026 (total).
  - Muestran la zona central, las líneas de 70, 80 y 90 % de Sol tapado, las líneas de duración y Canarias en un recuadro.
  - Cada mapa tiene su tabla de 72 lugares: qué se ve, % tapado, horas, duración y altura del Sol.
- **Próximos eclipses desde España**:
  - eclipses de Sol de 2027 a 2040, con Madrid, Barcelona, Sevilla y Las Palmas;
  - eclipses de Luna de 2027 a 2040, con su hora y si se ven desde Madrid.
- **Cómo mirarlo sin peligro**: gafas ISO 12312-2 con marca CE, proyección por un agujero, nada de prismáticos sin filtro, y en un eclipse anular las gafas no se quitan nunca.
- **Cómo funcionan**: eclipse de Sol, total y anular, eclipse de Luna, la Luna roja, por qué no hay uno cada mes y el ciclo de Saros. Hay tres dibujos decorativos que acompañan al texto.
- **Catálogo**: 228 eclipses de Sol y 230 de Luna de 2000 a 2100, con filtros por Sol o Luna, tipo y década, y se puede ordenar.
- **Mi colección**: «Lo he visto» y «Quiero verlo». Se guarda en localStorage (`ig-eclipses-coleccion`), con archivo propio con marca, apertura de un archivo y borrado con confirmación.
- **Fuentes y cómo se calcula**, más `eclipses.json` descargable con marca y licencia.

## Datos y comprobación

- Todo es cálculo propio con astronomy-engine 2.1.19 (Don Cross, MIT):
  - eclipses globales y circunstancias locales de 2024 a 2040 en 72 lugares;
  - rejillas de 0,1° (península y Baleares) y de 0,05° (Canarias) para los mapas.
- Lugares: Natural Earth (dominio público), más coordenadas de centro urbano para las capitales de provincia que faltaban. Contornos: Natural Earth 10m.
- Contraste con el IGN (eclipses.ign.es, 2 de agosto de 2027), en segundos de totalidad (cálculo propio frente al IGN):

  | Lugar | Cálculo propio | IGN | Diferencia |
  |---|---|---|---|
  | Ceuta | 291 | 288 | +3 |
  | Cádiz | 173 | 174 | −1 |
  | Málaga | 111 | 108 | +3 |
  | Melilla | 281 | 274 | +7 |

  - En Madrid, el Sol tapado es del 86 %, frente al 85 % del IGN.
  - No se modela el relieve del borde lunar. La página remite a las horas oficiales del IGN para planificar.
- Los textos se comprobaron con los datos. Se corrigieron dos frases que no se podían sostener:
  - «el primer eclipse total en el sur en más de un siglo» se sustituyó por la duración real;
  - «bajo por el oeste» se sustituyó por «muy bajo hacia el suroeste, poco antes de ponerse», con Barcelona, Girona y Menorca, donde el Sol se pone durante el anillo.
- Los textos se redactaron en español y la traducción al inglés es propia.

## Normativa aplicada (sin afirmar conformidad legal)

- WCAG 2.2 AA / ISO/IEC 40500:2025 como objetivo técnico.
- EN 301 549 V4.1.1 como objetivo técnico; V3.2.1 sigue siendo la referencia jurídica.
- ISO 24495-1, ISO 9241-171/-210/-11/-112 y COGA.
- RGPD/LOPDGDD: la lista es local y borrable, la ubicación solo se usa a petición y no se guarda, y hay aviso en Privacidad ES/EN.
- AI Act art. 50: la etiqueta está en cada imagen del simulador y en la imagen guardada.
- La tarjeta es un render propio del simulador.
- No se usa la etiqueta Lectura Fácil.

## Pruebas (sobre PR244 `cd39aa8c` + esta entrega)

- **Build y datos**:
  - `scripts/build_site.py` correcto.
  - `prepare_initial_data.py --check` correcto, sin cambios.
  - `audit_privacidad_almacenamiento.py` ya no marca ninguna de las claves de Intereses.
- **`test_investigacion_deferred.py`**: falla el caso `failed_json`. Falla igual en `main` `2e17ed3a` limpio, en este mismo entorno, así que no lo causa esta entrega. No se ha tocado.
- **Accesibilidad (axe)**:
  - Eclipses, Cielo nocturno y Planetas y sistema solar, ES y EN, en 1440, 390 y 320 px: 0 incidencias.
  - Tus intereses ES/EN: 0 incidencias.
  - Antes de la corrección de la miga de pan, Exoplanetas ES/EN a 390 y 320 px daba un fallo de contraste. La regla corregida es la misma para las cuatro páginas.
- **Presentación**:
  - Sin desplazamiento horizontal a 320 px.
  - Espaciado de texto 1.4.12 sin recortes.
  - Lectura con texto ampliado, espaciado, controles grandes y más contraste, en 1440 y 320 px.
  - Colores forzados con movimiento reducido.
- **Sin JavaScript**: 3 mapas, 6 tablas y 458 filas del catálogo legibles.
- **Funciones**:
  - Cádiz en el máximo: totalidad de 2 min 52 s.
  - Clic en el mapa: calcula el eclipse en ese punto.
  - Botón «Verlo» desde la tabla (Ceuta).
  - Teclado en el deslizador.
  - «Avanzar el tiempo» y «Parar».
  - «Guardar imagen» descarga el PNG con la marca.
  - Filtros del catálogo: 74 eclipses totales de Sol y 7 en 2020–2029.
  - Mi colección: persiste tras recargar, genera un archivo con marca y se borra.
- **Inglés**: sin texto en español en `/en/interests/eclipses/`, `/en/interests/` y `/en/privacy/`, con y sin JavaScript, salvo nombres de lugares.
- **Capturas**: ES/EN, escritorio y móvil, en `EVIDENCIAS/WEB_CLAUDE_ECLIPSES_R01/capturas/`.

## Estado y límites

- ENTREGADA_CON_CODIGO. Falta que María lo suba sobre PR244 y la revisión en dispositivo real.
- Sin merge, deploy ni publicación por parte de Claude. La sesión no tiene escritura en GitHub.
- Observación, sin tocar porque es de A2 R15: en el índice nuevo de Tus intereses, las tarjetas de «El cielo y el espacio» muestran viñetas de lista a su izquierda.
- Las páginas de Privacidad y la auditoría de almacenamiento no son del carril de Intereses. Se tocan solo para declarar las listas locales de Intereses, como hizo A2 en R12 para Exoplanetas.
- Siguientes intereses del grupo 1 según el plan: Lluvias de estrellas y meteoritos, Exploración espacial, Satélites y Estación Espacial.
