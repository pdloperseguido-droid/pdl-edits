import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../lib/db';
import { services } from '../lib/db/schema';

async function main() {
  console.log('Database URL used:', process.env.DATABASE_URL ? 'Loaded from .env' : 'Using default');
  const existing = await db.select().from(services);
  console.log('--- ALL SERVICES IN DATABASE ---');
  existing.forEach(s => {
    console.log(`ID: ${s.id} | Slug: "${s.slug}" | Title: "${s.title}"`);
  });
}

main().catch(err => {
  console.error(err);
});
