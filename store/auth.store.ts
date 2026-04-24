import { create } from 'zustand';
import { User } from '@/types';
import { saveSession, clearSession, getToken, getUser, updateSavedUser } from '@/lib/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token, user) => {
    saveSession(token, user);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    clearSession();
    set({ token: null, user: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = getToken();
    const user = getUser();
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    }
  },

  updateUser: (user) => {
    updateSavedUser(user);
    set({ user });
  },
}));
