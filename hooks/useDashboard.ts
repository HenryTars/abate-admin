'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { DashboardStats, Report, ApiResponse } from '@/types';

interface ReportsApiData {
  data: Report[];
  current_page: number;
  last_page: number;
}

interface DashboardData {
  stats: DashboardStats | null;
  recentReports: Report[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): DashboardData {
  const [stats, setStats]                 = useState<DashboardStats | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, reportsRes] = await Promise.all([
        api.get<ApiResponse<DashboardStats>>('/admin/stats'),
        api.get<ApiResponse<ReportsApiData>>('/admin/reports'),
      ]);

      setStats(statsRes.data.data);
      // Laravel paginate() wraps results in { data: [...], current_page, ... }
      setRecentReports(
        (reportsRes.data.data.data ?? []).filter((r) => !r.deleted_at).slice(0, 8)
      );
    } catch {
      setError('Failed to load dashboard data. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { stats, recentReports, loading, error, refresh: fetchData };
}