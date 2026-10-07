import { TestBed } from '@angular/core/testing';
import { Usuario } from '../../models/usuario.model';
import { TarjetaUsuarioComponent } from './tarjeta-usuario.component';

describe('TarjetaUsuarioComponent', () => {
  const ana: Usuario = { id: 1, nombre: 'Ana', correo: 'ana@javeriana.edu.co' };

  it('muestra el usuario que recibe y lo emite al seleccionar', async () => {
    const fixture = TestBed.createComponent(TarjetaUsuarioComponent);
    fixture.componentRef.setInput('usuario', ana);
    await fixture.whenStable();

    let emitido: Usuario | undefined;
    fixture.componentInstance.seleccionar.subscribe(u => (emitido = u));
    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

    expect(fixture.nativeElement.textContent).toContain('ana@javeriana.edu.co');
    expect(emitido).toEqual(ana);
  });
});
