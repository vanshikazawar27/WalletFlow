import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useTheme } from '../../theme/ThemeProvider';

export const SettingsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={[styles.text, { color: colors.textPrimary }]}>Settings Screen</Text>
      <TouchableOpacity onPress={() => navigation.navigate('AddCategory' as never)} style={styles.button}>
        <Text style={styles.buttonText}>Manage Categories</Text>
      </TouchableOpacity>
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
