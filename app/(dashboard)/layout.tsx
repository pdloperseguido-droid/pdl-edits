import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/auth/login');

  return (
    <SessionProvider session={session}>
      <div className="grain min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20">
          {children}
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}

