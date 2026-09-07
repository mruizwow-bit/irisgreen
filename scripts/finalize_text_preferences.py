#!/usr/bin/env python3
"""Shorten native-select captions, then update the existing inventory only after
all four reports pass. Does not change content, values, imagery or navigation.
"""
from pathlib import Path
import argparse,hashlib,json,os
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/text-preferences'
parser=argparse.ArgumentParser();parser.add_argument('--document',action='store_true');args=parser.parse_args()
if not args.document:
    replacements=[("widths:['Original','Media · hasta 65 caracteres','Estrecha · hasta 48 caracteres']","widths:['Original','Media','Estrecha']"),("widths:['Original','Medium · up to 65 characters','Narrow · up to 48 characters']","widths:['Original','Medium','Narrow']")]
    for name in ['assets/preferencias-lectura.js','scripts/extend_text_preferences.py']:
        p=ROOT/name;s=p.read_text()
        for old,new in replacements:
            assert old in s or new in s,name
            s=s.replace(old,new)
        p.write_text(s)
    # Check both the native select box and the width of its selected caption.
    p=ROOT/'scripts/test_text_preferences.py';s=p.read_text()
    old="assert a['x']>=b['x'] and a['x']+a['width']<=b['x']+b['width']+1"
    add="""
      if control.evaluate('(e)=>e.tagName')=='SELECT':
       caption=control.evaluate('(e)=>{const s=getComputedStyle(e),c=document.createElement("canvas").getContext("2d");c.font=s.font;return {label:e.selectedOptions[0].textContent,needed:c.measureText(e.selectedOptions[0].textContent).width,available:e.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)-24}}')
       assert caption['needed']<=caption['available'],caption"""
    if add not in s:
        assert s.count(old)==1;s=s.replace(old,old+add)
    p.write_text(s)
    print('Short captions and a check of the selected text are ready.')
    raise SystemExit(0)

reports={n:json.loads((OUT/(n+'.json')).read_text()) for n in ['after','base','regression-preferences','regression-controls']}
assert all(d.get('passed') and not d.get('failures') for d in reports.values())
assert reports['after']['summary']=={'tested':25,'passed':25}
assert reports['base']['summary']=={'tested':10,'passed':10}
assert reports['regression-preferences']['summary']['passed']==45
controls=reports['regression-controls'];assert sum(len(controls[k]) for k in ['catalogues','other_sections','recovery'])==24
run=os.environ.get('GITHUB_RUN_ID','not-recorded');start=os.environ.get('GITHUB_SHA','not-recorded')
section=f'''## Actualización · tipografía y espaciados independientes

Ejecución de cierre: **{run}**, entrada de la rama **{start}**. Resultado: 25/25 casos de opciones nuevas, 10/10 comprobaciones reales de teclado y música, 45/45 regresiones de preferencias y 24/24 regresiones de controles y catálogos. El código resultante y los informes se guardan en `ajustes/auditoria-web`; esta actualización no fusiona la propuesta #2 ni publica la web.

Documento atendido: devolución «Se ha pegado el markdown(20260907-085701).md». Se conserva lo ya consolidado y se añaden controles utilizables, no otra auditoría general. Los apartados históricos siguientes documentan tandas anteriores; sus pruebas no se cuentan como repetidas salvo indicación expresa.

### Qué había, qué se incorpora y dónde

Antes existían la tipografía original, un ajuste combinado de espaciado y la redistribución de columnas; no había selectores personales para estas funciones. Ahora el mismo panel de Lectura incorpora un desplegable **«Tipografía, espaciado y anchura»** con seis controles etiquetados:

- Tipografía original o alternativas de tipo Arial, Verdana y Georgia. Se utilizan exclusivamente fuentes disponibles en el dispositivo y familias de sustitución: no se distribuyen ni se solicitan archivos de tipografía. La opción no garantiza la presencia de una fuente concreta ni un beneficio universal para dislexia.
- Cuatro espaciados independientes: letras, palabras, líneas y párrafos. Cada uno admite «Original». Se comprueba que modificar uno conserva los otros.
- Anchura Original, Media o Estrecha. Las líneas se limitan mediante 65ch/48ch sin reducir el tamaño elegido. `ch` es una unidad tipográfica, no una promesa de que quepan exactamente 65 o 48 caracteres de cualquier letra. Las etiquetas breves se ven completas en el móvil.

Los controles están en `assets/preferencias-lectura.js`, su estilo en `assets/preferencias-lectura.css` y su incorporación al panel existente en `assets/interfaz-comun.js`. `es/lectura-accesible/index.html` explica cómo utilizarlos. No se crea un segundo panel ni otro almacén: `ig-a11y` v2 recibe un objeto `text` opcional y validado.

La presentación inicial conserva el diseño anterior. Los ajustes actúan sobre el contenido principal, no sobre la cabecera o los paneles ni mediante filtros de las ilustraciones. Una muestra en el panel permite comparar letra y espaciado. Las opciones se mantienen al recargar, navegar entre tipos de página, cambiar el idioma activo y sincronizar dos pestañas.

**Restablecer estos ajustes** recupera letra, separaciones y anchura originales sin modificar tamaño, contraste u otras preferencias. **Restablecer**, fuera de ese bloque, sigue reiniciando el conjunto de ajustes propios de la web. El botón antiguo de espaciado rápido continúa disponible: aplicar su combinación sustituye las separaciones personalizadas, pero no cambia la tipografía ni la anchura.

### Qué se ha probado realmente

**25/25 opciones y combinaciones.** Veintiún casos en Home, Condiciones, Autismo ES/EN, Vera, Tus intereses y Vídeos a 1440/390/320 píxeles. Se comprueban independencia, valores calculados, nombre de campos, recarga, retorno exacto a la presentación original y ausencia de desbordamiento, combinando letra alternativa, anchura estrecha, separaciones de 0,12em/0,16em/1,5/2em y tamaño incorporado al 150 %. Se añaden un recorrido mediante selectores nativos y teclado con sincronización entre dos pestañas y tres entradas inválidas. No se afirma haber probado todas las combinaciones matemáticamente posibles.

**6/6 recorridos con Tab.** Se recorren 65 pasos de Tab consecutivos, sin asignar foco mediante código, en Home, Condiciones y Vera a 1440/320 píxeles. Se registran los controles visitados y se comprueba que sean visibles y no queden tapados. Es una muestra de esos recorridos, no una afirmación de haber recorrido cada control de las 895 páginas conectadas.

**4/4 casos con una pista reproduciéndose.** En Home y Condiciones a 1440/320 píxeles se inicia mediante teclado la pista local MP3 «Atmósfera». Se utiliza el `play()` real del navegador; se verifica que el tiempo de reproducción avanza antes y después de recoger el panel con Escape y al continuar con Tab hasta provocar su cierre por superposición. El foco se conserva y Pausa detiene la pista. Se comprueba una pista, no todas; no se mide la audibilidad de un altavoz físico. Se mantiene la posición del reproductor abajo a la derecha.

**Regresiones repetidas:** 45 casos de preferencias y 24 de catálogos, secciones y recuperación tras fallo de red. No se sustituye la batería anterior por las pruebas nuevas. Se comprueba además que `buscador.json`, `videoteca-listado.json`, el catálogo de juegos y `cromos.json` permanecen intactos y que ejecutar la migración dos veces no vuelve a cambiar los archivos.

Las pruebas se realizan con Chromium en GitHub Actions sobre `dist`, con dominios externos bloqueados. Las de música sí usan el archivo local real. Las capturas finales de escritorio y móvil se revisan por separado de las comprobaciones automáticas de geometría; se incluyen en el artefacto de esta tanda.

### Fallos del proceso que se conservan en el registro

La primera ejecución 34104337898 guardó por error el resumen de pruebas encima de la referencia visual inicial. Por eso no llegó a comprobar 21 combinaciones; no se contabilizan como aprobadas. Se separaron ambos archivos y se reconstruyó la comparación a partir de los tres archivos compartidos de la misma rama inmediatamente antes de esta tanda, sin reutilizar contenido de webs antiguas.

Otra prueba esperaba que el panel siguiera abierto después de enfocar el selector externo de idioma, aunque la protección contra superposiciones podía recogerlo. Se adaptó el recorrido para volver a abrirlo y comprobar tanto las preferencias como la explicación en inglés; no se eliminó esa comprobación. En la inspección de móvil se acortaron las etiquetas de anchura, que se cortaban dentro del selector; la prueba final mide también el texto elegido, no solo el tamaño del campo.

### Límites que siguen abiertos

Quedan temas completos y fondo opaco, guía utilizable sin ratón, vista centrada, lectura en voz alta avanzada, alternativas textuales de materiales y revisión audiovisual. El panel sigue llegando al 150 %: no se anuncia aquí una prueba real de zoom de navegador al 200 %/400 %. Tampoco se afirma evaluación con lectores de pantalla, braille, control por voz o teléfonos físicos, ni revisión documental adicional de fuentes clínicas.

Evidencia de esta actualización: `reports/text-preferences/after.json`, `base.json`, `baseline-values.json`, `regression-preferences.json`, `regression-controls.json`, `first-after.json`, `first-base.json` y las capturas del artefacto `texto-personalizable-cierre`. El historial previo se mantiene a continuación.

'''
p=ROOT/'reports/system-accessibility/INVENTARIO.md';s=p.read_text();marker='## Actualización · tipografía y espaciados independientes'
if marker not in s:
    at=s.index('## Versión y resultado');s=s[:at]+section+s[at:]
rows={
'| Espaciado actual |':'| Espaciado actual | Antes había una combinación única; se conserva como ajuste rápido. | Cuatro controles independientes añadidos: letras, palabras, líneas y párrafos; Original por campo y muestra. | 25/25 escenarios nuevos, incluida combinación de 0,12em/0,16em/1,5/2em al 150 %, y regresiones de preferencias/catálogos repetidas. | Más combinaciones y tolerancia a herramientas externas de espaciado; otros motores y zoom real. |',
'| Tipografía alternativa |':'| Tipografía alternativa | El diseño original permanece por defecto. | Selector con Arial, Verdana, Georgia o familias similares disponibles en el dispositivo, sin descargar tipografías. | Alternancia de fuentes, campos etiquetados, teclado, persistencia y retorno al original en la nueva batería. | Disponibilidad de cada fuente en dispositivos físicos, comprensión con usuarios y otras lenguas; no se promete mejora universal por dislexia. |',
'| Anchura de lectura |':'| Anchura de lectura | Se conserva la redistribución anterior y se añade una elección personal. | Original, Media y Estrecha con límites tipográficos de 65ch/48ch. | Combinación con tipografías, cuatro espaciados y 150 % en siete páginas/tres anchuras; recuperación del original. | Más páginas y combinaciones, zoom real y usuarios. |'
}
lines=s.splitlines()
for i,line in enumerate(lines):
    for prefix,new in rows.items():
        if line.startswith(prefix):lines[i]=new
s='\n'.join(lines)+'\n'
old='**Pendiente:** estas pruebas utilizan foco programático para reproducir la geometría; no son un barrido completo con Tab. Faltan pruebas específicas de las ramas de cabecera/guía, zoom 200 %/400 % y navegadores adicionales. Que recoger Música no pausa se determina por el código de `close(false)`; esta tanda no reproduce una pista durante esa operación.'
new='**Actualización posterior:** la tanda de tipografía incorpora seis recorridos reales de 65 pasos con Tab y cuatro pruebas con el MP3 «Atmósfera» reproduciéndose al recoger el panel mediante Escape y por superposición. El tiempo avanza y no se pausa; véase el alcance de esos casos al comienzo del inventario. Siguen pendientes el barrido de todos los controles, las ramas específicas de guía, zoom 200 %/400 %, otras pistas y motores y dispositivos físicos. Los doce casos descritos arriba siguen siendo los casos programáticos de la tanda anterior.'
assert old in s or new in s;s=s.replace(old,new)
p.write_text(s)
summary=f'''# Tanda de texto y lectura · cierre

Ejecución {run} completada con 25/25 comprobaciones de opciones, 10/10 de teclado/música, 45/45 de conservación de preferencias y 24/24 de catálogos. Rama `ajustes/auditoria-web`; no se publica ni fusiona.

Se incorpora al panel existente «Tipografía, espaciado y anchura»: letra original o alternativas de dispositivo Arial/Verdana/Georgia, cuatro espaciados independientes, anchura Original/Media/Estrecha y muestra. No se descargan archivos de fuente ni se presenta una tipografía como tratamiento. Se conservan el diseño predeterminado, los contenidos, las ilustraciones y el único almacén `ig-a11y` v2. Las etiquetas de anchura se han acortado tras comprobar las capturas de móvil.

Las 21 combinaciones de pantalla prueban siete páginas a 1440/390/320 píxeles, con separaciones de 0,12em/0,16em/1,5/2em, anchura estrecha y 150 % incorporado. Otros cuatro casos prueban teclado/recorrido/dos pestañas y valores inválidos. Se verifica independencia, recarga, conservación y restablecimiento exacto de la presentación original; el restablecimiento de este bloque conserva el tamaño y los demás ajustes.

La prueba de base recorre 65 Tab consecutivos en tres páginas a dos tamaños. En otros cuatro casos, Home/Condiciones a 1440/320, el MP3 «Atmósfera» sigue reproduciéndose al recoger el panel con Escape y al avanzar con Tab hasta activar la protección contra superposición. Se mide la reproducción real del archivo por avance del tiempo, no la audibilidad física ni todas las pistas.

Se ha actualizado el MISMO inventario en `reports/system-accessibility/INVENTARIO.md`, con lo incorporado, pruebas y límites. Las cuatro fuentes de catálogos mantienen su integridad. Las primeras pruebas fallidas se conservan y sus errores están explicados; no se declaran aprobadas.

Continúan pendientes temas/opaque, guía sin ratón, voz avanzada, alternativas de contenido, zoom real 200 %/400 %, lectores de pantalla y braille. Pruebas locales en Chromium con dominios externos bloqueados; no certificación WCAG, prueba en teléfonos físicos o revisión de fuentes científicas.
'''
(OUT/'RESUMEN.md').write_text(summary)
(OUT/'delivery.json').write_text(json.dumps({'run':run,'workflow_input':start,'passed':True,'new_cases':25,'keyboard_cases':6,'playing_audio_cases':4,'preference_regressions':45,'catalogue_regressions':24,'updated_inventory':'reports/system-accessibility/INVENTARIO.md','source_hashes':{n:hashlib.sha256((ROOT/n).read_bytes()).hexdigest() for n in ['assets/preferencias-lectura.js','assets/preferencias-lectura.css','assets/interfaz-comun.js']},'published':False},ensure_ascii=False,indent=2)+'\n')
print('The same inventory has been updated after all reports passed.')
