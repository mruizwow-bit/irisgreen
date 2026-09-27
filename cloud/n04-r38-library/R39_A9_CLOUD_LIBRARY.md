# R39 A9 · Biblioteca Cloud bilingüe y child-safe

Fecha: 2026-09-27. Issue: #306.

## Alcance

Incremento server-only sobre R38/R39/R06 para `sabik-asistente`. No reemplaza ni reescribe R38. La identidad histórica permanece: 4.332 fragmentos, versión `n04-es-20260916-56f72c4d3959`, SHA-256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`.

A9 crea claves nuevas bajo `cloud-library/`, una Function QA nueva y una versión separada ES/EN. No modifica `n04-library-qa`, `n04-team-transport`, Team Login, secretos, producción ni frontend.

## Fuente fijada

La entrada no se lee desde `main` en runtime. Se copió como snapshot inmutable desde `main@ad7ea66254be7be44d7e97b4ca19ae8ac42ba6b5` a `sources/a9-r01/` con blob Git y SHA-256 por archivo.

Incluye el contenido público disponible en esa instantánea:
- catálogo de Condiciones/Situaciones: 372 pares ES/EN;
- Datos: 49 ES + 49 EN;
- Vida diaria: 48 ES + 48 EN;
- Investigación: 120 registros con texto ES/EN.

El paquete R42 Design R02 de 965 registros descrito en coordinación no está materializado como archivos accesibles en el repositorio; A9 no lo reconstruye ni finge tenerlo. Esta release se basa exclusivamente en el snapshot público trazable anterior.

## Identidad y citas

Cada fragmento conserva `content_id`, `fragment_id`, `locale`, URL real, título, heading, texto fuente, tipo, estado editorial de la release, versión y hash de fuente, versión de biblioteca, audiencia, sensibilidad, discovery y vínculo a safe variant cuando existe. El estado original del JSON público también se conserva en `source_editorial_status`.

Las rutas ES/EN se mantienen separadas. Investigación EN cita la ruta pública real compartida `/es/investigacion/` porque no existe una ruta pública EN separada en el snapshot; no se inventa una URL.

## Child-safe

La clasificación S2 se aplica antes de construir el índice/ranking:
- `default`, `child` y `teen`: el índice no contiene full S2;
- `adult` sin intención explícita: tampoco contiene full S2;
- `adult` + `explicitIntent=true`: puede usar full S2;
- cada full S2 presente en esta fuente tiene una variante segura enlazada.

El snapshot contiene 15 temas S2 bilingües (30 fragmentos full S2) y 30 variantes seguras. El tema «TEPT complejo» listado en R42 no existe en esta instantánea pública y por tanto no se inventa ni se incluye.

No se solicita edad, fecha de nacimiento ni identidad.

## Almacenamiento

Se reutiliza el named deploy store `sabik-n04-corpus` en `us-east-2`, pero con nuevas claves:
- `cloud-library/versions/<version>/corpus.json`;
- `cloud-library/manifest.json`.

El sellado verifica sitio, Team Login, contexto no productivo y `published_at=null`; escribe corpus y después manifest mediante publicación inmutable, y realiza lectura fuerte posterior. No borra ni sobrescribe R38.

## Privacidad

Runtime sin persistencia de queries, respuestas o historial; sin proveedor/LLM/embeddings; errores sanitizados; `Cache-Control: no-store`. La retención de plataforma sigue siendo una evidencia separada y no se declara resuelta por ausencia de logs de aplicación.

## HTTP

La Function nueva es `POST /internal/n04/cloud-library/search`, protegida por Team Login y por el gate existente `N04_SMOKE_TOKEN`. El CI puede demostrar HTTP real no autenticado hasta el gate exterior; una respuesta HTTP de aplicación requiere una sesión legítima de miembro del equipo y no se sustituye por exportar cookies o leer secretos.
