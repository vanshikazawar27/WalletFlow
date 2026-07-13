import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../types/category';
import { DEFAULT_CATEGORIES } from '../types/transaction';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  loadCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem('categories');
      if (stored) {
        set({ categories: JSON.parse(stored), isLoading: false });
      } else {
        // Map DEFAULT_CATEGORIES from transaction types to the local Category type
        const defaults: Category[] = DEFAULT_CATEGORIES.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.iconName,
          color: cat.color,
          type: cat.type
        }));
        set({ categories: defaults, isLoading: false });
        await AsyncStorage.setItem('categories', JSON.stringify(defaults));
      }
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },
  addCategory: async (cat) => {
    const newCat: Category = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
      ...cat,
    };
    set(state => ({ categories: [newCat, ...state.categories] }));
    await AsyncStorage.setItem('categories', JSON.stringify(get().categories));
  },
  updateCategory: async (id, updates) => {
    set(state => ({
      categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
    await AsyncStorage.setItem('categories', JSON.stringify(get().categories));
  },
  deleteCategory: async (id) => {
    set(state => ({ categories: state.categories.filter(c => c.id !== id) }));
    await AsyncStorage.setItem('categories', JSON.stringify(get().categories));
  },
  getCategoryById: (id) => get().categories.find(c => c.id === id),
}));
