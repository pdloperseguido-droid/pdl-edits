'use client';
import Link from 'next/link';
import { Mail, MapPin, ArrowRight, Camera, Video, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { useState } from 'react';

const FOOTER_LINKS = {
  'Serviços': [
    { label: 'Edição de Vídeo', href: '/catalogo' },
    { label: 'Thumbnails', href: '/catalogo' },
    { label: 'Color Grading', href: '/catalogo' },
    { label: 'Motion Graphics', href: '/catalogo' },
  ],
  'Plataforma': [
    { label: 'Portfólio', href: '/portfolio' },
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Como Funciona', href: '/#como-funciona' },
  ],
  'Suporte': [
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
    toast.success('Inscrito com sucesso!');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-[#060606] border-t border-white/[0.05]" role="contentinfo">

      {/* CTA pré-footer */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="uppercase text-2xl md:text-3xl font-black font-display tracking-tight text-white mb-3">
              Pronto para ter vídeos que{' '}
              <span className="text-gradient">realmente vendem?</span>
            </h2>
            <p className="text-[13px] font-light text-zinc-500 leading-relaxed">
              Junte-se a centenas de criadores que já transformaram seu conteúdo com edição profissional.
              Entrega em 72h, revisões incluídas.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link href="/catalogo">
              <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Contratar edição
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary" size="md">
                Criar conta grátis
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Linha divisória de seção */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="h-px bg-white/[0.05]" />
      </div>

      {/* Grid de links */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/">
              <img src="/logo.png" alt="PDL Edits" className="h-8 w-auto" />
            </Link>
            <p className="text-[12px] font-light text-zinc-500 leading-relaxed max-w-xs">
              Edição profissional de vídeo para criadores, marcas e empreendedores. Qualidade real, entrega rápida.
            </p>
            <div className="flex gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-5">{key}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={(link as any).external ? '_blank' : undefined}
                      rel={(link as any).external ? 'noopener noreferrer' : undefined}
                      className="text-[13px] text-zinc-500 hover:text-zinc-200 transition-colors"
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

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-8">
        <div className="h-px bg-white/[0.04] mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-700">
            © {new Date().getFullYear()} PDL Edits. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:contato@pdledits.com" className="flex items-center gap-1.5 text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors">
              <Mail className="w-3 h-3" />
              contato@pdledits.com
            </a>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-700">
              <MapPin className="w-3 h-3" />
              São Paulo, Brasil
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
