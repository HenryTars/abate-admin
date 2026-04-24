'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Leaf,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard',   href: '/dashboard',   icon: LayoutDashboard },
  { label: 'Users',       href: '/users',       icon: Users },
  { label: 'Reports',     href: '/reports',     icon: FileText },
  { label: 'Authorities', href: '/authorities', icon: ShieldCheck },
  { label: 'Analytics',   href: '/analytics',   icon: BarChart3 },
  { label: 'Logs',        href: '/logs',        icon: ScrollText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col z-30">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Abate Admin</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">Management Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Icon
                className={clsx(
                  'w-4 h-4 shrink-0',
                  active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Settings + User + Logout */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700 space-y-1">
        {/* Settings link */}
        <Link
          href="/settings"
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive('/settings')
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          <Settings
            className={clsx(
              'w-4 h-4 shrink-0',
              isActive('/settings') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
            )}
          />
          Settings
        </Link>

        {/* User info */}
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name ?? 'Admin'}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
