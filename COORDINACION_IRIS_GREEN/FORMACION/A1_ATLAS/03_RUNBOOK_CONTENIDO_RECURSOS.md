# ATLAS · RUNBOOK DE CONTENIDO, ASSETS Y PUBLICACIÓN

Fecha: 30/09/2026  
Issue: #351

## 0 · Resume gate

Antes de tocar un recurso:

1. leer orden vigente;
2. confirmar owner;
3. confirmar rama/base/HEAD cuando exista código;
4. leer fuente canónica;
5. comprobar versión;
6. leer último gate;
7. comprobar si existe entrega más nueva;
8. identificar dependencias Nube/Vector/Axioma/Lex/Croma/Senda/Motor/Prisma.

Nunca construir sobre “lo que recuerdo”.

---

## 1 · Clasificar el objeto

Preguntar:

- ¿es contenido?
- ¿asset?
- ¿resource bundle?
- ¿dataset?
- ¿downloadable?
- ¿publication?
- ¿derivado?
- ¿manifest?

No mezclar fuente y output en el mismo concepto.

---

## 2 · Identidad

Asignar/conservar:
- stable ID;
- type;
- version;
- status;
- owner;
- last reviewed;
- source lineage.

No usar nombre de archivo como único identificador.

---

## 3 · Contenido fuente

Separar:
- contenido;
- metadata;
- presentación;
- assets;
- relaciones.

No incrustar información crítica solo en CSS, imagen o PDF si el sistema necesita reutilizarla.

---

## 4 · Locales

Para ES/EN:
- language tag;
- source locale;
- translation status;
- fallback;
- fields intentionally untranslated;
- consistency check.

Nunca:
“como la estructura es igual, EN estará bien”.

---

## 5 · Assets

Por asset relevante:
- asset_id;
- media type;
- source/origin;
- creator/provider;
- license/right status;
- attribution;
- checksum cuando aplique;
- derivatives;
- accessibility description/context notes;
- relation to resources.

Si la licencia no está clara:
**no inventar** → Lex.

---

## 6 · Accesibilidad

Para cada salida:
- estructura semántica;
- idioma;
- orden;
- texto real;
- imágenes según función;
- equivalentes de media;
- metadata de accesibilidad cuando el formato la soporte.

Atlas produce evidencia.
Axioma determina criterio de estándar/conformidad.

---

## 7 · Relaciones y discovery

Definir relaciones con tipo:
- related;
- prerequisite;
- parent/child;
- safe-related;
- explicit-sensitive-link;
- blocked/incidental cuando proceda.

Aplicar audience/sensitivity antes del render o recomendación pública.

---

## 8 · Outputs

Cada output debe declarar:
- source version;
- locale;
- format;
- generation/export method;
- date/version;
- output path/id;
- hash cuando aporte;
- known limitations.

No regenerar “a mano” una salida y olvidarse del source.

---

## 9 · Verificación

Antes de handoff:

### Estructura
- schema PASS;
- IDs únicos;
- refs resueltas.

### Idiomas
- ES presente;
- EN presente si scope bilingüe;
- no drift conocido.

### Assets
- 0 missing;
- 0 orphan críticos;
- rights/attribution completos según alcance.

### Accesibilidad
- metadata/alternativas necesarias presentes;
- pendientes manuales declarados.

### Outputs
- inventario exacto;
- hashes si aplican;
- no stale outputs.

### Safety
- relaciones respetan audience/sensitivity.

---

## 10 · Handoff

Formato mínimo:

`OWNER / ORDER / BASE / SOURCE_VERSION / SCHEMA / MANIFEST / OUTPUTS / HASHES / LOCALES / RIGHTS / ACCESSIBILITY / SAFE_LINKING / TESTS / PENDING / DESTINATION`

Destino típico:
- Vector para integración;
- Astra para gate de producto;
- Axioma para estándar/conformidad;
- Lex para licencia/jurídico;
- Nube para corpus/fuentes/RAG;
- Croma para dirección visual;
- Motor para runtime;
- Senda para experiencia editorial.

---

## 11 · Incidentes

### Source drift
Dos fuentes aparentan ser “la final”.

Acción:
STOP → precedencia → owner → version → supersedencia explícita.

### Locale drift
ES y EN difieren sustantivamente.

Acción:
identificar source locale → diff semántico → corregir → regenerar outputs.

### Rights drift
Derivado perdió licencia/atribución.

Acción:
bloquear publicación → reconstruir lineage → Lex si hay duda.

### Stale output
Fuente cambió pero PDF/PNG no.

Acción:
invalidar derivado → regenerar → actualizar manifest/hash.

### Hash mismatch
No asumir corrupción automáticamente.

Acción:
comparar expected source/export/version → determinar si cambio era legítimo.

### Unsafe linking
Recurso seguro recomienda contenido no apropiado incidentalmente.

Acción:
bloquear relación → revisar metadata/policy → test de regresión.

---

## 12 · Qué no hacer

- copiar y pegar ES/EN como sistema;
- usar nombre de archivo como identidad;
- tratar watermark como licencia;
- convertir metadata en campos decorativos sin gobernanza;
- declarar PASS de accesibilidad por tener alt text;
- romper provenance al optimizar imágenes;
- publicar output sin saber de qué source version salió;
- modificar producto fuera de orden;
- asumir que “está en GitHub” sin comprobar commit/branch.

---

## 13 · Cierre de sesión

Antes de cerrar chat:

1. registrar aprendizaje material;
2. actualizar control;
3. registrar issue/commit;
4. dejar HEAD/branch;
5. dejar pendiente principal;
6. indicar primeros 15 minutos al sucesor.

GitHub es canónico.
Slack es coordinación rápida.
