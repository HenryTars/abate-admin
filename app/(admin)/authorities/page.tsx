'use client';

import { useState } from 'react';
import { Search, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuthorities } from '@/hooks/useAuthorities';
import AuthoritiesTable from '@/components/tables/AuthoritiesTable';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/ui/PageLoader';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import api from '@/lib/api';
import type { User, ApiResponse } from '@/types';

interface UsersPage {
  data: User[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function AuthoritiesPage() {
  const {
    authorities, total, currentPage, lastPage,
    loading, error,
    search,
    setSearch, setPage,
    refresh, updateAuthority, removeAuthority,
  } = useAuthorities();

  // Promote modal state
  const [modalOpen, setModalOpen]         = useState(false);
  const [promoteSearch, setPromoteSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching]         = useState(false);
  const [promoting, setPromoting]         = useState<number | null>(null);
  const [promoted, setPromoted]           = useState<number[]>([]);

  const searchUsers = async () => {
    if (!promoteSearch.trim()) return;
    setSearching(true);
    try {
      const params = new URLSearchParams({ search: promoteSearch, role: 'user' });
      const res = await api.get<ApiResponse<UsersPage>>(`/admin/users?${params}`);
      setSearchResults(res.data.data.data);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const promoteUser = async (user: User) => {
    setPromoting(user.id);
    try {
      await api.patch<ApiResponse<User>>(
        `/admin/users/${user.id}/role`,
        { role: 'authority' }
      );
      setPromoted((prev) => [...prev, user.id]);
      refresh();
    } catch {
      // silent
    } finally {
      setPromoting(null);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setPromoteSearch('');
    setSearchResults([]);
    setPromoted([]);
  };

  return (
    <div className="space-y-5">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Authorities</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {total.toLocaleString()} authority account{total !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Add authority button */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Authority</span>
          </button>
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
            <AuthoritiesTable
              authorities={authorities}
              onUpdate={updateAuthority}
              onRemove={removeAuthority}
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

      {/* Promote user modal */}
      <Modal
        open={modalOpen}
        title="Promote User to Authority"
        onClose={closeModal}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Search for a regular user by name or email, then grant them authority privileges.
          </p>

          {/* Search input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Name or email…"
                value={promoteSearch}
                onChange={(e) => setPromoteSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={searchUsers}
              disabled={searching || !promoteSearch.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700
                         rounded-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {searching && <Spinner className="text-white w-3.5 h-3.5" />}
              Search
            </button>
          </div>

          {/* Results list */}
          {searchResults.length > 0 && (
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {searchResults.map((u) => {
                const done = promoted.includes(u.id);
                return (
                  <div key={u.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-slate-600">
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-800 font-medium">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => promoteUser(u)}
                      disabled={done || promoting === u.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition
                        ${done
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50'
                        }`}
                    >
                      {promoting === u.id && <Spinner className="text-white w-3 h-3" />}
                      {done && <ShieldCheck className="w-3.5 h-3.5" />}
                      {done ? 'Promoted' : 'Promote'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {searchResults.length === 0 && promoteSearch && !searching && (
            <p className="text-sm text-slate-400 text-center py-4">
              No regular users found matching &ldquo;{promoteSearch}&rdquo;
            </p>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}