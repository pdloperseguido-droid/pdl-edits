'use server';

import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { serviceSchema, type ServiceInput } from '@/lib/validations/service';
import { auth } from '@/lib/auth/config';

/**
 * Busca todos os serviços ativos do banco de dados (Público)
 */
export async function getActiveServices() {
  return await db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.sortOrder));
}

/**
 * Busca todos os serviços (Admin)
 */
export async function getAllServices() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') throw new Error('Não autorizado');
  
  return await db.select().from(services).orderBy(desc(services.createdAt));
}

/**
 * Busca um serviço pelo slug
 */
export async function getServiceBySlug(slug: string) {
  const results = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return results[0] || null;
}

/**
 * Cria um novo serviço (Admin)
 */
export async function createService(data: ServiceInput) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') return { error: 'Não autorizado' };

  try {
    const validated = serviceSchema.parse(data);
    const id = randomUUID();

    await db.insert(services).values({
      id,
      ...validated,
      price: validated.price.toString(),
      features: JSON.stringify(validated.features || []),
      notIncluded: JSON.stringify(validated.notIncluded || []),
      tags: (validated.tags || []).join(','),
    });

    revalidatePath('/catalogo');
    revalidatePath('/dashboard/catalogo');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating service:', error);
    return { error: error.message || 'Erro ao criar serviço' };
  }
}

/**
 * Atualiza um serviço existente (Admin)
 */
export async function updateService(id: string, data: ServiceInput) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') return { error: 'Não autorizado' };

  try {
    const validated = serviceSchema.parse(data);

    await db.update(services)
      .set({
        ...validated,
        price: validated.price.toString(),
        features: JSON.stringify(validated.features || []),
        notIncluded: JSON.stringify(validated.notIncluded || []),
        tags: (validated.tags || []).join(','),
      })
      .where(eq(services.id, id));

    revalidatePath('/catalogo');
    revalidatePath(`/catalogo/${validated.slug}`);
    revalidatePath('/dashboard/catalogo');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating service:', error);
    return { error: error.message || 'Erro ao atualizar serviço' };
  }
}

/**
 * Exclui um serviço (Admin)
 */
export async function deleteService(id: string) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') return { error: 'Não autorizado' };

  try {
    await db.delete(services).where(eq(services.id, id));
    revalidatePath('/catalogo');
    revalidatePath('/dashboard/catalogo');
    return { success: true };
  } catch (error: any) {
    return { error: 'Erro ao excluir serviço' };
  }
}

/**
 * Ativa/Desativa um serviço (Admin)
 */
export async function toggleServiceActive(id: string, isActive: boolean) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') return { error: 'Não autorizado' };

  try {
    await db.update(services).set({ isActive }).where(eq(services.id, id));
    revalidatePath('/catalogo');
    revalidatePath('/dashboard/catalogo');
    return { success: true };
  } catch (error: any) {
    return { error: 'Erro ao alterar status' };
  }
}
