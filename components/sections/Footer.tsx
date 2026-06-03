'use client';
import Link from 'next/link';
import { Mail, MapPin, ArrowRight } from 'lucide-react';
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

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor"><path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.276c8.472-11.666,16.28-23.737,23.5-36.191a1.884,1.884,0,0,0-1.03-2.661,313.4,313.4,0,0,1-44.5-21.266,1.92,1.92,0,0,1-.183-3.193c3.151-2.316,6.236-4.717,9.248-7.165a1.86,1.86,0,0,1,1.942-.319c96.223,43.957,200.751,43.957,295.5,0a1.84,1.84,0,0,1,1.942.319c3.011,2.448,6.074,4.849,9.225,7.165a1.92,1.92,0,0,1-.183,3.193,313.567,313.567,0,0,1-44.544,21.266,1.88,1.88,0,0,0-1.009,2.661c7.243,12.454,15.051,24.525,23.523,36.191a1.88,1.88,0,0,0,2.063.276A487.169,487.169,0,0,0,611.534,405.729a1.984,1.984,0,0,0,.765-1.375C623.774,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/></svg>
);

const SOCIALS = [
  { icon: TiktokIcon, href: 'https://tiktok.com/@pdledits', label: 'TikTok' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/pdl.edits/', label: 'Instagram' },
  { icon: DiscordIcon, href: 'https://discord.gg/Wg8f3e28yv', label: 'Discord' },
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
            <h2 className="font-heading uppercase text-2xl md:text-3xl font-bold tracking-[-0.035em] text-white mb-3">
              PRONTO PARA
              <br />
              ELEVAR SEU CONTEÚDO
              <br />
              <span className="text-gradient">
                COM EDIÇÕES
                <br />
                DE OUTRO NÍVEL?
              </span>
            </h2>
            <p className="font-sans text-[13px] font-normal leading-relaxed text-zinc-400">
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
            <p className="font-sans text-[12px] font-normal text-zinc-400 leading-relaxed max-w-xs">
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
              <h3 className="font-sans text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.06em] mb-5">{key}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={(link as any).external ? '_blank' : undefined}
                      rel={(link as any).external ? 'noopener noreferrer' : undefined}
                      className="font-sans text-[13px] font-medium tracking-[-0.01em] text-zinc-500 hover:text-zinc-200 transition-colors"
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
          <p className="font-sans text-[11px] font-medium tracking-[0.02em] text-zinc-500">
            © {new Date().getFullYear()} PDL Edits. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:contato@pdledits.com" className="flex items-center gap-1.5 font-sans text-[11px] font-medium tracking-[0.02em] text-zinc-500 hover:text-zinc-400 transition-colors">
              <Mail className="w-3 h-3" />
              contato@pdledits.com
            </a>
            <div className="flex items-center gap-1.5 font-sans text-[11px] font-medium tracking-[0.02em] text-zinc-500">
              <MapPin className="w-3 h-3" />
              São Paulo, Brasil
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
