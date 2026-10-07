# estudiante-front

Frontend Angular del proyecto [`estudiante`](../estudiante): CRUD de **estudiantes** (usuarios) y de sus **cursos** (clases).

| Pantalla | Ruta | API |
|---|---|---|
| Cursos (filtro por estudiante en la URL) | `/clases`, `/clases?usuarioId=1` | `GET /clases`, `GET /usuarios/{id}/clases` |
| Nuevo / editar curso | `/clases/nueva`, `/clases/:id/editar` | `POST /clases`, `GET`/`PUT /clases/{id}` |
| Eliminar curso | botón en la lista | `DELETE /clases/{id}` |
| Estudiantes | `/usuarios` | `GET /usuarios` |
| Ficha del estudiante con sus cursos | `/usuarios/:id` | `GET /usuarios/{id}` + `GET /usuarios/{id}/clases` |
| Nuevo / editar estudiante | `/usuarios/nuevo`, `/usuarios/:id/editar` | `POST /usuarios`, `PUT /usuarios/{id}` |
| Eliminar estudiante | botón en la lista (409 si tiene cursos) | `DELETE /usuarios/{id}` |

Todas las rutas de la API cuelgan de `/api/estudiante`.

## Ejecutar

Requisitos: Node 20.19+ y el backend en la URL indicada en `.env` (por defecto `http://localhost:8080`).

```bash
cp .env.example .env   # solo la primera vez; ajusta BACKEND_URL si hace falta
npm install
npm start          # http://localhost:4200
npm test           # pruebas unitarias (Vitest)
npm run build      # compilación de producción en dist/
```

En desarrollo el navegador llama **directamente** al backend indicado en `BACKEND_URL`. Antes de `npm start`, `npm test` y `npm run watch`, `scripts/generar-env.mjs` lee el `.env` y genera `src/environments/environment.development.ts` (no se versiona). Si cambias el `.env`, reinicia `npm start`.

El backend debe permitir CORS para `http://localhost:4200`; por defecto acepta cualquier origen (`CORS_ALLOWED_ORIGINS=*`). En producción se usa `src/environments/environment.ts`, con la URL relativa `/api/estudiante` que publica el Ingress.

## Estructura

```text
src/app/
├── core/api-error.ts           ← traduce HttpErrorResponse a mensajes para el usuario
├── models/                     ← contratos: espejo de los DTO del backend
│   ├── usuario.model.ts        ← Usuario / UsuarioRequest
│   ├── clase.model.ts          ← Clase / ClaseRequest
│   └── error-response.model.ts ← ErrorResponse
├── services/                   ← acceso a la API con HttpClient (un servicio por recurso)
├── shared/
│   ├── field-error/            ← mensaje de error de un campo (cliente o backend)
│   └── not-found/              ← página 404
├── usuarios/                   ← área funcional, cargada de forma perezosa
│   ├── usuario-list/
│   ├── usuario-detail/
│   ├── usuario-form/           ← crear y editar con el mismo formulario
│   └── usuarios.routes.ts
├── clases/
│   ├── clase-list/
│   ├── clase-form/
│   └── clases.routes.ts
├── app.routes.ts               ← '' → /clases, lazy loading por área, ** → 404
└── app.config.ts               ← router con withComponentInputBinding + HttpClient
```

## Buenas prácticas aplicadas

- **Capas:** los componentes no conocen URLs; los servicios no conocen HTML; los modelos describen el contrato con la API.
- **Componentes standalone con `OnPush`** y estado en **signals** (la app es *zoneless*, el modo por defecto desde Angular 21).
- **Estado explícito de la interfaz:** `loading | success | error` en cada pantalla, con botón para reintentar.
- **Formularios reactivos tipados** con las mismas reglas que los DTO del backend. El backend vuelve a validar, y sus errores por campo (`ErrorResponse.campos`) se muestran junto al campo.
- **Errores sin detalles técnicos:** `mensajeDeError` usa el `message` del backend y oculta los 5xx y los fallos de red detrás de mensajes comprensibles.
- **La URL guarda el estado:** el filtro por estudiante vive en `?usuarioId=` (se puede recargar y compartir) y `switchMap` cancela las peticiones viejas cuando el filtro cambia.
- **Rutas con carga perezosa** por área funcional y parámetros de ruta como `input()`.
- **Accesibilidad básica:** `label` en cada campo, `role="alert"` en los errores, encabezados de tabla con `scope`.
- **Pruebas:** servicios con `HttpTestingController`, la utilidad de errores y el formulario de estudiantes (validación, envío y error 409).
