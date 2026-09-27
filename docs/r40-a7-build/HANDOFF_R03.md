# R40-RINCON-R03 · handoff A7 → A2

Estado: **R40_RINCON_R03_FULL_AUDIO_UX_BUILD_READY_FOR_A2**

## Identidad
- Orden: #269 / `R40-RINCON-R03`.
- Base exacta A2 usada: `bba503efb24aa15bacfbf1c0d47986420705d3bf`.
- Rama A7: `agent7/r40-rincon-r03-20260926`.
- A2 integra sobre su HEAD vigente; no retrocede su rama al SHA base.

## Producto afectado
- `es/sitio-tranquilo/index.html`
- `en/quiet-space/index.html`
- `assets/rincon-calma.js`
- `assets/rincon-sonidos-r40.js`
- `assets/rincon-r03.js`
- `assets/rincon-r03.css`
- `assets/rincon-pulpos-r40.js`
- `tools/test-r40-rincon-r03.js`

## Entregado
1. 12 sonidos generales rehechos en Web Audio first-party.
2. 9 ambientes de escena con identidad propia.
3. 9 escenas: 8 existentes + Pulpos.
4. Selector superior único: Vídeos · Sonidos · Bola de relajación.
5. Una sola región principal activa; cambiar de modo detiene la anterior.
6. CTA explícita Ver y escuchar / Watch and listen.
7. Solo imagen, Silenciar, Volumen y Parar.
8. Crossfade visual; fade de audio mediante ciclo común del Rincón.
9. Reduced motion y forced-colors.
10. Fallback poster + texto para WebGL; Acuario/Tubo/Pulpos tienen Canvas2D.
11. ES/EN equivalentes.
12. Grabaciones históricas HOLD fuera del runtime/UI R03.

## Revisión A7 en GitHub
Durante la revisión del PR/diff se detectaron y corrigieron:
- carga simultánea de controladores R40 anteriores;
- poster de Pulpos que podía moverse antes de la acción explícita;
- clave Pulpos duplicada en `rincon-calma.js`;
- runtime oculto que todavía construía/fetchaba la lista de audios HOLD.

Precheck estructural final: registrar en `QA_PRECHECK_R03.md`.

## No acreditado por A7
No se declara calidad perceptiva final de audio ni aceptación visual. La orden exige:
A2 integra y publica preview → escucha humana + revisión visual humana → corrección si procede.

## Prohibiciones preservadas
- 0 merge main por A7.
- 0 deploy por A7.
- 0 voz/TTS.
- 0 grabación HOLD reutilizada.
