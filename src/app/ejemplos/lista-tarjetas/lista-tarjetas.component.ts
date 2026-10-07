import { Component, OnInit, inject, signal } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { TarjetaUsuarioComponent } from '../tarjeta-usuario/tarjeta-usuario.component';

/** Componente padre: carga los estudiantes y dibuja una tarjeta hija por cada uno (ruta /ejemplos/componentes). */
@Component({
  selector: 'app-lista-tarjetas',
  imports: [TarjetaUsuarioComponent],
  templateUrl: './lista-tarjetas.component.html'
})
export class ListaTarjetasComponent implements OnInit {
  private service = inject(UsuarioService);

  usuarios = signal<Usuario[]>([]);
  elegido = signal<Usuario | null>(null);

  ngOnInit(): void {
    this.service.list().subscribe(data => this.usuarios.set(data));
  }
}
