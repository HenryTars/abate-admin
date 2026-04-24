'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { ApiResponse } from '@/types';

export interface DayData {
  date: string;
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
}

export interface LocationData {
  location: string;
  count: number;
}

export interface AnalyticsData {
  reports_by_day: DayData[];
  top_locations: LocationData[];
}

interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [data, setData]       = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse<AnalyticsData>>('/admin/analytics');
      setData(res.data.data);
    } catch {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []); // eslint-disable-line

  return { data, loading, error, refresh: fetch };
}