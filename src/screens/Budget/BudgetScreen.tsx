import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Card } from '../../components/common/Card';
import { BudgetProgress } from '../../components/dashboard/BudgetProgress';
import { useBudgetStore } from '../../store/budgetStore';
import { useCategoryStore } from '../../store/categoryStore';
import { BudgetAlertCard } from '../../components/alerts/BudgetAlertCard';
import { useTransactionStore } from '../../store/transactionStore';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// Schema for validation
const budgetSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

export const BudgetScreen = () => {
  const { colors } = useTheme();
  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const overallPercentage = useBudgetStore(state => state.percentageUsed(currentMonth));
  const budgetStore = useBudgetStore();
  const categoryStore = useCategoryStore();
  const transactionStore = useTransactionStore();

  const overallBudget = budgetStore.getBudgetForMonth(currentMonth);
  const spent = budgetStore.spentForMonth(currentMonth);
  const remaining = budgetStore.remainingForMonth(currentMonth);
  const percentage = budgetStore.percentageUsed(currentMonth);

  // Category budgets
  const categoryBudgets = budgetStore.budgets.filter(
    b => b.month === currentMonth && b.categoryId,
  );

  // Modal state for editing/adding budget
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const defaultValues = {
    amount: overallBudget ? overallBudget.amount : 0,
  };

  const { control, handleSubmit, reset } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues,
  });

  const onSubmit = async (data: BudgetFormValues) => {
    if (editingCategoryId) {
      await budgetStore.setCategoryBudget(currentMonth, editingCategoryId, data.amount);
    } else {
      await budgetStore.setBudget({ month: currentMonth, amount: data.amount });
    }
    setModalVisible(false);
    reset({ amount: data.amount });
  };

  const openEditModal = (categoryId?: string) => {
    setEditingCategoryId(categoryId ?? null);
    if (categoryId) {
      const catBudget = budgetStore.getCategoryBudget(currentMonth, categoryId);
      reset({ amount: catBudget?.amount ?? 0 });
    } else {
      reset({ amount: overallBudget?.amount ?? 0 });
    }
    setModalVisible(true);
  };

  const renderCategoryItem = ({ item }: { item: any }) => {
    const category = categoryStore.categories.find(c => c.id === item.categoryId);
    const spentForCat = transactionStore.transactions
      .filter(t => t.date?.startsWith(currentMonth) && t.category === category?.name)
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);
    const remainingForCat = Math.max(item.amount - spentForCat, 0);
    const percentageForCat = Math.min((spentForCat / item.amount) * 100, 100);
    return (
      <Card style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <Text style={[styles.categoryTitle, { color: colors.textPrimary }]}>{category?.name ?? 'Unknown'}</Text>
          <TouchableOpacity onPress={() => openEditModal(item.categoryId)}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <BudgetProgress totalBudget={item.amount} spentAmount={spentForCat} />
        <View style={styles.amountsRow}>
          <Text style={[styles.amountText, { color: colors.textSecondary }]}>Spent: ${spentForCat.toFixed(2)}</Text>
          <Text style={[styles.amountText, { color: colors.textSecondary }]}>Left: ${remainingForCat.toFixed(2)}</Text>
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ListHeaderComponent={() => (
          <>
            <Card style={styles.overallCard}>
              <View style={styles.overallHeader}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Monthly Budget</Text>
                <TouchableOpacity onPress={() => openEditModal()}>
                  <Ionicons name="create-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <BudgetProgress totalBudget={overallBudget?.amount ?? 0} spentAmount={spent} />
              <View style={styles.amountsRow}>
                <Text style={[styles.amountText, { color: colors.textSecondary }]}>Spent: ${spent.toFixed(2)}</Text>
                <Text style={[styles.amountText, { color: colors.textSecondary }]}>Left: ${remaining.toFixed(2)}</Text>
              </View>
            </Card>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Category Budgets</Text>
          </>
        )}
        data={categoryBudgets}
        keyExtractor={item => item.id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={{ color: colors.textSecondary }}>No category budgets set for this month.</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => openEditModal()}>
              <Text style={{ color: '#fff' }}>Add Overall Budget</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Edit Budget Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>\
              {editingCategoryId ? 'Edit Category Budget' : 'Set Overall Budget'}
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
                  keyboardType="numeric"
                  placeholder="Amount"
                  placeholderTextColor={colors.textSecondary}
                  onBlur={onBlur}
                  onChangeText={txt => onChange(parseFloat(txt) || 0)}
                  value={value?.toString()}
                />
              )}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16 },
  overallCard: { marginBottom: 24 },
  overallHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600' },
  amountsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  amountText: { fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  categoryCard: { marginBottom: 16 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryTitle: { fontSize: 16, fontWeight: '500' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  addButton: { marginTop: 12, backgroundColor: '#4F46E5', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '85%', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelButton: { marginRight: 12 },
  saveButton: { backgroundColor: '#4F46E5', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  buttonText: { color: '#fff' },
});
