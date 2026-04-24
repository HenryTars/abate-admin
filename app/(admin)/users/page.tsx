'use client';

import { Search } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import UsersTable from '@/components/tables/UsersTable';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/ui/PageLoader';

const roleOptions = [
  { label: 'All roles', value: '' },
  { label: 'Users',     value: 'user' },
  { label: 'Authority', value: 'authority' },
];

export default function UsersPage() {
  const {
    users, total, currentPage, lastPage,
    loading, error,
    search, roleFilter,
    setSearch, setRoleFilter, setPage,
    refresh, updateUser, removeUser,
  } = useUsers();

  return (
    <div className="space-y-5">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">All Users</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {total.toLocaleString()} registered accounts
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {roleOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
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
            <UsersTable
              users={users}
              onUpdate={updateUser}
              onDelete={removeUser}
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