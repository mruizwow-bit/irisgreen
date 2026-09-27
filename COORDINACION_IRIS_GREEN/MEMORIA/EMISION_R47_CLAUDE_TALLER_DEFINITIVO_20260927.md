# R47 · Claude · Taller definitivo · auditoría + emisión · 27/09/2026

Issue operativo: #308  
Estado: `R47_CLAUDE_TALLER_ORDERED`

## Fuente auditada aportada por María

### R43_TALLER_CREATIVO_v2.patch.gz
SHA-256:
`72702ab39da1698fe09ca0903ececf3caa89d1a98963fb5617ff5e341aad7f72`

### COORDINACION_R43_R44_v2.patch
SHA-256:
`e0d8340ddd97ea5baaf552914a2e678b623bc82d387532cf9b2a366e57fa405e`

## Diagnóstico Astra

### 1 · Cobertura fragmentada
La portada pública llega a 27 estudios, pero la implementación interior se divide en:
- 13 estudios R43 suite;
- Dibujo como piloto distinto;
- 13 estudios legacy.

No existe una única generación de producto.

### 2 · Workspace-first incumplido
El generador R43 coloca antes de `#igt-app`:
- hero;
- “Qué puedes crear aquí”;
- “Cómo se usa”;
- pasos.

La ayuda aparece antes que la herramienta y contradice #285 + investigación R42. R47 mueve esos contenidos a drawer/dialog/sheet y exige workspace visible en primer viewport.

### 3 · Design R02 ausente
En los dos paquetes auditados no aparecen:
- `ig-r42-materials`;
- `IGPreferences`;
- `prefers-reduced-transparency`.

El uso del app shell R42 no equivale a integración del sistema material R02.

### 4 · Child-safe ausente
No aparecen:
- `SAFE_BY_DEFAULT`;
- `S2_HIGH_SENSITIVITY`;
- `discovery`;
- contrato `audience/sensitivity/discovery`;
- child-safe.

Las referencias `child/teen/adult` del Taller son solamente lente de etapa/contexto.

### 5 · Persistencia contradictoria
R43 documenta “sin almacenamiento en navegador” mientras la portada habla de proyectos guardados en dispositivo y el carril A5 usa IndexedDB.

R47 resuelve:
- memoria de pestaña por defecto;
- Save explícito a archivo;
- File System Access opcional tras gesto;
- persistencia local solo opt-in y reversible;
- OPFS/IndexedDB detrás de una única capa;
- etapa nunca persistida como perfil.

## Qué se conserva

R43 y PR #299 quedan como **donantes**, no como solución final.

Conservar cuando sean realmente superiores:
- Three/Pixi;
- Planck/Rapier con política CSP vigente;
- Blockly/CodeMirror;
- Tone/AudioWorklet;
- manipulación directa;
- presión de stylus;
- Arquitectura 2D/3D;
- motores creativos;
- exportadores;
- trabajo ES/EN válido.

## Arquitectura R47

27/27 estudios bajo cinco perfiles:
1. Lienzo/composición visual.
2. Construir/probar/espacial.
3. Línea de tiempo.
4. Bloques/código/ejecutar.
5. Documento/sistema de conocimiento.

Desktop:
topbar + Estructura + workspace + Inspector + zona contextual.

Móvil:
workspace primero + bottom dock + Estructura/Inspector como sheets mutuamente excluyentes.

## Child-safe

Se aplica al contenido curado/discovery de Iris Green, no al contenido privado creado por la persona.

Todo item discoverable debe poder declarar:
`audience[]`, `sensitivity`, `discovery`, `safe_variant_id`, `review_reason`, versión/fecha.

Sin selección:
`SAFE_BY_DEFAULT`.

Criterio de entrega:
0 items discoverables sin clasificación.

## R44

R44 permanece separado. No se construyen los 64 retos hasta matriz 64/64 + revisión Astra + decisión María. R47 solo prepara el sistema de retos para consumir esos metadatos.

## Gate

Claude debe publicar:
`R47_CLAUDE_TALLER_BASE_READ`

y entregar:
`R47_CLAUDE_TALLER_REBUILD_READY_FOR_ASTRA`.

Secuencia:
Claude → Astra → A2 → Deploy Preview → HUMAN QA María.

Orden completa:
`ORDENES/R47_CLAUDE_TALLER_DEFINITIVO/01_CLAUDE.md`.
