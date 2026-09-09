# Actividad N.° 5 — AulaTrack

## Persistencia, procesamiento backend y control de sesiones

**Proyecto integrador:** AulaTrack  
**Continuidad:** Actividades 1–4, prototipado y programación cliente  
**Tecnologías:** React, tRPC, Express, Drizzle ORM, MySQL/TiDB, Manus OAuth y Vitest

## 1. Continuidad funcional

AulaTrack conserva la interfaz académica de las actividades anteriores y añade una capa de servidor para que las actividades del estudiante dejen de ser datos temporales del navegador. La pantalla principal ahora consulta la base de datos, permite crear actividades mediante un formulario validado, actualizar su estado y eliminarlas con control de propietario.

La sesión se gestiona mediante el sistema de autenticación integrado. Las operaciones de persistencia se declaran como procedimientos protegidos; el servidor obtiene el usuario desde la cookie de sesión y nunca recibe el `ownerId` desde el formulario. Esta decisión evita que un cliente modifique registros de otra cuenta.

## 2. Arquitectura

```text
Cliente AulaTrack
  ├── Formulario Nueva actividad
  ├── GET aulaTrack.list
  ├── POST aulaTrack.create
  ├── POST aulaTrack.update
  └── POST aulaTrack.remove
          │
          ▼
Servidor tRPC / Express
  ├── protectedProcedure
  ├── validación Zod
  ├── sesión Manus OAuth
  └── helpers server/db.ts
          │
          ▼
Base de datos MySQL/TiDB
  ├── users
  └── aula_activities
```

## 3. Procesamiento de formularios

El formulario `Nueva actividad` captura `title`, `subject`, `dueDate` y `notes`. La interfaz evita envíos vacíos mediante restricciones HTML5, mientras que el servidor aplica la validación definitiva con Zod. Los campos de texto se recortan con `trim`, tienen límites de longitud y se rechazan si no cumplen el mínimo requerido.

El procedimiento `aulaTrack.create` devuelve el registro creado y actualiza la consulta del cliente. En caso de error, la consola de la interfaz muestra la traza `POST 400` y el botón permanece controlado por el estado `isPending`.

## 4. Sanitización y seguridad

La sanitización se aplica en la frontera servidor-cliente mediante un esquema Zod. La aplicación no inserta contenido recibido como HTML; los títulos, asignaturas y notas se renderizan como texto React, por lo que no se ejecutan como etiquetas o scripts. El `ownerId` se toma exclusivamente de `ctx.user.id`.

Las rutas CRUD usan `protectedProcedure`. Sin sesión, el servidor rechaza la operación con `UNAUTHORIZED`; la interfaz registra `AUTH 401` y permite iniciar sesión. La cookie de sesión se maneja por el sistema de autenticación, sin exponer credenciales ni manipular cookies directamente desde el código de la página.

## 5. Modelo de datos

| Campo | Tipo | Regla | Uso |
|---|---|---|---|
| `id` | entero autoincremental | Clave primaria | Identificador del registro |
| `ownerId` | entero | Obligatorio | Aislamiento por usuario |
| `title` | varchar(160) | Mínimo 3 caracteres | Nombre de la actividad |
| `subject` | varchar(120) | Mínimo 2 caracteres | Asignatura |
| `status` | enum | `pending`, `in_progress`, `submitted` | Flujo de trabajo |
| `dueDate` | varchar(10) | Formato `YYYY-MM-DD` | Fecha de entrega |
| `notes` | text | Máximo 1000 caracteres | Observaciones |
| `createdAt` | timestamp | UTC del servidor | Auditoría |
| `updatedAt` | timestamp | UTC del servidor | Última modificación |

## 6. Operaciones CRUD

| Operación | Procedimiento | Evidencia observable |
|---|---|---|
| Create | `aulaTrack.create` | El formulario muestra `POST 201` y el registro aparece en la lista. |
| Read | `aulaTrack.list` | La interfaz muestra `GET 200` y carga las actividades del usuario. |
| Update | `aulaTrack.update` | Pulsar el estado alterna pendiente, en progreso y entregada; aparece `PUT 200`. |
| Delete | `aulaTrack.remove` | El icono de papelera elimina el registro propio y muestra `DELETE 200`. |

Las consultas se construyen mediante Drizzle ORM. El filtrado de actualización y borrado combina `id` y `ownerId`, de modo que una petición válida no puede actuar fuera del conjunto de datos de la sesión actual.

## 7. Control de sesiones

La pantalla detecta si existe una sesión activa. Con sesión, muestra el nombre del usuario, habilita las rutas protegidas y consulta la base de datos. Sin sesión, muestra datos de ejemplo no persistentes y presenta la acción `Iniciar sesión`. Esto permite revisar la interfaz sin ocultar el comportamiento de autenticación.

## 8. Evidencias técnicas

La captura de preview muestra el panel AulaTrack con los contadores de actividades, el formulario marcado como `POST · JSON`, el estado `Base de datos`, la ruta `GET /api/trpc/aulaTrack.list`, la ruta de creación, la referencia a `MySQL + prepared` y la consola `SERVER.LOG / TRAZAS`.

La validación automática ejecutada antes de la entrega produjo los siguientes resultados:

| Verificación | Resultado |
|---|---|
| `pnpm check` | Sin errores TypeScript |
| `pnpm test` | 2 archivos, 4 pruebas aprobadas |
| `pnpm build` | Compilación Vite y servidor completada |
| Migración SQL | Tablas `users` y `aula_activities` creadas |
| Preview | Dashboard AulaTrack renderizado y sesión reconocida |

Las pruebas Vitest cubren el rechazo de acceso sin sesión, la validación de payload inválido y la respuesta de listado para una sesión autenticada. El archivo está en `server/aulaTrack.test.ts`.

## 9. Archivos principales

| Archivo | Responsabilidad |
|---|---|
| `drizzle/schema.ts` | Tablas y tipos de `users` y `aula_activities`. |
| `server/db.ts` | Conexión y helpers de persistencia. |
| `server/routers.ts` | Procedimientos protegidos y validación Zod. |
| `client/src/pages/Home.tsx` | Formulario, estados CRUD, sesión y evidencias visuales. |
| `client/src/index.css` | Diseño responsive del panel académico. |
| `server/aulaTrack.test.ts` | Pruebas de autorización y validación. |
| `drizzle/0000_low_living_lightning.sql` | Migración revisada y aplicada. |

## 10. Procedimiento de demostración inicio a fin

Primero se abre AulaTrack y se verifica que la sesión esté activa. Luego se registra una actividad con título, asignatura y fecha; el panel debe mostrar `POST 201`. Después se pulsa el estado para ejecutar una actualización y se comprueba `PUT 200`. Finalmente se elimina el registro y se verifica `DELETE 200`. Al recargar la página, la actividad debe conservarse mientras pertenezca a la sesión del usuario.

## Referencias

[1]: https://trpc.io/docs/server/procedures "tRPC — Procedures"
[2]: https://orm.drizzle.team/docs/overview "Drizzle ORM — documentación"
[3]: https://zod.dev/ "Zod — validación de esquemas"
[4]: https://developer.mozilla.org/es/docs/Web/HTTP/Methods "MDN — métodos HTTP"
