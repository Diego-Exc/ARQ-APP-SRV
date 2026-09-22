Actividad: Atributos y Escenarios de Calidad — Marketplace de Servicios del Hogar

Arquitectura de Software — Institución Universitaria Salazar y Herrera (IUSH)


1. Integrantes del equipo

- Diego Andrés Ulloa Escorcia
- Julián Correa Posada


2. Descripción del problema

Hoy, cuando una persona tiene un daño en su hogar (una fuga, una falla eléctrica, una cerradura dañada, etc.), no suele saber con certeza qué oficio necesita ni a quién llamar. El proceso habitual es informal: se busca al técnico por referidos o por mensajería instantánea (WhatsApp), se acuerda un precio sin ninguna referencia de mercado, no hay forma de verificar la identidad o la reputación del técnico, y el pago se hace en efectivo sin respaldo ni comprobante.

La propuesta es un marketplace digital (dos apps: cliente y profesional) donde el usuario describe el daño con texto, foto o voz; un módulo de inteligencia artificial sugiere el oficio requerido; el sistema conecta al usuario con técnicos cercanos disponibles mediante matching geoespacial; el servicio se ejecuta siguiendo una máquina de estados (solicitado, aceptado, en camino, en progreso, terminado); y se cierra con pago dentro de la plataforma y calificación del servicio.

Cifras que sustentan el problema (con fuente y enlace de verificación):

- El mercado de servicios del hogar en Colombia se valoró en USD 1,57 mil millones en 2025, con proyección a USD 4,23 mil millones para 2034 (crecimiento anual estimado de 11,6% entre 2026 y 2034). Fuente: Deep Market Insights, "Colombia Home Services Market Size, Share & Growth Report" — https://deepmarketinsights.com/vista/insights/home-services-market/colombia
- Dentro de ese mercado, la categoría de reparación y mantenimiento fue la de mayor participación en 2025, con un tamaño de USD 0,7 mil millones. Fuente: Deep Market Insights (mismo reporte anterior).
- En Colombia, la Encuesta de Micronegocios (EMICRON) 2024 del DANE estimó 5.297.252 micronegocios a nivel nacional, de los cuales el 5,7% (300.629 unidades) corresponden al sector de la construcción. Fuente: DANE, Boletín técnico EMICRON 2024 — https://www.dane.gov.co/files/operaciones/EMICRON/bol-EMICRON-2024.pdf
- Dentro de los micronegocios de construcción, los trabajos de electricidad representan el 11,3% de los ingresos del sector, según el análisis de esa misma encuesta. Fuente: El Nuevo Siglo, "Micronegocios de construcción generaron $7,8 billones", con base en datos DANE — EMICRON 2024 — https://www.elnuevosiglo.com.co/economia/micronegocios-de-construccion-generaron-78-billones

Estas cifras muestran un mercado grande y en crecimiento, dominado por micronegocios que hoy trabajan de manera informal, sin canales digitales que den transparencia, seguimiento y respaldo al usuario final.


3. Atributos de calidad seleccionados (ISO/IEC 25010:2023)

Para este trabajo elegimos cuatro atributos de calidad de la norma ISO/IEC 25010:2023. La escogimos porque es la version que estamos viendo en clase y porque cada uno de estos atributos se adecua a lo que buscamos y necesitamos en este proyecto.

3.1 Seguridad
Escogimos este atributo porque nuestra plataforma maneja informacion bastante sensible: datos personales, la direccion del hogar del cliente, fotos del dano y los pagos. Ademas un tecnico externo va a entrar a la casa del cliente, entonces necesitamos estar seguros de quien esta autenticado y que quede registro de cada accion que se haga. Por eso este atributo se ajusta tanto a lo que necesita nuestro proyecto.

3.2 Eficiencia de desempeño
Este lo elegimos porque muchos de los danos que motivan a alguien a usar la app son urgencias, como una fuga de agua o un corto electrico. Si la app se demora mucho en buscar tecnicos cercanos o en clasificar el dano con la IA, deja de tener sentido usarla en vez de buscar por WhatsApp como se hace normalmente. Por eso la rapidez de respuesta se adecua tanto a la problematica que estamos resolviendo.

3.3 Fiabilidad
Se escogio este atributo porque el flujo principal de nuestra app depende de varios servicios externos como la IA, el mapa y la pasarela de pagos. Si alguno de esos servicios falla en un mal momento no queremos que todo el sistema se caiga o que queden cosas raras como dos tecnicos asignados al mismo servicio. Entonces la fiabilidad nos ayuda a que el sistema siga funcionando aunque algo externo falle.

3.4 Capacidad de Interaccion
Este atributo aplica directo a nuestro proyecto porque el problema que estamos resolviendo es justamente que el usuario no sabe que oficio necesita cuando tiene un dano en la casa. La app tiene que traducir algo tan simple como "no hay luz en el bano" en una accion concreta sin que el usuario tenga que saber terminos tecnicos. Tambien buscamos evitar que el usuario se equivoque al confirmar cosas importantes como el pago.

(Agregamos un quinto atributo para reforzar el analisis, aunque el minimo pedido era 4)

3.5 Mantenibilidad
Lo agregamos porque nuestro MVP arranca con pocos oficios como plomeria, electricidad y cerrajeria, pero la idea es ir sumando mas categorias, mas metodos de pago y hasta otros proveedores de IA con el tiempo. Necesitamos que el proyecto se pueda ir modificando y ampliando sin tener que rehacer todo el sistema cada vez.


4. Escenarios de calidad

Cada escenario sigue la estructura: Fuente → Estímulo → Entorno → Artefacto → Respuesta → Medida de respuesta.

4.1 Seguridad

Escenario S1 — Acceso no autorizado a una solicitud ajena
Fuente: un actor externo con sesión inválida o expirada.
Estímulo: intenta consultar el detalle de una solicitud de servicio que no le pertenece.
Entorno: operación normal del sistema.
Artefacto: API de solicitudes / módulo de identidad y acceso.
Respuesta: el sistema rechaza la petición y registra el intento en auditoría.
Medida de respuesta: 100% de los intentos no autorizados retornan error 403 y quedan registrados en menos de 1 segundo.
Justificación: protege la dirección del hogar, las fotos y los datos del cliente, que son información sensible por tratarse de un domicilio.

Escenario S2 — Integridad del pago
Fuente: un cliente autenticado que finaliza un servicio.
Estímulo: confirma el pago del valor acordado.
Entorno: operación normal, pasarela de pagos disponible.
Artefacto: módulo de pagos.
Respuesta: el cobro se registra una sola vez y el estado del servicio pasa a "pagado" solo cuando la pasarela confirma la transacción.
Medida de respuesta: ningún reintento genera doble cobro; el estado del servicio y el estado del pago coinciden en el 100% de las transacciones exitosas.
Justificación: el manejo de dinero exige integridad; un doble cobro o una inconsistencia rompe la confianza del usuario en la plataforma.

4.2 Eficiencia de desempeño

Escenario P1 — Búsqueda de técnicos cercanos
Fuente: un cliente con una solicitud ya confirmada y ubicación registrada.
Estímulo: pide el listado de técnicos disponibles para el oficio identificado.
Entorno: carga normal, con al menos 50 técnicos activos en la zona.
Artefacto: módulo de matching y base de datos geoespacial.
Respuesta: el sistema devuelve los candidatos ordenados por distancia y disponibilidad.
Medida de respuesta: el 95% de las respuestas se entregan en 2 segundos o menos.
Justificación: en una urgencia, la rapidez para ver opciones es lo que hace que la app sea mejor que buscar por WhatsApp.

Escenario P2 — Clasificación del daño con IA
Fuente: un cliente que describe un daño en texto y adjunta una foto.
Estímulo: envía la solicitud para que se clasifique el oficio.
Entorno: operación normal, servicio de IA disponible.
Artefacto: módulo de diagnóstico (IA).
Respuesta: el sistema devuelve el oficio sugerido, el nivel de urgencia y preguntas de contexto.
Medida de respuesta: el 95% de las respuestas llegan en 5 segundos o menos, con una tasa de éxito de al menos 99%.
Justificación: este es el primer paso del flujo; si es lento o falla, se bloquea todo el proceso posterior.

4.3 Fiabilidad

Escenario R1 — Caída del servicio de IA
Fuente: un cliente creando una nueva solicitud.
Estímulo: el proveedor de IA no responde o retorna error.
Entorno: falla parcial, el resto del sistema sigue operativo.
Artefacto: módulo de diagnóstico y flujo de solicitudes.
Respuesta: el sistema ofrece selección manual del oficio y continúa el flujo hacia el matching.
Medida de respuesta: el flujo de solicitud mantiene una disponibilidad de al menos 99,5% mensual, y el cambio a modo manual toma 3 segundos o menos.
Justificación: la IA es un componente externo que la plataforma no controla; el flujo principal no puede depender solo de ella.

Escenario R2 — Doble asignación de un servicio
Fuente: un técnico autenticado.
Estímulo: confirma que acepta una solicitud que está en estado de búsqueda de técnico.
Entorno: operación normal, con posible corte de red en el celular del técnico.
Artefacto: módulo de ciclo de vida del servicio (máquina de estados).
Respuesta: la asignación se guarda de forma atómica o se revierte por completo; nunca quedan dos técnicos asignados a la misma solicitud.
Medida de respuesta: cero casos de doble asignación; si hay un reintento, el estado queda consistente en 10 segundos o menos.
Justificación: la máquina de estados es la fuente de verdad del negocio; una inconsistencia aquí genera conflictos operativos reales entre técnicos y clientes.

4.4 Capacidad de Interacción

Escenario U1 — Solicitud creada por alguien que no sabe qué oficio necesita
Fuente: un cliente sin conocimiento técnico, usando la app por primera vez.
Estímulo: describe el daño en lenguaje natural, por ejemplo "no hay luz en el baño".
Entorno: primer uso de la aplicación.
Artefacto: flujo de creación de solicitud en la app cliente.
Respuesta: el usuario ve el oficio sugerido, lo confirma y pasa al listado de técnicos sin salir del flujo.
Medida de respuesta: al menos el 90% de los usuarios en pruebas completan el flujo en 3 minutos o menos, con un abandono máximo de 10% en el paso de clasificación.
Justificación: el problema central que resuelve el producto es justamente que el usuario no sabe qué oficio pedir; si la interfaz no resuelve esto de forma simple, el producto no cumple su propósito.

Escenario U2 — Seguimiento del servicio en curso
Fuente: un cliente con un servicio ya en proceso.
Estímulo: entra a consultar el estado actual del servicio.
Entorno: operación normal, el técnico va actualizando estados desde su app.
Artefacto: vista de seguimiento en la app cliente.
Respuesta: el cliente ve el estado vigente (asignado, en camino, en progreso, terminado) con datos de contacto mediado por la plataforma.
Medida de respuesta: la actualización se refleja en la app en 5 segundos o menos tras el cambio en el backend; al menos el 95% de los usuarios entienden el estado mostrado en una evaluación de la capacidad de interacción.
Justificación: la transparencia del seguimiento reemplaza la incertidumbre típica del canal informal, algo especialmente importante en servicios de urgencia.


5. Referencias

- ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model.
- Bass, L.; Clements, P.; Kazman, R. — Software Architecture in Practice (estructura de escenarios de calidad).
- Deep Market Insights — Colombia Home Services Market Size, Share & Growth Report. https://deepmarketinsights.com/vista/insights/home-services-market/colombia
- DANE — Boletín técnico, Encuesta de Micronegocios (EMICRON) 2024. https://www.dane.gov.co/files/operaciones/EMICRON/bol-EMICRON-2024.pdf
- El Nuevo Siglo — "Micronegocios de construcción generaron $7,8 billones" (con base en datos DANE — EMICRON 2024). https://www.elnuevosiglo.com.co/economia/micronegocios-de-construccion-generaron-78-billones
