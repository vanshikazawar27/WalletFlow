import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { useTheme } from '../../theme/ThemeProvider';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';

export const SettingsScreen = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const navigation = useNavigation<any>();
  const { profile, preferences, updatePreferences, loadUser, isLoaded } = useUserStore();
  const { biometricEnabled, setBiometricEnabled, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) {
      loadUser();
    }
  }, [isLoaded, loadUser]);

  const handleBiometricToggle = useCallback(
    async (value: boolean) => {
      await setBiometricEnabled(value);
      // We also update userPreferences so it syncs up, though authStore handles the real lock
      updatePreferences({ biometricLogin: value });
    },
    [setBiometricEnabled, updatePreferences],
  );

  const handleNotificationsToggle = useCallback(
    (value: boolean) => {
      updatePreferences({ pushNotifications: value });
    },
    [updatePreferences],
  );

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your data export will be prepared shortly.', [
      { text: 'OK' },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your transactions, budgets, and categories. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Everything', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  // Get initials for avatar
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>
            Settings
          </Text>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <SettingsSection title="">
            <View style={styles.profileCard}>
              <View
                style={[
                  styles.avatarContainer,
                  { backgroundColor: `${colors.primary}20` },
                ]}
              >
                {profile.avatarUri ? (
                  <Ionicons name="person" size={28} color={colors.primary} />
                ) : (
                  <Text style={[styles.avatarInitials, { color: colors.primary }]}>
                    {initials}
                  </Text>
                )}
              </View>
              <View style={styles.profileText}>
                <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                  {profile.name}
                </Text>
                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                  {profile.email}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </View>
          </SettingsSection>
        </Animated.View>

        {/* Account Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <SettingsSection title="Account">
            <SettingsRow
              icon="person-outline"
              title="Edit Profile"
              subtitle="Name, email & avatar"
              onPress={() => navigation.navigate('Profile')}
            />
            <SettingsRow
              icon="grid-outline"
              iconColor="#6366F1"
              title="Manage Categories"
              subtitle="Add, edit or remove"
              onPress={() => navigation.navigate('AddCategory')}
            />
            <SettingsRow
              icon="log-out-outline"
              iconColor="#EF4444"
              title="Log Out"
              subtitle="Sign out of your account"
              onPress={async () => {
                await logout();
              }}
              isLast
            />
          </SettingsSection>
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <SettingsSection title="Preferences">
            <SettingsRow
              icon={theme === 'dark' ? 'moon' : 'sunny-outline'}
              iconColor="#F59E0B"
              title="Dark Mode"
              subtitle={theme === 'dark' ? 'Currently enabled' : 'Currently disabled'}
              isToggle
              toggleValue={theme === 'dark'}
              onToggle={toggleTheme}
            />
            <SettingsRow
              icon="finger-print-outline"
              iconColor="#10B981"
              title="Biometric Login"
              subtitle="Unlock with fingerprint or face"
              isToggle
              toggleValue={biometricEnabled}
              onToggle={handleBiometricToggle}
            />
            <SettingsRow
              icon="notifications-outline"
              iconColor="#EF4444"
              title="Push Notifications"
              subtitle="Budget alerts & reminders"
              isToggle
              toggleValue={preferences.pushNotifications}
              onToggle={handleNotificationsToggle}
              isLast
            />
          </SettingsSection>
        </Animated.View>

        {/* Data Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)}>
          <SettingsSection title="Data">
            <SettingsRow
              icon="download-outline"
              iconColor="#6366F1"
              title="Export Data"
              subtitle="Download as CSV"
              onPress={handleExportData}
            />
            <SettingsRow
              icon="trash-outline"
              title="Clear All Data"
              isDestructive
              onPress={handleClearData}
              isLast
            />
          </SettingsSection>
        </Animated.View>

        {/* About Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(600)}>
          <SettingsSection title="About">
            <SettingsRow
              icon="information-circle-outline"
              iconColor="#3B82F6"
              title="App Version"
              subtitle="1.0.0"
              onPress={() => {}}
            />
            <SettingsRow
              icon="shield-checkmark-outline"
              iconColor="#10B981"
              title="Privacy Policy"
              onPress={() => {}}
            />
            <SettingsRow
              icon="document-text-outline"
              iconColor="#8B5CF6"
              title="Terms of Service"
              onPress={() => {}}
              isLast
            />
          </SettingsSection>
        </Animated.View>

        {/* Footer */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(700)}
          style={styles.footer}
        >
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            WalletFlow v1.0.0
          </Text>
          <Text style={[styles.footerSubtext, { color: colors.textSecondary }]}>
            Made with ❤️ for your finances
          </Text>
        </Animated.View>

        {/* Bottom spacer for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
});
