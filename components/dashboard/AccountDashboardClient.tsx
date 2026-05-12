'use client';

import { useState, useMemo, useEffect } from 'react';
import { Package, Clock, CheckCircle2, MessageSquare, Search, Filter, ArrowUpRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { StatsCard } from './StatsCard';
import { OrderCard } from './OrderCard';
import { NextStepsCard } from './NextStepsCard';
import { OrderDetailsSheet } from './OrderDetailsSheet';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/lib/db/schema';

interface AccountDashboardClientProps {
  initialOrders: any[];
  user: any;
}

export function AccountDashboardClient({ initialOrders, user }: AccountDashboardClientProps) {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: initialOrders.length,
      inProgress: initialOrders.filter(o => ['CONFIRMED', 'IN_PROGRESS', 'REVIEW'].includes(o.status)).length,
      delivered: initialOrders.filter(o => o.status === 'DELIVERED').length,
      pending: initialOrders.filter(o => o.status === 'PENDING').length,
    };
  }, [initialOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return initialOrders.filter(order => {
      const matchesFilter = filter === 'ALL' || order.status === filter;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        order.id.toLowerCase().includes(searchLower) || 
        (order.service?.title || '').toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower);
      
      return matchesFilter && matchesSearch;
    });
  }, [initialOrders, filter, searchTerm]);

  const filterTabs = [
    { id: 'ALL', label: 'Todos' },
    { id: 'PENDING', label: 'Pendentes' },
    { id: 'IN_PROGRESS', label: 'Em Andamento' },
    { id: 'DELIVERED', label: 'Entregues' },
    { id: 'CANCELLED', label: 'Cancelados' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-lg max-w-xl">
            Acompanhe seus pedidos, envie materiais e converse com seu editor em um só lugar.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Última Atualização</p>
                <p className="text-xs font-bold text-white">Hoje, às 14:30</p>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          label="Total de Pedidos" 
          value={stats.total} 
          icon={Package} 
          description="Volume total de projetos"
        />
        <StatsCard 
          label="Em Andamento" 
          value={stats.inProgress} 
          icon={Clock} 
          iconColor="text-amber-400"
          description="Edições sendo processadas"
        />
        <StatsCard 
          label="Entregues" 
          value={stats.delivered} 
          icon={CheckCircle2} 
          iconColor="text-emerald-400"
          description="Finalizados e aprovados"
        />
        <StatsCard 
          label="Pendentes" 
          value={stats.pending} 
          icon={MessageSquare} 
          iconColor="text-fuchsia-400"
          description="Aguardando materiais"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Left Column: Orders */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              Meus Pedidos
              <span className="text-xs font-black px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-zinc-500">
                {filteredOrders.length}
              </span>
            </h2>

            {/* Filters */}
            <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-xl overflow-x-auto no-scrollbar">
              {filterTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                    filter === tab.id 
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" 
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="py-24 text-center glass border border-white/5 rounded-[2.5rem]">
                <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-zinc-700" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nenhum pedido encontrado</h3>
                <p className="text-zinc-500 max-w-xs mx-auto mb-8">
                  {searchTerm 
                    ? `Não encontramos resultados para "${searchTerm}". Tente outros termos.` 
                    : "Você ainda não tem pedidos nesta categoria."}
                </p>
                {filter !== 'ALL' && (
                  <button 
                    onClick={() => setFilter('ALL')}
                    className="text-violet-400 font-bold text-sm hover:underline"
                  >
                    Ver todos os pedidos
                  </button>
                )}
              </div>
            ) : (
              filteredOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onClick={() => setSelectedOrder(order)} 
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
           <NextStepsCard orders={initialOrders} />
           
           {/* Feedback/Support Card */}
           <div className="glass border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-600/5 rounded-full blur-3xl group-hover:bg-violet-600/10 transition-all duration-700" />
              
              <h3 className="text-lg font-bold text-white mb-4">Precisa de ajuda?</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                Nossa equipe de suporte está disponível para tirar qualquer dúvida sobre seus pedidos.
              </p>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group/btn hover:bg-white/10 transition-all">
                <span className="text-sm font-bold text-white">Falar com Suporte</span>
                <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover/btn:text-violet-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
              </button>
           </div>
        </div>
      </div>

      {/* Order Details Panel */}
      <OrderDetailsSheet 
        order={selectedOrder} 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
}
