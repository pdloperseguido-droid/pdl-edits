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
    <section className="py-16 px-4 sm:px-6" aria-labelledby="services-title">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="badge-accent inline-flex mb-4">Serviços</p>
            <h2 id="services-title" className="font-heading uppercase text-3xl md:text-4xl font-bold tracking-[-0.035em] leading-tight">
              O que oferecemos
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-sans text-[13px] font-medium text-zinc-400 transition-all duration-200 ease-out hover:text-white hover:bg-white/5 group"
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
                    <h3 className="font-heading text-[15px] font-semibold tracking-[-0.02em] leading-snug text-white mb-1 group-hover:text-violet-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="font-sans text-[13px] font-normal leading-relaxed text-zinc-400 line-clamp-2">{service.shortDescription}</p>
                  </div>

                  <ul className="space-y-1.5 flex-1">
                    {features.slice(0, 4).map((f: string) => (
                      <li key={f} className="flex items-start gap-2 font-sans text-[12px] font-normal text-zinc-400">
                        <Check className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between gap-3">
                    <p className="font-sans text-[10px] text-zinc-500 uppercase font-medium tracking-[0.08em]">
                      A partir de{' '}
                      <span className="text-white font-heading font-semibold text-sm tracking-[-0.01em] normal-case">
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
