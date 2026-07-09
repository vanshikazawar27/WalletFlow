import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Card } from '../common/Card';

interface BudgetProgressProps {
  totalBudget: number;
  spentAmount: number;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({ totalBudget, spentAmount }) => {
  const { colors } = useTheme();
  
  const percentage = Math.min((spentAmount / totalBudget) * 100, 100);
  const remaining = Math.max(totalBudget - spentAmount, 0);
  
  // Determine color based on how much is spent
  let progressColor = colors.primary;
  if (percentage > 90) progressColor = colors.expense;
  else if (percentage > 75) progressColor = colors.warning;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Monthly Budget</Text>
        <Text style={[styles.percentage, { color: progressColor }]}>{percentage.toFixed(0)}%</Text>
      </View>
      
      <View style={styles.amountsRow}>
        <Text style={[styles.spentText, { color: colors.textSecondary }]}>
          Spent: <Text style={[styles.amountValue, { color: colors.textPrimary }]}>${spentAmount.toLocaleString()}</Text>
        </Text>
        <Text style={[styles.remainingText, { color: colors.textSecondary }]}>
          Left: <Text style={[styles.amountValue, { color: colors.textPrimary }]}>${remaining.toLocaleString()}</Text>
        </Text>
      </View>

      <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${percentage}%`, 
              backgroundColor: progressColor 
            }
          ]} 
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  spentText: {
    fontSize: 14,
  },
  remainingText: {
    fontSize: 14,
  },
  amountValue: {
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
});
