'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageSquare, LayoutDashboard, LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { NotificationBadge } from '@/components/ui/Badge';
import { getUnreadCount } from '@/server/actions/messages';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/portfolio', label: 'Portfólio' },
  { href: '/catalogo', label: 'Serviços' },
  { href: '/sobre', label: 'Sobre' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!session) return;
    const fetch = async () => setUnreadCount(await getUnreadCount());
    fetch();
    const t = setInterval(fetch, 30_000);
    return () => clearInterval(t);
  }, [session]);

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Barra principal */}
        <div
          className={cn(
            'transition-all duration-300',
            scrolled
              ? 'bg-[#08080899] backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.06)]'
              : 'bg-transparent'
          )}
        >
          <nav
            className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between"
            aria-label="Navegação principal"
          >
            {/* Logo */}
            <Link href="/" aria-label="PDL Edits — Página inicial" className="flex-shrink-0">
              <img src="/logo.png" alt="PDL Edits" className="h-8 w-auto" />
            </Link>

            {/* Links desktop */}
            <ul className="hidden md:flex items-center gap-1" role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'relative px-4 py-2 rounded-lg font-sans text-sm font-medium tracking-[-0.01em] transition-colors duration-150 focus-ring',
                      pathname === href
                        ? 'text-white'
                        : 'text-zinc-400 hover:text-zinc-100'
                    )}
                  >
                    {label}
                    {pathname === href && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-violet-500 rounded-full" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Direita */}
            <div className="hidden md:flex items-center gap-2">
              {session ? (
                <>
                  <Link
                    href={isAdmin ? '/dashboard' : '/minha-conta'}
                    className="relative p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors focus-ring"
                  >
                    <MessageSquare className="w-[18px] h-[18px]" />
                    <NotificationBadge count={unreadCount} />
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors focus-ring"
                    >
                      <LayoutDashboard className="w-[18px] h-[18px]" />
                    </Link>
                  )}

                  <Link href="/minha-conta" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-[26px] h-[26px] rounded-full object-cover ring-1 ring-violet-500/40" />
                    ) : (
                      <div className="w-[26px] h-[26px] rounded-full btn-gradient flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="font-sans text-[13px] font-medium tracking-[-0.01em] text-zinc-300 max-w-[90px] truncate">{session.user.name.split(' ')[0]}</span>
                  </Link>

                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/8 transition-colors focus-ring"
                    aria-label="Sair"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">Entrar</Button>
                  </Link>
                  <Link href="/catalogo">
                    <Button size="sm">Ver Serviços</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="md:hidden bg-[#080808]/97 backdrop-blur-2xl px-5 py-4 space-y-0.5 animate-fade-in">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'block px-4 py-3 rounded-xl font-sans text-[14px] font-medium tracking-[-0.01em] transition-colors',
                  pathname === href
                    ? 'text-white bg-white/[0.06]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                )}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {session ? (
                <>
                  <Link href={isAdmin ? '/dashboard' : '/minha-conta'}>
                    <Button variant="secondary" size="sm" className="w-full">
                      {isAdmin ? 'Dashboard' : 'Minha Conta'}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full text-red-400" onClick={() => signOut({ callbackUrl: '/' })}>
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block">
                    <Button variant="secondary" size="sm" className="w-full">Entrar</Button>
                  </Link>
                  <Link href="/catalogo" className="block">
                    <Button size="sm" className="w-full">Ver Serviços</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
