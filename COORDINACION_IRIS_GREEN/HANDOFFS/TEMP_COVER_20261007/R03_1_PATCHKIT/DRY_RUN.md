# R03.1 patchkit dry-run

Probado contra un fixture sintético que reproduce los patrones relevantes de R03 base.

Resultado de `qa_static_r031.py` tras aplicar `apply_r031_v2.py`:

`13 PASA · 0 FALLA`

Cubre inserción de secciones, conversión de los dos peces, desacoplo PNG, retirada de revelado global por centro, shader por fragmento, eliminación del estado activo billboard, versión R03.1, sincronización documental y alcance taxonómico.

El oracle de navegador `qa_browser_r031.js` pasa `node --check`. La ejecución WebGL queda para un runtime servido.
