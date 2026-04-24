import StatusBadge from '@/components/ui/StatusBadge';
import { normalizeImageUrl } from '@/lib/utils';
import type { Report } from '@/types';

interface Props {
  reports: Report[];
}

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (days > 0)  return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0)  return `${mins}m ago`;
  return 'Just now';
}

export default function RecentReportsTable({ reports }: Props) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-sm">
        No reports yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {['Report', 'Submitted by', 'Location', 'Status', 'When'].map((h) => (
              <th
                key={h}
                className="text-left text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 pb-4 pr-6 last:pr-0 last:text-right"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => {
            const imgSrc = normalizeImageUrl(r.image_url);
            const isLast = i === reports.length - 1;
            return (
              <tr
                key={r.id}
                className={`group ${!isLast ? 'border-b border-slate-50 dark:border-slate-700/50' : ''}`}
              >
                {/* Report */}
                <td className="py-4 pr-6 max-w-[280px]">
                  <div className="flex items-center gap-3">
                    {imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgSrc}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          #{r.id}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-slate-700 dark:text-slate-200 truncate leading-snug">
                      {r.description}
                    </span>
                  </div>
                </td>

                {/* Submitted by */}
                <td className="py-4 pr-6 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">
                        {(r.user?.name ?? '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{r.user?.name ?? '—'}</span>
                  </div>
                </td>

                {/* Location */}
                <td className="py-4 pr-6 max-w-[160px]">
                  <span className="text-xs text-slate-400 dark:text-slate-500 truncate block">
                    {r.location_name ?? '—'}
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 pr-6">
                  <StatusBadge status={r.status} />
                </td>

                {/* When */}
                <td className="py-4 text-right">
                  <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                    {timeAgo(r.created_at)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
