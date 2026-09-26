# R40-RINCON-R03 · integración A2 y preview · 26/09/2026

Estado técnico: **R40_RINCON_R03_INTEGRATED_PREVIEW_READY_FOR_HUMAN_AUDIO_QA**

## Identidad integrada
- Base A2 previa: `bba503efb24aa15bacfbf1c0d47986420705d3bf`.
- Entrega A7: `ad08841ba563ddda38a3d1dac7ee70421faaf88b`, tree `bd75fd67e598aa8b7fb40b400e3d93821b99c2e5`.
- Integración A2 por fast-forward: A7 estaba 4 commits ahead / 0 behind sobre la base exacta.
- Commit A2 adicional solo de CI: `9ad3cc8116b6c1d237b84f71855f3808e93ddbad`.
- Tree A2 vigente: `37a94d4d339aad29108bd929faa51753a373dd4c`.
- Rama: `agent2/sabik-iris-r08-20260924`.
- PR web: #244.
- `main` no modificado.
- freeze R40 no modificado.

## Producto R03 integrado
- selector superior único: Vídeos / Sonidos / Bola de relajación;
- una sola región activa; cambiar de modo detiene la anterior;
- 9 escenas, incluida Pulpos;
- 12 sonidos generales first-party/WebAudio;
- 9 ambientes de escena;
- Ver y escuchar / Solo imagen / Silenciar / Volumen / Parar;
- crossfade, reduced motion, forced colors;
- fallback poster + texto;
- ES/EN equivalentes;
- grabaciones históricas HOLD fuera del runtime público R03.

## CI
HEAD `9ad3cc...`: **20/20 workflows SUCCESS**.
El workflow `Iris Green y Sabik R08` ejecuta ahora `node tools/test-r40-rincon-r03.js` en lugar del contrato R40 audiovisual anterior.

## Deploy Preview
- deploy ID: `6ab795fcd904e20008e1560d`
- commit_ref: `9ad3cc8116b6c1d237b84f71855f3808e93ddbad`
- context: `deploy-preview`
- published_at: null
- state: READY
- alias: `https://deploy-preview-244--irisgreen-home.netlify.app`
- ES: `/es/sitio-tranquilo/`
- EN: `/en/quiet-space/`
- 0 functions nuevas; 0 edge functions; 0 producción.

## QA web A2
Inspección real de la preview, sin iniciar audio:
- selector superior 3/3 ES/EN;
- cambio de modo reemplaza contenido en la misma región;
- no se apilan Vídeos/Sonidos/Bola;
- 9/9 escenas visibles y Pulpos presente;
- seleccionar escena no inicia movimiento ni audio;
- controles explícitos presentes;
- catálogo de 12 sonidos generados visible;
- 0 listas Pixabay/HOLD visibles;
- sin error visual evidente ni workspace duplicado en escritorio.

La herramienta de inspección no sustituye la escucha humana.

## Gate pendiente exacto
Queda **solo el gate perceptivo/auditivo y revisión humana asociada de #269**:
- escuchar los 12 sonidos generales y 9 ambientes;
- comprobar que cada sonido es reconocible, relajante y sin hiss/zumbido/picos/sorpresas;
- validar niveles, crossfade y sensación prolongada;
- revisión humana móvil/touch/zoom si se exige para aceptación final.

No declarar PASS perceptivo desde CI o inspección DOM.

## Fuera de este carril
- Sabik R06 / HTTP real;
- voz/TTS;
- main;
- producción;
- integración del resto de R40 #265 (A3/A1/A4/A5) salvo el Rincón ya integrado.
