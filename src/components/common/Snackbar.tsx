import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarConfig {
  message: string;
  type?: SnackbarType;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface SnackbarContextType {
  showSnackbar: (config: SnackbarConfig) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

const TYPE_CONFIG: Record<SnackbarType, { icon: keyof typeof Ionicons.glyphMap; bg: string; accent: string }> = {
  success: { icon: 'checkmark-circle', bg: '#065F46', accent: '#10B981' },
  error: { icon: 'close-circle', bg: '#7F1D1D', accent: '#EF4444' },
  info: { icon: 'information-circle', bg: '#1E3A5F', accent: '#3B82F6' },
  warning: { icon: 'alert-circle', bg: '#78350F', accent: '#F59E0B' },
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const [config, setConfig] = useState<SnackbarConfig | null>(null);
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    translateY.value = withTiming(-120, { duration: 300, easing: Easing.bezier(0.4, 0, 1, 1) });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setConfig)(null);
    });
  }, [translateY, opacity]);

  const showSnackbar = useCallback(
    (newConfig: SnackbarConfig) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setConfig(newConfig);

      translateY.value = -120;
      opacity.value = 0;

      translateY.value = withTiming(0, { duration: 400, easing: Easing.bezier(0, 0, 0.2, 1) });
      opacity.value = withTiming(1, { duration: 400 });

      const duration = newConfig.duration ?? 3000;
      timeoutRef.current = setTimeout(() => {
        hide();
      }, duration);
    },
    [translateY, opacity, hide],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const type = config?.type ?? 'success';
  const { icon, bg, accent } = TYPE_CONFIG[type];

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {config && (
        <Animated.View
          style={[
            styles.container,
            { top: insets.top + 12, backgroundColor: bg, borderLeftColor: accent },
            animatedStyle,
          ]}
        >
          <Ionicons name={icon} size={22} color={accent} style={styles.icon} />
          <Text style={styles.message} numberOfLines={2}>
            {config.message}
          </Text>
          {config.actionLabel && (
            <TouchableOpacity
              onPress={() => {
                config.onAction?.();
                hide();
              }}
            >
              <Text style={[styles.actionText, { color: accent }]}>{config.actionLabel}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 9999,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 12,
    textTransform: 'uppercase',
  },
});
