import { create } from 'zustand';
import { insertTransaction, updateTransaction as dbUpdateTransaction, deleteTransaction as dbDeleteTransaction, fetchAllTransactions } from '../database/transactionRepo';
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
      const parsed = fetchAllTransactions();
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
    insertTransaction(newTransaction);
    set(state => ({ transactions: [newTransaction, ...state.transactions] }));
  },

  updateTransaction: async (id, payload) => {
    const txn = get().transactions.find(t => t.id === id);
    if (!txn) return;
    const updatedTxn = { ...txn, ...payload, updatedAt: new Date().toISOString() };
    dbUpdateTransaction(updatedTxn);
    set(state => ({
      transactions: state.transactions.map(t => (t.id === id ? updatedTxn : t)),
    }));
  },

  deleteTransaction: async (id) => {
    dbDeleteTransaction(id);
    set(state => ({
      transactions: state.transactions.filter(txn => txn.id !== id),
    }));
  },

  getTransactionById: (id) => {
    return get().transactions.find(txn => txn.id === id);
  },
}));
