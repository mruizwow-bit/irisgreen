# Gobernanza técnica · Iris Green

## Objetivo
Evitar que un agente, integración o workflow pueda convertir una tarea local en un cambio transversal no autorizado.

## Reglas
1. Todo cambio entra por rama + PR.
2. Los archivos sensibles están declarados en `.github/CODEOWNERS`.
3. Un PR que toque archivos sensibles falla el check `Gobernanza · archivos protegidos` salvo que lleve la etiqueta `maria-approved-protected-change`.
4. La etiqueta no sustituye la revisión humana: el ruleset de GitHub debe exigir CODEOWNERS + 1 aprobación + aprobación del último push.
5. Producción y review son carriles separados.
6. Sabik, Safety, Netlify, mantenimiento, workflows y build no se modifican como efecto secundario de otro carril.

## Ajustes administrativos obligatorios del ruleset
- required_approving_review_count = 1
- require_code_owner_review = true
- require_last_push_approval = true
- required_review_thread_resolution = true
- eliminar bypass permanente para roles usados por agentes
- exigir los checks:
  - Gobernanza · archivos protegidos
  - build principal
  - smoke Sabik
  - mantenimiento intacto

## Limitación actual
Mientras agentes y María compartan la misma identidad técnica de GitHub, la separación entre autor y aprobador no es criptográficamente fuerte. La solución definitiva es una identidad de ejecución separada (bot/app) y la cuenta de María reservada para aprobar/merge/producción.
