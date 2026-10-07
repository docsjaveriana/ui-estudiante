/**
 * TODAS las rutas de la aplicación en un solo archivo (versión didáctica).
 *
 * La app usa app.routes.ts, que reparte las rutas por área funcional
 * (clases/clases.routes.ts y usuarios/usuarios.routes.ts) y las carga de forma perezosa.
 * Este archivo hace exactamente lo mismo, pero con todo a la vista y sin lazy loading,
 * para leer la tabla de rutas de una sola vez.
 *
 * Para usarlo en lugar de app.routes.ts, cambiar en app.config.ts:
 *     import { routes } from './app.routes';
 * por:
 *     import { routes } from './app.routes.bk';
 *
 * Cómo se lee una ruta:
 *   path       → el pedazo de URL después de /  (sin la barra inicial)
 *   component  → el componente que se dibuja dentro de <router-outlet />
 *   title      → el texto de la pestaña del navegador
 *   :id        → parámetro: llega al componente como input() gracias a
 *                withComponentInputBinding() en app.config.ts (siempre como texto: "7")
 *
 * El ORDEN importa: el router recorre el arreglo de arriba hacia abajo y usa
 * la PRIMERA ruta que coincide.
 */
import { Routes } from '@angular/router';
import { ClaseFormComponent } from './clases/clase-form/clase-form.component';
import { ClaseListComponent } from './clases/clase-list/clase-list.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { UsuarioDetailComponent } from './usuarios/usuario-detail/usuario-detail.component';
import { UsuarioFormComponent } from './usuarios/usuario-form/usuario-form.component';
import { UsuarioListComponent } from './usuarios/usuario-list/usuario-list.component';

export const routes: Routes = [
  // http://localhost:4200/  → no hay pantalla de inicio: se redirige a la lista de cursos.
  // pathMatch 'full' = solo cuando la URL está vacía; sin él, '' coincidiría con TODAS las URLs.
  { path: '', redirectTo: 'clases', pathMatch: 'full' },

  // ---------- Cursos ----------

  // /clases                → lista de cursos
  // /clases?usuarioId=7    → la misma ruta; el query param llega como input usuarioId
  { path: 'clases', component: ClaseListComponent, title: 'Cursos' },

  // /clases/nueva          → formulario vacío (crear)
  // /clases/nueva?usuarioId=7 → formulario con el estudiante ya seleccionado
  { path: 'clases/nueva', component: ClaseFormComponent, title: 'Nuevo curso' },

  // /clases/3/editar       → el MISMO formulario; recibe id = "3" y carga el curso (editar)
  { path: 'clases/:id/editar', component: ClaseFormComponent, title: 'Editar curso' },

  // ---------- Estudiantes ----------

  // /usuarios              → lista de estudiantes
  { path: 'usuarios', component: UsuarioListComponent, title: 'Estudiantes' },

  // /usuarios/nuevo        → formulario vacío (crear)
  // Va ANTES de 'usuarios/:id': si estuviera después, «nuevo» se tomaría como un id.
  { path: 'usuarios/nuevo', component: UsuarioFormComponent, title: 'Nuevo estudiante' },

  // /usuarios/7            → ficha del estudiante con sus cursos (recibe id = "7")
  { path: 'usuarios/:id', component: UsuarioDetailComponent, title: 'Estudiante' },

  // /usuarios/7/editar     → el mismo formulario de crear, ahora en modo edición
  { path: 'usuarios/:id/editar', component: UsuarioFormComponent, title: 'Editar estudiante' },


  // ---------- Ruta comodín ----------

  // Cualquier otra URL (/lo-que-sea) → página 404. Siempre va AL FINAL:
  // como coincide con todo, las rutas que estén debajo nunca se alcanzarían.
  { path: '**', component: NotFoundComponent, title: 'Página no encontrada' }
];
