# I0 · CONTRATO INICIAL DE SABIK WEB

**Estado:** borrador de ejecución  
**Fecha:** 20/09/2026  
**Base:** `sabik-preview@96ebf38a535fa287f32fee8c7957ede39933365c`

## 1. Propósito

Definir el comportamiento observable y los contratos de datos antes de extraer o reescribir lógica.

## 2. Contratos de entrada y salida

### Entrada normalizada

```ts
type SabikInput = {
  sessionId: string;
  locale: string;
  text: string;
  currentRoute: string;
  currentContentId?: string;
  preferences: {
    motion?: "normal" | "reduced" | "none";
    textSize?: "normal" | "large" | "xlarge";
    stepByStep?: boolean;
    simpleView?: boolean;
  };
};
```

Reglas:
- `text` tiene longitud máxima definida en implementación.
- no se aceptan URLs, código ni comandos como acciones ejecutables;
- locale y rutas se validan contra catálogos permitidos;
- preferencias son declaradas, no inferidas.

### Resultado de intención

```ts
type SabikIntentResult = {
  intent: string;
  confidence: number;
  parameters: Record<string, string | number | boolean>;
  needsClarification: boolean;
  clarificationQuestion?: string;
};
```

### Acción tipada

```ts
type SabikAction = {
  type: string;
  parameters: Record<string, string | number | boolean>;
  risk: "local_reversible" | "external_effect";
  requiresConfirmation: boolean;
};
```

### Respuesta

```ts
type SabikResult = {
  kind: "response" | "clarification" | "insufficient" | "human_help";
  text: string;
  sources: Array<{
    contentId: string;
    url: string;
    title: string;
  }>;
  actions: SabikAction[];
  b3: "PRESENTE" | "ORIENTAR" | "TRANSICIÓN" | "PAUSA" | "CONFIRMAR";
};
```

## 3. Catálogo inicial de intenciones

| Intención | Parámetros | Acción | Confirmación |
|---|---|---|---|
| BUSCAR_CONTENIDO | query | buscar índice | no |
| ABRIR_CONTENIDO | contentId/route | navegar dentro de Iris | no |
| LOCALIZAR_EN_IRIS | concept | devolver ubicación + orientar | no |
| CAMBIAR_TAMANO_TEXTO | size | preferencia reversible | no |
| CAMBIAR_MOVIMIENTO | motion | preferencia reversible | no |
| ACTIVAR_PASO_A_PASO | enabled | preferencia reversible | no |
| ACTIVAR_VISTA_SENCILLA | enabled | preferencia reversible | no |
| MOSTRAR_DETALLES | contentId | abrir detalles | no |
| OCULTAR_DETALLES | contentId | cerrar detalles | no |
| SIGUIENTE | contextId | avanzar en flujo | no |
| ATRAS | contextId | retroceder en flujo | no |
| REPETIR_INDICACION | contextId | volver a mostrar instrucción | no |
| RESTABLECER_PREFERENCIAS | scope | restaurar preferencias Sabik | confirmar solo si afecta persistencia guardada |
| ACLARAR_SOLICITUD | — | preguntar una sola aclaración | no |
| FUERA_DE_ALCANCE | — | explicar límite y opciones válidas | no |

## 4. Casos con efecto externo

No forman parte del primer catálogo ejecutable, pero el contrato reserva:

- ENVIAR_FORMULARIO
- SUSCRIBIR
- COMPARTIR
- BORRAR_DATO

Todos:
- `risk = external_effect`
- `requiresConfirmation = true`
- confirmación ligada a acción + parámetros + sesión + expiración;
- nunca ejecutar dos veces la misma confirmación.

## 5. Proyección B3

Reglas iniciales:

- búsqueda/listado de opciones → ORIENTAR;
- cambio real de etapa/ruta → TRANSICIÓN;
- pausa funcional explícita → PAUSA;
- acción reversible completada → CONFIRMAR;
- disponibilidad estable sin acción nueva → PRESENTE.

No crear estados B3 para:
- micrófono;
- voz;
- escucha;
- procesamiento;
- error técnico;
- emoción;
- diagnóstico.

## 6. Comportamiento ante ambigüedad

- Nunca ejecutar por similitud débil.
- Preferir una única pregunta de aclaración.
- Mantener el texto original de la persona como dato transitorio, no persistente por defecto.
- Si dos acciones incompatibles tienen confianza comparable, no ejecutar ninguna.

## 7. Corpus mínimo de I0

El corpus de validación deberá tener al menos 300 casos separados del conjunto de desarrollo.

Debe incluir:
- paráfrasis;
- negaciones;
- correcciones;
- errores ortográficos;
- peticiones encadenadas;
- referencias como "eso", "ahí", "lo anterior";
- consultas fuera de alcance;
- frases potencialmente ambiguas;
- contenido de salud sin usarlo para inferir diagnósticos;
- variantes ES/EN/PT cuando entren en alcance.

Ejemplos críticos:

- "Pon el texto más grande."
- "No pongas el texto más grande."
- "Enséñamelo paso a paso."
- "No quiero paso a paso."
- "Busca pensamientos intrusivos."
- "¿Dónde está la información sobre TOC?"
- "Vuelve atrás."
- "No vuelvas atrás."
- "Hazlo más sencillo." → debe aclarar si no existe una transformación editorial aprobada.
- "Suscríbeme." → no ejecutar en I0; acción externa futura con confirmación.

## 8. Requisitos de privacidad

- preferencias visuales pueden permanecer locales;
- no historial persistente de conversación;
- no diagnósticos;
- no estado emocional inferido;
- no audio/transcripción en logs;
- observabilidad sin contenido sensible;
- corpus de voz privado y separado del índice público.

## 9. Criterios de cierre de I0

I0 se considera cerrado cuando:

1. catálogo de intenciones aprobado;
2. esquemas versionados aprobados;
3. matriz riesgo/confirmación aprobada;
4. proyección B3 aprobada;
5. datos que salen del navegador documentados;
6. comportamiento sin red documentado;
7. corpus de prueba creado y separado del desarrollo;
8. casos ambiguos/fuera de alcance definidos;
9. ninguna regla contradice S0/S1;
10. no se ha tocado producción, `main`, Netlify ni S2.

## 10. Siguiente paso tras cierre

Abrir I1 para extraer un Sabik Core portable manteniendo la suite S0/S1 y sin integrar todavía STT/TTS en producción.
