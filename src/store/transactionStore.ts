import { create } from 'zustand';
import { Transaction, CreateTransactionPayload } from '../types/transaction';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (payload: CreateTransactionPayload) => void;
  updateTransaction: (id: string, payload: Partial<CreateTransactionPayload>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],

  addTransaction: (payload) => {
    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      ...payload,
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    set(state => ({ transactions: [newTransaction, ...state.transactions] }));
  },

  updateTransaction: (id, payload) => {
    set(state => ({
      transactions: state.transactions.map(txn =>
        txn.id === id
          ? { ...txn, ...payload, updatedAt: new Date().toISOString() }
          : txn,
      ),
    }));
  },

  deleteTransaction: (id) => {
    set(state => ({
      transactions: state.transactions.filter(txn => txn.id !== id),
    }));
  },

  getTransactionById: (id) => {
    return get().transactions.find(txn => txn.id === id);
  },
}));
