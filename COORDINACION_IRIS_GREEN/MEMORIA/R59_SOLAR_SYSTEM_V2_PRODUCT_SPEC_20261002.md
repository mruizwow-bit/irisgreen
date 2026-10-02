# R59 · INTERÉS 02 · SISTEMA SOLAR V2 · PRODUCT SPEC

Fecha: 02/10/2026  
Owner producto Intereses: **Senda · R59**  
Autoridad: María / Astra · Issue #323  
Estado: `INTEREST_02_SOLAR_SYSTEM_V2_PRODUCT_AND_ASSET_AUDIT_PASS`

Este documento define **producto**. No autoriza código, imágenes, Batch 02 ni integración.

## 1. Decisión

El Sistema Solar actual pasa a:

`DONOR_RICH_DATA_AND_RENDERING__PRODUCT_ARCHITECTURE_REWORK`

Sistema Solar V2 se define como una experiencia de **escala y movimiento**, no como una enciclopedia que muestra simultáneamente planetas, enanos, 70 lunas, tablas y misiones.

Dirección:

`WORLD_SCENE_FIRST → COMPARE_ONE_SCALE_AT_A_TIME → MOVE_TIME_ON_ACTION → DEPTH_ON_DEMAND`

## 2. Pregunta central

### ES
**¿Qué cambia cuando comparas el tamaño, la distancia y el movimiento de los planetas?**

### EN
**What changes when you compare the planets’ size, distance and motion?**

## 3. Acción humana principal

**Elegir una forma de comparar → seleccionar un mundo → moverse entre el Sol y los planetas → cambiar de escala cuando quiera.**

Tres lentes, no tres dashboards:

1. **Tamaño / Size**
   - cuerpos a la misma escala de diámetro;
   - distancia ignorada.

2. **Distancia / Distance**
   - posiciones orbitales/distancias comparables;
   - tamaños visuales ampliados o simbólicos para ser legibles;
   - la distorsión se declara.

3. **Movimiento / Motion**
   - movimiento orbital como `SIMULATION`;
   - tiempo avanza solo tras acción;
   - pausa/step;
   - reduced/no-motion mantiene estados y relaciones sin animación continua.

La persona debe entender una idea central:
**no se puede mostrar al mismo tiempo tamaño y distancia reales en una pantalla normal sin que casi todo desaparezca.**

## 4. Primary mode

- primary_mode: `EXPLORE`
- secondary_modes: `COMPARE · SIMULATE · LEARN`
- map_role: `NONE`
- real_data: `YES`
- external_live_dependency: `NO`
- collection_role: `NONE_IN_V2_MINIMUM`

## 5. Primera experiencia

Un mundo del Sistema Solar con:

- Sol;
- Mercurio;
- Venus;
- Tierra;
- Marte;
- Júpiter;
- Saturno;
- Urano;
- Neptuno.

Los 9 cuerpos son los únicos targets primarios iniciales.

La escena no entra directamente en:
- planetas enanos;
- 70 lunas;
- misiones;
- tabla completa;
- mapa estelar;
- “Dónde están hoy” como tabla;
- colección.

## 6. Primer viewport

Debe contener solo:

1. título;
2. pregunta central;
3. escena del Sistema Solar;
4. selector compacto:
   - Tamaño;
   - Distancia;
   - Movimiento;
5. instrucción breve:
   - ES: **“Elige una escala y selecciona un planeta.”**
   - EN: **“Choose a scale and select a planet.”**
6. control claro para:
   - siguiente/anterior;
   - volver a vista general;
7. ficha contextual de un único cuerpo tras selección.

No:
- nueve fichas simultáneas;
- cifras de cientos de lunas;
- navegación enciclopédica antes de la escena.

## 7. Subset inicial

### Obligatorio
- Sol;
- 8 planetas.

### Lunas contextuales
Solo cuando se selecciona su planeta y como profundidad inmediata:

- Tierra → Luna;
- Júpiter → Io, Europa, Ganímedes;
- Saturno → Encélado, Titán.

Total contextual inicial:
**6 lunas**.

Motivo:
muestran diversidad suficiente:
- referencia terrestre;
- volcanismo;
- hielo/océano;
- mayor luna;
- géiseres/océano;
- atmósfera densa.

No cargar/mostrar las otras 64 lunas al entrar.

## 8. Qué queda en profundidad

### KEEP bajo demanda
- fichas completas de Sol + 8 planetas;
- 5 planetas enanos;
- las 70 lunas del snapshot actual;
- comparación detallada;
- tabla científica completa;
- fuentes/metodología;
- créditos de mapas de superficie;
- misiones como información secundaria;
- cálculo “Dónde están hoy”;
- descarga/datos si mantiene contrato vigente.

### Reordenar
Profundidad aparece después de la experiencia primaria, no antes.

## 9. Qué NO debe cargar al entrar

No eager:

- `es/intereses/sistema-solar/cielo-fondo.json` (~412 kB);
- fondo de 8.920 estrellas;
- 70 lunas como objetos interactivos;
- texturas/renders de 64 lunas no incluidas en subset;
- 5 planetas enanos;
- tablas completas como UI activa;
- Mi colección;
- imágenes/recursos de misiones;
- ninguna API NASA/JPL live.

El fondo estelar de Cielo 01 NO debe duplicarse como dependencia necesaria de 02.

## 10. REAL_DATA / CALCULATION / SIMULATION

### REAL_DATA
- diámetros;
- masas;
- periodos;
- distancias medias;
- propiedades físicas;
- recuentos de satélites como snapshot fechado;
- nomenclatura IAU/JPL/NASA;
- mapas/texturas cuando sean datos/derivados reales y estén correctamente acreditados.

### CALCULATION
- posición aproximada de planetas derivada localmente de elementos JPL;
- fecha/hora elegida;
- “Dónde están hoy”;
- comparaciones numéricas.

Regla:
JPL approximate positions:
`1800–2050`.

No llamarlo efeméride de alta precisión.

### SIMULATION
- animación de órbitas;
- reproducción/avance del tiempo;
- tamaños exagerados en vista de distancia;
- distancias comprimidas cuando se use una vista pedagógica;
- lunas colocadas por periodo/distancia cuando no representan posición exacta.

Debe decir:
**“Representación a escala…”** o **“Distancias comprimidas…”** según modo.

### RECONSTRUCTION
- superficies imaginadas/reconstruidas se etiquetan como recreación;
- nunca parecen una fotografía observada.

## 11. “Dónde están hoy”

Donor útil, pero:

`REWORK_TO_DEPTH`.

KEEP:
- cálculo local;
- fecha/hora;
- constelación/dirección;
- distancia aproximada.

DROP del primer viewport:
- tabla separada antes de explorar.

Puede vivir como acción:
**“Ver dónde están hoy” / “See where they are today”**.

## 12. Planetas enanos

`KEEP_DEPTH`.

No forman parte del subset inicial.

Ceres y Plutón pueden ser primeras entradas de profundidad.
Haumea/Makemake/Eris:
- datos KEEP;
- superficies recreadas deben seguir marcadas como reconstrucción.

## 13. Lunas

Datos de 70 lunas:
`KEEP_DEPTH`.

Current full selector:
`REWORK`.

V2:
- 6 lunas contextuales iniciales;
- resto bajo “Explorar más lunas”.

No usar “460 lunas” o un número similar como headline del producto.
Si se muestra un recuento, debe llevar fecha/snapshot.

## 14. Child-safe

`SAFE_BY_DEFAULT`.

- 0 geolocalización;
- 0 búsquedas externas;
- 0 autoplay;
- 0 streaks/recompensas;
- 0 enlaces externos en la primera experiencia;
- 0 inferencia de edad/diagnóstico;
- no recoger datos para explorar;
- seguridad solar aparece solo cuando se abre información de observación del Sol.

## 15. Keyboard / touch / pointer

Obligatorio:

- Tab entra en controles, no en decenas de objetos;
- selector de escala nativo/accesible;
- anterior/siguiente;
- lista DOM de cuerpos disponibles;
- touch target >=44 px según contrato Iris;
- drag/orbit-control nunca método único;
- selección por tap/click/Enter;
- reset de vista;
- foco no oculto por ficha/context panel.

## 16. Reduced / no motion

NORMAL:
- movimiento solo bajo acción;
- puede existir reproducción temporal controlada.

REDUCED:
- transiciones reducidas;
- movimiento orbital por pasos o desplazamiento discreto;
- sin vuelos de cámara.

NONE:
- escena estática;
- selector de fecha/step actualiza posición;
- mismas relaciones y datos.

No se pierde información.

## 17. 320 / 390

Móvil NO muestra “desktop en miniatura”.

### 320–390
- escena ocupa anchura;
- un cuerpo focal + contexto;
- tira/lista compacta de 9 cuerpos;
- tres lentes en control compacto;
- ficha debajo de escena;
- sin tabla horizontal en primer viewport.

Depth tables:
- reflow/scroll regional etiquetado cuando sea realmente tabular.

## 18. ES / EN

Mismos IDs, hechos, estados y unidades.

### ES
- “Planetas y sistema solar”
- “¿Qué cambia cuando comparas el tamaño, la distancia y el movimiento de los planetas?”
- “Tamaño · Distancia · Movimiento”
- “Explorar lunas”
- “Ver dónde están hoy”

### EN
- “Planets and the Solar System”
- “What changes when you compare the planets’ size, distance and motion?”
- “Size · Distance · Motion”
- “Explore moons”
- “See where they are today”

## 19. HUMAN QA

PASS humano si una persona puede:

1. entender qué cambia entre tamaño/distancia/movimiento;
2. identificar Sol + 8 planetas sin leer una tabla;
3. seleccionar Tierra, Marte, Júpiter y volver a vista general;
4. entender que una vista comprimida NO está a escala simultánea de tamaño y distancia;
5. distinguir cálculo de “hoy” de un feed live NASA/JPL;
6. pausar/evitar movimiento;
7. usar teclado y touch;
8. completar la experiencia en 390 y 320;
9. encontrar profundidad sin que ésta invada el inicio;
10. reconocer una luna contextual sin enfrentarse a 70 opciones.

FAIL si:
- parece dashboard;
- “todo JPL/NASA” domina la experiencia;
- la escala visual induce a error;
- las 70 lunas/5 enanos aparecen antes de que la persona los pida;
- 3D es obligatorio para acceder a hechos.

## 20. Decisión sobre nuevos assets

**No se solicitan nuevos assets para el V2 mínimo en este micro-bloque.**

Razón:
- Sol + 8 planetas tienen texturas existentes con procedencia/licencia documentada;
- existen renders first-party derivados para fallback/comparación;
- las 6 lunas contextuales tienen assets existentes;
- el problema principal es scope/jerarquía/runtime, no ausencia de imágenes.

Astra decidirá si una necesidad visual posterior entra en Batch 02.

## 21. Marcador

`INTEREST_02_SOLAR_SYSTEM_V2_PRODUCT_AND_ASSET_AUDIT_PASS`

Después:
**STOP Senda**.
