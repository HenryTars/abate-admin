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

interface UseUsersReturn {
  users: User[];
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  search: string;
  roleFilter: string;
  setSearch: (v: string) => void;
  setRoleFilter: (v: string) => void;
  setPage: (p: number) => void;
  refresh: () => void;
  updateUser: (updated: User) => void;
  removeUser: (id: number) => void;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers]           = useState<User[]>([]);
  const [total, setTotal]           = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage]     = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [search, setSearchState]    = useState('');
  const [roleFilter, setRoleState]  = useState('');

  const fetchUsers = useCallback(async (page = 1, q = search, role = roleFilter) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q)    params.set('search', q);
      if (role) params.set('role', role);

      const res = await api.get<ApiResponse<UsersPage>>(`/admin/users?${params}`);
      const d = res.data.data;
      setUsers(d.data);
      setTotal(d.total);
      setCurrentPage(d.current_page);
      setLastPage(d.last_page);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => { fetchUsers(1, search, roleFilter); }, [search, roleFilter]); // eslint-disable-line

  const setSearch = (v: string) => { setSearchState(v); setCurrentPage(1); };
  const setRoleFilter = (v: string) => { setRoleState(v); setCurrentPage(1); };
  const setPage = (p: number) => { setCurrentPage(p); fetchUsers(p); };
  const refresh = () => fetchUsers(currentPage);
  const updateUser = (updated: User) =>
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  const removeUser = (id: number) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  return {
    users, total, currentPage, lastPage,
    loading, error,
    search, roleFilter,
    setSearch, setRoleFilter, setPage,
    refresh, updateUser, removeUser,
  };
}