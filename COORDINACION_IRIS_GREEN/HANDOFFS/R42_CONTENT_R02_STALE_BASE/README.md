# HANDOFF PRESERVADO · R42 CONTENIDO R02 · BASE STALE

Fecha de registro: 30/09/2026  
Issue: #302

## Identidad del paquete

Archivo recibido:
`iris-green-contenido-R42-20260929(2).zip`

SHA-256 verificado:
`aa3649a821da1226dd84bda70f35ee8c8e286cb81c1bd5711af97e71761e8961`

Tamaño:
`2.027.550 bytes`

Entradas ZIP:
`482`

El hash coincide exactamente con el paquete R42 ya auditado anteriormente:
`iris-green-contenido-R42-20260929.zip`.

No es una revisión nueva.

## Base declarada por Claude

- rama: `agent2/sabik-iris-r08-20260924`
- HEAD base: `9c721a793060979903e77c31b69c8c01cac49c92`
- candidato local: `claude/r42-contenido-rebase-20260929@2eb4d887`

## A2 vivo al revalidar

HEAD:
`8ea50128b490207b4dd5508c3c46692f5be69c87`

A2 está **51 commits por delante** de la base del paquete.

Entre esos cambios existen:
- R63 Sakura;
- R67 shell global;
- R67 Taller;
- cambios de child-safe;
- cambios de tokens/chrome;
- cambios Sabik;
- `scripts/build_site.py` modificado.

Solape directo detectado entre archivos del paquete y ficheros modificados desde su base:
- `scripts/build_site.py`.

Por tanto:
`DO_NOT_OVERLAY_PACKAGE_AS_IS`.

## KEEP del paquete

Conservar para el rebase:
- 204 HTML nuevos;
- inventarios objetivo;
- Investigación 132;
- contenido editorial y correcciones jurídicas/médicas;
- audit_inventario;
- FUENTES.csv;
- cambios de audience-surface;
- tests específicos;
- pares ES/EN;
- safe handling de TEPT complejo.

## Correcciones obligatorias antes del siguiente candidato

1. Rebase/regeneración sobre HEAD A2 vivo inmediatamente anterior a integrar.
2. Preservar todos los pasos R67/R63 actuales de `build_site.py`.
3. Repetir baseline vs candidato sobre ESA base.
4. Corregir trazabilidad:
   - Memoria afirma `fuentes.json` de 60 entradas, pero ese archivo no existe en el ZIP;
   - el registro entregado real es `FUENTES.csv` con 60 URL distintas.
5. Documentar delta R01 66 URL → R02 60 URL.
6. Corregir la fecha NHS:
   - publicado 16/11/2023;
   - actualizado 16/09/2024.
7. WHO Gaming disorder FAQ:
   - la página visible actual no muestra fecha de publicación;
   - mantener “sin fecha visible” + fecha de consulta, salvo fuente oficial que date ESA misma FAQ.
8. Reconciliar deuda URL clasificación:
   - 71 campos relativos en Data;
   - 132 `/en/research/`;
   - 262 `/en/support-directory/`;
   - total = **465 campos URL anómalos**;
   - 204 strings crudos distintos.
   No volver a declarar 405 sin explicar un criterio diferente.

## Estado

`R42_CONTENT_R02_VERIFIED_SAME_PACKAGE_CURRENT_A2_REBASE_REQUIRED`

No main.
No producción.
No aplicar ZIP tal cual.
