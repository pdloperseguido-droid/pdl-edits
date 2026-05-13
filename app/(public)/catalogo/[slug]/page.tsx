import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, X, Clock, ArrowLeft, Star, ShoppingCart, Shield, Sparkles, MessageCircle, Lock, Zap } from 'lucide-react';
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
    <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6">
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

            {/* Descrição e Destaques */}
            <div className="glass-strong border border-white/5 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Sparkles className="w-24 h-24 text-white" />
              </div>
              
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-violet-500 rounded-full" />
                Sobre este <span className="text-gradient">serviço</span>
              </h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed text-lg italic mb-6">
                  "{service.shortDescription}"
                </p>
                <div className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </div>
              </div>
            </div>

            {/* Incluído / Não incluído */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass border border-emerald-500/10 rounded-3xl p-8 hover:border-emerald-500/20 transition-all group">
                <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  O que está incluso
                </h3>
                {features.length > 0 ? (
                  <ul className="space-y-4">
                    {features.map((f: string) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500 text-sm italic">Consulte os detalhes na descrição do serviço.</p>
                )}
              </div>

              <div className="glass border border-red-500/10 rounded-3xl p-8 hover:border-red-500/20 transition-all group">
                <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <X className="w-6 h-6 text-red-400" />
                  </div>
                  Não incluso
                </h3>
                {notIncluded.length > 0 ? (
                  <ul className="space-y-4">
                    {notIncluded.map((f: string) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-zinc-400">
                        <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500 text-sm italic">Serviço completo sem restrições listadas.</p>
                )}
              </div>
            </div>

            {/* Trust Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Shield, title: 'Garantia', desc: '100% Satisfeito', color: 'text-violet-400', bg: 'bg-violet-500/10' },
                { icon: Clock, title: 'Prazo', desc: `${service.deliveryDays} Dias Úteis`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { icon: MessageCircle, title: 'Suporte', desc: 'Chat Direto', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: Lock, title: 'Seguro', desc: 'Stripe & Pix', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="glass border border-white/5 rounded-2xl p-4 text-center hover:border-white/10 transition-all">
                    <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">{card.title}</p>
                    <p className="text-[10px] text-zinc-500 uppercase">{card.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Como Funciona Section */}
            <div className="pt-8 border-t border-white/5">
              <h2 className="text-2xl font-bold mb-8 text-center">Como <span className="text-gradient">funciona?</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { step: '01', title: 'Pedido', desc: 'Escolha o serviço e descreva seu projeto.' },
                  { step: '02', title: 'Produção', desc: 'Nossos editores transformam seu material.' },
                  { step: '03', title: 'Entrega', desc: 'Receba, revise e baixe sua obra-prima.' },
                ].map((item, i) => (
                  <div key={i} className="relative text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400 font-black">
                      {item.step}
                    </div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                    {i < 2 && (
                      <div className="hidden md:block absolute top-6 left-[60%] w-full h-px bg-gradient-to-r from-violet-500/30 to-transparent -z-10" />
                    )}
                  </div>
                ))}
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

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span className="text-[10px] font-bold text-white">PIX</span>
                  </div>
                </div>

                <p className="text-[10px] text-center text-zinc-500 leading-tight">
                  Pagamento 100% seguro e criptografado.<br />
                  Seus dados estão protegidos pela PDL Edits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
