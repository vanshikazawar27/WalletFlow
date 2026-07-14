// Budget store using Zustand
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Budget } from '../types/budget';
import { useTransactionStore } from './transactionStore';

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  loadBudgets: () => Promise<void>;
  setBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  setCategoryBudget: (month: string, categoryId: string, amount: number) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getBudgetForMonth: (month: string) => Budget | undefined;
  getCategoryBudget: (month: string, categoryId: string) => Budget | undefined;
  // derived values for current month
  spentForMonth: (month: string) => number;
  remainingForMonth: (month: string) => number;
  percentageUsed: (month: string) => number;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  isLoading: false,
  error: null,

  loadBudgets: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem('budgets');
      const parsed: Budget[] = stored ? JSON.parse(stored) : [];
      set({ budgets: parsed, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  setBudget: async (budget) => {
    // Ensure a unique id per month (and optional category)
    const id = budget.categoryId ? `${budget.month}-${budget.categoryId}` : budget.month;
    const newBudget: Budget = { ...budget, id };
    set(state => {
      const filtered = state.budgets.filter(b => b.id !== id);
      return { budgets: [...filtered, newBudget] };
    });
    await AsyncStorage.setItem('budgets', JSON.stringify(get().budgets));
  },

  setCategoryBudget: async (month, categoryId, amount) => {
    const id = `${month}-${categoryId}`;
    const existing = get().budgets.find(b => b.id === id);
    const budget: Budget = { id, month, amount, categoryId };
    set(state => {
      const filtered = state.budgets.filter(b => b.id !== id);
      return { budgets: [...filtered, budget] };
    });
    await AsyncStorage.setItem('budgets', JSON.stringify(get().budgets));
  },

  deleteBudget: async (id) => {
    set(state => ({ budgets: state.budgets.filter(b => b.id !== id) }));
    await AsyncStorage.setItem('budgets', JSON.stringify(get().budgets));
  },

  getBudgetForMonth: (month) => {
    return get().budgets.find(b => b.month === month && !b.categoryId);
  },

  getCategoryBudget: (month, categoryId) => {
    return get().budgets.find(b => b.month === month && b.categoryId === categoryId);
  },

  spentForMonth: (month) => {
    const txns = useTransactionStore.getState().transactions;
    const total = txns
      .filter(t => t.date?.startsWith(month)) // assuming Transaction has a date string like YYYY-MM-DD
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);
    return total;
  },

  remainingForMonth: (month) => {
    const budget = get().getBudgetForMonth(month);
    if (!budget) return 0;
    const spent = get().spentForMonth(month);
    return Math.max(budget.amount - spent, 0);
  },

  percentageUsed: (month) => {
    const budget = get().getBudgetForMonth(month);
    if (!budget || budget.amount === 0) return 0;
    const spent = get().spentForMonth(month);
    return (spent / budget.amount) * 100;
  },
}));
