import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Muestra el error de un campo de formulario.
 *
 * Prioriza la validación del cliente (solo cuando el campo ya fue tocado) y, si no hay,
 * el error que devolvió el backend para ese campo.
 *
 * Sin OnPush a propósito: el estado `touched` del control no es un signal, así que el
 * componente debe revisarse cada vez que su padre lo hace.
 */
@Component({
  selector: 'app-field-error',
  template: `
    @if (message(); as m) {
      <small class="error" role="alert">{{ m }}</small>
    }
  `
})
export class FieldErrorComponent {
  control = input.required<AbstractControl>();
  /** Mensaje por cada clave de error del validador: { required: 'El nombre es obligatorio' }. */
  messages = input<Record<string, string>>({});
  serverError = input<string | undefined>();

  protected message(): string | null {
    const control = this.control();
    if (control.touched && control.errors) {
      const key = Object.keys(control.errors)[0];
      return this.messages()[key] ?? 'Valor inválido';
    }
    return this.serverError() ?? null;
  }
}
