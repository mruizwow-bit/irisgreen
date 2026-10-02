# LUMEN · B01 SISTEMA SOLAR · FUNDACIÓN VISUAL FIRST-PARTY

Fecha: 02/10/2026
Owner: **Lumen · A7**
Issue programa: #370
Entrada:
`INTEREST_02_SOLAR_VISUAL_FACTUAL_ASSET_BRIEF_PASS`

Salida:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_READY_FOR_REVIEW`

## Scope ejecutado
Solo:
- Sol;
- Mercurio;
- Venus;
- Tierra.

No:
- Marte;
- Júpiter;
- Saturno;
- Urano;
- Neptuno;
- lunas;
- runtime;
- integración.

## Contrato
Los 4 masters son:
`NEW_FIRST_PARTY_MASTER + REPRESENTATION`

No son observación/fotografía ni estado actual.

Etiqueta pública:
- ES: `Imagen hecha por ordenador`
- EN: `Computer-made image`

## Masters

| cuerpo | archivo | estado | SHA-256 |
|---|---|---|---|
| Sol | `b01_sol_master_r03.png` | `BASE_NEUTRAL_VISIBLE_LIGHT` | `53b04c7aa84fdb42e3235f52286f2b2082d5eb96b89e2bbddc882ba22d065f63` |
| Mercurio | `b01_mercurio_master_r03.png` | `BASE_NEUTRAL` | `02fee8d50e74b904e1765d79a3c0a52ef5821fa49cdfcdfd264f530cd24613e8` |
| Venus | `b01_venus_master_r03.png` | `BASE_CLOUD_TOPS_NEUTRAL` | `898a591f2de61d53dc3ab108ba30b17af423ab69397f8f89e0ee149d72aa08b8` |
| Tierra | `b01_tierra_master_r03.png` | `BASE_DAY_NEUTRAL` | `5dc40cdabc89b44e75abd0e26d3d961c53e26a118957fd0ea1b5ba54595de25f` |

Todos:
- 1536×1536;
- PNG RGBA;
- alpha;
- sRGB ICC;
- bbox alpha común;
- disco completo;
- un cuerpo;
- sin texto/fondo espacial;
- sin escala relativa horneada.

## Factual visual

### Sol
KEEP factual:
- self-luminous;
- blanco/blanco cálido muy pálido;
- granulación sutil;
- sin corona permanente;
- sin llamas.

### Mercurio
KEEP factual:
- gris-parduzco;
- craterizado;
- sin atmósfera visible;
- crater layout = representación, no cartografía.

### Venus
KEEP factual:
- crema/marfil;
- cobertura nubosa global;
- superficie completamente oculta;
- sin radar/UV false-color como natural.

### Tierra
KEEP factual:
- África + Europa + Atlántico;
- océano azul dominante;
- geografía reconocible;
- nube genérica;
- halo atmosférico azul muy fino;
- no meteorología actual.

## Proceso y provenance

Los intentos exploratorios iniciales con generación de imagen se descartaron porque agrupaban los cuatro cuerpos o incumplían hemisferio/color/alpha.

Masters finales:
- render procedural propio;
- seeds/config documentados;
- no donor pixel copy;
- Earth usa Natural Earth lowres public-domain geometry como scaffold factual, no como imagen final;
- renders y composición final = Iris Green.

Library:
`/Iris Green/First Party Visual/B01 Solar Foundation/`

Soporte:
- contact sheet;
- direction;
- config;
- provenance;
- manifest.

## Review

El contact sheet está listo para HUMAN/product visual review.

Estado:
`READY_FOR_VISUAL_REVIEW`

No Atlas todavía.
No B02/B03.

STOP Lumen después del gate.
