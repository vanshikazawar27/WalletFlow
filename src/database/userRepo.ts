import { db } from './db';

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatarUri: string | null;
  biometricLogin: number;
  pushNotifications: number;
}

export const upsertUserProfile = (profile: UserProfileData) => {
  db.runSync(
    `INSERT OR REPLACE INTO user_profile (id, name, email, avatarUri, biometricLogin, pushNotifications)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      profile.id,
      profile.name,
      profile.email,
      profile.avatarUri || null,
      profile.biometricLogin,
      profile.pushNotifications,
    ]
  );
};

export const fetchUserProfile = (): UserProfileData | null => {
  const result = db.getAllSync<UserProfileData>(`SELECT * FROM user_profile LIMIT 1`);
  return result.length > 0 ? result[0] : null;
};
