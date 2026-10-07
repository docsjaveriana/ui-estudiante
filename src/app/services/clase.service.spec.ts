import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Clase, ClaseRequest } from '../models/clase.model';
import { ClaseService } from './clase.service';

describe('ClaseService', () => {
  let service: ClaseService;
  let http: HttpTestingController;
  const api = environment.apiUrl;
  const nueva: ClaseRequest = { codigo: 'DW-101', nombre: 'Desarrollo Web', creditos: 3, semestre: null, usuarioId: 1 };
  const creada: Clase = { id: 10, ...nueva };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ClaseService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list hace GET /api/estudiante/clases', () => {
    let resultado: Clase[] = [];
    service.list().subscribe(data => (resultado = data));

    http.expectOne(`${api}/clases`).flush([creada]);
    expect(resultado).toEqual([creada]);
  });

  it('create hace POST y devuelve la clase creada', () => {
    let resultado: Clase | undefined;
    service.create(nueva).subscribe(data => (resultado = data));

    const req = http.expectOne(`${api}/clases`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nueva);
    req.flush(creada, { status: 201, statusText: 'Created' });
    expect(resultado?.id).toBe(10);
  });

  it('get, update y delete usan /clases/:id', () => {
    service.get(10).subscribe();
    service.update(10, nueva).subscribe();
    service.delete(10).subscribe();

    const reqs = http.match(`${api}/clases/10`);
    expect(reqs.map(r => r.request.method)).toEqual(['GET', 'PUT', 'DELETE']);
    reqs.forEach(r => r.flush(null));
  });
});
