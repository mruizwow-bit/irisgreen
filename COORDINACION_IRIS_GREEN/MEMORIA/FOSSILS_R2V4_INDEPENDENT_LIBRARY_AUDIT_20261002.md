# ASTRA · AUDITORÍA INDEPENDIENTE DE FÓSILES R2v4 DESDE LIBRARY · 02/10/2026

## Veredicto

`FOSSILS_ART_PRODUCT_KEEP__R2V4_PACKAGE_REWORK_QA_INTEGRATION_REQUIRED`

Decisión:
- **NO reconstruir Fósiles desde cero**.
- **KEEP** de dirección visual, producto, mecánica, arte first-party y datos estructurados.
- El paquete R2v4 actualmente accesible en Library **NO es final/publicable tal cual**.
- Requiere correcciones acotadas de QA nominal + adaptación a contratos globales vivos + integración R48.

## Bytes auditados

- `FOSILES_PILOTO_R2v4_PARA_SUBIR_3.zip`
  - SHA-256 `e321b32d4d2a9d16c4df6a99da7e956543ceba5b0666919e6b8e48adac7a4ff1`
  - 2,132,654 B
- `FOSILES_R2v4_CAPTURAS_3.zip`
  - SHA-256 `38e274848e0e8b3d75b5a2083b9ff1bdb90237071df9194fbe7dfbb45ea71688`
  - 19,381,902 B
- `FOSILES_R2v4_GOBERNANZA_3.md`
  - SHA-256 `a2d135f02dc2cc278899a65b1c16f319e94316babb3ccdb5d245c350d0fe403c`
- `FOSILES_R2v4_INFORME_3.md`
  - SHA-256 `66b7515e75246c7a6150a6500a9f0610ceeefa3427a951ca4c2ca790311c673a`

MANIFEST del paquete:
`26c2c621bf7be16135ca692a8c90eef9b05554ac3bbf1e5910ad5df744addfdc`

Verificación actual:
- MANIFEST: **78/78 OK**.
- Capturas: **20/20 hashes OK**.

---

# 1 · PRODUCTO / VISUAL

## KEEP

Las capturas reales demuestran:
- escritorio 1440 ES/EN;
- móvil 390 ES/EN;
- LIGHT/NAVY;
- estado cubierto y descubierto;
- composición responsive propia, no desktop encogido;
- superficie geológica coherente;
- piezas fósiles visualmente diferenciadas;
- interacción entendible;
- jerarquía visual sólida;
- bajo ruido visual;
- copy de procedencia visible junto a la escena;
- controles grandes y claros.

El producto se lee como una experiencia de excavación/estratos, no como dashboard.

No hay motivo de producto/arte para un rebuild total.

## KEEP de piezas por especie

El paquete contiene 14 piezas diferenciadas por especie.
No volver a iconos genéricos.
No regenerar arte salvo defecto factual concreto demostrado.

---

# 2 · INTEGRIDAD TÉCNICA

## PASS

- `MANIFEST.sha256`: 78/78 OK.
- no `localStorage`;
- no `sessionStorage` dentro del paquete;
- no IndexedDB/cookies;
- no red externa;
- no eval/new Function;
- canvas con role/aria-label/tabindex;
- pointer/touch;
- teclado:
  - ArrowDown / ArrowUp = cambiar estrato;
  - Space / Enter = cepillado por pasos;
- botones >=44 px declarados;
- no autoplay / no animation loop;
- idioma ES/EN reconstruye contenido;
- 7 estratos + 14 fósiles;
- AVIF con fallback WebP;
- transferencia QA declarada:
  - 1440 ~214.7 KiB en escenario medido;
  - 390 ~179.7 KiB.

## Políticas

Reejecutadas en entorno actual:
- 19 políticas automáticas: PASS;
- prueba negativa de políticas: PASS en todos los sabotajes.

---

# 3 · BLOQUEADOR REAL · QA NOMINAL NO CERRADO EN ESTE R2v4

Captura:
`18-hallazgo-trex-diente.png`

El archivo está íntegro y su hash pertenece al manifest de capturas, PERO la ficha visible muestra:

`Iguanodon`

no:

`Tyrannosaurus rex`.

La imagen contiene varias piezas de la capa Cretácico, incluyendo un diente, pero el estado semántico visible/ficha activa es Iguanodon.

Causa localizada en:
`qa/shots.py`

El bucle declara:
`for capa, idx, quien in [...]`

pero **`idx` no se consume para seleccionar/assertar el fósil nominal**.

Por tanto:
- nombre de archivo != evidencia nominal;
- el claim previo de QA nominal no queda demostrado por este paquete;
- este R2v4 no contiene la corrección posterior descrita en coordinación.

Estado:
`FOSSILS_R2V4_NOMINAL_QA_FAIL_TREX_CAPTURE_SHOWS_IGUANODON`

Corrección mínima:
1. arnés con selección explícita de ID nominal;
2. assert del ID/nombre activo;
3. FAIL si no coincide;
4. regenerar 4 capturas nominales;
5. prueba negativa del arnés.

No tocar producto/arte para esto.

---

# 4 · REPRODUCIBILIDAD · PASS SOLO EN ENTORNO DECLARADO, NO PORTABLE TAL CUAL

El paquete trae evidencia original:
- Python 3.11.15;
- numpy 2.4.4;
- scipy 1.17.1;
- Pillow 12.2.0;
- 59/59 arte byte-identical.

Al ejecutar `fuente/reproducir.py` en el entorno actual:
- Python 3.13.5;
- numpy 2.3.5;
- scipy 1.17.0;
- Pillow 12.3.0;

resultado:
- 29/59 byte-identical;
- 30 distintos;
- la divergencia afecta fundamentalmente AVIF + `estratos.json`;
- WebP permanece estable en la parte observada.

Esto NO contradice el contrato del paquete, porque el propio paquete limita la promesa al entorno declarado.

Pero para continuidad a largo plazo:
`REPRO_ENVIRONMENT_PINNING_REQUIRED`

Recomendado:
- lock de versiones exactas / requirements reproducible;
- o runner documentado con Python 3.11.15 + versiones declaradas;
- no usar el entorno actual para regenerar y sustituir assets.

No rerenderizar arte.

---

# 5 · CONTRATO DE EDAD · STALE RESPECTO A MAIN

El paquete standalone incluye selector local:
- `ALL_AGES`;
- `AGE_0_12`;
- `AGE_13_17`;
- `AGE_18_PLUS`.

El main vivo usa perfil de usuario:
- `GENERAL`;
- `AGE_0_12`;
- `AGE_13_17`;
- `AGE_18_PLUS`;

y `ALL_AGES` queda como metadata de elegibilidad.

Por tanto:
`FOSSILS_LOCAL_AGE_PICKER_STALE`

Integración requerida:
- no mantener selector local competidor;
- consumir `IGAudience` / perfil global;
- `ALL_AGES` solo metadata;
- transición reversible/idempotente según contrato vivo.

No es motivo para reconstruir Fósiles.

---

# 6 · MOTION / SHELL / THEME

El paquete:
- no tiene movimiento continuo;
- consulta `prefers-reduced-motion`;
- no tiene autoplay;
- usa `data-ig-theme`.

Al integrarlo:
- consumir tokens globales actuales, no una copia histórica como autoridad;
- heredar shell/nav/idioma global;
- no duplicar selector de tema;
- revisar compatibilidad con `NORMAL / REDUCED / NONE` aunque la experiencia sea esencialmente estática.

---

# 7 · HUMAN GATES QUE EL PROPIO PAQUETE DEJA PENDIENTES

No declarar desde este audit:
- factual/editorial completo;
- uso real lector de pantalla;
- autorización publicación.

Pendientes:
- EDI-01 hechos/fuentes;
- EDI-02 tono/child-safe;
- A11Y-04 uso real lector de pantalla + teclado;
- PUB-01 publicación.

El análisis visual Astra considera:
`PRODUCT_VISUAL_KEEP`

La validación factual exhaustiva exige revisión editorial/fuentes separada.

---

# 8 · INTEGRACIÓN R48

Sigue pendiente:
- tema 09 existente;
- renderer `TIMELINE → EXCAVACION`;
- diff renderer 72/72 exactamente 1;
- nuevo `assets/ig-r48-m-excavacion.js`;
- `R.motor('EXCAVACION', ...)`;
- ES/EN;
- arte lazy/on-demand;
- no cargar 59 assets de entrada;
- fallback sin JS;
- browser QA;
- perfil global;
- tokens globales;
- HUMAN QA.

---

# DECISIÓN FINAL ASTRA

Fósiles es la **excepción al rebuild global**.

Clasificación:
`KEEP_ART`
`KEEP_PRODUCT_DIRECTION`
`KEEP_INTERACTION_MODEL`
`KEEP_DATA_STRUCTURE`
`REWORK_NOMINAL_QA`
`ADAPT_GLOBAL_AGE_THEME_SHELL`
`PIN_REPRO_ENVIRONMENT`
`INTEGRATE_R48`

No regenerar los 59 assets.
No rehacer las 14 piezas.
No rediseñar la experiencia.

Nuevo gate recomendado:
`R59_FOSSILS_R2V4_KEEP_REPAIR_QA_INTEGRATION_READY_FOR_HUMAN_REVIEW`
