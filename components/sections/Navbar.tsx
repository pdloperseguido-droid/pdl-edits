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

const NAV_LINKS: { href: string; label: string; external?: boolean }[] = [
  { href: '/', label: 'Início' },
  { href: '/portfolio', label: 'Portfólio' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/catalogo', label: 'Serviços' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!session) return;
    const fetchCount = async () => {
      const count = await getUnreadCount();
      setUnreadCount(count);
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, [session]);

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <>
      <header
        className={cn(
          'fixed top-4 inset-x-0 z-50 transition-all duration-500 mx-auto px-4 sm:px-6 max-w-7xl'
        )}
      >
        <nav 
          className={cn(
            'flex items-center justify-between transition-all duration-500',
            isScrolled 
              ? 'bg-white/5 backdrop-blur-3xl py-2 px-6 rounded-2xl shadow-2xl shadow-black/50' 
              : 'bg-transparent py-4 px-0'
          )} 
          aria-label="Navegação principal"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="PDL Edits - Página inicial">
            <img 
              src="/logo.png" 
              alt="PDL Edits Logo" 
              className={cn(
                "w-auto transition-all duration-500 group-hover:scale-105",
                isScrolled ? "h-8" : "h-10"
              )}
            />
          </Link>

          {/* Links desktop */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'focus-ring',
                    pathname === link.href
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Área direita */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href={isAdmin ? '/dashboard' : '/minha-conta'}
                  className="relative p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus-ring"
                >
                  <MessageSquare className="w-5 h-5" />
                  <NotificationBadge count={unreadCount} />
                </Link>

                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus-ring"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}

                <Link
                  href="/minha-conta"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-violet-500/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full btn-gradient flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm text-zinc-300 max-w-[120px] truncate">
                    {session.user.name.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors focus-ring"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Entrar</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Começar agora</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-zinc-400 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Menu mobile */}
        {isMobileOpen && (
          <div className="md:hidden bg-zinc-900/90 backdrop-blur-3xl px-4 py-4 space-y-1 mt-2 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl">
            {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-red-400"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block">
                    <Button variant="secondary" size="sm" className="w-full">Entrar</Button>
                  </Link>
                  <Link href="/auth/register" className="block">
                    <Button size="sm" className="w-full">Começar agora</Button>
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
