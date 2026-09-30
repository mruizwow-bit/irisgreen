## R44-A0 · revisión Aura · framework técnico PASS / pilotos R2 requerida · 30/09/2026

Estado:
`R44_A0_FRAMEWORK_TECH_PASS_PILOTS_PRODUCT_REWORK_REQUIRED`.

Artefactos revisados:
- `R44_A0_PRODUCTO.patch.gz` · 9 994 378 bytes · SHA-256 `0f7b8054145dafd102542fe1b44d9aef50a54e8192bc1bf04f9c29847f6e538a`;
- `R44_A0_retos_pilotos_1.png` · SHA-256 `6cdead1bd470b843b40c3b913f5f0c912e1fa5d46962c6624f284a62047ec28e`;
- `R44_A0_retos_pilotos_2.png` · SHA-256 `f8e766f6fcf791a3ed60ec7dc9060f9b8bb75518a5c70c65227f3f54aa8b46cc`.

### PASS técnico acotado

KEEP:
- namespace R44 propio;
- no toca `taller-retos.json` legacy;
- ocho IDs correctos E01/E06/E17/E22/E28/E34/E38/E44;
- panel montado después de `#igt-app`;
- estado de reto solo en memoria de pestaña;
- foco/aria-live/botón 44 px;
- E22 corrige la promesa “LED fundido”;
- detección del problema de taxonomía fue correcta.

### BLOQUEOS antes de review final

1. **ES/EN incompleto**
   - los 8 `en.alternativa` están vacíos;
   - `artefacto` es un único string en español y se renderiza también en EN;
   - por tanto el claim “ES/EN completo” no pasa.

2. **Contrato visual/producto R44 no cumplido**
   - los ocho pilotos entregados son paneles textuales;
   - no hay mini-escena/preview del resultado;
   - no se ve el artefacto final;
   - incumple el gate R44: “RETO = PROPUESTA VISUAL DE HACER ALGO”.

3. **CTA todavía no activa un reto real**
   - “Empezar el reto” solo cambia el estado local 0→1;
   - no carga starter/contexto, no enfoca una acción del workspace ni conecta el reto con el motor;
   - mantener sin puntuación, pero el inicio debe producir una entrada observable al reto real.

4. **Patch no está aislado**
   - el archivo llamado A0 contiene 41 commits, incluyendo R43/R54/R65;
   - para review/integración se exige patch/bundle R44-A0 aislado, no reinyectar la cadena histórica.

5. **No modificar el age gate global desde A0**
   - el A2 vivo ya tiene `assets/ig-audience.js` canónico con AGE_* / ALL_AGES;
   - el cambio R44 sobre una versión legacy es stale y debe desaparecer del patch A0;
   - R44 consume el contrato global, no lo reemplaza.

6. **Metadata de starter**
   - los ocho retos son “Todas”;
   - no fijar `starter_stage: AGE_0_12` para todos sin un starter infantil específico aprobado;
   - usar `ALL_AGES` hasta que exista variante real o declarar una variante por reto.

7. **Evidencia de handoff incompleta**
   - los adjuntos actuales no incluyen logs brutos de axe, reflow, teclado/foco y prueba de edad;
   - deben viajar con R2.

### Móvil

Las capturas muestran colisiones del shell/header en 390. No se atribuyen automáticamente a R44 porque el carril está sobre una base anterior al shell global actual.

Regla:
- NO arreglar header/nav global desde R44;
- rebase/reconciliar A0 contra la base Taller/R67 vigente para evidencia final;
- si una colisión persiste fuera del scope, registrar `R67_GLOBAL_SHELL_BLOCKER` sin invadir el carril.

### R2 mínima

No rehacer framework.

Corregir:
- bilingüe completo;
- preview/mini-escena y artefacto visible por piloto;
- CTA conectado a workspace/starter real;
- starter metadata;
- retirar delta stale de `ig-audience.js`;
- entregar patch/bundle A0 aislado;
- adjuntar logs brutos;
- recapturar evidencia 1440/390/320 LIGHT/DARK, ES/EN sobre base reconciliada.

Marcador esperado:
`R44_A0_FRAMEWORK_8_PILOTS_R2_READY_FOR_ASTRA_AURA_MARIA`.

No escalar a los 55.
No main.
No producción.
