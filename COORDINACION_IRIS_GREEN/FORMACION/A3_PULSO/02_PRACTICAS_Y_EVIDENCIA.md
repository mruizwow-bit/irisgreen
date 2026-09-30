# PULSO · A3 · PRÁCTICAS Y EVIDENCIA

Fecha: 30/09/2026  
Versión: Foundation R01  
Issue general: #348

## Propósito

Separar con claridad:
- lo estudiado;
- lo inspeccionado en código real;
- lo razonado;
- lo no ejecutado;
- lo que todavía requiere prueba futura.

La formación no convierte una lectura en evidencia de producción.

## 1 · Práctica: reconstrucción del runtime actual

Repositorio:
**mruizwow-bit/nea-web-irisgreen**

Snapshot:
**35387c6926ac50882d1137a2f936ffd108f6073c**

Archivos leídos:
- nea-core/session.js
- nea-core/state.js
- nea-core/sabik-state.js
- nea-core/intent.js
- nea-core/response.js
- nea-v1.html
- test-nea-core-v1.js
- test-nea-v1-ui-interaction.js
- INFORME_PROYECTO_NEA_WEB_IRISGREEN.md

### Evidencia observada

En session.js:
- createSessionState crea estado explícito;
- current_need;
- user_statements;
- negaciones;
- correcciones;
- conceptos activos y vetados;
- fragmentos/repuestas rechazados;
- preferencias de sesión;
- cognitive_state;
- sabik_state;
- privacy_state = session_only.

En sabik-state.js:
- estado cognitivo influye en intensidad;
- riesgo modifica estado funcional, interacción, protección y presencia visual;
- baja demanda reduce movimiento y presencia.

En response.js:
- clasificación de intención;
- detección de conceptos/relaciones;
- tratamiento de negaciones;
- detección de riesgo antes del retrieval normal;
- plan de respuesta estructurado;
- evidence, source_urls y match evidence;
- insuficiencia explícita;
- acciones prácticas;
- render de texto controlado.

En nea-v1.html:
- formulario conversacional;
- control “Parar”;
- control “Bajar intensidad”;
- “No guardar nada”;
- “Más corto”;
- “No es esto”;
- “Buscar por otra vía”;
- role=status;
- aria-live=polite;
- aria-atomic=true;
- estado visual de riesgo/minimal/base.

En las pruebas:
- una sesión nueva no conserva preferencias anteriores;
- Core no contiene proveedores externos;
- Core no usa localStorage/sessionStorage/indexedDB;
- rechazo de una respuesta registra fragmentos y evita repetirlos;
- riesgo explícito separa flujo;
- riesgo ambiguo pide aclaración;
- negaciones evitan inferencias incorrectas;
- bajar intensidad desde botón no inventa una declaración del usuario;
- interfaz mantiene estado visual de riesgo tras carga.

## 2 · Práctica: dibujar lifecycle futuro

Modelo de referencia razonado:

**idle -> preparing -> streaming -> completed**

Ramas:
- preparing -> failed
- preparing -> cancelled
- streaming -> tool_wait -> tool_running -> streaming
- streaming -> incomplete
- streaming -> failed
- streaming -> cancelled
- tool_running -> failed
- tool_running -> cancelled cuando la herramienta lo permita

Aprendizaje:
no todos los eventos de proveedor deben convertirse en estados de dominio.
Los eventos del proveedor se traducen a un vocabulario interno estable.

## 3 · Práctica: contrato interno mínimo

Envelope recomendado para futura implementación:

- schema_version
- event_id
- conversation_id
- session_id
- turn_id
- sequence
- kind
- status
- occurred_at
- correlation_id
- causation_id cuando aporte valor
- payload
- provider_metadata opcional, aislada del dominio

Invariantes:
1. event_id único.
2. turn_id obligatorio para eventos de turno.
3. sequence monotónica dentro de la unidad definida.
4. unknown provider event no rompe el dominio.
5. un terminal event cierra el turno.
6. eventos tardíos de un turno cerrado se descartan o auditan; no reabren el estado.
7. payload se valida antes de mutar estado.
8. provider metadata nunca se usa como contrato principal.

No se implementó hoy.

## 4 · Práctica: cancelación

Caso razonado:
persona pulsa “Parar” durante un stream remoto futuro.

Secuencia segura:
1. marcar intención de cancelación;
2. abortar transporte si existe AbortSignal/operación cancelable;
3. impedir que nuevos deltas muten UI/estado;
4. cancelar tool pendiente si el contrato lo permite;
5. marcar turno cancelled o incomplete según semántica;
6. limpiar recursos;
7. mantener conversación utilizable;
8. conservar solo evidencia técnica mínima necesaria.

Prueba negativa:
un delta que llega después de cancelación NO puede aparecer como respuesta nueva.

## 5 · Práctica: reintentos

Escenarios razonados:
- GET/lectura sin efecto: retry puede ser razonable;
- petición de generación: retry puede crear respuesta duplicada si no hay correlación;
- tool con efecto: retry automático puede duplicar acción;
- timeout no demuestra que el servidor no ejecutó.

Regla:
antes de reintentar una operación con efecto, demostrar idempotencia o consultar estado.

## 6 · Práctica: proveedor como adaptador

OpenAI:
- streaming por SSE en Responses;
- documentación actual contempla WebSocket persistente;
- eventos tipados.

Anthropic:
- streaming por SSE;
- message_start;
- content_block_start;
- content_block_delta;
- content_block_stop;
- message_delta;
- message_stop;
- ping;
- error;
- posibilidad documentada de nuevos tipos de evento.

Conclusión:
Sabik necesita una interfaz interna de adaptación.

No almacenar nombres de eventos de proveedor por toda la UI/core.

## 7 · Práctica: seguridad WebSocket

Checklist derivado de OWASP:
- wss en producción;
- validar Origin;
- autenticar;
- autorizar acciones por mensaje/operación;
- validar schema;
- limitar tamaño;
- limitar frecuencia;
- heartbeat/timeout;
- evitar replay cuando aplique;
- logs suficientes sin exponer contenido sensible;
- cerrar conexiones anómalas;
- no confiar en que “conexión abierta = usuario autorizado para todo”.

No se desplegó WebSocket hoy.

## 8 · Práctica: accesibilidad del stream

Estado actual observado:
role=status + polite + atomic.

Riesgo futuro:
si cada token/delta modifica una live region, un lector de pantalla puede recibir una experiencia caótica.

Diseño recomendado:
- buffer de salida accesible;
- anuncios por unidades significativas;
- status separado del contenido;
- no robar foco;
- permitir parar;
- respetar baja intensidad;
- no imponer animación continua;
- evitar interrupciones no solicitadas.

COGA refuerza el control de interrupciones y la capacidad de pausar contenido distractor.

## 9 · Práctica: observabilidad mínima

Eventos técnicos propuestos:
- conversation.started
- turn.started
- turn.first_event
- turn.first_visible_output
- turn.completed
- turn.cancelled
- turn.failed
- stream.disconnected
- stream.reconnected
- event.duplicate_discarded
- event.stale_discarded
- tool.started
- tool.completed
- tool.failed
- tool.cancelled

Atributos:
- IDs técnicos pseudónimos;
- duración;
- proveedor/modelo solo cuando corresponda y esté permitido;
- clase de error;
- retry count;
- reconnect count.

No incluir por defecto:
- texto de la conversación;
- datos de salud;
- prompts;
- outputs completos;
- secretos;
- chain of thought.

Diseño final de observabilidad corresponde coordinarlo con Vigía.

## 10 · Matriz de fallos que Pulso debe saber probar

### Transporte
- conexión no abre;
- stream se corta;
- ping sin payload;
- evento malformado;
- evento desconocido;
- evento duplicado;
- evento fuera de orden;
- cierre sin evento terminal;
- retry storm.

### Sesión
- doble submit;
- cancelar y volver a enviar;
- turno A termina después que turno B;
- reload;
- pestañas múltiples;
- sesión nueva hereda datos indebidamente.

### Tools
- argumentos parciales;
- JSON inválido;
- herramienta tarda demasiado;
- herramienta devuelve error;
- herramienta se ejecuta pero el ACK se pierde;
- resultado duplicado;
- cancelación durante ejecución.

### Accesibilidad
- lector de pantalla durante streaming;
- baja intensidad;
- prefers-reduced-motion;
- status no roba foco;
- error entendible;
- “Parar” accesible por teclado.

### Privacidad
- no persistencia por defecto;
- no secreto en cliente;
- no prompt en logs por defecto;
- no envío remoto sin decisión/consentimiento aplicable.

## 11 · Lo que NO hice hoy

- no modifiqué Sabik/NEA Web;
- no conecté OpenAI;
- no conecté Anthropic;
- no introduje WebSocket;
- no cambié memoria;
- no cambié telemetría;
- no desplegué;
- no ejecuté pruebas contra producción;
- no certifiqué accesibilidad;
- no afirmé conformidad ISO;
- no migré proveedor;
- no cambié el modelo.

## 12 · Resultado de prácticas

Pulso puede:
- leer un runtime conversacional existente;
- identificar estado y fronteras;
- diseñar lifecycle;
- identificar riesgos de transporte/concurrencia;
- plantear contrato normalizado;
- separar proveedor de dominio;
- razonar cancelación/retry/idempotencia;
- coordinar accesibilidad y observabilidad;
- preparar pruebas negativas.

Siguiente nivel:
aplicar estas capacidades a una orden real de A3 con branch/issue/acceptance definidos y obtener evidencia ejecutada.
