import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, X, Clock, ArrowLeft, Star, ShoppingCart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, safeParseJSON } from '@/lib/utils';
import { OrderForm } from './OrderForm';

import { getServiceBySlug } from '@/server/actions/services';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: 'Serviço não encontrado' };
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  const features = safeParseJSON<string[]>(service.features, []);
  const notIncluded = safeParseJSON<string[]>(service.notIncluded, []);
  const tags = (service.tags || '').split(',');
  const rating = 5.0;
  const reviews = 24;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero da página */}
            <div className="relative rounded-2xl overflow-hidden h-72 md:h-96">
              <img src={service.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop'} alt={service.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <Badge variant="category" className="mb-3">{service.category}</Badge>
                <h1 className="text-4xl font-black text-white">{service.title}</h1>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`} />
                ))}
              </div>
              <span className="text-zinc-300 font-semibold">{rating.toFixed(1)}</span>
              <span className="text-zinc-500 text-sm">({reviews} avaliações)</span>
            </div>

            {/* Descrição */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Sobre este serviço</h2>
              <p className="text-zinc-400 leading-relaxed">{service.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="category">{tag}</Badge>
              ))}
            </div>

            {/* Incluído / Não incluído */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400" /> O que está incluído
                </h3>
                <ul className="space-y-3">
                  {features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <X className="w-5 h-5 text-red-400" /> Não incluído
                </h3>
                <ul className="space-y-3">
                  {notIncluded.map((f: string) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-400">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Garantia */}
            <div className="flex items-center gap-4 glass border border-violet-500/15 rounded-2xl p-5">
              <div className="w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Satisfação garantida</h3>
                <p className="text-sm text-zinc-400">Trabalhamos até você ficar 100% satisfeito. Revisões inclusas no prazo.</p>
              </div>
            </div>
          </div>

          {/* Sidebar sticky de compra */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="border-gradient p-6 space-y-6">
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Preço do serviço</p>
                  <p className="text-4xl font-black text-white">{formatPrice(Number(service.price))}</p>
                </div>

                <div className="flex items-center gap-3 py-4 border-y border-white/5">
                  <Clock className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-sm text-white font-medium">Prazo de entrega</p>
                    <p className="text-xs text-zinc-400">{service.deliveryDays} dias úteis</p>
                  </div>
                </div>

                <OrderForm serviceId={service.id} serviceTitle={service.title} />

                <p className="text-xs text-center text-zinc-500">
                  Pagamento 100% seguro via Stripe. Sem cobranças ocultas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
