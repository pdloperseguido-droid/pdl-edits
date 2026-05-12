'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, ShoppingBag, LogOut, Film as FilmIcon, 
  X, Menu, ChevronRight, LayoutDashboard, Settings, Info
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
    { href: '/sobre', icon: Info, label: 'Sobre' },
  ] : [
    { href: '/minha-conta', icon: User, label: 'Minha Conta' },
    { href: '/minha-conta', icon: ShoppingBag, label: 'Meus Pedidos' },
    { href: '/sobre', icon: Info, label: 'Sobre' },
  ];

  const SidebarContent = () => (
    <div className="flex-1 bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[1.5rem] flex flex-col overflow-hidden shadow-2xl">
      {/* Brand - Compact */}
      <div className="p-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <FilmIcon className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-white tracking-tight text-lg">
            PDL <span className="text-violet-400">Edits</span>
          </h2>
        </Link>
      </div>

      {/* Navigation - Tighter */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href + link.label}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all group",
                isActive 
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" 
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-4 h-4",
                isActive ? "text-white" : "text-zinc-600 group-hover:text-violet-400"
              )} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Logout - Bottom Compact */}
      <div className="p-2 mt-auto border-t border-white/5 bg-white/[0.01]">
        <div className="p-3 flex items-center gap-2.5">
          {session.user.image ? (
            <img src={session.user.image} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 text-zinc-500">
              <User className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-white truncate leading-none">
              {session.user.name.split(' ')[0]}
            </p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-tighter mt-1">
              {isAdmin ? 'Admin' : 'Cliente'}
            </p>
          </div>
          
          <form action="/api/auth/signout" method="POST">
             <button type="submit" className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
             </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Compact width */}
      <aside className="hidden lg:flex w-60 flex-col shrink-0">
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
          "absolute inset-y-0 left-0 w-64 p-4 transition-transform duration-500 ease-out",
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
