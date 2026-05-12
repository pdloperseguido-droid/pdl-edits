
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function fixCollation() {
  // Tenta conectar usando 127.0.0.1 em vez de localhost
  const url = "mysql://root:@127.0.0.1:3306/pdledits";
  
  console.log('Connecting to database via 127.0.0.1 to apply collation fix...');
  
  try {
    const connection = await mysql.createConnection(url);
    const dbName = 'pdledits';

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
    console.error('Failed to apply fix via 127.0.0.1:', error);
  }
}

fixCollation();
