import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { mensajeDeError } from '../../core/api-error';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './usuario-list.component.html'
})
export class UsuarioListComponent implements OnInit {
  private readonly service = inject(UsuarioService);

  protected readonly status = signal<'loading' | 'success' | 'error'>('loading');
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly message = signal('');
  protected readonly actionError = signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.status.set('loading');
    this.service.list().subscribe({
      next: data => {
        this.usuarios.set(data);
        this.status.set('success');
      },
      error: err => {
        this.message.set(mensajeDeError(err, 'No fue posible cargar los estudiantes'));
        this.status.set('error');
      }
    });
  }

  remove(usuario: Usuario): void {
    if (!confirm(`¿Eliminar a ${usuario.nombre}?`)) {
      return;
    }
    this.actionError.set('');
    this.service.delete(usuario.id).subscribe({
      next: () => this.usuarios.update(lista => lista.filter(u => u.id !== usuario.id)),
      error: err => this.actionError.set(mensajeDeError(err, 'No fue posible eliminar el estudiante'))
    });
  }
}
