# I0 · PRIVACIDAD, RED, SESIÓN Y OFFLINE · V0.1

**Fecha:** 20/09/2026  
**Estado:** entregable I0

## 1. I0/I1: datos que salen del navegador

**Ninguno.**

En I0/I1:
- la consulta se procesa en navegador;
- el índice es un artefacto estático;
- no se envía `text`, `sessionId`, ruta, intención, parámetros ni contexto conversacional a un backend;
- no hay telemetría con contenido.

Cualquier fase que cambie esta regla requiere revisión de privacidad y una nueva versión del contrato.

## 2. Datos locales permitidos durante la sesión

En memoria:
- sessionId efímero;
- currentRoute/currentContentId;
- optionsShown;
- pendingClarification;
- pendingConfirmation futura;
- lastAction;
- estado S0 necesario;
- preferencias activas.

No se persisten por defecto:
- mensajes;
- transcripciones;
- respuestas;
- conceptos consultados;
- historial;
- inferencias;
- diagnósticos.

## 3. Navegación

En I0/I1 una navegación de página puede reiniciar el contexto conversacional.

- si fue solicitada explícitamente, puede ejecutarse;
- si existe pérdida relevante no solicitada, se trata como `local_with_loss`;
- no se introduce persistencia entre páginas sin revisión específica.

## 4. Offline

Tras una primera carga válida:
- preferencias locales funcionan;
- navegación disponible en assets cacheados funciona;
- paso a paso/vista sencilla/detalles funcionan;
- búsqueda funciona solo si el índice necesario está disponible localmente.

Si falta un recurso:
- no inventar respuesta;
- devolver estado offline/insufficient explícito;
- no intentar un backend alternativo oculto.

Voz cloud futura:
- puede no estar disponible offline;
- el texto sigue funcionando.

## 5. Límites de sesión

- máximo 1200 code points por entrada;
- máximo 3 acciones locales independientes por entrada;
- una sola aclaración por solicitud;
- máximo inicial de 5 opciones visibles por bloque de resultados;
- una confirmación solo puede usarse una vez;
- no se crean tareas futuras.

No se define todavía persistencia temporal entre días.

## 6. Presupuesto

### I0/I1
- coste remoto por interacción: **0**;
- presupuesto de inferencia remota: **0**;
- no se autoriza contratación ni despliegue cloud.

### I2/I3 laboratorio
- todo gasto necesita autorización previa;
- límite monetario explícito antes de encender recursos;
- recursos GPU se apagan al terminar la prueba;
- no se usa tráfico real de usuarios.

## 7. Métricas

I0/I1:
- pruebas locales y CI pueden registrar tiempos/resultados sintéticos;
- nunca texto real de usuario.

Producción futura:
- métricas agregadas y sin contenido;
- intención + ruta se considera potencialmente sensible;
- aplicar umbral mínimo de agregación antes de exponer estadísticas;
- no logs de audio/transcripción.

## 8. Futuras fases de voz

Si se autoriza voz:
- micrófono siempre opt-in;
- audio transitorio;
- no almacenar audio por defecto;
- no almacenar transcripción por defecto;
- documentar proveedor/región y tratamiento;
- no usar conversaciones para entrenamiento;
- TTS de la voz de Sabik solo sobre respuestas autorizadas, nunca texto libre arbitrario.

## 9. Seguridad de campos

`text`, `currentRoute`, `currentContentId` y el contexto pueden revelar intereses relacionados con salud.

Por ello:
- no enviarlos en I0/I1;
- no incluirlos en URLs;
- no incluirlos en analytics;
- no incluirlos en mensajes de error;
- no incluirlos en trazas.
