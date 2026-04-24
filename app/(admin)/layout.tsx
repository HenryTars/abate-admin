import AuthGuard from '@/components/layout/AuthGuard';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-60 min-h-screen">
          <Header />
          <main className="flex-1 p-8 bg-slate-50 dark:bg-slate-950">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
