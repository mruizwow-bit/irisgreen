# Auditoría Astra · Contenido R01 · estado de integración · 29/09/2026

Estado:
`R42_CONTENT_R01_NOT_INTEGRATED_AUDIT_REBASE_REQUIRED`

## 1. Identidad del paquete

ZIP revisado:
`iris-green-contenido-R01-20260924.zip`

SHA-256:
`e44633d2c4707e69276c88728a090212f6d791046cc8dbe38399270f5c29551a`

Coincide exactamente con la fuente R01 auditada en issue #302.

## 2. ¿Está integrado en la web actual?

NO.

Comprobado en:
- `main` actual;
- `agent2/sabik-iris-r08-20260924` actual.

Ambas ramas siguen con el baseline anterior:
- Condiciones: 185;
- Situaciones: 187;
- Vida diaria: 48;
- Datos: 49;
- Investigación: 120.

La entrega R01 esperaba:
- Condiciones: 226;
- Situaciones: 223;
- Vida diaria: 62;
- Datos: 60;
- Investigación: 132.

Rutas representativas nuevas ausentes en main y A2:
- `/es/datos/empleo-y-discapacidad-en-espana/`;
- `/en/data/employment-and-disability-in-spain/`;
- `/es/neurodiversidad/condiciones/migrana/`;
- `/en/neurodiversity/conditions/migraine/`.

PR #310 confirma además expresamente que las altas editoriales de R01 (incluido global-395 / TEPT complejo e Investigación 121–132) NO estaban en su baseline y que #302 se preservaba como autoridad para integración editorial posterior.

Conclusión:
si alguna parte se publicó temporalmente, no permanece en la fuente web actual ni en A2. La entrega no está integrada hoy.

## 3. Integridad del paquete R01

PASS estructural del paquete original:
- 204 HTML nuevos;
- 102 pares ES/EN;
- todos con `lang` correcto;
- todos con un único `h1`;
- todos con hreflang es/en/x-default;
- índices R01 contienen 226 Condiciones, 223 Situaciones y 60 Datos;
- JSON R01 contiene 62 Vida diaria y 132 Investigación;
- DELTA: 204 nuevos + 34 modificados;
- FUENTES.csv: 126 registros / 66 URL distintas.

Aclaración de inventario:
la frase “152 fichas nuevas” no es una descripción exacta del objeto editorial.
La auditoría #302 ya normalizó:
- 118 contenidos nuevos reales;
- 34 registros de datos/directorio/investigación;
- 204 HTML = 102 fichas bilingües.

## 4. El paquete NO se puede copiar ahora encima de A2/main

### 4.1 Shell legado

Los 204 HTML nuevos llevan el shell R01 del 24/09:
- Google Fonts;
- navegación/footer antiguos;
- panel Música antiguo;
- estructura previa a R42/R49/R50.

Auditoría local:
- 204/204 contienen llamadas Google Fonts;
- 204/204 contienen el reproductor/chrome antiguo;
- 204/204 contienen navegación de la plantilla R01.

Issue #302 ya establece:
`R01 HTML = fuente editorial, NO shell de destino`.

No migrar footer/nav/chrome.

### 4.2 Child-safe

R01 precede a la arquitectura child-safe.

No se puede publicar los HTML S2 completos tal cual.

Contrato posterior #302:
- 965 registros clasificados;
- 16 S2;
- full S2 fuera del payload inicial DEFAULT/AGE_0_12/AGE_13_17;
- safe variants;
- full adulto solo tras acción explícita;
- búsqueda separada antes de construir resultados.

El `buscador.json` único de R01 NO es compatible con este contrato.

### 4.3 Taxonomía de edad

#302 todavía usa etiquetas históricas Infancia/Adolescencia/Adultez/Transversal.

Desde 28/09 la taxonomía canónica interna es:
- `AGE_0_12`;
- `AGE_13_17`;
- `AGE_18_PLUS`;
- `ALL_AGES`.

La adaptación de R01 debe migrarse a estos IDs antes de integrar.

### 4.4 Investigación

R01 añade estudios 121–132 al JSON, pero la propia entrega reconoce que la interfaz reconstruida desde el paquete base64 queda en 120.

La arquitectura actual además separa metadata safe y full body/chunks.

No basta copiar `estudios-textos.json`.
Hay que reconstruir Investigación 132 dentro del pipeline actual y aplicar safe variants a los S2.

### 4.5 Guardarraíles de inventario

R01 cambia varias comprobaciones de igualdad exacta a “mínimo”.

La intención —permitir crecimiento— es razonable, pero aplicar esos 18 scripts literalmente hoy puede debilitar guards y además parte de un baseline antiguo.

Debe revisarse uno por uno contra el inventario actual:
- usar manifest/IDs esperados cuando sea posible;
- detectar tanto pérdida como altas inesperadas;
- no copiar automáticamente los scripts R01.

### 4.6 Sitemap, buscador e índices

`sitemap.xml`, `sitemap-1.xml`, índices y `buscador.json` fueron generados contra main `2e17ed3`.

Son obsoletos como artefactos de integración.

Regenerar sobre el HEAD vivo de A2 después de insertar contenido y clasificación actual.

## 5. Trazabilidad y fuentes

`FUENTES.csv` tiene:
- 126 filas;
- 66 URL distintas;
- 6 filas sin fecha de publicación/revisión.

Las fuentes son mayoritariamente oficiales/institucionales y fueron consultadas el 24/09/2026.

Spot-check de auditoría 29/09:
- Directiva (UE) 2024/2841 sigue siendo la norma de Tarjeta Europea de Discapacidad/Estacionamiento y fija hitos de implantación hasta 5/06/2028;
- RD 707/2026 sigue publicado en BOE y entra en vigor 02/01/2027.

Antes de publicación debe hacerse una revalidación dirigida de:
- las 66 URL;
- estado HTTP/cambio de URL;
- fecha/versión;
- afirmaciones jurídicas con fecha futura;
- cifras estadísticas susceptibles de actualización.

No hace falta reescribir desde cero si la fuente sigue vigente.

## 6. Riesgos editoriales detectados

1. R01 contiene contenido médico/salud y jurídico que debe conservar límites y fecha de revisión.
2. La capa child-safe posterior debe aplicarse antes de discovery/publicación.
3. El inglés nuevo R01 sí está escrito ES/EN, pero no debe mezclarse con los grandes bloques EN legacy que la propia memoria identifica como borrador automático.
4. Las 245 referencias EN→ES del footer legado no deben migrarse.
5. Las instrucciones `QUE-SUBIR.md` de “Commit to main” son históricas y quedan superseded por A2 como puerta de integración.

## 7. Dictamen

Contenido editorial R01:
**CONSERVAR Y REBASAR.**

No volver a investigar/recrear las 118 entidades salvo fuente caducada o error factual.

No copiar el paquete literalmente.

Siguiente trabajo necesario:
1. rebase editorial R01 sobre HEAD A2 vigente;
2. migración a shell/tokens R42/R49/R50;
3. taxonomía AGE vigente;
4. clasificación child-safe + safe variants + search indexes separados;
5. Investigación 132 real en pipeline actual;
6. revalidación de fuentes;
7. build/CI;
8. preview integrada;
9. HUMAN QA María.

Marcador esperado:
`R42_CONTENT_R01_REBASED_CHILD_SAFE_READY_FOR_ASTRA`.

No main.
No producción.
