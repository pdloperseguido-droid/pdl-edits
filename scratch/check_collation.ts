
import { mysqlTable, varchar, text, int, decimal, boolean, timestamp, mysqlEnum, index } from 'drizzle-orm/mysql-core';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'pdledits',
  });

  console.log('Checking database collation...');
  const [dbResult] = await connection.query('SELECT @@character_set_database, @@collation_database');
  console.log('Database:', dbResult);

  console.log('\nChecking table collations...');
  const [tableResult] = await connection.query(`
    SELECT table_name, table_collation 
    FROM information_schema.tables 
    WHERE table_schema = 'pdledits'
  `);
  console.table(tableResult);

  console.log('\nChecking column collations...');
  const [columnResult] = await connection.query(`
    SELECT table_name, column_name, collation_name 
    FROM information_schema.columns 
    WHERE table_schema = 'pdledits' AND collation_name IS NOT NULL
  `);
  console.table(columnResult);

  await connection.end();
}

main().catch(console.error);
