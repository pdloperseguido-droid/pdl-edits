'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, ShoppingBag, LogOut, Film as FilmIcon, 
  X, Menu, ChevronRight, LayoutDashboard, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerSidebarProps {
  session: any;
  isAdmin: boolean;
}

export function CustomerSidebar({ session, isAdmin }: CustomerSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = isAdmin ? [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Visão Geral' },
    { href: '/dashboard/pedidos', icon: ShoppingBag, label: 'Pedidos' },
    { href: '/dashboard/portfolio', icon: FilmIcon, label: 'Portfólio' },
    { href: '/dashboard/catalogo', icon: Settings, label: 'Catálogo' },
  ] : [
    { href: '/minha-conta', icon: User, label: 'Minha Conta' },
    { href: '/minha-conta', icon: ShoppingBag, label: 'Meus Pedidos' },
  ];

  const SidebarContent = () => (
    <div className="flex-1 bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2rem] flex flex-col overflow-hidden shadow-2xl">
      {/* Brand */}
      <div className="p-8 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-all duration-300">
            <FilmIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-black text-white font-display tracking-tight text-xl leading-none">
              PDL <span className="text-violet-400">Edits</span>
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mt-1">Premium Studio</p>
          </div>
        </Link>
      </div>

      {/* User Card */}
      <div className="px-6 py-6">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3 group hover:bg-white/[0.08] transition-all">
          <div className="relative">
            {session.user.image ? (
              <img src={session.user.image} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-violet-500/20 shadow-lg shadow-black/40" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 shadow-lg shadow-black/40 text-zinc-500">
                <User className="w-5 h-5" />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate leading-tight group-hover:text-violet-400 transition-colors">
              {session.user.name.split(' ')[0]}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">
              {isAdmin ? 'Diretor Artístico' : 'Cliente VIP'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-violet-400 transition-all" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Dashboard</p>
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href + link.label}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
                isActive 
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" 
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors duration-300",
                isActive ? "text-white" : "text-zinc-600 group-hover:text-violet-400"
              )} />
              <span>{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/5 rounded-2xl p-2">
           <Link 
            href="/api/auth/signout"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Sair da Conta</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Trigger (Hamburger) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-40 p-2.5 bg-white/5 border border-white/5 rounded-xl text-white backdrop-blur-xl hover:bg-white/10 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-all duration-500",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}>
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer Content */}
        <div className={cn(
          "absolute inset-y-0 left-0 w-80 p-4 transition-transform duration-500 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-full flex flex-col relative">
             <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 z-10 p-2 rounded-xl bg-white/10 text-white border border-white/10 shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
}
