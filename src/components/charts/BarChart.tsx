// src/components/charts/BarChart.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart as RNBarChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme/ThemeProvider';

interface BarChartProps {
  income: number;
  expense: number;
  title?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ income, expense, title }) => {
  const { colors } = useTheme();
  const data = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [income, expense],
        // Use solid fallback colors to avoid undefined values
        colors: [() => colors.income ?? colors.primary, () => colors.expense ?? colors.primary],
      },
    ],
  };
  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    // Solid color for bars
    color: () => colors.textPrimary,
    labelColor: () => colors.textPrimary,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={{ alignItems: 'center' }}>
      {title && <Text style={{ color: colors.textPrimary, marginBottom: 8 }}>{title}</Text>}
      <RNBarChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero
        showValuesOnTopOfBars
        style={{ borderRadius: 16 }}
        yAxisLabel=""
        yAxisSuffix=""
      />
    </View>
  );
};
