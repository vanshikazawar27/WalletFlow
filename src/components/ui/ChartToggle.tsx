// src/components/ui/ChartToggle.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ChartToggleProps {
  activeChart: 'trend' | 'category';
  onToggle: (chart: 'trend' | 'category') => void;
}

export const ChartToggle: React.FC<ChartToggleProps> = ({ activeChart, onToggle }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity
        style={[
          styles.button,
          activeChart === 'trend' && { backgroundColor: colors.primary },
        ]}
        onPress={() => onToggle('trend')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.text,
            { color: activeChart === 'trend' ? '#FFFFFF' : colors.textSecondary },
          ]}
        >
          Spending Trend
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          activeChart === 'category' && { backgroundColor: colors.primary },
        ]}
        onPress={() => onToggle('category')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.text,
            { color: activeChart === 'category' ? '#FFFFFF' : colors.textSecondary },
          ]}
        >
          Categories
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
  },
});
