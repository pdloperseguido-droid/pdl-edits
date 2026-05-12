import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// ============================================
// Conexão MySQL com pool de conexões
// Singleton para evitar múltiplas conexões em dev
// ============================================

const globalForDb = globalThis as unknown as {
  __db: any;
};

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/pdledits',
  waitForConnections: true,
  connectionLimit: process.env.NODE_ENV === 'production' ? 10 : 5,
  queueLimit: 0,
  // Força a conexão a usar a collation correta para evitar erros de mix
  charset: 'UTF8MB4_0900_AI_CI',
});

export const db = (globalForDb.__db ?? drizzle(pool, { schema, mode: 'default' })) as ReturnType<typeof drizzle<typeof schema>>;

if (process.env.NODE_ENV !== 'production') globalForDb.__db = db;
export * from './schema';
