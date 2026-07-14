// src/components/charts/LineChart.tsx
import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme/ThemeProvider';

interface LineChartProps {
  data: number[];
  labels: string[];
  title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, labels, title }) => {
  const { colors } = useTheme();
  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    // Use solid color to avoid undefined opacity issues
    color: () => colors.primary,
    labelColor: () => colors.textPrimary,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.secondary,
    },
    decimalPlaces: 0,
    useShadowColorFromDataset: false,
  };

  // Only show a subset of labels if there are too many, to prevent overlap
  const displayLabels = labels.map((label, index) => {
    if (labels.length <= 7) return label;
    const interval = Math.ceil(labels.length / 6);
    return index % interval === 0 ? label : '';
  });

  return (
    <View style={{ alignItems: 'center' }}>
      {title && <Text style={{ color: colors.textPrimary, marginBottom: 8, fontWeight: 'bold' }}>{title}</Text>}
      <RNLineChart
        data={{ labels: displayLabels, datasets: [{ data, color: chartConfig.color, strokeWidth: 3 }] }}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ borderRadius: 16 }}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero
      />
    </View>
  );
};
