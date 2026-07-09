import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useTheme } from '../../theme/ThemeProvider';
import { BalanceCard } from '../../components/dashboard/BalanceCard';
import { SummaryCard } from '../../components/dashboard/SummaryCard';
import { BudgetProgress } from '../../components/dashboard/BudgetProgress';
import { TransactionItem, Transaction } from '../../components/dashboard/TransactionItem';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Groceries (Whole Foods)', amount: 124.50, date: 'Today', category: 'Food', type: 'expense', iconName: 'cart-outline' },
  { id: '2', title: 'Freelance Design', amount: 850.00, date: 'Yesterday', category: 'Income', type: 'income', iconName: 'cash-outline' },
  { id: '3', title: 'Netflix Subscription', amount: 15.99, date: 'Mar 15', category: 'Entertainment', type: 'expense', iconName: 'film-outline' },
  { id: '4', title: 'Uber Ride', amount: 24.30, date: 'Mar 12', category: 'Transport', type: 'expense', iconName: 'car-outline' },
];

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
        
        {/* Recent Transactions Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Transactions</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {DUMMY_TRANSACTIONS.map(tx => (
            <TransactionItem key={tx.id} transaction={tx} />
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
