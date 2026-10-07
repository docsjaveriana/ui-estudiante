/** Clase (curso) tal como la expone la API: espejo de ClaseResponse. */
export interface Clase {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: string | null;
  usuarioId: number;
}

/** Datos para crear o actualizar una clase: espejo de ClaseRequest. El backend genera el id. */
export type ClaseRequest = Omit<Clase, 'id'>;
