import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'red' | 'orange';
  sub?: string;
}

const colorMap = {
  emerald: { icon: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-50 dark:bg-emerald-900/30'  },
  blue:    { icon: 'text-blue-600 dark:text-blue-400',       iconBg: 'bg-blue-50 dark:bg-blue-900/30'        },
  red:     { icon: 'text-red-500 dark:text-red-400',         iconBg: 'bg-red-50 dark:bg-red-900/30'          },
  orange:  { icon: 'text-orange-500 dark:text-orange-400',   iconBg: 'bg-orange-50 dark:bg-orange-900/30'    },
};

export default function StatCard({ label, value, icon: Icon, color, sub }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <span className={clsx('p-2 rounded-xl', c.iconBg)}>
          <Icon className={clsx('w-4 h-4', c.icon)} />
        </span>
      </div>
      <div>
        <p className="text-[32px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{sub}</p>}
      </div>
    </div>
  );
}