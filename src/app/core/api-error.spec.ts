import { HttpErrorResponse } from '@angular/common/http';
import { erroresPorCampo, mensajeDeError } from './api-error';

describe('api-error', () => {
  const respuesta = (status: number, error: unknown = null) => new HttpErrorResponse({ status, error });

  it('usa el message del ErrorResponse del backend', () => {
    const err = respuesta(409, { status: 409, message: 'Ya existe una clase con el código DW-101' });
    expect(mensajeDeError(err, 'por defecto')).toBe('Ya existe una clase con el código DW-101');
  });

  it('informa falta de conexión cuando status es 0', () => {
    expect(mensajeDeError(respuesta(0), 'por defecto')).toContain('No hay conexión');
  });

  it('no expone el detalle de un error 5xx', () => {
    const err = respuesta(500, { message: 'org.postgresql.util.PSQLException: ...' });
    expect(mensajeDeError(err, 'por defecto')).not.toContain('PSQL');
  });

  it('usa el mensaje por defecto si el error no es HTTP o no trae cuerpo', () => {
    expect(mensajeDeError(new Error('x'), 'por defecto')).toBe('por defecto');
    expect(mensajeDeError(respuesta(404), 'por defecto')).toBe('por defecto');
  });

  it('extrae los errores por campo solo de un 400', () => {
    const campos = { correo: 'El correo no tiene un formato válido' };
    expect(erroresPorCampo(respuesta(400, { campos }))).toEqual(campos);
    expect(erroresPorCampo(respuesta(409, { campos }))).toEqual({});
  });
});
