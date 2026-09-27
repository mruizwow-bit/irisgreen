# Emisión de dos carriles paralelos · Home child-safe + Cloud Sabik · 27/09/2026

## Decisión de María

La voz Sabik ES/EN continúa entrenándose en su carril propio.

Se abren dos agentes nuevos para avanzar en paralelo sin solapamiento:

### A8 · Home + child-safe
Issue: #305  
Estado inicial: `R42_A8_HOME_CHILD_SAFE_ORDERED`

Construye la nueva Home de Iris Green sobre el baseline A2/R42/R02 e implementa child-safe real contra la nueva web. Consolida la implementación nueva sin reactivar los parches viejos #294–#297.

A2 sigue siendo única puerta web. HUMAN QA de María sigue siendo obligatorio.

### A9 · Biblioteca Cloud Sabik
Issue: #306  
Estado inicial: `R39_A9_SABIK_CLOUD_LIBRARY_ORDERED`

Construye el sucesor bilingüe/versionado de la biblioteca R38/R39 en Cloud, reutilizando el acceso y el sitio privado `sabik-asistente`. R38 permanece inmutable. La recuperación incorpora metadatos child-safe y no puede devolver full S2 fuera del contexto autorizado.

## Separación dura

A8 NO toca:
- Cloud;
- voz;
- audio;
- Taller/R44;
- Rincón audiovisual.

A9 NO toca:
- Home;
- frontend A2;
- voz/audio;
- copy de producción;
- motores de producto;
- main/producción.

## Baselines observados

A2 PR #244 HEAD al emitir: `bf44d6ae7aa362b81fadb16b44bdef358cc31bcc` (A8 debe releer antes de ramificar).

Cloud R06 privado: `6ab7a2cd2cf8dc09d3ae9aca`.

## Precedencia

- #305 gobierna la nueva implementación Home/child-safe.
- #294–#297 permanecen históricos/pausados y no se aplican como parches al baseline nuevo.
- #306 gobierna la evolución de biblioteca Cloud; no reconstruye ni sobrescribe R38.
- voz Sabik continúa fuera de ambos carriles.
