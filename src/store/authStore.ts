import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  biometricEnabled: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  loadAuthState: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasSeenOnboarding: false,
  biometricEnabled: false,
  isLoading: true,

  loadAuthState: async () => {
    try {
      const [auth, onboarding, biometric] = await Promise.all([
        AsyncStorage.getItem('isAuthenticated'),
        AsyncStorage.getItem('hasSeenOnboarding'),
        AsyncStorage.getItem('biometricEnabled'),
      ]);
      set({
        isAuthenticated: auth === 'true',
        hasSeenOnboarding: onboarding === 'true',
        biometricEnabled: biometric === 'true',
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

  setBiometricEnabled: async (enabled: boolean) => {
    await AsyncStorage.setItem('biometricEnabled', enabled ? 'true' : 'false');
    set({ biometricEnabled: enabled });
  },
}));
