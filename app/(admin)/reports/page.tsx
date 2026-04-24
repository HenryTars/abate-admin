'use client';

import { Search } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import ReportsTable from '@/components/tables/ReportsTable';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/ui/PageLoader';

const STATUS_OPTIONS = [
  { label: 'All statuses',  value: '' },
  { label: 'Pending',       value: 'pending' },
  { label: 'In Progress',   value: 'in_progress' },
  { label: 'Resolved',      value: 'resolved' },
];

export default function ReportsPage() {
  const {
    reports, total, currentPage, lastPage,
    loading, error,
    search, statusFilter,
    setSearch, setStatusFilter, setPage,
    refresh, updateReport, removeReport,
  } = useReports();

  return (
    <div className="space-y-5">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">All Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {total.toLocaleString()} total submissions
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search description or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats pills */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
          <button
            key={o.value}
            onClick={() => setStatusFilter(statusFilter === o.value ? '' : o.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition
              ${statusFilter === o.value
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Table card */}
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
            <ReportsTable
              reports={reports}
              onUpdate={updateReport}
              onDelete={removeReport}
            />
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