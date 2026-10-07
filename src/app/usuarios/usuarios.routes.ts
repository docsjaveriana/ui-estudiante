import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Estudiantes',
    loadComponent: () => import('./usuario-list/usuario-list.component').then(m => m.UsuarioListComponent)
  },
  {
    path: 'nuevo',
    title: 'Nuevo estudiante',
    loadComponent: () => import('./usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
  },
  {
    path: ':id',
    title: 'Estudiante',
    loadComponent: () => import('./usuario-detail/usuario-detail.component').then(m => m.UsuarioDetailComponent)
  },
  {
    path: ':id/editar',
    title: 'Editar estudiante',
    loadComponent: () => import('./usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
  }
];
