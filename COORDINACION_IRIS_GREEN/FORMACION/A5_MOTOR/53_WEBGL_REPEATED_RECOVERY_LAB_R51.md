# MOTOR · A5 · LABORATORIO R51 · WEBGL CONTEXT LOSS REPETIDO

Fecha: 01/10/2026
Amplía: R49/R50
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Objetivo

Comprobar que la pérdida/restauración de contexto WebGL no solo funciona una vez, sino repetidamente, sin que el contrato básico se degrade.

R49 probó un ciclo.
R51 prueba **cinco ciclos consecutivos**.

## 2 · Entorno

Laboratorio aislado:
- Chromium 144.0.7559.96;
- Xvfb;
- WebGL2;
- ANGLE/SwiftShader;
- Playwright;
- documento mínimo generado en memoria;
- extensión `WEBGL_lose_context`.

No se ejecutó Iris Green integrada.

## 3 · Secuencia por ciclo

Para cada ciclo:

1. verificar buffer actual válido;
2. `loseContext()`;
3. observar `webglcontextlost`;
4. `preventDefault()`;
5. verificar `isContextLost() === true`;
6. `restoreContext()`;
7. observar `webglcontextrestored`;
8. comprobar que buffer antiguo ya NO es válido;
9. crear y bind buffer nuevo;
10. comprobar buffer nuevo válido;
11. ejecutar clear;
12. verificar `gl.getError() === 0`.

## 4 · Eventos observados

```text
lost-1
restored-1
lost-2
restored-2
lost-3
restored-3
lost-4
restored-4
lost-5
restored-5
```

Orden correcto en 5/5 ciclos.

## 5 · Resultado estructurado

En cada ciclo 1–5:

```json
{
  "oldBefore": true,
  "lost": true,
  "oldAfter": false,
  "fresh": true,
  "err": 0
}
```

Resultado agregado:
- ciclos completados: **5/5**;
- lost events: **5**;
- restored events: **5**;
- buffer viejo invalidado: **5/5**;
- buffer nuevo válido: **5/5**;
- error posterior: **0 en 5/5**.

## 6 · PASS · repetibilidad

El contrato:

```
VALID RESOURCE
→ CONTEXT LOST
→ OLD RESOURCE INVALID
→ RESTORE
→ NEW RESOURCE VALID
→ RENDER API HEALTHY
```

se sostuvo en los cinco ciclos.

PASS.

## 7 · rAF durante el laboratorio

Se mantuvo un `requestAnimationFrame` simple durante la prueba.

Contador observado:
`rafCount = 34`.

Este dato NO demuestra:
- absence of duplicate loops;
- performance quality;
- frame stability.

Solo confirma que el event loop visual siguió vivo en el laboratorio.

Para probar duplicación real:
el runtime bajo test tendría que crear/destruir su propio loop por restore y contar owners.

## 8 · Qué mejora respecto a R49

R49:
un ciclo.

R51:
- repetición;
- secuencia de eventos consistente;
- recreación de recursos repetida;
- no error acumulativo en el API básico.

Aumenta confianza sobre la plataforma/lab.

No aumenta automáticamente confianza sobre Three.js/Iris Green.

## 9 · Regla de arquitectura reforzada

Resources GPU deben pertenecer a una **generación de contexto**.

Concepto:

```
contextGeneration = 0

on restore:
  contextGeneration++
  rebuild resources for generation
```

Un handle de generación vieja:
nunca reutilizable.

## 10 · Registry pattern

Para motores complejos:

```
domainState
resourceDescriptors
gpuHandles
generation
```

Al loss:
- invalidate handles;
- conservar descriptors/domain state.

Al restore:
- recreate from descriptors.

No serializar/guardar handles WebGL.

## 11 · Repeated restore y listeners

Handler de restore debe ser idempotente.

Riesgos:
- registrar listener de nuevo dentro de cada restore;
- arrancar un rAF adicional;
- duplicar ResizeObserver;
- duplicar textures.

Prueba integrada futura debe contar:
- active loops;
- observers;
- scene nodes;
- resource counts.

## 12 · Race con teardown

Caso no probado aquí:

```
lose
→ component destroyed
→ restore event arrives
```

Owner/lifecycle debe impedir reconstrucción de un componente muerto.

R02 revision/AbortController pattern aplica.

## 13 · Race con nueva escena

Caso:

```
scene A loses context
→ user switches to B
→ context restores
```

No reconstruir A sobre B.

Necesita:
- scene revision;
- owner;
- generation.

## 14 · Hardware caveat

SwiftShader no representa:
- driver real;
- mobile GPU;
- discrete/integrated GPU behavior;
- memory pressure real.

Por tanto:
esta prueba es de **contrato API reproducible**, no de hardware reliability.

## 15 · Browser caveat

No probado:
- Firefox;
- WebKit/Safari.

No declarar cross-browser PASS.

## 16 · Framework caveat

No probado:
- Three.js WebGLRenderer recovery;
- custom materials `onBeforeCompile`;
- textures;
- render targets;
- instancing;
- scene-specific resources.

## 17 · Próximo laboratorio integrado de alto valor

Cuando Formación permita entorno de producto aislado:
- scene 3D real;
- inject context loss;
- verify state;
- restore;
- compare screenshot/state;
- repeat 3×;
- verify one rAF/observer;
- verify no console cascade.

No hacerlo hoy sobre producto.

## 18 · Marcador

`MOTOR_WEBGL_REPEATED_CONTEXT_RECOVERY_LAB_PASS_R51`

## 19 · Límites

No:
- cambio de runtime;
- listener nuevo;
- build;
- merge;
- deploy;
- main/producción.

Resultado:
**5/5 ciclos PASS en laboratorio aislado.**
