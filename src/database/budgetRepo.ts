import { db } from './db';
import { Budget } from '../types/budget';

export const upsertBudget = (budget: Budget) => {
  db.runSync(
    `INSERT OR REPLACE INTO budgets (id, month, amount, categoryId)
     VALUES (?, ?, ?, ?)`,
    [
      budget.id,
      budget.month,
      budget.amount,
      budget.categoryId || null,
    ]
  );
};

export const fetchAllBudgets = (): Budget[] => {
  return db.getAllSync<Budget>(`SELECT * FROM budgets`);
};
