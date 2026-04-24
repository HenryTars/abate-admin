'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Report, ApiResponse } from '@/types';

interface ReportsPage {
  data: Report[];
  current_page: number;
  last_page: number;
  total: number;
}

interface UseReportsReturn {
  reports: Report[];
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  search: string;
  statusFilter: string;
  setSearch: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setPage: (p: number) => void;
  refresh: () => void;
  updateReport: (r: Report) => void;
  removeReport: (id: number) => void;
}

export function useReports(): UseReportsReturn {
  const [reports, setReports]         = useState<Report[]>([]);
  const [total, setTotal]             = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage]       = useState(1);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearchState]      = useState('');
  const [statusFilter, setStatusState] = useState('');

  const fetchReports = useCallback(async (
    page = 1,
    q = search,
    status = statusFilter,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q)      params.set('search', q);
      if (status) params.set('status', status);

      const res = await api.get<ApiResponse<ReportsPage>>(
        `/admin/reports?${params}`
      );
      const d = res.data.data;
      setReports(d.data);
      setTotal(d.total);
      setCurrentPage(d.current_page);
      setLastPage(d.last_page);
    } catch {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]); // eslint-disable-line

  useEffect(() => { fetchReports(1, search, statusFilter); }, [search, statusFilter]); // eslint-disable-line

  const setSearch       = (v: string) => { setSearchState(v);  setCurrentPage(1); };
  const setStatusFilter = (v: string) => { setStatusState(v);  setCurrentPage(1); };
  const setPage         = (p: number) => { setCurrentPage(p);  fetchReports(p); };
  const refresh         = ()           => fetchReports(currentPage);
  const updateReport    = (r: Report)  =>
    setReports((prev) => prev.map((x) => (x.id === r.id ? r : x)));
  const removeReport    = (id: number) =>
    setReports((prev) => prev.filter((x) => x.id !== id));

  return {
    reports, total, currentPage, lastPage,
    loading, error,
    search, statusFilter,
    setSearch, setStatusFilter, setPage,
    refresh, updateReport, removeReport,
  };
}