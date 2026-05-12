'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, desc, and, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { orders, services, messages, users } from '@/lib/db/schema';
import { orderSchema, updateOrderStatusSchema } from '@/lib/validations/service';
import type { OrderStatus } from '@/lib/db/schema';

// Transições de status permitidas
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING:     ['CONFIRMED', 'CANCELLED'],
  CONFIRMED:   ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['REVIEW', 'CANCELLED'],
  REVIEW:      ['DELIVERED', 'IN_PROGRESS'],
  DELIVERED:   [],
  CANCELLED:   [],
};

// ============================================
// Cria um novo pedido e inicia thread de chat
// ============================================
export async function createOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  const raw = {
    serviceId: formData.get('serviceId') as string,
    notes: formData.get('notes') as string,
    paymentMethod: formData.get('paymentMethod') as string,
  };

  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const service = await db.query.services.findFirst({
    where: eq(services.id, parsed.data.serviceId),
  });

  if (!service || !service.isActive) {
    return { error: 'Serviço não encontrado ou indisponível' };
  }

  const orderId = randomUUID();

  await db.insert(orders).values({
    id: orderId,
    userId: session.user.id,
    serviceId: service.id,
    status: 'PENDING',
    totalPrice: service.price,
    notes: parsed.data.notes,
    paymentMethod: parsed.data.paymentMethod,
    paymentStatus: 'PENDING',
  });

  // Mensagem automática de boas-vindas ao criar pedido
  const adminUser = await db.query.users.findFirst({
    where: eq(users.role, 'ADMIN'),
  });

  if (adminUser) {
    await db.insert(messages).values({
      id: randomUUID(),
      orderId,
      senderId: adminUser.id,
      content: `Olá! Seu pedido para "${service.title}" foi recebido com sucesso. Em breve entraremos em contato para confirmar os detalhes. 🎬`,
    });
  }

  revalidatePath('/minha-conta');
  redirect(`/minha-conta/pedido/${orderId}/chat`);
}

// ============================================
// Atualiza status do pedido (apenas ADMIN)
// ============================================
export async function updateOrderStatus(data: {
  orderId: string;
  status: OrderStatus;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Acesso negado' };
  }

  const parsed = updateOrderStatusSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, parsed.data.orderId))
    .limit(1);

  if (!order) return { error: 'Pedido não encontrado' };

  const allowed = ALLOWED_TRANSITIONS[order.status as OrderStatus];
  if (!allowed.includes(parsed.data.status)) {
    return { error: `Não é possível mudar de ${order.status} para ${parsed.data.status}` };
  }

  await db
    .update(orders)
    .set({ status: parsed.data.status })
    .where(eq(orders.id, parsed.data.orderId));

  revalidatePath(`/dashboard/pedidos/${parsed.data.orderId}/chat`);
  revalidatePath('/dashboard/pedidos');
  revalidatePath('/minha-conta');

  return { success: true };
}

// ============================================
// Retorna pedidos (filtrado por role)
// ============================================
export async function getOrders(status?: OrderStatus) {
  const session = await auth();
  if (!session?.user) return [];

  const isAdmin = session.user.role === 'ADMIN';

  const whereClause = isAdmin
    ? status ? eq(orders.status, status) : undefined
    : status
      ? and(eq(orders.userId, session.user.id), eq(orders.status, status))
      : eq(orders.userId, session.user.id);

  const result = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      serviceId: orders.serviceId,
      status: orders.status,
      totalPrice: orders.totalPrice,
      notes: orders.notes,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus,
      paymentIntentId: orders.paymentIntentId,
      deliverableUrl: orders.deliverableUrl,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      },
      service: {
        id: services.id,
        title: services.title,
        thumbnailUrl: services.thumbnailUrl,
        price: services.price,
      },
    })
    .from(orders)
    .leftJoin(users, sql`${orders.userId} = ${users.id} COLLATE utf8mb4_0900_ai_ci`)
    .leftJoin(services, sql`${orders.serviceId} = ${services.id} COLLATE utf8mb4_0900_ai_ci`)
    .where(whereClause)
    .orderBy(desc(orders.createdAt));

  return result;
}

// ============================================
// Retorna um pedido específico com detalhes
// ============================================
export async function getOrderById(orderId: string) {
  const session = await auth();
  if (!session?.user) return null;

  const [result] = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      serviceId: orders.serviceId,
      status: orders.status,
      totalPrice: orders.totalPrice,
      notes: orders.notes,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus,
      paymentIntentId: orders.paymentIntentId,
      deliverableUrl: orders.deliverableUrl,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      },
      service: {
        id: services.id,
        title: services.title,
        slug: services.slug,
        description: services.description,
        shortDescription: services.shortDescription,
        price: services.price,
        category: services.category,
        deliveryDays: services.deliveryDays,
        thumbnailUrl: services.thumbnailUrl,
        features: services.features,
        notIncluded: services.notIncluded,
        tags: services.tags,
        isActive: services.isActive,
        isFeatured: services.isFeatured,
        sortOrder: services.sortOrder,
        createdAt: services.createdAt,
        updatedAt: services.updatedAt,
      },
    })
    .from(orders)
    .leftJoin(users, sql`${orders.userId} = ${users.id} COLLATE utf8mb4_0900_ai_ci`)
    .leftJoin(services, sql`${orders.serviceId} = ${services.id} COLLATE utf8mb4_0900_ai_ci`)
    .where(eq(orders.id, orderId))
    .limit(1);

  const order = result;

  if (!order) return null;

  // Cliente só pode ver seus próprios pedidos
  if (session.user.role !== 'ADMIN' && order.userId !== session.user.id) {
    return null;
  }

  return order;
}
