// src/hooks/useAnalytics.ts
import { useMemo } from 'react';
import { useTransactionStore } from '../store/transactionStore';
import { useCategoryStore } from '../store/categoryStore';
import { Transaction } from '../types/transaction';

interface SpendingTrend {
  labels: string[]; // e.g., dates
  data: number[];   // expense per day
}

export const useAnalytics = () => {
  const transactions = useTransactionStore(state => state.transactions);
  const categories = useCategoryStore(state => state.categories);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const monthTxns = useMemo(
    () => transactions.filter(t => t.date.startsWith(currentMonth)),
    [transactions, currentMonth]
  );

  const largestExpense = useMemo(() => {
    const expenses = monthTxns.filter(t => t.type === 'expense');
    return expenses.reduce(
      (prev, cur) => (cur.amount > prev.amount ? cur : prev),
      { amount: 0 } as Transaction
    );
  }, [monthTxns]);

  const averageDailySpending = useMemo(() => {
    const totalExpense = monthTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const daysInMonth = new Date(
      parseInt(currentMonth.slice(0, 4)),
      parseInt(currentMonth.slice(5, 7)),
      0
    ).getDate();
    return daysInMonth ? totalExpense / daysInMonth : 0;
  }, [monthTxns, currentMonth]);

  const spendingTrend = useMemo<SpendingTrend>(() => {
    const days = new Date(
      parseInt(currentMonth.slice(0, 4)),
      parseInt(currentMonth.slice(5, 7)),
      0
    ).getDate();
    const labels: string[] = [];
    const data: number[] = [];
    for (let d = 1; d <= days; d++) {
      const dayStr = d.toString().padStart(2, '0');
      labels.push(dayStr);
      const dayDate = `${currentMonth}-${dayStr}`;
      const dayExpense = monthTxns
        .filter(t => t.type === 'expense' && t.date === dayDate)
        .reduce((sum, t) => sum + t.amount, 0);
      data.push(dayExpense);
    }
    return { labels, data };
  }, [monthTxns, currentMonth]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    monthTxns
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = categories.find(c => c.id === t.category);
        const name = cat?.name ?? 'Other';
        map[name] = (map[name] ?? 0) + t.amount;
      });
    return Object.entries(map).map(([name, amount]) => {
      const cat = categories.find(c => c.name === name);
      return { name, amount, color: cat?.color ?? '#6B7280' };
    });
  }, [monthTxns, categories]);

  const incomeVsExpense = useMemo(() => {
    const income = monthTxns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  }, [monthTxns]);

  return {
    largestExpense,
    averageDailySpending,
    spendingTrend,
    categoryBreakdown,
    incomeVsExpense,
  };
};
