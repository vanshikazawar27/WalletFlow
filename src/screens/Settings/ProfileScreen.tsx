import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated as RNAnimated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AnimatedRN, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useTheme } from '../../theme/ThemeProvider';
import { useUserStore } from '../../store/userStore';

export const ProfileScreen = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation();
  const { profile, updateProfile } = useUserStore();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [isSaving, setIsSaving] = useState(false);

  const saveButtonScale = useRef(new RNAnimated.Value(1)).current;

  const hasChanges = name !== profile.name || email !== profile.email;

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation', 'Please enter a valid email address.');
      return;
    }

    setIsSaving(true);

    // Animate the button
    RNAnimated.sequence([
      RNAnimated.spring(saveButtonScale, {
        toValue: 0.92,
        useNativeDriver: true,
        speed: 50,
      }),
      RNAnimated.spring(saveButtonScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();

    await updateProfile({ name: name.trim(), email: email.trim() });

    setIsSaving(false);
    Alert.alert('Saved', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }, [name, email, updateProfile, navigation, saveButtonScale]);

  // Get initials for avatar
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Header */}
          <AnimatedRN.View
            entering={FadeInDown.duration(300).delay(50)}
            style={styles.header}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backButton, { backgroundColor: colors.card }]}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Edit Profile
            </Text>
            <View style={{ width: 40 }} />
          </AnimatedRN.View>

          {/* Avatar Section */}
          <AnimatedRN.View
            entering={FadeInDown.duration(400).delay(150)}
            style={styles.avatarSection}
          >
            <View
              style={[
                styles.avatarLarge,
                { backgroundColor: `${colors.primary}20` },
              ]}
            >
              <Text style={[styles.avatarInitialsLarge, { color: colors.primary }]}>
                {initials}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.changeAvatarButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={[styles.changeAvatarText, { color: colors.primary }]}>
              Change Photo
            </Text>
          </AnimatedRN.View>

          {/* Form Fields */}
          <AnimatedRN.View entering={FadeInDown.duration(400).delay(250)}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              FULL NAME
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
              />
            </View>
          </AnimatedRN.View>

          <AnimatedRN.View entering={FadeInDown.duration(400).delay(350)}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              EMAIL ADDRESS
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </AnimatedRN.View>

          {/* Info Card */}
          <AnimatedRN.View
            entering={FadeInDown.duration(400).delay(450)}
            style={[styles.infoCard, { backgroundColor: `${colors.primary}10` }]}
          >
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.primary}
              style={{ marginRight: 10 }}
            />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Your profile is stored locally on this device. No data is sent to
              any server.
            </Text>
          </AnimatedRN.View>

          {/* Save Button */}
          <AnimatedRN.View entering={FadeInDown.duration(400).delay(550)}>
            <RNAnimated.View style={{ transform: [{ scale: saveButtonScale }] }}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: hasChanges ? colors.primary : `${colors.primary}40`,
                  },
                ]}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={!hasChanges || isSaving}
              >
                <Ionicons
                  name={isSaving ? 'hourglass-outline' : 'checkmark-circle'}
                  size={22}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </RNAnimated.View>
          </AnimatedRN.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialsLarge: {
    fontSize: 36,
    fontWeight: '700',
  },
  changeAvatarButton: {
    position: 'absolute',
    top: 70,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  changeAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 20,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 28,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
