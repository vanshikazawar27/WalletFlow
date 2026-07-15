import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../theme/ThemeProvider';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Take Control of Your Money',
    description: 'Track your expenses, set budgets, and achieve your financial goals with ease.',
    icon: 'wallet-outline',
  },
  {
    id: '2',
    title: 'Track Every Expense',
    description: 'Log every transaction effortlessly and see exactly where your money goes.',
    icon: 'pie-chart-outline',
  },
  {
    id: '3',
    title: 'AI Helps You Save More',
    description: 'Get personalized insights and tips from our AI to optimize your savings.',
    icon: 'sparkles-outline',
  },
];

export const OnboardingScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
          <Ionicons name={item.icon as any} size={80} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Skip Button */}
        <View style={styles.header}>
          {currentIndex < SLIDES.length - 1 && (
            <TouchableOpacity onPress={handleSkip}>
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
        />

        {/* Footer */}
        <View style={styles.footer}>
          {/* Pagination Indicators */}
          <View style={styles.indicatorContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentIndex === index
                    ? [styles.activeIndicator, { backgroundColor: colors.primary }]
                    : { backgroundColor: colors.border },
                ]}
              />
            ))}
          </View>

          {/* Action Button */}
          <Button
            title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            style={styles.actionButton}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 24,
  },
  actionButton: {
    width: '100%',
  },
});
