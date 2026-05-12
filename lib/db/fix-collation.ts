
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function fixCollation() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not found in .env.local');
    return;
  }

  console.log('Connecting to database to apply comprehensive collation fix...');
  
  try {
    const connection = await mysql.createConnection(url);
    const dbName = url.split('/').pop()?.split('?')[0] || 'pdledits';

    const queries = [
      `ALTER DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`,
      `ALTER TABLE \`users\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`,
      `ALTER TABLE \`accounts\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`,
      `ALTER TABLE \`sessions\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`,
      `ALTER TABLE \`services\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`,
      `ALTER TABLE \`portfolio\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`,
      `ALTER TABLE \`orders\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`,
      `ALTER TABLE \`messages\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`
    ];

    for (const query of queries) {
      console.log(`Executing: ${query}`);
      await connection.query(query);
    }

    console.log('\nSUCCESS: All tables and database unified to utf8mb4_0900_ai_ci.');
    await connection.end();
  } catch (error) {
    console.error('Failed to apply fix:', error);
    console.log('\nTIP: If you are getting ECONNREFUSED, make sure your MySQL server is running and the credentials in .env.local are correct.');
  }
}

fixCollation();
