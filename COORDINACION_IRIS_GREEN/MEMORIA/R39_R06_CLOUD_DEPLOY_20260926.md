# R39 R06 · Cloud privado desplegado y conexión web preparada · 26/09/2026

## Resultado Cloud

El bloqueo de despliegue quedó resuelto mediante GitHub Actions con credencial protegida en el almacén de secretos del repositorio. No se registra ni reproduce el valor de la credencial.

Candidato exacto desplegado:
- source candidate: `8690e26140f6d513c3592df62bc82b167cbb1d0e`
- proyecto Netlify: `sabik-asistente`
- site ID: `47b06e68-ff54-4097-8ad8-336b2d71758a`
- deploy ID: `6ab7a2cd2cf8dc09d3ae9aca`
- origin: `https://6ab7a2cd2cf8dc09d3ae9aca--sabik-asistente.netlify.app`
- estado Netlify: READY
- contexto: deploy-preview
- published_at: null
- Functions: `n04-library-qa` y `n04-team-transport`
- runtime remoto: Node 24.x
- GitHub Actions run: `36236824712` SUCCESS
- recibo seguro artifact: `10904248410`

Producción, main, DNS y voz/TTS permanecen intactos.

## Corrección web R06 preparada

Sobre el HEAD exacto de A2 `9ad3cc8116b6c1d237b84f71855f3808e93ddbad` se preparó el delta de integración en:
- branch: `agent3/r39-r06-web-integration-20260926`
- PR: #272
- HEAD actual del delta: `95f5e81e34196eef182b49aa3b0d122b5706977c`

El delta:
1. sustituye popup/window.opener por iframe privado + MessageChannel;
2. apunta `mount-config.mjs` al nuevo Cloud exacto;
3. añade el origen Cloud exacto a `frame-src` de Iris Green;
4. añade regresión específica R06;
5. actualiza el test montado que todavía esperaba el Cloud R04 anterior.

## Propiedad de integración

A2 conserva la única integración y subida de la web. A3 no fusiona ni despliega el frontend por su cuenta.

Flujo:
PR #272 → CI → A2 integra en su rama → A2 publica preview PR244 → prueba HTTP real y cinco casos R06.

## Estado

`R39_R06_CLOUD_READY_WEB_INTEGRATION_PENDING_A2`
