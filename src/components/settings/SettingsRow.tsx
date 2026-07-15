import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Animated as RNAnimated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  isLast?: boolean;
  isDestructive?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  isToggle = false,
  toggleValue = false,
  onToggle,
  isLast = false,
  isDestructive = false,
}) => {
  const { colors, theme } = useTheme();
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;

  const resolvedIconColor = isDestructive
    ? colors.expense
    : iconColor || colors.primary;

  const handlePressIn = () => {
    RNAnimated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    RNAnimated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const content = (
    <RNAnimated.View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* Icon Container */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${resolvedIconColor}18` },
        ]}
      >
        <Ionicons name={icon} size={20} color={resolvedIconColor} />
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            { color: isDestructive ? colors.expense : colors.textPrimary },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Accessory */}
      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{
            false: theme === 'dark' ? '#3A3A4A' : '#E0E0E0',
            true: `${colors.primary}80`,
          }}
          thumbColor={toggleValue ? colors.primary : '#F4F3F4'}
          ios_backgroundColor={theme === 'dark' ? '#3A3A4A' : '#E0E0E0'}
          style={Platform.OS === 'ios' ? { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] } : undefined}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      )}
    </RNAnimated.View>
  );

  if (isToggle) {
    return content;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
