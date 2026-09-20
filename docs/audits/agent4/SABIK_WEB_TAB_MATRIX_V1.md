# SABIK_WEB_TAB_MATRIX_V1

**Agente:** n.º 4 · Web · Información, recursos y conformidad  
**Fecha:** 20/09/2026  
**Fuente auditada:** rama `agent4/sabik-web-content-expansion-audit-v1` y `main` del repositorio `mruizwow-bit/irisgreen`  
**Estado:** inventario operativo. No equivale a conformidad WCAG ni a revisión jurídica definitiva.

## Cómo leer esta matriz

Cada pestaña se registra con los campos exigidos por Astra:

**EXISTE · FALTA · DESACTUALIZADO · AMPLIAR · SUSTITUIR · RECURSO NUEVO · ACCESIBILIDAD · NORMATIVA · FUENTE · FECHA DE PRÓXIMA REVISIÓN**

La columna “Accesibilidad” recoge puntos que deben probarse. Un indicador estático del HTML no demuestra por sí solo cumplimiento o incumplimiento.

---

## Matriz

| Área | EXISTE | FALTA | DESACTUALIZADO / RIESGO | AMPLIAR | SUSTITUIR | RECURSO NUEVO | ACCESIBILIDAD | NORMATIVA / ESTÁNDAR | FUENTE BASE | Próxima revisión |
|---|---|---|---|---|---|---|---|---|---|---|
| Inicio | Buscador; orientador; “qué pedir”; vídeos; juego; guardados; ajustes de lectura | Transparencia Sabik/IA visible; ruta clara a fuentes y límites | Identidad pública sigue siendo Iris Green; nuevo claim Sabik no aparece en repo principal | Accesos por necesidad, etapa y contexto | Claim antiguo si aparece en ramas/activos; textos que den apariencia humana a la IA | Página “Qué es Sabik” | Probar teclado, foco, búsqueda, orientador, guardados, lector, iframe | WCAG 2.2 AA; ISO 40500:2025; art. 50 AI Act; RD 707/2026 | index.html | 22/09/2026 |
| Condiciones | Índice con 185 entradas enlazadas | Separación visual inequívoca entre diagnósticos, identidades, contextos, procesos, experiencias y apoyos | “Condiciones” agrupa tipos conceptuales distintos | Etapas vitales, contexto, recursos y fecha de revisión por ficha | Rótulos que puedan hacer pasar conceptos emergentes/controvertidos por diagnósticos | Filtros por tipo conceptual y etapa | Probar filtros, búsqueda, foco, semántica de tarjetas, lectura clara | WCAG; ISO 24495-1; COGA; ISO 9241-112 | es/neurodiversidad/condiciones/index.html | 27/09/2026 |
| Situaciones | 187 situaciones; ocho grandes áreas; lenguaje centrado en experiencia cotidiana | Matriz situación × edad × contexto × apoyo; comprobación uniforme de fuentes | No se ha verificado aún que todas las fichas tengan la misma fecha/fuente/estado | Adultos, empleo, sanidad, administración, envejecimiento y crisis | Generalizaciones no respaldadas que se detecten durante revisión individual | Cruces “esto también puede aparecer en…” sin diagnosticar | Probar buscador/filtros; evitar carga cognitiva; relaciones semánticas | WCAG; ISO 24495-1; COGA | es/situaciones/index.html | 27/09/2026 |
| Vida diaria | 48 fichas en 6 categorías | Control editorial coherente; sitemap individual; fecha/fuente homogénea | **Índice marca 48 BORRADOR; fichas revisadas muestran Estado: publicada** | Pasos accionables, recursos España, “qué preparar” | Estado editorial contradictorio | Registro de mantenimiento por ficha | Probar búsqueda, listas secuenciales, tablas y enlaces | WCAG; ISO 24495-1; RD 707/2026; legislación sectorial por ficha | es/biblioteca/index.html + fichas | **22/09/2026** |
| Vídeos | Videoteca; respaldo estático observado con 48 vídeos; plataformas externas | Inventario por pieza de subtítulos, transcripción, audiodescripción y alternativa textual | Disponibilidad de vídeos/plataformas cambia; no se ha localizado transcripción sistemática | Contexto, duración, idioma, fuente, fecha | Piezas sin alternativa suficiente si no pueden corregirse | Transcripciones HTML; fichas accesibles | Reproductor, teclado, foco, captions, contraste, no autoplay, alternativa al iframe | WCAG 1.2.x; EN 301 549; Ley 11/2023 si aplica | es/videos/index.html | **22/09/2026** |
| Investigación | Índice declara 120 publicaciones; diseño, muestra, límites y filtros | Registro de fecha de consulta y actualización por publicación | Evidencia científica evoluciona; textos requieren vigilancia | Revisiones/guías nuevas y temas infrarrepresentados | Conclusiones que hayan quedado superadas | Cola de actualización bibliográfica | Filtros, lectura de resultados, abreviaturas, tablas | ISO 24495-1; ISO 9241-112; COGA | es/investigacion/index.html | 04/10/2026 |
| Datos | 49 páginas según aviso del índice; contexto de población/método en fichas revisadas | Verificación 49/49 antes de cierre | **El índice dice que las 49 están en borrador y que falta comprobación final** | España/UE cuando haya fuentes comparables; incertidumbre y límites | Cualquier cifra no verificable o mal contextualizada | Registro de dato → fuente → año → población → método → revisión | Tablas/figuras accesibles; no comunicar magnitud solo por color | WCAG; ISO 24495-1; ISO 9241-112 | es/datos/index.html + fuentes primarias | **22/09/2026** |
| Ayudas | Snapshot ES con 258 registros; categorías y CCAA; fuentes oficiales | Estado abierto/cerrado; fecha consulta; próxima revisión; caducidad | Convocatorias pueden cerrar. NEAE 2026-2027 ya terminó el 10/09/2026 | Filtros por necesidad, territorio, edad y estado | Enlaces rotos, convocatorias sustituidas, cuantías obsoletas | Etiqueta “abierto/cerrado/permanente/próxima convocatoria” | Filtros accesibles; mensajes de no-resultados; formularios si aparecen | WCAG; ISO 24495-1; normativa administrativa aplicable | es/tramites/directorio/index.html + organismos oficiales | **21/09/2026** |
| Libros | Página de libros y portadas | Inventario de muestras/descargas y formatos accesibles | Revisar enlaces y metadatos al cambiar ediciones | Formatos, accesibilidad, extractos HTML | Material exclusivamente imagen/PDF no accesible | Extracto HTML accesible cuando proceda | Texto alternativo, estructura, enlaces, zoom/reflow | WCAG; PDF/UA-2 si hay PDF | es/libros/index.html | 04/10/2026 |
| Jugar | Colección; JSON declara 130 juegos; imágenes y fichas | Validación de todos los mecanismos sin ratón; alternativas no visuales | El JSON conserva nota “120 juegos” aunque el total declarado/real es 130 | Objetivo, instrucciones, solución, qué se aprende | Instrucciones ambiguas o actividades imposibles con AT | Variante textual/teclado; imprimibles accesibles | Teclado, foco, drag/drop alternativo, tiempo, color, imágenes | WCAG 2.2; ISO 9241-171; COGA | es/recursos/juegos/index.html + juegos-120.json | 27/09/2026 |
| Tus intereses | Colecciones extensas; 95 imágenes en índice; imprimibles HTML | Inventario alt/descripción por imagen y calidad de impresión | Contenido visual exige revisión continua | Nuevos intereses solo si aportan valor | Imágenes informativas con alt vacío si se confirma tras revisión contextual | Descripción textual equivalente; colecciones accesibles | Imágenes informativas/funcionales/complejas; navegación por anclas | WCAG 1.1.1; ISO 9241-112 | es/intereses/index.html | 04/10/2026 |
| El taller | Más de 80 actividades/encabezados; hojas imprimibles; 16 imágenes | Revisión de materiales, requisitos y seguridad de cada actividad | No se ha auditado cada hoja/impresión | Pasos numerados y alternativas de baja carga | Instrucciones dependientes de imagen/gesto si aparecen | Plantillas HTML imprimibles accesibles | Secuencias, imágenes, zoom, teclado, lectura | WCAG; ISO 24495-1; COGA | es/taller/index.html | 04/10/2026 |
| Rincón tranquilo | Mirar; escuchar; pausa guiada; audio | Transcripción del audio y alternativa equivalente; preferencia de movimiento/sonido | Recursos externos pueden cambiar | Opciones sin audio, sin imagen y sin guía | Cualquier autoplay o estímulo no controlable si se detecta | Transcripción; modo silencioso | Control del usuario, audio, movimiento, contraste, no imponer técnica | WCAG 1.2.x/2.2.x; COGA | es/sitio-tranquilo/index.html | 27/09/2026 |
| Cuestionarios | AQ-10, CAT-Q-ES, ASRS v1.1; RAADS-R no publicado; aviso “orientan, no diagnostican” | Revalidar licencias/versiones antes de publicar ítems; accesibilidad de resultados | Umbrales y versiones pueden revisarse | Qué significa/no significa el resultado; siguiente paso | Traducciones o ítems no autorizados/no validados | Ruta “qué llevar a la valoración” | Etiquetas, instrucciones, errores, resultados, teclado, foco | WCAG; RGPD si hay tratamiento; ISO 24495-1 | es/cuestionarios/index.html + fuentes de validación | **22/09/2026** |
| Lectura accesible | Tamaño, espaciado, botones, contraste, guía, TTS, movimiento, reset | Medición funcional con AT y preferencias del SO/navegador | No confundir estos ajustes con “Lectura Fácil” | Explicar qué cambia y qué no | Terminología que sugiera certificación de LF | Página separada de LF cuando exista proceso formal | Preferencias persistentes, compatibilidad AT, foco | WCAG; ISO 9241-171; RD 707/2026; UNE 153101 solo LF formal | es/lectura-accesible/index.html | 27/09/2026 |
| Privacidad | LocalStorage; email; YouTube; Spotify; TTS; tipografías; borrado | Sabik IA, logs, analítica, telemetría, proveedores y conservación cuando existan | Quedará incompleta al incorporar Sabik si no se actualiza | Finalidad, base, datos, terceros, conservación, derechos | Cualquier frase que diga “no se guarda nada” si alguna capa sí registra | Tabla “qué dato / para qué / dónde / cuánto tiempo” | Avisos claros y no intrusivos; consentimiento cuando corresponda | RGPD; LOPDGDD; AI Act | es/privacidad/index.html + arquitectura real | **22/09/2026** |

---

## Hallazgos cuantitativos usados

- Condiciones: 185 rutas enlazadas desde el índice.
- Situaciones: 187 rutas enlazadas desde el índice.
- Vida diaria: 48 fichas y 48 apariciones de “BORRADOR” en el índice.
- Investigación: metadatos de la página declaran 120 publicaciones.
- Datos: aviso visible indica 49 páginas y comprobación final pendiente.
- Ayudas: datos embebidos ES = 258 registros; el snapshot incluye recuentos adicionales de otros ámbitos.
- Juegos: `juegos-120.json` declara `total: 130` y contiene 130 objetos, pero mantiene una nota textual que habla de “120 juegos”.
- Vídeos: respaldo estático detectado = 48 piezas.

## Regla de cierre

Una pestaña no cambia a “REVISADA” por volumen. Solo cambia cuando:
1. contenido;
2. fuentes;
3. vigencia;
4. accesibilidad;
5. normativa aplicable;
6. privacidad/IA si corresponde;
7. fecha de próxima revisión

quedan documentados.
