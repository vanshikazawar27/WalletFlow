import { create } from 'zustand';
import { upsertUserProfile, fetchUserProfile } from '../database/userRepo';

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
      const data = fetchUserProfile();
      if (data) {
        set({
          profile: {
            name: data.name,
            email: data.email,
            avatarUri: data.avatarUri,
          },
          preferences: {
            biometricLogin: data.biometricLogin === 1,
            pushNotifications: data.pushNotifications === 1,
          },
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  updateProfile: async (updates) => {
    const newProfile = { ...get().profile, ...updates };
    set({ profile: newProfile });
    
    // Save to DB
    const { profile, preferences } = get();
    upsertUserProfile({
      id: 'default',
      name: profile.name,
      email: profile.email,
      avatarUri: profile.avatarUri,
      biometricLogin: preferences.biometricLogin ? 1 : 0,
      pushNotifications: preferences.pushNotifications ? 1 : 0,
    });
  },

  updatePreferences: async (updates) => {
    const newPrefs = { ...get().preferences, ...updates };
    set({ preferences: newPrefs });
    
    // Save to DB
    const { profile, preferences } = get();
    upsertUserProfile({
      id: 'default',
      name: profile.name,
      email: profile.email,
      avatarUri: profile.avatarUri,
      biometricLogin: preferences.biometricLogin ? 1 : 0,
      pushNotifications: preferences.pushNotifications ? 1 : 0,
    });
  },
}));
