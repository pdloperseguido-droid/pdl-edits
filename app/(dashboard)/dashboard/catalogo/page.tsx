import type { Metadata } from 'next';
import { safeParseJSON } from '@/lib/utils';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getAllServices } from '@/server/actions/services';
import { ServiceManager } from './ServiceManager';

export const metadata: Metadata = { title: 'Gerenciar Catálogo — Dashboard' };

export default async function CatalogoAdminPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/minha-conta');

  // Busca todos os serviços (incluindo inativos)
  const dbServices = await getAllServices();

  // Tratamento para o cliente (parse de JSON strings para arrays)
  const services = dbServices.map(s => ({
    ...s,
    features: safeParseJSON<string[]>(s.features, []),
    notIncluded: safeParseJSON<string[]>(s.notIncluded, []),
    tags: (s.tags || '').split(',').filter(Boolean),
  }));

  return <ServiceManager initialItems={services} />;
}
