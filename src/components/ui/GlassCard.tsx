// src/components/ui/GlassCard.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { BlurView } from '@react-native-community/blur';

/**
 * GlassCard provides a semi‑transparent, blurred background that works on both iOS
 * (using BlurView) and Android (fallback to a translucent view). It accepts any
 * children to render inside the card.
 */
export const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={12}
          reducedTransparencyFallbackColor={colors.card}
        />
      ) : (
        // Android: use a semi‑transparent background color
        <View style={[StyleSheet.absoluteFill, { backgroundColor: `${colors.card}AA` }]} />
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
