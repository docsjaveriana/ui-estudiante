/**
 * Configuración de producción.
 *
 * La URL es relativa: en producción el Ingress publica frontend y API bajo el mismo dominio.
 * En desarrollo este archivo se reemplaza por environment.development.ts, que se genera
 * desde BACKEND_URL en .env (ver scripts/generar-env.mjs).
 */
export const environment = {
  apiUrl: '/api/estudiante'
};
