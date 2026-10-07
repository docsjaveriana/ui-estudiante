import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { erroresPorCampo, mensajeDeError } from '../../core/api-error';
import { Usuario, UsuarioRequest } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { FieldErrorComponent } from '../../shared/field-error/field-error.component';

/** Crear (`/usuarios/nuevo`) o editar (`/usuarios/:id/editar`) un estudiante. */
@Component({
  selector: 'app-usuario-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, FieldErrorComponent],
  templateUrl: './usuario-form.component.html'
})
export class UsuarioFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(UsuarioService);
  private readonly router = inject(Router);

  /** Parámetro :id de la ruta; ausente al crear. */
  readonly id = input<string>();
  protected readonly editing = computed(() => this.id() !== undefined);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly message = signal('');
  protected readonly fieldErrors = signal<Record<string, string>>({});

  // Las mismas reglas que UsuarioRequest en el backend.
  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    correo: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    const id = this.id();
    if (id === undefined) {
      return;
    }
    this.loading.set(true);
    this.service.get(Number(id)).subscribe({
      next: usuario => {
        this.form.setValue({ nombre: usuario.nombre, correo: usuario.correo });
        this.loading.set(false);
      },
      error: err => {
        this.message.set(mensajeDeError(err, 'No fue posible cargar el estudiante'));
        this.loading.set(false);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const usuario: UsuarioRequest = this.form.getRawValue();
    const id = this.id();
    const request$: Observable<Usuario> = id === undefined
      ? this.service.create(usuario)
      : this.service.update(Number(id), usuario);

    this.saving.set(true);
    this.message.set('');
    this.fieldErrors.set({});

    request$.subscribe({
      next: guardado => this.router.navigate(['/usuarios', guardado.id]),
      error: err => {
        this.message.set(mensajeDeError(err, 'No fue posible guardar el estudiante'));
        this.fieldErrors.set(erroresPorCampo(err));
        this.saving.set(false);
      }
    });
  }
}
