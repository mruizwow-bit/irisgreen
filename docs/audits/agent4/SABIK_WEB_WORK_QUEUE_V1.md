# SABIK_WEB_WORK_QUEUE_V1

**Agente:** n.º 4  
**Fecha:** 20/09/2026  
**Estado:** cola activa y revisable por Astra.

## P0 · CRÍTICO

### A4-P0-001 · Ayudas: caducidad y estado
**Problema:** los recursos temporales no tienen un campo normalizado abierto/cerrado/permanente.  
**Caso confirmado:** NEAE 2026-2027 conserva plazo 19/05/2026–10/09/2026; hoy está cerrado.  
**Aceptación:**
- estado visible por registro;
- fecha de consulta;
- fecha de cierre/apertura;
- próxima revisión;
- no mostrar una convocatoria cerrada como disponible.

### A4-P0-002 · Datos: validación 49/49
**Problema:** el índice declara que las 49 fichas siguen en borrador y que falta comprobación final.  
**Aceptación:**
- cada ficha con fuente primaria o justificación de secundaria;
- población, territorio, año, método, incertidumbre;
- fecha de consulta/revisión;
- estado publicado solo tras comprobación.

### A4-P1-008 · Vida diaria: gobernanza fuente → build → dist
**Hallazgo:** 48/48 fichas fuente contienen estado publicada y validación 10/09/2026; el índice fuente conserva BORRADOR. El pipeline lo resuelve deliberadamente: publica/valida en staging y elimina los estados editoriales antes de exponer `dist`.  
**Aceptación:**
- comprobar el artefacto final después de build;
- confirmar 48/48 rutas y sitemap generado;
- confirmar ausencia de estados editoriales públicos;
- conservar fecha/estado de revisión en un registro interno;
- no editar a mano salidas generadas.

### A4-P0-004 · Transparencia IA
**Aceptación:**
- página “Qué es Sabik”;
- aviso claro de interacción con IA donde proceda;
- capacidades;
- límites;
- fuentes;
- intervención humana;
- cómo informar de error;
- privacidad/datos;
- marcado de contenido sintético cuando aplique.

### A4-P0-005 · RD 707/2026
**Aceptación antes del 02/01/2027:**
- análisis de encaje de Sabik;
- checklist de accesibilidad cognitiva;
- adaptación razonable;
- control de estímulos;
- lenguaje sencillo/claro;
- proceso separado de Lectura Fácil;
- documentación de validación.

### A4-P0-006 · Privacidad de Sabik
**Aceptación:**
- inventario de datos por interacción;
- finalidad;
- proveedor;
- conservación;
- transferencia si existe;
- base jurídica por el responsable correspondiente;
- minimización;
- especial atención a salud, discapacidad, diagnóstico, menores y comportamiento.

## P1 · ALTA

### A4-P1-001 · Taxonomía de Condiciones
Separar tipos conceptuales sin eliminar información útil.

### A4-P1-002 · Sitemap
- revisar siete fichas de Condiciones ausentes del sitemap detectado;
- revisar inclusión de fichas individuales de Vida diaria;
- validar canonical/hreflang.

### A4-P1-003 · Multimedia
Inventario pieza a pieza de subtítulos, transcripción, audiodescripción y alternativa textual.

### A4-P1-004 · Juegos
Auditar 130 juegos:
- teclado;
- foco;
- alternativas a arrastrar/soltar;
- tiempo;
- color;
- instrucciones;
- imprimibles.

### A4-P1-005 · Imágenes
Prioridad:
1. Tus intereses;
2. Jugar;
3. Taller;
4. Libros;
5. Inicio.

Clasificar cada imagen: decorativa / informativa / funcional / compleja.

### A4-P1-006 · Cuestionarios
- licencias/versiones;
- accesibilidad de formulario;
- lenguaje de resultados;
- no diagnóstico;
- privacidad;
- siguiente paso.

### A4-P1-007 · Identidad verbal
Buscar en todas las fuentes:
- “INTELIGENCIA QUE AYUDA”;
- variantes tipográficas;
- imágenes con texto;
- metadatos;
- PDFs;
- ramas activas.

Sustituir por:
**SABIK · CLARIDAD INTELIGENTE. · Una IA que adapta la información para que sea más fácil de entender y usar.**

## P2 · MEDIA

### A4-P2-001 · Matriz etapas vitales
Tema × infancia × adolescencia × juventud × formación × adultez × empleo × relaciones × vivienda × envejecimiento.

### A4-P2-002 · Matriz contextos
Hogar × educación × empleo × sanidad × ocio × transporte × compras × espacios públicos × internet × administración.

### A4-P2-003 · Investigación
Mantenimiento de revisiones y estudios recientes.

### A4-P2-004 · Idiomas
Medir cobertura real ES/EN/PT-BR por ruta y funcionalidad. No presentar paridad antes de comprobarla.

## P3 · COMPLEMENTARIA

### A4-P3-001 · Recursos internacionales
Ampliar solo tras estabilizar España y las reglas de vigencia.

### A4-P3-002 · Nuevas herramientas
Añadir cuando cubran una necesidad real y tengan alternativa accesible.

---

## Estado actual

| ID | Estado |
|---|---|
| A4-P0-001 | INVESTIGADO |
| A4-P0-002 | INVESTIGADO |
| A4-P1-008 | INVESTIGADO |
| A4-P0-004 | INVESTIGADO |
| A4-P0-005 | INVESTIGADO |
| A4-P0-006 | FALTA arquitectura de datos real |
| A4-P1-001 | INVESTIGADO |
| A4-P1-002 | INVESTIGADO |
| A4-P1-003 | INVESTIGADO parcial |
| A4-P1-004 | FALTA auditoría funcional |
| A4-P1-005 | FALTA revisión contextual |
| A4-P1-006 | INVESTIGADO parcial |
| A4-P1-007 | INVESTIGADO repo principal; FALTA activos/otras fuentes |
| A4-P2-001 | PROPUESTO |
| A4-P2-002 | PROPUESTO |
| A4-P2-003 | PROPUESTO |
| A4-P2-004 | INVESTIGADO parcial |

## Regla

Ningún elemento pasa a **APROBADO** por decisión del Agente 4. La aprobación corresponde al gate revisado por Astra.
