import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';
import { FormularioSimpleComponent } from './formulario-simple.component';

describe('FormularioSimpleComponent', () => {
  const service = { create: vi.fn() };

  beforeEach(() => {
    service.create.mockReset();
    TestBed.configureTestingModule({
      imports: [FormularioSimpleComponent],
      providers: [{ provide: UsuarioService, useValue: service }]
    });
  });

  it('no llama al servicio si el formulario está vacío', () => {
    const componente = TestBed.createComponent(FormularioSimpleComponent).componentInstance;

    componente.guardar();

    expect(service.create).not.toHaveBeenCalled();
    expect(componente.form.controls.nombre.touched).toBe(true);
  });

  it('envía { nombre, correo } y muestra el id creado', () => {
    service.create.mockReturnValue(of({ id: 7, nombre: 'Ana', correo: 'ana@javeriana.edu.co' }));
    const componente = TestBed.createComponent(FormularioSimpleComponent).componentInstance;

    componente.form.setValue({ nombre: 'Ana', correo: 'ana@javeriana.edu.co' });
    componente.guardar();

    expect(service.create).toHaveBeenCalledWith({ nombre: 'Ana', correo: 'ana@javeriana.edu.co' });
    expect(componente.mensaje()).toBe('Estudiante creado con id 7');
  });
});
