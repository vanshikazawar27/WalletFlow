import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  loadAuthState: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasSeenOnboarding: false,
  isLoading: true,

  loadAuthState: async () => {
    try {
      const [auth, onboarding] = await Promise.all([
        AsyncStorage.getItem('isAuthenticated'),
        AsyncStorage.getItem('hasSeenOnboarding'),
      ]);
      set({
        isAuthenticated: auth === 'true',
        hasSeenOnboarding: onboarding === 'true',
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  login: async () => {
    await AsyncStorage.setItem('isAuthenticated', 'true');
    set({ isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem('isAuthenticated');
    set({ isAuthenticated: false });
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    set({ hasSeenOnboarding: true });
  },
}));
