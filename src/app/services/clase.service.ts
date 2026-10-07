import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Clase, ClaseRequest } from '../models/clase.model';

@Injectable({ providedIn: 'root' })
export class ClaseService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/clases`;

  list(): Observable<Clase[]> {
    return this.http.get<Clase[]>(this.url);
  }

  get(id: number): Observable<Clase> {
    return this.http.get<Clase>(`${this.url}/${id}`);
  }

  create(clase: ClaseRequest): Observable<Clase> {
    return this.http.post<Clase>(this.url, clase);
  }

  update(id: number, clase: ClaseRequest): Observable<Clase> {
    return this.http.put<Clase>(`${this.url}/${id}`, clase);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
