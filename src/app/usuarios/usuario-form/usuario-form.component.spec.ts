import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioFormComponent } from './usuario-form.component';

describe('UsuarioFormComponent', () => {
  let fixture: ComponentFixture<UsuarioFormComponent>;
  let element: HTMLElement;
  let service: { create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn>; get: ReturnType<typeof vi.fn> };

  const escribir = (selector: string, valor: string) => {
    const input = element.querySelector<HTMLInputElement>(selector)!;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
  };
  const enviar = async () => {
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    service = { create: vi.fn(), update: vi.fn(), get: vi.fn() };
    TestBed.configureTestingModule({
      imports: [UsuarioFormComponent],
      providers: [provideRouter([]), { provide: UsuarioService, useValue: service }]
    });
    fixture = TestBed.createComponent(UsuarioFormComponent);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('no envía el formulario vacío y muestra los errores', async () => {
    await enviar();

    expect(service.create).not.toHaveBeenCalled();
    expect(element.textContent).toContain('El nombre es obligatorio');
    expect(element.textContent).toContain('El correo es obligatorio');
  });

  it('rechaza un correo con formato inválido', async () => {
    escribir('input[formControlName=nombre]', 'Ana');
    escribir('input[formControlName=correo]', 'no-es-correo');
    await enviar();

    expect(service.create).not.toHaveBeenCalled();
    expect(element.textContent).toContain('El correo no tiene un formato válido');
  });

  it('crea el estudiante y navega a su ficha', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    service.create.mockReturnValue(of({ id: 7, nombre: 'Ana', correo: 'ana@javeriana.edu.co' }));

    escribir('input[formControlName=nombre]', 'Ana');
    escribir('input[formControlName=correo]', 'ana@javeriana.edu.co');
    await enviar();

    expect(service.create).toHaveBeenCalledWith({ nombre: 'Ana', correo: 'ana@javeriana.edu.co' });
    expect(navigate).toHaveBeenCalledWith(['/usuarios', 7]);
  });

  it('muestra el mensaje del backend cuando el correo ya existe', async () => {
    service.create.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 409,
      error: { status: 409, message: 'Ya existe un usuario con el correo ana@javeriana.edu.co' }
    })));

    escribir('input[formControlName=nombre]', 'Ana');
    escribir('input[formControlName=correo]', 'ana@javeriana.edu.co');
    await enviar();

    expect(element.textContent).toContain('Ya existe un usuario con el correo ana@javeriana.edu.co');
    expect(element.querySelector('button[type=submit]')!.hasAttribute('disabled')).toBe(false);
  });
});
