# Aclaración normativa · QA visual de tarjetas · R65 · 29/09/2026

Aplica al launcher del Taller y a futuras superficies de tarjeta equivalentes. No reabre arte aprobado salvo regresión.

## 1. Una tarjeta es una superficie completa también en estados de enlace

El texto interno no puede heredar estilos globales de `a:visited`, `a:hover`, `a:active` o similares que cambien color/subrayado de forma incoherente con el tema.

Deben quedar definidos y probados:
- link;
- visited;
- hover;
- focus-visible;
- active.

DARK NAVY y LIGHT deben mantener la misma jerarquía y contraste AA.

## 2. El tamaño contractual de QA debe ser exacto o reconciliado

Si una orden fija 240×150 CSS px como tamaño de revisión, la evidencia debe incluir ese tamaño exacto.

Si el producto real usa otro tamaño, no se sustituye silenciosamente el contrato: se documenta la medida real, se explica la divergencia y Astra decide qué tamaño queda canónico.

## 3. “Identificable sin título” requiere prueba sin título

Una matriz que declare `identificada_sin_titulo` no se autoacredita.

La revisión debe ocultar el nombre y comprobar a tamaño de producto que:
- la acción/proceso sigue siendo reconocible;
- no depende de copy para diferenciarse de otra tarjeta próxima;
- la identidad no proviene solo de color o de un icono genérico.

## 4. Captura fija no acredita interacción horizontal

Cuando filtros/chips desbordan horizontalmente en móvil, una captura no acredita accesibilidad.

Se debe verificar en navegador:
- desplazamiento/alcance de todas las opciones;
- teclado;
- foco visible/no oculto;
- táctil;
- 320/390;
- ausencia de trampa o contenido inaccesible.
