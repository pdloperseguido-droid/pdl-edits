import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function migrate() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const migrationsDir = path.join(process.cwd(), 'lib/db/migrations');
  
  // Lista todos os arquivos SQL na pasta de migrations e ordena
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migrations...`);

  for (const file of files) {
    console.log(`\n--- Running migration: ${file} ---`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    const statements = sql.split('--> statement-breakpoint');

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed && !trimmed.startsWith('--')) {
        console.log('Executing:', trimmed.substring(0, 100) + '...');
        try {
          await connection.query(trimmed);
        } catch (err) {
          console.error(`Error in ${file}:`, err);
          // Continua se for erro de tabela já existente ou algo similar, 
          // mas para collation queremos ver o erro.
        }
      }
    }
  }
  
  console.log('\nMigration process complete!');
  await connection.end();
}

migrate().catch(console.error);

