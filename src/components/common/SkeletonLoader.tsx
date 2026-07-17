import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';

interface SkeletonLoaderProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width,
  height,
  borderRadius = 12,
  style,
}) => {
  const { colors, theme } = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
      -1,
      true,
    );
  }, [shimmer]);

  const baseColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const highlightColor = theme === 'dark' ? '#334155' : '#F1F5F9';

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 1], [0.4, 1]);
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: baseColor,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

/**
 * Pre-built skeleton patterns for common screen layouts
 */

export const DashboardSkeleton = () => {
  return (
    <View style={skeletonStyles.dashboardContainer}>
      {/* Balance Card Skeleton */}
      <SkeletonLoader width="100%" height={160} borderRadius={20} />

      {/* Summary Row Skeleton */}
      <View style={skeletonStyles.summaryRow}>
        <SkeletonLoader width="48%" height={90} borderRadius={16} />
        <SkeletonLoader width="48%" height={90} borderRadius={16} />
      </View>

      {/* Budget Progress Skeleton */}
      <SkeletonLoader width="100%" height={80} borderRadius={16} style={{ marginTop: 12 }} />

      {/* Section Header Skeleton */}
      <View style={skeletonStyles.sectionHeader}>
        <SkeletonLoader width={160} height={20} borderRadius={8} />
        <SkeletonLoader width={60} height={16} borderRadius={6} />
      </View>

      {/* Transaction Item Skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={skeletonStyles.transactionRow}>
          <SkeletonLoader width={48} height={48} borderRadius={14} />
          <View style={skeletonStyles.transactionText}>
            <SkeletonLoader width="70%" height={16} borderRadius={6} />
            <SkeletonLoader width="40%" height={12} borderRadius={6} style={{ marginTop: 6 }} />
          </View>
          <SkeletonLoader width={60} height={18} borderRadius={6} />
        </View>
      ))}
    </View>
  );
};

export const AnalyticsSkeleton = () => {
  return (
    <View style={skeletonStyles.analyticsContainer}>
      {/* Summary Row */}
      <View style={skeletonStyles.analyticsSummary}>
        <SkeletonLoader width="30%" height={50} borderRadius={10} />
        <SkeletonLoader width="30%" height={50} borderRadius={10} />
        <SkeletonLoader width="30%" height={50} borderRadius={10} />
      </View>

      {/* Chart Toggle */}
      <SkeletonLoader width="60%" height={40} borderRadius={20} style={{ alignSelf: 'center', marginVertical: 16 }} />

      {/* Chart Area */}
      <SkeletonLoader width="100%" height={220} borderRadius={16} />

      {/* Mini Cards */}
      <View style={skeletonStyles.miniCardRow}>
        <SkeletonLoader width="48%" height={90} borderRadius={14} />
        <SkeletonLoader width="48%" height={90} borderRadius={14} />
      </View>
    </View>
  );
};

export const TransactionListSkeleton = () => {
  return (
    <View style={skeletonStyles.transactionsContainer}>
      {/* Search Bar */}
      <SkeletonLoader width="100%" height={44} borderRadius={12} />

      {/* Filter Buttons */}
      <View style={skeletonStyles.filterRow}>
        <SkeletonLoader width={60} height={32} borderRadius={8} />
        <SkeletonLoader width={70} height={32} borderRadius={8} />
        <SkeletonLoader width={70} height={32} borderRadius={8} />
      </View>

      {/* Transaction Items */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={skeletonStyles.transactionRow}>
          <SkeletonLoader width={48} height={48} borderRadius={14} />
          <View style={skeletonStyles.transactionText}>
            <SkeletonLoader width="70%" height={16} borderRadius={6} />
            <SkeletonLoader width="40%" height={12} borderRadius={6} style={{ marginTop: 6 }} />
          </View>
          <SkeletonLoader width={60} height={18} borderRadius={6} />
        </View>
      ))}
    </View>
  );
};

const skeletonStyles = StyleSheet.create({
  dashboardContainer: {
    padding: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 16,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionText: {
    flex: 1,
    marginLeft: 12,
  },
  analyticsContainer: {
    padding: 16,
  },
  analyticsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  miniCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  transactionsContainer: {
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 20,
  },
});
