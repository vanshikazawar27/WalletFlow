import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, CreateTransactionPayload } from '../types/transaction';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (payload: CreateTransactionPayload) => Promise<void>;
  updateTransaction: (id: string, payload: Partial<CreateTransactionPayload>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionById: (id: string) => Transaction | undefined;
  loadTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  loadTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem('transactions');
      const parsed = stored ? JSON.parse(stored) : [];
      set({ transactions: parsed, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addTransaction: async (payload) => {
    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      ...payload,
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    set(state => ({ transactions: [newTransaction, ...state.transactions] }));
    await AsyncStorage.setItem('transactions', JSON.stringify(get().transactions));
  },

  updateTransaction: async (id, payload) => {
    set(state => ({
      transactions: state.transactions.map(txn =>
        txn.id === id
          ? { ...txn, ...payload, updatedAt: new Date().toISOString() }
          : txn,
      ),
    }));
    await AsyncStorage.setItem('transactions', JSON.stringify(get().transactions));
  },

  deleteTransaction: async (id) => {
    set(state => ({
      transactions: state.transactions.filter(txn => txn.id !== id),
    }));
    await AsyncStorage.setItem('transactions', JSON.stringify(get().transactions));
  },

  getTransactionById: (id) => {
    return get().transactions.find(txn => txn.id === id);
  },
}));
