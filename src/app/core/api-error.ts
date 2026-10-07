import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response.model';

/**
 * Traduce un error HTTP a un mensaje para el usuario.
 *
 * Usa el `message` del ErrorResponse del backend cuando existe; nunca muestra
 * detalles técnicos (stack traces, SQL, rutas internas).
 */
export function mensajeDeError(err: unknown, porDefecto: string): string {
  if (!(err instanceof HttpErrorResponse)) {
    return porDefecto;
  }
  if (err.status === 0) {
    return 'No hay conexión con el servidor. Verifica que el backend esté en ejecución.';
  }
  if (err.status >= 500) {
    return 'Ocurrió un error en el servidor. Intenta de nuevo más tarde.';
  }
  return (err.error as Partial<ErrorResponse> | null)?.message ?? porDefecto;
}

/** Errores por campo de un 400 de validación (`ErrorResponse.campos`), o un objeto vacío. */
export function erroresPorCampo(err: unknown): Record<string, string> {
  if (err instanceof HttpErrorResponse && err.status === 400) {
    return (err.error as Partial<ErrorResponse> | null)?.campos ?? {};
  }
  return {};
}
