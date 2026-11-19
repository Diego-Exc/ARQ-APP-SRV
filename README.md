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

## Cómo iniciar la app

### Backend (API)

El backend sigue el patrón hexagonal por módulo definido en [ADR 002](docs/adr/0002-estructura-interna-repositorio.md). Los 10 módulos del flujo principal (`identity`, `catalog`, `profiles`, `diagnosis`, `requests`, `matching`, `service_lifecycle`, `pricing`, `payments`, `ratings`) están implementados con repositorios en memoria (ver [ADR 0005](docs/adr/0005-simulacion-ia-pagos.md)); `notifications` y `admin` son stubs funcionales. El contrato REST completo está en [`docs/api/openapi.yaml`](docs/api/openapi.yaml) y el canal de tiempo real en [`docs/api/eventos-tiempo-real.md`](docs/api/eventos-tiempo-real.md).

```bash
cd backend
npm install
npm run dev        # http://localhost:3000/health
npm test           # pruebas unitarias (máquina de estados, matching, idempotencia de pagos)
npm run typecheck
```

El backend precarga datos de demostración al arrancar: 5 oficios, 6 técnicos en Medellín y dos usuarios Pro (`tecnico1.demo@arreglapues.app` / `tecnico4.demo@arreglapues.app`, contraseña `demo12345`). No hay base de datos real ni variables de entorno obligatorias; `JWT_SECRET` y `PORT` son opcionales.

### Aplicaciones móviles (`apps/customer_app`, `apps/pro_app`)

Ambas apps están migradas a **Expo** (resolviendo el pendiente que esta misma sección marcaba antes) y consumen el backend real por REST y WebSocket:

```bash
cd apps/customer_app   # o apps/pro_app
npm install
npx expo start         # escanear el QR con Expo Go, o presionar "w" para la versión web
npx tsc --noEmit        # chequeo de tipos
```

Por defecto apuntan a `http://localhost:3000/v1`. Para probar desde un dispositivo físico o un emulador Android, sobrescribir con la variable de entorno `EXPO_PUBLIC_API_URL` (en Android, usar `10.0.2.2` en vez de `localhost`).

La app Cliente crea una sesión de demostración automáticamente al abrir (ver `src/api/client.ts`). La app Pro pide iniciar sesión con uno de los dos usuarios Pro de demostración.

### Panel de administración (`apps/admin_web`)

Aún no tiene código; solo existe la carpeta reservada en la estructura del monorepo (ADR 002). El backend ya expone `GET /v1/admin/technicians/pending` y `POST /v1/admin/technicians/{id}/approve` para cuando se implemente.

### Panel de administración (`apps/admin_web`)

Aún no tiene código; solo existe la carpeta reservada en la estructura del monorepo (ADR 002).

### Lint global

```bash
npm install
npm run lint
```

## Estrategia de Branching

Adoptamos **GitHub Flow** como estrategia de branching, con `main` como única rama de integración protegida y ramas `feature/*` de corta duración para cada cambio.

La elección se sustenta en los siguientes criterios:

- **Tamaño del equipo.** El equipo está conformado por 2 integrantes trabajando sobre un monorepo (`backend/`, `apps/customer_app`, `apps/pro_app`). Un modelo con múltiples ramas de larga vida (GitFlow) introduciría sobrecarga de sincronización y merges que no se justifica con este volumen de trabajo; GitHub Flow permite que ambos integrantes converjan rápido sobre una sola línea principal.

- **Madurez del pipeline CI/CD.** El pipeline DevSecOps (Gitleaks + linter) se está introduciendo en esta misma práctica; aún no existe la madurez operativa para sostener múltiples ramas de integración (`develop`, `release/*`) con checks independientes en cada una. GitHub Flow concentra el control de calidad en un único punto: la protección de `main` con el status check `security-check`.

- **Complejidad del proceso de release.** El MVP académico se entrega como una única versión evaluable en cada corte del curso, sin necesidad de mantener releases paralelos ni hotfixes sobre versiones anteriores en producción. Esto hace innecesaria la complejidad de ramas `release/*` y `hotfix/*` propias de GitFlow o GitLab Flow.

- **Necesidad de soporte de múltiples versiones en paralelo.** No aplica: el proyecto no tiene versiones en producción que deban mantenerse simultáneamente; solo existe el MVP en desarrollo continuo hacia una ciudad piloto.

En consecuencia, cada cambio se desarrolla en una rama `feature/*` desde `main`, se integra mediante Pull Request revisado y validado por el pipeline de seguridad, y se despliega directamente desde `main` una vez aprobado.
