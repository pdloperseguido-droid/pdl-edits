import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { CustomerSidebar } from '@/components/dashboard/CustomerSidebar';
import { CustomerTopbar } from '@/components/dashboard/CustomerTopbar';

/** Layout Compacto Premium Refatorado */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/auth/login');

  const isAdmin = session.user.role === 'ADMIN';

  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#020202] text-zinc-400 font-sans selection:bg-violet-500/30 selection:text-white antialiased overflow-x-hidden">
        
        {/* Cinematic Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px] opacity-60" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/5 rounded-full blur-[120px] opacity-40" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="flex relative z-10 p-4 lg:p-6 min-h-screen gap-6">
          
          {/* Responsive Sidebar */}
          <CustomerSidebar session={session} isAdmin={isAdmin} />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 max-w-[1600px] mx-auto w-full">
            <CustomerTopbar />

            <div className="flex-1 flex flex-col">
              <div className="flex-1 custom-scrollbar">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

