import { SessionProvider } from 'next-auth/react';

/** Layout das rotas de autenticação — sem navbar/footer */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#0A0A0A] grain">
        {/* Gradiente de fundo */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-700/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-700/10 rounded-full blur-[100px]" />
        </div>
        {children}
      </div>
    </SessionProvider>
  );
}
