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
    <div className="relative group overflow-hidden bg-white/[0.03] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/10">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <Icon size={120} />
      </div>

      <div className="relative space-y-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
          content.color
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {content.description}
          </p>
        </div>

        <Link 
          href={content.buttonHref}
          className={cn(
            "inline-flex items-center gap-2 w-full justify-center py-3 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-black/20",
            "bg-gradient-to-r hover:opacity-90 active:scale-[0.98]",
            content.color
          )}
        >
          {content.buttonText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
