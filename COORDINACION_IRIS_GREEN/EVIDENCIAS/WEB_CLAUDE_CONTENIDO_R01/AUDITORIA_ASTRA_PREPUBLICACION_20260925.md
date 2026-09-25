# Auditoría Astra · WEB_CLAUDE_CONTENIDO_R01 · prepublicación

Fecha: 25/09/2026.  
Archivo auditado: `iris-green-contenido-R01-20260924_1(1)(1).zip`  
SHA-256: `e44633d2c4707e69276c88728a090212f6d791046cc8dbe38399270f5c29551a`.

## Veredicto

**NO_PUBLICAR_TAL_CUAL · CORRECCIONES_P0_P1_PREVIAS**

La estructura técnica de las 204 páginas nuevas es consistente, pero el paquete no cumple todavía su propia declaración de 152 fichas nuevas ni el requisito público ES+EN completo, y contiene errores o afirmaciones que requieren corrección antes de publicación.

## Comprobaciones independientes realizadas

- ZIP: 245 archivos.
- `DELTA.json`: 204 HTML nuevos + 34 archivos modificados.
- Contenido nuevo real: 41 Condiciones + 36 Situaciones + 14 Vida diaria + 11 Datos + 4 Ayudas + 12 Estudios = **118 unidades nuevas**, no 152.
- 204/204 páginas: `lang` correcto, un único H1, sin saltos de encabezado, canonical presente y hreflang ES/EN recíproco.
- `FUENTES.csv`: 126 filas y 66 URL únicas. Todas las URL externas enlazadas desde las páginas HTML nuevas en español están representadas en el CSV.
- No se repitieron las suites Playwright/axe declaradas por el autor; se conservan como evidencia del autor, no como ejecución independiente de Astra.
- `main` sigue en la base declarada `2e17ed3ae02e23a4fd734b00c10f843d14a19d4d`. PR244 ha avanzado por otro carril; los 34 archivos modificados del paquete no colisionan por ruta con los archivos modificados entre esa base y el HEAD A2 observado `d52584344240deb352f712debd19e9e7ae76bdd2`. Aun así, la integración debe hacerse sobre el HEAD vigente del carril A2 y volver a construir.

## Bloqueos de bilingüismo

1. Los 12 estudios e121-e132 tienen `sample_en` todavía en español. Algunos `authors_en` conservan conectores españoles (`y`, `y otros`).
2. Las cuatro ayudas nuevas no contienen `name_en` ni `terr_en`. El propio `apply_language_updates.py` sigue renderizando `name: f.name` y `terr: f.terr`; por tanto, el título y territorio se mantienen en español en la vista inglesa. El guardián solo exige seis campos `*_en`, de modo que puede declarar completa una ficha que no lo está.
3. 101 de las 102 páginas inglesas nuevas muestran en la cita pública algún texto de fuente/fecha en español. Si se conserva un título oficial en su idioma original, marcar su idioma y traducir el texto editorial de fecha/revisión.
4. Las 41 Condiciones inglesas nuevas conservan etiquetas de pie en español. Revisar plantilla/shell antes de publicar.
5. Investigación: el JSON canónico sube de 120 a 132, pero la interfaz empaquetada base64 sigue mostrando 120. No anunciar ni publicar 132 visibles hasta regenerar esa interfaz, o excluir esos 12 de la tanda.

## Bloqueos factuales/jurídicos

- Tarjeta Europea de Estacionamiento: `Gratuita / Free of charge` es incorrecto. La Directiva (UE) 2024/2841 permite expedición/renovación gratuita **o con tasa**, limitada a costes administrativos.
- Plazos de tarjetas UE: sustituir “30/42 meses desde publicación” por fechas normativas exactas: transposición 05/06/2027 y aplicación 05/06/2028. La tarjeta de estacionamiento anterior puede conservar efectos equivalentes, según implementación nacional, hasta 05/12/2029.
- RD 707/2026: la memoria dice que “no regula el facilitador procesal”; es demasiado categórico. El reglamento es mucho más amplio, pero su art. 11.4 contempla expresamente al facilitador procesal.
- La ficha de accesibilidad cognitiva generaliza en exceso la obligación de “lectura fácil o lenguaje sencillo”. El art. 5 establece requisitos generales y precisa que, cuando lectura fácil o lenguaje claro no sean obligatorios, al menos se use lenguaje sencillo. Las obligaciones cambian según ámbito. No afirmar que toda web queda automáticamente afectada sin analizar prestador/servicio/jurisdicción.
- Perros de asistencia: el RD 409/2025 prevé retiro a los 10 años **salvo** informe veterinario anual que acredite condiciones físicas adecuadas. Incorporar la excepción y preferir BOE como fuente primaria de la afirmación legal.

## Trazabilidad médica/científica

Se detectaron afirmaciones interpretativas que no están sustentadas por la única fuente mostrada en su propia ficha. Antes de publicar, añadir fuente específica o retirar/acotar la afirmación. Casos comprobados:
- POTS: atribución frecuente a ansiedad, especialmente en mujeres jóvenes, no está sustentada por la página NHS citada.
- Trastorno límite de la personalidad: la afirmación sobre diagnósticos previos frecuentes en mujeres autistas no está sustentada por la página NHS de BPD; existe literatura específica que debe citarse.
- Trastorno neurológico funcional: asociación con hipermovilidad/rasgos autistas no está sustentada por la ficha NINDS citada; requiere estudio específico y lenguaje prudente.
- Hipermovilidad: asociación con autismo/TDAH no está sustentada por la página NHS general citada.
- Apnea del sueño: la afirmación específica sobre autismo/discapacidad intelectual necesita la guía concreta que se menciona, no solo la página NHS general.
- Trastorno bipolar: la afirmación de diferencial principal con TDAH adulto requiere una fuente clínica específica, no la página NHS general.

Esto demuestra que no basta con que cada página tenga una URL: se necesita correspondencia **afirmación ↔ fuente** para las frases adicionales.

## Scripts y entrega

Cambiar comprobaciones de igualdad exacta a mínimos puede ser razonable para permitir crecimiento, pero debilita el guardarraíl si no se conserva validación de unicidad e identidad. Antes de fusionar:
- comprobar IDs/slugs únicos;
- ausencia de duplicados;
- delta esperado de esta entrega;
- no aceptar crecimiento arbitrario solo porque supera el mínimo.

`QUE-SUBIR.md` instruye “Commit to main”. No debe seguirse literalmente en el estado actual del proyecto: María/A2 mantienen un carril activo. Integrar sobre su HEAD vigente, no copiar encima de una base histórica ni saltarse el carril de integración.

## Elementos favorables

- 204 páginas estructuralmente correctas en la auditoría independiente.
- Parejas ES/EN y hreflang recíprocos completos para las 102 fichas HTML.
- Fuentes externas de las páginas nuevas trazadas en `FUENTES.csv`.
- Datos muestreados de INE, INEGI e IBGE coinciden con las fuentes oficiales consultadas.
- No hay archivos borrados en el delta declarado.
- Los seis fallos de `test_web.py` aportados por el autor se presentan como preexistentes; no se convierten aquí en PASS global.

## Cierre requerido

Publicable cuando se corrijan P0/P1 anteriores, se regenere Investigación o se excluya de la tanda, se ejecute de nuevo el build/QA sobre el HEAD vigente de A2 y se entregue una nueva identidad del paquete. No volver a generar contenido desde cero: corregir esta entrega.
