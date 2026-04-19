import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/shared/types';
import { authService } from '@/shared/services';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email: string, password: string, role: UserRole) => {
        set({ loading: true, error: null });
        try {
          const user = await authService.login(email, password, role);
          set({ user, isAuthenticated: true, loading: false });
        } catch {
          set({ error: 'Error al iniciar sesión', loading: false });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) {
          set({ error: 'No hay usuario autenticado' });
          return;
        }

        set({ loading: true, error: null });
        try {
          const updatedUser = await authService.updateProfile(user.id, data);
          set({ user: updatedUser, loading: false });
        } catch {
          set({ error: 'Error al actualizar perfil', loading: false });
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authService.logout();
          set({ user: null, isAuthenticated: false, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      checkAuth: async () => {
        const { user } = get();
        if (user) {
          set({ isAuthenticated: true });
        }
      },

      switchRole: (role: UserRole) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, role } });
        }
      },
    }),
    {
      name: 'ethoshub_auth',
    }
  )
);
