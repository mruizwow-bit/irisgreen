# R40-A1 · Checklist reproducible y pendientes manuales R01

**Baseline:** `PENDING_A2_HANDOFF`  
**Uso:** aplicar después del handoff estable de A2 y repetir por fase P0→P5.  
**Estado inicial de todos los checks humanos:** `PENDING_MANUAL`.

## 0 · Identidad antes de probar

Registrar:

```text
phase:
base_sha:
candidate_head:
candidate_tree:
changed_files:
preview_or_local_url:
date:
tester:
```

Después de terminar toda la QA, volver a leer HEAD/tree. Si cambian, invalidar la ejecución.

## 1 · Matriz ES/EN × desktop/móvil

Repetir para cada patrón de UI nuevo/modificado:

| Caso | Idioma | Anchura | Estado |
|---|---|---:|---|
| L-D | ES | 1440 | PENDING |
| L-M | ES | 320 | PENDING |
| E-D | EN | 1440 | PENDING |
| E-M | EN | 320 | PENDING |

Comprobar en los cuatro:
- mismo objetivo y acciones;
- ningún texto ES residual en EN;
- labels/nombres accesibles;
- loading/vacío/error;
- foco tras abrir/cerrar/cancelar;
- sin contenido esencial recortado.

## 2 · Zoom nativo — HUMANO OBLIGATORIO

En navegador real, no sustituto page-scale:

1. abrir superficie afectada a 100%;
2. subir a 200%;
3. recorrer todo por teclado;
4. subir a 400%;
5. repetir recorrido;
6. verificar lectura, operación, foco, reflow, mensajes y controles.

Resultado por fase:

```text
200%: PENDING_MANUAL
400%: PENDING_MANUAL
evidence:
notes:
```

## 3 · Espaciado de texto

Aplicar simultáneamente:

```css
line-height: 1.5;
letter-spacing: .12em;
word-spacing: .16em;
paragraph spacing: 2em;
```

Verificar:
- texto no cortado;
- botones/labels no se solapan;
- contenido no desaparece;
- controles siguen operables;
- 320 px sigue siendo usable.

## 4 · Teclado y foco

Sin ratón:

1. entrar desde el inicio de la superficie;
2. Tab/Shift+Tab por todos los controles;
3. activar con Enter/Espacio según control;
4. abrir/cerrar filtros progresivos;
5. abrir/cerrar visor/modal/panel;
6. cancelar y volver;
7. borrar cuando proceda;
8. comprobar dónde queda el foco.

FAIL si:
- hay trampa;
- el foco desaparece;
- salta sin causa a otra región;
- vuelve al body cuando existe invocador lógico;
- un control solo funciona con puntero.

## 5 · Colores forzados

Con forced colors activo:

- foco visible;
- selección visible;
- controles distinguibles;
- estados no dependen solo de color;
- texto y bordes esenciales perceptibles;
- no desaparecen botones por fondos transparentes.

**Estado inicial:** PENDING_MANUAL.

## 6 · Reduced motion

Con `prefers-reduced-motion: reduce`:

- no desaparece ninguna función;
- el cambio de estado sigue siendo comprensible;
- no hay movimiento esencial como único canal;
- Rincón conserva mute/volumen/solo imagen;
- los cambios de escena no producen transición visual brusca añadida por el modo reducido.

## 7 · 44 px

Automatización requerida sobre todos los controles R40 nuevos/materialmente modificados:

```text
boundingBox.width >= 44
boundingBox.height >= 44
```

Registrar excepciones solo como FAIL/BLOCKED; #247 fija >=44 px como requisito R40.

## 8 · Gates cognitivos

### P0
- acción principal reconocible;
- opciones avanzadas detrás de divulgación progresiva;
- loading/vacío/error explican qué pasa y qué puede hacer la persona.

### P1
- se ven 9 contextos primarios, no un muro de filtros;
- edad/tipo no compiten con la entrada principal.

### P3
- se ven 6 áreas;
- no aparecen 25 estudios simultáneamente en portada.

### P4
- se ven 11 grupos;
- no aparecen 72 intereses simultáneamente.

### Todas
- volver/cerrar/cancelar es predecible;
- no se pierde trabajo local sin aviso;
- lenguaje claro, no infantilizante;
- no se exige diagnóstico.

**Juicio final:** HUMANO.

## 9 · Audio/Rincón

Antes de acción:
- audio pausado;
- vídeo/escena no inicia;
- no hay cambio temporizado inesperado.

Después de la acción explícita:
- inicia la escena y el audio aprobados;
- volumen inicial coincide con token A7;
- Silenciar funciona;
- Volumen funciona por teclado;
- Solo imagen detiene/omite audio sin romper la escena;
- cambiar escena no produce pico/sobresalto;
- volver atrás no dispara reproducción;
- reduced motion conserva controles.

Repetir ES/EN y 1440/320.

## 10 · Privacidad local

Con DevTools/network interception:

1. crear colección/proyecto local con datos sintéticos no personales;
2. navegar entre P0/P4/P5;
3. guardar/cerrar/reabrir según contrato A5;
4. exportar/importar fixture seguro;
5. borrar;
6. revisar requests emitidas.

PASS solo si:
- el dato local no aparece en requests a Sabik ni terceros;
- borrado elimina lo que el contrato dice que persiste;
- error de cuota/corrupción no envía datos ni destruye silenciosamente otro proyecto;
- idioma no crea colisiones de claves.

Revisión humana adicional: texto de privacidad/borrado claro en ES/EN cuando exista UI pública.

## 11 · Procedencia/licencias

Para cada media/dato afectado:

```text
asset_or_fact:
source:
licence:
version_or_date:
A4/A7 status: READY | HOLD
text alternative:
```

HOLD impide PASS de la parte que dependa de ese activo.

## 12 · Capturas obligatorias de cierre

Por fase:
- ES 1440;
- EN 1440;
- ES 320;
- EN 320;
- forced colors representativa;
- reduced motion representativa;
- estado vacío/error si aplica;
- Rincón antes y después de activación si aplica.

Captura ≠ prueba completa; acompaña, no sustituye teclado/zoom/foco.

## 13 · Asistencia técnica y dispositivo real

Antes del PASS final de una fase pública nueva/materialmente cambiada:

- lector de pantalla real: PENDING_MANUAL;
- móvil físico: PENDING_MANUAL;
- revisión humana de foco/lectura: PENDING_MANUAL.

No convertir estas filas en PASS por resultado de emulación.

## 14 · Registro de veredicto

```text
phase:
candidate_head:
candidate_tree:
automated: PASS/FAIL/BLOCKED
manual: PASS/FAIL/PENDING_MANUAL/BLOCKED
known_pending:
final_head_recheck:
final_tree_recheck:
verdict: PASS | BLOCKED | PENDING_MANUAL
```

Si `manual=PENDING_MANUAL`, el veredicto no puede ser PASS.
