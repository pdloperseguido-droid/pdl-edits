import type { Metadata } from 'next';
import { Film, Zap, Shield, Heart, Users, MessageSquare, Sparkles, ArrowRight, CheckCircle2, Clock, Star, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre | PDL Edits',
  description: 'Conheça a PDL Edits, sua parceira premium em edição de vídeo e design.'
};

export default function SobrePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pt-32 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-white/[0.02] border border-white/5 p-10 lg:p-20 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Nossa Essência
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
            Elevando o Padrão do <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Conteúdo Digital</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A PDL Edits nasceu da paixão por transformar ideias brutas em experiências visuais memoráveis. 
            Não somos apenas editores; somos seus parceiros criativos na jornada para o topo.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Por que escolher a <span className="text-violet-500">PDL Edits?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass border border-white/5 rounded-3xl p-8 text-center space-y-5 hover:border-violet-500/20 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto ring-1 ring-white/5 group-hover:ring-violet-500/30 transition-all">
              <Shield className="w-7 h-7 text-violet-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Satisfação garantida</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Ajustes e revisões para garantir sua satisfação.
              </p>
            </div>
          </div>

          <div className="glass border border-white/5 rounded-3xl p-8 text-center space-y-5 hover:border-violet-500/20 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto ring-1 ring-white/5 group-hover:ring-violet-500/30 transition-all">
              <Clock className="w-7 h-7 text-violet-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Entrega no prazo</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Cumprimos sempre o prazo acordado, sem desculpas.
              </p>
            </div>
          </div>

          <div className="glass border border-white/5 rounded-3xl p-8 text-center space-y-5 hover:border-violet-500/20 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto ring-1 ring-white/5 group-hover:ring-violet-500/30 transition-all">
              <Star className="w-7 h-7 text-violet-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Qualidade premium</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Editores experientes com ferramentas profissionais.
              </p>
            </div>
          </div>

          <div className="glass border border-white/5 rounded-3xl p-8 text-center space-y-5 hover:border-violet-500/20 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto ring-1 ring-white/5 group-hover:ring-violet-500/30 transition-all">
              <MessageCircle className="w-7 h-7 text-violet-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Suporte direto</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Chat exclusivo com o editor para cada pedido.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Section: Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
            Nossa Missão: <br />
            <span className="text-zinc-500">Democratizar o Design de Elite</span>
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Acreditamos que todo criador, independente do tamanho do seu canal ou empresa, merece ter acesso 
            a uma edição que gere autoridade e conexão com o público. 
          </p>
          <div className="space-y-4">
            {[
              "Processo simplificado e transparente",
              "Comunicação direta com o editor",
              "Estilos de edição personalizados",
              "Foco em retenção e engajamento"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-violet-400" />
                </div>
                <span className="text-sm text-zinc-300 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl group">
           <img 
            src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000" 
            alt="Studio Setup" 
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 p-6 glass border border-white/10 rounded-2xl">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Tecnologia de Ponta</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Software e hardware de última geração para seus projetos.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Como Trabalhamos</h2>
          <p className="text-zinc-500">Um processo fluido do pedido à entrega final.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Escolha", desc: "Selecione o serviço ideal no catálogo.", icon: Sparkles },
            { step: "02", title: "Envio", desc: "Mande seus links e referências pelo chat.", icon: Zap },
            { step: "03", title: "Edição", desc: "Nossos editores transformam seu material.", icon: Film },
            { step: "04", title: "Entrega", desc: "Receba, revise e baixe sua obra-prima.", icon: CheckCircle2 }
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:border-violet-500/20 transition-all group">
              <span className="text-4xl font-black text-white/5 group-hover:text-violet-500/20 transition-colors mb-4 block">
                {item.step}
              </span>
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-[2.5rem] p-10 lg:p-16 text-center shadow-2xl shadow-violet-500/20">
        <h2 className="text-3xl lg:text-4xl font-black text-white mb-6">
          Pronto para elevar seu nível?
        </h2>
        <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg">
          Não deixe seu conteúdo passar despercebido. Comece agora seu primeiro projeto com a PDL Edits.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/catalogo" 
            className="px-8 py-4 bg-white text-violet-600 text-sm font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-[0.98]"
          >
            VER CATÁLOGO
          </a>
          <a 
            href="/minha-conta" 
            className="px-8 py-4 bg-black/20 text-white text-sm font-black rounded-2xl border border-white/20 hover:bg-black/30 transition-all"
          >
            FALAR COM SUPORTE
          </a>
        </div>
      </div>
    </div>
  );
}
