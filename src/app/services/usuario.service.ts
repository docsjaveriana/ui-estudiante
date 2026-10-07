import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Clase } from '../models/clase.model';
import { Usuario, UsuarioRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/usuarios`;

  list(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  get(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  create(usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario);
  }

  update(id: number, usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  listClases(id: number): Observable<Clase[]> {
    return this.http.get<Clase[]>(`${this.url}/${id}/clases`);
  }
}
