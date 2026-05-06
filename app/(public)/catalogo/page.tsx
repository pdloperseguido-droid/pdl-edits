import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { getActiveServices } from '@/server/actions/services';

export const metadata: Metadata = {
  title: 'Catálogo de Serviços',
  description: 'Explore todos os serviços de edição de vídeo e foto disponíveis na PDL Edits.',
};

export default async function CatalogoPage() {
  const dbServices = await getActiveServices();
  
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 relative overflow-hidden">
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
            Escolha o plano ideal e eleve o nível do seu conteúdo.
          </p>
        </div>

        {/* Comparativo de planos (Opcional, mantido para valor) */}
        <div className="glass-strong border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <span className="text-9xl font-black">PRO</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-3">
             <span className="w-8 h-1 bg-violet-500 rounded-full" />
             Vantagens dos Planos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-4 px-6 text-zinc-500 font-bold uppercase tracking-widest text-xs">Recurso</th>
                  <th className="py-4 px-6 text-zinc-300 font-bold">Básico</th>
                  <th className="py-4 px-6 text-violet-400 font-bold">Pro (Destaque)</th>
                  <th className="py-4 px-6 text-zinc-300 font-bold">Pacote Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ['Entrega em 72h', '✓', '✓', '✓'],
                  ['Color Grading', '—', '✓', '✓'],
                  ['Revisões', '1', '2', 'Ilimitadas'],
                  ['Suporte no chat', '✓', '✓', 'Prioritário'],
                  ['Exportação 4K', '—', '✓', '✓'],
                  ['Arquivos-fonte', '—', '—', '✓'],
                ].map(([feature, basic, pro, pack]) => (
                  <tr key={feature} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 text-zinc-400 font-medium">{feature}</td>
                    <td className="py-4 px-6 text-zinc-500">{basic}</td>
                    <td className="py-4 px-6 text-violet-400 font-bold">{pro}</td>
                    <td className="py-4 px-6 text-zinc-300">{pack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
