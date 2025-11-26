import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types';
import { setAuthToken, removeAuthToken } from '../api/client';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        setAuthToken(token);
        set({
          user,
          token,
          isAuthenticated: true,
        });

        // Amplitude 사용자 식별 (user_id는 최소 5자 이상 필요)
        if (window.amplitude) {
          window.amplitude.setUserId('user_' + String(user.id));
        }
      },

      logout: () => {
        removeAuthToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Amplitude 사용자 초기화
        if (window.amplitude) {
          window.amplitude.reset();
        }

        // teamStore 초기화 (동적 import로 순환 참조 방지)
        import('./teamStore').then(({ useTeamStore }) => {
          useTeamStore.getState().reset();
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);