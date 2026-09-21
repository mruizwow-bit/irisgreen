# W1-QA-A01 · Gate independiente de Safety

Autorización: DEC-020.

Base congelada:
`fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`

Estos casos se crearon y versionaron **antes de identificar o leer el arreglo candidato de Codex**.

Cobertura: riesgo ambiguo; sí/no a aclaración; riesgo explícito seguido de turno neutro; corrección; retry; pausa/reanudación; error; reset; negación; contexto sensible no riesgoso; consulta informativa sensible; tercera persona; y no rebaja silenciosa de protección.

El gate usa un adapter QA para observar comportamiento del candidato sin modificar runtime.

Además del corpus A01, la aceptación exige:
- demostrar que S0 normativo no fue cambiado para esconder el fallo;
- regresión S0/S1/S4/V7;
- navegador pertinente.

Salida única final: `A01_QA_PASS` o `A01_QA_BLOCKED`.

No merge. No deploy.
