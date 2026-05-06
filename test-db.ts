import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  try {
    console.log('Connecting to:', process.env.DATABASE_URL);
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    console.log('Connected!');
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
test();
