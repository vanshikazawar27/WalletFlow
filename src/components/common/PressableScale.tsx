import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface PressableScaleProps {
  children: React.ReactNode;
  onPress?: () => void;
  scaleDown?: number;
  style?: ViewStyle;
  disabled?: boolean;
}

/**
 * A wrapper that applies a subtle scale-down animation on press.
 * Use this around Cards, Buttons, or any touchable surface for a premium feel.
 */
export const PressableScale: React.FC<PressableScaleProps> = ({
  children,
  onPress,
  scaleDown = 0.97,
  style,
  disabled = false,
}) => {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(scaleDown, {
        damping: 15,
        stiffness: 400,
      });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 400,
      });
    })
    .onEnd(() => {
      if (onPress) {
        onPress();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
