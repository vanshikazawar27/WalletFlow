import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { AddTransactionScreen } from '../screens/AddTransaction/AddTransactionScreen';
import { EditTransactionScreen } from '../screens/EditTransaction/EditTransactionScreen';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import { AddCategoryScreen } from '../screens/Categories/AddCategoryScreen';
import { ProfileScreen } from '../screens/Settings/ProfileScreen';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';
import { useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={TabNavigator} />
    <Stack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{ animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name="EditTransaction"
      component={EditTransactionScreen}
      options={{ animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name="AddCategory"
      component={AddCategoryScreen}
      options={{ animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { isAuthenticated, hasSeenOnboarding, isLoading } = useAuthStore();

  // While loading auth state, render nothing (App.tsx handles the splash)
  if (isLoading) return null;

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
