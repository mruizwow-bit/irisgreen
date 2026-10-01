# MOTOR · A5 · LABORATORIO R50 · IME SHORTCUT Y SCOPE DE FLECHAS

Fecha: 01/10/2026
Amplía: R01–R49
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Objetivo

Convertir dos candidatos de QA de R48 en evidencia ejecutada de contrato aislado:

1. shortcut de Sabik `Ctrl/Cmd+Enter` durante composición IME;
2. listener global de flechas del juego cuando el foco está fuera del tablero.

No se ejecutó Iris Green integrada.
No se declara bug de producto solo por estos laboratorios.

## 2 · Entorno

- Chromium 144.0.7559.96;
- Playwright;
- documento mínimo generado en memoria;
- handlers reproducidos con la misma lógica observada en los archivos A5;
- sin navegación, red ni producto.

## 3 · Caso A · shortcut de Sabik con isComposing=true

Lógica reproducida:

```js
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    form.requestSubmit();
  }
});
```

Evento sintético:

```js
new KeyboardEvent('keydown', {
  key: 'Enter',
  ctrlKey: true,
  isComposing: true,
  bubbles: true,
  cancelable: true
})
```

Resultado:

```json
{
  "submitCount": 1,
  "active": "i",
  "defaultPrevented": true,
  "isComposing": true
}
```

## 4 · Interpretación A

El handler aislado:
- recibió un evento con `isComposing=true`;
- no consultó ese flag;
- ejecutó `requestSubmit()`;
- el submit ocurrió una vez.

Hallazgo:
**el contrato actual del handler no protege explícitamente una composición activa.**

Clasificación:
`QA_CANDIDATE_UPGRADED_BY_SYNTHETIC_CONTRACT_EVIDENCE`.

No demostrado todavía:
- que un IME real en Windows/macOS/iOS/Android emita exactamente esa combinación;
- que el flujo integrado de Sabik produzca envío prematuro en un entorno real;
- que exista impacto para todos los IME.

Próxima prueba adecuada:
IME real + Sabik integrado.

## 5 · Acción profesional derivada

No corregir producto durante Formación.

Cuando toque QA/producto:
- probar IME real;
- si se reproduce, el guard típico sería comprobar `event.isComposing` antes de ejecutar el shortcut;
- verificar además Enter/shortcut en lectores de pantalla y teclados virtuales.

No introducir corrección preventiva sin gate/orden.

## 6 · Caso B · flecha global con foco externo

Lógica reproducida:

```js
document.addEventListener('keydown', function(e) {
  if (!state.play || !/^Arrow/.test(e.key)) return;
  moves++;
});
```

Preparación:
- `state.play = true`;
- foco en botón `#outside`, fuera del juego;
- se dispara `ArrowDown`.

Resultado:

```json
{
  "moves": 1,
  "active": "outside",
  "defaultPrevented": false,
  "dispatchReturn": true,
  "scrollBefore": 0,
  "scrollAfter": 0
}
```

## 7 · Interpretación B

El listener global:
- actuó aunque el foco estaba fuera del tablero;
- incrementó la lógica de movimiento;
- no hizo `preventDefault()`.

Hallazgo confirmado del contrato aislado:
**el scope del listener es document-wide mientras play está activo.**

Clasificación:
`QA_CANDIDATE_UPGRADED_BY_SYNTHETIC_CONTRACT_EVIDENCE`.

No demostrado:
- scroll simultáneo en la página real;
- conflicto con AT;
- impacto en la ruta integrada;
- que el modo play mantenga de hecho otros focos accesibles alrededor.

En este laboratorio:
`scrollY` permaneció 0.

Por tanto:
**NO se afirma conflicto de scroll.**

## 8 · Próxima prueba adecuada para B

En página integrada:
1. activar modo play;
2. mover foco a un control externo;
3. ArrowDown;
4. verificar:
   - jugador;
   - scroll;
   - foco;
   - announcements;
   - Escape/salida;
   - AT si procede.

Si el juego debe capturar flechas solo cuando su superficie tiene ownership:
scope deberá reflejarlo.

## 9 · Diferencia entre evidencia sintética e integrada

### Sintética
Demuestra:
- semántica del handler aislado;
- condiciones lógicas;
- falta/presencia de guards.

### Integrada
Demuestra:
- foco real;
- scroll/browser behavior;
- composición real;
- CSS/layout;
- otros listeners;
- tecnología de apoyo.

Motor no mezcla ambas categorías.

## 10 · Resultado

Checks:

1. evento `isComposing=true` llegó al handler: PASS.
2. shortcut ejecutó submit durante evento sintético composing: PASS como hallazgo.
3. foco externo estaba activo durante ArrowDown: PASS.
4. listener global ejecutó movimiento con foco externo: PASS como hallazgo.
5. no se observó preventDefault: PASS como observación.
6. no se demostró scroll conflict: explícitamente NO CONCLUIDO.

Marcador:

`MOTOR_SYNTHETIC_INPUT_CONTRACT_LAB_PASS_R50`

## 11 · Límites

No:
- issue de producto;
- fix;
- build;
- merge;
- deploy;
- main/producción.

Pendientes honestos:
- IME real;
- integración Sabik;
- integración juego;
- Firefox/WebKit;
- mobile;
- AT.
