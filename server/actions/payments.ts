'use server';

import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { orders, services } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function createCheckoutSession(serviceId: string, notes?: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: 'Você precisa estar logado para fazer um pedido.' };
  }

  // Busca o serviço para garantir que existe e pegar o preço real
  const service = await db.query.services.findFirst({
    where: eq(services.id, serviceId),
  });

  if (!service) {
    return { error: 'Serviço não encontrado.' };
  }

  const orderId = randomUUID();

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: service.title,
              description: service.shortDescription || undefined,
              images: service.thumbnailUrl ? [service.thumbnailUrl] : undefined,
            },
            unit_amount: Math.round(Number(service.price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/minha-conta?success=true&orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?serviceId=${serviceId}&canceled=true`,
      customer_email: session.user.email as string,
      metadata: {
        orderId,
        userId: session.user.id,
        serviceId,
        notes: notes || '',
      },
    });

    // Cria o pedido como PENDING no banco
    await db.insert(orders).values({
      id: orderId,
      userId: session.user.id,
      serviceId,
      status: 'PENDING',
      totalPrice: service.price,
      notes: notes || null,
      paymentStatus: 'PENDING',
      paymentIntentId: checkoutSession.id, // Armazenamos o ID da sessão para o webhook
    });

    return { url: checkoutSession.url };
  } catch (error: any) {
    console.error('Stripe error:', error);
    
    // MOCK: Se a chave for inválida (placeholders), simulamos o sucesso para você testar o fluxo
    const isInvalidKey = error.message?.includes('Invalid API Key') || 
                        error.message?.includes('sk_test_sua_chave') ||
                        error.type === 'StripeAuthenticationError';

    if (isInvalidKey) {
      console.warn('⚠️ MODO DE TESTE (SEM STRIPE): Criando pedido mockado...');
      
      await db.insert(orders).values({
        id: orderId,
        userId: session.user.id,
        serviceId,
        status: 'PENDING',
        totalPrice: service.price,
        notes: notes || null,
        paymentStatus: 'PENDING',
        paymentIntentId: 'mock_' + orderId,
      });

      return { url: `${process.env.NEXT_PUBLIC_APP_URL}/minha-conta?success=true&orderId=${orderId}` };
    }

    return { error: 'Erro ao criar sessão de pagamento.' };
  }
}
