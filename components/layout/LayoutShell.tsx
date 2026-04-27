'use client';

import { clsx } from 'clsx';
import { useSidebarStore } from '@/store/sidebar.store';
import Sidebar from './Sidebar';
import Header from './Header';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div
        className={clsx(
          'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:ml-16' : 'lg:ml-60',
        )}
      >
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
