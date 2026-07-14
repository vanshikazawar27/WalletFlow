import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  title: string;
  percentage: number;
  onDismiss?: () => void;
};

export const BudgetAlertCard = ({ title, percentage, onDismiss }: Props) => {
  const { colors } = useTheme();
  const isOver = percentage >= 100;
  const iconName = isOver ? 'alert-circle' : 'warning';
  const iconColor = isOver ? '#ff4d4d' : '#ffbf00';

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Ionicons name={iconName} size={24} color={iconColor} />
        <Text style={[styles.text, { color: colors.textPrimary }]}>
          {title} – {percentage.toFixed(0)}% used
        </Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss}>
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    marginLeft: 8,
  },
});
