import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useTheme } from '../../theme/ThemeProvider';
import { LineChart } from '../../components/charts/LineChart';
import { PieChart } from '../../components/charts/PieChart';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { ChartToggle } from '../../components/ui/ChartToggle';
import { GlassCard } from '../../components/ui/GlassCard';
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

  const [activeChart, setActiveChart] = React.useState<'trend' | 'category'>('trend');

  const netBalance = incomeVsExpense.income - incomeVsExpense.expense;

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary Header */}
        <View style={styles.summaryContainer}>
          <Text style={[styles.summaryTitle, { color: '#FFFFFF' }]}>Overview</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, { color: colors.income }]}>{`$${incomeVsExpense.income.toFixed(2)}`}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expense</Text>
              <Text style={[styles.summaryValue, { color: colors.expense }]}>{`$${incomeVsExpense.expense.toFixed(2)}`}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Balance</Text>
              <Text style={[styles.summaryValue, { color: netBalance >= 0 ? colors.income : colors.expense }]}>{`$${Math.abs(netBalance).toFixed(2)}`}</Text>
            </View>
          </View>
        </View>

        {/* Chart Toggle */}
        <ChartToggle activeChart={activeChart} onToggle={setActiveChart} />

        {/* Active Chart */}
        <View style={styles.chartContainer}>
          {activeChart === 'trend' ? (
            <LineChart data={spendingTrend.data} labels={spendingTrend.labels} title="Spending Trend (Daily)" />
          ) : (
            <PieChart data={categoryBreakdown} title="Expenses by Category" />
          )}
        </View>

        {/* Mini cards (moved below chart) */}
        <View style={styles.cardsRow}>
          <GlassCard>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Largest Expense</Text>
              <Text style={[styles.cardValue, { color: colors.expense }]}>{`$${largestExpense.amount.toFixed(2)}`}</Text>
            </View>
          </GlassCard>
          <GlassCard>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Avg Daily Spend</Text>
              <Text style={[styles.cardValue, { color: colors.textPrimary }]}>{`$${averageDailySpending.toFixed(2)}`}</Text>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    color: '#E0E7FF', // light indigo tint
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
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
