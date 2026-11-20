import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está configurada. Define esta variable de entorno para conectar con Postgres.");
}

// Render inyecta DATABASE_URL con un certificado que node-postgres no valida
// por defecto en este entorno; rejectUnauthorized:false es la práctica
// estándar de Render para conexiones internas/externas a su Postgres gestionado.
// En local (docker-compose, Postgres sin TLS) se desactiva SSL por completo.
const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);

export const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});
