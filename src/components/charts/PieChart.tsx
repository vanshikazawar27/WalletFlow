// src/components/charts/PieChart.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme/ThemeProvider';

interface PieDataItem {
  name: string;
  amount: number;
  color: string;
}

interface PieChartProps {
  data: PieDataItem[];
  title?: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const { colors } = useTheme();
  const chartData = data.map(item => ({
    name: item.name,
    amount: item.amount,
    color: item.color,
    legendFontColor: colors.textPrimary,
    legendFontSize: 12,
  }));

  return (
    <View style={{ alignItems: 'center' }}>
      {title && <Text style={{ color: colors.textPrimary, marginBottom: 8 }}>{title}</Text>}
      <RNPieChart
        data={chartData}
        width={300}
        height={220}
        chartConfig={{
          color: () => colors.primary,
          labelColor: () => colors.textPrimary,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};
