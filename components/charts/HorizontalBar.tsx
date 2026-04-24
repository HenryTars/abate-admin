'use client';

import type { LocationData } from '@/hooks/useAnalytics';

interface Props {
  data: LocationData[];
}

export default function HorizontalBar({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
        No location data available
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-36 truncate shrink-0" title={d.location}>
            {d.location}
          </span>
          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-700 w-6 text-right shrink-0">
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}