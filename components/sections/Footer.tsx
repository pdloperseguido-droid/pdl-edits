'use client';
import Link from 'next/link';
import { Mail, MapPin, ArrowRight, Camera, Video, Send, Shield, Zap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
 
interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  servicos: [
    { label: 'Edição de Vídeo', href: '/catalogo' },
    { label: 'Thumbnails', href: '/catalogo' },
    { label: 'Color Grading', href: '/catalogo' },
    { label: 'Motion Graphics', href: '/catalogo' },
  ],
  plataforma: [
    { label: 'Portfólio', href: '/portfolio' },
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Como Funciona', href: '/#como-funciona' },
    { label: 'Depoimentos', href: '/#depoimentos' },
  ],
  recursos: [
    { label: 'Minha Conta', href: '/minha-conta' },
    { label: 'Central de Ajuda', href: '/#faq' },
    { label: 'Comunidade Discord', href: 'https://discord.gg/Wg8f3e28yv', external: true },
    { label: 'Trabalhe Conosco', href: '/contato' },
  ],
};

const SOCIALS = [
  { icon: Camera, href: 'https://instagram.com/pdledits', label: 'Instagram' },
  { icon: Video, href: 'https://youtube.com/@pdledits', label: 'YouTube' },
  { icon: MessageSquare, href: 'https://discord.gg/Wg8f3e28yv', label: 'Discord' },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-transparent overflow-hidden" role="contentinfo">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full -z-10" />

      {/* Seção CTA Pré-Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="glass-strong border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <Zap className="w-40 h-40 text-white" />
          </div>
          
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Pronto para elevar o nível do seu <span className="text-gradient">conteúdo?</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Junte-se a centenas de criadores que já transformaram seus vídeos com a PDL Edits.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <Link href="/catalogo">
              <Button size="lg" className="w-full sm:w-auto px-8" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ver Serviços
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Socials */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block group">
              <img 
                src="/logo.png" 
                alt="PDL Edits Logo" 
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Sua parceira premium em edição de vídeo e foto. Transformamos ideias brutas em experiências visuais memoráveis com entrega rápida e qualidade de elite.
            </p>
            
            <div className="flex items-center gap-3">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-violet-500/20 transition-all border border-white/5"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(FOOTER_LINKS).map(([key, links]) => (
              <div key={key}>
                <h3 className="text-sm font-bold text-white mb-6 capitalize tracking-wide">
                  {key}
                </h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={(link as FooterLink).external ? "_blank" : undefined}
                        className="text-sm text-zinc-500 hover:text-violet-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter / Contact */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold text-white tracking-wide">Fique por dentro</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Receba novidades, dicas de edição e ofertas exclusivas direto no seu e-mail.
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Seu melhor e-mail"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all group-hover:border-white/20"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-violet-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            
            <div className="pt-4 space-y-3">
              <a href="mailto:contato@pdledits.com" className="flex items-center gap-3 text-xs text-zinc-500 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-violet-400" />
                contato@pdledits.com
              </a>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <MapPin className="w-4 h-4 text-violet-400" />
                São Paulo, Brasil
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <p className="text-[10px] text-zinc-600 font-medium tracking-wider">
              © {new Date().getFullYear()} PDL EDITS. TODOS OS DIREITOS RESERVADOS.
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            {[
              { label: 'Privacidade', href: '/privacidade' },
              { label: 'Termos', href: '/termos' },
              { label: 'Cookies', href: '/privacidade' },
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 hover:text-violet-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-zinc-700 font-bold uppercase tracking-tighter">
            <Shield className="w-3 h-3" />
            Pagamentos Seguros
          </div>
        </div>
      </div>
    </footer>
  );
}
