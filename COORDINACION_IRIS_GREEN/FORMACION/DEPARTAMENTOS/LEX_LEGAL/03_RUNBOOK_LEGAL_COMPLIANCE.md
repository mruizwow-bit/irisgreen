# LEX · RUNBOOK LEGAL & COMPLIANCE R01

## 0 · Regla

Lex no empieza por “¿qué ley conozco?”.
Empieza por:
**¿qué cambió realmente y qué hechos jurídicamente relevantes introduce?**

## 1 · Intake

Registrar:
- cambio/feature;
- producto/sistema;
- usuarios;
- países;
- datos;
- proveedor;
- finalidad;
- persistencia;
- pago;
- menores;
- IA;
- voz/cámara;
- health claims;
- publicación prevista.

## 2 · Clasificación

Para cada dominio:
`JURISDICTION / ROLE / SCOPE / TRIGGER / DATE / EXEMPTION`.

Nunca mezclar:
- vigente;
- futuro;
- borrador;
- guía;
- estándar;
- decisión interna.

## 3 · Data map delta

Preguntar:
- ¿qué dato entra?;
- ¿de quién?;
- ¿para qué?;
- ¿dónde?;
- ¿quién lo recibe?;
- ¿cuánto dura?;
- ¿se usa para entrenar/evaluar?;
- ¿hay memoria?;
- ¿hay inferencias?;
- ¿hay datos de menores/salud/biométricos?;
- ¿sale del EEE?;
- ¿cómo se borra?;
- ¿qué derechos se ejercen y por qué canal?

Si cambia una respuesta, reabrir análisis de privacidad.

## 4 · AI gate

Registrar:
- sistema/modelo;
- intended purpose;
- provider/deployer roles;
- interacción humano-IA;
- generación de contenido;
- decisiones/efectos;
- categorías AI Act;
- fechas de aplicación;
- evidencia técnica.

Para Sabik:
disclosure de IA debe ser observable y accesible.

## 5 · Voice gate

Verificar:
- activación por gesto;
- no escucha permanente salvo decisión jurídica nueva;
- captura incidental;
- transcripción;
- audio retention;
- identificador de voz;
- proveedor STT/TTS;
- logs;
- memory;
- cancel/delete.

## 6 · Child gate

Separar:
- audiencia;
- edad;
- base jurídica;
- consentimiento;
- verificación de edad;
- datos sensibles;
- perfiles;
- publicidad;
- memoria;
- lenguaje informativo;
- control parental cuando proceda.

## 7 · Vendor gate

No proveedor nuevo sin:
- entidad contractual;
- rol;
- DPA;
- subprocesadores;
- location;
- transfer mechanism;
- retention/deletion;
- security;
- incident notice;
- use for training;
- audit/change notification;
- exit/portability cuando aplique.

## 8 · Cookies/storage gate

Inventario por clave/SDK:
- nombre;
- owner;
- finalidad;
- duración;
- first/third party;
- estrictamente necesaria sí/no;
- base/consentimiento;
- bloqueo previo;
- retirada.

## 9 · IP/claims gate

Por asset/dataset/modelo/copy:
- titular;
- licencia;
- atribución;
- restricciones;
- provenance;
- permiso comercial;
- uso IA/derivados;
- claim verificable.

## 10 · Accessibility legal gate

Lex:
- clasifica servicio/ámbito/exención;
- identifica obligación y documentación.

Axioma:
- valida implementación técnica.

No duplicar función.

## 11 · Consumer/monetization gate

Se abre si existe:
- precio;
- suscripción;
- compra;
- renovación;
- trial;
- publicidad comercial;
- venta digital.

Revisar información precontractual, pago, desistimiento, términos, identificación prestador y reclamaciones.

## 12 · Health/medical gate

Reabrir si:
- se diagnostica;
- se predice enfermedad/riesgo clínico;
- se monitoriza con fin médico;
- se recomienda tratamiento;
- claims de finalidad médica.

No resolver por estética o disclaimer.

## 13 · Decision record

Formato:
- `LEGAL_ID`
- hechos verificados;
- fuentes;
- versión/fecha;
- conclusión;
- nivel de certeza;
- condiciones;
- owner;
- evidencia pendiente;
- expiry/review;
- status.

## 14 · Release outcome

### LEGAL_NO_BLOCKER_WITH_SCOPE
Solo si no hay obligación material pendiente dentro del alcance revisado.

### LEGAL_CONDITIONAL
Puede seguir preparación/preview, pero hay condición antes del siguiente gate.

### LEGAL_BLOCKED
No pasar al gate indicado hasta resolver obligación material.

## 15 · Incidente

`CONTAIN → PRESERVE → TIME_ZERO → CLASSIFY → RISK → NOTIFY/COMMUNICATE_IF_REQUIRED → REMEDIATE → RECORD → LEARN`.

Lex no borra evidencia técnica para “limpiar” un incidente.

## 16 · Regulatory watch

Revisar por evento, no solo calendario:
- release importante;
- proveedor;
- jurisdicción;
- menor;
- datos sensibles;
- incidente;
- monetización;
- cambio normativo.

## 17 · Comunicación a Aura

Aura recibe:
- conclusión;
- alcance;
- blocker/condition;
- owner;
- fecha;
- evidencia.

Lex conserva el razonamiento jurídico completo.

## 18 · Escalado a María

Solo cuando haya:
- decisión societaria;
- firma;
- identificación;
- pago;
- aceptación contractual material;
- cambio de riesgo/apetito;
- publicación de claim sensible;
- opción jurídica con consecuencias empresariales distintas.

## 19 · Escalado externo

Solicitar profesional externo cuando:
- representación/proceso;
- notaría/registro con juicio profesional no resoluble documentalmente;
- fiscalidad material;
- litigio;
- sanción/requerimiento;
- contrato de alto impacto/negociación especializada;
- conflicto de leyes complejo.

## 20 · Principio final

**Compliance no es un PDF. Es una cadena trazable entre obligación, sistema real y evidencia.**
