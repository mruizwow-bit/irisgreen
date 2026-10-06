# Cielo nocturno R02 · Propuesta consolidada para Claude
Nexo · 2026-10-06.
Estado: NEXO_PRISMA_AXIOMA_CONSOLIDATED_PROPOSAL_READY.
Documento para entrega/revisión; no acredita recepción ni implementación por Claude.
Decisión: conservar datos, 88 assets y base estereográfica; corregir continuidad, selección y formato.

## 1. Fuentes y base
ZIP R01 SHA256 eaa15fcc98157f4d7f26c874a74d9d50bc8bc63061ca81067c56b66f01512bd6, 320/320 hashes verificados.
- Nexo: ESTUDIO_INTERACCION_FORMATO_Y_PROPUESTA_CLAUDE.md + fixtures (b6523a9641c2cc15dfe5080ec02cbd5ad50cab58).
- Axioma: HANDOFFS/AXIOMA_CIELO_COMPLETO_R01_20261006/ANALISIS_MEJORAS_INTERACCION_FORMATO.md (a075fab95ac657e19e1ccde6d805a461b0b29ce1) y probe (63e682f6bb2c7373d6511d982d37b2b519d2f322).
- Nexo contraste Axioma: CONSOLIDACION_AXIOMA_INTERACCION_FORMATO.md + probe (da60416cf2596f597c5007ba545420006906e953).
- Prisma: FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/PRISMA_REVISION_CIELO_COMPLETO_R01_20261006.md (9e93a637376681a056c0bfe4d015a1c866a5be44), leído junto al texto de María Texto pegado(20261006-055830).txt.
Rutas anteriores relativas a COORDINACION_IRIS_GREEN salvo documentos de Nexo en este directorio.

Prisma no declara navegador propio completo; Axioma/Nexo distinguen cobertura de interacción humana. No sumar los mismos hashes ni resultados del autor como pruebas de usuario independientes.

## 2. Qué añade Prisma y cómo se incorpora
- CIE-I01/I02 corroboran objetivo que no avanza y cabecera Orión contradictoria (Nexo C01/C02).
- CIE-I03 coincide con Axioma en separar tolerancia motora de evidencia del patrón. Nexo mantiene límites estadísticos del contraste.
- CIE-I04 aporta 88 pistas/47 textos únicos/21 textos repetidos. Nexo confirmó este recuento directamente en los campos.
- CIE-I05 concreta alternativa de puntero al drag; coincidente con propuesta Nexo.
- CIE-I06/I07/I08 corroboran Fuentes que navega, reinicio destructivo y Continuar sin cámara (Nexo C09).
- CIE-I09/I10 refuerzan atlas/entrada compacta, manteniendo lista equivalente.
- Hallazgo fuera de orden: registrar el nuevo hallazgo; mantener pista vigente si no se ha resuelto, recalcular contador y avanzar sólo cuando corresponda.
- Pistas contrastivas: describir diferencias observables frente a vecinos, con ayudas voluntarias.
- Cuaderno: volver al lugar del hallazgo, además de abrir datos.

No se promedian probes: Prisma muestrea por encima del horizonte y comunica medianas; Nexo usa rectángulo completo y comunica medias (también conserva desglose superior). No son estimaciones intercambiables de un único porcentaje. No hay tasa de error humano establecida.

## 3. Correcciones inmediatas sobre R01

### Estado y continuidad
1. Sincronizar hallazgo, pista, contador y cuaderno. Probar tres hallazgos generales consecutivos, uno fuera de orden y final de campo; conservar Orión de dos etapas.
2. Una sola pista activa; la del cinturón pertenece a Orión, no al hero global.
3. Ignorar cargas obsoletas de campo/ficha tras nueva navegación, cierre o salida. Cancelar animaciones/contextos pendientes.
4. Fuentes se abre y cierra en el contexto actual.
5. Persistir dirección/posición de cámara y zoom para Continuar y vuelta desde Cuaderno; definir versión/validación del guardado.
6. Separar Restablecer vista de Borrar hallazgos. Borrado con confirmación o deshacer y retorno de foco.

### Gestos y selección
7. Mantener clic/tap directo donde se señala. Hover no actúa; drag y cancel no identifican.
8. Multitouch no produce clic al soltar segundo dedo. Si hay pinch, implementarlo y probarlo; +/− siempre disponibles.
9. Unificar visibilidad de estrellas, patrón y descripción: nada bajo horizonte, detrás de UI o fuera de pantalla cuenta como observado.
10. Distinguir botón de teclado «Examinar zona central» del clic directo. Si se ofrece acción sobre selección, debe usar esa selección. Foco sólo hacia controles visibles/operables.
11. Zoom de rueda conserva punto señalado; pinch su centro si existe; encuadre completo es explícito. Sin cámara que persiga al ratón ni retícula obligatoria.
12. Alternativa de puntero simple para desplazarse: vista general donde tocar destino, con lista DOM equivalente y alcance completo. Flechas físicas se conservan; no volver a cruceta principal.

### Reconocimiento
13. Separar target cómodo en píxeles de evidencia angular/geométrica por patrón. No reducir accesibilidad para hacer más difícil descubrir.
14. Calibrar intención, ambigüedad y negativos. Mismo punto celeste y misma evidencia VISIBLE deben producir resultado coherente entre tamaños; no contar estrellas ocultas para forzar igualdad.
15. No equiparar unidades de un campo a grados sin transformación. Si se fija apertura angular, considerar proyección/posición y escala; no un radio CSS uniforme.
16. Localizar deja claro qué estrellas/patrón se tomó; revelar identidad/figura es deliberado. Probar dos etapas en la muestra antes de generalizar. Un segundo botón no demuestra por sí mismo reconocimiento.
17. Cielo limpio por defecto, figura activa persistente hasta acción de la persona, capa «Mis hallazgos». Nada desaparece por temporizador mientras se observa.

## 4. Experiencia y formato que debe prototiparse

### Entrada
Cielo nocturno.
Texto general breve.
Principal: «Empezar por Orión» para primera visita; «Continuar» cuando proceda.
Secundarios: «Explorar otras zonas» / «Cuaderno».
Dentro de escena: exploración libre y «Dame una pista» opcional. No menú obligatorio de doce números técnicos ni progreso 0/88 protagonista.
La primera pista de Orión conserva «Busca tres estrellas brillantes casi en línea».

### Pistas y recorrido
- Primera ayuda: forma/relación/brillo que se distinga en estrellas SIN líneas reveladas.
- Segunda: referencia a un hallazgo conocido, sólo a petición.
- Tercera: sector orientativo solicitado, sin revelar nombre.
- No introducir ayudas automáticamente por temporizador ni etiquetar lentitud como fallo.
- Una rama o curva del grafo no es una pista válida si sólo resulta visible después de dibujar líneas.
- CLUE_UNIQUE_WITHIN_ACTIVE_FIELD debe comprobar que la descripción distingue frente a alternativas; cadenas de texto distintas no bastan. En futuro cielo continuo, comparar vecinos realmente visibles a través de campos.
- Reconocer otra constelación cuenta igualmente; no hay orden obligatorio.
- Evitar «lo reconociste por…» como afirmación sobre pensamiento del usuario. Preferir «Este patrón se distingue por…», referido a evidencia visible y fuente.

Pilotar una ruta documentada desde Orión hacia referencia vecina disponible; no producir cinco rutas a la vez. Mantener taxón de objeto claro: estrella, asterismo y constelación no son descubrimientos equivalentes.

### Pantalla y profundidad
- Portada conserva hero; escena usa título compacto, una pista y cielo inmediato.
- Acción contextual pegada al cielo; instrucciones extensas bajo Ayuda.
- Objetivo de diseño SKY ≥70 % del área útil en observación; declarar denominador y medir cielo realmente visible, sin cambiarlo para aparentar cumplimiento. A texto 200 % priman lectura y operabilidad.
- Primer hallazgo: nombre, patrón observado, una idea y hasta tres estrellas relevantes.
- Detalle bajo petición en secciones: Cómo reconocerla / Estrellas / Figura y región / Visibilidad / Material / Fuentes.
- Desktop: panel no tapa el objetivo; apertura conserva dirección y escala aparente, no sólo el número zoom.
- Móvil: resumen bajo escena, profundidad plegable que no oculte el patrón, regreso a encuadre/foco.
- Datos en filas legibles en móvil, sin encoger letra para forzar cuatro columnas.
- Fuentes accesibles sin atravesar tres niveles; notas internas de entrega al README.
- Completar explicaciones ES/EN verificadas; null no se transforma en mitología inventada.

### Cuaderno
Mapa de lo descubierto más lista/búsqueda equivalentes. Guardar dónde se encontró y permitir volver sin alterar otros hallazgos. Nombres pendientes ocultos. Progreso disponible con jerarquía secundaria.

## 5. Cielo continuo: trabajo arquitectónico separado
Los tres informes apoyan retirar campos técnicos de la navegación principal.
Eso no convierte automáticamente doce proyecciones locales en un cielo continuo.
Durante el patch, zonas preparadas con acceso claro a todas. No simular continuidad ni esconder contenido.

Prototipo técnico posterior entre DOS campos:
- coordenadas esféricas comunes (RA/Dec/vectores desde fuente fiable);
- reproyección consistente al centro actual;
- IDs comunes y deduplicación;
- líneas/regiones/selección alineadas;
- precarga/cancelación y conservación de dirección/FOV;
- prueba de costura sin salto/pérdida/duplicación.
No pegar u/v, y no migrar a HEALPix sólo por aparecer en la investigación.
Un overview global y sus límites no equivalen a continuidad del renderer de detalle.

## 6. Densidad y cielo real, después
Densidad opcional separada de Movimiento; nombres sencillos como Estrellas principales/Más estrellas.
No eliminar anclas de una pista activa ni seguir detectando estrellas invisibles. Sin bloqueos permanentes de contenido.
El preset continúa preparado. «Mi cielo esta noche» es futuro alcance con lugar/fecha/hora y validación; no añadir ahora sensores, geolocalización ni horizonte supuesto real.
No hace falta expansión de corpus o redibujar los 88 assets para este patch.

## 7. Canon obligatorio
Sólo NAVY. Fondo #0B1A2B; paneles #15304A; superficie #1D3D5C; texto #EEF4F8; secundario #C9D5DD; enlaces #9FDCEA; foco/acento #C3B8FF; bordes controles #8494A8; separadores #2A4460; botón principal #DCE8F2/texto #0B1A2B.
Cuerpo Atkinson Hyperlegible 1rem/1.6; títulos Newsreader 600/1.2; hero portada Newsreader 400,40–56px/1.06; intro ~19px/1.58.
Targets ≥44 px, foco independiente de selected, ES/EN, 320/390/1440, reflow 200 %, forced-colors y NORMAL/REDUCED/NONE.

## 8. Entrega y evaluación
Primer ZIP ejecutable: patch de continuidad + selección + formato sobre una ruta completa y casos representativos (patrón extenso, débil, concurrido y Orión).
Conservar acceso a las 88; distinguir explícitamente qué pistas/editorial/formatos se han pilotado y qué siguen R01.
SHA256, manifest, changelog, pruebas y vídeo corto desde ZIP extraído; sin red si se mantiene contrato file://.
Pruebas por acciones reales desde UI, además de C18 geométrico y probes. Matriz intención→resultado con ninguno/ambiguo, no sólo aceptación aleatoria ni meta porcentual inventada.
Reflow interno en panel/avisos/tablas, foco y teclado, teléfono físico/lector/navegadores reales según alcance declarado. Ningún «40/40» ajeno se presenta como propio.
Human QA: entiende primer gesto, el patrón señalado, qué acaba de descubrir y cómo continuar; mantiene orientación al consultar y volver.

No main, producción ni modificación de assets aprobados. Documento consolidado listo para compartir; pendiente implementación y revisión del nuevo artefacto.
