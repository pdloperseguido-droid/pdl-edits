import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function migrate() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const sqlFile = path.join(process.cwd(), 'lib/db/migrations/0000_simple_beast.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  const statements = sql.split('--> statement-breakpoint');
  
  for (const statement of statements) {
    if (statement.trim()) {
      console.log('Executing:', statement.trim().substring(0, 50) + '...');
      await connection.query(statement.trim());
    }
  }
  
  console.log('Migration complete!');
  await connection.end();
}

migrate().catch(console.error);
