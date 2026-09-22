# Servicios del Hogar — Documentación de investigación inicial

> Documento de definición del proyecto. Establece el problema, el alcance, los actores, los flujos y los criterios de análisis previos al diseño detallado e implementación.

**Definición del producto:** marketplace de servicios del hogar con dos aplicaciones (cliente y profesional). El usuario describe un daño (texto, foto o voz); el sistema clasifica el oficio mediante inteligencia artificial y conecta con técnicos cercanos disponibles, con tarifas y pago dentro de la plataforma.

**Referencias de modelo de negocio:** Rappi / DiDi (matching, ubicación y estado del servicio), TaskRabbit / GetNinjas / Homely (oficios), con capa de diagnóstico asistido por IA.

---

## 1. Problema

| Situación actual | Aporte de la plataforma |
|---|---|
| Desconocimiento del oficio requerido ante un daño | Clasificación del daño e identificación del oficio |
| Búsqueda informal sin garantías (WhatsApp, referidos) | Perfiles verificados, calificaciones e historial |
| Cotizaciones poco transparentes | Tarifas definidas según modelo de precio |
| Dificultad para ubicar disponibilidad cercana | Matching por ubicación y disponibilidad |
| Pagos sin respaldo formal | Pago en plataforma con comprobante y mediación |

**Propuesta de valor:**  
El usuario describe el daño; el sistema identifica el especialista requerido y lo conecta con el técnico más cercano disponible, con precio y pago definidos.

---

## 2. Alcance: visión y MVP

### Visión del producto
Categorías de servicios del hogar y vida cotidiana:
- Reparaciones (plomería, electricidad, gas)
- Mantenimiento (pintura, drywall, carpintería)
- Electrodomésticos
- Limpieza
- Jardinería
- Mascotas / veterinaria a domicilio
- Otros (cerrajería, fumigación, entre otros)

### Alcance del MVP
El primer entregable contempla los siguientes oficios:
1. Plomería  
2. Electricidad  
3. Cerrajería  
4. Electrodomésticos básicos  
5. Pintura / drywall menor  

Quedan fuera del MVP, para fases posteriores: veterinaria, limpieza recurrente, mudanzas, instalación de gas y servicios B2B.

El MVP cubre el ciclo completo de negocio:  
descripción del daño → clasificación → matching → aceptación → ejecución → pago → calificación.

---

## 3. Actores y aplicaciones

### Aplicación cliente
- Registro e inicio de sesión
- Ubicación del servicio
- Creación de solicitud (texto, fotos, voz)
- Visualización del diagnóstico y oficio identificado
- Visualización de técnicos cercanos (distancia, calificación, precio estimado, ETA)
- Comunicación in-app
- Seguimiento del servicio (solicitado → aceptado → en camino → en progreso → terminado)
- Pago y comprobante
- Calificación y gestión de reclamos

### Aplicación profesional
- Registro y verificación de identidad y documentos
- Perfil (oficios, zona, tarifas, portafolio)
- Disponibilidad (en línea / fuera de línea / horario)
- Recepción de solicitudes
- Aceptación, rechazo o cotización
- Navegación hacia el cliente
- Actualización de estados del servicio
- Cobros, comisiones y retiros
- Historial y reputación

### Panel de administración
- Aprobación de técnicos
- Moderación de disputas
- Catálogo de categorías y oficios
- Parámetros de comisión y matching
- Soporte operativo

---

## 4. Flujo principal

1. El cliente describe el daño en la aplicación.
2. Adjunta evidencias fotográficas cuando aplique.
3. El módulo de IA determina oficio, preguntas de contexto y nivel de urgencia.
4. El cliente confirma o ajusta el oficio.
5. El sistema consulta técnicos cercanos, disponibles y habilitados para ese oficio.
6. Se presenta la lista de candidatos o se asigna según el modelo de matching definido.
7. El técnico acepta y consulta dirección y detalle.
8. El técnico ejecuta el servicio y marca la finalización.
9. El cliente realiza el pago y califica.
10. La plataforma aplica la comisión y liquida al técnico.

### Modelo de matching

| Modelo | Descripción | Características |
|---|---|---|
| A. Selección por cliente | Lista de técnicos; el cliente elige | Mayor control del usuario |
| B. Difusión | Oferta a N técnicos cercanos; el primero acepta | Menor tiempo de asignación |
| C. Híbrido | Lista ordenada con opción de asignación automática al más cercano | Combina control y velocidad |

**Definición para el MVP:** modelo híbrido (C). Lista ordenada por distancia y calificación, con opción de asignación automática al técnico más cercano disponible.

---

## 5. Inteligencia artificial

### Funciones del módulo
- Clasificación de oficio a partir de texto e imagen
- Generación de preguntas de contexto del daño
- Estimación de urgencia y riesgo
- Elaboración de resumen para el técnico
- Estimación de rango de precio cuando existan datos de referencia

### Límites del módulo
- No sustituye el diagnóstico profesional presencial
- No garantiza el resultado de la reparación
- No reemplaza al técnico
- No define tarifas fuera de las reglas de negocio del sistema

### Criterios técnicos de análisis
- Modalidad de entrada: texto y/o imagen
- Uso de proveedor LLM multimodal frente a modelo propio
- Prompt y taxonomía cerrada de oficios
- Procedimiento de respaldo: selección manual de categoría
- Costos por solicitud y límites de uso
- Tratamiento de privacidad de fotografías del hogar

---

## 6. Tarifas

Se distinguen el **precio del servicio** y la **comisión de la plataforma**.

### Modelos de precio del servicio

| Modelo | Descripción | Uso |
|---|---|---|
| Visita / diagnóstico | Cobro por desplazamiento y revisión | Daños de alcance incierto |
| Precio fijo por servicio | Tarifa predefinida por tipo de trabajo | Servicios estandarizables |
| Por hora | Tarifa horaria más materiales | Trabajos de duración variable |
| Cotización previa | El técnico cotiza antes de ejecutar | Trabajos de mayor complejidad |
| Anticipo y saldo | Pago parcial inicial y saldo al finalizar | Reducción de inasistencia |

### Ingresos de la plataforma
- Comisión porcentual por servicio completado
- Cargo fijo por solicitud
- Suscripción premium para técnicos
- Cargo por visita urgente

### Criterios de definición tarifaria
- Levantamiento de prácticas de cobro de técnicos en la ciudad piloto
- Referencias de mercado por oficio
- Responsabilidad sobre materiales
- Política de cancelación y tiempos de espera
- Procedimiento ante reclasificación de oficio

**Definición para el MVP:** catálogo de servicios con precio de referencia, cotización en sitio para trabajos no estándar y comisión porcentual de la plataforma.

---

## 7. Pagos

### Medios de pago contemplados
- Tarjeta (pasarela de pagos)
- PSE / transferencia
- Billeteras digitales
- Efectivo (registro de pago en sitio)

### Criterios de diseño
- Cobro en plataforma con liquidación al técnico
- Periodicidad de retiros
- Retención por disputas
- Facturación y soporte documental
- Reembolsos y contracargos
- Verificación KYC del técnico (identidad y cuenta)

**Definición para el MVP:** pago en aplicación mediante pasarela, con liquidación periódica a técnicos.

---

## 8. Confianza, seguridad y aspectos legales

### Verificación de profesionales
- Documento de identidad
- Validación biométrica (fase posterior)
- Certificados de oficio aplicables
- Consulta de antecedentes conforme a la normativa local
- Seguro de responsabilidad (fase posterior)

### Seguridad del cliente
- Seguimiento en ruta
- Contacto mediado por la aplicación
- Canal de soporte
- Política de tratamiento de fotografías y datos del hogar

### Aspectos legales
- Términos y condiciones (cliente y profesional)
- Tratamiento de datos personales
- Responsabilidad ante daños durante la prestación
- Naturaleza de la relación con los profesionales (independientes)
- Obligaciones tributarias y facturación

---

## 9. Plan de trabajo de investigación y definición

### Fase 0 — Descubrimiento
1. Entrevistas a usuarios (hogares / arrendatarios)
2. Entrevistas a técnicos
3. Análisis de competidores
4. Selección de ciudad piloto
5. Definición de categorías del MVP

### Fase 1 — Definición de producto
6. Historias de usuario y flujos
7. Modelo de matching
8. Modelo de tarifas y comisión
9. Criterios de verificación de técnicos
10. Wireframes de pantallas principales

### Fase 2 — Viabilidad técnica
11. Tecnología móvil
12. Backend (API, autenticación y roles)
13. Mapas y geolocalización
14. Notificaciones push
15. Pasarela de pagos
16. Integración de IA
17. Almacenamiento de evidencias fotográficas
18. Arquitectura base: monolito modular

### Fase 3 — Plan de entrega
19. Backlog priorizado (MoSCoW)
20. Diagrama de arquitectura
21. Diagramas de casos de uso y secuencia
22. Plan de sprints e hitos
23. Criterios de aceptación del MVP

---

## 10. Decisiones pendientes de cierre

1. Nombre y marca del producto
2. Ciudad piloto
3. Parámetros exactos del matching híbrido
4. Alcance de la IA dentro del MVP
5. Uso de pagos reales o simulados en la entrega académica
6. Inclusión o exclusión de segmentos B2B
7. Tratamiento de veterinaria en el roadmap
8. Política de responsabilidad ante fallas en el servicio

---

## 11. Entregables de la etapa

| # | Entregable |
|---|---|
| 1 | Documento de investigación |
| 2 | Lean Canvas / Business Model Canvas |
| 3 | Matriz de competidores |
| 4 | Personas (cliente y técnico) |
| 5 | Alcance MVP (incluido / excluido) |
| 6 | Flujos principales (diagramas) |
| 7 | Modelo de tarifas y pagos |
| 8 | Arquitectura de alto nivel |
| 9 | Stack tecnológico |
| 10 | Roadmap por fases |

---

## 12. Ejes de diferenciación

1. Diagnóstico asistido por IA como punto de entrada
2. Atención de urgencias con ETA y seguimiento
3. Transparencia de precio previo a la aceptación
4. Garantía limitada de plataforma en trabajos cubiertos
5. Paquetes de mantenimiento periódico del hogar
6. Flujo guiado cuando el usuario no identifica el oficio
7. Lista de verificación de seguridad (gas, electricidad) previa al despacho

Para el curso de Arquitectura de Software, el valor del entregable radica en la trazabilidad entre actores, casos de uso, atributos de calidad y composición de matching, pagos e IA dentro del sistema.

---

## Documentos relacionados

- `02-arquitectura-principios.md` — drivers, principios, módulos, capas y organización del repositorio
- `adr/0001-monolito-modular.md` — decisión de estilo arquitectónico del MVP
