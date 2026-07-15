import { db } from './db';
import { Category } from '../types/category';

export const insertCategory = (category: Category) => {
  db.runSync(
    `INSERT OR REPLACE INTO categories (id, name, iconName, color, type)
     VALUES (?, ?, ?, ?, ?)`,
    [
      category.id,
      category.name,
      category.icon, // map from icon to iconName in db
      category.color,
      category.type,
    ]
  );
};

export const deleteCategory = (id: string) => {
  db.runSync(`DELETE FROM categories WHERE id = ?`, [id]);
};

export const fetchAllCategories = (): Category[] => {
  const rows = db.getAllSync<any>(`SELECT * FROM categories`);
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    icon: row.iconName,
    color: row.color,
    type: row.type,
  }));
};
