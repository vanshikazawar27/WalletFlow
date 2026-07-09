import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { Card } from '../common/Card';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  iconName: keyof typeof Ionicons.glyphMap;
}

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { colors } = useTheme();
  
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.textPrimary;
  const amountPrefix = isIncome ? '+' : '-';

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
            <Ionicons name={transaction.iconName} size={24} color={colors.primary} />
          </View>
          <View style={styles.details}>
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
              {transaction.title}
            </Text>
            <Text style={[styles.category, { color: colors.textSecondary }]}>
              {transaction.category}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {amountPrefix}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {transaction.date}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 6,
    borderRadius: 16,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
});
