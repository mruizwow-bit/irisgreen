# ADDENDUM R42 · Taller · física bajo CSP de producción

Fecha: 26/09/2026  
Ámbito: Taller R42 A5, integración A2  
Naturaleza: criterio operativo de seguridad/arquitectura. No modifica por sí solo normativa externa.

## 1. Política vigente

La publicación pública de Iris Green elimina `'unsafe-eval'` durante build y no declara actualmente `'wasm-unsafe-eval'`.

Mientras este estado continúe, WebAssembly no se considera una capacidad garantizada de la web pública.

## 2. Motores

### Planck
Backend canónico de producción para física 2D del Taller bajo la CSP vigente.

### Rapier
Backend opcional/acelerado. Puede utilizarse únicamente cuando la política efectiva permita WebAssembly y su inicialización sea correcta.

Rapier no puede convertirse en dependencia exclusiva de una función pública mientras producción no habilite WASM.

## 3. No relajar CSP desde A5

A5 no cambia `_headers`, la política final de producción ni los scripts de seguridad para hacer arrancar Rapier.

Cualquier cambio a `'wasm-unsafe-eval'` corresponde a A2/Astra y requiere decisión separada.

## 4. Alcance de seguridad

`'wasm-unsafe-eval'` habilita compilación/instanciación WebAssembly y es más restringido que `'unsafe-eval'`, que además habilita evaluación dinámica JavaScript.

No deben confundirse.

## 5. Múltiples CSP

Una política adicional más permisiva no invalida una política existente más restrictiva.

Si en el futuro se intenta una excepción por rutas para Taller, la respuesta HTTP final debe comprobarse para garantizar que la política efectiva realmente permite WASM solo donde se haya decidido.

## 6. Equivalencia funcional

El motor de producción no se denomina “fallback degradado” si es la ruta obligatoria bajo la política pública.

Las funciones 2D visibles deben construirse sobre un contrato común y probarse con Planck.

Rapier puede mejorar rendimiento o capacidad interna, pero no eliminar funciones al desaparecer.

## 7. 3D

Planck cubre física 2D.

Una necesidad real de física 3D requiere nueva evaluación. Una representación visual 3D/isométrica no implica por sí misma física 3D.

## 8. QA de integración

A2 debe construir la salida pública y comprobar:
- CSP final sin `'unsafe-eval'`;
- CSP final sin `'wasm-unsafe-eval'` mientras no se autorice;
- Taller inicia física vía Planck;
- interacción, pausa, reset, teclado/touch y reduced motion funcionan;
- ausencia de fallos visibles por bloqueo de WASM;
- Rapier no es necesario para completar ninguna actividad.

Estado asociado:
`R42_A5_PHYSICS_CSP_DUAL_ENGINE_REQUIRED`.
