import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL no está definido. Revisa backend/.env');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text, params = []) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  // Para evidencia normal se usan los bloques visuales por RF en controllers.
  // Activa DEBUG_SQL=true solo cuando necesites depurar consultas crudas.
  if (process.env.DEBUG_SQL === 'true') {
    console.log('SQL ejecutado', { text, duration, rows: result.rowCount });
  }

  return result;
}

export async function testDBConnection() {
  const result = await pool.query('SELECT NOW() AS now');
  console.log('✅ PostgreSQL conectado:', result.rows[0].now);
}
