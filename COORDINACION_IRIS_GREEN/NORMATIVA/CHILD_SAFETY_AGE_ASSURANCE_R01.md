# CHILD SAFETY · AGE GATE & ADULT ACCESS ASSURANCE · R01

**Fecha:** 2026-10-04  
**Autoridad de producto:** María  
**Owner arquitectónico:** Astra  
**Estado:** ACTIVE — obligatorio para implementación  
**Ámbito:** Iris Green Web + Sabik + búsqueda + navegación + contenido sensible + deep links

## 1. Decisión

La selección de edad deja de ser optativa.

Toda sesión web debe resolver una banda de edad antes de exponer la experiencia normal:

- `AGE_0_12`
- `AGE_13_17`
- `AGE_18_PLUS`

`GENERAL` puede existir únicamente como estado técnico fail-safe/migración, pero NO como alternativa pública para saltarse la selección.

## 2. Separación crítica

`AGE_SELECTION != ADULT_ACCESS_AUTHORIZATION`

Pulsar **18 años o más** es una autodeclaración de interfaz. No constituye prueba suficiente para desbloquear contenido restringido.

Por tanto:

- `AGE_18_PLUS` por sí solo NO activa contenido `S2_FULL`;
- `AGE_18_PLUS` por sí solo NO habilita un catálogo adulto completo;
- `AGE_18_PLUS` por sí solo NO cambia el sistema a un modo de seguridad sin restricciones.

Debe existir una señal independiente de acceso adulto:

`ADULT_ASSURANCE_VERIFIED`

Hasta que esa señal exista y esté validada por Lex/Vigía/Axioma:

`FAIL_CLOSED = SAFE_VARIANT_ONLY`

## 3. Estados mínimos

```text
AGE_UNSET
AGE_0_12
AGE_13_17
AGE_18_PLUS_CLAIMED

ADULT_ASSURANCE_UNVERIFIED
ADULT_ASSURANCE_VERIFIED
```

Reglas:

- `AGE_UNSET` bloquea la navegación normal y presenta el gate obligatorio.
- `AGE_0_12` y `AGE_13_17` usan políticas child-safe correspondientes.
- `AGE_18_PLUS_CLAIMED` NO equivale a `ADULT_ASSURANCE_VERIFIED`.
- solo `ADULT_ASSURANCE_VERIFIED` puede desbloquear contenido marcado como restringido a adulto/verificación.
- cambiar de 0–12/13–17 a 18+ vuelve siempre a `ADULT_ASSURANCE_UNVERIFIED` salvo que exista una señal válida independiente.

## 4. Gate obligatorio de entrada

Antes del contenido normal:

**ES**
- ¿Qué edad tienes?
- 0–12 años
- 13–17 años
- 18 años o más

**EN**
- What is your age group?
- Ages 0–12
- Ages 13–17
- Ages 18+

El gate:
- no puede cerrarse sin selección;
- no puede omitirse con Escape;
- no debe estar oculto detrás de ajustes;
- debe funcionar con teclado, touch y lector de pantalla;
- debe permitir ES/EN y accesibilidad antes de seleccionar;
- no debe pedir fecha de nacimiento completa si no es necesaria para el mecanismo de assurance;
- no debe persistir más información de la necesaria.

## 5. Adult assurance

El proveedor/mecanismo concreto NO se fija en este documento.

Requisitos de producto:
- señal binaria/minimizada de mayoría de edad siempre que sea viable;
- no almacenar documento, DOB completa ni imagen de identidad en Iris Green si no es imprescindible;
- no convertir Stripe/pago en prueba de edad;
- no tratar una casilla o botón de autodeclaración como verificación;
- privacidad, retención y proveedor deben pasar Lex + Vigía;
- accesibilidad y alternativa razonable deben pasar Axioma.

Hasta cerrar ese mecanismo:
- el botón 18+ puede seleccionar la banda;
- NO puede desbloquear `S2_FULL` ni recursos marcados `REQUIRES_ADULT_ASSURANCE`.

## 6. Superficies cubiertas

La misma política se aplica a:

- Home;
- navegación;
- buscador y autocomplete;
- resultados intencionales;
- rutas directas;
- safe/full split de S2;
- assets/chunks `/assets/safety/full/`;
- Sabik retrieval y respuestas;
- recomendaciones/related;
- Intereses;
- Libros;
- Investigación;
- Datos;
- Ayudas/trámites;
- Cuestionarios;
- cualquier futura zona de pago.

No debe existir bypass por:
- URL directa;
- query string;
- hash;
- sessionStorage manipulado;
- llamada directa a asset full;
- cambio de idioma;
- navegación desde Sabik;
- caché/prefetch/preload.

## 7. Sabik

Sabik consume el mismo estado de seguridad.

Reglas:
- no inferir edad;
- no pedir fecha de nacimiento salvo que el flujo de assurance aprobado lo requiera;
- no revelar contenido full por conversación si la interfaz no lo permitiría;
- un turno de voz no puede saltarse el gate;
- si `AGE_UNSET`, Sabik no procesa contenido restringido;
- si `AGE_18_PLUS_CLAIMED + ADULT_ASSURANCE_UNVERIFIED`, responder desde safe variant;
- fuentes mostradas también quedan filtradas.

## 8. Contenido / metadata

Añadir o derivar cuando aplique:

```text
age_bands
sensitivity
safe_variant_group
requires_explicit_intent
requires_adult_assurance
discovery_mode
```

`ALL_AGES` sigue siendo metadata de contenido, no un perfil de usuario.

## 9. Fail closed

Ante:
- error del gate;
- JS no cargado;
- sessionStorage corrupto;
- assurance desconocida;
- token caducado;
- conflicto entre estados;
- error de red;
- fallo de proveedor;

resultado:

`SAFE_BY_DEFAULT`

Nunca `ALLOW_FULL_BY_DEFAULT`.

## 10. QA obligatorio

Matriz mínima:

- fresh session = gate visible y contenido normal bloqueado;
- 0–12;
- 13–17;
- 18+ claimed/unverified;
- adult assured;
- direct S2 URL;
- direct full asset;
- search/autocomplete;
- intentional search;
- Sabik text;
- Sabik voice;
- ES/EN;
- 320/390/1440;
- keyboard;
- screen reader semantics;
- reduced/no motion;
- JS failure;
- storage tampering;
- expired assurance.

Acceptance:
`AGE_BUTTON_18_PLUS_ALONE_NEVER_UNLOCKS_RESTRICTED_CONTENT`

`MANDATORY_AGE_GATE_FAIL_CLOSED_PASS`

`ADULT_ACCESS_REQUIRES_INDEPENDENT_ASSURANCE_PASS`

## 11. Responsabilidades

- Motor: runtime/gate/enforcement.
- Axioma: accesibilidad + standards + COGA + QA.
- Vigía: privacy/provenance/evidence + fail-closed telemetry.
- Lex: base jurídica, age-assurance/privacy/provider/retention/applicability.
- Nube: reflejar la política en Biblioteca Maestra/safety metadata.
- Córtex: evals de Sabik/RAG para no saltar el gate.
- Nexo: E2E y continuidad.
- Astra: red-team final.
- María: HUMAN QA final.

## 12. Regla de continuidad

Esta decisión supersede cualquier contrato anterior donde:
`AGE_18_PLUS button → isAdult() → unrestricted/full access`.

No borrar histórico: marcarlo como superseded.
