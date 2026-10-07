# NEXO · ANÁLISIS Y DIRECCIÓN · CREACIÓN / TALLER R01 · GAME-FIRST + 3D WHERE IT ADDS MEANING

Fecha: 2026-10-07
Autoridad de producto: María
Coordinación: Nexo
Carril canónico: #308 · R47 Taller definitivo

## 1. Estado actual auditado

La base histórica útil existe y NO se debe tirar:
- 27 estudios públicos;
- arquitectura workspace-first;
- cinco perfiles de banco de trabajo;
- ES/EN;
- child-safe;
- guardado/exportación;
- teclado/touch;
- accesibilidad;
- Design R02/tokens;
- motores más avanzados ya existentes en varios estudios.

Pero el producto conserva problemas estructurales documentados:
- 13 estudios R43 reconstruidos + Dibujo como piloto + 13 legacy;
- varios motores demasiado simples o genéricos;
- parte del “3D” histórico es proyección isométrica Canvas2D, no espacio 3D real;
- WebGPU previo era detección, no renderer;
- Ritmo/Composición históricos usaban reloj insuficiente;
- la interfaz común tiende a sentirse como editor técnico;
- Home/launcher ha pasado por capas visuales pero no resuelve por sí sola la experiencia de crear.

## 2. Decisión de dirección propuesta

**Creación debe convertirse en una experiencia GAME-FIRST.**

Eso significa:
- entrar y hacer algo;
- aprender manipulando;
- entender el objetivo por la escena;
- recibir feedback inmediato;
- poder probar otra solución;
- producir un artefacto real.

NO significa:
- añadir puntuaciones;
- gamificar con badges;
- convertir todos los estudios en minijuegos infantiles;
- forzar una única receta.

## 3. ¿Todo en 3D?

**No todo debe usar un renderer 3D como herramienta principal.**

Forzar 3D en:
- escritura;
- código;
- dibujo;
- timeline musical;
- documentación;
puede empeorar precisión, accesibilidad y comprensión.

La regla correcta es:

`3D_FOR_SPATIAL_MEANING · GAME_FIRST_EVERYWHERE · CORRECT_MEDIUM_PER_STUDIO`

### 3D obligatorio cuando aporta comprensión espacial real
- Estructuras;
- Arquitectura;
- Modelado 3D;
- Máquinas;
- Robótica / gemelo digital;
- Simulaciones espaciales;
- Videojuegos 3D cuando corresponda;
- Mundos cuando la exploración espacial sea parte de la creación.

### 2D/temporal/documental como núcleo cuando es el medio correcto
- Dibujo;
- Diseño gráfico;
- Pixel Art;
- Cómic;
- Color;
- Fotografía;
- Moda/textil en patronaje;
- Ritmo;
- Composición;
- Síntesis;
- Programación;
- Escritura;
- Lenguas inventadas;
- Juegos de mesa/documentación.

Estos estudios pueden tener **preview o escena 3D** cuando aporte, pero no sustituir el medio principal.

## 4. Reestructuración del acceso a Creación

La entrada no debe ser una página con 27 herramientas.

Propuesta:

### HUB CREATIVO
Un espacio visual explorable con cinco zonas/perfiles:

1. **Lienzo**
   - dibujo, diseño, pixel, cómic, color, foto, moda, generativo.

2. **Construir**
   - estructuras, arquitectura, 3D, máquinas, circuitos, papiroflexia/poliedros, simulación.

3. **Tiempo y sonido**
   - ritmo, composición, síntesis, videomapping, animación.

4. **Código y sistemas**
   - programación, robótica, videojuegos.

5. **Historias y mundos**
   - escritura, mundos, lenguas, juegos de mesa, ideas.

El HUB puede ser 3D/espacial porque ahí sí aporta orientación y comprensión de “lugares para crear”.

Debe existir alternativa equivalente accesible:
- lista;
- búsqueda;
- teclado;
- navegación sin movimiento;
- NONE.

## 5. Patrón de cada estudio

Cada estudio debe empezar por una **situación**, no por un panel.

Patrón:

`VER → PROBAR → CAMBIAR → OBSERVAR CONSECUENCIA → CREAR → GUARDAR/EXPORTAR`

### Ejemplos

#### Dibujo
Entras con lienzo listo y una acción visible.
No “elige herramienta” antes de ver el lienzo.

#### Estructuras
Objeto/estructura 3D real.
Construyes y pruebas estabilidad/uso.

#### Ritmo
Escuchas un patrón, cambias una pieza, oyes la consecuencia.
Después modo libre.

#### Código
Ves una escena/sistema.
Cambias bloque/código.
Ejecutas.
Ves resultado.

#### Robótica
Robot/gemelo digital en escena.
Programas una acción y compruebas el comportamiento.

#### Escritura
Situación creativa breve.
Escribes/modificas.
Ves estructura/consecuencia narrativa.

## 6. Starter vs modo libre

Cada estudio debe ofrecer dos entradas claras:

### Empezar con una misión
Una situación corta, comprensible, con objetivo visible.

### Crear libremente
Workspace completo sin objetivo impuesto.

No bloquear herramientas por completar tutorial.
No usar el tutorial como requisito.

## 7. Profundidad de juego

Cada misión debe tener:
- objetivo funcional;
- al menos una decisión real;
- feedback del sistema;
- posibilidad de corregir;
- más de una solución cuando el dominio lo permita;
- final que produce algo útil/visible.

Evitar:
- “pulsa estos cinco botones”;
- checklist que revela toda la solución;
- contador artificial;
- éxito sólo por completar pasos.

## 8. Personajes / NPC

No son obligatorios en todos los estudios.

Usarlos sólo si aportan:
- contexto;
- consecuencia;
- prueba del resultado;
- colaboración;
- comprensión del objetivo.

Ejemplo:
una estructura sirve porque un personaje/objeto puede usarla.
No añadir mascota decorativa.

## 9. UI

La escena/workspace domina.

Paneles:
- apoyo;
- inspector;
- ayuda;
- accesibilidad;
- archivo.

No:
- dashboard dominante;
- documentación antes de empezar;
- 27 cards en primer viewport;
- toolbars enormes.

## 10. Accesibilidad

La dirección game-first no reduce accesibilidad.

Obligatorio:
- teclado;
- touch;
- alternativa a drag;
- foco;
- 44 px policy;
- 320/390/1440;
- 200%;
- forced-colors;
- NORMAL/REDUCED/NONE;
- mirror DOM accesible;
- ES/EN;
- no depender del 3D para entender instrucciones.

Para HUB 3D:
- alternativa lista equivalente;
- no motion required;
- navegación sin cámara obligatoria.

## 11. No escalar 27 a la vez

Antes de reestructurar los 27, construir **5 vertical slices**, una por perfil:

1. Lienzo → Dibujo.
2. Construir → Estructuras.
3. Tiempo → Ritmo.
4. Código → Robótica o Videojuegos.
5. Documento → Mundos o Escritura.

Cada slice debe demostrar:
- entrada game-first;
- medio correcto;
- artefacto final;
- accesibilidad;
- ES/EN;
- móvil;
- HUMAN QA.

## 12. Criterio de éxito

Una persona debe poder entrar sin leer una explicación larga y entender:
- qué puedo hacer;
- qué cambia cuando actúo;
- qué estoy creando;
- cómo probarlo;
- cómo seguir o empezar otra cosa.

Estado recomendado:

`CREACION_RESTRUCTURE_REQUIRED__GAME_FIRST__3D_FOR_SPATIAL_MEANING`

No main.
No public deploy.
No reconstruir 27 estudios de golpe.
