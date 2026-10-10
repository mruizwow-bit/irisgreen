# CIFRA · APOYO VOLUNTARIO R01

Fecha: 10/10/2026
Issue: #413
PR: #414
Estado:
`VOLUNTARY_SUPPORT_IMPLEMENTATION_IN_REVIEW_R01`

## Decisión de negocio

María decide mantener, por ahora, todos los recursos y experiencias de Iris Green disponibles para todo el mundo.

La primera vía de sostenibilidad será una **aportación voluntaria**.

No:
- paywall;
- suscripción;
- contenido bloqueado;
- ventajas por pagar;
- compras dentro de juegos;
- presión sobre menores.

Sí:
- tarjeta de apoyo discreta;
- página propia;
- pago alojado por Stripe;
- cantidad elegida por la persona;
- mensaje explícito de que aportar no cambia el acceso.

## Copy aprobado como base

**Iris Green es para todo el mundo**

Todos los recursos de Iris Green están disponibles para todo el mundo.

Mantenerlos actualizados, crear nuevos recursos y seguir desarrollando el proyecto requiere tiempo y recursos.

Si puedes y quieres ayudarnos, puedes hacer una aportación voluntaria. No importa la cantidad: cada aportación ayuda a mantener Iris Green abierto y a seguir creando.

**Tu aportación es voluntaria y no cambia tu acceso a la web.**

## Arquitectura

Página pública:
- `/es/apoyar/`
- `/en/support/`

Tarjeta:
- Inicio;
- Recursos;
- Juegos;
- Descubrimiento/Intereses;
- Taller/Creación.

Exclusión:
- Espacio tranquilo / Quiet Space.

Motivo:
una experiencia de regulación no debe incluir presión comercial.

## Stripe

Se usa Stripe Payment Link con importe elegido por la persona.

La web no recibe ni almacena PAN/CVC.

Activación técnica:
- `SUPPORT_PAYMENTS_ENABLED=true`
- `STRIPE_SUPPORT_PAYMENT_LINK=https://buy.stripe.com/...`

Mientras falte cualquiera de las dos condiciones, el endpoint responde como no disponible y no se inicia ningún cobro.

## Métricas futuras

Cuando esté live, Cifra medirá:
- visitas a la tarjeta;
- clic hacia apoyar;
- conversiones en Stripe;
- importe medio;
- importe mediano;
- distribución de importes;
- recurrencia natural de aportantes;
- comisión de procesamiento;
- ingreso neto;
- coste operativo mensual cubierto;
- porcentaje de usuarios que aporta.

No usar estas métricas para presionar al usuario.

## Gate de reconsideración

Solo reabrir pricing/paywall si:
1. existe un periodo suficiente de observación;
2. las aportaciones no cubren una parte sostenible de costes;
3. María autoriza volver a estudiar monetización;
4. se preserva una capa gratuita material.

El Issue #387 de suscripciones queda HOLD.
