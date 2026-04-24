import { clsx } from 'clsx';

const config = {
  pending:     { label: 'Pending',     classes: 'bg-red-50 text-red-700 border-red-200'         },
  in_progress: { label: 'In Progress', classes: 'bg-orange-50 text-orange-700 border-orange-200' },
  resolved:    { label: 'Resolved',    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  user:        { label: 'User',        classes: 'bg-slate-100 text-slate-600 border-slate-200'   },
  authority:   { label: 'Authority',   classes: 'bg-blue-50 text-blue-700 border-blue-200'       },
  admin:       { label: 'Admin',       classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  active:      { label: 'Active',      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  suspended:   { label: 'Suspended',   classes: 'bg-red-50 text-red-700 border-red-200'             },
};

type BadgeKey = keyof typeof config;

export default function StatusBadge({ status }: { status: string }) {
  const cfg = config[status as BadgeKey] ?? { label: status, classes: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', cfg.classes)}>
      {cfg.label}
    </span>
  );
}