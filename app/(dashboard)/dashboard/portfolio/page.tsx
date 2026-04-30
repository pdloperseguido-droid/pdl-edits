import type { Metadata } from 'next';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getPortfolioItems } from '@/server/actions/portfolio';
import { PortfolioManager } from './PortfolioManager';

export const metadata: Metadata = { title: 'Gerenciar Portfólio — Dashboard' };

export default async function PortfolioAdminPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/minha-conta');

  const items = await getPortfolioItems();

  return <PortfolioManager initialItems={items} />;
}
