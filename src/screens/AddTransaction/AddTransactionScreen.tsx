import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTransactionStore } from '../../store/transactionStore';
import {
  DEFAULT_CATEGORIES,
  getCategoryIcon,
  Category as TransactionCategory,
} from '../../types/transaction';
import { TransactionFormData, transactionSchema } from '../../types/schemas';
import { useCategoryStore } from '../../store/categoryStore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSnackbar } from '../../components/common/Snackbar';

interface AddTransactionScreenProps {
  navigation: any;
  route?: any;
}

export const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const addTransaction = useTransactionStore(state => state.addTransaction);
  const { showSnackbar } = useSnackbar();
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const categories = useCategoryStore(state => state.categories);

  // Filter categories by selected type
  const filteredCategories = categories.filter(
    cat => cat.type === selectedType || cat.type === 'both'
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<TransactionFormData>({
    defaultValues: {
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    addTransaction({
      title: data.title,
      amount: parseFloat(data.amount),
      type: data.type,
      category: data.category,
      date: data.date,
      notes: data.notes || '',
      iconName: categories.find(c => c.name === data.category)?.icon as any || 'ellipse-outline',
    });

    showSnackbar({
      message: `${data.type === 'income' ? 'Income' : 'Expense'} of $${data.amount} added!`,
      type: 'success',
    });
    navigation.goBack();
  };

  const handleTypeToggle = (type: 'income' | 'expense') => {
    setSelectedType(type);
    setValue('type', type);
    setSelectedCategory('');
    setValue('category', '');
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category.name);
    setValue('category', category.name);
  };

  // Custom validation since we aren't using zodResolver (to avoid extra dependency)
  const validateAndSubmit = () => {
    handleSubmit((data) => {
      // Manual Zod validation
      const result = transactionSchema.safeParse(data);
      if (!result.success) {
        const firstError = result.error.issues[0];
        Alert.alert('Validation Error', firstError.message);
        return;
      }
      onSubmit(result.data);
    })();
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Add Transaction</Text>
            <View style={styles.backButton} />
          </Animated.View>

          {/* Type Toggle */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <Card style={styles.typeToggleCard}>
              <View style={styles.typeToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    selectedType === 'expense' && { backgroundColor: colors.expense },
                  ]}
                  onPress={() => handleTypeToggle('expense')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="arrow-up-circle"
                    size={20}
                    color={selectedType === 'expense' ? '#FFF' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      { color: selectedType === 'expense' ? '#FFF' : colors.textSecondary },
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    selectedType === 'income' && { backgroundColor: colors.income },
                  ]}
                  onPress={() => handleTypeToggle('income')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="arrow-down-circle"
                    size={20}
                    color={selectedType === 'income' ? '#FFF' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      { color: selectedType === 'income' ? '#FFF' : colors.textSecondary },
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          {/* Amount */}
          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <Card>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Amount</Text>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.amountRow}>
                    <Text style={[styles.currencySymbol, { color: colors.textPrimary }]}>$</Text>
                    <TextInput
                      style={[styles.amountInput, { color: colors.textPrimary }]}
                      placeholder="0.00"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="decimal-pad"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}
            </Card>
          </Animated.View>

          {/* Title */}
          <Animated.View entering={FadeInDown.duration(400).delay(400)}>
            <Card>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Title</Text>
              <Controller
                control={control}
                name="title"
                rules={{ required: 'Title is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.textInput, { color: colors.textPrimary, borderColor: colors.border }]}
                    placeholder="e.g. Grocery Shopping"
                    placeholderTextColor={colors.textSecondary}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
            </Card>
          </Animated.View>

          {/* Category Selector */}
          <Animated.View entering={FadeInDown.duration(400).delay(500)}>
            <Card>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Category</Text>
              <View style={styles.categoryGrid}>
                {filteredCategories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      { borderColor: colors.border },
                      selectedCategory === cat.name && { backgroundColor: cat.color, borderColor: cat.color },
                    ]}
                    onPress={() => handleCategorySelect(cat)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={(cat.icon as any) || 'pricetag-outline'}
                      size={18}
                      color={selectedCategory === cat.name ? '#FFF' : cat.color}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        { color: selectedCategory === cat.name ? '#FFF' : colors.textPrimary },
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}
            </Card>
          </Animated.View>

          {/* Date */}
          <Animated.View entering={FadeInDown.duration(400).delay(600)}>
            <Card>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Date</Text>
              <Controller
                control={control}
                name="date"
                rules={{ required: 'Date is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.textInput, { color: colors.textPrimary, borderColor: colors.border }]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textSecondary}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
            </Card>
          </Animated.View>

          {/* Notes */}
          <Animated.View entering={FadeInDown.duration(400).delay(700)}>
            <Card>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Notes (Optional)</Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.textInput,
                      styles.notesInput,
                      { color: colors.textPrimary, borderColor: colors.border },
                    ]}
                    placeholder="Add any notes..."
                    placeholderTextColor={colors.textSecondary}
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                )}
              />
            </Card>
          </Animated.View>

          {/* Submit Button */}
          <Animated.View entering={FadeInDown.duration(400).delay(800)}>
            <Button
              title="Save Transaction"
              onPress={validateAndSubmit}
              style={styles.submitButton}
            />
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  typeToggleCard: {
    marginBottom: 0,
  },
  typeToggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    padding: 0,
  },
  textInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  notesInput: {
    minHeight: 80,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 6,
  },
  submitButton: {
    marginTop: 16,
  },
});
