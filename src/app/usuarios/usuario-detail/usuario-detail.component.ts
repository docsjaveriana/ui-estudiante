import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { mensajeDeError } from '../../core/api-error';
import { Clase } from '../../models/clase.model';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

/** Ficha del estudiante con sus cursos. */
@Component({
  selector: 'app-usuario-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './usuario-detail.component.html'
})
export class UsuarioDetailComponent implements OnInit {
  private readonly service = inject(UsuarioService);

  /** Parámetro :id de la ruta (withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly status = signal<'loading' | 'success' | 'error'>('loading');
  protected readonly usuario = signal<Usuario | null>(null);
  protected readonly clases = signal<Clase[]>([]);
  protected readonly message = signal('');

  ngOnInit(): void {
    const id = Number(this.id());
    forkJoin({ usuario: this.service.get(id), clases: this.service.listClases(id) }).subscribe({
      next: ({ usuario, clases }) => {
        this.usuario.set(usuario);
        this.clases.set(clases);
        this.status.set('success');
      },
      error: err => {
        this.message.set(mensajeDeError(err, 'No fue posible cargar el estudiante'));
        this.status.set('error');
      }
    });
  }

  protected totalCreditos(): number {
    return this.clases().reduce((total, c) => total + c.creditos, 0);
  }
}
