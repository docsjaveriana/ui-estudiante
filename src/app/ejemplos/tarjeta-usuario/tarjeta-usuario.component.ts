import { Component, input, output } from '@angular/core';
import { Usuario } from '../../models/usuario.model';

/** Componente hijo: muestra un estudiante y avisa cuando lo seleccionan. */
@Component({
  selector: 'app-tarjeta-usuario',
  templateUrl: './tarjeta-usuario.component.html'
})
export class TarjetaUsuarioComponent {
  usuario = input.required<Usuario>();   // dato que BAJA del padre
  seleccionar = output<Usuario>();       // evento que SUBE al padre
}
