# MOTOR · A5 · ESTUDIO PROFUNDO R23 · TYPE CONTRACTS, JSDOC Y RUNTIME VALIDATION

Fecha: 30/09/2026
Amplía: R01–R22
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Tres capas distintas

### Static type contract
Ayuda al autor antes de ejecutar.

Ejemplos:
- TypeScript;
- checkJs;
- JSDoc.

### Runtime validation
Protege fronteras no confiables.

Ejemplos:
- JSON import;
- postMessage;
- network;
- storage viejo.

### Internal invariant
Tras validación, el motor puede tratar cierta condición como garantizada.

No mezclar estas capas.

## 2 · TypeScript en JavaScript existente

Fuentes:
- TypeScript · checkJs
  https://www.typescriptlang.org/tsconfig/checkJs.html
- TypeScript · JSDoc Reference
  https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html

`checkJs` + `allowJs`:
reporta errores de tipos en archivos JavaScript.

Por archivo:
`// @ts-check`.

JSDoc soporta:
- @type;
- @param;
- @returns;
- @typedef;
- @template;
- @satisfies;
- readonly/private/override, etc.

Regla:
Iris Green puede endurecer módulos críticos gradualmente sin convertir todo el repo a TypeScript de golpe.

## 3 · Discriminated unions

Fuentes:
- TypeScript · Narrowing
  https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- TypeScript · Unions
  https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html

Estado:

```text
idle
loading {requestId}
ready {items}
failed {code}
```

se representa como unión discriminada por `state`.

Ventaja:
cada variante solo expone campos válidos.

## 4 · Exhaustiveness

Patrón:
```js
/** @param {never} x */
function assertNever(x) {
  throw new Error("unreachable");
}
```

En default de switch:
`assertNever(state)`.

Si se añade nueva variante y no se maneja:
el checker falla.

## 5 · Práctica ejecutada

Herramienta disponible:
`tsc 5.8.3`.

### Archivo completo
4 estados manejados.

Comando:
`tsc --noEmit --allowJs --checkJs --strict`.

Resultado:
`exit 0`.

PASS.

### Archivo incompleto
Se elimina case `failed`.

Resultado:
```text
TS2345:
Argument of type '{ state: "failed"; code: string; }'
is not assignable to parameter of type 'never'.
```

`exit 2`.

PASS: el contrato detecta el estado olvidado.

Resultado R23:
**2/2 static exhaustiveness checks PASS.**

## 6 · Static types do not validate JSON

Esto sigue siendo posible:

```js
const data = JSON.parse(text);
```

El checker no convierte automáticamente `data` en datos válidos.

Regla:
entrada externa comienza como:
`unknown`.

Solo después de validar:
`Project`.

## 7 · JSON Schema

Fuente:
- JSON Schema Specification
  https://json-schema.org/specification

Versión publicada actual:
**Draft 2020-12**.

Partes principales:
- Core;
- Validation.

Puede describir:
- types;
- required;
- enum/const;
- arrays;
- nested objects;
- additional/unevaluated properties;
- numeric/string constraints.

## 8 · Schema versioning

No confundir:
- JSON Schema draft;
- Iris project schema version.

Ejemplo:
schema del proyecto puede ser v3 y estar escrito en JSON Schema Draft 2020-12.

## 9 · Runtime validators

Opciones:
- hand-written validator;
- JSON Schema validator;
- generated validator.

Elegir según:
- complejidad;
- bundle size;
- performance;
- error quality;
- maintenance.

R40 actual usa validator manual.

Eso es válido si:
- centralizado;
- testeado;
- límites explícitos.

## 10 · Auditoría R40 import

Actual:
- JSON.parse;
- scan recursivo;
- depth max;
- node max;
- string max;
- plain-object requirement;
- dangerous-key reject;
- contract/schema validation;
- project normalization.

Patrón robusto para un formato acotado.

No migrar automáticamente a JSON Schema si no mejora:
- claridad;
- coverage;
- maintainability.

## 11 · Prototype pollution

Fuentes:
- MDN · Prototype pollution
  https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution
- OWASP · Prototype Pollution Prevention
  https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html

JSON con `__proto__` no contamina por parsearlo.

El riesgo aparece al:
- mergear;
- asignar paths;
- copiar a objeto con setters/prototype.

Defensas:
- reject `__proto__`, `constructor`, `prototype`;
- allowlist;
- Map;
- Object.create(null);
- schema.

R40 ya rechaza esas claves en import.

## 12 · Unknown fields

Contrato debe definir:
- reject;
- ignore;
- preserve.

Para forward compatibility:
preservar campos desconocidos a veces ayuda.

Para security-sensitive options:
reject puede ser mejor.

No aplicar una política universal.

## 13 · Type guard

Patrón:

```ts
function isMessage(x: unknown): x is Message
```

Debe comprobar runtime real.

No escribir:
`return true as boolean`.

El nombre “type guard” no crea seguridad por sí solo.

## 14 · Assertion function

```ts
function assertProject(x: unknown): asserts x is Project
```

Si no cumple:
throw validation error.

Útil en boundaries.

## 15 · Messages Worker

postMessage usa structured clone, no JSON.

Pero type safety tampoco atraviesa mágicamente runtime.

Worker debe validar:
- protocol;
- type;
- id;
- payload shape

si el sender puede variar/versionarse.

R42 worker:
switch por `type`, unknown → `UNKNOWN_TASK`.

Patrón positivo.

## 16 · Event detail

CustomEvent detail también requiere contrato si cruza subsistemas.

JSDoc puede describir.
Runtime protocol/version protege ejecución.

Conecta R18.

## 17 · State machine types

Motor debe tipar:
- states;
- events;
- transition result.

Objetivo:
imposible representar estados como:
`loading=true && ready=true && failed=true`.

Discriminated union reduce boolean soup.

## 18 · Error types

No todo error debe ser string.

Contrato:
```text
CANCELLED
TIMEOUT
CAPABILITY_UNAVAILABLE
VALIDATION
CONFLICT
FATAL
```

Static union + runtime cause.

Conecta R12.

## 19 · Numeric validation

Type `number` incluye:
- NaN;
- Infinity.

Si dominio requiere finite:
runtime:
`Number.isFinite(value)`.

Types no sustituyen domain validation.

## 20 · Branded IDs

TypeScript puede distinguir conceptualmente:
- ProjectId;
- StudyId;
- RequestId.

Pero runtime sigue siendo string.

No complicar si el beneficio es bajo.

## 21 · JSDoc rollout strategy

Para Iris Green JS:

### Paso 1
`// @ts-check` en módulo pequeño/estable.

### Paso 2
typedefs para public contract.

### Paso 3
unknown en boundaries.

### Paso 4
discriminated states/errors.

### Paso 5
CI `tsc --noEmit --allowJs --checkJs` sobre scope aprobado.

No activar repo entero de golpe:
puede generar miles de warnings y trabajo sin valor.

## 22 · @satisfies

JSDoc soporta `@satisfies`.

Útil para:
- tablas de handlers;
- state maps;
- config objects.

Verifica contrato sin ensanchar tanto el tipo del valor.

## 23 · Contract ownership

Tipos no son documentation-only.

Public API type cambia:
- consumidores;
- tests;
- migrations.

Versionar contratos que cruzan módulos.

## 24 · Testing

Static:
- exhaustive switch;
- invalid config compile error.

Runtime:
- malformed input;
- future version;
- missing field;
- wrong type;
- NaN/Infinity;
- dangerous keys.

Fuzz:
R14.

## 25 · Estado R23

Práctica:
**2/2 PASS**:
- exhaustive JS/JSDoc state compiles;
- missing variant is caught by TypeScript checker.

Estudiado:
- checkJs/JSDoc;
- discriminated unions;
- JSON Schema 2020-12;
- runtime validation;
- prototype pollution;
- boundary contracts.

Marcador:
`MOTOR_TYPE_CONTRACT_RUNTIME_VALIDATION_STUDIED_R23`

No:
- TypeScript migration;
- tsconfig repo;
- schema library;
- CI change;
- product build;
- merge;
- deploy;
- main/production.
