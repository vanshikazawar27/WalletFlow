import { db } from './db';
import { Transaction } from '../types/transaction';

export const insertTransaction = (transaction: Transaction) => {
  db.runSync(
    `INSERT INTO transactions (id, title, amount, type, category, date, notes, iconName, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      transaction.id,
      transaction.title,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.date,
      transaction.notes || null,
      transaction.iconName,
      transaction.createdAt,
      transaction.updatedAt,
    ]
  );
};

export const updateTransaction = (transaction: Transaction) => {
  db.runSync(
    `UPDATE transactions SET title = ?, amount = ?, type = ?, category = ?, date = ?, notes = ?, iconName = ?, updatedAt = ? WHERE id = ?`,
    [
      transaction.title,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.date,
      transaction.notes || null,
      transaction.iconName,
      transaction.updatedAt,
      transaction.id,
    ]
  );
};

export const deleteTransaction = (id: string) => {
  db.runSync(`DELETE FROM transactions WHERE id = ?`, [id]);
};

export const fetchAllTransactions = (): Transaction[] => {
  return db.getAllSync<Transaction>(`SELECT * FROM transactions ORDER BY date DESC, createdAt DESC`);
};
