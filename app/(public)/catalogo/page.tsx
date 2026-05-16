import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import {
  Scissors, Type, Music, Palette, CheckCircle, Smartphone,
  Clock, Shield, Headphones, Film
} from 'lucide-react';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { getActiveServices } from '@/server/actions/services';

export const metadata: Metadata = {
  title: 'Serviços de Edição de Vídeo',
  description: 'Contrate edição de vídeo profissional para Reels, Shorts, YouTube, anúncios e conteúdo institucional. Entrega em 72h.',
};

const QUALITY_STANDARDS = [
  {
    icon: Scissors,
    title: 'Corte com ritmo',
    desc: 'Edição dinâmica que retém atenção — cortes no tempo certo para manter o espectador até o final.',
  },
  {
    icon: Type,
    title: 'Legendas profissionais',
    desc: 'Legenda sincronizada, com fonte adequada ao seu estilo, para consumo sem áudio e SEO no YouTube.',
  },
  {
    icon: Music,
    title: 'Tratamento de áudio',
    desc: 'Redução de ruído, equalização e mixagem com trilha. Voz clara e trilha equilibrada.',
  },
  {
    icon: Palette,
    title: 'Identidade visual',
    desc: 'Color grading e elementos visuais alinhados à sua marca — intro, outro e lower thirds consistentes.',
  },
  {
    icon: CheckCircle,
    title: 'Revisão antes da entrega',
    desc: 'Revisamos internamente antes de enviar. Você recebe um vídeo polido, não um rascunho.',
  },
  {
    icon: Smartphone,
    title: 'Formatos prontos para redes',
    desc: 'Exportamos no formato e resolução certos: 9:16 para Reels, 16:9 para YouTube, 1:1 para feed.',
  },
  {
    icon: Clock,
    title: 'Entrega em até 72h',
    desc: 'Prazo real, não promessa. A maioria dos projetos sai antes do prazo.',
  },
  {
    icon: Shield,
    title: 'Revisões incluídas',
    desc: 'Se algo não ficou como esperado, refazemos. Sua satisfação é parte do processo.',
  },
  {
    icon: Headphones,
    title: 'Suporte direto por chat',
    desc: 'Atendimento direto com o editor responsável pelo seu projeto, sem intermediários.',
  },
];

export default async function CatalogoPage() {
  const dbServices = await getActiveServices();

  return (
    <div className="min-h-screen pt-28 pb-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header da página */}
        <div className="mb-20">
          <p className="badge-accent inline-flex mb-5">Catálogo de Serviços</p>
          <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight mb-5">
            Edição profissional
            <br />
            <span className="text-gradient">para cada formato</span>
          </h1>
          <p className="text-base text-zinc-400 max-w-2xl leading-relaxed">
            Você envia o material bruto, nossa equipe organiza, edita e entrega o vídeo pronto para postar.
            Cortes, trilha, legenda, color grading e muito mais — dependendo do serviço escolhido.
          </p>
        </div>

        {/* Padrões de Qualidade — refatorado */}
        <div className="mb-24">
          <h2 className="text-xl font-bold font-display text-white mb-8">
            O que está incluído em nossos serviços
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUALITY_STANDARDS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="card p-5 flex gap-4 group hover:border-violet-500/20 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/20 transition-colors">
                    <Icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13.5px] font-semibold text-white mb-1 font-display">{item.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid de serviços */}
        <h2 className="text-xl font-bold font-display text-white mb-8">Escolha seu serviço</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dbServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
