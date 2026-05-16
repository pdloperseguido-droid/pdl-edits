import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ServiceThumbnail } from '@/components/ui/ServiceThumbnail';
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
    <section className="py-28 px-4 sm:px-6" aria-labelledby="services-title">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="badge-accent inline-flex mb-4">Serviços</p>
            <h2 id="services-title" className="text-3xl md:text-4xl font-bold font-display">
              O que oferecemos
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-violet-400 transition-colors group"
          >
            Ver todos
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dbServices.map((service, i) => {
            const features = safeParseJSON<string[]>(service.features, []);
            const icon = ICON_MAP[service.slug] || '✨';

            return (
              <div
                key={service.id}
                className={`group relative rounded-xl overflow-hidden flex flex-col transition-all duration-200 ${
                  service.isFeatured
                    ? 'bg-[#110d1a] border border-violet-500/20 ring-1 ring-violet-500/10'
                    : 'card'
                }`}
              >
                {service.isFeatured && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="badge-accent text-[10px] px-2 py-0.5">
                      Mais popular
                    </span>
                  </div>
                )}

                {/* Thumbnail */}
                <ServiceThumbnail
                  src={service.thumbnailUrl}
                  alt={service.title}
                  icon={icon}
                />

                {/* Body */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="text-sm font-semibold font-display text-white mb-1 group-hover:text-violet-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2">{service.shortDescription}</p>
                  </div>

                  <ul className="space-y-1.5 flex-1">
                    {features.slice(0, 4).map((f: string) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                        <Check className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between gap-3">
                    <p className="text-xs text-zinc-500">
                      A partir de{' '}
                      <span className="text-white font-semibold font-display text-sm">
                        {Number(service.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </p>
                    <Link href={`/catalogo/${service.slug}`}>
                      <Button
                        variant={service.isFeatured ? 'primary' : 'outline'}
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Ver mais
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
