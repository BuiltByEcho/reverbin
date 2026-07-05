import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../sql/schema.sql');

async function main() {
  const schema = await fs.readFile(schemaPath, 'utf8');
  await pool.query(schema);
  await pool.end();
  console.log('agent-email-layer migration complete');
}

main().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
