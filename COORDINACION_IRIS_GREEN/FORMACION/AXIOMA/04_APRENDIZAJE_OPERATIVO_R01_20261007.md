# AXIOMA · APRENDIZAJE OPERATIVO R01

Fecha: 07/10/2026
Estado: AXIOMA_R01_LEARNING_PERSISTED

## 1 · Un producto accesible puede seguir siendo un mal producto

La revisión de juegos 3D confirmó:
- semántica correcta no arregla una escena ilegible;
- teclado correcto no crea sentido de lugar;
- aria-live correcto no sustituye una consecuencia visual;
- fallback correcto no compensa que el 3D principal no comunique.

Regla:
ACCESSIBILITY_PASS != PRODUCT_PASS != HUMAN_QA_PASS.

## 2 · 3D: la escena debe hacer el trabajo

Fallo detectado:
DASHBOARD_READING / TECHNICAL_INFO_DOMINATES.

Si el estado real sólo se entiende en texto y el 3D apenas cambia, el 3D es decorativo.

Regla:
ACTION → VISIBLE_SCENE_CONSEQUENCE.
El panel textual debe contar el mismo estado como vía accesible.

## 3 · Sentido de lugar

Fallo aprendido:
NO_SENSE_OF_PLACE.

Síntomas:
- gris sobre gris;
- geometría grande que tapa el mundo;
- mapa flotando;
- persona demasiado pequeña;
- destino sin identidad;
- figuras repetidas como píldoras;
- escena con tema incompatible con la página.

Regla:
una escena urbana debe leerse primero como lugar y después como sistema.

## 4 · Densidad también comunica significado

Mercado, puente y avenida no pueden tener densidad arbitraria si la densidad representa carga de gente.

Regla:
visual semantics must match product semantics.

Ejemplo:
mercado = más lleno;
puente = tránsito;
avenida principal = menos densa que mercado si así está definido el producto.

## 5 · Fallback real y carga del motor

Un archivo puede ser correcto en producción y fallar al abrirse fuera del sitio si depende de rutas absolutas.

Regla:
distinguir:
- runtime de producción;
- artefacto descargable de HUMAN QA.

Nunca decir “3D funciona” si el artefacto que recibe María entra en fallback.

## 6 · No fabricar evidencia

Cuando IrisGreen/hardware no está disponible:
- no fabricar capturas;
- no simular que se ejecutó GPU real;
- declarar pendiente.

Esta limitación es evidencia honesta, no un defecto de proceso.

## 7 · ISO 24495-1 aplicado al producto

Texto observado:
“Le pesa el ruido intenso.”

Problema:
metáfora ambigua; exige interpretación.

Mejor:
“Prefiere evitar el ruido intenso.”

También:
“Elige el siguiente tramo con los botones de abajo.”
→ “Elige por dónde seguir.”

Regla:
el lenguaje claro reduce interpretación innecesaria y dependencia espacial.

## 8 · Lenguaje neutral

Evitar:
- déficit;
- juicio clínico innecesario;
- metáforas de carga cuando hay alternativa directa.

Preferir:
- preferencias;
- necesidades;
- condiciones observables;
- acciones concretas.

## 9 · Evidencia y juicio

Aprendizaje de GAMES_14:
las métricas del arnés y el juicio funcional son dimensiones distintas.

KEEP de layout NO significa juego bueno.
REBUILD visual NO significa mecánica mala.

Regla:
no colapsar ejes independientes.

## 10 · Oráculos útiles

Un verificador tiene valor cuando se demuestra que falla ante una mutación incorrecta.

Regla:
NO_NEGATIVE_TEST → LIMITED_CONFIDENCE.

## 11 · Fuente de verdad

Contradicciones entre:
- README;
- manifest;
- JSON;
- procedencia;
- HTML generado;
son defectos de trazabilidad aunque el producto visible esté bien.

## 12 · Qué no hacer

- no afirmar conformidad legal;
- no reabrir CSS si el defecto es sólo documental;
- no reescribir una escena entera si el finding es local;
- no aceptar un PASS de autor como retest independiente propio;
- no convertir HUMAN QA en resultado automático.
