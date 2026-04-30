import { SessionProvider } from 'next-auth/react';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';

/** Layout das rotas públicas com Navbar e Footer */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="grain">
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
