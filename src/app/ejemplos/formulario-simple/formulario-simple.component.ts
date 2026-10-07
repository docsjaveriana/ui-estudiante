import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

/** Ejemplo mínimo de formulario reactivo con FormGroup y FormControl (ruta /ejemplos/formulario). */
@Component({
  selector: 'app-formulario-simple',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-simple.component.html'
})
export class FormularioSimpleComponent {
  private service = inject(UsuarioService);

  // Un FormGroup agrupa los campos; cada campo es un FormControl con su valor inicial y sus reglas.
  form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: Validators.required }),
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  mensaje = signal('');

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();   // muestra los errores de todos los campos
      return;
    }
    // getRawValue() devuelve { nombre, correo }: justo lo que espera el backend.
    this.service.create(this.form.getRawValue()).subscribe({
      next: usuario => {
        this.mensaje.set(`Estudiante creado con id ${usuario.id}`);
        this.form.reset();
      },
      error: err => this.mensaje.set(err.error?.message ?? 'No fue posible guardar')
    });
  }
}
