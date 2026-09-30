# MOTOR · A5 · ESTUDIO PROFUNDO R15 · I18N RUNTIME, UNICODE Y BIDIRECCIONALIDAD

Fecha: 30/09/2026
Amplía: R01–R14
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Traducción no equivale a internacionalización

Un runtime internacionalizado debe soportar correctamente:
- lenguaje;
- dirección;
- Unicode;
- ordenación;
- búsqueda;
- segmentación;
- números/fechas;
- shortcuts;
- contenido dinámico.

Iris Green hoy trabaja principalmente ES/EN, pero el runtime no debe codificar supuestos innecesarios que bloqueen idiomas futuros.

## 2 · lang

Fuente:
- MDN · lang global attribute
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang

`lang`:
- usa BCP 47;
- se hereda;
- ayuda a pronunciación de lectores de pantalla;
- afecta reglas lingüísticas.

Regla:
el runtime debe consultar idioma canónico, no inferirlo por texto.

## 3 · Partes en otro idioma

Si una parte está en otro idioma:
`lang` en ese subárbol.

No basta con que el documento sea `es` si:
- cita;
- título;
- control

está en inglés.

Axioma define gate formal; Motor preserva semántica al generar DOM.

## 4 · Dirección RTL

Fuentes W3C Internationalization:
- Structural markup and RTL text
  https://www.w3.org/International/questions/qa-html-dir
- Authoring HTML: handling RTL
  https://www.w3.org/International/docs/bp-html-bidi/

Documento RTL:
`<html dir="rtl">`.

Usar markup `dir`, no CSS como fuente semántica de dirección.

CSS:
preferir propiedades lógicas:
- margin-inline;
- padding-inline;
- inset-inline;
- inline-start/end.

No hardcode left/right si significa “inicio/final” lógico.

## 5 · User-generated / unknown direction

Para texto de dirección desconocida:
- `dir="auto"`;
- `<bdi>` para fragmentos inline.

W3C recomienda esto para contenido insertado dinámicamente.

Aplicación potencial:
- títulos de proyectos;
- búsquedas;
- nombres de recursos.

## 6 · Inputs

W3C recomienda `dir="auto"` en inputs/textarea cuando el usuario puede introducir texto con dirección desconocida.

No significa que toda UI cambie RTL por lo escrito.

Solo el contenido del control.

## 7 · Unicode canonical equivalence

Fuente:
- MDN · String.prototype.normalize()
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize

Visualmente:
`é`

puede ser:
- U+00E9;
- U+0065 + U+0301.

Comparación raw puede fallar.

Patrón:
`text.normalize("NFC")`.

No usar NFKC indiscriminadamente:
compatibility normalization puede cambiar distinciones significativas.

## 8 · Práctica Unicode ejecutada

```text
"café" === "cafe◌́" → false
normalize("NFC") → true
```

PASS.

Lección:
búsqueda/IDs de contenido humano deben definir política de normalization.

## 9 · Case mapping

`toLowerCase()` no siempre respeta reglas de idioma.

Práctica:
```text
"I".toLowerCase()            → "i"
"I".toLocaleLowerCase("tr")  → "ı"
```

PASS: demuestra diferencia locale-aware.

Iris Green ES/EN no necesita reglas turcas hoy, pero el motor no debe asumir que lowercasing universal equivale a búsqueda lingüística.

## 10 · Intl.Collator

Fuentes:
- MDN · Intl.Collator
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator

Widely available.

Sirve para:
- ordenar;
- comparar;
- search semantics.

Práctica ES:
`["ñ","n","o"]`
ordenado con Collator("es") →
`["n","ñ","o"]`.

PASS.

## 11 · Search collation

`Intl.Collator(locale,{usage:"search",sensitivity:"base"})`
puede ayudar con búsquedas tolerantes a case/accent según producto.

Pero:
“accent-insensitive” es decisión UX.

No eliminar distinciones sin validar:
- idioma;
- contenido;
- necesidad.

## 12 · Auditoría launcher Taller

`assets/ig-taller-r42.js`.

Search actual:
- concatena ES + EN;
- `.toLowerCase()`;
- `indexOf()`.

Positivo:
busca títulos/herramientas de ambos idiomas.

Limitación:
- no normalization;
- no locale search;
- substring por code units.

No se declara bug actual.
Para catálogo ES/EN simple puede ser suficiente.

Nueva práctica futura:
probar compuesto/descompuesto y nombres internacionales antes de escalar idiomas.

## 13 · Intl.Segmenter

Fuente:
- MDN · Intl.Segmenter
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter

Baseline 2024 / newly available.

Segmenta:
- grapheme;
- word;
- sentence.

Importante:
`string.length` cuenta UTF-16 code units, no “caracteres humanos”.

## 14 · Práctica grapheme

Texto:
- emoji familiar ZWJ;
- `a` + combining acute.

`Intl.Segmenter("es",{granularity:"grapheme"})`

Resultado:
**2 graphemes**.

PASS.

No cortar:
- texto visible;
- cursor custom;
- límites “N caracteres”

por code unit si el requisito habla de caracteres percibidos.

## 15 · Length limits

HTML maxlength opera en UTF-16 code units según plataforma.

Si producto dice:
“máximo 300 caracteres”
hay que definir si significa:
- code units;
- code points;
- graphemes.

Sabik usa maxlength=300.
No cambiar sin decisión de producto.

Motor debe documentar semántica real.

## 16 · Sorting current projects

`assets/ig-taller-local-data.js` usa:
`title.localeCompare(...)`
sin locale explícito.

Eso usa locale del runtime.

Para UI cuyo idioma ya se conoce:
una evolución profesional puede usar `Intl.Collator(lang)`.

No se declara fallo actual.

## 17 · Dynamic language

### Sabik
`sabik/iris-mount.mjs`:
- observa cambios del atributo `lang`;
- vuelve a traducir controles/panel.

Patrón positivo para una UI persistente.

### R42/R43
helpers leen `documentElement.lang`, pero los labels se crean principalmente en mount y no existe observer general de lang en las capas auditadas.

Si esas páginas cambian idioma mediante navegación completa:
no hay problema.

Si se exige cambio live:
necesitarán un contrato de re-render/traducción.

No afirmar requisito inexistente.

## 18 · RTL and spatial controls

ArrowLeft/ArrowRight pueden significar:

### Physical
mover objeto visual físicamente a izquierda/derecha.

### Logical
anterior/siguiente según dirección de escritura.

No invertir ciegamente todas las flechas en RTL.

Ejemplos:
- cursor de mapa/grid = físico;
- carousel previous/next = puede ser lógico.

Definir semántica por widget.

## 19 · Numeric input

`Intl.NumberFormat` formatea display.

No parsear números localizados con `parseFloat` esperando:
- comma decimals;
- localized digits

sin estrategia.

Inputs HTML type=number tienen su propia semántica de submission.

## 20 · IDs/slugs vs display text

IDs técnicos:
- ASCII/estable si así lo define contrato.

Display:
- Unicode localizado.

No derivar persistent ID de title localizado sin migración.

R40 ya separa:
- project_id;
- title.

Patrón positivo.

## 21 · Unicode security

Normalization no resuelve:
- confusables;
- spoofing;
- bidi controls maliciosos.

Para input no confiable sensible:
seguridad requiere validación/contexto específico.

Motor no inventa una “sanitización Unicode universal”.

## 22 · Search/accessibility

Al ocultar resultados por search:
- mantener estado comprensible;
- anunciar conteo solo si ayuda;
- no anunciar cada tecla agresivamente;
- conservar foco.

La internacionalización y accesibilidad interactúan.

## 23 · Checklist i18n runtime

```text
LANG
BCP47
PART_LANG
DIR
UNKNOWN_DIR
UNICODE_NORMALIZATION
COLLATION
SEGMENTATION
CASE_MAPPING
NUMBER_DATE
RTL_LAYOUT
KEY_SEMANTICS
DYNAMIC_LANGUAGE
PERSISTENT_IDS
AT_PRONUNCIATION
```

## 24 · Estado R15

Práctica:
- NFC canonical equivalence: PASS;
- locale case mapping: PASS;
- ES collation: PASS;
- grapheme segmentation: PASS.

**4/4 PASS.**

Auditoría:
- R42 search: revisada;
- local project sorting: revisado;
- Sabik dynamic language: revisado;
- R43 dynamic language boundary: revisado.

Marcador:
`MOTOR_I18N_UNICODE_BIDI_RUNTIME_STUDIED_R15`

No:
- nuevo idioma;
- cambio de search;
- RTL implementation;
- product change;
- build;
- merge;
- deploy;
- main/production.
