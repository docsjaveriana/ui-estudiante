import { Routes } from '@angular/router';

export const CLASES_ROUTES: Routes = [
  {
    path: '',
    title: 'Cursos',
    loadComponent: () => import('./clase-list/clase-list.component').then(m => m.ClaseListComponent)
  },
  {
    path: 'nueva',
    title: 'Nuevo curso',
    loadComponent: () => import('./clase-form/clase-form.component').then(m => m.ClaseFormComponent)
  },
  {
    path: ':id/editar',
    title: 'Editar curso',
    loadComponent: () => import('./clase-form/clase-form.component').then(m => m.ClaseFormComponent)
  }
];
