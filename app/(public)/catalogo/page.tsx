import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { Check } from 'lucide-react';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { getActiveServices } from '@/server/actions/services';

export const metadata: Metadata = {
  title: 'Catálogo de Serviços',
  description: 'Explore todos os serviços de edição de vídeo e foto disponíveis na PDL Edits.',
};

export default async function CatalogoPage() {
  const dbServices = await getActiveServices();
  
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">
              Catálogo Completo
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Nossos <span className="text-gradient">Serviços</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Soluções profissionais de edição para criadores de conteúdo, gamers e empresas. 
            Escolha o serviço ideal e eleve o nível do seu conteúdo.
          </p>
        </div>

        {/* Diferenciais do Serviço */}
        <div className="glass-strong border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <span className="text-9xl font-black">QUALITY</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-3">
             <span className="w-8 h-1 bg-violet-500 rounded-full" />
             Nossos Padrões de Qualidade
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {[
              { title: 'Entrega em 72h', desc: 'Agilidade máxima para que seu conteúdo nunca perca o timing.' },
              { title: 'Color Grading', desc: 'Tratamento de cor profissional para um visual cinematográfico.' },
              { title: 'Ajustes de Qualidade', desc: 'Foco total na sua satisfação com revisões pontuais inclusas.' },
              { title: 'Suporte no chat', desc: 'Atendimento direto e personalizado para tirar todas as suas dúvidas.' },
              { title: 'Exportação 4K', desc: 'Seus vídeos com a maior resolução e nitidez possível.' },
              { title: 'Arquivos-fonte', desc: 'Transparência total com a entrega dos arquivos originais do projeto.' },
            ].map((item) => (
              <div key={item.title} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Check className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Grid de serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {dbServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
