# R42 · CONTENIDO R02 · REBASE FINAL SOBRE A2 VIVO

Fecha: 29/09/2026  
Issue: #302  
Responsable: Claude · contenido web  
Revisión: Astra / Aura  
Integración posterior: A2  
Aceptación final: HUMAN QA María

Estado:

`R42_CONTENT_R02_AUDITED_CURRENT_A2_REBASE_REQUIRED`

## Entrada auditada

ZIP:
`iris-green-contenido-R42-20260929.zip`

SHA-256:
`aa3649a821da1226dd84bda70f35ee8c8e286cb81c1bd5711af97e71761e8961`

Base usada por Claude:
`agent2/sabik-iris-r08-20260924@9c721a793060979903e77c31b69c8c01cac49c92`.

El contenido y la dirección de adaptación se conservan, pero el artefacto ya no es aplicable directamente porque A2 avanzó mientras se cerraba la entrega.

## A2 vivo

HEAD observado al auditar:
`2fcb193feaecaa6934e96c14e0eda06d016d0250`.

Está 5 commits por delante de `9c721a79`.

Entre esos commits A2 añadió:
- shell R67 de Taller;
- sus pruebas;
- cambios en `scripts/build_site.py`;
- ajustes Sabik relacionados.

El ZIP también contiene `scripts/build_site.py`. Aplicarlo como overlay sobre el HEAD vivo perdería la incorporación posterior de Taller.

## KEEP del R02

No rehacer desde cero:
- 204 HTML / 102 pares ES-EN;
- 226 Condiciones;
- 223 Situaciones;
- 62 Vida diaria;
- 60 Datos;
- 132 Investigación;
- 262 ayudas ES;
- correcciones jurídicas y médicas;
- guardarraíl `audit_inventario.py`;
- manifest de inventario exacto;
- taxonomía AGE canónica consumida desde A2;
- child-safe y safe variants;
- `global-395` TEPT complejo S2;
- audience surface sin valores legacy;
- regeneración de índices/search/sitemap;
- 0 fallos nuevos declarados respecto de la base usada.

## Rebase obligatorio

Releer HEAD A2 inmediatamente antes de trabajar.

Rebasar/reconstruir el paquete sobre ese HEAD sin:
- borrar shell R67 de Taller;
- restaurar una versión anterior de `build_site.py`;
- duplicar la clasificación 965/965 que ya pertenece a A2;
- tocar otros carriles.

El nuevo `build_site.py` debe conservar simultáneamente:
1. R67 Taller shell + tests;
2. `audit_inventario.py`;
3. Investigación 132;
4. child-safe antes de discovery;
5. R51 audience/discovery;
6. todos los pasos A2 posteriores que existan al rebase.

## QA después del rebase

Repetir sobre la nueva base:
- build completo;
- `audit_inventario.py`;
- R51 age/audience/discovery;
- child-safe;
- Investigación deferred/no-JS;
- `test_web.py`;
- comparación baseline intacta vs candidato.

Requisito:
`NEW_FAILURES = 0`.

No heredar como evidencia los 38 fallos medidos sobre `9c721a79`; hay que volver a medirlos sobre la nueva base.

## Fuentes

Corregir trazabilidad:
- NHS England OSA: publicado 16/11/2023, actualizado 16/09/2024;
- WHO Gaming disorder FAQ: sin fecha visible en la página actual; conservar fecha de consulta y NO usar la noticia separada de 14/09/2018 como fecha de la FAQ.

R01 auditó 66 URL distintas; R02 entrega 60. Documentar el delta 66→60.

La Memoria R02 menciona `fuentes.json`, pero ese archivo no está en el ZIP. Incluirlo si es fuente de reproducción o corregir la Memoria para señalar `FUENTES.csv`/fuentes materializadas.

## Clasificación · deuda de rutas

No modificar la taxonomía ni reclasificar 965/965 en este carril.

Sí corregir la documentación del conteo:
en la clasificación A2 observada hay 465 campos URL anómalos:
- 71 relativos;
- 132 `/en/research/`;
- 262 `/en/support-directory/`.

Son 204 strings crudos únicos. Si se usa otra métrica, declararla explícitamente antes de volver a decir “405”.

La reparación de las rutas pertenece al propietario de clasificación/A2 salvo reasignación.

## Gate

Marcador de salida:

`R42_CONTENT_R01_REBASED_CHILD_SAFE_READY_FOR_ASTRA`

solo después de:
- rebase sobre A2 vivo;
- QA repetido;
- trazabilidad corregida;
- nuevo ZIP/hash/base/HEAD.

STOP para Astra.

Contenido adicional nuevo: HOLD.  
A2 integración del ZIP actual: HOLD.  
No main.  
No producción.

## Normativa

No cambia normativa transversal. Consumir los canónicos vigentes de ES/EN, child-safe, AGE_*, tokens, low-stimulation, WCAG/COGA/ISO/EN y publicación.
