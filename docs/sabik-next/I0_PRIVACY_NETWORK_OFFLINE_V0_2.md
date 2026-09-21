# I0 · PRIVACIDAD, RED, SESIÓN Y OFFLINE · V0.2

**Fecha:** 20/09/2026  
**Estado:** revisión correctiva  
**Sustituye:** `I0_PRIVACY_NETWORK_OFFLINE_V0_1.md`

## 1. Datos que salen del navegador en I0/I1

**Ninguno.**

No salen:
- texto;
- sessionId;
- ruta;
- contentId;
- intención;
- parámetros;
- historial;
- audio;
- transcripción;
- contexto de seguridad.

No se incluyen en URL, analytics, error reporting ni trazas.

## 2. Entrada

Se mantiene el contrato S1:
- máximo **2000 puntos de código Unicode antes de recortar espacios**;
- exceso = rechazo accesible;
- no truncar;
- conservar entrada.

## 3. Estado local transitorio

En memoria:
- contexto de sesión;
- opciones mostradas;
- fuentes previas;
- pendientes;
- última acción;
- safetyOriginalRequest;
- estado S0 necesario.

No se persiste conversación.

## 4. Preferencias guardadas existentes

Iris ya dispone de `window.IGPreferences` en `assets/preferencias-lectura.js`.

Contrato vigente:
- persistencia de presentación en `localStorage`;
- clave `ig-a11y`;
- no guarda conversación;
- audio/voz no permanece activado al entrar en una página nueva;
- `RESET_SESSION` de Sabik conserva preferencias;
- si localStorage no está disponible, los ajustes funcionan en la página sin guardarse.

Sabik solo puede usar `scope=saved` para capacidades que ese almacén soporte hasta que una ampliación sea autorizada.

## 5. Navegación y bfcache

- navegación puede reiniciar contexto conversacional;
- bfcache puede restaurar estado en memoria del documento al volver: se documenta como continuidad del documento, no como historial durable;
- tras navegación real, `lastAction` no es válida para undo;
- pendientes incompatibles se invalidan.

## 6. Offline

Tras primera carga válida:
- acciones locales funcionan;
- búsqueda solo funciona si el índice requerido está disponible;
- no hay backend oculto;
- si falta índice/recurso, `insufficient` explícito.

Voz cloud futura puede fallar offline; texto permanece.

## 7. Privacidad del índice

No usar particiones finas cuyo nombre/ruta revele directamente un tema sensible.

Preferencias de diseño:
1. precarga del índice si tamaño razonable;
2. particiones gruesas no diagnósticas;
3. nombres opacos/versionados;
4. evitar una request CDN por cada concepto sensible.

El path solicitado al CDN se considera dato potencialmente revelador.

## 8. Límites de sesión

- 2000 code points;
- máximo 3 acciones locales independientes por entrada;
- una aclaración por solicitud;
- máximo inicial 5 opciones visibles por bloque;
- confirmación de un solo uso mediante eliminación;
- sin tareas futuras.

## 9. Presupuesto

I0/I1:
- inferencia remota: 0;
- coste remoto por interacción: 0;
- no cloud nuevo.

I2/I3:
- autorización previa de gasto;
- límite monetario explícito;
- GPU apagada tras laboratorio;
- sin tráfico real.

## 10. Métricas

I0/I1:
- solo datos sintéticos/CI;
- nunca consulta real.

Producción futura:
- intención + ruta puede ser sensible;
- agregación con umbral mínimo;
- sin audio/transcripción/contenido.

## 11. Voz futura

- micrófono opt-in;
- audio transitorio;
- sin persistencia por defecto;
- no entrenamiento con conversaciones;
- TTS solo de respuestas autorizadas por Sabik;
- nunca endpoint de texto libre.
