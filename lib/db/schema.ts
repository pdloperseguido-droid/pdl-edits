import {
  mysqlTable,
  varchar,
  text,
  int,
  decimal,
  boolean,
  timestamp,
  mysqlEnum,
  index,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ============================================
// TABELA: users
// Armazena usuários (clientes e admins)
// ============================================
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  role: mysqlEnum('role', ['ADMIN', 'CLIENT']).notNull().default('CLIENT'),
  image: varchar('image', { length: 500 }),
  emailVerified: timestamp('email_verified'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
}));

// ============================================
// TABELA: accounts
// Para NextAuth OAuth providers
// ============================================
export const accounts = mysqlTable('accounts', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: int('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
}, (table) => ({
  userIdIdx: index('account_user_id_idx').on(table.userId),
}));

// ============================================
// TABELA: sessions
// Sessões NextAuth
// ============================================
export const sessions = mysqlTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).primaryKey().notNull(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  expires: timestamp('expires').notNull(),
});

// ============================================
// TABELA: services
// Catálogo de serviços disponíveis
// ============================================
export const services = mysqlTable('services', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  shortDescription: varchar('short_description', { length: 500 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  deliveryDays: int('delivery_days').notNull().default(3),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  features: text('features'), // JSON array de features incluídas
  notIncluded: text('not_included'), // JSON array de não incluídas
  tags: varchar('tags', { length: 500 }), // separados por vírgula
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  sortOrder: int('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  slugIdx: index('service_slug_idx').on(table.slug),
  categoryIdx: index('service_category_idx').on(table.category),
}));

// ============================================
// TABELA: portfolio
// Itens do portfólio (before/after)
// ============================================
export const portfolio = mysqlTable('portfolio', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(),
  beforeUrl: varchar('before_url', { length: 500 }).notNull(),
  afterUrl: varchar('after_url', { length: 500 }).notNull(),
  type: mysqlEnum('type', ['IMAGE', 'VIDEO']).notNull().default('IMAGE'),
  isFeatured: boolean('is_featured').notNull().default(false),
  sortOrder: int('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('portfolio_category_idx').on(table.category),
  featuredIdx: index('portfolio_featured_idx').on(table.isFeatured),
}));

// ============================================
// TABELA: orders
// Pedidos dos clientes
// ============================================
export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  serviceId: varchar('service_id', { length: 36 }).notNull(),
  status: mysqlEnum('status', [
    'PENDING',
    'CONFIRMED',
    'IN_PROGRESS',
    'REVIEW',
    'DELIVERED',
    'CANCELLED'
  ]).notNull().default('PENDING'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'), // observações do cliente
  paymentMethod: varchar('payment_method', { length: 100 }),
  paymentStatus: mysqlEnum('payment_status', ['PENDING', 'PAID', 'FAILED', 'REFUNDED']).notNull().default('PENDING'),
  paymentIntentId: varchar('payment_intent_id', { length: 255 }), // Stripe
  deliverableUrl: varchar('deliverable_url', { length: 500 }), // arquivo final entregue
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('order_user_id_idx').on(table.userId),
  statusIdx: index('order_status_idx').on(table.status),
  paymentStatusIdx: index('order_payment_status_idx').on(table.paymentStatus),
}));

// ============================================
// TABELA: messages
// Sistema de chat pós-venda por pedido
// ============================================
export const messages = mysqlTable('messages', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  senderId: varchar('sender_id', { length: 36 }).notNull(),
  content: text('content').notNull(),
  fileUrl: varchar('file_url', { length: 500 }),
  fileType: mysqlEnum('file_type', ['IMAGE', 'VIDEO', 'PDF', 'OTHER']),
  fileName: varchar('file_name', { length: 255 }),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  orderIdIdx: index('message_order_id_idx').on(table.orderId),
  senderIdIdx: index('message_sender_id_idx').on(table.senderId),
  isReadIdx: index('message_is_read_idx').on(table.isRead),
}));

// ============================================
// RELAÇÕES
// ============================================
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  orders: many(orders),
  messages: many(messages),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  service: one(services, { fields: [orders.serviceId], references: [services.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  order: one(orders, { fields: [messages.orderId], references: [orders.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

// ============================================
// TIPOS TYPESCRIPT DERIVADOS DO SCHEMA
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Portfolio = typeof portfolio.$inferSelect;
export type NewPortfolio = typeof portfolio.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'REVIEW' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type UserRole = 'ADMIN' | 'CLIENT';
