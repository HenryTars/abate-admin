'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebar.store';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':   { title: 'Dashboard',     subtitle: 'Platform overview and key metrics' },
  '/users':       { title: 'Users',         subtitle: 'Manage registered users' },
  '/reports':     { title: 'Reports',       subtitle: 'Moderate environmental reports' },
  '/authorities': { title: 'Authorities',   subtitle: 'Manage authority accounts' },
  '/analytics':   { title: 'Analytics',     subtitle: 'Insights and trends' },
  '/logs':        { title: 'Activity Logs', subtitle: 'Audit trail of admin and authority actions' },
  '/settings':    { title: 'Settings',      subtitle: 'Manage your account and preferences' },
};

export default function Header() {
  const pathname = usePathname();
  const base = '/' + pathname.split('/')[1];
  const meta = pageTitles[base] ?? { title: 'Admin', subtitle: '' };
  const { setOpen } = useSidebarStore();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 sm:px-6 shrink-0 gap-3">
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 -ml-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div>
        <h1 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">{meta.title}</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">{meta.subtitle}</p>
      </div>
    </header>
  );
}
