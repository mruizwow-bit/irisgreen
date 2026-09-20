# SABIK_WEB_CONTENT_EXPANSION_AUDIT_V1_CLOSEOUT

**Agente:** n.º 4 · Actualización de información y recursos  
**Coordinación:** Astra  
**Fecha:** 20/09/2026  
**Estado:** **ENTREGA V1 COMPLETA · READY FOR ASTRA REVIEW**  
**No equivale a aprobación de gate ni a merge.**

---

## 1. OBJETIVO CERRADO EN ESTA ENTREGA

Se completa la **primera entrega exigida por Astra**:

`SABIK_WEB_CONTENT_EXPANSION_AUDIT_V1`

La entrega ya no depende del chat. Está versionada y revisable en GitHub.

---

## 2. REQUISITOS DE ASTRA CUBIERTOS

La entrega contiene los 20 bloques exigidos:

1. inventario de pestañas;
2. subsecciones actuales;
3. contenido existente por área;
4. lagunas;
5. información a actualizar;
6. recursos a verificar;
7. temas nuevos recomendados;
8. nuevas subsecciones;
9. nuevas pestañas justificadas o decisión de no crearlas;
10. prioridades P0–P3;
11. fuentes principales;
12. orden de ampliación;
13. matriz de normativa y estándares;
14. matriz de accesibilidad por pestaña;
15. matriz de vigencia de fuentes;
16. inventario inicial de PDF/descargables;
17. inventario inicial de multimedia y alternativas;
18. IA y transparencia;
19. privacidad/datos;
20. braille/Lectura Fácil.

El mapeo exacto requisito → archivo está en:

`docs/audits/agent4/SABIK_WEB_AUDIT_REQUIREMENTS_CHECKLIST_V1.md`

---

## 3. ARCHIVOS DE ENTREGA

- `docs/audits/SABIK_WEB_CONTENT_EXPANSION_AUDIT_V1.md`
- `docs/audits/agent4/SABIK_WEB_AUDIT_REQUIREMENTS_CHECKLIST_V1.md`
- `docs/audits/agent4/SABIK_WEB_COMPLIANCE_REGISTER_V1.md`
- `docs/audits/agent4/SABIK_WEB_STATIC_ACCESSIBILITY_SCAN_V1.md`
- `docs/audits/agent4/SABIK_WEB_TAB_MATRIX_V1.md`
- `docs/audits/agent4/SABIK_WEB_SUBSECTION_INVENTORY_V1.md`
- `docs/audits/agent4/SABIK_WEB_WORK_QUEUE_V1.md`
- `docs/audits/agent4/SABIK_WEB_EXPANSION_AYUDAS_V1.md`
- `docs/audits/agent4/SABIK_WEB_EXPANSION_DATOS_V1.md`
- `docs/audits/agent4/SABIK_WEB_EXPANSION_VIDA_DIARIA_V1.md`

---

## 4. INVENTARIO PRINCIPAL CONFIRMADO

Navegación principal auditada:

- Inicio
- Condiciones
- Situaciones
- Vida diaria
- Vídeos
- Investigación
- Datos
- Ayudas
- Libros
- Jugar
- Tus intereses
- El taller
- Rincón tranquilo

Páginas transversales auditadas:

- Sobre Iris Green
- Metodología
- Privacidad
- Lectura accesible
- Cuestionarios

---

## 5. RESULTADOS CUANTITATIVOS PRINCIPALES

- Condiciones: **185** entradas enlazadas.
- Situaciones: **187** entradas.
- Vida diaria: **48** fichas.
- Datos: **49** fichas.
- Investigación: **120** publicaciones declaradas.
- Ayudas ES: **258** registros.
- Juegos: **130** objetos en el JSON auditado.
- Vídeos: **48** piezas en el respaldo estático detectado.

---

## 6. TRABAJO PESTAÑA POR PESTAÑA YA INICIADO

### Ayudas

Entregado:
`SABIK_WEB_EXPANSION_AYUDAS_V1.md`

Hallazgos:
- 258/258 registros ES contienen todos los campos actuales;
- 0 IDs duplicados;
- falta modelar vigencia temporal;
- se propone estado normalizado: abierto / cerrado / permanente / próxima convocatoria / histórico / por verificar;
- se verificó el cierre de NEAE 2026-2027;
- se verificaron muestras de PNC 2026 y OEP 2026.

### Datos

Entregado:
`SABIK_WEB_EXPANSION_DATOS_V1.md`

Hallazgos:
- 49/49 páginas existen;
- 49/49 contienen Fuentes, población, año, referencia temporal, método, publicación y revisión prevista;
- la sección no necesita reescritura masiva;
- falta cerrar validación sustantiva fuente por fuente antes de retirar el estado interno de borrador.

### Vida diaria

Entregado:
`SABIK_WEB_EXPANSION_VIDA_DIARIA_V1.md`

Hallazgos:
- 48/48 fichas fuente contienen estado publicada y validación 10/09/2026;
- el índice fuente conserva marcadores BORRADOR;
- el pipeline muestra que esta diferencia es deliberada;
- `publish_biblioteca.py` valida/publica en staging;
- `repair_routes.py` regenera sitemap;
- la salida pública elimina estados editoriales mediante scripts específicos;
- el audit final debe distinguir fuente → staging → dist.

---

## 7. CORRECCIONES DE CONTENIDO REALIZADAS

### Dislexia

Archivo:
`es/neurodiversidad/condiciones/dislexia/index.html`

Se sustituyó:
`Galuschka y cols. ⚠ año`

por:
`Galuschka y cols. (2014)`

La corrección está respaldada por la publicación original de Galuschka et al. de 2014.

### PDA

Archivo:
`es/neurodiversidad/condiciones/evitacion-persistente-de-demandas-perfil-pda/index.html`

Se eliminaron los marcadores:
- `Revisión sistemática 2021 ⚠ nombrar`
- `revisión 2026 ⚠ nombrar`

Se sustituyeron por:
- Kildahl et al. (2021), revisión sistemática;
- Company & Rotella (2026), revisión sistemática.

Además se ajustaron afirmaciones demasiado categóricas para reflejar los límites reales de la evidencia.

---

## 8. NORMATIVA Y ESTÁNDARES

Registrados con estado técnico/jurídico diferenciado:

- WCAG 2.2 AA;
- ISO/IEC 40500:2025;
- EN 301 549 V4.1.1;
- EN 301 549 V3.2.1 como referencia armonizada transitoria;
- ISO 24495-1:2023;
- ISO 9241-171:2025;
- ISO 9241-210:2019;
- ISO 9241-11:2018;
- ISO 9241-112:2025;
- W3C COGA;
- UNE 153101:2018 EX;
- PDF/UA-2 · ISO 14289-2:2024;
- Directiva (UE) 2019/882;
- Ley 11/2023;
- RD 193/2023;
- RD 1112/2018;
- RD 707/2026;
- Reglamento (UE) 2024/1689;
- RGPD;
- LOPDGDD;
- ISO/IEC 42001:2023;
- ISO/IEC 23894:2023;
- ISO/IEC 42005:2025;
- Comisión Braille Española B 3-1.

---

## 9. IDENTIDAD VERBAL

Búsqueda inicial en el repositorio principal:

- `INTELIGENCIA QUE AYUDA`: 0 coincidencias localizadas;
- nuevo claim Sabik: todavía no incorporado en la fuente principal auditada.

La migración de identidad queda registrada como trabajo de implementación posterior, no como “resuelta”.

Texto oficial:

**SABIK**

**CLARIDAD INTELIGENTE.**

**Una IA que adapta la información para que sea más fácil de entender y usar.**

---

## 10. DECISIÓN SOBRE NUEVAS PESTAÑAS

V1 **no recomienda añadir otra pestaña principal**.

Motivo:
la navegación ya es extensa y una nueva pestaña sin prueba de necesidad aumentaría la carga cognitiva.

Sí se propone una página transversal:

**Qué es Sabik · Qué puede hacer · Qué no hace · Cómo utiliza fuentes · Cuándo interviene IA · Cómo pedir ayuda humana**

Debe ser accesible desde la interfaz de Sabik y enlaces contextuales.

---

## 11. ACCESIBILIDAD

Se ha creado una línea base estática y se ha documentado que:

- el HTML fuente no equivale al artefacto publicado;
- el build aplica transformaciones de accesibilidad;
- el pipeline incluye comprobaciones/correcciones para foco, nombres accesibles, contraste, reflow, audio/movimiento, tablas y otros puntos;
- la conformidad WCAG no se declara sin evaluación del artefacto final.

GitHub Actions ha iniciado en la rama comprobaciones específicas de:
- publicación;
- CSP;
- SEO/idiomas;
- carga del directorio;
- privacidad;
- Lighthouse;
- axe-core;
- teclado;
- contraste;
- orientación;
- tablas;
- audio/movimiento;
- objetivos táctiles.

Su resultado pertenece a la revisión técnica del PR y no se inventa ni se anticipa en este cierre.

---

## 12. QUÉ NO ESTÁ “TERMINADO” PORQUE PERTENECE A LA FASE CONTINUA

La orden de Astra establece trabajo continuo después del audit.

Por tanto, **no forman parte del cierre de la primera entrega**:

- verificar 258/258 ayudas una a una;
- validar sustantivamente 49/49 cifras;
- auditar funcionalmente 130 juegos;
- revisar 185 condiciones una a una;
- revisar 187 situaciones una a una;
- inventariar cada vídeo y cada imagen;
- implementar la nueva página de Sabik;
- modificar toda la identidad visual/verbal;
- cerrar el análisis jurídico de cada servicio;
- aprobar un gate.

Esos elementos quedan en `SABIK_WEB_WORK_QUEUE_V1.md` para la fase continua y no se presentan falsamente como completados.

---

## 13. CRITERIO DE CIERRE

La primera entrega V1 se considera **completa para revisión** porque:

- está en GitHub;
- está dividida en evidencias revisables;
- cubre los 20 apartados;
- contiene prioridades P0–P3;
- distingue obligación jurídica y referencia técnica;
- contiene correcciones reales;
- registra lo que sigue pendiente;
- no afirma conformidad o certificación no demostrada;
- no aprueba su propio gate.

**Siguiente actor para este gate: Astra.**


---

## CI_POST_AUDIT_FINDINGS

Hallazgos observados en CI sobre la base revisada por Astra (`5d7d2bdfaf391c5f0bc16ac2798f39d136e16450`).

**Regla de alcance R1:** estos fallos se registran, pero **no se corrigen dentro de PR #179**. No se consideran causados por #179 porque las rutas/activos señalados no forman parte de su diff editorial/documental.

| Check | Run | Resultado | Ruta / activo afectado | Naturaleza del fallo | ¿Forma parte del diff #179? | Propietario recomendado | Prioridad |
|---|---:|---|---|---|---|---|---|
| Auditar WCAG contraste con gradientes | 288 · run id 35522882098 | FAIL | `/es/tramites/directorio/` | **Accesibilidad técnica**. Texto “Directorio de ayudas y trámites” renderizado con color `rgb(31,139,168)` a 12 px; mejor caso sobre blanco 3,95:1 frente a 4,5:1 requerido. | No | Frontend / accesibilidad técnica | **P1 · ALTA** |
| Comprobación previa de publicación | 576 · run id 35522882151 | FAIL | `/es/tarjetas-iris/` | **Frontend / accesibilidad estructural**. Auditoría estructural detecta ausencia de `<main>` y `<h1>`. Este R1 registra únicamente el hallazgo de Tarjetas Iris solicitado por Astra; el workflow contiene otros guardarraíles técnicos fuera de este registro. | No | Frontend / accesibilidad | **P1 · ALTA** |
| Comprobar almacenamiento y privacidad | 382 · run id 35522882027 | FAIL | `assets/ig-idioma.js`, `assets/rutinas-visuales.js`, `assets/tarjeta-iris.js` | **Privacidad / arquitectura**. Auditoría detecta 9 usos de `sessionStorage` no aprobados o no resolubles por la política actual. | No | Arquitectura / privacidad técnica, con frontend | **P1 · ALTA** |
| Comprobar WCAG flujos de teclado | 292 · run id 35522882063 | FAIL | `/es/tarjetas-iris/` | **Frontend / accesibilidad**. Caso “Tarjetas Iris · Copiar texto anuncia estado sin mover foco” falla porque no aparece `#copy-status` dentro del timeout; 5/6 casos del workflow pasan. | No | Frontend / accesibilidad | **P1 · ALTA** |

### Clasificación R1

- contraste Directorio → **accesibilidad técnica**;
- Tarjetas Iris estructura → **frontend / accesibilidad**;
- `sessionStorage` → **privacidad / arquitectura**;
- Tarjetas Iris teclado → **frontend / accesibilidad**.

### Decisión de scope

PR #179 **no modifica** para resolver estos hallazgos:

- contraste del Directorio;
- estructura de Tarjetas Iris;
- almacenamiento `sessionStorage`;
- teclado de Tarjetas Iris;
- runtime;
- build;
- scripts.

Deben abrirse como tareas/PR técnicos independientes.

---

## AJUSTES V1-R1

### PDA

Se eligió la **vía B** ordenada por Astra.

La frase:

`No existe un tratamiento específico validado para PDA.`

se retira porque las revisiones citadas (Kildahl et al., 2021; Company & Rotella, 2026) son revisiones de definición/identificación y no deben usarse como revisiones de eficacia terapéutica.

La ficha queda limitada al alcance real de esas fuentes:

> Las revisiones citadas se centran en cómo se define y se identifica PDA; no evalúan la eficacia de tratamientos específicos. Por eso esta ficha no extrae de ellas recomendaciones terapéuticas propias de PDA.

Se mantienen sin cambios:
- Kildahl et al. (2021);
- Company & Rotella (2026);
- la formulación de incertidumbre diagnóstica aprobada.

### RD 1112/2018

Se corrige el encuadre jurídico:

- la financiación pública **no convierte automáticamente** cualquier web privada en “sector público”;
- la disposición adicional primera establece que **las Administraciones Públicas exigirán** los criterios de los artículos 5 y 6 en los supuestos que enumera;
- para Sabik se mantiene: **APLICABILIDAD CONCRETA → POR DETERMINAR**.

### Checklist

El estado del PR queda actualizado de `PR draft` a:

**PR READY FOR REVIEW**

---

## NO MERGE

**PR #179 queda en revisión. NO MERGE hasta dictamen de Astra.**
