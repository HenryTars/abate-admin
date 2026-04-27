'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, ShieldCheck,
  BarChart3, ScrollText, Settings, LogOut, Leaf,
  ChevronLeft, X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/store/auth.store';
import { useSidebarStore } from '@/store/sidebar.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const navItems = [
  { label: 'Dashboard',   href: '/dashboard',   icon: LayoutDashboard },
  { label: 'Users',       href: '/users',       icon: Users },
  { label: 'Reports',     href: '/reports',     icon: FileText },
  { label: 'Authorities', href: '/authorities', icon: ShieldCheck },
  { label: 'Analytics',   href: '/analytics',   icon: BarChart3 },
  { label: 'Logs',        href: '/logs',        icon: ScrollText },
];

function NavItem({
  label, href, icon: Icon, isCollapsed, isActive,
}: {
  label: string; href: string; icon: React.ElementType;
  isCollapsed: boolean; isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center rounded-lg text-sm font-medium transition-colors group relative',
        isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
        isActive
          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white',
      )}
    >
      <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500')} />
      {!isCollapsed && <span>{label}</span>}
      {isCollapsed && (
        <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-slate-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
          {label}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isCollapsed, isOpen, toggleCollapsed, setOpen } = useSidebarStore();

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col z-30 transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:w-16' : 'lg:w-60',
          isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0',
        )}
      >
        {/* Brand */}
        <div className={clsx(
          'flex items-center h-16 border-b border-slate-200 dark:border-slate-700 shrink-0 transition-all duration-300',
          isCollapsed ? 'lg:justify-center lg:px-2 px-4' : 'gap-2.5 px-4',
        )}>
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div className={clsx('overflow-hidden transition-all duration-300', isCollapsed ? 'lg:hidden' : 'block')}>
            <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">Abate Admin</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none whitespace-nowrap">Management Console</p>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setOpen(false)}
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className={clsx(
          'flex-1 py-4 space-y-0.5 overflow-y-auto transition-all duration-300',
          isCollapsed ? 'lg:px-2 px-3' : 'px-3',
        )}>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isCollapsed={isCollapsed}
              isActive={isActive(item.href)}
            />
          ))}
        </nav>

        {/* Bottom section */}
        <div className={clsx(
          'py-3 border-t border-slate-200 dark:border-slate-700 space-y-1 transition-all duration-300',
          isCollapsed ? 'lg:px-2 px-3' : 'px-3',
        )}>
          {/* Settings */}
          <NavItem
            label="Settings"
            href="/settings"
            icon={Settings}
            isCollapsed={isCollapsed}
            isActive={isActive('/settings')}
          />

          {/* User info — hidden when collapsed */}
          <div className={clsx('px-3 py-2 transition-all duration-300', isCollapsed ? 'lg:hidden' : 'block')}>
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={clsx(
              'w-full flex items-center rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400',
              'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group relative',
              isCollapsed ? 'lg:justify-center lg:p-2.5 gap-3 px-3 py-2.5' : 'gap-3 px-3 py-2.5',
            )}
          >
            <LogOut className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500" />
            <span className={clsx('transition-all duration-300', isCollapsed ? 'lg:hidden' : 'block')}>Sign out</span>
            {isCollapsed && (
              <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-slate-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg hidden lg:block">
                Sign out
              </span>
            )}
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapsed}
            className={clsx(
              'hidden lg:flex w-full items-center rounded-lg text-xs text-slate-400',
              'hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors',
              isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
            )}
          >
            <ChevronLeft className={clsx('w-4 h-4 shrink-0 transition-transform duration-300', isCollapsed && 'rotate-180')} />
            {!isCollapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
