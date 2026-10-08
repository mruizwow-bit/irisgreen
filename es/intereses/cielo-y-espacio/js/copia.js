/* Cielo 3D · piloto R01 · TEXTOS ES/EN. Mismas acciones y estados en los dos
   idiomas; cambiar de idioma conserva orientación, hallazgos y foco. */
(function (g) {
  'use strict';
  var ES = {
    lang: 'es',
    titulo_documento: 'Cielo y Espacio',
    titulo: 'Cielo y Espacio',
    portada_intro: 'Un mismo espacio, visto desde dentro y desde fuera. Lo orientas con la mano y señalas lo que quieras mirar: las cosas aparecen cuando las encuentras, no antes. Puedes empezar por donde quieras.',
    bloque_cielo: 'El cielo entero',
    bloque_cielo_resumen: 'Las 88 constelaciones sobre una sola esfera, con los radiantes de las lluvias y las estrellas que tienen planetas.',
    bloque_solar: 'El Sistema Solar',
    bloque_solar_resumen: 'El Sol y lo que gira a su alrededor, con sus lunas y los planetas enanos. Se mira desde fuera y se gira con la mano.',
    bloque_eclipses: 'Los eclipses',
    bloque_eclipses_resumen: 'Qué se tiene que alinear para que haya un eclipse, y por qué no los hay todos los meses.',
    progreso_bloque: function (a, b) { return a + ' de ' + b + ' encontrados.'; },
    progreso_total: function (n) { return n + (n === 1 ? ' hallazgo en el cuaderno.' : ' hallazgos en el cuaderno.'); },
    como_explorar: 'Cómo explorar',
    ruta_libre_texto: 'A tu aire: señala lo que quieras y el cuaderno lo recoge.',
    preset: 'Vista celeste curada · sin fecha, hora ni lugar',
    pista_raton: 'Arrastra para orientar el cielo. Pulsa sobre lo que quieras examinar. La rueda acerca donde señalas.',
    empezar_explorar: 'Empezar a explorar',
    continuar_explorando: 'Seguir donde lo dejaste',
    ayuda_flota: 'Arrastra para mirar a otra parte del cielo.',
    continuar: 'Continuar',
    volver_a_la_portada: 'Volver a la portada',
    area_ayuda: 'Arrastra para orientar el cielo y pulsa sobre la zona que quieras examinar. Con el foco aquí: flechas para orientar, más y menos para acercar y alejar, Intro para examinar la zona del centro, que aparece marcada.',
    orientacion_actual: function (ra, dec, ap) {
      return 'Estás mirando esta parte del cielo.';
    },
    controles_alternativos: 'Orientar y acercar',
    orientar_izquierda: 'Orientar a la izquierda',
    orientar_derecha: 'Orientar a la derecha',
    orientar_arriba: 'Orientar hacia arriba',
    orientar_abajo: 'Orientar hacia abajo',
    acercar: 'Acercar', alejar: 'Alejar',
    examinar: 'Examinar zona central',
    sin_patron: 'Aquí no aparece ese patrón. Sigue mirando.',
    ambiguo: 'Aquí se cruza más de un patrón y no está claro cuál señalas, así que no identifico ninguno. Puedes acercarte, apuntar a la parte más clara de uno, o decirme cuál era.',
    elige_uno: 'Por si acaso, dime cuál señalabas:',
    /* Las pistas se componen con medidas, no se escriben a mano. Tres niveles
       de ayuda: forma, dirección aproximada y ancla ya aprendida. Ninguno
       nombra lo que hay que encontrar. */
    pista_forma: function (f) { return 'Busca ' + f + '.'; },
    pista_direccion: function (g, dir, punos, f) {
      return 'A unos ' + g + '° hacia ' + dir + ' —' + punos + '—: busca ' + f + '.';
    },
    pista_salto: function (estrella, g, dir, punos, f) {
      return 'Desde ' + estrella + ', unos ' + g + '° hacia ' + dir + ' —' + punos + '—: busca ' + f + '.';
    },
    /* ------------------------------------------- capas de la esfera ------ */
    /* ------------------------------------------------------- eclipses ---- */
    eclipse_intro: 'Un eclipse es una sombra que cae donde se puede ver. Para que ocurra, el Sol, la Tierra y la Luna tienen que ponerse casi en línea: por eso no hay uno cada mes, aunque la Luna dé una vuelta cada mes.',
    eclipse_tipos: 'Los seis tipos',
    eclipse_secuencias: 'Cómo transcurre, paso a paso',
    eclipse_secuencia_nota: 'La secuencia muestra las fases una tras otra. Los tiempos entre fases cambian de un eclipse a otro.',
    eclipse_abierto: function (n) { return 'Abierto: ' + n + '.'; },
    eclipse_declaracion: 'Estos dibujos representan el tipo de eclipse, no un eclipse concreto visto desde un sitio concreto. La geometría es la aprobada y no se ha vuelto a dibujar aquí.',
    cuaderno_en_bloque: function (n) { return n === 1 ? 'Un hallazgo aquí.' : n + ' hallazgos aquí.'; },
    cuaderno_ir_al_bloque: function (n) { return 'Ir a ' + n; },
    capa_lbl: 'Qué buscar',
    capa_constelaciones: 'Constelaciones',
    capa_radiantes: 'Lluvias de meteoros',
    capa_exoplanetas: 'Estrellas con planetas',
    capa_cambiada: function (n) { return 'Ahora buscas: ' + n + '.'; },
    punos: function (n) {
      var p = { 1: 'un puño', 2: 'dos puños', 3: 'tres puños', 4: 'cuatro puños', 5: 'cinco puños' };
      return 'unos ' + (p[n] || (n + ' puños')) + ' con el brazo estirado';
    },
    pista_radiante: 'el punto del que parecen salir los meteoros de una lluvia',
    pista_anfitriona: 'una estrella que se ve a simple vista y tiene planetas',
    sin_radiante: 'Aquí no hay ningún radiante. Sigue mirando.',
    sin_anfitriona: 'Aquí no hay ninguna estrella con planetas conocidos. Sigue mirando.',
    radiante_localizado: 'Has dado con un radiante: de este punto parecen salir los meteoros de una lluvia.',
    anfitriona_localizada: 'Has dado con una estrella que tiene planetas.',
    radiante_revelado: function (n) { return 'Es el radiante de las ' + n + '.'; },
    anfitriona_revelada: function (n) { return 'Es ' + n + ', y tiene planetas.'; },
    punto_ya: function (n) { return 'Esto ya lo habías encontrado: ' + n + '.'; },
    punto_ambiguo: function (n) { return 'Aquí hay ' + n + ' cosas distintas y no está claro cuál señalas, así que no identifico ninguna.'; },
    ver_que_lluvia: 'Ver qué lluvia es',
    ver_que_estrella: 'Ver qué estrella es',
    lluvia_cuando: function (i, f, m) { return 'Se ve del ' + i + ' al ' + f + ', y su mejor noche es el ' + m + '.'; },
    lluvia_radiante_en: 'El radiante cae en',
    lluvia_zhr: 'Meteoros por hora en el mejor momento',
    lluvia_zhr_variable: 'variable de un año a otro',
    lluvia_velocidad: 'Velocidad de entrada',
    lluvia_cuerpo: 'Viene de',
    lluvia_cuerpo_desconocido: 'no se sabe de qué cuerpo viene',
    lluvia_fuente: function (org, fecha) { return 'Datos: ' + org + ', consultados el ' + fecha + '.'; },
    anfitriona_resumen: function (n, con, mag) {
      return 'Se ve a simple vista' + (con ? ' en ' + con : '') + (mag ? ', magnitud ' + mag : '') +
             ', y tiene ' + (n === 1 ? 'un planeta confirmado' : n + ' planetas confirmados') + '.';
    },
    exo_distancia: 'Distancia',
    exo_temperatura: 'Temperatura de la estrella',
    exo_sus_planetas: function (n) { return n === 1 ? 'Su planeta' : 'Sus ' + n + ' planetas'; },
    exo_clase: function (c) { return 'Por su tamaño y su masa: ' + c + '.'; },
    exo_radio: 'Tamaño',
    exo_veces_tierra: function (v) { return v + ' veces la Tierra'; },
    exo_periodo: 'Una vuelta a su estrella',
    exo_dias: function (d) { return d + (d === 1 ? ' día' : ' días'); },
    exo_metodo: 'Cómo se encontró',
    exo_anio: 'Año',
    /* --------------------------------------------------- Sistema Solar --- */
    solar_objetivo: 'Gira el sistema con la mano y señala el cuerpo que quieras mirar. Lo que encuentres se queda nombrado.',
    solar_area_ayuda: 'Arrastra para girar el sistema y pulsa sobre el cuerpo que quieras examinar. Con el foco aquí: flechas para girar e inclinar, más y menos para acercar y alejar, Intro para examinar lo que haya en el centro, O para rodear el cuerpo que tengas elegido y V para volver al sistema. «Lista de cuerpos» da la misma vía sin arrastrar.',
    solar_orientacion: function (az, el, esc) {
      return 'Estás mirando el Sistema Solar.';
    },
    solar_orientacion_cuerpo: function (n, az, el, lon, esc) {
      return 'Estás dando la vuelta a ' + n + '. Ahora ves esta cara.';
    },
    /* El renderizador ya no se enseña en pantalla: vive en la documentación y
       en las medidas. Aquí sólo se dice lo que le cambia a quien mira. */
    solar_motor: function (software) {
      return software ? 'Este ordenador dibuja los planetas sin tarjeta gráfica. Se ven con los bordes menos finos.' : '';
    },
    datos_de_esta_vista: 'Datos de esta vista',
    lo_que_llevas: 'Lo que llevas encontrado',
    solar_sin_webgl: 'Este navegador no puede mostrar los planetas en 3D. El resto del producto sigue disponible.',
    solar_rodear: 'Rodear este cuerpo',
    solar_al_sistema_boton: 'Volver al sistema entero',
    solar_rodeando: function (n) {
      return 'Ahora rodeas ' + n + '. Gira con la mano o con las flechas y verás la otra cara, la de verdad.';
    },
    solar_al_sistema: 'Vuelves a mirar el sistema entero.',
    solar_examinar: 'Examinar el centro',
    solar_lista: 'Lista de cuerpos',
    solar_nada: 'Ahí no hay ningún cuerpo. Gira un poco o acércate.',
    solar_ver_cual_es: 'Ver cuál es',
    solar_ya: function (n) { return 'Este ya lo habías encontrado: ' + n + '.'; },
    solar_revelado: function (n) { return 'Lo que has encontrado es: ' + n + '.'; },
    solar_descripcion: function (q) {
      if (q.estrella) return 'Has señalado la estrella alrededor de la que gira todo lo demás.';
      var p = [];
      p.push(q.orden ? 'Has señalado el cuerpo que hace el número ' + q.orden + ' contando desde el Sol' : 'Has señalado un cuerpo');
      if (q.anillos) p.push('con un anillo alrededor');
      if (q.lunas === 0) p.push('sin ninguna luna conocida');
      else if (q.lunas === 1) p.push('con una luna');
      else p.push('con ' + q.lunas + ' lunas conocidas');
      p.push(q.mayor_que_la_tierra ? 'y más grande que la Tierra' : 'y más pequeño que la Tierra');
      return p.join(', ') + '.';
    },
    sol_diametro: 'Diámetro',
    sol_distancia: 'Distancia al Sol',
    sol_millones_km: 'millones de km',
    sol_periodo: 'Una vuelta al Sol',
    sol_anios: 'años',
    sol_dias: 'días',
    sol_temperatura: 'Temperatura media',
    sol_lunas_n: 'Lunas conocidas',
    sol_sus_lunas: function (n, total) {
      return n === total ? 'Sus ' + n + ' lunas' : 'Sus lunas principales (' + n + ' de ' + total + ')';
    },
    sol_luna_datos: function (diam, periodo, retro, anio) {
      var p = [];
      if (diam) p.push(diam + ' km de diámetro');
      if (periodo) p.push('da una vuelta en ' + periodo + (periodo === 1 ? ' día' : ' días'));
      if (retro) p.push('gira al revés que su planeta');
      if (anio) p.push('descubierta en ' + anio);
      return p.length ? p.join(' · ') : 'Sin datos publicados de tamaño y periodo.';
    },
    sol_comparar_luna: function (v) {
      return v >= 1 ? 'Es ' + v + ' veces nuestra Luna.' : 'Es ' + v + ' veces nuestra Luna de tamaño.';
    },
    sol_recreacion: 'El mapa de superficie de este cuerpo es una recreación: no hay imágenes detalladas de él. Se marca como representación, no como fotografía.',
    sol_estado_factual: 'Los números son los publicados (dato real). La posición en la escena se calcula con los elementos orbitales. Los tamaños y las distancias en pantalla no están a escala: si lo estuvieran, no se vería nada.',
    sol_credito: 'Mapa de superficie:',
    ruta_lbl: 'Ruta',
    nivel_ayuda_lbl: 'Ayuda',
    nivel_1: 'Sólo la forma',
    nivel_2: 'Forma y dirección',
    nivel_3: 'Forma, dirección y desde dónde',
    nivel_cambiado: function (n) { return 'Ayuda: ' + n + '.'; },
    ruta_cambiada: function (n) { return 'Ruta: ' + n + '.'; },
    seguir_desde_aqui: 'Seguir desde aquí',
    sin_vecinas: 'No queda ninguna vecina sin encontrar cerca de aquí.',
    octantes: {
      derecha: 'a la derecha', arriba_derecha: 'arriba a la derecha', arriba: 'arriba',
      arriba_izquierda: 'arriba a la izquierda', izquierda: 'a la izquierda',
      abajo_izquierda: 'abajo a la izquierda', abajo: 'abajo',
      abajo_derecha: 'abajo a la derecha', aqui: 'justo donde señalas'
    },
    opcion_lugar: function (d, grados) {
      return 'El grupo ' + d + (grados ? ', a unos ' + grados + '°' : '');
    },
    n_estrellas: function (n) { return n + ' estrellas'; },
    encontradas_lbl: 'Has encontrado tres estrellas alineadas.',
    es_cinturon: 'Es el cinturón de Orión.',
    es_hiades: 'Son las Híades, con Aldebarán en un extremo.',
    hiades_lbl: 'Has encontrado una V de estrellas.',
    ver_constelacion: 'Ver la constelación',
    localizado: function (n) { return n === 1 ? 'Has tomado 1 estrella de un mismo patrón.' : 'Has tomado ' + n + ' estrellas de un mismo patrón.'; },
    has_encontrado: function (n) { return 'Has encontrado ' + n + '.'; },
    ya_encontrada: function (n) { return 'Esta figura ya la habías encontrado: ' + n + '.'; },
    saber_mas: 'Saber más',
    seguir_explorando: 'Seguir explorando',
    contexto_hallazgo: function (n) { return 'Acabas de encontrar ' + n + '. Mira lo que quieras de ella; cuando sigas, te digo qué buscar.'; },
    siguiente_pista: 'De vuelta al cielo. Hay otra cosa que buscar.',

    objetivo_libre: 'Orienta el cielo y señala cualquier grupo que te llame la atención.',
    todo_encontrado: 'Has encontrado todas las de esta zona. Puedes seguir señalando lo que quieras.',
    cuaderno: 'Cuaderno',
    cuaderno_vacio: 'Todavía no has encontrado nada. Lo que encuentres se apunta aquí, con el sitio desde el que lo viste.',
    cuaderno_progreso: function (a, b) { return a + ' de ' + b + ' encontradas en esta zona.'; },
    encontrado_en: function (ra, dec, ap) {
      return 'Encontrada mirando hacia ascensión recta ' + ra + ' h, declinación ' + dec + '°, con ' + ap + '° de campo.';
    },
    sin_lugar: 'Sin sitio apuntado: se encontró antes de que el cuaderno lo registrara.',
    volver_al_lugar: 'Volver a donde la encontré',
    vuelto_al_lugar: function (n) { return 'De vuelta a donde encontraste ' + n + '. La vista es la misma de entonces.'; },
    mis_hallazgos: 'Mis hallazgos',
    capa_encendida: 'Se ven todas las figuras que has encontrado.',
    capa_apagada: 'Sólo se ve la figura activa.',
    estrellas_relevantes: 'Sus estrellas más claras',
    mas_detalle: 'Si quieres más detalle',
    sec_reconocer: 'Cómo reconocerla', sec_estrellas: 'Estrellas',
    sec_region: 'Figura y región', sec_visibilidad: 'Visibilidad',
    sec_material: 'Material', sec_fuentes: 'Fuentes',
    volver_al_resumen: 'Volver al resumen',
    idea_breve: function (x) { return 'La figura representa ' + x + '.'; },
    magnitud_valor: function (m) { return 'magnitud ' + m; },
    col_designacion: 'Designación', col_nombre: 'Nombre', col_magnitud: 'Magnitud',
    col_distancia: 'Distancia', col_tipo: 'Tipo espectral', anios_luz: 'años luz',
    r_area: 'Área oficial', grados_cuadrados: 'grados cuadrados',
    r_mes: 'Mejor mes', r_peninsula: 'Desde la Península', r_canarias: 'Desde Canarias',
    /* R04.5 · los valores de visibilidad del catálogo vienen en español;
       aquí se nombran en cada idioma en vez de pintarse tal cual. */
    vis_valores: { entera: 'Entera', parte: 'En parte', no: 'No se ve', siempre: 'Siempre' },
    vis_nota: 'Es un dato del catálogo. No es una predicción para una fecha, una hora ni un lugar concretos.',
    desviacion: 'desviación',
    /* R04.5 · lo técnico pasa a documentacion/PROCEDENCIA.md y en pantalla
       queda la frase corta, como ya se hizo con la orientación de la cámara. */
    cielo_nota: 'Todas las estrellas se dibujan sobre una misma esfera. El radio es el mismo para todas, así que no dice a qué distancia está cada una. Sin fecha, hora ni lugar no hay horizonte, y por eso no se dibuja ninguno.',
    cielo_ejes: 'Miras la esfera desde dentro, como se mira el cielo de verdad. Las coordenadas del catálogo avanzan hacia la izquierda. La convención de ejes está en documentacion/PROCEDENCIA.md.',
    derivacion_breve: 'Esta descripción sale de lo que se puede ver sin líneas ni instrumentos. Cómo se construye está en documentacion/PROCEDENCIA.md.',
    estrella: 'Estrella',
    estrella_sin_datos: 'De esta estrella no hay datos propios en el catálogo entregado.',
    sin_dato: 'Sin dato',
    fuentes: 'Fuentes', cerrar: 'Cerrar', cancelar: 'Cancelar',
    idioma: 'Idioma', movimiento: 'Movimiento',
    mov_normal: 'Normal', mov_reduced: 'Reducido', mov_none: 'Sin animación',
    describir: 'Explorar con descripción',
    descripcion_titulo: 'Descripción de la zona observada',
    desc_vacia: 'En la zona de examen no hay ningún punto.',
    desc_puntos: function (n) { return 'En la zona de examen hay ' + n + (n === 1 ? ' punto.' : ' puntos.'); },
    desc_brillantes: function (n) { return n === 1 ? 'Uno de ellos destaca por su brillo.' : n + ' de ellos destacan por su brillo.'; },
    desc_forma: function (n) { return 'Los puntos de la zona dibujan un trozo de figura de ' + n + ' vértices.'; },
    desc_fuera: function (d) { return 'Fuera de la zona, hacia ' + d + ', hay un grupo de puntos brillantes.'; },
    desc_fuera_nada: 'Fuera de la zona no destaca ningún grupo de puntos brillantes en esta vista.',
    desc_apertura: function (gr) { return 'La zona de examen abarca unos ' + gr + ' grados.'; },
    dir: { n: 'arriba', s: 'abajo', e: 'la derecha', o: 'la izquierda',
           ne: 'arriba a la derecha', no: 'arriba a la izquierda',
           se: 'abajo a la derecha', so: 'abajo a la izquierda' },
    borrar_hallazgos: 'Borrar hallazgos',
    borrar_aviso: 'Se borrarán las figuras encontradas. La vista no cambia. Esto no se puede deshacer.',
    borrar_confirmar: 'Sí, borrar todo',
    borrado_hecho: 'Hallazgos borrados.',
    movimiento_cambiado: 'Movimiento cambiado. El cielo se queda donde estaba.',
    vista_movida: 'Vista orientada.',
    aviso_recurso: 'No se ha podido cargar una imagen del paquete. El cielo sigue funcionando; comprueba que la carpeta assets está completa junto al archivo HTML.',
    aviso_forced: 'Con colores forzados del sistema puede que las estrellas no se distingan. «Explorar con descripción» describe la zona observada con texto y funciona igual.',
    aviso_guardado: 'Este navegador no deja guardar el progreso. Puedes explorar igual.',
    aviso_guardado_futuro: 'En este navegador hay progreso guardado por una versión más nueva de Cielo nocturno. No se entiende aquí y no se toca: se queda intacto. Puedes explorar con normalidad, pero lo que encuentres en esta sesión no se guardará.',
    borrado_hecho_solo_lectura: 'Se ha vaciado esta sesión. El progreso guardado por la versión más nueva sigue intacto: desde aquí no se borra.',
    cargando: 'Cargando el cielo…',
    progreso: function (a, b) { return a + ' de ' + b + ' figuras encontradas.'; }
  };

  var EN = {
    lang: 'en',
    titulo_documento: 'Sky and Space',
    titulo: 'Sky and Space',
    bloque_cielo: 'The whole sky',
    bloque_cielo_resumen: 'The 88 constellations on a single sphere, with meteor shower radiants and the stars that have planets.',
    bloque_solar: 'The Solar System',
    bloque_solar_resumen: 'The Sun and what goes around it, with its moons and the dwarf planets. Seen from outside, turned with your hand.',
    bloque_eclipses: 'Eclipses',
    bloque_eclipses_resumen: 'What has to line up for an eclipse, and why there is not one every month.',
    progreso_bloque: function (a, b) { return a + ' of ' + b + ' found.'; },
    progreso_total: function (n) { return n + (n === 1 ? ' finding in the notebook.' : ' findings in the notebook.'); },
    como_explorar: 'How to explore',
    ruta_libre_texto: 'On your own: point at whatever you like and the notebook keeps it.',
    portada_intro: 'One space, seen from inside and from outside. You turn it with your hand and point at whatever you want to look at: things appear when you find them, not before. You can start wherever you like.',
    preset: 'Curated celestial view · no date, time or place',
    pista_raton: 'Drag to turn the sky. Click whatever you want to examine. The wheel zooms where you point.',
    empezar_explorar: 'Start exploring',
    continuar_explorando: 'Pick up where you left off',
    ayuda_flota: 'Drag to look at another part of the sky.',
    continuar: 'Continue',
    volver_a_la_portada: 'Back to the start',
    area_ayuda: 'Drag to turn the sky and click the area you want to examine. With focus here: arrow keys turn the sky, plus and minus zoom in and out, Enter examines the centre area, which is marked.',
    orientacion_actual: function (ra, dec, ap) {
      return 'You are looking at this part of the sky.';
    },
    controles_alternativos: 'Turn and zoom',
    orientar_izquierda: 'Turn left', orientar_derecha: 'Turn right',
    orientar_arriba: 'Turn up', orientar_abajo: 'Turn down',
    acercar: 'Zoom in', alejar: 'Zoom out',
    examinar: 'Examine the centre area',
    sin_patron: 'That pattern is not in this area. Keep looking.',
    ambiguo: 'More than one pattern crosses here and it is not clear which one you mean, so I am not identifying any of them. You can zoom in, aim at the clearest part of one, or tell me which it was.',
    elige_uno: 'If you like, tell me which one you were pointing at:',
    pista_forma: function (f) { return 'Look for ' + f + '.'; },
    pista_direccion: function (g, dir, punos, f) {
      return 'About ' + g + '° ' + dir + ' —' + punos + '—: look for ' + f + '.';
    },
    pista_salto: function (estrella, g, dir, punos, f) {
      return 'From ' + estrella + ', about ' + g + '° ' + dir + ' —' + punos + '—: look for ' + f + '.';
    },
    eclipse_intro: 'An eclipse is a shadow falling where it can be seen. For one to happen, the Sun, the Earth and the Moon have to line up almost exactly: that is why there is not one every month, even though the Moon goes round every month.',
    eclipse_tipos: 'The six types',
    eclipse_secuencias: 'How it unfolds, step by step',
    eclipse_secuencia_nota: 'The sequence shows the phases one after another. The time between phases changes from one eclipse to the next.',
    eclipse_abierto: function (n) { return 'Opened: ' + n + '.'; },
    eclipse_declaracion: 'These drawings represent the type of eclipse, not a particular eclipse seen from a particular place. The geometry is the approved one and it has not been redrawn here.',
    cuaderno_en_bloque: function (n) { return n === 1 ? 'One finding here.' : n + ' findings here.'; },
    cuaderno_ir_al_bloque: function (n) { return 'Go to ' + n; },
    capa_lbl: 'What to look for',
    capa_constelaciones: 'Constellations',
    capa_radiantes: 'Meteor showers',
    capa_exoplanetas: 'Stars with planets',
    capa_cambiada: function (n) { return 'Now looking for: ' + n + '.'; },
    punos: function (n) {
      var p = { 1: 'one fist', 2: 'two fists', 3: 'three fists', 4: 'four fists', 5: 'five fists' };
      return 'about ' + (p[n] || (n + ' fists')) + ' at arm’s length';
    },
    pista_radiante: 'the point a shower’s meteors seem to come from',
    pista_anfitriona: 'a star you can see with the naked eye that has planets',
    sin_radiante: 'There is no radiant here. Keep looking.',
    sin_anfitriona: 'There is no star with known planets here. Keep looking.',
    radiante_localizado: 'You have found a radiant: a shower’s meteors seem to come from this point.',
    anfitriona_localizada: 'You have found a star with planets.',
    radiante_revelado: function (n) { return 'It is the radiant of the ' + n + '.'; },
    anfitriona_revelada: function (n) { return 'It is ' + n + ', and it has planets.'; },
    punto_ya: function (n) { return 'You had already found this: ' + n + '.'; },
    punto_ambiguo: function (n) { return 'There are ' + n + ' different things here and it is not clear which you mean, so I am not identifying any.'; },
    ver_que_lluvia: 'See which shower',
    ver_que_estrella: 'See which star',
    lluvia_cuando: function (i, f, m) { return 'Active from ' + i + ' to ' + f + ', best on ' + m + '.'; },
    lluvia_radiante_en: 'The radiant falls in',
    lluvia_zhr: 'Meteors per hour at best',
    lluvia_zhr_variable: 'varies from year to year',
    lluvia_velocidad: 'Entry speed',
    lluvia_cuerpo: 'Comes from',
    lluvia_cuerpo_desconocido: 'the body it comes from is not known',
    lluvia_fuente: function (org, fecha) { return 'Data: ' + org + ', consulted on ' + fecha + '.'; },
    anfitriona_resumen: function (n, con, mag) {
      return 'Visible to the naked eye' + (con ? ' in ' + con : '') + (mag ? ', magnitude ' + mag : '') +
             ', and it has ' + (n === 1 ? 'one confirmed planet' : n + ' confirmed planets') + '.';
    },
    exo_distancia: 'Distance',
    exo_temperatura: 'Temperature of the star',
    exo_sus_planetas: function (n) { return n === 1 ? 'Its planet' : 'Its ' + n + ' planets'; },
    exo_clase: function (c) { return 'By its size and mass: ' + c + '.'; },
    exo_radio: 'Size',
    exo_veces_tierra: function (v) { return v + ' times Earth'; },
    exo_periodo: 'One trip around its star',
    exo_dias: function (d) { return d + (d === 1 ? ' day' : ' days'); },
    exo_metodo: 'How it was found',
    exo_anio: 'Year',
    /* --------------------------------------------------- Solar System ---- */
    solar_objetivo: 'Turn the system with your hand and point at the body you want to look at. Whatever you find stays named.',
    solar_area_ayuda: 'Drag to turn the system and tap the body you want to examine. With the focus here: arrows to turn and tilt, plus and minus to zoom in and out, Enter to examine whatever is in the centre, O to orbit the body you have chosen and V to go back to the system. "List of bodies" gives the same way in without dragging.',
    solar_orientacion: function (az, el, esc) {
      return 'You are looking at the Solar System.';
    },
    solar_orientacion_cuerpo: function (n, az, el, lon, esc) {
      return 'You are moving around ' + n + '. You can see this side now.';
    },
    solar_motor: function (software) {
      return software ? 'This computer draws the planets without a graphics card. Their edges may look less smooth.' : '';
    },
    datos_de_esta_vista: 'View data',
    lo_que_llevas: 'What you have found',
    solar_sin_webgl: 'This browser cannot show the planets in 3D. The rest of the product is still available.',
    solar_rodear: 'Orbit this body',
    solar_al_sistema_boton: 'Back to the whole system',
    solar_rodeando: function (n) {
      return 'You are now orbiting ' + n + '. Turn with your hand or the arrows and you will see the other side, the real one.';
    },
    solar_al_sistema: 'You are looking at the whole system again.',
    solar_examinar: 'Examine the centre',
    solar_lista: 'List of bodies',
    solar_nada: 'There is no body there. Turn a little or zoom in.',
    solar_ver_cual_es: 'See which one it is',
    solar_ya: function (n) { return 'You had already found this one: ' + n + '.'; },
    solar_revelado: function (n) { return 'What you have found is: ' + n + '.'; },
    solar_descripcion: function (q) {
      if (q.estrella) return 'You have pointed at the star everything else goes around.';
      var p = [];
      p.push(q.orden ? 'You have pointed at body number ' + q.orden + ' counting out from the Sun' : 'You have pointed at a body');
      if (q.anillos) p.push('with a ring around it');
      if (q.lunas === 0) p.push('with no known moon');
      else if (q.lunas === 1) p.push('with one moon');
      else p.push('with ' + q.lunas + ' known moons');
      p.push(q.mayor_que_la_tierra ? 'and bigger than Earth' : 'and smaller than Earth');
      return p.join(', ') + '.';
    },
    sol_diametro: 'Diameter',
    sol_distancia: 'Distance from the Sun',
    sol_millones_km: 'million km',
    sol_periodo: 'One trip around the Sun',
    sol_anios: 'years',
    sol_dias: 'days',
    sol_temperatura: 'Mean temperature',
    sol_lunas_n: 'Known moons',
    sol_sus_lunas: function (n, total) {
      return n === total ? 'Its ' + n + ' moons' : 'Its main moons (' + n + ' of ' + total + ')';
    },
    sol_luna_datos: function (diam, periodo, retro, anio) {
      var p = [];
      if (diam) p.push(diam + ' km across');
      if (periodo) p.push('goes round in ' + periodo + (periodo === 1 ? ' day' : ' days'));
      if (retro) p.push('turns the opposite way to its planet');
      if (anio) p.push('found in ' + anio);
      return p.length ? p.join(' · ') : 'No published size or period.';
    },
    sol_comparar_luna: function (v) {
      return v >= 1 ? 'It is ' + v + ' times our Moon.' : 'It is ' + v + ' times the size of our Moon.';
    },
    sol_recreacion: 'The surface map of this body is a recreation: there are no detailed images of it. It is marked as a representation, not a photograph.',
    sol_estado_factual: 'The numbers are the published ones (real data). The position in the scene is computed from orbital elements. Sizes and distances on screen are not to scale: if they were, you would see nothing.',
    sol_credito: 'Surface map:',
    ruta_lbl: 'Route',
    nivel_ayuda_lbl: 'Help',
    nivel_1: 'Shape only',
    nivel_2: 'Shape and direction',
    nivel_3: 'Shape, direction and where from',
    nivel_cambiado: function (n) { return 'Help: ' + n + '.'; },
    ruta_cambiada: function (n) { return 'Route: ' + n + '.'; },
    seguir_desde_aqui: 'Follow on from here',
    sin_vecinas: 'There is no unfound neighbour left near here.',
    octantes: {
      derecha: 'to the right', arriba_derecha: 'to the upper right', arriba: 'above',
      arriba_izquierda: 'to the upper left', izquierda: 'to the left',
      abajo_izquierda: 'to the lower left', abajo: 'below',
      abajo_derecha: 'to the lower right', aqui: 'right where you are pointing'
    },
    opcion_lugar: function (d, grados) {
      return 'The group ' + d + (grados ? ', about ' + grados + '° away' : '');
    },
    n_estrellas: function (n) { return n + ' stars'; },
    encontradas_lbl: 'You have found three stars in a line.',
    es_cinturon: "This is Orion's Belt.",
    es_hiades: 'These are the Hyades, with Aldebaran at one end.',
    hiades_lbl: 'You have found a V of stars.',
    ver_constelacion: 'Show the constellation',
    localizado: function (n) { return n === 1 ? 'You have taken 1 star of a single pattern.' : 'You have taken ' + n + ' stars of a single pattern.'; },
    has_encontrado: function (n) { return 'You have found ' + n + '.'; },
    ya_encontrada: function (n) { return 'You had already found this figure: ' + n + '.'; },
    saber_mas: 'Find out more',
    seguir_explorando: 'Keep exploring',
    contexto_hallazgo: function (n) { return 'You have just found ' + n + '. Look at whatever you like; when you move on, I will tell you what to look for.'; },
    siguiente_pista: 'Back to the sky. There is something else to look for.',

    objetivo_libre: 'Turn the sky and point at any group that catches your eye.',
    todo_encontrado: 'You have found every figure in this area. You can keep pointing at whatever you like.',
    cuaderno: 'Notebook',
    cuaderno_vacio: 'You have not found anything yet. Whatever you find is noted here, with the view you found it from.',
    cuaderno_progreso: function (a, b) { return a + ' of ' + b + ' found in this area.'; },
    encontrado_en: function (ra, dec, ap) {
      return 'Found looking towards right ascension ' + ra + ' h, declination ' + dec + '°, with a ' + ap + '° field.';
    },
    sin_lugar: 'No view noted: found before the notebook recorded it.',
    volver_al_lugar: 'Back to where I found it',
    vuelto_al_lugar: function (n) { return 'Back to where you found ' + n + '. The view is the same as then.'; },
    mis_hallazgos: 'My findings',
    capa_encendida: 'Every figure you have found is shown.',
    capa_apagada: 'Only the active figure is shown.',
    estrellas_relevantes: 'Its clearest stars',
    mas_detalle: 'If you want more detail',
    sec_reconocer: 'How to recognise it', sec_estrellas: 'Stars',
    sec_region: 'Figure and region', sec_visibilidad: 'Visibility',
    sec_material: 'Material', sec_fuentes: 'Sources',
    volver_al_resumen: 'Back to the summary',
    idea_breve: function (x) { return 'The figure represents ' + x + '.'; },
    magnitud_valor: function (m) { return 'magnitude ' + m; },
    col_designacion: 'Designation', col_nombre: 'Name', col_magnitud: 'Magnitude',
    col_distancia: 'Distance', col_tipo: 'Spectral type', anios_luz: 'light years',
    r_area: 'Official area', grados_cuadrados: 'square degrees',
    r_mes: 'Best month', r_peninsula: 'From mainland Spain', r_canarias: 'From the Canary Islands',
    vis_valores: { entera: 'All of it', parte: 'Part of it', no: 'Not visible', siempre: 'Always' },
    vis_nota: 'This comes from the catalogue. It is not a prediction for a particular date, time or place.',
    desviacion: 'deviation',
    cielo_nota: 'All the stars are drawn on one sphere. The radius is the same for every star, so it does not tell you how far away each one is. Without a date, a time and a place there is no horizon, so none is drawn.',
    cielo_ejes: 'You look at the sphere from inside, the way you look at the real sky. The catalogue coordinates run towards the left. The axis convention is in documentacion/PROCEDENCIA.md.',
    derivacion_breve: 'This description comes from what you can see without lines or instruments. How it is built is in documentacion/PROCEDENCIA.md.',
    estrella: 'Star',
    estrella_sin_datos: 'This star has no data of its own in the delivered catalogue.',
    sin_dato: 'No data',
    fuentes: 'Sources', cerrar: 'Close', cancelar: 'Cancel',
    idioma: 'Language', movimiento: 'Motion',
    mov_normal: 'Normal', mov_reduced: 'Reduced', mov_none: 'No animation',
    describir: 'Explore with descriptions',
    descripcion_titulo: 'Description of the observed area',
    desc_vacia: 'There are no points in the examined area.',
    desc_puntos: function (n) { return 'There ' + (n === 1 ? 'is 1 point' : 'are ' + n + ' points') + ' in the examined area.'; },
    desc_brillantes: function (n) { return n === 1 ? 'One of them stands out for its brightness.' : n + ' of them stand out for their brightness.'; },
    desc_forma: function (n) { return 'The points in the area outline a piece of figure with ' + n + ' corners.'; },
    desc_fuera: function (d) { return 'Outside the area, towards ' + d + ', there is a group of bright points.'; },
    desc_fuera_nada: 'Outside the area no group of bright points stands out in this view.',
    desc_apertura: function (gr) { return 'The examined area spans about ' + gr + ' degrees.'; },
    dir: { n: 'the top', s: 'the bottom', e: 'the right', o: 'the left',
           ne: 'the top right', no: 'the top left',
           se: 'the bottom right', so: 'the bottom left' },
    borrar_hallazgos: 'Delete findings',
    borrar_aviso: 'The figures you have found will be deleted. The view does not change. This cannot be undone.',
    borrar_confirmar: 'Yes, delete everything',
    borrado_hecho: 'Findings deleted.',
    movimiento_cambiado: 'Motion changed. The sky stays where it was.',
    vista_movida: 'Sky turned.',
    aviso_recurso: 'An image from the package could not be loaded. The sky still works; check that the assets folder is complete next to the HTML file.',
    aviso_forced: 'With forced system colours the stars may not be distinguishable. "Explore with descriptions" describes the observed area in text and works the same.',
    aviso_guardado: 'This browser will not store progress. You can still explore.',
    aviso_guardado_futuro: 'This browser holds progress saved by a newer version of Night sky. It is not understood here and it is not touched: it stays intact. You can explore as usual, but whatever you find in this session will not be saved.',
    borrado_hecho_solo_lectura: 'This session has been cleared. The progress saved by the newer version is still intact: it is not deleted from here.',
    cargando: 'Loading the sky…',
    progreso: function (a, b) { return a + ' of ' + b + ' figures found.'; }
  };


  /* R04.5 · Textos del catálogo que se pintan tal cual y estaban sólo en
     español. La clave es el texto español exacto que trae el dato. Si un
     texto no está aquí, se pinta el español: el banco pruebas/r04_idiomas.js
     falla cuando eso pasa, para que el hueco se vea en vez de colarse. */
  var DATOS_EN = {
    /* fichas · fuentes */
    'HYG Database v4.1, David Nash (astronexus), CC BY-SA 4.0':
      'HYG Database v4.1, David Nash (astronexus), CC BY-SA 4.0',
    'IAU Working Group on Star Names (WGSN), lista compilada por Cora Schneck (iau-star-names), MIT':
      'IAU Working Group on Star Names (WGSN), list compiled by Cora Schneck (iau-star-names), MIT',
    'Líneas, límites y nombres de d3-celestial, Olaf Frohn, BSD-3-Clause; límites oficiales de la IAU (Delporte, 1930)':
      'Lines, boundaries and names from d3-celestial, Olaf Frohn, BSD-3-Clause; official IAU boundaries (Delporte, 1930)',
    'Geometría de figura derivada de Stellarium (R01), conservada en R02/R03. La figura de líneas no es un grafismo oficial de la IAU.':
      'Figure geometry derived from Stellarium (R01), kept unchanged in R02/R03. The line figure is not an official IAU graphic.',
    'Límites oficiales IAU (Delporte, 1930).':
      'Official IAU boundaries (Delporte, 1930).',
    'Master SVG y PNG de revisión del paquete NIGHT_SKY_88_RUNTIME_PACKAGE_R01 (origen NIGHT_SKY_CONSTELLATION_PIPELINE_R03_FINAL_PASS).':
      'Review SVG and PNG master from the NIGHT_SKY_88_RUNTIME_PACKAGE_R01 package (originally NIGHT_SKY_CONSTELLATION_PIPELINE_R03_FINAL_PASS).',
    'PROVENANCE_PRESERVED__LICENSE_CHARACTERIZATION_NOT_ASSERTED_BY_ATLAS':
      'PROVENANCE_PRESERVED__LICENSE_CHARACTERIZATION_NOT_ASSERTED_BY_ATLAS',
    /* Sistema Solar · autores de las texturas */
    'Solar System Scope (INOVE), vía el proyecto solar-system de Kyle Gough':
      'Solar System Scope (INOVE), via Kyle Gough\u2019s solar-system project',
    'NASA/JHUAPL/Carnegie Institution of Washington (misión MESSENGER), vía el proyecto solar-system de Kyle Gough':
      'NASA/JHUAPL/Carnegie Institution of Washington (MESSENGER mission), via Kyle Gough\u2019s solar-system project',
    'Mapa de la atmósfera de Venus, procesado por Oleg Pluton (Helleformer), vía Stellarium':
      'Map of the atmosphere of Venus, processed by Oleg Pluton (Helleformer), via Stellarium',
    'NASA/JPL-Caltech (mapas de David Seal), vía Stellarium':
      'NASA/JPL-Caltech (maps by David Seal), via Stellarium',
    'USGS Astrogeology (datos de Dawn), coloreado por RVS, vía Stellarium':
      'USGS Astrogeology (Dawn data), coloured by RVS, via Stellarium',
    'Mapa hecho por Kexitt, procesado por Oleg Pluton (Helleformer), vía Stellarium':
      'Map made by Kexitt, processed by Oleg Pluton (Helleformer), via Stellarium',
    'Mapa imaginado por Snowfall, procesado por Oleg Pluton (Helleformer), vía Stellarium':
      'Map imagined by Snowfall, processed by Oleg Pluton (Helleformer), via Stellarium',
    'Mapa imaginado por MrSpace43, procesado por Oleg Pluton (Helleformer), vía Stellarium':
      'Map imagined by MrSpace43, processed by Oleg Pluton (Helleformer), via Stellarium',
    'Iris Green, dibujado por ordenador':
      'Iris Green, drawn by computer',
    /* Sistema Solar · licencias de las texturas */
    'CC BY 4.0': 'CC BY 4.0',
    'Dominio público': 'Public domain',
    'Imagen de la NASA, uso libre con crédito': 'NASA image, free to use with credit',
    'Uso libre con crédito \u00abCourtesy NASA/JPL-Caltech\u00bb': 'Free to use with the credit \u201cCourtesy NASA/JPL-Caltech\u201d',
    /* lluvias · organismo */
    'International Meteor Organization (IMO)': 'International Meteor Organization (IMO)'
  };

  g.IG_COPIA = { es: ES, en: EN, datos_en: DATOS_EN };
})(window);
