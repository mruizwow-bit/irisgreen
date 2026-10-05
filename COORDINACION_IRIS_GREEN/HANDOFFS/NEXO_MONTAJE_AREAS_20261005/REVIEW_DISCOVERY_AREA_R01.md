# Nexo · revisión de Descubrimiento área navegable R01
2026-10-05 · Revisión del ZIP real recibido y de las capturas.

## Resultado
NEXO_DISCOVERY_AREA_R01_PATCH_REQUIRED
KEEP de estructura y canon. Patch acotado de interfaz/copy y evidencia; conexiones de runtimes/assets pendientes por alcance de la orden. No HUMAN QA PASS ni recorrido completo de experiencia.
No rehacer diseño entero. Claude corrige su interfaz; Prisma integra entregas identificadas.

## Identidad y comprobaciones independientes
- ZIP DESCUBRIMIENTO_AREA_NAVEGABLE_R01.zip
- SHA256 d00b60e06ef9403c2bb0c078edf1debc50f0dc6fef230d0ce6b6a1db5b2fd0c8; coincide con sidecar.
- 3 869 157 bytes.
- 39 archivos reales, no 38. HASHES.txt verifica 38/38; MANIFEST.json verifica 37/37. La diferencia es el propio inventario de hashes y el manifiesto.
- Seis HTML, CSS y JS locales, cuatro WOFF2 con licencias, registro de temas y 19 capturas.
- Referencias estáticas locales href/src verificadas: destinos presentes.
- Inspección de CSS: variables NAVY, tipografías y tamaños de canon declarados; inspección visual de cielo_1440, menu_movil_390 y para-todos_390.
- Leídos README, PRUEBAS, banco Python, registro, JS de interfaz y CSS.
- No he ejecutado Chromium en esta revisión. Las 12 pruebas de Claude son evidencia entregada, no 12 PASS independientes de Nexo.

## KEEP
Separación temas/ámbitos; sin asignación comercial inventada, pagos o motores paralelos; fichas neutrales sin resolver Orión ni revelar taxones; entradas locales y fuentes. La orden permitía continuar sin ZIP/assets disponibles y dejar puntos de conexión. Esa carencia no obliga a rehacer la estructura.
Portada → ficha → experiencia.html conduce a un aviso, no a Cielo/Peces. Catálogos vacíos remiten a portada; no existe aún el camino directo catálogo → ficha anunciado como recorrido completo. Corregir descripción de cobertura.

## P01 · Menú móvil: foco de capa completa
CSS abre navegación fixed/inset:0 y bloquea scroll del body. JS lleva foco a Cerrar, pero no vuelve inert el contenido tapado ni contiene Tab/Shift+Tab. Escape sólo se escucha en el panel.
Por inspección del código, el foco puede salir a enlaces tapados y después Escape deja de llegar al manejador. El banco sólo prueba Escape inmediatamente desde Cerrar; no cubre tabulación completa ni salida al contenido.
Corregir modalidad móvil (diálogo correctamente gestionado o capa con fondo inert y contención/retorno coherentes), sin romper navegación normal de escritorio. No basta añadir aria-modal. Probar Tab/Shift+Tab por todo el menú, Escape desde cada control, cierre por botón y resize a escritorio con foco visible.

## P02 · Copy de Vida marina
peces.html dice «Nada se mueve ni suena por su cuenta», en conflicto con natación NORMAL/REDUCED y con su propia introducción «observa lo que se mueve».
Sustituir por copy factual, por ejemplo: «Los animales nadan por el entorno. Puedes pausar el movimiento y elegir cómo explorar». No inventar comportamiento de audio no comprobado.
No cambiar el runtime de Peces: María confirma que su manejo actual funciona.

## P03 · Notas internas fuera de fichas
«El paquete aprobado de imágenes no está disponible en esta sesión. Prisma coloca aquí...» y la deliberación del reparto comercial no son contenido de producto.
Mover esas notas a README/registro/informe de integración. En prueba mostrar un placeholder neutral breve mientras se incorpora imagen existente; no generar nueva.
Catálogo pendiente: mantener estado honesto y enlace de retorno/experiencias sin inventar distribución Para todos/Plus, pero sacar la coordinación interna del copy público.
La reserva Sabik exigida por la orden no aparece en el material revisado: resolver coherencia con Juegos o registrar la omisión concreta, sin recrear Sabik.

## P04 · Precisión de evidencia
- El banco verifica overflowWidth, pero la prueba titulada «sin pérdida de contenido» no inspecciona clipping/solapamiento ni todos los límites verticales. Ampliar el caso concreto del menú/texto al 200 % o acotar lo declarado.
- Targets se comprueban sólo en cielo móvil, foco sólo en el primer Tab; no vender cobertura completa de seis páginas.
- 10 saltos se lanzan con goto individual; acreditan enlaces concretos, no una sesión completa con estado ni integración.
- Fuentes son locales WOFF2; el CSS revisado referencia archivos, no fuentes embebidas base64. Corregir descripción si «incrustadas» quería decir otra cosa.
- Idioma ejecutable ES, tabla EN entregada; no afirmar interfaz bilingüe completa. NONE existe como hook CSS, no como control de preferencia conectado. Declarar esos límites.
- Regenerar capturas/hashes/manifiesto tras patch; conservar salida no-cero del banco ante fallo.

## Conexiones y estado actualizado
- Vida marina: usar SHA a5a39e5d5de8369cfb0bf392dbeab6d20c66720128c094b5261517466f729717. KEEP provisional María; retest independiente pendiente según estado disponible. No modificar controles por el feedback de Cielo.
- Cielo: SHA 2e036ce4c3e3984be09d2c0ba630470f2129be49738960ec070bffa756d0026c es base anterior al patch de interacción pedido por María. NO darlo por producto validado. Falta selección directa clic/toque; arrastre voluntario para navegar y flechas físicas de teclado; retirar círculo obligatorio y cruceta de ratón.
- Orden final de input SOLO CIELO: CORRECCION_INPUT_DIRECTO_CIELO_PECES.md, commit 00421e50565983215334544bcc651a6108898953. Su nombre conserva Peces por estabilidad de enlace, pero su alcance vigente excluye cambios a Peces.
- Los dos ZIP ya están disponibles en el paquete local de pruebas y en sus referencias de entrega; el bloqueo de acceso a GitHub de la sesión de Claude no equivale a inexistencia de assets.
- Reparto Para todos/Plus sigue sin asignación final verificada; no decidirlo a partir de este review.

## Siguiente
Patch acotado Claude → Axioma revisión del área → conexión de runtimes/assets por Prisma → prueba de recorrido por María. Cielo sólo se considera corregido al entregar el nuevo ejecutable y probar selección directa. NO MAIN · NO PUBLIC DEPLOY. Motor sigue con Sabik.
