'use server';

import { revalidatePath } from 'next/cache';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { portfolio } from '@/lib/db/schema';
import { portfolioSchema } from '@/lib/validations/service';
import type { PortfolioInput } from '@/lib/validations/service';

// ============================================
// Cria item do portfólio (apenas ADMIN)
// ============================================
export async function createPortfolioItem(data: PortfolioInput) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Acesso negado' };
  }

  const parsed = portfolioSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const id = randomUUID();

  await db.insert(portfolio).values({
    id,
    ...parsed.data,
  });

  revalidatePath('/portfolio');
  revalidatePath('/dashboard/portfolio');
  revalidatePath('/');

  return { success: true, id };
}

// ============================================
// Atualiza item do portfólio (apenas ADMIN)
// ============================================
export async function updatePortfolioItem(id: string, data: Partial<PortfolioInput>) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Acesso negado' };
  }

  await db
    .update(portfolio)
    .set(data)
    .where(eq(portfolio.id, id));

  revalidatePath('/portfolio');
  revalidatePath('/dashboard/portfolio');
  revalidatePath('/');

  return { success: true };
}

// ============================================
// Remove item do portfólio (apenas ADMIN)
// ============================================
export async function deletePortfolioItem(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Acesso negado' };
  }

  await db.delete(portfolio).where(eq(portfolio.id, id));

  revalidatePath('/portfolio');
  revalidatePath('/dashboard/portfolio');
  revalidatePath('/');

  return { success: true };
}

// ============================================
// Lista itens do portfólio
// ============================================
export async function getPortfolioItems(category?: string, featured?: boolean) {
  const items = await db
    .select()
    .from(portfolio)
    .where(category ? eq(portfolio.category, category) : undefined)
    .orderBy(desc(portfolio.sortOrder), desc(portfolio.createdAt));

  if (featured !== undefined) {
    return items.filter((i) => i.isFeatured === featured);
  }

  return items;
}
