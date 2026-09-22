# Atributos de calidad y escenarios — Marketplace de Servicios del Hogar

**Asignatura:** Arquitectura de Software  
**Institución:** Institución Universitaria Salazar y Herrera (IUSH)

---

## 1. Integrantes del equipo

| Nombre | Rol |
|---|---|
| Diego Andrés Ulloa Escorcia | Integrante |
| Julián Correa Posada | Integrante |

---

## 2. Descripción del problema y cifras de contexto

### 2.1 Problemática

El proceso de solicitud y asignación de servicios técnicos del hogar (plomería, electricidad, cerrajería y reparaciones afines) se resuelve de forma predominantemente informal. Ante un daño, el usuario no identifica con certeza el oficio requerido, localiza al profesional por referidos o mensajería instantánea, acuerda el precio sin referencia clara y carece de mecanismos de verificación, seguimiento y respaldo de pago.

El sistema propuesto es un marketplace de intermediación digital con dos aplicaciones móviles (cliente y profesional) que permite describir el daño, clasificar el oficio con apoyo de inteligencia artificial, conectar con técnicos cercanos disponibles mediante matching geoespacial, ejecutar el servicio bajo una máquina de estados y cerrar el ciclo con pago en plataforma y calificación.

### 2.2 Cifras de contexto

| Indicador | Valor | Fuente |
|---|---|---|
| Tamaño del mercado de servicios del hogar en Colombia (2024) | USD 1,42 mil millones | Deep Market Insights |
| Proyección del mercado al 2033 | USD 3,92 mil millones (CAGR 12,02 %) | Deep Market Insights |
| Reparación y mantenimiento como categoría principal (2024) | USD 570 millones | Deep Market Insights |
| Micronegocios del sector construcción en Colombia (2024) | 290.294 | DANE — EMICRON |
| Participación de trabajos de electricidad en ingresos del sector | 11,3 % | DANE — EMICRON |

Estas cifras evidencian un mercado de alto volumen con predominio de reparación y mantenimiento, operado en gran medida por micronegocios que hoy se contactan fuera de canales digitales integrados.

---

## 3. Atributos de calidad (ISO/IEC 25010)

La norma ISO/IEC 25010 define ocho características de calidad del producto software. Para este proyecto se seleccionan cinco atributos, por su relación directa con la problemática descrita.

### 3.1 Seguridad

**Definición (ISO/IEC 25010):** Grado en que el producto protege la información y los datos de accesos no autorizados, garantiza la confidencialidad y la integridad, y resiste intentos de vulneración.

**Justificación de aplicación:** La plataforma gestiona datos personales, ubicación del hogar, evidencias fotográficas del daño, identidad de técnicos y transacciones de pago. Un tercero accede físicamente al domicilio del cliente; por tanto, la autenticación, autorización, protección de datos y trazabilidad de acciones constituyen requisitos centrales del sistema.

### 3.2 Eficiencia del desempeño

**Definición (ISO/IEC 25010):** Desempeño relativo a la cantidad de recursos utilizados bajo condiciones establecidas (tiempo de respuesta, throughput, utilización de recursos).

**Justificación de aplicación:** El matching geoespacial y la notificación a técnicos disponibles deben operar con latencia acotada para que la asignación sea viable en escenarios de urgencia (fugas, fallas eléctricas, cerrajería). La clasificación por IA y la consulta de candidatos cercanos son operaciones sensibles al tiempo percibido por el usuario.

### 3.3 Confiabilidad

**Definición (ISO/IEC 25010):** Grado en que el sistema ejecuta funciones bajo condiciones establecidas durante un periodo de tiempo (madurez, disponibilidad, tolerancia a fallos, recuperabilidad).

**Justificación de aplicación:** El flujo principal —solicitud, asignación, ejecución y pago— no puede interrumpirse por fallos parciales de componentes externos (IA, mapas, pasarela). La máquina de estados del servicio y los registros de pago deben permanecer consistentes ante interrupciones o reintentos.

### 3.4 Usabilidad

**Definición (ISO/IEC 25010):** Grado en que el producto puede ser usado por usuarios específicos para alcanzar objetivos con eficacia, eficiencia y satisfacción en un contexto de uso determinado.

**Justificación de aplicación:** El punto de entrada del sistema es la descripción de un daño por usuarios sin conocimiento técnico del oficio requerido. Las dos aplicaciones (cliente y profesional) deben permitir completar el ciclo de servicio con claridad en estados, precios y acciones disponibles.

### 3.5 Mantenibilidad

**Definición (ISO/IEC 25010):** Grado en que el producto puede ser modificado de forma efectiva y eficiente (modularidad, reutilización, analizabilidad, modificabilidad, capacidad de prueba).

**Justificación de aplicación:** El MVP contempla un conjunto inicial de oficios con extensión prevista a nuevas categorías, métodos de pago e integraciones (IA, mapas, pasarela). La arquitectura monolito modular exige que los cambios en un módulo (p. ej. pagos) no propaguen efectos no controlados al resto del sistema.

---

## 4. Escenarios de calidad

Los escenarios siguen la estructura: **Fuente → Estímulo → Entorno → Artefacto → Respuesta → Medida de respuesta.**

### 4.1 Seguridad

#### Escenario S1 — Acceso no autorizado a datos de solicitud

| Elemento | Descripción |
|---|---|
| Fuente | Actor externo con credenciales inválidas o sesión expirada |
| Estímulo | Intento de consultar el detalle de una solicitud de servicio ajena |
| Entorno | Operación normal del sistema |
| Artefacto | API de solicitudes / módulo Identity & Access |
| Respuesta | El sistema rechaza la operación y registra el intento |
| Medida de respuesta | 100 % de solicitudes no autorizadas retornan código HTTP 403; registro en auditoría en ≤ 1 s |

**Justificación:** Protege dirección, fotos del hogar y datos del cliente frente a accesos indebidos, requisito inherente a un marketplace con información sensible del domicilio.

#### Escenario S2 — Procesamiento de pago con integridad transaccional

| Elemento | Descripción |
|---|---|
| Fuente | Cliente autenticado al finalizar un servicio |
| Estímulo | Confirmación de pago por valor acordado |
| Entorno | Operación normal; pasarela de pagos disponible |
| Artefacto | Módulo Payments |
| Respuesta | El cobro se registra una única vez; el estado del servicio transita a pagado solo tras confirmación de la pasarela |
| Medida de respuesta | Idempotencia: reintentos del mismo pago no generan doble cargo; consistencia estado–pago en 100 % de transacciones exitosas |

**Justificación:** El manejo de dinero exige integridad y no repudio; un error de doble cobro o estado inconsistente compromete la confianza en la plataforma.

---

### 4.2 Eficiencia del desempeño

#### Escenario P1 — Matching de técnicos cercanos

| Elemento | Descripción |
|---|---|
| Fuente | Cliente con solicitud confirmada y ubicación georreferenciada |
| Estímulo | Solicitud de listado de técnicos disponibles para un oficio |
| Entorno | Carga normal; ≥ 50 técnicos activos en la zona |
| Artefacto | Módulo Matching + base de datos geoespacial |
| Respuesta | El sistema retorna candidatos ordenados por distancia y disponibilidad |
| Medida de respuesta | Tiempo de respuesta del endpoint ≤ 2 s en el percentil 95 |

**Justificación:** El valor del producto depende de la rapidez con que el usuario visualiza opciones viables; latencias elevadas reducen la utilidad frente a la búsqueda informal actual.

#### Escenario P2 — Clasificación de oficio asistida por IA

| Elemento | Descripción |
|---|---|
| Fuente | Cliente que describe un daño en texto y adjunta una fotografía |
| Estímulo | Envío de solicitud para clasificación de oficio |
| Entorno | Operación normal; servicio de IA disponible |
| Artefacto | Módulo Diagnosis (IA) |
| Respuesta | El sistema devuelve oficio sugerido, nivel de urgencia y preguntas de contexto |
| Medida de respuesta | Tiempo de respuesta ≤ 5 s en el percentil 95; tasa de respuesta exitosa ≥ 99 % |

**Justificación:** La clasificación es el primer paso del flujo; su demora o indisponibilidad bloquea el acceso al matching y al resto del ciclo.

---

### 4.3 Confiabilidad

#### Escenario R1 — Indisponibilidad del servicio de IA

| Elemento | Descripción |
|---|---|
| Fuente | Cliente creando una nueva solicitud |
| Estímulo | El proveedor de IA no responde o retorna error |
| Entorno | Degradación parcial; resto de servicios operativos |
| Artefacto | Módulo Diagnosis + flujo de Requests |
| Respuesta | El sistema habilita selección manual de oficio y continúa el flujo hacia matching |
| Medida de respuesta | Disponibilidad del flujo de solicitud ≥ 99,5 % mensual; tiempo de conmutación a modo manual ≤ 3 s |

**Justificación:** La IA es un componente externo no controlado; el flujo principal no debe depender exclusivamente de su disponibilidad.

#### Escenario R2 — Fallo durante transición de estado del servicio

| Elemento | Descripción |
|---|---|
| Fuente | Técnico autenticado |
| Estímulo | Confirmación de aceptación de una solicitud en estado MATCHING |
| Entorno | Operación normal; posible interrupción de red en el cliente móvil |
| Artefacto | Módulo Service Lifecycle |
| Respuesta | La asignación queda registrada de forma atómica o se revierte; no existen dos técnicos asignados al mismo servicio |
| Medida de respuesta | 0 casos de doble asignación por solicitud; recuperación de estado coherente tras reintento en ≤ 10 s |

**Justificación:** La máquina de estados es la fuente de verdad del negocio; inconsistencias en la asignación generan conflictos operativos y pérdida de confianza.

---

### 4.4 Usabilidad

#### Escenario U1 — Creación de solicitud por usuario sin conocimiento del oficio

| Elemento | Descripción |
|---|---|
| Fuente | Cliente habituado a aplicaciones móviles, sin formación técnica |
| Estímulo | Describe un daño en lenguaje natural (“no hay luz en el baño”) |
| Entorno | Primer uso de la aplicación |
| Artefacto | Aplicación cliente — flujo de solicitud |
| Respuesta | El usuario identifica el oficio sugerido, confirma y accede al listado de técnicos sin salir del flujo |
| Medida de respuesta | ≥ 90 % de usuarios en prueba de usabilidad completan el flujo en ≤ 3 minutos; tasa de abandono en paso de clasificación ≤ 10 % |

**Justificación:** La problemática central es la desconocimiento del oficio; la interfaz debe traducir la descripción del daño en acciones concretas sin exigir terminología especializada.

#### Escenario U2 — Seguimiento del estado del servicio

| Elemento | Descripción |
|---|---|
| Fuente | Cliente con servicio en curso |
| Estímulo | Consulta del estado actual del servicio |
| Entorno | Operación normal; técnico actualizando estados desde su aplicación |
| Artefacto | Aplicación cliente — vista de seguimiento |
| Respuesta | El cliente visualiza el estado vigente (asignado, en camino, en progreso, terminado) con información de contacto mediado |
| Medida de respuesta | Actualización visible en cliente ≤ 5 s tras cambio en backend; comprensión del estado por ≥ 95 % de usuarios en evaluación heurística |

**Justificación:** La transparencia del progreso sustituye la incertidumbre propia del canal informal y reduce ansiedad en servicios de urgencia.

---

### 4.5 Mantenibilidad

#### Escenario M1 — Incorporación de un nuevo oficio al catálogo

| Elemento | Descripción |
|---|---|
| Fuente | Equipo de desarrollo |
| Estímulo | Registro de una nueva categoría (p. ej. fumigación) en catálogo y taxonomía de IA |
| Entorno | Código base del MVP desplegado |
| Artefacto | Módulos Catalog, Diagnosis y Matching |
| Respuesta | El nuevo oficio queda disponible para solicitud, clasificación y matching sin modificar módulos de pagos ni ciclo de vida |
| Medida de respuesta | Cambios acotados a ≤ 3 módulos; pruebas de regresión del flujo principal completadas en ≤ 2 días de desarrollo |

**Justificación:** El roadmap prevé ampliación de categorías; la modularidad debe permitir extensión sin rediseño global.

#### Escenario M2 — Sustitución de proveedor de pasarela de pagos

| Elemento | Descripción |
|---|---|
| Fuente | Equipo de desarrollo |
| Estímulo | Integración de una nueva pasarela de pagos |
| Entorno | Entorno de pruebas con adaptador existente |
| Artefacto | Módulo Payments (puerto/adaptador) |
| Respuesta | El nuevo adaptador implementa el contrato del puerto; el dominio de pagos y el ciclo de vida no requieren cambios |
| Medida de respuesta | Sustitución del adaptador sin alterar reglas de negocio del dominio; cobertura de pruebas del módulo Payments ≥ 80 % |

**Justificación:** La pasarela es un componente externo sujeto a cambio por criterios comerciales o regulatorios; el acoplamiento debe limitarse al adaptador.

---

## 5. Referencias

- ISO/IEC 25010:2011 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models.
- Bass, L.; Clements, P.; Kazman, R. — Software Architecture in Practice (escenarios de calidad).
- Deep Market Insights — Colombia Home Services Market (2024–2033).
- DANE — Encuesta de Micronegocios (EMICRON), Sector construcción, 2024.
