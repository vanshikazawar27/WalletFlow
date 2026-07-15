import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  email: string;
  avatarUri: string | null;
}

export interface UserPreferences {
  biometricLogin: boolean;
  pushNotifications: boolean;
}

interface UserState {
  profile: UserProfile;
  preferences: UserPreferences;
  isLoaded: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  loadUser: () => Promise<void>;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatarUri: null,
};

const DEFAULT_PREFERENCES: UserPreferences = {
  biometricLogin: false,
  pushNotifications: true,
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  preferences: DEFAULT_PREFERENCES,
  isLoaded: false,

  loadUser: async () => {
    try {
      const [profileData, prefsData] = await Promise.all([
        AsyncStorage.getItem('user_profile'),
        AsyncStorage.getItem('user_preferences'),
      ]);
      set({
        profile: profileData ? JSON.parse(profileData) : DEFAULT_PROFILE,
        preferences: prefsData ? JSON.parse(prefsData) : DEFAULT_PREFERENCES,
        isLoaded: true,
      });
    } catch {
      set({ isLoaded: true });
    }
  },

  updateProfile: async (updates) => {
    const newProfile = { ...get().profile, ...updates };
    set({ profile: newProfile });
    await AsyncStorage.setItem('user_profile', JSON.stringify(newProfile));
  },

  updatePreferences: async (updates) => {
    const newPrefs = { ...get().preferences, ...updates };
    set({ preferences: newPrefs });
    await AsyncStorage.setItem('user_preferences', JSON.stringify(newPrefs));
  },
}));
