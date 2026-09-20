# I1 · REQUISITOS DEL ADAPTADOR HEREDADOS DE I0 · V0.1

**Fecha:** 20/09/2026  
**Estado:** requisitos previos; no implementación  
**Origen:** gate final independiente de I0 v0.4

I0 v0.4 ha sido declarado `I0_APROBABLE`. Las siguientes precisiones no reabren I0, pero son requisitos del adaptador de I1.

## 1. Persistencia por defecto de CAMBIAR_*

Para las preferencias ya soportadas por `IGPreferences`:
- tamaño y movimiento se aplican mediante `IGPreferences.update`;
- el acuse debe indicar que se recuerdan en este navegador cuando el almacenamiento está disponible;
- `none` (sin movimiento), Paso a paso y Vista sencilla siguen siendo de sesión en I0/I1 y no se guardan.

No se crea una segunda clave de persistencia.

## 2. ASK_CLARIFICATION tiene una única fuente

Si `SabikResult.kind === "clarification"`:
- el adaptador cierra el ciclo con un único `ASK_CLARIFICATION`;
- `s0Events[]` no debe repetir `ASK_CLARIFICATION`;
- un doble despacho es un error de contrato.

## 3. Cierre de ciclo tras RISK_CLEARED

S0 deja `RISK_CLEARED` en `retrieving`.

Por tanto, tras aceptar `RISK_CLEARED`, el adaptador debe cerrar el ciclo:
- con cláusula ordinaria separable: `RETRIEVAL_OK → RESPONSE_READY` después de procesar `postSafetyResolved`;
- sin cláusula ordinaria: `RETRIEVAL_EMPTY` o camino equivalente aprobado que termine en una respuesta abierta;
- nunca dejar S0 indefinidamente en `retrieving`.

## 4. “No pares la voz”

S0 silencia speech al recibir un `SUBMIT` ordinario.

Por tanto:
- la negación sigue produciendo **no acción de parada adicional**;
- el acuse no puede prometer que la locución anterior sigue sonando;
- debe comunicar honestamente que el envío interrumpió la lectura y ofrecer la acción disponible para escuchar de nuevo cuando exista.

## 5. Idioma de los resultados

Con `locale=en`:
- textos de interfaz, validación, `action_result`, `clarification`, errores y `out_of_scope` son traducibles al inglés;
- contenido editorial recuperado permanece en español y se marca `lang="es"`;
- títulos de fuentes editoriales permanecen en español;
- se conserva el aviso de S1: `Answers and source titles are currently available in Spanish.`

## 6. Casos mínimos de prueba del adaptador

1. un solo `ASK_CLARIFICATION` por resultado;
2. `RISK_CLEARED` siempre termina el ciclo S0;
3. resultado tardío del mismo `requestId` se descarta tras `PAUSE_ASSISTANT`;
4. `SPEECH_STOP` se despacha solo desde speech válido;
5. preferencias persistibles usan `IGPreferences.update`;
6. `IGPreferences.reset()` nunca se llama desde Sabik;
7. action_result EN y contenido editorial ES mantienen idiomas separados.

No modificar S0 ni S1 para satisfacer estos requisitos.
