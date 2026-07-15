import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useTheme } from '../../theme/ThemeProvider';
import { BalanceCard } from '../../components/dashboard/BalanceCard';
import { SummaryCard } from '../../components/dashboard/SummaryCard';
import { useBudgetStore } from '../../store/budgetStore';
import { BudgetAlertCard } from '../../components/alerts/BudgetAlertCard';
import { BudgetProgress } from '../../components/dashboard/BudgetProgress';
import { TransactionItem } from '../../components/dashboard/TransactionItem';
import { Transaction } from '../../types/transaction';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Groceries (Whole Foods)', amount: 124.50, date: 'Today', category: 'Food', type: 'expense', iconName: 'cart-outline', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'Freelance Design', amount: 850.00, date: 'Yesterday', category: 'Income', type: 'income', iconName: 'cash-outline', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'Netflix Subscription', amount: 15.99, date: 'Mar 15', category: 'Entertainment', type: 'expense', iconName: 'film-outline', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', title: 'Uber Ride', amount: 24.30, date: 'Mar 12', category: 'Transport', type: 'expense', iconName: 'car-outline', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  // Dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const currentMonth = new Date().toISOString().slice(0,7);
  const overallPercentage = useBudgetStore(state => state.percentageUsed(currentMonth));

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
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting},</Text>
            <Text style={[styles.date, { color: colors.textPrimary }]}>{currentDate}</Text>
          </View>
          <View style={[styles.profileAvatar, { backgroundColor: colors.card }]}>
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
          </View>
        </Animated.View>
        {overallPercentage >= 80 && (
          <BudgetAlertCard title="Monthly Budget" percentage={overallPercentage} />
        )}

        {/* Balance Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <BalanceCard balance={12450.75} />
        </Animated.View>

        {/* Summary Row */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.summaryRow}>
          <SummaryCard type="income" amount={4500.00} />
          <View style={styles.spacer} />
          <SummaryCard type="expense" amount={1250.25} />
        </Animated.View>

        {/* Budget Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <BudgetProgress totalBudget={3000} spentAmount={1250.25} />
        </Animated.View>
        
        {/* Recent Transactions Header */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)} style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Transactions</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {DUMMY_TRANSACTIONS.map((tx, index) => (
            <Animated.View key={tx.id} entering={FadeInDown.duration(400).delay(600 + (index * 100))}>
              <TransactionItem 
                transaction={tx} 
                onPress={(transaction) => (navigation as any).navigate('EditTransaction', { id: transaction.id })} 
              />
            </Animated.View>
          ))}
        </View>
        
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsList: {
    marginTop: 8,
  },
});
