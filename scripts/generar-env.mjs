// Genera src/environments/environment.development.ts a partir de .env.
// Se ejecuta solo antes de `npm start`, `npm test` y `npm run watch` (scripts "pre*").
import { existsSync, writeFileSync } from 'node:fs';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const backendUrl = (process.env.BACKEND_URL ?? 'http://localhost:8080').replace(/\/+$/, '');
const destino = 'src/environments/environment.development.ts';

writeFileSync(destino, `// Archivo generado por scripts/generar-env.mjs a partir de .env. No editar a mano.
export const environment = {
  apiUrl: '${backendUrl}/api/estudiante'
};
`);

console.log(`[env] apiUrl -> ${backendUrl}/api/estudiante`);
