import { Ionicons } from '@expo/vector-icons';

/** Core transaction type used throughout the app */
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // ISO string
  notes?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/** Payload for creating a new transaction (id and timestamps auto-generated) */
export type CreateTransactionPayload = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

/** Payload for updating an existing transaction */
export type UpdateTransactionPayload = Partial<Omit<Transaction, 'id' | 'createdAt'>> & { updatedAt: string };

/** Default categories with their icons and colors */
export interface Category {
  id: string;
  name: string;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
  type: 'income' | 'expense' | 'both';
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1',  name: 'Food',          iconName: 'fast-food-outline',    color: '#F97316', type: 'expense' },
  { id: '2',  name: 'Transport',     iconName: 'car-outline',          color: '#3B82F6', type: 'expense' },
  { id: '3',  name: 'Shopping',      iconName: 'bag-outline',          color: '#EC4899', type: 'expense' },
  { id: '4',  name: 'Bills',         iconName: 'receipt-outline',      color: '#8B5CF6', type: 'expense' },
  { id: '5',  name: 'Entertainment', iconName: 'film-outline',         color: '#EF4444', type: 'expense' },
  { id: '6',  name: 'Health',        iconName: 'medical-outline',      color: '#14B8A6', type: 'expense' },
  { id: '7',  name: 'Education',     iconName: 'school-outline',       color: '#6366F1', type: 'expense' },
  { id: '8',  name: 'Salary',        iconName: 'wallet-outline',       color: '#22C55E', type: 'income' },
  { id: '9',  name: 'Freelance',     iconName: 'laptop-outline',       color: '#10B981', type: 'income' },
  { id: '10', name: 'Investment',    iconName: 'trending-up-outline',  color: '#0EA5E9', type: 'income' },
];

/** Maps category name to its icon */
export const getCategoryIcon = (categoryName: string): keyof typeof Ionicons.glyphMap => {
  const category = DEFAULT_CATEGORIES.find(c => c.name === categoryName);
  return category?.iconName ?? 'ellipse-outline';
};

/** Maps category name to its color */
export const getCategoryColor = (categoryName: string): string => {
  const category = DEFAULT_CATEGORIES.find(c => c.name === categoryName);
  return category?.color ?? '#6B7280';
};
