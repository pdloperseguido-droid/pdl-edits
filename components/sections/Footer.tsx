import Link from 'next/link';
import { Film, Mail, MapPin, Phone, ArrowUpRight, Camera, Video, MessageCircle } from 'lucide-react';
import { FadeInSection } from '@/components/ui/FadeInSection';

const FOOTER_LINKS = {
  servicos: [
    { label: 'Edição de Vídeo', href: '/catalogo' },
    { label: 'Thumbnails', href: '/catalogo' },
    { label: 'Color Grading', href: '/catalogo' },
    { label: 'Motion Graphics', href: '/catalogo' },
  ],
  empresa: [
    { label: 'Portfólio', href: '/portfolio' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Como Funciona', href: '/#como-funciona' },
    { label: 'Depoimentos', href: '/#depoimentos' },
  ],
  suporte: [
    { label: 'Minha Conta', href: '/minha-conta' },
    { label: 'Pedidos', href: '/minha-conta' },
    { label: 'Chat de Suporte', href: '/minha-conta' },
    { label: 'FAQ', href: '/#faq' },
  ],
};

const DiscordIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 11.747 11.747 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"/>
  </svg>
);

const SOCIALS = [
  { icon: Camera, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Video, href: 'https://youtube.com', label: 'YouTube' },
  { icon: DiscordIcon, href: 'https://discord.gg/Wg8f3e28yv', label: 'Discord' },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-transparent overflow-hidden" role="contentinfo">
      {/* Background Grid Sutil - similar ao da imagem */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />


      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Marca e Descrição */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group">
              <img 
                src="/logo.png" 
                alt="PDL Edits Logo" 
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              Edição profissional de vídeo e foto com entrega rápida, qualidade premium e comunicação direta com o editor.
            </p>

            {/* Contato Rápido */}
            <div className="mt-8 space-y-3">
              <a href="mailto:contato@pdledits.com" className="flex items-center gap-3 text-sm text-zinc-500 hover:text-violet-400 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                contato@pdledits.com
              </a>
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                Brasil
              </div>
            </div>

          </div>

          {/* Colunas de Links */}
          {Object.entries(FOOTER_LINKS).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">
                {key === 'servicos' ? 'Serviços' : key === 'empresa' ? 'Empresa' : 'Suporte'}
              </h3>
              <ul className="space-y-3" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-violet-400 transition-colors inline-block"
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

      {/* Brand & Quote Section - Estilo similar à imagem */}
      <div className="border-t border-white/5 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white tracking-[0.3em] mb-4 uppercase">
            PDL EDITS
          </h2>
          <p className="text-zinc-500 text-sm italic font-medium">
            "A paciência e o esforço nos levam a lugares que nunca imaginamos chegar."
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white/[0.02] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600">
            © {new Date().getFullYear()} PDL Edits. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacidade" className="text-[10px] uppercase font-black tracking-widest text-zinc-600 hover:text-violet-400 transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="text-[10px] uppercase font-black tracking-widest text-zinc-600 hover:text-violet-400 transition-colors">
              Termos
            </Link>
            <Link href="/contato" className="text-[10px] uppercase font-black tracking-widest text-zinc-600 hover:text-violet-400 transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
