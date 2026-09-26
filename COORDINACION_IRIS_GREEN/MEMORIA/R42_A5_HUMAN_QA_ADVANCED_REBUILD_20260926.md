# R42-A5 · corrección HUMAN QA y reconstrucción avanzada del Taller · 26/09/2026

## Decisión humana
María rechaza la calidad de producto de la entrega #292. La causa aceptada por A5 no es solo visual: R42 modernizó shell y capacidades, pero varios motores genéricos continuaban siendo rejillas/inputs/botones con un canvas adaptador, por debajo de la investigación tecnológica acordada.

#292 se conserva como base técnica histórica, no como aceptación final del Taller.

## Principios corregidos
- Tecnología visible en la creación, no solo detectada en infraestructura.
- Mantener los motores especializados profundos que ya existen (Dibujo, Estructuras, Circuitos, Programación, Robótica, etc.) y elevar los genéricos hasta ese nivel.
- Etapa = vista momentánea: Infancia · Adolescencia · Adultez · Cualquier edad.
- No pedir edad, no inferirla y no persistir la selección.
- La etapa cambia contextos/retos/propuestas, nunca bloquea herramientas avanzadas.
- ES/EN, accesibilidad y privacidad local se conservan.
- Ningún dato local se envía a Sabik/Cloud.

## Rama correctiva válida
Base actual A2 verificada:
- rama: `agent2/sabik-iris-r08-20260924`
- HEAD: `ab952077464b1348d3da88ee974f9375b3458bc9`

Rama:
- `agent5/r42-a5-advanced-workshop-on-a2-20260926`
- PR: #299
- HEAD inicial del PR: `f0ed2a93386b436a74808b555d7f047b8a2b7c8f`
- compare al abrir: 8 commits ahead / 0 behind / 8 archivos
- mergeable observado tras creación: true

## Primer incremento construido
1. La etapa deja de usar sessionStorage.
2. La portada cambia contextos visibles de cada estudio según la vista elegida.
3. Nuevo motor `assets/ig-taller-r43-advanced.js` para:
   - Pixel Art;
   - Arquitectura;
   - Videojuegos;
   - Simulación;
   - Ritmo;
   - Composición;
   - Mundos;
   - Juegos de mesa;
   - Arte generativo.
4. Arquitectura: plano directo + vista volumétrica simultánea.
5. Videojuegos: edición directa + modo jugable.
6. Ritmo/Composición: secuenciador/piano-roll con audio.
7. Dibujo especializado: presión de stylus progresiva, manteniendo ratón/táctil/teclado.
8. Nuevo CSS de workspace creativo oscuro y de alto contraste para las superficies.
9. Nuevo gate `scripts/test_r43_a5_advanced_taller.js`.

## Hallazgos de auditoría
- El selector de etapa de R42 era casi cosmético en la portada: no cambiaba realmente las propuestas.
- La etapa se persistía en sessionStorage; se elimina.
- WebGPU se detectaba como capacidad pero no participaba en una herramienta creativa.
- Varias familias usaban canvas como adaptador de clics sobre cuadrículas antiguas.
- Los motores especializados antiguos son más profundos de lo que la capa R42 mostraba; no deben sustituirse indiscriminadamente.

## Validación pendiente
No hay workflow automático asociado todavía al HEAD #299. No declarar CI SUCCESS.
A2 debe ejecutar test/build/browser QA al integrar.
HUMAN QA final de María sigue siendo obligatoria.

Estado: `R42_A5_HUMAN_QA_PRODUCT_REBUILD_IN_PROGRESS`.
