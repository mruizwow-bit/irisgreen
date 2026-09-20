# SABIK_WEB_EXPANSION_AYUDAS_V1

**Agente:** n.º 4  
**Fecha:** 20/09/2026  
**Área:** Ayudas / directorio de trámites  
**Ruta:** `/es/tramites/directorio/`  
**Estado:** INVESTIGADO → PROPUESTO. No modificar producción ni marcar gate aprobado sin revisión Astra.

---

## 1. ESTADO INICIAL

Snapshot español embebido en la página auditada:

- **258 registros**.
- 20 ámbitos territoriales detectados.
- 15 categorías.
- 0 IDs duplicados.
- todos los 258 registros contienen los 16 campos actuales:
  - `name`
  - `terr`
  - `cat`
  - `country`
  - `id`
  - `nivel`
  - `ambito`
  - `cuantia`
  - `que`
  - `quien`
  - `docs`
  - `obs`
  - `org`
  - `fuente`
  - `tags`
  - `pais`

El objeto de metadatos del snapshot indica además:
- ES: 258
- UK: 234
- BR: 148
- US: 362
- mundo: 1423

**Importante:** en la página auditada se ha analizado en profundidad el array `es`. Los recuentos de otros países no equivalen a una verificación de sus registros.

### Categorías ES

| Categoría | Registros |
|---|---:|
| Familia | 40 |
| Discapacidad y dependencia | 35 |
| Vivienda | 28 |
| Transporte | 28 |
| Educación y comedor | 23 |
| Ingresos y prestaciones | 23 |
| Conciliación y cuidados | 16 |
| Libros y material | 15 |
| Universidad | 14 |
| Terapias y atención temprana | 14 |
| Fiscalidad | 8 |
| Salud | 5 |
| Suministros | 4 |
| Empleo | 3 |
| LGTBI+ | 2 |

### Cobertura territorial

| Ámbito | Registros |
|---|---:|
| España · Estatal | 31 |
| Canarias | 30 |
| Illes Balears | 22 |
| País Vasco / Euskadi | 19 |
| Andalucía | 13 |
| Navarra | 13 |
| Asturias | 12 |
| Cataluña | 11 |
| Comunidad de Madrid | 11 |
| Aragón | 10 |
| Comunitat Valenciana | 10 |
| Galicia | 10 |
| La Rioja | 10 |
| Cantabria | 9 |
| Castilla-La Mancha | 9 |
| Región de Murcia | 9 |
| Castilla y León | 8 |
| Extremadura | 8 |
| Ceuta | 7 |
| Melilla | 6 |

---

## 2. LAGUNAS

El esquema actual no tiene campos normalizados para:

- estado del trámite;
- fecha de apertura;
- fecha de cierre;
- fecha de publicación de la convocatoria;
- fecha de consulta de la fuente;
- última revisión;
- próxima revisión;
- vigencia;
- recurso sustituido;
- versión;
- histórico;
- comprobación del enlace.

### Riesgo de mantenimiento

- 65 registros contienen alguna referencia a **2026**.
- 31 contienen **2026-2027**.
- 2 contienen referencias 2025-2026.
- 60 mencionan “convocatoria”.
- solo 1 registro contiene literalmente la palabra “plazo” en el texto auditado.

Esto demuestra que la caducidad está codificada de forma irregular en prosa, no como dato reutilizable.

---

## 3. INVESTIGACIÓN REALIZADA

### Caso A · Ayudas NEAE 2026-2027

Registro:
`es-neae`

La ficha de Sabik/Iris Green indica:
- 19 de mayo a 10 de septiembre de 2026.

Fuente oficial del Ministerio revisada el 20/09/2026:
- el plazo figura como **FINALIZADO**;
- apertura: 19/05/2026 08:00;
- cierre: 10/09/2026 15:00.

Fuente:
https://www.educacionfpydeportes.gob.es/servicios-al-ciudadano/catalogo/general/05/050140/ficha/050140-2026.html

**Resultado:** el contenido histórico del plazo es correcto, pero hoy el registro necesita estado normalizado **CERRADO**.

### Caso B · Pensión no contributiva 2026

La cuantía anual de las PNC de jubilación e incapacidad para 2026 se mantiene en:
**8.803,20 € anuales**.

Fuentes BOE comprobadas:
- Real Decreto-ley 3/2026, de 3 de febrero.
- Real Decreto 241/2026, de 25 de marzo.

Fuentes:
https://www.boe.es/eli/es/rdl/2026/02/03/3
https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-6977

**Resultado:** la cuantía observada en el directorio está respaldada para 2026; debe llevar referencia temporal y próxima revisión 2027.

### Caso C · Oferta de Empleo Público estatal 2026

El Real Decreto 387/2026 establece reserva del **10 %** para personas con discapacidad y, dentro de esa reserva, **2 %** para discapacidad intelectual.

Fuente:
https://www.boe.es/buscar/doc.php?id=BOE-A-2026-9946

**Resultado:** dato respaldado para la OEP estatal 2026. No convertirlo en regla universal de todas las administraciones.

---

## 4. FUENTES

Prioridad para esta pestaña:

1. BOE.
2. Sedes ministeriales.
3. Seguridad Social.
4. IMSERSO.
5. SEPE.
6. Agencia Tributaria.
7. sedes y portales oficiales de comunidades autónomas.
8. cabildos, diputaciones, consejos insulares y ayuntamientos cuando la ayuda sea de su competencia.

### Dominios más repetidos en el snapshot ES

La presencia de un dominio no implica verificación actual; solo muestra de dónde proceden muchos registros.

- juntadeandalucia.es
- navarra.es
- aragon.es
- socialasturias.asturias.es
- caib.es
- tramits.gencat.cat
- sede.carm.es
- euskadi.eus
- sede.xunta.gal
- boe.es
- sede.agenciatributaria.gob.es
- sede.gva.es
- juntaex.es
- sede.ceuta.es
- imserso.es
- seg-social.es

---

## 5. ESTRUCTURA PROPUESTA

Cada registro debería tener un bloque visible:

### Estado

Una de estas opciones:
- **Abierto**
- **Cerrado**
- **Permanente**
- **Próxima convocatoria pendiente**
- **Histórico**
- **Por verificar**

No usar solo color.

### Fechas

- abierto desde;
- cierra el;
- última revisión;
- próxima revisión.

### Qué es

Respuesta breve y directa.

### Quién puede pedirlo

Criterios principales.

### Qué necesitas

Documentos y requisitos.

### Cómo pedirlo

Pasos, si son estables.  
Si el procedimiento cambia, enlazar a la fuente oficial y no duplicar instrucciones frágiles.

### Importe

Siempre unido a:
- año;
- tramo;
- condición;
- o “según convocatoria”.

### Fuente oficial

Organismo + enlace.

### Aviso de jurisdicción

Ejemplo:
**España · Estatal**  
o  
**Andalucía · Autonómico**

---

## 6. NUEVOS CAMPOS PROPUESTOS PARA LOS DATOS

Sin borrar los campos actuales:

```text
estado
fecha_apertura
fecha_cierre
fecha_publicacion
fecha_consulta
ultima_revision
proxima_revision
vigencia
fuente_tipo
fuente_version
enlace_verificado
sustituido_por
notas_revision
```

### Ejemplo lógico para NEAE

```json
{
  "id": "es-neae",
  "estado": "cerrado",
  "fecha_apertura": "2026-05-19T08:00:00+02:00",
  "fecha_cierre": "2026-09-10T15:00:00+02:00",
  "fecha_consulta": "2026-09-20",
  "ultima_revision": "2026-09-20",
  "proxima_revision": "2027-04-15",
  "vigencia": "convocatoria-2026-2027",
  "enlace_verificado": true
}
```

El ejemplo no debe copiarse automáticamente a producción sin revisar el modelo de datos común con los agentes responsables.

---

## 7. NUEVOS CONTENIDOS

### Subapartado “Abiertas ahora”

Solo activar cuando todos los registros mostrados tengan estado comprobado.

### Subapartado “Cerradas: qué hacer ahora”

Explicar:
- que no se puede solicitar en este momento;
- cuándo suele aparecer la siguiente convocatoria, solo si existe un patrón oficial;
- dónde comprobar la siguiente;
- posibilidad de guardar el recurso.

### “No sé qué ayuda necesito”

Filtro por necesidad:
- estudiar;
- trabajar;
- vivienda;
- cuidado;
- movilidad;
- ingresos;
- discapacidad/dependencia;
- familia;
- salud;
- universidad.

No diagnosticar ni inferir automáticamente derecho a una prestación.

---

## 8. NUEVOS RECURSOS

Prioridad:

- páginas oficiales que indiquen claramente estado de convocatoria;
- sedes electrónicas con trámite;
- fichas que permitan comprobar fecha/cuantía;
- directorios oficiales autonómicos.

No añadir blogs o comparadores comerciales como fuente principal para requisitos legales o cuantías.

---

## 9. ELEMENTOS QUE SE ELIMINAN O SUSTITUYEN

### Sustituir

- cualquier CTA “Solicitar” cuando el plazo esté cerrado;
- cuantías sin año cuando sean temporales;
- “vigente” implícito por ausencia de aviso;
- instrucciones copiadas si cambian con frecuencia y la fuente oficial ya ofrece el trámite actualizado.

### No eliminar automáticamente

- convocatorias cerradas útiles como histórico;
- nombres duplicados entre territorios;
- recursos permanentes.

Los nombres duplicados detectados corresponden en varios casos a programas homónimos de distintos territorios. Los IDs no están duplicados.

---

## 10. ACCESIBILIDAD

La ficha de una ayuda debe permitir localizar en segundos:

1. si está abierta;
2. hasta cuándo;
3. quién puede pedirla;
4. cuánto ofrece;
5. qué documentación pide;
6. dónde se solicita.

Requisitos:
- estado textual, no solo color;
- fechas completas;
- botones con finalidad explícita;
- filtros accesibles por teclado;
- mensajes de resultados anunciables;
- no esconder condiciones esenciales en tooltips;
- no usar abreviaturas sin explicación;
- pasos numerados cuando exista procedimiento estable.

---

## 11. PRIVACIDAD

El directorio no necesita conocer el diagnóstico del usuario para mostrar información.

Filtrar por “autismo”, “discapacidad” o “NEAE” no debe convertirse automáticamente en un perfil personal almacenado.

Si Sabik recomienda recursos a partir de una conversación:
- minimizar datos;
- explicar qué usa;
- no inferir elegibilidad legal;
- diferenciar “puede ser relevante” de “tienes derecho”.

---

## 12. CUESTIONES PENDIENTES

P0:
- verificar 258/258 enlaces;
- asignar estado a 258/258;
- revisar 65 registros con 2026;
- revisar 60 registros que mencionan convocatoria;
- validar cualquier cuantía dependiente del año;
- definir fuente de verdad del dataset completo.

P1:
- normalizar campos;
- actualizar interfaz;
- filtros por estado;
- fecha de consulta visible;
- “cambios desde última revisión”.

P2:
- revisar datasets no ES después de estabilizar el modelo de vigencia.

---

## 13. FECHA DE REVISIÓN

- Investigación V1: **20/09/2026**
- Próxima revisión del esquema: **22/09/2026**
- Revisión de convocatorias temporales: **mensual** y cuando abra/cierre una campaña.
- Revisión completa anual: antes del inicio de cada curso/año de prestaciones cuando corresponda.

---

## 14. RESULTADO

La prioridad de Ayudas no es añadir cientos de enlaces.

Es convertir el directorio actual en un sistema donde una persona pueda saber, sin interpretar texto administrativo:

**qué existe · si puede mirarlo ahora · cuándo cierra · qué necesita · dónde se pide · cuándo se revisó**.
