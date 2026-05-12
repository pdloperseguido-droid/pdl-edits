import type { Metadata } from 'next';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getOrders } from '@/server/actions/orders';
import { AccountDashboardClient } from '@/components/dashboard/AccountDashboardClient';

export const metadata: Metadata = { 
  title: 'Minha Conta | PDL Edits',
  description: 'Gerencie seus pedidos de edição e acompanhe o progresso em tempo real.'
};

export default async function MinhaContaPage() {
  const session = await auth();
  
  if (!session) redirect('/auth/login');
  if (session.user.role === 'ADMIN') redirect('/dashboard');

  const orders = await getOrders();

  return (
    <div className="max-w-[1400px] mx-auto">
      <AccountDashboardClient 
        initialOrders={orders} 
        user={session.user} 
      />
    </div>
  );
}
