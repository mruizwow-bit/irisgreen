# MOTOR · A5 · GAP REVIEW R53 · EVIDENCIA CROSS-BROWSER Y LÍMITES DE ENTORNO

Fecha: 01/10/2026
Amplía: R33/R49–R52
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Objetivo

Auditar qué navegadores están realmente disponibles en el entorno de laboratorio antes de usar palabras como:
- cross-browser;
- Firefox PASS;
- WebKit PASS;
- Safari PASS.

Regla:
**un test no ejecutado no es PASS.**

## 2 · Inventario ejecutado

Entorno actual:

```json
{
  "system_chromium": "/usr/bin/chromium",
  "system_firefox": null,
  "system_webkit": null,
  "playwright_cache": "/home/oai/.cache/ms-playwright",
  "playwright_entries": []
}
```

Resultado:
- Chromium disponible;
- Firefox no disponible;
- WebKit no disponible;
- no existen bundles de browsers Playwright en cache.

## 3 · Consecuencia

Laboratorios R47/R49/R50/R51/R52 ejecutados en Chromium:

pueden afirmar:
`CHROMIUM_LAB_PASS`.

No pueden afirmar:
`CROSS_BROWSER_PASS`.

No pueden extrapolar a:
- Firefox;
- Safari;
- iOS WebKit;
- Android WebView;
- embedded browsers.

## 4 · Chromium version

Laboratorios recientes:
Chromium:
`144.0.7559.96`.

Registrar versión es importante:
comportamiento puede cambiar entre releases.

No decir:
“Chrome siempre hace X”.

## 5 · Playwright projects

R33 ya estudió:
- Chromium;
- Firefox;
- WebKit projects.

Pero teoría/configuración ≠ ejecución.

Estado actual:
**cross-engine practice pending environment**.

## 6 · Browser engine matrix futura

Cuando entorno lo permita:

| Engine | Desktop | Mobile emulation | Real device |
|---|---:|---:|---:|
| Chromium/Blink | test | test | selected |
| Firefox/Gecko | test | n/a/limited | selected if needed |
| WebKit | test | test | Safari/iOS real |

Playwright WebKit:
aproxima engine WebKit,
pero no sustituye completamente Safari/iOS hardware/OS.

## 7 · Contract suite común

Ejecutar misma suite para:
- state machines;
- pointer;
- IME synthetic;
- File API;
- content-visibility;
- WebGL capability/fallback;
- storage;
- dialogs/popovers;
- view transitions when supported.

No crear tests diferentes que oculten incompatibilidades.

## 8 · Capability-aware assertions

Una feature Limited availability:
no debe producir:
“Firefox FAIL”
si fallback correcto.

El test debe decir:

```
if capability:
  primary PASS
else:
  fallback PASS
```

FAIL:
si ninguna ruta conserva tarea.

## 9 · API absent vs engine bug

Distinguir:
- unsupported feature;
- known implementation gap;
- broken fallback;
- product bug.

No etiquetar “Safari bug” solo porque API no exista.

## 10 · WebGL

R49/R51:
SwiftShader Chromium.

Pendiente:
- Firefox software/hardware WebGL;
- WebKit;
- hardware GPU.

Context loss contract forma parte de spec, pero framework/browser behavior integrado necesita ejecución.

## 11 · IME

R50:
synthetic KeyboardEvent en Chromium.

No demuestra:
- Windows IME;
- macOS;
- Android Gboard;
- iOS;
- CJK real.

IME es además OS-level behavior.

Cross-browser matrix por sí sola tampoco basta.

## 12 · content-visibility

R47:
Chromium lab PASS.

Aunque feature es Baseline 2024:
pendiente:
- Firefox;
- WebKit;
- screen readers;
- find-in-page real.

No usar Baseline como sustituto de QA.

## 13 · Accessibility tooling

axe/playwright automation:
útil.

No reemplaza:
- NVDA/JAWS/VoiceOver/TalkBack;
- keyboard real;
- zoom native;
- sensory HUMAN QA.

Axioma define conformidad.

## 14 · Mobile

Desktop browser emulation no reproduce:
- memory pressure;
- thermal throttling;
- virtual keyboard exacto;
- app kill;
- battery;
- mobile GPU;
- touch hardware.

R32 mantiene estos gaps abiertos.

## 15 · Evidence labels de Motor

A partir de R53 usar etiquetas claras:

`UNIT_PASS`
`SYNTHETIC_BROWSER_PASS`
`CHROMIUM_LAB_PASS`
`ENGINE_MATRIX_PASS`
`REAL_DEVICE_PASS`
`INTEGRATION_PASS`
`HUMAN_QA_PASS`

No sustituir unas por otras.

## 16 · Example

R51:
correcto:
`CHROMIUM_SWIFTSHADER_WEBGL2_5_CYCLES_PASS`.

Incorrecto:
`WEBGL_RECOVERY_CROSS_BROWSER_PASS`.

## 17 · CI environment

Un CI con Chromium puede ser excelente gate de regresión.

Pero el nombre debe reflejarlo.

Ejemplo:
`runtime-contract-chromium`.

No:
`browser-compatibility-pass`
si no ejecuta otros engines.

## 18 · When to require all engines

Prioridad alta:
- core navigation;
- forms;
- storage;
- input;
- content;
- Sabik panel.

Feature-specific:
- WebGL/WebGPU;
- File System Access;
- advanced media.

Si feature no existe en engine:
fallback es parte de compatibilidad.

## 19 · When real Safari matters

Especialmente:
- iOS virtual keyboard;
- audio autoplay/session;
- touch gestures;
- PWA/lifecycle;
- file picker;
- WebGL/mobile;
- viewport.

WebKit Playwright reduce riesgo pero no cierra hardware/OS gap.

## 20 · When real Firefox matters

Especialmente:
- beforeunload/bfcache;
- focus;
- form controls;
- storage;
- accessibility integrations;
- CSS differences.

## 21 · Installation boundary

No se instalaron navegadores durante esta práctica.

Razón:
Jornada de Formación no requiere modificar entorno externo innecesariamente y el tooling disponible no garantiza instalación.

No prometer práctica que el entorno no permite.

## 22 · Reporting gaps

Si una feature solo se probó en Chromium:
documentar:
`GECKO_NOT_EXECUTED`
`WEBKIT_NOT_EXECUTED`.

No:
`pending maybe okay`.

## 23 · Risk prioritization

No todos los gaps tienen mismo riesgo.

### P0-like evidence gap
core action untested outside one engine.

### Medium
optional enhancement untested but fallback simple.

### Low
diagnostic API only.

Astra puede priorizar cuando vuelva desarrollo.

## 24 · Current training evidence

R49:
Chromium lab.

R50:
Chromium synthetic.

R51:
Chromium/Xvfb SwiftShader.

R52:
Chromium synthetic DOM lifecycle.

R53:
environment inventory.

Esto convierte límites en trazabilidad.

## 25 · Next environment gate

Antes de afirmar engine matrix:

```
BROWSER_BINARIES_PRESENT
+ VERSION RECORDED
+ SAME TEST CONTRACT
+ FEATURE/FALLBACK ASSERTIONS
+ REPORT PER ENGINE
```

## 26 · Marcador

`MOTOR_CROSS_BROWSER_EVIDENCE_BOUNDARY_REVIEWED_R53`

## 27 · Límites

No:
- Firefox/WebKit install;
- cross-browser PASS;
- product changes;
- build;
- merge;
- deploy;
- main/production.
