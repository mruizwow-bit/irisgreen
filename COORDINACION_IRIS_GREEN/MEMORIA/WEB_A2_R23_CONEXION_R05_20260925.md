# A2 · R23 y conexión R05 · entrega del 25/09/2026

María pidió «retomalo». Se recuperaron PR #244 y las órdenes reales, sin restaurar una base anterior. Este registro separa dos incrementos y no da por terminada toda la web.

## Identidad entregada

- Repositorio: mruizwow-bit/irisgreen.
- Rama web: agent2/sabik-iris-r08-20260924; PR #244 abierto y borrador.
- Base recuperada R22: cf96e31baac24ac9348ea6c5eea9ac1f79b67f5d.
- R23: 5735df1501643e4bf52c73fd3a866e38ea662bee → f25874faccb34a603aa3b069c7879d01cce286cc → 7b49e95f25318e9e936cf54e959948c6781c1c73.
- R05 final: **82106c874f5e4b612cdb68292b3c3115e040fea6**, tree 925971a34d78f7827e4f7a3808de0a6ace2c341d.
- Preview de conexión: **6ab5fd0246e4910008d918a2**, READY según el bot de Netlify para el mismo HEAD.
- Único origen web autorizado: https://deploy-preview-244--irisgreen-home.netlify.app . ES: / ; EN: /?lang=en.
- Cloud autorizado conservado: https://6ab56a1ba2f6d83e6fb7b408--sabik-asistente.netlify.app . No nuevo Cloud ni cambio de acceso.
- Entrega y handoff: https://github.com/mruizwow-bit/irisgreen/issues/237#issuecomment-5826899869 . No se presupone recepción o ejecución de otros agentes.

## R23 · comprobaciones que ya no correspondían al producto

Cuatro pruebas corregidas, sin cambiar interfaz, contenido, fuentes, escenas, sonidos ni pictogramas:

1. scripts/test_resources_current.py: Rutinas imprimibles usa ahora sus enlaces data-open y botones data-print, no la interfaz de Juegos ni un PNG retirado. Apertura y regreso con teclado/foco, hojas e impresión/PDF comprobados.
2. scripts/test_rutinas_visuales.py: catálogo vigente de 292 SVG individuales, once categorías, IDs/textos/rutas/XML comprobados; la comprobación histórica de 93 símbolos/13 sprites se conserva por separado. Tamaños físicos, límites y atribución sin cambios.
3. scripts/audit_nontext_contrast.py: abrir con Enter el details del buscador antes de enfocar su campo. Mismo umbral, sin excluir controles ni cambiar CSS.
4. scripts/test_iris_corrections_r09.py: conservar el diseño interior de dos filas introducido en R19. Se prueba alineación de marca/controles, navegación debajo y dentro de cabecera, enlaces visibles sin solapamiento/recorte y Tab. Se mantienen fuentes, ancho, móvil y páginas de los libros.

La interpretación inicial del salto de fila como defecto se corrigió al leer el historial y CSS. No se revirtió el producto para satisfacer el test antiguo ni se atribuye aprobación visual nueva a María.

Informes en la rama web: reports/web-r23/README.md y ADDENDUM_CABECERA_Y_VALIDACION.md. Run de montaje previo **36095235096 SUCCESS** en 7b49e95. Pruebas aisladas locales y pruebas completas de Actions se documentan por separado. Dos muestras A4 ES/EN inspeccionadas; no PDF/UA ni impresión física.

## R39-A2-CONEXION-R05 · parche funcional exacto

Orden leída: ORDENES/R39_CONEXION_REAL_R05/01_AGENTE_2.md, blob b5b41480d986fb4bebcf1d9eae8bf32e01f34852. La autorización y acceso de María ya constaban; no se solicitó otra autorización ni se investigó login.

A2_CONNECT.patch, blob a1e5dc958ebaa49e692b61849eea4467063ff2b8, SHA-256 52f4a01fa67d8bdab0ac42ef03940a6eea6ae37c83663171493a916b227e76ce. Git apply --check y git apply: exit 0 sobre los tres blobs exactos hidratados de 7b49e95. Esa comprobación local no se presenta como checkout/build completo.

Únicos cambios funcionales: sabik/mount-config.mjs activa el origen aprobado; sabik/iris-mount.mjs cambia ayuda ES/EN a 300; sabik/iris-panel.html cambia maxlength y ayuda inicial a 300. Además se adapta scripts/test_iris_brief_r08.py y se añaden dos informes en reports/r39-a2-conexion-r05/. Comparación GitHub confirma solo esos seis archivos respecto a 7b49e95.

No se cambian transporte existente, panel de resultados, agrupador, biblioteca/corpus ES sellado, masters, movimiento, voz ni credenciales. El literal histórico sabik_transport_enabled=false del informe del generador no se usa como prueba del estado: la configuración generada y la UI se comprueban realmente.

## Validación real sobre 82106c8

[Run de montaje 36095903893](https://github.com/mruizwow-bit/irisgreen/actions/runs/36095903893), job 107948008609, **SUCCESS**: build_site.py, montaje representativo, Recursos, cabeceras/visores y Taller.

Artefacto 10847097560, SHA-256 descargado y verificado **fd7aa1a177ba86c3078956829f31c3a69c52715b21b255b9fbe2a02ecae35dd5**. JSON revisado: 36/36 casos de montaje y 12/12 Recursos. Cuatro casos de portada ES/EN a 1440/320 verifican disponibilidad, ayuda exacta, máximo nativo 300, Enviar activo con texto/inactivo vacío, Tab y retorno de foco al restablecer. Lectura, reflujo y movimiento reducido conservados. Cero contactos automáticos con Cloud. Capturas CI ES y EN revisadas; no se describen como prueba live del despliegue.

Routines run 36095903924, Recursos 36095903899 y contraste no textual 36095903911 también SUCCESS. Los gates de almacenamiento/privacidad 36095903892, CSP 36095904032 y previa publicación 36095903988 siguen FAILURE. Este último señala indexación/sitemap, filtros/listados/errores y miniaturas/reproductores. No se adjudica una causa nueva ni se declara CI global verde.

**No se envió consulta:** query_submitted=false y http_retrieval_verified=false. Un formulario activado, un build correcto y un preview READY no acreditan todavía resultados ni fuentes HTTP reales.

## Handoff y pendientes

A3 conserva exclusivamente sus cinco casos reales pendientes: resultados/fuentes, cero resultados, cancelación/sustitución, error/timeout recuperable y lang=es de citas en UI EN. Codex comprueba correlación HTTP. Sin repetir QA de montaje ya acreditada. No afirmar MONTADO_CONECTADO_REAL antes de esa evidencia.

Los pendientes manuales R22 no se cierran: contraste complejo, dos recorridos largos de foco incompletos, lector de pantalla y móvil físicos, escucha/3D real y validación humana. No se certifican WCAG/ISO/EN, braille o PDF/UA; no se amplían conclusiones C17.

La nueva orden WEB-CONTENIDO-R02, blob 4cd5b057038b42efaee9f0d8e304256e590c2e21, se ha leído: **RECIBIDA_NO_EJECUTADA_EN_ESTE_LOTE**. El paquete de 118 unidades no se ha integrado ni corregido aquí. Se mantiene separado del cierre R23 y de la conexión R05; no se anuncia R02 editorial entregada.

Main 2e17ed3ae02e23a4fd734b00c10f843d14a19d4d y producción no modificados por A2. Se conserva el único push/preview de conexión. Aplicabilidad normativa: ES/EN, semántica/foco/reflujo de la superficie, Lectura y movimiento. No cambian los requisitos; no se sobrescribe normativa histórica.

Registro documental: addendum de Memoria y delta de Control por ID sobre la coordinación vigente; no se sustituyen registros concurrentes ni originales V106/V114. El CSV histórico no se ha sobrescrito: leer con el delta enlazado en README. No se afirma sincronización del Excel maestro.
