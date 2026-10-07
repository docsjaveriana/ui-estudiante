import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';

// Cada área funcional se descarga solo cuando se visita (lazy loading).
export const routes: Routes = [
  { path: '', redirectTo: 'clases', pathMatch: 'full' },
  { path: 'clases', loadChildren: () => import('./clases/clases.routes').then(m => m.CLASES_ROUTES) },
  { path: 'usuarios', loadChildren: () => import('./usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES) },
  {
    path: 'ejemplos/formulario',
    title: 'Ejemplo: formulario',
    loadComponent: () => import('./ejemplos/formulario-simple/formulario-simple.component').then(m => m.FormularioSimpleComponent)
  },
  {
    path: 'ejemplos/componentes',
    title: 'Ejemplo: componentes',
    loadComponent: () => import('./ejemplos/lista-tarjetas/lista-tarjetas.component').then(m => m.ListaTarjetasComponent)
  },
  { path: '**', component: NotFoundComponent, title: 'Página no encontrada' }
];
