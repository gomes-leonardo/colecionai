import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let connectionString = process.env.DATABASE_URL;
if (connectionString && connectionString.includes('@database:')) {
  connectionString = connectionString.replace('@database:', '@localhost:');
}

export const pool = new Pool({
  connectionString: connectionString,
  host: connectionString ? undefined : (process.env.DB_HOST || 'localhost'),
  port: connectionString ? undefined : Number(process.env.DB_PORT || 5432),
  user: connectionString ? undefined : (process.env.DB_USER || 'docker'),
  password: connectionString ? undefined : (process.env.DB_PASS || 'docker'),
  database: connectionString ? undefined : (process.env.DB_NAME || 'colecionai'),
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20,
});

pool.on('error', (err: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Database] Erro no pool de conexão:', err?.message || err);
  }
});

