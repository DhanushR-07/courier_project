import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { authApi } from '@/services/mockApi';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email, password, role) => {
        const result = await authApi.login(email, password, role);
        set({ user: result.user, token: result.token, isAuthenticated: true });
        localStorage.setItem('auth-token', result.token);
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-token');
      },
      setUser: (user) => set({ user }),
    }),
    { name: 'auth-storage' }
  )
);
