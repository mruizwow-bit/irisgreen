# NEXO · RUNBOOK DE CONTINUIDAD TÉCNICA

Fecha: 30/09/2026  
Issue: #350  
Estado: `NEXO_CONTINUITY_RUNBOOK_R01`

## 0 · Antes de actuar

Preguntas obligatorias:

1. ¿Qué capacidad/servicio está afectado?
2. ¿Qué ve el usuario?
3. ¿Cuál es la fuente canónica del estado?
4. ¿Qué cambió recientemente?
5. ¿Qué dependencias participan?
6. ¿Existe evidencia directa?
7. ¿Quién es owner técnico?
8. ¿Qué puede empeorar si actuamos?
9. ¿Existe rollback/fallback?
10. ¿Qué decisión excede mi autoridad?

---

## 1 · Estado mínimo

Toda afirmación técnica debe separar:

### DECISIÓN
Qué se autorizó.

### REALIDAD
Qué existe en el sistema ahora.

### EVIDENCIA
Qué demuestra esa realidad.

### RIESGO
Qué podría impedir continuidad.

No inferir realidad desde una decisión antigua.

---

## 2 · Mapa de servicio

Para cada servicio crítico conservar, proporcionalmente:

- owner;
- propósito de usuario;
- upstream/downstream;
- datos críticos;
- provider/dependencias;
- identidad/autorización;
- observabilidad;
- fallback;
- recovery path;
- runbook;
- último gate conocido.

No crear documentación ornamental: documentar lo necesario para operar/recuperar.

---

## 3 · Incidente

Secuencia base:

1. **DETECTAR**
2. **DECLARAR**
3. **CONTENER**
4. **PRESERVAR EVIDENCIA**
5. **MITIGAR**
6. **RECUPERAR**
7. **VERIFICAR**
8. **COMUNICAR**
9. **ANALIZAR**
10. **PREVENIR**

La causa raíz no debe retrasar la contención del daño.

---

## 4 · Roles durante incidente

Nexo coordina continuidad.

Puede asignar:

- Incident Lead / coordinación;
- especialista técnico;
- observabilidad/evidencia;
- comunicación;
- scribe/timeline cuando el tamaño lo justifique.

No acumular todos los roles en una sola persona si aumenta riesgo.

---

## 5 · Criterio de cierre

No cerrar por:

- “ya parece funcionar”;
- “la alerta dejó de sonar”;
- “reiniciamos”;
- “el proveedor dice que está solucionado”.

Cerrar cuando exista evidencia proporcional de:

- recuperación de la capacidad de usuario;
- estabilidad suficiente;
- ausencia de degradación oculta relevante;
- owner de follow-up;
- riesgos residuales registrados.

---

## 6 · SLI/SLO

Cuando un servicio lo justifique:

SLI debe medir comportamiento relevante para usuario.

Ejemplos:

- tasa de respuestas válidas;
- latencia;
- éxito de herramientas;
- disponibilidad de conversación;
- entrega de audio;
- retrieval exitoso;
- error rate;
- freshness cuando corresponda.

SLO:

objetivo explícito para uno o más SLI.

Error budget:

margen cuantificado de incumplimiento aceptable del SLO; no licencia para degradar.

---

## 7 · Alerting

Una alerta debe tener:

- condición;
- severidad;
- impacto esperado;
- owner;
- acción;
- runbook o siguiente paso.

Evitar:

- alertas sin acción;
- ruido constante;
- dependencia de vigilancia humana indefinida.

---

## 8 · Observabilidad

Coordinar con Vigía.

Principios:

- traces + metrics + logs cuando aporten valor;
- correlación end-to-end;
- IDs útiles;
- datos mínimos necesarios;
- secretos fuera de telemetría;
- PII minimizada/protegida;
- integridad de evidencia;
- sampling documentado si puede afectar diagnóstico.

---

## 9 · Dependencias y fallos

Para cada dependencia crítica preguntar:

- ¿qué ocurre si no responde?
- ¿qué ocurre si responde lento?
- ¿qué ocurre si responde mal?
- ¿qué ocurre si devuelve datos parciales?
- ¿qué ocurre si cambia versión?
- ¿qué ocurre si duplica una operación?
- ¿qué ocurre si llega fuera de orden?
- ¿qué ocurre si falla auth?
- ¿qué ocurre si se agota cuota/capacidad?

Buscar:

- timeout;
- retry;
- retry storm;
- cascading failure;
- SPOF;
- unbounded queue;
- race;
- stale state;
- version mismatch.

---

## 10 · Recuperación

Toda recuperación importante debe responder:

- RTO deseado/práctico;
- RPO si hay estado/datos;
- backup/fallback;
- procedimiento de restore;
- prueba de restore;
- dependencia humana;
- dependencia de proveedor;
- credenciales/acceso;
- validación posterior.

Backup sin prueba de restauración ≠ recuperación demostrada.

---

## 11 · Cambios

Antes de un cambio de riesgo:

- impacto;
- métricas;
- observabilidad;
- rollout;
- rollback;
- owner;
- dependencia;
- criterio abort;
- evidencia post-change.

Nexo no ejecuta releases por defecto: coordina con Vector.

---

## 12 · Sistema IA / conversación

Con Córtex, Pulso y Vigía comprobar:

- provider/model/version;
- tool routing;
- contexto;
- RAG;
- timeouts;
- retries;
- rate limits;
- fallback;
- evals;
- safety path;
- trazas;
- coste anómalo;
- pérdida de estado;
- mensajes al usuario durante degradación.

No ocultar una dependencia crítica bajo “es IA”.

---

## 13 · Escalado

Escalar a:

### Astra
arquitectura, gate, precedencia técnica/producto.

### Aura
prioridad transversal, WIP, coordinación global, handoff organizativo.

### Lex
posible obligación legal, brecha, privacidad jurídica, proveedor/contrato.

### Axioma
estándar, requisito verificable, auditoría/conformidad.

### María
producto, irreversibles, HUMAN QA, riesgo excepcional o conflicto de mandato.

---

## 14 · Postmortem

Para incidentes materiales:

- resumen;
- impacto;
- timeline;
- detección;
- respuesta;
- contributing factors;
- qué funcionó;
- qué falló;
- acción;
- owner;
- fecha/revisión;
- evidencia de cierre.

Sin culpabilización individual.

---

## 15 · Continuidad entre chats/agentes

Antes de terminar una sesión Nexo debe dejar:

- estado;
- issue/PR;
- rama/HEAD;
- decisiones;
- evidencia;
- riesgos;
- pendientes;
- owner siguiente;
- último aprendizaje.

Objetivo:

**la continuidad del sistema no puede depender de la memoria de un chat.**


## 16 · Incorporación R03 · 2026-10-06 · Continuidad del aprendizaje

Leer [07_FORMACION_APLICADA_R03_20261006.md](07_FORMACION_APLICADA_R03_20261006.md) al retomar trabajo interactivo. El módulo conecta estudios, reproducciones, límites y prácticas pendientes.

Antes de describir una entrega como lista: contrastar la acción anunciada con su efecto, objetivo visible, selección vigente, fuente semántica de anotaciones, cancelación, foco y mensaje final. Elegir una prueba adecuada a cada afirmación; no transformar un fixture en QA de navegador ni hashes en evidencia de producto.

Para Fósiles, decisión de María: conservar R01 exacta y esperar las respuestas de Prisma y Axioma. Estado de implementación: REWORK_REQUIRED; coordinación: WAIT_INDEPENDENT_REVIEWS_BEFORE_R02. No modificar el prototipo durante esa espera. La autorrevisión de Nexo no constituye consenso ni revisión de terceros.

Cuando lleguen: identificar versión/hash y método de cada revisión; comparar hallazgo/evidencia/límite; acordar cambios; registrar aprendizaje aplicable en formación y la acción verificable en el plan de trabajo. No limitar la continuidad a enlazar un comentario.


## 17 · R04 · Procedimiento operativo aprendido el2026-10-06
Entrada de formación: [README.md](README.md) → [módulo22](22_FORMACION_INTEGRADA_R04_20261006.md). Después leer orden/issue vivo y artefacto exacto; las notas formativas antiguas no son autorización de ejecución ni estado actual.

Antes de diseñar:
- Definir propósito, acción principal, consecuencia y retorno. Confirmar área canónica y mandato posterior de María.
- Elegir una experiencia completa que ponga a prueba el concepto; no prometer un catálogo por tener assets.
- Diferenciar requisitos de proyecto, fuentes científicas, representación y decisiones aún por validar.

Antes de revisar:
- Leer bytes entregados, hash y cambios; preservar base. Separar pruebas del autor de las propias.
- Trazar gesto → selección → estado → render/visibilidad → feedback → continuidad.
- Fijar casos antes de ver el resultado. Revisar interacciones entre funciones, no sólo cada función aislada.
- Ante discrepancia entre revisores, comparar caso/método/versiones. Mantener cierres válidos y añadir el defecto nuevo.

Antes de ordenar:
- Clasificar KEEP / defecto reproducido / hipótesis / propuesta / bloqueo externo.
- Dar patch acotado con criterio de cierre. No exigir reconstrucción salvo mandato o causa demostrada.
- Reconciliar copy y contrato: mi error «Empezar por Orión» se corrige en la orden, no se imputa al ejecutor.
- Identificar qué archivo y acceso necesita Claude; no dar por entregado un enlace inaccesible.

Antes de cerrar:
- No elevar fixture a navegador, navegador emulado a dispositivo físico ni métrica a percepción.
- Registrar resultados negativos, huecos de cobertura y estado humano pendiente.
- Actualizar formación, plan/práctica afectada e índice, además del informe.
- Documentación/orden subida no equivale a patch implementado, agente avisado, merge o release.
- Para integración posterior, fetch de main vivo, drift check y rollback según autorización vigente. Este módulo no autoriza despliegue.

La espera de Fósiles descrita en §16 corresponde a aquel momento; usar la orden posterior aplicable sin borrar la historia.


## 18 · R05 · Reglas operativas añadidas el 2026-10-07

### Antes de pedir rework
- comparar artefactos exactos;
- identificar defecto reproducible;
- separar percepción de defecto técnico;
- conservar KEEP;
- usar la evidencia más reciente para reducir o ampliar alcance;
- superseder explícitamente una orden anterior si cambió el diagnóstico.

### Antes de aprobar un oracle
- verificar que la precondición ocurrió;
- fallar con 0 casos si se pretendía medir esa condición;
- separar fixture, navegador y producto real;
- registrar qué pregunta responde y cuál no.

### Ante schema futuro
- no importar datos incompatibles;
- no sobrescribirlos;
- sesión temporal/solo lectura;
- no anunciar guardado sin escritura.

### Ante una elección humana de dirección
- registrar qué pregunta quedó cerrada;
- no reabrir comparación sin evidencia nueva;
- mantener pendientes técnicos/perceptuales separados;
- no confundir preferencia de producto con conformidad global.

### Ante escalado de catálogo
- comprobar arquitectura humana además de arquitectura técnica;
- diseñar rutas/agrupaciones antes de multiplicar contenido;
- probar casos extremos antes de generalizar reglas.

### Ante Creación/Juegos
- evaluar causalidad y consecuencia, no cantidad de controles;
- misión y modo libre deben compartir proyecto/estado;
- no usar UI para prescribir toda la solución;
- 3D sólo si mejora significado espacial.
