'use client';

import { Search, Bell, Plus, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface CustomerTopbarProps {
  onFilterClick?: () => void;
}

export function CustomerTopbar({ onFilterClick }: CustomerTopbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set('q', searchTerm);
      } else {
        params.delete('q');
      }
      router.push(`?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams]);

  return (
    <header className="h-16 lg:h-20 shrink-0 flex items-center justify-between px-6 lg:px-8 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] mb-6 shadow-xl shadow-black/20">
      <div className="flex items-center gap-4 flex-1">
        {/* Search */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-zinc-500 w-full max-w-md focus-within:border-violet-500/50 focus-within:bg-white/[0.08] transition-all group">
           <Search className="w-4 h-4 group-focus-within:text-violet-400 transition-colors" />
           <input 
            type="text" 
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar por ID, serviço ou status..." 
            className="bg-transparent border-none text-xs font-medium text-white focus:ring-0 w-full placeholder:text-zinc-600 tracking-wide" 
           />
        </div>
        
        {/* Small screen spacer */}
        <div className="md:hidden w-10" />
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile Search Button - placeholder for now */}
        <button className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative group p-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all hover:bg-white/10 active:scale-95">
          <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-violet-500 rounded-full border-2 border-[#0a0a0a] animate-pulse" />
          
          {/* Tooltip hint */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Notificações
          </div>
        </button>

        <div className="w-px h-6 bg-white/5 mx-2 hidden sm:block" />

        <Link href="/catalogo">
           <button className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl overflow-hidden shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-transform group-hover:scale-110" />
              <Plus className="relative w-4 h-4 text-white" />
              <span className="relative text-xs font-black text-white uppercase tracking-[0.15em]">Novo Pedido</span>
              
              {/* Shine effect */}
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
           </button>
        </Link>
      </div>
    </header>
  );
}
