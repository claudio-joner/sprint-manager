# SprintManager - Backend

API REST para la gestión de proyectos, sprints, funcionalidades, miembros y tareas. Construida con **Spring Boot** y **PostgreSQL**.

## Stack técnico

- **Java 21**
- **Spring Boot 3.5.16**
  - `spring-boot-starter-web` (API REST)
  - `spring-boot-starter-data-jpa` (persistencia)
  - `spring-boot-starter-validation`
  - `spring-boot-devtools` (solo runtime/desarrollo)
- **PostgreSQL** (driver `org.postgresql:postgresql`)
- **Lombok**
- Build con **Maven** (wrapper incluido: `mvnw` / `mvnw.cmd`)

## Requisitos previos

- JDK 21
- PostgreSQL corriendo localmente, con una base de datos creada (por defecto `sprint_manager_dev`)

## Configuración

La configuración vive en `src/main/resources/application.properties`:

- `spring.datasource.url`: apunta a `jdbc:postgresql://localhost:5432/sprint_manager_dev` (hay una URL de producción comentada, `sprint_manager_producion`)
- `spring.datasource.username` / `spring.datasource.password`: credenciales locales de Postgres
- `spring.jpa.hibernate.ddl-auto=update`: Hibernate actualiza el esquema automáticamente en base a las entidades (no hay migraciones tipo Flyway/Liquibase)
- `spring.jpa.show-sql=true`: loguea las queries SQL generadas
- `server.port=8080`: puerto por defecto de la API

CORS (`config/CorsConfig.java`) está habilitado para `http://localhost:4200` (frontend Angular en desarrollo), permitiendo `GET, POST, PUT, PATCH, DELETE, OPTIONS` sobre `/api/**`.

## Cómo correr el proyecto

```bash
./mvnw spring-boot:run
```

o generando el jar:

```bash
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

La API queda disponible en `http://localhost:8080`.

## Modelo de datos

### Project
Entidad raíz. Contiene la información general del proyecto y sus relaciones con miembros, sprints y funcionalidades.

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | PK autogenerado |
| name | String | obligatorio |
| client | String | obligatorio |
| leader | String | obligatorio |
| totalHours | Double | horas totales presupuestadas |
| hoursPerSprint | Double | horas por sprint |
| startDate | LocalDate | obligatorio |
| estimatedEndDate | LocalDate | obligatorio |
| realEndDate | LocalDate | se completa al cerrar el proyecto (`PATCH /api/projects/{id}/close`); si es `null` el proyecto está activo |
| members | List\<Member\> | relación 1:N |
| sprints | List\<Sprint\> | relación 1:N |
| funcionalities | List\<Functionality\> | relación 1:N (nombre de campo en español: `funcionalities`) |

### Member
| Campo | Tipo | Notas |
|---|---|---|
| id | Long | PK |
| name | String | obligatorio |
| email | String | obligatorio |
| project | Project | ManyToOne, obligatorio |

### Sprint
| Campo | Tipo | Notas |
|---|---|---|
| id | Long | PK |
| numero | Integer | número de sprint dentro del proyecto |
| totalHours | Double | horas asignadas al sprint |
| project | Project | ManyToOne, obligatorio |
| tasks | List\<Task\> | relación 1:N |

### Functionality
| Campo | Tipo | Notas |
|---|---|---|
| id | Long | PK |
| name | String | obligatorio |
| observation | String | obligatorio |
| priority | Priority (enum) | `HIGH`, `MEDIUM`, `LOW` |
| status | Status (enum) | `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| project | Project | ManyToOne, obligatorio |
| sprint | Sprint | ManyToOne, opcional (una funcionalidad puede no estar asignada a un sprint) |
| tasks | List\<Task\> | relación 1:N |

### Task
| Campo | Tipo | Notas |
|---|---|---|
| id | Long | PK |
| name | String | obligatorio |
| status | StatusTask (enum) | `SIN_ASIGNAR`, `EN_PROGESO`, `EN_REVISION`, `BLOQUEADA`, `COMPLETADA` |
| comments | String | obligatorio |
| estimatedTime | Double | horas estimadas |
| workedTime | Double | horas trabajadas |
| createdDate | LocalDate | se setea automáticamente al crear (`TaskService.create`) |
| startDate | LocalDate | obligatorio |
| endDate | LocalDate | opcional; se autocompleta al pasar la tarea a `COMPLETADA` |
| sprint | Sprint | ManyToOne, opcional |
| member | Member | ManyToOne, opcional |
| functionality | Functionality | ManyToOne, opcional |

## Endpoints

### Projects (`/api/projects`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/projects` | lista todos los proyectos |
| GET | `/api/projects/{id}` | proyecto por id |
| POST | `/api/projects` | crea un proyecto |
| DELETE | `/api/projects/{id}` | elimina un proyecto |
| PATCH | `/api/projects/{id}/close` | cierra el proyecto (setea `realEndDate = hoy`) |

### Sprints (`/api/sprints`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/sprints` | lista todos los sprints |
| GET | `/api/sprints/{id}` | sprint por id |
| POST | `/api/sprints` | crea un sprint |
| DELETE | `/api/sprints/{id}` | elimina un sprint |

### Functionalities (`/api/functionalities`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/functionalities` | lista todas las funcionalidades |
| GET | `/api/functionalities/{id}` | funcionalidad por id |
| POST | `/api/functionalities` | crea una funcionalidad |
| DELETE | `/api/functionalities/{id}` | elimina una funcionalidad |

### Tasks (`/api/tasks`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tasks` | lista todas las tareas |
| GET | `/api/tasks/{id}` | tarea por id |
| POST | `/api/tasks` | crea una tarea (`createdDate` se autocompleta) |
| DELETE | `/api/tasks/{id}` | elimina una tarea |
| PATCH | `/api/tasks/{id}/status` | actualiza el estado (body: `StatusTask`); si el nuevo estado es `COMPLETADA` autocompleta `endDate` |
| GET | `/api/tasks/{id}/exceeded-time` | devuelve `workedTime - estimatedTime` |

### Members (`/api/members`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/members` | lista todos los miembros |
| GET | `/api/members/{id}` | miembro por id |
| POST | `/api/members` | crea un miembro |
| DELETE | `/api/members/{id}` | elimina un miembro |

> **Nota:** no existen endpoints de actualización genérica (`PUT`/`PATCH` de campos) para `Project`, `Sprint`, `Functionality` ni `Member`. Solo hay alta, baja y los `PATCH` puntuales listados arriba (cierre de proyecto, cambio de estado de tarea).

## Serialización JSON (Jackson)

Las relaciones bidireccionales usan `@JsonManagedReference` / `@JsonBackReference` para evitar recursión infinita al serializar:

- `project-members`: `Project.members` ↔ `Member.project`
- `project-sprints`: `Project.sprints` ↔ `Sprint.project`
- `project-functionalities`: `Project.funcionalities` ↔ `Functionality.project`
- `sprint-tasks`: `Sprint.tasks` ↔ `Task.sprint`
- `functionality-tasks`: `Functionality.tasks` ↔ `Task.functionality`
- `member-tasks`: declarado como `@JsonBackReference` en `Task.member`, pero **no tiene su contraparte** `@JsonManagedReference` en `Member` (Member no expone una lista de tareas). Hoy no genera errores porque Jackson solo valida el par cuando el lado "managed" existe y se resuelve, pero si en el futuro se agrega `List<Task> tasks` a `Member`, hay que revisar con cuidado el nombre de la referencia para no repetir el bug de recursión infinita que ya se dio con `Functionality.sprint` → `Sprint.tasks` → `Task.functionality`.

## Estructura del proyecto

```
src/main/java/SprintManager/backend/
├── BackendApplication.java
├── config/          # configuración (CORS)
├── controller/       # controladores REST
├── service/          # lógica de negocio
├── repository/        # interfaces Spring Data JPA
└── model/
    ├── emums/         # enums: Priority, Status, StatusTask
    └── *.java          # entidades JPA
```
