'use client';
import Link from 'next/link';
import { Mail, MapPin, ArrowRight, Camera, Video, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { useState } from 'react';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Serviços: [
    { label: 'Edição de Vídeo', href: '/catalogo' },
    { label: 'Thumbnails', href: '/catalogo' },
    { label: 'Color Grading', href: '/catalogo' },
    { label: 'Motion Graphics', href: '/catalogo' },
  ],
  Plataforma: [
    { label: 'Portfólio', href: '/portfolio' },
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Como Funciona', href: '/#como-funciona' },
  ],
  Suporte: [
    { label: 'Minha Conta', href: '/minha-conta' },
    { label: 'Discord', href: 'https://discord.gg/Wg8f3e28yv', external: true },
    { label: 'Privacidade', href: '/privacidade' },
    { label: 'Termos', href: '/termos' },
  ],
};

const SOCIALS = [
  { icon: Camera, href: 'https://instagram.com/pdledits', label: 'Instagram' },
  { icon: Video, href: 'https://youtube.com/@pdledits', label: 'YouTube' },
  { icon: MessageSquare, href: 'https://discord.gg/Wg8f3e28yv', label: 'Discord' },
];

export function Footer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 900));
    toast.success('Inscrito com sucesso!', { description: 'Você receberá nossas novidades em breve.' });
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <footer className="border-t border-white/[0.06] bg-[#080808]" role="contentinfo">
      {/* CTA pré-footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-2">
              Pronto para elevar o nível do seu{' '}
              <span className="text-gradient">conteúdo?</span>
            </h2>
            <p className="text-sm text-zinc-500">
              Junte-se a centenas de criadores que já transformaram seus vídeos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link href="/catalogo">
              <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Ver Serviços
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary" size="md">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="divider mx-4 sm:mx-6" />

      {/* Grid principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <img src="/logo.png" alt="PDL Edits Logo" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Sua parceira em edição de vídeo e foto. Qualidade premium com entrega rápida.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all border border-white/[0.05]"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-5">
                {key}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={(link as FooterLink).external ? '_blank' : undefined}
                      rel={(link as FooterLink).external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="divider mx-4 sm:mx-6" />

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} PDL Edits. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-2">
          <a href="mailto:contato@pdledits.com" className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            <Mail className="w-3.5 h-3.5" />
            contato@pdledits.com
          </a>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <MapPin className="w-3.5 h-3.5" />
            São Paulo, Brasil
          </div>
        </div>
      </div>
    </footer>
  );
}
