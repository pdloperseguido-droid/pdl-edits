import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
            const features = JSON.parse(service.features || '[]');
            const icon = ICON_MAP[service.slug] || '✨';

            return (
              <div
                key={service.id}
                className={`relative rounded-2xl p-8 flex flex-col gap-6 animate-fade-in-up hover-lift transition-all ${
                  service.isFeatured
                    ? 'bg-violet-950/40 border border-violet-500/30 glow-purple-sm'
                    : 'glass border border-white/5'
                }`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {service.isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full font-display">
                      ⭐ Mais popular
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-4xl mb-4 block" aria-hidden="true">{icon}</span>
                  <h3 className="text-xl font-bold font-display text-white mb-2">{service.title}</h3>
                  <p className="text-zinc-400 text-sm">{service.shortDescription}</p>
                </div>

                <ul className="space-y-2.5">
                  {features.slice(0, 4).map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-violet-400 flex-shrink-0" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <p className="text-sm text-zinc-500 mb-4 font-medium">A partir de R$ {Number(service.price)}</p>
                  <Link href={`/catalogo/${service.slug}`}>
                    <Button
                      variant={service.isFeatured ? 'primary' : 'secondary'}
                      size="md"
                      className="w-full"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Ver detalhes
                    </Button>
                  </Link>
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
