import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useTheme } from '../../theme/ThemeProvider';
import { LineChart } from '../../components/charts/LineChart';
import { PieChart } from '../../components/charts/PieChart';
import { BarChart } from '../../components/charts/BarChart';
import { useAnalytics } from '../../hooks/useAnalytics';

export const AnalyticsScreen = () => {
  const { colors } = useTheme();
  const {
    largestExpense,
    averageDailySpending,
    spendingTrend,
    categoryBreakdown,
    incomeVsExpense,
  } = useAnalytics();

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Mini cards */}
        <View style={styles.cardsRow}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Largest Expense</Text>
            <Text style={[styles.cardValue, { color: colors.expense }]}>{`$${largestExpense.amount.toFixed(2)}`}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Avg Daily Spend</Text>
            <Text style={[styles.cardValue, { color: colors.textPrimary }]}>{`$${averageDailySpending.toFixed(2)}`}</Text>
          </View>
        </View>
        {/* Income vs Expense Bar Chart */}
        <BarChart income={incomeVsExpense.income} expense={incomeVsExpense.expense} title="Income vs Expense" />
        {/* Spending Trend Line Chart */}
        <LineChart data={spendingTrend.data} labels={spendingTrend.labels} title="Spending Trend (Daily)" />
        {/* Category Breakdown Pie Chart */}
        <PieChart data={categoryBreakdown} title="Expenses by Category" />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
