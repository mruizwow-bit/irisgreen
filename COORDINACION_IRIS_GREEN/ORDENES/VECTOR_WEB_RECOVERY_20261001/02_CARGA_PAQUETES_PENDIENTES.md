# VECTOR · P0 · CARGA DE PAQUETES PENDIENTES · 01/10/2026

Issue: #356
Autoridad: María
Coordinación: Aura
Estado: VECTOR_P0_APPROVED_PACKAGE_INTAKE_REQUIRED

## Regla

La recovery preview no puede cerrarse con una web reparada pero incompleta.

Vector debe:
1. reparar integración;
2. importar/preservar paquetes aprobados pendientes;
3. integrar los que estén READY_FOR_INTEGRATION;
4. verificar que los ya integrados sobreviven;
5. mantener HOLD de paquetes aún no aprobados;
6. construir la preview después.

## INTEGRAR AHORA

### R65 · Taller 27 + 9 AGE_0_12
Estado producto:
R65_TALLER_27_PLUS_9_HUMAN_APPROVED_FOR_R67_INTEGRATION

Integración:
READY_FOR_INTEGRATION

Acción:
- localizar handoff exacto;
- verificar assets/hashes;
- integrar en R67 Fase 3;
- AVIF/WebP reales;
- IGAudience;
- shell global;
- child-safe;
- no fixture R64;
- no reabrir arte.

## IMPORTAR / PRESERVAR AHORA

### R62-P03 · Juegos · Rutas de luz
Estado:
R62_P03_R3_HUMAN_APPROVED_UNLOCK_P04_CONCEPT

Integración:
PRODUCT_APPROVED_IMPORT_PENDING

Bundle R3:
- SHA-256 bc4579db5680e9719348e817d1fdbcafcfff2aa3478bffb62fc1f253a0e2de60
- prerequisite 318a5745789922b82e96bfaebd1536cac240a43e
- HEAD 706a9a671e9f2c6729fa977b4cb9c860c3f5b2c5

Cadena posterior declarada:
- bundle SHA-256 2f61695b23258409673f072f18104fbf7a48e83e7a526c2d864188e89c175f6e
- HEAD 2e559991762aca18b7c62f65f4df83ecfbee519b

Vector debe:
- localizar bundle material;
- determinar cadena final;
- importar con prerequisite;
- git bundle verify;
- repetir tests;
- preservar rama remota;
- separar P03 cerrado de P04 en curso.

No reabrir P03.

## YA INTEGRADOS · NO DUPLICAR

### R63 · Sakura
INTEGRATED_A2.

### R54/R47 · Taller KEEP6
INTEGRATED_A2.

Solo verificar no-regresión durante recovery.

## HOLD HASTA GATE

### R44-A0 · Taller retos
Construcción Claude activa.
No integrar hasta marcador final + review/HUMAN QA.

### R62-P04 · Ritmo de colores
E4 autorizado, construcción pendiente.
No integrar hasta gate.

### R68 · Faroles
R3 pendiente.
No integrar.

### R59 · Fósiles
QA/GOV final pendiente.
No integrar.

### R61 · Pecera
QA final pendiente.
No integrar.

### R42-CONTENT
REBASE_REQUIRED.
No aplicar ZIP stale.

## Inventario obligatorio

Antes de READY:
ID · paquete · hash/HEAD · estado previo · acción · destino · evidencia.

Debe demostrar:
- 0 READY_FOR_INTEGRATION omitidos;
- 0 NOT_READY activados;
- 0 duplicaciones de paquetes ya integrados;
- preview construida después del intake aprobado.

## Gate

VECTOR_IRIS_GREEN_RECOVERY_AND_APPROVED_PACKAGES_PREVIEW_READY_FOR_ASTRA_AURA_MARIA

No main.
No producción.
