# R60 · RESET tras HUMAN QA · ancla musical única antes de volver a 4 pilotos

Fecha: 29/09/2026
Autoridad de producto: María
Coordinación: Astra + Aura
Construcción: Claude
Integración posterior: A2
HUMAN QA final: María

Estado:
`R60_HUMAN_QA_RESET_SINGLE_ANCHOR_REQUIRED`

## 0. Decisión

La ronda de cuatro pilotos está rechazada por HUMAN QA.

No se autoriza otra ronda de cuatro piezas en paralelo.

Primero se construye **UNA sola ancla musical** que demuestre que el problema perceptivo está resuelto.

La referencia externa “Mist” puede estudiarse si el audio queda legítimamente accesible, pero **NO es requisito para continuar** y María no tiene que proporcionar ningún archivo para desbloquear el trabajo.

No entra audio externo en producto.

## 1. Diagnóstico raíz que se conserva

El hallazgo nuevo es válido y pasa a contrato de síntesis:

- el estéreo del material entregado estaba concentrado en el ataque;
- la cola era prácticamente mono;
- esa arquitectura generaba percepción de doble golpe/flam;
- la nueva dirección correcta es:
  **ataque único y centrado → apertura estéreo solo después del ataque**.

No basta con EQ final ni bajar volumen.

## 2. Arquitectura obligatoria del ancla

### Ataque

Cada nota o acorde debe tener **un único evento de excitación perceptible**.

Prohibido:
- duplicar toma L/R con retraso;
- Haas en el ataque;
- dos capas con ataques independientes casi simultáneos;
- chorus/delay que cree segundo golpe;
- reverb con early reflection que parezca otro onset.

Objetivo:
- componente SIDE prácticamente nulo en el primer tramo del ataque;
- imagen central estable al inicio;
- apertura posterior y suave.

### Estéreo tardío

La anchura nace después del ataque mediante:
- decorrelación allpass o equivalente que no cree nueva copia temporal;
- modulación muy lenta;
- envolvente de anchura separada de la envolvente de amplitud.

La cola puede ser amplia.
El transitorio no.

### Reverb

Separar envío de ataque y cola:
- ataque más seco y centrado;
- cola con más envío;
- pre-delay/early reflections no pueden introducir un segundo golpe;
- nada de splash brillante en cada nota.

## 3. Instrumento

Crear un instrumento eléctrico suave **original first-party**, con comportamiento tipo tecla/tine cálida pero sin copiar timbre ni fraseo de ninguna obra.

No reutilizar el motor que produjo la estridencia si para corregirlo hay que encadenar parches.

Si waveguide/FM/arco vuelve a producir:
- doble ataque;
- filo;
- resonancia estable en medios-agudos;
- hiss;
→ `TECHNIQUE_LIMIT_DETECTED`
→ cambiar de técnica.

Preferencia técnica para el ancla:
- excitación única corta y redondeada;
- cuerpo modal/aditivo amortiguado;
- saturación muy suave;
- parciales altos con caída rápida;
- cola armónica estable;
- sin ruido persistente salvo que sea inaudible como capa.

## 4. Composición

Ancla de 60–90 s.

No demostrar composición.
Demostrar **comodidad**.

Reglas:
- pocas notas;
- bastante separación;
- silencios/respiración reales;
- no ostinato;
- no melodía protagonista;
- no arpegio repetitivo;
- no percusión;
- no cambio brusco de registro;
- no cambio brusco de timbre;
- transiciones por continuidad de colas, no por insertar capas nuevas.

Una frase debe poder desaparecer sin que otra entre inmediatamente a reclamar atención.

## 5. Contrato perceptivo

La ancla falla inmediatamente si María oye:
- dos golpes en una nota;
- flam;
- ataque ancho;
- golpe lateral;
- campanilla/agudo que salta;
- hiss continuo;
- resonancia que se queda “encendida”;
- transición que pincha;
- nota que entra antes de que la anterior haya respirado;
- sensación de “música de relajación genérica” construida por clichés.

Objetivo:
**una sola nota entra limpia, queda tranquila y se abre después.**

## 6. Medición obligatoria, pero no gate humano

Por nota aislada y por pieza:
- onset count;
- side/mid o métrica equivalente por ventanas:
  0–20 ms;
  20–80 ms;
  80–200 ms;
  200–500 ms;
  500–1200 ms;
- energía 2–4 kHz y 4–8 kHz;
- crest/transiente;
- duración de cola;
- separación entre onsets;
- LUFS;
- true peak;
- DC;
- espectrograma.

Estas métricas sirven para detectar regresión.
NO convierten una pieza en aprobada si suena mal.

## 7. Referencia “Mist”

Si el archivo llega a estar accesible legítimamente:
- usarlo solo como referencia de estudio;
- medir ataque, espaciamiento, cola, densidad y anchura;
- no copiar melodía, armonía, interpretación ni audio;
- no incluir fragmentos en producto;
- no redistribuir el original.

Si NO está accesible:
- registrar `REFERENCE_AUDIO_UNAVAILABLE_NON_BLOCKING`;
- continuar con el contrato propio anterior.

No volver a pedir a María el MP3 como condición para avanzar.

## 8. Entrega

Entregar solo:
1. nota aislada del mecanismo nuevo;
2. ancla musical 60–90 s;
3. WAV 48 kHz/24 bit;
4. MP3/Opus;
5. generador/proyecto reproducible;
6. mediciones;
7. gráfico/tabla de anchura temporal;
8. breve comparación con la ronda fallida;
9. nota de escucha humana del constructor.

Marcador:
`R60_CLAUDE_SINGLE_ATTACK_LATE_STEREO_ANCHOR_READY_FOR_ASTRA_MARIA`

STOP.

No M01–M04 R2 todavía.
No largos.
No A2.
No retirar Pixabay todavía.
No main.
No producción.
