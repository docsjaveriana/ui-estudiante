import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { mensajeDeError } from '../../core/api-error';
import { Clase } from '../../models/clase.model';
import { Usuario } from '../../models/usuario.model';
import { ClaseService } from '../../services/clase.service';
import { UsuarioService } from '../../services/usuario.service';

/** Listado de cursos, opcionalmente filtrado por estudiante (`/clases?usuarioId=1`). */
@Component({
  selector: 'app-clase-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './clase-list.component.html'
})
export class ClaseListComponent implements OnInit {
  private readonly claseService = inject(ClaseService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Query param ?usuarioId= (withComponentInputBinding). El filtro vive en la URL. */
  readonly usuarioId = input<string>();

  protected readonly status = signal<'loading' | 'success' | 'error'>('loading');
  protected readonly clases = signal<Clase[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly message = signal('');
  protected readonly actionError = signal('');

  /** Nombre de cada estudiante por id, para mostrarlo en la tabla en lugar del número. */
  protected readonly nombres = computed(() => new Map(this.usuarios().map(u => [u.id, u.nombre])));

  constructor() {
    // switchMap cancela la petición anterior si el filtro cambia antes de que responda.
    toObservable(this.usuarioId).pipe(
      tap(() => this.status.set('loading')),
      switchMap(id => this.cargarClases(id)),
      takeUntilDestroyed()
    ).subscribe();
  }

  ngOnInit(): void {
    // Solo alimenta el filtro y los nombres: si falla, la tabla sigue funcionando con ids.
    this.usuarioService.list().subscribe({
      next: usuarios => this.usuarios.set(usuarios),
      error: () => this.usuarios.set([])
    });
  }

  reload(): void {
    this.status.set('loading');
    this.cargarClases(this.usuarioId()).subscribe();
  }

  filtrar(usuarioId: string): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { usuarioId: usuarioId || null } });
  }

  remove(clase: Clase): void {
    if (!confirm(`¿Eliminar el curso ${clase.codigo} - ${clase.nombre}?`)) {
      return;
    }
    this.actionError.set('');
    this.claseService.delete(clase.id).subscribe({
      next: () => this.clases.update(lista => lista.filter(c => c.id !== clase.id)),
      error: err => this.actionError.set(mensajeDeError(err, 'No fue posible eliminar el curso'))
    });
  }

  private cargarClases(usuarioId: string | undefined): Observable<unknown> {
    const clases$ = usuarioId
      ? this.usuarioService.listClases(Number(usuarioId))
      : this.claseService.list();
    return clases$.pipe(
      tap(data => {
        this.clases.set(data);
        this.status.set('success');
      }),
      catchError(err => {
        this.message.set(mensajeDeError(err, 'No fue posible cargar los cursos'));
        this.status.set('error');
        return of(null);
      })
    );
  }
}
