'use client';

import { RefreshCw } from 'lucide-react';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/ui/PageLoader';
import ActivityFeed from '@/components/ui/ActivityFeed';

const ACTION_OPTIONS = [
  { label: 'All actions',    value: '' },
  { label: 'Promoted',       value: 'user_promoted' },
  { label: 'Demoted',        value: 'user_demoted' },
  { label: 'Suspended',      value: 'user_suspended' },
  { label: 'Activated',      value: 'user_activated' },
  { label: 'User deleted',   value: 'user_deleted' },
  { label: 'Report deleted', value: 'report_deleted' },
  { label: 'Status updated', value: 'status_updated' },
];

export default function LogsPage() {
  const {
    logs, total, currentPage, lastPage,
    loading, error,
    actionFilter,
    setActionFilter, setPage, refresh,
  } = useActivityLogs();

  return (
    <div className="space-y-5">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Activity Logs</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {total.toLocaleString()} recorded action{total !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {ACTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            onClick={refresh}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {ACTION_OPTIONS.filter((o) => o.value).map((o) => (
          <button
            key={o.value}
            onClick={() => setActionFilter(actionFilter === o.value ? '' : o.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition
              ${actionFilter === o.value
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Log card */}
      <div className="bg-white rounded-xl border border-slate-200">
        {loading ? (
          <PageLoader />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm mb-3">{error}</p>
            <button
              onClick={refresh}
              className="text-sm text-emerald-600 font-medium hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <ActivityFeed logs={logs} />
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              total={total}
              onPage={setPage}
            />
          </div>
        )}
      </div>

    </div>
  );
}