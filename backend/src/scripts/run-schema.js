import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSchema() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está definido. Crea backend/.env a partir de backend/.env.example');
  }

  const schemaPath = path.resolve(__dirname, '../sql/schema.sql');
  const sql = await fs.readFile(schemaPath, 'utf8');

  console.log('Ejecutando esquema PostgreSQL...');
  await pool.query(sql);
  console.log('Esquema PostgreSQL aplicado correctamente.');
}

runSchema()
  .catch((error) => {
    console.error('Error aplicando schema.sql:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
