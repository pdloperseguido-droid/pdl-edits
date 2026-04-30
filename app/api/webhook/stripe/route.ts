import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === 'checkout.session.completed') {
    const orderId = session.metadata.orderId;

    if (!orderId) {
      return new NextResponse('Order ID missing in metadata', { status: 400 });
    }

    // Atualiza o pedido para CONFIRMED e PAID
    await db
      .update(orders)
      .set({
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
      })
      .where(eq(orders.id, orderId));
    
    console.log(`Order ${orderId} confirmed and paid.`);
  }

  return new NextResponse(null, { status: 200 });
}
