'use server';

import { revalidatePath } from 'next/cache';
import { eq, and, desc, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { messages, orders, users } from '@/lib/db/schema';
import { messageSchema } from '@/lib/validations/message';

// ============================================
// Envia uma mensagem no chat do pedido
// ============================================
export async function sendMessage(data: {
  orderId: string;
  content: string;
  fileUrl?: string;
  fileType?: 'IMAGE' | 'VIDEO' | 'PDF' | 'OTHER';
  fileName?: string;
}) {
  const session = await auth();
  if (!session?.user) return { error: 'Não autenticado' };

  const parsed = messageSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Verifica se o pedido existe e se o usuário tem acesso
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, parsed.data.orderId))
    .limit(1);

  if (!order) return { error: 'Pedido não encontrado' };

  const isAdmin = session.user.role === 'ADMIN';
  const isOwner = order.userId === session.user.id;

  if (!isAdmin && !isOwner) {
    return { error: 'Acesso negado' };
  }

  const messageId = randomUUID();

  await db.insert(messages).values({
    id: messageId,
    orderId: parsed.data.orderId,
    senderId: session.user.id,
    content: parsed.data.content,
    fileUrl: parsed.data.fileUrl || null,
    fileType: parsed.data.fileType || null,
    fileName: parsed.data.fileName || null,
    isRead: false,
  });

  // Revalida os paths do chat
  revalidatePath(`/minha-conta/pedido/${parsed.data.orderId}/chat`);
  revalidatePath(`/dashboard/pedidos/${parsed.data.orderId}/chat`);

  return { success: true, messageId };
}

// ============================================
// Retorna mensagens de um pedido e marca como lidas
// ============================================
export async function getMessages(orderId: string) {
  const session = await auth();
  if (!session?.user) return [];

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) return [];

  const isAdmin = session.user.role === 'ADMIN';
  const isOwner = order.userId === session.user.id;

  if (!isAdmin && !isOwner) return [];

  // Busca mensagens com info do remetente
  const result = await db
    .select({
      id: messages.id,
      orderId: messages.orderId,
      senderId: messages.senderId,
      content: messages.content,
      fileUrl: messages.fileUrl,
      fileType: messages.fileType,
      fileName: messages.fileName,
      isRead: messages.isRead,
      createdAt: messages.createdAt,
      sender: {
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
      },
    })
    .from(messages)
    .leftJoin(users, sql`${messages.senderId} = ${users.id} COLLATE utf8mb4_0900_ai_ci`)
    .where(eq(messages.orderId, orderId))
    .orderBy(desc(messages.createdAt));

  // Marca como lidas as mensagens não enviadas pelo usuário atual
  const unreadIds = result
    .filter((m) => m.senderId !== session.user.id && !m.isRead)
    .map((m) => m.id);

  if (unreadIds.length > 0) {
    await Promise.all(
      unreadIds.map((id) =>
        db
          .update(messages)
          .set({ isRead: true })
          .where(eq(messages.id, id))
      )
    );
  }

  return result.reverse(); // mais antigas primeiro
}

// ============================================
// Conta mensagens não lidas (para badges)
// ============================================
export async function getUnreadCount() {
  const session = await auth();
  if (!session?.user) return 0;

  const isAdmin = session.user.role === 'ADMIN';

  if (isAdmin) {
    const result = await db
      .select({
        role: users.role,
        isRead: messages.isRead,
      })
      .from(messages)
      .leftJoin(users, sql`${messages.senderId} = ${users.id} COLLATE utf8mb4_0900_ai_ci`)
      .where(eq(messages.isRead, false));

    return result.filter((m) => m.role === 'CLIENT').length;
  } else {
    const result = await db
      .select({
        role: users.role,
        orderUserId: orders.userId,
        isRead: messages.isRead,
      })
      .from(messages)
      .leftJoin(users, sql`${messages.senderId} = ${users.id} COLLATE utf8mb4_0900_ai_ci`)
      .leftJoin(orders, eq(messages.orderId, orders.id))
      .where(eq(messages.isRead, false));

    return result.filter(
      (m) =>
        m.role === 'ADMIN' &&
        m.orderUserId === session.user.id
    ).length;
  }
}
