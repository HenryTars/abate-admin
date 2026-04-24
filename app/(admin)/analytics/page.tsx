'use client';

import { RefreshCw, TrendingUp, MapPin, PieChart } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import BarChart from '@/components/charts/BarChart';
import HorizontalBar from '@/components/charts/HorizontalBar';
import DonutChart from '@/components/charts/DonutChart';
import PageLoader from '@/components/ui/PageLoader';

export default function AnalyticsPage() {
  const { data, loading, error, refresh } = useAnalytics();

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500 text-sm">{error}</p>
        <button
          onClick={refresh}
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const totalReports = data.reports_by_day.reduce((s, d) => s + d.total, 0);
  const totalPending = data.reports_by_day.reduce((s, d) => s + d.pending, 0);
  const totalInProgress = data.reports_by_day.reduce((s, d) => s + d.in_progress, 0);
  const totalResolved = data.reports_by_day.reduce((s, d) => s + d.resolved, 0);

  const donutSlices = [
    { label: 'Resolved',    value: totalResolved,   color: '#10b981' },
    { label: 'In Progress', value: totalInProgress,  color: '#f97316' },
    { label: 'Pending',     value: totalPending,     color: '#f87171' },
  ];

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">Last 30 days of platform activity</p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Reports over time chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-800">Reports Over Time</h3>
          <span className="ml-auto text-xs text-slate-400">{totalReports} total this period</span>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4">
          {[
            { label: 'Resolved',    color: '#10b981' },
            { label: 'In Progress', color: '#f97316' },
            { label: 'Pending',     color: '#f87171' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
              <span className="text-xs text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>

        <BarChart data={data.reports_by_day} />
      </div>

      {/* Bottom row: donut + top locations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Status breakdown donut */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-800">Status Breakdown</h3>
            <span className="ml-auto text-xs text-slate-400">This period</span>
          </div>
          <DonutChart slices={donutSlices} total={totalReports} />

          {/* Resolution rate */}
          {totalReports > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">Resolution rate</span>
                <span className="font-semibold text-slate-800">
                  {Math.round((totalResolved / totalReports) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${(totalResolved / totalReports) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Top locations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-800">Top Reported Locations</h3>
          </div>
          <HorizontalBar data={data.top_locations} />
        </div>

      </div>

    </div>
  );
}