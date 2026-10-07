/** Cuerpo uniforme de error del backend: espejo de ErrorResponse. */
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  /** Errores por campo; solo presente en un 400 de validación. */
  campos?: Record<string, string>;
}
