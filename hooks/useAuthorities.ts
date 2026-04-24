'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { User, ApiResponse } from '@/types';

interface UsersPage {
  data: User[];
  current_page: number;
  last_page: number;
  total: number;
}

interface UseAuthoritiesReturn {
  authorities: User[];
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (v: string) => void;
  setPage: (p: number) => void;
  refresh: () => void;
  updateAuthority: (updated: User) => void;
  removeAuthority: (id: number) => void;
}

export function useAuthorities(): UseAuthoritiesReturn {
  const [authorities, setAuthorities] = useState<User[]>([]);
  const [total, setTotal]             = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage]       = useState(1);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearchState]      = useState('');

  const fetchAuthorities = useCallback(async (page = 1, q = search) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), role: 'authority' });
      if (q) params.set('search', q);

      const res = await api.get<ApiResponse<UsersPage>>(`/admin/users?${params}`);
      const d = res.data.data;
      setAuthorities(d.data);
      setTotal(d.total);
      setCurrentPage(d.current_page);
      setLastPage(d.last_page);
    } catch {
      setError('Failed to load authorities');
    } finally {
      setLoading(false);
    }
  }, [search]); // eslint-disable-line

  useEffect(() => { fetchAuthorities(1, search); }, [search]); // eslint-disable-line

  const setSearch      = (v: string) => { setSearchState(v); setCurrentPage(1); };
  const setPage        = (p: number) => { setCurrentPage(p); fetchAuthorities(p); };
  const refresh        = ()          => fetchAuthorities(currentPage);
  const updateAuthority = (updated: User) =>
    setAuthorities((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  const removeAuthority = (id: number) =>
    setAuthorities((prev) => prev.filter((u) => u.id !== id));

  return {
    authorities, total, currentPage, lastPage,
    loading, error, search,
    setSearch, setPage, refresh,
    updateAuthority, removeAuthority,
  };
}