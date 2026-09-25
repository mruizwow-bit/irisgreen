# Revisión A2 de los cambios de A3 R06 · 25/09/2026

Petición de María: «El agente 3 ya ha hecho cambios, compruebalo».

## Resultado

**CAMBIOS_DE_CODIGO_CONFIRMADOS · QA_AUTOMATICA_CONFIRMADA_EN_SU_ALCANCE · INTEGRACION_Y_HTTP_REAL_PENDIENTES · OBS-A3-R06-FRAME-SRC-01 ABIERTA.**

A3 ya acusó recibo y entregó código. No mantenerlo como «pendiente de acuse» ni afirmar que no trabajó. Esta revisión no cambia el reparto R06 ni devuelve tareas a Codex. No se modifica producto, no se hace merge y no se despliega.

## Identidades comprobadas en GitHub

- PR #244: HEAD `82106c874f5e4b612cdb68292b3c3115e040fea6`, sigue abierta/borrador. Nuestra rama no contiene todavía el delta de A3.
- PR #245: HEAD `0b96baec83e96c34f39200993260d366d496a0a3`, contra la rama A2; exactamente un archivo cambiado: `sabik/authorized-transport.mjs`. Abierta/borrador, sin integrar.
- PR #246: HEAD `8690e26140f6d513c3592df62bc82b167cbb1d0e`, base Cloud `16f1134e56292ca2ee600e77e69012c494f39aaf`; cinco archivos finales: transporte web, conector Cloud, handler privado, pruebas y documentación. Abierta/borrador.

El cambio sustituye la dependencia de popup/opener por iframe oculto y parent/MessageChannel. El handler permite `frame-ancestors` únicamente para el origen configurado. Se conserva validación de origen/source/nonce y no se añaden credenciales cliente. A3 registró dos reproducciones humanas de opener nulo; A2 revisó ese registro, no las reprodujo de nuevo.

## Pruebas verificadas, sin atribuirlas a A2

Run Cloud `36100865590`: ambos jobs Node22.16.0 y Node24.19.0 SUCCESS, incluidos regresión del transporte, suite Cloud, build y sintaxis. El HEAD realmente probado fue `d9193de2dc5568b10eb6e7791e0c297ddac95b2b`. La comparación con `8690e261...` muestra únicamente la restauración de `.github/workflows/auditoria-web.yml`; no un cambio posterior de producto oculto.

Run web `36100265218`: montaje, Recursos, cabeceras/visores y Taller SUCCESS. No demuestra conexión privada: el test de montaje no envía consultas y el arnés del transporte usa objetos de ventana/documento y fetch inyectados. No prueba por sí solo cabeceras HTTP del sitio ni Team Login dentro del iframe.

Run de intento de despliegue `36101218660`, job `107963912517`: FAILURE en el guard de credencial; checkout, instalación, regresión y deploy SKIPPED. No es un despliegue R06 realizado. No se repite el intento.

Lectura nueva del conector Netlify sobre `6ab56a1ba2f6d83e6fb7b408`: READY, título R04, published_at=null y las dos Functions conocidas en Node24. Esto confirma la identidad del Cloud todavía configurado por A2, no excluye por sí solo cualquier otro despliegue no consultado. La última entrega A3 también deja R06 sin desplegar ni HTTP acreditado.

## OBS-A3-R06-FRAME-SRC-01 · bloqueo de integración confirmado por configuración

El nuevo transporte crea un iframe hacia el Cloud, pero la política web de la base A2 no permite ese origen:

`frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.instagram.com`

Evidencia independiente de la descripción de A3:
1. `_headers` en `82106c8`, blob `47b3f674ae838f2bcc96dd96b588f36a4e07ebc4`.
2. Artefacto del build `10847108890`, run `36095903988`, SHA-256 descargado y verificado `4af10ea75a0cefdc1dea6ab327c7febe079c5ff092e9717fa02ae9e42fe93fd2`. `publicacion/csp-inventario.json` confirma esa misma lista en `csp_publicada` y `csp_directivas.frame-src`; no es solo una hipótesis sobre la fuente antes del build.
3. PR245 solo cambia el transporte; no modifica la política ni su generador. El módulo recuperado coincide con Git blob `c4a11fc0f7d17f545b627ab3bf9e5e9502c29e70`.

La distinción es funcional: `frame-ancestors` del Cloud decide quién puede alojarlo; `frame-src` de la web decide qué iframe puede cargar. Cambiar únicamente el primero no autoriza el segundo. Referencia primaria: W3C CSP, https://www.w3.org/TR/CSP/#directive-frame-src y https://www.w3.org/TR/CSP/#directive-frame-ancestors . Con la política documentada y sin el incremento que falta, el iframe Cloud queda fuera de la lista permitida.

**Corrección pendiente dentro de R06:** A3 debe preparar para A2 el delta mínimo de integración que contemple ambas políticas y el origen exacto del candidato privado final, junto con la actualización coherente de mount-config. Sin comodines ni debilitación general de CSP, sin cambiar producción/Team Login/secretos. Añadir prueba de navegación/conexión que use las cabeceras reales del artefacto, no solo SimpleHTTP sin CSP o un documento inyectado. Probar la autenticación real embebida; con sesión ausente/expirada no dar por suficiente un iframe oculto que espere hasta timeout. No se afirma aquí que esa segunda situación haya sido reproducida.

Después siguen los cinco casos reales R06 y la correlación HTTP: resultados/fuentes, vacío, cancelación/sustitución, error/timeout recuperable y citas ES con lang=es en interfaz EN.

## Límites de esta revisión

Lectura de código, comparación de commits, estado de Actions/Netlify y análisis del artefacto construido. La navegación local de Chromium fue bloqueada por la política del entorno con ERR_BLOCKED_BY_ADMINISTRATOR; no se cuenta como reproducción del defecto ni como PASS. La consulta HTTP directa de cabeceras tampoco estuvo disponible por resolución DNS del entorno. El hallazgo se acredita por configuración construida + contrato CSP; no se presenta como nueva prueba live/autenticada. No se solicitaron cookies, claves o una terminal de María. A3 ya retiró esa petición en #237, comentario 5828453278.

No se certifica conformidad global ni se cierran pendientes ajenos. Normativa existente aplicada sin cambiar requisitos. Registrar esta revisión junto al delta de Control de los mismos IDs; no sobrescribe maestros/CSV ni acredita sincronización del Excel V114.
