'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { ApiResponse } from '@/types';

export interface ActivityLogEntry {
  id: number;
  action: string;
  target_type: 'user' | 'report';
  target_id: number;
  description: string;
  meta: Record<string, string> | null;
  created_at: string;
  user: { id: number; name: string; role: string } | null;
}

interface LogsPage {
  data: ActivityLogEntry[];
  current_page: number;
  last_page: number;
  total: number;
}

interface UseActivityLogsReturn {
  logs: ActivityLogEntry[];
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  actionFilter: string;
  setActionFilter: (v: string) => void;
  setPage: (p: number) => void;
  refresh: () => void;
}

export function useActivityLogs(): UseActivityLogsReturn {
  const [logs, setLogs]               = useState<ActivityLogEntry[]>([]);
  const [total, setTotal]             = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage]       = useState(1);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [actionFilter, setActionState] = useState('');

  const fetchLogs = useCallback(async (page = 1, action = actionFilter) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (action) params.set('action', action);

      const res = await api.get<ApiResponse<LogsPage>>(`/admin/activity-logs?${params}`);
      const d = res.data.data;
      setLogs(d.data);
      setTotal(d.total);
      setCurrentPage(d.current_page);
      setLastPage(d.last_page);
    } catch {
      setError('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  }, [actionFilter]); // eslint-disable-line

  useEffect(() => { fetchLogs(1, actionFilter); }, [actionFilter]); // eslint-disable-line

  const setActionFilter = (v: string) => { setActionState(v); setCurrentPage(1); };
  const setPage         = (p: number) => { setCurrentPage(p); fetchLogs(p); };
  const refresh         = ()          => fetchLogs(currentPage);

  return {
    logs, total, currentPage, lastPage,
    loading, error, actionFilter,
    setActionFilter, setPage, refresh,
  };
}