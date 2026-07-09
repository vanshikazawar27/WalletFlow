import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useTheme } from '../../theme/ThemeProvider';

export const TransactionsScreen = () => {
  const { colors } = useTheme();

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={[styles.text, { color: colors.textPrimary }]}>Transactions Screen</Text>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
