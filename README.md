# Servicios del Hogar

Marketplace de servicios del hogar con dos aplicaciones móviles (cliente y profesional). El usuario describe un daño (texto, foto o voz); el sistema clasifica el oficio mediante inteligencia artificial y conecta con técnicos cercanos disponibles, con tarifas y pago dentro de la plataforma.

Ver `docs/01-investigacion-inicial.md` y `docs/02-arquitectura-principios.md` para el detalle completo del producto y la arquitectura (monolito modular).

## Estructura del repositorio

```
backend/        API — monolito modular, módulos por bounded context
apps/
  customer_app/ App móvil de cliente (React Native)
  pro_app/      App móvil de profesional (React Native)
  admin_web/    Panel de administración
docs/           Documentación de producto, arquitectura y ADRs
infra/          Infraestructura y despliegue
```

## Estrategia de Branching

Adoptamos **GitHub Flow** como estrategia de branching, con `main` como única rama de integración protegida y ramas `feature/*` de corta duración para cada cambio.

La elección se sustenta en los siguientes criterios:

- **Tamaño del equipo.** El equipo está conformado por 2 integrantes trabajando sobre un monorepo (`backend/`, `apps/customer_app`, `apps/pro_app`). Un modelo con múltiples ramas de larga vida (GitFlow) introduciría sobrecarga de sincronización y merges que no se justifica con este volumen de trabajo; GitHub Flow permite que ambos integrantes converjan rápido sobre una sola línea principal.

- **Madurez del pipeline CI/CD.** El pipeline DevSecOps (Gitleaks + linter) se está introduciendo en esta misma práctica; aún no existe la madurez operativa para sostener múltiples ramas de integración (`develop`, `release/*`) con checks independientes en cada una. GitHub Flow concentra el control de calidad en un único punto: la protección de `main` con el status check `security-check`.

- **Complejidad del proceso de release.** El MVP académico se entrega como una única versión evaluable en cada corte del curso, sin necesidad de mantener releases paralelos ni hotfixes sobre versiones anteriores en producción. Esto hace innecesaria la complejidad de ramas `release/*` y `hotfix/*` propias de GitFlow o GitLab Flow.

- **Necesidad de soporte de múltiples versiones en paralelo.** No aplica: el proyecto no tiene versiones en producción que deban mantenerse simultáneamente; solo existe el MVP en desarrollo continuo hacia una ciudad piloto.

En consecuencia, cada cambio se desarrolla en una rama `feature/*` desde `main`, se integra mediante Pull Request revisado y validado por el pipeline de seguridad, y se despliega directamente desde `main` una vez aprobado.
