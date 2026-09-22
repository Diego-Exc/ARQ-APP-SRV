# Arquitectura del sistema — Principios y organización

> Documento de arquitectura del proyecto. Define drivers, principios, módulos de dominio, organización del sistema y criterios de trazabilidad para el diseño e implementación.

**Estilo arquitectónico del MVP:** monolito modular (Modular Monolith) con límites de dominio definidos. La estructura permite evolución hacia servicios independientes en fases posteriores, manteniendo la cohesión de módulos.

---

## 1. Drivers arquitectónicos

| Driver | Relevancia en el sistema |
|---|---|
| Matching en tiempo casi real | Asignación de técnicos cercanos disponibles |
| Confianza y seguridad | Verificación, seguimiento y gestión de disputas |
| Pagos confiables | Comisión, liquidación y reembolsos |
| Clasificación por IA | Traducción de descripción ambigua a oficio del catálogo |
| Dos clientes móviles | Aplicaciones de cliente y profesional sobre la misma API |
| Evolución por fases | Extensión de oficios y cobertura geográfica |
| Entrega académica trazable | Documentación, diagramas, ADRs y correspondencia caso de uso–módulo |

**Atributos de calidad prioritarios del MVP:**

1. **Modificabilidad** — incorporación de oficios o medios de pago sin rediseño global  
2. **Seguridad** — autenticación, roles, protección de datos y pagos  
3. **Disponibilidad** — continuidad del flujo principal ante fallos parciales (p. ej. IA)  
4. **Usabilidad / latencia percibida** — claridad de matching y estados  
5. **Observabilidad** — diagnóstico de fallos en pago, matching e IA  

La escalabilidad masiva no constituye driver del MVP; el diseño preserva vías de crecimiento.

---

## 2. Principios de arquitectura

### P1 — Separación de responsabilidades
Cada módulo posee un único motivo principal de cambio.  
El módulo de pagos no incorpora lógica de prompts de IA; el módulo de matching no procesa cobros.

### P2 — Dependencias hacia adentro (arquitectura hexagonal)
- El dominio no depende de frameworks de presentación ni de proveedores externos.
- La infraestructura adapta el dominio a tecnologías concretas mediante puertos y adaptadores.
- Facilita pruebas y sustitución de pasarela o proveedor de IA.

### P3 — Monolito modular
Un único artefacto desplegable en el MVP, con límites de módulo equivalentes a contextos delimitados:
- prohibición de acceso interno arbitrario entre módulos
- interacción mediante APIs internas o eventos de aplicación

### P4 — Contrato único de API
Las aplicaciones consumen la misma API de backend con roles `CLIENT`, `PRO` y `ADMIN`, evitando duplicación de reglas de negocio en los clientes.

### P5 — Aislamiento de fallos
- Fallo de IA: selección manual de categoría.
- Fallo de mapas: uso de dirección registrada o última ubicación válida.
- Fallo de pasarela: el servicio no se registra como pagado.

### P6 — Fuente de verdad
- Estado del servicio: máquina de estados en backend.
- Dinero: registros de pago y liquidación en backend.
- Verificación del técnico: backend y panel de administración.

### P7 — Decisiones documentadas (ADR)
Las decisiones arquitectónicas relevantes se registran en Architecture Decision Records con contexto, decisión y consecuencias.

### P8 — Extensibilidad controlada
No se introducen infraestructuras distribuidas innecesarias en el MVP. Se definen interfaces en puntos de cambio previsible (pagos, IA, notificaciones).

### P9 — Seguridad por diseño
- Privilegio mínimo por rol
- Secretos fuera del código fuente
- Minimización de datos sensibles
- Auditoría de acciones críticas

### P10 — Trazabilidad producto–arquitectura
Cada caso de uso del MVP se asocia a módulo(s), endpoint(s) y diagrama de secuencia.

---

## 3. Contextos y módulos de dominio

El sistema se organiza en bounded contexts:

```
┌─────────────────────────────────────────────────────────────┐
│                     Plataforma (API)                        │
│                                                             │
│  Identity & Access    Catalog (oficios)    Profiles         │
│  Requests             Diagnosis (IA)       Matching         │
│  Service Lifecycle    Pricing              Payments         │
│  Ratings & Disputes   Notifications        Admin / Ops      │
│                                                             │
│  Shared Kernel: geo primitives, money, audit, ids           │
└─────────────────────────────────────────────────────────────┘
        ▲                         ▲
   App Cliente               App Profesional
```

| Módulo | Responsabilidad | Fuera de alcance del módulo |
|---|---|---|
| Identity & Access | Registro, autenticación, roles y sesiones | Reglas de matching |
| Catalog | Oficios, servicios estándar y taxonomía | Cobros |
| Profiles | Perfiles, zona de cobertura y documentación KYC | Ejecución de pagos |
| Requests | Solicitud, evidencias y dirección | Asignación autónoma de técnico |
| Diagnosis (IA) | Clasificación de oficio, urgencia y preguntas | Garantía de reparación |
| Matching | Candidatos, ranking y asignación | Operación de pasarela |
| Service Lifecycle | Máquina de estados del servicio | Interfaz móvil |
| Pricing | Tarifas, cotizaciones y comisión | Contabilidad fiscal completa |
| Payments | Cobro, liquidación y reembolsos | Clasificación de daños |
| Ratings & Disputes | Calificaciones y reclamos | Reasignación arbitraria de matching |
| Notifications | Push, correo y SMS | Reglas de negocio de dominio |
| Admin | Aprobaciones, parámetros y soporte | Sustitución de las aplicaciones |

### Shared Kernel
Tipos compartidos mínimos:
- `Money` (monto y moneda)
- `GeoPoint` / radio de búsqueda
- `UserId`, `ServiceId`
- eventos de auditoría

Los elementos dudosos no se incorporan al shared kernel; se exponen por interfaz o se mantienen locales al módulo.

---

## 4. Capas por módulo

Estructura interna (Clean Architecture):

```
module/
  domain/          # entidades, value objects, políticas, eventos
  application/     # casos de uso, comandos y consultas
  ports/           # interfaces (repositorios y gateways)
  adapters/        # base de datos, HTTP y proveedores externos
  api/             # controladores / rutas del módulo
```

Dependencias permitidas:  
`api → application → domain`  
`adapters → application/ports`  
`domain` no depende de adapters.

---

## 5. Flujos de casos de uso

**Caso:** creación de solicitud con clasificación y candidatos

```
App Cliente
   → API HTTP
      → Requests.CreateRequest
         → Diagnosis.Classify(damage)
         → Catalog.ResolveTrade
         → Matching.FindCandidates(geo, trade, availability)
      ← DTO: oficio + lista de técnicos
```

**Caso:** aceptación por el técnico

```
App Pro → ServiceLifecycle.Accept
   → validación de estado
   → reserva de asignación
   → Notifications.NotifyClient
   → evento ServiceAccepted
```

**Caso:** pago al completar

```
ServiceLifecycle.Complete
   → Pricing.ComputeFinalAmount
   → Payments.CaptureOrCharge
   → Ratings.OpenRatingWindow
```

---

## 6. Máquina de estados del servicio

```
DRAFT → SUBMITTED → MATCHING → ASSIGNED → EN_ROUTE
  → IN_PROGRESS → COMPLETED → RATED
                 ↘ CANCELLED
                 ↘ DISPUTED
```

Reglas:
- Únicamente transiciones definidas en el dominio.
- Las aplicaciones muestran el estado reportado por el backend.
- Las acciones críticas quedan registradas en auditoría.

---

## 7. Vistas C4

| Nivel | Contenido |
|---|---|
| C1 Context | Usuario, técnico, administrador, pasarela, IA, mapas, notificaciones |
| C2 Containers | App cliente, app profesional, API, base de datos, almacenamiento, workers |
| C3 Components | Módulos de dominio dentro de la API |
| C4 Code | Detalle selectivo de matching o payments |

Los diagramas de secuencia complementan los casos de uso críticos.

---

## 8. Organización del repositorio

```
/
  docs/
    01-investigacion-inicial.md
    02-arquitectura-principios.md
    03-alcance-mvp.md
    adr/
      0001-monolito-modular.md
      0002-estrategia-matching.md
      0003-pasarela-pagos.md
    diagrams/
  apps/
    customer_app/
    pro_app/
    admin_web/
  backend/
    src/
      modules/
        identity/
        catalog/
        profiles/
        requests/
        diagnosis/
        matching/
        service_lifecycle/
        pricing/
        payments/
        ratings/
        notifications/
        admin/
      shared/
    tests/
  infra/
  README.md
```

Criterios de organización:
- Documentación y ADRs versionados con el código
- Módulos de backend alineados al dominio
- Aplicaciones sin reglas de negocio profundas

---

## 9. Stack tecnológico — criterios de selección

| Capacidad | Opciones | Criterio |
|---|---|---|
| Aplicaciones móviles | Flutter / React Native | Un codebase multiplataforma; capacidad del equipo |
| API | NestJS / Spring / Django / FastAPI | Tipado, modularidad y familiaridad |
| Base de datos | PostgreSQL + PostGIS | Modelo relacional y consultas geoespaciales |
| Autenticación | JWT / Cognito / Firebase Auth | Control frente a simplicidad operativa |
| Mapas | Google Maps / Mapbox | Costo, geocodificación y cálculo de distancia |
| Pagos | Wompi / Mercado Pago / Stripe | Cobertura geográfica, split y documentación |
| IA | API LLM multimodal | Costo, latencia y procedimiento de respaldo |
| Push | FCM | Estándar móvil |
| Almacenamiento | S3 / GCS / Firebase Storage | Evidencias fotográficas |

La selección definitiva se formaliza mediante ADR.

---

## 10. Aspectos transversales

- Autenticación y autorización (RBAC)
- Validación de entrada
- Registro estructurado con `correlationId`
- Manejo de errores con códigos estables
- Limitación de tasa en endpoints sensibles
- Idempotencia en pagos y aceptación de servicio
- Configuración por entorno
- Pruebas unitarias de dominio e integración de casos de uso críticos

---

## 11. Gobernanza de la arquitectura

1. Todo elemento funcional pertenece a un módulo responsable.
2. No existen dependencias circulares entre módulos.
3. Toda integración externa se expone mediante un puerto.
4. El estado de dinero y del servicio se valida en backend.
5. Las decisiones de impacto se registran en ADR antes de implementarse.
6. Las extensiones posteriores (p. ej. veterinaria) se modelan como subdominios, no como condicionales dispersos.

---

## 12. Criterios de cumplimiento arquitectónico del MVP

- Drivers y atributos de calidad priorizados
- Diagramas C1 y C2
- Mapa de módulos y responsabilidades
- Máquina de estados del servicio
- ADRs de estilo arquitectónico, matching, pagos e IA
- Contrato API (OpenAPI) por roles
- Procedimientos de degradación (IA, pagos, mapas)
- Estructura de monorepo
- Trazabilidad de casos de uso a módulos
- Criterios de aceptación técnicos (seguridad e idempotencia)

---

## Documentos siguientes

1. Alcance MVP e historias de usuario  
2. ADR 0001 — monolito modular  
3. Diagramas C1 y C2  
4. Especificación de matching y pagos  
