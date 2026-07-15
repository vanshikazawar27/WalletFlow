import { create } from 'zustand';
import { insertCategory, deleteCategory as dbDeleteCategory, fetchAllCategories } from '../database/categoryRepo';
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
      const stored = fetchAllCategories();
      if (stored && stored.length > 0) {
        set({ categories: stored, isLoading: false });
      } else {
        // Map DEFAULT_CATEGORIES from transaction types to the local Category type
        const defaults: Category[] = DEFAULT_CATEGORIES.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.iconName,
          color: cat.color,
          type: cat.type
        }));
        defaults.forEach(insertCategory);
        set({ categories: defaults, isLoading: false });
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
    insertCategory(newCat);
    set(state => ({ categories: [newCat, ...state.categories] }));
  },
  updateCategory: async (id, updates) => {
    const cat = get().categories.find(c => c.id === id);
    if (!cat) return;
    const updatedCat = { ...cat, ...updates };
    insertCategory(updatedCat); // insert OR replace
    set(state => ({
      categories: state.categories.map(c => c.id === id ? updatedCat : c),
    }));
  },
  deleteCategory: async (id) => {
    dbDeleteCategory(id);
    set(state => ({ categories: state.categories.filter(c => c.id !== id) }));
  },
  getCategoryById: (id) => get().categories.find(c => c.id === id),
}));
