import { db } from './lib/db';
import { users, orders } from './lib/db/schema';

async function check() {
  const allUsers = await db.select().from(users);
  const allOrders = await db.select().from(orders);
  console.log('Users:', allUsers);
  console.log('Orders:', allOrders);
}

check().catch(console.error);
