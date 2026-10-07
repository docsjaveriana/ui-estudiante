import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let http: HttpTestingController;
  const api = environment.apiUrl;
  const ana: Usuario = { id: 1, nombre: 'Ana', correo: 'ana@javeriana.edu.co' };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(UsuarioService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list hace GET /api/estudiante/usuarios', () => {
    let resultado: Usuario[] = [];
    service.list().subscribe(data => (resultado = data));

    const req = http.expectOne(`${api}/usuarios`);
    expect(req.request.method).toBe('GET');
    req.flush([ana]);
    expect(resultado).toEqual([ana]);
  });

  it('create hace POST con el cuerpo sin id', () => {
    service.create({ nombre: 'Ana', correo: 'ana@javeriana.edu.co' }).subscribe();

    const req = http.expectOne(`${api}/usuarios`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nombre: 'Ana', correo: 'ana@javeriana.edu.co' });
    req.flush(ana);
  });

  it('update hace PUT sobre /usuarios/:id', () => {
    service.update(1, { nombre: 'Ana María', correo: 'ana@javeriana.edu.co' }).subscribe();

    const req = http.expectOne(`${api}/usuarios/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(ana);
  });

  it('delete hace DELETE sobre /usuarios/:id', () => {
    service.delete(1).subscribe();

    const req = http.expectOne(`${api}/usuarios/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('listClases consulta las clases del usuario', () => {
    service.listClases(1).subscribe();

    expect(http.expectOne(`${api}/usuarios/1/clases`).request.method).toBe('GET');
  });
});
