import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { TransactionsScreen } from '../screens/Transactions/TransactionsScreen';
import { AnalyticsScreen } from '../screens/Analytics/AnalyticsScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }: any) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.customButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export const TabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          elevation: 0,
          backgroundColor: colors.card,
          borderRadius: 24,
          height: 72,
          borderTopWidth: 0,
          shadowColor: colors.textPrimary,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
      
      {/* Floating Action Button (Center) */}
      <Tab.Screen
        name="AddTransaction"
        component={HomeScreen} // Placeholder, should open modal
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add" size={32} color="#FFFFFF" />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            // TODO: Open Add Transaction Modal
            console.log("Add transaction pressed");
          },
        })}
      />

      <Tab.Screen
        name="AnalyticsTab"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'pie-chart' : 'pie-chart-outline'}
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
