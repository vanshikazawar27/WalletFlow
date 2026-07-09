import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useTheme } from '../../theme/ThemeProvider';
import { BalanceCard } from '../../components/dashboard/BalanceCard';
import { SummaryCard } from '../../components/dashboard/SummaryCard';
import { BudgetProgress } from '../../components/dashboard/BudgetProgress';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = () => {
  const { colors } = useTheme();

  // Dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Format current date
  const currentDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <ScreenWrapper>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting},</Text>
            <Text style={[styles.date, { color: colors.textPrimary }]}>{currentDate}</Text>
          </View>
          <View style={[styles.profileAvatar, { backgroundColor: colors.card }]}>
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
          </View>
        </View>

        {/* Balance Section */}
        <BalanceCard balance={12450.75} />

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <SummaryCard type="income" amount={4500.00} />
          <View style={styles.spacer} />
          <SummaryCard type="expense" amount={1250.25} />
        </View>

        {/* Budget Section */}
        <BudgetProgress totalBudget={3000} spentAmount={1250.25} />
        
        {/* Temporary Spacer for Bottom Nav */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  spacer: {
    width: 16,
  },
});
