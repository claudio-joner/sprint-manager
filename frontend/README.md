# SprintManager - Frontend

Aplicación web para la gestión de proyectos, sprints, funcionalidades, integrantes y tareas. Construida con **Angular** y consume la API REST del backend (`SprintManager/backend`).

## Stack técnico

- **Angular 22** (standalone components, control flow `@if`/`@for`)
- **TypeScript ~6.0**
- **RxJS**
- **Tailwind CSS v4** (`@tailwindcss/postcss`) — usado de forma selectiva (sin `preflight`) para no pisar el theming existente basado en variables CSS
- **Vitest** como test runner
- Build/tooling con **Angular CLI**

## Requisitos previos

- Node.js compatible con Angular 22
- Backend corriendo en `http://localhost:8080` (ver `SprintManager/backend`)

## Cómo correr el proyecto

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

```bash
npm run build   # build de producción, artefactos en dist/
npm test        # tests unitarios con Vitest
```

## Configuración

No hay archivo de environments: las URLs de la API están hardcodeadas como `http://localhost:8080/api/...` dentro de cada servicio (`src/app/services/*.ts`). El backend habilita CORS para `http://localhost:4200` en desarrollo.

## Rutas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `DashboardComponent` | listado de proyectos, gráfico de proyectos activos/finalizados, paginación |
| `/projects/:id` | `ProjectDetailComponent` | detalle de un proyecto: resumen, sprints, funcionalidades y tareas |

## Estructura del proyecto

```
src/app/
├── app.ts / app.routes.ts / app.config.ts
├── dashboard/                 # listado de proyectos + gráfico + paginación
├── projects/
│   └── project-detail/        # detalle de proyecto (resumen, sprints, funcionalidades, tareas)
├── kanban/
│   ├── kanban-board/          # tablero kanban de tareas (por StatusTask)
│   └── functionality-board/   # tablero de funcionalidades (por Status), no interactivo
├── services/                  # un servicio HttpClient por entidad del backend
│   ├── project.ts
│   ├── sprint.ts
│   ├── functionality.ts
│   ├── task.ts
│   └── member.ts
└── shared/
    ├── modal/                 # modal genérico reutilizable
    ├── pie-chart/             # gráfico de torta reutilizable (SVG)
    ├── theme.service.ts       # toggle claro/oscuro, persistido en localStorage
    ├── last-project.util.ts   # último proyecto visitado, persistido en localStorage
    ├── active-sprint.util.ts  # sprint "activo" por proyecto, persistido en localStorage
    └── project-tasks.util.ts  # combina y deduplica tareas de sprints + funcionalidades de un proyecto
```

## Servicios y comunicación con el backend

Cada servicio en `src/app/services/` expone operaciones CRUD 1:1 contra el endpoint correspondiente del backend (`getAll`, `getById`, `create`, `delete`), más las acciones puntuales que sí existen en el backend:

- `ProjectService.close(id)` → `PATCH /api/projects/{id}/close`
- `TaskService.updateStatus(id, status)` → `PATCH /api/tasks/{id}/status`

No existen endpoints de edición genérica en el backend (`PUT`/`PATCH` de campos) para `Project`, `Sprint`, `Functionality` ni `Member` — por lo tanto el frontend tampoco los ofrece.

## Estado que vive solo en el frontend (`localStorage`)

Algunas funcionalidades de UI no tienen respaldo en el backend todavía y se resuelven client-side, sin persistencia real en la base de datos:

- **Tema claro/oscuro** (`theme.service.ts`)
- **Último proyecto visitado**, para recordar dónde quedó el usuario (`last-project.util.ts`)
- **Sprint activo por proyecto** (`active-sprint.util.ts`): el backend no tiene el concepto de sprint "activo"; se guarda el id del sprint activo por proyecto en `localStorage`

## Particularidad de la serialización del backend (Jackson)

Los objetos `Task` que llegan desde el backend **nunca** incluyen `sprint`, `member` ni `functionality` (están anotados `@JsonBackReference` y Jackson los excluye siempre, sin importar por qué camino se llegó al objeto). Para saber a qué sprint/funcionalidad pertenece una tarea, el frontend no puede leer `task.sprint` ni `task.functionality`: hay que buscarla dentro del array `tasks` del `Sprint`/`Functionality` correspondiente (que sí viene completo, del lado `@JsonManagedReference`). Este patrón se usa en `project-detail.ts` (filtro de tareas por funcionalidad, gráfico de distribución por sprint) y hay que tenerlo en cuenta en cualquier código nuevo que necesite esa relación.

## Pendientes conocidos (requieren cambios en el backend)

- Endpoint para persistir el sprint "activo" de un proyecto
- Endpoint para actualizar el `status` de una `Functionality` (hoy el tablero de funcionalidades no es interactivo)
- Endpoint para reasignar el `member` de una tarea existente (botón "Asignar")
- Campos de fecha (inicio / fin estimado) en `Functionality`
