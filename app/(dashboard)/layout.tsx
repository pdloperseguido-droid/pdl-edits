import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth/config';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Film, BookOpen,
  User, LogOut, Film as FilmIcon,
  Settings, Bell, Search, Menu
} from 'lucide-react';
import { signOut } from '@/lib/auth/config';

/** Layout Compacto Premium */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/auth/login');

  const isAdmin = session.user.role === 'ADMIN';

  const navLinks = isAdmin ? [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Visão geral' },
    { href: '/dashboard/pedidos', icon: ShoppingBag, label: 'Pedidos' },
    { href: '/dashboard/portfolio', icon: Film, label: 'Portfólio' },
    { href: '/dashboard/catalogo', icon: BookOpen, label: 'Catálogo' },
  ] : [
    { href: '/minha-conta', icon: User, label: 'Minha Conta' },
    { href: '/minha-conta', icon: ShoppingBag, label: 'Meus Pedidos' },
  ];

  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#020202] text-zinc-400 font-sans selection:bg-violet-500/30 selection:text-white">
        
        {/* Background blobs reduzidos */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-violet-600/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[20%] h-[20%] bg-blue-600/5 rounded-full blur-[80px]" />
        </div>

        <div className="flex relative z-10 p-3 min-h-screen gap-3">
          
          {/* Sidebar Compacta */}
          <aside className="hidden lg:flex w-60 flex-col shrink-0">
            <div className="flex-1 bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-[1.5rem] flex flex-col overflow-hidden">
              
              {/* Top: Logo & User */}
              <div className="p-6 space-y-6">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <FilmIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white font-display tracking-tight leading-none text-base">
                      PDL <span className="text-violet-400">Edits</span>
                    </h2>
                  </div>
                </Link>

                <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-2">
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                      <User className="w-4 h-4 text-zinc-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate font-display">{session.user.name.split(' ')[0]}</p>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{isAdmin ? 'Admin' : 'Cliente'}</p>
                  </div>
                </div>
              </div>

              {/* Center: Navigation */}
              <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group hover:bg-white/5 hover:text-white"
                    >
                      <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-violet-400" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom: Logout */}
              <div className="p-3">
                <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }); }}>
                  <button type="submit" className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair</span>
                  </button>
                </form>
              </div>
            </div>
          </aside>

          {/* Conteúdo Principal Compacto */}
          <main className="flex-1 flex flex-col min-w-0">
            <header className="h-14 shrink-0 flex items-center justify-between px-5 bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[1.25rem] mb-3">
              <div className="flex items-center gap-3">
                <button className="lg:hidden p-1.5 text-zinc-400"><Menu className="w-5 h-5" /></button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-zinc-500 w-64">
                   <Search className="w-3 h-3" />
                   <input type="text" placeholder="Buscar..." className="bg-transparent border-none text-[11px] focus:ring-0 w-full placeholder:text-zinc-600" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full" />
                </button>
                <div className="w-px h-4 bg-white/5 mx-1" />
                <Link href="/catalogo">
                   <button className="btn-gradient px-4 py-1.5 rounded-lg text-[10px] font-bold text-white font-display uppercase tracking-wider">Novo Pedido</button>
                </Link>
              </div>
            </header>

            <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-[1.5rem] overflow-hidden flex flex-col">
               <div className="flex-1 overflow-y-auto p-5 lg:p-7 custom-scrollbar">
                  {children}
               </div>
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
