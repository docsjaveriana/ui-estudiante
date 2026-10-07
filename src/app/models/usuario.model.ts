/** Usuario (estudiante) tal como lo expone la API: espejo de UsuarioResponse. */
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

/** Datos para crear o actualizar un usuario: espejo de UsuarioRequest. */
export type UsuarioRequest = Omit<Usuario, 'id'>;
