import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { erroresPorCampo, mensajeDeError } from '../../core/api-error';
import { Clase, ClaseRequest } from '../../models/clase.model';
import { Usuario } from '../../models/usuario.model';
import { ClaseService } from '../../services/clase.service';
import { UsuarioService } from '../../services/usuario.service';
import { FieldErrorComponent } from '../../shared/field-error/field-error.component';

/** Crear (`/clases/nueva`) o editar (`/clases/:id/editar`) un curso. */
@Component({
  selector: 'app-clase-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, FieldErrorComponent],
  templateUrl: './clase-form.component.html'
})
export class ClaseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly claseService = inject(ClaseService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);

  /** Parámetro :id de la ruta; ausente al crear. */
  readonly id = input<string>();
  /** Query param ?usuarioId= para preseleccionar el estudiante al crear. */
  readonly usuarioId = input<string>();
  protected readonly editing = computed(() => this.id() !== undefined);

  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly message = signal('');
  protected readonly fieldErrors = signal<Record<string, string>>({});

  // Las mismas reglas que ClaseRequest en el backend. usuarioId arranca en null
  // para obligar a elegir un estudiante en el selector.
  protected readonly form = this.fb.group({
    codigo: this.fb.nonNullable.control('', Validators.required),
    nombre: this.fb.nonNullable.control('', Validators.required),
    creditos: this.fb.nonNullable.control(3, [Validators.required, Validators.min(1)]),
    semestre: this.fb.nonNullable.control(''),
    usuarioId: this.fb.control<number | null>(null, Validators.required)
  });

  ngOnInit(): void {
    this.usuarioService.list().subscribe({
      next: usuarios => {
        this.usuarios.set(usuarios);
        this.loadInitialValue();
      },
      error: err => {
        this.message.set(mensajeDeError(err, 'No fue posible cargar los estudiantes'));
        this.loading.set(false);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { semestre, usuarioId, ...resto } = this.form.getRawValue();
    const clase: ClaseRequest = {
      ...resto,
      semestre: semestre.trim() || null,
      usuarioId: usuarioId!   // garantizado por Validators.required
    };
    const id = this.id();
    const request$: Observable<Clase> = id === undefined
      ? this.claseService.create(clase)
      : this.claseService.update(Number(id), clase);

    this.saving.set(true);
    this.message.set('');
    this.fieldErrors.set({});

    request$.subscribe({
      next: guardada => this.router.navigate(['/clases'], { queryParams: { usuarioId: guardada.usuarioId } }),
      error: err => {
        this.message.set(mensajeDeError(err, 'No fue posible guardar el curso'));
        this.fieldErrors.set(erroresPorCampo(err));
        this.saving.set(false);
      }
    });
  }

  private loadInitialValue(): void {
    const id = this.id();
    if (id === undefined) {
      const preseleccionado = this.usuarioId();
      if (preseleccionado) {
        this.form.controls.usuarioId.setValue(Number(preseleccionado));
      }
      this.loading.set(false);
      return;
    }
    this.claseService.get(Number(id)).subscribe({
      next: clase => {
        this.form.setValue({
          codigo: clase.codigo,
          nombre: clase.nombre,
          creditos: clase.creditos,
          semestre: clase.semestre ?? '',
          usuarioId: clase.usuarioId
        });
        this.loading.set(false);
      },
      error: err => {
        this.message.set(mensajeDeError(err, 'No fue posible cargar el curso'));
        this.loading.set(false);
      }
    });
  }
}
