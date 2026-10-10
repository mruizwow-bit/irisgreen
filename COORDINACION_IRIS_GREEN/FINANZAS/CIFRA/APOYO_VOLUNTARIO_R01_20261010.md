# CIFRA · APOYO VOLUNTARIO R01

Fecha: 10/10/2026
Issue: #413
PR: #414
Estado:
`STRIPE_PAYMENT_LINK_CONNECTED_REVIEW_PENDING_R01`

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

Payment Link configurado por María el 10/10/2026:
`https://buy.stripe.com/6oU7sMewr8chetZ3E53Je00`

Configuración declarada durante el alta:
- tipo: `Los clientes deciden qué pagar`;
- título: `Apoya Iris Green`;
- descripción: aportación voluntaria para mantener Iris Green abierto y actualizado;
- categoría Stripe: `Servicios > General > Gratificación opcional`;
- divisa: EUR;
- importe sugerido: 5 €;
- página de confirmación personalizada ES/EN;
- sin paywall ni cambio de acceso.

La web no recibe ni almacena PAN/CVC.

Decisión técnica:
el Payment Link es una URL pública y se enlaza directamente desde `/es/apoyar/` y `/en/support/`. No se usa endpoint intermedio de Netlify ni clave secreta para abrir el checkout.

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
