import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useCategoryStore } from './src/store/categoryStore';
import { useTransactionStore } from './src/store/transactionStore';

export default function App() {
  useEffect(() => {
    useCategoryStore.getState().loadCategories();
    useTransactionStore.getState().loadTransactions();
  }, []);
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
