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
  { href: '/catalogo', label: 'Serviços' },
  { href: '/sobre', label: 'Sobre' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
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
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-[#080808]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/30'
            : 'bg-transparent'
        )}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
          aria-label="Navegação principal"
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="PDL Edits - Página inicial">
            <img
              src="/logo.png"
              alt="PDL Edits Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Links desktop */}
          <ul className="hidden md:flex items-center gap-0.5" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm transition-all duration-150 focus-ring',
                    pathname === link.href
                      ? 'text-white font-medium'
                      : 'text-zinc-500 hover:text-zinc-200 font-normal'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Área direita */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                <Link
                  href={isAdmin ? '/dashboard' : '/minha-conta'}
                  className="relative p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors focus-ring"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <NotificationBadge count={unreadCount} />
                </Link>

                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors focus-ring"
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                  </Link>
                )}

                <Link
                  href="/minha-conta"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-violet-500/40"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full btn-gradient flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <span className="text-sm text-zinc-400 max-w-[100px] truncate">
                    {session.user.name.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/8 transition-colors focus-ring"
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

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#080808]/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-fade-in">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'block px-4 py-2.5 rounded-lg text-sm transition-all',
                  pathname === link.href
                    ? 'text-white bg-white/5 font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-white/[0.06] mt-2">
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
