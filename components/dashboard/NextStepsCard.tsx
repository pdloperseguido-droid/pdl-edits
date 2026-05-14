import { ArrowRight, Upload, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NextStepsCardProps {
  orders: any[];
}

export function NextStepsCard({ orders }: NextStepsCardProps) {
  // Logic to determine the most urgent next step
  const pendingOrder = orders.find(o => o.status === 'PENDING');
  const inProgressOrder = orders.find(o => o.status === 'IN_PROGRESS' || o.status === 'REVIEW');
  
  let content = {
    title: 'Novo no PDL Edits?',
    description: 'Transforme seu conteúdo bruto em uma obra-prima profissional.',
    buttonText: 'Explorar Catálogo',
    buttonHref: '/catalogo',
    icon: Sparkles,
    color: 'from-violet-500 to-fuchsia-500'
  };

  if (pendingOrder) {
    content = {
      title: 'Ação Necessária',
      description: `O pedido #${pendingOrder.id.slice(0, 8).toUpperCase()} está aguardando o envio dos materiais para começar.`,
      buttonText: 'Enviar Materiais',
      buttonHref: `/minha-conta/pedido/${pendingOrder.id}/chat`,
      icon: Upload,
      color: 'from-amber-500 to-orange-500'
    };
  } else if (inProgressOrder) {
    content = {
      title: 'Acompanhe a Edição',
      description: 'Seu projeto está em mãos talentosas. Fale com seu editor para alinhar detalhes.',
      buttonText: 'Abrir Chat',
      buttonHref: `/minha-conta/pedido/${inProgressOrder.id}/chat`,
      icon: MessageCircle,
      color: 'from-violet-500 to-blue-500'
    };
  } else if (orders.length > 0) {
    content = {
      title: 'Tudo em dia!',
      description: 'Que tal iniciar um novo projeto hoje? Temos novidades no catálogo.',
      buttonText: 'Novo Pedido',
      buttonHref: '/catalogo',
      icon: ShoppingBag,
      color: 'from-emerald-500 to-teal-500'
    };
  }

  const Icon = content.icon;

  return (
    <div className="relative group overflow-hidden glass-strong border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 hover:border-violet-500/30">
      {/* Background Decor */}
      <div className={cn(
        "absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-all duration-700 group-hover:opacity-30",
        content.color === 'from-amber-500 to-orange-500' ? 'bg-amber-500' : 
        content.color === 'from-emerald-500 to-teal-500' ? 'bg-emerald-500' : 'bg-violet-600'
      )} />

      <div className="relative space-y-6">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-2xl",
          content.color
        )}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{content.title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed font-medium">
            {content.description}
          </p>
        </div>

        <Link 
          href={content.buttonHref}
          className={cn(
            "inline-flex items-center gap-2 w-full justify-center py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-2xl",
            "bg-gradient-to-r hover:scale-[1.02] active:scale-[0.98]",
            content.color
          )}
        >
          {content.buttonText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
