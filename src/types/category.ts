export type CategoryType = 'income' | 'expense' | 'both';

export interface Category {
  id: string;
  name: string;
  icon: string; // Ionicon name
  color: string; // hex color code e.g. #FF5733
  type: CategoryType;
}
