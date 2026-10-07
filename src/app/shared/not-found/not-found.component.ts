import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <h2>Página no encontrada</h2>
    <p>La dirección que buscas no existe.</p>
    <a routerLink="/clases">Volver a los cursos</a>
  `
})
export class NotFoundComponent {}
