# R44 · A0 · R2 · handoff · 30/09/2026

Marcador: `R44_A0_FRAMEWORK_8_PILOTS_R2_READY_FOR_ASTRA_AURA_MARIA` · issue #319.

Responde a `R44_A0_REVIEW_AURA_R2_REQUIRED_20260930.md`. El framework tenía PASS
técnico y no se rehace.

## Los siete bloqueos, uno a uno

**1 · ES/EN incompleto — corregido.** Los ocho `en.alternativa` estaban vacíos y
`artefacto` era un único string en español que se renderizaba también en inglés.
Ahora hay `artefacto_es` y `artefacto_en`, y la alternativa existe en los dos
idiomas. Medido en las 16 páginas: el artefacto sale en el idioma de la página.

**2 · Contrato visual — corregido.** Cada piloto lleva su mini-escena, que enseña
lo que sales llevando: la taza de un solo trazo, la baldosa repetida en 3×3, la
celosía del puente con su camión y las flechas de compresión y tracción, el
semáforo con sus resistencias y su tabla, la tarjeta de cincuenta palabras con el
contador, el tablero con sus cartas, la rejilla de cuatro compases con los
acentos, y el nivel con su bandera. Trazo en `currentColor`, así que valen en
LIGHT y en DARK NAVY sin declarar un color, más bloque de `forced-colors`.

La primera escena de `E01` era una espiral abstracta y **contradecía su propio
criterio**, que pide un dibujo reconocible. Rehecha como una taza.

**3 · CTA — corregido.** Antes solo movía el estado de 0 a 1. Ahora lleva el foco
al sitio donde se trabaja y emite `ig:r44-reto` con `{id, estudio, fase}`, para
que el motor pueda cargar un punto de partida. Sigue sin puntuación.

Detalle que costó una corrección: el lienzo solo es enfocable cuando su rol es
`application`, así que en los estudios de texto el destino correcto es el editor.
Con el primer respaldo, Escritura se quedaba en el botón: 14 de 16. Ahora 16 de 16.

**4 · Patch aislado — corregido.** `R44_A0_R2_AISLADO.patch.gz` y su `.bundle`
llevan **2 commits y 4 ficheros**, todos R44, sobre `a8bd0e2a`. Ya no hay cadena
histórica. (En la entrega anterior el aislado sí existía, `R44_A0_SOLO.patch.gz`,
pero se revisó el de producto; ahora entrego solo el aislado para que no haya
ambigüedad.)

**5 · Age gate global — retirado.** `assets/ig-audience.js` ya no aparece en el
patch. R44 consume el contrato global y no lo reemplaza.

**6 · Starter — corregido.** Se retira `starter_stage: AGE_0_12` de los ocho.
Queda `ALL_AGES` hasta que exista una variante infantil aprobada.

**7 · Logs brutos — adjuntos.** En `R44_A0_R2_LOGS_BRUTOS.tar.gz` y en
`EVIDENCIAS/R44_A0_R2_CLAUDE_20260930/logs/`.

## Rama, base, árbol, paquetes

- rama: `claude/taller-creativo-r43-20260926`;
- base: `a8bd0e2acac41af278567d1f7531e94cb4ff9ba0`;
- HEAD: `2024aeee6e0f634401e090fa2d999fd7d67062f4`;
- tree: `7f2f5136834b00f80480b51baf12db7722a2b614`.

| Paquete | SHA-256 |
|---|---|
| `R44_A0_R2_AISLADO.patch.gz` | `9f6f3d2ecaa76a49563ea5ce04e8e261e1362873e14e077fc2cf35271871ea98` |
| `R44_A0_R2_AISLADO.bundle` | `e73da9cd51dae5d3a6edbbd3c970e12a13e69396841ee8bf1e7ffdc675fd1d34` |
| `R44_A0_R2_LOGS_BRUTOS.tar.gz` | `7d31e096d38e9b5c2fff11c36a236f65d9f2cb06f4e19df7664673e4a7140ff3` |

Ficheros del patch: `assets/data/r44-retos.json`, `assets/ig-r44-retos.js`,
`assets/ig-r44-retos.css`, `scripts/build_taller_suite.py`. Verificado que aplica
limpio sobre la base.

## Lo medido tras los cambios

16 páginas —8 estudios × ES/EN—, los dos temas:

- DARK NAVY 16/16 y LIGHT 16/16 sin problema;
- mini-escena presente en las 16; artefacto en el idioma de la página;
- axe-core sobre el panel, WCAG 2.0/2.1/2.2 A y AA: **0 infracciones** en ambos;
- evento `ig:r44-reto` emitido en las 16; foco entra al taller en 16/16;
- reflow 320, 390 y 1440 con y sin movimiento reducido: **30 combinaciones, 0
  desbordes**, botón 44 px.

## Lo que NO he podido hacer, y por qué

**El rebase contra la base Taller/R67 vigente no es posible desde esta sesión.**
El remoto que alcanzo solo tiene ramas `agent1`–`agent7` y `agent2/sabik-iris-r08`;
no hay rama R67 ni la A2 viva. Mi base sigue siendo `e1b858df`.

Consecuencia honesta: **la evidencia de móvil está tomada sobre la base anterior
al shell global actual**, así que las colisiones de header que la revisión vio a
390 no se pueden descartar ni confirmar desde aquí. No toco header ni nav global,
como manda la regla. Para cerrar eso hace falta que el carril se reconcilie sobre
la base vigente, o que esa base sea alcanzable desde esta sesión.

No registro `R67_GLOBAL_SHELL_BLOCKER` porque no puedo comprobar si la colisión
persiste en la base vigente, y registrar un bloqueante sin medirlo sería
exactamente lo que la política llama afirmar una verificación no ejecutada.

## Límites

No escalar a los 55. No reabrir R65. No A2. No main. No producción. Sin CSP, sin
Permissions-Policy, sin almacenamiento nuevo. Sin push: 403, se entrega como
parche y bundle.
