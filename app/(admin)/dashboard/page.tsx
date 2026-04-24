'use client';

import { Users, FileText, Clock, CheckCircle2, RefreshCw, TrendingUp } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import PageLoader from '@/components/ui/PageLoader';
import ResolutionCard from '@/components/cards/ResolutionCard';
import RecentReportsTable from '@/components/tables/RecentReportsTable';
import { useDashboard } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const { stats, recentReports, loading, error, refresh } = useDashboard();

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-slate-400 text-sm">{error}</p>
        <button
          onClick={refresh}
          className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const resolutionRate = stats.total_reports > 0
    ? Math.round((stats.resolved / stats.total_reports) * 100)
    : 0;

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">{today}</p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats.total_users}
          icon={Users}
          color="blue"
          sub="Registered accounts"
        />
        <StatCard
          label="Total Reports"
          value={stats.total_reports}
          icon={FileText}
          color="emerald"
          sub={`${resolutionRate}% resolution rate`}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          color="red"
          sub="Awaiting action"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
          color="emerald"
          sub="Issues closed"
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Status breakdown */}
        <ResolutionCard stats={stats} />

        {/* Right column: two metric tiles */}
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* In Progress */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                In Progress
              </span>
              <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30">
                <RefreshCw className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              </span>
            </div>
            <div>
              <p className="text-[32px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                {stats.in_progress}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Being actioned</p>
            </div>
          </div>

          {/* Resolution rate hero */}
          <div className="bg-slate-900 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Resolution Rate
              </span>
              <span className="p-2 rounded-xl bg-white/10">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </span>
            </div>
            <div>
              <p className="text-[32px] font-bold text-white leading-none tracking-tight">
                {resolutionRate}%
              </p>
              <p className="text-xs text-slate-400 mt-2">Of all reports closed</p>
            </div>
            {/* Mini progress bar */}
            <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-auto">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${resolutionRate}%` }}
              />
            </div>
          </div>

          {/* Platform health — spans both columns */}
          <div className="sm:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700 p-5 flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">API connected</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All systems operational</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 px-2.5 py-1 rounded-full shrink-0">
              Healthy
            </span>
          </div>

        </div>
      </div>

      {/* Recent reports */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Recent Reports</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Latest {recentReports.length} submissions</p>
          </div>
        </div>
        <div className="px-6 py-2">
          <RecentReportsTable reports={recentReports} />
        </div>
      </div>

    </div>
  );
}