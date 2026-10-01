# VIDEOTECA R06 · INTAKE Y BLOQUEADOR GLOBAL

Fecha: 01/10/2026
Autoridad: María
Coordinación: Aura
Vector intake: #356
Shared controls: #357

## Entrega

ZIP:
IRIS_VIDEOTECA_ENTREGA_R06.zip
SHA-256:
4231f7d3b666240d42ccd4f78c64d3de3bd98860fbc4497711f72ed0ef3ed28f

Auditoría:
IRIS_VIDEOTECA_AUDITORIA_R06.xlsx
SHA-256:
db8bd6bb8c79865ce6381dbf83af3a87e14cf21104136805b1878e99b29c0daa

## Verificación Aura

- auditoría acumulada: 171 candidatos;
- tanda R06: 3 ACEPTAR / 2 REVISAR / 1 RECHAZAR;
- catálogo: 122;
- S0/S1/S2: 112/8/2;
- build_datos.py: PASS, 122;
- build_en.py: PASS;
- barrido_colores.py: PASS;
- QA browser Playwright no repetida en Aura por browser Playwright ausente; no se inventa PASS.

## Base

Paquete:
e48b51814afed825a92e83a2f6e51ee8a1c85e45

A2 observado:
8ea50128b490207b4dd5508c3c46692f5be69c87

A2:
486 commits ahead.

Estado:
VIDEOTECA_R06_REBASE_REQUIRED

No copiar subir/ directamente.

## KEEP en rebase

- 122 vídeos;
- auditoría previa a incorporación;
- protección S0/S1/S2;
- safe-by-default;
- S2 fuera de infancia;
- mensaje explícito de vídeos delicados ocultos;
- sin DOB/cuenta/perfil;
- ES→EN generado;
- aria-pressed basado en estado;
- no external requests antes de play;
- tokens globales.

## Bloqueador global

A2 assets/controles-comunes.css:
blob e424f09d38ecfa7b368e8b9a796dfcab6ba73644

Confirma colores hardcodeados con !important en filtros/search/paneles.

Owner:
Prisma #357.

Validación:
Axioma.

Integración:
Vector #356.

## Corrección semántica

No usar primary-fg para chip inactivo en dark.

Inactivo:
button-secondary-bg + button-secondary-fg
o surface + text según contrato final de Prisma.

Activo:
button-primary-bg + button-primary-fg.

Focus:
ig-focus.

## Gate

GLOBAL_SHARED_CONTROLS_TOKENS_PASS_READY_FOR_VECTOR

Después:
Videoteca rebase + browser QA + preview.

No main.
No producción.
