# SABIK WEB · PLAN DE IMPLEMENTACIÓN V0.1

**Fecha:** 20/09/2026  
**Coordinación:** Astra  
**Base protegida:** `sabik-preview@96ebf38a535fa287f32fee8c7957ede39933365c`  
**Tree protegido:** `c90f1e033d63ab61fdeb65c7577cce118bec35c8`  
**Rama de trabajo:** `sabik/implementation-plan-i0-20260920`

## 0. Regla de seguridad

- No tocar `main`.
- No tocar producción ni Netlify.
- No desplegar infraestructura cloud todavía.
- No entrenar ni publicar modelos de voz todavía.
- No abrir S2.
- Todo cambio debe ser aislado, reversible y revisable por PR contra `sabik-preview`.

## 1. Objetivo

Construir **Sabik Web** como capa asistente de Iris Green, no como chatbot generalista.

Flujo conceptual:

```text
persona
  ↓
entrada de texto o, más adelante, voz
  ↓
Sabik Core
  ↓
intención + parámetros
  ↓
política + acción permitida
  ↓
contenido / funciones de Iris
  ↓
resultado estructurado + fuentes + B3
  ↓
texto siempre disponible
  └─ voz propia Sabik cuando esté habilitada
```

Sabik Core debe ser independiente de:
- DOM/UI;
- proveedor cloud;
- STT;
- TTS;
- SDK propietario;
- persistencia de cuenta.

## 2. Contratos no negociables

- Navegación convencional siempre disponible.
- Sin perfiles diagnósticos ni inferencias de emoción, cansancio, ansiedad o capacidad cognitiva.
- Acciones tipadas y validadas; nunca JavaScript arbitrario generado.
- Acciones triviales y reversibles: ejecución directa.
- Acciones con efecto externo: confirmación explícita.
- Texto completo disponible aunque voz falle o esté desactivada.
- B3 conserva solo: PRESENTE, ORIENTAR, TRANSICIÓN, PAUSA, CONFIRMAR.
- Voz, micrófono, errores técnicos y actividad de red no crean estados B3 nuevos.
- Las respuestas deben estar sostenidas por contenido publicable de Iris.
- Por defecto no se guardan audio, transcripciones ni conversaciones completas.
- La voz de Sabik solo sintetiza respuestas autorizadas de Sabik; no se ofrece como clonador de texto libre.

## 3. Secuencia de implementación

### I0 · Contratos y corpus de prueba
**Objetivo:** congelar qué puede hacer Sabik y cómo se representa.

Entregables:
- catálogo inicial de 10–15 intenciones/acciones;
- esquemas versionados de entrada, intención, acción, resultado y B3;
- clasificación de riesgo y reglas de confirmación;
- campos que pueden salir del navegador;
- límites de sesión y presupuesto;
- comportamiento sin red;
- corpus de prueba con positivos, negativos, negaciones, correcciones, acciones encadenadas y fuera de alcance.

**Criterio de cierre:** contrato aprobado y casos ambiguos definidos antes de extraer lógica.

### I1 · Sabik Core portable por texto
**Objetivo:** separar la lógica reutilizable del navegador y de `window.NEA*`.

Entregables:
- `contracts/`
- `intent/`
- `actions/`
- `policy/`
- `search/`
- `presentation/`
- `b3/`
- adaptador de navegador;
- pruebas unitarias y de regresión.

**Criterio de cierre:** entradas equivalentes producen misma intención/parámetros; errores no ejecutan acciones; no hay dependencia de DOM/red/reloj/almacenamiento dentro del Core.

### I2 · Laboratorio cloud aislado
**Objetivo:** demostrar que el Core puede ejecutarse fuera del navegador sin acoplarlo a un proveedor.

Entregables:
- contenedor OCI reproducible;
- API CPU mínima;
- almacenamiento privado de artefactos/modelos;
- secretos;
- observabilidad sin contenido;
- límites de gasto;
- procedimiento de borrado/restauración.

**Candidato inicial de laboratorio:** Scaleway, sujeto a comparación y disponibilidad.  
**Alternativas:** AWS España, OVHcloud, Azure, Google Cloud/otros si aportan una ventaja material.

**Criterio de cierre:** entorno reproducible y destruible sin tocar Iris pública.

### I3 · Benchmark vocal
**Objetivo:** seleccionar STT/TTS por evidencia.

STT a comparar:
- faster-whisper;
- Qwen3-ASR;
- NVIDIA Parakeet.

TTS/voz propia a comparar:
- VoxCPM2;
- Chatterbox es-ES;
- Qwen3-TTS Base;
- CosyVoice3;
- OpenVoice solo como ruta de conversión timbre/acento si aporta valor.

Reglas:
- usar solo grabaciones originales autorizadas de la propietaria;
- SABIK 6 de ElevenLabs es referencia perceptiva, nunca dataset;
- revisar licencia de código, pesos, tokenizer, vocoder y dependencias por separado;
- medir español peninsular, fidelidad textual, timbre, prosodia, suavidad, baja proyección, edad percibida, fatiga en texto largo, latencia, VRAM/RAM, RTF y coste.

**Criterio de cierre:** modelo seleccionado por prueba ciega + métricas + licencia compatible.

### I4 · Integración de voz
**Objetivo:** añadir voz sin romper texto ni accesibilidad.

- opt-in;
- push-to-talk;
- transcripción final antes de ejecutar;
- reproducción progresiva;
- cancelar/repetir;
- sin eco autorreactivo;
- coordinación con lectores de pantalla;
- indicadores explícitos de micrófono/voz;
- degradación limpia a texto.

### I5 · Carga, seguridad y economía
- texto: 100k / 1M / 10M / 100M interacciones;
- voz: 1 / 10 / 100 concurrentes; 1.000 solo como prueba si procede;
- rate limiting por sesión y contexto, no solo IP;
- cola acotada;
- tope de GPU/segundos;
- caché de audio público aprobado por hash;
- no cachear respuestas personales en público;
- pruebas de caída, reinicio, cola llena y permisos denegados.

### I6 · Piloto y decisión de salida
- usuarios autorizados;
- pruebas cognitivas y de accesibilidad;
- revisión editorial y de privacidad;
- coste observado;
- rollback probado;
- autorización explícita antes de publicación.

## 4. Paralelización permitida

Después de cerrar I0:
- I1 Core texto puede avanzar.
- I3 benchmark vocal puede avanzar en paralelo.
- I2 laboratorio cloud puede prepararse únicamente cuando el benchmark necesite ejecutar modelos.

No bloquear I1 esperando la voz.

## 5. Primera lista de intenciones para I0

1. BUSCAR_CONTENIDO
2. ABRIR_CONTENIDO
3. LOCALIZAR_EN_IRIS
4. CAMBIAR_TAMANO_TEXTO
5. CAMBIAR_MOVIMIENTO
6. ACTIVAR_PASO_A_PASO
7. ACTIVAR_VISTA_SENCILLA
8. MOSTRAR_DETALLES
9. OCULTAR_DETALLES
10. SIGUIENTE
11. ATRAS
12. REPETIR_INDICACION
13. RESTABLECER_PREFERENCIAS
14. ACLARAR_SOLICITUD
15. FUERA_DE_ALCANCE

La lista no es definitiva hasta cierre de I0.

## 6. Riesgo y confirmación

### Sin confirmación
- buscar;
- abrir dentro de Iris;
- cambiar presentación reversible;
- navegar dentro de la tarea;
- mostrar/ocultar detalles.

### Con confirmación explícita
- enviar formularios;
- suscribirse;
- compartir información;
- borrar datos;
- cualquier acción con efecto externo irreversible o relevante.

## 7. Datos y privacidad

Preferencias visuales:
- pueden permanecer locales.

Backend:
- identificador efímero;
- contexto mínimo;
- sin historial persistente por defecto;
- audio/transcripción transitorios;
- métricas técnicas agregadas sin contenido;
- corpus/modelos privados separados del índice público.

## 8. Estado de voz

Codex está realizando el análisis vocal.  
No se fija todavía:
- modelo TTS ganador;
- STT ganador;
- CPU/GPU definitiva;
- nube definitiva;
- número de conversaciones por GPU;
- coste final.

Estas decisiones se toman con resultados de I3.

## 9. Decisión de infraestructura

No migrar Iris antes de necesitarlo.

Primera arquitectura de trabajo:
- Iris/CDN: Netlify actual.
- Sabik Core: portable.
- Laboratorio de inferencia: separado.
- Contenedores OCI + almacenamiento compatible S3 para reducir lock-in.

La nube definitiva se decide después del benchmark de voz y del coste real.

## 10. Primer hito ejecutable

El primer hito es **I0**.  
No se empieza por voz, nube ni migración.  
Se empieza por definir y probar el contrato de comportamiento de Sabik.

