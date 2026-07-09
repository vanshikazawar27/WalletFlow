import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { Card } from '../common/Card';

interface SummaryCardProps {
  type: 'income' | 'expense';
  amount: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ type, amount }) => {
  const { colors } = useTheme();
  
  const isIncome = type === 'income';
  const color = isIncome ? colors.income : colors.expense;
  const icon = isIncome ? 'arrow-down-circle' : 'arrow-up-circle';
  const label = isIncome ? 'Income' : 'Expense';

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[styles.amount, { color: colors.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit>
        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginVertical: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
