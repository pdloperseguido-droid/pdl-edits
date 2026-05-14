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
      <div className="relative overflow-hidden glass-strong border border-white/10 rounded-[3rem] p-8 md:p-12">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Package className="w-48 h-48 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest">
              Área do Cliente
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
              Fala, <span className="text-gradient">{user.name.split(' ')[0]}</span>! 👋
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
              Sua central de controle para produções de elite. Gerencie seus pedidos, envie arquivos e acompanhe cada etapa em tempo real.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Pedidos Ativos', value: stats.inProgress, icon: Clock, color: 'text-amber-400' },
              { label: 'Concluídos', value: stats.delivered, icon: CheckCircle2, color: 'text-emerald-400' },
            ].map((item, i) => (
              <div key={i} className="glass border border-white/5 rounded-2xl p-4 min-w-[140px]">
                <div className="flex items-center justify-between mb-2">
                  <item.icon className={cn("w-5 h-5", item.color)} />
                  <span className="text-2xl font-black text-white font-display">{item.value}</span>
                </div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions / Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                filter === tab.id 
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30 scale-105" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
          <input 
            type="text"
            placeholder="Buscar por ID ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40 transition-all"
          />
        </div>
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
