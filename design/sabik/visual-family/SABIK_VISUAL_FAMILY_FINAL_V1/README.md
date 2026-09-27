# SABIK_VISUAL_FAMILY_FINAL_V1_R2_1

Fecha: 20/09/2026  
Coordinación: Astra  
Agente: n.º 3 · Prototipos

## Estado

**SABIK_VISUAL_FAMILY_FINAL_V1_R2_1_READY**

R2.1 corrige exclusivamente la coherencia técnica y la reproducibilidad del paquete R2. Todos los activos visuales aceptados permanecen bloqueados y sin cambios.

## Sistema verbal congelado

**SABIK**  
**CLARIDAD INTELIGENTE.**  
**Una IA que adapta la información para que sea más fácil de entender y usar.**

Familia: **UNA MISMA ESENCIA · CUATRO PRESENCIAS**.

## Comando único de rebuild

Desde una extracción limpia de `SABIK_VISUAL_FAMILY_FINAL_V1_R2_1.zip`, ejecutar únicamente:

```bash
python scripts/rebuild_all_r2.py
```

Salida final esperada:

`REBUILD_ALL_R2_PASS`

No se debe ejecutar el antiguo orquestador R1. La lógica histórica R1 queda aislada dentro del paquete en `audit/legacy_r1/`.

## Qué comprueba el comando

1. `R1_VISUAL_ASSET_LOCK`: 54 masters/derivados/pruebas aceptadas de Matriz/Web/IA/Educa.
2. `R2_WORDMARK_VISUAL_LOCK`: 10 activos aceptados del wordmark T1 R2 y QA.
3. `SYSTEM_CONTENT_LOCK`: 5 archivos de paletas/tokens/documentación aceptados.
4. Regeneración del wordmark T1 R2 en 365×70, 730×140, 1460×280 y 2920×560.
5. Integridad SVG: sin raster/fuente embebidos, 5 paths y 59 nodos.
6. Manifest R2.1 completo y hashes válidos.
7. Código 0 únicamente si todos los gates pasan.

## Prueba desde extracción limpia

Ejecutada únicamente con el comando del README.

Resultado exacto:

```text
CAIROSVG_VERSION_PASS 2.8.2
R1_VISUAL_ASSET_LOCK_PASS 54 files
R2_WORDMARK_VISUAL_LOCK_PASS 10 files
SYSTEM_CONTENT_LOCK_PASS 5 files
VISUAL_LOCKS_PASS
WORDMARK_R2_BUILD_PASS
WORDMARK_R2_REPRODUCIBILITY_PASS
R1_VISUAL_ASSET_LOCK_PASS 54 files
R2_WORDMARK_VISUAL_LOCK_PASS 10 files
SYSTEM_CONTENT_LOCK_PASS 5 files
VISUAL_LOCKS_PASS
MANIFEST_R2_1_BUILD_PASS 111 files
MANIFEST_R2_1_VERIFY_PASS 111 files
REBUILD_ALL_R2_PASS
```

## Paquete R2.1

Biblioteca: `/SABIK/Agent3/SABIK_VISUAL_FAMILY_FINAL_V1_R2_1.zip`

SHA-256: `343ec6bab150d297150faa5299fc1c2f1e4c177e5a343cc4900e036f19fad57f`

Tamaño: `7,496,502 bytes`.

Manifest: **111 archivos**, excluyendo únicamente `MANIFEST.json` por autorreferencia.

## Confirmación visual

Comparación R2 → R2.1 sobre todos los PNG/SVG del paquete:

- baseline: 69 archivos visuales;
- modificados: 0;
- eliminados: 0;
- añadidos: 0;
- resultado: `VISUAL_ZERO_CHANGE_PASS`.

No se han modificado Presencia Matriz, Web, IA, Educa, siluetas, escalas, fondos, paletas, geometrías, wordmark T1 R2 ni QA visual.

**NO MERGE hasta revisión directa de Astra.**