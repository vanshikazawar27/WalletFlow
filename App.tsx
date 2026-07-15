import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useCategoryStore } from './src/store/categoryStore';
import { useTransactionStore } from './src/store/transactionStore';
import { useBudgetStore } from './src/store/budgetStore';
import { useUserStore } from './src/store/userStore';
import { runMigrations } from './src/database/db';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Run SQLite migrations to ensure tables exist
        runMigrations();

        // Load data into Zustand stores from SQLite
        await Promise.all([
          useCategoryStore.getState().loadCategories(),
          useTransactionStore.getState().loadTransactions(),
          useBudgetStore.getState().loadBudgets(),
          useUserStore.getState().loadUser(),
        ]);
      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
