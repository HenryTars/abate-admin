import type { DashboardStats } from '@/types';

interface Props {
  stats: DashboardStats;
}

export default function ResolutionCard({ stats }: Props) {
  const total = stats.total_reports;
  const rate  = total > 0 ? Math.round((stats.resolved / total) * 100) : 0;

  const segments = [
    { label: 'Resolved',    value: stats.resolved,    color: 'bg-emerald-500', pct: total > 0 ? (stats.resolved    / total) * 100 : 0 },
    { label: 'In Progress', value: stats.in_progress, color: 'bg-amber-400',   pct: total > 0 ? (stats.in_progress / total) * 100 : 0 },
    { label: 'Pending',     value: stats.pending,     color: 'bg-slate-200',   pct: total > 0 ? (stats.pending     / total) * 100 : 0 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Status Breakdown
          </p>
          <p className="text-[28px] font-bold text-slate-900 leading-tight mt-1 tracking-tight">
            {rate}%
          </p>
          <p className="text-xs text-slate-400 mt-0.5">resolution rate</p>
        </div>
        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
          {stats.resolved} closed
        </span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100 mb-6">
        {segments.map((s) => (
          <div
            key={s.label}
            className={`${s.color} transition-all duration-700`}
            style={{ width: `${s.pct}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-auto space-y-3">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-sm text-slate-600">{s.label}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs tabular-nums text-slate-400 w-8 text-right">
                {Math.round(s.pct)}%
              </span>
              <span className="text-sm font-semibold text-slate-800 tabular-nums w-8 text-right">
                {s.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}