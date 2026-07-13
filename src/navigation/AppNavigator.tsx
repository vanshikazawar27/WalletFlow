import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { AddTransactionScreen } from '../screens/AddTransaction/AddTransactionScreen';
import { EditTransactionScreen } from '../screens/EditTransaction/EditTransactionScreen';
import { CategoriesScreen } from '../screens/Categories/CategoriesScreen';
import { AddCategoryScreen } from '../screens/Categories/AddCategoryScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
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
      <Stack.Screen name="AddCategory" component={AddCategoryScreen} options={{ animation: 'slide_from_bottom' }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};
