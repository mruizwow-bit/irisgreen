# R64 · A2 · TALLER R54 · INTEGRAR 6 TARJETAS + DEPLOY PREVIEW

Fecha: 29/09/2026  
Issue: #329  
Responsable: Agente 2  
Fuente: `R54_CLAUDE_6_CARDS_HANDOFF_R2_VERIFIED_READY_FOR_A2`  
Aceptación visual de entrada: `R54_6_CARDS_HUMAN_APPROVED_FOR_A2_PREVIEW`

## Regla de aceptación

María autoriza integrar y subir a Deploy Preview.
NO es aceptación final.
El OK final solo existe tras ver/probar la preview real.

## Handoff

`R54_HANDOFF_A2_R2.zip`  
SHA-256:
`6d23b00e4f2f5fdb2c92c0bec486d4582e03f2ea44ed7eeab037510b2751066f`

Extraer limpio:
`sha256sum -c HASHES.txt` → 36/36 OK · exit 0.

## Base

Releer HEAD/tree vivo.
No resetear a main ni a bases Claude.
No aplicar commits a ciegas.
Reconciliar.

## Arte

KEEP 6/6. No rerender/rediseño/recolor.

## Tokens

Única fuente final:
`assets/ig-global-ui-tokens-2026.css`

No integrar segunda hoja global.
DARK NAVY inicial. LIGHT alternativa.
El arte no se recolorea por tema.

## Taxonomía

Salida canónica:
`AGE_0_12 / AGE_13_17 / AGE_18_PLUS / ALL_AGES`

Legacy URLs solo entrada temporal mediante una única tabla/función de compatibilidad.
Preservar deep links.
No mantener dos taxonomías.

## Shell

Conservar Home v4/header/Accesibilidad/Música/navegación/tema/layout vigentes.
El Taller entra dentro del shell actual.

## QA

Repetir sobre HEAD integrado:
- qa/taxonomia_edad.py
- qa/t_r54_r2.py
- qa/t_home54.py
- qa/t_tema_inicial.py
- qa/pagina_qa_seis_tarjetas.html
- qa/csp_server.py
- scripts/check_escenas_sync.py
- scripts/prueba_sync_escenas.sh

Verificar ES/EN, 1920/1440/390/320, DPR1/2, 4 bandas, DARK inicial, LIGHT explícito, 0 imágenes rotas, 0 alt faltantes, srcset, 0 overflow, 0 404, sin regresiones axe atribuibles, sin #FFFFFF extenso.

## Deploy

Si PASS:
Deploy Preview únicamente.

Marcador:
`R64_A2_6_CARDS_DEPLOY_PREVIEW_READY_FOR_MARIA`

STOP para HUMAN QA María.

No main. No producción. No escala 21+9 antes del OK final.

## Normativa

No cambia normativa transversal. Consumir sin modificar:
- `IRIS_GREEN_VISUAL_STANDARD_SEP_2026`;
- `IRIS_GREEN_AGE_TAXONOMY_2026`;
- `IRIS_GREEN_LOW_STIMULATION_SURFACES_2026`;
- `IRIS_GREEN_GLOBAL_UI_TOKENS_2026`;
- R42/R02;
- marco WCAG/ISO/EN/COGA;
- ES/EN.

La orden operativa completa y bloque normativo están también en #329.
