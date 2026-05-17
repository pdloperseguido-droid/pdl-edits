import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { CustomerSidebar } from '@/components/dashboard/CustomerSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/auth/login');

  const isAdmin = session.user.role === 'ADMIN';

  return (
    <SessionProvider session={session}>
      <div className="grain min-h-screen flex bg-[#070707] text-white">
        {/* Sidebar */}
        <div className="p-4 hidden lg:flex shrink-0">
          <CustomerSidebar session={session} isAdmin={isAdmin} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <CustomerSidebar session={session} isAdmin={isAdmin} />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 lg:pl-2 pt-20 lg:pt-6">
          <main className="flex-1 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

