import { User } from '@/types';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: User): void {
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function updateSavedUser(user: User): void {
  localStorage.setItem('admin_user', JSON.stringify(user));
}

export function isAuthenticated(): boolean {
  return !!getToken();
}