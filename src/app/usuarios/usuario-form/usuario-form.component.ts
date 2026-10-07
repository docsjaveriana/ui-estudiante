// ===== Importaciones: qué piezas de Angular y del proyecto usa este componente =====

// Piezas del núcleo de Angular: el decorador @Component, el ciclo de vida OnInit,
// la inyección de dependencias (inject), y los signals (signal, computed, input).
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
// Formularios reactivos: FormBuilder construye el formulario, Validators trae las reglas
// y ReactiveFormsModule habilita [formGroup] y formControlName en el template.
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// Router permite navegar desde el código; RouterLink habilita routerLink en el template.
import { Router, RouterLink } from '@angular/router';
// Observable: el tipo que devuelven las peticiones HTTP del servicio.
import { Observable } from 'rxjs';
// Utilidades propias para traducir un error HTTP a mensajes para el usuario.
import { erroresPorCampo, mensajeDeError } from '../../core/api-error';
// Modelos: la forma de los datos que viajan con la API (espejo de los DTO de Spring).
import { Usuario, UsuarioRequest } from '../../models/usuario.model';
// Servicio que sabe cómo hablar con /api/estudiante/usuarios.
import { UsuarioService } from '../../services/usuario.service';
// Componente hijo que muestra el error de un campo (se usa dentro del template).
import { FieldErrorComponent } from '../../shared/field-error/field-error.component';

/** Crear (`/usuarios/nuevo`) o editar (`/usuarios/:id/editar`) un estudiante. */
@Component({
  // Etiqueta HTML del componente. Aquí no se escribe a mano: lo inserta el router.
  selector: 'app-usuario-form',
  // OnPush: la vista solo se revisa cuando cambia un signal o un input, o hay un evento.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Todo lo que el template necesita: directivas de formularios, routerLink y el hijo.
  imports: [ReactiveFormsModule, RouterLink, FieldErrorComponent],
  // El HTML de este componente vive en un archivo aparte.
  templateUrl: './usuario-form.component.html'
})
// implements OnInit: Angular llamará a ngOnInit() una vez, cuando el componente esté listo.
export class UsuarioFormComponent implements OnInit {
  // ===== Dependencias: Angular las crea y las entrega (nunca usamos new) =====
  private readonly fb = inject(FormBuilder);        // fábrica de formularios
  private readonly service = inject(UsuarioService); // acceso a la API de usuarios
  private readonly router = inject(Router);          // para navegar después de guardar

  // ===== Datos que llegan desde la ruta =====

  /** Parámetro :id de la ruta; ausente al crear. */
  // /usuarios/7/editar → id() = "7"   ·   /usuarios/nuevo → id() = undefined
  // Llega solo gracias a withComponentInputBinding() en app.config.ts.
  readonly id = input<string>();
  // Signal derivado: true si estamos editando. Se recalcula solo si cambia id().
  protected readonly editing = computed(() => this.id() !== undefined);

  // ===== Estado de la pantalla (signals: al cambiar, la vista se actualiza) =====
  protected readonly loading = signal(false);  // cargando el estudiante a editar
  protected readonly saving = signal(false);   // petición de guardar en curso (deshabilita el botón)
  protected readonly message = signal('');     // mensaje general de error para el usuario
  // Errores por campo que devuelve el backend en un 400, p. ej. { correo: 'formato inválido' }
  protected readonly fieldErrors = signal<Record<string, string>>({});

  // ===== El formulario: controles y validadores =====

  // Las mismas reglas que UsuarioRequest en el backend.
  // group({...}) crea un FormGroup; cada propiedad es un FormControl.
  // nonNullable: al hacer reset() vuelve a '' (no a null) y los tipos quedan como string.
  protected readonly form = this.fb.nonNullable.group({
    // [valor inicial, [validadores]] → @NotBlank y @Size(max = 120) en Spring
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    // → @NotBlank y @Email en Spring
    correo: ['', [Validators.required, Validators.email]]
  });

  // ===== Al iniciar: si es edición, cargar los datos actuales =====
  ngOnInit(): void {
    const id = this.id();          // leer el signal: "7" o undefined
    if (id === undefined) {        // modo crear: el formulario queda vacío
      return;
    }
    this.loading.set(true);        // el template muestra «Cargando…»
    // Pedir el estudiante. Number("7") → 7. Sin subscribe no saldría la petición.
    this.service.get(Number(id)).subscribe({
      // Llegó la respuesta (200): copiar sus datos a los controles del formulario.
      next: usuario => {
        // setValue exige TODOS los controles; patchValue aceptaría solo algunos.
        this.form.setValue({ nombre: usuario.nombre, correo: usuario.correo });
        this.loading.set(false);   // ahora sí se dibuja el formulario
      },
      // Falló (404, sin conexión…): mostrar un mensaje comprensible.
      error: err => {
        this.message.set(mensajeDeError(err, 'No fue posible cargar el estudiante'));
        this.loading.set(false);
      }
    });
  }

  // ===== Envío: lo llama (ngSubmit) en el template =====
  submit(): void {
    // 1. Validar en el cliente. invalid = al menos un control rompe una regla.
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // marca todos como tocados → aparecen todos los errores
      return;                       // y NO se llama a la API
    }
    // 2. Convertir el formulario en el modelo que espera el backend: { nombre, correo }.
    const usuario: UsuarioRequest = this.form.getRawValue();
    // 3. Decidir la operación: sin id → crear (POST); con id → actualizar (PUT).
    const id = this.id();
    const request$: Observable<Usuario> = id === undefined
      ? this.service.create(usuario)               // POST /api/estudiante/usuarios
      : this.service.update(Number(id), usuario);  // PUT  /api/estudiante/usuarios/7

    // 4. Preparar la pantalla: botón en «Guardando…» y limpiar errores anteriores.
    this.saving.set(true);
    this.message.set('');
    this.fieldErrors.set({});

    // 5. Enviar. Aquí, al suscribirse, sale la petición HTTP.
    request$.subscribe({
      // 201 / 200: ir a la ficha del estudiante guardado (/usuarios/7).
      next: guardado => this.router.navigate(['/usuarios', guardado.id]),
      // 409 (correo repetido), 400 (datos inválidos), 500 o sin conexión:
      error: err => {
        this.message.set(mensajeDeError(err, 'No fue posible guardar el estudiante')); // mensaje general
        this.fieldErrors.set(erroresPorCampo(err)); // errores junto a cada campo (solo en un 400)
        this.saving.set(false);                     // reactivar el botón para corregir y reintentar
      }
    });
  }
}
