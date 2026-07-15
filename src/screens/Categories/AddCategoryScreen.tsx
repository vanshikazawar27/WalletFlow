import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useCategoryStore } from '../../store/categoryStore';
import { Ionicons } from '@expo/vector-icons';

// --- Validation schema ------------------------------------------------------
const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  icon: z.string().min(1, { message: 'Select an icon' }),
  color: z.string().min(1, { message: 'Select a colour' }),
});

type FormValues = z.infer<typeof schema>;

// A small premium colour palette
const COLORS = ['#ff6f61', '#6b5b95', '#88b04b', '#f7cac9', '#92a8d1', '#955251'];

// A set of icons to choose from – feel free to extend
const ICONS = [
  'pricetag-outline',
  'cash-outline',
  'wallet-outline',
  'gift-outline',
  'restaurant-outline',
  'cart-outline',
  'home-outline',
  'fitness-outline',
] as (keyof typeof Ionicons.glyphMap)[];

export const AddCategoryScreen = () => {
  const navigation = useNavigation<any>();
  const addCategory = useCategoryStore(state => state.addCategory);

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', icon: '', color: '' },
  });

  const onSubmit = async (data: FormValues) => {
    await addCategory({ name: data.name, icon: data.icon as any, color: data.color, type: 'expense' });
    navigation.goBack();
  };

  // Helpers for selection UI
  const renderIcon = ({ item }: { item: string }) => (
    <Controller
      control={control}
      name="icon"
      render={({ field: { onChange, value } }) => (
        <TouchableOpacity
          style={[styles.iconItem, value === item && styles.iconSelected]}
          onPress={() => onChange(item)}
        >
          <Ionicons name={item as any} size={28} color={value === item ? '#0066ff' : '#555'} />
        </TouchableOpacity>
      )}
    />
  );

  const renderColor = ({ item }: { item: string }) => (
    <Controller
      control={control}
      name="color"
      render={({ field: { onChange, value } }) => (
        <TouchableOpacity
          style={[styles.colorSwatch, { backgroundColor: item }, value === item && styles.colorSelected]}
          onPress={() => onChange(item)}
        />
      )}
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Category</Text>

      {/* Name input */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Category name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
          </View>
        )}
      />

      {/* Icon picker */}
      <Text style={styles.sectionHeader}>Icon</Text>
      {errors.icon && <Text style={styles.error}>{errors.icon.message}</Text>}
      <FlatList
        data={ICONS}
        renderItem={renderIcon}
        keyExtractor={item => item}
        numColumns={4}
        columnWrapperStyle={styles.iconRow}
        scrollEnabled={false}
      />

      {/* Colour picker */}
      <Text style={styles.sectionHeader}>Colour</Text>
      {errors.color && <Text style={styles.error}>{errors.color.message}</Text>}
      <FlatList
        data={COLORS}
        renderItem={renderColor}
        keyExtractor={item => item}
        numColumns={3}
        columnWrapperStyle={styles.colorRow}
        scrollEnabled={false}
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitText}>Save Category</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  fieldWrapper: { marginBottom: 16 },
  label: { fontSize: 16, color: '#555', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  error: { color: '#e63946', marginTop: 4 },
  sectionHeader: { fontSize: 18, fontWeight: '500', marginTop: 20, marginBottom: 8, color: '#444' },
  iconRow: { justifyContent: 'space-between', marginBottom: 12 },
  iconItem: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  iconSelected: { borderColor: '#0066ff', backgroundColor: '#e6f0ff' },
  colorRow: { justifyContent: 'space-between', marginBottom: 12 },
  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  colorSelected: { borderColor: '#0066ff', borderWidth: 2 },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#0066ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
