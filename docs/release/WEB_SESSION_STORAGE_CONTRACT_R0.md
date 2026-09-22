# WEB-REL-R0 · Contrato de sessionStorage

Un uso de Web Storage es publicable solo si están fijados clave, dato, duración, finalidad, acciones y divulgación.

## ig-idioma
- dato: `es|en`;
- duración: pestaña;
- finalidad: preferencia lingüística;
- compatible con Privacidad.

## ig-rutinas-hechos-ready / ig-rutinas-hechos-builder
- dato: arrays JSON de claves de pasos marcados;
- no guardan el texto libre del constructor mediante estas claves;
- duración: pestaña;
- finalidad: conservar marcas “hecho”;
- la herramienta avisa que se guardan solo durante la pestaña.

## ig-tarjeta-iris
- dato: idioma, forma, flag de ejemplo, texto libre de `cuesta/ayuda/necesito`, tres pasos y pictogramas;
- duración: pestaña;
- finalidad: conservar la Tarjeta Iris en curso;
- puede contener datos personales/especiales según lo que escriba la persona;
- no se autoriza transmisión, cookies, IndexedDB ni persistencia duradera;
- la propia herramienta informa: pestaña abierta, al cerrar no queda nada, no se envía;
- estado: `COMPATIBLE_WITH_PAGE_SPECIFIC_NOTICE`.

`sessionStorage` sí es almacenamiento aunque sea temporal; no debe resumirse como “no se guarda” sin ese matiz.

El contrato ejecutable es `config/release/browser-storage-contract-r0.json`. `scripts/audit_privacidad_almacenamiento.py` lo carga, resuelve las claves dinámicas de Rutinas y verifica divulgaciones.
