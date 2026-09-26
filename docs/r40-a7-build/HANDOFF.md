# R40-BUILD-A7 · handoff a A2

Issue: #264
Base obligatoria: `freeze/r40-a2-web-baseline-20260926@52e5f9f02184581a1bfb1878c388ede3d1068c47`.

## Estado
`R40_RINCON_AV_BUILD_READY_FOR_A2`

## Delta de producto
- `es/sitio-tranquilo/index.html`
- `en/quiet-space/index.html`
- `assets/rincon-calma.js`
- `assets/rincon-sonidos.js`
- `assets/rincon-pulpos.js` (nuevo)
- `assets/rincon-r40-av.js` (nuevo)
- `assets/rincon-r40-av.css` (nuevo)
- `tools/test-r40-rincon-av.js` (nuevo test estático)

## Entregado
- 8 escenas existentes conservadas y mejoradas.
- Escena nueva Pulpos first-party Canvas2D con paisaje submarino, sin vocalización animal.
- 9 sonidos de escena first-party/sintetizados; ninguna grabación HOLD entra en la composición R40.
- CTA explícita ES/EN: Ver y escuchar / Watch and listen.
- Solo imagen, Silenciar, Volumen y Parar.
- Crossfade visual y fade de audio usando el ciclo común del Rincón.
- Reduced motion: el arranque fuerza la velocidad más baja y el motor existente aplica reducción adicional; transición visual se elimina con la preferencia.
- Fallback sin WebGL: poster + texto para las escenas WebGL; Acuario/Tubo/Pulpos tienen Canvas2D.
- Las grabaciones históricas HOLD se ocultan de la UI R40; permanecen en el repositorio sin reutilizarse.
- Controles/estado ES y EN equivalentes.

## Ajuste de ambientes
- Mar: oleaje sintetizado reducido.
- Acuario: agua filtrada + burbujas.
- Tubo: burbujas más graves.
- Medusas: ambiente submarino estable y bajo.
- Fibra: pads a nivel mínimo.
- Lluvia: lluvia sintetizada sobre cristal; sin truenos.
- Río: corriente + viento suave + aves muy lejanas.
- Noche: grillos/viento/pad reducidos; sin evento automático.
- Pulpos: ambiente submarino bajo; sin “canto de pulpo”.

## Precheck A7
46/46 comprobaciones estáticas PASS:
- sintaxis JS;
- 9 escenas ES/EN;
- controles y CTA;
- rutas de fallback;
- reduced motion;
- audio first-party;
- ausencia de rutas de grabaciones históricas en el controlador R40;
- ciclo común de audio para Pulpos;
- lifecycle/stop de Canvas2D.

Esto **no sustituye** la QA real pedida en #264: A2 integra sobre su HEAD vigente y A1/QA escucha/prueba en la web.

## Integración
A2 debe aplicar este commit/delta sobre su HEAD vigente, preservando cambios posteriores al freeze. No retroceder a la base congelada y no resolver conflictos a ciegas.

No merge a main ni deploy de producción por A7.
