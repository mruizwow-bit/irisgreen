# LUMEN · PRÁCTICAS Y EXAMEN R01

Fecha: 30/09/2026
Agente: A7
Puesto: Immersive Media & Interactive Audiovisual Engineer

## Regla

Las prácticas de formación no modifican producto durante la Jornada de Formación.
Se puede:
- leer código;
- reconstruir incidentes;
- diseñar pruebas;
- auditar estados;
- explicar decisiones;
- crear evidencia formativa.

Un examen de papel no sustituye HUMAN QA audiovisual.

---

## Práctica 1 · Postmortem del primer R42

Caso:
Issue #288.

Reconstruir:
1. intención;
2. solución técnica;
3. por qué parecía válida;
4. qué vio María;
5. por qué los tests no lo detectaron;
6. qué cambió en la reconstrucción.

PASS:
explicar sin culpar a la persona y sin concluir “WebGL es malo”.

Respuesta esperada:
el fallo fue confundir sofisticación del motor con calidad de experiencia y validar demasiado el componente aislado frente al producto integrado.

---

## Práctica 2 · Arquitectura de degradación

Diseñar:
Tier A WebGPU/WGSL
→ Tier B WebGL2
→ Tier C Canvas2D
→ Tier D estático.

Para cada escalón documentar:
- capacidad detectada;
- experiencia que conserva;
- recursos que usa;
- salida;
- señal de error;
- evidencia;
- cómo baja de tier.

Prueba negativa:
shader no compila.

PASS:
la persona ve una experiencia terminada en el tier siguiente; no una pantalla rota ni un mensaje culpando a su dispositivo.

---

## Práctica 3 · Realidad vs arquitectura objetivo

Fuente viva observada:
A2 branch agent2/sabik-iris-r08-20260924
HEAD observado durante formación:
8ea50128b490207b4dd5508c3c46692f5be69c87

Archivos leídos:
- assets/rincon-r46.js
- assets/rincon-r46-breath.js
- assets/rincon-r46-landscapes.js
- assets/rincon-r53-stage.js
- es/sitio-tranquilo/index.html
- en/quiet-space/index.html

Hallazgo:
la orden #307 define WebGPU como Tier A deseado, pero el stage de salas integrado observado inicia en WebGL2 y degrada a Canvas/estático.

PASS:
registrar esa diferencia sin llamarla bug automáticamente.

Lección:
objetivo de arquitectura y capacidad existente son dos hechos distintos.

---

## Práctica 4 · Lifecycle de modos

Caso:
Respirar → Paisajes → Inmersivo → otra sección.

Verificar conceptualmente y después en runtime:
- modo anterior para;
- rAF deja de correr;
- audio se apaga con fade;
- iframe se destruye;
- listeners se retiran al destroy;
- pagehide detiene recursos;
- background pausa trabajo continuo;
- volver no duplica motores.

Pruebas negativas:
- cambiar de modo 30 veces;
- entrar/salir de pantalla limpia 30 veces;
- ocultar/mostrar pestaña repetidamente.

FAIL:
dos audios simultáneos, dos RAF de salas activas, iframe huérfano o listeners duplicados.

---

## Práctica 5 · Movimiento

Casos:
1. sistema sin preferencia;
2. prefers-reduced-motion;
3. ajuste Iris Green Reducido;
4. ajuste Sin movimiento.

Comprobar:
- el sistema se respeta si no existe override explícito;
- Reducido disminuye velocidad/densidad/amplitud;
- Sin movimiento detiene animación continua;
- la información/función se conserva;
- el usuario puede cambiar de estado sin perder contexto.

Prueba negativa:
cambiar preferencia del SO con escena abierta.

---

## Práctica 6 · Transparencia y forced colors

Comprobar:
- chrome translúcido solo donde corresponde;
- reduced transparency;
- modo opaco;
- forced colors;
- no glass-on-glass;
- stage sigue legible;
- controles no desaparecen.

Prueba negativa:
forzar alto contraste/forced colors durante pantalla limpia.

PASS:
siempre existe salida y controles comprensibles.

---

## Práctica 7 · Paisaje externo

Antes de pulsar:
- cero iframe;
- cero preconnect específico del proveedor;
- poster first-party;
- descripción suficiente.

Después de pulsar:
- iframe autorizado;
- origin correcto;
- player silenciado;
- audio Iris Green separado;
- fallback ante error;
- timer de sesión;
- stop destruye iframe.

Pruebas negativas:
- vídeo deja de permitir embed;
- mensaje onError;
- timeout sin respuesta;
- Save-Data activo;
- proveedor cambia UI;
- aparece publicidad.

Gate:
publicidad/interrupción perceptible en prueba larga = candidato rechazado según #307.

---

## Práctica 8 · Sesión larga real

Para playa, río y lluvia:
- observar al menos 20 min cada uno;
- desktop;
- móvil;
- sesión limpia/no logueada cuando sea media de terceros.

Registrar:
- tiempo observado;
- cortes;
- cambios de cámara;
- overlays;
- anuncios;
- repetición;
- buffering;
- luminancia;
- sobresaltos;
- sensación de continuidad.

No vale acelerar el reloj como sustituto.

Estado R01:
diseño de práctica completado.
Ejecución perceptiva real pendiente de un entorno de navegador/preview apropiado.

---

## Práctica 9 · Audio

Para cada paisaje/ambiente:
- medir loudness y true peak cuando el asset lo permita;
- escuchar inicio;
- transición;
- loop;
- fade;
- final;
- auriculares y altavoz de referencia cuando proceda;
- buscar hiss, clicks, pumping, capas agudas y picos.

Prueba negativa:
elevar volumen interno y cambiar de escena en mitad del fade.

PASS:
sin salto brusco ni dos capas residuales.

Matiz:
no afirmar SPL seguro desde LUFS de un fichero web; el nivel físico depende del dispositivo y del usuario.

---

## Práctica 10 · Accesibilidad del player

Teclado:
- tab;
- activación;
- controles;
- cambio de modo;
- clean screen;
- Escape.

Lector de pantalla:
- nombres;
- estado;
- tablist/tabpanel;
- instrucciones;
- canvas decorativo correctamente apartado cuando no contiene información.

Visual:
- foco;
- zoom;
- 320 px;
- 390×844;
- 1440×900;
- orientación/reflow.

Prueba negativa:
pantalla limpia + teclado únicamente.

FAIL:
salida invisible/inaccesible.

---

## Práctica 11 · Mobile composition

Comparar escritorio y 390×844:
- no recortar simplemente la composición;
- ajustar FOV/encuadre o composición;
- stage primero;
- controles fuera del centro;
- targets adecuados;
- safe-area;
- no solapamiento.

Prueba negativa:
320×800 + 200% zoom cuando proceda al control web.

---

## Práctica 12 · Performance

Medir:
- frame time;
- estabilidad;
- calidad adaptativa;
- long tasks;
- memoria aproximada;
- tamaño de canvas;
- bytes de assets;
- transferencia de media;
- recursos activos.

Pruebas negativas:
- throttling;
- GPU modesta;
- dispositivo de alta DPR;
- background;
- resize repetido.

PASS:
la calidad puede bajar de forma controlada antes de romper la interacción.

---

## Práctica 13 · Calidad perceptiva vs sofisticación

Comparar dos escenas:
A. shader complejo con mucho detalle;
B. visual simple pero coherente, continuo y cómodo.

Evaluar:
- propósito;
- inmersión;
- control;
- estabilidad;
- carga sensorial;
- legibilidad de UI;
- duración;
- rendimiento.

PASS:
ser capaz de elegir B cuando B sirve mejor al objetivo.

---

## Práctica 14 · Bilingüismo y lenguaje

Revisar ES/EN:
- mismos controles;
- mismo significado;
- misma información de privacidad;
- mismos límites;
- no texto técnico innecesario;
- no claims de terapia;
- no infantilización.

Prueba negativa:
buscar cadenas que existan solo en un idioma.

---

## Práctica 15 · Terceros y privacidad

Responder:
- ¿qué conexión externa ocurre?;
- ¿cuándo?;
- ¿por acción de quién?;
- ¿qué fallback existe?;
- ¿qué pasa si desaparece el tercero?;
- ¿qué política del proveedor puede cambiar?;
- ¿qué información debe mantener provenance?

PASS:
la experiencia no depende de ocultar la existencia del tercero.

---

# EXAMEN R01

Responder con evidencia, no de memoria:

1. ¿Cuál es mi profesión real?
2. ¿Por qué no soy simplemente Frontend Engineer?
3. ¿Por qué no soy XR Engineer exclusivamente?
4. ¿Qué diferencia hay entre inmersión y tecnología gráfica?
5. ¿Qué enseñó el HUMAN QA FAIL de #288?
6. ¿Cuándo WebGPU aporta valor?
7. ¿Qué debe pasar si falla el shader?
8. ¿Qué diferencia hay entre reduced y no-motion?
9. ¿Por qué un fallback estático puede ser correcto?
10. ¿Qué recursos deben detenerse al cambiar de modo?
11. ¿Por qué un vídeo 4K puede ser un mal paisaje?
12. ¿Qué hace que un loop sea perceptualmente malo?
13. ¿Por qué una prueba de 30 segundos no valida una sesión de 30 minutos?
14. ¿Qué diferencia hay entre volumen digital, LUFS y SPL físico?
15. ¿Por qué EBU R128 no se copia como target automático?
16. ¿Qué aporta ITU-T H.870 y cuál es su límite para una web?
17. ¿Qué exige control explícito en una experiencia de baja estimulación?
18. ¿Qué papel tiene COGA?
19. ¿Qué papel tiene Axioma frente a Lumen?
20. ¿Qué papel tiene Eco frente a Lumen?
21. ¿Qué papel tiene Prisma frente a Lumen?
22. ¿Qué papel tiene Motor frente a Lumen?
23. ¿Qué papel tiene Vector frente a Lumen?
24. ¿Qué significa “capacidad realmente integrada”?
25. ¿Cómo demuestro que no cargo YouTube al entrar?
26. ¿Qué hago si aparece publicidad en un paisaje?
27. ¿Qué significa HUMAN QA para Lumen?
28. ¿Qué evidencia técnica debo entregar además de capturas?
29. ¿Qué prueba negativa haría antes de confiar en pantalla limpia?
30. ¿Cuál es mi regla cuando una tecnología nueva no mejora una necesidad real?

## Respuestas nucleares del examen

- La persona y el propósito mandan sobre el motor.
- Progressive enhancement evita convertir hardware moderno en requisito de acceso.
- El estado real se lee en el producto/HEAD, no en la intención de una orden.
- Calidad audiovisual necesita observación humana prolongada.
- Accesibilidad no se añade al final.
- No-autoplay, pause/stop, preferencias sensoriales y salida recuperable son arquitectura.
- Audio seguro no se puede inferir solo desde un número digital sin conocer reproducción física.
- El tercero se trata como dependencia fallable y revisable.
- Lumen produce evidencia; Axioma determina/valida estándares en su función.
- Lumen construye experiencia audiovisual; Eco valida en su especialidad; Prisma gobierna plataforma UI; Motor runtime común; Vector integración/release; Astra arquitectura/gates.

## Gate de formación

Estado actual:
LUMEN_IMMERSIVE_MEDIA_FOUNDATION_STUDIED_R01

Completado:
- identidad profesional;
- estudio de fuentes;
- reconstrucción de incidentes;
- lectura de código vivo;
- diseño de prácticas y examen;
- pruebas negativas diseñadas;
- runbook.

Pendiente para un PASS práctico completo:
- ejecución audiovisual prolongada en preview real;
- perfilado representativo en dispositivos/navegadores;
- escucha HUMAN QA;
- observación visual HUMAN QA.

No declarar:
LUMEN_IMMERSIVE_MEDIA_FOUNDATION_PRACTICAL_PASS
hasta completar esas pruebas reales.
