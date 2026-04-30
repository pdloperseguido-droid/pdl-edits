import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

import { CustomCursor } from '@/components/ui/CustomCursor';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space',
  weight: ['300', '400', '500', '600', '700'] 
});

export const metadata: Metadata = {
  title: {
    default: 'PDL Edits — Edição de Vídeo e Foto Profissional',
    template: '%s | PDL Edits',
  },
  description: 'Transforme seus momentos em obras de arte. Edição profissional de vídeo e foto com entrega rápida e qualidade premium.',
  keywords: ['edição de vídeo', 'thumbnails', 'editor profissional', 'PDL Edits'],
  openGraph: {
    type: 'website',
    siteName: 'PDL Edits',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans text-white antialiased`}>
        <CustomCursor />
        <AnimatedBackground />
        {children}
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}
