import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { safeParseJSON } from '@/lib/utils';
import { getActiveServices } from '@/server/actions/services';

const ICON_MAP: Record<string, string> = {
  'thumbnails': '🎨',
  'edicao-de-video': '🎬',
  'motion-graphics': '✨',
};

export async function FeaturedServicesSection() {
  const dbServices = await getActiveServices();

  return (
    <section className="py-24 px-4 sm:px-6 bg-transparent" aria-labelledby="services-title">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-violet-400 uppercase tracking-widest mb-3">
            Serviços
          </p>
          <h2 id="services-title" className="text-4xl md:text-5xl font-bold font-display">
            Nossos <span className="text-gradient">Serviços</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dbServices.map((service, i) => {
            const features = safeParseJSON<string[]>(service.features, []);
            const icon = ICON_MAP[service.slug] || '✨';

            return (
              <div
                key={service.id}
                className={`group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:scale-[1.02] ${
                  service.isFeatured
                    ? 'bg-gradient-to-br from-violet-950/40 to-fuchsia-950/20 border border-violet-500/30 glow-purple-sm'
                    : 'glass border border-white/5'
                }`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {service.isFeatured && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full font-display shadow-lg">
                      ⭐ Mais popular
                    </span>
                  </div>
                )}

                {/* Thumbnail Preview */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop'}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-3xl" aria-hidden="true">{icon}</span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="text-lg font-bold font-display text-white mb-1 group-hover:text-violet-400 transition-colors">{service.title}</h3>
                    <p className="text-zinc-400 text-sm line-clamp-2">{service.shortDescription}</p>
                  </div>

                  <ul className="space-y-2">
                    {features.slice(0, 4).map((f: string) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                        <Check className="w-4 h-4 text-violet-400 flex-shrink-0" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <p className="text-sm text-zinc-500 font-medium">A partir de <span className="text-white font-bold">{Number(service.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
                    <Link href={`/catalogo/${service.slug}`}>
                      <Button
                        variant={service.isFeatured ? 'primary' : 'secondary'}
                        size="sm"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Ver detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/catalogo" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium group transition-colors">
            Ver todos os serviços
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
