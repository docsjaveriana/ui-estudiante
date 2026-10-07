import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';

// Cada área funcional se descarga solo cuando se visita (lazy loading).
export const routes: Routes = [
  { path: '', redirectTo: 'clases', pathMatch: 'full' },
  { path: 'clases', loadChildren: () => import('./clases/clases.routes').then(m => m.CLASES_ROUTES) },
  { path: 'usuarios', loadChildren: () => import('./usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES) },
  { path: '**', component: NotFoundComponent, title: 'Página no encontrada' }
];
