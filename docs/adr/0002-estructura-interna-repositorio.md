# ADR 002: Estructura Interna del repositorio

- **Estado:** Aceptado
- **Fecha:** 2026-10-14
- **Decisores:** Equipo del proyecto
- **Relacionado con:** [ADR 001: Selección de Estilo Arquitectónico](0001-monolito-modular.md)

## Contexto

El proyecto **Servicios del Hogar** reúne en un mismo producto una API, una aplicación para clientes, una aplicación para profesionales, un panel administrativo y recursos de infraestructura y documentación. Estos componentes evolucionan de manera coordinada y, durante el MVP académico, son desarrollados por un equipo pequeño.

Se necesita una estructura que permita ubicar cada responsabilidad, reducir dependencias innecesarias y mantener las decisiones arquitectónicas visibles. Esta ADR complementa la decisión del ADR 0001: el backend continúa como monolito modular; esta decisión define cómo organizar el código y los componentes dentro del repositorio.

## Decisión

Se adopta un **monorepo** para el proyecto y una organización por responsabilidad en la raíz. Dentro del backend se aplicará el patrón **hexagonal (puertos y adaptadores)**, manteniendo los módulos de dominio definidos por bounded context. En las aplicaciones cliente y profesional y en el panel administrativo se organizará el código principalmente por funcionalidad, aislando las integraciones externas detrás de servicios o adaptadores cuando corresponda.

El monorepo no implica que todas las aplicaciones deban desplegarse juntas. Cada componente conserva su configuración, dependencias, pruebas y proceso de construcción; los cambios pueden integrarse y desplegarse según las necesidades de cada componente.

## Justificación del monorepo

Se elige el monorepo porque:

1. **Los componentes pertenecen al mismo producto.** Las aplicaciones consumen la API del marketplace y comparten conceptos y contratos.
2. **El equipo es pequeño y el proyecto está en etapa de MVP.** Un único repositorio reduce la carga de administrar permisos, ramas, revisiones y automatizaciones en varios repositorios.
3. **Los cambios coordinados son más fáciles de revisar.** Una modificación de un contrato de API y su consumo en una aplicación pueden revisarse en el mismo Pull Request.
4. **La documentación queda junto al código.** Las ADR, los diagramas y las instrucciones de infraestructura se versionan con las implementaciones a las que hacen referencia.
5. **Se facilita la consistencia.** El lint, los análisis de seguridad y las convenciones de contribución se pueden aplicar de manera centralizada, con excepciones explícitas por componente.

Para evitar que el monorepo se convierta en un bloque acoplado, cada componente debe conservar límites claros. Compartir repositorio no autoriza a importar código interno de otra aplicación ni a mezclar ciclos de despliegue.

## Organización propuesta de carpetas

La organización de la raíz se mantiene alineada con la estructura actual del repositorio:

```text
ARQ-APP-SRV/
├── .github/
│   └── workflows/       # Automatizaciones de CI y verificaciones
├── apps/
│   ├── customer_app/     # Aplicación móvil del cliente (React Native)
│   ├── pro_app/          # Aplicación móvil del profesional
│   └── admin_web/        # Panel de administración
├── backend/
│   └── src/
│       ├── modules/      # Módulos del monolito, separados por bounded context
│       ├── shared/       # Elementos técnicos pequeños y realmente transversales
│       └── bootstrap/    # Configuración y composición de dependencias
├── docs/
│   ├── adr/              # Registros de decisiones arquitectónicas
│   └── diagrams/         # Diagramas del sistema
├── infra/                # Configuración reproducible de infraestructura y despliegue
├── .eslintrc.json
├── .gitignore
├── package.json
└── README.md
```

El árbol interno de `backend/src/modules/` es una guía para aplicar arquitectura hexagonal en cada bounded context. Los nombres de módulos concretos deben corresponder al dominio del producto:

```text
backend/src/modules/<contexto>/
├── domain/
│   ├── entities/         # Entidades y reglas de negocio
│   ├── value-objects/    # Objetos de valor
│   ├── services/         # Reglas de dominio que no pertenecen a una entidad
│   └── ports/            # Contratos de dominio, cuando sean necesarios
├── application/
│   ├── use-cases/        # Casos de uso de la aplicación
│   ├── dto/              # Datos de entrada y salida de los casos de uso
│   └── ports/            # Puertos requeridos por los casos de uso
├── adapters/
│   ├── inbound/          # Adaptadores de entrada: HTTP, controladores y validación
│   └── outbound/         # Adaptadores de salida: persistencia e integraciones externas
└── tests/                # Pruebas del módulo
```

Las dependencias apuntan hacia el dominio y la aplicación: los adaptadores implementan los puertos que esas capas necesitan. El dominio no depende de HTTP, bases de datos, proveedores de pagos, mapas ni servicios de IA. Un punto de composición en `bootstrap/` conecta los puertos con sus adaptadores concretos.

En `apps/customer_app/` y `apps/pro_app/`, el código de interfaz se organizará por funcionalidades (por ejemplo, solicitudes, perfil o servicios), junto con navegación, componentes compartidos y adaptadores de acceso a API o almacenamiento. En `apps/admin_web/` se seguirá el mismo criterio de organización funcional, adaptado a las tecnologías del panel.

`shared/` no se utilizará como carpeta genérica para ocultar responsabilidades. Solo contendrá utilidades técnicas estables, sin reglas específicas de un bounded context. Si una regla pertenece a un módulo, permanece en ese módulo.

## Buenas prácticas consideradas

Para mantener la estructura comprensible y sostenible, se adoptan estas prácticas de arquitectura y desarrollo:

- **Alta cohesión y bajo acoplamiento:** cada módulo agrupa responsabilidades relacionadas y expone una interfaz controlada.
- **Separación de responsabilidades:** dominio, casos de uso, adaptadores e interfaz tienen funciones diferenciadas.
- **Inversión de dependencias (SOLID):** las capas internas definen contratos; las integraciones externas dependen de ellos mediante adaptadores.
- **Encapsulamiento de bounded contexts:** un módulo no accede directamente a tablas, entidades internas ni carpetas de infraestructura de otro módulo. La colaboración ocurre mediante contratos públicos o casos de uso definidos.
- **Una sola razón de cambio por componente:** cambios de interfaz, lógica de negocio e infraestructura deben ubicarse en sus carpetas correspondientes.
- **Pruebas por nivel:** las reglas de dominio y los casos de uso se prueban sin infraestructura real; los adaptadores se verifican con pruebas de integración cuando aplica.
- **Configuración y secretos fuera del código:** credenciales y valores sensibles se suministran mediante variables de entorno; se pueden documentar nombres de variables en archivos de ejemplo sin incluir valores secretos.
- **Automatización de calidad:** los Pull Requests deben ejecutar lint y verificaciones de seguridad configuradas en el repositorio; las pruebas se añadirán a la automatización a medida que existan.
- **Cambios trazables:** las decisiones que afecten arquitectura se registran en `docs/adr/`, y los diagramas relevantes se mantienen en `docs/diagrams/`.
- **Convenciones consistentes:** cada componente documenta sus comandos y dependencias; se evitan ciclos de importación y duplicación innecesaria de utilidades.

## Alternativas consideradas

1. **Un repositorio por aplicación (polyrepo).** Se descarta para esta etapa porque obligaría a coordinar cambios de API, clientes, documentación y automatizaciones entre repositorios. Podría reconsiderarse si los equipos, permisos o ciclos de publicación se independizan de forma significativa.
2. **Un único proyecto sin separación interna.** Se descarta porque mezclaría reglas de negocio, transporte, persistencia e interfaz, aumentando el acoplamiento y dificultando pruebas y cambios.
3. **Organizar el backend únicamente por tipo técnico** (por ejemplo, una carpeta global de controladores, otra de servicios y otra de modelos). Se descarta como estructura principal porque dispersa un mismo caso de negocio entre muchas carpetas y debilita los límites de los bounded contexts. Los tipos técnicos se organizan dentro de cada módulo cuando resulte útil.
4. **Aplicar arquitectura hexagonal completa a cada aplicación de interfaz.** Se descarta como obligación general para el MVP porque puede introducir capas y abstracciones sin beneficio proporcional. Las aplicaciones cliente usarán separación por funcionalidad y aislarán las integraciones que deban sustituirse o probarse por separado.
5. **Microservicios en repositorios separados.** Se descarta en esta fase por los costos de despliegue, observabilidad, comunicación de red y consistencia distribuida. Esta alternativa también se relaciona con la decisión del ADR 0001.

## Consecuencias

### Positivas

- Los cambios que abarcan API, aplicaciones y documentación se pueden revisar de forma coordinada.
- La separación hexagonal permite probar reglas de negocio sin depender de servicios externos.
- Los límites por bounded context facilitan evolucionar módulos y, si el crecimiento lo justifica, evaluar una extracción futura.
- Las convenciones y verificaciones de calidad se pueden compartir sin borrar las particularidades de cada aplicación.

### Negativas y riesgos

- El repositorio puede crecer en tamaño y duración de CI; se deberán optimizar las verificaciones por componente cuando sea necesario.
- Un monorepo mal organizado puede generar dependencias cruzadas y cambios difíciles de aislar.
- La arquitectura hexagonal requiere disciplina: crear abstracciones sin una necesidad concreta también puede aumentar la complejidad.
- La carpeta `shared/` puede convertirse en un punto de acoplamiento si se permiten reglas de negocio compartidas sin dueño claro.

### Mitigaciones

- Mantener reglas de dependencia documentadas y revisar imports entre módulos en los Pull Requests.
- Ejecutar las verificaciones pertinentes a los componentes modificados, además de las verificaciones globales necesarias.
- Mantener los puertos solo donde exista una dependencia externa o una frontera que se necesite sustituir o probar.
- Exigir que cada elemento de `shared/` tenga uso transversal real y no pertenezca a un contexto específico.

## Criterios de revisión

Esta ADR se revisará cuando ocurra alguna de estas situaciones:

- El equipo o la propiedad de las aplicaciones crezca y requiera permisos o ciclos de publicación independientes.
- Los tiempos de CI o el tamaño del repositorio dificulten el trabajo cotidiano.
- La estructura real del backend no permita mantener límites verificables entre módulos.
- Aparezcan razones de negocio u operación para desplegar y escalar un bounded context de forma independiente.
- La experiencia del equipo muestre que el patrón hexagonal propuesto añade más complejidad que valor a un módulo concreto.
